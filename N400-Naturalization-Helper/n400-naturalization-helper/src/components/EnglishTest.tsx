import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, CheckCircleIcon, XCircleIcon, BookOpenIcon, PencilSquareIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

interface EnglishExercise {
  id: number;
  type: 'reading' | 'writing' | 'vocabulary';
  title: string;
  content: string;
  question?: string;
  correctAnswer?: string;
  options?: string[];
  explanation?: string;
}

const EnglishTest: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<'reading' | 'writing' | 'vocabulary'>('reading');
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<number[]>([]);

  const sections = [
    { id: 'reading', name: 'Reading', icon: BookOpenIcon, color: 'blue' },
    { id: 'writing', name: 'Writing', icon: PencilSquareIcon, color: 'green' },
    { id: 'vocabulary', name: 'Vocabulary', icon: AcademicCapIcon, color: 'purple' }
  ];

  const exercises: EnglishExercise[] = [
    // Reading Comprehension
    {
      id: 1,
      type: 'reading',
      title: 'American History Passage',
      content: `The Declaration of Independence was signed on July 4, 1776. This important document declared that the thirteen American colonies were no longer subject to British rule. The Declaration stated that all men are created equal and have certain unalienable rights, including life, liberty, and the pursuit of happiness. Thomas Jefferson was the primary author of this historic document.`,
      question: 'When was the Declaration of Independence signed?',
      correctAnswer: 'July 4, 1776',
      options: ['July 4, 1776', 'July 4, 1775', 'August 4, 1776', 'June 4, 1776'],
      explanation: 'The Declaration of Independence was signed on July 4, 1776, which is why we celebrate Independence Day on this date.'
    },
    {
      id: 2,
      type: 'reading',
      title: 'Constitution Reading',
      content: `The Constitution is the supreme law of the United States. It was written in 1787 and establishes the framework for the federal government. The Constitution has three main parts: the Preamble, the Articles, and the Amendments. The first ten amendments are called the Bill of Rights and protect individual freedoms.`,
      question: 'What are the first ten amendments called?',
      correctAnswer: 'The Bill of Rights',
      options: ['The Bill of Rights', 'The Articles', 'The Preamble', 'The Constitution'],
      explanation: 'The first ten amendments to the Constitution are called the Bill of Rights and protect fundamental freedoms.'
    },
    {
      id: 3,
      type: 'reading',
      title: 'American Government',
      content: `The United States has three branches of government: legislative, executive, and judicial. The legislative branch makes laws and is made up of Congress, which includes the House of Representatives and the Senate. The executive branch enforces laws and is headed by the President. The judicial branch interprets laws and is made up of the court system, including the Supreme Court.`,
      question: 'How many branches of government does the United States have?',
      correctAnswer: 'Three',
      options: ['Two', 'Three', 'Four', 'Five'],
      explanation: 'The U.S. has three branches: legislative (Congress), executive (President), and judicial (courts).'
    },

    // Writing Exercises
    {
      id: 4,
      type: 'writing',
      title: 'Write About Freedom',
      content: 'Write 2-3 sentences about what freedom means to you in America.',
      question: 'Complete the writing exercise above. Focus on proper grammar and spelling.',
      explanation: 'Good writing should include complete sentences, proper punctuation, and clear ideas about American freedoms.'
    },
    {
      id: 5,
      type: 'writing',
      title: 'Describe American Democracy',
      content: 'Write a short paragraph explaining how democracy works in the United States.',
      question: 'Write your paragraph here. Include ideas about voting, representation, and citizen participation.',
      explanation: 'Democracy involves citizens voting for representatives, peaceful transfers of power, and participation in government.'
    },
    {
      id: 6,
      type: 'writing',
      title: 'Personal Statement',
      content: 'Write about why you want to become a U.S. citizen.',
      question: 'Express your thoughts in 3-4 complete sentences with proper grammar.',
      explanation: 'Personal statements should be heartfelt, well-written, and show understanding of American values.'
    },

    // Vocabulary
    {
      id: 7,
      type: 'vocabulary',
      title: 'Civics Vocabulary',
      content: 'Choose the correct definition of "democracy"',
      question: 'What does "democracy" mean?',
      correctAnswer: 'Government by the people',
      options: ['Government by the people', 'Government by one person', 'Government by the military', 'Government by the wealthy'],
      explanation: 'Democracy comes from Greek words meaning "rule by the people" - citizens participate in government through voting.'
    },
    {
      id: 8,
      type: 'vocabulary',
      title: 'Constitution Terms',
      content: 'Choose the correct definition of "amendment"',
      question: 'What is an amendment?',
      correctAnswer: 'A change or addition to the Constitution',
      options: ['A change or addition to the Constitution', 'A type of law', 'A government building', 'A voting process'],
      explanation: 'An amendment is a formal change or addition to the Constitution. There are currently 27 amendments.'
    },
    {
      id: 9,
      type: 'vocabulary',
      title: 'Government Terms',
      content: 'Choose the correct definition of "citizen"',
      question: 'What is a citizen?',
      correctAnswer: 'A person who belongs to a country and has rights and responsibilities',
      options: [
        'A person who belongs to a country and has rights and responsibilities',
        'A person who visits a country',
        'A person who works in government',
        'A person who owns property'
      ],
      explanation: 'A citizen is a legal member of a country with both rights (like voting) and responsibilities (like following laws).'
    },
    {
      id: 10,
      type: 'vocabulary',
      title: 'Rights and Freedoms',
      content: 'Choose the correct definition of "liberty"',
      question: 'What does "liberty" mean?',
      correctAnswer: 'Freedom',
      options: ['Freedom', 'Justice', 'Equality', 'Democracy'],
      explanation: 'Liberty means freedom - the ability to act, speak, and think freely within the law.'
    }
  ];

  const filteredExercises = exercises.filter(exercise => exercise.type === currentSection);
  const currentEx = filteredExercises[currentExercise];

  const handleAnswer = (answer: string) => {
    setUserAnswer(answer);
    setShowAnswer(true);

    if (!completedExercises.includes(currentEx.id)) {
      setCompletedExercises([...completedExercises, currentEx.id]);
      
      if (currentEx.correctAnswer) {
        const isCorrect = answer.toLowerCase().trim() === currentEx.correctAnswer.toLowerCase().trim() ||
                         currentEx.correctAnswer.toLowerCase().includes(answer.toLowerCase().trim());
        if (isCorrect) {
          setScore(score + 1);
        }
      } else {
        // For writing exercises, give credit for attempting
        setScore(score + 1);
      }
    }
  };

  const nextExercise = () => {
    if (currentExercise < filteredExercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserAnswer('');
      setShowAnswer(false);
    }
  };

  const previousExercise = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1);
      setUserAnswer('');
      setShowAnswer(false);
    }
  };

  const resetSection = () => {
    setCurrentExercise(0);
    setUserAnswer('');
    setShowAnswer(false);
    setScore(0);
    setCompletedExercises([]);
  };

  useEffect(() => {
    resetSection();
  }, [currentSection]);

  const progress = ((currentExercise + 1) / filteredExercises.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center text-gray-600 hover:text-green-600 transition-colors">
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Score: {score}/{completedExercises.length}</span>
            <button
              onClick={resetSection}
              className="text-sm text-green-600 hover:text-green-800 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Section Selection */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">English Test Practice</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sections.map((section) => {
              const IconComponent = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setCurrentSection(section.id as 'reading' | 'writing' | 'vocabulary')}
                  className={`p-4 rounded-xl text-left transition-all ${
                    currentSection === section.id
                      ? `bg-${section.color}-600 text-white shadow-lg`
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <IconComponent className="h-6 w-6" />
                    <div>
                      <div className="font-semibold">{section.name}</div>
                      <div className="text-sm opacity-80">
                        {section.id === 'reading' && 'Comprehension & Analysis'}
                        {section.id === 'writing' && 'Grammar & Composition'}
                        {section.id === 'vocabulary' && 'Civics Terms & Definitions'}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Exercise {currentExercise + 1} of {filteredExercises.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`bg-gradient-to-r ${
                currentSection === 'reading' ? 'from-blue-500 to-blue-700' :
                currentSection === 'writing' ? 'from-green-500 to-green-700' :
                'from-purple-500 to-purple-700'
              } h-2 rounded-full transition-all duration-300`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Exercise Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="mb-6">
            <div className={`inline-block px-3 py-1 text-sm font-medium rounded-full mb-4 ${
              currentSection === 'reading' ? 'bg-blue-100 text-blue-800' :
              currentSection === 'writing' ? 'bg-green-100 text-green-800' :
              'bg-purple-100 text-purple-800'
            }`}>
              {currentEx.title}
            </div>
            
            {/* Content */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                {currentEx.content}
              </p>
            </div>

            {currentEx.question && (
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {currentEx.question}
              </h2>
            )}
          </div>

          {/* Answer Input */}
          {currentEx.options ? (
            // Multiple Choice
            <div className="space-y-3 mb-6">
              {currentEx.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  disabled={showAnswer}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    showAnswer
                      ? option === currentEx.correctAnswer
                        ? 'border-green-500 bg-green-50 text-green-800'
                        : userAnswer === option
                        ? 'border-red-500 bg-red-50 text-red-800'
                        : 'border-gray-200 bg-gray-50 text-gray-500'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option}</span>
                    {showAnswer && option === currentEx.correctAnswer && (
                      <CheckCircleIcon className="h-5 w-5 text-green-600" />
                    )}
                    {showAnswer && userAnswer === option && option !== currentEx.correctAnswer && (
                      <XCircleIcon className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            // Text Input for Writing
            <div className="mb-6">
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none resize-none"
                rows={currentSection === 'writing' ? 6 : 3}
                disabled={showAnswer}
              />
              {!showAnswer && (
                <button
                  onClick={() => handleAnswer(userAnswer)}
                  disabled={!userAnswer.trim()}
                  className="mt-3 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Submit Answer
                </button>
              )}
            </div>
          )}

          {/* Show Answer/Feedback */}
          {showAnswer && (
            <div className="border-t pt-6">
              {currentEx.correctAnswer && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-green-800 mb-2">Correct Answer:</h4>
                  <p className="text-green-700">{currentEx.correctAnswer}</p>
                </div>
              )}
              
              {currentSection === 'writing' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Your Response:</h4>
                  <p className="text-blue-700 whitespace-pre-line">{userAnswer}</p>
                </div>
              )}

              {currentEx.explanation && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Explanation:</h4>
                  <p className="text-blue-700">{currentEx.explanation}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={previousExercise}
            disabled={currentExercise === 0}
            className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Previous
          </button>
          
          <div className="text-center">
            <div className="text-sm text-gray-600">
              {completedExercises.length > 0 && (
                <span>Progress: {Math.round((completedExercises.length / filteredExercises.length) * 100)}%</span>
              )}
            </div>
          </div>

          <button
            onClick={nextExercise}
            disabled={currentExercise === filteredExercises.length - 1}
            className={`flex items-center px-6 py-3 text-white rounded-lg transition-colors ${
              currentSection === 'reading' ? 'bg-blue-600 hover:bg-blue-700' :
              currentSection === 'writing' ? 'bg-green-600 hover:bg-green-700' :
              'bg-purple-600 hover:bg-purple-700'
            } disabled:bg-gray-300 disabled:cursor-not-allowed`}
          >
            Next
            <ArrowLeftIcon className="h-5 w-5 ml-2 rotate-180" />
          </button>
        </div>

        {/* Completion Message */}
        {currentExercise === filteredExercises.length - 1 && showAnswer && (
          <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">🎉 Section Complete!</h3>
            <p className="text-lg text-gray-700 mb-4">
              You've completed all {currentSection} exercises!
            </p>
            <p className="text-gray-600 mb-6">
              Final Score: {score} out of {filteredExercises.length} ({Math.round((score / filteredExercises.length) * 100)}%)
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={resetSection}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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

export default EnglishTest;
