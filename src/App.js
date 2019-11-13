// Import React components
import React, { Component } from 'react';
// Adding css styling
import './App.css';
// Using external libraries to use immutable collections
import {List, updateIn, remove, Map} from 'immutable';
// Import the two child components
import Sidebar from "./Sidebar";
import Drawing from "./Drawing";
// Utility functions to process line-points of the shapes
import relativeCoordinates from "./utils/relativeCoordinates";
import processPoints from "./utils/processPoints";
// Import ML library to detect the hand position
import * as handTrack from 'handtrackjs';

class App extends Component {
    constructor(props) {
        super(props);
        // Initialize React state - they trigger re-rendering
        this.state = {
            lines: new List(),
            isDrawing: false,
            strokeColor: '#4284f5',
            fillColor: 'transparent',
            strokeWidth: 5,
            colors: new List(),
            fills: new List(),
            widths: new List(),
            isExtraPrettyfied: new List(),
            videoOn: false,
            modelIsLoading: false,
            extraPrettify: false,
        };
        this.extraPrettifyStatus = false;

        // Initialize class state parameters, handtracking related
        this.modelLoaded = false;
        this.detecting = null;
        this.model = null;
        this.currentHandCoordinates = { x: -1, y: -1};
        this.handDrawing = false;
        this.context = null;
        this.handDrawingScaleFactorX = 1;
        this.handDrawingScaleFactorY = 1;
        // Setting up the intial handtracking recognizer parameters
        this.modelParams = {
            maxNumBoxes: 1,
            scoreThreshold: 0.7,
        };
        // Setting up references for DIV elements manipulation
        this.canvasRef = React.createRef();
        this.videoRef = React.createRef();
        this.webcamCanvasRef = React.createRef();
        // Binding function to make them accessible
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
    }
    // Add eventListener to all the doucument
    componentDidMount() {
        document.addEventListener("mouseup", this.handleMouseUp);
        document.addEventListener("keydown", this.handleKeyDown);
        document.addEventListener("keyup", this.handleKeyUp);
    }
    // Remove on component creation (best practice)
    componentWillUnmount() {
        document.removeEventListener("mouseup", this.handleMouseUp);
        document.removeEventListener("keydown", this.handleKeyDown);
        document.removeEventListener("keyup", this.handleKeyUp);
    }
    // On update get reference for the webcam display DIV and the scaling factor
    // For scaling factor we mean a multiplier that is applied to transform
    // a position in webcam-space to canvas-space
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.webcamCanvasRef.current){
            this.context = this.webcamCanvasRef.current.getContext('2d');

            this.handDrawingScaleFactorX = (this.canvasRef.current.offsetWidth) / this.videoRef.current.offsetWidth;
            this.handDrawingScaleFactorY = this.canvasRef.current.offsetHeight / this.videoRef.current.offsetHeight;
        }
    }

    toggleExtraPrettify = () => {
        if(!this.extraPrettifyStatus){
            this.setState({
                extraPrettify: true,
            });
            this.extraPrettifyStatus = true;
            console.log("prettifying");
        } else{
            this.setState({
                extraPrettify: false,
            });
            this.extraPrettifyStatus =false;
            console.log("NOT prettifying");
        }
        console.log(this.extraPrettifyStatus);
    }

    // Turn ON or OFF handtracking, kickstart it if necessary
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

    // Pre or Post process operations for capturing video
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
    // Start handtracking
    startHandTracking = () => {
        handTrack.startVideo(this.videoRef.current).then( status => {
            console.log("video started", status);
            let self = this;
            if (status) {
                self.runDetection();
            }
        });
    };
    // Run detection on a loop and detect the position per each frame
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
                const x = predictions[0].bbox[0];
                const y = predictions[0].bbox[1];
                const width = predictions[0].bbox[2];
                const height = predictions[0].bbox[3];
                // Find center point of the hand bounding box
                const middleValueX = x + width/2;
                const middleValueY = y + height/2;
                this.currentHandCoordinates.x = Math.floor(this.handDrawingScaleFactorX*middleValueX-this.canvasRef.current.getBoundingClientRect().left);
                this.currentHandCoordinates.y = Math.floor(this.handDrawingScaleFactorY*middleValueY-this.canvasRef.current.getBoundingClientRect().top);

                if(this.handDrawing){
                    this.drawHandStroke();
                }
            }
            // Loop the detection at the next frame
            if (this.state.videoOn) {
                requestAnimationFrame(this.runDetection);
            }
        });
    };
    // If the user is drawing display and act accordingly the different cases
    drawHandStroke(){
        const point = new Map({
            x: Math.floor(this.currentHandCoordinates.x*this.handDrawingScaleFactorX),
            y: Math.floor(this.currentHandCoordinates.y*this.handDrawingScaleFactorY),
        });
        // if first stroke
        if (this.state.lines.size === 0){
            this.setState(prevState => ({
                lines: prevState.lines.push(new List([point])),
                colors: prevState.colors.push(prevState.strokeColor),
                fills: prevState.fills.push(prevState.fillColor),
                widths: prevState.widths.push(prevState.strokeWidth),
                isExtraPrettyfied: prevState.isExtraPrettyfied.push(prevState.extraPrettify),
                isDrawing: true
            }));
        } else if (this.state.lines.get(-1).size > 0 && !this.state.isDrawing) {
            this.setState(prevState => ({
                lines: prevState.lines.push(new List([point])),
                colors: prevState.colors.push(prevState.strokeColor),
                fills: prevState.fills.push(prevState.fillColor),
                widths: prevState.widths.push(prevState.strokeWidth),
                isExtraPrettyfied: prevState.isExtraPrettyfied.push(prevState.extraPrettify),
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
                            fills: remove(prevState.fills, prevState.fills.size - 1),
                            widths: remove(prevState.widths, prevState.widths.size - 1),
                            isExtraPrettyfied: remove(prevState.isExtraPrettyfied, prevState.isExtraPrettyfied.size - 1),
                            isDrawing: false
                        }));
                    }
                }
            }
        }
    }
    // Event handler for mouse drawing
    handleMouseDown(mouseEvent) {
        if (mouseEvent.button !== 0 || this.state.videoOn) {
            return;
        }

        const point = relativeCoordinates(mouseEvent, this.canvasRef.current);

        this.setState(prevState => ({
            lines: prevState.lines.push(new List([point])),
            colors: prevState.colors.push(prevState.strokeColor),
            fills: prevState.fills.push(prevState.fillColor),
            widths: prevState.widths.push(prevState.strokeWidth),
            isExtraPrettyfied: prevState.isExtraPrettyfied.push(prevState.extraPrettify),
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
                    fills: remove(prevState.fills, prevState.fills.size - 1),
                    widths: remove(prevState.widths, prevState.widths.size - 1),
                    isExtraPrettyfied: remove(prevState.isExtraPrettyfied, prevState.isExtraPrettyfied.size - 1),
                    isDrawing: false
                }));
            }
        }
    }
    // Event handler to trigger hand drawing on canvas
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
                        fills: remove(prevState.fills, prevState.fills.size - 1),
                        widths: remove(prevState.widths, prevState.widths.size - 1),
                        isExtraPrettyfied: remove(prevState.isExtraPrettyfied, prevState.isExtraPrettyfied.size - 1),
                        isDrawing: false
                    }));
                }
            }
        }
    };
    // Clear the canvas of all the previous strokes
    clearCanvas = () => {
        this.setState({
            lines: new List(),
            colors: new List(),
            fills: new List(),
            widths: new List(),
            isExtraPrettyfied: new List(),
        });
    };
    // Change the stroke color
    changeColor = (color) => {
        this.setState({
            strokeColor: color,
        });
    };
    
    // Change the fill color
    changeColorFill = (color) => {
        this.setState({
            fillColor: color,
        });
    };

    // Change the stroke width
    changeStroke = (width) => {
        this.setState({
            strokeWidth: width,
        });
    };
    // Render the application
    render() {
        return (
            <div>
                <Sidebar
                    onColorPicked={this.changeColor}
                    onColorPickedFill={this.changeColorFill}
                    onClearCanvas={this.clearCanvas}
                    onStrokePicked={this.changeStroke}
                    onTogglePrettify={this.toggleExtraPrettify}
                    onTogglePreffifyStatus={()=>{
                            if (this.extraPrettifyStatus){
                                return "Normal prettify";
                            }
                            else{
                                return "Extra prettify";
                            }
                            return null
                        }
                    }
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
                        fill={this.state.fills}
                        isDrawing={this.state.isDrawing}
                        width={this.state.widths}
                        isExtraPrettyfied = {this.state.isExtraPrettyfied}
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
