import { DataType } from "../../types";

export class DataBuffer {
  constructor(
    public readonly buffer: ArrayBuffer,
    public readonly count: number,
    public readonly dataType: DataType,
    public readonly byteStride: number = 0,
    public readonly byteOffest: number = 0,
    public readonly normalized: boolean = false
  ) {}
}