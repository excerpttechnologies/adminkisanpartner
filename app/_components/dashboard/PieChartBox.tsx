// "use client";

// import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

// // const data = [
// //   { name: "Vegetables", value: 40 },
// //   { name: "Grains", value: 25 },
// //   { name: "Fruits", value: 20 },
// //   { name: "Spices", value: 15 },
// // ];

// const COLORS = ["#16a34a", "#2563eb", "#f97316", "#e11d48","#8E52FF","#64605F","#A732BF","#203864","#59B1F1","#C02524","#FDFF00"];

// export default function PieChartBox({data}:{data:{name:string,value:number}[]}) {
//   return (
//     <div className="bg-white border border-zinc-200 rounded p-2 shadow">
//       <h3 className="font-semibold text-gray-800 mb-4">Category Distribution</h3>
//       <ResponsiveContainer width="100%" height={166}>
//         <PieChart>
//           <Pie data={data} dataKey="value" innerRadius={60} outerRadius={90}>
//             {data.map((_, i) => (
//               <Cell key={i} fill={COLORS[i]} />
//             ))}
//           </Pie>
//           <Tooltip />
//         </PieChart>
//       </ResponsiveContainer>

//       <div className="flex flex-wrap gap-3 mt-4 text-xs">
//         {data.map((d, i) => (
//           <div key={d.name} className="flex items-center gap-2">
//             <span className="w-3 h-3 rounded-full" style={{ background: COLORS[i] }} />
//             {d.name}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }





"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

// const data = [
//   { name: "Vegetables", value: 40 },
//   { name: "Grains", value: 25 },
//   { name: "Fruits", value: 20 },
//   { name: "Spices", value: 15 },
// ];

const COLORS = ["#16a34a", "#2563eb", "#f97316", "#e11d48","#8E52FF","#64605F","#A732BF","#203864","#59B1F1","#C02524","#FDFF00"];

export default function PieChartBox({data}:{data:{name:string,value:number}[]}) {
  return (
    <div className="bg-white border border-zinc-200 rounded p-2 shadow">
      <h3 className="font-semibold text-gray-800 mb-4">Crop Farming Type Distribution</h3>
      <ResponsiveContainer width="100%" height={166}>
        <PieChart>
          <Pie data={data} dataKey="value" innerRadius={60} outerRadius={90}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      <div className="flex flex-wrap gap-3 mt-4 text-xs">
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
