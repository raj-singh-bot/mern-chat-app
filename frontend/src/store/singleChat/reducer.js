import { useSelector } from "react-redux";
import { ADD_SINGLECHAT } from "./singleChatActionTypes";

const initialState = {
    singleChat : []
}

const singleChat = (state = initialState, action) => {
    switch(action.type){
        case ADD_SINGLECHAT:
            const itemInCart = state.singleChat.length;
            if(itemInCart > 0){
                state.singleChat=[];
                state.singleChat.push({...action.payload});
            }
            // else if(state.singleChat.length > 0){
            //     console.log(state.singleChat)
            // }
            else{
                state.singleChat.push({...action.payload});
            }
            return{
                ...state
            }

        default:
            return state
    }
}

export default singleChat;


export function useSingleChat() {
    return useSelector((state) => state.singleChat);
}