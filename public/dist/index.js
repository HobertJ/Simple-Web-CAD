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
const shape_1 = __importDefault(__webpack_require__(/*! ./shape */ "./src/2D-Shapes/shape.ts"));
const Transformation_1 = __importDefault(__webpack_require__(/*! Main/Operations/Transformation */ "./src/Operations/Transformation.ts"));
const type_enum_1 = __importDefault(__webpack_require__(/*! ./type.enum */ "./src/2D-Shapes/type.enum.ts"));
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
const line_1 = __importDefault(__webpack_require__(/*! ./2D-Shapes/line */ "./src/2D-Shapes/line.ts"));
const square_1 = __importDefault(__webpack_require__(/*! ./2D-Shapes/square */ "./src/2D-Shapes/square.ts"));
const rectangle_1 = __importDefault(__webpack_require__(/*! ./2D-Shapes/rectangle */ "./src/2D-Shapes/rectangle.ts"));
const point_1 = __importDefault(__webpack_require__(/*! ./Base/point */ "./src/Base/point.ts"));
const polygon_1 = __importDefault(__webpack_require__(/*! ./2D-Shapes/polygon */ "./src/2D-Shapes/polygon.ts"));
const type_enum_1 = __importDefault(__webpack_require__(/*! ./2D-Shapes/type.enum */ "./src/2D-Shapes/type.enum.ts"));
const create_shader_program_1 = __webpack_require__(/*! ./Functions/create-shader-program */ "./src/Functions/create-shader-program.ts");
const Transformation_1 = __importDefault(__webpack_require__(/*! ./Operations/Transformation */ "./src/Operations/Transformation.ts"));
const tools_1 = __webpack_require__(/*! ./Utils/tools */ "./src/Utils/tools.ts");
const render_1 = __webpack_require__(/*! ./Functions/render */ "./src/Functions/render.ts");
const render_all_1 = __webpack_require__(/*! ./Functions/render-all */ "./src/Functions/render-all.ts");
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
        length = max - min;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Qy9DLENBQUM7SUFFTSxjQUFjLENBQUMsV0FBbUI7UUFDckMsTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsV0FBVyxDQUFDLEVBQUUsQ0FBQztRQUN2QyxNQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxXQUFXLENBQUMsRUFBRSxDQUFDO1FBQ3ZDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxFQUFFLENBQUM7UUFFdkMsTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztRQUNoQyxNQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7UUFFaEMsTUFBTSxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO1FBQzdDLE1BQU0sR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztRQUM3QyxNQUFNLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7UUFDN0MsTUFBTSxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO1FBQzdDLE1BQU0sR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztRQUM3QyxNQUFNLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7UUFDN0MsTUFBTSxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO1FBQzdDLE1BQU0sR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztRQUM3QyxNQUFNLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7UUFFN0MsTUFBTSxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUM3RSxPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBR00sYUFBYSxDQUFDLEtBQVk7UUFDN0IsTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztRQUNoQyxNQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7UUFFaEMsTUFBTSxFQUFFLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDekQsTUFBTSxFQUFFLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFFekQsTUFBTSxR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RUFBVSxFQUFFLEVBQVU7UUFDNUMsTUFBTSxNQUFNLEdBQUcsSUFBSSxnQkFBTSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0QsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUNNLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBYztRQUNqQyxNQUFNLE1BQU0sR0FBRyxJQUFJLGdCQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4SCxPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBQ00sTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFVLEVBQUUsRUFBVTtRQUN0QyxNQUFNLE1BQU0sR0FBRyxJQUFJLGdCQUFNLENBQUMsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzRCxPQUFPLE1BQU07SUFDakIsQ0FBQztJQUNNLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBVTtRQUMzQixNQUFNLE1BQU0sR0FBRyxJQUFJLGdCQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxD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QUFDLENBQUMsQ0FBQztRQUM1QixNQUFNLE1BQU0sR0FBRyxJQUFJLFVBQVUsRUFBRSxDQUFDO1FBRWhDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsR0FBRyxFQUFFO1lBQ25CLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBZ0IsQ0FBQyxDQUFDO1FBQ3BDLENBQUMsQ0FBQztRQUNGLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDMUIsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNqQyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDZCxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNuQyxDQUFDOzs7Ozs7O1VDbG9CRDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7O1VFdEJBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdHVnYXMtYmVzYXItZ3JhZmtvbS0xLXBhaW50Ly4vc3JjLzJELVNoYXBlcy9saW5lLnRzIiwid2VicGFjazovL3R1Z2FzLWJlc2FyLWdyYWZrb20tMS1wYWludC8uL3NyYy8yRC1TaGFwZXMvcG9seWdvbi50cyIsIndlYnBhY2s6Ly90dWdhcy1iZXNhci1ncmFma29tLTEtcGFpbnQvLi9zcmMvMkQtU2hhcGVzL3JlY3RhbmdsZS50cyIsIndlYnBhY2s6Ly90dWdhcy1iZXNhci1ncmFma29tLTEtcGFpbnQvLi9zcmMvMkQtU2hhcGVzL3NoYXBlLnRzIiwid2VicGFjazovL3R1Z2FzLWJlc2FyLWdyYWZrb20tMS1wYWludC8uL3NyYy8yRC1TaGFwZXMvc3F1YXJlLnRzIiwid2VicGFjazovL3R1Z2FzLWJlc2FyLWdyYWZrb20tMS1wYWludC8uL3NyYy8yRC1TaGFwZXMvdHlwZS5lbnVtLnRzIiwid2VicGFjazovL3R1Z2FzLWJlc2FyLWdyYWZrb20tMS1wYWludC8uL3NyYy9CYXNlL2Nvb3JkaW5hdGUudHMiLCJ3ZWJwYWNrOi8vdHVnYXMtYmVzYXItZ3JhZmtvbS0xLXBhaW50Ly4vc3JjL0Jhc2UvbWF0cml4LnRzIiwid2VicGFjazovL3R1Z2FzLWJlc2FyLWdyYWZrb20tMS1wYWludC8uL3NyYy9CYXNlL3BvaW50LnRzIiwid2VicGFjazovL3R1Z2FzLWJlc2FyLWdyYWZrb20tMS1wYWludC8uL3NyYy9GdW5jdGlvbnMvY3JlYXRlLXNoYWRlci1wcm9ncmFtLnRzIiwid2VicGFjazovL3R1Z2FzLWJlc2FyLWdyYWZrb20tMS1wYWludC8uL3NyYy9GdW5jdGlvbnMvbG9hZC1zaGFkZXIudHMiLCJ3ZWJwYWNrOi8vdHVnYXMtYmVzYXItZ3JhZmtvbS0xLXBhaW50Ly4vc3JjL0Z1bmN0aW9ucy9yZW5kZXItYWxsLnRzIiwid2VicGFjazovL3R1Z2FzLWJlc2FyLWdyYWZrb20tMS1wYWludC8uL3NyYy9GdW5jdGlvbnMvcmVuZGVyLnRzIiwid2VicGFjazovL3R1Z2FzLWJlc2FyLWdyYWZrb20tMS1wYWludC8uL3NyYy9PcGVyYXRpb25zL1RyYW5zZm9ybWF0aW9uLnRzIiwid2VicGFjazovL3R1Z2FzLWJlc2FyLWdyYWZrb20tMS1wYWludC8uL3NyYy9PcGVyYXRpb25zL2NvbnZleC1odWxsLnRzIiwid2VicGFjazovL3R1Z2FzLWJlc2FyLWdyYWZrb20tMS1wYWludC8uL3NyYy9VdGlscy90b29scy50cyIsIndlYnBhY2s6Ly90dWdhcy1iZXNhci1ncmFma29tLTEtcGFpbnQvLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vdHVnYXMtYmVzYXItZ3JhZmtvbS0xLXBhaW50L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3R1Z2FzLWJlc2FyLWdyYWZrb20tMS1wYWludC93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL3R1Z2FzLWJlc2FyLWdyYWZrb20tMS1wYWludC93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vdHVnYXMtYmVzYXItZ3JhZmtvbS0xLXBhaW50L3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVuZGVyYWJsZSBmcm9tIFwiLi9JbnRlcmZhY2VzL3JlbmRlcmFibGUuaW50ZXJmYWNlXCI7XHJcbmltcG9ydCBUcmFuc2Zvcm1hYmxlIGZyb20gXCIuL0ludGVyZmFjZXMvdHJhbnNmb3JtYWJsZS5pbnRlcmZhY2VcIjtcclxuaW1wb3J0IFNoYXBlIGZyb20gXCIuL3NoYXBlXCI7XHJcbmltcG9ydCBUeXBlIGZyb20gXCIuL3R5cGUuZW51bVwiO1xyXG5pbXBvcnQgUG9pbnQgZnJvbSBcIi4uL0Jhc2UvcG9pbnRcIjtcclxuaW1wb3J0IFRyYW5zZm9ybWF0aW9uIGZyb20gXCJNYWluL09wZXJhdGlvbnMvVHJhbnNmb3JtYXRpb25cIjtcclxuXHJcbmNsYXNzIExpbmUgZXh0ZW5kcyBTaGFwZSBpbXBsZW1lbnRzIFJlbmRlcmFibGUsIFRyYW5zZm9ybWFibGUge1xyXG5cclxuICAgIHB1YmxpYyB0eXBlOiBUeXBlLkxpbmU7XHJcbiAgICBwdWJsaWMgYXJyYXlPZlBvaW50czogUG9pbnRbXTtcclxuXHJcbiAgICBwdWJsaWMgY2VudGVyOiBQb2ludDtcclxuICAgIHB1YmxpYyB0eDogbnVtYmVyO1xyXG4gICAgcHVibGljIHR5OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgZGVncmVlOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgc3g6IG51bWJlcjtcclxuICAgIHB1YmxpYyBzeTogbnVtYmVyO1xyXG4gICAgcHVibGljIGt4OiBudW1iZXI7XHJcbiAgICBwdWJsaWMga3k6IG51bWJlcjtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoaWQ6IG51bWJlciwgcDE6IFBvaW50KSB7XHJcbiAgICAgICAgc3VwZXIoaWQsIDIsIFR5cGUuTGluZSk7XHJcbiAgICAgICAgdGhpcy5hcnJheU9mUG9pbnRzID0gW3AxXTtcclxuICAgICAgICB0aGlzLnR4ID0gMDtcclxuICAgICAgICB0aGlzLnR5ID0gMDtcclxuICAgICAgICB0aGlzLmRlZ3JlZSA9IDA7XHJcbiAgICAgICAgdGhpcy5zeCA9IDE7XHJcbiAgICAgICAgdGhpcy5zeSA9IDE7XHJcbiAgICAgICAgdGhpcy5reCA9IDA7XHJcbiAgICAgICAgdGhpcy5reSA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gVHJhbnNmb3JtYWJsZSBNZXRob2RzXHJcbiAgICBwdWJsaWMgYWRkTWF0cml4KGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsIG1hdHJpeExvY2F0aW9uOiBXZWJHTFVuaWZvcm1Mb2NhdGlvbik6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IG1hdHJpeCA9IFRyYW5zZm9ybWF0aW9uLnRyYW5zZm9ybWF0aW9uTWF0cml4KFxyXG4gICAgICAgICAgICBnbC5jYW52YXMud2lkdGgsXHJcbiAgICAgICAgICAgIGdsLmNhbnZhcy5oZWlnaHQsXHJcbiAgICAgICAgICAgIHRoaXMudHgsXHJcbiAgICAgICAgICAgIHRoaXMudHksXHJcbiAgICAgICAgICAgIHRoaXMuZGVncmVlLFxyXG4gICAgICAgICAgICB0aGlzLnN4LFxyXG4gICAgICAgICAgICB0aGlzLnN5LFxyXG4gICAgICAgICAgICB0aGlzLmt4LFxyXG4gICAgICAgICAgICB0aGlzLmt5LFxyXG4gICAgICAgICAgICB0aGlzLmdldENlbnRlcigpXHJcbiAgICAgICAgICApLmZsYXR0ZW4oKTtcclxuICAgICAgXHJcbiAgICAgICAgICBnbC51bmlmb3JtTWF0cml4M2Z2KG1hdHJpeExvY2F0aW9uLCBmYWxzZSwgbWF0cml4KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0Q2VudGVyKCk6IFBvaW50IHtcclxuICAgICAgICBjb25zdCBudW1Qb2ludHMgPSB0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoO1xyXG4gICAgICAgIGxldCBjZW50ZXJYID0gMDtcclxuICAgICAgICBsZXQgY2VudGVyWSA9IDA7XHJcbiAgICAgICAgZm9yIChjb25zdCBwb2ludCBvZiB0aGlzLmFycmF5T2ZQb2ludHMpIHtcclxuICAgICAgICAgICAgY29uc3QgW3gsIHldID0gcG9pbnQuZ2V0UGFpcigpO1xyXG4gICAgICAgICAgICBjZW50ZXJYICs9IHg7XHJcbiAgICAgICAgICAgIGNlbnRlclkgKz0geTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2VudGVyWCAvPSBudW1Qb2ludHM7XHJcbiAgICAgICAgY2VudGVyWSAvPSBudW1Qb2ludHM7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgUG9pbnQoW2NlbnRlclgsIGNlbnRlclldLCBbMCwgMCwgMCwgMF0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkcmF3TWV0aG9kKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBnbC5MSU5FUztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaXNEcmF3YWJsZSgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aCA9PT0gMjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZHJhdyhwb2ludDogUG9pbnQpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmFycmF5T2ZQb2ludHNbMV0gPSBwb2ludDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0TnVtYmVyT2ZWZXJ0aWNlc1RvQmVEcmF3bigpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiAyO1xyXG4gICAgfSBcclxuICAgIFxyXG4gICAgcHVibGljIGFkZFBvc2l0aW9uKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQpOiB2b2lkIHtcclxuICAgICAgICBnbC5idWZmZXJEYXRhKFxyXG4gICAgICAgICAgICBnbC5BUlJBWV9CVUZGRVIsXHJcbiAgICAgICAgICAgIG5ldyBGbG9hdDMyQXJyYXkoWy4uLnRoaXMuYXJyYXlPZlBvaW50c1swXS5nZXRQYWlyKCksIC4uLnRoaXMuYXJyYXlPZlBvaW50c1sxXS5nZXRQYWlyKCldKSxcclxuICAgICAgICAgICAgZ2wuU1RBVElDX0RSQVdcclxuICAgICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZENvbG9yKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQpOiB2b2lkIHtcclxuICAgICAgICBnbC5idWZmZXJEYXRhKFxyXG4gICAgICAgICAgICBnbC5BUlJBWV9CVUZGRVIsXHJcbiAgICAgICAgICAgIG5ldyBGbG9hdDMyQXJyYXkoWy4uLnRoaXMuYXJyYXlPZlBvaW50c1swXS5nZXRDb2xvcigpLCAuLi50aGlzLmFycmF5T2ZQb2ludHNbMV0uZ2V0Q29sb3IoKV0pLFxyXG4gICAgICAgICAgICBnbC5TVEFUSUNfRFJBV1xyXG4gICAgICAgICAgKTtcclxuICAgIH0gIFxyXG5cclxuICAgIHB1YmxpYyBzZXRMaW5lQXR0cmlidXRlcyh0eDogbnVtYmVyLCB0eTogbnVtYmVyLCBkZWdyZWU6IG51bWJlciwgc3g6IG51bWJlciwgc3k6IG51bWJlciwga3g6IG51bWJlciwga3k6IG51bWJlciwgcDI6IFBvaW50KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5hcnJheU9mUG9pbnRzLnB1c2gocDIpO1xyXG4gICAgICAgIHRoaXMudHggPSB0eDtcclxuICAgICAgICB0aGlzLnR5ID0gdHk7XHJcbiAgICAgICAgdGhpcy5kZWdyZWUgPSBkZWdyZWU7XHJcbiAgICAgICAgdGhpcy5zeCA9IHN4O1xyXG4gICAgICAgIHRoaXMuc3kgPSBzeTtcclxuICAgICAgICB0aGlzLmt4ID0ga3g7XHJcbiAgICAgICAgdGhpcy5reSA9IGt5O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBMaW5lO1xyXG4iLCJpbXBvcnQgVHJhbnNmb3JtYXRpb24gZnJvbSBcIk1haW4vT3BlcmF0aW9ucy9UcmFuc2Zvcm1hdGlvblwiO1xyXG5pbXBvcnQgUmVuZGVyYWJsZSBmcm9tIFwiLi9JbnRlcmZhY2VzL3JlbmRlcmFibGUuaW50ZXJmYWNlXCI7XHJcbmltcG9ydCBUcmFuc2Zvcm1hYmxlIGZyb20gXCIuL0ludGVyZmFjZXMvdHJhbnNmb3JtYWJsZS5pbnRlcmZhY2VcIjtcclxuaW1wb3J0IFNoYXBlIGZyb20gXCIuL3NoYXBlXCI7XHJcbmltcG9ydCBUeXBlIGZyb20gXCIuL3R5cGUuZW51bVwiO1xyXG5pbXBvcnQgUG9pbnQgZnJvbSBcIk1haW4vQmFzZS9wb2ludFwiO1xyXG5pbXBvcnQgY29udmV4SHVsbCBmcm9tIFwiTWFpbi9PcGVyYXRpb25zL2NvbnZleC1odWxsXCI7XHJcblxyXG5jbGFzcyBQb2x5Z29uIGV4dGVuZHMgU2hhcGUgaW1wbGVtZW50cyBSZW5kZXJhYmxlLCBUcmFuc2Zvcm1hYmxlIHtcclxuICAgIHB1YmxpYyB0eXBlOiBUeXBlLlBvbHlnb247XHJcbiAgICBwdWJsaWMgYXJyYXlPZlBvaW50czogUG9pbnRbXTtcclxuXHJcbiAgICBwdWJsaWMgY2VudGVyOiBQb2ludDtcclxuICAgIHB1YmxpYyB0eDogbnVtYmVyO1xyXG4gICAgcHVibGljIHR5OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgZGVncmVlOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgc3g6IG51bWJlcjtcclxuICAgIHB1YmxpYyBzeTogbnVtYmVyO1xyXG4gICAgcHVibGljIGt4OiBudW1iZXI7XHJcbiAgICBwdWJsaWMga3k6IG51bWJlcjtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoaWQ6IG51bWJlciwgcG9pbnQ6IFBvaW50KSB7XHJcbiAgICAgICAgc3VwZXIoaWQsIDEsIFR5cGUuUG9seWdvbik7XHJcbiAgICAgICAgdGhpcy5hcnJheU9mUG9pbnRzID0gbmV3IEFycmF5KHBvaW50KTtcclxuICAgICAgICB0aGlzLnR4ID0gMDtcclxuICAgICAgICB0aGlzLnR5ID0gMDtcclxuICAgICAgICB0aGlzLmRlZ3JlZSA9IDA7XHJcbiAgICAgICAgdGhpcy5zeCA9IDE7XHJcbiAgICAgICAgdGhpcy5zeSA9IDE7XHJcbiAgICAgICAgdGhpcy5reCA9IDA7XHJcbiAgICAgICAgdGhpcy5reSA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldENlbnRlcigpOiBQb2ludCB7XHJcbiAgICAgICAgbGV0IHN1bVggPSAwO1xyXG4gICAgICAgIGxldCBzdW1ZID0gMDtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgW3gsIHldID0gdGhpcy5hcnJheU9mUG9pbnRzW2ldLmdldFBhaXIoKTtcclxuICAgICAgICAgICAgc3VtWCArPSB4O1xyXG4gICAgICAgICAgICBzdW1ZICs9IHk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBjZW50ZXJYID0gc3VtWCAvIHRoaXMuYXJyYXlPZlBvaW50cy5sZW5ndGg7XHJcbiAgICAgICAgY29uc3QgY2VudGVyWSA9IHN1bVkgLyB0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoO1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3IFBvaW50KFtjZW50ZXJYLCBjZW50ZXJZXSwgWzAsIDAsIDAsIDBdKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaXNEcmF3YWJsZSgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aCA+PSAyO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkcmF3IChwb2ludDogUG9pbnQpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aCA+PSAzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYXJyYXlPZlBvaW50cyA9IGNvbnZleEh1bGwoWy4uLnRoaXMuYXJyYXlPZlBvaW50cywgcG9pbnRdKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmFycmF5T2ZQb2ludHNbdGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aF0gPSBwb2ludDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jZW50ZXIgPSB0aGlzLmdldENlbnRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkcmF3TWV0aG9kKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoID49MyA/IGdsLlRSSUFOR0xFX0ZBTiA6IGdsLkxJTkVTO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXROdW1iZXJPZlZlcnRpY2VzVG9CZURyYXduKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJyYXlPZlBvaW50cy5sZW5ndGggO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRQb3NpdGlvbihnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0KTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgdmVydGljZXMgPSBuZXcgRmxvYXQzMkFycmF5KHRoaXMuYXJyYXlPZlBvaW50cy5sZW5ndGggKiAyKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgW3gsIHldID0gdGhpcy5hcnJheU9mUG9pbnRzW2ldLmdldFBhaXIoKTtcclxuICAgICAgICAgICAgdmVydGljZXNbaSAqIDJdID0geDtcclxuICAgICAgICAgICAgdmVydGljZXNbaSAqIDIgKyAxXSA9IHk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBbcEluaXRpYWxYLCBwSW5pdGlhbFldID0gdGhpcy5hcnJheU9mUG9pbnRzWzBdLmdldFBhaXIoKTtcclxuICAgICAgICB2ZXJ0aWNlc1t0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoICogMl0gPSBwSW5pdGlhbFg7XHJcbiAgICAgICAgdmVydGljZXNbdGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aCAqIDIgKyAxXSA9IHBJbml0aWFsWTtcclxuXHJcbiAgICAgICAgZ2wuYnVmZmVyRGF0YShnbC5BUlJBWV9CVUZGRVIsIHZlcnRpY2VzLCBnbC5TVEFUSUNfRFJBVyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZENvbG9yKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBjb2xvcnMgPSBuZXcgRmxvYXQzMkFycmF5KHRoaXMuYXJyYXlPZlBvaW50cy5sZW5ndGggKiA0KTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgW3IsIGcsIGIsIGFdID0gdGhpcy5hcnJheU9mUG9pbnRzW2ldLmdldENvbG9yKCk7XHJcbiAgICAgICAgICAgIGNvbG9yc1tpICogNF0gPSByO1xyXG4gICAgICAgICAgICBjb2xvcnNbaSAqIDQgKyAxXSA9IGc7XHJcbiAgICAgICAgICAgIGNvbG9yc1tpICogNCArIDJdID0gYjtcclxuICAgICAgICAgICAgY29sb3JzW2kgKiA0ICsgM10gPSBhO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgW3JJbml0aWFsLCBnSW5pdGlhbCwgYkluaXRpYWwsIGFJbml0aWFsXSA9IHRoaXMuYXJyYXlPZlBvaW50c1swXS5nZXRDb2xvcigpO1xyXG4gICAgICAgIGNvbG9yc1t0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoICogNF0gPSBySW5pdGlhbDtcclxuICAgICAgICBjb2xvcnNbdGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aCAqIDQgKyAxXSA9IGdJbml0aWFsO1xyXG4gICAgICAgIGNvbG9yc1t0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoICogNCArIDJdID0gYkluaXRpYWw7XHJcbiAgICAgICAgY29sb3JzW3RoaXMuYXJyYXlPZlBvaW50cy5sZW5ndGggKiA0ICsgM10gPSBhSW5pdGlhbDtcclxuXHJcbiAgICAgICAgZ2wuYnVmZmVyRGF0YShnbC5BUlJBWV9CVUZGRVIsIGNvbG9ycywgZ2wuU1RBVElDX0RSQVcpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGFkZE1hdHJpeChnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LCBtYXRyaXhMb2NhdGlvbjogV2ViR0xVbmlmb3JtTG9jYXRpb24pOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBtYXRyaXggPSBUcmFuc2Zvcm1hdGlvbi50cmFuc2Zvcm1hdGlvbk1hdHJpeChcclxuICAgICAgICAgICAgZ2wuY2FudmFzLndpZHRoLFxyXG4gICAgICAgICAgICBnbC5jYW52YXMuaGVpZ2h0LFxyXG4gICAgICAgICAgICB0aGlzLnR4LFxyXG4gICAgICAgICAgICB0aGlzLnR5LFxyXG4gICAgICAgICAgICB0aGlzLmRlZ3JlZSxcclxuICAgICAgICAgICAgdGhpcy5zeCxcclxuICAgICAgICAgICAgdGhpcy5zeSxcclxuICAgICAgICAgICAgdGhpcy5reCxcclxuICAgICAgICAgICAgdGhpcy5reSxcclxuICAgICAgICAgICAgdGhpcy5jZW50ZXJcclxuICAgICAgICAgICkuZmxhdHRlbigpO1xyXG4gICAgICBcclxuICAgICAgICAgIGdsLnVuaWZvcm1NYXRyaXgzZnYobWF0cml4TG9jYXRpb24sIGZhbHNlLCBtYXRyaXgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkZWxldGVQb2ludChpbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgdmFyIG5ld1BvaW50czogUG9pbnRbXSA9IFt0aGlzLmFycmF5T2ZQb2ludHNbaW5kZXhdXTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYXJyYXlPZlBvaW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgaWYgKGkgIT0gaW5kZXgpIHtcclxuICAgICAgICAgICAgbmV3UG9pbnRzLnB1c2godGhpcy5hcnJheU9mUG9pbnRzW2ldKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICBcclxuICAgICAgICB0aGlzLmFycmF5T2ZQb2ludHMgPSBuZXdQb2ludHMuc2xpY2UoMSwgdGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aCk7XHJcbiAgICBcclxuICAgICAgICAvLyBhZnRlciBkZWxldGUsIG5lZWQgdG8gc2V0dXAgb3B0aW9uIGFnYWluXHJcbiAgICAgICAgY29uc3QgcG9pbnRQaWNrZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBvaW50UGlja2VyXCIpO1xyXG4gICAgICAgIHBvaW50UGlja2VyLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgICAgcG9pbnRQaWNrZXIucmVwbGFjZUNoaWxkcmVuKCk7XHJcbiAgICAgICAgLyogQWxsIFBvaW50ICovXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgIGNvbnN0IG5ld1BvaW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKTtcclxuICAgICAgICAgIG5ld1BvaW50LnZhbHVlID0gaS50b1N0cmluZygpO1xyXG4gICAgICAgICAgbmV3UG9pbnQudGV4dCA9IFwicG9pbnRfXCIgKyBpO1xyXG4gICAgICAgICAgcG9pbnRQaWNrZXIuYXBwZW5kQ2hpbGQobmV3UG9pbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgcHVibGljIHNldFBvbHlnb25BdHRyaWJ1dGVzKHR4OiBudW1iZXIsIHR5OiBudW1iZXIsIGRlZ3JlZTogbnVtYmVyLCBzeDogbnVtYmVyLCBzeTogbnVtYmVyLCBreDogbnVtYmVyLCBreTogbnVtYmVyLCBhcnJheU9mUG9pbnRzOiBQb2ludFtdKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5hcnJheU9mUG9pbnRzID0gYXJyYXlPZlBvaW50cztcclxuICAgICAgICB0aGlzLnR4ID0gdHg7XHJcbiAgICAgICAgdGhpcy50eSA9IHR5O1xyXG4gICAgICAgIHRoaXMuZGVncmVlID0gZGVncmVlO1xyXG4gICAgICAgIHRoaXMuc3ggPSBzeDtcclxuICAgICAgICB0aGlzLnN5ID0gc3k7XHJcbiAgICAgICAgdGhpcy5reCA9IGt4O1xyXG4gICAgICAgIHRoaXMua3kgPSBreTtcclxuICAgICAgICB0aGlzLm51bWJlck9mVmVydGljZXMgPSBhcnJheU9mUG9pbnRzLmxlbmd0aDtcclxuICAgICAgICB0aGlzLmNlbnRlciA9IHRoaXMuZ2V0Q2VudGVyKCk7XHJcbiAgICAgIH1cclxuICAgIFxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBQb2x5Z29uOyIsImltcG9ydCBTaGFwZSBmcm9tIFwiU2hhcGVzL3NoYXBlXCI7XHJcbmltcG9ydCBQb2ludCBmcm9tIFwiQmFzZS9wb2ludFwiO1xyXG5pbXBvcnQgVHlwZSBmcm9tIFwiU2hhcGVzL3R5cGUuZW51bVwiO1xyXG5pbXBvcnQgUmVuZGVyYWJsZSBmcm9tIFwiTWFpbi8yRC1TaGFwZXMvSW50ZXJmYWNlcy9yZW5kZXJhYmxlLmludGVyZmFjZVwiO1xyXG5pbXBvcnQgVHJhbnNmb3JtYWJsZSBmcm9tIFwiU2hhcGVzL0ludGVyZmFjZXMvdHJhbnNmb3JtYWJsZS5pbnRlcmZhY2VcIjtcclxuaW1wb3J0IFRyYW5zZm9ybWF0aW9uIGZyb20gXCJNYWluL09wZXJhdGlvbnMvVHJhbnNmb3JtYXRpb25cIjtcclxuXHJcbmNsYXNzIFJlY3RhbmdsZSBleHRlbmRzIFNoYXBlIGltcGxlbWVudHMgUmVuZGVyYWJsZSwgVHJhbnNmb3JtYWJsZSB7XHJcbiAgICBwdWJsaWMgYXJyYXlPZlBvaW50czogUG9pbnRbXTtcclxuICAgIHB1YmxpYyBjZW50ZXI6IFBvaW50O1xyXG4gICAgcHVibGljIHR4OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgdHk6IG51bWJlcjtcclxuICAgIHB1YmxpYyBkZWdyZWU6IG51bWJlcjtcclxuICAgIHB1YmxpYyBzeDogbnVtYmVyO1xyXG4gICAgcHVibGljIHN5OiBudW1iZXI7XHJcbiAgICBwdWJsaWMga3g6IG51bWJlcjtcclxuICAgIHB1YmxpYyBreTogbnVtYmVyO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihpZDogbnVtYmVyLCAgcDE6IFBvaW50KXtcclxuICAgICAgICBzdXBlcihpZCwgNCwgVHlwZS5SZWN0YW5nbGUpO1xyXG4gICAgICAgIHRoaXMuYXJyYXlPZlBvaW50cyA9IFtwMSwgbnVsbCwgbnVsbCwgbnVsbF07XHJcbiAgICAgICAgdGhpcy50eCA9IDA7XHJcbiAgICAgICAgdGhpcy50eSA9IDA7XHJcbiAgICAgICAgdGhpcy5kZWdyZWUgPSAwO1xyXG4gICAgICAgIHRoaXMuc3ggPSAxO1xyXG4gICAgICAgIHRoaXMuc3kgPSAxO1xyXG4gICAgICAgIHRoaXMua3ggPSAwO1xyXG4gICAgICAgIHRoaXMua3kgPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFRyYW5zZm9ybWFibGUgTWV0aG9kc1xyXG4gICAgcHVibGljIGdldENlbnRlcigpOiBQb2ludCB7XHJcbiAgICAgICAgY29uc3QgW3AxeCwgcDF5XSA9IHRoaXMuYXJyYXlPZlBvaW50c1swXS5nZXRQYWlyKCk7XHJcbiAgICAgICAgY29uc3QgW3AyeCwgcDJ5XSA9IHRoaXMuYXJyYXlPZlBvaW50c1sxXS5nZXRQYWlyKCk7XHJcbiAgICAgICAgY29uc3QgW3AzeCwgcDN5XSA9IHRoaXMuYXJyYXlPZlBvaW50c1syXS5nZXRQYWlyKCk7XHJcbiAgICAgICAgY29uc3QgW3A0eCwgcDR5XSA9IHRoaXMuYXJyYXlPZlBvaW50c1szXS5nZXRQYWlyKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGNlbnRlclggPSAocDF4ICsgcDJ4ICsgcDN4ICsgcDR4KSAvIDQ7XHJcbiAgICAgICAgY29uc3QgY2VudGVyWSA9IChwMXkgKyBwMnkgKyBwM3kgKyBwNHkpIC8gNDtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gbmV3IFBvaW50KFtjZW50ZXJYLCBjZW50ZXJZXSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZE1hdHJpeChnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LCBtYXRyaXhMb2NhdGlvbjogV2ViR0xVbmlmb3JtTG9jYXRpb24pOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBtYXRyaXggPSBUcmFuc2Zvcm1hdGlvbi50cmFuc2Zvcm1hdGlvbk1hdHJpeChcclxuICAgICAgICAgICAgZ2wuY2FudmFzLndpZHRoLFxyXG4gICAgICAgICAgICBnbC5jYW52YXMuaGVpZ2h0LFxyXG4gICAgICAgICAgICB0aGlzLnR4LFxyXG4gICAgICAgICAgICB0aGlzLnR5LFxyXG4gICAgICAgICAgICB0aGlzLmRlZ3JlZSxcclxuICAgICAgICAgICAgdGhpcy5zeCxcclxuICAgICAgICAgICAgdGhpcy5zeSxcclxuICAgICAgICAgICAgdGhpcy5reCxcclxuICAgICAgICAgICAgdGhpcy5reSxcclxuICAgICAgICAgICAgdGhpcy5jZW50ZXJcclxuICAgICAgICAgICkuZmxhdHRlbigpO1xyXG4gICAgICBcclxuICAgICAgICAgIGdsLnVuaWZvcm1NYXRyaXgzZnYobWF0cml4TG9jYXRpb24sIGZhbHNlLCBtYXRyaXgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFJlbmRlcmFibGUgTWV0aG9kc1xyXG4gICAgcHVibGljIGRyYXdNZXRob2QoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIGdsLlRSSUFOR0xFX0ZBTjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaXNEcmF3YWJsZSgpOiBib29sZWFuIHtcclxuICAgICAgICAvLyByZXR1cm4gdGhpcy5hcnJheU9mUG9pbnRzLmZpbHRlcihwb2ludCA9PiBwb2ludCAhPT0gbnVsbCkubGVuZ3RoID09PSA0O1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFycmF5T2ZQb2ludHNbMl0gIT09IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRyYXcocG9pbnQ6IFBvaW50KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5hcnJheU9mUG9pbnRzWzFdID0gbmV3IFBvaW50KFt0aGlzLmFycmF5T2ZQb2ludHNbMF0ueCwgcG9pbnQueV0pO1xyXG4gICAgICAgIHRoaXMuYXJyYXlPZlBvaW50c1syXSA9IHBvaW50O1xyXG4gICAgICAgIHRoaXMuYXJyYXlPZlBvaW50c1szXSA9IG5ldyBQb2ludChbcG9pbnQueCwgdGhpcy5hcnJheU9mUG9pbnRzWzBdLnldKTtcclxuICAgICAgICB0aGlzLmNlbnRlciA9IHRoaXMuZ2V0Q2VudGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldE51bWJlck9mVmVydGljZXNUb0JlRHJhd24oKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gNTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkUG9zaXRpb24oZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCk6IHZvaWQge1xyXG4gICAgICAgIGdsLmJ1ZmZlckRhdGEoXHJcbiAgICAgICAgICAgIGdsLkFSUkFZX0JVRkZFUixcclxuICAgICAgICAgICAgbmV3IEZsb2F0MzJBcnJheShbXHJcbiAgICAgICAgICAgICAgLi4udGhpcy5hcnJheU9mUG9pbnRzWzBdLmdldFBhaXIoKSxcclxuICAgICAgICAgICAgICAuLi50aGlzLmFycmF5T2ZQb2ludHNbMV0uZ2V0UGFpcigpLFxyXG4gICAgICAgICAgICAgIC4uLnRoaXMuYXJyYXlPZlBvaW50c1syXS5nZXRQYWlyKCksXHJcbiAgICAgICAgICAgICAgLi4udGhpcy5hcnJheU9mUG9pbnRzWzNdLmdldFBhaXIoKSxcclxuICAgICAgICAgICAgICAuLi50aGlzLmFycmF5T2ZQb2ludHNbMF0uZ2V0UGFpcigpLFxyXG4gICAgICAgICAgICBdKSxcclxuICAgICAgICAgICAgZ2wuU1RBVElDX0RSQVdcclxuICAgICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZENvbG9yKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQpOiB2b2lkIHtcclxuICAgICAgICBnbC5idWZmZXJEYXRhKFxyXG4gICAgICAgICAgICBnbC5BUlJBWV9CVUZGRVIsXHJcbiAgICAgICAgICAgIG5ldyBGbG9hdDMyQXJyYXkoW1xyXG4gICAgICAgICAgICAgIC4uLnRoaXMuYXJyYXlPZlBvaW50c1swXS5nZXRDb2xvcigpLFxyXG4gICAgICAgICAgICAgIC4uLnRoaXMuYXJyYXlPZlBvaW50c1sxXS5nZXRDb2xvcigpLFxyXG4gICAgICAgICAgICAgIC4uLnRoaXMuYXJyYXlPZlBvaW50c1syXS5nZXRDb2xvcigpLFxyXG4gICAgICAgICAgICAgIC4uLnRoaXMuYXJyYXlPZlBvaW50c1szXS5nZXRDb2xvcigpLFxyXG4gICAgICAgICAgICAgIC4uLnRoaXMuYXJyYXlPZlBvaW50c1swXS5nZXRDb2xvcigpLFxyXG4gICAgICAgICAgICBdKSxcclxuICAgICAgICAgICAgZ2wuU1RBVElDX0RSQVdcclxuICAgICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldFJlY3RhbmdsZUF0dHJpYnV0ZXModHg6IG51bWJlciwgdHk6IG51bWJlciwgZGVncmVlOiBudW1iZXIsIHN4OiBudW1iZXIsIHN5OiBudW1iZXIsIGt4OiBudW1iZXIsIGt5OiBudW1iZXIsIGFycmF5T2ZQb2ludHM6IFBvaW50W10pOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmFycmF5T2ZQb2ludHMgPSBhcnJheU9mUG9pbnRzO1xyXG4gICAgICAgIHRoaXMudHggPSB0eDtcclxuICAgICAgICB0aGlzLnR5ID0gdHk7XHJcbiAgICAgICAgdGhpcy5kZWdyZWUgPSBkZWdyZWU7XHJcbiAgICAgICAgdGhpcy5zeCA9IHN4O1xyXG4gICAgICAgIHRoaXMuc3kgPSBzeTtcclxuICAgICAgICB0aGlzLmt4ID0ga3g7XHJcbiAgICAgICAgdGhpcy5reSA9IGt5O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBSZWN0YW5nbGU7XHJcbiIsImltcG9ydCBQb2ludCBmcm9tIFwiQmFzZS9wb2ludFwiO1xyXG5pbXBvcnQgVHlwZSBmcm9tIFwiU2hhcGVzL3R5cGUuZW51bVwiO1xyXG5hYnN0cmFjdCBjbGFzcyBTaGFwZSB7XHJcbiAgICBwdWJsaWMgaWQ6IG51bWJlcjtcclxuICAgIHB1YmxpYyBudW1iZXJPZlZlcnRpY2VzOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgdHlwZTogVHlwZTtcclxuICAgIHB1YmxpYyBhcnJheU9mUG9pbnRzOiBQb2ludFtdO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihpZDogbnVtYmVyLCBudW1iZXJPZlZlcnRpY2VzOiBudW1iZXIsIHR5cGU6IFR5cGUpe1xyXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcclxuICAgICAgICB0aGlzLm51bWJlck9mVmVydGljZXMgPSBudW1iZXJPZlZlcnRpY2VzO1xyXG4gICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFic3RyYWN0IGdldENlbnRlcigpOiBQb2ludDtcclxuICAgIHB1YmxpYyBhYnN0cmFjdCBpc0RyYXdhYmxlKCk6IGJvb2xlYW47XHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgZHJhdyhwb2ludDogUG9pbnQpOiB2b2lkO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBTaGFwZTsiLCJpbXBvcnQgUmVuZGVyYWJsZSBmcm9tIFwiLi9JbnRlcmZhY2VzL3JlbmRlcmFibGUuaW50ZXJmYWNlXCI7XHJcbmltcG9ydCBTaGFwZSBmcm9tIFwiLi9zaGFwZVwiO1xyXG5pbXBvcnQgVHJhbnNmb3JtYXRpb24gZnJvbSBcIk1haW4vT3BlcmF0aW9ucy9UcmFuc2Zvcm1hdGlvblwiO1xyXG5pbXBvcnQgVHJhbnNmb3JtYWJsZSBmcm9tIFwiLi9JbnRlcmZhY2VzL3RyYW5zZm9ybWFibGUuaW50ZXJmYWNlXCI7XHJcbmltcG9ydCBQb2ludCBmcm9tIFwiLi4vQmFzZS9wb2ludFwiO1xyXG5pbXBvcnQgVHlwZSBmcm9tIFwiLi90eXBlLmVudW1cIjtcclxuXHJcbmNsYXNzIFNxdWFyZSBleHRlbmRzIFNoYXBlIGltcGxlbWVudHMgUmVuZGVyYWJsZSwgVHJhbnNmb3JtYWJsZSB7XHJcbiAgcHVibGljIGNlbnRlcjogUG9pbnQ7XHJcbiAgcHVibGljIGFycmF5T2ZQb2ludHM6IFBvaW50W107XHJcbiAgcHVibGljIHR4OiBudW1iZXI7XHJcbiAgcHVibGljIHR5OiBudW1iZXI7XHJcbiAgcHVibGljIGRlZ3JlZTogbnVtYmVyO1xyXG4gIHB1YmxpYyBzeDogbnVtYmVyO1xyXG4gIHB1YmxpYyBzeTogbnVtYmVyO1xyXG4gIHB1YmxpYyBreDogbnVtYmVyO1xyXG4gIHB1YmxpYyBreTogbnVtYmVyO1xyXG5cclxuICBwdWJsaWMgY29uc3RydWN0b3IoaWQ6IG51bWJlciwgY2VudGVyUG9pbnQ6IFBvaW50KSB7XHJcbiAgICBzdXBlcihpZCwgNCwgVHlwZS5TcXVhcmUpO1xyXG4gICAgdGhpcy5jZW50ZXIgPSBjZW50ZXJQb2ludDtcclxuICAgIHRoaXMuYXJyYXlPZlBvaW50cyA9IFtudWxsLCBudWxsLCBudWxsLCBudWxsXTtcclxuICAgIHRoaXMudHggPSAwO1xyXG4gICAgdGhpcy50eSA9IDA7XHJcbiAgICB0aGlzLmRlZ3JlZSA9IDA7XHJcbiAgICB0aGlzLnN4ID0gMTtcclxuICAgIHRoaXMuc3kgPSAxO1xyXG4gICAgdGhpcy5reCA9IDA7XHJcbiAgICB0aGlzLmt5ID0gMDtcclxuICB9XHJcblxyXG4gIC8vIFRyYW5zZm9ybWFibGUgTWV0aG9kc1xyXG4gIHB1YmxpYyBnZXRDZW50ZXIoKTogUG9pbnQge1xyXG4gICAgcmV0dXJuIHRoaXMuY2VudGVyO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGFkZE1hdHJpeChcclxuICAgIGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsXHJcbiAgICBtYXRyaXhMb2NhdGlvbjogV2ViR0xVbmlmb3JtTG9jYXRpb25cclxuICApOiB2b2lkIHtcclxuICAgIGNvbnN0IG1hdHJpeCA9IFRyYW5zZm9ybWF0aW9uLnRyYW5zZm9ybWF0aW9uTWF0cml4KFxyXG4gICAgICBnbC5jYW52YXMud2lkdGgsXHJcbiAgICAgIGdsLmNhbnZhcy5oZWlnaHQsXHJcbiAgICAgIHRoaXMudHgsXHJcbiAgICAgIHRoaXMudHksXHJcbiAgICAgIHRoaXMuZGVncmVlLFxyXG4gICAgICB0aGlzLnN4LFxyXG4gICAgICB0aGlzLnN5LFxyXG4gICAgICB0aGlzLmt4LFxyXG4gICAgICB0aGlzLmt5LFxyXG4gICAgICB0aGlzLmNlbnRlclxyXG4gICAgKS5mbGF0dGVuKCk7XHJcblxyXG4gICAgZ2wudW5pZm9ybU1hdHJpeDNmdihtYXRyaXhMb2NhdGlvbiwgZmFsc2UsIG1hdHJpeCk7XHJcbiAgfVxyXG5cclxuICAvLyBSZW5kZXJhYmxlIE1ldGhvZHNcclxuICBwdWJsaWMgZHJhd01ldGhvZChnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0KTogbnVtYmVyIHtcclxuICAgIHJldHVybiBnbC5UUklBTkdMRV9GQU47XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgaXNEcmF3YWJsZSgpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoID09PSA0O1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGRyYXcocDE6IFBvaW50KTogdm9pZCB7XHJcbiAgICB0aGlzLmFycmF5T2ZQb2ludHNbMF0gPSBwMTtcclxuICAgIGNvbnN0IFt4Q2VudGVyLCB5Q2VudGVyXSA9IHRoaXMuY2VudGVyLmdldFBhaXIoKTtcclxuICAgIC8vIGZvciAobGV0IGkgPSAxOyBpIDw9IDM7IGkrKykge1xyXG4gICAgLy8gICAgIGNvbnN0IGFuZ2xlID0gKGkgKiBNYXRoLlBJKSAvIDI7XHJcbiAgICAvLyAgICAgY29uc3Qgcm90YXRlZFBvaW50ID0gVHJhbnNmb3JtYXRpb24udHJhbnNsYXRpb24odGhpcy5jZW50ZXIuZ2V0WCgpLCB0aGlzLmNlbnRlci5nZXRZKCkpXHJcbiAgICAvLyAgICAgICAgIC5tdWx0aXBseU1hdHJpeChUcmFuc2Zvcm1hdGlvbi5yb3RhdGlvbihhbmdsZSkpXHJcbiAgICAvLyAgICAgICAgIC5tdWx0aXBseU1hdHJpeChUcmFuc2Zvcm1hdGlvbi50cmFuc2xhdGlvbigtdGhpcy5jZW50ZXIuZ2V0WCgpLCAtdGhpcy5jZW50ZXIuZ2V0WSgpKSlcclxuICAgIC8vICAgICAgICAgLm11bHRpcGx5UG9pbnQocDEpO1xyXG4gICAgLy8gICAgIHRoaXMuYXJyYXlPZlBvaW50c1tpXSA9IHJvdGF0ZWRQb2ludDtcclxuICAgIC8vIH1cclxuXHJcbiAgICB0aGlzLmFycmF5T2ZQb2ludHNbMV0gPSBUcmFuc2Zvcm1hdGlvbi50cmFuc2xhdGlvbih4Q2VudGVyLCB5Q2VudGVyKVxyXG4gICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24ucm90YXRpb24oMC41ICogTWF0aC5QSSkpXHJcbiAgICAgIC5tdWx0aXBseU1hdHJpeChUcmFuc2Zvcm1hdGlvbi50cmFuc2xhdGlvbigteENlbnRlciwgLXlDZW50ZXIpKVxyXG4gICAgICAubXVsdGlwbHlQb2ludCh0aGlzLmFycmF5T2ZQb2ludHNbMF0pO1xyXG5cclxuICAgIHRoaXMuYXJyYXlPZlBvaW50c1syXSA9IFRyYW5zZm9ybWF0aW9uLnRyYW5zbGF0aW9uKHhDZW50ZXIsIHlDZW50ZXIpXHJcbiAgICAgIC5tdWx0aXBseU1hdHJpeChUcmFuc2Zvcm1hdGlvbi5yb3RhdGlvbihNYXRoLlBJKSlcclxuICAgICAgLm11bHRpcGx5TWF0cml4KFRyYW5zZm9ybWF0aW9uLnRyYW5zbGF0aW9uKC14Q2VudGVyLCAteUNlbnRlcikpXHJcbiAgICAgIC5tdWx0aXBseVBvaW50KHRoaXMuYXJyYXlPZlBvaW50c1swXSk7XHJcblxyXG4gICAgdGhpcy5hcnJheU9mUG9pbnRzWzNdID0gVHJhbnNmb3JtYXRpb24udHJhbnNsYXRpb24oeENlbnRlciwgeUNlbnRlcilcclxuICAgICAgLm11bHRpcGx5TWF0cml4KFRyYW5zZm9ybWF0aW9uLnJvdGF0aW9uKDEuNSAqIE1hdGguUEkpKVxyXG4gICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24udHJhbnNsYXRpb24oLXhDZW50ZXIsIC15Q2VudGVyKSlcclxuICAgICAgLm11bHRpcGx5UG9pbnQodGhpcy5hcnJheU9mUG9pbnRzWzBdKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBnZXROdW1iZXJPZlZlcnRpY2VzVG9CZURyYXduKCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gNTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhZGRQb3NpdGlvbihnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0KTogdm9pZCB7XHJcbiAgICBnbC5idWZmZXJEYXRhKFxyXG4gICAgICBnbC5BUlJBWV9CVUZGRVIsXHJcbiAgICAgIG5ldyBGbG9hdDMyQXJyYXkoW1xyXG4gICAgICAgIC4uLnRoaXMuYXJyYXlPZlBvaW50c1swXS5nZXRQYWlyKCksXHJcbiAgICAgICAgLi4udGhpcy5hcnJheU9mUG9pbnRzWzFdLmdldFBhaXIoKSxcclxuICAgICAgICAuLi50aGlzLmFycmF5T2ZQb2ludHNbMl0uZ2V0UGFpcigpLFxyXG4gICAgICAgIC4uLnRoaXMuYXJyYXlPZlBvaW50c1szXS5nZXRQYWlyKCksXHJcbiAgICAgICAgLi4udGhpcy5hcnJheU9mUG9pbnRzWzBdLmdldFBhaXIoKSxcclxuICAgICAgXSksXHJcbiAgICAgIGdsLlNUQVRJQ19EUkFXXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGFkZENvbG9yKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQpOiB2b2lkIHtcclxuICAgIGdsLmJ1ZmZlckRhdGEoXHJcbiAgICAgIGdsLkFSUkFZX0JVRkZFUixcclxuICAgICAgbmV3IEZsb2F0MzJBcnJheShbXHJcbiAgICAgICAgLi4udGhpcy5hcnJheU9mUG9pbnRzWzBdLmdldENvbG9yKCksXHJcbiAgICAgICAgLi4udGhpcy5hcnJheU9mUG9pbnRzWzFdLmdldENvbG9yKCksXHJcbiAgICAgICAgLi4udGhpcy5hcnJheU9mUG9pbnRzWzJdLmdldENvbG9yKCksXHJcbiAgICAgICAgLi4udGhpcy5hcnJheU9mUG9pbnRzWzNdLmdldENvbG9yKCksXHJcbiAgICAgICAgLi4udGhpcy5hcnJheU9mUG9pbnRzWzBdLmdldENvbG9yKCksXHJcbiAgICAgIF0pLFxyXG4gICAgICBnbC5TVEFUSUNfRFJBV1xyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzZXRTcXVhcmVBdHRyaWJ1dGVzKFxyXG4gICAgdHg6IG51bWJlcixcclxuICAgIHR5OiBudW1iZXIsXHJcbiAgICBkZWdyZWU6IG51bWJlcixcclxuICAgIHN4OiBudW1iZXIsXHJcbiAgICBzeTogbnVtYmVyLFxyXG4gICAga3g6IG51bWJlcixcclxuICAgIGt5OiBudW1iZXIsXHJcbiAgICBhcnJheU9mUG9pbnRzOiBQb2ludFtdXHJcbiAgKTogdm9pZCB7XHJcbiAgICB0aGlzLmFycmF5T2ZQb2ludHMgPSBhcnJheU9mUG9pbnRzO1xyXG4gICAgdGhpcy50eCA9IHR4O1xyXG4gICAgdGhpcy50eSA9IHR5O1xyXG4gICAgdGhpcy5kZWdyZWUgPSBkZWdyZWU7XHJcbiAgICB0aGlzLnN4ID0gc3g7XHJcbiAgICB0aGlzLnN5ID0gc3k7XHJcbiAgICB0aGlzLmt4ID0ga3g7XHJcbiAgICB0aGlzLmt5ID0ga3k7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBTcXVhcmU7XHJcbiIsImVudW0gVHlwZSB7XHJcbiAgICBMaW5lLFxyXG4gICAgUmVjdGFuZ2xlLFxyXG4gICAgU3F1YXJlLFxyXG4gICAgUG9seWdvblxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBUeXBlOyIsImNsYXNzIENvb3JkaW5hdGUge1xyXG4gICAgcHVibGljIHg6IG51bWJlcjtcclxuICAgIHB1YmxpYyB5OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgdzogbnVtYmVyO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcih4OiBudW1iZXIsIHk6IG51bWJlciwgdzogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICB0aGlzLnkgPSB5O1xyXG4gICAgICAgIHRoaXMudyA9IHc7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldENvb3JkaW5hdGUoKTogW251bWJlciwgbnVtYmVyLCBudW1iZXJdIHtcclxuICAgICAgICByZXR1cm4gW3RoaXMueCwgdGhpcy55LCB0aGlzLnddO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRDb29yZGluYXRlKHg6IG51bWJlciwgeTogbnVtYmVyLCB3OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICAgICAgdGhpcy53ID0gdztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0WCh4OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRZKHk6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldFcodzogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy53ID0gdztcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIGdldFgoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy54O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRZKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMueTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0VygpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnc7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IENvb3JkaW5hdGU7IiwiaW1wb3J0IENvb3JkaW5hdGUgZnJvbSAnQmFzZS9jb29yZGluYXRlJztcclxuaW1wb3J0IFBvaW50IGZyb20gJ0Jhc2UvcG9pbnQnO1xyXG5cclxuY2xhc3MgTWF0cml4IHtcclxuICAgIHB1YmxpYyBtMTogW251bWJlciwgbnVtYmVyLCBudW1iZXJdO1xyXG4gICAgcHVibGljIG0yOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl07XHJcbiAgICBwdWJsaWMgbTM6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXTtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IobTE6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSwgbTI6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSwgbTM6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSkge1xyXG4gICAgICAgIHRoaXMubTEgPSBtMTtcclxuICAgICAgICB0aGlzLm0yID0gbTI7XHJcbiAgICAgICAgdGhpcy5tMyA9IG0zO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBmbGF0dGVuKCkgOiBudW1iZXJbXSB7XHJcbiAgICAgICAgcmV0dXJuIFsuLi50aGlzLm0xLCAuLi50aGlzLm0yLCAuLi50aGlzLm0zXVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBtdWx0aXBseU1hdHJpeChvdGhlck1hdHJpeDogTWF0cml4KTogTWF0cml4IHtcclxuICAgICAgICBjb25zdCBbYTExLCBhMjEsIGEzMV0gPSBvdGhlck1hdHJpeC5tMTtcclxuICAgICAgICBjb25zdCBbYTEyLCBhMjIsIGEzMl0gPSBvdGhlck1hdHJpeC5tMjtcclxuICAgICAgICBjb25zdCBbYTEzLCBhMjMsIGEzM10gPSBvdGhlck1hdHJpeC5tMztcclxuXHJcbiAgICAgICAgY29uc3QgW2IxMSwgYjEyLCBiMTNdID0gdGhpcy5tMTtcclxuICAgICAgICBjb25zdCBbYjIxLCBiMjIsIGIyM10gPSB0aGlzLm0yO1xyXG4gICAgICAgIGNvbnN0IFtiMzEsIGIzMiwgYjMzXSA9IHRoaXMubTM7XHJcblxyXG4gICAgICAgIGNvbnN0IGMxMSA9IGIxMSAqIGExMSArIGIyMSAqIGEyMSArIGIzMSAqIGEzMVxyXG4gICAgICAgIGNvbnN0IGMxMiA9IGIxMSAqIGExMiArIGIyMSAqIGEyMiArIGIzMSAqIGEzMlxyXG4gICAgICAgIGNvbnN0IGMxMyA9IGIxMSAqIGExMyArIGIyMSAqIGEyMyArIGIzMSAqIGEzM1xyXG4gICAgICAgIGNvbnN0IGMyMSA9IGIxMiAqIGExMSArIGIyMiAqIGEyMSArIGIzMiAqIGEzMVxyXG4gICAgICAgIGNvbnN0IGMyMiA9IGIxMiAqIGExMiArIGIyMiAqIGEyMiArIGIzMiAqIGEzMlxyXG4gICAgICAgIGNvbnN0IGMyMyA9IGIxMiAqIGExMyArIGIyMiAqIGEyMyArIGIzMiAqIGEzM1xyXG4gICAgICAgIGNvbnN0IGMzMSA9IGIxMyAqIGExMSArIGIyMyAqIGEyMSArIGIzMyAqIGEzMVxyXG4gICAgICAgIGNvbnN0IGMzMiA9IGIxMyAqIGExMiArIGIyMyAqIGEyMiArIGIzMyAqIGEzMlxyXG4gICAgICAgIGNvbnN0IGMzMyA9IGIxMyAqIGExMyArIGIyMyAqIGEyMyArIGIzMyAqIGEzM1xyXG5cclxuICAgICAgICBjb25zdCBtYXRyaXggPSBuZXcgTWF0cml4KFtjMTEsIGMyMSwgYzMxXSwgW2MxMiwgYzIyLCBjMzJdLCBbYzEzLCBjMjMsIGMzM10pO1xyXG4gICAgICAgIHJldHVybiBtYXRyaXg7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHB1YmxpYyBtdWx0aXBseVBvaW50KHBvaW50OiBQb2ludCk6IFBvaW50IHtcclxuICAgICAgICBjb25zdCBbYTExLCBhMjEsIGEzMV0gPSB0aGlzLm0xO1xyXG4gICAgICAgIGNvbnN0IFthMTIsIGEyMiwgYTMyXSA9IHRoaXMubTI7XHJcbiAgICAgICAgY29uc3QgW2ExMywgYTIzLCBhMzNdID0gdGhpcy5tMztcclxuXHJcbiAgICAgICAgY29uc3QgeDEgPSBhMTEgKiBwb2ludC54ICsgYTEyICogcG9pbnQueSArIGExMyAqIHBvaW50Lnc7XHJcbiAgICAgICAgY29uc3QgeTEgPSBhMjEgKiBwb2ludC54ICsgYTIyICogcG9pbnQueSArIGEyMyAqIHBvaW50Lnc7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgbmV3UG9pbnQgPSBuZXcgUG9pbnQoW3gxLCB5MV0pO1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3UG9pbnQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IE1hdHJpeDsiLCJpbXBvcnQgQ29vcmRpbmF0ZSBmcm9tIFwiLi9jb29yZGluYXRlXCI7XHJcblxyXG5jbGFzcyBQb2ludCAgZXh0ZW5kcyBDb29yZGluYXRlIHtcclxuICAgIHB1YmxpYyByOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgZzogbnVtYmVyO1xyXG4gICAgcHVibGljIGI6IG51bWJlcjtcclxuICAgIHB1YmxpYyBhOiBudW1iZXI7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHBvc2l0aW9uOiBbbnVtYmVyLCBudW1iZXJdLCBjb2xvcjogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPSBbMCwgMCwgMCwgMV0pIHtcclxuICAgICAgICBzdXBlciguLi5wb3NpdGlvbiwgMSk7XHJcblxyXG4gICAgICAgIFt0aGlzLnIsIHRoaXMuZywgdGhpcy5iLCB0aGlzLmFdID0gY29sb3I7XHJcblxyXG4gICAgICAgIGNvbnN0IFtyLCBnLCBiLCBhXSA9IGNvbG9yO1xyXG4gICAgICAgIHRoaXMuciA9IHI7XHJcbiAgICAgICAgdGhpcy5nID0gZztcclxuICAgICAgICB0aGlzLmIgPSBiO1xyXG4gICAgICAgIHRoaXMuYSA9IGE7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFBhaXIoKTogW251bWJlciwgbnVtYmVyXSB7XHJcbiAgICAgICAgcmV0dXJuIFt0aGlzLngsIHRoaXMueV07XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldENvbG9yKCk6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdIHtcclxuICAgICAgICByZXR1cm4gW3RoaXMuciwgdGhpcy5nLCB0aGlzLmIsIHRoaXMuYV07XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldENvbG9yKGNvbG9yOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IFtyLCBnLCBiLCBhXSA9IGNvbG9yO1xyXG4gICAgICAgIHRoaXMuciA9IHI7XHJcbiAgICAgICAgdGhpcy5nID0gZztcclxuICAgICAgICB0aGlzLmIgPSBiO1xyXG4gICAgICAgIHRoaXMuYSA9IGE7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFBvaW50OyIsImltcG9ydCB7IGxvYWRTaGFkZXIgfSBmcm9tIFwiLi9sb2FkLXNoYWRlclwiO1xyXG5cclxuLy9cclxuLy8gSW5pdGlhbGl6ZSBhIHNoYWRlciBwcm9ncmFtLCBzbyBXZWJHTCBrbm93cyBob3cgdG8gZHJhdyBvdXIgZGF0YVxyXG4vL1xyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlU2hhZGVyUHJvZ3JhbShnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LCB2c1NvdXJjZTogc3RyaW5nLCBmc1NvdXJjZTogc3RyaW5nKSB7XHJcbiAgICBjb25zdCB2ZXJ0ZXhTaGFkZXIgPSBsb2FkU2hhZGVyKGdsLCBnbC5WRVJURVhfU0hBREVSLCB2c1NvdXJjZSk7XHJcbiAgICBjb25zdCBmcmFnbWVudFNoYWRlciA9IGxvYWRTaGFkZXIoZ2wsIGdsLkZSQUdNRU5UX1NIQURFUiwgZnNTb3VyY2UpO1xyXG4gIFxyXG4gICAgLy8gQ3JlYXRlIHRoZSBzaGFkZXIgcHJvZ3JhbVxyXG4gICAgY29uc3Qgc2hhZGVyUHJvZ3JhbSA9IGdsLmNyZWF0ZVByb2dyYW0oKTtcclxuICAgIGdsLmF0dGFjaFNoYWRlcihzaGFkZXJQcm9ncmFtLCB2ZXJ0ZXhTaGFkZXIpO1xyXG4gICAgZ2wuYXR0YWNoU2hhZGVyKHNoYWRlclByb2dyYW0sIGZyYWdtZW50U2hhZGVyKTtcclxuICAgIGdsLmxpbmtQcm9ncmFtKHNoYWRlclByb2dyYW0pO1xyXG4gIFxyXG4gICAgLy8gSWYgY3JlYXRpbmcgdGhlIHNoYWRlciBwcm9ncmFtIGZhaWxlZCwgYWxlcnRcclxuICBcclxuICAgIGlmICghZ2wuZ2V0UHJvZ3JhbVBhcmFtZXRlcihzaGFkZXJQcm9ncmFtLCBnbC5MSU5LX1NUQVRVUykpIHtcclxuICAgICAgYWxlcnQoXHJcbiAgICAgICAgYFVuYWJsZSB0byBpbml0aWFsaXplIHRoZSBzaGFkZXIgcHJvZ3JhbTogJHtnbC5nZXRQcm9ncmFtSW5mb0xvZyhcclxuICAgICAgICAgIHNoYWRlclByb2dyYW0sXHJcbiAgICAgICAgKX1gLFxyXG4gICAgICApO1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIHJldHVybiBzaGFkZXJQcm9ncmFtO1xyXG4gIH0iLCIgIC8vXHJcbiAgLy8gY3JlYXRlcyBhIHNoYWRlciBvZiB0aGUgZ2l2ZW4gdHlwZSwgdXBsb2FkcyB0aGUgc291cmNlIGFuZFxyXG4gIC8vIGNvbXBpbGVzIGl0LlxyXG4gIC8vXHJcbmV4cG9ydCBmdW5jdGlvbiBsb2FkU2hhZGVyKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsIHR5cGU6IG51bWJlciwgc291cmNlOiBzdHJpbmcpOiBXZWJHTFNoYWRlciB7XHJcbiAgICBjb25zdCBzaGFkZXIgPSBnbC5jcmVhdGVTaGFkZXIodHlwZSk7XHJcbiAgXHJcbiAgICAvLyBTZW5kIHRoZSBzb3VyY2UgdG8gdGhlIHNoYWRlciBvYmplY3RcclxuICAgIGdsLnNoYWRlclNvdXJjZShzaGFkZXIsIHNvdXJjZSk7XHJcbiAgXHJcbiAgICAvLyBDb21waWxlIHRoZSBzaGFkZXIgcHJvZ3JhbVxyXG4gICAgZ2wuY29tcGlsZVNoYWRlcihzaGFkZXIpO1xyXG4gIFxyXG4gICAgLy8gU2VlIGlmIGl0IGNvbXBpbGVkIHN1Y2Nlc3NmdWxseVxyXG4gICAgaWYgKCFnbC5nZXRTaGFkZXJQYXJhbWV0ZXIoc2hhZGVyLCBnbC5DT01QSUxFX1NUQVRVUykpIHtcclxuICAgICAgYWxlcnQoYEFuIGVycm9yIG9jY3VycmVkIGNvbXBpbGluZyB0aGUgc2hhZGVyczogJHtnbC5nZXRTaGFkZXJJbmZvTG9nKHNoYWRlcil9YCwpO1xyXG4gICAgICBnbC5kZWxldGVTaGFkZXIoc2hhZGVyKTtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gc2hhZGVyO1xyXG59IiwiaW1wb3J0IFNoYXBlIGZyb20gXCJNYWluLzJELVNoYXBlcy9zaGFwZVwiO1xyXG5pbXBvcnQgeyByZW5kZXIgfSBmcm9tIFwiLi9yZW5kZXJcIjtcclxuaW1wb3J0IFByb2dyYW1JbmZvIGZyb20gXCIuL3Byb2dyYW0taW5mby5pbnRlcmZhY2VcIjtcclxuaW1wb3J0IFJlbmRlcmFibGUgZnJvbSBcIk1haW4vMkQtU2hhcGVzL0ludGVyZmFjZXMvcmVuZGVyYWJsZS5pbnRlcmZhY2VcIjtcclxuaW1wb3J0IFRyYW5zZm9ybWFibGUgZnJvbSBcIk1haW4vMkQtU2hhcGVzL0ludGVyZmFjZXMvdHJhbnNmb3JtYWJsZS5pbnRlcmZhY2VcIjtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZW5kZXJBbGwoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCwgcHJvZ3JhbUluZm86IFByb2dyYW1JbmZvLCBzaGFwZXM6IChSZW5kZXJhYmxlJlRyYW5zZm9ybWFibGUpW10sIHBvc2l0aW9uQnVmZmVyOiBXZWJHTEJ1ZmZlciwgY29sb3JCdWZmZXI6IFdlYkdMQnVmZmVyKTogdm9pZCB7XHJcbiAgICBnbC5jbGVhcihnbC5DT0xPUl9CVUZGRVJfQklUKTtcclxuICBcclxuICAgIGZvciAoY29uc3Qgc2hhcGUgb2Ygc2hhcGVzKSB7XHJcbiAgICAgIHJlbmRlcihnbCwgcHJvZ3JhbUluZm8sIHNoYXBlLCBwb3NpdGlvbkJ1ZmZlciwgY29sb3JCdWZmZXIpXHJcbiAgICB9XHJcbn07IiwiaW1wb3J0IFJlbmRlcmFibGUgZnJvbSBcIk1haW4vMkQtU2hhcGVzL0ludGVyZmFjZXMvcmVuZGVyYWJsZS5pbnRlcmZhY2VcIjtcclxuaW1wb3J0IFByb2dyYW1JbmZvIGZyb20gXCIuL3Byb2dyYW0taW5mby5pbnRlcmZhY2VcIjtcclxuaW1wb3J0IFRyYW5zZm9ybWFibGUgZnJvbSBcIk1haW4vMkQtU2hhcGVzL0ludGVyZmFjZXMvdHJhbnNmb3JtYWJsZS5pbnRlcmZhY2VcIjtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZW5kZXIoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCwgcHJvZ3JhbUluZm86IFByb2dyYW1JbmZvLCBvYmplY3Q6IFJlbmRlcmFibGUgJiBUcmFuc2Zvcm1hYmxlLCBwb3NpdGlvbkJ1ZmZlcjogV2ViR0xCdWZmZXIsIGNvbG9yQnVmZmVyOiBXZWJHTEJ1ZmZlcik6IHZvaWQge1xyXG4gICAgaWYgKCFvYmplY3QuaXNEcmF3YWJsZSgpKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIC8vIEFkZCBQb3NpdGlvbiB0byBnbCBidWZmZXJcclxuICAgIGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KHByb2dyYW1JbmZvLmF0dHJpYkxvY2F0aW9ucy52ZXJ0ZXhQb3NpdGlvbik7XHJcbiAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgcG9zaXRpb25CdWZmZXIpO1xyXG4gICAgb2JqZWN0LmFkZFBvc2l0aW9uKGdsKTtcclxuICAgIGNvbnN0IG51bUNvbXBvbmVudHMgPSAyOyAvLyBwdWxsIG91dCAyIHZhbHVlcyBwZXIgaXRlcmF0aW9uXHJcbiAgICBjb25zdCB0eXBlID0gZ2wuRkxPQVQ7IC8vIHRoZSBkYXRhIGluIHRoZSBidWZmZXIgaXMgMzJiaXQgZmxvYXRzXHJcbiAgICBjb25zdCBub3JtYWxpemUgPSBmYWxzZTsgLy8gZG9uJ3Qgbm9ybWFsaXplXHJcbiAgICBjb25zdCBzdHJpZGUgPSAwOyAvLyBob3cgbWFueSBieXRlcyB0byBnZXQgZnJvbSBvbmUgc2V0IG9mIHZhbHVlcyB0byB0aGUgbmV4dFxyXG4gICAgLy8gMCA9IHVzZSB0eXBlIGFuZCBudW1Db21wb25lbnRzIGFib3ZlXHJcbiAgICBjb25zdCBvZmZzZXQgPSAwOyAvLyBob3cgbWFueSBieXRlcyBpbnNpZGUgdGhlIGJ1ZmZlciB0byBzdGFydCBmcm9tXHJcbiAgICBnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKFxyXG4gICAgICBwcm9ncmFtSW5mby5hdHRyaWJMb2NhdGlvbnMudmVydGV4UG9zaXRpb24sXHJcbiAgICAgIG51bUNvbXBvbmVudHMsXHJcbiAgICAgIHR5cGUsXHJcbiAgICAgIG5vcm1hbGl6ZSxcclxuICAgICAgc3RyaWRlLFxyXG4gICAgICBvZmZzZXQsXHJcbiAgICApO1xyXG5cclxuICAgIFxyXG4gICAgZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkocHJvZ3JhbUluZm8uYXR0cmliTG9jYXRpb25zLnZlcnRleENvbG9yKTtcclxuICAgIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBjb2xvckJ1ZmZlcik7XHJcbiAgICBvYmplY3QuYWRkQ29sb3IoZ2wpO1xyXG4gICAgY29uc3QgY29sb3JTaXplID0gNDsgLyogNCBjb21wb25lbnRzIHBlciBpdGVyYXRpb24gKi9cclxuICAgIGNvbnN0IGNvbG9yVHlwZSA9IGdsLkZMT0FUOyAvKiBUaGUgZGF0YSBpcyAzMiBiaXQgZmxvYXQgKi9cclxuICAgIGNvbnN0IGNvbG9yTm9ybWFsaXplZCA9IGZhbHNlOyAvKiBEb24ndCBub3JtYWxpemUgdGhlIGRhdGEgKi9cclxuICAgIGNvbnN0IGNvbG9yU3RyaWRlID0gMDsgLyogMDogTW92ZSBmb3J3YXJkIHNpemUgKiBzaXplb2YodHlwZSkgZWFjaCBpdGVyYXRpb24gdG8gZ2V0IHRoZSBuZXh0IHBvc2l0aW9uICovXHJcbiAgICBjb25zdCBjb2xvck9mZnNldCA9IDA7IC8qIFN0YXJ0IGF0IHRoZSBiZWdpbm5pbmcgb2YgdGhlIGJ1ZmZlciAqL1xyXG4gICAgZ2wudmVydGV4QXR0cmliUG9pbnRlcihcclxuICAgICAgcHJvZ3JhbUluZm8uYXR0cmliTG9jYXRpb25zLnZlcnRleENvbG9yLFxyXG4gICAgICBjb2xvclNpemUsXHJcbiAgICAgIGNvbG9yVHlwZSxcclxuICAgICAgY29sb3JOb3JtYWxpemVkLFxyXG4gICAgICBjb2xvclN0cmlkZSxcclxuICAgICAgY29sb3JPZmZzZXRcclxuICAgICk7XHJcbiAgICBcclxuICAgIFxyXG4gICAgLy8gQWRkIE1hdHJpeCB0byBnbFxyXG4gICAgY29uc3QgbWF0cml4TG9jYXRpb24gPSBwcm9ncmFtSW5mby51bmlmb3JtTG9jYXRpb25zLm1hdHJpeExvY2F0aW9uXHJcbiAgICBvYmplY3QuYWRkTWF0cml4KGdsLCBtYXRyaXhMb2NhdGlvbik7XHJcbiAgICAvKiBEcmF3IHNjZW5lICovXHJcbiAgICBjb25zdCBwcmltaXRpdmVUeXBlID0gb2JqZWN0LmRyYXdNZXRob2QoZ2wpO1xyXG4gICAgLy8gY29uc3Qgb2Zmc2V0ID0gMDtcclxuICAgIGNvbnN0IG51bWJlck9mVmVydGljZXNUb0JlRHJhd24gPSBvYmplY3QuZ2V0TnVtYmVyT2ZWZXJ0aWNlc1RvQmVEcmF3bigpO1xyXG4gICAgZ2wuZHJhd0FycmF5cyhwcmltaXRpdmVUeXBlLCBvZmZzZXQsIG51bWJlck9mVmVydGljZXNUb0JlRHJhd24pO1xyXG59IiwiaW1wb3J0IE1hdHJpeCBmcm9tIFwiTWFpbi9CYXNlL21hdHJpeFwiO1xyXG5pbXBvcnQgUG9pbnQgZnJvbSBcIk1haW4vQmFzZS9wb2ludFwiO1xyXG5cclxuXHJcbmNsYXNzIFRyYW5zZm9ybWF0aW9ue1xyXG4gICAgcHVibGljIHN0YXRpYyBwcm9qZWN0aW9uKHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyKTogTWF0cml4IHtcclxuICAgICAgICBjb25zdCBtYXRyaXggPSBuZXcgTWF0cml4KFsyL3dpZHRoLCAwLCAwXSwgWzAsIC0yL2hlaWdodCwgMF0sIFstMSwgMSwgMV0pO1xyXG4gICAgICAgIHJldHVybiBtYXRyaXg7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc3RhdGljIHRyYW5zbGF0aW9uKHR4OiBudW1iZXIsIHR5OiBudW1iZXIpOiBNYXRyaXgge1xyXG4gICAgICAgIGNvbnN0IG1hdHJpeCA9IG5ldyBNYXRyaXgoWzEsMCwwXSwgWzAsIDEsIDBdLCBbdHgsIHR5LCAxXSk7XHJcbiAgICAgICAgcmV0dXJuIG1hdHJpeDtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzdGF0aWMgcm90YXRpb24oZGVncmVlOiBudW1iZXIpOiBNYXRyaXgge1xyXG4gICAgICAgIGNvbnN0IG1hdHJpeCA9IG5ldyBNYXRyaXgoW01hdGguY29zKGRlZ3JlZSksIE1hdGguc2luKGRlZ3JlZSksIDBdLCBbLU1hdGguc2luKGRlZ3JlZSksIE1hdGguY29zKGRlZ3JlZSksIDBdLCBbMCwgMCwgMV0pO1xyXG4gICAgICAgIHJldHVybiBtYXRyaXg7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc3RhdGljIHNjYWxlKHN4OiBudW1iZXIsIHN5OiBudW1iZXIpOiBNYXRyaXgge1xyXG4gICAgICAgIGNvbnN0IG1hdHJpeCA9IG5ldyBNYXRyaXgoW3N4LDAsMF0sIFswLCBzeSwgMF0sIFswLCAwLCAxXSk7XHJcbiAgICAgICAgcmV0dXJuIG1hdHJpeFxyXG4gICAgfVxyXG4gICAgcHVibGljIHN0YXRpYyBzaGVhclgoa3g6IG51bWJlcik6IE1hdHJpeCB7XHJcbiAgICAgICAgY29uc3QgbWF0cml4ID0gbmV3IE1hdHJpeChbMSwgMCwgMF0sIFtreCwgMSwgMF0sIFswLCAwLCAxXSk7XHJcbiAgICAgICAgcmV0dXJuIG1hdHJpeDtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzdGF0aWMgc2hlYXJZKGt5OiBudW1iZXIpOiBNYXRyaXgge1xyXG4gICAgICAgIGNvbnN0IG1hdHJpeCA9IG5ldyBNYXRyaXgoWzEsIGt5LCAwXSwgWzAsIDEsIDBdLCBbMCwgMCwgMV0pO1xyXG4gICAgICAgIHJldHVybiBtYXRyaXg7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc3RhdGljIHRyYW5zZm9ybWF0aW9uTWF0cml4KFxyXG4gICAgICAgIHdpZHRoOiBudW1iZXIsXHJcbiAgICAgICAgaGVpZ2h0OiBudW1iZXIsXHJcbiAgICAgICAgdHg6IG51bWJlcixcclxuICAgICAgICB0eTogbnVtYmVyLFxyXG4gICAgICAgIGRlZ3JlZTogbnVtYmVyLFxyXG4gICAgICAgIHN4OiBudW1iZXIsXHJcbiAgICAgICAgc3k6IG51bWJlcixcclxuICAgICAgICBreDogbnVtYmVyLFxyXG4gICAgICAgIGt5OiBudW1iZXIsXHJcbiAgICAgICAgY2VudGVyOiBQb2ludFxyXG4gICAgKSA6IE1hdHJpeCB7XHJcbiAgICAgICAgcmV0dXJuIFRyYW5zZm9ybWF0aW9uLnByb2plY3Rpb24od2lkdGgsIGhlaWdodClcclxuICAgICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24udHJhbnNsYXRpb24odHgsIHR5KSlcclxuICAgICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24udHJhbnNsYXRpb24oY2VudGVyLmdldFgoKSwgY2VudGVyLmdldFkoKSkpXHJcbiAgICAgICAgLm11bHRpcGx5TWF0cml4KFRyYW5zZm9ybWF0aW9uLnJvdGF0aW9uKGRlZ3JlZSkpXHJcbiAgICAgICAgLm11bHRpcGx5TWF0cml4KFRyYW5zZm9ybWF0aW9uLnNjYWxlKHN4LCBzeSkpXHJcbiAgICAgICAgLm11bHRpcGx5TWF0cml4KFRyYW5zZm9ybWF0aW9uLnNoZWFyWChreCkpXHJcbiAgICAgICAgLm11bHRpcGx5TWF0cml4KFRyYW5zZm9ybWF0aW9uLnNoZWFyWShreSkpXHJcbiAgICAgICAgLm11bHRpcGx5TWF0cml4KFRyYW5zZm9ybWF0aW9uLnRyYW5zbGF0aW9uKC1jZW50ZXIuZ2V0WCgpLCAtY2VudGVyLmdldFkoKSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgaW52ZXJzZVRyYW5zZm9ybWF0aW9uTWF0cml4KFxyXG4gICAgICAgIHdpZHRoOiBudW1iZXIsXHJcbiAgICAgICAgaGVpZ2h0OiBudW1iZXIsXHJcbiAgICAgICAgdHg6IG51bWJlcixcclxuICAgICAgICB0eTogbnVtYmVyLFxyXG4gICAgICAgIGRlZ3JlZTogbnVtYmVyLFxyXG4gICAgICAgIHN4OiBudW1iZXIsXHJcbiAgICAgICAgc3k6IG51bWJlcixcclxuICAgICAgICBreDogbnVtYmVyLFxyXG4gICAgICAgIGt5OiBudW1iZXIsXHJcbiAgICAgICAgY2VudGVyOiBQb2ludFxyXG4gICAgKSA6IE1hdHJpeCB7XHJcbiAgICAgICAgcmV0dXJuIFRyYW5zZm9ybWF0aW9uLnRyYW5zbGF0aW9uKGNlbnRlci5nZXRYKCksIGNlbnRlci5nZXRZKCkpXHJcbiAgICAgICAgLm11bHRpcGx5TWF0cml4KFRyYW5zZm9ybWF0aW9uLnNoZWFyWSgta3kpKVxyXG4gICAgICAgIC5tdWx0aXBseU1hdHJpeChUcmFuc2Zvcm1hdGlvbi5zaGVhclgoLWt4KSlcclxuICAgICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24uc2NhbGUoMSAvIHN4LCAxIC8gc3kpKVxyXG4gICAgICAgIC5tdWx0aXBseU1hdHJpeChUcmFuc2Zvcm1hdGlvbi5yb3RhdGlvbigtZGVncmVlKSlcclxuICAgICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24udHJhbnNsYXRpb24oLWNlbnRlci5nZXRYKCksIC1jZW50ZXIuZ2V0WSgpKSlcclxuICAgICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24udHJhbnNsYXRpb24oLXR4LCAtdHkpKVxyXG4gICAgICAgIC8vIC5tdWx0aXBseU1hdHJpeChUcmFuc2Zvcm1hdGlvbi5wcm9qZWN0aW9uKDEgLyB3aWR0aCwgMSAvIGhlaWdodCkpO1xyXG4gICAgfVxyXG5cclxufVxyXG5leHBvcnQgZGVmYXVsdCBUcmFuc2Zvcm1hdGlvbjsiLCJpbXBvcnQgUG9pbnQgZnJvbSBcIk1haW4vQmFzZS9wb2ludFwiXHJcblxyXG5mdW5jdGlvbiBvcmllbnRhdGlvbihwOiBQb2ludCwgcTogUG9pbnQsIHI6IFBvaW50KTogbnVtYmVyIHtcclxuICAgIGNvbnN0IHZhbCA9IChxLnkgLSBwLnkpICogKHIueCAtIHEueCkgLSAocS54IC0gcC54KSAqIChyLnkgLSBxLnkpO1xyXG5cclxuICAgIGlmICh2YWwgPT09IDApIHJldHVybiAwO1xyXG5cclxuICAgIHJldHVybiB2YWwgPiAwID8gMSA6IDI7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNvbnZleEh1bGwocG9pbnRzOiBQb2ludFtdKTogUG9pbnRbXSB7XHJcbiAgICBjb25zdCBuID0gcG9pbnRzLmxlbmd0aDtcclxuICAgIGlmIChuIDwgMykgcmV0dXJuIFtdO1xyXG5cclxuICAgIGNvbnN0IGh1bGw6IFBvaW50W10gPSBbXTtcclxuICAgIGxldCBsID0gMDtcclxuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgaWYgKHBvaW50c1tpXS54IDwgcG9pbnRzW2xdLngpIHtcclxuICAgICAgICAgICAgbCA9IGk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGxldCBwID0gbDtcclxuICAgIGxldCBxOiBudW1iZXI7XHJcbiAgICBkbyB7XHJcbiAgICAgICAgaHVsbC5wdXNoKHBvaW50c1twXSk7XHJcbiAgICAgICAgcSA9IChwICsgMSkgJSBuO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChvcmllbnRhdGlvbihwb2ludHNbcF0sIHBvaW50c1tpXSwgcG9pbnRzW3FdKSA9PT0gMikge1xyXG4gICAgICAgICAgICAgICAgcSA9IGk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcCA9IHE7XHJcbiAgICB9IHdoaWxlIChwICE9PSBsKTtcclxuXHJcbiAgICByZXR1cm4gaHVsbDtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY29udmV4SHVsbDtcclxuXHJcbiIsImZ1bmN0aW9uIHJnYlRvSGV4KHJnYmEgOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSkge1xyXG4gICAgY29uc3QgaGV4UiA9IChyZ2JhWzBdICogMjU1KS50b1N0cmluZygxNikucGFkU3RhcnQoMiwgJzAnKTtcclxuICAgIGNvbnN0IGhleEcgPSAocmdiYVsxXSAqIDI1NSkudG9TdHJpbmcoMTYpLnBhZFN0YXJ0KDIsICcwJyk7XHJcbiAgICBjb25zdCBoZXhCID0gKHJnYmFbMl0gKiAyNTUpLnRvU3RyaW5nKDE2KS5wYWRTdGFydCgyLCAnMCcpO1xyXG5cclxuICAgIC8vIENvbmNhdGVuYXRlIHRoZSBoZXhhZGVjaW1hbCBjb21wb25lbnRzXHJcbiAgICBjb25zdCBoZXhDb2xvciA9IGAjJHtoZXhSfSR7aGV4R30ke2hleEJ9YDtcclxuXHJcbiAgICByZXR1cm4gaGV4Q29sb3I7XHJcbn1cclxuICBcclxuZnVuY3Rpb24gaGV4VG9SZ2IoaGV4OiBzdHJpbmcpOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSB7XHJcbiAgICBjb25zdCByID0gcGFyc2VJbnQoaGV4LnNsaWNlKDEsIDMpLCAxNik7XHJcbiAgICBjb25zdCBnID0gcGFyc2VJbnQoaGV4LnNsaWNlKDMsIDUpLCAxNik7XHJcbiAgICBjb25zdCBiID0gcGFyc2VJbnQoaGV4LnNsaWNlKDUsIDcpLCAxNik7XHJcbiAgXHJcbiAgICByZXR1cm4gW3IgLyAyNTUsIGcgLyAyNTUsIGIgLyAyNTUsIDFdO1xyXG59XHJcbiAgXHJcbmV4cG9ydCB7IHJnYlRvSGV4LCBoZXhUb1JnYiB9O1xyXG4gICIsImltcG9ydCBSZW5kZXJhYmxlIGZyb20gXCIuLzJELVNoYXBlcy9JbnRlcmZhY2VzL3JlbmRlcmFibGUuaW50ZXJmYWNlXCI7XHJcbmltcG9ydCBUcmFuc2Zvcm1hYmxlIGZyb20gXCIuLzJELVNoYXBlcy9JbnRlcmZhY2VzL3RyYW5zZm9ybWFibGUuaW50ZXJmYWNlXCI7XHJcbmltcG9ydCBTaGFwZSBmcm9tIFwiLi8yRC1TaGFwZXMvc2hhcGVcIjtcclxuaW1wb3J0IExpbmUgZnJvbSBcIi4vMkQtU2hhcGVzL2xpbmVcIjtcclxuaW1wb3J0IFNxdWFyZSBmcm9tIFwiLi8yRC1TaGFwZXMvc3F1YXJlXCI7XHJcbmltcG9ydCBSZWN0YW5nbGUgZnJvbSBcIi4vMkQtU2hhcGVzL3JlY3RhbmdsZVwiO1xyXG5pbXBvcnQgUG9pbnQgZnJvbSBcIi4vQmFzZS9wb2ludFwiO1xyXG5pbXBvcnQgUG9seWdvbiBmcm9tIFwiLi8yRC1TaGFwZXMvcG9seWdvblwiO1xyXG5pbXBvcnQgVHlwZSBmcm9tIFwiLi8yRC1TaGFwZXMvdHlwZS5lbnVtXCI7XHJcbmltcG9ydCB7IGNyZWF0ZVNoYWRlclByb2dyYW0gfSBmcm9tIFwiLi9GdW5jdGlvbnMvY3JlYXRlLXNoYWRlci1wcm9ncmFtXCI7XHJcbmltcG9ydCBQcm9ncmFtSW5mbyBmcm9tIFwiLi9GdW5jdGlvbnMvcHJvZ3JhbS1pbmZvLmludGVyZmFjZVwiO1xyXG5pbXBvcnQgeyBzZXRBdHRyaWJ1dGVzIH0gZnJvbSBcIi4vRnVuY3Rpb25zL3NldC1hdHRyaWJ1dGVzXCI7XHJcbmltcG9ydCB7IHNldHVwQ2FudmFzIH0gZnJvbSBcIi4vRnVuY3Rpb25zL3NldHVwLWNhbnZhc1wiO1xyXG5pbXBvcnQgVHJhbnNmb3JtYXRpb24gZnJvbSBcIi4vT3BlcmF0aW9ucy9UcmFuc2Zvcm1hdGlvblwiO1xyXG5pbXBvcnQgeyBoZXhUb1JnYiwgcmdiVG9IZXggfSBmcm9tIFwiLi9VdGlscy90b29sc1wiO1xyXG5pbXBvcnQgeyByZW5kZXIgfSBmcm9tIFwiLi9GdW5jdGlvbnMvcmVuZGVyXCI7XHJcbmltcG9ydCB7IHJlbmRlckFsbCB9IGZyb20gXCIuL0Z1bmN0aW9ucy9yZW5kZXItYWxsXCI7XHJcblxyXG5jb25zdCBjYW52YXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NhbnZhc1wiKSBhcyBIVE1MQ2FudmFzRWxlbWVudDtcclxuLy8gSW5pdGlhbGl6ZSB0aGUgR0wgY29udGV4dFxyXG5jb25zdCBnbCA9IGNhbnZhcy5nZXRDb250ZXh0KFwid2ViZ2xcIik7XHJcblxyXG4vLyBPbmx5IGNvbnRpbnVlIGlmIFdlYkdMIGlzIGF2YWlsYWJsZSBhbmQgd29ya2luZ1xyXG5pZiAoZ2wgPT09IG51bGwpIHtcclxuICBhbGVydChcclxuICAgIFwiVW5hYmxlIHRvIGluaXRpYWxpemUgV2ViR0wuIFlvdXIgYnJvd3NlciBvciBtYWNoaW5lIG1heSBub3Qgc3VwcG9ydCBpdC5cIlxyXG4gICk7XHJcbn1cclxuXHJcblxyXG4vLyBWZXJ0ZXggc2hhZGVyIHByb2dyYW1cclxuY29uc3QgdnNTb3VyY2UgPSBgXHJcbiAgICBhdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247XHJcbiAgICBhdHRyaWJ1dGUgdmVjNCBhVmVydGV4Q29sb3I7XHJcbiAgICB1bmlmb3JtIG1hdDMgdU1hdHJpeDtcclxuICAgIHZhcnlpbmcgdmVjNCB2Q29sb3I7XHJcblxyXG4gICAgdm9pZCBtYWluKCkge1xyXG4gICAgICAgIC8vIG5vdGU6IFkgYXhpcyBtdXN0IGJlIGludmVydGVkIHRvIHJlcGxpY2F0ZSB0cmFkaXRpb25hbCB2aWV3XHJcbiAgICAgICAgZ2xfUG9zaXRpb24gPSB2ZWM0KCh1TWF0cml4ICogdmVjMyhhVmVydGV4UG9zaXRpb24sIDEpKS54eSwgMCwgMSk7XHJcblxyXG4gICAgICAgIC8vIENoYW5nZSBjb2xvciBvZiBzaGFwZVxyXG4gICAgICAgIHZDb2xvciA9IGFWZXJ0ZXhDb2xvcjtcclxuICAgIH1cclxuYDtcclxuXHJcbmNvbnN0IGZzU291cmNlID0gYFxyXG4gICAgcHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XHJcbiAgICB2YXJ5aW5nIHZlYzQgdkNvbG9yO1xyXG5cclxuICAgIHZvaWQgbWFpbigpIHtcclxuICAgICAgICBnbF9GcmFnQ29sb3IgPSB2Q29sb3I7XHJcbiAgICB9XHJcbmA7XHJcbmNvbnN0IHNoYWRlclByb2dyYW0gPSBjcmVhdGVTaGFkZXJQcm9ncmFtKGdsLCB2c1NvdXJjZSwgZnNTb3VyY2UpO1xyXG5cclxuLy8gQ29sbGVjdCBhbGwgdGhlIGluZm8gbmVlZGVkIHRvIHVzZSB0aGUgc2hhZGVyIHByb2dyYW0uXHJcbi8vIExvb2sgdXAgd2hpY2ggYXR0cmlidXRlIG91ciBzaGFkZXIgcHJvZ3JhbSBpcyB1c2luZ1xyXG4vLyBmb3IgYVZlcnRleFBvc2l0aW9uIGFuZCBsb29rIHVwIHVuaWZvcm0gbG9jYXRpb25zLlxyXG5jb25zdCBwcm9ncmFtSW5mbyA9IHtcclxuICBwcm9ncmFtOiBzaGFkZXJQcm9ncmFtLFxyXG4gIGF0dHJpYkxvY2F0aW9uczoge1xyXG4gICAgdmVydGV4UG9zaXRpb246IGdsLmdldEF0dHJpYkxvY2F0aW9uKHNoYWRlclByb2dyYW0sIFwiYVZlcnRleFBvc2l0aW9uXCIpLFxyXG4gICAgdmVydGV4Q29sb3I6IGdsLmdldEF0dHJpYkxvY2F0aW9uKHNoYWRlclByb2dyYW0sIFwiYVZlcnRleENvbG9yXCIpLFxyXG4gIH0sXHJcbiAgdW5pZm9ybUxvY2F0aW9uczoge1xyXG4gICAgbWF0cml4TG9jYXRpb246IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihzaGFkZXJQcm9ncmFtLCBcInVNYXRyaXhcIiksXHJcbiAgfSxcclxufTtcclxuXHJcbi8vIFRlbGwgV2ViR0wgdG8gdXNlIG91ciBwcm9ncmFtIHdoZW4gZHJhd2luZ1xyXG5nbC51c2VQcm9ncmFtKHNoYWRlclByb2dyYW0pO1xyXG5cclxuY29uc3Qgd2lkdGggPSAoZ2wuY2FudmFzIGFzIEhUTUxDYW52YXNFbGVtZW50KS5jbGllbnRXaWR0aDtcclxuY29uc3QgaGVpZ2h0ID0gKGdsLmNhbnZhcyBhcyBIVE1MQ2FudmFzRWxlbWVudCkuY2xpZW50SGVpZ2h0O1xyXG5jYW52YXMud2lkdGggPSB3aWR0aDtcclxuY2FudmFzLmhlaWdodCA9IGhlaWdodDtcclxuLy8gU2V0IGNsZWFyIGNvbG9yIHRvIGJsYWNrLCBmdWxseSBvcGFxdWVcclxuZ2wuY2xlYXJDb2xvcigxLjAsIDEuMCwgMS4wLCAxLjApO1xyXG4vLyBDbGVhciB0aGUgY29sb3IgYnVmZmVyIHdpdGggc3BlY2lmaWVkIGNsZWFyIGNvbG9yXHJcblxyXG5cclxuZ2wudmlld3BvcnQoMCwgMCwgZ2wuY2FudmFzLndpZHRoLCBnbC5jYW52YXMuaGVpZ2h0KTsgLy8gc2V0cyB0aGUgdmlld3BvcnQgdG8gY292ZXIgdGhlIGVudGlyZSBjYW52YXMsIHN0YXJ0aW5nIGZyb20gdGhlIGxvd2VyLWxlZnQgY29ybmVyIGFuZCBleHRlbmRpbmcgdG8gdGhlIGNhbnZhcydzIHdpZHRoIGFuZCBoZWlnaHQuXHJcblxyXG4vLyBDbGVhciB0aGUgY2FudmFzIGJlZm9yZSB3ZSBzdGFydCBkcmF3aW5nIG9uIGl0LlxyXG5nbC5jbGVhcihnbC5DT0xPUl9CVUZGRVJfQklUKTtcclxuXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2FudmFzXCIpIGFzIEhUTUxDYW52YXNFbGVtZW50O1xyXG5sZXQgc2hhcGVzOiAoU2hhcGUgJiBSZW5kZXJhYmxlICYgVHJhbnNmb3JtYWJsZSlbXSA9IFtdO1xyXG5sZXQgdHlwZTogVHlwZTtcclxubGV0IGlzRHJhd2luZyA9IGZhbHNlO1xyXG5cclxuLyogU2V0dXAgVmlld3BvcnQgKi9cclxuXHJcbmNvbnN0IHBvc2l0aW9uQnVmZmVyID0gZ2wuY3JlYXRlQnVmZmVyKCk7XHJcbmNvbnN0IGNvbG9yQnVmZmVyID0gZ2wuY3JlYXRlQnVmZmVyKCk7XHJcbi8vIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBwb3NpdGlvbkJ1ZmZlcik7XHJcbi8vIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBjb2xvckJ1ZmZlcik7XHJcbi8vIHNldEF0dHJpYnV0ZXMoZ2wsIHBvc2l0aW9uQnVmZmVyLCBjb2xvckJ1ZmZlciwgcHJvZ3JhbUluZm8pO1xyXG5cclxubGV0IGN1cnJlbnRPYmplY3Q6IFNoYXBlICYgUmVuZGVyYWJsZSAmIFRyYW5zZm9ybWFibGU7XHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLyBGaXggSFRNTCBFbGVtZW50cyBFdmVudCBMaXN0ZW5lcnNcclxuXHJcbi8qIExpc3Qgb2YgU2hhcGVzIExpc3RlbmVyICovXHJcbmNvbnN0IGxpc3RPZlNoYXBlcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibGlzdC1vZi1zaGFwZXNcIikgYXMgSFRNTFNlbGVjdEVsZW1lbnQ7XHJcbmxpc3RPZlNoYXBlcy5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsICgpID0+IHtcclxuICByZW5kZXJBbGwoZ2wsIHByb2dyYW1JbmZvLCBzaGFwZXMsIHBvc2l0aW9uQnVmZmVyLCBjb2xvckJ1ZmZlcik7XHJcbiAgY29uc3QgaW5kZXg6IG51bWJlciA9ICtsaXN0T2ZTaGFwZXMuc2VsZWN0ZWRPcHRpb25zWzBdLnZhbHVlO1xyXG4gIGlzRHJhd2luZyA9IGZhbHNlO1xyXG5cclxuICBzZXR1cFNlbGVjdG9yKGdsLCBwcm9ncmFtSW5mbywgc2hhcGVzW2luZGV4XSk7XHJcbn0pO1xyXG5cclxuLyogQnV0dG9uIExpc3RlbmVyICovXHJcbmNvbnN0IGxpbmVCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxpbmUtYnRuXCIpO1xyXG5saW5lQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgcmVuZGVyQWxsKGdsLCBwcm9ncmFtSW5mbywgc2hhcGVzLCBwb3NpdGlvbkJ1ZmZlciwgY29sb3JCdWZmZXIpO1xyXG4gIHR5cGUgPSBUeXBlLkxpbmU7XHJcbiAgaXNEcmF3aW5nID0gZmFsc2U7XHJcbn0pO1xyXG5cclxuY29uc3Qgc3F1YXJlQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzcXVhcmUtYnRuXCIpO1xyXG5zcXVhcmVCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICByZW5kZXJBbGwoZ2wsIHByb2dyYW1JbmZvLCBzaGFwZXMsIHBvc2l0aW9uQnVmZmVyLCBjb2xvckJ1ZmZlcik7XHJcbiAgdHlwZSA9IFR5cGUuU3F1YXJlO1xyXG4gIGlzRHJhd2luZyA9IGZhbHNlO1xyXG59KTtcclxuXHJcbmNvbnN0IHJlY3RhbmdsZUJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVjdGFuZ2xlLWJ0blwiKTtcclxucmVjdGFuZ2xlQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgcmVuZGVyQWxsKGdsLCBwcm9ncmFtSW5mbywgc2hhcGVzLCBwb3NpdGlvbkJ1ZmZlciwgY29sb3JCdWZmZXIpO1xyXG4gIHR5cGUgPSBUeXBlLlJlY3RhbmdsZTtcclxuICBpc0RyYXdpbmcgPSBmYWxzZTtcclxufSk7XHJcblxyXG5jb25zdCBwb2x5Z29uQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwb2x5Z29uLWJ0blwiKTtcclxucG9seWdvbkJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gIHJlbmRlckFsbChnbCwgcHJvZ3JhbUluZm8sIHNoYXBlcywgcG9zaXRpb25CdWZmZXIsIGNvbG9yQnVmZmVyKTtcclxuICB0eXBlID0gVHlwZS5Qb2x5Z29uO1xyXG4gIGlzRHJhd2luZyA9IGZhbHNlO1xyXG4gIC8vIGlzRmlyc3REcmF3aW5nID0gdHJ1ZTtcclxufSk7XHJcblxyXG5jb25zdCBzYXZlQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzYXZlLWJ0blwiKTtcclxuc2F2ZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gIHJlbmRlckFsbChnbCwgcHJvZ3JhbUluZm8sIHNoYXBlcywgcG9zaXRpb25CdWZmZXIsIGNvbG9yQnVmZmVyKTtcclxuICBjb25zdCB0ZXh0ID0gc3RvcmVTaGFwZXMoc2hhcGVzKTtcclxuICBoYW5kbGVEb3dubG9hZCh0ZXh0KTtcclxufSk7XHJcblxyXG5jb25zdCB1cGxvYWRCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInVwbG9hZC1idG5cIik7XHJcbnVwbG9hZEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gIGhhbmRsZVVwbG9hZCgodGV4dCkgPT4ge1xyXG4gICAgc2hhcGVzID0gbG9hZFNoYXBlKHRleHQpO1xyXG5cclxuICAgIGZvciAoY29uc3Qgc2hhcGUgb2Ygc2hhcGVzKSB7XHJcbiAgICAgIHNldHVwT3B0aW9uKHRydWUsIHNoYXBlKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXJBbGwoZ2wsIHByb2dyYW1JbmZvLCBzaGFwZXMsIHBvc2l0aW9uQnVmZmVyLCBjb2xvckJ1ZmZlcik7XHJcbiAgfSk7XHJcbn0pO1xyXG5cclxuLyogQ2FudmFzIExpc3RlbmVyICovXHJcbmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIChldmVudCkgPT4ge1xyXG4gIGNvbnN0IHggPSBldmVudC5jbGllbnRYO1xyXG4gIGNvbnN0IHkgPSBldmVudC5jbGllbnRZO1xyXG4gIGNvbnN0IHBvaW50ID0gbmV3IFBvaW50KFt4LCB5XSk7XHJcblxyXG4gIGlmIChpc0RyYXdpbmcpIHtcclxuICAgIGlmIChjdXJyZW50T2JqZWN0LnR5cGUgIT09IFR5cGUuUG9seWdvbikge1xyXG4gICAgICBjdXJyZW50T2JqZWN0LmRyYXcocG9pbnQpO1xyXG4gICAgICBzZXR1cE9wdGlvbih0cnVlLCBjdXJyZW50T2JqZWN0KTtcclxuICAgICAgc2hhcGVzLnB1c2goY3VycmVudE9iamVjdCk7XHJcbiAgICAgIGlzRHJhd2luZyA9IGZhbHNlO1xyXG4gICAgICBjdXJyZW50T2JqZWN0ID0gbnVsbDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmIChjdXJyZW50T2JqZWN0LmlkID09IHNoYXBlcy5sZW5ndGgpIHtcclxuICAgICAgICBjdXJyZW50T2JqZWN0LmRyYXcocG9pbnQpO1xyXG4gICAgICAgIC8vIGJlbHVtIGRpcHVzaCBrZSBzaGFwZXNcclxuICAgICAgICBpZiAoY3VycmVudE9iamVjdC5hcnJheU9mUG9pbnRzLmxlbmd0aCA+PTMpIHtcclxuICAgICAgICAgIHNldHVwT3B0aW9uKHRydWUsIGN1cnJlbnRPYmplY3QpO1xyXG4gICAgICAgICAgLy8gcmVuZGVyKGdsLCBwcm9ncmFtSW5mbywgY3VycmVudE9iamVjdCwgcG9zaXRpb25CdWZmZXIsIGNvbG9yQnVmZmVyKTtcclxuICAgICAgICAgIHNoYXBlcy5wdXNoKGN1cnJlbnRPYmplY3QpO1xyXG4gICAgICAgICAgcmVuZGVyQWxsKGdsLCBwcm9ncmFtSW5mbywgc2hhcGVzLCBwb3NpdGlvbkJ1ZmZlciwgY29sb3JCdWZmZXIpO1xyXG4gICAgICAgICAgaXNEcmF3aW5nID0gZmFsc2U7XHJcbiAgICAgICAgICBjdXJyZW50T2JqZWN0ID0gbnVsbDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmVuZGVyQWxsKGdsLCBwcm9ncmFtSW5mbywgc2hhcGVzLCBwb3NpdGlvbkJ1ZmZlciwgY29sb3JCdWZmZXIpO1xyXG4gICAgICAgICAgcmVuZGVyKGdsLCBwcm9ncmFtSW5mbywgY3VycmVudE9iamVjdCwgcG9zaXRpb25CdWZmZXIsIGNvbG9yQnVmZmVyKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc3QgbWF0cml4ID0gVHJhbnNmb3JtYXRpb24uaW52ZXJzZVRyYW5zZm9ybWF0aW9uTWF0cml4KFxyXG4gICAgICAgICAgZ2wuY2FudmFzLndpZHRoLFxyXG4gICAgICAgICAgZ2wuY2FudmFzLmhlaWdodCxcclxuICAgICAgICAgIGN1cnJlbnRPYmplY3QudHgsXHJcbiAgICAgICAgICBjdXJyZW50T2JqZWN0LnR5LFxyXG4gICAgICAgICAgY3VycmVudE9iamVjdC5kZWdyZWUsXHJcbiAgICAgICAgICBjdXJyZW50T2JqZWN0LnN4LFxyXG4gICAgICAgICAgY3VycmVudE9iamVjdC5zeSxcclxuICAgICAgICAgIGN1cnJlbnRPYmplY3Qua3gsXHJcbiAgICAgICAgICBjdXJyZW50T2JqZWN0Lmt5LFxyXG4gICAgICAgICAgY3VycmVudE9iamVjdC5jZW50ZXJcclxuICAgICAgICApO1xyXG4gICAgICAgIGNvbnN0IHBvaW50MiA9IG1hdHJpeC5tdWx0aXBseVBvaW50KHBvaW50KTtcclxuICAgICAgICBjdXJyZW50T2JqZWN0LmRyYXcocG9pbnQyKTtcclxuICAgICAgICBzZXR1cE9wdGlvbihmYWxzZSwgY3VycmVudE9iamVjdCk7XHJcbiAgICAgICAgLy8gcmVuZGVyKGdsLCBwcm9ncmFtSW5mbywgY3VycmVudE9iamVjdCwgcG9zaXRpb25CdWZmZXIsIGNvbG9yQnVmZmVyKTtcclxuICAgICAgICByZW5kZXJBbGwoZ2wsIHByb2dyYW1JbmZvLCBzaGFwZXMsIHBvc2l0aW9uQnVmZmVyLCBjb2xvckJ1ZmZlcik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9IGVsc2Uge1xyXG4gICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgIGNhc2UgVHlwZS5MaW5lOlxyXG4gICAgICAgIGN1cnJlbnRPYmplY3QgPSBuZXcgTGluZShzaGFwZXMubGVuZ3RoLCBwb2ludCk7XHJcbiAgICAgICAgaXNEcmF3aW5nID0gdHJ1ZTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBUeXBlLlNxdWFyZTpcclxuICAgICAgICBjdXJyZW50T2JqZWN0ID0gbmV3IFNxdWFyZShzaGFwZXMubGVuZ3RoLCBwb2ludCk7XHJcbiAgICAgICAgaXNEcmF3aW5nID0gdHJ1ZTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBUeXBlLlJlY3RhbmdsZTpcclxuICAgICAgICBjdXJyZW50T2JqZWN0ID0gbmV3IFJlY3RhbmdsZShzaGFwZXMubGVuZ3RoLCBwb2ludCk7XHJcbiAgICAgICAgaXNEcmF3aW5nID0gdHJ1ZTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBUeXBlLlBvbHlnb246XHJcbiAgICAgICAgY3VycmVudE9iamVjdCA9IG5ldyBQb2x5Z29uKHNoYXBlcy5sZW5ndGgsIHBvaW50KTtcclxuICAgICAgICBpc0RyYXdpbmcgPSB0cnVlO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH1cclxufSk7XHJcblxyXG5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCAoZXZlbnQpID0+IHtcclxuICBpZiAoaXNEcmF3aW5nICYmIGN1cnJlbnRPYmplY3QudHlwZSAhPT0gVHlwZS5Qb2x5Z29uKSB7XHJcbiAgICBjb25zdCB4ID0gZXZlbnQuY2xpZW50WDtcclxuICAgIGNvbnN0IHkgPSBldmVudC5jbGllbnRZO1xyXG4gICAgY29uc3QgcG9pbnQgPSBuZXcgUG9pbnQoW3gsIHldKTtcclxuICAgIGN1cnJlbnRPYmplY3QuZHJhdyhwb2ludCk7XHJcbiAgICByZW5kZXJBbGwoZ2wsIHByb2dyYW1JbmZvLCBzaGFwZXMsIHBvc2l0aW9uQnVmZmVyLCBjb2xvckJ1ZmZlcik7XHJcbiAgICByZW5kZXIoZ2wsIHByb2dyYW1JbmZvLCBjdXJyZW50T2JqZWN0LCBwb3NpdGlvbkJ1ZmZlciwgY29sb3JCdWZmZXIpO1xyXG4gIH1cclxufSk7XHJcblxyXG5mdW5jdGlvbiBzZXR1cE9wdGlvbihcclxuICBpc0ZpcnN0RHJhd2luZzogYm9vbGVhbixcclxuICBlbGVtZW50OiBSZW5kZXJhYmxlICYgVHJhbnNmb3JtYWJsZSAmIFNoYXBlXHJcbik6IHZvaWQge1xyXG4gIGNvbnN0IG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XHJcbiAgb3B0aW9uLnZhbHVlID0gZWxlbWVudC5pZC50b1N0cmluZygpO1xyXG4gIGxldCBvcHRpb25UZXh0OiBzdHJpbmc7XHJcbiAgc3dpdGNoIChlbGVtZW50LnR5cGUpIHtcclxuICAgIGNhc2UgVHlwZS5MaW5lOlxyXG4gICAgICBvcHRpb25UZXh0ID0gYExpbmVfJHtlbGVtZW50LmlkfWA7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBUeXBlLlNxdWFyZTpcclxuICAgICAgb3B0aW9uVGV4dCA9IGBTcXVhcmVfJHtlbGVtZW50LmlkfWA7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBUeXBlLlJlY3RhbmdsZTpcclxuICAgICAgb3B0aW9uVGV4dCA9IGBSZWN0YW5nbGVfJHtlbGVtZW50LmlkfWA7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBUeXBlLlBvbHlnb246XHJcbiAgICAgIG9wdGlvblRleHQgPSBgUG9seWdvbl8ke2VsZW1lbnQuaWR9YDtcclxuICAgICAgYnJlYWs7XHJcbiAgfVxyXG4gIG9wdGlvbi50ZXh0ID0gb3B0aW9uVGV4dDtcclxuXHJcbiAgaWYgKGlzRmlyc3REcmF3aW5nKSB7XHJcbiAgICBjb25zdCBsaXN0T2ZTaGFwZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgXCJsaXN0LW9mLXNoYXBlc1wiXHJcbiAgICApIGFzIEhUTUxTZWxlY3RFbGVtZW50O1xyXG4gICAgbGlzdE9mU2hhcGVzLmFwcGVuZENoaWxkKG9wdGlvbik7XHJcbiAgICBsaXN0T2ZTaGFwZXMudmFsdWUgPSBlbGVtZW50LmlkLnRvU3RyaW5nKCk7XHJcbiAgfVxyXG5cclxuICBzZXR1cFNlbGVjdG9yKGdsLCBwcm9ncmFtSW5mbywgZWxlbWVudCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNldHVwU2VsZWN0b3IoXHJcbiAgZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCxcclxuICBwcm9ncmFtSW5mbzogUHJvZ3JhbUluZm8sXHJcbiAgZWxlbWVudDogUmVuZGVyYWJsZSAmIFRyYW5zZm9ybWFibGUgJiBTaGFwZVxyXG4pOiB2b2lkIHtcclxuICBjb25zdCBzbGlkZXJYX29yaWdpbmFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzbGlkZXJYXCIpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgY29uc3Qgc2xpZGVyWCA9IHNsaWRlclhfb3JpZ2luYWwuY2xvbmVOb2RlKHRydWUpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgc2xpZGVyWF9vcmlnaW5hbC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChzbGlkZXJYLCBzbGlkZXJYX29yaWdpbmFsKTtcclxuICBzbGlkZXJYLm1pbiA9IFwiLTYwMFwiO1xyXG4gIHNsaWRlclgubWF4ID0gXCI2MDBcIjtcclxuICBzbGlkZXJYLnZhbHVlID0gZWxlbWVudC50eC50b1N0cmluZygpO1xyXG4gIHNsaWRlclguc3RlcCA9IFwiMTBcIjtcclxuXHJcbiAgc2xpZGVyWC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgKGV2ZW50KSA9PiB7XHJcbiAgICBjb25zdCBkZWx0YVggPSAoZXZlbnQudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlO1xyXG4gICAgZWxlbWVudC50eCA9IE51bWJlcihkZWx0YVgpO1xyXG4gICAgcmVuZGVyQWxsKGdsLCBwcm9ncmFtSW5mbywgc2hhcGVzLCBwb3NpdGlvbkJ1ZmZlciwgY29sb3JCdWZmZXIpO1xyXG4gIH0pOyAgIFxyXG5cclxuICBjb25zdCBzbGlkZXJZX29yaWdpbmFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzbGlkZXJZXCIpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgY29uc3Qgc2xpZGVyWSA9IHNsaWRlcllfb3JpZ2luYWwuY2xvbmVOb2RlKHRydWUpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgc2xpZGVyWV9vcmlnaW5hbC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChzbGlkZXJZLCBzbGlkZXJZX29yaWdpbmFsKTtcclxuICBzbGlkZXJZLm1pbiA9IFwiLTYwMFwiO1xyXG4gIHNsaWRlclkubWF4ID0gXCI2MDBcIjtcclxuICBzbGlkZXJZLnZhbHVlID0gKC1lbGVtZW50LnR5KS50b1N0cmluZygpO1xyXG4gIHNsaWRlclkuc3RlcCA9IFwiMTBcIjtcclxuICBzbGlkZXJZLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCAoZXZlbnQpID0+IHtcclxuICAgIGNvbnN0IGRlbHRhWSA9IChldmVudC50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWU7XHJcbiAgICBlbGVtZW50LnR5ID0gLU51bWJlcihkZWx0YVkpO1xyXG4gICAgcmVuZGVyQWxsKGdsLCBwcm9ncmFtSW5mbywgc2hhcGVzLCBwb3NpdGlvbkJ1ZmZlciwgY29sb3JCdWZmZXIpO1xyXG4gIH0pO1xyXG5cclxuICBjb25zdCBzbGlkZXJMZW5ndGhfb3JpZ2luYWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgIFwic2xpZGVyTGVuZ3RoXCJcclxuICApIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgY29uc3Qgc2xpZGVyTGVuZ3RoID0gc2xpZGVyTGVuZ3RoX29yaWdpbmFsLmNsb25lTm9kZSh0cnVlKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gIHNsaWRlckxlbmd0aF9vcmlnaW5hbC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChzbGlkZXJMZW5ndGgsIHNsaWRlckxlbmd0aF9vcmlnaW5hbCk7XHJcbiAgc2xpZGVyTGVuZ3RoLm1pbiA9IFwiMFwiO1xyXG4gIHNsaWRlckxlbmd0aC5tYXggPSBcIjYwMFwiO1xyXG4gIGxldCBsZW5ndGg6IG51bWJlcjtcclxuICBpZiAoZWxlbWVudC50eXBlID09PSBUeXBlLlBvbHlnb24pIHtcclxuICAgIGxldCBtaW4gPSBJbmZpbml0eTtcclxuICAgIGxldCBtYXggPSAtSW5maW5pdHk7XHJcblxyXG4gICAgZm9yIChjb25zdCBwIG9mIGVsZW1lbnQuYXJyYXlPZlBvaW50cykge1xyXG4gICAgICBjb25zdCBbcFhdID0gcC5nZXRQYWlyKCk7XHJcbiAgICAgIGlmIChwWCA8IG1pbikge1xyXG4gICAgICAgIG1pbiA9IHBYO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChwWCA+IG1heCkge1xyXG4gICAgICAgIG1heCA9IHBYO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBsZW5ndGggPSBtYXggLSBtaW47XHJcbiAgfSBlbHNlIHtcclxuICAgIGxlbmd0aCA9IE1hdGguc3FydChcclxuICAgICAgKGVsZW1lbnQuYXJyYXlPZlBvaW50c1swXS54IC0gZWxlbWVudC5hcnJheU9mUG9pbnRzWzFdLngpICoqIDIgK1xyXG4gICAgICAgIChlbGVtZW50LmFycmF5T2ZQb2ludHNbMF0ueSAtIGVsZW1lbnQuYXJyYXlPZlBvaW50c1sxXS55KSAqKiAyXHJcbiAgICApO1xyXG4gIH1cclxuICBzbGlkZXJMZW5ndGgudmFsdWUgPSAoKGVsZW1lbnQuc3ggLSAxKSAqIGxlbmd0aCkudG9TdHJpbmcoKTtcclxuICBzbGlkZXJMZW5ndGguYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIChldmVudCkgPT4ge1xyXG4gICAgY29uc3QgZGVsdGFMZW5ndGggPSAoZXZlbnQudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlO1xyXG4gICAgZWxlbWVudC5zeCA9IDEgKyBOdW1iZXIoZGVsdGFMZW5ndGgpIC8gbGVuZ3RoO1xyXG4gICAgaWYgKGVsZW1lbnQudHlwZSA9PSBUeXBlLlNxdWFyZSl7XHJcbiAgICAgIGVsZW1lbnQuc3kgPSAxICsgTnVtYmVyKGRlbHRhTGVuZ3RoKSAvIGxlbmd0aDtcclxuICAgIH1cclxuICAgIHJlbmRlckFsbChnbCwgcHJvZ3JhbUluZm8sIHNoYXBlcywgcG9zaXRpb25CdWZmZXIsIGNvbG9yQnVmZmVyKTtcclxuICB9KTtcclxuXHJcbiAgY29uc3Qgc2xpZGVyV2lkdGhfb3JpZ2luYWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgIFwic2xpZGVyV2lkdGhcIlxyXG4gICkgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICBjb25zdCBzbGlkZXJXaWR0aCA9IHNsaWRlcldpZHRoX29yaWdpbmFsLmNsb25lTm9kZSh0cnVlKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gIHNsaWRlcldpZHRoX29yaWdpbmFsLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHNsaWRlcldpZHRoLCBzbGlkZXJXaWR0aF9vcmlnaW5hbCk7XHJcbiAgaWYoZWxlbWVudC50eXBlID09IFR5cGUuTGluZSB8fCBlbGVtZW50LnR5cGUgPT0gVHlwZS5TcXVhcmUpIHtcclxuICAgIHNsaWRlcldpZHRoLmRpc2FibGVkID0gdHJ1ZTtcclxuICB9XHJcbiAgc2xpZGVyV2lkdGgubWluID0gXCIwXCI7XHJcbiAgc2xpZGVyV2lkdGgubWF4ID0gXCI2MDBcIjtcclxuICBsZXQgd2lkdGg6IG51bWJlcjtcclxuXHJcbiAgaWYgKGVsZW1lbnQudHlwZSA9PSBUeXBlLlJlY3RhbmdsZSB8fCBlbGVtZW50LnR5cGUgPT0gVHlwZS5TcXVhcmUpIHtcclxuICAgIHdpZHRoID0gTWF0aC5zcXJ0KFxyXG4gICAgICAoZWxlbWVudC5hcnJheU9mUG9pbnRzWzBdLnggLSBlbGVtZW50LmFycmF5T2ZQb2ludHNbM10ueCkgKiogMiArXHJcbiAgICAgICAgKGVsZW1lbnQuYXJyYXlPZlBvaW50c1swXS55IC0gZWxlbWVudC5hcnJheU9mUG9pbnRzWzNdLnkpICoqIDJcclxuICAgICk7XHJcbiAgfSBlbHNlIGlmIChlbGVtZW50LnR5cGUgPT0gVHlwZS5Qb2x5Z29uKSB7XHJcbiAgICBsZXQgbWluID0gSW5maW5pdHk7XHJcbiAgICBsZXQgbWF4ID0gLUluZmluaXR5O1xyXG5cclxuICAgIGZvciAoY29uc3QgcCBvZiBlbGVtZW50LmFycmF5T2ZQb2ludHMpIHtcclxuICAgICAgY29uc3QgWywgcFldID0gcC5nZXRQYWlyKCk7XHJcbiAgICAgIGlmIChwWSA8IG1pbikge1xyXG4gICAgICAgIG1pbiA9IHBZO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChwWSA+IG1heCkge1xyXG4gICAgICAgIG1heCA9IHBZO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBsZW5ndGggPSBtYXggLSBtaW47XHJcbiAgfSBcclxuICBzbGlkZXJXaWR0aC52YWx1ZSA9ICgoZWxlbWVudC5zeSAtIDEpICogd2lkdGgpLnRvU3RyaW5nKCk7XHJcbiAgc2xpZGVyV2lkdGguYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIChldmVudCkgPT4ge1xyXG4gICAgY29uc3QgZGVsdGFXaWR0aCA9IChldmVudC50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWU7XHJcbiAgICBlbGVtZW50LnN5ID0gMSArIE51bWJlcihkZWx0YVdpZHRoKSAvIHdpZHRoO1xyXG4gICAgcmVuZGVyQWxsKGdsLCBwcm9ncmFtSW5mbywgc2hhcGVzLCBwb3NpdGlvbkJ1ZmZlciwgY29sb3JCdWZmZXIpO1xyXG4gIH0pO1xyXG5cclxuICBjb25zdCBzbGlkZXJSb3RhdGlvbl9vcmlnaW5hbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgXCJzbGlkZXJSb3RhdGlvblwiXHJcbiAgKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gIGNvbnN0IHNsaWRlclJvdGF0aW9uX3ZhbHVlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICBcInNsaWRlci1yb3RhdGlvbi12YWx1ZVwiXHJcbiAgKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gIGNvbnN0IHNsaWRlclJvdGF0aW9uID0gc2xpZGVyUm90YXRpb25fb3JpZ2luYWwuY2xvbmVOb2RlKHRydWUpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgc2xpZGVyUm90YXRpb25fb3JpZ2luYWwucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQoc2xpZGVyUm90YXRpb24sIHNsaWRlclJvdGF0aW9uX29yaWdpbmFsKTtcclxuICBzbGlkZXJSb3RhdGlvbi5taW4gPSBcIjBcIjtcclxuICBzbGlkZXJSb3RhdGlvbi5tYXggPSBcIjM2MFwiO1xyXG4gIHNsaWRlclJvdGF0aW9uLnZhbHVlID0gKCgxODAgKiBlbGVtZW50LmRlZ3JlZSkgLyBNYXRoLlBJKS50b1N0cmluZygpO1xyXG4gIHNsaWRlclJvdGF0aW9uX3ZhbHVlLnRleHRDb250ZW50ID0gKCgxODAgKiBlbGVtZW50LmRlZ3JlZSkgLyBNYXRoLlBJKS50b0ZpeGVkKDApLnRvU3RyaW5nKCk7IFxyXG4gIHNsaWRlclJvdGF0aW9uLnN0ZXAgPSBcIjEwXCI7XHJcbiAgc2xpZGVyUm90YXRpb24uYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIChldmVudCkgPT4ge1xyXG4gICAgY29uc3QgZGVsdGFEZWdyZWUgPSAoZXZlbnQudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlO1xyXG4gICAgZWxlbWVudC5kZWdyZWUgPSAoTnVtYmVyKGRlbHRhRGVncmVlKSAvIDE4MCkgKiBNYXRoLlBJO1xyXG4gICAgc2xpZGVyUm90YXRpb25fdmFsdWUudGV4dENvbnRlbnQgPSAoKDE4MCAqIGVsZW1lbnQuZGVncmVlKSAvIE1hdGguUEkpLnRvRml4ZWQoMCkudG9TdHJpbmcoKTsgXHJcbiAgICByZW5kZXJBbGwoZ2wsIHByb2dyYW1JbmZvLCBzaGFwZXMsIHBvc2l0aW9uQnVmZmVyLCBjb2xvckJ1ZmZlcik7XHJcbiAgfSk7XHJcblxyXG4gIGNvbnN0IHNsaWRlclNoZWFyWF9vcmlnaW5hbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgXCJzbGlkZXJTaGVhclhcIlxyXG4gICkgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICBjb25zdCBzbGlkZXJTaGVhclggPSBzbGlkZXJTaGVhclhfb3JpZ2luYWwuY2xvbmVOb2RlKHRydWUpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgc2xpZGVyU2hlYXJYX29yaWdpbmFsLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHNsaWRlclNoZWFyWCwgc2xpZGVyU2hlYXJYX29yaWdpbmFsKTtcclxuICBzbGlkZXJTaGVhclgubWluID0gXCIwXCI7XHJcbiAgc2xpZGVyU2hlYXJYLm1heCA9IFwiMTBcIjtcclxuICBzbGlkZXJTaGVhclgudmFsdWUgPSBlbGVtZW50Lmt4LnRvU3RyaW5nKCk7XHJcbiAgc2xpZGVyU2hlYXJYLnN0ZXAgPSBcIjAuMVwiO1xyXG5cclxuICBzbGlkZXJTaGVhclguYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIChldmVudCkgPT4ge1xyXG4gICAgY29uc3QgZGVsdGFTaGVhclggPSAoZXZlbnQudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlO1xyXG4gICAgZWxlbWVudC5reCA9IE51bWJlcihkZWx0YVNoZWFyWCk7XHJcbiAgICByZW5kZXJBbGwoZ2wsIHByb2dyYW1JbmZvLCBzaGFwZXMsIHBvc2l0aW9uQnVmZmVyLCBjb2xvckJ1ZmZlcik7XHJcbiAgfSk7XHJcblxyXG4gIGNvbnN0IHNsaWRlclNoZWFyWV9vcmlnaW5hbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgXCJzbGlkZXJTaGVhcllcIlxyXG4gICkgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICBjb25zdCBzbGlkZXJTaGVhclkgPSBzbGlkZXJTaGVhcllfb3JpZ2luYWwuY2xvbmVOb2RlKHRydWUpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgc2xpZGVyU2hlYXJZX29yaWdpbmFsLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHNsaWRlclNoZWFyWSwgc2xpZGVyU2hlYXJZX29yaWdpbmFsKTtcclxuICBzbGlkZXJTaGVhclkubWluID0gXCIwXCI7XHJcbiAgc2xpZGVyU2hlYXJZLm1heCA9IFwiMTBcIjtcclxuICBzbGlkZXJTaGVhclkudmFsdWUgPSBlbGVtZW50Lmt5LnRvU3RyaW5nKCk7XHJcbiAgc2xpZGVyU2hlYXJZLnN0ZXAgPSBcIjAuMVwiO1xyXG5cclxuICBzbGlkZXJTaGVhclkuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIChldmVudCkgPT4ge1xyXG4gICAgY29uc3QgZGVsdGFTaGVhclkgPSAoZXZlbnQudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlO1xyXG4gICAgZWxlbWVudC5reSA9IE51bWJlcihkZWx0YVNoZWFyWSk7XHJcbiAgICByZW5kZXJBbGwoZ2wsIHByb2dyYW1JbmZvLCBzaGFwZXMsIHBvc2l0aW9uQnVmZmVyLCBjb2xvckJ1ZmZlcik7XHJcbiAgfSk7XHJcblxyXG4gIGNvbnN0IHBvaW50UGlja2VyX29yaWdpbmFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICBcInBvaW50UGlja2VyXCJcclxuICApIGFzIEhUTUxTZWxlY3RFbGVtZW50O1xyXG4gIGNvbnN0IHBvaW50UGlja2VyID0gcG9pbnRQaWNrZXJfb3JpZ2luYWwuY2xvbmVOb2RlKHRydWUpIGFzIEhUTUxTZWxlY3RFbGVtZW50OyBcclxuICBwb2ludFBpY2tlcl9vcmlnaW5hbC5wYXJlbnRFbGVtZW50LnJlcGxhY2VDaGlsZChwb2ludFBpY2tlciwgcG9pbnRQaWNrZXJfb3JpZ2luYWwpO1xyXG4gIHBvaW50UGlja2VyLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgcG9pbnRQaWNrZXIuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoKSA9PiB7XHJcbiAgICBjb25zdCBwb2ludEluZGV4OiBudW1iZXIgPSBOdW1iZXIocG9pbnRQaWNrZXIudmFsdWUpO1xyXG4gICAgc2V0dXBDb2xvclBpY2tlcihnbCwgcHJvZ3JhbUluZm8sIHBvaW50SW5kZXgsIGVsZW1lbnQpO1xyXG4gIH0pO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZWxlbWVudC5hcnJheU9mUG9pbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBjb25zdCBuZXdQb2ludCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XHJcbiAgICBuZXdQb2ludC52YWx1ZSA9IGkudG9TdHJpbmcoKTtcclxuICAgIG5ld1BvaW50LnRleHQgPSBcInBvaW50X1wiICsgaTtcclxuICAgIHBvaW50UGlja2VyLmFwcGVuZENoaWxkKG5ld1BvaW50KTtcclxuICB9XHJcblxyXG4gIC8vIElmIHRoZSBjdXJyZW50T2JqZWN0IGlzIG5vdCBvZiB0eXBlIFBvbHlnb24sIHJlbW92ZSB0aGUgYnV0dG9uXHJcbiAgY29uc3QgYWRkUG9pbnRCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ0bi1hZGQtcG9pbnRcIik7XHJcbiAgaWYgKGFkZFBvaW50QnV0dG9uKSB7XHJcbiAgICBhZGRQb2ludEJ1dHRvbi5yZW1vdmUoKTtcclxuICB9XHJcblxyXG4gIGlmIChlbGVtZW50IGluc3RhbmNlb2YgUG9seWdvbikge1xyXG4gICAgY29uc3QgYWRkUG9pbnRCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xyXG4gICAgYWRkUG9pbnRCdXR0b24udGV4dENvbnRlbnQgPSBcIkFkZCBOZXcgUG9pbnRcIjtcclxuICAgIGFkZFBvaW50QnV0dG9uLmNsYXNzTmFtZSA9IFwiYnRuIGJ0bi1wcmltYXJ5IGFkZC1idG5cIjtcclxuICAgIGFkZFBvaW50QnV0dG9uLmlkID0gXCJidG4tYWRkLXBvaW50XCI7XHJcbiAgICBhZGRQb2ludEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gICAgICAvLyBTZXQgYSBmbGFnIHRvIGluZGljYXRlIHRoYXQgYSBuZXcgcG9pbnQgaXMgYmVpbmcgYWRkZWRcclxuICAgICAgaXNEcmF3aW5nID0gdHJ1ZTtcclxuICAgICAgY3VycmVudE9iamVjdCA9IHNoYXBlc1tlbGVtZW50LmlkXVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gQXBwZW5kIHRoZSBidXR0b24gdG8gdGhlIERPTVxyXG4gICAgY29uc3QgcG9seWdvbkJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucG9seWdvbi1idG4tc2VjdGlvblwiKTtcclxuICAgIGlmIChwb2x5Z29uQnRuKSB7XHJcbiAgICAgIHBvbHlnb25CdG4uYXBwZW5kQ2hpbGQoYWRkUG9pbnRCdXR0b24pO1xyXG4gICAgfVxyXG4gIH0gXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNldHVwQ29sb3JQaWNrZXIoXHJcbiAgZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCxcclxuICBwcm9ncmFtSW5mbzogUHJvZ3JhbUluZm8sXHJcbiAgcG9pbnRJbmRleDogbnVtYmVyLFxyXG4gIGVsZW1lbnQ6IFJlbmRlcmFibGUgJiBUcmFuc2Zvcm1hYmxlICYgU2hhcGVcclxuKSB7XHJcbiAgY29uc3QgY29sb3JQaWNrZXJfb3JpZ2luYWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgIFwiY29sb3JQaWNrZXJcIlxyXG4gICkgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICBjb25zdCBjb2xvclBpY2tlciA9IGNvbG9yUGlja2VyX29yaWdpbmFsLmNsb25lTm9kZSh0cnVlKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gIGNvbnN0IGNvbG9yID0gcmdiVG9IZXgoZWxlbWVudC5hcnJheU9mUG9pbnRzW3BvaW50SW5kZXhdLmdldENvbG9yKCkpO1xyXG4gIGNvbG9yUGlja2VyLnZhbHVlID0gY29sb3I7IFxyXG4gIGNvbG9yUGlja2VyX29yaWdpbmFsLnBhcmVudEVsZW1lbnQucmVwbGFjZUNoaWxkKGNvbG9yUGlja2VyLCBjb2xvclBpY2tlcl9vcmlnaW5hbCk7XHJcblxyXG4gIGNvbG9yUGlja2VyLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKGV2ZW50KSA9PiB7XHJcbiAgICBjb25zdCBoZXggPSAoZXZlbnQudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlO1xyXG4gICAgZWxlbWVudC5hcnJheU9mUG9pbnRzW3BvaW50SW5kZXhdLnNldENvbG9yKGhleFRvUmdiKGhleCkpO1xyXG4gICAgcmVuZGVyQWxsKGdsLCBwcm9ncmFtSW5mbywgc2hhcGVzLCBwb3NpdGlvbkJ1ZmZlciwgY29sb3JCdWZmZXIpO1xyXG4gIH0pO1xyXG5cclxuICBjb25zdCBkZWxldGVQb2ludEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnRuLWRlbGV0ZS1wb2ludFwiKTtcclxuICBpZiAoZGVsZXRlUG9pbnRCdXR0b24pIHtcclxuICAgIGRlbGV0ZVBvaW50QnV0dG9uLnJlbW92ZSgpO1xyXG4gIH1cclxuICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIFBvbHlnb24pIHtcclxuICAgIGNvbnN0IGRlbGV0ZVBvaW50QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcclxuICAgIGRlbGV0ZVBvaW50QnV0dG9uLnRleHRDb250ZW50ID0gXCJEZWxldGUgUG9pbnRcIjtcclxuICAgIGRlbGV0ZVBvaW50QnV0dG9uLmNsYXNzTmFtZSA9IFwiYnRuIGJ0bi1wcmltYXJ5IGRlbGV0ZS1idG5cIjtcclxuICAgIGRlbGV0ZVBvaW50QnV0dG9uLmlkID0gXCJidG4tZGVsZXRlLXBvaW50XCI7XHJcbiAgICBkZWxldGVQb2ludEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gICAgICBlbGVtZW50LmRlbGV0ZVBvaW50KHBvaW50SW5kZXgpO1xyXG4gICAgICByZW5kZXJBbGwoZ2wsIHByb2dyYW1JbmZvLCBzaGFwZXMsIHBvc2l0aW9uQnVmZmVyLCBjb2xvckJ1ZmZlcik7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBwb2x5Z29uQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wb2x5Z29uLWJ0bi1zZWN0aW9uXCIpO1xyXG4gICAgaWYgKHBvbHlnb25CdG4pIHtcclxuICAgICAgcG9seWdvbkJ0bi5hcHBlbmRDaGlsZChkZWxldGVQb2ludEJ1dHRvbik7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG4vLyBsb2Fkc2hhcGUgZnJvbSBqc29uIHRvIGFycmF5IG9mIHNoYXBlXHJcbmZ1bmN0aW9uIGxvYWRTaGFwZSh0ZXh0OiBzdHJpbmcpOiAoU2hhcGUgJiBSZW5kZXJhYmxlICYgVHJhbnNmb3JtYWJsZSlbXSB7XHJcbiAgY29uc3Qgc2hhcGU6IChTaGFwZSAmIFJlbmRlcmFibGUgJiBUcmFuc2Zvcm1hYmxlKVtdID0gW107XHJcbiAgY29uc3QgZGF0YSA9IEpTT04ucGFyc2UodGV4dCk7XHJcbiAgZm9yIChjb25zdCBpdGVtIG9mIGRhdGEpIHtcclxuICAgIGNvbnN0IHR4ID0gaXRlbS50eDtcclxuICAgIGNvbnN0IHR5ID0gaXRlbS50eTtcclxuICAgIGNvbnN0IGRlZ3JlZSA9IGl0ZW0uZGVncmVlO1xyXG4gICAgY29uc3Qgc3ggPSBpdGVtLnN4O1xyXG4gICAgY29uc3Qgc3kgPSBpdGVtLnN5O1xyXG4gICAgY29uc3Qga3ggPSBpdGVtLmt4O1xyXG4gICAgY29uc3Qga3kgPSBpdGVtLmt5O1xyXG4gICAgbGV0IGFycmF5T2ZQb2ludHM6IFBvaW50W10gPSBbXTtcclxuICAgIGZvciAoY29uc3QgcG9pbnQgb2YgaXRlbS5hcnJheU9mUG9pbnRzKSB7XHJcbiAgICAgIGxldCBwID0gbmV3IFBvaW50KFxyXG4gICAgICAgIFtwb2ludC54LCBwb2ludC55XSxcclxuICAgICAgICBbcG9pbnQuciwgcG9pbnQuZywgcG9pbnQuYiwgcG9pbnQuYV1cclxuICAgICAgKTtcclxuICAgICAgYXJyYXlPZlBvaW50cy5wdXNoKHApO1xyXG4gICAgfVxyXG4gICAgc3dpdGNoIChpdGVtLnR5cGUpIHtcclxuICAgICAgY2FzZSBUeXBlLkxpbmU6XHJcbiAgICAgICAgY29uc3QgbGluZSA9IG5ldyBMaW5lKGl0ZW0uaWQsIGFycmF5T2ZQb2ludHNbMF0pO1xyXG4gICAgICAgIGxpbmUuc2V0TGluZUF0dHJpYnV0ZXMoXHJcbiAgICAgICAgICB0eCxcclxuICAgICAgICAgIHR5LFxyXG4gICAgICAgICAgZGVncmVlLFxyXG4gICAgICAgICAgc3gsXHJcbiAgICAgICAgICBzeSxcclxuICAgICAgICAgIGt4LFxyXG4gICAgICAgICAga3ksXHJcbiAgICAgICAgICBhcnJheU9mUG9pbnRzWzFdXHJcbiAgICAgICAgKTtcclxuICAgICAgICBzaGFwZS5wdXNoKGxpbmUpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFR5cGUuU3F1YXJlOlxyXG4gICAgICAgIGNvbnN0IHNxdWFyZSA9IG5ldyBTcXVhcmUoaXRlbS5pZCwgaXRlbS5jZW50ZXIpO1xyXG4gICAgICAgIHNxdWFyZS5zZXRTcXVhcmVBdHRyaWJ1dGVzKFxyXG4gICAgICAgICAgdHgsXHJcbiAgICAgICAgICB0eSxcclxuICAgICAgICAgIGRlZ3JlZSxcclxuICAgICAgICAgIHN4LFxyXG4gICAgICAgICAgc3ksXHJcbiAgICAgICAgICBreCxcclxuICAgICAgICAgIGt5LFxyXG4gICAgICAgICAgYXJyYXlPZlBvaW50c1xyXG4gICAgICAgICk7XHJcbiAgICAgICAgc2hhcGUucHVzaChzcXVhcmUpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFR5cGUuUmVjdGFuZ2xlOlxyXG4gICAgICAgIGNvbnN0IHJlY3RhbmdsZSA9IG5ldyBSZWN0YW5nbGUoaXRlbS5pZCwgYXJyYXlPZlBvaW50c1swXSk7XHJcbiAgICAgICAgcmVjdGFuZ2xlLnNldFJlY3RhbmdsZUF0dHJpYnV0ZXMoXHJcbiAgICAgICAgICB0eCxcclxuICAgICAgICAgIHR5LFxyXG4gICAgICAgICAgZGVncmVlLFxyXG4gICAgICAgICAgc3gsXHJcbiAgICAgICAgICBzeSxcclxuICAgICAgICAgIGt4LFxyXG4gICAgICAgICAga3ksXHJcbiAgICAgICAgICBhcnJheU9mUG9pbnRzXHJcbiAgICAgICAgKTtcclxuICAgICAgICBzaGFwZS5wdXNoKHJlY3RhbmdsZSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgVHlwZS5Qb2x5Z29uOlxyXG4gICAgICAgIGNvbnN0IHBvbHlnb24gPSBuZXcgUG9seWdvbihpdGVtLmlkLCBhcnJheU9mUG9pbnRzWzBdKTtcclxuICAgICAgICBwb2x5Z29uLnNldFBvbHlnb25BdHRyaWJ1dGVzKFxyXG4gICAgICAgICAgdHgsXHJcbiAgICAgICAgICB0eSxcclxuICAgICAgICAgIGRlZ3JlZSxcclxuICAgICAgICAgIHN4LFxyXG4gICAgICAgICAgc3ksXHJcbiAgICAgICAgICBreCxcclxuICAgICAgICAgIGt5LFxyXG4gICAgICAgICAgYXJyYXlPZlBvaW50c1xyXG4gICAgICAgICk7XHJcbiAgICAgICAgc2hhcGUucHVzaChwb2x5Z29uKTtcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIHNoYXBlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzdG9yZVNoYXBlcyhzaGFwZTogU2hhcGVbXSk6IHN0cmluZyB7XHJcbiAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHNoYXBlKTtcclxufVxyXG5cclxuZnVuY3Rpb24gaGFuZGxlRG93bmxvYWQodGV4dDogc3RyaW5nKTogdm9pZCB7XHJcbiAgY29uc3QgZGF0YSA9IG5ldyBGaWxlKFt0ZXh0XSwgXCJzaGFwZXMuanNvblwiLCB7IHR5cGU6IFwiYXBwbGljYXRpb24vanNvblwiIH0pO1xyXG5cclxuICBjb25zdCB1cmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGRhdGEpO1xyXG5cclxuICBjb25zdCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XHJcbiAgYS5ocmVmID0gdXJsO1xyXG4gIGEuZG93bmxvYWQgPSBkYXRhLm5hbWU7XHJcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChhKTtcclxuICBhLmNsaWNrKCk7XHJcbiAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChhKTtcclxuICBVUkwucmV2b2tlT2JqZWN0VVJMKHVybCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhhbmRsZVVwbG9hZChjYWxsYmFjazogKHRleHQ6IHN0cmluZykgPT4gdm9pZCk6IHZvaWQge1xyXG4gIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gIGlucHV0LnR5cGUgPSBcImZpbGVcIjtcclxuICBpbnB1dC5hY2NlcHQgPSBcImFwcGxpY2F0aW9uL2pzb25cIjtcclxuXHJcbiAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoKSA9PiB7XHJcbiAgICBjb25zdCBmaWxlID0gaW5wdXQuZmlsZXNbMF07XHJcbiAgICBjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG5cclxuICAgIHJlYWRlci5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgIGNhbGxiYWNrKHJlYWRlci5yZXN1bHQgYXMgc3RyaW5nKTtcclxuICAgIH07XHJcbiAgICByZWFkZXIucmVhZEFzVGV4dChmaWxlKTtcclxuICB9KTtcclxuXHJcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChpbnB1dCk7XHJcbiAgaW5wdXQuY2xpY2soKTtcclxuICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGlucHV0KTtcclxufVxyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=