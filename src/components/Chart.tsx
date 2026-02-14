import { useEffect, useRef, useState } from 'react';
import type { Transaction } from '../types';
import { useApp } from '../context';

interface Props {
  transactions: Transaction[];
}

declare global {
  interface Window {
    anychart: any;
  }
}

export default function Chart({ transactions }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const { darkMode } = useApp();
  const [scriptReady, setScriptReady] = useState(() => !!window.anychart);

  const incomeTotal = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const expensesTotal = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const hasData = transactions.length > 0;

  useEffect(() => {
    if (window.anychart) {
      setScriptReady(true);
      return;
    }

    const loadScript = (src: string): Promise<void> =>
      new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = src;
        s.onload = () => resolve();
        s.onerror = reject;
        document.head.appendChild(s);
      });

    loadScript('https://cdn.anychart.com/releases/8.11.1/js/anychart-core.min.js')
      .then(() => loadScript('https://cdn.anychart.com/releases/8.11.1/js/anychart-pie.min.js'))
      .then(() => setScriptReady(true))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!scriptReady || !hasData || !containerRef.current || !window.anychart) return;

    if (chartRef.current) {
      chartRef.current.dispose();
      chartRef.current = null;
    }

    const data = window.anychart.data.set([
      ['Income', incomeTotal],
      ['Expenses', expensesTotal],
    ]);

    const chart = window.anychart.pie(data);
    const palette = window.anychart.palettes.distinctColors();
    palette.items([{ color: '#5D9C59' }, { color: '#DF2E38' }]);
    chart.palette(palette);

    chart
      .title()
      .enabled(true)
      .text('Income vs Expenses')
      .fontSize(18);

    chart.container(containerRef.current);
    chart.draw();

    chart
      .background()
      .fill(darkMode ? '#1a1f26' : '#ffffffff')
      .cornerType('round')
      .corners(12);
    chart.title().fontColor(darkMode ? '#f2f2f2' : '#333');

    chartRef.current = chart;

    return () => {
      if (chartRef.current) {
        chartRef.current.dispose();
        chartRef.current = null;
      }
    };
  }, [scriptReady, hasData, incomeTotal, expensesTotal, darkMode]);

  useEffect(() => {
    if (!chartRef.current) return;
    chartRef.current
      .background()
      .fill(darkMode ? '#1a1f26' : '#ffffffff')
      .cornerType('round')
      .corners(12);
    chartRef.current.title().fontColor(darkMode ? '#f2f2f2' : '#333');
  }, [darkMode]);

  if (!hasData) return null;

  return (
    <div className="chart-wrapper container" style={{ display: 'flex' }}>
      <div id="chart-container" ref={containerRef}></div>
    </div>
  );
}
