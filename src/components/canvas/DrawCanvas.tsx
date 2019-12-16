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
import SortUtil from '../../interactions/IStoryEvent/sortSelectionUtil';

const mapStateToProps = (state: StateType) => {
  return {
    renderQueue: state.renderQueue,
    addLineState: getToolState(state, 'AddActor'),
    groupState: getToolState(state, 'AddEvent'),
    bendState: getToolState(state, 'Bend'),
    compressState: getToolState(state, 'Compress'),
    relateState: getToolState(state, 'Relate'),
    stylishState: getToolState(state, 'Stylish'),
    sortState: getToolState(state, 'FreeMode')
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
  sortUtil: SortUtil;
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
      bendUtil: new BrushUtil('Bend', 1),
      sortUtil: new SortUtil('Sort', 0)
    };
  }

  // init
  async componentDidMount() {
    console.log(project);
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
    const { storyXMLUrl, storyLayouter } = this.state;
    let graph = await storyLayouter.readFile(storyXMLUrl);
    graph = storyLayouter.scale(100, 100, 800, 500, true);
    graph = storyLayouter.space(10, 10);
    console.log(graph);
    this.drawStorylines(graph);
  }

  drawStorylines(graph: StoryGraph) {
    // remove old graph
    this.updateUtils(graph);
    const storylines = this.props.renderQueue.filter(
      item => item.data.type === 'storyline'
    );
    storylines.forEach(storyline => storyline.remove());
    // draw new graph
    graph.names.forEach((name: string, i: number) => {
      const path = graph.paths[i];
      this.props.addVisualObject('storyline', {
        storylineName: name,
        storylinePath: path
      });
    });
  }

  updateUtils(graph: StoryGraph) {
    this.state.addLineUtil.updateStoryStore(graph);
    this.state.groupUtil.updateStoryStore(graph);
    this.state.compressUtil.updateStoryStore(graph);
    this.state.relateUtil.updateStoryStore(graph);
    this.state.stylishUtil.updateStoryStore(graph);
    this.state.bendUtil.updateStoryStore(graph);
    this.state.sortUtil.updateStoryStore(graph);
  }

  onMouseDown(e: paper.MouseEvent) {
    if (this.props.addLineState) this.state.addLineUtil.down(e);
    if (this.props.groupState) this.state.groupUtil.down(e);
    if (this.props.compressState) this.state.compressUtil.down(e);
    if (this.props.relateState) this.state.relateUtil.down(e);
    if (this.props.stylishState) this.state.stylishUtil.down(e);
    if (this.props.bendState) this.state.bendUtil.down(e);
    if (this.props.sortState) this.state.sortUtil.down(e);
  }

  onMouseDrag(e: paper.MouseEvent) {
    if (this.props.addLineState) this.state.addLineUtil.drag(e);
    if (this.props.groupState) this.state.groupUtil.drag(e);
    if (this.props.compressState) this.state.compressUtil.drag(e);
    if (this.props.relateState) this.state.relateUtil.drag(e);
    if (this.props.stylishState) this.state.stylishUtil.drag(e);
    if (this.props.bendState) this.state.bendUtil.drag(e);
    if (this.props.sortState) this.state.sortUtil.drag(e);
  }

  onMouseUp(e: paper.MouseEvent) {
    if (this.props.addLineState) {
      const param = this.state.addLineUtil.up(e);
      console.log(param);
    }
    if (this.props.groupState) {
      const [names, span] = this.state.groupUtil.up(e);
      const graph = this.state.storyLayouter.expand(names, span);
      this.drawStorylines(graph);
    }
    if (this.props.compressState) {
      const [names, span] = this.state.compressUtil.up(e);
      const graph = this.state.storyLayouter.compress(names, span);
      this.drawStorylines(graph);
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
      const [names, span] = this.state.bendUtil.up(e);
      let graph;
      if (span.length === 1) {
        graph = this.state.storyLayouter.bend(names, span);
      } else {
        graph = this.state.storyLayouter.straighten(names, span);
      }
      this.drawStorylines(graph);
    }
    if (this.props.sortState) {
      const [names, span] = this.state.sortUtil.up(e);
      console.log(names, span);
      const graph = this.state.storyLayouter.sort(names, span);
      this.drawStorylines(graph);
    }
  }

  onMouseClick(e: paper.MouseEvent) {
    if (project) {
      project.deselectAll();
      this.props.renderQueue.forEach(item => {
        item.data.isTransforming = false;
        item.data.selectionBounds.visible = false;
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
