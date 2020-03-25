from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
from bs4 import BeautifulSoup
import pandas as pd
import re
import os

import time
driver = None

try:
    driver = webdriver.Chrome()
    action=ActionChains(driver)
    driver.get("http://vtopcc.vit.ac.in:8080/vtop/initialProcess/openPage")
    login_button = driver.find_element_by_link_text("Login to VTOP")
    login_button.click()
    #driver.implicitly_wait(1)
    loginnext_button = driver.find_elements_by_xpath("//*[@id='page-wrapper']/div/div[1]/div[1]/div[3]/div/button")[0]
    loginnext_button.click()
    driver.implicitly_wait(1)
    username = driver.find_elements_by_xpath("//*[@id='uname']")[0]
    password = driver.find_elements_by_xpath("//*[@id='passwd']")[0]
    captcha = driver.find_elements_by_xpath("//*[@id='captchaCheck']")[0]
    captchasolver = input()
    username.send_keys("18blc1085")
    password.send_keys("$Earthing1horse")
    captcha.send_keys(captchasolver)
    loginfinal_button = driver.find_elements_by_xpath("//*[@id='captcha']")[0]
    loginfinal_button.click()
    driver.implicitly_wait(5)
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
            with open("C:\\Users\\aprat\\Desktop\\"+"18blc1085-tt"+".html", "w") as f:
                f.write(driver.page_source)
    finally:
        pass
    
    
finally:
    if driver is not None:
        driver.close()