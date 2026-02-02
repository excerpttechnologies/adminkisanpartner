



// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { 
//   Clock, 
//   User, 
//   Activity, 
//   Folder, 
//   RefreshCw, 
//   AlertCircle,
//   ChevronRight,
//   Filter,
//   Search,
//   Download,
//   Copy,
//   Check
// } from "lucide-react";

// // Helper functions
// const extractAdminName = (log: any) => {
//   if (log.actorId?.name) return log.actorId.name;
  
//   if (log.description) {
//     const match = log.description.match(/by (.+?)(?:$| with| on| for)/i);
//     if (match && match[1]) return match[1].trim();
//   }
  
//   if (log.actorId) {
//     if (typeof log.actorId === 'string') {
//       return `User ${log.actorId.substring(0, 8)}...`;
//     }
//     if (log.actorId._id) {
//       return `User ${log.actorId._id.toString().substring(0, 8)}...`;
//     }
//     return `User ${log.actorId.toString().substring(0, 8)}...`;
//   }
  
//   return "Unknown User";
// };

// const formatActorId = (actorId: any) => {
//   if (!actorId) return "N/A";
  
//   if (typeof actorId === 'string') {
//     return actorId.substring(0, 8);
//   }
  
//   if (actorId._id) {
//     return actorId._id.toString().substring(0, 8);
//   }
  
//   if (actorId.toString) {
//     return actorId.toString().substring(0, 8);
//   }
  
//   return "Unknown";
// };

// const getFullActorId = (actorId: any) => {
//   if (!actorId) return "N/A";
//   if (typeof actorId === 'string') return actorId;
//   if (actorId._id) return actorId._id.toString();
//   if (actorId.toString) return actorId.toString();
//   return "Unknown";
// };

// const formatValue = (value: any) => {
//   if (value === undefined || value === null) return 'Empty';
//   if (typeof value === 'object') {
//     try {
//       const str = JSON.stringify(value, null, 2);
//       return str.length > 100 ? str.substring(0, 100) + '...' : str;
//     } catch {
//       return String(value);
//     }
//   }
//   return String(value);
// };

// export default function AuditLogsPage() {
//   const [logs, setLogs] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [copiedId, setCopiedId] = useState<string | null>(null);

//   const fetchLogs = async () => {
//     try {
//       const res = await axios.get("/api/audit-logs");
//       setLogs(res.data.data || []);
//     } catch (err) {
//       console.error("Failed to load audit logs", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const copyToClipboard = (text: string, id: string) => {
//     navigator.clipboard.writeText(text).then(() => {
//       setCopiedId(id);
//       setTimeout(() => setCopiedId(null), 2000);
//     });
//   };

//   useEffect(() => {
//     fetchLogs();
//   }, []);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
//           <p className="text-lg text-gray-600 font-medium">Loading audit logs...</p>
//           <p className="text-sm text-gray-500 mt-2">Please wait while we fetch the activity data</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
//       {/* Header Section */}
//       <div className="mb-8">
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
//           <div>
//             <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
//               <Activity className="w-8 h-8 text-blue-600" />
//               Audit Logs
//             </h1>
//             <p className="text-gray-600 mt-2">Track and monitor all subadmin activities and system events</p>
//           </div>
          
//           <div className="flex gap-3">
//             <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 text-gray-700 hover:bg-gray-50 transition-colors">
//               <Filter className="w-4 h-4" />
//               Filter
//             </button>
//             <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 text-gray-700 hover:bg-gray-50 transition-colors">
//               <Download className="w-4 h-4" />
//               Export
//             </button>
//             <button 
//               onClick={fetchLogs}
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
//             >
//               <RefreshCw className="w-4 h-4" />
//               Refresh
//             </button>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
//           <div className="bg-white rounded-xl p-5 shadow border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Total Logs</p>
//                 <p className="text-2xl font-bold text-gray-900 mt-1">{logs.length}</p>
//               </div>
//               <div className="p-3 bg-blue-50 rounded-lg">
//                 <Activity className="w-6 h-6 text-blue-600" />
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white rounded-xl p-5 shadow border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Unique Actors</p>
//                 <p className="text-2xl font-bold text-gray-900 mt-1">
//                   {new Set(logs.map(log => formatActorId(log.actorId))).size}
//                 </p>
//                 <p className="text-xs text-gray-500 mt-1">By ID</p>
//               </div>
//               <div className="p-3 bg-green-50 rounded-lg">
//                 <User className="w-6 h-6 text-green-600" />
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white rounded-xl p-5 shadow border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Today's Activities</p>
//                 <p className="text-2xl font-bold text-gray-900 mt-1">
//                   {logs.filter(log => {
//                     const logDate = new Date(log.createdAt);
//                     const today = new Date();
//                     return logDate.toDateString() === today.toDateString();
//                   }).length}
//                 </p>
//               </div>
//               <div className="p-3 bg-purple-50 rounded-lg">
//                 <Clock className="w-6 h-6 text-purple-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl p-5 shadow border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Actions Types</p>
//                 <p className="text-2xl font-bold text-gray-900 mt-1">
//                   {new Set(logs.map(log => log.action)).size}
//                 </p>
//                 <p className="text-xs text-gray-500 mt-1">Unique actions</p>
//               </div>
//               <div className="p-3 bg-yellow-50 rounded-lg">
//                 <Folder className="w-6 h-6 text-yellow-600" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Search Bar */}
//       <div className="mb-6">
//         <div className="relative max-w-2xl">
//           <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//           <input
//             type="text"
//             placeholder="Search audit logs by user, action, module, or ID..."
//             className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           />
//         </div>
//       </div>

//       {/* Logs List */}
//       <div className="space-y-4">
//         {logs.length === 0 ? (
//           <div className="bg-white rounded-xl shadow border border-gray-200 p-8 text-center">
//             <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-lg font-semibold text-gray-700 mb-2">No audit logs found</h3>
//             <p className="text-gray-500">There are no activity logs to display at the moment.</p>
//           </div>
//         ) : (
//           logs.map((log) => {
//             const fullActorId = getFullActorId(log.actorId);
//             const logId = log._id || log.id;
            
//             return (
//               <div
//                 key={logId}
//                 className={`bg-white rounded-xl shadow border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200`}
//               >
//                 <div className="p-5">
//                   {/* Header Row */}
//                   <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
//                     <div className="flex items-start gap-3">
//                       <div className={`p-2 rounded-lg ${
//                         log.action?.includes('CREATE') ? 'bg-green-50' :
//                         log.action?.includes('UPDATE') ? 'bg-blue-50' :
//                         log.action?.includes('DELETE') ? 'bg-red-50' : 'bg-gray-50'
//                       }`}>
//                         <Folder className={`w-5 h-5 ${
//                           log.action?.includes('CREATE') ? 'text-green-600' :
//                           log.action?.includes('UPDATE') ? 'text-blue-600' :
//                           log.action?.includes('DELETE') ? 'text-red-600' : 'text-gray-600'
//                         }`} />
//                       </div>
//                       <div className="flex-1">
//                         <div className="flex flex-wrap items-center gap-2 mb-2">
//                           {/* Actor Name */}
//                           <div className="flex items-center gap-1">
//                             <span className="font-semibold text-gray-900">
//                               {log.actorId?.name || extractAdminName(log)}
//                             </span>
//                           </div>
                          
//                           {/* Actor ID with copy button */}
//                           <div className="flex items-center gap-1">
//                             <span className="px-2 py-1 text-xs font-mono bg-gray-800 text-gray-100 rounded-l-md">
//                               ID: {formatActorId(log.actorId)}
//                             </span>
//                             <button
//                               onClick={() => copyToClipboard(fullActorId, logId)}
//                               className="px-2 py-1 text-xs bg-gray-700 text-white rounded-r-md hover:bg-gray-900 transition-colors flex items-center gap-1"
//                               title="Copy full ID"
//                             >
//                               {copiedId === logId ? (
//                                 <Check className="w-3 h-3" />
//                               ) : (
//                                 <Copy className="w-3 h-3" />
//                               )}
//                             </button>
//                           </div>
                          
//                           {/* Actor Role */}
//                           <span className={`px-2 py-1 text-xs font-medium rounded-full ${
//                             log.actorRole === 'admin' 
//                               ? 'bg-red-100 text-red-700 '
//                               : 'bg-gray-100 text-gray-700'
//                           }`}>
//                             {log.actorRole?.toUpperCase() || 'UNKNOWN'}
//                           </span>
                          
//                           <ChevronRight className="w-4 h-4 text-gray-400" />
                          
//                           {/* Action */}
//                           <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
//                             {log.action}
//                           </span>
                          
//                           <ChevronRight className="w-4 h-4 text-gray-400" />
                          
//                           {/* Module */}
//                           <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
//                             {log.module}
//                           </span>
//                         </div>
                        
//                         <p className="text-gray-600 text-sm mt-1">{log.description}</p>
                        
//                         {/* IP & User Agent */}
//                         <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
//                           {log.ipAddress && (
//                             <span className="flex items-center gap-1">
//                               <span className="font-medium">IP:</span> {log.ipAddress}
//                             </span>
//                           )}
//                           {log.userAgent && (
//                             <span className="hidden md:inline-flex items-center gap-1" title={log.userAgent}>
//                               <span className="font-medium">Browser:</span> 
//                               {log.userAgent.length > 30 
//                                 ? log.userAgent.substring(0, 30) + '...' 
//                                 : log.userAgent}
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     </div>
                    
//                     <div className="flex flex-col items-end gap-2">
//                       <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
//                         <Clock className="w-4 h-4" />
//                         <span>{new Date(log.createdAt).toLocaleString()}</span>
//                       </div>
//                       <div className="text-xs text-gray-400 font-mono">
//                         Log ID: {formatActorId({_id: logId})}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Changes Table */}
//                   {log.changes && Object.keys(log.changes).length > 0 && (
//                     <div className="mt-5 pt-5 border-t border-gray-100">
//                       <div className="flex items-center gap-2 mb-3">
//                         <Activity className="w-4 h-4 text-gray-500" />
//                         <h3 className="font-semibold text-gray-700">Field Changes</h3>
//                         <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
//                           {Object.keys(log.changes).length} fields changed
//                         </span>
//                       </div>
                      
//                       <div className="overflow-x-auto rounded-lg border border-gray-200">
//                         <table className="min-w-full divide-y divide-gray-200">
//                           <thead className="bg-gray-50">
//                             <tr>
//                               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                 Field
//                               </th>
//                               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                 Old Value
//                               </th>
//                               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                 New Value
//                               </th>
//                             </tr>
//                           </thead>
//                           <tbody className="bg-white divide-y divide-gray-200">
//                             {Object.entries(log.changes).map(
//                               ([field, value]: any) => (
//                                 <tr key={field} className="hover:bg-gray-50 transition-colors">
//                                   <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
//                                     <span className="px-2 py-1 bg-gray-100 rounded-md font-mono">
//                                       {field}
//                                     </span>
//                                   </td>
//                                   <td className="px-4 py-3 text-sm">
//                                     <div className="max-w-xs overflow-hidden">
//                                       <span className="inline-flex items-center px-3 py-1 rounded text-xs font-medium bg-red-50 text-red-700 whitespace-pre-wrap break-words">
//                                         {formatValue(value.old)}
//                                       </span>
//                                     </div>
//                                   </td>
//                                   <td className="px-4 py-3 text-sm">
//                                     <div className="max-w-xs overflow-hidden">
//                                       <span className="inline-flex items-center px-3 py-1 rounded text-xs font-medium bg-green-50 text-green-700 whitespace-pre-wrap break-words">
//                                         {formatValue(value.new)}
//                                       </span>
//                                     </div>
//                                   </td>
//                                 </tr>
//                               )
//                             )}
//                           </tbody>
//                         </table>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             );
//           })
//         )}
//       </div>

//       {/* Pagination/Footer */}
//       {logs.length > 0 && (
//         <div className="mt-8 pt-6 border-t border-gray-200">
//           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//             <div className="text-sm text-gray-600">
//               <p>
//                 Showing <span className="font-semibold">{logs.length}</span> audit logs • 
//                 <span className="ml-2">
//                   {new Set(logs.map(log => formatActorId(log.actorId))).size} unique actors
//                 </span>
//               </p>
//             </div>
//             <div className="flex items-center gap-2">
//               <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
//                 Previous
//               </button>
//               <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
//                 1
//               </button>
//               <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
//                 Next
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { 
  Clock, 
  User, 
  Activity, 
  Folder, 
  RefreshCw, 
  AlertCircle,
  ChevronRight,
  Filter,
  Search,
  Download,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight as ChevronRightIcon
} from "lucide-react";

// Helper functions
const extractAdminName = (log: any) => {
  if (log.actorId?.name) return log.actorId.name;
  
  if (log.description) {
    const match = log.description.match(/by (.+?)(?:$| with| on| for)/i);
    if (match && match[1]) return match[1].trim();
  }
  
  if (log.actorId) {
    if (typeof log.actorId === 'string') {
      return `User ${log.actorId.substring(0, 8)}...`;
    }
    if (log.actorId._id) {
      return `User ${log.actorId._id.toString().substring(0, 8)}...`;
    }
    return `User ${log.actorId.toString().substring(0, 8)}...`;
  }
  
  return "Unknown User";
};

const formatActorId = (actorId: any) => {
  if (!actorId) return "N/A";
  
  if (typeof actorId === 'string') {
    return actorId.substring(0, 8);
  }
  
  if (actorId._id) {
    return actorId._id.toString().substring(0, 8);
  }
  
  if (actorId.toString) {
    return actorId.toString().substring(0, 8);
  }
  
  return "Unknown";
};

const getFullActorId = (actorId: any) => {
  if (!actorId) return "N/A";
  if (typeof actorId === 'string') return actorId;
  if (actorId._id) return actorId._id.toString();
  if (actorId.toString) return actorId.toString();
  return "Unknown";
};

const formatValue = (value: any) => {
  if (value === undefined || value === null) return 'Empty';
  if (typeof value === 'object') {
    try {
      const str = JSON.stringify(value, null, 2);
      return str.length > 100 ? str.substring(0, 100) + '...' : str;
    } catch {
      return String(value);
    }
  }
  return String(value);
};

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLogs = async () => {
    try {
      const res = await axios.get("/api/audit-logs");
      const allLogs = res.data.data || [];
      setLogs(allLogs);
      
      // Calculate total pages
      const total = Math.ceil(allLogs.length / itemsPerPage);
      setTotalPages(total || 1);
    } catch (err) {
      console.error("Failed to load audit logs", err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  // Handle items per page change
  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Calculate paginated logs
  const getPaginatedLogs = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return logs.slice(startIndex, endIndex);
  };

  // Calculate displayed logs info
  const getDisplayedInfo = () => {
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, logs.length);
    return { start, end, total: logs.length };
  };

  // Pagination controls
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages are less than or equal to maxVisiblePages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page, last page, and pages around current page
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      if (currentPage <= 2) {
        start = 2;
        end = 4;
      } else if (currentPage >= totalPages - 1) {
        start = totalPages - 3;
        end = totalPages - 1;
      }
      
      pages.push(1);
      if (start > 2) pages.push('...');
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (end < totalPages - 1) pages.push('...');
      if (totalPages > 1) pages.push(totalPages);
    }
    
    return pages;
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Recalculate total pages when itemsPerPage changes
  useEffect(() => {
    const total = Math.ceil(logs.length / itemsPerPage);
    setTotalPages(total || 1);
    
    // Adjust current page if it exceeds total pages
    if (currentPage > total && total > 0) {
      setCurrentPage(total);
    }
  }, [itemsPerPage, logs.length]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600 font-medium">Loading audit logs...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait while we fetch the activity data</p>
        </div>
      </div>
    );
  }

  const paginatedLogs = getPaginatedLogs();
  const { start, end, total } = getDisplayedInfo();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Activity className="w-8 h-8 text-blue-600" />
              Audit Logs
            </h1>
            <p className="text-gray-600 mt-2">Track and monitor all subadmin activities and system events</p>
          </div>
          
          <div className="flex gap-3">
            <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 text-gray-700 hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filter</span>
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 text-gray-700 hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button 
              onClick={fetchLogs}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Logs</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{logs.length}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-5 shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unique Actors</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {new Set(logs.map(log => formatActorId(log.actorId))).size}
                </p>
                <p className="text-xs text-gray-500 mt-1">By ID</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <User className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-5 shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today&apos;s Activities</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {logs.filter(log => {
                    const logDate = new Date(log.createdAt);
                    const today = new Date();
                    return logDate.toDateString() === today.toDateString();
                  }).length}
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Actions Types</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {new Set(logs.map(log => log.action)).size}
                </p>
                <p className="text-xs text-gray-500 mt-1">Unique actions</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <Folder className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search audit logs by user, action, module, or ID..."
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Logs List */}
      <div className="space-y-4">
        {logs.length === 0 ? (
          <div className="bg-white rounded-xl shadow border border-gray-200 p-8 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No audit logs found</h3>
            <p className="text-gray-500">There are no activity logs to display at the moment.</p>
          </div>
        ) : (
          paginatedLogs.map((log) => {
            const fullActorId = getFullActorId(log.actorId);
            const logId = log._id || log.id;
            
            return (
              <div
                key={logId}
                className={`bg-white rounded-xl shadow border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200`}
              >
                <div className="p-4 md:p-5">
                  {/* Header Row */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg flex-shrink-0 ${
                        log.action?.includes('CREATE') ? 'bg-green-50' :
                        log.action?.includes('UPDATE') ? 'bg-blue-50' :
                        log.action?.includes('DELETE') ? 'bg-red-50' : 'bg-gray-50'
                      }`}>
                        <Folder className={`w-5 h-5 ${
                          log.action?.includes('CREATE') ? 'text-green-600' :
                          log.action?.includes('UPDATE') ? 'text-blue-600' :
                          log.action?.includes('DELETE') ? 'text-red-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          {/* Actor Name */}
                          <div className="flex items-center gap-1">
                            <span className="font-semibold text-gray-900 truncate">
                              {log.actorId?.name || extractAdminName(log)}
                            </span>
                          </div>
                          
                          {/* Actor ID with copy button */}
                          <div className="flex items-center gap-1">
                            <span className="px-2 py-1 text-xs font-mono bg-gray-800 text-gray-100 rounded-l-md truncate max-w-[80px] sm:max-w-none">
                              ID: {formatActorId(log.actorId)}
                            </span>
                            <button
                              onClick={() => copyToClipboard(fullActorId, logId)}
                              className="px-2 py-1 text-xs bg-gray-700 text-white rounded-r-md hover:bg-gray-900 transition-colors flex items-center gap-1 flex-shrink-0"
                              title="Copy full ID"
                            >
                              {copiedId === logId ? (
                                <Check className="w-3 h-3" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                          
                          {/* Actor Role */}
                          <span className={`px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ${
                            log.actorRole === 'admin' 
                              ? 'bg-red-100 text-red-700 '
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {log.actorRole?.toUpperCase() || 'UNKNOWN'}
                          </span>
                          
                          <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 hidden sm:inline" />
                          
                          {/* Action */}
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full flex-shrink-0">
                            {log.action}
                          </span>
                          
                          <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 hidden sm:inline" />
                          
                          {/* Module */}
                          <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full flex-shrink-0">
                            {log.module}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 text-sm mt-1 line-clamp-2">{log.description}</p>
                        
                        {/* IP & User Agent */}
                        <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                          {log.ipAddress && (
                            <span className="flex items-center gap-1">
                              <span className="font-medium">IP:</span> <span className="truncate max-w-[100px] sm:max-w-none">{log.ipAddress}</span>
                            </span>
                          )}
                          {log.userAgent && (
                            <span className="hidden sm:inline-flex items-center gap-1" title={log.userAgent}>
                              <span className="font-medium">Browser:</span> 
                              {log.userAgent.length > 30 
                                ? log.userAgent.substring(0, 30) + '...' 
                                : log.userAgent}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg w-full justify-end">
                        <Clock className="w-4 h-4 flex-shrink-0" />
                        <span className="text-xs sm:text-sm">{new Date(log.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="text-xs text-gray-400 font-mono hidden sm:block">
                        Log ID: {formatActorId({_id: logId})}
                      </div>
                    </div>
                  </div>

                  {/* Changes Table */}
                  {log.changes && Object.keys(log.changes).length > 0 && (
                    <div className="mt-5 pt-5 border-t border-gray-100">
                      <div className="flex items-center gap-2 mb-3">
                        <Activity className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <h3 className="font-semibold text-gray-700">Field Changes</h3>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {Object.keys(log.changes).length} fields changed
                        </span>
                      </div>
                      
                      <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Field
                              </th>
                              <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Old Value
                              </th>
                              <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                New Value
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {Object.entries(log.changes).map(
                              ([field, value]: any) => (
                                <tr key={field} className="hover:bg-gray-50 transition-colors">
                                  <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                    <span className="px-2 py-1 bg-gray-100 rounded-md font-mono text-xs sm:text-sm">
                                      {field}
                                    </span>
                                  </td>
                                  <td className="px-3 py-2 sm:px-4 sm:py-3 text-sm">
                                    <div className="max-w-[120px] sm:max-w-xs overflow-hidden">
                                      <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded text-xs font-medium bg-red-50 text-red-700 whitespace-pre-wrap break-all">
                                        {formatValue(value.old)}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-3 py-2 sm:px-4 sm:py-3 text-sm">
                                    <div className="max-w-[120px] sm:max-w-xs overflow-hidden">
                                      <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded text-xs font-medium bg-green-50 text-green-700 whitespace-pre-wrap break-all">
                                        {formatValue(value.new)}
                                      </span>
                                    </div>
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination/Footer */}
      {logs.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Left side: Items per page selector and showing info */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Items per page selector */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Show:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-sm text-gray-600">entries</span>
              </div>
              
              {/* Showing info */}
              <div className="text-sm text-gray-600">
                Showing <span className="font-semibold">{start}</span> to <span className="font-semibold">{end}</span> of <span className="font-semibold">{total}</span> audit logs
              </div>
            </div>

            {/* Right side: Pagination controls */}
            <div className="flex items-center justify-between sm:justify-end gap-2">
              {/* Previous button */}
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className={`p-2 border border-gray-300 rounded-lg flex items-center justify-center ${
                  currentPage === 1
                    ? 'text-gray-400 cursor-not-allowed bg-gray-50'
                    : 'text-gray-700 hover:bg-gray-50 transition-colors'
                }`}
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline ml-1">Previous</span>
              </button>

              {/* Page numbers */}
              <div className="flex items-center gap-1">
                {getPageNumbers().map((pageNum, index) => (
                  pageNum === '...' ? (
                    <span key={`ellipsis-${index}`} className="px-2 py-1 text-gray-400">
                      ...
                    </span>
                  ) : (
                    <button
                      key={pageNum}
                      onClick={() => goToPage(pageNum as number)}
                      className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white font-medium'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                ))}
              </div>

              {/* Next button */}
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`p-2 border border-gray-300 rounded-lg flex items-center justify-center ${
                  currentPage === totalPages
                    ? 'text-gray-400 cursor-not-allowed bg-gray-50'
                    : 'text-gray-700 hover:bg-gray-50 transition-colors'
                }`}
                aria-label="Next page"
              >
                <span className="hidden sm:inline mr-1">Next</span>
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}