import { ActionType } from '../../../types';
import { iStoryline } from 'i-storyline-js';
import { StoryStore } from '../../../utils/storyStore';

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
    case 'BEND_STORYLINES': {
      const { args } = action.payload;
      if (args === null) return state;
      const [names, timeSpan] = args;
      const graph =
        timeSpan.length === 1
          ? state.storyLayouter.bend(names, timeSpan)
          : state.storyLayouter.straighten(names, timeSpan);
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
      return {
        storyName: state.storyName,
        storyLayouter: state.storyLayouter,
        storyStore: new StoryStore(graph)
      };
    }
    case 'COMPRESS_STORYLINES': {
      const { args } = action.payload;
      if (args === null) return state;
      const [names, timeSpan] = args;
      // TODO: enable scale adjustment
      const graph = state.storyLayouter.compress(names, timeSpan, 0.5);
      return {
        storyName: state.storyName,
        storyLayouter: state.storyLayouter,
        storyStore: new StoryStore(graph)
      };
    }
    case 'STYLISH_STORYLINES': {
      const { args } = action.payload;
      if (args === null) return state;
      const [names, timeSpan, type] = args;
      const graph = state.storyLayouter.stylish(names, timeSpan, type);
      return {
        storyName: state.storyName,
        storyLayouter: state.storyLayouter,
        storyStore: new StoryStore(graph)
      };
    }
    case 'RELATE_STORYLINES': {
      const { args } = action.payload;
      if (args === null) return state;
      const [names, timeSpan, type] = args;
      console.log(args);
      const graph = state.storyLayouter.relate(names, timeSpan, type);
      return {
        storyName: state.storyName,
        storyLayouter: state.storyLayouter,
        storyStore: new StoryStore(graph)
      };
    }
    default:
      break;
  }
  return state;
};
