import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Path, view } from 'paper';
import { StateType, DispatchType } from '../../types';
import ZoomCanvas from './ZoomCanvas';
import { iStoryline } from 'story-flow';
import { xml } from 'd3-fetch';
import { ColorSet } from '../../utils/color';
import SortUtil from '../../utils/canvas/sort';
import StraightenUtil from '../../utils/canvas/straighten';
import ShapeUtil from '../../utils/canvas/shape';
import CompressUtil from '../../utils/canvas/compress';

const mapStateToProps = (state: StateType) => {
  return {
    renderQueue: state.renderQueue,
    compressState: state.toolState.bend,
    sortState: state.toolState.morph,
    straightenState: state.toolState.adjust,
    freeMode: !(
      state.toolState.move ||
      state.toolState.morph ||
      state.toolState.stroke ||
      state.toolState.adjust ||
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
  storyFlower: any;
  strokes: Path[];
  nodes: number[][][];
  names: string[];
  strokeWidth: number;
  duration: number;
  sortUtil: SortUtil;
  straightenUtil: StraightenUtil;
  shapeUtil: ShapeUtil;
  compressUtil: CompressUtil;
};

class DrawCanvas extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      storyXMLUrl: 'xml/JurassicPark.xml',
      storyFlower: null,
      strokes: [],
      nodes: [],
      names: [],
      strokeWidth: 1,
      duration: 1000,
      sortUtil: new SortUtil(hitOption),
      straightenUtil: new StraightenUtil(hitOption),
      shapeUtil: new ShapeUtil(hitShapeOption),
      compressUtil: new CompressUtil(hitOption)
    };
  }

  // init strokes
  async componentDidMount() {
    const xmlUrl = this.state.storyXMLUrl;
    const xmlData = await xml(xmlUrl);
    const storyFlower = new iStoryline();
    storyFlower.readFile(xmlData);
    this.setState({
      storyFlower: storyFlower
    });
    const graph = storyFlower.layout([], [], []);
    storyFlower.extent(100, 300, 1250);
    this.setState({
      nodes: graph.nodes,
      names: graph.names
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

  private restore = () => {
    this.state.sortUtil.restore();
    this.state.straightenUtil.restore();
    this.state.compressUtil.restore();
  };

  private onMouseDown = (e: paper.MouseEvent) => {
    if (this.props.sortState) {
      this.state.sortUtil.down(e);
    }
    if (this.props.compressState) {
      this.state.compressUtil.down(e);
    }
    if (this.props.straightenState) {
      this.state.straightenUtil.down(e);
    }
    if (this.props.freeMode) {
      this.state.shapeUtil.down(e);
    }
  };

  private onMouseUp = (e: paper.MouseEvent) => {
    const nodes = this.state.nodes;
    const names = this.state.names;
    if (this.props.sortState) {
      this.state.sortUtil.up(e, nodes, names);
      this.refresh();
    }
    if (this.props.compressState) {
      this.state.compressUtil.up(e);
    }
    if (this.props.straightenState) {
      this.state.straightenUtil.up(e);
      this.refresh();
    }
    if (this.props.freeMode) {
      this.state.shapeUtil.up(e);
    }
  };

  private onMouseMove = (e: paper.MouseEvent) => {
    if (this.props.freeMode) {
      this.state.shapeUtil.move(e);
    }
  };

  private onMouseDrag = (e: paper.MouseEvent) => {
    if (this.props.sortState) {
      this.state.sortUtil.drag(e);
    }
    if (this.props.compressState) {
      this.state.compressUtil.drag(e);
    }
    if (this.props.straightenState) {
      this.state.straightenUtil.drag(e);
    }
    if (this.props.freeMode) {
      this.state.shapeUtil.drag(e);
    }
  };

  async refresh() {
    const graph = this.state.storyFlower.layout(
      this.state.sortUtil.orderInfo,
      this.state.straightenUtil.straightenInfo,
      []
    );
    // scale nodes
    this.state.storyFlower.extent(100, 300, 1250);
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

  // TODO: fix bug
  // appearing(line: number[][], speed: number, name: string) {
  //   const path = new Path();
  //   path.name = name;
  //   path.strokeColor = 'black';
  //   path.strokeWidth = this.state.strokeWidth;
  //   this.setState({
  //     strokes: [...this.state.strokes, path]
  //   });
  //   let x = line[0][0];
  //   let pos = 1;
  //   path.onFrame = e => {
  //     x += e.delta * speed;
  //     if (x > line[pos][0]) {
  //       path.add(line[pos]);
  //       pos++;
  //     }
  //     if (pos >= line.length) {
  //       path.onFrame = () => {};
  //       return;
  //     }
  //     const start_x = line[pos - 1][0];
  //     const start_y = line[pos - 1][1];
  //     const end_x = line[pos][0];
  //     const end_y = line[pos][1];
  //     const y =
  //       start_y + ((end_y - start_y) * (x - start_x)) / (end_x - start_x);
  //     path.add([x, y]);
  //   };
  // }

  render() {
    return <ZoomCanvas />;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DrawCanvas);
