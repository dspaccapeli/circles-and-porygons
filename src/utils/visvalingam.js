// Import to use Heap data structures -> used in the algorithm
let heap = require('sterta');

/*
    Inspired by
    Simple Visvalingam: https://github.com/pirxpilot/vis-why

    polyline: polyline data structure -> List(Map{x,y})
    limit: the maximum number of point in the resulting polyline
*/
export default function visvalingam(polyline, limit) {
    // Exclude case in which the algorithm is not needed
    if (polyline.length < 3) {return polyline;}
    if (limit < 3) {return [polyline[0], polyline[polyline.length - 1]];}
    if (polyline.length <= limit) {return polyline;}

    // Create an heap with all the triangle areas
    let triangleAreaHeap = createHeap(polyline);

    // Empty heap -> straight line
    if (!triangleAreaHeap.first) {
        return [polyline[0], polyline[polyline.length - 1]];
    }

    // Iteratively eliminate triangles up to the limit
    // N.B. Limit is in the number of points, but we are counting triangles
    eliminate(triangleAreaHeap, limit - 2);

    return reconstructPolyline(triangleAreaHeap.first);
}

function createHeap(polyline) {
    let i,
        triangleAreaHeap = { heap: heap(areaCompare, true) },
        triangle,
        previousTriangle,
        a = polyline[0], b, c = polyline[1],
        list = [];

    // calculate areas
    for (i = 2; i < polyline.length; i++) {
        b = c;
        c = polyline[i];
        // Calculate area of the current triangle and store
        // its points in a JSON
        triangle = {
            a: a,
            b: b,
            c: c,
            area: area(a, b, c),
            next: null,
            prev: previousTriangle,
            _heapIndex: 0
        };

        if (!triangle.area) {
            continue;
        }

        a = b;

        if (previousTriangle) {
            previousTriangle.next = triangle;
        }

        // Store the JSON triangle object in a list
        list.push(triangle);
        previousTriangle = triangle;
    }

    // Create a heap
    triangleAreaHeap.first = list[0];
    triangleAreaHeap.heap.rebuild(list);

    return triangleAreaHeap;
}

// Calculate the area of a triangle
function area(a, b, c) {
    return Math.abs(
        (a.get('x') - c.get('x')) * (b.get('y') - a.get('y')) - (a.get('x') - b.get('x')) * (c.get('y') - a.get('y'))
    );
}

// Comparison function to build the heap
function areaCompare(p, q) {
    return p.area - q.area;
}

// Eliminate n elements from the heap
function eliminate(triangleAreaHeap, limit) {
    let triangle,
        previousTriangle,
        nextTriangle,
        counter = triangleAreaHeap.heap.size() - limit;

    // Iteratively eliminate points
    while(counter-- > 0) {
        triangle = triangleAreaHeap.heap.pop();
        previousTriangle = triangle.prev;
        nextTriangle = triangle.next;

        // Recalculate neighbors
        if (previousTriangle) {
            triangleAreaHeap.heap.remove(previousTriangle);
            previousTriangle.next = triangle.next;
            previousTriangle.c = triangle.c;
            previousTriangle.area = area(previousTriangle.a, previousTriangle.b, previousTriangle.c);
            triangleAreaHeap.heap.push(previousTriangle);
        } else {
            triangleAreaHeap.first = triangle.next;
        }
        if (nextTriangle) {
            triangleAreaHeap.heap.remove(nextTriangle);
            nextTriangle.prev = triangle.prev;
            nextTriangle.a = triangle.a;
            nextTriangle.area = area(nextTriangle.a, nextTriangle.b, nextTriangle.c);
            triangleAreaHeap.heap.push(nextTriangle);
        }

    }
}

// Reconstruct the polyline from the triangle heap
function reconstructPolyline(triangle) {
    let polyline = [triangle.a];

    while(true) {
        polyline.push(triangle.b);
        if (!triangle.next) {
            break;
        }
        triangle = triangle.next;
    }

    polyline.push(triangle.c);

    return polyline;
}
