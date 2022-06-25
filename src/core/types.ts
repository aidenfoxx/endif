// Reference: https://www.growingwiththeweb.com/2020/10/typescript-readonly-typed-arrays.html
type TypedArrayMutableProperties = 'copyWithin' | 'fill' | 'reverse' | 'set' | 'sort';

declare interface ReadonlyUint8ClampedArray
  extends Omit<Uint8ClampedArray, TypedArrayMutableProperties> {
  readonly [n: number]: number;
}
declare interface ReadonlyUint8Array extends Omit<Uint8Array, TypedArrayMutableProperties> {
  readonly [n: number]: number;
}
declare interface ReadonlyUint16Array extends Omit<Uint16Array, TypedArrayMutableProperties> {
  readonly [n: number]: number;
}
declare interface ReadonlyUint32Array extends Omit<Uint32Array, TypedArrayMutableProperties> {
  readonly [n: number]: number;
}
declare interface ReadonlyInt8Array extends Omit<Int8Array, TypedArrayMutableProperties> {
  readonly [n: number]: number;
}
declare interface ReadonlyInt16Array extends Omit<Int16Array, TypedArrayMutableProperties> {
  readonly [n: number]: number;
}
declare interface ReadonlyInt32Array extends Omit<Int32Array, TypedArrayMutableProperties> {
  readonly [n: number]: number;
}
declare interface ReadonlyFloat32Array extends Omit<Float32Array, TypedArrayMutableProperties> {
  readonly [n: number]: number;
}
declare interface ReadonlyFloat64Array extends Omit<Float64Array, TypedArrayMutableProperties> {
  readonly [n: number]: number;
}
declare interface ReadonlyBigInt64Array extends Omit<BigInt64Array, TypedArrayMutableProperties> {
  readonly [n: number]: bigint;
}
declare interface ReadonlyBigUint64Array extends Omit<BigUint64Array, TypedArrayMutableProperties> {
  readonly [n: number]: bigint;
}
