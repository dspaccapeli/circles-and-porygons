import findAngle from "./findAngle";

const maxAngle = 145;
const minAngleDistance = 20;

/*
    Smooth the polygon by removing angles which are:
        _too obtuse -> greater than 145 degrees (heuristic)
        _too close -> less than 20 pixels
 */
export default function smoothPolygon(polygon) {
    let i;
    let arrayOfIndex = [];
    let indexForArray = 0;

    for (i = 1; i<polygon.length-1; i++){
        let angle = findAngle(polygon[i-1], polygon[i], polygon[i+1]);
        /*
            If the angle is bigger than 145 degrees
            then delete then store into the array to keep the
            indexes of the points to delete
         */
        if(angle > maxAngle){
            arrayOfIndex[indexForArray] = i;
            indexForArray++;
        }
    }

    // Delete the points that create "bad" angles
    let n=0;
    for(i=0; i<arrayOfIndex.length; i++){
        polygon.splice(arrayOfIndex[i]-n, 1);
        n++;
    }

    arrayOfIndex = [];
    indexForArray = 0;

    for (i = 0; i<polygon.length-1; i++){
        // If two adjacent angles are too close delete them
        if(Math.hypot(polygon[i].get('x')-polygon[i+1].get('x'), polygon[i].get('y')-polygon[i+1].get('y')) < minAngleDistance){
            arrayOfIndex[indexForArray] = i;
            indexForArray++;
        }
    }

    // Delete the points too close to each other
    n=0;
    for(i=0; i<arrayOfIndex.length; i++){
        polygon.splice(arrayOfIndex[i]-n, 1);
        n++;
    }

    return polygon;
}
