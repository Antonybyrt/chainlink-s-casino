import { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useChipHistory } from '@/contracts/useChipHistory';

const formatTime = (ms: number) =>
  new Date(ms).toLocaleString(undefined, {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

/** Header button + dialog plotting the connected wallet's CHIP balance history (from the indexer). */
export function BalanceHistoryChart() {
  const [open, setOpen] = useState(false);
  const { data: points, isLoading, isError } = useChipHistory();

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="ghost"
        className="text-emerald-300 hover:bg-gray-800 border border-emerald-500/40"
      >
        <TrendingUp className="w-4 h-4 mr-1" />
        History
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-emerald-300">CHIP balance history</DialogTitle>
          </DialogHeader>

          {isLoading && <p className="text-gray-400 font-mono text-sm py-10 text-center">Loading history…</p>}
          {isError && (
            <p className="text-red-400 font-mono text-sm py-10 text-center">
              Indexer unreachable — is the squid GraphQL server running?
            </p>
          )}
          {points && points.length === 0 && (
            <p className="text-gray-400 font-mono text-sm py-10 text-center">No CHIP transfer yet.</p>
          )}

          {points && points.length > 0 && (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={points} margin={{ top: 10, right: 16, bottom: 0, left: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
                <XAxis
                  dataKey="time"
                  type="number"
                  scale="time"
                  domain={['dataMin', 'dataMax']}
                  tickFormatter={formatTime}
                  stroke="#6b7280"
                  tick={{ fill: '#9ca3af', fontSize: 11 }}
                  tickLine={false}
                />
                <YAxis
                  stroke="#6b7280"
                  tick={{ fill: '#9ca3af', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  width={70}
                  tickFormatter={(v: number) => v.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                />
                <Tooltip
                  labelFormatter={(ms) => formatTime(Number(ms))}
                  formatter={(value) => [
                    `${Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 })} CHIP`,
                    'Balance',
                  ]}
                  contentStyle={{
                    background: '#111827',
                    border: '1px solid #374151',
                    borderRadius: 8,
                    color: '#e5e7eb',
                    fontSize: 12,
                  }}
                />
                {/* stepAfter: a balance only changes at discrete transfers */}
                <Line
                  type="stepAfter"
                  dataKey="balance"
                  stroke="#34d399"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
