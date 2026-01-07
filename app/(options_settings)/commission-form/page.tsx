// import React, { useState, useEffect } from "react";
// import axios from "axios";

// interface Commission {
//   _id: string;
//   role: string;
//   commissionPercentage: number;
// }

// const CommissionForm: React.FC = () => {
//   const [role, setRole] = useState("");
//   const [commission, setCommission] = useState<number | "">("");
//   const [list, setList] = useState<Commission[]>([]);
//   const [loading, setLoading] = useState(false);

//   const fetchCommissions = async () => {
//     const res = await axios.get("http://localhost:8080/api/commission/all");
//     setList(res.data);
//   };

//   useEffect(() => {
//     fetchCommissions();
//   }, []);

//   const submitHandler = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       await axios.post("http://localhost:8080/api/commission/save", {
//         role,
//         commissionPercentage: commission,
//       });

//       alert("Commission saved successfully");
//       setRole("");
//       setCommission("");
//       fetchCommissions();
//     } catch (err: any) {
//       alert(err.response?.data?.message || "Error saving commission");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ maxWidth: 450 }}>
//       <h2>Add Commission</h2>

//       <form onSubmit={submitHandler}>
//         {/* ROLE INPUT */}
//         <input
//           type="text"
//           placeholder="Role (Eg: FARMER, TRADER)"
//           value={role}
//           onChange={(e) => setRole(e.target.value)}
//           required
//         />

//         {/* COMMISSION INPUT */}
//         <input
//           type="number"
//           placeholder="Commission %"
//           value={commission}
//           min={0}
//           max={100}
//           onChange={(e) => setCommission(Number(e.target.value))}
//           required
//         />

//         <button type="submit" disabled={loading}>
//           {loading ? "Saving..." : "Save"}
//         </button>
//       </form>

//       {/* LIST */}
//       <h3 style={{ marginTop: 20 }}>Existing Commissions</h3>

//       <ul>
//         {list.map((item) => (
//           <li key={item._id}>
//             <strong>{item.role}</strong> – {item.commissionPercentage}%
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default CommissionForm;
















// //CONVERTED INTO  NEXT.JS


// 'use client';

// import { useState, useEffect } from "react";
// import axios from "axios";

// interface Commission {
//   _id: string;
//   role: string;
//   commissionPercentage: number;
// }

// const CommissionForm = () => {
//   const [role, setRole] = useState("");
//   const [commission, setCommission] = useState<number | "">("");
//   const [list, setList] = useState<Commission[]>([]);
//   const [loading, setLoading] = useState(false);

//   const fetchCommissions = async () => {
//     const res = await axios.get("http://localhost:8080/api/commission/all");
//     setList(res.data);
//   };

//   useEffect(() => {
//     fetchCommissions();
//   }, []);

//   const submitHandler = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       await axios.post("http://localhost:8080/api/commission/save", {
//         role,
//         commissionPercentage: commission,
//       });

//       alert("Commission saved successfully");
//       setRole("");
//       setCommission("");
//       fetchCommissions();
//     } catch (err: any) {
//       alert(err.response?.data?.message || "Error saving commission");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ maxWidth: 450 }}>
//       <h2>Add Commission</h2>

//       <form onSubmit={submitHandler}>
//         {/* ROLE INPUT */}
//         <input
//           type="text"
//           placeholder="Role (Eg: FARMER, TRADER)"
//           value={role}
//           onChange={(e) => setRole(e.target.value)}
//           required
//         />

//         {/* COMMISSION INPUT */}
//         <input
//           type="number"
//           placeholder="Commission %"
//           value={commission}
//           min={0}
//           max={100}
//           onChange={(e) => setCommission(Number(e.target.value))}
//           required
//         />

//         <button type="submit" disabled={loading}>
//           {loading ? "Saving..." : "Save"}
//         </button>
//       </form>

//       {/* LIST */}
//       <h3 style={{ marginTop: 20 }}>Existing Commissions</h3>

//       <ul>
//         {list.map((item) => (
//           <li key={item._id}>
//             <strong>{item.role}</strong> – {item.commissionPercentage}%
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default CommissionForm;





//CONVERTED INTO NEXT.JS

'use client';

import { useState, useEffect } from "react";
import axios from "axios";

interface Commission {
  _id: string;
  role: string;
  commissionPercentage: number;
}

const CommissionForm = () => {
  const [role, setRole] = useState("");
  const [commission, setCommission] = useState<number | "">("");
  const [list, setList] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCommissions = async () => {
    const res = await axios.get("https://kisan.etpl.ai/api/commission/all");
    setList(res.data);
  };

  useEffect(() => {
    fetchCommissions();
  }, []);

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("https://kisan.etpl.ai/api/commission/save", {
        role,
        commissionPercentage: commission,
      });

      alert("Commission saved successfully");
      setRole("");
      setCommission("");
      fetchCommissions();
    } catch (err: any) {
      alert(err.response?.data?.message || "Error saving commission");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Add Commission Form */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            <div className="bg-gradient-to-r from-green-600 to-green-700  px-6 py-5">
              <h2 className="text-2xl font-bold text-white">Add Commission</h2>
              <p className="text-blue-100 text-sm mt-1">Define commission percentages for different roles</p>
            </div>

            <form onSubmit={submitHandler} className="p-6 space-y-6">
              {/* Role Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Role *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white text-gray-800 placeholder-gray-500"
                  placeholder="Enter role (Eg: FARMER, TRADER)"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                />
                <p className="text-xs text-gray-500 mt-2">Use uppercase for consistency (e.g., FARMER, TRADER)</p>
              </div>

              {/* Commission Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Commission Percentage *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white text-gray-800 placeholder-gray-500 pr-12"
                    placeholder="Enter percentage (0-100)"
                    value={commission}
                    min={0}
                    max={100}
                    onChange={(e) => setCommission(Number(e.target.value))}
                    required
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                    %
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Must be between 0 and 100</p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3.5 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:hover:translate-y-0 disabled:hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving...
                  </div>
                ) : (
                  "Save Commission"
                )}
              </button>
            </form>
          </div>

          {/* Right Column - Existing Commissions */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white">Existing Commissions</h3>
                  <p className="text-emerald-100 text-sm mt-1">Current commission structure</p>
                </div>
                <span className="bg-white/20 text-white text-sm font-semibold px-3 py-1 rounded-full">
                  {list.length} Roles
                </span>
              </div>
            </div>

            <div className="p-6">
              {list.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-lg">No commissions added yet</p>
                  <p className="text-gray-400 text-sm mt-2">Add your first commission using the form</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {list.map((item) => (
                    <div
                      key={item._id}
                      className="group bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-xl p-5 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 group-hover:bg-blue-200 transition-colors">
                            {item.role}
                          </span>
                          <div className="mt-3">
                            <span className="text-3xl font-bold text-gray-800 group-hover:text-blue-700">
                              {item.commissionPercentage}%
                            </span>
                            <span className="text-sm text-gray-500 ml-2">commission rate</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 group-hover:from-blue-100 group-hover:to-indigo-100 flex items-center justify-center transition-all">
                            <span className="text-2xl font-bold text-emerald-700 group-hover:text-blue-700">
                              {item.commissionPercentage}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Stats Footer */}
            <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
              <div className="flex items-center justify-between text-sm">
                <div className="text-gray-600">
                  <span className="font-medium">Total Roles:</span> {list.length}
                </div>
                <div className="text-gray-600">
                  <span className="font-medium">Avg Commission:</span>{" "}
                  {list.length > 0
                    ? (list.reduce((acc, item) => acc + item.commissionPercentage, 0) / list.length).toFixed(1)
                    : "0"}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Information Card */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h4 className="text-sm font-semibold text-blue-900">About Commission Settings</h4>
              <p className="mt-1 text-sm text-blue-800">
                Commission percentages define how much each role earns from transactions.
                These settings apply system-wide and affect all users with the specified roles.
                Changes are saved immediately and reflected across the platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommissionForm;