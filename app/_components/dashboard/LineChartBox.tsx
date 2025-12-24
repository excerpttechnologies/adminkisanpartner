"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// const data = [
//   { month: "Jan", value: 120 },
//   { month: "Feb", value: 140 },
//   { month: "Mar", value: 160 },
//   { month: "Apr", value: 200 },
//   { month: "May", value: 220 },
//   { month: "Jun", value: 110 },
//   { month: "Jul", value: 150 },
//   { month: "Aug", value: 210 },
// ];

export default function LineChartBox({data,year}:{data:{month:string,value:number}[],year:number}) {
  return (
    <div className="bg-white border border-zinc-200 rounded p-3 shadow h-fit">
      <h3 className="font-semibold text-gray-800 mb-4">Order Trends {year}</h3>
      <ResponsiveContainer width="100%" height={155}>
        <LineChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" strokeWidth={3} 
           stroke="#16a34a"  
            // dot={{ r: 4, fill: "#16a34a" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
