import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Tool = {
  id: string;
  title: string;
  desc: string;
  hasCalc?: boolean;
};

const TOOLS: Tool[] = [
  { id: "repo", title: "Repurchase agreements (Repos / Reverse repos)", desc: "Short-term collateralized loans used by institutions to fund positions or park cash.", hasCalc: true },
  { id: "otc", title: "Over-the-counter (OTC) derivatives", desc: "Bespoke contracts (swaps, CDS, options) traded bilaterally.", hasCalc: true },
  { id: "dark", title: "Dark pools / alternative trading venues", desc: "Private venues that hide large institutional orders.", hasCalc: false },
  { id: "shadow", title: "Shadow-banking vehicles", desc: "Nonbank lenders, SIVs and large money-market operations off regulated balance sheets.", hasCalc: false },
  { id: "cbtools", title: "Central-bank unconventional tools", desc: "QE, yield-curve control, standing repos and other balance-sheet operations.", hasCalc: false },
  { id: "structured", title: "Structured products & securitisations", desc: "CDOs, CLOs and repackaged cashflows that redistribute credit risk.", hasCalc: false },
  { id: "rehyp", title: "Rehypothecation & hidden leverage", desc: "Reuse of client collateral that multiplies the system's effective leverage.", hasCalc: true },
  { id: "hft", title: "High-frequency trading & co-location", desc: "Latency arbitrage and order-type strategies that rely on speed.", hasCalc: false },
  { id: "fx", title: "Currency swaps & FX intervention tools", desc: "Bilateral instruments and official actions to manage FX exposure.", hasCalc: false },
  { id: "spv", title: "Offshore special-purpose vehicles (SPVs)", desc: "Entities used for tax, risk isolation, or balance-sheet engineering.", hasCalc: false },
  { id: "bilateral", title: "Bespoke bilateral credit lines", desc: "Private liquidity agreements between large institutions.", hasCalc: false },
  { id: "private", title: "Private credit / PE / sovereign tools", desc: "Non-public large-scale financing that moves capital outside public markets.", hasCalc: false },
];

export default function HiddenFinancialTools() {
  const [activeCalc, setActiveCalc] = useState<string | null>(null);

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Hidden Financial Tools</h1>
        <p className="text-muted-foreground">Educational demos of institutional financial instruments and calculators</p>
      </div>

      <div className="grid gap-4">
        {TOOLS.map((tool) => (
          <Card key={tool.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{tool.title}</CardTitle>
                  <CardDescription className="mt-1">{tool.desc}</CardDescription>
                </div>
                <div className="ml-4 flex-shrink-0">
                  {tool.hasCalc ? (
                    <Button onClick={() => setActiveCalc(tool.id)}>
                      Try Calculator
                    </Button>
                  ) : (
                    <Badge variant="secondary">Info Only</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Dialog open={!!activeCalc} onOpenChange={() => setActiveCalc(null)}>
        <DialogContent className="max-w-2xl">
          {activeCalc === "repo" && <RepoCalculator />}
          {activeCalc === "otc" && <OptionPayoffCalculator />}
          {activeCalc === "rehyp" && <LeverageSimulator />}
        </DialogContent>
      </Dialog>

      <div className="mt-8 p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">
          <strong>Disclaimer:</strong> Educational purposes only. These instruments can be complex and risky. 
          Please consult with financial professionals and include appropriate legal & risk disclosures in production.
        </p>
      </div>
    </div>
  );
}

function RepoCalculator() {
  const [cash, setCash] = useState<number>(1_000_000);
  const [haircut, setHaircut] = useState<number>(0.02);
  const [repoRate, setRepoRate] = useState<number>(0.05);
  const [days, setDays] = useState<number>(7);

  const collateral = cash / (1 - haircut);
  const interest = cash * repoRate * (days / 360);
  const netCash = cash - interest;

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
          <label className="text-sm font-medium">Repo rate (annual)</label>
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
    </>
  );
}

function LeverageSimulator() {
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

function OptionPayoffCalculator() {
  const [spot, setSpot] = useState<number>(100);
  const [strike, setStrike] = useState<number>(105);
  const [premium, setPremium] = useState<number>(2.5);
  const [isCall, setIsCall] = useState<boolean>(true);

  const intrinsic = isCall ? Math.max(0, spot - strike) : Math.max(0, strike - spot);
  const payoff = intrinsic - premium;

  return (
    <>
      <DialogHeader>
        <DialogTitle>Option Payoff Calculator</DialogTitle>
        <p className="text-muted-foreground">Calculate call/put option payoffs at maturity</p>
      </DialogHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="text-sm font-medium">Spot price at maturity</label>
          <Input 
            type="number" 
            value={spot} 
            onChange={(e) => setSpot(Number(e.target.value))}
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Strike price</label>
          <Input 
            type="number" 
            value={strike} 
            onChange={(e) => setStrike(Number(e.target.value))}
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Premium paid</label>
          <Input 
            type="number" 
            value={premium} 
            onChange={(e) => setPremium(Number(e.target.value))}
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Option type</label>
          <select 
            value={isCall ? "call" : "put"} 
            onChange={(e) => setIsCall(e.target.value === "call")}
            className="mt-1 w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm"
          >
            <option value="call">Call Option</option>
            <option value="put">Put Option</option>
          </select>
        </div>
      </div>

      <div className="mt-6 space-y-4 border-t pt-4">
        <div>
          <div className="text-sm text-muted-foreground">Intrinsic value</div>
          <div className="text-2xl font-semibold">{intrinsic.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Net payoff (intrinsic - premium)</div>
          <div className={`text-xl font-semibold ${payoff >= 0 ? "text-success" : "text-destructive"}`}>
            {payoff.toFixed(2)}
          </div>
        </div>
      </div>
    </>
  );
}