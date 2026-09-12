export type ProfitCalculatorInput = {
  investmentAmount: number;
  buyPrice: number;
  sellPrice: number;
  flatFees: number;
};

export type ProfitCalculatorResult = {
  quantity: number;
  initialInvestment: number;
  grossFinalValue: number;
  totalFees: number;
  finalValue: number;
  profitOrLoss: number;
  roiPercentage: number;
};

export function calculateProfit(input: ProfitCalculatorInput): ProfitCalculatorResult {
  assertFiniteNonNegative(input.investmentAmount, "Investment amount");
  assertFinitePositive(input.buyPrice, "Buy price");
  assertFiniteNonNegative(input.sellPrice, "Sell price");
  assertFiniteNonNegative(input.flatFees, "Flat fees");

  const quantity = input.investmentAmount / input.buyPrice;
  const grossFinalValue = quantity * input.sellPrice;
  const finalValue = grossFinalValue - input.flatFees;
  const profitOrLoss = finalValue - input.investmentAmount;

  return {
    quantity,
    initialInvestment: input.investmentAmount,
    grossFinalValue,
    totalFees: input.flatFees,
    finalValue,
    profitOrLoss,
    roiPercentage: input.investmentAmount === 0 ? 0 : (profitOrLoss / input.investmentAmount) * 100,
  };
}

function assertFiniteNonNegative(value: number, label: string) {
  if (!Number.isFinite(value) || value < 0) throw new Error(`${label} must be a finite value greater than or equal to zero.`);
}

function assertFinitePositive(value: number, label: string) {
  if (!Number.isFinite(value) || value <= 0) throw new Error(`${label} must be a finite value greater than zero.`);
}
