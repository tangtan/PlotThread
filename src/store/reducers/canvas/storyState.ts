import { ActionType, StoryGraph, StoryLine } from '../../../types';
import { iStoryline } from 'i-storyline-js';

const nullStoryGraph: StoryGraph = {
  names: [],
  nodes: [],
  paths: [],
  styleConfig: [],
  scaleRate: 1
};

const initialState = {
  storyLayouter: new iStoryline(),
  storyGraph: nullStoryGraph
};

export default (state = initialState, action: ActionType) => {
  const _iStoryliner = new iStoryline();
  switch (action.type) {
    case 'LOAD_STORYFILE':
      const { fileUrl, fileType } = action.payload;
      _iStoryliner.loadFile(fileUrl, fileType);
      return {
        storyLayouter: _iStoryliner,
        storyGraph: nullStoryGraph
      };
    case 'LOAD_STORYJSON':
      const { story } = action.payload;
      const graph = _iStoryliner.load(story);
      // console.log(graph);
      return {
        storyLayouter: _iStoryliner,
        storyGraph: transformGraph(graph)
      };
    default:
      break;
  }
  return state;
};

// transform iStoryline graph
function transformGraph(graph: any): StoryGraph {
  const nodes = [] as StoryLine;
  const paths = graph.storylines;
  paths.forEach((storyline: StoryLine) => nodes.push(...storyline));
  return {
    names: graph.characters,
    nodes: nodes,
    paths: paths,
    styleConfig: [],
    scaleRate: 1
  };
}
