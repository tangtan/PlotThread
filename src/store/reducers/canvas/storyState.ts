import { ActionType } from '../../../types';
import { iStoryline } from 'i-storyline-js';
import { StoryStore } from '../../../utils/storyStore';

const initialState = {
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
        storyLayouter: _iStoryliner,
        storyStore: new StoryStore()
      };
    case 'LOAD_STORYJSON':
      const { story } = action.payload;
      const graph = _iStoryliner.load(story);
      // console.log(graph);
      return {
        storyLayouter: _iStoryliner,
        storyStore: new StoryStore(graph)
      };
    default:
      break;
  }
  return state;
};

// function transformGraph(graph: any): storyStore {
//   const nodes = [] as StoryLine;
//   const paths = graph.storylines;
//   paths.forEach((storyline: StoryLine) => nodes.push(...storyline));
//   return {
//     names: graph.characters,
//     nodes: nodes,
//     paths: paths,
//     styleConfig: [],
//     scaleRate: 1
//   };
// }
