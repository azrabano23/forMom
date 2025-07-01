import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import CivicsTest from './components/CivicsTest';
import EnglishTest from './components/EnglishTest';
import SpeakingTest from './components/SpeakingTest';
import FormHelper from './components/FormHelper';
import InterviewSimulator from './components/InterviewSimulator';
import Dashboard from './components/Dashboard';
import Footer from './components/NewFooter';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50">
        <Header />
        <Routes>
          <Route path="/" element={<><Hero /><Dashboard /></>} />
          <Route path="/civics" element={<CivicsTest />} />
          <Route path="/english" element={<EnglishTest />} />
          <Route path="/speaking" element={<SpeakingTest />} />
          <Route path="/form-helper" element={<FormHelper />} />
          <Route path="/interview" element={<InterviewSimulator />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
