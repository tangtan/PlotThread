import React, { Component } from 'react';
import { connect } from 'react-redux';
import { view, project, Path, Point } from 'paper';
import { StateType, DispatchType, PathGroup, StoryGraph } from '../../types';
import { addStoryLines, setObject } from '../../store/actions';
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
    selectedObj: state.selectedObj,
    addLineState: getToolState(state, 'AddLine'),
    scaleState: getToolState(state, 'Scale'),
    sortState: getToolState(state, 'Sort'),
    bendState: getToolState(state, 'Bend'),
    freeMode: getToolState(state, 'FreeMode')
  };
};

const mapDispatchToProps = (dispatch: DispatchType) => {
  return {
    addStoryLines: (strokes: PathGroup[]) => dispatch(addStoryLines(strokes)),
    setSelectedObj: (e: paper.MouseEvent) =>
      dispatch(setObject(e.point || new Point(-100, -100)))
  };
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
  addLineUtil: AddLineUtil;
  sortUtil: SortUtil;
  bendUtil: BendUtil;
  moveUtil: MoveUtil;
  scaleUtil: ScaleUtil;
};

class DrawCanvas extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      storyXMLUrl: 'xml/StarWars.xml',
      storyDrawer: new StoryDrawer(),
      storyLayouter: null,
      addLineUtil: new AddLineUtil(hitOption),
      sortUtil: new SortUtil(hitOption),
      bendUtil: new BendUtil(hitOption),
      scaleUtil: new ScaleUtil(hitOption),
      moveUtil: new MoveUtil(hitShapeOption)
    };
  }

  // init
  async componentDidMount() {
    console.log(project);
    view.onMouseDown = this.onMouseDown;
    view.onMouseUp = this.onMouseUp;
    view.onMouseMove = this.onMouseMove;
    view.onMouseDrag = this.onMouseDrag;
    view.onDoubleClick = this.onMouseClick;
    const xmlUrl = this.state.storyXMLUrl;
    const xmlData = await xml(xmlUrl);
    const storyLayouter = new iStoryline();
    storyLayouter.readFile(xmlData);
    const graph = storyLayouter.layout([], [], []);
    console.log(graph);
    storyLayouter.extent(100, 300, 1250);
    const strokes = this.state.storyDrawer.initGraph(graph);
    this.updateUtils(graph);
    this.props.addStoryLines(strokes);
    this.setState({
      storyLayouter: storyLayouter
    });
  }

  private updateUtils = (graph: StoryGraph) => {
    this.state.addLineUtil.updateStoryStore(graph);
    this.state.sortUtil.updateStoryStore(graph);
    this.state.bendUtil.updateStoryStore(graph);
    this.state.moveUtil.updateStoryStore(graph);
    this.state.scaleUtil.updateStoryStore(graph);
  };

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

  private onMouseClick = (e: paper.MouseEvent) => {
    if (this.props.freeMode) {
      this.props.setSelectedObj(e);
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

  refresh() {
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
    this.updateUtils(graph);
    const strokes = this.state.storyDrawer.updateGraph(graph);
    this.props.addStoryLines(strokes);
  }

  render() {
    return <ZoomCanvas />;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DrawCanvas);
