import React from 'react';
// import { useHistory } from 'react-router-dom';
// import styled from 'styled-components';
// import Card from 'react-bootstrap/Card';
// import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
// import ModalWindow from './ModalWindow';
// import '../css/GameScreenAdmin.css';

// const host = 'http://localhost:5005';

function GameScreenAdmin({
  position,
  question,
  link,
  answers,
}) {
  return (
    <>
      <h1>
        Question
        {' '}
        {position + 1}
      </h1>
      <p>
        Useful link:
        {link}
      </p>
      <br />
      <h2>{question}</h2>
      <br />
      <h3>Options:</h3>
      {answers.map((ans) => (
        <h4>{ans}</h4>
      ))}
    </>
  );
}

GameScreenAdmin.propTypes = {
  question: PropTypes.string.isRequired,
  position: PropTypes.number.isRequired,
  link: PropTypes.string.isRequired,
  answers: PropTypes.arrayOf(PropTypes.string).isRequired,
};
// GameScreenAdmin.defaultProps = {
//   thumbnail: null,
// };

export default GameScreenAdmin;
