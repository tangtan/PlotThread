import {
  ActionType,
  historyQueueType,
  StoryFlowProtocType
} from '../../../types';

const initialProtoc = {
  id: 'starwars.xml',
  sessionInnerGap: 18,
  sessionOuterGap: 54,
  sessionInnerGaps: [],
  sessionOuterGaps: [],
  majorCharacters: [],
  orders: [],
  groupIds: [],
  selectedSessions: [],
  orderTable: [],
  sessionBreaks: []
} as StoryFlowProtocType;

const initialState: historyQueueType = {
  protocQueue: [initialProtoc], //暂时写成数字
  pointer: 0
};

export default (state = initialState, action: ActionType) => {
  const { protocQueue } = state;
  switch (action.type) {
    case 'UNDO':
      if (protocQueue.length > state.pointer) {
        console.log(protocQueue[state.pointer + 1]);
        return {
          ...state,
          pointer: state.pointer + 1,
          protocQueue: protocQueue
        };
      }
    case 'REDO':
      if (state.pointer > 0) {
        console.log(protocQueue[state.pointer - 1]);
        return {
          ...state,
          pointer: state.pointer - 1,
          protocQueue: protocQueue
        };
      }
    //如果有其他的action也记录到historyQueue当中
    default:
      return state;
  }
};
