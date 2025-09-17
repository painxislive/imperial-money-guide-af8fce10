import React, { useState, useEffect } from "react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { marketData } from "@/services/marketData";
import { SaveScenarioDialog } from "@/components/SaveScenarioDialog";

export default function RepoCalculator() {
  const [cash, setCash] = useState<number>(1_000_000);
  const [haircut, setHaircut] = useState<number>(0.02);
  const [repoRate, setRepoRate] = useState<number>(0.05);
  const [days, setDays] = useState<number>(7);
  const [loading, setLoading] = useState(false);

  const collateral = cash / (1 - haircut);
  const interest = cash * repoRate * (days / 360);
  const netCash = cash - interest;

  useEffect(() => {
    const fetchLiveRate = async () => {
      setLoading(true);
      try {
        const liveRate = await marketData.getRepoRate();
        setRepoRate(liveRate);
      } catch (error) {
        console.error('Failed to fetch live repo rate:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLiveRate();
  }, []);

  return (
    <>
      <DialogHeader>
        <DialogTitle>Repo Calculator</DialogTitle>
        <p className="text-muted-foreground">Estimate collateral and interest for a simple repo</p>
      </DialogHeader>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="text-sm font-medium">Cash lent/borrowed</label>
          <Input 
            type="number" 
            value={cash} 
            onChange={(e) => setCash(Number(e.target.value))}
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Haircut (fraction)</label>
          <Input 
            type="number" 
            step="0.001"
            value={haircut} 
            onChange={(e) => setHaircut(Number(e.target.value))}
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium">
            Repo rate (annual) {loading && <span className="text-xs text-muted-foreground">Loading live rate...</span>}
          </label>
          <Input 
            type="number" 
            step="0.001"
            value={repoRate} 
            onChange={(e) => setRepoRate(Number(e.target.value))}
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Term (days)</label>
          <Input 
            type="number" 
            value={days} 
            onChange={(e) => setDays(Number(e.target.value))}
            className="mt-1"
          />
        </div>
      </div>

      <div className="mt-6 space-y-4 border-t pt-4">
        <div>
          <div className="text-sm text-muted-foreground">Collateral required (market value)</div>
          <div className="text-2xl font-semibold">₹ {collateral.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Interest due (approx)</div>
          <div className="text-lg font-medium">₹ {interest.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Net cash to borrower</div>
          <div className="text-lg font-medium">₹ {netCash.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
        </div>
      </div>

      {/* Save Scenario Section */}
      <div className="mt-6 pt-4 border-t flex justify-center">
        <SaveScenarioDialog
          toolType="RepoCalculator"
          inputData={{ cash, haircut, repoRate, days }}
          outputData={{ collateral, interest, netCash }}
          disabled={!cash || !haircut || !repoRate || !days}
        />
      </div>
    </>
  );
}