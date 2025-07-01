import React, { useState } from 'react';
import UserPreferences, { UserPreferences as Preferences } from './UserPreferences';
import ModernBudgetAnalyzer from './ModernBudgetAnalyzer';

const AppContainer: React.FC = () => {
  const [preferences, setPreferences] = useState<Preferences | null>(null);

  return (
    <div className="AppContainer">
      {!preferences ? (
        <UserPreferences onComplete={setPreferences} />
      ) : (
        <ModernBudgetAnalyzer preferences={preferences} />
      )}
    </div>
  );
};

export default AppContainer;
