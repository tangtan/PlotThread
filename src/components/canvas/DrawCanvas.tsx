import React, { Component } from 'react';
import { connect } from 'react-redux';
import { view, project, Point } from 'paper';
import { StateType, DispatchType, PathGroup, StoryGraph } from '../../types';
import { addStoryLines, setObject } from '../../store/actions';
import { getToolState } from '../../store/selectors';
import ZoomCanvas from './ZoomCanvas';
import { iStoryline } from 'story-flow';
import { xml } from 'd3-fetch';
import StoryDrawer from '../../utils/animate';
// Layout Utils
import MoveUtil from '../../utils/canvas/move';
import AddLineUtil from '../../utils/canvas/addline';
import GroupUtil from '../../utils/canvas/group';
import CompressUtil from '../../utils/canvas/compress';
import SortUtil from '../../utils/canvas/sort';
import BendUtil from '../../utils/canvas/bend';
import StraightenUtil from '../../utils/canvas/straighten';
// Relationship/Group Utils
import MergeUtil from '../../utils/canvas/merge';
import SplitUtil from '../../utils/canvas/split';
import CollideUtil from '../../utils/canvas/collide';
import TwinUtil from '../../utils/canvas/twin';
import KnotUtil from '../../utils/canvas/knot';
// Line Utils

const mapStateToProps = (state: StateType) => {
  return {
    renderQueue: state.renderQueue,
    selectedObj: state.selectedObj,
    // Layout Utils
    freeMode: getToolState(state, 'FreeMode'),
    addLineState: getToolState(state, 'AddLine'),
    groupState: getToolState(state, 'Group'),
    compressState: getToolState(state, 'Compress'),
    sortState: getToolState(state, 'Sort'),
    bendState: getToolState(state, 'Forward'), //TODO
    straightenState: getToolState(state, 'Straighten'),
    // Relationship/Group Utils
    mergeState: getToolState(state, 'Merge'),
    splitState: getToolState(state, 'Split'),
    collideState: getToolState(state, 'Collide'),
    twineState: getToolState(state, 'Twine'),
    knotState: getToolState(state, 'Knot')
    // Line Utils
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
  storyDrawer: StoryDrawer;
  // Please strictly follow the util order
  // Layout Utils
  moveUtil: MoveUtil;
  addLineUtil: AddLineUtil;
  groupUtil: GroupUtil;
  sortUtil: SortUtil;
  compressUtil: CompressUtil;
  bendUtil: BendUtil;
  straightenUtil: StraightenUtil;
  // Relationship/Group Utils
  mergeUtil: MergeUtil;
  splitUtil: SplitUtil;
  collideUtil: CollideUtil;
  twinUtil: TwinUtil;
  knotUtil: KnotUtil;
};

class DrawCanvas extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      storyXMLUrl: 'xml/StarWars.xml',
      storyLayouter: null,
      storyDrawer: new StoryDrawer(),
      // Layout Utils
      moveUtil: new MoveUtil(hitShapeOption),
      addLineUtil: new AddLineUtil(hitOption),
      groupUtil: new GroupUtil(hitOption),
      sortUtil: new SortUtil(hitOption),
      compressUtil: new CompressUtil(hitOption),
      straightenUtil: new StraightenUtil(hitOption),
      bendUtil: new BendUtil(hitOption),
      // Relationship/Group Utils
      mergeUtil: new MergeUtil(hitOption),
      splitUtil: new SplitUtil(hitOption),
      collideUtil: new CollideUtil(hitOption),
      twinUtil: new TwinUtil(hitOption),
      knotUtil: new KnotUtil(hitOption)
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
    storyLayouter.extent(100, 300, 1250);
    const strokes = this.state.storyDrawer.initGraph(graph);
    this.updateUtils(graph);
    this.props.addStoryLines(strokes);
    this.setState({
      storyLayouter: storyLayouter
    });
  }

  refresh() {
    const orderInfo = this.state.sortUtil.orderInfo;
    const straightenInfo = this.state.straightenUtil.straightenInfo;
    const compressInfo = this.state.compressUtil.compressInfo;
    let graph = this.state.storyLayouter.layout(
      orderInfo,
      straightenInfo,
      compressInfo
    );
    // scale nodes
    this.state.storyLayouter.extent(100, 300, 1250);
    this.updateUtils(graph);
    const strokes = this.state.storyDrawer.updateGraph(graph);
    this.props.addStoryLines(strokes);
  }

  private updateUtils = (graph: StoryGraph) => {
    // Layout Utils
    this.state.moveUtil.updateStoryStore(graph);
    this.state.addLineUtil.updateStoryStore(graph);
    this.state.groupUtil.updateStoryStore(graph);
    this.state.sortUtil.updateStoryStore(graph);
    this.state.straightenUtil.updateStoryStore(graph);
    this.state.compressUtil.updateStoryStore(graph);
    // Relationship/Group Utils
    this.state.mergeUtil.updateStoryStore(graph);
    this.state.splitUtil.updateStoryStore(graph);
    this.state.collideUtil.updateStoryStore(graph);
    this.state.twinUtil.updateStoryStore(graph);
    this.state.knotUtil.updateStoryStore(graph);
  };

  private addCharacter = () => {
    const nameList = this.props.renderQueue.map(vObj =>
      vObj.geometry ? vObj.geometry.name : ''
    );
    const characterInfo = this.state.addLineUtil.characterInfo;
    characterInfo.forEach(info => {
      const [name, startTime, endTime] = info;
      if (nameList.indexOf(name) === -1 && this.state.storyLayouter) {
        this.state.storyLayouter.addCharacter(name, startTime, endTime);
      }
    });
  };

  private addGroup = () => {
    const groupInfo = this.state.groupUtil.groupInfo;
    groupInfo.forEach(info => {
      const [charArr, sTime, eTime] = info;
      this.state.storyLayouter.changeSession(charArr, sTime, eTime);
    });
  };

  private onMouseDown = (e: paper.MouseEvent) => {
    if (this.props.freeMode) {
      this.state.moveUtil.down(e);
    }
    if (this.props.addLineState) {
      this.state.addLineUtil.down(e);
    }
    if (this.props.groupState) {
      this.state.groupUtil.down(e);
    }
    if (this.props.sortState) {
      this.state.sortUtil.down(e);
    }
    if (this.props.compressState) {
      this.state.compressUtil.down(e);
    }
    if (this.props.straightenState) {
      this.state.straightenUtil.down(e);
    }
    if (this.props.bendState) {
      this.state.bendUtil.down(e);
    }
    if (this.props.mergeState) {
      this.state.mergeUtil.down(e);
    }
    if (this.props.twineState) {
      this.state.twinUtil.down(e);
    }
  };

  private onMouseUp = (e: paper.MouseEvent) => {
    if (this.props.freeMode) {
      this.state.moveUtil.up(e);
    }
    if (this.props.addLineState) {
      this.state.addLineUtil.up(e);
      this.addCharacter();
      this.refresh();
    }
    if (this.props.groupState) {
      this.state.groupUtil.up(e);
      this.addGroup();
      this.refresh();
    }
    if (this.props.sortState) {
      this.state.sortUtil.up(e);
      this.refresh();
    }
    if (this.props.compressState) {
      this.state.compressUtil.up(e);
      this.refresh();
    }
    if (this.props.straightenState) {
      this.state.straightenUtil.up(e);
      this.refresh();
    }
    if (this.props.bendState) {
      this.state.bendUtil.up(e);
      this.refresh();
    }
    if (this.props.mergeState) {
      this.state.mergeUtil.up(e);
      this.refresh();
    }
    if (this.props.splitState) {
      this.state.splitUtil.up(e);
      this.refresh();
    }
    if (this.props.collideState) {
      this.state.collideUtil.up(e);
      this.refresh();
    }
    if (this.props.twineState) {
      this.state.twinUtil.up(e);
      this.refresh();
    }
    if (this.props.knotState) {
      this.state.twinUtil.up(e);
      this.refresh();
    }
  };

  private onMouseClick = (e: paper.MouseEvent) => {
    if (this.props.freeMode) {
      this.props.setSelectedObj(e);
    }
  };

  private onMouseMove = (e: paper.MouseEvent) => {
    if (this.props.freeMode) {
      this.state.moveUtil.move(e);
    }
  };

  private onMouseDrag = (e: paper.MouseEvent) => {
    if (this.props.freeMode) {
      this.state.moveUtil.drag(e);
    }
    if (this.props.addLineState) {
      this.state.addLineUtil.drag(e);
    }
    if (this.props.groupState) {
      this.state.groupUtil.drag(e);
    }
    if (this.props.sortState) {
      this.state.sortUtil.drag(e);
    }
    if (this.props.compressState) {
      this.state.compressUtil.drag(e);
    }
    if (this.props.straightenState) {
      this.state.straightenUtil.drag(e);
    }
    if (this.props.bendState) {
      this.state.bendUtil.drag(e);
    }
    if (this.props.mergeState) {
      this.state.mergeUtil.drag(e);
    }
    if (this.props.twineState) {
      this.state.twinUtil.drag(e);
    }
  };

  render() {
    return <ZoomCanvas />;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DrawCanvas);
