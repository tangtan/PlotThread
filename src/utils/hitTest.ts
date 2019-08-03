import { StoryGraph, StoryName } from '../types';

export class StoryStore {
  graph: StoryGraph;
  names: StoryName[];
  hitTest: any;
  constructor(graph: StoryGraph) {
    this.graph = graph;
    this.names = graph.names;
    this.hitTest = graph.hitTest;
  }
  getCharactersNum() {
    return this.names.length;
  }
  getStoryNodeX(
    storyNodeID: string,
    storySegmentID: string,
    storylineID: string
  ) {
    return this.hitTest.getStoryNodeX(storyNodeID, storySegmentID, storylineID);
  }
  getStoryNodeY(
    storyNodeID: string,
    storySegmentID: string,
    storylineID: string
  ) {
    return this.hitTest.getStoryNodeY(storyNodeID, storySegmentID, storylineID);
  }
  getStoryNodeID(x: number, y: number) {
    return this.hitTest.getStoryNodeID(x, y);
  }
  getStorySegment(
    storylineID: number | string,
    storySegmentID: number | string
  ) {
    return this.hitTest.getStorySegment(storylineID, storySegmentID);
  }
  getStoryline(x: number | string, y: number | string) {
    return this.hitTest.getStoryline(x, y);
  }
  getStorylineSmooth(x: number | string, y: number | string) {
    return this.hitTest.getStorylineSmooth(x, y);
  }
  getStorylineSketch(x: number | string, y: number | string) {
    return this.hitTest.getStorylineSketch(x, y);
  }
  getStorylineName(x: number | string, y: number | string) {
    return this.hitTest.getStorylineName(x, y);
  }
  getStorylineID(x: number | string, y: number | string) {
    return this.hitTest.getStorylineID(x, y);
  }
  getStoryTimeSpan(x: number | string, y: number | string) {
    return this.hitTest.getStoryTimeSpan(x, y);
  }
  getLocationColor(x: number | string, y: number | string) {
    return this.hitTest.getLocationColor(x, y);
  }
  getLocationID(x: number | string, y: number | string) {
    return this.hitTest.getLocationID(x, y);
  }
  getLocationName(x: number | string, y: number | string) {
    return this.hitTest.getLocationName(x, y);
  }
  getCharacters(x: number | string, y: number | string) {
    return this.hitTest.getCharacters(x, y);
  }
  getCharacterX(name: string, time: number) {
    return this.hitTest.getCharacterX(name, time);
  }
  getCharacterY(name: string, time: number) {
    return this.hitTest.getCharacterY(name, time);
  }
}
