import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, CheckCircleIcon, XCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

interface Question {
  id: number;
  question: string;
  answer: string;
  category: string;
  options?: string[];
  explanation?: string;
}

const CivicsTest: React.FC = () => {
  const [currentCategory, setCurrentCategory] = useState('all');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);

  const categories = [
    { id: 'all', name: 'All Questions', icon: '📚' },
    { id: 'american-government', name: 'American Government', icon: '🏛️' },
    { id: 'american-history', name: 'American History', icon: '📜' },
    { id: 'integrated-civics', name: 'Integrated Civics', icon: '🇺🇸' },
    { id: 'geography', name: 'Geography', icon: '🗺️' },
    { id: 'symbols', name: 'Symbols & Holidays', icon: '🎆' }
  ];

  const civicsQuestions: Question[] = [
    // American Government
    {
      id: 1,
      question: "What is the supreme law of the land?",
      answer: "The Constitution",
      category: "american-government",
      options: ["The Constitution", "The Declaration of Independence", "The Bill of Rights", "Federal Laws"],
      explanation: "The Constitution is the highest form of law in the United States. All other laws must follow the Constitution."
    },
    {
      id: 2,
      question: "What does the Constitution do?",
      answer: "Sets up the government, defines the government, protects basic rights of Americans",
      category: "american-government",
      explanation: "The Constitution establishes our form of government and guarantees basic rights for all citizens."
    },
    {
      id: 3,
      question: "The idea of self-government is in the first three words of the Constitution. What are these words?",
      answer: "We the People",
      category: "american-government",
      options: ["We the People", "In Congress Assembled", "We hold these truths", "Life, Liberty, and"],
      explanation: "'We the People' shows that the people hold the power in our democracy."
    },
    {
      id: 4,
      question: "What is an amendment?",
      answer: "A change (to the Constitution), an addition (to the Constitution)",
      category: "american-government",
      explanation: "Amendments allow the Constitution to be updated and changed as our country grows and changes."
    },
    {
      id: 5,
      question: "What do we call the first ten amendments to the Constitution?",
      answer: "The Bill of Rights",
      category: "american-government",
      options: ["The Bill of Rights", "The Articles", "The Preamble", "The Declaration"],
      explanation: "The Bill of Rights protects basic freedoms like speech, religion, and the press."
    },
    {
      id: 6,
      question: "What is one right or freedom from the First Amendment?",
      answer: "Speech, religion, assembly, press, petition the government",
      category: "american-government",
      explanation: "The First Amendment protects our most basic freedoms in a democracy."
    },
    {
      id: 7,
      question: "How many amendments does the Constitution have?",
      answer: "Twenty-seven (27)",
      category: "american-government",
      options: ["Twenty-seven (27)", "Twenty-six (26)", "Twenty-eight (28)", "Twenty-five (25)"],
      explanation: "The most recent amendment (27th) was ratified in 1992 about congressional pay."
    },
    {
      id: 8,
      question: "What did the Declaration of Independence do?",
      answer: "Announced our independence (from Great Britain), declared our independence (from Great Britain), said that the United States is free (from Great Britain)",
      category: "american-government",
      explanation: "The Declaration of Independence was signed on July 4, 1776, declaring America's independence from Britain."
    },
    {
      id: 9,
      question: "What are two rights in the Declaration of Independence?",
      answer: "Life, liberty, pursuit of happiness",
      category: "american-government",
      options: ["Life, liberty, pursuit of happiness", "Life, liberty, property", "Liberty, justice, equality", "Freedom, justice, democracy"],
      explanation: "These are considered unalienable rights that cannot be taken away."
    },
    {
      id: 10,
      question: "What is freedom of religion?",
      answer: "You can practice any religion, or not practice a religion",
      category: "american-government",
      explanation: "Religious freedom means the government cannot establish an official religion or prevent you from practicing your faith."
    },

    // American History
    {
      id: 11,
      question: "What is the economic system in the United States?",
      answer: "Capitalist economy, market economy",
      category: "american-history",
      options: ["Capitalist economy", "Socialist economy", "Communist economy", "Mixed economy"],
      explanation: "The U.S. has a free market capitalist economy where businesses and individuals make economic decisions."
    },
    {
      id: 12,
      question: "What is the 'rule of law'?",
      answer: "Everyone must follow the law, leaders must obey the law, government must obey the law, no one is above the law",
      category: "american-history",
      explanation: "Rule of law means that all people and institutions are subject to and accountable to law."
    },
    {
      id: 13,
      question: "Name one branch or part of the government.",
      answer: "Congress, legislative, President, executive, the courts, judicial",
      category: "american-government",
      options: ["Legislative", "Administrative", "Military", "Educational"],
      explanation: "The three branches are legislative (Congress), executive (President), and judicial (courts)."
    },
    {
      id: 14,
      question: "What stops one branch of government from becoming too powerful?",
      answer: "Checks and balances, separation of powers",
      category: "american-government",
      explanation: "Each branch has powers that can limit the other branches, preventing any one from becoming too powerful."
    },
    {
      id: 15,
      question: "Who is in charge of the executive branch?",
      answer: "The President",
      category: "american-government",
      options: ["The President", "The Speaker of the House", "The Chief Justice", "The Senate Majority Leader"],
      explanation: "The President is the head of the executive branch and Commander in Chief."
    },

    // Geography
    {
      id: 16,
      question: "Name one of the two longest rivers in the United States.",
      answer: "Missouri (River), Mississippi (River)",
      category: "geography",
      options: ["Missouri River", "Colorado River", "Ohio River", "Rio Grande"],
      explanation: "The Missouri River is actually longer than the Mississippi River."
    },
    {
      id: 17,
      question: "What ocean is on the West Coast of the United States?",
      answer: "Pacific (Ocean)",
      category: "geography",
      options: ["Pacific Ocean", "Atlantic Ocean", "Indian Ocean", "Arctic Ocean"],
      explanation: "The Pacific Ocean borders California, Oregon, Washington, Alaska, and Hawaii."
    },
    {
      id: 18,
      question: "What ocean is on the East Coast of the United States?",
      answer: "Atlantic (Ocean)",
      category: "geography",
      options: ["Atlantic Ocean", "Pacific Ocean", "Indian Ocean", "Arctic Ocean"],
      explanation: "The Atlantic Ocean borders the eastern states from Maine to Florida."
    },
    {
      id: 19,
      question: "Name one U.S. territory.",
      answer: "Puerto Rico, U.S. Virgin Islands, American Samoa, Northern Mariana Islands, Guam",
      category: "geography",
      options: ["Puerto Rico", "Philippines", "Cuba", "Bahamas"],
      explanation: "U.S. territories are areas under U.S. jurisdiction but not full states."
    },
    {
      id: 20,
      question: "Name the U.S. war between the North and the South.",
      answer: "The Civil War, the War between the States",
      category: "american-history",
      options: ["The Civil War", "The Revolutionary War", "World War I", "The War of 1812"],
      explanation: "The Civil War (1861-1865) was fought between the Union (North) and Confederacy (South)."
    }
  ];

  const filteredQuestions = currentCategory === 'all' 
    ? civicsQuestions 
    : civicsQuestions.filter(q => q.category === currentCategory);

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowAnswer(true);
    
    if (!answeredQuestions.includes(filteredQuestions[currentQuestion].id)) {
      setAnsweredQuestions([...answeredQuestions, filteredQuestions[currentQuestion].id]);
      
      const correctAnswer = filteredQuestions[currentQuestion].answer.toLowerCase();
      if (answer.toLowerCase() === correctAnswer || correctAnswer.includes(answer.toLowerCase())) {
        setScore(score + 1);
      }
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < filteredQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
      setShowAnswer(false);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer('');
      setShowAnswer(false);
    }
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setSelectedAnswer('');
    setShowAnswer(false);
    setScore(0);
    setAnsweredQuestions([]);
  };

  useEffect(() => {
    resetTest();
  }, [currentCategory]);

  if (filteredQuestions.length === 0) {
    return <div>Loading questions...</div>;
  }

  const currentQ = filteredQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / filteredQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Score: {score}/{answeredQuestions.length}</span>
            <button
              onClick={resetTest}
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Category Selection */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Civics Test Practice</h1>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setCurrentCategory(category.id)}
                className={`p-3 rounded-lg text-sm font-medium transition-all ${
                  currentCategory === category.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <div className="text-lg mb-1">{category.icon}</div>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestion + 1} of {filteredQuestions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-600 to-red-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="mb-6">
            <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mb-4">
              {categories.find(c => c.id === currentQ.category)?.name || 'General'}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {currentQ.question}
            </h2>
          </div>

          {/* Answer Options or Text Input */}
          {currentQ.options ? (
            <div className="space-y-3 mb-6">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  disabled={showAnswer}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    showAnswer
                      ? option.toLowerCase() === currentQ.answer.toLowerCase() || currentQ.answer.toLowerCase().includes(option.toLowerCase())
                        ? 'border-green-500 bg-green-50 text-green-800'
                        : selectedAnswer === option
                        ? 'border-red-500 bg-red-50 text-red-800'
                        : 'border-gray-200 bg-gray-50 text-gray-500'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option}</span>
                    {showAnswer && (option.toLowerCase() === currentQ.answer.toLowerCase() || currentQ.answer.toLowerCase().includes(option.toLowerCase())) && (
                      <CheckCircleIcon className="h-5 w-5 text-green-600" />
                    )}
                    {showAnswer && selectedAnswer === option && !(option.toLowerCase() === currentQ.answer.toLowerCase() || currentQ.answer.toLowerCase().includes(option.toLowerCase())) && (
                      <XCircleIcon className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="mb-6">
              <textarea
                value={selectedAnswer}
                onChange={(e) => setSelectedAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
                rows={3}
                disabled={showAnswer}
              />
              {!showAnswer && (
                <button
                  onClick={() => handleAnswer(selectedAnswer)}
                  disabled={!selectedAnswer.trim()}
                  className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Submit Answer
                </button>
              )}
            </div>
          )}

          {/* Show Answer */}
          {showAnswer && (
            <div className="border-t pt-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-green-800 mb-2">Correct Answer:</h4>
                <p className="text-green-700">{currentQ.answer}</p>
              </div>
              {currentQ.explanation && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Explanation:</h4>
                  <p className="text-blue-700">{currentQ.explanation}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={previousQuestion}
            disabled={currentQuestion === 0}
            className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Previous
          </button>
          
          <div className="text-center">
            <div className="text-sm text-gray-600">
              {answeredQuestions.length > 0 && (
                <span>Accuracy: {Math.round((score / answeredQuestions.length) * 100)}%</span>
              )}
            </div>
          </div>

          <button
            onClick={nextQuestion}
            disabled={currentQuestion === filteredQuestions.length - 1}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <ArrowRightIcon className="h-5 w-5 ml-2" />
          </button>
        </div>

        {/* Completion Message */}
        {currentQuestion === filteredQuestions.length - 1 && showAnswer && (
          <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">🎉 Great Job!</h3>
            <p className="text-lg text-gray-700 mb-4">
              You've completed all questions in this category!
            </p>
            <p className="text-gray-600 mb-6">
              Final Score: {score} out of {filteredQuestions.length} ({Math.round((score / filteredQuestions.length) * 100)}%)
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={resetTest}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
              <Link
                to="/"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CivicsTest;
