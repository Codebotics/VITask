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

    FETCH_MOODLE_ASSIGNMENTS_REQUEST,
    FETCH_MOODLE_ASSIGNMENTS_SUCCESS,
    FETCH_MOODLE_ASSIGNMENTS_ERROR,
    FETCH_MOODLE_ASSIGNMENTS_SYNC,

    FETCH_ACADHISTORY_REQUEST,
    FETCH_ACADHISTORY_SUCCESS,
    FETCH_ACADHISTORY_ERROR,

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

    const fetchMoodleAssignmentsRequest = ()=>{
        return{
            type : FETCH_MOODLE_ASSIGNMENTS_REQUEST
        }
    }

    const fetchMoodleAssignmentsSuccess = (assignments) =>{
        return{
            type : FETCH_MOODLE_ASSIGNMENTS_SUCCESS,
            data : assignments
        }
    }

    const fetchMoodleAssignmentsError = (err) =>{
        return{
            type : FETCH_MOODLE_ASSIGNMENTS_ERROR,
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
            type : FETCH_ATTENDANCE_ERROR,
            error : err
        }
    }
    
    export const reformatData = ()=>{
        return {
            type : REFORMAT_DATA    
        }
    }

    export const storeState = (rState)=>{
        return{
            type : STORE_STATE_FROM_ASYNC,
            data : rState
        }
    }

    // Use this function to get the API calls
    const callAPI = (route, body, filename)=>{
        const headers = {
            Accept : "application/json",
        "Content-Type" : "application/json",
        "X-VITASK-API" : "e95951eed941e60b6c8b95c0bddf6ab4339b563191038a3da296f9702e8270d4136ee26985a1c4b46fdf67436da5e89a9e24472ac4a4e6daba6dd0d9938b8ba8"
        }
    
        // Set this variable as true for development purpose and save api calls
        READ_FROM_FILE = false
    
        if (READ_FROM_FILE){
            return require(filename)
        }
        else{
            return fetch("https://vitask.me/api/"+route, {
                method : "POST",
                headers : headers,
                body : JSON.stringify(body)
            }).then(res => res.json())
        }
    }
    
    const ORIGINAL_VTOP_LOGIN = `https://vitask.me/authenticate?username={username}&password={password}`
    const ORIGINAL_ATTENDANCE = `https://vitask.me/classesapi?token={state.reducer.userInfo.APItoken}`
    const ORIGINAL_TIMETABLE = `https://vitask.me/timetableapi?token={state.reducer.userInfo.APItoken}`
    const ORIGINAL_MARKS = 'https://vitask.me/marksapi?token={state.reducer.userInfo.APItoken}'
    const ORIGINAL_MOODLE = `https://vitask.me/moodleapi?username={username}&password={password}&appno={appNo}`
    const ORIGINAL_ACADEMIC_HISTORY = "https://vitask.me/acadhistoryapi?token={state.reducer.userInfo.APItoken}"
    
    export const loginVTOP =(username, password) => {
        return dispatch=>{
            dispatch(loginVTOPRequest)
            console.log(`https://vitask.me/authenticate?username=${username}&password=${password}`)
            fetch(`http://134.209.150.24/authenticate?username=${username}&password=${password}`)
            .then(res => res.json())
            .then(res => {
                // res = require("../authenticate.json")
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
            fetch('http://134.209.150.24/classesapi?token=' + state.reducer.userInfo.APItoken)
            .then(res => {
                // res = require("../classesapi.json")
                return res.json()})
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
            fetch('http://134.209.150.24/timetableapi?token=' + state.reducer.userInfo.APItoken)
            .then(res => {
                // res = require("../timetableapi.json")
                return res.json()})
            .then(res =>{
                dispatch(fetchTimetableSuccess(res))
            })
            .catch(err=> dispatch(fetchTimetableError(err)))
        }
    }
    
    export const fetchMarks = () => {
        return (dispatch, getState) =>{
            const state = getState()
            dispatch(fetchMarksRequest)
            fetch('http://134.209.150.24/marksapi?token=' + state.reducer.userInfo.APItoken)
            .then(res => {
                // res = require("../marks.json")
                return res.json()})
            .then(res =>{
                dispatch(fetchMarksSuccess(res))
            })
            .catch(err=> dispatch(fetchMarksError(err)))
        }
    }

    export const fetchMoodleAssignments = (password)=>{
        return (dispatch, getState)=>{
            const state = getState()
            dispatch(fetchMoodleAssignmentsRequest)
            const username = state.reducer.userInfo.RegNo
            const appno = state.reducer.userInfo.AppNo
            fetch(`http://134.209.150.24/moodleapi?username=${username}&password=${password}&appno=${appno}`   )
            .then(res =>{
                // res = require('../moodleapi.json')
                return res.json()
            }).then(res =>{
                dispatch(fetchMoodleAssignmentsSuccess(res))
            })
            .catch(err => dispatch(fetchMoodleAssignmentsError(err)))
        }
    }

    export const fetchAcadHistory = () =>{
        return(dispatch,getState) =>{
            const state = getState()
            dispatch(fetchAcadHistoryRequest)
            fetch('http://134.209.150.24/acadhistoryapi?token=' + state.reducer.userInfo.APItoken)
            .then(res =>{
                // res = require('../acadhistory.json')
                return res.json()
            }).then(res =>{
                dispatch(fetchAcadHistorySuccess(res))
            })
            .catch(err =>{dispatch((fetchAcadHistoryError(err)))})
        }
    }

    export const storeRedux = (rState) =>{
        return(dispatch,getState) =>{
            dispatch(storeState(rState))
        }
    }