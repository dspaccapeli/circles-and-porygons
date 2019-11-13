import {Map} from "immutable";

/*
    Function to get the relative coordinate of
    a mouse event based on a specific DIV area
*/
export default function relativeCoordinates(mouseEvent, area) {
    const boundingRect = area.getBoundingClientRect();
    return new Map({
        x: mouseEvent.clientX - boundingRect.left,
        y: mouseEvent.clientY - boundingRect.top,
    });
}
