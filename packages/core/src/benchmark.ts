type Vec3 = [number, number, number];

type Vec4 = [number, number, number, number];

type Mat4 = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number
];

type AABB = [Vec3, Vec3];

function vec3Add(vec1: Vec3, vec2: Vec3): Vec3 {
  return [vec1[0] + vec2[0], vec1[1] + vec2[1], vec1[2] + vec2[2]];
}

function vec3Subtract(vec1: Vec3, vec2: Vec3): Vec3 {
  return [vec1[0] - vec2[0], vec1[1] - vec2[1], vec1[2] - vec2[2]];
}

function vec3Multiply(vec1: Vec3, vec2: Vec3): Vec3 {
  return [vec1[0] * vec2[0], vec1[1] * vec2[1], vec1[2] * vec2[2]];
}

function vec4Multiply(vec1: Vec4, vec2: Vec4): Vec4 {
  return [vec1[0] * vec2[0], vec1[1] * vec2[1], vec1[2] * vec2[2], vec1[3] * vec2[3]];
}

function vec4Normalize(vec: Vec4): Vec4 {
  const result: Vec4 = [0, 0, 0, 0];
  const length = Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1] + vec[2] * vec[2] + vec[3] * vec[3]);

  if (!length) {
    return result;
  }

  const factor = 1 / length;

  return vec4Multiply(vec, [factor, factor, factor, factor]);
}

function vec3MultiplyMat4(vec: Vec3, mat: Mat4): Vec3 {
  return [
    vec[0] * mat[0] + vec[1] * mat[4] + vec[2] * mat[8],
    vec[0] * mat[1] + vec[1] * mat[5] + vec[2] * mat[9],
    vec[0] * mat[2] + vec[1] * mat[6] + vec[2] * mat[10],
  ];
}

function vec4MultiplyMat4(vec: Vec4, mat: Mat4): Vec4 {
  return [
    vec[0] * mat[0] + vec[1] * mat[4] + vec[2] * mat[8] + vec[3] * mat[12],
    vec[0] * mat[1] + vec[1] * mat[5] + vec[2] * mat[9] + vec[3] * mat[13],
    vec[0] * mat[2] + vec[1] * mat[6] + vec[2] * mat[10] + vec[3] * mat[14],
    vec[0] * mat[3] + vec[1] * mat[7] + vec[2] * mat[11] + vec[3] * mat[15],
  ];
}

function mat4Empty(): Mat4 {
  return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
}

function mat4Identity(): Mat4 {
  return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
}

function mat4Translation(translation: Vec3): Mat4 {
  return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, translation[0], translation[1], translation[2], 1];
}

function mat4Scale(scale: Vec3): Mat4 {
  return [scale[0], 0, 0, 0, 0, scale[1], 0, 0, 0, 0, scale[2], 0, 0, 0, 0, 1];
}

function mat4RotationQuat(quat: Vec4): Mat4 {
  const normalized = vec4Normalize(quat);

  const mulXX = normalized[0] * normalized[0];
  const mulXY = normalized[0] * normalized[1];
  const mulXZ = normalized[0] * normalized[2];
  const mulXW = normalized[0] * normalized[3];

  const mulYY = normalized[1] * normalized[1];
  const mulYZ = normalized[1] * normalized[2];
  const mulYW = normalized[1] * normalized[3];

  const mulZZ = normalized[2] * normalized[2];
  const mulZW = normalized[2] * normalized[3];

  const xx = 1 - 2 * (mulYY + mulZZ);
  const xy = 2 * (mulXY - mulZW);
  const xz = 2 * (mulXZ + mulYW);

  const yx = 2 * (mulXY + mulZW);
  const yy = 1 - 2 * (mulXX + mulZZ);
  const yz = 2 * (mulYZ - mulXW);

  const zx = 2 * (mulXZ - mulYW);
  const zy = 2 * (mulYZ + mulXW);
  const zz = 1 - 2 * (mulXX + mulYY);

  return [xx, yx, zx, 0, xy, yy, zy, 0, xz, yz, zz, 0, 0, 0, 0, 1];
}

function mat4Multiply(mat1: Mat4, mat2: Mat4): Mat4 {
  return [
    mat1[0] * mat2[0] + mat1[4] * mat2[1] + mat1[8] * mat2[2] + mat1[12] * mat2[3],
    mat1[1] * mat2[0] + mat1[5] * mat2[1] + mat1[9] * mat2[2] + mat1[13] * mat2[3],
    mat1[2] * mat2[0] + mat1[6] * mat2[1] + mat1[10] * mat2[2] + mat1[14] * mat2[3],
    mat1[3] * mat2[0] + mat1[7] * mat2[1] + mat1[11] * mat2[2] + mat1[15] * mat2[3],
    mat1[0] * mat2[4] + mat1[4] * mat2[5] + mat1[8] * mat2[6] + mat1[12] * mat2[7],
    mat1[1] * mat2[4] + mat1[5] * mat2[5] + mat1[9] * mat2[6] + mat1[13] * mat2[7],
    mat1[2] * mat2[4] + mat1[6] * mat2[5] + mat1[10] * mat2[6] + mat1[14] * mat2[7],
    mat1[3] * mat2[4] + mat1[7] * mat2[5] + mat1[11] * mat2[6] + mat1[15] * mat2[7],
    mat1[0] * mat2[8] + mat1[4] * mat2[9] + mat1[8] * mat2[10] + mat1[12] * mat2[11],
    mat1[1] * mat2[8] + mat1[5] * mat2[9] + mat1[9] * mat2[10] + mat1[13] * mat2[11],
    mat1[2] * mat2[8] + mat1[6] * mat2[9] + mat1[10] * mat2[10] + mat1[14] * mat2[11],
    mat1[3] * mat2[8] + mat1[7] * mat2[9] + mat1[11] * mat2[10] + mat1[15] * mat2[11],
    mat1[0] * mat2[12] + mat1[4] * mat2[13] + mat1[8] * mat2[14] + mat1[12] * mat2[15],
    mat1[1] * mat2[12] + mat1[5] * mat2[13] + mat1[9] * mat2[14] + mat1[13] * mat2[15],
    mat1[2] * mat2[12] + mat1[6] * mat2[13] + mat1[10] * mat2[14] + mat1[14] * mat2[15],
    mat1[3] * mat2[12] + mat1[7] * mat2[13] + mat1[11] * mat2[14] + mat1[15] * mat2[15],
  ];
}

function mat4Perspective(
  fov: number,
  aspectRatio: number,
  nearClip: number,
  farClip: number
): Mat4 {
  const cotan = 1 / Math.tan(fov / 2);

  const xx = cotan / aspectRatio;
  const yy = cotan;
  const zz = (farClip + nearClip) / (nearClip - farClip);
  const zw = (2 * farClip * nearClip) / (nearClip - farClip);
  const wz = -1;

  return [xx, 0, 0, 0, 0, yy, 0, 0, 0, 0, zz, wz, 0, 0, zw, 0];
}

function aabbCalculate(vertices: Array<number>): AABB {
  let minX = 0;
  let minY = 0;
  let minZ = 0;

  let maxX = 0;
  let maxY = 0;
  let maxZ = 0;

  for (let i = 0; i < vertices.length; i += 3) {
    minX = Math.min(minX, vertices[i]);
    minY = Math.min(minY, vertices[i + 1]);
    minZ = Math.min(minZ, vertices[i + 2]);

    maxX = Math.max(maxX, vertices[i]);
    maxY = Math.max(maxY, vertices[i + 1]);
    maxZ = Math.max(maxZ, vertices[i + 2]);
  }

  return [
    [minX, minY, minZ],
    [maxX, maxY, maxZ],
  ];
}

function aabbTransform(aabb: AABB, transform: Mat4): AABB {
  const center = vec3Multiply(vec3Add(aabb[0], aabb[1]), [0.5, 0.5, 0.5]);
  const extents = vec3Subtract(aabb[1], center);

  const nextCenter = vec4MultiplyMat4([...center, 1.0], transform);
  const nextExtents = vec3MultiplyMat4(extents, transform);

  const min = vec3Subtract([nextCenter[0], nextCenter[1], nextCenter[2]], nextExtents);
  const max = vec3Add([nextCenter[0], nextCenter[1], nextCenter[2]], nextExtents);

  return [min, max];
}

abstract class Observable {
  private static uniqueID = 0;

  public stateID = Observable.uniqueID++;

  public watch(target: any, property: PropertyKey): void {
    let propertyRef: any = target[property];

    Object.defineProperty(target, property, {
      get: function () { return propertyRef; },
      set: function (value) {        
        propertyRef = value;
        this.stateID = Observable.uniqueID++;
      }
    });
  }
}

abstract class Camera extends Observable {
  private matrix: Mat4 = mat4Identity();
  private matrixStateID: number = 0;

  constructor(
    public translation: Vec3 = [0, 0, 0],
    public rotation: Vec4 = [0, 0, 0, 1]
  ) {
    super();
    
    this.watch(this, 'translation');
    this.watch(this, 'rotation');
  }

  public calculateMatrix(): Mat4 {
    if (this.stateID !== this.matrixStateID) {
      this.matrix = mat4Multiply(
        mat4Translation(this.translation),
        mat4RotationQuat(this.rotation)
      );
    }

    return this.matrix;
  }

  public abstract calculateProjection(): Mat4;
}

class PerspectiveCamera extends Camera {
  private projection: Mat4 = mat4Empty();
  private projectionStateID: number = 0;

  constructor(
    public fov: number,
    public aspectRatio: number,
    public nearClip: number,
    public farClip: number,
    public translation: Vec3 = [0, 0, 0],
    public rotation: Vec4 = [0, 0, 0, 1]
  ) {
    super(translation, rotation);

    this.watch(this, 'fov');
    this.watch(this, 'aspectRatio');
    this.watch(this, 'nearClip');
    this.watch(this, 'farClip');
  }

  public calculateProjection(): Mat4 {
    if (this.stateID !== this.projectionStateID) {
      this.projection = mat4Perspective(
        this.fov,
        this.aspectRatio,
        this.nearClip,
        this.farClip
      );
      this.projectionStateID = this.stateID;
    }

    return this.projection;
  }
}

class Scene {
  public readonly meshes: Map<PropertyKey, Mesh> = new Map();
  public readonly cameras: Map<PropertyKey, Camera> = new Map();

  constructor() {}
}

class Mesh extends Observable {
  public readonly primitives: Map<PropertyKey, MeshPrimitive> = new Map();

  private matrix: Mat4 = mat4Identity();
  private matrixStateID: number = 0;

  constructor(
    public translation: Vec3 = [0, 0, 0],
    public rotation: Vec4 = [0, 0, 0, 1],
    public scale: Vec3 = [1, 1, 1]
  ) {
    super();

    this.watch(this, 'translation');
    this.watch(this, 'rotation');
    this.watch(this, 'scale');
  }

  public calculateMatrix(): Mat4 {
    if (this.stateID !== this.matrixStateID) {
      this.matrix = mat4Multiply(
        mat4Multiply(
          mat4Translation(this.translation),
          mat4RotationQuat(this.rotation)
        ),
        mat4Scale(this.scale)
      );
      this.matrixStateID = this.stateID;
    }

    return this.matrix;
  }
}

enum BufferKey {
  POSITION,
  NORMAL,
  TEXTCOORD_0,
  TEXTCOORD_1,
  TEXTCOORD_2,
  TEXTCOORD_3,
  INDEX
}

interface MeshBuffers {
  [BufferKey.POSITION]: ArrayBuffer;
}

class MeshPrimitive extends Observable {
  private aabb: AABB = [[0, 0, 0], [0, 0, 0]];
  private aabbStateID = 0;

  constructor(public readonly buffers: MeshBuffers) {
    super(); 

    this.buffers = { ...buffers };

    this.watch(this.buffers, BufferKey.POSITION);
  }

  public calculateAABB(): AABB {
    if (this.stateID !== this.aabbStateID) {
      const bufferView = this.buffers[BufferKey.POSITION];
      // TODO: This needs to support other data types
      const positionData = new Float32Array(bufferView)

      this.aabb = aabbCalculate(Array.from(positionData));
      this.aabbStateID = this.stateID;
    }

    return this.aabb;
  }
}

interface CacheRecord {
  value: any;
  stateID: number;
  refs: number;
}

class Renderer {
  private sceneCache: Map<Scene, WeakMap<any, CacheRecord>> = new Map();

  public renderScene(scene: Scene, camera: Camera): boolean {
    let sceneCache = this.sceneCache.get(scene);

    if (!sceneCache) {
      sceneCache = new WeakMap();
      this.sceneCache.set(scene, sceneCache);
    }

    const hasCameraChanged = this.hasRecordChaned(camera, sceneCache); // TODO: I think the cache checks will be less performant than just culling

    for (const [_, mesh] of scene.meshes) {
      const hasMeshChanged = this.hasRecordChaned(mesh, sceneCache);

      for (const [_, primitive] of mesh.primitives) {
        const hasPrimitiveChanged = this.hasRecordChaned(primitive, sceneCache);
        const hasChanged = hasCameraChanged || hasMeshChanged || hasPrimitiveChanged;

        // TODO: This is useless. Just because we know it's not changed, we don't know if it should be culled!!
        if (hasChanged && !this.shouldRenderPrimitive(camera, mesh, primitive)) {
        //if (!this.shouldCullPrimative(camera, mesh, primitive)) {
          //console.log('Should cull');
          return true;
        } else {
          //console.log('Should not cull');
          return false;
        }
      }
    }

    return false;
  }

  // TODO: The Primitive cache will clash with the VAO cache
  private hasRecordChaned(key: Observable, sceneCache: WeakMap<any, CacheRecord>): boolean {    
    const cameraRecord = sceneCache.get(key);

    if (!cameraRecord) {
      sceneCache.set(key, { value: null, stateID: key.stateID, refs: -1 });
      return true;
    } else if (key.stateID !== cameraRecord.stateID) {
      cameraRecord.stateID = key.stateID;
      return true;
    }

    return false;
  }

  private shouldRenderPrimitive(
    camera: Camera,
    mesh: Mesh,
    primitive: MeshPrimitive
  ): boolean {
    const output = [];

    output.push(aabbTransform(primitive.calculateAABB(), mesh.calculateMatrix()));
    output.push(aabbTransform(primitive.calculateAABB(), mesh.calculateMatrix()));
    output.push(aabbTransform(primitive.calculateAABB(), mesh.calculateMatrix()));
    output.push(aabbTransform(primitive.calculateAABB(), mesh.calculateMatrix()));
    output.push(aabbTransform(primitive.calculateAABB(), mesh.calculateMatrix()));

    return output.length === 4;
  }
}

(() => {
  const positions = new Float32Array([
    -1.0, -1.0, 1.0,
    -1.0, -1.0, -1.0,
    1.0, -1.0, -1.0,
    1.0, -1.0, 1.0,
    -1.0, 1.0, 1.0,
    1.0, 1.0, 1.0,
    1.0, 1.0, -1.0,
    -1.0, 1.0, -1.0
  ]).buffer;

  const primitive = new MeshPrimitive({ [BufferKey.POSITION]: positions });

  const mesh = new Mesh();
  mesh.primitives.set('default', primitive);

  const scene = new Scene();
  scene.meshes.set('default', mesh);

  const camera = new PerspectiveCamera(1.5, 1.5, .1, 1000);

  const renderer = new Renderer();

  console.time('debug');

  for (let i = 0; i < 1000000; i++) {
    if (i % 5 === 0) {
      camera.fov = 2;
    }
    
    if (i % 10 === 0) {
      mesh.translation = [1, 2, 3];
    }

    renderer.renderScene(scene, camera);
  }

  console.timeEnd('debug');
})();
