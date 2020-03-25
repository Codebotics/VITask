# VITask
VITask is a dynamic API server for VTOP.

### Prerequisites

-Python 3.2 or higher

### Installation

-Creating Virtual Environment and Installing Flask:
    -Open cmd
    -Change current directory to VITask directory
    -Run this 'py -3 -m venv venv' or 'python3 -m venv venv'
    -To activate virtual environment, run this 'venv\Scripts\activate'
    -Now install Flask using 'pip install Flask'
-Installing Requirements.txt:
    -Open cmd
    -Go to VITask directory
    -Run this 'pip install -r requirements.txt'
    
### Before you run main.py

-Replace the directory name inside main.py according to your system
    -for example if you see a directory name like this '"C:\\Users\\name\\Desktop\\"+username1+"-profile"+".html"' then replace it with yours by changing according to your system.
-Authorize Firebase by saving firebase.json in a suitable location and then executing 'set GOOGLE_APPLICATION_CREDENTIALS=path_to_your_firebase.json\firebase.json' in cmd.
    
### Running main.py

-Open cmd
-Change current directory to VITask folder
-now run 'py main.py' or 'python main.py' or 'python3 main.py' or 'py3 main.py'
-Open your Browser and then enter URL 'http://localhost:5000/login' to enter your login details
-Now Check the main.py for the @app.route and then head over to the page you want to check for example if you want to check page xyz    then it will have an app route as '@app.route('/xyz')'.Then use the URL 'http://localhost:5000/xyz'
