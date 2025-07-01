import { mockBankingService } from './mockBankingData';
import { realBankingService } from './realBankingService';

// Unified interface for both services
export interface BudgetAnalysis {
  totalSpent: number;
  income: number;
  categories: {
    rent: { amount: number; percentage: number; transactions: any[] };
    food: { amount: number; percentage: number; transactions: any[] };
    vices: { amount: number; percentage: number; transactions: any[] };
    vibes: { amount: number; percentage: number; transactions: any[] };
    other: { amount: number; percentage: number; transactions: any[] };
  };
  savings: number;
  overdraftRisk: number;
  sassyMessage: string;
  matchasUntilOverdraft: number;
  bankName?: string;
}

// Check if Plaid is configured
const isPlaidConfigured = () => {
  const clientId = process.env.REACT_APP_PLAID_CLIENT_ID;
  const secret = process.env.REACT_APP_PLAID_SECRET;
  
  return clientId && secret && 
         clientId !== 'your_plaid_client_id_here' && 
         secret !== 'your_plaid_secret_here';
};

export const bankingService = {
  isRealDataAvailable: true, // Enable real banking connections
  
  async checkServerHealth(): Promise<boolean> {
    return await realBankingService.checkServerHealth();
  },
  
  async createLinkToken(): Promise<string> {
    const serverAvailable = await this.checkServerHealth();
    if (serverAvailable) {
      return await realBankingService.createLinkToken();
    }
    throw new Error('Server not available - using demo data instead');
  },

  async exchangePublicToken(publicToken: string): Promise<string> {
    const serverAvailable = await this.checkServerHealth();
    if (serverAvailable) {
      return await realBankingService.exchangePublicToken(publicToken);
    }
    throw new Error('Server not available');
  },

  async analyzeBudget(accessToken?: string): Promise<BudgetAnalysis> {
    const serverAvailable = await this.checkServerHealth();
    
    if (serverAvailable && accessToken) {
      // Use real banking data
      return await realBankingService.analyzeBudget(accessToken);
    } else {
      // Fallback to mock data
      const mockAnalysis = await mockBankingService.analyzeBudget();
      return {
        ...mockAnalysis,
        bankName: 'Demo Bank (Mock Data)'
      };
    }
  }
};
