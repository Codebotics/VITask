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

with open("C:\\Users\\aprat\\Documents\\GitHub\\VITask\\VITask Web\\test.html", encoding="utf8") as fp:
    soup = BeautifulSoup(fp, 'lxml')
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
            temp_dict[hold[1].getText()] = hold[5].getText()
        hold_array.append(temp_dict)
        temp_dict = {}
        
    marksDict = {}
    for i in range(0,len(courses)):
        marksDict[courses[i]] = hold_array[i]
        print(marksDict)
        
        