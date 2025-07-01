import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, MicrophoneIcon, SpeakerWaveIcon, StopIcon } from '@heroicons/react/24/outline';

// Declare SpeechRecognition interface for TypeScript
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface SpeakingExercise {
  id: number;
  type: 'pronunciation' | 'reading-aloud' | 'conversation';
  title: string;
  text: string;
  instruction: string;
  targetWords?: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

const SpeakingTest: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<'pronunciation' | 'reading-aloud' | 'conversation'>('pronunciation');
  const [currentExercise, setCurrentExercise] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<number[]>([]);
  const [recognition, setRecognition] = useState<any>(null);
  const [synthesis, setSynthesis] = useState<SpeechSynthesis | null>(null);

  const sections = [
    { id: 'pronunciation', name: 'Pronunciation', icon: '🗣️', color: 'purple' },
    { id: 'reading-aloud', name: 'Reading Aloud', icon: '📖', color: 'blue' },
    { id: 'conversation', name: 'Conversation', icon: '💬', color: 'green' }
  ];

  const exercises: SpeakingExercise[] = [
    // Pronunciation Exercises
    {
      id: 1,
      type: 'pronunciation',
      title: 'Civics Key Words',
      text: 'Constitution, democracy, liberty, freedom, citizen',
      instruction: 'Practice pronouncing these important civics terms clearly.',
      targetWords: ['Constitution', 'democracy', 'liberty', 'freedom', 'citizen'],
      difficulty: 'easy'
    },
    {
      id: 2,
      type: 'pronunciation',
      title: 'Government Terms',
      text: 'Legislative, executive, judicial, representative, amendment',
      instruction: 'Focus on clear pronunciation of these government terms.',
      targetWords: ['Legislative', 'executive', 'judicial', 'representative', 'amendment'],
      difficulty: 'medium'
    },
    {
      id: 3,
      type: 'pronunciation',
      title: 'American History Words',
      text: 'Independence, Declaration, Revolutionary, Constitution, Bill of Rights',
      instruction: 'Practice these historical terms with correct stress and pronunciation.',
      targetWords: ['Independence', 'Declaration', 'Revolutionary', 'Constitution', 'Bill of Rights'],
      difficulty: 'medium'
    },

    // Reading Aloud Exercises
    {
      id: 4,
      type: 'reading-aloud',
      title: 'Pledge of Allegiance',
      text: 'I pledge allegiance to the flag of the United States of America, and to the republic for which it stands, one nation under God, indivisible, with liberty and justice for all.',
      instruction: 'Read the Pledge of Allegiance clearly and with appropriate rhythm.',
      difficulty: 'medium'
    },
    {
      id: 5,
      type: 'reading-aloud',
      title: 'Preamble to the Constitution',
      text: 'We the People of the United States, in Order to form a more perfect Union, establish Justice, insure domestic Tranquility, provide for the common defense, promote the general Welfare, and secure the Blessings of Liberty to ourselves and our Posterity, do ordain and establish this Constitution for the United States of America.',
      instruction: 'Read this important text from the Constitution with clear enunciation.',
      difficulty: 'hard'
    },
    {
      id: 6,
      type: 'reading-aloud',
      title: 'Declaration of Independence',
      text: 'We hold these truths to be self-evident, that all men are created equal, that they are endowed by their Creator with certain unalienable Rights, that among these are Life, Liberty and the pursuit of Happiness.',
      instruction: 'Practice this famous passage with proper emphasis and clarity.',
      difficulty: 'hard'
    },

    // Conversation Exercises
    {
      id: 7,
      type: 'conversation',
      title: 'Personal Information',
      text: 'Tell me about yourself and why you want to become a U.S. citizen.',
      instruction: 'Practice answering this common interview question in 2-3 sentences.',
      difficulty: 'easy'
    },
    {
      id: 8,
      type: 'conversation',
      title: 'American Values',
      text: 'What does freedom mean to you?',
      instruction: 'Explain your understanding of freedom in America.',
      difficulty: 'medium'
    },
    {
      id: 9,
      type: 'conversation',
      title: 'Civic Responsibility',
      text: 'What are some responsibilities of American citizens?',
      instruction: 'Discuss civic duties and responsibilities.',
      difficulty: 'medium'
    }
  ];

  const filteredExercises = exercises.filter(exercise => exercise.type === currentSection);
  const currentEx = filteredExercises[currentExercise];

  const analyzeSpeech = useCallback((spokenText: string) => {
    const targetText = currentEx.text.toLowerCase();
    const spoken = spokenText.toLowerCase();
    
    let feedbackMessage = '';
    let accuracy = 0;

    if (currentEx.type === 'pronunciation' && currentEx.targetWords) {
      // Check individual words
      const correctWords = currentEx.targetWords.filter(word => 
        spoken.includes(word.toLowerCase())
      );
      accuracy = (correctWords.length / currentEx.targetWords.length) * 100;
      
      if (accuracy >= 80) {
        feedbackMessage = `Excellent pronunciation! You correctly pronounced ${correctWords.length} out of ${currentEx.targetWords.length} words.`;
      } else if (accuracy >= 60) {
        feedbackMessage = `Good job! Try to focus on: ${currentEx.targetWords.filter(word => !spoken.includes(word.toLowerCase())).join(', ')}`;
      } else {
        feedbackMessage = `Keep practicing! Focus on clear pronunciation of each word.`;
      }
    } else {
      // For reading aloud and conversation, check overall similarity
      const words = targetText.split(' ');
      const spokenWords = spoken.split(' ');
      const matchingWords = words.filter(word => spokenWords.includes(word));
      accuracy = (matchingWords.length / words.length) * 100;

      if (accuracy >= 70) {
        feedbackMessage = 'Great job! Your speech was clear and accurate.';
      } else if (accuracy >= 50) {
        feedbackMessage = 'Good effort! Try to speak more clearly and slowly.';
      } else {
        feedbackMessage = 'Keep practicing! Focus on pronouncing each word clearly.';
      }
    }

    setFeedback(feedbackMessage);
    
    // Update score if not already completed
    if (!completedExercises.includes(currentEx.id)) {
      setCompletedExercises([...completedExercises, currentEx.id]);
      if (accuracy >= 60) {
        setScore(score + 1);
      }
    }
  }, [currentEx, completedExercises, score]);

  const startRecording = () => {
    if (recognition) {
      setTranscript('');
      setFeedback('');
      setIsRecording(true);
      recognition.start();
    } else {
      setFeedback('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
    }
  };

  const stopRecording = () => {
    if (recognition) {
      recognition.stop();
    }
    setIsRecording(false);
  };

  const playText = () => {
    if (synthesis && !isPlaying) {
      const utterance = new SpeechSynthesisUtterance(currentEx.text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      
      synthesis.speak(utterance);
    } else if (synthesis && isPlaying) {
      synthesis.cancel();
      setIsPlaying(false);
    }
  };

  const nextExercise = () => {
    if (currentExercise < filteredExercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setTranscript('');
      setFeedback('');
    }
  };

  const previousExercise = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1);
      setTranscript('');
      setFeedback('');
    }
  };

  const resetSection = () => {
    setCurrentExercise(0);
    setTranscript('');
    setFeedback('');
    setScore(0);
    setCompletedExercises([]);
  };

  // Initialize speech recognition and synthesis
  useEffect(() => {
    if ('speechSynthesis' in window) {
      setSynthesis(window.speechSynthesis);
    }

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event: any) => {
        const speechResult = event.results[0][0].transcript;
        setTranscript(speechResult);
        analyzeSpeech(speechResult);
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setFeedback('Sorry, there was an error with speech recognition. Please try again.');
        setIsRecording(false);
      };

      recognitionInstance.onend = () => {
        setIsRecording(false);
      };

      setRecognition(recognitionInstance);
    }
  }, [analyzeSpeech]);

  useEffect(() => {
    resetSection();
  }, [currentSection]);

  const progress = ((currentExercise + 1) / filteredExercises.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center text-gray-600 hover:text-purple-600 transition-colors">
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Score: {score}/{completedExercises.length}</span>
            <button
              onClick={resetSection}
              className="text-sm text-purple-600 hover:text-purple-800 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Section Selection */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Speaking Practice</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setCurrentSection(section.id as 'pronunciation' | 'reading-aloud' | 'conversation')}
                className={`p-4 rounded-xl text-left transition-all ${
                  currentSection === section.id
                    ? `bg-${section.color}-600 text-white shadow-lg`
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{section.icon}</span>
                  <div>
                    <div className="font-semibold">{section.name}</div>
                    <div className="text-sm opacity-80">
                      {section.id === 'pronunciation' && 'Word & Sound Practice'}
                      {section.id === 'reading-aloud' && 'Text Reading Skills'}
                      {section.id === 'conversation' && 'Interview Preparation'}
                    </div>
                  </div>
                </div>
              </button>
            ))}
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
                currentSection === 'pronunciation' ? 'from-purple-500 to-purple-700' :
                currentSection === 'reading-aloud' ? 'from-blue-500 to-blue-700' :
                'from-green-500 to-green-700'
              } h-2 rounded-full transition-all duration-300`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Exercise Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="mb-6">
            <div className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full mb-4 ${
              currentEx.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
              currentEx.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              <span className="mr-1">
                {currentEx.difficulty === 'easy' ? '🟢' : 
                 currentEx.difficulty === 'medium' ? '🟡' : '🔴'}
              </span>
              {currentEx.difficulty} - {currentEx.title}
            </div>
            
            <p className="text-gray-600 mb-6">{currentEx.instruction}</p>

            {/* Text to Practice */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Practice Text:</h3>
                <button
                  onClick={playText}
                  className="flex items-center px-3 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  {isPlaying ? (
                    <>
                      <StopIcon className="h-4 w-4 mr-1" />
                      Stop
                    </>
                  ) : (
                    <>
                      <SpeakerWaveIcon className="h-4 w-4 mr-1" />
                      Listen
                    </>
                  )}
                </button>
              </div>
              <p className="text-gray-800 text-lg leading-relaxed">
                {currentEx.text}
              </p>
            </div>
          </div>

          {/* Recording Controls */}
          <div className="text-center mb-6">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isPlaying}
              className={`inline-flex items-center px-8 py-4 rounded-xl text-lg font-semibold transition-all ${
                isRecording 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              } disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg transform hover:scale-105`}
            >
              <MicrophoneIcon className="h-6 w-6 mr-2" />
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>
            
            {isRecording && (
              <div className="mt-4 flex justify-center">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse delay-75"></div>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse delay-150"></div>
                </div>
              </div>
            )}
          </div>

          {/* Transcript Display */}
          {transcript && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-blue-800 mb-2">What you said:</h4>
              <p className="text-blue-700">"{transcript}"</p>
            </div>
          )}

          {/* Feedback */}
          {feedback && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-green-800 mb-2">Feedback:</h4>
              <p className="text-green-700">{feedback}</p>
            </div>
          )}

          {/* Tips */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">💡 Speaking Tips:</h4>
            <ul className="text-yellow-700 text-sm space-y-1">
              <li>• Speak clearly and at a moderate pace</li>
              <li>• Take deep breaths and pause between phrases</li>
              <li>• Focus on pronunciation of key civics terms</li>
              <li>• Practice in a quiet environment for best results</li>
            </ul>
          </div>
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
                <span>Completed: {completedExercises.length}/{filteredExercises.length}</span>
              )}
            </div>
          </div>

          <button
            onClick={nextExercise}
            disabled={currentExercise === filteredExercises.length - 1}
            className={`flex items-center px-6 py-3 text-white rounded-lg transition-colors ${
              currentSection === 'pronunciation' ? 'bg-purple-600 hover:bg-purple-700' :
              currentSection === 'reading-aloud' ? 'bg-blue-600 hover:bg-blue-700' :
              'bg-green-600 hover:bg-green-700'
            } disabled:bg-gray-300 disabled:cursor-not-allowed`}
          >
            Next
            <ArrowLeftIcon className="h-5 w-5 ml-2 rotate-180" />
          </button>
        </div>

        {/* Completion Message */}
        {currentExercise === filteredExercises.length - 1 && completedExercises.includes(currentEx.id) && (
          <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">🎉 Section Complete!</h3>
            <p className="text-lg text-gray-700 mb-4">
              You've completed all {currentSection.replace('-', ' ')} exercises!
            </p>
            <p className="text-gray-600 mb-6">
              Score: {score} out of {filteredExercises.length} ({Math.round((score / filteredExercises.length) * 100)}%)
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={resetSection}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Practice Again
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

        {/* Browser Compatibility Notice */}
        {!recognition && (
          <div className="mt-8 bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-orange-800 text-sm">
              <strong>Note:</strong> Speech recognition works best in Chrome or Edge browsers. 
              If you're having issues, please try switching browsers.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpeakingTest;
