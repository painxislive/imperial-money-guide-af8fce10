import { useState } from "react";
import { Calculator, Home, PiggyBank, Receipt, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FinanceChart from "@/components/FinanceChart";

const Tools = () => {
  // EMI Calculator State
  const [emiData, setEmiData] = useState({
    principal: "",
    rate: "",
    tenure: "",
    result: null as any
  });

  // SIP Calculator State
  const [sipData, setSipData] = useState({
    amount: "",
    rate: "",
    tenure: "",
    result: null as any
  });

  // Loan Calculator State
  const [loanData, setLoanData] = useState({
    amount: "",
    rate: "",
    tenure: "",
    result: null as any
  });

  // Tax Calculator State
  const [taxData, setTaxData] = useState({
    income: "",
    deductions: "",
    result: null as any
  });

  // EMI Calculation
  const calculateEMI = () => {
    const P = parseFloat(emiData.principal);
    const r = parseFloat(emiData.rate) / 12 / 100;
    const n = parseFloat(emiData.tenure) * 12;

    if (P && r && n) {
      const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalAmount = emi * n;
      const totalInterest = totalAmount - P;

      setEmiData({
        ...emiData,
        result: {
          emi: Math.round(emi),
          totalAmount: Math.round(totalAmount),
          totalInterest: Math.round(totalInterest),
          chartData: Array.from({ length: Math.min(n, 12) }, (_, i) => ({
            month: `Month ${i + 1}`,
            emi: Math.round(emi),
            principal: Math.round(emi * (1 - Math.pow(1 + r, -(n - i)) / Math.pow(1 + r, n - i + 1))),
            interest: Math.round(emi - emi * (1 - Math.pow(1 + r, -(n - i)) / Math.pow(1 + r, n - i + 1)))
          }))
        }
      });
    }
  };

  // SIP Calculation
  const calculateSIP = () => {
    const P = parseFloat(sipData.amount);
    const r = parseFloat(sipData.rate) / 12 / 100;
    const n = parseFloat(sipData.tenure) * 12;

    if (P && r && n) {
      const futureValue = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
      const totalInvested = P * n;
      const totalReturns = futureValue - totalInvested;

      setSipData({
        ...sipData,
        result: {
          futureValue: Math.round(futureValue),
          totalInvested: Math.round(totalInvested),
          totalReturns: Math.round(totalReturns),
          chartData: Array.from({ length: Math.min(n, 12) }, (_, i) => ({
            month: `Month ${i + 1}`,
            invested: P * (i + 1),
            value: P * ((Math.pow(1 + r, i + 1) - 1) / r) * (1 + r)
          }))
        }
      });
    }
  };

  // Loan Calculation
  const calculateLoan = () => {
    const P = parseFloat(loanData.amount);
    const r = parseFloat(loanData.rate) / 12 / 100;
    const n = parseFloat(loanData.tenure) * 12;

    if (P && r && n) {
      const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalAmount = emi * n;
      const totalInterest = totalAmount - P;

      setLoanData({
        ...loanData,
        result: {
          emi: Math.round(emi),
          totalAmount: Math.round(totalAmount),
          totalInterest: Math.round(totalInterest),
          chartData: [
            { name: "Principal", value: P, fill: "hsl(var(--primary))" },
            { name: "Interest", value: totalInterest, fill: "hsl(var(--secondary))" }
          ]
        }
      });
    }
  };

  // Tax Calculation
  const calculateTax = () => {
    const income = parseFloat(taxData.income);
    const deductions = parseFloat(taxData.deductions) || 0;
    const taxableIncome = income - deductions;

    if (income) {
      let tax = 0;
      
      // Simplified tax calculation (Indian tax slabs for example)
      if (taxableIncome > 1000000) {
        tax += (taxableIncome - 1000000) * 0.3;
        tax += (1000000 - 500000) * 0.2;
        tax += (500000 - 250000) * 0.05;
      } else if (taxableIncome > 500000) {
        tax += (taxableIncome - 500000) * 0.2;
        tax += (500000 - 250000) * 0.05;
      } else if (taxableIncome > 250000) {
        tax += (taxableIncome - 250000) * 0.05;
      }

      const netIncome = income - tax;

      setTaxData({
        ...taxData,
        result: {
          tax: Math.round(tax),
          netIncome: Math.round(netIncome),
          taxableIncome: Math.round(taxableIncome),
          chartData: [
            { name: "Net Income", value: netIncome, fill: "hsl(var(--success))" },
            { name: "Tax", value: tax, fill: "hsl(var(--destructive))" },
            { name: "Deductions", value: deductions, fill: "hsl(var(--muted))" }
          ]
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Financial Tools
          </h1>
          <p className="text-lg text-muted-foreground">
            Powerful calculators to help you plan your finances and make informed decisions
          </p>
        </div>

        {/* Calculator Tabs */}
        <Tabs defaultValue="emi" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="emi" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              EMI
            </TabsTrigger>
            <TabsTrigger value="sip" className="flex items-center gap-2">
              <PiggyBank className="h-4 w-4" />
              SIP
            </TabsTrigger>
            <TabsTrigger value="loan" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Loan
            </TabsTrigger>
            <TabsTrigger value="tax" className="flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              Tax
            </TabsTrigger>
          </TabsList>

          {/* EMI Calculator */}
          <TabsContent value="emi" className="space-y-6">
            <Card className="card-gradient shadow-finance">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  EMI Calculator
                </CardTitle>
                <CardDescription>
                  Calculate your monthly loan payment (EMI) for home loans, car loans, and personal loans
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="emi-principal">Loan Amount (₹)</Label>
                      <Input
                        id="emi-principal"
                        type="number"
                        placeholder="1000000"
                        value={emiData.principal}
                        onChange={(e) => setEmiData({ ...emiData, principal: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emi-rate">Interest Rate (% per annum)</Label>
                      <Input
                        id="emi-rate"
                        type="number"
                        placeholder="8.5"
                        value={emiData.rate}
                        onChange={(e) => setEmiData({ ...emiData, rate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emi-tenure">Tenure (Years)</Label>
                      <Input
                        id="emi-tenure"
                        type="number"
                        placeholder="20"
                        value={emiData.tenure}
                        onChange={(e) => setEmiData({ ...emiData, tenure: e.target.value })}
                      />
                    </div>
                    <Button onClick={calculateEMI} className="w-full finance-gradient">
                      Calculate EMI
                    </Button>
                  </div>
                  
                  {emiData.result && (
                    <div className="space-y-4">
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-3">Results</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Monthly EMI:</span>
                            <span className="font-bold">₹{emiData.result.emi.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total Amount:</span>
                            <span>₹{emiData.result.totalAmount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total Interest:</span>
                            <span>₹{emiData.result.totalInterest.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <FinanceChart
                        data={emiData.result.chartData}
                        type="line"
                        xKey="month"
                        yKeys={["emi", "principal", "interest"]}
                        title="EMI Breakdown (First 12 Months)"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SIP Calculator */}
          <TabsContent value="sip" className="space-y-6">
            <Card className="card-gradient shadow-finance">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PiggyBank className="h-5 w-5" />
                  SIP Calculator
                </CardTitle>
                <CardDescription>
                  Calculate the future value of your Systematic Investment Plan (SIP)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="sip-amount">Monthly SIP Amount (₹)</Label>
                      <Input
                        id="sip-amount"
                        type="number"
                        placeholder="5000"
                        value={sipData.amount}
                        onChange={(e) => setSipData({ ...sipData, amount: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sip-rate">Expected Return (% per annum)</Label>
                      <Input
                        id="sip-rate"
                        type="number"
                        placeholder="12"
                        value={sipData.rate}
                        onChange={(e) => setSipData({ ...sipData, rate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sip-tenure">Investment Period (Years)</Label>
                      <Input
                        id="sip-tenure"
                        type="number"
                        placeholder="15"
                        value={sipData.tenure}
                        onChange={(e) => setSipData({ ...sipData, tenure: e.target.value })}
                      />
                    </div>
                    <Button onClick={calculateSIP} className="w-full finance-gradient">
                      Calculate SIP
                    </Button>
                  </div>
                  
                  {sipData.result && (
                    <div className="space-y-4">
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-3">Results</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Future Value:</span>
                            <span className="font-bold text-success">₹{sipData.result.futureValue.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total Invested:</span>
                            <span>₹{sipData.result.totalInvested.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total Returns:</span>
                            <span className="text-success">₹{sipData.result.totalReturns.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <FinanceChart
                        data={sipData.result.chartData}
                        type="area"
                        xKey="month"
                        yKeys={["invested", "value"]}
                        title="SIP Growth (First 12 Months)"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Loan Calculator */}
          <TabsContent value="loan" className="space-y-6">
            <Card className="card-gradient shadow-finance">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Loan Calculator
                </CardTitle>
                <CardDescription>
                  Calculate total loan cost and payment breakdown
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="loan-amount">Loan Amount (₹)</Label>
                      <Input
                        id="loan-amount"
                        type="number"
                        placeholder="500000"
                        value={loanData.amount}
                        onChange={(e) => setLoanData({ ...loanData, amount: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="loan-rate">Interest Rate (% per annum)</Label>
                      <Input
                        id="loan-rate"
                        type="number"
                        placeholder="10"
                        value={loanData.rate}
                        onChange={(e) => setLoanData({ ...loanData, rate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="loan-tenure">Tenure (Years)</Label>
                      <Input
                        id="loan-tenure"
                        type="number"
                        placeholder="5"
                        value={loanData.tenure}
                        onChange={(e) => setLoanData({ ...loanData, tenure: e.target.value })}
                      />
                    </div>
                    <Button onClick={calculateLoan} className="w-full finance-gradient">
                      Calculate Loan
                    </Button>
                  </div>
                  
                  {loanData.result && (
                    <div className="space-y-4">
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-3">Results</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Monthly EMI:</span>
                            <span className="font-bold">₹{loanData.result.emi.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total Amount:</span>
                            <span>₹{loanData.result.totalAmount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total Interest:</span>
                            <span className="text-destructive">₹{loanData.result.totalInterest.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <FinanceChart
                        data={loanData.result.chartData}
                        type="pie"
                        title="Principal vs Interest Breakdown"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tax Calculator */}
          <TabsContent value="tax" className="space-y-6">
            <Card className="card-gradient shadow-finance">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Tax Calculator
                </CardTitle>
                <CardDescription>
                  Estimate your income tax liability and plan accordingly
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="tax-income">Annual Income (₹)</Label>
                      <Input
                        id="tax-income"
                        type="number"
                        placeholder="1200000"
                        value={taxData.income}
                        onChange={(e) => setTaxData({ ...taxData, income: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tax-deductions">Total Deductions (₹)</Label>
                      <Input
                        id="tax-deductions"
                        type="number"
                        placeholder="150000"
                        value={taxData.deductions}
                        onChange={(e) => setTaxData({ ...taxData, deductions: e.target.value })}
                      />
                    </div>
                    <Button onClick={calculateTax} className="w-full finance-gradient">
                      Calculate Tax
                    </Button>
                    <div className="text-xs text-muted-foreground">
                      * Based on Indian tax slabs for demonstration
                    </div>
                  </div>
                  
                  {taxData.result && (
                    <div className="space-y-4">
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-3">Results</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Taxable Income:</span>
                            <span>₹{taxData.result.taxableIncome.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tax Liability:</span>
                            <span className="font-bold text-destructive">₹{taxData.result.tax.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Net Income:</span>
                            <span className="font-bold text-success">₹{taxData.result.netIncome.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <FinanceChart
                        data={taxData.result.chartData}
                        type="pie"
                        title="Income Distribution"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Tools;