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
        console.log(numPoints);
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
    // console.log("kontolodon3");
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
    // console.log("kontolodon5");
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
const Transformation_1 = __importDefault(__webpack_require__(/*! ./Operations/Transformation */ "./src/Operations/Transformation.ts"));
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
    switch (type) {
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
        (0, render_all_1.renderAll)(gl, programInfo, shapes, positionBuffer, colorBuffer);
    });
    const sliderWidth_original = document.getElementById("sliderWidth");
    const sliderWidth = sliderWidth_original.cloneNode(true);
    sliderWidth_original.parentNode.replaceChild(sliderWidth, sliderWidth_original);
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
        addPointButton.className = "btn btn-primary";
        addPointButton.id = "btn-add-point";
        addPointButton.addEventListener("click", () => {
            // Set a flag to indicate that a new point is being added
            isDrawing = true;
            currentObject = shapes[element.id];
        });
        // Append the button to the DOM
        const leftPanel = document.querySelector(".left-panel");
        if (leftPanel) {
            leftPanel.appendChild(addPointButton);
        }
    }
}
function setupColorPicker(gl, programInfo, pointIndex, element) {
    const colorPicker_original = document.getElementById("colorPicker");
    const colorPicker = colorPicker_original.cloneNode(true);
    const color = (0, tools_1.rgbToHex)(element.arrayOfPoints[pointIndex].getColor());
    colorPicker.value = color;
    colorPicker.style.color = color;
    colorPicker.setAttribute("value", color);
    // console.log(`color: ${color}}`)
    console.log(`color picker value: ${colorPicker.value}`);
    colorPicker_original.parentElement.replaceChild(colorPicker, colorPicker_original);
    // colorPicker.innerHTML = "";
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
        deletePointButton.className = "btn btn-primary";
        deletePointButton.id = "btn-delete-point";
        deletePointButton.addEventListener("click", () => {
            element.deletePoint(pointIndex);
            (0, render_all_1.renderAll)(gl, programInfo, shapes, positionBuffer, colorBuffer);
        });
        const bottomSection = document.querySelector(".bottom-section");
        if (bottomSection) {
            bottomSection.appendChild(deletePointButton);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUUsR0FBRyxDQUFDLEdBQUcsV0FBVyxDQUFDLEVBQUUsQ0FBQztRQUN2QyxNQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxXQUFXLENBQUMsRUFBRSxDQUFDO1FBQ3ZDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxFQUFFLENBQUM7UUFFdkMsTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztRQUNoQyxNQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7UUFFaEMsTUFBTSxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO1FBQzdDLE1BQU0sR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztRQUM3QyxNQUFNLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7UUFDN0MsTUFBTSxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO1FBQzdDLE1BQU0sR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztRQUM3QyxNQUFNLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7UUFDN0MsTUFBTSxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO1FBQzdDLE1BQU0sR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztRQUM3QyxNQUFNLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7UUFFN0MsTUFBTSxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUM3RSxPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBR00sYUFBYSxDQUFDLEtBQVk7UUFDN0IsTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztRQUNoQyxNQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7UUFFaEMsTUFBTSxFQUFFLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDekQsTUFBTSxFQUFFLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFFekQsTUFBTSxRQUFRLEdBQUcsSUFBSSxlQUFLLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUVy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LENBQUMsS0FBSyxFQUFFLENBQUM7SUFDZCxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNuQyxDQUFDOzs7Ozs7O1VDbG9CRDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7O1VFdEJBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdHVnYXMtYmVzYXItZ3JhZmtvbS0xLXBhaW50Ly4vc3JjLzJELVNoYXBlcy9saW5lLnRzIiwid2VicGFjazovL3R1Z2FzLWJlc2FyLWdyYWZrb20tMS1wYWludC8uL3NyYy8yRC1TaGFwZXMvcG9seWdvbi50cyIsIndlYnBhY2s6Ly90dWdhcy1iZXNhci1ncmFma29tLTEtcGFpbnQvLi9zcmMvMkQtU2hhcGVzL3JlY3RhbmdsZS50cyIsIndlYnBhY2s6Ly90dWdhcy1iZXNhci1ncmFma29tLTEtcGFpbnQvLi9zcmMvMkQtU2hhcGVzL3NoYXBlLnRzIiwid2VicGFjazovL3R1Z2FzLWJlc2FyLWdyYWZrb20tMS1wYWludC8uL3NyYy8yRC1TaGFwZXMvc3F1YXJlLnRzIiwid2VicGFjazovL3R1Z2FzLWJlc2FyLWdyYWZrb20tMS1wYWludC8uL3NyYy8yRC1TaGFwZXMvdHlwZS5lbnVtLnRzIiwid2VicGFjazovL3R1Z2FzLWJlc2FyLWdyYWZrb20tMS1wYWludC8uL3NyYy9CYXNlL2Nvb3JkaW5hdGUudHMiLCJ3ZWJwYWNrOi8vdHVnYXMtYmVzYXItZ3JhZmtvbS0xLXBhaW50Ly4vc3JjL0Jhc2UvbWF0cml4LnRzIiwid2VicGFjazovL3R1Z2FzLWJlc2FyLWdyYWZrb20tMS1wYWludC8uL3NyYy9CYXNlL3BvaW50LnRzIiwid2VicGFjazovL3R1Z2FzLWJlc2FyLWdyYWZrb20tMS1wYWludC8uL3NyYy9GdW5jdGlvbnMvY3JlYXRlLXNoYWRlci1wcm9ncmFtLnRzIiwid2VicGFjazovL3R1Z2FzLWJlc2FyLWdyYWZrb20tMS1wYWludC8uL3NyYy9GdW5jdGlvbnMvbG9hZC1zaGFkZXIudHMiLCJ3ZWJwYWNrOi8vdHVnYXMtYmVzYXItZ3JhZmtvbS0xLXBhaW50Ly4vc3JjL0Z1bmN0aW9ucy9yZW5kZXItYWxsLnRzIiwid2VicGFjazovL3R1Z2FzLWJlc2FyLWdyYWZrb20tMS1wYWludC8uL3NyYy9GdW5jdGlvbnMvcmVuZGVyLnRzIiwid2VicGFjazovL3R1Z2FzLWJlc2FyLWdyYWZrb20tMS1wYWludC8uL3NyYy9PcGVyYXRpb25zL1RyYW5zZm9ybWF0aW9uLnRzIiwid2VicGFjazovL3R1Z2FzLWJlc2FyLWdyYWZrb20tMS1wYWludC8uL3NyYy9PcGVyYXRpb25zL2NvbnZleC1odWxsLnRzIiwid2VicGFjazovL3R1Z2FzLWJlc2FyLWdyYWZrb20tMS1wYWludC8uL3NyYy9VdGlscy90b29scy50cyIsIndlYnBhY2s6Ly90dWdhcy1iZXNhci1ncmFma29tLTEtcGFpbnQvLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vdHVnYXMtYmVzYXItZ3JhZmtvbS0xLXBhaW50L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3R1Z2FzLWJlc2FyLWdyYWZrb20tMS1wYWludC93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL3R1Z2FzLWJlc2FyLWdyYWZrb20tMS1wYWludC93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vdHVnYXMtYmVzYXItZ3JhZmtvbS0xLXBhaW50L3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVuZGVyYWJsZSBmcm9tIFwiLi9JbnRlcmZhY2VzL3JlbmRlcmFibGUuaW50ZXJmYWNlXCI7XHJcbmltcG9ydCBUcmFuc2Zvcm1hYmxlIGZyb20gXCIuL0ludGVyZmFjZXMvdHJhbnNmb3JtYWJsZS5pbnRlcmZhY2VcIjtcclxuaW1wb3J0IFNoYXBlIGZyb20gXCIuL3NoYXBlXCI7XHJcbmltcG9ydCBUeXBlIGZyb20gXCIuL3R5cGUuZW51bVwiO1xyXG5pbXBvcnQgUG9pbnQgZnJvbSBcIi4uL0Jhc2UvcG9pbnRcIjtcclxuaW1wb3J0IFRyYW5zZm9ybWF0aW9uIGZyb20gXCJNYWluL09wZXJhdGlvbnMvVHJhbnNmb3JtYXRpb25cIjtcclxuXHJcbmNsYXNzIExpbmUgZXh0ZW5kcyBTaGFwZSBpbXBsZW1lbnRzIFJlbmRlcmFibGUsIFRyYW5zZm9ybWFibGUge1xyXG5cclxuICAgIHB1YmxpYyB0eXBlOiBUeXBlLkxpbmU7XHJcbiAgICBwdWJsaWMgYXJyYXlPZlBvaW50czogUG9pbnRbXTtcclxuXHJcbiAgICBwdWJsaWMgY2VudGVyOiBQb2ludDtcclxuICAgIHB1YmxpYyB0eDogbnVtYmVyO1xyXG4gICAgcHVibGljIHR5OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgZGVncmVlOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgc3g6IG51bWJlcjtcclxuICAgIHB1YmxpYyBzeTogbnVtYmVyO1xyXG4gICAgcHVibGljIGt4OiBudW1iZXI7XHJcbiAgICBwdWJsaWMga3k6IG51bWJlcjtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoaWQ6IG51bWJlciwgcDE6IFBvaW50KSB7XHJcbiAgICAgICAgc3VwZXIoaWQsIDIsIFR5cGUuTGluZSk7XHJcbiAgICAgICAgdGhpcy5hcnJheU9mUG9pbnRzID0gW3AxXTtcclxuICAgICAgICB0aGlzLnR4ID0gMDtcclxuICAgICAgICB0aGlzLnR5ID0gMDtcclxuICAgICAgICB0aGlzLmRlZ3JlZSA9IDA7XHJcbiAgICAgICAgdGhpcy5zeCA9IDE7XHJcbiAgICAgICAgdGhpcy5zeSA9IDE7XHJcbiAgICAgICAgdGhpcy5reCA9IDA7XHJcbiAgICAgICAgdGhpcy5reSA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gVHJhbnNmb3JtYWJsZSBNZXRob2RzXHJcbiAgICBwdWJsaWMgYWRkTWF0cml4KGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsIG1hdHJpeExvY2F0aW9uOiBXZWJHTFVuaWZvcm1Mb2NhdGlvbik6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IG1hdHJpeCA9IFRyYW5zZm9ybWF0aW9uLnRyYW5zZm9ybWF0aW9uTWF0cml4KFxyXG4gICAgICAgICAgICBnbC5jYW52YXMud2lkdGgsXHJcbiAgICAgICAgICAgIGdsLmNhbnZhcy5oZWlnaHQsXHJcbiAgICAgICAgICAgIHRoaXMudHgsXHJcbiAgICAgICAgICAgIHRoaXMudHksXHJcbiAgICAgICAgICAgIHRoaXMuZGVncmVlLFxyXG4gICAgICAgICAgICB0aGlzLnN4LFxyXG4gICAgICAgICAgICB0aGlzLnN5LFxyXG4gICAgICAgICAgICB0aGlzLmt4LFxyXG4gICAgICAgICAgICB0aGlzLmt5LFxyXG4gICAgICAgICAgICB0aGlzLmdldENlbnRlcigpXHJcbiAgICAgICAgICApLmZsYXR0ZW4oKTtcclxuICAgICAgXHJcbiAgICAgICAgICBnbC51bmlmb3JtTWF0cml4M2Z2KG1hdHJpeExvY2F0aW9uLCBmYWxzZSwgbWF0cml4KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0Q2VudGVyKCk6IFBvaW50IHtcclxuICAgICAgICBjb25zdCBudW1Qb2ludHMgPSB0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKG51bVBvaW50cylcclxuICAgICAgICBsZXQgY2VudGVyWCA9IDA7XHJcbiAgICAgICAgbGV0IGNlbnRlclkgPSAwO1xyXG4gICAgICAgIGZvciAoY29uc3QgcG9pbnQgb2YgdGhpcy5hcnJheU9mUG9pbnRzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IFt4LCB5XSA9IHBvaW50LmdldFBhaXIoKTtcclxuICAgICAgICAgICAgY2VudGVyWCArPSB4O1xyXG4gICAgICAgICAgICBjZW50ZXJZICs9IHk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNlbnRlclggLz0gbnVtUG9pbnRzO1xyXG4gICAgICAgIGNlbnRlclkgLz0gbnVtUG9pbnRzO1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3IFBvaW50KFtjZW50ZXJYLCBjZW50ZXJZXSwgWzAsIDAsIDAsIDBdKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZHJhd01ldGhvZChnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0KTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gZ2wuTElORVM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGlzRHJhd2FibGUoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJyYXlPZlBvaW50cy5sZW5ndGggPT09IDI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRyYXcocG9pbnQ6IFBvaW50KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5hcnJheU9mUG9pbnRzWzFdID0gcG9pbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldE51bWJlck9mVmVydGljZXNUb0JlRHJhd24oKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gMjtcclxuICAgIH0gXHJcbiAgICBcclxuICAgIHB1YmxpYyBhZGRQb3NpdGlvbihnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0KTogdm9pZCB7XHJcbiAgICAgICAgZ2wuYnVmZmVyRGF0YShcclxuICAgICAgICAgICAgZ2wuQVJSQVlfQlVGRkVSLFxyXG4gICAgICAgICAgICBuZXcgRmxvYXQzMkFycmF5KFsuLi50aGlzLmFycmF5T2ZQb2ludHNbMF0uZ2V0UGFpcigpLCAuLi50aGlzLmFycmF5T2ZQb2ludHNbMV0uZ2V0UGFpcigpXSksXHJcbiAgICAgICAgICAgIGdsLlNUQVRJQ19EUkFXXHJcbiAgICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRDb2xvcihnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0KTogdm9pZCB7XHJcbiAgICAgICAgZ2wuYnVmZmVyRGF0YShcclxuICAgICAgICAgICAgZ2wuQVJSQVlfQlVGRkVSLFxyXG4gICAgICAgICAgICBuZXcgRmxvYXQzMkFycmF5KFsuLi50aGlzLmFycmF5T2ZQb2ludHNbMF0uZ2V0Q29sb3IoKSwgLi4udGhpcy5hcnJheU9mUG9pbnRzWzFdLmdldENvbG9yKCldKSxcclxuICAgICAgICAgICAgZ2wuU1RBVElDX0RSQVdcclxuICAgICAgICAgICk7XHJcbiAgICB9ICBcclxuXHJcbiAgICBwdWJsaWMgc2V0TGluZUF0dHJpYnV0ZXModHg6IG51bWJlciwgdHk6IG51bWJlciwgZGVncmVlOiBudW1iZXIsIHN4OiBudW1iZXIsIHN5OiBudW1iZXIsIGt4OiBudW1iZXIsIGt5OiBudW1iZXIsIHAyOiBQb2ludCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuYXJyYXlPZlBvaW50cy5wdXNoKHAyKTtcclxuICAgICAgICB0aGlzLnR4ID0gdHg7XHJcbiAgICAgICAgdGhpcy50eSA9IHR5O1xyXG4gICAgICAgIHRoaXMuZGVncmVlID0gZGVncmVlO1xyXG4gICAgICAgIHRoaXMuc3ggPSBzeDtcclxuICAgICAgICB0aGlzLnN5ID0gc3k7XHJcbiAgICAgICAgdGhpcy5reCA9IGt4O1xyXG4gICAgICAgIHRoaXMua3kgPSBreTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgTGluZTtcclxuIiwiaW1wb3J0IFRyYW5zZm9ybWF0aW9uIGZyb20gXCJNYWluL09wZXJhdGlvbnMvVHJhbnNmb3JtYXRpb25cIjtcclxuaW1wb3J0IFJlbmRlcmFibGUgZnJvbSBcIi4vSW50ZXJmYWNlcy9yZW5kZXJhYmxlLmludGVyZmFjZVwiO1xyXG5pbXBvcnQgVHJhbnNmb3JtYWJsZSBmcm9tIFwiLi9JbnRlcmZhY2VzL3RyYW5zZm9ybWFibGUuaW50ZXJmYWNlXCI7XHJcbmltcG9ydCBTaGFwZSBmcm9tIFwiLi9zaGFwZVwiO1xyXG5pbXBvcnQgVHlwZSBmcm9tIFwiLi90eXBlLmVudW1cIjtcclxuaW1wb3J0IFBvaW50IGZyb20gXCJNYWluL0Jhc2UvcG9pbnRcIjtcclxuaW1wb3J0IGNvbnZleEh1bGwgZnJvbSBcIk1haW4vT3BlcmF0aW9ucy9jb252ZXgtaHVsbFwiO1xyXG5cclxuY2xhc3MgUG9seWdvbiBleHRlbmRzIFNoYXBlIGltcGxlbWVudHMgUmVuZGVyYWJsZSwgVHJhbnNmb3JtYWJsZSB7XHJcbiAgICBwdWJsaWMgdHlwZTogVHlwZS5Qb2x5Z29uO1xyXG4gICAgcHVibGljIGFycmF5T2ZQb2ludHM6IFBvaW50W107XHJcblxyXG4gICAgcHVibGljIGNlbnRlcjogUG9pbnQ7XHJcbiAgICBwdWJsaWMgdHg6IG51bWJlcjtcclxuICAgIHB1YmxpYyB0eTogbnVtYmVyO1xyXG4gICAgcHVibGljIGRlZ3JlZTogbnVtYmVyO1xyXG4gICAgcHVibGljIHN4OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgc3k6IG51bWJlcjtcclxuICAgIHB1YmxpYyBreDogbnVtYmVyO1xyXG4gICAgcHVibGljIGt5OiBudW1iZXI7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKGlkOiBudW1iZXIsIHBvaW50OiBQb2ludCkge1xyXG4gICAgICAgIHN1cGVyKGlkLCAxLCBUeXBlLlBvbHlnb24pO1xyXG4gICAgICAgIHRoaXMuYXJyYXlPZlBvaW50cyA9IG5ldyBBcnJheShwb2ludCk7XHJcbiAgICAgICAgdGhpcy50eCA9IDA7XHJcbiAgICAgICAgdGhpcy50eSA9IDA7XHJcbiAgICAgICAgdGhpcy5kZWdyZWUgPSAwO1xyXG4gICAgICAgIHRoaXMuc3ggPSAxO1xyXG4gICAgICAgIHRoaXMuc3kgPSAxO1xyXG4gICAgICAgIHRoaXMua3ggPSAwO1xyXG4gICAgICAgIHRoaXMua3kgPSAwO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0Q2VudGVyKCk6IFBvaW50IHtcclxuICAgICAgICBsZXQgc3VtWCA9IDA7XHJcbiAgICAgICAgbGV0IHN1bVkgPSAwO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYXJyYXlPZlBvaW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBbeCwgeV0gPSB0aGlzLmFycmF5T2ZQb2ludHNbaV0uZ2V0UGFpcigpO1xyXG4gICAgICAgICAgICBzdW1YICs9IHg7XHJcbiAgICAgICAgICAgIHN1bVkgKz0geTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGNlbnRlclggPSBzdW1YIC8gdGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aDtcclxuICAgICAgICBjb25zdCBjZW50ZXJZID0gc3VtWSAvIHRoaXMuYXJyYXlPZlBvaW50cy5sZW5ndGg7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgUG9pbnQoW2NlbnRlclgsIGNlbnRlclldLCBbMCwgMCwgMCwgMF0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpc0RyYXdhYmxlKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoID49IDI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRyYXcgKHBvaW50OiBQb2ludCk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoID49IDMpIHtcclxuICAgICAgICAgICAgdGhpcy5hcnJheU9mUG9pbnRzID0gY29udmV4SHVsbChbLi4udGhpcy5hcnJheU9mUG9pbnRzLCBwb2ludF0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuYXJyYXlPZlBvaW50c1t0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoXSA9IHBvaW50O1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNlbnRlciA9IHRoaXMuZ2V0Q2VudGVyKCk7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRyYXdNZXRob2QoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJyYXlPZlBvaW50cy5sZW5ndGggPj0zID8gZ2wuVFJJQU5HTEVfRkFOIDogZ2wuTElORVM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldE51bWJlck9mVmVydGljZXNUb0JlRHJhd24oKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aCA7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZFBvc2l0aW9uKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCB2ZXJ0aWNlcyA9IG5ldyBGbG9hdDMyQXJyYXkodGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aCAqIDIpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYXJyYXlPZlBvaW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBbeCwgeV0gPSB0aGlzLmFycmF5T2ZQb2ludHNbaV0uZ2V0UGFpcigpO1xyXG4gICAgICAgICAgICB2ZXJ0aWNlc1tpICogMl0gPSB4O1xyXG4gICAgICAgICAgICB2ZXJ0aWNlc1tpICogMiArIDFdID0geTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IFtwSW5pdGlhbFgsIHBJbml0aWFsWV0gPSB0aGlzLmFycmF5T2ZQb2ludHNbMF0uZ2V0UGFpcigpO1xyXG4gICAgICAgIHZlcnRpY2VzW3RoaXMuYXJyYXlPZlBvaW50cy5sZW5ndGggKiAyXSA9IHBJbml0aWFsWDtcclxuICAgICAgICB2ZXJ0aWNlc1t0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoICogMiArIDFdID0gcEluaXRpYWxZO1xyXG5cclxuICAgICAgICBnbC5idWZmZXJEYXRhKGdsLkFSUkFZX0JVRkZFUiwgdmVydGljZXMsIGdsLlNUQVRJQ19EUkFXKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkQ29sb3IoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IGNvbG9ycyA9IG5ldyBGbG9hdDMyQXJyYXkodGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aCAqIDQpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYXJyYXlPZlBvaW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBbciwgZywgYiwgYV0gPSB0aGlzLmFycmF5T2ZQb2ludHNbaV0uZ2V0Q29sb3IoKTtcclxuICAgICAgICAgICAgY29sb3JzW2kgKiA0XSA9IHI7XHJcbiAgICAgICAgICAgIGNvbG9yc1tpICogNCArIDFdID0gZztcclxuICAgICAgICAgICAgY29sb3JzW2kgKiA0ICsgMl0gPSBiO1xyXG4gICAgICAgICAgICBjb2xvcnNbaSAqIDQgKyAzXSA9IGE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBbckluaXRpYWwsIGdJbml0aWFsLCBiSW5pdGlhbCwgYUluaXRpYWxdID0gdGhpcy5hcnJheU9mUG9pbnRzWzBdLmdldENvbG9yKCk7XHJcbiAgICAgICAgY29sb3JzW3RoaXMuYXJyYXlPZlBvaW50cy5sZW5ndGggKiA0XSA9IHJJbml0aWFsO1xyXG4gICAgICAgIGNvbG9yc1t0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoICogNCArIDFdID0gZ0luaXRpYWw7XHJcbiAgICAgICAgY29sb3JzW3RoaXMuYXJyYXlPZlBvaW50cy5sZW5ndGggKiA0ICsgMl0gPSBiSW5pdGlhbDtcclxuICAgICAgICBjb2xvcnNbdGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aCAqIDQgKyAzXSA9IGFJbml0aWFsO1xyXG5cclxuICAgICAgICBnbC5idWZmZXJEYXRhKGdsLkFSUkFZX0JVRkZFUiwgY29sb3JzLCBnbC5TVEFUSUNfRFJBVyk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgYWRkTWF0cml4KGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsIG1hdHJpeExvY2F0aW9uOiBXZWJHTFVuaWZvcm1Mb2NhdGlvbik6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IG1hdHJpeCA9IFRyYW5zZm9ybWF0aW9uLnRyYW5zZm9ybWF0aW9uTWF0cml4KFxyXG4gICAgICAgICAgICBnbC5jYW52YXMud2lkdGgsXHJcbiAgICAgICAgICAgIGdsLmNhbnZhcy5oZWlnaHQsXHJcbiAgICAgICAgICAgIHRoaXMudHgsXHJcbiAgICAgICAgICAgIHRoaXMudHksXHJcbiAgICAgICAgICAgIHRoaXMuZGVncmVlLFxyXG4gICAgICAgICAgICB0aGlzLnN4LFxyXG4gICAgICAgICAgICB0aGlzLnN5LFxyXG4gICAgICAgICAgICB0aGlzLmt4LFxyXG4gICAgICAgICAgICB0aGlzLmt5LFxyXG4gICAgICAgICAgICB0aGlzLmNlbnRlclxyXG4gICAgICAgICAgKS5mbGF0dGVuKCk7XHJcbiAgICAgIFxyXG4gICAgICAgICAgZ2wudW5pZm9ybU1hdHJpeDNmdihtYXRyaXhMb2NhdGlvbiwgZmFsc2UsIG1hdHJpeCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlbGV0ZVBvaW50KGluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICB2YXIgbmV3UG9pbnRzOiBQb2ludFtdID0gW3RoaXMuYXJyYXlPZlBvaW50c1tpbmRleF1dO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICBpZiAoaSAhPSBpbmRleCkge1xyXG4gICAgICAgICAgICBuZXdQb2ludHMucHVzaCh0aGlzLmFycmF5T2ZQb2ludHNbaV0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgIHRoaXMuYXJyYXlPZlBvaW50cyA9IG5ld1BvaW50cy5zbGljZSgxLCB0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoKTtcclxuICAgIFxyXG4gICAgICAgIC8vIGFmdGVyIGRlbGV0ZSwgbmVlZCB0byBzZXR1cCBvcHRpb24gYWdhaW5cclxuICAgICAgICBjb25zdCBwb2ludFBpY2tlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicG9pbnRQaWNrZXJcIik7XHJcbiAgICAgICAgcG9pbnRQaWNrZXIuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgICBwb2ludFBpY2tlci5yZXBsYWNlQ2hpbGRyZW4oKTtcclxuICAgICAgICAvKiBBbGwgUG9pbnQgKi9cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYXJyYXlPZlBvaW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgY29uc3QgbmV3UG9pbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xyXG4gICAgICAgICAgbmV3UG9pbnQudmFsdWUgPSBpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICBuZXdQb2ludC50ZXh0ID0gXCJwb2ludF9cIiArIGk7XHJcbiAgICAgICAgICBwb2ludFBpY2tlci5hcHBlbmRDaGlsZChuZXdQb2ludCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBwdWJsaWMgc2V0UG9seWdvbkF0dHJpYnV0ZXModHg6IG51bWJlciwgdHk6IG51bWJlciwgZGVncmVlOiBudW1iZXIsIHN4OiBudW1iZXIsIHN5OiBudW1iZXIsIGt4OiBudW1iZXIsIGt5OiBudW1iZXIsIGFycmF5T2ZQb2ludHM6IFBvaW50W10pOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmFycmF5T2ZQb2ludHMgPSBhcnJheU9mUG9pbnRzO1xyXG4gICAgICAgIHRoaXMudHggPSB0eDtcclxuICAgICAgICB0aGlzLnR5ID0gdHk7XHJcbiAgICAgICAgdGhpcy5kZWdyZWUgPSBkZWdyZWU7XHJcbiAgICAgICAgdGhpcy5zeCA9IHN4O1xyXG4gICAgICAgIHRoaXMuc3kgPSBzeTtcclxuICAgICAgICB0aGlzLmt4ID0ga3g7XHJcbiAgICAgICAgdGhpcy5reSA9IGt5O1xyXG4gICAgICB9XHJcbiAgICBcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgUG9seWdvbjsiLCJpbXBvcnQgU2hhcGUgZnJvbSBcIlNoYXBlcy9zaGFwZVwiO1xyXG5pbXBvcnQgUG9pbnQgZnJvbSBcIkJhc2UvcG9pbnRcIjtcclxuaW1wb3J0IFR5cGUgZnJvbSBcIlNoYXBlcy90eXBlLmVudW1cIjtcclxuaW1wb3J0IFJlbmRlcmFibGUgZnJvbSBcIk1haW4vMkQtU2hhcGVzL0ludGVyZmFjZXMvcmVuZGVyYWJsZS5pbnRlcmZhY2VcIjtcclxuaW1wb3J0IFRyYW5zZm9ybWFibGUgZnJvbSBcIlNoYXBlcy9JbnRlcmZhY2VzL3RyYW5zZm9ybWFibGUuaW50ZXJmYWNlXCI7XHJcbmltcG9ydCBUcmFuc2Zvcm1hdGlvbiBmcm9tIFwiTWFpbi9PcGVyYXRpb25zL1RyYW5zZm9ybWF0aW9uXCI7XHJcblxyXG5jbGFzcyBSZWN0YW5nbGUgZXh0ZW5kcyBTaGFwZSBpbXBsZW1lbnRzIFJlbmRlcmFibGUsIFRyYW5zZm9ybWFibGUge1xyXG4gICAgcHVibGljIGFycmF5T2ZQb2ludHM6IFBvaW50W107XHJcbiAgICBwdWJsaWMgY2VudGVyOiBQb2ludDtcclxuICAgIHB1YmxpYyB0eDogbnVtYmVyO1xyXG4gICAgcHVibGljIHR5OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgZGVncmVlOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgc3g6IG51bWJlcjtcclxuICAgIHB1YmxpYyBzeTogbnVtYmVyO1xyXG4gICAgcHVibGljIGt4OiBudW1iZXI7XHJcbiAgICBwdWJsaWMga3k6IG51bWJlcjtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoaWQ6IG51bWJlciwgIHAxOiBQb2ludCl7XHJcbiAgICAgICAgc3VwZXIoaWQsIDQsIFR5cGUuUmVjdGFuZ2xlKTtcclxuICAgICAgICB0aGlzLmFycmF5T2ZQb2ludHMgPSBbcDEsIG51bGwsIG51bGwsIG51bGxdO1xyXG4gICAgICAgIHRoaXMudHggPSAwO1xyXG4gICAgICAgIHRoaXMudHkgPSAwO1xyXG4gICAgICAgIHRoaXMuZGVncmVlID0gMDtcclxuICAgICAgICB0aGlzLnN4ID0gMTtcclxuICAgICAgICB0aGlzLnN5ID0gMTtcclxuICAgICAgICB0aGlzLmt4ID0gMDtcclxuICAgICAgICB0aGlzLmt5ID0gMDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBUcmFuc2Zvcm1hYmxlIE1ldGhvZHNcclxuICAgIHB1YmxpYyBnZXRDZW50ZXIoKTogUG9pbnQge1xyXG4gICAgICAgIGNvbnN0IFtwMXgsIHAxeV0gPSB0aGlzLmFycmF5T2ZQb2ludHNbMF0uZ2V0UGFpcigpO1xyXG4gICAgICAgIGNvbnN0IFtwMngsIHAyeV0gPSB0aGlzLmFycmF5T2ZQb2ludHNbMV0uZ2V0UGFpcigpO1xyXG4gICAgICAgIGNvbnN0IFtwM3gsIHAzeV0gPSB0aGlzLmFycmF5T2ZQb2ludHNbMl0uZ2V0UGFpcigpO1xyXG4gICAgICAgIGNvbnN0IFtwNHgsIHA0eV0gPSB0aGlzLmFycmF5T2ZQb2ludHNbM10uZ2V0UGFpcigpO1xyXG5cclxuICAgICAgICBjb25zdCBjZW50ZXJYID0gKHAxeCArIHAyeCArIHAzeCArIHA0eCkgLyA0O1xyXG4gICAgICAgIGNvbnN0IGNlbnRlclkgPSAocDF5ICsgcDJ5ICsgcDN5ICsgcDR5KSAvIDQ7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIG5ldyBQb2ludChbY2VudGVyWCwgY2VudGVyWV0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRNYXRyaXgoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCwgbWF0cml4TG9jYXRpb246IFdlYkdMVW5pZm9ybUxvY2F0aW9uKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgbWF0cml4ID0gVHJhbnNmb3JtYXRpb24udHJhbnNmb3JtYXRpb25NYXRyaXgoXHJcbiAgICAgICAgICAgIGdsLmNhbnZhcy53aWR0aCxcclxuICAgICAgICAgICAgZ2wuY2FudmFzLmhlaWdodCxcclxuICAgICAgICAgICAgdGhpcy50eCxcclxuICAgICAgICAgICAgdGhpcy50eSxcclxuICAgICAgICAgICAgdGhpcy5kZWdyZWUsXHJcbiAgICAgICAgICAgIHRoaXMuc3gsXHJcbiAgICAgICAgICAgIHRoaXMuc3ksXHJcbiAgICAgICAgICAgIHRoaXMua3gsXHJcbiAgICAgICAgICAgIHRoaXMua3ksXHJcbiAgICAgICAgICAgIHRoaXMuY2VudGVyXHJcbiAgICAgICAgICApLmZsYXR0ZW4oKTtcclxuICAgICAgXHJcbiAgICAgICAgICBnbC51bmlmb3JtTWF0cml4M2Z2KG1hdHJpeExvY2F0aW9uLCBmYWxzZSwgbWF0cml4KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBSZW5kZXJhYmxlIE1ldGhvZHNcclxuICAgIHB1YmxpYyBkcmF3TWV0aG9kKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBnbC5UUklBTkdMRV9GQU47XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGlzRHJhd2FibGUoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgLy8gcmV0dXJuIHRoaXMuYXJyYXlPZlBvaW50cy5maWx0ZXIocG9pbnQgPT4gcG9pbnQgIT09IG51bGwpLmxlbmd0aCA9PT0gNDtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcnJheU9mUG9pbnRzWzJdICE9PSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkcmF3KHBvaW50OiBQb2ludCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuYXJyYXlPZlBvaW50c1sxXSA9IG5ldyBQb2ludChbdGhpcy5hcnJheU9mUG9pbnRzWzBdLngsIHBvaW50LnldKTtcclxuICAgICAgICB0aGlzLmFycmF5T2ZQb2ludHNbMl0gPSBwb2ludDtcclxuICAgICAgICB0aGlzLmFycmF5T2ZQb2ludHNbM10gPSBuZXcgUG9pbnQoW3BvaW50LngsIHRoaXMuYXJyYXlPZlBvaW50c1swXS55XSk7XHJcbiAgICAgICAgdGhpcy5jZW50ZXIgPSB0aGlzLmdldENlbnRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXROdW1iZXJPZlZlcnRpY2VzVG9CZURyYXduKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIDU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZFBvc2l0aW9uKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQpOiB2b2lkIHtcclxuICAgICAgICBnbC5idWZmZXJEYXRhKFxyXG4gICAgICAgICAgICBnbC5BUlJBWV9CVUZGRVIsXHJcbiAgICAgICAgICAgIG5ldyBGbG9hdDMyQXJyYXkoW1xyXG4gICAgICAgICAgICAgIC4uLnRoaXMuYXJyYXlPZlBvaW50c1swXS5nZXRQYWlyKCksXHJcbiAgICAgICAgICAgICAgLi4udGhpcy5hcnJheU9mUG9pbnRzWzFdLmdldFBhaXIoKSxcclxuICAgICAgICAgICAgICAuLi50aGlzLmFycmF5T2ZQb2ludHNbMl0uZ2V0UGFpcigpLFxyXG4gICAgICAgICAgICAgIC4uLnRoaXMuYXJyYXlPZlBvaW50c1szXS5nZXRQYWlyKCksXHJcbiAgICAgICAgICAgICAgLi4udGhpcy5hcnJheU9mUG9pbnRzWzBdLmdldFBhaXIoKSxcclxuICAgICAgICAgICAgXSksXHJcbiAgICAgICAgICAgIGdsLlNUQVRJQ19EUkFXXHJcbiAgICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRDb2xvcihnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0KTogdm9pZCB7XHJcbiAgICAgICAgZ2wuYnVmZmVyRGF0YShcclxuICAgICAgICAgICAgZ2wuQVJSQVlfQlVGRkVSLFxyXG4gICAgICAgICAgICBuZXcgRmxvYXQzMkFycmF5KFtcclxuICAgICAgICAgICAgICAuLi50aGlzLmFycmF5T2ZQb2ludHNbMF0uZ2V0Q29sb3IoKSxcclxuICAgICAgICAgICAgICAuLi50aGlzLmFycmF5T2ZQb2ludHNbMV0uZ2V0Q29sb3IoKSxcclxuICAgICAgICAgICAgICAuLi50aGlzLmFycmF5T2ZQb2ludHNbMl0uZ2V0Q29sb3IoKSxcclxuICAgICAgICAgICAgICAuLi50aGlzLmFycmF5T2ZQb2ludHNbM10uZ2V0Q29sb3IoKSxcclxuICAgICAgICAgICAgICAuLi50aGlzLmFycmF5T2ZQb2ludHNbMF0uZ2V0Q29sb3IoKSxcclxuICAgICAgICAgICAgXSksXHJcbiAgICAgICAgICAgIGdsLlNUQVRJQ19EUkFXXHJcbiAgICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRSZWN0YW5nbGVBdHRyaWJ1dGVzKHR4OiBudW1iZXIsIHR5OiBudW1iZXIsIGRlZ3JlZTogbnVtYmVyLCBzeDogbnVtYmVyLCBzeTogbnVtYmVyLCBreDogbnVtYmVyLCBreTogbnVtYmVyLCBhcnJheU9mUG9pbnRzOiBQb2ludFtdKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5hcnJheU9mUG9pbnRzID0gYXJyYXlPZlBvaW50cztcclxuICAgICAgICB0aGlzLnR4ID0gdHg7XHJcbiAgICAgICAgdGhpcy50eSA9IHR5O1xyXG4gICAgICAgIHRoaXMuZGVncmVlID0gZGVncmVlO1xyXG4gICAgICAgIHRoaXMuc3ggPSBzeDtcclxuICAgICAgICB0aGlzLnN5ID0gc3k7XHJcbiAgICAgICAgdGhpcy5reCA9IGt4O1xyXG4gICAgICAgIHRoaXMua3kgPSBreTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgUmVjdGFuZ2xlO1xyXG4iLCJpbXBvcnQgUG9pbnQgZnJvbSBcIkJhc2UvcG9pbnRcIjtcclxuaW1wb3J0IFR5cGUgZnJvbSBcIlNoYXBlcy90eXBlLmVudW1cIjtcclxuYWJzdHJhY3QgY2xhc3MgU2hhcGUge1xyXG4gICAgcHVibGljIGlkOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgbnVtYmVyT2ZWZXJ0aWNlczogbnVtYmVyO1xyXG4gICAgcHVibGljIHR5cGU6IFR5cGU7XHJcbiAgICBwdWJsaWMgYXJyYXlPZlBvaW50czogUG9pbnRbXTtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoaWQ6IG51bWJlciwgbnVtYmVyT2ZWZXJ0aWNlczogbnVtYmVyLCB0eXBlOiBUeXBlKXtcclxuICAgICAgICB0aGlzLmlkID0gaWQ7XHJcbiAgICAgICAgdGhpcy5udW1iZXJPZlZlcnRpY2VzID0gbnVtYmVyT2ZWZXJ0aWNlcztcclxuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhYnN0cmFjdCBnZXRDZW50ZXIoKTogUG9pbnQ7XHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgaXNEcmF3YWJsZSgpOiBib29sZWFuO1xyXG4gICAgcHVibGljIGFic3RyYWN0IGRyYXcocG9pbnQ6IFBvaW50KTogdm9pZDtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgU2hhcGU7IiwiaW1wb3J0IFJlbmRlcmFibGUgZnJvbSBcIi4vSW50ZXJmYWNlcy9yZW5kZXJhYmxlLmludGVyZmFjZVwiO1xyXG5pbXBvcnQgU2hhcGUgZnJvbSBcIi4vc2hhcGVcIjtcclxuaW1wb3J0IFRyYW5zZm9ybWF0aW9uIGZyb20gXCJNYWluL09wZXJhdGlvbnMvVHJhbnNmb3JtYXRpb25cIjtcclxuaW1wb3J0IFRyYW5zZm9ybWFibGUgZnJvbSBcIi4vSW50ZXJmYWNlcy90cmFuc2Zvcm1hYmxlLmludGVyZmFjZVwiO1xyXG5pbXBvcnQgUG9pbnQgZnJvbSBcIi4uL0Jhc2UvcG9pbnRcIjtcclxuaW1wb3J0IFR5cGUgZnJvbSBcIi4vdHlwZS5lbnVtXCI7XHJcblxyXG5jbGFzcyBTcXVhcmUgZXh0ZW5kcyBTaGFwZSBpbXBsZW1lbnRzIFJlbmRlcmFibGUsIFRyYW5zZm9ybWFibGUge1xyXG4gIHB1YmxpYyBjZW50ZXI6IFBvaW50O1xyXG4gIHB1YmxpYyBhcnJheU9mUG9pbnRzOiBQb2ludFtdO1xyXG4gIHB1YmxpYyB0eDogbnVtYmVyO1xyXG4gIHB1YmxpYyB0eTogbnVtYmVyO1xyXG4gIHB1YmxpYyBkZWdyZWU6IG51bWJlcjtcclxuICBwdWJsaWMgc3g6IG51bWJlcjtcclxuICBwdWJsaWMgc3k6IG51bWJlcjtcclxuICBwdWJsaWMga3g6IG51bWJlcjtcclxuICBwdWJsaWMga3k6IG51bWJlcjtcclxuXHJcbiAgcHVibGljIGNvbnN0cnVjdG9yKGlkOiBudW1iZXIsIGNlbnRlclBvaW50OiBQb2ludCkge1xyXG4gICAgc3VwZXIoaWQsIDQsIFR5cGUuU3F1YXJlKTtcclxuICAgIHRoaXMuY2VudGVyID0gY2VudGVyUG9pbnQ7XHJcbiAgICB0aGlzLmFycmF5T2ZQb2ludHMgPSBbbnVsbCwgbnVsbCwgbnVsbCwgbnVsbF07XHJcbiAgICB0aGlzLnR4ID0gMDtcclxuICAgIHRoaXMudHkgPSAwO1xyXG4gICAgdGhpcy5kZWdyZWUgPSAwO1xyXG4gICAgdGhpcy5zeCA9IDE7XHJcbiAgICB0aGlzLnN5ID0gMTtcclxuICAgIHRoaXMua3ggPSAwO1xyXG4gICAgdGhpcy5reSA9IDA7XHJcbiAgfVxyXG5cclxuICAvLyBUcmFuc2Zvcm1hYmxlIE1ldGhvZHNcclxuICBwdWJsaWMgZ2V0Q2VudGVyKCk6IFBvaW50IHtcclxuICAgIHJldHVybiB0aGlzLmNlbnRlcjtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhZGRNYXRyaXgoXHJcbiAgICBnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LFxyXG4gICAgbWF0cml4TG9jYXRpb246IFdlYkdMVW5pZm9ybUxvY2F0aW9uXHJcbiAgKTogdm9pZCB7XHJcbiAgICBjb25zdCBtYXRyaXggPSBUcmFuc2Zvcm1hdGlvbi50cmFuc2Zvcm1hdGlvbk1hdHJpeChcclxuICAgICAgZ2wuY2FudmFzLndpZHRoLFxyXG4gICAgICBnbC5jYW52YXMuaGVpZ2h0LFxyXG4gICAgICB0aGlzLnR4LFxyXG4gICAgICB0aGlzLnR5LFxyXG4gICAgICB0aGlzLmRlZ3JlZSxcclxuICAgICAgdGhpcy5zeCxcclxuICAgICAgdGhpcy5zeSxcclxuICAgICAgdGhpcy5reCxcclxuICAgICAgdGhpcy5reSxcclxuICAgICAgdGhpcy5jZW50ZXJcclxuICAgICkuZmxhdHRlbigpO1xyXG5cclxuICAgIGdsLnVuaWZvcm1NYXRyaXgzZnYobWF0cml4TG9jYXRpb24sIGZhbHNlLCBtYXRyaXgpO1xyXG4gIH1cclxuXHJcbiAgLy8gUmVuZGVyYWJsZSBNZXRob2RzXHJcbiAgcHVibGljIGRyYXdNZXRob2QoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gZ2wuVFJJQU5HTEVfRkFOO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGlzRHJhd2FibGUoKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aCA9PT0gNDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBkcmF3KHAxOiBQb2ludCk6IHZvaWQge1xyXG4gICAgdGhpcy5hcnJheU9mUG9pbnRzWzBdID0gcDE7XHJcbiAgICBjb25zdCBbeENlbnRlciwgeUNlbnRlcl0gPSB0aGlzLmNlbnRlci5nZXRQYWlyKCk7XHJcbiAgICAvLyBmb3IgKGxldCBpID0gMTsgaSA8PSAzOyBpKyspIHtcclxuICAgIC8vICAgICBjb25zdCBhbmdsZSA9IChpICogTWF0aC5QSSkgLyAyO1xyXG4gICAgLy8gICAgIGNvbnN0IHJvdGF0ZWRQb2ludCA9IFRyYW5zZm9ybWF0aW9uLnRyYW5zbGF0aW9uKHRoaXMuY2VudGVyLmdldFgoKSwgdGhpcy5jZW50ZXIuZ2V0WSgpKVxyXG4gICAgLy8gICAgICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24ucm90YXRpb24oYW5nbGUpKVxyXG4gICAgLy8gICAgICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24udHJhbnNsYXRpb24oLXRoaXMuY2VudGVyLmdldFgoKSwgLXRoaXMuY2VudGVyLmdldFkoKSkpXHJcbiAgICAvLyAgICAgICAgIC5tdWx0aXBseVBvaW50KHAxKTtcclxuICAgIC8vICAgICB0aGlzLmFycmF5T2ZQb2ludHNbaV0gPSByb3RhdGVkUG9pbnQ7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgdGhpcy5hcnJheU9mUG9pbnRzWzFdID0gVHJhbnNmb3JtYXRpb24udHJhbnNsYXRpb24oeENlbnRlciwgeUNlbnRlcilcclxuICAgICAgLm11bHRpcGx5TWF0cml4KFRyYW5zZm9ybWF0aW9uLnJvdGF0aW9uKDAuNSAqIE1hdGguUEkpKVxyXG4gICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24udHJhbnNsYXRpb24oLXhDZW50ZXIsIC15Q2VudGVyKSlcclxuICAgICAgLm11bHRpcGx5UG9pbnQodGhpcy5hcnJheU9mUG9pbnRzWzBdKTtcclxuXHJcbiAgICB0aGlzLmFycmF5T2ZQb2ludHNbMl0gPSBUcmFuc2Zvcm1hdGlvbi50cmFuc2xhdGlvbih4Q2VudGVyLCB5Q2VudGVyKVxyXG4gICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24ucm90YXRpb24oTWF0aC5QSSkpXHJcbiAgICAgIC5tdWx0aXBseU1hdHJpeChUcmFuc2Zvcm1hdGlvbi50cmFuc2xhdGlvbigteENlbnRlciwgLXlDZW50ZXIpKVxyXG4gICAgICAubXVsdGlwbHlQb2ludCh0aGlzLmFycmF5T2ZQb2ludHNbMF0pO1xyXG5cclxuICAgIHRoaXMuYXJyYXlPZlBvaW50c1szXSA9IFRyYW5zZm9ybWF0aW9uLnRyYW5zbGF0aW9uKHhDZW50ZXIsIHlDZW50ZXIpXHJcbiAgICAgIC5tdWx0aXBseU1hdHJpeChUcmFuc2Zvcm1hdGlvbi5yb3RhdGlvbigxLjUgKiBNYXRoLlBJKSlcclxuICAgICAgLm11bHRpcGx5TWF0cml4KFRyYW5zZm9ybWF0aW9uLnRyYW5zbGF0aW9uKC14Q2VudGVyLCAteUNlbnRlcikpXHJcbiAgICAgIC5tdWx0aXBseVBvaW50KHRoaXMuYXJyYXlPZlBvaW50c1swXSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZ2V0TnVtYmVyT2ZWZXJ0aWNlc1RvQmVEcmF3bigpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIDU7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYWRkUG9zaXRpb24oZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCk6IHZvaWQge1xyXG4gICAgZ2wuYnVmZmVyRGF0YShcclxuICAgICAgZ2wuQVJSQVlfQlVGRkVSLFxyXG4gICAgICBuZXcgRmxvYXQzMkFycmF5KFtcclxuICAgICAgICAuLi50aGlzLmFycmF5T2ZQb2ludHNbMF0uZ2V0UGFpcigpLFxyXG4gICAgICAgIC4uLnRoaXMuYXJyYXlPZlBvaW50c1sxXS5nZXRQYWlyKCksXHJcbiAgICAgICAgLi4udGhpcy5hcnJheU9mUG9pbnRzWzJdLmdldFBhaXIoKSxcclxuICAgICAgICAuLi50aGlzLmFycmF5T2ZQb2ludHNbM10uZ2V0UGFpcigpLFxyXG4gICAgICAgIC4uLnRoaXMuYXJyYXlPZlBvaW50c1swXS5nZXRQYWlyKCksXHJcbiAgICAgIF0pLFxyXG4gICAgICBnbC5TVEFUSUNfRFJBV1xyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhZGRDb2xvcihnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0KTogdm9pZCB7XHJcbiAgICBnbC5idWZmZXJEYXRhKFxyXG4gICAgICBnbC5BUlJBWV9CVUZGRVIsXHJcbiAgICAgIG5ldyBGbG9hdDMyQXJyYXkoW1xyXG4gICAgICAgIC4uLnRoaXMuYXJyYXlPZlBvaW50c1swXS5nZXRDb2xvcigpLFxyXG4gICAgICAgIC4uLnRoaXMuYXJyYXlPZlBvaW50c1sxXS5nZXRDb2xvcigpLFxyXG4gICAgICAgIC4uLnRoaXMuYXJyYXlPZlBvaW50c1syXS5nZXRDb2xvcigpLFxyXG4gICAgICAgIC4uLnRoaXMuYXJyYXlPZlBvaW50c1szXS5nZXRDb2xvcigpLFxyXG4gICAgICAgIC4uLnRoaXMuYXJyYXlPZlBvaW50c1swXS5nZXRDb2xvcigpLFxyXG4gICAgICBdKSxcclxuICAgICAgZ2wuU1RBVElDX0RSQVdcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc2V0U3F1YXJlQXR0cmlidXRlcyhcclxuICAgIHR4OiBudW1iZXIsXHJcbiAgICB0eTogbnVtYmVyLFxyXG4gICAgZGVncmVlOiBudW1iZXIsXHJcbiAgICBzeDogbnVtYmVyLFxyXG4gICAgc3k6IG51bWJlcixcclxuICAgIGt4OiBudW1iZXIsXHJcbiAgICBreTogbnVtYmVyLFxyXG4gICAgYXJyYXlPZlBvaW50czogUG9pbnRbXVxyXG4gICk6IHZvaWQge1xyXG4gICAgdGhpcy5hcnJheU9mUG9pbnRzID0gYXJyYXlPZlBvaW50cztcclxuICAgIHRoaXMudHggPSB0eDtcclxuICAgIHRoaXMudHkgPSB0eTtcclxuICAgIHRoaXMuZGVncmVlID0gZGVncmVlO1xyXG4gICAgdGhpcy5zeCA9IHN4O1xyXG4gICAgdGhpcy5zeSA9IHN5O1xyXG4gICAgdGhpcy5reCA9IGt4O1xyXG4gICAgdGhpcy5reSA9IGt5O1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgU3F1YXJlO1xyXG4iLCJlbnVtIFR5cGUge1xyXG4gICAgTGluZSxcclxuICAgIFJlY3RhbmdsZSxcclxuICAgIFNxdWFyZSxcclxuICAgIFBvbHlnb25cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVHlwZTsiLCJjbGFzcyBDb29yZGluYXRlIHtcclxuICAgIHB1YmxpYyB4OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgeTogbnVtYmVyO1xyXG4gICAgcHVibGljIHc6IG51bWJlcjtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoeDogbnVtYmVyLCB5OiBudW1iZXIsIHc6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgdGhpcy55ID0geTtcclxuICAgICAgICB0aGlzLncgPSB3O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRDb29yZGluYXRlKCk6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSB7XHJcbiAgICAgICAgcmV0dXJuIFt0aGlzLngsIHRoaXMueSwgdGhpcy53XTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0Q29vcmRpbmF0ZSh4OiBudW1iZXIsIHk6IG51bWJlciwgdzogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICB0aGlzLnkgPSB5O1xyXG4gICAgICAgIHRoaXMudyA9IHc7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldFgoeDogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0WSh5OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnkgPSB5O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRXKHc6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMudyA9IHc7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1YmxpYyBnZXRYKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMueDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0WSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFcoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy53O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBDb29yZGluYXRlOyIsImltcG9ydCBDb29yZGluYXRlIGZyb20gJ0Jhc2UvY29vcmRpbmF0ZSc7XHJcbmltcG9ydCBQb2ludCBmcm9tICdCYXNlL3BvaW50JztcclxuXHJcbmNsYXNzIE1hdHJpeCB7XHJcbiAgICBwdWJsaWMgbTE6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXTtcclxuICAgIHB1YmxpYyBtMjogW251bWJlciwgbnVtYmVyLCBudW1iZXJdO1xyXG4gICAgcHVibGljIG0zOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl07XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKG0xOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl0sIG0yOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl0sIG0zOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl0pIHtcclxuICAgICAgICB0aGlzLm0xID0gbTE7XHJcbiAgICAgICAgdGhpcy5tMiA9IG0yO1xyXG4gICAgICAgIHRoaXMubTMgPSBtMztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZmxhdHRlbigpIDogbnVtYmVyW10ge1xyXG4gICAgICAgIHJldHVybiBbLi4udGhpcy5tMSwgLi4udGhpcy5tMiwgLi4udGhpcy5tM11cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbXVsdGlwbHlNYXRyaXgob3RoZXJNYXRyaXg6IE1hdHJpeCk6IE1hdHJpeCB7XHJcbiAgICAgICAgY29uc3QgW2ExMSwgYTIxLCBhMzFdID0gb3RoZXJNYXRyaXgubTE7XHJcbiAgICAgICAgY29uc3QgW2ExMiwgYTIyLCBhMzJdID0gb3RoZXJNYXRyaXgubTI7XHJcbiAgICAgICAgY29uc3QgW2ExMywgYTIzLCBhMzNdID0gb3RoZXJNYXRyaXgubTM7XHJcblxyXG4gICAgICAgIGNvbnN0IFtiMTEsIGIxMiwgYjEzXSA9IHRoaXMubTE7XHJcbiAgICAgICAgY29uc3QgW2IyMSwgYjIyLCBiMjNdID0gdGhpcy5tMjtcclxuICAgICAgICBjb25zdCBbYjMxLCBiMzIsIGIzM10gPSB0aGlzLm0zO1xyXG5cclxuICAgICAgICBjb25zdCBjMTEgPSBiMTEgKiBhMTEgKyBiMjEgKiBhMjEgKyBiMzEgKiBhMzFcclxuICAgICAgICBjb25zdCBjMTIgPSBiMTEgKiBhMTIgKyBiMjEgKiBhMjIgKyBiMzEgKiBhMzJcclxuICAgICAgICBjb25zdCBjMTMgPSBiMTEgKiBhMTMgKyBiMjEgKiBhMjMgKyBiMzEgKiBhMzNcclxuICAgICAgICBjb25zdCBjMjEgPSBiMTIgKiBhMTEgKyBiMjIgKiBhMjEgKyBiMzIgKiBhMzFcclxuICAgICAgICBjb25zdCBjMjIgPSBiMTIgKiBhMTIgKyBiMjIgKiBhMjIgKyBiMzIgKiBhMzJcclxuICAgICAgICBjb25zdCBjMjMgPSBiMTIgKiBhMTMgKyBiMjIgKiBhMjMgKyBiMzIgKiBhMzNcclxuICAgICAgICBjb25zdCBjMzEgPSBiMTMgKiBhMTEgKyBiMjMgKiBhMjEgKyBiMzMgKiBhMzFcclxuICAgICAgICBjb25zdCBjMzIgPSBiMTMgKiBhMTIgKyBiMjMgKiBhMjIgKyBiMzMgKiBhMzJcclxuICAgICAgICBjb25zdCBjMzMgPSBiMTMgKiBhMTMgKyBiMjMgKiBhMjMgKyBiMzMgKiBhMzNcclxuXHJcbiAgICAgICAgY29uc3QgbWF0cml4ID0gbmV3IE1hdHJpeChbYzExLCBjMjEsIGMzMV0sIFtjMTIsIGMyMiwgYzMyXSwgW2MxMywgYzIzLCBjMzNdKTtcclxuICAgICAgICByZXR1cm4gbWF0cml4O1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBwdWJsaWMgbXVsdGlwbHlQb2ludChwb2ludDogUG9pbnQpOiBQb2ludCB7XHJcbiAgICAgICAgY29uc3QgW2ExMSwgYTIxLCBhMzFdID0gdGhpcy5tMTtcclxuICAgICAgICBjb25zdCBbYTEyLCBhMjIsIGEzMl0gPSB0aGlzLm0yO1xyXG4gICAgICAgIGNvbnN0IFthMTMsIGEyMywgYTMzXSA9IHRoaXMubTM7XHJcblxyXG4gICAgICAgIGNvbnN0IHgxID0gYTExICogcG9pbnQueCArIGExMiAqIHBvaW50LnkgKyBhMTMgKiBwb2ludC53O1xyXG4gICAgICAgIGNvbnN0IHkxID0gYTIxICogcG9pbnQueCArIGEyMiAqIHBvaW50LnkgKyBhMjMgKiBwb2ludC53O1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IG5ld1BvaW50ID0gbmV3IFBvaW50KFt4MSwgeTFdKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ld1BvaW50O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBNYXRyaXg7IiwiaW1wb3J0IENvb3JkaW5hdGUgZnJvbSBcIi4vY29vcmRpbmF0ZVwiO1xyXG5cclxuY2xhc3MgUG9pbnQgIGV4dGVuZHMgQ29vcmRpbmF0ZSB7XHJcbiAgICBwdWJsaWMgcjogbnVtYmVyO1xyXG4gICAgcHVibGljIGc6IG51bWJlcjtcclxuICAgIHB1YmxpYyBiOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgYTogbnVtYmVyO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcihwb3NpdGlvbjogW251bWJlciwgbnVtYmVyXSwgY29sb3I6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdID0gWzAsIDAsIDAsIDFdKSB7XHJcbiAgICAgICAgc3VwZXIoLi4ucG9zaXRpb24sIDEpO1xyXG5cclxuICAgICAgICBbdGhpcy5yLCB0aGlzLmcsIHRoaXMuYiwgdGhpcy5hXSA9IGNvbG9yO1xyXG5cclxuICAgICAgICBjb25zdCBbciwgZywgYiwgYV0gPSBjb2xvcjtcclxuICAgICAgICB0aGlzLnIgPSByO1xyXG4gICAgICAgIHRoaXMuZyA9IGc7XHJcbiAgICAgICAgdGhpcy5iID0gYjtcclxuICAgICAgICB0aGlzLmEgPSBhO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRQYWlyKCk6IFtudW1iZXIsIG51bWJlcl0ge1xyXG4gICAgICAgIHJldHVybiBbdGhpcy54LCB0aGlzLnldO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRDb2xvcigpOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSB7XHJcbiAgICAgICAgcmV0dXJuIFt0aGlzLnIsIHRoaXMuZywgdGhpcy5iLCB0aGlzLmFdO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRDb2xvcihjb2xvcjogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0pOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBbciwgZywgYiwgYV0gPSBjb2xvcjtcclxuICAgICAgICB0aGlzLnIgPSByO1xyXG4gICAgICAgIHRoaXMuZyA9IGc7XHJcbiAgICAgICAgdGhpcy5iID0gYjtcclxuICAgICAgICB0aGlzLmEgPSBhO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBQb2ludDsiLCJpbXBvcnQgeyBsb2FkU2hhZGVyIH0gZnJvbSBcIi4vbG9hZC1zaGFkZXJcIjtcclxuXHJcbi8vXHJcbi8vIEluaXRpYWxpemUgYSBzaGFkZXIgcHJvZ3JhbSwgc28gV2ViR0wga25vd3MgaG93IHRvIGRyYXcgb3VyIGRhdGFcclxuLy9cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVNoYWRlclByb2dyYW0oZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCwgdnNTb3VyY2U6IHN0cmluZywgZnNTb3VyY2U6IHN0cmluZykge1xyXG4gICAgY29uc3QgdmVydGV4U2hhZGVyID0gbG9hZFNoYWRlcihnbCwgZ2wuVkVSVEVYX1NIQURFUiwgdnNTb3VyY2UpO1xyXG4gICAgY29uc3QgZnJhZ21lbnRTaGFkZXIgPSBsb2FkU2hhZGVyKGdsLCBnbC5GUkFHTUVOVF9TSEFERVIsIGZzU291cmNlKTtcclxuICBcclxuICAgIC8vIENyZWF0ZSB0aGUgc2hhZGVyIHByb2dyYW1cclxuICAgIGNvbnN0IHNoYWRlclByb2dyYW0gPSBnbC5jcmVhdGVQcm9ncmFtKCk7XHJcbiAgICBnbC5hdHRhY2hTaGFkZXIoc2hhZGVyUHJvZ3JhbSwgdmVydGV4U2hhZGVyKTtcclxuICAgIGdsLmF0dGFjaFNoYWRlcihzaGFkZXJQcm9ncmFtLCBmcmFnbWVudFNoYWRlcik7XHJcbiAgICBnbC5saW5rUHJvZ3JhbShzaGFkZXJQcm9ncmFtKTtcclxuICBcclxuICAgIC8vIElmIGNyZWF0aW5nIHRoZSBzaGFkZXIgcHJvZ3JhbSBmYWlsZWQsIGFsZXJ0XHJcbiAgXHJcbiAgICBpZiAoIWdsLmdldFByb2dyYW1QYXJhbWV0ZXIoc2hhZGVyUHJvZ3JhbSwgZ2wuTElOS19TVEFUVVMpKSB7XHJcbiAgICAgIGFsZXJ0KFxyXG4gICAgICAgIGBVbmFibGUgdG8gaW5pdGlhbGl6ZSB0aGUgc2hhZGVyIHByb2dyYW06ICR7Z2wuZ2V0UHJvZ3JhbUluZm9Mb2coXHJcbiAgICAgICAgICBzaGFkZXJQcm9ncmFtLFxyXG4gICAgICAgICl9YCxcclxuICAgICAgKTtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gc2hhZGVyUHJvZ3JhbTtcclxuICB9IiwiICAvL1xyXG4gIC8vIGNyZWF0ZXMgYSBzaGFkZXIgb2YgdGhlIGdpdmVuIHR5cGUsIHVwbG9hZHMgdGhlIHNvdXJjZSBhbmRcclxuICAvLyBjb21waWxlcyBpdC5cclxuICAvL1xyXG5leHBvcnQgZnVuY3Rpb24gbG9hZFNoYWRlcihnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LCB0eXBlOiBudW1iZXIsIHNvdXJjZTogc3RyaW5nKTogV2ViR0xTaGFkZXIge1xyXG4gICAgY29uc3Qgc2hhZGVyID0gZ2wuY3JlYXRlU2hhZGVyKHR5cGUpO1xyXG4gIFxyXG4gICAgLy8gU2VuZCB0aGUgc291cmNlIHRvIHRoZSBzaGFkZXIgb2JqZWN0XHJcbiAgICBnbC5zaGFkZXJTb3VyY2Uoc2hhZGVyLCBzb3VyY2UpO1xyXG4gIFxyXG4gICAgLy8gQ29tcGlsZSB0aGUgc2hhZGVyIHByb2dyYW1cclxuICAgIGdsLmNvbXBpbGVTaGFkZXIoc2hhZGVyKTtcclxuICBcclxuICAgIC8vIFNlZSBpZiBpdCBjb21waWxlZCBzdWNjZXNzZnVsbHlcclxuICAgIGlmICghZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKHNoYWRlciwgZ2wuQ09NUElMRV9TVEFUVVMpKSB7XHJcbiAgICAgIGFsZXJ0KGBBbiBlcnJvciBvY2N1cnJlZCBjb21waWxpbmcgdGhlIHNoYWRlcnM6ICR7Z2wuZ2V0U2hhZGVySW5mb0xvZyhzaGFkZXIpfWAsKTtcclxuICAgICAgZ2wuZGVsZXRlU2hhZGVyKHNoYWRlcik7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHNoYWRlcjtcclxufSIsImltcG9ydCBTaGFwZSBmcm9tIFwiTWFpbi8yRC1TaGFwZXMvc2hhcGVcIjtcclxuaW1wb3J0IHsgcmVuZGVyIH0gZnJvbSBcIi4vcmVuZGVyXCI7XHJcbmltcG9ydCBQcm9ncmFtSW5mbyBmcm9tIFwiLi9wcm9ncmFtLWluZm8uaW50ZXJmYWNlXCI7XHJcbmltcG9ydCBSZW5kZXJhYmxlIGZyb20gXCJNYWluLzJELVNoYXBlcy9JbnRlcmZhY2VzL3JlbmRlcmFibGUuaW50ZXJmYWNlXCI7XHJcbmltcG9ydCBUcmFuc2Zvcm1hYmxlIGZyb20gXCJNYWluLzJELVNoYXBlcy9JbnRlcmZhY2VzL3RyYW5zZm9ybWFibGUuaW50ZXJmYWNlXCI7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyQWxsKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsIHByb2dyYW1JbmZvOiBQcm9ncmFtSW5mbywgc2hhcGVzOiAoUmVuZGVyYWJsZSZUcmFuc2Zvcm1hYmxlKVtdLCBwb3NpdGlvbkJ1ZmZlcjogV2ViR0xCdWZmZXIsIGNvbG9yQnVmZmVyOiBXZWJHTEJ1ZmZlcik6IHZvaWQge1xyXG4gICAgZ2wuY2xlYXIoZ2wuQ09MT1JfQlVGRkVSX0JJVCk7XHJcbiAgXHJcbiAgICBmb3IgKGNvbnN0IHNoYXBlIG9mIHNoYXBlcykge1xyXG4gICAgICByZW5kZXIoZ2wsIHByb2dyYW1JbmZvLCBzaGFwZSwgcG9zaXRpb25CdWZmZXIsIGNvbG9yQnVmZmVyKVxyXG4gICAgfVxyXG59OyIsImltcG9ydCBSZW5kZXJhYmxlIGZyb20gXCJNYWluLzJELVNoYXBlcy9JbnRlcmZhY2VzL3JlbmRlcmFibGUuaW50ZXJmYWNlXCI7XHJcbmltcG9ydCBQcm9ncmFtSW5mbyBmcm9tIFwiLi9wcm9ncmFtLWluZm8uaW50ZXJmYWNlXCI7XHJcbmltcG9ydCBUcmFuc2Zvcm1hYmxlIGZyb20gXCJNYWluLzJELVNoYXBlcy9JbnRlcmZhY2VzL3RyYW5zZm9ybWFibGUuaW50ZXJmYWNlXCI7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsIHByb2dyYW1JbmZvOiBQcm9ncmFtSW5mbywgb2JqZWN0OiBSZW5kZXJhYmxlICYgVHJhbnNmb3JtYWJsZSwgcG9zaXRpb25CdWZmZXI6IFdlYkdMQnVmZmVyLCBjb2xvckJ1ZmZlcjogV2ViR0xCdWZmZXIpOiB2b2lkIHtcclxuICAgIGlmICghb2JqZWN0LmlzRHJhd2FibGUoKSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICAvLyBBZGQgUG9zaXRpb24gdG8gZ2wgYnVmZmVyXHJcbiAgICAvLyBjb25zb2xlLmxvZyhcImtvbnRvbG9kb24zXCIpO1xyXG4gICAgZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkocHJvZ3JhbUluZm8uYXR0cmliTG9jYXRpb25zLnZlcnRleFBvc2l0aW9uKTtcclxuICAgIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBwb3NpdGlvbkJ1ZmZlcik7XHJcbiAgICBvYmplY3QuYWRkUG9zaXRpb24oZ2wpO1xyXG4gICAgY29uc3QgbnVtQ29tcG9uZW50cyA9IDI7IC8vIHB1bGwgb3V0IDIgdmFsdWVzIHBlciBpdGVyYXRpb25cclxuICAgIGNvbnN0IHR5cGUgPSBnbC5GTE9BVDsgLy8gdGhlIGRhdGEgaW4gdGhlIGJ1ZmZlciBpcyAzMmJpdCBmbG9hdHNcclxuICAgIGNvbnN0IG5vcm1hbGl6ZSA9IGZhbHNlOyAvLyBkb24ndCBub3JtYWxpemVcclxuICAgIGNvbnN0IHN0cmlkZSA9IDA7IC8vIGhvdyBtYW55IGJ5dGVzIHRvIGdldCBmcm9tIG9uZSBzZXQgb2YgdmFsdWVzIHRvIHRoZSBuZXh0XHJcbiAgICAvLyAwID0gdXNlIHR5cGUgYW5kIG51bUNvbXBvbmVudHMgYWJvdmVcclxuICAgIGNvbnN0IG9mZnNldCA9IDA7IC8vIGhvdyBtYW55IGJ5dGVzIGluc2lkZSB0aGUgYnVmZmVyIHRvIHN0YXJ0IGZyb21cclxuICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIoXHJcbiAgICAgIHByb2dyYW1JbmZvLmF0dHJpYkxvY2F0aW9ucy52ZXJ0ZXhQb3NpdGlvbixcclxuICAgICAgbnVtQ29tcG9uZW50cyxcclxuICAgICAgdHlwZSxcclxuICAgICAgbm9ybWFsaXplLFxyXG4gICAgICBzdHJpZGUsXHJcbiAgICAgIG9mZnNldCxcclxuICAgICk7XHJcblxyXG4gICAgXHJcbiAgICBnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheShwcm9ncmFtSW5mby5hdHRyaWJMb2NhdGlvbnMudmVydGV4Q29sb3IpO1xyXG4gICAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIGNvbG9yQnVmZmVyKTtcclxuICAgIG9iamVjdC5hZGRDb2xvcihnbCk7XHJcbiAgICBjb25zdCBjb2xvclNpemUgPSA0OyAvKiA0IGNvbXBvbmVudHMgcGVyIGl0ZXJhdGlvbiAqL1xyXG4gICAgY29uc3QgY29sb3JUeXBlID0gZ2wuRkxPQVQ7IC8qIFRoZSBkYXRhIGlzIDMyIGJpdCBmbG9hdCAqL1xyXG4gICAgY29uc3QgY29sb3JOb3JtYWxpemVkID0gZmFsc2U7IC8qIERvbid0IG5vcm1hbGl6ZSB0aGUgZGF0YSAqL1xyXG4gICAgY29uc3QgY29sb3JTdHJpZGUgPSAwOyAvKiAwOiBNb3ZlIGZvcndhcmQgc2l6ZSAqIHNpemVvZih0eXBlKSBlYWNoIGl0ZXJhdGlvbiB0byBnZXQgdGhlIG5leHQgcG9zaXRpb24gKi9cclxuICAgIGNvbnN0IGNvbG9yT2Zmc2V0ID0gMDsgLyogU3RhcnQgYXQgdGhlIGJlZ2lubmluZyBvZiB0aGUgYnVmZmVyICovXHJcbiAgICBnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKFxyXG4gICAgICBwcm9ncmFtSW5mby5hdHRyaWJMb2NhdGlvbnMudmVydGV4Q29sb3IsXHJcbiAgICAgIGNvbG9yU2l6ZSxcclxuICAgICAgY29sb3JUeXBlLFxyXG4gICAgICBjb2xvck5vcm1hbGl6ZWQsXHJcbiAgICAgIGNvbG9yU3RyaWRlLFxyXG4gICAgICBjb2xvck9mZnNldFxyXG4gICAgKTtcclxuICAgIFxyXG4gICAgXHJcbiAgICAvLyBBZGQgTWF0cml4IHRvIGdsXHJcbiAgICBjb25zdCBtYXRyaXhMb2NhdGlvbiA9IHByb2dyYW1JbmZvLnVuaWZvcm1Mb2NhdGlvbnMubWF0cml4TG9jYXRpb25cclxuICAgIG9iamVjdC5hZGRNYXRyaXgoZ2wsIG1hdHJpeExvY2F0aW9uKTtcclxuICAgIC8qIERyYXcgc2NlbmUgKi9cclxuICAgIGNvbnN0IHByaW1pdGl2ZVR5cGUgPSBvYmplY3QuZHJhd01ldGhvZChnbCk7XHJcbiAgICAvLyBjb25zdCBvZmZzZXQgPSAwO1xyXG4gICAgY29uc3QgbnVtYmVyT2ZWZXJ0aWNlc1RvQmVEcmF3biA9IG9iamVjdC5nZXROdW1iZXJPZlZlcnRpY2VzVG9CZURyYXduKCk7XHJcbiAgICAvLyBjb25zb2xlLmxvZyhcImtvbnRvbG9kb241XCIpO1xyXG4gICAgZ2wuZHJhd0FycmF5cyhwcmltaXRpdmVUeXBlLCBvZmZzZXQsIG51bWJlck9mVmVydGljZXNUb0JlRHJhd24pO1xyXG59IiwiaW1wb3J0IE1hdHJpeCBmcm9tIFwiTWFpbi9CYXNlL21hdHJpeFwiO1xyXG5pbXBvcnQgUG9pbnQgZnJvbSBcIk1haW4vQmFzZS9wb2ludFwiO1xyXG5cclxuXHJcbmNsYXNzIFRyYW5zZm9ybWF0aW9ue1xyXG4gICAgcHVibGljIHN0YXRpYyBwcm9qZWN0aW9uKHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyKTogTWF0cml4IHtcclxuICAgICAgICBjb25zdCBtYXRyaXggPSBuZXcgTWF0cml4KFsyL3dpZHRoLCAwLCAwXSwgWzAsIC0yL2hlaWdodCwgMF0sIFstMSwgMSwgMV0pO1xyXG4gICAgICAgIHJldHVybiBtYXRyaXg7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc3RhdGljIHRyYW5zbGF0aW9uKHR4OiBudW1iZXIsIHR5OiBudW1iZXIpOiBNYXRyaXgge1xyXG4gICAgICAgIGNvbnN0IG1hdHJpeCA9IG5ldyBNYXRyaXgoWzEsMCwwXSwgWzAsIDEsIDBdLCBbdHgsIHR5LCAxXSk7XHJcbiAgICAgICAgcmV0dXJuIG1hdHJpeDtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzdGF0aWMgcm90YXRpb24oZGVncmVlOiBudW1iZXIpOiBNYXRyaXgge1xyXG4gICAgICAgIGNvbnN0IG1hdHJpeCA9IG5ldyBNYXRyaXgoW01hdGguY29zKGRlZ3JlZSksIE1hdGguc2luKGRlZ3JlZSksIDBdLCBbLU1hdGguc2luKGRlZ3JlZSksIE1hdGguY29zKGRlZ3JlZSksIDBdLCBbMCwgMCwgMV0pO1xyXG4gICAgICAgIHJldHVybiBtYXRyaXg7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc3RhdGljIHNjYWxlKHN4OiBudW1iZXIsIHN5OiBudW1iZXIpOiBNYXRyaXgge1xyXG4gICAgICAgIGNvbnN0IG1hdHJpeCA9IG5ldyBNYXRyaXgoW3N4LDAsMF0sIFswLCBzeSwgMF0sIFswLCAwLCAxXSk7XHJcbiAgICAgICAgcmV0dXJuIG1hdHJpeFxyXG4gICAgfVxyXG4gICAgcHVibGljIHN0YXRpYyBzaGVhclgoa3g6IG51bWJlcik6IE1hdHJpeCB7XHJcbiAgICAgICAgY29uc3QgbWF0cml4ID0gbmV3IE1hdHJpeChbMSwgMCwgMF0sIFtreCwgMSwgMF0sIFswLCAwLCAxXSk7XHJcbiAgICAgICAgcmV0dXJuIG1hdHJpeDtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzdGF0aWMgc2hlYXJZKGt5OiBudW1iZXIpOiBNYXRyaXgge1xyXG4gICAgICAgIGNvbnN0IG1hdHJpeCA9IG5ldyBNYXRyaXgoWzEsIGt5LCAwXSwgWzAsIDEsIDBdLCBbMCwgMCwgMV0pO1xyXG4gICAgICAgIHJldHVybiBtYXRyaXg7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc3RhdGljIHRyYW5zZm9ybWF0aW9uTWF0cml4KFxyXG4gICAgICAgIHdpZHRoOiBudW1iZXIsXHJcbiAgICAgICAgaGVpZ2h0OiBudW1iZXIsXHJcbiAgICAgICAgdHg6IG51bWJlcixcclxuICAgICAgICB0eTogbnVtYmVyLFxyXG4gICAgICAgIGRlZ3JlZTogbnVtYmVyLFxyXG4gICAgICAgIHN4OiBudW1iZXIsXHJcbiAgICAgICAgc3k6IG51bWJlcixcclxuICAgICAgICBreDogbnVtYmVyLFxyXG4gICAgICAgIGt5OiBudW1iZXIsXHJcbiAgICAgICAgY2VudGVyOiBQb2ludFxyXG4gICAgKSA6IE1hdHJpeCB7XHJcbiAgICAgICAgcmV0dXJuIFRyYW5zZm9ybWF0aW9uLnByb2plY3Rpb24od2lkdGgsIGhlaWdodClcclxuICAgICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24udHJhbnNsYXRpb24odHgsIHR5KSlcclxuICAgICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24udHJhbnNsYXRpb24oY2VudGVyLmdldFgoKSwgY2VudGVyLmdldFkoKSkpXHJcbiAgICAgICAgLm11bHRpcGx5TWF0cml4KFRyYW5zZm9ybWF0aW9uLnJvdGF0aW9uKGRlZ3JlZSkpXHJcbiAgICAgICAgLm11bHRpcGx5TWF0cml4KFRyYW5zZm9ybWF0aW9uLnNjYWxlKHN4LCBzeSkpXHJcbiAgICAgICAgLm11bHRpcGx5TWF0cml4KFRyYW5zZm9ybWF0aW9uLnNoZWFyWChreCkpXHJcbiAgICAgICAgLm11bHRpcGx5TWF0cml4KFRyYW5zZm9ybWF0aW9uLnNoZWFyWShreSkpXHJcbiAgICAgICAgLm11bHRpcGx5TWF0cml4KFRyYW5zZm9ybWF0aW9uLnRyYW5zbGF0aW9uKC1jZW50ZXIuZ2V0WCgpLCAtY2VudGVyLmdldFkoKSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgaW52ZXJzZVRyYW5zZm9ybWF0aW9uTWF0cml4KFxyXG4gICAgICAgIHdpZHRoOiBudW1iZXIsXHJcbiAgICAgICAgaGVpZ2h0OiBudW1iZXIsXHJcbiAgICAgICAgdHg6IG51bWJlcixcclxuICAgICAgICB0eTogbnVtYmVyLFxyXG4gICAgICAgIGRlZ3JlZTogbnVtYmVyLFxyXG4gICAgICAgIHN4OiBudW1iZXIsXHJcbiAgICAgICAgc3k6IG51bWJlcixcclxuICAgICAgICBreDogbnVtYmVyLFxyXG4gICAgICAgIGt5OiBudW1iZXIsXHJcbiAgICAgICAgY2VudGVyOiBQb2ludFxyXG4gICAgKSA6IE1hdHJpeCB7XHJcbiAgICAgICAgcmV0dXJuIFRyYW5zZm9ybWF0aW9uLnRyYW5zbGF0aW9uKGNlbnRlci5nZXRYKCksIGNlbnRlci5nZXRZKCkpXHJcbiAgICAgICAgLm11bHRpcGx5TWF0cml4KFRyYW5zZm9ybWF0aW9uLnNoZWFyWSgta3kpKVxyXG4gICAgICAgIC5tdWx0aXBseU1hdHJpeChUcmFuc2Zvcm1hdGlvbi5zaGVhclgoLWt4KSlcclxuICAgICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24uc2NhbGUoMSAvIHN4LCAxIC8gc3kpKVxyXG4gICAgICAgIC5tdWx0aXBseU1hdHJpeChUcmFuc2Zvcm1hdGlvbi5yb3RhdGlvbigtZGVncmVlKSlcclxuICAgICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24udHJhbnNsYXRpb24oLWNlbnRlci5nZXRYKCksIC1jZW50ZXIuZ2V0WSgpKSlcclxuICAgICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24udHJhbnNsYXRpb24oLXR4LCAtdHkpKVxyXG4gICAgICAgIC8vIC5tdWx0aXBseU1hdHJpeChUcmFuc2Zvcm1hdGlvbi5wcm9qZWN0aW9uKDEgLyB3aWR0aCwgMSAvIGhlaWdodCkpO1xyXG4gICAgfVxyXG5cclxufVxyXG5leHBvcnQgZGVmYXVsdCBUcmFuc2Zvcm1hdGlvbjsiLCJpbXBvcnQgUG9pbnQgZnJvbSBcIk1haW4vQmFzZS9wb2ludFwiXHJcblxyXG5mdW5jdGlvbiBvcmllbnRhdGlvbihwOiBQb2ludCwgcTogUG9pbnQsIHI6IFBvaW50KTogbnVtYmVyIHtcclxuICAgIGNvbnN0IHZhbCA9IChxLnkgLSBwLnkpICogKHIueCAtIHEueCkgLSAocS54IC0gcC54KSAqIChyLnkgLSBxLnkpO1xyXG5cclxuICAgIGlmICh2YWwgPT09IDApIHJldHVybiAwO1xyXG5cclxuICAgIHJldHVybiB2YWwgPiAwID8gMSA6IDI7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNvbnZleEh1bGwocG9pbnRzOiBQb2ludFtdKTogUG9pbnRbXSB7XHJcbiAgICBjb25zdCBuID0gcG9pbnRzLmxlbmd0aDtcclxuICAgIGlmIChuIDwgMykgcmV0dXJuIFtdO1xyXG5cclxuICAgIGNvbnN0IGh1bGw6IFBvaW50W10gPSBbXTtcclxuICAgIGxldCBsID0gMDtcclxuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgaWYgKHBvaW50c1tpXS54IDwgcG9pbnRzW2xdLngpIHtcclxuICAgICAgICAgICAgbCA9IGk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGxldCBwID0gbDtcclxuICAgIGxldCBxOiBudW1iZXI7XHJcbiAgICBkbyB7XHJcbiAgICAgICAgaHVsbC5wdXNoKHBvaW50c1twXSk7XHJcbiAgICAgICAgcSA9IChwICsgMSkgJSBuO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChvcmllbnRhdGlvbihwb2ludHNbcF0sIHBvaW50c1tpXSwgcG9pbnRzW3FdKSA9PT0gMikge1xyXG4gICAgICAgICAgICAgICAgcSA9IGk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcCA9IHE7XHJcbiAgICB9IHdoaWxlIChwICE9PSBsKTtcclxuXHJcbiAgICByZXR1cm4gaHVsbDtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY29udmV4SHVsbDtcclxuXHJcbiIsImZ1bmN0aW9uIGNvbXBvbmVudFRvSGV4KGM6IG51bWJlcikge1xyXG4gICAgdmFyIGhleCA9IGMudG9TdHJpbmcoMTYpO1xyXG4gICAgcmV0dXJuIGhleC5sZW5ndGggPT09IDEgPyBgMCR7aGV4fWAgOiBoZXg7XHJcbn1cclxuICBcclxuZnVuY3Rpb24gcmdiVG9IZXgocmdiYTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0pOiBzdHJpbmcge1xyXG4gICAgY29uc3QgW3IsIGcsIGJdID0gcmdiYTtcclxuICBcclxuICAgIHJldHVybiBgIyR7Y29tcG9uZW50VG9IZXgocil9JHtjb21wb25lbnRUb0hleChnKX0ke2NvbXBvbmVudFRvSGV4KGIpfWA7XHJcbn1cclxuICBcclxuZnVuY3Rpb24gaGV4VG9SZ2IoaGV4OiBzdHJpbmcpOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSB7XHJcbiAgICBjb25zdCByID0gcGFyc2VJbnQoaGV4LnNsaWNlKDEsIDMpLCAxNik7XHJcbiAgICBjb25zdCBnID0gcGFyc2VJbnQoaGV4LnNsaWNlKDMsIDUpLCAxNik7XHJcbiAgICBjb25zdCBiID0gcGFyc2VJbnQoaGV4LnNsaWNlKDUsIDcpLCAxNik7XHJcbiAgXHJcbiAgICByZXR1cm4gW3IgLyAyNTUsIGcgLyAyNTUsIGIgLyAyNTUsIDFdO1xyXG59XHJcbiAgXHJcbmV4cG9ydCB7IHJnYlRvSGV4LCBoZXhUb1JnYiB9O1xyXG4gICIsImltcG9ydCBSZW5kZXJhYmxlIGZyb20gXCIuLzJELVNoYXBlcy9JbnRlcmZhY2VzL3JlbmRlcmFibGUuaW50ZXJmYWNlXCI7XHJcbmltcG9ydCBUcmFuc2Zvcm1hYmxlIGZyb20gXCIuLzJELVNoYXBlcy9JbnRlcmZhY2VzL3RyYW5zZm9ybWFibGUuaW50ZXJmYWNlXCI7XHJcbmltcG9ydCBTaGFwZSBmcm9tIFwiLi8yRC1TaGFwZXMvc2hhcGVcIjtcclxuaW1wb3J0IExpbmUgZnJvbSBcIi4vMkQtU2hhcGVzL2xpbmVcIjtcclxuaW1wb3J0IFNxdWFyZSBmcm9tIFwiLi8yRC1TaGFwZXMvc3F1YXJlXCI7XHJcbmltcG9ydCBSZWN0YW5nbGUgZnJvbSBcIi4vMkQtU2hhcGVzL3JlY3RhbmdsZVwiO1xyXG5pbXBvcnQgUG9pbnQgZnJvbSBcIi4vQmFzZS9wb2ludFwiO1xyXG5pbXBvcnQgUG9seWdvbiBmcm9tIFwiLi8yRC1TaGFwZXMvcG9seWdvblwiO1xyXG5pbXBvcnQgVHlwZSBmcm9tIFwiLi8yRC1TaGFwZXMvdHlwZS5lbnVtXCI7XHJcbmltcG9ydCB7IGNyZWF0ZVNoYWRlclByb2dyYW0gfSBmcm9tIFwiLi9GdW5jdGlvbnMvY3JlYXRlLXNoYWRlci1wcm9ncmFtXCI7XHJcbmltcG9ydCBQcm9ncmFtSW5mbyBmcm9tIFwiLi9GdW5jdGlvbnMvcHJvZ3JhbS1pbmZvLmludGVyZmFjZVwiO1xyXG5pbXBvcnQgeyBzZXRBdHRyaWJ1dGVzIH0gZnJvbSBcIi4vRnVuY3Rpb25zL3NldC1hdHRyaWJ1dGVzXCI7XHJcbmltcG9ydCB7IHNldHVwQ2FudmFzIH0gZnJvbSBcIi4vRnVuY3Rpb25zL3NldHVwLWNhbnZhc1wiO1xyXG5pbXBvcnQgVHJhbnNmb3JtYXRpb24gZnJvbSBcIi4vT3BlcmF0aW9ucy9UcmFuc2Zvcm1hdGlvblwiO1xyXG5pbXBvcnQgeyBoZXhUb1JnYiwgcmdiVG9IZXggfSBmcm9tIFwiLi9VdGlscy90b29sc1wiO1xyXG5pbXBvcnQgeyByZW5kZXIgfSBmcm9tIFwiLi9GdW5jdGlvbnMvcmVuZGVyXCI7XHJcbmltcG9ydCB7IHJlbmRlckFsbCB9IGZyb20gXCIuL0Z1bmN0aW9ucy9yZW5kZXItYWxsXCI7XHJcblxyXG4vLyBjb25zdCBnbCA9IHNldHVwQ2FudmFzKClcclxuY29uc3QgY2FudmFzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjYW52YXNcIikgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XHJcbi8vIEluaXRpYWxpemUgdGhlIEdMIGNvbnRleHRcclxuY29uc3QgZ2wgPSBjYW52YXMuZ2V0Q29udGV4dChcIndlYmdsXCIpO1xyXG5cclxuLy8gT25seSBjb250aW51ZSBpZiBXZWJHTCBpcyBhdmFpbGFibGUgYW5kIHdvcmtpbmdcclxuaWYgKGdsID09PSBudWxsKSB7XHJcbiAgYWxlcnQoXHJcbiAgICBcIlVuYWJsZSB0byBpbml0aWFsaXplIFdlYkdMLiBZb3VyIGJyb3dzZXIgb3IgbWFjaGluZSBtYXkgbm90IHN1cHBvcnQgaXQuXCJcclxuICApO1xyXG59XHJcblxyXG5cclxuLy8gVmVydGV4IHNoYWRlciBwcm9ncmFtXHJcbmNvbnN0IHZzU291cmNlID0gYFxyXG4gICAgYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1xyXG4gICAgYXR0cmlidXRlIHZlYzQgYVZlcnRleENvbG9yO1xyXG4gICAgdW5pZm9ybSBtYXQzIHVNYXRyaXg7XHJcbiAgICB2YXJ5aW5nIHZlYzQgdkNvbG9yO1xyXG5cclxuICAgIHZvaWQgbWFpbigpIHtcclxuICAgICAgICAvLyBub3RlOiBZIGF4aXMgbXVzdCBiZSBpbnZlcnRlZCB0byByZXBsaWNhdGUgdHJhZGl0aW9uYWwgdmlld1xyXG4gICAgICAgIGdsX1Bvc2l0aW9uID0gdmVjNCgodU1hdHJpeCAqIHZlYzMoYVZlcnRleFBvc2l0aW9uLCAxKSkueHksIDAsIDEpO1xyXG5cclxuICAgICAgICAvLyBDaGFuZ2UgY29sb3Igb2Ygc2hhcGVcclxuICAgICAgICB2Q29sb3IgPSBhVmVydGV4Q29sb3I7XHJcbiAgICB9XHJcbmA7XHJcblxyXG5jb25zdCBmc1NvdXJjZSA9IGBcclxuICAgIHByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xyXG4gICAgdmFyeWluZyB2ZWM0IHZDb2xvcjtcclxuXHJcbiAgICB2b2lkIG1haW4oKSB7XHJcbiAgICAgICAgZ2xfRnJhZ0NvbG9yID0gdkNvbG9yO1xyXG4gICAgfVxyXG5gO1xyXG5jb25zdCBzaGFkZXJQcm9ncmFtID0gY3JlYXRlU2hhZGVyUHJvZ3JhbShnbCwgdnNTb3VyY2UsIGZzU291cmNlKTtcclxuXHJcbi8vIENvbGxlY3QgYWxsIHRoZSBpbmZvIG5lZWRlZCB0byB1c2UgdGhlIHNoYWRlciBwcm9ncmFtLlxyXG4vLyBMb29rIHVwIHdoaWNoIGF0dHJpYnV0ZSBvdXIgc2hhZGVyIHByb2dyYW0gaXMgdXNpbmdcclxuLy8gZm9yIGFWZXJ0ZXhQb3NpdGlvbiBhbmQgbG9vayB1cCB1bmlmb3JtIGxvY2F0aW9ucy5cclxuY29uc3QgcHJvZ3JhbUluZm8gPSB7XHJcbiAgcHJvZ3JhbTogc2hhZGVyUHJvZ3JhbSxcclxuICBhdHRyaWJMb2NhdGlvbnM6IHtcclxuICAgIHZlcnRleFBvc2l0aW9uOiBnbC5nZXRBdHRyaWJMb2NhdGlvbihzaGFkZXJQcm9ncmFtLCBcImFWZXJ0ZXhQb3NpdGlvblwiKSxcclxuICAgIHZlcnRleENvbG9yOiBnbC5nZXRBdHRyaWJMb2NhdGlvbihzaGFkZXJQcm9ncmFtLCBcImFWZXJ0ZXhDb2xvclwiKSxcclxuICB9LFxyXG4gIHVuaWZvcm1Mb2NhdGlvbnM6IHtcclxuICAgIG1hdHJpeExvY2F0aW9uOiBnbC5nZXRVbmlmb3JtTG9jYXRpb24oc2hhZGVyUHJvZ3JhbSwgXCJ1TWF0cml4XCIpLFxyXG4gIH0sXHJcbn07XHJcblxyXG4vLyBUZWxsIFdlYkdMIHRvIHVzZSBvdXIgcHJvZ3JhbSB3aGVuIGRyYXdpbmdcclxuZ2wudXNlUHJvZ3JhbShzaGFkZXJQcm9ncmFtKTtcclxuXHJcbmNvbnN0IHdpZHRoID0gKGdsLmNhbnZhcyBhcyBIVE1MQ2FudmFzRWxlbWVudCkuY2xpZW50V2lkdGg7XHJcbmNvbnN0IGhlaWdodCA9IChnbC5jYW52YXMgYXMgSFRNTENhbnZhc0VsZW1lbnQpLmNsaWVudEhlaWdodDtcclxuY2FudmFzLndpZHRoID0gd2lkdGg7XHJcbmNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbi8vIFNldCBjbGVhciBjb2xvciB0byBibGFjaywgZnVsbHkgb3BhcXVlXHJcbmdsLmNsZWFyQ29sb3IoMS4wLCAxLjAsIDEuMCwgMS4wKTtcclxuLy8gQ2xlYXIgdGhlIGNvbG9yIGJ1ZmZlciB3aXRoIHNwZWNpZmllZCBjbGVhciBjb2xvclxyXG5cclxuXHJcbmdsLnZpZXdwb3J0KDAsIDAsIGdsLmNhbnZhcy53aWR0aCwgZ2wuY2FudmFzLmhlaWdodCk7IC8vIHNldHMgdGhlIHZpZXdwb3J0IHRvIGNvdmVyIHRoZSBlbnRpcmUgY2FudmFzLCBzdGFydGluZyBmcm9tIHRoZSBsb3dlci1sZWZ0IGNvcm5lciBhbmQgZXh0ZW5kaW5nIHRvIHRoZSBjYW52YXMncyB3aWR0aCBhbmQgaGVpZ2h0LlxyXG5cclxuLy8gQ2xlYXIgdGhlIGNhbnZhcyBiZWZvcmUgd2Ugc3RhcnQgZHJhd2luZyBvbiBpdC5cclxuZ2wuY2xlYXIoZ2wuQ09MT1JfQlVGRkVSX0JJVCk7XHJcblxyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLyBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhbnZhc1wiKSBhcyBIVE1MQ2FudmFzRWxlbWVudDtcclxubGV0IHNoYXBlczogKFNoYXBlICYgUmVuZGVyYWJsZSAmIFRyYW5zZm9ybWFibGUpW10gPSBbXTtcclxubGV0IHR5cGU6IFR5cGU7XHJcbmxldCBpc0RyYXdpbmcgPSBmYWxzZTtcclxuXHJcbi8qIFNldHVwIFZpZXdwb3J0ICovXHJcblxyXG5jb25zdCBwb3NpdGlvbkJ1ZmZlciA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xyXG5jb25zdCBjb2xvckJ1ZmZlciA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xyXG4vLyBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgcG9zaXRpb25CdWZmZXIpO1xyXG4vLyBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgY29sb3JCdWZmZXIpO1xyXG4vLyBzZXRBdHRyaWJ1dGVzKGdsLCBwb3NpdGlvbkJ1ZmZlciwgY29sb3JCdWZmZXIsIHByb2dyYW1JbmZvKTtcclxuXHJcbmxldCBjdXJyZW50T2JqZWN0OiBTaGFwZSAmIFJlbmRlcmFibGUgJiBUcmFuc2Zvcm1hYmxlO1xyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gRml4IEhUTUwgRWxlbWVudHMgRXZlbnQgTGlzdGVuZXJzXHJcblxyXG4vKiBMaXN0IG9mIFNoYXBlcyBMaXN0ZW5lciAqL1xyXG5jb25zdCBsaXN0T2ZTaGFwZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxpc3Qtb2Ytc2hhcGVzXCIpIGFzIEhUTUxTZWxlY3RFbGVtZW50O1xyXG5saXN0T2ZTaGFwZXMuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoKSA9PiB7XHJcbiAgcmVuZGVyQWxsKGdsLCBwcm9ncmFtSW5mbywgc2hhcGVzLCBwb3NpdGlvbkJ1ZmZlciwgY29sb3JCdWZmZXIpO1xyXG4gIGNvbnN0IGluZGV4OiBudW1iZXIgPSArbGlzdE9mU2hhcGVzLnNlbGVjdGVkT3B0aW9uc1swXS52YWx1ZTtcclxuICBpc0RyYXdpbmcgPSBmYWxzZTtcclxuXHJcbiAgc2V0dXBTZWxlY3RvcihnbCwgcHJvZ3JhbUluZm8sIHNoYXBlc1tpbmRleF0pO1xyXG59KTtcclxuXHJcbi8qIEJ1dHRvbiBMaXN0ZW5lciAqL1xyXG5jb25zdCBsaW5lQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsaW5lLWJ0blwiKTtcclxubGluZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gIHJlbmRlckFsbChnbCwgcHJvZ3JhbUluZm8sIHNoYXBlcywgcG9zaXRpb25CdWZmZXIsIGNvbG9yQnVmZmVyKTtcclxuICB0eXBlID0gVHlwZS5MaW5lO1xyXG4gIGlzRHJhd2luZyA9IGZhbHNlO1xyXG59KTtcclxuXHJcbmNvbnN0IHNxdWFyZUJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3F1YXJlLWJ0blwiKTtcclxuc3F1YXJlQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgcmVuZGVyQWxsKGdsLCBwcm9ncmFtSW5mbywgc2hhcGVzLCBwb3NpdGlvbkJ1ZmZlciwgY29sb3JCdWZmZXIpO1xyXG4gIHR5cGUgPSBUeXBlLlNxdWFyZTtcclxuICBpc0RyYXdpbmcgPSBmYWxzZTtcclxufSk7XHJcblxyXG5jb25zdCByZWN0YW5nbGVCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlY3RhbmdsZS1idG5cIik7XHJcbnJlY3RhbmdsZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gIHJlbmRlckFsbChnbCwgcHJvZ3JhbUluZm8sIHNoYXBlcywgcG9zaXRpb25CdWZmZXIsIGNvbG9yQnVmZmVyKTtcclxuICB0eXBlID0gVHlwZS5SZWN0YW5nbGU7XHJcbiAgaXNEcmF3aW5nID0gZmFsc2U7XHJcbn0pO1xyXG5cclxuY29uc3QgcG9seWdvbkJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicG9seWdvbi1idG5cIik7XHJcbnBvbHlnb25CdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICByZW5kZXJBbGwoZ2wsIHByb2dyYW1JbmZvLCBzaGFwZXMsIHBvc2l0aW9uQnVmZmVyLCBjb2xvckJ1ZmZlcik7XHJcbiAgdHlwZSA9IFR5cGUuUG9seWdvbjtcclxuICBpc0RyYXdpbmcgPSBmYWxzZTtcclxuICAvLyBpc0ZpcnN0RHJhd2luZyA9IHRydWU7XHJcbn0pO1xyXG5cclxuY29uc3Qgc2F2ZUJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2F2ZS1idG5cIik7XHJcbnNhdmVCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICByZW5kZXJBbGwoZ2wsIHByb2dyYW1JbmZvLCBzaGFwZXMsIHBvc2l0aW9uQnVmZmVyLCBjb2xvckJ1ZmZlcik7XHJcbiAgY29uc3QgdGV4dCA9IHN0b3JlU2hhcGVzKHNoYXBlcyk7XHJcbiAgaGFuZGxlRG93bmxvYWQodGV4dCk7XHJcbn0pO1xyXG5cclxuY29uc3QgdXBsb2FkQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1cGxvYWQtYnRuXCIpO1xyXG51cGxvYWRCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICBoYW5kbGVVcGxvYWQoKHRleHQpID0+IHtcclxuICAgIHNoYXBlcyA9IGxvYWRTaGFwZSh0ZXh0KTtcclxuXHJcbiAgICBmb3IgKGNvbnN0IHNoYXBlIG9mIHNoYXBlcykge1xyXG4gICAgICBzZXR1cE9wdGlvbih0cnVlLCBzaGFwZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyQWxsKGdsLCBwcm9ncmFtSW5mbywgc2hhcGVzLCBwb3NpdGlvbkJ1ZmZlciwgY29sb3JCdWZmZXIpO1xyXG4gIH0pO1xyXG59KTtcclxuXHJcbi8qIENhbnZhcyBMaXN0ZW5lciAqL1xyXG5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCAoZXZlbnQpID0+IHtcclxuICBjb25zdCB4ID0gZXZlbnQuY2xpZW50WDtcclxuICBjb25zdCB5ID0gZXZlbnQuY2xpZW50WTtcclxuICBjb25zdCBwb2ludCA9IG5ldyBQb2ludChbeCwgeV0pO1xyXG5cclxuICBpZiAoaXNEcmF3aW5nKSB7XHJcbiAgICBpZiAoY3VycmVudE9iamVjdC50eXBlICE9PSBUeXBlLlBvbHlnb24pIHtcclxuICAgICAgY3VycmVudE9iamVjdC5kcmF3KHBvaW50KTtcclxuICAgICAgc2V0dXBPcHRpb24odHJ1ZSwgY3VycmVudE9iamVjdCk7XHJcbiAgICAgIHNoYXBlcy5wdXNoKGN1cnJlbnRPYmplY3QpO1xyXG4gICAgICBpc0RyYXdpbmcgPSBmYWxzZTtcclxuICAgICAgY3VycmVudE9iamVjdCA9IG51bGw7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAoY3VycmVudE9iamVjdC5pZCA9PSBzaGFwZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgY3VycmVudE9iamVjdC5kcmF3KHBvaW50KTtcclxuICAgICAgICAvLyBiZWx1bSBkaXB1c2gga2Ugc2hhcGVzXHJcbiAgICAgICAgaWYgKGN1cnJlbnRPYmplY3QuYXJyYXlPZlBvaW50cy5sZW5ndGggPj0zKSB7XHJcbiAgICAgICAgICBzZXR1cE9wdGlvbih0cnVlLCBjdXJyZW50T2JqZWN0KTtcclxuICAgICAgICAgIC8vIHJlbmRlcihnbCwgcHJvZ3JhbUluZm8sIGN1cnJlbnRPYmplY3QsIHBvc2l0aW9uQnVmZmVyLCBjb2xvckJ1ZmZlcik7XHJcbiAgICAgICAgICBzaGFwZXMucHVzaChjdXJyZW50T2JqZWN0KTtcclxuICAgICAgICAgIHJlbmRlckFsbChnbCwgcHJvZ3JhbUluZm8sIHNoYXBlcywgcG9zaXRpb25CdWZmZXIsIGNvbG9yQnVmZmVyKTtcclxuICAgICAgICAgIGlzRHJhd2luZyA9IGZhbHNlO1xyXG4gICAgICAgICAgY3VycmVudE9iamVjdCA9IG51bGw7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJlbmRlckFsbChnbCwgcHJvZ3JhbUluZm8sIHNoYXBlcywgcG9zaXRpb25CdWZmZXIsIGNvbG9yQnVmZmVyKTtcclxuICAgICAgICAgIHJlbmRlcihnbCwgcHJvZ3JhbUluZm8sIGN1cnJlbnRPYmplY3QsIHBvc2l0aW9uQnVmZmVyLCBjb2xvckJ1ZmZlcik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IG1hdHJpeCA9IFRyYW5zZm9ybWF0aW9uLmludmVyc2VUcmFuc2Zvcm1hdGlvbk1hdHJpeChcclxuICAgICAgICAgIGdsLmNhbnZhcy53aWR0aCxcclxuICAgICAgICAgIGdsLmNhbnZhcy5oZWlnaHQsXHJcbiAgICAgICAgICBjdXJyZW50T2JqZWN0LnR4LFxyXG4gICAgICAgICAgY3VycmVudE9iamVjdC50eSxcclxuICAgICAgICAgIGN1cnJlbnRPYmplY3QuZGVncmVlLFxyXG4gICAgICAgICAgY3VycmVudE9iamVjdC5zeCxcclxuICAgICAgICAgIGN1cnJlbnRPYmplY3Quc3ksXHJcbiAgICAgICAgICBjdXJyZW50T2JqZWN0Lmt4LFxyXG4gICAgICAgICAgY3VycmVudE9iamVjdC5reSxcclxuICAgICAgICAgIGN1cnJlbnRPYmplY3QuY2VudGVyXHJcbiAgICAgICAgKTtcclxuICAgICAgICBjb25zdCBwb2ludDIgPSBtYXRyaXgubXVsdGlwbHlQb2ludChwb2ludCk7XHJcbiAgICAgICAgY3VycmVudE9iamVjdC5kcmF3KHBvaW50Mik7XHJcbiAgICAgICAgc2V0dXBPcHRpb24oZmFsc2UsIGN1cnJlbnRPYmplY3QpO1xyXG4gICAgICAgIC8vIHJlbmRlcihnbCwgcHJvZ3JhbUluZm8sIGN1cnJlbnRPYmplY3QsIHBvc2l0aW9uQnVmZmVyLCBjb2xvckJ1ZmZlcik7XHJcbiAgICAgICAgcmVuZGVyQWxsKGdsLCBwcm9ncmFtSW5mbywgc2hhcGVzLCBwb3NpdGlvbkJ1ZmZlciwgY29sb3JCdWZmZXIpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICBjYXNlIFR5cGUuTGluZTpcclxuICAgICAgICBjdXJyZW50T2JqZWN0ID0gbmV3IExpbmUoc2hhcGVzLmxlbmd0aCwgcG9pbnQpO1xyXG4gICAgICAgIGlzRHJhd2luZyA9IHRydWU7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgVHlwZS5TcXVhcmU6XHJcbiAgICAgICAgY3VycmVudE9iamVjdCA9IG5ldyBTcXVhcmUoc2hhcGVzLmxlbmd0aCwgcG9pbnQpO1xyXG4gICAgICAgIGlzRHJhd2luZyA9IHRydWU7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgVHlwZS5SZWN0YW5nbGU6XHJcbiAgICAgICAgY3VycmVudE9iamVjdCA9IG5ldyBSZWN0YW5nbGUoc2hhcGVzLmxlbmd0aCwgcG9pbnQpO1xyXG4gICAgICAgIGlzRHJhd2luZyA9IHRydWU7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgVHlwZS5Qb2x5Z29uOlxyXG4gICAgICAgIGN1cnJlbnRPYmplY3QgPSBuZXcgUG9seWdvbihzaGFwZXMubGVuZ3RoLCBwb2ludCk7XHJcbiAgICAgICAgaXNEcmF3aW5nID0gdHJ1ZTtcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcbn0pO1xyXG5cclxuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgKGV2ZW50KSA9PiB7XHJcbiAgaWYgKGlzRHJhd2luZyAmJiBjdXJyZW50T2JqZWN0LnR5cGUgIT09IFR5cGUuUG9seWdvbikge1xyXG4gICAgY29uc3QgeCA9IGV2ZW50LmNsaWVudFg7XHJcbiAgICBjb25zdCB5ID0gZXZlbnQuY2xpZW50WTtcclxuICAgIGNvbnN0IHBvaW50ID0gbmV3IFBvaW50KFt4LCB5XSk7XHJcbiAgICBjdXJyZW50T2JqZWN0LmRyYXcocG9pbnQpO1xyXG4gICAgcmVuZGVyQWxsKGdsLCBwcm9ncmFtSW5mbywgc2hhcGVzLCBwb3NpdGlvbkJ1ZmZlciwgY29sb3JCdWZmZXIpO1xyXG4gICAgcmVuZGVyKGdsLCBwcm9ncmFtSW5mbywgY3VycmVudE9iamVjdCwgcG9zaXRpb25CdWZmZXIsIGNvbG9yQnVmZmVyKTtcclxuICB9XHJcbn0pO1xyXG5cclxuZnVuY3Rpb24gc2V0dXBPcHRpb24oXHJcbiAgaXNGaXJzdERyYXdpbmc6IGJvb2xlYW4sXHJcbiAgZWxlbWVudDogUmVuZGVyYWJsZSAmIFRyYW5zZm9ybWFibGUgJiBTaGFwZVxyXG4pOiB2b2lkIHtcclxuICBjb25zdCBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xyXG4gIG9wdGlvbi52YWx1ZSA9IGVsZW1lbnQuaWQudG9TdHJpbmcoKTtcclxuICBsZXQgb3B0aW9uVGV4dDogc3RyaW5nO1xyXG4gIHN3aXRjaCAodHlwZSkge1xyXG4gICAgY2FzZSBUeXBlLkxpbmU6XHJcbiAgICAgIG9wdGlvblRleHQgPSBgTGluZV8ke2VsZW1lbnQuaWR9YDtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIFR5cGUuU3F1YXJlOlxyXG4gICAgICBvcHRpb25UZXh0ID0gYFNxdWFyZV8ke2VsZW1lbnQuaWR9YDtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIFR5cGUuUmVjdGFuZ2xlOlxyXG4gICAgICBvcHRpb25UZXh0ID0gYFJlY3RhbmdsZV8ke2VsZW1lbnQuaWR9YDtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIFR5cGUuUG9seWdvbjpcclxuICAgICAgb3B0aW9uVGV4dCA9IGBQb2x5Z29uXyR7ZWxlbWVudC5pZH1gO1xyXG4gICAgICBicmVhaztcclxuICB9XHJcbiAgb3B0aW9uLnRleHQgPSBvcHRpb25UZXh0O1xyXG5cclxuICBpZiAoaXNGaXJzdERyYXdpbmcpIHtcclxuICAgIGNvbnN0IGxpc3RPZlNoYXBlcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICBcImxpc3Qtb2Ytc2hhcGVzXCJcclxuICAgICkgYXMgSFRNTFNlbGVjdEVsZW1lbnQ7XHJcbiAgICBsaXN0T2ZTaGFwZXMuYXBwZW5kQ2hpbGQob3B0aW9uKTtcclxuICAgIGxpc3RPZlNoYXBlcy52YWx1ZSA9IGVsZW1lbnQuaWQudG9TdHJpbmcoKTtcclxuICB9XHJcblxyXG4gIHNldHVwU2VsZWN0b3IoZ2wsIHByb2dyYW1JbmZvLCBlbGVtZW50KTtcclxufVxyXG5cclxuZnVuY3Rpb24gc2V0dXBTZWxlY3RvcihcclxuICBnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LFxyXG4gIHByb2dyYW1JbmZvOiBQcm9ncmFtSW5mbyxcclxuICBlbGVtZW50OiBSZW5kZXJhYmxlICYgVHJhbnNmb3JtYWJsZSAmIFNoYXBlXHJcbik6IHZvaWQge1xyXG4gIGNvbnN0IHNsaWRlclhfb3JpZ2luYWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNsaWRlclhcIikgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICBjb25zdCBzbGlkZXJYID0gc2xpZGVyWF9vcmlnaW5hbC5jbG9uZU5vZGUodHJ1ZSkgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICBzbGlkZXJYX29yaWdpbmFsLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHNsaWRlclgsIHNsaWRlclhfb3JpZ2luYWwpO1xyXG4gIHNsaWRlclgubWluID0gXCItNjAwXCI7XHJcbiAgc2xpZGVyWC5tYXggPSBcIjYwMFwiO1xyXG4gIHNsaWRlclgudmFsdWUgPSBlbGVtZW50LnR4LnRvU3RyaW5nKCk7XHJcbiAgc2xpZGVyWC5zdGVwID0gXCIxMFwiO1xyXG5cclxuICBzbGlkZXJYLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCAoZXZlbnQpID0+IHtcclxuICAgIGNvbnN0IGRlbHRhWCA9IChldmVudC50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWU7XHJcbiAgICBlbGVtZW50LnR4ID0gTnVtYmVyKGRlbHRhWCk7XHJcbiAgICByZW5kZXJBbGwoZ2wsIHByb2dyYW1JbmZvLCBzaGFwZXMsIHBvc2l0aW9uQnVmZmVyLCBjb2xvckJ1ZmZlcik7XHJcbiAgfSk7ICAgXHJcblxyXG4gIGNvbnN0IHNsaWRlcllfb3JpZ2luYWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNsaWRlcllcIikgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICBjb25zdCBzbGlkZXJZID0gc2xpZGVyWV9vcmlnaW5hbC5jbG9uZU5vZGUodHJ1ZSkgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICBzbGlkZXJZX29yaWdpbmFsLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHNsaWRlclksIHNsaWRlcllfb3JpZ2luYWwpO1xyXG4gIHNsaWRlclkubWluID0gXCItNjAwXCI7XHJcbiAgc2xpZGVyWS5tYXggPSBcIjYwMFwiO1xyXG4gIHNsaWRlclkudmFsdWUgPSAoLWVsZW1lbnQudHkpLnRvU3RyaW5nKCk7XHJcbiAgc2xpZGVyWS5zdGVwID0gXCIxMFwiO1xyXG4gIHNsaWRlclkuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIChldmVudCkgPT4ge1xyXG4gICAgY29uc3QgZGVsdGFZID0gKGV2ZW50LnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZTtcclxuICAgIGVsZW1lbnQudHkgPSAtTnVtYmVyKGRlbHRhWSk7XHJcbiAgICByZW5kZXJBbGwoZ2wsIHByb2dyYW1JbmZvLCBzaGFwZXMsIHBvc2l0aW9uQnVmZmVyLCBjb2xvckJ1ZmZlcik7XHJcbiAgfSk7XHJcblxyXG4gIGNvbnN0IHNsaWRlckxlbmd0aF9vcmlnaW5hbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgXCJzbGlkZXJMZW5ndGhcIlxyXG4gICkgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICBjb25zdCBzbGlkZXJMZW5ndGggPSBzbGlkZXJMZW5ndGhfb3JpZ2luYWwuY2xvbmVOb2RlKHRydWUpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgc2xpZGVyTGVuZ3RoX29yaWdpbmFsLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHNsaWRlckxlbmd0aCwgc2xpZGVyTGVuZ3RoX29yaWdpbmFsKTtcclxuICBzbGlkZXJMZW5ndGgubWluID0gXCIwXCI7XHJcbiAgc2xpZGVyTGVuZ3RoLm1heCA9IFwiNjAwXCI7XHJcbiAgbGV0IGxlbmd0aDogbnVtYmVyO1xyXG4gIGlmIChlbGVtZW50LnR5cGUgPT09IFR5cGUuUG9seWdvbikge1xyXG4gICAgbGV0IG1pbiA9IEluZmluaXR5O1xyXG4gICAgbGV0IG1heCA9IC1JbmZpbml0eTtcclxuXHJcbiAgICBmb3IgKGNvbnN0IHAgb2YgZWxlbWVudC5hcnJheU9mUG9pbnRzKSB7XHJcbiAgICAgIGNvbnN0IFtwWF0gPSBwLmdldFBhaXIoKTtcclxuICAgICAgaWYgKHBYIDwgbWluKSB7XHJcbiAgICAgICAgbWluID0gcFg7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHBYID4gbWF4KSB7XHJcbiAgICAgICAgbWF4ID0gcFg7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGxlbmd0aCA9IG1heCAtIG1pbjtcclxuICB9IGVsc2Uge1xyXG4gICAgbGVuZ3RoID0gTWF0aC5zcXJ0KFxyXG4gICAgICAoZWxlbWVudC5hcnJheU9mUG9pbnRzWzBdLnggLSBlbGVtZW50LmFycmF5T2ZQb2ludHNbMV0ueCkgKiogMiArXHJcbiAgICAgICAgKGVsZW1lbnQuYXJyYXlPZlBvaW50c1swXS55IC0gZWxlbWVudC5hcnJheU9mUG9pbnRzWzFdLnkpICoqIDJcclxuICAgICk7XHJcbiAgfVxyXG4gIHNsaWRlckxlbmd0aC52YWx1ZSA9ICgoZWxlbWVudC5zeCAtIDEpICogbGVuZ3RoKS50b1N0cmluZygpO1xyXG4gIHNsaWRlckxlbmd0aC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgKGV2ZW50KSA9PiB7XHJcbiAgICBjb25zdCBkZWx0YUxlbmd0aCA9IChldmVudC50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWU7XHJcbiAgICBlbGVtZW50LnN4ID0gMSArIE51bWJlcihkZWx0YUxlbmd0aCkgLyBsZW5ndGg7XHJcbiAgICByZW5kZXJBbGwoZ2wsIHByb2dyYW1JbmZvLCBzaGFwZXMsIHBvc2l0aW9uQnVmZmVyLCBjb2xvckJ1ZmZlcik7XHJcbiAgfSk7XHJcblxyXG4gIGNvbnN0IHNsaWRlcldpZHRoX29yaWdpbmFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICBcInNsaWRlcldpZHRoXCJcclxuICApIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgY29uc3Qgc2xpZGVyV2lkdGggPSBzbGlkZXJXaWR0aF9vcmlnaW5hbC5jbG9uZU5vZGUodHJ1ZSkgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICBzbGlkZXJXaWR0aF9vcmlnaW5hbC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChzbGlkZXJXaWR0aCwgc2xpZGVyV2lkdGhfb3JpZ2luYWwpO1xyXG4gIHNsaWRlcldpZHRoLm1pbiA9IFwiMFwiO1xyXG4gIHNsaWRlcldpZHRoLm1heCA9IFwiNjAwXCI7XHJcbiAgbGV0IHdpZHRoOiBudW1iZXI7XHJcblxyXG4gIGlmIChlbGVtZW50LnR5cGUgPT0gVHlwZS5SZWN0YW5nbGUgfHwgZWxlbWVudC50eXBlID09IFR5cGUuU3F1YXJlKSB7XHJcbiAgICB3aWR0aCA9IE1hdGguc3FydChcclxuICAgICAgKGVsZW1lbnQuYXJyYXlPZlBvaW50c1swXS54IC0gZWxlbWVudC5hcnJheU9mUG9pbnRzWzNdLngpICoqIDIgK1xyXG4gICAgICAgIChlbGVtZW50LmFycmF5T2ZQb2ludHNbMF0ueSAtIGVsZW1lbnQuYXJyYXlPZlBvaW50c1szXS55KSAqKiAyXHJcbiAgICApO1xyXG4gIH0gZWxzZSBpZiAoZWxlbWVudC50eXBlID09IFR5cGUuUG9seWdvbikge1xyXG4gICAgbGV0IG1pbiA9IEluZmluaXR5O1xyXG4gICAgbGV0IG1heCA9IC1JbmZpbml0eTtcclxuXHJcbiAgICBmb3IgKGNvbnN0IHAgb2YgZWxlbWVudC5hcnJheU9mUG9pbnRzKSB7XHJcbiAgICAgIGNvbnN0IFssIHBZXSA9IHAuZ2V0UGFpcigpO1xyXG4gICAgICBpZiAocFkgPCBtaW4pIHtcclxuICAgICAgICBtaW4gPSBwWTtcclxuICAgICAgfVxyXG4gICAgICBpZiAocFkgPiBtYXgpIHtcclxuICAgICAgICBtYXggPSBwWTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgbGVuZ3RoID0gbWF4IC0gbWluO1xyXG4gIH0gXHJcbiAgc2xpZGVyV2lkdGgudmFsdWUgPSAoKGVsZW1lbnQuc3kgLSAxKSAqIHdpZHRoKS50b1N0cmluZygpO1xyXG4gIHNsaWRlcldpZHRoLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCAoZXZlbnQpID0+IHtcclxuICAgIGNvbnN0IGRlbHRhV2lkdGggPSAoZXZlbnQudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlO1xyXG4gICAgZWxlbWVudC5zeSA9IDEgKyBOdW1iZXIoZGVsdGFXaWR0aCkgLyB3aWR0aDtcclxuICAgIHJlbmRlckFsbChnbCwgcHJvZ3JhbUluZm8sIHNoYXBlcywgcG9zaXRpb25CdWZmZXIsIGNvbG9yQnVmZmVyKTtcclxuICB9KTtcclxuXHJcbiAgY29uc3Qgc2xpZGVyUm90YXRpb25fb3JpZ2luYWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgIFwic2xpZGVyUm90YXRpb25cIlxyXG4gICkgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICBjb25zdCBzbGlkZXJSb3RhdGlvbl92YWx1ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgXCJzbGlkZXItcm90YXRpb24tdmFsdWVcIlxyXG4gICkgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICBjb25zdCBzbGlkZXJSb3RhdGlvbiA9IHNsaWRlclJvdGF0aW9uX29yaWdpbmFsLmNsb25lTm9kZSh0cnVlKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gIHNsaWRlclJvdGF0aW9uX29yaWdpbmFsLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHNsaWRlclJvdGF0aW9uLCBzbGlkZXJSb3RhdGlvbl9vcmlnaW5hbCk7XHJcbiAgc2xpZGVyUm90YXRpb24ubWluID0gXCIwXCI7XHJcbiAgc2xpZGVyUm90YXRpb24ubWF4ID0gXCIzNjBcIjtcclxuICBzbGlkZXJSb3RhdGlvbi52YWx1ZSA9ICgoMTgwICogZWxlbWVudC5kZWdyZWUpIC8gTWF0aC5QSSkudG9TdHJpbmcoKTtcclxuICBzbGlkZXJSb3RhdGlvbl92YWx1ZS50ZXh0Q29udGVudCA9ICgoMTgwICogZWxlbWVudC5kZWdyZWUpIC8gTWF0aC5QSSkudG9GaXhlZCgwKS50b1N0cmluZygpOyBcclxuICBzbGlkZXJSb3RhdGlvbi5zdGVwID0gXCIxMFwiO1xyXG4gIHNsaWRlclJvdGF0aW9uLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCAoZXZlbnQpID0+IHtcclxuICAgIGNvbnN0IGRlbHRhRGVncmVlID0gKGV2ZW50LnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZTtcclxuICAgIGVsZW1lbnQuZGVncmVlID0gKE51bWJlcihkZWx0YURlZ3JlZSkgLyAxODApICogTWF0aC5QSTtcclxuICAgIHNsaWRlclJvdGF0aW9uX3ZhbHVlLnRleHRDb250ZW50ID0gKCgxODAgKiBlbGVtZW50LmRlZ3JlZSkgLyBNYXRoLlBJKS50b0ZpeGVkKDApLnRvU3RyaW5nKCk7IFxyXG4gICAgcmVuZGVyQWxsKGdsLCBwcm9ncmFtSW5mbywgc2hhcGVzLCBwb3NpdGlvbkJ1ZmZlciwgY29sb3JCdWZmZXIpO1xyXG4gIH0pO1xyXG5cclxuICBjb25zdCBzbGlkZXJTaGVhclhfb3JpZ2luYWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgIFwic2xpZGVyU2hlYXJYXCJcclxuICApIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgY29uc3Qgc2xpZGVyU2hlYXJYID0gc2xpZGVyU2hlYXJYX29yaWdpbmFsLmNsb25lTm9kZSh0cnVlKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gIHNsaWRlclNoZWFyWF9vcmlnaW5hbC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChzbGlkZXJTaGVhclgsIHNsaWRlclNoZWFyWF9vcmlnaW5hbCk7XHJcbiAgc2xpZGVyU2hlYXJYLm1pbiA9IFwiMFwiO1xyXG4gIHNsaWRlclNoZWFyWC5tYXggPSBcIjEwXCI7XHJcbiAgc2xpZGVyU2hlYXJYLnZhbHVlID0gZWxlbWVudC5reC50b1N0cmluZygpO1xyXG4gIHNsaWRlclNoZWFyWC5zdGVwID0gXCIwLjFcIjtcclxuXHJcbiAgc2xpZGVyU2hlYXJYLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCAoZXZlbnQpID0+IHtcclxuICAgIGNvbnN0IGRlbHRhU2hlYXJYID0gKGV2ZW50LnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZTtcclxuICAgIGVsZW1lbnQua3ggPSBOdW1iZXIoZGVsdGFTaGVhclgpO1xyXG4gICAgcmVuZGVyQWxsKGdsLCBwcm9ncmFtSW5mbywgc2hhcGVzLCBwb3NpdGlvbkJ1ZmZlciwgY29sb3JCdWZmZXIpO1xyXG4gIH0pO1xyXG5cclxuICBjb25zdCBzbGlkZXJTaGVhcllfb3JpZ2luYWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgIFwic2xpZGVyU2hlYXJZXCJcclxuICApIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgY29uc3Qgc2xpZGVyU2hlYXJZID0gc2xpZGVyU2hlYXJZX29yaWdpbmFsLmNsb25lTm9kZSh0cnVlKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gIHNsaWRlclNoZWFyWV9vcmlnaW5hbC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChzbGlkZXJTaGVhclksIHNsaWRlclNoZWFyWV9vcmlnaW5hbCk7XHJcbiAgc2xpZGVyU2hlYXJZLm1pbiA9IFwiMFwiO1xyXG4gIHNsaWRlclNoZWFyWS5tYXggPSBcIjEwXCI7XHJcbiAgc2xpZGVyU2hlYXJZLnZhbHVlID0gZWxlbWVudC5reS50b1N0cmluZygpO1xyXG4gIHNsaWRlclNoZWFyWS5zdGVwID0gXCIwLjFcIjtcclxuXHJcbiAgc2xpZGVyU2hlYXJZLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCAoZXZlbnQpID0+IHtcclxuICAgIGNvbnN0IGRlbHRhU2hlYXJZID0gKGV2ZW50LnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZTtcclxuICAgIGVsZW1lbnQua3kgPSBOdW1iZXIoZGVsdGFTaGVhclkpO1xyXG4gICAgcmVuZGVyQWxsKGdsLCBwcm9ncmFtSW5mbywgc2hhcGVzLCBwb3NpdGlvbkJ1ZmZlciwgY29sb3JCdWZmZXIpO1xyXG4gIH0pO1xyXG5cclxuICBjb25zdCBwb2ludFBpY2tlcl9vcmlnaW5hbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgXCJwb2ludFBpY2tlclwiXHJcbiAgKSBhcyBIVE1MU2VsZWN0RWxlbWVudDtcclxuICBjb25zdCBwb2ludFBpY2tlciA9IHBvaW50UGlja2VyX29yaWdpbmFsLmNsb25lTm9kZSh0cnVlKSBhcyBIVE1MU2VsZWN0RWxlbWVudDsgXHJcbiAgcG9pbnRQaWNrZXJfb3JpZ2luYWwucGFyZW50RWxlbWVudC5yZXBsYWNlQ2hpbGQocG9pbnRQaWNrZXIsIHBvaW50UGlja2VyX29yaWdpbmFsKTtcclxuICBwb2ludFBpY2tlci5pbm5lckhUTUwgPSBcIlwiO1xyXG4gIHBvaW50UGlja2VyLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKCkgPT4ge1xyXG4gICAgY29uc3QgcG9pbnRJbmRleDogbnVtYmVyID0gTnVtYmVyKHBvaW50UGlja2VyLnZhbHVlKTtcclxuICAgIHNldHVwQ29sb3JQaWNrZXIoZ2wsIHByb2dyYW1JbmZvLCBwb2ludEluZGV4LCBlbGVtZW50KTtcclxuICB9KTtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IGVsZW1lbnQuYXJyYXlPZlBvaW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgY29uc3QgbmV3UG9pbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xyXG4gICAgbmV3UG9pbnQudmFsdWUgPSBpLnRvU3RyaW5nKCk7XHJcbiAgICBuZXdQb2ludC50ZXh0ID0gXCJwb2ludF9cIiArIGk7XHJcbiAgICBwb2ludFBpY2tlci5hcHBlbmRDaGlsZChuZXdQb2ludCk7XHJcbiAgfVxyXG5cclxuICAvLyBJZiB0aGUgY3VycmVudE9iamVjdCBpcyBub3Qgb2YgdHlwZSBQb2x5Z29uLCByZW1vdmUgdGhlIGJ1dHRvblxyXG4gIGNvbnN0IGFkZFBvaW50QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidG4tYWRkLXBvaW50XCIpO1xyXG4gIGlmIChhZGRQb2ludEJ1dHRvbikge1xyXG4gICAgYWRkUG9pbnRCdXR0b24ucmVtb3ZlKCk7XHJcbiAgfVxyXG5cclxuICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIFBvbHlnb24pIHtcclxuICAgIGNvbnN0IGFkZFBvaW50QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcclxuICAgIGFkZFBvaW50QnV0dG9uLnRleHRDb250ZW50ID0gXCJBZGQgTmV3IFBvaW50XCI7XHJcbiAgICBhZGRQb2ludEJ1dHRvbi5jbGFzc05hbWUgPSBcImJ0biBidG4tcHJpbWFyeVwiO1xyXG4gICAgYWRkUG9pbnRCdXR0b24uaWQgPSBcImJ0bi1hZGQtcG9pbnRcIjtcclxuICAgIGFkZFBvaW50QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgICAgIC8vIFNldCBhIGZsYWcgdG8gaW5kaWNhdGUgdGhhdCBhIG5ldyBwb2ludCBpcyBiZWluZyBhZGRlZFxyXG4gICAgICBpc0RyYXdpbmcgPSB0cnVlO1xyXG4gICAgICBjdXJyZW50T2JqZWN0ID0gc2hhcGVzW2VsZW1lbnQuaWRdXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBBcHBlbmQgdGhlIGJ1dHRvbiB0byB0aGUgRE9NXHJcbiAgICBjb25zdCBsZWZ0UGFuZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmxlZnQtcGFuZWxcIik7XHJcbiAgICBpZiAobGVmdFBhbmVsKSB7XHJcbiAgICAgIGxlZnRQYW5lbC5hcHBlbmRDaGlsZChhZGRQb2ludEJ1dHRvbik7XHJcbiAgICB9XHJcbiAgfSBcclxufVxyXG5cclxuZnVuY3Rpb24gc2V0dXBDb2xvclBpY2tlcihcclxuICBnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LFxyXG4gIHByb2dyYW1JbmZvOiBQcm9ncmFtSW5mbyxcclxuICBwb2ludEluZGV4OiBudW1iZXIsXHJcbiAgZWxlbWVudDogUmVuZGVyYWJsZSAmIFRyYW5zZm9ybWFibGUgJiBTaGFwZVxyXG4pIHtcclxuICBjb25zdCBjb2xvclBpY2tlcl9vcmlnaW5hbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgXCJjb2xvclBpY2tlclwiXHJcbiAgKSBhcyBIVE1MU2VsZWN0RWxlbWVudDtcclxuICBjb25zdCBjb2xvclBpY2tlciA9IGNvbG9yUGlja2VyX29yaWdpbmFsLmNsb25lTm9kZSh0cnVlKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gIGNvbnN0IGNvbG9yID0gcmdiVG9IZXgoZWxlbWVudC5hcnJheU9mUG9pbnRzW3BvaW50SW5kZXhdLmdldENvbG9yKCkpO1xyXG4gIGNvbG9yUGlja2VyLnZhbHVlID0gY29sb3I7IFxyXG4gIGNvbG9yUGlja2VyLnN0eWxlLmNvbG9yID0gY29sb3IgO1xyXG4gIGNvbG9yUGlja2VyLnNldEF0dHJpYnV0ZShcInZhbHVlXCIsIGNvbG9yKTtcclxuICAvLyBjb25zb2xlLmxvZyhgY29sb3I6ICR7Y29sb3J9fWApXHJcbiAgY29uc29sZS5sb2coYGNvbG9yIHBpY2tlciB2YWx1ZTogJHtjb2xvclBpY2tlci52YWx1ZX1gKVxyXG4gIGNvbG9yUGlja2VyX29yaWdpbmFsLnBhcmVudEVsZW1lbnQucmVwbGFjZUNoaWxkKGNvbG9yUGlja2VyLCBjb2xvclBpY2tlcl9vcmlnaW5hbCk7XHJcbiAgLy8gY29sb3JQaWNrZXIuaW5uZXJIVE1MID0gXCJcIjtcclxuXHJcbiAgY29sb3JQaWNrZXIuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoZXZlbnQpID0+IHtcclxuICAgIGNvbnN0IGhleCA9IChldmVudC50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWU7XHJcbiAgICBlbGVtZW50LmFycmF5T2ZQb2ludHNbcG9pbnRJbmRleF0uc2V0Q29sb3IoaGV4VG9SZ2IoaGV4KSk7XHJcbiAgICByZW5kZXJBbGwoZ2wsIHByb2dyYW1JbmZvLCBzaGFwZXMsIHBvc2l0aW9uQnVmZmVyLCBjb2xvckJ1ZmZlcik7XHJcbiAgfSk7XHJcblxyXG4gIGNvbnN0IGRlbGV0ZVBvaW50QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidG4tZGVsZXRlLXBvaW50XCIpO1xyXG4gIGlmIChkZWxldGVQb2ludEJ1dHRvbikge1xyXG4gICAgZGVsZXRlUG9pbnRCdXR0b24ucmVtb3ZlKCk7XHJcbiAgfVxyXG4gIGlmIChlbGVtZW50IGluc3RhbmNlb2YgUG9seWdvbikge1xyXG4gICAgY29uc3QgZGVsZXRlUG9pbnRCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xyXG4gICAgZGVsZXRlUG9pbnRCdXR0b24udGV4dENvbnRlbnQgPSBcIkRlbGV0ZSBQb2ludFwiO1xyXG4gICAgZGVsZXRlUG9pbnRCdXR0b24uY2xhc3NOYW1lID0gXCJidG4gYnRuLXByaW1hcnlcIjtcclxuICAgIGRlbGV0ZVBvaW50QnV0dG9uLmlkID0gXCJidG4tZGVsZXRlLXBvaW50XCI7XHJcbiAgICBkZWxldGVQb2ludEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gICAgICBlbGVtZW50LmRlbGV0ZVBvaW50KHBvaW50SW5kZXgpO1xyXG4gICAgICByZW5kZXJBbGwoZ2wsIHByb2dyYW1JbmZvLCBzaGFwZXMsIHBvc2l0aW9uQnVmZmVyLCBjb2xvckJ1ZmZlcik7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBib3R0b21TZWN0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5ib3R0b20tc2VjdGlvblwiKTtcclxuICAgIGlmIChib3R0b21TZWN0aW9uKSB7XHJcbiAgICAgIGJvdHRvbVNlY3Rpb24uYXBwZW5kQ2hpbGQoZGVsZXRlUG9pbnRCdXR0b24pO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuLy8gbG9hZHNoYXBlIGZyb20ganNvbiB0byBhcnJheSBvZiBzaGFwZVxyXG5mdW5jdGlvbiBsb2FkU2hhcGUodGV4dDogc3RyaW5nKTogKFNoYXBlICYgUmVuZGVyYWJsZSAmIFRyYW5zZm9ybWFibGUpW10ge1xyXG4gIGNvbnN0IHNoYXBlOiAoU2hhcGUgJiBSZW5kZXJhYmxlICYgVHJhbnNmb3JtYWJsZSlbXSA9IFtdO1xyXG4gIGNvbnN0IGRhdGEgPSBKU09OLnBhcnNlKHRleHQpO1xyXG4gIGZvciAoY29uc3QgaXRlbSBvZiBkYXRhKSB7XHJcbiAgICBjb25zdCB0eCA9IGl0ZW0udHg7XHJcbiAgICBjb25zdCB0eSA9IGl0ZW0udHk7XHJcbiAgICBjb25zdCBkZWdyZWUgPSBpdGVtLmRlZ3JlZTtcclxuICAgIGNvbnN0IHN4ID0gaXRlbS5zeDtcclxuICAgIGNvbnN0IHN5ID0gaXRlbS5zeTtcclxuICAgIGNvbnN0IGt4ID0gaXRlbS5reDtcclxuICAgIGNvbnN0IGt5ID0gaXRlbS5reTtcclxuICAgIGxldCBhcnJheU9mUG9pbnRzOiBQb2ludFtdID0gW107XHJcbiAgICBmb3IgKGNvbnN0IHBvaW50IG9mIGl0ZW0uYXJyYXlPZlBvaW50cykge1xyXG4gICAgICBsZXQgcCA9IG5ldyBQb2ludChcclxuICAgICAgICBbcG9pbnQueCwgcG9pbnQueV0sXHJcbiAgICAgICAgW3BvaW50LnIsIHBvaW50LmcsIHBvaW50LmIsIHBvaW50LmFdXHJcbiAgICAgICk7XHJcbiAgICAgIGFycmF5T2ZQb2ludHMucHVzaChwKTtcclxuICAgIH1cclxuICAgIHN3aXRjaCAoaXRlbS50eXBlKSB7XHJcbiAgICAgIGNhc2UgVHlwZS5MaW5lOlxyXG4gICAgICAgIGNvbnN0IGxpbmUgPSBuZXcgTGluZShpdGVtLmlkLCBhcnJheU9mUG9pbnRzWzBdKTtcclxuICAgICAgICBsaW5lLnNldExpbmVBdHRyaWJ1dGVzKFxyXG4gICAgICAgICAgdHgsXHJcbiAgICAgICAgICB0eSxcclxuICAgICAgICAgIGRlZ3JlZSxcclxuICAgICAgICAgIHN4LFxyXG4gICAgICAgICAgc3ksXHJcbiAgICAgICAgICBreCxcclxuICAgICAgICAgIGt5LFxyXG4gICAgICAgICAgYXJyYXlPZlBvaW50c1sxXVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgc2hhcGUucHVzaChsaW5lKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBUeXBlLlNxdWFyZTpcclxuICAgICAgICBjb25zdCBzcXVhcmUgPSBuZXcgU3F1YXJlKGl0ZW0uaWQsIGl0ZW0uY2VudGVyKTtcclxuICAgICAgICBzcXVhcmUuc2V0U3F1YXJlQXR0cmlidXRlcyhcclxuICAgICAgICAgIHR4LFxyXG4gICAgICAgICAgdHksXHJcbiAgICAgICAgICBkZWdyZWUsXHJcbiAgICAgICAgICBzeCxcclxuICAgICAgICAgIHN5LFxyXG4gICAgICAgICAga3gsXHJcbiAgICAgICAgICBreSxcclxuICAgICAgICAgIGFycmF5T2ZQb2ludHNcclxuICAgICAgICApO1xyXG4gICAgICAgIHNoYXBlLnB1c2goc3F1YXJlKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBUeXBlLlJlY3RhbmdsZTpcclxuICAgICAgICBjb25zdCByZWN0YW5nbGUgPSBuZXcgUmVjdGFuZ2xlKGl0ZW0uaWQsIGFycmF5T2ZQb2ludHNbMF0pO1xyXG4gICAgICAgIHJlY3RhbmdsZS5zZXRSZWN0YW5nbGVBdHRyaWJ1dGVzKFxyXG4gICAgICAgICAgdHgsXHJcbiAgICAgICAgICB0eSxcclxuICAgICAgICAgIGRlZ3JlZSxcclxuICAgICAgICAgIHN4LFxyXG4gICAgICAgICAgc3ksXHJcbiAgICAgICAgICBreCxcclxuICAgICAgICAgIGt5LFxyXG4gICAgICAgICAgYXJyYXlPZlBvaW50c1xyXG4gICAgICAgICk7XHJcbiAgICAgICAgc2hhcGUucHVzaChyZWN0YW5nbGUpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFR5cGUuUG9seWdvbjpcclxuICAgICAgICBjb25zdCBwb2x5Z29uID0gbmV3IFBvbHlnb24oaXRlbS5pZCwgYXJyYXlPZlBvaW50c1swXSk7XHJcbiAgICAgICAgcG9seWdvbi5zZXRQb2x5Z29uQXR0cmlidXRlcyhcclxuICAgICAgICAgIHR4LFxyXG4gICAgICAgICAgdHksXHJcbiAgICAgICAgICBkZWdyZWUsXHJcbiAgICAgICAgICBzeCxcclxuICAgICAgICAgIHN5LFxyXG4gICAgICAgICAga3gsXHJcbiAgICAgICAgICBreSxcclxuICAgICAgICAgIGFycmF5T2ZQb2ludHNcclxuICAgICAgICApO1xyXG4gICAgICAgIHNoYXBlLnB1c2gocG9seWdvbik7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBzaGFwZTtcclxufVxyXG5cclxuZnVuY3Rpb24gc3RvcmVTaGFwZXMoc2hhcGU6IFNoYXBlW10pOiBzdHJpbmcge1xyXG4gIHJldHVybiBKU09OLnN0cmluZ2lmeShzaGFwZSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhhbmRsZURvd25sb2FkKHRleHQ6IHN0cmluZyk6IHZvaWQge1xyXG4gIGNvbnN0IGRhdGEgPSBuZXcgRmlsZShbdGV4dF0sIFwic2hhcGVzLmpzb25cIiwgeyB0eXBlOiBcImFwcGxpY2F0aW9uL2pzb25cIiB9KTtcclxuXHJcbiAgY29uc3QgdXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChkYXRhKTtcclxuXHJcbiAgY29uc3QgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xyXG4gIGEuaHJlZiA9IHVybDtcclxuICBhLmRvd25sb2FkID0gZGF0YS5uYW1lO1xyXG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYSk7XHJcbiAgYS5jbGljaygpO1xyXG4gIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoYSk7XHJcbiAgVVJMLnJldm9rZU9iamVjdFVSTCh1cmwpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBoYW5kbGVVcGxvYWQoY2FsbGJhY2s6ICh0ZXh0OiBzdHJpbmcpID0+IHZvaWQpOiB2b2lkIHtcclxuICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICBpbnB1dC50eXBlID0gXCJmaWxlXCI7XHJcbiAgaW5wdXQuYWNjZXB0ID0gXCJhcHBsaWNhdGlvbi9qc29uXCI7XHJcblxyXG4gIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKCkgPT4ge1xyXG4gICAgY29uc3QgZmlsZSA9IGlucHV0LmZpbGVzWzBdO1xyXG4gICAgY29uc3QgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuXHJcbiAgICByZWFkZXIub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICBjYWxsYmFjayhyZWFkZXIucmVzdWx0IGFzIHN0cmluZyk7XHJcbiAgICB9O1xyXG4gICAgcmVhZGVyLnJlYWRBc1RleHQoZmlsZSk7XHJcbiAgfSk7XHJcblxyXG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaW5wdXQpO1xyXG4gIGlucHV0LmNsaWNrKCk7XHJcbiAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChpbnB1dCk7XHJcbn1cclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2luZGV4LnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9