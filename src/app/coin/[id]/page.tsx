import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CoinDetailPage from "@/components/coin/CoinDetailPage";
import DataUnavailable from "@/components/ui/DataUnavailable";
import { getCoinDetail, getCoinPriceHistory } from "@/lib/crypto-api/coin";
import { CryptoApiNotFoundError } from "@/lib/crypto-api/client";

type Props = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const coin = await getCoinDetail(id);
    return {
      title: `${coin.name} Price, Market Cap & Chart | Crypto Market Dashboard`,
      description: `Current ${coin.name} market information, including USD price, market cap, volume, and a historical price chart.`,
    };
  } catch {
    return {
      title: "Cryptocurrency Market Data | Crypto Market Dashboard",
      description: "Current cryptocurrency market information and historical price data.",
    };
  }
}

export default async function CoinPage({ params }: Props) {
  const { id } = await params;
  let coin = null;

  try {
    coin = await getCoinDetail(id);
  } catch (error) {
    if (error instanceof CryptoApiNotFoundError) notFound();
    coin = null;
  }

  if (!coin) return <DataUnavailable />;

  const history = await getCoinPriceHistory(id).catch(() => []);
  return <CoinDetailPage coin={coin} history={history} />;
}
