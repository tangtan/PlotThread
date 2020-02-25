import React, { Component } from 'react';
import { StateType, DispatchType, StoryGraph, StyleConfig } from '../../types';
import { Button, Progress } from 'antd';
import { iStoryline } from 'iStoryline';
import UtilCanvas from './UtilCanvas';
import {
  getCurrentStoryFlowProtoc,
  getToolState,
  getCurrentPredictGraph,
  getCurrentStoryFlowLayout,
  getCurrentActionType
} from '../../store/selectors';
import {
  addVisualObject,
  changeLayoutAction,
  newPredictAction,
  setTool,
  addAction,
  updateProtocAction
} from '../../store/actions';
import axios from 'axios';
import { project, view } from 'paper';
import { connect } from 'react-redux';
import { render } from 'react-dom';
import { checkActionStable } from '../../store/reducers/canvas/historyQueue';
const mapStateToProps = (state: StateType) => {
  return {
    storyProtoc: getCurrentStoryFlowProtoc(state),
    predictGraph: getCurrentPredictGraph(state),
    storyLayout: getCurrentStoryFlowLayout(state),
    actionType: getCurrentActionType(state),
    renderQueue: state.renderQueue,
    historyQueue: state.historyQueue,
    freeMode: getToolState(state, 'FreeMode'),
    templateState: getToolState(state, 'Template')
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
  serverPredictUrl: string;
  storyLayouter: any;
  percent: number;
  progressVisible: boolean;
};
class DrawCanvas extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      serverUpdateUrl: 'api/update',
      serverPredictUrl: 'api/predict',
      storyLayouter: new iStoryline(),
      percent: 0,
      progressVisible: false
    };
  }
  private genStoryGraph = async () => {
    const protoc = this.props.storyProtoc;
    const data = this.props.storyLayout;
    const postUrl = this.state.serverUpdateUrl;
    const postReq = { data: data, protoc: protoc };
    const postRes = await axios.post(postUrl, postReq);
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
          segmentIDs: this.getSegmentIDs(graph.styleConfig, graph.names[i])
        });
      } else {
        this.props.addVisualObject('storyline', {
          storylineName: graph.names[i],
          storylinePath: graph.paths[i],
          prevStoryline:
            i < storylines.length ? storylines[i].lastChild.children : [],
          animationType: animationType,
          characterID: i,
          segmentIDs: []
        });
      }
    }
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
  async componentDidMount() {
    await this.genStoryGraph();
    view.onClick = (e: paper.MouseEvent) => {
      this.onMouseClick(e);
    };
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
  increase = () => {
    let percent = this.state.percent + 1;
    if (percent > 98) {
      percent = 98;
    }
    this.setState({ percent });
  };
  async handleClick() {
    this.setState({
      percent: 0,
      progressVisible: true
    });
    let tmpID = setInterval(() => this.increase(), 1000);
    const protoc = this.props.storyProtoc;
    const data = this.props.storyLayout;
    this.props.activateTool('Setting', true);
    const postReq = { data: data, protoc: protoc };
    const postUrl = this.state.serverPredictUrl;
    const postRes = await axios.post(postUrl, postReq);
    clearInterval(tmpID);
    let newPredictQueue = [];
    // for (let i = 0; i < 7; i++) {
    //   newPredictQueue[i] = {
    //     layout: postRes.data.data[0],
    //     protoc: postRes.data.protoc[0]
    //   };
    // }
    for (let i = 0; i < postRes.data.data.length; i++) {
      newPredictQueue[i] = {
        layout: postRes.data.data[i],
        protoc: postRes.data.protoc[i]
      };
    }
    this.setState({
      percent: 100,
      progressVisible: false
    });
    const graph = this.state.storyLayouter._layout(
      postRes.data.data[0],
      postRes.data.protoc[0]
    );
    this.props.addAction(
      postRes.data.protoc[0],
      postRes.data.data[0],
      graph.scaleRate
    );
    this.props.newPredictAction(newPredictQueue);
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
    let myProgress = (
      <Progress
        percent={this.state.percent}
        style={{
          position: 'fixed',
          left: '700px',
          top: '500px',
          width: '500px'
        }}
      />
    );
    if (!this.state.progressVisible) {
      myProgress = (
        <div
          style={{
            position: 'fixed',
            left: '700px',
            top: '500px',
            width: '500px'
          }}
        />
      );
    }
    return (
      <div>
        <Button
          type="primary"
          style={{ position: 'absolute', top: '700px', background: '#34373e' }}
          size="large"
          onClick={() => this.handleClick()}
        >
          Template
        </Button>
        {myProgress}
        <UtilCanvas />
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(DrawCanvas);
