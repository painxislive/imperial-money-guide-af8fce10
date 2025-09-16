import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { setAPIKeys } from "@/services/marketData";
import RepoCalculator from "@/components/calculators/RepoCalculator";
import LeverageSimulator from "@/components/calculators/LeverageSimulator";
import OptionPayoffCalculator from "@/components/calculators/OptionPayoffCalculator";
import CDOTrancheSimulator from "@/components/calculators/CDOTrancheSimulator";
import SwapTimelineCalculator from "@/components/calculators/SwapTimelineCalculator";
import FXSwapCalculator from "@/components/calculators/FXSwapCalculator";

type Tool = {
  id: string;
  title: string;
  desc: string;
  hasCalc?: boolean;
};

const TOOLS: Tool[] = [
  { id: "repo", title: "Repurchase agreements (Repos / Reverse repos)", desc: "Short-term collateralized loans used by institutions to fund positions or park cash.", hasCalc: true },
  { id: "otc", title: "Over-the-counter (OTC) derivatives", desc: "Bespoke contracts (swaps, CDS, options) traded bilaterally.", hasCalc: true },
  { id: "cdo", title: "CDO Tranche Simulator", desc: "Model how losses flow through structured product tranches.", hasCalc: true },
  { id: "swap", title: "Interest Rate Swap Timeline", desc: "Calculate swap cashflows and P&L over time.", hasCalc: true },
  { id: "fxswap", title: "FX Swap Calculator", desc: "Calculate FX swap cashflows and implied interest differentials.", hasCalc: true },
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
  const [showAPIConfig, setShowAPIConfig] = useState(false);

  const handleAPIConfig = (alphaKey: string, fredKey: string) => {
    setAPIKeys(alphaKey, fredKey);
    setShowAPIConfig(false);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Hidden Financial Tools</h1>
        <p className="text-muted-foreground">Educational demos of institutional financial instruments and calculators</p>
        
        <div className="mt-4 flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowAPIConfig(true)}
          >
            Configure API Keys
          </Button>
        </div>
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <Tabs defaultValue="calculator" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="calculator">Calculator</TabsTrigger>
              <TabsTrigger value="info">Info & Theory</TabsTrigger>
            </TabsList>
            
            <TabsContent value="calculator" className="mt-4">
              {activeCalc === "repo" && <RepoCalculator />}
              {activeCalc === "otc" && <OptionPayoffCalculator />}
              {activeCalc === "rehyp" && <LeverageSimulator />}
              {activeCalc === "cdo" && <CDOTrancheSimulator />}
              {activeCalc === "swap" && <SwapTimelineCalculator />}
              {activeCalc === "fxswap" && <FXSwapCalculator />}
            </TabsContent>
            
            <TabsContent value="info" className="mt-4">
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">About This Instrument</h3>
                <p className="text-sm text-muted-foreground">
                  {TOOLS.find(t => t.id === activeCalc)?.desc}
                </p>
                <div className="mt-4 text-xs text-muted-foreground">
                  <strong>Risk Warning:</strong> These instruments are complex and carry significant risks. 
                  This is for educational purposes only.
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <Dialog open={showAPIConfig} onOpenChange={setShowAPIConfig}>
        <DialogContent className="max-w-md">
          <APIConfigForm onSave={handleAPIConfig} onCancel={() => setShowAPIConfig(false)} />
        </DialogContent>
      </Dialog>

      <div className="mt-8 p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">
          <strong>Disclaimer:</strong> Educational purposes only. These instruments can be complex and risky. 
          Please consult with financial professionals and include appropriate legal & risk disclosures in production.
        </p>
        <div className="mt-2 text-xs text-muted-foreground">
          <strong>Market Data:</strong> Live data requires API keys from Alpha Vantage (FX) and FRED (rates). 
          Demo data is used when keys are not configured.
        </div>
      </div>
    </div>
  );
}

function APIConfigForm({ onSave, onCancel }: { onSave: (alpha: string, fred: string) => void; onCancel: () => void }) {
  const [alphaKey, setAlphaKey] = useState("");
  const [fredKey, setFredKey] = useState("");

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Configure API Keys</h3>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Alpha Vantage API Key</label>
          <input 
            type="text"
            value={alphaKey}
            onChange={(e) => setAlphaKey(e.target.value)}
            placeholder="Get free key from alphavantage.co"
            className="mt-1 w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="text-sm font-medium">FRED API Key</label>
          <input 
            type="text"
            value={fredKey}
            onChange={(e) => setFredKey(e.target.value)}
            placeholder="Get free key from fred.stlouisfed.org"
            className="mt-1 w-full p-2 border rounded"
          />
        </div>
        <div className="flex gap-2 pt-4">
          <Button onClick={() => onSave(alphaKey, fredKey)}>Save Keys</Button>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
        </div>
        <div className="text-xs text-muted-foreground">
          Keys are stored locally in your browser. Demo data is used when keys are not provided.
        </div>
      </div>
    </div>
  );
}
