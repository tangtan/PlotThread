import React, { Component } from 'react';
import { StateType, DispatchType, OrdersType, StoryGraph } from '../../types';
import BendUtil from '../../interactions/IStoryEvent/bendUtil';
import CompressUtil from '../../interactions/IStoryEvent/compressUtil';
import SortUtil from '../../interactions/IStoryEvent/sortUtil';
import StylishUtil from '../../interactions/IStoryEvent/stylishUtil';
import RelateUtil from '../../interactions/IStoryEvent/relateUtil';
import {
  getToolState,
  getCurrentStoryFlowProtoc,
  getCurrentPostRes
} from '../../store/selectors';
import { view, project } from 'paper';
import ToolCanvas from './ToolCanvas';
import { connect } from 'react-redux';
import { addVisualObject, addAction, changeAction } from '../../store/actions';
import { iStoryline } from 'iStoryline';
const mapStateToProps = (state: StateType) => {
  return {
    storyProtoc: getCurrentStoryFlowProtoc(state),
    layoutBackUp: getCurrentPostRes(state),
    bendState: getToolState(state, 'Bend'),
    compressState: getToolState(state, 'Compress'),
    sortState: getToolState(state, 'FreeMode'),
    bumpState: getToolState(state, 'Bump'),
    dashState: getToolState(state, 'Dash'),
    waveState: getToolState(state, 'Wave'),
    zigzagState: getToolState(state, 'Zigzag'),
    collideState: getToolState(state, 'Collide'),
    knotState: getToolState(state, 'Knot'),
    twineState: getToolState(state, 'Twine')
  };
};
const mapDispatchToProps = (dispatch: DispatchType) => {
  return {
    addVisualObject: (type: string, cfg: any) =>
      dispatch(addVisualObject(type, cfg)),
    addAction: (protocol: any) => dispatch(addAction(protocol))
  };
};
type Props = {} & ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

type State = {
  storyLayouter: any;
  bendUtil: BendUtil;
  compressUtil: CompressUtil;
  sortUtil: SortUtil;
  bumpUtil: StylishUtil;
  dashUtil: StylishUtil;
  waveUtil: StylishUtil;
  zigzagUtil: StylishUtil;
  collideUtil: RelateUtil;
  knotUtil: RelateUtil;
  twineUtil: RelateUtil;
};
class UtilCanvas extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      storyLayouter: new iStoryline(),
      bendUtil: new BendUtil('Bend', 1),
      compressUtil: new CompressUtil('Compress', 0),
      sortUtil: new SortUtil('Sort', 0),
      bumpUtil: new StylishUtil('Bump', 1),
      dashUtil: new StylishUtil('Dash', 1),
      waveUtil: new StylishUtil('Wave', 1),
      zigzagUtil: new StylishUtil('Zigzag', 1),
      collideUtil: new RelateUtil('Collide', 2),
      knotUtil: new RelateUtil('Knot', 2),
      twineUtil: new RelateUtil('Twine', 2)
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
    this.state.knotUtil.updateStoryStore(graph);
    this.state.twineUtil.updateStoryStore(graph);
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
  componentDidUpdate(prevProps: Props) {
    if (
      this.props.layoutBackUp !== prevProps.layoutBackUp ||
      this.props.storyProtoc !== prevProps.storyProtoc
    ) {
      const graph = this.state.storyLayouter._layout(
        this.props.layoutBackUp,
        this.props.storyProtoc
      );
      this.updateUtils(graph);
    }
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
    if (this.props.knotState) this.state.knotUtil.down(e);
    if (this.props.twineState) this.state.twineUtil.down(e);
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
    if (this.props.knotState) this.state.knotUtil.drag(e);
    if (this.props.twineState) this.state.twineUtil.drag(e);
  }
  onMouseUp(e: paper.MouseEvent) {
    if (this.props.compressState) {
      const [names, span] = this.state.compressUtil.up(e);
      let newProcotol = this.deepCopy(this.props.storyProtoc);
      if (span) {
        for (let i = 0; i < span.length; i++) {
          newProcotol.sessionInnerGaps.push({ item1: span[i], item2: 10 });
        }
        this.props.addAction(newProcotol);
      }
    }
    if (this.props.bendState) {
      const [nameIDs, span] = this.state.bendUtil.up(e);
      let newProtocol = this.deepCopy(this.props.storyProtoc);
      if (span && nameIDs) {
        if (span.length === 5) {
          //bend
          newProtocol.sessionBreaks.push({
            frame: span[0],
            session1: span[2],
            session2: span[3]
          });
          newProtocol.sessionBreaks.push({
            frame: span[1],
            session1: span[3],
            session2: span[4]
          });
        } else {
          for (let i = 0; i < nameIDs.length; i++) {
            let tmp = [];
            for (let j = span[0]; j <= span[1]; j++) {
              tmp.push(j);
            }
            newProtocol.majorCharacters.push({ item1: nameIDs[i], item2: tmp });
          }
        }
        this.props.addAction(newProtocol);
      }
    }
    if (this.props.sortState) {
      const param = this.state.sortUtil.up(e);
      if (param) {
        const [ids, span] = param;
        let newProtocol = this.deepCopy(this.props.storyProtoc);
        newProtocol.orders.push(ids);
        this.props.addAction(newProtocol);
      }
    }
    const stylishName = this.props.waveState
      ? 'Wave'
      : this.props.bumpState
      ? 'Bump'
      : this.props.zigzagState
      ? 'Zigzag'
      : this.props.dashState
      ? 'Dash'
      : null;
    if (stylishName) {
      const [nameIDs, span] = this.props.waveState
        ? this.state.waveUtil.up(e)
        : this.props.bumpState
        ? this.state.bumpUtil.up(e)
        : this.props.zigzagState
        ? this.state.zigzagUtil.up(e)
        : this.props.dashState
        ? this.state.dashUtil.up(e)
        : null;
      if (span && nameIDs) {
        let newProcotol = this.deepCopy(this.props.storyProtoc);
        newProcotol.stylishInfo.push({
          names: nameIDs,
          timespan: span,
          style: stylishName
        });
        this.props.addAction(newProcotol);
      }
    }
    const relateName = this.props.collideState
      ? 'Collide'
      : this.props.knotState
      ? 'Knot'
      : this.props.twineState
      ? 'Twine'
      : null;
    if (relateName) {
      const [nameIDs, span] = this.props.collideState
        ? this.state.collideUtil.up(e)
        : this.props.knotState
        ? this.state.knotUtil.up(e)
        : this.props.twineState
        ? this.state.twineUtil.up(e)
        : null;
      if (span && nameIDs) {
        let newProcotol = this.deepCopy(this.props.storyProtoc);
        newProcotol.relateInfo.push({
          names: nameIDs,
          timespan: span,
          style: relateName
        });
        this.props.addAction(newProcotol);
      }
    }
  }
  render() {
    return <ToolCanvas />;
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(UtilCanvas);
