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
from utility import TimeTable

def timeconverter(hours,mins):
    time = hours*60+mins
    return time

with open("C:\\Users\\aprat\\Documents\\GitHub\\VITask\\VITask Web\\test.html", encoding="utf8") as fp:
    soup = BeautifulSoup(fp, 'lxml')
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
        
        