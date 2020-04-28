import {
    LOGIN_VTOP_REQUEST,
    LOGIN_VTOP_SUCCESS,
    LOGIN_VTOP_ERROR,
    
    FETCH_ATTENDANCE_REQUEST,
    FETCH_ATTENDANCE_SUCCESS,
    FETCH_ATTENDANCE_ERROR,

    FETCH_TIMETABLE_REQUEST,
    FETCH_TIMETABLE_SUCCESS,
    FETCH_TIMETABLE_ERROR,

    REFORMAT_DATA
    } from '../actions/types'
import { createStore, applyMiddleware, combineReducers } from "redux";
import thunkMiddleware from 'redux-thunk'
import logger from "redux-logger";

const initialState = {
    userInfo : {},
    status: '',
    error : '',
    timetable : {}
}


const reducer = (state = initialState, action)=>{
    switch(action.type){
        case LOGIN_VTOP_REQUEST:
            return {
                ...state,
                status:"REQUEST_VTOP",
                error: ""
            }
        case LOGIN_VTOP_SUCCESS:
            return {
                ... state, 
                status:"VTOP_COMPLETE",
                userInfo : action.data
            }
        case LOGIN_VTOP_ERROR:
            return {
                ... state,
                loading : "ERROR",
                error : action.error
            }
        
        // For attendance

        case FETCH_ATTENDANCE_REQUEST:
            return {
                ...state,
                status:"REQUEST_ATTENDANCE",
                error: ""
            }
        case FETCH_ATTENDANCE_SUCCESS:
            return {
                ...state,
                status:"ATTENDANCE_COMPLETE",
                attendance: action.data
            }
        case FETCH_ATTENDANCE_ERROR:
            return {
                ...state,
                status:"ERROR",
                error: action.error
            }
        // For timetable

        case FETCH_TIMETABLE_REQUEST:
            return {
                ...state,
                status : "REQUEST_TIMETABLE",
                error:""
            }
        case FETCH_TIMETABLE_SUCCESS:
            return {
                ...state,
                status : "TIMETABLE_COMPLETE",
                timetable:action.data
            }
        case FETCH_TIMETABLE_ERROR:
            return {
                ...state,
                status: "ERROR",
                error : action.error
            }

        case REFORMAT_DATA:
            // This will be called only once and reformate the api
            return state
        default :
            return state
    }
}


const rootReducer = combineReducers({
    reducer
})

export default function configureStore(preloadedState){
    return createStore(
        rootReducer,
        preloadedState,
        applyMiddleware(thunkMiddleware, logger)
    )
}