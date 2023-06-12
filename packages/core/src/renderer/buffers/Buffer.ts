import { BufferType } from '../../types';

export class Buffer {
  constructor(
    public readonly data: ArrayBuffer,
    public readonly byteLength: number,
    public readonly byteOffest: number = 0,
    public readonly target = BufferType.ARRAY_BUFFER
  ) {}
}
