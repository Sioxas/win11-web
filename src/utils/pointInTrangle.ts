import Point from "./Point";

// https://stackoverflow.com/a/2049593/9288031

function sign(p1: Point, p2: Point, p3: Point) {
  return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
}

export default function pointInTriangle(pt: Point, v1: Point, v2: Point, v3: Point) {
  let
    d1 = sign(pt, v1, v2),
    d2 = sign(pt, v2, v3),
    d3 = sign(pt, v3, v1),

    has_neg = (d1 < 0) || (d2 < 0) || (d3 < 0),
    has_pos = (d1 > 0) || (d2 > 0) || (d3 > 0);

  return !(has_neg && has_pos);
}
