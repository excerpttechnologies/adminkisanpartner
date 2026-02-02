import axios from "axios";
import { getAdminSessionAction } from "../actions/auth-actions";

/**
 * Dashboard data fetcher
 * Admin    -> all data
 * Subadmin -> taluk based data
 */
export async function getDashboardData() {
  const session = await getAdminSessionAction();
  const admin = session?.admin;

  const baseParams: Record<string, any> = {
    limit: 5000,
  };

  // Apply taluk only for subadmin
  const talukFilter =
    admin?.role === "subadmin" && admin?.taluka
      ? admin.taluka
      : null;

  if (talukFilter) {
    baseParams.taluk = talukFilter;
  }

  try {
    const [
      farmersRes,
      tradersRes,
      laboursRes,
      postingsRes,
      ordersRes,
      pendingOrdersRes,
      completedOrdersRes,
      categoryRes,
      transporterRes,
    ] = await Promise.all([
      axios.get("/api/farmers", {
        params: { ...baseParams, role: "farmer" },
      }),
      axios.get("/api/farmers", {
        params: { ...baseParams, role: "trader" },
      }),
      axios.get("/api/labours", {
        params: baseParams,
      }),
      axios.get("/api/postings", {
        params: baseParams,
      }),
      axios.get("/api/order", {
        params: baseParams,
      }),
      axios.get("/api/order", {
        params: { ...baseParams, orderStatus: "pending" },
      }),
      axios.get("/api/order", {
        params: { ...baseParams, orderStatus: "completed" },
      }),
      axios.get("/api/category"),
      axios.get("https://kisan.etpl.ai/api/transporter/all"),
    ]);

    /* ================= TRANSPORT FILTERING ================= */

    const allTransporters: any[] =
      transporterRes.data?.data ?? [];

    // Taluk-wise filtering for subadmin
    const filteredTransporters = talukFilter
      ? allTransporters.filter(
          (t) =>
            t?.personalInfo?.taluk?.toLowerCase() ===
            talukFilter.toLowerCase()
        )
      : allTransporters;

    const totalTransports = filteredTransporters.length;

    const activeTransports = filteredTransporters.filter(
      (t) => t.isActive === true
    ).length;

    /* ================= RETURN ================= */

    return {
      success: true,

      // 📊 DASHBOARD STATS
      stats: {
        totalFarmers:
          farmersRes.data?.total ??
          farmersRes.data?.data?.length ??
          0,

        totalAgents:
          tradersRes.data?.total ??
          tradersRes.data?.data?.length ??
          0,

        totalLabours:
          laboursRes.data?.total ??
          laboursRes.data?.data?.length ??
          0,

        activePostings:
          postingsRes.data?.total ??
          postingsRes.data?.data?.length ??
          0,

        totalOrders:
          ordersRes.data?.total ??
          ordersRes.data?.data?.length ??
          0,

        pendingOrders:
          pendingOrdersRes.data?.total ??
          pendingOrdersRes.data?.data?.length ??
          0,

        completedOrders:
          completedOrdersRes.data?.total ??
          completedOrdersRes.data?.data?.length ??
          0,

        totalCategories:
          categoryRes.data?.category?.length ?? 0,

        // ✅ NEW
        totalTransports,
        activeTransports,
      },

      // 📦 RAW DATA
      data: {
        farmers: farmersRes.data?.data ?? [],
        traders: tradersRes.data?.data ?? [],
        labours: laboursRes.data?.data ?? [],
        postings: postingsRes.data?.data ?? [],
        orders: ordersRes.data?.data ?? [],
        pendingOrders: pendingOrdersRes.data?.data ?? [],
        completedOrders: completedOrdersRes.data?.data ?? [],
        categories: categoryRes.data?.category ?? [],
        transports: filteredTransporters,
      },

      filterApplied: talukFilter
        ? { taluk: talukFilter }
        : { taluk: "All" },
    };
  } catch (error: any) {
    console.error("Dashboard Data Error:", error);

    return {
      success: false,
      message: "Failed to load dashboard data",
    };
  }
}
