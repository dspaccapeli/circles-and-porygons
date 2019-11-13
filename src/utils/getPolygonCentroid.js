import {Map} from "immutable";

/*
    Implementation inspiration
    https://stackoverflow.com/questions/5271583/center-of-gravity-of-a-polygon

    Get the centroid of a polygon to
    use as the center of the circle
 */
export default function getPolygonCentroid(pts) {
    let first = pts[0];
    let last = pts[pts.length-1];

    if (first.get('x') !== last.get('x') || first.get('y') !== last.get('y')) {
        pts.push(first);
    }

    let positiveArea=0;
    let x=0, y=0;
    let nPts = pts.length;
    let p1, p2, f;

    for ( let i=0, j=nPts-1 ; i<nPts ; j=i++ ) {
        p1 = pts[i]; p2 = pts[j];
        f = (p1.get('y') - first.get('y')) * (p2.get('x') - first.get('x')) - (p2.get('y') - first.get('y')) * (p1.get('x') - first.get('x'));
        positiveArea += f;
        x += (p1.get('x') + p2.get('x') - 2 * first.get('x')) * f;
        y += (p1.get('y') + p2.get('y') - 2 * first.get('y')) * f;
    }
    f = positiveArea * 3;

    let centroidX = Math.floor(x/f + first.get('x'));
    let centroidY = Math.floor(y/f + first.get('y'));

    return new Map({
        x: centroidX,
        y: centroidY
    });
}
