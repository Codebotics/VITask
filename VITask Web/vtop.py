# This file contains all the functions required for VTOP
# File made for VITask server. Development Version. Also VTOP Sucks


#imports
import datetime
import requests
from bs4 import BeautifulSoup
from collections import namedtuple
from utility import solve_captcha


VTOP_BASE_URL = r"http://vtopcc.vit.ac.in:8080/vtop/"
VTOP_LOGIN = r"http://vtopcc.vit.ac.in:8080/vtop/vtopLogin"
ATTENDANCE = r"http://vtopcc.vit.ac.in:8080/vtop/processViewStudentAttendance"
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36',
}

def generate_session(username, password):
    """
    This function generates a session with VTOP. Solves captcha and returns Session object
    """
    
    sess = requests.Session()
    # VTOP also not secure, y u do dis ,, yy ??
    sess.get(VTOP_BASE_URL,headers = headers, verify= False)
    login_html = sess.post(VTOP_LOGIN,headers = headers, verify= False).text
    alt_index = login_html.find('src="data:image/png;base64,')
    alt_text = login_html[alt_index+5:] 
    end_index = alt_text.find('"')
    captcha_src = alt_text[:end_index]
    captcha = solve_captcha(captcha_src)
    payload = {
        "uname" : username,
        "passwd" : password,
        "captchaCheck" : captcha
    }
    sess.post("http://vtopcc.vit.ac.in:8080/vtop/doLogin", data=payload, headers=headers, verify=False)
    return sess

def get_attandance(sess,username, semesterID="CH2019205"):
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
            "type" : "Embedded Theory"
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
    print(p)
    for i in range(0,len(p)-1):
        # empty = [p[i][21],p[i][20],p[i][5],p[i][7]]
        empty = {
            "code" : p[i][2],
            "courseName" : p[i][5],
            "type" : p[i][7],
            "faculty" : p[i][11],
            "attended" : int(p[i][20]),
            "total" : int(p[i][21]),
            "percentage" : int(p[i][22])
        }
        print(empty)
        attend[p[i][8]] = empty
    
    # TODO: Sync with Firebase

    return attend
