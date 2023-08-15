# Development-SMENI

## Description


## How to run
In order to run the project, you need to have installed:
- [Node.js](https://nodejs.org/en/)
- [MongoDB](https://www.mongodb.com/)
- [NPM](https://www.npmjs.com/)
- [Docker](https://www.docker.com/)

### Running the project
1. Clone the repository
2. Read the readMe in backend folder and make the "Set-up" part
3. Run `npm install` in the three folders: `backend`, `SMENI` and `smeni-web`
4. Create the `./env/mongo.env` file required to set up the MongoDB environment variables in the `local-docker-compose.yml` file
5. Run `runLocal.bat` in the root folder to launch the database 
(the first time you run the script, use a terminal as an administrator to allow the writing of necessary environment variables. Then, for the variables to take effect, simply close all terminals and re-run the script.)
or run `run.bat` in the root folder to launch the backend and the database (it's not working)
6. Run `npm run android` in the `SMENI` folder to use the mobile app
7. Run `npm start` in the `smeni-web` folder to use the web app


## Authors
- [Bevan Tom](https://github.com/TomBevanIUT)
- [Derain Emile](https://github.com/EmileDerain)
- [Faucher Vinh](https://github.com/Supervinh)
