import React, { useState } from 'react';
import { Target, TrendingUp, Shield, Zap, Coffee, Plane, Home as HomeIcon, ArrowRight } from 'lucide-react';

export interface UserPreferences {
  spendingStyle: 'conservative' | 'moderate' | 'adventurous';
  summerGoals: string[];
  priorities: string[];
  budgetFocus: string;
}

interface UserPreferencesProps {
  onComplete: (preferences: UserPreferences) => void;
}

const UserPreferences: React.FC<UserPreferencesProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState<Partial<UserPreferences>>({});

  const spendingStyles = [
    {
      id: 'conservative',
      title: 'Conservative Spender',
      description: 'I prefer to save and spend mindfully',
      icon: Shield,
      color: 'green'
    },
    {
      id: 'moderate',
      title: 'Balanced Spender',
      description: 'I like to enjoy life while being responsible',
      icon: Target,
      color: 'blue'
    },
    {
      id: 'adventurous',
      title: 'Adventurous Spender',
      description: 'YOLO! Life is short, experiences matter',
      icon: Zap,
      color: 'purple'
    }
  ];

  const summerGoals = [
    { id: 'travel', label: 'Travel & Vacations', icon: Plane },
    { id: 'dining', label: 'Food & Dining', icon: Coffee },
    { id: 'events', label: 'Events & Entertainment', icon: Zap },
    { id: 'shopping', label: 'Shopping & Fashion', icon: Target },
    { id: 'home', label: 'Home Improvements', icon: HomeIcon },
    { id: 'savings', label: 'Building Savings', icon: TrendingUp }
  ];

  const budgetFocuses = [
    { id: 'reduce_waste', label: 'Reduce unnecessary spending', description: 'Help me cut back on impulse purchases' },
    { id: 'optimize_categories', label: 'Optimize my spending categories', description: 'Show me where to reallocate my budget' },
    { id: 'increase_savings', label: 'Increase my savings rate', description: 'Help me save more each month' },
    { id: 'plan_goals', label: 'Plan for my summer goals', description: 'Budget for my priorities this summer' }
  ];

  const handleSpendingStyleSelect = (style: string) => {
    setPreferences({ ...preferences, spendingStyle: style as any });
    setStep(2);
  };

  const handleGoalsSelect = (goals: string[]) => {
    setPreferences({ ...preferences, summerGoals: goals });
    setStep(3);
  };

  const handleBudgetFocusSelect = (focus: string) => {
    const finalPreferences = { 
      ...preferences, 
      budgetFocus: focus,
      priorities: preferences.summerGoals || []
    } as UserPreferences;
    
    onComplete(finalPreferences);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-indigo-600">Step {step} of 3</span>
            <span className="text-sm text-gray-500">{Math.round((step / 3) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {step === 1 && (
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              What's your spending style? 🤔
            </h1>
            <p className="text-xl text-gray-600 mb-12">
              Help us understand your financial personality so we can give you personalized insights
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              {spendingStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => handleSpendingStyleSelect(style.id)}
                  className={`p-8 rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg bg-white border-${style.color}-200 hover:border-${style.color}-400`}
                >
                  <style.icon className={`w-16 h-16 text-${style.color}-500 mx-auto mb-4`} />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{style.title}</h3>
                  <p className="text-gray-600">{style.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              What are your summer priorities? ☀️
            </h1>
            <p className="text-xl text-gray-600 mb-12">
              Select all that apply - we'll help you budget for what matters most
            </p>
            
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {summerGoals.map((goal) => {
                const isSelected = (preferences.summerGoals || []).includes(goal.id);
                return (
                  <button
                    key={goal.id}
                    onClick={() => {
                      const current = preferences.summerGoals || [];
                      const updated = isSelected 
                        ? current.filter(g => g !== goal.id)
                        : [...current, goal.id];
                      setPreferences({ ...preferences, summerGoals: updated });
                    }}
                    className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                      isSelected 
                        ? 'bg-indigo-500 border-indigo-500 text-white' 
                        : 'bg-white border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    <goal.icon className={`w-8 h-8 mx-auto mb-3 ${isSelected ? 'text-white' : 'text-indigo-500'}`} />
                    <span className="font-medium">{goal.label}</span>
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => handleGoalsSelect(preferences.summerGoals || [])}
              disabled={!preferences.summerGoals?.length}
              className="px-8 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto"
            >
              Continue <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              What's your main focus? 🎯
            </h1>
            <p className="text-xl text-gray-600 mb-12">
              Choose what you'd like us to help you with most
            </p>
            
            <div className="space-y-4 max-w-2xl mx-auto">
              {budgetFocuses.map((focus) => (
                <button
                  key={focus.id}
                  onClick={() => handleBudgetFocusSelect(focus.id)}
                  className="w-full p-6 text-left bg-white rounded-xl border-2 border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{focus.label}</h3>
                  <p className="text-gray-600">{focus.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPreferences;
