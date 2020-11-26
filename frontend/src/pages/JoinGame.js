import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import NavigationBar from '../components/NavigationBar';
import ModalWindow from '../components/ModalWindow';
import '../css/Form.css';
import '../css/index.css';

// TODO TRY TO MAKE THIS GLOBAL ACROSS ALL FILES
const host = 'http://localhost:5005';

function JoinGame() {
  const [name, setName] = React.useState('');
  const [gameID, setGameID] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const { sessionId } = useParams();
  const [disabled, setDisabled] = React.useState(false);
  const history = useHistory();

  async function processJoinGame(event) {
    event.preventDefault();
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    };
    const response = await fetch(`${host}/play/join/${gameID}`, requestOptions);
    const json = await response.json();
    if (!response.ok) {
      setErrorMessage(json.error);
    } else {
      localStorage.setItem('playerID', json.playerId);
      history.push(`/play_game/${sessionId}/${json.playerId}`);
    }
  }

  function recordName(event) {
    event.preventDefault();
    // checkUniqueName(event.target.value);
    setName(event.target.value);
    setErrorMessage('');
  }

  function recordGameID(event) {
    event.preventDefault();
    setGameID(event.target.value);
    setErrorMessage('');
  }

  React.useEffect(() => {
    if (sessionId) {
      setGameID(sessionId);
      setDisabled(true);
    }
  }, [sessionId]);

  return (
    <div>
      <NavigationBar />
      <div className="window">
        <div className="middle">
          <h1>Welcome to BigBrain!</h1>
          {'\n'}
          <Form onSubmit={processJoinGame}>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" value={name} placeholder="Name" onChange={recordName} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Session ID</Form.Label>
              <Form.Control type="text" value={gameID} placeholder="Session ID" onChange={recordGameID} disabled={disabled} required />
            </Form.Group>
            <Button variant="info" type="submit">Submit</Button>
          </Form>
          {'\n'}
          <ModalWindow type="error" modalMessage={errorMessage} />
        </div>
      </div>
    </div>
  );
}

export default JoinGame;
