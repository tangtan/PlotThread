import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Path, view } from 'paper';
import { StateType, DispatchType } from '../../types';
import ZoomCanvas from './ZoomCanvas';
import { iStoryline } from 'story-flow';
import { xml } from 'd3-fetch';
import { ColorSet } from '../../utils/color';
import AddLineUtil from '../../utils/canvas/addline';
import GroupUtil from '../../utils/canvas/group';
import SortUtil from '../../utils/canvas/sort';
import BendUtil from '../../utils/canvas/bend';
import MoveUtil from '../../utils/canvas/move';
import ScaleUtil from '../../utils/canvas/scale';

const mapStateToProps = (state: StateType) => {
  return {
    renderQueue: state.renderQueue,
    addLineState: state.toolState.addLine,
    scaleState: state.toolState.scale,
    sortState: state.toolState.sort,
    bendState: state.toolState.bend,
    freeMode: !(
      state.toolState.move ||
      state.toolState.addLine ||
      state.toolState.scale ||
      state.toolState.sort ||
      state.toolState.bend
    )
  };
};

const mapDispatchToProps = (dispatch: DispatchType) => {
  return {};
};

const hitOption = {
  segments: false,
  stroke: true,
  fill: false,
  tolerance: 5
};

const hitShapeOption = {
  segments: true,
  stroke: true,
  fill: true,
  tolerance: 5
};

type Props = {} & ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

type State = {
  storyXMLUrl: string;
  storyLayouter: any;
  strokes: Path[];
  nodes: number[][][];
  names: string[];
  strokeWidth: number;
  duration: number;
  addLineUtil: AddLineUtil | null;
  sortUtil: SortUtil | null;
  bendUtil: BendUtil | null;
  moveUtil: MoveUtil | null;
  scaleUtil: ScaleUtil | null;
};

class DrawCanvas extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      storyXMLUrl: 'xml/StarWars.xml',
      storyLayouter: null,
      strokes: [],
      nodes: [],
      names: [],
      strokeWidth: 1,
      duration: 1000,
      addLineUtil: null,
      sortUtil: null,
      bendUtil: null,
      scaleUtil: null,
      moveUtil: null
    };
  }

  // init
  async componentDidMount() {
    const xmlUrl = this.state.storyXMLUrl;
    const xmlData = await xml(xmlUrl);
    const storyLayouter = new iStoryline();
    storyLayouter.readFile(xmlData);
    const graph = storyLayouter.layout([], [], []);
    storyLayouter.extent(100, 300, 1250);
    const nodes = graph.nodes;
    const names = graph.names;
    this.setState({
      storyLayouter: storyLayouter,
      nodes: nodes,
      names: names,
      addLineUtil: new AddLineUtil(hitOption, nodes, names),
      sortUtil: new SortUtil(hitOption, nodes, names),
      bendUtil: new BendUtil(hitOption, nodes, names),
      moveUtil: new MoveUtil(hitShapeOption, nodes, names),
      scaleUtil: new ScaleUtil(hitOption, nodes, names)
    });
    graph.nodes.forEach((line: number[][], index: number) => {
      const pathStr = this.drawSmoothPath(line);
      const path = new Path(pathStr);
      path.name = graph.names[index];
      path.strokeColor = ColorSet.black;
      path.strokeWidth = this.state.strokeWidth;
      this.setState({
        strokes: [...this.state.strokes, path]
      });
    });
    view.onMouseDown = this.onMouseDown;
    view.onMouseUp = this.onMouseUp;
    view.onMouseMove = this.onMouseMove;
    view.onMouseDrag = this.onMouseDrag;
  }

  private onMouseDown = (e: paper.MouseEvent) => {
    if (this.props.sortState && this.state.sortUtil) {
      this.state.sortUtil.down(e);
    }
    if (this.props.scaleState && this.state.scaleUtil) {
      this.state.scaleUtil.down(e);
    }
    if (this.props.bendState && this.state.bendUtil) {
      this.state.bendUtil.down(e);
    }
    if (this.props.freeMode && this.state.moveUtil) {
      this.state.moveUtil.down(e);
    }
    if (this.props.addLineState && this.state.addLineUtil) {
      this.state.addLineUtil.down(e);
    }
  };

  private onMouseUp = (e: paper.MouseEvent) => {
    if (this.props.sortState && this.state.sortUtil) {
      this.state.sortUtil.up(e);
      this.refresh();
    }
    if (this.props.scaleState && this.state.scaleUtil) {
      this.state.scaleUtil.up(e);
      this.refresh();
    }
    if (this.props.bendState && this.state.bendUtil) {
      this.state.bendUtil.up(e);
      this.refresh();
    }
    if (this.props.freeMode && this.state.moveUtil) {
      this.state.moveUtil.up(e);
    }
    if (this.props.addLineState && this.state.addLineUtil) {
      this.state.addLineUtil.up(e);
      this.refresh();
    }
  };

  private onMouseMove = (e: paper.MouseEvent) => {
    if (this.props.freeMode && this.state.moveUtil) {
      this.state.moveUtil.move(e);
    }
  };

  private onMouseDrag = (e: paper.MouseEvent) => {
    if (this.props.sortState && this.state.sortUtil) {
      this.state.sortUtil.drag(e);
    }
    if (this.props.scaleState && this.state.scaleUtil) {
      this.state.scaleUtil.drag(e);
    }
    if (this.props.bendState && this.state.bendUtil) {
      this.state.bendUtil.drag(e);
    }
    if (this.props.freeMode && this.state.moveUtil) {
      this.state.moveUtil.drag(e);
    }
    if (this.props.addLineState && this.state.addLineUtil) {
      this.state.addLineUtil.drag(e);
    }
  };

  translateCompressInfo(compressInfo: any[][]) {
    let _compressInfo = compressInfo.map(item => [
      this.state.storyLayouter.index2Time(item[0], item[1]),
      this.state.storyLayouter.index2Time(item[2], item[3]),
      item[4]
    ]);
    return _compressInfo;
  }

  async refresh() {
    const orderInfo = this.state.sortUtil ? this.state.sortUtil.orderInfo : [];
    const straightenInfo = this.state.bendUtil
      ? this.state.bendUtil.straightenInfo
      : [];
    const compressInfo = this.state.scaleUtil
      ? this.state.scaleUtil.compressInfo
      : [];
    const _compressInfo = this.translateCompressInfo(compressInfo);
    const characterInfo = this.state.addLineUtil
      ? this.state.addLineUtil.characterInfo
      : [];
    characterInfo.forEach(item => {
      console.log(item[0], item[1], item[2]);
      this.state.storyLayouter.addCharacter(item[0], item[1], item[2]);
    });
    const graph = this.state.storyLayouter.layout(
      orderInfo,
      straightenInfo,
      _compressInfo
    );
    // scale nodes
    this.state.storyLayouter.extent(100, 300, 1250);
    const nodes: number[][][] = graph.nodes;
    const names: string[] = graph.names;
    this.setState({
      nodes: nodes,
      names: names
    });
    nodes.forEach((line, index) => {
      const pathStr = this.drawSmoothPath(line);
      const pathTo = new Path(pathStr);
      pathTo.set({ insert: false });
      const path = this.state.strokes[index];
      const pathFrom = path.clone({ insert: false }) as Path;
      const duration = this.state.duration;
      path.tween(duration).onUpdate = (e: any) => {
        path.interpolate(pathFrom, pathTo, e.factor);
      };
    });
  }

  drawSmoothPath(points: number[][]) {
    let pathStr = `M ${points[0][0]} ${points[0][1]} `;
    let i, len;
    for (i = 1, len = points.length; i < len - 1; i += 2) {
      const rPoint = points[i];
      const lPoint = points[i + 1];
      const middleX = (rPoint[0] + lPoint[0]) / 2;
      pathStr += `L ${rPoint[0]} ${rPoint[1]} `;
      if (rPoint[1] !== lPoint[1]) {
        pathStr += `C ${middleX} ${rPoint[1]} ${middleX} ${lPoint[1]} ${
          lPoint[0]
        } ${lPoint[1]} `;
      } else {
        pathStr += `L ${lPoint[0]} ${lPoint[1]} `;
      }
    }
    pathStr += `L ${points[i][0]} ${points[i][1]}`;
    return pathStr;
  }

  drawInitialPathStr(points: number[][]) {
    return `M ${points[0][0]} ${points[0][1]} `;
  }

  render() {
    return <ZoomCanvas />;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DrawCanvas);
