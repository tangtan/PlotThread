import { StoryName } from '../types';

export class StoryStore {
  graph: any;
  names: StoryName[];
  constructor(graph: any) {
    this.graph = graph;
    this.names = graph.names;
  }
  getCharactersNum() {
    return this.names.length;
  }
  getStoryNodeX(
    storyNodeID: string,
    storySegmentID: string,
    storylineID: string
  ) {
    return this.graph.getStoryNodeX(storyNodeID, storySegmentID, storylineID);
  }
  getStoryNodeY(
    storyNodeID: string,
    storySegmentID: string,
    storylineID: string
  ) {
    return this.graph.getStoryNodeY(storyNodeID, storySegmentID, storylineID);
  }
  getStoryNodeID(x: number, y: number) {
    return this.graph.getStoryNodeID(x, y);
  }
  getStorySegment(
    storylineID: number | string,
    storySegmentID: number | string
  ) {
    return this.graph.getStorySegment(storylineID, storySegmentID);
  }
  getStoryline(x: number | string, y: number | string) {
    return this.graph.getStoryline(x, y);
  }
  getStorylineSmooth(x: number | string, y: number | string) {
    return this.graph.getStorylineSmooth(x, y);
  }
  getStorylineSketch(x: number | string, y: number | string) {
    return this.graph.getStorylineSketch(x, y);
  }
  getStorylineName(x: number | string, y: number | string) {
    return this.graph.getStorylineName(x, y);
  }
  getStorylineID(x: number | string, y: number | string) {
    return this.graph.getStorylineID(x, y);
  }
  getStoryTimeSpan(x: number | string, y: number | string) {
    return this.graph.getStoryTimeSpan(x, y);
  }
  getLocationColor(x: number | string, y: number | string) {
    return this.graph.getLocationColor(x, y);
  }
  getLocationID(x: number | string, y: number | string) {
    return this.graph.getLocationID(x, y);
  }
  getLocationName(x: number | string, y: number | string) {
    return this.graph.getLocationName(x, y);
  }
  getCharacters(x: number | string, y: number | string) {
    return this.graph.getCharacters(x, y);
  }
  getCharacterX(name: string, time: number) {
    return this.graph.getCharacterX(name, time);
  }
  getCharacterY(name: string, time: number) {
    return this.graph.getCharacterY(name, time);
  }
}
