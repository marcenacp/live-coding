import React from "react";
import { Button } from "react-bootstrap";

import { FullDiv } from "app/components/FullDiv";
import { CategorizedBoundingBox, KiliBoundingBoxAnnotation } from "types";
import BoundingBoxCategory from "../BoundingBoxCategory";
import { CenteredDiv } from "app/components/CenteredDiv";

type Props = {
  categories: Record<string, CategorizedBoundingBox[]>;
  activeCategory: string;
  onChangeSelectedCategory: (categoryName: string) => void;
};

type State = {
  exportData: string;
};

export default class BoundingBoxCategories extends React.Component<
  Props,
  State
> {
  downloadLink: React.RefObject<any>;

  constructor(props) {
    super(props);
    this.state = {
      exportData: "",
    };
    this.downloadLink = React.createRef();
    this.exportToKili = this.exportToKili.bind(this);
  }

  boundingBoxToAnnotationKili(
    boundingBox: CategorizedBoundingBox
  ): KiliBoundingBoxAnnotation {
    return {
      boundingPoly: {
        normalizedVertices: boundingBox.normalizedVertices,
      },
      categories: [
        {
          confidence: 100,
          name: boundingBox.category,
        },
      ],
      mid: boundingBox.id,
      score: null,
      type: "rectangle",
    };
  }

  exportToKili() {
    const annotations: KiliBoundingBoxAnnotation[] = [];
    Object.keys(this.props.categories).forEach((key) => {
      this.props.categories[key].forEach((boundingBox) => {
        annotations.push(this.boundingBoxToAnnotationKili(boundingBox));
      });
    });
    const res = {
      annotations,
    };

    this.setState(
      {
        exportData: encodeURI(
          "data:text/json;charset=utf-8," + JSON.stringify(res)
        ),
      },
      () => {
        this.downloadLink.current.click();
      }
    );

    return res;
  }

  render() {
    return (
      <FullDiv className="categories-container">
        <CenteredDiv>
          <Button
            className="button"
            onClick={this.exportToKili}
            variant="outline-dark"
            size="sm"
          >
            Export to Kili format
          </Button>
          <a
            style={{ display: "none" }}
            href={this.state.exportData}
            ref={this.downloadLink}
            download="export.json"
          >
            Export
          </a>
        </CenteredDiv>
        <br />
        <div>
          <h2>Bounding boxes</h2>
        </div>
        {Object.entries(this.props.categories).map((d, i) => (
          <BoundingBoxCategory
            key={i}
            categoryName={d[0]}
            boundingBoxes={d[1]}
            onChangeSelectedCategory={this.props.onChangeSelectedCategory}
            activeCategory={this.props.activeCategory}
          />
        ))}
      </FullDiv>
    );
  }
}
