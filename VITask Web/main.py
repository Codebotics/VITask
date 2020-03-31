"""---------------------------------------------------------------
                VITask | A Dynamic VTOP API server

        "Any fool can write code that a computer can understand.
        Good programmers write code that humans can understand."
------------------------------------------------------------------"""

from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import firebase_admin
from firebase_admin import db
from PIL import Image
from PIL import ImageFilter
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

# Selenium driver and Actions as global
driver = None
action = None

#Constants for Captcha Solver
CAPTCHA_DIM = (180, 45)
CHARACTER_DIM = (30, 32)
#Above values were checked from various captchas

# Initialize Flask app
app = Flask(__name__)

# Set the port for Flask app
port = int(os.environ.get('PORT', 5000))

# Change this to your secret key (can be anything, it's for extra protection)
app.secret_key = 'canada$God7972#'

# Initialize Firebase app
firebase_admin.initialize_app(options={'databaseURL': 'https://vitask.firebaseio.com/'})

# Returns the base64 encode of Captcha
def captchashow(driver):
    captchaimg = driver.find_elements_by_xpath("//*[@id='captchaRefresh']/div/img")[0]
    captchasrc =  captchaimg.get_attribute("src")
    return captchasrc

def usernamecall(driver):
    username = driver.find_elements_by_xpath("//*[@id='uname']")[0]
    return username

def passwordcall(driver):
    password = driver.find_elements_by_xpath("//*[@id='passwd']")[0]
    return password

def captchacall(driver):
    captcha = driver.find_elements_by_xpath("//*[@id='captchaCheck']")[0]
    return captcha

# Magical Captcha solver by Cherub begins from here ;)
def download_captcha(num,username,driver):
    """
    Downloads and save a random captcha from VTOP website in the path provided
    num = number of captcha to save
    """
    for _ in range(num):
        base64_image = captchashow(driver)[23:]
        image_name = "./captcha/"+username+"-captcha.png"
        with open(image_name, "wb") as fh:
            fh.write(base64.b64decode(base64_image))

def remove_pixel_noise(img):
    """
    this function removes the one pixel noise in the captcha
    """
    img_width = CAPTCHA_DIM[0]
    img_height = CAPTCHA_DIM[1]

    img_matrix = img.convert('L').load()
    # Remove noise and make image binary
    for y in range(1, img_height - 1):
        for x in range(1, img_width - 1):
            if img_matrix[x, y-1] == 255 and img_matrix[x, y] == 0 and img_matrix[x, y+1] == 255:
                img_matrix[x, y] = 255
            if img_matrix[x-1, y] == 255 and img_matrix[x, y] == 0 and img_matrix[x+1, y] == 255:
                img_matrix[x, y] = 255
            if img_matrix[x, y] != 255 and img_matrix[x, y] != 0:
                img_matrix[x, y] = 255

    return img_matrix

def identify_chars(img,img_matrix):
    """
    This function identifies and returns the captcha
    """
    img_width = CAPTCHA_DIM[0]
    img_height = CAPTCHA_DIM[1]

    char_width = CHARACTER_DIM[0]
    char_height = CHARACTER_DIM[1]

    char_crop_threshold = {'upper': 12, 'lower': 44}

    bitmaps = json.load(open("bitmaps.json"))
    captcha =""

    # loop through individual characters
    for i in range(char_width, img_width + 1, char_width):

        # crop with left, top, right, bottom coordinates
        img_char_matrix = img.crop(
            (i-char_width, char_crop_threshold['upper'], i, char_crop_threshold['lower'])).convert('L').load()

        matches = {}

        for character in bitmaps:
            match_count = 0
            black_count = 0

            lib_char_matrix = bitmaps[character]

            for y in range(0, char_height):
                for x in range(0, char_width):
                    if img_char_matrix[x, y] == lib_char_matrix[y][x] and lib_char_matrix[y][x] == 0:
                        match_count += 1
                    if lib_char_matrix[y][x] == 0:
                        black_count += 1

            perc = float(match_count)/float(black_count)
            matches.update({perc: character[0].upper()})

        try:
            captcha += matches[max(matches.keys())]
        except ValueError:
            captcha += "0"

    return captcha
# Captha solver ends here


# Following are utility functions designed to download stuff. 
# these functions are used to download chrome_driver.
def reporthook(blocknum, blocksize, totalsize):
    """
    function copied from https://stackoverflow.com/questions/13881092/download-progressbar-for-python-3
    """
    global start_time
    if blocknum==0:
        start_time = time.time()
        return
    if totalsize > 0:
        duration = time.time() - start_time
        readsofar = blocknum * blocksize
        if duration == 0:
            duration+=0.001
        speed = int(readsofar / (1024 * duration))
        percent = readsofar * 1e2 / totalsize
        s = '\rPercentage : %5.1f%% (%5.2f MB out of %5.2f MB, Download Speed %d KB/s, %d seconds passed )' % (
            percent, readsofar / 1048576, totalsize / 1048576, speed, duration)
        sys.stderr.write(s)
        if readsofar >= totalsize:  # near the end
            sys.stderr.write("\n")
    else:  # total size is unknown
        sys.stderr.write("read %d\n" % (readsofar,))


def download_file(url, filename, folder):
    """
    Downloads file in the specific position if given folder
    """
    print("Downloading file : ", filename)
    urlretrieve(url, os.path.join(folder, filename), reporthook)
    print("Download Complete")
    return True

def check_and_chromedriver(chrome_driver):
    """
    This function checks and download chromedriver in the /files directory
    """

    if not os.path.exists(chrome_driver):   # Checking and downloading chrome driver
        print("Chrome driver does not exist. Downloading it and saving in {files} folder")
        # TODO Download chrome driver for platform specific
        # check using sys.platform, win32, linux, darwin
        os.mkdir('files')
        chrome_driver_url = ""
        if _platform == "linux" or _platform == "linux2":
            # linux
            chrome_driver_url = "https://chromedriver.storage.googleapis.com/79.0.3945.16/chromedriver_linux64.zip"
        elif _platform == "darwin":
            # MAC OS X
            chrome_driver_url = "https://chromedriver.storage.googleapis.com/79.0.3945.16/chromedriver_mac64.zip"
        elif _platform == "win32":
            # Windows
            chrome_driver_url = "https://chromedriver.storage.googleapis.com/79.0.3945.16/chromedriver_win32.zip"

        download_file(chrome_driver_url, "chromedriver.zip",
                    "files")
        print("Extracting components")
        with zipfile.ZipFile(os.path.join("files", "chromedriver.zip"), "r") as zip_ref:
            zip_ref.extractall("./files")
        print("Complete.")


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

        temp = ref.child(key).child(key).get()

        if(temp is not None):
            session['id'] = key
            name = ref.child(session['id']).child(session['id']).child('Name').get()
            school = ref.child(session['id']).child(session['id']).child('School').get()
            branch = ref.child(session['id']).child(session['id']).child('Branch').get()
            program = ref.child(session['id']).child(session['id']).child('Program').get()
            regno = ref.child(session['id']).child(session['id']).child('RegNo').get()
            appno = ref.child(session['id']).child(session['id']).child('AppNo').get()
            email = ref.child(session['id']).child(session['id']).child('Email').get()
            proctoremail = ref.child(session['id']).child(session['id']).child('ProctorEmail').get()
            proctorname = ref.child(session['id']).child(session['id']).child('ProctorName').get()
            api = ref.child(session['id']).child(session['id']).child('API').get()

            return jsonify({'Name': name,'School': school,'Branch': branch,'Program': program,'RegNo': regno,'AppNo': appno,'Email': email,'ProctorEmail': proctoremail,'ProctorName': proctorname,'APItoken': api})

        else:
            return jsonify({'Error': 'Invalid API Token.'})

    else:
        global driver
        global action
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_driver = r'files/chromedriver.exe'
        check_and_chromedriver(chrome_driver)
        driver = webdriver.Chrome(chrome_driver,options=chrome_options)
        driver.get("http://vtopcc.vit.ac.in:8080/vtop/initialProcess/openPage")
        login_button = driver.find_element_by_link_text("Login to VTOP")
        login_button.click()
        driver.implicitly_wait(1)
        loginnext_button = driver.find_elements_by_xpath("//*[@id='page-wrapper']/div/div[1]/div[1]/div[3]/div/button")[0]
        loginnext_button.click()
        try:
            element = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "captchaRefresh")))
        finally:
            username1 = request.args.get('username')
            password1 = request.args.get('password')

            # Solve the captcha using the captcha solver
            download_captcha(1,username1,driver)
            img = Image.open('./captcha/'+username1+'-captcha.png')
            img_matrix = remove_pixel_noise(img)
            # Store the result of solved captcha in captcha1

            captcha1 = identify_chars(img,img_matrix)
            username = usernamecall(driver)
            password = passwordcall(driver)
            captcha = captchacall(driver)
            action = ActionChains(driver)
            username.send_keys(username1)
            password.send_keys(password1)
            captcha.send_keys(captcha1)
            loginfinal_button = driver.find_elements_by_xpath("//*[@id='captcha']")[0]
            loginfinal_button.click()
            driver.implicitly_wait(5)
            nav = driver.find_elements_by_xpath("//*[@id='button-panel']/aside/section/div/div[1]/a")[0]
            nav.click()
            driver.implicitly_wait(3)
            profile = driver.find_element_by_xpath("//*[@id='button-panel']/aside/section/div/div[1]/a")
            hover = action.move_to_element(profile)
            hover.perform()

            item = driver.find_element_by_xpath("//*[@id='BtnBody21112']/div/ul/li[1]")
            item.click()
            try:
                element = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "exTab1")))
            finally:
                page_source = driver.page_source
                soup = BeautifulSoup(page_source, 'lxml')
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

                ref = db.reference('vitask')
                tut_ref = ref.child(tutorial_code[0])
                tut_ref.set({
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
                session['id'] = tutorial_code[0]
                name = ref.child(session['id']).child(session['id']).child('Name').get()
                school = ref.child(session['id']).child(session['id']).child('School').get()
                branch = ref.child(session['id']).child(session['id']).child('Branch').get()
                program = ref.child(session['id']).child(session['id']).child('Program').get()
                regno = ref.child(session['id']).child(session['id']).child('RegNo').get()
                appno = ref.child(session['id']).child(session['id']).child('AppNo').get()
                email = ref.child(session['id']).child(session['id']).child('Email').get()
                proctoremail = ref.child(session['id']).child(session['id']).child('ProctorEmail').get()
                proctorname = ref.child(session['id']).child(session['id']).child('ProctorName').get()
                api = ref.child(session['id']).child(session['id']).child('API').get()

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

        temp = ref.child(key).child(key).get()

        #Checking if data is already there or not in firebase(if there then no need to acces Vtop again)
        if(session['classes']==1 or temp is not None):
            attend = ref.child("attendance-"+session['id']).child(session['id']).child('Attendance').get()
            q = ref.child("attendance-"+session['id']).child(session['id']).child('Track').get()

            values = []
            for i in attend.values():
                values.append(i)

            slots = []

            for i in attend.keys():
                slots.append(i)


            ref = db.reference('vitask')
            users_ref = ref.child('users')
            tut_ref = ref.child("attendance-"+session['id'])
            tut_ref.set({
                session['id']: {
                    'Attended': values,
                    'Slots' : slots,
                    'Track' : q
                }
            })
        
            return jsonify({'Attended': values,'Slots': slots, 'Track' : q})

        else:
            return jsonify({'Error': 'Invalid API Token.'})

    else:
      nav = driver.find_elements_by_xpath("//*[@id='button-panel']/aside/section/div/div[4]/a")[0]
      nav.click()
      driver.implicitly_wait(3)
      tt = driver.find_element_by_xpath("//*[@id='button-panel']/aside/section/div/div[4]/a")
      hover = action.move_to_element(tt)
      hover.perform()
      item = driver.find_element_by_xpath("//*[@id='BtnBody21115']/div/ul/li[9]")
      item.click()
      try:
          element = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "semesterSubId")))
          semlist = driver.find_element_by_xpath("//*[@id='semesterSubId']")
          semlist.click()
          driver.implicitly_wait(2)

          hover = action.move_to_element(semlist)
          hover.perform()
          item = driver.find_element_by_xpath("//*[@id='semesterSubId']/option[2]")
          item.click()
          viewbutton = driver.find_element_by_xpath("//*[@id='viewStudentAttendance']/div[2]/div/button")
          viewbutton.click()
          try:
              newelement = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "getStudentDetails")))
          finally:
              page_source = driver.page_source

      finally:
          soup = BeautifulSoup(page_source, 'lxml')
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
      # print(p)
          attend = {}
          empty = []
          for i in range(0,len(p)-1):
              empty = [p[i][21],p[i][20],p[i][5],p[i][7]]
              attend[p[i][8]] = empty

          c=0
          q={}
          for i in attend:
              q[i]=c
              c = c + 1

          values = []
          for i in attend.values():
              values.append(i)

          slots = []

          for i in attend.keys():
              slots.append(i)


          ref = db.reference('vitask')
          users_ref = ref.child('users')
          tut_ref = ref.child("attendance-"+session['id'])
          tut_ref.set({
              session['id']: {
                  'Attended': values,
                  'Slots' : slots,
                  'Track' : q
              }
          })
      return jsonify({'Attended': values,'Slots': slots, 'Track' : q})




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

        temp = ref.child("timetable-"+key).child(key).child("Timetable").get()

        if(temp is not None):
            session['id'] = key
            days = temp

            return jsonify({'Timetable': days})

        else:
            return jsonify({'Error': 'Invalid API Token.'})
    else:
        nav = driver.find_elements_by_xpath("//*[@id='button-panel']/aside/section/div/div[4]/a")[0]
        nav.click()
        driver.implicitly_wait(3)
        tt = driver.find_element_by_xpath("//*[@id='button-panel']/aside/section/div/div[4]/a")
        hover = action.move_to_element(tt)
        hover.perform()

        item = driver.find_element_by_xpath("//*[@id='BtnBody21115']/div/ul/li[8]")
        item.click()
        try:
            element = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "semesterSubId")))
            semlist = driver.find_element_by_xpath("//*[@id='semesterSubId']")
            semlist.click()
            hover = action.move_to_element(semlist)
            hover.perform()

            item = driver.find_element_by_xpath("//*[@id='semesterSubId']/option[2]")
            item.click()
            viewbutton = driver.find_element_by_xpath("//*[@id='studentTimeTable']/div[2]/div/button")
            viewbutton.click()
            try:
                newelement = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "timeTableStyle")))
            finally:
                page_source = driver.page_source

        finally:
            soup = BeautifulSoup(page_source, 'lxml')
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
            time_table={'A1':['Monday 8:00 8:50','Wednesday 8:55 9:45'],'B1':['Tuesday 8:00 8:50','Thursday 8:55 9:45'],'C1':['Wednesday 8:00 8:50','Friday 8:55 9:45'],
                    'D1':['Thursday 8:00 8:50','Monday 9:50 10:40'],'E1':['Friday 8:00 8:50','Tuesday 9:50 10:40'],'F1':['Monday 8:55 9:45','Wednesday 9:50 10:40'],
                    'G1':['Tuesday 8:55 9:45','Thursday 9:50 10:40'],

                    'TA1':['Friday 9:50 10:40'],'TB1':['Monday 10:45 11:35'],'TC1':['Tuesday 10:45 11:35'],'TD1':['Wednesday 10:45 11:35'],'TE1':['Thursday 10:45 11:35'],
                    'TF1':['Friday 10:45 11:35'],'TG1':['Monday 11:40 12:30'],

                    'TAA1':['Tuesday 11:40 12:30'],'TBB1':['Wednesday 11:40 12:30'],'TCC1':['Thursday 11:40 12:30'],'TDD1':['Friday 11:40 12:30'],

                    'L1':['Monday 8:00 8:50'],'L2':['Monday 8:50 9:40'],'L3':['Monday 9:50 10:40'],'L4':['Monday 10:40 11:30'],'L5':['Monday 11:40 12:30'],'L6':['Monday 12:30 1:20'],
                    'L7':['Tuesday 8:00 8:50'],'L8':['Tuesday 8:50 9:40'],'L9':['Tuesday 9:50 10:40'],'L10':['Tuesday 10:40 11:30'],'L11':['Tuesday 11:40 12:30'],'L12':['Tuesday 12:30 1:20'],
                    'L13':['Wednesday 8:00 8:50'],'L14':['Wednesday 8:50 9:40'],'L15':['Wednesday 9:50 10:40'],'L16':['Wednesday 10:40 11:30'],'L17':['Wednesday 11:40 12:30'],
                    'L18':['Wednesday 12:30 1:20'],
                    'L19':['Thursday 8:00 8:50'],'L20':['Thursday 8:50 9:40'],'L21':['Thursday 9:50 10:40'],'L22':['Thursday 10:40 11:30'],'L23':['Thursday 11:40 12:30'],
                    'L24':['Thursday 12:30 1:20'],
                    'L25':['Friday 8:00 8:50'],'L26':['Friday 8:50 9:40'],'L27':['Friday 9:50 10:40'],'L28':['Friday 10:40 11:30'],'L29':['Friday 11:40 12:30'],'L30':['Friday 12:30 1:20'],


                    'A2':['Monday 2:00 2:50','Wednesday 2:55 3:45'],'B2':['Tuesday 2:00 2:50','Thursday 2:55 3:45'],'C2':['Wednesday 2:00 2:50','Friday 2:55 3:45'],
                    'D2':['Thursday 2:00 2:50','Monday 3:50 4:40'],'E2':['Friday 2:00 2:50','Tuesday 3:50 4:40'],'F2':['Monday 2:55 3:45','Wednesday 3:50 4:40'],
                    'G2':['Tuesday 2:55 3:45','Thursday 3:50 4:40'],

                    'TA2':['Friday 3:50 4:40'],'TB2':['Monday 4:45 5:35'],'TC2':['Tuesday 4:45 5:35'],'TD2':['Wednesday 4:45 5:35'],'TE2':['Thursday 4:45 5:35'],'TF2':['Friday 4:45 5:35'],
                    'TG2':['Monday 5:40 6:30'],

                    'TAA2':['Tuesday 5:40 6:30'],'TBB2':['Wednesday 5:40 6:30'],'TCC2':['Thursday 5:40 6:30'],'TDD2':['Friday 5:40 6:30'],

                    'L31':['Monday 2:00 2:50'],'L32':['Monday 2:50 3:40'],'L33':['Monday 3:50 4:40'],'L34':['Monday 4:40 5:30'],'L35':['Monday 5:40 6:30'],'L36':['Monday 6:30 7:20'],
                    'L37':['Tuesday 2:00 2:50'],'L38':['Tuesday 2:50 3:40'],'L39':['Tuesday 3:50 4:40'],'L40':['Tuesday 4:40 5:30'],'L41':['Tuesday 5:40 6:30'],'L42':['Tuesday 6:30 7:20'],
                    'L43':['Wednesday 2:00 2:50'],'L44':['Wednesday 2:50 3:40'],'L45':['Wednesday 3:50 4:40'],'L46':['Wednesday 4:40 5:30'],'L47':['Wednesday 5:40 6:30'],
                    'L48':['Wednesday 6:30 7:20'],
                    'L49':['Thursday 2:00 2:50'],'L50':['Thursday 2:50 3:40'],'L51':['Thursday 3:50 4:40'],'L52':['Thursday 4:40 5:30'],'L53':['Thursday 5:40 6:30'],'L54':['Thursday 6:30 7:20'],
                    'L55':['Friday 2:00 2:50'],'L56':['Friday 2:50 3:40'],'L57':['Friday 3:50 4:40'],'L58':['Friday 4:40 5:30'],'L59':['Friday 5:40 6:30'],'L60':['Friday 6:30 7:20']}
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
                    p = [slots[i][0],slots[i][1],slots[i][2],slots[i][3],arr[1],arr[2]]
                    if(arr[0]=="Monday"):
                        days["Monday"].append(p)
                    elif(arr[0]=="Tuesday"):
                        days["Tuesday"].append(p)
                    elif(arr[0]=="Wednesday"):
                        days["Wednesday"].append(p)
                    elif(arr[0]=="Thursday"):
                        days["Thursday"].append(p)
                    elif(arr[0]=="Friday"):
                        days["Friday"].append(p)
                    p = []

            ref = db.reference('vitask')
            tut_ref = ref.child("timetable-"+session['id'])
            tut_ref.set({
                session['id']: {
                    'Timetable': days
                }
            })
            return jsonify({'Timetable': days})

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
    
        temp = ref.child("acadhistory-"+key).child(key).child("AcadHistory").get()
        
        if(temp is not None):
            session['id'] = key
            acadHistory = temp

            return jsonify({'AcadHistory': acadHistory})
        
        else:
            return jsonify({'Error': 'Invalid API Token.'})
    else:
        nav = driver.find_elements_by_xpath("//*[@id='button-panel']/aside/section/div/div[6]/a")[0]
        nav.click()
        driver.implicitly_wait(3)
        acadhistory = driver.find_element_by_xpath("//*[@id='button-panel']/aside/section/div/div[6]/a")
        hover = action.move_to_element(acadhistory)
        hover.perform()

        item = driver.find_element_by_xpath("//*[@id='BtnBody21117']/div/ul/li[4]")
        item.click()
        try:
            element = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "fixedTableContainer")))
        finally:
            soup = BeautifulSoup(driver.page_source, 'lxml')
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
            
            ref = db.reference('vitask')
            tut_ref = ref.child("acadhistory-"+session['id'])
            tut_ref.set({
                session['id']: {
                    'AcadHistory': acadHistory
                }
            })
            return jsonify({'AcadHistory': acadHistory})


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
    
        temp = ref.child("marks-"+key).child(key).child("Marks").get()
        
        if(temp is not None):
            session['id'] = key
            marksDict = temp

            return jsonify({'Marks': marksDict})
        
        else:
            return jsonify({'Error': 'Invalid API Token.'})
    else:
        nav = driver.find_elements_by_xpath("//*[@id='button-panel']/aside/section/div/div[6]/a")[0]
        nav.click()
        driver.implicitly_wait(3)
        marks = driver.find_element_by_xpath("//*[@id='button-panel']/aside/section/div/div[6]/a")
        hover = action.move_to_element(marks)
        hover.perform()
        item = driver.find_element_by_xpath("//*[@id='BtnBody21117']/div/ul/li[1]")
        item.click()
        try:
            element = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "semesterSubId")))
            semlist = driver.find_element_by_xpath("//*[@id='semesterSubId']")
            semlist.click()
            driver.implicitly_wait(2)

            hover = action.move_to_element(semlist)
            hover.perform()
            item = driver.find_element_by_xpath("//*[@id='semesterSubId']/option[3]")
            item.click()
            try:
                newelement = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "fixedTableContainer")))
            finally:
                page_source = driver.page_source
        finally:
            soup = BeautifulSoup(page_source, 'lxml')
            code_soup = soup.findAll('tbody')
            code_soup2 = soup.findAll("tr", {"class": "tableContent"})
            courses = []
            temp = []
            for i in code_soup2:
                temp = i.findAll('td')
                if(len(temp)==9):
                    courses.append(temp[3].getText()+" "+temp[4].getText())
                
            code_soup = code_soup[1:len(code_soup)]
            courseMarks = []
            for i in code_soup:
                courseMarks.append(i.findAll('tr'))
            
            k = []
            m = 0
            tempDict = {}
            marksDict = {} 
            for i in range (0,len(courseMarks)):
                for j in range(1, len(courseMarks[i])):
                    k = courseMarks[i][j].findAll('td')
                    tempDict[k[1].getText()] = k[5].getText() 
                marksDict[courses[m]] =  tempDict
                m = m+1
                tempDict = {}
            ref = db.reference('vitask')
            tut_ref = ref.child("marks-"+session['id'])
            tut_ref.set({
                session['id']: {
                    'Marks': marksDict
                }
            })
            return jsonify({'Marks': marksDict})


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

# Login path for VITask Web app
@app.route('/login', methods=['GET', 'POST'])
def index():
    return render_template('login.html')



# Web login route(internal don't use for anything on user side)
@app.route('/signin', methods=['GET', 'POST'])
def login():
    if request.method == 'POST' and 'username' in request.form and 'password' in request.form:
        global driver
        global action
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_driver = r'files/chromedriver.exe'
        check_and_chromedriver(chrome_driver)
        driver = webdriver.Chrome(chrome_driver,options=chrome_options)
        driver.get("http://vtopcc.vit.ac.in:8080/vtop/initialProcess/openPage")
        login_button = driver.find_element_by_link_text("Login to VTOP")
        login_button.click()
        loginnext_button = driver.find_elements_by_xpath("//*[@id='page-wrapper']/div/div[1]/div[1]/div[3]/div/button")[0]
        loginnext_button.click()
        try:
            element = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "captchaRefresh")))
        finally:
            session['timetable'] = 0
            session['classes'] = 0
            session['moodle'] = 0
        
            username1 = request.form['username']
            password1 = request.form['password']

            # Solve the captcha using the captcha solver
            download_captcha(1,username1,driver)
            img = Image.open('./captcha/'+username1+'-captcha.png')
            img_matrix = remove_pixel_noise(img)
            # Store the result of solved captcha in captcha1
            captcha1 = identify_chars(img,img_matrix)

            username = usernamecall(driver)
            password = passwordcall(driver)
            captcha = captchacall(driver)
            action = ActionChains(driver)
            username.send_keys(username1)
            password.send_keys(password1)
            captcha.send_keys(captcha1)
            loginfinal_button = driver.find_elements_by_xpath("//*[@id='captcha']")[0]
            loginfinal_button.click()
            try:
                element = WebDriverWait(driver, 20).until(EC.visibility_of_element_located((By.XPATH, "//*[@id='button-panel']/aside/section/div/div[1]/a")))
            finally:
                nav = driver.find_elements_by_xpath("//*[@id='button-panel']/aside/section/div/div[1]/a")[0]
                nav.click()
                driver.implicitly_wait(3)
                profile = driver.find_element_by_xpath("//*[@id='button-panel']/aside/section/div/div[1]/a")
                hover = action.move_to_element(profile)
                hover.perform()

                item = driver.find_element_by_xpath("//*[@id='BtnBody21112']/div/ul/li[1]")
                item.click()
                try:
                    element = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "exTab1")))
                finally:
                    page_source = driver.page_source
                    soup = BeautifulSoup(page_source, 'lxml')
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

                    ref = db.reference('vitask')
                    tut_ref = ref.child(tutorial_code[0])
                    tut_ref.set({
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
                    session['id'] = tutorial_code[0]
                    session['name'] = tutorial_code[1]
                    session['reg'] = tutorial_code[14]

                return redirect(url_for('profile'))



@app.route('/profile')
def profile():
    ref = db.reference('vitask')
    name = ref.child(session['id']).child(session['id']).child('Name').get()
    school = ref.child(session['id']).child(session['id']).child('School').get()
    branch = ref.child(session['id']).child(session['id']).child('Branch').get()
    program = ref.child(session['id']).child(session['id']).child('Program').get()
    regno = ref.child(session['id']).child(session['id']).child('RegNo').get()
    appno = ref.child(session['id']).child(session['id']).child('AppNo').get()
    email = ref.child(session['id']).child(session['id']).child('Email').get()
    proctoremail = ref.child(session['id']).child(session['id']).child('ProctorEmail').get()
    proctorname = ref.child(session['id']).child(session['id']).child('ProctorName').get()
    return render_template('profile.html',name=name,school=school,branch=branch,program=program,regno=regno,email=email,proctoremail=proctoremail,proctorname=proctorname,appno=session['id'])


# Timetable route
@app.route('/timetable')
def timetable():
    ref = db.reference('vitask')
    temp = ref.child("timetable-"+session['id']).child(session['id']).child('Timetable').get()
    if(session['timetable']==1 or temp is not None):
        days = ref.child("timetable-"+session['id']).child(session['id']).child('Timetable').get()
        return render_template('timetable.html',name=session['name'],id=session['id'],tt=days)
    else:
        nav = driver.find_elements_by_xpath("//*[@id='button-panel']/aside/section/div/div[4]/a")[0]
        nav.click()
        driver.implicitly_wait(3)
        tt = driver.find_element_by_xpath("//*[@id='button-panel']/aside/section/div/div[4]/a")
        hover = action.move_to_element(tt)
        hover.perform()

        item = driver.find_element_by_xpath("//*[@id='BtnBody21115']/div/ul/li[8]")
        item.click()
        try:
            element = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "semesterSubId")))
            semlist = driver.find_element_by_xpath("//*[@id='semesterSubId']")
            semlist.click()
            hover = action.move_to_element(semlist)
            hover.perform()

            item = driver.find_element_by_xpath("//*[@id='semesterSubId']/option[2]")
            item.click()
            viewbutton = driver.find_element_by_xpath("//*[@id='studentTimeTable']/div[2]/div/button")
            viewbutton.click()
            try:
                newelement = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "timeTableStyle")))
            finally:
                page_source = driver.page_source

        finally:
            soup = BeautifulSoup(page_source, 'lxml')
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
            time_table={'A1':['Monday 8:00 8:50','Wednesday 8:55 9:45'],'B1':['Tuesday 8:00 8:50','Thursday 8:55 9:45'],'C1':['Wednesday 8:00 8:50','Friday 8:55 9:45'],
                    'D1':['Thursday 8:00 8:50','Monday 9:50 10:40'],'E1':['Friday 8:00 8:50','Tuesday 9:50 10:40'],'F1':['Monday 8:55 9:45','Wednesday 9:50 10:40'],
                    'G1':['Tuesday 8:55 9:45','Thursday 9:50 10:40'],

                    'TA1':['Friday 9:50 10:40'],'TB1':['Monday 10:45 11:35'],'TC1':['Tuesday 10:45 11:35'],'TD1':['Wednesday 10:45 11:35'],'TE1':['Thursday 10:45 11:35'],
                    'TF1':['Friday 10:45 11:35'],'TG1':['Monday 11:40 12:30'],

                    'TAA1':['Tuesday 11:40 12:30'],'TBB1':['Wednesday 11:40 12:30'],'TCC1':['Thursday 11:40 12:30'],'TDD1':['Friday 11:40 12:30'],

                    'L1':['Monday 8:00 8:50'],'L2':['Monday 8:50 9:40'],'L3':['Monday 9:50 10:40'],'L4':['Monday 10:40 11:30'],'L5':['Monday 11:40 12:30'],'L6':['Monday 12:30 1:20'],
                    'L7':['Tuesday 8:00 8:50'],'L8':['Tuesday 8:50 9:40'],'L9':['Tuesday 9:50 10:40'],'L10':['Tuesday 10:40 11:30'],'L11':['Tuesday 11:40 12:30'],'L12':['Tuesday 12:30 1:20'],
                    'L13':['Wednesday 8:00 8:50'],'L14':['Wednesday 8:50 9:40'],'L15':['Wednesday 9:50 10:40'],'L16':['Wednesday 10:40 11:30'],'L17':['Wednesday 11:40 12:30'],
                    'L18':['Wednesday 12:30 1:20'],
                    'L19':['Thursday 8:00 8:50'],'L20':['Thursday 8:50 9:40'],'L21':['Thursday 9:50 10:40'],'L22':['Thursday 10:40 11:30'],'L23':['Thursday 11:40 12:30'],
                    'L24':['Thursday 12:30 1:20'],
                    'L25':['Friday 8:00 8:50'],'L26':['Friday 8:50 9:40'],'L27':['Friday 9:50 10:40'],'L28':['Friday 10:40 11:30'],'L29':['Friday 11:40 12:30'],'L30':['Friday 12:30 1:20'],


                    'A2':['Monday 2:00 2:50','Wednesday 2:55 3:45'],'B2':['Tuesday 2:00 2:50','Thursday 2:55 3:45'],'C2':['Wednesday 2:00 2:50','Friday 2:55 3:45'],
                    'D2':['Thursday 2:00 2:50','Monday 3:50 4:40'],'E2':['Friday 2:00 2:50','Tuesday 3:50 4:40'],'F2':['Monday 2:55 3:45','Wednesday 3:50 4:40'],
                    'G2':['Tuesday 2:55 3:45','Thursday 3:50 4:40'],

                    'TA2':['Friday 3:50 4:40'],'TB2':['Monday 4:45 5:35'],'TC2':['Tuesday 4:45 5:35'],'TD2':['Wednesday 4:45 5:35'],'TE2':['Thursday 4:45 5:35'],'TF2':['Friday 4:45 5:35'],
                    'TG2':['Monday 5:40 6:30'],

                    'TAA2':['Tuesday 5:40 6:30'],'TBB2':['Wednesday 5:40 6:30'],'TCC2':['Thursday 5:40 6:30'],'TDD2':['Friday 5:40 6:30'],

                    'L31':['Monday 2:00 2:50'],'L32':['Monday 2:50 3:40'],'L33':['Monday 3:50 4:40'],'L34':['Monday 4:40 5:30'],'L35':['Monday 5:40 6:30'],'L36':['Monday 6:30 7:20'],
                    'L37':['Tuesday 2:00 2:50'],'L38':['Tuesday 2:50 3:40'],'L39':['Tuesday 3:50 4:40'],'L40':['Tuesday 4:40 5:30'],'L41':['Tuesday 5:40 6:30'],'L42':['Tuesday 6:30 7:20'],
                    'L43':['Wednesday 2:00 2:50'],'L44':['Wednesday 2:50 3:40'],'L45':['Wednesday 3:50 4:40'],'L46':['Wednesday 4:40 5:30'],'L47':['Wednesday 5:40 6:30'],
                    'L48':['Wednesday 6:30 7:20'],
                    'L49':['Thursday 2:00 2:50'],'L50':['Thursday 2:50 3:40'],'L51':['Thursday 3:50 4:40'],'L52':['Thursday 4:40 5:30'],'L53':['Thursday 5:40 6:30'],'L54':['Thursday 6:30 7:20'],
                    'L55':['Friday 2:00 2:50'],'L56':['Friday 2:50 3:40'],'L57':['Friday 3:50 4:40'],'L58':['Friday 4:40 5:30'],'L59':['Friday 5:40 6:30'],'L60':['Friday 6:30 7:20']}
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
                    p = [slots[i][0],slots[i][1],slots[i][2],slots[i][3],arr[1],arr[2]]
                    if(arr[0]=="Monday"):
                        days["Monday"].append(p)
                    elif(arr[0]=="Tuesday"):
                        days["Tuesday"].append(p)
                    elif(arr[0]=="Wednesday"):
                        days["Wednesday"].append(p)
                    elif(arr[0]=="Thursday"):
                        days["Thursday"].append(p)
                    elif(arr[0]=="Friday"):
                        days["Friday"].append(p)
                    p = []

            ref = db.reference('vitask')
            tut_ref = ref.child("timetable-"+session['id'])
            tut_ref.set({
                session['id']: {
                    'Timetable': days
                }
            })
            session['timetable'] = 1
            return render_template('timetable.html',name=session['name'],id=session['id'],tt=days)


# Attendance route
@app.route('/classes')
def classes():
    ref = db.reference('vitask')
    temp = ref.child("attendance-"+session['id']).child(session['id']).child('Attendance').get()
    if(session['classes']==1 or temp is not None):
        attend = ref.child("attendance-"+session['id']).child(session['id']).child('Attendance').get()
        q = ref.child("attendance-"+session['id']).child(session['id']).child('Track').get()
        return render_template('attendance.html',name = session['name'],id = session['id'],dicti = attend,q = q)
    else:
        nav = driver.find_elements_by_xpath("//*[@id='button-panel']/aside/section/div/div[4]/a")[0]
        nav.click()
        driver.implicitly_wait(3)
        tt = driver.find_element_by_xpath("//*[@id='button-panel']/aside/section/div/div[4]/a")
        hover = action.move_to_element(tt)
        hover.perform()
        item = driver.find_element_by_xpath("//*[@id='BtnBody21115']/div/ul/li[9]")
        item.click()
        try:
            element = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "semesterSubId")))
            semlist = driver.find_element_by_xpath("//*[@id='semesterSubId']")
            semlist.click()
            driver.implicitly_wait(2)

            hover = action.move_to_element(semlist)
            hover.perform()
            item = driver.find_element_by_xpath("//*[@id='semesterSubId']/option[2]")
            item.click()
            viewbutton = driver.find_element_by_xpath("//*[@id='viewStudentAttendance']/div[2]/div/button")
            viewbutton.click()
            try:
                newelement = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "getStudentDetails")))
            finally:
                page_source = driver.page_source

        finally:
            soup = BeautifulSoup(page_source, 'lxml')
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
                empty = [p[i][21],p[i][20],p[i][5],p[i][7]]
                attend[p[i][8]] = empty
            c=0
            q={}
            for i in attend:
                q[i] = c
                c = c + 1
            ref = db.reference('vitask')
            users_ref = ref.child('users')
            tut_ref = ref.child("attendance-"+session['id'])
            tut_ref.set({
                session['id']: {
                    'Attendance': attend,
                    'Track': q
                }
            })
    return render_template('attendance.html',dicti = attend,q=q, name=session['name'])

"""---------------------------------------------------------------

            Code for Moodle Integration begins from here

    “The only true wisdom is in knowing you know nothing.”― Socrates

------------------------------------------------------------------"""


# Moodle Login path for VITask Web app
@app.route('/moodle', methods=['GET', 'POST'])
def moodle():
    ref = db.reference('vitask')
    temp = ref.child("moodle-"+session['id']).child(session['id']).get()
    if(session['moodle']==1 or temp is not None):
        return redirect(url_for('assignments'))
    else:
        return render_template('moodle.html',name=session['name'])

# Path for processing of details from /moodle
@app.route('/moodlelogin', methods=['GET', 'POST'])
def moodlelogin():
    ref = db.reference('vitask')
    temp = ref.child("moodle-"+session['id']).child(session['id']).get()
    if(session['moodle']==1 or temp is not None):
        return redirect(url_for('assignments'))
    else:
        global driver
        global action
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_driver = r'files/chromedriver.exe'
        check_and_chromedriver(chrome_driver)
        driver = webdriver.Chrome(chrome_driver,options=chrome_options)
        action = ActionChains(driver)
        driver.get("https://moodlecc.vit.ac.in/login/index.php")
        try:
            element = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "username")))
        finally:
            login_button = driver.find_elements_by_xpath('/html/body/div[3]/div/section/div/div/div[1]/div[1]/form/input[2]')[0]
            username = driver.find_elements_by_xpath('/html/body/div[3]/div/section/div/div/div[1]/div[1]/form/div[1]/div[2]/input')[0]
            password = driver.find_elements_by_xpath('/html/body/div[3]/div/section/div/div/div[1]/div[1]/form/div[1]/div[5]/input')[0]
            moodle_username = request.form['username']
            moodle_password = request.form['password']
            username.send_keys(moodle_username)
            password.send_keys(moodle_password)
            login_button.click()

            # Going to Dashboard to find all assignments.
            try:
                element = WebDriverWait(driver,20).until(EC.visibility_of_element_located((By.ID,'region-main-box')))
            finally:
                Dashboard = driver.find_elements_by_xpath('/html/body/div[3]/div/div/div/aside/div/div[2]/ul/li/ul/li[1]/p/a/span')[0]
                Dashboard.click()
                try:
                    # Wait till moodle loads assignments, timeout 20 seconds.
                    element = WebDriverWait(driver,20).until(EC.visibility_of_element_located((By.ID,'event-list-title-5e83b34ae83ad5e83b34ae83f21')))
                finally:
                    page_source = driver.page_source
                    soup = BeautifulSoup(page_source, 'lxml')

                    # To store all assignments.
                    all_assignments = []

                    # Magic. Do not touch. (Moodle parsing logic by Yash)

                    for rows in soup.findAll('div', attrs = {'class':'row-fluid visible-desktop'}): 

                        for i in rows.findAll('div',attrs = {'class':'span6'}):
                            for j in i.findAll('div', attrs={'class' : 'd-inline-block event-name-container'}):
                                assignment = {}
                                assignment['topic'] = j.a.text
                                assignment['course'] = j.div.text
                            for k in i.findAll('div' , attrs = {'class' : 'row-fluid'}):
                                for z in k.findAll('div' , attrs = {'class' : 'span5 text-truncate'}):
                                    assignment['time'] = z.text.strip()
                                    all_assignments.append(assignment)

                    # Processing password before storing
                    api_gen = moodle_password
                    api_token = api_gen.encode('ascii')
                    temptoken = base64.b64encode(api_token)
                    token = temptoken.decode('ascii')

                    session['moodle'] = 1

                    ref = db.reference('vitask')
                    tut_ref = ref.child("moodle-"+session['id'])
                    tut_ref.set({
                        session['id']: {
                            'Username': moodle_username,
                            'Password': token,
                            'Assignments': all_assignments   
                        }
                    })
                    assignment = ref.child("moodle-"+session['id']).child(session['id']).child('Assignments').get()

                    return render_template('assignments.html',name=session['name'],assignment=assignment)
            
# Assignments page for Moodle
@app.route('/assignments', methods=['GET', 'POST'])
def assignments():
    ref = db.reference('vitask')
    temp = ref.child("moodle-"+session['id']).child(session['id']).get()
    if(session['moodle']==1 or temp is not None):
        assignment = ref.child("moodle-"+session['id']).child(session['id']).child('Assignments').get()
        return render_template('assignments.html',name=session['name'],assignment=assignment)
    else:
        return redirect(url_for('moodle'))
    
# Assignments page for Moodle
@app.route('/moodleresync', methods=['GET', 'POST'])
def moodleresync():
    global driver
    global action
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_driver = r'files/chromedriver.exe'
    check_and_chromedriver(chrome_driver)
    driver = webdriver.Chrome(chrome_driver,options=chrome_options)
    action = ActionChains(driver)
    driver.get("https://moodlecc.vit.ac.in/login/index.php")
    try:
        element = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "username")))
    finally:
        login_button = driver.find_elements_by_xpath('/html/body/div[3]/div/section/div/div/div[1]/div[1]/form/input[2]')[0]
        username = driver.find_elements_by_xpath('/html/body/div[3]/div/section/div/div/div[1]/div[1]/form/div[1]/div[2]/input')[0]
        password = driver.find_elements_by_xpath('/html/body/div[3]/div/section/div/div/div[1]/div[1]/form/div[1]/div[5]/input')[0]
        ref = db.reference('vitask')
        moodle_username = ref.child("moodle-"+session['id']).child(session['id']).child('Username').get()
        pass_token = ref.child("moodle-"+session['id']).child(session['id']).child('Password').get()
        
        # Decoding Password
        temptoken = pass_token.encode('ascii')
        temp_pass = base64.b64decode(temptoken)
        key = temp_pass.decode('ascii')
        
        
        moodle_password = key
        username.send_keys(moodle_username)
        password.send_keys(moodle_password)
        login_button.click()

        # Going to Dashboard to find all assignments.
        try:
            element = WebDriverWait(driver,20).until(EC.visibility_of_element_located((By.ID,'region-main-box')))
        finally:
            Dashboard = driver.find_elements_by_xpath('/html/body/div[3]/div/div/div/aside/div/div[2]/ul/li/ul/li[1]/p/a/span')[0]
            Dashboard.click()
            try:
                # Wait till moodle loads assignments, timeout 20 seconds.
                element = WebDriverWait(driver,20).until(EC.visibility_of_element_located((By.ID,'event-list-title-5e83b34ae83ad5e83b34ae83f21')))
            finally:
                page_source = driver.page_source
                soup = BeautifulSoup(page_source, 'lxml')

                # To store all assignments.
                all_assignments = []

                # Magic. Do not touch. (Moodle parsing logic by Yash)

                for rows in soup.findAll('div', attrs = {'class':'row-fluid visible-desktop'}): 

                    for i in rows.findAll('div',attrs = {'class':'span6'}):
                        for j in i.findAll('div', attrs={'class' : 'd-inline-block event-name-container'}):
                            assignment = {}
                            assignment['topic'] = j.a.text
                            assignment['course'] = j.div.text
                        for k in i.findAll('div' , attrs = {'class' : 'row-fluid'}):
                            for z in k.findAll('div' , attrs = {'class' : 'span5 text-truncate'}):
                                assignment['time'] = z.text.strip()
                                all_assignments.append(assignment)

                # Processing password before storing
                api_gen = moodle_password
                api_token = api_gen.encode('ascii')
                temptoken = base64.b64encode(api_token)
                token = temptoken.decode('ascii')

                session['moodle'] = 1

                ref = db.reference('vitask')
                tut_ref = ref.child("moodle-"+session['id'])
                tut_ref.set({
                    session['id']: {
                        'Username': moodle_username,
                        'Password': token,
                        'Assignments': all_assignments   
                    }
                })
                assignment = ref.child("moodle-"+session['id']).child(session['id']).child('Assignments').get()

                return render_template('assignments.html',name=session['name'],assignment=assignment)
            
"""---------------------------------------------------------------

            Code for Moodle Integration ends here

------------------------------------------------------------------"""

# Web Logout
@app.route('/logout')
def logout():
    global driver
    if driver is not None:
        driver.close()
        session.pop('id', None)
        session.pop('timetable', 0)
        session.pop('classes', 0)
        session.pop('name', None)
        session.pop('reg', None)
        session.pop('moodle', 0)
        return render_template('home.html')
    else:
        session.pop('id', None)
        session.pop('timetable', 0)
        session.pop('classes', 0)
        session.pop('name', None)
        session.pop('reg', None)
        session.pop('moodle', 0)
        return render_template('home.html')


# Run Flask app
if __name__ == '__main__':
	app.run(host='0.0.0.0', port=port, debug=True)