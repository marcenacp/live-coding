import * as React from 'react';
import { Helmet } from 'react-helmet-async';

import { PageWrapper } from 'app/components/PageWrapper';
import { LeftPanel } from 'app/components/LeftPanel';
import { ControlPanel } from 'app/components/ControlPanel';
import BoundingBoxMaker from './Features/BoundingBoxMaker';
import BoundingBoxCategories from './Features/BoundingBoxCategories';
import { CategorizedBoundingBox, ImageDisplayInformation, Coord } from 'types';

type State = {
  categories: Record<string, CategorizedBoundingBox[]>;
  activeCategory: string;
  imageDisplayInformation: ImageDisplayInformation;
  boundingBoxCounter: number;
};

export default class PictureAnnotationPage extends React.Component<{}, State> {
  constructor(props) {
    super(props);
    this.state = {
      categories: {
        'Category 1': [],
        'Category 2': [],
      },
      activeCategory: 'Category 1',
      imageDisplayInformation: {
        height: 0,
        width: 0,
        offsetX: 0,
        offsetY: 0,
      },
      boundingBoxCounter: 0,
    };
    this.onNewBoundingBox = this.onNewBoundingBox.bind(this);
    this.onMakerChangeSize = this.onMakerChangeSize.bind(this);
    this.onChangeSelectedCategory = this.onChangeSelectedCategory.bind(this);
  }

  onMakerChangeSize(width: number, height: number, offsetX: number, offsetY: number) {
    this.setState({
      imageDisplayInformation: {
        width,
        height,
        offsetX,
        offsetY,
      },
    });
  }

  onChangeSelectedCategory(activeCategory) {
    this.setState({
      activeCategory,
    });
  }

  generateId(): string {
    return `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }

  computeVertices(startX: number, startY: number, width: number, height: number): Coord[] {
    const coords = [
      { x: startX, y: startY },
      { x: startX + width, y: startY },
      { x: startX + width, y: startY + height },
      { x: startX, y: startY + height },
    ];
    return coords.map(d => {
      return {
        x: (d.x - this.state.imageDisplayInformation.offsetX) / this.state.imageDisplayInformation.width,
        y: (d.y - this.state.imageDisplayInformation.offsetY) / this.state.imageDisplayInformation.height,
      };
    });
  }

  onNewBoundingBox(startX: number, startY: number, width: number, height: number) {
    const categories: Record<string, CategorizedBoundingBox[]> = JSON.parse(JSON.stringify(this.state.categories));
    categories[this.state.activeCategory].push({
      category: this.state.activeCategory,
      normalizedVertices: this.computeVertices(startX, startY, width, height),
      name: `bounding-box-${this.state.boundingBoxCounter}`,
      id: this.generateId(),
    });
    this.setState({
      categories,
      boundingBoxCounter: this.state.boundingBoxCounter + 1,
    });
  }

  render() {
    return (
      <>
        <Helmet>
          <title>Picture Annotation</title>
          <meta name="description" content="Draw bounding boxes around objects to annotate in the picture" />
        </Helmet>
        <PageWrapper>
          <LeftPanel>
            <BoundingBoxMaker onNewBoundingBox={this.onNewBoundingBox} onMakerChangeSize={this.onMakerChangeSize} />
          </LeftPanel>
          <ControlPanel>
            <BoundingBoxCategories
              categories={this.state.categories}
              activeCategory={this.state.activeCategory}
              onChangeSelectedCategory={this.onChangeSelectedCategory}
            />
          </ControlPanel>
        </PageWrapper>
      </>
    );
  }
}
