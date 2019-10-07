import React, { Component } from 'react';
import './App.css';
import { List, updateIn, remove } from 'immutable';

import Sidebar from "./Sidebar";
import Drawing from "./Drawing";

import relativeCoordinates from "./utils/relativeCoordinates";
import processPoints from "./utils/processPoints";


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

        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
    }

    componentDidMount() {
        document.addEventListener("mouseup", this.handleMouseUp);
    }

    componentWillUnmount() {
        document.removeEventListener("mouseup", this.handleMouseUp);
    }

    handleMouseDown(mouseEvent) {
        if (mouseEvent.button !== 0) {
            return;
        }

        const point = relativeCoordinates(mouseEvent, this.refs.drawArea);

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

        const point = relativeCoordinates(mouseEvent, this.refs.drawArea);

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
                />
                <div
                    className="drawArea"
                    ref="drawArea"
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
            </div>
        );
    }
}

export default App;
