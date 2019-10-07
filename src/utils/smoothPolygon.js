import findAngle from "./findAngle";

export default function smoothPolygon(polygon) {
    let i;
    let arrayOfIndex = [];
    let indexForArray = 0;

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

    //To see the new polygon points
    // console.log("New polygon is:");
    // for (i=0; i<polygon.length; i++){
    //     console.log("x is: "+polygon[i].get("x")+"; y is: "+polygon[i].get("y"));
    // }

    return polygon;
}
