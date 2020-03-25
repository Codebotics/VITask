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
import flask


app = flask.Flask(__name__)

with open("C:\\Users\\aprat\\Desktop\\"+"18blc1085-profile"+".html") as fp:
    soup = BeautifulSoup(fp, 'html.parser')
    code_soup = soup.find_all('td', {'style': lambda s: 'background-color: #f2dede;' in s})
    tutorial_code = [i.getText() for i in code_soup]
    code_proctor = soup.find_all('td', {'style': lambda s: 'background-color: #d4d3d3;' in s})
    tutorial_proctor = [i.getText() for i in code_proctor]
    print(tutorial_code[14])