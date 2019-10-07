import React, { Component } from 'react';
import './App.css';
import { List, Map, updateIn, remove, fromJS } from 'immutable';
import visvalingam from './utils/visvalingam'
import closePolygon from './utils/closePolygon'
import smoothPolygon from './utils/smoothPolygon'
import isCircle from './utils/isCircle'
import Sidebar from "./Sidebar";


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
        const strokeColor = this.state.strokeColor;
        const strokeWidth = this.state.strokeWidth;

        this.setState(prevState => ({
            lines: prevState.lines.push(new List([point])),
            colors: prevState.colors.push(strokeColor),
            widths: prevState.widths.push(strokeWidth),
            isDrawing: true
        }));
    }

    handleMouseMove(mouseEvent) {
        if (!this.state.isDrawing) {
            return;
        }

        const point = this.relativeCoordinatesForEvent(mouseEvent);

        this.setState(prevState =>  ({
            lines: updateIn(prevState.lines, [prevState.lines.size - 1], line => line.push(point)),
        }));
    }

    preprocess = (line) =>{
        let newLine = visvalingam(line.toArray(), 11);
        newLine = closePolygon(newLine);

        if(isCircle(newLine)) {
            return List(newLine)
        } else {
            newLine = smoothPolygon(newLine);
        }

        return List(newLine);
    };

    handleMouseUp() {
        if (this.state.lines.last()) {
            let preprocessed = this.preprocess(this.state.lines.last());

            if (!preprocessed.isEmpty()) {
                this.setState(prevState => ({
                    lines: updateIn(prevState.lines, [prevState.lines.size - 1], _ => preprocessed),
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

    relativeCoordinatesForEvent(mouseEvent) {
        const boundingRect = this.refs.drawArea.getBoundingClientRect();
        return new Map({
            x: mouseEvent.clientX - boundingRect.left,
            y: mouseEvent.clientY - boundingRect.top,
        });
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
        /*this.state.lines.map((line, index) => {
                console.log('line :' + line.toArray());
            }
        );*/

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

function Drawing({ lines, color, isDrawing, width }) {

    /*let zipLineColor = new List(lines.zip(color));
    console.log(typeof zipLineColor)
    zipLineColor = zipLineColor.zip(width);*/

    const toZip = fromJS([lines, color, width]);
    const zipped = toZip.get(0).zip(...toZip.rest());

    if (isDrawing){

        return (
            <svg className="drawing">
                {zipped.map((line, index) => isCircle(line[0].toArray()) && index !== lines.size-1 ? (
                        <DrawingCircle key={index} line={line[0]} color={line[1]} width={line[2]}/>
                    ) : (
                        <DrawingLine key={index} line={line[0]} color={line[1]} width={line[2]}/>
                    )
                )}
            </svg>
        );
    } else {

        return (
            <svg className="drawing">
                {zipped.map((line, index) => isCircle(line[0].toArray()) ? (
                        <DrawingCircle key={index} line={line[0]} color={line[1]} width={line[2]}/>
                    ) : (
                        <DrawingLine key={index} line={line[0]} color={line[1]} width={line[2]}/>
                    )
                )}
            </svg>
        );
    }
}

function DrawingLine({ line, color, width }) {
    const pathData = "M " +
        line
            .map(p => {
                return `${p.get('x')} ${p.get('y')}`;
            })
            .join(" L ");

    return <path className="path" d={pathData} stroke={color} strokeWidth={width} />;
}

function DrawingCircle({ line, color, width }) {

    let newLine = line.toArray();

    let centroid = get_polygon_centroid(newLine);

    let radius = Math.floor(Math.hypot(centroid.get('x')-newLine[0].get('x'), centroid.get('y')-newLine[0].get('y')));

    return <circle cx={centroid.get('x')} cy={centroid.get('y')} r={radius} fill="none" stroke={color} strokeWidth={width} />;
}

function get_polygon_centroid(pts) {
    let first = pts[0], last = pts[pts.length-1];

    if (first.get('x') !== last.get('x') || first.get('y') !== last.get('y')) {
        pts.push(first);
    }
    let twicearea=0,
        x=0, y=0,
        nPts = pts.length,
        p1, p2, f;
    for ( let i=0, j=nPts-1 ; i<nPts ; j=i++ ) {
        p1 = pts[i]; p2 = pts[j];
        f = (p1.get('y') - first.get('y')) * (p2.get('x') - first.get('x')) - (p2.get('y') - first.get('y')) * (p1.get('x') - first.get('x'));
        twicearea += f;
        x += (p1.get('x') + p2.get('x') - 2 * first.get('x')) * f;
        y += (p1.get('y') + p2.get('y') - 2 * first.get('y')) * f;
    }
    f = twicearea * 3;

    let centroidX = Math.floor(x/f + first.get('x'));
    let centroidY = Math.floor(y/f + first.get('y'));

    return new Map({
        x: centroidX,
        y: centroidY
    });
}


export default App;
