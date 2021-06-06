import {USER_LOGIN} from "../constants/actionTypes";

export const user = (state = {}, action) => {
    switch (action.type) {
        case USER_LOGIN:
            return action.data
        default:
            return false
    }
}