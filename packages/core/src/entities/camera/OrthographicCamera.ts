import { mat4Orthographic } from "../../utils/math";
import { Camera } from "./Camera";

export class OrthographicCamera extends Camera {
  constructor(
    public readonly left: number,
    public readonly right: number,
    public readonly top: number,
    public readonly bottom: number,
    public readonly nearClip: number,
    public readonly farClip: number
  ) {
    super(mat4Orthographic(left, right, top, bottom, nearClip, farClip));
  }
}
