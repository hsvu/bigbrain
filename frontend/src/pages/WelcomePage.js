import React from 'react';
import { useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import NavigationBar from '../components/NavigationBar';
import '../css/index.css';
import '../css/WelcomePage.css';

function WelcomePage() {
  const history = useHistory();

  function redirectJoinGame(event) {
    event.preventDefault();
    history.push('/join');
  }

  function redirectLoginPage(event) {
    event.preventDefault();
    history.push('/login');
  }

  function redirectRegisterPage(event) {
    event.preventDefault();
    history.push('/register');
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
          <h1>Welcome to</h1>
          <h1 className="big-text">BigBrain!</h1>
          <Button variant="outline-info" onClick={redirectLoginPage}>Login</Button>
          <Button variant="outline-info" onClick={redirectRegisterPage}>Register an account</Button>
          <Button variant="outline-info" onClick={redirectJoinGame}>Join a game</Button>
        </main>
      </div>
    </div>
  );
}

export default WelcomePage;
