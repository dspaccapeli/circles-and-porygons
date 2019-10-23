import React, { Component } from 'react';

import './App.css';
// import 'bootstrap/dist/css/bootstrap.min.css';

import {List, updateIn, remove, Map} from 'immutable';

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
            videoOn: false,
            modelIsLoading: false,
        };

        this.modelLoaded = false;
        this.detecting = null;

        this.model = null;
        this.modelParams = {
            maxNumBoxes: 1,
            scoreThreshold: 0.7,
        };

        this.currentHandCoordinates = { x: -1, y: -1};
        this.previousHandCoordinates = { x: -1, y: -1};
        this.handDrawing = false;

        this.canvasRef = React.createRef();
        this.videoRef = React.createRef();
        this.webcamCanvasRef = React.createRef();

        this.context = null;

        this.handDrawingScaleFactorX = 1;
        this.handDrawingScaleFactorY = 1;

        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
    }

    componentDidMount() {
        document.addEventListener("mouseup", this.handleMouseUp);
        document.addEventListener("keydown", this.handleKeyDown);
        document.addEventListener("keyup", this.handleKeyUp);
    }

    componentWillUnmount() {
        document.removeEventListener("mouseup", this.handleMouseUp);
        document.removeEventListener("keydown", this.handleKeyDown);
        document.removeEventListener("keyup", this.handleKeyUp);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.webcamCanvasRef.current){
            this.context = this.webcamCanvasRef.current.getContext('2d');

            this.handDrawingScaleFactorX = (this.canvasRef.current.offsetWidth) / this.videoRef.current.offsetWidth;
            this.handDrawingScaleFactorY = this.canvasRef.current.offsetHeight / this.videoRef.current.offsetHeight;
        }
    }

    toggleHandTracking = () => {
        if (!this.model && !this.modelLoaded) {
            this.setState({
                modelIsLoading: true,
            });

            handTrack.load().then(_model => {
                this.model = _model;
                this.model.setModelParameters(this.modelParams);
                this.modelLoaded = true;

                this.switchHandTracking();
            });
        } else {
            this.switchHandTracking();
        }
    };

    switchHandTracking = () => {
        if (!this.state.videoOn) {
            this.modelLoaded = true;

            this.setState({
                modelIsLoading: true,
                videoOn: true,
            }, () => this.startHandTracking());

        } else {
            handTrack.stopVideo(this.videoRef.current).then();
            this.modelLoaded = false;
            this.detecting = null;
            this.setState({
                modelIsLoading: false,
                videoOn: false,
            });
        }
    };

    startHandTracking = () => {
        handTrack.startVideo(this.videoRef.current).then( status => {
            console.log("video started", status);
            let self = this;
            if (status) {
                self.runDetection();
            }
        });
    };

    runDetection = () => {
        if (!this.videoRef.current){
            return;
        }
        this.model.detect(this.videoRef.current).then(predictions => {

            if (!this.webcamCanvasRef.current){
                return;
            }

            this.model.renderPredictions(
                predictions,
                this.webcamCanvasRef.current,
                this.webcamCanvasRef.current.getContext('2d'),
                this.videoRef.current);

            if (predictions.length > 0){
                this.previousHandCoordinates = this.currentHandCoordinates;

                const x = predictions[0].bbox[0];
                const y = predictions[0].bbox[1];
                const width = predictions[0].bbox[2];
                const height = predictions[0].bbox[3];

                const middleValueX = x + width/2;
                const middleValueY = y + height/2;
                this.currentHandCoordinates.x = Math.floor(this.handDrawingScaleFactorX*middleValueX-this.canvasRef.current.getBoundingClientRect().left);
                this.currentHandCoordinates.y = Math.floor(this.handDrawingScaleFactorY*middleValueY-this.canvasRef.current.getBoundingClientRect().top);

                if(this.handDrawing){
                    this.drawHandStroke();
                }
            }


            if (this.state.videoOn) {
                requestAnimationFrame(this.runDetection);
            }
        });
    };

    drawHandStroke(){
        const point = new Map({
            x: Math.floor(this.currentHandCoordinates.x*this.handDrawingScaleFactorX),
            y: Math.floor(this.currentHandCoordinates.y*this.handDrawingScaleFactorY),
        });

        console.log(point);

        // if first stroke
        if (this.state.lines.size === 0){
            this.setState(prevState => ({
                lines: prevState.lines.push(new List([point])),
                colors: prevState.colors.push(prevState.strokeColor),
                widths: prevState.widths.push(prevState.strokeWidth),
                isDrawing: true
            }));
        } else if (this.state.lines.get(-1).size > 0 && !this.state.isDrawing) {
            this.setState(prevState => ({
                lines: prevState.lines.push(new List([point])),
                colors: prevState.colors.push(prevState.strokeColor),
                widths: prevState.widths.push(prevState.strokeWidth),
                isDrawing: true
            }));
        } else if (this.state.lines.get(-1).size > 0 && this.state.isDrawing) {
            if(this.handDrawing){
                this.setState(prevState => ({
                    lines: updateIn(prevState.lines, [prevState.lines.size - 1], line => line.push(point)),
                }));
            } else {
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
        }
    }

    handleMouseDown(mouseEvent) {
        if (mouseEvent.button !== 0 || this.state.videoOn) {
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
        if (!this.state.isDrawing || this.state.videoOn) {
            return;
        }

        const point = relativeCoordinates(mouseEvent, this.canvasRef.current);

        this.setState(prevState =>  ({
            lines: updateIn(prevState.lines, [prevState.lines.size - 1], line => line.push(point)),
        }));
    }

    handleMouseUp() {
        if (this.state.videoOn){
            return;
        }

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
        if(keyEvent.code === "KeyD" && !this.state.isDrawing) {
            if (this.state.videoOn) {
                this.handDrawing = true;

            }
        }
    };

    handleKeyUp = (keyEvent) => {
        if(keyEvent.code === "KeyD"){

            this.handDrawing = false;

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
                    onModelLoading={()=>{
                            if (this.modelLoaded){
                                return "Stop hand drawing";
                            }
                            if (this.state.modelIsLoading){
                                return "loading...";
                            }
                            return null
                        }
                    }
                    onModelWorking={this.detecting}

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
                {
                    this.state.videoOn ? (
                        <div>
                            <video className="canvasbox"
                                   autoPlay="autoplay"
                                   ref={this.videoRef}
                            />
                            <canvas className="border canvasbox"
                                    ref={this.webcamCanvasRef}/>
                        </div>
                    ): null
                }
            </div>
        );
    }
}

export default App;
