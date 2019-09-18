import { Map } from 'immutable';

export default function closePolygon(polygon) {
    let i,
        x_intersect,
        y_intersect,
        foundIntersection = false,
        closedPolygon = [];

    for (i = 0; i <= polygon.length - 4; i++){
        let A = polygon[i];
        let B = polygon[i+1];
        let j = i + 2;

        for (j; j <= polygon.length - 2; j++){
            let C = polygon[j];
            let D = polygon[j+1];
            let {x, y} = lineIntersect(A, B, C, D);

            if (x){
                x_intersect = x;
                y_intersect = y;
                foundIntersection = true;

                break;
            }
        }

        if(foundIntersection){
            // Slice (i, j) cut up to and excluding j
            closedPolygon = polygon.slice(i, j+2);
            closedPolygon[0] = new Map({
                x: x_intersect,
                y: y_intersect
            });
            closedPolygon[closedPolygon.length -1] = new Map({
                x: x_intersect,
                y: y_intersect
            });
            break;
        }
    }

    let acceptedGap = 30;

    if (!foundIntersection){
        if (Math.hypot(polygon[polygon.length -1].get('x')-polygon[0].get('x'), polygon[polygon.length -1].get('y')-polygon[0].get('y')) > acceptedGap){
            return closedPolygon;
        } else {
            closedPolygon = polygon;
            let xStart = closedPolygon[0].get('x');
            let yStart = closedPolygon[0].get('y');

            closedPolygon[closedPolygon.length - 1] = new Map({
                x: xStart,
                y: yStart
            })
        }
    }

    return closedPolygon;

}

// Inspired by: http://paulbourke.net/geometry/pointlineplane/

function lineIntersect(A, B, C, D)
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
