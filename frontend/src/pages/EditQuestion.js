import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import NavigationBar from '../components/NavigationBar';
import ModalWindow from '../components/ModalWindow';
import '../css/Form.css';
import '../css/index.css';

const host = 'http://localhost:5005';

function EditQuestion() {
  const [name, setName] = React.useState('');
  const [thumbnail, setThumbnail] = React.useState(null);
  const [question, setQuestion] = React.useState('');
  const [answers, setAnswers] = React.useState([]);
  const [correctAns, setCorrectAns] = React.useState([]);
  const [type, setType] = React.useState('');
  const [link, setLink] = React.useState('');
  const [time, setTime] = React.useState(10);
  const [points, setPoints] = React.useState(1);
  const [loadCounter, setLoadCounter] = React.useState(0);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [successMessage, setSuccessMessage] = React.useState('');
  const history = useHistory();
  const { id, questionId } = useParams();

  async function processEditQuestion(event) {
    event.preventDefault();
    try {
      if (correctAns.length === 0) {
        await setErrorMessage('At least one of the provided answers has to be correct.');
        return;
      }

      if (answers[0] === null || answers[1] === null) {
        await setErrorMessage('You need at least 2 answers.');
        return;
      }

      const requestOptions = {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
      const res = await fetch(`${host}/admin/quiz/${id}`, requestOptions);
      const json = await res.json();

      const { questions } = json;
      const newQuestion = {
        type, question, link, time, points, answers, correctAns,
      };
      questions[questionId] = newQuestion;

      const putRequestOptions = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ questions, name, thumbnail }),
      };
      const putRes = await fetch(`${host}/admin/quiz/${id}`, putRequestOptions);
      if (putRes.ok) {
        setSuccessMessage('You changed your question');
        history.push(`/edit_game/${id}`);
      } else {
        setErrorMessage('Something went wrong with the request. Please try again.');
      }
    } catch (e) {
      setErrorMessage(e);
    }
  }

  function recordQuestion(event) {
    event.preventDefault();
    setQuestion(event.target.value);
    setErrorMessage('');
  }

  function recordAnswers(event, num) {
    if (event.target.value.trim() !== '') {
      answers[num] = event.target.value;
    } else {
      answers[num] = null;
    }
    setErrorMessage('');
    setAnswers(answers);
  }

  function recordCorrectAnswers(event, num) {
    if (type === 'Multiple Answers') {
      if (event.target.checked && answers[num] != null) {
        setCorrectAns([...correctAns, num]);
      } else if (!event.target.checked && answers[num] != null) {
        // need to remove from correctAns
        setCorrectAns(correctAns.filter((value) => value !== num));
      }
    } else if (event.target.checked && answers[num] != null) {
      // if type === 'Single Answer', just replace correctAns
      setCorrectAns([num]);
    }
    setErrorMessage('');
  }

  function recordType(event) {
    setType(event.target.value);
    setErrorMessage('');
  }

  function recordLink(event) {
    event.preventDefault();
    setLink(event.target.value);
    setErrorMessage('');
  }

  function recordTime(event) {
    event.preventDefault();
    setTime(event.target.value);
    setErrorMessage('');
  }

  function recordPoints(event) {
    event.preventDefault();
    setPoints(event.target.value);
    setErrorMessage('');
  }

  async function loadQuestion() {
    try {
      const requestOptions = {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
      const response = await fetch(`${host}/admin/quiz/${id}`, requestOptions);
      if (response.ok) {
        const json = await response.json();
        const questionData = json.questions[questionId];
        await setName(json.name);
        await setQuestion(questionData.question);
        await setAnswers(questionData.answers);
        await setCorrectAns(questionData.correctAns);
        await setLink(questionData.link);
        await setTime(questionData.time);
        await setType(questionData.type);
        await setPoints(questionData.points);
        if (json.thumbnail !== 'null') {
          await setThumbnail(json.thumbnail);
        }
      }
    } catch (e) {
      setErrorMessage(e);
    }
  }

  function initialLoading() {
    if (loadCounter === 0) {
      loadQuestion();
      setLoadCounter(1);
    }
  }

  function redirectEditGame(event) {
    event.preventDefault();
    history.push(`/edit_game/${id}`);
  }

  React.useEffect(() => {
    initialLoading();
  });

  return (
    <div>
      <NavigationBar />
      <div className="window">
        <main className="middle">
          <Button variant="outline-secondary" onClick={redirectEditGame}>Go Back to Edit Game</Button>
          <h1>Edit Question</h1>
          {'\n'}
          <Form onSubmit={processEditQuestion}>
            <Form.Group>
              <Form.Label>Question Type</Form.Label>
              <Form.Control as="select" value={type} onChange={recordType} required>
                <option>Multiple Answers</option>
                <option>Single Answer</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Add Question</Form.Label>
              <Form.Control as="textarea" row={3} value={question} onChange={recordQuestion} required />
            </Form.Group>
            <Form.Group>
              <Form.Row>
                <Col>
                  <Form.Label>Time Limit (seconds)</Form.Label>
                  <Form.Control type="number" value={time} min={10} max={60} onChange={recordTime} required />
                </Col>
                <Col>
                  <Form.Label>Points</Form.Label>
                  <Form.Control type="number" value={points} min={1} max={10} onChange={recordPoints} required />
                </Col>
              </Form.Row>
            </Form.Group>
            <Form.Group>
              <Form.Label>URL/YouTube Link</Form.Label>
              <Form.Control type="text" value={link} onChange={recordLink} />
              <Form.Text muted>
                Optional link to enhance the question.
              </Form.Text>
            </Form.Group>

            {type === 'Multiple Answers'
              && (
                <Form.Group>
                  <Form.Label>Answers (Tick all correct answers)</Form.Label>
                  {answers.map((value, num) => (
                    <InputGroup className="mb-3">
                      <InputGroup.Prepend>
                        <InputGroup.Checkbox aria-label="Checkbox for following text input" defaultChecked={correctAns.includes(num)} onClick={(e) => recordCorrectAnswers(e, num)} />
                      </InputGroup.Prepend>
                      <Form.Control aria-label="Text input with checkbox" defaultValue={value} placeholder="Answer..." onChange={(e) => recordAnswers(e, num)} />
                    </InputGroup>
                  ))}
                </Form.Group>
              )}

            {type === 'Single Answer'
              && (
                <Form.Group>
                  <Form.Label>Answers (Tick one correct answer)</Form.Label>
                  {answers.map((value, num) => (
                    <InputGroup className="mb-3">
                      <InputGroup.Prepend>
                        <InputGroup.Radio name="radioOptions" defaultChecked={correctAns.includes(num)} aria-label="Radio Button for following text input" onClick={(e) => recordCorrectAnswers(e, num)} />
                      </InputGroup.Prepend>
                      <Form.Control aria-label="Text input with radio button" defaultValue={value} placeholder="Answer..." onChange={(e) => recordAnswers(e, num)} />
                    </InputGroup>
                  ))}

                </Form.Group>
              )}
            <ModalWindow type="error" modalMessage={errorMessage} />
            <ModalWindow type="success_question" modalMessage={successMessage} />
            <Button variant="info" type="submit">Change Question</Button>
          </Form>
          {'\n'}
        </main>
      </div>
    </div>
  );
}

export default EditQuestion;
