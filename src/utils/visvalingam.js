let heap = require('sterta');


// IMPLEMENTATION INSPIRATION
// Simple Visvalingam
// https://github.com/pirxpilot/vis-why
//

function area(a, b, c) {
    return Math.abs(
        (a.get('x') - c.get('x')) * (b.get('y') - a.get('y')) - (a.get('x') - b.get('x')) * (c.get('y') - a.get('y'))
    );
}


function areaCompare(p, q) {
    return p.area - q.area;
}



function calculate(poly, area) {
    let i,
        ts = { heap: heap(areaCompare, true) },
        triangle,
        trianglePrev,
        a = poly[0], b, c = poly[1],
        list = [];

    // calculate areas
    for (i = 2; i < poly.length; i++) {
        b = c;
        c = poly[i];
        triangle = {
            a: a,
            b: b,
            c: c,
            area: area(a, b, c),
            next: null,
            prev: trianglePrev,
            _heapIndex: 0
        };
        if (!triangle.area) {
            continue;
        }
        a = b;
        if (trianglePrev) {
            trianglePrev.next = triangle;
        }
        list.push(triangle);
        trianglePrev = triangle;
    }

    ts.first = list[0];

    // create a heap
    ts.heap.rebuild(list);

    return ts;
}


function eliminate(ts, limit, area) {
    let triangle,
        prevTriangle,
        nextTriangle,
        counter = ts.heap.size() - limit;

    while(counter-- > 0) {
        triangle = ts.heap.pop();
        prevTriangle = triangle.prev;
        nextTriangle = triangle.next;

        // recalculate neighbors
        if (prevTriangle) {
            ts.heap.remove(prevTriangle);
            prevTriangle.next = triangle.next;
            prevTriangle.c = triangle.c;
            prevTriangle.area = area(prevTriangle.a, prevTriangle.b, prevTriangle.c);
            ts.heap.push(prevTriangle);
        } else {
            ts.first = triangle.next;
        }
        if (nextTriangle) {
            ts.heap.remove(nextTriangle);
            nextTriangle.prev = triangle.prev;
            nextTriangle.a = triangle.a;
            nextTriangle.area = area(nextTriangle.a, nextTriangle.b, nextTriangle.c);
            ts.heap.push(nextTriangle);
        }

    }
}


function collect(triangle) {
    let poly = [triangle.a];

    while(true) {
        poly.push(triangle.b);
        if (!triangle.next) {
            break;
        }
        triangle = triangle.next;
    }

    poly.push(triangle.c);

    return poly;
}


export default function visvalingam(poly, limit) {

    /*
    let firstPoint = poly[0];
    let secondPoint = poly[Math.floor(poly.length/3)];
    let thirdPoint = poly[Math.floor(poly.length*0.67)];

    let areaPoly = area(firstPoint, secondPoint, thirdPoint);
    */

    if (poly.length < 3) {
        return poly;
    }

    if (limit < 3) {
        return [poly[0], poly[poly.length - 1]];
    }

    if (poly.length <= limit) {
        return poly;
    }

    let ts = calculate(poly, area);

    if (!ts.first) {
        // empty heap - straight line with all triangles empty
        return [poly[0], poly[poly.length - 1]];
    }

    eliminate(ts, limit - 2, area); // limit is in points, and we are counting triangles

    return collect(ts.first);
}
