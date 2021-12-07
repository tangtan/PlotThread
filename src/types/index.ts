import { ActionType } from 'typesafe-actions';
import * as actions from '../store/actions';
import store from '../store';
import { Path, Group } from 'paper';

export type ActionType = ActionType<typeof actions>;
export type DispatchType = typeof store.dispatch;

export type StateType = {
  storyState: StoryState;
  toolState: ToolStateType;
  renderQueue: VisualObject[];
};

// Tool State
export type ToolStateType = {
  toolName: string; // 辅助判断 FreeMode
  toolMap: Map<string, boolean>; // 动态储存工具状态
};

export type ITool = {
  name: string;
  type: string;
  url: string;
  subTools: ITool[];
};

export type IMenu = {
  name: string;
  type: string;
  url: string;
  background: boolean;
};
export type IHitOption = {
  segments?: boolean;
  stroke?: boolean;
  fill?: boolean;
  tolerance?: number;
};

// Visual Object
export type VisualObject = Group;

// Storyline
export type StoryNode = number[];
export type StorySegment = StoryNode[];
export type StoryLine = StorySegment[];
export type StoryName = string;
export type StoryGraph = {
  names: StoryName[];
  nodes: StorySegment[];
  paths: StoryLine[];
  styleConfig: StyleConfig[];
  scaleRate: number;
};
export type StyleConfig = {
  name: string;
  segmentID: number;
  styles: string[];
};
export type StoryState = {
  storyLayouter: any;
  storyGraph: StoryGraph;
};

export type PathGroup = Path[];

export class PathStyleSegment {
  name: string;
  left: number;
  right: number;
  constructor(name: string, left: number, right: number) {
    this.name = name;
    this.left = left;
    this.right = right;
  }
  public draw = (path: Path) => {};
}
