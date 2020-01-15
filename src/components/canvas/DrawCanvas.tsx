import React, { Component } from 'react';
import { connect } from 'react-redux';
import { project, view } from 'paper';
import { StateType, DispatchType, StoryGraph } from '../../types';
import { addVisualObject, setTool } from '../../store/actions';
import { getToolState, getGroupEventState } from '../../store/selectors';
import ZoomCanvas from './ZoomCanvas';
import AddEventPanel from '../toolbar/tools/AddEventPanel';
import StylishPanel from '../toolbar/tools/StylishPanel';
import { iStoryline } from 'iStoryline';
import BrushUtil from '../../interactions/IStoryEvent/brushSelectionUtil';
import SketchUtil from '../../interactions/IStoryEvent/sketchSelectionUtil';
import CircleUtil from '../../interactions/IStoryEvent/circleSelectionUtil';
import SortUtil from '../../interactions/IStoryEvent/sortSelectionUtil';
import ReshapeUtil from '../../interactions/IStoryEvent/reshapeSelectionUtil';
import { eventNames } from 'cluster';
// import { Animated } from "react-native";
// import divide = Animated.divide;

const mapStateToProps = (state: StateType) => {
  return {
    renderQueue: state.renderQueue,
    addLineState: getToolState(state, 'AddActor'),
    groupState: getToolState(state, 'AddEvent'),
    relateState: getToolState(state, 'Relate'),
    bendState: getToolState(state, 'Bend'),
    compressState: getToolState(state, 'Compress'),
    reshapeState: getToolState(state, 'Reshape'),
    stylishState: getToolState(state, 'Stylish'),
    sortState: getToolState(state, 'FreeMode'),
    eventPopState: getToolState(state, 'AddEventPop'),
    mergeState: getGroupEventState(state, 'Merge'),
    collideState: getGroupEventState(state, 'Collide'),
    splitState: getGroupEventState(state, 'Split'),
    twineState: getGroupEventState(state, 'Twine'),
    waveState: getGroupEventState(state, 'Wave'),
    zigzagState: getGroupEventState(state, 'Zigzag'),
    wiggleState: getGroupEventState(state, 'Wiggle'),
    dashedState: getGroupEventState(state, 'Dashed')
  };
};

const mapDispatchToProps = (dispatch: DispatchType) => {
  return {
    addVisualObject: (type: string, cfg: any) =>
      dispatch(addVisualObject(type, cfg)),
    activateTool: (name: string, use: boolean) => dispatch(setTool(name, use))
  };
};

type Props = {} & ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

type State = {
  storyXMLUrl: string;
  storyLayouter: any;
  addLineUtil: SketchUtil;
  groupUtil: CircleUtil;
  relateUtil: BrushUtil;
  bendUtil: BrushUtil;
  compressUtil: CircleUtil;
  reshapeUtil: ReshapeUtil;
  stylishUtil: BrushUtil;
  sortUtil: SortUtil;
  groupCenterX: number;
  groupCenterY: number;
  groupName: any;
  groupSpan: any;
};

class DrawCanvas extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      storyXMLUrl: 'xml/StarWars.xml',
      storyLayouter: new iStoryline(),
      addLineUtil: new SketchUtil('AddLine', 0),
      groupUtil: new CircleUtil('Group', 0),
      relateUtil: new BrushUtil('Relate', 2),
      bendUtil: new BrushUtil('Bend', 1),
      compressUtil: new CircleUtil('Compress', 0),
      reshapeUtil: new ReshapeUtil('Reshape', 0),
      stylishUtil: new BrushUtil('Stylish', 1),
      sortUtil: new SortUtil('Sort', 0),
      groupCenterX: 0,
      groupCenterY: 0,
      groupName: null,
      groupSpan: null
    };
  }

  private setRegion = (centerX: number, centerY: number) => {
    this.setState({
      groupCenterX: centerX,
      groupCenterY: centerY
    });
  };
  private setGroup = (names: any, span: any) => {
    this.setState({
      groupName: names,
      groupSpan: span
    });
  };

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
    this.state.reshapeUtil.updateStoryStore(graph);
  }

  onMouseDown(e: paper.MouseEvent) {
    if (this.props.addLineState) this.state.addLineUtil.down(e);
    /*if (this.props.groupState) this.state.groupUtil.down(e);*/
    const eventName = this.props.mergeState
      ? 'Merge'
      : this.props.twineState
      ? 'Twine'
      : this.props.collideState
      ? 'Collide'
      : this.props.splitState
      ? 'Split'
      : null;
    if (eventName) {
      this.state.groupUtil.down(e);
    }
    // if(this.state.eventName!=''){
    //   console.log(this.state.eventName);
    //   this.state.groupUtil.down(e);
    // }
    // if()
    if (this.props.compressState) this.state.compressUtil.down(e);
    if (this.props.relateState) this.state.relateUtil.down(e);
    if (this.props.stylishState) this.state.stylishUtil.down(e);
    if (this.props.bendState) this.state.bendUtil.down(e);
    if (this.props.sortState) this.state.sortUtil.down(e);
    if (this.props.reshapeState) this.state.reshapeUtil.down(e);
  }

  onMouseDrag(e: paper.MouseEvent) {
    if (this.props.addLineState) this.state.addLineUtil.drag(e);
    // if (this.props.groupState) this.state.groupUtil.drag(e);
    const eventName = this.props.mergeState
      ? 'Merge'
      : this.props.twineState
      ? 'Twine'
      : this.props.collideState
      ? 'Collide'
      : this.props.splitState
      ? 'Split'
      : null;

    const stylishName = this.props.dashedState
      ? 'Dashed'
      : this.props.waveState
      ? 'Wave'
      : this.props.zigzagState
      ? 'Zigzag'
      : this.props.wiggleState
      ? 'Wiggle'
      : null;
    if (eventName) {
      this.state.groupUtil.drag(e);
    }
    if (this.props.compressState) this.state.compressUtil.drag(e);
    if (this.props.relateState) this.state.relateUtil.drag(e);
    if (stylishName) this.state.stylishUtil.drag(e);
    // if (this.props.stylishState) this.state.stylishUtil.drag(e);
    if (this.props.bendState) this.state.bendUtil.drag(e);
    if (this.props.sortState) this.state.sortUtil.drag(e);
    if (this.props.reshapeState) this.state.reshapeUtil.drag(e);
  }

  onMouseUp(e: paper.MouseEvent) {
    if (this.props.addLineState) {
      const param = this.state.addLineUtil.up(e);
      console.log(param);
    }
    const eventName = this.props.mergeState
      ? 'Merge'
      : this.props.twineState
      ? 'Twine'
      : this.props.collideState
      ? 'Collide'
      : this.props.splitState
      ? 'Split'
      : null;

    const stylishName = this.props.dashedState
      ? 'Dashed'
      : this.props.waveState
      ? 'Wave'
      : this.props.zigzagState
      ? 'Zigzag'
      : this.props.wiggleState
      ? 'Wiggle'
      : null;

    //if(this.props.groupState){}
    if (eventName) {
      const [names, span, centerX, centerY] = this.state.groupUtil.up(e);
      this.setGroup(names, span);
      this.setRegion(centerX as number, centerY as number);
      // this.props.activateTool('AddEventPop', true); //group画完
      console.log(centerX, centerY);
      console.log(eventName);
      const graph = this.state.storyLayouter.expand(names, span, eventName);
      this.drawStorylines(graph);
      this.props.activateTool('AddEventPop', false);

      // 加一个eventType
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
    // if (this.props.stylishState) {
    //   const param = this.state.stylishUtil.up(e);
    //   console.log(param);
    // }

    if (stylishName) {
      const param = this.state.stylishUtil.up(e);
      console.log(param);
      this.props.activateTool('StylishPop', false);
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
      const param = this.state.sortUtil.up(e);
      if (param) {
        const [names, span] = param;
        const graph = this.state.storyLayouter.sort(names, span);
        // console.log(names, span, graph);
        this.drawStorylines(graph);
      }
    }
    if (this.props.reshapeState) {
      const [upperPath, bottomPath] = this.state.reshapeUtil.up(e);
      const graph = this.state.storyLayouter.reshape(upperPath, bottomPath);
      // console.log(upperPath, bottomPath, graph);
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
    return (
      <div className="canvas-wrapper">
        <ZoomCanvas />
        <AddEventPanel centerY={100} centerX={0} />
        {/*<AddEventPanel*/}
        {/*centerX={this.state.groupCenterX}*/}
        {/*centerY={this.state.groupCenterY}*/}
        {/*/>*/}
        <StylishPanel centerY={100} centerX={0} />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DrawCanvas);
