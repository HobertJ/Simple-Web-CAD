import Renderable from "Interfaces/renderable.interface";
import Transformable from "Interfaces/transformable.interface";
import Shape from "Shapes/shape";
import Line from "Shapes/line";
import Square from "Shapes/square";
import Rectangle from "Shapes/rectangle";
import Point from "Base/point";
import Polygon from "Shapes/polygon";
import Type from "Shapes/type.enum";
import { createShaderProgram } from "Functions/create-shader-program";
import ProgramInfo from "Functions/program-info.interface";
import { setAttributes } from "./Functions/set-attributes";
import { setupCanvas } from "./Functions/setup-canvas";
import Transformation from "Operations/Transformation";
import { hexToRgb, rgbToHex } from "Utils/tools";
import { render } from "Functions/render";
import { renderAll } from "Functions/render-all";

const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
// Initialize the GL context
const gl = canvas.getContext("webgl");

// Only continue if WebGL is available and working
if (gl === null) {
  alert(
    "Unable to initialize WebGL. Your browser or machine may not support it."
  );
}


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
    precision mediump float;
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
    matrixLocation: gl.getUniformLocation(shaderProgram, "uMatrix"),
  },
};

// Tell WebGL to use our program when drawing
gl.useProgram(shaderProgram);

const width = (gl.canvas as HTMLCanvasElement).clientWidth;
const height = (gl.canvas as HTMLCanvasElement).clientHeight;
canvas.width = width;
canvas.height = height;
// Set clear color to black, fully opaque
gl.clearColor(1.0, 1.0, 1.0, 1.0);
// Clear the color buffer with specified clear color


gl.viewport(0, 0, gl.canvas.width, gl.canvas.height); // sets the viewport to cover the entire canvas, starting from the lower-left corner and extending to the canvas's width and height.

// Clear the canvas before we start drawing on it.
gl.clear(gl.COLOR_BUFFER_BIT);

// ===============================================================================================
// const canvas = document.getElementById("canvas") as HTMLCanvasElement;
let shapes: (Shape & Renderable & Transformable)[] = [];
let type: Type;
let isDrawing = false;

/* Setup Viewport */

const positionBuffer = gl.createBuffer();
const colorBuffer = gl.createBuffer();
// gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
// gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
// setAttributes(gl, positionBuffer, colorBuffer, programInfo);

let currentObject: Shape & Renderable & Transformable;
// =========================================================
// Fix HTML Elements Event Listeners

/* List of Shapes Listener */
const listOfShapes = document.getElementById("list-of-shapes") as HTMLSelectElement;
listOfShapes.addEventListener("change", () => {
  renderAll(gl, programInfo, shapes, positionBuffer, colorBuffer);
  const index: number = +listOfShapes.selectedOptions[0].value;
  isDrawing = false;

  setupSelector(gl, programInfo, shapes[index]);
});

/* Button Listener */
const lineBtn = document.getElementById("line-btn");
lineBtn.addEventListener("click", () => {
  renderAll(gl, programInfo, shapes, positionBuffer, colorBuffer);
  type = Type.Line;
  isDrawing = false;
});

const squareBtn = document.getElementById("square-btn");
squareBtn.addEventListener("click", () => {
  renderAll(gl, programInfo, shapes, positionBuffer, colorBuffer);
  type = Type.Square;
  isDrawing = false;
});

const rectangleBtn = document.getElementById("rectangle-btn");
rectangleBtn.addEventListener("click", () => {
  renderAll(gl, programInfo, shapes, positionBuffer, colorBuffer);
  type = Type.Rectangle;
  isDrawing = false;
});

const polygonBtn = document.getElementById("polygon-btn");
polygonBtn.addEventListener("click", () => {
  renderAll(gl, programInfo, shapes, positionBuffer, colorBuffer);
  type = Type.Polygon;
  isDrawing = false;
  // isFirstDrawing = true;
});

const saveBtn = document.getElementById("save-btn");
saveBtn.addEventListener("click", () => {
  renderAll(gl, programInfo, shapes, positionBuffer, colorBuffer);
  const text = storeShapes(shapes);
  handleDownload(text);
});

const uploadBtn = document.getElementById("upload-btn");
uploadBtn.addEventListener("click", () => {
  handleUpload((text) => {
    shapes = loadShape(text);

    for (const shape of shapes) {
      setupOption(true, shape);
    }

    renderAll(gl, programInfo, shapes, positionBuffer, colorBuffer);
  });
});

/* Canvas Listener */
canvas.addEventListener("mousedown", (event) => {
  const x = event.clientX;
  const y = event.clientY;
  const point = new Point([x, y]);

  if (isDrawing) {
    if (currentObject.type !== Type.Polygon) {
      currentObject.draw(point);
      setupOption(true, currentObject);
      shapes.push(currentObject);
      isDrawing = false;
      currentObject = null;
    } else {
      if (currentObject.id == shapes.length) {
        currentObject.draw(point);
        // belum dipush ke shapes
        if (currentObject.arrayOfPoints.length >=3) {
          setupOption(true, currentObject);
          // render(gl, programInfo, currentObject, positionBuffer, colorBuffer);
          shapes.push(currentObject);
          renderAll(gl, programInfo, shapes, positionBuffer, colorBuffer);
          isDrawing = false;
          currentObject = null;
        } else {
          renderAll(gl, programInfo, shapes, positionBuffer, colorBuffer);
          render(gl, programInfo, currentObject, positionBuffer, colorBuffer);
        }
      } else {
        const matrix = Transformation.inverseTransformationMatrix(
          gl.canvas.width,
          gl.canvas.height,
          currentObject.tx,
          currentObject.ty,
          currentObject.degree,
          currentObject.sx,
          currentObject.sy,
          currentObject.kx,
          currentObject.ky,
          currentObject.center
        );
        const point2 = matrix.multiplyPoint(point);
        currentObject.draw(point2);
        setupOption(false, currentObject);
        // render(gl, programInfo, currentObject, positionBuffer, colorBuffer);
        renderAll(gl, programInfo, shapes, positionBuffer, colorBuffer);
      }
    }
  } else {
    switch (type) {
      case Type.Line:
        currentObject = new Line(shapes.length, point);
        isDrawing = true;
        break;
      case Type.Square:
        currentObject = new Square(shapes.length, point);
        isDrawing = true;
        break;
      case Type.Rectangle:
        currentObject = new Rectangle(shapes.length, point);
        isDrawing = true;
        break;
      case Type.Polygon:
        currentObject = new Polygon(shapes.length, point);
        isDrawing = true;
        break;
    }
  }
});

canvas.addEventListener("mousemove", (event) => {
  if (isDrawing && currentObject.type !== Type.Polygon) {
    const x = event.clientX;
    const y = event.clientY;
    const point = new Point([x, y]);
    currentObject.draw(point);
    renderAll(gl, programInfo, shapes, positionBuffer, colorBuffer);
    render(gl, programInfo, currentObject, positionBuffer, colorBuffer);
  }
});

function setupOption(
  isFirstDrawing: boolean,
  element: Renderable & Transformable & Shape
): void {
  const option = document.createElement("option");
  option.value = element.id.toString();
  let optionText: string;
  switch (element.type) {
    case Type.Line:
      optionText = `Line_${element.id}`;
      break;
    case Type.Square:
      optionText = `Square_${element.id}`;
      break;
    case Type.Rectangle:
      optionText = `Rectangle_${element.id}`;
      break;
    case Type.Polygon:
      optionText = `Polygon_${element.id}`;
      break;
  }
  option.text = optionText;

  if (isFirstDrawing) {
    const listOfShapes = document.getElementById(
      "list-of-shapes"
    ) as HTMLSelectElement;
    listOfShapes.appendChild(option);
    listOfShapes.value = element.id.toString();
  }

  setupSelector(gl, programInfo, element);
}

function setupSelector(
  gl: WebGLRenderingContext,
  programInfo: ProgramInfo,
  element: Renderable & Transformable & Shape
): void {
  const sliderX_original = document.getElementById("sliderX") as HTMLInputElement;
  const sliderX = sliderX_original.cloneNode(true) as HTMLInputElement;
  sliderX_original.parentNode.replaceChild(sliderX, sliderX_original);
  sliderX.min = "-600";
  sliderX.max = "600";
  sliderX.value = element.tx.toString();
  sliderX.step = "10";

  sliderX.addEventListener("input", (event) => {
    const deltaX = (event.target as HTMLInputElement).value;
    element.tx = Number(deltaX);
    renderAll(gl, programInfo, shapes, positionBuffer, colorBuffer);
  });   

  const sliderY_original = document.getElementById("sliderY") as HTMLInputElement;
  const sliderY = sliderY_original.cloneNode(true) as HTMLInputElement;
  sliderY_original.parentNode.replaceChild(sliderY, sliderY_original);
  sliderY.min = "-600";
  sliderY.max = "600";
  sliderY.value = (-element.ty).toString();
  sliderY.step = "10";
  sliderY.addEventListener("input", (event) => {
    const deltaY = (event.target as HTMLInputElement).value;
    element.ty = -Number(deltaY);
    renderAll(gl, programInfo, shapes, positionBuffer, colorBuffer);
  });

  const sliderLength_original = document.getElementById(
    "sliderLength"
  ) as HTMLInputElement;
  const sliderLength = sliderLength_original.cloneNode(true) as HTMLInputElement;
  sliderLength_original.parentNode.replaceChild(sliderLength, sliderLength_original);
  sliderLength.min = "0";
  sliderLength.max = "600";
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
    length = Math.sqrt(
      (element.arrayOfPoints[0].x - element.arrayOfPoints[1].x) ** 2 +
        (element.arrayOfPoints[0].y - element.arrayOfPoints[1].y) ** 2
    );
  }
  sliderLength.value = ((element.sx - 1) * length).toString();
  sliderLength.addEventListener("input", (event) => {
    const deltaLength = (event.target as HTMLInputElement).value;
    element.sx = 1 + Number(deltaLength) / length;
    if (element.type == Type.Square){
      element.sy = 1 + Number(deltaLength) / length;
    }
    renderAll(gl, programInfo, shapes, positionBuffer, colorBuffer);
  });

  const sliderWidth_original = document.getElementById(
    "sliderWidth"
  ) as HTMLInputElement;
  const sliderWidth = sliderWidth_original.cloneNode(true) as HTMLInputElement;
  sliderWidth_original.parentNode.replaceChild(sliderWidth, sliderWidth_original);
  if(element.type == Type.Line || element.type == Type.Square) {
    sliderWidth.disabled = true;
  } else {
    sliderWidth.disabled = false;
  }
  sliderWidth.min = "0";
  sliderWidth.max = "600";
  let width: number;

  if (element.type == Type.Rectangle || element.type == Type.Square) {
    width = Math.sqrt(
      (element.arrayOfPoints[0].x - element.arrayOfPoints[3].x) ** 2 +
        (element.arrayOfPoints[0].y - element.arrayOfPoints[3].y) ** 2
    );
  } else if (element.type == Type.Polygon) {
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
    width = max - min;
  } 
  sliderWidth.value = ((element.sy - 1) * width).toString();
  sliderWidth.addEventListener("input", (event) => {
    const deltaWidth = (event.target as HTMLInputElement).value;
    element.sy = 1 + Number(deltaWidth) / width;
    renderAll(gl, programInfo, shapes, positionBuffer, colorBuffer);
  });

  const sliderRotation_original = document.getElementById(
    "sliderRotation"
  ) as HTMLInputElement;
  const sliderRotation_value = document.getElementById(
    "slider-rotation-value"
  ) as HTMLInputElement;
  const sliderRotation = sliderRotation_original.cloneNode(true) as HTMLInputElement;
  sliderRotation_original.parentNode.replaceChild(sliderRotation, sliderRotation_original);
  sliderRotation.min = "0";
  sliderRotation.max = "360";
  sliderRotation.value = ((180 * element.degree) / Math.PI).toString();
  sliderRotation_value.textContent = ((180 * element.degree) / Math.PI).toFixed(0).toString(); 
  sliderRotation.step = "10";
  sliderRotation.addEventListener("input", (event) => {
    const deltaDegree = (event.target as HTMLInputElement).value;
    element.degree = (Number(deltaDegree) / 180) * Math.PI;
    sliderRotation_value.textContent = ((180 * element.degree) / Math.PI).toFixed(0).toString(); 
    renderAll(gl, programInfo, shapes, positionBuffer, colorBuffer);
  });

  const sliderShearX_original = document.getElementById(
    "sliderShearX"
  ) as HTMLInputElement;
  const sliderShearX = sliderShearX_original.cloneNode(true) as HTMLInputElement;
  sliderShearX_original.parentNode.replaceChild(sliderShearX, sliderShearX_original);
  sliderShearX.min = "0";
  sliderShearX.max = "10";
  sliderShearX.value = element.kx.toString();
  sliderShearX.step = "0.1";

  sliderShearX.addEventListener("input", (event) => {
    const deltaShearX = (event.target as HTMLInputElement).value;
    element.kx = Number(deltaShearX);
    renderAll(gl, programInfo, shapes, positionBuffer, colorBuffer);
  });

  const sliderShearY_original = document.getElementById(
    "sliderShearY"
  ) as HTMLInputElement;
  const sliderShearY = sliderShearY_original.cloneNode(true) as HTMLInputElement;
  sliderShearY_original.parentNode.replaceChild(sliderShearY, sliderShearY_original);
  sliderShearY.min = "0";
  sliderShearY.max = "10";
  sliderShearY.value = element.ky.toString();
  sliderShearY.step = "0.1";

  sliderShearY.addEventListener("input", (event) => {
    const deltaShearY = (event.target as HTMLInputElement).value;
    element.ky = Number(deltaShearY);
    renderAll(gl, programInfo, shapes, positionBuffer, colorBuffer);
  });

  const pointPicker_original = document.getElementById(
    "pointPicker"
  ) as HTMLSelectElement;
  const pointPicker = pointPicker_original.cloneNode(true) as HTMLSelectElement; 
  pointPicker_original.parentElement.replaceChild(pointPicker, pointPicker_original);
  pointPicker.innerHTML = "";
  pointPicker.addEventListener("change", () => {
    const pointIndex: number = Number(pointPicker.value);
    setupColorPicker(gl, programInfo, pointIndex, element);
  });
  for (let i = 0; i < element.arrayOfPoints.length; i++) {
    const newPoint = document.createElement("option");
    newPoint.value = i.toString();
    newPoint.text = "point_" + i;
    pointPicker.appendChild(newPoint);
  }

  // If the currentObject is not of type Polygon, remove the button
  const addPointButton = document.getElementById("btn-add-point");
  if (addPointButton) {
    addPointButton.remove();
  }

  if (element instanceof Polygon) {
    const addPointButton = document.createElement("button");
    addPointButton.textContent = "Add New Point";
    addPointButton.className = "btn btn-primary add-btn";
    addPointButton.id = "btn-add-point";
    addPointButton.addEventListener("click", () => {
      // Set a flag to indicate that a new point is being added
      isDrawing = true;
      currentObject = shapes[element.id]
    });

    // Append the button to the DOM
    const polygonBtn = document.querySelector(".polygon-btn-section");
    if (polygonBtn) {
      polygonBtn.appendChild(addPointButton);
    }
  } 
  setupColorPicker(gl, programInfo, 0, element);
}

function setupColorPicker(
  gl: WebGLRenderingContext,
  programInfo: ProgramInfo,
  pointIndex: number,
  element: Renderable & Transformable & Shape
) {
  const colorPicker_original = document.getElementById(
    "colorPicker"
  ) as HTMLInputElement;
  const colorPicker = colorPicker_original.cloneNode(true) as HTMLInputElement;
  const color = rgbToHex(element.arrayOfPoints[pointIndex].getColor());
  colorPicker.value = color; 
  colorPicker_original.parentElement.replaceChild(colorPicker, colorPicker_original);

  colorPicker.addEventListener("change", (event) => {
    const hex = (event.target as HTMLInputElement).value;
    element.arrayOfPoints[pointIndex].setColor(hexToRgb(hex));
    renderAll(gl, programInfo, shapes, positionBuffer, colorBuffer);
  });

  const deletePointButton = document.getElementById("btn-delete-point");
  if (deletePointButton) {
    deletePointButton.remove();
  }
  if (element instanceof Polygon) {
    const deletePointButton = document.createElement("button");
    deletePointButton.textContent = "Delete Point";
    deletePointButton.className = "btn btn-primary delete-btn";
    deletePointButton.id = "btn-delete-point";
    deletePointButton.addEventListener("click", () => {
      element.deletePoint(pointIndex);
      renderAll(gl, programInfo, shapes, positionBuffer, colorBuffer);
    });

    const polygonBtn = document.querySelector(".polygon-btn-section");
    if (polygonBtn) {
      polygonBtn.appendChild(deletePointButton);
    }
  }
}

// loadshape from json to array of shape
function loadShape(text: string): (Shape & Renderable & Transformable)[] {
  const shape: (Shape & Renderable & Transformable)[] = [];
  const data = JSON.parse(text);
  for (const item of data) {
    const tx = item.tx;
    const ty = item.ty;
    const degree = item.degree;
    const sx = item.sx;
    const sy = item.sy;
    const kx = item.kx;
    const ky = item.ky;
    const center = new Point([item.center.x, item.center.y]);
    let arrayOfPoints: Point[] = [];
    for (const point of item.arrayOfPoints) {
      let p = new Point(
        [point.x, point.y],
        [point.r, point.g, point.b, point.a]
      );
      arrayOfPoints.push(p);
    }
    switch (item.type) {
      case Type.Line:
        const line = new Line(item.id, arrayOfPoints[0]);
        line.setLineAttributes(
          tx,
          ty,
          degree,
          sx,
          sy,
          kx,
          ky,
          arrayOfPoints[1]
        );
        shape.push(line);
        break;
      case Type.Square:
        const square = new Square(item.id, center);
        square.setSquareAttributes(
          tx,
          ty,
          degree,
          sx,
          sy,
          kx,
          ky,
          arrayOfPoints
        );
        shape.push(square);
        break;
      case Type.Rectangle:
        const rectangle = new Rectangle(item.id, arrayOfPoints[0]);
        rectangle.setRectangleAttributes(
          tx,
          ty,
          degree,
          sx,
          sy,
          kx,
          ky,
          arrayOfPoints
        );
        shape.push(rectangle);
        break;
      case Type.Polygon:
        const polygon = new Polygon(item.id, arrayOfPoints[0]);
        polygon.setPolygonAttributes(
          tx,
          ty,
          degree,
          sx,
          sy,
          kx,
          ky,
          arrayOfPoints
        );
        shape.push(polygon);
        break;
    }
  }
  return shape;
}

function storeShapes(shape: Shape[]): string {
  return JSON.stringify(shape);
}

function handleDownload(text: string): void {
  const data = new File([text], "shapes.json", { type: "application/json" });

  const url = URL.createObjectURL(data);

  const a = document.createElement("a");
  a.href = url;
  a.download = data.name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function handleUpload(callback: (text: string) => void): void {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "application/json";

  input.addEventListener("change", () => {
    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      callback(reader.result as string);
    };
    reader.readAsText(file);
  });

  document.body.appendChild(input);
  input.click();
  document.body.removeChild(input);
}
