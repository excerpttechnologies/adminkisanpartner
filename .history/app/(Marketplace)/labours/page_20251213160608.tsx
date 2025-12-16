// "use client";

// import { useState } from "react";
// import { Modal, Box, Pagination, Stack } from "@mui/material";
// import { FaTrash } from "react-icons/fa";

// /* ================= TYPES ================= */

// interface LabourRequest {
//   id: number;
//   farmerName: string;
//   mobile: string;
//   requiredDate: string;
//   male: number;
//   female: number;
//   crop: string;
//   work: string;
// }

// /* ================= DATA ================= */

// const labourRequests: LabourRequest[] = [
//   {
//     id: 1,
//     farmerName: "Rajesh Kumar",
//     mobile: "9876543210",
//     requiredDate: "2024-07-20",
//     male: 5,
//     female: 3,
//     crop: "Wheat",
//     work: "Harvesting",
//   },
//   {
//     id: 2,
//     farmerName: "Priya Sharma",
//     mobile: "8765432109",
//     requiredDate: "2024-07-22",
//     male: 2,
//     female: 4,
//     crop: "Rice",
//     work: "Weeding",
//   },
//   {
//     id: 3,
//     farmerName: "Amit Singh",
//     mobile: "7654321098",
//     requiredDate: "2024-07-25",
//     male: 8,
//     female: 0,
//     crop: "Corn",
//     work: "Plowing",
//   },
//   {
//     id: 4,
//     farmerName: "Deepa Devi",
//     mobile: "6543210987",
//     requiredDate: "2024-07-28",
//     male: 3,
//     female: 5,
//     crop: "Potatoes",
//     work: "Planting",
//   },
//   {
//     id: 5,
//     farmerName: "Sanjay Yadav",
//     mobile: "5432109876",
//     requiredDate: "2024-08-01",
//     male: 6,
//     female: 2,
//     crop: "Sugarcane",
//     work: "Cutting",
//   },
// ];

// /* ================= PAGE ================= */

// export default function LabourRequestsPage() {
//   const [rows, setRows] = useState<LabourRequest[]>(labourRequests);
//   const [open, setOpen] = useState(false);
//   const [selected, setSelected] = useState<LabourRequest | null>(null);
//   const [page, setPage] = useState(1);
//   const [rowsPerPage] = useState(10);

//   const handleDeleteClick = (row: LabourRequest) => {
//     setSelected(row);
//     setOpen(true);
//   };

//   const confirmDelete = () => {
//     if (!selected) return;
//     setRows((prev) => prev.filter((r) => r.id !== selected.id));
//     setOpen(false);
//     setSelected(null);
//   };

//   // Calculate pagination
//   const startIndex = (page - 1) * rowsPerPage;
//   const endIndex = startIndex + rowsPerPage;
//   const paginatedRows = rows.slice(startIndex, endIndex);
//   const totalPages = Math.ceil(rows.length / rowsPerPage);

//   const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
//     setPage(value);
//   };

//   return (
//     <div className="p-1 mt-4 bg-gray-100 min-h-[80vh] pr-4">
//       <div className="bg-white rounded shadow-md">

//         {/* HEADER */}
//         <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-200">
//           <h2 className="text-lg font-semibold text-gray-800">
//             Labour Requests
//           </h2>
//           <div className="text-sm text-gray-600">
//             Total: {rows.length} requests
//           </div>
//         </div>

//         {/* RESPONSIVE TABLE WITH HORIZONTAL SCROLL */}
//         <div className="relative overflow-x-auto w-full">
//           <div className="min-w-[800px] overflow-visible">
//             <table className="w-full text-sm ">
//               <thead className="bg-gray-50 text-gray-600 border-b border-zinc-200">
//                 <tr>
//                   <th className="px-6 py-3 text-left whitespace-nowrap">Farmer Details</th>
//                   <th className="px-6 py-3 text-left whitespace-nowrap">Required Date</th>
//                   <th className="px-6 py-3 text-left whitespace-nowrap">Male Required</th>
//                   <th className="px-6 py-3 text-left whitespace-nowrap">Female Required</th>
//                   <th className="px-6 py-3 text-left whitespace-nowrap">Crop</th>
//                   <th className="px-6 py-3 text-left whitespace-nowrap">Work</th>
//                   <th className="px-6 py-3 text-center whitespace-nowrap">Actions</th>
//                 </tr>
//               </thead>

//               <tbody className="divide-y">
//                 {paginatedRows.map((row) => (
//                   <tr key={row.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-3 whitespace-nowrap">
//                       <div className="font-medium text-gray-800">
//                         {row.farmerName}
//                       </div>
//                       <div className="text-xs text-gray-500">
//                         {row.mobile}
//                       </div>
//                     </td>
//                     <td className="px-6 py-3 whitespace-nowrap">{row.requiredDate}</td>
//                     <td className="px-6 py-3 whitespace-nowrap">{row.male}</td>
//                     <td className="px-6 py-3 whitespace-nowrap">{row.female}</td>
//                     <td className="px-6 py-3 whitespace-nowrap">{row.crop}</td>
//                     <td className="px-6 py-3 whitespace-nowrap">{row.work}</td>
//                     <td className="px-6 py-3 text-center whitespace-nowrap">
//                       <button
//                         onClick={() => handleDeleteClick(row)}
//                         className="text-red-500 hover:text-red-600"
//                       >
//                         <FaTrash />
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* MUI PAGINATION */}
//         {rows.length > 0 && (
//           <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-t border-zinc-200">
//             <div className="text-sm text-gray-600 mb-2 sm:mb-0">
//               Showing {startIndex + 1} to {Math.min(endIndex, rows.length)} of {rows.length} entries
//             </div>
//             <Stack spacing={2}>
//               <Pagination
//                 count={totalPages}
//                 page={page}
//                 onChange={handlePageChange}
//                 color="primary"
//                 size="medium"
//                 showFirstButton
//                 showLastButton
//               />
//             </Stack>
//           </div>
//         )}

//         {/* EMPTY STATE */}
//         {rows.length === 0 && (
//           <div className="text-center py-12">
//             <div className="text-gray-300 text-4xl mb-3">👨‍🌾</div>
//             <h3 className="text-lg font-medium text-gray-700 mb-1">No Labour Requests</h3>
//             <p className="text-gray-500 text-sm">All labour requests have been processed or deleted.</p>
//           </div>
//         )}
//       </div>

//       {/* ================= DELETE MODAL ================= */}
//       <Modal open={open} onClose={() => setOpen(false)}>
//         <Box className="flex items-center justify-center h-full">
//           <div className="bg-white rounded shadow w-[90%] max-w-md p-6 text-center">

//             <div className="text-red-500 text-5xl mb-4">🗑️</div>

//             <h3 className="text-lg font-semibold text-gray-800 mb-2">
//               Delete Labour Request?
//             </h3>

//             <p className="text-gray-600 text-sm mb-6">
//               Are you sure you want to delete the request from{" "}
//               <span className="font-medium text-gray-800">
//                 {selected?.farmerName}
//               </span>
//               ? This action cannot be undone.
//             </p>

//             <div className="flex justify-center gap-4">
//               <button
//                 onClick={() => setOpen(false)}
//                 className="px-6 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={confirmDelete}
//                 className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </Box>
//       </Modal>
//     </div>
//   );
// }

import React from 'react'

const page = () => {
  return (
    <div className='w-full h-full  overflow-auto'>
       <div className='w-[200vw] p-4 bg-white'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Accusantium dolorem saepe ipsum quo amet odit? Eveniet perspiciatis exercitationem fugiat molestias quis quae praesentium ducimus labore vel deleniti nemo accusamus rem, ipsam vero odit saepe quibusdam magnam aut, vitae provident ratione a ipsa iure quisquam. Velit ipsa tenetur commodi quae et amet harum dolorem eveniet vitae quod modi voluptatum accusantium nesciunt ea exercitationem, alias ad. Reiciendis explicabo optio quibusdam cupiditate quod quis numquam illo quae officia, beatae, accusamus debitis fugit harum excepturi, eum recusandae cumque dolores! Quaerat sunt dolor dolore distinctio recusandae incidunt! Excepturi culpa quos impedit. Quos explicabo amet assumenda vel sint quidem suscipit, incidunt facere enim, ipsum recusandae asperiores quo eos quas repellat molestias saepe sed fugit minus sapiente totam. Architecto eaque magnam velit, nesciunt distinctio beatae quibusdam nulla optio rerum eius, possimus minus doloribus ipsa voluptate officia consectetur fuga natus quis! Dolorem molestias repellendus labore, odit nihil a laborum, dicta harum similique ipsam minus perspiciatis voluptas! Mollitia libero, repellendus nisi consectetur nesciunt iusto natus! Explicabo qui culpa aperiam atque ipsa dolor quam rerum obcaecati, quae neque pariatur sed incidunt, iusto enim temporibus repudiandae quo distinctio tenetur modi nihil dignissimos rem ipsam et. Natus vel aspernatur ab labore quisquam deserunt odio! Unde non aliquid tempore molestiae voluptas, doloremque, commodi praesentium ipsam nostrum cumque adipisci nihil architecto reprehenderit ducimus qui! Magnam molestiae totam alias ratione facere! Quo quasi hic deleniti blanditiis quod inventore molestiae pariatur voluptatum qui, voluptas, iure officia. Vitae, nostrum, nemo autem et quas placeat nihil inventore reiciendis, sunt cupiditate ex recusandae. Animi culpa harum, repellat commodi odio nihil magni amet delectus? Voluptatibus soluta porro nemo. Tempore nemo commodi quae quos ipsam ea aut at atque optio, velit consequuntur sint vel necessitatibus dolorem, dolorum tempora enim possimus voluptate dolores exercitationem quasi amet ullam minima! Necessitatibus, reprehenderit eius? Illum, voluptas perspiciatis laudantium obcaecati neque atque possimus praesentium dolorem aperiam harum officiis odio veritatis aspernatur vero, enim aut tempore delectus voluptates recusandae, doloribus quos ex! Possimus, saepe. Sint et sit ab. Ullam itaque vero perspiciatis, voluptate labore laboriosam quos cum deserunt culpa, ea sit officia, odit cupiditate quas iusto ut vel voluptatibus reiciendis modi? Tempore modi culpa quia, placeat facere ipsum consectetur officiis ea natus a. Unde doloribus debitis sed ipsa id veniam saepe officiis. Nihil accusamus eligendi omnis cumque eius quos numquam itaque officia necessitatibus hic aliquid qui minus rem voluptas eos obcaecati accusantium, assumenda minima tenetur aperiam natus nisi. Nulla enim saepe consectetur, quisquam voluptatem nobis in dolorem commodi sit ipsa sunt et, praesentium aut ullam atque pariatur animi quae cumque. Nobis voluptatum eaque quo. Quae iure error aperiam, quo nam accusantium libero dolorum illo delectus unde facere corrupti dignissimos inventore saepe hic, quia iste deserunt dolore explicabo incidunt ullam quisquam dolorem repellat quam. Consequuntur hic accusantium similique minima voluptatibus tempore temporibus eius mollitia doloremque exercitationem, quia et iusto nisi voluptas laborum voluptates quam optio placeat repudiandae voluptate cumque praesentium laudantium minus itaque! Temporibus doloremque quidem laudantium voluptatibus mollitia enim possimus eligendi velit sunt perspiciatis animi numquam, consectetur totam, labore aliquid minus laboriosam quam. Neque eveniet assumenda autem alias vero ad ut aliquam quaerat dignissimos sit velit dicta sequi, odio amet corrupti deleniti aspernatur voluptate iste necessitatibus, hic esse facere? Dolorum placeat libero beatae impedit repellendus dolore expedita quaerat, veniam quam natus. Error exercitationem quisquam illo corporis praesentium saepe expedita dignissimos sit reprehenderit quibusdam voluptatem iure nisi vitae laudantium obcaecati, quidem consectetur ex delectus cupiditate accusamus? Corrupti, id totam at molestias quae praesentium maxime iusto omnis eos dolorem nobis labore placeat ducimus alias enim similique quisquam nemo! Reiciendis tempore at a eius accusamus ullam et labore maxime quisquam! Neque soluta tempora fugiat? Exercitationem, pariatur eligendi distinctio, delectus molestiae rerum a ad ipsam ducimus eaque labore tempora, modi aliquid vero illum cupiditate reiciendis non repellat sed officia alias molestias commodi quibusdam error. Fugiat, ratione harum laboriosam odio exercitationem illo. At molestiae qui impedit culpa sapiente enim nostrum minus autem id ut dolores esse repellat minima cumque, placeat quibusdam reprehenderit quisquam. Suscipit alias neque temporibus. Deserunt voluptatem aliquid, pariatur vel porro repudiandae nihil illo quod unde, hic sit fugiat! Rerum magnam, alias nisi quis recusandae eligendi, voluptate omnis illo sed repellat non vero doloremque soluta veniam itaque, excepturi autem tempora inventore obcaecati vitae nesciunt at culpa! Neque commodi rerum exercitationem distinctio itaque quisquam fugiat quis sunt numquam molestiae quos inventore qui, nobis tempora dicta maiores nihil ab iusto, quo error quasi necessitatibus pariatur? Dolorem aperiam minus sapiente repellat quod, eligendi sequi, accusamus incidunt eius ea dicta alias iusto tempore ex at quidem maiores provident vitae. Aliquid porro id sed quod. Animi totam provident nemo quam numquam ipsam expedita illo placeat quis sequi vel in nulla, exercitationem necessitatibus soluta doloribus? Commodi nam ipsa mollitia deleniti odio quis saepe rerum magnam accusamus eaque iusto optio, at modi repellat esse, cupiditate vero veritatis iure aspernatur quaerat consequuntur pariatur numquam nesciunt. Blanditiis, maiores quos aut assumenda illum eos sed itaque id voluptatum hic officiis. Error ad neque provident nam dolorum architecto, ipsa id inventore dolorem illum corrupti omnis. Maxime ratione facere itaque officiis placeat aspernatur odit tempore earum sequi non nemo iure maiores rem, nesciunt animi iste magnam ex! Dolore inventore ipsum laborum iure optio totam maiores ratione eaque ipsam voluptas. Ex quia similique perspiciatis maxime molestiae beatae magnam laudantium, ad laborum expedita quod nobis cum eveniet, inventore esse cupiditate eligendi obcaecati. Consequuntur aperiam voluptatem cum voluptas atque nulla dolorem sit facere corporis minus iste quisquam quasi quae quidem, molestias maiores deleniti voluptatum magni beatae a adipisci. Quibusdam quam, adipisci expedita commodi est praesentium laboriosam veritatis accusamus doloribus nostrum, accusantium quae, obcaecati quasi enim aut voluptas sint mollitia. At dolore animi laboriosam ipsam officiis adipisci ipsum rerum minus atque sequi quisquam nemo, doloribus exercitationem ab ducimus voluptatum, totam eligendi illum veniam eos unde delectus quasi doloremque vero. Enim minus velit non ipsum iusto ducimus provident labore neque, nihil earum aut. Excepturi, alias nisi vitae reiciendis ratione culpa optio iure quos at voluptas aperiam. Perferendis doloremque aliquam nostrum ipsam fugit voluptates fuga, eum ducimus voluptate!</div>
    </div>
  )
}

export default page
