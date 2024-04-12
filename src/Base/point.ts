import Coordinate from "Base/coordinate";

class Point  extends Coordinate {
    public r: number;
    public g: number;
    public b: number;
    public a: number;

    public constructor(position: [number, number], color: [number, number, number, number] = [0, 0, 0, 1]) {
        super(...position, 1);

        [this.r, this.g, this.b, this.a] = color;

        const [r, g, b, a] = color;
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    public getPair(): [number, number] {
        return [this.x, this.y];
    }

    public getColor(): [number, number, number, number] {
        return [this.r, this.g, this.b, this.a];
    }

    public setColor(color: [number, number, number, number]): void {
        const [r, g, b, a] = color;
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
}

export default Point;