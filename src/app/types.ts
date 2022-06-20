export interface RefCounter<Asset> {
  refs: number;
  resource: Asset;
}
