

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
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">

      {/* ===== METRIC CARDS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard title="Total Farmers" value="1,230" subtitle="Registered users growing daily" icon={<FaUsers />} />
        <DashboardCard title="Total Agents" value="560" subtitle="Active agents on platform" icon={<FaUserTie />} />
        <DashboardCard title="Total Orders" value="4,500" subtitle="Overall processed orders" icon={<FaShoppingCart />} />
        <DashboardCard title="Pending Orders" value="120" subtitle="Orders awaiting action" icon={<FaClock />} />

        <DashboardCard title="Completed Orders" value="4,380" subtitle="Successful deliveries this year" icon={<FaCheckCircle />} />
        <DashboardCard title="Labour Requests" value="85" subtitle="Pending farm labour requests" icon={<FaHandsHelping />} />
        <DashboardCard title="Active Postings" value="310" subtitle="Current crop listings" icon={<FaBullhorn />} />
        <DashboardCard title="Total Categories" value="25" subtitle="Product categories available" icon={<FaTags />} />
      </div>

      {/* ===== CHART SECTION ===== */}
      <div className="flex">
        <div className="">
          <BarChartBox />
        </div>
        <div cl>
          <LineChartBox />
        <PieChartBox />
        </div>
      </div>
    </div>
  );
}
