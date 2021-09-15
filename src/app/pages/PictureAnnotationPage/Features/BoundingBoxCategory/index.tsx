import React from 'react';
import { CategorizedBoundingBox } from 'types';
import BoundingBoxCommand from '../BoundingBoxCommand';
import styles from './BoundingBoxCategory.module.css';
import { ButtonGroup, ToggleButton } from 'react-bootstrap';

type Props = {
  boundingBoxes: CategorizedBoundingBox[];
  categoryName: string;
  activeCategory: string;
  onChangeSelectedCategory: (categoryName: string) => void;
};

export default function BoundingBoxCategory(props: Props) {
  return (
    <div className="category-container">
      <div className={styles['category-header']}>
        <div className={styles['category-name']}>{props.categoryName}</div>
        <div className={styles['category-command']}>
          <ButtonGroup toggle className="mb-2">
            <ToggleButton
              type="radio"
              variant={props.categoryName === props.activeCategory ? 'primary' : 'secondary'}
              size="sm"
              value={props.categoryName}
              checked={props.categoryName === props.activeCategory}
              onChange={() => props.onChangeSelectedCategory(props.categoryName)}
            >
              Select
            </ToggleButton>
          </ButtonGroup>
        </div>
      </div>
      <ul className="bounding-boxes">
        {props.boundingBoxes.map((d, i) => (
          <BoundingBoxCommand key={i} boundingBox={d} />
        ))}
      </ul>
    </div>
  );
}
