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
    print(marksDict)