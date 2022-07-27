import { DataType } from '../../types';
import { Buffer } from './Buffer';

export class BufferView {
  constructor(
    public readonly buffer: Buffer,
    public readonly count: number,
    public readonly type: DataType,
    public readonly byteStride: number = 1,
    public readonly byteOffest: number = 0,
    public readonly normalized: boolean = false,
  ) {}
}
