import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StateType, DispatchType } from '../../types';
import { StoryStore } from '../../utils/storyStore';
import { getToolState, getStoryStore } from '../../store/selectors';
import {
  sortStorylines,
  bendStorylines,
  compressStorylines,
  stylishStorylines,
  relateStorylines
} from '../../store/actions';
import ToolCanvas from './ToolCanvas';
import { view } from 'paper';

import BendUtil from '../../interactions/IStoryEvent/bendUtil';
import CompressUtil from '../../interactions/IStoryEvent/compressUtil';
import SortUtil from '../../interactions/IStoryEvent/sortUtil';
import StylishUtil from '../../interactions/IStoryEvent/stylishUtil';
import RelateUtil from '../../interactions/IStoryEvent/relateUtil';
import RepelUtil from '../../interactions/IStoryEvent/repelUtil';
import AttractUtil from '../../interactions/IStoryEvent/attractUtil';
import TransformUtil from '../../interactions/IStoryEvent/transformUtil';

const mapStateToProps = (state: StateType) => {
  return {
    storyStore: getStoryStore(state),
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
    sort: (args: any) => dispatch(sortStorylines(args)),
    bend: (args: any) => dispatch(bendStorylines(args)),
    compress: (args: any) => dispatch(compressStorylines(args)),
    stylish: (args: any) => dispatch(stylishStorylines(args)),
    relate: (args: any) => dispatch(relateStorylines(args))
  };
};

type Props = {} & ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

type State = {
  storyStore: StoryStore | null;
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
      storyStore: null
    };
  }

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    if (nextProps.storyStore !== prevState.storyStore) {
      const storyStore = nextProps.storyStore;
      prevState.bendUtil.updateStoryStore(storyStore);
      prevState.compressUtil.updateStoryStore(storyStore);
      prevState.sortUtil.updateStoryStore(storyStore);
      prevState.bumpUtil.updateStoryStore(storyStore);
      prevState.dashUtil.updateStoryStore(storyStore);
      prevState.waveUtil.updateStoryStore(storyStore);
      prevState.zigzagUtil.updateStoryStore(storyStore);
      prevState.collideUtil.updateStoryStore(storyStore);
      prevState.mergeUtil.updateStoryStore(storyStore);
      prevState.splitUtil.updateStoryStore(storyStore);
      prevState.twineUtil.updateStoryStore(storyStore);
      prevState.repelUtil.updateStoryStore(storyStore);
      prevState.attractUtil.updateStoryStore(storyStore);
      prevState.transformUtil.updateStoryStore(storyStore);
      return {
        storyStore: storyStore
      };
    }
    return null;
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
  }

  onMouseUp(e: paper.MouseEvent) {
    if (this.props.bendState) {
      const bendArgs = this.state.bendUtil.up(e);
      this.props.bend(bendArgs);
    }
    if (this.props.compressState) {
      const compressArgs = this.state.compressUtil.up(e);
      this.props.compress(compressArgs);
    }
    if (this.props.sortState) {
      const sortArgs = this.state.sortUtil.up(e);
      this.props.sort(sortArgs);
    }
    if (this.props.dashState) {
      const dashArgs = this.state.dashUtil.up(e);
      if (dashArgs !== null) {
        this.props.stylish([...dashArgs, 'Dash']);
      }
    }
    if (this.props.bumpState) {
      const bumpArgs = this.state.bumpUtil.up(e);
      if (bumpArgs !== null) {
        this.props.stylish([...bumpArgs, 'Bump']);
      }
    }
    if (this.props.waveState) {
      const stylishArgs = this.state.waveUtil.up(e);
      if (stylishArgs !== null) {
        this.props.stylish([...stylishArgs, 'Wave']);
      }
    }
    if (this.props.zigzagState) {
      const zigzagArgs = this.state.zigzagUtil.up(e);
      if (zigzagArgs !== null) {
        this.props.stylish([...zigzagArgs, 'Zigzag']);
      }
    }
    if (this.props.collideState) {
      const collideArgs = this.state.collideUtil.up(e);
      if (collideArgs !== null) {
        this.props.relate([...collideArgs, 'Collide']);
      }
    }
    if (this.props.mergeState) {
      const mergeArgs = this.state.mergeUtil.up(e);
      if (mergeArgs !== null) {
        this.props.relate([...mergeArgs, 'Merge']);
      }
    }
    if (this.props.splitState) {
      const splitArgs = this.state.splitUtil.up(e);
      if (splitArgs !== null) {
        this.props.relate([...splitArgs, 'Unmerge']);
      }
    }
    if (this.props.twineState) {
      const twineArgs = this.state.twineUtil.up(e);
      if (twineArgs !== null) {
        this.props.relate([...twineArgs, 'Twine']);
      }
    }
  }

  render() {
    return <ToolCanvas />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UtilCanvas);
