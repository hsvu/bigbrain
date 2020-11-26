import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import bsCustomFileInput from 'bs-custom-file-input';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import NavigationBar from '../components/NavigationBar';
import EditQuestionCard from '../components/EditQuestionCard';
import ModalWindow from '../components/ModalWindow';
import '../css/Form.css';
import '../css/index.css';

const host = 'http://localhost:5005';

function EditGame() {
  const [name, setName] = React.useState('');
  const [thumbnail, setThumbnail] = React.useState('');
  const [questions, setQuestions] = React.useState([]);
  const [successMessage, setSuccessMessage] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [loadCounter, setLoadCounter] = React.useState(0);
  const history = useHistory();
  const { id } = useParams();

  async function processEditGame(event) {
    event.preventDefault();
    try {
      const requestOptions = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ questions, name, thumbnail }),
      };
      await fetch(`${host}/admin/quiz/${id}`, requestOptions);
      setSuccessMessage('Your quiz has been successfully updated.');
    } catch (e) {
      setErrorMessage(e);
    }
  }

  function recordName(event) {
    event.preventDefault();
    setName(event.target.value);
  }

  function recordThumbnail(event) {
    event.preventDefault();
    const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const fileType = event.target.files[`${event.target.files.length - 1}`].type;
    const valid = validFileTypes.find((type) => type === fileType);
    if (valid) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[`${event.target.files.length - 1}`]);
      reader.onload = (e) => { setThumbnail(e.target.result); };
      setErrorMessage('');
    } else {
      setErrorMessage('This image type isn&apos;t valid! Please try again.');
    }
  }

  async function loadQuestions() {
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
        await setName(json.name);
        if (json.thumbnail === null) {
          await setThumbnail(null);
        } else {
          await setThumbnail(json.thumbnail);
        }
        await setQuestions(json.questions);
      }
    } catch (e) {
      setErrorMessage(e);
    }
  }

  function initialLoading() {
    if (loadCounter === 0) {
      loadQuestions();
      setLoadCounter(1);
      bsCustomFileInput.init();
    }
  }

  async function redirectAddQuestion(event) {
    event.preventDefault();
    try {
      const questionId = Number(`${questions.length + 1}`);
      history.push(`/add_question/${id}/${questionId}`);
    } catch (e) {
      setErrorMessage(e);
    }
  }

  React.useEffect(() => {
    initialLoading();
  });

  return (
    <div>
      <NavigationBar />
      <div className="window">
        <main className="middle">
          <h1>Edit Game</h1>
          {'\n'}
          <Form onSubmit={processEditGame}>
            <Form.Group>
              <Form.Label>Game ID</Form.Label>
              <Form.Control value={id} disabled />
            </Form.Group>
            <Form.Group>
              <Form.Label>Update Name</Form.Label>
              <Form.Control type="text" defaultValue={name} onChange={recordName} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Update Thumbnail</Form.Label>
              <Form.File type="file" label="Upload Image..." onChange={recordThumbnail} custom />
            </Form.Group>
            <Button variant="info" type="submit">Submit</Button>
          </Form>
          <br />
          <h2>Questions</h2>
          <Button variant="secondary" onClick={redirectAddQuestion}>Add Question</Button>
          <br />
          {questions.map((data, num) => (
            <>
              <EditQuestionCard
                question={data.question}
                answers={data.answers}
                correctAns={data.correctAns}
                gameId={id}
                questionId={num}
              />
              <br />
            </>
          ))}
          <ModalWindow type="success" modalMessage={successMessage} />
          <ModalWindow type="error" modalMessage={errorMessage} />
        </main>
      </div>
    </div>
  );
}

export default EditGame;
