// Market data service for fetching live financial data
// Note: In Lovable, store API keys in localStorage or use Supabase secrets
// Get free keys from: Alpha Vantage, FRED

type FXRate = {
  from: string;
  to: string;
  rate: number;
  timestamp: string;
};

type FREDData = {
  series_id: string;
  value: number;
  date: string;
};

class MarketDataService {
  private alphaVantageKey: string;
  private fredKey: string;

  constructor() {
    // In production, these would come from Supabase secrets or user input
    this.alphaVantageKey = localStorage.getItem('ALPHA_VANTAGE_KEY') || 'demo';
    this.fredKey = localStorage.getItem('FRED_KEY') || 'demo';
  }

  async getFXRate(from: string, to: string): Promise<FXRate | null> {
    try {
      if (this.alphaVantageKey === 'demo') {
        // Demo data for development
        return {
          from,
          to,
          rate: from === 'USD' && to === 'EUR' ? 0.85 : 1.18,
          timestamp: new Date().toISOString()
        };
      }

      const response = await fetch(
        `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${from}&to_currency=${to}&apikey=${this.alphaVantageKey}`
      );
      const data = await response.json();
      
      if (data['Realtime Currency Exchange Rate']) {
        const rate = data['Realtime Currency Exchange Rate'];
        return {
          from,
          to,
          rate: parseFloat(rate['5. Exchange Rate']),
          timestamp: rate['6. Last Refreshed']
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching FX rate:', error);
      return null;
    }
  }

  async getFREDSeries(seriesId: string): Promise<FREDData | null> {
    try {
      if (this.fredKey === 'demo') {
        // Demo data for development
        const demoValues: Record<string, number> = {
          'DGS10': 4.25, // 10-year treasury
          'DFF': 5.33,   // Federal funds rate
          'SOFR': 5.31   // SOFR rate
        };
        return {
          series_id: seriesId,
          value: demoValues[seriesId] || 3.5,
          date: new Date().toISOString().split('T')[0]
        };
      }

      const response = await fetch(
        `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${this.fredKey}&file_type=json&limit=1&sort_order=desc`
      );
      const data = await response.json();
      
      if (data.observations && data.observations.length > 0) {
        const latest = data.observations[0];
        return {
          series_id: seriesId,
          value: parseFloat(latest.value),
          date: latest.date
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching FRED data:', error);
      return null;
    }
  }

  async getRepoRate(): Promise<number> {
    const data = await this.getFREDSeries('SOFR');
    return data ? data.value / 100 : 0.05; // Convert percentage to decimal
  }

  async getTreasuryYield(maturity: string = '10'): Promise<number> {
    const seriesMap: Record<string, string> = {
      '1': 'DGS1',
      '2': 'DGS2',
      '5': 'DGS5',
      '10': 'DGS10',
      '30': 'DGS30'
    };
    
    const data = await this.getFREDSeries(seriesMap[maturity] || 'DGS10');
    return data ? data.value / 100 : 0.0425; // Convert percentage to decimal
  }
}

export const marketData = new MarketDataService();

// Utility to set API keys (for user configuration)
export const setAPIKeys = (alphaVantageKey: string, fredKey: string) => {
  localStorage.setItem('ALPHA_VANTAGE_KEY', alphaVantageKey);
  localStorage.setItem('FRED_KEY', fredKey);
};