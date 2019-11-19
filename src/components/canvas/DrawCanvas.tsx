import React, { Component } from 'react';
import { connect } from 'react-redux';
import { project, view } from 'paper';
import { StateType, DispatchType } from '../../types';
import { addVisualObject } from '../../store/actions';
import ZoomCanvas from './ZoomCanvas';
import { iStoryline } from 'iStoryline';

const mapStateToProps = (state: StateType) => {
  return {
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
  storyXMLUrl: string;
  storyStore: any;
};

class DrawCanvas extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      storyXMLUrl: 'xml/StarWars.xml',
      storyStore: new iStoryline()
    };
  }

  // init
  async componentDidMount() {
    console.log(project);
    const { storyXMLUrl, storyStore } = this.state;
    let graph = await storyStore.readFile(storyXMLUrl);
    graph = storyStore.scale(100, 100, 800, 500, true);
    graph = storyStore.space(10, 10);
    console.log(graph);
    graph.names.forEach((name: string, i: number) => {
      const path = graph.paths[i];
      this.props.addVisualObject('storyline', {
        storylineName: name,
        storylinePath: path
      });
    });
    view.on('click', (e: any) => {
      if (project) {
        project.deselectAll();
        this.props.renderQueue.forEach(item => {
          item.data.isTransforming = false;
          item.data.selectionBounds.visible = false;
          // item.data.selectionBounds.remove();
        });
      }
    });
  }

  render() {
    return <ZoomCanvas />;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DrawCanvas);
