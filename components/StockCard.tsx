'use client';

import { MiniChart } from 'react-ts-tradingview-widgets';

type StockData = {
  symbol: string;
  c: number;
  h: number;
  l: number;
  o: number;
  pc: number;
  marketCapitalization?: number;
  peBasicExclExtraTTM?: number;
  epsTTM?: number;
  dividendYieldIndicatedAnnual?: number;
};

export function StockCard({ data }: { data: StockData }) {
  const percentChange = ((data.c - data.pc) / data.pc) * 100;
  const chartData = [data.pc, data.o, data.l, data.h, data.c].map((price, i) => ({
    time: i,
    value: price,
  }));

  return (
    <div className="bg-white rounded-xl shadow p-5 space-y-6">
  <div className="flex justify-between items-center">
    <h2 className="text-xl font-bold">{data.symbol}</h2>
    <span className={`text-sm font-semibold ${percentChange >= 0 ? 'text-green-600' : 'text-red-500'}`}>
      {percentChange.toFixed(2)}%
    </span>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="grid grid-cols-2 gap-3 text-sm">
      <p><span className="text-gray-500">💰 Current:</span> ${data.c}</p>
      <p><span className="text-gray-500">📈 High:</span> ${data.h}</p>
      <p><span className="text-gray-500">📉 Low:</span> ${data.l}</p>
      <p><span className="text-gray-500">🟢 Open:</span> ${data.o}</p>
      <p><span className="text-gray-500">🔵 Prev Close:</span> ${data.pc}</p>
      <p><span className="text-gray-500">📦 Market Cap:</span> ${data.marketCapitalization?.toFixed(2) ?? '—'}B</p>
      <p><span className="text-gray-500">🧮 P/E Ratio:</span> {data.peBasicExclExtraTTM?.toFixed(2) ?? '—'}</p>
      <p><span className="text-gray-500">💵 EPS:</span> ${data.epsTTM?.toFixed(2) ?? '—'}</p>
      <p><span className="text-gray-500">🪙 Dividend:</span> {data.dividendYieldIndicatedAnnual?.toFixed(2) ?? '—'}%</p>
    </div>

    <div className="mt-4">
      <MiniChart
        symbol={`NASDAQ:${data.symbol}`}
        width="100%"
        height={200}
        colorTheme="light"
      />
    </div>
  </div>
</div>
  );
}

