import Point from "Base/point";
import Type from "Shapes/type.enum";
abstract class Shape {
    public id: number;
    public numberOfVertices: number;
    public type: Type;
    public arrayOfPoints: Point[];

    public constructor(id: number, numberOfVertices: number, type: Type){
        this.id = id;
        this.numberOfVertices = numberOfVertices;
        this.type = type;
    }

    public abstract getCenter(): Point;
    public abstract isDrawable(): boolean;
    public abstract draw(point: Point): void;
}

export default Shape;