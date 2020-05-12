# How to use new API

The APIs have been changed and currently run in beta mode. However this file contains on info on how to use new APIs. 

First thing to note is that all the APIs are now `POST` requests as compared to previous `GET` requests. We now use `Headers` to check if you are authorised to use API or not. This secret value will not be disclosed here(duh!). If you want to know, contact Apratim or Apoorv.

**All APIs must contain header value defined below**
```
{
    X-VITASK-API : <secret value>
}
```

If you are not passing the above header, you will recieve:
```
{
    error : "Incorrect API Request",
    code  : "400"
}
```

Second thing to note is that APIs will always return something, if error is returned, it is verbose. Each error will also come with a code that tells, where the problem is.

The APIs are divided into 3 parts, General Routes, VTOP Routes, Moodle Routes. Most of the APIs are hidden behind a authorization wall. Get a token from `/api/gettoken` and then use those routes.

This file explains each APIs, what it does, what parameters it returns and what it expects.

## Detailed API Documentation

### General Route

This contains only one Route `/api/gettoken`

**Get Token Route** 
- Path : `/api/gettoken`
- Type : `POST`
- Returns : JSON Object containing personal details of student and API Token.
  ```
  {
      "Name"   :   <Name of Student>
      "School" :   <School>
      "Branch" :   <Branch>
      "Program":   <Program>
      "RegNo"  :   <Register Number>
      "AppNo"  :   <Application Number>
      "Email"  :   <Email ID of Student>
      "ProctorEmail" : <EmailID of Proctor>
      "ProctorName"  : <Name of Proctor>
      "APItoken"     : <API Token> 
  }
  ```
- Accepts: A Header value described above and body must contain username and password:
  ```
  {
      "username" : <Reg Number of student>
      "password" : <Password>
  }
  ```
- Usage Notes: This API must be used only at the time of Login on any app and token must be stored locally. DO NOT use this everytime you want to get token. Use `/api/vtop/sync` or `/api/moodle/sync` for sycing data.

### VTOP Routes

These APIs are associated with VTOP and handle VTOP Data.

**Sync data from Server**
- Path : `/api/vtop/sync` [Protected]
- Type : `POST`
- Returns : This API can return data depending on parameter. If `hardRefresh` is set `false` or not present, then it will return:
  ```
  {
      "attendance" : ATTENDANCE_OBJECT
      "marks"      : MARKS_OBJECT
  }
  ```
  But if `hardRefresh` is `true` then it will return:
  ```
  {
      "attendance"  : ATTENDANCE_OBJECT
      "marks"      : MARKS_OBJECT
      "acadHistory": ACADHISTORY_OBJECT
      "timetable"  : TIMETABLE_OBJECT
  }
  ``` 
- Accepts: Pass headers as described above and this route is protected and requires Token. The body of request must be:
  ```
  {
        "token"    : <Your API Token> 
        "username" : <Registration Number> 
        "password" : <Password>
        "hardRefresh" : <true | false>      [Not Compulsory]
  }
  ```
- Usage Notes : This API is used for re-syncing the data from VTOP server. This DOES NOT return moodle data. In regular mode only marks and attendance are updated. But is done `hardRefresh` is updates Academic History and Timetable

**Get Timetable Info**
- Path : `/api/vtop/timetable` [Protected]
- Type : `POST`
- Returns : The timetable of the student: 
  ```
  {
      "Timetable" : TIMETABLE_OBJECT
  }
  ```
- Accepts : This requires headers as described above and request body must be
  ```
  {
      "token" : <Your API Token>
  }
  ```
- Usage Notes: This must not be called again and again. Use `/api/vtop/sync` with `hardRefresh` as true to get new Timetable. It must be used at time of login for displaying loading messages

**Get Attendance Info**
- Path : `/api/vtop/attendance` [Protected]
- Type : `POST`
- Returns : The attendance of the student: 
  ```
  {
      "Attended" : <List of courses with attendance details>
      "Slots"    : <List of slots registered by student>
      "Track"    : <IDK what this is, but it is what it is>
  }
  ```
- Accepts : This requires headers as described above and request body must be
  ```
  {
      "token" : <Your API Token>
  }
  ```
- Usage Notes: This must not be called again and again. Use `/api/vtop/sync` to get new Attendance. It must be used at time of login for displaying loading messages.

**Get Marks Info**
- Path : `/api/vtop/marks` [Protected]
- Type : `POST`
- Returns : The marks of the student: 
  ```
  {
      "Marks"  : MARKS_OBJECT
  }
  ```
- Accepts : This requires headers as described above and request body must be
  ```
  {
      "token" : <Your API Token>
  }
  ```
- Usage Notes: This must not be called again and again. Use `/api/vtop/sync` to get new Marks. It must be used at time of login for displaying loading messages.

**Get Academic History or Grade History**
- Path : `/api/vtop/history` [Protected]
- Type : `POST`
- Returns : The academic history(or grade history) of the student: 
  ```
  {
      "AcadHistory"  :  ACADEMIC_HISTORY_OBJECT
      "CurriculumDetails" : <Curriculum Details>
  }
  ```
- Accepts : This requires headers as described above and request body must be
  ```
  {
      "token" : <Your API Token>
  }
  ```
- Usage Notes: This must not be called again and again. Use `/api/vtop/sync` with `hardRefresh` as true to get new academic history. It must be used at time of login for displaying loading messages.


### Moodle Routes

These APIs are associated with Moodle and handle Moodle Data.

**Login in Moodle**
- Path: `/api/moodle/login` [Protected]
- Type : `POST`
- Returns : List of assignments with description:
  ```
  {
      "Assignments" : [
          {
              "id"  : <Numeric ID of each Assignment>
              "name" : <Title of Assignment>
              "description" : <Details of Assignment in HTML>    [Parse this HTML on client side]
              "time" : <Deadline Time in UTC seconds> [Parse on client side]
              "url" : <URL of Assignment>
              "course" : < Name of course (Couse Code)>
              "show"  : <true | false> [Whether to show user assignment or not]
          }
          ...
      ]
  }
  ```
- Accepts: The header value as described above and POST body must be:
  ```
  {
      "username" : <Registration Number of Student>
      "password" : <Moodle Password>
      "token"    : <Your API Token>
  }
  ```
- Usage Notes: Use this API only at the time of login. If you want to sync from Moodle use `/api/moodle/sync`.
  

**Sync Assignments from Moodle**
- Path: `/api/moodle/sync` [Protected]
- Type : `POST`
- Returns : List of assignments with description:
  ```
  {
      "Assignments" : [
          {
              "id"  : <Numeric ID of each Assignment>
              "name" : <Title of Assignment>
              "description" : <Details of Assignment in HTML>    [Parse this HTML on client side]
              "time" : <Deadline Time in UTC seconds> [Parse on client side]
              "url" : <URL of Assignment>
              "course" : < Name of course (Couse Code)>
              "show"  : <true | false> [Whether to show user assignment or not]
          }
          ...
      ]
  }
  ```
- Accepts: The header value as described above and POST body must be:
  ```
  {
      "token"    : <Your API Token>
  }
  ```
- Usage Notes: This api must be used for syncing data from Moodle as it keeps `show` status of assignment intact.

**Toggle Show State of Assignment**
- Path: `/api/moodle/toggleshow` [Protected]
- Type : `POST`
- Returns : List of assignments with description:
  ```
  {
      "Assignments" : [
          {
              "id"  : <Numeric ID of each Assignment>
              "name" : <Title of Assignment>
              "description" : <Details of Assignment in HTML>    [Parse this HTML on client side]
              "time" : <Deadline Time in UTC seconds> [Parse on client side]
              "url" : <URL of Assignment>
              "course" : < Name of course (Couse Code)>
              "show"  : <true |false>
          }
          ...
      ]
  }
  ```
- Accepts: The header value as described above and POST body must be:
  ```
  {
      "token" : <Your API Token>
      "ids"   : [
          id1, id2, ...
      ]   
  }
  ```
- Usage Notes: This API must be used for toggling the `show` state of assignments. This returns a list of assignments. Also, note that even if you want to change state of even one assignment provide an array.

---
Please use API as mentioned above only. This will prevent unnecessary requests been made to the Firebase Database.
First these APIs will be checked in beta mode and then only deployed in the final version.

The APIs are designed in such a way that they will always output something. In case APIs does not return any values make sure server is running and contact server administrators.