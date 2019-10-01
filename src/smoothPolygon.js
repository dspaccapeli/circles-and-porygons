export default function smoothPolygon(polygon) {
    let i;
    let arrayOfIndex = [];
    let indexForArray = 0;

    for (i = 1; i<polygon.length-1; i++){
        let angle = findAngle(polygon[i-1], polygon[i], polygon[i+1]);
        console.log("The angle is: "+angle);

        //If the angle is bigger than 145º then delete then store into the array to keep the indexes of the points to delete
        if(angle > 145){
            arrayOfIndex[indexForArray] = i;
            indexForArray++;
        }
    }

    //delete the points that are not necessary
    let n=0;
    for(i=0; i<arrayOfIndex.length; i++){
        console.log(arrayOfIndex[i]);
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

function findAngle(A,B,C) {
    //let AB = Math.sqrt(Math.pow(B.get('x')-A.get('x'),2)+ Math.pow(B.get('y')-A.get('y'),2));
    let AB = Math.hypot(B.get('x')-A.get('x'), B.get('y')-A.get('y'));
    //let BC = Math.sqrt(Math.pow(B.get('x')-C.get('x'),2)+ Math.pow(B.get('y')-C.get('y'),2));
    let BC = Math.hypot(B.get('x')-C.get('x'), B.get('y')-C.get('y'));
    // let AC = Math.sqrt(Math.pow(C.get('x')-A.get('x'),2)+ Math.pow(C.get('y')-A.get('y'),2));
    let AC = Math.hypot(C.get('x')-A.get('x'), C.get('y')-A.get('y'));

    return Math.acos((BC*BC+AB*AB-AC*AC)/(2*BC*AB)) * 180 / Math.PI;
}
