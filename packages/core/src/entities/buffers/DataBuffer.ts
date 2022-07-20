export class DataBuffer {
  constructor(
    public readonly buffer: ArrayBuffer,
    public readonly count: number,
    public readonly byteOffest: number = 0,
    public readonly stride: number = 3,
    public readonly normalized: boolean = false
  ) {}
}