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

function LoginPage() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const history = useHistory();

  async function processLogin(event) {
    event.preventDefault();
    try {
      const requestOptions = {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      };
      const response = await fetch(`${host}/admin/auth/login`, requestOptions);
      if (!response.ok) {
        setErrorMessage('Email and password do not match!');
        setEmail('');
        setPassword('');
        return;
      }
      const json = await response.json();
      localStorage.setItem('token', json.token);
      history.push('/dashboard');
    } catch (e) {
      setErrorMessage('Please try again.');
    }
  }

  function recordEmail(event) {
    event.preventDefault();
    setEmail(event.target.value);
    setErrorMessage('');
  }

  function recordPassword(event) {
    event.preventDefault();
    setPassword(event.target.value);
    setErrorMessage('');
  }

  React.useEffect(() => {
    if (localStorage.getItem('token') !== null && localStorage.getItem('token') !== 'undefined') {
      history.push('/dashboard');
    }
  }, [history]);

  return (
    <div>
      <NavigationBar />
      <div className="window">
        <main className="middle">
          <h1>Login Page</h1>
          {'\n'}
          <Form onSubmit={processLogin}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" value={email} placeholder="example@domain.com" onChange={recordEmail} required />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" value={password} placeholder="Password" onChange={recordPassword} required />
            </Form.Group>
            <Button variant="info" type="submit">Submit</Button>
          </Form>
          {'\n'}
          <ModalWindow type="error" modalMessage={errorMessage} />
        </main>
      </div>
    </div>
  );
}

export default LoginPage;
