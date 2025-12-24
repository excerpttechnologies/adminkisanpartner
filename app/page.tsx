

// import {
//   FaUsers,
//   FaUserTie,
//   FaShoppingCart,
//   FaClock,
//   FaCheckCircle,
//   FaHandsHelping,
//   FaBullhorn,
//   FaTags,
// } from "react-icons/fa";
// import DashboardCard from "./_components/dashboard/DashboardCard";
// import BarChartBox from "./_components/dashboard/BarChartBox";
// import LineChartBox from "./_components/dashboard/LineChartBox";
// import PieChartBox from "./_components/dashboard/PieChartBox";

// export default function DashboardPage() {
//   return (
//     <div className="p-2 bg-gray-50 min-h-[90vh] space-y-3">

//       {/* ===== METRIC CARDS ===== */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
//         <DashboardCard title="Total Farmers" value="1,230" subtitle="Registered users growing daily" icon={<FaUsers className="text-green-500" />} />
//         <DashboardCard title="Total Agents" value="560" subtitle="Active agents on platform" icon={<FaUserTie  className="text-blue-500"/>} />
//         <DashboardCard title="Total Orders" value="4,500" subtitle="Overall processed orders" icon={<FaShoppingCart className="text-violet-500"/>} />
//         <DashboardCard title="Pending Orders" value="120" subtitle="Orders awaiting action" icon={<FaClock className="text-orange-500"/>} />

//         <DashboardCard title="Completed Orders" value="4,380" subtitle="Successful deliveries this year" icon={<FaCheckCircle className="text-pink-500" />} />
//         <DashboardCard title="Labour Requests" value="85" subtitle="Pending farm labour requests" icon={<FaHandsHelping className="text-red-500"/>} />
//         <DashboardCard title="Active Postings" value="310" subtitle="Current crop listings" icon={<FaBullhorn className="text-yellow-500"/>} />
//         <DashboardCard title="Total Categories" value="25" subtitle="Product categories available" icon={<FaTags  className="text-sky-500"/>} />
//       </div>

//       {/* ===== CHART SECTION ===== */}
//       <div className="flex w-full lg:flex-row gap-x-2 gap-y-3 flex-col">
//         <div className="lg:w-[55vw] w-full">
//           <BarChartBox />
//         </div>
//         <div className="flex-col lg:w-[30vw] gap-y-3 flex ">
//           <LineChartBox />
//         <PieChartBox />
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";

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
import axios from "axios";
import { CircularProgress } from "@mui/material";

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

   const fetchDashboard = async () => {
    try {
      const res = await axios.get("/api/dashboard");
      setDashboard(res.data.data);
    } catch (err) {
      console.error("Dashboard error", err);
    } finally {
      setLoading(false);
    }
  };

  console.log(dashboard)

  useEffect(() => {
    fetchDashboard();
  }, []);

 
  if (loading) return <>
  <div className="min-h-screen absolute w-full top-0 left-0 bg-[#fdfbfb73] z-[100] flex items-center justify-center">
            <CircularProgress />
  </div>
  </>

  return (
    <div className="p-2 bg-gray-50 min-h-[90vh] space-y-3">

      {/* ===== METRIC CARDS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <DashboardCard
          title="Total Farmers"
          value={dashboard.totalFarmers}
          subtitle="Registered users growing daily"
          icon={<FaUsers className="text-green-500" />}
        />

        <DashboardCard
          title="Total Agents"
          value={dashboard.totalAgents}
          subtitle="Active agents on platform"
          icon={<FaUserTie className="text-blue-500" />}
        />

        <DashboardCard
          title="Total Orders"
          value={dashboard.totalOrders}
          subtitle="Overall processed orders"
          icon={<FaShoppingCart className="text-violet-500" />}
        />

        <DashboardCard
          title="Pending Orders"
          value={dashboard.pendingOrders}
          subtitle="Orders awaiting action"
          icon={<FaClock className="text-orange-500" />}
        />

        <DashboardCard
          title="Completed Orders"
          value={dashboard.completedOrders}
          subtitle="Successful deliveries this year"
          icon={<FaCheckCircle className="text-pink-500" />}
        />

        <DashboardCard
          title="Labour Requests"
          value={dashboard.labourRequests}
          subtitle="Pending farm labour requests"
          icon={<FaHandsHelping className="text-red-500" />}
        />

        <DashboardCard
          title="Active Postings"
          value={dashboard.activePostings}
          subtitle="Current crop listings"
          icon={<FaBullhorn className="text-yellow-500" />}
        />

        <DashboardCard
          title="Total Categories"
          value={dashboard.totalCategories}
          subtitle="Product categories available"
          icon={<FaTags className="text-sky-500" />}
        />
      </div>

      {/* ===== CHART SECTION ===== */}
      <div className="flex w-full lg:flex-row gap-x-2 gap-y-3 flex-col">
        <div className="lg:w-[55vw] w-full">
          <BarChartBox />
        </div>

        <div className="flex-col lg:w-[30vw] gap-y-3 flex">
          <LineChartBox data={dashboard?.orderTrends?dashboard.orderTrends : []} year={dashboard?.year}/>
          <PieChartBox data={dashboard?.postingCategoryDistribution?dashboard.postingCategoryDistribution:[]} />
        </div>
      </div>
    </div>
  );
}
