import {Map} from "immutable";

export default function getPolygonCentroid(pts) {
    let first = pts[0], last = pts[pts.length-1];

    if (first.get('x') !== last.get('x') || first.get('y') !== last.get('y')) {
        pts.push(first);
    }
    let twicearea=0,
        x=0, y=0,
        nPts = pts.length,
        p1, p2, f;
    for ( let i=0, j=nPts-1 ; i<nPts ; j=i++ ) {
        p1 = pts[i]; p2 = pts[j];
        f = (p1.get('y') - first.get('y')) * (p2.get('x') - first.get('x')) - (p2.get('y') - first.get('y')) * (p1.get('x') - first.get('x'));
        twicearea += f;
        x += (p1.get('x') + p2.get('x') - 2 * first.get('x')) * f;
        y += (p1.get('y') + p2.get('y') - 2 * first.get('y')) * f;
    }
    f = twicearea * 3;

    let centroidX = Math.floor(x/f + first.get('x'));
    let centroidY = Math.floor(y/f + first.get('y'));

    return new Map({
        x: centroidX,
        y: centroidY
    });
}
