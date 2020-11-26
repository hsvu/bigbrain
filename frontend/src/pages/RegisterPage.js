import React from 'react';
import { useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import NavigationBar from '../components/NavigationBar';
import ModalWindow from '../components/ModalWindow';
import '../css/Form.css';
import '../css/index.css';

// TODO TRY TO MAKE THIS GLOBAL ACROSS ALL FILES
const host = 'http://localhost:5005';

function RegisterPage() {
  const [email, setEmail] = React.useState('');
  const [passwordOne, setPasswordOne] = React.useState('');
  const [passwordTwo, setPasswordTwo] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [successMessage, setSuccessMessage] = React.useState('');
  const history = useHistory();

  async function processRegister(event) {
    event.preventDefault();
    try {
      const requestOptions = {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      };
      const response = await fetch(`${host}/admin/auth/register`, requestOptions);
      if (!response.ok) {
        setErrorMessage('Email is already in our system. Please use a different email.');
        setEmail('');
        setPassword('');
        setPasswordOne('');
        setPasswordTwo('');
        setName('');
        return;
      }
      const json = await response.json();
      localStorage.setItem('token', json.token);
      setSuccessMessage('Account successfully created.');
    } catch (e) {
      setErrorMessage('Please try again.');
    }
  }

  function recordEmail(event) {
    event.preventDefault();
    setEmail(event.target.value);
  }

  function recordPasswordOne(event) {
    event.preventDefault();
    setPasswordOne(event.target.value);
    setErrorMessage('');
  }

  function recordPasswordTwo(event) {
    event.preventDefault();
    setPasswordTwo(event.target.value);
    setErrorMessage('');
  }

  function validatePassword(event) {
    event.preventDefault();
    if (passwordOne === passwordTwo) {
      setPassword(event.target.value);
      setErrorMessage('');
    } else {
      setErrorMessage('Passwords do not match!');
    }
  }

  function recordName(event) {
    event.preventDefault();
    setName(event.target.value);
  }

  React.useEffect(() => {
    if (localStorage.getItem('token') !== null) {
      history.push('/dashboard');
    }
  }, [history]);

  return (
    <div>
      <NavigationBar />
      <div className="window">
        <main className="middle">
          <h1>Registration Page</h1>
          {'\n'}
          <Form onSubmit={processRegister}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" value={email} placeholder="example@domain.com" onChange={recordEmail} required />
              <Form.Text className="text-muted">We&apos;ll never share your email with anyone else.</Form.Text>
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" value={passwordOne} placeholder="Password" onChange={recordPasswordOne} required />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control type="password" value={passwordTwo} placeholder="Password" onChange={recordPasswordTwo} onBlur={validatePassword} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" value={name} placeholder="Name" onChange={recordName} required />
            </Form.Group>
            <Button variant="info" type="submit">Submit</Button>
          </Form>
          {'\n'}
          <ModalWindow type="error" modalMessage={errorMessage} />
          <ModalWindow type="success" modalMessage={successMessage} />
        </main>
      </div>
    </div>
  );
}

export default RegisterPage;
