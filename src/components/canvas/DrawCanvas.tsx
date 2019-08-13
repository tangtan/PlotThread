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
import CompressUtil from '../../utils/canvas/compress';

const mapStateToProps = (state: StateType) => {
  return {
    renderQueue: state.renderQueue,
    selectedObj: state.selectedObj,
    addLineState: getToolState(state, 'AddLine'),
    groupState: getToolState(state, 'Group'),
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
  groupUtil: GroupUtil;
  sortUtil: SortUtil;
  bendUtil: BendUtil;
  moveUtil: MoveUtil;
  compressUtil: CompressUtil;
};

class DrawCanvas extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      storyXMLUrl: 'xml/StarWars.xml',
      storyLayouter: null,
      storyDrawer: new StoryDrawer(),
      addLineUtil: new AddLineUtil(hitOption),
      groupUtil: new GroupUtil(hitOption),
      sortUtil: new SortUtil(hitOption),
      bendUtil: new BendUtil(hitOption),
      compressUtil: new CompressUtil(hitOption),
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
    const straightenInfo = this.state.bendUtil.straightenInfo;
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
    this.state.addLineUtil.updateStoryStore(graph);
    this.state.groupUtil.updateStoryStore(graph);
    this.state.sortUtil.updateStoryStore(graph);
    this.state.bendUtil.updateStoryStore(graph);
    this.state.moveUtil.updateStoryStore(graph);
    this.state.compressUtil.updateStoryStore(graph);
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
    if (this.props.sortState && this.state.sortUtil) {
      this.state.sortUtil.down(e);
    }
    if (this.props.groupState && this.state.groupUtil) {
      this.state.groupUtil.down(e);
    }
    if (this.props.scaleState && this.state.compressUtil) {
      this.state.compressUtil.down(e);
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
    if (this.props.groupState && this.state.groupUtil) {
      this.state.groupUtil.up(e);
      this.addGroup();
      this.refresh();
    }
    if (this.props.scaleState && this.state.compressUtil) {
      this.state.compressUtil.up(e);
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
      this.addCharacter();
      this.refresh();
    }
    if (this.props.sortState && this.state.sortUtil) {
      this.state.sortUtil.up(e);
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
    if (this.props.scaleState && this.state.compressUtil) {
      this.state.compressUtil.drag(e);
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
    if (this.props.groupState && this.state.groupUtil) {
      this.state.groupUtil.drag(e);
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
