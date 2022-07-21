import { mat4Perspective } from "../../utils/math";
import { Camera } from "./Camera";

export class PerspectiveCamera extends Camera {
  constructor(
    public readonly fov: number,
    public readonly aspectRatio: number,
    public readonly nearClip: number,
    public readonly farClip: number
  ) {
    super(mat4Perspective(fov, aspectRatio, nearClip, farClip));
  }
}
