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
    REFORMAT_DATA,
    
    FETCH_MARKS_REQUEST,
    FETCH_MARKS_SUCCESS,
    FETCH_MARKS_ERROR,

    LOGIN_MOODLE_REQUEST,
    LOGIN_MOODLE_SUCCESS,
    LOGIN_MOODLE_ERROR,

    FETCH_ACADHISTORY_REQUEST,
    FETCH_ACADHISTORY_SUCCESS,
    FETCH_ACADHISTORY_ERROR,

    SYNC_VTOP_REQUEST,
    SYNC_VTOP_SUCCESS,
    SYNC_VTOP_ERROR,

    MOODLE_ASSIGNMENTS_SYNC_REQUEST,
    MOODLE_ASSIGNMENTS_SYNC_SUCCESS,
    MOODLE_ASSIGNMENTS_SYNC_ERROR,

    SOFT_REFRESH_REQUEST,
    SOFT_REFRESH_SUCCESS,
    SOFT_REFRESH_ERROR,

    STORE_STATE_FROM_ASYNC,

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
    
    const fetchMarksRequest = () =>{
        return{
            type : FETCH_MARKS_REQUEST
        }
    }
    
    const fetchMarksSuccess = (marks)=>{
        return{
            type : FETCH_MARKS_SUCCESS,
            data : marks
        }
    }
    
    const fetchMarksError = (err)=>{
        return{
            type : FETCH_MARKS_ERROR,
            error : err
        }
    }

    const loginMoodleRequest = ()=>{
        return{
            type : LOGIN_MOODLE_REQUEST
        }
    }

    const loginMoodleSuccess = (assignments) =>{
        return{
            type : LOGIN_MOODLE_SUCCESS,
            data : assignments
        }
    }

    const loginMoodleError = (err) =>{
        return{
            type : LOGIN_MOODLE_ERROR,
            error : err
        }
    }

    const fetchAcadHistoryRequest = () =>{
        return{
            type : FETCH_ACADHISTORY_REQUEST
        }
    }

    const fetchAcadHistorySuccess = (acadHistory) =>{
        return{
            type : FETCH_ACADHISTORY_SUCCESS,
            data : acadHistory
        }
    }

    const fetchAcadHistoryError = (err) =>{
        return{
            type : FETCH_ACADHISTORY_ERROR,
            error : err
        }
    }
    
    export const reformatData = ()=>{
        return {
            type : REFORMAT_DATA    
        }
    }

    export const softRefreshError = (err) =>{
        return{
            type : SOFT_REFRESH_ERROR,
            error : err
        }
    }

    export const softRefreshRequest = () =>{
        return{
            type : SOFT_REFRESH_REQUEST,
        }
    }

    export const softRefreshSuccess = (data) =>{
        return{
            type : SOFT_REFRESH_SUCCESS,
            data : data
        }
    }

    export const storeState = (rState)=>{
        return{
            type : STORE_STATE_FROM_ASYNC,
            data : rState
        }
    }

    // Use this function to get the API calls
    const callAPI = (route, body)=>{
        const headers = {
            Accept : "application/json",
        "Content-Type" : "application/json",
        "X-VITASK-API" : "e95951eed941e60b6c8b95c0bddf6ab4339b563191038a3da296f9702e8270d4136ee26985a1c4b46fdf67436da5e89a9e24472ac4a4e6daba6dd0d9938b8ba8"
        }
    
        // Set this variable as true for development purpose and save api calls
        READ_FROM_FILE = false
    
        if (READ_FROM_FILE){
            // const file = require(filename)
            // return file
        }
        else{
            return fetch("https://vitask.me/api/"+route, {
                method : "POST",
                headers : headers,
                body : JSON.stringify(body)
            }).then(res => res.json())
        }
    }
    
    // New API structure for first time login:
    // Gettoken(similar to vtop login) -> Timetable -> Attendance -> marks -> history 
    export const getToken = (username, password) =>{
        return dispatch => {
            dispatch(loginVTOPRequest)
            callAPI("gettoken", {
                "username" : username,
                "password" : password
            }).then(res =>{
                // This is the API Response in JSON Format
                if (res['error']){
                    dispatch(loginVTOPError("Password/ Username Incorrect"))
                }else{
                    dispatch(loginVTOPSuccess(res))
                }
            }).catch(err => dispatch(loginVTOPError(err)))
        }
    }
    
    export const firstAttendance = () => {
        // This function is meant to be used first time only.
        // While login
        return (dispatch, getState) => {
            dispatch(fetchAttendanceRequest)
            const state = getState().reducer
            callAPI("/vtop/attendance", {
                "token": state.userInfo.APItoken
            }).then(res => {
                // This is the response in JSON format read function callAPI
                // TODO: Handle errors
                dispatch(fetchAttendanceSuccess(res))
            }).catch(err => dispatch(fetchAttendanceError(err)))
        }
    }
    
    export const firstTimetable = ()=>{
        // Again this function is meant to be used first time only
        return (dispatch, getState)=>{
            dispatch(fetchTimetableRequest())
            const state = getState().reducer
            callAPI("/vtop/timetable", {
                "token" : state.userInfo.APItoken
            }).then(res => {
                // res is the JSON object from api call
                console.log("IN TIMETABLE",res)
                dispatch(fetchTimetableSuccess(res))
            }).catch(err => {dispatch(fetchTimetableError(err))
            console.log("TIMETABLE ERROR",err)
            })
        }
    }

    export const firstMarks = ()=>{
        return (dispatch, getState)=>{
            dispatch(fetchMarksRequest())
            const state = getState().reducer
            callAPI("/vtop/marks", {
                "token" : state.userInfo.APItoken
            }).then(res =>{
                // Meh. Still JSON object from the API Call
                dispatch(fetchMarksSuccess(res))
            }).catch(err => dispatch(fetchMarksError(err)))
        }
    }

    export const firstHistory = ()=>{
        return (dispatch, getState)=>{
            dispatch(fetchAcadHistoryRequest())
            const state = getState().reducer
            callAPI("/vtop/history", {
                "token" : state.userInfo.APItoken
            }).then(res =>{
                // Meh. Still JSON object from the API Call
                dispatch(fetchAcadHistorySuccess(res))
            }).catch(err => dispatch(fetchAcadHistoryError(err)))
        }
    }
    
    export const moodleLogin = (password)=>{
        return (dispatch, getState) =>{
            dispatch(loginMoodleRequest())
            const state = getState().reducer
            callAPI("/moodle/login", {
                    "username" : state.userInfo.RegNo,
                    "password" : password,
                    "token" : state.userInfo.APItoken
                }
            ).then(res => {
                dispatch(loginMoodleSuccess(res))
            }).catch(err => dispatch(loginMoodleError(err)))
        }
    }

    export const softRefresh = (password)=>{
        return(dispatch, getState) =>{
            dispatch(softRefreshRequest())
            const state = getState().reducer
            callAPI("/vtop/sync",{
                "username" : state.userInfo.RegNo,
                "password" : password,
                "token" : state.userInfo.APItoken,
                "hardRefresh" : false
            }).then(res =>{
                if(res['error']){
                    dispatch(softRefreshError(res['error']))
                }else{
                    dispatch(softRefreshSuccess(res))
                }
            }).catch(err =>{ dispatch(softRefreshError(err)) })
        }
    }

    

    export const storeRedux = (rState) =>{
        return(dispatch,getState) =>{
            dispatch(storeState(rState))
        }
    }