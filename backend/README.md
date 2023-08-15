# Backend

## How to run
In order to run the project, you need to have installed:
- [Node.js](https://nodejs.org/en/)
- [MongoDB](https://www.mongodb.com/)
- [NPM](https://www.npmjs.com/)
- [Docker](https://www.docker.com/)

### Set-up the backend project
1. Download [Kaggle dataset](https://www.kaggle.com/datasets/kinguistics/heartbeat-sounds)
2. Unzip the archive `archive.zip` in the folder `./CNN`
3. Go into the folder `./CNN` and run `python Build_DataSet.py`

### Running the backend project
1. Run `npm install`
2. Run `npm start`

### After the Set-up and Run the project
At this point, an administrator account has been created (username: admin@admin.com, password: admin). It is imperative to change the username and password. 
Additionally, a pre-trained model has been selected by default.

If you want to populate the database with dummy data, you can use the following requests with the help of Postman:
- Creation of doctors: (POST) http://localhost:2834/api/user/init
- Creation of patients: (POST) http://localhost:2834/api/patient/init
- Creation of folder records using dummy audio (located in the ./audioFilesInit folder): (POST) http://localhost:2834/api/audio/init

## Authors
- [Derain Emile](https://github.com/EmileDerain)
- [Faucher Vinh](https://github.com/Supervinh)
