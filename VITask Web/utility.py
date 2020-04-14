# This file contains all the utility functions required by other files


# imports
import base64
import random
import os
from PIL import Image
from PIL import ImageFilter
import json

CAPTCHA_DIM = (180, 45)
CHARACTER_DIM = (30, 32)
#Above values were checked from various captchas

def save_captcha(captchasrc):
    """
    Downloads and save a random captcha from VTOP website in the path provided
    Defaults to `/captcha`
    num = number of captcha to save
    """
    base64_image = captchasrc[23:]
    # TODO: Change the name of file to a random name to prevent any collision
    image_name = "captcha.png"
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


def solve_captcha(captchasrc):
    save_captcha(captchasrc)

    img = Image.open('captcha.png')
    img_matrix = remove_pixel_noise(img)
    captcha = identify_chars(img,img_matrix)
    return captcha

def TimeTable():
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
    return time_table