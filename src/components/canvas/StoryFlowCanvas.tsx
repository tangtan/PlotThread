import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StateType, DispatchType, StoryGraph } from '../../types';
import { getCurrentStoryFlowProtoc } from '../../store/selectors';
import { addVisualObject } from '../../store/actions';
import { storyRender } from 'iStoryline';
import ToolCanvas from './ToolCanvas';
import axios from 'axios';

const mapStateToProps = (state: StateType) => {
  return {
    storyProtoc: getCurrentStoryFlowProtoc(state),
    renderQueue: state.renderQueue
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
  storyScriptUrl: string;
  storyServerUrl: string;
};

class StoryFlowCanvas extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      storyScriptUrl: 'StarWars.xml',
      storyServerUrl: 'http://localhost:5050/api/update'
    };
  }

  private genStoryGraph = async () => {
    const postReq = this.props.storyProtoc;
    const postUrl = this.state.storyServerUrl;
    const postRes = await axios.post(postUrl, postReq);
    const graph = storyRender('SmoothRender', postRes.data);
    graph.names = graph.entities;
    return graph;
  };

  private drawStorylines = (graph: StoryGraph) => {
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
  };

  async componentDidMount() {
    const graph = await this.genStoryGraph();
    this.drawStorylines(graph);
  }

  render() {
    return <ToolCanvas />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StoryFlowCanvas);
