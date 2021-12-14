import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StateType, DispatchType } from '../../types';
import { StoryStore } from '../../utils/storyStore';
import { getStoryStore, getStoryName } from '../../store/selectors';
import {
  addVisualObject,
  cleanStorylines,
  deSelectVisualObjects
} from '../../store/actions';
import { view } from 'paper';
import UtilCanvas from './UtilCanvas';

const mapStateToProps = (state: StateType) => {
  return {
    storyName: getStoryName(state),
    storyStore: getStoryStore(state)
  };
};

const mapDispatchToProps = (dispatch: DispatchType) => {
  return {
    addVisualObject: (type: string, cfg: any) =>
      dispatch(addVisualObject(type, cfg)),
    cleanStorylines: () => dispatch(cleanStorylines()),
    resetVisualObjects: () => dispatch(deSelectVisualObjects())
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
        // if (nextProps.storyName === prevState.storyName) {
        //   updateStorylines(nextProps);
        // } else {
        //   drawStorylines(nextProps);
        // }
        drawStorylines(nextProps);
      }
      return {
        storyName: nextProps.storyName,
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
    this.props.resetVisualObjects();
  }

  render() {
    return <UtilCanvas />;
  }
}

function drawStorylines(props: Props) {
  props.cleanStorylines();
  const storyStore = props.storyStore;
  if (storyStore.getCharactersNum() > 0) {
    for (let i = 0; i < storyStore.paths.length; i++) {
      props.addVisualObject('storyline', {
        storylineName: storyStore.names[i],
        storylinePath: storyStore.paths[i],
        prevStoryline: [],
        characterID: i + 1,
        animationType: 'creation',
        segmentIDs: [],
        dashIDs: []
      });
    }
  }
}

function updateStorylines(props: Props) {
  console.log(2);
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
