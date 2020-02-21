import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StateType, DispatchType } from '../../../../../types';
import { Button } from 'antd';
import { iStoryline } from 'iStoryline';
import { setTool } from '../../../../../store/actions';
import { getCurrentPredictQueue } from '../../../../../store/selectors';
import { svg } from 'd3-fetch';

const mapStateToProps = (state: StateType) => {
  return {
    historyQueue: state.historyQueue,
    predictQueue: getCurrentPredictQueue(state)
  };
};

const mapDispatchToProps = (dispatch: DispatchType) => {
  return {};
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
      const nodes = graph.paths;
      const newNodes = nodes.map((line: any) => {
        const newLine = line.map((seg: any) => {
          const newSeg = seg.map((point: any) => {
            let newPoint = [];
            newPoint[0] = point[0] / 4.5;
            newPoint[1] = point[1] / 3;
            return newPoint;
          });
          return newSeg;
        });
        return newLine;
      });
      const pathStrs = newNodes.map((line: any) => {
        const pathStr = this.genSimplePathStr(line);
        return pathStr;
      });
      const istorylines = pathStrs.map((pathStr: any) => (
        <path d={pathStr} fill="transparent" stroke="black"></path>
      ));
      canvasQueue[i] = (
        <svg
          width="330px"
          height="220px"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="98%" height="98%" fill="white" x="1%" y="1%" />
          {istorylines}
        </svg>
      );
    }
    return canvasQueue;
  }
  clickNext() {}
  clickLast() {}
  render() {
    let canvasQueue = this.getCanvasQueue();
    return (
      <div className="template">
        {canvasQueue}
        <Button
          type="ghost"
          style={{ width: '40%', margin: '20px 10px' }}
          onClick={() => this.clickNext()}
        >
          Next
        </Button>
        <Button
          type="ghost"
          style={{ width: '40%', margin: '20px 10px' }}
          onClick={() => this.clickLast()}
        >
          Last
        </Button>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Template);
