import {Map} from "immutable";

export default function relativeCoordinates(mouseEvent, area) {
    const boundingRect = area.getBoundingClientRect();
    return new Map({
        x: mouseEvent.clientX - boundingRect.left,
        y: mouseEvent.clientY - boundingRect.top,
    });
}
