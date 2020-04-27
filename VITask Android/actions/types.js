import { createStore, applyMiddleware, combineReducers } from "redux";
import thunkMiddleware from 'redux-thunk'
// Called at the beginning of the app
const LOGIN_VTOP_REQUEST = "LOGIN_VTOP_REQUEST"
const LOGIN_VTOP_SUCCESS = "LOGIN_VTOP_SUCCESS"
const LOGIN_VTOP_ERROR = "LOGIN_VTOP_ERROR"

// Called at the beginning of app, Timetable doesnot changes
const FETCH_TIMETABLE_REQUEST = "FETCH_TIMETABLE_REQUEST"
const FETCH_TIMETABLE_SUCCESS = "FETCH_TIMETABLE_SUCCESS"
const FETCH_TIMETABLE_ERROR = "FETCH_TIMETABLE_ERROR"

// Will sync Attendance details
const FETCH_ATTENDANCE_REQUEST = "FETCH_ATTENDANCE_REQUEST"
const FETCH_ATTENDANCE_SUCCESS = "FETCH_ATTENDANCE_SUCCESS"
const FETCH_ATTENDANCE_ERROR = "FETCH_ATTENDANCE_ERROR"
// Will be called after Logging into Moodle
const LOGIN_MOODLE = "LOGIN_MOODLE"
// Get the Bulk assignments
const SYNC_ASSIGNMENTS = "ASSINGMENT"
// Get the resources for the subject
const SYNC_RESOURCES = "RESOURCES"

const initialState = {
    authData : {},
    loading : false, 
    error : '',
    timetable : {}
}

const loginVTOPRequest = (username, password) =>{
    return {
        type : LOGIN_VTOP_REQUEST,
        data : {
            username,
            password
        }
    }
}

const loginVTOPSuccess = (authData) =>{
    return {
        type : LOGIN_VTOP_SUCCESS,
        data : authData
    }
}

const loginVTOPError = (err) =>{
    return {
        type : LOGIN_VTOP_ERROR,
        error : err
    }
}

const reducer = (state = initialState, action)=>{
    switch(action.type){
        case LOGIN_VTOP_REQUEST:
            return {
                ...state,
                loading : true
            }
        case LOGIN_VTOP_SUCCESS:
            return {
                ... state, 
                loading : false,
                authData : action.data
            }
        case LOGIN_VTOP_ERROR:
            return {
                ... state,
                loading : false,
                error : action.error
            }
        default :
        return state
    }
}

export function loginVTOP(username, password){
    console.log("Dispatch called")
    return dispatch=>{
        dispatch(loginVTOPRequest)
        fetch(`https://vitask.me/authenticate?username=${username}&password=${password}`)
        .then(res => res.json())
        .then(res => {
            console.log(res)
            if (res['Error']){
            // Incorrect password
            dispatch(loginVTOPError("Password / Username Incorrect"))
            }
            else{
                dispatch(loginVTOPSuccess(res))
            }
        })
        .catch(err => dispatch(loginVTOPError(err)))
    }
}

const rootReducer = combineReducers({
    reducer
})

export default function configureStore(preloadedState){
    return createStore(
        rootReducer,
        preloadedState,
        applyMiddleware(thunkMiddleware)
    )
}