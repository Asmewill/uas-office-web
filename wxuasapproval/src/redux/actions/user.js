import {USER_LOGIN} from "../constants/actionTypes";

export const login = () => {
    return (dispatch) => {
        dispatch({
            type: USER_LOGIN,
            data: {
                phone: '',
                openId: ''
            }
        })
    }
}