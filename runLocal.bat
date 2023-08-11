@echo off

set "envFile=env\backend-local.env"

for /f "usebackq tokens=1,2 delims==" %%a in ("%envFile%") do (
    setx %%a %%b /m
)

set "envFile=env\mongo.env"

for /f "usebackq tokens=1,2 delims==" %%a in ("%envFile%") do (
    setx %%a %%b /m
)

echo Please restart your command prompt for the environment variables to be updated.

start cmd /k "docker-compose -f local-docker-compose.yml --env-file env/mongo.env up"


cd backend/CNN

python -m venv venv

call venv\Scripts\activate.bat
call pip list
call pip install -r requirements.txt
call pip list
cd ../
call run.bat
