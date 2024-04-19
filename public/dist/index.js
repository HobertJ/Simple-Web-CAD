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
    reDraw(point, info) {
        if (info === "p1") {
            this.arrayOfPoints[0] = new point_1.default(point.getPair(), this.arrayOfPoints[0].getColor());
        }
        else {
            this.arrayOfPoints[1] = new point_1.default(point.getPair(), this.arrayOfPoints[1].getColor());
        }
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
    reDraw(point, info) {
        switch (info) {
            case "p1":
                this.arrayOfPoints[0] = new point_1.default(point.getPair(), this.arrayOfPoints[0].getColor());
                this.arrayOfPoints[1] = new point_1.default([point.x, this.arrayOfPoints[1].y], this.arrayOfPoints[1].getColor());
                this.arrayOfPoints[3] = new point_1.default([this.arrayOfPoints[3].x, point.y], this.arrayOfPoints[3].getColor());
                break;
            case "p2":
                this.arrayOfPoints[0] = new point_1.default([point.x, this.arrayOfPoints[0].y], this.arrayOfPoints[0].getColor());
                this.arrayOfPoints[1] = new point_1.default(point.getPair(), this.arrayOfPoints[1].getColor());
                this.arrayOfPoints[2] = new point_1.default([this.arrayOfPoints[2].x, point.y], this.arrayOfPoints[2].getColor());
                break;
            case "p3":
                this.arrayOfPoints[1] = new point_1.default([this.arrayOfPoints[1].x, point.y], this.arrayOfPoints[1].getColor());
                this.arrayOfPoints[2] = new point_1.default(point.getPair(), this.arrayOfPoints[2].getColor());
                this.arrayOfPoints[3] = new point_1.default([point.x, this.arrayOfPoints[3].y], this.arrayOfPoints[3].getColor());
                break;
            case "p4":
                this.arrayOfPoints[0] = new point_1.default([this.arrayOfPoints[0].x, point.y], this.arrayOfPoints[0].getColor());
                this.arrayOfPoints[2] = new point_1.default([point.x, this.arrayOfPoints[2].y], this.arrayOfPoints[2].getColor());
                this.arrayOfPoints[3] = new point_1.default(point.getPair(), this.arrayOfPoints[3].getColor());
                break;
        }
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
    reDraw(point, info) {
        const [xCenter, yCenter] = this.center.getPair();
        const tempPointArr = [null, null, null, null];
        for (let i = 0; i < 4; i++) {
            tempPointArr[i] = this.arrayOfPoints[i];
        }
        switch (info) {
            case "p1":
                this.arrayOfPoints[0] = point;
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
                break;
            case "p2":
                this.arrayOfPoints[1] = point;
                this.arrayOfPoints[0] = Transformation_1.default.translation(xCenter, yCenter)
                    .multiplyMatrix(Transformation_1.default.rotation(-(0.5 * Math.PI)))
                    .multiplyMatrix(Transformation_1.default.translation(-xCenter, -yCenter))
                    .multiplyPoint(this.arrayOfPoints[0]);
                this.arrayOfPoints[2] = Transformation_1.default.translation(xCenter, yCenter)
                    .multiplyMatrix(Transformation_1.default.rotation(0.5 * Math.PI))
                    .multiplyMatrix(Transformation_1.default.translation(-xCenter, -yCenter))
                    .multiplyPoint(this.arrayOfPoints[0]);
                this.arrayOfPoints[3] = Transformation_1.default.translation(xCenter, yCenter)
                    .multiplyMatrix(Transformation_1.default.rotation(Math.PI))
                    .multiplyMatrix(Transformation_1.default.translation(-xCenter, -yCenter))
                    .multiplyPoint(this.arrayOfPoints[0]);
                break;
            case "p3":
                this.arrayOfPoints[2] = point;
                this.arrayOfPoints[0] = Transformation_1.default.translation(xCenter, yCenter)
                    .multiplyMatrix(Transformation_1.default.rotation(-Math.PI))
                    .multiplyMatrix(Transformation_1.default.translation(-xCenter, -yCenter))
                    .multiplyPoint(this.arrayOfPoints[0]);
                this.arrayOfPoints[2] = Transformation_1.default.translation(xCenter, yCenter)
                    .multiplyMatrix(Transformation_1.default.rotation(-(0.5 * Math.PI)))
                    .multiplyMatrix(Transformation_1.default.translation(-xCenter, -yCenter))
                    .multiplyPoint(this.arrayOfPoints[0]);
                this.arrayOfPoints[3] = Transformation_1.default.translation(xCenter, yCenter)
                    .multiplyMatrix(Transformation_1.default.rotation(0.5 * Math.PI))
                    .multiplyMatrix(Transformation_1.default.translation(-xCenter, -yCenter))
                    .multiplyPoint(this.arrayOfPoints[0]);
                break;
            case "p4":
                this.arrayOfPoints[3] = point;
                this.arrayOfPoints[0] = Transformation_1.default.translation(xCenter, yCenter)
                    .multiplyMatrix(Transformation_1.default.rotation(-(1.5 * Math.PI)))
                    .multiplyMatrix(Transformation_1.default.translation(-xCenter, -yCenter))
                    .multiplyPoint(this.arrayOfPoints[0]);
                this.arrayOfPoints[2] = Transformation_1.default.translation(xCenter, yCenter)
                    .multiplyMatrix(Transformation_1.default.rotation(-Math.PI))
                    .multiplyMatrix(Transformation_1.default.translation(-xCenter, -yCenter))
                    .multiplyPoint(this.arrayOfPoints[0]);
                this.arrayOfPoints[3] = Transformation_1.default.translation(xCenter, yCenter)
                    .multiplyMatrix(Transformation_1.default.rotation(-(0.5 * Math.PI)))
                    .multiplyMatrix(Transformation_1.default.translation(-xCenter, -yCenter))
                    .multiplyPoint(this.arrayOfPoints[0]);
                break;
        }
        for (let i = 0; i < 4; i++) {
            this.arrayOfPoints[i].setColor(tempPointArr[i].getColor());
        }
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
    Type[Type["Unigon"] = 4] = "Unigon";
})(Type || (Type = {}));
exports["default"] = Type;


/***/ }),

/***/ "./src/2D-Shapes/unigon.ts":
/*!*********************************!*\
  !*** ./src/2D-Shapes/unigon.ts ***!
  \*********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Transformation_1 = __importDefault(__webpack_require__(/*! Operations/Transformation */ "./src/Operations/Transformation.ts"));
const shape_1 = __importDefault(__webpack_require__(/*! Shapes/shape */ "./src/2D-Shapes/shape.ts"));
const type_enum_1 = __importDefault(__webpack_require__(/*! Shapes/type.enum */ "./src/2D-Shapes/type.enum.ts"));
const point_1 = __importDefault(__webpack_require__(/*! Base/point */ "./src/Base/point.ts"));
class Unigon extends shape_1.default {
    constructor(id, point) {
        super(id, 1, type_enum_1.default.Unigon);
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
        this.arrayOfPoints[this.arrayOfPoints.length] = point;
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
    setUnigonAttributes(tx, ty, degree, sx, sy, kx, ky, arrayOfPoints) {
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
exports["default"] = Unigon;


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
    static transformationMatrixWithoutProjection(width, height, tx, ty, degree, sx, sy, kx, ky, center) {
        return (Transformation.translation(tx, ty))
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
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const orientation_1 = __importDefault(__webpack_require__(/*! ./orientation */ "./src/Operations/orientation.ts"));
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
            if ((0, orientation_1.default)(points[p], points[i], points[q]) === 2) {
                q = i;
            }
        }
        p = q;
    } while (p !== l);
    return hull;
}
exports["default"] = convexHull;


/***/ }),

/***/ "./src/Operations/orientation.ts":
/*!***************************************!*\
  !*** ./src/Operations/orientation.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
function orientation(p, q, r) {
    const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
    if (val === 0)
        return 0;
    return val > 0 ? 1 : 2;
}
exports["default"] = orientation;


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
const unigon_1 = __importDefault(__webpack_require__(/*! Shapes/unigon */ "./src/2D-Shapes/unigon.ts"));
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
const unionBtn = document.getElementById("union-btn");
unionBtn.addEventListener("click", () => {
    const object1 = shapes[Number(selectionOfShapes1.value)];
    const object2 = shapes[Number(selectionOfShapes2.value)];
    union(object1, object2);
});
const selectionOfShapes1 = document.getElementById("selection-of-shapes1");
const selectionOfShapes2 = document.getElementById("selection-of-shapes2");
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
        if (currentObject.type !== type_enum_1.default.Polygon &&
            currentObject.type !== type_enum_1.default.Unigon) {
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
    if (isDrawing &&
        currentObject.type !== type_enum_1.default.Polygon &&
        currentObject.type !== type_enum_1.default.Unigon) {
        const x = event.clientX;
        const y = event.clientY;
        const point = new point_1.default([x, y]);
        currentObject.draw(point);
        (0, render_all_1.renderAll)(gl, programInfo, shapes, positionBuffer, colorBuffer);
        (0, render_1.render)(gl, programInfo, currentObject, positionBuffer, colorBuffer);
    }
});
function setupOption(isFirstDrawing, element) {
    const option1 = document.createElement("option");
    const option2 = document.createElement("option");
    const option3 = document.createElement("option");
    option1.value = element.id.toString();
    option2.value = element.id.toString();
    option3.value = element.id.toString();
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
        case type_enum_1.default.Unigon:
            optionText = `Unigon_${element.id}`;
            break;
    }
    option1.text = optionText;
    option2.text = optionText;
    option3.text = optionText;
    if (isFirstDrawing) {
        const listOfShapes = document.getElementById("list-of-shapes");
        const selectionOfShapes1 = document.getElementById("selection-of-shapes1");
        const selectionOfShapes2 = document.getElementById("selection-of-shapes2");
        listOfShapes.appendChild(option1);
        selectionOfShapes1.appendChild(option2);
        selectionOfShapes2.appendChild(option3);
        listOfShapes.value = element.id.toString();
        selectionOfShapes1.value = element.id.toString();
        selectionOfShapes2.value = element.id.toString();
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
    if (element.type === type_enum_1.default.Polygon || element.type === type_enum_1.default.Unigon) {
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
    else if (element.type == type_enum_1.default.Polygon || element.type == type_enum_1.default.Unigon) {
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
    sliderRotation_value.textContent = ((180 * element.degree) / Math.PI)
        .toFixed(0)
        .toString();
    sliderRotation.step = "10";
    sliderRotation.addEventListener("input", (event) => {
        const deltaDegree = event.target.value;
        element.degree = (Number(deltaDegree) / 180) * Math.PI;
        sliderRotation_value.textContent = ((180 * element.degree) / Math.PI)
            .toFixed(0)
            .toString();
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
        setupPointMoveButton(gl, programInfo, pointIndex, element);
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
    if (element instanceof polygon_1.default || element instanceof unigon_1.default) {
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
    setupPointMoveButton(gl, programInfo, 0, element);
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
    if (element instanceof polygon_1.default || element instanceof unigon_1.default) {
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
function setupPointMoveButton(gl, programInfo, pointIndex, element) {
    let moveX;
    let moveY;
    const moveXPointNegative_original = document.getElementById("negativeX");
    const moveXPointPositive_original = document.getElementById("positiveX");
    const moveYPointNegative_original = document.getElementById("negativeY");
    const moveYPointPositive_original = document.getElementById("positiveY");
    const moveXPointNegative = moveXPointNegative_original.cloneNode(true);
    const moveXPointPositive = moveXPointPositive_original.cloneNode(true);
    const moveYPointNegative = moveYPointNegative_original.cloneNode(true);
    const moveYPointPositive = moveYPointPositive_original.cloneNode(true);
    moveXPointNegative_original.parentNode.replaceChild(moveXPointNegative, moveXPointNegative_original);
    moveXPointPositive_original.parentNode.replaceChild(moveXPointPositive, moveXPointPositive_original);
    moveYPointNegative_original.parentNode.replaceChild(moveYPointNegative, moveYPointNegative_original);
    moveYPointPositive_original.parentNode.replaceChild(moveYPointPositive, moveYPointPositive_original);
    if (element.type == type_enum_1.default.Polygon || element.type == type_enum_1.default.Unigon) {
        moveXPointNegative.disabled = true;
        moveXPointPositive.disabled = true;
        moveYPointNegative.disabled = true;
        moveYPointPositive.disabled = true;
    }
    moveXPointNegative.addEventListener("click", () => {
        moveX = -10;
        let point = new point_1.default([element.arrayOfPoints[pointIndex].x + moveX, element.arrayOfPoints[pointIndex].y]);
        const pointInfo = "p" + (pointIndex + 1).toString();
        switch (element.type) {
            case type_enum_1.default.Line:
                element.reDraw(point, pointInfo);
            case type_enum_1.default.Square:
                element.reDraw(point, pointInfo);
            case type_enum_1.default.Rectangle:
                element.reDraw(point, pointInfo);
        }
        (0, render_all_1.renderAll)(gl, programInfo, shapes, positionBuffer, colorBuffer);
    });
    moveXPointPositive.addEventListener("click", () => {
        moveX = 10;
        let point = new point_1.default([element.arrayOfPoints[pointIndex].x + moveX, element.arrayOfPoints[pointIndex].y]);
        const pointInfo = "p" + (pointIndex + 1).toString();
        switch (element.type) {
            case type_enum_1.default.Line:
                element.reDraw(point, pointInfo);
            case type_enum_1.default.Square:
                element.reDraw(point, pointInfo);
            case type_enum_1.default.Rectangle:
                element.reDraw(point, pointInfo);
        }
        (0, render_all_1.renderAll)(gl, programInfo, shapes, positionBuffer, colorBuffer);
    });
    moveYPointNegative.addEventListener("click", () => {
        moveY = 10;
        let point = new point_1.default([element.arrayOfPoints[pointIndex].x, element.arrayOfPoints[pointIndex].y + moveY]);
        console.log(point.y);
        const pointInfo = "p" + (pointIndex + 1).toString();
        switch (element.type) {
            case type_enum_1.default.Line:
                element.reDraw(point, pointInfo);
            case type_enum_1.default.Square:
                element.reDraw(point, pointInfo);
            case type_enum_1.default.Rectangle:
                element.reDraw(point, pointInfo);
        }
        (0, render_all_1.renderAll)(gl, programInfo, shapes, positionBuffer, colorBuffer);
    });
    moveYPointPositive.addEventListener("click", () => {
        moveY = -10;
        let point = new point_1.default([element.arrayOfPoints[pointIndex].x, element.arrayOfPoints[pointIndex].y + moveY]);
        console.log(point.y);
        const pointInfo = "p" + (pointIndex + 1).toString();
        switch (element.type) {
            case type_enum_1.default.Line:
                element.reDraw(point, pointInfo);
            case type_enum_1.default.Square:
                element.reDraw(point, pointInfo);
            case type_enum_1.default.Rectangle:
                element.reDraw(point, pointInfo);
        }
        (0, render_all_1.renderAll)(gl, programInfo, shapes, positionBuffer, colorBuffer);
    });
}
// loadshape from json to array of shape
function loadShape(text) {
    const shape = [];
    const data = JSON.parse(text);
    const listOfShapes = document.getElementById("list-of-shapes");
    const selectionOfShapes1 = document.getElementById("selection-of-shapes1");
    const selectionOfShapes2 = document.getElementById("selection-of-shapes2");
    // clear the list of shapes option
    while (listOfShapes.firstChild) {
        listOfShapes.removeChild(listOfShapes.firstChild);
        selectionOfShapes1.removeChild(selectionOfShapes1.firstChild);
        selectionOfShapes2.removeChild(selectionOfShapes2.firstChild);
    }
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
                const square = new square_1.default(item.id, new point_1.default([item.center.x, item.center.y]));
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
            case type_enum_1.default.Unigon:
                const unigon = new unigon_1.default(item.id, arrayOfPoints[0]);
                unigon.setUnigonAttributes(tx, ty, degree, sx, sy, kx, ky, arrayOfPoints);
                shape.push(unigon);
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
function union(object1, object2) {
    currentObject = new unigon_1.default(shapes.length, object1.arrayOfPoints[0]);
    currentObject.arrayOfPoints = [];
    const matrix1 = Transformation_1.default.transformationMatrixWithoutProjection(gl.canvas.width, gl.canvas.height, object1.tx, object1.ty, object1.degree, object1.sx, object1.sy, object1.kx, object1.ky, object1.center);
    const matrix2 = Transformation_1.default.transformationMatrixWithoutProjection(gl.canvas.width, gl.canvas.height, object2.tx, object2.ty, object2.degree, object2.sx, object2.sy, object2.kx, object2.ky, object2.center);
    for (const point of object1.arrayOfPoints) {
        const newPoint = matrix1.multiplyPoint(point);
        currentObject.arrayOfPoints.push(newPoint);
    }
    for (const point of object2.arrayOfPoints) {
        const newPoint = matrix2.multiplyPoint(point);
        currentObject.arrayOfPoints.push(newPoint);
    }
    currentObject.setUnigonAttributes(0, 0, 0, 1, 1, 0, 0, currentObject.arrayOfPoints);
    shapes.push(currentObject);
    setupOption(true, currentObject);
    (0, render_all_1.renderAll)(gl, programInfo, shapes, positionBuffer, colorBuffer);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7Z0JBQ3hHLE1BQU07WUFDVixLQUFLLElBQUk7Z0JBQ0wsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLGVBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7Z0JBQ3hHLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxlQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztnQkFDckYsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLGVBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7Z0JBQ3hHLE1BQU07WUFDVixLQUFLLElBQUk7Z0JBQ0wsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLGVBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7Z0JBQ3hHLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxlQUFLLENBQUMsS0FBSyxDQUFD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RyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztRQUM3QyxNQUFNLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7UUFDN0MsTUFBTSxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO1FBQzdDLE1BQU0sR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztRQUM3QyxNQUFNLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7UUFDN0MsTUFBTSxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO1FBQzdDLE1BQU0sR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztRQUM3QyxNQUFNLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7UUFFN0MsTUFBTSxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUM3RSxPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBR00sYUFBYSxDQUFDLEtBQVk7UUFDN0IsTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztRQUNoQyxNQUFNLENBQUMsR0FBRyxF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QVE7SUFDN0MsTUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVsRSxJQUFJLEdBQUcsS0FBSyxDQUFDO1FBQUUsT0FBTyxDQUFDLENBQUM7SUFFeEIsT0FBTyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMzQixDQUFDO0FBRUQscUJBQWUsV0FBVyxDQUFDOzs7Ozs7Ozs7Ozs7OztBQ1YzQixTQUFTLFFBQVEsQ0FBQyxJQUF1QztJQUNyRCxNQUFNLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUMzRCxNQUFNLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUMzRCxNQUFNLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUUzRCx5Q0FBeUM7SUFDekMsTUFBTSxRQUFRLEdBQUcsSUFBSSxJQUFJLEdBQUcsSUFBSSxHQUFHLElBQUksRUFBRSxDQUFDO0lBRTFDLE9BQU8sUUFBUSxDQUFDO0FBQ3BCLENBQUM7QUFV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QUFFLFdBQVcsQ0FBQyxDQUFDO0FBQ2xFLENBQUM7Ozs7Ozs7VUNuNUJEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUV0QkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90dWdhcy1iZXNhci1ncmFma29tLTEtcGFpbnQvLi9zcmMvMkQtU2hhcGVzL2xpbmUudHMiLCJ3ZWJwYWNrOi8vdHVnYXMtYmVzYXItZ3JhZmtvbS0xLXBhaW50Ly4vc3JjLzJELVNoYXBlcy9wb2x5Z29uLnRzIiwid2VicGFjazovL3R1Z2FzLWJlc2FyLWdyYWZrb20tMS1wYWludC8uL3NyYy8yRC1TaGFwZXMvcmVjdGFuZ2xlLnRzIiwid2VicGFjazovL3R1Z2FzLWJlc2FyLWdyYWZrb20tMS1wYWludC8uL3NyYy8yRC1TaGFwZXMvc2hhcGUudHMiLCJ3ZWJwYWNrOi8vdHVnYXMtYmVzYXItZ3JhZmtvbS0xLXBhaW50Ly4vc3JjLzJELVNoYXBlcy9zcXVhcmUudHMiLCJ3ZWJwYWNrOi8vdHVnYXMtYmVzYXItZ3JhZmtvbS0xLXBhaW50Ly4vc3JjLzJELVNoYXBlcy90eXBlLmVudW0udHMiLCJ3ZWJwYWNrOi8vdHVnYXMtYmVzYXItZ3JhZmtvbS0xLXBhaW50Ly4vc3JjLzJELVNoYXBlcy91bmlnb24udHMiLCJ3ZWJwYWNrOi8vdHVnYXMtYmVzYXItZ3JhZmtvbS0xLXBhaW50Ly4vc3JjL0Jhc2UvY29vcmRpbmF0ZS50cyIsIndlYnBhY2s6Ly90dWdhcy1iZXNhci1ncmFma29tLTEtcGFpbnQvLi9zcmMvQmFzZS9tYXRyaXgudHMiLCJ3ZWJwYWNrOi8vdHVnYXMtYmVzYXItZ3JhZmtvbS0xLXBhaW50Ly4vc3JjL0Jhc2UvcG9pbnQudHMiLCJ3ZWJwYWNrOi8vdHVnYXMtYmVzYXItZ3JhZmtvbS0xLXBhaW50Ly4vc3JjL0Z1bmN0aW9ucy9jcmVhdGUtc2hhZGVyLXByb2dyYW0udHMiLCJ3ZWJwYWNrOi8vdHVnYXMtYmVzYXItZ3JhZmtvbS0xLXBhaW50Ly4vc3JjL0Z1bmN0aW9ucy9sb2FkLXNoYWRlci50cyIsIndlYnBhY2s6Ly90dWdhcy1iZXNhci1ncmFma29tLTEtcGFpbnQvLi9zcmMvRnVuY3Rpb25zL3JlbmRlci1hbGwudHMiLCJ3ZWJwYWNrOi8vdHVnYXMtYmVzYXItZ3JhZmtvbS0xLXBhaW50Ly4vc3JjL0Z1bmN0aW9ucy9yZW5kZXIudHMiLCJ3ZWJwYWNrOi8vdHVnYXMtYmVzYXItZ3JhZmtvbS0xLXBhaW50Ly4vc3JjL09wZXJhdGlvbnMvVHJhbnNmb3JtYXRpb24udHMiLCJ3ZWJwYWNrOi8vdHVnYXMtYmVzYXItZ3JhZmtvbS0xLXBhaW50Ly4vc3JjL09wZXJhdGlvbnMvY29udmV4LWh1bGwudHMiLCJ3ZWJwYWNrOi8vdHVnYXMtYmVzYXItZ3JhZmtvbS0xLXBhaW50Ly4vc3JjL09wZXJhdGlvbnMvb3JpZW50YXRpb24udHMiLCJ3ZWJwYWNrOi8vdHVnYXMtYmVzYXItZ3JhZmtvbS0xLXBhaW50Ly4vc3JjL1V0aWxzL3Rvb2xzLnRzIiwid2VicGFjazovL3R1Z2FzLWJlc2FyLWdyYWZrb20tMS1wYWludC8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly90dWdhcy1iZXNhci1ncmFma29tLTEtcGFpbnQvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdHVnYXMtYmVzYXItZ3JhZmtvbS0xLXBhaW50L3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vdHVnYXMtYmVzYXItZ3JhZmtvbS0xLXBhaW50L3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly90dWdhcy1iZXNhci1ncmFma29tLTEtcGFpbnQvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZW5kZXJhYmxlIGZyb20gXCJJbnRlcmZhY2VzL3JlbmRlcmFibGUuaW50ZXJmYWNlXCI7XHJcbmltcG9ydCBUcmFuc2Zvcm1hYmxlIGZyb20gXCJJbnRlcmZhY2VzL3RyYW5zZm9ybWFibGUuaW50ZXJmYWNlXCI7XHJcbmltcG9ydCBTaGFwZSBmcm9tIFwiU2hhcGVzL3NoYXBlXCI7XHJcbmltcG9ydCBUeXBlIGZyb20gXCJTaGFwZXMvdHlwZS5lbnVtXCI7XHJcbmltcG9ydCBQb2ludCBmcm9tIFwiQmFzZS9wb2ludFwiO1xyXG5pbXBvcnQgVHJhbnNmb3JtYXRpb24gZnJvbSBcIk9wZXJhdGlvbnMvVHJhbnNmb3JtYXRpb25cIjtcclxuXHJcbmNsYXNzIExpbmUgZXh0ZW5kcyBTaGFwZSBpbXBsZW1lbnRzIFJlbmRlcmFibGUsIFRyYW5zZm9ybWFibGUge1xyXG5cclxuICAgIHB1YmxpYyB0eXBlOiBUeXBlLkxpbmU7XHJcbiAgICBwdWJsaWMgYXJyYXlPZlBvaW50czogUG9pbnRbXTtcclxuXHJcbiAgICBwdWJsaWMgY2VudGVyOiBQb2ludDtcclxuICAgIHB1YmxpYyB0eDogbnVtYmVyO1xyXG4gICAgcHVibGljIHR5OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgZGVncmVlOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgc3g6IG51bWJlcjtcclxuICAgIHB1YmxpYyBzeTogbnVtYmVyO1xyXG4gICAgcHVibGljIGt4OiBudW1iZXI7XHJcbiAgICBwdWJsaWMga3k6IG51bWJlcjtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoaWQ6IG51bWJlciwgcDE6IFBvaW50KSB7XHJcbiAgICAgICAgc3VwZXIoaWQsIDIsIFR5cGUuTGluZSk7XHJcbiAgICAgICAgdGhpcy5hcnJheU9mUG9pbnRzID0gW3AxXTtcclxuICAgICAgICB0aGlzLnR4ID0gMDtcclxuICAgICAgICB0aGlzLnR5ID0gMDtcclxuICAgICAgICB0aGlzLmRlZ3JlZSA9IDA7XHJcbiAgICAgICAgdGhpcy5zeCA9IDE7XHJcbiAgICAgICAgdGhpcy5zeSA9IDE7XHJcbiAgICAgICAgdGhpcy5reCA9IDA7XHJcbiAgICAgICAgdGhpcy5reSA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gVHJhbnNmb3JtYWJsZSBNZXRob2RzXHJcbiAgICBwdWJsaWMgYWRkTWF0cml4KGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsIG1hdHJpeExvY2F0aW9uOiBXZWJHTFVuaWZvcm1Mb2NhdGlvbik6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IG1hdHJpeCA9IFRyYW5zZm9ybWF0aW9uLnRyYW5zZm9ybWF0aW9uTWF0cml4KFxyXG4gICAgICAgICAgICBnbC5jYW52YXMud2lkdGgsXHJcbiAgICAgICAgICAgIGdsLmNhbnZhcy5oZWlnaHQsXHJcbiAgICAgICAgICAgIHRoaXMudHgsXHJcbiAgICAgICAgICAgIHRoaXMudHksXHJcbiAgICAgICAgICAgIHRoaXMuZGVncmVlLFxyXG4gICAgICAgICAgICB0aGlzLnN4LFxyXG4gICAgICAgICAgICB0aGlzLnN5LFxyXG4gICAgICAgICAgICB0aGlzLmt4LFxyXG4gICAgICAgICAgICB0aGlzLmt5LFxyXG4gICAgICAgICAgICB0aGlzLmdldENlbnRlcigpXHJcbiAgICAgICAgICApLmZsYXR0ZW4oKTtcclxuICAgICAgXHJcbiAgICAgICAgICBnbC51bmlmb3JtTWF0cml4M2Z2KG1hdHJpeExvY2F0aW9uLCBmYWxzZSwgbWF0cml4KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0Q2VudGVyKCk6IFBvaW50IHtcclxuICAgICAgICBjb25zdCBudW1Qb2ludHMgPSB0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoO1xyXG4gICAgICAgIGxldCBjZW50ZXJYID0gMDtcclxuICAgICAgICBsZXQgY2VudGVyWSA9IDA7XHJcbiAgICAgICAgZm9yIChjb25zdCBwb2ludCBvZiB0aGlzLmFycmF5T2ZQb2ludHMpIHtcclxuICAgICAgICAgICAgY29uc3QgW3gsIHldID0gcG9pbnQuZ2V0UGFpcigpO1xyXG4gICAgICAgICAgICBjZW50ZXJYICs9IHg7XHJcbiAgICAgICAgICAgIGNlbnRlclkgKz0geTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2VudGVyWCAvPSBudW1Qb2ludHM7XHJcbiAgICAgICAgY2VudGVyWSAvPSBudW1Qb2ludHM7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgUG9pbnQoW2NlbnRlclgsIGNlbnRlclldLCBbMCwgMCwgMCwgMF0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkcmF3TWV0aG9kKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBnbC5MSU5FUztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaXNEcmF3YWJsZSgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aCA9PT0gMjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZHJhdyhwb2ludDogUG9pbnQpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmFycmF5T2ZQb2ludHNbMV0gPSBwb2ludDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVEcmF3KHBvaW50OiBQb2ludCwgaW5mbzogU3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgaWYoaW5mbyA9PT0gXCJwMVwiKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYXJyYXlPZlBvaW50c1swXSA9IG5ldyBQb2ludChwb2ludC5nZXRQYWlyKCksIHRoaXMuYXJyYXlPZlBvaW50c1swXS5nZXRDb2xvcigpKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmFycmF5T2ZQb2ludHNbMV0gPSBuZXcgUG9pbnQocG9pbnQuZ2V0UGFpcigpLCB0aGlzLmFycmF5T2ZQb2ludHNbMV0uZ2V0Q29sb3IoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXROdW1iZXJPZlZlcnRpY2VzVG9CZURyYXduKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIDI7XHJcbiAgICB9IFxyXG4gICAgXHJcbiAgICBwdWJsaWMgYWRkUG9zaXRpb24oZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCk6IHZvaWQge1xyXG4gICAgICAgIGdsLmJ1ZmZlckRhdGEoXHJcbiAgICAgICAgICAgIGdsLkFSUkFZX0JVRkZFUixcclxuICAgICAgICAgICAgbmV3IEZsb2F0MzJBcnJheShbLi4udGhpcy5hcnJheU9mUG9pbnRzWzBdLmdldFBhaXIoKSwgLi4udGhpcy5hcnJheU9mUG9pbnRzWzFdLmdldFBhaXIoKV0pLFxyXG4gICAgICAgICAgICBnbC5TVEFUSUNfRFJBV1xyXG4gICAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkQ29sb3IoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCk6IHZvaWQge1xyXG4gICAgICAgIGdsLmJ1ZmZlckRhdGEoXHJcbiAgICAgICAgICAgIGdsLkFSUkFZX0JVRkZFUixcclxuICAgICAgICAgICAgbmV3IEZsb2F0MzJBcnJheShbLi4udGhpcy5hcnJheU9mUG9pbnRzWzBdLmdldENvbG9yKCksIC4uLnRoaXMuYXJyYXlPZlBvaW50c1sxXS5nZXRDb2xvcigpXSksXHJcbiAgICAgICAgICAgIGdsLlNUQVRJQ19EUkFXXHJcbiAgICAgICAgICApO1xyXG4gICAgfSAgXHJcblxyXG4gICAgcHVibGljIHNldExpbmVBdHRyaWJ1dGVzKHR4OiBudW1iZXIsIHR5OiBudW1iZXIsIGRlZ3JlZTogbnVtYmVyLCBzeDogbnVtYmVyLCBzeTogbnVtYmVyLCBreDogbnVtYmVyLCBreTogbnVtYmVyLCBwMjogUG9pbnQpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmFycmF5T2ZQb2ludHMucHVzaChwMik7XHJcbiAgICAgICAgdGhpcy50eCA9IHR4O1xyXG4gICAgICAgIHRoaXMudHkgPSB0eTtcclxuICAgICAgICB0aGlzLmRlZ3JlZSA9IGRlZ3JlZTtcclxuICAgICAgICB0aGlzLnN4ID0gc3g7XHJcbiAgICAgICAgdGhpcy5zeSA9IHN5O1xyXG4gICAgICAgIHRoaXMua3ggPSBreDtcclxuICAgICAgICB0aGlzLmt5ID0ga3k7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IExpbmU7XHJcbiIsImltcG9ydCBUcmFuc2Zvcm1hdGlvbiBmcm9tIFwiT3BlcmF0aW9ucy9UcmFuc2Zvcm1hdGlvblwiO1xyXG5pbXBvcnQgUmVuZGVyYWJsZSBmcm9tIFwiSW50ZXJmYWNlcy9yZW5kZXJhYmxlLmludGVyZmFjZVwiO1xyXG5pbXBvcnQgVHJhbnNmb3JtYWJsZSBmcm9tIFwiSW50ZXJmYWNlcy90cmFuc2Zvcm1hYmxlLmludGVyZmFjZVwiO1xyXG5pbXBvcnQgU2hhcGUgZnJvbSBcIlNoYXBlcy9zaGFwZVwiO1xyXG5pbXBvcnQgVHlwZSBmcm9tIFwiU2hhcGVzL3R5cGUuZW51bVwiO1xyXG5pbXBvcnQgUG9pbnQgZnJvbSBcIkJhc2UvcG9pbnRcIjtcclxuaW1wb3J0IGNvbnZleEh1bGwgZnJvbSBcIk9wZXJhdGlvbnMvY29udmV4LWh1bGxcIjtcclxuXHJcbmNsYXNzIFBvbHlnb24gZXh0ZW5kcyBTaGFwZSBpbXBsZW1lbnRzIFJlbmRlcmFibGUsIFRyYW5zZm9ybWFibGUge1xyXG4gICAgcHVibGljIHR5cGU6IFR5cGUuUG9seWdvbjtcclxuICAgIHB1YmxpYyBhcnJheU9mUG9pbnRzOiBQb2ludFtdO1xyXG5cclxuICAgIHB1YmxpYyBjZW50ZXI6IFBvaW50O1xyXG4gICAgcHVibGljIHR4OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgdHk6IG51bWJlcjtcclxuICAgIHB1YmxpYyBkZWdyZWU6IG51bWJlcjtcclxuICAgIHB1YmxpYyBzeDogbnVtYmVyO1xyXG4gICAgcHVibGljIHN5OiBudW1iZXI7XHJcbiAgICBwdWJsaWMga3g6IG51bWJlcjtcclxuICAgIHB1YmxpYyBreTogbnVtYmVyO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihpZDogbnVtYmVyLCBwb2ludDogUG9pbnQpIHtcclxuICAgICAgICBzdXBlcihpZCwgMSwgVHlwZS5Qb2x5Z29uKTtcclxuICAgICAgICB0aGlzLmFycmF5T2ZQb2ludHMgPSBuZXcgQXJyYXkocG9pbnQpO1xyXG4gICAgICAgIHRoaXMudHggPSAwO1xyXG4gICAgICAgIHRoaXMudHkgPSAwO1xyXG4gICAgICAgIHRoaXMuZGVncmVlID0gMDtcclxuICAgICAgICB0aGlzLnN4ID0gMTtcclxuICAgICAgICB0aGlzLnN5ID0gMTtcclxuICAgICAgICB0aGlzLmt4ID0gMDtcclxuICAgICAgICB0aGlzLmt5ID0gMDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0Q2VudGVyKCk6IFBvaW50IHtcclxuICAgICAgICBsZXQgc3VtWCA9IDA7XHJcbiAgICAgICAgbGV0IHN1bVkgPSAwO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYXJyYXlPZlBvaW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBbeCwgeV0gPSB0aGlzLmFycmF5T2ZQb2ludHNbaV0uZ2V0UGFpcigpO1xyXG4gICAgICAgICAgICBzdW1YICs9IHg7XHJcbiAgICAgICAgICAgIHN1bVkgKz0geTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGNlbnRlclggPSBzdW1YIC8gdGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aDtcclxuICAgICAgICBjb25zdCBjZW50ZXJZID0gc3VtWSAvIHRoaXMuYXJyYXlPZlBvaW50cy5sZW5ndGg7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgUG9pbnQoW2NlbnRlclgsIGNlbnRlclldLCBbMCwgMCwgMCwgMF0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpc0RyYXdhYmxlKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoID49IDI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRyYXcgKHBvaW50OiBQb2ludCk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoID49IDMpIHtcclxuICAgICAgICAgICAgdGhpcy5hcnJheU9mUG9pbnRzID0gY29udmV4SHVsbChbLi4udGhpcy5hcnJheU9mUG9pbnRzLCBwb2ludF0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuYXJyYXlPZlBvaW50c1t0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoXSA9IHBvaW50O1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNlbnRlciA9IHRoaXMuZ2V0Q2VudGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRyYXdNZXRob2QoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJyYXlPZlBvaW50cy5sZW5ndGggPj0zID8gZ2wuVFJJQU5HTEVfRkFOIDogZ2wuTElORVM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldE51bWJlck9mVmVydGljZXNUb0JlRHJhd24oKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aCA7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZFBvc2l0aW9uKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCB2ZXJ0aWNlcyA9IG5ldyBGbG9hdDMyQXJyYXkodGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aCAqIDIpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYXJyYXlPZlBvaW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBbeCwgeV0gPSB0aGlzLmFycmF5T2ZQb2ludHNbaV0uZ2V0UGFpcigpO1xyXG4gICAgICAgICAgICB2ZXJ0aWNlc1tpICogMl0gPSB4O1xyXG4gICAgICAgICAgICB2ZXJ0aWNlc1tpICogMiArIDFdID0geTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IFtwSW5pdGlhbFgsIHBJbml0aWFsWV0gPSB0aGlzLmFycmF5T2ZQb2ludHNbMF0uZ2V0UGFpcigpO1xyXG4gICAgICAgIHZlcnRpY2VzW3RoaXMuYXJyYXlPZlBvaW50cy5sZW5ndGggKiAyXSA9IHBJbml0aWFsWDtcclxuICAgICAgICB2ZXJ0aWNlc1t0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoICogMiArIDFdID0gcEluaXRpYWxZO1xyXG5cclxuICAgICAgICBnbC5idWZmZXJEYXRhKGdsLkFSUkFZX0JVRkZFUiwgdmVydGljZXMsIGdsLlNUQVRJQ19EUkFXKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkQ29sb3IoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IGNvbG9ycyA9IG5ldyBGbG9hdDMyQXJyYXkodGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aCAqIDQpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYXJyYXlPZlBvaW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBbciwgZywgYiwgYV0gPSB0aGlzLmFycmF5T2ZQb2ludHNbaV0uZ2V0Q29sb3IoKTtcclxuICAgICAgICAgICAgY29sb3JzW2kgKiA0XSA9IHI7XHJcbiAgICAgICAgICAgIGNvbG9yc1tpICogNCArIDFdID0gZztcclxuICAgICAgICAgICAgY29sb3JzW2kgKiA0ICsgMl0gPSBiO1xyXG4gICAgICAgICAgICBjb2xvcnNbaSAqIDQgKyAzXSA9IGE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBbckluaXRpYWwsIGdJbml0aWFsLCBiSW5pdGlhbCwgYUluaXRpYWxdID0gdGhpcy5hcnJheU9mUG9pbnRzWzBdLmdldENvbG9yKCk7XHJcbiAgICAgICAgY29sb3JzW3RoaXMuYXJyYXlPZlBvaW50cy5sZW5ndGggKiA0XSA9IHJJbml0aWFsO1xyXG4gICAgICAgIGNvbG9yc1t0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoICogNCArIDFdID0gZ0luaXRpYWw7XHJcbiAgICAgICAgY29sb3JzW3RoaXMuYXJyYXlPZlBvaW50cy5sZW5ndGggKiA0ICsgMl0gPSBiSW5pdGlhbDtcclxuICAgICAgICBjb2xvcnNbdGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aCAqIDQgKyAzXSA9IGFJbml0aWFsO1xyXG5cclxuICAgICAgICBnbC5idWZmZXJEYXRhKGdsLkFSUkFZX0JVRkZFUiwgY29sb3JzLCBnbC5TVEFUSUNfRFJBVyk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgYWRkTWF0cml4KGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsIG1hdHJpeExvY2F0aW9uOiBXZWJHTFVuaWZvcm1Mb2NhdGlvbik6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IG1hdHJpeCA9IFRyYW5zZm9ybWF0aW9uLnRyYW5zZm9ybWF0aW9uTWF0cml4KFxyXG4gICAgICAgICAgICBnbC5jYW52YXMud2lkdGgsXHJcbiAgICAgICAgICAgIGdsLmNhbnZhcy5oZWlnaHQsXHJcbiAgICAgICAgICAgIHRoaXMudHgsXHJcbiAgICAgICAgICAgIHRoaXMudHksXHJcbiAgICAgICAgICAgIHRoaXMuZGVncmVlLFxyXG4gICAgICAgICAgICB0aGlzLnN4LFxyXG4gICAgICAgICAgICB0aGlzLnN5LFxyXG4gICAgICAgICAgICB0aGlzLmt4LFxyXG4gICAgICAgICAgICB0aGlzLmt5LFxyXG4gICAgICAgICAgICB0aGlzLmNlbnRlclxyXG4gICAgICAgICAgKS5mbGF0dGVuKCk7XHJcbiAgICAgIFxyXG4gICAgICAgICAgZ2wudW5pZm9ybU1hdHJpeDNmdihtYXRyaXhMb2NhdGlvbiwgZmFsc2UsIG1hdHJpeCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlbGV0ZVBvaW50KGluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICB2YXIgbmV3UG9pbnRzOiBQb2ludFtdID0gW3RoaXMuYXJyYXlPZlBvaW50c1tpbmRleF1dO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICBpZiAoaSAhPSBpbmRleCkge1xyXG4gICAgICAgICAgICBuZXdQb2ludHMucHVzaCh0aGlzLmFycmF5T2ZQb2ludHNbaV0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgIHRoaXMuYXJyYXlPZlBvaW50cyA9IG5ld1BvaW50cy5zbGljZSgxLCB0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoKTtcclxuICAgIFxyXG4gICAgICAgIC8vIGFmdGVyIGRlbGV0ZSwgbmVlZCB0byBzZXR1cCBvcHRpb24gYWdhaW5cclxuICAgICAgICBjb25zdCBwb2ludFBpY2tlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicG9pbnRQaWNrZXJcIik7XHJcbiAgICAgICAgcG9pbnRQaWNrZXIuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgICBwb2ludFBpY2tlci5yZXBsYWNlQ2hpbGRyZW4oKTtcclxuICAgICAgICAvKiBBbGwgUG9pbnQgKi9cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYXJyYXlPZlBvaW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgY29uc3QgbmV3UG9pbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xyXG4gICAgICAgICAgbmV3UG9pbnQudmFsdWUgPSBpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICBuZXdQb2ludC50ZXh0ID0gXCJwb2ludF9cIiArIGk7XHJcbiAgICAgICAgICBwb2ludFBpY2tlci5hcHBlbmRDaGlsZChuZXdQb2ludCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBwdWJsaWMgc2V0UG9seWdvbkF0dHJpYnV0ZXModHg6IG51bWJlciwgdHk6IG51bWJlciwgZGVncmVlOiBudW1iZXIsIHN4OiBudW1iZXIsIHN5OiBudW1iZXIsIGt4OiBudW1iZXIsIGt5OiBudW1iZXIsIGFycmF5T2ZQb2ludHM6IFBvaW50W10pOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmFycmF5T2ZQb2ludHMgPSBhcnJheU9mUG9pbnRzO1xyXG4gICAgICAgIHRoaXMudHggPSB0eDtcclxuICAgICAgICB0aGlzLnR5ID0gdHk7XHJcbiAgICAgICAgdGhpcy5kZWdyZWUgPSBkZWdyZWU7XHJcbiAgICAgICAgdGhpcy5zeCA9IHN4O1xyXG4gICAgICAgIHRoaXMuc3kgPSBzeTtcclxuICAgICAgICB0aGlzLmt4ID0ga3g7XHJcbiAgICAgICAgdGhpcy5reSA9IGt5O1xyXG4gICAgICAgIHRoaXMubnVtYmVyT2ZWZXJ0aWNlcyA9IGFycmF5T2ZQb2ludHMubGVuZ3RoO1xyXG4gICAgICAgIHRoaXMuY2VudGVyID0gdGhpcy5nZXRDZW50ZXIoKTtcclxuICAgICAgfVxyXG4gICAgXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFBvbHlnb247IiwiaW1wb3J0IFNoYXBlIGZyb20gXCJTaGFwZXMvc2hhcGVcIjtcclxuaW1wb3J0IFBvaW50IGZyb20gXCJCYXNlL3BvaW50XCI7XHJcbmltcG9ydCBUeXBlIGZyb20gXCJTaGFwZXMvdHlwZS5lbnVtXCI7XHJcbmltcG9ydCBSZW5kZXJhYmxlIGZyb20gXCJJbnRlcmZhY2VzL3JlbmRlcmFibGUuaW50ZXJmYWNlXCI7XHJcbmltcG9ydCBUcmFuc2Zvcm1hYmxlIGZyb20gXCJJbnRlcmZhY2VzL3RyYW5zZm9ybWFibGUuaW50ZXJmYWNlXCI7XHJcbmltcG9ydCBUcmFuc2Zvcm1hdGlvbiBmcm9tIFwiT3BlcmF0aW9ucy9UcmFuc2Zvcm1hdGlvblwiO1xyXG5cclxuY2xhc3MgUmVjdGFuZ2xlIGV4dGVuZHMgU2hhcGUgaW1wbGVtZW50cyBSZW5kZXJhYmxlLCBUcmFuc2Zvcm1hYmxlIHtcclxuICAgIHB1YmxpYyBhcnJheU9mUG9pbnRzOiBQb2ludFtdO1xyXG4gICAgcHVibGljIGNlbnRlcjogUG9pbnQ7XHJcbiAgICBwdWJsaWMgdHg6IG51bWJlcjtcclxuICAgIHB1YmxpYyB0eTogbnVtYmVyO1xyXG4gICAgcHVibGljIGRlZ3JlZTogbnVtYmVyO1xyXG4gICAgcHVibGljIHN4OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgc3k6IG51bWJlcjtcclxuICAgIHB1YmxpYyBreDogbnVtYmVyO1xyXG4gICAgcHVibGljIGt5OiBudW1iZXI7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKGlkOiBudW1iZXIsICBwMTogUG9pbnQpe1xyXG4gICAgICAgIHN1cGVyKGlkLCA0LCBUeXBlLlJlY3RhbmdsZSk7XHJcbiAgICAgICAgdGhpcy5hcnJheU9mUG9pbnRzID0gW3AxLCBudWxsLCBudWxsLCBudWxsXTtcclxuICAgICAgICB0aGlzLnR4ID0gMDtcclxuICAgICAgICB0aGlzLnR5ID0gMDtcclxuICAgICAgICB0aGlzLmRlZ3JlZSA9IDA7XHJcbiAgICAgICAgdGhpcy5zeCA9IDE7XHJcbiAgICAgICAgdGhpcy5zeSA9IDE7XHJcbiAgICAgICAgdGhpcy5reCA9IDA7XHJcbiAgICAgICAgdGhpcy5reSA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gVHJhbnNmb3JtYWJsZSBNZXRob2RzXHJcbiAgICBwdWJsaWMgZ2V0Q2VudGVyKCk6IFBvaW50IHtcclxuICAgICAgICBjb25zdCBbcDF4LCBwMXldID0gdGhpcy5hcnJheU9mUG9pbnRzWzBdLmdldFBhaXIoKTtcclxuICAgICAgICBjb25zdCBbcDJ4LCBwMnldID0gdGhpcy5hcnJheU9mUG9pbnRzWzFdLmdldFBhaXIoKTtcclxuICAgICAgICBjb25zdCBbcDN4LCBwM3ldID0gdGhpcy5hcnJheU9mUG9pbnRzWzJdLmdldFBhaXIoKTtcclxuICAgICAgICBjb25zdCBbcDR4LCBwNHldID0gdGhpcy5hcnJheU9mUG9pbnRzWzNdLmdldFBhaXIoKTtcclxuXHJcbiAgICAgICAgY29uc3QgY2VudGVyWCA9IChwMXggKyBwMnggKyBwM3ggKyBwNHgpIC8gNDtcclxuICAgICAgICBjb25zdCBjZW50ZXJZID0gKHAxeSArIHAyeSArIHAzeSArIHA0eSkgLyA0O1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBuZXcgUG9pbnQoW2NlbnRlclgsIGNlbnRlclldKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkTWF0cml4KGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsIG1hdHJpeExvY2F0aW9uOiBXZWJHTFVuaWZvcm1Mb2NhdGlvbik6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IG1hdHJpeCA9IFRyYW5zZm9ybWF0aW9uLnRyYW5zZm9ybWF0aW9uTWF0cml4KFxyXG4gICAgICAgICAgICBnbC5jYW52YXMud2lkdGgsXHJcbiAgICAgICAgICAgIGdsLmNhbnZhcy5oZWlnaHQsXHJcbiAgICAgICAgICAgIHRoaXMudHgsXHJcbiAgICAgICAgICAgIHRoaXMudHksXHJcbiAgICAgICAgICAgIHRoaXMuZGVncmVlLFxyXG4gICAgICAgICAgICB0aGlzLnN4LFxyXG4gICAgICAgICAgICB0aGlzLnN5LFxyXG4gICAgICAgICAgICB0aGlzLmt4LFxyXG4gICAgICAgICAgICB0aGlzLmt5LFxyXG4gICAgICAgICAgICB0aGlzLmNlbnRlclxyXG4gICAgICAgICAgKS5mbGF0dGVuKCk7XHJcbiAgICAgIFxyXG4gICAgICAgICAgZ2wudW5pZm9ybU1hdHJpeDNmdihtYXRyaXhMb2NhdGlvbiwgZmFsc2UsIG1hdHJpeCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUmVuZGVyYWJsZSBNZXRob2RzXHJcbiAgICBwdWJsaWMgZHJhd01ldGhvZChnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0KTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gZ2wuVFJJQU5HTEVfRkFOO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpc0RyYXdhYmxlKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIC8vIHJldHVybiB0aGlzLmFycmF5T2ZQb2ludHMuZmlsdGVyKHBvaW50ID0+IHBvaW50ICE9PSBudWxsKS5sZW5ndGggPT09IDQ7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJyYXlPZlBvaW50c1syXSAhPT0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZHJhdyhwb2ludDogUG9pbnQpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmFycmF5T2ZQb2ludHNbMV0gPSBuZXcgUG9pbnQoW3RoaXMuYXJyYXlPZlBvaW50c1swXS54LCBwb2ludC55XSk7XHJcbiAgICAgICAgdGhpcy5hcnJheU9mUG9pbnRzWzJdID0gcG9pbnQ7XHJcbiAgICAgICAgdGhpcy5hcnJheU9mUG9pbnRzWzNdID0gbmV3IFBvaW50KFtwb2ludC54LCB0aGlzLmFycmF5T2ZQb2ludHNbMF0ueV0pO1xyXG4gICAgICAgIHRoaXMuY2VudGVyID0gdGhpcy5nZXRDZW50ZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVEcmF3KHBvaW50OiBQb2ludCwgaW5mbzogU3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgc3dpdGNoKGluZm8pe1xyXG4gICAgICAgICAgICBjYXNlIFwicDFcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuYXJyYXlPZlBvaW50c1swXSA9IG5ldyBQb2ludChwb2ludC5nZXRQYWlyKCksIHRoaXMuYXJyYXlPZlBvaW50c1swXS5nZXRDb2xvcigpKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXJyYXlPZlBvaW50c1sxXSA9IG5ldyBQb2ludChbcG9pbnQueCwgdGhpcy5hcnJheU9mUG9pbnRzWzFdLnldLCB0aGlzLmFycmF5T2ZQb2ludHNbMV0uZ2V0Q29sb3IoKSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFycmF5T2ZQb2ludHNbM10gPSBuZXcgUG9pbnQoW3RoaXMuYXJyYXlPZlBvaW50c1szXS54LCBwb2ludC55XSwgdGhpcy5hcnJheU9mUG9pbnRzWzNdLmdldENvbG9yKCkpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJwMlwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5hcnJheU9mUG9pbnRzWzBdID0gbmV3IFBvaW50KFtwb2ludC54LCB0aGlzLmFycmF5T2ZQb2ludHNbMF0ueV0sIHRoaXMuYXJyYXlPZlBvaW50c1swXS5nZXRDb2xvcigpKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXJyYXlPZlBvaW50c1sxXSA9IG5ldyBQb2ludChwb2ludC5nZXRQYWlyKCksIHRoaXMuYXJyYXlPZlBvaW50c1sxXS5nZXRDb2xvcigpKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXJyYXlPZlBvaW50c1syXSA9IG5ldyBQb2ludChbdGhpcy5hcnJheU9mUG9pbnRzWzJdLngsIHBvaW50LnldLCB0aGlzLmFycmF5T2ZQb2ludHNbMl0uZ2V0Q29sb3IoKSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInAzXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFycmF5T2ZQb2ludHNbMV0gPSBuZXcgUG9pbnQoW3RoaXMuYXJyYXlPZlBvaW50c1sxXS54LCBwb2ludC55XSwgdGhpcy5hcnJheU9mUG9pbnRzWzFdLmdldENvbG9yKCkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hcnJheU9mUG9pbnRzWzJdID0gbmV3IFBvaW50KHBvaW50LmdldFBhaXIoKSwgdGhpcy5hcnJheU9mUG9pbnRzWzJdLmdldENvbG9yKCkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hcnJheU9mUG9pbnRzWzNdID0gbmV3IFBvaW50KFtwb2ludC54LCB0aGlzLmFycmF5T2ZQb2ludHNbM10ueV0sIHRoaXMuYXJyYXlPZlBvaW50c1szXS5nZXRDb2xvcigpKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwicDRcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuYXJyYXlPZlBvaW50c1swXSA9IG5ldyBQb2ludChbdGhpcy5hcnJheU9mUG9pbnRzWzBdLngsIHBvaW50LnldLCB0aGlzLmFycmF5T2ZQb2ludHNbMF0uZ2V0Q29sb3IoKSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFycmF5T2ZQb2ludHNbMl0gPSBuZXcgUG9pbnQoW3BvaW50LngsIHRoaXMuYXJyYXlPZlBvaW50c1syXS55XSwgdGhpcy5hcnJheU9mUG9pbnRzWzJdLmdldENvbG9yKCkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hcnJheU9mUG9pbnRzWzNdID0gbmV3IFBvaW50KHBvaW50LmdldFBhaXIoKSwgdGhpcy5hcnJheU9mUG9pbnRzWzNdLmdldENvbG9yKCkpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY2VudGVyID0gdGhpcy5nZXRDZW50ZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0TnVtYmVyT2ZWZXJ0aWNlc1RvQmVEcmF3bigpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiA1O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRQb3NpdGlvbihnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0KTogdm9pZCB7XHJcbiAgICAgICAgZ2wuYnVmZmVyRGF0YShcclxuICAgICAgICAgICAgZ2wuQVJSQVlfQlVGRkVSLFxyXG4gICAgICAgICAgICBuZXcgRmxvYXQzMkFycmF5KFtcclxuICAgICAgICAgICAgICAuLi50aGlzLmFycmF5T2ZQb2ludHNbMF0uZ2V0UGFpcigpLFxyXG4gICAgICAgICAgICAgIC4uLnRoaXMuYXJyYXlPZlBvaW50c1sxXS5nZXRQYWlyKCksXHJcbiAgICAgICAgICAgICAgLi4udGhpcy5hcnJheU9mUG9pbnRzWzJdLmdldFBhaXIoKSxcclxuICAgICAgICAgICAgICAuLi50aGlzLmFycmF5T2ZQb2ludHNbM10uZ2V0UGFpcigpLFxyXG4gICAgICAgICAgICAgIC4uLnRoaXMuYXJyYXlPZlBvaW50c1swXS5nZXRQYWlyKCksXHJcbiAgICAgICAgICAgIF0pLFxyXG4gICAgICAgICAgICBnbC5TVEFUSUNfRFJBV1xyXG4gICAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkQ29sb3IoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCk6IHZvaWQge1xyXG4gICAgICAgIGdsLmJ1ZmZlckRhdGEoXHJcbiAgICAgICAgICAgIGdsLkFSUkFZX0JVRkZFUixcclxuICAgICAgICAgICAgbmV3IEZsb2F0MzJBcnJheShbXHJcbiAgICAgICAgICAgICAgLi4udGhpcy5hcnJheU9mUG9pbnRzWzBdLmdldENvbG9yKCksXHJcbiAgICAgICAgICAgICAgLi4udGhpcy5hcnJheU9mUG9pbnRzWzFdLmdldENvbG9yKCksXHJcbiAgICAgICAgICAgICAgLi4udGhpcy5hcnJheU9mUG9pbnRzWzJdLmdldENvbG9yKCksXHJcbiAgICAgICAgICAgICAgLi4udGhpcy5hcnJheU9mUG9pbnRzWzNdLmdldENvbG9yKCksXHJcbiAgICAgICAgICAgICAgLi4udGhpcy5hcnJheU9mUG9pbnRzWzBdLmdldENvbG9yKCksXHJcbiAgICAgICAgICAgIF0pLFxyXG4gICAgICAgICAgICBnbC5TVEFUSUNfRFJBV1xyXG4gICAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0UmVjdGFuZ2xlQXR0cmlidXRlcyh0eDogbnVtYmVyLCB0eTogbnVtYmVyLCBkZWdyZWU6IG51bWJlciwgc3g6IG51bWJlciwgc3k6IG51bWJlciwga3g6IG51bWJlciwga3k6IG51bWJlciwgYXJyYXlPZlBvaW50czogUG9pbnRbXSk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuYXJyYXlPZlBvaW50cyA9IGFycmF5T2ZQb2ludHM7XHJcbiAgICAgICAgdGhpcy50eCA9IHR4O1xyXG4gICAgICAgIHRoaXMudHkgPSB0eTtcclxuICAgICAgICB0aGlzLmRlZ3JlZSA9IGRlZ3JlZTtcclxuICAgICAgICB0aGlzLnN4ID0gc3g7XHJcbiAgICAgICAgdGhpcy5zeSA9IHN5O1xyXG4gICAgICAgIHRoaXMua3ggPSBreDtcclxuICAgICAgICB0aGlzLmt5ID0ga3k7XHJcbiAgICAgICAgdGhpcy5jZW50ZXIgPSB0aGlzLmdldENlbnRlcigpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBSZWN0YW5nbGU7XHJcbiIsImltcG9ydCBQb2ludCBmcm9tIFwiQmFzZS9wb2ludFwiO1xyXG5pbXBvcnQgVHlwZSBmcm9tIFwiU2hhcGVzL3R5cGUuZW51bVwiO1xyXG5hYnN0cmFjdCBjbGFzcyBTaGFwZSB7XHJcbiAgICBwdWJsaWMgaWQ6IG51bWJlcjtcclxuICAgIHB1YmxpYyBudW1iZXJPZlZlcnRpY2VzOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgdHlwZTogVHlwZTtcclxuICAgIHB1YmxpYyBhcnJheU9mUG9pbnRzOiBQb2ludFtdO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihpZDogbnVtYmVyLCBudW1iZXJPZlZlcnRpY2VzOiBudW1iZXIsIHR5cGU6IFR5cGUpe1xyXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcclxuICAgICAgICB0aGlzLm51bWJlck9mVmVydGljZXMgPSBudW1iZXJPZlZlcnRpY2VzO1xyXG4gICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFic3RyYWN0IGdldENlbnRlcigpOiBQb2ludDtcclxuICAgIHB1YmxpYyBhYnN0cmFjdCBpc0RyYXdhYmxlKCk6IGJvb2xlYW47XHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgZHJhdyhwb2ludDogUG9pbnQpOiB2b2lkO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBTaGFwZTsiLCJpbXBvcnQgUmVuZGVyYWJsZSBmcm9tIFwiSW50ZXJmYWNlcy9yZW5kZXJhYmxlLmludGVyZmFjZVwiO1xyXG5pbXBvcnQgU2hhcGUgZnJvbSBcIlNoYXBlcy9zaGFwZVwiO1xyXG5pbXBvcnQgVHJhbnNmb3JtYXRpb24gZnJvbSBcIk9wZXJhdGlvbnMvVHJhbnNmb3JtYXRpb25cIjtcclxuaW1wb3J0IFRyYW5zZm9ybWFibGUgZnJvbSBcIkludGVyZmFjZXMvdHJhbnNmb3JtYWJsZS5pbnRlcmZhY2VcIjtcclxuaW1wb3J0IFBvaW50IGZyb20gXCJCYXNlL3BvaW50XCI7XHJcbmltcG9ydCBUeXBlIGZyb20gXCJTaGFwZXMvdHlwZS5lbnVtXCI7XHJcblxyXG5jbGFzcyBTcXVhcmUgZXh0ZW5kcyBTaGFwZSBpbXBsZW1lbnRzIFJlbmRlcmFibGUsIFRyYW5zZm9ybWFibGUge1xyXG4gIHB1YmxpYyBjZW50ZXI6IFBvaW50O1xyXG4gIHB1YmxpYyBhcnJheU9mUG9pbnRzOiBQb2ludFtdO1xyXG4gIHB1YmxpYyB0eDogbnVtYmVyO1xyXG4gIHB1YmxpYyB0eTogbnVtYmVyO1xyXG4gIHB1YmxpYyBkZWdyZWU6IG51bWJlcjtcclxuICBwdWJsaWMgc3g6IG51bWJlcjtcclxuICBwdWJsaWMgc3k6IG51bWJlcjtcclxuICBwdWJsaWMga3g6IG51bWJlcjtcclxuICBwdWJsaWMga3k6IG51bWJlcjtcclxuXHJcbiAgcHVibGljIGNvbnN0cnVjdG9yKGlkOiBudW1iZXIsIGNlbnRlclBvaW50OiBQb2ludCkge1xyXG4gICAgc3VwZXIoaWQsIDQsIFR5cGUuU3F1YXJlKTtcclxuICAgIHRoaXMuY2VudGVyID0gY2VudGVyUG9pbnQ7XHJcbiAgICB0aGlzLmFycmF5T2ZQb2ludHMgPSBbbnVsbCwgbnVsbCwgbnVsbCwgbnVsbF07XHJcbiAgICB0aGlzLnR4ID0gMDtcclxuICAgIHRoaXMudHkgPSAwO1xyXG4gICAgdGhpcy5kZWdyZWUgPSAwO1xyXG4gICAgdGhpcy5zeCA9IDE7XHJcbiAgICB0aGlzLnN5ID0gMTtcclxuICAgIHRoaXMua3ggPSAwO1xyXG4gICAgdGhpcy5reSA9IDA7XHJcbiAgfVxyXG5cclxuICAvLyBUcmFuc2Zvcm1hYmxlIE1ldGhvZHNcclxuICBwdWJsaWMgZ2V0Q2VudGVyKCk6IFBvaW50IHtcclxuICAgIHJldHVybiB0aGlzLmNlbnRlcjtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhZGRNYXRyaXgoXHJcbiAgICBnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LFxyXG4gICAgbWF0cml4TG9jYXRpb246IFdlYkdMVW5pZm9ybUxvY2F0aW9uXHJcbiAgKTogdm9pZCB7XHJcbiAgICBjb25zdCBtYXRyaXggPSBUcmFuc2Zvcm1hdGlvbi50cmFuc2Zvcm1hdGlvbk1hdHJpeChcclxuICAgICAgZ2wuY2FudmFzLndpZHRoLFxyXG4gICAgICBnbC5jYW52YXMuaGVpZ2h0LFxyXG4gICAgICB0aGlzLnR4LFxyXG4gICAgICB0aGlzLnR5LFxyXG4gICAgICB0aGlzLmRlZ3JlZSxcclxuICAgICAgdGhpcy5zeCxcclxuICAgICAgdGhpcy5zeSxcclxuICAgICAgdGhpcy5reCxcclxuICAgICAgdGhpcy5reSxcclxuICAgICAgdGhpcy5jZW50ZXJcclxuICAgICkuZmxhdHRlbigpO1xyXG5cclxuICAgIGdsLnVuaWZvcm1NYXRyaXgzZnYobWF0cml4TG9jYXRpb24sIGZhbHNlLCBtYXRyaXgpO1xyXG4gIH1cclxuXHJcbiAgLy8gUmVuZGVyYWJsZSBNZXRob2RzXHJcbiAgcHVibGljIGRyYXdNZXRob2QoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gZ2wuVFJJQU5HTEVfRkFOO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGlzRHJhd2FibGUoKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aCA9PT0gNDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBkcmF3KHAxOiBQb2ludCk6IHZvaWQge1xyXG4gICAgdGhpcy5hcnJheU9mUG9pbnRzWzBdID0gcDE7XHJcbiAgICBjb25zdCBbeENlbnRlciwgeUNlbnRlcl0gPSB0aGlzLmNlbnRlci5nZXRQYWlyKCk7XHJcblxyXG4gICAgdGhpcy5hcnJheU9mUG9pbnRzWzFdID0gVHJhbnNmb3JtYXRpb24udHJhbnNsYXRpb24oeENlbnRlciwgeUNlbnRlcilcclxuICAgICAgLm11bHRpcGx5TWF0cml4KFRyYW5zZm9ybWF0aW9uLnJvdGF0aW9uKDAuNSAqIE1hdGguUEkpKVxyXG4gICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24udHJhbnNsYXRpb24oLXhDZW50ZXIsIC15Q2VudGVyKSlcclxuICAgICAgLm11bHRpcGx5UG9pbnQodGhpcy5hcnJheU9mUG9pbnRzWzBdKTtcclxuXHJcbiAgICB0aGlzLmFycmF5T2ZQb2ludHNbMl0gPSBUcmFuc2Zvcm1hdGlvbi50cmFuc2xhdGlvbih4Q2VudGVyLCB5Q2VudGVyKVxyXG4gICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24ucm90YXRpb24oTWF0aC5QSSkpXHJcbiAgICAgIC5tdWx0aXBseU1hdHJpeChUcmFuc2Zvcm1hdGlvbi50cmFuc2xhdGlvbigteENlbnRlciwgLXlDZW50ZXIpKVxyXG4gICAgICAubXVsdGlwbHlQb2ludCh0aGlzLmFycmF5T2ZQb2ludHNbMF0pO1xyXG5cclxuICAgIHRoaXMuYXJyYXlPZlBvaW50c1szXSA9IFRyYW5zZm9ybWF0aW9uLnRyYW5zbGF0aW9uKHhDZW50ZXIsIHlDZW50ZXIpXHJcbiAgICAgIC5tdWx0aXBseU1hdHJpeChUcmFuc2Zvcm1hdGlvbi5yb3RhdGlvbigxLjUgKiBNYXRoLlBJKSlcclxuICAgICAgLm11bHRpcGx5TWF0cml4KFRyYW5zZm9ybWF0aW9uLnRyYW5zbGF0aW9uKC14Q2VudGVyLCAteUNlbnRlcikpXHJcbiAgICAgIC5tdWx0aXBseVBvaW50KHRoaXMuYXJyYXlPZlBvaW50c1swXSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgcmVEcmF3KHBvaW50OiBQb2ludCwgaW5mbzogU3RyaW5nKTogdm9pZCB7XHJcbiAgICBjb25zdCBbeENlbnRlciwgeUNlbnRlcl0gPSB0aGlzLmNlbnRlci5nZXRQYWlyKCk7XHJcbiAgICBjb25zdCB0ZW1wUG9pbnRBcnI6IFBvaW50W10gPSBbbnVsbCwgbnVsbCwgbnVsbCwgbnVsbF07XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDQ7IGkrKykge1xyXG4gICAgICB0ZW1wUG9pbnRBcnJbaV0gPSB0aGlzLmFycmF5T2ZQb2ludHNbaV07XHJcbiAgICB9XHJcbiAgICBzd2l0Y2ggKGluZm8pIHtcclxuICAgICAgY2FzZSBcInAxXCI6XHJcbiAgICAgICAgdGhpcy5hcnJheU9mUG9pbnRzWzBdID0gcG9pbnQ7XHJcblxyXG4gICAgICAgIHRoaXMuYXJyYXlPZlBvaW50c1sxXSA9IFRyYW5zZm9ybWF0aW9uLnRyYW5zbGF0aW9uKHhDZW50ZXIsIHlDZW50ZXIpXHJcbiAgICAgICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24ucm90YXRpb24oMC41ICogTWF0aC5QSSkpXHJcbiAgICAgICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24udHJhbnNsYXRpb24oLXhDZW50ZXIsIC15Q2VudGVyKSlcclxuICAgICAgICAgIC5tdWx0aXBseVBvaW50KHRoaXMuYXJyYXlPZlBvaW50c1swXSk7XHJcblxyXG4gICAgICAgIHRoaXMuYXJyYXlPZlBvaW50c1syXSA9IFRyYW5zZm9ybWF0aW9uLnRyYW5zbGF0aW9uKHhDZW50ZXIsIHlDZW50ZXIpXHJcbiAgICAgICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24ucm90YXRpb24oTWF0aC5QSSkpXHJcbiAgICAgICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24udHJhbnNsYXRpb24oLXhDZW50ZXIsIC15Q2VudGVyKSlcclxuICAgICAgICAgIC5tdWx0aXBseVBvaW50KHRoaXMuYXJyYXlPZlBvaW50c1swXSk7XHJcblxyXG4gICAgICAgIHRoaXMuYXJyYXlPZlBvaW50c1szXSA9IFRyYW5zZm9ybWF0aW9uLnRyYW5zbGF0aW9uKHhDZW50ZXIsIHlDZW50ZXIpXHJcbiAgICAgICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24ucm90YXRpb24oMS41ICogTWF0aC5QSSkpXHJcbiAgICAgICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24udHJhbnNsYXRpb24oLXhDZW50ZXIsIC15Q2VudGVyKSlcclxuICAgICAgICAgIC5tdWx0aXBseVBvaW50KHRoaXMuYXJyYXlPZlBvaW50c1swXSk7XHJcbiAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICBjYXNlIFwicDJcIjpcclxuICAgICAgICB0aGlzLmFycmF5T2ZQb2ludHNbMV0gPSBwb2ludDtcclxuXHJcbiAgICAgICAgdGhpcy5hcnJheU9mUG9pbnRzWzBdID0gVHJhbnNmb3JtYXRpb24udHJhbnNsYXRpb24oeENlbnRlciwgeUNlbnRlcilcclxuICAgICAgICAgIC5tdWx0aXBseU1hdHJpeChUcmFuc2Zvcm1hdGlvbi5yb3RhdGlvbigtKDAuNSAqIE1hdGguUEkpKSlcclxuICAgICAgICAgIC5tdWx0aXBseU1hdHJpeChUcmFuc2Zvcm1hdGlvbi50cmFuc2xhdGlvbigteENlbnRlciwgLXlDZW50ZXIpKVxyXG4gICAgICAgICAgLm11bHRpcGx5UG9pbnQodGhpcy5hcnJheU9mUG9pbnRzWzBdKTtcclxuXHJcbiAgICAgICAgdGhpcy5hcnJheU9mUG9pbnRzWzJdID0gVHJhbnNmb3JtYXRpb24udHJhbnNsYXRpb24oeENlbnRlciwgeUNlbnRlcilcclxuICAgICAgICAgIC5tdWx0aXBseU1hdHJpeChUcmFuc2Zvcm1hdGlvbi5yb3RhdGlvbigwLjUgKiBNYXRoLlBJKSlcclxuICAgICAgICAgIC5tdWx0aXBseU1hdHJpeChUcmFuc2Zvcm1hdGlvbi50cmFuc2xhdGlvbigteENlbnRlciwgLXlDZW50ZXIpKVxyXG4gICAgICAgICAgLm11bHRpcGx5UG9pbnQodGhpcy5hcnJheU9mUG9pbnRzWzBdKTtcclxuXHJcbiAgICAgICAgdGhpcy5hcnJheU9mUG9pbnRzWzNdID0gVHJhbnNmb3JtYXRpb24udHJhbnNsYXRpb24oeENlbnRlciwgeUNlbnRlcilcclxuICAgICAgICAgIC5tdWx0aXBseU1hdHJpeChUcmFuc2Zvcm1hdGlvbi5yb3RhdGlvbihNYXRoLlBJKSlcclxuICAgICAgICAgIC5tdWx0aXBseU1hdHJpeChUcmFuc2Zvcm1hdGlvbi50cmFuc2xhdGlvbigteENlbnRlciwgLXlDZW50ZXIpKVxyXG4gICAgICAgICAgLm11bHRpcGx5UG9pbnQodGhpcy5hcnJheU9mUG9pbnRzWzBdKTtcclxuICAgICAgICBicmVhaztcclxuXHJcbiAgICAgIGNhc2UgXCJwM1wiOlxyXG4gICAgICAgIHRoaXMuYXJyYXlPZlBvaW50c1syXSA9IHBvaW50O1xyXG5cclxuICAgICAgICB0aGlzLmFycmF5T2ZQb2ludHNbMF0gPSBUcmFuc2Zvcm1hdGlvbi50cmFuc2xhdGlvbih4Q2VudGVyLCB5Q2VudGVyKVxyXG4gICAgICAgICAgLm11bHRpcGx5TWF0cml4KFRyYW5zZm9ybWF0aW9uLnJvdGF0aW9uKC1NYXRoLlBJKSlcclxuICAgICAgICAgIC5tdWx0aXBseU1hdHJpeChUcmFuc2Zvcm1hdGlvbi50cmFuc2xhdGlvbigteENlbnRlciwgLXlDZW50ZXIpKVxyXG4gICAgICAgICAgLm11bHRpcGx5UG9pbnQodGhpcy5hcnJheU9mUG9pbnRzWzBdKTtcclxuXHJcbiAgICAgICAgdGhpcy5hcnJheU9mUG9pbnRzWzJdID0gVHJhbnNmb3JtYXRpb24udHJhbnNsYXRpb24oeENlbnRlciwgeUNlbnRlcilcclxuICAgICAgICAgIC5tdWx0aXBseU1hdHJpeChUcmFuc2Zvcm1hdGlvbi5yb3RhdGlvbigtKDAuNSAqIE1hdGguUEkpKSlcclxuICAgICAgICAgIC5tdWx0aXBseU1hdHJpeChUcmFuc2Zvcm1hdGlvbi50cmFuc2xhdGlvbigteENlbnRlciwgLXlDZW50ZXIpKVxyXG4gICAgICAgICAgLm11bHRpcGx5UG9pbnQodGhpcy5hcnJheU9mUG9pbnRzWzBdKTtcclxuXHJcbiAgICAgICAgdGhpcy5hcnJheU9mUG9pbnRzWzNdID0gVHJhbnNmb3JtYXRpb24udHJhbnNsYXRpb24oeENlbnRlciwgeUNlbnRlcilcclxuICAgICAgICAgIC5tdWx0aXBseU1hdHJpeChUcmFuc2Zvcm1hdGlvbi5yb3RhdGlvbigwLjUgKiBNYXRoLlBJKSlcclxuICAgICAgICAgIC5tdWx0aXBseU1hdHJpeChUcmFuc2Zvcm1hdGlvbi50cmFuc2xhdGlvbigteENlbnRlciwgLXlDZW50ZXIpKVxyXG4gICAgICAgICAgLm11bHRpcGx5UG9pbnQodGhpcy5hcnJheU9mUG9pbnRzWzBdKTtcclxuXHJcbiAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICBjYXNlIFwicDRcIjpcclxuICAgICAgICB0aGlzLmFycmF5T2ZQb2ludHNbM10gPSBwb2ludDtcclxuXHJcbiAgICAgICAgdGhpcy5hcnJheU9mUG9pbnRzWzBdID0gVHJhbnNmb3JtYXRpb24udHJhbnNsYXRpb24oeENlbnRlciwgeUNlbnRlcilcclxuICAgICAgICAgIC5tdWx0aXBseU1hdHJpeChUcmFuc2Zvcm1hdGlvbi5yb3RhdGlvbigtKDEuNSAqIE1hdGguUEkpKSlcclxuICAgICAgICAgIC5tdWx0aXBseU1hdHJpeChUcmFuc2Zvcm1hdGlvbi50cmFuc2xhdGlvbigteENlbnRlciwgLXlDZW50ZXIpKVxyXG4gICAgICAgICAgLm11bHRpcGx5UG9pbnQodGhpcy5hcnJheU9mUG9pbnRzWzBdKTtcclxuXHJcbiAgICAgICAgdGhpcy5hcnJheU9mUG9pbnRzWzJdID0gVHJhbnNmb3JtYXRpb24udHJhbnNsYXRpb24oeENlbnRlciwgeUNlbnRlcilcclxuICAgICAgICAgIC5tdWx0aXBseU1hdHJpeChUcmFuc2Zvcm1hdGlvbi5yb3RhdGlvbigtTWF0aC5QSSkpXHJcbiAgICAgICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24udHJhbnNsYXRpb24oLXhDZW50ZXIsIC15Q2VudGVyKSlcclxuICAgICAgICAgIC5tdWx0aXBseVBvaW50KHRoaXMuYXJyYXlPZlBvaW50c1swXSk7XHJcblxyXG4gICAgICAgIHRoaXMuYXJyYXlPZlBvaW50c1szXSA9IFRyYW5zZm9ybWF0aW9uLnRyYW5zbGF0aW9uKHhDZW50ZXIsIHlDZW50ZXIpXHJcbiAgICAgICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24ucm90YXRpb24oLSgwLjUgKiBNYXRoLlBJKSkpXHJcbiAgICAgICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24udHJhbnNsYXRpb24oLXhDZW50ZXIsIC15Q2VudGVyKSlcclxuICAgICAgICAgIC5tdWx0aXBseVBvaW50KHRoaXMuYXJyYXlPZlBvaW50c1swXSk7XHJcblxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA0OyBpKyspIHtcclxuICAgICAgdGhpcy5hcnJheU9mUG9pbnRzW2ldLnNldENvbG9yKHRlbXBQb2ludEFycltpXS5nZXRDb2xvcigpKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBnZXROdW1iZXJPZlZlcnRpY2VzVG9CZURyYXduKCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gNTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhZGRQb3NpdGlvbihnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0KTogdm9pZCB7XHJcbiAgICBnbC5idWZmZXJEYXRhKFxyXG4gICAgICBnbC5BUlJBWV9CVUZGRVIsXHJcbiAgICAgIG5ldyBGbG9hdDMyQXJyYXkoW1xyXG4gICAgICAgIC4uLnRoaXMuYXJyYXlPZlBvaW50c1swXS5nZXRQYWlyKCksXHJcbiAgICAgICAgLi4udGhpcy5hcnJheU9mUG9pbnRzWzFdLmdldFBhaXIoKSxcclxuICAgICAgICAuLi50aGlzLmFycmF5T2ZQb2ludHNbMl0uZ2V0UGFpcigpLFxyXG4gICAgICAgIC4uLnRoaXMuYXJyYXlPZlBvaW50c1szXS5nZXRQYWlyKCksXHJcbiAgICAgICAgLi4udGhpcy5hcnJheU9mUG9pbnRzWzBdLmdldFBhaXIoKSxcclxuICAgICAgXSksXHJcbiAgICAgIGdsLlNUQVRJQ19EUkFXXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGFkZENvbG9yKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQpOiB2b2lkIHtcclxuICAgIGdsLmJ1ZmZlckRhdGEoXHJcbiAgICAgIGdsLkFSUkFZX0JVRkZFUixcclxuICAgICAgbmV3IEZsb2F0MzJBcnJheShbXHJcbiAgICAgICAgLi4udGhpcy5hcnJheU9mUG9pbnRzWzBdLmdldENvbG9yKCksXHJcbiAgICAgICAgLi4udGhpcy5hcnJheU9mUG9pbnRzWzFdLmdldENvbG9yKCksXHJcbiAgICAgICAgLi4udGhpcy5hcnJheU9mUG9pbnRzWzJdLmdldENvbG9yKCksXHJcbiAgICAgICAgLi4udGhpcy5hcnJheU9mUG9pbnRzWzNdLmdldENvbG9yKCksXHJcbiAgICAgICAgLi4udGhpcy5hcnJheU9mUG9pbnRzWzBdLmdldENvbG9yKCksXHJcbiAgICAgIF0pLFxyXG4gICAgICBnbC5TVEFUSUNfRFJBV1xyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzZXRTcXVhcmVBdHRyaWJ1dGVzKFxyXG4gICAgdHg6IG51bWJlcixcclxuICAgIHR5OiBudW1iZXIsXHJcbiAgICBkZWdyZWU6IG51bWJlcixcclxuICAgIHN4OiBudW1iZXIsXHJcbiAgICBzeTogbnVtYmVyLFxyXG4gICAga3g6IG51bWJlcixcclxuICAgIGt5OiBudW1iZXIsXHJcbiAgICBhcnJheU9mUG9pbnRzOiBQb2ludFtdXHJcbiAgKTogdm9pZCB7XHJcbiAgICB0aGlzLmFycmF5T2ZQb2ludHMgPSBhcnJheU9mUG9pbnRzO1xyXG4gICAgdGhpcy50eCA9IHR4O1xyXG4gICAgdGhpcy50eSA9IHR5O1xyXG4gICAgdGhpcy5kZWdyZWUgPSBkZWdyZWU7XHJcbiAgICB0aGlzLnN4ID0gc3g7XHJcbiAgICB0aGlzLnN5ID0gc3k7XHJcbiAgICB0aGlzLmt4ID0ga3g7XHJcbiAgICB0aGlzLmt5ID0ga3k7XHJcbiAgICB0aGlzLmNlbnRlciA9IHRoaXMuZ2V0Q2VudGVyKCk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBTcXVhcmU7XHJcbiIsImVudW0gVHlwZSB7XHJcbiAgICBMaW5lLFxyXG4gICAgUmVjdGFuZ2xlLFxyXG4gICAgU3F1YXJlLFxyXG4gICAgUG9seWdvbixcclxuICAgIFVuaWdvblxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBUeXBlOyIsImltcG9ydCBUcmFuc2Zvcm1hdGlvbiBmcm9tIFwiT3BlcmF0aW9ucy9UcmFuc2Zvcm1hdGlvblwiO1xyXG5pbXBvcnQgUmVuZGVyYWJsZSBmcm9tIFwiSW50ZXJmYWNlcy9yZW5kZXJhYmxlLmludGVyZmFjZVwiO1xyXG5pbXBvcnQgVHJhbnNmb3JtYWJsZSBmcm9tIFwiSW50ZXJmYWNlcy90cmFuc2Zvcm1hYmxlLmludGVyZmFjZVwiO1xyXG5pbXBvcnQgU2hhcGUgZnJvbSBcIlNoYXBlcy9zaGFwZVwiO1xyXG5pbXBvcnQgVHlwZSBmcm9tIFwiU2hhcGVzL3R5cGUuZW51bVwiO1xyXG5pbXBvcnQgUG9pbnQgZnJvbSBcIkJhc2UvcG9pbnRcIjtcclxuaW1wb3J0IGNvbnZleEh1bGwgZnJvbSBcIk9wZXJhdGlvbnMvY29udmV4LWh1bGxcIjtcclxuaW1wb3J0IG9yaWVudGF0aW9uIGZyb20gXCJNYWluL09wZXJhdGlvbnMvb3JpZW50YXRpb25cIjtcclxuXHJcbmNsYXNzIFVuaWdvbiBleHRlbmRzIFNoYXBlIGltcGxlbWVudHMgUmVuZGVyYWJsZSwgVHJhbnNmb3JtYWJsZSB7XHJcbiAgICBwdWJsaWMgdHlwZTogVHlwZS5Vbmlnb247XHJcbiAgICBwdWJsaWMgYXJyYXlPZlBvaW50czogUG9pbnRbXTtcclxuXHJcbiAgICBwdWJsaWMgY2VudGVyOiBQb2ludDtcclxuICAgIHB1YmxpYyB0eDogbnVtYmVyO1xyXG4gICAgcHVibGljIHR5OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgZGVncmVlOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgc3g6IG51bWJlcjtcclxuICAgIHB1YmxpYyBzeTogbnVtYmVyO1xyXG4gICAgcHVibGljIGt4OiBudW1iZXI7XHJcbiAgICBwdWJsaWMga3k6IG51bWJlcjtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoaWQ6IG51bWJlciwgcG9pbnQ6IFBvaW50KSB7XHJcbiAgICAgICAgc3VwZXIoaWQsIDEsIFR5cGUuVW5pZ29uKTtcclxuICAgICAgICB0aGlzLmFycmF5T2ZQb2ludHMgPSBuZXcgQXJyYXkocG9pbnQpO1xyXG4gICAgICAgIHRoaXMudHggPSAwO1xyXG4gICAgICAgIHRoaXMudHkgPSAwO1xyXG4gICAgICAgIHRoaXMuZGVncmVlID0gMDtcclxuICAgICAgICB0aGlzLnN4ID0gMTtcclxuICAgICAgICB0aGlzLnN5ID0gMTtcclxuICAgICAgICB0aGlzLmt4ID0gMDtcclxuICAgICAgICB0aGlzLmt5ID0gMDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0Q2VudGVyKCk6IFBvaW50IHtcclxuICAgICAgICBsZXQgc3VtWCA9IDA7XHJcbiAgICAgICAgbGV0IHN1bVkgPSAwO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYXJyYXlPZlBvaW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBbeCwgeV0gPSB0aGlzLmFycmF5T2ZQb2ludHNbaV0uZ2V0UGFpcigpO1xyXG4gICAgICAgICAgICBzdW1YICs9IHg7XHJcbiAgICAgICAgICAgIHN1bVkgKz0geTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGNlbnRlclggPSBzdW1YIC8gdGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aDtcclxuICAgICAgICBjb25zdCBjZW50ZXJZID0gc3VtWSAvIHRoaXMuYXJyYXlPZlBvaW50cy5sZW5ndGg7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgUG9pbnQoW2NlbnRlclgsIGNlbnRlclldLCBbMCwgMCwgMCwgMF0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpc0RyYXdhYmxlKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoID49IDI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRyYXcgKHBvaW50OiBQb2ludCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuYXJyYXlPZlBvaW50c1t0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoXSA9IHBvaW50O1xyXG4gICAgICAgIHRoaXMuY2VudGVyID0gdGhpcy5nZXRDZW50ZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZHJhd01ldGhvZChnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0KTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aCA+PTMgPyBnbC5UUklBTkdMRV9GQU4gOiBnbC5MSU5FUztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0TnVtYmVyT2ZWZXJ0aWNlc1RvQmVEcmF3bigpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoIDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkUG9zaXRpb24oZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IHZlcnRpY2VzID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoICogMik7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IFt4LCB5XSA9IHRoaXMuYXJyYXlPZlBvaW50c1tpXS5nZXRQYWlyKCk7XHJcbiAgICAgICAgICAgIHZlcnRpY2VzW2kgKiAyXSA9IHg7XHJcbiAgICAgICAgICAgIHZlcnRpY2VzW2kgKiAyICsgMV0gPSB5O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgW3BJbml0aWFsWCwgcEluaXRpYWxZXSA9IHRoaXMuYXJyYXlPZlBvaW50c1swXS5nZXRQYWlyKCk7XHJcbiAgICAgICAgdmVydGljZXNbdGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aCAqIDJdID0gcEluaXRpYWxYO1xyXG4gICAgICAgIHZlcnRpY2VzW3RoaXMuYXJyYXlPZlBvaW50cy5sZW5ndGggKiAyICsgMV0gPSBwSW5pdGlhbFk7XHJcblxyXG4gICAgICAgIGdsLmJ1ZmZlckRhdGEoZ2wuQVJSQVlfQlVGRkVSLCB2ZXJ0aWNlcywgZ2wuU1RBVElDX0RSQVcpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRDb2xvcihnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0KTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgY29sb3JzID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoICogNCk7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IFtyLCBnLCBiLCBhXSA9IHRoaXMuYXJyYXlPZlBvaW50c1tpXS5nZXRDb2xvcigpO1xyXG4gICAgICAgICAgICBjb2xvcnNbaSAqIDRdID0gcjtcclxuICAgICAgICAgICAgY29sb3JzW2kgKiA0ICsgMV0gPSBnO1xyXG4gICAgICAgICAgICBjb2xvcnNbaSAqIDQgKyAyXSA9IGI7XHJcbiAgICAgICAgICAgIGNvbG9yc1tpICogNCArIDNdID0gYTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IFtySW5pdGlhbCwgZ0luaXRpYWwsIGJJbml0aWFsLCBhSW5pdGlhbF0gPSB0aGlzLmFycmF5T2ZQb2ludHNbMF0uZ2V0Q29sb3IoKTtcclxuICAgICAgICBjb2xvcnNbdGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aCAqIDRdID0gckluaXRpYWw7XHJcbiAgICAgICAgY29sb3JzW3RoaXMuYXJyYXlPZlBvaW50cy5sZW5ndGggKiA0ICsgMV0gPSBnSW5pdGlhbDtcclxuICAgICAgICBjb2xvcnNbdGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aCAqIDQgKyAyXSA9IGJJbml0aWFsO1xyXG4gICAgICAgIGNvbG9yc1t0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoICogNCArIDNdID0gYUluaXRpYWw7XHJcblxyXG4gICAgICAgIGdsLmJ1ZmZlckRhdGEoZ2wuQVJSQVlfQlVGRkVSLCBjb2xvcnMsIGdsLlNUQVRJQ19EUkFXKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBhZGRNYXRyaXgoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCwgbWF0cml4TG9jYXRpb246IFdlYkdMVW5pZm9ybUxvY2F0aW9uKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgbWF0cml4ID0gVHJhbnNmb3JtYXRpb24udHJhbnNmb3JtYXRpb25NYXRyaXgoXHJcbiAgICAgICAgICAgIGdsLmNhbnZhcy53aWR0aCxcclxuICAgICAgICAgICAgZ2wuY2FudmFzLmhlaWdodCxcclxuICAgICAgICAgICAgdGhpcy50eCxcclxuICAgICAgICAgICAgdGhpcy50eSxcclxuICAgICAgICAgICAgdGhpcy5kZWdyZWUsXHJcbiAgICAgICAgICAgIHRoaXMuc3gsXHJcbiAgICAgICAgICAgIHRoaXMuc3ksXHJcbiAgICAgICAgICAgIHRoaXMua3gsXHJcbiAgICAgICAgICAgIHRoaXMua3ksXHJcbiAgICAgICAgICAgIHRoaXMuY2VudGVyXHJcbiAgICAgICAgICApLmZsYXR0ZW4oKTtcclxuICAgICAgXHJcbiAgICAgICAgICBnbC51bmlmb3JtTWF0cml4M2Z2KG1hdHJpeExvY2F0aW9uLCBmYWxzZSwgbWF0cml4KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGVsZXRlUG9pbnQoaW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgIHZhciBuZXdQb2ludHM6IFBvaW50W10gPSBbdGhpcy5hcnJheU9mUG9pbnRzW2luZGV4XV07XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgIGlmIChpICE9IGluZGV4KSB7XHJcbiAgICAgICAgICAgIG5ld1BvaW50cy5wdXNoKHRoaXMuYXJyYXlPZlBvaW50c1tpXSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgXHJcbiAgICAgICAgdGhpcy5hcnJheU9mUG9pbnRzID0gbmV3UG9pbnRzLnNsaWNlKDEsIHRoaXMuYXJyYXlPZlBvaW50cy5sZW5ndGgpO1xyXG4gICAgXHJcbiAgICAgICAgLy8gYWZ0ZXIgZGVsZXRlLCBuZWVkIHRvIHNldHVwIG9wdGlvbiBhZ2FpblxyXG4gICAgICAgIGNvbnN0IHBvaW50UGlja2VyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwb2ludFBpY2tlclwiKTtcclxuICAgICAgICBwb2ludFBpY2tlci5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICAgIHBvaW50UGlja2VyLnJlcGxhY2VDaGlsZHJlbigpO1xyXG4gICAgICAgIC8qIEFsbCBQb2ludCAqL1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5hcnJheU9mUG9pbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICBjb25zdCBuZXdQb2ludCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XHJcbiAgICAgICAgICBuZXdQb2ludC52YWx1ZSA9IGkudG9TdHJpbmcoKTtcclxuICAgICAgICAgIG5ld1BvaW50LnRleHQgPSBcInBvaW50X1wiICsgaTtcclxuICAgICAgICAgIHBvaW50UGlja2VyLmFwcGVuZENoaWxkKG5ld1BvaW50KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldFVuaWdvbkF0dHJpYnV0ZXModHg6IG51bWJlciwgdHk6IG51bWJlciwgZGVncmVlOiBudW1iZXIsIHN4OiBudW1iZXIsIHN5OiBudW1iZXIsIGt4OiBudW1iZXIsIGt5OiBudW1iZXIsIGFycmF5T2ZQb2ludHM6IFBvaW50W10pOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmFycmF5T2ZQb2ludHMgPSBhcnJheU9mUG9pbnRzO1xyXG4gICAgICAgIHRoaXMudHggPSB0eDtcclxuICAgICAgICB0aGlzLnR5ID0gdHk7XHJcbiAgICAgICAgdGhpcy5kZWdyZWUgPSBkZWdyZWU7XHJcbiAgICAgICAgdGhpcy5zeCA9IHN4O1xyXG4gICAgICAgIHRoaXMuc3kgPSBzeTtcclxuICAgICAgICB0aGlzLmt4ID0ga3g7XHJcbiAgICAgICAgdGhpcy5reSA9IGt5O1xyXG4gICAgICAgIHRoaXMubnVtYmVyT2ZWZXJ0aWNlcyA9IGFycmF5T2ZQb2ludHMubGVuZ3RoO1xyXG4gICAgICAgIHRoaXMuY2VudGVyID0gdGhpcy5nZXRDZW50ZXIoKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8gcHVibGljIG9yaWVudExpc3RPZlBvaW50cygpIHtcclxuICAgIC8vICAgICBjb25zdCByZW9yZGVyZWRQb2ludHM6IFBvaW50W10gPSBbXTtcclxuICAgIC8vICAgICBjb25zdCBsZW5ndGggPSB0aGlzLmFycmF5T2ZQb2ludHMubGVuZ3RoO1xyXG4gICAgLy8gICAgIGlmIChsZW5ndGggPCAzKSB7XHJcbiAgICAvLyAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkF0IGxlYXN0IHRocmVlIHBvaW50cyBhcmUgcmVxdWlyZWQuXCIpO1xyXG4gICAgLy8gICAgIH1cclxuICAgIC8vICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aCAtIDI7IGkrKykge1xyXG4gICAgLy8gICAgICAgICBjb25zdCBvcmllbnRhdGlvblZhbHVlID0gb3JpZW50YXRpb24odGhpcy5hcnJheU9mUG9pbnRzW2ldLCB0aGlzLmFycmF5T2ZQb2ludHNbaSArIDFdLCB0aGlzLmFycmF5T2ZQb2ludHNbaSArIDJdKTtcclxuICAgIC8vICAgICAgICAgaWYgKG9yaWVudGF0aW9uVmFsdWUgIT09IDApIHsgLy8gSWdub3JlIGNvbGxpbmVhciBwb2ludHNcclxuICAgIC8vICAgICAgICAgICAgIGNvbnN0IHBvaW50c0luT3JkZXIgPSBvcmllbnRhdGlvblZhbHVlID09PSAxID8gW3RoaXMuYXJyYXlPZlBvaW50c1tpXSwgdGhpcy5hcnJheU9mUG9pbnRzW2kgKyAxXSwgdGhpcy5hcnJheU9mUG9pbnRzW2kgKyAyXV0gOiBbdGhpcy5hcnJheU9mUG9pbnRzW2ldLCB0aGlzLmFycmF5T2ZQb2ludHNbaSArIDJdLCB0aGlzLmFycmF5T2ZQb2ludHNbaSArIDFdXTtcclxuICAgIC8vICAgICAgICAgICAgIHJlb3JkZXJlZFBvaW50cy5wdXNoKC4uLnBvaW50c0luT3JkZXIpO1xyXG4gICAgLy8gICAgICAgICB9XHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy8gICAgIHRoaXMuYXJyYXlPZlBvaW50cyA9IHJlb3JkZXJlZFBvaW50czsgLy8gQXNzaWduIHRoZSByZW9yZGVyZWQgcG9pbnRzXHJcbiAgICAvLyB9XHJcblxyXG5cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVW5pZ29uOyIsImNsYXNzIENvb3JkaW5hdGUge1xyXG4gICAgcHVibGljIHg6IG51bWJlcjtcclxuICAgIHB1YmxpYyB5OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgdzogbnVtYmVyO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcih4OiBudW1iZXIsIHk6IG51bWJlciwgdzogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICB0aGlzLnkgPSB5O1xyXG4gICAgICAgIHRoaXMudyA9IHc7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldENvb3JkaW5hdGUoKTogW251bWJlciwgbnVtYmVyLCBudW1iZXJdIHtcclxuICAgICAgICByZXR1cm4gW3RoaXMueCwgdGhpcy55LCB0aGlzLnddO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRDb29yZGluYXRlKHg6IG51bWJlciwgeTogbnVtYmVyLCB3OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICAgICAgdGhpcy53ID0gdztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0WCh4OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRZKHk6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldFcodzogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy53ID0gdztcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIGdldFgoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy54O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRZKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMueTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0VygpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnc7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IENvb3JkaW5hdGU7IiwiaW1wb3J0IFBvaW50IGZyb20gJ0Jhc2UvcG9pbnQnO1xyXG5cclxuY2xhc3MgTWF0cml4IHtcclxuICAgIHB1YmxpYyBtMTogW251bWJlciwgbnVtYmVyLCBudW1iZXJdO1xyXG4gICAgcHVibGljIG0yOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl07XHJcbiAgICBwdWJsaWMgbTM6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXTtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IobTE6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSwgbTI6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSwgbTM6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSkge1xyXG4gICAgICAgIHRoaXMubTEgPSBtMTtcclxuICAgICAgICB0aGlzLm0yID0gbTI7XHJcbiAgICAgICAgdGhpcy5tMyA9IG0zO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBmbGF0dGVuKCkgOiBudW1iZXJbXSB7XHJcbiAgICAgICAgcmV0dXJuIFsuLi50aGlzLm0xLCAuLi50aGlzLm0yLCAuLi50aGlzLm0zXVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBtdWx0aXBseU1hdHJpeChvdGhlck1hdHJpeDogTWF0cml4KTogTWF0cml4IHtcclxuICAgICAgICBjb25zdCBbYTExLCBhMjEsIGEzMV0gPSBvdGhlck1hdHJpeC5tMTtcclxuICAgICAgICBjb25zdCBbYTEyLCBhMjIsIGEzMl0gPSBvdGhlck1hdHJpeC5tMjtcclxuICAgICAgICBjb25zdCBbYTEzLCBhMjMsIGEzM10gPSBvdGhlck1hdHJpeC5tMztcclxuXHJcbiAgICAgICAgY29uc3QgW2IxMSwgYjEyLCBiMTNdID0gdGhpcy5tMTtcclxuICAgICAgICBjb25zdCBbYjIxLCBiMjIsIGIyM10gPSB0aGlzLm0yO1xyXG4gICAgICAgIGNvbnN0IFtiMzEsIGIzMiwgYjMzXSA9IHRoaXMubTM7XHJcblxyXG4gICAgICAgIGNvbnN0IGMxMSA9IGIxMSAqIGExMSArIGIyMSAqIGEyMSArIGIzMSAqIGEzMVxyXG4gICAgICAgIGNvbnN0IGMxMiA9IGIxMSAqIGExMiArIGIyMSAqIGEyMiArIGIzMSAqIGEzMlxyXG4gICAgICAgIGNvbnN0IGMxMyA9IGIxMSAqIGExMyArIGIyMSAqIGEyMyArIGIzMSAqIGEzM1xyXG4gICAgICAgIGNvbnN0IGMyMSA9IGIxMiAqIGExMSArIGIyMiAqIGEyMSArIGIzMiAqIGEzMVxyXG4gICAgICAgIGNvbnN0IGMyMiA9IGIxMiAqIGExMiArIGIyMiAqIGEyMiArIGIzMiAqIGEzMlxyXG4gICAgICAgIGNvbnN0IGMyMyA9IGIxMiAqIGExMyArIGIyMiAqIGEyMyArIGIzMiAqIGEzM1xyXG4gICAgICAgIGNvbnN0IGMzMSA9IGIxMyAqIGExMSArIGIyMyAqIGEyMSArIGIzMyAqIGEzMVxyXG4gICAgICAgIGNvbnN0IGMzMiA9IGIxMyAqIGExMiArIGIyMyAqIGEyMiArIGIzMyAqIGEzMlxyXG4gICAgICAgIGNvbnN0IGMzMyA9IGIxMyAqIGExMyArIGIyMyAqIGEyMyArIGIzMyAqIGEzM1xyXG5cclxuICAgICAgICBjb25zdCBtYXRyaXggPSBuZXcgTWF0cml4KFtjMTEsIGMyMSwgYzMxXSwgW2MxMiwgYzIyLCBjMzJdLCBbYzEzLCBjMjMsIGMzM10pO1xyXG4gICAgICAgIHJldHVybiBtYXRyaXg7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHB1YmxpYyBtdWx0aXBseVBvaW50KHBvaW50OiBQb2ludCk6IFBvaW50IHtcclxuICAgICAgICBjb25zdCBbYTExLCBhMjEsIGEzMV0gPSB0aGlzLm0xO1xyXG4gICAgICAgIGNvbnN0IFthMTIsIGEyMiwgYTMyXSA9IHRoaXMubTI7XHJcbiAgICAgICAgY29uc3QgW2ExMywgYTIzLCBhMzNdID0gdGhpcy5tMztcclxuXHJcbiAgICAgICAgY29uc3QgeDEgPSBhMTEgKiBwb2ludC54ICsgYTEyICogcG9pbnQueSArIGExMyAqIHBvaW50Lnc7XHJcbiAgICAgICAgY29uc3QgeTEgPSBhMjEgKiBwb2ludC54ICsgYTIyICogcG9pbnQueSArIGEyMyAqIHBvaW50Lnc7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgbmV3UG9pbnQgPSBuZXcgUG9pbnQoW3gxLCB5MV0pO1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3UG9pbnQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IE1hdHJpeDsiLCJpbXBvcnQgQ29vcmRpbmF0ZSBmcm9tIFwiQmFzZS9jb29yZGluYXRlXCI7XHJcblxyXG5jbGFzcyBQb2ludCAgZXh0ZW5kcyBDb29yZGluYXRlIHtcclxuICAgIHB1YmxpYyByOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgZzogbnVtYmVyO1xyXG4gICAgcHVibGljIGI6IG51bWJlcjtcclxuICAgIHB1YmxpYyBhOiBudW1iZXI7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHBvc2l0aW9uOiBbbnVtYmVyLCBudW1iZXJdLCBjb2xvcjogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPSBbMCwgMCwgMCwgMV0pIHtcclxuICAgICAgICBzdXBlciguLi5wb3NpdGlvbiwgMSk7XHJcblxyXG4gICAgICAgIFt0aGlzLnIsIHRoaXMuZywgdGhpcy5iLCB0aGlzLmFdID0gY29sb3I7XHJcblxyXG4gICAgICAgIGNvbnN0IFtyLCBnLCBiLCBhXSA9IGNvbG9yO1xyXG4gICAgICAgIHRoaXMuciA9IHI7XHJcbiAgICAgICAgdGhpcy5nID0gZztcclxuICAgICAgICB0aGlzLmIgPSBiO1xyXG4gICAgICAgIHRoaXMuYSA9IGE7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFBhaXIoKTogW251bWJlciwgbnVtYmVyXSB7XHJcbiAgICAgICAgcmV0dXJuIFt0aGlzLngsIHRoaXMueV07XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldENvbG9yKCk6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdIHtcclxuICAgICAgICByZXR1cm4gW3RoaXMuciwgdGhpcy5nLCB0aGlzLmIsIHRoaXMuYV07XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldENvbG9yKGNvbG9yOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IFtyLCBnLCBiLCBhXSA9IGNvbG9yO1xyXG4gICAgICAgIHRoaXMuciA9IHI7XHJcbiAgICAgICAgdGhpcy5nID0gZztcclxuICAgICAgICB0aGlzLmIgPSBiO1xyXG4gICAgICAgIHRoaXMuYSA9IGE7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFBvaW50OyIsImltcG9ydCB7IGxvYWRTaGFkZXIgfSBmcm9tIFwiRnVuY3Rpb25zL2xvYWQtc2hhZGVyXCI7XHJcblxyXG4vL1xyXG4vLyBJbml0aWFsaXplIGEgc2hhZGVyIHByb2dyYW0sIHNvIFdlYkdMIGtub3dzIGhvdyB0byBkcmF3IG91ciBkYXRhXHJcbi8vXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTaGFkZXJQcm9ncmFtKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsIHZzU291cmNlOiBzdHJpbmcsIGZzU291cmNlOiBzdHJpbmcpIHtcclxuICAgIGNvbnN0IHZlcnRleFNoYWRlciA9IGxvYWRTaGFkZXIoZ2wsIGdsLlZFUlRFWF9TSEFERVIsIHZzU291cmNlKTtcclxuICAgIGNvbnN0IGZyYWdtZW50U2hhZGVyID0gbG9hZFNoYWRlcihnbCwgZ2wuRlJBR01FTlRfU0hBREVSLCBmc1NvdXJjZSk7XHJcbiAgXHJcbiAgICAvLyBDcmVhdGUgdGhlIHNoYWRlciBwcm9ncmFtXHJcbiAgICBjb25zdCBzaGFkZXJQcm9ncmFtID0gZ2wuY3JlYXRlUHJvZ3JhbSgpO1xyXG4gICAgZ2wuYXR0YWNoU2hhZGVyKHNoYWRlclByb2dyYW0sIHZlcnRleFNoYWRlcik7XHJcbiAgICBnbC5hdHRhY2hTaGFkZXIoc2hhZGVyUHJvZ3JhbSwgZnJhZ21lbnRTaGFkZXIpO1xyXG4gICAgZ2wubGlua1Byb2dyYW0oc2hhZGVyUHJvZ3JhbSk7XHJcbiAgXHJcbiAgICAvLyBJZiBjcmVhdGluZyB0aGUgc2hhZGVyIHByb2dyYW0gZmFpbGVkLCBhbGVydFxyXG4gIFxyXG4gICAgaWYgKCFnbC5nZXRQcm9ncmFtUGFyYW1ldGVyKHNoYWRlclByb2dyYW0sIGdsLkxJTktfU1RBVFVTKSkge1xyXG4gICAgICBhbGVydChcclxuICAgICAgICBgVW5hYmxlIHRvIGluaXRpYWxpemUgdGhlIHNoYWRlciBwcm9ncmFtOiAke2dsLmdldFByb2dyYW1JbmZvTG9nKFxyXG4gICAgICAgICAgc2hhZGVyUHJvZ3JhbSxcclxuICAgICAgICApfWAsXHJcbiAgICAgICk7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHNoYWRlclByb2dyYW07XHJcbiAgfSIsIiAgLy9cclxuICAvLyBjcmVhdGVzIGEgc2hhZGVyIG9mIHRoZSBnaXZlbiB0eXBlLCB1cGxvYWRzIHRoZSBzb3VyY2UgYW5kXHJcbiAgLy8gY29tcGlsZXMgaXQuXHJcbiAgLy9cclxuZXhwb3J0IGZ1bmN0aW9uIGxvYWRTaGFkZXIoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCwgdHlwZTogbnVtYmVyLCBzb3VyY2U6IHN0cmluZyk6IFdlYkdMU2hhZGVyIHtcclxuICAgIGNvbnN0IHNoYWRlciA9IGdsLmNyZWF0ZVNoYWRlcih0eXBlKTtcclxuICBcclxuICAgIC8vIFNlbmQgdGhlIHNvdXJjZSB0byB0aGUgc2hhZGVyIG9iamVjdFxyXG4gICAgZ2wuc2hhZGVyU291cmNlKHNoYWRlciwgc291cmNlKTtcclxuICBcclxuICAgIC8vIENvbXBpbGUgdGhlIHNoYWRlciBwcm9ncmFtXHJcbiAgICBnbC5jb21waWxlU2hhZGVyKHNoYWRlcik7XHJcbiAgXHJcbiAgICAvLyBTZWUgaWYgaXQgY29tcGlsZWQgc3VjY2Vzc2Z1bGx5XHJcbiAgICBpZiAoIWdsLmdldFNoYWRlclBhcmFtZXRlcihzaGFkZXIsIGdsLkNPTVBJTEVfU1RBVFVTKSkge1xyXG4gICAgICBhbGVydChgQW4gZXJyb3Igb2NjdXJyZWQgY29tcGlsaW5nIHRoZSBzaGFkZXJzOiAke2dsLmdldFNoYWRlckluZm9Mb2coc2hhZGVyKX1gLCk7XHJcbiAgICAgIGdsLmRlbGV0ZVNoYWRlcihzaGFkZXIpO1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIHJldHVybiBzaGFkZXI7XHJcbn0iLCJpbXBvcnQgeyByZW5kZXIgfSBmcm9tIFwiRnVuY3Rpb25zL3JlbmRlclwiO1xyXG5pbXBvcnQgUHJvZ3JhbUluZm8gZnJvbSBcIkZ1bmN0aW9ucy9wcm9ncmFtLWluZm8uaW50ZXJmYWNlXCI7XHJcbmltcG9ydCBSZW5kZXJhYmxlIGZyb20gXCJJbnRlcmZhY2VzL3JlbmRlcmFibGUuaW50ZXJmYWNlXCI7XHJcbmltcG9ydCBUcmFuc2Zvcm1hYmxlIGZyb20gXCJJbnRlcmZhY2VzL3RyYW5zZm9ybWFibGUuaW50ZXJmYWNlXCI7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyQWxsKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsIHByb2dyYW1JbmZvOiBQcm9ncmFtSW5mbywgc2hhcGVzOiAoUmVuZGVyYWJsZSZUcmFuc2Zvcm1hYmxlKVtdLCBwb3NpdGlvbkJ1ZmZlcjogV2ViR0xCdWZmZXIsIGNvbG9yQnVmZmVyOiBXZWJHTEJ1ZmZlcik6IHZvaWQge1xyXG4gICAgZ2wuY2xlYXIoZ2wuQ09MT1JfQlVGRkVSX0JJVCk7XHJcbiAgXHJcbiAgICBmb3IgKGNvbnN0IHNoYXBlIG9mIHNoYXBlcykge1xyXG4gICAgICByZW5kZXIoZ2wsIHByb2dyYW1JbmZvLCBzaGFwZSwgcG9zaXRpb25CdWZmZXIsIGNvbG9yQnVmZmVyKVxyXG4gICAgfVxyXG59OyIsImltcG9ydCBSZW5kZXJhYmxlIGZyb20gXCJJbnRlcmZhY2VzL3JlbmRlcmFibGUuaW50ZXJmYWNlXCI7XHJcbmltcG9ydCBQcm9ncmFtSW5mbyBmcm9tIFwiRnVuY3Rpb25zL3Byb2dyYW0taW5mby5pbnRlcmZhY2VcIjtcclxuaW1wb3J0IFRyYW5zZm9ybWFibGUgZnJvbSBcIkludGVyZmFjZXMvdHJhbnNmb3JtYWJsZS5pbnRlcmZhY2VcIjtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZW5kZXIoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCwgcHJvZ3JhbUluZm86IFByb2dyYW1JbmZvLCBvYmplY3Q6IFJlbmRlcmFibGUgJiBUcmFuc2Zvcm1hYmxlLCBwb3NpdGlvbkJ1ZmZlcjogV2ViR0xCdWZmZXIsIGNvbG9yQnVmZmVyOiBXZWJHTEJ1ZmZlcik6IHZvaWQge1xyXG4gICAgaWYgKCFvYmplY3QuaXNEcmF3YWJsZSgpKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIC8vIEFkZCBQb3NpdGlvbiB0byBnbCBidWZmZXJcclxuICAgIGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KHByb2dyYW1JbmZvLmF0dHJpYkxvY2F0aW9ucy52ZXJ0ZXhQb3NpdGlvbik7XHJcbiAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgcG9zaXRpb25CdWZmZXIpO1xyXG4gICAgb2JqZWN0LmFkZFBvc2l0aW9uKGdsKTtcclxuICAgIGNvbnN0IG51bUNvbXBvbmVudHMgPSAyOyAvLyBwdWxsIG91dCAyIHZhbHVlcyBwZXIgaXRlcmF0aW9uXHJcbiAgICBjb25zdCB0eXBlID0gZ2wuRkxPQVQ7IC8vIHRoZSBkYXRhIGluIHRoZSBidWZmZXIgaXMgMzJiaXQgZmxvYXRzXHJcbiAgICBjb25zdCBub3JtYWxpemUgPSBmYWxzZTsgLy8gZG9uJ3Qgbm9ybWFsaXplXHJcbiAgICBjb25zdCBzdHJpZGUgPSAwOyAvLyBob3cgbWFueSBieXRlcyB0byBnZXQgZnJvbSBvbmUgc2V0IG9mIHZhbHVlcyB0byB0aGUgbmV4dFxyXG4gICAgLy8gMCA9IHVzZSB0eXBlIGFuZCBudW1Db21wb25lbnRzIGFib3ZlXHJcbiAgICBjb25zdCBvZmZzZXQgPSAwOyAvLyBob3cgbWFueSBieXRlcyBpbnNpZGUgdGhlIGJ1ZmZlciB0byBzdGFydCBmcm9tXHJcbiAgICBnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKFxyXG4gICAgICBwcm9ncmFtSW5mby5hdHRyaWJMb2NhdGlvbnMudmVydGV4UG9zaXRpb24sXHJcbiAgICAgIG51bUNvbXBvbmVudHMsXHJcbiAgICAgIHR5cGUsXHJcbiAgICAgIG5vcm1hbGl6ZSxcclxuICAgICAgc3RyaWRlLFxyXG4gICAgICBvZmZzZXQsXHJcbiAgICApO1xyXG5cclxuICAgIFxyXG4gICAgZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkocHJvZ3JhbUluZm8uYXR0cmliTG9jYXRpb25zLnZlcnRleENvbG9yKTtcclxuICAgIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBjb2xvckJ1ZmZlcik7XHJcbiAgICBvYmplY3QuYWRkQ29sb3IoZ2wpO1xyXG4gICAgY29uc3QgY29sb3JTaXplID0gNDsgLyogNCBjb21wb25lbnRzIHBlciBpdGVyYXRpb24gKi9cclxuICAgIGNvbnN0IGNvbG9yVHlwZSA9IGdsLkZMT0FUOyAvKiBUaGUgZGF0YSBpcyAzMiBiaXQgZmxvYXQgKi9cclxuICAgIGNvbnN0IGNvbG9yTm9ybWFsaXplZCA9IGZhbHNlOyAvKiBEb24ndCBub3JtYWxpemUgdGhlIGRhdGEgKi9cclxuICAgIGNvbnN0IGNvbG9yU3RyaWRlID0gMDsgLyogMDogTW92ZSBmb3J3YXJkIHNpemUgKiBzaXplb2YodHlwZSkgZWFjaCBpdGVyYXRpb24gdG8gZ2V0IHRoZSBuZXh0IHBvc2l0aW9uICovXHJcbiAgICBjb25zdCBjb2xvck9mZnNldCA9IDA7IC8qIFN0YXJ0IGF0IHRoZSBiZWdpbm5pbmcgb2YgdGhlIGJ1ZmZlciAqL1xyXG4gICAgZ2wudmVydGV4QXR0cmliUG9pbnRlcihcclxuICAgICAgcHJvZ3JhbUluZm8uYXR0cmliTG9jYXRpb25zLnZlcnRleENvbG9yLFxyXG4gICAgICBjb2xvclNpemUsXHJcbiAgICAgIGNvbG9yVHlwZSxcclxuICAgICAgY29sb3JOb3JtYWxpemVkLFxyXG4gICAgICBjb2xvclN0cmlkZSxcclxuICAgICAgY29sb3JPZmZzZXRcclxuICAgICk7XHJcbiAgICBcclxuICAgIFxyXG4gICAgLy8gQWRkIE1hdHJpeCB0byBnbFxyXG4gICAgY29uc3QgbWF0cml4TG9jYXRpb24gPSBwcm9ncmFtSW5mby51bmlmb3JtTG9jYXRpb25zLm1hdHJpeExvY2F0aW9uXHJcbiAgICBvYmplY3QuYWRkTWF0cml4KGdsLCBtYXRyaXhMb2NhdGlvbik7XHJcbiAgICAvKiBEcmF3IHNjZW5lICovXHJcbiAgICBjb25zdCBwcmltaXRpdmVUeXBlID0gb2JqZWN0LmRyYXdNZXRob2QoZ2wpO1xyXG4gICAgLy8gY29uc3Qgb2Zmc2V0ID0gMDtcclxuICAgIGNvbnN0IG51bWJlck9mVmVydGljZXNUb0JlRHJhd24gPSBvYmplY3QuZ2V0TnVtYmVyT2ZWZXJ0aWNlc1RvQmVEcmF3bigpO1xyXG4gICAgZ2wuZHJhd0FycmF5cyhwcmltaXRpdmVUeXBlLCBvZmZzZXQsIG51bWJlck9mVmVydGljZXNUb0JlRHJhd24pO1xyXG59IiwiaW1wb3J0IE1hdHJpeCBmcm9tIFwiQmFzZS9tYXRyaXhcIjtcclxuaW1wb3J0IFBvaW50IGZyb20gXCJCYXNlL3BvaW50XCI7XHJcblxyXG5cclxuY2xhc3MgVHJhbnNmb3JtYXRpb257XHJcbiAgICBwdWJsaWMgc3RhdGljIHByb2plY3Rpb24od2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpOiBNYXRyaXgge1xyXG4gICAgICAgIGNvbnN0IG1hdHJpeCA9IG5ldyBNYXRyaXgoWzIvd2lkdGgsIDAsIDBdLCBbMCwgLTIvaGVpZ2h0LCAwXSwgWy0xLCAxLCAxXSk7XHJcbiAgICAgICAgcmV0dXJuIG1hdHJpeDtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzdGF0aWMgdHJhbnNsYXRpb24odHg6IG51bWJlciwgdHk6IG51bWJlcik6IE1hdHJpeCB7XHJcbiAgICAgICAgY29uc3QgbWF0cml4ID0gbmV3IE1hdHJpeChbMSwwLDBdLCBbMCwgMSwgMF0sIFt0eCwgdHksIDFdKTtcclxuICAgICAgICByZXR1cm4gbWF0cml4O1xyXG4gICAgfVxyXG4gICAgcHVibGljIHN0YXRpYyByb3RhdGlvbihkZWdyZWU6IG51bWJlcik6IE1hdHJpeCB7XHJcbiAgICAgICAgY29uc3QgbWF0cml4ID0gbmV3IE1hdHJpeChbTWF0aC5jb3MoZGVncmVlKSwgTWF0aC5zaW4oZGVncmVlKSwgMF0sIFstTWF0aC5zaW4oZGVncmVlKSwgTWF0aC5jb3MoZGVncmVlKSwgMF0sIFswLCAwLCAxXSk7XHJcbiAgICAgICAgcmV0dXJuIG1hdHJpeDtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzdGF0aWMgc2NhbGUoc3g6IG51bWJlciwgc3k6IG51bWJlcik6IE1hdHJpeCB7XHJcbiAgICAgICAgY29uc3QgbWF0cml4ID0gbmV3IE1hdHJpeChbc3gsMCwwXSwgWzAsIHN5LCAwXSwgWzAsIDAsIDFdKTtcclxuICAgICAgICByZXR1cm4gbWF0cml4XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc3RhdGljIHNoZWFyWChreDogbnVtYmVyKTogTWF0cml4IHtcclxuICAgICAgICBjb25zdCBtYXRyaXggPSBuZXcgTWF0cml4KFsxLCAwLCAwXSwgW2t4LCAxLCAwXSwgWzAsIDAsIDFdKTtcclxuICAgICAgICByZXR1cm4gbWF0cml4O1xyXG4gICAgfVxyXG4gICAgcHVibGljIHN0YXRpYyBzaGVhclkoa3k6IG51bWJlcik6IE1hdHJpeCB7XHJcbiAgICAgICAgY29uc3QgbWF0cml4ID0gbmV3IE1hdHJpeChbMSwga3ksIDBdLCBbMCwgMSwgMF0sIFswLCAwLCAxXSk7XHJcbiAgICAgICAgcmV0dXJuIG1hdHJpeDtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzdGF0aWMgdHJhbnNmb3JtYXRpb25NYXRyaXgoXHJcbiAgICAgICAgd2lkdGg6IG51bWJlcixcclxuICAgICAgICBoZWlnaHQ6IG51bWJlcixcclxuICAgICAgICB0eDogbnVtYmVyLFxyXG4gICAgICAgIHR5OiBudW1iZXIsXHJcbiAgICAgICAgZGVncmVlOiBudW1iZXIsXHJcbiAgICAgICAgc3g6IG51bWJlcixcclxuICAgICAgICBzeTogbnVtYmVyLFxyXG4gICAgICAgIGt4OiBudW1iZXIsXHJcbiAgICAgICAga3k6IG51bWJlcixcclxuICAgICAgICBjZW50ZXI6IFBvaW50XHJcbiAgICApIDogTWF0cml4IHtcclxuICAgICAgICByZXR1cm4gVHJhbnNmb3JtYXRpb24ucHJvamVjdGlvbih3aWR0aCwgaGVpZ2h0KVxyXG4gICAgICAgIC5tdWx0aXBseU1hdHJpeChUcmFuc2Zvcm1hdGlvbi50cmFuc2xhdGlvbih0eCwgdHkpKVxyXG4gICAgICAgIC5tdWx0aXBseU1hdHJpeChUcmFuc2Zvcm1hdGlvbi50cmFuc2xhdGlvbihjZW50ZXIuZ2V0WCgpLCBjZW50ZXIuZ2V0WSgpKSlcclxuICAgICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24ucm90YXRpb24oZGVncmVlKSlcclxuICAgICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24uc2NhbGUoc3gsIHN5KSlcclxuICAgICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24uc2hlYXJYKGt4KSlcclxuICAgICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24uc2hlYXJZKGt5KSlcclxuICAgICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24udHJhbnNsYXRpb24oLWNlbnRlci5nZXRYKCksIC1jZW50ZXIuZ2V0WSgpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyB0cmFuc2Zvcm1hdGlvbk1hdHJpeFdpdGhvdXRQcm9qZWN0aW9uKFxyXG4gICAgICAgIHdpZHRoOiBudW1iZXIsXHJcbiAgICAgICAgaGVpZ2h0OiBudW1iZXIsXHJcbiAgICAgICAgdHg6IG51bWJlcixcclxuICAgICAgICB0eTogbnVtYmVyLFxyXG4gICAgICAgIGRlZ3JlZTogbnVtYmVyLFxyXG4gICAgICAgIHN4OiBudW1iZXIsXHJcbiAgICAgICAgc3k6IG51bWJlcixcclxuICAgICAgICBreDogbnVtYmVyLFxyXG4gICAgICAgIGt5OiBudW1iZXIsXHJcbiAgICAgICAgY2VudGVyOiBQb2ludFxyXG4gICAgKSA6IE1hdHJpeCB7XHJcbiAgICAgICAgcmV0dXJuIChUcmFuc2Zvcm1hdGlvbi50cmFuc2xhdGlvbih0eCwgdHkpKVxyXG4gICAgICAgIC5tdWx0aXBseU1hdHJpeChUcmFuc2Zvcm1hdGlvbi50cmFuc2xhdGlvbihjZW50ZXIuZ2V0WCgpLCBjZW50ZXIuZ2V0WSgpKSlcclxuICAgICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24ucm90YXRpb24oZGVncmVlKSlcclxuICAgICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24uc2NhbGUoc3gsIHN5KSlcclxuICAgICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24uc2hlYXJYKGt4KSlcclxuICAgICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24uc2hlYXJZKGt5KSlcclxuICAgICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24udHJhbnNsYXRpb24oLWNlbnRlci5nZXRYKCksIC1jZW50ZXIuZ2V0WSgpKSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc3RhdGljIGludmVyc2VUcmFuc2Zvcm1hdGlvbk1hdHJpeChcclxuICAgICAgICB3aWR0aDogbnVtYmVyLFxyXG4gICAgICAgIGhlaWdodDogbnVtYmVyLFxyXG4gICAgICAgIHR4OiBudW1iZXIsXHJcbiAgICAgICAgdHk6IG51bWJlcixcclxuICAgICAgICBkZWdyZWU6IG51bWJlcixcclxuICAgICAgICBzeDogbnVtYmVyLFxyXG4gICAgICAgIHN5OiBudW1iZXIsXHJcbiAgICAgICAga3g6IG51bWJlcixcclxuICAgICAgICBreTogbnVtYmVyLFxyXG4gICAgICAgIGNlbnRlcjogUG9pbnRcclxuICAgICkgOiBNYXRyaXgge1xyXG4gICAgICAgIHJldHVybiBUcmFuc2Zvcm1hdGlvbi50cmFuc2xhdGlvbihjZW50ZXIuZ2V0WCgpLCBjZW50ZXIuZ2V0WSgpKVxyXG4gICAgICAgIC5tdWx0aXBseU1hdHJpeChUcmFuc2Zvcm1hdGlvbi5zaGVhclkoLWt5KSlcclxuICAgICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24uc2hlYXJYKC1reCkpXHJcbiAgICAgICAgLm11bHRpcGx5TWF0cml4KFRyYW5zZm9ybWF0aW9uLnNjYWxlKDEgLyBzeCwgMSAvIHN5KSlcclxuICAgICAgICAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24ucm90YXRpb24oLWRlZ3JlZSkpXHJcbiAgICAgICAgLm11bHRpcGx5TWF0cml4KFRyYW5zZm9ybWF0aW9uLnRyYW5zbGF0aW9uKC1jZW50ZXIuZ2V0WCgpLCAtY2VudGVyLmdldFkoKSkpXHJcbiAgICAgICAgLm11bHRpcGx5TWF0cml4KFRyYW5zZm9ybWF0aW9uLnRyYW5zbGF0aW9uKC10eCwgLXR5KSlcclxuICAgICAgICAvLyAubXVsdGlwbHlNYXRyaXgoVHJhbnNmb3JtYXRpb24ucHJvamVjdGlvbigxIC8gd2lkdGgsIDEgLyBoZWlnaHQpKTtcclxuICAgIH1cclxuXHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgVHJhbnNmb3JtYXRpb247IiwiaW1wb3J0IFBvaW50IGZyb20gXCJCYXNlL3BvaW50XCJcclxuaW1wb3J0IG9yaWVudGF0aW9uIGZyb20gXCIuL29yaWVudGF0aW9uXCI7XHJcblxyXG5mdW5jdGlvbiBjb252ZXhIdWxsKHBvaW50czogUG9pbnRbXSk6IFBvaW50W10ge1xyXG4gICAgY29uc3QgbiA9IHBvaW50cy5sZW5ndGg7XHJcbiAgICBpZiAobiA8IDMpIHJldHVybiBbXTtcclxuXHJcbiAgICBjb25zdCBodWxsOiBQb2ludFtdID0gW107XHJcbiAgICBsZXQgbCA9IDA7XHJcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IG47IGkrKykge1xyXG4gICAgICAgIGlmIChwb2ludHNbaV0ueCA8IHBvaW50c1tsXS54KSB7XHJcbiAgICAgICAgICAgIGwgPSBpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBsZXQgcCA9IGw7XHJcbiAgICBsZXQgcTogbnVtYmVyO1xyXG4gICAgZG8ge1xyXG4gICAgICAgIGh1bGwucHVzaChwb2ludHNbcF0pO1xyXG4gICAgICAgIHEgPSAocCArIDEpICUgbjtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICBpZiAob3JpZW50YXRpb24ocG9pbnRzW3BdLCBwb2ludHNbaV0sIHBvaW50c1txXSkgPT09IDIpIHtcclxuICAgICAgICAgICAgICAgIHEgPSBpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHAgPSBxO1xyXG4gICAgfSB3aGlsZSAocCAhPT0gbCk7XHJcblxyXG4gICAgcmV0dXJuIGh1bGw7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNvbnZleEh1bGw7XHJcblxyXG4iLCJpbXBvcnQgUG9pbnQgZnJvbSBcIkJhc2UvcG9pbnRcIlxyXG5cclxuZnVuY3Rpb24gb3JpZW50YXRpb24ocDogUG9pbnQsIHE6IFBvaW50LCByOiBQb2ludCk6IG51bWJlciB7XHJcbiAgICBjb25zdCB2YWwgPSAocS55IC0gcC55KSAqIChyLnggLSBxLngpIC0gKHEueCAtIHAueCkgKiAoci55IC0gcS55KTtcclxuXHJcbiAgICBpZiAodmFsID09PSAwKSByZXR1cm4gMDtcclxuXHJcbiAgICByZXR1cm4gdmFsID4gMCA/IDEgOiAyO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBvcmllbnRhdGlvbjsiLCJmdW5jdGlvbiByZ2JUb0hleChyZ2JhIDogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0pIHtcclxuICAgIGNvbnN0IGhleFIgPSAocmdiYVswXSAqIDI1NSkudG9TdHJpbmcoMTYpLnBhZFN0YXJ0KDIsICcwJyk7XHJcbiAgICBjb25zdCBoZXhHID0gKHJnYmFbMV0gKiAyNTUpLnRvU3RyaW5nKDE2KS5wYWRTdGFydCgyLCAnMCcpO1xyXG4gICAgY29uc3QgaGV4QiA9IChyZ2JhWzJdICogMjU1KS50b1N0cmluZygxNikucGFkU3RhcnQoMiwgJzAnKTtcclxuXHJcbiAgICAvLyBDb25jYXRlbmF0ZSB0aGUgaGV4YWRlY2ltYWwgY29tcG9uZW50c1xyXG4gICAgY29uc3QgaGV4Q29sb3IgPSBgIyR7aGV4Un0ke2hleEd9JHtoZXhCfWA7XHJcblxyXG4gICAgcmV0dXJuIGhleENvbG9yO1xyXG59XHJcbiAgXHJcbmZ1bmN0aW9uIGhleFRvUmdiKGhleDogc3RyaW5nKTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0ge1xyXG4gICAgY29uc3QgciA9IHBhcnNlSW50KGhleC5zbGljZSgxLCAzKSwgMTYpO1xyXG4gICAgY29uc3QgZyA9IHBhcnNlSW50KGhleC5zbGljZSgzLCA1KSwgMTYpO1xyXG4gICAgY29uc3QgYiA9IHBhcnNlSW50KGhleC5zbGljZSg1LCA3KSwgMTYpO1xyXG4gIFxyXG4gICAgcmV0dXJuIFtyIC8gMjU1LCBnIC8gMjU1LCBiIC8gMjU1LCAxXTtcclxufVxyXG4gIFxyXG5leHBvcnQgeyByZ2JUb0hleCwgaGV4VG9SZ2IgfTtcclxuICAiLCJpbXBvcnQgUmVuZGVyYWJsZSBmcm9tIFwiSW50ZXJmYWNlcy9yZW5kZXJhYmxlLmludGVyZmFjZVwiO1xyXG5pbXBvcnQgVHJhbnNmb3JtYWJsZSBmcm9tIFwiSW50ZXJmYWNlcy90cmFuc2Zvcm1hYmxlLmludGVyZmFjZVwiO1xyXG5pbXBvcnQgU2hhcGUgZnJvbSBcIlNoYXBlcy9zaGFwZVwiO1xyXG5pbXBvcnQgTGluZSBmcm9tIFwiU2hhcGVzL2xpbmVcIjtcclxuaW1wb3J0IFNxdWFyZSBmcm9tIFwiU2hhcGVzL3NxdWFyZVwiO1xyXG5pbXBvcnQgUmVjdGFuZ2xlIGZyb20gXCJTaGFwZXMvcmVjdGFuZ2xlXCI7XHJcbmltcG9ydCBQb2ludCBmcm9tIFwiQmFzZS9wb2ludFwiO1xyXG5pbXBvcnQgUG9seWdvbiBmcm9tIFwiU2hhcGVzL3BvbHlnb25cIjtcclxuaW1wb3J0IFVuaWdvbiBmcm9tIFwiU2hhcGVzL3VuaWdvblwiO1xyXG5pbXBvcnQgVHlwZSBmcm9tIFwiU2hhcGVzL3R5cGUuZW51bVwiO1xyXG5pbXBvcnQgeyBjcmVhdGVTaGFkZXJQcm9ncmFtIH0gZnJvbSBcIkZ1bmN0aW9ucy9jcmVhdGUtc2hhZGVyLXByb2dyYW1cIjtcclxuaW1wb3J0IFByb2dyYW1JbmZvIGZyb20gXCJGdW5jdGlvbnMvcHJvZ3JhbS1pbmZvLmludGVyZmFjZVwiO1xyXG5pbXBvcnQgeyBzZXRBdHRyaWJ1dGVzIH0gZnJvbSBcIi4vRnVuY3Rpb25zL3NldC1hdHRyaWJ1dGVzXCI7XHJcbmltcG9ydCB7IHNldHVwQ2FudmFzIH0gZnJvbSBcIi4vRnVuY3Rpb25zL3NldHVwLWNhbnZhc1wiO1xyXG5pbXBvcnQgVHJhbnNmb3JtYXRpb24gZnJvbSBcIk9wZXJhdGlvbnMvVHJhbnNmb3JtYXRpb25cIjtcclxuaW1wb3J0IHsgaGV4VG9SZ2IsIHJnYlRvSGV4IH0gZnJvbSBcIlV0aWxzL3Rvb2xzXCI7XHJcbmltcG9ydCB7IHJlbmRlciB9IGZyb20gXCJGdW5jdGlvbnMvcmVuZGVyXCI7XHJcbmltcG9ydCB7IHJlbmRlckFsbCB9IGZyb20gXCJGdW5jdGlvbnMvcmVuZGVyLWFsbFwiO1xyXG5cclxuY29uc3QgY2FudmFzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjYW52YXNcIikgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XHJcbi8vIEluaXRpYWxpemUgdGhlIEdMIGNvbnRleHRcclxuY29uc3QgZ2wgPSBjYW52YXMuZ2V0Q29udGV4dChcIndlYmdsXCIpO1xyXG5cclxuLy8gT25seSBjb250aW51ZSBpZiBXZWJHTCBpcyBhdmFpbGFibGUgYW5kIHdvcmtpbmdcclxuaWYgKGdsID09PSBudWxsKSB7XHJcbiAgYWxlcnQoXHJcbiAgICBcIlVuYWJsZSB0byBpbml0aWFsaXplIFdlYkdMLiBZb3VyIGJyb3dzZXIgb3IgbWFjaGluZSBtYXkgbm90IHN1cHBvcnQgaXQuXCJcclxuICApO1xyXG59XHJcblxyXG4vLyBWZXJ0ZXggc2hhZGVyIHByb2dyYW1cclxuY29uc3QgdnNTb3VyY2UgPSBgXHJcbiAgICBhdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247XHJcbiAgICBhdHRyaWJ1dGUgdmVjNCBhVmVydGV4Q29sb3I7XHJcbiAgICB1bmlmb3JtIG1hdDMgdU1hdHJpeDtcclxuICAgIHZhcnlpbmcgdmVjNCB2Q29sb3I7XHJcblxyXG4gICAgdm9pZCBtYWluKCkge1xyXG4gICAgICAgIC8vIG5vdGU6IFkgYXhpcyBtdXN0IGJlIGludmVydGVkIHRvIHJlcGxpY2F0ZSB0cmFkaXRpb25hbCB2aWV3XHJcbiAgICAgICAgZ2xfUG9zaXRpb24gPSB2ZWM0KCh1TWF0cml4ICogdmVjMyhhVmVydGV4UG9zaXRpb24sIDEpKS54eSwgMCwgMSk7XHJcblxyXG4gICAgICAgIC8vIENoYW5nZSBjb2xvciBvZiBzaGFwZVxyXG4gICAgICAgIHZDb2xvciA9IGFWZXJ0ZXhDb2xvcjtcclxuICAgIH1cclxuYDtcclxuXHJcbmNvbnN0IGZzU291cmNlID0gYFxyXG4gICAgcHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XHJcbiAgICB2YXJ5aW5nIHZlYzQgdkNvbG9yO1xyXG5cclxuICAgIHZvaWQgbWFpbigpIHtcclxuICAgICAgICBnbF9GcmFnQ29sb3IgPSB2Q29sb3I7XHJcbiAgICB9XHJcbmA7XHJcbmNvbnN0IHNoYWRlclByb2dyYW0gPSBjcmVhdGVTaGFkZXJQcm9ncmFtKGdsLCB2c1NvdXJjZSwgZnNTb3VyY2UpO1xyXG5cclxuLy8gQ29sbGVjdCBhbGwgdGhlIGluZm8gbmVlZGVkIHRvIHVzZSB0aGUgc2hhZGVyIHByb2dyYW0uXHJcbi8vIExvb2sgdXAgd2hpY2ggYXR0cmlidXRlIG91ciBzaGFkZXIgcHJvZ3JhbSBpcyB1c2luZ1xyXG4vLyBmb3IgYVZlcnRleFBvc2l0aW9uIGFuZCBsb29rIHVwIHVuaWZvcm0gbG9jYXRpb25zLlxyXG5jb25zdCBwcm9ncmFtSW5mbyA9IHtcclxuICBwcm9ncmFtOiBzaGFkZXJQcm9ncmFtLFxyXG4gIGF0dHJpYkxvY2F0aW9uczoge1xyXG4gICAgdmVydGV4UG9zaXRpb246IGdsLmdldEF0dHJpYkxvY2F0aW9uKHNoYWRlclByb2dyYW0sIFwiYVZlcnRleFBvc2l0aW9uXCIpLFxyXG4gICAgdmVydGV4Q29sb3I6IGdsLmdldEF0dHJpYkxvY2F0aW9uKHNoYWRlclByb2dyYW0sIFwiYVZlcnRleENvbG9yXCIpLFxyXG4gIH0sXHJcbiAgdW5pZm9ybUxvY2F0aW9uczoge1xyXG4gICAgbWF0cml4TG9jYXRpb246IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihzaGFkZXJQcm9ncmFtLCBcInVNYXRyaXhcIiksXHJcbiAgfSxcclxufTtcclxuXHJcbi8vIFRlbGwgV2ViR0wgdG8gdXNlIG91ciBwcm9ncmFtIHdoZW4gZHJhd2luZ1xyXG5nbC51c2VQcm9ncmFtKHNoYWRlclByb2dyYW0pO1xyXG5cclxuY29uc3Qgd2lkdGggPSAoZ2wuY2FudmFzIGFzIEhUTUxDYW52YXNFbGVtZW50KS5jbGllbnRXaWR0aDtcclxuY29uc3QgaGVpZ2h0ID0gKGdsLmNhbnZhcyBhcyBIVE1MQ2FudmFzRWxlbWVudCkuY2xpZW50SGVpZ2h0O1xyXG5jYW52YXMud2lkdGggPSB3aWR0aDtcclxuY2FudmFzLmhlaWdodCA9IGhlaWdodDtcclxuLy8gU2V0IGNsZWFyIGNvbG9yIHRvIGJsYWNrLCBmdWxseSBvcGFxdWVcclxuZ2wuY2xlYXJDb2xvcigxLjAsIDEuMCwgMS4wLCAxLjApO1xyXG4vLyBDbGVhciB0aGUgY29sb3IgYnVmZmVyIHdpdGggc3BlY2lmaWVkIGNsZWFyIGNvbG9yXHJcblxyXG5nbC52aWV3cG9ydCgwLCAwLCBnbC5jYW52YXMud2lkdGgsIGdsLmNhbnZhcy5oZWlnaHQpOyAvLyBzZXRzIHRoZSB2aWV3cG9ydCB0byBjb3ZlciB0aGUgZW50aXJlIGNhbnZhcywgc3RhcnRpbmcgZnJvbSB0aGUgbG93ZXItbGVmdCBjb3JuZXIgYW5kIGV4dGVuZGluZyB0byB0aGUgY2FudmFzJ3Mgd2lkdGggYW5kIGhlaWdodC5cclxuXHJcbi8vIENsZWFyIHRoZSBjYW52YXMgYmVmb3JlIHdlIHN0YXJ0IGRyYXdpbmcgb24gaXQuXHJcbmdsLmNsZWFyKGdsLkNPTE9SX0JVRkZFUl9CSVQpO1xyXG5cclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gY29uc3QgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYW52YXNcIikgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XHJcbmxldCBzaGFwZXM6IChTaGFwZSAmIFJlbmRlcmFibGUgJiBUcmFuc2Zvcm1hYmxlKVtdID0gW107XHJcbmxldCB0eXBlOiBUeXBlO1xyXG5sZXQgaXNEcmF3aW5nID0gZmFsc2U7XHJcbi8qIFNldHVwIFZpZXdwb3J0ICovXHJcblxyXG5jb25zdCBwb3NpdGlvbkJ1ZmZlciA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xyXG5jb25zdCBjb2xvckJ1ZmZlciA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xyXG4vLyBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgcG9zaXRpb25CdWZmZXIpO1xyXG4vLyBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgY29sb3JCdWZmZXIpO1xyXG4vLyBzZXRBdHRyaWJ1dGVzKGdsLCBwb3NpdGlvbkJ1ZmZlciwgY29sb3JCdWZmZXIsIHByb2dyYW1JbmZvKTtcclxuXHJcbmxldCBjdXJyZW50T2JqZWN0OiBTaGFwZSAmIFJlbmRlcmFibGUgJiBUcmFuc2Zvcm1hYmxlO1xyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gRml4IEhUTUwgRWxlbWVudHMgRXZlbnQgTGlzdGVuZXJzXHJcblxyXG4vKiBMaXN0IG9mIFNoYXBlcyBMaXN0ZW5lciAqL1xyXG5jb25zdCBsaXN0T2ZTaGFwZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICBcImxpc3Qtb2Ytc2hhcGVzXCJcclxuKSBhcyBIVE1MU2VsZWN0RWxlbWVudDtcclxubGlzdE9mU2hhcGVzLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKCkgPT4ge1xyXG4gIHJlbmRlckFsbChnbCwgcHJvZ3JhbUluZm8sIHNoYXBlcywgcG9zaXRpb25CdWZmZXIsIGNvbG9yQnVmZmVyKTtcclxuICBjb25zdCBpbmRleDogbnVtYmVyID0gK2xpc3RPZlNoYXBlcy5zZWxlY3RlZE9wdGlvbnNbMF0udmFsdWU7XHJcbiAgaXNEcmF3aW5nID0gZmFsc2U7XHJcblxyXG4gIHNldHVwU2VsZWN0b3IoZ2wsIHByb2dyYW1JbmZvLCBzaGFwZXNbaW5kZXhdKTtcclxufSk7XHJcblxyXG5jb25zdCB1bmlvbkJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidW5pb24tYnRuXCIpO1xyXG51bmlvbkJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gIGNvbnN0IG9iamVjdDE6IFNoYXBlICYgUmVuZGVyYWJsZSAmIFRyYW5zZm9ybWFibGUgPVxyXG4gICAgc2hhcGVzW051bWJlcihzZWxlY3Rpb25PZlNoYXBlczEudmFsdWUpXTtcclxuICBjb25zdCBvYmplY3QyOiBTaGFwZSAmIFJlbmRlcmFibGUgJiBUcmFuc2Zvcm1hYmxlID1cclxuICAgIHNoYXBlc1tOdW1iZXIoc2VsZWN0aW9uT2ZTaGFwZXMyLnZhbHVlKV07XHJcbiAgdW5pb24ob2JqZWN0MSwgb2JqZWN0Mik7XHJcbn0pO1xyXG5cclxuY29uc3Qgc2VsZWN0aW9uT2ZTaGFwZXMxID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgXCJzZWxlY3Rpb24tb2Ytc2hhcGVzMVwiXHJcbikgYXMgSFRNTFNlbGVjdEVsZW1lbnQ7XHJcbmNvbnN0IHNlbGVjdGlvbk9mU2hhcGVzMiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gIFwic2VsZWN0aW9uLW9mLXNoYXBlczJcIlxyXG4pIGFzIEhUTUxTZWxlY3RFbGVtZW50O1xyXG5cclxuLyogQnV0dG9uIExpc3RlbmVyICovXHJcbmNvbnN0IGxpbmVCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxpbmUtYnRuXCIpO1xyXG5saW5lQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgcmVuZGVyQWxsKGdsLCBwcm9ncmFtSW5mbywgc2hhcGVzLCBwb3NpdGlvbkJ1ZmZlciwgY29sb3JCdWZmZXIpO1xyXG4gIHR5cGUgPSBUeXBlLkxpbmU7XHJcbiAgaXNEcmF3aW5nID0gZmFsc2U7XHJcbn0pO1xyXG5cclxuY29uc3Qgc3F1YXJlQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzcXVhcmUtYnRuXCIpO1xyXG5zcXVhcmVCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICByZW5kZXJBbGwoZ2wsIHByb2dyYW1JbmZvLCBzaGFwZXMsIHBvc2l0aW9uQnVmZmVyLCBjb2xvckJ1ZmZlcik7XHJcbiAgdHlwZSA9IFR5cGUuU3F1YXJlO1xyXG4gIGlzRHJhd2luZyA9IGZhbHNlO1xyXG59KTtcclxuXHJcbmNvbnN0IHJlY3RhbmdsZUJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVjdGFuZ2xlLWJ0blwiKTtcclxucmVjdGFuZ2xlQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgcmVuZGVyQWxsKGdsLCBwcm9ncmFtSW5mbywgc2hhcGVzLCBwb3NpdGlvbkJ1ZmZlciwgY29sb3JCdWZmZXIpO1xyXG4gIHR5cGUgPSBUeXBlLlJlY3RhbmdsZTtcclxuICBpc0RyYXdpbmcgPSBmYWxzZTtcclxufSk7XHJcblxyXG5jb25zdCBwb2x5Z29uQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwb2x5Z29uLWJ0blwiKTtcclxucG9seWdvbkJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gIHJlbmRlckFsbChnbCwgcHJvZ3JhbUluZm8sIHNoYXBlcywgcG9zaXRpb25CdWZmZXIsIGNvbG9yQnVmZmVyKTtcclxuICB0eXBlID0gVHlwZS5Qb2x5Z29uO1xyXG4gIGlzRHJhd2luZyA9IGZhbHNlO1xyXG4gIC8vIGlzRmlyc3REcmF3aW5nID0gdHJ1ZTtcclxufSk7XHJcblxyXG5jb25zdCBzYXZlQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzYXZlLWJ0blwiKTtcclxuc2F2ZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gIHJlbmRlckFsbChnbCwgcHJvZ3JhbUluZm8sIHNoYXBlcywgcG9zaXRpb25CdWZmZXIsIGNvbG9yQnVmZmVyKTtcclxuICBjb25zdCB0ZXh0ID0gc3RvcmVTaGFwZXMoc2hhcGVzKTtcclxuICBoYW5kbGVEb3dubG9hZCh0ZXh0KTtcclxufSk7XHJcblxyXG5jb25zdCB1cGxvYWRCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInVwbG9hZC1idG5cIik7XHJcbnVwbG9hZEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gIGhhbmRsZVVwbG9hZCgodGV4dCkgPT4ge1xyXG4gICAgc2hhcGVzID0gbG9hZFNoYXBlKHRleHQpO1xyXG5cclxuICAgIGZvciAoY29uc3Qgc2hhcGUgb2Ygc2hhcGVzKSB7XHJcbiAgICAgIHNldHVwT3B0aW9uKHRydWUsIHNoYXBlKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXJBbGwoZ2wsIHByb2dyYW1JbmZvLCBzaGFwZXMsIHBvc2l0aW9uQnVmZmVyLCBjb2xvckJ1ZmZlcik7XHJcbiAgfSk7XHJcbn0pO1xyXG5cclxuLyogQ2FudmFzIExpc3RlbmVyICovXHJcbmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIChldmVudCkgPT4ge1xyXG4gIGNvbnN0IHggPSBldmVudC5jbGllbnRYO1xyXG4gIGNvbnN0IHkgPSBldmVudC5jbGllbnRZO1xyXG4gIGNvbnN0IHBvaW50ID0gbmV3IFBvaW50KFt4LCB5XSk7XHJcblxyXG4gIGlmIChpc0RyYXdpbmcpIHtcclxuICAgIGlmIChcclxuICAgICAgY3VycmVudE9iamVjdC50eXBlICE9PSBUeXBlLlBvbHlnb24gJiZcclxuICAgICAgY3VycmVudE9iamVjdC50eXBlICE9PSBUeXBlLlVuaWdvblxyXG4gICAgKSB7XHJcbiAgICAgIGN1cnJlbnRPYmplY3QuZHJhdyhwb2ludCk7XHJcbiAgICAgIHNldHVwT3B0aW9uKHRydWUsIGN1cnJlbnRPYmplY3QpO1xyXG4gICAgICBzaGFwZXMucHVzaChjdXJyZW50T2JqZWN0KTtcclxuICAgICAgaXNEcmF3aW5nID0gZmFsc2U7XHJcbiAgICAgIGN1cnJlbnRPYmplY3QgPSBudWxsO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKGN1cnJlbnRPYmplY3QuaWQgPT0gc2hhcGVzLmxlbmd0aCkge1xyXG4gICAgICAgIGN1cnJlbnRPYmplY3QuZHJhdyhwb2ludCk7XHJcbiAgICAgICAgLy8gYmVsdW0gZGlwdXNoIGtlIHNoYXBlc1xyXG4gICAgICAgIGlmIChjdXJyZW50T2JqZWN0LmFycmF5T2ZQb2ludHMubGVuZ3RoID49IDMpIHtcclxuICAgICAgICAgIHNldHVwT3B0aW9uKHRydWUsIGN1cnJlbnRPYmplY3QpO1xyXG4gICAgICAgICAgLy8gcmVuZGVyKGdsLCBwcm9ncmFtSW5mbywgY3VycmVudE9iamVjdCwgcG9zaXRpb25CdWZmZXIsIGNvbG9yQnVmZmVyKTtcclxuICAgICAgICAgIHNoYXBlcy5wdXNoKGN1cnJlbnRPYmplY3QpO1xyXG4gICAgICAgICAgcmVuZGVyQWxsKGdsLCBwcm9ncmFtSW5mbywgc2hhcGVzLCBwb3NpdGlvbkJ1ZmZlciwgY29sb3JCdWZmZXIpO1xyXG4gICAgICAgICAgaXNEcmF3aW5nID0gZmFsc2U7XHJcbiAgICAgICAgICBjdXJyZW50T2JqZWN0ID0gbnVsbDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmVuZGVyQWxsKGdsLCBwcm9ncmFtSW5mbywgc2hhcGVzLCBwb3NpdGlvbkJ1ZmZlciwgY29sb3JCdWZmZXIpO1xyXG4gICAgICAgICAgcmVuZGVyKGdsLCBwcm9ncmFtSW5mbywgY3VycmVudE9iamVjdCwgcG9zaXRpb25CdWZmZXIsIGNvbG9yQnVmZmVyKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc3QgbWF0cml4ID0gVHJhbnNmb3JtYXRpb24uaW52ZXJzZVRyYW5zZm9ybWF0aW9uTWF0cml4KFxyXG4gICAgICAgICAgZ2wuY2FudmFzLndpZHRoLFxyXG4gICAgICAgICAgZ2wuY2FudmFzLmhlaWdodCxcclxuICAgICAgICAgIGN1cnJlbnRPYmplY3QudHgsXHJcbiAgICAgICAgICBjdXJyZW50T2JqZWN0LnR5LFxyXG4gICAgICAgICAgY3VycmVudE9iamVjdC5kZWdyZWUsXHJcbiAgICAgICAgICBjdXJyZW50T2JqZWN0LnN4LFxyXG4gICAgICAgICAgY3VycmVudE9iamVjdC5zeSxcclxuICAgICAgICAgIGN1cnJlbnRPYmplY3Qua3gsXHJcbiAgICAgICAgICBjdXJyZW50T2JqZWN0Lmt5LFxyXG4gICAgICAgICAgY3VycmVudE9iamVjdC5jZW50ZXJcclxuICAgICAgICApO1xyXG4gICAgICAgIGNvbnN0IHBvaW50MiA9IG1hdHJpeC5tdWx0aXBseVBvaW50KHBvaW50KTtcclxuICAgICAgICBjdXJyZW50T2JqZWN0LmRyYXcocG9pbnQyKTtcclxuICAgICAgICBzZXR1cE9wdGlvbihmYWxzZSwgY3VycmVudE9iamVjdCk7XHJcbiAgICAgICAgLy8gcmVuZGVyKGdsLCBwcm9ncmFtSW5mbywgY3VycmVudE9iamVjdCwgcG9zaXRpb25CdWZmZXIsIGNvbG9yQnVmZmVyKTtcclxuICAgICAgICByZW5kZXJBbGwoZ2wsIHByb2dyYW1JbmZvLCBzaGFwZXMsIHBvc2l0aW9uQnVmZmVyLCBjb2xvckJ1ZmZlcik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9IGVsc2Uge1xyXG4gICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgIGNhc2UgVHlwZS5MaW5lOlxyXG4gICAgICAgIGN1cnJlbnRPYmplY3QgPSBuZXcgTGluZShzaGFwZXMubGVuZ3RoLCBwb2ludCk7XHJcbiAgICAgICAgaXNEcmF3aW5nID0gdHJ1ZTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBUeXBlLlNxdWFyZTpcclxuICAgICAgICBjdXJyZW50T2JqZWN0ID0gbmV3IFNxdWFyZShzaGFwZXMubGVuZ3RoLCBwb2ludCk7XHJcbiAgICAgICAgaXNEcmF3aW5nID0gdHJ1ZTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBUeXBlLlJlY3RhbmdsZTpcclxuICAgICAgICBjdXJyZW50T2JqZWN0ID0gbmV3IFJlY3RhbmdsZShzaGFwZXMubGVuZ3RoLCBwb2ludCk7XHJcbiAgICAgICAgaXNEcmF3aW5nID0gdHJ1ZTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBUeXBlLlBvbHlnb246XHJcbiAgICAgICAgY3VycmVudE9iamVjdCA9IG5ldyBQb2x5Z29uKHNoYXBlcy5sZW5ndGgsIHBvaW50KTtcclxuICAgICAgICBpc0RyYXdpbmcgPSB0cnVlO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH1cclxufSk7XHJcblxyXG5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCAoZXZlbnQpID0+IHtcclxuICBpZiAoXHJcbiAgICBpc0RyYXdpbmcgJiZcclxuICAgIGN1cnJlbnRPYmplY3QudHlwZSAhPT0gVHlwZS5Qb2x5Z29uICYmXHJcbiAgICBjdXJyZW50T2JqZWN0LnR5cGUgIT09IFR5cGUuVW5pZ29uXHJcbiAgKSB7XHJcbiAgICBjb25zdCB4ID0gZXZlbnQuY2xpZW50WDtcclxuICAgIGNvbnN0IHkgPSBldmVudC5jbGllbnRZO1xyXG4gICAgY29uc3QgcG9pbnQgPSBuZXcgUG9pbnQoW3gsIHldKTtcclxuICAgIGN1cnJlbnRPYmplY3QuZHJhdyhwb2ludCk7XHJcbiAgICByZW5kZXJBbGwoZ2wsIHByb2dyYW1JbmZvLCBzaGFwZXMsIHBvc2l0aW9uQnVmZmVyLCBjb2xvckJ1ZmZlcik7XHJcbiAgICByZW5kZXIoZ2wsIHByb2dyYW1JbmZvLCBjdXJyZW50T2JqZWN0LCBwb3NpdGlvbkJ1ZmZlciwgY29sb3JCdWZmZXIpO1xyXG4gIH1cclxufSk7XHJcblxyXG5mdW5jdGlvbiBzZXR1cE9wdGlvbihcclxuICBpc0ZpcnN0RHJhd2luZzogYm9vbGVhbixcclxuICBlbGVtZW50OiBSZW5kZXJhYmxlICYgVHJhbnNmb3JtYWJsZSAmIFNoYXBlXHJcbik6IHZvaWQge1xyXG4gIGNvbnN0IG9wdGlvbjEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xyXG4gIGNvbnN0IG9wdGlvbjIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xyXG4gIGNvbnN0IG9wdGlvbjMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xyXG5cclxuICBvcHRpb24xLnZhbHVlID0gZWxlbWVudC5pZC50b1N0cmluZygpO1xyXG4gIG9wdGlvbjIudmFsdWUgPSBlbGVtZW50LmlkLnRvU3RyaW5nKCk7XHJcbiAgb3B0aW9uMy52YWx1ZSA9IGVsZW1lbnQuaWQudG9TdHJpbmcoKTtcclxuXHJcbiAgbGV0IG9wdGlvblRleHQ6IHN0cmluZztcclxuICBzd2l0Y2ggKGVsZW1lbnQudHlwZSkge1xyXG4gICAgY2FzZSBUeXBlLkxpbmU6XHJcbiAgICAgIG9wdGlvblRleHQgPSBgTGluZV8ke2VsZW1lbnQuaWR9YDtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIFR5cGUuU3F1YXJlOlxyXG4gICAgICBvcHRpb25UZXh0ID0gYFNxdWFyZV8ke2VsZW1lbnQuaWR9YDtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIFR5cGUuUmVjdGFuZ2xlOlxyXG4gICAgICBvcHRpb25UZXh0ID0gYFJlY3RhbmdsZV8ke2VsZW1lbnQuaWR9YDtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIFR5cGUuUG9seWdvbjpcclxuICAgICAgb3B0aW9uVGV4dCA9IGBQb2x5Z29uXyR7ZWxlbWVudC5pZH1gO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgVHlwZS5Vbmlnb246XHJcbiAgICAgIG9wdGlvblRleHQgPSBgVW5pZ29uXyR7ZWxlbWVudC5pZH1gO1xyXG4gICAgICBicmVhaztcclxuICB9XHJcbiAgb3B0aW9uMS50ZXh0ID0gb3B0aW9uVGV4dDtcclxuICBvcHRpb24yLnRleHQgPSBvcHRpb25UZXh0O1xyXG4gIG9wdGlvbjMudGV4dCA9IG9wdGlvblRleHQ7XHJcblxyXG4gIGlmIChpc0ZpcnN0RHJhd2luZykge1xyXG4gICAgY29uc3QgbGlzdE9mU2hhcGVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgIFwibGlzdC1vZi1zaGFwZXNcIlxyXG4gICAgKSBhcyBIVE1MU2VsZWN0RWxlbWVudDtcclxuICAgIGNvbnN0IHNlbGVjdGlvbk9mU2hhcGVzMSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICBcInNlbGVjdGlvbi1vZi1zaGFwZXMxXCJcclxuICAgICkgYXMgSFRNTFNlbGVjdEVsZW1lbnQ7XHJcbiAgICBjb25zdCBzZWxlY3Rpb25PZlNoYXBlczIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgXCJzZWxlY3Rpb24tb2Ytc2hhcGVzMlwiXHJcbiAgICApIGFzIEhUTUxTZWxlY3RFbGVtZW50O1xyXG5cclxuICAgIGxpc3RPZlNoYXBlcy5hcHBlbmRDaGlsZChvcHRpb24xKTtcclxuICAgIHNlbGVjdGlvbk9mU2hhcGVzMS5hcHBlbmRDaGlsZChvcHRpb24yKTtcclxuICAgIHNlbGVjdGlvbk9mU2hhcGVzMi5hcHBlbmRDaGlsZChvcHRpb24zKTtcclxuICAgIGxpc3RPZlNoYXBlcy52YWx1ZSA9IGVsZW1lbnQuaWQudG9TdHJpbmcoKTtcclxuICAgIHNlbGVjdGlvbk9mU2hhcGVzMS52YWx1ZSA9IGVsZW1lbnQuaWQudG9TdHJpbmcoKTtcclxuICAgIHNlbGVjdGlvbk9mU2hhcGVzMi52YWx1ZSA9IGVsZW1lbnQuaWQudG9TdHJpbmcoKTtcclxuICB9XHJcblxyXG4gIHNldHVwU2VsZWN0b3IoZ2wsIHByb2dyYW1JbmZvLCBlbGVtZW50KTtcclxufVxyXG5cclxuZnVuY3Rpb24gc2V0dXBTZWxlY3RvcihcclxuICBnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LFxyXG4gIHByb2dyYW1JbmZvOiBQcm9ncmFtSW5mbyxcclxuICBlbGVtZW50OiBSZW5kZXJhYmxlICYgVHJhbnNmb3JtYWJsZSAmIFNoYXBlXHJcbik6IHZvaWQge1xyXG4gIGNvbnN0IHNsaWRlclhfb3JpZ2luYWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgIFwic2xpZGVyWFwiXHJcbiAgKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gIGNvbnN0IHNsaWRlclggPSBzbGlkZXJYX29yaWdpbmFsLmNsb25lTm9kZSh0cnVlKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gIHNsaWRlclhfb3JpZ2luYWwucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQoc2xpZGVyWCwgc2xpZGVyWF9vcmlnaW5hbCk7XHJcbiAgc2xpZGVyWC5taW4gPSBcIi02MDBcIjtcclxuICBzbGlkZXJYLm1heCA9IFwiNjAwXCI7XHJcbiAgc2xpZGVyWC52YWx1ZSA9IGVsZW1lbnQudHgudG9TdHJpbmcoKTtcclxuICBzbGlkZXJYLnN0ZXAgPSBcIjEwXCI7XHJcblxyXG4gIHNsaWRlclguYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIChldmVudCkgPT4ge1xyXG4gICAgY29uc3QgZGVsdGFYID0gKGV2ZW50LnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZTtcclxuICAgIGVsZW1lbnQudHggPSBOdW1iZXIoZGVsdGFYKTtcclxuICAgIHJlbmRlckFsbChnbCwgcHJvZ3JhbUluZm8sIHNoYXBlcywgcG9zaXRpb25CdWZmZXIsIGNvbG9yQnVmZmVyKTtcclxuICB9KTtcclxuXHJcbiAgY29uc3Qgc2xpZGVyWV9vcmlnaW5hbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgXCJzbGlkZXJZXCJcclxuICApIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgY29uc3Qgc2xpZGVyWSA9IHNsaWRlcllfb3JpZ2luYWwuY2xvbmVOb2RlKHRydWUpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgc2xpZGVyWV9vcmlnaW5hbC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChzbGlkZXJZLCBzbGlkZXJZX29yaWdpbmFsKTtcclxuICBzbGlkZXJZLm1pbiA9IFwiLTYwMFwiO1xyXG4gIHNsaWRlclkubWF4ID0gXCI2MDBcIjtcclxuICBzbGlkZXJZLnZhbHVlID0gKC1lbGVtZW50LnR5KS50b1N0cmluZygpO1xyXG4gIHNsaWRlclkuc3RlcCA9IFwiMTBcIjtcclxuICBzbGlkZXJZLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCAoZXZlbnQpID0+IHtcclxuICAgIGNvbnN0IGRlbHRhWSA9IChldmVudC50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWU7XHJcbiAgICBlbGVtZW50LnR5ID0gLU51bWJlcihkZWx0YVkpO1xyXG4gICAgcmVuZGVyQWxsKGdsLCBwcm9ncmFtSW5mbywgc2hhcGVzLCBwb3NpdGlvbkJ1ZmZlciwgY29sb3JCdWZmZXIpO1xyXG4gIH0pO1xyXG5cclxuICBjb25zdCBzbGlkZXJMZW5ndGhfb3JpZ2luYWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgIFwic2xpZGVyTGVuZ3RoXCJcclxuICApIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgY29uc3Qgc2xpZGVyTGVuZ3RoID0gc2xpZGVyTGVuZ3RoX29yaWdpbmFsLmNsb25lTm9kZShcclxuICAgIHRydWVcclxuICApIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgc2xpZGVyTGVuZ3RoX29yaWdpbmFsLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKFxyXG4gICAgc2xpZGVyTGVuZ3RoLFxyXG4gICAgc2xpZGVyTGVuZ3RoX29yaWdpbmFsXHJcbiAgKTtcclxuICBzbGlkZXJMZW5ndGgubWluID0gXCIwXCI7XHJcbiAgc2xpZGVyTGVuZ3RoLm1heCA9IFwiNjAwXCI7XHJcbiAgbGV0IGxlbmd0aDogbnVtYmVyO1xyXG4gIGlmIChlbGVtZW50LnR5cGUgPT09IFR5cGUuUG9seWdvbiB8fCBlbGVtZW50LnR5cGUgPT09IFR5cGUuVW5pZ29uKSB7XHJcbiAgICBsZXQgbWluID0gSW5maW5pdHk7XHJcbiAgICBsZXQgbWF4ID0gLUluZmluaXR5O1xyXG5cclxuICAgIGZvciAoY29uc3QgcCBvZiBlbGVtZW50LmFycmF5T2ZQb2ludHMpIHtcclxuICAgICAgY29uc3QgW3BYXSA9IHAuZ2V0UGFpcigpO1xyXG4gICAgICBpZiAocFggPCBtaW4pIHtcclxuICAgICAgICBtaW4gPSBwWDtcclxuICAgICAgfVxyXG4gICAgICBpZiAocFggPiBtYXgpIHtcclxuICAgICAgICBtYXggPSBwWDtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgbGVuZ3RoID0gbWF4IC0gbWluO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBsZW5ndGggPSBNYXRoLnNxcnQoXHJcbiAgICAgIChlbGVtZW50LmFycmF5T2ZQb2ludHNbMF0ueCAtIGVsZW1lbnQuYXJyYXlPZlBvaW50c1sxXS54KSAqKiAyICtcclxuICAgICAgICAoZWxlbWVudC5hcnJheU9mUG9pbnRzWzBdLnkgLSBlbGVtZW50LmFycmF5T2ZQb2ludHNbMV0ueSkgKiogMlxyXG4gICAgKTtcclxuICB9XHJcbiAgc2xpZGVyTGVuZ3RoLnZhbHVlID0gKChlbGVtZW50LnN4IC0gMSkgKiBsZW5ndGgpLnRvU3RyaW5nKCk7XHJcbiAgc2xpZGVyTGVuZ3RoLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCAoZXZlbnQpID0+IHtcclxuICAgIGNvbnN0IGRlbHRhTGVuZ3RoID0gKGV2ZW50LnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZTtcclxuICAgIGVsZW1lbnQuc3ggPSAxICsgTnVtYmVyKGRlbHRhTGVuZ3RoKSAvIGxlbmd0aDtcclxuICAgIGlmIChlbGVtZW50LnR5cGUgPT0gVHlwZS5TcXVhcmUpIHtcclxuICAgICAgZWxlbWVudC5zeSA9IDEgKyBOdW1iZXIoZGVsdGFMZW5ndGgpIC8gbGVuZ3RoO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyQWxsKGdsLCBwcm9ncmFtSW5mbywgc2hhcGVzLCBwb3NpdGlvbkJ1ZmZlciwgY29sb3JCdWZmZXIpO1xyXG4gIH0pO1xyXG5cclxuICBjb25zdCBzbGlkZXJXaWR0aF9vcmlnaW5hbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgXCJzbGlkZXJXaWR0aFwiXHJcbiAgKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gIGNvbnN0IHNsaWRlcldpZHRoID0gc2xpZGVyV2lkdGhfb3JpZ2luYWwuY2xvbmVOb2RlKHRydWUpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgc2xpZGVyV2lkdGhfb3JpZ2luYWwucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQoXHJcbiAgICBzbGlkZXJXaWR0aCxcclxuICAgIHNsaWRlcldpZHRoX29yaWdpbmFsXHJcbiAgKTtcclxuICBpZiAoZWxlbWVudC50eXBlID09IFR5cGUuTGluZSB8fCBlbGVtZW50LnR5cGUgPT0gVHlwZS5TcXVhcmUpIHtcclxuICAgIHNsaWRlcldpZHRoLmRpc2FibGVkID0gdHJ1ZTtcclxuICB9IGVsc2Uge1xyXG4gICAgc2xpZGVyV2lkdGguZGlzYWJsZWQgPSBmYWxzZTtcclxuICB9XHJcbiAgc2xpZGVyV2lkdGgubWluID0gXCIwXCI7XHJcbiAgc2xpZGVyV2lkdGgubWF4ID0gXCI2MDBcIjtcclxuICBsZXQgd2lkdGg6IG51bWJlcjtcclxuXHJcbiAgaWYgKGVsZW1lbnQudHlwZSA9PSBUeXBlLlJlY3RhbmdsZSB8fCBlbGVtZW50LnR5cGUgPT0gVHlwZS5TcXVhcmUpIHtcclxuICAgIHdpZHRoID0gTWF0aC5zcXJ0KFxyXG4gICAgICAoZWxlbWVudC5hcnJheU9mUG9pbnRzWzBdLnggLSBlbGVtZW50LmFycmF5T2ZQb2ludHNbM10ueCkgKiogMiArXHJcbiAgICAgICAgKGVsZW1lbnQuYXJyYXlPZlBvaW50c1swXS55IC0gZWxlbWVudC5hcnJheU9mUG9pbnRzWzNdLnkpICoqIDJcclxuICAgICk7XHJcbiAgfSBlbHNlIGlmIChlbGVtZW50LnR5cGUgPT0gVHlwZS5Qb2x5Z29uIHx8IGVsZW1lbnQudHlwZSA9PSBUeXBlLlVuaWdvbikge1xyXG4gICAgbGV0IG1pbiA9IEluZmluaXR5O1xyXG4gICAgbGV0IG1heCA9IC1JbmZpbml0eTtcclxuXHJcbiAgICBmb3IgKGNvbnN0IHAgb2YgZWxlbWVudC5hcnJheU9mUG9pbnRzKSB7XHJcbiAgICAgIGNvbnN0IFssIHBZXSA9IHAuZ2V0UGFpcigpO1xyXG4gICAgICBpZiAocFkgPCBtaW4pIHtcclxuICAgICAgICBtaW4gPSBwWTtcclxuICAgICAgfVxyXG4gICAgICBpZiAocFkgPiBtYXgpIHtcclxuICAgICAgICBtYXggPSBwWTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgd2lkdGggPSBtYXggLSBtaW47XHJcbiAgfVxyXG4gIHNsaWRlcldpZHRoLnZhbHVlID0gKChlbGVtZW50LnN5IC0gMSkgKiB3aWR0aCkudG9TdHJpbmcoKTtcclxuICBzbGlkZXJXaWR0aC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgKGV2ZW50KSA9PiB7XHJcbiAgICBjb25zdCBkZWx0YVdpZHRoID0gKGV2ZW50LnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZTtcclxuICAgIGVsZW1lbnQuc3kgPSAxICsgTnVtYmVyKGRlbHRhV2lkdGgpIC8gd2lkdGg7XHJcbiAgICByZW5kZXJBbGwoZ2wsIHByb2dyYW1JbmZvLCBzaGFwZXMsIHBvc2l0aW9uQnVmZmVyLCBjb2xvckJ1ZmZlcik7XHJcbiAgfSk7XHJcblxyXG4gIGNvbnN0IHNsaWRlclJvdGF0aW9uX29yaWdpbmFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICBcInNsaWRlclJvdGF0aW9uXCJcclxuICApIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgY29uc3Qgc2xpZGVyUm90YXRpb25fdmFsdWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgIFwic2xpZGVyLXJvdGF0aW9uLXZhbHVlXCJcclxuICApIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgY29uc3Qgc2xpZGVyUm90YXRpb24gPSBzbGlkZXJSb3RhdGlvbl9vcmlnaW5hbC5jbG9uZU5vZGUoXHJcbiAgICB0cnVlXHJcbiAgKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gIHNsaWRlclJvdGF0aW9uX29yaWdpbmFsLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKFxyXG4gICAgc2xpZGVyUm90YXRpb24sXHJcbiAgICBzbGlkZXJSb3RhdGlvbl9vcmlnaW5hbFxyXG4gICk7XHJcbiAgc2xpZGVyUm90YXRpb24ubWluID0gXCIwXCI7XHJcbiAgc2xpZGVyUm90YXRpb24ubWF4ID0gXCIzNjBcIjtcclxuICBzbGlkZXJSb3RhdGlvbi52YWx1ZSA9ICgoMTgwICogZWxlbWVudC5kZWdyZWUpIC8gTWF0aC5QSSkudG9TdHJpbmcoKTtcclxuICBzbGlkZXJSb3RhdGlvbl92YWx1ZS50ZXh0Q29udGVudCA9ICgoMTgwICogZWxlbWVudC5kZWdyZWUpIC8gTWF0aC5QSSlcclxuICAgIC50b0ZpeGVkKDApXHJcbiAgICAudG9TdHJpbmcoKTtcclxuICBzbGlkZXJSb3RhdGlvbi5zdGVwID0gXCIxMFwiO1xyXG4gIHNsaWRlclJvdGF0aW9uLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCAoZXZlbnQpID0+IHtcclxuICAgIGNvbnN0IGRlbHRhRGVncmVlID0gKGV2ZW50LnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZTtcclxuICAgIGVsZW1lbnQuZGVncmVlID0gKE51bWJlcihkZWx0YURlZ3JlZSkgLyAxODApICogTWF0aC5QSTtcclxuICAgIHNsaWRlclJvdGF0aW9uX3ZhbHVlLnRleHRDb250ZW50ID0gKCgxODAgKiBlbGVtZW50LmRlZ3JlZSkgLyBNYXRoLlBJKVxyXG4gICAgICAudG9GaXhlZCgwKVxyXG4gICAgICAudG9TdHJpbmcoKTtcclxuICAgIHJlbmRlckFsbChnbCwgcHJvZ3JhbUluZm8sIHNoYXBlcywgcG9zaXRpb25CdWZmZXIsIGNvbG9yQnVmZmVyKTtcclxuICB9KTtcclxuXHJcbiAgY29uc3Qgc2xpZGVyU2hlYXJYX29yaWdpbmFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICBcInNsaWRlclNoZWFyWFwiXHJcbiAgKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gIGNvbnN0IHNsaWRlclNoZWFyWCA9IHNsaWRlclNoZWFyWF9vcmlnaW5hbC5jbG9uZU5vZGUoXHJcbiAgICB0cnVlXHJcbiAgKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gIHNsaWRlclNoZWFyWF9vcmlnaW5hbC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChcclxuICAgIHNsaWRlclNoZWFyWCxcclxuICAgIHNsaWRlclNoZWFyWF9vcmlnaW5hbFxyXG4gICk7XHJcbiAgc2xpZGVyU2hlYXJYLm1pbiA9IFwiMFwiO1xyXG4gIHNsaWRlclNoZWFyWC5tYXggPSBcIjEwXCI7XHJcbiAgc2xpZGVyU2hlYXJYLnZhbHVlID0gZWxlbWVudC5reC50b1N0cmluZygpO1xyXG4gIHNsaWRlclNoZWFyWC5zdGVwID0gXCIwLjFcIjtcclxuXHJcbiAgc2xpZGVyU2hlYXJYLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCAoZXZlbnQpID0+IHtcclxuICAgIGNvbnN0IGRlbHRhU2hlYXJYID0gKGV2ZW50LnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZTtcclxuICAgIGVsZW1lbnQua3ggPSBOdW1iZXIoZGVsdGFTaGVhclgpO1xyXG4gICAgcmVuZGVyQWxsKGdsLCBwcm9ncmFtSW5mbywgc2hhcGVzLCBwb3NpdGlvbkJ1ZmZlciwgY29sb3JCdWZmZXIpO1xyXG4gIH0pO1xyXG5cclxuICBjb25zdCBzbGlkZXJTaGVhcllfb3JpZ2luYWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgIFwic2xpZGVyU2hlYXJZXCJcclxuICApIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgY29uc3Qgc2xpZGVyU2hlYXJZID0gc2xpZGVyU2hlYXJZX29yaWdpbmFsLmNsb25lTm9kZShcclxuICAgIHRydWVcclxuICApIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgc2xpZGVyU2hlYXJZX29yaWdpbmFsLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKFxyXG4gICAgc2xpZGVyU2hlYXJZLFxyXG4gICAgc2xpZGVyU2hlYXJZX29yaWdpbmFsXHJcbiAgKTtcclxuICBzbGlkZXJTaGVhclkubWluID0gXCIwXCI7XHJcbiAgc2xpZGVyU2hlYXJZLm1heCA9IFwiMTBcIjtcclxuICBzbGlkZXJTaGVhclkudmFsdWUgPSBlbGVtZW50Lmt5LnRvU3RyaW5nKCk7XHJcbiAgc2xpZGVyU2hlYXJZLnN0ZXAgPSBcIjAuMVwiO1xyXG5cclxuICBzbGlkZXJTaGVhclkuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIChldmVudCkgPT4ge1xyXG4gICAgY29uc3QgZGVsdGFTaGVhclkgPSAoZXZlbnQudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlO1xyXG4gICAgZWxlbWVudC5reSA9IE51bWJlcihkZWx0YVNoZWFyWSk7XHJcbiAgICByZW5kZXJBbGwoZ2wsIHByb2dyYW1JbmZvLCBzaGFwZXMsIHBvc2l0aW9uQnVmZmVyLCBjb2xvckJ1ZmZlcik7XHJcbiAgfSk7XHJcblxyXG4gIGNvbnN0IHBvaW50UGlja2VyX29yaWdpbmFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICBcInBvaW50UGlja2VyXCJcclxuICApIGFzIEhUTUxTZWxlY3RFbGVtZW50O1xyXG4gIGNvbnN0IHBvaW50UGlja2VyID0gcG9pbnRQaWNrZXJfb3JpZ2luYWwuY2xvbmVOb2RlKHRydWUpIGFzIEhUTUxTZWxlY3RFbGVtZW50O1xyXG4gIHBvaW50UGlja2VyX29yaWdpbmFsLnBhcmVudEVsZW1lbnQucmVwbGFjZUNoaWxkKFxyXG4gICAgcG9pbnRQaWNrZXIsXHJcbiAgICBwb2ludFBpY2tlcl9vcmlnaW5hbFxyXG4gICk7XHJcbiAgcG9pbnRQaWNrZXIuaW5uZXJIVE1MID0gXCJcIjtcclxuICBwb2ludFBpY2tlci5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsICgpID0+IHtcclxuICAgIGNvbnN0IHBvaW50SW5kZXg6IG51bWJlciA9IE51bWJlcihwb2ludFBpY2tlci52YWx1ZSk7XHJcbiAgICBzZXR1cENvbG9yUGlja2VyKGdsLCBwcm9ncmFtSW5mbywgcG9pbnRJbmRleCwgZWxlbWVudCk7XHJcbiAgICBzZXR1cFBvaW50TW92ZUJ1dHRvbihnbCwgcHJvZ3JhbUluZm8sIHBvaW50SW5kZXgsIGVsZW1lbnQpO1xyXG4gIH0pO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZWxlbWVudC5hcnJheU9mUG9pbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBjb25zdCBuZXdQb2ludCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XHJcbiAgICBuZXdQb2ludC52YWx1ZSA9IGkudG9TdHJpbmcoKTtcclxuICAgIG5ld1BvaW50LnRleHQgPSBcInBvaW50X1wiICsgaTtcclxuICAgIHBvaW50UGlja2VyLmFwcGVuZENoaWxkKG5ld1BvaW50KTtcclxuICB9XHJcblxyXG4gIC8vIElmIHRoZSBjdXJyZW50T2JqZWN0IGlzIG5vdCBvZiB0eXBlIFBvbHlnb24sIHJlbW92ZSB0aGUgYnV0dG9uXHJcbiAgY29uc3QgYWRkUG9pbnRCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ0bi1hZGQtcG9pbnRcIik7XHJcbiAgaWYgKGFkZFBvaW50QnV0dG9uKSB7XHJcbiAgICBhZGRQb2ludEJ1dHRvbi5yZW1vdmUoKTtcclxuICB9XHJcblxyXG4gIGlmIChlbGVtZW50IGluc3RhbmNlb2YgUG9seWdvbiB8fCBlbGVtZW50IGluc3RhbmNlb2YgVW5pZ29uKSB7XHJcbiAgICBjb25zdCBhZGRQb2ludEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XHJcbiAgICBhZGRQb2ludEJ1dHRvbi50ZXh0Q29udGVudCA9IFwiQWRkIE5ldyBQb2ludFwiO1xyXG4gICAgYWRkUG9pbnRCdXR0b24uY2xhc3NOYW1lID0gXCJidG4gYnRuLXByaW1hcnkgYWRkLWJ0blwiO1xyXG4gICAgYWRkUG9pbnRCdXR0b24uaWQgPSBcImJ0bi1hZGQtcG9pbnRcIjtcclxuICAgIGFkZFBvaW50QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgICAgIC8vIFNldCBhIGZsYWcgdG8gaW5kaWNhdGUgdGhhdCBhIG5ldyBwb2ludCBpcyBiZWluZyBhZGRlZFxyXG4gICAgICBpc0RyYXdpbmcgPSB0cnVlO1xyXG4gICAgICBjdXJyZW50T2JqZWN0ID0gc2hhcGVzW2VsZW1lbnQuaWRdO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gQXBwZW5kIHRoZSBidXR0b24gdG8gdGhlIERPTVxyXG4gICAgY29uc3QgcG9seWdvbkJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucG9seWdvbi1idG4tc2VjdGlvblwiKTtcclxuICAgIGlmIChwb2x5Z29uQnRuKSB7XHJcbiAgICAgIHBvbHlnb25CdG4uYXBwZW5kQ2hpbGQoYWRkUG9pbnRCdXR0b24pO1xyXG4gICAgfVxyXG4gIH1cclxuICBzZXR1cENvbG9yUGlja2VyKGdsLCBwcm9ncmFtSW5mbywgMCwgZWxlbWVudCk7XHJcbiAgc2V0dXBQb2ludE1vdmVCdXR0b24oZ2wsIHByb2dyYW1JbmZvLCAwLCBlbGVtZW50KTtcclxufVxyXG5cclxuZnVuY3Rpb24gc2V0dXBDb2xvclBpY2tlcihcclxuICBnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LFxyXG4gIHByb2dyYW1JbmZvOiBQcm9ncmFtSW5mbyxcclxuICBwb2ludEluZGV4OiBudW1iZXIsXHJcbiAgZWxlbWVudDogUmVuZGVyYWJsZSAmIFRyYW5zZm9ybWFibGUgJiBTaGFwZVxyXG4pIHtcclxuICBjb25zdCBjb2xvclBpY2tlcl9vcmlnaW5hbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgXCJjb2xvclBpY2tlclwiXHJcbiAgKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gIGNvbnN0IGNvbG9yUGlja2VyID0gY29sb3JQaWNrZXJfb3JpZ2luYWwuY2xvbmVOb2RlKHRydWUpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgY29uc3QgY29sb3IgPSByZ2JUb0hleChlbGVtZW50LmFycmF5T2ZQb2ludHNbcG9pbnRJbmRleF0uZ2V0Q29sb3IoKSk7XHJcbiAgY29sb3JQaWNrZXIudmFsdWUgPSBjb2xvcjtcclxuICBjb2xvclBpY2tlcl9vcmlnaW5hbC5wYXJlbnRFbGVtZW50LnJlcGxhY2VDaGlsZChcclxuICAgIGNvbG9yUGlja2VyLFxyXG4gICAgY29sb3JQaWNrZXJfb3JpZ2luYWxcclxuICApO1xyXG5cclxuICBjb2xvclBpY2tlci5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIChldmVudCkgPT4ge1xyXG4gICAgY29uc3QgaGV4ID0gKGV2ZW50LnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZTtcclxuICAgIGVsZW1lbnQuYXJyYXlPZlBvaW50c1twb2ludEluZGV4XS5zZXRDb2xvcihoZXhUb1JnYihoZXgpKTtcclxuICAgIHJlbmRlckFsbChnbCwgcHJvZ3JhbUluZm8sIHNoYXBlcywgcG9zaXRpb25CdWZmZXIsIGNvbG9yQnVmZmVyKTtcclxuICB9KTtcclxuXHJcbiAgY29uc3QgZGVsZXRlUG9pbnRCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ0bi1kZWxldGUtcG9pbnRcIik7XHJcbiAgaWYgKGRlbGV0ZVBvaW50QnV0dG9uKSB7XHJcbiAgICBkZWxldGVQb2ludEJ1dHRvbi5yZW1vdmUoKTtcclxuICB9XHJcbiAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBQb2x5Z29uIHx8IGVsZW1lbnQgaW5zdGFuY2VvZiBVbmlnb24pIHtcclxuICAgIGNvbnN0IGRlbGV0ZVBvaW50QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcclxuICAgIGRlbGV0ZVBvaW50QnV0dG9uLnRleHRDb250ZW50ID0gXCJEZWxldGUgUG9pbnRcIjtcclxuICAgIGRlbGV0ZVBvaW50QnV0dG9uLmNsYXNzTmFtZSA9IFwiYnRuIGJ0bi1wcmltYXJ5IGRlbGV0ZS1idG5cIjtcclxuICAgIGRlbGV0ZVBvaW50QnV0dG9uLmlkID0gXCJidG4tZGVsZXRlLXBvaW50XCI7XHJcbiAgICBkZWxldGVQb2ludEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gICAgICBlbGVtZW50LmRlbGV0ZVBvaW50KHBvaW50SW5kZXgpO1xyXG4gICAgICByZW5kZXJBbGwoZ2wsIHByb2dyYW1JbmZvLCBzaGFwZXMsIHBvc2l0aW9uQnVmZmVyLCBjb2xvckJ1ZmZlcik7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBwb2x5Z29uQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wb2x5Z29uLWJ0bi1zZWN0aW9uXCIpO1xyXG4gICAgaWYgKHBvbHlnb25CdG4pIHtcclxuICAgICAgcG9seWdvbkJ0bi5hcHBlbmRDaGlsZChkZWxldGVQb2ludEJ1dHRvbik7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBzZXR1cFBvaW50TW92ZUJ1dHRvbihcclxuICBnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LFxyXG4gIHByb2dyYW1JbmZvOiBQcm9ncmFtSW5mbyxcclxuICBwb2ludEluZGV4OiBudW1iZXIsXHJcbiAgZWxlbWVudDogUmVuZGVyYWJsZSAmIFRyYW5zZm9ybWFibGUgJiBTaGFwZVxyXG4pIHtcclxuICBsZXQgbW92ZVg6IG51bWJlcjtcclxuICBsZXQgbW92ZVk6IG51bWJlcjtcclxuICBjb25zdCBtb3ZlWFBvaW50TmVnYXRpdmVfb3JpZ2luYWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5lZ2F0aXZlWFwiKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxuICBjb25zdCBtb3ZlWFBvaW50UG9zaXRpdmVfb3JpZ2luYWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBvc2l0aXZlWFwiKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxuICBjb25zdCBtb3ZlWVBvaW50TmVnYXRpdmVfb3JpZ2luYWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5lZ2F0aXZlWVwiKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxuICBjb25zdCBtb3ZlWVBvaW50UG9zaXRpdmVfb3JpZ2luYWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBvc2l0aXZlWVwiKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxuICBjb25zdCBtb3ZlWFBvaW50TmVnYXRpdmUgPSBtb3ZlWFBvaW50TmVnYXRpdmVfb3JpZ2luYWwuY2xvbmVOb2RlKHRydWUpIGFzIEhUTUxCdXR0b25FbGVtZW50O1xyXG4gIGNvbnN0IG1vdmVYUG9pbnRQb3NpdGl2ZSA9IG1vdmVYUG9pbnRQb3NpdGl2ZV9vcmlnaW5hbC5jbG9uZU5vZGUodHJ1ZSkgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbiAgY29uc3QgbW92ZVlQb2ludE5lZ2F0aXZlID0gbW92ZVlQb2ludE5lZ2F0aXZlX29yaWdpbmFsLmNsb25lTm9kZSh0cnVlKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxuICBjb25zdCBtb3ZlWVBvaW50UG9zaXRpdmUgPSBtb3ZlWVBvaW50UG9zaXRpdmVfb3JpZ2luYWwuY2xvbmVOb2RlKHRydWUpIGFzIEhUTUxCdXR0b25FbGVtZW50O1xyXG5cclxuICBtb3ZlWFBvaW50TmVnYXRpdmVfb3JpZ2luYWwucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQobW92ZVhQb2ludE5lZ2F0aXZlLCBtb3ZlWFBvaW50TmVnYXRpdmVfb3JpZ2luYWwpO1xyXG4gIG1vdmVYUG9pbnRQb3NpdGl2ZV9vcmlnaW5hbC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChtb3ZlWFBvaW50UG9zaXRpdmUsIG1vdmVYUG9pbnRQb3NpdGl2ZV9vcmlnaW5hbCk7XHJcbiAgbW92ZVlQb2ludE5lZ2F0aXZlX29yaWdpbmFsLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKG1vdmVZUG9pbnROZWdhdGl2ZSwgbW92ZVlQb2ludE5lZ2F0aXZlX29yaWdpbmFsKTtcclxuICBtb3ZlWVBvaW50UG9zaXRpdmVfb3JpZ2luYWwucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQobW92ZVlQb2ludFBvc2l0aXZlLCBtb3ZlWVBvaW50UG9zaXRpdmVfb3JpZ2luYWwpO1xyXG5cclxuICBpZihlbGVtZW50LnR5cGUgPT0gVHlwZS5Qb2x5Z29uIHx8IGVsZW1lbnQudHlwZSA9PSBUeXBlLlVuaWdvbikge1xyXG4gICAgbW92ZVhQb2ludE5lZ2F0aXZlLmRpc2FibGVkID0gdHJ1ZTtcclxuICAgIG1vdmVYUG9pbnRQb3NpdGl2ZS5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICBtb3ZlWVBvaW50TmVnYXRpdmUuZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgbW92ZVlQb2ludFBvc2l0aXZlLmRpc2FibGVkID0gdHJ1ZTtcclxuICB9XHJcblxyXG4gIG1vdmVYUG9pbnROZWdhdGl2ZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gICAgbW92ZVggPSAtMTA7XHJcbiAgICBsZXQgcG9pbnQgPSBuZXcgUG9pbnQoW2VsZW1lbnQuYXJyYXlPZlBvaW50c1twb2ludEluZGV4XS54ICsgbW92ZVgsIGVsZW1lbnQuYXJyYXlPZlBvaW50c1twb2ludEluZGV4XS55XSk7XHJcbiAgICBjb25zdCBwb2ludEluZm8gPSBcInBcIiArIChwb2ludEluZGV4ICsgMSkudG9TdHJpbmcoKTtcclxuICAgIHN3aXRjaChlbGVtZW50LnR5cGUpe1xyXG4gICAgICBjYXNlIFR5cGUuTGluZTpcclxuICAgICAgICAoZWxlbWVudCBhcyBMaW5lKS5yZURyYXcocG9pbnQsIHBvaW50SW5mbyk7XHJcbiAgICAgIGNhc2UgVHlwZS5TcXVhcmU6XHJcbiAgICAgICAgKGVsZW1lbnQgYXMgU3F1YXJlKS5yZURyYXcocG9pbnQsIHBvaW50SW5mbyk7XHJcbiAgICAgIGNhc2UgVHlwZS5SZWN0YW5nbGU6XHJcbiAgICAgICAgKGVsZW1lbnQgYXMgUmVjdGFuZ2xlKS5yZURyYXcocG9pbnQsIHBvaW50SW5mbyk7XHJcbiAgICB9XHJcbiAgICByZW5kZXJBbGwoZ2wsIHByb2dyYW1JbmZvLCBzaGFwZXMsIHBvc2l0aW9uQnVmZmVyLCBjb2xvckJ1ZmZlcik7XHJcbiAgfSk7XHJcblxyXG4gIG1vdmVYUG9pbnRQb3NpdGl2ZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gICAgbW92ZVggPSAxMDtcclxuICAgIGxldCBwb2ludCA9IG5ldyBQb2ludChbZWxlbWVudC5hcnJheU9mUG9pbnRzW3BvaW50SW5kZXhdLnggKyBtb3ZlWCwgZWxlbWVudC5hcnJheU9mUG9pbnRzW3BvaW50SW5kZXhdLnldKTtcclxuICAgIGNvbnN0IHBvaW50SW5mbyA9IFwicFwiICsgKHBvaW50SW5kZXggKyAxKS50b1N0cmluZygpO1xyXG4gICAgc3dpdGNoKGVsZW1lbnQudHlwZSl7XHJcbiAgICAgIGNhc2UgVHlwZS5MaW5lOlxyXG4gICAgICAgIChlbGVtZW50IGFzIExpbmUpLnJlRHJhdyhwb2ludCwgcG9pbnRJbmZvKTtcclxuICAgICAgY2FzZSBUeXBlLlNxdWFyZTpcclxuICAgICAgICAoZWxlbWVudCBhcyBTcXVhcmUpLnJlRHJhdyhwb2ludCwgcG9pbnRJbmZvKTtcclxuICAgICAgY2FzZSBUeXBlLlJlY3RhbmdsZTpcclxuICAgICAgICAoZWxlbWVudCBhcyBSZWN0YW5nbGUpLnJlRHJhdyhwb2ludCwgcG9pbnRJbmZvKTtcclxuICAgIH1cclxuICAgIHJlbmRlckFsbChnbCwgcHJvZ3JhbUluZm8sIHNoYXBlcywgcG9zaXRpb25CdWZmZXIsIGNvbG9yQnVmZmVyKTtcclxuICB9KTtcclxuXHJcbiAgbW92ZVlQb2ludE5lZ2F0aXZlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgICBtb3ZlWSA9IDEwO1xyXG4gICAgbGV0IHBvaW50ID0gbmV3IFBvaW50KFtlbGVtZW50LmFycmF5T2ZQb2ludHNbcG9pbnRJbmRleF0ueCwgZWxlbWVudC5hcnJheU9mUG9pbnRzW3BvaW50SW5kZXhdLnkgKyBtb3ZlWV0pO1xyXG4gICAgY29uc29sZS5sb2cocG9pbnQueSk7XHJcbiAgICBjb25zdCBwb2ludEluZm8gPSBcInBcIiArIChwb2ludEluZGV4ICsgMSkudG9TdHJpbmcoKTtcclxuICAgIHN3aXRjaChlbGVtZW50LnR5cGUpe1xyXG4gICAgICBjYXNlIFR5cGUuTGluZTpcclxuICAgICAgICAoZWxlbWVudCBhcyBMaW5lKS5yZURyYXcocG9pbnQsIHBvaW50SW5mbyk7XHJcbiAgICAgIGNhc2UgVHlwZS5TcXVhcmU6XHJcbiAgICAgICAgKGVsZW1lbnQgYXMgU3F1YXJlKS5yZURyYXcocG9pbnQsIHBvaW50SW5mbyk7XHJcbiAgICAgIGNhc2UgVHlwZS5SZWN0YW5nbGU6XHJcbiAgICAgICAgKGVsZW1lbnQgYXMgUmVjdGFuZ2xlKS5yZURyYXcocG9pbnQsIHBvaW50SW5mbyk7XHJcbiAgICB9XHJcbiAgICByZW5kZXJBbGwoZ2wsIHByb2dyYW1JbmZvLCBzaGFwZXMsIHBvc2l0aW9uQnVmZmVyLCBjb2xvckJ1ZmZlcik7XHJcbiAgfSk7XHJcblxyXG4gIG1vdmVZUG9pbnRQb3NpdGl2ZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gICAgbW92ZVkgPSAtMTA7XHJcbiAgICBsZXQgcG9pbnQgPSBuZXcgUG9pbnQoW2VsZW1lbnQuYXJyYXlPZlBvaW50c1twb2ludEluZGV4XS54LCBlbGVtZW50LmFycmF5T2ZQb2ludHNbcG9pbnRJbmRleF0ueSArIG1vdmVZXSk7XHJcbiAgICBjb25zb2xlLmxvZyhwb2ludC55KTtcclxuICAgIGNvbnN0IHBvaW50SW5mbyA9IFwicFwiICsgKHBvaW50SW5kZXggKyAxKS50b1N0cmluZygpO1xyXG4gICAgc3dpdGNoKGVsZW1lbnQudHlwZSl7XHJcbiAgICAgIGNhc2UgVHlwZS5MaW5lOlxyXG4gICAgICAgIChlbGVtZW50IGFzIExpbmUpLnJlRHJhdyhwb2ludCwgcG9pbnRJbmZvKTtcclxuICAgICAgY2FzZSBUeXBlLlNxdWFyZTpcclxuICAgICAgICAoZWxlbWVudCBhcyBTcXVhcmUpLnJlRHJhdyhwb2ludCwgcG9pbnRJbmZvKTtcclxuICAgICAgY2FzZSBUeXBlLlJlY3RhbmdsZTpcclxuICAgICAgICAoZWxlbWVudCBhcyBSZWN0YW5nbGUpLnJlRHJhdyhwb2ludCwgcG9pbnRJbmZvKTtcclxuICAgIH1cclxuICAgIHJlbmRlckFsbChnbCwgcHJvZ3JhbUluZm8sIHNoYXBlcywgcG9zaXRpb25CdWZmZXIsIGNvbG9yQnVmZmVyKTtcclxuICB9KTtcclxuICBcclxufVxyXG5cclxuLy8gbG9hZHNoYXBlIGZyb20ganNvbiB0byBhcnJheSBvZiBzaGFwZVxyXG5mdW5jdGlvbiBsb2FkU2hhcGUodGV4dDogc3RyaW5nKTogKFNoYXBlICYgUmVuZGVyYWJsZSAmIFRyYW5zZm9ybWFibGUpW10ge1xyXG4gIGNvbnN0IHNoYXBlOiAoU2hhcGUgJiBSZW5kZXJhYmxlICYgVHJhbnNmb3JtYWJsZSlbXSA9IFtdO1xyXG4gIGNvbnN0IGRhdGEgPSBKU09OLnBhcnNlKHRleHQpO1xyXG4gIGNvbnN0IGxpc3RPZlNoYXBlcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgXCJsaXN0LW9mLXNoYXBlc1wiXHJcbiAgKSBhcyBIVE1MU2VsZWN0RWxlbWVudDtcclxuICBjb25zdCBzZWxlY3Rpb25PZlNoYXBlczEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgIFwic2VsZWN0aW9uLW9mLXNoYXBlczFcIlxyXG4gICkgYXMgSFRNTFNlbGVjdEVsZW1lbnQ7XHJcbiAgY29uc3Qgc2VsZWN0aW9uT2ZTaGFwZXMyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICBcInNlbGVjdGlvbi1vZi1zaGFwZXMyXCJcclxuICApIGFzIEhUTUxTZWxlY3RFbGVtZW50O1xyXG5cclxuICAvLyBjbGVhciB0aGUgbGlzdCBvZiBzaGFwZXMgb3B0aW9uXHJcbiAgd2hpbGUgKGxpc3RPZlNoYXBlcy5maXJzdENoaWxkKSB7XHJcbiAgICBsaXN0T2ZTaGFwZXMucmVtb3ZlQ2hpbGQobGlzdE9mU2hhcGVzLmZpcnN0Q2hpbGQpO1xyXG4gICAgc2VsZWN0aW9uT2ZTaGFwZXMxLnJlbW92ZUNoaWxkKHNlbGVjdGlvbk9mU2hhcGVzMS5maXJzdENoaWxkKTtcclxuICAgIHNlbGVjdGlvbk9mU2hhcGVzMi5yZW1vdmVDaGlsZChzZWxlY3Rpb25PZlNoYXBlczIuZmlyc3RDaGlsZCk7XHJcbiAgfVxyXG5cclxuICBmb3IgKGNvbnN0IGl0ZW0gb2YgZGF0YSkge1xyXG4gICAgY29uc3QgdHggPSBpdGVtLnR4O1xyXG4gICAgY29uc3QgdHkgPSBpdGVtLnR5O1xyXG4gICAgY29uc3QgZGVncmVlID0gaXRlbS5kZWdyZWU7XHJcbiAgICBjb25zdCBzeCA9IGl0ZW0uc3g7XHJcbiAgICBjb25zdCBzeSA9IGl0ZW0uc3k7XHJcbiAgICBjb25zdCBreCA9IGl0ZW0ua3g7XHJcbiAgICBjb25zdCBreSA9IGl0ZW0ua3k7XHJcbiAgICBsZXQgYXJyYXlPZlBvaW50czogUG9pbnRbXSA9IFtdO1xyXG4gICAgZm9yIChjb25zdCBwb2ludCBvZiBpdGVtLmFycmF5T2ZQb2ludHMpIHtcclxuICAgICAgbGV0IHAgPSBuZXcgUG9pbnQoXHJcbiAgICAgICAgW3BvaW50LngsIHBvaW50LnldLFxyXG4gICAgICAgIFtwb2ludC5yLCBwb2ludC5nLCBwb2ludC5iLCBwb2ludC5hXVxyXG4gICAgICApO1xyXG4gICAgICBhcnJheU9mUG9pbnRzLnB1c2gocCk7XHJcbiAgICB9XHJcbiAgICBzd2l0Y2ggKGl0ZW0udHlwZSkge1xyXG4gICAgICBjYXNlIFR5cGUuTGluZTpcclxuICAgICAgICBjb25zdCBsaW5lID0gbmV3IExpbmUoaXRlbS5pZCwgYXJyYXlPZlBvaW50c1swXSk7XHJcbiAgICAgICAgbGluZS5zZXRMaW5lQXR0cmlidXRlcyhcclxuICAgICAgICAgIHR4LFxyXG4gICAgICAgICAgdHksXHJcbiAgICAgICAgICBkZWdyZWUsXHJcbiAgICAgICAgICBzeCxcclxuICAgICAgICAgIHN5LFxyXG4gICAgICAgICAga3gsXHJcbiAgICAgICAgICBreSxcclxuICAgICAgICAgIGFycmF5T2ZQb2ludHNbMV1cclxuICAgICAgICApO1xyXG4gICAgICAgIHNoYXBlLnB1c2gobGluZSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgVHlwZS5TcXVhcmU6XHJcbiAgICAgICAgY29uc3Qgc3F1YXJlID0gbmV3IFNxdWFyZShcclxuICAgICAgICAgIGl0ZW0uaWQsXHJcbiAgICAgICAgICBuZXcgUG9pbnQoW2l0ZW0uY2VudGVyLngsIGl0ZW0uY2VudGVyLnldKVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgc3F1YXJlLnNldFNxdWFyZUF0dHJpYnV0ZXMoXHJcbiAgICAgICAgICB0eCxcclxuICAgICAgICAgIHR5LFxyXG4gICAgICAgICAgZGVncmVlLFxyXG4gICAgICAgICAgc3gsXHJcbiAgICAgICAgICBzeSxcclxuICAgICAgICAgIGt4LFxyXG4gICAgICAgICAga3ksXHJcbiAgICAgICAgICBhcnJheU9mUG9pbnRzXHJcbiAgICAgICAgKTtcclxuICAgICAgICBzaGFwZS5wdXNoKHNxdWFyZSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgVHlwZS5SZWN0YW5nbGU6XHJcbiAgICAgICAgY29uc3QgcmVjdGFuZ2xlID0gbmV3IFJlY3RhbmdsZShpdGVtLmlkLCBhcnJheU9mUG9pbnRzWzBdKTtcclxuICAgICAgICByZWN0YW5nbGUuc2V0UmVjdGFuZ2xlQXR0cmlidXRlcyhcclxuICAgICAgICAgIHR4LFxyXG4gICAgICAgICAgdHksXHJcbiAgICAgICAgICBkZWdyZWUsXHJcbiAgICAgICAgICBzeCxcclxuICAgICAgICAgIHN5LFxyXG4gICAgICAgICAga3gsXHJcbiAgICAgICAgICBreSxcclxuICAgICAgICAgIGFycmF5T2ZQb2ludHNcclxuICAgICAgICApO1xyXG4gICAgICAgIHNoYXBlLnB1c2gocmVjdGFuZ2xlKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBUeXBlLlBvbHlnb246XHJcbiAgICAgICAgY29uc3QgcG9seWdvbiA9IG5ldyBQb2x5Z29uKGl0ZW0uaWQsIGFycmF5T2ZQb2ludHNbMF0pO1xyXG4gICAgICAgIHBvbHlnb24uc2V0UG9seWdvbkF0dHJpYnV0ZXMoXHJcbiAgICAgICAgICB0eCxcclxuICAgICAgICAgIHR5LFxyXG4gICAgICAgICAgZGVncmVlLFxyXG4gICAgICAgICAgc3gsXHJcbiAgICAgICAgICBzeSxcclxuICAgICAgICAgIGt4LFxyXG4gICAgICAgICAga3ksXHJcbiAgICAgICAgICBhcnJheU9mUG9pbnRzXHJcbiAgICAgICAgKTtcclxuICAgICAgICBzaGFwZS5wdXNoKHBvbHlnb24pO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFR5cGUuVW5pZ29uOlxyXG4gICAgICAgIGNvbnN0IHVuaWdvbiA9IG5ldyBVbmlnb24oaXRlbS5pZCwgYXJyYXlPZlBvaW50c1swXSk7XHJcbiAgICAgICAgdW5pZ29uLnNldFVuaWdvbkF0dHJpYnV0ZXMoXHJcbiAgICAgICAgICB0eCxcclxuICAgICAgICAgIHR5LFxyXG4gICAgICAgICAgZGVncmVlLFxyXG4gICAgICAgICAgc3gsXHJcbiAgICAgICAgICBzeSxcclxuICAgICAgICAgIGt4LFxyXG4gICAgICAgICAga3ksXHJcbiAgICAgICAgICBhcnJheU9mUG9pbnRzXHJcbiAgICAgICAgKTtcclxuICAgICAgICBzaGFwZS5wdXNoKHVuaWdvbik7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBzaGFwZTtcclxufVxyXG5cclxuZnVuY3Rpb24gc3RvcmVTaGFwZXMoc2hhcGU6IFNoYXBlW10pOiBzdHJpbmcge1xyXG4gIHJldHVybiBKU09OLnN0cmluZ2lmeShzaGFwZSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhhbmRsZURvd25sb2FkKHRleHQ6IHN0cmluZyk6IHZvaWQge1xyXG4gIGNvbnN0IGRhdGEgPSBuZXcgRmlsZShbdGV4dF0sIFwic2hhcGVzLmpzb25cIiwgeyB0eXBlOiBcImFwcGxpY2F0aW9uL2pzb25cIiB9KTtcclxuXHJcbiAgY29uc3QgdXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChkYXRhKTtcclxuXHJcbiAgY29uc3QgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xyXG4gIGEuaHJlZiA9IHVybDtcclxuICBhLmRvd25sb2FkID0gZGF0YS5uYW1lO1xyXG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYSk7XHJcbiAgYS5jbGljaygpO1xyXG4gIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoYSk7XHJcbiAgVVJMLnJldm9rZU9iamVjdFVSTCh1cmwpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBoYW5kbGVVcGxvYWQoY2FsbGJhY2s6ICh0ZXh0OiBzdHJpbmcpID0+IHZvaWQpOiB2b2lkIHtcclxuICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICBpbnB1dC50eXBlID0gXCJmaWxlXCI7XHJcbiAgaW5wdXQuYWNjZXB0ID0gXCJhcHBsaWNhdGlvbi9qc29uXCI7XHJcblxyXG4gIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKCkgPT4ge1xyXG4gICAgY29uc3QgZmlsZSA9IGlucHV0LmZpbGVzWzBdO1xyXG4gICAgY29uc3QgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuXHJcbiAgICByZWFkZXIub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICBjYWxsYmFjayhyZWFkZXIucmVzdWx0IGFzIHN0cmluZyk7XHJcbiAgICB9O1xyXG4gICAgcmVhZGVyLnJlYWRBc1RleHQoZmlsZSk7XHJcbiAgfSk7XHJcblxyXG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaW5wdXQpO1xyXG4gIGlucHV0LmNsaWNrKCk7XHJcbiAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChpbnB1dCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVuaW9uKFxyXG4gIG9iamVjdDE6IFNoYXBlICYgUmVuZGVyYWJsZSAmIFRyYW5zZm9ybWFibGUsXHJcbiAgb2JqZWN0MjogU2hhcGUgJiBSZW5kZXJhYmxlICYgVHJhbnNmb3JtYWJsZVxyXG4pIHtcclxuICBjdXJyZW50T2JqZWN0ID0gbmV3IFVuaWdvbihzaGFwZXMubGVuZ3RoLCBvYmplY3QxLmFycmF5T2ZQb2ludHNbMF0pO1xyXG5cclxuICBjdXJyZW50T2JqZWN0LmFycmF5T2ZQb2ludHMgPSBbXTtcclxuICBjb25zdCBtYXRyaXgxID0gVHJhbnNmb3JtYXRpb24udHJhbnNmb3JtYXRpb25NYXRyaXhXaXRob3V0UHJvamVjdGlvbihcclxuICAgIGdsLmNhbnZhcy53aWR0aCxcclxuICAgIGdsLmNhbnZhcy5oZWlnaHQsXHJcbiAgICBvYmplY3QxLnR4LFxyXG4gICAgb2JqZWN0MS50eSxcclxuICAgIG9iamVjdDEuZGVncmVlLFxyXG4gICAgb2JqZWN0MS5zeCxcclxuICAgIG9iamVjdDEuc3ksXHJcbiAgICBvYmplY3QxLmt4LFxyXG4gICAgb2JqZWN0MS5reSxcclxuICAgIG9iamVjdDEuY2VudGVyXHJcbiAgKTtcclxuICBjb25zdCBtYXRyaXgyID0gVHJhbnNmb3JtYXRpb24udHJhbnNmb3JtYXRpb25NYXRyaXhXaXRob3V0UHJvamVjdGlvbihcclxuICAgIGdsLmNhbnZhcy53aWR0aCxcclxuICAgIGdsLmNhbnZhcy5oZWlnaHQsXHJcbiAgICBvYmplY3QyLnR4LFxyXG4gICAgb2JqZWN0Mi50eSxcclxuICAgIG9iamVjdDIuZGVncmVlLFxyXG4gICAgb2JqZWN0Mi5zeCxcclxuICAgIG9iamVjdDIuc3ksXHJcbiAgICBvYmplY3QyLmt4LFxyXG4gICAgb2JqZWN0Mi5reSxcclxuICAgIG9iamVjdDIuY2VudGVyXHJcbiAgKTtcclxuXHJcbiAgZm9yIChjb25zdCBwb2ludCBvZiBvYmplY3QxLmFycmF5T2ZQb2ludHMpIHtcclxuICAgIGNvbnN0IG5ld1BvaW50ID0gbWF0cml4MS5tdWx0aXBseVBvaW50KHBvaW50KTtcclxuICAgIGN1cnJlbnRPYmplY3QuYXJyYXlPZlBvaW50cy5wdXNoKG5ld1BvaW50KTtcclxuICB9XHJcblxyXG4gIGZvciAoY29uc3QgcG9pbnQgb2Ygb2JqZWN0Mi5hcnJheU9mUG9pbnRzKSB7XHJcbiAgICBjb25zdCBuZXdQb2ludCA9IG1hdHJpeDIubXVsdGlwbHlQb2ludChwb2ludCk7XHJcbiAgICBjdXJyZW50T2JqZWN0LmFycmF5T2ZQb2ludHMucHVzaChuZXdQb2ludCk7XHJcbiAgfVxyXG5cclxuICAoY3VycmVudE9iamVjdCBhcyBVbmlnb24pLnNldFVuaWdvbkF0dHJpYnV0ZXMoXHJcbiAgICAwLFxyXG4gICAgMCxcclxuICAgIDAsXHJcbiAgICAxLFxyXG4gICAgMSxcclxuICAgIDAsXHJcbiAgICAwLFxyXG4gICAgY3VycmVudE9iamVjdC5hcnJheU9mUG9pbnRzXHJcbiAgKTtcclxuICBzaGFwZXMucHVzaChjdXJyZW50T2JqZWN0KTtcclxuXHJcbiAgc2V0dXBPcHRpb24odHJ1ZSwgY3VycmVudE9iamVjdCk7XHJcblxyXG4gIHJlbmRlckFsbChnbCwgcHJvZ3JhbUluZm8sIHNoYXBlcywgcG9zaXRpb25CdWZmZXIsIGNvbG9yQnVmZmVyKTtcclxufVxyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=