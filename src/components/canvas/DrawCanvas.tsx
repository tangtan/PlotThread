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
import StrokeUtil from '../../utils/canvas/stroke';

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
    knotState: getToolState(state, 'Knot'),
    // Line Utils
    strokeDashState: getToolState(state, 'StrokeDash'),
    strokeWidthState: getToolState(state, 'StrokeWidth'),
    strokeZigzagState: getToolState(state, 'StrokeZigzag'),
    strokeWaveState: getToolState(state, 'StrokeWave')
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
  // Line Utils
  strokeUtil: StrokeUtil;
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
      knotUtil: new KnotUtil(hitOption),
      // Line Utils
      strokeUtil: new StrokeUtil(hitOption)
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
    storyLayouter.readXMLFile(xmlData);
    const graph = storyLayouter.layout([], [], []);
    storyLayouter.extent(100, 300, 1250);
    const strokes = this.state.storyDrawer.initGraph(graph);
    this.updateUtils(graph);
    this.props.addStoryLines(strokes);
    this.setState({
      storyLayouter: storyLayouter
    });
  }

  refresh(graph: StoryGraph) {
    // scale nodes
    this.state.storyLayouter.extent(100, 300, 1250);
    this.updateUtils(graph);
    const strokes = this.state.storyDrawer.updateGraph(graph);
    this.props.addStoryLines(strokes);
  }

  // TODO: refactor
  refreshStyle(graph: StoryGraph, styleSegments: any[][]) {
    this.refresh(graph);
    // console.log(graph, styleSegments);
    styleSegments.forEach(config => {
      const [name, segmentID, style] = config;
      this.props.renderQueue.forEach(vObj => {
        if (vObj.geometry && vObj.geometry.name === name) {
          if (vObj.geometry.children) {
            // debugger;
            const strokePath = vObj.geometry.children[segmentID];
            switch (style) {
              case 'Dash':
                strokePath.dashArray = [10, 4];
                break;
              case 'Width':
                strokePath.strokeWidth = 10;
              default:
                break;
            }
          }
        }
      });
    });
  }

  private updateUtils = (graph: StoryGraph) => {
    // Layout Utils
    this.state.moveUtil.updateStoryStore(graph);
    this.state.addLineUtil.updateStoryStore(graph);
    this.state.groupUtil.updateStoryStore(graph);
    this.state.sortUtil.updateStoryStore(graph);
    this.state.straightenUtil.updateStoryStore(graph);
    this.state.bendUtil.updateStoryStore(graph);
    this.state.compressUtil.updateStoryStore(graph);
    // Relationship/Group Utils
    this.state.mergeUtil.updateStoryStore(graph);
    this.state.splitUtil.updateStoryStore(graph);
    this.state.collideUtil.updateStoryStore(graph);
    this.state.twinUtil.updateStoryStore(graph);
    this.state.knotUtil.updateStoryStore(graph);
    // Line Utils
    this.state.strokeUtil.updateStoryStore(graph);
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
    if (this.props.collideState) {
      this.state.collideUtil.down(e);
    }
    if (this.props.twineState) {
      this.state.twinUtil.down(e);
    }
    if (this.props.knotState) {
      this.state.knotUtil.down(e);
    }
    if (
      this.props.strokeDashState ||
      this.props.strokeWidthState ||
      this.props.strokeZigzagState ||
      this.props.strokeWaveState
    ) {
      this.state.strokeUtil.down(e);
    }
  };

  private onMouseUp = (e: paper.MouseEvent) => {
    if (this.props.freeMode) {
      this.state.moveUtil.up(e);
    }
    if (this.props.addLineState) {
      this.state.addLineUtil.up(e);
      const graph = this.state.storyLayouter.addCharacter(
        this.state.addLineUtil.characterInfo
      );
      this.refresh(graph);
    }
    if (this.props.groupState) {
      this.state.groupUtil.up(e);
      const graph = this.state.storyLayouter.changeSession(
        this.state.groupUtil.groupInfo
      );
      this.refresh(graph);
    }
    if (this.props.sortState) {
      this.state.sortUtil.up(e);
      const graph = this.state.storyLayouter.order(
        this.state.sortUtil.orderInfo
      );
      this.refresh(graph);
    }
    if (this.props.compressState) {
      this.state.compressUtil.up(e);
      const graph = this.state.storyLayouter.compress(
        this.state.compressUtil.compressInfo
      );
      this.refresh(graph);
    }
    if (this.props.straightenState) {
      this.state.straightenUtil.up(e);
      if (this.state.straightenUtil.status) {
        const graph = this.state.storyLayouter.straighten(
          this.state.straightenUtil.straightenInfo
        );
        this.refresh(graph);
      }
    }
    if (this.props.bendState) {
      this.state.bendUtil.up(e);
      if (this.state.bendUtil.status) {
        const graph = this.state.storyLayouter.bend(
          this.state.bendUtil.bendInfo
        );
        this.refresh(graph);
      }
    }
    if (this.props.mergeState) {
      this.state.mergeUtil.up(e);
      if (this.state.mergeUtil.status) {
        const graph = this.state.storyLayouter.merge(
          this.state.mergeUtil.mergeInfo
        );
        this.refresh(graph);
      }
    }
    if (this.props.splitState) {
      this.state.splitUtil.up(e);
      const graph = this.state.storyLayouter.split(
        this.state.splitUtil.splitInfo
      );
      this.refresh(graph);
    }
    if (this.props.collideState) {
      this.state.collideUtil.up(e);
      if (this.state.collideUtil.status) {
        const graph = this.state.storyLayouter.collide(
          this.state.collideUtil.collideInfo
        );
        this.refresh(graph);
      }
    }
    if (this.props.twineState) {
      this.state.twinUtil.up(e);
      if (this.state.twinUtil.status) {
        const graph = this.state.storyLayouter.twine(
          this.state.twinUtil.twinInfo
        );
        this.refresh(graph);
      }
    }
    if (this.props.knotState) {
      this.state.knotUtil.up(e);
      if (this.state.knotUtil.status) {
        const graph = this.state.storyLayouter.knot(
          this.state.knotUtil.knotInfo
        );
        this.refresh(graph);
      }
    }
    if (this.props.strokeDashState) {
      this.state.strokeUtil.up(e, 'Dash');
      if (this.state.strokeUtil.status) {
        const [graph, styleSegments] = this.state.storyLayouter.divide(
          this.state.strokeUtil.divideInfo
        );
        this.refreshStyle(graph, styleSegments);
      }
    }
    if (this.props.strokeWidthState) {
      this.state.strokeUtil.up(e, 'Width');
      if (this.state.strokeUtil.status) {
        const [graph, styleSegments] = this.state.storyLayouter.divide(
          this.state.strokeUtil.divideInfo
        );
        this.refreshStyle(graph, styleSegments);
      }
    }
    if (this.props.strokeZigzagState) {
      this.state.strokeUtil.up(e, 'ZigZag');
      if (this.state.strokeUtil.status) {
        const [graph, styleSegments] = this.state.storyLayouter.divide(
          this.state.strokeUtil.divideInfo
        );
        this.refreshStyle(graph, styleSegments);
      }
    }
    if (this.props.strokeWaveState) {
      this.state.strokeUtil.up(e, 'SinWave');
      if (this.state.strokeUtil.status) {
        const [graph, styleSegments] = this.state.storyLayouter.divide(
          this.state.strokeUtil.divideInfo
        );
        this.refreshStyle(graph, styleSegments);
      }
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
    if (this.props.collideState) {
      this.state.collideUtil.drag(e);
    }
    if (this.props.twineState) {
      this.state.twinUtil.drag(e);
    }
    if (this.props.knotState) {
      this.state.knotUtil.drag(e);
    }
    if (
      this.props.strokeDashState ||
      this.props.strokeWidthState ||
      this.props.strokeZigzagState ||
      this.props.strokeWaveState
    ) {
      this.state.strokeUtil.drag(e);
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
