import type { MarketSortKey, SortDirection } from "@/lib/market-list";
import type { MarketCoin } from "@/types/market";
import MarketNav from "./MarketNav";
import MarketPageHeader from "./MarketPageHeader";
import MarketTable from "./MarketTable";

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  coins: MarketCoin[];
  initialSort?: MarketSortKey;
  initialDirection?: SortDirection;
  searchable?: boolean;
  showTrendingScore?: boolean;
};

export default function MarketPage({ coins, ...pageProps }: Props) {
  return (
    <div className="py-6">
      <MarketNav />
      <MarketPageHeader {...pageProps} count={coins.length} />
      <MarketTable
        coins={coins}
        initialSort={pageProps.initialSort}
        initialDirection={pageProps.initialDirection}
        searchable={pageProps.searchable}
        showTrendingScore={pageProps.showTrendingScore}
      />
    </div>
  );
}
