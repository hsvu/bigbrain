import React from 'react';
import { useHistory } from 'react-router-dom';
import CardDeck from 'react-bootstrap/CardDeck';
import GameCard from '../components/GameCard';
import NavigationBar from '../components/NavigationBar';
import ModalWindow from '../components/ModalWindow';
import '../css/Dashboard.css';
import '../css/index.css';

const host = 'http://localhost:5005';

function Dashboard() {
  const [games, setGames] = React.useState([]);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [n, setN] = React.useState(3);
  const [width, setWidth] = React.useState(window.innerWidth);
  const history = useHistory();

  async function loadDashBoard() {
    try {
      const getQuizRequestOptions = {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
      const response = await fetch(`${host}/admin/quiz`, getQuizRequestOptions);
      if (!response.ok) {
        setErrorMessage('Please try again.');
        return;
      }
      const json = await response.json();
      setGames([...json.quizzes]);
    } catch (e) {
      setErrorMessage(e);
    }
  }

  React.useEffect(() => {
    function validateUser() {
      if (localStorage.getItem('token') === null || localStorage.getItem('token') === 'undefined') {
        history.push('/');
      }
    }
    validateUser();
    loadDashBoard();
    // changing how many cols depending on screen size
    window.addEventListener('resize', () => setWidth(window.innerWidth));
    if (width < 600) {
      setN(1);
    } else if (width < 1000) {
      setN(2);
    } else {
      setN(3);
    }
  }, [history, width]);

  // partly taken from https://stackoverflow.com/questions/38048497/group-array-values-in-group-of-3-objects-in-each-array-using-underscore-js
  function groupArr(data) {
    const group = [[]];

    for (let i = 0, j = 0; i < data.length; i += 1) {
      if (i >= n && i % n === 0) {
        j += 1;
        group.push([]);
      }
      group[j].push(data[i]);
    }
    return group;
  }

  return (
    <div>
      <NavigationBar />
      <main className="dashboardMainDiv">
        {groupArr(games).map((data) => (
          <>
            <CardDeck>
              {data.map((card) => (
                <GameCard
                  thumbnail={card.thumbnail}
                  name={card.name}
                  key={card.id}
                  id={card.id}
                />
              ))}
            </CardDeck>
            <br />
          </>
        ))}
      </main>
      <ModalWindow type="error" modalMessage={errorMessage} />
    </div>
  );
}

export default Dashboard;
