export interface Question {
    question: string;
    answers: string[];
    correct: number;
  }
  
  export const questions: Question[] = [
    {
      question: "What is NOT true about the emphasis on using the Church's full name?",
      answers: [
        "It is a name change",
        "It is the command of the Lord",
        "It is a correction",
        "It was given by the Savior Himself"
      ],
      correct: 0
    },
    {
      question: "According to President Nelson, what happens when we remove the Lord's name from the Church's name?",
      answers: [
        "We lose our identity",
        "We become less recognizable",
        "We give Satan a victory",
        "We lose our history"
      ],
      correct: 2
    },
    {
      question: "How should you respond if someone asks if you're a Mormon?",
      answers: [
        "Yes, I'm a Mormon",
        "No, I don't like that term",
        "If you're asking if I'm a member of The Church of Jesus Christ of Latter-day Saints, yes!",
        "I prefer LDS"
      ],
      correct: 2
    },
    {
      question: "Which of these is an encouraged way to refer to the Church (after first using its full name)?",
      answers: [
        "The Mormon Church",
        "The LDS Church",
        "The restored Church of Jesus Christ",
        "The Latter-day Saint Church"
      ],
      correct: 2
    },
    {
      question: "What did the Savior say about churches named after people?",
      answers: [
        "They are acceptable alternatives",
        "If it's called in a man's name, then it's that man's church",
        "They can be used as nicknames",
        "They are helpful shortcuts"
      ],
      correct: 1
    }
  ];
  
  // Helper function to get a score message based on the number of correct answers
  export const getScoreMessage = (score: number): string => {
    const percentage = (score / questions.length) * 100;
    
    if (percentage === 100) {
      return "Perfect! You truly understand the importance of the Church's name!";
    } else if (percentage >= 80) {
      return "Great job! You have a solid understanding of this important topic.";
    } else if (percentage >= 60) {
      return "Good effort! Consider reviewing President Nelson's message about the Church's name.";
    } else {
      return "Take some time to review President Nelson's teachings about the importance of using the Church's full name.";
    }
  };