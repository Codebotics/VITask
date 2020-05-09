"""---------------------------------------------------------------
                VITask | A Dynamic VTOP API server

        "Any fool can write code that a computer can understand.
        Good programmers write code that humans can understand."
------------------------------------------------------------------"""

from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from bs4 import BeautifulSoup
import firebase_admin
from firebase_admin import db
from PIL import Image
from PIL import ImageFilter
from datetime import timezone,datetime,timedelta
import requests
import urllib3
import time
import pandas as pd
import pickle
import re
import os
import random
import hashlib
import bcrypt
import requests
import json
import time
import base64
import zipfile
from urllib.request import urlretrieve
import sys
from sys import platform as _platform
from vtop import generate_session
from vtop import get_attandance
from vtop import get_student_profile
from vtop import get_acadhistory
from vtop import get_timetable
from vtop import get_marks
from multiprocessing import Process
#For disabling warings this will save msecs..lol
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)


# Initialize Flask app
app = Flask(__name__)

# Set the port for Flask app
port = int(os.environ.get('PORT', 5000))

# Change this to your secret key (can be anything, it's for extra protection)
app.secret_key = 'canada$God7972#'

# Initialize Firebase app
firebase_admin.initialize_app(options={'databaseURL': 'https://vitask.firebaseio.com/'})


# Functions for Moodle begin here
MOODLE_LOGIN_URL = r"https://moodlecc.vit.ac.in/login/index.php"

def get_timestamp():
    """
    Utility function to generate current timstamp
    """
    dt = datetime.now() - timedelta(15)
    utc_time = dt.replace(tzinfo = timezone.utc) 
    return int(utc_time.timestamp())

def get_moodle_session(username, password):
    """
    This function logins in moodle and gets session Id 
    return session object and sess_key
    """
    sess = requests.Session()
    #Moodle passes anchor secretly idk why lol
    payload = {
        "username" : username,
        "password" : password,
        "anchor"   : ""
    }

    #Using verify = False is deadly but moodle's a bitch
    login_text = sess.post(MOODLE_LOGIN_URL,data=payload, verify=False).text

    #TODO : Check is password is correct or not
    #For finding session key. This is where moodle sucks lol. Didn't use useragent check and cookies. F U
    sess_key_index = login_text.find("sesskey")
    sess_key = login_text[sess_key_index+10:sess_key_index+20]

    return sess, sess_key

def get_dashboard_json(sess, sess_key):
    """
    This function returns dashboard json data fields array
    """
    #TODO:Find a better method to format string
    DASHBOARD_URL = "https://moodlecc.vit.ac.in/lib/ajax/service.php?sesskey="+sess_key+"&info=core_calendar_get_action_events_by_timesort"
    
    dashboard_payload = [
        {
            "index":0,
            "methodname":"core_calendar_get_action_events_by_timesort",
            "args":{
                "limitnum":20,
                "timesortfrom":get_timestamp()
                }
        }
    ]

    dashboard_text = sess.post(DASHBOARD_URL, data = json.dumps(dashboard_payload), verify= False).text
    dashboard_json = json.loads(dashboard_text)
    return dashboard_json[0]["data"]["events"]
# Functions for Moodle end here


""" ---------------------------------------------------------------

        We keep our code DRY(Do not repeat yourselves). 
        Thus we have implemented functions ;)

---------------------------------------------------------------"""

def ProfileFunc():
    ref = db.reference('vitask')
    name = ref.child('profile').child('profile-'+session['id']).child(session['id']).child('Name').get()
    school = ref.child('profile').child('profile-'+session['id']).child(session['id']).child('School').get()
    branch = ref.child('profile').child('profile-'+session['id']).child(session['id']).child('Branch').get()
    program = ref.child('profile').child('profile-'+session['id']).child(session['id']).child('Program').get()
    regno = ref.child('profile').child('profile-'+session['id']).child(session['id']).child('RegNo').get()
    appno = ref.child('profile').child('profile-'+session['id']).child(session['id']).child('AppNo').get()
    email = ref.child('profile').child('profile-'+session['id']).child(session['id']).child('Email').get()
    proctoremail = ref.child('profile').child('profile-'+session['id']).child(session['id']).child('ProctorEmail').get()
    proctorname = ref.child('profile').child('profile-'+session['id']).child(session['id']).child('ProctorName').get()
    api = ref.child('profile').child('profile-'+session['id']).child(session['id']).child('API').get()
    
    return (name, school, branch, program, regno, appno, email, proctoremail, proctorname, api)

def parallel_timetable(sess, username, id):
    ref = db.reference('vitask')
    temp = ref.child("timetable").child('timetable-'+id).child(id).child('Timetable').get()
    if(temp is None):
        days = {}
        days = get_timetable(sess, username, id)
        session['timetable'] = 1
    
def parallel_acadhistory(sess, username, id):
    ref = db.reference('vitask')
    temp = ref.child("acadhistory").child('acadhistory-'+id).child(id).child('AcadHistory').get()
    if(temp is None):
        acadHistory = {}
        curriculumDetails = {}
        grades = get_acadhistory(sess,username,id)
        acadHistory = grades['AcadHistory']
        curriculumDetails = grades['CurriculumDetails']
        session['acadhistory'] = 1
        
def parallel_attendance(sess, username, id):
    attend = {}
    q = {}
    attend, q = get_attandance(sess, username, id)
    session['classes'] = 1

def parallel_marks(sess, username, id):
    marksDict = {}
    marksDict = get_marks(sess, username, id)
    session['marks'] = 1
    
def runInParallel(*fns):
    proc = []
    for fn in fns:
        p = Process(target=fn)
        p.start()
        proc.append(p)
    for p in proc:
        p.join()


"""---------------------------------------------------------------
                    Functions end here.
---------------------------------------------------------------"""

"""---------------------------------------------------------------
                  Error Pages begin here.
---------------------------------------------------------------"""
@app.errorhandler(404)
def page_not_found(error):
    return render_template('404.html'), 404

"""---------------------------------------------------------------
                  Error Pages end here.
---------------------------------------------------------------"""



"""---------------------------------------------------------------
                    VITask API code begins from here

                Note: This code is the heart of VITask,
                think twice before modifying anything ;)

------------------------------------------------------------------"""

# API for login, to login and generate an API token send a GET request => /authenticate?username=yourusername&password=yourpassword
@app.route('/authenticate', methods=['GET'])
def authenticate():
    ref = db.reference('vitask')
    user_token = request.args.get('token')

    if(user_token is not None):
        # Decoding API token
        temptoken = user_token.encode('ascii')
        try:
            appno = base64.b64decode(temptoken)
        except:
            return jsonify({'Error': 'Invalid API Token.'})
        key = appno.decode('ascii')

        temp = ref.child('profile').child('profile-'+key).child(key).get()

        if(temp is not None):
            session['id'] = key
            name, school, branch, program, regno, appno, email, proctoremail, proctorname, api = ProfileFunc()
            api = ref.child('profile').child('profile-'+session['id']).child(session['id']).child('API').get()

            return jsonify({'Name': name,'School': school,'Branch': branch,'Program': program,'RegNo': regno,'AppNo': appno,'Email': email,'ProctorEmail': proctoremail,'ProctorName': proctorname,'APItoken': api})

        else:
            return jsonify({'Error': 'Invalid API Token.'})

    else:
        username = request.args.get('username').upper()
        password = request.args.get('password')
        try:
            sess, valid = generate_session(username, password)
        finally:
            if( valid == False ):
                return jsonify({'Error': 'Invalid Password.'})
            else:
                try:
                    profile = {}
                    profile = get_student_profile(sess, username)
                    session['id'] = profile['appNo']
                    session['name'] = profile['name']
                    session['reg'] = profile['regNo']
                    session['loggedin'] = 1
                finally:
                    name, school, branch, program, regno, appno, email, proctoremail, proctorname, api = ProfileFunc()
                    # Timetable,Attendance,Acadhistory and Marks fetching in parallel
                    try:
                        runInParallel(parallel_timetable(sess, username, session['id']), parallel_attendance(sess, username, session['id']), parallel_acadhistory(sess, username, session['id']), parallel_marks(sess, username, session['id'])) 
                    finally:
                        return jsonify({'Name': name,'School': school,'Branch': branch,'Program': program,'RegNo': regno,'AppNo': appno,'Email': email,'ProctorEmail': proctoremail,'ProctorName': proctorname,'APItoken': api})
                                

                                

# Attendance API
@app.route('/classesapi')
def classesapi():
    ref = db.reference('vitask')
    user_token = request.args.get('token')

    if(user_token is not None):
        # Decoding API token
        temptoken = user_token.encode('ascii')
        try:
            appno = base64.b64decode(temptoken)
        except:
            return jsonify({'Error': 'Invalid API Token.'})
        key = appno.decode('ascii')

        temp = ref.child('attendance').child('attendance-'+key).child(key).get()

        #Checking if data is already there or not in firebase(if there then no need to acces Vtop again)
        if(temp is not None):
            attend = ref.child("attendance").child('attendance-'+key).child(key).child('Attendance').get()
            q = ref.child("attendance").child('attendance-'+key).child(key).child('Track').get()

            values = []
            for i in attend.values():
                values.append(i)

            slots = []

            for i in attend.keys():
                slots.append(i)

            return jsonify({'Attended': values,'Slots': slots, 'Track' : q})

        else:
            return jsonify({'Error': 'Invalid API Token.'})

    else:
        return jsonify({'Error': 'Please Authenticate first and enter an API Token in the request.'})
    

# Timetable API
@app.route('/timetableapi')
def timetableapi():
    ref = db.reference('vitask')
    user_token = request.args.get('token')

    if(user_token is not None):
        # Decoding API token
        temptoken = user_token.encode('ascii')
        try:
            appno = base64.b64decode(temptoken)
        except:
            return jsonify({'Error': 'Invalid API Token.'})
        key = appno.decode('ascii')

        temp = ref.child("timetable").child('timetable-'+key).child(key).child("Timetable").get()

        if(temp is not None):
            session['id'] = key
            days = temp

            return jsonify({'Timetable': days})

        else:
            return jsonify({'Error': 'Invalid API Token.'})
    else:
        return jsonify({'Error': 'Please Authenticate first and enter an API Token in the request.'})

# Academic History API
@app.route('/acadhistoryapi')
def acadhistoryapi():
    ref = db.reference('vitask')
    user_token = request.args.get('token')
    if(user_token is not None):
        # Decoding API token
        temptoken = user_token.encode('ascii')
        try:
            appno = base64.b64decode(temptoken)
        except:
            return jsonify({'Error': 'Invalid API Token.'})
        key = appno.decode('ascii')
    
        temp = ref.child("acadhistory").child('acadhistory-'+key).child(key).child("AcadHistory").get()
        
        if(temp is not None):
            session['id'] = key
            acadHistory = temp
            curriculumDetails = ref.child("acadhistory").child('acadhistory-'+session['id']).child(key).child("CurriculumDetails").get()

            return jsonify({'AcadHistory': acadHistory,'CurriculumDetails': curriculumDetails})
        
        else:
            return jsonify({'Error': 'Invalid API Token.'})
    else:
        return jsonify({'Error': 'Please Authenticate first and enter an API Token in the request.'})

# Marks API
@app.route('/marksapi')
def marksapi():
    ref = db.reference('vitask')
    user_token = request.args.get('token')
    
    if(user_token is not None):
        # Decoding API token
        temptoken = user_token.encode('ascii')
        try:
            appno = base64.b64decode(temptoken)
        except:
            return jsonify({'Error': 'Invalid API Token.'})
        key = appno.decode('ascii')
    
        temp = ref.child("marks").child('marks-'+key).child(key).child("Marks").get()
        
        if(temp is not None):
            session['id'] = key
            marksDict = temp

            return jsonify({'Marks': marksDict})
        
        else:
            return jsonify({'Error': 'Invalid API Token.'})
    else:
        return jsonify({'Error': 'Please Authenticate first and enter an API Token in the request.'})
        
# Moodle API
@app.route('/moodleapi')
def moodleapi():
    ref = db.reference('vitask')
    user_token = request.args.get('token')
    if(user_token is not None):
        # Decoding API token
        temptoken = user_token.encode('ascii')
        try:
            appno = base64.b64decode(temptoken)
        except:
            return jsonify({'Error': 'Invalid API Token.'})
        key = appno.decode('ascii')

        temp = ref.child("moodle").child('moodle-'+key).child(key).child('Username').get()
        
        
        if(temp is not None):
            session['id'] = key
            assignment = ref.child("moodle").child('moodle-'+session['id']).child(key).child('Assignments').get()

            return jsonify({'Assignments': assignment})
        
        else:
            return jsonify({'Error': 'Invalid API Token.'})
    else:
        try:
            session['id'] = request.args.get('appno')
        except:
            return jsonify({'Error': 'Please authenticate first.'})
        moodle_username =  request.args.get('username')
        moodle_password = request.args.get('password')
        sess, sess_key = get_moodle_session(moodle_username.lower(),moodle_password)
        due_items = get_dashboard_json(sess, sess_key)
        
        ref = db.reference('vitask')

        all_assignments = []

        for item in due_items:
            temp={}
            temp["course"] = item["course"]["fullname"]
            temp_time = time.strftime("%d-%m-%Y %H:%M", time.localtime(int(item["timesort"])))
            temp["time"] = temp_time
            all_assignments.append(temp)
            
        assignment = ref.child("moodle").child("moodle-"+session['id']).child(session['id']).child('Assignments').get()
        
        yes_assignments = []
        
        if(assignment is not None):
            for i in all_assignments:
                for j in assignment:
                    if(i["course"]==j["course"] and i["time"]==j["time"] and j["status"]=="yes"):
                        i["status"]="yes"
                        yes_assignments.append(i)
                    elif(i["course"]==j["course"] and i["time"]==j["time"] and j["status"]=="no"):
                        i["status"]="no"
                        yes_assignments.append(i)
                        
        elif(assignment is None):
            for item in due_items:
                temp={}
                temp["course"] = item["course"]["fullname"]
                temp_time = time.strftime("%d-%m-%Y %H:%M", time.localtime(int(item["timesort"])))
                temp["time"] = temp_time
                
                # Assignment Status to check whether it's actual or not,yes for actual and no for not.
                temp["status"] = "yes"
                yes_assignments.append(temp)
            

        # Processing password before storing
        api_gen = moodle_password
        api_token = api_gen.encode('ascii')
        temptoken = base64.b64encode(api_token)
        token = temptoken.decode('ascii')

        tut_ref = ref.child("moodle")
        new_ref = tut_ref.child("moodle-"+session['id'])
        new_ref.set({
            session['id']: {
                'Username': moodle_username,
                'Password': token,
                'Assignments': yes_assignments   
            }
        })
        assignment = ref.child("moodle").child("moodle-"+session['id']).child(session['id']).child('Assignments').get()
        return jsonify({'Assignments': assignment})
    

# Update Moodle API assignment status.The course and time parameters should be joined via delimiter ~ while sending the request
@app.route('/updatemoodleapi')
def updatemoodleapi():
    ref = db.reference('vitask')
    user_token = request.args.get('token')
    course_ini = request.args.get('course')
    time_ini = request.args.get('time')
    status = request.args.get('status')
    
    course = " ".join(course_ini.split("~"))
    time = " ".join(time_ini.split("~")) 
    
    
    if(user_token is not None and course_ini is not None and time_ini is not None and status is not None):
        # Decoding API token
        temptoken = user_token.encode('ascii')
        try:
            appno = base64.b64decode(temptoken)
        except:
            return jsonify({'Error': 'Invalid API Token.'})
        key = appno.decode('ascii')

        temp = ref.child("moodle").child('moodle-'+key).child(key).child('Username').get()
        
        
        if(temp is not None):
            session['id'] = key
            assignment = ref.child("moodle").child('moodle-'+session['id']).child(key).child('Assignments').get()
            moodle_username = ref.child("moodle").child('moodle-'+session['id']).child(session['id']).child('Username').get()
            pass_token = ref.child("moodle").child('moodle-'+session['id']).child(session['id']).child('Password').get()
            
            if(status!="yes" and status!="no"):
                status = "yes"

            for i in assignment:
                if(i["course"] == course and i["time"] == time):
                    i["status"] = status

            tut_ref = ref.child("moodle")
            new_ref = tut_ref.child("moodle-"+session['id'])
            new_ref.set({
                session['id']: {
                    'Username': moodle_username,
                    'Password': pass_token,
                    'Assignments': assignment  
                }
            })

            return jsonify({'Assignments': assignment})
        
        else:
            return jsonify({'Error': 'Invalid API Token.'})
    else:
        return jsonify({'Error': 'Please Enter all the parameters.'})
        
"""---------------------------------------------------------------
                    VITask API code ends here
------------------------------------------------------------------"""


"""---------------------------------------------------------------
            VITask Web Application code begins from here

      “Make it work, make it right, make it fast.” – Kent Beck
------------------------------------------------------------------"""

# Homepage for VITask
@app.route('/', methods=['GET'])
def home():
    return render_template('home.html')

# Team Page
@app.route('/ourteam' , methods=['GET'])
def ourteam():
    return render_template('team.html')

# Team Page
@app.route('/downloads' , methods=['GET'])
def downloads():
    return render_template('downloads.html')

# Sitemap
@app.route('/sitemap.xml' , methods=['GET'])
def sitemap():
    return render_template('sitemap.xml')

# Login path for VITask Web app
@app.route('/login', methods=['GET', 'POST'])
def index():
    try:
        if(session['loggedin']==1):
            return redirect(url_for('profile'))
        else:
            return render_template('login.html',correct=True)
    except:
        session['loggedin'] = 0
        return render_template('login.html',correct=True)

# Web login route(internal don't use for anything on user side)
@app.route('/signin', methods=['GET', 'POST'])
def login():
    if request.method == 'POST' and 'username' in request.form and 'password' in request.form:
        session['timetable'] = 0
        session['classes'] = 0
        session['moodle'] = 0
        session['acadhistory'] = 0
        session['loggedin'] = 0

        username = request.form['username'].upper()
        password = request.form['password']
        try:
            sess, valid = generate_session(username, password)
        finally:
            if( valid == False ):
                return render_template('login.html',correct=False)

            else:
                try:
                    profile = {}
                    profile = get_student_profile(sess, username)
                    session['id'] = profile['appNo']
                    session['name'] = profile['name']
                    session['reg'] = profile['regNo']
                    session['loggedin'] = 1
                finally:
                    # Timetable,Attendance,Acadhistory and Marks fetching in parallel
                    try:
                        runInParallel(parallel_timetable(sess, username, session['id']), parallel_attendance(sess, username, session['id']), parallel_acadhistory(sess, username, session['id']), parallel_marks(sess, username, session['id'])) 
                    finally:
                        return redirect(url_for('profile'))
                       
    else:
        return redirect(url_for('index'))
            
                                    
                                
                                
                            
# Profile route
@app.route('/profile')
def profile():
    if(session['loggedin']==0):
        return redirect(url_for('index'))
    else:
        name, school, branch, program, regno, appno, email, proctoremail, proctorname, api = ProfileFunc()
        return render_template('profile.html',name=name,school=school,branch=branch,program=program,regno=regno,email=email,proctoremail=proctoremail,proctorname=proctorname,appno=appno)

# Timetable route
@app.route('/timetable')
def timetable():
    if(session['loggedin']==0):
        return redirect(url_for('index'))
    else:
        ref = db.reference('vitask')
        days = ref.child("timetable").child('timetable-'+session['id']).child(session['id']).child('Timetable').get()
        return render_template('timetable.html',name=session['name'],id=session['id'],tt=days)


# Attendance route
@app.route('/classes')
def classes():
    if(session['loggedin']==0):
        return redirect(url_for('index'))
    else:
        ref = db.reference('vitask')
        attend = ref.child("attendance").child('attendance-'+session['id']).child(session['id']).child('Attendance').get()
        q = ref.child("attendance").child('attendance-'+session['id']).child(session['id']).child('Track').get()
        return render_template('attendance.html',name = session['name'],id = session['id'],dicti = attend,q = q)

# Academic History route
@app.route('/acadhistory')
def acadhistory():
    if(session['loggedin']==0):
        return redirect(url_for('index'))
    else:
        ref = db.reference('vitask')
        acadHistory = ref.child("acadhistory").child('acadhistory-'+session['id']).child(session['id']).child('AcadHistory').get()
        curriculumDetails = ref.child("acadhistory").child('acadhistory-'+session['id']).child(session['id']).child('CurriculumDetails').get()
        return render_template('acadhistory.html',name = session['name'],acadHistory = acadHistory,curriculumDetails = curriculumDetails)    

# Marks route
@app.route('/marks')
def marks():
    if(session['loggedin']==0):
        return redirect(url_for('index'))
    else:
        ref = db.reference('vitask')
        marks = ref.child("marks").child('marks-'+session['id']).child(session['id']).child('Marks').get()
        return render_template('marks.html',name = session['name'], marks = marks)

        
"""---------------------------------------------------------------

        Code for VITask API Dashboard and Console begins here

 “The mind is furnished with ideas by experience alone”― John Locke

------------------------------------------------------------------"""

        
# API Dashboard (by Harsh)
@app.route('/apidashboard')
def apidashboard():
    if(session['loggedin']==0):
        return redirect(url_for('index'))
    else:
        ref = db.reference('vitask')
        api = ref.child('profile').child('profile-'+session['id']).child(session['id']).child('API').get()
        name = session['name']
        return render_template('api.html',name=name,api=api)

# API Console(Not ready yet)
@app.route('/apiconsole', methods=['GET', 'POST'])
def apiconsole():
    if(session['loggedin']==0):
        return redirect(url_for('index'))
    else:
        return redirect(url_for('profile'))

"""---------------------------------------------------------------

        Code for VITask API Dashboard and Console ends here

------------------------------------------------------------------"""


"""---------------------------------------------------------------

            Code for Moodle Integration begins from here

    “The only true wisdom is in knowing you know nothing.”― Socrates

------------------------------------------------------------------"""


# Moodle Login path for VITask Web app
@app.route('/moodle', methods=['GET', 'POST'])
def moodle():
    if(session['loggedin']==0):
        return redirect(url_for('index'))
    else:
        ref = db.reference('vitask')
        temp = ref.child("moodle").child('moodle-'+session['id']).child(session['id']).get()
        if(session['moodle']==1 or temp is not None):
            return redirect(url_for('assignments'))
        else:
            return render_template('moodle.html',name=session['name'])

# Path for processing of details from /moodle
@app.route('/moodlelogin', methods=['GET', 'POST'])
def moodlelogin():
    if(session['loggedin']==0):
        return redirect(url_for('index'))
    else:
        ref = db.reference('vitask')
        temp = ref.child("moodle").child('moodle-'+session['id']).child(session['id']).get()
        if(session['moodle']==1 or temp is not None):
            return redirect(url_for('assignments'))
        else:
            moodle_username =  request.form['username']
            moodle_password = request.form['password']
            sess, sess_key = get_moodle_session(moodle_username.lower(),moodle_password)
            due_items = get_dashboard_json(sess, sess_key)

            all_assignments = []

            for item in due_items:
                temp={}
                temp["course"] = item["course"]["fullname"]
                temp_time = time.strftime("%d-%m-%Y %H:%M", time.localtime(int(item["timesort"])))
                temp["time"] = temp_time
                
                # Assignment Status to check whether it's actual or not,yes for actual and no for not.
                temp["status"] = "yes"
                all_assignments.append(temp)
                
            # Processing password before storing
            api_gen = moodle_password
            api_token = api_gen.encode('ascii')
            temptoken = base64.b64encode(api_token)
            token = temptoken.decode('ascii')

            session['moodle'] = 1

            ref = db.reference('vitask')
            tut_ref = ref.child("moodle")
            new_ref = tut_ref.child("moodle-"+session['id'])
            new_ref.set({
                session['id']: {
                    'Username': moodle_username,
                    'Password': token,
                    'Assignments': all_assignments
                }
            })
            assignment = ref.child("moodle").child('moodle-'+session['id']).child(session['id']).child('Assignments').get()

            return render_template('assignments.html',name=session['name'],assignment=assignment)
        
# Remove assignments from Moodle
@app.route('/removeassignment', methods=['GET', 'POST'])
def removeassignment():
    if(session['loggedin']==0):
        return redirect(url_for('index'))
    else:
        if request.method == 'POST' and 'course' in request.form and 'time' in request.form:
            ref = db.reference('vitask')
            temp = ref.child("moodle").child('moodle-'+session['id']).child(session['id']).get()
            
            course = request.form['course']
            time = request.form['time']

            if(session['moodle']==1 or temp is not None):
                assignment = ref.child("moodle").child('moodle-'+session['id']).child(session['id']).child('Assignments').get()
                moodle_username = ref.child("moodle").child('moodle-'+session['id']).child(session['id']).child('Username').get()
                pass_token = ref.child("moodle").child('moodle-'+session['id']).child(session['id']).child('Password').get()
                
                for i in assignment:
                    if(i["course"] == course and i["time"] == time):
                        i["status"] = "no"
                        
                tut_ref = ref.child("moodle")
                new_ref = tut_ref.child("moodle-"+session['id'])
                new_ref.set({
                    session['id']: {
                        'Username': moodle_username,
                        'Password': pass_token,
                        'Assignments': assignment  
                    }
                })
                        
                return redirect(url_for('assignments'))
            else:
                return redirect(url_for('moodle'))
        else:
            return redirect(url_for('moodle'))
        
# Restore assignments from Moodle
@app.route('/restoreassignment', methods=['GET', 'POST'])
def restoreassignment():
    if(session['loggedin']==0):
        return redirect(url_for('index'))
    else:
        if request.method == 'POST' and 'course' in request.form and 'time' in request.form:
            ref = db.reference('vitask')
            temp = ref.child("moodle").child('moodle-'+session['id']).child(session['id']).get()
            
            course = request.form['course']
            time = request.form['time']

            if(session['moodle']==1 or temp is not None):
                assignment = ref.child("moodle").child('moodle-'+session['id']).child(session['id']).child('Assignments').get()
                moodle_username = ref.child("moodle").child('moodle-'+session['id']).child(session['id']).child('Username').get()
                pass_token = ref.child("moodle").child('moodle-'+session['id']).child(session['id']).child('Password').get()
                
                for i in assignment:
                    if(i["course"] == course and i["time"] == time):
                        i["status"] = "yes"
                        
                tut_ref = ref.child("moodle")
                new_ref = tut_ref.child("moodle-"+session['id'])
                new_ref.set({
                    session['id']: {
                        'Username': moodle_username,
                        'Password': pass_token,
                        'Assignments': assignment  
                    }
                })
                        
                return redirect(url_for('assignments'))
            else:
                return redirect(url_for('moodle'))
        else:
            return redirect(url_for('moodle'))
        
# Removed Assignments page for Moodle
@app.route('/noassignments', methods=['GET', 'POST'])
def noassignments():
    if(session['loggedin']==0):
        return redirect(url_for('index'))
    else:
        ref = db.reference('vitask')
        temp = ref.child("moodle").child('moodle-'+session['id']).child(session['id']).get()
        if(session['moodle']==1 or temp is not None):
            assignment = ref.child("moodle").child('moodle-'+session['id']).child(session['id']).child('Assignments').get()
            
            no_assignment = []
            # Returning only the assignments which have status no
            for i in assignment:
                if(i["status"]=="no"):
                    no_assignment.append(i)
                    
            return render_template('noassignments.html',name=session['name'],assignment=no_assignment)
        else:
            return redirect(url_for('moodle'))
            
# Assignments page for Moodle
@app.route('/assignments', methods=['GET', 'POST'])
def assignments():
    if(session['loggedin']==0):
        return redirect(url_for('index'))
    else:
        ref = db.reference('vitask')
        temp = ref.child("moodle").child('moodle-'+session['id']).child(session['id']).get()
        if(session['moodle']==1 or temp is not None):
            assignment = ref.child("moodle").child('moodle-'+session['id']).child(session['id']).child('Assignments').get()
            
            yes_assignment = []
            # Returning only the assignments which have status yes
            for i in assignment:
                if(i["status"]=="yes"):
                    yes_assignment.append(i)
                    
            return render_template('assignments.html',name=session['name'],assignment=yes_assignment)
        else:
            return redirect(url_for('moodle'))
    
# Resync Assignments page for Moodle
@app.route('/moodleresync', methods=['GET', 'POST'])
def moodleresync():
    if(session['loggedin']==0):
        return redirect(url_for('index'))
    else:
        ref = db.reference('vitask')
        moodle_username = ref.child("moodle").child('moodle-'+session['id']).child(session['id']).child('Username').get()
        pass_token = ref.child("moodle").child('moodle-'+session['id']).child(session['id']).child('Password').get()
        
        # Decoding Password
        temptoken = pass_token.encode('ascii')
        temp_pass = base64.b64decode(temptoken)
        key = temp_pass.decode('ascii')
        

        moodle_password = key
        sess, sess_key = get_moodle_session(moodle_username.lower(),moodle_password)
        due_items = get_dashboard_json(sess, sess_key)
        
        assignment = ref.child("moodle").child("moodle-"+session['id']).child(session['id']).child('Assignments').get()

        all_assignments = []

        for item in due_items:
            temp={}
            temp["course"] = item["course"]["fullname"]
            temp_time = time.strftime("%d-%m-%Y %H:%M", time.localtime(int(item["timesort"])))
            temp["time"] = temp_time
            all_assignments.append(temp)
            
        yes_assignments = []
            
        for i in all_assignments:
            for j in assignment:
                if(i["course"]==j["course"] and i["time"]==j["time"] and j["status"]=="yes"):
                    i["status"]="yes"
                    yes_assignments.append(i)
                elif(i["course"]==j["course"] and i["time"]==j["time"] and j["status"]=="no"):
                    i["status"]="no"
                    yes_assignments.append(i)
        
        # Processing password before storing
        api_gen = moodle_password
        api_token = api_gen.encode('ascii')
        temptoken = base64.b64encode(api_token)
        token = temptoken.decode('ascii')

        session['moodle'] = 1

        ref = db.reference('vitask')
        tut_ref = ref.child("moodle")
        new_ref = tut_ref.child("moodle-"+session['id'])
        new_ref.set({
            session['id']: {
                'Username': moodle_username,
                'Password': token,
                'Assignments': yes_assignments   
            }
        })
        assignment = ref.child("moodle").child("moodle-"+session['id']).child(session['id']).child('Assignments').get()

        return redirect(url_for('assignments'))
            
"""---------------------------------------------------------------

            Code for Moodle Integration ends here

------------------------------------------------------------------"""

# Web Logout
@app.route('/logout')
def logout():
    session.pop('id', None)
    session.pop('timetable', 0)
    session.pop('classes', 0)
    session.pop('name', None)
    session.pop('reg', None)
    session.pop('moodle', 0)
    session.pop('acadhistory', 0)
    # session.pop('marks', 0)
    session.pop('loggedin',0)
    return redirect(url_for('home'))



# Run Flask app
if __name__ == '__main__':
	app.run(host='0.0.0.0', port=port, debug=True)