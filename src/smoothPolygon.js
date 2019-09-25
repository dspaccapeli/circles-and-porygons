export default function smoothPolygon(polygon) {
    let i = 1;
    let avg = [];
    let NumberOfAngles = 1;

    for (i; i<polygon.length-1; i++){
        let angle = findAngle(polygon[i-1], polygon[i], polygon[i+1]);
        console.log(angle);
        avg.push(angle);
        //console.log("Angle is: "+angle);

        //If the angle is bigger than 140º and maybe smaller than 220º, then delete the points in between?
        if(angle < 140){
            console.log("This is a real angle:"+angle);
            NumberOfAngles += 1;

        }
    }

    return NumberOfAngles;
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
