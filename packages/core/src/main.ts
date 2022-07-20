import { DataBuffer } from "./entities/buffers/DataBuffer";
import { Material } from "./entities/Material";
import { Mesh } from "./entities/Mesh";
import { MeshPrimitive } from "./entities/MeshPrimitive";
import { MeshNode } from "./entities/nodes/MeshNode";
import { Scene } from "./entities/Scene";
import { Renderer } from "./renderer/Renderer";

const material = new Material();
material.diffuseFactor = [1, 0, 0, 1];

const positionBuffer = new DataBuffer(new Float32Array(), 123);
const mesh = new Mesh();
mesh.primitives.push(new MeshPrimitive(positionBuffer, undefined, undefined, undefined, material));

const scene = new Scene();
scene.nodes.push(new MeshNode(mesh));

const renderer = new Renderer(document.getElementById('canvas')!);
renderer.renderScene(scene);