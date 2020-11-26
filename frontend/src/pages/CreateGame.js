import React from 'react';
import bsCustomFileInput from 'bs-custom-file-input';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import NavigationBar from '../components/NavigationBar';
import ModalWindow from '../components/ModalWindow';
import '../css/Form.css';
import '../css/index.css';

const host = 'http://localhost:5005';

function CreateGame() {
  const [name, setName] = React.useState('');
  const [json, setJSON] = React.useState('');
  const [successMessage, setSuccessMessage] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');

  async function processCreateGame(event) {
    try {
      event.preventDefault();
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ name }),
      };
      await fetch(`${host}/admin/quiz/new`, requestOptions);

      // add questions and thumbnail
      if (json) {
        // first finding the most recently created game
        const getAllGameDataOptions = {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        };
        const allGameData = await fetch(`${host}/admin/quiz/`, getAllGameDataOptions);
        const allGameDataJSON = await allGameData.json();
        // following functions is credited to Travis Heeter from stackoverflow.
        // https://stackoverflow.com/questions/36577205/what-is-the-elegant-way-to-get-the-latest-date-from-array-of-objects-in-client-s
        const mostRecentDate = Math.max.apply(null,
          allGameDataJSON.quizzes.map((e) => new Date(e.createdAt)));
        const gameDate = new Date(mostRecentDate);
        const mostRecentGame = allGameDataJSON.quizzes.filter((e) => {
          const d = new Date(e.createdAt);
          return d.getTime() === gameDate.getTime();
        });
        const gameId = mostRecentGame[0].id;

        // getting all the data from said game
        const getGameDataOptions = {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        };
        const gameData = await fetch(`${host}/admin/quiz/${gameId}`, getGameDataOptions);
        const gameDataJSON = await gameData.json();
        const { questions } = gameDataJSON;

        for (let i = 0; i < json.questions.length; i += 1) {
          const questionInJSON = json.questions[i];
          const newQuestion = {
            type: questionInJSON.type,
            question: questionInJSON.question,
            link: questionInJSON.link,
            time: questionInJSON.time,
            points: questionInJSON.points,
            answers: questionInJSON.answers,
            correctAns: questionInJSON.correctAns,
          };
          questions.push(newQuestion);
        }

        // updating thumbnail
        let newThumbnail = gameDataJSON.thumbnail;
        const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        const fileTypePartOne = json.thumbnail.split(':')[1];
        const fileType = fileTypePartOne.split(';')[0];
        const valid = validFileTypes.find((type) => type === fileType);
        if (valid) {
          newThumbnail = json.thumbnail;
        } else {
          setErrorMessage('Your provided thumbnail isn&apos;t valid.');
          return;
        }

        // updating game data
        const putGameDataOptions = {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            questions,
            name: gameDataJSON.name,
            thumbnail: newThumbnail,
          }),
        };
        const updateGameData = await fetch(`${host}/admin/quiz/${gameId}`, putGameDataOptions);
        if (!updateGameData.ok) {
          setErrorMessage('We couldn&apos;t update your game with your JSON file. Sorry!');
        }
      } // end json boolean if statement
      setSuccessMessage('Your game has been successfully created.');
    } catch (e) {
      setErrorMessage(e);
    }
  }

  function recordName(event) {
    event.preventDefault();
    setName(event.target.value);
    setSuccessMessage('');
    setErrorMessage('');
  }

  function onReaderLoad(event) {
    setJSON(JSON.parse(event.target.result));
  }

  function recordJSON(event) {
    event.preventDefault();
    const reader = new FileReader();
    reader.onload = onReaderLoad;
    reader.readAsText(event.target.files[`${event.target.files.length - 1}`]);
    setSuccessMessage('');
    setErrorMessage('');
  }

  React.useEffect(() => {
    bsCustomFileInput.init();
  });

  return (
    <div>
      <NavigationBar />
      <div className="window">
        <main className="middle">
          <h1>Create New Game</h1>
          <Form onSubmit={processCreateGame}>
            <Form.Group>
              <Form.Label>New Name</Form.Label>
              <Form.Control type="text" value={name} onChange={recordName} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Add JSON file (optional)</Form.Label>
              <Form.File type="file" label="Upload JSON..." onChange={recordJSON} custom />
              <Form.Text muted>
                JSON file will contain the full data of a game.
              </Form.Text>
            </Form.Group>
            <Button variant="info" type="submit">Submit</Button>
          </Form>
          <ModalWindow type="success" modalMessage={successMessage} />
          <ModalWindow type="error" modalMessage={errorMessage} />
        </main>
      </div>
    </div>
  );
}

export default CreateGame;
