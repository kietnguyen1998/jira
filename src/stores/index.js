
import { combineReducers, createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import me from "./reducer/me";
import users from "./reducer/user";
import project from "./reducer/project";
import task from './reducer/task';
import priority from './reducer/priority'
import status from './reducer/status'
import comment from './reducer/comment'
const rootReducer = combineReducers({
    me,
    task,
    project,
    priority,
    users,
    status,
    comment
})
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

export default store;
