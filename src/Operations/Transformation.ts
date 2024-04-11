import Matrix from "Main/Base/matrix";
import Point from "Main/Base/point";


class Transformation{
    public static projection(width: number, height: number): Matrix {
        const matrix = new Matrix([2/width, 0, 0], [0, -2/height, 0], [-1, 1, 1]);
        return matrix;
    }
    public static translation(tx: number, ty: number): Matrix {
        const matrix = new Matrix([1,0,0], [0, 1, 0], [tx, ty, 1]);
        return matrix;
    }
    public static rotation(degree: number): Matrix {
        const matrix = new Matrix([Math.cos(degree), Math.sin(degree), 0], [-Math.sin(degree), Math.cos(degree), 0], [0, 0, 1]);
        return matrix;
    }
    public static scale(sx: number, sy: number): Matrix {
        const matrix = new Matrix([sx,0,0], [0, sy, 0], [0, 0, 1]);
        return matrix
    }
    public static shearX(kx: number): Matrix {
        const matrix = new Matrix([1, 0, 0], [kx, 1, 0], [0, 0, 1]);
        return matrix;
    }
    public static shearY(ky: number): Matrix {
        const matrix = new Matrix([1, ky, 0], [0, 1, 0], [0, 0, 1]);
        return matrix;
    }
    public static transformationMatrix(
        width: number,
        height: number,
        tx: number,
        ty: number,
        degree: number,
        sx: number,
        sy: number,
        kx: number,
        ky: number,
        center: Point
    ) : Matrix {
        return Transformation.projection(width, height)
        .multiplyMatrix(Transformation.translation(tx, ty))
        .multiplyMatrix(Transformation.translation(center.getX(), center.getY()))
        .multiplyMatrix(Transformation.rotation(degree))
        .multiplyMatrix(Transformation.scale(sx, sy))
        .multiplyMatrix(Transformation.shearX(kx))
        .multiplyMatrix(Transformation.shearY(ky))
        .multiplyMatrix(Transformation.translation(-center.getX(), -center.getY()));
    }

    public static inverseTransformationMatrix(
        width: number,
        height: number,
        tx: number,
        ty: number,
        degree: number,
        sx: number,
        sy: number,
        kx: number,
        ky: number,
        center: Point
    ) : Matrix {
        return Transformation.translation(center.getX(), center.getY())
        .multiplyMatrix(Transformation.shearY(-ky))
        .multiplyMatrix(Transformation.shearX(-kx))
        .multiplyMatrix(Transformation.scale(1 / sx, 1 / sy))
        .multiplyMatrix(Transformation.rotation(-degree))
        .multiplyMatrix(Transformation.translation(-center.getX(), -center.getY()))
        .multiplyMatrix(Transformation.translation(-tx, -ty))
        // .multiplyMatrix(Transformation.projection(1 / width, 1 / height));
    }

}
export default Transformation;