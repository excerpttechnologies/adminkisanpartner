// "use client";

// import { useState } from "react";

// export default function ProfileSettings() {
//   const [fullName, setFullName] = useState("Kisan Partners");
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState<string | null>(null);

//   /* ---------- UPDATE PROFILE ---------- */
//   const handleUpdate = () => {
//     if (!fullName.trim()) {
//       setMessage("Full Name is required");
//       return;
//     }

//     // 👉 Here you can call your API
//     // Example:
//     // await axios.post("/api/profile/update", { fullName, password });

//     setMessage("Profile updated successfully");

//     // clear password after update
//     setPassword("");

//     setTimeout(() => setMessage(null), 2500);
//   };

//   return (
//     <div className="p-4 md:p-6 text-black">

//       {/* PAGE TITLE */}
//       <h1 className="text-xl font-semibold mb-4">Profile Settings</h1>

//       {/* SUCCESS / ERROR MESSAGE */}
//       {message && (
//         <div className="mb-3 bg-green-100 text-green-800 px-4 py-2 rounded">
//           {message}
//         </div>
//       )}

//       {/* CARD */}
//       <div className="bg-white rounded shadow-sm border">

//         {/* CARD HEADER */}
//         <div className="border-b px-4 py-3">
//           <span className="text-blue-600 text-sm cursor-pointer">
//             Edit Profile
//           </span>
//         </div>

//         {/* CARD BODY */}
//         <div className="p-4 space-y-4">

//           {/* FULL NAME */}
//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Full Name
//             </label>
//             <input
//               type="text"
//               value={fullName}
//               onChange={(e) => setFullName(e.target.value)}
//               className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
//             />
//           </div>

//           {/* PASSWORD */}
//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Password
//             </label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Enter only if you change otherwise leave it blank."
//               className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
//             />
//           </div>

//           {/* UPDATE BUTTON */}
//           <button
//             onClick={handleUpdate}
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-medium"
//           >
//             Update
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }















"use client";

import { useState } from "react";

export default function ProfileSettings() {
  const [fullName, setFullName] = useState("Kisan Partners");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /* ---------- UPDATE PROFILE ---------- */
  const handleUpdate = async () => {
    if (!fullName.trim()) {
      setMessage("Full Name is required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          password, // optional
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Profile update failed");
        return;
      }

      setMessage("Profile updated successfully");

      // clear password after update
      setPassword("");
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 2500);
    }
  };

  return (
    <div className="p-4 md:p-6 text-black">

      {/* PAGE TITLE */}
      <h1 className="text-xl font-semibold mb-4">Profile Settings</h1>

      {/* SUCCESS / ERROR MESSAGE */}
      {message && (
        <div className="mb-3 bg-green-100 text-green-800 px-4 py-2 rounded">
          {message}
        </div>
      )}

      {/* CARD */}
      <div className="bg-white rounded shadow-sm border">

        {/* CARD HEADER */}
        <div className="border-b px-4 py-3">
          <span className="text-blue-600 text-sm cursor-pointer">
            Edit Profile
          </span>
        </div>

        {/* CARD BODY */}
        <div className="p-4 space-y-4">

          {/* FULL NAME */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter only if you change otherwise leave it blank."
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* UPDATE BUTTON */}
          <button
            onClick={handleUpdate}
            disabled={loading}
            className={`w-full py-2 rounded font-medium text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}
