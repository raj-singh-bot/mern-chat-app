import axios from "axios";
import { all, put, takeLatest, call } from "redux-saga/effects";
import { REQUEST_AUTH, SET_USER } from "./authActionTypes";
// eslint-disable-next-line require-yield

function* login(action) {
  try {
    //console.log("test test");
    console.log(action);

    const result = yield call(getLogin, action.payload);
    console.log(result.data);
    localStorage.setItem("auth-token", JSON.stringify(result.data));
    yield put({ type: SET_USER, payload: result.data });
    //yield put({})
  } catch (err) {
    console.error(`Error fetching switched account`, action);
  }
}

export function getLogin (data){
  return axios({
        method: "post",
        url: 'http://localhost:4000/user/login',
        data: data,
        
      });
}


const authSaga = function* () {
  yield all([
    takeLatest(REQUEST_AUTH, login),
    // takeLatest(REQUEST_SESSION, requestSession),
  ]);
};

export default authSaga;

