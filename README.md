![icon](https://raw.githubusercontent.com/dspaccapeli/circles-and-porygons/master/public/favicon.ico)
# Circles and Porygons

## Description of the project
This drawing application “prettifies” drawn shapes. For example, if the user draws a rough rectangle the application is going to make it pretty/regularized (i.e. with four straight lines) and of the appropriate size. The user will be able to change the color of the stroke, the fill and also the width of the stroke before drawing. We also developed:
- The ability to draw using the user’s hand through the webcam;
- Force a higher degree of prettification by making the drawn shapes more regular in case they are triangles or rectangles.

The application is developed in React and the drawn strokes are displayed as SVG components.
## Functionalities
### Drawing
The user is able to draw shapes. These shapes are closed once the user intersects the stroke with itself or by releasing the mouse close to the initial point. Each stroke is implemented as a collection of points (represented as a Map object with ‘x’ and ‘y’ keys). These points will then be converted into an SVG path that will update real-time according to the user’s input.
#### Simplifications:
- The shapes are all assumed to be closed polygon
- The strokes don’t persist if they are not closed by the user
### Prettifying shapes
We decided to let the user draw an arbitrary closed shape and then simplify it iteratively to prettify it. The main steps in our pipeline are the Visvalingam algorithm, the detection of Circles and the smoothing of the resulting polygons. The Visvalingam algorithm iteratively reduces the number of points by deleting the points for which the angle composed by its next and previous point is the smallest (by area) to all the rest. By using this algorithm, the points of the closed drawn shapes are reduced to 11. We decided to choose this number in case the user would like to draw an octagon or a more complex shape, rather than just a circle, triangle, and rectangle. In this way, the drawing is simplified to 11 points and let them draw a realistically complex polygon. This number of points would let us also work on them to apply more processing if needed. Then to smooth the polygon, the internal angles are analyzed to discard the ones that are found to be larger than 145º (heuristically chose upon several tries). This would signal that the user wanted to draw a straight line. Once these angles are discarded, we end up with the “final” points of the polygon and it is ready to be drawn. It will be drawn, in the same way as in section 2.1.
For the case of the circle, it is a bit exceptional because it will always be prettified in a perfect way, no matter if the extra prettifying (next feature) is selected or not. The procedure was to first identify if the path drawn by the user corresponds to a circle. This is done by computing if all the internal angles are larger than 115º, the closed path is considered to be a circle. Also as above this angle was chosen heuristically chose upon several tries. Then, the centroid of the points of the circle is computed and the radius by getting the distance between the centroid and the first point. The circle will be drawn by using the  SVG tag <circle>.
#### Simplifications
- We don’t recognize shapes from the strokes, but we simplify them iteratively
- Smoothing and circle detection is doing with heuristics and could be improved
### The canvas 
There was also faced the challenge of how to structure the Canvas. We decided to go for an approach focused on kids and therefore it is a very simple, straightforward interface. It has the theme of “Paper” as in this way users can associate this tool as if they were drawing on a paper.
The canvas has a sidebar with options to modify the stroke before drawing the path. These options include clearing the canvas, changing the color of the fill, the stroke and changing the width of the stroke. To change the color, it will open a color picker according to either the fill or for the stroke. For the stroke width, there is a slider to select the desired value. The sidebar includes as well the two buttons for the extra functionalities: extra-prettifying and drawing with the hand. 
#### Simplifications
- The color picker has a simple interaction with a limited number of colors
- We have a simple slim sidebar on the side to leave as much space as possible for the canvas
### Extra prettifying shapes
For the extra prettying, there was a button saying: “Extra prettify”. When activated, the shapes of triangle, square and rectangle, which are the main shapes, will be extra prettified. 
For the case of the square, instead of creating a path of points, it creates an SVG <rect>, so we would obtain a perfect square or rectangle. To select in which case we are, if the shape is 30% with a higher height or width, the shape will be prettified as a rectangle, otherwise, it will be considered a square. For this shape, we also had to identify the top left corner point to draw the shape.
For the case of the triangle, as there is no SVG <triangle>, we continued using the path. Usually, triangles are already prettified since with 3 points it is easy to create very straightforward. However, in the extra prettifying option, we created a rectangle that has the three sides and the angles perfectly equal. To do so, we obtained the highest point of the shape and then calculate the h (height) and the a (for the base).
#### Simplifications
- We don’t “extra” prettify more complex polygons (pentagon, hexagon, etc...)
- Triangles are all “extra” prettified in the same position
### Draw with the hand
As an alternative way of drawing, we developed a way in which the user is able to draw on the canvas by using his own hand. The hand will be detected through the webcam by using a neural network that predicts the position of a hand in view for each possible frame. The prediction position is then translated to a point in the canvas. 
To force the user to use only one hand and to provide a way of the user to decide when to start drawing we implemented the mouse-click equivalent for the hand by pressing and holding the “D” button.
#### Simplifications
- Only one hand is detected (the first that comes in the frame)
- You can only draw by pressing the “D” key while moving the other hand in the webcam view
- The user can only draw if an internet connection is present
## How to use
To build the application follow these steps:
- Clone the repository
- (install npm) run in the project directory the command: npm install
- To open the application on your browser run: npm run
- If your browser doesn’t open automatically go to localhost:3000
N.B. Chrome is needed to be able to run the Hand tracking feature
