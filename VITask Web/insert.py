import firebase_admin
from firebase_admin import db
import base64, datetime
from crypto import magichash

ref = db.reference('vitask')

def insert_attendance(id, attend, q, sub_entry="attendance"):
    status = True
    try:
        tut_ref = ref.child(sub_entry)
        new_ref = tut_ref.child(sub_entry+"-"+id)
        new_ref.set({
            id: {
                'Attendance': attend,
                'Track': q
            }
        })
    except:
        status = False
    finally:
        return status
    
def insert_timetable(id, days, final_dict, sub_entry="timetable"):
    status = True
    try: 
        tut_ref = ref.child(sub_entry)
        new_ref = tut_ref.child(sub_entry+"-"+id)
        new_ref.set({
            id: {
                'Timetable': days,
                'Credits': final_dict
            }
        })
    except:
        status = False
    finally:
        return status
        
def insert_acadhistory(id, acadHistory, curriculumDetails, sub_entry="timetable"):
    status = True
    try: 
        tut_ref = ref.child(sub_entry)
        new_ref = tut_ref.child(sub_entry+id)
        new_ref.set({
            id: {
                'AcadHistory': acadHistory,
                'CurriculumDetails': curriculumDetails
            }
        })
    except:
        status = False
    finally:
        return status
    
def insert_profile(id, profile, sub_entry="profile"):
    status = True
    try:
        tut_ref = ref.child(sub_entry)
        new_ref = tut_ref.child(sub_entry+"-"+id)
        new_ref.set({
            id: {
                'Name': profile['name'],
                'Branch': profile['branch'],
                'Program': profile['program'],
                'RegNo': profile['regNo'],
                'AppNo': profile['appNo'],
                'School': profile['school'],
                'Email': profile['email'],
                'ProctorName': profile['proctorName'],
                'ProctorEmail': profile['proctorEmail'],
                'API': profile['token']
            }
        })
    except:
        status = False
    finally:
        return status
    
def insert_account(id, profile, header_value, sub_entry="account"):
    status = True
    try:
        date = datetime.datetime.now()
        current_date = date.strftime("%d/%m/%Y, %H:%M:%S")
        tut_ref = ref.child(sub_entry)
        new_ref = tut_ref.child(sub_entry+"-"+id)
        new_ref.set({
            id: {
                'X-VITASK-API': header_value,
                'Name': profile['name'],
                'RegNo': profile['regNo'],
                'Account-Type': 'Free',
                'API-Calls': 0,
                'Start-Date': current_date,
                'End-Date': 'N/A'
            }
        })
    except:
        status = False
    finally:
        return status
    
def insert_marks(id, marksDict, sub_entry="marks"):
    status = True
    try:
        tut_ref = ref.child(sub_entry)
        new_ref = tut_ref.child(sub_entry+"-"+id)
        new_ref.set({
            id: {
                'Marks': marksDict
            }
        })
    except:
        status = False
    finally:
        return status