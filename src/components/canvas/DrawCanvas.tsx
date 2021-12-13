import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StateType, DispatchType } from '../../types';
import { StoryStore } from '../../utils/storyStore';
import { getStoryStore } from '../../store/selectors';
import { addVisualObject, cleanRenderQueue } from '../../store/actions';
import { project, view } from 'paper';
import UtilCanvas from './UtilCanvas';

const mapStateToProps = (state: StateType) => {
  return {
    renderQueue: state.renderQueue,
    storyStore: getStoryStore(state)
  };
};

const mapDispatchToProps = (dispatch: DispatchType) => {
  return {
    addVisualObject: (type: string, cfg: any) =>
      dispatch(addVisualObject(type, cfg)),
    cleanRenderQueue: () => dispatch(cleanRenderQueue())
  };
};

type Props = {} & ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

type State = {
  storyStore: StoryStore | null;
};

class DrawCanvas extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      storyStore: null
    };
  }

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    if (nextProps.storyStore !== prevState.storyStore) {
      const storyStore = nextProps.storyStore;
      if (storyStore.getCharactersNum() > 0) {
        drawStorylines(nextProps);
      }
      return {
        storyStore: storyStore
      };
    }
    return null;
  }

  componentDidMount() {
    view.onClick = (e: paper.MouseEvent) => {
      this.onMouseClick(e);
    };
  }

  // De-select all visual objects
  onMouseClick(e: paper.MouseEvent) {
    if (project) {
      project.deselectAll();
      this.props.renderQueue.forEach(item => {
        item.data.isTransforming = false;
        item.data.selectionBounds.visible = false;
      });
      this.props.renderQueue.forEach(item => {
        if (item.children) {
          item.children.forEach(item => {
            item.data.isTransforming = false;
          });
        }
      });
    }
  }

  render() {
    return <UtilCanvas />;
  }
}

function drawStorylines(props: Props) {
  props.cleanRenderQueue();
  const graph = props.storyStore;
  if (graph && graph.getCharactersNum() > 0) {
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
}

// function updateStorylines(props: Props, animationType: string) {
//   const graph = props.storyStore;
//   const storylines = props.renderQueue.filter(
//     (item) => item.data.type === "storyline"
//   );
//   // TODO: Copy style
//   storylines.forEach((storyline) => storyline.remove());
//   // draw new graph
//   for (let i = 0; i < graph.paths.length; i++) {
//     props.addVisualObject('storyline', {
//       storylineName: graph.names[i],
//       storylinePath: graph.paths[i],
//       prevStoryline: i < storylines.length ? storylines[i].children : [],
//       animationType: animationType,
//       characterID: i + 1,
//       segmentIDs: animationType === 'regionalTransition' ? getSegmentIDs(graph.styleConfig, graph.names[i]) : [],
//       dashIDs: getDashIDs(graph.styleConfig, graph.names[i])
//     });
//   }
// }

// function getDashIDs(styleConfig: StyleConfig[], name: string) {
//   if (!styleConfig) return [];
//   let ret = [];
//   for (let i = 0; i < styleConfig.length; i++) {
//     if (styleConfig[i].name === name) {
//       for (let j = 0; j < styleConfig[i].styles.length; j++) {
//         if (styleConfig[i].styles[j] === 'Dash') {
//           ret.push(styleConfig[i].segmentID);
//           break;
//         }
//       }
//     }
//   }
//   return ret;
// }

// function getSegmentIDs(styleConfig: StyleConfig[], name: string) {
//   if (!styleConfig) return [];
//   let ret = [];
//   for (let i = 0; i < styleConfig.length; i++) {
//     if (styleConfig[i].name === name) {
//       ret.push(styleConfig[i].segmentID);
//     }
//   }
//   return ret;
// }

export default connect(mapStateToProps, mapDispatchToProps)(DrawCanvas);
