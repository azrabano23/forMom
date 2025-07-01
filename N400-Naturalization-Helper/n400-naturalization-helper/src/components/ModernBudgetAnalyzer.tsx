import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';
import { CreditCard, DollarSign, AlertTriangle, TrendingDown, Coffee, Home, UtensilsCrossed, Zap, ArrowLeft, Sparkles, RefreshCw, Eye, EyeOff, Target, Flame, Award } from 'lucide-react';
import { bankingService, BudgetAnalysis } from '../services/bankingService';
import { UserPreferences } from './UserPreferences';
import { usePlaidLink } from 'react-plaid-link';

const COLORS = {
  rent: '#EF4444',
  food: '#10B981', 
  vices: '#F59E0B',
  vibes: '#8B5CF6',
  other: '#6B7280'
};

const GRADIENTS = {
  rent: 'from-red-500 to-red-600',
  food: 'from-green-500 to-green-600',
  vices: 'from-yellow-500 to-orange-500',
  vibes: 'from-purple-500 to-indigo-500',
  other: 'from-gray-500 to-gray-600'
};

interface ModernBudgetAnalyzerProps {
  preferences: UserPreferences;
}

const ModernBudgetAnalyzer: React.FC<ModernBudgetAnalyzerProps> = ({ preferences }) => {
  const [budgetData, setBudgetData] = useState<BudgetAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [animateIn, setAnimateIn] = useState(false);
  const [hideAmounts, setHideAmounts] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [serverAvailable, setServerAvailable] = useState<boolean | null>(null);
  
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check if server is available
        const isServerAvailable = await bankingService.checkServerHealth();
        setServerAvailable(isServerAvailable);
        
        if (isServerAvailable) {
          try {
            // Try to create link token for real banking
            const token = await bankingService.createLinkToken();
            setLinkToken(token);
          } catch (err) {
            console.log('Link token creation failed, will use demo data');
            // Load demo data if link token fails
            const analysis = await bankingService.analyzeBudget();
            setBudgetData(analysis);
            setTimeout(() => setAnimateIn(true), 300);
            setLoading(false);
          }
        } else {
          // Server not available, use demo data
          const analysis = await bankingService.analyzeBudget();
          setBudgetData(analysis);
          setTimeout(() => setAnimateIn(true), 300);
          setLoading(false);
        }
      } catch (err) {
        setError('Failed to initialize app.');
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  const onPlaidSuccess = React.useCallback(async (publicToken: string) => {
    try {
      setLoading(true);
      const token = await bankingService.exchangePublicToken(publicToken);
      setAccessToken(token);
      const analysis = await bankingService.analyzeBudget(token);
      setBudgetData(analysis);
      setTimeout(() => setAnimateIn(true), 300);
    } catch (err) {
      setError('Failed to analyze your budget.');
    } finally {
      setLoading(false);
    }
  }, []);

  const { open, ready } = usePlaidLink({
    token: linkToken || '',
    onSuccess: onPlaidSuccess,
  });

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      setAnimateIn(false);
      const analysis = await bankingService.analyzeBudget(accessToken || undefined);
      setBudgetData(analysis);
      setTimeout(() => setAnimateIn(true), 100);
    } catch (err) {
      setError('Failed to refresh data.');
    } finally {
      setRefreshing(false);
    }
  };
  
  const handleDemoMode = async () => {
    try {
      setLoading(true);
      const analysis = await bankingService.analyzeBudget();
      setBudgetData(analysis);
      setTimeout(() => setAnimateIn(true), 300);
    } catch (err) {
      setError('Failed to load demo data.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-32 w-32 border-4 border-purple-200 border-t-purple-600 mx-auto mb-8"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-purple-400 animate-pulse" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Analyzing Your Financial Chaos</h2>
          <p className="text-purple-200 text-lg">Preparing some brutal honesty... 💸</p>
        </div>
      </div>
    );
  }

  // Show connection interface if we have a link token but no budget data
  if (linkToken && !budgetData && !error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CreditCard className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Connect Your Bank Account</h2>
          <p className="text-purple-200 mb-8">Securely connect your Chase, Bank of America, or Apple Cash account to get personalized insights about your spending.</p>
          
          <button 
            onClick={() => open()} 
            disabled={!ready} 
            className="w-full mb-4 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-4 px-6 rounded-xl text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105" 
          >
            🔗 Connect Bank Account
          </button>
          
          <div className="border-t border-white/20 pt-6">
            <p className="text-sm text-purple-300 mb-4">Or try with demo data first:</p>
            <button 
              onClick={handleDemoMode}
              className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              📊 Use Demo Data
            </button>
          </div>
          
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-400/30 rounded-lg">
            <p className="text-xs text-blue-200">🔒 Your data is secure and encrypted. We use Plaid's bank-level security.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !budgetData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center p-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Oops!</h2>
          <p className="text-purple-200">{error || "Unable to analyze your budget. Maybe that's a sign?"}</p>
          <div className="mt-6 space-y-3">
            <button 
              onClick={handleRefresh}
              className="block w-full px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
            <button 
              onClick={handleDemoMode}
              className="block w-full px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              Use Demo Data Instead
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { categories, sassyMessage, matchasUntilOverdraft, totalSpent, income, savings, overdraftRisk, bankName } = budgetData;
  
  const pieData = [
    { name: 'Rent', value: categories.rent.amount, percentage: categories.rent.percentage, icon: Home, color: COLORS.rent },
    { name: 'Food', value: categories.food.amount, percentage: categories.food.percentage, icon: UtensilsCrossed, color: COLORS.food },
    { name: 'Vices', value: categories.vices.amount, percentage: categories.vices.percentage, icon: Coffee, color: COLORS.vices },
    { name: 'Vibes', value: categories.vibes.amount, percentage: categories.vibes.percentage, icon: Zap, color: COLORS.vibes },
    { name: 'Other', value: categories.other.amount, percentage: categories.other.percentage, icon: DollarSign, color: COLORS.other }
  ].filter(item => item.value > 0);

  const formatCurrency = (amount: number) => {
    if (hideAmounts) return '***';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getOverdraftRiskLevel = (risk: number) => {
    if (risk > 80) return { text: 'CRITICAL', color: 'text-red-400', bg: 'bg-red-500/20' };
    if (risk > 60) return { text: 'HIGH', color: 'text-orange-400', bg: 'bg-orange-500/20' };
    if (risk > 40) return { text: 'MEDIUM', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    return { text: 'LOW', color: 'text-green-400', bg: 'bg-green-500/20' };
  };

  const riskLevel = getOverdraftRiskLevel(overdraftRisk);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Navigation */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <Link 
                to="/" 
                className="inline-flex items-center text-purple-200 hover:text-white transition-colors duration-200 group"
              >
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Home
              </Link>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setHideAmounts(!hideAmounts)}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors"
                >
                  {hideAmounts ? <Eye className="w-4 h-4 text-white" /> : <EyeOff className="w-4 h-4 text-white" />}
                  <span className="text-white text-sm">{hideAmounts ? 'Show' : 'Hide'} Amounts</span>
                </button>
                
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-lg transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 text-white ${refreshing ? 'animate-spin' : ''}`} />
                  <span className="text-white text-sm">Refresh</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Header */}
          <div className={`text-center mb-12 transition-all duration-1000 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex items-center justify-center mb-6">
              <Flame className="w-12 h-12 text-red-400 mr-4 animate-pulse" />
              <h1 className="text-6xl font-bold bg-gradient-to-r from-red-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                How Broke Are You, Really?
              </h1>
              <Flame className="w-12 h-12 text-red-400 ml-4 animate-pulse" />
            </div>
            <p className="text-2xl text-purple-200 mb-4">AI-Powered Financial Reality Check</p>
            <div className="flex items-center justify-center space-x-4 text-sm text-purple-300">
              <span>Connected to: {bankName}</span>
              <span>•</span>
              <span>Last 30 days analyzed</span>
              <span>•</span>
              <span className="flex items-center">
                <Target className="w-4 h-4 mr-1" />
                Real-time insights
              </span>
            </div>
          </div>

          {/* Sassy Message Hero */}
          <div className={`${riskLevel.bg} backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/20 transition-all duration-1000 delay-200 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className={`w-16 h-16 ${riskLevel.bg} rounded-full flex items-center justify-center border border-white/30`}>
                  <AlertTriangle className={`w-8 h-8 ${riskLevel.color}`} />
                </div>
              </div>
              <div className="ml-6 flex-1">
                <div className="flex items-center mb-3">
                  <h2 className="text-2xl font-bold text-white mr-4">Financial Reality Check</h2>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${riskLevel.bg} ${riskLevel.color} border border-current`}>
                    {riskLevel.text} RISK
                  </span>
                </div>
                <p className="text-xl text-purple-100 leading-relaxed">{sassyMessage}</p>
              </div>
            </div>
          </div>

          {/* Key Metrics Dashboard */}
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 transition-all duration-1000 delay-300 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {[
              { label: 'Total Spent', value: totalSpent, icon: TrendingDown, color: 'red', trend: '-' },
              { label: 'Monthly Income', value: income, icon: DollarSign, color: 'green', trend: '+' },
              { label: savings >= 0 ? 'Savings' : 'Loss', value: Math.abs(savings), icon: CreditCard, color: savings >= 0 ? 'green' : 'red', trend: savings >= 0 ? '+' : '-' },
              { label: 'Matcha Lattes Until Overdraft', value: matchasUntilOverdraft, icon: Coffee, color: 'orange', isSpecial: true }
            ].map((metric, index) => (
              <div key={metric.label} className="group hover:scale-105 transition-transform duration-300">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <metric.icon className={`w-8 h-8 text-${metric.color}-400`} />
                    {metric.isSpecial && <Award className="w-5 h-5 text-yellow-400" />}
                  </div>
                  <p className="text-sm font-medium text-purple-200 mb-2">{metric.label}</p>
                  <p className={`text-3xl font-bold text-${metric.color}-400`}>
                    {metric.isSpecial ? (hideAmounts ? '***' : metric.value) : `${metric.trend}${formatCurrency(metric.value)}`}
                  </p>
                  {metric.isSpecial && (
                    <p className="text-xs text-purple-300 mt-1">@ $7.50 each</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Tab Navigation */}
          <div className={`flex space-x-1 bg-white/10 backdrop-blur-sm rounded-2xl p-2 mb-8 transition-all duration-1000 delay-400 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {[
              { id: 'overview', label: 'Overview', icon: Target },
              { id: 'breakdown', label: 'Breakdown', icon: Zap },
              { id: 'insights', label: 'Insights & Tips', icon: Sparkles }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === tab.id 
                    ? 'bg-purple-600 text-white shadow-lg' 
                    : 'text-purple-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className={`transition-all duration-500 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Pie Chart */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <Zap className="w-6 h-6 mr-3 text-purple-400" />
                    Spending Breakdown
                  </h3>
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }) => hideAmounts ? name : `${name}: ${percentage.toFixed(1)}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        animationBegin={0}
                        animationDuration={1000}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => hideAmounts ? '***' : formatCurrency(Number(value))}
                        contentStyle={{
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '12px',
                          color: 'white'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Bar Chart */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <Target className="w-6 h-6 mr-3 text-purple-400" />
                    Category Analysis
                  </h3>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={pieData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                      <XAxis 
                        dataKey="name" 
                        stroke="rgba(255, 255, 255, 0.7)"
                        fontSize={12}
                      />
                      <YAxis 
                        stroke="rgba(255, 255, 255, 0.7)"
                        fontSize={12}
                      />
                      <Tooltip 
                        formatter={(value) => hideAmounts ? '***' : formatCurrency(Number(value))}
                        contentStyle={{
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '12px',
                          color: 'white'
                        }}
                      />
                      <Bar 
                        dataKey="value" 
                        fill="url(#gradient)"
                        radius={[8, 8, 0, 0]}
                        animationDuration={1000}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {activeTab === 'breakdown' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pieData.map((category, index) => {
                  const IconComponent = category.icon;
                  const gradientClass = GRADIENTS[category.name.toLowerCase() as keyof typeof GRADIENTS];
                  return (
                    <div 
                      key={category.name} 
                      className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${gradientClass} rounded-xl flex items-center justify-center mr-4`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="text-xl font-bold text-white">{category.name}</h4>
                      </div>
                      <p className={`text-3xl font-bold mb-2`} style={{ color: category.color }}>
                        {formatCurrency(category.value)}
                      </p>
                      <p className="text-purple-200">{category.percentage.toFixed(1)}% of total spending</p>
                      <div className="mt-4 bg-white/10 rounded-full h-2">
                        <div 
                          className={`h-2 bg-gradient-to-r ${gradientClass} rounded-full transition-all duration-1000`}
                          style={{ width: `${category.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'insights' && (
              <div className="space-y-8">
                {/* Personal Insights */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                  <h3 className="text-3xl font-bold text-white mb-6 flex items-center">
                    <Sparkles className="w-8 h-8 mr-3 text-yellow-400" />
                    Personalized Insights for {preferences.spendingStyle === 'conservative' ? 'Conservative' : preferences.spendingStyle === 'moderate' ? 'Balanced' : 'Adventurous'} Spenders
                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Key Insights */}
                    <div className="space-y-4">
                      <h4 className="text-xl font-bold text-purple-200 mb-4">💡 Key Insights</h4>
                      {categories.vices && categories.vices.percentage > 15 && (
                        <div className="bg-orange-500/20 border border-orange-400/50 rounded-lg p-4">
                          <p className="text-orange-200">You're spending <strong>{categories.vices.percentage.toFixed(1)}%</strong> on coffee and treats - that's about <strong>{matchasUntilOverdraft}</strong> matcha lattes worth! ☕</p>
                        </div>
                      )}
                      
                      {categories.food && categories.food.percentage > 25 && (
                        <div className="bg-green-500/20 border border-green-400/50 rounded-lg p-4">
                          <p className="text-green-200">Food takes up <strong>{categories.food.percentage.toFixed(1)}%</strong> of your spending. You're either a foodie or really love delivery! 🍕</p>
                        </div>
                      )}
                      
                      {categories.vibes && categories.vibes.percentage > 20 && (
                        <div className="bg-purple-500/20 border border-purple-400/50 rounded-lg p-4">
                          <p className="text-purple-200">You spend <strong>{categories.vibes.percentage.toFixed(1)}%</strong> on entertainment - someone knows how to have fun! 🎉</p>
                        </div>
                      )}
                      
                      {categories.rent && categories.rent.percentage > 35 && (
                        <div className="bg-red-500/20 border border-red-400/50 rounded-lg p-4">
                          <p className="text-red-200">Rent is <strong>{categories.rent.percentage.toFixed(1)}%</strong> of your spending - higher than the recommended 30%. Time to budget around it! 🏠</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Personalized Tips */}
                    <div className="space-y-4">
                      <h4 className="text-xl font-bold text-purple-200 mb-4">🎯 Tips for Your Goals</h4>
                      <div className="space-y-3">
                        {preferences.summerGoals.includes('savings') && (
                          <div className="bg-blue-500/20 border border-blue-400/50 rounded-lg p-4">
                            <h5 className="font-semibold text-blue-200 mb-2">💰 Building Savings</h5>
                            <p className="text-blue-100 text-sm">Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings. You could save an extra ${(totalSpent * 0.1).toFixed(0)}/month!</p>
                          </div>
                        )}
                        
                        {preferences.summerGoals.includes('dining') && categories.food.percentage > 20 && (
                          <div className="bg-green-500/20 border border-green-400/50 rounded-lg p-4">
                            <h5 className="font-semibold text-green-200 mb-2">🍽️ Smart Dining</h5>
                            <p className="text-green-100 text-sm">Meal prep 2-3 days a week to save $50-80/month while still enjoying great food!</p>
                          </div>
                        )}
                        
                        {preferences.summerGoals.includes('travel') && (
                          <div className="bg-purple-500/20 border border-purple-400/50 rounded-lg p-4">
                            <h5 className="font-semibold text-purple-200 mb-2">✈️ Travel Fund</h5>
                            <p className="text-purple-100 text-sm">Set aside ${Math.max(50, Math.round(totalSpent * 0.1))}/month for travel. You could have ${Math.max(50, Math.round(totalSpent * 0.1)) * 6} for a trip in 6 months!</p>
                          </div>
                        )}
                        
                        {categories.vices.percentage > 15 && (
                          <div className="bg-yellow-500/20 border border-yellow-400/50 rounded-lg p-4">
                            <h5 className="font-semibold text-yellow-200 mb-2">☕ Coffee Hack</h5>
                            <p className="text-yellow-100 text-sm">Make coffee at home 2-3 days a week. You'll save money without giving up your daily ritual!</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Summer Budget Planner */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                  <h3 className="text-2xl font-bold text-white mb-6">☀️ Summer Budget Planner</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {preferences.summerGoals.map((goal) => {
                      const goalInfo = {
                        travel: { emoji: '✈️', label: 'Travel & Vacations', budget: Math.round(totalSpent * 0.15) },
                        dining: { emoji: '🍽️', label: 'Food & Dining', budget: Math.round(totalSpent * 0.12) },
                        events: { emoji: '🎉', label: 'Events & Entertainment', budget: Math.round(totalSpent * 0.10) },
                        shopping: { emoji: '🛍️', label: 'Shopping & Fashion', budget: Math.round(totalSpent * 0.08) },
                        home: { emoji: '🏠', label: 'Home Improvements', budget: Math.round(totalSpent * 0.12) },
                        savings: { emoji: '💰', label: 'Building Savings', budget: Math.round(totalSpent * 0.20) }
                      }[goal];
                      
                      if (!goalInfo) return null;
                      
                      const canAfford = savings >= goalInfo.budget;
                      
                      return (
                        <div key={goal} className={`text-center p-6 rounded-xl border transition-all duration-300 ${canAfford ? 'bg-green-500/20 border-green-400/50' : 'bg-yellow-500/20 border-yellow-400/50'}`}>
                          <div className="text-3xl mb-3">{goalInfo.emoji}</div>
                          <h4 className="font-bold text-white mb-2">{goalInfo.label}</h4>
                          <p className="text-xl font-bold text-yellow-400 mb-2">{formatCurrency(goalInfo.budget)}/month</p>
                          <p className={`text-sm font-medium ${canAfford ? 'text-green-400' : 'text-yellow-400'}`}>
                            {canAfford ? '✅ Achievable' : '⚠️ Stretch goal'}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernBudgetAnalyzer;
