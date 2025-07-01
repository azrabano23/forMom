import { BudgetAnalysis } from './bankingService';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export interface PlaidLinkResult {
  public_token: string;
  metadata: {
    institution: {
      name: string;
      institution_id: string;
    };
    account: {
      id: string;
      name: string;
    };
  };
}

export const realBankingService = {
  // Check if server is available
  async checkServerHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/api/health`);
      return response.ok;
    } catch {
      return false;
    }
  },

  // Create link token for Plaid Link
  async createLinkToken(): Promise<string> {
    try {
      const response = await fetch(`${API_BASE}/api/create_link_token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.link_token;
    } catch (error) {
      console.error('Error creating link token:', error);
      throw new Error('Failed to create link token');
    }
  },

  // Exchange public token for access token
  async exchangePublicToken(publicToken: string): Promise<string> {
    try {
      const response = await fetch(`${API_BASE}/api/exchange_public_token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ public_token: publicToken }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('Error exchanging public token:', error);
      throw new Error('Failed to exchange public token');
    }
  },

  // Get accounts
  async getAccounts(accessToken: string): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE}/api/accounts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ access_token: accessToken }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.accounts;
    } catch (error) {
      console.error('Error fetching accounts:', error);
      throw new Error('Failed to fetch accounts');
    }
  },

  // Get transactions
  async getTransactions(accessToken: string): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE}/api/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ access_token: accessToken }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.transactions;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw new Error('Failed to fetch transactions');
    }
  },

  // Get institution name
  async getInstitutionName(accessToken: string): Promise<string> {
    try {
      const response = await fetch(`${API_BASE}/api/institution`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ access_token: accessToken }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.name;
    } catch (error) {
      console.error('Error fetching institution name:', error);
      return 'Your Bank';
    }
  },

  // Analyze budget with real data
  async analyzeBudget(accessToken: string): Promise<BudgetAnalysis> {
    try {
      const response = await fetch(`${API_BASE}/api/analyze_budget`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ access_token: accessToken }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error analyzing budget:', error);
      throw new Error('Failed to analyze budget');
    }
  },
};
