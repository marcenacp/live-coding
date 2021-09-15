import React from 'react';
import { CategorizedBoundingBox } from 'types';

type Props = {
  boundingBox: CategorizedBoundingBox;
};

export default function BoundingBoxCommand(props: Props) {
  return <li className="bounding-box-container">{props.boundingBox.name}</li>;
}
