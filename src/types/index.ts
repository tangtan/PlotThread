import { ActionType } from 'typesafe-actions';
import * as actions from '../store/actions';
import store from '../store';
import VisibilityFilters from '../components/demo/VisibilityFilters';
import { Path } from 'paper';

export type ActionType = ActionType<typeof actions>;

export type StateType = {
  todos: TodosType;
  visibilityFilter: string;
  toolState: ToolStateType;
  renderQueue: VisualObject[];
};

export type DispatchType = typeof store.dispatch;

// TodoApp demo
export type ITodo = {
  id: number;
  content: string;
  completed: boolean;
};

export type TodosType = {
  allIds: number[];
  byIds: ByIdsType;
};

export type ByIdsType = {
  [id: number]: ITodo;
};

// Tool State
export type ToolStateType = {
  toolName: string;
  addLine: boolean;
  group: boolean;
  sort: boolean;
  bend: boolean;
  scale: boolean;
  reshape: boolean;
  move: boolean;
};

export type ITool = {
  name: string;
  type: string;
  url: string;
  subTools: ITool[];
};

export type IHitOption = {
  segments?: boolean;
  stroke?: boolean;
  fill?: boolean;
  tolerance?: number;
};

// Visual Object
export type VisualObject = {
  type: string;
  mounted: boolean;
  geometry: Path | Path.Circle | Path.Rectangle | null;
};

// Storyline
export type StoryNode = number[];
export type StorySegment = StoryNode[];
// TODO: export type StoryLine = StorySegment[];
export type StoryLine = StoryNode[];
export type StoryName = string;
