import React from 'react';
import { useHistory } from 'react-router-dom';
// import styled from 'styled-components';
import Card from 'react-bootstrap/Card';
import CardDeck from 'react-bootstrap/CardDeck';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import ModalWindow from './ModalWindow';
import '../css/GameCard.css';

function EditQuestionCard({
  question, gameId, answers, correctAns, questionId,
}) {
  const history = useHistory();
  const [deleteQuestionMessage, setDeleteQuestionMessage] = React.useState('');

  function redirectEditQuestion(event) {
    event.preventDefault();
    history.push(`/edit_question/${gameId}/${questionId}`);
  }

  return (
    <>
      <CardDeck>
        <Card key={questionId}>
          <Card.Header>
            {question}
            <Button variant="primary" className="fontAwesomeButton" onClick={redirectEditQuestion}>
              <FontAwesomeIcon icon={faEdit} aria-label="edit question button" />
            </Button>
            <Button variant="danger" className="fontAwesomeButton" onClick={() => setDeleteQuestionMessage('yes')}>
              <FontAwesomeIcon icon={faTrashAlt} aria-label="delete question button" />
            </Button>
          </Card.Header>
          <Card.Body>
            <Card.Text>
              <h5>Options</h5>
              {answers.filter((value) => value !== null).map((ans) => (
                <p key={ans.id}>{ans}</p>
              ))}
              <Card border="success" bg="correct">
                <Card.Body>
                  <Card.Text>
                    <h5>Answers</h5>
                    {correctAns.filter((value) => value !== null).map((ansIndex) => (
                      <p key={ansIndex.id}>{answers[ansIndex]}</p>
                    ))}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Card.Text>
            <ModalWindow type="delete_question" quizId={gameId} questionId={questionId} modalMessage={deleteQuestionMessage} />
          </Card.Body>
        </Card>
      </CardDeck>
    </>
  );
}

EditQuestionCard.propTypes = {
  question: PropTypes.string.isRequired,
  answers: PropTypes.arrayOf(PropTypes.string).isRequired,
  correctAns: PropTypes.arrayOf(PropTypes.string).isRequired,
  questionId: PropTypes.number.isRequired,
  gameId: PropTypes.string.isRequired,
};
//
// EditQuestionCard.defaultProps = {
//   thumbnail: null,
// };

export default EditQuestionCard;
