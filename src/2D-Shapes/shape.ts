import Point from "../Base/point";

abstract class Shape {
    public id: number;
    public numberOfVertices: number;
    public type: Type;

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