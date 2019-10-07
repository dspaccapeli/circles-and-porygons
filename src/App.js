import React, { Component } from 'react';
import './App.css';
import { List, updateIn, remove } from 'immutable';

import Sidebar from "./Sidebar";
import Drawing from "./Drawing";

import relativeCoordinates from "./utils/relativeCoordinates";
import processPoints from "./utils/processPoints";

import * as handTrack from 'handtrackjs';


class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            lines: new List(),
            isDrawing: false,
            strokeColor: '#4284f5',
            strokeWidth: 5,
            colors: new List(),
            widths: new List(),
        };

        this.model = null;
        this.videoOn = false;

        this.canvasRef = React.createRef();
        this.videoRef = React.createRef();
        this.webcamCanvasRef = React.createRef();

        this.context = null;

        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
    }

    componentDidMount() {
        document.addEventListener("mouseup", this.handleMouseUp);
        document.addEventListener("keydown", this.handleKeyDown);
        document.addEventListener("keyup", this.handleKeyUp);

        /*
        handTrack.load().then(_model => {
            this.model = _model;
            console.log("loaded")
        });
        */
    }

    componentWillUnmount() {
        document.removeEventListener("mouseup", this.handleMouseUp);
        document.removeEventListener("keydown", this.handleKeyDown);
        document.removeEventListener("keyup", this.handleKeyUp);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.context = this.webcamCanvasRef.current.getContext('2d');
    }

    toggleHandTracking = () => {
        if (!this.videoOn) {
            // updateNote.innerText = "Starting video"
            this.startHandTracking();
        } else {
            // updateNote.innerText = "Stopping video"
            handTrack.stopVideo(this.videoRef.current).then();
            this.videoOn = false;
            // updateNote.innerText = "Video stopped"
        }
    };

    startHandTracking = () => {
        handTrack.startVideo(this.videoRef.current).then( status => {
            console.log("video started", status);
            let self = this;
            if (status) {
                //updateNote.innerText = "Video started. Now tracking"
                self.videoOn = true;
                self.runDetection();
            } else {
                //updateNote.innerText = "Please enable video"
            }
        });
    };

    runDetection = () => {
        this.model.detect(this.videoRef.current).then(predictions => {
            console.log("Predictions: ", predictions);
            this.model.renderPredictions(
                predictions,
                this.webcamCanvasRef.current,
                this.webcamCanvasRef.current.getContext('2d'),
                this.videoRef.current);

            if (this.videoOn) {
                requestAnimationFrame(this.runDetection);
            }
        });
    };

    handleMouseDown(mouseEvent) {
        if (mouseEvent.button !== 0) {
            return;
        }

        const point = relativeCoordinates(mouseEvent, this.canvasRef.current);

        this.setState(prevState => ({
            lines: prevState.lines.push(new List([point])),
            colors: prevState.colors.push(prevState.strokeColor),
            widths: prevState.widths.push(prevState.strokeWidth),
            isDrawing: true
        }));
    }

    handleMouseMove(mouseEvent) {
        if (!this.state.isDrawing) {
            return;
        }

        const point = relativeCoordinates(mouseEvent, this.canvasRef.current);

        this.setState(prevState =>  ({
            lines: updateIn(prevState.lines, [prevState.lines.size - 1], line => line.push(point)),
        }));
    }

    handleMouseUp() {
        if (this.state.lines.last()) {
            let processedLine = processPoints(this.state.lines.last());

            if (!processedLine.isEmpty()) {
                this.setState(prevState => ({
                    lines: updateIn(prevState.lines, [prevState.lines.size - 1], _ => processedLine),
                    isDrawing: false
                }));
            } else {
                this.setState(prevState => ({
                    lines: remove(prevState.lines, prevState.lines.size - 1),
                    colors: remove(prevState.colors, prevState.colors.size - 1),
                    widths: remove(prevState.widths, prevState.widths.size - 1),
                    isDrawing: false
                }));
            }
        }
    }

    handleKeyDown = (keyEvent) => {
        if(keyEvent.code === "KeyD"){
            console.log("down D")
        }
    };

    handleKeyUp = (keyEvent) => {
        if(keyEvent.code === "KeyD"){
            console.log("up D")
        }
    };

    clearCanvas = () => {
        this.setState({
            lines: new List(),
            colors: new List(),
            widths: new List()
        });
    };

    changeColor = (color) => {
        this.setState({
            strokeColor: color,
        });
    };

    changeStroke = (width) => {
        this.setState({
            strokeWidth: width,
        });
    };

    render() {
        return (
            <div>
                <Sidebar
                    onColorPicked={this.changeColor}
                    onClearCanvas={this.clearCanvas}
                    onStrokePicked={this.changeStroke}
                    onToggleHandDrawing={this.toggleHandTracking}
                />
                <div
                    className="drawArea"
                    ref={this.canvasRef}
                    onMouseDown={this.handleMouseDown}
                    onMouseMove={this.handleMouseMove}
                >
                    <Drawing
                        lines={this.state.lines}
                        color={this.state.colors}
                        isDrawing={this.state.isDrawing}
                        width={this.state.widths}
                    />
                </div>
                <video className="canvasbox"
                       autoPlay="autoplay"
                       ref={this.videoRef}
                />
                <canvas className="border canvasbox"
                        ref={this.webcamCanvasRef}
                />
            </div>
        );
    }
}

export default App;
