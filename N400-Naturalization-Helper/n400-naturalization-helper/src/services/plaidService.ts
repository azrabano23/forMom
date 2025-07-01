import { Configuration, PlaidApi, PlaidEnvironments, Transaction, CountryCode, Products } from 'plaid';

export interface PlaidTransaction {
  id: string;
  account_id: string;
  amount: number;
  date: string;
  name: string;
  merchant_name?: string;
  category: string[] | null;
  subcategory: string;
  account_owner?: string;
}

export interface PlaidAccount {
  account_id: string;
  balances: {
    available: number | null;
    current: number | null;
    limit?: number | null;
  };
  name: string;
  type: string;
  subtype: string;
}

export interface BudgetAnalysis {
  totalSpent: number;
  income: number;
  categories: {
    rent: { amount: number; percentage: number; transactions: PlaidTransaction[] };
    food: { amount: number; percentage: number; transactions: PlaidTransaction[] };
    vices: { amount: number; percentage: number; transactions: PlaidTransaction[] };
    vibes: { amount: number; percentage: number; transactions: PlaidTransaction[] };
    other: { amount: number; percentage: number; transactions: PlaidTransaction[] };
  };
  savings: number;
  overdraftRisk: number;
  sassyMessage: string;
  matchasUntilOverdraft: number;
  bankName: string;
}

const MATCHA_PRICE = 7.50;

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
const categorizeTransaction = (transaction: Transaction): string => {
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

const generateSassyMessage = (analysis: Partial<BudgetAnalysis>): string => {
  const { categories, overdraftRisk, matchasUntilOverdraft, bankName } = analysis;
  
  if (!categories) return "Unable to calculate your financial chaos level.";
  
  const bankSpecificMessages = {
    chase: [
      `Chase called - they're concerned about your matcha addiction. ${matchasUntilOverdraft} matcha lattes until overdraft.`,
      `Your Chase account is crying. You're ${categories.vibes?.percentage.toFixed(1)}% vibes, 100% broke.`,
    ],
    'bank of america': [
      `Bank of America just sent a wellness check. You're ${matchasUntilOverdraft} matchas from financial disaster.`,
      `BofA wants to know if you're okay. Spoiler alert: your budget isn't.`,
    ],
    apple: [
      `Apple Cash is judging your life choices. ${matchasUntilOverdraft} more matcha purchases and you're done.`,
      `Your Apple Wallet is having an identity crisis - it forgot what money looks like.`,
    ]
  };
  
  const generalMessages = [
    `You're ${matchasUntilOverdraft} matchas away from overdrafting. Maybe skip the oat milk?`,
    `Your vibes spending is ${categories.vibes?.percentage.toFixed(1)}% - living your best broke life!`,
    `Rent is eating ${categories.rent?.percentage.toFixed(1)}% of your soul. Classic millennial move.`,
    `You spent ${categories.vices?.percentage.toFixed(1)}% on vices. At least you're honest about it.`,
    `Food takes up ${categories.food?.percentage.toFixed(1)}% - someone's been Door Dashing their feelings.`,
    `Your financial stability is hanging by a thread thinner than your patience with this economy.`,
    `Miami trip? Maybe try a Miami-themed wallpaper instead.`,
    `You're financially stable enough for... grocery store sushi. That's about it.`,
  ];
  
  if (overdraftRisk && overdraftRisk > 80) {
    return "🚨 FINANCIAL EMERGENCY: You're basically playing financial Jenga with your bank account!";
  }
  
  const bankKey = bankName?.toLowerCase() as keyof typeof bankSpecificMessages;
  const bankMessages = bankSpecificMessages[bankKey];
  
  if (bankMessages && Math.random() > 0.5) {
    return bankMessages[Math.floor(Math.random() * bankMessages.length)];
  }
  
  return generalMessages[Math.floor(Math.random() * generalMessages.length)];
};

export const plaidService = {
  async createLinkToken(): Promise<string> {
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
      return response.data.link_token;
    } catch (error) {
      console.error('Error creating link token:', error);
      throw new Error('Failed to create link token');
    }
  },

  async exchangePublicToken(publicToken: string): Promise<string> {
    try {
      const response = await plaidClient.itemPublicTokenExchange({
        public_token: publicToken,
      });
      return response.data.access_token;
    } catch (error) {
      console.error('Error exchanging public token:', error);
      throw new Error('Failed to exchange public token');
    }
  },

  async getAccounts(accessToken: string): Promise<PlaidAccount[]> {
    try {
      const response = await plaidClient.accountsGet({
        access_token: accessToken,
      });
      
      return response.data.accounts.map((account: any) => ({
        account_id: account.account_id,
        balances: {
          available: account.balances.available,
          current: account.balances.current,
          limit: account.balances.limit,
        },
        name: account.name,
        type: account.type,
        subtype: account.subtype || 'checking',
      }));
    } catch (error) {
      console.error('Error fetching accounts:', error);
      throw new Error('Failed to fetch accounts');
    }
  },

  async getTransactions(accessToken: string, accountId?: string): Promise<PlaidTransaction[]> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30); // Last 30 days
      
      const endDate = new Date();
      
      const request: any = {
        access_token: accessToken,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        count: 500,
      };
      
      if (accountId) {
        request.account_ids = [accountId];
      }
      
      const response = await plaidClient.transactionsGet(request);
      
      return response.data.transactions.map((transaction: any) => ({
        id: transaction.transaction_id,
        account_id: transaction.account_id,
        amount: transaction.amount,
        date: transaction.date,
        name: transaction.name,
        merchant_name: transaction.merchant_name || undefined,
        category: transaction.category,
        subcategory: categorizeTransaction(transaction),
        account_owner: transaction.account_owner || undefined,
      }));
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw new Error('Failed to fetch transactions');
    }
  },

  async getInstitutionName(accessToken: string): Promise<string> {
    try {
      const response = await plaidClient.itemGet({
        access_token: accessToken,
      });
      
      const institutionResponse = await plaidClient.institutionsGetById({
        institution_id: response.data.item.institution_id!,
        country_codes: [CountryCode.Us],
      });
      
      return institutionResponse.data.institution.name;
    } catch (error) {
      console.error('Error fetching institution:', error);
      return 'Your Bank';
    }
  },

  async analyzeBudget(accessToken: string): Promise<BudgetAnalysis> {
    try {
      const [transactions, accounts, bankName] = await Promise.all([
        this.getTransactions(accessToken),
        this.getAccounts(accessToken),
        this.getInstitutionName(accessToken),
      ]);
      
      const expenses = transactions.filter(t => t.amount > 0); // Plaid uses positive for expenses
      const income = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
      const totalSpent = expenses.reduce((sum, t) => sum + t.amount, 0);
      
      // Categorize expenses
      const categories = {
        rent: { amount: 0, percentage: 0, transactions: [] as PlaidTransaction[] },
        food: { amount: 0, percentage: 0, transactions: [] as PlaidTransaction[] },
        vices: { amount: 0, percentage: 0, transactions: [] as PlaidTransaction[] },
        vibes: { amount: 0, percentage: 0, transactions: [] as PlaidTransaction[] },
        other: { amount: 0, percentage: 0, transactions: [] as PlaidTransaction[] }
      };
      
      expenses.forEach(transaction => {
        const amount = transaction.amount;
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
        cat.percentage = totalSpent > 0 ? (cat.amount / totalSpent) * 100 : 0;
      });
      
      const currentBalance = accounts[0]?.balances.current || 0;
      const savings = income - totalSpent;
      const overdraftRisk = Math.max(0, Math.min(100, (1 - (Math.abs(currentBalance) / (totalSpent || 1))) * 100));
      const matchasUntilOverdraft = Math.floor(Math.abs(currentBalance) / MATCHA_PRICE);
      
      const analysis: BudgetAnalysis = {
        totalSpent,
        income,
        categories,
        savings,
        overdraftRisk,
        sassyMessage: '',
        matchasUntilOverdraft,
        bankName
      };
      
      analysis.sassyMessage = generateSassyMessage(analysis);
      
      return analysis;
    } catch (error) {
      console.error('Error analyzing budget:', error);
      throw new Error('Failed to analyze budget');
    }
  }
};
