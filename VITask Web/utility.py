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