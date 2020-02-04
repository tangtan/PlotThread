import { ActionType } from 'typesafe-actions';
import * as actions from '../store/actions';
import store from '../store';
import { Path, Raster, Group } from 'paper';

export type ActionType = ActionType<typeof actions>;

export type StateType = {
  toolState: ToolStateType;
  groupEventState: GroupEventStateType;
  styleEventState: StyleEventStateType;
  renderQueue: VisualObject[];
  historyQueue: historyQueueType;
};

export type historyQueueType = {
  postConfigArray: number[];
  pointer: number; //index
};

//config数据结构
export type PostConfig = number; //暂时写成number测试

export type DispatchType = typeof store.dispatch;

// Tool State
export type ToolStateType = {
  toolName: string; // 辅助判断 FreeMode
  toolMap: Map<string, boolean>; // 动态储存工具状态
};

// Group Event State
export type GroupEventStateType = {
  groupEventName: string;
  groupEventMap: Map<string, boolean>;
};

// Style Event State
export type StyleEventStateType = {
  styleEventName: string;
  styleEventMap: Map<string, boolean>;
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
// export type StoryLine = StoryNode[];
export type StoryName = string;
export type StoryGraph = {
  names: StoryName[];
  nodes: StorySegment[];
  paths: StoryLine[];
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
