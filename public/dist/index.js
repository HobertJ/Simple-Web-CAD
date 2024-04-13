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
        this.center = this.getCenter();
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
        this.center = this.getCenter();
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
    const listOfShapes = document.getElementById("list-of-shapes");
    while (listOfShapes.firstChild) {
        listOfShapes.removeChild(listOfShapes.firstChild);
    }
    for (const item of data) {
        const tx = item.tx;
        const ty = item.ty;
        const degree = item.degree;
        const sx = item.sx;
        const sy = item.sy;
        const kx = item.kx;
        const ky = item.ky;
        const center = new point_1.default([item.center.x, item.center.y]);
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
                const square = new square_1.default(item.id, center);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO1FBQzdDLE1BQU0sR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztRQUM3QyxNQUFNLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7UUFDN0MsTUFBTSxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO1FBQzdDLE1BQU0sR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztRQUU3QyxNQUFNLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzdFLE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFHTSxhQUFhLENBQUMsS0FBWTtRQUM3QixNQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDaEMsTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztRQUVoQyxNQUFNLEVBQUUsR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUN6RCxNQUFNLEVBQUUsR0FBRyxH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Q0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7O1VFdEJBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdHVnYXMtYmVzYXItZ3JhZmtvbS0xLXBhaW50Ly4vc3JjLzJELVNoYXBlcy9saW5lLnRzIiwid2VicGFjazovL3R1Z2FzLWJlc2FyLWdyYWZrb20tMS1wYWludC8uL3NyYy8yRC1TaGFwZXMvcG9seWdvbi50cyIsIndlYnBhY2s6Ly90dWdhcy1iZXNhci1ncmFma29tLTEtcGFpbnQvLi9zcmMvMkQtU2hhcGVzL3JlY3RhbmdsZS50cyIsIndlYnBhY2s6Ly90dWdhcy1iZXNhci1ncmFma29tLTEtcGFpbnQvLi9zcmMvMkQtU2hhcGVzL3NoYXBlLnRzIiwid2VicGFjazovL3R1Z2FzLWJlc2FyLWdyYWZrb20tMS1wYWludC8uL3NyYy8yRC1TaGFwZXMvc3F1YXJlLnRzIiwid2VicGFjazovL3R1Z2FzLWJlc2FyLWdyYWZrb20tMS1wYWludC8uL3NyYy8yRC1TaGFwZXMvdHlwZS5lbnVtLnRzIiwid2VicGFjazovL3R1Z2FzLWJlc2FyLWdyYWZrb20tMS1wYWludC8uL3NyYy9CYXNlL2Nvb3JkaW5hdGUudHMiLCJ3ZWJwYWNrOi8vdHVnYXMtYmVzYXItZ3JhZmtvbS0xLXBhaW50Ly4vc3JjL0Jhc2UvbWF0cml4LnRzIiwid2VicGFjazovL3R1Z2FzLWJlc2FyLWdyYWZrb20tMS1wYWludC8uL3NyYy9CYXNlL3BvaW50LnRzIiwid2VicGFjazovL3R1Z2FzLWJlc2FyLWdyYWZrb20tMS1wYWludC8uL3NyYy9GdW5jdGlvbnMvY3JlYXRlLXNoYWRlci1wcm9ncmFtLnRzIiwid2VicGFjazovL3R1Z2FzLWJlc2FyLWdyYWZrb20tMS1wYWludC8uL3NyYy9GdW5jdGlvbnMvbG9hZC1zaGFkZXIudHMiLCJ3ZWJwYWNrOi8vdHVnYXMtYmVzYXItZ3JhZmtvbS0xLXBhaW50Ly4vc3JjL0Z1bmN0aW9ucy9yZW5kZXItYWxsLnRzIiwid2VicGFjazovL3R1Z2FzLWJlc2FyLWdyYWZrb20tMS1wYWludC8uL3NyYy9GdW5jdGlvbnMvcmVuZGVyLnRzIiwid2VicGFjazovL3R1Z2FzLWJlc2FyLWdyYWZrb20tMS1wYWludC8uL3NyYy9PcGVyYXRpb25zL1RyYW5zZm9ybWF0aW9uLnRzIiwid2VicGFjazovL3R1Z2FzLWJlc2FyLWdyYWZrb20tMS1wYWludC8uL3NyYy9PcGVyYXRpb25zL2NvbnZleC1odWxsLnRzIiwid2VicGFjazovL3R1Z2FzLWJlc2FyLWdyYWZrb20tMS1wYWludC8uL3NyYy9VdGlscy90b29scy50cyIsIndlYnBhY2s6Ly90dWdhcy1iZXNhci1ncmFma29tLTEtcGFpbnQvLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vdHVnYXMtYmVzYXItZ3JhZmtvbS0xLXBhaW50L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3R1Z2FzLWJlc2FyLWdyYWZrb20tMS1wYWludC93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL3R1Z2FzLWJlc2FyLWdyYWZrb20tMS1wYWludC93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vdHVnYXMtYmVzYXItZ3JhZmtvbS0xLXBhaW50L3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVuZGVyYWJsZSBmcm9tIFwiSW50ZXJmYWNlcy9yZW5kZXJhYmxlLmludGVyZmFjZVwiO1xyXG5pbXBvcnQgVHJhbnNmb3JtYWJsZSBmcm9tIFwiSW50ZXJmYWNlcy90cmFuc2Zvcm1hYmxlLmludGVyZmFjZVwiO1xyXG5pbXBvcnQgU2hhcGUgZnJvbSBcIlNoYXBlcy9zaGFwZVwiO1xyXG5pbXBvcnQgVHlwZSBmcm9tIFwiU2hhcGVzL3R5cGUuZW51bVwiO1xyXG5pbXBvcnQgUG9pbnQgZnJvbSBcIkJhc2UvcG9pbnRcIjtcclxuaW1wb3J0IFRyYW5zZm9ybWF0aW9uIGZyb20gXCJPcGVyYXRpb25zL1RyYW5zZm9ybWF0aW9uXCI7XHJcblxyXG5jbGFzcyBMaW5lIGV4dGVuZHMgU2hhcGUgaW1wbGVtZW50cyBSZW5kZXJhYmxlLCBUcmFuc2Zvcm1hYmxlIHtcclxuXHJcbiAgICBwdWJsaWMgdHlwZTogVHlwZS5MaW5lO1xyXG4gICAgcHVibGljIGFycmF5T2ZQb2ludHM6IFBvaW50W107XHJcblxyXG4gICAgcHVibGljIGNlbnRlcjogUG9pbnQ7XHJcbiAgICBwdWJsaWMgdHg6IG51bWJlcjtcclxuICAgIHB1YmxpYyB0eTogbnVtYmVyO1xyXG4gICAgcHVibGljIGRlZ3JlZTogbnVtYmVyO1xyXG4gICAgcHVibGljIHN4OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgc3k6IG51bWJlcjtcclxuICAgIHB1YmxpYyBreDogbnVtYmVyO1xyXG4gICAgcHVibGljIGt5OiBudW1iZXI7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKGlkOiBudW1iZXIsIHAxOiBQb2ludCkge1xyXG4gICAgICAgIHN1cGVyKGlkLCAyLCBUeXBlLkxpbmUpO1xyXG4gICAgICAgIHRoaXMuYXJyYXlPZlBvaW50cyA9IFtwMV07XHJcbiAgICAgICAgdGhpcy50eCA9IDA7XHJcbiAgICAgICAgdGhpcy50eSA9IDA7XHJcbiAgICAgICAgdGhpcy5kZWdyZWUgPSAwO1xyXG4gICAgICAgIHRoaXMuc3ggPSAxO1xyXG4gICAgICAgIHRoaXMuc3kgPSAxO1xyXG4gICAgICAgIHRoaXMua3ggPSAwO1xyXG4gICAgICAgIHRoaXMua3kgPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFRyYW5zZm9ybWFibGUgTWV0aG9kc1xyXG4gICAgcHVibGljIGFkZE1hdHJpeChnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LCBtYXRyaXhMb2NhdGlvbjogV2ViR0xVbmlmb3JtTG9jYXRpb24pOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBtYXRyaXggPSBUcmFuc2Zvcm1hdGlvbi50cmFuc2Zvcm1hdGlvbk1hdHJpeChcclxuICAgICAgICAgICAgZ2wuY2FudmFzLndpZHRoLFxyXG4gICAgICAgICAgICBnbC5jYW52YXMuaGVpZ2h0LFxyXG4gICAgICAgICAgICB0aGlzLnR4LFxyXG4gICAgICAgICAgICB0aGlzLnR5LFxyXG4gICAgICAgICAgICB0aGlzLmRlZ3JlZSxcclxuICAgICAgICAgICAgdGhpcy5zeCxcclxuICAgICAgICAgICAgdGhpcy5zeSxcclxuICAgICAgICAgICAgdGhpcy5reCxcclxuICAgICAgICAgICAgdGhpcy5reSxcclxuICAgICAgICAgICAgdGhpcy5nZXRDZW50ZXIoKVxyXG4gICAgICAgICAgKS5mbGF0dGVuKCk7XHJcbiAgICAgIFxyXG4gICAgICAgICAgZ2wudW5pZm9ybU1hdHJpeDNmdihtYXRyaXhMb2NhdGlvbiwgZmFsc2UsIG1hdHJpeCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldENlbnRlcigpOiBQb2ludCB7XHJcbiAgICAgICAgY29uc3QgbnVtUG9pbnRzID0gdGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aDtcclxuICAgICAgICBsZXQgY2VudGVyWCA9IDA7XHJcbiAgICAgICAgbGV0IGNlbnRlclkgPSAwO1xyXG4gICAgICAgIGZvciAoY29uc3QgcG9pbnQgb2YgdGhpcy5hcnJheU9mUG9pbnRzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IFt4LCB5XSA9IHBvaW50LmdldFBhaXIoKTtcclxuICAgICAgICAgICAgY2VudGVyWCArPSB4O1xyXG4gICAgICAgICAgICBjZW50ZXJZICs9IHk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNlbnRlclggLz0gbnVtUG9pbnRzO1xyXG4gICAgICAgIGNlbnRlclkgLz0gbnVtUG9pbnRzO1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3IFBvaW50KFtjZW50ZXJYLCBjZW50ZXJZXSwgWzAsIDAsIDAsIDBdKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZHJhd01ldGhvZChnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0KTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gZ2wuTElORVM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGlzRHJhd2FibGUoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJyYXlPZlBvaW50cy5sZW5ndGggPT09IDI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRyYXcocG9pbnQ6IFBvaW50KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5hcnJheU9mUG9pbnRzWzFdID0gcG9pbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldE51bWJlck9mVmVydGljZXNUb0JlRHJhd24oKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gMjtcclxuICAgIH0gXHJcbiAgICBcclxuICAgIHB1YmxpYyBhZGRQb3NpdGlvbihnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0KTogdm9pZCB7XHJcbiAgICAgICAgZ2wuYnVmZmVyRGF0YShcclxuICAgICAgICAgICAgZ2wuQVJSQVlfQlVGRkVSLFxyXG4gICAgICAgICAgICBuZXcgRmxvYXQzMkFycmF5KFsuLi50aGlzLmFycmF5T2ZQb2ludHNbMF0uZ2V0UGFpcigpLCAuLi50aGlzLmFycmF5T2ZQb2ludHNbMV0uZ2V0UGFpcigpXSksXHJcbiAgICAgICAgICAgIGdsLlNUQVRJQ19EUkFXXHJcbiAgICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRDb2xvcihnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0KTogdm9pZCB7XHJcbiAgICAgICAgZ2wuYnVmZmVyRGF0YShcclxuICAgICAgICAgICAgZ2wuQVJSQVlfQlVGRkVSLFxyXG4gICAgICAgICAgICBuZXcgRmxvYXQzMkFycmF5KFsuLi50aGlzLmFycmF5T2ZQb2ludHNbMF0uZ2V0Q29sb3IoKSwgLi4udGhpcy5hcnJheU9mUG9pbnRzWzFdLmdldENvbG9yKCldKSxcclxuICAgICAgICAgICAgZ2wuU1RBVElDX0RSQVdcclxuICAgICAgICAgICk7XHJcbiAgICB9ICBcclxuXHJcbiAgICBwdWJsaWMgc2V0TGluZUF0dHJpYnV0ZXModHg6IG51bWJlciwgdHk6IG51bWJlciwgZGVncmVlOiBudW1iZXIsIHN4OiBudW1iZXIsIHN5OiBudW1iZXIsIGt4OiBudW1iZXIsIGt5OiBudW1iZXIsIHAyOiBQb2ludCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuYXJyYXlPZlBvaW50cy5wdXNoKHAyKTtcclxuICAgICAgICB0aGlzLnR4ID0gdHg7XHJcbiAgICAgICAgdGhpcy50eSA9IHR5O1xyXG4gICAgICAgIHRoaXMuZGVncmVlID0gZGVncmVlO1xyXG4gICAgICAgIHRoaXMuc3ggPSBzeDtcclxuICAgICAgICB0aGlzLnN5ID0gc3k7XHJcbiAgICAgICAgdGhpcy5reCA9IGt4O1xyXG4gICAgICAgIHRoaXMua3kgPSBreTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgTGluZTtcclxuIiwiaW1wb3J0IFRyYW5zZm9ybWF0aW9uIGZyb20gXCJPcGVyYXRpb25zL1RyYW5zZm9ybWF0aW9uXCI7XHJcbmltcG9ydCBSZW5kZXJhYmxlIGZyb20gXCJJbnRlcmZhY2VzL3JlbmRlcmFibGUuaW50ZXJmYWNlXCI7XHJcbmltcG9ydCBUcmFuc2Zvcm1hYmxlIGZyb20gXCJJbnRlcmZhY2VzL3RyYW5zZm9ybWFibGUuaW50ZXJmYWNlXCI7XHJcbmltcG9ydCBTaGFwZSBmcm9tIFwiU2hhcGVzL3NoYXBlXCI7XHJcbmltcG9ydCBUeXBlIGZyb20gXCJTaGFwZXMvdHlwZS5lbnVtXCI7XHJcbmltcG9ydCBQb2ludCBmcm9tIFwiQmFzZS9wb2ludFwiO1xyXG5pbXBvcnQgY29udmV4SHVsbCBmcm9tIFwiT3BlcmF0aW9ucy9jb252ZXgtaHVsbFwiO1xyXG5cclxuY2xhc3MgUG9seWdvbiBleHRlbmRzIFNoYXBlIGltcGxlbWVudHMgUmVuZGVyYWJsZSwgVHJhbnNmb3JtYWJsZSB7XHJcbiAgICBwdWJsaWMgdHlwZTogVHlwZS5Qb2x5Z29uO1xyXG4gICAgcHVibGljIGFycmF5T2ZQb2ludHM6IFBvaW50W107XHJcblxyXG4gICAgcHVibGljIGNlbnRlcjogUG9pbnQ7XHJcbiAgICBwdWJsaWMgdHg6IG51bWJlcjtcclxuICAgIHB1YmxpYyB0eTogbnVtYmVyO1xyXG4gICAgcHVibGljIGRlZ3JlZTogbnVtYmVyO1xyXG4gICAgcHVibGljIHN4OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgc3k6IG51bWJlcjtcclxuICAgIHB1YmxpYyBreDogbnVtYmVyO1xyXG4gICAgcHVibGljIGt5OiBudW1iZXI7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKGlkOiBudW1iZXIsIHBvaW50OiBQb2ludCkge1xyXG4gICAgICAgIHN1cGVyKGlkLCAxLCBUeXBlLlBvbHlnb24pO1xyXG4gICAgICAgIHRoaXMuYXJyYXlPZlBvaW50cyA9IG5ldyBBcnJheShwb2ludCk7XHJcbiAgICAgICAgdGhpcy50eCA9IDA7XHJcbiAgICAgICAgdGhpcy50eSA9IDA7XHJcbiAgICAgICAgdGhpcy5kZWdyZWUgPSAwO1xyXG4gICAgICAgIHRoaXMuc3ggPSAxO1xyXG4gICAgICAgIHRoaXMuc3kgPSAxO1xyXG4gICAgICAgIHRoaXMua3ggPSAwO1xyXG4gICAgICAgIHRoaXMua3kgPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRDZW50ZXIoKTogUG9pbnQge1xyXG4gICAgICAgIGxldCBzdW1YID0gMDtcclxuICAgICAgICBsZXQgc3VtWSA9IDA7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IFt4LCB5XSA9IHRoaXMuYXJyYXlPZlBvaW50c1tpXS5nZXRQYWlyKCk7XHJcbiAgICAgICAgICAgIHN1bVggKz0geDtcclxuICAgICAgICAgICAgc3VtWSArPSB5O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgY2VudGVyWCA9IHN1bVggLyB0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoO1xyXG4gICAgICAgIGNvbnN0IGNlbnRlclkgPSBzdW1ZIC8gdGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aDtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBQb2ludChbY2VudGVyWCwgY2VudGVyWV0sIFswLCAwLCAwLCAwXSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGlzRHJhd2FibGUoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJyYXlPZlBvaW50cy5sZW5ndGggPj0gMjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZHJhdyAocG9pbnQ6IFBvaW50KTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuYXJyYXlPZlBvaW50cy5sZW5ndGggPj0gMykge1xyXG4gICAgICAgICAgICB0aGlzLmFycmF5T2ZQb2ludHMgPSBjb252ZXhIdWxsKFsuLi50aGlzLmFycmF5T2ZQb2ludHMsIHBvaW50XSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5hcnJheU9mUG9pbnRzW3RoaXMuYXJyYXlPZlBvaW50cy5sZW5ndGhdID0gcG9pbnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY2VudGVyID0gdGhpcy5nZXRDZW50ZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZHJhd01ldGhvZChnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0KTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aCA+PTMgPyBnbC5UUklBTkdMRV9GQU4gOiBnbC5MSU5FUztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0TnVtYmVyT2ZWZXJ0aWNlc1RvQmVEcmF3bigpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoIDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkUG9zaXRpb24oZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IHZlcnRpY2VzID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoICogMik7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IFt4LCB5XSA9IHRoaXMuYXJyYXlPZlBvaW50c1tpXS5nZXRQYWlyKCk7XHJcbiAgICAgICAgICAgIHZlcnRpY2VzW2kgKiAyXSA9IHg7XHJcbiAgICAgICAgICAgIHZlcnRpY2VzW2kgKiAyICsgMV0gPSB5O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgW3BJbml0aWFsWCwgcEluaXRpYWxZXSA9IHRoaXMuYXJyYXlPZlBvaW50c1swXS5nZXRQYWlyKCk7XHJcbiAgICAgICAgdmVydGljZXNbdGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aCAqIDJdID0gcEluaXRpYWxYO1xyXG4gICAgICAgIHZlcnRpY2VzW3RoaXMuYXJyYXlPZlBvaW50cy5sZW5ndGggKiAyICsgMV0gPSBwSW5pdGlhbFk7XHJcblxyXG4gICAgICAgIGdsLmJ1ZmZlckRhdGEoZ2wuQVJSQVlfQlVGRkVSLCB2ZXJ0aWNlcywgZ2wuU1RBVElDX0RSQVcpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRDb2xvcihnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0KTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgY29sb3JzID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoICogNCk7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IFtyLCBnLCBiLCBhXSA9IHRoaXMuYXJyYXlPZlBvaW50c1tpXS5nZXRDb2xvcigpO1xyXG4gICAgICAgICAgICBjb2xvcnNbaSAqIDRdID0gcjtcclxuICAgICAgICAgICAgY29sb3JzW2kgKiA0ICsgMV0gPSBnO1xyXG4gICAgICAgICAgICBjb2xvcnNbaSAqIDQgKyAyXSA9IGI7XHJcbiAgICAgICAgICAgIGNvbG9yc1tpICogNCArIDNdID0gYTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IFtySW5pdGlhbCwgZ0luaXRpYWwsIGJJbml0aWFsLCBhSW5pdGlhbF0gPSB0aGlzLmFycmF5T2ZQb2ludHNbMF0uZ2V0Q29sb3IoKTtcclxuICAgICAgICBjb2xvcnNbdGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aCAqIDRdID0gckluaXRpYWw7XHJcbiAgICAgICAgY29sb3JzW3RoaXMuYXJyYXlPZlBvaW50cy5sZW5ndGggKiA0ICsgMV0gPSBnSW5pdGlhbDtcclxuICAgICAgICBjb2xvcnNbdGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aCAqIDQgKyAyXSA9IGJJbml0aWFsO1xyXG4gICAgICAgIGNvbG9yc1t0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoICogNCArIDNdID0gYUluaXRpYWw7XHJcblxyXG4gICAgICAgIGdsLmJ1ZmZlckRhdGEoZ2wuQVJSQVlfQlVGRkVSLCBjb2xvcnMsIGdsLlNUQVRJQ19EUkFXKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBhZGRNYXRyaXgoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCwgbWF0cml4TG9jYXRpb246IFdlYkdMVW5pZm9ybUxvY2F0aW9uKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgbWF0cml4ID0gVHJhbnNmb3JtYXRpb24udHJhbnNmb3JtYXRpb25NYXRyaXgoXHJcbiAgICAgICAgICAgIGdsLmNhbnZhcy53aWR0aCxcclxuICAgICAgICAgICAgZ2wuY2FudmFzLmhlaWdodCxcclxuICAgICAgICAgICAgdGhpcy50eCxcclxuICAgICAgICAgICAgdGhpcy50eSxcclxuICAgICAgICAgICAgdGhpcy5kZWdyZWUsXHJcbiAgICAgICAgICAgIHRoaXMuc3gsXHJcbiAgICAgICAgICAgIHRoaXMuc3ksXHJcbiAgICAgICAgICAgIHRoaXMua3gsXHJcbiAgICAgICAgICAgIHRoaXMua3ksXHJcbiAgICAgICAgICAgIHRoaXMuY2VudGVyXHJcbiAgICAgICAgICApLmZsYXR0ZW4oKTtcclxuICAgICAgXHJcbiAgICAgICAgICBnbC51bmlmb3JtTWF0cml4M2Z2KG1hdHJpeExvY2F0aW9uLCBmYWxzZSwgbWF0cml4KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGVsZXRlUG9pbnQoaW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgIHZhciBuZXdQb2ludHM6IFBvaW50W10gPSBbdGhpcy5hcnJheU9mUG9pbnRzW2luZGV4XV07XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgIGlmIChpICE9IGluZGV4KSB7XHJcbiAgICAgICAgICAgIG5ld1BvaW50cy5wdXNoKHRoaXMuYXJyYXlPZlBvaW50c1tpXSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgXHJcbiAgICAgICAgdGhpcy5hcnJheU9mUG9pbnRzID0gbmV3UG9pbnRzLnNsaWNlKDEsIHRoaXMuYXJyYXlPZlBvaW50cy5sZW5ndGgpO1xyXG4gICAgXHJcbiAgICAgICAgLy8gYWZ0ZXIgZGVsZXRlLCBuZWVkIHRvIHNldHVwIG9wdGlvbiBhZ2FpblxyXG4gICAgICAgIGNvbnN0IHBvaW50UGlja2VyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwb2ludFBpY2tlclwiKTtcclxuICAgICAgICBwb2ludFBpY2tlci5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICAgIHBvaW50UGlja2VyLnJlcGxhY2VDaGlsZHJlbigpO1xyXG4gICAgICAgIC8qIEFsbCBQb2ludCAqL1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICBjb25zdCBuZXdQb2ludCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XHJcbiAgICAgICAgICBuZXdQb2ludC52YWx1ZSA9IGkudG9TdHJpbmcoKTtcclxuICAgICAgICAgIG5ld1BvaW50LnRleHQgPSBcInBvaW50X1wiICsgaTtcclxuICAgICAgICAgIHBvaW50UGlja2VyLmFwcGVuZENoaWxkKG5ld1BvaW50KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHB1YmxpYyBzZXRQb2x5Z29uQXR0cmlidXRlcyh0eDogbnVtYmVyLCB0eTogbnVtYmVyLCBkZWdyZWU6IG51bWJlciwgc3g6IG51bWJlciwgc3k6IG51bWJlciwga3g6IG51bWJlciwga3k6IG51bWJlciwgYXJyYXlPZlBvaW50czogUG9pbnRbXSk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuYXJyYXlPZlBvaW50cyA9IGFycmF5T2ZQb2ludHM7XHJcbiAgICAgICAgdGhpcy50eCA9IHR4O1xyXG4gICAgICAgIHRoaXMudHkgPSB0eTtcclxuICAgICAgICB0aGlzLmRlZ3JlZSA9IGRlZ3JlZTtcclxuICAgICAgICB0aGlzLnN4ID0gc3g7XHJcbiAgICAgICAgdGhpcy5zeSA9IHN5O1xyXG4gICAgICAgIHRoaXMua3ggPSBreDtcclxuICAgICAgICB0aGlzLmt5ID0ga3k7XHJcbiAgICAgICAgdGhpcy5udW1iZXJPZlZlcnRpY2VzID0gYXJyYXlPZlBvaW50cy5sZW5ndGg7XHJcbiAgICAgICAgdGhpcy5jZW50ZXIgPSB0aGlzLmdldENlbnRlcigpO1xyXG4gICAgICB9XHJcbiAgICBcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgUG9seWdvbjsiLCJpbXBvcnQgU2hhcGUgZnJvbSBcIlNoYXBlcy9zaGFwZVwiO1xyXG5pbXBvcnQgUG9pbnQgZnJvbSBcIkJhc2UvcG9pbnRcIjtcclxuaW1wb3J0IFR5cGUgZnJvbSBcIlNoYXBlcy90eXBlLmVudW1cIjtcclxuaW1wb3J0IFJlbmRlcmFibGUgZnJvbSBcIkludGVyZmFjZXMvcmVuZGVyYWJsZS5pbnRlcmZhY2VcIjtcclxuaW1wb3J0IFRyYW5zZm9ybWFibGUgZnJvbSBcIkludGVyZmFjZXMvdHJhbnNmb3JtYWJsZS5pbnRlcmZhY2VcIjtcclxuaW1wb3J0IFRyYW5zZm9ybWF0aW9uIGZyb20gXCJPcGVyYXRpb25zL1RyYW5zZm9ybWF0aW9uXCI7XHJcblxyXG5jbGFzcyBSZWN0YW5nbGUgZXh0ZW5kcyBTaGFwZSBpbXBsZW1lbnRzIFJlbmRlcmFibGUsIFRyYW5zZm9ybWFibGUge1xyXG4gICAgcHVibGljIGFycmF5T2ZQb2ludHM6IFBvaW50W107XHJcbiAgICBwdWJsaWMgY2VudGVyOiBQb2ludDtcclxuICAgIHB1YmxpYyB0eDogbnVtYmVyO1xyXG4gICAgcHVibGljIHR5OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgZGVncmVlOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgc3g6IG51bWJlcjtcclxuICAgIHB1YmxpYyBzeTogbnVtYmVyO1xyXG4gICAgcHVibGljIGt4OiBudW1iZXI7XHJcbiAgICBwdWJsaWMga3k6IG51bWJlcjtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoaWQ6IG51bWJlciwgIHAxOiBQb2ludCl7XHJcbiAgICAgICAgc3VwZXIoaWQsIDQsIFR5cGUuUmVjdGFuZ2xlKTtcclxuICAgICAgICB0aGlzLmFycmF5T2ZQb2ludHMgPSBbcDEsIG51bGwsIG51bGwsIG51bGxdO1xyXG4gICAgICAgIHRoaXMudHggPSAwO1xyXG4gICAgICAgIHRoaXMudHkgPSAwO1xyXG4gICAgICAgIHRoaXMuZGVncmVlID0gMDtcclxuICAgICAgICB0aGlzLnN4ID0gMTtcclxuICAgICAgICB0aGlzLnN5ID0gMTtcclxuICAgICAgICB0aGlzLmt4ID0gMDtcclxuICAgICAgICB0aGlzLmt5ID0gMDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBUcmFuc2Zvcm1hYmxlIE1ldGhvZHNcclxuICAgIHB1YmxpYyBnZXRDZW50ZXIoKTogUG9pbnQge1xyXG4gICAgICAgIGNvbnN0IFtwMXgsIHAxeV0gPSB0aGlzLmFycmF5T2ZQb2ludHNbMF0uZ2V0UGFpcigpO1xyXG4gICAgICAgIGNvbnN0IFtwMngsIHAyeV0gPSB0aGlzLmFycmF5T2ZQb2ludHNbMV0uZ2V0UGFpcigpO1xyXG4gICAgICAgIGNvbnN0IFtwM3gsIHAzeV0gPSB0aGlzLmFycmF5T2ZQb2ludHNbMl0uZ2V0UGFpcigpO1xyXG4gICAgICAgIGNvbnN0IFtwNHgsIHA0eV0gPSB0aGlzLmFycmF5T2ZQb2ludHNbM10uZ2V0UGFpcigpO1xyXG5cclxuICAgICAgICBjb25zdCBjZW50ZXJYID0gKHAxeCArIHAyeCArIHAzeCArIHA0eCkgLyA0O1xyXG4gICAgICAgIGNvbnN0IGNlbnRlclkgPSAocDF5ICsgcDJ5ICsgcDN5ICsgcDR5KSAvIDQ7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIG5ldyBQb2ludChbY2VudGVyWCwgY2VudGVyWV0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRNYXRyaXgoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCwgbWF0cml4TG9jYXRpb246IFdlYkdMVW5pZm9ybUxvY2F0aW9uKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgbWF0cml4ID0gVHJhbnNmb3JtYXRpb24udHJhbnNmb3JtYXRpb25NYXRyaXgoXHJcbiAgICAgICAgICAgIGdsLmNhbnZhcy53aWR0aCxcclxuICAgICAgICAgICAgZ2wuY2FudmFzLmhlaWdodCxcclxuICAgICAgICAgICAgdGhpcy50eCxcclxuICAgICAgICAgICAgdGhpcy50eSxcclxuICAgICAgICAgICAgdGhpcy5kZWdyZWUsXHJcbiAgICAgICAgICAgIHRoaXMuc3gsXHJcbiAgICAgICAgICAgIHRoaXMuc3ksXHJcbiAgICAgICAgICAgIHRoaXMua3gsXHJcbiAgICAgICAgICAgIHRoaXMua3ksXHJcbiAgICAgICAgICAgIHRoaXMuY2VudGVyXHJcbiAgICAgICAgICApLmZsYXR0ZW4oKTtcclxuICAgICAgXHJcbiAgICAgICAgICBnbC51bmlmb3JtTWF0cml4M2Z2KG1hdHJpeExvY2F0aW9uLCBmYWxzZSwgbWF0cml4KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBSZW5kZXJhYmxlIE1ldGhvZHNcclxuICAgIHB1YmxpYyBkcmF3TWV0aG9kKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBnbC5UUklBTkdMRV9GQU47XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGlzRHJhd2FibGUoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgLy8gcmV0dXJuIHRoaXMuYXJyYXlPZlBvaW50cy5maWx0ZXIocG9pbnQgPT4gcG9pbnQgIT09IG51bGwpLmxlbmd0aCA9PT0gNDtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcnJheU9mUG9pbnRzWzJdICE9PSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkcmF3KHBvaW50OiBQb2ludCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuYXJyYXlPZlBvaW50c1sxXSA9IG5ldyBQb2ludChbdGhpcy5hcnJheU9mUG9pbnRzWzBdLngsIHBvaW50LnldKTtcclxuICAgICAgICB0aGlzLmFycmF5T2ZQb2ludHNbMl0gPSBwb2ludDtcclxuICAgICAgICB0aGlzLmFycmF5T2ZQb2ludHNbM10gPSBuZXcgUG9pbnQoW3BvaW50LngsIHRoaXMuYXJyYXlPZlBvaW50c1swXS55XSk7XHJcbiAgICAgICAgdGhpcy5jZW50ZXIgPSB0aGlzLmdldENlbnRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXROdW1iZXJPZlZlcnRpY2VzVG9CZURyYXduKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIDU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZFBvc2l0aW9uKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQpOiB2b2lkIHtcclxuICAgICAgICBnbC5idWZmZXJEYXRhKFxyXG4gICAgICAgICAgICBnbC5BUlJBWV9CVUZGRVIsXHJcbiAgICAgICAgICAgIG5ldyBGbG9hdDMyQXJyYXkoW1xyXG4gICAgICAgICAgICAgIC4uLnRoaXMuYXJyYXlPZlBvaW50c1swXS5nZXRQYWlyKCksXHJcbiAgICAgICAgICAgICAgLi4udGhpcy5hcnJheU9mUG9pbnRzWzFdLmdldFBhaXIoKSxcclxuICAgICAgICAgICAgICAuLi50aGlzLmFycmF5T2ZQb2ludHNbMl0uZ2V0UGFpcigpLFxyXG4gICAgICAgICAgICAgIC4uLnRoaXMuYXJyYXlPZlBvaW50c1szXS5nZXRQYWlyKCksXHJcbiAgICAgICAgICAgICAgLi4udGhpcy5hcnJheU9mUG9pbnRzWzBdLmdldFBhaXIoKSxcclxuICAgICAgICAgICAgXSksXHJcbiAgICAgICAgICAgIGdsLlNUQVRJQ19EUkFXXHJcbiAgICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRDb2xvcihnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0KTogdm9pZCB7XHJcbiAgICAgICAgZ2wuYnVmZmVyRGF0YShcclxuICAgICAgICAgICAgZ2wuQVJSQVlfQlVGRkVSLFxyXG4gICAgICAgICAgICBuZXcgRmxvYXQzMkFycmF5KFtcclxuICAgICAgICAgICAgICAuLi50aGlzLmFycmF5T2ZQb2ludHNbMF0uZ2V0Q29sb3IoKSxcclxuICAgICAgICAgICAgICAuLi50aGlzLmFycmF5T2ZQb2ludHNbMV0uZ2V0Q29sb3IoKSxcclxuICAgICAgICAgICAgICAuLi50aGlzLmFycmF5T2ZQb2ludHNbMl0uZ2V0Q29sb3IoKSxcclxuICAgICAgICAgICAgICAuLi50aGlzLmFycmF5T2ZQb2ludHNbM10uZ2V0Q29sb3IoKSxcclxuICAgICAgICAgICAgICAuLi50aGlzLmFycmF5T2ZQb2ludHNbMF0uZ2V0Q29sb3IoKSxcclxuICAgICAgICAgICAgXSksXHJcbiAgICAgICAgICAgIGdsLlNUQVRJQ19EUkFXXHJcbiAgICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRSZWN0YW5nbGVBdHRyaWJ1dGVzKHR4OiBudW1iZXIsIHR5OiBudW1iZXIsIGRlZ3JlZTogbnVtYmVyLCBzeDogbnVtYmVyLCBzeTogbnVtYmVyLCBreDogbnVtYmVyLCBreTogbnVtYmVyLCBhcnJheU9mUG9pbnRzOiBQb2ludFtdKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5hcnJheU9mUG9pbnRzID0gYXJyYXlPZlBvaW50cztcclxuICAgICAgICB0aGlzLnR4ID0gdHg7XHJcbiAgICAgICAgdGhpcy50eSA9IHR5O1xyXG4gICAgICAgIHRoaXMuZGVncmVlID0gZGVncmVlO1xyXG4gICAgICAgIHRoaXMuc3ggPSBzeDtcclxuICAgICAgICB0aGlzLnN5ID0gc3k7XHJcbiAgICAgICAgdGhpcy5reCA9IGt4O1xyXG4gICAgICAgIHRoaXMua3kgPSBreTtcclxuICAgICAgICB0aGlzLmNlbnRlciA9IHRoaXMuZ2V0Q2VudGVyKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFJlY3RhbmdsZTtcclxuIiwiaW1wb3J0IFBvaW50IGZyb20gXCJCYXNlL3BvaW50XCI7XHJcbmltcG9ydCBUeXBlIGZyb20gXCJTaGFwZXMvdHlwZS5lbnVtXCI7XHJcbmFic3RyYWN0IGNsYXNzIFNoYXBlIHtcclxuICAgIHB1YmxpYyBpZDogbnVtYmVyO1xyXG4gICAgcHVibGljIG51bWJlck9mVmVydGljZXM6IG51bWJlcjtcclxuICAgIHB1YmxpYyB0eXBlOiBUeXBlO1xyXG4gICAgcHVibGljIGFycmF5T2ZQb2ludHM6IFBvaW50W107XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKGlkOiBudW1iZXIsIG51bWJlck9mVmVydGljZXM6IG51bWJlciwgdHlwZTogVHlwZSl7XHJcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xyXG4gICAgICAgIHRoaXMubnVtYmVyT2ZWZXJ0aWNlcyA9IG51bWJlck9mVmVydGljZXM7XHJcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgZ2V0Q2VudGVyKCk6IFBvaW50O1xyXG4gICAgcHVibGljIGFic3RyYWN0IGlzRHJhd2FibGUoKTogYm9vbGVhbjtcclxuICAgIHB1YmxpYyBhYnN0cmFjdCBkcmF3KHBvaW50OiBQb2ludCk6IHZvaWQ7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFNoYXBlOyIsImltcG9ydCBSZW5kZXJhYmxlIGZyb20gXCJJbnRlcmZhY2VzL3JlbmRlcmFibGUuaW50ZXJmYWNlXCI7XHJcbmltcG9ydCBTaGFwZSBmcm9tIFwiU2hhcGVzL3NoYXBlXCI7XHJcbmltcG9ydCBUcmFuc2Zvcm1hdGlvbiBmcm9tIFwiT3BlcmF0aW9ucy9UcmFuc2Zvcm1hdGlvblwiO1xyXG5pbXBvcnQgVHJhbnNmb3JtYWJsZSBmcm9tIFwiSW50ZXJmYWNlcy90cmFuc2Zvcm1hYmxlLmludGVyZmFjZVwiO1xyXG5pbXBvcnQgUG9pbnQgZnJvbSBcIkJhc2UvcG9pbnRcIjtcclxuaW1wb3J0IFR5cGUgZnJvbSBcIlNoYXBlcy90eXBlLmVudW1cIjtcclxuXHJcbmNsYXNzIFNxdWFyZSBleHRlbmRzIFNoYXBlIGltcGxlbWVudHMgUmVuZGVyYWJsZSwgVHJhbnNmb3JtYWJsZSB7XHJcbiAgcHVibGljIGNlbnRlcjogUG9pbnQ7XHJcbiAgcHVibGljIGFycmF5T2ZQb2ludHM6IFBvaW50W107XHJcbiAgcHVibGljIHR4OiBudW1iZXI7XHJcbiAgcHVibGljIHR5OiBudW1iZXI7XHJcbiAgcHVibGljIGRlZ3JlZTogbnVtYmVyO1xyXG4gIHB1YmxpYyBzeDogbnVtYmVyO1xyXG4gIHB1YmxpYyBzeTogbnVtYmVyO1xyXG4gIHB1YmxpYyBreDogbnVtYmVyO1xyXG4gIHB1YmxpYyBreTogbnVtYmVyO1xyXG5cclxuICBwdWJsaWMgY29uc3RydWN0b3IoaWQ6IG51bWJlciwgY2VudGVyUG9pbnQ6IFBvaW50KSB7XHJcbiAgICBzdXBlcihpZCwgNCwgVHlwZS5TcXVhcmUpO1xyXG4gICAgdGhpcy5jZW50ZXIgPSBjZW50ZXJQb2ludDtcclxuICAgIHRoaXMuYXJyYXlPZlBvaW50cyA9IFtudWxsLCBudWxsLCBudWxsLCBudWxsXTtcclxuICAgIHRoaXMudHggPSAwO1xyXG4gICAgdGhpcy50eSA9IDA7XHJcbiAgICB0aGlzLmRlZ3JlZSA9IDA7XHJcbiAgICB0aGlzLnN4ID0gMTtcclxuICAgIHRoaXMuc3kgPSAxO1xyXG4gICAgdGhpcy5reCA9IDA7XHJcbiAgICB0aGlzLmt5ID0gMDtcclxuICB9XHJcblxyXG4gIC8vIFRyYW5zZm9ybWFibGUgTWV0aG9kc1xyXG4gIHB1YmxpYyBnZXRDZW50ZXIoKTogUG9pbnQge1xyXG4gICAgcmV0dXJuIHRoaXMuY2VudGVyO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGFkZE1hdHJpeChcclxuICAgIGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsXHJcbiAgICBtYXRyaXhMb2NhdGlvbjogV2ViR0xVbmlmb3JtTG9jYXRpb25cclxuICApOiB2b2lkIHtcclxuICAgIGNvbnN0IG1hdHJpeCA9IFRyYW5zZm9ybWF0aW9uLnRyYW5zZm9ybWF0aW9uTWF0cml4KFxyXG4gICAgICBnbC5jYW52YXMud2lkdGgsXHJcbiAgICAgIGdsLmNhbnZhcy5oZWlnaHQsXHJcbiAgICAgIHRoaXMudHgsXHJcbiAgICAgIHRoaXMudHksXHJcbiAgICAgIHRoaXMuZGVncmVlLFxyXG4gICAgICB0aGlzLnN4LFxyXG4gICAgICB0aGlzLnN5LFxyXG4gICAgICB0aGlzLmt4LFxyXG4gICAgICB0aGlzLmt5LFxyXG4gICAgICB0aGlzLmNlbnRlclxyXG4gICAgKS5mbGF0dGVuKCk7XHJcblxyXG4gICAgZ2wudW5pZm9ybU1hdHJpeDNmdihtYXRyaXhMb2NhdGlvbiwgZmFsc2UsIG1hdHJpeCk7XHJcbiAgfVxyXG5cclxuICAvLyBSZW5kZXJhYmxlIE1ldGhvZHNcclxuICBwdWJsaWMgZHJhd01ldGhvZChnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0KTogbnVtYmVyIHtcclxuICAgIHJldHVybiBnbC5UUklBTkdMRV9GQU47XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgaXNEcmF3YWJsZSgpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoID09PSA0O1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGRyYXcocDE6IFBvaW50KTogdm9pZCB7XHJcbiAgICB0aGlzLmFycmF5T2ZQb2ludHNbMF0gPSBwMTtcclxuICAgIGNvbnN0IFt4Q2VudGVyLCB5Q2VudGVyXSA9IHRoaXMuY2VudGVyLmdldFBhaXIoKTtcclxuICAgIC8vIGZvciAobGV0IGkgPSAxOyBpIDw9IDM7IGkrKykge1xyXG4gICAgLy8gICAgIGNvbnN0IGFuZ2xlID0gKGkgKiBNYXRoLlBJKSAvIDI7XHJcbiAgICAvLyAgICAgY29uc3Qgcm90YXRlZFBvaW50ID0gVHJhbnNmb3JtYXRpb24udHJhbnNsYXRpb24odGhpcy5jZW50ZXIuZ2V0WCgpLCB0aGlzLmNlbnRlci5nZXRZKCkpXHJcbiAgICAvLyAgICAgICAgIC5tdWx0aXBseU1hdHJpeChUcmFuc2Zvcm1hdGlvbi5yb3RhdGlvbihhbmdsZSkpXHJcbiAgICAvLyAgICAgICAgIC5tdWx0aXBseU1hdHJpeChUcmFuc2Zvcm1hdGlvbi50cmFuc2xhdGlvbigtdGhpcy5jZW50ZXIuZ2V0WCgpLCAtdGhpcy5jZW50ZXIuZ2V0WSgpKSlcclxuICAgIC8vICAgICAgICAgLm11bHRpcGx5UG9pbnQocDEpO1xyXG4gICAgLy8gICAgIHRoaXMuYXJyYXlPZlBvaW50c1tpXSA9IHJvdGF0ZWRQb2ludDtcclxuICAgIC8vIH1cclxuXHJcbiAgICB0aGlzLmFycmF5T2ZQb2ludHNbMV0gPSBUcmFuc2Zvcm1hdGlvbi50cmFuc2xhdGlvbih4Q2VudGVyLCB5Q2VudGVyKVxyXG4gICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24ucm90YXRpb24oMC41ICogTWF0aC5QSSkpXHJcbiAgICAgIC5tdWx0aXBseU1hdHJpeChUcmFuc2Zvcm1hdGlvbi50cmFuc2xhdGlvbigteENlbnRlciwgLXlDZW50ZXIpKVxyXG4gICAgICAubXVsdGlwbHlQb2ludCh0aGlzLmFycmF5T2ZQb2ludHNbMF0pO1xyXG5cclxuICAgIHRoaXMuYXJyYXlPZlBvaW50c1syXSA9IFRyYW5zZm9ybWF0aW9uLnRyYW5zbGF0aW9uKHhDZW50ZXIsIHlDZW50ZXIpXHJcbiAgICAgIC5tdWx0aXBseU1hdHJpeChUcmFuc2Zvcm1hdGlvbi5yb3RhdGlvbihNYXRoLlBJKSlcclxuICAgICAgLm11bHRpcGx5TWF0cml4KFRyYW5zZm9ybWF0aW9uLnRyYW5zbGF0aW9uKC14Q2VudGVyLCAteUNlbnRlcikpXHJcbiAgICAgIC5tdWx0aXBseVBvaW50KHRoaXMuYXJyYXlPZlBvaW50c1swXSk7XHJcblxyXG4gICAgdGhpcy5hcnJheU9mUG9pbnRzWzNdID0gVHJhbnNmb3JtYXRpb24udHJhbnNsYXRpb24oeENlbnRlciwgeUNlbnRlcilcclxuICAgICAgLm11bHRpcGx5TWF0cml4KFRyYW5zZm9ybWF0aW9uLnJvdGF0aW9uKDEuNSAqIE1hdGguUEkpKVxyXG4gICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24udHJhbnNsYXRpb24oLXhDZW50ZXIsIC15Q2VudGVyKSlcclxuICAgICAgLm11bHRpcGx5UG9pbnQodGhpcy5hcnJheU9mUG9pbnRzWzBdKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBnZXROdW1iZXJPZlZlcnRpY2VzVG9CZURyYXduKCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gNTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhZGRQb3NpdGlvbihnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0KTogdm9pZCB7XHJcbiAgICBnbC5idWZmZXJEYXRhKFxyXG4gICAgICBnbC5BUlJBWV9CVUZGRVIsXHJcbiAgICAgIG5ldyBGbG9hdDMyQXJyYXkoW1xyXG4gICAgICAgIC4uLnRoaXMuYXJyYXlPZlBvaW50c1swXS5nZXRQYWlyKCksXHJcbiAgICAgICAgLi4udGhpcy5hcnJheU9mUG9pbnRzWzFdLmdldFBhaXIoKSxcclxuICAgICAgICAuLi50aGlzLmFycmF5T2ZQb2ludHNbMl0uZ2V0UGFpcigpLFxyXG4gICAgICAgIC4uLnRoaXMuYXJyYXlPZlBvaW50c1szXS5nZXRQYWlyKCksXHJcbiAgICAgICAgLi4udGhpcy5hcnJheU9mUG9pbnRzWzBdLmdldFBhaXIoKSxcclxuICAgICAgXSksXHJcbiAgICAgIGdsLlNUQVRJQ19EUkFXXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGFkZENvbG9yKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQpOiB2b2lkIHtcclxuICAgIGdsLmJ1ZmZlckRhdGEoXHJcbiAgICAgIGdsLkFSUkFZX0JVRkZFUixcclxuICAgICAgbmV3IEZsb2F0MzJBcnJheShbXHJcbiAgICAgICAgLi4udGhpcy5hcnJheU9mUG9pbnRzWzBdLmdldENvbG9yKCksXHJcbiAgICAgICAgLi4udGhpcy5hcnJheU9mUG9pbnRzWzFdLmdldENvbG9yKCksXHJcbiAgICAgICAgLi4udGhpcy5hcnJheU9mUG9pbnRzWzJdLmdldENvbG9yKCksXHJcbiAgICAgICAgLi4udGhpcy5hcnJheU9mUG9pbnRzWzNdLmdldENvbG9yKCksXHJcbiAgICAgICAgLi4udGhpcy5hcnJheU9mUG9pbnRzWzBdLmdldENvbG9yKCksXHJcbiAgICAgIF0pLFxyXG4gICAgICBnbC5TVEFUSUNfRFJBV1xyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzZXRTcXVhcmVBdHRyaWJ1dGVzKFxyXG4gICAgdHg6IG51bWJlcixcclxuICAgIHR5OiBudW1iZXIsXHJcbiAgICBkZWdyZWU6IG51bWJlcixcclxuICAgIHN4OiBudW1iZXIsXHJcbiAgICBzeTogbnVtYmVyLFxyXG4gICAga3g6IG51bWJlcixcclxuICAgIGt5OiBudW1iZXIsXHJcbiAgICBhcnJheU9mUG9pbnRzOiBQb2ludFtdXHJcbiAgKTogdm9pZCB7XHJcbiAgICB0aGlzLmFycmF5T2ZQb2ludHMgPSBhcnJheU9mUG9pbnRzO1xyXG4gICAgdGhpcy50eCA9IHR4O1xyXG4gICAgdGhpcy50eSA9IHR5O1xyXG4gICAgdGhpcy5kZWdyZWUgPSBkZWdyZWU7XHJcbiAgICB0aGlzLnN4ID0gc3g7XHJcbiAgICB0aGlzLnN5ID0gc3k7XHJcbiAgICB0aGlzLmt4ID0ga3g7XHJcbiAgICB0aGlzLmt5ID0ga3k7XHJcbiAgICB0aGlzLmNlbnRlciA9IHRoaXMuZ2V0Q2VudGVyKCk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBTcXVhcmU7XHJcbiIsImVudW0gVHlwZSB7XHJcbiAgICBMaW5lLFxyXG4gICAgUmVjdGFuZ2xlLFxyXG4gICAgU3F1YXJlLFxyXG4gICAgUG9seWdvblxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBUeXBlOyIsImNsYXNzIENvb3JkaW5hdGUge1xyXG4gICAgcHVibGljIHg6IG51bWJlcjtcclxuICAgIHB1YmxpYyB5OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgdzogbnVtYmVyO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcih4OiBudW1iZXIsIHk6IG51bWJlciwgdzogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICB0aGlzLnkgPSB5O1xyXG4gICAgICAgIHRoaXMudyA9IHc7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldENvb3JkaW5hdGUoKTogW251bWJlciwgbnVtYmVyLCBudW1iZXJdIHtcclxuICAgICAgICByZXR1cm4gW3RoaXMueCwgdGhpcy55LCB0aGlzLnddO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRDb29yZGluYXRlKHg6IG51bWJlciwgeTogbnVtYmVyLCB3OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICAgICAgdGhpcy53ID0gdztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0WCh4OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRZKHk6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldFcodzogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy53ID0gdztcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIGdldFgoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy54O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRZKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMueTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0VygpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnc7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IENvb3JkaW5hdGU7IiwiaW1wb3J0IFBvaW50IGZyb20gJ0Jhc2UvcG9pbnQnO1xyXG5cclxuY2xhc3MgTWF0cml4IHtcclxuICAgIHB1YmxpYyBtMTogW251bWJlciwgbnVtYmVyLCBudW1iZXJdO1xyXG4gICAgcHVibGljIG0yOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl07XHJcbiAgICBwdWJsaWMgbTM6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXTtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IobTE6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSwgbTI6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSwgbTM6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSkge1xyXG4gICAgICAgIHRoaXMubTEgPSBtMTtcclxuICAgICAgICB0aGlzLm0yID0gbTI7XHJcbiAgICAgICAgdGhpcy5tMyA9IG0zO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBmbGF0dGVuKCkgOiBudW1iZXJbXSB7XHJcbiAgICAgICAgcmV0dXJuIFsuLi50aGlzLm0xLCAuLi50aGlzLm0yLCAuLi50aGlzLm0zXVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBtdWx0aXBseU1hdHJpeChvdGhlck1hdHJpeDogTWF0cml4KTogTWF0cml4IHtcclxuICAgICAgICBjb25zdCBbYTExLCBhMjEsIGEzMV0gPSBvdGhlck1hdHJpeC5tMTtcclxuICAgICAgICBjb25zdCBbYTEyLCBhMjIsIGEzMl0gPSBvdGhlck1hdHJpeC5tMjtcclxuICAgICAgICBjb25zdCBbYTEzLCBhMjMsIGEzM10gPSBvdGhlck1hdHJpeC5tMztcclxuXHJcbiAgICAgICAgY29uc3QgW2IxMSwgYjEyLCBiMTNdID0gdGhpcy5tMTtcclxuICAgICAgICBjb25zdCBbYjIxLCBiMjIsIGIyM10gPSB0aGlzLm0yO1xyXG4gICAgICAgIGNvbnN0IFtiMzEsIGIzMiwgYjMzXSA9IHRoaXMubTM7XHJcblxyXG4gICAgICAgIGNvbnN0IGMxMSA9IGIxMSAqIGExMSArIGIyMSAqIGEyMSArIGIzMSAqIGEzMVxyXG4gICAgICAgIGNvbnN0IGMxMiA9IGIxMSAqIGExMiArIGIyMSAqIGEyMiArIGIzMSAqIGEzMlxyXG4gICAgICAgIGNvbnN0IGMxMyA9IGIxMSAqIGExMyArIGIyMSAqIGEyMyArIGIzMSAqIGEzM1xyXG4gICAgICAgIGNvbnN0IGMyMSA9IGIxMiAqIGExMSArIGIyMiAqIGEyMSArIGIzMiAqIGEzMVxyXG4gICAgICAgIGNvbnN0IGMyMiA9IGIxMiAqIGExMiArIGIyMiAqIGEyMiArIGIzMiAqIGEzMlxyXG4gICAgICAgIGNvbnN0IGMyMyA9IGIxMiAqIGExMyArIGIyMiAqIGEyMyArIGIzMiAqIGEzM1xyXG4gICAgICAgIGNvbnN0IGMzMSA9IGIxMyAqIGExMSArIGIyMyAqIGEyMSArIGIzMyAqIGEzMVxyXG4gICAgICAgIGNvbnN0IGMzMiA9IGIxMyAqIGExMiArIGIyMyAqIGEyMiArIGIzMyAqIGEzMlxyXG4gICAgICAgIGNvbnN0IGMzMyA9IGIxMyAqIGExMyArIGIyMyAqIGEyMyArIGIzMyAqIGEzM1xyXG5cclxuICAgICAgICBjb25zdCBtYXRyaXggPSBuZXcgTWF0cml4KFtjMTEsIGMyMSwgYzMxXSwgW2MxMiwgYzIyLCBjMzJdLCBbYzEzLCBjMjMsIGMzM10pO1xyXG4gICAgICAgIHJldHVybiBtYXRyaXg7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHB1YmxpYyBtdWx0aXBseVBvaW50KHBvaW50OiBQb2ludCk6IFBvaW50IHtcclxuICAgICAgICBjb25zdCBbYTExLCBhMjEsIGEzMV0gPSB0aGlzLm0xO1xyXG4gICAgICAgIGNvbnN0IFthMTIsIGEyMiwgYTMyXSA9IHRoaXMubTI7XHJcbiAgICAgICAgY29uc3QgW2ExMywgYTIzLCBhMzNdID0gdGhpcy5tMztcclxuXHJcbiAgICAgICAgY29uc3QgeDEgPSBhMTEgKiBwb2ludC54ICsgYTEyICogcG9pbnQueSArIGExMyAqIHBvaW50Lnc7XHJcbiAgICAgICAgY29uc3QgeTEgPSBhMjEgKiBwb2ludC54ICsgYTIyICogcG9pbnQueSArIGEyMyAqIHBvaW50Lnc7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgbmV3UG9pbnQgPSBuZXcgUG9pbnQoW3gxLCB5MV0pO1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3UG9pbnQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IE1hdHJpeDsiLCJpbXBvcnQgQ29vcmRpbmF0ZSBmcm9tIFwiQmFzZS9jb29yZGluYXRlXCI7XHJcblxyXG5jbGFzcyBQb2ludCAgZXh0ZW5kcyBDb29yZGluYXRlIHtcclxuICAgIHB1YmxpYyByOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgZzogbnVtYmVyO1xyXG4gICAgcHVibGljIGI6IG51bWJlcjtcclxuICAgIHB1YmxpYyBhOiBudW1iZXI7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHBvc2l0aW9uOiBbbnVtYmVyLCBudW1iZXJdLCBjb2xvcjogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPSBbMCwgMCwgMCwgMV0pIHtcclxuICAgICAgICBzdXBlciguLi5wb3NpdGlvbiwgMSk7XHJcblxyXG4gICAgICAgIFt0aGlzLnIsIHRoaXMuZywgdGhpcy5iLCB0aGlzLmFdID0gY29sb3I7XHJcblxyXG4gICAgICAgIGNvbnN0IFtyLCBnLCBiLCBhXSA9IGNvbG9yO1xyXG4gICAgICAgIHRoaXMuciA9IHI7XHJcbiAgICAgICAgdGhpcy5nID0gZztcclxuICAgICAgICB0aGlzLmIgPSBiO1xyXG4gICAgICAgIHRoaXMuYSA9IGE7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFBhaXIoKTogW251bWJlciwgbnVtYmVyXSB7XHJcbiAgICAgICAgcmV0dXJuIFt0aGlzLngsIHRoaXMueV07XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldENvbG9yKCk6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdIHtcclxuICAgICAgICByZXR1cm4gW3RoaXMuciwgdGhpcy5nLCB0aGlzLmIsIHRoaXMuYV07XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldENvbG9yKGNvbG9yOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IFtyLCBnLCBiLCBhXSA9IGNvbG9yO1xyXG4gICAgICAgIHRoaXMuciA9IHI7XHJcbiAgICAgICAgdGhpcy5nID0gZztcclxuICAgICAgICB0aGlzLmIgPSBiO1xyXG4gICAgICAgIHRoaXMuYSA9IGE7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFBvaW50OyIsImltcG9ydCB7IGxvYWRTaGFkZXIgfSBmcm9tIFwiRnVuY3Rpb25zL2xvYWQtc2hhZGVyXCI7XHJcblxyXG4vL1xyXG4vLyBJbml0aWFsaXplIGEgc2hhZGVyIHByb2dyYW0sIHNvIFdlYkdMIGtub3dzIGhvdyB0byBkcmF3IG91ciBkYXRhXHJcbi8vXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTaGFkZXJQcm9ncmFtKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsIHZzU291cmNlOiBzdHJpbmcsIGZzU291cmNlOiBzdHJpbmcpIHtcclxuICAgIGNvbnN0IHZlcnRleFNoYWRlciA9IGxvYWRTaGFkZXIoZ2wsIGdsLlZFUlRFWF9TSEFERVIsIHZzU291cmNlKTtcclxuICAgIGNvbnN0IGZyYWdtZW50U2hhZGVyID0gbG9hZFNoYWRlcihnbCwgZ2wuRlJBR01FTlRfU0hBREVSLCBmc1NvdXJjZSk7XHJcbiAgXHJcbiAgICAvLyBDcmVhdGUgdGhlIHNoYWRlciBwcm9ncmFtXHJcbiAgICBjb25zdCBzaGFkZXJQcm9ncmFtID0gZ2wuY3JlYXRlUHJvZ3JhbSgpO1xyXG4gICAgZ2wuYXR0YWNoU2hhZGVyKHNoYWRlclByb2dyYW0sIHZlcnRleFNoYWRlcik7XHJcbiAgICBnbC5hdHRhY2hTaGFkZXIoc2hhZGVyUHJvZ3JhbSwgZnJhZ21lbnRTaGFkZXIpO1xyXG4gICAgZ2wubGlua1Byb2dyYW0oc2hhZGVyUHJvZ3JhbSk7XHJcbiAgXHJcbiAgICAvLyBJZiBjcmVhdGluZyB0aGUgc2hhZGVyIHByb2dyYW0gZmFpbGVkLCBhbGVydFxyXG4gIFxyXG4gICAgaWYgKCFnbC5nZXRQcm9ncmFtUGFyYW1ldGVyKHNoYWRlclByb2dyYW0sIGdsLkxJTktfU1RBVFVTKSkge1xyXG4gICAgICBhbGVydChcclxuICAgICAgICBgVW5hYmxlIHRvIGluaXRpYWxpemUgdGhlIHNoYWRlciBwcm9ncmFtOiAke2dsLmdldFByb2dyYW1JbmZvTG9nKFxyXG4gICAgICAgICAgc2hhZGVyUHJvZ3JhbSxcclxuICAgICAgICApfWAsXHJcbiAgICAgICk7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHNoYWRlclByb2dyYW07XHJcbiAgfSIsIiAgLy9cclxuICAvLyBjcmVhdGVzIGEgc2hhZGVyIG9mIHRoZSBnaXZlbiB0eXBlLCB1cGxvYWRzIHRoZSBzb3VyY2UgYW5kXHJcbiAgLy8gY29tcGlsZXMgaXQuXHJcbiAgLy9cclxuZXhwb3J0IGZ1bmN0aW9uIGxvYWRTaGFkZXIoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCwgdHlwZTogbnVtYmVyLCBzb3VyY2U6IHN0cmluZyk6IFdlYkdMU2hhZGVyIHtcclxuICAgIGNvbnN0IHNoYWRlciA9IGdsLmNyZWF0ZVNoYWRlcih0eXBlKTtcclxuICBcclxuICAgIC8vIFNlbmQgdGhlIHNvdXJjZSB0byB0aGUgc2hhZGVyIG9iamVjdFxyXG4gICAgZ2wuc2hhZGVyU291cmNlKHNoYWRlciwgc291cmNlKTtcclxuICBcclxuICAgIC8vIENvbXBpbGUgdGhlIHNoYWRlciBwcm9ncmFtXHJcbiAgICBnbC5jb21waWxlU2hhZGVyKHNoYWRlcik7XHJcbiAgXHJcbiAgICAvLyBTZWUgaWYgaXQgY29tcGlsZWQgc3VjY2Vzc2Z1bGx5XHJcbiAgICBpZiAoIWdsLmdldFNoYWRlclBhcmFtZXRlcihzaGFkZXIsIGdsLkNPTVBJTEVfU1RBVFVTKSkge1xyXG4gICAgICBhbGVydChgQW4gZXJyb3Igb2NjdXJyZWQgY29tcGlsaW5nIHRoZSBzaGFkZXJzOiAke2dsLmdldFNoYWRlckluZm9Mb2coc2hhZGVyKX1gLCk7XHJcbiAgICAgIGdsLmRlbGV0ZVNoYWRlcihzaGFkZXIpO1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIHJldHVybiBzaGFkZXI7XHJcbn0iLCJpbXBvcnQgeyByZW5kZXIgfSBmcm9tIFwiRnVuY3Rpb25zL3JlbmRlclwiO1xyXG5pbXBvcnQgUHJvZ3JhbUluZm8gZnJvbSBcIkZ1bmN0aW9ucy9wcm9ncmFtLWluZm8uaW50ZXJmYWNlXCI7XHJcbmltcG9ydCBSZW5kZXJhYmxlIGZyb20gXCJJbnRlcmZhY2VzL3JlbmRlcmFibGUuaW50ZXJmYWNlXCI7XHJcbmltcG9ydCBUcmFuc2Zvcm1hYmxlIGZyb20gXCJJbnRlcmZhY2VzL3RyYW5zZm9ybWFibGUuaW50ZXJmYWNlXCI7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyQWxsKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsIHByb2dyYW1JbmZvOiBQcm9ncmFtSW5mbywgc2hhcGVzOiAoUmVuZGVyYWJsZSZUcmFuc2Zvcm1hYmxlKVtdLCBwb3NpdGlvbkJ1ZmZlcjogV2ViR0xCdWZmZXIsIGNvbG9yQnVmZmVyOiBXZWJHTEJ1ZmZlcik6IHZvaWQge1xyXG4gICAgZ2wuY2xlYXIoZ2wuQ09MT1JfQlVGRkVSX0JJVCk7XHJcbiAgXHJcbiAgICBmb3IgKGNvbnN0IHNoYXBlIG9mIHNoYXBlcykge1xyXG4gICAgICByZW5kZXIoZ2wsIHByb2dyYW1JbmZvLCBzaGFwZSwgcG9zaXRpb25CdWZmZXIsIGNvbG9yQnVmZmVyKVxyXG4gICAgfVxyXG59OyIsImltcG9ydCBSZW5kZXJhYmxlIGZyb20gXCJJbnRlcmZhY2VzL3JlbmRlcmFibGUuaW50ZXJmYWNlXCI7XHJcbmltcG9ydCBQcm9ncmFtSW5mbyBmcm9tIFwiRnVuY3Rpb25zL3Byb2dyYW0taW5mby5pbnRlcmZhY2VcIjtcclxuaW1wb3J0IFRyYW5zZm9ybWFibGUgZnJvbSBcIkludGVyZmFjZXMvdHJhbnNmb3JtYWJsZS5pbnRlcmZhY2VcIjtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZW5kZXIoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCwgcHJvZ3JhbUluZm86IFByb2dyYW1JbmZvLCBvYmplY3Q6IFJlbmRlcmFibGUgJiBUcmFuc2Zvcm1hYmxlLCBwb3NpdGlvbkJ1ZmZlcjogV2ViR0xCdWZmZXIsIGNvbG9yQnVmZmVyOiBXZWJHTEJ1ZmZlcik6IHZvaWQge1xyXG4gICAgaWYgKCFvYmplY3QuaXNEcmF3YWJsZSgpKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIC8vIEFkZCBQb3NpdGlvbiB0byBnbCBidWZmZXJcclxuICAgIGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KHByb2dyYW1JbmZvLmF0dHJpYkxvY2F0aW9ucy52ZXJ0ZXhQb3NpdGlvbik7XHJcbiAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgcG9zaXRpb25CdWZmZXIpO1xyXG4gICAgb2JqZWN0LmFkZFBvc2l0aW9uKGdsKTtcclxuICAgIGNvbnN0IG51bUNvbXBvbmVudHMgPSAyOyAvLyBwdWxsIG91dCAyIHZhbHVlcyBwZXIgaXRlcmF0aW9uXHJcbiAgICBjb25zdCB0eXBlID0gZ2wuRkxPQVQ7IC8vIHRoZSBkYXRhIGluIHRoZSBidWZmZXIgaXMgMzJiaXQgZmxvYXRzXHJcbiAgICBjb25zdCBub3JtYWxpemUgPSBmYWxzZTsgLy8gZG9uJ3Qgbm9ybWFsaXplXHJcbiAgICBjb25zdCBzdHJpZGUgPSAwOyAvLyBob3cgbWFueSBieXRlcyB0byBnZXQgZnJvbSBvbmUgc2V0IG9mIHZhbHVlcyB0byB0aGUgbmV4dFxyXG4gICAgLy8gMCA9IHVzZSB0eXBlIGFuZCBudW1Db21wb25lbnRzIGFib3ZlXHJcbiAgICBjb25zdCBvZmZzZXQgPSAwOyAvLyBob3cgbWFueSBieXRlcyBpbnNpZGUgdGhlIGJ1ZmZlciB0byBzdGFydCBmcm9tXHJcbiAgICBnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKFxyXG4gICAgICBwcm9ncmFtSW5mby5hdHRyaWJMb2NhdGlvbnMudmVydGV4UG9zaXRpb24sXHJcbiAgICAgIG51bUNvbXBvbmVudHMsXHJcbiAgICAgIHR5cGUsXHJcbiAgICAgIG5vcm1hbGl6ZSxcclxuICAgICAgc3RyaWRlLFxyXG4gICAgICBvZmZzZXQsXHJcbiAgICApO1xyXG5cclxuICAgIFxyXG4gICAgZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkocHJvZ3JhbUluZm8uYXR0cmliTG9jYXRpb25zLnZlcnRleENvbG9yKTtcclxuICAgIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBjb2xvckJ1ZmZlcik7XHJcbiAgICBvYmplY3QuYWRkQ29sb3IoZ2wpO1xyXG4gICAgY29uc3QgY29sb3JTaXplID0gNDsgLyogNCBjb21wb25lbnRzIHBlciBpdGVyYXRpb24gKi9cclxuICAgIGNvbnN0IGNvbG9yVHlwZSA9IGdsLkZMT0FUOyAvKiBUaGUgZGF0YSBpcyAzMiBiaXQgZmxvYXQgKi9cclxuICAgIGNvbnN0IGNvbG9yTm9ybWFsaXplZCA9IGZhbHNlOyAvKiBEb24ndCBub3JtYWxpemUgdGhlIGRhdGEgKi9cclxuICAgIGNvbnN0IGNvbG9yU3RyaWRlID0gMDsgLyogMDogTW92ZSBmb3J3YXJkIHNpemUgKiBzaXplb2YodHlwZSkgZWFjaCBpdGVyYXRpb24gdG8gZ2V0IHRoZSBuZXh0IHBvc2l0aW9uICovXHJcbiAgICBjb25zdCBjb2xvck9mZnNldCA9IDA7IC8qIFN0YXJ0IGF0IHRoZSBiZWdpbm5pbmcgb2YgdGhlIGJ1ZmZlciAqL1xyXG4gICAgZ2wudmVydGV4QXR0cmliUG9pbnRlcihcclxuICAgICAgcHJvZ3JhbUluZm8uYXR0cmliTG9jYXRpb25zLnZlcnRleENvbG9yLFxyXG4gICAgICBjb2xvclNpemUsXHJcbiAgICAgIGNvbG9yVHlwZSxcclxuICAgICAgY29sb3JOb3JtYWxpemVkLFxyXG4gICAgICBjb2xvclN0cmlkZSxcclxuICAgICAgY29sb3JPZmZzZXRcclxuICAgICk7XHJcbiAgICBcclxuICAgIFxyXG4gICAgLy8gQWRkIE1hdHJpeCB0byBnbFxyXG4gICAgY29uc3QgbWF0cml4TG9jYXRpb24gPSBwcm9ncmFtSW5mby51bmlmb3JtTG9jYXRpb25zLm1hdHJpeExvY2F0aW9uXHJcbiAgICBvYmplY3QuYWRkTWF0cml4KGdsLCBtYXRyaXhMb2NhdGlvbik7XHJcbiAgICAvKiBEcmF3IHNjZW5lICovXHJcbiAgICBjb25zdCBwcmltaXRpdmVUeXBlID0gb2JqZWN0LmRyYXdNZXRob2QoZ2wpO1xyXG4gICAgLy8gY29uc3Qgb2Zmc2V0ID0gMDtcclxuICAgIGNvbnN0IG51bWJlck9mVmVydGljZXNUb0JlRHJhd24gPSBvYmplY3QuZ2V0TnVtYmVyT2ZWZXJ0aWNlc1RvQmVEcmF3bigpO1xyXG4gICAgZ2wuZHJhd0FycmF5cyhwcmltaXRpdmVUeXBlLCBvZmZzZXQsIG51bWJlck9mVmVydGljZXNUb0JlRHJhd24pO1xyXG59IiwiaW1wb3J0IE1hdHJpeCBmcm9tIFwiQmFzZS9tYXRyaXhcIjtcclxuaW1wb3J0IFBvaW50IGZyb20gXCJCYXNlL3BvaW50XCI7XHJcblxyXG5cclxuY2xhc3MgVHJhbnNmb3JtYXRpb257XHJcbiAgICBwdWJsaWMgc3RhdGljIHByb2plY3Rpb24od2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpOiBNYXRyaXgge1xyXG4gICAgICAgIGNvbnN0IG1hdHJpeCA9IG5ldyBNYXRyaXgoWzIvd2lkdGgsIDAsIDBdLCBbMCwgLTIvaGVpZ2h0LCAwXSwgWy0xLCAxLCAxXSk7XHJcbiAgICAgICAgcmV0dXJuIG1hdHJpeDtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzdGF0aWMgdHJhbnNsYXRpb24odHg6IG51bWJlciwgdHk6IG51bWJlcik6IE1hdHJpeCB7XHJcbiAgICAgICAgY29uc3QgbWF0cml4ID0gbmV3IE1hdHJpeChbMSwwLDBdLCBbMCwgMSwgMF0sIFt0eCwgdHksIDFdKTtcclxuICAgICAgICByZXR1cm4gbWF0cml4O1xyXG4gICAgfVxyXG4gICAgcHVibGljIHN0YXRpYyByb3RhdGlvbihkZWdyZWU6IG51bWJlcik6IE1hdHJpeCB7XHJcbiAgICAgICAgY29uc3QgbWF0cml4ID0gbmV3IE1hdHJpeChbTWF0aC5jb3MoZGVncmVlKSwgTWF0aC5zaW4oZGVncmVlKSwgMF0sIFstTWF0aC5zaW4oZGVncmVlKSwgTWF0aC5jb3MoZGVncmVlKSwgMF0sIFswLCAwLCAxXSk7XHJcbiAgICAgICAgcmV0dXJuIG1hdHJpeDtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzdGF0aWMgc2NhbGUoc3g6IG51bWJlciwgc3k6IG51bWJlcik6IE1hdHJpeCB7XHJcbiAgICAgICAgY29uc3QgbWF0cml4ID0gbmV3IE1hdHJpeChbc3gsMCwwXSwgWzAsIHN5LCAwXSwgWzAsIDAsIDFdKTtcclxuICAgICAgICByZXR1cm4gbWF0cml4XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc3RhdGljIHNoZWFyWChreDogbnVtYmVyKTogTWF0cml4IHtcclxuICAgICAgICBjb25zdCBtYXRyaXggPSBuZXcgTWF0cml4KFsxLCAwLCAwXSwgW2t4LCAxLCAwXSwgWzAsIDAsIDFdKTtcclxuICAgICAgICByZXR1cm4gbWF0cml4O1xyXG4gICAgfVxyXG4gICAgcHVibGljIHN0YXRpYyBzaGVhclkoa3k6IG51bWJlcik6IE1hdHJpeCB7XHJcbiAgICAgICAgY29uc3QgbWF0cml4ID0gbmV3IE1hdHJpeChbMSwga3ksIDBdLCBbMCwgMSwgMF0sIFswLCAwLCAxXSk7XHJcbiAgICAgICAgcmV0dXJuIG1hdHJpeDtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzdGF0aWMgdHJhbnNmb3JtYXRpb25NYXRyaXgoXHJcbiAgICAgICAgd2lkdGg6IG51bWJlcixcclxuICAgICAgICBoZWlnaHQ6IG51bWJlcixcclxuICAgICAgICB0eDogbnVtYmVyLFxyXG4gICAgICAgIHR5OiBudW1iZXIsXHJcbiAgICAgICAgZGVncmVlOiBudW1iZXIsXHJcbiAgICAgICAgc3g6IG51bWJlcixcclxuICAgICAgICBzeTogbnVtYmVyLFxyXG4gICAgICAgIGt4OiBudW1iZXIsXHJcbiAgICAgICAga3k6IG51bWJlcixcclxuICAgICAgICBjZW50ZXI6IFBvaW50XHJcbiAgICApIDogTWF0cml4IHtcclxuICAgICAgICByZXR1cm4gVHJhbnNmb3JtYXRpb24ucHJvamVjdGlvbih3aWR0aCwgaGVpZ2h0KVxyXG4gICAgICAgIC5tdWx0aXBseU1hdHJpeChUcmFuc2Zvcm1hdGlvbi50cmFuc2xhdGlvbih0eCwgdHkpKVxyXG4gICAgICAgIC5tdWx0aXBseU1hdHJpeChUcmFuc2Zvcm1hdGlvbi50cmFuc2xhdGlvbihjZW50ZXIuZ2V0WCgpLCBjZW50ZXIuZ2V0WSgpKSlcclxuICAgICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24ucm90YXRpb24oZGVncmVlKSlcclxuICAgICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24uc2NhbGUoc3gsIHN5KSlcclxuICAgICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24uc2hlYXJYKGt4KSlcclxuICAgICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24uc2hlYXJZKGt5KSlcclxuICAgICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24udHJhbnNsYXRpb24oLWNlbnRlci5nZXRYKCksIC1jZW50ZXIuZ2V0WSgpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBpbnZlcnNlVHJhbnNmb3JtYXRpb25NYXRyaXgoXHJcbiAgICAgICAgd2lkdGg6IG51bWJlcixcclxuICAgICAgICBoZWlnaHQ6IG51bWJlcixcclxuICAgICAgICB0eDogbnVtYmVyLFxyXG4gICAgICAgIHR5OiBudW1iZXIsXHJcbiAgICAgICAgZGVncmVlOiBudW1iZXIsXHJcbiAgICAgICAgc3g6IG51bWJlcixcclxuICAgICAgICBzeTogbnVtYmVyLFxyXG4gICAgICAgIGt4OiBudW1iZXIsXHJcbiAgICAgICAga3k6IG51bWJlcixcclxuICAgICAgICBjZW50ZXI6IFBvaW50XHJcbiAgICApIDogTWF0cml4IHtcclxuICAgICAgICByZXR1cm4gVHJhbnNmb3JtYXRpb24udHJhbnNsYXRpb24oY2VudGVyLmdldFgoKSwgY2VudGVyLmdldFkoKSlcclxuICAgICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24uc2hlYXJZKC1reSkpXHJcbiAgICAgICAgLm11bHRpcGx5TWF0cml4KFRyYW5zZm9ybWF0aW9uLnNoZWFyWCgta3gpKVxyXG4gICAgICAgIC5tdWx0aXBseU1hdHJpeChUcmFuc2Zvcm1hdGlvbi5zY2FsZSgxIC8gc3gsIDEgLyBzeSkpXHJcbiAgICAgICAgLm11bHRpcGx5TWF0cml4KFRyYW5zZm9ybWF0aW9uLnJvdGF0aW9uKC1kZWdyZWUpKVxyXG4gICAgICAgIC5tdWx0aXBseU1hdHJpeChUcmFuc2Zvcm1hdGlvbi50cmFuc2xhdGlvbigtY2VudGVyLmdldFgoKSwgLWNlbnRlci5nZXRZKCkpKVxyXG4gICAgICAgIC5tdWx0aXBseU1hdHJpeChUcmFuc2Zvcm1hdGlvbi50cmFuc2xhdGlvbigtdHgsIC10eSkpXHJcbiAgICAgICAgLy8gLm11bHRpcGx5TWF0cml4KFRyYW5zZm9ybWF0aW9uLnByb2plY3Rpb24oMSAvIHdpZHRoLCAxIC8gaGVpZ2h0KSk7XHJcbiAgICB9XHJcblxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IFRyYW5zZm9ybWF0aW9uOyIsImltcG9ydCBQb2ludCBmcm9tIFwiQmFzZS9wb2ludFwiXHJcblxyXG5mdW5jdGlvbiBvcmllbnRhdGlvbihwOiBQb2ludCwgcTogUG9pbnQsIHI6IFBvaW50KTogbnVtYmVyIHtcclxuICAgIGNvbnN0IHZhbCA9IChxLnkgLSBwLnkpICogKHIueCAtIHEueCkgLSAocS54IC0gcC54KSAqIChyLnkgLSBxLnkpO1xyXG5cclxuICAgIGlmICh2YWwgPT09IDApIHJldHVybiAwO1xyXG5cclxuICAgIHJldHVybiB2YWwgPiAwID8gMSA6IDI7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNvbnZleEh1bGwocG9pbnRzOiBQb2ludFtdKTogUG9pbnRbXSB7XHJcbiAgICBjb25zdCBuID0gcG9pbnRzLmxlbmd0aDtcclxuICAgIGlmIChuIDwgMykgcmV0dXJuIFtdO1xyXG5cclxuICAgIGNvbnN0IGh1bGw6IFBvaW50W10gPSBbXTtcclxuICAgIGxldCBsID0gMDtcclxuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgaWYgKHBvaW50c1tpXS54IDwgcG9pbnRzW2xdLngpIHtcclxuICAgICAgICAgICAgbCA9IGk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGxldCBwID0gbDtcclxuICAgIGxldCBxOiBudW1iZXI7XHJcbiAgICBkbyB7XHJcbiAgICAgICAgaHVsbC5wdXNoKHBvaW50c1twXSk7XHJcbiAgICAgICAgcSA9IChwICsgMSkgJSBuO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChvcmllbnRhdGlvbihwb2ludHNbcF0sIHBvaW50c1tpXSwgcG9pbnRzW3FdKSA9PT0gMikge1xyXG4gICAgICAgICAgICAgICAgcSA9IGk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcCA9IHE7XHJcbiAgICB9IHdoaWxlIChwICE9PSBsKTtcclxuXHJcbiAgICByZXR1cm4gaHVsbDtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY29udmV4SHVsbDtcclxuXHJcbiIsImZ1bmN0aW9uIHJnYlRvSGV4KHJnYmEgOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSkge1xyXG4gICAgY29uc3QgaGV4UiA9IChyZ2JhWzBdICogMjU1KS50b1N0cmluZygxNikucGFkU3RhcnQoMiwgJzAnKTtcclxuICAgIGNvbnN0IGhleEcgPSAocmdiYVsxXSAqIDI1NSkudG9TdHJpbmcoMTYpLnBhZFN0YXJ0KDIsICcwJyk7XHJcbiAgICBjb25zdCBoZXhCID0gKHJnYmFbMl0gKiAyNTUpLnRvU3RyaW5nKDE2KS5wYWRTdGFydCgyLCAnMCcpO1xyXG5cclxuICAgIC8vIENvbmNhdGVuYXRlIHRoZSBoZXhhZGVjaW1hbCBjb21wb25lbnRzXHJcbiAgICBjb25zdCBoZXhDb2xvciA9IGAjJHtoZXhSfSR7aGV4R30ke2hleEJ9YDtcclxuXHJcbiAgICByZXR1cm4gaGV4Q29sb3I7XHJcbn1cclxuICBcclxuZnVuY3Rpb24gaGV4VG9SZ2IoaGV4OiBzdHJpbmcpOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSB7XHJcbiAgICBjb25zdCByID0gcGFyc2VJbnQoaGV4LnNsaWNlKDEsIDMpLCAxNik7XHJcbiAgICBjb25zdCBnID0gcGFyc2VJbnQoaGV4LnNsaWNlKDMsIDUpLCAxNik7XHJcbiAgICBjb25zdCBiID0gcGFyc2VJbnQoaGV4LnNsaWNlKDUsIDcpLCAxNik7XHJcbiAgXHJcbiAgICByZXR1cm4gW3IgLyAyNTUsIGcgLyAyNTUsIGIgLyAyNTUsIDFdO1xyXG59XHJcbiAgXHJcbmV4cG9ydCB7IHJnYlRvSGV4LCBoZXhUb1JnYiB9O1xyXG4gICIsImltcG9ydCBSZW5kZXJhYmxlIGZyb20gXCJJbnRlcmZhY2VzL3JlbmRlcmFibGUuaW50ZXJmYWNlXCI7XHJcbmltcG9ydCBUcmFuc2Zvcm1hYmxlIGZyb20gXCJJbnRlcmZhY2VzL3RyYW5zZm9ybWFibGUuaW50ZXJmYWNlXCI7XHJcbmltcG9ydCBTaGFwZSBmcm9tIFwiU2hhcGVzL3NoYXBlXCI7XHJcbmltcG9ydCBMaW5lIGZyb20gXCJTaGFwZXMvbGluZVwiO1xyXG5pbXBvcnQgU3F1YXJlIGZyb20gXCJTaGFwZXMvc3F1YXJlXCI7XHJcbmltcG9ydCBSZWN0YW5nbGUgZnJvbSBcIlNoYXBlcy9yZWN0YW5nbGVcIjtcclxuaW1wb3J0IFBvaW50IGZyb20gXCJCYXNlL3BvaW50XCI7XHJcbmltcG9ydCBQb2x5Z29uIGZyb20gXCJTaGFwZXMvcG9seWdvblwiO1xyXG5pbXBvcnQgVHlwZSBmcm9tIFwiU2hhcGVzL3R5cGUuZW51bVwiO1xyXG5pbXBvcnQgeyBjcmVhdGVTaGFkZXJQcm9ncmFtIH0gZnJvbSBcIkZ1bmN0aW9ucy9jcmVhdGUtc2hhZGVyLXByb2dyYW1cIjtcclxuaW1wb3J0IFByb2dyYW1JbmZvIGZyb20gXCJGdW5jdGlvbnMvcHJvZ3JhbS1pbmZvLmludGVyZmFjZVwiO1xyXG5pbXBvcnQgeyBzZXRBdHRyaWJ1dGVzIH0gZnJvbSBcIi4vRnVuY3Rpb25zL3NldC1hdHRyaWJ1dGVzXCI7XHJcbmltcG9ydCB7IHNldHVwQ2FudmFzIH0gZnJvbSBcIi4vRnVuY3Rpb25zL3NldHVwLWNhbnZhc1wiO1xyXG5pbXBvcnQgVHJhbnNmb3JtYXRpb24gZnJvbSBcIk9wZXJhdGlvbnMvVHJhbnNmb3JtYXRpb25cIjtcclxuaW1wb3J0IHsgaGV4VG9SZ2IsIHJnYlRvSGV4IH0gZnJvbSBcIlV0aWxzL3Rvb2xzXCI7XHJcbmltcG9ydCB7IHJlbmRlciB9IGZyb20gXCJGdW5jdGlvbnMvcmVuZGVyXCI7XHJcbmltcG9ydCB7IHJlbmRlckFsbCB9IGZyb20gXCJGdW5jdGlvbnMvcmVuZGVyLWFsbFwiO1xyXG5cclxuY29uc3QgY2FudmFzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjYW52YXNcIikgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XHJcbi8vIEluaXRpYWxpemUgdGhlIEdMIGNvbnRleHRcclxuY29uc3QgZ2wgPSBjYW52YXMuZ2V0Q29udGV4dChcIndlYmdsXCIpO1xyXG5cclxuLy8gT25seSBjb250aW51ZSBpZiBXZWJHTCBpcyBhdmFpbGFibGUgYW5kIHdvcmtpbmdcclxuaWYgKGdsID09PSBudWxsKSB7XHJcbiAgYWxlcnQoXHJcbiAgICBcIlVuYWJsZSB0byBpbml0aWFsaXplIFdlYkdMLiBZb3VyIGJyb3dzZXIgb3IgbWFjaGluZSBtYXkgbm90IHN1cHBvcnQgaXQuXCJcclxuICApO1xyXG59XHJcblxyXG5cclxuLy8gVmVydGV4IHNoYWRlciBwcm9ncmFtXHJcbmNvbnN0IHZzU291cmNlID0gYFxyXG4gICAgYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1xyXG4gICAgYXR0cmlidXRlIHZlYzQgYVZlcnRleENvbG9yO1xyXG4gICAgdW5pZm9ybSBtYXQzIHVNYXRyaXg7XHJcbiAgICB2YXJ5aW5nIHZlYzQgdkNvbG9yO1xyXG5cclxuICAgIHZvaWQgbWFpbigpIHtcclxuICAgICAgICAvLyBub3RlOiBZIGF4aXMgbXVzdCBiZSBpbnZlcnRlZCB0byByZXBsaWNhdGUgdHJhZGl0aW9uYWwgdmlld1xyXG4gICAgICAgIGdsX1Bvc2l0aW9uID0gdmVjNCgodU1hdHJpeCAqIHZlYzMoYVZlcnRleFBvc2l0aW9uLCAxKSkueHksIDAsIDEpO1xyXG5cclxuICAgICAgICAvLyBDaGFuZ2UgY29sb3Igb2Ygc2hhcGVcclxuICAgICAgICB2Q29sb3IgPSBhVmVydGV4Q29sb3I7XHJcbiAgICB9XHJcbmA7XHJcblxyXG5jb25zdCBmc1NvdXJjZSA9IGBcclxuICAgIHByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xyXG4gICAgdmFyeWluZyB2ZWM0IHZDb2xvcjtcclxuXHJcbiAgICB2b2lkIG1haW4oKSB7XHJcbiAgICAgICAgZ2xfRnJhZ0NvbG9yID0gdkNvbG9yO1xyXG4gICAgfVxyXG5gO1xyXG5jb25zdCBzaGFkZXJQcm9ncmFtID0gY3JlYXRlU2hhZGVyUHJvZ3JhbShnbCwgdnNTb3VyY2UsIGZzU291cmNlKTtcclxuXHJcbi8vIENvbGxlY3QgYWxsIHRoZSBpbmZvIG5lZWRlZCB0byB1c2UgdGhlIHNoYWRlciBwcm9ncmFtLlxyXG4vLyBMb29rIHVwIHdoaWNoIGF0dHJpYnV0ZSBvdXIgc2hhZGVyIHByb2dyYW0gaXMgdXNpbmdcclxuLy8gZm9yIGFWZXJ0ZXhQb3NpdGlvbiBhbmQgbG9vayB1cCB1bmlmb3JtIGxvY2F0aW9ucy5cclxuY29uc3QgcHJvZ3JhbUluZm8gPSB7XHJcbiAgcHJvZ3JhbTogc2hhZGVyUHJvZ3JhbSxcclxuICBhdHRyaWJMb2NhdGlvbnM6IHtcclxuICAgIHZlcnRleFBvc2l0aW9uOiBnbC5nZXRBdHRyaWJMb2NhdGlvbihzaGFkZXJQcm9ncmFtLCBcImFWZXJ0ZXhQb3NpdGlvblwiKSxcclxuICAgIHZlcnRleENvbG9yOiBnbC5nZXRBdHRyaWJMb2NhdGlvbihzaGFkZXJQcm9ncmFtLCBcImFWZXJ0ZXhDb2xvclwiKSxcclxuICB9LFxyXG4gIHVuaWZvcm1Mb2NhdGlvbnM6IHtcclxuICAgIG1hdHJpeExvY2F0aW9uOiBnbC5nZXRVbmlmb3JtTG9jYXRpb24oc2hhZGVyUHJvZ3JhbSwgXCJ1TWF0cml4XCIpLFxyXG4gIH0sXHJcbn07XHJcblxyXG4vLyBUZWxsIFdlYkdMIHRvIHVzZSBvdXIgcHJvZ3JhbSB3aGVuIGRyYXdpbmdcclxuZ2wudXNlUHJvZ3JhbShzaGFkZXJQcm9ncmFtKTtcclxuXHJcbmNvbnN0IHdpZHRoID0gKGdsLmNhbnZhcyBhcyBIVE1MQ2FudmFzRWxlbWVudCkuY2xpZW50V2lkdGg7XHJcbmNvbnN0IGhlaWdodCA9IChnbC5jYW52YXMgYXMgSFRNTENhbnZhc0VsZW1lbnQpLmNsaWVudEhlaWdodDtcclxuY2FudmFzLndpZHRoID0gd2lkdGg7XHJcbmNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbi8vIFNldCBjbGVhciBjb2xvciB0byBibGFjaywgZnVsbHkgb3BhcXVlXHJcbmdsLmNsZWFyQ29sb3IoMS4wLCAxLjAsIDEuMCwgMS4wKTtcclxuLy8gQ2xlYXIgdGhlIGNvbG9yIGJ1ZmZlciB3aXRoIHNwZWNpZmllZCBjbGVhciBjb2xvclxyXG5cclxuXHJcbmdsLnZpZXdwb3J0KDAsIDAsIGdsLmNhbnZhcy53aWR0aCwgZ2wuY2FudmFzLmhlaWdodCk7IC8vIHNldHMgdGhlIHZpZXdwb3J0IHRvIGNvdmVyIHRoZSBlbnRpcmUgY2FudmFzLCBzdGFydGluZyBmcm9tIHRoZSBsb3dlci1sZWZ0IGNvcm5lciBhbmQgZXh0ZW5kaW5nIHRvIHRoZSBjYW52YXMncyB3aWR0aCBhbmQgaGVpZ2h0LlxyXG5cclxuLy8gQ2xlYXIgdGhlIGNhbnZhcyBiZWZvcmUgd2Ugc3RhcnQgZHJhd2luZyBvbiBpdC5cclxuZ2wuY2xlYXIoZ2wuQ09MT1JfQlVGRkVSX0JJVCk7XHJcblxyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLyBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhbnZhc1wiKSBhcyBIVE1MQ2FudmFzRWxlbWVudDtcclxubGV0IHNoYXBlczogKFNoYXBlICYgUmVuZGVyYWJsZSAmIFRyYW5zZm9ybWFibGUpW10gPSBbXTtcclxubGV0IHR5cGU6IFR5cGU7XHJcbmxldCBpc0RyYXdpbmcgPSBmYWxzZTtcclxuXHJcbi8qIFNldHVwIFZpZXdwb3J0ICovXHJcblxyXG5jb25zdCBwb3NpdGlvbkJ1ZmZlciA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xyXG5jb25zdCBjb2xvckJ1ZmZlciA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xyXG4vLyBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgcG9zaXRpb25CdWZmZXIpO1xyXG4vLyBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgY29sb3JCdWZmZXIpO1xyXG4vLyBzZXRBdHRyaWJ1dGVzKGdsLCBwb3NpdGlvbkJ1ZmZlciwgY29sb3JCdWZmZXIsIHByb2dyYW1JbmZvKTtcclxuXHJcbmxldCBjdXJyZW50T2JqZWN0OiBTaGFwZSAmIFJlbmRlcmFibGUgJiBUcmFuc2Zvcm1hYmxlO1xyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gRml4IEhUTUwgRWxlbWVudHMgRXZlbnQgTGlzdGVuZXJzXHJcblxyXG4vKiBMaXN0IG9mIFNoYXBlcyBMaXN0ZW5lciAqL1xyXG5jb25zdCBsaXN0T2ZTaGFwZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxpc3Qtb2Ytc2hhcGVzXCIpIGFzIEhUTUxTZWxlY3RFbGVtZW50O1xyXG5saXN0T2ZTaGFwZXMuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoKSA9PiB7XHJcbiAgcmVuZGVyQWxsKGdsLCBwcm9ncmFtSW5mbywgc2hhcGVzLCBwb3NpdGlvbkJ1ZmZlciwgY29sb3JCdWZmZXIpO1xyXG4gIGNvbnN0IGluZGV4OiBudW1iZXIgPSArbGlzdE9mU2hhcGVzLnNlbGVjdGVkT3B0aW9uc1swXS52YWx1ZTtcclxuICBpc0RyYXdpbmcgPSBmYWxzZTtcclxuXHJcbiAgc2V0dXBTZWxlY3RvcihnbCwgcHJvZ3JhbUluZm8sIHNoYXBlc1tpbmRleF0pO1xyXG59KTtcclxuXHJcbi8qIEJ1dHRvbiBMaXN0ZW5lciAqL1xyXG5jb25zdCBsaW5lQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsaW5lLWJ0blwiKTtcclxubGluZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gIHJlbmRlckFsbChnbCwgcHJvZ3JhbUluZm8sIHNoYXBlcywgcG9zaXRpb25CdWZmZXIsIGNvbG9yQnVmZmVyKTtcclxuICB0eXBlID0gVHlwZS5MaW5lO1xyXG4gIGlzRHJhd2luZyA9IGZhbHNlO1xyXG59KTtcclxuXHJcbmNvbnN0IHNxdWFyZUJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3F1YXJlLWJ0blwiKTtcclxuc3F1YXJlQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgcmVuZGVyQWxsKGdsLCBwcm9ncmFtSW5mbywgc2hhcGVzLCBwb3NpdGlvbkJ1ZmZlciwgY29sb3JCdWZmZXIpO1xyXG4gIHR5cGUgPSBUeXBlLlNxdWFyZTtcclxuICBpc0RyYXdpbmcgPSBmYWxzZTtcclxufSk7XHJcblxyXG5jb25zdCByZWN0YW5nbGVCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlY3RhbmdsZS1idG5cIik7XHJcbnJlY3RhbmdsZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gIHJlbmRlckFsbChnbCwgcHJvZ3JhbUluZm8sIHNoYXBlcywgcG9zaXRpb25CdWZmZXIsIGNvbG9yQnVmZmVyKTtcclxuICB0eXBlID0gVHlwZS5SZWN0YW5nbGU7XHJcbiAgaXNEcmF3aW5nID0gZmFsc2U7XHJcbn0pO1xyXG5cclxuY29uc3QgcG9seWdvbkJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicG9seWdvbi1idG5cIik7XHJcbnBvbHlnb25CdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICByZW5kZXJBbGwoZ2wsIHByb2dyYW1JbmZvLCBzaGFwZXMsIHBvc2l0aW9uQnVmZmVyLCBjb2xvckJ1ZmZlcik7XHJcbiAgdHlwZSA9IFR5cGUuUG9seWdvbjtcclxuICBpc0RyYXdpbmcgPSBmYWxzZTtcclxuICAvLyBpc0ZpcnN0RHJhd2luZyA9IHRydWU7XHJcbn0pO1xyXG5cclxuY29uc3Qgc2F2ZUJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2F2ZS1idG5cIik7XHJcbnNhdmVCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICByZW5kZXJBbGwoZ2wsIHByb2dyYW1JbmZvLCBzaGFwZXMsIHBvc2l0aW9uQnVmZmVyLCBjb2xvckJ1ZmZlcik7XHJcbiAgY29uc3QgdGV4dCA9IHN0b3JlU2hhcGVzKHNoYXBlcyk7XHJcbiAgaGFuZGxlRG93bmxvYWQodGV4dCk7XHJcbn0pO1xyXG5cclxuY29uc3QgdXBsb2FkQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1cGxvYWQtYnRuXCIpO1xyXG51cGxvYWRCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICBoYW5kbGVVcGxvYWQoKHRleHQpID0+IHtcclxuICAgIHNoYXBlcyA9IGxvYWRTaGFwZSh0ZXh0KTtcclxuXHJcbiAgICBmb3IgKGNvbnN0IHNoYXBlIG9mIHNoYXBlcykge1xyXG4gICAgICBzZXR1cE9wdGlvbih0cnVlLCBzaGFwZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyQWxsKGdsLCBwcm9ncmFtSW5mbywgc2hhcGVzLCBwb3NpdGlvbkJ1ZmZlciwgY29sb3JCdWZmZXIpO1xyXG4gIH0pO1xyXG59KTtcclxuXHJcbi8qIENhbnZhcyBMaXN0ZW5lciAqL1xyXG5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCAoZXZlbnQpID0+IHtcclxuICBjb25zdCB4ID0gZXZlbnQuY2xpZW50WDtcclxuICBjb25zdCB5ID0gZXZlbnQuY2xpZW50WTtcclxuICBjb25zdCBwb2ludCA9IG5ldyBQb2ludChbeCwgeV0pO1xyXG5cclxuICBpZiAoaXNEcmF3aW5nKSB7XHJcbiAgICBpZiAoY3VycmVudE9iamVjdC50eXBlICE9PSBUeXBlLlBvbHlnb24pIHtcclxuICAgICAgY3VycmVudE9iamVjdC5kcmF3KHBvaW50KTtcclxuICAgICAgc2V0dXBPcHRpb24odHJ1ZSwgY3VycmVudE9iamVjdCk7XHJcbiAgICAgIHNoYXBlcy5wdXNoKGN1cnJlbnRPYmplY3QpO1xyXG4gICAgICBpc0RyYXdpbmcgPSBmYWxzZTtcclxuICAgICAgY3VycmVudE9iamVjdCA9IG51bGw7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAoY3VycmVudE9iamVjdC5pZCA9PSBzaGFwZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgY3VycmVudE9iamVjdC5kcmF3KHBvaW50KTtcclxuICAgICAgICAvLyBiZWx1bSBkaXB1c2gga2Ugc2hhcGVzXHJcbiAgICAgICAgaWYgKGN1cnJlbnRPYmplY3QuYXJyYXlPZlBvaW50cy5sZW5ndGggPj0zKSB7XHJcbiAgICAgICAgICBzZXR1cE9wdGlvbih0cnVlLCBjdXJyZW50T2JqZWN0KTtcclxuICAgICAgICAgIC8vIHJlbmRlcihnbCwgcHJvZ3JhbUluZm8sIGN1cnJlbnRPYmplY3QsIHBvc2l0aW9uQnVmZmVyLCBjb2xvckJ1ZmZlcik7XHJcbiAgICAgICAgICBzaGFwZXMucHVzaChjdXJyZW50T2JqZWN0KTtcclxuICAgICAgICAgIHJlbmRlckFsbChnbCwgcHJvZ3JhbUluZm8sIHNoYXBlcywgcG9zaXRpb25CdWZmZXIsIGNvbG9yQnVmZmVyKTtcclxuICAgICAgICAgIGlzRHJhd2luZyA9IGZhbHNlO1xyXG4gICAgICAgICAgY3VycmVudE9iamVjdCA9IG51bGw7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJlbmRlckFsbChnbCwgcHJvZ3JhbUluZm8sIHNoYXBlcywgcG9zaXRpb25CdWZmZXIsIGNvbG9yQnVmZmVyKTtcclxuICAgICAgICAgIHJlbmRlcihnbCwgcHJvZ3JhbUluZm8sIGN1cnJlbnRPYmplY3QsIHBvc2l0aW9uQnVmZmVyLCBjb2xvckJ1ZmZlcik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IG1hdHJpeCA9IFRyYW5zZm9ybWF0aW9uLmludmVyc2VUcmFuc2Zvcm1hdGlvbk1hdHJpeChcclxuICAgICAgICAgIGdsLmNhbnZhcy53aWR0aCxcclxuICAgICAgICAgIGdsLmNhbnZhcy5oZWlnaHQsXHJcbiAgICAgICAgICBjdXJyZW50T2JqZWN0LnR4LFxyXG4gICAgICAgICAgY3VycmVudE9iamVjdC50eSxcclxuICAgICAgICAgIGN1cnJlbnRPYmplY3QuZGVncmVlLFxyXG4gICAgICAgICAgY3VycmVudE9iamVjdC5zeCxcclxuICAgICAgICAgIGN1cnJlbnRPYmplY3Quc3ksXHJcbiAgICAgICAgICBjdXJyZW50T2JqZWN0Lmt4LFxyXG4gICAgICAgICAgY3VycmVudE9iamVjdC5reSxcclxuICAgICAgICAgIGN1cnJlbnRPYmplY3QuY2VudGVyXHJcbiAgICAgICAgKTtcclxuICAgICAgICBjb25zdCBwb2ludDIgPSBtYXRyaXgubXVsdGlwbHlQb2ludChwb2ludCk7XHJcbiAgICAgICAgY3VycmVudE9iamVjdC5kcmF3KHBvaW50Mik7XHJcbiAgICAgICAgc2V0dXBPcHRpb24oZmFsc2UsIGN1cnJlbnRPYmplY3QpO1xyXG4gICAgICAgIC8vIHJlbmRlcihnbCwgcHJvZ3JhbUluZm8sIGN1cnJlbnRPYmplY3QsIHBvc2l0aW9uQnVmZmVyLCBjb2xvckJ1ZmZlcik7XHJcbiAgICAgICAgcmVuZGVyQWxsKGdsLCBwcm9ncmFtSW5mbywgc2hhcGVzLCBwb3NpdGlvbkJ1ZmZlciwgY29sb3JCdWZmZXIpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICBjYXNlIFR5cGUuTGluZTpcclxuICAgICAgICBjdXJyZW50T2JqZWN0ID0gbmV3IExpbmUoc2hhcGVzLmxlbmd0aCwgcG9pbnQpO1xyXG4gICAgICAgIGlzRHJhd2luZyA9IHRydWU7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgVHlwZS5TcXVhcmU6XHJcbiAgICAgICAgY3VycmVudE9iamVjdCA9IG5ldyBTcXVhcmUoc2hhcGVzLmxlbmd0aCwgcG9pbnQpO1xyXG4gICAgICAgIGlzRHJhd2luZyA9IHRydWU7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgVHlwZS5SZWN0YW5nbGU6XHJcbiAgICAgICAgY3VycmVudE9iamVjdCA9IG5ldyBSZWN0YW5nbGUoc2hhcGVzLmxlbmd0aCwgcG9pbnQpO1xyXG4gICAgICAgIGlzRHJhd2luZyA9IHRydWU7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgVHlwZS5Qb2x5Z29uOlxyXG4gICAgICAgIGN1cnJlbnRPYmplY3QgPSBuZXcgUG9seWdvbihzaGFwZXMubGVuZ3RoLCBwb2ludCk7XHJcbiAgICAgICAgaXNEcmF3aW5nID0gdHJ1ZTtcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcbn0pO1xyXG5cclxuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgKGV2ZW50KSA9PiB7XHJcbiAgaWYgKGlzRHJhd2luZyAmJiBjdXJyZW50T2JqZWN0LnR5cGUgIT09IFR5cGUuUG9seWdvbikge1xyXG4gICAgY29uc3QgeCA9IGV2ZW50LmNsaWVudFg7XHJcbiAgICBjb25zdCB5ID0gZXZlbnQuY2xpZW50WTtcclxuICAgIGNvbnN0IHBvaW50ID0gbmV3IFBvaW50KFt4LCB5XSk7XHJcbiAgICBjdXJyZW50T2JqZWN0LmRyYXcocG9pbnQpO1xyXG4gICAgcmVuZGVyQWxsKGdsLCBwcm9ncmFtSW5mbywgc2hhcGVzLCBwb3NpdGlvbkJ1ZmZlciwgY29sb3JCdWZmZXIpO1xyXG4gICAgcmVuZGVyKGdsLCBwcm9ncmFtSW5mbywgY3VycmVudE9iamVjdCwgcG9zaXRpb25CdWZmZXIsIGNvbG9yQnVmZmVyKTtcclxuICB9XHJcbn0pO1xyXG5cclxuZnVuY3Rpb24gc2V0dXBPcHRpb24oXHJcbiAgaXNGaXJzdERyYXdpbmc6IGJvb2xlYW4sXHJcbiAgZWxlbWVudDogUmVuZGVyYWJsZSAmIFRyYW5zZm9ybWFibGUgJiBTaGFwZVxyXG4pOiB2b2lkIHtcclxuICBjb25zdCBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xyXG4gIG9wdGlvbi52YWx1ZSA9IGVsZW1lbnQuaWQudG9TdHJpbmcoKTtcclxuICBsZXQgb3B0aW9uVGV4dDogc3RyaW5nO1xyXG4gIHN3aXRjaCAoZWxlbWVudC50eXBlKSB7XHJcbiAgICBjYXNlIFR5cGUuTGluZTpcclxuICAgICAgb3B0aW9uVGV4dCA9IGBMaW5lXyR7ZWxlbWVudC5pZH1gO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgVHlwZS5TcXVhcmU6XHJcbiAgICAgIG9wdGlvblRleHQgPSBgU3F1YXJlXyR7ZWxlbWVudC5pZH1gO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgVHlwZS5SZWN0YW5nbGU6XHJcbiAgICAgIG9wdGlvblRleHQgPSBgUmVjdGFuZ2xlXyR7ZWxlbWVudC5pZH1gO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgVHlwZS5Qb2x5Z29uOlxyXG4gICAgICBvcHRpb25UZXh0ID0gYFBvbHlnb25fJHtlbGVtZW50LmlkfWA7XHJcbiAgICAgIGJyZWFrO1xyXG4gIH1cclxuICBvcHRpb24udGV4dCA9IG9wdGlvblRleHQ7XHJcblxyXG4gIGlmIChpc0ZpcnN0RHJhd2luZykge1xyXG4gICAgY29uc3QgbGlzdE9mU2hhcGVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgIFwibGlzdC1vZi1zaGFwZXNcIlxyXG4gICAgKSBhcyBIVE1MU2VsZWN0RWxlbWVudDtcclxuICAgIGxpc3RPZlNoYXBlcy5hcHBlbmRDaGlsZChvcHRpb24pO1xyXG4gICAgbGlzdE9mU2hhcGVzLnZhbHVlID0gZWxlbWVudC5pZC50b1N0cmluZygpO1xyXG4gIH1cclxuXHJcbiAgc2V0dXBTZWxlY3RvcihnbCwgcHJvZ3JhbUluZm8sIGVsZW1lbnQpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzZXR1cFNlbGVjdG9yKFxyXG4gIGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsXHJcbiAgcHJvZ3JhbUluZm86IFByb2dyYW1JbmZvLFxyXG4gIGVsZW1lbnQ6IFJlbmRlcmFibGUgJiBUcmFuc2Zvcm1hYmxlICYgU2hhcGVcclxuKTogdm9pZCB7XHJcbiAgY29uc3Qgc2xpZGVyWF9vcmlnaW5hbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2xpZGVyWFwiKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gIGNvbnN0IHNsaWRlclggPSBzbGlkZXJYX29yaWdpbmFsLmNsb25lTm9kZSh0cnVlKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gIHNsaWRlclhfb3JpZ2luYWwucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQoc2xpZGVyWCwgc2xpZGVyWF9vcmlnaW5hbCk7XHJcbiAgc2xpZGVyWC5taW4gPSBcIi02MDBcIjtcclxuICBzbGlkZXJYLm1heCA9IFwiNjAwXCI7XHJcbiAgc2xpZGVyWC52YWx1ZSA9IGVsZW1lbnQudHgudG9TdHJpbmcoKTtcclxuICBzbGlkZXJYLnN0ZXAgPSBcIjEwXCI7XHJcblxyXG4gIHNsaWRlclguYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIChldmVudCkgPT4ge1xyXG4gICAgY29uc3QgZGVsdGFYID0gKGV2ZW50LnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZTtcclxuICAgIGVsZW1lbnQudHggPSBOdW1iZXIoZGVsdGFYKTtcclxuICAgIHJlbmRlckFsbChnbCwgcHJvZ3JhbUluZm8sIHNoYXBlcywgcG9zaXRpb25CdWZmZXIsIGNvbG9yQnVmZmVyKTtcclxuICB9KTsgICBcclxuXHJcbiAgY29uc3Qgc2xpZGVyWV9vcmlnaW5hbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2xpZGVyWVwiKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gIGNvbnN0IHNsaWRlclkgPSBzbGlkZXJZX29yaWdpbmFsLmNsb25lTm9kZSh0cnVlKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gIHNsaWRlcllfb3JpZ2luYWwucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQoc2xpZGVyWSwgc2xpZGVyWV9vcmlnaW5hbCk7XHJcbiAgc2xpZGVyWS5taW4gPSBcIi02MDBcIjtcclxuICBzbGlkZXJZLm1heCA9IFwiNjAwXCI7XHJcbiAgc2xpZGVyWS52YWx1ZSA9ICgtZWxlbWVudC50eSkudG9TdHJpbmcoKTtcclxuICBzbGlkZXJZLnN0ZXAgPSBcIjEwXCI7XHJcbiAgc2xpZGVyWS5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgKGV2ZW50KSA9PiB7XHJcbiAgICBjb25zdCBkZWx0YVkgPSAoZXZlbnQudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlO1xyXG4gICAgZWxlbWVudC50eSA9IC1OdW1iZXIoZGVsdGFZKTtcclxuICAgIHJlbmRlckFsbChnbCwgcHJvZ3JhbUluZm8sIHNoYXBlcywgcG9zaXRpb25CdWZmZXIsIGNvbG9yQnVmZmVyKTtcclxuICB9KTtcclxuXHJcbiAgY29uc3Qgc2xpZGVyTGVuZ3RoX29yaWdpbmFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICBcInNsaWRlckxlbmd0aFwiXHJcbiAgKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gIGNvbnN0IHNsaWRlckxlbmd0aCA9IHNsaWRlckxlbmd0aF9vcmlnaW5hbC5jbG9uZU5vZGUodHJ1ZSkgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICBzbGlkZXJMZW5ndGhfb3JpZ2luYWwucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQoc2xpZGVyTGVuZ3RoLCBzbGlkZXJMZW5ndGhfb3JpZ2luYWwpO1xyXG4gIHNsaWRlckxlbmd0aC5taW4gPSBcIjBcIjtcclxuICBzbGlkZXJMZW5ndGgubWF4ID0gXCI2MDBcIjtcclxuICBsZXQgbGVuZ3RoOiBudW1iZXI7XHJcbiAgaWYgKGVsZW1lbnQudHlwZSA9PT0gVHlwZS5Qb2x5Z29uKSB7XHJcbiAgICBsZXQgbWluID0gSW5maW5pdHk7XHJcbiAgICBsZXQgbWF4ID0gLUluZmluaXR5O1xyXG5cclxuICAgIGZvciAoY29uc3QgcCBvZiBlbGVtZW50LmFycmF5T2ZQb2ludHMpIHtcclxuICAgICAgY29uc3QgW3BYXSA9IHAuZ2V0UGFpcigpO1xyXG4gICAgICBpZiAocFggPCBtaW4pIHtcclxuICAgICAgICBtaW4gPSBwWDtcclxuICAgICAgfVxyXG4gICAgICBpZiAocFggPiBtYXgpIHtcclxuICAgICAgICBtYXggPSBwWDtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgbGVuZ3RoID0gbWF4IC0gbWluO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBsZW5ndGggPSBNYXRoLnNxcnQoXHJcbiAgICAgIChlbGVtZW50LmFycmF5T2ZQb2ludHNbMF0ueCAtIGVsZW1lbnQuYXJyYXlPZlBvaW50c1sxXS54KSAqKiAyICtcclxuICAgICAgICAoZWxlbWVudC5hcnJheU9mUG9pbnRzWzBdLnkgLSBlbGVtZW50LmFycmF5T2ZQb2ludHNbMV0ueSkgKiogMlxyXG4gICAgKTtcclxuICB9XHJcbiAgc2xpZGVyTGVuZ3RoLnZhbHVlID0gKChlbGVtZW50LnN4IC0gMSkgKiBsZW5ndGgpLnRvU3RyaW5nKCk7XHJcbiAgc2xpZGVyTGVuZ3RoLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCAoZXZlbnQpID0+IHtcclxuICAgIGNvbnN0IGRlbHRhTGVuZ3RoID0gKGV2ZW50LnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZTtcclxuICAgIGVsZW1lbnQuc3ggPSAxICsgTnVtYmVyKGRlbHRhTGVuZ3RoKSAvIGxlbmd0aDtcclxuICAgIGlmIChlbGVtZW50LnR5cGUgPT0gVHlwZS5TcXVhcmUpe1xyXG4gICAgICBlbGVtZW50LnN5ID0gMSArIE51bWJlcihkZWx0YUxlbmd0aCkgLyBsZW5ndGg7XHJcbiAgICB9XHJcbiAgICByZW5kZXJBbGwoZ2wsIHByb2dyYW1JbmZvLCBzaGFwZXMsIHBvc2l0aW9uQnVmZmVyLCBjb2xvckJ1ZmZlcik7XHJcbiAgfSk7XHJcblxyXG4gIGNvbnN0IHNsaWRlcldpZHRoX29yaWdpbmFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICBcInNsaWRlcldpZHRoXCJcclxuICApIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgY29uc3Qgc2xpZGVyV2lkdGggPSBzbGlkZXJXaWR0aF9vcmlnaW5hbC5jbG9uZU5vZGUodHJ1ZSkgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICBzbGlkZXJXaWR0aF9vcmlnaW5hbC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChzbGlkZXJXaWR0aCwgc2xpZGVyV2lkdGhfb3JpZ2luYWwpO1xyXG4gIGlmKGVsZW1lbnQudHlwZSA9PSBUeXBlLkxpbmUgfHwgZWxlbWVudC50eXBlID09IFR5cGUuU3F1YXJlKSB7XHJcbiAgICBzbGlkZXJXaWR0aC5kaXNhYmxlZCA9IHRydWU7XHJcbiAgfSBlbHNlIHtcclxuICAgIHNsaWRlcldpZHRoLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgfVxyXG4gIHNsaWRlcldpZHRoLm1pbiA9IFwiMFwiO1xyXG4gIHNsaWRlcldpZHRoLm1heCA9IFwiNjAwXCI7XHJcbiAgbGV0IHdpZHRoOiBudW1iZXI7XHJcblxyXG4gIGlmIChlbGVtZW50LnR5cGUgPT0gVHlwZS5SZWN0YW5nbGUgfHwgZWxlbWVudC50eXBlID09IFR5cGUuU3F1YXJlKSB7XHJcbiAgICB3aWR0aCA9IE1hdGguc3FydChcclxuICAgICAgKGVsZW1lbnQuYXJyYXlPZlBvaW50c1swXS54IC0gZWxlbWVudC5hcnJheU9mUG9pbnRzWzNdLngpICoqIDIgK1xyXG4gICAgICAgIChlbGVtZW50LmFycmF5T2ZQb2ludHNbMF0ueSAtIGVsZW1lbnQuYXJyYXlPZlBvaW50c1szXS55KSAqKiAyXHJcbiAgICApO1xyXG4gIH0gZWxzZSBpZiAoZWxlbWVudC50eXBlID09IFR5cGUuUG9seWdvbikge1xyXG4gICAgbGV0IG1pbiA9IEluZmluaXR5O1xyXG4gICAgbGV0IG1heCA9IC1JbmZpbml0eTtcclxuXHJcbiAgICBmb3IgKGNvbnN0IHAgb2YgZWxlbWVudC5hcnJheU9mUG9pbnRzKSB7XHJcbiAgICAgIGNvbnN0IFssIHBZXSA9IHAuZ2V0UGFpcigpO1xyXG4gICAgICBpZiAocFkgPCBtaW4pIHtcclxuICAgICAgICBtaW4gPSBwWTtcclxuICAgICAgfVxyXG4gICAgICBpZiAocFkgPiBtYXgpIHtcclxuICAgICAgICBtYXggPSBwWTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgd2lkdGggPSBtYXggLSBtaW47XHJcbiAgfSBcclxuICBzbGlkZXJXaWR0aC52YWx1ZSA9ICgoZWxlbWVudC5zeSAtIDEpICogd2lkdGgpLnRvU3RyaW5nKCk7XHJcbiAgc2xpZGVyV2lkdGguYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIChldmVudCkgPT4ge1xyXG4gICAgY29uc3QgZGVsdGFXaWR0aCA9IChldmVudC50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWU7XHJcbiAgICBlbGVtZW50LnN5ID0gMSArIE51bWJlcihkZWx0YVdpZHRoKSAvIHdpZHRoO1xyXG4gICAgcmVuZGVyQWxsKGdsLCBwcm9ncmFtSW5mbywgc2hhcGVzLCBwb3NpdGlvbkJ1ZmZlciwgY29sb3JCdWZmZXIpO1xyXG4gIH0pO1xyXG5cclxuICBjb25zdCBzbGlkZXJSb3RhdGlvbl9vcmlnaW5hbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgXCJzbGlkZXJSb3RhdGlvblwiXHJcbiAgKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gIGNvbnN0IHNsaWRlclJvdGF0aW9uX3ZhbHVlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICBcInNsaWRlci1yb3RhdGlvbi12YWx1ZVwiXHJcbiAgKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gIGNvbnN0IHNsaWRlclJvdGF0aW9uID0gc2xpZGVyUm90YXRpb25fb3JpZ2luYWwuY2xvbmVOb2RlKHRydWUpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgc2xpZGVyUm90YXRpb25fb3JpZ2luYWwucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQoc2xpZGVyUm90YXRpb24sIHNsaWRlclJvdGF0aW9uX29yaWdpbmFsKTtcclxuICBzbGlkZXJSb3RhdGlvbi5taW4gPSBcIjBcIjtcclxuICBzbGlkZXJSb3RhdGlvbi5tYXggPSBcIjM2MFwiO1xyXG4gIHNsaWRlclJvdGF0aW9uLnZhbHVlID0gKCgxODAgKiBlbGVtZW50LmRlZ3JlZSkgLyBNYXRoLlBJKS50b1N0cmluZygpO1xyXG4gIHNsaWRlclJvdGF0aW9uX3ZhbHVlLnRleHRDb250ZW50ID0gKCgxODAgKiBlbGVtZW50LmRlZ3JlZSkgLyBNYXRoLlBJKS50b0ZpeGVkKDApLnRvU3RyaW5nKCk7IFxyXG4gIHNsaWRlclJvdGF0aW9uLnN0ZXAgPSBcIjEwXCI7XHJcbiAgc2xpZGVyUm90YXRpb24uYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIChldmVudCkgPT4ge1xyXG4gICAgY29uc3QgZGVsdGFEZWdyZWUgPSAoZXZlbnQudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlO1xyXG4gICAgZWxlbWVudC5kZWdyZWUgPSAoTnVtYmVyKGRlbHRhRGVncmVlKSAvIDE4MCkgKiBNYXRoLlBJO1xyXG4gICAgc2xpZGVyUm90YXRpb25fdmFsdWUudGV4dENvbnRlbnQgPSAoKDE4MCAqIGVsZW1lbnQuZGVncmVlKSAvIE1hdGguUEkpLnRvRml4ZWQoMCkudG9TdHJpbmcoKTsgXHJcbiAgICByZW5kZXJBbGwoZ2wsIHByb2dyYW1JbmZvLCBzaGFwZXMsIHBvc2l0aW9uQnVmZmVyLCBjb2xvckJ1ZmZlcik7XHJcbiAgfSk7XHJcblxyXG4gIGNvbnN0IHNsaWRlclNoZWFyWF9vcmlnaW5hbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgXCJzbGlkZXJTaGVhclhcIlxyXG4gICkgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICBjb25zdCBzbGlkZXJTaGVhclggPSBzbGlkZXJTaGVhclhfb3JpZ2luYWwuY2xvbmVOb2RlKHRydWUpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgc2xpZGVyU2hlYXJYX29yaWdpbmFsLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHNsaWRlclNoZWFyWCwgc2xpZGVyU2hlYXJYX29yaWdpbmFsKTtcclxuICBzbGlkZXJTaGVhclgubWluID0gXCIwXCI7XHJcbiAgc2xpZGVyU2hlYXJYLm1heCA9IFwiMTBcIjtcclxuICBzbGlkZXJTaGVhclgudmFsdWUgPSBlbGVtZW50Lmt4LnRvU3RyaW5nKCk7XHJcbiAgc2xpZGVyU2hlYXJYLnN0ZXAgPSBcIjAuMVwiO1xyXG5cclxuICBzbGlkZXJTaGVhclguYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIChldmVudCkgPT4ge1xyXG4gICAgY29uc3QgZGVsdGFTaGVhclggPSAoZXZlbnQudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlO1xyXG4gICAgZWxlbWVudC5reCA9IE51bWJlcihkZWx0YVNoZWFyWCk7XHJcbiAgICByZW5kZXJBbGwoZ2wsIHByb2dyYW1JbmZvLCBzaGFwZXMsIHBvc2l0aW9uQnVmZmVyLCBjb2xvckJ1ZmZlcik7XHJcbiAgfSk7XHJcblxyXG4gIGNvbnN0IHNsaWRlclNoZWFyWV9vcmlnaW5hbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgXCJzbGlkZXJTaGVhcllcIlxyXG4gICkgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICBjb25zdCBzbGlkZXJTaGVhclkgPSBzbGlkZXJTaGVhcllfb3JpZ2luYWwuY2xvbmVOb2RlKHRydWUpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgc2xpZGVyU2hlYXJZX29yaWdpbmFsLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHNsaWRlclNoZWFyWSwgc2xpZGVyU2hlYXJZX29yaWdpbmFsKTtcclxuICBzbGlkZXJTaGVhclkubWluID0gXCIwXCI7XHJcbiAgc2xpZGVyU2hlYXJZLm1heCA9IFwiMTBcIjtcclxuICBzbGlkZXJTaGVhclkudmFsdWUgPSBlbGVtZW50Lmt5LnRvU3RyaW5nKCk7XHJcbiAgc2xpZGVyU2hlYXJZLnN0ZXAgPSBcIjAuMVwiO1xyXG5cclxuICBzbGlkZXJTaGVhclkuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIChldmVudCkgPT4ge1xyXG4gICAgY29uc3QgZGVsdGFTaGVhclkgPSAoZXZlbnQudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlO1xyXG4gICAgZWxlbWVudC5reSA9IE51bWJlcihkZWx0YVNoZWFyWSk7XHJcbiAgICByZW5kZXJBbGwoZ2wsIHByb2dyYW1JbmZvLCBzaGFwZXMsIHBvc2l0aW9uQnVmZmVyLCBjb2xvckJ1ZmZlcik7XHJcbiAgfSk7XHJcblxyXG4gIGNvbnN0IHBvaW50UGlja2VyX29yaWdpbmFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICBcInBvaW50UGlja2VyXCJcclxuICApIGFzIEhUTUxTZWxlY3RFbGVtZW50O1xyXG4gIGNvbnN0IHBvaW50UGlja2VyID0gcG9pbnRQaWNrZXJfb3JpZ2luYWwuY2xvbmVOb2RlKHRydWUpIGFzIEhUTUxTZWxlY3RFbGVtZW50OyBcclxuICBwb2ludFBpY2tlcl9vcmlnaW5hbC5wYXJlbnRFbGVtZW50LnJlcGxhY2VDaGlsZChwb2ludFBpY2tlciwgcG9pbnRQaWNrZXJfb3JpZ2luYWwpO1xyXG4gIHBvaW50UGlja2VyLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgcG9pbnRQaWNrZXIuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoKSA9PiB7XHJcbiAgICBjb25zdCBwb2ludEluZGV4OiBudW1iZXIgPSBOdW1iZXIocG9pbnRQaWNrZXIudmFsdWUpO1xyXG4gICAgc2V0dXBDb2xvclBpY2tlcihnbCwgcHJvZ3JhbUluZm8sIHBvaW50SW5kZXgsIGVsZW1lbnQpO1xyXG4gIH0pO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZWxlbWVudC5hcnJheU9mUG9pbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBjb25zdCBuZXdQb2ludCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XHJcbiAgICBuZXdQb2ludC52YWx1ZSA9IGkudG9TdHJpbmcoKTtcclxuICAgIG5ld1BvaW50LnRleHQgPSBcInBvaW50X1wiICsgaTtcclxuICAgIHBvaW50UGlja2VyLmFwcGVuZENoaWxkKG5ld1BvaW50KTtcclxuICB9XHJcblxyXG4gIC8vIElmIHRoZSBjdXJyZW50T2JqZWN0IGlzIG5vdCBvZiB0eXBlIFBvbHlnb24sIHJlbW92ZSB0aGUgYnV0dG9uXHJcbiAgY29uc3QgYWRkUG9pbnRCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ0bi1hZGQtcG9pbnRcIik7XHJcbiAgaWYgKGFkZFBvaW50QnV0dG9uKSB7XHJcbiAgICBhZGRQb2ludEJ1dHRvbi5yZW1vdmUoKTtcclxuICB9XHJcblxyXG4gIGlmIChlbGVtZW50IGluc3RhbmNlb2YgUG9seWdvbikge1xyXG4gICAgY29uc3QgYWRkUG9pbnRCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xyXG4gICAgYWRkUG9pbnRCdXR0b24udGV4dENvbnRlbnQgPSBcIkFkZCBOZXcgUG9pbnRcIjtcclxuICAgIGFkZFBvaW50QnV0dG9uLmNsYXNzTmFtZSA9IFwiYnRuIGJ0bi1wcmltYXJ5IGFkZC1idG5cIjtcclxuICAgIGFkZFBvaW50QnV0dG9uLmlkID0gXCJidG4tYWRkLXBvaW50XCI7XHJcbiAgICBhZGRQb2ludEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gICAgICAvLyBTZXQgYSBmbGFnIHRvIGluZGljYXRlIHRoYXQgYSBuZXcgcG9pbnQgaXMgYmVpbmcgYWRkZWRcclxuICAgICAgaXNEcmF3aW5nID0gdHJ1ZTtcclxuICAgICAgY3VycmVudE9iamVjdCA9IHNoYXBlc1tlbGVtZW50LmlkXVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gQXBwZW5kIHRoZSBidXR0b24gdG8gdGhlIERPTVxyXG4gICAgY29uc3QgcG9seWdvbkJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucG9seWdvbi1idG4tc2VjdGlvblwiKTtcclxuICAgIGlmIChwb2x5Z29uQnRuKSB7XHJcbiAgICAgIHBvbHlnb25CdG4uYXBwZW5kQ2hpbGQoYWRkUG9pbnRCdXR0b24pO1xyXG4gICAgfVxyXG4gIH0gXHJcbiAgc2V0dXBDb2xvclBpY2tlcihnbCwgcHJvZ3JhbUluZm8sIDAsIGVsZW1lbnQpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzZXR1cENvbG9yUGlja2VyKFxyXG4gIGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsXHJcbiAgcHJvZ3JhbUluZm86IFByb2dyYW1JbmZvLFxyXG4gIHBvaW50SW5kZXg6IG51bWJlcixcclxuICBlbGVtZW50OiBSZW5kZXJhYmxlICYgVHJhbnNmb3JtYWJsZSAmIFNoYXBlXHJcbikge1xyXG4gIGNvbnN0IGNvbG9yUGlja2VyX29yaWdpbmFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICBcImNvbG9yUGlja2VyXCJcclxuICApIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgY29uc3QgY29sb3JQaWNrZXIgPSBjb2xvclBpY2tlcl9vcmlnaW5hbC5jbG9uZU5vZGUodHJ1ZSkgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICBjb25zdCBjb2xvciA9IHJnYlRvSGV4KGVsZW1lbnQuYXJyYXlPZlBvaW50c1twb2ludEluZGV4XS5nZXRDb2xvcigpKTtcclxuICBjb2xvclBpY2tlci52YWx1ZSA9IGNvbG9yOyBcclxuICBjb2xvclBpY2tlcl9vcmlnaW5hbC5wYXJlbnRFbGVtZW50LnJlcGxhY2VDaGlsZChjb2xvclBpY2tlciwgY29sb3JQaWNrZXJfb3JpZ2luYWwpO1xyXG5cclxuICBjb2xvclBpY2tlci5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIChldmVudCkgPT4ge1xyXG4gICAgY29uc3QgaGV4ID0gKGV2ZW50LnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZTtcclxuICAgIGVsZW1lbnQuYXJyYXlPZlBvaW50c1twb2ludEluZGV4XS5zZXRDb2xvcihoZXhUb1JnYihoZXgpKTtcclxuICAgIHJlbmRlckFsbChnbCwgcHJvZ3JhbUluZm8sIHNoYXBlcywgcG9zaXRpb25CdWZmZXIsIGNvbG9yQnVmZmVyKTtcclxuICB9KTtcclxuXHJcbiAgY29uc3QgZGVsZXRlUG9pbnRCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ0bi1kZWxldGUtcG9pbnRcIik7XHJcbiAgaWYgKGRlbGV0ZVBvaW50QnV0dG9uKSB7XHJcbiAgICBkZWxldGVQb2ludEJ1dHRvbi5yZW1vdmUoKTtcclxuICB9XHJcbiAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBQb2x5Z29uKSB7XHJcbiAgICBjb25zdCBkZWxldGVQb2ludEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XHJcbiAgICBkZWxldGVQb2ludEJ1dHRvbi50ZXh0Q29udGVudCA9IFwiRGVsZXRlIFBvaW50XCI7XHJcbiAgICBkZWxldGVQb2ludEJ1dHRvbi5jbGFzc05hbWUgPSBcImJ0biBidG4tcHJpbWFyeSBkZWxldGUtYnRuXCI7XHJcbiAgICBkZWxldGVQb2ludEJ1dHRvbi5pZCA9IFwiYnRuLWRlbGV0ZS1wb2ludFwiO1xyXG4gICAgZGVsZXRlUG9pbnRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICAgICAgZWxlbWVudC5kZWxldGVQb2ludChwb2ludEluZGV4KTtcclxuICAgICAgcmVuZGVyQWxsKGdsLCBwcm9ncmFtSW5mbywgc2hhcGVzLCBwb3NpdGlvbkJ1ZmZlciwgY29sb3JCdWZmZXIpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgcG9seWdvbkJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucG9seWdvbi1idG4tc2VjdGlvblwiKTtcclxuICAgIGlmIChwb2x5Z29uQnRuKSB7XHJcbiAgICAgIHBvbHlnb25CdG4uYXBwZW5kQ2hpbGQoZGVsZXRlUG9pbnRCdXR0b24pO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuLy8gbG9hZHNoYXBlIGZyb20ganNvbiB0byBhcnJheSBvZiBzaGFwZVxyXG5mdW5jdGlvbiBsb2FkU2hhcGUodGV4dDogc3RyaW5nKTogKFNoYXBlICYgUmVuZGVyYWJsZSAmIFRyYW5zZm9ybWFibGUpW10ge1xyXG4gIGNvbnN0IHNoYXBlOiAoU2hhcGUgJiBSZW5kZXJhYmxlICYgVHJhbnNmb3JtYWJsZSlbXSA9IFtdO1xyXG4gIGNvbnN0IGRhdGEgPSBKU09OLnBhcnNlKHRleHQpO1xyXG4gIGNvbnN0IGxpc3RPZlNoYXBlcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibGlzdC1vZi1zaGFwZXNcIikgYXMgSFRNTFNlbGVjdEVsZW1lbnQ7XHJcbiAgd2hpbGUobGlzdE9mU2hhcGVzLmZpcnN0Q2hpbGQpIHtcclxuICAgIGxpc3RPZlNoYXBlcy5yZW1vdmVDaGlsZChsaXN0T2ZTaGFwZXMuZmlyc3RDaGlsZCk7XHJcbiAgfVxyXG4gIGZvciAoY29uc3QgaXRlbSBvZiBkYXRhKSB7XHJcbiAgICBjb25zdCB0eCA9IGl0ZW0udHg7XHJcbiAgICBjb25zdCB0eSA9IGl0ZW0udHk7XHJcbiAgICBjb25zdCBkZWdyZWUgPSBpdGVtLmRlZ3JlZTtcclxuICAgIGNvbnN0IHN4ID0gaXRlbS5zeDtcclxuICAgIGNvbnN0IHN5ID0gaXRlbS5zeTtcclxuICAgIGNvbnN0IGt4ID0gaXRlbS5reDtcclxuICAgIGNvbnN0IGt5ID0gaXRlbS5reTtcclxuICAgIGNvbnN0IGNlbnRlciA9IG5ldyBQb2ludChbaXRlbS5jZW50ZXIueCwgaXRlbS5jZW50ZXIueV0pO1xyXG4gICAgbGV0IGFycmF5T2ZQb2ludHM6IFBvaW50W10gPSBbXTtcclxuICAgIGZvciAoY29uc3QgcG9pbnQgb2YgaXRlbS5hcnJheU9mUG9pbnRzKSB7XHJcbiAgICAgIGxldCBwID0gbmV3IFBvaW50KFxyXG4gICAgICAgIFtwb2ludC54LCBwb2ludC55XSxcclxuICAgICAgICBbcG9pbnQuciwgcG9pbnQuZywgcG9pbnQuYiwgcG9pbnQuYV1cclxuICAgICAgKTtcclxuICAgICAgYXJyYXlPZlBvaW50cy5wdXNoKHApO1xyXG4gICAgfVxyXG4gICAgc3dpdGNoIChpdGVtLnR5cGUpIHtcclxuICAgICAgY2FzZSBUeXBlLkxpbmU6XHJcbiAgICAgICAgY29uc3QgbGluZSA9IG5ldyBMaW5lKGl0ZW0uaWQsIGFycmF5T2ZQb2ludHNbMF0pO1xyXG4gICAgICAgIGxpbmUuc2V0TGluZUF0dHJpYnV0ZXMoXHJcbiAgICAgICAgICB0eCxcclxuICAgICAgICAgIHR5LFxyXG4gICAgICAgICAgZGVncmVlLFxyXG4gICAgICAgICAgc3gsXHJcbiAgICAgICAgICBzeSxcclxuICAgICAgICAgIGt4LFxyXG4gICAgICAgICAga3ksXHJcbiAgICAgICAgICBhcnJheU9mUG9pbnRzWzFdXHJcbiAgICAgICAgKTtcclxuICAgICAgICBzaGFwZS5wdXNoKGxpbmUpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFR5cGUuU3F1YXJlOlxyXG4gICAgICAgIGNvbnN0IHNxdWFyZSA9IG5ldyBTcXVhcmUoaXRlbS5pZCwgY2VudGVyKTtcclxuICAgICAgICBzcXVhcmUuc2V0U3F1YXJlQXR0cmlidXRlcyhcclxuICAgICAgICAgIHR4LFxyXG4gICAgICAgICAgdHksXHJcbiAgICAgICAgICBkZWdyZWUsXHJcbiAgICAgICAgICBzeCxcclxuICAgICAgICAgIHN5LFxyXG4gICAgICAgICAga3gsXHJcbiAgICAgICAgICBreSxcclxuICAgICAgICAgIGFycmF5T2ZQb2ludHNcclxuICAgICAgICApO1xyXG4gICAgICAgIHNoYXBlLnB1c2goc3F1YXJlKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBUeXBlLlJlY3RhbmdsZTpcclxuICAgICAgICBjb25zdCByZWN0YW5nbGUgPSBuZXcgUmVjdGFuZ2xlKGl0ZW0uaWQsIGFycmF5T2ZQb2ludHNbMF0pO1xyXG4gICAgICAgIHJlY3RhbmdsZS5zZXRSZWN0YW5nbGVBdHRyaWJ1dGVzKFxyXG4gICAgICAgICAgdHgsXHJcbiAgICAgICAgICB0eSxcclxuICAgICAgICAgIGRlZ3JlZSxcclxuICAgICAgICAgIHN4LFxyXG4gICAgICAgICAgc3ksXHJcbiAgICAgICAgICBreCxcclxuICAgICAgICAgIGt5LFxyXG4gICAgICAgICAgYXJyYXlPZlBvaW50c1xyXG4gICAgICAgICk7XHJcbiAgICAgICAgc2hhcGUucHVzaChyZWN0YW5nbGUpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFR5cGUuUG9seWdvbjpcclxuICAgICAgICBjb25zdCBwb2x5Z29uID0gbmV3IFBvbHlnb24oaXRlbS5pZCwgYXJyYXlPZlBvaW50c1swXSk7XHJcbiAgICAgICAgcG9seWdvbi5zZXRQb2x5Z29uQXR0cmlidXRlcyhcclxuICAgICAgICAgIHR4LFxyXG4gICAgICAgICAgdHksXHJcbiAgICAgICAgICBkZWdyZWUsXHJcbiAgICAgICAgICBzeCxcclxuICAgICAgICAgIHN5LFxyXG4gICAgICAgICAga3gsXHJcbiAgICAgICAgICBreSxcclxuICAgICAgICAgIGFycmF5T2ZQb2ludHNcclxuICAgICAgICApO1xyXG4gICAgICAgIHNoYXBlLnB1c2gocG9seWdvbik7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBzaGFwZTtcclxufVxyXG5cclxuZnVuY3Rpb24gc3RvcmVTaGFwZXMoc2hhcGU6IFNoYXBlW10pOiBzdHJpbmcge1xyXG4gIHJldHVybiBKU09OLnN0cmluZ2lmeShzaGFwZSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhhbmRsZURvd25sb2FkKHRleHQ6IHN0cmluZyk6IHZvaWQge1xyXG4gIGNvbnN0IGRhdGEgPSBuZXcgRmlsZShbdGV4dF0sIFwic2hhcGVzLmpzb25cIiwgeyB0eXBlOiBcImFwcGxpY2F0aW9uL2pzb25cIiB9KTtcclxuXHJcbiAgY29uc3QgdXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChkYXRhKTtcclxuXHJcbiAgY29uc3QgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xyXG4gIGEuaHJlZiA9IHVybDtcclxuICBhLmRvd25sb2FkID0gZGF0YS5uYW1lO1xyXG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYSk7XHJcbiAgYS5jbGljaygpO1xyXG4gIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoYSk7XHJcbiAgVVJMLnJldm9rZU9iamVjdFVSTCh1cmwpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBoYW5kbGVVcGxvYWQoY2FsbGJhY2s6ICh0ZXh0OiBzdHJpbmcpID0+IHZvaWQpOiB2b2lkIHtcclxuICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICBpbnB1dC50eXBlID0gXCJmaWxlXCI7XHJcbiAgaW5wdXQuYWNjZXB0ID0gXCJhcHBsaWNhdGlvbi9qc29uXCI7XHJcblxyXG4gIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKCkgPT4ge1xyXG4gICAgY29uc3QgZmlsZSA9IGlucHV0LmZpbGVzWzBdO1xyXG4gICAgY29uc3QgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuXHJcbiAgICByZWFkZXIub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICBjYWxsYmFjayhyZWFkZXIucmVzdWx0IGFzIHN0cmluZyk7XHJcbiAgICB9O1xyXG4gICAgcmVhZGVyLnJlYWRBc1RleHQoZmlsZSk7XHJcbiAgfSk7XHJcblxyXG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaW5wdXQpO1xyXG4gIGlucHV0LmNsaWNrKCk7XHJcbiAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChpbnB1dCk7XHJcbn1cclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2luZGV4LnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9