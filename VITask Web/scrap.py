from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
from bs4 import BeautifulSoup
import pandas as pd
import re
import os
import firebase_admin
from firebase_admin import db
from utility import timetable_slots

def timeconverter(hours,mins):
    time = hours*60+mins
    return time

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


with open("C:\\Users\\HP\\Documents\\GitHub\\VITask\\VITask Web\\test.html", encoding="utf8") as fp:
    days, final_dict = parse_timetable(fp)
    print(days)
    print(final_dict)