interface GLTFFormat {
    accessors?: {
      bufferView?: number;
      byteOffset?: number;
      componentType?: number;
      normalized?: boolean;
      count?: number;
      type?: string;
    }[];
    asset?: {
      version?: number;
    };
    buffers?: {
      uri?: string;
      byteLength?: number;
    };
    bufferViews?: {
      buffer?: number;
      byteOffset?: number;
      byteLength?: number;
      byteStride?: number;
      target?: number;
    }[];
    cameras?: {
      orthographic?: {
        xmag?: number;
        ymag?: number;
        zfar?: number;
        znear?: number;
      };
      perspective?: {
        aspectRatio?: number;
        yfov?: number;
        zfar?: number;
        znear?: number;
      };
      type?: 'perspective' | 'orthographic';
      name?: string;
    }[];
    images?: {
      uri?: string;
      mimeType?: string;
      bufferView?: number;
    }[];
    materials?: {
      pbrMetallicRoughness?: {
        baseColorFactor?: [
          number | undefined,
          number | undefined,
          number | undefined,
          number | undefined,
        ];
        baseColorTexture?: {
          index?: number;
          texCoord?: number;
        };
        metallicFactor?: number;
        roughnessFactor?: number;
        metallicRoughnessTexture?: {
          index?: number;
          texCoord?: number;
        };
      };
      normalTexture?: {
        index?: number;
        texCoord?: number;
        scale?: number;
      };
      occlusionTexture?: {
        index?: number;
        texCoord?: number;
        strength?: number;
      };
      emissiveTexture?: {
        index?: number;
        texCoord?: number;
      };
      emissiveFactor?: [number | undefined, number | undefined, number | undefined];
      alphaMode?: 'OPAQUE' | 'MASK' | 'BLEND';
      alphaCutoff?: number;
      doubleSided?: number;
    }[];
    meshes?: {
      primitive?: {
        attributes?: {
          NORMAL?: number;
          POSITION?: number;
          TEXCOORD_0?: number;
          TEXCOORD_1?: number;
          TEXCOORD_2?: number;
          TEXCOORD_3?: number;
        };
        indices?: number;
        material?: number;
        mode?: number;
      }[],
      name?: string;
    }[];
    nodes?: {
      camera?: number;
      children?: number[];
      matrix?: number;
      mesh?: number;
      rotation?: [number | undefined, number | undefined, number | undefined, number | undefined];
      scale?: [number | undefined, number | undefined, number | undefined];
      translation?: [number | undefined, number | undefined, number | undefined];
    }[];
    samplers?: {
      magFilter?: number;
      minFilter?: number;
      wrapS?: number;
      wrapT?: number;
    }[];
    scenes?: {
      nodes?: number[];
      name?: string;
    }[];
    textures?: {
      sampler?: number;
      source?: number;
    }[];
  }