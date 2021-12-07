import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StateType, DispatchType, StoryGraph, StyleConfig } from '../../types';
import { getStoryGraph } from '../../store/selectors';
import { addVisualObject } from '../../store/actions';
import { project, view, Item } from 'paper';
import UtilCanvas from './UtilCanvas';

const mapStateToProps = (state: StateType) => {
  return {
    renderQueue: state.renderQueue,
    storyGraph: getStoryGraph(state)
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
  storyGraph: StoryGraph;
};

class DrawCanvas extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      storyGraph: {
        names: [],
        nodes: [],
        paths: [],
        styleConfig: [],
        scaleRate: 1
      }
    };
  }

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    if (nextProps.storyGraph === prevState.storyGraph) {
      return null;
    } else {
      const graph = nextProps.storyGraph;
      if (graph.names.length > 0) {
        drawStorylines(nextProps);
      }
      console.log(nextProps.storyGraph);
      return {
        storyGraph: graph
      };
    }
  }

  private drawStorylines(graph: StoryGraph) {
    const storylines = this.props.renderQueue.filter(
      item => item.data.type === 'storyline'
    );
    // TODO: Copy style
    storylines.forEach(storyline => storyline.remove());
    // draw new graph
    for (let i = 0; i < graph.paths.length; i++) {
      this.props.addVisualObject('storyline', {
        storylineName: graph.names[i],
        storylinePath: graph.paths[i],
        prevStoryline: i < storylines.length ? storylines[i].children : [],
        characterID: i + 1,
        animationType: 'creation',
        segmentIDs: []
      });
    }
  }

  private updateStorylines(graph: StoryGraph) {
    // const storylines = this.props.renderQueue.filter(
    //   item => item.data.type === 'storyline'
    // );
    // // TODO: Copy style
    // storylines.forEach(storyline => storyline.remove());
    // draw new graph
    // const animationType = 'globalTransition';
    // for (let i = 0; i < graph.paths.length; i++) {
    //   if (graph.names[i] === 'RABBIT') continue;
    //   if (animationType === 'regionalTransition') {
    //     this.props.addVisualObject('storyline', {
    //       storylineName: graph.names[i],
    //       storylinePath: graph.paths[i],
    //       prevStoryline: i < storylines.length ? storylines[i].children : [],
    //       animationType: animationType,
    //       characterID: i + 1,
    //       segmentIDs: this.getSegmentIDs(graph.styleConfig, graph.names[i]),
    //       dashIDs: this.getDashIDs(graph.styleConfig, graph.names[i])
    //     });
    //   } else {
    //     this.props.addVisualObject('storyline', {
    //       storylineName: graph.names[i],
    //       storylinePath: graph.paths[i],
    //       prevStoryline: i < storylines.length ? storylines[i].children : [],
    //       animationType: animationType,
    //       characterID: i + 1,
    //       segmentIDs: [],
    //       dashIDs: this.getDashIDs(graph.styleConfig, graph.names[i])
    //     });
    //   }
    // }
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

  componentDidMount() {
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
      this.props.renderQueue.forEach(item => this.deselectItem(item));
    }
  }

  deselectItem(item: Item) {
    if (item.children) {
      item.children.forEach(item => {
        item.data.isTransforming = false;
      });
    }
  }

  render() {
    return <UtilCanvas />;
  }
}

function drawStorylines(props: Props) {
  const graph = props.storyGraph;
  const storylines = props.renderQueue.filter(
    item => item.data.type === 'storyline'
  );
  // TODO: Copy style
  storylines.forEach(storyline => storyline.remove());
  // draw new graph
  for (let i = 0; i < graph.paths.length; i++) {
    props.addVisualObject('storyline', {
      storylineName: graph.names[i],
      storylinePath: graph.paths[i],
      prevStoryline: [],
      characterID: i + 1,
      animationType: 'creation',
      segmentIDs: []
    });
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DrawCanvas);
