/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/2D-Shapes/line.ts":
/*!*******************************!*\
  !*** ./src/2D-Shapes/line.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const shape_1 = __importDefault(__webpack_require__(/*! ./shape */ "./src/2D-Shapes/shape.ts"));
const type_enum_1 = __importDefault(__webpack_require__(/*! ./type.enum */ "./src/2D-Shapes/type.enum.ts"));
const point_1 = __importDefault(__webpack_require__(/*! ../Base/point */ "./src/Base/point.ts"));
const Transformation_1 = __importDefault(__webpack_require__(/*! Main/Operations/Transformation */ "./src/Operations/Transformation.ts"));
class Line extends shape_1.default {
    constructor(id, p1) {
        super(id, 2, type_enum_1.default.Line);
        this.arrayOfPoints = [p1];
        this.tx = 0;
        this.ty = 0;
        this.degree = 0;
        this.sx = 1;
        this.sy = 1;
        this.kx = 0;
        this.ky = 0;
    }
    // Transformable Methods
    addMatrix(gl, matrixLocation) {
        const matrix = Transformation_1.default.transformationMatrix(gl.canvas.width, gl.canvas.height, this.tx, this.ty, this.degree, this.sx, this.sy, this.kx, this.ky, this.getCenter()).flatten();
        gl.uniformMatrix3fv(matrixLocation, false, matrix);
    }
    getCenter() {
        const numPoints = this.arrayOfPoints.length;
        let centerX = 0;
        let centerY = 0;
        for (const point of this.arrayOfPoints) {
            const [x, y] = point.getPair();
            centerX += x;
            centerY += y;
        }
        centerX /= numPoints;
        centerY /= numPoints;
        return new point_1.default([centerX, centerY], [0, 0, 0, 0]);
    }
    drawMethod(gl) {
        return gl.LINES;
    }
    isDrawable() {
        return this.arrayOfPoints.length === 2;
    }
    draw(point) {
        this.arrayOfPoints[1] = point;
    }
    getNumberOfVerticesToBeDrawn() {
        return this.arrayOfPoints.length;
    }
    addPosition(gl) {
        const vertices = new Float32Array(this.arrayOfPoints.reduce((acc, point) => {
            acc.push(...point.getPair());
            return acc;
        }, []));
        console.log("haleluya");
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    }
    addColor(gl) {
        const colors = new Float32Array(this.arrayOfPoints.reduce((acc, point) => {
            acc.push(...point.getColor());
            return acc;
        }, []));
        gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
    }
    setLineAttributes(tx, ty, degree, sx, sy, kx, ky, p2) {
        this.arrayOfPoints.push(p2);
        this.tx = tx;
        this.ty = ty;
        this.degree = degree;
        this.sx = sx;
        this.sy = sy;
        this.kx = kx;
        this.ky = ky;
    }
}
exports["default"] = Line;


/***/ }),

/***/ "./src/2D-Shapes/polygon.ts":
/*!**********************************!*\
  !*** ./src/2D-Shapes/polygon.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Transformation_1 = __importDefault(__webpack_require__(/*! Main/Operations/Transformation */ "./src/Operations/Transformation.ts"));
const shape_1 = __importDefault(__webpack_require__(/*! ./shape */ "./src/2D-Shapes/shape.ts"));
const type_enum_1 = __importDefault(__webpack_require__(/*! ./type.enum */ "./src/2D-Shapes/type.enum.ts"));
const point_1 = __importDefault(__webpack_require__(/*! Main/Base/point */ "./src/Base/point.ts"));
const convex_hull_1 = __importDefault(__webpack_require__(/*! Main/Operations/convex-hull */ "./src/Operations/convex-hull.ts"));
class Polygon extends shape_1.default {
    constructor(id, point) {
        super(id, 1, type_enum_1.default.Polygon);
        this.arrayOfPoints = new Array(point);
        this.tx = 0;
        this.ty = 0;
        this.degree = 0;
        this.sx = 1;
        this.sy = 1;
        this.kx = 0;
        this.ky = 0;
    }
    getCenter() {
        let sumX = 0;
        let sumY = 0;
        for (let i = 0; i < this.arrayOfPoints.length; i++) {
            const [x, y] = this.arrayOfPoints[i].getPair();
            sumX += x;
            sumY += y;
        }
        const centerX = sumX / this.arrayOfPoints.length;
        const centerY = sumY / this.arrayOfPoints.length;
        return new point_1.default([centerX, centerY], [0, 0, 0, 0]);
    }
    isDrawable() {
        return this.arrayOfPoints.length >= 3;
    }
    draw(point) {
        this.arrayOfPoints = (0, convex_hull_1.default)([...this.arrayOfPoints, point]);
    }
    drawMethod(gl) {
        return this.isDrawable() ? gl.TRIANGLE_FAN : gl.LINES;
    }
    getNumberOfVerticesToBeDrawn() {
        return this.arrayOfPoints.length + 1;
    }
    addPosition(gl) {
        const vertices = new Float32Array(this.arrayOfPoints.length * 2);
        for (let i = 0; i < this.arrayOfPoints.length; i++) {
            const [x, y] = this.arrayOfPoints[i].getPair();
            vertices[i * 2] = x;
            vertices[i * 2 + 1] = y;
        }
        const [pInitialX, pInitialY] = this.arrayOfPoints[0].getPair();
        vertices[this.arrayOfPoints.length * 2] = pInitialX;
        vertices[this.arrayOfPoints.length * 2 + 1] = pInitialY;
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    }
    addColor(gl) {
        const colors = new Float32Array(this.arrayOfPoints.length * 4);
        for (let i = 0; i < this.arrayOfPoints.length; i++) {
            const [r, g, b, a] = this.arrayOfPoints[i].getColor();
            colors[i * 4] = r;
            colors[i * 4 + 1] = g;
            colors[i * 4 + 2] = b;
            colors[i * 4 + 3] = a;
        }
        const [rInitial, gInitial, bInitial, aInitial] = this.arrayOfPoints[0].getColor();
        colors[this.arrayOfPoints.length * 4] = rInitial;
        colors[this.arrayOfPoints.length * 4 + 1] = gInitial;
        colors[this.arrayOfPoints.length * 4 + 2] = bInitial;
        colors[this.arrayOfPoints.length * 4 + 3] = aInitial;
        gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
    }
    addMatrix(gl, matrixLocation) {
        const matrix = Transformation_1.default.transformationMatrix(gl.canvas.width, gl.canvas.height, this.tx, this.ty, this.degree, this.sx, this.sy, this.kx, this.ky, this.center).flatten();
        gl.uniformMatrix3fv(matrixLocation, false, matrix);
    }
    deletePoint(index) {
        var newPoints = [this.arrayOfPoints[index]];
        for (let i = 0; i < this.arrayOfPoints.length; i++) {
            if (i != index) {
                newPoints.push(this.arrayOfPoints[i]);
            }
        }
        this.arrayOfPoints = newPoints.slice(1, this.arrayOfPoints.length);
        // after delete, need to setup option again
        const pointPicker = document.getElementById("pointPicker");
        pointPicker.innerHTML = "";
        pointPicker.replaceChildren();
        /* All Point */
        for (let i = 0; i < this.arrayOfPoints.length; i++) {
            const newPoint = document.createElement("option");
            newPoint.value = i.toString();
            newPoint.text = "point_" + i;
            pointPicker.appendChild(newPoint);
        }
    }
    setPolygonAttributes(tx, ty, degree, sx, sy, kx, ky, arrayOfPoints) {
        this.arrayOfPoints = arrayOfPoints;
        this.tx = tx;
        this.ty = ty;
        this.degree = degree;
        this.sx = sx;
        this.sy = sy;
        this.kx = kx;
        this.ky = ky;
    }
}
exports["default"] = Polygon;


/***/ }),

/***/ "./src/2D-Shapes/rectangle.ts":
/*!************************************!*\
  !*** ./src/2D-Shapes/rectangle.ts ***!
  \************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const shape_1 = __importDefault(__webpack_require__(/*! Shapes/shape */ "./src/2D-Shapes/shape.ts"));
const point_1 = __importDefault(__webpack_require__(/*! Base/point */ "./src/Base/point.ts"));
const type_enum_1 = __importDefault(__webpack_require__(/*! Shapes/type.enum */ "./src/2D-Shapes/type.enum.ts"));
const Transformation_1 = __importDefault(__webpack_require__(/*! Main/Operations/Transformation */ "./src/Operations/Transformation.ts"));
class Rectangle extends shape_1.default {
    constructor(id, p1) {
        super(id, 4, type_enum_1.default.Rectangle);
        this.arrayOfPoints = [p1, null, null, null];
        this.tx = 0;
        this.ty = 0;
        this.degree = 0;
        this.sx = 1;
        this.sy = 1;
        this.kx = 0;
        this.ky = 0;
    }
    // Transformable Methods
    getCenter() {
        const [p1x, p1y] = this.arrayOfPoints[0].getPair();
        const [p2x, p2y] = this.arrayOfPoints[1].getPair();
        const [p3x, p3y] = this.arrayOfPoints[2].getPair();
        const [p4x, p4y] = this.arrayOfPoints[3].getPair();
        const centerX = (p1x + p2x + p3x + p4x) / 4;
        const centerY = (p1y + p2y + p3y + p4y) / 4;
        return new point_1.default([centerX, centerY]);
    }
    addMatrix(gl, matrixLocation) {
        const matrix = Transformation_1.default.transformationMatrix(gl.canvas.width, gl.canvas.height, this.tx, this.ty, this.degree, this.sx, this.sy, this.kx, this.ky, this.center).flatten();
        gl.uniformMatrix3fv(matrixLocation, false, matrix);
    }
    // Renderable Methods
    drawMethod(gl) {
        return gl.TRIANGLE_FAN;
    }
    isDrawable() {
        return this.arrayOfPoints.filter(point => point !== null).length === 4;
    }
    draw(point) {
        this.arrayOfPoints[1] = new point_1.default([this.arrayOfPoints[0].x, point.y]);
        this.arrayOfPoints[2] = point;
        this.arrayOfPoints[3] = new point_1.default([point.x, this.arrayOfPoints[0].y]);
    }
    getNumberOfVerticesToBeDrawn() {
        return this.arrayOfPoints.length;
    }
    addPosition(gl) {
        const vertices = new Float32Array(this.arrayOfPoints.reduce((acc, point) => {
            acc.push(...point.getPair());
            return acc;
        }, []));
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    }
    addColor(gl) {
        const colors = new Float32Array(this.arrayOfPoints.reduce((acc, point) => {
            acc.push(...point.getColor());
            return acc;
        }, []));
        gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
    }
    setRectangleAttributes(tx, ty, degree, sx, sy, kx, ky, arrayOfPoints) {
        this.arrayOfPoints = arrayOfPoints;
        this.tx = tx;
        this.ty = ty;
        this.degree = degree;
        this.sx = sx;
        this.sy = sy;
        this.kx = kx;
        this.ky = ky;
    }
}
exports["default"] = Rectangle;


/***/ }),

/***/ "./src/2D-Shapes/shape.ts":
/*!********************************!*\
  !*** ./src/2D-Shapes/shape.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class Shape {
    constructor(id, numberOfVertices, type) {
        this.id = id;
        this.numberOfVertices = numberOfVertices;
        this.type = type;
    }
}
exports["default"] = Shape;


/***/ }),

/***/ "./src/2D-Shapes/square.ts":
/*!*********************************!*\
  !*** ./src/2D-Shapes/square.ts ***!
  \*********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const shape_1 = __importDefault(__webpack_require__(/*! ./shape */ "./src/2D-Shapes/shape.ts"));
const Transformation_1 = __importDefault(__webpack_require__(/*! Main/Operations/Transformation */ "./src/Operations/Transformation.ts"));
const type_enum_1 = __importDefault(__webpack_require__(/*! ./type.enum */ "./src/2D-Shapes/type.enum.ts"));
class Square extends shape_1.default {
    constructor(id, centerPoint) {
        super(id, 4, type_enum_1.default.Square);
        this.center = centerPoint;
        this.arrayOfPoints = [];
        this.tx = 0;
        this.ty = 0;
        this.degree = 0;
        this.sx = 1;
        this.sy = 1;
        this.kx = 0;
        this.ky = 0;
    }
    // Transformable Methods
    getCenter() {
        return this.center;
    }
    addMatrix(gl, matrixLocation) {
        const matrix = Transformation_1.default.transformationMatrix(gl.canvas.width, gl.canvas.height, this.tx, this.ty, this.degree, this.sx, this.sy, this.kx, this.ky, this.center).flatten();
        gl.uniformMatrix3fv(matrixLocation, false, matrix);
    }
    // Renderable Methods
    drawMethod(gl) {
        return gl.TRIANGLE_FAN;
    }
    isDrawable() {
        return this.arrayOfPoints.length === 4;
    }
    draw(p1) {
        this.arrayOfPoints[0] = p1;
        if (this.arrayOfPoints.length === 1) {
            for (let i = 1; i <= 3; i++) {
                const angle = (i * Math.PI) / 2;
                const rotationMatrix = Transformation_1.default.translation(this.center.getX(), this.center.getY())
                    .multiplyMatrix(Transformation_1.default.rotation(angle))
                    .multiplyMatrix(Transformation_1.default.translation(-this.center.getX(), -this.center.getY()));
                const rotatedPoint = rotationMatrix.multiplyPoint(p1);
                this.arrayOfPoints[i] = rotatedPoint;
            }
        }
    }
    getNumberOfVerticesToBeDrawn() {
        return this.arrayOfPoints.length;
    }
    addPosition(gl) {
        const vertices = new Float32Array(this.arrayOfPoints.reduce((acc, point) => {
            acc.push(...point.getPair());
            return acc;
        }, []));
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    }
    addColor(gl) {
        const colors = new Float32Array(this.arrayOfPoints.reduce((acc, point) => {
            acc.push(...point.getColor());
            return acc;
        }, []));
        gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
    }
    setSquareAttributes(tx, ty, degree, sx, sy, kx, ky, arrayOfPoints) {
        this.arrayOfPoints = arrayOfPoints;
        this.tx = tx;
        this.ty = ty;
        this.degree = degree;
        this.sx = sx;
        this.sy = sy;
        this.kx = kx;
        this.ky = ky;
    }
}
exports["default"] = Square;


/***/ }),

/***/ "./src/2D-Shapes/type.enum.ts":
/*!************************************!*\
  !*** ./src/2D-Shapes/type.enum.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var Type;
(function (Type) {
    Type[Type["Line"] = 0] = "Line";
    Type[Type["Rectangle"] = 1] = "Rectangle";
    Type[Type["Square"] = 2] = "Square";
    Type[Type["Polygon"] = 3] = "Polygon";
})(Type || (Type = {}));
exports["default"] = Type;


/***/ }),

/***/ "./src/Base/coordinate.ts":
/*!********************************!*\
  !*** ./src/Base/coordinate.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class Coordinate {
    constructor(x, y, w) {
        this.x = x;
        this.y = y;
        this.w = w;
    }
    getCoordinate() {
        return [this.x, this.y, this.w];
    }
    setCoordinate(x, y, w) {
        this.x = x;
        this.y = y;
        this.w = w;
    }
    setX(x) {
        this.x = x;
    }
    setY(y) {
        this.y = y;
    }
    setW(w) {
        this.w = w;
    }
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
    getW() {
        return this.w;
    }
}
exports["default"] = Coordinate;


/***/ }),

/***/ "./src/Base/matrix.ts":
/*!****************************!*\
  !*** ./src/Base/matrix.ts ***!
  \****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const point_1 = __importDefault(__webpack_require__(/*! Base/point */ "./src/Base/point.ts"));
class Matrix {
    constructor(m1, m2, m3) {
        this.m1 = m1;
        this.m2 = m2;
        this.m3 = m3;
    }
    flatten() {
        return [...this.m1, ...this.m2, ...this.m3];
    }
    multiplyMatrix(otherMatrix) {
        const [a11, a12, a13] = this.m1;
        const [a21, a22, a23] = this.m2;
        const [a31, a32, a33] = this.m3;
        const [b11, b12, b13] = otherMatrix.m1;
        const [b21, b22, b23] = otherMatrix.m2;
        const [b31, b32, b33] = otherMatrix.m3;
        const c11 = a11 * b11 + a12 * b21 + a13 * b31;
        const c12 = a11 * b12 + a12 * b22 + a13 * b32;
        const c13 = a11 * b13 + a12 * b23 + a13 * b33;
        const c21 = a21 * b11 + a22 * b21 + a23 * b31;
        const c22 = a21 * b12 + a22 * b22 + a23 * b32;
        const c23 = a21 * b13 + a22 * b23 + a23 * b33;
        const c31 = a31 * b11 + a32 * b21 + a33 * b31;
        const c32 = a31 * b12 + a32 * b22 + a33 * b32;
        const c33 = a31 * b13 + a32 * b23 + a33 * b33;
        const matrix = new Matrix([c11, c12, c13], [c21, c22, c23], [c31, c32, c33]);
        return matrix;
    }
    multiplyPoint(point) {
        const [a11, a21, a31] = this.m1;
        const [a12, a22, a32] = this.m2;
        const [a13, a23, a33] = this.m3;
        const x1 = a11 * point.x + a12 * point.y + a13 * point.w;
        const y1 = a21 * point.x + a22 * point.y + a23 * point.w;
        const newPoint = new point_1.default([x1, y1]);
        return newPoint;
    }
}
exports["default"] = Matrix;


/***/ }),

/***/ "./src/Base/point.ts":
/*!***************************!*\
  !*** ./src/Base/point.ts ***!
  \***************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const coordinate_1 = __importDefault(__webpack_require__(/*! ./coordinate */ "./src/Base/coordinate.ts"));
class Point extends coordinate_1.default {
    constructor(position, color = [0, 0, 0, 1]) {
        super(...position, 1);
        [this.r, this.g, this.b, this.a] = color;
        const [r, g, b, a] = color;
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    getPair() {
        return [this.x, this.y];
    }
    getColor() {
        return [this.r, this.g, this.b, this.a];
    }
    setColor(color) {
        const [r, g, b, a] = color;
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
}
exports["default"] = Point;


/***/ }),

/***/ "./src/Functions/create-shader-program.ts":
/*!************************************************!*\
  !*** ./src/Functions/create-shader-program.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createShaderProgram = void 0;
const load_shader_1 = __webpack_require__(/*! ./load-shader */ "./src/Functions/load-shader.ts");
//
// Initialize a shader program, so WebGL knows how to draw our data
//
function createShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = (0, load_shader_1.loadShader)(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = (0, load_shader_1.loadShader)(gl, gl.FRAGMENT_SHADER, fsSource);
    // Create the shader program
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    // If creating the shader program failed, alert
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert(`Unable to initialize the shader program: ${gl.getProgramInfoLog(shaderProgram)}`);
        return null;
    }
    return shaderProgram;
}
exports.createShaderProgram = createShaderProgram;


/***/ }),

/***/ "./src/Functions/load-shader.ts":
/*!**************************************!*\
  !*** ./src/Functions/load-shader.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.loadShader = void 0;
//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    // Send the source to the shader object
    gl.shaderSource(shader, source);
    // Compile the shader program
    gl.compileShader(shader);
    // See if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(`An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`);
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}
exports.loadShader = loadShader;


/***/ }),

/***/ "./src/Functions/render-all.ts":
/*!*************************************!*\
  !*** ./src/Functions/render-all.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.renderAll = void 0;
const render_1 = __webpack_require__(/*! ./render */ "./src/Functions/render.ts");
function renderAll(gl, programInfo, shapes, positionBuffer, colorBuffer) {
    gl.clear(gl.COLOR_BUFFER_BIT);
    for (const shape of shapes) {
        (0, render_1.render)(gl, programInfo, shape, positionBuffer, colorBuffer);
    }
    window.requestAnimationFrame(() => renderAll(gl, programInfo, shapes, positionBuffer, colorBuffer));
}
exports.renderAll = renderAll;
;


/***/ }),

/***/ "./src/Functions/render.ts":
/*!*********************************!*\
  !*** ./src/Functions/render.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.render = void 0;
function render(gl, programInfo, object, positionBuffer, colorBuffer) {
    if (!object.isDrawable()) {
        return;
    }
    // Add Position to gl buffer
    console.log("kontolodon3");
    object.addPosition(gl);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    console.log("kontolodon4");
    // Add Color to gl buffer
    object.addColor(gl);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    // Add Matrix to gl
    const matrixLocation = programInfo.uniformLocations.matrixLocation;
    object.addMatrix(gl, matrixLocation);
    /* Draw scene */
    const primitiveType = object.drawMethod(gl);
    const offset = 0;
    const numberOfVerticesToBeDrawn = object.getNumberOfVerticesToBeDrawn();
    console.log("kontolodon5");
    gl.drawArrays(primitiveType, offset, numberOfVerticesToBeDrawn);
}
exports.render = render;


/***/ }),

/***/ "./src/Functions/set-attributes.ts":
/*!*****************************************!*\
  !*** ./src/Functions/set-attributes.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.setAttributes = void 0;
// Tell WebGL how to pull out the positions from the position buffer into the vertexPosition attribute.
function setAttributes(gl, positionBuffer, colorBuffer, programInfo) {
    const numComponents = 2; // pull out 2 values per iteration
    const type = gl.FLOAT; // the data in the buffer is 32bit floats
    const normalize = false; // don't normalize
    const stride = 0; // how many bytes to get from one set of values to the next
    // 0 = use type and numComponents above
    const offset = 0; // how many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, numComponents, type, normalize, stride, offset);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const colorSize = 4; /* 4 components per iteration */
    const colorType = gl.FLOAT; /* The data is 32 bit float */
    const colorNormalized = false; /* Don't normalize the data */
    const colorStride = 0; /* 0: Move forward size * sizeof(type) each iteration to get the next position */
    const colorOffset = 0; /* Start at the beginning of the buffer */
    gl.vertexAttribPointer(programInfo.attribLocations.vertexColor, colorSize, colorType, colorNormalized, colorStride, colorOffset);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
}
exports.setAttributes = setAttributes;


/***/ }),

/***/ "./src/Operations/Transformation.ts":
/*!******************************************!*\
  !*** ./src/Operations/Transformation.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const matrix_1 = __importDefault(__webpack_require__(/*! Main/Base/matrix */ "./src/Base/matrix.ts"));
class Transformation {
    static projection(width, height) {
        const matrix = new matrix_1.default([2 / width, 0, 0], [0, -2 / height, 0], [-1, 1, 1]);
        return matrix;
    }
    static translation(tx, ty) {
        const matrix = new matrix_1.default([1, 0, 0], [0, 1, 0], [tx, ty, 1]);
        return matrix;
    }
    static rotation(degree) {
        const matrix = new matrix_1.default([Math.cos(degree), Math.sin(degree), 0], [-Math.sin(degree), Math.cos(degree), 0], [0, 0, 1]);
        return matrix;
    }
    static scale(sx, sy) {
        const matrix = new matrix_1.default([sx, 0, 0], [0, sy, 0], [0, 0, 1]);
        return matrix;
    }
    static shearX(kx) {
        const matrix = new matrix_1.default([1, 0, 0], [kx, 1, 0], [0, 0, 1]);
        return matrix;
    }
    static shearY(kx) {
        const matrix = new matrix_1.default([1, kx, 0], [0, 1, 0], [0, 0, 1]);
        return matrix;
    }
    static transformationMatrix(width, height, tx, ty, degree, sx, sy, kx, ky, center) {
        return Transformation.projection(width, height)
            .multiplyMatrix(Transformation.translation(tx, ty))
            .multiplyMatrix(Transformation.translation(center.getX(), center.getY()))
            .multiplyMatrix(Transformation.rotation(degree))
            .multiplyMatrix(Transformation.scale(sx, sy))
            .multiplyMatrix(Transformation.shearX(kx))
            .multiplyMatrix(Transformation.shearY(ky))
            .multiplyMatrix(Transformation.translation(-center.getX(), -center.getY()));
    }
}
exports["default"] = Transformation;


/***/ }),

/***/ "./src/Operations/convex-hull.ts":
/*!***************************************!*\
  !*** ./src/Operations/convex-hull.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
function orientation(p, q, r) {
    const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
    if (val === 0)
        return 0;
    return val > 0 ? 1 : 2;
}
function convexHull(points) {
    const n = points.length;
    if (n < 3)
        return [];
    const hull = [];
    let l = 0;
    for (let i = 1; i < n; i++) {
        if (points[i].x < points[l].x) {
            l = i;
        }
    }
    let p = l;
    let q;
    do {
        hull.push(points[p]);
        q = (p + 1) % n;
        for (let i = 0; i < n; i++) {
            if (orientation(points[p], points[i], points[q]) === 2) {
                q = i;
            }
        }
        p = q;
    } while (p !== l);
    return hull;
}
exports["default"] = convexHull;


/***/ }),

/***/ "./src/Utils/tools.ts":
/*!****************************!*\
  !*** ./src/Utils/tools.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.hexToRgb = exports.rgbToHex = void 0;
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
}
function rgbToHex(rgba) {
    const [r, g, b] = rgba;
    return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}
exports.rgbToHex = rgbToHex;
function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r / 255, g / 255, b / 255, 1];
}
exports.hexToRgb = hexToRgb;


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const line_1 = __importDefault(__webpack_require__(/*! ./2D-Shapes/line */ "./src/2D-Shapes/line.ts"));
const square_1 = __importDefault(__webpack_require__(/*! ./2D-Shapes/square */ "./src/2D-Shapes/square.ts"));
const rectangle_1 = __importDefault(__webpack_require__(/*! ./2D-Shapes/rectangle */ "./src/2D-Shapes/rectangle.ts"));
const point_1 = __importDefault(__webpack_require__(/*! ./Base/point */ "./src/Base/point.ts"));
const polygon_1 = __importDefault(__webpack_require__(/*! ./2D-Shapes/polygon */ "./src/2D-Shapes/polygon.ts"));
const type_enum_1 = __importDefault(__webpack_require__(/*! ./2D-Shapes/type.enum */ "./src/2D-Shapes/type.enum.ts"));
const create_shader_program_1 = __webpack_require__(/*! ./Functions/create-shader-program */ "./src/Functions/create-shader-program.ts");
const set_attributes_1 = __webpack_require__(/*! ./Functions/set-attributes */ "./src/Functions/set-attributes.ts");
const tools_1 = __webpack_require__(/*! ./Utils/tools */ "./src/Utils/tools.ts");
const render_1 = __webpack_require__(/*! ./Functions/render */ "./src/Functions/render.ts");
const render_all_1 = __webpack_require__(/*! ./Functions/render-all */ "./src/Functions/render-all.ts");
// const gl = setupCanvas()
const canvas = document.querySelector("#canvas");
// Initialize the GL context
const gl = canvas.getContext("webgl");
// Only continue if WebGL is available and working
if (gl === null) {
    alert("Unable to initialize WebGL. Your browser or machine may not support it.");
}
// Set clear color to black, fully opaque
gl.clearColor(1.0, 1.0, 1.0, 1.0);
// Clear the color buffer with specified clear color
gl.clear(gl.COLOR_BUFFER_BIT);
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
    precision mediump float;
    varying vec4 vColor;

    void main() {
        gl_FragColor = vColor;
    }
`;
const shaderProgram = (0, create_shader_program_1.createShaderProgram)(gl, vsSource, fsSource);
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
// Clear the canvas before we start drawing on it.
gl.clear(gl.COLOR_BUFFER_BIT);
// Tell WebGL to use our program when drawing
gl.useProgram(shaderProgram);
// ===============================================================================================
// const canvas = document.getElementById("canvas") as HTMLCanvasElement;
let shapes = [];
let type;
let isDrawing = false;
/* Setup Viewport */
const width = gl.canvas.clientWidth;
const height = gl.canvas.clientHeight;
gl.canvas.width = 800;
gl.canvas.height = 800;
const x = 0; // x coordinate of the lower left corner of the viewport rectangle
const y = 0; // y coordinate of the lower left corner of the viewport rectangle
gl.viewport(x, y, gl.canvas.width, gl.canvas.height); // sets the viewport to cover the entire canvas, starting from the lower-left corner and extending to the canvas's width and height.
const positionBuffer = gl.createBuffer();
const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
(0, set_attributes_1.setAttributes)(gl, positionBuffer, colorBuffer, programInfo);
let currentObject;
// =========================================================
// Fix HTML Elements Event Listeners
/* List of Shapes Listener */
const listOfShapes = document.getElementById("dropdown");
listOfShapes.addEventListener("change", () => {
    const index = +listOfShapes.selectedOptions[0].value;
    setupSelector(gl, programInfo, shapes[index]);
});
/* Button Listener */
const lineBtn = document.getElementById("line-btn");
lineBtn.addEventListener("click", () => {
    type = type_enum_1.default.Line;
    isDrawing = false;
});
const squareBtn = document.getElementById("square-btn");
squareBtn.addEventListener("click", () => {
    type = type_enum_1.default.Square;
    isDrawing = false;
});
const rectangleBtn = document.getElementById("rectangle-btn");
rectangleBtn.addEventListener("click", () => {
    type = type_enum_1.default.Rectangle;
    isDrawing = false;
});
const polygonBtn = document.getElementById("polygon-btn");
polygonBtn.addEventListener("click", () => {
    type = type_enum_1.default.Polygon;
    isDrawing = false;
    // isFirstDrawing = true;
});
const saveBtn = document.getElementById("save-btn");
saveBtn.addEventListener("click", () => {
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
        (0, render_all_1.renderAll)(gl, programInfo, shapes, positionBuffer, colorBuffer);
    });
});
/* Canvas Listener */
canvas.addEventListener("mousedown", (event) => {
    const x = event.clientX;
    const y = event.clientY;
    const point = new point_1.default([x, y]);
    console.log("kontolodon");
    if (isDrawing) {
        if (currentObject.type !== type_enum_1.default.Polygon) {
            shapes.push(currentObject);
            currentObject.draw(point);
            setupOption(true, currentObject);
            console.log("kontolodon2");
            (0, render_1.render)(gl, programInfo, currentObject, positionBuffer, colorBuffer);
            isDrawing = false;
            currentObject = null;
        }
        else {
            currentObject.draw(point);
            if (currentObject.id == shapes.length) {
                // belum dipush ke shapes
                if (currentObject.isDrawable()) {
                    shapes.push(currentObject);
                    setupOption(true, currentObject);
                    (0, render_1.render)(gl, programInfo, currentObject, positionBuffer, colorBuffer);
                    isDrawing = false;
                }
            }
            else {
                setupOption(true, currentObject);
                (0, render_1.render)(gl, programInfo, currentObject, positionBuffer, colorBuffer);
                isDrawing = false;
            }
        }
    }
    else {
        switch (type) {
            case type_enum_1.default.Line:
                currentObject = new line_1.default(shapes.length, point);
                isDrawing = true;
                break;
            case type_enum_1.default.Square:
                currentObject = new square_1.default(shapes.length, point);
                isDrawing = true;
                break;
            case type_enum_1.default.Rectangle:
                currentObject = new rectangle_1.default(shapes.length, point);
                isDrawing = true;
                break;
            case type_enum_1.default.Polygon:
                currentObject = new polygon_1.default(shapes.length, point);
                isDrawing = true;
                break;
        }
    }
    //   switch (type) {
    //     case Type.Line:
    //       if (!isDrawing) {
    //         const line = new Line(shapes.length, point);
    //         shapes.push(line);
    //         isDrawing = true;
    //       } else {
    //         const line = shapes[shapes.length - 1] as Line;
    //         line.draw(point);
    //         render(gl, programInfo, line);
    //         setupOption(true, line);
    //         isDrawing = false;
    //       }
    //       break;
    //     case Type.Square:
    //       if (!isDrawing) {
    //         const square = new Square(shapes.length, point);
    //         shapes.push(square);
    //         isDrawing = true;
    //       } else {
    //         const square = shapes[shapes.length - 1] as Square;
    //         square.draw(point);
    //         render(gl, programInfo, square);
    //         setupOption(true, square);
    //         isDrawing = false;
    //       }
    //       break;
    //     case Type.Rectangle:
    //       if (!isDrawing) {
    //         const rectangle = new Rectangle(shapes.length, point);
    //         shapes.push(rectangle);
    //         isDrawing = true;
    //       } else {
    //         const rectangle =shapes[shapes.length - 1] as Rectangle;
    //         rectangle.draw(point);
    //         render(gl, programInfo, rectangle);
    //         setupOption(true, rectangle);
    //         isDrawing = false;
    //       }
    //       break;
    //     case Type.Polygon:
    //       if (!isDrawing) {
    //         const polygon = new Polygon(shapes.length, point);
    //         shapes.push(polygon);
    //         isDrawing = true;
    //       } else {
    //         const polygon = shapes[shapes.length - 1] as Polygon;
    //         polygon.draw(point);
    //         render(gl, programInfo, polygon);
    //         setupOption(isFirstDrawing, polygon);
    //         isFirstDrawing = false;
    //       }
    //       break;
    //     case Type.POLYGON_REDRAW:
    //       // const polygon = objects[polygonRedrawIndex] as Polygon;
    //       // polygon.updatePoint(point);
    //       // polygon.render(gl, program, positionBuffer, colorBuffer);
    //       // break;
    //   }
});
canvas.addEventListener("mousemove", (event) => {
    const x = event.clientX;
    const y = event.clientY;
    const point = new point_1.default([x, y]);
    console.log("aswwww");
    if (isDrawing) {
        if (currentObject.type !== type_enum_1.default.Polygon) {
            currentObject.draw(point);
            (0, render_all_1.renderAll)(gl, programInfo, shapes, positionBuffer, colorBuffer);
            (0, render_1.render)(gl, programInfo, currentObject, positionBuffer, colorBuffer);
        }
    }
});
// =========================================================
// =========================================================
// Initialize Dynamic HTML Elements & Set Event Listeners
// =========================================================
function setupOption(isFirstDrawing, element) {
    const option = document.createElement("option");
    option.value = element.id.toString();
    option.text = `${element.type.toString()}_${element.id}`;
    if (isFirstDrawing) {
        const listOfShapes = document.getElementById("list-of-shapes");
        listOfShapes.appendChild(option);
        listOfShapes.value = element.id.toString();
    }
    setupSelector(gl, programInfo, element);
}
function setupSelector(gl, programInfo, element) {
    const sliderX = document.getElementById("sliderX");
    sliderX.min = "-600";
    sliderX.max = "600";
    sliderX.value = element.tx.toString();
    sliderX.step = "10";
    sliderX.addEventListener("input", (event) => {
        const deltaX = event.target.value;
        element.tx = Number(deltaX);
    });
    const sliderY = document.getElementById("sliderY");
    sliderY.min = "-600";
    sliderY.max = "600";
    sliderY.value = (-element.ty).toString();
    sliderY.step = "10";
    sliderX.addEventListener("input", (event) => {
        const deltaY = event.target.value;
        element.ty = -Number(deltaY);
    });
    const sliderLength = document.getElementById("sliderLength");
    sliderLength.min = "0";
    sliderLength.max = "600";
    let length;
    if (element.type === type_enum_1.default.Polygon) {
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
    }
    else {
        length = Math.sqrt((element.arrayOfPoints[0].x - element.arrayOfPoints[1].x) ** 2 +
            (element.arrayOfPoints[0].y - element.arrayOfPoints[1].y) ** 2);
    }
    sliderLength.value = ((element.sx - 1) * length).toString();
    sliderLength.addEventListener("input", (event) => {
        const deltaLength = event.target.value;
        element.sx = 1 + Number(deltaLength) / length;
    });
    const sliderWidth = document.getElementById("sliderWidth");
    sliderWidth.min = "0";
    sliderWidth.max = "600";
    let width;
    if (element.type == type_enum_1.default.Rectangle) {
        width = Math.sqrt((element.arrayOfPoints[0].x - element.arrayOfPoints[3].x) ** 2 +
            (element.arrayOfPoints[0].y - element.arrayOfPoints[3].y) ** 2);
    }
    else if (element.type == type_enum_1.default.Polygon) {
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
    }
    else {
        width = 0;
    }
    sliderWidth.value = ((element.sy - 1) * width).toString();
    sliderWidth.addEventListener("input", (event) => {
        const deltaWidth = event.target.value;
        element.sy = 1 + Number(deltaWidth) / width;
    });
    const sliderRotation = document.getElementById("sliderRotation");
    sliderRotation.min = "0";
    sliderRotation.max = "360";
    sliderRotation.value = ((180 * element.degree) / Math.PI).toString();
    sliderRotation.step = "10";
    sliderRotation.addEventListener("input", (event) => {
        const deltaDegree = event.target.value;
        element.degree = (Number(deltaDegree) / 180) * Math.PI;
    });
    const sliderShearX = document.getElementById("sliderShearX");
    sliderShearX.min = "-600";
    sliderShearX.max = "600";
    sliderShearX.value = element.kx.toString();
    sliderShearX.step = "10";
    sliderShearX.addEventListener("input", (event) => {
        const deltaShearX = event.target.value;
        element.kx = Number(deltaShearX);
    });
    const sliderShearY = document.getElementById("sliderShearY");
    sliderShearY.min = "-600";
    sliderShearY.max = "600";
    sliderShearY.value = element.ky.toString();
    sliderShearY.step = "10";
    sliderShearX.addEventListener("input", (event) => {
        const deltaShearY = event.target.value;
        element.ky = Number(deltaShearY);
    });
    const pointPicker = document.getElementById("pointPicker");
    pointPicker.addEventListener("change", () => {
        const pointIndex = Number(pointPicker.value);
        setupColorPicker(gl, programInfo, pointIndex, element);
    });
    for (let i = 0; i < element.arrayOfPoints.length; i++) {
        const newPoint = document.createElement("option");
        newPoint.value = i.toString();
        newPoint.text = "point_" + i;
        pointPicker.appendChild(newPoint);
    }
}
function setupColorPicker(gl, programInfo, pointIndex, element) {
    const colorSelector = document.getElementById("color-picker");
    colorSelector.innerHTML = "";
    colorSelector.replaceChildren();
    const colorTitle = document.createElement("h2");
    colorTitle.textContent = "Select color";
    const colorInput = document.createElement("input");
    colorInput.id = "color-input";
    colorInput.type = "color";
    colorInput.value = (0, tools_1.rgbToHex)(element.arrayOfPoints[pointIndex].getColor());
    colorInput.addEventListener("change", (event) => {
        const hex = event.target.value;
        element.arrayOfPoints[pointIndex].setColor((0, tools_1.hexToRgb)(hex));
    });
    if (element instanceof polygon_1.default) {
        const deletePointButton = document.createElement("button");
        deletePointButton.textContent = "delete point";
        deletePointButton.className = "btn";
        deletePointButton.addEventListener("click", () => {
            element.deletePoint(pointIndex);
            (0, render_all_1.renderAll)(gl, programInfo, shapes, positionBuffer, colorBuffer);
        });
        colorSelector.append(colorTitle, colorInput, deletePointButton);
    }
}
// loadshape from json to array of shape
function loadShape(text) {
    const shape = [];
    const data = JSON.parse(text);
    for (const item of data) {
        const tx = item.tx;
        const ty = item.ty;
        const degree = item.degree;
        const sx = item.sx;
        const sy = item.sy;
        const kx = item.kx;
        const ky = item.ky;
        let arrayOfPoints = [];
        for (const point of item.arrayOfPoints) {
            let p = new point_1.default([point.x, point.y], [point.r, point.g, point.b, point.a]);
            arrayOfPoints.push(p);
        }
        switch (item.type) {
            case type_enum_1.default.Line:
                const line = new line_1.default(item.id, arrayOfPoints[0]);
                line.setLineAttributes(tx, ty, degree, sx, sy, kx, ky, arrayOfPoints[1]);
                shape.push(line);
                break;
            case type_enum_1.default.Square:
                const square = new square_1.default(item.id, item.center);
                square.setSquareAttributes(tx, ty, degree, sx, sy, kx, ky, arrayOfPoints);
                shape.push(square);
                break;
            case type_enum_1.default.Rectangle:
                const rectangle = new rectangle_1.default(item.id, arrayOfPoints[0]);
                rectangle.setRectangleAttributes(tx, ty, degree, sx, sy, kx, ky, arrayOfPoints);
                shape.push(rectangle);
                break;
            case type_enum_1.default.Polygon:
                const polygon = new polygon_1.default(item.id, arrayOfPoints[0]);
                polygon.setPolygonAttributes(tx, ty, degree, sx, sy, kx, ky, arrayOfPoints);
                shape.push(polygon);
                break;
        }
    }
    return shape;
}
function storeShapes(shape) {
    return JSON.stringify(shape);
}
function handleDownload(text) {
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
function handleUpload(callback) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.addEventListener("change", () => {
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            callback(reader.result);
        };
        reader.readAsText(file);
    });
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RyxJQUFJLENBQUMsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7SUFDL0MsQ0FBQztJQUVNLGNBQWMsQ0FBQyxXQUFtQjtRQUNyQyxNQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDaEMsTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztRQUVoQyxNQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxXQUFXLENBQUMsRUFBRSxDQUFDO1FBQ3ZDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxFQUFFLENBQUM7UUFDdkMsTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsV0FBVyxDQUFDLEVBQUUsQ0FBQztRQUV2QyxNQUFNLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUM5QyxNQUFNLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUM5QyxNQUFNLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUM5QyxNQUFNLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUM5QyxNQUFNLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcs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QUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7O1VFdEJBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdHVnYXMtYmVzYXItZ3JhZmtvbS0xLXBhaW50Ly4vc3JjLzJELVNoYXBlcy9saW5lLnRzIiwid2VicGFjazovL3R1Z2FzLWJlc2FyLWdyYWZrb20tMS1wYWludC8uL3NyYy8yRC1TaGFwZXMvcG9seWdvbi50cyIsIndlYnBhY2s6Ly90dWdhcy1iZXNhci1ncmFma29tLTEtcGFpbnQvLi9zcmMvMkQtU2hhcGVzL3JlY3RhbmdsZS50cyIsIndlYnBhY2s6Ly90dWdhcy1iZXNhci1ncmFma29tLTEtcGFpbnQvLi9zcmMvMkQtU2hhcGVzL3NoYXBlLnRzIiwid2VicGFjazovL3R1Z2FzLWJlc2FyLWdyYWZrb20tMS1wYWludC8uL3NyYy8yRC1TaGFwZXMvc3F1YXJlLnRzIiwid2VicGFjazovL3R1Z2FzLWJlc2FyLWdyYWZrb20tMS1wYWludC8uL3NyYy8yRC1TaGFwZXMvdHlwZS5lbnVtLnRzIiwid2VicGFjazovL3R1Z2FzLWJlc2FyLWdyYWZrb20tMS1wYWludC8uL3NyYy9CYXNlL2Nvb3JkaW5hdGUudHMiLCJ3ZWJwYWNrOi8vdHVnYXMtYmVzYXItZ3JhZmtvbS0xLXBhaW50Ly4vc3JjL0Jhc2UvbWF0cml4LnRzIiwid2VicGFjazovL3R1Z2FzLWJlc2FyLWdyYWZrb20tMS1wYWludC8uL3NyYy9CYXNlL3BvaW50LnRzIiwid2VicGFjazovL3R1Z2FzLWJlc2FyLWdyYWZrb20tMS1wYWludC8uL3NyYy9GdW5jdGlvbnMvY3JlYXRlLXNoYWRlci1wcm9ncmFtLnRzIiwid2VicGFjazovL3R1Z2FzLWJlc2FyLWdyYWZrb20tMS1wYWludC8uL3NyYy9GdW5jdGlvbnMvbG9hZC1zaGFkZXIudHMiLCJ3ZWJwYWNrOi8vdHVnYXMtYmVzYXItZ3JhZmtvbS0xLXBhaW50Ly4vc3JjL0Z1bmN0aW9ucy9yZW5kZXItYWxsLnRzIiwid2VicGFjazovL3R1Z2FzLWJlc2FyLWdyYWZrb20tMS1wYWludC8uL3NyYy9GdW5jdGlvbnMvcmVuZGVyLnRzIiwid2VicGFjazovL3R1Z2FzLWJlc2FyLWdyYWZrb20tMS1wYWludC8uL3NyYy9GdW5jdGlvbnMvc2V0LWF0dHJpYnV0ZXMudHMiLCJ3ZWJwYWNrOi8vdHVnYXMtYmVzYXItZ3JhZmtvbS0xLXBhaW50Ly4vc3JjL09wZXJhdGlvbnMvVHJhbnNmb3JtYXRpb24udHMiLCJ3ZWJwYWNrOi8vdHVnYXMtYmVzYXItZ3JhZmtvbS0xLXBhaW50Ly4vc3JjL09wZXJhdGlvbnMvY29udmV4LWh1bGwudHMiLCJ3ZWJwYWNrOi8vdHVnYXMtYmVzYXItZ3JhZmtvbS0xLXBhaW50Ly4vc3JjL1V0aWxzL3Rvb2xzLnRzIiwid2VicGFjazovL3R1Z2FzLWJlc2FyLWdyYWZrb20tMS1wYWludC8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly90dWdhcy1iZXNhci1ncmFma29tLTEtcGFpbnQvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdHVnYXMtYmVzYXItZ3JhZmtvbS0xLXBhaW50L3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vdHVnYXMtYmVzYXItZ3JhZmtvbS0xLXBhaW50L3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly90dWdhcy1iZXNhci1ncmFma29tLTEtcGFpbnQvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZW5kZXJhYmxlIGZyb20gXCIuL0ludGVyZmFjZXMvcmVuZGVyYWJsZS5pbnRlcmZhY2VcIjtcclxuaW1wb3J0IFRyYW5zZm9ybWFibGUgZnJvbSBcIi4vSW50ZXJmYWNlcy90cmFuc2Zvcm1hYmxlLmludGVyZmFjZVwiO1xyXG5pbXBvcnQgU2hhcGUgZnJvbSBcIi4vc2hhcGVcIjtcclxuaW1wb3J0IFR5cGUgZnJvbSBcIi4vdHlwZS5lbnVtXCI7XHJcbmltcG9ydCBQb2ludCBmcm9tIFwiLi4vQmFzZS9wb2ludFwiO1xyXG5pbXBvcnQgVHJhbnNmb3JtYXRpb24gZnJvbSBcIk1haW4vT3BlcmF0aW9ucy9UcmFuc2Zvcm1hdGlvblwiO1xyXG5cclxuY2xhc3MgTGluZSBleHRlbmRzIFNoYXBlIGltcGxlbWVudHMgUmVuZGVyYWJsZSwgVHJhbnNmb3JtYWJsZSB7XHJcblxyXG4gICAgcHVibGljIHR5cGU6IFR5cGUuTGluZTtcclxuICAgIHB1YmxpYyBhcnJheU9mUG9pbnRzOiBQb2ludFtdO1xyXG5cclxuICAgIHB1YmxpYyBjZW50ZXI6IFBvaW50O1xyXG4gICAgcHVibGljIHR4OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgdHk6IG51bWJlcjtcclxuICAgIHB1YmxpYyBkZWdyZWU6IG51bWJlcjtcclxuICAgIHB1YmxpYyBzeDogbnVtYmVyO1xyXG4gICAgcHVibGljIHN5OiBudW1iZXI7XHJcbiAgICBwdWJsaWMga3g6IG51bWJlcjtcclxuICAgIHB1YmxpYyBreTogbnVtYmVyO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihpZDogbnVtYmVyLCBwMTogUG9pbnQpIHtcclxuICAgICAgICBzdXBlcihpZCwgMiwgVHlwZS5MaW5lKTtcclxuICAgICAgICB0aGlzLmFycmF5T2ZQb2ludHMgPSBbcDFdO1xyXG4gICAgICAgIHRoaXMudHggPSAwO1xyXG4gICAgICAgIHRoaXMudHkgPSAwO1xyXG4gICAgICAgIHRoaXMuZGVncmVlID0gMDtcclxuICAgICAgICB0aGlzLnN4ID0gMTtcclxuICAgICAgICB0aGlzLnN5ID0gMTtcclxuICAgICAgICB0aGlzLmt4ID0gMDtcclxuICAgICAgICB0aGlzLmt5ID0gMDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBUcmFuc2Zvcm1hYmxlIE1ldGhvZHNcclxuICAgIHB1YmxpYyBhZGRNYXRyaXgoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCwgbWF0cml4TG9jYXRpb246IFdlYkdMVW5pZm9ybUxvY2F0aW9uKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgbWF0cml4ID0gVHJhbnNmb3JtYXRpb24udHJhbnNmb3JtYXRpb25NYXRyaXgoXHJcbiAgICAgICAgICAgIGdsLmNhbnZhcy53aWR0aCxcclxuICAgICAgICAgICAgZ2wuY2FudmFzLmhlaWdodCxcclxuICAgICAgICAgICAgdGhpcy50eCxcclxuICAgICAgICAgICAgdGhpcy50eSxcclxuICAgICAgICAgICAgdGhpcy5kZWdyZWUsXHJcbiAgICAgICAgICAgIHRoaXMuc3gsXHJcbiAgICAgICAgICAgIHRoaXMuc3ksXHJcbiAgICAgICAgICAgIHRoaXMua3gsXHJcbiAgICAgICAgICAgIHRoaXMua3ksXHJcbiAgICAgICAgICAgIHRoaXMuZ2V0Q2VudGVyKClcclxuICAgICAgICAgICkuZmxhdHRlbigpO1xyXG4gICAgICBcclxuICAgICAgICAgIGdsLnVuaWZvcm1NYXRyaXgzZnYobWF0cml4TG9jYXRpb24sIGZhbHNlLCBtYXRyaXgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRDZW50ZXIoKTogUG9pbnQge1xyXG4gICAgICAgIGNvbnN0IG51bVBvaW50cyA9IHRoaXMuYXJyYXlPZlBvaW50cy5sZW5ndGg7XHJcbiAgICAgICAgbGV0IGNlbnRlclggPSAwO1xyXG4gICAgICAgIGxldCBjZW50ZXJZID0gMDtcclxuICAgICAgICBmb3IgKGNvbnN0IHBvaW50IG9mIHRoaXMuYXJyYXlPZlBvaW50cykge1xyXG4gICAgICAgICAgICBjb25zdCBbeCwgeV0gPSBwb2ludC5nZXRQYWlyKCk7XHJcbiAgICAgICAgICAgIGNlbnRlclggKz0geDtcclxuICAgICAgICAgICAgY2VudGVyWSArPSB5O1xyXG4gICAgICAgIH1cclxuICAgICAgICBjZW50ZXJYIC89IG51bVBvaW50cztcclxuICAgICAgICBjZW50ZXJZIC89IG51bVBvaW50cztcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBQb2ludChbY2VudGVyWCwgY2VudGVyWV0sIFswLCAwLCAwLCAwXSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRyYXdNZXRob2QoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIGdsLkxJTkVTO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpc0RyYXdhYmxlKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoID09PSAyO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkcmF3KHBvaW50OiBQb2ludCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuYXJyYXlPZlBvaW50c1sxXSA9IHBvaW50O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXROdW1iZXJPZlZlcnRpY2VzVG9CZURyYXduKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJyYXlPZlBvaW50cy5sZW5ndGg7XHJcbiAgICB9IFxyXG4gICAgXHJcbiAgICBwdWJsaWMgYWRkUG9zaXRpb24oZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IHZlcnRpY2VzID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLmFycmF5T2ZQb2ludHMucmVkdWNlKChhY2MsIHBvaW50KSA9PiB7XHJcbiAgICAgICAgICAgIGFjYy5wdXNoKC4uLnBvaW50LmdldFBhaXIoKSk7XHJcbiAgICAgICAgICAgIHJldHVybiBhY2M7XHJcbiAgICAgICAgfSwgW10gYXMgbnVtYmVyW10pKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImhhbGVsdXlhXCIpO1xyXG5cclxuICAgICAgICBnbC5idWZmZXJEYXRhKGdsLkFSUkFZX0JVRkZFUiwgdmVydGljZXMsIGdsLlNUQVRJQ19EUkFXKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkQ29sb3IoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IGNvbG9ycyA9IG5ldyBGbG9hdDMyQXJyYXkodGhpcy5hcnJheU9mUG9pbnRzLnJlZHVjZSgoYWNjLCBwb2ludCkgPT4ge1xyXG4gICAgICAgICAgICBhY2MucHVzaCguLi5wb2ludC5nZXRDb2xvcigpKTtcclxuICAgICAgICAgICAgcmV0dXJuIGFjYztcclxuICAgICAgICB9LCBbXSBhcyBudW1iZXJbXSkpO1xyXG5cclxuICAgICAgICBnbC5idWZmZXJEYXRhKGdsLkFSUkFZX0JVRkZFUiwgY29sb3JzLCBnbC5TVEFUSUNfRFJBVyk7XHJcbiAgICB9ICBcclxuXHJcbiAgICBwdWJsaWMgc2V0TGluZUF0dHJpYnV0ZXModHg6IG51bWJlciwgdHk6IG51bWJlciwgZGVncmVlOiBudW1iZXIsIHN4OiBudW1iZXIsIHN5OiBudW1iZXIsIGt4OiBudW1iZXIsIGt5OiBudW1iZXIsIHAyOiBQb2ludCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuYXJyYXlPZlBvaW50cy5wdXNoKHAyKTtcclxuICAgICAgICB0aGlzLnR4ID0gdHg7XHJcbiAgICAgICAgdGhpcy50eSA9IHR5O1xyXG4gICAgICAgIHRoaXMuZGVncmVlID0gZGVncmVlO1xyXG4gICAgICAgIHRoaXMuc3ggPSBzeDtcclxuICAgICAgICB0aGlzLnN5ID0gc3k7XHJcbiAgICAgICAgdGhpcy5reCA9IGt4O1xyXG4gICAgICAgIHRoaXMua3kgPSBreTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgTGluZTtcclxuIiwiaW1wb3J0IFRyYW5zZm9ybWF0aW9uIGZyb20gXCJNYWluL09wZXJhdGlvbnMvVHJhbnNmb3JtYXRpb25cIjtcclxuaW1wb3J0IFJlbmRlcmFibGUgZnJvbSBcIi4vSW50ZXJmYWNlcy9yZW5kZXJhYmxlLmludGVyZmFjZVwiO1xyXG5pbXBvcnQgVHJhbnNmb3JtYWJsZSBmcm9tIFwiLi9JbnRlcmZhY2VzL3RyYW5zZm9ybWFibGUuaW50ZXJmYWNlXCI7XHJcbmltcG9ydCBTaGFwZSBmcm9tIFwiLi9zaGFwZVwiO1xyXG5pbXBvcnQgVHlwZSBmcm9tIFwiLi90eXBlLmVudW1cIjtcclxuaW1wb3J0IFBvaW50IGZyb20gXCJNYWluL0Jhc2UvcG9pbnRcIjtcclxuaW1wb3J0IGNvbnZleEh1bGwgZnJvbSBcIk1haW4vT3BlcmF0aW9ucy9jb252ZXgtaHVsbFwiO1xyXG5cclxuY2xhc3MgUG9seWdvbiBleHRlbmRzIFNoYXBlIGltcGxlbWVudHMgUmVuZGVyYWJsZSwgVHJhbnNmb3JtYWJsZSB7XHJcbiAgICBwdWJsaWMgdHlwZTogVHlwZS5Qb2x5Z29uO1xyXG4gICAgcHVibGljIGFycmF5T2ZQb2ludHM6IFBvaW50W107XHJcblxyXG4gICAgcHVibGljIGNlbnRlcjogUG9pbnQ7XHJcbiAgICBwdWJsaWMgdHg6IG51bWJlcjtcclxuICAgIHB1YmxpYyB0eTogbnVtYmVyO1xyXG4gICAgcHVibGljIGRlZ3JlZTogbnVtYmVyO1xyXG4gICAgcHVibGljIHN4OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgc3k6IG51bWJlcjtcclxuICAgIHB1YmxpYyBreDogbnVtYmVyO1xyXG4gICAgcHVibGljIGt5OiBudW1iZXI7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKGlkOiBudW1iZXIsIHBvaW50OiBQb2ludCkge1xyXG4gICAgICAgIHN1cGVyKGlkLCAxLCBUeXBlLlBvbHlnb24pO1xyXG4gICAgICAgIHRoaXMuYXJyYXlPZlBvaW50cyA9IG5ldyBBcnJheShwb2ludCk7XHJcbiAgICAgICAgdGhpcy50eCA9IDA7XHJcbiAgICAgICAgdGhpcy50eSA9IDA7XHJcbiAgICAgICAgdGhpcy5kZWdyZWUgPSAwO1xyXG4gICAgICAgIHRoaXMuc3ggPSAxO1xyXG4gICAgICAgIHRoaXMuc3kgPSAxO1xyXG4gICAgICAgIHRoaXMua3ggPSAwO1xyXG4gICAgICAgIHRoaXMua3kgPSAwO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0Q2VudGVyKCk6IFBvaW50IHtcclxuICAgICAgICBsZXQgc3VtWCA9IDA7XHJcbiAgICAgICAgbGV0IHN1bVkgPSAwO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYXJyYXlPZlBvaW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBbeCwgeV0gPSB0aGlzLmFycmF5T2ZQb2ludHNbaV0uZ2V0UGFpcigpO1xyXG4gICAgICAgICAgICBzdW1YICs9IHg7XHJcbiAgICAgICAgICAgIHN1bVkgKz0geTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGNlbnRlclggPSBzdW1YIC8gdGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aDtcclxuICAgICAgICBjb25zdCBjZW50ZXJZID0gc3VtWSAvIHRoaXMuYXJyYXlPZlBvaW50cy5sZW5ndGg7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgUG9pbnQoW2NlbnRlclgsIGNlbnRlclldLCBbMCwgMCwgMCwgMF0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpc0RyYXdhYmxlKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoID49IDM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRyYXcgKHBvaW50OiBQb2ludCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuYXJyYXlPZlBvaW50cyA9IGNvbnZleEh1bGwoWy4uLnRoaXMuYXJyYXlPZlBvaW50cywgcG9pbnRdKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZHJhd01ldGhvZChnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0KTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5pc0RyYXdhYmxlKCkgPyBnbC5UUklBTkdMRV9GQU4gOiBnbC5MSU5FUztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0TnVtYmVyT2ZWZXJ0aWNlc1RvQmVEcmF3bigpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoICsgMTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkUG9zaXRpb24oZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IHZlcnRpY2VzID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoICogMik7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IFt4LCB5XSA9IHRoaXMuYXJyYXlPZlBvaW50c1tpXS5nZXRQYWlyKCk7XHJcbiAgICAgICAgICAgIHZlcnRpY2VzW2kgKiAyXSA9IHg7XHJcbiAgICAgICAgICAgIHZlcnRpY2VzW2kgKiAyICsgMV0gPSB5O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgW3BJbml0aWFsWCwgcEluaXRpYWxZXSA9IHRoaXMuYXJyYXlPZlBvaW50c1swXS5nZXRQYWlyKCk7XHJcbiAgICAgICAgdmVydGljZXNbdGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aCAqIDJdID0gcEluaXRpYWxYO1xyXG4gICAgICAgIHZlcnRpY2VzW3RoaXMuYXJyYXlPZlBvaW50cy5sZW5ndGggKiAyICsgMV0gPSBwSW5pdGlhbFk7XHJcblxyXG4gICAgICAgIGdsLmJ1ZmZlckRhdGEoZ2wuQVJSQVlfQlVGRkVSLCB2ZXJ0aWNlcywgZ2wuU1RBVElDX0RSQVcpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRDb2xvcihnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0KTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgY29sb3JzID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoICogNCk7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IFtyLCBnLCBiLCBhXSA9IHRoaXMuYXJyYXlPZlBvaW50c1tpXS5nZXRDb2xvcigpO1xyXG4gICAgICAgICAgICBjb2xvcnNbaSAqIDRdID0gcjtcclxuICAgICAgICAgICAgY29sb3JzW2kgKiA0ICsgMV0gPSBnO1xyXG4gICAgICAgICAgICBjb2xvcnNbaSAqIDQgKyAyXSA9IGI7XHJcbiAgICAgICAgICAgIGNvbG9yc1tpICogNCArIDNdID0gYTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IFtySW5pdGlhbCwgZ0luaXRpYWwsIGJJbml0aWFsLCBhSW5pdGlhbF0gPSB0aGlzLmFycmF5T2ZQb2ludHNbMF0uZ2V0Q29sb3IoKTtcclxuICAgICAgICBjb2xvcnNbdGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aCAqIDRdID0gckluaXRpYWw7XHJcbiAgICAgICAgY29sb3JzW3RoaXMuYXJyYXlPZlBvaW50cy5sZW5ndGggKiA0ICsgMV0gPSBnSW5pdGlhbDtcclxuICAgICAgICBjb2xvcnNbdGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aCAqIDQgKyAyXSA9IGJJbml0aWFsO1xyXG4gICAgICAgIGNvbG9yc1t0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoICogNCArIDNdID0gYUluaXRpYWw7XHJcblxyXG4gICAgICAgIGdsLmJ1ZmZlckRhdGEoZ2wuQVJSQVlfQlVGRkVSLCBjb2xvcnMsIGdsLlNUQVRJQ19EUkFXKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBhZGRNYXRyaXgoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCwgbWF0cml4TG9jYXRpb246IFdlYkdMVW5pZm9ybUxvY2F0aW9uKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgbWF0cml4ID0gVHJhbnNmb3JtYXRpb24udHJhbnNmb3JtYXRpb25NYXRyaXgoXHJcbiAgICAgICAgICAgIGdsLmNhbnZhcy53aWR0aCxcclxuICAgICAgICAgICAgZ2wuY2FudmFzLmhlaWdodCxcclxuICAgICAgICAgICAgdGhpcy50eCxcclxuICAgICAgICAgICAgdGhpcy50eSxcclxuICAgICAgICAgICAgdGhpcy5kZWdyZWUsXHJcbiAgICAgICAgICAgIHRoaXMuc3gsXHJcbiAgICAgICAgICAgIHRoaXMuc3ksXHJcbiAgICAgICAgICAgIHRoaXMua3gsXHJcbiAgICAgICAgICAgIHRoaXMua3ksXHJcbiAgICAgICAgICAgIHRoaXMuY2VudGVyXHJcbiAgICAgICAgICApLmZsYXR0ZW4oKTtcclxuICAgICAgXHJcbiAgICAgICAgICBnbC51bmlmb3JtTWF0cml4M2Z2KG1hdHJpeExvY2F0aW9uLCBmYWxzZSwgbWF0cml4KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGVsZXRlUG9pbnQoaW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgIHZhciBuZXdQb2ludHM6IFBvaW50W10gPSBbdGhpcy5hcnJheU9mUG9pbnRzW2luZGV4XV07XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgIGlmIChpICE9IGluZGV4KSB7XHJcbiAgICAgICAgICAgIG5ld1BvaW50cy5wdXNoKHRoaXMuYXJyYXlPZlBvaW50c1tpXSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgXHJcbiAgICAgICAgdGhpcy5hcnJheU9mUG9pbnRzID0gbmV3UG9pbnRzLnNsaWNlKDEsIHRoaXMuYXJyYXlPZlBvaW50cy5sZW5ndGgpO1xyXG4gICAgXHJcbiAgICAgICAgLy8gYWZ0ZXIgZGVsZXRlLCBuZWVkIHRvIHNldHVwIG9wdGlvbiBhZ2FpblxyXG4gICAgICAgIGNvbnN0IHBvaW50UGlja2VyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwb2ludFBpY2tlclwiKTtcclxuICAgICAgICBwb2ludFBpY2tlci5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICAgIHBvaW50UGlja2VyLnJlcGxhY2VDaGlsZHJlbigpO1xyXG4gICAgICAgIC8qIEFsbCBQb2ludCAqL1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICBjb25zdCBuZXdQb2ludCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XHJcbiAgICAgICAgICBuZXdQb2ludC52YWx1ZSA9IGkudG9TdHJpbmcoKTtcclxuICAgICAgICAgIG5ld1BvaW50LnRleHQgPSBcInBvaW50X1wiICsgaTtcclxuICAgICAgICAgIHBvaW50UGlja2VyLmFwcGVuZENoaWxkKG5ld1BvaW50KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHB1YmxpYyBzZXRQb2x5Z29uQXR0cmlidXRlcyh0eDogbnVtYmVyLCB0eTogbnVtYmVyLCBkZWdyZWU6IG51bWJlciwgc3g6IG51bWJlciwgc3k6IG51bWJlciwga3g6IG51bWJlciwga3k6IG51bWJlciwgYXJyYXlPZlBvaW50czogUG9pbnRbXSk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuYXJyYXlPZlBvaW50cyA9IGFycmF5T2ZQb2ludHM7XHJcbiAgICAgICAgdGhpcy50eCA9IHR4O1xyXG4gICAgICAgIHRoaXMudHkgPSB0eTtcclxuICAgICAgICB0aGlzLmRlZ3JlZSA9IGRlZ3JlZTtcclxuICAgICAgICB0aGlzLnN4ID0gc3g7XHJcbiAgICAgICAgdGhpcy5zeSA9IHN5O1xyXG4gICAgICAgIHRoaXMua3ggPSBreDtcclxuICAgICAgICB0aGlzLmt5ID0ga3k7XHJcbiAgICAgIH1cclxuICAgIFxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBQb2x5Z29uOyIsImltcG9ydCBTaGFwZSBmcm9tIFwiU2hhcGVzL3NoYXBlXCI7XHJcbmltcG9ydCBQb2ludCBmcm9tIFwiQmFzZS9wb2ludFwiO1xyXG5pbXBvcnQgVHlwZSBmcm9tIFwiU2hhcGVzL3R5cGUuZW51bVwiO1xyXG5pbXBvcnQgUmVuZGVyYWJsZSBmcm9tIFwiTWFpbi8yRC1TaGFwZXMvSW50ZXJmYWNlcy9yZW5kZXJhYmxlLmludGVyZmFjZVwiO1xyXG5pbXBvcnQgVHJhbnNmb3JtYWJsZSBmcm9tIFwiU2hhcGVzL0ludGVyZmFjZXMvdHJhbnNmb3JtYWJsZS5pbnRlcmZhY2VcIjtcclxuaW1wb3J0IFRyYW5zZm9ybWF0aW9uIGZyb20gXCJNYWluL09wZXJhdGlvbnMvVHJhbnNmb3JtYXRpb25cIjtcclxuXHJcbmNsYXNzIFJlY3RhbmdsZSBleHRlbmRzIFNoYXBlIGltcGxlbWVudHMgUmVuZGVyYWJsZSwgVHJhbnNmb3JtYWJsZSB7XHJcbiAgICBwdWJsaWMgYXJyYXlPZlBvaW50czogUG9pbnRbXTtcclxuICAgIHB1YmxpYyBjZW50ZXI6IFBvaW50O1xyXG4gICAgcHVibGljIHR4OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgdHk6IG51bWJlcjtcclxuICAgIHB1YmxpYyBkZWdyZWU6IG51bWJlcjtcclxuICAgIHB1YmxpYyBzeDogbnVtYmVyO1xyXG4gICAgcHVibGljIHN5OiBudW1iZXI7XHJcbiAgICBwdWJsaWMga3g6IG51bWJlcjtcclxuICAgIHB1YmxpYyBreTogbnVtYmVyO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihpZDogbnVtYmVyLCAgcDE6IFBvaW50KXtcclxuICAgICAgICBzdXBlcihpZCwgNCwgVHlwZS5SZWN0YW5nbGUpO1xyXG4gICAgICAgIHRoaXMuYXJyYXlPZlBvaW50cyA9IFtwMSwgbnVsbCwgbnVsbCwgbnVsbF07XHJcbiAgICAgICAgdGhpcy50eCA9IDA7XHJcbiAgICAgICAgdGhpcy50eSA9IDA7XHJcbiAgICAgICAgdGhpcy5kZWdyZWUgPSAwO1xyXG4gICAgICAgIHRoaXMuc3ggPSAxO1xyXG4gICAgICAgIHRoaXMuc3kgPSAxO1xyXG4gICAgICAgIHRoaXMua3ggPSAwO1xyXG4gICAgICAgIHRoaXMua3kgPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFRyYW5zZm9ybWFibGUgTWV0aG9kc1xyXG4gICAgcHVibGljIGdldENlbnRlcigpOiBQb2ludCB7XHJcbiAgICAgICAgY29uc3QgW3AxeCwgcDF5XSA9IHRoaXMuYXJyYXlPZlBvaW50c1swXS5nZXRQYWlyKCk7XHJcbiAgICAgICAgY29uc3QgW3AyeCwgcDJ5XSA9IHRoaXMuYXJyYXlPZlBvaW50c1sxXS5nZXRQYWlyKCk7XHJcbiAgICAgICAgY29uc3QgW3AzeCwgcDN5XSA9IHRoaXMuYXJyYXlPZlBvaW50c1syXS5nZXRQYWlyKCk7XHJcbiAgICAgICAgY29uc3QgW3A0eCwgcDR5XSA9IHRoaXMuYXJyYXlPZlBvaW50c1szXS5nZXRQYWlyKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGNlbnRlclggPSAocDF4ICsgcDJ4ICsgcDN4ICsgcDR4KSAvIDQ7XHJcbiAgICAgICAgY29uc3QgY2VudGVyWSA9IChwMXkgKyBwMnkgKyBwM3kgKyBwNHkpIC8gNDtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gbmV3IFBvaW50KFtjZW50ZXJYLCBjZW50ZXJZXSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZE1hdHJpeChnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LCBtYXRyaXhMb2NhdGlvbjogV2ViR0xVbmlmb3JtTG9jYXRpb24pOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBtYXRyaXggPSBUcmFuc2Zvcm1hdGlvbi50cmFuc2Zvcm1hdGlvbk1hdHJpeChcclxuICAgICAgICAgICAgZ2wuY2FudmFzLndpZHRoLFxyXG4gICAgICAgICAgICBnbC5jYW52YXMuaGVpZ2h0LFxyXG4gICAgICAgICAgICB0aGlzLnR4LFxyXG4gICAgICAgICAgICB0aGlzLnR5LFxyXG4gICAgICAgICAgICB0aGlzLmRlZ3JlZSxcclxuICAgICAgICAgICAgdGhpcy5zeCxcclxuICAgICAgICAgICAgdGhpcy5zeSxcclxuICAgICAgICAgICAgdGhpcy5reCxcclxuICAgICAgICAgICAgdGhpcy5reSxcclxuICAgICAgICAgICAgdGhpcy5jZW50ZXJcclxuICAgICAgICAgICkuZmxhdHRlbigpO1xyXG4gICAgICBcclxuICAgICAgICAgIGdsLnVuaWZvcm1NYXRyaXgzZnYobWF0cml4TG9jYXRpb24sIGZhbHNlLCBtYXRyaXgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFJlbmRlcmFibGUgTWV0aG9kc1xyXG4gICAgcHVibGljIGRyYXdNZXRob2QoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIGdsLlRSSUFOR0xFX0ZBTjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaXNEcmF3YWJsZSgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcnJheU9mUG9pbnRzLmZpbHRlcihwb2ludCA9PiBwb2ludCAhPT0gbnVsbCkubGVuZ3RoID09PSA0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkcmF3KHBvaW50OiBQb2ludCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuYXJyYXlPZlBvaW50c1sxXSA9IG5ldyBQb2ludChbdGhpcy5hcnJheU9mUG9pbnRzWzBdLngsIHBvaW50LnldKTtcclxuICAgICAgICB0aGlzLmFycmF5T2ZQb2ludHNbMl0gPSBwb2ludDtcclxuICAgICAgICB0aGlzLmFycmF5T2ZQb2ludHNbM10gPSBuZXcgUG9pbnQoW3BvaW50LngsIHRoaXMuYXJyYXlPZlBvaW50c1swXS55XSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldE51bWJlck9mVmVydGljZXNUb0JlRHJhd24oKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkUG9zaXRpb24oZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IHZlcnRpY2VzID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLmFycmF5T2ZQb2ludHMucmVkdWNlKChhY2MsIHBvaW50KSA9PiB7XHJcbiAgICAgICAgICAgIGFjYy5wdXNoKC4uLnBvaW50LmdldFBhaXIoKSk7XHJcbiAgICAgICAgICAgIHJldHVybiBhY2M7XHJcbiAgICAgICAgfSwgW10gYXMgbnVtYmVyW10pKTtcclxuXHJcbiAgICAgICAgZ2wuYnVmZmVyRGF0YShnbC5BUlJBWV9CVUZGRVIsIHZlcnRpY2VzLCBnbC5TVEFUSUNfRFJBVyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZENvbG9yKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBjb2xvcnMgPSBuZXcgRmxvYXQzMkFycmF5KHRoaXMuYXJyYXlPZlBvaW50cy5yZWR1Y2UoKGFjYywgcG9pbnQpID0+IHtcclxuICAgICAgICAgICAgYWNjLnB1c2goLi4ucG9pbnQuZ2V0Q29sb3IoKSk7XHJcbiAgICAgICAgICAgIHJldHVybiBhY2M7XHJcbiAgICAgICAgfSwgW10gYXMgbnVtYmVyW10pKTtcclxuXHJcbiAgICAgICAgZ2wuYnVmZmVyRGF0YShnbC5BUlJBWV9CVUZGRVIsIGNvbG9ycywgZ2wuU1RBVElDX0RSQVcpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRSZWN0YW5nbGVBdHRyaWJ1dGVzKHR4OiBudW1iZXIsIHR5OiBudW1iZXIsIGRlZ3JlZTogbnVtYmVyLCBzeDogbnVtYmVyLCBzeTogbnVtYmVyLCBreDogbnVtYmVyLCBreTogbnVtYmVyLCBhcnJheU9mUG9pbnRzOiBQb2ludFtdKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5hcnJheU9mUG9pbnRzID0gYXJyYXlPZlBvaW50cztcclxuICAgICAgICB0aGlzLnR4ID0gdHg7XHJcbiAgICAgICAgdGhpcy50eSA9IHR5O1xyXG4gICAgICAgIHRoaXMuZGVncmVlID0gZGVncmVlO1xyXG4gICAgICAgIHRoaXMuc3ggPSBzeDtcclxuICAgICAgICB0aGlzLnN5ID0gc3k7XHJcbiAgICAgICAgdGhpcy5reCA9IGt4O1xyXG4gICAgICAgIHRoaXMua3kgPSBreTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgUmVjdGFuZ2xlO1xyXG4iLCJpbXBvcnQgUG9pbnQgZnJvbSBcIkJhc2UvcG9pbnRcIjtcclxuaW1wb3J0IFR5cGUgZnJvbSBcIlNoYXBlcy90eXBlLmVudW1cIjtcclxuYWJzdHJhY3QgY2xhc3MgU2hhcGUge1xyXG4gICAgcHVibGljIGlkOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgbnVtYmVyT2ZWZXJ0aWNlczogbnVtYmVyO1xyXG4gICAgcHVibGljIHR5cGU6IFR5cGU7XHJcbiAgICBwdWJsaWMgYXJyYXlPZlBvaW50czogUG9pbnRbXTtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoaWQ6IG51bWJlciwgbnVtYmVyT2ZWZXJ0aWNlczogbnVtYmVyLCB0eXBlOiBUeXBlKXtcclxuICAgICAgICB0aGlzLmlkID0gaWQ7XHJcbiAgICAgICAgdGhpcy5udW1iZXJPZlZlcnRpY2VzID0gbnVtYmVyT2ZWZXJ0aWNlcztcclxuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhYnN0cmFjdCBnZXRDZW50ZXIoKTogUG9pbnQ7XHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgaXNEcmF3YWJsZSgpOiBib29sZWFuO1xyXG4gICAgcHVibGljIGFic3RyYWN0IGRyYXcocG9pbnQ6IFBvaW50KTogdm9pZDtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgU2hhcGU7IiwiaW1wb3J0IFJlbmRlcmFibGUgZnJvbSBcIi4vSW50ZXJmYWNlcy9yZW5kZXJhYmxlLmludGVyZmFjZVwiO1xyXG5pbXBvcnQgU2hhcGUgZnJvbSBcIi4vc2hhcGVcIjtcclxuaW1wb3J0IFRyYW5zZm9ybWF0aW9uIGZyb20gXCJNYWluL09wZXJhdGlvbnMvVHJhbnNmb3JtYXRpb25cIjtcclxuaW1wb3J0IFRyYW5zZm9ybWFibGUgZnJvbSBcIi4vSW50ZXJmYWNlcy90cmFuc2Zvcm1hYmxlLmludGVyZmFjZVwiO1xyXG5pbXBvcnQgUG9pbnQgZnJvbSBcIi4uL0Jhc2UvcG9pbnRcIjtcclxuaW1wb3J0IFR5cGUgZnJvbSBcIi4vdHlwZS5lbnVtXCI7XHJcblxyXG5jbGFzcyBTcXVhcmUgZXh0ZW5kcyBTaGFwZSBpbXBsZW1lbnRzIFJlbmRlcmFibGUsIFRyYW5zZm9ybWFibGUge1xyXG4gICAgcHVibGljIGNlbnRlcjogUG9pbnQ7XHJcbiAgICBwdWJsaWMgYXJyYXlPZlBvaW50czogUG9pbnRbXTtcclxuICAgIHB1YmxpYyB0eDogbnVtYmVyO1xyXG4gICAgcHVibGljIHR5OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgZGVncmVlOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgc3g6IG51bWJlcjtcclxuICAgIHB1YmxpYyBzeTogbnVtYmVyO1xyXG4gICAgcHVibGljIGt4OiBudW1iZXI7XHJcbiAgICBwdWJsaWMga3k6IG51bWJlcjtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoaWQ6IG51bWJlciwgY2VudGVyUG9pbnQ6IFBvaW50KSB7XHJcbiAgICAgICAgc3VwZXIoaWQsIDQsIFR5cGUuU3F1YXJlKTtcclxuICAgICAgICB0aGlzLmNlbnRlciA9IGNlbnRlclBvaW50O1xyXG4gICAgICAgIHRoaXMuYXJyYXlPZlBvaW50cyA9IFtdO1xyXG4gICAgICAgIHRoaXMudHggPSAwO1xyXG4gICAgICAgIHRoaXMudHkgPSAwO1xyXG4gICAgICAgIHRoaXMuZGVncmVlID0gMDtcclxuICAgICAgICB0aGlzLnN4ID0gMTtcclxuICAgICAgICB0aGlzLnN5ID0gMTtcclxuICAgICAgICB0aGlzLmt4ID0gMDtcclxuICAgICAgICB0aGlzLmt5ID0gMDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBUcmFuc2Zvcm1hYmxlIE1ldGhvZHNcclxuICAgIHB1YmxpYyBnZXRDZW50ZXIoKTogUG9pbnQge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNlbnRlcjtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIGFkZE1hdHJpeChnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LCBtYXRyaXhMb2NhdGlvbjogV2ViR0xVbmlmb3JtTG9jYXRpb24pOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBtYXRyaXggPSBUcmFuc2Zvcm1hdGlvbi50cmFuc2Zvcm1hdGlvbk1hdHJpeChcclxuICAgICAgICAgICAgZ2wuY2FudmFzLndpZHRoLFxyXG4gICAgICAgICAgICBnbC5jYW52YXMuaGVpZ2h0LFxyXG4gICAgICAgICAgICB0aGlzLnR4LFxyXG4gICAgICAgICAgICB0aGlzLnR5LFxyXG4gICAgICAgICAgICB0aGlzLmRlZ3JlZSxcclxuICAgICAgICAgICAgdGhpcy5zeCxcclxuICAgICAgICAgICAgdGhpcy5zeSxcclxuICAgICAgICAgICAgdGhpcy5reCxcclxuICAgICAgICAgICAgdGhpcy5reSxcclxuICAgICAgICAgICAgdGhpcy5jZW50ZXJcclxuICAgICAgICApLmZsYXR0ZW4oKTtcclxuXHJcbiAgICAgICAgZ2wudW5pZm9ybU1hdHJpeDNmdihtYXRyaXhMb2NhdGlvbiwgZmFsc2UsIG1hdHJpeCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUmVuZGVyYWJsZSBNZXRob2RzXHJcbiAgICBwdWJsaWMgZHJhd01ldGhvZChnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0KTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gZ2wuVFJJQU5HTEVfRkFOO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpc0RyYXdhYmxlKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoID09PSA0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkcmF3KHAxOiBQb2ludCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuYXJyYXlPZlBvaW50c1swXSA9IHAxO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSAzOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGFuZ2xlID0gKGkgKiBNYXRoLlBJKSAvIDI7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByb3RhdGlvbk1hdHJpeCA9IFRyYW5zZm9ybWF0aW9uLnRyYW5zbGF0aW9uKHRoaXMuY2VudGVyLmdldFgoKSwgdGhpcy5jZW50ZXIuZ2V0WSgpKVxyXG4gICAgICAgICAgICAgICAgICAgIC5tdWx0aXBseU1hdHJpeChUcmFuc2Zvcm1hdGlvbi5yb3RhdGlvbihhbmdsZSkpXHJcbiAgICAgICAgICAgICAgICAgICAgLm11bHRpcGx5TWF0cml4KFRyYW5zZm9ybWF0aW9uLnRyYW5zbGF0aW9uKC10aGlzLmNlbnRlci5nZXRYKCksIC10aGlzLmNlbnRlci5nZXRZKCkpKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJvdGF0ZWRQb2ludCA9IHJvdGF0aW9uTWF0cml4Lm11bHRpcGx5UG9pbnQocDEpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hcnJheU9mUG9pbnRzW2ldID0gcm90YXRlZFBvaW50O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXROdW1iZXJPZlZlcnRpY2VzVG9CZURyYXduKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJyYXlPZlBvaW50cy5sZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZFBvc2l0aW9uKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCB2ZXJ0aWNlcyA9IG5ldyBGbG9hdDMyQXJyYXkodGhpcy5hcnJheU9mUG9pbnRzLnJlZHVjZSgoYWNjLCBwb2ludCkgPT4ge1xyXG4gICAgICAgICAgICBhY2MucHVzaCguLi5wb2ludC5nZXRQYWlyKCkpO1xyXG4gICAgICAgICAgICByZXR1cm4gYWNjO1xyXG4gICAgICAgIH0sIFtdIGFzIG51bWJlcltdKSk7XHJcblxyXG4gICAgICAgIGdsLmJ1ZmZlckRhdGEoZ2wuQVJSQVlfQlVGRkVSLCB2ZXJ0aWNlcywgZ2wuU1RBVElDX0RSQVcpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRDb2xvcihnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0KTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgY29sb3JzID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLmFycmF5T2ZQb2ludHMucmVkdWNlKChhY2MsIHBvaW50KSA9PiB7XHJcbiAgICAgICAgICAgIGFjYy5wdXNoKC4uLnBvaW50LmdldENvbG9yKCkpO1xyXG4gICAgICAgICAgICByZXR1cm4gYWNjO1xyXG4gICAgICAgIH0sIFtdIGFzIG51bWJlcltdKSk7XHJcblxyXG4gICAgICAgIGdsLmJ1ZmZlckRhdGEoZ2wuQVJSQVlfQlVGRkVSLCBjb2xvcnMsIGdsLlNUQVRJQ19EUkFXKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0U3F1YXJlQXR0cmlidXRlcyh0eDogbnVtYmVyLCB0eTogbnVtYmVyLCBkZWdyZWU6IG51bWJlciwgc3g6IG51bWJlciwgc3k6IG51bWJlciwga3g6IG51bWJlciwga3k6IG51bWJlciwgYXJyYXlPZlBvaW50czogUG9pbnRbXSk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuYXJyYXlPZlBvaW50cyA9IGFycmF5T2ZQb2ludHM7XHJcbiAgICAgICAgdGhpcy50eCA9IHR4O1xyXG4gICAgICAgIHRoaXMudHkgPSB0eTtcclxuICAgICAgICB0aGlzLmRlZ3JlZSA9IGRlZ3JlZTtcclxuICAgICAgICB0aGlzLnN4ID0gc3g7XHJcbiAgICAgICAgdGhpcy5zeSA9IHN5O1xyXG4gICAgICAgIHRoaXMua3ggPSBreDtcclxuICAgICAgICB0aGlzLmt5ID0ga3k7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFNxdWFyZTtcclxuIiwiZW51bSBUeXBlIHtcclxuICAgIExpbmUsXHJcbiAgICBSZWN0YW5nbGUsXHJcbiAgICBTcXVhcmUsXHJcbiAgICBQb2x5Z29uXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFR5cGU7IiwiY2xhc3MgQ29vcmRpbmF0ZSB7XHJcbiAgICBwdWJsaWMgeDogbnVtYmVyO1xyXG4gICAgcHVibGljIHk6IG51bWJlcjtcclxuICAgIHB1YmxpYyB3OiBudW1iZXI7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHg6IG51bWJlciwgeTogbnVtYmVyLCB3OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICAgICAgdGhpcy53ID0gdztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0Q29vcmRpbmF0ZSgpOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl0ge1xyXG4gICAgICAgIHJldHVybiBbdGhpcy54LCB0aGlzLnksIHRoaXMud107XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldENvb3JkaW5hdGUoeDogbnVtYmVyLCB5OiBudW1iZXIsIHc6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgdGhpcy55ID0geTtcclxuICAgICAgICB0aGlzLncgPSB3O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRYKHg6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldFkoeTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy55ID0geTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0Vyh3OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLncgPSB3O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgZ2V0WCgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLng7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFkoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy55O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRXKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudztcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQ29vcmRpbmF0ZTsiLCJpbXBvcnQgQ29vcmRpbmF0ZSBmcm9tICdCYXNlL2Nvb3JkaW5hdGUnO1xyXG5pbXBvcnQgUG9pbnQgZnJvbSAnQmFzZS9wb2ludCc7XHJcblxyXG5jbGFzcyBNYXRyaXgge1xyXG4gICAgcHVibGljIG0xOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl07XHJcbiAgICBwdWJsaWMgbTI6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXTtcclxuICAgIHB1YmxpYyBtMzogW251bWJlciwgbnVtYmVyLCBudW1iZXJdO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihtMTogW251bWJlciwgbnVtYmVyLCBudW1iZXJdLCBtMjogW251bWJlciwgbnVtYmVyLCBudW1iZXJdLCBtMzogW251bWJlciwgbnVtYmVyLCBudW1iZXJdKSB7XHJcbiAgICAgICAgdGhpcy5tMSA9IG0xO1xyXG4gICAgICAgIHRoaXMubTIgPSBtMjtcclxuICAgICAgICB0aGlzLm0zID0gbTM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGZsYXR0ZW4oKSA6IG51bWJlcltdIHtcclxuICAgICAgICByZXR1cm4gWy4uLnRoaXMubTEsIC4uLnRoaXMubTIsIC4uLnRoaXMubTNdXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG11bHRpcGx5TWF0cml4KG90aGVyTWF0cml4OiBNYXRyaXgpOiBNYXRyaXgge1xyXG4gICAgICAgIGNvbnN0IFthMTEsIGExMiwgYTEzXSA9IHRoaXMubTE7XHJcbiAgICAgICAgY29uc3QgW2EyMSwgYTIyLCBhMjNdID0gdGhpcy5tMjtcclxuICAgICAgICBjb25zdCBbYTMxLCBhMzIsIGEzM10gPSB0aGlzLm0zO1xyXG5cclxuICAgICAgICBjb25zdCBbYjExLCBiMTIsIGIxM10gPSBvdGhlck1hdHJpeC5tMTtcclxuICAgICAgICBjb25zdCBbYjIxLCBiMjIsIGIyM10gPSBvdGhlck1hdHJpeC5tMjtcclxuICAgICAgICBjb25zdCBbYjMxLCBiMzIsIGIzM10gPSBvdGhlck1hdHJpeC5tMztcclxuXHJcbiAgICAgICAgY29uc3QgYzExID0gYTExICogYjExICsgYTEyICogYjIxICsgYTEzICogYjMxO1xyXG4gICAgICAgIGNvbnN0IGMxMiA9IGExMSAqIGIxMiArIGExMiAqIGIyMiArIGExMyAqIGIzMjtcclxuICAgICAgICBjb25zdCBjMTMgPSBhMTEgKiBiMTMgKyBhMTIgKiBiMjMgKyBhMTMgKiBiMzM7XHJcbiAgICAgICAgY29uc3QgYzIxID0gYTIxICogYjExICsgYTIyICogYjIxICsgYTIzICogYjMxO1xyXG4gICAgICAgIGNvbnN0IGMyMiA9IGEyMSAqIGIxMiArIGEyMiAqIGIyMiArIGEyMyAqIGIzMjtcclxuICAgICAgICBjb25zdCBjMjMgPSBhMjEgKiBiMTMgKyBhMjIgKiBiMjMgKyBhMjMgKiBiMzM7XHJcbiAgICAgICAgY29uc3QgYzMxID0gYTMxICogYjExICsgYTMyICogYjIxICsgYTMzICogYjMxO1xyXG4gICAgICAgIGNvbnN0IGMzMiA9IGEzMSAqIGIxMiArIGEzMiAqIGIyMiArIGEzMyAqIGIzMjtcclxuICAgICAgICBjb25zdCBjMzMgPSBhMzEgKiBiMTMgKyBhMzIgKiBiMjMgKyBhMzMgKiBiMzM7XHJcblxyXG4gICAgICAgIGNvbnN0IG1hdHJpeCA9IG5ldyBNYXRyaXgoW2MxMSwgYzEyLCBjMTNdLCBbYzIxLCBjMjIsIGMyM10sIFtjMzEsIGMzMiwgYzMzXSk7XHJcbiAgICAgICAgcmV0dXJuIG1hdHJpeDtcclxuICAgIH1cclxuXHJcblxyXG4gICAgcHVibGljIG11bHRpcGx5UG9pbnQocG9pbnQ6IFBvaW50KTogUG9pbnQge1xyXG4gICAgICAgIGNvbnN0IFthMTEsIGEyMSwgYTMxXSA9IHRoaXMubTE7XHJcbiAgICAgICAgY29uc3QgW2ExMiwgYTIyLCBhMzJdID0gdGhpcy5tMjtcclxuICAgICAgICBjb25zdCBbYTEzLCBhMjMsIGEzM10gPSB0aGlzLm0zO1xyXG5cclxuICAgICAgICBjb25zdCB4MSA9IGExMSAqIHBvaW50LnggKyBhMTIgKiBwb2ludC55ICsgYTEzICogcG9pbnQudztcclxuICAgICAgICBjb25zdCB5MSA9IGEyMSAqIHBvaW50LnggKyBhMjIgKiBwb2ludC55ICsgYTIzICogcG9pbnQudztcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBuZXdQb2ludCA9IG5ldyBQb2ludChbeDEsIHkxXSk7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXdQb2ludDtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgTWF0cml4OyIsImltcG9ydCBDb29yZGluYXRlIGZyb20gXCIuL2Nvb3JkaW5hdGVcIjtcclxuXHJcbmNsYXNzIFBvaW50ICBleHRlbmRzIENvb3JkaW5hdGUge1xyXG4gICAgcHVibGljIHI6IG51bWJlcjtcclxuICAgIHB1YmxpYyBnOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgYjogbnVtYmVyO1xyXG4gICAgcHVibGljIGE6IG51bWJlcjtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IocG9zaXRpb246IFtudW1iZXIsIG51bWJlcl0sIGNvbG9yOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9IFswLCAwLCAwLCAxXSkge1xyXG4gICAgICAgIHN1cGVyKC4uLnBvc2l0aW9uLCAxKTtcclxuXHJcbiAgICAgICAgW3RoaXMuciwgdGhpcy5nLCB0aGlzLmIsIHRoaXMuYV0gPSBjb2xvcjtcclxuXHJcbiAgICAgICAgY29uc3QgW3IsIGcsIGIsIGFdID0gY29sb3I7XHJcbiAgICAgICAgdGhpcy5yID0gcjtcclxuICAgICAgICB0aGlzLmcgPSBnO1xyXG4gICAgICAgIHRoaXMuYiA9IGI7XHJcbiAgICAgICAgdGhpcy5hID0gYTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0UGFpcigpOiBbbnVtYmVyLCBudW1iZXJdIHtcclxuICAgICAgICByZXR1cm4gW3RoaXMueCwgdGhpcy55XTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0Q29sb3IoKTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0ge1xyXG4gICAgICAgIHJldHVybiBbdGhpcy5yLCB0aGlzLmcsIHRoaXMuYiwgdGhpcy5hXTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0Q29sb3IoY29sb3I6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgW3IsIGcsIGIsIGFdID0gY29sb3I7XHJcbiAgICAgICAgdGhpcy5yID0gcjtcclxuICAgICAgICB0aGlzLmcgPSBnO1xyXG4gICAgICAgIHRoaXMuYiA9IGI7XHJcbiAgICAgICAgdGhpcy5hID0gYTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgUG9pbnQ7IiwiaW1wb3J0IHsgbG9hZFNoYWRlciB9IGZyb20gXCIuL2xvYWQtc2hhZGVyXCI7XHJcblxyXG4vL1xyXG4vLyBJbml0aWFsaXplIGEgc2hhZGVyIHByb2dyYW0sIHNvIFdlYkdMIGtub3dzIGhvdyB0byBkcmF3IG91ciBkYXRhXHJcbi8vXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTaGFkZXJQcm9ncmFtKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsIHZzU291cmNlOiBzdHJpbmcsIGZzU291cmNlOiBzdHJpbmcpIHtcclxuICAgIGNvbnN0IHZlcnRleFNoYWRlciA9IGxvYWRTaGFkZXIoZ2wsIGdsLlZFUlRFWF9TSEFERVIsIHZzU291cmNlKTtcclxuICAgIGNvbnN0IGZyYWdtZW50U2hhZGVyID0gbG9hZFNoYWRlcihnbCwgZ2wuRlJBR01FTlRfU0hBREVSLCBmc1NvdXJjZSk7XHJcbiAgXHJcbiAgICAvLyBDcmVhdGUgdGhlIHNoYWRlciBwcm9ncmFtXHJcbiAgICBjb25zdCBzaGFkZXJQcm9ncmFtID0gZ2wuY3JlYXRlUHJvZ3JhbSgpO1xyXG4gICAgZ2wuYXR0YWNoU2hhZGVyKHNoYWRlclByb2dyYW0sIHZlcnRleFNoYWRlcik7XHJcbiAgICBnbC5hdHRhY2hTaGFkZXIoc2hhZGVyUHJvZ3JhbSwgZnJhZ21lbnRTaGFkZXIpO1xyXG4gICAgZ2wubGlua1Byb2dyYW0oc2hhZGVyUHJvZ3JhbSk7XHJcbiAgXHJcbiAgICAvLyBJZiBjcmVhdGluZyB0aGUgc2hhZGVyIHByb2dyYW0gZmFpbGVkLCBhbGVydFxyXG4gIFxyXG4gICAgaWYgKCFnbC5nZXRQcm9ncmFtUGFyYW1ldGVyKHNoYWRlclByb2dyYW0sIGdsLkxJTktfU1RBVFVTKSkge1xyXG4gICAgICBhbGVydChcclxuICAgICAgICBgVW5hYmxlIHRvIGluaXRpYWxpemUgdGhlIHNoYWRlciBwcm9ncmFtOiAke2dsLmdldFByb2dyYW1JbmZvTG9nKFxyXG4gICAgICAgICAgc2hhZGVyUHJvZ3JhbSxcclxuICAgICAgICApfWAsXHJcbiAgICAgICk7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHNoYWRlclByb2dyYW07XHJcbiAgfSIsIiAgLy9cclxuICAvLyBjcmVhdGVzIGEgc2hhZGVyIG9mIHRoZSBnaXZlbiB0eXBlLCB1cGxvYWRzIHRoZSBzb3VyY2UgYW5kXHJcbiAgLy8gY29tcGlsZXMgaXQuXHJcbiAgLy9cclxuZXhwb3J0IGZ1bmN0aW9uIGxvYWRTaGFkZXIoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCwgdHlwZTogbnVtYmVyLCBzb3VyY2U6IHN0cmluZyk6IFdlYkdMU2hhZGVyIHtcclxuICAgIGNvbnN0IHNoYWRlciA9IGdsLmNyZWF0ZVNoYWRlcih0eXBlKTtcclxuICBcclxuICAgIC8vIFNlbmQgdGhlIHNvdXJjZSB0byB0aGUgc2hhZGVyIG9iamVjdFxyXG4gICAgZ2wuc2hhZGVyU291cmNlKHNoYWRlciwgc291cmNlKTtcclxuICBcclxuICAgIC8vIENvbXBpbGUgdGhlIHNoYWRlciBwcm9ncmFtXHJcbiAgICBnbC5jb21waWxlU2hhZGVyKHNoYWRlcik7XHJcbiAgXHJcbiAgICAvLyBTZWUgaWYgaXQgY29tcGlsZWQgc3VjY2Vzc2Z1bGx5XHJcbiAgICBpZiAoIWdsLmdldFNoYWRlclBhcmFtZXRlcihzaGFkZXIsIGdsLkNPTVBJTEVfU1RBVFVTKSkge1xyXG4gICAgICBhbGVydChgQW4gZXJyb3Igb2NjdXJyZWQgY29tcGlsaW5nIHRoZSBzaGFkZXJzOiAke2dsLmdldFNoYWRlckluZm9Mb2coc2hhZGVyKX1gLCk7XHJcbiAgICAgIGdsLmRlbGV0ZVNoYWRlcihzaGFkZXIpO1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIHJldHVybiBzaGFkZXI7XHJcbn0iLCJpbXBvcnQgU2hhcGUgZnJvbSBcIk1haW4vMkQtU2hhcGVzL3NoYXBlXCI7XHJcbmltcG9ydCB7IHJlbmRlciB9IGZyb20gXCIuL3JlbmRlclwiO1xyXG5pbXBvcnQgUHJvZ3JhbUluZm8gZnJvbSBcIi4vcHJvZ3JhbS1pbmZvLmludGVyZmFjZVwiO1xyXG5pbXBvcnQgUmVuZGVyYWJsZSBmcm9tIFwiTWFpbi8yRC1TaGFwZXMvSW50ZXJmYWNlcy9yZW5kZXJhYmxlLmludGVyZmFjZVwiO1xyXG5pbXBvcnQgVHJhbnNmb3JtYWJsZSBmcm9tIFwiTWFpbi8yRC1TaGFwZXMvSW50ZXJmYWNlcy90cmFuc2Zvcm1hYmxlLmludGVyZmFjZVwiO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlckFsbChnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LCBwcm9ncmFtSW5mbzogUHJvZ3JhbUluZm8sIHNoYXBlczogKFJlbmRlcmFibGUmVHJhbnNmb3JtYWJsZSlbXSwgcG9zaXRpb25CdWZmZXI6IFdlYkdMQnVmZmVyLCBjb2xvckJ1ZmZlcjogV2ViR0xCdWZmZXIpOiB2b2lkIHtcclxuICAgIGdsLmNsZWFyKGdsLkNPTE9SX0JVRkZFUl9CSVQpO1xyXG4gIFxyXG4gICAgZm9yIChjb25zdCBzaGFwZSBvZiBzaGFwZXMpIHtcclxuICAgICAgcmVuZGVyKGdsLCBwcm9ncmFtSW5mbywgc2hhcGUsIHBvc2l0aW9uQnVmZmVyLCBjb2xvckJ1ZmZlcilcclxuICAgIH1cclxuICBcclxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gcmVuZGVyQWxsKGdsLCBwcm9ncmFtSW5mbywgc2hhcGVzLCBwb3NpdGlvbkJ1ZmZlciwgY29sb3JCdWZmZXIpKTtcclxuICB9OyIsImltcG9ydCBSZW5kZXJhYmxlIGZyb20gXCJNYWluLzJELVNoYXBlcy9JbnRlcmZhY2VzL3JlbmRlcmFibGUuaW50ZXJmYWNlXCI7XHJcbmltcG9ydCBQcm9ncmFtSW5mbyBmcm9tIFwiLi9wcm9ncmFtLWluZm8uaW50ZXJmYWNlXCI7XHJcbmltcG9ydCBUcmFuc2Zvcm1hYmxlIGZyb20gXCJNYWluLzJELVNoYXBlcy9JbnRlcmZhY2VzL3RyYW5zZm9ybWFibGUuaW50ZXJmYWNlXCI7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsIHByb2dyYW1JbmZvOiBQcm9ncmFtSW5mbywgb2JqZWN0OiBSZW5kZXJhYmxlICYgVHJhbnNmb3JtYWJsZSwgcG9zaXRpb25CdWZmZXI6IFdlYkdMQnVmZmVyLCBjb2xvckJ1ZmZlcjogV2ViR0xCdWZmZXIpOiB2b2lkIHtcclxuICAgIGlmICghb2JqZWN0LmlzRHJhd2FibGUoKSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICAvLyBBZGQgUG9zaXRpb24gdG8gZ2wgYnVmZmVyXHJcbiAgICBjb25zb2xlLmxvZyhcImtvbnRvbG9kb24zXCIpO1xyXG4gICAgb2JqZWN0LmFkZFBvc2l0aW9uKGdsKTtcclxuICAgIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBwb3NpdGlvbkJ1ZmZlcik7XHJcbiAgICBcclxuICAgIGNvbnNvbGUubG9nKFwia29udG9sb2RvbjRcIik7XHJcbiAgICAvLyBBZGQgQ29sb3IgdG8gZ2wgYnVmZmVyXHJcbiAgICBvYmplY3QuYWRkQ29sb3IoZ2wpO1xyXG4gICAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIGNvbG9yQnVmZmVyKTtcclxuICAgIC8vIEFkZCBNYXRyaXggdG8gZ2xcclxuICAgIGNvbnN0IG1hdHJpeExvY2F0aW9uID0gcHJvZ3JhbUluZm8udW5pZm9ybUxvY2F0aW9ucy5tYXRyaXhMb2NhdGlvblxyXG4gICAgb2JqZWN0LmFkZE1hdHJpeChnbCwgbWF0cml4TG9jYXRpb24pO1xyXG5cclxuXHJcbiAgICAvKiBEcmF3IHNjZW5lICovXHJcbiAgICBjb25zdCBwcmltaXRpdmVUeXBlID0gb2JqZWN0LmRyYXdNZXRob2QoZ2wpO1xyXG4gICAgY29uc3Qgb2Zmc2V0ID0gMDtcclxuICAgIGNvbnN0IG51bWJlck9mVmVydGljZXNUb0JlRHJhd24gPSBvYmplY3QuZ2V0TnVtYmVyT2ZWZXJ0aWNlc1RvQmVEcmF3bigpO1xyXG4gICAgY29uc29sZS5sb2coXCJrb250b2xvZG9uNVwiKTtcclxuICAgIGdsLmRyYXdBcnJheXMocHJpbWl0aXZlVHlwZSwgb2Zmc2V0LCBudW1iZXJPZlZlcnRpY2VzVG9CZURyYXduKTtcclxufSIsImltcG9ydCBQcm9ncmFtSW5mbyBmcm9tIFwiLi9wcm9ncmFtLWluZm8uaW50ZXJmYWNlXCI7XHJcblxyXG5cclxuLy8gVGVsbCBXZWJHTCBob3cgdG8gcHVsbCBvdXQgdGhlIHBvc2l0aW9ucyBmcm9tIHRoZSBwb3NpdGlvbiBidWZmZXIgaW50byB0aGUgdmVydGV4UG9zaXRpb24gYXR0cmlidXRlLlxyXG5leHBvcnQgZnVuY3Rpb24gc2V0QXR0cmlidXRlcyhnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LCBwb3NpdGlvbkJ1ZmZlcjogV2ViR0xCdWZmZXIsIGNvbG9yQnVmZmVyOiBXZWJHTEJ1ZmZlciwgcHJvZ3JhbUluZm86UHJvZ3JhbUluZm8gKSB7XHJcbiAgICBcclxuICAgIGNvbnN0IG51bUNvbXBvbmVudHMgPSAyOyAvLyBwdWxsIG91dCAyIHZhbHVlcyBwZXIgaXRlcmF0aW9uXHJcbiAgICBjb25zdCB0eXBlID0gZ2wuRkxPQVQ7IC8vIHRoZSBkYXRhIGluIHRoZSBidWZmZXIgaXMgMzJiaXQgZmxvYXRzXHJcbiAgICBjb25zdCBub3JtYWxpemUgPSBmYWxzZTsgLy8gZG9uJ3Qgbm9ybWFsaXplXHJcbiAgICBjb25zdCBzdHJpZGUgPSAwOyAvLyBob3cgbWFueSBieXRlcyB0byBnZXQgZnJvbSBvbmUgc2V0IG9mIHZhbHVlcyB0byB0aGUgbmV4dFxyXG4gICAgLy8gMCA9IHVzZSB0eXBlIGFuZCBudW1Db21wb25lbnRzIGFib3ZlXHJcbiAgICBjb25zdCBvZmZzZXQgPSAwOyAvLyBob3cgbWFueSBieXRlcyBpbnNpZGUgdGhlIGJ1ZmZlciB0byBzdGFydCBmcm9tXHJcbiAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgcG9zaXRpb25CdWZmZXIpO1xyXG4gICAgZ2wudmVydGV4QXR0cmliUG9pbnRlcihcclxuICAgICAgcHJvZ3JhbUluZm8uYXR0cmliTG9jYXRpb25zLnZlcnRleFBvc2l0aW9uLFxyXG4gICAgICBudW1Db21wb25lbnRzLFxyXG4gICAgICB0eXBlLFxyXG4gICAgICBub3JtYWxpemUsXHJcbiAgICAgIHN0cmlkZSxcclxuICAgICAgb2Zmc2V0LFxyXG4gICAgKTtcclxuICAgIGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KHByb2dyYW1JbmZvLmF0dHJpYkxvY2F0aW9ucy52ZXJ0ZXhQb3NpdGlvbik7XHJcbiAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgcG9zaXRpb25CdWZmZXIpO1xyXG5cclxuICAgIGNvbnN0IGNvbG9yU2l6ZSA9IDQ7IC8qIDQgY29tcG9uZW50cyBwZXIgaXRlcmF0aW9uICovXHJcbiAgICBjb25zdCBjb2xvclR5cGUgPSBnbC5GTE9BVDsgLyogVGhlIGRhdGEgaXMgMzIgYml0IGZsb2F0ICovXHJcbiAgICBjb25zdCBjb2xvck5vcm1hbGl6ZWQgPSBmYWxzZTsgLyogRG9uJ3Qgbm9ybWFsaXplIHRoZSBkYXRhICovXHJcbiAgICBjb25zdCBjb2xvclN0cmlkZSA9IDA7IC8qIDA6IE1vdmUgZm9yd2FyZCBzaXplICogc2l6ZW9mKHR5cGUpIGVhY2ggaXRlcmF0aW9uIHRvIGdldCB0aGUgbmV4dCBwb3NpdGlvbiAqL1xyXG4gICAgY29uc3QgY29sb3JPZmZzZXQgPSAwOyAvKiBTdGFydCBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSBidWZmZXIgKi9cclxuICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIoXHJcbiAgICAgIHByb2dyYW1JbmZvLmF0dHJpYkxvY2F0aW9ucy52ZXJ0ZXhDb2xvcixcclxuICAgICAgY29sb3JTaXplLFxyXG4gICAgICBjb2xvclR5cGUsXHJcbiAgICAgIGNvbG9yTm9ybWFsaXplZCxcclxuICAgICAgY29sb3JTdHJpZGUsXHJcbiAgICAgIGNvbG9yT2Zmc2V0XHJcbiAgICApO1xyXG4gICAgXHJcbiAgICBnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheShwcm9ncmFtSW5mby5hdHRyaWJMb2NhdGlvbnMudmVydGV4Q29sb3IpO1xyXG4gICAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIGNvbG9yQnVmZmVyKTtcclxufSAgIiwiaW1wb3J0IE1hdHJpeCBmcm9tIFwiTWFpbi9CYXNlL21hdHJpeFwiO1xyXG5pbXBvcnQgUG9pbnQgZnJvbSBcIk1haW4vQmFzZS9wb2ludFwiO1xyXG5cclxuXHJcbmNsYXNzIFRyYW5zZm9ybWF0aW9ue1xyXG4gICAgcHVibGljIHN0YXRpYyBwcm9qZWN0aW9uKHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyKTogTWF0cml4IHtcclxuICAgICAgICBjb25zdCBtYXRyaXggPSBuZXcgTWF0cml4KFsyL3dpZHRoLCAwLCAwXSwgWzAsIC0yL2hlaWdodCwgMF0sIFstMSwgMSwgMV0pO1xyXG4gICAgICAgIHJldHVybiBtYXRyaXg7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc3RhdGljIHRyYW5zbGF0aW9uKHR4OiBudW1iZXIsIHR5OiBudW1iZXIpOiBNYXRyaXgge1xyXG4gICAgICAgIGNvbnN0IG1hdHJpeCA9IG5ldyBNYXRyaXgoWzEsMCwwXSwgWzAsIDEsIDBdLCBbdHgsIHR5LCAxXSk7XHJcbiAgICAgICAgcmV0dXJuIG1hdHJpeDtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzdGF0aWMgcm90YXRpb24oZGVncmVlOiBudW1iZXIpOiBNYXRyaXgge1xyXG4gICAgICAgIGNvbnN0IG1hdHJpeCA9IG5ldyBNYXRyaXgoW01hdGguY29zKGRlZ3JlZSksIE1hdGguc2luKGRlZ3JlZSksIDBdLCBbLU1hdGguc2luKGRlZ3JlZSksIE1hdGguY29zKGRlZ3JlZSksIDBdLCBbMCwgMCwgMV0pO1xyXG4gICAgICAgIHJldHVybiBtYXRyaXg7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc3RhdGljIHNjYWxlKHN4OiBudW1iZXIsIHN5OiBudW1iZXIpOiBNYXRyaXgge1xyXG4gICAgICAgIGNvbnN0IG1hdHJpeCA9IG5ldyBNYXRyaXgoW3N4LDAsMF0sIFswLCBzeSwgMF0sIFswLCAwLCAxXSk7XHJcbiAgICAgICAgcmV0dXJuIG1hdHJpeFxyXG4gICAgfVxyXG4gICAgcHVibGljIHN0YXRpYyBzaGVhclgoa3g6IG51bWJlcik6IE1hdHJpeCB7XHJcbiAgICAgICAgY29uc3QgbWF0cml4ID0gbmV3IE1hdHJpeChbMSwgMCwgMF0sIFtreCwgMSwgMF0sIFswLCAwLCAxXSk7XHJcbiAgICAgICAgcmV0dXJuIG1hdHJpeDtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzdGF0aWMgc2hlYXJZKGt4OiBudW1iZXIpOiBNYXRyaXgge1xyXG4gICAgICAgIGNvbnN0IG1hdHJpeCA9IG5ldyBNYXRyaXgoWzEsIGt4LCAwXSwgWzAsIDEsIDBdLCBbMCwgMCwgMV0pO1xyXG4gICAgICAgIHJldHVybiBtYXRyaXg7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc3RhdGljIHRyYW5zZm9ybWF0aW9uTWF0cml4KFxyXG4gICAgICAgIHdpZHRoOiBudW1iZXIsXHJcbiAgICAgICAgaGVpZ2h0OiBudW1iZXIsXHJcbiAgICAgICAgdHg6IG51bWJlcixcclxuICAgICAgICB0eTogbnVtYmVyLFxyXG4gICAgICAgIGRlZ3JlZTogbnVtYmVyLFxyXG4gICAgICAgIHN4OiBudW1iZXIsXHJcbiAgICAgICAgc3k6IG51bWJlcixcclxuICAgICAgICBreDogbnVtYmVyLFxyXG4gICAgICAgIGt5OiBudW1iZXIsXHJcbiAgICAgICAgY2VudGVyOiBQb2ludFxyXG4gICAgKSA6IE1hdHJpeCB7XHJcbiAgICAgICAgcmV0dXJuIFRyYW5zZm9ybWF0aW9uLnByb2plY3Rpb24od2lkdGgsIGhlaWdodClcclxuICAgICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24udHJhbnNsYXRpb24odHgsIHR5KSlcclxuICAgICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24udHJhbnNsYXRpb24oY2VudGVyLmdldFgoKSwgY2VudGVyLmdldFkoKSkpXHJcbiAgICAgICAgLm11bHRpcGx5TWF0cml4KFRyYW5zZm9ybWF0aW9uLnJvdGF0aW9uKGRlZ3JlZSkpXHJcbiAgICAgICAgLm11bHRpcGx5TWF0cml4KFRyYW5zZm9ybWF0aW9uLnNjYWxlKHN4LCBzeSkpXHJcbiAgICAgICAgLm11bHRpcGx5TWF0cml4KFRyYW5zZm9ybWF0aW9uLnNoZWFyWChreCkpXHJcbiAgICAgICAgLm11bHRpcGx5TWF0cml4KFRyYW5zZm9ybWF0aW9uLnNoZWFyWShreSkpXHJcbiAgICAgICAgLm11bHRpcGx5TWF0cml4KFRyYW5zZm9ybWF0aW9uLnRyYW5zbGF0aW9uKC1jZW50ZXIuZ2V0WCgpLCAtY2VudGVyLmdldFkoKSkpO1xyXG4gICAgfVxyXG5cclxufVxyXG5leHBvcnQgZGVmYXVsdCBUcmFuc2Zvcm1hdGlvbjsiLCJpbXBvcnQgUG9pbnQgZnJvbSBcIk1haW4vQmFzZS9wb2ludFwiXHJcblxyXG5mdW5jdGlvbiBvcmllbnRhdGlvbihwOiBQb2ludCwgcTogUG9pbnQsIHI6IFBvaW50KTogbnVtYmVyIHtcclxuICAgIGNvbnN0IHZhbCA9IChxLnkgLSBwLnkpICogKHIueCAtIHEueCkgLSAocS54IC0gcC54KSAqIChyLnkgLSBxLnkpO1xyXG5cclxuICAgIGlmICh2YWwgPT09IDApIHJldHVybiAwO1xyXG5cclxuICAgIHJldHVybiB2YWwgPiAwID8gMSA6IDI7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNvbnZleEh1bGwocG9pbnRzOiBQb2ludFtdKTogUG9pbnRbXSB7XHJcbiAgICBjb25zdCBuID0gcG9pbnRzLmxlbmd0aDtcclxuICAgIGlmIChuIDwgMykgcmV0dXJuIFtdO1xyXG5cclxuICAgIGNvbnN0IGh1bGw6IFBvaW50W10gPSBbXTtcclxuICAgIGxldCBsID0gMDtcclxuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgaWYgKHBvaW50c1tpXS54IDwgcG9pbnRzW2xdLngpIHtcclxuICAgICAgICAgICAgbCA9IGk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGxldCBwID0gbDtcclxuICAgIGxldCBxOiBudW1iZXI7XHJcbiAgICBkbyB7XHJcbiAgICAgICAgaHVsbC5wdXNoKHBvaW50c1twXSk7XHJcbiAgICAgICAgcSA9IChwICsgMSkgJSBuO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChvcmllbnRhdGlvbihwb2ludHNbcF0sIHBvaW50c1tpXSwgcG9pbnRzW3FdKSA9PT0gMikge1xyXG4gICAgICAgICAgICAgICAgcSA9IGk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcCA9IHE7XHJcbiAgICB9IHdoaWxlIChwICE9PSBsKTtcclxuXHJcbiAgICByZXR1cm4gaHVsbDtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY29udmV4SHVsbDtcclxuXHJcbiIsImZ1bmN0aW9uIGNvbXBvbmVudFRvSGV4KGM6IG51bWJlcikge1xyXG4gICAgdmFyIGhleCA9IGMudG9TdHJpbmcoMTYpO1xyXG4gICAgcmV0dXJuIGhleC5sZW5ndGggPT09IDEgPyBgMCR7aGV4fWAgOiBoZXg7XHJcbn1cclxuICBcclxuZnVuY3Rpb24gcmdiVG9IZXgocmdiYTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0pOiBzdHJpbmcge1xyXG4gICAgY29uc3QgW3IsIGcsIGJdID0gcmdiYTtcclxuICBcclxuICAgIHJldHVybiBgIyR7Y29tcG9uZW50VG9IZXgocil9JHtjb21wb25lbnRUb0hleChnKX0ke2NvbXBvbmVudFRvSGV4KGIpfWA7XHJcbn1cclxuICBcclxuZnVuY3Rpb24gaGV4VG9SZ2IoaGV4OiBzdHJpbmcpOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSB7XHJcbiAgICBjb25zdCByID0gcGFyc2VJbnQoaGV4LnNsaWNlKDEsIDMpLCAxNik7XHJcbiAgICBjb25zdCBnID0gcGFyc2VJbnQoaGV4LnNsaWNlKDMsIDUpLCAxNik7XHJcbiAgICBjb25zdCBiID0gcGFyc2VJbnQoaGV4LnNsaWNlKDUsIDcpLCAxNik7XHJcbiAgXHJcbiAgICByZXR1cm4gW3IgLyAyNTUsIGcgLyAyNTUsIGIgLyAyNTUsIDFdO1xyXG59XHJcbiAgXHJcbmV4cG9ydCB7IHJnYlRvSGV4LCBoZXhUb1JnYiB9O1xyXG4gICIsImltcG9ydCBSZW5kZXJhYmxlIGZyb20gXCIuLzJELVNoYXBlcy9JbnRlcmZhY2VzL3JlbmRlcmFibGUuaW50ZXJmYWNlXCI7XHJcbmltcG9ydCBUcmFuc2Zvcm1hYmxlIGZyb20gXCIuLzJELVNoYXBlcy9JbnRlcmZhY2VzL3RyYW5zZm9ybWFibGUuaW50ZXJmYWNlXCI7XHJcbmltcG9ydCBTaGFwZSBmcm9tIFwiLi8yRC1TaGFwZXMvc2hhcGVcIjtcclxuaW1wb3J0IExpbmUgZnJvbSBcIi4vMkQtU2hhcGVzL2xpbmVcIjtcclxuaW1wb3J0IFNxdWFyZSBmcm9tIFwiLi8yRC1TaGFwZXMvc3F1YXJlXCI7XHJcbmltcG9ydCBSZWN0YW5nbGUgZnJvbSBcIi4vMkQtU2hhcGVzL3JlY3RhbmdsZVwiO1xyXG5pbXBvcnQgUG9pbnQgZnJvbSBcIi4vQmFzZS9wb2ludFwiO1xyXG5pbXBvcnQgUG9seWdvbiBmcm9tIFwiLi8yRC1TaGFwZXMvcG9seWdvblwiO1xyXG5pbXBvcnQgVHlwZSBmcm9tIFwiLi8yRC1TaGFwZXMvdHlwZS5lbnVtXCI7XHJcbmltcG9ydCB7IGNyZWF0ZVNoYWRlclByb2dyYW0gfSBmcm9tIFwiLi9GdW5jdGlvbnMvY3JlYXRlLXNoYWRlci1wcm9ncmFtXCI7XHJcbmltcG9ydCBQcm9ncmFtSW5mbyBmcm9tIFwiLi9GdW5jdGlvbnMvcHJvZ3JhbS1pbmZvLmludGVyZmFjZVwiO1xyXG5pbXBvcnQgeyBzZXRBdHRyaWJ1dGVzIH0gZnJvbSBcIi4vRnVuY3Rpb25zL3NldC1hdHRyaWJ1dGVzXCI7XHJcbmltcG9ydCB7IHNldHVwQ2FudmFzIH0gZnJvbSBcIi4vRnVuY3Rpb25zL3NldHVwLWNhbnZhc1wiO1xyXG5pbXBvcnQgVHJhbnNmb3JtYXRpb24gZnJvbSBcIi4vT3BlcmF0aW9ucy9UcmFuc2Zvcm1hdGlvblwiO1xyXG5pbXBvcnQgeyBoZXhUb1JnYiwgcmdiVG9IZXggfSBmcm9tIFwiLi9VdGlscy90b29sc1wiO1xyXG5pbXBvcnQgeyByZW5kZXIgfSBmcm9tIFwiLi9GdW5jdGlvbnMvcmVuZGVyXCI7XHJcbmltcG9ydCB7IHJlbmRlckFsbCB9IGZyb20gXCIuL0Z1bmN0aW9ucy9yZW5kZXItYWxsXCI7XHJcblxyXG4vLyBjb25zdCBnbCA9IHNldHVwQ2FudmFzKClcclxuY29uc3QgY2FudmFzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjYW52YXNcIikgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XHJcbi8vIEluaXRpYWxpemUgdGhlIEdMIGNvbnRleHRcclxuY29uc3QgZ2wgPSBjYW52YXMuZ2V0Q29udGV4dChcIndlYmdsXCIpO1xyXG5cclxuLy8gT25seSBjb250aW51ZSBpZiBXZWJHTCBpcyBhdmFpbGFibGUgYW5kIHdvcmtpbmdcclxuaWYgKGdsID09PSBudWxsKSB7XHJcbiAgYWxlcnQoXHJcbiAgICBcIlVuYWJsZSB0byBpbml0aWFsaXplIFdlYkdMLiBZb3VyIGJyb3dzZXIgb3IgbWFjaGluZSBtYXkgbm90IHN1cHBvcnQgaXQuXCJcclxuICApO1xyXG59XHJcblxyXG4vLyBTZXQgY2xlYXIgY29sb3IgdG8gYmxhY2ssIGZ1bGx5IG9wYXF1ZVxyXG5nbC5jbGVhckNvbG9yKDEuMCwgMS4wLCAxLjAsIDEuMCk7XHJcbi8vIENsZWFyIHRoZSBjb2xvciBidWZmZXIgd2l0aCBzcGVjaWZpZWQgY2xlYXIgY29sb3JcclxuZ2wuY2xlYXIoZ2wuQ09MT1JfQlVGRkVSX0JJVCk7XHJcbi8vIGlmIChnbD09PW51bGwpIHtcclxuLy8gICAgIHJldHVybjtcclxuLy8gfVxyXG5cclxuLy8gVmVydGV4IHNoYWRlciBwcm9ncmFtXHJcbmNvbnN0IHZzU291cmNlID0gYFxyXG4gICAgYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1xyXG4gICAgYXR0cmlidXRlIHZlYzQgYVZlcnRleENvbG9yO1xyXG4gICAgdW5pZm9ybSBtYXQzIHVNYXRyaXg7XHJcbiAgICB2YXJ5aW5nIHZlYzQgdkNvbG9yO1xyXG5cclxuICAgIHZvaWQgbWFpbigpIHtcclxuICAgICAgICAvLyBub3RlOiBZIGF4aXMgbXVzdCBiZSBpbnZlcnRlZCB0byByZXBsaWNhdGUgdHJhZGl0aW9uYWwgdmlld1xyXG4gICAgICAgIGdsX1Bvc2l0aW9uID0gdmVjNCgodU1hdHJpeCAqIHZlYzMoYVZlcnRleFBvc2l0aW9uLCAxKSkueHksIDAsIDEpO1xyXG5cclxuICAgICAgICAvLyBDaGFuZ2UgY29sb3Igb2Ygc2hhcGVcclxuICAgICAgICB2Q29sb3IgPSBhVmVydGV4Q29sb3I7XHJcbiAgICB9XHJcbmA7XHJcblxyXG5jb25zdCBmc1NvdXJjZSA9IGBcclxuICAgIHByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xyXG4gICAgdmFyeWluZyB2ZWM0IHZDb2xvcjtcclxuXHJcbiAgICB2b2lkIG1haW4oKSB7XHJcbiAgICAgICAgZ2xfRnJhZ0NvbG9yID0gdkNvbG9yO1xyXG4gICAgfVxyXG5gO1xyXG5jb25zdCBzaGFkZXJQcm9ncmFtID0gY3JlYXRlU2hhZGVyUHJvZ3JhbShnbCwgdnNTb3VyY2UsIGZzU291cmNlKTtcclxuXHJcbi8vIENvbGxlY3QgYWxsIHRoZSBpbmZvIG5lZWRlZCB0byB1c2UgdGhlIHNoYWRlciBwcm9ncmFtLlxyXG4vLyBMb29rIHVwIHdoaWNoIGF0dHJpYnV0ZSBvdXIgc2hhZGVyIHByb2dyYW0gaXMgdXNpbmdcclxuLy8gZm9yIGFWZXJ0ZXhQb3NpdGlvbiBhbmQgbG9vayB1cCB1bmlmb3JtIGxvY2F0aW9ucy5cclxuY29uc3QgcHJvZ3JhbUluZm8gPSB7XHJcbiAgcHJvZ3JhbTogc2hhZGVyUHJvZ3JhbSxcclxuICBhdHRyaWJMb2NhdGlvbnM6IHtcclxuICAgIHZlcnRleFBvc2l0aW9uOiBnbC5nZXRBdHRyaWJMb2NhdGlvbihzaGFkZXJQcm9ncmFtLCBcImFWZXJ0ZXhQb3NpdGlvblwiKSxcclxuICAgIHZlcnRleENvbG9yOiBnbC5nZXRBdHRyaWJMb2NhdGlvbihzaGFkZXJQcm9ncmFtLCBcImFWZXJ0ZXhDb2xvclwiKSxcclxuICB9LFxyXG4gIHVuaWZvcm1Mb2NhdGlvbnM6IHtcclxuICAgIG1hdHJpeExvY2F0aW9uOiBnbC5nZXRVbmlmb3JtTG9jYXRpb24oc2hhZGVyUHJvZ3JhbSwgXCJ1TWF0cml4XCIpLFxyXG4gIH0sXHJcbn07XHJcblxyXG4vLyBDbGVhciB0aGUgY2FudmFzIGJlZm9yZSB3ZSBzdGFydCBkcmF3aW5nIG9uIGl0LlxyXG5nbC5jbGVhcihnbC5DT0xPUl9CVUZGRVJfQklUKTtcclxuLy8gVGVsbCBXZWJHTCB0byB1c2Ugb3VyIHByb2dyYW0gd2hlbiBkcmF3aW5nXHJcbmdsLnVzZVByb2dyYW0oc2hhZGVyUHJvZ3JhbSk7XHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2FudmFzXCIpIGFzIEhUTUxDYW52YXNFbGVtZW50O1xyXG5sZXQgc2hhcGVzOiAoU2hhcGUgJiBSZW5kZXJhYmxlICYgVHJhbnNmb3JtYWJsZSlbXSA9IFtdO1xyXG5sZXQgdHlwZTogVHlwZTtcclxubGV0IGlzRHJhd2luZyA9IGZhbHNlO1xyXG5cclxuLyogU2V0dXAgVmlld3BvcnQgKi9cclxuY29uc3Qgd2lkdGggPSAoZ2wuY2FudmFzIGFzIEhUTUxDYW52YXNFbGVtZW50KS5jbGllbnRXaWR0aDtcclxuY29uc3QgaGVpZ2h0ID0gKGdsLmNhbnZhcyBhcyBIVE1MQ2FudmFzRWxlbWVudCkuY2xpZW50SGVpZ2h0O1xyXG5nbC5jYW52YXMud2lkdGggPSA4MDA7XHJcbmdsLmNhbnZhcy5oZWlnaHQgPSA4MDA7XHJcblxyXG5jb25zdCB4ID0gMDsgLy8geCBjb29yZGluYXRlIG9mIHRoZSBsb3dlciBsZWZ0IGNvcm5lciBvZiB0aGUgdmlld3BvcnQgcmVjdGFuZ2xlXHJcbmNvbnN0IHkgPSAwOyAvLyB5IGNvb3JkaW5hdGUgb2YgdGhlIGxvd2VyIGxlZnQgY29ybmVyIG9mIHRoZSB2aWV3cG9ydCByZWN0YW5nbGVcclxuZ2wudmlld3BvcnQoeCwgeSwgZ2wuY2FudmFzLndpZHRoLCBnbC5jYW52YXMuaGVpZ2h0KTsgLy8gc2V0cyB0aGUgdmlld3BvcnQgdG8gY292ZXIgdGhlIGVudGlyZSBjYW52YXMsIHN0YXJ0aW5nIGZyb20gdGhlIGxvd2VyLWxlZnQgY29ybmVyIGFuZCBleHRlbmRpbmcgdG8gdGhlIGNhbnZhcydzIHdpZHRoIGFuZCBoZWlnaHQuXHJcblxyXG5jb25zdCBwb3NpdGlvbkJ1ZmZlciA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xyXG5jb25zdCBjb2xvckJ1ZmZlciA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xyXG5nbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgcG9zaXRpb25CdWZmZXIpO1xyXG5nbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgY29sb3JCdWZmZXIpO1xyXG5zZXRBdHRyaWJ1dGVzKGdsLCBwb3NpdGlvbkJ1ZmZlciwgY29sb3JCdWZmZXIsIHByb2dyYW1JbmZvKTtcclxuXHJcbmxldCBjdXJyZW50T2JqZWN0OiBTaGFwZSAmIFJlbmRlcmFibGUgJiBUcmFuc2Zvcm1hYmxlO1xyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gRml4IEhUTUwgRWxlbWVudHMgRXZlbnQgTGlzdGVuZXJzXHJcblxyXG4vKiBMaXN0IG9mIFNoYXBlcyBMaXN0ZW5lciAqL1xyXG5jb25zdCBsaXN0T2ZTaGFwZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRyb3Bkb3duXCIpIGFzIEhUTUxTZWxlY3RFbGVtZW50O1xyXG5saXN0T2ZTaGFwZXMuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoKSA9PiB7XHJcbiAgY29uc3QgaW5kZXg6IG51bWJlciA9ICtsaXN0T2ZTaGFwZXMuc2VsZWN0ZWRPcHRpb25zWzBdLnZhbHVlO1xyXG5cclxuICBzZXR1cFNlbGVjdG9yKGdsLCBwcm9ncmFtSW5mbywgc2hhcGVzW2luZGV4XSk7XHJcbn0pO1xyXG5cclxuLyogQnV0dG9uIExpc3RlbmVyICovXHJcbmNvbnN0IGxpbmVCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxpbmUtYnRuXCIpO1xyXG5saW5lQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgdHlwZSA9IFR5cGUuTGluZTtcclxuICBpc0RyYXdpbmcgPSBmYWxzZTtcclxufSk7XHJcblxyXG5jb25zdCBzcXVhcmVCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNxdWFyZS1idG5cIik7XHJcbnNxdWFyZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gIHR5cGUgPSBUeXBlLlNxdWFyZTtcclxuICBpc0RyYXdpbmcgPSBmYWxzZTtcclxufSk7XHJcblxyXG5jb25zdCByZWN0YW5nbGVCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlY3RhbmdsZS1idG5cIik7XHJcbnJlY3RhbmdsZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gIHR5cGUgPSBUeXBlLlJlY3RhbmdsZTtcclxuICBpc0RyYXdpbmcgPSBmYWxzZTtcclxufSk7XHJcblxyXG5jb25zdCBwb2x5Z29uQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwb2x5Z29uLWJ0blwiKTtcclxucG9seWdvbkJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gIHR5cGUgPSBUeXBlLlBvbHlnb247XHJcbiAgaXNEcmF3aW5nID0gZmFsc2U7XHJcbiAgLy8gaXNGaXJzdERyYXdpbmcgPSB0cnVlO1xyXG59KTtcclxuXHJcbmNvbnN0IHNhdmVCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNhdmUtYnRuXCIpO1xyXG5zYXZlQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgY29uc3QgdGV4dCA9IHN0b3JlU2hhcGVzKHNoYXBlcyk7XHJcbiAgaGFuZGxlRG93bmxvYWQodGV4dCk7XHJcbn0pO1xyXG5cclxuY29uc3QgdXBsb2FkQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1cGxvYWQtYnRuXCIpO1xyXG51cGxvYWRCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICBoYW5kbGVVcGxvYWQoKHRleHQpID0+IHtcclxuICAgIHNoYXBlcyA9IGxvYWRTaGFwZSh0ZXh0KTtcclxuXHJcbiAgICBmb3IgKGNvbnN0IHNoYXBlIG9mIHNoYXBlcykge1xyXG4gICAgICBzZXR1cE9wdGlvbih0cnVlLCBzaGFwZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyQWxsKGdsLCBwcm9ncmFtSW5mbywgc2hhcGVzLCBwb3NpdGlvbkJ1ZmZlciwgY29sb3JCdWZmZXIpO1xyXG4gIH0pO1xyXG59KTtcclxuXHJcbi8qIENhbnZhcyBMaXN0ZW5lciAqL1xyXG5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCAoZXZlbnQpID0+IHtcclxuICBjb25zdCB4ID0gZXZlbnQuY2xpZW50WDtcclxuICBjb25zdCB5ID0gZXZlbnQuY2xpZW50WTtcclxuICBjb25zdCBwb2ludCA9IG5ldyBQb2ludChbeCwgeV0pO1xyXG4gIGNvbnNvbGUubG9nKFwia29udG9sb2RvblwiKTtcclxuXHJcbiAgaWYgKGlzRHJhd2luZykge1xyXG4gICAgaWYgKGN1cnJlbnRPYmplY3QudHlwZSAhPT0gVHlwZS5Qb2x5Z29uKSB7XHJcbiAgICAgIHNoYXBlcy5wdXNoKGN1cnJlbnRPYmplY3QpO1xyXG4gICAgICBjdXJyZW50T2JqZWN0LmRyYXcocG9pbnQpO1xyXG4gICAgICBzZXR1cE9wdGlvbih0cnVlLCBjdXJyZW50T2JqZWN0KTtcclxuICAgICAgY29uc29sZS5sb2coXCJrb250b2xvZG9uMlwiKTtcclxuICAgICAgcmVuZGVyKGdsLCBwcm9ncmFtSW5mbywgY3VycmVudE9iamVjdCwgcG9zaXRpb25CdWZmZXIgLCBjb2xvckJ1ZmZlcik7XHJcbiAgICAgIGlzRHJhd2luZyA9IGZhbHNlO1xyXG4gICAgICBjdXJyZW50T2JqZWN0ID0gbnVsbDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGN1cnJlbnRPYmplY3QuZHJhdyhwb2ludCk7XHJcbiAgICAgIGlmIChjdXJyZW50T2JqZWN0LmlkID09IHNoYXBlcy5sZW5ndGgpIHtcclxuICAgICAgICAvLyBiZWx1bSBkaXB1c2gga2Ugc2hhcGVzXHJcbiAgICAgICAgaWYgKGN1cnJlbnRPYmplY3QuaXNEcmF3YWJsZSgpKSB7XHJcbiAgICAgICAgICBzaGFwZXMucHVzaChjdXJyZW50T2JqZWN0KTtcclxuICAgICAgICAgIHNldHVwT3B0aW9uKHRydWUsIGN1cnJlbnRPYmplY3QpO1xyXG4gICAgICAgICAgcmVuZGVyKGdsLCBwcm9ncmFtSW5mbywgY3VycmVudE9iamVjdCwgcG9zaXRpb25CdWZmZXIsIGNvbG9yQnVmZmVyKTtcclxuICAgICAgICAgIGlzRHJhd2luZyA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBzZXR1cE9wdGlvbih0cnVlLCBjdXJyZW50T2JqZWN0KTtcclxuICAgICAgICByZW5kZXIoZ2wsIHByb2dyYW1JbmZvLCBjdXJyZW50T2JqZWN0LCBwb3NpdGlvbkJ1ZmZlciwgY29sb3JCdWZmZXIpO1xyXG4gICAgICAgIGlzRHJhd2luZyA9IGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICBjYXNlIFR5cGUuTGluZTpcclxuICAgICAgICBjdXJyZW50T2JqZWN0ID0gbmV3IExpbmUoc2hhcGVzLmxlbmd0aCwgcG9pbnQpO1xyXG4gICAgICAgIGlzRHJhd2luZyA9IHRydWU7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgVHlwZS5TcXVhcmU6XHJcbiAgICAgICAgY3VycmVudE9iamVjdCA9IG5ldyBTcXVhcmUoc2hhcGVzLmxlbmd0aCwgcG9pbnQpO1xyXG4gICAgICAgIGlzRHJhd2luZyA9IHRydWU7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgVHlwZS5SZWN0YW5nbGU6XHJcbiAgICAgICAgY3VycmVudE9iamVjdCA9IG5ldyBSZWN0YW5nbGUoc2hhcGVzLmxlbmd0aCwgcG9pbnQpO1xyXG4gICAgICAgIGlzRHJhd2luZyA9IHRydWU7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgVHlwZS5Qb2x5Z29uOlxyXG4gICAgICAgIGN1cnJlbnRPYmplY3QgPSBuZXcgUG9seWdvbihzaGFwZXMubGVuZ3RoLCBwb2ludCk7XHJcbiAgICAgICAgaXNEcmF3aW5nID0gdHJ1ZTtcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgLy8gICAgIGNhc2UgVHlwZS5MaW5lOlxyXG4gIC8vICAgICAgIGlmICghaXNEcmF3aW5nKSB7XHJcbiAgLy8gICAgICAgICBjb25zdCBsaW5lID0gbmV3IExpbmUoc2hhcGVzLmxlbmd0aCwgcG9pbnQpO1xyXG4gIC8vICAgICAgICAgc2hhcGVzLnB1c2gobGluZSk7XHJcblxyXG4gIC8vICAgICAgICAgaXNEcmF3aW5nID0gdHJ1ZTtcclxuICAvLyAgICAgICB9IGVsc2Uge1xyXG4gIC8vICAgICAgICAgY29uc3QgbGluZSA9IHNoYXBlc1tzaGFwZXMubGVuZ3RoIC0gMV0gYXMgTGluZTtcclxuICAvLyAgICAgICAgIGxpbmUuZHJhdyhwb2ludCk7XHJcbiAgLy8gICAgICAgICByZW5kZXIoZ2wsIHByb2dyYW1JbmZvLCBsaW5lKTtcclxuICAvLyAgICAgICAgIHNldHVwT3B0aW9uKHRydWUsIGxpbmUpO1xyXG5cclxuICAvLyAgICAgICAgIGlzRHJhd2luZyA9IGZhbHNlO1xyXG4gIC8vICAgICAgIH1cclxuICAvLyAgICAgICBicmVhaztcclxuXHJcbiAgLy8gICAgIGNhc2UgVHlwZS5TcXVhcmU6XHJcbiAgLy8gICAgICAgaWYgKCFpc0RyYXdpbmcpIHtcclxuICAvLyAgICAgICAgIGNvbnN0IHNxdWFyZSA9IG5ldyBTcXVhcmUoc2hhcGVzLmxlbmd0aCwgcG9pbnQpO1xyXG4gIC8vICAgICAgICAgc2hhcGVzLnB1c2goc3F1YXJlKTtcclxuXHJcbiAgLy8gICAgICAgICBpc0RyYXdpbmcgPSB0cnVlO1xyXG4gIC8vICAgICAgIH0gZWxzZSB7XHJcbiAgLy8gICAgICAgICBjb25zdCBzcXVhcmUgPSBzaGFwZXNbc2hhcGVzLmxlbmd0aCAtIDFdIGFzIFNxdWFyZTtcclxuICAvLyAgICAgICAgIHNxdWFyZS5kcmF3KHBvaW50KTtcclxuICAvLyAgICAgICAgIHJlbmRlcihnbCwgcHJvZ3JhbUluZm8sIHNxdWFyZSk7XHJcbiAgLy8gICAgICAgICBzZXR1cE9wdGlvbih0cnVlLCBzcXVhcmUpO1xyXG5cclxuICAvLyAgICAgICAgIGlzRHJhd2luZyA9IGZhbHNlO1xyXG4gIC8vICAgICAgIH1cclxuICAvLyAgICAgICBicmVhaztcclxuXHJcbiAgLy8gICAgIGNhc2UgVHlwZS5SZWN0YW5nbGU6XHJcbiAgLy8gICAgICAgaWYgKCFpc0RyYXdpbmcpIHtcclxuICAvLyAgICAgICAgIGNvbnN0IHJlY3RhbmdsZSA9IG5ldyBSZWN0YW5nbGUoc2hhcGVzLmxlbmd0aCwgcG9pbnQpO1xyXG4gIC8vICAgICAgICAgc2hhcGVzLnB1c2gocmVjdGFuZ2xlKTtcclxuXHJcbiAgLy8gICAgICAgICBpc0RyYXdpbmcgPSB0cnVlO1xyXG4gIC8vICAgICAgIH0gZWxzZSB7XHJcbiAgLy8gICAgICAgICBjb25zdCByZWN0YW5nbGUgPXNoYXBlc1tzaGFwZXMubGVuZ3RoIC0gMV0gYXMgUmVjdGFuZ2xlO1xyXG5cclxuICAvLyAgICAgICAgIHJlY3RhbmdsZS5kcmF3KHBvaW50KTtcclxuICAvLyAgICAgICAgIHJlbmRlcihnbCwgcHJvZ3JhbUluZm8sIHJlY3RhbmdsZSk7XHJcbiAgLy8gICAgICAgICBzZXR1cE9wdGlvbih0cnVlLCByZWN0YW5nbGUpO1xyXG5cclxuICAvLyAgICAgICAgIGlzRHJhd2luZyA9IGZhbHNlO1xyXG4gIC8vICAgICAgIH1cclxuICAvLyAgICAgICBicmVhaztcclxuXHJcbiAgLy8gICAgIGNhc2UgVHlwZS5Qb2x5Z29uOlxyXG4gIC8vICAgICAgIGlmICghaXNEcmF3aW5nKSB7XHJcbiAgLy8gICAgICAgICBjb25zdCBwb2x5Z29uID0gbmV3IFBvbHlnb24oc2hhcGVzLmxlbmd0aCwgcG9pbnQpO1xyXG4gIC8vICAgICAgICAgc2hhcGVzLnB1c2gocG9seWdvbik7XHJcblxyXG4gIC8vICAgICAgICAgaXNEcmF3aW5nID0gdHJ1ZTtcclxuICAvLyAgICAgICB9IGVsc2Uge1xyXG4gIC8vICAgICAgICAgY29uc3QgcG9seWdvbiA9IHNoYXBlc1tzaGFwZXMubGVuZ3RoIC0gMV0gYXMgUG9seWdvbjtcclxuXHJcbiAgLy8gICAgICAgICBwb2x5Z29uLmRyYXcocG9pbnQpO1xyXG4gIC8vICAgICAgICAgcmVuZGVyKGdsLCBwcm9ncmFtSW5mbywgcG9seWdvbik7XHJcbiAgLy8gICAgICAgICBzZXR1cE9wdGlvbihpc0ZpcnN0RHJhd2luZywgcG9seWdvbik7XHJcblxyXG4gIC8vICAgICAgICAgaXNGaXJzdERyYXdpbmcgPSBmYWxzZTtcclxuICAvLyAgICAgICB9XHJcbiAgLy8gICAgICAgYnJlYWs7XHJcblxyXG4gIC8vICAgICBjYXNlIFR5cGUuUE9MWUdPTl9SRURSQVc6XHJcbiAgLy8gICAgICAgLy8gY29uc3QgcG9seWdvbiA9IG9iamVjdHNbcG9seWdvblJlZHJhd0luZGV4XSBhcyBQb2x5Z29uO1xyXG5cclxuICAvLyAgICAgICAvLyBwb2x5Z29uLnVwZGF0ZVBvaW50KHBvaW50KTtcclxuICAvLyAgICAgICAvLyBwb2x5Z29uLnJlbmRlcihnbCwgcHJvZ3JhbSwgcG9zaXRpb25CdWZmZXIsIGNvbG9yQnVmZmVyKTtcclxuXHJcbiAgLy8gICAgICAgLy8gYnJlYWs7XHJcbiAgLy8gICB9XHJcbn0pO1xyXG5cclxuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgKGV2ZW50KSA9PiB7XHJcbiAgY29uc3QgeCA9IGV2ZW50LmNsaWVudFg7XHJcbiAgY29uc3QgeSA9IGV2ZW50LmNsaWVudFk7XHJcbiAgY29uc3QgcG9pbnQgPSBuZXcgUG9pbnQoW3gsIHldKTtcclxuICBjb25zb2xlLmxvZyhcImFzd3d3d1wiKTtcclxuXHJcbiAgaWYgKGlzRHJhd2luZykge1xyXG4gICAgaWYgKGN1cnJlbnRPYmplY3QudHlwZSAhPT0gVHlwZS5Qb2x5Z29uKSB7XHJcbiAgICAgIGN1cnJlbnRPYmplY3QuZHJhdyhwb2ludCk7XHJcbiAgICAgIHJlbmRlckFsbChnbCwgcHJvZ3JhbUluZm8sIHNoYXBlcywgcG9zaXRpb25CdWZmZXIsIGNvbG9yQnVmZmVyKTtcclxuICAgICAgcmVuZGVyKGdsLCBwcm9ncmFtSW5mbywgY3VycmVudE9iamVjdCwgcG9zaXRpb25CdWZmZXIsIGNvbG9yQnVmZmVyKTtcclxuICAgIH1cclxuICB9XHJcbn0pO1xyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLyBJbml0aWFsaXplIER5bmFtaWMgSFRNTCBFbGVtZW50cyAmIFNldCBFdmVudCBMaXN0ZW5lcnNcclxuXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuZnVuY3Rpb24gc2V0dXBPcHRpb24oXHJcbiAgaXNGaXJzdERyYXdpbmc6IGJvb2xlYW4sXHJcbiAgZWxlbWVudDogUmVuZGVyYWJsZSAmIFRyYW5zZm9ybWFibGUgJiBTaGFwZVxyXG4pOiB2b2lkIHtcclxuICBjb25zdCBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xyXG4gIG9wdGlvbi52YWx1ZSA9IGVsZW1lbnQuaWQudG9TdHJpbmcoKTtcclxuICBvcHRpb24udGV4dCA9IGAke2VsZW1lbnQudHlwZS50b1N0cmluZygpfV8ke2VsZW1lbnQuaWR9YDtcclxuXHJcbiAgaWYgKGlzRmlyc3REcmF3aW5nKSB7XHJcbiAgICBjb25zdCBsaXN0T2ZTaGFwZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgXCJsaXN0LW9mLXNoYXBlc1wiXHJcbiAgICApIGFzIEhUTUxTZWxlY3RFbGVtZW50O1xyXG4gICAgbGlzdE9mU2hhcGVzLmFwcGVuZENoaWxkKG9wdGlvbik7XHJcbiAgICBsaXN0T2ZTaGFwZXMudmFsdWUgPSBlbGVtZW50LmlkLnRvU3RyaW5nKCk7XHJcbiAgfVxyXG5cclxuICBzZXR1cFNlbGVjdG9yKGdsLCBwcm9ncmFtSW5mbywgZWxlbWVudCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNldHVwU2VsZWN0b3IoXHJcbiAgZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCxcclxuICBwcm9ncmFtSW5mbzogUHJvZ3JhbUluZm8sXHJcbiAgZWxlbWVudDogUmVuZGVyYWJsZSAmIFRyYW5zZm9ybWFibGUgJiBTaGFwZVxyXG4pOiB2b2lkIHtcclxuICBjb25zdCBzbGlkZXJYID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzbGlkZXJYXCIpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgc2xpZGVyWC5taW4gPSBcIi02MDBcIjtcclxuICBzbGlkZXJYLm1heCA9IFwiNjAwXCI7XHJcbiAgc2xpZGVyWC52YWx1ZSA9IGVsZW1lbnQudHgudG9TdHJpbmcoKTtcclxuICBzbGlkZXJYLnN0ZXAgPSBcIjEwXCI7XHJcblxyXG4gIHNsaWRlclguYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIChldmVudCkgPT4ge1xyXG4gICAgY29uc3QgZGVsdGFYID0gKGV2ZW50LnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZTtcclxuICAgIGVsZW1lbnQudHggPSBOdW1iZXIoZGVsdGFYKTtcclxuICB9KTtcclxuXHJcbiAgY29uc3Qgc2xpZGVyWSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2xpZGVyWVwiKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gIHNsaWRlclkubWluID0gXCItNjAwXCI7XHJcbiAgc2xpZGVyWS5tYXggPSBcIjYwMFwiO1xyXG4gIHNsaWRlclkudmFsdWUgPSAoLWVsZW1lbnQudHkpLnRvU3RyaW5nKCk7XHJcbiAgc2xpZGVyWS5zdGVwID0gXCIxMFwiO1xyXG4gIHNsaWRlclguYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIChldmVudCkgPT4ge1xyXG4gICAgY29uc3QgZGVsdGFZID0gKGV2ZW50LnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZTtcclxuICAgIGVsZW1lbnQudHkgPSAtTnVtYmVyKGRlbHRhWSk7XHJcbiAgfSk7XHJcblxyXG4gIGNvbnN0IHNsaWRlckxlbmd0aCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgXCJzbGlkZXJMZW5ndGhcIlxyXG4gICkgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICBzbGlkZXJMZW5ndGgubWluID0gXCIwXCI7XHJcbiAgc2xpZGVyTGVuZ3RoLm1heCA9IFwiNjAwXCI7XHJcbiAgbGV0IGxlbmd0aDogbnVtYmVyO1xyXG4gIGlmIChlbGVtZW50LnR5cGUgPT09IFR5cGUuUG9seWdvbikge1xyXG4gICAgbGV0IG1pbiA9IEluZmluaXR5O1xyXG4gICAgbGV0IG1heCA9IC1JbmZpbml0eTtcclxuXHJcbiAgICBmb3IgKGNvbnN0IHAgb2YgZWxlbWVudC5hcnJheU9mUG9pbnRzKSB7XHJcbiAgICAgIGNvbnN0IFtwWF0gPSBwLmdldFBhaXIoKTtcclxuICAgICAgaWYgKHBYIDwgbWluKSB7XHJcbiAgICAgICAgbWluID0gcFg7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHBYID4gbWF4KSB7XHJcbiAgICAgICAgbWF4ID0gcFg7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGxlbmd0aCA9IG1heCAtIG1pbjtcclxuICB9IGVsc2Uge1xyXG4gICAgbGVuZ3RoID0gTWF0aC5zcXJ0KFxyXG4gICAgICAoZWxlbWVudC5hcnJheU9mUG9pbnRzWzBdLnggLSBlbGVtZW50LmFycmF5T2ZQb2ludHNbMV0ueCkgKiogMiArXHJcbiAgICAgICAgKGVsZW1lbnQuYXJyYXlPZlBvaW50c1swXS55IC0gZWxlbWVudC5hcnJheU9mUG9pbnRzWzFdLnkpICoqIDJcclxuICAgICk7XHJcbiAgfVxyXG4gIHNsaWRlckxlbmd0aC52YWx1ZSA9ICgoZWxlbWVudC5zeCAtIDEpICogbGVuZ3RoKS50b1N0cmluZygpO1xyXG4gIHNsaWRlckxlbmd0aC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgKGV2ZW50KSA9PiB7XHJcbiAgICBjb25zdCBkZWx0YUxlbmd0aCA9IChldmVudC50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWU7XHJcbiAgICBlbGVtZW50LnN4ID0gMSArIE51bWJlcihkZWx0YUxlbmd0aCkgLyBsZW5ndGg7XHJcbiAgfSk7XHJcblxyXG4gIGNvbnN0IHNsaWRlcldpZHRoID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICBcInNsaWRlcldpZHRoXCJcclxuICApIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgc2xpZGVyV2lkdGgubWluID0gXCIwXCI7XHJcbiAgc2xpZGVyV2lkdGgubWF4ID0gXCI2MDBcIjtcclxuICBsZXQgd2lkdGg6IG51bWJlcjtcclxuXHJcbiAgaWYgKGVsZW1lbnQudHlwZSA9PSBUeXBlLlJlY3RhbmdsZSkge1xyXG4gICAgd2lkdGggPSBNYXRoLnNxcnQoXHJcbiAgICAgIChlbGVtZW50LmFycmF5T2ZQb2ludHNbMF0ueCAtIGVsZW1lbnQuYXJyYXlPZlBvaW50c1szXS54KSAqKiAyICtcclxuICAgICAgICAoZWxlbWVudC5hcnJheU9mUG9pbnRzWzBdLnkgLSBlbGVtZW50LmFycmF5T2ZQb2ludHNbM10ueSkgKiogMlxyXG4gICAgKTtcclxuICB9IGVsc2UgaWYgKGVsZW1lbnQudHlwZSA9PSBUeXBlLlBvbHlnb24pIHtcclxuICAgIGxldCBtaW4gPSBJbmZpbml0eTtcclxuICAgIGxldCBtYXggPSAtSW5maW5pdHk7XHJcblxyXG4gICAgZm9yIChjb25zdCBwIG9mIGVsZW1lbnQuYXJyYXlPZlBvaW50cykge1xyXG4gICAgICBjb25zdCBbLCBwWV0gPSBwLmdldFBhaXIoKTtcclxuICAgICAgaWYgKHBZIDwgbWluKSB7XHJcbiAgICAgICAgbWluID0gcFk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHBZID4gbWF4KSB7XHJcbiAgICAgICAgbWF4ID0gcFk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGxlbmd0aCA9IG1heCAtIG1pbjtcclxuICB9IGVsc2Uge1xyXG4gICAgd2lkdGggPSAwO1xyXG4gIH1cclxuICBzbGlkZXJXaWR0aC52YWx1ZSA9ICgoZWxlbWVudC5zeSAtIDEpICogd2lkdGgpLnRvU3RyaW5nKCk7XHJcbiAgc2xpZGVyV2lkdGguYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIChldmVudCkgPT4ge1xyXG4gICAgY29uc3QgZGVsdGFXaWR0aCA9IChldmVudC50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWU7XHJcbiAgICBlbGVtZW50LnN5ID0gMSArIE51bWJlcihkZWx0YVdpZHRoKSAvIHdpZHRoO1xyXG4gIH0pO1xyXG5cclxuICBjb25zdCBzbGlkZXJSb3RhdGlvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgXCJzbGlkZXJSb3RhdGlvblwiXHJcbiAgKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gIHNsaWRlclJvdGF0aW9uLm1pbiA9IFwiMFwiO1xyXG4gIHNsaWRlclJvdGF0aW9uLm1heCA9IFwiMzYwXCI7XHJcbiAgc2xpZGVyUm90YXRpb24udmFsdWUgPSAoKDE4MCAqIGVsZW1lbnQuZGVncmVlKSAvIE1hdGguUEkpLnRvU3RyaW5nKCk7XHJcbiAgc2xpZGVyUm90YXRpb24uc3RlcCA9IFwiMTBcIjtcclxuICBzbGlkZXJSb3RhdGlvbi5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgKGV2ZW50KSA9PiB7XHJcbiAgICBjb25zdCBkZWx0YURlZ3JlZSA9IChldmVudC50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWU7XHJcbiAgICBlbGVtZW50LmRlZ3JlZSA9IChOdW1iZXIoZGVsdGFEZWdyZWUpIC8gMTgwKSAqIE1hdGguUEk7XHJcbiAgfSk7XHJcblxyXG4gIGNvbnN0IHNsaWRlclNoZWFyWCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgXCJzbGlkZXJTaGVhclhcIlxyXG4gICkgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICBzbGlkZXJTaGVhclgubWluID0gXCItNjAwXCI7XHJcbiAgc2xpZGVyU2hlYXJYLm1heCA9IFwiNjAwXCI7XHJcbiAgc2xpZGVyU2hlYXJYLnZhbHVlID0gZWxlbWVudC5reC50b1N0cmluZygpO1xyXG4gIHNsaWRlclNoZWFyWC5zdGVwID0gXCIxMFwiO1xyXG5cclxuICBzbGlkZXJTaGVhclguYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIChldmVudCkgPT4ge1xyXG4gICAgY29uc3QgZGVsdGFTaGVhclggPSAoZXZlbnQudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlO1xyXG4gICAgZWxlbWVudC5reCA9IE51bWJlcihkZWx0YVNoZWFyWCk7XHJcbiAgfSk7XHJcblxyXG4gIGNvbnN0IHNsaWRlclNoZWFyWSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgXCJzbGlkZXJTaGVhcllcIlxyXG4gICkgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICBzbGlkZXJTaGVhclkubWluID0gXCItNjAwXCI7XHJcbiAgc2xpZGVyU2hlYXJZLm1heCA9IFwiNjAwXCI7XHJcbiAgc2xpZGVyU2hlYXJZLnZhbHVlID0gZWxlbWVudC5reS50b1N0cmluZygpO1xyXG4gIHNsaWRlclNoZWFyWS5zdGVwID0gXCIxMFwiO1xyXG5cclxuICBzbGlkZXJTaGVhclguYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIChldmVudCkgPT4ge1xyXG4gICAgY29uc3QgZGVsdGFTaGVhclkgPSAoZXZlbnQudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlO1xyXG4gICAgZWxlbWVudC5reSA9IE51bWJlcihkZWx0YVNoZWFyWSk7XHJcbiAgfSk7XHJcblxyXG4gIGNvbnN0IHBvaW50UGlja2VyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICBcInBvaW50UGlja2VyXCJcclxuICApIGFzIEhUTUxTZWxlY3RFbGVtZW50O1xyXG4gIHBvaW50UGlja2VyLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKCkgPT4ge1xyXG4gICAgY29uc3QgcG9pbnRJbmRleDogbnVtYmVyID0gTnVtYmVyKHBvaW50UGlja2VyLnZhbHVlKTtcclxuICAgIHNldHVwQ29sb3JQaWNrZXIoZ2wsIHByb2dyYW1JbmZvLCBwb2ludEluZGV4LCBlbGVtZW50KTtcclxuICB9KTtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IGVsZW1lbnQuYXJyYXlPZlBvaW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgY29uc3QgbmV3UG9pbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xyXG4gICAgbmV3UG9pbnQudmFsdWUgPSBpLnRvU3RyaW5nKCk7XHJcbiAgICBuZXdQb2ludC50ZXh0ID0gXCJwb2ludF9cIiArIGk7XHJcbiAgICBwb2ludFBpY2tlci5hcHBlbmRDaGlsZChuZXdQb2ludCk7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBzZXR1cENvbG9yUGlja2VyKFxyXG4gIGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsXHJcbiAgcHJvZ3JhbUluZm86IFByb2dyYW1JbmZvLFxyXG4gIHBvaW50SW5kZXg6IG51bWJlcixcclxuICBlbGVtZW50OiBSZW5kZXJhYmxlICYgVHJhbnNmb3JtYWJsZSAmIFNoYXBlXHJcbikge1xyXG4gIGNvbnN0IGNvbG9yU2VsZWN0b3IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbG9yLXBpY2tlclwiKTtcclxuICBjb2xvclNlbGVjdG9yLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgY29sb3JTZWxlY3Rvci5yZXBsYWNlQ2hpbGRyZW4oKTtcclxuXHJcbiAgY29uc3QgY29sb3JUaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoMlwiKTtcclxuICBjb2xvclRpdGxlLnRleHRDb250ZW50ID0gXCJTZWxlY3QgY29sb3JcIjtcclxuXHJcbiAgY29uc3QgY29sb3JJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICBjb2xvcklucHV0LmlkID0gXCJjb2xvci1pbnB1dFwiO1xyXG4gIGNvbG9ySW5wdXQudHlwZSA9IFwiY29sb3JcIjtcclxuXHJcbiAgY29sb3JJbnB1dC52YWx1ZSA9IHJnYlRvSGV4KGVsZW1lbnQuYXJyYXlPZlBvaW50c1twb2ludEluZGV4XS5nZXRDb2xvcigpKTtcclxuICBjb2xvcklucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKGV2ZW50KSA9PiB7XHJcbiAgICBjb25zdCBoZXggPSAoZXZlbnQudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlO1xyXG5cclxuICAgIGVsZW1lbnQuYXJyYXlPZlBvaW50c1twb2ludEluZGV4XS5zZXRDb2xvcihoZXhUb1JnYihoZXgpKTtcclxuICB9KTtcclxuXHJcbiAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBQb2x5Z29uKSB7XHJcbiAgICBjb25zdCBkZWxldGVQb2ludEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XHJcbiAgICBkZWxldGVQb2ludEJ1dHRvbi50ZXh0Q29udGVudCA9IFwiZGVsZXRlIHBvaW50XCI7XHJcbiAgICBkZWxldGVQb2ludEJ1dHRvbi5jbGFzc05hbWUgPSBcImJ0blwiO1xyXG4gICAgZGVsZXRlUG9pbnRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICAgICAgZWxlbWVudC5kZWxldGVQb2ludChwb2ludEluZGV4KTtcclxuICAgICAgcmVuZGVyQWxsKGdsLCBwcm9ncmFtSW5mbywgc2hhcGVzLCBwb3NpdGlvbkJ1ZmZlciwgY29sb3JCdWZmZXIpO1xyXG4gICAgfSk7XHJcbiAgICBjb2xvclNlbGVjdG9yLmFwcGVuZChjb2xvclRpdGxlLCBjb2xvcklucHV0LCBkZWxldGVQb2ludEJ1dHRvbik7XHJcbiAgfVxyXG59XHJcblxyXG4vLyBsb2Fkc2hhcGUgZnJvbSBqc29uIHRvIGFycmF5IG9mIHNoYXBlXHJcbmZ1bmN0aW9uIGxvYWRTaGFwZSh0ZXh0OiBzdHJpbmcpOiAoU2hhcGUgJiBSZW5kZXJhYmxlICYgVHJhbnNmb3JtYWJsZSlbXSB7XHJcbiAgY29uc3Qgc2hhcGU6IChTaGFwZSAmIFJlbmRlcmFibGUgJiBUcmFuc2Zvcm1hYmxlKVtdID0gW107XHJcbiAgY29uc3QgZGF0YSA9IEpTT04ucGFyc2UodGV4dCk7XHJcbiAgZm9yIChjb25zdCBpdGVtIG9mIGRhdGEpIHtcclxuICAgIGNvbnN0IHR4ID0gaXRlbS50eDtcclxuICAgIGNvbnN0IHR5ID0gaXRlbS50eTtcclxuICAgIGNvbnN0IGRlZ3JlZSA9IGl0ZW0uZGVncmVlO1xyXG4gICAgY29uc3Qgc3ggPSBpdGVtLnN4O1xyXG4gICAgY29uc3Qgc3kgPSBpdGVtLnN5O1xyXG4gICAgY29uc3Qga3ggPSBpdGVtLmt4O1xyXG4gICAgY29uc3Qga3kgPSBpdGVtLmt5O1xyXG4gICAgbGV0IGFycmF5T2ZQb2ludHM6IFBvaW50W10gPSBbXTtcclxuICAgIGZvciAoY29uc3QgcG9pbnQgb2YgaXRlbS5hcnJheU9mUG9pbnRzKSB7XHJcbiAgICAgIGxldCBwID0gbmV3IFBvaW50KFxyXG4gICAgICAgIFtwb2ludC54LCBwb2ludC55XSxcclxuICAgICAgICBbcG9pbnQuciwgcG9pbnQuZywgcG9pbnQuYiwgcG9pbnQuYV1cclxuICAgICAgKTtcclxuICAgICAgYXJyYXlPZlBvaW50cy5wdXNoKHApO1xyXG4gICAgfVxyXG4gICAgc3dpdGNoIChpdGVtLnR5cGUpIHtcclxuICAgICAgY2FzZSBUeXBlLkxpbmU6XHJcbiAgICAgICAgY29uc3QgbGluZSA9IG5ldyBMaW5lKGl0ZW0uaWQsIGFycmF5T2ZQb2ludHNbMF0pO1xyXG4gICAgICAgIGxpbmUuc2V0TGluZUF0dHJpYnV0ZXMoXHJcbiAgICAgICAgICB0eCxcclxuICAgICAgICAgIHR5LFxyXG4gICAgICAgICAgZGVncmVlLFxyXG4gICAgICAgICAgc3gsXHJcbiAgICAgICAgICBzeSxcclxuICAgICAgICAgIGt4LFxyXG4gICAgICAgICAga3ksXHJcbiAgICAgICAgICBhcnJheU9mUG9pbnRzWzFdXHJcbiAgICAgICAgKTtcclxuICAgICAgICBzaGFwZS5wdXNoKGxpbmUpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFR5cGUuU3F1YXJlOlxyXG4gICAgICAgIGNvbnN0IHNxdWFyZSA9IG5ldyBTcXVhcmUoaXRlbS5pZCwgaXRlbS5jZW50ZXIpO1xyXG4gICAgICAgIHNxdWFyZS5zZXRTcXVhcmVBdHRyaWJ1dGVzKFxyXG4gICAgICAgICAgdHgsXHJcbiAgICAgICAgICB0eSxcclxuICAgICAgICAgIGRlZ3JlZSxcclxuICAgICAgICAgIHN4LFxyXG4gICAgICAgICAgc3ksXHJcbiAgICAgICAgICBreCxcclxuICAgICAgICAgIGt5LFxyXG4gICAgICAgICAgYXJyYXlPZlBvaW50c1xyXG4gICAgICAgICk7XHJcbiAgICAgICAgc2hhcGUucHVzaChzcXVhcmUpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFR5cGUuUmVjdGFuZ2xlOlxyXG4gICAgICAgIGNvbnN0IHJlY3RhbmdsZSA9IG5ldyBSZWN0YW5nbGUoaXRlbS5pZCwgYXJyYXlPZlBvaW50c1swXSk7XHJcbiAgICAgICAgcmVjdGFuZ2xlLnNldFJlY3RhbmdsZUF0dHJpYnV0ZXMoXHJcbiAgICAgICAgICB0eCxcclxuICAgICAgICAgIHR5LFxyXG4gICAgICAgICAgZGVncmVlLFxyXG4gICAgICAgICAgc3gsXHJcbiAgICAgICAgICBzeSxcclxuICAgICAgICAgIGt4LFxyXG4gICAgICAgICAga3ksXHJcbiAgICAgICAgICBhcnJheU9mUG9pbnRzXHJcbiAgICAgICAgKTtcclxuICAgICAgICBzaGFwZS5wdXNoKHJlY3RhbmdsZSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgVHlwZS5Qb2x5Z29uOlxyXG4gICAgICAgIGNvbnN0IHBvbHlnb24gPSBuZXcgUG9seWdvbihpdGVtLmlkLCBhcnJheU9mUG9pbnRzWzBdKTtcclxuICAgICAgICBwb2x5Z29uLnNldFBvbHlnb25BdHRyaWJ1dGVzKFxyXG4gICAgICAgICAgdHgsXHJcbiAgICAgICAgICB0eSxcclxuICAgICAgICAgIGRlZ3JlZSxcclxuICAgICAgICAgIHN4LFxyXG4gICAgICAgICAgc3ksXHJcbiAgICAgICAgICBreCxcclxuICAgICAgICAgIGt5LFxyXG4gICAgICAgICAgYXJyYXlPZlBvaW50c1xyXG4gICAgICAgICk7XHJcbiAgICAgICAgc2hhcGUucHVzaChwb2x5Z29uKTtcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIHNoYXBlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzdG9yZVNoYXBlcyhzaGFwZTogU2hhcGVbXSk6IHN0cmluZyB7XHJcbiAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHNoYXBlKTtcclxufVxyXG5cclxuZnVuY3Rpb24gaGFuZGxlRG93bmxvYWQodGV4dDogc3RyaW5nKTogdm9pZCB7XHJcbiAgY29uc3QgZGF0YSA9IG5ldyBGaWxlKFt0ZXh0XSwgXCJzaGFwZXMuanNvblwiLCB7IHR5cGU6IFwiYXBwbGljYXRpb24vanNvblwiIH0pO1xyXG5cclxuICBjb25zdCB1cmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGRhdGEpO1xyXG5cclxuICBjb25zdCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XHJcbiAgYS5ocmVmID0gdXJsO1xyXG4gIGEuZG93bmxvYWQgPSBkYXRhLm5hbWU7XHJcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChhKTtcclxuICBhLmNsaWNrKCk7XHJcbiAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChhKTtcclxuICBVUkwucmV2b2tlT2JqZWN0VVJMKHVybCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhhbmRsZVVwbG9hZChjYWxsYmFjazogKHRleHQ6IHN0cmluZykgPT4gdm9pZCk6IHZvaWQge1xyXG4gIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gIGlucHV0LnR5cGUgPSBcImZpbGVcIjtcclxuICBpbnB1dC5hY2NlcHQgPSBcImFwcGxpY2F0aW9uL2pzb25cIjtcclxuXHJcbiAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoKSA9PiB7XHJcbiAgICBjb25zdCBmaWxlID0gaW5wdXQuZmlsZXNbMF07XHJcbiAgICBjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG5cclxuICAgIHJlYWRlci5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgIGNhbGxiYWNrKHJlYWRlci5yZXN1bHQgYXMgc3RyaW5nKTtcclxuICAgIH07XHJcbiAgICByZWFkZXIucmVhZEFzVGV4dChmaWxlKTtcclxuICB9KTtcclxuXHJcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChpbnB1dCk7XHJcbiAgaW5wdXQuY2xpY2soKTtcclxuICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGlucHV0KTtcclxufVxyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=