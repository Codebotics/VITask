# VITask
_Still in Development Mode use with caution_

VITask is a dynamic API server for VTOP. This repo contains code for Web(`Flask server`), Android App (`React-Native`), Desktop (`ElectronJS`). The code is still in development stage, use with caution.

Please make sure you install dependencies before running respective apps. If you are changing code, please read guidelines at the end of this file

---

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
     
3.Next step is running `main.py` . But before do following steps.

* For Windows users, authorize Firebase by saving `firebase.json` in a suitable location and then executing `set GOOGLE_APPLICATION_CREDENTIALS = path_to_your_firebase.json\firebase.json` in cmd.
* For Linux Users, Authorize Firebase by saving `firebase.json` in a suitable location and then executing `export GOOGLE_APPLICATION_CREDENTIALS = path_to_your_firebase.json\firebase.json` in terminal.
    
4.Running `main.py`

* Activate virtual environment and then make sure you have completed above steps.
* Now run `py main.py` or `python main.py` or `python3 main.py` or `py3 main.py`
* Open your Browser and then enter URL `http://localhost:5000/login` to enter your login details
* Now Check the `main.py` for the `@app.route` and then head over to the page you want to check for example if you want to check page `xyz`    then it will have an app route as `@app.route('/xyz')`.Then use the URL `http://localhost:5000/xyz`

---
## For Desktop and React Native

### Dependencies
For installing dependencies, make sure you are inside respective directories. Use command `yarn install` or `npm install` to install dependencies from `package.json`.

---
## Contributing Guidelines
While working on same project please make sure you follow these guidelines.

* Always update your `master` branch using `git pull origin master`.
* Create seperate branch while working and switch to that branch using `git checkout -b branch_name`
* Make changes and commit changes to this branch.
* Push branch to github using `git push -u origin branch_name`
* While working on the branch, be sure to rebase with master to pull in mainline changes:
  ```
  git checkout master
  git pull origin master
  git checkout your_branch
  git rebase master
* Approve your Pull requests from GitHub or wait for approval.
* For more information look into [this post](https://github.com/codepath/android_guides/wiki/Collaborating-on-Projects-with-Git).

**While working on the project make sure you update and create `.gitignore` files in the directories if you create some personal and temperoray files.**

---
## TODO


This Project is still in development phase and we have some TODO's we would like to do. Although these features are optional and may or may not be added. 

- [ ] Add feature to add extra classes and remove cancelled classes
- [ ] Option to see summary of DA's and assignments
- [ ] Calculate CGPA based on grades
- [ ] Predict class average, if enough people download the app.

As, we add more features, the list may grew. We will tick the features that have been implemented. Stay tuned!


---

## Our team

The team behind VITask is very dedicated and talented, all of the the students are write beautiful code and work collaborately. Enjoy a short write down them:

| Bitmoji | About|
|:----:|:----| 
| ![apratimshukla6](/resources/apratimshukla.png)  | He is the real mind behind this project, watch out for his Python and Web Dev skills. He really does a good job as a leader and our root server. Check out [apratimshukla6](http://github.com/apratimshukla6)
| ![yash-rajpal](/resources/yash-rajpal.png) | He knows about react-native and React. Ready to learn and collaborate, ask him how to scrape a website and he is ready. Likes to joke very much. Check out [yash-rajpal](http://github.com/yash-rajpal)|
| ![mayanktolani19](/resources/mayanktolani19.png) | Problem with ReactNative? He is to the rescue. Loves good design and has a great sense of humour. He knows React, ElectronJS. Check out [mayanktolani19](http://github.com/mayanktolani19)|
| ![uragirii](/resources/uragirii.png)| He joined pretty late in the project. Loves cats and coding. Knows how to scrape the shit out of any website. He loves a good UI and UX.  Also likes ML. Check out [Uragirii](http://github.com/uragirii)




_More team member details to be added soon. Stay with us._

