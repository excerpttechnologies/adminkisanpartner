// import React, { useState } from "react";
// import axios from "axios";

// const QuantityType: React.FC = () => {
//   const [packageType, setPackageType] = useState("");
//   const [measurements, setMeasurements] = useState<string[]>([""]);
//   const [loading, setLoading] = useState(false);

//   const addMeasurement = () => {
//     setMeasurements([...measurements, ""]);
//   };

//   const updateMeasurement = (index: number, value: string) => {
//     const updated = [...measurements];
//     updated[index] = value;
//     setMeasurements(updated);
//   };

//   const removeMeasurement = (index: number) => {
//     setMeasurements(measurements.filter((_, i) => i !== index));
//   };

//   const submitHandler = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       await axios.post("http://localhost:8080/api/packaging/save", {
//         packageType,
//         measurements: measurements.filter(Boolean),
//       });

//       alert("Packaging saved");
//       setPackageType("");
//       setMeasurements([""]);
//     } catch (err: any) {
//       alert(err.response?.data?.message || "Error");
//     }
//   };

//   return (
//     <form onSubmit={submitHandler} style={{ maxWidth: 450 }}>
//       <h3>Packaging Setup</h3>

//       {/* PACKAGE TYPE INPUT */}
//       <input
//         type="text"
//         placeholder="Package Type (Eg: KG, BOX, SACK)"
//         value={packageType}
//         onChange={(e) => setPackageType(e.target.value)}
//         required
//       />

//       <h4>Measurements</h4>

//       {measurements.map((m, index) => (
//         <div key={index} style={{ display: "flex", gap: 8 }}>
//           <input
//             placeholder="Eg: 10 KG / Medium / 25 KG Bag"
//             value={m}
//             onChange={(e) => updateMeasurement(index, e.target.value)}
//             required
//           />

//           {measurements.length > 1 && (
//             <button type="button" onClick={() => removeMeasurement(index)}>
//               ❌
//             </button>
//           )}
//         </div>
//       ))}

//       <button type="button" onClick={addMeasurement}>
//         ➕ Add Measurement
//       </button>

//       <br />
//       <br />

//       <button type="submit">Save</button>
//     </form>
//   );
// };

// export default QuantityType;














// //CONVERTED INTO NEXTJS

// "use client";

// import React, { useState } from "react";
// import axios from "axios";

// const QuantityType: React.FC = () => {
//   const [packageType, setPackageType] = useState("");
//   const [measurements, setMeasurements] = useState<string[]>([""]);
//   const [loading, setLoading] = useState(false);

//   const addMeasurement = () => {
//     setMeasurements([...measurements, ""]);
//   };

//   const updateMeasurement = (index: number, value: string) => {
//     const updated = [...measurements];
//     updated[index] = value;
//     setMeasurements(updated);
//   };

//   const removeMeasurement = (index: number) => {
//     setMeasurements(measurements.filter((_, i) => i !== index));
//   };

//   const submitHandler = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       await axios.post("http://localhost:8080/api/packaging/save", {
//         packageType,
//         measurements: measurements.filter(Boolean),
//       });

//       alert("Packaging saved");
//       setPackageType("");
//       setMeasurements([""]);
//     } catch (err: any) {
//       alert(err.response?.data?.message || "Error");
//     }
//   };

//   return (
//     <form onSubmit={submitHandler} style={{ maxWidth: 450 }}>
//       <h3>Packaging Setup</h3>

//       {/* PACKAGE TYPE INPUT */}
//       <input
//         type="text"
//         placeholder="Package Type (Eg: KG, BOX, SACK)"
//         value={packageType}
//         onChange={(e) => setPackageType(e.target.value)}
//         required
//       />

//       <h4>Measurements</h4>

//       {measurements.map((m, index) => (
//         <div key={index} style={{ display: "flex", gap: 8 }}>
//           <input
//             placeholder="Eg: 10 KG / Medium / 25 KG Bag"
//             value={m}
//             onChange={(e) => updateMeasurement(index, e.target.value)}
//             required
//           />

//           {measurements.length > 1 && (
//             <button type="button" onClick={() => removeMeasurement(index)}>
//               ❌
//             </button>
//           )}
//         </div>
//       ))}

//       <button type="button" onClick={addMeasurement}>
//         ➕ Add Measurement
//       </button>

//       <br />
//       <br />

//       <button type="submit">Save</button>
//     </form>
//   );
// };

// export default QuantityType;











//CONVERTED INTO NEXTJS

"use client";

import React, { useState } from "react";
import axios from "axios";

const QuantityType: React.FC = () => {
  const [packageType, setPackageType] = useState("");
  const [measurements, setMeasurements] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false);

  const addMeasurement = () => {
    setMeasurements([...measurements, ""]);
  };

  const updateMeasurement = (index: number, value: string) => {
    const updated = [...measurements];
    updated[index] = value;
    setMeasurements(updated);
  };

  const removeMeasurement = (index: number) => {
    setMeasurements(measurements.filter((_, i) => i !== index));
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post("https://kisan.etpl.ai/api/packaging/save", {
        packageType,
        measurements: measurements.filter(Boolean),
      });

      alert("Packaging saved");
      setPackageType("");
      setMeasurements([""]);
    } catch (err: any) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-6">
            <h3 className="text-2xl font-bold text-white">Packaging Setup</h3>
            <p className="text-emerald-100 text-sm mt-1">Define packaging types and their measurements</p>
          </div>

          <form onSubmit={submitHandler} className="p-8 space-y-8">
            {/* Package Type Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Package Type *
              </label>
              <input
                type="text"
                className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white text-gray-800 placeholder-gray-500"
                placeholder="Enter package type (Eg: KG, BOX, SACK, BAG)"
                value={packageType}
                onChange={(e) => setPackageType(e.target.value)}
                required
              />
              <p className="text-xs text-gray-500 mt-2 ml-1">
                This is the main packaging category
              </p>
            </div>

            {/* Measurements Section */}
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-700">
                  Measurements *
                </label>
                <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                  {measurements.length} measurement(s)
                </span>
              </div>

              <div className="space-y-4">
                {measurements.map((m, index) => (
                  <div key={index} className="flex items-center gap-3 group">
                    <div className="flex-1">
                      <div className="relative">
                        <input
                          className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white text-gray-800 placeholder-gray-500"
                          placeholder="Eg: 10 KG / Medium / 25 KG Bag"
                          value={m}
                          onChange={(e) => updateMeasurement(index, e.target.value)}
                          required
                        />
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                          <div className="flex items-center justify-center w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full">
                            <span className="text-xs font-semibold">
                              {index + 1}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {measurements.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMeasurement(index)}
                        className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg transition-colors duration-200 group-hover:opacity-100 opacity-70"
                        title="Remove measurement"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Measurement Button */}
              <button
                type="button"
                onClick={addMeasurement}
                className="w-full py-3.5 border-2 border-dashed border-gray-300 hover:border-emerald-400 hover:bg-emerald-50 rounded-lg transition-all duration-200 group"
              >
                <div className="flex items-center justify-center gap-2">
                  <div className="w-8 h-8 flex items-center justify-center bg-emerald-100 text-emerald-600 rounded-full group-hover:bg-emerald-200 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <span className="text-emerald-700 font-medium group-hover:text-emerald-800">
                    Add Measurement
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Add another measurement variant for this package type
                </p>
              </button>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save Packaging
              </button>
            </div>
          </form>
        </div>

        {/* Info Card */}
        <div className="mt-8 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="ml-4">
              <h4 className="text-sm font-semibold text-emerald-900">How Packaging Setup Works</h4>
              <p className="mt-1 text-sm text-emerald-800">
                Define a package type (like &quot;KG&quot; or &quot;BOX&quot;) and add multiple measurements for that type.
                Each measurement represents a different size/variant of the same packaging type.
                Example: For &quot;BAG&quot; type, you could add measurements like &quot;5 KG Bag&quot;, &quot;10 KG Bag&quot;, &quot;25 KG Bag&quot;.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuantityType;