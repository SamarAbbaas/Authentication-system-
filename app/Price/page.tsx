import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface PriceCardProps {
  itemName: string;
  itemNameLocal?: string | null;
  unit: string;
  minRate?: number;
  maxRate?: number;
  avgRate?: number;
  category?: string;
  categoryIcon?: string;
  prevAvgRate?: number;
  onClick?: () => void;
}

export default function Price({
  itemName,
  itemNameLocal,
  unit,
  minRate = 0,
  maxRate = 0,
  avgRate = 0,
  category,
  categoryIcon,
  prevAvgRate,
  onClick
}: PriceCardProps) {
  // Safe calculation to avoid division by zero or NaN issues
  const change = (prevAvgRate && prevAvgRate > 0)
    ? ((avgRate - prevAvgRate) / prevAvgRate) * 100 
    : 0;

  const TrendIcon = change > 1 ? TrendingUp : change < -1 ? TrendingDown : Minus;
  const trendColor = change > 1 ? 'text-red-500' : change < -1 ? 'text-emerald-500' : 'text-slate-400';
  const trendBg = change > 1 ? 'bg-red-50' : change < -1 ? 'bg-emerald-50' : 'bg-slate-50';

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-800 text-base leading-tight truncate">{itemName}</p>
          {itemNameLocal && (
            <p className="text-sm text-slate-400 mt-0.5">{itemNameLocal}</p>
          )}
        </div>
        {categoryIcon && (
          <span className="text-2xl ml-2 flex-shrink-0">{categoryIcon}</span>
        )}
      </div>

      <div className="flex items-end justify-between mt-4">
        <div>
          <p className="text-2xl font-bold text-slate-900">
            Rs. {Number(avgRate)?.toFixed(0) ?? '0'}
            <span className="text-sm font-normal text-slate-400 ml-1">/{unit}</span>
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Range: Rs. {Number(minRate)?.toFixed(0) ?? '0'} – {Number(maxRate)?.toFixed(0) ?? '0'}
          </p>
        </div>
        {prevAvgRate !== undefined && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${trendBg} ${trendColor}`}>
            <TrendIcon size={12} />
            {Math.abs(change).toFixed(1)}%
          </div>
        )}
      </div>

      {category && (
        <div className="mt-3 pt-3 border-t border-slate-50">
          <span className="text-xs text-slate-400">{category}</span>
        </div>
      )}
    </div>
  );
}