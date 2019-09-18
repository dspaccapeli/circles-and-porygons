import React, { Component } from 'react';
import './App.css';
import { List, Map, updateIn } from 'immutable';
import visvalingam from './visvalingam'
import closePolygon from './closePolygon'
import isCircle from './isCircle'
import Sidebar from "./sidebar";


class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            lines: new List(),
            isDrawing: false
        };

        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.preprocess = this.preprocess.bind(this);
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

        const point = this.relativeCoordinatesForEvent(mouseEvent);

        this.setState(prevState => ({
            lines: prevState.lines.push(new List([point])),
            isDrawing: true
        }));
    }

    handleMouseMove(mouseEvent) {
        if (!this.state.isDrawing) {
            return;
        }

        const point = this.relativeCoordinatesForEvent(mouseEvent);

        this.setState(prevState =>  ({
            lines: updateIn(prevState.lines, [prevState.lines.size - 1], line => line.push(point))
        }));
    }

    preprocess(line) {
        let newLine = visvalingam(line.toArray(), 5);
        newLine = closePolygon(newLine);
        console.log(isCircle(newLine));
        // if(isCircle(newLine)) {
        //     return List(newLine)
        // } else {
        //     newLine = smoothPolygon(newLine)
        return List(newLine);
    }

    handleMouseUp() {
        // this.setState({ isDrawing: false });
        this.setState(prevState =>  ({
            lines: updateIn(prevState.lines, [prevState.lines.size - 1], line => this.preprocess(line)),
            isDrawing: false
        }));
    }

    relativeCoordinatesForEvent(mouseEvent) {
        const boundingRect = this.refs.drawArea.getBoundingClientRect();
        return new Map({
            x: mouseEvent.clientX - boundingRect.left,
            y: mouseEvent.clientY - boundingRect.top,
        });
    }

    render() {
        this.state.lines.map((line, index) => {
                // console.log('index :' + index);
                console.log('line :' + line.toArray());
            }
        );

        return (
            <div
                className="drawArea"
                ref="drawArea"
                onMouseDown={this.handleMouseDown}
                onMouseMove={this.handleMouseMove}
            >
                <Drawing lines={this.state.lines} />
            </div>
        );
    }
}

function Drawing({ lines }) {
    return (
        <svg className="drawing">
            {lines.map((line, index) => (
                <DrawingLine key={index} line={line} />
            ))}
        </svg>
    );
}

function DrawingLine({ line }) {

    const pathData = "M " +
        line
            .map(p => {
                return `${p.get('x')} ${p.get('y')}`;
            })
            .join(" L ");

    return <path className="path" d={pathData} />;
}


export default App;
