import visvalingam from "./visvalingam";
import closePolygon from "./closePolygon";
import isCircle from "./isCircle";
import {List} from "immutable";
import smoothPolygon from "./smoothPolygon";
import findAngle from "./findAngle";

/*
    Use the Visvalingam algorithm to smooth the strokes up to
    12 points and close it if possible
    -> If the stroke looks like a circle leave it as is,
    otherwise smooth it more by removing 'highly' obtuse angles.
    Some other minor checks are done to guarantee the stability:
    e.g. a too narrow eye-shaped stroke difficult to regularize
 */
export default function processPoints (line) {
    let newLine = visvalingam(line.toArray(), 11);
    newLine = closePolygon(newLine);

    if(isCircle(newLine)) {
        if(newLine.length > 3) {
            return List(newLine)
        } else {
            return new List();
        }
    } else {
        newLine = smoothPolygon(newLine);
    }

    // If the drawing is looking like an eye (2 points and 2 curves) -> delete
    if(newLine.length === 3 && findAngle(newLine[0], newLine[1], newLine[2]) === 0){
        return new List();
    }

    return List(newLine);
};
