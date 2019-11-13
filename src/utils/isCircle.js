import findAngle from "./findAngle";

/*
    Return _true_ if there are no angle smaller
    than minAngle degrees (heuristic)
 */

const minAngle = 110;

export default function isCircle(polygon) {
    let i = 1;

    for (i; i<polygon.length-1; i++){
        let angle = findAngle(polygon[i-1], polygon[i], polygon[i+1]);
        if (angle < minAngle){
            return false;
        }
    }

    return true;
}
