








// "use client";

// import { useState, useEffect } from "react";
// import {
//   FaEye,
//   FaTrash,
//   FaPrint,
//   FaCopy,
//   FaFileExcel,
//   FaFileCsv,
//   FaFilePdf,
//   FaSearch,
//   FaRedo,
//   FaEdit,
//   FaPlus,
//   FaTrashRestore,
//   FaHistory,
//   FaTrashAlt,
//   FaChevronDown,
//   FaChevronRight,
//   FaMapMarkerAlt,
// } from "react-icons/fa";
// import * as XLSX from "xlsx";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { Pagination } from "@mui/material";
// import { getAllMenuModules } from "@/app/config/menu.config";

// /* ================= TYPES ================= */

// interface SubAdmin {
//   _id: string;
//   name: string;
//   email: string;
//   password: string;
//   pageAccess: string[];
//   isDeleted?: boolean;
//   deletedAt?: string;
//   deletedBy?: string;
//   createdAt?: string;
//   updatedAt?: string;
//   state?: string;
//   district?: string;
//   taluka?: string;
//   commodity?: string[];
//   subCategories?: string[];
// }

// interface ApiResponse {
//   success: boolean;
//   data: SubAdmin | SubAdmin[];
//   message?: string;
//   page?: number;
//   limit?: number;
//   total?: number;
// }

// interface State {
//   _id: string;
//   name: string;
// }

// interface District {
//   _id: string;
//   name: string;
//   stateId: string;
// }

// interface Taluka {
//   _id: string;
//   name: string;
//   district: {
//     _id: string;
//     name: string;
//     stateId: string;
//   };
// }

// interface LocationData {
//   pinCode: string;
//   state: string;
//   district: string;
//   taluk: string;
// }

// interface CommodityCategory {
//   _id: string;
//   categoryName: string;
//   categoryId: string;
//   image: string;
//   subCategories: SubCategory[];
// }

// interface SubCategory {
//   _id: string;
//   subCategoryName: string;
//   categoryId: string;
//   image: string;
//   subCategoryId: string;
// }

// /* ================= PAGE ================= */

// export default function SubAdminAccountsPage() {
//   const [allModules, setAllModules] = useState<string[]>([]);
//   const [modules, setModules] = useState<string[]>(["All"]);
//   const [allSubAdmins, setAllSubAdmins] = useState<SubAdmin[]>([]);
//   const [subAdmins, setSubAdmins] = useState<SubAdmin[]>([]);
//   const [search, setSearch] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalAdmins, setTotalAdmins] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [states, setStates] = useState<State[]>([]);
//   const [districts, setDistricts] = useState<District[]>([]);
//   const [talukas, setTalukas] = useState<Taluka[]>([]);
//   const [allLocations, setAllLocations] = useState<LocationData[]>([]);
  
//   // Commodities state
//   const [commodityCategories, setCommodityCategories] = useState<CommodityCategory[]>([]);
//   const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  
//   // Filter states
//   const [stateFilter, setStateFilter] = useState<string>("");
//   const [districtFilter, setDistrictFilter] = useState<string>("");
//   const [talukaFilter, setTalukaFilter] = useState<string>("");
  
//   // Filtered dropdowns for form
//   const [filteredDistricts, setFilteredDistricts] = useState<District[]>([]);
//   const [filteredTalukas, setFilteredTalukas] = useState<Taluka[]>([]);
  
//   // Filtered dropdowns for filters
//   const [filteredDistrictsForFilter, setFilteredDistrictsForFilter] = useState<District[]>([]);
//   const [filteredTalukasForFilter, setFilteredTalukasForFilter] = useState<Taluka[]>([]);

//   // PIN Code lookup
//   const [pincode, setPincode] = useState("");
//   const [pincodeLoading, setPincodeLoading] = useState(false);
//   const [pincodeError, setPincodeError] = useState("");

//   const [open, setOpen] = useState(false);
//   const [deleteOpen, setDeleteOpen] = useState(false);
//   const [restoreOpen, setRestoreOpen] = useState(false);
//   const [permanentDeleteOpen, setPermanentDeleteOpen] = useState(false);
//   const [viewOpen, setViewOpen] = useState(false);
//   const [selectedAdmin, setSelectedAdmin] = useState<SubAdmin | null>(null);
//   const [adminToRestore, setAdminToRestore] = useState<SubAdmin | null>(null);
//   const [adminToDeletePermanently, setAdminToDeletePermanently] = useState<SubAdmin | null>(null);
//   const [editing, setEditing] = useState<SubAdmin | null>(null);
//   const [showDeleted, setShowDeleted] = useState(false);

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     pageAccess: [] as string[],
//     state: "",
//     district: "",
//     taluka: "",
//     commodity: [] as string[],
//     subCategories: [] as string[],
//   });

//   const [errors, setErrors] = useState<Record<string, string>>({});

//   /* ================= API FUNCTIONS ================= */

//   const fetchSubAdmins = async (page: number = 1, searchQuery: string = "") => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const params = new URLSearchParams({
//         page: page.toString(),
//         limit: "10000",
//         search: searchQuery,
//         showDeleted: showDeleted.toString(),
//       });

//       const response = await axios.get<ApiResponse>(`/api/admin?${params}`);
      
//       if (response.data.success) {
//         const data = Array.isArray(response.data.data) 
//           ? response.data.data 
//           : [response.data.data];
        
//         setAllSubAdmins(data);
        
//         // Apply manual filtering
//         const filteredData = applyManualFilters(data);
//         setSubAdmins(filteredData);
        
//         if (response.data.total !== undefined) {
//           setTotalAdmins(filteredData.length);
//           setTotalPages(Math.ceil(filteredData.length / rowsPerPage));
//         }
//         setCurrentPage(1);
//       }
//     } catch (err: any) {
//       console.error("Error fetching sub-admins:", err);
//       setError(err.response?.data?.message || 'Failed to load sub-admins. Please try again.');
//       setAllSubAdmins([]);
//       setSubAdmins([]);
//       toast.error(err.response?.data?.message || "Failed to load sub-admins");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCommodities = async () => {
//     try {
//       const response = await axios.get("/api/commodities");
//       if (response.data.success) {
//         setCommodityCategories(response.data.data);
//         // Expand all categories by default
//         const expanded = new Set<string>();
//         response.data.data.forEach((category: CommodityCategory) => {
//           expanded.add(category._id);
//         });
//         setExpandedCategories(expanded);
//       }
//     } catch (err) {
//       console.error("Error fetching commodities:", err);
//       toast.error("Failed to load commodities");
//     }
//   };

//   // Fetch all location data from the new API
//   const fetchAllLocations = async () => {
//     try {
//       const response = await axios.get("/api/states-details?limit=10000");
//       if (response.data.success) {
//         const locations = response.data.data;
//         setAllLocations(locations);
        
//         // Extract unique states, districts, and talukas
//         const uniqueStates = Array.from(
//           new Set(locations.map((loc: LocationData) => loc.state))
//         )
//           .filter(state => state && state.trim() !== "")
//           .map((state, index) => ({
//             _id: `state-${index + 1}`,
//             name: state,
//           }));
        
//         setStates(uniqueStates);
        
//         // Extract districts
//         const districtMap = new Map();
//         locations.forEach((loc: LocationData, index: number) => {
//           if (loc.district && loc.district.trim() !== "" && loc.state) {
//             const state = uniqueStates.find(s => s.name === loc.state);
//             if (state) {
//               const key = `${loc.state}-${loc.district}`;
//               if (!districtMap.has(key)) {
//                 districtMap.set(key, {
//                   _id: `district-${districtMap.size + 1}`,
//                   name: loc.district,
//                   stateId: state._id,
//                   stateName: loc.state,
//                 });
//               }
//             }
//           }
//         });
        
//         const districtsArray = Array.from(districtMap.values());
//         setDistricts(districtsArray);
        
//         // Extract talukas
//         const talukaMap = new Map();
//         locations.forEach((loc: LocationData, index: number) => {
//           if (loc.taluk && loc.taluk.trim() !== "" && loc.district && loc.state) {
//             const district = districtsArray.find(d => 
//               d.name === loc.district && d.stateName === loc.state
//             );
//             if (district) {
//               const key = `${loc.state}-${loc.district}-${loc.taluk}`;
//               if (!talukaMap.has(key)) {
//                 talukaMap.set(key, {
//                   _id: `taluka-${talukaMap.size + 1}`,
//                   name: loc.taluk,
//                   district: {
//                     _id: district._id,
//                     name: district.name,
//                     stateId: district.stateId,
//                   },
//                 });
//               }
//             }
//           }
//         });
        
//         const talukasArray = Array.from(talukaMap.values());
//         setTalukas(talukasArray);
//       }
//     } catch (err) {
//       console.error("Error fetching locations:", err);
//       toast.error("Failed to load location data");
//     }
//   };

//   // Fetch PIN code details from the new API
//   const fetchPinCodeDetails = async (pincode: string) => {
//     try {
//       setPincodeLoading(true);
//       setPincodeError("");
      
//       if (!pincode || pincode.length !== 6 || !/^\d+$/.test(pincode)) {
//         setPincodeError("Please enter a valid 6-digit PIN code");
//         return false;
//       }

//       const response = await axios.get(`/api/states-details?pincode=${pincode}&action=lookup-pin`);
      
//       if (response.data.success) {
//         const data = response.data.data;
        
//         // Find state by name from our extracted states
//         const foundState = states.find(s => 
//           s.name.toLowerCase() === data.state.toLowerCase()
//         );
        
//         if (foundState) {
//           // Update form with found state
//           setForm(prev => ({ 
//             ...prev, 
//             state: foundState._id,
//             district: "",
//             taluka: ""
//           }));
          
//           // Wait a moment for state to update, then find district
//           setTimeout(() => {
//             const foundDistrict = districts.find(d => 
//               d.name.toLowerCase() === data.district.toLowerCase() && 
//               d.stateId === foundState._id
//             );
            
//             if (foundDistrict) {
//               setForm(prev => ({ 
//                 ...prev, 
//                 district: foundDistrict._id,
//                 taluka: ""
//               }));
              
//               // Find taluka
//               setTimeout(() => {
//                 const foundTaluka = talukas.find(t => 
//                   t.name.toLowerCase() === data.taluk.toLowerCase() && 
//                   t.district._id === foundDistrict._id
//                 );
                
//                 if (foundTaluka) {
//                   setForm(prev => ({ ...prev, taluka: foundTaluka._id }));
//                   toast.success(`Location found: ${data.state}, ${data.district}, ${data.taluk}`);
//                 } else {
//                   // Taluka not found in our data, but we still have state and district
//                   toast.success(`Location found: ${data.state}, ${data.district}`);
//                 }
//               }, 100);
//             } else {
//               toast.success(`Location found: ${data.state}`);
//             }
//           }, 100);
          
//           return true;
//         } else {
//           setPincodeError(`State "${data.state}" not found in our database`);
//           return false;
//         }
//       } else {
//         setPincodeError(response.data.error || "Failed to fetch PIN code details");
//         return false;
//       }
//     } catch (err: any) {
//       console.error("Error fetching PIN code details:", err);
//       setPincodeError(err.response?.data?.error || "Failed to fetch PIN code details");
//       return false;
//     } finally {
//       setPincodeLoading(false);
//     }
//   };

//   // Apply manual filters to data
//   const applyManualFilters = (data: SubAdmin[]): SubAdmin[] => {
//     let filtered = [...data];

//     if (stateFilter) {
//       const selectedState = states.find(s => s._id === stateFilter);
//       if (selectedState) {
//         filtered = filtered.filter(admin => 
//           admin.state?.toLowerCase() === selectedState.name.toLowerCase()
//         );
//       }
//     }

//     if (districtFilter) {
//       const selectedDistrict = districts.find(d => d._id === districtFilter);
//       if (selectedDistrict) {
//         filtered = filtered.filter(admin => 
//           admin.district?.toLowerCase() === selectedDistrict.name.toLowerCase()
//         );
//       }
//     }

//     if (talukaFilter) {
//       const selectedTaluka = talukas.find(t => t._id === talukaFilter);
//       if (selectedTaluka) {
//         filtered = filtered.filter(admin => 
//           admin.taluka?.toLowerCase() === selectedTaluka.name.toLowerCase()
//         );
//       }
//     }

//     if (search.trim()) {
//       const searchTerm = search.toLowerCase().trim();
//       filtered = filtered.filter(admin => 
//         admin.name?.toLowerCase().includes(searchTerm) ||
//         admin.email?.toLowerCase().includes(searchTerm) ||
//         admin.state?.toLowerCase().includes(searchTerm) ||
//         admin.district?.toLowerCase().includes(searchTerm) ||
//         admin.taluka?.toLowerCase().includes(searchTerm)
//       );
//     }

//     return filtered;
//   };

//   const createSubAdmin = async (adminData: any) => {
//     try {
//       const response = await axios.post<ApiResponse>("/api/admin", adminData);
//       return response.data;
//     } catch (err: any) {
//       console.error("Error creating sub-admin:", err);
//       throw new Error(err.response?.data?.message || "Failed to create sub-admin");
//     }
//   };

//   const updateSubAdmin = async (id: string, adminData: Partial<SubAdmin>) => {
//     try {
//       const response = await axios.put<ApiResponse>(`/api/admin/${id}`, adminData);
//       return response.data;
//     } catch (err: any) {
//       console.error("Error updating sub-admin:", err);
//       throw new Error(err.response?.data?.message || "Failed to update sub-admin");
//     }
//   };

//   const deleteSubAdminAPI = async (id: string) => {
//     try {
//       const response = await axios.delete<ApiResponse>(`/api/admin/${id}`);
//       return response.data;
//     } catch (err: any) {
//       console.error("Error deleting sub-admin:", err);
//       throw new Error(err.response?.data?.message || "Failed to delete sub-admin");
//     }
//   };

//   const restoreSubAdminAPI = async (id: string) => {
//     try {
//       const response = await axios.patch<ApiResponse>(`/api/admin/${id}/restore`);
//       return response.data;
//     } catch (err: any) {
//       console.error("Error restoring sub-admin:", err);
//       throw new Error(err.response?.data?.message || "Failed to restore sub-admin");
//     }
//   };

//   const permanentDeleteSubAdminAPI = async (id: string) => {
//     try {
//       const response = await axios.delete<ApiResponse>(`/api/admin/${id}/permanent`);
//       return response.data;
//     } catch (err: any) {
//       console.error("Error permanently deleting sub-admin:", err);
//       throw new Error(err.response?.data?.message || "Failed to permanently delete sub-admin");
//     }
//   };

//   /* ================= EFFECTS ================= */

//   useEffect(() => {
//     fetchSubAdmins(currentPage, "");
//     fetchAllLocations();
//     fetchCommodities();
//   }, [showDeleted]);

//   useEffect(() => {
//     const dynamicModules = getAllMenuModules();
//     setAllModules(dynamicModules);
//     setModules(["All", ...dynamicModules]);
//   }, []);

//   // Filter districts based on selected state (for form)
//   useEffect(() => {
//     if (form.state) {
//       const filtered = districts.filter(district => district.stateId === form.state);
//       setFilteredDistricts(filtered);
//       // Reset district and taluka when state changes
//       if (editing && !form.district) {
//         // Keep district if editing and district exists
//       } else {
//         setForm(prev => ({ ...prev, district: "", taluka: "" }));
//       }
//     } else {
//       setFilteredDistricts([]);
//     }
//   }, [form.state, districts]);

//   // Filter talukas based on selected district (for form)
//   useEffect(() => {
//     if (form.district) {
//       const selectedDistrict = districts.find(d => d._id === form.district);
//       const filtered = talukas.filter(taluka => {
//         return taluka.district?._id === form.district;
//       });
//       setFilteredTalukas(filtered);
//       // Reset taluka when district changes
//       if (editing && !form.taluka) {
//         // Keep taluka if editing and taluka exists
//       } else {
//         setForm(prev => ({ ...prev, taluka: "" }));
//       }
//     } else {
//       setFilteredTalukas([]);
//     }
//   }, [form.district, districts, talukas]);

//   // Filter districts based on selected state (for filter)
//   useEffect(() => {
//     if (stateFilter) {
//       const filtered = districts.filter(district => district.stateId === stateFilter);
//       setFilteredDistrictsForFilter(filtered);
//       setDistrictFilter("");
//       setTalukaFilter("");
//     } else {
//       setFilteredDistrictsForFilter([]);
//       setDistrictFilter("");
//       setTalukaFilter("");
//     }
//   }, [stateFilter, districts]);

//   // Filter talukas based on selected district (for filter)
//   useEffect(() => {
//     if (districtFilter) {
//       const selectedDistrict = districts.find(d => d._id === districtFilter);
//       const filtered = talukas.filter(taluka => {
//         return taluka.district?._id === districtFilter;
//       });
//       setFilteredTalukasForFilter(filtered);
//       setTalukaFilter("");
//     } else {
//       setFilteredTalukasForFilter([]);
//       setTalukaFilter("");
//     }
//   }, [districtFilter, districts, talukas]);

//   // Apply filters when filter states change
//   useEffect(() => {
//     if (allSubAdmins.length > 0) {
//       const filteredData = applyManualFilters(allSubAdmins);
//       setSubAdmins(filteredData);
//       setTotalAdmins(filteredData.length);
//       setTotalPages(Math.ceil(filteredData.length / rowsPerPage));
//       setCurrentPage(1);
//     }
//   }, [search, stateFilter, districtFilter, talukaFilter, allSubAdmins]);

//   // Handle pagination for filtered data
//   useEffect(() => {
//     if (allSubAdmins.length > 0) {
//       const filteredData = applyManualFilters(allSubAdmins);
//       const startIndex = (currentPage - 1) * rowsPerPage;
//       const endIndex = startIndex + rowsPerPage;
//       const paginatedData = filteredData.slice(startIndex, endIndex);
//       setSubAdmins(paginatedData);
//       setTotalAdmins(filteredData.length);
//       setTotalPages(Math.ceil(filteredData.length / rowsPerPage));
//     }
//   }, [currentPage, rowsPerPage, allSubAdmins]);

//   /* ================= VALIDATION ================= */

//   const validate = (): boolean => {
//     const e: Record<string, string> = {};
    
//     if (!form.name || !form.name.trim()) {
//       e.name = "Name is required";
//     }
    
//     if (!form.email || !form.email.trim()) {
//       e.email = "Email is required";
//     } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
//       e.email = "Invalid email format";
//     }
    
//     if (!editing) {
//       if (!form.password || !form.password.trim()) {
//         e.password = "Password is required";
//       } else if (form.password.length < 6) {
//         e.password = "Password must be at least 6 characters";
//       }
//     } else {
//       if (form.password && form.password.trim() && form.password.length < 6) {
//         e.password = "Password must be at least 6 characters";
//       }
//     }
    
//     if (form.pageAccess.length === 0) {
//       e.pageAccess = "Select at least one module";
//     }

//     if (!form.state) {
//       e.state = "State is required";
//     }

//     if (!form.district) {
//       e.district = "District is required";
//     }

//     if (!form.taluka) {
//       e.taluka = "Taluka is required";
//     }

//     if (form.commodity.length === 0) {
//       e.commodity = "Select at least one commodity";
//     }
    
//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   /* ================= CRUD OPERATIONS ================= */

//   const handleSave = async () => {
//     if (!validate()) return;

//     try {
//       let pageAccessToSave: string[];
      
//       if (form.pageAccess.includes("All")) {
//         pageAccessToSave = allModules;
//       } else {
//         pageAccessToSave = form.pageAccess;
//       }

//       const selectedState = states.find(s => s._id === form.state);
//       const selectedDistrict = districts.find(d => d._id === form.district);
//       const selectedTaluka = talukas.find(t => t._id === form.taluka);

//       const adminData: any = {
//         name: form.name.trim(),
//         email: form.email.trim(),
//         pageAccess: pageAccessToSave,
//         state: selectedState?.name || "",
//         district: selectedDistrict?.name || "",
//         taluka: selectedTaluka?.name || "",
//         commodity: form.commodity,
//         subCategories: form.subCategories,
//       };
      
//       if (form.password && form.password.trim()) {
//         adminData.password = form.password;
//       }

//       if (editing) {
//         await updateSubAdmin(editing._id, adminData);
//         toast.success("Sub-admin updated successfully!");
//       } else {
//         await createSubAdmin(adminData);
//         toast.success("Sub-admin created successfully!");
//       }
      
//       await fetchSubAdmins(currentPage, "");
//       reset();
//     } catch (err: any) {
//       toast.error(err.message || "Operation failed");
//     }
//   };

//   const handleDelete = async () => {
//     if (!selectedAdmin) return;
   
//     try {
//       await deleteSubAdminAPI(selectedAdmin._id);
//       toast.success("Sub-admin moved to trash successfully!");
//       setDeleteOpen(false);
//       await fetchSubAdmins(currentPage, "");
//     } catch (error: any) {
//       console.error("Error deleting sub-admin:", error);
//       toast.error(error.response?.data?.message || "Failed to delete sub-admin. Please try again.");
//     }
//   };

//   const handleRestore = async () => {
//     if (!adminToRestore) return;
   
//     try {
//       await restoreSubAdminAPI(adminToRestore._id);
//       toast.success("Sub-admin restored successfully!");
//       setRestoreOpen(false);
//       await fetchSubAdmins(currentPage, "");
//     } catch (error: any) {
//       console.error("Error restoring sub-admin:", error);
//       toast.error(error.response?.data?.message || "Failed to restore sub-admin. Please try again.");
//     }
//   };

//   const handlePermanentDelete = async () => {
//     if (!adminToDeletePermanently) return;
   
//     try {
//       await permanentDeleteSubAdminAPI(adminToDeletePermanently._id);
//       toast.success("Sub-admin permanently deleted!");
//       setPermanentDeleteOpen(false);
//       await fetchSubAdmins(currentPage, "");
//     } catch (error: any) {
//       console.error("Error permanently deleting sub-admin:", error);
//       toast.error(error.response?.data?.message || "Failed to permanently delete sub-admin. Please try again.");
//     }
//   };

//   /* ================= HELPER FUNCTIONS ================= */

//   const handleLookupPinCode = async () => {
//     if (!pincode) {
//       setPincodeError("Please enter a PIN code");
//       return;
//     }
    
//     const success = await fetchPinCodeDetails(pincode);
//     if (success) {
//       setPincode("");
//     }
//   };

//   const toggleCategory = (categoryId: string) => {
//     setExpandedCategories(prev => {
//       const newSet = new Set(prev);
//       if (newSet.has(categoryId)) {
//         newSet.delete(categoryId);
//       } else {
//         newSet.add(categoryId);
//       }
//       return newSet;
//     });
//   };

//   const handleCategoryCheckboxChange = (categoryId: string) => {
//     const category = commodityCategories.find(c => c._id === categoryId);
//     if (!category) return;

//     const allSubCategoryIds = category.subCategories.map(sub => sub.subCategoryName);
//     const allSelected = allSubCategoryIds.every(id => 
//       form.commodity.includes(`${category.categoryName}:${id}`)
//     );

//     if (allSelected) {
//       // Remove all subcategories of this category
//       setForm(prev => ({
//         ...prev,
//         commodity: prev.commodity.filter(item => !item.startsWith(`${category.categoryName}:`)),
//         subCategories: prev.subCategories.filter(item => !item.startsWith(`${category.categoryName}:`))
//       }));
//     } else {
//       // Add all subcategories of this category
//       const newCommodities = allSubCategoryIds.map(id => `${category.categoryName}:${id}`);
//       setForm(prev => ({
//         ...prev,
//         commodity: [...prev.commodity.filter(item => !item.startsWith(`${category.categoryName}:`)), ...newCommodities],
//         subCategories: [...prev.subCategories.filter(item => !item.startsWith(`${category.categoryName}:`)), ...newCommodities]
//       }));
//     }
//   };

//   const handleSubCategoryCheckboxChange = (categoryName: string, subCategoryName: string) => {
//     const fullId = `${categoryName}:${subCategoryName}`;
    
//     if (form.commodity.includes(fullId)) {
//       // Remove subcategory
//       setForm(prev => ({
//         ...prev,
//         commodity: prev.commodity.filter(item => item !== fullId),
//         subCategories: prev.subCategories.filter(item => item !== fullId)
//       }));
//     } else {
//       // Add subcategory
//       setForm(prev => ({
//         ...prev,
//         commodity: [...prev.commodity, fullId],
//         subCategories: [...prev.subCategories, fullId]
//       }));
//     }
//   };

//   const isCategoryChecked = (categoryId: string): boolean => {
//     const category = commodityCategories.find(c => c._id === categoryId);
//     if (!category) return false;

//     const allSubCategoryIds = category.subCategories.map(sub => sub.subCategoryName);
//     return allSubCategoryIds.length > 0 && allSubCategoryIds.every(id => 
//       form.commodity.includes(`${category.categoryName}:${id}`)
//     );
//   };

//   const isSubCategoryChecked = (categoryName: string, subCategoryName: string): boolean => {
//     return form.commodity.includes(`${categoryName}:${subCategoryName}`);
//   };

//   const loadAdminForEdit = (admin: SubAdmin) => {
//     setEditing(admin);
    
//     const displayModules: string[] = [];
    
//     admin.pageAccess.forEach(lowercaseModule => {
//       const displayModule = allModules.find(module => 
//         module.toLowerCase() === lowercaseModule.toLowerCase()
//       );
      
//       if (displayModule) {
//         displayModules.push(displayModule);
//       }
//     });
    
//     const hasAllModules = allModules.every(module => 
//       displayModules.includes(module)
//     );
    
//     // Find selected state by name from our extracted states
//     const selectedState = states.find(s => s.name.toLowerCase() === admin.state?.toLowerCase());
    
//     // Find selected district by name
//     const selectedDistrict = districts.find(d => 
//       d.name.toLowerCase() === admin.district?.toLowerCase() &&
//       d.stateName === admin.state
//     );
    
//     // Find selected taluka by name
//     const selectedTaluka = talukas.find(t => 
//       t.name.toLowerCase() === admin.taluka?.toLowerCase() &&
//       t.district.name === admin.district
//     );

//     setForm({
//       name: admin.name,
//       email: admin.email,
//       password: "",
//       pageAccess: hasAllModules ? ["All"] : displayModules,
//       state: selectedState?._id || "",
//       district: selectedDistrict?._id || "",
//       taluka: selectedTaluka?._id || "",
//       commodity: admin.commodity || [],
//       subCategories: admin.subCategories || [],
//     });
    
//     setOpen(true);
//   };

//   const handleAllCheckboxChange = () => {
//     if (form.pageAccess.includes("All")) {
//       setForm(p => ({
//         ...p,
//         pageAccess: [],
//       }));
//     } else {
//       setForm(p => ({
//         ...p,
//         pageAccess: ["All"],
//       }));
//     }
//   };

//   const handleModuleCheckboxChange = (module: string) => {
//     if (form.pageAccess.includes("All")) {
//       setForm(p => ({
//         ...p,
//         pageAccess: [module],
//       }));
//     } else if (form.pageAccess.includes(module)) {
//       setForm(p => ({
//         ...p,
//         pageAccess: p.pageAccess.filter(x => x !== module),
//       }));
//     } else {
//       setForm(p => ({
//         ...p,
//         pageAccess: [...p.pageAccess, module],
//       }));
//     }
//   };

//   const areAllModulesSelected = () => {
//     return form.pageAccess.includes("All") || 
//            (allModules.length > 0 && allModules.every(module => 
//              form.pageAccess.includes(module)
//            ));
//   };

//   const toggleDeletedView = () => {
//     setShowDeleted(!showDeleted);
//     setCurrentPage(1);
//     setStateFilter("");
//     setDistrictFilter("");
//     setTalukaFilter("");
//     setSearch("");
//   };

//   const reset = () => {
//     setOpen(false);
//     setEditing(null);
//     setSelectedAdmin(null);
//     setAdminToRestore(null);
//     setAdminToDeletePermanently(null);
//     setViewOpen(false);
//     setForm({ 
//       name: "", 
//       email: "", 
//       password: "", 
//       pageAccess: [],
//       state: "",
//       district: "",
//       taluka: "",
//       commodity: [],
//       subCategories: []
//     });
//     setErrors({});
//     setPincode("");
//     setPincodeError("");
//   };

//   const handleResetFilters = () => {
//     setSearch("");
//     setStateFilter("");
//     setDistrictFilter("");
//     setTalukaFilter("");
//     setCurrentPage(1);
//     fetchSubAdmins(1, "");
//     setRowsPerPage(10);
//     setShowDeleted(false);
//   };

//   // Get current page data
//   const getCurrentPageData = () => {
//     const startIndex = (currentPage - 1) * rowsPerPage;
//     const endIndex = startIndex + rowsPerPage;
//     return subAdmins.slice(startIndex, endIndex);
//   };

//   /* ================= EXPORT FUNCTIONS ================= */

//   const exportData = subAdmins.map(({ _id, createdAt, updatedAt, password, ...rest }) => ({
//     ...rest,
//     password: "********",
//     state: rest.state || "",
//     district: rest.district || "",
//     taluka: rest.taluka || "",
//     commodity: rest.commodity?.join(", ") || "",
//   }));

//   const handlePrint = () => {
//     const currentPageData = getCurrentPageData();
//     if (currentPageData.length === 0) {
//       toast.error("No sub-admins to print");
//       return;
//     }

//     const printWindow = window.open('', '_blank', 'width=900,height=700');
//     if (!printWindow) {
//       toast.error("Please allow popups to print");
//       return;
//     }

//     const printDate = new Date().toLocaleDateString();
//     const printTime = new Date().toLocaleTimeString();
    
//     let filterInfo = "";
//     if (stateFilter) {
//       const state = states.find(s => s._id === stateFilter);
//       filterInfo += `State: ${state?.name || ''} | `;
//     }
//     if (districtFilter) {
//       const district = districts.find(d => d._id === districtFilter);
//       filterInfo += `District: ${district?.name || ''} | `;
//     }
//     if (talukaFilter) {
//       const taluka = talukas.find(t => t._id === talukaFilter);
//       filterInfo += `Taluka: ${taluka?.name || ''} | `;
//     }
//     if (search) {
//       filterInfo += `Search: "${search}" | `;
//     }
//     if (filterInfo) {
//       filterInfo = filterInfo.slice(0, -3);
//     }
    
//     const printContent = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>Sub-Admins Report</title>
//         <style>
//           body {
//             font-family: Arial, sans-serif;
//             margin: 20px;
//             color: #333;
//           }
//           .header {
//             text-align: center;
//             margin-bottom: 30px;
//             padding-bottom: 15px;
//             border-bottom: 2px solid #4CAF50;
//           }
//           .header h1 {
//             margin: 0 0 10px 0;
//             color: #1f2937;
//             font-size: 24px;
//           }
//           .header-info {
//             color: #6b7280;
//             font-size: 14px;
//             margin: 5px 0;
//           }
//           .filter-info {
//             background-color: #f3f4f6;
//             padding: 10px;
//             border-radius: 5px;
//             margin-bottom: 20px;
//             font-size: 13px;
//             border-left: 4px solid #4CAF50;
//           }
//           table {
//             width: 100%;
//             border-collapse: collapse;
//             margin-top: 20px;
//             font-size: 12px;
//           }
//           th {
//             background-color: #f3f4f6;
//             color: #374151;
//             font-weight: 600;
//             padding: 12px 8px;
//             text-align: left;
//             border: 1px solid #d1d5db;
//           }
//           td {
//             padding: 10px 8px;
//             border: 1px solid #e5e7eb;
//             vertical-align: top;
//           }
//           tr:nth-child(even) {
//             background-color: #f9fafb;
//           }
//           .footer {
//             margin-top: 40px;
//             padding-top: 20px;
//             border-top: 1px solid #e5e7eb;
//             font-size: 12px;
//             color: #6b7280;
//             text-align: center;
//           }
//           @media print {
//             @page {
//               margin: 0.5in;
//             }
//             body {
//               margin: 0;
//               -webkit-print-color-adjust: exact;
//             }
//           }
//         </style>
//       </head>
//       <body>
//         <div class="header">
//           <h1>👨‍💼 Sub-Admins Management Report</h1>
//           <div class="header-info">Generated on: ${printDate} at ${printTime}</div>
//           <div class="header-info">Total Sub-Admins: ${subAdmins.length} | Showing: ${currentPageData.length} sub-admins</div>
//           <div class="header-info">Page: ${currentPage} of ${totalPages}</div>
//           ${filterInfo ? `<div class="filter-info"><strong>Filters Applied:</strong> ${filterInfo}</div>` : ''}
//         </div>
        
//         <table>
//           <thead>
//             <tr>
//               <th>Sr.</th>
//               <th>Name</th>
//               <th>Email</th>
//               <th>Password</th>
//               <th>State</th>
//               <th>District</th>
//               <th>Taluka</th>
//               <th>Commodities</th>
//               <th>Access Modules</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${currentPageData.map((admin, index) => `
//               <tr>
//                 <td>${index + 1 + (currentPage - 1) * rowsPerPage}</td>
//                 <td><strong>${admin.name}</strong></td>
//                 <td>${admin.email}</td>
//                 <td>********</td>
//                 <td>${admin.state || '-'}</td>
//                 <td>${admin.district || '-'}</td>
//                 <td>${admin.taluka || '-'}</td>
//                 <td>${admin.commodity?.join(', ') || '-'}</td>
//                 <td>${admin.pageAccess.join(', ')}</td>
//                 <td>${admin.isDeleted ? 'Deleted' : 'Active'}</td>
//               </tr>
//             `).join('')}
//           </tbody>
//         </table>
        
//         <div class="footer">
//           <p>Printed from Kissan Partner System | ${window.location.hostname}</p>
//           <p>© ${new Date().getFullYear()} Kissan Partner. All rights reserved.</p>
//         </div>
        
//         <script>
//           window.onload = function() {
//             window.print();
//             setTimeout(() => {
//               if (confirm('Close print window?')) {
//                 window.close();
//               }
//             }, 100);
//           };
//         </script>
//       </body>
//       </html>
//     `;

//     printWindow.document.write(printContent);
//     printWindow.document.close();
//   };

//   const handleCopy = async (): Promise<void> => {
//     const currentPageData = getCurrentPageData();
//     if (currentPageData.length === 0) {
//       toast.error("No sub-admins to copy");
//       return;
//     }

//     const headers = ["Sr.", "Name", "Email", "Password", "State", "District", "Taluka", "Commodity", "Page Access", "Status"];
    
//     const colWidths = [6, 20, 25, 10, 15, 15, 15, 20, 25, 12];
    
//     const createSeparator = (): string => {
//       const totalWidth = colWidths.reduce((sum, width) => sum + width + 3, -3);
//       return "─".repeat(Math.min(totalWidth, 150));
//     };
    
//     const formatRow = (admin: any, index: number): string => {
//       const rowNum = index + 1 + (currentPage - 1) * rowsPerPage;
      
//       const commodity = admin.commodity?.join(', ') || '-';
//       const trimmedCommodity = commodity.length > 17 ? commodity.substring(0, 14) + '...' : commodity;
      
//       const pageAccess = admin.pageAccess?.join(', ') || '-';
//       const trimmedAccess = pageAccess.length > 22 ? pageAccess.substring(0, 19) + '...' : pageAccess;
      
//       const values = [
//         rowNum.toString(),
//         admin.name || '-',
//         admin.email || '-',
//         '********',
//         admin.state || '-',
//         admin.district || '-',
//         admin.taluka || '-',
//         trimmedCommodity,
//         trimmedAccess,
//         admin.isDeleted ? '❌ Deleted' : '✅ Active'
//       ];
      
//       return values.map((val, i) => val.padEnd(colWidths[i])).join(" │ ");
//     };
    
//     const formatHeader = (): string => {
//       return headers.map((header, i) => header.padEnd(colWidths[i])).join(" │ ");
//     };
    
//     const tableContent = [
//       `📋 SUB-ADMINS LIST - Page ${currentPage}`,
//       createSeparator(),
//       formatHeader(),
//       createSeparator(),
//       ...currentPageData.map((admin, index) => formatRow(admin, index)),
//       createSeparator(),
//       "",
//       "📊 SUMMARY",
//       `• Current Page: ${currentPage}`,
//       `• Records on Page: ${currentPageData.length}`,
//       `• Active: ${currentPageData.filter(a => !a.isDeleted).length}`,
//       `• Deleted: ${currentPageData.filter(a => a.isDeleted).length}`,
//       `• Generated: ${new Date().toLocaleString()}`,
//       "",
//       "📝 Note: Data copied from current page view",
//       "    Use pagination to copy other pages"
//     ].join("\n");
    
//     try {
//       await navigator.clipboard.writeText(tableContent);
//       toast.success(`Copied ${currentPageData.length} sub-admins to clipboard!`);
//     } catch (err) {
//       console.error("Failed to copy:", err);
//       toast.error("Failed to copy to clipboard");
//     }
//   };

//   const handleExcel = () => {
//     const currentPageData = getCurrentPageData();
//     if (currentPageData.length === 0) {
//       toast.error("No sub-admins to export");
//       return;
//     }

//     try {
//       const exportData = currentPageData.map(({ _id, createdAt, updatedAt, password, ...rest }) => ({
//         ...rest,
//         password: "********",
//         state: rest.state || "",
//         district: rest.district || "",
//         taluka: rest.taluka || "",
//         commodity: rest.commodity?.join(", ") || "",
//       }));

//       const ws = XLSX.utils.json_to_sheet(exportData);
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, "Sub-Admins");
//       XLSX.writeFile(wb, `sub-admins-${new Date().toISOString().split('T')[0]}.xlsx`);
//       toast.success("Excel file exported successfully!");
//     } catch (err) {
//       toast.error("Failed to export Excel file");
//     }
//   };

//   const handleCSV = () => {
//     const currentPageData = getCurrentPageData();
//     if (currentPageData.length === 0) {
//       toast.error("No sub-admins to export");
//       return;
//     }

//     try {
//       const exportData = currentPageData.map(({ _id, createdAt, updatedAt, password, ...rest }) => ({
//         ...rest,
//         password: "********",
//         state: rest.state || "",
//         district: rest.district || "",
//         taluka: rest.taluka || "",
//         commodity: rest.commodity?.join(", ") || "",
//       }));

//       const ws = XLSX.utils.json_to_sheet(exportData);
//       const csv = XLSX.utils.sheet_to_csv(ws);
//       const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//       const a = document.createElement("a");
//       a.href = URL.createObjectURL(blob);
//       a.download = `sub-admins-${new Date().toISOString().split('T')[0]}.csv`;
//       a.click();
//       toast.success("CSV file exported successfully!");
//     } catch (err) {
//       toast.error("Failed to export CSV file");
//     }
//   };

//   const handlePDF = () => {
//     const currentPageData = getCurrentPageData();
//     if (currentPageData.length === 0) {
//       toast.error("No sub-admins to export");
//       return;
//     }

//     try {
//       const doc = new jsPDF();
//       doc.text("Sub-Admins Management Report", 14, 16);
      
//       let filterText = "";
//       if (stateFilter) {
//         const state = states.find(s => s._id === stateFilter);
//         filterText += `State: ${state?.name || ''} | `;
//       }
//       if (districtFilter) {
//         const district = districts.find(d => d._id === districtFilter);
//         filterText += `District: ${district?.name || ''} | `;
//       }
//       if (talukaFilter) {
//         const taluka = talukas.find(t => t._id === talukaFilter);
//         filterText += `Taluka: ${taluka?.name || ''} | `;
//       }
//       if (search) {
//         filterText += `Search: "${search}" | `;
//       }
//       if (filterText) {
//         filterText = filterText.slice(0, -3);
//         doc.text(`Filters: ${filterText}`, 14, 24);
//       }
      
//       const tableColumn = ["Sr.", "Name", "Email", "State", "District", "Taluka", "Commodities", "Access Modules", "Status"];
//       const tableRows: any = currentPageData.map((admin, index) => [
//         index + 1 + (currentPage - 1) * rowsPerPage,
//         admin.name,
//         admin.email,
//         admin.state || '-',
//         admin.district || '-',
//         admin.taluka || '-',
//         admin.commodity?.join(', ') || '-',
//         admin.pageAccess.join(', '),
//         admin.isDeleted ? 'Deleted' : 'Active'
//       ]);
      
//       autoTable(doc, {
//         head: [tableColumn],
//         body: tableRows,
//         startY: filterText ? 30 : 20,
//         styles: { fontSize: 8 },
//         headStyles: { fillColor: [76, 175, 80] },
//       });
      
//       doc.save(`sub-admins-${new Date().toISOString().split('T')[0]}.pdf`);
//       toast.success("PDF file exported successfully!");
//     } catch (err) {
//       toast.error("Failed to export PDF file");
//     }
//   };

//   /* ================= UI ================= */

//   const currentPageData = getCurrentPageData();

//   return (
//     <div className="p-[.6rem] relative text-black text-sm md:p-1 overflow-x-auto min-h-screen">
//       {loading && (
//         <div className="min-h-screen absolute w-full top-0 left-0 bg-[#e9e7e773] z-[100] flex items-center justify-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
//         </div>
//       )}

//       {/* Header Section */}
//       <div className="mb-6 flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl md:text-2xl font-bold text-gray-800">
//             {showDeleted ? "Deleted Sub-Admins" : "Sub-Admin Accounts"}
//           </h1>
//           <p className="text-gray-600 mt-2">
//             {showDeleted 
//               ? "View, restore or permanently delete sub-admin accounts" 
//               : `Overview and management of all sub-admin accounts. ${subAdmins.length} sub-admins found.`}
//           </p>
//         </div>
//       </div>

//       {/* Export Buttons Section */}
//       <div className="lg:hidden flex flex-wrap gap-[.6rem] text-sm bg-white p-[.6rem] shadow">
//         {[
//           { label: "Copy", icon: FaCopy, onClick: handleCopy, color: "bg-gray-100 hover:bg-gray-200 text-gray-800" },
//           { label: "Excel", icon: FaFileExcel, onClick: handleExcel, color: "bg-green-100 hover:bg-green-200 text-green-800" },
//           { label: "CSV", icon: FaFileCsv, onClick: handleCSV, color: "bg-blue-100 hover:bg-blue-200 text-blue-800" },
//           { label: "PDF", icon: FaFilePdf, onClick: handlePDF, color: "bg-red-100 hover:bg-red-200 text-red-800" },
//           { label: "Print", icon: FaPrint, onClick: handlePrint, color: "bg-purple-100 hover:bg-purple-200 text-purple-800" },
//         ].map((btn, i) => (
//           <button
//             key={i}
//             onClick={btn.onClick}
//             className={`flex items-center gap-[.6rem] text-sm px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md ${btn.color} font-medium`}
//           >
//             <btn.icon className="text-sm" />
//           </button>
//         ))}
//       </div>

//       {/* Filters Section */}
//       <div className="bg-white rounded lg:rounded-none shadow p-[.4rem] text-sm mb-2">
//         <div className="gap-[.6rem] text-sm items-end flex flex-wrap md:flex-row flex-col md:*:w-fit *:w-full">
//           {/* Search Input */}
//           <div className="md:col-span-3">
//             <div className="relative">
//               <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search by name, email..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
//               />
//             </div>
//           </div>

//           {/* State Filter */}
//           <div className="md:col-span-2">
//             <label className="block text-xs text-gray-500 mb-1">State</label>
//             <select
//               value={stateFilter}
//               onChange={(e) => setStateFilter(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
//             >
//               <option value="">All States</option>
//               {states.map(state => (
//                 <option key={state._id} value={state._id}>
//                   {state.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* District Filter */}
//           <div className="md:col-span-2">
//             <label className="block text-xs text-gray-500 mb-1">District</label>
//             <select
//               value={districtFilter}
//               onChange={(e) => setDistrictFilter(e.target.value)}
//               disabled={!stateFilter}
//               className={`w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all ${
//                 !stateFilter ? 'bg-gray-100' : ''
//               }`}
//             >
//               <option value="">All Districts</option>
//               {filteredDistrictsForFilter.map(district => (
//                 <option key={district._id} value={district._id}>
//                   {district.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Taluka Filter */}
//           <div className="md:col-span-2">
//             <label className="block text-xs text-gray-500 mb-1">Taluka</label>
//             <select
//               value={talukaFilter}
//               onChange={(e) => setTalukaFilter(e.target.value)}
//               disabled={!districtFilter}
//               className={`w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all ${
//                 !districtFilter ? 'bg-gray-100' : ''
//               }`}
//             >
//               <option value="">All Talukas</option>
//               {filteredTalukasForFilter.map(taluka => (
//                 <option key={taluka._id} value={taluka._id}>
//                   {taluka.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Show Deleted/Active Toggle */}
//           <div className="md:col-span-2">
//             <label className="block text-xs text-gray-500 mb-1">Status</label>
//             <button
//               onClick={toggleDeletedView}
//               className={`w-full px-4 py-2 rounded transition-colors font-medium flex items-center justify-center gap-2 ${
//                 showDeleted 
//                   ? "bg-yellow-500 text-white hover:bg-yellow-600" 
//                   : "bg-gray-200 text-gray-800 hover:bg-gray-300"
//               }`}
//             >
//               <FaHistory /> {showDeleted ? "Show Active" : "Show Deleted"}
//             </button>
//           </div>

//           {/* Add New Button */}
//           {!showDeleted && (
//             <div className="md:col-span-2">
//               <label className="block text-xs text-gray-500 mb-1">&nbsp;</label>
//               <button
//                 onClick={() => setOpen(true)}
//                 className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors font-medium flex items-center justify-center gap-2"
//               >
//                 <FaPlus /> Add New
//               </button>
//             </div>
//           )}

//           {/* Reset Button */}
//           <div className="md:col-span-2">
//             <label className="block text-xs text-gray-500 mb-1">&nbsp;</label>
//             <button
//               onClick={handleResetFilters}
//               className="w-full px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2"
//             >
//               <FaRedo /> Reset
//             </button>
//           </div>

//           {/* Desktop Export Buttons */}
//           <div className="lg:flex hidden ml-auto flex-wrap gap-[.6rem] text-sm">
//             {[
//               { label: "Copy", icon: FaCopy, onClick: handleCopy, color: "bg-gray-100 hover:bg-gray-200 text-gray-800" },
//               { label: "Excel", icon: FaFileExcel, onClick: handleExcel, color: "bg-green-100 hover:bg-green-200 text-green-800" },
//               { label: "CSV", icon: FaFileCsv, onClick: handleCSV, color: "bg-blue-100 hover:bg-blue-200 text-blue-800" },
//               { label: "PDF", icon: FaFilePdf, onClick: handlePDF, color: "bg-red-100 hover:bg-red-200 text-red-800" },
//               { label: "Print", icon: FaPrint, onClick: handlePrint, color: "bg-purple-100 hover:bg-purple-200 text-purple-800" },
//             ].map((btn, i) => (
//               <button
//                 key={i}
//                 onClick={btn.onClick}
//                 className={`flex items-center gap-[.6rem] text-sm px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md ${btn.color} font-medium`}
//               >
//                 <btn.icon className="text-sm" />
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Error Message */}
//       {error && (
//         <div className="mb-4 p-3 bg-red-50 text-red-600 rounded border border-red-200">
//           {error}
//         </div>
//       )}

//       {/* Desktop Table */}
//       {!loading && currentPageData.length > 0 && (
//         <>
//           <div className="hidden lg:block bg-white rounded shadow">
//             <table className="min-w-full">
//               <thead className="border-b border-zinc-200">
//                 <tr className="*:text-zinc-800">
//                   <th className="p-[.6rem] text-sm text-left font-semibold">Sr.</th>
//                   <th className="p-[.6rem] text-sm text-left font-semibold">Name</th>
//                   <th className="p-[.6rem] text-sm text-left font-semibold">Email</th>
//                   <th className="p-[.6rem] text-sm text-left font-semibold">State</th>
//                   <th className="p-[.6rem] text-sm text-left font-semibold">District</th>
//                   <th className="p-[.6rem] text-sm text-left font-semibold">Taluka</th>
//                   <th className="p-[.6rem] text-sm text-left font-semibold">Commodities</th>
//                   <th className="p-[.6rem] text-sm text-left font-semibold">Access Modules</th>
//                   <th className="p-[.6rem] text-sm text-left font-semibold">Status</th>
//                   <th className="p-[.6rem] text-sm text-left font-semibold">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100">
//                 {currentPageData.map((admin, index) => (
//                   <tr 
//                     key={admin._id} 
//                     className={`hover:bg-gray-50 transition-colors ${admin.isDeleted ? 'bg-red-50' : ''}`}
//                   >
//                     <td className="p-[.6rem] text-sm text-center">
//                       {index + 1 + (currentPage - 1) * rowsPerPage}
//                     </td>
//                     <td className="p-[.6rem] text-sm">
//                       <div className="font-semibold">{admin.name}</div>
//                       {admin.isDeleted && (
//                         <div className="text-xs text-red-500">(Deleted)</div>
//                       )}
//                     </td>
//                     <td className="p-[.6rem] text-sm">{admin.email}</td>
//                     <td className="p-[.6rem] text-sm">{admin.state || '-'}</td>
//                     <td className="p-[.6rem] text-sm">{admin.district || '-'}</td>
//                     <td className="p-[.6rem] text-sm">{admin.taluka || '-'}</td>
//                     <td className="p-[.6rem] text-sm">
//                       <div className="flex flex-wrap gap-1">
//                         {admin.commodity?.map((commodity, idx) => (
//                           <span 
//                             key={idx} 
//                             className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded text-xs"
//                           >
//                             {commodity.split(':')[1] || commodity}
//                           </span>
//                         )) || '-'}
//                       </div>
//                     </td>
//                     <td className="p-[.6rem] text-sm">
//                       <div className="flex flex-wrap gap-1">
//                         {admin.pageAccess.map(module => (
//                           <span 
//                             key={module} 
//                             className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs"
//                           >
//                             {module}
//                           </span>
//                         ))}
//                       </div>
//                     </td>
//                     <td className="p-[.6rem] text-sm">
//                       <span className={`px-2 py-1 rounded text-xs ${
//                         admin.isDeleted 
//                           ? 'bg-red-100 text-red-800' 
//                           : 'bg-green-100 text-green-800'
//                       }`}>
//                         {admin.isDeleted ? 'Deleted' : 'Active'}
//                       </span>
//                     </td>
//                     <td className="p-[.6rem] text-sm">
//                       <div className="flex gap-[.6rem] text-sm">
//                         <button
//                           onClick={() => { setSelectedAdmin(admin); setViewOpen(true); }}
//                           className="p-[.6rem] text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
//                           title="View Details"
//                         >
//                           <FaEye />
//                         </button>
                        
//                         {!admin.isDeleted && (
//                           <button
//                             onClick={() => loadAdminForEdit(admin)}
//                             className="p-[.6rem] text-sm text-green-600 hover:bg-green-50 rounded transition-colors"
//                             title="Edit"
//                           >
//                             <FaEdit />
//                           </button>
//                         )}
                        
//                         {admin.isDeleted ? (
//                           <>
//                             <button
//                               onClick={() => { setAdminToRestore(admin); setRestoreOpen(true); }}
//                               className="p-[.6rem] text-sm text-green-600 hover:bg-green-50 rounded transition-colors"
//                               title="Restore"
//                             >
//                               <FaTrashRestore />
//                             </button>
//                             <button
//                               onClick={() => { setAdminToDeletePermanently(admin); setPermanentDeleteOpen(true); }}
//                               className="p-[.6rem] text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
//                               title="Delete Permanently"
//                             >
//                               <FaTrashAlt />
//                             </button>
//                           </>
//                         ) : (
//                           <button
//                             onClick={() => { setSelectedAdmin(admin); setDeleteOpen(true); }}
//                             className="p-[.6rem] text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
//                             title="Move to Trash"
//                           >
//                             <FaTrash />
//                           </button>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Mobile Cards */}
//           <div className="lg:hidden space-y-2 p-[.2rem] text-sm">
//             {currentPageData.map((admin, index) => (
//               <div 
//                 key={admin._id} 
//                 className={`rounded p-[.6rem] text-sm border border-zinc-200 shadow ${
//                   admin.isDeleted ? 'bg-red-50' : 'bg-white'
//                 }`}
//               >
//                 <div className="flex justify-between items-start mb-3">
//                   <div>
//                     <div className="font-bold text-gray-800">{admin.name}</div>
//                     <div className="text-xs text-gray-500">
//                       Sr. {index + 1 + (currentPage - 1) * rowsPerPage}
//                       {admin.isDeleted && (
//                         <span className="ml-2 text-red-500">(Deleted)</span>
//                       )}
//                     </div>
//                   </div>
//                   <div className="flex gap-[.6rem] text-sm">
//                     <button onClick={() => { setSelectedAdmin(admin); setViewOpen(true); }} className="p-1.5 text-blue-600">
//                       <FaEye />
//                     </button>
//                     {!admin.isDeleted && (
//                       <button onClick={() => loadAdminForEdit(admin)} className="p-1.5 text-green-600">
//                         <FaEdit />
//                       </button>
//                     )}
//                     {admin.isDeleted ? (
//                       <>
//                         <button onClick={() => { setAdminToRestore(admin); setRestoreOpen(true); }} className="p-1.5 text-green-600">
//                           <FaTrashRestore />
//                         </button>
//                         <button onClick={() => { setAdminToDeletePermanently(admin); setPermanentDeleteOpen(true); }} className="p-1.5 text-red-600">
//                           <FaTrashAlt />
//                         </button>
//                       </>
//                     ) : (
//                       <button onClick={() => { setSelectedAdmin(admin); setDeleteOpen(true); }} className="p-1.5 text-red-600">
//                         <FaTrash />
//                       </button>
//                     )}
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <div>
//                     <div className="text-sm text-gray-500">Email</div>
//                     <div className="text-sm">{admin.email}</div>
//                   </div>
//                   <div>
//                     <div className="text-sm text-gray-500">State</div>
//                     <div className="text-sm">{admin.state || '-'}</div>
//                   </div>
//                   <div>
//                     <div className="text-sm text-gray-500">District</div>
//                     <div className="text-sm">{admin.district || '-'}</div>
//                   </div>
//                   <div>
//                     <div className="text-sm text-gray-500">Taluka</div>
//                     <div className="text-sm">{admin.taluka || '-'}</div>
//                   </div>
//                   <div>
//                     <div className="text-sm text-gray-500">Commodities</div>
//                     <div className="flex flex-wrap gap-1 mt-1">
//                       {admin.commodity?.map((commodity, idx) => (
//                         <span 
//                           key={idx} 
//                           className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded text-xs"
//                         >
//                           {commodity.split(':')[1] || commodity}
//                         </span>
//                       )) || '-'}
//                     </div>
//                   </div>
//                   <div>
//                     <div className="text-sm text-gray-500">Access Modules</div>
//                     <div className="flex flex-wrap gap-1 mt-1">
//                       {admin.pageAccess.map(module => (
//                         <span 
//                           key={module} 
//                           className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs"
//                         >
//                           {module}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                   <div>
//                     <div className="text-sm text-gray-500">Status</div>
//                     <span className={`px-2 py-1 rounded text-xs ${
//                       admin.isDeleted 
//                         ? 'bg-red-100 text-red-800' 
//                         : 'bg-green-100 text-green-800'
//                     }`}>
//                       {admin.isDeleted ? 'Deleted' : 'Active'}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </>
//       )}

//       {/* Empty State */}
//       {!loading && currentPageData.length === 0 && (
//         <div className="text-center py-12">
//           <div className="text-gray-400 text-6xl mb-4">
//             {showDeleted ? '🗑️' : '👨‍💼'}
//           </div>
//           <h3 className="text-xl font-semibold mb-2">
//             {showDeleted ? 'No deleted sub-admins found' : 'No sub-admins found'}
//           </h3>
//           <p className="text-gray-500">
//             {showDeleted 
//               ? 'All deleted sub-admins have been restored or permanently deleted.' 
//               : 'Try adjusting your search or add a new sub-admin'}
//           </p>
//           {!showDeleted && (
//             <button
//               onClick={() => setOpen(true)}
//               className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
//             >
//               Add New Sub-Admin
//             </button>
//           )}
//         </div>
//       )}

//       {/* Pagination */}
//       {!loading && subAdmins.length > 0 && (
//         <div className="flex flex-col bg-white sm:flex-row p-3 shadow justify-between items-center gap-[.6rem] text-sm">
//           <div className="text-gray-600">
//             Showing <span className="font-semibold">{1 + (currentPage - 1) * rowsPerPage}-{Math.min(currentPage * rowsPerPage, subAdmins.length)}</span> of{" "}
//             <span className="font-semibold">{subAdmins.length}</span> sub-admins
//             <select
//               value={rowsPerPage}
//               onChange={(e) => setRowsPerPage(Number(e.target.value))}
//               className="p-1 ml-3 border border-zinc-300 rounded"
//             >
//               {[5, 10, 20, 50, 100].map((option) => (
//                 <option key={option} value={option}>
//                   {option}
//                 </option>
//               ))}
//             </select>
//           </div>
          
//           <div className="flex items-center gap-4">
//             <div className="text-sm text-gray-600">
//               Page {currentPage} of {totalPages}
//             </div>
//             <Pagination
//               count={totalPages}
//               page={currentPage}
//               onChange={(_, value) => setCurrentPage(value)}
//               color="primary"
//               shape="rounded"
//               showFirstButton
//               showLastButton
//               siblingCount={1}
//               boundaryCount={1}
//             />
//           </div>
//         </div>
//       )}

//       {/* ADD/EDIT MODAL */}
//       {open && (
//         <Modal 
//           title={editing ? "Edit Sub-Admin" : "Add New Sub-Admin"} 
//           onClose={reset}
//         >
//           <div className="max-h-[70vh] overflow-y-auto pr-2">
//             <Input 
//               label="Name" 
//               value={form.name} 
//               error={errors.name} 
//               onChange={v => setForm(p => ({ ...p, name: v }))} 
//               placeholder="Enter full name"
//               required
//             />
            
//             <Input 
//               label="Email" 
//               type="email"
//               value={form.email} 
//               error={errors.email} 
//               onChange={v => setForm(p => ({ ...p, email: v }))} 
//               placeholder="Enter email address"
//               required
//             />
            
//             <Input 
//               label="Password" 
//               type="password"
//               value={form.password} 
//               error={errors.password} 
//               onChange={v => setForm(p => ({ ...p, password: v }))} 
//               placeholder={editing ? "Leave blank to keep current password" : "Enter password (min 6 characters)"}
//               required={!editing}
//             />

//             {/* PIN Code Lookup Section */}
//             <div className="mb-6 p-4 bg-blue-50 rounded border border-blue-200">
//               <div className="flex items-center gap-2 mb-2">
//                 <FaMapMarkerAlt className="text-blue-600" />
//                 <h3 className="text-sm font-semibold text-blue-800">Quick Fill from PIN Code</h3>
//               </div>
//               <div className="flex gap-2">
//                 <div className="flex-1">
//                   <input
//                     type="text"
//                     value={pincode}
//                     onChange={(e) => {
//                       const value = e.target.value.replace(/\D/g, '').slice(0, 6);
//                       setPincode(value);
//                       if (pincodeError) setPincodeError("");
//                     }}
//                     placeholder="Enter 6-digit PIN code"
//                     className={`border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                       pincodeError ? "border-red-500" : "border-gray-300"
//                     }`}
//                   />
//                   {pincodeError && <p className="text-red-500 text-xs mt-1">{pincodeError}</p>}
//                 </div>
//                 <button
//                   onClick={handleLookupPinCode}
//                   disabled={pincodeLoading || pincode.length !== 6}
//                   className={`px-4 py-2 rounded font-medium flex items-center gap-2 ${
//                     pincodeLoading || pincode.length !== 6
//                       ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                       : "bg-blue-500 text-white hover:bg-blue-600"
//                   }`}
//                 >
//                   {pincodeLoading ? "Looking up..." : "Lookup"}
//                 </button>
//               </div>
//               <p className="text-xs text-blue-600 mt-2">
//                 Enter a PIN code to automatically fill State, District, and Taluka fields
//               </p>
//             </div>

//             {/* State Dropdown */}
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 State <span className="text-red-500">*</span>
//               </label>
//               <select
//                 value={form.state}
//                 onChange={(e) => setForm(p => ({ ...p, state: e.target.value, district: "", taluka: "" }))}
//                 className={`border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-500 ${
//                   errors.state ? "border-red-500" : "border-gray-300"
//                 }`}
//               >
//                 <option value="">Select State</option>
//                 {states.map(state => (
//                   <option key={state._id} value={state._id}>
//                     {state.name}
//                   </option>
//                 ))}
//               </select>
//               {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
//             </div>

//             {/* District Dropdown */}
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 District <span className="text-red-500">*</span>
//               </label>
//               <select
//                 value={form.district}
//                 onChange={(e) => setForm(p => ({ ...p, district: e.target.value, taluka: "" }))}
//                 disabled={!form.state}
//                 className={`border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-500 ${
//                   errors.district ? "border-red-500" : "border-gray-300"
//                 } ${!form.state ? "bg-gray-100" : ""}`}
//               >
//                 <option value="">Select District</option>
//                 {filteredDistricts.map(district => (
//                   <option key={district._id} value={district._id}>
//                     {district.name}
//                   </option>
//                 ))}
//               </select>
//               {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district}</p>}
//             </div>

//             {/* Taluka Dropdown */}
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Taluka <span className="text-red-500">*</span>
//               </label>
//               <select
//                 value={form.taluka}
//                 onChange={(e) => setForm(p => ({ ...p, taluka: e.target.value }))}
//                 disabled={!form.district}
//                 className={`border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-500 ${
//                   errors.taluka ? "border-red-500" : "border-gray-300"
//                 } ${!form.district ? "bg-gray-100" : ""}`}
//               >
//                 <option value="">Select Taluka</option>
//                 {filteredTalukas.map(taluka => (
//                   <option key={taluka._id} value={taluka._id}>
//                     {taluka.name}
//                   </option>
//                 ))}
//               </select>
//               {errors.taluka && <p className="text-red-500 text-xs mt-1">{errors.taluka}</p>}
//             </div>

//             {/* Commodities Checkboxes */}
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Select Commodities <span className="text-red-500">*</span>
//               </label>
//               <div className="border rounded p-3 max-h-60 overflow-y-auto">
//                 {commodityCategories.length === 0 ? (
//                   <div className="text-center py-4 text-gray-500">
//                     Loading commodities...
//                   </div>
//                 ) : (
//                   commodityCategories.map(category => (
//                     <div key={category._id} className="mb-3 last:mb-0">
//                       {/* Category Header */}
//                       <div className="flex items-center gap-2 mb-1">
//                         <button
//                           onClick={() => toggleCategory(category._id)}
//                           className="p-1 text-gray-500 hover:text-gray-700"
//                         >
//                           {expandedCategories.has(category._id) ? 
//                             <FaChevronDown size={12} /> : 
//                             <FaChevronRight size={12} />
//                           }
//                         </button>
//                         <label className="flex items-center gap-2 text-sm font-medium">
//                           <input
//                             type="checkbox"
//                             checked={isCategoryChecked(category._id)}
//                             onChange={() => handleCategoryCheckboxChange(category._id)}
//                             className="rounded"
//                           />
//                           {category.categoryName}
//                           <span className="text-xs text-gray-500">
//                             ({category.subCategories.length})
//                           </span>
//                         </label>
//                       </div>
                      
//                       {/* Subcategories */}
//                       {expandedCategories.has(category._id) && category.subCategories.length > 0 && (
//                         <div className="ml-7 pl-1 border-l-2 border-gray-200">
//                           <div className="grid grid-cols-2 gap-1 mt-1">
//                             {category.subCategories.map(subCategory => (
//                               <label key={subCategory._id} className="flex items-center gap-2 text-sm">
//                                 <input
//                                   type="checkbox"
//                                   checked={isSubCategoryChecked(category.categoryName, subCategory.subCategoryName)}
//                                   onChange={() => handleSubCategoryCheckboxChange(category.categoryName, subCategory.subCategoryName)}
//                                   className="rounded"
//                                 />
//                                 <span className="truncate">{subCategory.subCategoryName}</span>
//                               </label>
//                             ))}
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   ))
//                 )}
//               </div>
//               {errors.commodity && <p className="text-red-500 text-xs mt-1">{errors.commodity}</p>}
//             </div>

//             {/* Page Access */}
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Page Access <span className="text-red-500">*</span>
//               </label>
//               <div className="border rounded p-3 max-h-60 overflow-y-auto">
//                 <div className="mb-2">
//                   <label className="flex items-center gap-2 text-sm">
//                     <input
//                       type="checkbox"
//                       checked={areAllModulesSelected()}
//                       onChange={handleAllCheckboxChange}
//                     />
//                     <span className="font-medium">Select All</span>
//                   </label>
//                 </div>
                
//                 <div className="grid grid-cols-2 gap-2">
//                   {allModules.map(module => (
//                     <label key={module} className="flex items-center gap-2 text-sm">
//                       <input
//                         type="checkbox"
//                         checked={form.pageAccess.includes(module) || areAllModulesSelected()}
//                         disabled={areAllModulesSelected()}
//                         onChange={() => handleModuleCheckboxChange(module)}
//                       />
//                       {module}
//                     </label>
//                   ))}
//                 </div>
//               </div>
//               {errors.pageAccess && <p className="text-red-500 text-xs mt-1">{errors.pageAccess}</p>}
//             </div>

//             <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
//               <button
//                 onClick={reset}
//                 className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSave}
//                 className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
//               >
//                 {editing ? "Update Sub-Admin" : "Create Sub-Admin"}
//               </button>
//             </div>
//           </div>
//         </Modal>
//       )}

//       {/* VIEW DETAILS MODAL */}
//       {viewOpen && selectedAdmin && (
//         <Modal 
//           title="Sub-Admin Details" 
//           onClose={() => { setViewOpen(false); setSelectedAdmin(null); }}
//         >
//           <div className="space-y-4">
//             <DetailRow label="Name" value={selectedAdmin.name} />
//             <DetailRow label="Email" value={selectedAdmin.email} />
//             <DetailRow label="Password" value="********" />
//             <DetailRow label="State" value={selectedAdmin.state || '-'} />
//             <DetailRow label="District" value={selectedAdmin.district || '-'} />
//             <DetailRow label="Taluka" value={selectedAdmin.taluka || '-'} />
//             <div>
//               <div className="font-medium text-gray-600 mb-2">Commodities:</div>
//               <div className="flex flex-wrap gap-1">
//                 {selectedAdmin.commodity?.map((commodity, idx) => (
//                   <span 
//                     key={idx} 
//                     className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded text-sm"
//                   >
//                     {commodity.split(':')[1] || commodity}
//                   </span>
//                 )) || '-'}
//               </div>
//             </div>
//             <div>
//               <div className="font-medium text-gray-600 mb-2">Access Modules:</div>
//               <div className="flex flex-wrap gap-1">
//                 {selectedAdmin.pageAccess.map(module => (
//                   <span 
//                     key={module} 
//                     className="bg-blue-50 text-blue-700 px-3 py-1 rounded text-sm"
//                   >
//                     {module}
//                   </span>
//                 ))}
//               </div>
//             </div>
//             <div>
//               <div className="font-medium text-gray-600 mb-2">Status:</div>
//               <span className={`px-3 py-1 rounded text-sm ${
//                 selectedAdmin.isDeleted 
//                   ? 'bg-red-100 text-red-800' 
//                   : 'bg-green-100 text-green-800'
//               }`}>
//                 {selectedAdmin.isDeleted ? 'Deleted' : 'Active'}
//               </span>
//             </div>
//             {selectedAdmin.isDeleted && selectedAdmin.deletedAt && (
//               <DetailRow label="Deleted On" value={new Date(selectedAdmin.deletedAt).toLocaleDateString()} />
//             )}
//             {selectedAdmin.createdAt && (
//               <DetailRow label="Created" value={new Date(selectedAdmin.createdAt).toLocaleDateString()} />
//             )}
//             {selectedAdmin.updatedAt && (
//               <DetailRow label="Last Updated" value={new Date(selectedAdmin.updatedAt).toLocaleDateString()} />
//             )}
//           </div>

//           <div className="flex justify-end mt-6">
//             <button
//               onClick={() => { setViewOpen(false); setSelectedAdmin(null); }}
//               className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
//             >
//               Close
//             </button>
//           </div>
//         </Modal>
//       )}

//       {/* SOFT DELETE MODAL */}
//       {deleteOpen && selectedAdmin && (
//         <Modal 
//           title="Move to Trash?" 
//           onClose={() => { setDeleteOpen(false); setSelectedAdmin(null); }}
//         >
//           <div className="text-center">
//             <div className="text-yellow-500 text-5xl mb-4">🗑️</div>
//             <h2 className="text-xl font-semibold mb-2">Move to Trash?</h2>
//             <p className="text-gray-600 mb-6">
//               Are you sure you want to move <span className="font-semibold">{selectedAdmin.name}</span> to trash? 
//               This action can be reversed by restoring from the deleted items view.
//             </p>
//             <div className="flex justify-center gap-3">
//               <button
//                 onClick={() => { setDeleteOpen(false); setSelectedAdmin(null); }}
//                 className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleDelete}
//                 className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
//               >
//                 Move to Trash
//               </button>
//             </div>
//           </div>
//         </Modal>
//       )}

//       {/* RESTORE MODAL */}
//       {restoreOpen && adminToRestore && (
//         <Modal 
//           title="Restore Sub-Admin?" 
//           onClose={() => { setRestoreOpen(false); setAdminToRestore(null); }}
//         >
//           <div className="text-center">
//             <div className="text-green-500 text-5xl mb-4">♻️</div>
//             <h2 className="text-xl font-semibold mb-2">Restore Sub-Admin?</h2>
//             <p className="text-gray-600 mb-6">
//               Are you sure you want to restore <span className="font-semibold">{adminToRestore.name}</span>? 
//               This will make the account active again.
//             </p>
//             <div className="flex justify-center gap-3">
//               <button
//                 onClick={() => { setRestoreOpen(false); setAdminToRestore(null); }}
//                 className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleRestore}
//                 className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
//               >
//                 Restore Sub-Admin
//               </button>
//             </div>
//           </div>
//         </Modal>
//       )}

//       {/* PERMANENT DELETE MODAL */}
//       {permanentDeleteOpen && adminToDeletePermanently && (
//         <Modal 
//           title="Delete Permanently?" 
//           onClose={() => { setPermanentDeleteOpen(false); setAdminToDeletePermanently(null); }}
//         >
//           <div className="text-center">
//             <div className="text-red-500 text-5xl mb-4">⚠️</div>
//             <h2 className="text-xl font-semibold mb-2">Delete Permanently?</h2>
//             <p className="text-gray-600 mb-2">
//               Are you sure you want to permanently delete <span className="font-semibold">{adminToDeletePermanently.name}</span>?
//             </p>
//             <p className="text-red-600 mb-6 font-semibold">
//               ⚠️ This action cannot be undone! All data will be lost forever.
//             </p>
//             <div className="flex justify-center gap-3">
//               <button
//                 onClick={() => { setPermanentDeleteOpen(false); setAdminToDeletePermanently(null); }}
//                 className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handlePermanentDelete}
//                 className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
//               >
//                 Delete Permanently
//               </button>
//             </div>
//           </div>
//         </Modal>
//       )}
//     </div>
//   );
// }

// /* ================= REUSABLE COMPONENTS ================= */

// const Modal = ({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) => (
//   <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3 backdrop-blur-sm">
//     <div className="bg-white p-6 rounded-xl w-full max-w-2xl shadow-2xl">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="font-semibold text-xl text-gray-800">{title}</h2>
//         <button
//           onClick={onClose}
//           className="text-gray-500 hover:text-gray-700 text-xl"
//         >
//           ✕
//         </button>
//       </div>
//       {children}
//     </div>
//   </div>
// );

// const Input = ({ 
//   label, 
//   value, 
//   error, 
//   onChange, 
//   type = "text",
//   placeholder = "",
//   required = false 
// }: { 
//   label: string; 
//   value: string; 
//   error?: string; 
//   onChange: (v: string) => void;
//   type?: string;
//   placeholder?: string;
//   required?: boolean;
// }) => (
//   <div className="mb-4">
//     <label className="block text-sm font-medium text-gray-700 mb-1">
//       {label} {required && <span className="text-red-500">*</span>}
//     </label>
//     <input
//       type={type}
//       className={`border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-500 ${
//         error ? "border-red-500" : "border-gray-300"
//       }`}
//       placeholder={placeholder}
//       value={value}
//       onChange={e => onChange(e.target.value)}
//     />
//     {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
//   </div>
// );

// const DetailRow = ({ label, value }: { label: string; value: string }) => (
//   <div className="flex border-b pb-2 mb-2 last:border-0 last:pb-0 last:mb-0">
//     <div className="w-32 font-medium text-gray-600">{label}:</div>
//     <div className="flex-1 text-gray-900">{value}</div>
//   </div>
// );












"use client";

import { useState, useEffect } from "react";
import {
  FaEye,
  FaTrash,
  FaPrint,
  FaCopy,
  FaFileExcel,
  FaFileCsv,
  FaFilePdf,
  FaSearch,
  FaRedo,
  FaEdit,
  FaPlus,
  FaTrashRestore,
  FaHistory,
  FaTrashAlt,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";
import toast from "react-hot-toast";
import { Pagination } from "@mui/material";
import { getAllMenuModules } from "@/app/config/menu.config";

/* ================= TYPES ================= */

interface SubAdmin {
  _id: string;
  name: string;
  email: string;
  password: string;
  pageAccess: string[];
  isDeleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  state?: string;
  district?: string;
  taluka?: string;
  commodity?: string[];
  subCategories?: string[];
}

interface ApiResponse {
  success: boolean;
  data: SubAdmin | SubAdmin[];
  message?: string;
  page?: number;
  limit?: number;
  total?: number;
}

interface StateDetails {
  _id: string;
  pinCode: string;
  state: string;
  district: string;
  taluk: string;
  createdAt: string;
  updatedAt: string;
}

interface CommodityCategory {
  _id: string;
  categoryName: string;
  categoryId: string;
  image: string;
  subCategories: SubCategory[];
}

interface SubCategory {
  _id: string;
  subCategoryName: string;
  categoryId: string;
  image: string;
  subCategoryId: string;
}

/* ================= PAGE ================= */

export default function SubAdminAccountsPage() {
  const [allModules, setAllModules] = useState<string[]>([]);
  const [modules, setModules] = useState<string[]>(["All"]);
  const [allSubAdmins, setAllSubAdmins] = useState<SubAdmin[]>([]); // Store all data
  const [subAdmins, setSubAdmins] = useState<SubAdmin[]>([]); // Store filtered data
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAdmins, setTotalAdmins] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stateDetails, setStateDetails] = useState<StateDetails[]>([]);
  
  // Extract unique states, districts, and talukas
  const [states, setStates] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [talukas, setTalukas] = useState<string[]>([]);
  
  // Commodities state
  const [commodityCategories, setCommodityCategories] = useState<CommodityCategory[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  
  // Filter states
  const [stateFilter, setStateFilter] = useState<string>("");
  const [districtFilter, setDistrictFilter] = useState<string>("");
  const [talukaFilter, setTalukaFilter] = useState<string>("");
  
  // Filtered dropdowns for form
  const [filteredDistricts, setFilteredDistricts] = useState<string[]>([]);
  const [filteredTalukas, setFilteredTalukas] = useState<string[]>([]);
  
  // Filtered dropdowns for filters
  const [filteredDistrictsForFilter, setFilteredDistrictsForFilter] = useState<string[]>([]);
  const [filteredTalukasForFilter, setFilteredTalukasForFilter] = useState<string[]>([]);

  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [restoreOpen, setRestoreOpen] = useState(false);
  const [permanentDeleteOpen, setPermanentDeleteOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<SubAdmin | null>(null);
  const [adminToRestore, setAdminToRestore] = useState<SubAdmin | null>(null);
  const [adminToDeletePermanently, setAdminToDeletePermanently] = useState<SubAdmin | null>(null);
  const [editing, setEditing] = useState<SubAdmin | null>(null);
  const [showDeleted, setShowDeleted] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    pageAccess: [] as string[],
    state: "",
    district: "",
    taluka: "",
    commodity: [] as string[],
    subCategories: [] as string[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  /* ================= API FUNCTIONS ================= */

  const fetchSubAdmins = async (page: number = 1, searchQuery: string = "") => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10000", // Fetch all data for manual filtering
        search: searchQuery,
        showDeleted: showDeleted.toString(),
      });

      const response = await axios.get<ApiResponse>(`/api/admin?${params}`);
      
      if (response.data.success) {
        const data = Array.isArray(response.data.data) 
          ? response.data.data 
          : [response.data.data];
        
        setAllSubAdmins(data); // Store all data
        
        // Apply manual filtering
        const filteredData = applyManualFilters(data);
        setSubAdmins(filteredData);
        
        if (response.data.total !== undefined) {
          setTotalAdmins(filteredData.length); // Use filtered count
          setTotalPages(Math.ceil(filteredData.length / rowsPerPage));
        }
        setCurrentPage(1); // Reset to first page after filtering
      }
    } catch (err: any) {
      console.error("Error fetching sub-admins:", err);
      setError(err.response?.data?.message || 'Failed to load sub-admins. Please try again.');
      setAllSubAdmins([]);
      setSubAdmins([]);
      toast.error(err.response?.data?.message || "Failed to load sub-admins");
    } finally {
      setLoading(false);
    }
  };

  const fetchCommodities = async () => {
    try {
      const response = await axios.get("/api/commodities");
      if (response.data.success) {
        setCommodityCategories(response.data.data);
        // Expand all categories by default
        const expanded = new Set<string>();
        response.data.data.forEach((category: CommodityCategory) => {
          expanded.add(category._id);
        });
        setExpandedCategories(expanded);
      }
    } catch (err) {
      console.error("Error fetching commodities:", err);
      toast.error("Failed to load commodities");
    }
  };

  const fetchStateDetails = async () => {
    try {
      const response = await axios.get<{success: boolean; data: StateDetails[]}>("/api/states-details");
      if (response.data.success && response.data.data) {
        setStateDetails(response.data.data);
        
        // Extract unique values
        const uniqueStates = Array.from(new Set(response.data.data.map(item => item.state))).sort();
        setStates(uniqueStates);
        
        // Extract all districts for initial setup
        const allDistricts = Array.from(new Set(response.data.data.map(item => item.district))).sort();
        setDistricts(allDistricts);
        
        // Extract all talukas for initial setup
        const allTalukas = Array.from(new Set(response.data.data.map(item => item.taluk))).sort();
        setTalukas(allTalukas);
      }
    } catch (err) {
      console.error("Error fetching state details:", err);
      toast.error("Failed to load location data");
    }
  };

  // Apply manual filters to data
  const applyManualFilters = (data: SubAdmin[]): SubAdmin[] => {
    let filtered = [...data];

    // Apply state filter
    if (stateFilter) {
      filtered = filtered.filter(admin => 
        admin.state?.toLowerCase() === stateFilter.toLowerCase()
      );
    }

    // Apply district filter
    if (districtFilter) {
      filtered = filtered.filter(admin => 
        admin.district?.toLowerCase() === districtFilter.toLowerCase()
      );
    }

    // Apply taluka filter
    if (talukaFilter) {
      filtered = filtered.filter(admin => 
        admin.taluka?.toLowerCase() === talukaFilter.toLowerCase()
      );
    }

    // Apply text search
    if (search.trim()) {
      const searchTerm = search.toLowerCase().trim();
      filtered = filtered.filter(admin => 
        admin.name?.toLowerCase().includes(searchTerm) ||
        admin.email?.toLowerCase().includes(searchTerm) ||
        admin.state?.toLowerCase().includes(searchTerm) ||
        admin.district?.toLowerCase().includes(searchTerm) ||
        admin.taluka?.toLowerCase().includes(searchTerm)
      );
    }

    return filtered;
  };

  const createSubAdmin = async (adminData: any) => {
    try {
      const response = await axios.post<ApiResponse>("/api/admin", adminData);
      return response.data;
    } catch (err: any) {
      console.error("Error creating sub-admin:", err);
      throw new Error(err.response?.data?.message || "Failed to create sub-admin");
    }
  };

  const updateSubAdmin = async (id: string, adminData: Partial<SubAdmin>) => {
    try {
      const response = await axios.put<ApiResponse>(`/api/admin/${id}`, adminData);
      return response.data;
    } catch (err: any) {
      console.error("Error updating sub-admin:", err);
      throw new Error(err.response?.data?.message || "Failed to update sub-admin");
    }
  };

  const deleteSubAdminAPI = async (id: string) => {
    try {
      const response = await axios.delete<ApiResponse>(`/api/admin/${id}`);
      return response.data;
    } catch (err: any) {
      console.error("Error deleting sub-admin:", err);
      throw new Error(err.response?.data?.message || "Failed to delete sub-admin");
    }
  };

  const restoreSubAdminAPI = async (id: string) => {
    try {
      const response = await axios.patch<ApiResponse>(`/api/admin/${id}/restore`);
      return response.data;
    } catch (err: any) {
      console.error("Error restoring sub-admin:", err);
      throw new Error(err.response?.data?.message || "Failed to restore sub-admin");
    }
  };

  const permanentDeleteSubAdminAPI = async (id: string) => {
    try {
      const response = await axios.delete<ApiResponse>(`/api/admin/${id}/permanent`);
      return response.data;
    } catch (err: any) {
      console.error("Error permanently deleting sub-admin:", err);
      throw new Error(err.response?.data?.message || "Failed to permanently delete sub-admin");
    }
  };

  /* ================= EFFECTS ================= */

  useEffect(() => {
    fetchSubAdmins(currentPage, "");
    fetchStateDetails();
    fetchCommodities();
  }, [showDeleted]);

  useEffect(() => {
    const dynamicModules = getAllMenuModules();
    setAllModules(dynamicModules);
    setModules(["All", ...dynamicModules]);
  }, []);

  // Filter districts based on selected state (for form)
  useEffect(() => {
    if (form.state) {
      const filtered = Array.from(new Set(
        stateDetails
          .filter(item => item.state === form.state)
          .map(item => item.district)
      )).sort();
      setFilteredDistricts(filtered);
      // Reset district and taluka when state changes
      setForm(prev => ({ ...prev, district: "", taluka: "" }));
    } else {
      setFilteredDistricts([]);
    }
  }, [form.state, stateDetails]);

  // Filter talukas based on selected district (for form)
  useEffect(() => {
    if (form.district) {
      const filtered = Array.from(new Set(
        stateDetails
          .filter(item => item.district === form.district)
          .map(item => item.taluk)
      )).sort();
      setFilteredTalukas(filtered);
      // Reset taluka when district changes
      setForm(prev => ({ ...prev, taluka: "" }));
    } else {
      setFilteredTalukas([]);
    }
  }, [form.district, stateDetails]);

  // Filter districts based on selected state (for filter)
  useEffect(() => {
    if (stateFilter) {
      const filtered = Array.from(new Set(
        stateDetails
          .filter(item => item.state === stateFilter)
          .map(item => item.district)
      )).sort();
      setFilteredDistrictsForFilter(filtered);
      // Reset district and taluka filters when state changes
      setDistrictFilter("");
      setTalukaFilter("");
    } else {
      setFilteredDistrictsForFilter([]);
      // Reset district and taluka filters when state is cleared
      setDistrictFilter("");
      setTalukaFilter("");
    }
  }, [stateFilter, stateDetails]);

  // Filter talukas based on selected district (for filter)
  useEffect(() => {
    if (districtFilter) {
      const filtered = Array.from(new Set(
        stateDetails
          .filter(item => item.district === districtFilter)
          .map(item => item.taluk)
      )).sort();
      setFilteredTalukasForFilter(filtered);
      // Reset taluka filter when district changes
      setTalukaFilter("");
    } else {
      setFilteredTalukasForFilter([]);
      // Reset taluka filter when district is cleared
      setTalukaFilter("");
    }
  }, [districtFilter, stateDetails]);

  // Apply filters when filter states change
  useEffect(() => {
    if (allSubAdmins.length > 0) {
      const filteredData = applyManualFilters(allSubAdmins);
      setSubAdmins(filteredData);
      setTotalAdmins(filteredData.length);
      setTotalPages(Math.ceil(filteredData.length / rowsPerPage));
      setCurrentPage(1); // Reset to first page when filters change
    }
  }, [search, stateFilter, districtFilter, talukaFilter, allSubAdmins]);

  // Handle pagination for filtered data
  useEffect(() => {
    if (allSubAdmins.length > 0) {
      const filteredData = applyManualFilters(allSubAdmins);
      const startIndex = (currentPage - 1) * rowsPerPage;
      const endIndex = startIndex + rowsPerPage;
      const paginatedData = filteredData.slice(startIndex, endIndex);
      setSubAdmins(paginatedData);
      setTotalAdmins(filteredData.length);
      setTotalPages(Math.ceil(filteredData.length / rowsPerPage));
    }
  }, [currentPage, rowsPerPage, allSubAdmins]);

  /* ================= VALIDATION ================= */

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    
    if (!form.name || !form.name.trim()) {
      e.name = "Name is required";
    }
    
    if (!form.email || !form.email.trim()) {
      e.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      e.email = "Invalid email format";
    }
    
    if (!editing) {
      if (!form.password || !form.password.trim()) {
        e.password = "Password is required";
      } else if (form.password.length < 6) {
        e.password = "Password must be at least 6 characters";
      }
    } else {
      if (form.password && form.password.trim() && form.password.length < 6) {
        e.password = "Password must be at least 6 characters";
      }
    }
    
    if (form.pageAccess.length === 0) {
      e.pageAccess = "Select at least one module";
    }

    if (!form.state) {
      e.state = "State is required";
    }

    if (!form.district) {
      e.district = "District is required";
    }

    if (!form.taluka) {
      e.taluka = "Taluka is required";
    }

    if (form.commodity.length === 0) {
      e.commodity = "Select at least one commodity";
    }
    
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ================= CRUD OPERATIONS ================= */

  const handleSave = async () => {
    if (!validate()) return;

    try {
      let pageAccessToSave: string[];
      
      if (form.pageAccess.includes("All")) {
        pageAccessToSave = allModules;
      } else {
        pageAccessToSave = form.pageAccess;
      }

      const adminData: any = {
        name: form.name.trim(),
        email: form.email.trim(),
        pageAccess: pageAccessToSave,
        state: form.state,
        district: form.district,
        taluka: form.taluka,
        commodity: form.commodity,
        subCategories: form.subCategories,
      };
      
      if (form.password && form.password.trim()) {
        adminData.password = form.password;
      }

      if (editing) {
        await updateSubAdmin(editing._id, adminData);
        toast.success("Sub-admin updated successfully!");
      } else {
        await createSubAdmin(adminData);
        toast.success("Sub-admin created successfully!");
      }
      
      // Refresh data after save
      await fetchSubAdmins(currentPage, "");
      reset();
    } catch (err: any) {
      toast.error(err.message || "Operation failed");
    }
  };

  const handleDelete = async () => {
    if (!selectedAdmin) return;
   
    try {
      await deleteSubAdminAPI(selectedAdmin._id);
      toast.success("Sub-admin moved to trash successfully!");
      setDeleteOpen(false);
      // Refresh data after delete
      await fetchSubAdmins(currentPage, "");
    } catch (error: any) {
      console.error("Error deleting sub-admin:", error);
      toast.error(error.response?.data?.message || "Failed to delete sub-admin. Please try again.");
    }
  };

  const handleRestore = async () => {
    if (!adminToRestore) return;
   
    try {
      await restoreSubAdminAPI(adminToRestore._id);
      toast.success("Sub-admin restored successfully!");
      setRestoreOpen(false);
      // Refresh data after restore
      await fetchSubAdmins(currentPage, "");
    } catch (error: any) {
      console.error("Error restoring sub-admin:", error);
      toast.error(error.response?.data?.message || "Failed to restore sub-admin. Please try again.");
    }
  };

  const handlePermanentDelete = async () => {
    if (!adminToDeletePermanently) return;
   
    try {
      await permanentDeleteSubAdminAPI(adminToDeletePermanently._id);
      toast.success("Sub-admin permanently deleted!");
      setPermanentDeleteOpen(false);
      // Refresh data after permanent delete
      await fetchSubAdmins(currentPage, "");
    } catch (error: any) {
      console.error("Error permanently deleting sub-admin:", error);
      toast.error(error.response?.data?.message || "Failed to permanently delete sub-admin. Please try again.");
    }
  };

  /* ================= HELPER FUNCTIONS ================= */

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const handleCategoryCheckboxChange = (categoryId: string) => {
    const category = commodityCategories.find(c => c._id === categoryId);
    if (!category) return;

    const allSubCategoryIds = category.subCategories.map(sub => sub.subCategoryName);
    const allSelected = allSubCategoryIds.every(id => 
      form.commodity.includes(`${category.categoryName}:${id}`)
    );

    if (allSelected) {
      // Remove all subcategories of this category
      setForm(prev => ({
        ...prev,
        commodity: prev.commodity.filter(item => !item.startsWith(`${category.categoryName}:`)),
        subCategories: prev.subCategories.filter(item => !item.startsWith(`${category.categoryName}:`))
      }));
    } else {
      // Add all subcategories of this category
      const newCommodities = allSubCategoryIds.map(id => `${category.categoryName}:${id}`);
      setForm(prev => ({
        ...prev,
        commodity: [...prev.commodity.filter(item => !item.startsWith(`${category.categoryName}:`)), ...newCommodities],
        subCategories: [...prev.subCategories.filter(item => !item.startsWith(`${category.categoryName}:`)), ...newCommodities]
      }));
    }
  };

  const handleSubCategoryCheckboxChange = (categoryName: string, subCategoryName: string) => {
    const fullId = `${categoryName}:${subCategoryName}`;
    
    if (form.commodity.includes(fullId)) {
      // Remove subcategory
      setForm(prev => ({
        ...prev,
        commodity: prev.commodity.filter(item => item !== fullId),
        subCategories: prev.subCategories.filter(item => item !== fullId)
      }));
    } else {
      // Add subcategory
      setForm(prev => ({
        ...prev,
        commodity: [...prev.commodity, fullId],
        subCategories: [...prev.subCategories, fullId]
      }));
    }
  };

  const isCategoryChecked = (categoryId: string): boolean => {
    const category = commodityCategories.find(c => c._id === categoryId);
    if (!category) return false;

    const allSubCategoryIds = category.subCategories.map(sub => sub.subCategoryName);
    return allSubCategoryIds.length > 0 && allSubCategoryIds.every(id => 
      form.commodity.includes(`${category.categoryName}:${id}`)
    );
  };

  const isSubCategoryChecked = (categoryName: string, subCategoryName: string): boolean => {
    return form.commodity.includes(`${categoryName}:${subCategoryName}`);
  };

  const loadAdminForEdit = (admin: SubAdmin) => {
    setEditing(admin);
    
    const displayModules: string[] = [];
    
    admin.pageAccess.forEach(lowercaseModule => {
      const displayModule = allModules.find(module => 
        module.toLowerCase() === lowercaseModule.toLowerCase()
      );
      
      if (displayModule) {
        displayModules.push(displayModule);
      }
    });
    
    const hasAllModules = allModules.every(module => 
      displayModules.includes(module)
    );

    setForm({
      name: admin.name,
      email: admin.email,
      password: "",
      pageAccess: hasAllModules ? ["All"] : displayModules,
      state: admin.state || "",
      district: admin.district || "",
      taluka: admin.taluka || "",
      commodity: admin.commodity || [],
      subCategories: admin.subCategories || [],
    });
    
    setOpen(true);
  };

  const handleAllCheckboxChange = () => {
    if (form.pageAccess.includes("All")) {
      setForm(p => ({
        ...p,
        pageAccess: [],
      }));
    } else {
      setForm(p => ({
        ...p,
        pageAccess: ["All"],
      }));
    }
  };

  const handleModuleCheckboxChange = (module: string) => {
    if (form.pageAccess.includes("All")) {
      setForm(p => ({
        ...p,
        pageAccess: [module],
      }));
    } else if (form.pageAccess.includes(module)) {
      setForm(p => ({
        ...p,
        pageAccess: p.pageAccess.filter(x => x !== module),
      }));
    } else {
      setForm(p => ({
        ...p,
        pageAccess: [...p.pageAccess, module],
      }));
    }
  };

  const areAllModulesSelected = () => {
    return form.pageAccess.includes("All") || 
           (allModules.length > 0 && allModules.every(module => 
             form.pageAccess.includes(module)
           ));
  };

  const toggleDeletedView = () => {
    setShowDeleted(!showDeleted);
    setCurrentPage(1);
    // Clear filters when switching views
    setStateFilter("");
    setDistrictFilter("");
    setTalukaFilter("");
    setSearch("");
  };

  const reset = () => {
    setOpen(false);
    setEditing(null);
    setSelectedAdmin(null);
    setAdminToRestore(null);
    setAdminToDeletePermanently(null);
    setViewOpen(false);
    setForm({ 
      name: "", 
      email: "", 
      password: "", 
      pageAccess: [],
      state: "",
      district: "",
      taluka: "",
      commodity: [],
      subCategories: []
    });
    setErrors({});
  };

  const handleResetFilters = () => {
    setSearch("");
    setStateFilter("");
    setDistrictFilter("");
    setTalukaFilter("");
    setCurrentPage(1);
    // Re-fetch all data without filters
    fetchSubAdmins(1, "");
    setRowsPerPage(10);
    setShowDeleted(false);
  };

  // Get current page data
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return subAdmins.slice(startIndex, endIndex);
  };

  /* ================= EXPORT FUNCTIONS ================= */

  const exportData = subAdmins.map(({ _id, createdAt, updatedAt, password, ...rest }) => ({
    ...rest,
    password: "********",
    state: rest.state || "",
    district: rest.district || "",
    taluka: rest.taluka || "",
    commodity: rest.commodity?.join(", ") || "",
  }));

  const handlePrint = () => {
    const currentPageData = getCurrentPageData();
    if (currentPageData.length === 0) {
      toast.error("No sub-admins to print");
      return;
    }

    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) {
      toast.error("Please allow popups to print");
      return;
    }

    const printDate = new Date().toLocaleDateString();
    const printTime = new Date().toLocaleTimeString();
    
    // Build filter info text
    let filterInfo = "";
    if (stateFilter) {
      filterInfo += `State: ${stateFilter} | `;
    }
    if (districtFilter) {
      filterInfo += `District: ${districtFilter} | `;
    }
    if (talukaFilter) {
      filterInfo += `Taluka: ${talukaFilter} | `;
    }
    if (search) {
      filterInfo += `Search: "${search}" | `;
    }
    if (filterInfo) {
      filterInfo = filterInfo.slice(0, -3); // Remove last " | "
    }
    
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Sub-Admins Report</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            color: #333;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 15px;
            border-bottom: 2px solid #4CAF50;
          }
          .header h1 {
            margin: 0 0 10px 0;
            color: #1f2937;
            font-size: 24px;
          }
          .header-info {
            color: #6b7280;
            font-size: 14px;
            margin: 5px 0;
          }
          .filter-info {
            background-color: #f3f4f6;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 20px;
            font-size: 13px;
            border-left: 4px solid #4CAF50;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            font-size: 12px;
          }
          th {
            background-color: #f3f4f6;
            color: #374151;
            font-weight: 600;
            padding: 12px 8px;
            text-align: left;
            border: 1px solid #d1d5db;
          }
          td {
            padding: 10px 8px;
            border: 1px solid #e5e7eb;
            vertical-align: top;
          }
          tr:nth-child(even) {
            background-color: #f9fafb;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 12px;
            color: #6b7280;
            text-align: center;
          }
          @media print {
            @page {
              margin: 0.5in;
            }
            body {
              margin: 0;
              -webkit-print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>👨‍💼 Sub-Admins Management Report</h1>
          <div class="header-info">Generated on: ${printDate} at ${printTime}</div>
          <div class="header-info">Total Sub-Admins: ${subAdmins.length} | Showing: ${currentPageData.length} sub-admins</div>
          <div class="header-info">Page: ${currentPage} of ${totalPages}</div>
          ${filterInfo ? `<div class="filter-info"><strong>Filters Applied:</strong> ${filterInfo}</div>` : ''}
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Sr.</th>
              <th>Name</th>
              <th>Email</th>
              <th>Password</th>
              <th>State</th>
              <th>District</th>
              <th>Taluka</th>
              <th>Commodities</th>
              <th>Access Modules</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${currentPageData.map((admin, index) => `
              <tr>
                <td>${index + 1 + (currentPage - 1) * rowsPerPage}</td>
                <td><strong>${admin.name}</strong></td>
                <td>${admin.email}</td>
                <td>********</td>
                <td>${admin.state || '-'}</td>
                <td>${admin.district || '-'}</td>
                <td>${admin.taluka || '-'}</td>
                <td>${admin.commodity?.join(', ') || '-'}</td>
                <td>${admin.pageAccess.join(', ')}</td>
                <td>${admin.isDeleted ? 'Deleted' : 'Active'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="footer">
          <p>Printed from Kissan Partner System | ${window.location.hostname}</p>
          <p>© ${new Date().getFullYear()} Kissan Partner. All rights reserved.</p>
        </div>
        
        <script>
          window.onload = function() {
            window.print();
            setTimeout(() => {
              if (confirm('Close print window?')) {
                window.close();
              }
            }, 100);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  const handleCopy = async (): Promise<void> => {
    const currentPageData = getCurrentPageData();
    if (currentPageData.length === 0) {
      toast.error("No sub-admins to copy");
      return;
    }

    // Headers for the table
    const headers = ["Sr.", "Name", "Email", "Password", "State", "District", "Taluka", "Commodity", "Page Access", "Status"];
    
    // Define column widths (adjust as needed)
    const colWidths = [6, 20, 25, 10, 15, 15, 15, 20, 25, 12];
    
    // Create separator line
    const createSeparator = (): string => {
      const totalWidth = colWidths.reduce((sum, width) => sum + width + 3, -3);
      return "─".repeat(Math.min(totalWidth, 150));
    };
    
    // Format a single row
    const formatRow = (admin: any, index: number): string => {
      const rowNum = index + 1 + (currentPage - 1) * rowsPerPage;
      
      // Get commodity as string
      const commodity = admin.commodity?.join(', ') || '-';
      const trimmedCommodity = commodity.length > 17 ? commodity.substring(0, 14) + '...' : commodity;
      
      // Get page access as string
      const pageAccess = admin.pageAccess?.join(', ') || '-';
      const trimmedAccess = pageAccess.length > 22 ? pageAccess.substring(0, 19) + '...' : pageAccess;
      
      // Prepare all values
      const values = [
        rowNum.toString(),
        admin.name || '-',
        admin.email || '-',
        '********',
        admin.state || '-',
        admin.district || '-',
        admin.taluka || '-',
        trimmedCommodity,
        trimmedAccess,
        admin.isDeleted ? '❌ Deleted' : '✅ Active'
      ];
      
      // Apply padding to each value
      return values.map((val, i) => val.padEnd(colWidths[i])).join(" │ ");
    };
    
    // Format header row
    const formatHeader = (): string => {
      return headers.map((header, i) => header.padEnd(colWidths[i])).join(" │ ");
    };
    
    // Build the complete table content
    const separator = createSeparator();
    const tableContent = [
      `📋 SUB-ADMINS LIST - Page ${currentPage}`,
      separator,
      formatHeader(),
      separator,
      ...currentPageData.map((admin, index) => formatRow(admin, index)),
      separator,
      "",
      "📊 SUMMARY",
      `• Current Page: ${currentPage}`,
      `• Records on Page: ${currentPageData.length}`,
      `• Active: ${currentPageData.filter(a => !a.isDeleted).length}`,
      `• Deleted: ${currentPageData.filter(a => a.isDeleted).length}`,
      `• Generated: ${new Date().toLocaleString()}`,
      "",
      "📝 Note: Data copied from current page view",
      "    Use pagination to copy other pages"
    ].join("\n");
    
    try {
      await navigator.clipboard.writeText(tableContent);
      toast.success(`Copied ${currentPageData.length} sub-admins to clipboard!`);
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleExcel = () => {
    const currentPageData = getCurrentPageData();
    if (currentPageData.length === 0) {
      toast.error("No sub-admins to export");
      return;
    }

    try {
      const exportData = currentPageData.map(({ _id, createdAt, updatedAt, password, ...rest }) => ({
        ...rest,
        password: "********",
        state: rest.state || "",
        district: rest.district || "",
        taluka: rest.taluka || "",
        commodity: rest.commodity?.join(", ") || "",
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sub-Admins");
      XLSX.writeFile(wb, `sub-admins-${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success("Excel file exported successfully!");
    } catch (err) {
      toast.error("Failed to export Excel file");
    }
  };

  const handleCSV = () => {
    const currentPageData = getCurrentPageData();
    if (currentPageData.length === 0) {
      toast.error("No sub-admins to export");
      return;
    }

    try {
      const exportData = currentPageData.map(({ _id, createdAt, updatedAt, password, ...rest }) => ({
        ...rest,
        password: "********",
        state: rest.state || "",
        district: rest.district || "",
        taluka: rest.taluka || "",
        commodity: rest.commodity?.join(", ") || "",
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const csv = XLSX.utils.sheet_to_csv(ws);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `sub-admins-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      toast.success("CSV file exported successfully!");
    } catch (err) {
      toast.error("Failed to export CSV file");
    }
  };

  const handlePDF = () => {
    const currentPageData = getCurrentPageData();
    if (currentPageData.length === 0) {
      toast.error("No sub-admins to export");
      return;
    }

    try {
      const doc = new jsPDF();
      doc.text("Sub-Admins Management Report", 14, 16);
      
      // Add filter info
      let filterText = "";
      if (stateFilter) {
        filterText += `State: ${stateFilter} | `;
      }
      if (districtFilter) {
        filterText += `District: ${districtFilter} | `;
      }
      if (talukaFilter) {
        filterText += `Taluka: ${talukaFilter} | `;
      }
      if (search) {
        filterText += `Search: "${search}" | `;
      }
      if (filterText) {
        filterText = filterText.slice(0, -3); // Remove last " | "
        doc.text(`Filters: ${filterText}`, 14, 24);
      }
      
      const tableColumn = ["Sr.", "Name", "Email", "State", "District", "Taluka", "Commodities", "Access Modules", "Status"];
      const tableRows: any = currentPageData.map((admin, index) => [
        index + 1 + (currentPage - 1) * rowsPerPage,
        admin.name,
        admin.email,
        admin.state || '-',
        admin.district || '-',
        admin.taluka || '-',
        admin.commodity?.join(', ') || '-',
        admin.pageAccess.join(', '),
        admin.isDeleted ? 'Deleted' : 'Active'
      ]);
      
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: filterText ? 30 : 20,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [76, 175, 80] },
      });
      
      doc.save(`sub-admins-${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success("PDF file exported successfully!");
    } catch (err) {
      toast.error("Failed to export PDF file");
    }
  };

  /* ================= UI ================= */

  const currentPageData = getCurrentPageData();

  return (
    <div className="p-[.6rem] relative text-black text-sm md:p-1 overflow-x-auto min-h-screen">
      {/* Loading Overlay */}
      {loading && (
        <div className="min-h-screen absolute w-full top-0 left-0 bg-[#e9e7e773] z-[100] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Header Section */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-2xl font-bold text-gray-800">
            {showDeleted ? "Deleted Sub-Admins" : "Sub-Admin Accounts"}
          </h1>
          <p className="text-gray-600 mt-2">
            {showDeleted 
              ? "View, restore or permanently delete sub-admin accounts" 
              : `Overview and management of all sub-admin accounts. ${subAdmins.length} sub-admins found.`}
          </p>
        </div>
      </div>

      {/* Export Buttons Section */}
      <div className="lg:hidden flex flex-wrap gap-[.6rem] text-sm bg-white p-[.6rem] shadow">
        {[
          { label: "Copy", icon: FaCopy, onClick: handleCopy, color: "bg-gray-100 hover:bg-gray-200 text-gray-800" },
          { label: "Excel", icon: FaFileExcel, onClick: handleExcel, color: "bg-green-100 hover:bg-green-200 text-green-800" },
          { label: "CSV", icon: FaFileCsv, onClick: handleCSV, color: "bg-blue-100 hover:bg-blue-200 text-blue-800" },
          { label: "PDF", icon: FaFilePdf, onClick: handlePDF, color: "bg-red-100 hover:bg-red-200 text-red-800" },
          { label: "Print", icon: FaPrint, onClick: handlePrint, color: "bg-purple-100 hover:bg-purple-200 text-purple-800" },
        ].map((btn, i) => (
          <button
            key={i}
            onClick={btn.onClick}
            className={`flex items-center gap-[.6rem] text-sm px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md ${btn.color} font-medium`}
          >
            <btn.icon className="text-sm" />
          </button>
        ))}
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded lg:rounded-none shadow p-[.4rem] text-sm mb-2">
        <div className="gap-[.6rem] text-sm items-end flex flex-wrap md:flex-row flex-col md:*:w-fit *:w-full">
          {/* Search Input */}
          <div className="md:col-span-3">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          {/* State Filter */}
          <div className="md:col-span-2">
            <label className="block text-xs text-gray-500 mb-1">State</label>
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
            >
              <option value="">All States</option>
              {states.map(state => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          {/* District Filter */}
          <div className="md:col-span-2">
            <label className="block text-xs text-gray-500 mb-1">District</label>
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              disabled={!stateFilter}
              className={`w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all ${
                !stateFilter ? 'bg-gray-100' : ''
              }`}
            >
              <option value="">All Districts</option>
              {filteredDistrictsForFilter.map(district => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>

          {/* Taluka Filter */}
          <div className="md:col-span-2">
            <label className="block text-xs text-gray-500 mb-1">Taluka</label>
            <select
              value={talukaFilter}
              onChange={(e) => setTalukaFilter(e.target.value)}
              disabled={!districtFilter}
              className={`w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all ${
                !districtFilter ? 'bg-gray-100' : ''
              }`}
            >
              <option value="">All Talukas</option>
              {filteredTalukasForFilter.map(taluka => (
                <option key={taluka} value={taluka}>
                  {taluka}
                </option>
              ))}
            </select>
          </div>

          {/* Show Deleted/Active Toggle */}
          <div className="md:col-span-2">
            <label className="block text-xs text-gray-500 mb-1">Status</label>
            <button
              onClick={toggleDeletedView}
              className={`w-full px-4 py-2 rounded transition-colors font-medium flex items-center justify-center gap-2 ${
                showDeleted 
                  ? "bg-yellow-500 text-white hover:bg-yellow-600" 
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              <FaHistory /> {showDeleted ? "Show Active" : "Show Deleted"}
            </button>
          </div>

          {/* Add New Button */}
          {!showDeleted && (
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-500 mb-1">&nbsp;</label>
              <button
                onClick={() => setOpen(true)}
                className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <FaPlus /> Add New
              </button>
            </div>
          )}

          {/* Reset Button */}
          <div className="md:col-span-2">
            <label className="block text-xs text-gray-500 mb-1">&nbsp;</label>
            <button
              onClick={handleResetFilters}
              className="w-full px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <FaRedo /> Reset
            </button>
          </div>

          {/* Desktop Export Buttons */}
          <div className="lg:flex hidden ml-auto flex-wrap gap-[.6rem] text-sm">
            {[
              { label: "Copy", icon: FaCopy, onClick: handleCopy, color: "bg-gray-100 hover:bg-gray-200 text-gray-800" },
              { label: "Excel", icon: FaFileExcel, onClick: handleExcel, color: "bg-green-100 hover:bg-green-200 text-green-800" },
              { label: "CSV", icon: FaFileCsv, onClick: handleCSV, color: "bg-blue-100 hover:bg-blue-200 text-blue-800" },
              { label: "PDF", icon: FaFilePdf, onClick: handlePDF, color: "bg-red-100 hover:bg-red-200 text-red-800" },
              { label: "Print", icon: FaPrint, onClick: handlePrint, color: "bg-purple-100 hover:bg-purple-200 text-purple-800" },
            ].map((btn, i) => (
              <button
                key={i}
                onClick={btn.onClick}
                className={`flex items-center gap-[.6rem] text-sm px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md ${btn.color} font-medium`}
              >
                <btn.icon className="text-sm" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded border border-red-200">
          {error}
        </div>
      )}

      {/* Desktop Table */}
      {!loading && currentPageData.length > 0 && (
        <>
          <div className="hidden lg:block bg-white rounded shadow">
            <table className="min-w-full">
              <thead className="border-b border-zinc-200">
                <tr className="*:text-zinc-800">
                  <th className="p-[.6rem] text-sm text-left font-semibold">Sr.</th>
                  <th className="p-[.6rem] text-sm text-left font-semibold">Name</th>
                  <th className="p-[.6rem] text-sm text-left font-semibold">Email</th>
                  <th className="p-[.6rem] text-sm text-left font-semibold">State</th>
                  <th className="p-[.6rem] text-sm text-left font-semibold">District</th>
                  <th className="p-[.6rem] text-sm text-left font-semibold">Taluka</th>
                  <th className="p-[.6rem] text-sm text-left font-semibold">Commodities</th>
                  <th className="p-[.6rem] text-sm text-left font-semibold">Access Modules</th>
                  <th className="p-[.6rem] text-sm text-left font-semibold">Status</th>
                  <th className="p-[.6rem] text-sm text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentPageData.map((admin, index) => (
                  <tr 
                    key={admin._id} 
                    className={`hover:bg-gray-50 transition-colors ${admin.isDeleted ? 'bg-red-50' : ''}`}
                  >
                    <td className="p-[.6rem] text-sm text-center">
                      {index + 1 + (currentPage - 1) * rowsPerPage}
                    </td>
                    <td className="p-[.6rem] text-sm">
                      <div className="font-semibold">{admin.name}</div>
                      {admin.isDeleted && (
                        <div className="text-xs text-red-500">(Deleted)</div>
                      )}
                    </td>
                    <td className="p-[.6rem] text-sm">{admin.email}</td>
                    <td className="p-[.6rem] text-sm">{admin.state || '-'}</td>
                    <td className="p-[.6rem] text-sm">{admin.district || '-'}</td>
                    <td className="p-[.6rem] text-sm">{admin.taluka || '-'}</td>
                    <td className="p-[.6rem] text-sm">
                      <div className="flex flex-wrap gap-1">
                        {admin.commodity?.map((commodity, idx) => (
                          <span 
                            key={idx} 
                            className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded text-xs"
                          >
                            {commodity.split(':')[1] || commodity}
                          </span>
                        )) || '-'}
                      </div>
                    </td>
                    <td className="p-[.6rem] text-sm">
                      <div className="flex flex-wrap gap-1">
                        {admin.pageAccess.map(module => (
                          <span 
                            key={module} 
                            className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs"
                          >
                            {module}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-[.6rem] text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${
                        admin.isDeleted 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {admin.isDeleted ? 'Deleted' : 'Active'}
                      </span>
                    </td>
                    <td className="p-[.6rem] text-sm">
                      <div className="flex gap-[.6rem] text-sm">
                        <button
                          onClick={() => { setSelectedAdmin(admin); setViewOpen(true); }}
                          className="p-[.6rem] text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        
                        {!admin.isDeleted && (
                          <button
                            onClick={() => loadAdminForEdit(admin)}
                            className="p-[.6rem] text-sm text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                        )}
                        
                        {admin.isDeleted ? (
                          <>
                            <button
                              onClick={() => { setAdminToRestore(admin); setRestoreOpen(true); }}
                              className="p-[.6rem] text-sm text-green-600 hover:bg-green-50 rounded transition-colors"
                              title="Restore"
                            >
                              <FaTrashRestore />
                            </button>
                            <button
                              onClick={() => { setAdminToDeletePermanently(admin); setPermanentDeleteOpen(true); }}
                              className="p-[.6rem] text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Delete Permanently"
                            >
                              <FaTrashAlt />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => { setSelectedAdmin(admin); setDeleteOpen(true); }}
                            className="p-[.6rem] text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Move to Trash"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-2 p-[.2rem] text-sm">
            {currentPageData.map((admin, index) => (
              <div 
                key={admin._id} 
                className={`rounded p-[.6rem] text-sm border border-zinc-200 shadow ${
                  admin.isDeleted ? 'bg-red-50' : 'bg-white'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-bold text-gray-800">{admin.name}</div>
                    <div className="text-xs text-gray-500">
                      Sr. {index + 1 + (currentPage - 1) * rowsPerPage}
                      {admin.isDeleted && (
                        <span className="ml-2 text-red-500">(Deleted)</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-[.6rem] text-sm">
                    <button onClick={() => { setSelectedAdmin(admin); setViewOpen(true); }} className="p-1.5 text-blue-600">
                      <FaEye />
                    </button>
                    {!admin.isDeleted && (
                      <button onClick={() => loadAdminForEdit(admin)} className="p-1.5 text-green-600">
                        <FaEdit />
                      </button>
                    )}
                    {admin.isDeleted ? (
                      <>
                        <button onClick={() => { setAdminToRestore(admin); setRestoreOpen(true); }} className="p-1.5 text-green-600">
                          <FaTrashRestore />
                        </button>
                        <button onClick={() => { setAdminToDeletePermanently(admin); setPermanentDeleteOpen(true); }} className="p-1.5 text-red-600">
                          <FaTrashAlt />
                        </button>
                      </>
                    ) : (
                      <button onClick={() => { setSelectedAdmin(admin); setDeleteOpen(true); }} className="p-1.5 text-red-600">
                        <FaTrash />
                      </button>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="text-sm text-gray-500">Email</div>
                    <div className="text-sm">{admin.email}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">State</div>
                    <div className="text-sm">{admin.state || '-'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">District</div>
                    <div className="text-sm">{admin.district || '-'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Taluka</div>
                    <div className="text-sm">{admin.taluka || '-'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Commodities</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {admin.commodity?.map((commodity, idx) => (
                        <span 
                          key={idx} 
                          className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded text-xs"
                        >
                          {commodity.split(':')[1] || commodity}
                        </span>
                      )) || '-'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Access Modules</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {admin.pageAccess.map(module => (
                        <span 
                          key={module} 
                          className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs"
                        >
                          {module}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Status</div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      admin.isDeleted 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {admin.isDeleted ? 'Deleted' : 'Active'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Empty State */}
      {!loading && currentPageData.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">
            {showDeleted ? '🗑️' : '👨‍💼'}
          </div>
          <h3 className="text-xl font-semibold mb-2">
            {showDeleted ? 'No deleted sub-admins found' : 'No sub-admins found'}
          </h3>
          <p className="text-gray-500">
            {showDeleted 
              ? 'All deleted sub-admins have been restored or permanently deleted.' 
              : 'Try adjusting your search or add a new sub-admin'}
          </p>
          {!showDeleted && (
            <button
              onClick={() => setOpen(true)}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Add New Sub-Admin
            </button>
          )}
        </div>
      )}

      {/* Pagination */}
      {!loading && subAdmins.length > 0 && (
        <div className="flex flex-col bg-white sm:flex-row p-3 shadow justify-between items-center gap-[.6rem] text-sm">
          <div className="text-gray-600">
            Showing <span className="font-semibold">{1 + (currentPage - 1) * rowsPerPage}-{Math.min(currentPage * rowsPerPage, subAdmins.length)}</span> of{" "}
            <span className="font-semibold">{subAdmins.length}</span> sub-admins
            <select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
              className="p-1 ml-3 border border-zinc-300 rounded"
            >
              {[5, 10, 20, 50, 100].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(_, value) => setCurrentPage(value)}
              color="primary"
              shape="rounded"
              showFirstButton
              showLastButton
              siblingCount={1}
              boundaryCount={1}
            />
          </div>
        </div>
      )}

      {/* ADD/EDIT MODAL */}
      {open && (
        <Modal 
          title={editing ? "Edit Sub-Admin" : "Add New Sub-Admin"} 
          onClose={reset}
        >
          <div className="max-h-[70vh] overflow-y-auto pr-2">
            <Input 
              label="Name" 
              value={form.name} 
              error={errors.name} 
              onChange={v => setForm(p => ({ ...p, name: v }))} 
              placeholder="Enter full name"
              required
            />
            
            <Input 
              label="Email" 
              type="email"
              value={form.email} 
              error={errors.email} 
              onChange={v => setForm(p => ({ ...p, email: v }))} 
              placeholder="Enter email address"
              required
            />
            
            <Input 
              label="Password" 
              type="password"
              value={form.password} 
              error={errors.password} 
              onChange={v => setForm(p => ({ ...p, password: v }))} 
              placeholder={editing ? "Leave blank to keep current password" : "Enter password (min 6 characters)"}
              required={!editing}
            />

            {/* State Dropdown */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State <span className="text-red-500">*</span>
              </label>
              <select
                value={form.state}
                onChange={(e) => setForm(p => ({ ...p, state: e.target.value, district: "", taluka: "" }))}
                className={`border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.state ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select State</option>
                {states.map(state => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
            </div>

            {/* District Dropdown */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                District <span className="text-red-500">*</span>
              </label>
              <select
                value={form.district}
                onChange={(e) => setForm(p => ({ ...p, district: e.target.value, taluka: "" }))}
                disabled={!form.state}
                className={`border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.district ? "border-red-500" : "border-gray-300"
                } ${!form.state ? "bg-gray-100" : ""}`}
              >
                <option value="">Select District</option>
                {filteredDistricts.map(district => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
              {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district}</p>}
            </div>

            {/* Taluka Dropdown */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Taluka <span className="text-red-500">*</span>
              </label>
              <select
                value={form.taluka}
                onChange={(e) => setForm(p => ({ ...p, taluka: e.target.value }))}
                disabled={!form.district}
                className={`border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.taluka ? "border-red-500" : "border-gray-300"
                } ${!form.district ? "bg-gray-100" : ""}`}
              >
                <option value="">Select Taluka</option>
                {filteredTalukas.map(taluka => (
                  <option key={taluka} value={taluka}>
                    {taluka}
                  </option>
                ))}
              </select>
              {errors.taluka && <p className="text-red-500 text-xs mt-1">{errors.taluka}</p>}
            </div>

            {/* Commodities Checkboxes */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Commodities <span className="text-red-500">*</span>
              </label>
              <div className="border rounded p-3 max-h-60 overflow-y-auto">
                {commodityCategories.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    Loading commodities...
                  </div>
                ) : (
                  commodityCategories.map(category => (
                    <div key={category._id} className="mb-3 last:mb-0">
                      {/* Category Header */}
                      <div className="flex items-center gap-2 mb-1">
                        <button
                          onClick={() => toggleCategory(category._id)}
                          className="p-1 text-gray-500 hover:text-gray-700"
                        >
                          {expandedCategories.has(category._id) ? 
                            <FaChevronDown size={12} /> : 
                            <FaChevronRight size={12} />
                          }
                        </button>
                        <label className="flex items-center gap-2 text-sm font-medium">
                          <input
                            type="checkbox"
                            checked={isCategoryChecked(category._id)}
                            onChange={() => handleCategoryCheckboxChange(category._id)}
                            className="rounded"
                          />
                          {category.categoryName}
                          <span className="text-xs text-gray-500">
                            ({category.subCategories.length})
                          </span>
                        </label>
                      </div>
                      
                      {/* Subcategories */}
                      {expandedCategories.has(category._id) && category.subCategories.length > 0 && (
                        <div className="ml-7 pl-1 border-l-2 border-gray-200">
                          <div className="grid grid-cols-2 gap-1 mt-1">
                            {category.subCategories.map(subCategory => (
                              <label key={subCategory._id} className="flex items-center gap-2 text-sm">
                                <input
                                  type="checkbox"
                                  checked={isSubCategoryChecked(category.categoryName, subCategory.subCategoryName)}
                                  onChange={() => handleSubCategoryCheckboxChange(category.categoryName, subCategory.subCategoryName)}
                                  className="rounded"
                                />
                                <span className="truncate">{subCategory.subCategoryName}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
              {errors.commodity && <p className="text-red-500 text-xs mt-1">{errors.commodity}</p>}
            </div>

            {/* Page Access */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Page Access <span className="text-red-500">*</span>
              </label>
              <div className="border rounded p-3 max-h-60 overflow-y-auto">
                <div className="mb-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={areAllModulesSelected()}
                      onChange={handleAllCheckboxChange}
                    />
                    <span className="font-medium">Select All</span>
                  </label>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {allModules.map(module => (
                    <label key={module} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={form.pageAccess.includes(module) || areAllModulesSelected()}
                        disabled={areAllModulesSelected()}
                        onChange={() => handleModuleCheckboxChange(module)}
                      />
                      {module}
                    </label>
                  ))}
                </div>
              </div>
              {errors.pageAccess && <p className="text-red-500 text-xs mt-1">{errors.pageAccess}</p>}
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <button
                onClick={reset}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                {editing ? "Update Sub-Admin" : "Create Sub-Admin"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* VIEW DETAILS MODAL */}
      {viewOpen && selectedAdmin && (
        <Modal 
          title="Sub-Admin Details" 
          onClose={() => { setViewOpen(false); setSelectedAdmin(null); }}
        >
          <div className="space-y-4">
            <DetailRow label="Name" value={selectedAdmin.name} />
            <DetailRow label="Email" value={selectedAdmin.email} />
            <DetailRow label="Password" value="********" />
            <DetailRow label="State" value={selectedAdmin.state || '-'} />
            <DetailRow label="District" value={selectedAdmin.district || '-'} />
            <DetailRow label="Taluka" value={selectedAdmin.taluka || '-'} />
            <div>
              <div className="font-medium text-gray-600 mb-2">Commodities:</div>
              <div className="flex flex-wrap gap-1">
                {selectedAdmin.commodity?.map((commodity, idx) => (
                  <span 
                    key={idx} 
                    className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded text-sm"
                  >
                    {commodity.split(':')[1] || commodity}
                  </span>
                )) || '-'}
              </div>
            </div>
            <div>
              <div className="font-medium text-gray-600 mb-2">Access Modules:</div>
              <div className="flex flex-wrap gap-1">
                {selectedAdmin.pageAccess.map(module => (
                  <span 
                    key={module} 
                    className="bg-blue-50 text-blue-700 px-3 py-1 rounded text-sm"
                  >
                    {module}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="font-medium text-gray-600 mb-2">Status:</div>
              <span className={`px-3 py-1 rounded text-sm ${
                selectedAdmin.isDeleted 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {selectedAdmin.isDeleted ? 'Deleted' : 'Active'}
              </span>
            </div>
            {selectedAdmin.isDeleted && selectedAdmin.deletedAt && (
              <DetailRow label="Deleted On" value={new Date(selectedAdmin.deletedAt).toLocaleDateString()} />
            )}
            {selectedAdmin.createdAt && (
              <DetailRow label="Created" value={new Date(selectedAdmin.createdAt).toLocaleDateString()} />
            )}
            {selectedAdmin.updatedAt && (
              <DetailRow label="Last Updated" value={new Date(selectedAdmin.updatedAt).toLocaleDateString()} />
            )}
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={() => { setViewOpen(false); setSelectedAdmin(null); }}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Close
            </button>
          </div>
        </Modal>
      )}

      {/* SOFT DELETE MODAL */}
      {deleteOpen && selectedAdmin && (
        <Modal 
          title="Move to Trash?" 
          onClose={() => { setDeleteOpen(false); setSelectedAdmin(null); }}
        >
          <div className="text-center">
            <div className="text-yellow-500 text-5xl mb-4">🗑️</div>
            <h2 className="text-xl font-semibold mb-2">Move to Trash?</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to move <span className="font-semibold">{selectedAdmin.name}</span> to trash? 
              This action can be reversed by restoring from the deleted items view.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => { setDeleteOpen(false); setSelectedAdmin(null); }}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
              >
                Move to Trash
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* RESTORE MODAL */}
      {restoreOpen && adminToRestore && (
        <Modal 
          title="Restore Sub-Admin?" 
          onClose={() => { setRestoreOpen(false); setAdminToRestore(null); }}
        >
          <div className="text-center">
            <div className="text-green-500 text-5xl mb-4">♻️</div>
            <h2 className="text-xl font-semibold mb-2">Restore Sub-Admin?</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to restore <span className="font-semibold">{adminToRestore.name}</span>? 
              This will make the account active again.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => { setRestoreOpen(false); setAdminToRestore(null); }}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRestore}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                Restore Sub-Admin
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* PERMANENT DELETE MODAL */}
      {permanentDeleteOpen && adminToDeletePermanently && (
        <Modal 
          title="Delete Permanently?" 
          onClose={() => { setPermanentDeleteOpen(false); setAdminToDeletePermanently(null); }}
        >
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold mb-2">Delete Permanently?</h2>
            <p className="text-gray-600 mb-2">
              Are you sure you want to permanently delete <span className="font-semibold">{adminToDeletePermanently.name}</span>?
            </p>
            <p className="text-red-600 mb-6 font-semibold">
              ⚠️ This action cannot be undone! All data will be lost forever.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => { setPermanentDeleteOpen(false); setAdminToDeletePermanently(null); }}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePermanentDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

const Modal = ({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3 backdrop-blur-sm">
    <div className="bg-white p-6 rounded-xl w-full max-w-2xl shadow-2xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-xl text-gray-800">{title}</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-xl"
        >
          ✕
        </button>
      </div>
      {children}
    </div>
  </div>
);

const Input = ({ 
  label, 
  value, 
  error, 
  onChange, 
  type = "text",
  placeholder = "",
  required = false 
}: { 
  label: string; 
  value: string; 
  error?: string; 
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      className={`border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-500 ${
        error ? "border-red-500" : "border-gray-300"
      }`}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex border-b pb-2 mb-2 last:border-0 last:pb-0 last:mb-0">
    <div className="w-32 font-medium text-gray-600">{label}:</div>
    <div className="flex-1 text-gray-900">{value}</div>
  </div>
);