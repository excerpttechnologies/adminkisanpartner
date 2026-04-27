





"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Pagination } from "@mui/material";
import {
  FaUsers, FaSeedling, FaStore, FaArrowLeft, FaPlus,
  FaTrash, FaSearch, FaRedo, FaToggleOn, FaToggleOff,
  FaUser, FaPhone, FaMapMarkerAlt, FaLeaf, FaLock,
} from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

/* ───────── Types ───────── */
interface Mandi {
  _id: string;
  mandiId: string;
  mandiName: string;
  state: string;
  district: string;
  taluka: string;
  address: string;
  pincode: string;
  isActive: boolean;
  allowPostingView: boolean;
  allowMobileView: boolean;
  subAdmins: SubAdmin[]; // always normalised to [] in setMandi
}

interface SubAdmin {
  _id: string;
  name: string;
  email: string;
  role: string;
  state?: string;
  district?: string;
  taluka?: string;
  isDeleted?: boolean;
}

interface Posting {
  _id: string;
  farmingType: string;
  seedType: string;
  acres: number;
  sowingDate: string;
  farmerId: string;
  createdAt: string;
  farmer?: {
    name: string;
    mobileNo: string;
    village: string;
    district: string;
    state: string;
    taluk: string;
  };
}

interface AllSubAdmin {
  _id: string;
  name: string;
  email: string;
  district?: string;
}

/* ── Badge colours ── */
const FARMING_COLORS: Record<string, string> = {
  organic:    "bg-green-100 text-green-700",
  regular:    "bg-blue-100 text-blue-700",
  natural:    "bg-yellow-100 text-yellow-700",
  hydroponic: "bg-purple-100 text-purple-700",
};
const SEED_COLORS: Record<string, string> = {
  hybrid:   "bg-orange-100 text-orange-700",
  naati:    "bg-teal-100 text-teal-700",
  heirloom: "bg-pink-100 text-pink-700",
  gmo:      "bg-red-100 text-red-700",
};

/* ───────── Component ───────── */
export default function MandiDetailPage() {
  const params  = useParams();
  const router  = useRouter();
  const mandiId = params?.id as string;

  const [mandi, setMandi]           = useState<Mandi | null>(null);
  const [mandiLoading, setMandiLoading] = useState(true);
  const [sessionRole, setSessionRole]   = useState<string>("");

  /* subadmin tab */
  const [assignOpen, setAssignOpen]   = useState(false);
  const [allSubAdmins, setAllSubAdmins] = useState<AllSubAdmin[]>([]);
  const [saSearch, setSaSearch]       = useState("");
  const [removeId, setRemoveId]       = useState<string | null>(null);
  const [removeOpen, setRemoveOpen]   = useState(false);

  /* postings tab */
  const [postings, setPostings]               = useState<Posting[]>([]);
  const [postingsLoading, setPostingsLoading] = useState(false);
  const [postingSearch, setPostingSearch]     = useState("");
  const [postingPage, setPostingPage]         = useState(1);
  const [postingTotalPages, setPostingTotalPages] = useState(1);
  const [postingTotal, setPostingTotal]       = useState<number | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const [activeTab, setActiveTab] = useState<"subadmins" | "postings">("subadmins");

  /* derived */
  const isAdmin = sessionRole === "admin";

  /* ── Fetch session ── */
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("/api/admin/session");
        setSessionRole(res.data.data?.role || "");
      } catch {}
    })();
  }, []);

  /* ── Fetch mandi ── */
  const fetchMandi = useCallback(async () => {
    setMandiLoading(true);
    try {
      const res = await axios.get(`/api/mandi/${mandiId}`);
      if (res.data.success) {
        const raw = res.data.data;
        // Always normalise subAdmins to an array
        setMandi({ ...raw, subAdmins: Array.isArray(raw.subAdmins) ? raw.subAdmins : [] });
      } else {
        toast.error("Mandi not found");
      }
    } catch {
      toast.error("Failed to load mandi");
    } finally {
      setMandiLoading(false);
    }
  }, [mandiId]);

  useEffect(() => { fetchMandi(); }, [fetchMandi]);

  /* ── Fetch postings ── */
  const fetchPostings = useCallback(async (page = 1, q = "") => {
    setPostingsLoading(true);
    setPermissionDenied(false);
    try {
      const res = await axios.get(`/api/mandi/${mandiId}/postings`, {
        params: { page, limit: 10, search: q },
      });
      if (res.data.success) {
        setPostings(res.data.data || []);
        setPostingTotalPages(res.data.totalPages || 1);
        setPostingTotal(typeof res.data.total === "number" ? res.data.total : null);
      }
    } catch (err: any) {
      const data = err.response?.data;
      if (data?.permissionDenied || err.response?.status === 403) {
        setPermissionDenied(true);
      } else {
        toast.error(data?.message || "Failed to load postings");
      }
    } finally {
      setPostingsLoading(false);
    }
  }, [mandiId]);

  /* Re-fetch postings when tab switches or page changes */
  const prevTabRef = useRef(activeTab);
  useEffect(() => {
    if (activeTab === "postings") {
      if (prevTabRef.current !== "postings") {
        setPostingPage(1);
        fetchPostings(1, postingSearch);
      } else {
        fetchPostings(postingPage, postingSearch);
      }
    }
    prevTabRef.current = activeTab;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, postingPage]);

  /* ── Fetch all subadmins for assign modal ── */
  const fetchAllSubAdmins = async () => {
    try {
      const res = await axios.get("/api/admin", { params: { limit: 1000 } });
      if (res.data.success) {
        const arr: AllSubAdmin[] = Array.isArray(res.data.data)
          ? res.data.data
          : [res.data.data];
        const assignedIds = new Set((mandi?.subAdmins || []).map((s) => s._id));
        setAllSubAdmins(arr.filter((s) => !assignedIds.has(s._id)));
      }
    } catch {
      toast.error("Failed to load subadmins");
    }
  };

  /* ── Assign subadmin ── */
  const handleAssign = async (subAdminId: string) => {
    try {
      await axios.post(`/api/mandi/${mandiId}/subadmins`, { subAdminId });
      toast.success("Subadmin assigned");
      setAssignOpen(false);
      fetchMandi();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to assign");
    }
  };

  /* ── Remove subadmin ── */
  const handleRemove = async () => {
    if (!removeId) return;
    try {
      await axios.post(`/api/mandi/${mandiId}/subadmins`, { removeId });
      toast.success("Subadmin removed");
      setRemoveOpen(false);
      setRemoveId(null);
      fetchMandi();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to remove");
    }
  };

  /* ── Toggle posting permission ── */
  const togglePermission = async () => {
    if (!mandi) return;
    try {
      await axios.put(`/api/mandi/${mandiId}`, {
        allowPostingView: !mandi.allowPostingView,
      });
      toast.success(!mandi.allowPostingView ? "Posting view enabled" : "Posting view disabled");
      fetchMandi();
    } catch {
      toast.error("Failed to update permission");
    }
  };

  /* ── Toggle mobile permission ── */
  const toggleMobilePermission = async () => {
    if (!mandi) return;
    try {
      await axios.put(`/api/mandi/${mandiId}`, {
        allowMobileView: !mandi.allowMobileView,
      });
      toast.success(
        !mandi.allowMobileView
          ? "Farmer mobile numbers now visible to subadmins"
          : "Farmer mobile numbers now hidden from subadmins"
      );
      fetchMandi();
    } catch {
      toast.error("Failed to update mobile permission");
    }
  };

  /* Filtered subadmins for assign modal */
  const filteredSa = allSubAdmins.filter(
    (s) =>
      s.name.toLowerCase().includes(saSearch.toLowerCase()) ||
      s.email.toLowerCase().includes(saSearch.toLowerCase())
  );

  /* ─── Loading / not-found states ─── */
  if (mandiLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!mandi) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-gray-500">Mandi not found.</p>
        <Link href="/mandi" className="text-green-600 underline text-sm">← Back to Mandis</Link>
      </div>
    );
  }

  /* ───────────────────── RENDER ───────────────────── */
  return (
    <div className="p-4 min-h-screen bg-gray-50">

      {/* Back + Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition"
        >
          <FaArrowLeft />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaStore className="text-green-600" />
            {mandi.mandiName}
          </h1>
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
            <MdLocationOn className="text-green-500" />
            {mandi.district}, {mandi.state}
            {mandi.taluka && <span className="text-gray-400">· {mandi.taluka}</span>}
            <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{mandi.mandiId}</span>
          </div>
        </div>
        <div className="ml-auto">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            mandi.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
          }`}>
            {mandi.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      {/* ── Permission banners — admin only ── */}
      {isAdmin && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">

          {/* Posting visibility toggle */}
          <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <FaSeedling className="text-green-500" />
                Crop Posting Visibility
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {mandi.allowPostingView
                  ? "Subadmins can view crop postings."
                  : "Crop postings are hidden from subadmins."}
              </p>
            </div>
            <button
              onClick={togglePermission}
              className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                mandi.allowPostingView
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              }`}
            >
              {mandi.allowPostingView
                ? <><FaToggleOn className="text-lg" /> Enabled</>
                : <><FaToggleOff className="text-lg" /> Disabled</>}
            </button>
          </div>

          {/* Mobile number visibility toggle */}
          <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <FaPhone className="text-blue-500" />
                Farmer Mobile Number
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {mandi.allowMobileView
                  ? "Subadmins can see farmer mobile numbers."
                  : "Mobile numbers are hidden (shown as ••••••••••)."}
              </p>
            </div>
            <button
              onClick={toggleMobilePermission}
              className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                mandi.allowMobileView
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              }`}
            >
              {mandi.allowMobileView
                ? <><FaToggleOn className="text-lg" /> Visible</>
                : <><FaToggleOff className="text-lg" /> Hidden</>}
            </button>
          </div>

        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-lg shadow p-1 mb-5 w-fit">
        {(["subadmins", "postings"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${
              activeTab === tab
                ? "bg-green-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {tab === "subadmins" ? <FaUsers /> : <FaSeedling />}
            {tab === "subadmins"
              ? `Sub Admins (${(mandi.subAdmins || []).length})`
              : "Crop Postings"}
          </button>
        ))}
      </div>

      {/* ══════════════ SUB ADMINS TAB ══════════════ */}
      {activeTab === "subadmins" && (
        <div className="bg-white rounded-lg shadow">
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <h2 className="font-semibold text-gray-700">Assigned Sub Admins</h2>
            {/* Assign button — admin only */}
            {isAdmin && (
              <button
                onClick={() => { fetchAllSubAdmins(); setAssignOpen(true); }}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm transition"
              >
                <FaPlus /> Assign Subadmin
              </button>
            )}
          </div>

          {(mandi.subAdmins || []).length === 0 ? (
            <div className="text-center py-14 text-gray-400">
              <FaUsers className="mx-auto text-4xl mb-3 opacity-30" />
              <p>No subadmins assigned yet.</p>
              {isAdmin && (
                <p className="text-xs mt-1">Click "Assign Subadmin" to add one.</p>
              )}
            </div>
          ) : (
            <div className="divide-y">
              {(mandi.subAdmins || []).map((sa) => (
                <div
                  key={sa._id}
                  className="flex items-center justify-between px-5 py-4 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <FaUser className="text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{sa.name}</p>
                      <p className="text-xs text-gray-500">{sa.email}</p>
                      {(sa.state || sa.district) && (
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          <MdLocationOn className="text-green-400" />
                          {[sa.district, sa.state].filter(Boolean).join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Remove button — admin only */}
                  {isAdmin && (
                    <button
                      onClick={() => { setRemoveId(sa._id); setRemoveOpen(true); }}
                      className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition"
                      title="Remove from mandi"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══════════════ POSTINGS TAB ══════════════ */}
      {activeTab === "postings" && (
        <div>
          {permissionDenied ? (
            /* Permission denied screen */
            <div className="bg-white rounded-lg shadow flex flex-col items-center justify-center py-20 text-center px-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <FaLock className="text-red-500 text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Posting View Not Permitted</h3>
              <p className="text-sm text-gray-500 max-w-sm">
                Your admin has not granted permission to view crop postings for this mandi.
                Please contact your administrator.
              </p>
            </div>
          ) : (
            <>
              {/* Search bar */}
              <div className="bg-white rounded-lg shadow p-4 mb-4 flex flex-wrap gap-2 items-center">
                <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 flex-1 min-w-[200px]">
                  <FaSearch className="text-gray-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search by crop type, farmer ID..."
                    value={postingSearch}
                    onChange={(e) => setPostingSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && fetchPostings(1, postingSearch)}
                    className="outline-none text-sm w-full"
                  />
                </div>
                <button
                  onClick={() => { setPostingPage(1); fetchPostings(1, postingSearch); }}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Search
                </button>
                <button
                  onClick={() => { setPostingSearch(""); setPostingPage(1); fetchPostings(1, ""); }}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm flex items-center gap-1"
                >
                  <FaRedo /> Reset
                </button>
                {/* Total count — admin only, never shown to subadmin */}
                {isAdmin && postingTotal !== null && (
                  <span className="ml-auto text-sm text-gray-500">
                    Total: <strong>{postingTotal}</strong> postings
                  </span>
                )}
              </div>

              {/* Postings table */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-green-50 border-b border-green-100">
                      <tr>
                        <th className="text-left px-4 py-3 font-semibold text-gray-700">#</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-700">Farmer</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-700">Mobile</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-700">Village / Taluk</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-700">Farming Type</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-700">Seed Type</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-700">Acres</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-700">Sowing Date</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-700">Posted On</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {postingsLoading ? (
                        <tr>
                          <td colSpan={9} className="text-center py-12 text-gray-400">
                            <div className="animate-spin inline-block w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full mb-2" />
                            <p>Loading postings...</p>
                          </td>
                        </tr>
                      ) : postings.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="text-center py-14 text-gray-400">
                            <FaLeaf className="mx-auto text-4xl mb-3 opacity-30" />
                            <p>No crop postings found for this mandi&apos;s district.</p>
                          </td>
                        </tr>
                      ) : (
                        postings.map((posting, idx) => (
                          <tr key={posting._id} className="hover:bg-gray-50 transition">
                            <td className="px-4 py-3 text-gray-500">
                              {(postingPage - 1) * 10 + idx + 1}
                            </td>
                            {/* Farmer name + ID */}
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                                  <FaUser className="text-green-600 text-xs" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-800 text-xs">
                                    {posting.farmer?.name || "—"}
                                  </p>
                                  <p className="text-gray-400 text-xs font-mono">{posting.farmerId}</p>
                                </div>
                              </div>
                            </td>
                            {/* Mobile — masked or real depending on permission */}
                            <td className="px-4 py-3">
                              <span className="flex items-center gap-1 text-xs">
                                <FaPhone
                                  className={
                                    posting.farmer?.mobileNo === "••••••••••"
                                      ? "text-gray-300"
                                      : "text-gray-400"
                                  }
                                />
                                {posting.farmer?.mobileNo === "••••••••••" ? (
                                  <span className="text-gray-300 tracking-widest font-mono select-none">
                                    ••••••••••
                                  </span>
                                ) : (
                                  <span className="text-gray-600">
                                    {posting.farmer?.mobileNo || "—"}
                                  </span>
                                )}
                              </span>
                            </td>
                            {/* Village / Taluk */}
                            <td className="px-4 py-3 text-xs text-gray-600">
                              <span className="flex items-center gap-1">
                                <FaMapMarkerAlt className="text-green-400" />
                                {posting.farmer?.village || posting.farmer?.taluk || "—"}
                              </span>
                            </td>
                            {/* Farming type */}
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                                FARMING_COLORS[posting.farmingType] || "bg-gray-100 text-gray-600"
                              }`}>
                                {posting.farmingType}
                              </span>
                            </td>
                            {/* Seed type */}
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                                SEED_COLORS[posting.seedType] || "bg-gray-100 text-gray-600"
                              }`}>
                                {posting.seedType}
                              </span>
                            </td>
                            {/* Acres */}
                            <td className="px-4 py-3 text-gray-700 font-medium text-xs">
                              {posting.acres} acres
                            </td>
                            {/* Sowing date */}
                            <td className="px-4 py-3 text-gray-600 text-xs">
                              {posting.sowingDate
                                ? new Date(posting.sowingDate).toLocaleDateString("en-IN", {
                                    day: "2-digit", month: "short", year: "numeric",
                                  })
                                : "—"}
                            </td>
                            {/* Posted on */}
                            <td className="px-4 py-3 text-gray-500 text-xs">
                              {new Date(posting.createdAt).toLocaleDateString("en-IN", {
                                day: "2-digit", month: "short", year: "numeric",
                              })}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {postingTotalPages > 1 && (
                  <div className="flex justify-center py-4 border-t">
                    <Pagination
                      count={postingTotalPages}
                      page={postingPage}
                      onChange={(_, val) => setPostingPage(val)}
                      color="primary"
                      size="small"
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* ══════════ ASSIGN SUBADMIN MODAL — admin only ══════════ */}
      {isAdmin && assignOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h2 className="font-semibold text-gray-800">
                Assign Subadmin to {mandi.mandiName}
              </h2>
              <button onClick={() => setAssignOpen(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            <div className="px-5 py-4">
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 mb-4">
                <FaSearch className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={saSearch}
                  onChange={(e) => setSaSearch(e.target.value)}
                  className="outline-none text-sm w-full"
                />
              </div>
              <div className="max-h-72 overflow-y-auto divide-y">
                {filteredSa.length === 0 ? (
                  <p className="text-center text-gray-400 py-8 text-sm">
                    No available subadmins to assign.
                  </p>
                ) : (
                  filteredSa.map((sa) => (
                    <div
                      key={sa._id}
                      className="flex items-center justify-between py-3 hover:bg-gray-50 px-2 rounded"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-800">{sa.name}</p>
                        <p className="text-xs text-gray-500">{sa.email}</p>
                        {sa.district && (
                          <p className="text-xs text-gray-400">{sa.district}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleAssign(sa._id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-xs font-medium transition"
                      >
                        Assign
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="px-5 py-3 border-t text-right">
              <button
                onClick={() => setAssignOpen(false)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ REMOVE CONFIRM MODAL — admin only ══════════ */}
      {isAdmin && removeOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTrash className="text-red-500 text-xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Remove Subadmin</h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to remove this subadmin from{" "}
              <strong>{mandi.mandiName}</strong>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setRemoveOpen(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRemove}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-medium"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}