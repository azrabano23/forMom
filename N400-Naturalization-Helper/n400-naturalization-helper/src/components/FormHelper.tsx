import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, DocumentTextIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

interface FormSection {
  id: string;
  title: string;
  description: string;
  questions: FormQuestion[];
}

interface FormQuestion {
  id: string;
  question: string;
  type: 'text' | 'radio' | 'checkbox' | 'date' | 'address';
  options?: string[];
  required: boolean;
  tips: string;
  commonMistakes: string[];
  example?: string;
}

const FormHelper: React.FC = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [showTips, setShowTips] = useState<Record<string, boolean>>({});

  const formSections: FormSection[] = [
    {
      id: 'personal-info',
      title: 'Personal Information',
      description: 'Basic information about yourself',
      questions: [
        {
          id: 'legal-name',
          question: 'What is your current legal name?',
          type: 'text',
          required: true,
          tips: 'Use your full legal name exactly as it appears on your green card and other official documents.',
          commonMistakes: [
            'Using nicknames instead of legal names',
            'Not including middle names that appear on official documents',
            'Misspelling names'
          ],
          example: 'Maria Elena Rodriguez-Smith'
        },
        {
          id: 'other-names',
          question: 'Have you used any other names?',
          type: 'radio',
          options: ['Yes', 'No'],
          required: true,
          tips: 'Include maiden names, previous married names, nicknames used on official documents, and any name changes.',
          commonMistakes: [
            'Forgetting to mention maiden names',
            'Not listing names used on work documents',
            'Omitting nicknames used on official paperwork'
          ]
        },
        {
          id: 'birth-date',
          question: 'What is your date of birth?',
          type: 'date',
          required: true,
          tips: 'Use the exact date from your birth certificate. If you don\'t know the exact date, use January 1st of your birth year.',
          commonMistakes: [
            'Using MM/DD/YYYY instead of MM/DD/YYYY format',
            'Guessing at unknown dates instead of using January 1st',
            'Not matching the date on previous immigration documents'
          ],
          example: '03/15/1985'
        }
      ]
    },
    {
      id: 'background',
      title: 'Background Information',
      description: 'Information about your history and family',
      questions: [
        {
          id: 'country-birth',
          question: 'What is your country of birth?',
          type: 'text',
          required: true,
          tips: 'Use the name of the country as it was called when you were born, not the current name.',
          commonMistakes: [
            'Using current country names for historical countries',
            'Not being specific about regions (e.g., "Soviet Union" vs specific republic)',
            'Abbreviating country names'
          ],
          example: 'If born in 1980 in Ukraine, write "Ukraine" not "Soviet Union"'
        },
        {
          id: 'parents-citizens',
          question: 'Are your parents U.S. citizens?',
          type: 'radio',
          options: ['Yes, both parents', 'Yes, one parent', 'No, neither parent', 'Unknown'],
          required: true,
          tips: 'This determines if you might already be a U.S. citizen through your parents.',
          commonMistakes: [
            'Not checking if parents became citizens after your birth',
            'Confusing green card holders with citizens',
            'Not considering step-parents who legally adopted you'
          ]
        },
        {
          id: 'marital-status',
          question: 'What is your current marital status?',
          type: 'radio',
          options: ['Single', 'Married', 'Divorced', 'Widowed', 'Separated', 'Annulled'],
          required: true,
          tips: 'Choose your current legal status. If separated but not legally divorced, choose "Separated".',
          commonMistakes: [
            'Choosing "Single" when legally separated',
            'Not updating status if divorced after filing began',
            'Confusion about common-law marriage recognition'
          ]
        }
      ]
    },
    {
      id: 'residence-travel',
      title: 'Residence and Travel',
      description: 'Where you have lived and your travel history',
      questions: [
        {
          id: 'current-address',
          question: 'What is your current physical address?',
          type: 'address',
          required: true,
          tips: 'Use your actual physical residence, not a P.O. Box. This should match your green card address or have a filed address change.',
          commonMistakes: [
            'Using P.O. Box instead of physical address',
            'Not updating address with USCIS before filing',
            'Using work address instead of home address'
          ],
          example: '123 Main Street, Apt 4B, New York, NY 10001'
        },
        {
          id: 'time-outside-us',
          question: 'Have you been outside the U.S. for 6 months or more since becoming a permanent resident?',
          type: 'radio',
          options: ['Yes', 'No'],
          required: true,
          tips: 'This includes any single trip or multiple trips totaling 6+ months. Be prepared to explain long absences.',
          commonMistakes: [
            'Not counting multiple shorter trips that total 6+ months',
            'Forgetting trips for work or family emergencies',
            'Not having documentation for long trips'
          ]
        }
      ]
    },
    {
      id: 'background-check',
      title: 'Background and Character',
      description: 'Questions about your criminal and moral character',
      questions: [
        {
          id: 'arrested',
          question: 'Have you ever been arrested, cited, or detained by any law enforcement officer?',
          type: 'radio',
          options: ['Yes', 'No'],
          required: true,
          tips: 'Answer "Yes" even for minor infractions, traffic tickets, or charges that were dropped. You must disclose everything.',
          commonMistakes: [
            'Not mentioning traffic tickets',
            'Thinking dropped charges don\'t count',
            'Forgetting arrests from many years ago',
            'Not mentioning arrests in other countries'
          ]
        },
        {
          id: 'taxes',
          question: 'Have you filed tax returns as required by law?',
          type: 'radio',
          options: ['Yes', 'No', 'Not required to file'],
          required: true,
          tips: 'If you were required to file taxes but didn\'t, this could affect your application. Get tax advice if needed.',
          commonMistakes: [
            'Not filing required tax returns',
            'Filing as a non-resident when you should file as a resident',
            'Not having copies of tax returns for interview'
          ]
        }
      ]
    }
  ];

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const toggleTips = (questionId: string) => {
    setShowTips(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const getCurrentSection = () => formSections[currentSection];
  const progress = ((currentSection + 1) / formSections.length) * 100;

  const nextSection = () => {
    if (currentSection < formSections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const previousSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const renderQuestion = (question: FormQuestion) => {
    const answer = answers[question.id];
    
    return (
      <div key={question.id} className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {question.question}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </h3>
          </div>
          <button
            onClick={() => toggleTips(question.id)}
            className="ml-4 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <InformationCircleIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Tips Section */}
        {showTips[question.id] && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">💡 Tips:</h4>
            <p className="text-blue-700 text-sm mb-3">{question.tips}</p>
            
            {question.example && (
              <div className="mb-3">
                <h5 className="font-semibold text-blue-800 text-sm mb-1">Example:</h5>
                <p className="text-blue-700 text-sm italic">{question.example}</p>
              </div>
            )}

            <div>
              <h5 className="font-semibold text-red-800 text-sm mb-2">⚠️ Common Mistakes:</h5>
              <ul className="space-y-1">
                {question.commonMistakes.map((mistake, index) => (
                  <li key={index} className="text-red-700 text-sm flex items-start">
                    <span className="mr-2">•</span>
                    <span>{mistake}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Answer Input */}
        <div className="space-y-3">
          {question.type === 'text' && (
            <input
              type="text"
              value={answer || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
              placeholder="Enter your answer..."
            />
          )}

          {question.type === 'date' && (
            <input
              type="date"
              value={answer || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
            />
          )}

          {question.type === 'radio' && question.options && (
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <label key={index} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name={question.id}
                    value={option}
                    checked={answer === option}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          )}

          {question.type === 'address' && (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Street Address"
                value={answer?.street || ''}
                onChange={(e) => handleAnswerChange(question.id, { ...answer, street: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="City"
                  value={answer?.city || ''}
                  onChange={(e) => handleAnswerChange(question.id, { ...answer, city: e.target.value })}
                  className="p-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="State"
                  value={answer?.state || ''}
                  onChange={(e) => handleAnswerChange(question.id, { ...answer, state: e.target.value })}
                  className="p-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="ZIP Code"
                  value={answer?.zip || ''}
                  onChange={(e) => handleAnswerChange(question.id, { ...answer, zip: e.target.value })}
                  className="p-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center text-gray-600 hover:text-orange-600 transition-colors">
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Section {currentSection + 1} of {formSections.length}</span>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">N-400 Form Helper</h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {formSections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => setCurrentSection(index)}
                className={`p-3 rounded-lg text-sm font-medium transition-all ${
                  currentSection === index
                    ? 'bg-orange-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <div className="text-xs opacity-80 mb-1">Part {index + 1}</div>
                {section.title}
              </button>
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>{getCurrentSection().title}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-orange-500 to-yellow-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Section Content */}
        <div className="mb-8">
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-6">
            <div className="flex items-center space-x-3 mb-3">
              <DocumentTextIcon className="h-6 w-6 text-orange-600" />
              <h2 className="text-xl font-bold text-gray-900">{getCurrentSection().title}</h2>
            </div>
            <p className="text-gray-700">{getCurrentSection().description}</p>
          </div>

          {/* Questions */}
          <div className="space-y-6">
            {getCurrentSection().questions.map(renderQuestion)}
          </div>
        </div>

        {/* Important Reminders */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
          <div className="flex items-start space-x-3">
            <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 mt-1" />
            <div>
              <h3 className="font-semibold text-yellow-800 mb-2">Important Reminders:</h3>
              <ul className="text-yellow-700 text-sm space-y-1">
                <li>• Always tell the truth, even if you think it might hurt your case</li>
                <li>• Keep copies of all documents you submit with your application</li>
                <li>• If you're unsure about an answer, consult with an immigration attorney</li>
                <li>• Review your entire form before submitting to check for errors</li>
                <li>• Bring all supporting documents to your interview</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={previousSection}
            disabled={currentSection === 0}
            className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Previous Section
          </button>
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Need help? Consider consulting with an immigration attorney
            </p>
          </div>

          <button
            onClick={nextSection}
            disabled={currentSection === formSections.length - 1}
            className="flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Next Section
            <ArrowLeftIcon className="h-5 w-5 ml-2 rotate-180" />
          </button>
        </div>

        {/* Completion Message */}
        {currentSection === formSections.length - 1 && (
          <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">🎉 Form Review Complete!</h3>
            <p className="text-lg text-gray-700 mb-4">
              You've reviewed all major sections of the N-400 form!
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
              <h4 className="font-semibold text-blue-800 mb-2">Next Steps:</h4>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>1. Download the official N-400 form from USCIS.gov</li>
                <li>2. Gather all required supporting documents</li>
                <li>3. Complete the form carefully using the guidance you've learned</li>
                <li>4. Review everything multiple times before submitting</li>
                <li>5. Submit your application with the required fee</li>
              </ul>
            </div>
            <div className="flex justify-center space-x-4">
              <Link
                to="/interview"
                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Practice Interview
              </Link>
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

export default FormHelper;
