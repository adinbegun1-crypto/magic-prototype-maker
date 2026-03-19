export type Stock = {
  ticker: string;
  name: string;
  market: "TASE" | "NYSE" | "NASDAQ" | "LSE" | "ETF";
  price: number;
  currency: "₪" | "$" | "£";
  change: number;   // % change today
  changePct: number;
  volume: string;
  marketCap: string;
  high52: number;
  low52: number;
  sector: string;
  color: string;
};

export const allStocks: Stock[] = [
  // TASE – Tel Aviv Stock Exchange
  { ticker: "TEVA", name: "Teva Pharmaceutical", market: "TASE", price: 4820, currency: "₪", change: +94.2, changePct: +2.0, volume: "3.2M", marketCap: "₪48B", high52: 5400, low52: 3100, sector: "Healthcare", color: "#2D6A4F" },
  { ticker: "NICE", name: "NICE Systems", market: "TASE", price: 38200, currency: "₪", change: -380, changePct: -0.98, volume: "120K", marketCap: "₪12B", high52: 42000, low52: 31000, sector: "Technology", color: "#40916C" },
  { ticker: "CHKP", name: "Check Point Software", market: "TASE", price: 52100, currency: "₪", change: +620, changePct: +1.21, volume: "95K", marketCap: "₪180B", high52: 56000, low52: 44000, sector: "Cybersecurity", color: "#52B788" },
  { ticker: "MNRV", name: "Menorah Mivtachim", market: "TASE", price: 1940, currency: "₪", change: +18, changePct: +0.94, volume: "540K", marketCap: "₪9B", high52: 2200, low52: 1650, sector: "Finance", color: "#74C69D" },
  { ticker: "BCOM", name: "Bank Hapoalim", market: "TASE", price: 3650, currency: "₪", change: +45, changePct: +1.25, volume: "1.8M", marketCap: "₪55B", high52: 3900, low52: 3100, sector: "Banking", color: "#1B4332" },
  { ticker: "DSCT", name: "Bank Discount", market: "TASE", price: 2310, currency: "₪", change: -22, changePct: -0.94, volume: "2.1M", marketCap: "₪38B", high52: 2600, low52: 1980, sector: "Banking", color: "#2D6A4F" },

  // NYSE
  { ticker: "AAPL", name: "Apple Inc.", market: "NASDAQ", price: 189.45, currency: "$", change: +2.31, changePct: +1.23, volume: "58M", marketCap: "$2.9T", high52: 198, low52: 164, sector: "Technology", color: "#1B4332" },
  { ticker: "MSFT", name: "Microsoft Corp.", market: "NASDAQ", price: 415.20, currency: "$", change: +5.80, changePct: +1.42, volume: "22M", marketCap: "$3.1T", high52: 430, low52: 311, sector: "Technology", color: "#2D6A4F" },
  { ticker: "GOOGL", name: "Alphabet Inc.", market: "NASDAQ", price: 178.90, currency: "$", change: -1.40, changePct: -0.78, volume: "21M", marketCap: "$2.2T", high52: 193, low52: 130, sector: "Technology", color: "#40916C" },
  { ticker: "AMZN", name: "Amazon.com Inc.", market: "NASDAQ", price: 225.30, currency: "$", change: +4.20, changePct: +1.90, volume: "35M", marketCap: "$2.4T", high52: 242, low52: 151, sector: "E-Commerce", color: "#52B788" },
  { ticker: "NVDA", name: "NVIDIA Corp.", market: "NASDAQ", price: 880.50, currency: "$", change: +22.10, changePct: +2.58, volume: "42M", marketCap: "$2.1T", high52: 974, low52: 394, sector: "Semiconductors", color: "#74C69D" },
  { ticker: "META", name: "Meta Platforms", market: "NASDAQ", price: 521.80, currency: "$", change: -3.90, changePct: -0.74, volume: "17M", marketCap: "$1.3T", high52: 589, low52: 414, sector: "Social Media", color: "#1B4332" },
  { ticker: "TSLA", name: "Tesla Inc.", market: "NASDAQ", price: 248.70, currency: "$", change: +6.40, changePct: +2.64, volume: "80M", marketCap: "$792B", high52: 299, low52: 138, sector: "Automotive", color: "#2D6A4F" },
  { ticker: "JPM",  name: "JPMorgan Chase", market: "NYSE", price: 218.60, currency: "$", change: +1.80, changePct: +0.83, volume: "9M", marketCap: "$629B", high52: 226, low52: 146, sector: "Banking", color: "#40916C" },
  { ticker: "JNJ",  name: "Johnson & Johnson", market: "NYSE", price: 156.20, currency: "$", change: -0.90, changePct: -0.57, volume: "7M", marketCap: "$375B", high52: 168, low52: 144, sector: "Healthcare", color: "#52B788" },

  // LSE
  { ticker: "SHEL", name: "Shell plc", market: "LSE", price: 2742, currency: "£", change: +18.5, changePct: +0.68, volume: "18M", marketCap: "£168B", high52: 2895, low52: 2280, sector: "Energy", color: "#1B4332" },
  { ticker: "HSBA", name: "HSBC Holdings", market: "LSE", price: 698, currency: "£", change: +4.2, changePct: +0.60, volume: "42M", marketCap: "£133B", high52: 724, low52: 580, sector: "Banking", color: "#2D6A4F" },

  // ETFs
  { ticker: "SPY",  name: "S&P 500 ETF (SPDR)", market: "ETF", price: 542.10, currency: "$", change: +7.20, changePct: +1.34, volume: "65M", marketCap: "$512B", high52: 566, low52: 410, sector: "Index ETF", color: "#40916C" },
  { ticker: "QQQ",  name: "Nasdaq 100 ETF", market: "ETF", price: 464.80, currency: "$", change: +9.40, changePct: +2.06, volume: "40M", marketCap: "$220B", high52: 503, low52: 349, sector: "Index ETF", color: "#52B788" },
  { ticker: "TA125", name: "Tel Aviv 125 ETF", market: "ETF", price: 1850, currency: "₪", change: +24.5, changePct: +1.34, volume: "1.1M", marketCap: "₪3.2B", high52: 1940, low52: 1550, sector: "Index ETF", color: "#74C69D" },
];

export const MARKETS = ["All", "TASE", "NASDAQ", "NYSE", "LSE", "ETF"] as const;
export type Market = (typeof MARKETS)[number];
