# This file contains all the functions required for VTOP
# File made for VITask server. Development Version. Also VTOP Sucks


#imports
import datetime
import requests
from bs4 import BeautifulSoup
from collections import namedtuple
from utility import solve_captcha,TimeTable
import firebase_admin
from firebase_admin import db
import base64


#TODO: Make Constants file for storing all the constant URLs
#TODO: Make Firebase Sync functions
#TODO: Check whether user is Logged in or not before proceeding
#TODO: Add a function to get all the courses for user and there details


VTOP_BASE_URL = r"http://vtopcc.vit.ac.in:8080/vtop/"
VTOP_LOGIN = r"http://vtopcc.vit.ac.in:8080/vtop/vtopLogin"
ATTENDANCE = r"http://vtopcc.vit.ac.in:8080/vtop/processViewStudentAttendance"
TIMETABLE = r"http://vtopcc.vit.ac.in:8080/vtop/processViewTimeTable"
ACADHISTORY = r"http://vtopcc.vit.ac.in:8080/vtop/examinations/examGradeView/StudentGradeHistory"
PROFILE = r"http://vtopcc.vit.ac.in:8080/vtop/studentsRecord/StudentProfileAllView"
MARKS = r"http://vtopcc.vit.ac.in:8080/vtop/examinations/doStudentMarkView"
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36',
}

def timeconverter(hours,mins):
    time = hours*60+mins
    return time

def generate_session(username, password):
    """
    This function generates a session with VTOP. Solves captcha and returns Session object
    """
    
    sess = requests.Session()
    # VTOP also not secure
    sess.get(VTOP_BASE_URL,headers = headers, verify= False)
    login_html = sess.post(VTOP_LOGIN,headers = headers, verify= False).text
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
    post_login_html = sess.post("http://vtopcc.vit.ac.in:8080/vtop/doLogin", data=payload, headers=headers, verify=False).text
    
    valid = True
    
    try:
        soup = BeautifulSoup(post_login_html, 'lxml')
        code_soup = soup.find_all('p', {"class": "box-title text-danger"})
        try:
            invalid = code_soup[0].getText()
        except:
            return (sess, valid)
    finally:
        try:
            if(len(invalid)==27 or len(invalid)==61):
                sess = False
                valid = False
        except:
            return (sess, valid)
        return (sess,valid)

def get_attandance(sess, username, id, semesterID="CH2019205"):
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
    
    # TODO: Check if still login or not
    payload = {
        "semesterSubId" : semesterID,        # Filled for Winsem
        "authorizedID" : username,
        "x" : datetime.datetime.now(datetime.timezone.utc).strftime("%c GMT")   # GMT time
    }
    attendance = sess.post(ATTENDANCE, data=payload, headers=headers, verify=False)
    # Check for 200 CODE
    if attendance.status_code !=200:
        raise ValueError("Could not fetch attendance")
    attendance_html = attendance.text

    # Using earlier code from main.py. Thanks to who ever contributed.
    soup = BeautifulSoup(attendance_html, 'lxml')
    code_soup = soup.find_all('tr')
    tutorial_code = [i.getText() for i in code_soup]
    table = []
    p=[]

    for i in tutorial_code:
        i=i.strip('Sl.No\nCourse\n\t\t\t\t\t\t\t\t\t\t\t\t\tCode\nCourse\n\t\t\t\t\t\t\t\t\t\t\t\t\tTitle\nCourse\n\t\t\t\t\t\t\t\t\t\t\t\t\tType\nSlot\nFaculty\n\t\t\t\t\t\t\t\t\t\t\t\t\tName\nAttendance Type\nRegistration Date / Time\nAttendance Date\nAttended Classes\nTotal Classes\nAttendance Percentage\nStatus\nAttendance View')
        i = i.split('\n')
        if i not in table:
            table.append(i)

    table.pop(0)

    for i in range(0,len(table)):
        p.append(table[i])


    attend = {}
    empty = []
    for i in range(0,len(p)-1):
        # empty = [p[i][21],p[i][20],p[i][5],p[i][7]]
        empty = {
            "code" : p[i][2],
            "courseName" : p[i][5],
            "type" : p[i][7],
            "faculty" : p[i][11],
            "attended" : int(p[i][20]),
            "total" : int(p[i][21]),
            "percentage" : int(p[i][22]),
            "updatedOn" : datetime.datetime.now().strftime("%c")
        }
        attend[p[i][8]] = empty
        c=0
        q={}
        for i in attend:
            q[i] = c
            c = c + 1
    
    ref = db.reference('vitask')
    tut_ref = ref.child("attendance")
    new_ref = tut_ref.child('attendance-'+id)
    new_ref.set({
        id: {
            'Attendance': attend,
            'Track': q
        }
    })

    return (attend, q)

def get_timetable(sess, username, id, semesterID="CH2019205"):
    """
    Return Timetable 
    format of timetablel : {
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
    # TODO: Check if still login or not
    payload = {
        "semesterSubId" : semesterID,        # Filled for Winsem
        "authorizedID" : username,
        "x" : datetime.datetime.now(datetime.timezone.utc).strftime("%c GMT")   # GMT time
    }
    timetable_sess = sess.post(TIMETABLE, data=payload, headers=headers, verify=False)
    # Check for 200 CODE
    if timetable_sess.status_code !=200:
        raise ValueError("Could not fetch TimeTable")
    timetable_html = timetable_sess.text

    # This code is copied from main.py, I may change some of the code, Thanks to whoever contributed
    # I didnot named the variables. Please kill me!

    soup = BeautifulSoup(timetable_html, 'lxml')
    code_soup = soup.find_all('td', {'bgcolor': '#CCFF33'})
    list_soup = soup.find_all('td', {'style': lambda s: 'padding: 3px; font-size: 12px; border-color: #3c8dbc;vertical-align: middle;text-align: left;' in s})
    list_code = [i.getText() for i in list_soup]
    courses = {}
    for i in list_code:
        arr = i.split("-")
        courses[arr[0].strip()] = arr[1].strip()
    tutorial_code = [i.getText() for i in code_soup]
    table = []
    for i in tutorial_code:
        if i not in table:
            table.append(i)
    slots = {}
    time_table = {}
    time_table = TimeTable()
    for i in table:
        p = []
        arr = i.split("-")
        p = [arr[1],arr[3],arr[4],courses[arr[1]],time_table[arr[0]]]
        slots[arr[0]] = p

    days = {"Monday":[],"Tuesday":[],"Wednesday":[],"Thursday":[],"Friday":[]}
    p = []
    for i in slots:
        for j in slots[i][4]:
            arr = j.split(" ")
            p = {
                "slot" : i,
                "courseName": slots[i][3],
                "code" : slots[i][0],
                "class" : slots[i][1]+" " +slots[i][2],
                "startTime": arr[1],
                "endTime" : arr[2]
            }
            # Replaced Code with much shorter code
            days[arr[0]].append(p)
            p = []
            
    l1 = []
    l2 = []
            
    for i in days:
        for j in days[i]:
            temp = j["startTime"].split(":")
            hours = int(temp[0])
            mins = int(temp[1])
            final = timeconverter(hours,mins)
            if(final>=360 and final<=780):
                l2.append(j)
            else:
                l1.append(j)
        days[i]=l2+l1
        l1 = []
        l2 = []
            
    ref = db.reference('vitask')
    tut_ref = ref.child("timetable")
    new_ref = tut_ref.child('timetable-'+id)
    new_ref.set({
        id: {
            'Timetable': days
        }
    })
    
    return days

def get_acadhistory(sess,username,id):
    """
    Get Academic History of Student or Grade History, as VTOP likes to call it
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

    # TODO: Check if still login or not

    #Finally some change in Payload. VTOP Grow UP you sucker
    payload = {
        "verifyMenu" : "true",        # IDK, what is this
        "winImage" : "undefined",
        "authorizedID": username,
        "nocache" : "@(new Date().getTime())"   # WTF does it even mean?
    }
    acad_sess = sess.post(ACADHISTORY, data=payload, headers=headers, verify=False)
    # Check for 200 CODE
    if acad_sess.status_code !=200:
        raise ValueError("Could not fetch Academic History")
    acad_html = acad_sess.text

    # This sucks I dont want to see my acad history, kill me pls!
    # This code is copied from main.py, I may change some of the code, Thanks to whoever contributed
    # Special thanks to this guys, he included comments yay!

    soup = BeautifulSoup(acad_html, 'lxml')
    # Fetching the last row in academic history which contains the Curriculum Details
    code_soup = soup.findAll("tr", {"class": "tableContent"})
    
    # Processing the data to get the required details
    curriculumKeys = ['CreditsRegistered', 'CreditsEarned', 'CGPA', 'S', 'A', 'B', 'C', 'D', 'E', 'F', 'N']
    temp = []
    cgpaDetails = code_soup[len(code_soup)-1].getText()
    for i in cgpaDetails:
        if(i):
            temp.append(i)
    temp = temp[1:len(temp)]
    # Fetching data and Creating Dictionary
    curriculumDetails = {}
    m = 0
    s = ""
    for j in temp:
        if(j!='\n'):
            s = s+j
        else:
            curriculumDetails[curriculumKeys[m]] = s
            m = m+1
            s = ""
    # Fetching the table containing the complete academic history
    code_soup = soup.findAll("tr", {"class": "tableContent"})
    # Removing unneccessary Details
    cour = []
    for i in range (0,8):
        code_soup.pop()
    code_soup = code_soup[1:len(code_soup)]
    for i in code_soup:
        if(len(i)==23):
            cour.append(i.findAll('td'))
    # Fetching Course Name and Grade from the cour array above and making the final Dictionary.
    acadHistory = {}
    for i in cour:
        acadHistory[i[2].getText()] = i[5].getText()
    

    grades = {
        "subjects" : acadHistory,
        "summary" : curriculumDetails
    }
    
    ref = db.reference('vitask')
    tut_ref = ref.child("acadhistory")
    new_ref = tut_ref.child('acadhistory-'+id)
    new_ref.set({
        id: {
            'AcadHistory': acadHistory,
            'CurriculumDetails': curriculumDetails
        }
    })
    
    return grades

def get_student_profile(sess,username):
    """
    Returns students personal details, maybe useful idk
    format is {
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
    # TODO: Check if still login or not

    # Weird Payload data returns yay, i stil dont know what this is
    payload = {
        "verifyMenu" : "true",        
        "winImage" : "undefined",
        "authorizedID": username,
        "nocache" : "@(new Date().getTime())"   
    }
    profile_sess = sess.post(PROFILE, data=payload, headers=headers, verify=False)
    # Check for 200 CODE
    if profile_sess.status_code !=200:
        raise ValueError("Could not fetch Profile Details Properly")
    profile_html = profile_sess.text

    # This code is copied from main.py, I may change some of the code, Thanks to whoever contributed

    soup = BeautifulSoup(profile_html, 'lxml')
    code_soup = soup.find_all('td', {'style': lambda s: 'background-color: #f2dede;' in s})
    tutorial_code = [i.getText() for i in code_soup]
    code_proctor = soup.find_all('td', {'style': lambda s: 'background-color: #d4d3d3;' in s})
    tutorial_proctor = [i.getText() for i in code_proctor]
    holdname = tutorial_code[1].lower().split(" ")
    tempname = []
    for i in holdname:
        tempname.append(i.capitalize())
    finalname = (" ").join(tempname)
    tutorial_code[1] = finalname

    profile = {
            'name': tutorial_code[1],
            'branch': tutorial_code[18],
            'program': tutorial_code[17],
            'regNo': tutorial_code[14],
            'appNo': tutorial_code[0],
            'school': tutorial_code[19],
            'email': tutorial_code[29],
            'proctorName': tutorial_proctor[93],
            'proctorEmail': tutorial_proctor[98],
        }
    
    # Generating an API Token
    api_gen = tutorial_code[0]
    api_token = api_gen.encode('ascii')
    temptoken = base64.b64encode(api_token)
    token = temptoken.decode('ascii')

    ref = db.reference('vitask')
    tut_ref = ref.child('profile')
    new_ref = tut_ref.child('profile-'+tutorial_code[0])
    new_ref.set({
        tutorial_code[0]: {
            'Name': (tutorial_code[1]),
            'Branch': tutorial_code[18],
            'Program': tutorial_code[17],
            'RegNo': tutorial_code[14],
            'AppNo': tutorial_code[0],
            'School': tutorial_code[19],
            'Email': tutorial_code[29],
            'ProctorName': tutorial_proctor[93],
            'ProctorEmail': tutorial_proctor[98],
            'API': token
        }
    })

    return profile

def get_marks(sess, username, id, semesterID="CH2019205"):
    # TODO: Check if still login or not

    payload = {
        "semesterSubId" : semesterID,        # Filled for Winsem
        "authorizedID" : username 
    }
    marks_sess = sess.post(MARKS, data=payload, headers=headers, verify=False)
    # Check for 200 CODE
    if marks_sess.status_code !=200:
        raise ValueError("Could not fetch Marks Details Properly")
    marks_html = marks_sess.text
    
    # Thanks to Mayank for the parsing logic,I have modified it accordingly for the new version
    soup = BeautifulSoup(marks_html, 'lxml')
    code_soup = soup.findAll("table", {"class": "customTable-level1"})
    code_soup2 = soup.findAll("tr", {"class": "tableContent"})
    
    courses = []
    temp = []
    for i in range(0,len(code_soup2),2):
        temp = code_soup2[i].findAll("td")
        courses.append(temp[3].getText()+" "+temp[4].getText())
        temp = []
        
    temp = []
    hold = []
    temp_dict = {}
    hold_array = []
    for i in code_soup:
        temp = i.findAll("tr", {"class": "tableContent-level1"})
        for j in temp:
            hold = j.findAll("td")
            temp_dict[hold[1].getText()] = hold[5].getText()
        hold_array.append(temp_dict)
        temp_dict = {}
        
    marksDict = {}
    for i in range(0,len(courses)):
        marksDict[courses[i]] = hold_array[i]
        
    ref = db.reference('vitask')
    tut_ref = ref.child('marks')
    new_ref = tut_ref.child('marks-'+id)
    new_ref.set({
        id: {
            'Marks': marksDict
        }
    })
    return marksDict