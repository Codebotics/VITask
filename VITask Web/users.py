import firebase_admin
from firebase_admin import db

firebase_admin.initialize_app(options={'databaseURL': 'https://vitask.firebaseio.com/'})

ref = db.reference('vitask')
user_list = ref.child("profile").get()
tempdict = {}
user_info = {}
for i in user_list:
    tempdict = user_list[i]
    for j in tempdict:
        user_info = tempdict[j]
        print(user_info["Name"])

print(len(user_list))