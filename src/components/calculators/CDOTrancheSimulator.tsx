import React, { useState } from "react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function CDOTrancheSimulator() {
  const [poolSize, setPoolSize] = useState<number>(100_000_000);
  const [seniorPct, setSeniorPct] = useState<number>(80);
  const [mezzaninePct, setMezzaninePct] = useState<number>(15);
  const [equityPct, setEquityPct] = useState<number>(5);
  const [defaultRate, setDefaultRate] = useState<number>(10);

  // Calculate tranche sizes
  const seniorSize = poolSize * (seniorPct / 100);
  const mezzanineSize = poolSize * (mezzaninePct / 100);
  const equitySize = poolSize * (equityPct / 100);
  
  // Calculate losses
  const totalLoss = poolSize * (defaultRate / 100);
  
  // Loss waterfall: equity absorbs first, then mezzanine, then senior
  let remainingLoss = totalLoss;
  
  const equityLoss = Math.min(remainingLoss, equitySize);
  remainingLoss -= equityLoss;
  
  const mezzanineLoss = Math.min(remainingLoss, mezzanineSize);
  remainingLoss -= mezzanineLoss;
  
  const seniorLoss = Math.min(remainingLoss, seniorSize);

  const chartData = [
    {
      tranche: "Equity",
      size: equitySize / 1_000_000,
      loss: equityLoss / 1_000_000,
      lossRate: (equityLoss / equitySize) * 100
    },
    {
      tranche: "Mezzanine",
      size: mezzanineSize / 1_000_000,
      loss: mezzanineLoss / 1_000_000,
      lossRate: (mezzanineLoss / mezzanineSize) * 100
    },
    {
      tranche: "Senior",
      size: seniorSize / 1_000_000,
      loss: seniorLoss / 1_000_000,
      lossRate: (seniorLoss / seniorSize) * 100
    }
  ];

  return (
    <>
      <DialogHeader>
        <DialogTitle>CDO Tranche Simulator</DialogTitle>
        <p className="text-muted-foreground">Model how losses flow through CDO tranches</p>
      </DialogHeader>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
        <div>
          <label className="text-sm font-medium">Pool Size ($M)</label>
          <Input 
            type="number" 
            value={poolSize / 1_000_000} 
            onChange={(e) => setPoolSize(Number(e.target.value) * 1_000_000)}
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Senior %</label>
          <Input 
            type="number" 
            value={seniorPct} 
            onChange={(e) => setSeniorPct(Number(e.target.value))}
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Mezzanine %</label>
          <Input 
            type="number" 
            value={mezzaninePct} 
            onChange={(e) => setMezzaninePct(Number(e.target.value))}
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Equity %</label>
          <Input 
            type="number" 
            value={equityPct} 
            onChange={(e) => setEquityPct(Number(e.target.value))}
            className="mt-1"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="text-sm font-medium">Default Rate (%)</label>
        <Input 
          type="number" 
          step="0.1"
          value={defaultRate} 
          onChange={(e) => setDefaultRate(Number(e.target.value))}
          className="mt-1 max-w-32"
        />
      </div>

      <div className="mt-6">
        <h3 className="font-medium mb-3">Loss Distribution</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tranche" />
              <YAxis />
              <Tooltip formatter={(value, name) => [
                `$${value}M`, 
                name === 'size' ? 'Tranche Size' : 'Loss Amount'
              ]} />
              <Bar dataKey="size" fill="hsl(var(--muted))" name="size" />
              <Bar dataKey="loss" fill="hsl(var(--destructive))" name="loss" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 space-y-3 border-t pt-4">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Equity Loss Rate</div>
            <div className="text-lg font-semibold text-destructive">
              {((equityLoss / equitySize) * 100).toFixed(1)}%
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">Mezzanine Loss Rate</div>
            <div className="text-lg font-semibold text-orange-600">
              {((mezzanineLoss / mezzanineSize) * 100).toFixed(1)}%
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">Senior Loss Rate</div>
            <div className="text-lg font-semibold text-green-600">
              {((seniorLoss / seniorSize) * 100).toFixed(1)}%
            </div>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          Total Pool Loss: ${(totalLoss / 1_000_000).toFixed(1)}M ({defaultRate}%)
        </div>
      </div>
    </>
  );
}