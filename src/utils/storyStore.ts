import { StoryName, StoryLine, StorySegment } from '../types';

export class StoryStore {
  graph: any;
  names: StoryName[];
  nodes: StorySegment[];
  paths: StoryLine[];
  constructor(graph?: any) {
    if (graph) {
      this.graph = graph;
      this.names = graph.characters;
      const nodes = [] as StoryLine;
      const paths = graph.storylines;
      paths.forEach((storyline: StoryLine) => nodes.push(...storyline));
      this.nodes = nodes;
      this.paths = paths;
    } else {
      this.graph = null;
      this.names = [];
      this.nodes = [];
      this.paths = [];
    }
  }
  getStoryStartTime() {
    return this.graph.timeline[0];
  }
  getStoryEndTime() {
    const timeIdx = this.graph.timeline.length - 1;
    return this.graph.timeline[timeIdx];
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
  getStorySegmentIDByTime(storylineID: number | string, timespan: any) {
    return this.graph.getStorySegmentIDByTime(storylineID, timespan);
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
  getStorylineIDByName(name: string) {
    return this.graph.getStorylineIDByName(name);
  }
  getStoryTimeSpan(x: number | string) {
    return this.graph.getStoryTimeSpan(x);
  }
  getStoryTimeSpanID(startTime: number, endTime: number) {
    return this.graph.getStoryTimeSpanID(startTime, endTime);
  }
  getStoryTimeID(time: number) {
    return this.graph.getStoryTimeID(time);
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
  getSessionID(x: number | string, y: number | string) {
    return this.graph.getSessionID(x, y);
  }
  getSessions(
    x0: number | string,
    y0: number | string,
    x1: number | string,
    y1: number | string
  ) {
    return this.graph.getSessions(x0, y0, x1, y1);
  }
  getPrevSessionID(id: number) {
    return this.graph.getPrevSessionID(id);
  }
  getNextSessionID(id: number) {
    return this.graph.getNextSessionID(id);
  }
  getBesideSessions(x: number | string, y: number | string, name: string) {
    return this.graph.getBesideSessions(x, y, name);
  }
}
