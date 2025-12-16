

import {
  FaUsers,
  FaUserTie,
  FaShoppingCart,
  FaClock,
  FaCheckCircle,
  FaHandsHelping,
  FaBullhorn,
  FaTags,
} from "react-icons/fa";
import DashboardCard from "./_components/dashboard/DashboardCard";
import BarChartBox from "./_components/dashboard/BarChartBox";
import LineChartBox from "./_components/dashboard/LineChartBox";
import PieChartBox from "./_components/dashboard/PieChartBox";

export default function DashboardPage() {
  return (
    <div className="p-2 bg-gray-50 min-h-[90vh] space-y-3">

      {/* ===== METRIC CARDS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <DashboardCard title="Total Farmers" value="1,230" subtitle="Registered users growing daily" icon={<FaUsers className="text-green-500" />} />
        <DashboardCard title="Total Agents" value="560" subtitle="Active agents on platform" icon={<FaUserTie  className="text-blue-500"/>} />
        <DashboardCard title="Total Orders" value="4,500" subtitle="Overall processed orders" icon={<FaShoppingCart cl/>} />
        <DashboardCard title="Pending Orders" value="120" subtitle="Orders awaiting action" icon={<FaClock />} />

        <DashboardCard title="Completed Orders" value="4,380" subtitle="Successful deliveries this year" icon={<FaCheckCircle />} />
        <DashboardCard title="Labour Requests" value="85" subtitle="Pending farm labour requests" icon={<FaHandsHelping />} />
        <DashboardCard title="Active Postings" value="310" subtitle="Current crop listings" icon={<FaBullhorn />} />
        <DashboardCard title="Total Categories" value="25" subtitle="Product categories available" icon={<FaTags />} />
      </div>

      {/* ===== CHART SECTION ===== */}
      <div className="flex w-full lg:flex-row gap-x-2 gap-y-3 flex-col">
        <div className="lg:w-[55vw] w-full">
          <BarChartBox />
        </div>
        <div className="flex-col lg:w-[30vw] gap-y-3 flex ">
          <LineChartBox />
        <PieChartBox />
        </div>
      </div>
    </div>
  );
}
