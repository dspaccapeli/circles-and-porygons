/*
    Inspired by
    http://paulbourke.net/geometry/pointlineplane/

    Calculate the intersection point between to lines A̅B̅ and C̅D̅
 */

export default function lineIntersect(A, B, C, D)
{
    let x1 = A.get('x'),
        y1 = A.get('y'),
        x2 = B.get('x'),
        y2 = B.get('y'),
        x3 = C.get('x'),
        y3 = C.get('y'),
        x4 = D.get('x'),
        y4 = D.get('y');

    // Check if none of the lines are of length 0
    if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
        return false
    }

    let denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

    // Lines are parallel
    if (denominator === 0) {
        return false
    }

    let unknown_a = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
    let unknown_b = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

    // is the intersection along the segments
    if (unknown_a < 0 || unknown_a > 1 || unknown_b < 0 || unknown_b > 1) {
        return false
    }

    // Return a object with the x and y coordinates of the intersection
    let x = Math.floor(x1 + unknown_a * (x2 - x1));
    let y = Math.floor(y1 + unknown_a * (y2 - y1));

    return {x, y}
}
