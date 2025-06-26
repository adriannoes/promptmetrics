
import React from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const trendData = [
  { month: '27 jan', warby: 32, eyebuy: 18, zenni: 19, glasses: 14, rayban: 9, other: 8 },
  { month: '19 fev', warby: 31, eyebuy: 17, zenni: 20, glasses: 13, rayban: 8, other: 11 },
  { month: '14 mar', warby: 30, eyebuy: 19, zenni: 18, glasses: 16, rayban: 6, other: 11 },
  { month: '7 abr', warby: 31, eyebuy: 16, zenni: 19, glasses: 15, rayban: 7, other: 12 },
  { month: '30 abr', warby: 27, eyebuy: 18, zenni: 14, glasses: 17, rayban: 8, other: 16 },
  { month: '23 mai', warby: 28, eyebuy: 20, zenni: 21, glasses: 16, rayban: 5, other: 10 },
  { month: '15 jun', warby: 22, eyebuy: 9, zenni: 9, glasses: 8, rayban: 4, other: 48 },
];

const pieData = [
  { name: 'Warby parker', value: 22, color: '#3B82F6' },
  { name: 'Eyebuydirect', value: 10, color: '#10B981' },
  { name: 'Zenni optical', value: 10, color: '#F97316' },
  { name: 'Glassesusa', value: 8, color: '#EC4899' },
  { name: 'Ray-ban', value: 5, color: '#F59E0B' },
  { name: 'Other', value: 45, color: '#9CA3AF' },
];

const chartConfig = {
  warby: { label: 'Warby Parker', color: '#3B82F6' },
  eyebuy: { label: 'Eyebuydirect', color: '#10B981' },
  zenni: { label: 'Zenni Optical', color: '#F97316' },
  glasses: { label: 'Glassesusa', color: '#EC4899' },
  rayban: { label: 'Ray-ban', color: '#F59E0B' },
  other: { label: 'Other', color: '#9CA3AF' },
};

const DashboardPreview = () => {
  return (
    <div className="bg-white/90 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-2xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Market Share Trends */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">Market Share Trends</h3>
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

          <div className="h-64">
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
                    dataKey="warby" 
                    stroke={chartConfig.warby.color}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="eyebuy" 
                    stroke={chartConfig.eyebuy.color}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="zenni" 
                    stroke={chartConfig.zenni.color}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="glasses" 
                    stroke={chartConfig.glasses.color}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="rayban" 
                    stroke={chartConfig.rayban.color}
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

        {/* Market Share Distribution */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">Market Share Distribution</h3>
            <div className="w-4 h-4 rounded-full bg-slate-300 flex items-center justify-center">
              <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="w-48 h-48">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>

            <div className="flex-1 space-y-3">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-sm" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-slate-700">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-800">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPreview;
