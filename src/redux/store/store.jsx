import { combineReducers, configureStore } from '@reduxjs/toolkit'
import counterReducer from '../slice/counterSlice';
import storage from 'redux-persist/lib/storage';
import { userReducer } from '../slice/user.slice';
import { messageReducer } from '../slice/message.slice';
import { commonReducer } from '../slice/commonSlice';
import { stripeReducer } from '../slice/stripeSlice';
import { jobpostingReducer } from '../slice/jobposting.slice';
import { empoyeeReducer } from '../slice/employee.slice';
import { employerReducer } from '../slice/employer.slice';
import { cmsReducer } from '../slice/cms.slice';
import { meetingReducer } from '../slice/meeting.slice';
import { persistReducer, persistStore } from 'redux-persist';
import { feedbackReducer } from '../slice/feedback.slice';
import { websiteFeedbackReducer } from '../slice/websiteFeedback.slice';
import { roleReducer } from '../slice/role.slice';

const persistConfig = {
  key: 'root',
  storage,
}


const reducers = (state, action) => {
  if (action.type === 'LOGOUT') {
    state = undefined;
  }

  return combineReducers({
    counter: counterReducer,
    user: userReducer,
    message: messageReducer,
    stripe: stripeReducer,
    common: commonReducer,
    jobposting: jobpostingReducer,
    employee: empoyeeReducer,
    employer: employerReducer,
    cms: cmsReducer,
    meeting: meetingReducer,
    feedback: feedbackReducer,
    websiteFeedback: websiteFeedbackReducer,
    role:roleReducer
  })(state, action);
};


const persistedReducer = persistReducer(persistConfig, reducers)

export const store = configureStore({
  reducer: persistedReducer,
})