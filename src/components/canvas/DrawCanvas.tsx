import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StateType, DispatchType, VisualObject } from '../../types';
import ZoomCanvas from './ZoomCanvas';
import { Path, Point, Size } from 'paper';

const mapStateToProps = (state: StateType) => {
  return {
    renderQueue: state.renderQueue
  };
};

const mapDispatchToProps = (dispatch: DispatchType) => {
  return {};
};

type Props = {} & ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

type State = {
  errorMsg: string;
};

class DrawCanvas extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      errorMsg: 'Incorrect render type'
    };
  }

  private drawCanvas = (renderQueue: VisualObject[]) => {
    // renderQueue.forEach(renderObj => {
    //   this.drawObject(renderObj.type);
    // });
    if (renderQueue.length > 0) {
      const index = renderQueue.length - 1;
      const renderObj = renderQueue[index];
      this.drawObject(renderObj);
    }
  };

  private drawObject = (renderObj: VisualObject) => {
    switch (renderObj.type) {
      case 'circle':
        this.drawCircle(renderObj);
        break;
      case 'rectangle':
        this.drawRectangle(renderObj);
        break;
      default:
        break;
    }
  };

  private drawCircle = (renderObj: VisualObject) => {
    if (renderObj.type === 'circle') {
      const center = new Point(100, 100);
      const radius = 50;
      const circle = new Path.Circle(center, radius);
      circle.strokeColor = 'black';
      circle.fillColor = 'white';
    } else {
      throw `${this.state.errorMsg} (${renderObj.type}).`;
    }
  };

  private drawRectangle = (renderObj: VisualObject) => {
    if (renderObj.type === 'rectangle') {
      const anchor = new Point(50, 50);
      const size = new Size(100, 100);
      const rect = new Path.Rectangle(anchor, size);
      rect.strokeColor = 'black';
      rect.fillColor = 'white';
    } else {
      throw `${this.state.errorMsg} (${renderObj.type}).`;
    }
  };

  componentDidUpdate() {
    const renderQueue = this.props.renderQueue;
    this.drawCanvas(renderQueue);
  }

  render() {
    return <ZoomCanvas />;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DrawCanvas);
