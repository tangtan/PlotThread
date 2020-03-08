import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StateType, DispatchType } from '../../../../../types';
import { Button, Icon } from 'antd';
import { iStoryline } from 'iStoryline';
import {
  nextPredictAction,
  lastPredictAction,
  backPointerAction,
  forwardPointerAction,
  abandonPointerAction
} from '../../../../../store/actions';
import { getCurrentPredictQueue } from '../../../../../store/selectors';

const mapStateToProps = (state: StateType) => {
  return {
    historyQueue: state.historyQueue,
    predictQueue: getCurrentPredictQueue(state)
  };
};

const mapDispatchToProps = (dispatch: DispatchType) => {
  return {
    nextPredictAction: () => dispatch(nextPredictAction()),
    lastPredictAction: () => dispatch(lastPredictAction()),
    backPointerAction: () => dispatch(backPointerAction()),
    forwardPointerAction: () => dispatch(forwardPointerAction()),
    abandonPointerAction: () => dispatch(abandonPointerAction())
  };
};

type Props = {} & ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

type State = {
  storyLayouter: any;
};

class Template extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { storyLayouter: new iStoryline() };
  }
  genSmoothPathStr(points: any) {
    let pathStr = `M ${points[0][0]} ${points[0][1]} `;
    let i, len;
    for (i = 1, len = points.length; i < len - 1; i += 2) {
      const rPoint = points[i];
      const lPoint = points[i + 1];
      const middleX = (rPoint[0] + lPoint[0]) / 2;
      pathStr += `L ${rPoint[0]} ${rPoint[1]} `;
      if (rPoint[1] !== lPoint[1]) {
        pathStr += `C ${middleX} ${rPoint[1]} ${middleX} ${lPoint[1]} ${lPoint[0]} ${lPoint[1]} `;
      } else {
        pathStr += `L ${lPoint[0]} ${lPoint[1]} `;
      }
    }
    if (i < len) pathStr += `L ${points[i][0]} ${points[i][1]}`;
    else pathStr += `L ${points[i - 1][0]} ${points[i - 1][1]}`;
    return pathStr;
  }
  genSimplePathStr(points: any) {
    let pathStr = `M ${points[0][0]} ${points[0][1]} `;
    let i, len;
    for (i = 1, len = points.length; i < len; i += 1) {
      const rPoint = points[i];
      pathStr += `L ${rPoint[0]} ${rPoint[1]} `;
    }
    return pathStr;
  }
  getCanvasQueue() {
    let canvasQueue = [];
    for (let i = 0; i < this.props.predictQueue.length; i++) {
      const graph = this.state.storyLayouter._layout(
        this.props.predictQueue[i].layout,
        this.props.predictQueue[i].protoc
      );
      const nodes = [];
      for (let i = 0; i < graph.paths.length; i++) {
        if (graph.names[i] !== 'RABBIT') {
          nodes.push(graph.paths[i]);
        }
      }
      const newNodes = nodes.map((line: any) => {
        const newLine = line.map((seg: any) => {
          const newSeg = seg.map((point: any) => {
            let newPoint = [];
            newPoint[0] = (point[0] - 300) / 4;
            newPoint[1] = (point[1] - 300) / 3;
            return newPoint;
          });
          return newSeg;
        });
        return newLine;
      });
      const pathStrs = newNodes.map((line: any) => {
        const segStrs = line.map((seg: any) => {
          const pathStr = this.genSmoothPathStr(seg);
          return pathStr;
        });
        let path = '';
        for (let i = 0; i < segStrs.length; i++) {
          path += segStrs[i];
        }
        return path;
      });
      const storylines = pathStrs.map((pathStr: any) => (
        <path d={pathStr} fill="transparent" stroke="white"></path>
      ));
      canvasQueue[i] = (
        <div
          className="svg-bg"
          style={{
            background: 'black',
            margin: '5px 0',
            opacity: '0.4'
          }}
        >
          <svg
            width="100%"
            height="30%"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          >
            {storylines}
          </svg>
        </div>
      );
    }
    return canvasQueue;
  }
  clickNext() {
    this.props.nextPredictAction();
  }
  clickLast() {
    this.props.lastPredictAction();
  }
  downCompare() {
    this.props.backPointerAction();
  }
  upCompare() {
    this.props.forwardPointerAction();
  }
  clickAbandon() {
    this.props.abandonPointerAction();
  }
  render() {
    let canvasQueue = this.getCanvasQueue();
    return (
      <div className="template">
        <div
          className="canvasqueue"
          style={{
            overflowY: 'auto',
            overflowX: 'auto',
            width: '100%',
            height: '750px'
          }}
        >
          {canvasQueue}
        </div>
        <Button
          type="ghost"
          style={{ width: '20%', margin: '20px 5px' }}
          onClick={() => this.clickLast()}
        >
          <img src="icons/up.png" width="30px" height="30px" />
        </Button>
        <Button
          type="ghost"
          style={{ width: '20%', margin: '5px 10px' }}
          onClick={() => this.clickNext()}
        >
          <img src="icons/down.png" width="30px" height="30px" />
        </Button>
        <Button
          type="link"
          ghost
          style={{
            background: '#34373e'
          }}
          size="large"
          shape="circle"
          onMouseDown={() => this.downCompare()}
          onMouseUp={() => this.upCompare()}
        >
          <img src="icons/compare.png" width="40px" height="40px" />
        </Button>
        <Button
          type="ghost"
          style={{ width: '30%', margin: '10px' }}
          onClick={() => this.clickAbandon()}
        >
          Abandon
        </Button>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Template);
