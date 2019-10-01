import React, { Component } from 'react';
import './App.css';
import { List, Map, updateIn, remove } from 'immutable';
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
        let newLine = visvalingam(line.toArray(), 11);
        newLine = closePolygon(newLine);

        console.log(isCircle(newLine));

        if(isCircle(newLine)) {
            return List(newLine)
        } else {
            // newLine = smoothPolygon(newLine)
        }

        return List(newLine);
    }

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

    render() {
        this.state.lines.map((line, index) => {
                // console.log('index :' + index);
                console.log('line :' + line.toArray());
            }
        );

        return (
            <div>
                <Sidebar/>
                <div
                    className="drawArea"
                    ref="drawArea"
                    onMouseDown={this.handleMouseDown}
                    onMouseMove={this.handleMouseMove}
                >
                    <Drawing lines={this.state.lines} isDrawing={this.state.isDrawing}/>
                </div>
            </div>
        );
    }
}

function Drawing({ lines, isDrawing }) {

    if (isDrawing){
        return (
            <svg className="drawing">
                {lines.map((line, index) => isCircle(line.toArray()) && index !== lines.size-1 ? (
                        <DrawingCircle key={index} line={line}/>
                    ) : (
                        <DrawingLine key={index} line={line}/>
                    )
                )}
            </svg>
        );
    } else {
        return (
            <svg className="drawing">
                {lines.map((line, index) => isCircle(line.toArray()) ? (
                        <DrawingCircle key={index} line={line}/>
                    ) : (
                        <DrawingLine key={index} line={line}/>
                    )
                )}
            </svg>
        );
    }
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

function DrawingCircle({ line }) {

    let newLine = line.toArray();

    let centroid = get_polygon_centroid(newLine);

    let radius = Math.floor(Math.hypot(centroid.get('x')-newLine[0].get('x'), centroid.get('y')-newLine[0].get('y')));

    return <circle cx={centroid.get('x')} cy={centroid.get('y')} r={radius} fill="none" stroke="black" strokeWidth="1"/>;
}

function get_polygon_centroid(pts) {
    let first = pts[0], last = pts[pts.length-1];

    console.log('pts_0', pts[0])
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
        console.log('f', f);
        twicearea += f;
        console.log('twicearea', twicearea)
        x += (p1.get('x') + p2.get('x') - 2 * first.get('x')) * f;
        console.log('x', x)
        y += (p1.get('y') + p2.get('y') - 2 * first.get('y')) * f;
        console.log('y', y)
    }
    f = twicearea * 3;

    let centroidX = Math.floor(x/f + first.get('x'));
    let centroidY = Math.floor(y/f + first.get('y'));

    console.log('cX', centroidX);
    console.log('cY', centroidY);

    return new Map({
        x: centroidX,
        y: centroidY
    });
}


export default App;
