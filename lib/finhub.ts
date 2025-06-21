import axios from 'axios';

const FINNHUB_TOKEN = process.env.FINNHUB_API_KEY;

export async function getStockQuote(symbol: string) {
  const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_TOKEN}`;
  const res = await axios.get(url);
  return res.data; // { c: current, h: high, l: low, o: open, pc: prevClose }
}
