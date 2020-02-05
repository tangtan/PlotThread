import React, { Component } from 'react';
import { connect } from 'react-redux';
import paper, { view, Point } from 'paper';
import * as d3Zoom from 'd3-zoom';
import { select, event } from 'd3-selection';
import { StateType } from '../../types';
import { getToolState } from '../../store/selectors';

const mapStateToProps = (state: StateType) => {
  return {
    zoomState: getToolState(state, 'Zoom') as boolean,
    downloadPicState: getToolState(state, 'DownloadPic') as boolean
  };
};

type Props = {} & ReturnType<typeof mapStateToProps>;

type State = {
  transformX: number;
  transformY: number;
  transformK: number;
};

interface CanvasDatum {
  width: number;
  height: number;
  radius: number;
}

class ZoomCanvas extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      transformX: 0,
      transformY: 0,
      transformK: 1
    };
  }

  componentDidMount() {
    const canvas = select<HTMLCanvasElement, any>('canvas');

    const self = this;

    function zoomedCanvas(this: HTMLCanvasElement, d: CanvasDatum) {
      const e = event as d3Zoom.D3ZoomEvent<HTMLCanvasElement, any>;
      // console.log(e.transform.x, e.transform.y, e.transform.k, view.zoom);
      if (this && self.props.zoomState) {
        // pan
        const _transformX = e.transform.x - self.state.transformX;
        const _transformY = e.transform.y - self.state.transformY;
        const translateVec = new Point(_transformX, _transformY);
        view.translate(translateVec);

        // zoom
        const _transformK = e.transform.k / self.state.transformK;
        view.scale(_transformK);

        self.setState({
          transformX: e.transform.x,
          transformY: e.transform.y,
          transformK: e.transform.k
        });
      }
    }

    let canvasZoom: d3Zoom.ZoomBehavior<HTMLCanvasElement, CanvasDatum>;

    canvasZoom = d3Zoom
      .zoom<HTMLCanvasElement, CanvasDatum>()
      .scaleExtent([1 / 2, 8])
      .on('zoom', zoomedCanvas)
      .filter(() => {
        return self.props.zoomState;
      });

    if (canvas) {
      canvas.call(canvasZoom);
      paper.setup('canvas');
    }

    if (this.props.downloadPicState) {
    }
  }

  render() {
    return (
      <canvas
        id="canvas"
        className="canvas"
        style={{ width: '100vw', height: '100vh' }}
      />
    );
  }
}

export default connect(mapStateToProps, null)(ZoomCanvas);
