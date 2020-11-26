This is a bootleg version of Kahoot! It was made using JavaScript and ReactJS.
Common JS and ReactJS libraries such as bootstrap, fontawesome and react-router-dom was also used.

Some things that you can do on this app is
- login/register an account and logout
- create/delete/start/stop a quiz
- import a quiz directly through a JSON file (JSON example file included, named 2.5.json)
- add/delete/edit questions in a quiz
- play a game without registering any account

Disclaimer: funky music not provided with this app (unfortunately)

# Dependencies
{: .box-warning}
Note: You only need to run the dependencies commands once.

To download all dependencies, run the following command in the project repo.
```
yarn install
```

Go to the frontend folder and run the command again.
```
cd frontend
yarn install
```

To set up the backend, go to the backend folder and run the following command
```
cd ../backend
npm install
```

# Run
To run the site, you need to use two terminals (one for the backend and one for the frontend).

In terminal 1, run the following command. This will start the frontend of the app.
```
yarn --cwd frontend start
```

In terminal 2, run the following command. This will start the backend of the app.
```
npm run backend
```
