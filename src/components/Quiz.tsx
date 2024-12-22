import { useState } from 'react';
import { questions } from '../data/questions';
import ShareButton from './ShareButton';

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage === 100) return "Perfect! You truly understand the importance of the Church's name!";
    if (percentage >= 80) return "Great job! You have a solid understanding of this important topic.";
    if (percentage >= 60) return "Good effort! Consider reviewing President Nelson's message about the Church's name.";
    return "Take some time to review President Nelson's teachings about the importance of using the Church's full name.";
  };

  const handleAnswerClick = (answerIndex: number) => {
    if (isAnswered) return;
    setSelectedAnswer(answerIndex);
    setIsAnswered(true);
    if (answerIndex === questions[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setShowScore(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setSelectedAnswer(null);
    setIsAnswered(false);
  };

  if (showScore) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
          <p className="text-xl mb-4">You scored {score} out of {questions.length}</p>
          <p className="mb-6">{getScoreMessage()}</p>
          
          <div className="flex flex-col gap-4">
            <ShareButton score={score} total={questions.length} message={getScoreMessage()} />
            
            <button
              onClick={resetQuiz}
              className="px-6 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition-colors"
            >
              Take Quiz Again
            </button>
            
            <a
              href="https://www.churchofjesuschrist.org/study/general-conference/2018/10/the-correct-name-of-the-church?lang=eng"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 flex items-center justify-center gap-2 mt-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
              </svg>
              Read President Nelson's full message
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-500">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span className="text-sm text-gray-500">Score: {score}</span>
        </div>

        <h2 className="text-xl font-semibold mb-4">{questions[currentQuestion].question}</h2>

        <div className="space-y-3">
          {questions[currentQuestion].answers.map((answer, index) => (
            <button
              key={index}
              onClick={() => handleAnswerClick(index)}
              className={`w-full text-left p-4 rounded-lg border transition-colors ${
                isAnswered
                  ? index === questions[currentQuestion].correct
                    ? 'bg-green-100 border-green-500 text-green-800'
                    : index === selectedAnswer
                    ? 'bg-red-100 border-red-500 text-red-800'
                    : 'bg-gray-100 border-gray-300 text-gray-800'
                  : 'hover:bg-gray-50 border-gray-300'
              }`}
              disabled={isAnswered}
            >
              <div className="flex items-center">
                <span className="flex-grow">{answer}</span>
                {isAnswered && index === questions[currentQuestion].correct && (
                  <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {isAnswered && index === selectedAnswer && index !== questions[currentQuestion].correct && (
                  <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>

        {isAnswered && (
          <div className="mt-6 text-center">
            <button
              onClick={handleNextQuestion}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              {currentQuestion + 1 === questions.length ? 'See Results' : 'Next Question'}
            </button>
          </div>
        )}
      </div>

      <div className="p-6 border-t">
        <a
          href="https://www.churchofjesuschrist.org/study/general-conference/2018/10/the-correct-name-of-the-church?lang=eng"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 flex items-center gap-2 text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
          </svg>
          Want to study first? Read President Nelson's message
        </a>
      </div>
    </div>
  );
}