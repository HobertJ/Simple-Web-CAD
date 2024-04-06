import Point from "../../Base/point";

interface Transformable {
    center: Point;
    tx: number;
    ty: number;
    degree: number;
    sx: number;
    sy: number;
    kx: number;
    ky: number;
}

export default Transformable