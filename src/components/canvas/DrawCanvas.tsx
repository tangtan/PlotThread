import React, { Component } from 'react';
import { connect } from 'react-redux';
import { view, project } from 'paper';
import { StateType, DispatchType } from '../../types';
import { getToolState } from '../../store/selectors';
import ZoomCanvas from './ZoomCanvas';
import { iStoryline } from 'story-flow';
import { xml } from 'd3-fetch';
import { ColorSet } from '../../utils/color';
import StoryDrawer from '../../utils/animate';
import AddLineUtil from '../../utils/canvas/addline';
import GroupUtil from '../../utils/canvas/group';
import SortUtil from '../../utils/canvas/sort';
import BendUtil from '../../utils/canvas/bend';
import MoveUtil from '../../utils/canvas/move';
import ScaleUtil from '../../utils/canvas/scale';

const mapStateToProps = (state: StateType) => {
  return {
    renderQueue: state.renderQueue,
    addLineState: getToolState(state, 'AddLine'),
    scaleState: getToolState(state, 'Scale'),
    sortState: getToolState(state, 'Sort'),
    bendState: getToolState(state, 'Bend'),
    freeMode: getToolState(state, 'FreeMode')
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
  segments: false,
  stroke: true,
  fill: true,
  tolerance: 5
};

type Props = {} & ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

type State = {
  storyXMLUrl: string;
  storyLayouter: any;
  storyDrawer: StoryDrawer;
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
      storyDrawer: new StoryDrawer(),
      storyLayouter: null,
      addLineUtil: null,
      sortUtil: null,
      bendUtil: null,
      scaleUtil: null,
      moveUtil: null
    };
  }

  // init
  async componentDidMount() {
    console.log(project);
    view.onMouseDown = this.onMouseDown;
    view.onMouseUp = this.onMouseUp;
    view.onMouseMove = this.onMouseMove;
    view.onMouseDrag = this.onMouseDrag;
    const xmlUrl = this.state.storyXMLUrl;
    const xmlData = await xml(xmlUrl);
    const storyLayouter = new iStoryline();
    storyLayouter.readFile(xmlData);
    const graph = storyLayouter.layout([], [], []);
    storyLayouter.extent(100, 300, 1250);
    const names = graph.names;
    const nodes = graph.nodes;
    this.state.storyDrawer.initGraph(graph);
    this.setState({
      storyLayouter: storyLayouter,
      addLineUtil: new AddLineUtil(hitOption, nodes, names),
      sortUtil: new SortUtil(hitOption, nodes, names),
      bendUtil: new BendUtil(hitOption, nodes, names),
      moveUtil: new MoveUtil(hitShapeOption, nodes, names),
      scaleUtil: new ScaleUtil(hitOption, nodes, names)
    });
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
    // characterInfo.forEach(item => {
    //   this.state.storyLayouter.smartAddLine(item[0], item[1], item[2]);
    // });
    // 注意在这个readFile后，storyLayouter被保存了，每次addLine的记录也被保存，因此只需add新的线
    const newCharacterIndex = characterInfo.length - 1;
    const newCharacter = characterInfo[newCharacterIndex];
    this.state.storyLayouter.smartAddLine(
      newCharacter[0],
      newCharacter[1],
      newCharacter[2]
    );
    let graph = this.state.storyLayouter.layout(
      orderInfo,
      straightenInfo,
      _compressInfo
    );
    // scale nodes
    this.state.storyLayouter.extent(100, 300, 1250);
    this.state.storyDrawer.updateGraph(graph);
  }

  render() {
    return <ZoomCanvas />;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DrawCanvas);
