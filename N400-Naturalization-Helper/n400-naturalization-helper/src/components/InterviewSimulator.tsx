import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, UserIcon, ClockIcon } from '@heroicons/react/24/outline';

interface InterviewQuestion {
  id: string;
  category: 'personal' | 'background' | 'civics' | 'english' | 'oath';
  question: string;
  expectedAnswers: string[];
  tips: string;
  followUpQuestions?: string[];
}

const InterviewSimulator: React.FC = () => {
  const [currentPhase, setCurrentPhase] = useState<'intro' | 'interview' | 'results'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [sessionQuestions, setSessionQuestions] = useState<InterviewQuestion[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [feedback, setFeedback] = useState<Record<string, 'good' | 'fair' | 'poor'>>({});
  const [interviewMode, setInterviewMode] = useState<'standard' | 'challenging'>('standard');

  const allQuestions: InterviewQuestion[] = [
    // Personal Information
    {
      id: 'personal-1',
      category: 'personal',
      question: 'What is your full name?',
      expectedAnswers: ['State your full legal name as it appears on your application'],
      tips: 'State your full legal name clearly. This should match your N-400 application exactly.',
      followUpQuestions: ['How do you spell your last name?', 'Do you have any other names?']
    },
    {
      id: 'personal-2',
      category: 'personal',
      question: 'What is your date of birth?',
      expectedAnswers: ['State your complete date of birth'],
      tips: 'Give your full birth date including month, day, and year.',
      followUpQuestions: ['Where were you born?', 'What country were you born in?']
    },
    {
      id: 'personal-3',
      category: 'personal',
      question: 'What is your address?',
      expectedAnswers: ['State your current physical address'],
      tips: 'Give your complete current address. This should match your application.',
      followUpQuestions: ['How long have you lived at this address?', 'What was your previous address?']
    },
    {
      id: 'personal-4',
      category: 'personal',
      question: 'What is your phone number?',
      expectedAnswers: ['State your current phone number'],
      tips: 'Give your current phone number clearly.'
    },
    {
      id: 'personal-5',
      category: 'personal',
      question: 'Are you married?',
      expectedAnswers: ['Yes/No and explain your marital status'],
      tips: 'Answer honestly about your current marital status.',
      followUpQuestions: ['What is your spouse\'s name?', 'Is your spouse a U.S. citizen?', 'When did you get married?']
    },

    // Background Questions
    {
      id: 'background-1',
      category: 'background',
      question: 'Why do you want to become a U.S. citizen?',
      expectedAnswers: ['Personal reasons for wanting citizenship'],
      tips: 'Be sincere and specific about your motivations. Common reasons include voting, serving on juries, helping family immigrate, or feeling fully part of American society.',
      followUpQuestions: ['What does being an American mean to you?', 'How will citizenship change your life?']
    },
    {
      id: 'background-2',
      category: 'background',
      question: 'How long have you been a permanent resident?',
      expectedAnswers: ['Number of years as a permanent resident'],
      tips: 'Calculate from your green card date to today. You need 5 years (or 3 if married to a U.S. citizen).',
      followUpQuestions: ['When did you receive your green card?', 'How did you become a permanent resident?']
    },
    {
      id: 'background-3',
      category: 'background',
      question: 'Have you ever been arrested?',
      expectedAnswers: ['Yes/No and details if yes'],
      tips: 'Answer honestly. Even minor infractions should be disclosed. Have court documents ready.',
      followUpQuestions: ['What were you arrested for?', 'When did this happen?', 'What was the outcome?']
    },
    {
      id: 'background-4',
      category: 'background',
      question: 'Have you traveled outside the United States since becoming a permanent resident?',
      expectedAnswers: ['Yes/No and details of travel'],
      tips: 'Be prepared to discuss any trips longer than 6 months. Bring travel documents.',
      followUpQuestions: ['Where did you go?', 'How long were you gone?', 'Why did you travel?']
    },

    // Civics Questions (sample from the 100)
    {
      id: 'civics-1',
      category: 'civics',
      question: 'What is the supreme law of the land?',
      expectedAnswers: ['The Constitution'],
      tips: 'This is one of the 100 possible civics questions. Answer clearly and confidently.'
    },
    {
      id: 'civics-2',
      category: 'civics',
      question: 'What does the Constitution do?',
      expectedAnswers: ['Sets up the government', 'Defines the government', 'Protects basic rights of Americans'],
      tips: 'Any of these answers is acceptable. You only need to give one correct answer.'
    },
    {
      id: 'civics-3',
      category: 'civics',
      question: 'The idea of self-government is in the first three words of the Constitution. What are these words?',
      expectedAnswers: ['We the People'],
      tips: 'This is a specific question requiring an exact answer.'
    },
    {
      id: 'civics-4',
      category: 'civics',
      question: 'What is one right or freedom from the First Amendment?',
      expectedAnswers: ['Speech', 'Religion', 'Assembly', 'Press', 'Petition the government'],
      tips: 'Any one of these rights is a correct answer.'
    },
    {
      id: 'civics-5',
      category: 'civics',
      question: 'How many amendments does the Constitution have?',
      expectedAnswers: ['Twenty-seven', '27'],
      tips: 'The number can be written out or given as a numeral.'
    },

    // English Test
    {
      id: 'english-1',
      category: 'english',
      question: 'Please read this sentence: "America is the land of freedom."',
      expectedAnswers: ['Read the sentence clearly'],
      tips: 'Read slowly and clearly. Don\'t worry about accent - focus on being understood.'
    },
    {
      id: 'english-2',
      category: 'english',
      question: 'Please write: "Citizens have the right to vote."',
      expectedAnswers: ['Write the sentence correctly'],
      tips: 'Write clearly with proper capitalization and punctuation.'
    },

    // Oath Questions
    {
      id: 'oath-1',
      category: 'oath',
      question: 'Are you willing to take the full Oath of Allegiance to the United States?',
      expectedAnswers: ['Yes'],
      tips: 'You must answer yes to become a citizen.'
    },
    {
      id: 'oath-2',
      category: 'oath',
      question: 'Will you support and defend the Constitution and laws of the United States?',
      expectedAnswers: ['Yes'],
      tips: 'This is part of your commitment as a new citizen.'
    }
  ];

  const generateInterviewQuestions = (mode: 'standard' | 'challenging') => {
    const questionCounts = mode === 'standard' 
      ? { personal: 3, background: 2, civics: 6, english: 2, oath: 2 }
      : { personal: 4, background: 4, civics: 10, english: 3, oath: 2 };

    const selected: InterviewQuestion[] = [];
    
    Object.entries(questionCounts).forEach(([category, count]) => {
      const categoryQuestions = allQuestions.filter(q => q.category === category);
      const shuffled = [...categoryQuestions].sort(() => Math.random() - 0.5);
      selected.push(...shuffled.slice(0, Math.min(count, categoryQuestions.length)));
    });

    return selected.sort(() => Math.random() - 0.5); // Final shuffle
  };

  const startInterview = () => {
    const questions = generateInterviewQuestions(interviewMode);
    setSessionQuestions(questions);
    setCurrentPhase('interview');
    setStartTime(new Date());
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setFeedback({});
  };

  const handleAnswer = (answer: string) => {
    const currentQuestion = sessionQuestions[currentQuestionIndex];
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }));

    // Simple feedback based on answer length and keywords
    let feedbackRating: 'good' | 'fair' | 'poor' = 'fair';
    
    if (currentQuestion.category === 'civics') {
      const hasCorrectAnswer = currentQuestion.expectedAnswers.some(expected => 
        answer.toLowerCase().includes(expected.toLowerCase())
      );
      feedbackRating = hasCorrectAnswer ? 'good' : 'poor';
    } else if (answer.trim().length > 10) {
      feedbackRating = 'good';
    } else if (answer.trim().length > 3) {
      feedbackRating = 'fair';
    } else {
      feedbackRating = 'poor';
    }

    setFeedback(prev => ({
      ...prev,
      [currentQuestion.id]: feedbackRating
    }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < sessionQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setCurrentPhase('results');
    }
  };

  const calculateResults = () => {
    const total = Object.keys(feedback).length;
    const good = Object.values(feedback).filter(f => f === 'good').length;
    const fair = Object.values(feedback).filter(f => f === 'fair').length;
    const poor = Object.values(feedback).filter(f => f === 'poor').length;
    
    const score = Math.round(((good * 3 + fair * 2 + poor * 1) / (total * 3)) * 100);
    
    return { total, good, fair, poor, score };
  };

  const getElapsedTime = () => {
    if (!startTime) return '0:00';
    const elapsed = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Intro Phase
  if (currentPhase === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="flex items-center text-gray-600 hover:text-red-600 transition-colors">
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Link>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🎤 Mock Naturalization Interview
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Practice your N-400 naturalization interview with our AI simulator. 
              Get realistic questions and feedback to build your confidence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">📋 Standard Interview</h3>
              <p className="text-gray-600 mb-6">
                A typical interview with standard questions covering all required topics. 
                Great for first-time practice.
              </p>
              <ul className="space-y-2 mb-6 text-sm text-gray-600">
                <li>• 15 questions total</li>
                <li>• 6 civics questions</li>
                <li>• Personal background questions</li>
                <li>• English reading and writing</li>
                <li>• Estimated time: 15-20 minutes</li>
              </ul>
              <button
                onClick={() => {
                  setInterviewMode('standard');
                  startInterview();
                }}
                className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Start Standard Interview
              </button>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">🔥 Challenging Interview</h3>
              <p className="text-gray-600 mb-6">
                A more thorough interview with additional questions and follow-ups. 
                Perfect for comprehensive preparation.
              </p>
              <ul className="space-y-2 mb-6 text-sm text-gray-600">
                <li>• 23 questions total</li>
                <li>• 10 civics questions</li>
                <li>• Detailed background questions</li>
                <li>• Additional English tests</li>
                <li>• Estimated time: 25-30 minutes</li>
              </ul>
              <button
                onClick={() => {
                  setInterviewMode('challenging');
                  startInterview();
                }}
                className="w-full py-3 px-6 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                Start Challenging Interview
              </button>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h3 className="font-semibold text-yellow-800 mb-3">💡 Interview Tips:</h3>
            <div className="grid md:grid-cols-2 gap-4 text-yellow-700 text-sm">
              <ul className="space-y-1">
                <li>• Speak clearly and loudly</li>
                <li>• Answer only what is asked</li>
                <li>• Bring all required documents</li>
                <li>• Dress professionally</li>
              </ul>
              <ul className="space-y-1">
                <li>• Tell the truth always</li>
                <li>• Ask for clarification if needed</li>
                <li>• Stay calm and confident</li>
                <li>• Practice common questions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Interview Phase
  if (currentPhase === 'interview') {
    const currentQuestion = sessionQuestions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / sessionQuestions.length) * 100;
    const currentAnswer = userAnswers[currentQuestion.id] || '';

    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <UserIcon className="h-8 w-8 text-blue-600" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">USCIS Officer</h2>
                <p className="text-sm text-gray-600">Naturalization Interview</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <ClockIcon className="h-4 w-4" />
                <span>{getElapsedTime()}</span>
              </div>
              <span>Question {currentQuestionIndex + 1} of {sessionQuestions.length}</span>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>{currentQuestion.category.charAt(0).toUpperCase() + currentQuestion.category.slice(1)} Questions</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-red-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <UserIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">USCIS Officer:</h3>
                <p className="text-xl text-gray-800">{currentQuestion.question}</p>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-blue-800 mb-2">💡 Tip:</h4>
              <p className="text-blue-700 text-sm">{currentQuestion.tips}</p>
            </div>

            {/* Answer Input */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Your Answer:
              </label>
              <textarea
                value={currentAnswer}
                onChange={(e) => handleAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full p-4 border border-gray-300 rounded-lg focus:border-red-500 focus:outline-none resize-none"
                rows={4}
              />
              
              {currentQuestion.category === 'civics' && currentQuestion.expectedAnswers && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-green-800 text-sm">
                    <strong>Acceptable answers:</strong> {currentQuestion.expectedAnswers.join(', ')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-center">
            <button
              onClick={nextQuestion}
              disabled={!currentAnswer.trim()}
              className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold"
            >
              {currentQuestionIndex === sessionQuestions.length - 1 ? 'Finish Interview' : 'Next Question'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Results Phase
  const results = calculateResults();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎉 Interview Complete!
          </h1>
          <p className="text-xl text-gray-600">
            Here's how you performed in your mock naturalization interview.
          </p>
        </div>

        {/* Overall Score */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 text-center">
          <div className={`text-6xl font-bold mb-4 ${
            results.score >= 80 ? 'text-green-600' : 
            results.score >= 60 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {results.score}%
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {results.score >= 80 ? 'Excellent Performance!' : 
             results.score >= 60 ? 'Good Job!' : 'Keep Practicing!'}
          </h2>
          <p className="text-gray-600 mb-6">
            {results.score >= 80 ? 'You\'re well-prepared for your actual interview!' : 
             results.score >= 60 ? 'You\'re on the right track. Review the areas below.' : 
             'More practice will help you feel confident on interview day.'}
          </p>
          
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{results.good}</div>
              <div className="text-sm text-gray-600">Excellent Answers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">{results.fair}</div>
              <div className="text-sm text-gray-600">Good Answers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{results.poor}</div>
              <div className="text-sm text-gray-600">Needs Improvement</div>
            </div>
          </div>
        </div>

        {/* Question-by-Question Review */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Question Review</h3>
          <div className="space-y-4">
            {sessionQuestions.map((question, index) => {
              const userAnswer = userAnswers[question.id];
              const questionFeedback = feedback[question.id];
              
              return (
                <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 flex-1">
                      {index + 1}. {question.question}
                    </h4>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      questionFeedback === 'good' ? 'bg-green-100 text-green-800' :
                      questionFeedback === 'fair' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {questionFeedback === 'good' ? 'Excellent' :
                       questionFeedback === 'fair' ? 'Good' : 'Needs Work'}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-2">
                    <strong>Your answer:</strong> {userAnswer || 'No answer provided'}
                  </p>
                  
                  {question.category === 'civics' && (
                    <p className="text-gray-600 text-sm">
                      <strong>Expected:</strong> {question.expectedAnswers.join(' or ')}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-blue-800 mb-4">📚 Recommended Next Steps:</h3>
          <ul className="text-blue-700 text-sm space-y-2">
            {results.score < 60 && (
              <>
                <li>• Review civics questions using our practice test</li>
                <li>• Practice English reading and writing</li>
                <li>• Study your N-400 application thoroughly</li>
              </>
            )}
            {results.score >= 60 && results.score < 80 && (
              <>
                <li>• Focus on areas where you scored poorly</li>
                <li>• Practice speaking answers out loud</li>
                <li>• Review civics questions you missed</li>
              </>
            )}
            {results.score >= 80 && (
              <>
                <li>• You're ready! Just review your N-400 before the interview</li>
                <li>• Practice speaking clearly and confidently</li>
                <li>• Gather all required documents</li>
              </>
            )}
            <li>• Take another practice interview to build confidence</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => {
              setCurrentPhase('intro');
              setCurrentQuestionIndex(0);
              setUserAnswers({});
              setFeedback({});
              setStartTime(null);
            }}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
          >
            Take Another Interview
          </button>
          <Link
            to="/civics"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Practice Civics
          </Link>
          <Link
            to="/"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InterviewSimulator;
