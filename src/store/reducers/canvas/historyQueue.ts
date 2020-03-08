import {
  ActionType,
  historyQueueType,
  StoryFlowProtocType,
  StoryFlowStoryType,
  SessionInnerGapType,
  SessionOuterGapType,
  MajorCharactersType,
  OrdersType,
  StylishInfoType,
  RelateInfoType,
  ScaleInfoType,
  SessionBreaksType
} from '../../../types';

const initialProtoc = {
  id: '',
  sessionInnerGap: 18,
  sessionOuterGap: 54,
  sessionInnerGaps: [],
  sessionOuterGaps: [],
  majorCharacters: [],
  orders: [],
  groupIds: [],
  selectedSessions: [],
  orderTable: [],
  sessionBreaks: [],
  stylishInfo: [],
  relateInfo: [],
  scaleInfo: [],
  interaction: ''
} as StoryFlowProtocType;
const initialGraph = {} as StoryFlowStoryType;
const initialState: historyQueueType = {
  protocQueue: [initialProtoc], //暂时写成数字
  layoutQueue: [], // ?
  scaleQueue: [],
  actionTypeQueue: [],
  pointer: 0,
  originalPointer: 0,
  predictQueue: [],
  predictPointer: 0
};

export class StoryFlowProtoc {
  id: string;
  sessionInnerGap: number;
  sessionOuterGap: number;
  sessionInnerGaps: SessionInnerGapType[];
  sessionOuterGaps: SessionOuterGapType[];
  majorCharacters: MajorCharactersType[];
  orders: OrdersType;
  groupIds: [];
  selectedSessions: [];
  sessionBreaks: SessionBreaksType[];
  stylishInfo: StylishInfoType[];
  relateInfo: RelateInfoType[];
  scaleInfo: ScaleInfoType[];
  constructor(prevProtoc: StoryFlowProtocType) {
    this.id = prevProtoc.id;
    this.sessionInnerGap = prevProtoc.sessionInnerGap;
    this.sessionOuterGap = prevProtoc.sessionOuterGap;
    this.sessionInnerGaps = prevProtoc.sessionInnerGaps;
    this.sessionOuterGaps = prevProtoc.sessionOuterGaps;
    this.majorCharacters = prevProtoc.majorCharacters;
    this.orders = prevProtoc.orders;
    this.groupIds = prevProtoc.groupIds;
    this.selectedSessions = prevProtoc.selectedSessions;
    this.sessionBreaks = prevProtoc.sessionBreaks;
    this.stylishInfo = prevProtoc.stylishInfo;
    this.relateInfo = prevProtoc.relateInfo;
    this.scaleInfo = prevProtoc.scaleInfo;
  }
}
export function checkActionStable(
  actionTypeQueue: string[],
  newPointer: number
) {
  if (actionTypeQueue[newPointer] === 'ADD') return true;
  if (actionTypeQueue[newPointer] === 'UPDATE_LAYOUT') return true;
  if (actionTypeQueue[newPointer] === 'CHANGE_LAYOUT') return true;
  if (actionTypeQueue[newPointer] === 'NEXT_PREDICT') return true;
  if (actionTypeQueue[newPointer] === 'LAST_PREDICT') return true;
  return false;
}
export default (state = initialState, action: ActionType) => {
  const {
    protocQueue,
    layoutQueue,
    scaleQueue,
    actionTypeQueue,
    pointer,
    predictQueue
  } = state;
  let newProtocQueue = protocQueue;
  let newLayoutQueue = layoutQueue;
  let newScaleQueue = scaleQueue;
  let newActionTypeQueue = actionTypeQueue;
  let newPointer = pointer;
  switch (action.type) {
    case 'REDO':
      if (protocQueue.length > pointer + 1) {
        newPointer = pointer + 1;
        while (
          protocQueue.length > newPointer + 1 &&
          !checkActionStable(actionTypeQueue, newPointer)
        ) {
          newPointer++;
        }
        if (protocQueue.length > newPointer) {
          return {
            ...state,
            pointer: newPointer
          };
        } else {
          return state;
        }
      } else {
        return state;
      }
    case 'UNDO':
      if (pointer > 0) {
        newPointer = pointer - 1;
        while (
          0 < newPointer - 1 &&
          !checkActionStable(actionTypeQueue, newPointer)
        ) {
          newPointer--;
        }
        if (newPointer >= 0) {
          return {
            ...state,
            pointer: newPointer
          };
        } else {
          return state;
        }
      } else {
        return state;
      }
    case 'RECORD_POINTER':
      const { originalPointer } = action.payload;
      return {
        ...state,
        originalPointer: originalPointer
      };
    case 'BACK_POINTER':
      return {
        ...state,
        pointer: state.originalPointer
      };
    case 'FORWARD_POINTER':
      return {
        ...state,
        pointer: newProtocQueue.length - 1
      };
    case 'ABANDON_POINTER':
      newProtocQueue.splice(state.originalPointer + 1);
      newLayoutQueue.splice(state.originalPointer + 1);
      newScaleQueue.splice(state.originalPointer + 1);
      newActionTypeQueue.splice(state.originalPointer + 1);
      return {
        ...state,
        pointer: state.originalPointer,
        protocQueue: newProtocQueue,
        layoutQueue: newLayoutQueue,
        scaleQueue: newScaleQueue,
        actionTypeQueue: newActionTypeQueue,
        predictPointer: 0,
        predictQueue: []
      };
    case 'ADD':
      const { protoc, layout, scale } = action.payload;
      newProtocQueue[pointer + 1] = protoc as StoryFlowProtocType;
      newLayoutQueue[pointer + 1] = layout as StoryFlowStoryType;
      newScaleQueue[pointer + 1] = scale;
      newActionTypeQueue[pointer + 1] = 'ADD';
      return {
        ...state,
        pointer: pointer + 1,
        protocQueue: newProtocQueue,
        layoutQueue: newLayoutQueue,
        scaleQueue: newScaleQueue,
        actionTypeQueue: newActionTypeQueue
      };
    case 'CHANGE_LAYOUT':
      const { characterID, segmentID, deltaY } = action.payload;
      let updateLayout = deepCopy(layoutQueue[pointer]);
      let updateProtoc = deepCopy(protocQueue[pointer]);
      let updateScale = scaleQueue[pointer];
      let j = -1;
      for (let i = 0; i < updateLayout.array[characterID].points.length; i++) {
        if (updateLayout.perm[characterID][i] !== -1) {
          j++;
          if (j === segmentID) {
            j = i;
            break;
          }
        }
      }
      updateLayout.array[characterID].points[j].item3 +=
        deltaY * scaleQueue[pointer];
      newProtocQueue.splice(pointer + 1);
      newLayoutQueue.splice(pointer + 1);
      newScaleQueue.splice(pointer + 1);
      newActionTypeQueue.splice(pointer + 1);
      newProtocQueue[pointer + 1] = updateProtoc as StoryFlowProtocType;
      newLayoutQueue[pointer + 1] = updateLayout as StoryFlowStoryType;
      newScaleQueue[pointer + 1] = updateScale;
      newActionTypeQueue[pointer + 1] = 'CHANGE_LAYOUT';
      return {
        ...state,
        pointer: pointer + 1,
        protocQueue: newProtocQueue,
        layoutQueue: newLayoutQueue,
        scaleQueue: newScaleQueue,
        actionTypeQueue: newActionTypeQueue
      };
    case 'NEW_PROTOC':
      const { id } = action.payload;
      let iniProtoc = deepCopy(initialProtoc);
      iniProtoc.id = id;
      newProtocQueue.splice(1);
      newLayoutQueue.splice(1);
      newScaleQueue.splice(1);
      newActionTypeQueue.splice(1);
      newProtocQueue[1] = iniProtoc as StoryFlowProtocType;
      newScaleQueue[1] = 1;
      newActionTypeQueue[1] = 'NEW_PROTOC';
      return {
        ...state,
        pointer: 1,
        protocQueue: newProtocQueue,
        layoutQueue: newLayoutQueue,
        scaleQueue: newScaleQueue,
        actionTypeQueue: newActionTypeQueue
      };
    case 'UPDATE_PROTOC':
      const { protocol } = action.payload;
      let upLayout = deepCopy(layoutQueue[pointer]);
      let upScale = scaleQueue[pointer];
      newProtocQueue.splice(pointer + 1);
      newLayoutQueue.splice(pointer + 1);
      newScaleQueue.splice(pointer + 1);
      newActionTypeQueue.splice(pointer + 1);
      newProtocQueue[pointer + 1] = protocol as StoryFlowProtocType;
      newLayoutQueue[pointer + 1] = upLayout as StoryFlowStoryType;
      newScaleQueue[pointer + 1] = upScale;
      newActionTypeQueue[pointer + 1] = 'UPDATE_PROTOC';
      return {
        ...state,
        pointer: pointer + 1,
        protocQueue: newProtocQueue,
        layoutQueue: newLayoutQueue,
        scaleQueue: newScaleQueue,
        actionTypeQueue: newActionTypeQueue
      };
    case 'UPDATE_LAYOUT':
      const { storyLayout } = action.payload;
      let newProtoc = deepCopy(protocQueue[pointer]);
      let newScale = scaleQueue[pointer];
      newProtocQueue[pointer + 1] = newProtoc as StoryFlowProtocType;
      newLayoutQueue[pointer + 1] = storyLayout as StoryFlowStoryType;
      newScaleQueue[pointer + 1] = newScale;
      newActionTypeQueue[pointer + 1] = 'UPDATE_LAYOUT';
      return {
        ...state,
        pointer: pointer + 1,
        protocQueue: newProtocQueue,
        layoutQueue: newLayoutQueue,
        scaleQueue: newScaleQueue,
        actionTypeQueue: newActionTypeQueue
      };
    case 'NEW_PREDICT':
      const { newPredictQueue } = action.payload;
      return {
        ...state,
        predictQueue: newPredictQueue,
        predictPointer: 0
      };
    case 'NEXT_PREDICT':
      if (state.predictPointer + 1 < state.predictQueue.length) {
        newProtocQueue[pointer + 1] = deepCopy(
          state.predictQueue[state.predictPointer + 1].protoc
        );
        newLayoutQueue[pointer + 1] = deepCopy(
          state.predictQueue[state.predictPointer + 1].layout
        );
        newActionTypeQueue[pointer + 1] = 'NEXT_PREDICT';
        newScaleQueue[pointer + 1] = deepCopy(scaleQueue[pointer]); //???scale不一定不变
        return {
          ...state,
          protocQueue: newProtocQueue,
          layoutQueue: newLayoutQueue,
          scaleQueue: newScaleQueue,
          actionTypeQueue: newActionTypeQueue,
          pointer: pointer + 1,
          predictPointer: state.predictPointer + 1
        };
      } else {
        return state;
      }
    case 'LAST_PREDICT':
      if (state.predictPointer - 1 >= 0) {
        newProtocQueue[pointer + 1] = deepCopy(
          state.predictQueue[state.predictPointer - 1].protoc
        );
        newLayoutQueue[pointer + 1] = deepCopy(
          state.predictQueue[state.predictPointer - 1].layout
        );
        newActionTypeQueue[pointer + 1] = 'LAST_PREDICT';
        newScaleQueue[pointer + 1] = deepCopy(scaleQueue[pointer]); //???scale不一定不变
        return {
          ...state,
          protocQueue: newProtocQueue,
          layoutQueue: newLayoutQueue,
          scaleQueue: newScaleQueue,
          actionTypeQueue: newActionTypeQueue,
          pointer: pointer + 1,
          predictPointer: state.predictPointer - 1
        };
      } else {
        return state;
      }
    //如果有其他的action也记录到historyQueue当中
    default:
      return state;
  }
};
export function deepCopy(x: any) {
  if (!x) return null;
  return JSON.parse(JSON.stringify(x));
}
