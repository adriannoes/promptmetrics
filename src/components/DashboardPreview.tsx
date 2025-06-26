
import React from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const trendData = [
  { month: '27 jan', tesla: 32, byd: 18, ford: 19, toyota: 14, bmw: 9, other: 8 },
  { month: '19 fev', tesla: 31, byd: 17, ford: 20, toyota: 13, bmw: 8, other: 11 },
  { month: '14 mar', tesla: 30, byd: 19, ford: 18, toyota: 16, bmw: 6, other: 11 },
  { month: '7 abr', tesla: 31, byd: 16, ford: 19, toyota: 15, bmw: 7, other: 12 },
  { month: '30 abr', tesla: 27, byd: 18, ford: 14, toyota: 17, bmw: 8, other: 16 },
  { month: '23 mai', tesla: 28, byd: 20, ford: 21, toyota: 16, bmw: 5, other: 10 },
  { month: '15 jun', tesla: 22, byd: 9, ford: 9, toyota: 8, bmw: 4, other: 48 },
];

const chartConfig = {
  tesla: { label: 'Tesla', color: '#DC2626' },
  byd: { label: 'BYD', color: '#059669' },
  ford: { label: 'Ford', color: '#2563EB' },
  toyota: { label: 'Toyota', color: '#DC2626' },
  bmw: { label: 'BMW', color: '#7C3AED' },
  other: { label: 'Others', color: '#9CA3AF' },
};

const DashboardPreview = () => {
  return (
    <div className="bg-white/90 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-2xl">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800">Market Share Trends - Electric Vehicles</h3>
          <div className="w-4 h-4 rounded-full bg-slate-300 flex items-center justify-center">
            <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-xs">
          {Object.entries(chartConfig).map(([key, config]) => (
            <div key={key} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-sm" 
                style={{ backgroundColor: config.color }}
              ></div>
              <span className="text-slate-600">{config.label}</span>
            </div>
          ))}
        </div>

        <div className="h-80">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  className="text-xs"
                />
                <YAxis 
                  domain={[0, 50]}
                  axisLine={false}
                  tickLine={false}
                  className="text-xs"
                  tickFormatter={(value) => `${value}%`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="tesla" 
                  stroke={chartConfig.tesla.color}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="byd" 
                  stroke={chartConfig.byd.color}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="ford" 
                  stroke={chartConfig.ford.color}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="toyota" 
                  stroke={chartConfig.toyota.color}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="bmw" 
                  stroke={chartConfig.bmw.color}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="other" 
                  stroke={chartConfig.other.color}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardPreview;
