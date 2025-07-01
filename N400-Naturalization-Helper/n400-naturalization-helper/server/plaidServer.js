const express = require('express');
const cors = require('cors');
const { Configuration, PlaidApi, PlaidEnvironments, Products, CountryCode } = require('plaid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Plaid configuration
const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox, // Use sandbox for development
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.REACT_APP_PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.REACT_APP_PLAID_SECRET,
    },
  },
});

const plaidClient = new PlaidApi(configuration);

// Category mapping for different spending types
const categorizeTransaction = (transaction) => {
  const category = transaction.category?.[0]?.toLowerCase() || '';
  const name = transaction.name?.toLowerCase() || '';
  const merchantName = transaction.merchant_name?.toLowerCase() || '';
  
  // Rent/Housing
  if (category.includes('rent') || 
      name.includes('rent') || 
      name.includes('apartment') ||
      name.includes('housing') ||
      category.includes('mortgage')) {
    return 'rent';
  }
  
  // Food & Dining
  if (category.includes('food') || 
      category.includes('restaurant') ||
      category.includes('grocery') ||
      name.includes('restaurant') ||
      merchantName.includes('restaurant') ||
      name.includes('food') ||
      name.includes('grocery')) {
    return 'food';
  }
  
  // Vices (Coffee, Alcohol, etc.)
  if (name.includes('starbucks') ||
      name.includes('coffee') ||
      name.includes('cafe') ||
      name.includes('bar') ||
      name.includes('liquor') ||
      name.includes('brewery') ||
      name.includes('matcha') ||
      merchantName.includes('coffee') ||
      merchantName.includes('starbucks')) {
    return 'vices';
  }
  
  // Vibes (Entertainment, Shopping, etc.)
  if (category.includes('entertainment') ||
      category.includes('recreation') ||
      name.includes('netflix') ||
      name.includes('spotify') ||
      name.includes('uber') ||
      name.includes('lyft') ||
      name.includes('cinema') ||
      name.includes('movie') ||
      category.includes('shops')) {
    return 'vibes';
  }
  
  return 'other';
};

// Routes

// Create link token
app.post('/api/create_link_token', async (req, res) => {
  try {
    const request = {
      user: {
        client_user_id: 'user-id-' + Date.now(),
      },
      client_name: 'How Broke Are You Really',
      products: [Products.Transactions],
      country_codes: [CountryCode.Us],
      language: 'en',
    };
    
    const response = await plaidClient.linkTokenCreate(request);
    res.json({ link_token: response.data.link_token });
  } catch (error) {
    console.error('Error creating link token:', error);
    res.status(500).json({ error: 'Failed to create link token' });
  }
});

// Exchange public token for access token
app.post('/api/exchange_public_token', async (req, res) => {
  try {
    const { public_token } = req.body;
    
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: public_token,
    });
    
    res.json({ access_token: response.data.access_token });
  } catch (error) {
    console.error('Error exchanging public token:', error);
    res.status(500).json({ error: 'Failed to exchange public token' });
  }
});

// Get accounts
app.post('/api/accounts', async (req, res) => {
  try {
    const { access_token } = req.body;
    
    const response = await plaidClient.accountsGet({
      access_token: access_token,
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching accounts:', error);
    res.status(500).json({ error: 'Failed to fetch accounts' });
  }
});

// Get transactions
app.post('/api/transactions', async (req, res) => {
  try {
    const { access_token } = req.body;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 90); // Last 90 days
    
    const endDate = new Date();
    
    const response = await plaidClient.transactionsGet({
      access_token: access_token,
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      count: 500,
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Get institution name
app.post('/api/institution', async (req, res) => {
  try {
    const { access_token } = req.body;
    
    const itemResponse = await plaidClient.itemGet({
      access_token: access_token,
    });
    
    const institutionResponse = await plaidClient.institutionsGetById({
      institution_id: itemResponse.data.item.institution_id,
      country_codes: [CountryCode.Us],
    });
    
    res.json({ name: institutionResponse.data.institution.name });
  } catch (error) {
    console.error('Error fetching institution:', error);
    res.json({ name: 'Your Bank' });
  }
});

// Analyze budget
app.post('/api/analyze_budget', async (req, res) => {
  try {
    const { access_token } = req.body;
    
    // Get all data in parallel
    const [transactionsResponse, accountsResponse, institutionName] = await Promise.all([
      plaidClient.transactionsGet({
        access_token: access_token,
        start_date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0],
        count: 500,
      }),
      plaidClient.accountsGet({
        access_token: access_token,
      }),
      plaidClient.itemGet({
        access_token: access_token,
      }).then(async (itemRes) => {
        try {
          const instRes = await plaidClient.institutionsGetById({
            institution_id: itemRes.data.item.institution_id,
            country_codes: [CountryCode.Us],
          });
          return instRes.data.institution.name;
        } catch {
          return 'Your Bank';
        }
      })
    ]);
    
    const transactions = transactionsResponse.data.transactions;
    const accounts = accountsResponse.data.accounts;
    
    // Categorize expenses and income
    const expenses = transactions.filter(t => t.amount > 0); // Plaid uses positive for expenses
    const income = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const totalSpent = expenses.reduce((sum, t) => sum + t.amount, 0);
    
    // Categorize expenses
    const categories = {
      rent: { amount: 0, percentage: 0, transactions: [] },
      food: { amount: 0, percentage: 0, transactions: [] },
      vices: { amount: 0, percentage: 0, transactions: [] },
      vibes: { amount: 0, percentage: 0, transactions: [] },
      other: { amount: 0, percentage: 0, transactions: [] }
    };
    
    expenses.forEach(transaction => {
      const amount = transaction.amount;
      const category = categorizeTransaction(transaction);
      
      if (categories[category]) {
        categories[category].amount += amount;
        categories[category].transactions.push({
          id: transaction.transaction_id,
          account_id: transaction.account_id,
          amount: transaction.amount,
          date: transaction.date,
          name: transaction.name,
          merchant_name: transaction.merchant_name,
          category: transaction.category,
          subcategory: category
        });
      }
    });
    
    // Calculate percentages
    Object.keys(categories).forEach(key => {
      categories[key].percentage = totalSpent > 0 ? (categories[key].amount / totalSpent) * 100 : 0;
    });
    
    const currentBalance = accounts[0]?.balances.current || 0;
    const savings = income - totalSpent;
    const overdraftRisk = Math.max(0, Math.min(100, (1 - (Math.abs(currentBalance) / (totalSpent || 1))) * 100));
    const matchasUntilOverdraft = Math.floor(Math.abs(currentBalance) / 7.50);
    
    // Generate insights
    const insights = [];
    if (categories.vices.percentage > 15) {
      insights.push(`You're spending ${categories.vices.percentage.toFixed(1)}% on coffee and treats - that's about ${matchasUntilOverdraft} matcha lattes worth! ☕`);
    }
    if (categories.food.percentage > 25) {
      insights.push(`Food takes up ${categories.food.percentage.toFixed(1)}% of your spending. You're either a foodie or really love delivery! 🍕`);
    }
    if (categories.vibes.percentage > 20) {
      insights.push(`You spend ${categories.vibes.percentage.toFixed(1)}% on entertainment - someone knows how to have fun! 🎉`);
    }
    if (categories.rent.percentage > 35) {
      insights.push(`Rent is ${categories.rent.percentage.toFixed(1)}% of your spending - higher than the recommended 30%. Time to budget around it! 🏠`);
    }
    
    const sassyMessage = insights.length > 0 
      ? `Looking at your last 3 months, here's what caught our attention:` 
      : `You're doing pretty well with your spending! Here are some ways to optimize further:`;
    
    const analysis = {
      totalSpent,
      income,
      categories,
      savings,
      overdraftRisk,
      sassyMessage,
      matchasUntilOverdraft,
      bankName: institutionName,
      insights
    };
    
    res.json(analysis);
  } catch (error) {
    console.error('Error analyzing budget:', error);
    res.status(500).json({ error: 'Failed to analyze budget' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Plaid server is running' });
});

app.listen(PORT, () => {
  console.log(`Plaid server running on port ${PORT}`);
  console.log(`Plaid Client ID: ${process.env.REACT_APP_PLAID_CLIENT_ID ? 'Set' : 'Not set'}`);
  console.log(`Plaid Secret: ${process.env.REACT_APP_PLAID_SECRET ? 'Set' : 'Not set'}`);
});
