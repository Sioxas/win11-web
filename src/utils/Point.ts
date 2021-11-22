export default class Point {
  constructor(public x: number, public y: number) { }
  static add(a: Point, b: Point) {
    return new Point(a.x + b.x, a.y + b.y);
  }
  static subtract(a: Point, b: Point) {
    return new Point(a.x - b.x, a.y - b.y);
  }
  static multiply(a: Point, b: Point) {
    return new Point(a.x * b.x, a.y * b.y);
  }
  static divide(a: Point, b: Point) {
    return new Point(a.x / b.x, a.y / b.y);
  }
  static equals(a: Point, b: Point) {
    return a.x == b.x && a.y == b.y;
  }
  static distance(a: Point, b: Point) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
  }
  static angle(a: Point, b: Point) {
    return Math.atan2(b.y - a.y, b.x - a.x);
  }
  static angleBetween(a: Point, b: Point, c: Point) {
    return Math.acos(Point.dot(Point.subtract(b, a), Point.subtract(c, a)) / (Point.distance(a, b) * Point.distance(a, c)));
  }
  static dot(a: Point, b: Point) {
    return a.x * b.x + a.y * b.y;
  }
  static cross(a: Point, b: Point) {
    return a.x * b.y - a.y * b.x;
  }
  static crossRatio(a: Point, b: Point) {
    return (a.x * b.y - a.y * b.x) / (Point.distance(a, b) * Point.distance(a, b));
  }
  static rotate(a: Point, angle: number) {
    return new Point(a.x * Math.cos(angle) - a.y * Math.sin(angle), a.x * Math.sin(angle) + a.y * Math.cos(angle));
  }
  static rotateAround(a: Point, b: Point, angle: number) {
    return Point.add(Point.subtract(a, b), Point.rotate(Point.subtract(b, a), angle));
  }
  static scale(a: Point, b: Point) {
    return new Point(a.x * b.x, a.y * b.y);
  }
  static scaleAround(a: Point, b: Point, c: Point) {
    return Point.add(Point.subtract(a, b), Point.scale(Point.subtract(b, a), c));
  }
  static reflect(a: Point, b: Point) {
    return new Point(a.x - 2 * Point.dot(a, b) / Point.dot(b, b) * b.x, a.y - 2 * Point.dot(a, b) / Point.dot(b, b) * b.y);
  }
  static reflectAround(a: Point, b: Point, c: Point) {
    return Point.add(Point.subtract(a, b), Point.reflect(Point.subtract(b, a), c));
  }
}
