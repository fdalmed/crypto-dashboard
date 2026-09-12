export type ReallocationInput = {
  symbol: string;
  amount: number;
  change24h: number;
};

export type ReallocationResult = {
  symbol: string;
  currentAmount: number;
  suggestedAmount: number;
};

export function calculateConservativeReallocation(
  holdings: ReallocationInput[],
  reallocationRate: number,
): ReallocationResult[] {
  if (!Number.isFinite(reallocationRate) || reallocationRate < 0 || reallocationRate > 100) {
    throw new Error("Reallocation rate must be between 0 and 100.");
  }

  return holdings.map((holding) => {
    if (!Number.isFinite(holding.amount) || holding.amount < 0) {
      throw new Error("Holding amounts must be finite positive values.");
    }

    const shouldReduce = holding.change24h < -2;
    const suggestedAmount = shouldReduce
      ? holding.amount * (1 - reallocationRate / 100)
      : holding.amount;

    return { ...holding, currentAmount: holding.amount, suggestedAmount };
  });
}
