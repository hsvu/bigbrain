import React from 'react';
import { BrowserRouter as Switch, Route } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import JoinGame from './pages/JoinGame';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import EditGame from './pages/EditGame';
import AddQuestion from './pages/AddQuestion';
import EditQuestion from './pages/EditQuestion';
import CreateGame from './pages/CreateGame';
import PlayGameUser from './pages/PlayGameUser';
import RunGameAdmin from './pages/RunGameAdmin';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/App.css';

function App() {
  return (
    <Switch>
      <Route exact path="/" component={WelcomePage} />
      <Route exact path="/join/:sessionId" component={JoinGame} />
      <Route exact path="/join" component={JoinGame} />
      <Route path="/play_game/:sessionId/:userId" component={PlayGameUser} />
      <Route path="/run_game/:gameId/:sessionId" component={RunGameAdmin} />
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/edit_game/:id" component={EditGame} />
      <Route path="/add_question/:id/:question_id" component={AddQuestion} />
      <Route path="/create_game" component={CreateGame} />
      <Route path="/edit_question/:id/:questionId" component={EditQuestion} />
    </Switch>
  );
}

export default App;
