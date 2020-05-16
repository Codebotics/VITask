"""---------------------------------------------------------------
                  New VITask APIs begin here.
---------------------------------------------------------------"""

#/api/gettoken 
@app.route('/api/gettoken', methods=['GET','POST'])
def temp_getToken():
    """
    API has been changed to accept only POST requests. Path of API has been changed.
    Headers must contain a value
    {
        "X-VITASK-API": "2020_Mar_25"   (First commit date of VITask)
    }
    Now the body of POST must be 
    {
        "username" : 17BECXXXX,
        "password" : password,
    }
    """
    # First check if query is okay or not
    data = json.loads(request.data)
    username = data.get("username",None)
    password = data.get("password",None)
    
    if request.headers.get('X-VITASK-API') != "2020_Mar_25" or username is None or password is None:
        return jsonify({
            "error" : "Incorrect API Request",
            "code"  : "400" # Bad request
        })
    
    # Now began actual work
    username = username.upper()
    
    # This API is only to get user token and get personal details. For syncing details, there will be a seperate API
    # This assumes that token is None just like previous authenticate
    valid = True
    try:
        sess, valid = generate_session(username, password)
    except Exception as e:
        return jsonify({
            "error" : "Something broke",
            "code"  : "500"
        })
    if not valid:
        # Password incorrect
        return jsonify({
            "error" : "Incorrect Password"
        })
    ref = db.reference('vitask')
    try:
        profile = {}
        profile, check_profile = get_student_profile(sess, username)
        session['id'] = profile['appNo']
        session['name'] = profile['name']
        session['reg'] = profile['regNo']
        session['loggedin'] = 1
        if(check_profile == False):
            return jsonify({"Error": "Internal Error in fetching profile.Please try again."})
    finally:
        name, school, branch, program, regno, appno, email, proctoremail, proctorname, api = ProfileFunc()
        # Timetable,Attendance,Acadhistory and Marks fetching in parallel
        try:
            runInParallel(parallel_timetable(sess, username, session['id']), parallel_attendance(sess, username, session['id']), parallel_acadhistory(sess, username, session['id']), parallel_marks(sess, username, session['id'])) 
        finally:
            return jsonify({'Name': name,'School': school,'Branch': branch,'Program': program,'RegNo': regno,'AppNo': appno,'Email': email,'ProctorEmail': proctoremail,'ProctorName': proctorname,'APItoken': api})

# /api/vtop/sync
@app.route('/api/vtop/sync', methods=['POST'])
def temp_sync():
    """
    POST Route
    This route will be used to sync all the details, like attendance and marks. Timetable is not required to updated.
    For creating a hard refresh (update the timetable, acad history) pass a parameter as compleeteRefresh true
    Headers must contain a value
    {
        "X-VITASK-API": "2020_Mar_25"   (First commit date of VITask)
    }
    Now the body of POST must be 
    {
        "token" : "Your_API_Token"  # Required
        "username" : "Registration Number" # Required
        "password" : "Password"  #Required
        "hardRefresh" : "true"      # Not Complusory
    }
    """
    data = json.loads(request.data)
    username = data.get("username",None)
    password = data.get("password",None)
    refresh = data.get("hardRefresh",None)
    user_token = data.get("token",None)
    # First check the headers
    if request.headers.get('X-VITASK-API') != "2020_Mar_25" or username is None or password is None:
        return jsonify({
            "error" : "Incorrect API Request",
            "code"  : "400" # Bad request
        })
    if user_token is None:
        return jsonify({
            "error" : "Unauthorised. Get token from /api/getoken",
            "error" : "403" #Unauthorised
        })
    
    username = username.upper()
    if refresh is None or not refresh:
        # Only update Attendance and Marks
        # Frist Decode the token
        temptoken = user_token.encode('ascii')
        try:
            appno = base64.b64decode(temptoken)
        except:
            return jsonify({
                'error': 'Invalid API Token. Get Token from /api/getoken',
                'code' : "400" # bad request
            })
        key = appno.decode('ascii')
        valid = True
        sess = None
        try:
            sess, valid = generate_session(username, password)
        except Exception as e:
            return jsonify({
                "error" : "Something broke",
                "code"  : "500"
            })
        if not valid:
            # Password incorrect
            return jsonify({
                "error" : "Incorrect Password"
            })
        attendance, q, check_attendance = get_attandance(sess, username, key)
        marks, check_marks = get_marks(sess, username, key)
        if(check_attendance == False):
            return jsonify({"Error": "Internal Error in fetching Attendance.Please try again."})
        if(check_marks == False):
            return jsonify({"Error": "Internal Error in fetching Marks.Please try again."})
        return jsonify({
            "attendance": attendance,
            "marks" : marks
        })
    else:
        # It is a hard refresh. Get Timetable and Acad History also
        # Frist Decode the token
        temptoken = user_token.encode('ascii')
        try:
            appno = base64.b64decode(temptoken)
        except:
            return jsonify({
                'error': 'Invalid API Token. Get Token from /api/getoken',
                'code' : "400" # bad request
            })
        key = appno.decode('ascii')
        valid = True
        sess = None
        try:
            sess, valid = generate_session(username, password)
        except Exception as e:
            return jsonify({
                "error" : "Something broke",
                "code"  : "500"
            })
        if not valid:
            # Password incorrect
            return jsonify({
                "error" : "Incorrect Password"
            })
        attendance, q, check_attendance = get_attandance(sess, username, key)
        marks, check_marks = get_marks(sess, username, key)
        acadHistory, check_grades = get_acadhistory(sess,username,key)
        days, check_timetable = get_timetable(sess, username, key)
        if(check_attendance == False):
            return jsonify({"Error": "Internal Error in fetching Attendance.Please try again."})
        if(check_marks == False):
            return jsonify({"Error": "Internal Error in fetching Marks.Please try again."})
        if(check_grades == False):
            return jsonify({"Error": "Internal Error in fetching Grades.Please try again."})
        if(check_timetable == False):
            return jsonify({"Error": "Internal Error in fetching Timetable.Please try again."})
        return jsonify({
            "attendance": attendance,
            "marks" : marks,
            "acadHistory" : acadHistory,
            "timetable" : days
        })


# /api/vtop/timetable
@app.route('/api/vtop/timetable', methods=['POST'])
def temp_timetable():
    """
    POST Route
    This route is only helpful in Android App or Desktop App for getting TimeTable one time.
    This route should NOT be used more than one time. 
    Returns the timetable of the user according to token
    Headers must contain a value
    {
        "X-VITASK-API": "2020_Mar_25"   (First commit date of VITask)
    }
    Now the body of POST must be 
    {
        "token" : "Your_API_Token"  # Required
    }
    """
    data = json.loads(request.data)
    user_token = data.get("token",None)
    
    if request.headers.get('X-VITASK-API') != "2020_Mar_25":
        return jsonify({
            "error" : "Incorrect API Request",
            "code"  : "400" # Bad request
        })
    if user_token is None:
        return jsonify({
            "error" : "Unauthorised. Get token from /api/getoken",
            "error" : "403" #Unauthorised
        })
    
    # Now begin actual work. It just gets the value from firebase and use it.
    ref = db.reference('vitask')

    temptoken = user_token.encode('ascii')
    try:
        appno = base64.b64decode(temptoken)
    except:
        return jsonify({
            'error': 'Invalid API Token. Get Token from /api/getoken',
            'code' : "400" # bad request
        })
    key = appno.decode('ascii')

    temp = ref.child("timetable").child('timetable-'+key).child(key).child("Timetable").get()

    if(temp is not None):
        session['id'] = key
        days = temp

        return jsonify({'Timetable': days})

    else:
        return jsonify({
            'error': 'Invalid API Token. Get Token from /api/getoken',
            'code' : "400" # bad request
        })

# /api/vtop/attendance
@app.route('/api/vtop/attendance', methods=['POST'])
def temp_attendance():
    """
    POST Route
    This is not meant to use again and again like Timetable API, use /api/aysnc to get data at one place.
    This API is designed only for showing nice messages at the start of app
    Returns the timetable of the user according to token
    Headers must contain a value
    {
        "X-VITASK-API": "2020_Mar_25"   (First commit date of VITask)
    }
    Now the body of POST must be 
    {
        "token" : "Your_API_Token"  # Required
    }
    """
    data = json.loads(request.data)
    user_token = data.get("token",None)
    
    if request.headers.get('X-VITASK-API') != "2020_Mar_25":
        return jsonify({
            "error" : "Incorrect API Request",
            "code"  : "400" # Bad request
        })
    if user_token is None:
        return jsonify({
            "error" : "Unauthorised. Get token from /api/getoken",
            "error" : "403" #Unauthorised
        })
    
    # Now begin actual work. It just gets the value from firebase and use it
    ref = db.reference('vitask')

    temptoken = user_token.encode('ascii')
    try:
        appno = base64.b64decode(temptoken)
    except:
        return jsonify({
            'error': 'Invalid API Token. Get Token from /api/getoken',
            'code' : "400" # bad request
        })
    key = appno.decode('ascii')

    temp = ref.child('attendance').child('attendance-'+key).child(key).get()

    #Checking if data is already there or not in firebase(if there then no need to acces VTOP again)
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
        return jsonify({
            'error': 'Invalid API Token. Get Token from /api/getoken',
            'code' : "400" # bad request
        })

# /api/vtop/marks
@app.route('/api/vtop/marks', methods=['POST'])
def temp_marks():
    """
    Just like other APIs, it is not meant to be used again and again. 
    This is developed for showing nice messages on loading screen. Use /api/sync
    Headers must contain a value
    {
        "X-VITASK-API": "2020_Mar_25"   (First commit date of VITask)
    }
    Now the body of POST must be 
    {
        "token" : "Your_API_Token"  # Required
    }
    """
    data = json.loads(request.data)
    user_token = data.get("token",None)
    
    if request.headers.get('X-VITASK-API') != "2020_Mar_25":
        return jsonify({
            "error" : "Incorrect API Request",
            "code"  : "400" # Bad request
        })
    if user_token is None:
        return jsonify({
            "error" : "Unauthorised. Get token from /api/getoken",
            "error" : "403" #Unauthorised
        })
    ref = db.reference('vitask')
    
    # Decoding API token
    temptoken = user_token.encode('ascii')
    try:
        appno = base64.b64decode(temptoken)
    except:
        return jsonify({
            'error': 'Invalid API Token. Get Token from /api/getoken',
            'code' : "400" # bad request
        })
    key = appno.decode('ascii')

    temp = ref.child("marks").child('marks-'+key).child(key).child("Marks").get()
    
    if(temp is not None):
        session['id'] = key
        marksDict = temp

        return jsonify({'Marks': marksDict})
    
    else:
        return jsonify({
            'error': 'Invalid API Token. Get Token from /api/getoken',
            'code' : "400" # bad request
        })

# /api/vtop/history
@app.route('/api/vtop/history', methods=['POST'])
def temp_acadhistory():
    """
    This API is not meant to use again and is not updated. Use /api/vtop/sync with hardrefresh to get new data
    This is only made to show messages on Android App.
    Headers must contain a value
    {
        "X-VITASK-API": "2020_Mar_25"   (First commit date of VITask)
    }
    Now the body of POST must be 
    {
        "token" : "Your_API_Token"  # Required
    }
    """
    data = json.loads(request.data)
    user_token = data.get("token",None)
    
    if request.headers.get('X-VITASK-API') != "2020_Mar_25":
        return jsonify({
            "error" : "Incorrect API Request",
            "code"  : "400" # Bad request
        })
    if user_token is None:
        return jsonify({
            "error" : "Unauthorised. Get token from /api/getoken",
            "error" : "403" #Unauthorised
        })
    ref = db.reference('vitask')
    
    # Decoding API token
    temptoken = user_token.encode('ascii')
    try:
        appno = base64.b64decode(temptoken)
    except:
        return jsonify({
            'error': 'Invalid API Token. Get Token from /api/getoken',
            'code' : "400" # bad request
        })
    key = appno.decode('ascii')
    temp = ref.child("acadhistory").child('acadhistory-'+key).child(key).child("AcadHistory").get()
        
    if(temp is not None):
        session['id'] = key
        acadHistory = temp
        curriculumDetails = ref.child("acadhistory").child('acadhistory-'+session['id']).child(key).child("CurriculumDetails").get()

        return jsonify({'AcadHistory': acadHistory,'CurriculumDetails': curriculumDetails})
    
    else:
        return jsonify({
            'error': 'Invalid API Token. Get Token from /api/getoken',
            'code' : "400" # bad request
        })

# These are moodle APIs, note than for syncing Moodle and VTOP needs to be sync sepearately
# /api/moodle Routes
# API Token still refers to token from /api/getToken

# /api/moodle/login
@app.route('/api/moodle/login', methods=['POST'])
def temp_moodleLogin():
    """
    This is meant to be used when logging into moodle for first time. Do not use this to sync data.
    It just updates the data on Firebase and send you data. 
    Headers must contain a value
    {
        "X-VITASK-API": "2020_Mar_25"   (First commit date of VITask)
    }
    Now the body of POST must be 
    {
        "username" : 17BECXXXX  #Required
        "password" : password  #Required
        "token"    : token   #Required for setting values in Firebase
    }
    """
    data = json.loads(request.data)
    username = data.get("username",None)
    password = data.get("password",None)
    user_token = data.get("token",None)
    
    if request.headers.get('X-VITASK-API') != "2020_Mar_25" or username is None or password is None:
        return jsonify({
            "error" : "Incorrect API Request",
            "code"  : "400" # Bad request
        })
    if user_token is None:
        return jsonify({
            "error" : "Unauthorised. Get token from /api/getoken",
            "error" : "403" #Unauthorised
        })
    # This route will assume that you are loging first time and overwrite previous data
    
    # Decoding API token
    temptoken = user_token.encode('ascii')
    try:
        appno = base64.b64decode(temptoken)
    except:
        return jsonify({
            'error': 'Invalid API Token. Get Token from /api/getoken',
            'code' : "400" # bad request
        })
    key = appno.decode('ascii')
    session['id'] = key

    ref = db.reference('vitask')
    moodle_username =  username
    moodle_password = password
    sess, sess_key = get_moodle_session(moodle_username.lower(),moodle_password)
    due_items = get_dashboard_json(sess, sess_key)
    assignments = []
    if due_items is None:
        assignments.append({
            "course" : "No Assignments"
        })
    else:
        for item in due_items:
            assignment = {}
            assignment['id'] = item['id']
            assignment['name'] = item['name']
            assignment['description'] = item['description']
            assignment['time'] = item['timesort']   # Passing Seconds, parse data at client end
            assignment['url'] = item['url']
            assignment['course'] = item['course']['fullname']
            assignment['show'] = True                # 0 == False, 1 == True
            assignments.append(assignment)
    ref = db.reference('vitask')
    
    # For the last time BASE64 IS NOT ENCRYPTION (LMAO stares at NOT FFCS)
    api_gen = moodle_password
    api_token = api_gen.encode('ascii')
    temptoken = base64.b64encode(api_token)
    token = temptoken.decode('ascii')
    api_gen = moodle_password
    api_token = api_gen.encode('ascii')
    temptoken = base64.b64encode(api_token)
    token = temptoken.decode('ascii')

    
    tut_ref = ref.child("moodle")
    new_ref = tut_ref.child("moodle-"+key)
    new_ref.set({
        key: {
            'Username': moodle_username,
            'Password': token,
            'Assignments': assignments 
        }
    })
    return jsonify({'Assignments': assignments})


# /api/moodle/sync
@app.route('/api/moodle/sync', methods=['POST'])
def temp_moodleSync():
    """
    This function is used to sync data from moodle and then sends the live assignments info
    This route assumes that you have already sign in using /api/moodle/login
    Headers must contain a value
    {
        "X-VITASK-API": "2020_Mar_25"   (First commit date of VITask)
    }
    Now the body of POST must be 
    {
        "token"    : token   #Required for setting values in Firebase
    }
    """
    data = json.loads(request.data)
    user_token = data.get("token",None)

    # TODO: I'm against this, but since we only have users, cool 
    # Now we assume that you have already signed in moodle
    if request.headers.get('X-VITASK-API') != "2020_Mar_25":
        return jsonify({
            "error" : "Incorrect API Request",
            "code"  : "400" # Bad request
        })
    if user_token is None:
        return jsonify({
            "error" : "Unauthorised. Get token from /api/getoken",
            "error" : "403" #Unauthorised
        })
    # This route will assume that you are loging first time and overwrite previous data
    temptoken = user_token.encode('ascii')
    try:
        appno = base64.b64decode(temptoken)
    except:
        return jsonify({
            'error': 'Invalid API Token. Get Token from /api/getoken',
            'code' : "400" # bad request
        })
    key = appno.decode('ascii')

    ref = db.reference('vitask')
    temp = ref.child("moodle").child('moodle-'+key).child(key).child('Username').get()
    
    
    if(temp is None):
        return jsonify({
            "error" : "Unauthorized. You are not signed Moodle. First visit /api/moodle/login",
            "error" : "403" #Unauthorised
        })
    else:
        session['id'] = key
        username = ref.child("moodle").child('moodle-'+session['id']).child(key).child('Username').get()
        b64_password = ref.child("moodle").child('moodle-'+session['id']).child(key).child('Password').get()
        # Now first decode the password
        temp_password = b64_password.encode('ascii')

        password = base64.b64decode(temp_password).decode('ascii')

        # Now signin moodle and then get the latest assignments
        sess, sess_key = get_moodle_session(username.lower(),password)
        due_items = get_dashboard_json(sess, sess_key)
        assignments = []
        if due_items is None:
            assignments.append({
                "course" : "No Assignments"
            })
            tut_ref = ref.child("moodle")
            new_ref = tut_ref.child("moodle-"+session['id'])
            new_ref.set({
                session['id']: {
                    'Username': username,
                    'Password': b64_password,
                    'Assignments': assignments 
                }
            })
            return jsonify({'Assignments' : assignments})
        else:
            for item in due_items:
                assignment = {}
                assignment['id'] = item['id']
                assignment['name'] = item['name']
                assignment['description'] = item['description'] # This is Raw HTML, either parse at client end or display accordingly
                assignment['time'] = item['timesort']   # Passing Seconds, parse data at client end
                assignment['url'] = item['url']
                assignment['course'] = item['course']['fullname']
                assignment['show'] = True                # 0 == False, 1 == True
                assignments.append(assignment)
        
            # Now match the assignments with prev assignments
            # As the time of assignements may be changed, 
            # So, using previous assginments, just change the status of assignments
            # If due items is NOT None, then only use prev assignments else dont.
            prev_assignments = ref.child("moodle").child('moodle-'+session['id']).child(key).child('Assignments').get()
            for assignment in assignments:
                assigmentID = assignment['id']
                for prev in prev_assignments:
                    if prev['id'] == assigmentID:
                        assignment['show'] = prev['show']
                        break
            # Now set the new assignment as the data 
            tut_ref = ref.child("moodle")
            new_ref = tut_ref.child("moodle-"+session['id'])
            new_ref.set({
                session['id']: {
                    'Username': username,
                    'Password': b64_password,
                    'Assignments': assignments 
                }
            })
            return jsonify({'Assignments' : assignments})


# /api/moodle/toggleshow/
@app.route('/api/moodle/toggleshow', methods=['POST'])
def temp_assignmentToggleShow():
    """
    POST Request
    This API can be used in bulk and single manner. In bulk mode, pass multiple ids of assignements to be marked opposite
    This API reverse the show property of all the assignments whose Id will be provided.
    I'm relying on Moodle and hoping that IDs are unique
    Headers must contain a value
    {
        "X-VITASK-API": "2020_Mar_25"   (First commit date of VITask)
    }
    Now the body of POST must be 
    {
        "token"    : token   #Required for setting values in Firebase
        "ids"      : [ id1, id2, id3] # Required, List of Ids
    }
    """
    data = json.loads(request.data)
    user_token = data.get("token",None)
    ids = data.get("ids",None)
    
    # Even if only one ID is there, pass it in array
    if request.headers.get('X-VITASK-API') != "2020_Mar_25" or ids is None:
        return jsonify({
            "error" : "Incorrect API Request",
            "code"  : "400" # Bad request
        })
    if user_token is None:
        return jsonify({
            "error" : "Unauthorised. Get token from /api/getoken",
            "error" : "403" #Unauthorised
        })
    
    # Now first get all the asssignments
    temptoken = user_token.encode('ascii')
    try:
        appno = base64.b64decode(temptoken)
    except:
        return jsonify({
            'error': 'Invalid API Token. Get Token from /api/getoken',
            'code' : "400" # bad request
        })
    key = appno.decode('ascii')
    session['id'] = key
    ref = db.reference('vitask')
    
    # IDK if this is correct method by my intuition says it will save Firebase limits so:
    moodleData = ref.child("moodle").child('moodle-'+session['id']).child(key).get()
    username = moodleData['Username']
    password = moodleData['Password']
    assignments = moodleData['Assignments']
    for i in range(len(assignments)):
        if assignments[i]['id'] in ids:
            assignments[i]['show'] = not assignments[i]['show']
    # Now assign data and return the new data
    tut_ref = ref.child("moodle")
    new_ref = tut_ref.child("moodle-"+session['id'])
    new_ref.set({
        session['id']: {
            'Username': username,
            'Password': password,
            'Assignments': assignments 
        }
    })
    return jsonify({'Assignments' : assignments})

"""---------------------------------------------------------------
                  New VITask APIs end here.
---------------------------------------------------------------"""