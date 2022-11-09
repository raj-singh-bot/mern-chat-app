import axios from 'axios'
import { all, put, takeLatest, call } from "redux-saga/effects";
import { REQUEST_CHAT, SET_CHAT, ERROR_GET_CHAT } from "./chatActionTypes";
import { get } from "lodash";


function* requestChat (action) {
    try {
        const result= yield call(getChat, action.payload);
        console.log(result)
        yield put({ type: SET_CHAT, payload: result.data });
      } catch (error) {
        console.log(error);
        let message =
          "Something went wrong, please try again after some time or Refresh the Page.";
        if (get(error, "response.status") === 500) {
          message = "Something happened wrong try again after sometime.";
        } else if (get(error, "response.status") === 422) {
          message = error.response.data.message || "please provide valid contain";
        } else if (get(error, "response.status") === 415) {
          message = error.response.data.message;
        }
        yield put({ type: ERROR_GET_CHAT, payload: message });
      }
}

export function getChat(token) {
  
    return axios({
      method: "GET",
      url: 'http://localhost:4000/chat',
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
  }


const chatSaga = function* () {
    yield all([
      takeLatest(REQUEST_CHAT, requestChat),
    //   takeLatest(REQUEST_CREATE_DOCTOR, requestCreateDoctor),
    ]);
  };
  
  export default chatSaga;
  