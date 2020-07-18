# This file contains all the utility functions required by other files


# imports
import base64
import random
import os
from PIL import Image, ImageFilter
import json
import firebase_admin
from firebase_admin import db

ref = db.reference('vitask')

CAPTCHA_DIM = (180, 45)
CHARACTER_DIM = (30, 32)
#Above values were checked from various captchas

"""
---------------------------------------
Functions for Captcha solver begin here
---------------------------------------
"""

def save_captcha(captchasrc,username):
    """
    Downloads and save a random captcha from VTOP website in the path provided
    Defaults to `/captcha`
    num = number of captcha to save
    """
    base64_image = captchasrc[23:]
    # TODO: Change the name of file to a random name to prevent any collision
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


def solve_captcha(captchasrc,username):
    save_captcha(captchasrc,username)

    img = Image.open("./captcha/"+username+"-captcha.png")
    img_matrix = remove_pixel_noise(img)
    captcha = identify_chars(img,img_matrix)
    return captcha

"""
---------------------------------------
Functions for Captcha solver end here
---------------------------------------
"""

# Slots for Timetable
def timetable_slots():
    time_table={'A1':['Monday 8:00 8:50','Tuesday 9:00 9:50','Wednesday 10:00 10:50'],'B1':['Tuesday 8:00 8:50','Wednesday 9:00 9:50','Thursday 10:00 10:50'],'C1':['Wednesday 8:00 8:50','Thursday 9:00 9:50','Friday 10:00 10:50'],
    'D1':['Thursday 8:00 8:50','Friday 9:00 9:50','Saturday 10:00 10:50'],'E1':['Friday 8:00 8:50','Saturday 9:00 9:50','Monday 11:00 11:50'],'F1':['Saturday 8:00 8:50','Monday 10:00 10:50','Tuesday 11:00 11:50'],
    'G1':['Monday 9:00 9:50','Tuesday 10:00 10:50','Wednesday 11:00 11:50'],'S1':['Thursday 12:00 12:50'],'S2':['Friday 1:00 1:50'],'S3':['Saturday 1:00 1:50'],

    'TA1':['Thursday 11:00 11:50'],'TB1':['Friday 11:00 11:50'],'TC1':['Saturday 11:00 11:50'],'TD1':['Monday 12:00 12:50'],'TE1':['Tuesday 12:00 12:50'],
    'TF1':['Wednesday 12:00 12:50'],

    'TAA1':['Friday 12:00 12:50'],'TBB1':['Saturday 12:00 12:50'],'TCC1':['Monday 1:00 1:50'],'TDD1':['Tuesday 1:00 1:50'],'TEE1':['Wednesday 1:00 1:50'],'TFF1':['Thursday 1:00 1:50'],

    'L1':['Monday 8:00 8:50'],'L2':['Monday 8:51 9:40'],'L3':['Monday 9:41 10:30'],'L4':['Monday 11:00 11:50'],'L5':['Monday 11:51 12:40'],'L6':['Monday 12:41 1:30'],
    'L7':['Tuesday 8:00 8:50'],'L8':['Tuesday 8:51 9:40'],'L9':['Tuesday 9:41 10:30'],'L10':['Tuesday 11:00 11:50'],'L11':['Tuesday 11:51 12:40'],'L12':['Tuesday 12:41 1:30'],
    'L13':['Wednesday 8:00 8:50'],'L14':['Wednesday 8:51 9:40'],'L15':['Wednesday 9:41 10:30'],'L16':['Wednesday 11:00 11:50'],'L17':['Wednesday 11:51 12:40'],'L18':['Wednesday 12:41 1:30'],
    'L19':['Thursday 8:00 8:50'],'L20':['Thursday 8:51 9:40'],'L21':['Thursday 9:41 10:30'],'L22':['Thursday 11:00 11:50'],'L23':['Thursday 11:51 12:40'],'L24':['Thursday 12:41 1:30'],
    'L25':['Friday 8:00 8:50'],'L26':['Friday 8:51 9:40'],'L27':['Friday 9:41 10:30'],'L28':['Friday 11:00 11:50'],'L29':['Friday 11:51 12:40'],'L30':['Friday 12:41 1:30'],
    'L31':['Saturday 8:00 8:50'],'L32':['Saturday 8:51 9:40'],'L33':['Saturday 9:41 10:30'],'L34':['Saturday 11:00 11:50'],'L35':['Saturday 11:51 12:40'],'L36':['Saturday 12:41 1:30'],

    'A2':['Monday 2:00 2:50','Tuesday 3:00 3:50','Wednesday 4:00 4:50'],'B2':['Tuesday 2:00 2:50','Wednesday 3:00 3:50','Thursday 4:00 4:50'],'C2':['Wednesday 2:00 2:50','Thursday 3:00 3:50','Friday 4:00 4:50'],'D2':['Thursday 2:00 2:50','Friday 3:00 3:50','Saturday 4:00 4:50'],'E2':['Friday 2:00 2:50','Saturday 3:00 3:50','Monday 5:00 5:50'],'F2':['Saturday 2:00 2:50','Monday 4:00 4:50','Tuesday 5:00 5:50'],'G2':['Monday 3:00 3:50','Tuesday 4:00 4:50','Wednesday 5:00 5:50'],

    'TA2':['Thursday 5:00 5:50'],'TB2':['Friday 5:00 5:50'],'TC2':['Saturday 5:00 5:50'],'TD2':['Monday 6:00 6:50'],'TE2':['Tuesday 6:00 6:50'],
    'TF2':['Wednesday 6:00 6:50'],'S4':['Thursday 6:00 6:50'],

    'TAA2':['Friday 6:00 6:50'],'TBB2':['Saturday 6:00 6:50'],'TCC2':['Monday 7:00 7:50'],'TDD2':['Tuesday 7:00 7:50'],'TEE2':['Wednesday 7:00 7:50'],
    'TFF2':['Thursday 7:00 7:50'],'S5':['Friday 7:00 7:50'],'S6':['Saturday 7:00 7:50'],

    'L37':['Monday 2:00 2:50'],'L38':['Monday 2:50 3:40'],'L39':['Monday 3:40 4:30'],'L40':['Monday 5:00 5:50'],'L41':['Monday 5:50 6:40'],'L42':['Monday 6:40 7:30'],
    'L43':['Tuesday 2:00 2:50'],'L44':['Tuesday 2:50 3:40'],'L45':['Tuesday 3:40 4:30'],'L46':['Tuesday 5:00 5:50'],'L47':['Tuesday 5:50 6:40'],'L48':['Tuesday 6:40 7:30'],
    'L49':['Wednesday 2:00 2:50'],'L50':['Wednesday 2:50 3:40'],'L51':['Wednesday 3:40 4:30'],'L52':['Wednesday 5:00 5:50'],'L53':['Wednesday 5:50 6:40'],'L54':['Wednesday 6:40 7:30'],
    'L55':['Thursday 2:00 2:50'],'L56':['Thursday 2:50 3:40'],'L57':['Thursday 3:40 4:30'],'L58':['Thursday 5:00 5:50'],'L59':['Thursday 5:50 6:40'],'L60':['Thursday 6:40 7:30'],
    'L61':['Friday 2:00 2:50'],'L62':['Friday 2:50 3:40'],'L63':['Friday 3:40 4:30'],'L64':['Friday 5:00 5:50'],'L65':['Friday 5:50 6:40'],'L66':['Friday 6:40 7:30'],
    'L67':['Saturday 2:00 2:50'],'L68':['Saturday 2:50 3:40'],'L69':['Saturday 3:40 4:30'],'L70':['Saturday 5:00 5:50'],'L71':['Saturday 5:50 6:40'],'L72':['Saturday 6:40 7:30']}
    return time_table

# Returns Total Time to sort Timetable.
def timeconverter(hours,mins):
    time = hours*60+mins
    return time

# Moodle timestamp
def get_timestamp():
    """
    Utility function to generate current timstamp
    """
    dt = datetime.now() - timedelta(15)
    utc_time = dt.replace(tzinfo = timezone.utc) 
    return int(utc_time.timestamp())
