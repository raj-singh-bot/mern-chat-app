import { useSelector } from "react-redux";
import { REQUEST_AUTH , SET_USER} from "./authActionTypes";

const initialState = {
    user: {}
}

const auth = (state =initialState , action) => {
    switch(action.type){
        case REQUEST_AUTH:
      return {
        ...state,
      };
      case SET_USER:
        return {
          ...state,
          user:action.payload
        };
      default:
        return state;
    }
}

export default auth;
export function useAuth() {
  return useSelector((state) => state.auth)
}