import { Map } from 'immutable';
import lineIntersect from "./lineIntersect";

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
