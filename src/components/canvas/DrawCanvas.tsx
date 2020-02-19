import React, { Component } from 'react';
import { StateType, DispatchType, StoryGraph, StyleConfig } from '../../types';
import { Button } from 'antd';
import { iStoryline } from 'iStoryline';
import UtilCanvas from './UtilCanvas';
import {
  getCurrentStoryFlowProtoc,
  getCurrentPostRes,
  getToolState
} from '../../store/selectors';
import { addVisualObject, changeAction } from '../../store/actions';
import axios from 'axios';
import { project, view } from 'paper';
import { connect } from 'react-redux';
const mapStateToProps = (state: StateType) => {
  return {
    storyProtoc: getCurrentStoryFlowProtoc(state),
    layoutBackUp: getCurrentPostRes(state),
    renderQueue: state.renderQueue,
    historyQueue: state.historyQueue,
    freeMode: getToolState(state, 'FreeMode')
  };
};
const mapDispatchToProps = (dispatch: DispatchType) => {
  return {
    addVisualObject: (type: string, cfg: any) =>
      dispatch(addVisualObject(type, cfg)),
    changeAction: (postRes: any) => dispatch(changeAction(postRes))
  };
};
type Props = {} & ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

type State = {
  serverUpdateUrl: string;
  serverPredictUrl: string;
  storyLayouter: any;
};
class DrawCanvas extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      serverUpdateUrl: 'api/update',
      serverPredictUrl: 'api/predict',
      storyLayouter: new iStoryline()
    };
  }
  private genStoryGraph = async () => {
    const protoc = this.props.storyProtoc;
    const data = this.props.layoutBackUp;
    const postUrl = this.state.serverUpdateUrl;
    const postReq = { data: data, protoc: protoc };
    const postRes = await axios.post(postUrl, protoc);
    this.props.changeAction(postRes.data);
    const graph = this.state.storyLayouter._layout(postRes.data, protoc);
    return graph;
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
          segmentIDs: this.getSegmentIDs(graph.styleConfig, graph.names[i])
        });
      } else {
        this.props.addVisualObject('storyline', {
          storylineName: graph.names[i],
          storylinePath: graph.paths[i],
          prevStoryline:
            i < storylines.length ? storylines[i].lastChild.children : [],
          animationType: animationType,
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
    const graph = await this.genStoryGraph();
    this.drawStorylines(graph);
    view.onClick = (e: paper.MouseEvent) => {
      this.onMouseClick(e);
    };
  }
  async componentDidUpdate(prevProps: Props) {
    if (this.props.storyProtoc.id !== prevProps.storyProtoc.id) {
      const graph = await this.genStoryGraph();
      this.drawStorylines(graph);
    } else {
      if (this.props.storyProtoc !== prevProps.storyProtoc) {
        const graph = await this.genStoryGraph();
        this.updateStorylines(graph);
      }
    }
  }
  async handleClick() {
    const protoc = this.props.storyProtoc;
    const data = this.props.layoutBackUp;
    const postReq = { data: data, protoc: protoc };
    const postUrl = this.state.serverPredictUrl;
    const postRes = await axios.post(postUrl, postReq);
    const graph = this.state.storyLayouter._layout(postRes.data, postReq);
    this.drawStorylines(graph);
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
      <div>
        <Button
          type="primary"
          style={{ position: 'absolute', top: '700px', background: '#34373e' }}
          size="large"
          onClick={() => this.handleClick()}
        >
          Template
        </Button>
        <UtilCanvas />
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(DrawCanvas);
