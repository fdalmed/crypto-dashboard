export type DcaCalculatorInput = {
  contribution: number;
  periods: number;
  averagePurchasePrice: number;
  currentPrice: number;
};

export type DcaCalculatorResult = {
  totalInvested: number;
  contributions: number;
  totalQuantity: number;
  currentValue: number;
  profitOrLoss: number;
  roiPercentage: number;
};

export function calculateDca(input: DcaCalculatorInput): DcaCalculatorResult {
  if (!Number.isFinite(input.contribution) || input.contribution < 0) throw new Error("Contribution must be a finite value greater than or equal to zero.");
  if (!Number.isInteger(input.periods) || input.periods <= 0) throw new Error("Periods must be a positive whole number.");
  if (!Number.isFinite(input.averagePurchasePrice) || input.averagePurchasePrice <= 0) throw new Error("Average purchase price must be a finite value greater than zero.");
  if (!Number.isFinite(input.currentPrice) || input.currentPrice < 0) throw new Error("Current price must be a finite value greater than or equal to zero.");

  const totalInvested = input.contribution * input.periods;
  const totalQuantity = totalInvested / input.averagePurchasePrice;
  const currentValue = totalQuantity * input.currentPrice;
  const profitOrLoss = currentValue - totalInvested;

  return {
    totalInvested,
    contributions: input.periods,
    totalQuantity,
    currentValue,
    profitOrLoss,
    roiPercentage: totalInvested === 0 ? 0 : (profitOrLoss / totalInvested) * 100,
  };
}
