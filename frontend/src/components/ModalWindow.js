import React from 'react';
import { useHistory } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import PropTypes from 'prop-types';
import '../css/FontAwesome.css';

const host = 'http://localhost:5005';

function ModalWindow({
  type, quizId, modalMessage, sessionId, questionId,
}) {
  const [show, setShow] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const history = useHistory();

  function makeInvisible() {
    setShow(false);
    setMessage('');
  }

  function redirectDashboard() {
    makeInvisible();
    history.push('/dashboard');
  }

  function redirectEditGame() {
    makeInvisible();
    history.push(`/edit_game/${quizId}`);
  }

  function redirectStartGameAdmin() {
    makeInvisible();
    history.push(`/run_game/${quizId}/${sessionId}/`);
  }

  function copyToClipboard(event) {
    event.target.select();
    document.execCommand('copy');
    setMessage('Successfully copied to clipboard!');
  }

  async function deleteGame(event) {
    event.preventDefault();
    makeInvisible();
    try {
      const requestOptions = {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
      await fetch(`${host}/admin/quiz/${quizId}`, requestOptions);
      window.location.reload();
    } catch (e) {
      setMessage(e);
    }
  }

  async function deleteQuestion(event) {
    event.preventDefault();
    try {
      // getting the details of the quiz
      const requestOptions = {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
      const res = await fetch(`${host}/admin/quiz/${quizId}`, requestOptions);
      const json = await res.json();

      const { questions } = json;
      questions.splice(questionId, 1);

      // updating details of quiz without the question in the question array
      const putRequestOptions = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          questions,
          name: `${json.name}`,
          thumbnail: `${json.thumbnail}`,
        }),
      };
      const putRes = await fetch(`${host}/admin/quiz/${quizId}`, putRequestOptions);
      if (putRes.ok) {
        window.location.reload();
      }
    } catch (e) {
      setMessage(e);
    }
  }

  React.useEffect(() => {
    if (type === 'error' || type === 'success'
    || type === 'success_question' || type === 'stop_game'
    || type === 'start_game' || type === 'delete_game' || type === 'delete_question') {
      setShow(!!modalMessage);
    }
  }, [type, modalMessage]);

  return (
    <>
      {type === 'delete_game' && (
        <div>
          <Modal show={show} onHide={makeInvisible}>
            <Modal.Header aria-label="close button" closeButton>
              <Modal.Title>Are you sure?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              This action will permanently delete your game.
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={makeInvisible}>
                No thanks. I think I want to keep my game.
              </Button>
              <Button variant="danger" onClick={deleteGame}>
                That&apos;s fine. Delete it forever!
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}

      {type === 'delete_question' && (
        <div>
          <Modal show={show} onHide={makeInvisible}>
            <Modal.Header aria-label="close button" closeButton>
              <Modal.Title>Are you sure?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              This action will permanently delete your question.
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={makeInvisible}>
                No thanks. I think I want to keep my question.
              </Button>
              <Button variant="danger" onClick={deleteQuestion}>
                That&apos;s fine. Delete it forever!
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}

      {type === 'error' && (
        <div>
          <Modal show={show} onHide={makeInvisible}>
            <Modal.Header aria-label="close button" closeButton>
              <Modal.Title>Something&apos;s wrong!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {modalMessage}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={makeInvisible}>
                Got it!
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}

      {type === 'success' && (
        <div>
          <Modal show={show} onHide={makeInvisible}>
            <Modal.Header aria-label="close button" closeButton>
              <Modal.Title>You did it!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {modalMessage}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="success" onClick={redirectDashboard}>
                Cool!
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}

      {type === 'success_question' && (
        <div>
          <Modal show={show} onHide={makeInvisible}>
            <Modal.Header aria-label="close button" closeButton>
              <Modal.Title>You did it!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {modalMessage}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="success" onClick={redirectEditGame}>
                Cool!
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}

      {type === 'start_game' && (
        <div>
          <Modal show={show} onHide={makeInvisible}>
            <Modal.Header aria-label="close button" closeButton>
              <Modal.Title>Session started!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Control type="text" value={modalMessage} onClick={copyToClipboard} readOnly />
              </Form>
              {message}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="success" onClick={redirectStartGameAdmin}>
                Bring Me To The Game!
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}

      {type === 'stop_game' && (
        <div>
          <Modal show={show} onHide={makeInvisible}>
            <Modal.Header aria-label="close button" closeButton>
              <Modal.Title>Session ended!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {modalMessage}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="dark" onClick={makeInvisible}>
                Got it!
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}

    </>
  );
}

ModalWindow.propTypes = {
  type: PropTypes.string.isRequired,
  quizId: PropTypes.number,
  modalMessage: PropTypes.string,
  sessionId: PropTypes.number,
  questionId: PropTypes.number,
};

ModalWindow.defaultProps = {
  quizId: -1,
  modalMessage: '',
  sessionId: -1,
  questionId: -1,
};

export default ModalWindow;
