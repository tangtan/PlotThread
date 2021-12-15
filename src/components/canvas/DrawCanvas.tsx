import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StateType, DispatchType } from '../../types';
import { StoryStore } from '../../utils/storyStore';
import {
  getStoryStore,
  getStoryName,
  getToolState,
  getVisualObjects
} from '../../store/selectors';
import { addVisualObject, deselectVisualObjects } from '../../store/actions';
import { view } from 'paper';
import UtilCanvas from './UtilCanvas';

const mapStateToProps = (state: StateType) => {
  return {
    storyName: getStoryName(state),
    storyStore: getStoryStore(state),
    visualObjects: getVisualObjects(state),
    isLoadStoryJson: getToolState(state, 'Open')
  };
};

const mapDispatchToProps = (dispatch: DispatchType) => {
  return {
    addVisualObject: (type: string, cfg: any) =>
      dispatch(addVisualObject(type, cfg)),
    resetVisualObjects: () => dispatch(deselectVisualObjects())
  };
};

type Props = {} & ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

type State = {
  storyName: string | null;
  storyStore: StoryStore | null;
};

class DrawCanvas extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      storyName: null,
      storyStore: null
    };
  }

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    if (nextProps.storyStore !== prevState.storyStore) {
      const storyStore = nextProps.storyStore;
      if (storyStore.getCharactersNum() > 0) {
        if (nextProps.storyName !== prevState.storyName) {
          // Draw storylines after loading files
          drawStorylines(nextProps);
        } else if (!nextProps.isLoadStoryJson) {
          // Update storylines after iStoryline actions
          updateStorylines(nextProps);
        }
      }
    }
    return {
      storyName: nextProps.storyName,
      storyStore: nextProps.storyStore
    };
  }

  componentDidMount() {
    // De-select all visual objects
    view.onClick = (e: paper.MouseEvent) => {
      this.props.resetVisualObjects();
    };
  }

  render() {
    return <UtilCanvas />;
  }
}

function drawStorylines(props: Props) {
  const storyStore = props.storyStore;
  if (storyStore.getCharactersNum() > 0) {
    for (let i = 0; i < storyStore.paths.length; i++) {
      props.addVisualObject('storyline', {
        storylineName: storyStore.names[i],
        storylinePath: storyStore.paths[i],
        prevStoryline: [],
        characterID: i + 1,
        animationType: 'creation'
      });
    }
  }
}

function updateStorylines(props: Props) {
  const storyStore = props.storyStore;
  const storylines = props.visualObjects.filter(
    item => item.data.type === 'storyline'
  );
  // TODO: Copy style
  storylines.forEach(storyline => storyline.remove());
  for (let i = 0, len = storyStore.getCharactersNum(); i < len; i++) {
    const storylineName = storyStore.names[i];
    const storylinePath = storyStore.paths[i];
    const prevStoryline = getPrevStoryline(storylineName, storylines);
    props.addVisualObject('storyline', {
      storylineName: storylineName,
      storylinePath: storylinePath,
      prevStoryline: prevStoryline,
      characterID: i + 1,
      animationType: 'transition'
    });
  }
}

function getPrevStoryline(
  storyName: string,
  storylines: paper.Group[]
): paper.Item[] {
  for (let i = 0; i < storylines.length; i++) {
    const storyline = storylines[i];
    if (storyline.name === storyName && storyline.children) {
      return storyline.children.slice(1);
    }
  }
  return [];
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
