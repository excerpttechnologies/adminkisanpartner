"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { month: "Jan", value: 180 },
  { month: "Feb", value: 220 },
  { month: "Mar", value: 190 },
  { month: "Apr", value: 250 },
  { month: "May", value: 300 },
  { month: "Jun", value: 270 },
];

export default function BarChartBox() {
  return (
    <div className="bg-white border rounded border-zinc-200 p-4 shadow">
      <h3 className="font-semibold text-gray-800 mb-4">Monthly Crop Postings</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
