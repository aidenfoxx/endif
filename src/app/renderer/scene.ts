import { Camera } from '../../core/entities/camera';
import { mat4Invert, mat4Multiply, mat4Transpose } from '../../core/utils/math';
import { ShaderRef } from '../assets/shader';
import { Actor } from './actor';
import { Prop } from './prop';

export interface Scene {
  readonly camera: Camera;
  readonly actors: ReadonlySet<Actor>;
  readonly renderQueue: ReadonlyMap<ShaderRef, ReadonlyMap<Prop, Actor[]>>;
  readonly frustumCulling: boolean;
}

function generateRenderQueue(actors: ReadonlySet<Actor>, camera?: Camera): ReadonlyMap<ShaderRef, ReadonlyMap<Prop, Actor[]>> {
  const renderQueue: Map<ShaderRef, Map<Prop, Actor[]>> = new Map();

  for (const actor of actors) {
    if (camera) {
      // TODO: Add frustum culling
    }

    const prop = actor.prop;
    const shadersRefs = prop.shaderRefs;

    for (let i = 0; i < shadersRefs.length; i++) {
      const shaderRef = shadersRefs[i];

      if (!renderQueue.get(shaderRef)) {
        renderQueue.set(shaderRef, new Map());
      }

      if (!renderQueue.get(shaderRef)!.get(prop)) {
        renderQueue.get(shaderRef)!.set(prop, []);
      }

      renderQueue.get(shaderRef)!.get(prop)!.push(actor);
    }
  }

  return renderQueue;
}

export function sceneInit(camera: Camera, frustumCulling: boolean = false): Scene {
  return {
    camera,
    actors: new Set(),
    renderQueue: new Map(),
    frustumCulling
  };
}

export function sceneSetCamera(scene: Scene, camera: Camera): Scene {
  return {
    ...scene,
    camera,
    renderQueue: scene.frustumCulling ? generateRenderQueue(scene.actors, camera) : scene.renderQueue
  };
}

export function sceneAddActor(scene: Scene, actor: Actor): Scene {
  const nextActors = new Set(scene.actors);
  nextActors.add(actor);

  return {
    ...scene,
    actors: nextActors,
    renderQueue: generateRenderQueue(nextActors, scene.frustumCulling ? scene.camera : undefined)
  };
}

export function sceneRemoveActor(scene: Scene, actor: Actor): Scene {
  const nextActors = new Set(scene.actors);
  nextActors.delete(actor);

  return {
    ...scene,
    actors: nextActors,
    renderQueue: generateRenderQueue(nextActors, scene.frustumCulling ? scene.camera : undefined)
  };
}

export function sceneRender(gl: WebGL2RenderingContext, scene: Scene): void {
  for (const [shaderRef, props] of scene.renderQueue) {
    const shader = shaderRef.program;

    gl.useProgram(shader);

    // Bind projection matrix
    const projectionLocation = gl.getUniformLocation(shader, 'projection');
    gl.uniformMatrix4fv(projectionLocation, false, new Float32Array(scene.camera.projection));

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

      for (let i = 0; i < actors.length; i++) {
        const actor = actors[i];

        // Bind position matrices
        const modelView = mat4Multiply(scene.camera.view, actor.model);
        const modelViewLocation = gl.getUniformLocation(shader, 'modelView');
        gl.uniformMatrix4fv(modelViewLocation, false, new Float32Array(modelView));

        const normalMatrix = mat4Transpose(mat4Invert(modelView));
        const normalMatrixLocation = gl.getUniformLocation(shader, 'normalMatrix');
        gl.uniformMatrix4fv(normalMatrixLocation, false, new Float32Array(normalMatrix));

        // Render
        gl.drawElements(gl.TRIANGLES, meshRef.mesh.indices.length, gl.UNSIGNED_SHORT, 0);
      }
    }
  }
}
