import React, { useState, useEffect } from "react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { marketData } from "@/services/marketData";

type CashFlow = {
  period: number;
  date: string;
  fixedPayment: number;
  floatingPayment: number;
  netPL: number;
  cumulativePL: number;
};

export default function SwapTimelineCalculator() {
  const [notional, setNotional] = useState<number>(10_000_000);
  const [fixedRate, setFixedRate] = useState<number>(0.045);
  const [floatingRate, setFloatingRate] = useState<number>(0.05);
  const [tenor, setTenor] = useState<number>(5);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLiveRates = async () => {
      setLoading(true);
      try {
        const treasuryYield = await marketData.getTreasuryYield('10');
        setFixedRate(treasuryYield + 0.005); // Add 50bps spread
      } catch (error) {
        console.error('Failed to fetch live rates:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLiveRates();
  }, []);

  // Generate cash flow schedule (semi-annual payments)
  const generateCashFlows = (): CashFlow[] => {
    const periods = tenor * 2; // Semi-annual
    const cashFlows: CashFlow[] = [];
    let cumulativePL = 0;

    for (let i = 1; i <= periods; i++) {
      const fixedPayment = (notional * fixedRate) / 2; // Semi-annual
      const floatingPayment = (notional * floatingRate) / 2; // Assume constant for demo
      const netPL = floatingPayment - fixedPayment; // Receive floating, pay fixed
      cumulativePL += netPL;

      const date = new Date();
      date.setMonth(date.getMonth() + (i * 6)); // 6 months apart

      cashFlows.push({
        period: i,
        date: date.toISOString().split('T')[0],
        fixedPayment,
        floatingPayment,
        netPL,
        cumulativePL
      });
    }

    return cashFlows;
  };

  const cashFlows = generateCashFlows();

  return (
    <>
      <DialogHeader>
        <DialogTitle>Interest Rate Swap Timeline</DialogTitle>
        <p className="text-muted-foreground">Model swap cashflows over time (receive floating, pay fixed)</p>
      </DialogHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="text-sm font-medium">Notional ($M)</label>
          <Input 
            type="number" 
            value={notional / 1_000_000} 
            onChange={(e) => setNotional(Number(e.target.value) * 1_000_000)}
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium">
            Fixed Rate (annual) {loading && <span className="text-xs text-muted-foreground">Loading...</span>}
          </label>
          <Input 
            type="number" 
            step="0.001"
            value={fixedRate} 
            onChange={(e) => setFixedRate(Number(e.target.value))}
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Floating Rate (current)</label>
          <Input 
            type="number" 
            step="0.001"
            value={floatingRate} 
            onChange={(e) => setFloatingRate(Number(e.target.value))}
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Tenor (years)</label>
          <Input 
            type="number" 
            value={tenor} 
            onChange={(e) => setTenor(Number(e.target.value))}
            className="mt-1"
          />
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-medium mb-3">Cumulative P&L Over Time</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={cashFlows}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(value) => [`$${(value as number / 1000).toFixed(0)}K`, 'Cumulative P&L']} />
              <Line 
                type="monotone" 
                dataKey="cumulativePL" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-medium mb-3">Payment Schedule (First 5 periods)</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {cashFlows.slice(0, 5).map((cf) => (
            <Card key={cf.period} className="p-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                <div>
                  <div className="text-muted-foreground">Period {cf.period}</div>
                  <div className="text-xs">{cf.date}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Fixed Pay</div>
                  <div className="font-medium">-${(cf.fixedPayment / 1000).toFixed(0)}K</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Floating Receive</div>
                  <div className="font-medium">+${(cf.floatingPayment / 1000).toFixed(0)}K</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Net P&L</div>
                  <div className={`font-medium ${cf.netPL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${(cf.netPL / 1000).toFixed(0)}K
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-muted rounded-lg">
        <div className="text-sm">
          <strong>Total Swap Value:</strong> ${(cashFlows[cashFlows.length - 1]?.cumulativePL / 1000).toFixed(0)}K
          <br />
          <span className="text-muted-foreground">
            This assumes constant floating rate. In reality, floating payments vary with market conditions.
          </span>
        </div>
      </div>
    </>
  );
}