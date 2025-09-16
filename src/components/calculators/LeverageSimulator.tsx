import React, { useState } from "react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function LeverageSimulator() {
  const [initialCollateral, setInitialCollateral] = useState<number>(1_000_000);
  const [rehypRounds, setRehypRounds] = useState<number>(3);
  const [haircut, setHaircut] = useState<number>(0.02);

  const rounds: { round: number; collateral: number; borrowed: number }[] = [];
  let currentCollateral = initialCollateral;
  let totalBorrowed = 0;
  
  for (let i = 0; i < rehypRounds; i++) {
    const borrowed = currentCollateral * (1 - haircut);
    rounds.push({ round: i + 1, collateral: currentCollateral, borrowed });
    totalBorrowed += borrowed;
    currentCollateral = borrowed;
  }
  
  const effectiveLeverage = totalBorrowed / initialCollateral;

  return (
    <>
      <DialogHeader>
        <DialogTitle>Rehypothecation & Leverage Simulator</DialogTitle>
        <p className="text-muted-foreground">See how collateral rehypothecation can amplify lending</p>
      </DialogHeader>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
        <div>
          <label className="text-sm font-medium">Initial collateral</label>
          <Input 
            type="number" 
            value={initialCollateral} 
            onChange={(e) => setInitialCollateral(Number(e.target.value))}
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Rehypothecation rounds</label>
          <Input 
            type="number" 
            value={rehypRounds} 
            onChange={(e) => setRehypRounds(Number(e.target.value))}
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
      </div>

      <div className="mt-6">
        <h3 className="font-medium mb-3">Round-by-round breakdown</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {rounds.map((r) => (
            <Card key={r.round} className="p-3">
              <div className="flex justify-between">
                <div>
                  <div className="text-sm font-medium">Round {r.round}</div>
                  <div className="text-xs text-muted-foreground">
                    Collateral: ₹ {r.collateral.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Borrowed: ₹ {r.borrowed.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Cumulative borrowed</div>
                  <div className="text-sm font-medium">
                    ₹ {rounds.slice(0, r.round).reduce((s, x) => s + x.borrowed, 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-6 space-y-3 border-t pt-4">
          <div>
            <div className="text-sm text-muted-foreground">Total borrowed across rounds</div>
            <div className="text-2xl font-semibold">₹ {totalBorrowed.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Effective leverage (total borrowed / initial collateral)</div>
            <div className="text-xl font-semibold text-primary">{effectiveLeverage.toFixed(3)}x</div>
          </div>
        </div>
      </div>
    </>
  );
}