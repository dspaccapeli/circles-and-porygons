import findAngle from "./findAngle";

export default function smoothPolygon(polygon) {
    let i;
    let arrayOfIndex = [];
    let indexForArray = 0;

    const minAngleDistance = 20;

    for (i = 1; i<polygon.length-1; i++){
        let angle = findAngle(polygon[i-1], polygon[i], polygon[i+1]);
        //If the angle is bigger than 145º then delete then store into the array to keep the indexes of the points to delete
        if(angle > 145){
            arrayOfIndex[indexForArray] = i;
            indexForArray++;
        }
    }

    //delete the points that are not necessary
    let n=0;
    for(i=0; i<arrayOfIndex.length; i++){
        polygon.splice(arrayOfIndex[i]-n, 1);
        n++;
    }

    arrayOfIndex = [];
    indexForArray = 0;

    for (i = 0; i<polygon.length-1; i++){
        //If two adjacent angles are too close delete them
        if(Math.hypot(polygon[i].get('x')-polygon[i+1].get('x'), polygon[i].get('y')-polygon[i+1].get('y')) < minAngleDistance){
            arrayOfIndex[indexForArray] = i;
            indexForArray++;
        }
    }

    //delete the points that are not necessary
    n=0;
    for(i=0; i<arrayOfIndex.length; i++){
        polygon.splice(arrayOfIndex[i]-n, 1);
        n++;
    }

    return polygon;
}
