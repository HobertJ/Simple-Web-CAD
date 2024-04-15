import Point from "Base/point"
import orientation from "./orientation";

function convexHull(points: Point[]): Point[] {
    const n = points.length;
    if (n < 3) return [];

    const hull: Point[] = [];
    let l = 0;
    for (let i = 1; i < n; i++) {
        if (points[i].x < points[l].x) {
            l = i;
        }
    }

    let p = l;
    let q: number;
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

export default convexHull;

