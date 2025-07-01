import React from 'react';
import { Link } from 'react-router-dom';
import { 
  AcademicCapIcon, 
  DocumentTextIcon, 
  MicrophoneIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
  const testSections = [
    {
      title: 'Civics Test',
      description: 'Practice all 100 civics questions across 5 key categories',
      icon: AcademicCapIcon,
      link: '/civics',
      color: 'from-blue-500 to-blue-700',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      features: ['100+ Questions', '5 Categories', 'Adaptive Learning', 'Progress Tracking']
    },
    {
      title: 'English Test',
      description: 'Reading comprehension, writing practice, and vocabulary building',
      icon: DocumentTextIcon,
      link: '/english',
      color: 'from-green-500 to-green-700',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      features: ['Reading Practice', 'Writing Exercises', 'Spelling Tests', 'Grammar Check']
    },
    {
      title: 'Speaking Practice',
      description: 'Voice recognition and pronunciation feedback',
      icon: MicrophoneIcon,
      link: '/speaking',
      color: 'from-purple-500 to-purple-700',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      features: ['Voice Recognition', 'Pronunciation', 'Accent Training', 'Real-time Feedback']
    },
    {
      title: 'Form Helper',
      description: 'Understand and practice filling out the N-400 form',
      icon: ClipboardDocumentListIcon,
      link: '/form-helper',
      color: 'from-orange-500 to-orange-700',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      features: ['Form Walkthrough', 'Common Mistakes', 'Sample Answers', 'Tips & Tricks']
    },
    {
      title: 'Mock Interview',
      description: 'Full interview simulation with AI interviewer',
      icon: UserGroupIcon,
      link: '/interview',
      color: 'from-red-500 to-red-700',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      features: ['AI Interviewer', 'Real Scenarios', 'Performance Review', 'Confidence Building']
    }
  ];

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Practice Test
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive practice platform covers every aspect of the N-400 naturalization test. 
            Start with any section and track your progress across all areas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testSections.map((section, index) => {
            const IconComponent = section.icon;
            return (
              <div
                key={index}
                className={`${section.bgColor} rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100`}
              >
                <div className="flex items-center justify-center mb-6">
                  <div className={`p-4 rounded-2xl bg-gradient-to-r ${section.color}`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">
                  {section.title}
                </h3>
                
                <p className="text-gray-600 mb-6 text-center">
                  {section.description}
                </p>
                
                <ul className="space-y-2 mb-8">
                  {section.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-current rounded-full mr-3 opacity-60"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Link
                  to={section.link}
                  className={`block w-full text-center py-3 px-6 bg-gradient-to-r ${section.color} text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200`}
                >
                  Start Practice
                </Link>
              </div>
            );
          })}
        </div>

        {/* Additional Info Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-red-50 rounded-2xl p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              🏆 Complete Test Preparation
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Our practice platform helps you prepare for every aspect of the N-400 naturalization test. 
              Study at your own pace with comprehensive materials and feedback.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">24/7</div>
                <div className="text-sm text-gray-600">Available Practice</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">5</div>
                <div className="text-sm text-gray-600">Practice Areas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">Free</div>
                <div className="text-sm text-gray-600">No Hidden Costs</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
