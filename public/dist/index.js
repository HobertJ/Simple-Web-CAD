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
const shape_1 = __importDefault(__webpack_require__(/*! Shapes/shape */ "./src/2D-Shapes/shape.ts"));
const type_enum_1 = __importDefault(__webpack_require__(/*! Shapes/type.enum */ "./src/2D-Shapes/type.enum.ts"));
const point_1 = __importDefault(__webpack_require__(/*! Base/point */ "./src/Base/point.ts"));
const Transformation_1 = __importDefault(__webpack_require__(/*! Operations/Transformation */ "./src/Operations/Transformation.ts"));
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
        return 2;
    }
    addPosition(gl) {
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([...this.arrayOfPoints[0].getPair(), ...this.arrayOfPoints[1].getPair()]), gl.STATIC_DRAW);
    }
    addColor(gl) {
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([...this.arrayOfPoints[0].getColor(), ...this.arrayOfPoints[1].getColor()]), gl.STATIC_DRAW);
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
const Transformation_1 = __importDefault(__webpack_require__(/*! Operations/Transformation */ "./src/Operations/Transformation.ts"));
const shape_1 = __importDefault(__webpack_require__(/*! Shapes/shape */ "./src/2D-Shapes/shape.ts"));
const type_enum_1 = __importDefault(__webpack_require__(/*! Shapes/type.enum */ "./src/2D-Shapes/type.enum.ts"));
const point_1 = __importDefault(__webpack_require__(/*! Base/point */ "./src/Base/point.ts"));
const convex_hull_1 = __importDefault(__webpack_require__(/*! Operations/convex-hull */ "./src/Operations/convex-hull.ts"));
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
        return this.arrayOfPoints.length >= 2;
    }
    draw(point) {
        if (this.arrayOfPoints.length >= 3) {
            this.arrayOfPoints = (0, convex_hull_1.default)([...this.arrayOfPoints, point]);
        }
        else {
            this.arrayOfPoints[this.arrayOfPoints.length] = point;
        }
        this.center = this.getCenter();
    }
    drawMethod(gl) {
        return this.arrayOfPoints.length >= 3 ? gl.TRIANGLE_FAN : gl.LINES;
    }
    getNumberOfVerticesToBeDrawn() {
        return this.arrayOfPoints.length;
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
        this.numberOfVertices = arrayOfPoints.length;
        this.center = this.getCenter();
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
const Transformation_1 = __importDefault(__webpack_require__(/*! Operations/Transformation */ "./src/Operations/Transformation.ts"));
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
        // return this.arrayOfPoints.filter(point => point !== null).length === 4;
        return this.arrayOfPoints[2] !== null;
    }
    draw(point) {
        this.arrayOfPoints[1] = new point_1.default([this.arrayOfPoints[0].x, point.y]);
        this.arrayOfPoints[2] = point;
        this.arrayOfPoints[3] = new point_1.default([point.x, this.arrayOfPoints[0].y]);
        this.center = this.getCenter();
    }
    getNumberOfVerticesToBeDrawn() {
        return 5;
    }
    addPosition(gl) {
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            ...this.arrayOfPoints[0].getPair(),
            ...this.arrayOfPoints[1].getPair(),
            ...this.arrayOfPoints[2].getPair(),
            ...this.arrayOfPoints[3].getPair(),
            ...this.arrayOfPoints[0].getPair(),
        ]), gl.STATIC_DRAW);
    }
    addColor(gl) {
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            ...this.arrayOfPoints[0].getColor(),
            ...this.arrayOfPoints[1].getColor(),
            ...this.arrayOfPoints[2].getColor(),
            ...this.arrayOfPoints[3].getColor(),
            ...this.arrayOfPoints[0].getColor(),
        ]), gl.STATIC_DRAW);
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
const shape_1 = __importDefault(__webpack_require__(/*! Shapes/shape */ "./src/2D-Shapes/shape.ts"));
const Transformation_1 = __importDefault(__webpack_require__(/*! Operations/Transformation */ "./src/Operations/Transformation.ts"));
const type_enum_1 = __importDefault(__webpack_require__(/*! Shapes/type.enum */ "./src/2D-Shapes/type.enum.ts"));
class Square extends shape_1.default {
    constructor(id, centerPoint) {
        super(id, 4, type_enum_1.default.Square);
        this.center = centerPoint;
        this.arrayOfPoints = [null, null, null, null];
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
        const [xCenter, yCenter] = this.center.getPair();
        // for (let i = 1; i <= 3; i++) {
        //     const angle = (i * Math.PI) / 2;
        //     const rotatedPoint = Transformation.translation(this.center.getX(), this.center.getY())
        //         .multiplyMatrix(Transformation.rotation(angle))
        //         .multiplyMatrix(Transformation.translation(-this.center.getX(), -this.center.getY()))
        //         .multiplyPoint(p1);
        //     this.arrayOfPoints[i] = rotatedPoint;
        // }
        this.arrayOfPoints[1] = Transformation_1.default.translation(xCenter, yCenter)
            .multiplyMatrix(Transformation_1.default.rotation(0.5 * Math.PI))
            .multiplyMatrix(Transformation_1.default.translation(-xCenter, -yCenter))
            .multiplyPoint(this.arrayOfPoints[0]);
        this.arrayOfPoints[2] = Transformation_1.default.translation(xCenter, yCenter)
            .multiplyMatrix(Transformation_1.default.rotation(Math.PI))
            .multiplyMatrix(Transformation_1.default.translation(-xCenter, -yCenter))
            .multiplyPoint(this.arrayOfPoints[0]);
        this.arrayOfPoints[3] = Transformation_1.default.translation(xCenter, yCenter)
            .multiplyMatrix(Transformation_1.default.rotation(1.5 * Math.PI))
            .multiplyMatrix(Transformation_1.default.translation(-xCenter, -yCenter))
            .multiplyPoint(this.arrayOfPoints[0]);
    }
    getNumberOfVerticesToBeDrawn() {
        return 5;
    }
    addPosition(gl) {
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            ...this.arrayOfPoints[0].getPair(),
            ...this.arrayOfPoints[1].getPair(),
            ...this.arrayOfPoints[2].getPair(),
            ...this.arrayOfPoints[3].getPair(),
            ...this.arrayOfPoints[0].getPair(),
        ]), gl.STATIC_DRAW);
    }
    addColor(gl) {
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            ...this.arrayOfPoints[0].getColor(),
            ...this.arrayOfPoints[1].getColor(),
            ...this.arrayOfPoints[2].getColor(),
            ...this.arrayOfPoints[3].getColor(),
            ...this.arrayOfPoints[0].getColor(),
        ]), gl.STATIC_DRAW);
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
        const [a11, a21, a31] = otherMatrix.m1;
        const [a12, a22, a32] = otherMatrix.m2;
        const [a13, a23, a33] = otherMatrix.m3;
        const [b11, b12, b13] = this.m1;
        const [b21, b22, b23] = this.m2;
        const [b31, b32, b33] = this.m3;
        const c11 = b11 * a11 + b21 * a21 + b31 * a31;
        const c12 = b11 * a12 + b21 * a22 + b31 * a32;
        const c13 = b11 * a13 + b21 * a23 + b31 * a33;
        const c21 = b12 * a11 + b22 * a21 + b32 * a31;
        const c22 = b12 * a12 + b22 * a22 + b32 * a32;
        const c23 = b12 * a13 + b22 * a23 + b32 * a33;
        const c31 = b13 * a11 + b23 * a21 + b33 * a31;
        const c32 = b13 * a12 + b23 * a22 + b33 * a32;
        const c33 = b13 * a13 + b23 * a23 + b33 * a33;
        const matrix = new Matrix([c11, c21, c31], [c12, c22, c32], [c13, c23, c33]);
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
const coordinate_1 = __importDefault(__webpack_require__(/*! Base/coordinate */ "./src/Base/coordinate.ts"));
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
const load_shader_1 = __webpack_require__(/*! Functions/load-shader */ "./src/Functions/load-shader.ts");
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
const render_1 = __webpack_require__(/*! Functions/render */ "./src/Functions/render.ts");
function renderAll(gl, programInfo, shapes, positionBuffer, colorBuffer) {
    gl.clear(gl.COLOR_BUFFER_BIT);
    for (const shape of shapes) {
        (0, render_1.render)(gl, programInfo, shape, positionBuffer, colorBuffer);
    }
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
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    object.addPosition(gl);
    const numComponents = 2; // pull out 2 values per iteration
    const type = gl.FLOAT; // the data in the buffer is 32bit floats
    const normalize = false; // don't normalize
    const stride = 0; // how many bytes to get from one set of values to the next
    // 0 = use type and numComponents above
    const offset = 0; // how many bytes inside the buffer to start from
    gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, numComponents, type, normalize, stride, offset);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    object.addColor(gl);
    const colorSize = 4; /* 4 components per iteration */
    const colorType = gl.FLOAT; /* The data is 32 bit float */
    const colorNormalized = false; /* Don't normalize the data */
    const colorStride = 0; /* 0: Move forward size * sizeof(type) each iteration to get the next position */
    const colorOffset = 0; /* Start at the beginning of the buffer */
    gl.vertexAttribPointer(programInfo.attribLocations.vertexColor, colorSize, colorType, colorNormalized, colorStride, colorOffset);
    // Add Matrix to gl
    const matrixLocation = programInfo.uniformLocations.matrixLocation;
    object.addMatrix(gl, matrixLocation);
    /* Draw scene */
    const primitiveType = object.drawMethod(gl);
    // const offset = 0;
    const numberOfVerticesToBeDrawn = object.getNumberOfVerticesToBeDrawn();
    gl.drawArrays(primitiveType, offset, numberOfVerticesToBeDrawn);
}
exports.render = render;


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
const matrix_1 = __importDefault(__webpack_require__(/*! Base/matrix */ "./src/Base/matrix.ts"));
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
    static shearY(ky) {
        const matrix = new matrix_1.default([1, ky, 0], [0, 1, 0], [0, 0, 1]);
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
    static inverseTransformationMatrix(width, height, tx, ty, degree, sx, sy, kx, ky, center) {
        return Transformation.translation(center.getX(), center.getY())
            .multiplyMatrix(Transformation.shearY(-ky))
            .multiplyMatrix(Transformation.shearX(-kx))
            .multiplyMatrix(Transformation.scale(1 / sx, 1 / sy))
            .multiplyMatrix(Transformation.rotation(-degree))
            .multiplyMatrix(Transformation.translation(-center.getX(), -center.getY()))
            .multiplyMatrix(Transformation.translation(-tx, -ty));
        // .multiplyMatrix(Transformation.projection(1 / width, 1 / height));
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
function rgbToHex(rgba) {
    const hexR = (rgba[0] * 255).toString(16).padStart(2, '0');
    const hexG = (rgba[1] * 255).toString(16).padStart(2, '0');
    const hexB = (rgba[2] * 255).toString(16).padStart(2, '0');
    // Concatenate the hexadecimal components
    const hexColor = `#${hexR}${hexG}${hexB}`;
    return hexColor;
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
const line_1 = __importDefault(__webpack_require__(/*! Shapes/line */ "./src/2D-Shapes/line.ts"));
const square_1 = __importDefault(__webpack_require__(/*! Shapes/square */ "./src/2D-Shapes/square.ts"));
const rectangle_1 = __importDefault(__webpack_require__(/*! Shapes/rectangle */ "./src/2D-Shapes/rectangle.ts"));
const point_1 = __importDefault(__webpack_require__(/*! Base/point */ "./src/Base/point.ts"));
const polygon_1 = __importDefault(__webpack_require__(/*! Shapes/polygon */ "./src/2D-Shapes/polygon.ts"));
const type_enum_1 = __importDefault(__webpack_require__(/*! Shapes/type.enum */ "./src/2D-Shapes/type.enum.ts"));
const create_shader_program_1 = __webpack_require__(/*! Functions/create-shader-program */ "./src/Functions/create-shader-program.ts");
const Transformation_1 = __importDefault(__webpack_require__(/*! Operations/Transformation */ "./src/Operations/Transformation.ts"));
const tools_1 = __webpack_require__(/*! Utils/tools */ "./src/Utils/tools.ts");
const render_1 = __webpack_require__(/*! Functions/render */ "./src/Functions/render.ts");
const render_all_1 = __webpack_require__(/*! Functions/render-all */ "./src/Functions/render-all.ts");
const canvas = document.querySelector("#canvas");
// Initialize the GL context
const gl = canvas.getContext("webgl");
// Only continue if WebGL is available and working
if (gl === null) {
    alert("Unable to initialize WebGL. Your browser or machine may not support it.");
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
// Tell WebGL to use our program when drawing
gl.useProgram(shaderProgram);
const width = gl.canvas.clientWidth;
const height = gl.canvas.clientHeight;
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
let shapes = [];
let type;
let isDrawing = false;
/* Setup Viewport */
const positionBuffer = gl.createBuffer();
const colorBuffer = gl.createBuffer();
// gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
// gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
// setAttributes(gl, positionBuffer, colorBuffer, programInfo);
let currentObject;
// =========================================================
// Fix HTML Elements Event Listeners
/* List of Shapes Listener */
const listOfShapes = document.getElementById("list-of-shapes");
listOfShapes.addEventListener("change", () => {
    (0, render_all_1.renderAll)(gl, programInfo, shapes, positionBuffer, colorBuffer);
    const index = +listOfShapes.selectedOptions[0].value;
    isDrawing = false;
    setupSelector(gl, programInfo, shapes[index]);
});
/* Button Listener */
const lineBtn = document.getElementById("line-btn");
lineBtn.addEventListener("click", () => {
    (0, render_all_1.renderAll)(gl, programInfo, shapes, positionBuffer, colorBuffer);
    type = type_enum_1.default.Line;
    isDrawing = false;
});
const squareBtn = document.getElementById("square-btn");
squareBtn.addEventListener("click", () => {
    (0, render_all_1.renderAll)(gl, programInfo, shapes, positionBuffer, colorBuffer);
    type = type_enum_1.default.Square;
    isDrawing = false;
});
const rectangleBtn = document.getElementById("rectangle-btn");
rectangleBtn.addEventListener("click", () => {
    (0, render_all_1.renderAll)(gl, programInfo, shapes, positionBuffer, colorBuffer);
    type = type_enum_1.default.Rectangle;
    isDrawing = false;
});
const polygonBtn = document.getElementById("polygon-btn");
polygonBtn.addEventListener("click", () => {
    (0, render_all_1.renderAll)(gl, programInfo, shapes, positionBuffer, colorBuffer);
    type = type_enum_1.default.Polygon;
    isDrawing = false;
    // isFirstDrawing = true;
});
const saveBtn = document.getElementById("save-btn");
saveBtn.addEventListener("click", () => {
    (0, render_all_1.renderAll)(gl, programInfo, shapes, positionBuffer, colorBuffer);
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
    if (isDrawing) {
        if (currentObject.type !== type_enum_1.default.Polygon) {
            currentObject.draw(point);
            setupOption(true, currentObject);
            shapes.push(currentObject);
            isDrawing = false;
            currentObject = null;
        }
        else {
            if (currentObject.id == shapes.length) {
                currentObject.draw(point);
                // belum dipush ke shapes
                if (currentObject.arrayOfPoints.length >= 3) {
                    setupOption(true, currentObject);
                    // render(gl, programInfo, currentObject, positionBuffer, colorBuffer);
                    shapes.push(currentObject);
                    (0, render_all_1.renderAll)(gl, programInfo, shapes, positionBuffer, colorBuffer);
                    isDrawing = false;
                    currentObject = null;
                }
                else {
                    (0, render_all_1.renderAll)(gl, programInfo, shapes, positionBuffer, colorBuffer);
                    (0, render_1.render)(gl, programInfo, currentObject, positionBuffer, colorBuffer);
                }
            }
            else {
                const matrix = Transformation_1.default.inverseTransformationMatrix(gl.canvas.width, gl.canvas.height, currentObject.tx, currentObject.ty, currentObject.degree, currentObject.sx, currentObject.sy, currentObject.kx, currentObject.ky, currentObject.center);
                const point2 = matrix.multiplyPoint(point);
                currentObject.draw(point2);
                setupOption(false, currentObject);
                // render(gl, programInfo, currentObject, positionBuffer, colorBuffer);
                (0, render_all_1.renderAll)(gl, programInfo, shapes, positionBuffer, colorBuffer);
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
});
canvas.addEventListener("mousemove", (event) => {
    if (isDrawing && currentObject.type !== type_enum_1.default.Polygon) {
        const x = event.clientX;
        const y = event.clientY;
        const point = new point_1.default([x, y]);
        currentObject.draw(point);
        (0, render_all_1.renderAll)(gl, programInfo, shapes, positionBuffer, colorBuffer);
        (0, render_1.render)(gl, programInfo, currentObject, positionBuffer, colorBuffer);
    }
});
function setupOption(isFirstDrawing, element) {
    const option = document.createElement("option");
    option.value = element.id.toString();
    let optionText;
    switch (element.type) {
        case type_enum_1.default.Line:
            optionText = `Line_${element.id}`;
            break;
        case type_enum_1.default.Square:
            optionText = `Square_${element.id}`;
            break;
        case type_enum_1.default.Rectangle:
            optionText = `Rectangle_${element.id}`;
            break;
        case type_enum_1.default.Polygon:
            optionText = `Polygon_${element.id}`;
            break;
    }
    option.text = optionText;
    if (isFirstDrawing) {
        const listOfShapes = document.getElementById("list-of-shapes");
        listOfShapes.appendChild(option);
        listOfShapes.value = element.id.toString();
    }
    setupSelector(gl, programInfo, element);
}
function setupSelector(gl, programInfo, element) {
    const sliderX_original = document.getElementById("sliderX");
    const sliderX = sliderX_original.cloneNode(true);
    sliderX_original.parentNode.replaceChild(sliderX, sliderX_original);
    sliderX.min = "-600";
    sliderX.max = "600";
    sliderX.value = element.tx.toString();
    sliderX.step = "10";
    sliderX.addEventListener("input", (event) => {
        const deltaX = event.target.value;
        element.tx = Number(deltaX);
        (0, render_all_1.renderAll)(gl, programInfo, shapes, positionBuffer, colorBuffer);
    });
    const sliderY_original = document.getElementById("sliderY");
    const sliderY = sliderY_original.cloneNode(true);
    sliderY_original.parentNode.replaceChild(sliderY, sliderY_original);
    sliderY.min = "-600";
    sliderY.max = "600";
    sliderY.value = (-element.ty).toString();
    sliderY.step = "10";
    sliderY.addEventListener("input", (event) => {
        const deltaY = event.target.value;
        element.ty = -Number(deltaY);
        (0, render_all_1.renderAll)(gl, programInfo, shapes, positionBuffer, colorBuffer);
    });
    const sliderLength_original = document.getElementById("sliderLength");
    const sliderLength = sliderLength_original.cloneNode(true);
    sliderLength_original.parentNode.replaceChild(sliderLength, sliderLength_original);
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
        if (element.type == type_enum_1.default.Square) {
            element.sy = 1 + Number(deltaLength) / length;
        }
        (0, render_all_1.renderAll)(gl, programInfo, shapes, positionBuffer, colorBuffer);
    });
    const sliderWidth_original = document.getElementById("sliderWidth");
    const sliderWidth = sliderWidth_original.cloneNode(true);
    sliderWidth_original.parentNode.replaceChild(sliderWidth, sliderWidth_original);
    if (element.type == type_enum_1.default.Line || element.type == type_enum_1.default.Square) {
        sliderWidth.disabled = true;
    }
    else {
        sliderWidth.disabled = false;
    }
    sliderWidth.min = "0";
    sliderWidth.max = "600";
    let width;
    if (element.type == type_enum_1.default.Rectangle || element.type == type_enum_1.default.Square) {
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
        width = max - min;
    }
    sliderWidth.value = ((element.sy - 1) * width).toString();
    sliderWidth.addEventListener("input", (event) => {
        const deltaWidth = event.target.value;
        element.sy = 1 + Number(deltaWidth) / width;
        (0, render_all_1.renderAll)(gl, programInfo, shapes, positionBuffer, colorBuffer);
    });
    const sliderRotation_original = document.getElementById("sliderRotation");
    const sliderRotation_value = document.getElementById("slider-rotation-value");
    const sliderRotation = sliderRotation_original.cloneNode(true);
    sliderRotation_original.parentNode.replaceChild(sliderRotation, sliderRotation_original);
    sliderRotation.min = "0";
    sliderRotation.max = "360";
    sliderRotation.value = ((180 * element.degree) / Math.PI).toString();
    sliderRotation_value.textContent = ((180 * element.degree) / Math.PI).toFixed(0).toString();
    sliderRotation.step = "10";
    sliderRotation.addEventListener("input", (event) => {
        const deltaDegree = event.target.value;
        element.degree = (Number(deltaDegree) / 180) * Math.PI;
        sliderRotation_value.textContent = ((180 * element.degree) / Math.PI).toFixed(0).toString();
        (0, render_all_1.renderAll)(gl, programInfo, shapes, positionBuffer, colorBuffer);
    });
    const sliderShearX_original = document.getElementById("sliderShearX");
    const sliderShearX = sliderShearX_original.cloneNode(true);
    sliderShearX_original.parentNode.replaceChild(sliderShearX, sliderShearX_original);
    sliderShearX.min = "0";
    sliderShearX.max = "10";
    sliderShearX.value = element.kx.toString();
    sliderShearX.step = "0.1";
    sliderShearX.addEventListener("input", (event) => {
        const deltaShearX = event.target.value;
        element.kx = Number(deltaShearX);
        (0, render_all_1.renderAll)(gl, programInfo, shapes, positionBuffer, colorBuffer);
    });
    const sliderShearY_original = document.getElementById("sliderShearY");
    const sliderShearY = sliderShearY_original.cloneNode(true);
    sliderShearY_original.parentNode.replaceChild(sliderShearY, sliderShearY_original);
    sliderShearY.min = "0";
    sliderShearY.max = "10";
    sliderShearY.value = element.ky.toString();
    sliderShearY.step = "0.1";
    sliderShearY.addEventListener("input", (event) => {
        const deltaShearY = event.target.value;
        element.ky = Number(deltaShearY);
        (0, render_all_1.renderAll)(gl, programInfo, shapes, positionBuffer, colorBuffer);
    });
    const pointPicker_original = document.getElementById("pointPicker");
    const pointPicker = pointPicker_original.cloneNode(true);
    pointPicker_original.parentElement.replaceChild(pointPicker, pointPicker_original);
    pointPicker.innerHTML = "";
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
    // If the currentObject is not of type Polygon, remove the button
    const addPointButton = document.getElementById("btn-add-point");
    if (addPointButton) {
        addPointButton.remove();
    }
    if (element instanceof polygon_1.default) {
        const addPointButton = document.createElement("button");
        addPointButton.textContent = "Add New Point";
        addPointButton.className = "btn btn-primary add-btn";
        addPointButton.id = "btn-add-point";
        addPointButton.addEventListener("click", () => {
            // Set a flag to indicate that a new point is being added
            isDrawing = true;
            currentObject = shapes[element.id];
        });
        // Append the button to the DOM
        const polygonBtn = document.querySelector(".polygon-btn-section");
        if (polygonBtn) {
            polygonBtn.appendChild(addPointButton);
        }
    }
    setupColorPicker(gl, programInfo, 0, element);
}
function setupColorPicker(gl, programInfo, pointIndex, element) {
    const colorPicker_original = document.getElementById("colorPicker");
    const colorPicker = colorPicker_original.cloneNode(true);
    const color = (0, tools_1.rgbToHex)(element.arrayOfPoints[pointIndex].getColor());
    colorPicker.value = color;
    colorPicker_original.parentElement.replaceChild(colorPicker, colorPicker_original);
    colorPicker.addEventListener("change", (event) => {
        const hex = event.target.value;
        element.arrayOfPoints[pointIndex].setColor((0, tools_1.hexToRgb)(hex));
        (0, render_all_1.renderAll)(gl, programInfo, shapes, positionBuffer, colorBuffer);
    });
    const deletePointButton = document.getElementById("btn-delete-point");
    if (deletePointButton) {
        deletePointButton.remove();
    }
    if (element instanceof polygon_1.default) {
        const deletePointButton = document.createElement("button");
        deletePointButton.textContent = "Delete Point";
        deletePointButton.className = "btn btn-primary delete-btn";
        deletePointButton.id = "btn-delete-point";
        deletePointButton.addEventListener("click", () => {
            element.deletePoint(pointIndex);
            (0, render_all_1.renderAll)(gl, programInfo, shapes, positionBuffer, colorBuffer);
        });
        const polygonBtn = document.querySelector(".polygon-btn-section");
        if (polygonBtn) {
            polygonBtn.appendChild(deletePointButton);
        }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Qy9DLENBQUM7SUFFTSxjQUFjLENBQUMsV0FBbUI7UUFDckMsTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsV0FBVyxDQUFDLEVBQUUsQ0FBQztRQUN2QyxNQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxXQUFXLENBQUMsRUFBRSxDQUFDO1FBQ3ZDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxFQUFFLENBQUM7UUFFdkMsTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztRQUNoQyxNQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7UUFFaEMsTUFBTSxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO1FBQzdDLE1BQU0sR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztRQUM3QyxNQUFNLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7UUFDN0MsTUFBTSxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO1FBQzdDLE1BQU0sR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztRQUM3QyxNQUFNLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7UUFDN0MsTUFBTSxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO1FBQzdDLE1BQU0sR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztRQUM3QyxNQUFNLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7UUFFN0MsTUFBTSxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUM3RSxPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBR00sYUFBYSxDQUFDLEtBQVk7UUFDN0IsTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztRQUNoQyxNQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7UUFFaEMsTUFBTSxFQUFFLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDekQsTUFBTSxFQUFFLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFFekQsTUFBTSxR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RUFBVSxFQUFFLEVBQVU7UUFDNUMsTUFBTSxNQUFNLEdBQUcsSUFBSSxnQkFBTSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0QsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUNNLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBYztRQUNqQyxNQUFNLE1BQU0sR0FBRyxJQUFJLGdCQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4SCxPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBQ00sTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFVLEVBQUUsRUFBVTtRQUN0QyxNQUFNLE1BQU0sR0FBRyxJQUFJLGdCQUFNLENBQUMsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzRCxPQUFPLE1BQU07SUFDakIsQ0FBQztJQUNNLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBVTtRQUMzQixNQUFNLE1BQU0sR0FBRyxJQUFJLGdCQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxD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SyxDQUFDLE1BQU0sR0FBRyxrQkFBa0IsQ0FBQztJQUVsQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRTtRQUNwQyxNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVCLE1BQU0sTUFBTSxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7UUFFaEMsTUFBTSxDQUFDLE1BQU0sR0FBRyxHQUFHLEVBQUU7WUFDbkIsUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFnQixDQUFDLENBQUM7UUFDcEMsQ0FBQyxDQUFDO1FBQ0YsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMxQixDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2pDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNkLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ25DLENBQUM7Ozs7Ozs7VUNyb0JEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUV0QkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90dWdhcy1iZXNhci1ncmFma29tLTEtcGFpbnQvLi9zcmMvMkQtU2hhcGVzL2xpbmUudHMiLCJ3ZWJwYWNrOi8vdHVnYXMtYmVzYXItZ3JhZmtvbS0xLXBhaW50Ly4vc3JjLzJELVNoYXBlcy9wb2x5Z29uLnRzIiwid2VicGFjazovL3R1Z2FzLWJlc2FyLWdyYWZrb20tMS1wYWludC8uL3NyYy8yRC1TaGFwZXMvcmVjdGFuZ2xlLnRzIiwid2VicGFjazovL3R1Z2FzLWJlc2FyLWdyYWZrb20tMS1wYWludC8uL3NyYy8yRC1TaGFwZXMvc2hhcGUudHMiLCJ3ZWJwYWNrOi8vdHVnYXMtYmVzYXItZ3JhZmtvbS0xLXBhaW50Ly4vc3JjLzJELVNoYXBlcy9zcXVhcmUudHMiLCJ3ZWJwYWNrOi8vdHVnYXMtYmVzYXItZ3JhZmtvbS0xLXBhaW50Ly4vc3JjLzJELVNoYXBlcy90eXBlLmVudW0udHMiLCJ3ZWJwYWNrOi8vdHVnYXMtYmVzYXItZ3JhZmtvbS0xLXBhaW50Ly4vc3JjL0Jhc2UvY29vcmRpbmF0ZS50cyIsIndlYnBhY2s6Ly90dWdhcy1iZXNhci1ncmFma29tLTEtcGFpbnQvLi9zcmMvQmFzZS9tYXRyaXgudHMiLCJ3ZWJwYWNrOi8vdHVnYXMtYmVzYXItZ3JhZmtvbS0xLXBhaW50Ly4vc3JjL0Jhc2UvcG9pbnQudHMiLCJ3ZWJwYWNrOi8vdHVnYXMtYmVzYXItZ3JhZmtvbS0xLXBhaW50Ly4vc3JjL0Z1bmN0aW9ucy9jcmVhdGUtc2hhZGVyLXByb2dyYW0udHMiLCJ3ZWJwYWNrOi8vdHVnYXMtYmVzYXItZ3JhZmtvbS0xLXBhaW50Ly4vc3JjL0Z1bmN0aW9ucy9sb2FkLXNoYWRlci50cyIsIndlYnBhY2s6Ly90dWdhcy1iZXNhci1ncmFma29tLTEtcGFpbnQvLi9zcmMvRnVuY3Rpb25zL3JlbmRlci1hbGwudHMiLCJ3ZWJwYWNrOi8vdHVnYXMtYmVzYXItZ3JhZmtvbS0xLXBhaW50Ly4vc3JjL0Z1bmN0aW9ucy9yZW5kZXIudHMiLCJ3ZWJwYWNrOi8vdHVnYXMtYmVzYXItZ3JhZmtvbS0xLXBhaW50Ly4vc3JjL09wZXJhdGlvbnMvVHJhbnNmb3JtYXRpb24udHMiLCJ3ZWJwYWNrOi8vdHVnYXMtYmVzYXItZ3JhZmtvbS0xLXBhaW50Ly4vc3JjL09wZXJhdGlvbnMvY29udmV4LWh1bGwudHMiLCJ3ZWJwYWNrOi8vdHVnYXMtYmVzYXItZ3JhZmtvbS0xLXBhaW50Ly4vc3JjL1V0aWxzL3Rvb2xzLnRzIiwid2VicGFjazovL3R1Z2FzLWJlc2FyLWdyYWZrb20tMS1wYWludC8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly90dWdhcy1iZXNhci1ncmFma29tLTEtcGFpbnQvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdHVnYXMtYmVzYXItZ3JhZmtvbS0xLXBhaW50L3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vdHVnYXMtYmVzYXItZ3JhZmtvbS0xLXBhaW50L3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly90dWdhcy1iZXNhci1ncmFma29tLTEtcGFpbnQvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZW5kZXJhYmxlIGZyb20gXCJJbnRlcmZhY2VzL3JlbmRlcmFibGUuaW50ZXJmYWNlXCI7XHJcbmltcG9ydCBUcmFuc2Zvcm1hYmxlIGZyb20gXCJJbnRlcmZhY2VzL3RyYW5zZm9ybWFibGUuaW50ZXJmYWNlXCI7XHJcbmltcG9ydCBTaGFwZSBmcm9tIFwiU2hhcGVzL3NoYXBlXCI7XHJcbmltcG9ydCBUeXBlIGZyb20gXCJTaGFwZXMvdHlwZS5lbnVtXCI7XHJcbmltcG9ydCBQb2ludCBmcm9tIFwiQmFzZS9wb2ludFwiO1xyXG5pbXBvcnQgVHJhbnNmb3JtYXRpb24gZnJvbSBcIk9wZXJhdGlvbnMvVHJhbnNmb3JtYXRpb25cIjtcclxuXHJcbmNsYXNzIExpbmUgZXh0ZW5kcyBTaGFwZSBpbXBsZW1lbnRzIFJlbmRlcmFibGUsIFRyYW5zZm9ybWFibGUge1xyXG5cclxuICAgIHB1YmxpYyB0eXBlOiBUeXBlLkxpbmU7XHJcbiAgICBwdWJsaWMgYXJyYXlPZlBvaW50czogUG9pbnRbXTtcclxuXHJcbiAgICBwdWJsaWMgY2VudGVyOiBQb2ludDtcclxuICAgIHB1YmxpYyB0eDogbnVtYmVyO1xyXG4gICAgcHVibGljIHR5OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgZGVncmVlOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgc3g6IG51bWJlcjtcclxuICAgIHB1YmxpYyBzeTogbnVtYmVyO1xyXG4gICAgcHVibGljIGt4OiBudW1iZXI7XHJcbiAgICBwdWJsaWMga3k6IG51bWJlcjtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoaWQ6IG51bWJlciwgcDE6IFBvaW50KSB7XHJcbiAgICAgICAgc3VwZXIoaWQsIDIsIFR5cGUuTGluZSk7XHJcbiAgICAgICAgdGhpcy5hcnJheU9mUG9pbnRzID0gW3AxXTtcclxuICAgICAgICB0aGlzLnR4ID0gMDtcclxuICAgICAgICB0aGlzLnR5ID0gMDtcclxuICAgICAgICB0aGlzLmRlZ3JlZSA9IDA7XHJcbiAgICAgICAgdGhpcy5zeCA9IDE7XHJcbiAgICAgICAgdGhpcy5zeSA9IDE7XHJcbiAgICAgICAgdGhpcy5reCA9IDA7XHJcbiAgICAgICAgdGhpcy5reSA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gVHJhbnNmb3JtYWJsZSBNZXRob2RzXHJcbiAgICBwdWJsaWMgYWRkTWF0cml4KGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsIG1hdHJpeExvY2F0aW9uOiBXZWJHTFVuaWZvcm1Mb2NhdGlvbik6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IG1hdHJpeCA9IFRyYW5zZm9ybWF0aW9uLnRyYW5zZm9ybWF0aW9uTWF0cml4KFxyXG4gICAgICAgICAgICBnbC5jYW52YXMud2lkdGgsXHJcbiAgICAgICAgICAgIGdsLmNhbnZhcy5oZWlnaHQsXHJcbiAgICAgICAgICAgIHRoaXMudHgsXHJcbiAgICAgICAgICAgIHRoaXMudHksXHJcbiAgICAgICAgICAgIHRoaXMuZGVncmVlLFxyXG4gICAgICAgICAgICB0aGlzLnN4LFxyXG4gICAgICAgICAgICB0aGlzLnN5LFxyXG4gICAgICAgICAgICB0aGlzLmt4LFxyXG4gICAgICAgICAgICB0aGlzLmt5LFxyXG4gICAgICAgICAgICB0aGlzLmdldENlbnRlcigpXHJcbiAgICAgICAgICApLmZsYXR0ZW4oKTtcclxuICAgICAgXHJcbiAgICAgICAgICBnbC51bmlmb3JtTWF0cml4M2Z2KG1hdHJpeExvY2F0aW9uLCBmYWxzZSwgbWF0cml4KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0Q2VudGVyKCk6IFBvaW50IHtcclxuICAgICAgICBjb25zdCBudW1Qb2ludHMgPSB0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoO1xyXG4gICAgICAgIGxldCBjZW50ZXJYID0gMDtcclxuICAgICAgICBsZXQgY2VudGVyWSA9IDA7XHJcbiAgICAgICAgZm9yIChjb25zdCBwb2ludCBvZiB0aGlzLmFycmF5T2ZQb2ludHMpIHtcclxuICAgICAgICAgICAgY29uc3QgW3gsIHldID0gcG9pbnQuZ2V0UGFpcigpO1xyXG4gICAgICAgICAgICBjZW50ZXJYICs9IHg7XHJcbiAgICAgICAgICAgIGNlbnRlclkgKz0geTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2VudGVyWCAvPSBudW1Qb2ludHM7XHJcbiAgICAgICAgY2VudGVyWSAvPSBudW1Qb2ludHM7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgUG9pbnQoW2NlbnRlclgsIGNlbnRlclldLCBbMCwgMCwgMCwgMF0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkcmF3TWV0aG9kKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBnbC5MSU5FUztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaXNEcmF3YWJsZSgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aCA9PT0gMjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZHJhdyhwb2ludDogUG9pbnQpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmFycmF5T2ZQb2ludHNbMV0gPSBwb2ludDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0TnVtYmVyT2ZWZXJ0aWNlc1RvQmVEcmF3bigpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiAyO1xyXG4gICAgfSBcclxuICAgIFxyXG4gICAgcHVibGljIGFkZFBvc2l0aW9uKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQpOiB2b2lkIHtcclxuICAgICAgICBnbC5idWZmZXJEYXRhKFxyXG4gICAgICAgICAgICBnbC5BUlJBWV9CVUZGRVIsXHJcbiAgICAgICAgICAgIG5ldyBGbG9hdDMyQXJyYXkoWy4uLnRoaXMuYXJyYXlPZlBvaW50c1swXS5nZXRQYWlyKCksIC4uLnRoaXMuYXJyYXlPZlBvaW50c1sxXS5nZXRQYWlyKCldKSxcclxuICAgICAgICAgICAgZ2wuU1RBVElDX0RSQVdcclxuICAgICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZENvbG9yKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQpOiB2b2lkIHtcclxuICAgICAgICBnbC5idWZmZXJEYXRhKFxyXG4gICAgICAgICAgICBnbC5BUlJBWV9CVUZGRVIsXHJcbiAgICAgICAgICAgIG5ldyBGbG9hdDMyQXJyYXkoWy4uLnRoaXMuYXJyYXlPZlBvaW50c1swXS5nZXRDb2xvcigpLCAuLi50aGlzLmFycmF5T2ZQb2ludHNbMV0uZ2V0Q29sb3IoKV0pLFxyXG4gICAgICAgICAgICBnbC5TVEFUSUNfRFJBV1xyXG4gICAgICAgICAgKTtcclxuICAgIH0gIFxyXG5cclxuICAgIHB1YmxpYyBzZXRMaW5lQXR0cmlidXRlcyh0eDogbnVtYmVyLCB0eTogbnVtYmVyLCBkZWdyZWU6IG51bWJlciwgc3g6IG51bWJlciwgc3k6IG51bWJlciwga3g6IG51bWJlciwga3k6IG51bWJlciwgcDI6IFBvaW50KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5hcnJheU9mUG9pbnRzLnB1c2gocDIpO1xyXG4gICAgICAgIHRoaXMudHggPSB0eDtcclxuICAgICAgICB0aGlzLnR5ID0gdHk7XHJcbiAgICAgICAgdGhpcy5kZWdyZWUgPSBkZWdyZWU7XHJcbiAgICAgICAgdGhpcy5zeCA9IHN4O1xyXG4gICAgICAgIHRoaXMuc3kgPSBzeTtcclxuICAgICAgICB0aGlzLmt4ID0ga3g7XHJcbiAgICAgICAgdGhpcy5reSA9IGt5O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBMaW5lO1xyXG4iLCJpbXBvcnQgVHJhbnNmb3JtYXRpb24gZnJvbSBcIk9wZXJhdGlvbnMvVHJhbnNmb3JtYXRpb25cIjtcclxuaW1wb3J0IFJlbmRlcmFibGUgZnJvbSBcIkludGVyZmFjZXMvcmVuZGVyYWJsZS5pbnRlcmZhY2VcIjtcclxuaW1wb3J0IFRyYW5zZm9ybWFibGUgZnJvbSBcIkludGVyZmFjZXMvdHJhbnNmb3JtYWJsZS5pbnRlcmZhY2VcIjtcclxuaW1wb3J0IFNoYXBlIGZyb20gXCJTaGFwZXMvc2hhcGVcIjtcclxuaW1wb3J0IFR5cGUgZnJvbSBcIlNoYXBlcy90eXBlLmVudW1cIjtcclxuaW1wb3J0IFBvaW50IGZyb20gXCJCYXNlL3BvaW50XCI7XHJcbmltcG9ydCBjb252ZXhIdWxsIGZyb20gXCJPcGVyYXRpb25zL2NvbnZleC1odWxsXCI7XHJcblxyXG5jbGFzcyBQb2x5Z29uIGV4dGVuZHMgU2hhcGUgaW1wbGVtZW50cyBSZW5kZXJhYmxlLCBUcmFuc2Zvcm1hYmxlIHtcclxuICAgIHB1YmxpYyB0eXBlOiBUeXBlLlBvbHlnb247XHJcbiAgICBwdWJsaWMgYXJyYXlPZlBvaW50czogUG9pbnRbXTtcclxuXHJcbiAgICBwdWJsaWMgY2VudGVyOiBQb2ludDtcclxuICAgIHB1YmxpYyB0eDogbnVtYmVyO1xyXG4gICAgcHVibGljIHR5OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgZGVncmVlOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgc3g6IG51bWJlcjtcclxuICAgIHB1YmxpYyBzeTogbnVtYmVyO1xyXG4gICAgcHVibGljIGt4OiBudW1iZXI7XHJcbiAgICBwdWJsaWMga3k6IG51bWJlcjtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoaWQ6IG51bWJlciwgcG9pbnQ6IFBvaW50KSB7XHJcbiAgICAgICAgc3VwZXIoaWQsIDEsIFR5cGUuUG9seWdvbik7XHJcbiAgICAgICAgdGhpcy5hcnJheU9mUG9pbnRzID0gbmV3IEFycmF5KHBvaW50KTtcclxuICAgICAgICB0aGlzLnR4ID0gMDtcclxuICAgICAgICB0aGlzLnR5ID0gMDtcclxuICAgICAgICB0aGlzLmRlZ3JlZSA9IDA7XHJcbiAgICAgICAgdGhpcy5zeCA9IDE7XHJcbiAgICAgICAgdGhpcy5zeSA9IDE7XHJcbiAgICAgICAgdGhpcy5reCA9IDA7XHJcbiAgICAgICAgdGhpcy5reSA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldENlbnRlcigpOiBQb2ludCB7XHJcbiAgICAgICAgbGV0IHN1bVggPSAwO1xyXG4gICAgICAgIGxldCBzdW1ZID0gMDtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgW3gsIHldID0gdGhpcy5hcnJheU9mUG9pbnRzW2ldLmdldFBhaXIoKTtcclxuICAgICAgICAgICAgc3VtWCArPSB4O1xyXG4gICAgICAgICAgICBzdW1ZICs9IHk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBjZW50ZXJYID0gc3VtWCAvIHRoaXMuYXJyYXlPZlBvaW50cy5sZW5ndGg7XHJcbiAgICAgICAgY29uc3QgY2VudGVyWSA9IHN1bVkgLyB0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoO1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3IFBvaW50KFtjZW50ZXJYLCBjZW50ZXJZXSwgWzAsIDAsIDAsIDBdKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaXNEcmF3YWJsZSgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aCA+PSAyO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkcmF3IChwb2ludDogUG9pbnQpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aCA+PSAzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYXJyYXlPZlBvaW50cyA9IGNvbnZleEh1bGwoWy4uLnRoaXMuYXJyYXlPZlBvaW50cywgcG9pbnRdKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmFycmF5T2ZQb2ludHNbdGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aF0gPSBwb2ludDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jZW50ZXIgPSB0aGlzLmdldENlbnRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkcmF3TWV0aG9kKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoID49MyA/IGdsLlRSSUFOR0xFX0ZBTiA6IGdsLkxJTkVTO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXROdW1iZXJPZlZlcnRpY2VzVG9CZURyYXduKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJyYXlPZlBvaW50cy5sZW5ndGggO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRQb3NpdGlvbihnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0KTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgdmVydGljZXMgPSBuZXcgRmxvYXQzMkFycmF5KHRoaXMuYXJyYXlPZlBvaW50cy5sZW5ndGggKiAyKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgW3gsIHldID0gdGhpcy5hcnJheU9mUG9pbnRzW2ldLmdldFBhaXIoKTtcclxuICAgICAgICAgICAgdmVydGljZXNbaSAqIDJdID0geDtcclxuICAgICAgICAgICAgdmVydGljZXNbaSAqIDIgKyAxXSA9IHk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBbcEluaXRpYWxYLCBwSW5pdGlhbFldID0gdGhpcy5hcnJheU9mUG9pbnRzWzBdLmdldFBhaXIoKTtcclxuICAgICAgICB2ZXJ0aWNlc1t0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoICogMl0gPSBwSW5pdGlhbFg7XHJcbiAgICAgICAgdmVydGljZXNbdGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aCAqIDIgKyAxXSA9IHBJbml0aWFsWTtcclxuXHJcbiAgICAgICAgZ2wuYnVmZmVyRGF0YShnbC5BUlJBWV9CVUZGRVIsIHZlcnRpY2VzLCBnbC5TVEFUSUNfRFJBVyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZENvbG9yKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBjb2xvcnMgPSBuZXcgRmxvYXQzMkFycmF5KHRoaXMuYXJyYXlPZlBvaW50cy5sZW5ndGggKiA0KTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgW3IsIGcsIGIsIGFdID0gdGhpcy5hcnJheU9mUG9pbnRzW2ldLmdldENvbG9yKCk7XHJcbiAgICAgICAgICAgIGNvbG9yc1tpICogNF0gPSByO1xyXG4gICAgICAgICAgICBjb2xvcnNbaSAqIDQgKyAxXSA9IGc7XHJcbiAgICAgICAgICAgIGNvbG9yc1tpICogNCArIDJdID0gYjtcclxuICAgICAgICAgICAgY29sb3JzW2kgKiA0ICsgM10gPSBhO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgW3JJbml0aWFsLCBnSW5pdGlhbCwgYkluaXRpYWwsIGFJbml0aWFsXSA9IHRoaXMuYXJyYXlPZlBvaW50c1swXS5nZXRDb2xvcigpO1xyXG4gICAgICAgIGNvbG9yc1t0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoICogNF0gPSBySW5pdGlhbDtcclxuICAgICAgICBjb2xvcnNbdGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aCAqIDQgKyAxXSA9IGdJbml0aWFsO1xyXG4gICAgICAgIGNvbG9yc1t0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoICogNCArIDJdID0gYkluaXRpYWw7XHJcbiAgICAgICAgY29sb3JzW3RoaXMuYXJyYXlPZlBvaW50cy5sZW5ndGggKiA0ICsgM10gPSBhSW5pdGlhbDtcclxuXHJcbiAgICAgICAgZ2wuYnVmZmVyRGF0YShnbC5BUlJBWV9CVUZGRVIsIGNvbG9ycywgZ2wuU1RBVElDX0RSQVcpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGFkZE1hdHJpeChnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LCBtYXRyaXhMb2NhdGlvbjogV2ViR0xVbmlmb3JtTG9jYXRpb24pOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBtYXRyaXggPSBUcmFuc2Zvcm1hdGlvbi50cmFuc2Zvcm1hdGlvbk1hdHJpeChcclxuICAgICAgICAgICAgZ2wuY2FudmFzLndpZHRoLFxyXG4gICAgICAgICAgICBnbC5jYW52YXMuaGVpZ2h0LFxyXG4gICAgICAgICAgICB0aGlzLnR4LFxyXG4gICAgICAgICAgICB0aGlzLnR5LFxyXG4gICAgICAgICAgICB0aGlzLmRlZ3JlZSxcclxuICAgICAgICAgICAgdGhpcy5zeCxcclxuICAgICAgICAgICAgdGhpcy5zeSxcclxuICAgICAgICAgICAgdGhpcy5reCxcclxuICAgICAgICAgICAgdGhpcy5reSxcclxuICAgICAgICAgICAgdGhpcy5jZW50ZXJcclxuICAgICAgICAgICkuZmxhdHRlbigpO1xyXG4gICAgICBcclxuICAgICAgICAgIGdsLnVuaWZvcm1NYXRyaXgzZnYobWF0cml4TG9jYXRpb24sIGZhbHNlLCBtYXRyaXgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkZWxldGVQb2ludChpbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgdmFyIG5ld1BvaW50czogUG9pbnRbXSA9IFt0aGlzLmFycmF5T2ZQb2ludHNbaW5kZXhdXTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYXJyYXlPZlBvaW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgaWYgKGkgIT0gaW5kZXgpIHtcclxuICAgICAgICAgICAgbmV3UG9pbnRzLnB1c2godGhpcy5hcnJheU9mUG9pbnRzW2ldKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICBcclxuICAgICAgICB0aGlzLmFycmF5T2ZQb2ludHMgPSBuZXdQb2ludHMuc2xpY2UoMSwgdGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aCk7XHJcbiAgICBcclxuICAgICAgICAvLyBhZnRlciBkZWxldGUsIG5lZWQgdG8gc2V0dXAgb3B0aW9uIGFnYWluXHJcbiAgICAgICAgY29uc3QgcG9pbnRQaWNrZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBvaW50UGlja2VyXCIpO1xyXG4gICAgICAgIHBvaW50UGlja2VyLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgICAgcG9pbnRQaWNrZXIucmVwbGFjZUNoaWxkcmVuKCk7XHJcbiAgICAgICAgLyogQWxsIFBvaW50ICovXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgIGNvbnN0IG5ld1BvaW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKTtcclxuICAgICAgICAgIG5ld1BvaW50LnZhbHVlID0gaS50b1N0cmluZygpO1xyXG4gICAgICAgICAgbmV3UG9pbnQudGV4dCA9IFwicG9pbnRfXCIgKyBpO1xyXG4gICAgICAgICAgcG9pbnRQaWNrZXIuYXBwZW5kQ2hpbGQobmV3UG9pbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgcHVibGljIHNldFBvbHlnb25BdHRyaWJ1dGVzKHR4OiBudW1iZXIsIHR5OiBudW1iZXIsIGRlZ3JlZTogbnVtYmVyLCBzeDogbnVtYmVyLCBzeTogbnVtYmVyLCBreDogbnVtYmVyLCBreTogbnVtYmVyLCBhcnJheU9mUG9pbnRzOiBQb2ludFtdKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5hcnJheU9mUG9pbnRzID0gYXJyYXlPZlBvaW50cztcclxuICAgICAgICB0aGlzLnR4ID0gdHg7XHJcbiAgICAgICAgdGhpcy50eSA9IHR5O1xyXG4gICAgICAgIHRoaXMuZGVncmVlID0gZGVncmVlO1xyXG4gICAgICAgIHRoaXMuc3ggPSBzeDtcclxuICAgICAgICB0aGlzLnN5ID0gc3k7XHJcbiAgICAgICAgdGhpcy5reCA9IGt4O1xyXG4gICAgICAgIHRoaXMua3kgPSBreTtcclxuICAgICAgICB0aGlzLm51bWJlck9mVmVydGljZXMgPSBhcnJheU9mUG9pbnRzLmxlbmd0aDtcclxuICAgICAgICB0aGlzLmNlbnRlciA9IHRoaXMuZ2V0Q2VudGVyKCk7XHJcbiAgICAgIH1cclxuICAgIFxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBQb2x5Z29uOyIsImltcG9ydCBTaGFwZSBmcm9tIFwiU2hhcGVzL3NoYXBlXCI7XHJcbmltcG9ydCBQb2ludCBmcm9tIFwiQmFzZS9wb2ludFwiO1xyXG5pbXBvcnQgVHlwZSBmcm9tIFwiU2hhcGVzL3R5cGUuZW51bVwiO1xyXG5pbXBvcnQgUmVuZGVyYWJsZSBmcm9tIFwiSW50ZXJmYWNlcy9yZW5kZXJhYmxlLmludGVyZmFjZVwiO1xyXG5pbXBvcnQgVHJhbnNmb3JtYWJsZSBmcm9tIFwiSW50ZXJmYWNlcy90cmFuc2Zvcm1hYmxlLmludGVyZmFjZVwiO1xyXG5pbXBvcnQgVHJhbnNmb3JtYXRpb24gZnJvbSBcIk9wZXJhdGlvbnMvVHJhbnNmb3JtYXRpb25cIjtcclxuXHJcbmNsYXNzIFJlY3RhbmdsZSBleHRlbmRzIFNoYXBlIGltcGxlbWVudHMgUmVuZGVyYWJsZSwgVHJhbnNmb3JtYWJsZSB7XHJcbiAgICBwdWJsaWMgYXJyYXlPZlBvaW50czogUG9pbnRbXTtcclxuICAgIHB1YmxpYyBjZW50ZXI6IFBvaW50O1xyXG4gICAgcHVibGljIHR4OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgdHk6IG51bWJlcjtcclxuICAgIHB1YmxpYyBkZWdyZWU6IG51bWJlcjtcclxuICAgIHB1YmxpYyBzeDogbnVtYmVyO1xyXG4gICAgcHVibGljIHN5OiBudW1iZXI7XHJcbiAgICBwdWJsaWMga3g6IG51bWJlcjtcclxuICAgIHB1YmxpYyBreTogbnVtYmVyO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihpZDogbnVtYmVyLCAgcDE6IFBvaW50KXtcclxuICAgICAgICBzdXBlcihpZCwgNCwgVHlwZS5SZWN0YW5nbGUpO1xyXG4gICAgICAgIHRoaXMuYXJyYXlPZlBvaW50cyA9IFtwMSwgbnVsbCwgbnVsbCwgbnVsbF07XHJcbiAgICAgICAgdGhpcy50eCA9IDA7XHJcbiAgICAgICAgdGhpcy50eSA9IDA7XHJcbiAgICAgICAgdGhpcy5kZWdyZWUgPSAwO1xyXG4gICAgICAgIHRoaXMuc3ggPSAxO1xyXG4gICAgICAgIHRoaXMuc3kgPSAxO1xyXG4gICAgICAgIHRoaXMua3ggPSAwO1xyXG4gICAgICAgIHRoaXMua3kgPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFRyYW5zZm9ybWFibGUgTWV0aG9kc1xyXG4gICAgcHVibGljIGdldENlbnRlcigpOiBQb2ludCB7XHJcbiAgICAgICAgY29uc3QgW3AxeCwgcDF5XSA9IHRoaXMuYXJyYXlPZlBvaW50c1swXS5nZXRQYWlyKCk7XHJcbiAgICAgICAgY29uc3QgW3AyeCwgcDJ5XSA9IHRoaXMuYXJyYXlPZlBvaW50c1sxXS5nZXRQYWlyKCk7XHJcbiAgICAgICAgY29uc3QgW3AzeCwgcDN5XSA9IHRoaXMuYXJyYXlPZlBvaW50c1syXS5nZXRQYWlyKCk7XHJcbiAgICAgICAgY29uc3QgW3A0eCwgcDR5XSA9IHRoaXMuYXJyYXlPZlBvaW50c1szXS5nZXRQYWlyKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGNlbnRlclggPSAocDF4ICsgcDJ4ICsgcDN4ICsgcDR4KSAvIDQ7XHJcbiAgICAgICAgY29uc3QgY2VudGVyWSA9IChwMXkgKyBwMnkgKyBwM3kgKyBwNHkpIC8gNDtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gbmV3IFBvaW50KFtjZW50ZXJYLCBjZW50ZXJZXSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZE1hdHJpeChnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LCBtYXRyaXhMb2NhdGlvbjogV2ViR0xVbmlmb3JtTG9jYXRpb24pOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBtYXRyaXggPSBUcmFuc2Zvcm1hdGlvbi50cmFuc2Zvcm1hdGlvbk1hdHJpeChcclxuICAgICAgICAgICAgZ2wuY2FudmFzLndpZHRoLFxyXG4gICAgICAgICAgICBnbC5jYW52YXMuaGVpZ2h0LFxyXG4gICAgICAgICAgICB0aGlzLnR4LFxyXG4gICAgICAgICAgICB0aGlzLnR5LFxyXG4gICAgICAgICAgICB0aGlzLmRlZ3JlZSxcclxuICAgICAgICAgICAgdGhpcy5zeCxcclxuICAgICAgICAgICAgdGhpcy5zeSxcclxuICAgICAgICAgICAgdGhpcy5reCxcclxuICAgICAgICAgICAgdGhpcy5reSxcclxuICAgICAgICAgICAgdGhpcy5jZW50ZXJcclxuICAgICAgICAgICkuZmxhdHRlbigpO1xyXG4gICAgICBcclxuICAgICAgICAgIGdsLnVuaWZvcm1NYXRyaXgzZnYobWF0cml4TG9jYXRpb24sIGZhbHNlLCBtYXRyaXgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFJlbmRlcmFibGUgTWV0aG9kc1xyXG4gICAgcHVibGljIGRyYXdNZXRob2QoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIGdsLlRSSUFOR0xFX0ZBTjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaXNEcmF3YWJsZSgpOiBib29sZWFuIHtcclxuICAgICAgICAvLyByZXR1cm4gdGhpcy5hcnJheU9mUG9pbnRzLmZpbHRlcihwb2ludCA9PiBwb2ludCAhPT0gbnVsbCkubGVuZ3RoID09PSA0O1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFycmF5T2ZQb2ludHNbMl0gIT09IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRyYXcocG9pbnQ6IFBvaW50KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5hcnJheU9mUG9pbnRzWzFdID0gbmV3IFBvaW50KFt0aGlzLmFycmF5T2ZQb2ludHNbMF0ueCwgcG9pbnQueV0pO1xyXG4gICAgICAgIHRoaXMuYXJyYXlPZlBvaW50c1syXSA9IHBvaW50O1xyXG4gICAgICAgIHRoaXMuYXJyYXlPZlBvaW50c1szXSA9IG5ldyBQb2ludChbcG9pbnQueCwgdGhpcy5hcnJheU9mUG9pbnRzWzBdLnldKTtcclxuICAgICAgICB0aGlzLmNlbnRlciA9IHRoaXMuZ2V0Q2VudGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldE51bWJlck9mVmVydGljZXNUb0JlRHJhd24oKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gNTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkUG9zaXRpb24oZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCk6IHZvaWQge1xyXG4gICAgICAgIGdsLmJ1ZmZlckRhdGEoXHJcbiAgICAgICAgICAgIGdsLkFSUkFZX0JVRkZFUixcclxuICAgICAgICAgICAgbmV3IEZsb2F0MzJBcnJheShbXHJcbiAgICAgICAgICAgICAgLi4udGhpcy5hcnJheU9mUG9pbnRzWzBdLmdldFBhaXIoKSxcclxuICAgICAgICAgICAgICAuLi50aGlzLmFycmF5T2ZQb2ludHNbMV0uZ2V0UGFpcigpLFxyXG4gICAgICAgICAgICAgIC4uLnRoaXMuYXJyYXlPZlBvaW50c1syXS5nZXRQYWlyKCksXHJcbiAgICAgICAgICAgICAgLi4udGhpcy5hcnJheU9mUG9pbnRzWzNdLmdldFBhaXIoKSxcclxuICAgICAgICAgICAgICAuLi50aGlzLmFycmF5T2ZQb2ludHNbMF0uZ2V0UGFpcigpLFxyXG4gICAgICAgICAgICBdKSxcclxuICAgICAgICAgICAgZ2wuU1RBVElDX0RSQVdcclxuICAgICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZENvbG9yKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQpOiB2b2lkIHtcclxuICAgICAgICBnbC5idWZmZXJEYXRhKFxyXG4gICAgICAgICAgICBnbC5BUlJBWV9CVUZGRVIsXHJcbiAgICAgICAgICAgIG5ldyBGbG9hdDMyQXJyYXkoW1xyXG4gICAgICAgICAgICAgIC4uLnRoaXMuYXJyYXlPZlBvaW50c1swXS5nZXRDb2xvcigpLFxyXG4gICAgICAgICAgICAgIC4uLnRoaXMuYXJyYXlPZlBvaW50c1sxXS5nZXRDb2xvcigpLFxyXG4gICAgICAgICAgICAgIC4uLnRoaXMuYXJyYXlPZlBvaW50c1syXS5nZXRDb2xvcigpLFxyXG4gICAgICAgICAgICAgIC4uLnRoaXMuYXJyYXlPZlBvaW50c1szXS5nZXRDb2xvcigpLFxyXG4gICAgICAgICAgICAgIC4uLnRoaXMuYXJyYXlPZlBvaW50c1swXS5nZXRDb2xvcigpLFxyXG4gICAgICAgICAgICBdKSxcclxuICAgICAgICAgICAgZ2wuU1RBVElDX0RSQVdcclxuICAgICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldFJlY3RhbmdsZUF0dHJpYnV0ZXModHg6IG51bWJlciwgdHk6IG51bWJlciwgZGVncmVlOiBudW1iZXIsIHN4OiBudW1iZXIsIHN5OiBudW1iZXIsIGt4OiBudW1iZXIsIGt5OiBudW1iZXIsIGFycmF5T2ZQb2ludHM6IFBvaW50W10pOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmFycmF5T2ZQb2ludHMgPSBhcnJheU9mUG9pbnRzO1xyXG4gICAgICAgIHRoaXMudHggPSB0eDtcclxuICAgICAgICB0aGlzLnR5ID0gdHk7XHJcbiAgICAgICAgdGhpcy5kZWdyZWUgPSBkZWdyZWU7XHJcbiAgICAgICAgdGhpcy5zeCA9IHN4O1xyXG4gICAgICAgIHRoaXMuc3kgPSBzeTtcclxuICAgICAgICB0aGlzLmt4ID0ga3g7XHJcbiAgICAgICAgdGhpcy5reSA9IGt5O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBSZWN0YW5nbGU7XHJcbiIsImltcG9ydCBQb2ludCBmcm9tIFwiQmFzZS9wb2ludFwiO1xyXG5pbXBvcnQgVHlwZSBmcm9tIFwiU2hhcGVzL3R5cGUuZW51bVwiO1xyXG5hYnN0cmFjdCBjbGFzcyBTaGFwZSB7XHJcbiAgICBwdWJsaWMgaWQ6IG51bWJlcjtcclxuICAgIHB1YmxpYyBudW1iZXJPZlZlcnRpY2VzOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgdHlwZTogVHlwZTtcclxuICAgIHB1YmxpYyBhcnJheU9mUG9pbnRzOiBQb2ludFtdO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihpZDogbnVtYmVyLCBudW1iZXJPZlZlcnRpY2VzOiBudW1iZXIsIHR5cGU6IFR5cGUpe1xyXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcclxuICAgICAgICB0aGlzLm51bWJlck9mVmVydGljZXMgPSBudW1iZXJPZlZlcnRpY2VzO1xyXG4gICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFic3RyYWN0IGdldENlbnRlcigpOiBQb2ludDtcclxuICAgIHB1YmxpYyBhYnN0cmFjdCBpc0RyYXdhYmxlKCk6IGJvb2xlYW47XHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgZHJhdyhwb2ludDogUG9pbnQpOiB2b2lkO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBTaGFwZTsiLCJpbXBvcnQgUmVuZGVyYWJsZSBmcm9tIFwiSW50ZXJmYWNlcy9yZW5kZXJhYmxlLmludGVyZmFjZVwiO1xyXG5pbXBvcnQgU2hhcGUgZnJvbSBcIlNoYXBlcy9zaGFwZVwiO1xyXG5pbXBvcnQgVHJhbnNmb3JtYXRpb24gZnJvbSBcIk9wZXJhdGlvbnMvVHJhbnNmb3JtYXRpb25cIjtcclxuaW1wb3J0IFRyYW5zZm9ybWFibGUgZnJvbSBcIkludGVyZmFjZXMvdHJhbnNmb3JtYWJsZS5pbnRlcmZhY2VcIjtcclxuaW1wb3J0IFBvaW50IGZyb20gXCJCYXNlL3BvaW50XCI7XHJcbmltcG9ydCBUeXBlIGZyb20gXCJTaGFwZXMvdHlwZS5lbnVtXCI7XHJcblxyXG5jbGFzcyBTcXVhcmUgZXh0ZW5kcyBTaGFwZSBpbXBsZW1lbnRzIFJlbmRlcmFibGUsIFRyYW5zZm9ybWFibGUge1xyXG4gIHB1YmxpYyBjZW50ZXI6IFBvaW50O1xyXG4gIHB1YmxpYyBhcnJheU9mUG9pbnRzOiBQb2ludFtdO1xyXG4gIHB1YmxpYyB0eDogbnVtYmVyO1xyXG4gIHB1YmxpYyB0eTogbnVtYmVyO1xyXG4gIHB1YmxpYyBkZWdyZWU6IG51bWJlcjtcclxuICBwdWJsaWMgc3g6IG51bWJlcjtcclxuICBwdWJsaWMgc3k6IG51bWJlcjtcclxuICBwdWJsaWMga3g6IG51bWJlcjtcclxuICBwdWJsaWMga3k6IG51bWJlcjtcclxuXHJcbiAgcHVibGljIGNvbnN0cnVjdG9yKGlkOiBudW1iZXIsIGNlbnRlclBvaW50OiBQb2ludCkge1xyXG4gICAgc3VwZXIoaWQsIDQsIFR5cGUuU3F1YXJlKTtcclxuICAgIHRoaXMuY2VudGVyID0gY2VudGVyUG9pbnQ7XHJcbiAgICB0aGlzLmFycmF5T2ZQb2ludHMgPSBbbnVsbCwgbnVsbCwgbnVsbCwgbnVsbF07XHJcbiAgICB0aGlzLnR4ID0gMDtcclxuICAgIHRoaXMudHkgPSAwO1xyXG4gICAgdGhpcy5kZWdyZWUgPSAwO1xyXG4gICAgdGhpcy5zeCA9IDE7XHJcbiAgICB0aGlzLnN5ID0gMTtcclxuICAgIHRoaXMua3ggPSAwO1xyXG4gICAgdGhpcy5reSA9IDA7XHJcbiAgfVxyXG5cclxuICAvLyBUcmFuc2Zvcm1hYmxlIE1ldGhvZHNcclxuICBwdWJsaWMgZ2V0Q2VudGVyKCk6IFBvaW50IHtcclxuICAgIHJldHVybiB0aGlzLmNlbnRlcjtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhZGRNYXRyaXgoXHJcbiAgICBnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LFxyXG4gICAgbWF0cml4TG9jYXRpb246IFdlYkdMVW5pZm9ybUxvY2F0aW9uXHJcbiAgKTogdm9pZCB7XHJcbiAgICBjb25zdCBtYXRyaXggPSBUcmFuc2Zvcm1hdGlvbi50cmFuc2Zvcm1hdGlvbk1hdHJpeChcclxuICAgICAgZ2wuY2FudmFzLndpZHRoLFxyXG4gICAgICBnbC5jYW52YXMuaGVpZ2h0LFxyXG4gICAgICB0aGlzLnR4LFxyXG4gICAgICB0aGlzLnR5LFxyXG4gICAgICB0aGlzLmRlZ3JlZSxcclxuICAgICAgdGhpcy5zeCxcclxuICAgICAgdGhpcy5zeSxcclxuICAgICAgdGhpcy5reCxcclxuICAgICAgdGhpcy5reSxcclxuICAgICAgdGhpcy5jZW50ZXJcclxuICAgICkuZmxhdHRlbigpO1xyXG5cclxuICAgIGdsLnVuaWZvcm1NYXRyaXgzZnYobWF0cml4TG9jYXRpb24sIGZhbHNlLCBtYXRyaXgpO1xyXG4gIH1cclxuXHJcbiAgLy8gUmVuZGVyYWJsZSBNZXRob2RzXHJcbiAgcHVibGljIGRyYXdNZXRob2QoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gZ2wuVFJJQU5HTEVfRkFOO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGlzRHJhd2FibGUoKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aCA9PT0gNDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBkcmF3KHAxOiBQb2ludCk6IHZvaWQge1xyXG4gICAgdGhpcy5hcnJheU9mUG9pbnRzWzBdID0gcDE7XHJcbiAgICBjb25zdCBbeENlbnRlciwgeUNlbnRlcl0gPSB0aGlzLmNlbnRlci5nZXRQYWlyKCk7XHJcbiAgICAvLyBmb3IgKGxldCBpID0gMTsgaSA8PSAzOyBpKyspIHtcclxuICAgIC8vICAgICBjb25zdCBhbmdsZSA9IChpICogTWF0aC5QSSkgLyAyO1xyXG4gICAgLy8gICAgIGNvbnN0IHJvdGF0ZWRQb2ludCA9IFRyYW5zZm9ybWF0aW9uLnRyYW5zbGF0aW9uKHRoaXMuY2VudGVyLmdldFgoKSwgdGhpcy5jZW50ZXIuZ2V0WSgpKVxyXG4gICAgLy8gICAgICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24ucm90YXRpb24oYW5nbGUpKVxyXG4gICAgLy8gICAgICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24udHJhbnNsYXRpb24oLXRoaXMuY2VudGVyLmdldFgoKSwgLXRoaXMuY2VudGVyLmdldFkoKSkpXHJcbiAgICAvLyAgICAgICAgIC5tdWx0aXBseVBvaW50KHAxKTtcclxuICAgIC8vICAgICB0aGlzLmFycmF5T2ZQb2ludHNbaV0gPSByb3RhdGVkUG9pbnQ7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgdGhpcy5hcnJheU9mUG9pbnRzWzFdID0gVHJhbnNmb3JtYXRpb24udHJhbnNsYXRpb24oeENlbnRlciwgeUNlbnRlcilcclxuICAgICAgLm11bHRpcGx5TWF0cml4KFRyYW5zZm9ybWF0aW9uLnJvdGF0aW9uKDAuNSAqIE1hdGguUEkpKVxyXG4gICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24udHJhbnNsYXRpb24oLXhDZW50ZXIsIC15Q2VudGVyKSlcclxuICAgICAgLm11bHRpcGx5UG9pbnQodGhpcy5hcnJheU9mUG9pbnRzWzBdKTtcclxuXHJcbiAgICB0aGlzLmFycmF5T2ZQb2ludHNbMl0gPSBUcmFuc2Zvcm1hdGlvbi50cmFuc2xhdGlvbih4Q2VudGVyLCB5Q2VudGVyKVxyXG4gICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24ucm90YXRpb24oTWF0aC5QSSkpXHJcbiAgICAgIC5tdWx0aXBseU1hdHJpeChUcmFuc2Zvcm1hdGlvbi50cmFuc2xhdGlvbigteENlbnRlciwgLXlDZW50ZXIpKVxyXG4gICAgICAubXVsdGlwbHlQb2ludCh0aGlzLmFycmF5T2ZQb2ludHNbMF0pO1xyXG5cclxuICAgIHRoaXMuYXJyYXlPZlBvaW50c1szXSA9IFRyYW5zZm9ybWF0aW9uLnRyYW5zbGF0aW9uKHhDZW50ZXIsIHlDZW50ZXIpXHJcbiAgICAgIC5tdWx0aXBseU1hdHJpeChUcmFuc2Zvcm1hdGlvbi5yb3RhdGlvbigxLjUgKiBNYXRoLlBJKSlcclxuICAgICAgLm11bHRpcGx5TWF0cml4KFRyYW5zZm9ybWF0aW9uLnRyYW5zbGF0aW9uKC14Q2VudGVyLCAteUNlbnRlcikpXHJcbiAgICAgIC5tdWx0aXBseVBvaW50KHRoaXMuYXJyYXlPZlBvaW50c1swXSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZ2V0TnVtYmVyT2ZWZXJ0aWNlc1RvQmVEcmF3bigpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIDU7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYWRkUG9zaXRpb24oZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCk6IHZvaWQge1xyXG4gICAgZ2wuYnVmZmVyRGF0YShcclxuICAgICAgZ2wuQVJSQVlfQlVGRkVSLFxyXG4gICAgICBuZXcgRmxvYXQzMkFycmF5KFtcclxuICAgICAgICAuLi50aGlzLmFycmF5T2ZQb2ludHNbMF0uZ2V0UGFpcigpLFxyXG4gICAgICAgIC4uLnRoaXMuYXJyYXlPZlBvaW50c1sxXS5nZXRQYWlyKCksXHJcbiAgICAgICAgLi4udGhpcy5hcnJheU9mUG9pbnRzWzJdLmdldFBhaXIoKSxcclxuICAgICAgICAuLi50aGlzLmFycmF5T2ZQb2ludHNbM10uZ2V0UGFpcigpLFxyXG4gICAgICAgIC4uLnRoaXMuYXJyYXlPZlBvaW50c1swXS5nZXRQYWlyKCksXHJcbiAgICAgIF0pLFxyXG4gICAgICBnbC5TVEFUSUNfRFJBV1xyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhZGRDb2xvcihnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0KTogdm9pZCB7XHJcbiAgICBnbC5idWZmZXJEYXRhKFxyXG4gICAgICBnbC5BUlJBWV9CVUZGRVIsXHJcbiAgICAgIG5ldyBGbG9hdDMyQXJyYXkoW1xyXG4gICAgICAgIC4uLnRoaXMuYXJyYXlPZlBvaW50c1swXS5nZXRDb2xvcigpLFxyXG4gICAgICAgIC4uLnRoaXMuYXJyYXlPZlBvaW50c1sxXS5nZXRDb2xvcigpLFxyXG4gICAgICAgIC4uLnRoaXMuYXJyYXlPZlBvaW50c1syXS5nZXRDb2xvcigpLFxyXG4gICAgICAgIC4uLnRoaXMuYXJyYXlPZlBvaW50c1szXS5nZXRDb2xvcigpLFxyXG4gICAgICAgIC4uLnRoaXMuYXJyYXlPZlBvaW50c1swXS5nZXRDb2xvcigpLFxyXG4gICAgICBdKSxcclxuICAgICAgZ2wuU1RBVElDX0RSQVdcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc2V0U3F1YXJlQXR0cmlidXRlcyhcclxuICAgIHR4OiBudW1iZXIsXHJcbiAgICB0eTogbnVtYmVyLFxyXG4gICAgZGVncmVlOiBudW1iZXIsXHJcbiAgICBzeDogbnVtYmVyLFxyXG4gICAgc3k6IG51bWJlcixcclxuICAgIGt4OiBudW1iZXIsXHJcbiAgICBreTogbnVtYmVyLFxyXG4gICAgYXJyYXlPZlBvaW50czogUG9pbnRbXVxyXG4gICk6IHZvaWQge1xyXG4gICAgdGhpcy5hcnJheU9mUG9pbnRzID0gYXJyYXlPZlBvaW50cztcclxuICAgIHRoaXMudHggPSB0eDtcclxuICAgIHRoaXMudHkgPSB0eTtcclxuICAgIHRoaXMuZGVncmVlID0gZGVncmVlO1xyXG4gICAgdGhpcy5zeCA9IHN4O1xyXG4gICAgdGhpcy5zeSA9IHN5O1xyXG4gICAgdGhpcy5reCA9IGt4O1xyXG4gICAgdGhpcy5reSA9IGt5O1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgU3F1YXJlO1xyXG4iLCJlbnVtIFR5cGUge1xyXG4gICAgTGluZSxcclxuICAgIFJlY3RhbmdsZSxcclxuICAgIFNxdWFyZSxcclxuICAgIFBvbHlnb25cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVHlwZTsiLCJjbGFzcyBDb29yZGluYXRlIHtcclxuICAgIHB1YmxpYyB4OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgeTogbnVtYmVyO1xyXG4gICAgcHVibGljIHc6IG51bWJlcjtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoeDogbnVtYmVyLCB5OiBudW1iZXIsIHc6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgdGhpcy55ID0geTtcclxuICAgICAgICB0aGlzLncgPSB3O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRDb29yZGluYXRlKCk6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSB7XHJcbiAgICAgICAgcmV0dXJuIFt0aGlzLngsIHRoaXMueSwgdGhpcy53XTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0Q29vcmRpbmF0ZSh4OiBudW1iZXIsIHk6IG51bWJlciwgdzogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICB0aGlzLnkgPSB5O1xyXG4gICAgICAgIHRoaXMudyA9IHc7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldFgoeDogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0WSh5OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnkgPSB5O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRXKHc6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMudyA9IHc7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1YmxpYyBnZXRYKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMueDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0WSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFcoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy53O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBDb29yZGluYXRlOyIsImltcG9ydCBQb2ludCBmcm9tICdCYXNlL3BvaW50JztcclxuXHJcbmNsYXNzIE1hdHJpeCB7XHJcbiAgICBwdWJsaWMgbTE6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXTtcclxuICAgIHB1YmxpYyBtMjogW251bWJlciwgbnVtYmVyLCBudW1iZXJdO1xyXG4gICAgcHVibGljIG0zOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl07XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKG0xOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl0sIG0yOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl0sIG0zOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl0pIHtcclxuICAgICAgICB0aGlzLm0xID0gbTE7XHJcbiAgICAgICAgdGhpcy5tMiA9IG0yO1xyXG4gICAgICAgIHRoaXMubTMgPSBtMztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZmxhdHRlbigpIDogbnVtYmVyW10ge1xyXG4gICAgICAgIHJldHVybiBbLi4udGhpcy5tMSwgLi4udGhpcy5tMiwgLi4udGhpcy5tM11cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbXVsdGlwbHlNYXRyaXgob3RoZXJNYXRyaXg6IE1hdHJpeCk6IE1hdHJpeCB7XHJcbiAgICAgICAgY29uc3QgW2ExMSwgYTIxLCBhMzFdID0gb3RoZXJNYXRyaXgubTE7XHJcbiAgICAgICAgY29uc3QgW2ExMiwgYTIyLCBhMzJdID0gb3RoZXJNYXRyaXgubTI7XHJcbiAgICAgICAgY29uc3QgW2ExMywgYTIzLCBhMzNdID0gb3RoZXJNYXRyaXgubTM7XHJcblxyXG4gICAgICAgIGNvbnN0IFtiMTEsIGIxMiwgYjEzXSA9IHRoaXMubTE7XHJcbiAgICAgICAgY29uc3QgW2IyMSwgYjIyLCBiMjNdID0gdGhpcy5tMjtcclxuICAgICAgICBjb25zdCBbYjMxLCBiMzIsIGIzM10gPSB0aGlzLm0zO1xyXG5cclxuICAgICAgICBjb25zdCBjMTEgPSBiMTEgKiBhMTEgKyBiMjEgKiBhMjEgKyBiMzEgKiBhMzFcclxuICAgICAgICBjb25zdCBjMTIgPSBiMTEgKiBhMTIgKyBiMjEgKiBhMjIgKyBiMzEgKiBhMzJcclxuICAgICAgICBjb25zdCBjMTMgPSBiMTEgKiBhMTMgKyBiMjEgKiBhMjMgKyBiMzEgKiBhMzNcclxuICAgICAgICBjb25zdCBjMjEgPSBiMTIgKiBhMTEgKyBiMjIgKiBhMjEgKyBiMzIgKiBhMzFcclxuICAgICAgICBjb25zdCBjMjIgPSBiMTIgKiBhMTIgKyBiMjIgKiBhMjIgKyBiMzIgKiBhMzJcclxuICAgICAgICBjb25zdCBjMjMgPSBiMTIgKiBhMTMgKyBiMjIgKiBhMjMgKyBiMzIgKiBhMzNcclxuICAgICAgICBjb25zdCBjMzEgPSBiMTMgKiBhMTEgKyBiMjMgKiBhMjEgKyBiMzMgKiBhMzFcclxuICAgICAgICBjb25zdCBjMzIgPSBiMTMgKiBhMTIgKyBiMjMgKiBhMjIgKyBiMzMgKiBhMzJcclxuICAgICAgICBjb25zdCBjMzMgPSBiMTMgKiBhMTMgKyBiMjMgKiBhMjMgKyBiMzMgKiBhMzNcclxuXHJcbiAgICAgICAgY29uc3QgbWF0cml4ID0gbmV3IE1hdHJpeChbYzExLCBjMjEsIGMzMV0sIFtjMTIsIGMyMiwgYzMyXSwgW2MxMywgYzIzLCBjMzNdKTtcclxuICAgICAgICByZXR1cm4gbWF0cml4O1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBwdWJsaWMgbXVsdGlwbHlQb2ludChwb2ludDogUG9pbnQpOiBQb2ludCB7XHJcbiAgICAgICAgY29uc3QgW2ExMSwgYTIxLCBhMzFdID0gdGhpcy5tMTtcclxuICAgICAgICBjb25zdCBbYTEyLCBhMjIsIGEzMl0gPSB0aGlzLm0yO1xyXG4gICAgICAgIGNvbnN0IFthMTMsIGEyMywgYTMzXSA9IHRoaXMubTM7XHJcblxyXG4gICAgICAgIGNvbnN0IHgxID0gYTExICogcG9pbnQueCArIGExMiAqIHBvaW50LnkgKyBhMTMgKiBwb2ludC53O1xyXG4gICAgICAgIGNvbnN0IHkxID0gYTIxICogcG9pbnQueCArIGEyMiAqIHBvaW50LnkgKyBhMjMgKiBwb2ludC53O1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IG5ld1BvaW50ID0gbmV3IFBvaW50KFt4MSwgeTFdKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ld1BvaW50O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBNYXRyaXg7IiwiaW1wb3J0IENvb3JkaW5hdGUgZnJvbSBcIkJhc2UvY29vcmRpbmF0ZVwiO1xyXG5cclxuY2xhc3MgUG9pbnQgIGV4dGVuZHMgQ29vcmRpbmF0ZSB7XHJcbiAgICBwdWJsaWMgcjogbnVtYmVyO1xyXG4gICAgcHVibGljIGc6IG51bWJlcjtcclxuICAgIHB1YmxpYyBiOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgYTogbnVtYmVyO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcihwb3NpdGlvbjogW251bWJlciwgbnVtYmVyXSwgY29sb3I6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdID0gWzAsIDAsIDAsIDFdKSB7XHJcbiAgICAgICAgc3VwZXIoLi4ucG9zaXRpb24sIDEpO1xyXG5cclxuICAgICAgICBbdGhpcy5yLCB0aGlzLmcsIHRoaXMuYiwgdGhpcy5hXSA9IGNvbG9yO1xyXG5cclxuICAgICAgICBjb25zdCBbciwgZywgYiwgYV0gPSBjb2xvcjtcclxuICAgICAgICB0aGlzLnIgPSByO1xyXG4gICAgICAgIHRoaXMuZyA9IGc7XHJcbiAgICAgICAgdGhpcy5iID0gYjtcclxuICAgICAgICB0aGlzLmEgPSBhO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRQYWlyKCk6IFtudW1iZXIsIG51bWJlcl0ge1xyXG4gICAgICAgIHJldHVybiBbdGhpcy54LCB0aGlzLnldO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRDb2xvcigpOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSB7XHJcbiAgICAgICAgcmV0dXJuIFt0aGlzLnIsIHRoaXMuZywgdGhpcy5iLCB0aGlzLmFdO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRDb2xvcihjb2xvcjogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0pOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBbciwgZywgYiwgYV0gPSBjb2xvcjtcclxuICAgICAgICB0aGlzLnIgPSByO1xyXG4gICAgICAgIHRoaXMuZyA9IGc7XHJcbiAgICAgICAgdGhpcy5iID0gYjtcclxuICAgICAgICB0aGlzLmEgPSBhO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBQb2ludDsiLCJpbXBvcnQgeyBsb2FkU2hhZGVyIH0gZnJvbSBcIkZ1bmN0aW9ucy9sb2FkLXNoYWRlclwiO1xyXG5cclxuLy9cclxuLy8gSW5pdGlhbGl6ZSBhIHNoYWRlciBwcm9ncmFtLCBzbyBXZWJHTCBrbm93cyBob3cgdG8gZHJhdyBvdXIgZGF0YVxyXG4vL1xyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlU2hhZGVyUHJvZ3JhbShnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LCB2c1NvdXJjZTogc3RyaW5nLCBmc1NvdXJjZTogc3RyaW5nKSB7XHJcbiAgICBjb25zdCB2ZXJ0ZXhTaGFkZXIgPSBsb2FkU2hhZGVyKGdsLCBnbC5WRVJURVhfU0hBREVSLCB2c1NvdXJjZSk7XHJcbiAgICBjb25zdCBmcmFnbWVudFNoYWRlciA9IGxvYWRTaGFkZXIoZ2wsIGdsLkZSQUdNRU5UX1NIQURFUiwgZnNTb3VyY2UpO1xyXG4gIFxyXG4gICAgLy8gQ3JlYXRlIHRoZSBzaGFkZXIgcHJvZ3JhbVxyXG4gICAgY29uc3Qgc2hhZGVyUHJvZ3JhbSA9IGdsLmNyZWF0ZVByb2dyYW0oKTtcclxuICAgIGdsLmF0dGFjaFNoYWRlcihzaGFkZXJQcm9ncmFtLCB2ZXJ0ZXhTaGFkZXIpO1xyXG4gICAgZ2wuYXR0YWNoU2hhZGVyKHNoYWRlclByb2dyYW0sIGZyYWdtZW50U2hhZGVyKTtcclxuICAgIGdsLmxpbmtQcm9ncmFtKHNoYWRlclByb2dyYW0pO1xyXG4gIFxyXG4gICAgLy8gSWYgY3JlYXRpbmcgdGhlIHNoYWRlciBwcm9ncmFtIGZhaWxlZCwgYWxlcnRcclxuICBcclxuICAgIGlmICghZ2wuZ2V0UHJvZ3JhbVBhcmFtZXRlcihzaGFkZXJQcm9ncmFtLCBnbC5MSU5LX1NUQVRVUykpIHtcclxuICAgICAgYWxlcnQoXHJcbiAgICAgICAgYFVuYWJsZSB0byBpbml0aWFsaXplIHRoZSBzaGFkZXIgcHJvZ3JhbTogJHtnbC5nZXRQcm9ncmFtSW5mb0xvZyhcclxuICAgICAgICAgIHNoYWRlclByb2dyYW0sXHJcbiAgICAgICAgKX1gLFxyXG4gICAgICApO1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIHJldHVybiBzaGFkZXJQcm9ncmFtO1xyXG4gIH0iLCIgIC8vXHJcbiAgLy8gY3JlYXRlcyBhIHNoYWRlciBvZiB0aGUgZ2l2ZW4gdHlwZSwgdXBsb2FkcyB0aGUgc291cmNlIGFuZFxyXG4gIC8vIGNvbXBpbGVzIGl0LlxyXG4gIC8vXHJcbmV4cG9ydCBmdW5jdGlvbiBsb2FkU2hhZGVyKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsIHR5cGU6IG51bWJlciwgc291cmNlOiBzdHJpbmcpOiBXZWJHTFNoYWRlciB7XHJcbiAgICBjb25zdCBzaGFkZXIgPSBnbC5jcmVhdGVTaGFkZXIodHlwZSk7XHJcbiAgXHJcbiAgICAvLyBTZW5kIHRoZSBzb3VyY2UgdG8gdGhlIHNoYWRlciBvYmplY3RcclxuICAgIGdsLnNoYWRlclNvdXJjZShzaGFkZXIsIHNvdXJjZSk7XHJcbiAgXHJcbiAgICAvLyBDb21waWxlIHRoZSBzaGFkZXIgcHJvZ3JhbVxyXG4gICAgZ2wuY29tcGlsZVNoYWRlcihzaGFkZXIpO1xyXG4gIFxyXG4gICAgLy8gU2VlIGlmIGl0IGNvbXBpbGVkIHN1Y2Nlc3NmdWxseVxyXG4gICAgaWYgKCFnbC5nZXRTaGFkZXJQYXJhbWV0ZXIoc2hhZGVyLCBnbC5DT01QSUxFX1NUQVRVUykpIHtcclxuICAgICAgYWxlcnQoYEFuIGVycm9yIG9jY3VycmVkIGNvbXBpbGluZyB0aGUgc2hhZGVyczogJHtnbC5nZXRTaGFkZXJJbmZvTG9nKHNoYWRlcil9YCwpO1xyXG4gICAgICBnbC5kZWxldGVTaGFkZXIoc2hhZGVyKTtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gc2hhZGVyO1xyXG59IiwiaW1wb3J0IHsgcmVuZGVyIH0gZnJvbSBcIkZ1bmN0aW9ucy9yZW5kZXJcIjtcclxuaW1wb3J0IFByb2dyYW1JbmZvIGZyb20gXCJGdW5jdGlvbnMvcHJvZ3JhbS1pbmZvLmludGVyZmFjZVwiO1xyXG5pbXBvcnQgUmVuZGVyYWJsZSBmcm9tIFwiSW50ZXJmYWNlcy9yZW5kZXJhYmxlLmludGVyZmFjZVwiO1xyXG5pbXBvcnQgVHJhbnNmb3JtYWJsZSBmcm9tIFwiSW50ZXJmYWNlcy90cmFuc2Zvcm1hYmxlLmludGVyZmFjZVwiO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlckFsbChnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LCBwcm9ncmFtSW5mbzogUHJvZ3JhbUluZm8sIHNoYXBlczogKFJlbmRlcmFibGUmVHJhbnNmb3JtYWJsZSlbXSwgcG9zaXRpb25CdWZmZXI6IFdlYkdMQnVmZmVyLCBjb2xvckJ1ZmZlcjogV2ViR0xCdWZmZXIpOiB2b2lkIHtcclxuICAgIGdsLmNsZWFyKGdsLkNPTE9SX0JVRkZFUl9CSVQpO1xyXG4gIFxyXG4gICAgZm9yIChjb25zdCBzaGFwZSBvZiBzaGFwZXMpIHtcclxuICAgICAgcmVuZGVyKGdsLCBwcm9ncmFtSW5mbywgc2hhcGUsIHBvc2l0aW9uQnVmZmVyLCBjb2xvckJ1ZmZlcilcclxuICAgIH1cclxufTsiLCJpbXBvcnQgUmVuZGVyYWJsZSBmcm9tIFwiSW50ZXJmYWNlcy9yZW5kZXJhYmxlLmludGVyZmFjZVwiO1xyXG5pbXBvcnQgUHJvZ3JhbUluZm8gZnJvbSBcIkZ1bmN0aW9ucy9wcm9ncmFtLWluZm8uaW50ZXJmYWNlXCI7XHJcbmltcG9ydCBUcmFuc2Zvcm1hYmxlIGZyb20gXCJJbnRlcmZhY2VzL3RyYW5zZm9ybWFibGUuaW50ZXJmYWNlXCI7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsIHByb2dyYW1JbmZvOiBQcm9ncmFtSW5mbywgb2JqZWN0OiBSZW5kZXJhYmxlICYgVHJhbnNmb3JtYWJsZSwgcG9zaXRpb25CdWZmZXI6IFdlYkdMQnVmZmVyLCBjb2xvckJ1ZmZlcjogV2ViR0xCdWZmZXIpOiB2b2lkIHtcclxuICAgIGlmICghb2JqZWN0LmlzRHJhd2FibGUoKSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICAvLyBBZGQgUG9zaXRpb24gdG8gZ2wgYnVmZmVyXHJcbiAgICBnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheShwcm9ncmFtSW5mby5hdHRyaWJMb2NhdGlvbnMudmVydGV4UG9zaXRpb24pO1xyXG4gICAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHBvc2l0aW9uQnVmZmVyKTtcclxuICAgIG9iamVjdC5hZGRQb3NpdGlvbihnbCk7XHJcbiAgICBjb25zdCBudW1Db21wb25lbnRzID0gMjsgLy8gcHVsbCBvdXQgMiB2YWx1ZXMgcGVyIGl0ZXJhdGlvblxyXG4gICAgY29uc3QgdHlwZSA9IGdsLkZMT0FUOyAvLyB0aGUgZGF0YSBpbiB0aGUgYnVmZmVyIGlzIDMyYml0IGZsb2F0c1xyXG4gICAgY29uc3Qgbm9ybWFsaXplID0gZmFsc2U7IC8vIGRvbid0IG5vcm1hbGl6ZVxyXG4gICAgY29uc3Qgc3RyaWRlID0gMDsgLy8gaG93IG1hbnkgYnl0ZXMgdG8gZ2V0IGZyb20gb25lIHNldCBvZiB2YWx1ZXMgdG8gdGhlIG5leHRcclxuICAgIC8vIDAgPSB1c2UgdHlwZSBhbmQgbnVtQ29tcG9uZW50cyBhYm92ZVxyXG4gICAgY29uc3Qgb2Zmc2V0ID0gMDsgLy8gaG93IG1hbnkgYnl0ZXMgaW5zaWRlIHRoZSBidWZmZXIgdG8gc3RhcnQgZnJvbVxyXG4gICAgZ2wudmVydGV4QXR0cmliUG9pbnRlcihcclxuICAgICAgcHJvZ3JhbUluZm8uYXR0cmliTG9jYXRpb25zLnZlcnRleFBvc2l0aW9uLFxyXG4gICAgICBudW1Db21wb25lbnRzLFxyXG4gICAgICB0eXBlLFxyXG4gICAgICBub3JtYWxpemUsXHJcbiAgICAgIHN0cmlkZSxcclxuICAgICAgb2Zmc2V0LFxyXG4gICAgKTtcclxuXHJcbiAgICBcclxuICAgIGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KHByb2dyYW1JbmZvLmF0dHJpYkxvY2F0aW9ucy52ZXJ0ZXhDb2xvcik7XHJcbiAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgY29sb3JCdWZmZXIpO1xyXG4gICAgb2JqZWN0LmFkZENvbG9yKGdsKTtcclxuICAgIGNvbnN0IGNvbG9yU2l6ZSA9IDQ7IC8qIDQgY29tcG9uZW50cyBwZXIgaXRlcmF0aW9uICovXHJcbiAgICBjb25zdCBjb2xvclR5cGUgPSBnbC5GTE9BVDsgLyogVGhlIGRhdGEgaXMgMzIgYml0IGZsb2F0ICovXHJcbiAgICBjb25zdCBjb2xvck5vcm1hbGl6ZWQgPSBmYWxzZTsgLyogRG9uJ3Qgbm9ybWFsaXplIHRoZSBkYXRhICovXHJcbiAgICBjb25zdCBjb2xvclN0cmlkZSA9IDA7IC8qIDA6IE1vdmUgZm9yd2FyZCBzaXplICogc2l6ZW9mKHR5cGUpIGVhY2ggaXRlcmF0aW9uIHRvIGdldCB0aGUgbmV4dCBwb3NpdGlvbiAqL1xyXG4gICAgY29uc3QgY29sb3JPZmZzZXQgPSAwOyAvKiBTdGFydCBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSBidWZmZXIgKi9cclxuICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIoXHJcbiAgICAgIHByb2dyYW1JbmZvLmF0dHJpYkxvY2F0aW9ucy52ZXJ0ZXhDb2xvcixcclxuICAgICAgY29sb3JTaXplLFxyXG4gICAgICBjb2xvclR5cGUsXHJcbiAgICAgIGNvbG9yTm9ybWFsaXplZCxcclxuICAgICAgY29sb3JTdHJpZGUsXHJcbiAgICAgIGNvbG9yT2Zmc2V0XHJcbiAgICApO1xyXG4gICAgXHJcbiAgICBcclxuICAgIC8vIEFkZCBNYXRyaXggdG8gZ2xcclxuICAgIGNvbnN0IG1hdHJpeExvY2F0aW9uID0gcHJvZ3JhbUluZm8udW5pZm9ybUxvY2F0aW9ucy5tYXRyaXhMb2NhdGlvblxyXG4gICAgb2JqZWN0LmFkZE1hdHJpeChnbCwgbWF0cml4TG9jYXRpb24pO1xyXG4gICAgLyogRHJhdyBzY2VuZSAqL1xyXG4gICAgY29uc3QgcHJpbWl0aXZlVHlwZSA9IG9iamVjdC5kcmF3TWV0aG9kKGdsKTtcclxuICAgIC8vIGNvbnN0IG9mZnNldCA9IDA7XHJcbiAgICBjb25zdCBudW1iZXJPZlZlcnRpY2VzVG9CZURyYXduID0gb2JqZWN0LmdldE51bWJlck9mVmVydGljZXNUb0JlRHJhd24oKTtcclxuICAgIGdsLmRyYXdBcnJheXMocHJpbWl0aXZlVHlwZSwgb2Zmc2V0LCBudW1iZXJPZlZlcnRpY2VzVG9CZURyYXduKTtcclxufSIsImltcG9ydCBNYXRyaXggZnJvbSBcIkJhc2UvbWF0cml4XCI7XHJcbmltcG9ydCBQb2ludCBmcm9tIFwiQmFzZS9wb2ludFwiO1xyXG5cclxuXHJcbmNsYXNzIFRyYW5zZm9ybWF0aW9ue1xyXG4gICAgcHVibGljIHN0YXRpYyBwcm9qZWN0aW9uKHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyKTogTWF0cml4IHtcclxuICAgICAgICBjb25zdCBtYXRyaXggPSBuZXcgTWF0cml4KFsyL3dpZHRoLCAwLCAwXSwgWzAsIC0yL2hlaWdodCwgMF0sIFstMSwgMSwgMV0pO1xyXG4gICAgICAgIHJldHVybiBtYXRyaXg7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc3RhdGljIHRyYW5zbGF0aW9uKHR4OiBudW1iZXIsIHR5OiBudW1iZXIpOiBNYXRyaXgge1xyXG4gICAgICAgIGNvbnN0IG1hdHJpeCA9IG5ldyBNYXRyaXgoWzEsMCwwXSwgWzAsIDEsIDBdLCBbdHgsIHR5LCAxXSk7XHJcbiAgICAgICAgcmV0dXJuIG1hdHJpeDtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzdGF0aWMgcm90YXRpb24oZGVncmVlOiBudW1iZXIpOiBNYXRyaXgge1xyXG4gICAgICAgIGNvbnN0IG1hdHJpeCA9IG5ldyBNYXRyaXgoW01hdGguY29zKGRlZ3JlZSksIE1hdGguc2luKGRlZ3JlZSksIDBdLCBbLU1hdGguc2luKGRlZ3JlZSksIE1hdGguY29zKGRlZ3JlZSksIDBdLCBbMCwgMCwgMV0pO1xyXG4gICAgICAgIHJldHVybiBtYXRyaXg7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc3RhdGljIHNjYWxlKHN4OiBudW1iZXIsIHN5OiBudW1iZXIpOiBNYXRyaXgge1xyXG4gICAgICAgIGNvbnN0IG1hdHJpeCA9IG5ldyBNYXRyaXgoW3N4LDAsMF0sIFswLCBzeSwgMF0sIFswLCAwLCAxXSk7XHJcbiAgICAgICAgcmV0dXJuIG1hdHJpeFxyXG4gICAgfVxyXG4gICAgcHVibGljIHN0YXRpYyBzaGVhclgoa3g6IG51bWJlcik6IE1hdHJpeCB7XHJcbiAgICAgICAgY29uc3QgbWF0cml4ID0gbmV3IE1hdHJpeChbMSwgMCwgMF0sIFtreCwgMSwgMF0sIFswLCAwLCAxXSk7XHJcbiAgICAgICAgcmV0dXJuIG1hdHJpeDtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzdGF0aWMgc2hlYXJZKGt5OiBudW1iZXIpOiBNYXRyaXgge1xyXG4gICAgICAgIGNvbnN0IG1hdHJpeCA9IG5ldyBNYXRyaXgoWzEsIGt5LCAwXSwgWzAsIDEsIDBdLCBbMCwgMCwgMV0pO1xyXG4gICAgICAgIHJldHVybiBtYXRyaXg7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc3RhdGljIHRyYW5zZm9ybWF0aW9uTWF0cml4KFxyXG4gICAgICAgIHdpZHRoOiBudW1iZXIsXHJcbiAgICAgICAgaGVpZ2h0OiBudW1iZXIsXHJcbiAgICAgICAgdHg6IG51bWJlcixcclxuICAgICAgICB0eTogbnVtYmVyLFxyXG4gICAgICAgIGRlZ3JlZTogbnVtYmVyLFxyXG4gICAgICAgIHN4OiBudW1iZXIsXHJcbiAgICAgICAgc3k6IG51bWJlcixcclxuICAgICAgICBreDogbnVtYmVyLFxyXG4gICAgICAgIGt5OiBudW1iZXIsXHJcbiAgICAgICAgY2VudGVyOiBQb2ludFxyXG4gICAgKSA6IE1hdHJpeCB7XHJcbiAgICAgICAgcmV0dXJuIFRyYW5zZm9ybWF0aW9uLnByb2plY3Rpb24od2lkdGgsIGhlaWdodClcclxuICAgICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24udHJhbnNsYXRpb24odHgsIHR5KSlcclxuICAgICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24udHJhbnNsYXRpb24oY2VudGVyLmdldFgoKSwgY2VudGVyLmdldFkoKSkpXHJcbiAgICAgICAgLm11bHRpcGx5TWF0cml4KFRyYW5zZm9ybWF0aW9uLnJvdGF0aW9uKGRlZ3JlZSkpXHJcbiAgICAgICAgLm11bHRpcGx5TWF0cml4KFRyYW5zZm9ybWF0aW9uLnNjYWxlKHN4LCBzeSkpXHJcbiAgICAgICAgLm11bHRpcGx5TWF0cml4KFRyYW5zZm9ybWF0aW9uLnNoZWFyWChreCkpXHJcbiAgICAgICAgLm11bHRpcGx5TWF0cml4KFRyYW5zZm9ybWF0aW9uLnNoZWFyWShreSkpXHJcbiAgICAgICAgLm11bHRpcGx5TWF0cml4KFRyYW5zZm9ybWF0aW9uLnRyYW5zbGF0aW9uKC1jZW50ZXIuZ2V0WCgpLCAtY2VudGVyLmdldFkoKSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgaW52ZXJzZVRyYW5zZm9ybWF0aW9uTWF0cml4KFxyXG4gICAgICAgIHdpZHRoOiBudW1iZXIsXHJcbiAgICAgICAgaGVpZ2h0OiBudW1iZXIsXHJcbiAgICAgICAgdHg6IG51bWJlcixcclxuICAgICAgICB0eTogbnVtYmVyLFxyXG4gICAgICAgIGRlZ3JlZTogbnVtYmVyLFxyXG4gICAgICAgIHN4OiBudW1iZXIsXHJcbiAgICAgICAgc3k6IG51bWJlcixcclxuICAgICAgICBreDogbnVtYmVyLFxyXG4gICAgICAgIGt5OiBudW1iZXIsXHJcbiAgICAgICAgY2VudGVyOiBQb2ludFxyXG4gICAgKSA6IE1hdHJpeCB7XHJcbiAgICAgICAgcmV0dXJuIFRyYW5zZm9ybWF0aW9uLnRyYW5zbGF0aW9uKGNlbnRlci5nZXRYKCksIGNlbnRlci5nZXRZKCkpXHJcbiAgICAgICAgLm11bHRpcGx5TWF0cml4KFRyYW5zZm9ybWF0aW9uLnNoZWFyWSgta3kpKVxyXG4gICAgICAgIC5tdWx0aXBseU1hdHJpeChUcmFuc2Zvcm1hdGlvbi5zaGVhclgoLWt4KSlcclxuICAgICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24uc2NhbGUoMSAvIHN4LCAxIC8gc3kpKVxyXG4gICAgICAgIC5tdWx0aXBseU1hdHJpeChUcmFuc2Zvcm1hdGlvbi5yb3RhdGlvbigtZGVncmVlKSlcclxuICAgICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24udHJhbnNsYXRpb24oLWNlbnRlci5nZXRYKCksIC1jZW50ZXIuZ2V0WSgpKSlcclxuICAgICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24udHJhbnNsYXRpb24oLXR4LCAtdHkpKVxyXG4gICAgICAgIC8vIC5tdWx0aXBseU1hdHJpeChUcmFuc2Zvcm1hdGlvbi5wcm9qZWN0aW9uKDEgLyB3aWR0aCwgMSAvIGhlaWdodCkpO1xyXG4gICAgfVxyXG5cclxufVxyXG5leHBvcnQgZGVmYXVsdCBUcmFuc2Zvcm1hdGlvbjsiLCJpbXBvcnQgUG9pbnQgZnJvbSBcIkJhc2UvcG9pbnRcIlxyXG5cclxuZnVuY3Rpb24gb3JpZW50YXRpb24ocDogUG9pbnQsIHE6IFBvaW50LCByOiBQb2ludCk6IG51bWJlciB7XHJcbiAgICBjb25zdCB2YWwgPSAocS55IC0gcC55KSAqIChyLnggLSBxLngpIC0gKHEueCAtIHAueCkgKiAoci55IC0gcS55KTtcclxuXHJcbiAgICBpZiAodmFsID09PSAwKSByZXR1cm4gMDtcclxuXHJcbiAgICByZXR1cm4gdmFsID4gMCA/IDEgOiAyO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjb252ZXhIdWxsKHBvaW50czogUG9pbnRbXSk6IFBvaW50W10ge1xyXG4gICAgY29uc3QgbiA9IHBvaW50cy5sZW5ndGg7XHJcbiAgICBpZiAobiA8IDMpIHJldHVybiBbXTtcclxuXHJcbiAgICBjb25zdCBodWxsOiBQb2ludFtdID0gW107XHJcbiAgICBsZXQgbCA9IDA7XHJcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IG47IGkrKykge1xyXG4gICAgICAgIGlmIChwb2ludHNbaV0ueCA8IHBvaW50c1tsXS54KSB7XHJcbiAgICAgICAgICAgIGwgPSBpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBsZXQgcCA9IGw7XHJcbiAgICBsZXQgcTogbnVtYmVyO1xyXG4gICAgZG8ge1xyXG4gICAgICAgIGh1bGwucHVzaChwb2ludHNbcF0pO1xyXG4gICAgICAgIHEgPSAocCArIDEpICUgbjtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICBpZiAob3JpZW50YXRpb24ocG9pbnRzW3BdLCBwb2ludHNbaV0sIHBvaW50c1txXSkgPT09IDIpIHtcclxuICAgICAgICAgICAgICAgIHEgPSBpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHAgPSBxO1xyXG4gICAgfSB3aGlsZSAocCAhPT0gbCk7XHJcblxyXG4gICAgcmV0dXJuIGh1bGw7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNvbnZleEh1bGw7XHJcblxyXG4iLCJmdW5jdGlvbiByZ2JUb0hleChyZ2JhIDogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0pIHtcclxuICAgIGNvbnN0IGhleFIgPSAocmdiYVswXSAqIDI1NSkudG9TdHJpbmcoMTYpLnBhZFN0YXJ0KDIsICcwJyk7XHJcbiAgICBjb25zdCBoZXhHID0gKHJnYmFbMV0gKiAyNTUpLnRvU3RyaW5nKDE2KS5wYWRTdGFydCgyLCAnMCcpO1xyXG4gICAgY29uc3QgaGV4QiA9IChyZ2JhWzJdICogMjU1KS50b1N0cmluZygxNikucGFkU3RhcnQoMiwgJzAnKTtcclxuXHJcbiAgICAvLyBDb25jYXRlbmF0ZSB0aGUgaGV4YWRlY2ltYWwgY29tcG9uZW50c1xyXG4gICAgY29uc3QgaGV4Q29sb3IgPSBgIyR7aGV4Un0ke2hleEd9JHtoZXhCfWA7XHJcblxyXG4gICAgcmV0dXJuIGhleENvbG9yO1xyXG59XHJcbiAgXHJcbmZ1bmN0aW9uIGhleFRvUmdiKGhleDogc3RyaW5nKTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0ge1xyXG4gICAgY29uc3QgciA9IHBhcnNlSW50KGhleC5zbGljZSgxLCAzKSwgMTYpO1xyXG4gICAgY29uc3QgZyA9IHBhcnNlSW50KGhleC5zbGljZSgzLCA1KSwgMTYpO1xyXG4gICAgY29uc3QgYiA9IHBhcnNlSW50KGhleC5zbGljZSg1LCA3KSwgMTYpO1xyXG4gIFxyXG4gICAgcmV0dXJuIFtyIC8gMjU1LCBnIC8gMjU1LCBiIC8gMjU1LCAxXTtcclxufVxyXG4gIFxyXG5leHBvcnQgeyByZ2JUb0hleCwgaGV4VG9SZ2IgfTtcclxuICAiLCJpbXBvcnQgUmVuZGVyYWJsZSBmcm9tIFwiSW50ZXJmYWNlcy9yZW5kZXJhYmxlLmludGVyZmFjZVwiO1xyXG5pbXBvcnQgVHJhbnNmb3JtYWJsZSBmcm9tIFwiSW50ZXJmYWNlcy90cmFuc2Zvcm1hYmxlLmludGVyZmFjZVwiO1xyXG5pbXBvcnQgU2hhcGUgZnJvbSBcIlNoYXBlcy9zaGFwZVwiO1xyXG5pbXBvcnQgTGluZSBmcm9tIFwiU2hhcGVzL2xpbmVcIjtcclxuaW1wb3J0IFNxdWFyZSBmcm9tIFwiU2hhcGVzL3NxdWFyZVwiO1xyXG5pbXBvcnQgUmVjdGFuZ2xlIGZyb20gXCJTaGFwZXMvcmVjdGFuZ2xlXCI7XHJcbmltcG9ydCBQb2ludCBmcm9tIFwiQmFzZS9wb2ludFwiO1xyXG5pbXBvcnQgUG9seWdvbiBmcm9tIFwiU2hhcGVzL3BvbHlnb25cIjtcclxuaW1wb3J0IFR5cGUgZnJvbSBcIlNoYXBlcy90eXBlLmVudW1cIjtcclxuaW1wb3J0IHsgY3JlYXRlU2hhZGVyUHJvZ3JhbSB9IGZyb20gXCJGdW5jdGlvbnMvY3JlYXRlLXNoYWRlci1wcm9ncmFtXCI7XHJcbmltcG9ydCBQcm9ncmFtSW5mbyBmcm9tIFwiRnVuY3Rpb25zL3Byb2dyYW0taW5mby5pbnRlcmZhY2VcIjtcclxuaW1wb3J0IHsgc2V0QXR0cmlidXRlcyB9IGZyb20gXCIuL0Z1bmN0aW9ucy9zZXQtYXR0cmlidXRlc1wiO1xyXG5pbXBvcnQgeyBzZXR1cENhbnZhcyB9IGZyb20gXCIuL0Z1bmN0aW9ucy9zZXR1cC1jYW52YXNcIjtcclxuaW1wb3J0IFRyYW5zZm9ybWF0aW9uIGZyb20gXCJPcGVyYXRpb25zL1RyYW5zZm9ybWF0aW9uXCI7XHJcbmltcG9ydCB7IGhleFRvUmdiLCByZ2JUb0hleCB9IGZyb20gXCJVdGlscy90b29sc1wiO1xyXG5pbXBvcnQgeyByZW5kZXIgfSBmcm9tIFwiRnVuY3Rpb25zL3JlbmRlclwiO1xyXG5pbXBvcnQgeyByZW5kZXJBbGwgfSBmcm9tIFwiRnVuY3Rpb25zL3JlbmRlci1hbGxcIjtcclxuXHJcbmNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY2FudmFzXCIpIGFzIEhUTUxDYW52YXNFbGVtZW50O1xyXG4vLyBJbml0aWFsaXplIHRoZSBHTCBjb250ZXh0XHJcbmNvbnN0IGdsID0gY2FudmFzLmdldENvbnRleHQoXCJ3ZWJnbFwiKTtcclxuXHJcbi8vIE9ubHkgY29udGludWUgaWYgV2ViR0wgaXMgYXZhaWxhYmxlIGFuZCB3b3JraW5nXHJcbmlmIChnbCA9PT0gbnVsbCkge1xyXG4gIGFsZXJ0KFxyXG4gICAgXCJVbmFibGUgdG8gaW5pdGlhbGl6ZSBXZWJHTC4gWW91ciBicm93c2VyIG9yIG1hY2hpbmUgbWF5IG5vdCBzdXBwb3J0IGl0LlwiXHJcbiAgKTtcclxufVxyXG5cclxuXHJcbi8vIFZlcnRleCBzaGFkZXIgcHJvZ3JhbVxyXG5jb25zdCB2c1NvdXJjZSA9IGBcclxuICAgIGF0dHJpYnV0ZSB2ZWMyIGFWZXJ0ZXhQb3NpdGlvbjtcclxuICAgIGF0dHJpYnV0ZSB2ZWM0IGFWZXJ0ZXhDb2xvcjtcclxuICAgIHVuaWZvcm0gbWF0MyB1TWF0cml4O1xyXG4gICAgdmFyeWluZyB2ZWM0IHZDb2xvcjtcclxuXHJcbiAgICB2b2lkIG1haW4oKSB7XHJcbiAgICAgICAgLy8gbm90ZTogWSBheGlzIG11c3QgYmUgaW52ZXJ0ZWQgdG8gcmVwbGljYXRlIHRyYWRpdGlvbmFsIHZpZXdcclxuICAgICAgICBnbF9Qb3NpdGlvbiA9IHZlYzQoKHVNYXRyaXggKiB2ZWMzKGFWZXJ0ZXhQb3NpdGlvbiwgMSkpLnh5LCAwLCAxKTtcclxuXHJcbiAgICAgICAgLy8gQ2hhbmdlIGNvbG9yIG9mIHNoYXBlXHJcbiAgICAgICAgdkNvbG9yID0gYVZlcnRleENvbG9yO1xyXG4gICAgfVxyXG5gO1xyXG5cclxuY29uc3QgZnNTb3VyY2UgPSBgXHJcbiAgICBwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcclxuICAgIHZhcnlpbmcgdmVjNCB2Q29sb3I7XHJcblxyXG4gICAgdm9pZCBtYWluKCkge1xyXG4gICAgICAgIGdsX0ZyYWdDb2xvciA9IHZDb2xvcjtcclxuICAgIH1cclxuYDtcclxuY29uc3Qgc2hhZGVyUHJvZ3JhbSA9IGNyZWF0ZVNoYWRlclByb2dyYW0oZ2wsIHZzU291cmNlLCBmc1NvdXJjZSk7XHJcblxyXG4vLyBDb2xsZWN0IGFsbCB0aGUgaW5mbyBuZWVkZWQgdG8gdXNlIHRoZSBzaGFkZXIgcHJvZ3JhbS5cclxuLy8gTG9vayB1cCB3aGljaCBhdHRyaWJ1dGUgb3VyIHNoYWRlciBwcm9ncmFtIGlzIHVzaW5nXHJcbi8vIGZvciBhVmVydGV4UG9zaXRpb24gYW5kIGxvb2sgdXAgdW5pZm9ybSBsb2NhdGlvbnMuXHJcbmNvbnN0IHByb2dyYW1JbmZvID0ge1xyXG4gIHByb2dyYW06IHNoYWRlclByb2dyYW0sXHJcbiAgYXR0cmliTG9jYXRpb25zOiB7XHJcbiAgICB2ZXJ0ZXhQb3NpdGlvbjogZ2wuZ2V0QXR0cmliTG9jYXRpb24oc2hhZGVyUHJvZ3JhbSwgXCJhVmVydGV4UG9zaXRpb25cIiksXHJcbiAgICB2ZXJ0ZXhDb2xvcjogZ2wuZ2V0QXR0cmliTG9jYXRpb24oc2hhZGVyUHJvZ3JhbSwgXCJhVmVydGV4Q29sb3JcIiksXHJcbiAgfSxcclxuICB1bmlmb3JtTG9jYXRpb25zOiB7XHJcbiAgICBtYXRyaXhMb2NhdGlvbjogZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHNoYWRlclByb2dyYW0sIFwidU1hdHJpeFwiKSxcclxuICB9LFxyXG59O1xyXG5cclxuLy8gVGVsbCBXZWJHTCB0byB1c2Ugb3VyIHByb2dyYW0gd2hlbiBkcmF3aW5nXHJcbmdsLnVzZVByb2dyYW0oc2hhZGVyUHJvZ3JhbSk7XHJcblxyXG5jb25zdCB3aWR0aCA9IChnbC5jYW52YXMgYXMgSFRNTENhbnZhc0VsZW1lbnQpLmNsaWVudFdpZHRoO1xyXG5jb25zdCBoZWlnaHQgPSAoZ2wuY2FudmFzIGFzIEhUTUxDYW52YXNFbGVtZW50KS5jbGllbnRIZWlnaHQ7XHJcbmNhbnZhcy53aWR0aCA9IHdpZHRoO1xyXG5jYW52YXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG4vLyBTZXQgY2xlYXIgY29sb3IgdG8gYmxhY2ssIGZ1bGx5IG9wYXF1ZVxyXG5nbC5jbGVhckNvbG9yKDEuMCwgMS4wLCAxLjAsIDEuMCk7XHJcbi8vIENsZWFyIHRoZSBjb2xvciBidWZmZXIgd2l0aCBzcGVjaWZpZWQgY2xlYXIgY29sb3JcclxuXHJcblxyXG5nbC52aWV3cG9ydCgwLCAwLCBnbC5jYW52YXMud2lkdGgsIGdsLmNhbnZhcy5oZWlnaHQpOyAvLyBzZXRzIHRoZSB2aWV3cG9ydCB0byBjb3ZlciB0aGUgZW50aXJlIGNhbnZhcywgc3RhcnRpbmcgZnJvbSB0aGUgbG93ZXItbGVmdCBjb3JuZXIgYW5kIGV4dGVuZGluZyB0byB0aGUgY2FudmFzJ3Mgd2lkdGggYW5kIGhlaWdodC5cclxuXHJcbi8vIENsZWFyIHRoZSBjYW52YXMgYmVmb3JlIHdlIHN0YXJ0IGRyYXdpbmcgb24gaXQuXHJcbmdsLmNsZWFyKGdsLkNPTE9SX0JVRkZFUl9CSVQpO1xyXG5cclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gY29uc3QgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYW52YXNcIikgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XHJcbmxldCBzaGFwZXM6IChTaGFwZSAmIFJlbmRlcmFibGUgJiBUcmFuc2Zvcm1hYmxlKVtdID0gW107XHJcbmxldCB0eXBlOiBUeXBlO1xyXG5sZXQgaXNEcmF3aW5nID0gZmFsc2U7XHJcblxyXG4vKiBTZXR1cCBWaWV3cG9ydCAqL1xyXG5cclxuY29uc3QgcG9zaXRpb25CdWZmZXIgPSBnbC5jcmVhdGVCdWZmZXIoKTtcclxuY29uc3QgY29sb3JCdWZmZXIgPSBnbC5jcmVhdGVCdWZmZXIoKTtcclxuLy8gZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHBvc2l0aW9uQnVmZmVyKTtcclxuLy8gZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIGNvbG9yQnVmZmVyKTtcclxuLy8gc2V0QXR0cmlidXRlcyhnbCwgcG9zaXRpb25CdWZmZXIsIGNvbG9yQnVmZmVyLCBwcm9ncmFtSW5mbyk7XHJcblxyXG5sZXQgY3VycmVudE9iamVjdDogU2hhcGUgJiBSZW5kZXJhYmxlICYgVHJhbnNmb3JtYWJsZTtcclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vIEZpeCBIVE1MIEVsZW1lbnRzIEV2ZW50IExpc3RlbmVyc1xyXG5cclxuLyogTGlzdCBvZiBTaGFwZXMgTGlzdGVuZXIgKi9cclxuY29uc3QgbGlzdE9mU2hhcGVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsaXN0LW9mLXNoYXBlc1wiKSBhcyBIVE1MU2VsZWN0RWxlbWVudDtcclxubGlzdE9mU2hhcGVzLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKCkgPT4ge1xyXG4gIHJlbmRlckFsbChnbCwgcHJvZ3JhbUluZm8sIHNoYXBlcywgcG9zaXRpb25CdWZmZXIsIGNvbG9yQnVmZmVyKTtcclxuICBjb25zdCBpbmRleDogbnVtYmVyID0gK2xpc3RPZlNoYXBlcy5zZWxlY3RlZE9wdGlvbnNbMF0udmFsdWU7XHJcbiAgaXNEcmF3aW5nID0gZmFsc2U7XHJcblxyXG4gIHNldHVwU2VsZWN0b3IoZ2wsIHByb2dyYW1JbmZvLCBzaGFwZXNbaW5kZXhdKTtcclxufSk7XHJcblxyXG4vKiBCdXR0b24gTGlzdGVuZXIgKi9cclxuY29uc3QgbGluZUJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibGluZS1idG5cIik7XHJcbmxpbmVCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICByZW5kZXJBbGwoZ2wsIHByb2dyYW1JbmZvLCBzaGFwZXMsIHBvc2l0aW9uQnVmZmVyLCBjb2xvckJ1ZmZlcik7XHJcbiAgdHlwZSA9IFR5cGUuTGluZTtcclxuICBpc0RyYXdpbmcgPSBmYWxzZTtcclxufSk7XHJcblxyXG5jb25zdCBzcXVhcmVCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNxdWFyZS1idG5cIik7XHJcbnNxdWFyZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gIHJlbmRlckFsbChnbCwgcHJvZ3JhbUluZm8sIHNoYXBlcywgcG9zaXRpb25CdWZmZXIsIGNvbG9yQnVmZmVyKTtcclxuICB0eXBlID0gVHlwZS5TcXVhcmU7XHJcbiAgaXNEcmF3aW5nID0gZmFsc2U7XHJcbn0pO1xyXG5cclxuY29uc3QgcmVjdGFuZ2xlQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZWN0YW5nbGUtYnRuXCIpO1xyXG5yZWN0YW5nbGVCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICByZW5kZXJBbGwoZ2wsIHByb2dyYW1JbmZvLCBzaGFwZXMsIHBvc2l0aW9uQnVmZmVyLCBjb2xvckJ1ZmZlcik7XHJcbiAgdHlwZSA9IFR5cGUuUmVjdGFuZ2xlO1xyXG4gIGlzRHJhd2luZyA9IGZhbHNlO1xyXG59KTtcclxuXHJcbmNvbnN0IHBvbHlnb25CdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBvbHlnb24tYnRuXCIpO1xyXG5wb2x5Z29uQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgcmVuZGVyQWxsKGdsLCBwcm9ncmFtSW5mbywgc2hhcGVzLCBwb3NpdGlvbkJ1ZmZlciwgY29sb3JCdWZmZXIpO1xyXG4gIHR5cGUgPSBUeXBlLlBvbHlnb247XHJcbiAgaXNEcmF3aW5nID0gZmFsc2U7XHJcbiAgLy8gaXNGaXJzdERyYXdpbmcgPSB0cnVlO1xyXG59KTtcclxuXHJcbmNvbnN0IHNhdmVCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNhdmUtYnRuXCIpO1xyXG5zYXZlQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgcmVuZGVyQWxsKGdsLCBwcm9ncmFtSW5mbywgc2hhcGVzLCBwb3NpdGlvbkJ1ZmZlciwgY29sb3JCdWZmZXIpO1xyXG4gIGNvbnN0IHRleHQgPSBzdG9yZVNoYXBlcyhzaGFwZXMpO1xyXG4gIGhhbmRsZURvd25sb2FkKHRleHQpO1xyXG59KTtcclxuXHJcbmNvbnN0IHVwbG9hZEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidXBsb2FkLWJ0blwiKTtcclxudXBsb2FkQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgaGFuZGxlVXBsb2FkKCh0ZXh0KSA9PiB7XHJcbiAgICBzaGFwZXMgPSBsb2FkU2hhcGUodGV4dCk7XHJcblxyXG4gICAgZm9yIChjb25zdCBzaGFwZSBvZiBzaGFwZXMpIHtcclxuICAgICAgc2V0dXBPcHRpb24odHJ1ZSwgc2hhcGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlckFsbChnbCwgcHJvZ3JhbUluZm8sIHNoYXBlcywgcG9zaXRpb25CdWZmZXIsIGNvbG9yQnVmZmVyKTtcclxuICB9KTtcclxufSk7XHJcblxyXG4vKiBDYW52YXMgTGlzdGVuZXIgKi9cclxuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgKGV2ZW50KSA9PiB7XHJcbiAgY29uc3QgeCA9IGV2ZW50LmNsaWVudFg7XHJcbiAgY29uc3QgeSA9IGV2ZW50LmNsaWVudFk7XHJcbiAgY29uc3QgcG9pbnQgPSBuZXcgUG9pbnQoW3gsIHldKTtcclxuXHJcbiAgaWYgKGlzRHJhd2luZykge1xyXG4gICAgaWYgKGN1cnJlbnRPYmplY3QudHlwZSAhPT0gVHlwZS5Qb2x5Z29uKSB7XHJcbiAgICAgIGN1cnJlbnRPYmplY3QuZHJhdyhwb2ludCk7XHJcbiAgICAgIHNldHVwT3B0aW9uKHRydWUsIGN1cnJlbnRPYmplY3QpO1xyXG4gICAgICBzaGFwZXMucHVzaChjdXJyZW50T2JqZWN0KTtcclxuICAgICAgaXNEcmF3aW5nID0gZmFsc2U7XHJcbiAgICAgIGN1cnJlbnRPYmplY3QgPSBudWxsO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKGN1cnJlbnRPYmplY3QuaWQgPT0gc2hhcGVzLmxlbmd0aCkge1xyXG4gICAgICAgIGN1cnJlbnRPYmplY3QuZHJhdyhwb2ludCk7XHJcbiAgICAgICAgLy8gYmVsdW0gZGlwdXNoIGtlIHNoYXBlc1xyXG4gICAgICAgIGlmIChjdXJyZW50T2JqZWN0LmFycmF5T2ZQb2ludHMubGVuZ3RoID49Mykge1xyXG4gICAgICAgICAgc2V0dXBPcHRpb24odHJ1ZSwgY3VycmVudE9iamVjdCk7XHJcbiAgICAgICAgICAvLyByZW5kZXIoZ2wsIHByb2dyYW1JbmZvLCBjdXJyZW50T2JqZWN0LCBwb3NpdGlvbkJ1ZmZlciwgY29sb3JCdWZmZXIpO1xyXG4gICAgICAgICAgc2hhcGVzLnB1c2goY3VycmVudE9iamVjdCk7XHJcbiAgICAgICAgICByZW5kZXJBbGwoZ2wsIHByb2dyYW1JbmZvLCBzaGFwZXMsIHBvc2l0aW9uQnVmZmVyLCBjb2xvckJ1ZmZlcik7XHJcbiAgICAgICAgICBpc0RyYXdpbmcgPSBmYWxzZTtcclxuICAgICAgICAgIGN1cnJlbnRPYmplY3QgPSBudWxsO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZW5kZXJBbGwoZ2wsIHByb2dyYW1JbmZvLCBzaGFwZXMsIHBvc2l0aW9uQnVmZmVyLCBjb2xvckJ1ZmZlcik7XHJcbiAgICAgICAgICByZW5kZXIoZ2wsIHByb2dyYW1JbmZvLCBjdXJyZW50T2JqZWN0LCBwb3NpdGlvbkJ1ZmZlciwgY29sb3JCdWZmZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zdCBtYXRyaXggPSBUcmFuc2Zvcm1hdGlvbi5pbnZlcnNlVHJhbnNmb3JtYXRpb25NYXRyaXgoXHJcbiAgICAgICAgICBnbC5jYW52YXMud2lkdGgsXHJcbiAgICAgICAgICBnbC5jYW52YXMuaGVpZ2h0LFxyXG4gICAgICAgICAgY3VycmVudE9iamVjdC50eCxcclxuICAgICAgICAgIGN1cnJlbnRPYmplY3QudHksXHJcbiAgICAgICAgICBjdXJyZW50T2JqZWN0LmRlZ3JlZSxcclxuICAgICAgICAgIGN1cnJlbnRPYmplY3Quc3gsXHJcbiAgICAgICAgICBjdXJyZW50T2JqZWN0LnN5LFxyXG4gICAgICAgICAgY3VycmVudE9iamVjdC5reCxcclxuICAgICAgICAgIGN1cnJlbnRPYmplY3Qua3ksXHJcbiAgICAgICAgICBjdXJyZW50T2JqZWN0LmNlbnRlclxyXG4gICAgICAgICk7XHJcbiAgICAgICAgY29uc3QgcG9pbnQyID0gbWF0cml4Lm11bHRpcGx5UG9pbnQocG9pbnQpO1xyXG4gICAgICAgIGN1cnJlbnRPYmplY3QuZHJhdyhwb2ludDIpO1xyXG4gICAgICAgIHNldHVwT3B0aW9uKGZhbHNlLCBjdXJyZW50T2JqZWN0KTtcclxuICAgICAgICAvLyByZW5kZXIoZ2wsIHByb2dyYW1JbmZvLCBjdXJyZW50T2JqZWN0LCBwb3NpdGlvbkJ1ZmZlciwgY29sb3JCdWZmZXIpO1xyXG4gICAgICAgIHJlbmRlckFsbChnbCwgcHJvZ3JhbUluZm8sIHNoYXBlcywgcG9zaXRpb25CdWZmZXIsIGNvbG9yQnVmZmVyKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgICAgY2FzZSBUeXBlLkxpbmU6XHJcbiAgICAgICAgY3VycmVudE9iamVjdCA9IG5ldyBMaW5lKHNoYXBlcy5sZW5ndGgsIHBvaW50KTtcclxuICAgICAgICBpc0RyYXdpbmcgPSB0cnVlO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFR5cGUuU3F1YXJlOlxyXG4gICAgICAgIGN1cnJlbnRPYmplY3QgPSBuZXcgU3F1YXJlKHNoYXBlcy5sZW5ndGgsIHBvaW50KTtcclxuICAgICAgICBpc0RyYXdpbmcgPSB0cnVlO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFR5cGUuUmVjdGFuZ2xlOlxyXG4gICAgICAgIGN1cnJlbnRPYmplY3QgPSBuZXcgUmVjdGFuZ2xlKHNoYXBlcy5sZW5ndGgsIHBvaW50KTtcclxuICAgICAgICBpc0RyYXdpbmcgPSB0cnVlO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFR5cGUuUG9seWdvbjpcclxuICAgICAgICBjdXJyZW50T2JqZWN0ID0gbmV3IFBvbHlnb24oc2hhcGVzLmxlbmd0aCwgcG9pbnQpO1xyXG4gICAgICAgIGlzRHJhd2luZyA9IHRydWU7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG59KTtcclxuXHJcbmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIChldmVudCkgPT4ge1xyXG4gIGlmIChpc0RyYXdpbmcgJiYgY3VycmVudE9iamVjdC50eXBlICE9PSBUeXBlLlBvbHlnb24pIHtcclxuICAgIGNvbnN0IHggPSBldmVudC5jbGllbnRYO1xyXG4gICAgY29uc3QgeSA9IGV2ZW50LmNsaWVudFk7XHJcbiAgICBjb25zdCBwb2ludCA9IG5ldyBQb2ludChbeCwgeV0pO1xyXG4gICAgY3VycmVudE9iamVjdC5kcmF3KHBvaW50KTtcclxuICAgIHJlbmRlckFsbChnbCwgcHJvZ3JhbUluZm8sIHNoYXBlcywgcG9zaXRpb25CdWZmZXIsIGNvbG9yQnVmZmVyKTtcclxuICAgIHJlbmRlcihnbCwgcHJvZ3JhbUluZm8sIGN1cnJlbnRPYmplY3QsIHBvc2l0aW9uQnVmZmVyLCBjb2xvckJ1ZmZlcik7XHJcbiAgfVxyXG59KTtcclxuXHJcbmZ1bmN0aW9uIHNldHVwT3B0aW9uKFxyXG4gIGlzRmlyc3REcmF3aW5nOiBib29sZWFuLFxyXG4gIGVsZW1lbnQ6IFJlbmRlcmFibGUgJiBUcmFuc2Zvcm1hYmxlICYgU2hhcGVcclxuKTogdm9pZCB7XHJcbiAgY29uc3Qgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKTtcclxuICBvcHRpb24udmFsdWUgPSBlbGVtZW50LmlkLnRvU3RyaW5nKCk7XHJcbiAgbGV0IG9wdGlvblRleHQ6IHN0cmluZztcclxuICBzd2l0Y2ggKGVsZW1lbnQudHlwZSkge1xyXG4gICAgY2FzZSBUeXBlLkxpbmU6XHJcbiAgICAgIG9wdGlvblRleHQgPSBgTGluZV8ke2VsZW1lbnQuaWR9YDtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIFR5cGUuU3F1YXJlOlxyXG4gICAgICBvcHRpb25UZXh0ID0gYFNxdWFyZV8ke2VsZW1lbnQuaWR9YDtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIFR5cGUuUmVjdGFuZ2xlOlxyXG4gICAgICBvcHRpb25UZXh0ID0gYFJlY3RhbmdsZV8ke2VsZW1lbnQuaWR9YDtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIFR5cGUuUG9seWdvbjpcclxuICAgICAgb3B0aW9uVGV4dCA9IGBQb2x5Z29uXyR7ZWxlbWVudC5pZH1gO1xyXG4gICAgICBicmVhaztcclxuICB9XHJcbiAgb3B0aW9uLnRleHQgPSBvcHRpb25UZXh0O1xyXG5cclxuICBpZiAoaXNGaXJzdERyYXdpbmcpIHtcclxuICAgIGNvbnN0IGxpc3RPZlNoYXBlcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICBcImxpc3Qtb2Ytc2hhcGVzXCJcclxuICAgICkgYXMgSFRNTFNlbGVjdEVsZW1lbnQ7XHJcbiAgICBsaXN0T2ZTaGFwZXMuYXBwZW5kQ2hpbGQob3B0aW9uKTtcclxuICAgIGxpc3RPZlNoYXBlcy52YWx1ZSA9IGVsZW1lbnQuaWQudG9TdHJpbmcoKTtcclxuICB9XHJcblxyXG4gIHNldHVwU2VsZWN0b3IoZ2wsIHByb2dyYW1JbmZvLCBlbGVtZW50KTtcclxufVxyXG5cclxuZnVuY3Rpb24gc2V0dXBTZWxlY3RvcihcclxuICBnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LFxyXG4gIHByb2dyYW1JbmZvOiBQcm9ncmFtSW5mbyxcclxuICBlbGVtZW50OiBSZW5kZXJhYmxlICYgVHJhbnNmb3JtYWJsZSAmIFNoYXBlXHJcbik6IHZvaWQge1xyXG4gIGNvbnN0IHNsaWRlclhfb3JpZ2luYWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNsaWRlclhcIikgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICBjb25zdCBzbGlkZXJYID0gc2xpZGVyWF9vcmlnaW5hbC5jbG9uZU5vZGUodHJ1ZSkgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICBzbGlkZXJYX29yaWdpbmFsLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHNsaWRlclgsIHNsaWRlclhfb3JpZ2luYWwpO1xyXG4gIHNsaWRlclgubWluID0gXCItNjAwXCI7XHJcbiAgc2xpZGVyWC5tYXggPSBcIjYwMFwiO1xyXG4gIHNsaWRlclgudmFsdWUgPSBlbGVtZW50LnR4LnRvU3RyaW5nKCk7XHJcbiAgc2xpZGVyWC5zdGVwID0gXCIxMFwiO1xyXG5cclxuICBzbGlkZXJYLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCAoZXZlbnQpID0+IHtcclxuICAgIGNvbnN0IGRlbHRhWCA9IChldmVudC50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWU7XHJcbiAgICBlbGVtZW50LnR4ID0gTnVtYmVyKGRlbHRhWCk7XHJcbiAgICByZW5kZXJBbGwoZ2wsIHByb2dyYW1JbmZvLCBzaGFwZXMsIHBvc2l0aW9uQnVmZmVyLCBjb2xvckJ1ZmZlcik7XHJcbiAgfSk7ICAgXHJcblxyXG4gIGNvbnN0IHNsaWRlcllfb3JpZ2luYWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNsaWRlcllcIikgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICBjb25zdCBzbGlkZXJZID0gc2xpZGVyWV9vcmlnaW5hbC5jbG9uZU5vZGUodHJ1ZSkgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICBzbGlkZXJZX29yaWdpbmFsLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHNsaWRlclksIHNsaWRlcllfb3JpZ2luYWwpO1xyXG4gIHNsaWRlclkubWluID0gXCItNjAwXCI7XHJcbiAgc2xpZGVyWS5tYXggPSBcIjYwMFwiO1xyXG4gIHNsaWRlclkudmFsdWUgPSAoLWVsZW1lbnQudHkpLnRvU3RyaW5nKCk7XHJcbiAgc2xpZGVyWS5zdGVwID0gXCIxMFwiO1xyXG4gIHNsaWRlclkuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIChldmVudCkgPT4ge1xyXG4gICAgY29uc3QgZGVsdGFZID0gKGV2ZW50LnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZTtcclxuICAgIGVsZW1lbnQudHkgPSAtTnVtYmVyKGRlbHRhWSk7XHJcbiAgICByZW5kZXJBbGwoZ2wsIHByb2dyYW1JbmZvLCBzaGFwZXMsIHBvc2l0aW9uQnVmZmVyLCBjb2xvckJ1ZmZlcik7XHJcbiAgfSk7XHJcblxyXG4gIGNvbnN0IHNsaWRlckxlbmd0aF9vcmlnaW5hbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgXCJzbGlkZXJMZW5ndGhcIlxyXG4gICkgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICBjb25zdCBzbGlkZXJMZW5ndGggPSBzbGlkZXJMZW5ndGhfb3JpZ2luYWwuY2xvbmVOb2RlKHRydWUpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgc2xpZGVyTGVuZ3RoX29yaWdpbmFsLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHNsaWRlckxlbmd0aCwgc2xpZGVyTGVuZ3RoX29yaWdpbmFsKTtcclxuICBzbGlkZXJMZW5ndGgubWluID0gXCIwXCI7XHJcbiAgc2xpZGVyTGVuZ3RoLm1heCA9IFwiNjAwXCI7XHJcbiAgbGV0IGxlbmd0aDogbnVtYmVyO1xyXG4gIGlmIChlbGVtZW50LnR5cGUgPT09IFR5cGUuUG9seWdvbikge1xyXG4gICAgbGV0IG1pbiA9IEluZmluaXR5O1xyXG4gICAgbGV0IG1heCA9IC1JbmZpbml0eTtcclxuXHJcbiAgICBmb3IgKGNvbnN0IHAgb2YgZWxlbWVudC5hcnJheU9mUG9pbnRzKSB7XHJcbiAgICAgIGNvbnN0IFtwWF0gPSBwLmdldFBhaXIoKTtcclxuICAgICAgaWYgKHBYIDwgbWluKSB7XHJcbiAgICAgICAgbWluID0gcFg7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHBYID4gbWF4KSB7XHJcbiAgICAgICAgbWF4ID0gcFg7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGxlbmd0aCA9IG1heCAtIG1pbjtcclxuICB9IGVsc2Uge1xyXG4gICAgbGVuZ3RoID0gTWF0aC5zcXJ0KFxyXG4gICAgICAoZWxlbWVudC5hcnJheU9mUG9pbnRzWzBdLnggLSBlbGVtZW50LmFycmF5T2ZQb2ludHNbMV0ueCkgKiogMiArXHJcbiAgICAgICAgKGVsZW1lbnQuYXJyYXlPZlBvaW50c1swXS55IC0gZWxlbWVudC5hcnJheU9mUG9pbnRzWzFdLnkpICoqIDJcclxuICAgICk7XHJcbiAgfVxyXG4gIHNsaWRlckxlbmd0aC52YWx1ZSA9ICgoZWxlbWVudC5zeCAtIDEpICogbGVuZ3RoKS50b1N0cmluZygpO1xyXG4gIHNsaWRlckxlbmd0aC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgKGV2ZW50KSA9PiB7XHJcbiAgICBjb25zdCBkZWx0YUxlbmd0aCA9IChldmVudC50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWU7XHJcbiAgICBlbGVtZW50LnN4ID0gMSArIE51bWJlcihkZWx0YUxlbmd0aCkgLyBsZW5ndGg7XHJcbiAgICBpZiAoZWxlbWVudC50eXBlID09IFR5cGUuU3F1YXJlKXtcclxuICAgICAgZWxlbWVudC5zeSA9IDEgKyBOdW1iZXIoZGVsdGFMZW5ndGgpIC8gbGVuZ3RoO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyQWxsKGdsLCBwcm9ncmFtSW5mbywgc2hhcGVzLCBwb3NpdGlvbkJ1ZmZlciwgY29sb3JCdWZmZXIpO1xyXG4gIH0pO1xyXG5cclxuICBjb25zdCBzbGlkZXJXaWR0aF9vcmlnaW5hbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgXCJzbGlkZXJXaWR0aFwiXHJcbiAgKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gIGNvbnN0IHNsaWRlcldpZHRoID0gc2xpZGVyV2lkdGhfb3JpZ2luYWwuY2xvbmVOb2RlKHRydWUpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgc2xpZGVyV2lkdGhfb3JpZ2luYWwucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQoc2xpZGVyV2lkdGgsIHNsaWRlcldpZHRoX29yaWdpbmFsKTtcclxuICBpZihlbGVtZW50LnR5cGUgPT0gVHlwZS5MaW5lIHx8IGVsZW1lbnQudHlwZSA9PSBUeXBlLlNxdWFyZSkge1xyXG4gICAgc2xpZGVyV2lkdGguZGlzYWJsZWQgPSB0cnVlO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBzbGlkZXJXaWR0aC5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gIH1cclxuICBzbGlkZXJXaWR0aC5taW4gPSBcIjBcIjtcclxuICBzbGlkZXJXaWR0aC5tYXggPSBcIjYwMFwiO1xyXG4gIGxldCB3aWR0aDogbnVtYmVyO1xyXG5cclxuICBpZiAoZWxlbWVudC50eXBlID09IFR5cGUuUmVjdGFuZ2xlIHx8IGVsZW1lbnQudHlwZSA9PSBUeXBlLlNxdWFyZSkge1xyXG4gICAgd2lkdGggPSBNYXRoLnNxcnQoXHJcbiAgICAgIChlbGVtZW50LmFycmF5T2ZQb2ludHNbMF0ueCAtIGVsZW1lbnQuYXJyYXlPZlBvaW50c1szXS54KSAqKiAyICtcclxuICAgICAgICAoZWxlbWVudC5hcnJheU9mUG9pbnRzWzBdLnkgLSBlbGVtZW50LmFycmF5T2ZQb2ludHNbM10ueSkgKiogMlxyXG4gICAgKTtcclxuICB9IGVsc2UgaWYgKGVsZW1lbnQudHlwZSA9PSBUeXBlLlBvbHlnb24pIHtcclxuICAgIGxldCBtaW4gPSBJbmZpbml0eTtcclxuICAgIGxldCBtYXggPSAtSW5maW5pdHk7XHJcblxyXG4gICAgZm9yIChjb25zdCBwIG9mIGVsZW1lbnQuYXJyYXlPZlBvaW50cykge1xyXG4gICAgICBjb25zdCBbLCBwWV0gPSBwLmdldFBhaXIoKTtcclxuICAgICAgaWYgKHBZIDwgbWluKSB7XHJcbiAgICAgICAgbWluID0gcFk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHBZID4gbWF4KSB7XHJcbiAgICAgICAgbWF4ID0gcFk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHdpZHRoID0gbWF4IC0gbWluO1xyXG4gIH0gXHJcbiAgc2xpZGVyV2lkdGgudmFsdWUgPSAoKGVsZW1lbnQuc3kgLSAxKSAqIHdpZHRoKS50b1N0cmluZygpO1xyXG4gIHNsaWRlcldpZHRoLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCAoZXZlbnQpID0+IHtcclxuICAgIGNvbnN0IGRlbHRhV2lkdGggPSAoZXZlbnQudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlO1xyXG4gICAgZWxlbWVudC5zeSA9IDEgKyBOdW1iZXIoZGVsdGFXaWR0aCkgLyB3aWR0aDtcclxuICAgIHJlbmRlckFsbChnbCwgcHJvZ3JhbUluZm8sIHNoYXBlcywgcG9zaXRpb25CdWZmZXIsIGNvbG9yQnVmZmVyKTtcclxuICB9KTtcclxuXHJcbiAgY29uc3Qgc2xpZGVyUm90YXRpb25fb3JpZ2luYWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgIFwic2xpZGVyUm90YXRpb25cIlxyXG4gICkgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICBjb25zdCBzbGlkZXJSb3RhdGlvbl92YWx1ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgXCJzbGlkZXItcm90YXRpb24tdmFsdWVcIlxyXG4gICkgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICBjb25zdCBzbGlkZXJSb3RhdGlvbiA9IHNsaWRlclJvdGF0aW9uX29yaWdpbmFsLmNsb25lTm9kZSh0cnVlKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gIHNsaWRlclJvdGF0aW9uX29yaWdpbmFsLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHNsaWRlclJvdGF0aW9uLCBzbGlkZXJSb3RhdGlvbl9vcmlnaW5hbCk7XHJcbiAgc2xpZGVyUm90YXRpb24ubWluID0gXCIwXCI7XHJcbiAgc2xpZGVyUm90YXRpb24ubWF4ID0gXCIzNjBcIjtcclxuICBzbGlkZXJSb3RhdGlvbi52YWx1ZSA9ICgoMTgwICogZWxlbWVudC5kZWdyZWUpIC8gTWF0aC5QSSkudG9TdHJpbmcoKTtcclxuICBzbGlkZXJSb3RhdGlvbl92YWx1ZS50ZXh0Q29udGVudCA9ICgoMTgwICogZWxlbWVudC5kZWdyZWUpIC8gTWF0aC5QSSkudG9GaXhlZCgwKS50b1N0cmluZygpOyBcclxuICBzbGlkZXJSb3RhdGlvbi5zdGVwID0gXCIxMFwiO1xyXG4gIHNsaWRlclJvdGF0aW9uLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCAoZXZlbnQpID0+IHtcclxuICAgIGNvbnN0IGRlbHRhRGVncmVlID0gKGV2ZW50LnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZTtcclxuICAgIGVsZW1lbnQuZGVncmVlID0gKE51bWJlcihkZWx0YURlZ3JlZSkgLyAxODApICogTWF0aC5QSTtcclxuICAgIHNsaWRlclJvdGF0aW9uX3ZhbHVlLnRleHRDb250ZW50ID0gKCgxODAgKiBlbGVtZW50LmRlZ3JlZSkgLyBNYXRoLlBJKS50b0ZpeGVkKDApLnRvU3RyaW5nKCk7IFxyXG4gICAgcmVuZGVyQWxsKGdsLCBwcm9ncmFtSW5mbywgc2hhcGVzLCBwb3NpdGlvbkJ1ZmZlciwgY29sb3JCdWZmZXIpO1xyXG4gIH0pO1xyXG5cclxuICBjb25zdCBzbGlkZXJTaGVhclhfb3JpZ2luYWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgIFwic2xpZGVyU2hlYXJYXCJcclxuICApIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgY29uc3Qgc2xpZGVyU2hlYXJYID0gc2xpZGVyU2hlYXJYX29yaWdpbmFsLmNsb25lTm9kZSh0cnVlKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gIHNsaWRlclNoZWFyWF9vcmlnaW5hbC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChzbGlkZXJTaGVhclgsIHNsaWRlclNoZWFyWF9vcmlnaW5hbCk7XHJcbiAgc2xpZGVyU2hlYXJYLm1pbiA9IFwiMFwiO1xyXG4gIHNsaWRlclNoZWFyWC5tYXggPSBcIjEwXCI7XHJcbiAgc2xpZGVyU2hlYXJYLnZhbHVlID0gZWxlbWVudC5reC50b1N0cmluZygpO1xyXG4gIHNsaWRlclNoZWFyWC5zdGVwID0gXCIwLjFcIjtcclxuXHJcbiAgc2xpZGVyU2hlYXJYLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCAoZXZlbnQpID0+IHtcclxuICAgIGNvbnN0IGRlbHRhU2hlYXJYID0gKGV2ZW50LnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZTtcclxuICAgIGVsZW1lbnQua3ggPSBOdW1iZXIoZGVsdGFTaGVhclgpO1xyXG4gICAgcmVuZGVyQWxsKGdsLCBwcm9ncmFtSW5mbywgc2hhcGVzLCBwb3NpdGlvbkJ1ZmZlciwgY29sb3JCdWZmZXIpO1xyXG4gIH0pO1xyXG5cclxuICBjb25zdCBzbGlkZXJTaGVhcllfb3JpZ2luYWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgIFwic2xpZGVyU2hlYXJZXCJcclxuICApIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgY29uc3Qgc2xpZGVyU2hlYXJZID0gc2xpZGVyU2hlYXJZX29yaWdpbmFsLmNsb25lTm9kZSh0cnVlKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gIHNsaWRlclNoZWFyWV9vcmlnaW5hbC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChzbGlkZXJTaGVhclksIHNsaWRlclNoZWFyWV9vcmlnaW5hbCk7XHJcbiAgc2xpZGVyU2hlYXJZLm1pbiA9IFwiMFwiO1xyXG4gIHNsaWRlclNoZWFyWS5tYXggPSBcIjEwXCI7XHJcbiAgc2xpZGVyU2hlYXJZLnZhbHVlID0gZWxlbWVudC5reS50b1N0cmluZygpO1xyXG4gIHNsaWRlclNoZWFyWS5zdGVwID0gXCIwLjFcIjtcclxuXHJcbiAgc2xpZGVyU2hlYXJZLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCAoZXZlbnQpID0+IHtcclxuICAgIGNvbnN0IGRlbHRhU2hlYXJZID0gKGV2ZW50LnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZTtcclxuICAgIGVsZW1lbnQua3kgPSBOdW1iZXIoZGVsdGFTaGVhclkpO1xyXG4gICAgcmVuZGVyQWxsKGdsLCBwcm9ncmFtSW5mbywgc2hhcGVzLCBwb3NpdGlvbkJ1ZmZlciwgY29sb3JCdWZmZXIpO1xyXG4gIH0pO1xyXG5cclxuICBjb25zdCBwb2ludFBpY2tlcl9vcmlnaW5hbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgXCJwb2ludFBpY2tlclwiXHJcbiAgKSBhcyBIVE1MU2VsZWN0RWxlbWVudDtcclxuICBjb25zdCBwb2ludFBpY2tlciA9IHBvaW50UGlja2VyX29yaWdpbmFsLmNsb25lTm9kZSh0cnVlKSBhcyBIVE1MU2VsZWN0RWxlbWVudDsgXHJcbiAgcG9pbnRQaWNrZXJfb3JpZ2luYWwucGFyZW50RWxlbWVudC5yZXBsYWNlQ2hpbGQocG9pbnRQaWNrZXIsIHBvaW50UGlja2VyX29yaWdpbmFsKTtcclxuICBwb2ludFBpY2tlci5pbm5lckhUTUwgPSBcIlwiO1xyXG4gIHBvaW50UGlja2VyLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKCkgPT4ge1xyXG4gICAgY29uc3QgcG9pbnRJbmRleDogbnVtYmVyID0gTnVtYmVyKHBvaW50UGlja2VyLnZhbHVlKTtcclxuICAgIHNldHVwQ29sb3JQaWNrZXIoZ2wsIHByb2dyYW1JbmZvLCBwb2ludEluZGV4LCBlbGVtZW50KTtcclxuICB9KTtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IGVsZW1lbnQuYXJyYXlPZlBvaW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgY29uc3QgbmV3UG9pbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xyXG4gICAgbmV3UG9pbnQudmFsdWUgPSBpLnRvU3RyaW5nKCk7XHJcbiAgICBuZXdQb2ludC50ZXh0ID0gXCJwb2ludF9cIiArIGk7XHJcbiAgICBwb2ludFBpY2tlci5hcHBlbmRDaGlsZChuZXdQb2ludCk7XHJcbiAgfVxyXG5cclxuICAvLyBJZiB0aGUgY3VycmVudE9iamVjdCBpcyBub3Qgb2YgdHlwZSBQb2x5Z29uLCByZW1vdmUgdGhlIGJ1dHRvblxyXG4gIGNvbnN0IGFkZFBvaW50QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidG4tYWRkLXBvaW50XCIpO1xyXG4gIGlmIChhZGRQb2ludEJ1dHRvbikge1xyXG4gICAgYWRkUG9pbnRCdXR0b24ucmVtb3ZlKCk7XHJcbiAgfVxyXG5cclxuICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIFBvbHlnb24pIHtcclxuICAgIGNvbnN0IGFkZFBvaW50QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcclxuICAgIGFkZFBvaW50QnV0dG9uLnRleHRDb250ZW50ID0gXCJBZGQgTmV3IFBvaW50XCI7XHJcbiAgICBhZGRQb2ludEJ1dHRvbi5jbGFzc05hbWUgPSBcImJ0biBidG4tcHJpbWFyeSBhZGQtYnRuXCI7XHJcbiAgICBhZGRQb2ludEJ1dHRvbi5pZCA9IFwiYnRuLWFkZC1wb2ludFwiO1xyXG4gICAgYWRkUG9pbnRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICAgICAgLy8gU2V0IGEgZmxhZyB0byBpbmRpY2F0ZSB0aGF0IGEgbmV3IHBvaW50IGlzIGJlaW5nIGFkZGVkXHJcbiAgICAgIGlzRHJhd2luZyA9IHRydWU7XHJcbiAgICAgIGN1cnJlbnRPYmplY3QgPSBzaGFwZXNbZWxlbWVudC5pZF1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vIEFwcGVuZCB0aGUgYnV0dG9uIHRvIHRoZSBET01cclxuICAgIGNvbnN0IHBvbHlnb25CdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBvbHlnb24tYnRuLXNlY3Rpb25cIik7XHJcbiAgICBpZiAocG9seWdvbkJ0bikge1xyXG4gICAgICBwb2x5Z29uQnRuLmFwcGVuZENoaWxkKGFkZFBvaW50QnV0dG9uKTtcclxuICAgIH1cclxuICB9IFxyXG4gIHNldHVwQ29sb3JQaWNrZXIoZ2wsIHByb2dyYW1JbmZvLCAwLCBlbGVtZW50KTtcclxufVxyXG5cclxuZnVuY3Rpb24gc2V0dXBDb2xvclBpY2tlcihcclxuICBnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LFxyXG4gIHByb2dyYW1JbmZvOiBQcm9ncmFtSW5mbyxcclxuICBwb2ludEluZGV4OiBudW1iZXIsXHJcbiAgZWxlbWVudDogUmVuZGVyYWJsZSAmIFRyYW5zZm9ybWFibGUgJiBTaGFwZVxyXG4pIHtcclxuICBjb25zdCBjb2xvclBpY2tlcl9vcmlnaW5hbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgXCJjb2xvclBpY2tlclwiXHJcbiAgKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gIGNvbnN0IGNvbG9yUGlja2VyID0gY29sb3JQaWNrZXJfb3JpZ2luYWwuY2xvbmVOb2RlKHRydWUpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgY29uc3QgY29sb3IgPSByZ2JUb0hleChlbGVtZW50LmFycmF5T2ZQb2ludHNbcG9pbnRJbmRleF0uZ2V0Q29sb3IoKSk7XHJcbiAgY29sb3JQaWNrZXIudmFsdWUgPSBjb2xvcjsgXHJcbiAgY29sb3JQaWNrZXJfb3JpZ2luYWwucGFyZW50RWxlbWVudC5yZXBsYWNlQ2hpbGQoY29sb3JQaWNrZXIsIGNvbG9yUGlja2VyX29yaWdpbmFsKTtcclxuXHJcbiAgY29sb3JQaWNrZXIuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoZXZlbnQpID0+IHtcclxuICAgIGNvbnN0IGhleCA9IChldmVudC50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWU7XHJcbiAgICBlbGVtZW50LmFycmF5T2ZQb2ludHNbcG9pbnRJbmRleF0uc2V0Q29sb3IoaGV4VG9SZ2IoaGV4KSk7XHJcbiAgICByZW5kZXJBbGwoZ2wsIHByb2dyYW1JbmZvLCBzaGFwZXMsIHBvc2l0aW9uQnVmZmVyLCBjb2xvckJ1ZmZlcik7XHJcbiAgfSk7XHJcblxyXG4gIGNvbnN0IGRlbGV0ZVBvaW50QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidG4tZGVsZXRlLXBvaW50XCIpO1xyXG4gIGlmIChkZWxldGVQb2ludEJ1dHRvbikge1xyXG4gICAgZGVsZXRlUG9pbnRCdXR0b24ucmVtb3ZlKCk7XHJcbiAgfVxyXG4gIGlmIChlbGVtZW50IGluc3RhbmNlb2YgUG9seWdvbikge1xyXG4gICAgY29uc3QgZGVsZXRlUG9pbnRCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xyXG4gICAgZGVsZXRlUG9pbnRCdXR0b24udGV4dENvbnRlbnQgPSBcIkRlbGV0ZSBQb2ludFwiO1xyXG4gICAgZGVsZXRlUG9pbnRCdXR0b24uY2xhc3NOYW1lID0gXCJidG4gYnRuLXByaW1hcnkgZGVsZXRlLWJ0blwiO1xyXG4gICAgZGVsZXRlUG9pbnRCdXR0b24uaWQgPSBcImJ0bi1kZWxldGUtcG9pbnRcIjtcclxuICAgIGRlbGV0ZVBvaW50QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgICAgIGVsZW1lbnQuZGVsZXRlUG9pbnQocG9pbnRJbmRleCk7XHJcbiAgICAgIHJlbmRlckFsbChnbCwgcHJvZ3JhbUluZm8sIHNoYXBlcywgcG9zaXRpb25CdWZmZXIsIGNvbG9yQnVmZmVyKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IHBvbHlnb25CdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBvbHlnb24tYnRuLXNlY3Rpb25cIik7XHJcbiAgICBpZiAocG9seWdvbkJ0bikge1xyXG4gICAgICBwb2x5Z29uQnRuLmFwcGVuZENoaWxkKGRlbGV0ZVBvaW50QnV0dG9uKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbi8vIGxvYWRzaGFwZSBmcm9tIGpzb24gdG8gYXJyYXkgb2Ygc2hhcGVcclxuZnVuY3Rpb24gbG9hZFNoYXBlKHRleHQ6IHN0cmluZyk6IChTaGFwZSAmIFJlbmRlcmFibGUgJiBUcmFuc2Zvcm1hYmxlKVtdIHtcclxuICBjb25zdCBzaGFwZTogKFNoYXBlICYgUmVuZGVyYWJsZSAmIFRyYW5zZm9ybWFibGUpW10gPSBbXTtcclxuICBjb25zdCBkYXRhID0gSlNPTi5wYXJzZSh0ZXh0KTtcclxuICBmb3IgKGNvbnN0IGl0ZW0gb2YgZGF0YSkge1xyXG4gICAgY29uc3QgdHggPSBpdGVtLnR4O1xyXG4gICAgY29uc3QgdHkgPSBpdGVtLnR5O1xyXG4gICAgY29uc3QgZGVncmVlID0gaXRlbS5kZWdyZWU7XHJcbiAgICBjb25zdCBzeCA9IGl0ZW0uc3g7XHJcbiAgICBjb25zdCBzeSA9IGl0ZW0uc3k7XHJcbiAgICBjb25zdCBreCA9IGl0ZW0ua3g7XHJcbiAgICBjb25zdCBreSA9IGl0ZW0ua3k7XHJcbiAgICBsZXQgYXJyYXlPZlBvaW50czogUG9pbnRbXSA9IFtdO1xyXG4gICAgZm9yIChjb25zdCBwb2ludCBvZiBpdGVtLmFycmF5T2ZQb2ludHMpIHtcclxuICAgICAgbGV0IHAgPSBuZXcgUG9pbnQoXHJcbiAgICAgICAgW3BvaW50LngsIHBvaW50LnldLFxyXG4gICAgICAgIFtwb2ludC5yLCBwb2ludC5nLCBwb2ludC5iLCBwb2ludC5hXVxyXG4gICAgICApO1xyXG4gICAgICBhcnJheU9mUG9pbnRzLnB1c2gocCk7XHJcbiAgICB9XHJcbiAgICBzd2l0Y2ggKGl0ZW0udHlwZSkge1xyXG4gICAgICBjYXNlIFR5cGUuTGluZTpcclxuICAgICAgICBjb25zdCBsaW5lID0gbmV3IExpbmUoaXRlbS5pZCwgYXJyYXlPZlBvaW50c1swXSk7XHJcbiAgICAgICAgbGluZS5zZXRMaW5lQXR0cmlidXRlcyhcclxuICAgICAgICAgIHR4LFxyXG4gICAgICAgICAgdHksXHJcbiAgICAgICAgICBkZWdyZWUsXHJcbiAgICAgICAgICBzeCxcclxuICAgICAgICAgIHN5LFxyXG4gICAgICAgICAga3gsXHJcbiAgICAgICAgICBreSxcclxuICAgICAgICAgIGFycmF5T2ZQb2ludHNbMV1cclxuICAgICAgICApO1xyXG4gICAgICAgIHNoYXBlLnB1c2gobGluZSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgVHlwZS5TcXVhcmU6XHJcbiAgICAgICAgY29uc3Qgc3F1YXJlID0gbmV3IFNxdWFyZShpdGVtLmlkLCBpdGVtLmNlbnRlcik7XHJcbiAgICAgICAgc3F1YXJlLnNldFNxdWFyZUF0dHJpYnV0ZXMoXHJcbiAgICAgICAgICB0eCxcclxuICAgICAgICAgIHR5LFxyXG4gICAgICAgICAgZGVncmVlLFxyXG4gICAgICAgICAgc3gsXHJcbiAgICAgICAgICBzeSxcclxuICAgICAgICAgIGt4LFxyXG4gICAgICAgICAga3ksXHJcbiAgICAgICAgICBhcnJheU9mUG9pbnRzXHJcbiAgICAgICAgKTtcclxuICAgICAgICBzaGFwZS5wdXNoKHNxdWFyZSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgVHlwZS5SZWN0YW5nbGU6XHJcbiAgICAgICAgY29uc3QgcmVjdGFuZ2xlID0gbmV3IFJlY3RhbmdsZShpdGVtLmlkLCBhcnJheU9mUG9pbnRzWzBdKTtcclxuICAgICAgICByZWN0YW5nbGUuc2V0UmVjdGFuZ2xlQXR0cmlidXRlcyhcclxuICAgICAgICAgIHR4LFxyXG4gICAgICAgICAgdHksXHJcbiAgICAgICAgICBkZWdyZWUsXHJcbiAgICAgICAgICBzeCxcclxuICAgICAgICAgIHN5LFxyXG4gICAgICAgICAga3gsXHJcbiAgICAgICAgICBreSxcclxuICAgICAgICAgIGFycmF5T2ZQb2ludHNcclxuICAgICAgICApO1xyXG4gICAgICAgIHNoYXBlLnB1c2gocmVjdGFuZ2xlKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBUeXBlLlBvbHlnb246XHJcbiAgICAgICAgY29uc3QgcG9seWdvbiA9IG5ldyBQb2x5Z29uKGl0ZW0uaWQsIGFycmF5T2ZQb2ludHNbMF0pO1xyXG4gICAgICAgIHBvbHlnb24uc2V0UG9seWdvbkF0dHJpYnV0ZXMoXHJcbiAgICAgICAgICB0eCxcclxuICAgICAgICAgIHR5LFxyXG4gICAgICAgICAgZGVncmVlLFxyXG4gICAgICAgICAgc3gsXHJcbiAgICAgICAgICBzeSxcclxuICAgICAgICAgIGt4LFxyXG4gICAgICAgICAga3ksXHJcbiAgICAgICAgICBhcnJheU9mUG9pbnRzXHJcbiAgICAgICAgKTtcclxuICAgICAgICBzaGFwZS5wdXNoKHBvbHlnb24pO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gc2hhcGU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHN0b3JlU2hhcGVzKHNoYXBlOiBTaGFwZVtdKTogc3RyaW5nIHtcclxuICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoc2hhcGUpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBoYW5kbGVEb3dubG9hZCh0ZXh0OiBzdHJpbmcpOiB2b2lkIHtcclxuICBjb25zdCBkYXRhID0gbmV3IEZpbGUoW3RleHRdLCBcInNoYXBlcy5qc29uXCIsIHsgdHlwZTogXCJhcHBsaWNhdGlvbi9qc29uXCIgfSk7XHJcblxyXG4gIGNvbnN0IHVybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoZGF0YSk7XHJcblxyXG4gIGNvbnN0IGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcclxuICBhLmhyZWYgPSB1cmw7XHJcbiAgYS5kb3dubG9hZCA9IGRhdGEubmFtZTtcclxuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGEpO1xyXG4gIGEuY2xpY2soKTtcclxuICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGEpO1xyXG4gIFVSTC5yZXZva2VPYmplY3RVUkwodXJsKTtcclxufVxyXG5cclxuZnVuY3Rpb24gaGFuZGxlVXBsb2FkKGNhbGxiYWNrOiAodGV4dDogc3RyaW5nKSA9PiB2b2lkKTogdm9pZCB7XHJcbiAgY29uc3QgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgaW5wdXQudHlwZSA9IFwiZmlsZVwiO1xyXG4gIGlucHV0LmFjY2VwdCA9IFwiYXBwbGljYXRpb24vanNvblwiO1xyXG5cclxuICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsICgpID0+IHtcclxuICAgIGNvbnN0IGZpbGUgPSBpbnB1dC5maWxlc1swXTtcclxuICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcblxyXG4gICAgcmVhZGVyLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgY2FsbGJhY2socmVhZGVyLnJlc3VsdCBhcyBzdHJpbmcpO1xyXG4gICAgfTtcclxuICAgIHJlYWRlci5yZWFkQXNUZXh0KGZpbGUpO1xyXG4gIH0pO1xyXG5cclxuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGlucHV0KTtcclxuICBpbnB1dC5jbGljaygpO1xyXG4gIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoaW5wdXQpO1xyXG59XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9pbmRleC50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==