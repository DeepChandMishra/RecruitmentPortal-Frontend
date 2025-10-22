// import { ActionType } from "store/action-types";

import { ActionType } from "../action-types";

const initialState = {
  roomList: [],
  roomId : null,
  roomDetails: [],
  unreadcount: '',

};

export const messageReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.ROOM_LIST:
      return { ...state, roomList: action.payload };

    case ActionType.ROOM_DETAILS:
      return { ...state, roomDetails: action.payload };

    case ActionType.ROOM_ID:
        return { ...state, roomId: action.payload };

    case ActionType.TOTAL_UNREADCOUT:
      return { ...state, unreadcount: action.payload };




    default:
      return state;
  }
};
