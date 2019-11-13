import {fromJS} from "immutable";
import isCircle from "./utils/isCircle";
import getPolygonCentroid from "./utils/getPolygonCentroid";
import React from "react";


export default function Drawing({ lines, color, fill, isDrawing, width, isExtraPrettyfied }) {

    /*let zipLineColor = new List(lines.zip(color));
    console.log(typeof zipLineColor)
    zipLineColor = zipLineColor.zip(width);*/

    const toZip = fromJS([lines, color, fill, width, isExtraPrettyfied]);
    const zipped = toZip.get(0).zip(...toZip.rest());

    if (isDrawing){
        return (
            <svg className="drawing">
                {zipped.map((line, index) => isCircle(line[0].toArray()) && index !== lines.size-1 ? (
                        <DrawingCircle key={index} line={line[0]} color={line[1]} fill={line[2]} width={line[3]}/>
                    ) : (
                        index !== lines.size-1 ? (
                            <DrawingLineE key={index} line={line[0]} color={line[1]} fill={line[2]} width={line[3]} isExtraPrettyfied={line[4]}/>
                            ) : (
                            <DrawingLine key={index} line={line[0]} color={line[1]} fill={line[2]} width={line[3]} isExtraPrettyfied={line[4]}/>
                            )
                        )
                    )
                }
            </svg>
        );

    } else {
        return (
            <svg className="drawing">
                {zipped.map((line, index) => isCircle(line[0].toArray()) ? (
                        <DrawingCircle key={index} line={line[0]} color={line[1]} fill={line[2]} width={line[3]}/>
                    ) : (
                        <DrawingLineE key={index} line={line[0]} color={line[1]} fill={line[2]} width={line[3]} isExtraPrettyfied={line[4]}/>
                    )
                )}
            </svg>
        );
    }
}


function DrawingLine({ line, color, fill, width }) {

    const pathData = "M " +
        line
            .map(p => {
                return `${p.get('x')} ${p.get('y')}`;
            })
            .join(" L ");
    console.log(pathData);

    return <path className="path" d={pathData} fill={fill} stroke={color} strokeWidth={width} />;
}


function DrawingLineE({ line, color, fill, width, isExtraPrettyfied }) {
    let pathData = "";
    console.log(isExtraPrettyfied);
    console.log(color);

    if (isExtraPrettyfied){

        if(line.size==5){
            let firstPointIndex = 0; //we want lowest Y
            let getFirstPoint = 2000;
            let he = 0, wi = 0;

            console.log("Prettify and TRIANGLE");
            for(let i = 0; i<line.size; i++){
                if( (line.get(i).get("x") + line.get(i).get("y")) < getFirstPoint){
                    getFirstPoint = (line.get(i).get("x") + line.get(i).get("y"));
                    firstPointIndex = i;
                }
            }

            console.log(line.get(firstPointIndex + 1).get("x"));


            if((line.get(firstPointIndex + 1).get("x") - (line.get(firstPointIndex).get("x"))) > (line.get(firstPointIndex + 3).get("x") - (line.get(firstPointIndex).get("x")))){
                wi = line.get(firstPointIndex + 1).get("x") - line.get(firstPointIndex).get("x");
                he = line.get(firstPointIndex + 3).get("y") - line.get(firstPointIndex).get("y");
            }
            else{
                wi = line.get(firstPointIndex + 3).get("x") - line.get(firstPointIndex).get("x");
                he = line.get(firstPointIndex + 1).get("y") - line.get(firstPointIndex).get("y");
            }

            if(he < wi*1.3 && wi < he*1.3){
                he = wi;
            }

            return <rect x={line.get(firstPointIndex).get("x")} y={line.get(firstPointIndex).get("y")} width={wi} height={he} fill={fill} stroke={color} strokeWidth={width} />

        }
        else if(line.size==4){
            let highestPointIndex = 0; //we want lowest Y
            let getLowestHeight = 900;
            let a = 0; //triangle parameter a
            let h = 0; // triangle parameter h
            console.log("Prettify and TRIANGLE");
            for(let i = 0; i<line.size; i++){
                if(line.get(i).get("y")<getLowestHeight){
                    getLowestHeight = line.get(i).get("y");
                    highestPointIndex = i;
                }
            }

            console.log(line.get(highestPointIndex));

            //By default the user will get the biggest rectangle
            if((line.get(highestPointIndex + 1).get("y") - line.get(highestPointIndex).get("y")) > (line.get(highestPointIndex + 1).get("x") - line.get(highestPointIndex).get("x"))){
                a = line.get(highestPointIndex + 1).get("y") - line.get(highestPointIndex).get("y");
            }
            else{
                a = line.get(highestPointIndex + 1).get("x") - line.get(highestPointIndex).get("x");
            }

            h = a * Math.sqrt(3)/2;

            let x0, y0, x1, y1, x2, y2, x3, y3;
            x0 = line.get(highestPointIndex).get("x");
            y0 = line.get(highestPointIndex).get("y");

            x1 = x0 + a/2;
            y1 = y0 + h;

            x2 = x0 - a/2;
            y2 = y0 + h;

            x3 = x0;
            y3 = y0;

            pathData = "M " + x0 + " " + y0 +" L " + x1 + " "+ y1 + " L " + x2 + " "+ y2 + " L " + x3 + " "+ y3
            return <path className="path" d={pathData} fill={fill} stroke={color} strokeWidth={width} />;

        }
    }
    pathData = "M " +
        line
            .map(p => {
                return `${p.get('x')} ${p.get('y')}`;
            })
            .join(" L ");
    console.log(pathData);

    return <path className="path" d={pathData} fill={fill} stroke={color} strokeWidth={width} />;
}


function DrawingCircle({ line, color, fill, width }) {

    let newLine = line.toArray();

    let centroid = getPolygonCentroid(newLine);

    let radius = Math.floor(Math.hypot(centroid.get('x')-newLine[0].get('x'), centroid.get('y')-newLine[0].get('y')));

    return <circle cx={centroid.get('x')} cy={centroid.get('y')} r={radius} fill={fill} stroke={color} strokeWidth={width} />;
}
