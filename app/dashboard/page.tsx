

// "use client";

// import { useEffect, useState } from "react";

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


// import { CircularProgress } from "@mui/material";
// import axios from "axios";
// import DashboardCard from "../_components/dashboard/DashboardCard";
// import BarChartBox from "../_components/dashboard/BarChartBox";
// import LineChartBox from "../_components/dashboard/LineChartBox";
// import PieChartBox from "../_components/dashboard/PieChartBox";

// export default function DashboardPage() {
//   const [dashboard, setDashboard] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//    const fetchDashboard = async () => {
//     try {
//       const res = await axios.get("/api/dashboard");
//       setDashboard(res.data.data);
//     } catch (err) {
//       console.error("Dashboard error", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   console.log(dashboard)

//   useEffect(() => {
//     fetchDashboard();
//   }, []);

 
//   if (loading) return <>
//   <div className="min-h-screen absolute w-full top-0 left-0 bg-[#fdfbfb73] z-[100] flex items-center justify-center">
//             <CircularProgress />
//   </div>
//   </>

//   return (
//     <div className="p-2 bg-gray-50 min-h-[90vh] space-y-3">

//       {/* ===== METRIC CARDS ===== */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
//         <DashboardCard
//           title="Total Farmers"
//           value={dashboard.totalFarmers}
//           subtitle="Registered users growing daily"
//           icon={<FaUsers className="text-green-500" />}
//         />

//         <DashboardCard
//           title="Total Agents"
//           value={dashboard.totalAgents}
//           subtitle="Active agents on platform"
//           icon={<FaUserTie className="text-blue-500" />}
//         />

//         <DashboardCard
//           title="Total Orders"
//           value={dashboard.totalOrders}
//           subtitle="Overall processed orders"
//           icon={<FaShoppingCart className="text-violet-500" />}
//         />

//         <DashboardCard
//           title="Pending Orders"
//           value={dashboard.pendingOrders}
//           subtitle="Orders awaiting action"
//           icon={<FaClock className="text-orange-500" />}
//         />

//         <DashboardCard
//           title="Completed Orders"
//           value={dashboard.completedOrders}
//           subtitle="Successful deliveries this year"
//           icon={<FaCheckCircle className="text-pink-500" />}
//         />

//         <DashboardCard
//           title="Labour Requests"
//           value={dashboard.labourRequests}
//           subtitle="Pending farm labour requests"
//           icon={<FaHandsHelping className="text-red-500" />}
//         />

//         <DashboardCard
//           title="Active Postings"
//           value={dashboard.activePostings}
//           subtitle="Current crop listings"
//           icon={<FaBullhorn className="text-yellow-500" />}
//         />

//         <DashboardCard
//           title="Total Categories"
//           value={dashboard.totalCategories}
//           subtitle="Product categories available"
//           icon={<FaTags className="text-sky-500" />}
//         />
//       </div>

//       {/* ===== CHART SECTION ===== */}
//       <div className="flex w-full lg:flex-row gap-x-2 gap-y-3 flex-col">
//         <div className="lg:w-[55vw] w-full">
//           <BarChartBox />
//         </div>

//         <div className="flex-col lg:w-[30vw] gap-y-3 flex">
//           <LineChartBox data={dashboard?.orderTrends?dashboard.orderTrends : []} year={dashboard?.year}/>
//           <PieChartBox data={dashboard?.postingCategoryDistribution?dashboard.postingCategoryDistribution:[]} />
//         </div>
//       </div>
//     </div>
//   );
// }












// "use client";

// import { useEffect, useState } from "react";

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


// import { CircularProgress } from "@mui/material";
// import axios from "axios";
// import DashboardCard from "../_components/dashboard/DashboardCard";
// import BarChartBox from "../_components/dashboard/BarChartBox";
// import LineChartBox from "../_components/dashboard/LineChartBox";
// import PieChartBox from "../_components/dashboard/PieChartBox";

// export default function DashboardPage() {
//   const [dashboard, setDashboard] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//    const fetchDashboard = async () => {
//     try {
//       const res = await axios.get("/api/dashboard");
//       setDashboard(res.data.data);
//     } catch (err) {
//       console.error("Dashboard error", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   console.log(dashboard)

//   useEffect(() => {
//     fetchDashboard();
//   }, []);

 
//   if (loading) return <>
//   <div className="min-h-screen absolute w-full top-0 left-0 bg-[#fdfbfb73] z-[100] flex items-center justify-center">
//             <CircularProgress />
//   </div>
//   </>

//   return (
//     <div className="p-2 bg-gray-50 min-h-[90vh] space-y-3">

//       {/* ===== METRIC CARDS ===== */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
//         <DashboardCard
//           title="Total Farmers"
//           value={dashboard.totalFarmers}
//           subtitle="Registered users growing daily"
//           icon={<FaUsers className="text-green-500" />}
//         />

//         <DashboardCard
//           title="Total Agents"
//           value={dashboard.totalAgents}
//           subtitle="Active agents on platform"
//           icon={<FaUserTie className="text-blue-500" />}
//         />

//         <DashboardCard
//           title="Total Orders"
//           value={dashboard.totalOrders}
//           subtitle="Overall processed orders"
//           icon={<FaShoppingCart className="text-violet-500" />}
//         />

//         <DashboardCard
//           title="Pending Orders"
//           value={dashboard.pendingOrders}
//           subtitle="Orders awaiting action"
//           icon={<FaClock className="text-orange-500" />}
//         />

//         <DashboardCard
//           title="Completed Orders"
//           value={dashboard.completedOrders}
//           subtitle="Successful deliveries this year"
//           icon={<FaCheckCircle className="text-pink-500" />}
//         />

//         <DashboardCard
//           title="Labour Requests"
//           value={dashboard.labourRequests}
//           subtitle="Pending farm labour requests"
//           icon={<FaHandsHelping className="text-red-500" />}
//         />

//         <DashboardCard
//           title="Active Postings"
//           value={dashboard.activePostings}
//           subtitle="Current crop listings"
//           icon={<FaBullhorn className="text-yellow-500" />}
//         />

//         <DashboardCard
//           title="Total Categories"
//           value={dashboard.totalCategories}
//           subtitle="Product categories available"
//           icon={<FaTags className="text-sky-500" />}
//         />
//       </div>

//       {/* ===== CHART SECTION ===== */}
//       <div className="flex w-full lg:flex-row gap-x-2 gap-y-3 flex-col">
//         <div className="lg:w-[55vw] w-full">
//           <BarChartBox />
//         </div>

//         <div className="flex-col lg:w-[30vw] gap-y-3 flex">
//           <LineChartBox data={dashboard?.orderTrends?dashboard.orderTrends : []} year={dashboard?.year}/>
//           <PieChartBox data={dashboard?.postingCategoryDistribution?dashboard.postingCategoryDistribution:[]} />
//         </div>
//       </div>
//     </div>
//   );
// }













"use client";

import { MdOutlineEmojiTransportation } from "react-icons/md";
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

import DashboardCard from "../_components/dashboard/DashboardCard";
import BarChartBox from "../_components/dashboard/BarChartBox";
import LineChartBox from "../_components/dashboard/LineChartBox";
import PieChartBox from "../_components/dashboard/PieChartBox";

import axios from "axios";
import { CircularProgress } from "@mui/material";

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH DASHBOARD ================= */

  const fetchDashboard = async () => {
    try {
      // 1️⃣ Fetch existing dashboard data
      const dashboardRes = await axios.get("/api/dashboard");
      const dashboardData = dashboardRes.data.data;

      // 2️⃣ Fetch transporters
      const transportRes = await axios.get("https://kisan.etpl.ai/transport/all");

      const transporters = Array.isArray(transportRes.data)
        ? transportRes.data
        : transportRes.data.data || [];

      // 3️⃣ Calculate counts
      const totalTransports = transporters.length;
      const activeTransports = transporters.filter(
        (t: any) => t.isActive === true
      ).length;

      // 4️⃣ Merge everything
      setDashboard({
        ...dashboardData,
        totalTransports,
        activeTransports,
        transportData: transporters.slice(0, 5), // recent 5
      });

    } catch (err) {
      console.error("Dashboard error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  /* ================= LOADING ================= */

  if (loading)
    return (
      <div className="min-h-screen absolute w-full top-0 left-0 bg-[#fdfbfb73] z-[100] flex items-center justify-center">
        <CircularProgress />
      </div>
    );

  /* ================= UI ================= */

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
          title="Total Transports"
          value={dashboard.totalTransports || 0}
          subtitle="Registered transport providers"
          icon={<MdOutlineEmojiTransportation className="text-red-500" />}
        />

        <DashboardCard
          title="Active Transports"
          value={dashboard.activeTransports || 0}
          subtitle="Currently active transport vehicles"
          icon={<MdOutlineEmojiTransportation className="text-green-500" />}
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
       {/* ===== CHART SECTION ===== */}
      <div className="flex w-full lg:flex-row gap-x-2 gap-y-3 flex-col">
        <div className="lg:w-[55vw] w-full">
          <BarChartBox data={dashboard?.monthlyCropPostings?dashboard?.monthlyCropPostings:[]}  year={dashboard?.year}/>
        </div>

        <div className="flex-col lg:w-[30vw] gap-y-3 flex">
          <LineChartBox data={dashboard?.orderTrends?dashboard.orderTrends : []} year={dashboard?.year}/>
          <PieChartBox data={dashboard?.categoryDistribution?dashboard.categoryDistribution:[]} />
        </div>
      </div>

      {/* ===== TRANSPORT DETAILS ===== */}
      {/* {dashboard.transportData && dashboard.transportData.length > 0 && (
        <div className="mt-6 bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <MdOutlineEmojiTransportation className="mr-2 text-red-500" />
            Recent Transport Providers
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicles</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trips</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {dashboard.transportData.map((transport: any, index: number) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{transport.personalInfo?.name}</td>
                    <td className="px-4 py-3">{transport.personalInfo?.mobileNo}</td>
                    <td className="px-4 py-3 truncate max-w-[200px]">{transport.personalInfo?.address}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {transport.vehicleCount} vehicles
                      </span>
                    </td>
                    <td className="px-4 py-3">{transport.totalTrips}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          transport.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {transport.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={() => (window.location.href = "/transporters")}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View All Transports →
            </button>
          </div>
        </div>
      )} */}
    </div>
  );
}
