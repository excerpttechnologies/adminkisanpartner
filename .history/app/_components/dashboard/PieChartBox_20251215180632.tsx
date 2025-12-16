"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Vegetables", value: 40 },
  { name: "Grains", value: 25 },
  { name: "Fruits", value: 20 },
  { name: "Spices", value: 15 },
];

const COLORS = ["#16a34a", "#2563eb", "#f97316", "#e11d48"];

export default function PieChartBox() {
  return (
    <div className="bg-white border border-z rounded p-4 shadow">
      <h3 className="font-semibold text-gray-800 mb-4">Category Distribution</h3>
      <ResponsiveContainer width="100%" height={150}>
        <PieChart>
          <Pie data={data} dataKey="value" innerRadius={60} outerRadius={90}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      <div className="flex flex-wrap gap-3 mt-4 text-sm">
        {data.map((d, i) => (
          <div key={d.name} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ background: COLORS[i] }} />
            {d.name}
          </div>
        ))}
      </div>
    </div>
  );
}
