# This file contains all the functions required for VTOP.
# File made for VITask server. Development Version.

#imports
import datetime, requests
from bs4 import BeautifulSoup
from collections import namedtuple
from utility import solve_captcha, timetable_slots, timeconverter, get_timestamp
from vtop_parser import parse_attendance, parse_timetable, parse_acadhistory, parse_profile, parse_marks
from insert import insert_attendance, insert_timetable, insert_acadhistory, insert_profile, insert_account, insert_marks
from constants import *
import firebase_admin
from firebase_admin import db
import base64
from crypto import magichash

ref = db.reference('vitask')

def generate_session(username, password):
    """
    This function generates a session with VTOP. Solves captcha and returns Session object
    """
    
    sess = requests.Session()
    # VTOP also not secure
    sess.get(VTOP_BASE_URL,headers = HEADERS, verify= False)
    login_html = sess.post(VTOP_LOGIN,headers = HEADERS, verify= False).text
    alt_index = login_html.find('src="data:image/png;base64,')
    alt_text = login_html[alt_index+5:] 
    end_index = alt_text.find('"')
    captcha_src = alt_text[:end_index]
    captcha = solve_captcha(captcha_src,username)
    payload = {
        "uname" : username,
        "passwd" : password,
        "captchaCheck" : captcha
    }
    post_login_html = sess.post(VTOP_DO_LOGIN, data=payload, headers=HEADERS, verify=False).text
    
    valid = True
    
    try:
        soup = BeautifulSoup(post_login_html, 'lxml')
        code_soup = soup.find_all('div', {"id": "captchaRefresh"})
    except Exception as e:
        print(e)
        valid = False
    finally:
        if(len(code_soup)!=0):
            valid = False
        return (sess,valid)

def get_attendance(sess, username, id, semesterID="CH2020211"):
    """
    This function gets the attendance details, from the VTOP page. Returns a json object with 
    key : slot and value as attendance details
    {
        "slot" : {
            "attended" : 18   // Attended classes
            "total" : 20     // Total classes
            "pecentage" : 90 // Round off % from VTOp
            "faculty" : "AMIT KUMAR TYAGI"  // Faculty details
            "courseName" : "Operating Systems" 
            "code" : "CSE2005" 
            "type" : "Embedded Theory",
            "updatedOn" : "Wed Apr 15 04:27:10 2020"  // Time at which attendance was fetched
        }
    }
    """
    
    payload = {
        "semesterSubId" : semesterID,        # Filled for Winsem
        "authorizedID" : username,
        "x" : datetime.datetime.now(datetime.timezone.utc).strftime("%c GMT")   # GMT time
    }
    status = True
    attend = {}
    q = {}
    try:
        attendance = sess.post(ATTENDANCE, data=payload, headers=HEADERS, verify=False)
        # Check for 200 CODE
        if attendance.status_code !=200:
            status = False
    except:
        status = False
    finally:
        attendance_html = attendance.text
        try:
            attend, q = parse_attendance(attendance_html)
        except Exception as e:
            print(e)
            status = False
        finally:
            if(insert_attendance(id, attend, q)):
                status = True
            else:
                status = False

            return (attend, q, status)

def get_timetable(sess, username, id, semesterID="CH2020211"):
    """
    Returns Timetable 
    Format of timetable : {
        "Monday": [
            {
                "slot" : "A1",
                "courseName" : "Computer Communication",
                "code" : "ECE4008",
                "class" : "AB1 408",
                startTime: "8:00",
                endTime:"8:50"
            }
        ]
    }
    """
    payload = {
        "semesterSubId" : semesterID,        # Filled for Winsem
        "authorizedID" : username,
        "x" : datetime.datetime.now(datetime.timezone.utc).strftime("%c GMT")   # GMT time
    }
    status = True
    days = {}
    final_dict = {}
    try:
        timetable_sess = sess.post(TIMETABLE, data=payload, headers=HEADERS, verify=False)
        # Check for 200 CODE
        if timetable_sess.status_code !=200:
            status = False
    except:
        status = False
    finally:
        timetable_html = timetable_sess.text
        try:
            days, final_dict = parse_timetable(timetable_html)
        except Exception as e:
            print(e)
            status = False
        finally:
            if(insert_timetable(id, days, final_dict)):
                status = True
            else:
                status = False
    
            return (days, final_dict, status)

def get_acadhistory(sess,username,id):
    """
    Returns Academic History of Student or Grade History
    Format is {
        subjects : {
            subjectName : grade
            ...
        },
        summary:{
            "CreditsRegistered" : Num,
            "CreditsEarned" : Num,
            "CGPA" : str,
            "S" : Num
            "A" : Num,
            ...
        }
    }
    """

    # Payload for Academic History.
    payload = {
        "verifyMenu" : "true",        
        "winImage" : "undefined",
        "authorizedID": username,
        "nocache" : "@(new Date().getTime())"   
    }
    status = True
    grades = {}
    try:
        acad_sess = sess.post(ACADHISTORY, data=payload, headers=HEADERS, verify=False)
        # Check for 200 CODE
        if acad_sess.status_code !=200:
            status = False
    except:
        status = False
    finally:
        acad_html = acad_sess.text
        try:
            grades = parse_acadhistory(acad_html)
        except Exception as e:
            print(e)
            status = False
        finally:
            if(insert_acadhistory(id, grades["subjects"], grades["summary"])):
                status = True
            else:
                status = False
    
            return (grades, status)


def get_student_profile(sess,username):
    """
    Returns Students Personal Details
    Format is {
        "name: "Name-OF-Student",
        "branch": "Elecronisdnvvjssvkjnvljdf",
        "program" : "BTECH",
        "regno" : "17GHJ9838",
        "appNo" : "983y40983",
        "school" : "School of sjdhjs oshdvojs",
        "email" : "notgonnatypehere@fucku.com",
        "proctorEmail" : "yeahkillhim@nah.com",
        "proctorName' "Good Guy",
    }
    """
    # Payload for Profile page.
    payload = {
        "verifyMenu" : "true",        
        "winImage" : "undefined",
        "authorizedID": username,
        "nocache" : "@(new Date().getTime())"   
    }
    status = True
    profile = {}
    try:
        profile_sess = sess.post(PROFILE, data=payload, headers=HEADERS, verify=False)
        # Check for 200 CODE
        if profile_sess.status_code !=200:
            status = False
    except:
        status = False
    finally:
        profile_html = profile_sess.text
        try:
            profile = parse_profile(profile_html)
        except Exception as e:
            print(e)
            status = False
        finally:
            if(insert_profile(profile['appNo'], profile)):
                
                header_value = magichash(profile['appNo'])
                temp = ref.child("account").child('account-'+profile['appNo']).child(profile['appNo']).get() 

                if(temp is None):
                    if(insert_account(profile['regNo'], profile, header_value)):
                        status = True
                    else:
                        status = False
            else:
                status = False

            return (profile, status)

def get_marks(sess, username, id, semesterID="CH2020211"):
    """
    Returns Marks of the Student
    Format is: {
      "Marks": {
        "Course 1 Course1 Type": {
          "Exam-1": {
              "max" : 50 //Maximum marks possible in the exam
              "weighatagePercentage" : 15, // % Weightage of this exam
              "scored" : -45   // Actual marks scored, yeah I get -45 marks
              "weightage" : -12.4 // Actual weightage we get
          }
        }
      }
    }
    """
    # Payload for Marks page.
    payload = {
        "semesterSubId" : semesterID,        # Filled for Winsem
        "authorizedID" : username 
    }
    status = True
    marksDict = {}
    try:
        marks_sess = sess.post(MARKS, data=payload, headers=HEADERS, verify=False)
        # Check for 200 CODE
        if marks_sess.status_code !=200:
            status = False
    except:
        status = False
    finally:
        marks_html = marks_sess.text
        try:
            marksDict = parse_marks(marks_html)
        except Exception as e:
            print(e)
            status = False
        finally:
            if(insert_marks(id, marksDict)):
                status = True
            else:
                status = False
    
            return (marksDict, status)
    

