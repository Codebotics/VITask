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
} from './types'


const loginVTOPRequest = (username, password) =>{
    return {
        type : LOGIN_VTOP_REQUEST,
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

const fetchAttendanceRequest = () =>{
    return {
        type : FETCH_ATTENDANCE_REQUEST,
    }
}

const fetchAttendanceSuccess = (attendance) =>{
    return {
        type : FETCH_ATTENDANCE_SUCCESS,
        data : attendance
    }
}

const fetchAttendanceError = (err) =>{
    return {
        type : FETCH_ATTENDANCE_ERROR,
        error : err
    }
}

const fetchTimetableRequest = () =>{
    return {
        type : FETCH_TIMETABLE_REQUEST,
    }
}

const fetchTimetableSuccess = (timetable) =>{
    return {
        type : FETCH_TIMETABLE_SUCCESS,
        data : timetable
    }
}

const fetchTimetableError = (err) =>{
    return {
        type : FETCH_TIMETABLE_ERROR,
        error : err
    }
}

export const reformatData = ()=>{
    return {
        type : REFORMAT_DATA    
    }
}

const ORIGINAL_VTOP_LOGIN = `https://vitask.me/authenticate?username={username}&password={password}`
const ORIGINAL_ATTENDANCE = `https://vitask.me/classesapi?token={state.reducer.userInfo.APItoken}`
const ORIGINAL_TIMETABLE = `https://vitask.me/timetableapi?token={state.reducer.userInfo.APItoken}`

export const loginVTOP =(username, password) => {
    return dispatch=>{
        dispatch(loginVTOPRequest)
        fetch('https://jsonplaceholder.typicode.com/posts')
        .then(res => res.json())
        .then(res => {
            res = require("../authenticate.json")
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

export const fetchAttendance = () => {
    return (dispatch, getState) =>{
        const state = getState()
        dispatch(fetchAttendanceRequest)
        fetch('https://jsonplaceholder.typicode.com/posts')
        .then(res => {
            res = require("../classesapi.json")
            return res})
        .then(res =>{
            dispatch(fetchAttendanceSuccess(res))
        })
        .catch(err=> dispatch(fetchAttendanceError(err)))
    }
}

export const fetchTimetable = () => {
    return (dispatch, getState) =>{
        const state = getState()
        dispatch(fetchTimetableRequest)
        fetch('https://jsonplaceholder.typicode.com/posts')
        .then(res => {
            res = require("../timetableapi.json")
            return res})
        .then(res =>{
            dispatch(fetchTimetableSuccess(res))
        })
        .catch(err=> dispatch(fetchTimetableError(err)))
    }
}