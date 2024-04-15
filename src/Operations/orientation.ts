import Point from "Base/point"

function orientation(p: Point, q: Point, r: Point): number {
    const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);

    if (val === 0) return 0;

    return val > 0 ? 1 : 2;
}

export default orientation;