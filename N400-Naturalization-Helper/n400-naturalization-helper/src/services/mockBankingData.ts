export interface Transaction {
  id: string;
  account_id: string;
  amount: number;
  date: string;
  name: string;
  merchant_name?: string;
  category: string[];
  subcategory: string;
  account_owner?: string;
}

export interface Account {
  account_id: string;
  balances: {
    available: number;
    current: number;
    limit?: number;
  };
  name: string;
  type: string;
  subtype: string;
}

export interface BudgetAnalysis {
  totalSpent: number;
  income: number;
  categories: {
    rent: { amount: number; percentage: number; transactions: Transaction[] };
    food: { amount: number; percentage: number; transactions: Transaction[] };
    vices: { amount: number; percentage: number; transactions: Transaction[] };
    vibes: { amount: number; percentage: number; transactions: Transaction[] };
    other: { amount: number; percentage: number; transactions: Transaction[] };
  };
  savings: number;
  overdraftRisk: number;
  sassyMessage: string;
  matchasUntilOverdraft: number;
}

const MATCHA_PRICE = 7.50;

// Mock transaction data for the last 90 days (3 months)
const generateMockTransactions = (): Transaction[] => {
  const transactions: Transaction[] = [];
  const now = new Date();
  
  // Generate transactions for the last 90 days
  for (let i = 0; i < 90; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    const dailyTransactions = [
      // Rent (monthly)
      ...(i === 25 ? [{
        id: `rent_${i}`,
        account_id: 'acc_1',
        amount: -2200,
        date: date.toISOString().split('T')[0],
        name: 'LUXURY APARTMENTS LLC',
        category: ['Payment', 'Rent'],
        subcategory: 'rent'
      }] : []),
      
      // Food transactions
      {
        id: `food_${i}_1`,
        account_id: 'acc_1',
        amount: -(Math.random() * 25 + 10),
        date: date.toISOString().split('T')[0],
        name: ['Chipotle', 'Sweetgreen', 'McDonald\'s', 'Whole Foods', 'Trader Joe\'s'][Math.floor(Math.random() * 5)],
        category: ['Food and Drink'],
        subcategory: 'food'
      },
      
      // Coffee/Matcha (vices)
      {
        id: `coffee_${i}`,
        account_id: 'acc_1',
        amount: -(Math.random() * 8 + 4),
        date: date.toISOString().split('T')[0],
        name: ['Starbucks', 'Blue Bottle', 'Cha Cha Matcha', 'Local Coffee Co'][Math.floor(Math.random() * 4)],
        category: ['Food and Drink'],
        subcategory: 'vices'
      },
      
      // Entertainment (vibes)
      ...(Math.random() > 0.6 ? [{
        id: `entertainment_${i}`,
        account_id: 'acc_1',
        amount: -(Math.random() * 50 + 20),
        date: date.toISOString().split('T')[0],
        name: ['Netflix', 'Spotify', 'Cinema', 'Bar', 'Uber'][Math.floor(Math.random() * 5)],
        category: ['Entertainment'],
        subcategory: 'vibes'
      }] : []),
      
      // Random purchases
      ...(Math.random() > 0.7 ? [{
        id: `shopping_${i}`,
        account_id: 'acc_1',
        amount: -(Math.random() * 100 + 30),
        date: date.toISOString().split('T')[0],
        name: ['Amazon', 'Target', 'CVS', 'Gas Station'][Math.floor(Math.random() * 4)],
        category: ['Shops'],
        subcategory: 'other'
      }] : [])
    ];
    
    transactions.push(...dailyTransactions.filter(Boolean));
  }
  
  // Add some income
  transactions.push({
    id: 'salary_1',
    account_id: 'acc_1',
    amount: 4500,
    date: new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0],
    name: 'TECH COMPANY INC - SALARY',
    category: ['Payroll'],
    subcategory: 'income'
  });
  
  transactions.push({
    id: 'freelance_1',
    account_id: 'acc_1',
    amount: 800,
    date: new Date(now.getFullYear(), now.getMonth(), 15).toISOString().split('T')[0],
    name: 'FREELANCE PROJECT',
    category: ['Payroll'],
    subcategory: 'income'
  });
  
  return transactions;
};

const generatePersonalizedInsights = (analysis: Partial<BudgetAnalysis>): { message: string; insights: string[]; tips: string[] } => {
  const { categories, matchasUntilOverdraft } = analysis;
  
  if (!categories) return { 
    message: "We're still figuring out your spending patterns!", 
    insights: [], 
    tips: [] 
  };
  
  const insights = [];
  const tips = [];
  
  // Coffee/Matcha insights
  if (categories.vices && categories.vices.percentage > 15) {
    insights.push(`You're spending ${categories.vices.percentage.toFixed(1)}% on coffee and treats - that's about ${matchasUntilOverdraft} matcha lattes worth of disposable income! ☕`);
    tips.push('Try making coffee at home 2-3 days a week. You could save $50-80/month!');
  }
  
  // Food spending insights
  if (categories.food && categories.food.percentage > 25) {
    insights.push(`Food takes up ${categories.food.percentage.toFixed(1)}% of your spending. You're either a foodie or really love DoorDash! 🍕`);
    tips.push('Meal prep on Sundays can cut your food spending by 30-40%');
  }
  
  // Entertainment insights
  if (categories.vibes && categories.vibes.percentage > 20) {
    insights.push(`You spend ${categories.vibes.percentage.toFixed(1)}% on entertainment - someone knows how to have fun! 🎉`);
    tips.push('Look for happy hours and free events to keep the fun while saving money');
  }
  
  // Rent insights
  if (categories.rent && categories.rent.percentage > 35) {
    insights.push(`Rent is ${categories.rent.percentage.toFixed(1)}% of your spending - that's higher than the recommended 30%. Time to budget around it! 🏠`);
    tips.push('Consider the 50/30/20 rule: 50% needs, 30% wants, 20% savings');
  }
  
  const mainMessage = insights.length > 0 
    ? `Looking at your last 3 months, here's what caught our attention:` 
    : `You're doing pretty well with your spending! Here are some ways to optimize further:`;
    
  return { message: mainMessage, insights, tips };
};

export const mockBankingService = {
  async getAccounts(): Promise<Account[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return [
      {
        account_id: 'acc_1',
        balances: {
          available: 1250.50,
          current: 1250.50,
        },
        name: 'Chase Checking',
        type: 'depository',
        subtype: 'checking'
      }
    ];
  },
  
  async getTransactions(accountId: string): Promise<Transaction[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return generateMockTransactions();
  },
  
  async analyzeBudget(): Promise<BudgetAnalysis> {
    const transactions = await this.getTransactions('acc_1');
    const accounts = await this.getAccounts();
    
    const expenses = transactions.filter(t => t.amount < 0);
    const income = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
    const totalSpent = Math.abs(expenses.reduce((sum, t) => sum + t.amount, 0));
    
    // Categorize expenses
    const categories = {
      rent: { amount: 0, percentage: 0, transactions: [] as Transaction[] },
      food: { amount: 0, percentage: 0, transactions: [] as Transaction[] },
      vices: { amount: 0, percentage: 0, transactions: [] as Transaction[] },
      vibes: { amount: 0, percentage: 0, transactions: [] as Transaction[] },
      other: { amount: 0, percentage: 0, transactions: [] as Transaction[] }
    };
    
    expenses.forEach(transaction => {
      const amount = Math.abs(transaction.amount);
      const category = transaction.subcategory;
      
      if (category === 'rent') {
        categories.rent.amount += amount;
        categories.rent.transactions.push(transaction);
      } else if (category === 'food') {
        categories.food.amount += amount;
        categories.food.transactions.push(transaction);
      } else if (category === 'vices') {
        categories.vices.amount += amount;
        categories.vices.transactions.push(transaction);
      } else if (category === 'vibes') {
        categories.vibes.amount += amount;
        categories.vibes.transactions.push(transaction);
      } else {
        categories.other.amount += amount;
        categories.other.transactions.push(transaction);
      }
    });
    
    // Calculate percentages
    Object.keys(categories).forEach(key => {
      const cat = categories[key as keyof typeof categories];
      cat.percentage = (cat.amount / totalSpent) * 100;
    });
    
    const currentBalance = accounts[0]?.balances.current || 0;
    const savings = income - totalSpent;
    const overdraftRisk = Math.max(0, Math.min(100, (1 - (currentBalance / totalSpent)) * 100));
    const matchasUntilOverdraft = Math.floor(currentBalance / MATCHA_PRICE);
    
    const analysis: BudgetAnalysis = {
      totalSpent,
      income,
      categories,
      savings,
      overdraftRisk,
      sassyMessage: '',
      matchasUntilOverdraft
    };
    
    const personalizedData = generatePersonalizedInsights(analysis);
    analysis.sassyMessage = personalizedData.message;
    
    return analysis;
  }
};
