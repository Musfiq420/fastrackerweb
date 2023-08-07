import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const RADIAN = Math.PI / 180;
const data = [
  { name: 'A', value: 33, color: '#D8F5D6' },
  { name: 'B', value: 34, color: '#4DDC41' },
  { name: 'C', value: 33, color: '#0C9C00' },
];
const cx = 30;
const cy = 30;
const iR = 20;
const oR = 30;
const value = 50.25;

const needle = (value, data, cx, cy, iR, oR, color) => {
  let total = 0;
  data.forEach((v) => {
    total += v.value;
  });
  const ang = 180.0 * (1 - value / total);
  const length = (iR + 2 * oR) / 3;
  const sin = Math.sin(-RADIAN * ang);
  const cos = Math.cos(-RADIAN * ang);
  const r = 2;
  const x0 = cx + 5;
  const y0 = cy + 5;
  const xba = x0 + r * sin;
  const yba = y0 - r * cos;
  const xbb = x0 - r * sin;
  const ybb = y0 + r * cos;
  const xp = x0 + length * cos;
  const yp = y0 + length * sin;

  return [
    <circle cx={x0} cy={y0} r={r} fill={color} stroke="none" />,
    <path d={`M${xba} ${yba}L${xbb} ${ybb} L${xp} ${yp} L${xba} ${yba}`} stroke="#none" fill={color} />,
  ];
};

const GaugeChart = ({oR, value, stroke}) => {
  return (
    <ResponsiveContainer height={oR+10} width={oR*2+10} >
      <PieChart>
            <Pie
              dataKey="value"
              startAngle={180}
              endAngle={0}
              data={data}
              cx={oR}
              cy={oR}
              innerRadius={oR - stroke}
              outerRadius={oR}
              fill="#8884d8"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            {needle(value, data, oR, oR, oR - stroke, oR, '#8F8F8F')}
          </PieChart>
    </ResponsiveContainer>
    
  );
};

export default GaugeChart;
