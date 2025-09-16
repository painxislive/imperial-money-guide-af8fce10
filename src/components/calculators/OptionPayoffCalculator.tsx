import React, { useState } from "react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function OptionPayoffCalculator() {
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
          <Select value={isCall ? "call" : "put"} onValueChange={(value) => setIsCall(value === "call")}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="call">Call Option</SelectItem>
              <SelectItem value="put">Put Option</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-6 space-y-4 border-t pt-4">
        <div>
          <div className="text-sm text-muted-foreground">Intrinsic value</div>
          <div className="text-2xl font-semibold">{intrinsic.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Net payoff (intrinsic - premium)</div>
          <div className={`text-xl font-semibold ${payoff >= 0 ? "text-green-600" : "text-red-600"}`}>
            {payoff.toFixed(2)}
          </div>
        </div>
      </div>
    </>
  );
}