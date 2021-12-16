import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StateType, DispatchType, StoryStyle } from '../../types';
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
  const animationType =
    storyStore.style.length > 0 ? 'localTransition' : 'globalTransition';
  console.log(storyStore.style);
  for (let i = 0, len = storyStore.getCharactersNum(); i < len; i++) {
    const storylineName = storyStore.names[i];
    const storylinePath = storyStore.paths[i];
    const prevStoryline = getPrevStoryline(storylineName, storylines);
    props.addVisualObject('storyline', {
      storylineName: storylineName,
      storylinePath: storylinePath,
      prevStoryline: prevStoryline,
      characterID: i + 1,
      animationType: animationType,
      segmentIDs: getSegmentIDs(storyStore.style, storylineName),
      dashIDs: getDashIDs(storyStore.style, storylineName)
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

function getDashIDs(style: StoryStyle[], name: string) {
  const _style = style.filter(
    styleItem => styleItem.name === name && styleItem.type === 'Dash'
  );
  return _style.map(styleItem => styleItem.segmentID);
}

function getSegmentIDs(style: StoryStyle[], name: string) {
  const _style = style.filter(
    styleItem => styleItem.name === name && styleItem.type !== 'Normal'
  );
  return _style.map(styleItem => styleItem.segmentID);
}

export default connect(mapStateToProps, mapDispatchToProps)(DrawCanvas);
