import {fromJS} from "immutable";
import isCircle from "./utils/isCircle";
import getPolygonCentroid from "./utils/getPolygonCentroid";
import React from "react";

/*
    Draw the polygons as SVG, recognizing
    whether they are circles beforehand

    lines: collection of strokes (points)
    color: list of colors corresponding to each stroke
    width: list of widths corresponding to each stroke
    isDrawing: boolean indicating if they user is currently drawing
 */
export default function Drawing({ lines, color, isDrawing, width }) {
    const toZip = fromJS([lines, color, width]);
    const zipped = toZip.get(0).zip(...toZip.rest());

    // Dynamically decide whether to prettify the last (current) stroke
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

// Draw an SVG line
function DrawingLine({ line, color, width }) {
    const pathData = "M " +
        line
            .map(p => {
                return `${p.get('x')} ${p.get('y')}`;
            })
            .join(" L ");

    return <path className="path" d={pathData} stroke={color} strokeWidth={width} />;
}

// Draw an SVG circle
function DrawingCircle({ line, color, width }) {
    let newLine = line.toArray();

    let centroid = getPolygonCentroid(newLine);
    let radius = Math.floor(Math.hypot(centroid.get('x')-newLine[0].get('x'), centroid.get('y')-newLine[0].get('y')));

    return <circle cx={centroid.get('x')} cy={centroid.get('y')} r={radius} fill="none" stroke={color} strokeWidth={width} />;
}
