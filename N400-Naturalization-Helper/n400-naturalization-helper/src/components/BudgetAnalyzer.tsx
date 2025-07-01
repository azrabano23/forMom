import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { CreditCard, DollarSign, AlertTriangle, TrendingDown, Coffee, Home, UtensilsCrossed, Zap, ArrowLeft, Sparkles, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { bankingService, BudgetAnalysis } from '../services/bankingService';

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

const BudgetAnalyzer: React.FC = () => {
  const [budgetData, setBudgetData] = useState<BudgetAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [animateIn, setAnimateIn] = useState(false);
  const [hideAmounts, setHideAmounts] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    // Automatically load demo data
    const loadDemoData = async () => {
      try {
        const analysis = await bankingService.analyzeBudget();
        setBudgetData(analysis);
        setTimeout(() => setAnimateIn(true), 100); // Trigger animations
      } catch (err) {
        setError('Failed to load demo data.');
      } finally {
        setLoading(false);
      }
    };

    loadDemoData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading your financial fate...</h2>
          <p className="text-gray-600">Crunching those impulse purchases 📊</p>
        </div>
      </div>
    );
  }

  const handleRefresh = async () => {
    try {
      setLoading(true);
      // Generate new demo data
      const analysis = await bankingService.analyzeBudget();
      setBudgetData(analysis);
    } catch (err) {
      setError('Failed to refresh data.');
    } finally {
      setLoading(false);
    }
  };

  if (error || !budgetData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
          <p className="text-gray-600">{error || "Unable to analyze your budget. Maybe that's a sign?"}</p>
        </div>
      </div>
    );
  }

  const { categories, sassyMessage, matchasUntilOverdraft, totalSpent, income, savings, overdraftRisk } = budgetData;
  
  const pieData = [
    { name: 'Rent', value: categories.rent.amount, percentage: categories.rent.percentage, icon: Home },
    { name: 'Food', value: categories.food.amount, percentage: categories.food.percentage, icon: UtensilsCrossed },
    { name: 'Vices', value: categories.vices.amount, percentage: categories.vices.percentage, icon: Coffee },
    { name: 'Vibes', value: categories.vibes.amount, percentage: categories.vibes.percentage, icon: Zap },
    { name: 'Other', value: categories.other.amount, percentage: categories.other.percentage, icon: DollarSign }
  ].filter(item => item.value > 0);

  const barData = pieData.map(item => ({
    name: item.name,
    amount: item.value,
    percentage: item.percentage
  }));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getOverdraftRiskColor = (risk: number) => {
    if (risk > 80) return 'text-red-600';
    if (risk > 60) return 'text-orange-500';
    if (risk > 40) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getOverdraftRiskBg = (risk: number) => {
    if (risk > 80) return 'bg-red-100';
    if (risk > 60) return 'bg-orange-100';
    if (risk > 40) return 'bg-yellow-100';
    return 'bg-green-100';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Navigation */}
        <div className="mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </div>
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">🔥 How Broke Are You, Really? 💸</h1>
          <p className="text-xl text-gray-600">Real-Time Summer Budget Analyzer</p>
          <p className="text-sm text-gray-500 mt-2">Last 30 days of financial chaos • Chase/Bank of America simulation</p>
        </div>

        {/* Sassy Message Hero */}
        <div className={`${getOverdraftRiskBg(overdraftRisk)} rounded-lg p-6 mb-8 border-l-4 border-red-500`}>
          <div className="flex items-center">
            <AlertTriangle className={`w-8 h-8 ${getOverdraftRiskColor(overdraftRisk)} mr-4`} />
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Financial Reality Check</h2>
              <p className="text-lg text-gray-700">{sassyMessage}</p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(totalSpent)}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Income</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(income)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Savings/Loss</p>
                <p className={`text-2xl font-bold ${savings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(savings)}
                </p>
              </div>
              <CreditCard className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Matchas Until Overdraft</p>
                <p className="text-2xl font-bold text-orange-600">{matchasUntilOverdraft}</p>
                <p className="text-xs text-gray-500">@ $7.50 each</p>
              </div>
              <Coffee className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Pie Chart */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Spending Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Category Spending</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="amount" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Details */}
        <div className="bg-white rounded-lg p-6 shadow-lg mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Category Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {pieData.map((category) => {
              const IconComponent = category.icon;
              return (
                <div key={category.name} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-2">
                    <IconComponent className="w-6 h-6 mr-2" style={{ color: COLORS[category.name.toLowerCase() as keyof typeof COLORS] }} />
                    <h4 className="font-semibold text-gray-800">{category.name}</h4>
                  </div>
                  <p className="text-2xl font-bold mb-1" style={{ color: COLORS[category.name.toLowerCase() as keyof typeof COLORS] }}>
                    {formatCurrency(category.value)}
                  </p>
                  <p className="text-sm text-gray-600">{category.percentage.toFixed(1)}% of spending</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Miami Trip Assessment */}
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">🏖️ Miami Trip Feasibility Assessment</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Flight Budget</h4>
              <p className="text-lg text-red-600">~$400</p>
              <p className="text-sm text-gray-600">{savings >= 400 ? '✅ Feasible' : '❌ Not happening'}</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Hotel (3 nights)</h4>
              <p className="text-lg text-red-600">~$600</p>
              <p className="text-sm text-gray-600">{savings >= 1000 ? '✅ Feasible' : '❌ Motel 6 maybe?'}</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Food & Activities</h4>
              <p className="text-lg text-red-600">~$500</p>
              <p className="text-sm text-gray-600">{savings >= 1500 ? '✅ Live it up!' : '❌ Pack sandwiches'}</p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
            <h4 className="font-bold text-lg text-gray-800 mb-2">Verdict:</h4>
            <p className="text-xl">
              {savings >= 1500 ? '🎉 Miami here you come!' : 
               savings >= 1000 ? '🤔 Budget Miami trip possible' :
               savings >= 400 ? '✈️ Flight only, sleep on the beach' :
               '🏠 Staycation recommended'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetAnalyzer;

