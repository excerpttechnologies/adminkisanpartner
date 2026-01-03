// import React, { useState } from "react";
// import axios from "axios";

// const AddMarket: React.FC = () => {
//   const [marketName, setMarketName] = useState("");
//   const [pincode, setPincode] = useState("");
//   const [postOffice, setPostOffice] = useState("");
//   const [district, setDistrict] = useState("");
//   const [state, setState] = useState("");
//   const [exactAddress, setExactAddress] = useState("");
//   const [landmark, setLandmark] = useState("");

//   const fetchPincodeDetails = async (pin: string) => {
//     if (pin.length !== 6) return;

//     const res = await axios.get(
//       `https://api.postalpincode.in/pincode/${pin}`
//     );

//     if (res.data[0].Status === "Success") {
//       const po = res.data[0].PostOffice[0];
//       setPostOffice(po.Name);
//       setDistrict(po.District);
//       setState(po.State);
//     } else {
//       alert("Invalid Pincode");
//     }
//   };

//   const submitHandler = async (e: React.FormEvent) => {
//     e.preventDefault();

//     await axios.post("http://localhost:8080/api/market/add-market", {
//       marketName,
//       pincode,
//       exactAddress,
//       landmark,
//     });

//     alert("Market added successfully");
//   };

//   return (
//     <form onSubmit={submitHandler}>
//       <h3>Add Market</h3>

//       <input
//         placeholder="Market Name"
//         value={marketName}
//         onChange={(e) => setMarketName(e.target.value)}
//         required
//       />

//       <input
//         placeholder="Pincode"
//         value={pincode}
//         onChange={(e) => {
//           setPincode(e.target.value);
//           fetchPincodeDetails(e.target.value);
//         }}
//         required
//       />

//       <input value={postOffice} disabled placeholder="Post Office / Area" />
//       <input value={district} disabled placeholder="District" />
//       <input value={state} disabled placeholder="State" />

//       <textarea
//         placeholder="Exact Address (Eg: Garudacharpalya, Mahadevapura)"
//         value={exactAddress}
//         onChange={(e) => setExactAddress(e.target.value)}
//         required
//       />

//       <input
//         placeholder="Landmark (Optional)"
//         value={landmark}
//         onChange={(e) => setLandmark(e.target.value)}
//       />

//       <button type="submit">Add Market</button>
//     </form>
//   );
// };

// export default AddMarket;







// //CONVERTED INTO NEXT.JS

// "use client";

// import React, { useState } from "react";
// import axios from "axios";

// const AddMarket: React.FC = () => {
//   const [marketName, setMarketName] = useState("");
//   const [pincode, setPincode] = useState("");
//   const [postOffice, setPostOffice] = useState("");
//   const [district, setDistrict] = useState("");
//   const [state, setState] = useState("");
//   const [exactAddress, setExactAddress] = useState("");
//   const [landmark, setLandmark] = useState("");

//   const fetchPincodeDetails = async (pin: string) => {
//     if (pin.length !== 6) return;

//     const res = await axios.get(
//       `https://api.postalpincode.in/pincode/${pin}`
//     );

//     if (res.data[0].Status === "Success") {
//       const po = res.data[0].PostOffice[0];
//       setPostOffice(po.Name);
//       setDistrict(po.District);
//       setState(po.State);
//     } else {
//       alert("Invalid Pincode");
//     }
//   };

//   const submitHandler = async (e: React.FormEvent) => {
//     e.preventDefault();

//     await axios.post("http://localhost:8080/api/market/add-market", {
//       marketName,
//       pincode,
//       exactAddress,
//       landmark,
//     });

//     alert("Market added successfully");
//   };

//   return (
//     <form onSubmit={submitHandler}>
//       <h3>Add Market</h3>

//       <input
//         placeholder="Market Name"
//         value={marketName}
//         onChange={(e) => setMarketName(e.target.value)}
//         required
//       />

//       <input
//         placeholder="Pincode"
//         value={pincode}
//         onChange={(e) => {
//           setPincode(e.target.value);
//           fetchPincodeDetails(e.target.value);
//         }}
//         required
//       />

//       <input value={postOffice} disabled placeholder="Post Office / Area" />
//       <input value={district} disabled placeholder="District" />
//       <input value={state} disabled placeholder="State" />

//       <textarea
//         placeholder="Exact Address (Eg: Garudacharpalya, Mahadevapura)"
//         value={exactAddress}
//         onChange={(e) => setExactAddress(e.target.value)}
//         required
//       />

//       <input
//         placeholder="Landmark (Optional)"
//         value={landmark}
//         onChange={(e) => setLandmark(e.target.value)}
//       />

//       <button type="submit">Add Market</button>
//     </form>
//   );
// };

// export default AddMarket;












//CONVERTED INTO NEXT.JS

"use client";

import React, { useState } from "react";
import axios from "axios";

const AddMarket: React.FC = () => {
  const [marketName, setMarketName] = useState("");
  const [pincode, setPincode] = useState("");
  const [postOffice, setPostOffice] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [exactAddress, setExactAddress] = useState("");
  const [landmark, setLandmark] = useState("");

  const fetchPincodeDetails = async (pin: string) => {
    if (pin.length !== 6) return;

    const res = await axios.get(
      `https://api.postalpincode.in/pincode/${pin}`
    );

    if (res.data[0].Status === "Success") {
      const po = res.data[0].PostOffice[0];
      setPostOffice(po.Name);
      setDistrict(po.District);
      setState(po.State);
    } else {
      alert("Invalid Pincode");
    }
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    await axios.post("https://kisan.etpl.ai/api/market/add-market", {
      marketName,
      pincode,
      exactAddress,
      landmark,
    });

    alert("Market added successfully");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-6">
            <h3 className="text-3xl font-bold text-white tracking-tight">
              Add New Market
            </h3>
            <p className="text-blue-100 mt-2 text-sm">
              Fill in the market details below
            </p>
          </div>

          {/* Form */}
          <form onSubmit={submitHandler} className="px-8 py-8 space-y-6">
            {/* Market Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Market Name *
              </label>
              <input
                className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white text-gray-800 placeholder-gray-500"
                placeholder="Enter market name"
                value={marketName}
                onChange={(e) => setMarketName(e.target.value)}
                required
              />
            </div>

            {/* Pincode Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Pincode *
                </label>
                <input
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white text-gray-800 placeholder-gray-500"
                  placeholder="Enter 6-digit pincode"
                  value={pincode}
                  onChange={(e) => {
                    setPincode(e.target.value);
                    fetchPincodeDetails(e.target.value);
                  }}
                  required
                />
              </div>

              {/* Auto-filled Address Details */}
              <div className="space-y-6 md:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Post Office / Area
                    </label>
                    <input
                      className="w-full px-4 py-3.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                      value={postOffice}
                      disabled
                      placeholder="Will auto-fill from pincode"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      District
                    </label>
                    <input
                      className="w-full px-4 py-3.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                      value={district}
                      disabled
                      placeholder="Will auto-fill from pincode"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      State
                    </label>
                    <input
                      className="w-full px-4 py-3.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                      value={state}
                      disabled
                      placeholder="Will auto-fill from pincode"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Exact Address */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Exact Address *
              </label>
              <textarea
                className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white text-gray-800 placeholder-gray-500 resize-none min-h-[120px]"
                placeholder="Enter complete address (Eg: Garudacharpalya, Mahadevapura)"
                value={exactAddress}
                onChange={(e) => setExactAddress(e.target.value)}
                required
              />
            </div>

            {/* Landmark */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Landmark <span className="text-gray-500 font-normal">(Optional)</span>
              </label>
              <input
                className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white text-gray-800 placeholder-gray-500"
                placeholder="Enter nearby landmark"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add Market
              </button>
            </div>

            {/* Required fields note */}
            <p className="text-center text-sm text-gray-500 mt-4">
              * Required fields
            </p>
          </form>
        </div>

        {/* Info Card */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-semibold text-blue-900">How it works</h4>
              <p className="mt-1 text-sm text-blue-800">
                Enter a 6-digit pincode and the system will automatically fetch the corresponding 
                post office, district, and state details. Then provide the exact address and optional landmark.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMarket;