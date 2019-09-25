export default function isCircle(polygon) {
    let i = 1;

    let avg = [];

    for (i; i<polygon.length-1; i++){
        let angle = findAngle(polygon[i-1], polygon[i], polygon[i+1]);
        console.log(angle);
        avg.push(angle);

        /*if( 20 <= Math.abs((angle % 90)-90) && Math.abs((angle % 90)-90) <= 70){
            return false;
        }*/
    }

    //console.log(Math.)

    return true;
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
