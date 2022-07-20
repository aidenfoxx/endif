import { Scene } from "../entities/Scene";
import { Node } from "../entities/nodes/Node";
import { Mat4, mat4Multiply } from "../utils/math";
import { MeshNode } from "../entities/nodes/MeshNode";
import { createProgram } from "../utils/gl/shader";
import { Mesh } from "../entities/Mesh";
import { CameraNode } from "../entities/nodes/CameraNode";
export class Renderer {
  private gl: WebGL2RenderingContext;

  private sceneCache: WeakMap<Scene, Map<unknown, unknown>> = new Map();

  constructor(public readonly canvas: HTMLElement, options?: WebGLContextAttributes) {
    if (!(canvas instanceof HTMLCanvasElement)) {
      throw new Error('Invalid canvas element');
    }
    
    const gl = canvas.getContext('webgl2', options);
    
    if (!gl) {
      throw new Error('Unable to initialize WebGL context');
    }

    this.gl = gl;
  }

  public renderScene(scene: Scene) {
    if (!scene.activeCamera) {
      throw new Error('Scene must contain an active camera');
    }

    // Fetch cache container
    let sceneCache = this.sceneCache.get(scene);

    if (!sceneCache) {
      sceneCache = new Map();
      this.sceneCache.set(scene, sceneCache);
    }

    // Bind shader
    let program = sceneCache.get(shader) as WebGLProgram | undefined;

    if (!program) {
      program = createProgram(this.gl, shader.vertexSource, shader.fragmentSource);
      sceneCache.set(shader, program);
    }

    this.gl.useProgram(program);

    // Define render functions in body to inherit context
    const renderMesh = (mesh: Mesh) => {

    };

    const renderNode = (node: Node, matrix?: Mat4) => {
      const nodeMatrix = matrix ? mat4Multiply(node.matrix, matrix) : node.matrix;
  
      if (node instanceof CameraNode) {
        if (node.camera === scene.activeCamera) {
          const projectionLocation = this.gl.getUniformLocation(program, 'projection');
          this.gl.uniformMatrix4fv(projectionLocation, false, new Float32Array(scene.activeCamera.projection));
        }
      } else if (node instanceof MeshNode) {
        renderMesh(node.mesh);
      } 
  
      for (let i = 0; i < node.children.length; i++)  {
        renderNode(node.children[i], nodeMatrix);
      }
    };

    // Render nodes
    for (let i = 0; i < scene.nodes.length; i++)  {
      renderNode(scene.nodes[i]);
    }

    this.gl.useProgram(null);
  }


  private renderMesh(mesh: Mesh, sceneCache: Map<unknown, unknown>) {
    for (const [prop, actors] of props) {
      // Bind mesh
      const meshRef = prop.meshRef;
      gl.bindVertexArray(meshRef.vao);

      // Bind textures
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, prop.textureRefs.diffuseRef?.tbo ?? null);

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, prop.textureRefs.specularRef?.tbo ?? null);

      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, prop.textureRefs.roughnessRef?.tbo ?? null);

      gl.activeTexture(gl.TEXTURE3);
      gl.bindTexture(gl.TEXTURE_2D, prop.textureRefs.metallicRef?.tbo ?? null);

      gl.activeTexture(gl.TEXTURE4);
      gl.bindTexture(gl.TEXTURE_2D, prop.textureRefs.normalRef?.tbo ?? null);

      // TODO: Bind material

      for (let i = 0; i < actors.length; i++) {
        const actor = actors[i];

        // Bind position matrices
        const modelView = mat4Multiply(scene.camera.view, actor.model);
        const modelViewLocation = gl.getUniformLocation(shaderRef.program, 'modelView');
        gl.uniformMatrix4fv(modelViewLocation, false, new Float32Array(modelView));

        const normalMatrix = mat4Transpose(mat4Invert(modelView));
        const normalMatrixLocation = gl.getUniformLocation(shaderRef.program, 'normalMatrix');
        gl.uniformMatrix4fv(normalMatrixLocation, false, new Float32Array(normalMatrix));

        // Render
        gl.drawElements(gl.TRIANGLES, meshRef.indices.length, gl.UNSIGNED_SHORT, 0);
      }
    }
  }
}