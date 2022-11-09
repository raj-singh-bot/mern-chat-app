import { all, fork } from "redux-saga/effects";
import authSaga from "./auth/saga";
import chatSaga from "./chats/saga";

export default function* rootSaga() {
  yield all([ fork(authSaga), fork(chatSaga)] );
}
