'use client';

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const data = [
  { name: 'Jan', total: 12000 },
  { name: 'Feb', total: 19000 },
  { name: 'Mar', total: 30000 },
  { name: 'Apr', total: 50000 },
  { name: 'May', total: 20000 },
  { name: 'Jun', total: 30000 },
  { name: 'Jul', total: 40000 },
  { name: 'Aug', total: 50000 },
  { name: 'Sep', total: 42000 },
  { name: 'Oct', total: 38000 },
  { name: 'Nov', total: 45000 },
  { name: 'Dec', total: 52000 },
];

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="total" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  );
}