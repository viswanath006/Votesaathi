/**
 * @fileoverview QuizView Component
 * @description Interactive quiz zone with question display, option selection, and results
 * @component
 */
import React from 'react';
import { Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { QUIZ_QUESTIONS } from '../../utils/constants';

/**
 * Quiz zone component with question flow and results
 * @param {Object} props
 * @param {number} props.currentQuestion - Current question index
 * @param {number} props.quizScore - Current score
 * @param {number|null} props.selectedOption - Selected option index
 * @param {boolean} props.showExplanation - Whether to show explanation
 * @param {boolean} props.quizFinished - Whether quiz is completed
 * @param {Function} props.onSelectOption - Option selection handler
 * @param {Function} props.onSubmitAnswer - Answer submission handler
 * @param {Function} props.onNextQuestion - Next question handler
 * @param {Function} props.onRestart - Quiz restart handler
 * @param {Function} props.onBackToChat - Navigation handler
 */
export default function QuizView({
  currentQuestion, quizScore, selectedOption, showExplanation, quizFinished,
  onSelectOption, onSubmitAnswer, onNextQuestion, onRestart, onBackToChat
}) {
  if (quizFinished) {
    return (
      <div className="registration-view">
        <div className="view-header">
          <Award size={24} color="#003366" aria-hidden="true" />
          <h2>Quiz Zone: Test Your Knowledge</h2>
        </div>
        <div className="quiz-result-view">
          <div className="result-card" role="status" aria-label={`Quiz completed. Score: ${quizScore} out of ${QUIZ_QUESTIONS.length}`}>
            <div className="result-icon"><Award size={48} color="#F59E0B" aria-hidden="true" /></div>
            <h3>Quiz Completed!</h3>
            <div className="final-score">
              <span>Your Score</span>
              <h2>{quizScore} / {QUIZ_QUESTIONS.length}</h2>
            </div>
            <p>{quizScore === QUIZ_QUESTIONS.length ? "Perfect score! You are a master of the election process." : "Good job! Keep learning to become a more informed citizen."}</p>
            <div className="result-actions">
              <button className="primary-btn" onClick={onRestart} aria-label="Retry quiz">Try Again</button>
              <button className="secondary-btn" onClick={onBackToChat} aria-label="Return to AI assistant">Back to Assistant</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = QUIZ_QUESTIONS[currentQuestion];

  return (
    <div className="registration-view">
      <div className="view-header">
        <Award size={24} color="#003366" aria-hidden="true" />
        <h2>Quiz Zone: Test Your Knowledge</h2>
      </div>
      <div className="quiz-container" role="form" aria-label="Quiz question">
        <div className="quiz-progress" aria-label={`Question ${currentQuestion + 1} of ${QUIZ_QUESTIONS.length}`}>
          Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}
          <div className="progress-bar-container" style={{ height: '8px', marginTop: '10px' }} role="progressbar" aria-valuenow={((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100} aria-valuemin={0} aria-valuemax={100}>
            <div className="progress-fill" style={{ width: `${((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100}%` }}></div>
          </div>
        </div>

        <div className="quiz-card">
          <h3 className="question-text">{question.question}</h3>
          <div className="options-grid" role="radiogroup" aria-label="Answer options">
            {question.options.map((opt, idx) => (
              <button
                key={idx}
                className={`option-btn ${selectedOption === idx ? 'selected' : ''} ${showExplanation && idx === question.correct ? 'correct' : ''} ${showExplanation && selectedOption === idx && idx !== question.correct ? 'wrong' : ''}`}
                onClick={() => !showExplanation && onSelectOption(idx)}
                disabled={showExplanation}
                role="radio"
                aria-checked={selectedOption === idx}
                aria-label={opt}
              >
                <div className="option-radio" aria-hidden="true">
                  {selectedOption === idx && <div className="radio-inner"></div>}
                </div>
                {opt}
              </button>
            ))}
          </div>

          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`explanation-box ${selectedOption === question.correct ? 'success' : 'error'}`}
              role="alert"
            >
              <strong>{selectedOption === question.correct ? 'Correct!' : 'Incorrect'}</strong>
              <p>{question.explanation}</p>
            </motion.div>
          )}

          <div className="quiz-actions">
            {!showExplanation ? (
              <button className="primary-btn" disabled={selectedOption === null} onClick={onSubmitAnswer} aria-label="Submit your answer">Submit Answer</button>
            ) : (
              <button className="primary-btn" onClick={onNextQuestion} aria-label={currentQuestion + 1 < QUIZ_QUESTIONS.length ? 'Go to next question' : 'View quiz results'}>
                {currentQuestion + 1 < QUIZ_QUESTIONS.length ? 'Next Question' : 'View Results'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
