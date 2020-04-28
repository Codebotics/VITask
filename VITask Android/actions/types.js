// Called at the beginning of the app
export const LOGIN_VTOP_REQUEST = "LOGIN_VTOP_REQUEST"
export const LOGIN_VTOP_SUCCESS = "LOGIN_VTOP_SUCCESS"
export const LOGIN_VTOP_ERROR = "LOGIN_VTOP_ERROR"

// Called at the beginning of app, Timetable doesnot changes
export const FETCH_TIMETABLE_REQUEST = "FETCH_TIMETABLE_REQUEST"
export const FETCH_TIMETABLE_SUCCESS = "FETCH_TIMETABLE_SUCCESS"
export const FETCH_TIMETABLE_ERROR = "FETCH_TIMETABLE_ERROR"

// Will sync Attendance details
export const FETCH_ATTENDANCE_REQUEST = "FETCH_ATTENDANCE_REQUEST"
export const FETCH_ATTENDANCE_SUCCESS = "FETCH_ATTENDANCE_SUCCESS"
export const FETCH_ATTENDANCE_ERROR = "FETCH_ATTENDANCE_ERROR"
export const SYNC_ATTENDANCE = 'SYNC_ATTENDANCE'

// These are only for using developement purpose to save api calls, instead api calls are done to dummy server
export const DEV_LOAD_ATTENDANCE = "DEV_LOAD_ATTENDANCE"
export const DEV_LOAD_PROFILE = "DEV_LOAD_PROFILE"
export const DEV_LOAD_TIMETABLE = "DEV_LOAD_TIMETABLE"


// Formatting data, only called first time
export const REFORMAT_DATA = "REFORMAT_DATA"
// Will be called after Logging into Moodle
const LOGIN_MOODLE = "LOGIN_MOODLE"
// Get the Bulk assignments
const SYNC_ASSIGNMENTS = "ASSIGNMENT"
// Get the resources for the subject
const SYNC_RESOURCES = "RESOURCES"

