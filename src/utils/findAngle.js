/*
    Calculate the angle AB̂C
 */
export default function findAngle(A,B,C) {
    let AB = Math.hypot(B.get('x')-A.get('x'), B.get('y')-A.get('y'));
    let BC = Math.hypot(B.get('x')-C.get('x'), B.get('y')-C.get('y'));
    let AC = Math.hypot(C.get('x')-A.get('x'), C.get('y')-A.get('y'));

    return Math.acos((BC*BC+AB*AB-AC*AC)/(2*BC*AB)) * 180 / Math.PI;
}
