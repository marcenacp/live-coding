import React, { MouseEvent } from "react";
import * as d3 from "d3";
import { FullDiv } from "app/components/FullDiv";
import styles from "./BoundingBoxMaker.module.css";

const IMAGE_WIDTH = 800;
const IMAGE_HEIGHT = 600;

type Props = {
  onNewBoundingBox: (
    startX: number,
    startY: number,
    width: number,
    height: number
  ) => void;
  onMakerChangeSize: (
    imageWidth: number,
    imageHeight: number,
    offsetX: number,
    offsetY: number
  ) => void;
};

type State = {
  isDrawing: boolean;
  startX: number;
  startY: number;
  svg?: d3.Selection<d3.BaseType, unknown, HTMLElement, any>;
  drawingRect?: d3.Selection<SVGRectElement, unknown, HTMLElement, any>;
};

export default class BoundingBoxMaker extends React.Component<Props, State> {
  svgContainer: React.RefObject<any>;

  constructor(props) {
    super(props);
    this.state = {
      isDrawing: false,
      startX: 0,
      startY: 0,
    };

    this.svgContainer = React.createRef();

    this.startDrawingBoundingBox = this.startDrawingBoundingBox.bind(this);
    this.endDrawingBoundingBox = this.endDrawingBoundingBox.bind(this);
    this.redrawBoundingbox = this.redrawBoundingbox.bind(this);
    this.recomputeImageSize = this.recomputeImageSize.bind(this);
  }

  /**
   * Image width and height depends of the window size of the client and the ratio between width and height.
   **/
  recomputeImageSize() {
    // const containerHeight = this.svgContainer.current.clientHeight;
    // const containerWidth = this.svgContainer.current.clientWidth;
    // const stretchRatio = Math.min(containerHeight - IMAGE_HEIGHT, containerWidth - IMAGE_WIDTH);
    // const imageWidth = IMAGE_WIDTH + stretchRatio;
    // const imageHeight = IMAGE_HEIGHT + stretchRatio;
    // const offsetX = containerWidth / 2 - imageWidth / 2;
    // const offsetY = containerHeight / 2 - imageHeight / 2;

    this.props.onMakerChangeSize(IMAGE_WIDTH, IMAGE_HEIGHT, 0, 0);
  }

  componentDidMount() {
    requestAnimationFrame(() => {
      const svg = d3.select(".picture-display-container svg");
      this.setState({
        svg,
      });
      this.recomputeImageSize();
    });
    window.addEventListener("resize", this.recomputeImageSize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.recomputeImageSize);
  }

  getXYFromEvent(mouseEvent: MouseEvent) {
    return {
      xValue: mouseEvent.clientX,
      yValue: mouseEvent.clientY,
    };
  }

  computeRectFromEvent(mouseEvent: MouseEvent) {
    const { xValue, yValue } = this.getXYFromEvent(mouseEvent);
    let width = xValue - this.state.startX;
    let height = yValue - this.state.startY;

    // You can't have a negative height or width in svg
    // shift start X and start Y when user drag to the top left direction
    let startX = this.state.startX;
    if (width < 0) {
      width = -width;
      startX = this.state.startX - width;
    }

    let startY = this.state.startY;
    if (height < 0) {
      height = -height;
      startY = this.state.startY - height;
    }

    return {
      startX,
      startY,
      width,
      height,
    };
  }

  startDrawingBoundingBox(mouseEvent: MouseEvent) {
    const { xValue, yValue } = this.getXYFromEvent(mouseEvent);

    const drawingRect =
      this.state.svg &&
      this.state.svg
        .select("g.bounding-boxes-group")
        .append("rect")
        .attr("x", xValue)
        .attr("y", yValue)
        .attr("class", styles["bounding-box-rect"]);

    this.setState({
      startX: xValue,
      startY: yValue,
      isDrawing: true,
      drawingRect,
    });
  }

  endDrawingBoundingBox(mouseEvent: MouseEvent) {
    const { startX, startY, width, height } = this.computeRectFromEvent(
      mouseEvent
    );

    this.props.onNewBoundingBox(startX, startY, width, height);
    this.setState({
      isDrawing: false,
      drawingRect: undefined,
    });
  }

  redrawBoundingbox(mouseEvent: MouseEvent) {
    if (!this.state.isDrawing) return false;

    const { startX, startY, width, height } = this.computeRectFromEvent(
      mouseEvent
    );
    this.state.drawingRect &&
      this.state.drawingRect
        .attr("x", startX)
        .attr("y", startY)
        .attr("width", width)
        .attr("height", height);
  }

  render() {
    return (
      <FullDiv className="picture-display-container" ref={this.svgContainer}>
        <svg
          height="100%"
          width="100%"
          onMouseDown={this.startDrawingBoundingBox}
          onMouseUp={this.endDrawingBoundingBox}
          onMouseMove={this.redrawBoundingbox}
          className={styles.svg}
        >
          <g className="root-group">
            <g className="background-image-group">
              <image
                href={`https://picsum.photos/${IMAGE_WIDTH}/${IMAGE_HEIGHT}`}
                width="100%"
                height="100%"
              ></image>
            </g>
            <g className="bounding-boxes-group"></g>
          </g>
        </svg>
      </FullDiv>
    );
  }
}
