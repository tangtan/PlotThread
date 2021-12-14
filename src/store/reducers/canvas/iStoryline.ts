import { ActionType } from '../../../types';
import { iStoryline } from 'i-storyline-js';
import StoryDrawer from '../../../drawers/storyDrawer';
import { StoryStore } from '../../../utils/storyStore';
import { project, Item } from 'paper';

const initialState = {
  storyName: '',
  storyLayouter: new iStoryline(),
  storyStore: new StoryStore()
};

export default (state = initialState, action: ActionType) => {
  const _iStoryliner = new iStoryline();
  switch (action.type) {
    case 'LOAD_STORYFILE':
      const { fileUrl, fileType } = action.payload;
      _iStoryliner.loadFile(fileUrl, fileType);
      return {
        storyName: fileUrl,
        storyLayouter: _iStoryliner,
        storyStore: new StoryStore()
      };
    case 'LOAD_STORYJSON':
      const { storyName, storyJson } = action.payload;
      const graph = _iStoryliner.load(storyJson);
      return {
        storyName: storyName,
        storyLayouter: _iStoryliner,
        storyStore: new StoryStore(graph)
      };
    case 'UPDATE_STORYSTORE': {
      const { graph } = action.payload;
      return {
        storyName: state.storyName,
        storyLayouter: state.storyLayouter,
        storyStore: new StoryStore(graph)
      };
    }
    case 'SORT_STORYLINES': {
      const { args } = action.payload;
      if (args === null) return state;
      // TODO: consider local re-ordering
      const [names, timeSpan] = args;
      const graph = state.storyLayouter.sort(names, timeSpan);
      const storyStore = new StoryStore(graph);
      return {
        storyName: state.storyName,
        storyLayouter: state.storyLayouter,
        storyStore: storyStore
      };
    }
    default:
      break;
  }
  return state;
};
