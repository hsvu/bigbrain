import React from 'react';
import { useHistory } from 'react-router-dom';
// import styled from 'styled-components';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import ModalWindow from './ModalWindow';
import '../css/GameCard.css';
import '../css/FontAwesome.css';

const host = 'http://localhost:5005';

function GameCard({ thumbnail, name, id }) {
  const history = useHistory();
  const [questionLength, setQuestionLength] = React.useState(0);
  const [time, setTime] = React.useState(0);
  const [loadCounter, setLoadCounter] = React.useState(0);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [successMessage, setSuccessMessage] = React.useState('');
  const [buttonVariant, setButtonVariant] = React.useState('');
  const [buttonText, setButtonText] = React.useState('');
  const [sessionId, setSessionId] = React.useState(null);
  const [joinLink, setJoinLink] = React.useState('');
  const [deleteGameModal, setDeleteGameModal] = React.useState('');

  function redirectEditGame(event) {
    event.preventDefault();
    localStorage.setItem('gameId', id);
    history.push(`/edit_game/${id}`);
  }

  async function getSessionId() {
    try {
      const requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
      const response = await fetch(`${host}/admin/quiz/${id}`, requestOptions);
      if (!response.ok) {
        setErrorMessage('Please try again.');
        return;
      }
      const json = await response.json();
      await setSessionId(json.active);
      await setJoinLink(`localhost:3000/join/${json.active}`);
    } catch (e) {
      setErrorMessage(e);
    }
  }

  async function startGame() {
    try {
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
      const response = await fetch(`${host}/admin/quiz/${id}/start`, requestOptions);
      if (response.ok) {
        await setButtonText('Stop Game');
        await setButtonVariant('secondary');
        await getSessionId();
        setSuccessMessage('');
      } else {
        setErrorMessage('Please try again.');
      }
    } catch (e) {
      setErrorMessage(e);
    }
  }

  async function stopGame() {
    try {
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
      const response = await fetch(`${host}/admin/quiz/${id}/end`, requestOptions);
      if (response.ok) {
        await setButtonText('Start Game');
        await setButtonVariant('success');
        setSuccessMessage('The session has been ended.');
      } else {
        setErrorMessage('Please try again.');
      }
    } catch (e) {
      setErrorMessage(e);
    }
  }

  function gameFunction(event) {
    if (event.target.innerText === 'Start Game') {
      startGame();
    } else if (event.target.innerText === 'Stop Game') {
      stopGame();
    }
  }

  async function loadVariables() {
    if (loadCounter === 0) {
      const requestOptions = {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
      const response = await fetch(`${host}/admin/quiz/${id}`, requestOptions);
      if (!response.ok) {
        setErrorMessage('Please refresh the page.');
        return;
      }
      const json = await response.json();
      setQuestionLength(json.questions.length);
      let total = 0;
      json.questions.forEach((question) => {
        total += Number(question.time);
      });
      await setTime(total);
      await setLoadCounter(1);

      if (json.active !== null) {
        await setButtonText('Stop Game');
        await setButtonVariant('secondary');
        setSuccessMessage('');
      } else {
        await setButtonText('Start Game');
        await setButtonVariant('success');
      }
    }
  }

  React.useEffect(() => {
    loadVariables();
  });

  return (
    <>
      <Card className="gameCardDashboard" key={id}>
        <Card.Header>
          <Button variant="primary" className="fontAwesomeButton" onClick={redirectEditGame}>
            <FontAwesomeIcon icon={faEdit} aria-label="edit game button" />
          </Button>
          <Button variant="danger" className="fontAwesomeButton" onClick={() => setDeleteGameModal('yes')}>
            <FontAwesomeIcon icon={faTrashAlt} aria-label="delete game button" />
          </Button>
        </Card.Header>
        <Card.Img variant="top" className="card-img" src={thumbnail} aria-label="thumbnail image for game" />
        <Card.Body>
          <Card.Title>{name}</Card.Title>
          {questionLength === 0 && (
            <Card.Text>
              There are no questions in this quiz.
            </Card.Text>
          )}
          {questionLength === 1 && (
            <Card.Text>
              There is 1 question in this quiz.
              {'\n'}
              It takes
              {' '}
              {time}
              {' '}
              seconds to complete the entire quiz.
            </Card.Text>
          )}
          {questionLength !== 1 && questionLength !== 0 && (
            <Card.Text>
              There are
              {' '}
              {questionLength}
              {' '}
              questions in this quiz.
              {'\n'}
              It takes
              {' '}
              {time}
              {' '}
              seconds to complete the entire quiz.
            </Card.Text>
          )}

          <ModalWindow type="delete_game" modalMessage={deleteGameModal} quizId={id} />
          <ModalWindow type="start_game" modalMessage={joinLink} quizId={id} sessionId={sessionId} />
          <ModalWindow type="stop_game" modalMessage={successMessage} />
          <ModalWindow type="error" modalMessage={errorMessage} />
          {questionLength !== 0
            && <Button variant={buttonVariant} onClick={gameFunction}>{buttonText}</Button>}
        </Card.Body>
      </Card>
    </>
  );
}

GameCard.propTypes = {
  thumbnail: PropTypes.string,
  name: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
};

GameCard.defaultProps = {
  thumbnail: null,
};

export default GameCard;
