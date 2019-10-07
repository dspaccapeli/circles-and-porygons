import visvalingam from "./visvalingam";
import closePolygon from "./closePolygon";
import isCircle from "./isCircle";
import {List} from "immutable";
import smoothPolygon from "./smoothPolygon";
import findAngle from "./findAngle";

export default function processPoints (line) {
    let newLine = visvalingam(line.toArray(), 11);
    newLine = closePolygon(newLine);

    if(isCircle(newLine)) {
        return List(newLine)
    } else {
        newLine = smoothPolygon(newLine);
    }

    // If the drawing is eye-looking delete
    if(newLine.length === 3 && findAngle(newLine[0], newLine[1], newLine[2]) === 0){
        return new List();
    }

    return List(newLine);
};
