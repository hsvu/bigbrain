import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
// import Form from 'react-bootstrap/Form';
import NavigationBar from '../components/NavigationBar';
import ModalWindow from '../components/ModalWindow';
import GameScreenAdmin from '../components/GameScreenAdmin';
import '../css/Form.css';
import '../css/PlayGame.css';

const host = 'http://localhost:5005';

function RunGameAdmin() {
  const history = useHistory();
  // 3 states: lobby, playing, results
  const [gameStatus, setGameStatus] = React.useState('lobby');

  // QUESTION CONTENT TO DISPLAY ON COMPONENT
  const [question, setQuestion] = React.useState('');
  const [position, setPosition] = React.useState(0);
  const [link, setLink] = React.useState('');
  const [answers, setAnswers] = React.useState([]);
  // const [correctAns, setCorrectAns] = React.useState([]);
  // const [time, setTime] = React.useState(-1);
  const [lastQuestion, setLastQuestion] = React.useState(false);

  const [errorMessage, setErrorMessage] = React.useState('');
  const { gameId, sessionId } = useParams();

  // do we have to get the json again each time? inefficient (maybe fix later)
  async function getQuestion() {
    try {
      const requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
      const response = await fetch(`${host}/admin/session/${sessionId}/status`, requestOptions);
      if (response.ok) {
        const json = await response.json();
        const pos = json.results.position;
        const currQues = json.results.questions[pos];
        await setPosition(pos);
        await setQuestion(currQues.question);
        await setAnswers(currQues.answers);
        // await setCorrectAns(currQues.correctAns);
        await setLink(currQues.link);
        // await setTime(currQues.time);

        if (pos === json.results.questions.length - 1) {
          setLastQuestion(true);
        }
        // console.log(json);
      } else {
        setErrorMessage('Something went wrong! Please try again.');
      }
    } catch (e) {
      setErrorMessage(e);
    }
  }

  async function displayResults() {
    try {
      const requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
      const response = await fetch(`${host}/admin/session/${sessionId}/results`, requestOptions);
      if (!response.ok) {
        setErrorMessage('Something went wrong! Please try again.');
      }
    } catch (e) {
      setErrorMessage(e);
    }
  }

  async function advanceGame() {
    try {
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
      const response = await fetch(`${host}/admin/quiz/${gameId}/advance`, requestOptions);
      if (response.ok) {
        setGameStatus('playing');
        if (lastQuestion) {
          setGameStatus('results');
          displayResults();
        } else {
          getQuestion();
        }
      } else {
        setErrorMessage('Something went wrong! Please try again.');
      }
    } catch (e) {
      setErrorMessage(e);
    }
  }

  function redirectDashBoard() {
    history.push('/');
  }

  return (
    <div>
      <NavigationBar />
      <div className="window">
        <div className="middle">
          {'\n'}
          {/* NEED TO DISPLAY NUMBER AND NAMES OF USERS */}
          {/* SET BUTTON TYPE FROM SUCCESS TO CONTINUE WHEN ADVANCED */}
          {gameStatus === 'lobby' && <Button variant="success" onClick={advanceGame}>START GAME!</Button>}
          {gameStatus === 'playing'
            && (
              <>
                <GameScreenAdmin
                  question={question}
                  position={position}
                  link={link}
                  answers={answers}
                />
                <Button onClick={advanceGame}>Continue</Button>
              </>
            )}
          {gameStatus === 'results'
            && (
              <>
                <h1>FINISHED GAME</h1>
                {/* DISPLAY RESULTS */}
                <Button onClick={redirectDashBoard}>Return To Dashboard</Button>
              </>
            )}
          {'\n'}
          <ModalWindow type="error" modalMessage={errorMessage} />
        </div>
      </div>
    </div>
  );
}

export default RunGameAdmin;
