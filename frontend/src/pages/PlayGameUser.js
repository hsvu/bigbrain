import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Countdown from 'react-countdown';
import NavigationBar from '../components/NavigationBar';
import ModalWindow from '../components/ModalWindow';
import '../css/Form.css';
import '../css/PlayGame.css';

const host = 'http://localhost:5005';

function PlayGameUser() {
  const history = useHistory();
  // 3 states: lobby, playing, results
  const [gameStatus, setGameStatus] = React.useState('lobby');

  // QUESTION CONTENT TO DISPLAY ON COMPONENT
  const [question, setQuestion] = React.useState('');
  // const [link, setLink] = React.useState('');
  const [answers, setAnswers] = React.useState([]);
  // const [correctAns, setCorrectAns] = React.useState([]);
  const [time, setTime] = React.useState(-1);
  const [currPoints, setCurrPoints] = React.useState(0);

  // const [lastQuestion, setLastQuestion] = React.useState(false);

  // points to keep track for user
  const [totalPoints, setTotalPoints] = React.useState(0);
  const [correct, setCorrect] = React.useState(false);
  const [userAnswer, setUserAnswer] = React.useState(-1);

  const [errorMessage, setErrorMessage] = React.useState('');
  // const [loadCounter, setLoadCounter] = React.useState(0);
  const { userId } = useParams();

  async function getQuestion() {
    if (gameStatus === 'lobby' || gameStatus === 'waiting') {
      try {
        const requestOptions = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        };
        const response = await fetch(`${host}/play/${userId}/question`, requestOptions);
        if (response.ok) {
          const json = await response.json();
          if (json.question.question !== question) {
            const currQues = json.question;
            await setQuestion(currQues.question);
            await setAnswers(currQues.answers);
            // await setLink(currQues.link);
            await setTime(currQues.time);
            await setCurrPoints(currQues.points);
            setGameStatus('playing');
            // console.log(link, successMessage);
          }
        } else if (!response.ok && (gameStatus === 'playing' || gameStatus === 'waiting')) {
          setGameStatus('results');
        } else {
          setErrorMessage('Something went wrong! Please try again.');
        }
      } catch (e) {
        setErrorMessage(e);
      }
    }
  }

  async function displayAnswer() {
    try {
      const requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const response = await fetch(`${host}/play/${userId}/answer`, requestOptions);
      if (response.ok) {
        setGameStatus('answer');
        const json = await response.json();
        if (json.answerIds.includes(userAnswer)) {
          setCorrect(true);
          setTotalPoints(totalPoints + currPoints);
        } else {
          setCorrect(false);
        }
      } else {
        setErrorMessage(response.error);
      }
    } catch (e) {
      setErrorMessage(e);
    }
  }

  async function answerQuestion(event, ids) {
    event.preventDefault();
    try {
      const answerIds = [ids];
      const requestOptions = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answerIds }),
      };
      const response = await fetch(`${host}/play/${userId}/answer`, requestOptions);
      if (response.ok) {
        setGameStatus('waiting');
        setUserAnswer(ids);
      } else {
        setErrorMessage('Something went wrong! Please try again.');
      }
    } catch (e) {
      setErrorMessage(e);
    }
  }

  function reduceTime() {
    if (time >= 0) {
      setTime(time - 1);
    }
  }

  function redirectDashBoard() {
    history.push('/');
  }

  React.useEffect(() => {
    getQuestion();
  });

  return (
    <div>
      <NavigationBar />
      <div className="window">
        <div className="middle">
          {'\n'}
          {gameStatus === 'lobby'
            && (
              <>
                <h1>Waiting for game to start</h1>
                <div className="loading" />
                {'\n'}
              </>
            )}
          {gameStatus === 'waiting'
            && (
              <>
                <h1>Waiting for everyone else</h1>
                <div className="loading" />
                {'\n'}
              </>
            )}
          {gameStatus === 'playing'
            && (
              <>
                <h1>{question}</h1>
                <br />
                <h3>Options:</h3>
                {answers.filter((data) => (data !== null && data !== '')).map((ans, num) => (
                  <>
                    {/* {num} */}
                    <Button variant="outline-primary" onClick={(e) => answerQuestion(e, num)}>{ans}</Button>
                  </>
                ))}
              </>
            )}
          {gameStatus === 'results'
            && (
              <>
                <h1>FINISHED GAME</h1>
                <h3>
                  You have
                  {' '}
                  {totalPoints}
                  {' '}
                  points!
                </h3>
                <Button onClick={redirectDashBoard}>Return To Dashboard</Button>
              </>
            )}
          {gameStatus === 'answer'
            && (
              <>
                {correct && <h1>Correct!</h1>}
                {!correct && <h1>Wrong! :(</h1>}
                <h3>
                  You have
                  {' '}
                  {totalPoints}
                  {' '}
                  points!
                </h3>
              </>
            )}
          {time !== -1
            && (
              <Countdown
                date={Date.now() + time * 1000}
                onComplete={displayAnswer}
                onTick={reduceTime}
              />
            )}
          {'\n'}
          <ModalWindow type="error" modalMessage={errorMessage} />
        </div>
      </div>
    </div>
  );
}

export default PlayGameUser;
