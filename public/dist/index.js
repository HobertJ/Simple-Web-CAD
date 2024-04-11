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
            console.log(`length: ${shapes.length}`);
            if (currentObject.id == shapes.length) {
                currentObject.draw(point);
                // belum dipush ke shapes
                if (currentObject.arrayOfPoints.length >= 3) {
                    console.log("Polygon Drawable");
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
                // isDrawing = false;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUUsR0FBRyxDQUFDLEdBQUcsV0FBVyxDQUFDLEVBQUUsQ0FBQztRQUN2QyxNQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxXQUFXLENBQUMsRUFBRSxDQUFDO1FBQ3ZDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxFQUFFLENBQUM7UUFFdkMsTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztRQUNoQyxNQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7UUFFaEMsTUFBTSxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO1FBQzdDLE1BQU0sR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztRQUM3QyxNQUFNLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7UUFDN0MsTUFBTSxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO1FBQzdDLE1BQU0sR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztRQUM3QyxNQUFNLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7UUFDN0MsTUFBTSxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO1FBQzdDLE1BQU0sR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztRQUM3QyxNQUFNLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7UUFFN0MsTUFBTSxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUM3RSxPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBR00sYUFBYSxDQUFDLEtBQVk7UUFDN0IsTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztRQUNoQyxNQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7UUFFaEMsTUFBTSxFQUFFLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDekQsTUFBTSxFQUFFLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFFekQsTUFBTSxRQUFRLEdBQUcsSUFBSSxlQUFLLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUVy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cGFpbnQvLi9zcmMvMkQtU2hhcGVzL2xpbmUudHMiLCJ3ZWJwYWNrOi8vdHVnYXMtYmVzYXItZ3JhZmtvbS0xLXBhaW50Ly4vc3JjLzJELVNoYXBlcy9wb2x5Z29uLnRzIiwid2VicGFjazovL3R1Z2FzLWJlc2FyLWdyYWZrb20tMS1wYWludC8uL3NyYy8yRC1TaGFwZXMvcmVjdGFuZ2xlLnRzIiwid2VicGFjazovL3R1Z2FzLWJlc2FyLWdyYWZrb20tMS1wYWludC8uL3NyYy8yRC1TaGFwZXMvc2hhcGUudHMiLCJ3ZWJwYWNrOi8vdHVnYXMtYmVzYXItZ3JhZmtvbS0xLXBhaW50Ly4vc3JjLzJELVNoYXBlcy9zcXVhcmUudHMiLCJ3ZWJwYWNrOi8vdHVnYXMtYmVzYXItZ3JhZmtvbS0xLXBhaW50Ly4vc3JjLzJELVNoYXBlcy90eXBlLmVudW0udHMiLCJ3ZWJwYWNrOi8vdHVnYXMtYmVzYXItZ3JhZmtvbS0xLXBhaW50Ly4vc3JjL0Jhc2UvY29vcmRpbmF0ZS50cyIsIndlYnBhY2s6Ly90dWdhcy1iZXNhci1ncmFma29tLTEtcGFpbnQvLi9zcmMvQmFzZS9tYXRyaXgudHMiLCJ3ZWJwYWNrOi8vdHVnYXMtYmVzYXItZ3JhZmtvbS0xLXBhaW50Ly4vc3JjL0Jhc2UvcG9pbnQudHMiLCJ3ZWJwYWNrOi8vdHVnYXMtYmVzYXItZ3JhZmtvbS0xLXBhaW50Ly4vc3JjL0Z1bmN0aW9ucy9jcmVhdGUtc2hhZGVyLXByb2dyYW0udHMiLCJ3ZWJwYWNrOi8vdHVnYXMtYmVzYXItZ3JhZmtvbS0xLXBhaW50Ly4vc3JjL0Z1bmN0aW9ucy9sb2FkLXNoYWRlci50cyIsIndlYnBhY2s6Ly90dWdhcy1iZXNhci1ncmFma29tLTEtcGFpbnQvLi9zcmMvRnVuY3Rpb25zL3JlbmRlci1hbGwudHMiLCJ3ZWJwYWNrOi8vdHVnYXMtYmVzYXItZ3JhZmtvbS0xLXBhaW50Ly4vc3JjL0Z1bmN0aW9ucy9yZW5kZXIudHMiLCJ3ZWJwYWNrOi8vdHVnYXMtYmVzYXItZ3JhZmtvbS0xLXBhaW50Ly4vc3JjL09wZXJhdGlvbnMvVHJhbnNmb3JtYXRpb24udHMiLCJ3ZWJwYWNrOi8vdHVnYXMtYmVzYXItZ3JhZmtvbS0xLXBhaW50Ly4vc3JjL09wZXJhdGlvbnMvY29udmV4LWh1bGwudHMiLCJ3ZWJwYWNrOi8vdHVnYXMtYmVzYXItZ3JhZmtvbS0xLXBhaW50Ly4vc3JjL1V0aWxzL3Rvb2xzLnRzIiwid2VicGFjazovL3R1Z2FzLWJlc2FyLWdyYWZrb20tMS1wYWludC8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly90dWdhcy1iZXNhci1ncmFma29tLTEtcGFpbnQvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdHVnYXMtYmVzYXItZ3JhZmtvbS0xLXBhaW50L3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vdHVnYXMtYmVzYXItZ3JhZmtvbS0xLXBhaW50L3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly90dWdhcy1iZXNhci1ncmFma29tLTEtcGFpbnQvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZW5kZXJhYmxlIGZyb20gXCIuL0ludGVyZmFjZXMvcmVuZGVyYWJsZS5pbnRlcmZhY2VcIjtcclxuaW1wb3J0IFRyYW5zZm9ybWFibGUgZnJvbSBcIi4vSW50ZXJmYWNlcy90cmFuc2Zvcm1hYmxlLmludGVyZmFjZVwiO1xyXG5pbXBvcnQgU2hhcGUgZnJvbSBcIi4vc2hhcGVcIjtcclxuaW1wb3J0IFR5cGUgZnJvbSBcIi4vdHlwZS5lbnVtXCI7XHJcbmltcG9ydCBQb2ludCBmcm9tIFwiLi4vQmFzZS9wb2ludFwiO1xyXG5pbXBvcnQgVHJhbnNmb3JtYXRpb24gZnJvbSBcIk1haW4vT3BlcmF0aW9ucy9UcmFuc2Zvcm1hdGlvblwiO1xyXG5cclxuY2xhc3MgTGluZSBleHRlbmRzIFNoYXBlIGltcGxlbWVudHMgUmVuZGVyYWJsZSwgVHJhbnNmb3JtYWJsZSB7XHJcblxyXG4gICAgcHVibGljIHR5cGU6IFR5cGUuTGluZTtcclxuICAgIHB1YmxpYyBhcnJheU9mUG9pbnRzOiBQb2ludFtdO1xyXG5cclxuICAgIHB1YmxpYyBjZW50ZXI6IFBvaW50O1xyXG4gICAgcHVibGljIHR4OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgdHk6IG51bWJlcjtcclxuICAgIHB1YmxpYyBkZWdyZWU6IG51bWJlcjtcclxuICAgIHB1YmxpYyBzeDogbnVtYmVyO1xyXG4gICAgcHVibGljIHN5OiBudW1iZXI7XHJcbiAgICBwdWJsaWMga3g6IG51bWJlcjtcclxuICAgIHB1YmxpYyBreTogbnVtYmVyO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihpZDogbnVtYmVyLCBwMTogUG9pbnQpIHtcclxuICAgICAgICBzdXBlcihpZCwgMiwgVHlwZS5MaW5lKTtcclxuICAgICAgICB0aGlzLmFycmF5T2ZQb2ludHMgPSBbcDFdO1xyXG4gICAgICAgIHRoaXMudHggPSAwO1xyXG4gICAgICAgIHRoaXMudHkgPSAwO1xyXG4gICAgICAgIHRoaXMuZGVncmVlID0gMDtcclxuICAgICAgICB0aGlzLnN4ID0gMTtcclxuICAgICAgICB0aGlzLnN5ID0gMTtcclxuICAgICAgICB0aGlzLmt4ID0gMDtcclxuICAgICAgICB0aGlzLmt5ID0gMDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBUcmFuc2Zvcm1hYmxlIE1ldGhvZHNcclxuICAgIHB1YmxpYyBhZGRNYXRyaXgoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCwgbWF0cml4TG9jYXRpb246IFdlYkdMVW5pZm9ybUxvY2F0aW9uKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgbWF0cml4ID0gVHJhbnNmb3JtYXRpb24udHJhbnNmb3JtYXRpb25NYXRyaXgoXHJcbiAgICAgICAgICAgIGdsLmNhbnZhcy53aWR0aCxcclxuICAgICAgICAgICAgZ2wuY2FudmFzLmhlaWdodCxcclxuICAgICAgICAgICAgdGhpcy50eCxcclxuICAgICAgICAgICAgdGhpcy50eSxcclxuICAgICAgICAgICAgdGhpcy5kZWdyZWUsXHJcbiAgICAgICAgICAgIHRoaXMuc3gsXHJcbiAgICAgICAgICAgIHRoaXMuc3ksXHJcbiAgICAgICAgICAgIHRoaXMua3gsXHJcbiAgICAgICAgICAgIHRoaXMua3ksXHJcbiAgICAgICAgICAgIHRoaXMuZ2V0Q2VudGVyKClcclxuICAgICAgICAgICkuZmxhdHRlbigpO1xyXG4gICAgICBcclxuICAgICAgICAgIGdsLnVuaWZvcm1NYXRyaXgzZnYobWF0cml4TG9jYXRpb24sIGZhbHNlLCBtYXRyaXgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRDZW50ZXIoKTogUG9pbnQge1xyXG4gICAgICAgIGNvbnN0IG51bVBvaW50cyA9IHRoaXMuYXJyYXlPZlBvaW50cy5sZW5ndGg7XHJcbiAgICAgICAgY29uc29sZS5sb2cobnVtUG9pbnRzKVxyXG4gICAgICAgIGxldCBjZW50ZXJYID0gMDtcclxuICAgICAgICBsZXQgY2VudGVyWSA9IDA7XHJcbiAgICAgICAgZm9yIChjb25zdCBwb2ludCBvZiB0aGlzLmFycmF5T2ZQb2ludHMpIHtcclxuICAgICAgICAgICAgY29uc3QgW3gsIHldID0gcG9pbnQuZ2V0UGFpcigpO1xyXG4gICAgICAgICAgICBjZW50ZXJYICs9IHg7XHJcbiAgICAgICAgICAgIGNlbnRlclkgKz0geTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2VudGVyWCAvPSBudW1Qb2ludHM7XHJcbiAgICAgICAgY2VudGVyWSAvPSBudW1Qb2ludHM7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgUG9pbnQoW2NlbnRlclgsIGNlbnRlclldLCBbMCwgMCwgMCwgMF0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkcmF3TWV0aG9kKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBnbC5MSU5FUztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaXNEcmF3YWJsZSgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aCA9PT0gMjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZHJhdyhwb2ludDogUG9pbnQpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmFycmF5T2ZQb2ludHNbMV0gPSBwb2ludDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0TnVtYmVyT2ZWZXJ0aWNlc1RvQmVEcmF3bigpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiAyO1xyXG4gICAgfSBcclxuICAgIFxyXG4gICAgcHVibGljIGFkZFBvc2l0aW9uKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQpOiB2b2lkIHtcclxuICAgICAgICBnbC5idWZmZXJEYXRhKFxyXG4gICAgICAgICAgICBnbC5BUlJBWV9CVUZGRVIsXHJcbiAgICAgICAgICAgIG5ldyBGbG9hdDMyQXJyYXkoWy4uLnRoaXMuYXJyYXlPZlBvaW50c1swXS5nZXRQYWlyKCksIC4uLnRoaXMuYXJyYXlPZlBvaW50c1sxXS5nZXRQYWlyKCldKSxcclxuICAgICAgICAgICAgZ2wuU1RBVElDX0RSQVdcclxuICAgICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZENvbG9yKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQpOiB2b2lkIHtcclxuICAgICAgICBnbC5idWZmZXJEYXRhKFxyXG4gICAgICAgICAgICBnbC5BUlJBWV9CVUZGRVIsXHJcbiAgICAgICAgICAgIG5ldyBGbG9hdDMyQXJyYXkoWy4uLnRoaXMuYXJyYXlPZlBvaW50c1swXS5nZXRDb2xvcigpLCAuLi50aGlzLmFycmF5T2ZQb2ludHNbMV0uZ2V0Q29sb3IoKV0pLFxyXG4gICAgICAgICAgICBnbC5TVEFUSUNfRFJBV1xyXG4gICAgICAgICAgKTtcclxuICAgIH0gIFxyXG5cclxuICAgIHB1YmxpYyBzZXRMaW5lQXR0cmlidXRlcyh0eDogbnVtYmVyLCB0eTogbnVtYmVyLCBkZWdyZWU6IG51bWJlciwgc3g6IG51bWJlciwgc3k6IG51bWJlciwga3g6IG51bWJlciwga3k6IG51bWJlciwgcDI6IFBvaW50KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5hcnJheU9mUG9pbnRzLnB1c2gocDIpO1xyXG4gICAgICAgIHRoaXMudHggPSB0eDtcclxuICAgICAgICB0aGlzLnR5ID0gdHk7XHJcbiAgICAgICAgdGhpcy5kZWdyZWUgPSBkZWdyZWU7XHJcbiAgICAgICAgdGhpcy5zeCA9IHN4O1xyXG4gICAgICAgIHRoaXMuc3kgPSBzeTtcclxuICAgICAgICB0aGlzLmt4ID0ga3g7XHJcbiAgICAgICAgdGhpcy5reSA9IGt5O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBMaW5lO1xyXG4iLCJpbXBvcnQgVHJhbnNmb3JtYXRpb24gZnJvbSBcIk1haW4vT3BlcmF0aW9ucy9UcmFuc2Zvcm1hdGlvblwiO1xyXG5pbXBvcnQgUmVuZGVyYWJsZSBmcm9tIFwiLi9JbnRlcmZhY2VzL3JlbmRlcmFibGUuaW50ZXJmYWNlXCI7XHJcbmltcG9ydCBUcmFuc2Zvcm1hYmxlIGZyb20gXCIuL0ludGVyZmFjZXMvdHJhbnNmb3JtYWJsZS5pbnRlcmZhY2VcIjtcclxuaW1wb3J0IFNoYXBlIGZyb20gXCIuL3NoYXBlXCI7XHJcbmltcG9ydCBUeXBlIGZyb20gXCIuL3R5cGUuZW51bVwiO1xyXG5pbXBvcnQgUG9pbnQgZnJvbSBcIk1haW4vQmFzZS9wb2ludFwiO1xyXG5pbXBvcnQgY29udmV4SHVsbCBmcm9tIFwiTWFpbi9PcGVyYXRpb25zL2NvbnZleC1odWxsXCI7XHJcblxyXG5jbGFzcyBQb2x5Z29uIGV4dGVuZHMgU2hhcGUgaW1wbGVtZW50cyBSZW5kZXJhYmxlLCBUcmFuc2Zvcm1hYmxlIHtcclxuICAgIHB1YmxpYyB0eXBlOiBUeXBlLlBvbHlnb247XHJcbiAgICBwdWJsaWMgYXJyYXlPZlBvaW50czogUG9pbnRbXTtcclxuXHJcbiAgICBwdWJsaWMgY2VudGVyOiBQb2ludDtcclxuICAgIHB1YmxpYyB0eDogbnVtYmVyO1xyXG4gICAgcHVibGljIHR5OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgZGVncmVlOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgc3g6IG51bWJlcjtcclxuICAgIHB1YmxpYyBzeTogbnVtYmVyO1xyXG4gICAgcHVibGljIGt4OiBudW1iZXI7XHJcbiAgICBwdWJsaWMga3k6IG51bWJlcjtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoaWQ6IG51bWJlciwgcG9pbnQ6IFBvaW50KSB7XHJcbiAgICAgICAgc3VwZXIoaWQsIDEsIFR5cGUuUG9seWdvbik7XHJcbiAgICAgICAgdGhpcy5hcnJheU9mUG9pbnRzID0gbmV3IEFycmF5KHBvaW50KTtcclxuICAgICAgICB0aGlzLnR4ID0gMDtcclxuICAgICAgICB0aGlzLnR5ID0gMDtcclxuICAgICAgICB0aGlzLmRlZ3JlZSA9IDA7XHJcbiAgICAgICAgdGhpcy5zeCA9IDE7XHJcbiAgICAgICAgdGhpcy5zeSA9IDE7XHJcbiAgICAgICAgdGhpcy5reCA9IDA7XHJcbiAgICAgICAgdGhpcy5reSA9IDA7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRDZW50ZXIoKTogUG9pbnQge1xyXG4gICAgICAgIGxldCBzdW1YID0gMDtcclxuICAgICAgICBsZXQgc3VtWSA9IDA7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IFt4LCB5XSA9IHRoaXMuYXJyYXlPZlBvaW50c1tpXS5nZXRQYWlyKCk7XHJcbiAgICAgICAgICAgIHN1bVggKz0geDtcclxuICAgICAgICAgICAgc3VtWSArPSB5O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgY2VudGVyWCA9IHN1bVggLyB0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoO1xyXG4gICAgICAgIGNvbnN0IGNlbnRlclkgPSBzdW1ZIC8gdGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aDtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBQb2ludChbY2VudGVyWCwgY2VudGVyWV0sIFswLCAwLCAwLCAwXSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGlzRHJhd2FibGUoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJyYXlPZlBvaW50cy5sZW5ndGggPj0gMjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZHJhdyAocG9pbnQ6IFBvaW50KTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuYXJyYXlPZlBvaW50cy5sZW5ndGggPj0gMykge1xyXG4gICAgICAgICAgICB0aGlzLmFycmF5T2ZQb2ludHMgPSBjb252ZXhIdWxsKFsuLi50aGlzLmFycmF5T2ZQb2ludHMsIHBvaW50XSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5hcnJheU9mUG9pbnRzW3RoaXMuYXJyYXlPZlBvaW50cy5sZW5ndGhdID0gcG9pbnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY2VudGVyID0gdGhpcy5nZXRDZW50ZXIoKTtcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZHJhd01ldGhvZChnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0KTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aCA+PTMgPyBnbC5UUklBTkdMRV9GQU4gOiBnbC5MSU5FUztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0TnVtYmVyT2ZWZXJ0aWNlc1RvQmVEcmF3bigpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoIDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkUG9zaXRpb24oZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IHZlcnRpY2VzID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoICogMik7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IFt4LCB5XSA9IHRoaXMuYXJyYXlPZlBvaW50c1tpXS5nZXRQYWlyKCk7XHJcbiAgICAgICAgICAgIHZlcnRpY2VzW2kgKiAyXSA9IHg7XHJcbiAgICAgICAgICAgIHZlcnRpY2VzW2kgKiAyICsgMV0gPSB5O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgW3BJbml0aWFsWCwgcEluaXRpYWxZXSA9IHRoaXMuYXJyYXlPZlBvaW50c1swXS5nZXRQYWlyKCk7XHJcbiAgICAgICAgdmVydGljZXNbdGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aCAqIDJdID0gcEluaXRpYWxYO1xyXG4gICAgICAgIHZlcnRpY2VzW3RoaXMuYXJyYXlPZlBvaW50cy5sZW5ndGggKiAyICsgMV0gPSBwSW5pdGlhbFk7XHJcblxyXG4gICAgICAgIGdsLmJ1ZmZlckRhdGEoZ2wuQVJSQVlfQlVGRkVSLCB2ZXJ0aWNlcywgZ2wuU1RBVElDX0RSQVcpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRDb2xvcihnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0KTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgY29sb3JzID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoICogNCk7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IFtyLCBnLCBiLCBhXSA9IHRoaXMuYXJyYXlPZlBvaW50c1tpXS5nZXRDb2xvcigpO1xyXG4gICAgICAgICAgICBjb2xvcnNbaSAqIDRdID0gcjtcclxuICAgICAgICAgICAgY29sb3JzW2kgKiA0ICsgMV0gPSBnO1xyXG4gICAgICAgICAgICBjb2xvcnNbaSAqIDQgKyAyXSA9IGI7XHJcbiAgICAgICAgICAgIGNvbG9yc1tpICogNCArIDNdID0gYTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IFtySW5pdGlhbCwgZ0luaXRpYWwsIGJJbml0aWFsLCBhSW5pdGlhbF0gPSB0aGlzLmFycmF5T2ZQb2ludHNbMF0uZ2V0Q29sb3IoKTtcclxuICAgICAgICBjb2xvcnNbdGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aCAqIDRdID0gckluaXRpYWw7XHJcbiAgICAgICAgY29sb3JzW3RoaXMuYXJyYXlPZlBvaW50cy5sZW5ndGggKiA0ICsgMV0gPSBnSW5pdGlhbDtcclxuICAgICAgICBjb2xvcnNbdGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aCAqIDQgKyAyXSA9IGJJbml0aWFsO1xyXG4gICAgICAgIGNvbG9yc1t0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoICogNCArIDNdID0gYUluaXRpYWw7XHJcblxyXG4gICAgICAgIGdsLmJ1ZmZlckRhdGEoZ2wuQVJSQVlfQlVGRkVSLCBjb2xvcnMsIGdsLlNUQVRJQ19EUkFXKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBhZGRNYXRyaXgoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCwgbWF0cml4TG9jYXRpb246IFdlYkdMVW5pZm9ybUxvY2F0aW9uKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgbWF0cml4ID0gVHJhbnNmb3JtYXRpb24udHJhbnNmb3JtYXRpb25NYXRyaXgoXHJcbiAgICAgICAgICAgIGdsLmNhbnZhcy53aWR0aCxcclxuICAgICAgICAgICAgZ2wuY2FudmFzLmhlaWdodCxcclxuICAgICAgICAgICAgdGhpcy50eCxcclxuICAgICAgICAgICAgdGhpcy50eSxcclxuICAgICAgICAgICAgdGhpcy5kZWdyZWUsXHJcbiAgICAgICAgICAgIHRoaXMuc3gsXHJcbiAgICAgICAgICAgIHRoaXMuc3ksXHJcbiAgICAgICAgICAgIHRoaXMua3gsXHJcbiAgICAgICAgICAgIHRoaXMua3ksXHJcbiAgICAgICAgICAgIHRoaXMuY2VudGVyXHJcbiAgICAgICAgICApLmZsYXR0ZW4oKTtcclxuICAgICAgXHJcbiAgICAgICAgICBnbC51bmlmb3JtTWF0cml4M2Z2KG1hdHJpeExvY2F0aW9uLCBmYWxzZSwgbWF0cml4KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGVsZXRlUG9pbnQoaW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgIHZhciBuZXdQb2ludHM6IFBvaW50W10gPSBbdGhpcy5hcnJheU9mUG9pbnRzW2luZGV4XV07XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgIGlmIChpICE9IGluZGV4KSB7XHJcbiAgICAgICAgICAgIG5ld1BvaW50cy5wdXNoKHRoaXMuYXJyYXlPZlBvaW50c1tpXSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgXHJcbiAgICAgICAgdGhpcy5hcnJheU9mUG9pbnRzID0gbmV3UG9pbnRzLnNsaWNlKDEsIHRoaXMuYXJyYXlPZlBvaW50cy5sZW5ndGgpO1xyXG4gICAgXHJcbiAgICAgICAgLy8gYWZ0ZXIgZGVsZXRlLCBuZWVkIHRvIHNldHVwIG9wdGlvbiBhZ2FpblxyXG4gICAgICAgIGNvbnN0IHBvaW50UGlja2VyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwb2ludFBpY2tlclwiKTtcclxuICAgICAgICBwb2ludFBpY2tlci5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICAgIHBvaW50UGlja2VyLnJlcGxhY2VDaGlsZHJlbigpO1xyXG4gICAgICAgIC8qIEFsbCBQb2ludCAqL1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICBjb25zdCBuZXdQb2ludCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XHJcbiAgICAgICAgICBuZXdQb2ludC52YWx1ZSA9IGkudG9TdHJpbmcoKTtcclxuICAgICAgICAgIG5ld1BvaW50LnRleHQgPSBcInBvaW50X1wiICsgaTtcclxuICAgICAgICAgIHBvaW50UGlja2VyLmFwcGVuZENoaWxkKG5ld1BvaW50KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHB1YmxpYyBzZXRQb2x5Z29uQXR0cmlidXRlcyh0eDogbnVtYmVyLCB0eTogbnVtYmVyLCBkZWdyZWU6IG51bWJlciwgc3g6IG51bWJlciwgc3k6IG51bWJlciwga3g6IG51bWJlciwga3k6IG51bWJlciwgYXJyYXlPZlBvaW50czogUG9pbnRbXSk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuYXJyYXlPZlBvaW50cyA9IGFycmF5T2ZQb2ludHM7XHJcbiAgICAgICAgdGhpcy50eCA9IHR4O1xyXG4gICAgICAgIHRoaXMudHkgPSB0eTtcclxuICAgICAgICB0aGlzLmRlZ3JlZSA9IGRlZ3JlZTtcclxuICAgICAgICB0aGlzLnN4ID0gc3g7XHJcbiAgICAgICAgdGhpcy5zeSA9IHN5O1xyXG4gICAgICAgIHRoaXMua3ggPSBreDtcclxuICAgICAgICB0aGlzLmt5ID0ga3k7XHJcbiAgICAgIH1cclxuICAgIFxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBQb2x5Z29uOyIsImltcG9ydCBTaGFwZSBmcm9tIFwiU2hhcGVzL3NoYXBlXCI7XHJcbmltcG9ydCBQb2ludCBmcm9tIFwiQmFzZS9wb2ludFwiO1xyXG5pbXBvcnQgVHlwZSBmcm9tIFwiU2hhcGVzL3R5cGUuZW51bVwiO1xyXG5pbXBvcnQgUmVuZGVyYWJsZSBmcm9tIFwiTWFpbi8yRC1TaGFwZXMvSW50ZXJmYWNlcy9yZW5kZXJhYmxlLmludGVyZmFjZVwiO1xyXG5pbXBvcnQgVHJhbnNmb3JtYWJsZSBmcm9tIFwiU2hhcGVzL0ludGVyZmFjZXMvdHJhbnNmb3JtYWJsZS5pbnRlcmZhY2VcIjtcclxuaW1wb3J0IFRyYW5zZm9ybWF0aW9uIGZyb20gXCJNYWluL09wZXJhdGlvbnMvVHJhbnNmb3JtYXRpb25cIjtcclxuXHJcbmNsYXNzIFJlY3RhbmdsZSBleHRlbmRzIFNoYXBlIGltcGxlbWVudHMgUmVuZGVyYWJsZSwgVHJhbnNmb3JtYWJsZSB7XHJcbiAgICBwdWJsaWMgYXJyYXlPZlBvaW50czogUG9pbnRbXTtcclxuICAgIHB1YmxpYyBjZW50ZXI6IFBvaW50O1xyXG4gICAgcHVibGljIHR4OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgdHk6IG51bWJlcjtcclxuICAgIHB1YmxpYyBkZWdyZWU6IG51bWJlcjtcclxuICAgIHB1YmxpYyBzeDogbnVtYmVyO1xyXG4gICAgcHVibGljIHN5OiBudW1iZXI7XHJcbiAgICBwdWJsaWMga3g6IG51bWJlcjtcclxuICAgIHB1YmxpYyBreTogbnVtYmVyO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihpZDogbnVtYmVyLCAgcDE6IFBvaW50KXtcclxuICAgICAgICBzdXBlcihpZCwgNCwgVHlwZS5SZWN0YW5nbGUpO1xyXG4gICAgICAgIHRoaXMuYXJyYXlPZlBvaW50cyA9IFtwMSwgbnVsbCwgbnVsbCwgbnVsbF07XHJcbiAgICAgICAgdGhpcy50eCA9IDA7XHJcbiAgICAgICAgdGhpcy50eSA9IDA7XHJcbiAgICAgICAgdGhpcy5kZWdyZWUgPSAwO1xyXG4gICAgICAgIHRoaXMuc3ggPSAxO1xyXG4gICAgICAgIHRoaXMuc3kgPSAxO1xyXG4gICAgICAgIHRoaXMua3ggPSAwO1xyXG4gICAgICAgIHRoaXMua3kgPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFRyYW5zZm9ybWFibGUgTWV0aG9kc1xyXG4gICAgcHVibGljIGdldENlbnRlcigpOiBQb2ludCB7XHJcbiAgICAgICAgY29uc3QgW3AxeCwgcDF5XSA9IHRoaXMuYXJyYXlPZlBvaW50c1swXS5nZXRQYWlyKCk7XHJcbiAgICAgICAgY29uc3QgW3AyeCwgcDJ5XSA9IHRoaXMuYXJyYXlPZlBvaW50c1sxXS5nZXRQYWlyKCk7XHJcbiAgICAgICAgY29uc3QgW3AzeCwgcDN5XSA9IHRoaXMuYXJyYXlPZlBvaW50c1syXS5nZXRQYWlyKCk7XHJcbiAgICAgICAgY29uc3QgW3A0eCwgcDR5XSA9IHRoaXMuYXJyYXlPZlBvaW50c1szXS5nZXRQYWlyKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGNlbnRlclggPSAocDF4ICsgcDJ4ICsgcDN4ICsgcDR4KSAvIDQ7XHJcbiAgICAgICAgY29uc3QgY2VudGVyWSA9IChwMXkgKyBwMnkgKyBwM3kgKyBwNHkpIC8gNDtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gbmV3IFBvaW50KFtjZW50ZXJYLCBjZW50ZXJZXSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZE1hdHJpeChnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LCBtYXRyaXhMb2NhdGlvbjogV2ViR0xVbmlmb3JtTG9jYXRpb24pOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBtYXRyaXggPSBUcmFuc2Zvcm1hdGlvbi50cmFuc2Zvcm1hdGlvbk1hdHJpeChcclxuICAgICAgICAgICAgZ2wuY2FudmFzLndpZHRoLFxyXG4gICAgICAgICAgICBnbC5jYW52YXMuaGVpZ2h0LFxyXG4gICAgICAgICAgICB0aGlzLnR4LFxyXG4gICAgICAgICAgICB0aGlzLnR5LFxyXG4gICAgICAgICAgICB0aGlzLmRlZ3JlZSxcclxuICAgICAgICAgICAgdGhpcy5zeCxcclxuICAgICAgICAgICAgdGhpcy5zeSxcclxuICAgICAgICAgICAgdGhpcy5reCxcclxuICAgICAgICAgICAgdGhpcy5reSxcclxuICAgICAgICAgICAgdGhpcy5jZW50ZXJcclxuICAgICAgICAgICkuZmxhdHRlbigpO1xyXG4gICAgICBcclxuICAgICAgICAgIGdsLnVuaWZvcm1NYXRyaXgzZnYobWF0cml4TG9jYXRpb24sIGZhbHNlLCBtYXRyaXgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFJlbmRlcmFibGUgTWV0aG9kc1xyXG4gICAgcHVibGljIGRyYXdNZXRob2QoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIGdsLlRSSUFOR0xFX0ZBTjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaXNEcmF3YWJsZSgpOiBib29sZWFuIHtcclxuICAgICAgICAvLyByZXR1cm4gdGhpcy5hcnJheU9mUG9pbnRzLmZpbHRlcihwb2ludCA9PiBwb2ludCAhPT0gbnVsbCkubGVuZ3RoID09PSA0O1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFycmF5T2ZQb2ludHNbMl0gIT09IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRyYXcocG9pbnQ6IFBvaW50KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5hcnJheU9mUG9pbnRzWzFdID0gbmV3IFBvaW50KFt0aGlzLmFycmF5T2ZQb2ludHNbMF0ueCwgcG9pbnQueV0pO1xyXG4gICAgICAgIHRoaXMuYXJyYXlPZlBvaW50c1syXSA9IHBvaW50O1xyXG4gICAgICAgIHRoaXMuYXJyYXlPZlBvaW50c1szXSA9IG5ldyBQb2ludChbcG9pbnQueCwgdGhpcy5hcnJheU9mUG9pbnRzWzBdLnldKTtcclxuICAgICAgICB0aGlzLmNlbnRlciA9IHRoaXMuZ2V0Q2VudGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldE51bWJlck9mVmVydGljZXNUb0JlRHJhd24oKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gNTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkUG9zaXRpb24oZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCk6IHZvaWQge1xyXG4gICAgICAgIGdsLmJ1ZmZlckRhdGEoXHJcbiAgICAgICAgICAgIGdsLkFSUkFZX0JVRkZFUixcclxuICAgICAgICAgICAgbmV3IEZsb2F0MzJBcnJheShbXHJcbiAgICAgICAgICAgICAgLi4udGhpcy5hcnJheU9mUG9pbnRzWzBdLmdldFBhaXIoKSxcclxuICAgICAgICAgICAgICAuLi50aGlzLmFycmF5T2ZQb2ludHNbMV0uZ2V0UGFpcigpLFxyXG4gICAgICAgICAgICAgIC4uLnRoaXMuYXJyYXlPZlBvaW50c1syXS5nZXRQYWlyKCksXHJcbiAgICAgICAgICAgICAgLi4udGhpcy5hcnJheU9mUG9pbnRzWzNdLmdldFBhaXIoKSxcclxuICAgICAgICAgICAgICAuLi50aGlzLmFycmF5T2ZQb2ludHNbMF0uZ2V0UGFpcigpLFxyXG4gICAgICAgICAgICBdKSxcclxuICAgICAgICAgICAgZ2wuU1RBVElDX0RSQVdcclxuICAgICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZENvbG9yKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQpOiB2b2lkIHtcclxuICAgICAgICBnbC5idWZmZXJEYXRhKFxyXG4gICAgICAgICAgICBnbC5BUlJBWV9CVUZGRVIsXHJcbiAgICAgICAgICAgIG5ldyBGbG9hdDMyQXJyYXkoW1xyXG4gICAgICAgICAgICAgIC4uLnRoaXMuYXJyYXlPZlBvaW50c1swXS5nZXRDb2xvcigpLFxyXG4gICAgICAgICAgICAgIC4uLnRoaXMuYXJyYXlPZlBvaW50c1sxXS5nZXRDb2xvcigpLFxyXG4gICAgICAgICAgICAgIC4uLnRoaXMuYXJyYXlPZlBvaW50c1syXS5nZXRDb2xvcigpLFxyXG4gICAgICAgICAgICAgIC4uLnRoaXMuYXJyYXlPZlBvaW50c1szXS5nZXRDb2xvcigpLFxyXG4gICAgICAgICAgICAgIC4uLnRoaXMuYXJyYXlPZlBvaW50c1swXS5nZXRDb2xvcigpLFxyXG4gICAgICAgICAgICBdKSxcclxuICAgICAgICAgICAgZ2wuU1RBVElDX0RSQVdcclxuICAgICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldFJlY3RhbmdsZUF0dHJpYnV0ZXModHg6IG51bWJlciwgdHk6IG51bWJlciwgZGVncmVlOiBudW1iZXIsIHN4OiBudW1iZXIsIHN5OiBudW1iZXIsIGt4OiBudW1iZXIsIGt5OiBudW1iZXIsIGFycmF5T2ZQb2ludHM6IFBvaW50W10pOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmFycmF5T2ZQb2ludHMgPSBhcnJheU9mUG9pbnRzO1xyXG4gICAgICAgIHRoaXMudHggPSB0eDtcclxuICAgICAgICB0aGlzLnR5ID0gdHk7XHJcbiAgICAgICAgdGhpcy5kZWdyZWUgPSBkZWdyZWU7XHJcbiAgICAgICAgdGhpcy5zeCA9IHN4O1xyXG4gICAgICAgIHRoaXMuc3kgPSBzeTtcclxuICAgICAgICB0aGlzLmt4ID0ga3g7XHJcbiAgICAgICAgdGhpcy5reSA9IGt5O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBSZWN0YW5nbGU7XHJcbiIsImltcG9ydCBQb2ludCBmcm9tIFwiQmFzZS9wb2ludFwiO1xyXG5pbXBvcnQgVHlwZSBmcm9tIFwiU2hhcGVzL3R5cGUuZW51bVwiO1xyXG5hYnN0cmFjdCBjbGFzcyBTaGFwZSB7XHJcbiAgICBwdWJsaWMgaWQ6IG51bWJlcjtcclxuICAgIHB1YmxpYyBudW1iZXJPZlZlcnRpY2VzOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgdHlwZTogVHlwZTtcclxuICAgIHB1YmxpYyBhcnJheU9mUG9pbnRzOiBQb2ludFtdO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihpZDogbnVtYmVyLCBudW1iZXJPZlZlcnRpY2VzOiBudW1iZXIsIHR5cGU6IFR5cGUpe1xyXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcclxuICAgICAgICB0aGlzLm51bWJlck9mVmVydGljZXMgPSBudW1iZXJPZlZlcnRpY2VzO1xyXG4gICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFic3RyYWN0IGdldENlbnRlcigpOiBQb2ludDtcclxuICAgIHB1YmxpYyBhYnN0cmFjdCBpc0RyYXdhYmxlKCk6IGJvb2xlYW47XHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgZHJhdyhwb2ludDogUG9pbnQpOiB2b2lkO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBTaGFwZTsiLCJpbXBvcnQgUmVuZGVyYWJsZSBmcm9tIFwiLi9JbnRlcmZhY2VzL3JlbmRlcmFibGUuaW50ZXJmYWNlXCI7XHJcbmltcG9ydCBTaGFwZSBmcm9tIFwiLi9zaGFwZVwiO1xyXG5pbXBvcnQgVHJhbnNmb3JtYXRpb24gZnJvbSBcIk1haW4vT3BlcmF0aW9ucy9UcmFuc2Zvcm1hdGlvblwiO1xyXG5pbXBvcnQgVHJhbnNmb3JtYWJsZSBmcm9tIFwiLi9JbnRlcmZhY2VzL3RyYW5zZm9ybWFibGUuaW50ZXJmYWNlXCI7XHJcbmltcG9ydCBQb2ludCBmcm9tIFwiLi4vQmFzZS9wb2ludFwiO1xyXG5pbXBvcnQgVHlwZSBmcm9tIFwiLi90eXBlLmVudW1cIjtcclxuXHJcbmNsYXNzIFNxdWFyZSBleHRlbmRzIFNoYXBlIGltcGxlbWVudHMgUmVuZGVyYWJsZSwgVHJhbnNmb3JtYWJsZSB7XHJcbiAgcHVibGljIGNlbnRlcjogUG9pbnQ7XHJcbiAgcHVibGljIGFycmF5T2ZQb2ludHM6IFBvaW50W107XHJcbiAgcHVibGljIHR4OiBudW1iZXI7XHJcbiAgcHVibGljIHR5OiBudW1iZXI7XHJcbiAgcHVibGljIGRlZ3JlZTogbnVtYmVyO1xyXG4gIHB1YmxpYyBzeDogbnVtYmVyO1xyXG4gIHB1YmxpYyBzeTogbnVtYmVyO1xyXG4gIHB1YmxpYyBreDogbnVtYmVyO1xyXG4gIHB1YmxpYyBreTogbnVtYmVyO1xyXG5cclxuICBwdWJsaWMgY29uc3RydWN0b3IoaWQ6IG51bWJlciwgY2VudGVyUG9pbnQ6IFBvaW50KSB7XHJcbiAgICBzdXBlcihpZCwgNCwgVHlwZS5TcXVhcmUpO1xyXG4gICAgdGhpcy5jZW50ZXIgPSBjZW50ZXJQb2ludDtcclxuICAgIHRoaXMuYXJyYXlPZlBvaW50cyA9IFtudWxsLCBudWxsLCBudWxsLCBudWxsXTtcclxuICAgIHRoaXMudHggPSAwO1xyXG4gICAgdGhpcy50eSA9IDA7XHJcbiAgICB0aGlzLmRlZ3JlZSA9IDA7XHJcbiAgICB0aGlzLnN4ID0gMTtcclxuICAgIHRoaXMuc3kgPSAxO1xyXG4gICAgdGhpcy5reCA9IDA7XHJcbiAgICB0aGlzLmt5ID0gMDtcclxuICB9XHJcblxyXG4gIC8vIFRyYW5zZm9ybWFibGUgTWV0aG9kc1xyXG4gIHB1YmxpYyBnZXRDZW50ZXIoKTogUG9pbnQge1xyXG4gICAgcmV0dXJuIHRoaXMuY2VudGVyO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGFkZE1hdHJpeChcclxuICAgIGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsXHJcbiAgICBtYXRyaXhMb2NhdGlvbjogV2ViR0xVbmlmb3JtTG9jYXRpb25cclxuICApOiB2b2lkIHtcclxuICAgIGNvbnN0IG1hdHJpeCA9IFRyYW5zZm9ybWF0aW9uLnRyYW5zZm9ybWF0aW9uTWF0cml4KFxyXG4gICAgICBnbC5jYW52YXMud2lkdGgsXHJcbiAgICAgIGdsLmNhbnZhcy5oZWlnaHQsXHJcbiAgICAgIHRoaXMudHgsXHJcbiAgICAgIHRoaXMudHksXHJcbiAgICAgIHRoaXMuZGVncmVlLFxyXG4gICAgICB0aGlzLnN4LFxyXG4gICAgICB0aGlzLnN5LFxyXG4gICAgICB0aGlzLmt4LFxyXG4gICAgICB0aGlzLmt5LFxyXG4gICAgICB0aGlzLmNlbnRlclxyXG4gICAgKS5mbGF0dGVuKCk7XHJcblxyXG4gICAgZ2wudW5pZm9ybU1hdHJpeDNmdihtYXRyaXhMb2NhdGlvbiwgZmFsc2UsIG1hdHJpeCk7XHJcbiAgfVxyXG5cclxuICAvLyBSZW5kZXJhYmxlIE1ldGhvZHNcclxuICBwdWJsaWMgZHJhd01ldGhvZChnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0KTogbnVtYmVyIHtcclxuICAgIHJldHVybiBnbC5UUklBTkdMRV9GQU47XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgaXNEcmF3YWJsZSgpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoID09PSA0O1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGRyYXcocDE6IFBvaW50KTogdm9pZCB7XHJcbiAgICB0aGlzLmFycmF5T2ZQb2ludHNbMF0gPSBwMTtcclxuICAgIGNvbnN0IFt4Q2VudGVyLCB5Q2VudGVyXSA9IHRoaXMuY2VudGVyLmdldFBhaXIoKTtcclxuICAgIC8vIGZvciAobGV0IGkgPSAxOyBpIDw9IDM7IGkrKykge1xyXG4gICAgLy8gICAgIGNvbnN0IGFuZ2xlID0gKGkgKiBNYXRoLlBJKSAvIDI7XHJcbiAgICAvLyAgICAgY29uc3Qgcm90YXRlZFBvaW50ID0gVHJhbnNmb3JtYXRpb24udHJhbnNsYXRpb24odGhpcy5jZW50ZXIuZ2V0WCgpLCB0aGlzLmNlbnRlci5nZXRZKCkpXHJcbiAgICAvLyAgICAgICAgIC5tdWx0aXBseU1hdHJpeChUcmFuc2Zvcm1hdGlvbi5yb3RhdGlvbihhbmdsZSkpXHJcbiAgICAvLyAgICAgICAgIC5tdWx0aXBseU1hdHJpeChUcmFuc2Zvcm1hdGlvbi50cmFuc2xhdGlvbigtdGhpcy5jZW50ZXIuZ2V0WCgpLCAtdGhpcy5jZW50ZXIuZ2V0WSgpKSlcclxuICAgIC8vICAgICAgICAgLm11bHRpcGx5UG9pbnQocDEpO1xyXG4gICAgLy8gICAgIHRoaXMuYXJyYXlPZlBvaW50c1tpXSA9IHJvdGF0ZWRQb2ludDtcclxuICAgIC8vIH1cclxuXHJcbiAgICB0aGlzLmFycmF5T2ZQb2ludHNbMV0gPSBUcmFuc2Zvcm1hdGlvbi50cmFuc2xhdGlvbih4Q2VudGVyLCB5Q2VudGVyKVxyXG4gICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24ucm90YXRpb24oMC41ICogTWF0aC5QSSkpXHJcbiAgICAgIC5tdWx0aXBseU1hdHJpeChUcmFuc2Zvcm1hdGlvbi50cmFuc2xhdGlvbigteENlbnRlciwgLXlDZW50ZXIpKVxyXG4gICAgICAubXVsdGlwbHlQb2ludCh0aGlzLmFycmF5T2ZQb2ludHNbMF0pO1xyXG5cclxuICAgIHRoaXMuYXJyYXlPZlBvaW50c1syXSA9IFRyYW5zZm9ybWF0aW9uLnRyYW5zbGF0aW9uKHhDZW50ZXIsIHlDZW50ZXIpXHJcbiAgICAgIC5tdWx0aXBseU1hdHJpeChUcmFuc2Zvcm1hdGlvbi5yb3RhdGlvbihNYXRoLlBJKSlcclxuICAgICAgLm11bHRpcGx5TWF0cml4KFRyYW5zZm9ybWF0aW9uLnRyYW5zbGF0aW9uKC14Q2VudGVyLCAteUNlbnRlcikpXHJcbiAgICAgIC5tdWx0aXBseVBvaW50KHRoaXMuYXJyYXlPZlBvaW50c1swXSk7XHJcblxyXG4gICAgdGhpcy5hcnJheU9mUG9pbnRzWzNdID0gVHJhbnNmb3JtYXRpb24udHJhbnNsYXRpb24oeENlbnRlciwgeUNlbnRlcilcclxuICAgICAgLm11bHRpcGx5TWF0cml4KFRyYW5zZm9ybWF0aW9uLnJvdGF0aW9uKDEuNSAqIE1hdGguUEkpKVxyXG4gICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24udHJhbnNsYXRpb24oLXhDZW50ZXIsIC15Q2VudGVyKSlcclxuICAgICAgLm11bHRpcGx5UG9pbnQodGhpcy5hcnJheU9mUG9pbnRzWzBdKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBnZXROdW1iZXJPZlZlcnRpY2VzVG9CZURyYXduKCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gNTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhZGRQb3NpdGlvbihnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0KTogdm9pZCB7XHJcbiAgICBnbC5idWZmZXJEYXRhKFxyXG4gICAgICBnbC5BUlJBWV9CVUZGRVIsXHJcbiAgICAgIG5ldyBGbG9hdDMyQXJyYXkoW1xyXG4gICAgICAgIC4uLnRoaXMuYXJyYXlPZlBvaW50c1swXS5nZXRQYWlyKCksXHJcbiAgICAgICAgLi4udGhpcy5hcnJheU9mUG9pbnRzWzFdLmdldFBhaXIoKSxcclxuICAgICAgICAuLi50aGlzLmFycmF5T2ZQb2ludHNbMl0uZ2V0UGFpcigpLFxyXG4gICAgICAgIC4uLnRoaXMuYXJyYXlPZlBvaW50c1szXS5nZXRQYWlyKCksXHJcbiAgICAgICAgLi4udGhpcy5hcnJheU9mUG9pbnRzWzBdLmdldFBhaXIoKSxcclxuICAgICAgXSksXHJcbiAgICAgIGdsLlNUQVRJQ19EUkFXXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGFkZENvbG9yKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQpOiB2b2lkIHtcclxuICAgIGdsLmJ1ZmZlckRhdGEoXHJcbiAgICAgIGdsLkFSUkFZX0JVRkZFUixcclxuICAgICAgbmV3IEZsb2F0MzJBcnJheShbXHJcbiAgICAgICAgLi4udGhpcy5hcnJheU9mUG9pbnRzWzBdLmdldENvbG9yKCksXHJcbiAgICAgICAgLi4udGhpcy5hcnJheU9mUG9pbnRzWzFdLmdldENvbG9yKCksXHJcbiAgICAgICAgLi4udGhpcy5hcnJheU9mUG9pbnRzWzJdLmdldENvbG9yKCksXHJcbiAgICAgICAgLi4udGhpcy5hcnJheU9mUG9pbnRzWzNdLmdldENvbG9yKCksXHJcbiAgICAgICAgLi4udGhpcy5hcnJheU9mUG9pbnRzWzBdLmdldENvbG9yKCksXHJcbiAgICAgIF0pLFxyXG4gICAgICBnbC5TVEFUSUNfRFJBV1xyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzZXRTcXVhcmVBdHRyaWJ1dGVzKFxyXG4gICAgdHg6IG51bWJlcixcclxuICAgIHR5OiBudW1iZXIsXHJcbiAgICBkZWdyZWU6IG51bWJlcixcclxuICAgIHN4OiBudW1iZXIsXHJcbiAgICBzeTogbnVtYmVyLFxyXG4gICAga3g6IG51bWJlcixcclxuICAgIGt5OiBudW1iZXIsXHJcbiAgICBhcnJheU9mUG9pbnRzOiBQb2ludFtdXHJcbiAgKTogdm9pZCB7XHJcbiAgICB0aGlzLmFycmF5T2ZQb2ludHMgPSBhcnJheU9mUG9pbnRzO1xyXG4gICAgdGhpcy50eCA9IHR4O1xyXG4gICAgdGhpcy50eSA9IHR5O1xyXG4gICAgdGhpcy5kZWdyZWUgPSBkZWdyZWU7XHJcbiAgICB0aGlzLnN4ID0gc3g7XHJcbiAgICB0aGlzLnN5ID0gc3k7XHJcbiAgICB0aGlzLmt4ID0ga3g7XHJcbiAgICB0aGlzLmt5ID0ga3k7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBTcXVhcmU7XHJcbiIsImVudW0gVHlwZSB7XHJcbiAgICBMaW5lLFxyXG4gICAgUmVjdGFuZ2xlLFxyXG4gICAgU3F1YXJlLFxyXG4gICAgUG9seWdvblxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBUeXBlOyIsImNsYXNzIENvb3JkaW5hdGUge1xyXG4gICAgcHVibGljIHg6IG51bWJlcjtcclxuICAgIHB1YmxpYyB5OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgdzogbnVtYmVyO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcih4OiBudW1iZXIsIHk6IG51bWJlciwgdzogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICB0aGlzLnkgPSB5O1xyXG4gICAgICAgIHRoaXMudyA9IHc7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldENvb3JkaW5hdGUoKTogW251bWJlciwgbnVtYmVyLCBudW1iZXJdIHtcclxuICAgICAgICByZXR1cm4gW3RoaXMueCwgdGhpcy55LCB0aGlzLnddO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRDb29yZGluYXRlKHg6IG51bWJlciwgeTogbnVtYmVyLCB3OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICAgICAgdGhpcy53ID0gdztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0WCh4OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRZKHk6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldFcodzogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy53ID0gdztcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIGdldFgoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy54O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRZKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMueTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0VygpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnc7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IENvb3JkaW5hdGU7IiwiaW1wb3J0IENvb3JkaW5hdGUgZnJvbSAnQmFzZS9jb29yZGluYXRlJztcclxuaW1wb3J0IFBvaW50IGZyb20gJ0Jhc2UvcG9pbnQnO1xyXG5cclxuY2xhc3MgTWF0cml4IHtcclxuICAgIHB1YmxpYyBtMTogW251bWJlciwgbnVtYmVyLCBudW1iZXJdO1xyXG4gICAgcHVibGljIG0yOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl07XHJcbiAgICBwdWJsaWMgbTM6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXTtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IobTE6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSwgbTI6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSwgbTM6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSkge1xyXG4gICAgICAgIHRoaXMubTEgPSBtMTtcclxuICAgICAgICB0aGlzLm0yID0gbTI7XHJcbiAgICAgICAgdGhpcy5tMyA9IG0zO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBmbGF0dGVuKCkgOiBudW1iZXJbXSB7XHJcbiAgICAgICAgcmV0dXJuIFsuLi50aGlzLm0xLCAuLi50aGlzLm0yLCAuLi50aGlzLm0zXVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBtdWx0aXBseU1hdHJpeChvdGhlck1hdHJpeDogTWF0cml4KTogTWF0cml4IHtcclxuICAgICAgICBjb25zdCBbYTExLCBhMjEsIGEzMV0gPSBvdGhlck1hdHJpeC5tMTtcclxuICAgICAgICBjb25zdCBbYTEyLCBhMjIsIGEzMl0gPSBvdGhlck1hdHJpeC5tMjtcclxuICAgICAgICBjb25zdCBbYTEzLCBhMjMsIGEzM10gPSBvdGhlck1hdHJpeC5tMztcclxuXHJcbiAgICAgICAgY29uc3QgW2IxMSwgYjEyLCBiMTNdID0gdGhpcy5tMTtcclxuICAgICAgICBjb25zdCBbYjIxLCBiMjIsIGIyM10gPSB0aGlzLm0yO1xyXG4gICAgICAgIGNvbnN0IFtiMzEsIGIzMiwgYjMzXSA9IHRoaXMubTM7XHJcblxyXG4gICAgICAgIGNvbnN0IGMxMSA9IGIxMSAqIGExMSArIGIyMSAqIGEyMSArIGIzMSAqIGEzMVxyXG4gICAgICAgIGNvbnN0IGMxMiA9IGIxMSAqIGExMiArIGIyMSAqIGEyMiArIGIzMSAqIGEzMlxyXG4gICAgICAgIGNvbnN0IGMxMyA9IGIxMSAqIGExMyArIGIyMSAqIGEyMyArIGIzMSAqIGEzM1xyXG4gICAgICAgIGNvbnN0IGMyMSA9IGIxMiAqIGExMSArIGIyMiAqIGEyMSArIGIzMiAqIGEzMVxyXG4gICAgICAgIGNvbnN0IGMyMiA9IGIxMiAqIGExMiArIGIyMiAqIGEyMiArIGIzMiAqIGEzMlxyXG4gICAgICAgIGNvbnN0IGMyMyA9IGIxMiAqIGExMyArIGIyMiAqIGEyMyArIGIzMiAqIGEzM1xyXG4gICAgICAgIGNvbnN0IGMzMSA9IGIxMyAqIGExMSArIGIyMyAqIGEyMSArIGIzMyAqIGEzMVxyXG4gICAgICAgIGNvbnN0IGMzMiA9IGIxMyAqIGExMiArIGIyMyAqIGEyMiArIGIzMyAqIGEzMlxyXG4gICAgICAgIGNvbnN0IGMzMyA9IGIxMyAqIGExMyArIGIyMyAqIGEyMyArIGIzMyAqIGEzM1xyXG5cclxuICAgICAgICBjb25zdCBtYXRyaXggPSBuZXcgTWF0cml4KFtjMTEsIGMyMSwgYzMxXSwgW2MxMiwgYzIyLCBjMzJdLCBbYzEzLCBjMjMsIGMzM10pO1xyXG4gICAgICAgIHJldHVybiBtYXRyaXg7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHB1YmxpYyBtdWx0aXBseVBvaW50KHBvaW50OiBQb2ludCk6IFBvaW50IHtcclxuICAgICAgICBjb25zdCBbYTExLCBhMjEsIGEzMV0gPSB0aGlzLm0xO1xyXG4gICAgICAgIGNvbnN0IFthMTIsIGEyMiwgYTMyXSA9IHRoaXMubTI7XHJcbiAgICAgICAgY29uc3QgW2ExMywgYTIzLCBhMzNdID0gdGhpcy5tMztcclxuXHJcbiAgICAgICAgY29uc3QgeDEgPSBhMTEgKiBwb2ludC54ICsgYTEyICogcG9pbnQueSArIGExMyAqIHBvaW50Lnc7XHJcbiAgICAgICAgY29uc3QgeTEgPSBhMjEgKiBwb2ludC54ICsgYTIyICogcG9pbnQueSArIGEyMyAqIHBvaW50Lnc7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgbmV3UG9pbnQgPSBuZXcgUG9pbnQoW3gxLCB5MV0pO1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3UG9pbnQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IE1hdHJpeDsiLCJpbXBvcnQgQ29vcmRpbmF0ZSBmcm9tIFwiLi9jb29yZGluYXRlXCI7XHJcblxyXG5jbGFzcyBQb2ludCAgZXh0ZW5kcyBDb29yZGluYXRlIHtcclxuICAgIHB1YmxpYyByOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgZzogbnVtYmVyO1xyXG4gICAgcHVibGljIGI6IG51bWJlcjtcclxuICAgIHB1YmxpYyBhOiBudW1iZXI7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHBvc2l0aW9uOiBbbnVtYmVyLCBudW1iZXJdLCBjb2xvcjogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPSBbMCwgMCwgMCwgMV0pIHtcclxuICAgICAgICBzdXBlciguLi5wb3NpdGlvbiwgMSk7XHJcblxyXG4gICAgICAgIFt0aGlzLnIsIHRoaXMuZywgdGhpcy5iLCB0aGlzLmFdID0gY29sb3I7XHJcblxyXG4gICAgICAgIGNvbnN0IFtyLCBnLCBiLCBhXSA9IGNvbG9yO1xyXG4gICAgICAgIHRoaXMuciA9IHI7XHJcbiAgICAgICAgdGhpcy5nID0gZztcclxuICAgICAgICB0aGlzLmIgPSBiO1xyXG4gICAgICAgIHRoaXMuYSA9IGE7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFBhaXIoKTogW251bWJlciwgbnVtYmVyXSB7XHJcbiAgICAgICAgcmV0dXJuIFt0aGlzLngsIHRoaXMueV07XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldENvbG9yKCk6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdIHtcclxuICAgICAgICByZXR1cm4gW3RoaXMuciwgdGhpcy5nLCB0aGlzLmIsIHRoaXMuYV07XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldENvbG9yKGNvbG9yOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IFtyLCBnLCBiLCBhXSA9IGNvbG9yO1xyXG4gICAgICAgIHRoaXMuciA9IHI7XHJcbiAgICAgICAgdGhpcy5nID0gZztcclxuICAgICAgICB0aGlzLmIgPSBiO1xyXG4gICAgICAgIHRoaXMuYSA9IGE7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFBvaW50OyIsImltcG9ydCB7IGxvYWRTaGFkZXIgfSBmcm9tIFwiLi9sb2FkLXNoYWRlclwiO1xyXG5cclxuLy9cclxuLy8gSW5pdGlhbGl6ZSBhIHNoYWRlciBwcm9ncmFtLCBzbyBXZWJHTCBrbm93cyBob3cgdG8gZHJhdyBvdXIgZGF0YVxyXG4vL1xyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlU2hhZGVyUHJvZ3JhbShnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LCB2c1NvdXJjZTogc3RyaW5nLCBmc1NvdXJjZTogc3RyaW5nKSB7XHJcbiAgICBjb25zdCB2ZXJ0ZXhTaGFkZXIgPSBsb2FkU2hhZGVyKGdsLCBnbC5WRVJURVhfU0hBREVSLCB2c1NvdXJjZSk7XHJcbiAgICBjb25zdCBmcmFnbWVudFNoYWRlciA9IGxvYWRTaGFkZXIoZ2wsIGdsLkZSQUdNRU5UX1NIQURFUiwgZnNTb3VyY2UpO1xyXG4gIFxyXG4gICAgLy8gQ3JlYXRlIHRoZSBzaGFkZXIgcHJvZ3JhbVxyXG4gICAgY29uc3Qgc2hhZGVyUHJvZ3JhbSA9IGdsLmNyZWF0ZVByb2dyYW0oKTtcclxuICAgIGdsLmF0dGFjaFNoYWRlcihzaGFkZXJQcm9ncmFtLCB2ZXJ0ZXhTaGFkZXIpO1xyXG4gICAgZ2wuYXR0YWNoU2hhZGVyKHNoYWRlclByb2dyYW0sIGZyYWdtZW50U2hhZGVyKTtcclxuICAgIGdsLmxpbmtQcm9ncmFtKHNoYWRlclByb2dyYW0pO1xyXG4gIFxyXG4gICAgLy8gSWYgY3JlYXRpbmcgdGhlIHNoYWRlciBwcm9ncmFtIGZhaWxlZCwgYWxlcnRcclxuICBcclxuICAgIGlmICghZ2wuZ2V0UHJvZ3JhbVBhcmFtZXRlcihzaGFkZXJQcm9ncmFtLCBnbC5MSU5LX1NUQVRVUykpIHtcclxuICAgICAgYWxlcnQoXHJcbiAgICAgICAgYFVuYWJsZSB0byBpbml0aWFsaXplIHRoZSBzaGFkZXIgcHJvZ3JhbTogJHtnbC5nZXRQcm9ncmFtSW5mb0xvZyhcclxuICAgICAgICAgIHNoYWRlclByb2dyYW0sXHJcbiAgICAgICAgKX1gLFxyXG4gICAgICApO1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIHJldHVybiBzaGFkZXJQcm9ncmFtO1xyXG4gIH0iLCIgIC8vXHJcbiAgLy8gY3JlYXRlcyBhIHNoYWRlciBvZiB0aGUgZ2l2ZW4gdHlwZSwgdXBsb2FkcyB0aGUgc291cmNlIGFuZFxyXG4gIC8vIGNvbXBpbGVzIGl0LlxyXG4gIC8vXHJcbmV4cG9ydCBmdW5jdGlvbiBsb2FkU2hhZGVyKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsIHR5cGU6IG51bWJlciwgc291cmNlOiBzdHJpbmcpOiBXZWJHTFNoYWRlciB7XHJcbiAgICBjb25zdCBzaGFkZXIgPSBnbC5jcmVhdGVTaGFkZXIodHlwZSk7XHJcbiAgXHJcbiAgICAvLyBTZW5kIHRoZSBzb3VyY2UgdG8gdGhlIHNoYWRlciBvYmplY3RcclxuICAgIGdsLnNoYWRlclNvdXJjZShzaGFkZXIsIHNvdXJjZSk7XHJcbiAgXHJcbiAgICAvLyBDb21waWxlIHRoZSBzaGFkZXIgcHJvZ3JhbVxyXG4gICAgZ2wuY29tcGlsZVNoYWRlcihzaGFkZXIpO1xyXG4gIFxyXG4gICAgLy8gU2VlIGlmIGl0IGNvbXBpbGVkIHN1Y2Nlc3NmdWxseVxyXG4gICAgaWYgKCFnbC5nZXRTaGFkZXJQYXJhbWV0ZXIoc2hhZGVyLCBnbC5DT01QSUxFX1NUQVRVUykpIHtcclxuICAgICAgYWxlcnQoYEFuIGVycm9yIG9jY3VycmVkIGNvbXBpbGluZyB0aGUgc2hhZGVyczogJHtnbC5nZXRTaGFkZXJJbmZvTG9nKHNoYWRlcil9YCwpO1xyXG4gICAgICBnbC5kZWxldGVTaGFkZXIoc2hhZGVyKTtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gc2hhZGVyO1xyXG59IiwiaW1wb3J0IFNoYXBlIGZyb20gXCJNYWluLzJELVNoYXBlcy9zaGFwZVwiO1xyXG5pbXBvcnQgeyByZW5kZXIgfSBmcm9tIFwiLi9yZW5kZXJcIjtcclxuaW1wb3J0IFByb2dyYW1JbmZvIGZyb20gXCIuL3Byb2dyYW0taW5mby5pbnRlcmZhY2VcIjtcclxuaW1wb3J0IFJlbmRlcmFibGUgZnJvbSBcIk1haW4vMkQtU2hhcGVzL0ludGVyZmFjZXMvcmVuZGVyYWJsZS5pbnRlcmZhY2VcIjtcclxuaW1wb3J0IFRyYW5zZm9ybWFibGUgZnJvbSBcIk1haW4vMkQtU2hhcGVzL0ludGVyZmFjZXMvdHJhbnNmb3JtYWJsZS5pbnRlcmZhY2VcIjtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZW5kZXJBbGwoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCwgcHJvZ3JhbUluZm86IFByb2dyYW1JbmZvLCBzaGFwZXM6IChSZW5kZXJhYmxlJlRyYW5zZm9ybWFibGUpW10sIHBvc2l0aW9uQnVmZmVyOiBXZWJHTEJ1ZmZlciwgY29sb3JCdWZmZXI6IFdlYkdMQnVmZmVyKTogdm9pZCB7XHJcbiAgICBnbC5jbGVhcihnbC5DT0xPUl9CVUZGRVJfQklUKTtcclxuICBcclxuICAgIGZvciAoY29uc3Qgc2hhcGUgb2Ygc2hhcGVzKSB7XHJcbiAgICAgIHJlbmRlcihnbCwgcHJvZ3JhbUluZm8sIHNoYXBlLCBwb3NpdGlvbkJ1ZmZlciwgY29sb3JCdWZmZXIpXHJcbiAgICB9XHJcbn07IiwiaW1wb3J0IFJlbmRlcmFibGUgZnJvbSBcIk1haW4vMkQtU2hhcGVzL0ludGVyZmFjZXMvcmVuZGVyYWJsZS5pbnRlcmZhY2VcIjtcclxuaW1wb3J0IFByb2dyYW1JbmZvIGZyb20gXCIuL3Byb2dyYW0taW5mby5pbnRlcmZhY2VcIjtcclxuaW1wb3J0IFRyYW5zZm9ybWFibGUgZnJvbSBcIk1haW4vMkQtU2hhcGVzL0ludGVyZmFjZXMvdHJhbnNmb3JtYWJsZS5pbnRlcmZhY2VcIjtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZW5kZXIoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCwgcHJvZ3JhbUluZm86IFByb2dyYW1JbmZvLCBvYmplY3Q6IFJlbmRlcmFibGUgJiBUcmFuc2Zvcm1hYmxlLCBwb3NpdGlvbkJ1ZmZlcjogV2ViR0xCdWZmZXIsIGNvbG9yQnVmZmVyOiBXZWJHTEJ1ZmZlcik6IHZvaWQge1xyXG4gICAgaWYgKCFvYmplY3QuaXNEcmF3YWJsZSgpKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIC8vIEFkZCBQb3NpdGlvbiB0byBnbCBidWZmZXJcclxuICAgIC8vIGNvbnNvbGUubG9nKFwia29udG9sb2RvbjNcIik7XHJcbiAgICBnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheShwcm9ncmFtSW5mby5hdHRyaWJMb2NhdGlvbnMudmVydGV4UG9zaXRpb24pO1xyXG4gICAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHBvc2l0aW9uQnVmZmVyKTtcclxuICAgIG9iamVjdC5hZGRQb3NpdGlvbihnbCk7XHJcbiAgICBjb25zdCBudW1Db21wb25lbnRzID0gMjsgLy8gcHVsbCBvdXQgMiB2YWx1ZXMgcGVyIGl0ZXJhdGlvblxyXG4gICAgY29uc3QgdHlwZSA9IGdsLkZMT0FUOyAvLyB0aGUgZGF0YSBpbiB0aGUgYnVmZmVyIGlzIDMyYml0IGZsb2F0c1xyXG4gICAgY29uc3Qgbm9ybWFsaXplID0gZmFsc2U7IC8vIGRvbid0IG5vcm1hbGl6ZVxyXG4gICAgY29uc3Qgc3RyaWRlID0gMDsgLy8gaG93IG1hbnkgYnl0ZXMgdG8gZ2V0IGZyb20gb25lIHNldCBvZiB2YWx1ZXMgdG8gdGhlIG5leHRcclxuICAgIC8vIDAgPSB1c2UgdHlwZSBhbmQgbnVtQ29tcG9uZW50cyBhYm92ZVxyXG4gICAgY29uc3Qgb2Zmc2V0ID0gMDsgLy8gaG93IG1hbnkgYnl0ZXMgaW5zaWRlIHRoZSBidWZmZXIgdG8gc3RhcnQgZnJvbVxyXG4gICAgZ2wudmVydGV4QXR0cmliUG9pbnRlcihcclxuICAgICAgcHJvZ3JhbUluZm8uYXR0cmliTG9jYXRpb25zLnZlcnRleFBvc2l0aW9uLFxyXG4gICAgICBudW1Db21wb25lbnRzLFxyXG4gICAgICB0eXBlLFxyXG4gICAgICBub3JtYWxpemUsXHJcbiAgICAgIHN0cmlkZSxcclxuICAgICAgb2Zmc2V0LFxyXG4gICAgKTtcclxuXHJcbiAgICBcclxuICAgIGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KHByb2dyYW1JbmZvLmF0dHJpYkxvY2F0aW9ucy52ZXJ0ZXhDb2xvcik7XHJcbiAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgY29sb3JCdWZmZXIpO1xyXG4gICAgb2JqZWN0LmFkZENvbG9yKGdsKTtcclxuICAgIGNvbnN0IGNvbG9yU2l6ZSA9IDQ7IC8qIDQgY29tcG9uZW50cyBwZXIgaXRlcmF0aW9uICovXHJcbiAgICBjb25zdCBjb2xvclR5cGUgPSBnbC5GTE9BVDsgLyogVGhlIGRhdGEgaXMgMzIgYml0IGZsb2F0ICovXHJcbiAgICBjb25zdCBjb2xvck5vcm1hbGl6ZWQgPSBmYWxzZTsgLyogRG9uJ3Qgbm9ybWFsaXplIHRoZSBkYXRhICovXHJcbiAgICBjb25zdCBjb2xvclN0cmlkZSA9IDA7IC8qIDA6IE1vdmUgZm9yd2FyZCBzaXplICogc2l6ZW9mKHR5cGUpIGVhY2ggaXRlcmF0aW9uIHRvIGdldCB0aGUgbmV4dCBwb3NpdGlvbiAqL1xyXG4gICAgY29uc3QgY29sb3JPZmZzZXQgPSAwOyAvKiBTdGFydCBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSBidWZmZXIgKi9cclxuICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIoXHJcbiAgICAgIHByb2dyYW1JbmZvLmF0dHJpYkxvY2F0aW9ucy52ZXJ0ZXhDb2xvcixcclxuICAgICAgY29sb3JTaXplLFxyXG4gICAgICBjb2xvclR5cGUsXHJcbiAgICAgIGNvbG9yTm9ybWFsaXplZCxcclxuICAgICAgY29sb3JTdHJpZGUsXHJcbiAgICAgIGNvbG9yT2Zmc2V0XHJcbiAgICApO1xyXG4gICAgXHJcbiAgICBcclxuICAgIC8vIEFkZCBNYXRyaXggdG8gZ2xcclxuICAgIGNvbnN0IG1hdHJpeExvY2F0aW9uID0gcHJvZ3JhbUluZm8udW5pZm9ybUxvY2F0aW9ucy5tYXRyaXhMb2NhdGlvblxyXG4gICAgb2JqZWN0LmFkZE1hdHJpeChnbCwgbWF0cml4TG9jYXRpb24pO1xyXG4gICAgLyogRHJhdyBzY2VuZSAqL1xyXG4gICAgY29uc3QgcHJpbWl0aXZlVHlwZSA9IG9iamVjdC5kcmF3TWV0aG9kKGdsKTtcclxuICAgIC8vIGNvbnN0IG9mZnNldCA9IDA7XHJcbiAgICBjb25zdCBudW1iZXJPZlZlcnRpY2VzVG9CZURyYXduID0gb2JqZWN0LmdldE51bWJlck9mVmVydGljZXNUb0JlRHJhd24oKTtcclxuICAgIC8vIGNvbnNvbGUubG9nKFwia29udG9sb2RvbjVcIik7XHJcbiAgICBnbC5kcmF3QXJyYXlzKHByaW1pdGl2ZVR5cGUsIG9mZnNldCwgbnVtYmVyT2ZWZXJ0aWNlc1RvQmVEcmF3bik7XHJcbn0iLCJpbXBvcnQgTWF0cml4IGZyb20gXCJNYWluL0Jhc2UvbWF0cml4XCI7XHJcbmltcG9ydCBQb2ludCBmcm9tIFwiTWFpbi9CYXNlL3BvaW50XCI7XHJcblxyXG5cclxuY2xhc3MgVHJhbnNmb3JtYXRpb257XHJcbiAgICBwdWJsaWMgc3RhdGljIHByb2plY3Rpb24od2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpOiBNYXRyaXgge1xyXG4gICAgICAgIGNvbnN0IG1hdHJpeCA9IG5ldyBNYXRyaXgoWzIvd2lkdGgsIDAsIDBdLCBbMCwgLTIvaGVpZ2h0LCAwXSwgWy0xLCAxLCAxXSk7XHJcbiAgICAgICAgcmV0dXJuIG1hdHJpeDtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzdGF0aWMgdHJhbnNsYXRpb24odHg6IG51bWJlciwgdHk6IG51bWJlcik6IE1hdHJpeCB7XHJcbiAgICAgICAgY29uc3QgbWF0cml4ID0gbmV3IE1hdHJpeChbMSwwLDBdLCBbMCwgMSwgMF0sIFt0eCwgdHksIDFdKTtcclxuICAgICAgICByZXR1cm4gbWF0cml4O1xyXG4gICAgfVxyXG4gICAgcHVibGljIHN0YXRpYyByb3RhdGlvbihkZWdyZWU6IG51bWJlcik6IE1hdHJpeCB7XHJcbiAgICAgICAgY29uc3QgbWF0cml4ID0gbmV3IE1hdHJpeChbTWF0aC5jb3MoZGVncmVlKSwgTWF0aC5zaW4oZGVncmVlKSwgMF0sIFstTWF0aC5zaW4oZGVncmVlKSwgTWF0aC5jb3MoZGVncmVlKSwgMF0sIFswLCAwLCAxXSk7XHJcbiAgICAgICAgcmV0dXJuIG1hdHJpeDtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzdGF0aWMgc2NhbGUoc3g6IG51bWJlciwgc3k6IG51bWJlcik6IE1hdHJpeCB7XHJcbiAgICAgICAgY29uc3QgbWF0cml4ID0gbmV3IE1hdHJpeChbc3gsMCwwXSwgWzAsIHN5LCAwXSwgWzAsIDAsIDFdKTtcclxuICAgICAgICByZXR1cm4gbWF0cml4XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc3RhdGljIHNoZWFyWChreDogbnVtYmVyKTogTWF0cml4IHtcclxuICAgICAgICBjb25zdCBtYXRyaXggPSBuZXcgTWF0cml4KFsxLCAwLCAwXSwgW2t4LCAxLCAwXSwgWzAsIDAsIDFdKTtcclxuICAgICAgICByZXR1cm4gbWF0cml4O1xyXG4gICAgfVxyXG4gICAgcHVibGljIHN0YXRpYyBzaGVhclkoa3k6IG51bWJlcik6IE1hdHJpeCB7XHJcbiAgICAgICAgY29uc3QgbWF0cml4ID0gbmV3IE1hdHJpeChbMSwga3ksIDBdLCBbMCwgMSwgMF0sIFswLCAwLCAxXSk7XHJcbiAgICAgICAgcmV0dXJuIG1hdHJpeDtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzdGF0aWMgdHJhbnNmb3JtYXRpb25NYXRyaXgoXHJcbiAgICAgICAgd2lkdGg6IG51bWJlcixcclxuICAgICAgICBoZWlnaHQ6IG51bWJlcixcclxuICAgICAgICB0eDogbnVtYmVyLFxyXG4gICAgICAgIHR5OiBudW1iZXIsXHJcbiAgICAgICAgZGVncmVlOiBudW1iZXIsXHJcbiAgICAgICAgc3g6IG51bWJlcixcclxuICAgICAgICBzeTogbnVtYmVyLFxyXG4gICAgICAgIGt4OiBudW1iZXIsXHJcbiAgICAgICAga3k6IG51bWJlcixcclxuICAgICAgICBjZW50ZXI6IFBvaW50XHJcbiAgICApIDogTWF0cml4IHtcclxuICAgICAgICByZXR1cm4gVHJhbnNmb3JtYXRpb24ucHJvamVjdGlvbih3aWR0aCwgaGVpZ2h0KVxyXG4gICAgICAgIC5tdWx0aXBseU1hdHJpeChUcmFuc2Zvcm1hdGlvbi50cmFuc2xhdGlvbih0eCwgdHkpKVxyXG4gICAgICAgIC5tdWx0aXBseU1hdHJpeChUcmFuc2Zvcm1hdGlvbi50cmFuc2xhdGlvbihjZW50ZXIuZ2V0WCgpLCBjZW50ZXIuZ2V0WSgpKSlcclxuICAgICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24ucm90YXRpb24oZGVncmVlKSlcclxuICAgICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24uc2NhbGUoc3gsIHN5KSlcclxuICAgICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24uc2hlYXJYKGt4KSlcclxuICAgICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24uc2hlYXJZKGt5KSlcclxuICAgICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24udHJhbnNsYXRpb24oLWNlbnRlci5nZXRYKCksIC1jZW50ZXIuZ2V0WSgpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBpbnZlcnNlVHJhbnNmb3JtYXRpb25NYXRyaXgoXHJcbiAgICAgICAgd2lkdGg6IG51bWJlcixcclxuICAgICAgICBoZWlnaHQ6IG51bWJlcixcclxuICAgICAgICB0eDogbnVtYmVyLFxyXG4gICAgICAgIHR5OiBudW1iZXIsXHJcbiAgICAgICAgZGVncmVlOiBudW1iZXIsXHJcbiAgICAgICAgc3g6IG51bWJlcixcclxuICAgICAgICBzeTogbnVtYmVyLFxyXG4gICAgICAgIGt4OiBudW1iZXIsXHJcbiAgICAgICAga3k6IG51bWJlcixcclxuICAgICAgICBjZW50ZXI6IFBvaW50XHJcbiAgICApIDogTWF0cml4IHtcclxuICAgICAgICByZXR1cm4gVHJhbnNmb3JtYXRpb24udHJhbnNsYXRpb24oY2VudGVyLmdldFgoKSwgY2VudGVyLmdldFkoKSlcclxuICAgICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24uc2hlYXJZKC1reSkpXHJcbiAgICAgICAgLm11bHRpcGx5TWF0cml4KFRyYW5zZm9ybWF0aW9uLnNoZWFyWCgta3gpKVxyXG4gICAgICAgIC5tdWx0aXBseU1hdHJpeChUcmFuc2Zvcm1hdGlvbi5zY2FsZSgxIC8gc3gsIDEgLyBzeSkpXHJcbiAgICAgICAgLm11bHRpcGx5TWF0cml4KFRyYW5zZm9ybWF0aW9uLnJvdGF0aW9uKC1kZWdyZWUpKVxyXG4gICAgICAgIC5tdWx0aXBseU1hdHJpeChUcmFuc2Zvcm1hdGlvbi50cmFuc2xhdGlvbigtY2VudGVyLmdldFgoKSwgLWNlbnRlci5nZXRZKCkpKVxyXG4gICAgICAgIC5tdWx0aXBseU1hdHJpeChUcmFuc2Zvcm1hdGlvbi50cmFuc2xhdGlvbigtdHgsIC10eSkpXHJcbiAgICAgICAgLy8gLm11bHRpcGx5TWF0cml4KFRyYW5zZm9ybWF0aW9uLnByb2plY3Rpb24oMSAvIHdpZHRoLCAxIC8gaGVpZ2h0KSk7XHJcbiAgICB9XHJcblxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IFRyYW5zZm9ybWF0aW9uOyIsImltcG9ydCBQb2ludCBmcm9tIFwiTWFpbi9CYXNlL3BvaW50XCJcclxuXHJcbmZ1bmN0aW9uIG9yaWVudGF0aW9uKHA6IFBvaW50LCBxOiBQb2ludCwgcjogUG9pbnQpOiBudW1iZXIge1xyXG4gICAgY29uc3QgdmFsID0gKHEueSAtIHAueSkgKiAoci54IC0gcS54KSAtIChxLnggLSBwLngpICogKHIueSAtIHEueSk7XHJcblxyXG4gICAgaWYgKHZhbCA9PT0gMCkgcmV0dXJuIDA7XHJcblxyXG4gICAgcmV0dXJuIHZhbCA+IDAgPyAxIDogMjtcclxufVxyXG5cclxuZnVuY3Rpb24gY29udmV4SHVsbChwb2ludHM6IFBvaW50W10pOiBQb2ludFtdIHtcclxuICAgIGNvbnN0IG4gPSBwb2ludHMubGVuZ3RoO1xyXG4gICAgaWYgKG4gPCAzKSByZXR1cm4gW107XHJcblxyXG4gICAgY29uc3QgaHVsbDogUG9pbnRbXSA9IFtdO1xyXG4gICAgbGV0IGwgPSAwO1xyXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICBpZiAocG9pbnRzW2ldLnggPCBwb2ludHNbbF0ueCkge1xyXG4gICAgICAgICAgICBsID0gaTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHAgPSBsO1xyXG4gICAgbGV0IHE6IG51bWJlcjtcclxuICAgIGRvIHtcclxuICAgICAgICBodWxsLnB1c2gocG9pbnRzW3BdKTtcclxuICAgICAgICBxID0gKHAgKyAxKSAlIG47XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKG9yaWVudGF0aW9uKHBvaW50c1twXSwgcG9pbnRzW2ldLCBwb2ludHNbcV0pID09PSAyKSB7XHJcbiAgICAgICAgICAgICAgICBxID0gaTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwID0gcTtcclxuICAgIH0gd2hpbGUgKHAgIT09IGwpO1xyXG5cclxuICAgIHJldHVybiBodWxsO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjb252ZXhIdWxsO1xyXG5cclxuIiwiZnVuY3Rpb24gY29tcG9uZW50VG9IZXgoYzogbnVtYmVyKSB7XHJcbiAgICB2YXIgaGV4ID0gYy50b1N0cmluZygxNik7XHJcbiAgICByZXR1cm4gaGV4Lmxlbmd0aCA9PT0gMSA/IGAwJHtoZXh9YCA6IGhleDtcclxufVxyXG4gIFxyXG5mdW5jdGlvbiByZ2JUb0hleChyZ2JhOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSk6IHN0cmluZyB7XHJcbiAgICBjb25zdCBbciwgZywgYl0gPSByZ2JhO1xyXG4gIFxyXG4gICAgcmV0dXJuIGAjJHtjb21wb25lbnRUb0hleChyKX0ke2NvbXBvbmVudFRvSGV4KGcpfSR7Y29tcG9uZW50VG9IZXgoYil9YDtcclxufVxyXG4gIFxyXG5mdW5jdGlvbiBoZXhUb1JnYihoZXg6IHN0cmluZyk6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdIHtcclxuICAgIGNvbnN0IHIgPSBwYXJzZUludChoZXguc2xpY2UoMSwgMyksIDE2KTtcclxuICAgIGNvbnN0IGcgPSBwYXJzZUludChoZXguc2xpY2UoMywgNSksIDE2KTtcclxuICAgIGNvbnN0IGIgPSBwYXJzZUludChoZXguc2xpY2UoNSwgNyksIDE2KTtcclxuICBcclxuICAgIHJldHVybiBbciAvIDI1NSwgZyAvIDI1NSwgYiAvIDI1NSwgMV07XHJcbn1cclxuICBcclxuZXhwb3J0IHsgcmdiVG9IZXgsIGhleFRvUmdiIH07XHJcbiAgIiwiaW1wb3J0IFJlbmRlcmFibGUgZnJvbSBcIi4vMkQtU2hhcGVzL0ludGVyZmFjZXMvcmVuZGVyYWJsZS5pbnRlcmZhY2VcIjtcclxuaW1wb3J0IFRyYW5zZm9ybWFibGUgZnJvbSBcIi4vMkQtU2hhcGVzL0ludGVyZmFjZXMvdHJhbnNmb3JtYWJsZS5pbnRlcmZhY2VcIjtcclxuaW1wb3J0IFNoYXBlIGZyb20gXCIuLzJELVNoYXBlcy9zaGFwZVwiO1xyXG5pbXBvcnQgTGluZSBmcm9tIFwiLi8yRC1TaGFwZXMvbGluZVwiO1xyXG5pbXBvcnQgU3F1YXJlIGZyb20gXCIuLzJELVNoYXBlcy9zcXVhcmVcIjtcclxuaW1wb3J0IFJlY3RhbmdsZSBmcm9tIFwiLi8yRC1TaGFwZXMvcmVjdGFuZ2xlXCI7XHJcbmltcG9ydCBQb2ludCBmcm9tIFwiLi9CYXNlL3BvaW50XCI7XHJcbmltcG9ydCBQb2x5Z29uIGZyb20gXCIuLzJELVNoYXBlcy9wb2x5Z29uXCI7XHJcbmltcG9ydCBUeXBlIGZyb20gXCIuLzJELVNoYXBlcy90eXBlLmVudW1cIjtcclxuaW1wb3J0IHsgY3JlYXRlU2hhZGVyUHJvZ3JhbSB9IGZyb20gXCIuL0Z1bmN0aW9ucy9jcmVhdGUtc2hhZGVyLXByb2dyYW1cIjtcclxuaW1wb3J0IFByb2dyYW1JbmZvIGZyb20gXCIuL0Z1bmN0aW9ucy9wcm9ncmFtLWluZm8uaW50ZXJmYWNlXCI7XHJcbmltcG9ydCB7IHNldEF0dHJpYnV0ZXMgfSBmcm9tIFwiLi9GdW5jdGlvbnMvc2V0LWF0dHJpYnV0ZXNcIjtcclxuaW1wb3J0IHsgc2V0dXBDYW52YXMgfSBmcm9tIFwiLi9GdW5jdGlvbnMvc2V0dXAtY2FudmFzXCI7XHJcbmltcG9ydCBUcmFuc2Zvcm1hdGlvbiBmcm9tIFwiLi9PcGVyYXRpb25zL1RyYW5zZm9ybWF0aW9uXCI7XHJcbmltcG9ydCB7IGhleFRvUmdiLCByZ2JUb0hleCB9IGZyb20gXCIuL1V0aWxzL3Rvb2xzXCI7XHJcbmltcG9ydCB7IHJlbmRlciB9IGZyb20gXCIuL0Z1bmN0aW9ucy9yZW5kZXJcIjtcclxuaW1wb3J0IHsgcmVuZGVyQWxsIH0gZnJvbSBcIi4vRnVuY3Rpb25zL3JlbmRlci1hbGxcIjtcclxuXHJcbi8vIGNvbnN0IGdsID0gc2V0dXBDYW52YXMoKVxyXG5jb25zdCBjYW52YXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NhbnZhc1wiKSBhcyBIVE1MQ2FudmFzRWxlbWVudDtcclxuLy8gSW5pdGlhbGl6ZSB0aGUgR0wgY29udGV4dFxyXG5jb25zdCBnbCA9IGNhbnZhcy5nZXRDb250ZXh0KFwid2ViZ2xcIik7XHJcblxyXG4vLyBPbmx5IGNvbnRpbnVlIGlmIFdlYkdMIGlzIGF2YWlsYWJsZSBhbmQgd29ya2luZ1xyXG5pZiAoZ2wgPT09IG51bGwpIHtcclxuICBhbGVydChcclxuICAgIFwiVW5hYmxlIHRvIGluaXRpYWxpemUgV2ViR0wuIFlvdXIgYnJvd3NlciBvciBtYWNoaW5lIG1heSBub3Qgc3VwcG9ydCBpdC5cIlxyXG4gICk7XHJcbn1cclxuXHJcblxyXG4vLyBWZXJ0ZXggc2hhZGVyIHByb2dyYW1cclxuY29uc3QgdnNTb3VyY2UgPSBgXHJcbiAgICBhdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247XHJcbiAgICBhdHRyaWJ1dGUgdmVjNCBhVmVydGV4Q29sb3I7XHJcbiAgICB1bmlmb3JtIG1hdDMgdU1hdHJpeDtcclxuICAgIHZhcnlpbmcgdmVjNCB2Q29sb3I7XHJcblxyXG4gICAgdm9pZCBtYWluKCkge1xyXG4gICAgICAgIC8vIG5vdGU6IFkgYXhpcyBtdXN0IGJlIGludmVydGVkIHRvIHJlcGxpY2F0ZSB0cmFkaXRpb25hbCB2aWV3XHJcbiAgICAgICAgZ2xfUG9zaXRpb24gPSB2ZWM0KCh1TWF0cml4ICogdmVjMyhhVmVydGV4UG9zaXRpb24sIDEpKS54eSwgMCwgMSk7XHJcblxyXG4gICAgICAgIC8vIENoYW5nZSBjb2xvciBvZiBzaGFwZVxyXG4gICAgICAgIHZDb2xvciA9IGFWZXJ0ZXhDb2xvcjtcclxuICAgIH1cclxuYDtcclxuXHJcbmNvbnN0IGZzU291cmNlID0gYFxyXG4gICAgcHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XHJcbiAgICB2YXJ5aW5nIHZlYzQgdkNvbG9yO1xyXG5cclxuICAgIHZvaWQgbWFpbigpIHtcclxuICAgICAgICBnbF9GcmFnQ29sb3IgPSB2Q29sb3I7XHJcbiAgICB9XHJcbmA7XHJcbmNvbnN0IHNoYWRlclByb2dyYW0gPSBjcmVhdGVTaGFkZXJQcm9ncmFtKGdsLCB2c1NvdXJjZSwgZnNTb3VyY2UpO1xyXG5cclxuLy8gQ29sbGVjdCBhbGwgdGhlIGluZm8gbmVlZGVkIHRvIHVzZSB0aGUgc2hhZGVyIHByb2dyYW0uXHJcbi8vIExvb2sgdXAgd2hpY2ggYXR0cmlidXRlIG91ciBzaGFkZXIgcHJvZ3JhbSBpcyB1c2luZ1xyXG4vLyBmb3IgYVZlcnRleFBvc2l0aW9uIGFuZCBsb29rIHVwIHVuaWZvcm0gbG9jYXRpb25zLlxyXG5jb25zdCBwcm9ncmFtSW5mbyA9IHtcclxuICBwcm9ncmFtOiBzaGFkZXJQcm9ncmFtLFxyXG4gIGF0dHJpYkxvY2F0aW9uczoge1xyXG4gICAgdmVydGV4UG9zaXRpb246IGdsLmdldEF0dHJpYkxvY2F0aW9uKHNoYWRlclByb2dyYW0sIFwiYVZlcnRleFBvc2l0aW9uXCIpLFxyXG4gICAgdmVydGV4Q29sb3I6IGdsLmdldEF0dHJpYkxvY2F0aW9uKHNoYWRlclByb2dyYW0sIFwiYVZlcnRleENvbG9yXCIpLFxyXG4gIH0sXHJcbiAgdW5pZm9ybUxvY2F0aW9uczoge1xyXG4gICAgbWF0cml4TG9jYXRpb246IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihzaGFkZXJQcm9ncmFtLCBcInVNYXRyaXhcIiksXHJcbiAgfSxcclxufTtcclxuXHJcbi8vIFRlbGwgV2ViR0wgdG8gdXNlIG91ciBwcm9ncmFtIHdoZW4gZHJhd2luZ1xyXG5nbC51c2VQcm9ncmFtKHNoYWRlclByb2dyYW0pO1xyXG5cclxuY29uc3Qgd2lkdGggPSAoZ2wuY2FudmFzIGFzIEhUTUxDYW52YXNFbGVtZW50KS5jbGllbnRXaWR0aDtcclxuY29uc3QgaGVpZ2h0ID0gKGdsLmNhbnZhcyBhcyBIVE1MQ2FudmFzRWxlbWVudCkuY2xpZW50SGVpZ2h0O1xyXG5jYW52YXMud2lkdGggPSB3aWR0aDtcclxuY2FudmFzLmhlaWdodCA9IGhlaWdodDtcclxuLy8gU2V0IGNsZWFyIGNvbG9yIHRvIGJsYWNrLCBmdWxseSBvcGFxdWVcclxuZ2wuY2xlYXJDb2xvcigxLjAsIDEuMCwgMS4wLCAxLjApO1xyXG4vLyBDbGVhciB0aGUgY29sb3IgYnVmZmVyIHdpdGggc3BlY2lmaWVkIGNsZWFyIGNvbG9yXHJcblxyXG5cclxuZ2wudmlld3BvcnQoMCwgMCwgZ2wuY2FudmFzLndpZHRoLCBnbC5jYW52YXMuaGVpZ2h0KTsgLy8gc2V0cyB0aGUgdmlld3BvcnQgdG8gY292ZXIgdGhlIGVudGlyZSBjYW52YXMsIHN0YXJ0aW5nIGZyb20gdGhlIGxvd2VyLWxlZnQgY29ybmVyIGFuZCBleHRlbmRpbmcgdG8gdGhlIGNhbnZhcydzIHdpZHRoIGFuZCBoZWlnaHQuXHJcblxyXG4vLyBDbGVhciB0aGUgY2FudmFzIGJlZm9yZSB3ZSBzdGFydCBkcmF3aW5nIG9uIGl0LlxyXG5nbC5jbGVhcihnbC5DT0xPUl9CVUZGRVJfQklUKTtcclxuXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2FudmFzXCIpIGFzIEhUTUxDYW52YXNFbGVtZW50O1xyXG5sZXQgc2hhcGVzOiAoU2hhcGUgJiBSZW5kZXJhYmxlICYgVHJhbnNmb3JtYWJsZSlbXSA9IFtdO1xyXG5sZXQgdHlwZTogVHlwZTtcclxubGV0IGlzRHJhd2luZyA9IGZhbHNlO1xyXG5cclxuLyogU2V0dXAgVmlld3BvcnQgKi9cclxuXHJcbmNvbnN0IHBvc2l0aW9uQnVmZmVyID0gZ2wuY3JlYXRlQnVmZmVyKCk7XHJcbmNvbnN0IGNvbG9yQnVmZmVyID0gZ2wuY3JlYXRlQnVmZmVyKCk7XHJcbi8vIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBwb3NpdGlvbkJ1ZmZlcik7XHJcbi8vIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBjb2xvckJ1ZmZlcik7XHJcbi8vIHNldEF0dHJpYnV0ZXMoZ2wsIHBvc2l0aW9uQnVmZmVyLCBjb2xvckJ1ZmZlciwgcHJvZ3JhbUluZm8pO1xyXG5cclxubGV0IGN1cnJlbnRPYmplY3Q6IFNoYXBlICYgUmVuZGVyYWJsZSAmIFRyYW5zZm9ybWFibGU7XHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLyBGaXggSFRNTCBFbGVtZW50cyBFdmVudCBMaXN0ZW5lcnNcclxuXHJcbi8qIExpc3Qgb2YgU2hhcGVzIExpc3RlbmVyICovXHJcbmNvbnN0IGxpc3RPZlNoYXBlcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibGlzdC1vZi1zaGFwZXNcIikgYXMgSFRNTFNlbGVjdEVsZW1lbnQ7XHJcbmxpc3RPZlNoYXBlcy5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsICgpID0+IHtcclxuICByZW5kZXJBbGwoZ2wsIHByb2dyYW1JbmZvLCBzaGFwZXMsIHBvc2l0aW9uQnVmZmVyLCBjb2xvckJ1ZmZlcik7XHJcbiAgY29uc3QgaW5kZXg6IG51bWJlciA9ICtsaXN0T2ZTaGFwZXMuc2VsZWN0ZWRPcHRpb25zWzBdLnZhbHVlO1xyXG4gIGlzRHJhd2luZyA9IGZhbHNlO1xyXG5cclxuICBzZXR1cFNlbGVjdG9yKGdsLCBwcm9ncmFtSW5mbywgc2hhcGVzW2luZGV4XSk7XHJcbn0pO1xyXG5cclxuLyogQnV0dG9uIExpc3RlbmVyICovXHJcbmNvbnN0IGxpbmVCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxpbmUtYnRuXCIpO1xyXG5saW5lQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgcmVuZGVyQWxsKGdsLCBwcm9ncmFtSW5mbywgc2hhcGVzLCBwb3NpdGlvbkJ1ZmZlciwgY29sb3JCdWZmZXIpO1xyXG4gIHR5cGUgPSBUeXBlLkxpbmU7XHJcbiAgaXNEcmF3aW5nID0gZmFsc2U7XHJcbn0pO1xyXG5cclxuY29uc3Qgc3F1YXJlQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzcXVhcmUtYnRuXCIpO1xyXG5zcXVhcmVCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICByZW5kZXJBbGwoZ2wsIHByb2dyYW1JbmZvLCBzaGFwZXMsIHBvc2l0aW9uQnVmZmVyLCBjb2xvckJ1ZmZlcik7XHJcbiAgdHlwZSA9IFR5cGUuU3F1YXJlO1xyXG4gIGlzRHJhd2luZyA9IGZhbHNlO1xyXG59KTtcclxuXHJcbmNvbnN0IHJlY3RhbmdsZUJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVjdGFuZ2xlLWJ0blwiKTtcclxucmVjdGFuZ2xlQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgcmVuZGVyQWxsKGdsLCBwcm9ncmFtSW5mbywgc2hhcGVzLCBwb3NpdGlvbkJ1ZmZlciwgY29sb3JCdWZmZXIpO1xyXG4gIHR5cGUgPSBUeXBlLlJlY3RhbmdsZTtcclxuICBpc0RyYXdpbmcgPSBmYWxzZTtcclxufSk7XHJcblxyXG5jb25zdCBwb2x5Z29uQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwb2x5Z29uLWJ0blwiKTtcclxucG9seWdvbkJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gIHJlbmRlckFsbChnbCwgcHJvZ3JhbUluZm8sIHNoYXBlcywgcG9zaXRpb25CdWZmZXIsIGNvbG9yQnVmZmVyKTtcclxuICB0eXBlID0gVHlwZS5Qb2x5Z29uO1xyXG4gIGlzRHJhd2luZyA9IGZhbHNlO1xyXG4gIC8vIGlzRmlyc3REcmF3aW5nID0gdHJ1ZTtcclxufSk7XHJcblxyXG5jb25zdCBzYXZlQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzYXZlLWJ0blwiKTtcclxuc2F2ZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gIHJlbmRlckFsbChnbCwgcHJvZ3JhbUluZm8sIHNoYXBlcywgcG9zaXRpb25CdWZmZXIsIGNvbG9yQnVmZmVyKTtcclxuICBjb25zdCB0ZXh0ID0gc3RvcmVTaGFwZXMoc2hhcGVzKTtcclxuICBoYW5kbGVEb3dubG9hZCh0ZXh0KTtcclxufSk7XHJcblxyXG5jb25zdCB1cGxvYWRCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInVwbG9hZC1idG5cIik7XHJcbnVwbG9hZEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gIGhhbmRsZVVwbG9hZCgodGV4dCkgPT4ge1xyXG4gICAgc2hhcGVzID0gbG9hZFNoYXBlKHRleHQpO1xyXG5cclxuICAgIGZvciAoY29uc3Qgc2hhcGUgb2Ygc2hhcGVzKSB7XHJcbiAgICAgIHNldHVwT3B0aW9uKHRydWUsIHNoYXBlKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXJBbGwoZ2wsIHByb2dyYW1JbmZvLCBzaGFwZXMsIHBvc2l0aW9uQnVmZmVyLCBjb2xvckJ1ZmZlcik7XHJcbiAgfSk7XHJcbn0pO1xyXG5cclxuLyogQ2FudmFzIExpc3RlbmVyICovXHJcbmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIChldmVudCkgPT4ge1xyXG4gIGNvbnN0IHggPSBldmVudC5jbGllbnRYO1xyXG4gIGNvbnN0IHkgPSBldmVudC5jbGllbnRZO1xyXG4gIGNvbnN0IHBvaW50ID0gbmV3IFBvaW50KFt4LCB5XSk7XHJcblxyXG4gIGlmIChpc0RyYXdpbmcpIHtcclxuICAgIGlmIChjdXJyZW50T2JqZWN0LnR5cGUgIT09IFR5cGUuUG9seWdvbikge1xyXG4gICAgICBjdXJyZW50T2JqZWN0LmRyYXcocG9pbnQpO1xyXG4gICAgICBzZXR1cE9wdGlvbih0cnVlLCBjdXJyZW50T2JqZWN0KTtcclxuICAgICAgc2hhcGVzLnB1c2goY3VycmVudE9iamVjdCk7XHJcbiAgICAgIGlzRHJhd2luZyA9IGZhbHNlO1xyXG4gICAgICBjdXJyZW50T2JqZWN0ID0gbnVsbDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGBsZW5ndGg6ICR7c2hhcGVzLmxlbmd0aH1gKVxyXG4gICAgICBpZiAoY3VycmVudE9iamVjdC5pZCA9PSBzaGFwZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgY3VycmVudE9iamVjdC5kcmF3KHBvaW50KTtcclxuICAgICAgICAvLyBiZWx1bSBkaXB1c2gga2Ugc2hhcGVzXHJcbiAgICAgICAgaWYgKGN1cnJlbnRPYmplY3QuYXJyYXlPZlBvaW50cy5sZW5ndGggPj0zKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIlBvbHlnb24gRHJhd2FibGVcIilcclxuICAgICAgICAgIHNldHVwT3B0aW9uKHRydWUsIGN1cnJlbnRPYmplY3QpO1xyXG4gICAgICAgICAgLy8gcmVuZGVyKGdsLCBwcm9ncmFtSW5mbywgY3VycmVudE9iamVjdCwgcG9zaXRpb25CdWZmZXIsIGNvbG9yQnVmZmVyKTtcclxuICAgICAgICAgIHNoYXBlcy5wdXNoKGN1cnJlbnRPYmplY3QpO1xyXG4gICAgICAgICAgcmVuZGVyQWxsKGdsLCBwcm9ncmFtSW5mbywgc2hhcGVzLCBwb3NpdGlvbkJ1ZmZlciwgY29sb3JCdWZmZXIpO1xyXG4gICAgICAgICAgaXNEcmF3aW5nID0gZmFsc2U7XHJcbiAgICAgICAgICBjdXJyZW50T2JqZWN0ID0gbnVsbDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmVuZGVyQWxsKGdsLCBwcm9ncmFtSW5mbywgc2hhcGVzLCBwb3NpdGlvbkJ1ZmZlciwgY29sb3JCdWZmZXIpO1xyXG4gICAgICAgICAgcmVuZGVyKGdsLCBwcm9ncmFtSW5mbywgY3VycmVudE9iamVjdCwgcG9zaXRpb25CdWZmZXIsIGNvbG9yQnVmZmVyKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc3QgbWF0cml4ID0gVHJhbnNmb3JtYXRpb24uaW52ZXJzZVRyYW5zZm9ybWF0aW9uTWF0cml4KFxyXG4gICAgICAgICAgZ2wuY2FudmFzLndpZHRoLFxyXG4gICAgICAgICAgZ2wuY2FudmFzLmhlaWdodCxcclxuICAgICAgICAgIGN1cnJlbnRPYmplY3QudHgsXHJcbiAgICAgICAgICBjdXJyZW50T2JqZWN0LnR5LFxyXG4gICAgICAgICAgY3VycmVudE9iamVjdC5kZWdyZWUsXHJcbiAgICAgICAgICBjdXJyZW50T2JqZWN0LnN4LFxyXG4gICAgICAgICAgY3VycmVudE9iamVjdC5zeSxcclxuICAgICAgICAgIGN1cnJlbnRPYmplY3Qua3gsXHJcbiAgICAgICAgICBjdXJyZW50T2JqZWN0Lmt5LFxyXG4gICAgICAgICAgY3VycmVudE9iamVjdC5jZW50ZXJcclxuICAgICAgICApO1xyXG4gICAgICAgIGNvbnN0IHBvaW50MiA9IG1hdHJpeC5tdWx0aXBseVBvaW50KHBvaW50KTtcclxuICAgICAgICBjdXJyZW50T2JqZWN0LmRyYXcocG9pbnQyKTtcclxuICAgICAgICBzZXR1cE9wdGlvbihmYWxzZSwgY3VycmVudE9iamVjdCk7XHJcbiAgICAgICAgLy8gcmVuZGVyKGdsLCBwcm9ncmFtSW5mbywgY3VycmVudE9iamVjdCwgcG9zaXRpb25CdWZmZXIsIGNvbG9yQnVmZmVyKTtcclxuICAgICAgICByZW5kZXJBbGwoZ2wsIHByb2dyYW1JbmZvLCBzaGFwZXMsIHBvc2l0aW9uQnVmZmVyLCBjb2xvckJ1ZmZlcik7XHJcbiAgICAgICAgLy8gaXNEcmF3aW5nID0gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9IGVsc2Uge1xyXG4gICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgIGNhc2UgVHlwZS5MaW5lOlxyXG4gICAgICAgIGN1cnJlbnRPYmplY3QgPSBuZXcgTGluZShzaGFwZXMubGVuZ3RoLCBwb2ludCk7XHJcbiAgICAgICAgaXNEcmF3aW5nID0gdHJ1ZTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBUeXBlLlNxdWFyZTpcclxuICAgICAgICBjdXJyZW50T2JqZWN0ID0gbmV3IFNxdWFyZShzaGFwZXMubGVuZ3RoLCBwb2ludCk7XHJcbiAgICAgICAgaXNEcmF3aW5nID0gdHJ1ZTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBUeXBlLlJlY3RhbmdsZTpcclxuICAgICAgICBjdXJyZW50T2JqZWN0ID0gbmV3IFJlY3RhbmdsZShzaGFwZXMubGVuZ3RoLCBwb2ludCk7XHJcbiAgICAgICAgaXNEcmF3aW5nID0gdHJ1ZTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBUeXBlLlBvbHlnb246XHJcbiAgICAgICAgY3VycmVudE9iamVjdCA9IG5ldyBQb2x5Z29uKHNoYXBlcy5sZW5ndGgsIHBvaW50KTtcclxuICAgICAgICBpc0RyYXdpbmcgPSB0cnVlO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH1cclxufSk7XHJcblxyXG5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCAoZXZlbnQpID0+IHtcclxuICBpZiAoaXNEcmF3aW5nICYmIGN1cnJlbnRPYmplY3QudHlwZSAhPT0gVHlwZS5Qb2x5Z29uKSB7XHJcbiAgICBjb25zdCB4ID0gZXZlbnQuY2xpZW50WDtcclxuICAgIGNvbnN0IHkgPSBldmVudC5jbGllbnRZO1xyXG4gICAgY29uc3QgcG9pbnQgPSBuZXcgUG9pbnQoW3gsIHldKTtcclxuICAgIGN1cnJlbnRPYmplY3QuZHJhdyhwb2ludCk7XHJcbiAgICByZW5kZXJBbGwoZ2wsIHByb2dyYW1JbmZvLCBzaGFwZXMsIHBvc2l0aW9uQnVmZmVyLCBjb2xvckJ1ZmZlcik7XHJcbiAgICByZW5kZXIoZ2wsIHByb2dyYW1JbmZvLCBjdXJyZW50T2JqZWN0LCBwb3NpdGlvbkJ1ZmZlciwgY29sb3JCdWZmZXIpO1xyXG4gIH1cclxufSk7XHJcblxyXG5mdW5jdGlvbiBzZXR1cE9wdGlvbihcclxuICBpc0ZpcnN0RHJhd2luZzogYm9vbGVhbixcclxuICBlbGVtZW50OiBSZW5kZXJhYmxlICYgVHJhbnNmb3JtYWJsZSAmIFNoYXBlXHJcbik6IHZvaWQge1xyXG4gIGNvbnN0IG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XHJcbiAgb3B0aW9uLnZhbHVlID0gZWxlbWVudC5pZC50b1N0cmluZygpO1xyXG4gIGxldCBvcHRpb25UZXh0OiBzdHJpbmc7XHJcbiAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICBjYXNlIFR5cGUuTGluZTpcclxuICAgICAgb3B0aW9uVGV4dCA9IGBMaW5lXyR7ZWxlbWVudC5pZH1gO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgVHlwZS5TcXVhcmU6XHJcbiAgICAgIG9wdGlvblRleHQgPSBgU3F1YXJlXyR7ZWxlbWVudC5pZH1gO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgVHlwZS5SZWN0YW5nbGU6XHJcbiAgICAgIG9wdGlvblRleHQgPSBgUmVjdGFuZ2xlXyR7ZWxlbWVudC5pZH1gO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgVHlwZS5Qb2x5Z29uOlxyXG4gICAgICBvcHRpb25UZXh0ID0gYFBvbHlnb25fJHtlbGVtZW50LmlkfWA7XHJcbiAgICAgIGJyZWFrO1xyXG4gIH1cclxuICBvcHRpb24udGV4dCA9IG9wdGlvblRleHQ7XHJcblxyXG4gIGlmIChpc0ZpcnN0RHJhd2luZykge1xyXG4gICAgY29uc3QgbGlzdE9mU2hhcGVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgIFwibGlzdC1vZi1zaGFwZXNcIlxyXG4gICAgKSBhcyBIVE1MU2VsZWN0RWxlbWVudDtcclxuICAgIGxpc3RPZlNoYXBlcy5hcHBlbmRDaGlsZChvcHRpb24pO1xyXG4gICAgbGlzdE9mU2hhcGVzLnZhbHVlID0gZWxlbWVudC5pZC50b1N0cmluZygpO1xyXG4gIH1cclxuXHJcbiAgc2V0dXBTZWxlY3RvcihnbCwgcHJvZ3JhbUluZm8sIGVsZW1lbnQpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzZXR1cFNlbGVjdG9yKFxyXG4gIGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsXHJcbiAgcHJvZ3JhbUluZm86IFByb2dyYW1JbmZvLFxyXG4gIGVsZW1lbnQ6IFJlbmRlcmFibGUgJiBUcmFuc2Zvcm1hYmxlICYgU2hhcGVcclxuKTogdm9pZCB7XHJcbiAgY29uc3Qgc2xpZGVyWF9vcmlnaW5hbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2xpZGVyWFwiKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gIGNvbnN0IHNsaWRlclggPSBzbGlkZXJYX29yaWdpbmFsLmNsb25lTm9kZSh0cnVlKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gIHNsaWRlclhfb3JpZ2luYWwucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQoc2xpZGVyWCwgc2xpZGVyWF9vcmlnaW5hbCk7XHJcbiAgc2xpZGVyWC5taW4gPSBcIi02MDBcIjtcclxuICBzbGlkZXJYLm1heCA9IFwiNjAwXCI7XHJcbiAgc2xpZGVyWC52YWx1ZSA9IGVsZW1lbnQudHgudG9TdHJpbmcoKTtcclxuICBzbGlkZXJYLnN0ZXAgPSBcIjEwXCI7XHJcblxyXG4gIHNsaWRlclguYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIChldmVudCkgPT4ge1xyXG4gICAgY29uc3QgZGVsdGFYID0gKGV2ZW50LnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZTtcclxuICAgIGVsZW1lbnQudHggPSBOdW1iZXIoZGVsdGFYKTtcclxuICAgIHJlbmRlckFsbChnbCwgcHJvZ3JhbUluZm8sIHNoYXBlcywgcG9zaXRpb25CdWZmZXIsIGNvbG9yQnVmZmVyKTtcclxuICB9KTsgICBcclxuXHJcbiAgY29uc3Qgc2xpZGVyWV9vcmlnaW5hbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2xpZGVyWVwiKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gIGNvbnN0IHNsaWRlclkgPSBzbGlkZXJZX29yaWdpbmFsLmNsb25lTm9kZSh0cnVlKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gIHNsaWRlcllfb3JpZ2luYWwucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQoc2xpZGVyWSwgc2xpZGVyWV9vcmlnaW5hbCk7XHJcbiAgc2xpZGVyWS5taW4gPSBcIi02MDBcIjtcclxuICBzbGlkZXJZLm1heCA9IFwiNjAwXCI7XHJcbiAgc2xpZGVyWS52YWx1ZSA9ICgtZWxlbWVudC50eSkudG9TdHJpbmcoKTtcclxuICBzbGlkZXJZLnN0ZXAgPSBcIjEwXCI7XHJcbiAgc2xpZGVyWS5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgKGV2ZW50KSA9PiB7XHJcbiAgICBjb25zdCBkZWx0YVkgPSAoZXZlbnQudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlO1xyXG4gICAgZWxlbWVudC50eSA9IC1OdW1iZXIoZGVsdGFZKTtcclxuICAgIHJlbmRlckFsbChnbCwgcHJvZ3JhbUluZm8sIHNoYXBlcywgcG9zaXRpb25CdWZmZXIsIGNvbG9yQnVmZmVyKTtcclxuICB9KTtcclxuXHJcbiAgY29uc3Qgc2xpZGVyTGVuZ3RoX29yaWdpbmFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICBcInNsaWRlckxlbmd0aFwiXHJcbiAgKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gIGNvbnN0IHNsaWRlckxlbmd0aCA9IHNsaWRlckxlbmd0aF9vcmlnaW5hbC5jbG9uZU5vZGUodHJ1ZSkgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICBzbGlkZXJMZW5ndGhfb3JpZ2luYWwucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQoc2xpZGVyTGVuZ3RoLCBzbGlkZXJMZW5ndGhfb3JpZ2luYWwpO1xyXG4gIHNsaWRlckxlbmd0aC5taW4gPSBcIjBcIjtcclxuICBzbGlkZXJMZW5ndGgubWF4ID0gXCI2MDBcIjtcclxuICBsZXQgbGVuZ3RoOiBudW1iZXI7XHJcbiAgaWYgKGVsZW1lbnQudHlwZSA9PT0gVHlwZS5Qb2x5Z29uKSB7XHJcbiAgICBsZXQgbWluID0gSW5maW5pdHk7XHJcbiAgICBsZXQgbWF4ID0gLUluZmluaXR5O1xyXG5cclxuICAgIGZvciAoY29uc3QgcCBvZiBlbGVtZW50LmFycmF5T2ZQb2ludHMpIHtcclxuICAgICAgY29uc3QgW3BYXSA9IHAuZ2V0UGFpcigpO1xyXG4gICAgICBpZiAocFggPCBtaW4pIHtcclxuICAgICAgICBtaW4gPSBwWDtcclxuICAgICAgfVxyXG4gICAgICBpZiAocFggPiBtYXgpIHtcclxuICAgICAgICBtYXggPSBwWDtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgbGVuZ3RoID0gbWF4IC0gbWluO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBsZW5ndGggPSBNYXRoLnNxcnQoXHJcbiAgICAgIChlbGVtZW50LmFycmF5T2ZQb2ludHNbMF0ueCAtIGVsZW1lbnQuYXJyYXlPZlBvaW50c1sxXS54KSAqKiAyICtcclxuICAgICAgICAoZWxlbWVudC5hcnJheU9mUG9pbnRzWzBdLnkgLSBlbGVtZW50LmFycmF5T2ZQb2ludHNbMV0ueSkgKiogMlxyXG4gICAgKTtcclxuICB9XHJcbiAgc2xpZGVyTGVuZ3RoLnZhbHVlID0gKChlbGVtZW50LnN4IC0gMSkgKiBsZW5ndGgpLnRvU3RyaW5nKCk7XHJcbiAgc2xpZGVyTGVuZ3RoLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCAoZXZlbnQpID0+IHtcclxuICAgIGNvbnN0IGRlbHRhTGVuZ3RoID0gKGV2ZW50LnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZTtcclxuICAgIGVsZW1lbnQuc3ggPSAxICsgTnVtYmVyKGRlbHRhTGVuZ3RoKSAvIGxlbmd0aDtcclxuICAgIHJlbmRlckFsbChnbCwgcHJvZ3JhbUluZm8sIHNoYXBlcywgcG9zaXRpb25CdWZmZXIsIGNvbG9yQnVmZmVyKTtcclxuICB9KTtcclxuXHJcbiAgY29uc3Qgc2xpZGVyV2lkdGhfb3JpZ2luYWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgIFwic2xpZGVyV2lkdGhcIlxyXG4gICkgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICBjb25zdCBzbGlkZXJXaWR0aCA9IHNsaWRlcldpZHRoX29yaWdpbmFsLmNsb25lTm9kZSh0cnVlKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gIHNsaWRlcldpZHRoX29yaWdpbmFsLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHNsaWRlcldpZHRoLCBzbGlkZXJXaWR0aF9vcmlnaW5hbCk7XHJcbiAgc2xpZGVyV2lkdGgubWluID0gXCIwXCI7XHJcbiAgc2xpZGVyV2lkdGgubWF4ID0gXCI2MDBcIjtcclxuICBsZXQgd2lkdGg6IG51bWJlcjtcclxuXHJcbiAgaWYgKGVsZW1lbnQudHlwZSA9PSBUeXBlLlJlY3RhbmdsZSB8fCBlbGVtZW50LnR5cGUgPT0gVHlwZS5TcXVhcmUpIHtcclxuICAgIHdpZHRoID0gTWF0aC5zcXJ0KFxyXG4gICAgICAoZWxlbWVudC5hcnJheU9mUG9pbnRzWzBdLnggLSBlbGVtZW50LmFycmF5T2ZQb2ludHNbM10ueCkgKiogMiArXHJcbiAgICAgICAgKGVsZW1lbnQuYXJyYXlPZlBvaW50c1swXS55IC0gZWxlbWVudC5hcnJheU9mUG9pbnRzWzNdLnkpICoqIDJcclxuICAgICk7XHJcbiAgfSBlbHNlIGlmIChlbGVtZW50LnR5cGUgPT0gVHlwZS5Qb2x5Z29uKSB7XHJcbiAgICBsZXQgbWluID0gSW5maW5pdHk7XHJcbiAgICBsZXQgbWF4ID0gLUluZmluaXR5O1xyXG5cclxuICAgIGZvciAoY29uc3QgcCBvZiBlbGVtZW50LmFycmF5T2ZQb2ludHMpIHtcclxuICAgICAgY29uc3QgWywgcFldID0gcC5nZXRQYWlyKCk7XHJcbiAgICAgIGlmIChwWSA8IG1pbikge1xyXG4gICAgICAgIG1pbiA9IHBZO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChwWSA+IG1heCkge1xyXG4gICAgICAgIG1heCA9IHBZO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBsZW5ndGggPSBtYXggLSBtaW47XHJcbiAgfSBcclxuICBzbGlkZXJXaWR0aC52YWx1ZSA9ICgoZWxlbWVudC5zeSAtIDEpICogd2lkdGgpLnRvU3RyaW5nKCk7XHJcbiAgc2xpZGVyV2lkdGguYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIChldmVudCkgPT4ge1xyXG4gICAgY29uc3QgZGVsdGFXaWR0aCA9IChldmVudC50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWU7XHJcbiAgICBlbGVtZW50LnN5ID0gMSArIE51bWJlcihkZWx0YVdpZHRoKSAvIHdpZHRoO1xyXG4gICAgcmVuZGVyQWxsKGdsLCBwcm9ncmFtSW5mbywgc2hhcGVzLCBwb3NpdGlvbkJ1ZmZlciwgY29sb3JCdWZmZXIpO1xyXG4gIH0pO1xyXG5cclxuICBjb25zdCBzbGlkZXJSb3RhdGlvbl9vcmlnaW5hbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgXCJzbGlkZXJSb3RhdGlvblwiXHJcbiAgKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gIGNvbnN0IHNsaWRlclJvdGF0aW9uX3ZhbHVlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICBcInNsaWRlci1yb3RhdGlvbi12YWx1ZVwiXHJcbiAgKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gIGNvbnN0IHNsaWRlclJvdGF0aW9uID0gc2xpZGVyUm90YXRpb25fb3JpZ2luYWwuY2xvbmVOb2RlKHRydWUpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgc2xpZGVyUm90YXRpb25fb3JpZ2luYWwucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQoc2xpZGVyUm90YXRpb24sIHNsaWRlclJvdGF0aW9uX29yaWdpbmFsKTtcclxuICBzbGlkZXJSb3RhdGlvbi5taW4gPSBcIjBcIjtcclxuICBzbGlkZXJSb3RhdGlvbi5tYXggPSBcIjM2MFwiO1xyXG4gIHNsaWRlclJvdGF0aW9uLnZhbHVlID0gKCgxODAgKiBlbGVtZW50LmRlZ3JlZSkgLyBNYXRoLlBJKS50b1N0cmluZygpO1xyXG4gIHNsaWRlclJvdGF0aW9uX3ZhbHVlLnRleHRDb250ZW50ID0gKCgxODAgKiBlbGVtZW50LmRlZ3JlZSkgLyBNYXRoLlBJKS50b0ZpeGVkKDApLnRvU3RyaW5nKCk7IFxyXG4gIHNsaWRlclJvdGF0aW9uLnN0ZXAgPSBcIjEwXCI7XHJcbiAgc2xpZGVyUm90YXRpb24uYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIChldmVudCkgPT4ge1xyXG4gICAgY29uc3QgZGVsdGFEZWdyZWUgPSAoZXZlbnQudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlO1xyXG4gICAgZWxlbWVudC5kZWdyZWUgPSAoTnVtYmVyKGRlbHRhRGVncmVlKSAvIDE4MCkgKiBNYXRoLlBJO1xyXG4gICAgc2xpZGVyUm90YXRpb25fdmFsdWUudGV4dENvbnRlbnQgPSAoKDE4MCAqIGVsZW1lbnQuZGVncmVlKSAvIE1hdGguUEkpLnRvRml4ZWQoMCkudG9TdHJpbmcoKTsgXHJcbiAgICByZW5kZXJBbGwoZ2wsIHByb2dyYW1JbmZvLCBzaGFwZXMsIHBvc2l0aW9uQnVmZmVyLCBjb2xvckJ1ZmZlcik7XHJcbiAgfSk7XHJcblxyXG4gIGNvbnN0IHNsaWRlclNoZWFyWF9vcmlnaW5hbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgXCJzbGlkZXJTaGVhclhcIlxyXG4gICkgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICBjb25zdCBzbGlkZXJTaGVhclggPSBzbGlkZXJTaGVhclhfb3JpZ2luYWwuY2xvbmVOb2RlKHRydWUpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgc2xpZGVyU2hlYXJYX29yaWdpbmFsLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHNsaWRlclNoZWFyWCwgc2xpZGVyU2hlYXJYX29yaWdpbmFsKTtcclxuICBzbGlkZXJTaGVhclgubWluID0gXCIwXCI7XHJcbiAgc2xpZGVyU2hlYXJYLm1heCA9IFwiMTBcIjtcclxuICBzbGlkZXJTaGVhclgudmFsdWUgPSBlbGVtZW50Lmt4LnRvU3RyaW5nKCk7XHJcbiAgc2xpZGVyU2hlYXJYLnN0ZXAgPSBcIjAuMVwiO1xyXG5cclxuICBzbGlkZXJTaGVhclguYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIChldmVudCkgPT4ge1xyXG4gICAgY29uc3QgZGVsdGFTaGVhclggPSAoZXZlbnQudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlO1xyXG4gICAgZWxlbWVudC5reCA9IE51bWJlcihkZWx0YVNoZWFyWCk7XHJcbiAgICByZW5kZXJBbGwoZ2wsIHByb2dyYW1JbmZvLCBzaGFwZXMsIHBvc2l0aW9uQnVmZmVyLCBjb2xvckJ1ZmZlcik7XHJcbiAgfSk7XHJcblxyXG4gIGNvbnN0IHNsaWRlclNoZWFyWV9vcmlnaW5hbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgXCJzbGlkZXJTaGVhcllcIlxyXG4gICkgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICBjb25zdCBzbGlkZXJTaGVhclkgPSBzbGlkZXJTaGVhcllfb3JpZ2luYWwuY2xvbmVOb2RlKHRydWUpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgc2xpZGVyU2hlYXJZX29yaWdpbmFsLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHNsaWRlclNoZWFyWSwgc2xpZGVyU2hlYXJZX29yaWdpbmFsKTtcclxuICBzbGlkZXJTaGVhclkubWluID0gXCIwXCI7XHJcbiAgc2xpZGVyU2hlYXJZLm1heCA9IFwiMTBcIjtcclxuICBzbGlkZXJTaGVhclkudmFsdWUgPSBlbGVtZW50Lmt5LnRvU3RyaW5nKCk7XHJcbiAgc2xpZGVyU2hlYXJZLnN0ZXAgPSBcIjAuMVwiO1xyXG5cclxuICBzbGlkZXJTaGVhclkuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIChldmVudCkgPT4ge1xyXG4gICAgY29uc3QgZGVsdGFTaGVhclkgPSAoZXZlbnQudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlO1xyXG4gICAgZWxlbWVudC5reSA9IE51bWJlcihkZWx0YVNoZWFyWSk7XHJcbiAgICByZW5kZXJBbGwoZ2wsIHByb2dyYW1JbmZvLCBzaGFwZXMsIHBvc2l0aW9uQnVmZmVyLCBjb2xvckJ1ZmZlcik7XHJcbiAgfSk7XHJcblxyXG4gIGNvbnN0IHBvaW50UGlja2VyX29yaWdpbmFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICBcInBvaW50UGlja2VyXCJcclxuICApIGFzIEhUTUxTZWxlY3RFbGVtZW50O1xyXG4gIGNvbnN0IHBvaW50UGlja2VyID0gcG9pbnRQaWNrZXJfb3JpZ2luYWwuY2xvbmVOb2RlKHRydWUpIGFzIEhUTUxTZWxlY3RFbGVtZW50OyBcclxuICBwb2ludFBpY2tlcl9vcmlnaW5hbC5wYXJlbnRFbGVtZW50LnJlcGxhY2VDaGlsZChwb2ludFBpY2tlciwgcG9pbnRQaWNrZXJfb3JpZ2luYWwpO1xyXG4gIHBvaW50UGlja2VyLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgcG9pbnRQaWNrZXIuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoKSA9PiB7XHJcbiAgICBjb25zdCBwb2ludEluZGV4OiBudW1iZXIgPSBOdW1iZXIocG9pbnRQaWNrZXIudmFsdWUpO1xyXG4gICAgc2V0dXBDb2xvclBpY2tlcihnbCwgcHJvZ3JhbUluZm8sIHBvaW50SW5kZXgsIGVsZW1lbnQpO1xyXG4gIH0pO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZWxlbWVudC5hcnJheU9mUG9pbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBjb25zdCBuZXdQb2ludCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XHJcbiAgICBuZXdQb2ludC52YWx1ZSA9IGkudG9TdHJpbmcoKTtcclxuICAgIG5ld1BvaW50LnRleHQgPSBcInBvaW50X1wiICsgaTtcclxuICAgIHBvaW50UGlja2VyLmFwcGVuZENoaWxkKG5ld1BvaW50KTtcclxuICB9XHJcblxyXG4gIC8vIElmIHRoZSBjdXJyZW50T2JqZWN0IGlzIG5vdCBvZiB0eXBlIFBvbHlnb24sIHJlbW92ZSB0aGUgYnV0dG9uXHJcbiAgY29uc3QgYWRkUG9pbnRCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ0bi1hZGQtcG9pbnRcIik7XHJcbiAgaWYgKGFkZFBvaW50QnV0dG9uKSB7XHJcbiAgICBhZGRQb2ludEJ1dHRvbi5yZW1vdmUoKTtcclxuICB9XHJcblxyXG4gIGlmIChlbGVtZW50IGluc3RhbmNlb2YgUG9seWdvbikge1xyXG4gICAgY29uc3QgYWRkUG9pbnRCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xyXG4gICAgYWRkUG9pbnRCdXR0b24udGV4dENvbnRlbnQgPSBcIkFkZCBOZXcgUG9pbnRcIjtcclxuICAgIGFkZFBvaW50QnV0dG9uLmNsYXNzTmFtZSA9IFwiYnRuIGJ0bi1wcmltYXJ5XCI7XHJcbiAgICBhZGRQb2ludEJ1dHRvbi5pZCA9IFwiYnRuLWFkZC1wb2ludFwiO1xyXG4gICAgYWRkUG9pbnRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICAgICAgLy8gU2V0IGEgZmxhZyB0byBpbmRpY2F0ZSB0aGF0IGEgbmV3IHBvaW50IGlzIGJlaW5nIGFkZGVkXHJcbiAgICAgIGlzRHJhd2luZyA9IHRydWU7XHJcbiAgICAgIGN1cnJlbnRPYmplY3QgPSBzaGFwZXNbZWxlbWVudC5pZF1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vIEFwcGVuZCB0aGUgYnV0dG9uIHRvIHRoZSBET01cclxuICAgIGNvbnN0IGxlZnRQYW5lbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubGVmdC1wYW5lbFwiKTtcclxuICAgIGlmIChsZWZ0UGFuZWwpIHtcclxuICAgICAgbGVmdFBhbmVsLmFwcGVuZENoaWxkKGFkZFBvaW50QnV0dG9uKTtcclxuICAgIH1cclxuICB9IFxyXG59XHJcblxyXG5mdW5jdGlvbiBzZXR1cENvbG9yUGlja2VyKFxyXG4gIGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsXHJcbiAgcHJvZ3JhbUluZm86IFByb2dyYW1JbmZvLFxyXG4gIHBvaW50SW5kZXg6IG51bWJlcixcclxuICBlbGVtZW50OiBSZW5kZXJhYmxlICYgVHJhbnNmb3JtYWJsZSAmIFNoYXBlXHJcbikge1xyXG4gIGNvbnN0IGNvbG9yU2VsZWN0b3IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbG9yLXBpY2tlclwiKTtcclxuICBjb2xvclNlbGVjdG9yLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgY29sb3JTZWxlY3Rvci5yZXBsYWNlQ2hpbGRyZW4oKTtcclxuXHJcbiAgY29uc3QgY29sb3JUaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoMlwiKTtcclxuICBjb2xvclRpdGxlLnRleHRDb250ZW50ID0gXCJTZWxlY3QgY29sb3JcIjtcclxuXHJcbiAgY29uc3QgY29sb3JJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICBjb2xvcklucHV0LmlkID0gXCJjb2xvci1pbnB1dFwiO1xyXG4gIGNvbG9ySW5wdXQudHlwZSA9IFwiY29sb3JcIjtcclxuXHJcbiAgY29sb3JJbnB1dC52YWx1ZSA9IHJnYlRvSGV4KGVsZW1lbnQuYXJyYXlPZlBvaW50c1twb2ludEluZGV4XS5nZXRDb2xvcigpKTtcclxuICBjb2xvcklucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKGV2ZW50KSA9PiB7XHJcbiAgICBjb25zdCBoZXggPSAoZXZlbnQudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlO1xyXG5cclxuICAgIGVsZW1lbnQuYXJyYXlPZlBvaW50c1twb2ludEluZGV4XS5zZXRDb2xvcihoZXhUb1JnYihoZXgpKTtcclxuICB9KTtcclxuXHJcbiAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBQb2x5Z29uKSB7XHJcbiAgICBjb25zdCBkZWxldGVQb2ludEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XHJcbiAgICBkZWxldGVQb2ludEJ1dHRvbi50ZXh0Q29udGVudCA9IFwiZGVsZXRlIHBvaW50XCI7XHJcbiAgICBkZWxldGVQb2ludEJ1dHRvbi5jbGFzc05hbWUgPSBcImJ0blwiO1xyXG4gICAgZGVsZXRlUG9pbnRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICAgICAgZWxlbWVudC5kZWxldGVQb2ludChwb2ludEluZGV4KTtcclxuICAgICAgcmVuZGVyQWxsKGdsLCBwcm9ncmFtSW5mbywgc2hhcGVzLCBwb3NpdGlvbkJ1ZmZlciwgY29sb3JCdWZmZXIpO1xyXG4gICAgfSk7XHJcbiAgICBjb2xvclNlbGVjdG9yLmFwcGVuZChjb2xvclRpdGxlLCBjb2xvcklucHV0LCBkZWxldGVQb2ludEJ1dHRvbik7XHJcbiAgfVxyXG59XHJcblxyXG4vLyBsb2Fkc2hhcGUgZnJvbSBqc29uIHRvIGFycmF5IG9mIHNoYXBlXHJcbmZ1bmN0aW9uIGxvYWRTaGFwZSh0ZXh0OiBzdHJpbmcpOiAoU2hhcGUgJiBSZW5kZXJhYmxlICYgVHJhbnNmb3JtYWJsZSlbXSB7XHJcbiAgY29uc3Qgc2hhcGU6IChTaGFwZSAmIFJlbmRlcmFibGUgJiBUcmFuc2Zvcm1hYmxlKVtdID0gW107XHJcbiAgY29uc3QgZGF0YSA9IEpTT04ucGFyc2UodGV4dCk7XHJcbiAgZm9yIChjb25zdCBpdGVtIG9mIGRhdGEpIHtcclxuICAgIGNvbnN0IHR4ID0gaXRlbS50eDtcclxuICAgIGNvbnN0IHR5ID0gaXRlbS50eTtcclxuICAgIGNvbnN0IGRlZ3JlZSA9IGl0ZW0uZGVncmVlO1xyXG4gICAgY29uc3Qgc3ggPSBpdGVtLnN4O1xyXG4gICAgY29uc3Qgc3kgPSBpdGVtLnN5O1xyXG4gICAgY29uc3Qga3ggPSBpdGVtLmt4O1xyXG4gICAgY29uc3Qga3kgPSBpdGVtLmt5O1xyXG4gICAgbGV0IGFycmF5T2ZQb2ludHM6IFBvaW50W10gPSBbXTtcclxuICAgIGZvciAoY29uc3QgcG9pbnQgb2YgaXRlbS5hcnJheU9mUG9pbnRzKSB7XHJcbiAgICAgIGxldCBwID0gbmV3IFBvaW50KFxyXG4gICAgICAgIFtwb2ludC54LCBwb2ludC55XSxcclxuICAgICAgICBbcG9pbnQuciwgcG9pbnQuZywgcG9pbnQuYiwgcG9pbnQuYV1cclxuICAgICAgKTtcclxuICAgICAgYXJyYXlPZlBvaW50cy5wdXNoKHApO1xyXG4gICAgfVxyXG4gICAgc3dpdGNoIChpdGVtLnR5cGUpIHtcclxuICAgICAgY2FzZSBUeXBlLkxpbmU6XHJcbiAgICAgICAgY29uc3QgbGluZSA9IG5ldyBMaW5lKGl0ZW0uaWQsIGFycmF5T2ZQb2ludHNbMF0pO1xyXG4gICAgICAgIGxpbmUuc2V0TGluZUF0dHJpYnV0ZXMoXHJcbiAgICAgICAgICB0eCxcclxuICAgICAgICAgIHR5LFxyXG4gICAgICAgICAgZGVncmVlLFxyXG4gICAgICAgICAgc3gsXHJcbiAgICAgICAgICBzeSxcclxuICAgICAgICAgIGt4LFxyXG4gICAgICAgICAga3ksXHJcbiAgICAgICAgICBhcnJheU9mUG9pbnRzWzFdXHJcbiAgICAgICAgKTtcclxuICAgICAgICBzaGFwZS5wdXNoKGxpbmUpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFR5cGUuU3F1YXJlOlxyXG4gICAgICAgIGNvbnN0IHNxdWFyZSA9IG5ldyBTcXVhcmUoaXRlbS5pZCwgaXRlbS5jZW50ZXIpO1xyXG4gICAgICAgIHNxdWFyZS5zZXRTcXVhcmVBdHRyaWJ1dGVzKFxyXG4gICAgICAgICAgdHgsXHJcbiAgICAgICAgICB0eSxcclxuICAgICAgICAgIGRlZ3JlZSxcclxuICAgICAgICAgIHN4LFxyXG4gICAgICAgICAgc3ksXHJcbiAgICAgICAgICBreCxcclxuICAgICAgICAgIGt5LFxyXG4gICAgICAgICAgYXJyYXlPZlBvaW50c1xyXG4gICAgICAgICk7XHJcbiAgICAgICAgc2hhcGUucHVzaChzcXVhcmUpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFR5cGUuUmVjdGFuZ2xlOlxyXG4gICAgICAgIGNvbnN0IHJlY3RhbmdsZSA9IG5ldyBSZWN0YW5nbGUoaXRlbS5pZCwgYXJyYXlPZlBvaW50c1swXSk7XHJcbiAgICAgICAgcmVjdGFuZ2xlLnNldFJlY3RhbmdsZUF0dHJpYnV0ZXMoXHJcbiAgICAgICAgICB0eCxcclxuICAgICAgICAgIHR5LFxyXG4gICAgICAgICAgZGVncmVlLFxyXG4gICAgICAgICAgc3gsXHJcbiAgICAgICAgICBzeSxcclxuICAgICAgICAgIGt4LFxyXG4gICAgICAgICAga3ksXHJcbiAgICAgICAgICBhcnJheU9mUG9pbnRzXHJcbiAgICAgICAgKTtcclxuICAgICAgICBzaGFwZS5wdXNoKHJlY3RhbmdsZSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgVHlwZS5Qb2x5Z29uOlxyXG4gICAgICAgIGNvbnN0IHBvbHlnb24gPSBuZXcgUG9seWdvbihpdGVtLmlkLCBhcnJheU9mUG9pbnRzWzBdKTtcclxuICAgICAgICBwb2x5Z29uLnNldFBvbHlnb25BdHRyaWJ1dGVzKFxyXG4gICAgICAgICAgdHgsXHJcbiAgICAgICAgICB0eSxcclxuICAgICAgICAgIGRlZ3JlZSxcclxuICAgICAgICAgIHN4LFxyXG4gICAgICAgICAgc3ksXHJcbiAgICAgICAgICBreCxcclxuICAgICAgICAgIGt5LFxyXG4gICAgICAgICAgYXJyYXlPZlBvaW50c1xyXG4gICAgICAgICk7XHJcbiAgICAgICAgc2hhcGUucHVzaChwb2x5Z29uKTtcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIHNoYXBlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzdG9yZVNoYXBlcyhzaGFwZTogU2hhcGVbXSk6IHN0cmluZyB7XHJcbiAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHNoYXBlKTtcclxufVxyXG5cclxuZnVuY3Rpb24gaGFuZGxlRG93bmxvYWQodGV4dDogc3RyaW5nKTogdm9pZCB7XHJcbiAgY29uc3QgZGF0YSA9IG5ldyBGaWxlKFt0ZXh0XSwgXCJzaGFwZXMuanNvblwiLCB7IHR5cGU6IFwiYXBwbGljYXRpb24vanNvblwiIH0pO1xyXG5cclxuICBjb25zdCB1cmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGRhdGEpO1xyXG5cclxuICBjb25zdCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XHJcbiAgYS5ocmVmID0gdXJsO1xyXG4gIGEuZG93bmxvYWQgPSBkYXRhLm5hbWU7XHJcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChhKTtcclxuICBhLmNsaWNrKCk7XHJcbiAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChhKTtcclxuICBVUkwucmV2b2tlT2JqZWN0VVJMKHVybCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhhbmRsZVVwbG9hZChjYWxsYmFjazogKHRleHQ6IHN0cmluZykgPT4gdm9pZCk6IHZvaWQge1xyXG4gIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gIGlucHV0LnR5cGUgPSBcImZpbGVcIjtcclxuICBpbnB1dC5hY2NlcHQgPSBcImFwcGxpY2F0aW9uL2pzb25cIjtcclxuXHJcbiAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoKSA9PiB7XHJcbiAgICBjb25zdCBmaWxlID0gaW5wdXQuZmlsZXNbMF07XHJcbiAgICBjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG5cclxuICAgIHJlYWRlci5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgIGNhbGxiYWNrKHJlYWRlci5yZXN1bHQgYXMgc3RyaW5nKTtcclxuICAgIH07XHJcbiAgICByZWFkZXIucmVhZEFzVGV4dChmaWxlKTtcclxuICB9KTtcclxuXHJcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChpbnB1dCk7XHJcbiAgaW5wdXQuY2xpY2soKTtcclxuICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGlucHV0KTtcclxufVxyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=