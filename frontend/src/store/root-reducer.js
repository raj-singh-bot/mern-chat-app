import { combineReducers } from "@reduxjs/toolkit";
import auth from "./auth/reducer";
import chat from "./chats/reducer";
import singleChat from "./singleChat/reducer";

export default combineReducers({chat, auth, singleChat});
