import datetime
from bs4 import BeautifulSoup
from collections import namedtuple
from utility import *

def parse_attendance(attendance_html):
    # Parsing logic by Swapnil.
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
    return (attend,q)

def parse_timetable(timetable_html):
    # Parsing logic by Apratim
    soup = BeautifulSoup(timetable_html, 'lxml')
    code_soup = soup.find_all('td', {'bgcolor': '#CCFF33'})
    list_soup = soup.find_all('td', {'style': lambda s: 'padding: 3px; font-size: 12px; border-color: #b2b2b2;vertical-align: middle;' in s})
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
    time_table = timetable_slots()
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
                "courseName": slots[i][3].strip().split("\n")[0],
                "code" : slots[i][0],
                "class" : slots[i][1]+" " +slots[i][2],
                "startTime": arr[1],
                "endTime" : arr[2]
            }
            # Replaced Code with much shorter code (Cherub)
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
            if(final>=480 and final<=780):
                l2.append(j)
            else:
                l1.append(j)

        # Time Sorting
        for j in range(1,len(l2)):
            for k in range(0,len(l2)-j):
                temp1 = l2[k]["startTime"].split(":")
                hours1 = int(temp1[0])
                mins1 = int(temp1[1])
                final1 = timeconverter(hours1,mins1)

                temp2 = l2[k+1]["startTime"].split(":")
                hours2 = int(temp2[0])
                mins2 = int(temp2[1])
                final2 = timeconverter(hours2,mins2)
                if(final1>final2):
                    swap_hold = l2[k+1]
                    l2[k+1] = l2[k]
                    l2[k] = swap_hold
        for j in range(1,len(l1)):
            for k in range(0,len(l1)-j):
                temp1 = l1[k]["startTime"].split(":")
                hours1 = int(temp1[0])
                mins1 = int(temp1[1])
                final1 = timeconverter(hours1,mins1)

                temp2 = l1[k+1]["startTime"].split(":")
                hours2 = int(temp2[0])
                mins2 = int(temp2[1])
                final2 = timeconverter(hours2,mins2)
                if(final1>final2):
                    swap_hold = l1[k+1]
                    l1[k+1] = l1[k]
                    l1[k] = swap_hold
        days[i]=l2+l1
        l1 = []
        l2 = []

    # Credits fetching for CGPA calculator begins here
    code_soup1 = soup.find_all('td', {'style': lambda s: 'vertical-align: middle; border: 1px solid #b2b2b2; padding: 5px;' in s})
    list_soup1 = soup.find_all('td', {'style': lambda s: 'padding: 3px; font-size: 12px; border-color: #b2b2b2;vertical-align: middle;' in s})
    #print(code_soup)
    list_course = [i.getText().strip().split("\n")[0] for i in list_soup1]
    #print(list_course)
    code_course = [i.getText() for i in code_soup1]
    hold_course = []
    
    for i in code_course:
        if(code_course.index(i)%9==2):
            i=i[len(i)-2:len(i)-1]
            hold_course.append(i)
        
    course_credits = dict(zip(list_course, hold_course))

    final_dict = {}

    for i in course_credits:
        temp_arr = i.split("-")
        prep_string = temp_arr[0]+"-"+temp_arr[1]
        if prep_string not in final_dict:
            final_dict[prep_string] = int(course_credits[i])
        else:
            final_dict[prep_string] = int(final_dict[prep_string])+int(course_credits[i])

    return (days,final_dict)

def parse_acadhistory(acad_html):
    # Parsing logic by Mayank.
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
    
    return grades

def parse_profile(profile_html):
    # Parsing logic by Apratim.
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
    
    # Generating an API Token
    api_gen = tutorial_code[0]
    api_token = api_gen.encode('ascii')
    temptoken = base64.b64encode(api_token)
    token = temptoken.decode('ascii')

    profile = {
                'name': tutorial_code[1],
                'branch': tutorial_code[19],
                'program': tutorial_code[18],
                'regNo': tutorial_code[15],
                'appNo': tutorial_code[0],
                'school': tutorial_code[20],
                'email': tutorial_code[29],
                'proctorName': tutorial_proctor[92],
                'proctorEmail': tutorial_proctor[97],
                'token': token
            }
    
    return profile

def parse_marks(marks_html):
    # Parsing Logic by Mayank (modified by Apratim and Cherub).
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
            temp_dict[hold[1].getText()] = {
                "max" : hold[2].getText(),
                "weightagePercentage" : hold[3].getText(),
                "scored" : hold[5].getText(),
                "weightage" : hold[6].getText()
            } 
        hold_array.append(temp_dict)
        temp_dict = {}
        
    marksDict = {}
    for i in range(0,len(courses)):
        marksDict[courses[i]] = hold_array[i]
    if(len(marksDict)==0):
        marksDict={"No Courses": {"No Courses": {"max" : "NA", "weighatagePercentage" : "NA", "scored" : "NA", "weightage" : "NA"}}}
    return marksDict