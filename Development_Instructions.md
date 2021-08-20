# Development Instructions

This file contains instructions for contributors to set up the environment for developing various apps. If you are contributing to this repo. Please look at Contributing.md also for contributing Guidelines.

## Web Application

### Prerequisites
You can check the preqrequistes in the `VITask Web/requirements.txt` file. You require `Python 3.2 or higher` and make sure `pip` and `python` are added in `PATH` variable successfully before running.

### Installation

1.Creating Virtual Environment and activating:
* Open cmd

* Change current directory to VITask Web. Using command `cd "VITask Web"`
* Run this `py -3 -m venv venv` or `python3 -m venv venv` or if you have `virtualenv` set up use command `virtulalenv venv`.
* To activate virtual environment, run this `venv\Scripts\activate` or if you are using bash terminal `source venv/Scripts/activate`
* Now install `requirements.txt`
    
2.Installing from `requirements.txt`:
* Activate virtual environment as told above.
* Run this `pip install -r requirements.txt`
    
3.Running `app.py`

* Activate virtual environment and then make sure you have completed above steps.
* Now run `py app.py` or `python app.py` or `python3 app.py` or `py3 app.py`
* Open your Browser and then enter URL `http://localhost:5000/login` to enter your login details
* Now Check the `app.py` for the `@app.route` and then head over to the page you want to check for example if you want to check page `xyz`    then it will have an app route as `@app.route('/xyz')`.Then use the URL `http://localhost:5000/xyz`

---
## For Desktop and React Native

### Dependencies
For installing dependencies, make sure you are inside respective directories. Use command `yarn install` or `npm install` to install dependencies from `package.json`.

Right now we dont have iOS and MacOS support for the app. So, linking dependencies for iOS and Mac please review the installation of respective dependencies.

---

_Note that after sometime the `firebase.json` file may not be valid and made private. This is done for privacy and preventing  Database breach. If you want to contribute to Web Server and check please contact us_