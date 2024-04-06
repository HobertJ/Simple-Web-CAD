class Coordinate {
    public x: number;
    public y: number;
    public w: number;

    public constructor(x: number, y: number, w: number) {
        this.x = x;
        this.y = y;
        this.w = w;
    }

    public getCoordinate(): [number, number, number] {
        return [this.x, this.y, this.w];
    }

    public setCoordinate(x: number, y: number, w: number): void {
        this.x = x;
        this.y = y;
        this.w = w;
    }

    public setX(x: number): void {
        this.x = x;
    }

    public setY(y: number): void {
        this.y = y;
    }

    public setW(w: number): void {
        this.w = w;
    }
    
    public getX(): number {
        return this.x;
    }

    public getY(): number {
        return this.y;
    }

    public getW(): number {
        return this.w;
    }
}

export default Coordinate;