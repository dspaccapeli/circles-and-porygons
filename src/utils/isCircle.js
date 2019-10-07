import findAngle from "./findAngle";

export default function isCircle(polygon) {
    let i = 1;

    for (i; i<polygon.length-1; i++){
        let angle = findAngle(polygon[i-1], polygon[i], polygon[i+1]);
        if (angle < 110){
            return false;
        }
    }

    return true;
}
