import { ActionType } from 'typesafe-actions';
import * as actions from '../store/actions';
import store from '../store';
import { Path, Group } from 'paper';
import { StoryStore } from '../utils/storyStore';

export type ActionType = ActionType<typeof actions>;
export type DispatchType = typeof store.dispatch;

export type StateType = {
  storyState: StoryState;
  toolState: ToolStateType;
  renderQueue: VisualObject[];
};

// Tool Module
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

// VisualObject Module
export type VisualObject = Group;

// Storyline Module
export type StoryName = string;
export type StoryNode = number[];
export type StorySegment = StoryNode[];
export type StoryLine = StorySegment[];
export type StoryStyle = {
  name: string;
  type: string;
  segmentID: number;
};
export type StoryState = {
  storyLayouter: any;
  storyStore: StoryStore;
  storyName: StoryName;
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
