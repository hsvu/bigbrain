import React from 'react';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
// import Form from 'react-bootstrap/Form';
import { useHistory } from 'react-router-dom';
import '../css/NavigationBar.css';

const host = 'http://localhost:5005';

function NavigationBar() {
  const history = useHistory();
  const [errorMessage, setErrorMessage] = React.useState('');
  const [authorised, setAuthorised] = React.useState(false);

  async function processLogout() {
    try {
      const requestOptions = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
      await fetch(`${host}/admin/auth/logout`, requestOptions);
      history.push('/login');
      localStorage.clear();
      window.location.reload();
    } catch (e) {
      setErrorMessage(e);
    }
  }

  function redirectDashboard(event) {
    event.preventDefault();
    history.push('/dashboard');
  }

  function redirectCreateGame(event) {
    event.preventDefault();
    history.push('/create_game');
  }

  function redirectLoginPage(event) {
    event.preventDefault();
    history.push('/login');
  }

  function redirectRegisterPage(event) {
    event.preventDefault();
    history.push('/register');
  }

  function redirectJoinGame(event) {
    event.preventDefault();
    history.push('/join');
  }

  function redirectMain(event) {
    event.preventDefault();
    history.push('/');
  }

  React.useEffect(() => {
    if (localStorage.getItem('token')) {
      setAuthorised(true);
    }
  }, []);

  return (
    <div>
      {authorised && (
        <Navbar bg="light" expand="lg">
          <Navbar.Brand>BigBrain!</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link onClick={redirectDashboard}>Dashboard</Nav.Link>
              <Nav.Link onClick={redirectCreateGame}>Create New Game</Nav.Link>
            </Nav>
            <Button variant="outline-info" type="button" className="logoutButton" onClick={processLogout}>Logout</Button>
          </Navbar.Collapse>
        </Navbar>
      )}
      {!authorised && (
        <Navbar bg="light" expand="lg">
          <Navbar.Brand onClick={redirectMain}>BigBrain!</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link onClick={redirectJoinGame}>Join a game</Nav.Link>
            </Nav>
            <Button variant="outline-info" type="button" className="registerButton" onClick={redirectRegisterPage}>Register</Button>
            <Button variant="outline-info" type="button" className="loginButton" onClick={redirectLoginPage}>Login</Button>
          </Navbar.Collapse>
        </Navbar>
      )}
      {errorMessage}
    </div>
  );
}

export default NavigationBar;
