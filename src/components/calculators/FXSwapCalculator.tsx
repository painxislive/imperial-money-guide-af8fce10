import React, { useState, useEffect } from "react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { marketData } from "@/services/marketData";

export default function FXSwapCalculator() {
  const [domesticCurrency, setDomesticCurrency] = useState<string>("USD");
  const [foreignCurrency, setForeignCurrency] = useState<string>("EUR");
  const [spotRate, setSpotRate] = useState<number>(0.85);
  const [forwardRate, setForwardRate] = useState<number>(0.86);
  const [tenor, setTenor] = useState<number>(90);
  const [notional, setNotional] = useState<number>(1_000_000);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLiveFXRate = async () => {
      setLoading(true);
      try {
        const fxData = await marketData.getFXRate(domesticCurrency, foreignCurrency);
        if (fxData) {
          setSpotRate(fxData.rate);
          // Estimate forward rate (simplified)
          const forwardPoints = fxData.rate * 0.01 * (tenor / 365); // 1% annual differential
          setForwardRate(fxData.rate + forwardPoints);
        }
      } catch (error) {
        console.error('Failed to fetch FX rate:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (domesticCurrency && foreignCurrency) {
      fetchLiveFXRate();
    }
  }, [domesticCurrency, foreignCurrency]);

  // Calculate swap details
  const foreignNotional = notional * spotRate;
  const impliedInterestDifferential = ((forwardRate - spotRate) / spotRate) * (365 / tenor) * 100;
  
  // At maturity cashflows
  const domesticCashflowMaturity = -notional; // Pay domestic
  const foreignCashflowMaturity = foreignNotional / forwardRate; // Receive foreign converted at forward
  const totalMaturityCashflow = domesticCashflowMaturity + (foreignCashflowMaturity * forwardRate);

  const currencies = ["USD", "EUR", "GBP", "JPY", "CHF", "CAD", "AUD"];

  return (
    <>
      <DialogHeader>
        <DialogTitle>FX Swap Calculator</DialogTitle>
        <p className="text-muted-foreground">Calculate FX swap cashflows and implied interest differentials</p>
      </DialogHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="text-sm font-medium">Domestic Currency</label>
          <Select value={domesticCurrency} onValueChange={setDomesticCurrency}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currencies.map(curr => (
                <SelectItem key={curr} value={curr}>{curr}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">Foreign Currency</label>
          <Select value={foreignCurrency} onValueChange={setForeignCurrency}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currencies.map(curr => (
                <SelectItem key={curr} value={curr}>{curr}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">
            Spot Rate {loading && <span className="text-xs text-muted-foreground">Loading...</span>}
          </label>
          <Input 
            type="number" 
            step="0.0001"
            value={spotRate} 
            onChange={(e) => setSpotRate(Number(e.target.value))}
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Forward Rate</label>
          <Input 
            type="number" 
            step="0.0001"
            value={forwardRate} 
            onChange={(e) => setForwardRate(Number(e.target.value))}
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Tenor (days)</label>
          <Input 
            type="number" 
            value={tenor} 
            onChange={(e) => setTenor(Number(e.target.value))}
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Notional ({domesticCurrency})</label>
          <Input 
            type="number" 
            value={notional} 
            onChange={(e) => setNotional(Number(e.target.value))}
            className="mt-1"
          />
        </div>
      </div>

      <div className="mt-6 space-y-4 border-t pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h3 className="font-medium">Spot (Today)</h3>
            <div>
              <div className="text-sm text-muted-foreground">Pay {domesticCurrency}</div>
              <div className="text-lg font-semibold text-red-600">
                -{notional.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Receive {foreignCurrency}</div>
              <div className="text-lg font-semibold text-green-600">
                +{foreignNotional.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">Forward (Maturity)</h3>
            <div>
              <div className="text-sm text-muted-foreground">Receive {domesticCurrency}</div>
              <div className="text-lg font-semibold text-green-600">
                +{(foreignNotional / forwardRate).toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Pay {foreignCurrency}</div>
              <div className="text-lg font-semibold text-red-600">
                -{foreignNotional.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="text-sm text-muted-foreground">Implied Interest Rate Differential</div>
          <div className="text-xl font-semibold">
            {impliedInterestDifferential >= 0 ? '+' : ''}{impliedInterestDifferential.toFixed(3)}% p.a.
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {domesticCurrency} rate - {foreignCurrency} rate (implied from forward points)
          </div>
        </div>

        <div>
          <div className="text-sm text-muted-foreground">Net Present Value (simplified)</div>
          <div className={`text-lg font-semibold ${totalMaturityCashflow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {domesticCurrency} {totalMaturityCashflow.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>
    </>
  );
}