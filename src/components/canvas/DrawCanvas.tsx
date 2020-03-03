import React, { Component } from 'react';
import { StateType, DispatchType, StoryGraph, StyleConfig } from '../../types';
import { iStoryline } from 'iStoryline';
import UtilCanvas from './UtilCanvas';
import {
  getCurrentStoryFlowProtoc,
  getCurrentPredictGraph,
  getCurrentStoryFlowLayout,
  getCurrentActionType
} from '../../store/selectors';
import {
  addVisualObject,
  newPredictAction,
  setTool,
  addAction,
  updateProtocAction
} from '../../store/actions';
import axios from 'axios';
import { project, view } from 'paper';
import { connect } from 'react-redux';
const mapStateToProps = (state: StateType) => {
  return {
    storyProtoc: getCurrentStoryFlowProtoc(state),
    predictGraph: getCurrentPredictGraph(state),
    storyLayout: getCurrentStoryFlowLayout(state),
    actionType: getCurrentActionType(state),
    renderQueue: state.renderQueue,
    historyQueue: state.historyQueue
  };
};
const mapDispatchToProps = (dispatch: DispatchType) => {
  return {
    addVisualObject: (type: string, cfg: any) =>
      dispatch(addVisualObject(type, cfg)),
    newPredictAction: (newPredictQueue: any[]) =>
      dispatch(newPredictAction(newPredictQueue)),
    activateTool: (name: string, use: boolean) => dispatch(setTool(name, use)),
    addAction: (protoc: any, layout: any, scale: number) =>
      dispatch(addAction(protoc, layout, scale)),
    updateProtocAction: (protoc: any) => dispatch(updateProtocAction(protoc))
  };
};
type Props = {} & ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

type State = {
  serverUpdateUrl: string;
  storyLayouter: any;
};
class DrawCanvas extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      serverUpdateUrl: 'api/update',
      storyLayouter: new iStoryline()
    };
  }
  private genStoryGraph = async () => {
    const protoc = this.props.storyProtoc;
    const data = this.props.storyLayout;
    const postUrl = this.state.serverUpdateUrl;
    //    const postReq = { data: data, protoc: protoc };
    const postReq = { data: { error: 0, data: data }, protoc: protoc };
    const postRes = await axios.post(postUrl, postReq);
    //  console.log(postRes);
    const graph = this.state.storyLayouter._layout(
      postRes.data.data[0],
      postRes.data.protoc[0]
    );
    this.props.addAction(
      postRes.data.protoc[0],
      postRes.data.data[0],
      graph.scaleRate
    );
  };
  private drawStorylines(graph: StoryGraph) {
    const storylines = this.props.renderQueue.filter(
      item => item.data.type === 'storyline'
    );
    // TODO: Copy style
    storylines.forEach(storyline => storyline.remove());
    // draw new graph
    for (let i = 0; i < graph.paths.length; i++) {
      if (graph.names[i] === 'RABBIT') continue;
      this.props.addVisualObject('storyline', {
        storylineName: graph.names[i],
        storylinePath: graph.paths[i],
        prevStoryline:
          i < storylines.length ? storylines[i].lastChild.children : [],
        characterID: i,
        animationType: 'creation',
        segmentIDs: []
      });
    }
  }
  private updateStorylines(graph: StoryGraph) {
    const storylines = this.props.renderQueue.filter(
      item => item.data.type === 'storyline'
    );
    // TODO: Copy style
    storylines.forEach(storyline => storyline.remove());
    // draw new graph
    const animationType =
      this.props.storyProtoc.interaction === 'stylish' ||
      this.props.storyProtoc.interaction === 'relate'
        ? 'regionalTransition'
        : 'globalTransition';
    for (let i = 0; i < graph.paths.length; i++) {
      if (graph.names[i] === 'RABBIT') continue;
      if (animationType === 'regionalTransition') {
        this.props.addVisualObject('storyline', {
          storylineName: graph.names[i],
          storylinePath: graph.paths[i],
          prevStoryline:
            i < storylines.length ? storylines[i].lastChild.children : [],
          animationType: animationType,
          characterID: i,
          segmentIDs: this.getSegmentIDs(graph.styleConfig, graph.names[i]),
          dashIDs: this.getDashIDs(graph.styleConfig, graph.names[i])
        });
      } else {
        this.props.addVisualObject('storyline', {
          storylineName: graph.names[i],
          storylinePath: graph.paths[i],
          prevStoryline:
            i < storylines.length ? storylines[i].lastChild.children : [],
          animationType: animationType,
          characterID: i,
          segmentIDs: [],
          dashIDs: this.getDashIDs(graph.styleConfig, graph.names[i])
        });
      }
    }
  }
  getDashIDs(styleConfig: StyleConfig[], name: string) {
    if (!styleConfig) return [];
    // console.log(styleConfig);
    let ret = [];
    for (let i = 0; i < styleConfig.length; i++) {
      if (styleConfig[i].name === name) {
        for (let j = 0; j < styleConfig[i].styles.length; j++) {
          if (styleConfig[i].styles[j] === 'Dash') {
            ret.push(styleConfig[i].segmentID);
            break;
          }
        }
      }
    }
    return ret;
  }
  getSegmentIDs(styleConfig: StyleConfig[], name: string) {
    if (!styleConfig) return [];
    let ret = [];
    for (let i = 0; i < styleConfig.length; i++) {
      if (styleConfig[i].name === name) {
        ret.push(styleConfig[i].segmentID);
      }
    }
    return ret;
  }
  checkActionStable(type: string) {
    if (type === 'ADD') return true;
    if (type === 'UPDATE_LAYOUT') return true;
    if (type === 'CHANGE_LAYOUT') return true;
    if (type === 'NEXT_PREDICT') return true;
    if (type === 'LAST_PREDICT') return true;
    return false;
  }
  async componentDidUpdate(prevProps: Props) {
    if (this.props.historyQueue.pointer !== prevProps.historyQueue.pointer) {
      if (this.checkActionStable(this.props.actionType)) {
        const graph = this.state.storyLayouter._layout(
          this.props.storyLayout,
          this.props.storyProtoc
        );
        if (this.props.historyQueue.pointer <= 1) this.drawStorylines(graph);
        else this.updateStorylines(graph);
      } else {
        await this.genStoryGraph();
      }
    }
  }
  async componentDidMount() {
    await this.genStoryGraph();
    view.onClick = (e: paper.MouseEvent) => {
      this.onMouseClick(e);
    };
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
    return <UtilCanvas />;
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(DrawCanvas);
