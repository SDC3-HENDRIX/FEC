import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import AnswerListEntry from './AnswerListEntry';

class AnswerList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      entries: [],
    };
    this.sortAnswers = this.sortAnswers.bind(this);
    this.arrangeAnswers = this.arrangeAnswers.bind(this);
    this.renderAnswers = this.renderAnswers.bind(this);
  }

  componentDidMount() {
    // update state with properly arranged answers
    this.arrangeAnswers();
  }

  // Sort answers by most helpful and add them to state
  sortAnswers(answerList) {
    const sortedAnswerList = _.sortBy(answerList, 'helpfulness');
    // Reverse the order of the answers so the most helpful is first
    this.setState({ entries: [...sortedAnswerList.reverse()] });
  }

  // Take answers from props, arrange them so Seller's answers appear first then sort answers
  arrangeAnswers() {
    const { answers } = this.props;
    // Sort array of answer objects by their value for helpfulness property
    if (answers) {
      // filter all answers authored by 'Seller' to seperate arrays
      const sellerAnswers = answers.filter((answer) => answer.answerer_name === 'Seller');
      const buyerAnswers = answers.filter((answer) => answer.answerer_name !== 'Seller');

      // sort both arrays
      // push Seller's answers first so they are at the front of the array
      this.sortAnswers(sellerAnswers);
      this.sortAnswers(buyerAnswers);
    }
  }

  // Convert entries in state into <AnswerListEntry />s to be rendered
  renderAnswers() {
    const { entries } = this.state;
    return entries.map(
      (answer) => <AnswerListEntry answer={answer} key={answer.id} />,
    );
  }

  render() {
    return (
      <div className="answer-list">
        <h3>A: </h3>
        {this.renderAnswers()}
      </div>
    );
  }
}

AnswerList.propTypes = {
  answers: PropTypes.instanceOf(Array).isRequired,
};

export default AnswerList;
