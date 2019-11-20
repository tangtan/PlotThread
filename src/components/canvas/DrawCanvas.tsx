import React, { Component } from 'react';
import { connect } from 'react-redux';
import { project, view } from 'paper';
import { StateType, DispatchType, StoryGraph } from '../../types';
import { addVisualObject } from '../../store/actions';
import { getToolState } from '../../store/selectors';
import ZoomCanvas from './ZoomCanvas';

import { iStoryline } from 'iStoryline';
import AddLineUtil from '../../interactions/IStoryEvent/addline';
import GroupUtil from '../../interactions/IStoryEvent/group';
import BendUtil from '../../interactions/IStoryEvent/bend';
import CompressUtil from '../../interactions/IStoryEvent/compress';
import CollideUtil from '../../interactions/IStoryEvent/collide';
import StrokeUtil from '../../interactions/IStoryEvent/stroke';

const hitOption = {
  segments: true,
  stroke: true,
  fill: true,
  tolerance: 5
};

const mapStateToProps = (state: StateType) => {
  return {
    renderQueue: state.renderQueue,
    addLineState: getToolState(state, 'AddLine'),
    groupState: getToolState(state, 'Group'),
    bendState: getToolState(state, 'Bend'),
    compressState: getToolState(state, 'Compress'),
    relateState: getToolState(state, 'Twine'),
    stylishState: getToolState(state, 'StrokeDash')
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
  storyXMLUrl: string;
  storyLayouter: any;
  addLineUtil: AddLineUtil;
  groupUtil: GroupUtil;
  bendStraightenUtil: BendUtil;
  compressExpandUtil: CompressUtil;
  relateUtil: CollideUtil;
  stylishUtil: StrokeUtil;
};

class DrawCanvas extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      storyXMLUrl: 'xml/StarWars.xml',
      storyLayouter: new iStoryline(),
      addLineUtil: new AddLineUtil(hitOption),
      groupUtil: new GroupUtil(hitOption),
      bendStraightenUtil: new BendUtil(hitOption),
      compressExpandUtil: new CompressUtil(hitOption),
      relateUtil: new CollideUtil(hitOption),
      stylishUtil: new StrokeUtil(hitOption)
    };
  }

  // init
  async componentDidMount() {
    console.log(project);
    const { storyXMLUrl, storyLayouter } = this.state;
    let graph = await storyLayouter.readFile(storyXMLUrl);
    graph = storyLayouter.scale(100, 100, 800, 500, true);
    graph = storyLayouter.space(10, 10);
    this.updateUtils(graph);
    console.log(graph);
    graph.names.forEach((name: string, i: number) => {
      const path = graph.paths[i];
      this.props.addVisualObject('storyline', {
        storylineName: name,
        storylinePath: path
      });
    });
    view.onClick = (e: paper.MouseEvent) => {
      this.onMouseClick(e);
    };
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

  updateUtils(graph: StoryGraph) {
    this.state.addLineUtil.updateStoryStore(graph);
    this.state.groupUtil.updateStoryStore(graph);
    this.state.bendStraightenUtil.updateStoryStore(graph);
    this.state.compressExpandUtil.updateStoryStore(graph);
    this.state.relateUtil.updateStoryStore(graph);
    this.state.stylishUtil.updateStoryStore(graph);
  }

  onMouseDown(e: paper.MouseEvent) {
    if (this.props.addLineState) this.state.addLineUtil.down(e);
    if (this.props.groupState) this.state.groupUtil.down(e);
    if (this.props.bendState) this.state.bendStraightenUtil.down(e);
    if (this.props.compressState) this.state.compressExpandUtil.down(e);
    if (this.props.relateState) this.state.relateUtil.down(e);
    if (this.props.stylishState) this.state.stylishUtil.down(e);
  }

  onMouseDrag(e: paper.MouseEvent) {
    if (this.props.addLineState) this.state.addLineUtil.drag(e);
    if (this.props.groupState) this.state.groupUtil.drag(e);
    if (this.props.bendState) this.state.bendStraightenUtil.drag(e);
    if (this.props.compressState) this.state.compressExpandUtil.drag(e);
    if (this.props.relateState) this.state.relateUtil.drag(e);
    if (this.props.stylishState) this.state.stylishUtil.drag(e);
  }

  onMouseUp(e: paper.MouseEvent) {
    if (this.props.addLineState) this.state.addLineUtil.up(e);
    if (this.props.groupState) this.state.groupUtil.up(e);
    if (this.props.bendState) this.state.bendStraightenUtil.up(e);
    if (this.props.compressState) this.state.compressExpandUtil.up(e);
    if (this.props.relateState) this.state.relateUtil.up(e);
    if (this.props.stylishState) this.state.stylishUtil.up(e, 'Dash');
  }

  onMouseClick(e: paper.MouseEvent) {
    if (project) {
      project.deselectAll();
      this.props.renderQueue.forEach(item => {
        item.data.isTransforming = false;
        item.data.selectionBounds.visible = false;
        // item.data.selectionBounds.remove();
      });
    }
  }

  render() {
    return <ZoomCanvas />;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DrawCanvas);
