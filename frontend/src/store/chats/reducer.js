import { useSelector } from "react-redux";
import { REQUEST_CHAT, SET_CHAT, ERROR_GET_CHAT} from './chatActionTypes'

const initialState = {
    busy: false,
    message: '',
    Chat: [],
}

const chat = (state = initialState , action) => {
    switch (action.type) {
        case REQUEST_CHAT:
            return{
                ...state,
                busy: true
            };
        case ERROR_GET_CHAT:
        case SET_CHAT:
            return {
                ...state,
                busy: false,
                Chat: action.payload,
            };
    
        default:
           return state;
    }
    
}

export default chat;


export function useChat() {
    return useSelector((state) => state.chat);
}
