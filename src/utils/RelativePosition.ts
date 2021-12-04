import { WindowPosition } from "@/core/enums";
import Point from "./Point";

export default class RelativePosition {
  constructor(
    public horizontal: WindowPosition, 
    public vertical: WindowPosition,
    public offset: Point = new Point(0, 0)
  ) {}
}
