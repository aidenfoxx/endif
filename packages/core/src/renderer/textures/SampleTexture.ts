import { Texture } from './Texture';

const textureSource = await createImageBitmap(
  new Blob([
    new Uint8Array([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44,
      0x52, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x00, 0x08, 0x06, 0x00, 0x00, 0x00, 0x5c,
      0x72, 0xa8, 0x66, 0x00, 0x00, 0x0e, 0xa9, 0x49, 0x44, 0x41, 0x54, 0x78, 0x5e, 0xed, 0xdd,
      0xb1, 0xab, 0x15, 0xc7, 0x1b, 0xc6, 0xf1, 0xb5, 0x09, 0x89, 0x90, 0x10, 0x03, 0x0a, 0x42,
      0x6e, 0x15, 0x4c, 0x1f, 0xb1, 0x0c, 0x29, 0xf4, 0x0f, 0x10, 0x2b, 0x85, 0x94, 0x29, 0x2c,
      0x84, 0x54, 0xf9, 0x33, 0xac, 0x04, 0x8b, 0x14, 0xc1, 0x4a, 0xf0, 0x56, 0x92, 0x14, 0x82,
      0x85, 0x01, 0x6b, 0x45, 0xb1, 0x52, 0x0c, 0xa9, 0x0c, 0x0a, 0x8a, 0x26, 0x10, 0x82, 0x76,
      0x37, 0x99, 0xfd, 0xfd, 0xe6, 0x32, 0x59, 0xcf, 0xb9, 0x77, 0xef, 0x4c, 0xcc, 0xe4, 0x75,
      0x3f, 0xa7, 0xf2, 0x7a, 0x76, 0xce, 0xce, 0x79, 0xcf, 0xbc, 0xcf, 0x7c, 0x9f, 0x77, 0x76,
      0x67, 0xf7, 0x6d, 0xfd, 0xf5, 0x1a, 0xbc, 0x44, 0x40, 0x04, 0x16, 0x19, 0x81, 0x7d, 0x49,
      0x00, 0xce, 0x9f, 0x3f, 0x5f, 0xfd, 0xe5, 0x37, 0x36, 0x36, 0x86, 0x47, 0x8f, 0x1e, 0x69,
      0x5f, 0x19, 0x01, 0xf1, 0x33, 0x7e, 0x7a, 0xe5, 0xcf, 0x37, 0xdf, 0x7c, 0x33, 0x10, 0x00,
      0x02, 0x46, 0xc0, 0x17, 0x3a, 0x81, 0x11, 0x80, 0xbf, 0x66, 0x6d, 0x33, 0xb0, 0x19, 0xb8,
      0xd7, 0x0c, 0x9c, 0xa0, 0xb1, 0xe7, 0xf8, 0x23, 0x00, 0x9d, 0x7f, 0x80, 0xde, 0x03, 0xc0,
      0xf9, 0xfb, 0x26, 0x60, 0xef, 0xf8, 0x13, 0x00, 0x02, 0xd0, 0x75, 0x06, 0xea, 0x9d, 0x00,
      0x4b, 0x3f, 0x3f, 0x01, 0x20, 0x00, 0x04, 0x60, 0xc1, 0x35, 0x20, 0x02, 0x40, 0x00, 0x08,
      0x00, 0x01, 0xb0, 0x0c, 0xb8, 0xd4, 0x22, 0xd0, 0xd2, 0x11, 0x78, 0xe9, 0xdf, 0x1f, 0x01,
      0x20, 0x00, 0x04, 0x80, 0x00, 0xfe, 0x9b, 0x04, 0x70, 0xf4, 0xe8, 0xd1, 0xe1, 0xf8, 0xf1,
      0xe3, 0xc3, 0x6e, 0x17, 0x29, 0xf5, 0x5c, 0x46, 0x59, 0xfa, 0x0c, 0xe2, 0xfb, 0xc7, 0x5e,
      0x45, 0x98, 0x4d, 0x00, 0x27, 0x4e, 0x9c, 0x18, 0x3e, 0xfb, 0xec, 0xb3, 0xed, 0x6b, 0xdd,
      0x5e, 0xbe, 0x7c, 0x39, 0x5c, 0xbc, 0x78, 0x71, 0xfc, 0xfb, 0x4d, 0x25, 0x20, 0x01, 0x98,
      0x77, 0x69, 0xe1, 0x9b, 0x8a, 0xff, 0xbc, 0xb3, 0xbf, 0xb9, 0xdf, 0xdf, 0xf9, 0xe7, 0x45,
      0xa0, 0xe5, 0xf7, 0x9f, 0x25, 0x00, 0x39, 0x11, 0xaf, 0x5c, 0xb9, 0x32, 0xfc, 0xf2, 0xcb,
      0x2f, 0x63, 0xaf, 0xbe, 0xfa, 0xea, 0xab, 0xe1, 0xfa, 0xf5, 0xeb, 0xe3, 0xdf, 0x2d, 0x1d,
      0xd8, 0x49, 0x40, 0x08, 0xc0, 0x9b, 0x1f, 0x00, 0x6f, 0x52, 0xc0, 0xe7, 0xf5, 0x9e, 0x80,
      0xbc, 0xa9, 0xfc, 0x99, 0x13, 0xff, 0x59, 0x02, 0x70, 0xea, 0xd4, 0xa9, 0xe1, 0xa3, 0x8f,
      0x3e, 0x1a, 0xbe, 0xfb, 0xee, 0xbb, 0x95, 0x9f, 0xf9, 0xf5, 0xd7, 0x5f, 0x0f, 0xef, 0xbc,
      0xf3, 0xce, 0xf8, 0x5e, 0x26, 0x83, 0x8f, 0x3f, 0xfe, 0x78, 0x38, 0x73, 0xe6, 0xcc, 0xf0,
      0xe4, 0xc9, 0x93, 0xe1, 0xf0, 0xe1, 0xc3, 0xe3, 0x7b, 0x49, 0x40, 0x4e, 0x9e, 0x3c, 0x39,
      0xbc, 0xf7, 0xde, 0x7b, 0xe3, 0xff, 0x5f, 0xbe, 0x7c, 0x79, 0xc8, 0x49, 0x3e, 0x3d, 0x2e,
      0x09, 0xcb, 0x54, 0x00, 0x52, 0x67, 0xf3, 0xab, 0xb4, 0x05, 0x3d, 0x03, 0x28, 0x81, 0x24,
      0x70, 0xe4, 0xf1, 0x37, 0x4b, 0x00, 0x72, 0x22, 0xde, 0xbd, 0x7b, 0x77, 0xb8, 0x71, 0xe3,
      0xc6, 0x6b, 0x22, 0x50, 0x06, 0x20, 0x91, 0xc1, 0x8b, 0x17, 0x2f, 0x86, 0x5b, 0xb7, 0x6e,
      0x8d, 0x02, 0xf0, 0xf3, 0xcf, 0x3f, 0x0f, 0x57, 0xaf, 0x5e, 0x1d, 0xbe, 0xfc, 0xf2, 0xcb,
      0x51, 0x08, 0x92, 0x08, 0xa4, 0x57, 0x7a, 0x2f, 0xfd, 0xfb, 0xd0, 0xa1, 0x43, 0xa3, 0xcf,
      0xcf, 0x9f, 0x5d, 0x8a, 0x4d, 0x29, 0x00, 0xe7, 0xce, 0x9d, 0x1b, 0x1e, 0x3c, 0x78, 0x30,
      0x9e, 0x7f, 0x2a, 0x48, 0x91, 0x7f, 0x00, 0x02, 0x42, 0x40, 0x7a, 0x8e, 0xdf, 0x59, 0x02,
      0x90, 0x06, 0xe9, 0xb4, 0x06, 0x50, 0x8a, 0x41, 0xf9, 0x05, 0x52, 0x72, 0xee, 0xdf, 0xbf,
      0x7f, 0xb8, 0x79, 0xf3, 0xe6, 0x76, 0x92, 0xa7, 0xd9, 0x7c, 0x9a, 0xb4, 0xe9, 0xc4, 0x3f,
      0xfe, 0xf8, 0xe3, 0x28, 0x06, 0x65, 0xa1, 0xaf, 0x4c, 0xfa, 0xd2, 0x7a, 0x24, 0xc1, 0xc8,
      0xb3, 0xfe, 0x94, 0x0c, 0x7a, 0x06, 0x50, 0x02, 0x4b, 0xe0, 0xc8, 0xe3, 0x6f, 0x5b, 0x00,
      0x36, 0x37, 0x37, 0xe7, 0x58, 0x86, 0xf1, 0x98, 0x4f, 0x3f, 0xfd, 0x74, 0x2c, 0x08, 0x26,
      0x11, 0x78, 0xf8, 0xf0, 0xe1, 0x88, 0xea, 0x47, 0x8e, 0x1c, 0xd9, 0x6e, 0xff, 0xfc, 0xf9,
      0xf3, 0xe1, 0xde, 0xbd, 0x7b, 0x63, 0x62, 0xa7, 0x24, 0x7f, 0xf6, 0xec, 0xd9, 0xf0, 0xf9,
      0xe7, 0x9f, 0x0f, 0x1f, 0x7c, 0xf0, 0xc1, 0x70, 0xed, 0xda, 0xb5, 0xf1, 0xb8, 0xd3, 0xa7,
      0x4f, 0x8f, 0xed, 0xd3, 0x2b, 0x7d, 0x56, 0x3e, 0xff, 0xc1, 0x83, 0x07, 0xc7, 0x76, 0xe9,
      0xef, 0xf2, 0x3c, 0x65, 0x01, 0x32, 0x9f, 0x68, 0x2f, 0x7d, 0x9e, 0xfd, 0xe5, 0x1c, 0x28,
      0x02, 0x0b, 0x8a, 0x40, 0xca, 0xc3, 0xaa, 0xdb, 0x81, 0x33, 0x92, 0xff, 0xfa, 0xeb, 0xaf,
      0x63, 0xc2, 0xe6, 0x02, 0xe1, 0xbf, 0x41, 0x00, 0xd3, 0xdf, 0x27, 0xb2, 0x02, 0x23, 0x08,
      0x04, 0xd1, 0x73, 0xfc, 0xce, 0xb2, 0x00, 0xc9, 0xbf, 0xdf, 0xbf, 0x7f, 0x7f, 0xb8, 0x73,
      0xe7, 0xce, 0x98, 0x7b, 0x25, 0x9a, 0x27, 0x0f, 0x9f, 0x66, 0xf7, 0x0b, 0x17, 0x2e, 0x8c,
      0xef, 0x25, 0x61, 0xf8, 0xed, 0xb7, 0xdf, 0xaa, 0x2d, 0x40, 0x3a, 0x57, 0x7a, 0x95, 0x05,
      0xc2, 0x84, 0xfe, 0xe9, 0x73, 0x1f, 0x3f, 0x7e, 0x3c, 0xd6, 0x13, 0xd2, 0x2b, 0x1d, 0x97,
      0x8e, 0x91, 0x40, 0x12, 0xa8, 0x67, 0x02, 0x45, 0x1f, 0x7f, 0xb3, 0x04, 0x20, 0x27, 0x7c,
      0x39, 0xf3, 0x26, 0xb4, 0xcf, 0x82, 0x70, 0xf6, 0xec, 0xd9, 0xe1, 0xfd, 0xf7, 0xdf, 0x1f,
      0xdf, 0x4e, 0xd5, 0xfc, 0xf4, 0xda, 0x6b, 0x0d, 0x20, 0x7f, 0x76, 0x79, 0x7d, 0xc1, 0x4e,
      0xab, 0x00, 0x89, 0x3c, 0xf2, 0xaa, 0x84, 0x01, 0xe0, 0x7e, 0x7e, 0x97, 0x72, 0xd7, 0xed,
      0xc8, 0x35, 0x4b, 0x00, 0x76, 0xb3, 0x44, 0x2d, 0x09, 0x38, 0x77, 0xad, 0x7f, 0xa7, 0x3e,
      0xb4, 0x9c, 0x3f, 0xba, 0x82, 0xeb, 0x3f, 0x02, 0x6a, 0x19, 0xff, 0x04, 0xe0, 0xaf, 0x0c,
      0x6a, 0x09, 0xa0, 0x04, 0x14, 0xbf, 0xc8, 0xe3, 0xa7, 0xbb, 0x00, 0x48, 0x20, 0x09, 0x14,
      0x39, 0x81, 0xa2, 0x8f, 0x5f, 0x02, 0x80, 0x00, 0x10, 0x90, 0xbb, 0x01, 0xff, 0x9b, 0x77,
      0x03, 0xee, 0x56, 0x7b, 0xc8, 0xef, 0x9b, 0x41, 0x14, 0x01, 0x15, 0x01, 0x83, 0x16, 0x01,
      0xa3, 0x23, 0x94, 0xfe, 0xb3, 0x30, 0x91, 0x27, 0x20, 0x16, 0x80, 0x05, 0x60, 0x01, 0x58,
      0x00, 0x16, 0x00, 0x42, 0xd6, 0x21, 0x24, 0x02, 0x8a, 0x4d, 0x40, 0xb3, 0x08, 0xa0, 0xbc,
      0x0d, 0x77, 0xae, 0x2f, 0x8f, 0x7c, 0xdc, 0xf7, 0xdf, 0x7f, 0x3f, 0xfc, 0xf4, 0xd3, 0x4f,
      0xb3, 0xbf, 0x42, 0x64, 0x04, 0x94, 0xc0, 0xb1, 0x13, 0xb8, 0xf5, 0xf7, 0x23, 0x00, 0x2b,
      0xd2, 0x9c, 0x00, 0xcc, 0xd6, 0xbe, 0xf1, 0x40, 0x02, 0x18, 0xb7, 0x08, 0x3b, 0x4b, 0x00,
      0x76, 0x1b, 0x0e, 0x06, 0x40, 0xdc, 0x01, 0x20, 0x81, 0x97, 0x2d, 0x60, 0x04, 0xc0, 0x0c,
      0x66, 0x06, 0x57, 0x04, 0xdc, 0xda, 0x72, 0x6f, 0xfd, 0x6e, 0x9c, 0xe3, 0x7d, 0x11, 0x78,
      0xfb, 0x22, 0x30, 0x7b, 0x3f, 0x80, 0xbc, 0xa5, 0x57, 0x19, 0x82, 0xbc, 0x07, 0x40, 0xb6,
      0x00, 0x69, 0x3b, 0xb0, 0x03, 0x07, 0x0e, 0xbc, 0x16, 0xa5, 0xbc, 0xff, 0x5f, 0xf9, 0x46,
      0xba, 0xbd, 0x37, 0xed, 0x0d, 0x98, 0x5e, 0xbf, 0xff, 0xfe, 0xfb, 0xf0, 0xed, 0xb7, 0xdf,
      0xce, 0x8a, 0x6e, 0xda, 0x6f, 0xe0, 0x93, 0x4f, 0x3e, 0xf9, 0xdb, 0xb1, 0xd3, 0xad, 0xca,
      0x56, 0xf5, 0x35, 0x35, 0x28, 0xef, 0x20, 0xcc, 0x1f, 0x50, 0xf6, 0xb9, 0xbc, 0x13, 0x71,
      0x56, 0x67, 0xfe, 0x7f, 0x10, 0x0b, 0xc4, 0x02, 0x45, 0x5d, 0x45, 0x9a, 0x6d, 0x01, 0x52,
      0xc2, 0xe6, 0x6d, 0xc0, 0xd3, 0xb8, 0x2f, 0xf7, 0xf8, 0xdb, 0xb7, 0x6f, 0xdf, 0xf8, 0x7c,
      0xf9, 0x94, 0x4c, 0xe9, 0xb5, 0x6e, 0xf3, 0xd0, 0xf4, 0xde, 0xaa, 0xfd, 0x05, 0xf7, 0x92,
      0x40, 0xe5, 0x6e, 0xc4, 0xe9, 0xf3, 0xb2, 0x20, 0x94, 0xb7, 0x27, 0xa7, 0xbe, 0x7d, 0xf8,
      0xe1, 0x87, 0x7f, 0xeb, 0xef, 0x34, 0xa1, 0xf3, 0xa6, 0xa5, 0x69, 0xcf, 0xc2, 0xdb, 0xb7,
      0x6f, 0x8f, 0xfd, 0xaf, 0x7d, 0xed, 0xa5, 0xff, 0xab, 0xce, 0xa1, 0x3d, 0x01, 0xe9, 0x35,
      0xfe, 0x66, 0x0b, 0xc0, 0x9c, 0x04, 0x9a, 0x23, 0x00, 0xd3, 0x8d, 0x3d, 0xd2, 0xe7, 0xb6,
      0x26, 0x40, 0xfa, 0x12, 0x25, 0x65, 0xcc, 0x11, 0x80, 0xd4, 0xd7, 0x57, 0xaf, 0x5e, 0x8d,
      0x9b, 0x8a, 0xb4, 0x9e, 0x5f, 0x7b, 0x09, 0xdc, 0x2b, 0x81, 0x5b, 0xf3, 0xe7, 0x5f, 0x15,
      0x80, 0xbc, 0xb1, 0xe8, 0xf4, 0x49, 0x3f, 0x39, 0x81, 0x32, 0x55, 0x4c, 0x91, 0x3e, 0xdb,
      0x85, 0x75, 0x4f, 0x08, 0xda, 0xab, 0x00, 0x4c, 0x9f, 0x73, 0x20, 0x81, 0x25, 0x70, 0xd4,
      0x04, 0xee, 0x26, 0x00, 0x39, 0x89, 0x4a, 0x84, 0x5e, 0x55, 0x03, 0x28, 0x1f, 0x26, 0x92,
      0x67, 0xe6, 0x34, 0xf3, 0x96, 0xb5, 0x82, 0x29, 0xbe, 0xe7, 0xed, 0xc3, 0xf3, 0x6e, 0xc2,
      0xc9, 0xf3, 0x97, 0x9f, 0x53, 0xd2, 0x48, 0xf9, 0xfc, 0x81, 0xbc, 0x45, 0xd8, 0xaa, 0x1a,
      0x40, 0x79, 0x8e, 0x6c, 0x1b, 0xca, 0x67, 0x11, 0xa4, 0xcf, 0x2c, 0x8f, 0xd9, 0x8b, 0x1d,
      0x20, 0x20, 0x04, 0x24, 0xaa, 0x80, 0x54, 0x13, 0x40, 0x4e, 0xf6, 0x94, 0x98, 0xb9, 0x06,
      0x30, 0x4d, 0x9a, 0xf2, 0x98, 0x94, 0xcc, 0xf9, 0xef, 0x55, 0x09, 0x5f, 0xfe, 0x5f, 0xea,
      0x54, 0x2a, 0xd8, 0x25, 0x12, 0x28, 0x9f, 0x19, 0xb0, 0x2a, 0x29, 0x73, 0xb2, 0xef, 0x94,
      0xbc, 0xd3, 0x63, 0xa6, 0xa4, 0x91, 0x12, 0xf8, 0xd8, 0xb1, 0x63, 0x63, 0x71, 0x71, 0xdd,
      0xb3, 0x0f, 0x76, 0x12, 0x04, 0x02, 0x40, 0x00, 0x16, 0x25, 0x00, 0x79, 0x06, 0xcd, 0x0f,
      0xfd, 0x58, 0x97, 0x00, 0x65, 0xa1, 0x2d, 0x6d, 0xe6, 0xb9, 0xae, 0x46, 0x30, 0x45, 0xf8,
      0xf2, 0x19, 0x04, 0xab, 0x2a, 0xf7, 0x39, 0x19, 0xf3, 0x71, 0x69, 0x1b, 0xf2, 0x4b, 0x97,
      0x2e, 0xed, 0x38, 0x69, 0x97, 0xe7, 0x98, 0xd6, 0x08, 0x72, 0xff, 0x93, 0xd5, 0x48, 0x74,
      0xb2, 0x53, 0x11, 0x53, 0x11, 0xef, 0xf5, 0x08, 0x10, 0xc0, 0xb8, 0x02, 0xb8, 0x67, 0x02,
      0xc8, 0xe8, 0x3f, 0x77, 0x53, 0xce, 0x32, 0xf1, 0xd6, 0x09, 0x40, 0x7a, 0xb4, 0xd8, 0x1f,
      0x7f, 0xfc, 0xf1, 0xb7, 0xc4, 0x2b, 0x57, 0x19, 0xf2, 0xf3, 0x08, 0x57, 0xa1, 0x7f, 0x5a,
      0xba, 0xfb, 0xe1, 0x87, 0x1f, 0x76, 0xad, 0xe2, 0x97, 0xc9, 0xbd, 0x4e, 0x00, 0x52, 0xff,
      0xde, 0x7d, 0xf7, 0xdd, 0x1d, 0x57, 0x0f, 0x08, 0x00, 0x01, 0x98, 0x46, 0x20, 0xb2, 0x00,
      0xee, 0x49, 0x00, 0xf2, 0x8c, 0x3e, 0x5d, 0x2f, 0xdf, 0x29, 0x00, 0x3b, 0xcd, 0xbc, 0x39,
      0x90, 0x53, 0x01, 0x28, 0x77, 0x21, 0x5e, 0x47, 0x00, 0xf9, 0x06, 0xa5, 0x54, 0x18, 0x9c,
      0xf3, 0x03, 0x94, 0x02, 0x90, 0x09, 0x26, 0x17, 0x15, 0xcb, 0xeb, 0x18, 0x08, 0xc0, 0x5e,
      0xaa, 0x1f, 0xff, 0x3b, 0x76, 0x4e, 0xfc, 0x59, 0xa8, 0xf5, 0x11, 0xe8, 0x19, 0xbf, 0x3d,
      0x09, 0x40, 0x3a, 0x78, 0xd5, 0xc5, 0x32, 0xeb, 0xbe, 0xc0, 0x74, 0xcd, 0x3f, 0x23, 0x7b,
      0x59, 0xd0, 0x9b, 0xda, 0x84, 0x14, 0xa6, 0x2c, 0x1a, 0xe9, 0x59, 0x04, 0xa9, 0x06, 0x90,
      0xad, 0x46, 0x0e, 0xe1, 0x74, 0x55, 0x60, 0xb7, 0x00, 0x4e, 0xcf, 0x91, 0xfb, 0x95, 0xeb,
      0x06, 0xb9, 0xfd, 0xd4, 0x8a, 0xcc, 0x4d, 0x85, 0xdd, 0xce, 0xbf, 0xdb, 0xe7, 0x68, 0x1f,
      0x17, 0xa1, 0xa3, 0x0b, 0xe0, 0x6c, 0x01, 0x48, 0x49, 0x97, 0x5e, 0xe5, 0xc5, 0x40, 0x79,
      0x60, 0xa7, 0x01, 0x9c, 0x1e, 0xe9, 0x95, 0x1e, 0xdf, 0x55, 0xfa, 0xe7, 0x55, 0x6d, 0xa6,
      0xff, 0x97, 0x0b, 0x83, 0x79, 0x36, 0xce, 0xe8, 0x3f, 0xfd, 0x3b, 0x8b, 0xc6, 0xf4, 0xf8,
      0xe9, 0x0f, 0x90, 0x92, 0x3d, 0x3d, 0x81, 0xb8, 0xec, 0xe7, 0xaa, 0x36, 0xe5, 0xff, 0xa5,
      0xfe, 0x7f, 0xf1, 0xc5, 0x17, 0xdb, 0x0f, 0x2f, 0x5d, 0x65, 0x39, 0xcc, 0x60, 0xff, 0xcd,
      0x19, 0x2c, 0x7a, 0x02, 0xf6, 0xee, 0xff, 0x2c, 0x01, 0xc8, 0x33, 0xe8, 0xba, 0x21, 0x90,
      0x66, 0xd2, 0xa7, 0x4f, 0x9f, 0x8e, 0x0f, 0x03, 0x2d, 0x5f, 0xeb, 0xf0, 0xbd, 0xbc, 0x0c,
      0xb8, 0xf4, 0xf0, 0xeb, 0xae, 0x03, 0x28, 0x71, 0x7f, 0xa7, 0xbd, 0x09, 0xf2, 0x8c, 0x3e,
      0x3d, 0x66, 0xdd, 0x25, 0xbe, 0xd3, 0x65, 0xcb, 0x75, 0xd7, 0x19, 0x98, 0xc1, 0x77, 0x8e,
      0x00, 0x82, 0x89, 0x4b, 0x30, 0xb3, 0x04, 0x40, 0x02, 0x48, 0x00, 0x04, 0xf4, 0x76, 0x12,
      0x10, 0x01, 0x50, 0xc4, 0x52, 0xc4, 0x73, 0x3b, 0xb0, 0x3d, 0x01, 0xa3, 0x5e, 0xc8, 0xd1,
      0xdb, 0x43, 0x3a, 0x7f, 0xec, 0x55, 0x90, 0x6d, 0x02, 0xb0, 0x1f, 0xc0, 0x6e, 0x46, 0xc7,
      0xfb, 0x22, 0xf0, 0xf6, 0x45, 0x60, 0xf6, 0x7e, 0x00, 0x3c, 0xe0, 0xdb, 0xe9, 0x01, 0xcd,
      0xe0, 0xb1, 0x67, 0xf0, 0xd6, 0xdf, 0x4f, 0x0d, 0x40, 0x0d, 0x40, 0x0d, 0x40, 0x0d, 0x40,
      0x0d, 0x40, 0x0d, 0xc0, 0x86, 0x28, 0xb5, 0x80, 0x1f, 0x79, 0x19, 0x14, 0x01, 0x20, 0x00,
      0x04, 0x80, 0x00, 0x10, 0x00, 0x02, 0x40, 0x00, 0x08, 0xa0, 0x32, 0x02, 0x91, 0x11, 0xa8,
      0xb5, 0x88, 0xa2, 0xfd, 0xb2, 0x8b, 0x68, 0xd1, 0x7f, 0x7f, 0x16, 0x80, 0x05, 0x60, 0x01,
      0x58, 0x00, 0x16, 0x80, 0x05, 0x60, 0x01, 0x2a, 0x01, 0x38, 0xb4, 0x80, 0x22, 0x00, 0x04,
      0x10, 0x7a, 0x00, 0x47, 0x47, 0xf0, 0xde, 0xfd, 0x27, 0x00, 0x04, 0x80, 0x00, 0xb0, 0x00,
      0x2c, 0x00, 0x0b, 0xc0, 0x02, 0xb0, 0x00, 0x95, 0x11, 0xb0, 0x0a, 0x10, 0xf7, 0x7e, 0xf0,
      0xde, 0x08, 0xea, 0xfc, 0x7d, 0x57, 0x51, 0x58, 0x00, 0x16, 0x80, 0x05, 0x60, 0x01, 0x58,
      0x00, 0x16, 0x80, 0x05, 0xa8, 0x04, 0xe0, 0xd0, 0x02, 0x8a, 0x00, 0x10, 0x40, 0xe8, 0x01,
      0xcc, 0x42, 0xb4, 0x59, 0x08, 0xfb, 0x01, 0xd4, 0xca, 0xbe, 0x76, 0x22, 0xf0, 0x16, 0x44,
      0xc0, 0x7e, 0x00, 0x08, 0x00, 0x01, 0xa8, 0x01, 0xa8, 0x01, 0xa8, 0x01, 0xa8, 0x01, 0xd4,
      0x4e, 0xe8, 0x91, 0x57, 0xc1, 0xd4, 0x00, 0x10, 0x00, 0x02, 0x40, 0x00, 0x08, 0x00, 0x01,
      0x20, 0x00, 0x04, 0x50, 0x19, 0x81, 0xc8, 0x08, 0xa4, 0x8a, 0xdc, 0x56, 0x45, 0x16, 0xbf,
      0xd8, 0xf1, 0x63, 0x01, 0x58, 0x00, 0x16, 0x80, 0x05, 0x60, 0x01, 0x58, 0x00, 0x16, 0xa0,
      0x12, 0x80, 0x43, 0x0b, 0x28, 0x02, 0x40, 0x00, 0xa1, 0x07, 0x30, 0x0b, 0xd2, 0x66, 0x41,
      0x08, 0x00, 0x01, 0x20, 0x00, 0x2c, 0x00, 0x0b, 0xc0, 0x02, 0xb0, 0x00, 0x2c, 0x40, 0x65,
      0x04, 0xac, 0x02, 0xb8, 0x1d, 0x98, 0x80, 0xc6, 0x14, 0x50, 0x16, 0x80, 0x05, 0x60, 0x01,
      0x58, 0x00, 0x16, 0xc0, 0x0c, 0x16, 0x73, 0x06, 0x53, 0x04, 0x54, 0x04, 0x34, 0x83, 0x2d,
      0x78, 0x06, 0x23, 0x00, 0x04, 0x80, 0x00, 0x10, 0x80, 0x01, 0xc1, 0xd5, 0x11, 0x9c, 0xfd,
      0x00, 0x2a, 0x0b, 0x9f, 0x9a, 0x89, 0xc0, 0xdb, 0x10, 0x01, 0xfb, 0x01, 0x28, 0x02, 0x22,
      0xa8, 0x05, 0x13, 0x94, 0x55, 0x00, 0x02, 0x40, 0x00, 0x08, 0x80, 0x55, 0x00, 0x1e, 0xb2,
      0xce, 0x43, 0x2a, 0xc2, 0xb5, 0x15, 0xe1, 0x7a, 0xc7, 0x0f, 0x01, 0x20, 0x00, 0x04, 0x80,
      0x00, 0x10, 0x00, 0x02, 0x40, 0x00, 0xb5, 0x45, 0xbd, 0xc8, 0x57, 0xc2, 0x22, 0x00, 0x04,
      0x80, 0x00, 0x10, 0x00, 0x02, 0x40, 0x00, 0x08, 0x00, 0x01, 0x54, 0x46, 0x20, 0x32, 0x02,
      0xf5, 0x2e, 0xc2, 0x38, 0x7f, 0xec, 0x22, 0x5a, 0xf4, 0xdf, 0x8f, 0x05, 0x60, 0x01, 0x58,
      0x00, 0x16, 0x80, 0x05, 0x60, 0x01, 0x58, 0x80, 0x4a, 0x00, 0x0e, 0x2d, 0xa0, 0x08, 0x00,
      0x01, 0x84, 0x1e, 0xc0, 0xd1, 0x11, 0xbc, 0x77, 0xff, 0x09, 0x00, 0x01, 0x20, 0x00, 0x2c,
      0x00, 0x0b, 0xc0, 0x02, 0xb0, 0x00, 0x2c, 0x40, 0x65, 0x04, 0xac, 0x02, 0xd8, 0x12, 0x8c,
      0x80, 0xc6, 0x14, 0x50, 0x16, 0x80, 0x05, 0x60, 0x01, 0x58, 0x80, 0xad, 0xad, 0xcd, 0xcd,
      0xcd, 0xca, 0xf9, 0x5f, 0x33, 0x11, 0x10, 0x81, 0xa8, 0x11, 0xb0, 0x1f, 0x00, 0x02, 0x40,
      0x00, 0x08, 0x40, 0x11, 0x90, 0x87, 0x8d, 0xe9, 0x61, 0x7b, 0x2f, 0xa3, 0x45, 0x3f, 0xbf,
      0x1a, 0x00, 0x02, 0x40, 0x00, 0x08, 0x00, 0x01, 0x20, 0x00, 0x04, 0x50, 0xeb, 0xe3, 0x23,
      0xaf, 0x82, 0x21, 0x00, 0x04, 0x80, 0x00, 0x10, 0x00, 0x02, 0x40, 0x00, 0x08, 0x00, 0x01,
      0x54, 0x46, 0x20, 0x32, 0x02, 0x45, 0x2f, 0xe2, 0xe8, 0xbf, 0xdb, 0x89, 0x5b, 0xf2, 0x8f,
      0x05, 0x60, 0x01, 0x58, 0x00, 0x16, 0x80, 0x05, 0x60, 0x01, 0x58, 0x80, 0x4a, 0x00, 0x0e,
      0x2d, 0xa0, 0x08, 0x00, 0x01, 0x84, 0x1e, 0xc0, 0x2c, 0x50, 0x9b, 0x05, 0x22, 0x00, 0x04,
      0x80, 0x00, 0xb0, 0x00, 0x2c, 0x00, 0x0b, 0xc0, 0x02, 0xb0, 0x00, 0x95, 0x11, 0x68, 0xa9,
      0x42, 0x42, 0xb8, 0x36, 0x84, 0x13, 0x3f, 0xf1, 0x6b, 0xc9, 0x3f, 0x16, 0x80, 0x05, 0x60,
      0x01, 0x58, 0x00, 0x16, 0x80, 0x05, 0x60, 0x01, 0x2a, 0x01, 0x38, 0xb4, 0x80, 0x6e, 0x13,
      0x80, 0xfd, 0x00, 0x6a, 0x7f, 0x7e, 0xed, 0x44, 0x20, 0x6e, 0x04, 0xec, 0x07, 0xc0, 0x02,
      0x84, 0x9e, 0xc1, 0xd4, 0x40, 0xda, 0x6a, 0x20, 0x6a, 0x00, 0x04, 0x80, 0x00, 0xa8, 0x01,
      0xa8, 0x01, 0xa8, 0x01, 0xa8, 0x01, 0xd4, 0x82, 0x7c, 0x4b, 0x15, 0xbe, 0x37, 0xc1, 0x20,
      0x00, 0x04, 0x80, 0x00, 0x10, 0x00, 0x02, 0x40, 0x00, 0x08, 0x00, 0x01, 0x54, 0x46, 0x20,
      0x32, 0x02, 0xf5, 0x46, 0x30, 0xe7, 0x6f, 0x2b, 0x62, 0x89, 0x5f, 0x5b, 0xfc, 0x58, 0x00,
      0x16, 0x80, 0x05, 0x60, 0x01, 0x58, 0x00, 0x16, 0x80, 0x05, 0xa8, 0x04, 0xe0, 0xd0, 0x02,
      0x8a, 0x00, 0x10, 0x40, 0xe8, 0x01, 0xcc, 0x02, 0xb0, 0x00, 0x06, 0xf0, 0x82, 0x11, 0x96,
      0x00, 0x10, 0x00, 0x02, 0x40, 0x00, 0x06, 0x16, 0xae, 0xce, 0xc2, 0xb1, 0x00, 0x2c, 0x00,
      0x01, 0x5d, 0xb0, 0x80, 0x12, 0x00, 0x02, 0x40, 0x00, 0x08, 0x80, 0x55, 0x00, 0x08, 0x59,
      0x87, 0x90, 0x3c, 0x78, 0x9b, 0x07, 0xef, 0x1d, 0x3f, 0x04, 0x80, 0x00, 0x10, 0x00, 0x02,
      0xd8, 0xda, 0xb2, 0x1f, 0x40, 0xed, 0x2a, 0xb0, 0x76, 0x22, 0x10, 0x37, 0x02, 0xf6, 0x03,
      0x40, 0x00, 0x08, 0x00, 0x01, 0xa8, 0x01, 0xa8, 0x01, 0xa8, 0x01, 0xd4, 0xce, 0xe3, 0x91,
      0xef, 0x85, 0x51, 0x03, 0x40, 0x00, 0x08, 0x00, 0x01, 0x20, 0x00, 0x04, 0x80, 0x00, 0x10,
      0x40, 0x65, 0x04, 0x22, 0x23, 0x50, 0xef, 0x65, 0x18, 0xe7, 0x8f, 0xbd, 0x8c, 0x16, 0xfd,
      0xf7, 0x63, 0x01, 0x58, 0x00, 0x16, 0x80, 0x05, 0x60, 0x01, 0x58, 0x00, 0x16, 0xa0, 0x12,
      0x80, 0x43, 0x0b, 0x28, 0x02, 0x40, 0x00, 0xa1, 0x07, 0x70, 0x74, 0x04, 0xef, 0xdd, 0x7f,
      0x02, 0x40, 0x00, 0x08, 0x00, 0x0b, 0xc0, 0x02, 0xb0, 0x00, 0x2c, 0x00, 0x0b, 0x50, 0x19,
      0x01, 0xab, 0x00, 0x1b, 0xee, 0x47, 0x7f, 0x44, 0x40, 0x2a, 0xd3, 0xa7, 0x2b, 0x81, 0xb1,
      0x00, 0x2c, 0x40, 0xd7, 0x01, 0xd8, 0xdb, 0x03, 0x2f, 0xfd, 0xfc, 0x04, 0x80, 0x00, 0x10,
      0x00, 0x35, 0x00, 0x35, 0x00, 0x35, 0x00, 0x08, 0x1f, 0x11, 0xe1, 0x5b, 0x09, 0x06, 0x01,
      0x20, 0x00, 0x04, 0x80, 0x00, 0xec, 0x07, 0x50, 0xab, 0xfe, 0xda, 0x89, 0x40, 0xe4, 0x08,
      0xd8, 0x0f, 0x00, 0x01, 0x20, 0x00, 0x04, 0xa0, 0x06, 0xa0, 0x06, 0xa0, 0x06, 0x50, 0x3b,
      0x93, 0x47, 0x5e, 0x06, 0x57, 0x03, 0x40, 0x00, 0x08, 0x00, 0x01, 0x20, 0x00, 0x04, 0x80,
      0x00, 0x10, 0x40, 0x65, 0x04, 0x22, 0x23, 0x50, 0xeb, 0x32, 0x8a, 0xf6, 0xee, 0xe7, 0x8f,
      0x3c, 0xfe, 0x59, 0x00, 0x16, 0x80, 0x05, 0x60, 0x01, 0x58, 0x00, 0x16, 0x80, 0x05, 0xa8,
      0x04, 0xe0, 0xd0, 0x02, 0x8a, 0x00, 0x10, 0x40, 0xe8, 0x01, 0xcc, 0x82, 0xb5, 0x59, 0x30,
      0x02, 0x40, 0x00, 0x08, 0x00, 0x0b, 0xc0, 0x02, 0xb0, 0x00, 0x2c, 0x00, 0x0b, 0x50, 0x19,
      0x81, 0xc8, 0x55, 0x50, 0x08, 0xd9, 0x86, 0x90, 0xe2, 0x17, 0x3b, 0x7e, 0x2c, 0x00, 0x0b,
      0xc0, 0x02, 0xb0, 0x00, 0x2c, 0x00, 0x0b, 0xc0, 0x02, 0x54, 0x02, 0x70, 0x68, 0x01, 0x45,
      0x00, 0x08, 0x20, 0xf4, 0x00, 0x66, 0x41, 0xda, 0x2c, 0x08, 0x01, 0x20, 0x00, 0x04, 0x80,
      0x05, 0xb0, 0x1f, 0x40, 0x2d, 0xfe, 0x69, 0x27, 0x02, 0x91, 0x23, 0x60, 0x3f, 0x00, 0x04,
      0x80, 0x00, 0x10, 0x80, 0x22, 0xa0, 0x22, 0xa0, 0x22, 0x60, 0xed, 0x4c, 0x1e, 0x79, 0x19,
      0x5c, 0x0d, 0x00, 0x01, 0x20, 0x00, 0x04, 0x80, 0x00, 0x10, 0x00, 0x02, 0x40, 0x00, 0x95,
      0x11, 0x88, 0x8c, 0x40, 0x96, 0x91, 0xda, 0x96, 0x91, 0xc4, 0x2f, 0x76, 0xfc, 0x58, 0x00,
      0x16, 0x80, 0x05, 0x60, 0x01, 0x58, 0x00, 0x16, 0x80, 0x05, 0xa8, 0x04, 0xe0, 0xd0, 0x02,
      0x8a, 0x00, 0x10, 0x40, 0xe8, 0x01, 0xcc, 0x82, 0xb4, 0x59, 0x10, 0x02, 0x40, 0x00, 0x08,
      0x00, 0x0b, 0xc0, 0x02, 0xb0, 0x00, 0x2c, 0x00, 0x0b, 0x50, 0x19, 0x01, 0xab, 0x00, 0x1b,
      0x03, 0x01, 0x21, 0x20, 0x95, 0xe9, 0xd3, 0x95, 0xc0, 0x58, 0x00, 0x16, 0xa0, 0xeb, 0x00,
      0xe4, 0xe1, 0xdb, 0x3c, 0x7c, 0x6b, 0xfc, 0x08, 0x00, 0x01, 0x20, 0x00, 0x6a, 0x00, 0x6a,
      0x00, 0x10, 0x1e, 0xc2, 0x47, 0x44, 0x78, 0x04, 0x60, 0x06, 0x37, 0x83, 0x2f, 0x78, 0x06,
      0xff, 0xc7, 0x04, 0x60, 0x73, 0x73, 0xb3, 0x56, 0x00, 0xb5, 0x13, 0x01, 0x11, 0x08, 0x1a,
      0x01, 0xfb, 0x01, 0x20, 0x08, 0x04, 0xb1, 0x60, 0x82, 0x50, 0x04, 0x24, 0x00, 0x04, 0x80,
      0x00, 0x28, 0x02, 0x2a, 0x02, 0x2a, 0x02, 0xd6, 0x52, 0x7c, 0xe4, 0xeb, 0x60, 0x10, 0x00,
      0x02, 0x40, 0x00, 0x08, 0x00, 0x01, 0x20, 0x00, 0x04, 0x80, 0x00, 0x2a, 0x23, 0x10, 0x19,
      0x81, 0x5a, 0x97, 0x51, 0xb4, 0xef, 0x7b, 0x25, 0x9b, 0xf8, 0xb7, 0xc5, 0x9f, 0x05, 0x60,
      0x01, 0x58, 0x00, 0x16, 0x80, 0x05, 0x60, 0x01, 0x58, 0x80, 0x4a, 0x00, 0x0e, 0x2d, 0xa0,
      0x08, 0x00, 0x01, 0x84, 0x1e, 0xc0, 0x2c, 0x00, 0x0b, 0x60, 0x00, 0x2f, 0x18, 0x61, 0x09,
      0x00, 0x01, 0x20, 0x00, 0x04, 0xc0, 0x7e, 0x0c, 0x8f, 0xea, 0x2c, 0x1c, 0x0b, 0xc0, 0x02,
      0x10, 0xd0, 0x05, 0x0b, 0x28, 0x01, 0x20, 0x00, 0x04, 0x80, 0x00, 0x58, 0x05, 0xb0, 0x0a,
      0x50, 0x87, 0x90, 0x3c, 0x78, 0x9b, 0x07, 0xef, 0x1d, 0x3f, 0x04, 0x80, 0x00, 0x10, 0x00,
      0x02, 0xd8, 0xda, 0xb2, 0x1f, 0x40, 0xed, 0x2a, 0xb0, 0x76, 0x22, 0x10, 0x37, 0x02, 0xf6,
      0x03, 0x40, 0x00, 0x08, 0x00, 0x01, 0xa8, 0x01, 0xa8, 0x01, 0xa8, 0x01, 0xd4, 0xce, 0xe3,
      0x91, 0xef, 0x85, 0x51, 0x03, 0x40, 0x00, 0x08, 0x00, 0x01, 0x20, 0x00, 0x04, 0x80, 0x00,
      0x10, 0x40, 0x65, 0x04, 0x22, 0x23, 0x50, 0xef, 0x65, 0x18, 0xe7, 0x8f, 0xbd, 0x8c, 0x16,
      0xfd, 0xf7, 0x63, 0x01, 0x58, 0x00, 0x16, 0x80, 0x05, 0x60, 0x01, 0x58, 0x00, 0x16, 0xa0,
      0x12, 0x80, 0x43, 0x0b, 0x28, 0x02, 0x40, 0x00, 0xa1, 0x07, 0x70, 0x74, 0x04, 0xef, 0xdd,
      0x7f, 0x02, 0x40, 0x00, 0x08, 0x00, 0x0b, 0xc0, 0x02, 0xb0, 0x00, 0x2c, 0x00, 0x0b, 0x50,
      0x19, 0x01, 0xab, 0x00, 0x1b, 0xee, 0x47, 0xaf, 0xbc, 0x1f, 0xbd, 0x37, 0x02, 0x2f, 0xfd,
      0xfc, 0x2c, 0x00, 0x0b, 0xc0, 0x02, 0xb0, 0x00, 0x2c, 0x00, 0x0b, 0xc0, 0x02, 0x54, 0x02,
      0x70, 0x68, 0x01, 0x45, 0x00, 0x08, 0x20, 0xf4, 0x00, 0x5e, 0x3a, 0xc2, 0xb7, 0x7e, 0x7f,
      0x02, 0x40, 0x00, 0x08, 0x00, 0x0b, 0x60, 0x3f, 0x80, 0x5a, 0xfc, 0xd3, 0x4e, 0x04, 0x22,
      0x47, 0xc0, 0x7e, 0x00, 0x08, 0x00, 0x01, 0x20, 0x00, 0x45, 0x40, 0x45, 0x40, 0x45, 0xc0,
      0xda, 0x99, 0x3c, 0xf2, 0x32, 0xb8, 0x1a, 0x00, 0x02, 0x40, 0x00, 0x08, 0x00, 0x01, 0x20,
      0x00, 0x04, 0x80, 0x00, 0x2a, 0x23, 0x10, 0x19, 0x81, 0x5a, 0x97, 0x51, 0xb4, 0x77, 0x3f,
      0x7f, 0xe4, 0xf1, 0xcf, 0x02, 0xb0, 0x00, 0x2c, 0x00, 0x0b, 0xc0, 0x02, 0xb0, 0x00, 0x2c,
      0x40, 0x25, 0x00, 0x87, 0x16, 0x50, 0x04, 0x80, 0x00, 0x42, 0x0f, 0x60, 0x16, 0xac, 0xcd,
      0x82, 0x11, 0x00, 0x02, 0x40, 0x00, 0x58, 0x00, 0x16, 0x80, 0x05, 0x60, 0x01, 0x58, 0x80,
      0xca, 0x08, 0x44, 0xae, 0x82, 0x42, 0xc8, 0x36, 0x84, 0x14, 0xbf, 0xd8, 0xf1, 0x63, 0x01,
      0x58, 0x00, 0x16, 0x80, 0x05, 0x60, 0x01, 0x58, 0x00, 0x16, 0xa0, 0x12, 0x80, 0x43, 0x0b,
      0x28, 0x02, 0x40, 0x00, 0xa1, 0x07, 0x30, 0x0b, 0xd2, 0x66, 0x41, 0x08, 0x00, 0x01, 0x20,
      0x00, 0x2c, 0x80, 0xfd, 0x00, 0x6a, 0xf1, 0x4f, 0x3b, 0x11, 0x88, 0x1c, 0x01, 0xfb, 0x01,
      0x20, 0x00, 0x04, 0x80, 0x00, 0x14, 0x01, 0x15, 0x01, 0x15, 0x01, 0x6b, 0x67, 0xf2, 0xc8,
      0xcb, 0xe0, 0x6a, 0x00, 0x08, 0x00, 0x01, 0x20, 0x00, 0x04, 0x80, 0x00, 0x10, 0x00, 0x02,
      0xa8, 0x8c, 0x40, 0x64, 0x04, 0xb2, 0x8c, 0xd4, 0xb6, 0x8c, 0x24, 0x7e, 0xb1, 0xe3, 0xc7,
      0x02, 0xb0, 0x00, 0x2c, 0x00, 0x0b, 0xc0, 0x02, 0xb0, 0x00, 0x2c, 0x40, 0x25, 0x00, 0x87,
      0x16, 0x50, 0x04, 0x80, 0x00, 0x42, 0x0f, 0x60, 0x16, 0xa4, 0xcd, 0x82, 0x10, 0x00, 0x02,
      0x40, 0x00, 0x58, 0x00, 0x16, 0x80, 0x05, 0x60, 0x01, 0x58, 0x80, 0xca, 0x08, 0x58, 0x05,
      0xd8, 0x18, 0x08, 0x08, 0x01, 0xa9, 0x4c, 0x9f, 0xae, 0x04, 0xc6, 0x02, 0xb0, 0x00, 0x5d,
      0x07, 0x20, 0x0f, 0xdf, 0xe6, 0xe1, 0x5b, 0xe3, 0x47, 0x00, 0x08, 0x00, 0x01, 0x50, 0x03,
      0x50, 0x03, 0x80, 0xf0, 0x10, 0x3e, 0x22, 0xc2, 0x23, 0x00, 0x33, 0xb8, 0x19, 0x7c, 0xc1,
      0x33, 0xf8, 0x3f, 0x26, 0x00, 0x9b, 0x9b, 0x9b, 0xb5, 0x02, 0xa8, 0x9d, 0x08, 0x88, 0x40,
      0xd0, 0x08, 0xd8, 0x0f, 0x00, 0x41, 0x20, 0x88, 0x05, 0x13, 0x84, 0x22, 0x20, 0x01, 0x20,
      0x00, 0x04, 0x40, 0x11, 0x50, 0x11, 0x50, 0x11, 0xb0, 0x96, 0xe2, 0x23, 0x5f, 0x07, 0x83,
      0x00, 0x10, 0x00, 0x02, 0x40, 0x00, 0x08, 0x00, 0x01, 0x20, 0x00, 0x04, 0x50, 0x19, 0x81,
      0xc8, 0x08, 0xd4, 0xba, 0x8c, 0xa2, 0x7d, 0xdf, 0x2b, 0xd9, 0xc4, 0xbf, 0x2d, 0xfe, 0x2c,
      0x00, 0x0b, 0xc0, 0x02, 0xb0, 0x00, 0x2c, 0x00, 0x0b, 0xc0, 0x02, 0x54, 0x02, 0x70, 0x68,
      0x01, 0x45, 0x00, 0x08, 0x20, 0xf4, 0x00, 0x66, 0x01, 0x58, 0x00, 0x03, 0x78, 0xc1, 0x08,
      0x4b, 0x00, 0x08, 0x00, 0x01, 0x20, 0x00, 0xf6, 0x63, 0x78, 0x54, 0x67, 0xe1, 0x58, 0x00,
      0x16, 0x80, 0x80, 0x2e, 0x58, 0x40, 0x09, 0x00, 0x01, 0x20, 0x00, 0x04, 0xc0, 0x2a, 0x80,
      0x55, 0x80, 0x3a, 0x84, 0xe4, 0xc1, 0xdb, 0x3c, 0x78, 0xef, 0xf8, 0x6d, 0x13, 0x40, 0xed,
      0x12, 0x88, 0x76, 0x22, 0x20, 0x02, 0xb1, 0x23, 0xf0, 0x27, 0x0e, 0x38, 0xcc, 0xfe, 0x1d,
      0x39, 0x50, 0x2f, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
    ]),
  ])
);

export class SampleTexture extends Texture {
  constructor() {
    super(textureSource);
  }
}
