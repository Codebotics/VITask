import hashlib 
import firebase_admin
from firebase_admin import db

def magichash(appno):
    base = "vitask" + str(appno) + "@~@"
    result = hashlib.sha512(base.encode()) 
    final = result.hexdigest()
    return final

def magiccheck(header):
    ref = db.reference('vitask')
    temp = ref.child("account").get()
    ctr = 0
    for i in temp:
        hold = temp[i]
        for j in hold:
            if(hold[j]['X-VITASK-API']==header):
                return True
                ctr = 1
                break
        if(ctr==1):
            break
    return False