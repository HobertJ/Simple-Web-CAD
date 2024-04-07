import Renderable from "./2D-Shapes/Interfaces/renderable.interface";
import Transformable from "./2D-Shapes/Interfaces/transformable.interface";
import Shape from "./2D-Shapes/shape";
import Type from "./2D-Shapes/type.enum";
import { createShaderProgram } from "./Functions/create-shader-program";
import ProgramInfo from "./Functions/program-info.interface";
import { setAttributes } from "./Functions/set-attributes";
import { setupCanvas } from "./Functions/setup-canvas";
import Transformation from "./Operations/Transformation";
import { hexToRgb, rgbToHex } from "./Utils/tools";

main();

function main() {
    const gl = setupCanvas()

    if (gl===null) {
        return;
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

    const shapes : Shape[] = [];
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
    
        // shapes[index].setupSelector(index);

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




    // =========================================================



    // =========================================================
    // Initialize Dynamic HTML Elements & Set Event Listeners





    // =========================================================   

}