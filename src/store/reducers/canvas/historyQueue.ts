import {
  ActionType,
  historyQueueType,
  StoryFlowProtocType,
  StoryFlowResponseType,
  SessionInnerGapType,
  SessionOuterGapType,
  MajorCharactersType,
  OrdersType,
  StylishInfoType,
  RelateInfoType,
  SessionBreaksType
} from '../../../types';

const initialProtoc = {
  id: 'JurassicParkTune.xml',
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
  relateInfo: []
} as StoryFlowProtocType;

const initialState: historyQueueType = {
  protocQueue: [initialProtoc], //暂时写成数字
  layoutBackUp: {} as StoryFlowResponseType, // ?
  pointer: 0
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
  }
}

export default (state = initialState, action: ActionType) => {
  const { protocQueue, layoutBackUp } = state;
  switch (action.type) {
    case 'UNDO':
      if (protocQueue.length > state.pointer) {
        return {
          ...state,
          pointer: state.pointer + 1,
          protocQueue: protocQueue,
          layoutBackUp: layoutBackUp
        };
      }
    case 'REDO':
      if (state.pointer > 0) {
        return {
          ...state,
          pointer: state.pointer - 1,
          protocQueue: protocQueue,
          layoutBackUp: layoutBackUp
        };
      }
    case 'ADD':
      let newProtocQueue = [];
      for (let i = state.pointer, j = 1; i < protocQueue.length; i++, j++) {
        newProtocQueue[j] = protocQueue[i]; //嵌套对象浅拷贝 #TODO 改为深拷贝
      }
      const { cfg } = action.payload;
      newProtocQueue[0] = cfg as StoryFlowProtocType;
      return {
        ...state,
        pointer: 0,
        protocQueue: newProtocQueue,
        layoutBackUp: layoutBackUp
      };
    case 'CHANGE':
      const { cfgs } = action.payload;
      let newLayoutBackup = cfgs as StoryFlowResponseType;
      return {
        ...state,
        pointer: state.pointer,
        protocQueue: protocQueue,
        layoutBackUp: newLayoutBackup
      };
    //如果有其他的action也记录到historyQueue当中
    default:
      return state;
  }
};
