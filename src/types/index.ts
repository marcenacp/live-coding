import { RootState } from './RootState';

export type { RootState };

export type Coord = {
  x: number;
  y: number;
};

export type CategorizedBoundingBox = {
  category: string;
  normalizedVertices: Coord[];
  id: string;
  name: string;
};

export type KiliBoundingBoxAnnotationCategory = {
  confidence: number;
  name: string;
};

export type KiliBoundingBoxAnnotation = {
  boundingPoly: {
    normalizedVertices: Coord[];
  };
  categories: KiliBoundingBoxAnnotationCategory[];
  mid: string;
  score: number | null;
  type: 'rectangle';
};

export type ImageDisplayInformation = {
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
};
