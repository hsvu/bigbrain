/* eslint-disable */
import { shallow } from 'enzyme';
import React from 'react';
import GameCard from './components/GameCard';
import EditQuestionCard from './components/EditQuestionCard';
import NavigationBar from './components/NavigationBar';

describe ('<GameCard />', () => {
  it('renders inner card', () => {
    const wrapper = shallow(<GameCard thumbnail='thumbnail' name='name' id={0} />);
    expect(wrapper.find('.gameCardDashboard')).toBeDefined();
  });

  it('renders Card Header', () => {
    const wrapper = shallow(<GameCard thumbnail='thumbnail' name='name' id={0} />);
    expect(wrapper.find('.gameCardDashboard')).toBeDefined();
    const gameCard = wrapper.find('.gameCardDashboard');
    const header = gameCard.find('CardHeader');
    expect(header).toBeDefined();
    // have two buttons
    expect(header.find('Button')).toHaveLength(2);
  });

  it('renders Card Image', () => {
    const wrapper = shallow(<GameCard thumbnail='thumbnail' name='name' id={0} />);
    const gameCard = wrapper.find('.gameCardDashboard');
    const image = gameCard.find('CardImg');
    expect(image).toBeDefined();
    // Image properties
    expect(image.prop('src')).toEqual('thumbnail');
    expect(image.prop('aria-label')).toEqual('thumbnail image for game');
    expect(image.prop('className')).toEqual('card-img');
  });

  it('Card Image wont have src if not provided', () => {
    const wrapper = shallow(<GameCard name='name' id={0} />);
    const gameCard = wrapper.find('.gameCardDashboard');
    const image = gameCard.find('CardImg');
    expect(image).toBeDefined();
    // Image properties
    expect(image.prop('src')).toEqual(null);
    expect(image.prop('aria-label')).toEqual('thumbnail image for game');
    expect(image.prop('className')).toEqual('card-img');
  });

  it('renders Card Body', () => {
    const wrapper = shallow(<GameCard thumbnail='thumbnail' name='name' id={0} />);
    const gameCard = wrapper.find('.gameCardDashboard');
    const body = gameCard.find('CardBody');
    expect(body).toBeDefined();
    // text defined
    expect(body.find('CardText')).toBeDefined();
    // ensure only one set of text is defined
    expect(body.find('CardText')).toHaveLength(1);
    // modal windows x 4
    expect(body.find('ModalWindow')).toBeDefined();
    expect(body.find('ModalWindow')).toHaveLength(4);
  });
});

describe ('<EditQuestionCard />', () => {
  const noop = () => {};
  const question = 'What is your fave color?';
  const answers = ['blue', 'red', 'yellow', 'green'];
  const correctAns = ['blue', 'red', 'yellow', 'green'];
  const gameId = '123';
  const questionId = 1;
  const wrapper = shallow(<EditQuestionCard
    question={question}
    answers={answers}
    correctAns={correctAns}
    gameId={gameId}
    questionId={questionId}
    key={gameId}
    />);

  it('renders inner CardDeck and Card', () => {
    const deck = wrapper.find('CardDeck');
    expect(deck).toBeDefined();
    const card = deck.find('Card');
    expect(card).toBeDefined();
  });

  it('renders question', () => {
    const deck = wrapper.find('CardDeck');
    const card = deck.find('Card');
    const header = card.find('CardHeader');
    expect(header.text()).toContain(question);
  });

  it('renders options and correct answers', () => {
    const deck = wrapper.find('CardDeck');
    const card = deck.find('Card');
    const body = card.find('CardBody');
    const text = body.find('CardText');
    expect(text.find('p')).toHaveLength(answers.length + correctAns.length);
  });

});

describe ('<NavigationBar />', () => {
  const noop = () => {};
  const wrapper = shallow(<NavigationBar />);
  const navBar = wrapper.find('Navbar');

  it('renders only one navBar depending on authorisation', () => {
    expect(navBar).toBeDefined();
    expect(navBar).toHaveLength(1);
  });

  it('Brand is correct', () => {
    expect(navBar.find('NavbarBrand').text()).toBe('BigBrain!');
  });

  it('Correct number/type of buttons', () => {
    const buttons = navBar.find('Button');
    expect(buttons).toBeDefined();
    if (buttons.length === 2) {
      expect(buttons.find('.registerButton')).toBeDefined();
      expect(buttons.find('.loginButton')).toBeDefined();
    } else if (buttons.length === 1) {
      expect(buttons.find('.logoutButton')).toBeDefined();
    }
  });
});
