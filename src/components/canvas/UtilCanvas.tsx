import React, { Component } from 'react';
import { StateType, DispatchType, StoryGraph } from '../../types';
import BendUtil from '../../interactions/IStoryEvent/bendUtil';
import CompressUtil from '../../interactions/IStoryEvent/compressUtil';
import SortUtil from '../../interactions/IStoryEvent/sortUtil';
import StylishUtil from '../../interactions/IStoryEvent/stylishUtil';
import RelateUtil from '../../interactions/IStoryEvent/relateUtil';
import { getToolState } from '../../store/selectors';
import { view } from 'paper';
import ToolCanvas from './ToolCanvas';
import { connect } from 'react-redux';
import { addVisualObject } from '../../store/actions';
import RepelUtil from '../../interactions/IStoryEvent/repelUtil';
import AttractUtil from '../../interactions/IStoryEvent/attractUtil';
import TransformUtil from '../../interactions/IStoryEvent/transformUtil';
import { notification } from 'antd';
import DragUtil from '../../interactions/IStoryEvent/dragUtil';

const mapStateToProps = (state: StateType) => {
  return {
    bendState: getToolState(state, 'Bend'),
    compressState: getToolState(state, 'Compress'),
    sortState: getToolState(state, 'Sort'),
    bumpState: getToolState(state, 'Bump'),
    dashState: getToolState(state, 'Dash'),
    waveState: getToolState(state, 'Wave'),
    zigzagState: getToolState(state, 'Zigzag'),
    collideState: getToolState(state, 'Collide'),
    mergeState: getToolState(state, 'Merge'),
    splitState: getToolState(state, 'Split'),
    twineState: getToolState(state, 'Twine'),
    repelState: getToolState(state, 'Repel'),
    attractState: getToolState(state, 'Attract'),
    transformState: getToolState(state, 'Transform'),
    dragState: getToolState(state, 'Drag')
  };
};
const mapDispatchToProps = (dispatch: DispatchType) => {
  return {
    addVisualObject: (type: string, cfg: any) =>
      dispatch(addVisualObject(type, cfg))
  };
};
type Props = {} & ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

type State = {
  bendUtil: BendUtil;
  compressUtil: CompressUtil;
  sortUtil: SortUtil;
  bumpUtil: StylishUtil;
  dashUtil: StylishUtil;
  waveUtil: StylishUtil;
  zigzagUtil: StylishUtil;
  collideUtil: RelateUtil;
  mergeUtil: RelateUtil;
  splitUtil: RelateUtil;
  twineUtil: RelateUtil;
  repelUtil: RepelUtil;
  attractUtil: AttractUtil;
  transformUtil: TransformUtil;
  dragUtil: DragUtil;
};
class UtilCanvas extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      bendUtil: new BendUtil('Bend', 1),
      compressUtil: new CompressUtil('Compress', 0),
      sortUtil: new SortUtil('Sort', 0),
      bumpUtil: new StylishUtil('Bump', 1),
      dashUtil: new StylishUtil('Dash', 1),
      waveUtil: new StylishUtil('Wave', 1),
      zigzagUtil: new StylishUtil('Zigzag', 1),
      collideUtil: new RelateUtil('Collide', 2),
      mergeUtil: new RelateUtil('Merge', 2),
      splitUtil: new RelateUtil('Split', 2),
      twineUtil: new RelateUtil('Twine', 2),
      repelUtil: new RepelUtil('Repel', 0),
      attractUtil: new AttractUtil('Attract', 0),
      transformUtil: new TransformUtil('Transform', 0),
      dragUtil: new DragUtil('Drag', 0)
    };
  }
  updateUtils(graph: StoryGraph) {
    this.state.bendUtil.updateStoryStore(graph);
    this.state.compressUtil.updateStoryStore(graph);
    this.state.sortUtil.updateStoryStore(graph);
    this.state.bumpUtil.updateStoryStore(graph);
    this.state.dashUtil.updateStoryStore(graph);
    this.state.waveUtil.updateStoryStore(graph);
    this.state.zigzagUtil.updateStoryStore(graph);
    this.state.collideUtil.updateStoryStore(graph);
    this.state.mergeUtil.updateStoryStore(graph);
    this.state.splitUtil.updateStoryStore(graph);
    this.state.twineUtil.updateStoryStore(graph);
    this.state.repelUtil.updateStoryStore(graph);
    this.state.attractUtil.updateStoryStore(graph);
    this.state.transformUtil.updateStoryStore(graph);
    this.state.dragUtil.updateStoryStore(graph);
  }
  deepCopy(x: any) {
    return JSON.parse(JSON.stringify(x));
  }
  componentDidMount() {
    view.onMouseDown = (e: paper.MouseEvent) => {
      this.onMouseDown(e);
    };
    view.onMouseDrag = (e: paper.MouseEvent) => {
      this.onMouseDrag(e);
    };
    view.onMouseUp = (e: paper.MouseEvent) => {
      this.onMouseUp(e);
    };
  }
  onMouseDown(e: paper.MouseEvent) {
    if (this.props.bendState) this.state.bendUtil.down(e);
    if (this.props.compressState) this.state.compressUtil.down(e);
    if (this.props.sortState) this.state.sortUtil.down(e);
    if (this.props.bumpState) this.state.bumpUtil.down(e);
    if (this.props.dashState) this.state.dashUtil.down(e);
    if (this.props.waveState) this.state.waveUtil.down(e);
    if (this.props.zigzagState) this.state.zigzagUtil.down(e);
    if (this.props.collideState) this.state.collideUtil.down(e);
    if (this.props.mergeState) this.state.mergeUtil.down(e);
    if (this.props.splitState) this.state.splitUtil.down(e);
    if (this.props.twineState) this.state.twineUtil.down(e);
    if (this.props.transformState) this.state.transformUtil.down(e);
    if (this.props.repelState) this.state.repelUtil.down(e);
    if (this.props.attractState) this.state.attractUtil.down(e);
    if (this.props.dragState) this.state.dragUtil.down(e);
  }
  onMouseDrag(e: paper.MouseEvent) {
    if (this.props.bendState) this.state.bendUtil.drag(e);
    if (this.props.compressState) this.state.compressUtil.drag(e);
    if (this.props.sortState) this.state.sortUtil.drag(e);
    if (this.props.bumpState) this.state.bumpUtil.drag(e);
    if (this.props.dashState) this.state.dashUtil.drag(e);
    if (this.props.waveState) this.state.waveUtil.drag(e);
    if (this.props.zigzagState) this.state.zigzagUtil.drag(e);
    if (this.props.collideState) this.state.collideUtil.drag(e);
    if (this.props.mergeState) this.state.mergeUtil.drag(e);
    if (this.props.splitState) this.state.splitUtil.drag(e);
    if (this.props.twineState) this.state.twineUtil.drag(e);
    if (this.props.attractState) this.state.attractUtil.drag(e);
    if (this.props.repelState) this.state.repelUtil.drag(e);
    if (this.props.transformState) this.state.transformUtil.drag(e);
    if (this.props.dragState) this.state.dragUtil.drag(e);
  }
  onMouseUp(e: paper.MouseEvent) {}

  openNotification = (toolName: string, msg: string, duration = 8) => {
    notification.error({
      message: toolName,
      description: msg,
      duration: duration,
      placement: 'topLeft',
      style: {
        color: 'white'
      }
    });
  };

  render() {
    return <ToolCanvas />;
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(UtilCanvas);
