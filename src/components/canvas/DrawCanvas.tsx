import React, { Component } from 'react';
import { connect } from 'react-redux';
import { project, view } from 'paper';
import { StateType, DispatchType, StoryGraph } from '../../types';
import { addVisualObject } from '../../store/actions';
import { getToolState } from '../../store/selectors';
import ZoomCanvas from './ZoomCanvas';

import { iStoryline } from 'iStoryline';
import BrushUtil from '../../interactions/IStoryEvent/brushSelectionUtil';
import SketchUtil from '../../interactions/IStoryEvent/sketchSelectionUtil';
import CircleUtil from '../../interactions/IStoryEvent/circleSelectionUtil';

const mapStateToProps = (state: StateType) => {
  return {
    renderQueue: state.renderQueue,
    addLineState: getToolState(state, 'AddLine'),
    groupState: getToolState(state, 'Group'),
    bendState: getToolState(state, 'Bend'),
    compressState: getToolState(state, 'Compress'),
    relateState: getToolState(state, 'Twine'),
    stylishState: getToolState(state, 'StrokeDash'),
    sortState: getToolState(state, 'Sort')
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
  addLineUtil: SketchUtil;
  groupUtil: CircleUtil;
  compressUtil: CircleUtil;
  bendUtil: BrushUtil;
  relateUtil: BrushUtil;
  stylishUtil: BrushUtil;
};

class DrawCanvas extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      storyXMLUrl: 'xml/StarWars.xml',
      storyLayouter: new iStoryline(),
      addLineUtil: new SketchUtil('AddLine', 0),
      groupUtil: new CircleUtil('Group', 0),
      compressUtil: new CircleUtil('Compress', 0),
      relateUtil: new BrushUtil('Relate', 2),
      stylishUtil: new BrushUtil('Stylish', 1),
      bendUtil: new BrushUtil('Bend', 1)
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
    this.state.compressUtil.updateStoryStore(graph);
    this.state.relateUtil.updateStoryStore(graph);
    this.state.stylishUtil.updateStoryStore(graph);
    this.state.bendUtil.updateStoryStore(graph);
  }

  onMouseDown(e: paper.MouseEvent) {
    if (this.props.addLineState) this.state.addLineUtil.down(e);
    if (this.props.groupState) this.state.groupUtil.down(e);
    if (this.props.compressState) this.state.compressUtil.down(e);
    if (this.props.relateState) this.state.relateUtil.down(e);
    if (this.props.stylishState) this.state.stylishUtil.down(e);
    if (this.props.bendState) this.state.bendUtil.down(e);
  }

  onMouseDrag(e: paper.MouseEvent) {
    if (this.props.addLineState) this.state.addLineUtil.drag(e);
    if (this.props.groupState) this.state.groupUtil.drag(e);
    if (this.props.compressState) this.state.compressUtil.drag(e);
    if (this.props.relateState) this.state.relateUtil.drag(e);
    if (this.props.stylishState) this.state.stylishUtil.drag(e);
    if (this.props.bendState) this.state.bendUtil.drag(e);
  }

  onMouseUp(e: paper.MouseEvent) {
    if (this.props.addLineState) {
      const param = this.state.addLineUtil.up(e);
      console.log(param);
    }
    if (this.props.groupState) {
      const param = this.state.groupUtil.up(e);
      console.log(param);
    }
    if (this.props.compressState) {
      const param = this.state.compressUtil.up(e);
      console.log(param);
    }
    if (this.props.relateState) {
      const param = this.state.relateUtil.up(e);
      console.log(param);
    }
    if (this.props.stylishState) {
      const param = this.state.stylishUtil.up(e);
      console.log(param);
    }
    if (this.props.bendState) {
      const param = this.state.bendUtil.up(e);
      console.log(param);
    }
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
