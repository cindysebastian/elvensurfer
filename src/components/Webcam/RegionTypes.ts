// RegionTypes.ts
export type RegionName = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'middleLeft' | 'middleRight';

export interface RegionCoordinates {
    x: number;
    y: number;
    width: number;
    height: number;
}

export type RegionMap = { [key in RegionName]: RegionCoordinates };
// In your types file
export type ReferenceFrames = {
    topLeft: ImageData | null;
    topRight: ImageData | null;
    bottomLeft: ImageData | null;
    bottomRight: ImageData | null;
    middleLeft: ImageData | null;
    middleRight: ImageData | null;
};
