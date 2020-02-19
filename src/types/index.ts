import { ActionType } from 'typesafe-actions';
import * as actions from '../store/actions';
import store from '../store';
import { Path, Group } from 'paper';
import { type } from 'os';

export type ActionType = ActionType<typeof actions>;
export type DispatchType = typeof store.dispatch;

export type StateType = {
  toolState: ToolStateType;
  renderQueue: VisualObject[];
  historyQueue: historyQueueType;
};

export type historyQueueType = {
  protocQueue: StoryFlowProtocType[];
  layoutBackUp: StoryFlowResponseType;
  pointer: number;
};

// StoryFlow 数据结构
export type StoryFlowProtocType = {
  id: string;
  sessionInnerGap: number;
  sessionOuterGap: number;
  sessionInnerGaps: SessionInnerGapType[];
  sessionOuterGaps: SessionOuterGapType[];
  majorCharacters: MajorCharactersType[];
  orders: OrdersType;
  groupIds: [];
  selectedSessions: [];
  orderTable: any[];
  sessionBreaks: SessionBreaksType[];
  stylishInfo: StylishInfoType[];
  relateInfo: RelateInfoType[];
  interaction: string;
};
export type StylishInfoType = {
  names: number[];
  timespan: number[];
  style: string;
};
export type RelateInfoType = {
  names: number[];
  timespan: number[];
  style: string;
};
export type SessionInnerGapType = {
  item1: number; // session id
  item2: number; // inner gap
};

export type SessionOuterGapType = {
  item1: {
    item1: number; // session1 id
    item2: number; // session2 id
  }; // sessions pair
  item2: {
    item1: number; // lower bound of the gap
    item2: number; // upper bound of the gap
  }; // outer gap between session1 and session2
};

export type MajorCharactersType = {
  item1: number; // character id
  item2: number[]; // time spans
};

export type OrdersType = number[][];

export type SessionBreaksType = {
  frame: number; // time span
  session1: number; // session1 id
  session2: number; // session2 id
};
// StoryFlow 返回数据结构
export type StoryFlowResponseType = {
  error: number;
  data: StoryFlowStoryType;
};
export type StoryFlowStoryType = {
  array: StoryFlowCharacterType[];
  perm: number[][];
  sessionTable: number[][];
};
export type StoryFlowCharacterType = {
  character_id: number;
  name: string;
  points: StoryFlowPointsType[];
};
export type StoryFlowPointsType = {
  item1: number;
  item2: number;
  item3: number;
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
// export type StoryLine = StoryNode[];
export type StoryName = string;
export type StoryGraph = {
  names: StoryName[];
  nodes: StorySegment[];
  paths: StoryLine[];
  styleConfig: StyleConfig[];
};
export type StyleConfig = {
  name: string;
  segmentID: number;
  styles: string[];
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
