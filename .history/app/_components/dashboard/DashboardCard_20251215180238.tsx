import { ReactNode } from "react";

interface Props {
  title: string;
  value: string | number;
  subtitle: string;
  icon: ReactNode;
}

export default function DashboardCard({ title, value, subtitle, icon }: Props) {
  return (
    <div className="bg-white border border-zinc-200 rounded p-5 shadow hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h2 className="text-2xl font-bold text-gray-900">{value}</h2>
          <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
        </div>
        <div className="p-2 rounded-lg bg-gray-100 text-lg">
          {icon}
        </div>
      </div>
    </div>
  );
}
