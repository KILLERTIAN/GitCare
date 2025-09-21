import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ReputationChartProps {
  data: { date: string; reputation: number }[];
}

const ReputationChart: React.FC<ReputationChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="reputation" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ReputationChart;
