"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { month: "Jan", value: 120 },
  { month: "Feb", value: 140 },
  { month: "Mar", value: 160 },
  { month: "Apr", value: 200 },
  { month: "May", value: 220 },
  { month: "Jun", value: 210 },
  { month: "Jul", value: 210 },
  { month: "Jun", value: 210 },
];

export default function LineChartBox() {
  return (
    <div className="bg-white border border-zinc-200 rounded p-4 shadow h-fit">
      <h3 className="font-semibold text-gray-800 mb-4">Order Trends</h3>
      <ResponsiveContainer width="100%" height={150}>
        <LineChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" strokeWidth={3} 
           stroke="#16a34a"  
            dot={{ r: 4, fill: "#16a34a" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
