import Renderable from "./2D-Shapes/Interfaces/renderable.interface";
import Transformable from "./2D-Shapes/Interfaces/transformable.interface";
import Shape from "./2D-Shapes/shape";
import Line from "./2D-Shapes/line";
import Square from "./2D-Shapes/square";
import Rectangle from "./2D-Shapes/rectangle";
import Point from "./Base/point";
import Polygon from "./2D-Shapes/polygon";
import Type from "./2D-Shapes/type.enum";
import { createShaderProgram } from "./Functions/create-shader-program";
import ProgramInfo from "./Functions/program-info.interface";
import { setAttributes } from "./Functions/set-attributes";
import { setupCanvas } from "./Functions/setup-canvas";
import Transformation from "./Operations/Transformation";
import { hexToRgb, rgbToHex } from "./Utils/tools";
import { render } from "./Functions/render";
import { renderAll } from "./Functions/render-all";


const gl = setupCanvas()

// if (gl===null) {
//     return;
// }

// Vertex shader program
const vsSource = `
    attribute vec2 aVertexPosition;
    attribute vec4 aVertexColor;
    uniform mat3 uMatrix;
    varying vec4 vColor;

    void main() {
        // note: Y axis must be inverted to replicate traditional view
        gl_Position = vec4((uMatrix * vec3(aVertexPosition, 1)).xy, 0, 1);

        // Change color of shape
        vColor = aVertexColor;
    }
`;

const fsSource = `
    varying vec4 vColor;

    void main() {
        gl_FragColor = vColor;
    }
`;
const shaderProgram = createShaderProgram(gl, vsSource, fsSource);

// Collect all the info needed to use the shader program.
// Look up which attribute our shader program is using
// for aVertexPosition and look up uniform locations.
const programInfo = {
    program: shaderProgram,
    attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
        vertexColor: gl.getAttribLocation(shaderProgram, "aVertexColor"),
    },
    uniformLocations: {
        matrixLocation : gl.getUniformLocation(shaderProgram, "uMatrix"),
    },
};

// Clear the canvas before we start drawing on it.
gl.clear(gl.COLOR_BUFFER_BIT);
// Tell WebGL to use our program when drawing
gl.useProgram(shaderProgram);
// ===============================================================================================
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const shapes : (Shape&Renderable&Transformable)[] = [];
let type : Type;
let isDrawing = false;

/* Setup Viewport */
const width = (gl.canvas as HTMLCanvasElement).clientWidth;
const height = (gl.canvas as HTMLCanvasElement).clientHeight;

gl.canvas.width = width;
gl.canvas.height = height;

const x = 0 // x coordinate of the lower left corner of the viewport rectangle
const y = 0 // y coordinate of the lower left corner of the viewport rectangle
gl.viewport(x, y, gl.canvas.width, gl.canvas.height); // sets the viewport to cover the entire canvas, starting from the lower-left corner and extending to the canvas's width and height.

const positionBuffer = gl.createBuffer();
const colorBuffer = gl.createBuffer();
setAttributes(gl, positionBuffer, colorBuffer, programInfo);

// =========================================================
// Fix HTML Elements Event Listeners

/* List of Shapes Listener */
const listOfShapes = document.getElementById(
    "dropdown"
) as HTMLSelectElement;
listOfShapes.addEventListener("change", () => {
    const index: number = +listOfShapes.selectedOptions[0].value;

    setupSelector(gl, programInfo, shapes[index]);

});

/* Button Listener */
const lineBtn = document.getElementById("line-btn");
lineBtn.addEventListener("click", () => {
    type = Type.Line;
    isDrawing = false;
});

const squareBtn = document.getElementById("square-btn");
squareBtn.addEventListener("click", () => {
    type = Type.Square;
    isDrawing = false;
});

const rectangleBtn = document.getElementById("rectangle-btn");
rectangleBtn.addEventListener("click", () => {
    type = Type.Rectangle;
    isDrawing = false;
});

const polygonBtn = document.getElementById("polygon-btn");
polygonBtn.addEventListener("click", () => {
    type = Type.Polygon;
    isDrawing = false;
    // isFirstDrawing = true;
});


  
    // const saveBtn = document.getElementById("save-btn");
    // saveBtn.addEventListener("click", () => {
    //     FileHandling.download(FileSystem.serialize(objects));
    // });
    
    // const uploadBtn = document.getElementById("load-btn");
    // uploadBtn.addEventListener("click", () => {
    //     FileHandling.upload((text) => {
    //     objects = FileSystem.load(text);
    
    //     for (const object of objects) {
    //         object.setupOption(true);
    //     }
    
    //     renderCanvas();
    //     });
    // });
/* Canvas Listener */
canvas.addEventListener("mousedown", (event) => {
    const x = event.clientX;
    const y = event.clientY;
    const point = new Point([x, y]);
  
    switch (type) {
      case Type.Line:
        if (!isDrawing) {
          const line = new Line(shapes.length, point);
          shapes.push(line);
  
          isDrawing = true;
        } else {
          const line = shapes[shapes.length - 1] as Line;
          line.draw(point);
          render(gl, programInfo, line);
          setupOption(true, line);
  
          isDrawing = false;
        }
        break;
  
      case Type.Square:
        if (!isDrawing) {
          const square = new Square(shapes.length, point);
          shapes.push(square);
  
          isDrawing = true;
        } else {
          const square = shapes[shapes.length - 1] as Square;
          square.draw(point);
          render(gl, programInfo, square);
          setupOption(true, square);
  
          isDrawing = false;
        }
        break;
  
      case Type.Rectangle:
        if (!isDrawing) {
          const rectangle = new Rectangle(shapes.length, point);
          shapes.push(rectangle);
  
          isDrawing = true;
        } else {
          const rectangle =shapes[shapes.length - 1] as Rectangle;
  
          rectangle.draw(point);
          render(gl, programInfo, rectangle);
          setupOption(true, rectangle);
  
          isDrawing = false;
        }
        break;
  
      case Type.Polygon:
        if (!isDrawing) {
          const polygon = new Polygon(shapes.length, point);
          shapes.push(polygon);
  
          isDrawing = true;
        } else {
          const polygon = shapes[shapes.length - 1] as Polygon;
  
          polygon.draw(point);
          render(gl, programInfo, polygon);
          setupOption(isFirstDrawing, polygon);
  
          isFirstDrawing = false;
        }
        break;
  
      case Type.POLYGON_REDRAW:
        const polygon = objects[polygonRedrawIndex] as Polygon;
  
        polygon.updatePoint(point);
        polygon.render(gl, program, positionBuffer, colorBuffer);
  
        break;
    }
  });
  
  canvas.addEventListener("mousemove", (event) => {
    const x = event.clientX;
    const y = event.clientY;
    const point = new Point([x, y]);
  
    if (isDrawing) {
      switch (type) {
        case Type.Line:
          const line = shapes[shapes.length - 1] as Line;
          line.draw(point);
          render(gl, programInfo, line);
          break;
  
        case Type.Square:
          const square = shapes[shapes.length - 1] as Square;
          square.draw(point);
          render(gl, programInfo, square);
          break;
  
        case Type.Rectangle:
          const rectangle = shapes[shapes.length - 1] as Rectangle;
          rectangle.draw(point);
          render(gl, programInfo, rectangle);
          break;
  
        case Type.Polygon:
          /* Do Nothing */
          break;
  
        default:
          throw new Error("Shape type is not defined");
      }
    }
  });
    // =========================================================



    // =========================================================
    // Initialize Dynamic HTML Elements & Set Event Listeners





    // =========================================================


function setupOption(isFirstDrawing: boolean, element: (Renderable&Transformable&Shape)): void {
    const option = document.createElement("option");
    option.value = element.id.toString();
    option.text = `${element.type.toString()}_${element.id}`;

    if (isFirstDrawing) {
      const listOfShapes = document.getElementById(
        "list-of-shapes"
      ) as HTMLSelectElement;
      listOfShapes.appendChild(option);
      listOfShapes.value = element.id.toString();
    }

    setupSelector(gl, programInfo, element);
  }

function setupSelector(gl: WebGLRenderingContext, programInfo: ProgramInfo, element: (Renderable&Transformable&Shape)): void {
    const sliderX = document.getElementById("sliderX") as HTMLInputElement;
    sliderX.min = "-600";
    sliderX.max = "600";
    sliderX.value = element.tx.toString();
    sliderX.step = "10";

    sliderX.addEventListener("input",(event)=>{
        const deltaX = (event.target as HTMLInputElement).value;
        element.tx = Number(deltaX);
    })

    const sliderY = document.getElementById("sliderY") as HTMLInputElement;
    sliderY.min = "-600";
    sliderY.max = "600";
    sliderY.value = (-element.ty).toString();
    sliderY.step = "10";
    sliderX.addEventListener("input",(event)=>{
        const deltaY = (event.target as HTMLInputElement).value;
        element.ty = -Number(deltaY);
    })

    const sliderLength = document.getElementById("sliderLength") as HTMLInputElement;
    sliderLength.min = "0"
    sliderLength.max = "600"
    let length: number;
    if (element.type === Type.Polygon) {
        let min = Infinity;
        let max = -Infinity;

        for (const p of element.arrayOfPoints) {
            const [pX] = p.getPair();
            if (pX < min) {
                min = pX;
            }
            if (pX > max) {
                max = pX;
            }
        }
        length = max - min;
    } else {
        length = Math.sqrt((element.arrayOfPoints[0].x - element.arrayOfPoints[1].x)**2 + (element.arrayOfPoints[0].y - element.arrayOfPoints[1].y)**2);
    }
    sliderLength.value = ((element.sx - 1) * length).toString();
    sliderLength.addEventListener("input", (event) => {
        const deltaLength = (event.target as HTMLInputElement).value;
        element.sx = 1 + Number(deltaLength) / length;
      });

    const sliderWidth = document.getElementById("sliderWidth") as HTMLInputElement;
    sliderWidth.min = "0"
    sliderWidth.max = "600"
    let width: number;

    if(element.type == Type.Rectangle){
        width = Math.sqrt((element.arrayOfPoints[0].x - element.arrayOfPoints[3].x)**2 + (element.arrayOfPoints[0].y - element.arrayOfPoints[3].y)**2);
    }else if(element.type == Type.Polygon){
        let min = Infinity;
        let max = -Infinity;

        for (const p of element.arrayOfPoints) {
            const [, pY] = p.getPair();
            if (pY < min) {
                min = pY;
            }
            if (pY > max) {
                max = pY;
            }
        }
        length = max - min;
    }else{
        width = 0;
    }
    sliderWidth.value = ((element.sy - 1) * width).toString();
    sliderWidth.addEventListener("input",(event)=>{
        const deltaWidth = (event.target as HTMLInputElement).value;
        element.sy = 1 + Number(deltaWidth) / width;
    })

    const sliderRotation = document.getElementById("sliderRotation") as HTMLInputElement;
    sliderRotation.min = "0";
    sliderRotation.max = "360";
    sliderRotation.value = ((180 * element.degree) / Math.PI).toString()
    sliderRotation.step = "10";
    sliderRotation.addEventListener("input",(event)=>{
        const deltaDegree = (event.target as HTMLInputElement).value;
        element.degree = Number(deltaDegree)/180 * Math.PI
    })

    const sliderShearX = document.getElementById("sliderShearX") as HTMLInputElement;
    sliderShearX.min = "-600";
    sliderShearX.max = "600";
    sliderShearX.value = element.kx.toString();
    sliderShearX.step = "10";

    sliderShearX.addEventListener("input",(event)=>{
        const deltaShearX = (event.target as HTMLInputElement).value;
        element.kx = Number(deltaShearX);
    })

    const sliderShearY = document.getElementById("sliderShearY") as HTMLInputElement;
    sliderShearY.min = "-600";
    sliderShearY.max = "600";
    sliderShearY.value = element.ky.toString();
    sliderShearY.step = "10";

    sliderShearX.addEventListener("input",(event)=>{
        const deltaShearY = (event.target as HTMLInputElement).value;
        element.ky = Number(deltaShearY);
    })

    const pointPicker = document.getElementById("pointPicker") as HTMLOptionElement;
    pointPicker.addEventListener("change", () => {
        const pointIndex: number = Number(pointPicker.value);
        setupColorPicker(gl, programInfo, pointIndex, element);
    })    
    for (let i = 0; i < element.arrayOfPoints.length; i++) {
        const newPoint = document.createElement("option");
        newPoint.value = i.toString();
        newPoint.text = "point_" + i;
        pointPicker.appendChild(newPoint);
    }


}


function setupColorPicker(gl: WebGLRenderingContext, programInfo: ProgramInfo, pointIndex: number, element: (Renderable&Transformable&Shape) ) {
    const colorSelector = document.getElementById("color-picker");
    colorSelector.innerHTML = "";
    colorSelector.replaceChildren();

    const colorTitle = document.createElement("h2");
    colorTitle.textContent = "Select color";

    const colorInput = document.createElement("input");
    colorInput.id = "color-input";
    colorInput.type = "color";

    colorInput.value = rgbToHex(element.arrayOfPoints[pointIndex].getColor());
    colorInput.addEventListener("change", (event) => {
      const hex = (event.target as HTMLInputElement).value;

      element.arrayOfPoints[pointIndex].setColor(hexToRgb(hex));
    });

    if (element instanceof Polygon) {
        const deletePointButton = document.createElement("button");
        deletePointButton.textContent = "delete point";
        deletePointButton.className = "btn";
        deletePointButton.addEventListener("click", () => {
          element.deletePoint(pointIndex);
          renderAll(gl, programInfo, shapes);
        });
        colorSelector.append(colorTitle, colorInput, deletePointButton);
    } 

  }