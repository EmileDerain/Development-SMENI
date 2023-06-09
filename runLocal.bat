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

docker-compose -f local-docker-compose.yml --env-file env/mongo.env up
