

// // // /* eslint-disable @typescript-eslint/no-explicit-any */
// // // /* eslint-disable @typescript-eslint/no-explicit-any */
// // // /* eslint-disable @typescript-eslint/no-explicit-any */
// // // "use client";

// // // import { useState, useEffect, useCallback, useRef } from "react";
// // // import {
// // //   FaEye,
// // //   FaTrash,
// // //   FaPrint,
// // //   FaCopy,
// // //   FaFileExcel,
// // //   FaFileCsv,
// // //   FaFilePdf,
// // //   FaSearch,
// // //   FaRedo,
// // //   FaCheck,
// // //   FaEdit,
// // //   FaPlus,
// // //   FaUserTie,
// // //   FaUser,
// // // } from "react-icons/fa";
// // // import * as XLSX from "xlsx";
// // // import jsPDF from "jspdf";
// // // import autoTable from "jspdf-autotable";
// // // import axios from "axios";
// // // import toast from "react-hot-toast";
// // // import { Pagination, Dialog } from "@mui/material";

// // // /* ================= TYPES ================= */

// // // interface Agent {
// // //   _id: string;
// // //   farmerId?: string;
// // //   personalInfo: {
// // //     name: string;
// // //     mobileNo: string;
// // //     email: string;
// // //     address?: string;
// // //     villageGramaPanchayat?: string;
// // //     pincode?: string;
// // //     state?: string;
// // //     district?: string;
// // //     taluk?: string;
// // //     post?: string;
// // //   };
// // //   role: "farmer" | "trader";
// // //   farmLocation?: {
// // //     latitude?: string;
// // //     longitude?: string;
// // //   };
// // //   farmLand?: {
// // //     total?: number | null;
// // //     cultivated?: number | null;
// // //     uncultivated?: number | null;
// // //   };
// // //   commodities?: string[];
// // //   nearestMarkets?: string[];
// // //   bankDetails?: {
// // //     accountHolderName?: string;
// // //     accountNumber?: string;
// // //     ifscCode?: string;
// // //     branch?: string;
// // //   };
// // //   documents?: {
// // //     panCard?: string;
// // //     aadharFront?: string;
// // //     aadharBack?: string;
// // //     bankPassbook?: string;
// // //   };
// // //   security?: {
// // //     referralCode?: string;
// // //     mpin?: string;
// // //     password?: string;
// // //   };
// // //   isActive?: boolean;
// // //   registeredAt?: string;
// // //   registrationStatus?: string;
// // //   subcategories?: string[];
// // //   __v?: number;
// // // }

// // // interface ApiResponse {
// // //   success: boolean;
// // //   data: Agent[];
// // //   page: number;
// // //   limit: number;
// // //   total: number;
// // //   totalPages?: number;
// // // }

// // // interface District {
// // //   _id: string;
// // //   name: string;
// // // }

// // // /* ================= PAGE ================= */

// // // export default function AgentsPage() {
// // //   const [agents, setAgents] = useState<Agent[]>([]);
// // //   const [search, setSearch] = useState("");
// // //   const [currentPage, setCurrentPage] = useState(1);
// // //   const [rowsPerPage, setRowsPerPage] = useState(10);
// // //   const [totalPages, setTotalPages] = useState(1);
// // //   const [totalAgents, setTotalAgents] = useState(0);
// // //   const [loading, setLoading] = useState(true);
// // //   const [error, setError] = useState<string | null>(null);

// // //   const [viewOpen, setViewOpen] = useState(false);
// // //   const [addOpen, setAddOpen] = useState(false);
// // //   const [editOpen, setEditOpen] = useState(false);
// // //   const [deleteOpen, setDeleteOpen] = useState(false);
// // //   const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
// // //   const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
// // //   const [districtsLoading, setDistrictsLoading] = useState(false);
// // //   const [districts, setDistricts] = useState<District[]>([]);
// // //   const [disName, setDisName] = useState("");

// // //   // Role filter state
// // //   const [roleFilter, setRoleFilter] = useState<string>("trader");

// // //   // Bulk selection state
// // //   const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
// // //   const [selectAll, setSelectAll] = useState(false);

// // //   // Form state
// // //   const [form, setForm] = useState({
// // //     // PERSONAL INFO
// // //     name: "",
// // //     mobileNo: "",
// // //     email: "",
// // //     address: "",
// // //     villageGramaPanchayat: "",
// // //     pincode: "",
// // //     state: "",
// // //     district: "",
// // //     taluk: "",
// // //     post: "",

// // //     // ROLE
// // //     role: "trader" as "farmer" | "trader",

// // //     // FARM LOCATION (for farmers)
// // //     latitude: "",
// // //     longitude: "",

// // //     // FARM LAND (for farmers)
// // //     totalLand: "",
// // //     cultivatedLand: "",
// // //     uncultivatedLand: "",

// // //     // COMMODITIES (array of strings)
// // //     commodities: [] as string[],

// // //     // BANK DETAILS
// // //     accountHolderName: "",
// // //     accountNumber: "",
// // //     ifscCode: "",
// // //     branch: "",

// // //     // DOCUMENTS (file paths)
// // //     panCard: "",
// // //     aadharFront: "",
// // //     aadharBack: "",
// // //     bankPassbook: "",

// // //     // SECURITY
// // //     referralCode: "",
// // //     mpin: "",
// // //     password: "",
// // //     isActive: true,
// // //   });

// // //   // Commodities list
// // //   const [availableCommodities] = useState([
// // //     { id: "693677edee676f11684d9fca", name: "Wheat" },
// // //     { id: "693677f4ee676f11684d9fcd", name: "Rice" },
// // //     { id: "693678b199b054014447fc07", name: "Corn" },
// // //     { id: "693914277cf4448c0924fa6e", name: "Soybean" },
// // //     { id: "694a69367920614e33fd2939", name: "Other" },
// // //   ]);

// // //   // Track initial load
// // //   const initialLoadRef = useRef(true);

// // //   /* ================= FETCH AGENTS ================= */

// // //   const fetchAgents = async (page: number = 1, searchQuery: string = "", districtName: string = "", role: string = "all") => {
// // //     try {
// // //       if (!initialLoadRef.current) {
// // //         setLoading(true);
// // //       }
// // //       setError(null);
      
// // //       const params: any = {
// // //         page: page.toString(),
// // //         limit: rowsPerPage.toString(),
// // //         search: searchQuery,
// // //       };

// // //       if (districtName) {
// // //         params.district = districtName;
// // //       }

// // //       if (role && role !== "all") {
// // //         params.role = role;
// // //       }

// // //       console.log("Fetching agents with params:", params); // Debug log

// // //       const res = await axios.get<ApiResponse>(`/api/farmers`, { params });
      
// // //       if (res.data.success) {
// // //         console.log("API Response:", res.data); // Debug log
// // //         const processedAgents = res.data.data.map(agent => ({
// // //           ...agent,
// // //           personalInfo: agent.personalInfo || {
// // //             name: "",
// // //             mobileNo: "",
// // //             email: "",
// // //             address: "",
// // //             villageGramaPanchayat: "",
// // //             pincode: "",
// // //             state: "",
// // //             district: "",
// // //             taluk: "",
// // //             post: ""
// // //           },
// // //           role: agent.role || "trader",
// // //           isActive: agent.isActive ?? true
// // //         }));
        
// // //         setAgents(processedAgents);
// // //         setTotalAgents(res.data.total);
// // //         const calculatedTotalPages = Math.ceil(res.data.total / rowsPerPage);
// // //         setTotalPages(res.data.totalPages || calculatedTotalPages);
// // //         setCurrentPage(res.data.page);
// // //         setSelectedAgents([]);
// // //         setSelectAll(false);
// // //       }
// // //     } catch (err: any) {
// // //       console.error('Error fetching agents:', err);
// // //       setError(err.response?.data?.message || 'Failed to load agents. Please try again.');
// // //       setAgents([]);
// // //       toast.error(err.response?.data?.message || "Failed to load agents");
// // //     } finally {
// // //       if (!initialLoadRef.current) {
// // //         setLoading(false);
// // //       }
// // //     }
// // //   };

// // //   const fetchDistricts = useCallback(async () => {
// // //     setDistrictsLoading(true);
// // //     try {
// // //       const response = await axios.get("/api/districts", {
// // //         params: { 
// // //           limit: 100,
// // //           page: 1
// // //         }
// // //       });
// // //       if (response.data.success) {
// // //         setDistricts(response.data.data);
// // //       }
// // //     } catch (error: any) {
// // //       console.error("Error fetching districts:", error);
// // //       toast.error("Failed to load districts");
// // //     } finally {
// // //       setDistrictsLoading(false);
// // //     }
// // //   }, []);

// // //   // Initial data fetch
// // //   useEffect(() => {
// // //     const fetchInitialData = async () => {
// // //       try {
// // //         setLoading(true);
// // //         setError(null);
        
// // //         // Fetch districts
// // //         const districtsRes = await axios.get("/api/districts", {
// // //           params: { limit: 100, page: 1 }
// // //         });
        
// // //         if (districtsRes.data.success) {
// // //           setDistricts(districtsRes.data.data);
// // //         }

// // //         // Fetch agents
// // //         await fetchAgents(1, "", "", roleFilter);

// // //       } catch (err: any) {
// // //         console.error('Error in initial data fetch:', err);
// // //         setError('Failed to load data. Please try again.');
// // //         toast.error("Failed to load data");
// // //       } finally {
// // //         setLoading(false);
// // //         initialLoadRef.current = false;
// // //       }
// // //     };

// // //     fetchInitialData();
// // //   }, []);

// // //   // Handle subsequent fetches
// // //   useEffect(() => {
// // //     if (initialLoadRef.current) return;
// // //     fetchAgents(currentPage, search, disName, roleFilter);
// // //   }, [currentPage, rowsPerPage, disName, roleFilter]);

// // //   // Debounced search
// // //   useEffect(() => {
// // //     if (initialLoadRef.current) return;
    
// // //     const timer = setTimeout(() => {
// // //       fetchAgents(1, search, disName, roleFilter);
// // //       setCurrentPage(1);
// // //     }, 500);

// // //     return () => clearTimeout(timer);
// // //   }, [search, roleFilter]);

// // //   /* ================= SELECTION HANDLERS ================= */

// // //   const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
// // //     if (e.target.checked) {
// // //       const allAgentIds = agents.map(agent => agent._id);
// // //       setSelectedAgents(allAgentIds);
// // //       setSelectAll(true);
// // //     } else {
// // //       setSelectedAgents([]);
// // //       setSelectAll(false);
// // //     }
// // //   };

// // //   const handleSelectOne = (id: string, checked: boolean) => {
// // //     if (checked) {
// // //       setSelectedAgents([...selectedAgents, id]);
// // //     } else {
// // //       setSelectedAgents(selectedAgents.filter(agentId => agentId !== id));
// // //       setSelectAll(false);
// // //     }
// // //   };

// // //   /* ================= FORM HANDLERS ================= */

// // //   const handleChange = (
// // //     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
// // //   ) => {
// // //     const { name, value, type } = e.target;
// // //     const checked = (e.target as HTMLInputElement).checked;

// // //     if (type === 'checkbox' && name === 'commodities') {
// // //       const commodityId = value;
// // //       setForm(prev => ({
// // //         ...prev,
// // //         commodities: prev.commodities.includes(commodityId)
// // //           ? prev.commodities.filter(id => id !== commodityId)
// // //           : [...prev.commodities, commodityId]
// // //       }));
// // //     } else if (type === 'checkbox') {
// // //       setForm(prev => ({
// // //         ...prev,
// // //         [name]: checked,
// // //       }));
// // //     } else {
// // //       setForm(prev => ({
// // //         ...prev,
// // //         [name]: value,
// // //       }));
// // //     }
// // //   };

// // //   const handlePincodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
// // //     const pincode = e.target.value;
// // //     setForm(prev => ({ ...prev, pincode }));

// // //     if (pincode.length === 6) {
// // //       try {
// // //         const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
// // //         const data = await res.json();

// // //         if (data[0].Status === "Success") {
// // //           const po = data[0].PostOffice[0];
// // //           setForm(prev => ({
// // //             ...prev,
// // //             post: po.Name,
// // //             taluk: po.Block || po.Taluk || '',
// // //             district: po.District,
// // //             state: po.State,
// // //           }));
// // //         }
// // //       } catch {
// // //         console.error("Invalid pincode");
// // //       }
// // //     }
// // //   };

// // //   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// // //     const { name, files } = e.target;
// // //     if (files && files[0]) {
// // //       const fileName = files[0].name;
// // //       setForm(prev => ({
// // //         ...prev,
// // //         [name]: `/uploads/${fileName}`,
// // //       }));
// // //       toast.success(`${name} file selected: ${fileName}`);
// // //     }
// // //   };

// // //   const resetForm = () => {
// // //     setForm({
// // //       name: "",
// // //       mobileNo: "",
// // //       email: "",
// // //       address: "",
// // //       villageGramaPanchayat: "",
// // //       pincode: "",
// // //       state: "",
// // //       district: "",
// // //       taluk: "",
// // //       post: "",
// // //       role: "trader",
// // //       latitude: "",
// // //       longitude: "",
// // //       totalLand: "",
// // //       cultivatedLand: "",
// // //       uncultivatedLand: "",
// // //       commodities: [],
// // //       accountHolderName: "",
// // //       accountNumber: "",
// // //       ifscCode: "",
// // //       branch: "",
// // //       panCard: "",
// // //       aadharFront: "",
// // //       aadharBack: "",
// // //       bankPassbook: "",
// // //       referralCode: "",
// // //       mpin: "",
// // //       password: "",
// // //       isActive: true,
// // //     });
// // //   };

// // //   const populateFormForEdit = (agent: Agent) => {
// // //     const personalInfo = agent.personalInfo;
// // //     setForm({
// // //       name: personalInfo.name || "",
// // //       mobileNo: personalInfo.mobileNo || "",
// // //       email: personalInfo.email || "",
// // //       address: personalInfo.address || "",
// // //       villageGramaPanchayat: personalInfo.villageGramaPanchayat || "",
// // //       pincode: personalInfo.pincode || "",
// // //       state: personalInfo.state || "",
// // //       district: personalInfo.district || "",
// // //       taluk: personalInfo.taluk || "",
// // //       post: personalInfo.post || "",
// // //       role: agent.role || "trader",
// // //       latitude: agent.farmLocation?.latitude || "",
// // //       longitude: agent.farmLocation?.longitude || "",
// // //       totalLand: agent.farmLand?.total?.toString() || "",
// // //       cultivatedLand: agent.farmLand?.cultivated?.toString() || "",
// // //       uncultivatedLand: agent.farmLand?.uncultivated?.toString() || "",
// // //       commodities: agent.commodities || [],
// // //       accountHolderName: agent.bankDetails?.accountHolderName || "",
// // //       accountNumber: agent.bankDetails?.accountNumber || "",
// // //       ifscCode: agent.bankDetails?.ifscCode || "",
// // //       branch: agent.bankDetails?.branch || "",
// // //       panCard: agent.documents?.panCard || "",
// // //       aadharFront: agent.documents?.aadharFront || "",
// // //       aadharBack: agent.documents?.aadharBack || "",
// // //       bankPassbook: agent.documents?.bankPassbook || "",
// // //       referralCode: agent.security?.referralCode || "",
// // //       mpin: "",
// // //       password: "",
// // //       isActive: agent.isActive ?? true,
// // //     });
// // //     setSelectedAgent(agent);
// // //     setEditOpen(true);
// // //   };

// // //   /* ================= CRUD OPERATIONS ================= */

// // //   const handleAdd = async (e: React.FormEvent) => {
// // //     e.preventDefault();
// // //     try {
// // //       setLoading(true);
      
// // //       const agentData = {
// // //         personalInfo: {
// // //           name: form.name,
// // //           mobileNo: form.mobileNo,
// // //           email: form.email,
// // //           address: form.address,
// // //           villageGramaPanchayat: form.villageGramaPanchayat,
// // //           pincode: form.pincode,
// // //           state: form.state,
// // //           district: form.district,
// // //           taluk: form.taluk,
// // //           post: form.post,
// // //         },
// // //         role: form.role,
// // //         farmLocation: form.role === "farmer" ? {
// // //           latitude: form.latitude,
// // //           longitude: form.longitude,
// // //         } : undefined,
// // //         farmLand: form.role === "farmer" ? {
// // //           total: form.totalLand ? Number(form.totalLand) : null,
// // //           cultivated: form.cultivatedLand ? Number(form.cultivatedLand) : null,
// // //           uncultivated: form.uncultivatedLand ? Number(form.uncultivatedLand) : null,
// // //         } : undefined,
// // //         commodities: form.commodities,
// // //         nearestMarkets: [],
// // //         bankDetails: {
// // //           accountHolderName: form.accountHolderName,
// // //           accountNumber: form.accountNumber,
// // //           ifscCode: form.ifscCode,
// // //           branch: form.branch,
// // //         },
// // //         documents: form.panCard || form.aadharFront || form.aadharBack || form.bankPassbook ? {
// // //           panCard: form.panCard,
// // //           aadharFront: form.aadharFront,
// // //           aadharBack: form.aadharBack,
// // //           bankPassbook: form.bankPassbook,
// // //         } : undefined,
// // //         security: {
// // //           referralCode: form.referralCode,
// // //           mpin: form.mpin,
// // //           password: form.password,
// // //         },
// // //         isActive: form.isActive,
// // //       };

// // //       //console.log("Sending agent data:", agentData); // Debug log

// // //       const res = await axios.post("/api/farmers", agentData);
      
// // //       if (res.data.success) {
// // //         toast.success("Agent added successfully!");
// // //         setAddOpen(false);
// // //         resetForm();
// // //         fetchAgents(currentPage, search, disName, roleFilter);
// // //       }
// // //     } catch (err: any) {
// // //       //console.error("Error adding agent:", err);
// // //       toast.error(err.response?.data?.message || "Failed to add agent");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const handleEdit = async (e: React.FormEvent) => {
// // //     e.preventDefault();
// // //     if (!selectedAgent) return;
    
// // //     try {
// // //       setLoading(true);
      
// // //       const agentData = {
// // //         personalInfo: {
// // //           name: form.name,
// // //           mobileNo: form.mobileNo,
// // //           email: form.email,
// // //           address: form.address,
// // //           villageGramaPanchayat: form.villageGramaPanchayat,
// // //           pincode: form.pincode,
// // //           state: form.state,
// // //           district: form.district,
// // //           taluk: form.taluk,
// // //           post: form.post,
// // //         },
// // //         role: form.role,
// // //         farmLocation: form.role === "farmer" ? {
// // //           latitude: form.latitude,
// // //           longitude: form.longitude,
// // //         } : undefined,
// // //         farmLand: form.role === "farmer" ? {
// // //           total: form.totalLand ? Number(form.totalLand) : null,
// // //           cultivated: form.cultivatedLand ? Number(form.cultivatedLand) : null,
// // //           uncultivated: form.uncultivatedLand ? Number(form.uncultivatedLand) : null,
// // //         } : undefined,
// // //         commodities: form.commodities,
// // //         bankDetails: {
// // //           accountHolderName: form.accountHolderName,
// // //           accountNumber: form.accountNumber,
// // //           ifscCode: form.ifscCode,
// // //           branch: form.branch,
// // //         },
// // //         documents: form.panCard || form.aadharFront || form.aadharBack || form.bankPassbook ? {
// // //           panCard: form.panCard,
// // //           aadharFront: form.aadharFront,
// // //           aadharBack: form.aadharBack,
// // //           bankPassbook: form.bankPassbook,
// // //         } : undefined,
// // //         security: {
// // //           referralCode: form.referralCode,
// // //           ...(form.mpin && { mpin: form.mpin }),
// // //           ...(form.password && { password: form.password }),
// // //         },
// // //         isActive: form.isActive,
// // //       };

// // //       const res = await axios.put(`/api/farmers/${selectedAgent._id}`, agentData);
      
// // //       if (res.data.success) {
// // //         toast.success("Agent updated successfully!");
// // //         setEditOpen(false);
// // //         resetForm();
// // //         setSelectedAgent(null);
// // //         fetchAgents(currentPage, search, disName, roleFilter);
// // //       }
// // //     } catch (err: any) {
// // //      // console.error("Error updating agent:", err);
// // //       toast.error(err.response?.data?.message || "Failed to update agent");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const handleDelete = async () => {
// // //     if (!selectedAgent) return;
   
// // //     try {
// // //       setLoading(true);
// // //       await axios.delete(`/api/farmers/${selectedAgent._id}`);
// // //       toast.success("Agent deleted successfully!");
// // //       setDeleteOpen(false);
// // //       setSelectedAgent(null);
// // //       fetchAgents(currentPage, search, disName, roleFilter);
// // //     } catch (error: any) {
// // //       //console.error("Error deleting agent:", error);
// // //       toast.error(error.response?.data?.message || "Failed to delete agent. Please try again.");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const handleBulkDelete = async () => {
// // //     if (selectedAgents.length === 0) {
// // //       toast.error("No agents selected");
// // //       return;
// // //     }

// // //     try {
// // //       setLoading(true);
// // //       const response = await axios.post("/api/farmers/bulk-delete", {
// // //         ids: selectedAgents
// // //       });
      
// // //       if (response.data.success) {
// // //         toast.success(response.data.message || `${selectedAgents.length} agents deleted successfully!`);
// // //         setSelectedAgents([]);
// // //         setSelectAll(false);
// // //         setBulkDeleteOpen(false);
// // //         fetchAgents(currentPage, search, disName, roleFilter);
// // //       } else {
// // //         toast.error("Failed to delete agents");
// // //       }
// // //     } catch (error: any) {
// // //       console.error("Bulk delete error:", error);
// // //       toast.error("Error deleting agents");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   /* ================= EXPORT FUNCTIONS ================= */

// // //   const exportData = agents.map((agent, index) => {
// // //     const personalInfo = agent.personalInfo;
// // //     return {
// // //       "Sr.": index + 1 + (currentPage - 1) * rowsPerPage,
// // //       "Name": personalInfo.name || 'N/A',
// // //       "Mobile": personalInfo.mobileNo || 'N/A',
// // //       "Email": personalInfo.email || 'N/A',
// // //       "Role": agent.role || 'N/A',
// // //       "Village": personalInfo.villageGramaPanchayat || 'N/A',
// // //       "District": personalInfo.district || 'N/A',
// // //       "State": personalInfo.state || 'N/A',
// // //       "Address": personalInfo.address || 'N/A',
// // //       "Taluk": personalInfo.taluk || 'N/A',
// // //       "Post": personalInfo.post || 'N/A',
// // //       "Pincode": personalInfo.pincode || 'N/A',
// // //       "Status": agent.isActive ? "Active" : "Inactive",
// // //       "Registered": agent.registeredAt ? new Date(agent.registeredAt).toLocaleDateString() : 'N/A',
// // //     };
// // //   });

// // //   const handlePrint = () => {
// // //     if (agents.length === 0) {
// // //       toast.error("No agents to print");
// // //       return;
// // //     }

// // //     const printWindow = window.open('', '_blank', 'width=900,height=700');
// // //     if (!printWindow) {
// // //       toast.error("Please allow popups to print");
// // //       return;
// // //     }

// // //     const printDate = new Date().toLocaleDateString();
// // //     const printTime = new Date().toLocaleTimeString();
    
// // //     const printContent = `
// // //       <!DOCTYPE html>
// // //       <html>
// // //       <head>
// // //         <title>Agents Report</title>
// // //         <style>
// // //           body {
// // //             font-family: Arial, sans-serif;
// // //             margin: 20px;
// // //             color: #333;
// // //           }
// // //           .header {
// // //             text-align: center;
// // //             margin-bottom: 30px;
// // //             padding-bottom: 15px;
// // //             border-bottom: 2px solid #4CAF50;
// // //           }
// // //           .header h1 {
// // //             margin: 0 0 10px 0;
// // //             color: #1f2937;
// // //             font-size: 24px;
// // //           }
// // //           .header-info {
// // //             color: #6b7280;
// // //             font-size: 14px;
// // //             margin: 5px 0;
// // //           }
// // //           table {
// // //             width: 100%;
// // //             border-collapse: collapse;
// // //             margin-top: 20px;
// // //             font-size: 12px;
// // //           }
// // //           th {
// // //             background-color: #f3f4f6;
// // //             color: #374151;
// // //             font-weight: 600;
// // //             padding: 12px 8px;
// // //             text-align: left;
// // //             border: 1px solid #d1d5db;
// // //           }
// // //           td {
// // //             padding: 10px 8px;
// // //             border: 1px solid #e5e7eb;
// // //             vertical-align: top;
// // //           }
// // //           tr:nth-child(even) {
// // //             background-color: #f9fafb;
// // //           }
// // //           .footer {
// // //             margin-top: 40px;
// // //             padding-top: 20px;
// // //             border-top: 1px solid #e5e7eb;
// // //             font-size: 12px;
// // //             color: #6b7280;
// // //             text-align: center;
// // //           }
// // //           @media print {
// // //             @page {
// // //               margin: 0.5in;
// // //             }
// // //             body {
// // //               margin: 0;
// // //               -webkit-print-color-adjust: exact;
// // //             }
// // //           }
// // //         </style>
// // //       </head>
// // //       <body>
// // //         <div class="header">
// // //           <h1>👤 Agents Management Report</h1>
// // //           <div class="header-info">Generated on: ${printDate} at ${printTime}</div>
// // //           <div class="header-info">Total Agents: ${totalAgents} | Showing: ${agents.length} agents</div>
// // //           <div class="header-info">Page: ${currentPage} of ${totalPages}</div>
// // //           <div class="header-info">Role Filter: ${roleFilter === "all" ? "All Roles" : roleFilter}</div>
// // //         </div>
        
// // //         <table>
// // //           <thead>
// // //             <tr>
// // //               <th>Sr.</th>
// // //               <th>Name</th>
// // //               <th>Mobile</th>
// // //               <th>Email</th>
// // //               <th>Role</th>
// // //               <th>Village</th>
// // //               <th>District</th>
// // //               <th>State</th>
// // //               <th>Status</th>
// // //               <th>Registered Date</th>
// // //             </tr>
// // //           </thead>
// // //           <tbody>
// // //             ${agents.map((agent, index) => {
// // //               const personalInfo = agent.personalInfo;
// // //               return `
// // //                 <tr>
// // //                   <td>${index + 1 + (currentPage - 1) * rowsPerPage}</td>
// // //                   <td><strong>${personalInfo.name || 'N/A'}</strong></td>
// // //                   <td>${personalInfo.mobileNo || 'N/A'}</td>
// // //                   <td>${personalInfo.email || 'N/A'}</td>
// // //                   <td>${agent.role || 'N/A'}</td>
// // //                   <td>${personalInfo.villageGramaPanchayat || 'N/A'}</td>
// // //                   <td>${personalInfo.district || 'N/A'}</td>
// // //                   <td>${personalInfo.state || 'N/A'}</td>
// // //                   <td>${agent.isActive ? 'Active' : 'Inactive'}</td>
// // //                   <td>${agent.registeredAt ? new Date(agent.registeredAt).toLocaleDateString() : 'N/A'}</td>
// // //                 </tr>
// // //               `;
// // //             }).join('')}
// // //           </tbody>
// // //         </table>
        
// // //         <div class="footer">
// // //           <p>Printed from Kissan Partner System | ${window.location.hostname}</p>
// // //           <p>© ${new Date().getFullYear()} Kissan Partner. All rights reserved.</p>
// // //         </div>
        
// // //         <script>
// // //           window.onload = function() {
// // //             window.print();
// // //             setTimeout(() => {
// // //               if (confirm('Close print window?')) {
// // //                 window.close();
// // //               }
// // //             }, 100);
// // //           };
// // //         </script>
// // //       </body>
// // //       </html>
// // //     `;

// // //     printWindow.document.write(printContent);
// // //     printWindow.document.close();
// // //   };

// // //   const handleCopy = async () => {
// // //     if (agents.length === 0) {
// // //       toast.error("No agents to copy");
// // //       return;
// // //     }

// // //     const text = exportData.map(f => 
// // //       `${f["Sr."]}\t${f.Name}\t${f.Mobile}\t${f.Email}\t${f.Role}\t${f.Village}\t${f.District}\t${f.State}\t${f.Status}\t${f.Registered}`
// // //     ).join("\n");
    
// // //     try {
// // //       await navigator.clipboard.writeText(text);
// // //       toast.success("Agents data copied to clipboard!");
// // //     } catch (err) {
// // //       toast.error("Failed to copy to clipboard");
// // //     }
// // //   };

// // //   const handleExcel = () => {
// // //     if (agents.length === 0) {
// // //       toast.error("No agents to export");
// // //       return;
// // //     }

// // //     try {
// // //       const ws = XLSX.utils.json_to_sheet(exportData);
// // //       const wb = XLSX.utils.book_new();
// // //       XLSX.utils.book_append_sheet(wb, ws, "Agents");
// // //       XLSX.writeFile(wb, `agents-${new Date().toISOString().split('T')[0]}.xlsx`);
// // //       toast.success("Excel file exported successfully!");
// // //     } catch (err) {
// // //       toast.error("Failed to export Excel file");
// // //     }
// // //   };

// // //   const handleCSV = () => {
// // //     if (agents.length === 0) {
// // //       toast.error("No agents to export");
// // //       return;
// // //     }

// // //     try {
// // //       const ws = XLSX.utils.json_to_sheet(exportData);
// // //       const csv = XLSX.utils.sheet_to_csv(ws);
// // //       const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
// // //       const a = document.createElement("a");
// // //       a.href = URL.createObjectURL(blob);
// // //       a.download = `agents-${new Date().toISOString().split('T')[0]}.csv`;
// // //       a.click();
// // //       toast.success("CSV file exported successfully!");
// // //     } catch (err) {
// // //       toast.error("Failed to export CSV file");
// // //     }
// // //   };

// // //   const handlePDF = () => {
// // //     if (agents.length === 0) {
// // //       toast.error("No agents to export");
// // //       return;
// // //     }

// // //     try {
// // //       const doc = new jsPDF();
// // //       doc.text("Agents Management Report", 14, 16);
      
// // //       const tableColumn = ["Sr.", "Name", "Mobile", "Email", "Role", "Village", "District", "State", "Status"];
// // //       const tableRows: any = exportData.map(f => [
// // //         f["Sr."],
// // //         f.Name,
// // //         f.Mobile,
// // //         f.Email,
// // //         f.Role,
// // //         f.Village,
// // //         f.District,
// // //         f.State,
// // //         f.Status,
// // //       ]);
      
// // //       autoTable(doc, {
// // //         head: [tableColumn],
// // //         body: tableRows,
// // //         startY: 20,
// // //         styles: { fontSize: 8 },
// // //         headStyles: { fillColor: [76, 175, 80] },
// // //       });
      
// // //       doc.save(`agents-${new Date().toISOString().split('T')[0]}.pdf`);
// // //       toast.success("PDF file exported successfully!");
// // //     } catch (err) {
// // //       toast.error("Failed to export PDF file");
// // //     }
// // //   };

// // //   /* ================= RESET FILTERS ================= */

// // //   const handleResetFilters = () => {
// // //     setSearch("");
// // //     setCurrentPage(1);
// // //     setDisName("");
// // //     setSelectedAgents([]);
// // //     setSelectAll(false);
// // //     fetchAgents(1, "", "", "trader");
// // //   };

// // //   /* ================= GET ROLE BADGE ================= */

// // //   const getRoleBadge = (role: string) => {
// // //     switch (role) {
// // //       case "trader":
// // //         return "bg-purple-100 text-purple-800";
// // //       case "farmer":
// // //         return "bg-blue-100 text-blue-800";
// // //       default:
// // //         return "bg-gray-100 text-gray-800";
// // //     }
// // //   };

// // //   const getRoleIcon = (role: string) => {
// // //     switch (role) {
// // //       case "trader":
// // //         return <FaUserTie className="inline mr-1" />;
// // //       case "farmer":
// // //         return <FaUser className="inline mr-1" />;
// // //       default:
// // //         return null;
// // //     }
// // //   };

// // //   /* ================= UI ================= */

// // //   return (
// // //     <div className="p-[.6rem] relative text-black text-sm md:p-1 overflow-x-auto min-h-screen">
// // //       {/* Loading Overlay */}
// // //       {loading && (
// // //         <div className="absolute inset-0 bg-[#e9e7e72f] z-[100] flex items-center justify-center ">
// // //           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
// // //         </div>
// // //       )}

// // //       {/* Header Section */}
// // //       <div className="mb-4 flex gap-y-2 flex-wrap justify-between items-center">
// // //         <div>
// // //           <h1 className="text-2xl md:text-2xl font-bold text-gray-800">Agents Management</h1>
// // //           <p className="text-gray-600 mt-2">
// // //             Overview and detailed management of all registered agents. {totalAgents} agents found.
// // //             {roleFilter !== "all" && (
// // //               <span className="ml-2 font-medium">Role: {roleFilter}</span>
// // //             )}
// // //           </p>
// // //         </div>
// // //         <button 
// // //           onClick={() => setAddOpen(true)}
// // //           className="bg-green-500 p-2 px-4 text-white rounded shadow-2xl cursor-pointer flex items-center gap-2 hover:bg-green-600 transition-colors"
// // //         >
// // //           <FaPlus /> Add Agent
// // //         </button>
// // //       </div>

// // //       {/* Add New Agent Dialog */}
// // //       <Dialog open={addOpen} onClose={() => { setAddOpen(false); resetForm(); }} maxWidth="lg" fullWidth>
// // //         <div className="p-6 max-h-[90vh] overflow-y-auto">
// // //           <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Agent</h2>
// // //           <form onSubmit={handleAdd} className="space-y-8">
// // //             {/* PERSONAL INFO */}
// // //             <section className="bg-gray-50 p-6 rounded-lg">
// // //               <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Personal Information</h3>
// // //               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
// // //                 <div>
// // //                   <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
// // //                   <input name="name" value={form.name} onChange={handleChange} required className="input-field" placeholder="Enter full name" />
// // //                 </div>
// // //                 <div>
// // //                   <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
// // //                   <input name="mobileNo" value={form.mobileNo} onChange={handleChange} required className="input-field" placeholder="Enter mobile number" type="tel" />
// // //                 </div>
// // //                 <div>
// // //                   <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
// // //                   <input name="email" value={form.email} onChange={handleChange} className="input-field" placeholder="Enter email address" type="email" />
// // //                 </div>
// // //                 <div className="md:col-span-2">
// // //                   <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
// // //                   <input name="address" value={form.address} onChange={handleChange} className="input-field" placeholder="Enter complete address" />
// // //                 </div>
// // //                 <div>
// // //                   <label className="block text-sm font-medium text-gray-700 mb-1">Village/Grama Panchayat</label>
// // //                   <input name="villageGramaPanchayat" value={form.villageGramaPanchayat} onChange={handleChange} className="input-field" placeholder="Enter village name" />
// // //                 </div>
// // //                 <div>
// // //                   <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
// // //                   <input name="pincode" value={form.pincode} onChange={handlePincodeChange} maxLength={6} className="input-field" placeholder="Enter 6-digit pincode" />
// // //                 </div>
// // //                 <div>
// // //                   <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
// // //                   <input name="state" value={form.state} onChange={handleChange} className="input-field" placeholder="State" readOnly />
// // //                 </div>
// // //                 <div>
// // //                   <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
// // //                   <input name="district" value={form.district} onChange={handleChange} className="input-field" placeholder="District" readOnly />
// // //                 </div>
// // //                 <div>
// // //                   <label className="block text-sm font-medium text-gray-700 mb-1">Taluk</label>
// // //                   <input name="taluk" value={form.taluk} onChange={handleChange} className="input-field" placeholder="Taluk" readOnly />
// // //                 </div>
// // //                 <div>
// // //                   <label className="block text-sm font-medium text-gray-700 mb-1">Post</label>
// // //                   <input name="post" value={form.post} onChange={handleChange} className="input-field" placeholder="Post" readOnly />
// // //                 </div>
// // //               </div>
// // //             </section>

// // //             {/* ROLE SELECTION */}
// // //             <section className="bg-gray-50 p-6 rounded-lg">
// // //               <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Agent Role</h3>
// // //               <div className="flex gap-6">
// // //                 <label className="flex items-center space-x-2 cursor-pointer">
// // //                   <input type="radio" name="role" value="trader" checked={form.role === "trader"} onChange={handleChange} className="h-4 w-4 text-green-600" />
// // //                   <span className="text-gray-700">Trader</span>
// // //                 </label>
// // //                 {/* <label className="flex items-center space-x-2 cursor-pointer">
// // //                   <input type="radio" name="role" value="farmer" checked={form.role === "farmer"} onChange={handleChange} className="h-4 w-4 text-green-600" />
// // //                   <span className="text-gray-700">Farmer</span>
// // //                 </label> */}
// // //               </div>
// // //             </section>

// // //             {/* FARM INFORMATION (Only for farmers) */}
// // //             {form.role === "farmer" && (
// // //               <>
// // //                 <section className="bg-gray-50 p-6 rounded-lg">
// // //                   <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Farm Location</h3>
// // //                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // //                     <div>
// // //                       <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
// // //                       <input name="latitude" value={form.latitude} onChange={handleChange} className="input-field" placeholder="Enter latitude" />
// // //                     </div>
// // //                     <div>
// // //                       <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
// // //                       <input name="longitude" value={form.longitude} onChange={handleChange} className="input-field" placeholder="Enter longitude" />
// // //                     </div>
// // //                   </div>
// // //                 </section>

// // //                 <section className="bg-gray-50 p-6 rounded-lg">
// // //                   <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Farm Land Details</h3>
// // //                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// // //                     <div>
// // //                       <label className="block text-sm font-medium text-gray-700 mb-1">Total Land (acres)</label>
// // //                       <input name="totalLand" value={form.totalLand} onChange={handleChange} className="input-field" placeholder="Total land area" type="number" />
// // //                     </div>
// // //                     <div>
// // //                       <label className="block text-sm font-medium text-gray-700 mb-1">Cultivated Land (acres)</label>
// // //                       <input name="cultivatedLand" value={form.cultivatedLand} onChange={handleChange} className="input-field" placeholder="Cultivated land area" type="number" />
// // //                     </div>
// // //                     <div>
// // //                       <label className="block text-sm font-medium text-gray-700 mb-1">Uncultivated Land (acres)</label>
// // //                       <input name="uncultivatedLand" value={form.uncultivatedLand} onChange={handleChange} className="input-field" placeholder="Uncultivated land area" type="number" />
// // //                     </div>
// // //                   </div>
// // //                 </section>
// // //               </>
// // //             )}

// // //             {/* COMMODITIES */}
// // //             <section className="bg-gray-50 p-6 rounded-lg">
// // //               <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Commodities</h3>
// // //               <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
// // //                 {availableCommodities.map(commodity => (
// // //                   <label key={commodity.id} className="flex items-center space-x-2 cursor-pointer p-2 bg-white rounded border hover:bg-gray-50">
// // //                     <input type="checkbox" name="commodities" value={commodity.id} checked={form.commodities.includes(commodity.id)} onChange={handleChange} className="h-4 w-4 text-green-600" />
// // //                     <span className="text-gray-700">{commodity.name}</span>
// // //                   </label>
// // //                 ))}
// // //               </div>
// // //             </section>

// // //             {/* BANK DETAILS */}
// // //             <section className="bg-gray-50 p-6 rounded-lg">
// // //               <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Bank Details</h3>
// // //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // //                 <div>
// // //                   <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
// // //                   <input name="accountHolderName" value={form.accountHolderName} onChange={handleChange} className="input-field" placeholder="Account holder name" />
// // //                 </div>
// // //                 <div>
// // //                   <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
// // //                   <input name="accountNumber" value={form.accountNumber} onChange={handleChange} className="input-field" placeholder="Bank account number" />
// // //                 </div>
// // //                 <div>
// // //                   <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
// // //                   <input name="ifscCode" value={form.ifscCode} onChange={handleChange} className="input-field" placeholder="Bank IFSC code" />
// // //                 </div>
// // //                 <div>
// // //                   <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
// // //                   <input name="branch" value={form.branch} onChange={handleChange} className="input-field" placeholder="Bank branch" />
// // //                 </div>
// // //               </div>
// // //             </section>

// // //             {/* SECURITY */}
// // //             <section className="bg-gray-50 p-6 rounded-lg">
// // //               <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Security & Activation</h3>
// // //               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// // //                 <div>
// // //                   <label className="block text-sm font-medium text-gray-700 mb-1">Referral Code</label>
// // //                   <input name="referralCode" value={form.referralCode} onChange={handleChange} className="input-field" placeholder="Referral code (optional)" />
// // //                 </div>
// // //                 <div>
// // //                   <label className="block text-sm font-medium text-gray-700 mb-1">MPIN</label>
// // //                   <input name="mpin" value={form.mpin} onChange={handleChange} type="password" className="input-field" placeholder="Set 4-digit MPIN" />
// // //                 </div>
// // //                 <div>
// // //                   <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
// // //                   <input name="password" value={form.password} onChange={handleChange} type="password" className="input-field" placeholder="Set password" />
// // //                 </div>
// // //                 <div className="md:col-span-3">
// // //                   <label className="flex items-center space-x-2 cursor-pointer">
// // //                     <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="h-4 w-4 text-green-600" />
// // //                     <span className="text-gray-700">Active Account</span>
// // //                   </label>
// // //                 </div>
// // //               </div>
// // //             </section>

// // //             {/* FORM ACTIONS */}
// // //             <div className="flex justify-end gap-4 pt-6 border-t">
// // //               <button type="button" onClick={() => { setAddOpen(false); resetForm(); }} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
// // //                 Cancel
// // //               </button>
// // //               <button type="submit" disabled={loading} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
// // //                 {loading ? "Adding..." : "Add Agent"}
// // //               </button>
// // //             </div>
// // //           </form>
// // //         </div>
// // //       </Dialog>

// // //       {/* Edit Agent Dialog */}
// // //       <Dialog open={editOpen} onClose={() => { setEditOpen(false); resetForm(); setSelectedAgent(null); }} maxWidth="lg" fullWidth>
// // //         <div className="p-6 max-h-[90vh] overflow-y-auto">
// // //           <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Agent</h2>
// // //           <form onSubmit={handleEdit} className="space-y-8">
// // //             {/* PERSONAL INFO */}
// // //             <section className="bg-gray-50 p-6 rounded-lg">
// // //               <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Personal Information</h3>
// // //               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
// // //                 <div>
// // //                   <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
// // //                   <input name="name" value={form.name} onChange={handleChange} required className="input-field" placeholder="Enter full name" />
// // //                 </div>
// // //                 <div>
// // //                   <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
// // //                   <input name="mobileNo" value={form.mobileNo} onChange={handleChange} required className="input-field" placeholder="Enter mobile number" type="tel" />
// // //                 </div>
// // //                 <div>
// // //                   <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
// // //                   <input name="email" value={form.email} onChange={handleChange} className="input-field" placeholder="Enter email address" type="email" />
// // //                 </div>
// // //                 <div className="md:col-span-2">
// // //                   <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
// // //                   <input name="address" value={form.address} onChange={handleChange} className="input-field" placeholder="Enter complete address" />
// // //                 </div>
// // //                 <div>
// // //                   <label className="block text-sm font-medium text-gray-700 mb-1">Village/Grama Panchayat</label>
// // //                   <input name="villageGramaPanchayat" value={form.villageGramaPanchayat} onChange={handleChange} className="input-field" placeholder="Enter village name" />
// // //                 </div>
// // //                 <div>
// // //                   <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
// // //                   <input name="pincode" value={form.pincode} onChange={handlePincodeChange} maxLength={6} className="input-field" placeholder="Enter 6-digit pincode" />
// // //                 </div>
// // //                 <div>
// // //                   <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
// // //                   <input name="state" value={form.state} onChange={handleChange} className="input-field" placeholder="State" />
// // //                 </div>
// // //                 <div>
// // //                   <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
// // //                   <input name="district" value={form.district} onChange={handleChange} className="input-field" placeholder="District" />
// // //                 </div>
// // //                 <div>
// // //                   <label className="block text-sm font-medium text-gray-700 mb-1">Taluk</label>
// // //                   <input name="taluk" value={form.taluk} onChange={handleChange} className="input-field" placeholder="Taluk" />
// // //                 </div>
// // //                 <div>
// // //                   <label className="block text-sm font-medium text-gray-700 mb-1">Post</label>
// // //                   <input name="post" value={form.post} onChange={handleChange} className="input-field" placeholder="Post" />
// // //                 </div>
// // //               </div>
// // //             </section>

// // //             {/* ROLE SELECTION */}
// // //             <section className="bg-gray-50 p-6 rounded-lg">
// // //               <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Agent Role</h3>
// // //               <div className="flex gap-6">
// // //                 <label className="flex items-center space-x-2 cursor-pointer">
// // //                   <input type="radio" name="role" value="trader" checked={form.role === "trader"} onChange={handleChange} className="h-4 w-4 text-green-600" />
// // //                   <span className="text-gray-700">Trader</span>
// // //                 </label>
// // //                 {/* <label className="flex items-center space-x-2 cursor-pointer">
// // //                   <input type="radio" name="role" value="farmer" checked={form.role === "farmer"} onChange={handleChange} className="h-4 w-4 text-green-600" />
// // //                   <span className="text-gray-700">Farmer</span>
// // //                 </label> */}
// // //               </div>
// // //             </section>

// // //             {/* FARM INFORMATION (Only for farmers) */}
// // //             {form.role === "farmer" && (
// // //               <>
// // //                 <section className="bg-gray-50 p-6 rounded-lg">
// // //                   <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Farm Location</h3>
// // //                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // //                     <div>
// // //                       <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
// // //                       <input name="latitude" value={form.latitude} onChange={handleChange} className="input-field" placeholder="Enter latitude" />
// // //                     </div>
// // //                     <div>
// // //                       <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
// // //                       <input name="longitude" value={form.longitude} onChange={handleChange} className="input-field" placeholder="Enter longitude" />
// // //                     </div>
// // //                   </div>
// // //                 </section>

// // //                 <section className="bg-gray-50 p-6 rounded-lg">
// // //                   <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Farm Land Details</h3>
// // //                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// // //                     <div>
// // //                       <label className="block text-sm font-medium text-gray-700 mb-1">Total Land (acres)</label>
// // //                       <input name="totalLand" value={form.totalLand} onChange={handleChange} className="input-field" placeholder="Total land area" type="number" />
// // //                     </div>
// // //                     <div>
// // //                       <label className="block text-sm font-medium text-gray-700 mb-1">Cultivated Land (acres)</label>
// // //                       <input name="cultivatedLand" value={form.cultivatedLand} onChange={handleChange} className="input-field" placeholder="Cultivated land area" type="number" />
// // //                     </div>
// // //                     <div>
// // //                       <label className="block text-sm font-medium text-gray-700 mb-1">Uncultivated Land (acres)</label>
// // //                       <input name="uncultivatedLand" value={form.uncultivatedLand} onChange={handleChange} className="input-field" placeholder="Uncultivated land area" type="number" />
// // //                     </div>
// // //                   </div>
// // //                 </section>
// // //               </>
// // //             )}

// // //             {/* COMMODITIES */}
// // //             <section className="bg-gray-50 p-6 rounded-lg">
// // //               <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Commodities</h3>
// // //               <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
// // //                 {availableCommodities.map(commodity => (
// // //                   <label key={commodity.id} className="flex items-center space-x-2 cursor-pointer p-2 bg-white rounded border hover:bg-gray-50">
// // //                     <input type="checkbox" name="commodities" value={commodity.id} checked={form.commodities.includes(commodity.id)} onChange={handleChange} className="h-4 w-4 text-green-600" />
// // //                     <span className="text-gray-700">{commodity.name}</span>
// // //                   </label>
// // //                 ))}
// // //               </div>
// // //             </section>

// // //             {/* BANK DETAILS */}
// // //             <section className="bg-gray-50 p-6 rounded-lg">
// // //               <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Bank Details</h3>
// // //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // //                 <div>
// // //                   <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
// // //                   <input name="accountHolderName" value={form.accountHolderName} onChange={handleChange} className="input-field" placeholder="Account holder name" />
// // //                 </div>
// // //                 <div>
// // //                   <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
// // //                   <input name="accountNumber" value={form.accountNumber} onChange={handleChange} className="input-field" placeholder="Bank account number" />
// // //                 </div>
// // //                 <div>
// // //                   <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
// // //                   <input name="ifscCode" value={form.ifscCode} onChange={handleChange} className="input-field" placeholder="Bank IFSC code" />
// // //                 </div>
// // //                 <div>
// // //                   <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
// // //                   <input name="branch" value={form.branch} onChange={handleChange} className="input-field" placeholder="Bank branch" />
// // //                 </div>
// // //               </div>
// // //             </section>

// // //             {/* SECURITY */}
// // //             <section className="bg-gray-50 p-6 rounded-lg">
// // //               <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Security & Activation</h3>
// // //               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// // //                 <div>
// // //                   <label className="block text-sm font-medium text-gray-700 mb-1">Referral Code</label>
// // //                   <input name="referralCode" value={form.referralCode} onChange={handleChange} className="input-field" placeholder="Referral code (optional)" />
// // //                 </div>
// // //                 <div>
// // //                   <label className="block text-sm font-medium text-gray-700 mb-1">MPIN</label>
// // //                   <input name="mpin" value={form.mpin} onChange={handleChange} type="password" className="input-field" placeholder="Set 4-digit MPIN" />
// // //                 </div>
// // //                 <div>
// // //                   <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
// // //                   <input name="password" value={form.password} onChange={handleChange} type="password" className="input-field" placeholder="Set password" />
// // //                 </div>
// // //                 <div className="md:col-span-3">
// // //                   <label className="flex items-center space-x-2 cursor-pointer">
// // //                     <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="h-4 w-4 text-green-600" />
// // //                     <span className="text-gray-700">Active Account</span>
// // //                   </label>
// // //                 </div>
// // //               </div>
// // //             </section>

// // //             {/* FORM ACTIONS */}
// // //             <div className="flex justify-end gap-4 pt-6 border-t">
// // //               <button type="button" onClick={() => { setEditOpen(false); resetForm(); setSelectedAgent(null); }} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
// // //                 Cancel
// // //               </button>
// // //               <button type="submit" disabled={loading} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
// // //                 {loading ? "Updating..." : "Update Agent"}
// // //               </button>
// // //             </div>
// // //           </form>
// // //         </div>
// // //       </Dialog>

// // //       {/* Bulk Actions Bar */}
// // //       {selectedAgents.length > 0 && (
// // //         <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
// // //           <div className="flex items-center justify-between">
// // //             <div className="flex items-center gap-2">
// // //               <FaCheck className="text-red-600" />
// // //               <span className="font-medium text-red-700">
// // //                 {selectedAgents.length} agent{selectedAgents.length !== 1 ? 's' : ''} selected
// // //               </span>
// // //             </div>
// // //             <button
// // //               onClick={() => setBulkDeleteOpen(true)}
// // //               className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
// // //             >
// // //               <FaTrash className="w-4 h-4" />
// // //               Delete Selected
// // //             </button>
// // //           </div>
// // //         </div>
// // //       )}

// // //       {/* Export Buttons Section */}
// // //       <div className="lg:hidden flex flex-wrap gap-[.6rem] text-sm bg-white p-[.6rem] shadow">
// // //         {[
// // //           { label: "Copy", icon: FaCopy, onClick: handleCopy, color: "bg-gray-100 hover:bg-gray-200 text-gray-800" },
// // //           { label: "Excel", icon: FaFileExcel, onClick: handleExcel, color: "bg-green-100 hover:bg-green-200 text-green-800" },
// // //           { label: "CSV", icon: FaFileCsv, onClick: handleCSV, color: "bg-blue-100 hover:bg-blue-200 text-blue-800" },
// // //           { label: "PDF", icon: FaFilePdf, onClick: handlePDF, color: "bg-red-100 hover:bg-red-200 text-red-800" },
// // //           { label: "Print", icon: FaPrint, onClick: handlePrint, color: "bg-purple-100 hover:bg-purple-200 text-purple-800" },
// // //         ].map((btn, i) => (
// // //           <button
// // //             key={i}
// // //             onClick={btn.onClick}
// // //             disabled={agents.length === 0}
// // //             className={`flex items-center gap-[.6rem] text-sm px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md ${btn.color} font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
// // //           >
// // //             <btn.icon className="text-sm" />
// // //           </button>
// // //         ))}
// // //       </div>

// // //       {/* Filters Section */}
// // //       <div className="bg-white rounded lg:rounded-none shadow p-[.4rem] text-sm mb-2">
// // //         <div className="gap-[.6rem] text-sm items-end flex flex-wrap md:flex-row flex-col md:*:w-fit *:w-full">
// // //           {/* Search Input */}
// // //           <div className="md:col-span-3">
// // //             <div className="relative">
// // //               <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
// // //               <input
// // //                 type="text"
// // //                 placeholder="Search by name, mobile, email, or village..."
// // //                 value={search}
// // //                 onChange={(e) => setSearch(e.target.value)}
// // //                 disabled={loading}
// // //                 className="md:w-80 w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all disabled:opacity-50"
// // //               />
// // //             </div>
// // //           </div>

// // //           {/* District Filter */}
// // //           <div className="md:col-span-2">
// // //             <select
// // //               className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors"
// // //               value={disName}
// // //               onChange={(e) => setDisName(e.target.value)}
// // //               disabled={districtsLoading || loading}
// // //             >
// // //               {districtsLoading ? (
// // //                 <option>Loading districts...</option>
// // //               ) : districts.length === 0 ? (
// // //                 <option value="">No districts available</option>
// // //               ) : (
// // //                 <>
// // //                   <option value="">All Districts</option>
// // //                   {districts.map(district => (
// // //                     <option key={district._id} value={district.name}>
// // //                       {district.name}
// // //                     </option>
// // //                   ))}
// // //                 </>
// // //               )}
// // //             </select>
// // //           </div>

// // //           {/* Role Filter */}
// // //           {/* <div className="md:col-span-2">
// // //             <select
// // //               className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors"
// // //               value={roleFilter}
// // //               onChange={(e) => setRoleFilter(e.target.value)}
// // //               disabled={loading}
// // //             >
// // //               <option value="all">All Roles</option>
// // //               <option value="trader">Traders</option>
// // //               <option value="farmer">Farmers</option>
// // //             </select>
// // //           </div> */}

// // //           {/* Reset Button */}
// // //           <div className="md:col-span-2">
// // //             <button
// // //               onClick={handleResetFilters}
// // //               disabled={loading}
// // //               className="w-full px-4 py-2.5 border border-gray-300 rounded hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
// // //             >
// // //               <FaRedo /> Reset
// // //             </button>
// // //           </div>

// // //           {/* Desktop Export Buttons */}
// // //           <div className="lg:flex hidden ml-auto flex-wrap gap-[.6rem] text-sm">
// // //             {[
// // //               { label: "Copy", icon: FaCopy, onClick: handleCopy, color: "bg-gray-100 hover:bg-gray-200 text-gray-800", disabled: agents.length === 0 },
// // //               { label: "Excel", icon: FaFileExcel, onClick: handleExcel, color: "bg-green-100 hover:bg-green-200 text-green-800", disabled: agents.length === 0 },
// // //               { label: "CSV", icon: FaFileCsv, onClick: handleCSV, color: "bg-blue-100 hover:bg-blue-200 text-blue-800", disabled: agents.length === 0 },
// // //               { label: "PDF", icon: FaFilePdf, onClick: handlePDF, color: "bg-red-100 hover:bg-red-200 text-red-800", disabled: agents.length === 0 },
// // //               { label: "Print", icon: FaPrint, onClick: handlePrint, color: "bg-purple-100 hover:bg-purple-200 text-purple-800", disabled: agents.length === 0 },
// // //             ].map((btn, i) => (
// // //               <button
// // //                 key={i}
// // //                 onClick={btn.onClick}
// // //                 disabled={btn.disabled || loading}
// // //                 className={`flex items-center gap-[.6rem] text-sm px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md ${btn.color} font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
// // //               >
// // //                 <btn.icon className="text-sm" />
// // //               </button>
// // //             ))}
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* Error Message */}
// // //       {error && (
// // //         <div className="mb-4 p-3 bg-red-50 text-red-600 rounded border border-red-200">
// // //           {error}
// // //         </div>
// // //       )}

// // //       {/* Desktop Table */}
// // //       {!loading && agents.length > 0 && (
// // //         <>
// // //           <div className="hidden lg:block bg-white rounded shadow">
// // //             <table className="min-w-full">
// // //               <thead className="border-b border-zinc-200">
// // //                 <tr className="*:text-zinc-800">
// // //                   <th className="p-[.6rem] text-sm text-left font-semibold w-10">
// // //                     <input
// // //                       type="checkbox"
// // //                       checked={selectAll}
// // //                       onChange={handleSelectAll}
// // //                       disabled={loading}
// // //                       className="rounded border-gray-300"
// // //                     />
// // //                   </th>
// // //                   <th className="p-[.6rem] text-sm text-left font-semibold">Sr.</th>
// // //                   <th className="p-[.6rem] text-sm text-left font-semibold">Name</th>
// // //                   <th className="p-[.6rem] text-sm text-left font-semibold">Mobile</th>
// // //                   <th className="p-[.6rem] text-sm text-left font-semibold">Email</th>
// // //                   <th className="p-[.6rem] text-sm text-left font-semibold">Role</th>
// // //                   <th className="p-[.6rem] text-sm text-left font-semibold">Village</th>
// // //                   <th className="p-[.6rem] text-sm text-left font-semibold">District</th>
// // //                   <th className="p-[.6rem] text-sm text-left font-semibold">State</th>
// // //                   <th className="p-[.6rem] text-sm text-left font-semibold">Actions</th>
// // //                 </tr>
// // //               </thead>
// // //               <tbody className="divide-y divide-gray-100">
// // //                 {agents.map((agent, index) => {
// // //                   const personalInfo = agent.personalInfo;
// // //                   return (
// // //                     <tr key={agent._id} className="hover:bg-gray-50 transition-colors">
// // //                       <td className="p-[.6rem] text-sm">
// // //                         <input
// // //                           type="checkbox"
// // //                           checked={selectedAgents.includes(agent._id)}
// // //                           onChange={(e) => handleSelectOne(agent._id, e.target.checked)}
// // //                           disabled={loading}
// // //                           className="rounded border-gray-300"
// // //                         />
// // //                       </td>
// // //                       <td className="p-[.6rem] text-sm text-center">
// // //                         {index + 1 + (currentPage - 1) * rowsPerPage}
// // //                       </td>
// // //                       <td className="p-[.6rem] text-sm">
// // //                         <div className="font-semibold">{personalInfo.name || 'N/A'}</div>
// // //                         {agent.farmerId && <div className="text-xs text-gray-500">ID: {agent.farmerId}</div>}
// // //                       </td>
// // //                       <td className="p-[.6rem] text-sm">{personalInfo.mobileNo || 'N/A'}</td>
// // //                       <td className="p-[.6rem] text-sm">
// // //                         <span className={`${personalInfo.email ? 'text-gray-900' : 'text-gray-400 italic'}`}>
// // //                           {personalInfo.email || 'No email'}
// // //                         </span>
// // //                       </td>
// // //                       <td className="p-[.6rem] text-sm">
// // //                         <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleBadge(agent.role)}`}>
// // //                           {getRoleIcon(agent.role)}
// // //                           {agent.role || 'N/A'}
// // //                         </span>
// // //                       </td>
// // //                       <td className="p-[.6rem] text-sm">{personalInfo.villageGramaPanchayat || 'N/A'}</td>
// // //                       <td className="p-[.6rem] text-sm">{personalInfo.district || 'N/A'}</td>
// // //                       <td className="p-[.6rem] text-sm">{personalInfo.state || 'N/A'}</td>
// // //                       <td className="p-[.6rem] text-sm">
// // //                         <div className="flex gap-[.6rem] text-sm">
// // //                           <button
// // //                             onClick={() => { setSelectedAgent(agent); setViewOpen(true); }}
// // //                             disabled={loading}
// // //                             className="p-[.6rem] text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
// // //                             title="View Details"
// // //                           >
// // //                             <FaEye />
// // //                           </button>
// // //                           <button
// // //                             onClick={() => populateFormForEdit(agent)}
// // //                             disabled={loading}
// // //                             className="p-[.6rem] text-sm text-green-600 hover:bg-green-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
// // //                             title="Edit Agent"
// // //                           >
// // //                             <FaEdit />
// // //                           </button>
// // //                           <button
// // //                             onClick={() => { setSelectedAgent(agent); setDeleteOpen(true); }}
// // //                             disabled={loading}
// // //                             className="p-[.6rem] text-sm text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
// // //                             title="Delete Agent"
// // //                           >
// // //                             <FaTrash />
// // //                           </button>
// // //                         </div>
// // //                       </td>
// // //                     </tr>
// // //                   );
// // //                 })}
// // //               </tbody>
// // //             </table>
// // //           </div>

// // //           {/* Mobile Cards */}
// // //           <div className="lg:hidden space-y-2 p-[.2rem] text-sm">
// // //             {agents.map((agent, index) => {
// // //               const personalInfo = agent.personalInfo;
// // //               return (
// // //                 <div key={agent._id} className="rounded p-[.6rem] text-sm border border-zinc-200 bg-white shadow">
// // //                   <div className="flex justify-between items-start mb-3">
// // //                     <div className="flex items-center gap-2">
// // //                       <input
// // //                         type="checkbox"
// // //                         checked={selectedAgents.includes(agent._id)}
// // //                         onChange={(e) => handleSelectOne(agent._id, e.target.checked)}
// // //                         disabled={loading}
// // //                         className="rounded border-gray-300"
// // //                       />
// // //                       <div>
// // //                         <div className="font-bold text-gray-800">{personalInfo.name || 'N/A'}</div>
// // //                         <div className="text-xs text-gray-500">Sr. {index + 1 + (currentPage - 1) * rowsPerPage}</div>
// // //                         {agent.farmerId && <div className="text-xs text-gray-500">ID: {agent.farmerId}</div>}
// // //                       </div>
// // //                     </div>
// // //                     <div className="flex gap-[.6rem] text-sm">
// // //                       <button 
// // //                         onClick={() => { setSelectedAgent(agent); setViewOpen(true); }} 
// // //                         disabled={loading}
// // //                         className="p-1.5 text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
// // //                       >
// // //                         <FaEye />
// // //                       </button>
// // //                       <button 
// // //                         onClick={() => populateFormForEdit(agent)} 
// // //                         disabled={loading}
// // //                         className="p-1.5 text-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
// // //                       >
// // //                         <FaEdit />
// // //                       </button>
// // //                       <button 
// // //                         onClick={() => { setSelectedAgent(agent); setDeleteOpen(true); }} 
// // //                         disabled={loading}
// // //                         className="p-1.5 text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
// // //                       >
// // //                         <FaTrash />
// // //                       </button>
// // //                     </div>
// // //                   </div>
// // //                   <div className="space-y-2">
// // //                     <div>
// // //                       <div className="text-sm text-gray-500">Mobile</div>
// // //                       <div className="text-sm">{personalInfo.mobileNo || 'N/A'}</div>
// // //                     </div>
// // //                     <div>
// // //                       <div className="text-sm text-gray-500">Email</div>
// // //                       <div className={`text-sm ${personalInfo.email ? 'text-gray-700' : 'text-gray-400 italic'}`}>
// // //                         {personalInfo.email || 'No email'}
// // //                       </div>
// // //                     </div>
// // //                     <div>
// // //                       <div className="text-sm text-gray-500">Role</div>
// // //                       <div className="text-sm">
// // //                         <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleBadge(agent.role)}`}>
// // //                           {getRoleIcon(agent.role)}
// // //                           {agent.role || 'N/A'}
// // //                         </span>
// // //                       </div>
// // //                     </div>
// // //                     <div className="grid grid-cols-2 gap-[.6rem] text-sm">
// // //                       <div>
// // //                         <div className="text-sm text-gray-500">Village</div>
// // //                         <div className="text-sm">{personalInfo.villageGramaPanchayat || 'N/A'}</div>
// // //                       </div>
// // //                       <div>
// // //                         <div className="text-sm text-gray-500">District</div>
// // //                         <div className="text-sm">{personalInfo.district || 'N/A'}</div>
// // //                       </div>
// // //                     </div>
// // //                     <div>
// // //                       <div className="text-sm text-gray-500">State</div>
// // //                       <div className="text-sm">{personalInfo.state || 'N/A'}</div>
// // //                     </div>
// // //                   </div>
// // //                 </div>
// // //               );
// // //             })}
// // //           </div>
// // //         </>
// // //       )}

// // //       {/* Empty State */}
// // //       {!loading && agents.length === 0 && (
// // //         <div className="text-center py-12">
// // //           <div className="text-gray-400 text-6xl mb-4">👤</div>
// // //           <h3 className="text-xl font-semibold mb-2">No agents found</h3>
// // //           <p className="text-gray-500">Try adjusting your search or filters</p>
// // //           {roleFilter !== "all" && (
// // //             <p className="text-gray-500 text-sm mb-4">Current Role Filter: {roleFilter}</p>
// // //           )}
// // //           <button
// // //             onClick={handleResetFilters}
// // //             disabled={loading}
// // //             className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
// // //           >
// // //             Reset Filters
// // //           </button>
// // //         </div>
// // //       )}

// // //       {/* Pagination */}
// // //       {!loading && agents.length > 0 && (
// // //         <div className="flex flex-col bg-white sm:flex-row p-3 shadow justify-between items-center gap-[.6rem] text-sm">
// // //           <div className="text-gray-600">
// // //             Showing <span className="font-semibold">{1 + (currentPage - 1) * rowsPerPage}-{Math.min(currentPage * rowsPerPage, totalAgents)}</span> of{" "}
// // //             <span className="font-semibold">{totalAgents}</span> agents
// // //             <select
// // //               value={rowsPerPage}
// // //               onChange={(e) => setRowsPerPage(Number(e.target.value))}
// // //               disabled={loading}
// // //               className="p-1 ml-3 border border-zinc-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
// // //             >
// // //               {[5, 10, 20, 50, 100].map((option) => (
// // //                 <option key={option} value={option}>
// // //                   {option}
// // //                 </option>
// // //               ))}
// // //             </select>
// // //           </div>
          
// // //           <div className="flex items-center gap-4">
// // //             <div className="text-sm text-gray-600">
// // //               Page {currentPage} of {totalPages}
// // //             </div>
// // //             <Pagination
// // //               count={totalPages}
// // //               page={currentPage}
// // //               onChange={(_, value) => setCurrentPage(value)}
// // //               color="primary"
// // //               shape="rounded"
// // //               showFirstButton
// // //               showLastButton
// // //               siblingCount={1}
// // //               boundaryCount={1}
// // //               disabled={loading}
// // //             />
// // //           </div>
// // //         </div>
// // //       )}

// // //       {/* VIEW DETAILS Dialog */}
// // //       {viewOpen && selectedAgent && (
// // //         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3 backdrop-blur-sm">
// // //           <div className="bg-white p-6 rounded-xl w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-y-auto">
// // //             <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pb-4 border-b">
// // //               <h2 className="font-semibold text-2xl text-gray-800">Agent Details</h2>
// // //               <button
// // //                 onClick={() => setViewOpen(false)}
// // //                 className="text-gray-500 hover:text-gray-700 text-2xl"
// // //               >
// // //                 ✕
// // //               </button>
// // //             </div>
            
// // //             <div className="space-y-6">
// // //               {/* Basic Information */}
// // //               <section className="bg-gray-50 p-4 rounded-lg">
// // //                 <h3 className="text-lg font-semibold mb-3 text-gray-700">Basic Information</h3>
// // //                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
// // //                   <DetailRow label="Agent ID" value={selectedAgent._id} />
// // //                   {selectedAgent.farmerId && <DetailRow label="Farmer/Trader ID" value={selectedAgent.farmerId} />}
// // //                   <DetailRow label="Name" value={selectedAgent.personalInfo.name || 'Not provided'} />
// // //                   <DetailRow label="Mobile" value={selectedAgent.personalInfo.mobileNo || 'Not provided'} />
// // //                   <DetailRow label="Email" value={selectedAgent.personalInfo.email || 'Not provided'} />
// // //                   <DetailRow label="Role" value={selectedAgent.role || 'Not provided'} />
// // //                   <DetailRow label="Status" value={selectedAgent.isActive ? 'Active' : 'Inactive'} />
// // //                   {selectedAgent.registeredAt && <DetailRow label="Registered Date" value={new Date(selectedAgent.registeredAt).toLocaleString()} />}
// // //                   {selectedAgent.registrationStatus && <DetailRow label="Registration Status" value={selectedAgent.registrationStatus} />}
// // //                 </div>
// // //               </section>

// // //               {/* Personal Information */}
// // //               <section className="bg-gray-50 p-4 rounded-lg">
// // //                 <h3 className="text-lg font-semibold mb-3 text-gray-700">Personal Information</h3>
// // //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
// // //                   <DetailRow label="Address" value={selectedAgent.personalInfo.address || 'Not provided'} />
// // //                   <DetailRow label="Village/Grama Panchayat" value={selectedAgent.personalInfo.villageGramaPanchayat || 'Not provided'} />
// // //                   <DetailRow label="Pincode" value={selectedAgent.personalInfo.pincode || 'Not provided'} />
// // //                   <DetailRow label="State" value={selectedAgent.personalInfo.state || 'Not provided'} />
// // //                   <DetailRow label="District" value={selectedAgent.personalInfo.district || 'Not provided'} />
// // //                   <DetailRow label="Taluk" value={selectedAgent.personalInfo.taluk || 'Not provided'} />
// // //                   <DetailRow label="Post" value={selectedAgent.personalInfo.post || 'Not provided'} />
// // //                 </div>
// // //               </section>

// // //               {/* Farm Information (for farmers) */}
// // //               {selectedAgent.role === 'farmer' && selectedAgent.farmLocation && (
// // //                 <section className="bg-gray-50 p-4 rounded-lg">
// // //                   <h3 className="text-lg font-semibold mb-3 text-gray-700">Farm Information</h3>
// // //                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
// // //                     <DetailRow label="Latitude" value={selectedAgent.farmLocation.latitude || 'Not provided'} />
// // //                     <DetailRow label="Longitude" value={selectedAgent.farmLocation.longitude || 'Not provided'} />
// // //                     {selectedAgent.farmLand && (
// // //                       <>
// // //                         <DetailRow label="Total Land" value={selectedAgent.farmLand.total ? `${selectedAgent.farmLand.total} acres` : 'Not provided'} />
// // //                         <DetailRow label="Cultivated Land" value={selectedAgent.farmLand.cultivated ? `${selectedAgent.farmLand.cultivated} acres` : 'Not provided'} />
// // //                         <DetailRow label="Uncultivated Land" value={selectedAgent.farmLand.uncultivated ? `${selectedAgent.farmLand.uncultivated} acres` : 'Not provided'} />
// // //                       </>
// // //                     )}
// // //                   </div>
// // //                 </section>
// // //               )}

// // //               {/* Commodities */}
// // //               {selectedAgent.commodities && selectedAgent.commodities.length > 0 && (
// // //                 <section className="bg-gray-50 p-4 rounded-lg">
// // //                   <h3 className="text-lg font-semibold mb-3 text-gray-700">Commodities</h3>
// // //                   <div className="flex flex-wrap gap-2">
// // //                     {selectedAgent.commodities.map((commodityId, index) => {
// // //                       const commodity = availableCommodities.find(c => c.id === commodityId);
// // //                       return (
// // //                         <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
// // //                           {commodity ? commodity.name : commodityId}
// // //                         </span>
// // //                       );
// // //                     })}
// // //                   </div>
// // //                 </section>
// // //               )}

// // //               {/* Bank Details */}
// // //               {selectedAgent.bankDetails && (
// // //                 <section className="bg-gray-50 p-4 rounded-lg">
// // //                   <h3 className="text-lg font-semibold mb-3 text-gray-700">Bank Details</h3>
// // //                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
// // //                     <DetailRow label="Account Holder" value={selectedAgent.bankDetails.accountHolderName || 'Not provided'} />
// // //                     <DetailRow label="Account Number" value={selectedAgent.bankDetails.accountNumber || 'Not provided'} />
// // //                     <DetailRow label="IFSC Code" value={selectedAgent.bankDetails.ifscCode || 'Not provided'} />
// // //                     <DetailRow label="Branch" value={selectedAgent.bankDetails.branch || 'Not provided'} />
// // //                   </div>
// // //                 </section>
// // //               )}

// // //               {/* Documents */}
// // //               {selectedAgent.documents && (
// // //                 <section className="bg-gray-50 p-4 rounded-lg">
// // //                   <h3 className="text-lg font-semibold mb-3 text-gray-700">Documents</h3>
// // //                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
// // //                     {selectedAgent.documents.panCard && (
// // //                       <div>
// // //                         <div className="text-sm text-gray-500">PAN Card:</div>
// // //                         <a href={selectedAgent.documents.panCard} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
// // //                           View PAN Card
// // //                         </a>
// // //                       </div>
// // //                     )}
// // //                     {selectedAgent.documents.aadharFront && (
// // //                       <div>
// // //                         <div className="text-sm text-gray-500">Aadhar Front:</div>
// // //                         <a href={selectedAgent.documents.aadharFront} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
// // //                           View Aadhar Front
// // //                         </a>
// // //                       </div>
// // //                     )}
// // //                     {selectedAgent.documents.aadharBack && (
// // //                       <div>
// // //                         <div className="text-sm text-gray-500">Aadhar Back:</div>
// // //                         <a href={selectedAgent.documents.aadharBack} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
// // //                           View Aadhar Back
// // //                         </a>
// // //                       </div>
// // //                     )}
// // //                     {selectedAgent.documents.bankPassbook && (
// // //                       <div>
// // //                         <div className="text-sm text-gray-500">Bank Passbook:</div>
// // //                         <a href={selectedAgent.documents.bankPassbook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
// // //                           View Bank Passbook
// // //                         </a>
// // //                       </div>
// // //                     )}
// // //                   </div>
// // //                 </section>
// // //               )}

// // //               {/* Security Information */}
// // //               {selectedAgent.security && (
// // //                 <section className="bg-gray-50 p-4 rounded-lg">
// // //                   <h3 className="text-lg font-semibold mb-3 text-gray-700">Security Information</h3>
// // //                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
// // //                     <DetailRow label="Referral Code" value={selectedAgent.security.referralCode || 'Not provided'} />
// // //                     <DetailRow label="MPIN Set" value={selectedAgent.security.mpin ? 'Yes' : 'No'} />
// // //                     <DetailRow label="Password Set" value={selectedAgent.security.password ? 'Yes' : 'No'} />
// // //                   </div>
// // //                 </section>
// // //               )}
// // //             </div>

// // //             <div className="flex justify-end mt-6 pt-4 border-t">
// // //               <button
// // //                 onClick={() => setViewOpen(false)}
// // //                 className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
// // //               >
// // //                 Close
// // //               </button>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}

// // //       {/* DELETE CONFIRMATION Dialog */}
// // //       {deleteOpen && selectedAgent && (
// // //         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3 backdrop-blur-sm">
// // //           <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl">
// // //             <div className="text-center">
// // //               <div className="text-red-500 text-5xl mb-4">🗑️</div>
// // //               <h2 className="text-xl font-semibold mb-2">Delete Agent?</h2>
// // //               <p className="text-gray-600 mb-6">
// // //                 Are you sure you want to delete <span className="font-semibold">{selectedAgent.personalInfo.name || 'this agent'}</span>? 
// // //                 This action cannot be undone.
// // //               </p>
// // //               <div className="flex justify-center gap-3">
// // //                 <button
// // //                   onClick={() => setDeleteOpen(false)}
// // //                   className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
// // //                 >
// // //                   Cancel
// // //                 </button>
// // //                 <button
// // //                   onClick={handleDelete}
// // //                   disabled={loading}
// // //                   className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
// // //                 >
// // //                   Delete Agent
// // //                 </button>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}

// // //       {/* BULK DELETE CONFIRMATION Dialog */}
// // //       {bulkDeleteOpen && (
// // //         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3 backdrop-blur-sm">
// // //           <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl">
// // //             <div className="text-center">
// // //               <div className="text-red-500 text-5xl mb-4">🗑️</div>
// // //               <h2 className="text-xl font-semibold mb-2">Delete {selectedAgents.length} Agents?</h2>
// // //               <p className="text-gray-600 mb-6">
// // //                 Are you sure you want to delete {selectedAgents.length} selected agents{selectedAgents.length !== 1 ? 's' : ''}? 
// // //                 This action cannot be undone.
// // //               </p>
// // //               <div className="flex justify-center gap-3">
// // //                 <button
// // //                   onClick={() => setBulkDeleteOpen(false)}
// // //                   className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
// // //                 >
// // //                   Cancel
// // //                 </button>
// // //                 <button
// // //                   onClick={handleBulkDelete}
// // //                   disabled={loading}
// // //                   className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
// // //                 >
// // //                   Delete {selectedAgents.length} Agents
// // //                 </button>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // }

// // // /* ================= REUSABLE COMPONENTS ================= */

// // // const DetailRow = ({ label, value }: { label: string; value: string }) => (
// // //   <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-200 last:border-0">
// // //     <div className="w-full sm:w-1/3 font-medium text-gray-600 text-sm mb-1 sm:mb-0">{label}:</div>
// // //     <div className="w-full sm:w-2/3 text-gray-900 break-words">{value}</div>
// // //   </div>
// // // );





























// // "use client";

// // import { useState, useEffect, useCallback, useRef } from "react";
// // import {
// //   FaEye,
// //   FaTrash,
// //   FaPrint,
// //   FaCopy,
// //   FaFileExcel,
// //   FaFileCsv,
// //   FaFilePdf,
// //   FaSearch,
// //   FaRedo,
// //   FaCheck,
// //   FaEdit,
// //   FaPlus,
// //   FaUserTie,
// //   FaUser,
// //   FaCheckCircle,
// //   FaClock,
// //   FaTimesCircle,
// // } from "react-icons/fa";
// // import * as XLSX from "xlsx";
// // import jsPDF from "jspdf";
// // import autoTable from "jspdf-autotable";
// // import axios from "axios";
// // import toast from "react-hot-toast";
// // import { Pagination, Dialog } from "@mui/material";

// // /* ================= TYPES ================= */

// // interface Agent {
// //   _id: string;
// //   farmerId?: string;
// //   personalInfo: {
// //     name: string;
// //     mobileNo: string;
// //     email: string;
// //     address?: string;
// //     villageGramaPanchayat?: string;
// //     pincode?: string;
// //     state?: string;
// //     district?: string;
// //     taluk?: string;
// //     post?: string;
// //   };
// //   role: "farmer" | "trader";
// //   farmLocation?: {
// //     latitude?: string;
// //     longitude?: string;
// //   };
// //   farmLand?: {
// //     total?: number | null;
// //     cultivated?: number | null;
// //     uncultivated?: number | null;
// //   };
// //   commodities?: string[];
// //   nearestMarkets?: string[];
// //   bankDetails?: {
// //     accountHolderName?: string;
// //     accountNumber?: string;
// //     ifscCode?: string;
// //     branch?: string;
// //   };
// //   documents?: {
// //     panCard?: string;
// //     aadharFront?: string;
// //     aadharBack?: string;
// //     bankPassbook?: string;
// //   };
// //   security?: {
// //     referralCode?: string;
// //     mpin?: string;
// //     password?: string;
// //   };
// //   isActive?: boolean;
// //   registeredAt?: string;
// //   registrationStatus?: string;
// //   subcategories?: string[];
// //   __v?: number;
// // }

// // interface ApiResponse {
// //   success: boolean;
// //   data: Agent[];
// //   page: number;
// //   limit: number;
// //   total: number;
// //   totalPages?: number;
// // }

// // interface District {
// //   _id: string;
// //   name: string;
// // }

// // /* ================= PAGE ================= */

// // export default function AgentsPage() {
// //   const [agents, setAgents] = useState<Agent[]>([]);
// //   const [search, setSearch] = useState("");
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [rowsPerPage, setRowsPerPage] = useState(10);
// //   const [totalPages, setTotalPages] = useState(1);
// //   const [totalAgents, setTotalAgents] = useState(0);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);

// //   const [viewOpen, setViewOpen] = useState(false);
// //   const [addOpen, setAddOpen] = useState(false);
// //   const [editOpen, setEditOpen] = useState(false);
// //   const [deleteOpen, setDeleteOpen] = useState(false);
// //   const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
// //   const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
// //   const [districtsLoading, setDistrictsLoading] = useState(false);
// //   const [districts, setDistricts] = useState<District[]>([]);
// //   const [disName, setDisName] = useState("");

// //   // Role filter state
// //   const [roleFilter, setRoleFilter] = useState<string>("trader");
  
// //   // Registration status filter state
// //   const [registrationStatusFilter, setRegistrationStatusFilter] = useState<string>("");

// //   // Bulk selection state
// //   const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
// //   const [selectAll, setSelectAll] = useState(false);

// //   // Form state
// //   const [form, setForm] = useState({
// //     // PERSONAL INFO
// //     name: "",
// //     mobileNo: "",
// //     email: "",
// //     address: "",
// //     villageGramaPanchayat: "",
// //     pincode: "",
// //     state: "",
// //     district: "",
// //     taluk: "",
// //     post: "",

// //     // ROLE
// //     role: "trader" as "farmer" | "trader",

// //     // FARM LOCATION (for farmers)
// //     latitude: "",
// //     longitude: "",

// //     // FARM LAND (for farmers)
// //     totalLand: "",
// //     cultivatedLand: "",
// //     uncultivatedLand: "",

// //     // COMMODITIES (array of strings)
// //     commodities: [] as string[],

// //     // BANK DETAILS
// //     accountHolderName: "",
// //     accountNumber: "",
// //     ifscCode: "",
// //     branch: "",

// //     // DOCUMENTS (file paths)
// //     panCard: "",
// //     aadharFront: "",
// //     aadharBack: "",
// //     bankPassbook: "",

// //     // SECURITY
// //     referralCode: "",
// //     mpin: "",
// //     password: "",
// //     isActive: true,
// //     registrationStatus: "pending", // Added registration status
// //   });

// //   // Commodities list
// //   const [availableCommodities] = useState([
// //     { id: "693677edee676f11684d9fca", name: "Wheat" },
// //     { id: "693677f4ee676f11684d9fcd", name: "Rice" },
// //     { id: "693678b199b054014447fc07", name: "Corn" },
// //     { id: "693914277cf4448c0924fa6e", name: "Soybean" },
// //     { id: "694a69367920614e33fd2939", name: "Other" },
// //   ]);

// //   // Registration status options
// //   const registrationStatusOptions = [
// //     { value: "", label: "All Status" },
// //     { value: "pending", label: "Pending" },
// //     { value: "approved", label: "Approved" },
// //     { value: "rejected", label: "Rejected" },
// //     { value: "under_review", label: "Under Review" },
// //   ];

// //   // Track initial load
// //   const initialLoadRef = useRef(true);
// //   // Track if fetch is in progress to prevent duplicate calls
// //   const isFetchingRef = useRef(false);

// //   /* ================= FETCH AGENTS ================= */

// //   const fetchAgents = useCallback(async (page: number = 1, searchQuery: string = "", districtName: string = "", role: string = "trader", registrationStatus: string = "") => {
// //     // Prevent multiple simultaneous calls
// //     if (isFetchingRef.current) return;
    
// //     try {
// //       isFetchingRef.current = true;
// //       if (!initialLoadRef.current) {
// //         setLoading(true);
// //       }
// //       setError(null);
      
// //       const params: any = {
// //         page: page.toString(),
// //         limit: rowsPerPage.toString(),
// //         search: searchQuery,
// //       };

// //       if (districtName) {
// //         params.district = districtName;
// //       }

// //       if (role && role !== "all") {
// //         params.role = role;
// //       }

// //       if (registrationStatus) {
// //         params.registrationStatus = registrationStatus;
// //       }

// //       console.log("Fetching agents with params:", params); // Debug log

// //       const res = await axios.get<ApiResponse>(`/api/farmers`, { params });
      
// //       if (res.data.success) {
// //         console.log("API Response:", res.data); // Debug log
// //         const processedAgents = res.data.data.map(agent => ({
// //           ...agent,
// //           personalInfo: agent.personalInfo || {
// //             name: "",
// //             mobileNo: "",
// //             email: "",
// //             address: "",
// //             villageGramaPanchayat: "",
// //             pincode: "",
// //             state: "",
// //             district: "",
// //             taluk: "",
// //             post: ""
// //           },
// //           role: agent.role || "trader",
// //           isActive: agent.isActive ?? true,
// //           registrationStatus: agent.registrationStatus || "pending" // Added default
// //         }));
        
// //         setAgents(processedAgents);
// //         setTotalAgents(res.data.total);
// //         const calculatedTotalPages = Math.ceil(res.data.total / rowsPerPage);
// //         setTotalPages(res.data.totalPages || calculatedTotalPages);
// //         setCurrentPage(res.data.page);
// //         setSelectedAgents([]);
// //         setSelectAll(false);
// //       }
// //     } catch (err: any) {
// //       console.error('Error fetching agents:', err);
// //       setError(err.response?.data?.message || 'Failed to load agents. Please try again.');
// //       setAgents([]);
// //       toast.error(err.response?.data?.message || "Failed to load agents");
// //     } finally {
// //       isFetchingRef.current = false;
// //       if (!initialLoadRef.current) {
// //         setLoading(false);
// //       }
// //     }
// //   }, [rowsPerPage]);

// //   /* ================= UPDATE REGISTRATION STATUS ================= */

// //   const handleUpdateRegistrationStatus = async (agentId: string, status: string) => {
// //     try {
// //       setLoading(true);
// //       const response = await axios.put(`/api/farmers/${agentId}`, {
// //         registrationStatus: status
// //       });
      
// //       if (response.data.success) {
// //         toast.success(`Registration status updated to ${status}`);
// //         // Refresh the agents list
// //         fetchAgents(currentPage, search, disName, roleFilter, registrationStatusFilter);
        
// //         // Show success dialog
// //         const agent = agents.find(a => a._id === agentId);
// //         if (agent) {
// //           setSelectedAgent({
// //             ...agent,
// //             registrationStatus: status
// //           });
// //         }
// //       }
// //     } catch (error: any) {
// //       console.error("Error updating registration status:", error);
// //       toast.error(error.response?.data?.message || "Failed to update registration status");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const fetchDistricts = useCallback(async () => {
// //     setDistrictsLoading(true);
// //     try {
// //       const response = await axios.get("/api/districts", {
// //         params: { 
// //           limit: 100,
// //           page: 1
// //         }
// //       });
// //       if (response.data.success) {
// //         setDistricts(response.data.data);
// //       }
// //     } catch (error: any) {
// //       console.error("Error fetching districts:", error);
// //       toast.error("Failed to load districts");
// //     } finally {
// //       setDistrictsLoading(false);
// //     }
// //   }, []);

// //   // Initial data fetch
// //   useEffect(() => {
// //     const fetchInitialData = async () => {
// //       try {
// //         setLoading(true);
// //         setError(null);
        
// //         // Fetch districts
// //         const districtsRes = await axios.get("/api/districts", {
// //           params: { limit: 100, page: 1 }
// //         });
        
// //         if (districtsRes.data.success) {
// //           setDistricts(districtsRes.data.data);
// //         }

// //         // Fetch agents
// //         await fetchAgents(1, "", "", roleFilter, "");

// //       } catch (err: any) {
// //         console.error('Error in initial data fetch:', err);
// //         setError('Failed to load data. Please try again.');
// //         toast.error("Failed to load data");
// //       } finally {
// //         setLoading(false);
// //         initialLoadRef.current = false;
// //       }
// //     };

// //     fetchInitialData();
// //   }, [fetchAgents, roleFilter]);

// //   // Handle subsequent fetches - only for page and rowsPerPage changes
// //   useEffect(() => {
// //     if (initialLoadRef.current) return;
// //     fetchAgents(currentPage, search, disName, roleFilter, registrationStatusFilter);
// //   }, [currentPage, rowsPerPage, fetchAgents]);

// //   // Debounced search and filter changes
// //   useEffect(() => {
// //     if (initialLoadRef.current) return;
    
// //     const timer = setTimeout(() => {
// //       fetchAgents(1, search, disName, roleFilter, registrationStatusFilter);
// //       setCurrentPage(1);
// //     }, 500);

// //     return () => clearTimeout(timer);
// //   }, [search, disName, roleFilter, registrationStatusFilter, fetchAgents]);

// //   /* ================= SELECTION HANDLERS ================= */

// //   const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     if (e.target.checked) {
// //       const allAgentIds = agents.map(agent => agent._id);
// //       setSelectedAgents(allAgentIds);
// //       setSelectAll(true);
// //     } else {
// //       setSelectedAgents([]);
// //       setSelectAll(false);
// //     }
// //   };

// //   const handleSelectOne = (id: string, checked: boolean) => {
// //     if (checked) {
// //       setSelectedAgents([...selectedAgents, id]);
// //     } else {
// //       setSelectedAgents(selectedAgents.filter(agentId => agentId !== id));
// //       setSelectAll(false);
// //     }
// //   };

// //   /* ================= FORM HANDLERS ================= */

// //   const handleChange = (
// //     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
// //   ) => {
// //     const { name, value, type } = e.target;
// //     const checked = (e.target as HTMLInputElement).checked;

// //     if (type === 'checkbox' && name === 'commodities') {
// //       const commodityId = value;
// //       setForm(prev => ({
// //         ...prev,
// //         commodities: prev.commodities.includes(commodityId)
// //           ? prev.commodities.filter(id => id !== commodityId)
// //           : [...prev.commodities, commodityId]
// //       }));
// //     } else if (type === 'checkbox') {
// //       setForm(prev => ({
// //         ...prev,
// //         [name]: checked,
// //       }));
// //     } else {
// //       setForm(prev => ({
// //         ...prev,
// //         [name]: value,
// //       }));
// //     }
// //   };

// //   const handlePincodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
// //     const pincode = e.target.value;
// //     setForm(prev => ({ ...prev, pincode }));

// //     if (pincode.length === 6) {
// //       try {
// //         const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
// //         const data = await res.json();

// //         if (data[0].Status === "Success") {
// //           const po = data[0].PostOffice[0];
// //           setForm(prev => ({
// //             ...prev,
// //             post: po.Name,
// //             taluk: po.Block || po.Taluk || '',
// //             district: po.District,
// //             state: po.State,
// //           }));
// //         }
// //       } catch {
// //         console.error("Invalid pincode");
// //       }
// //     }
// //   };

// //   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     const { name, files } = e.target;
// //     if (files && files[0]) {
// //       const fileName = files[0].name;
// //       setForm(prev => ({
// //         ...prev,
// //         [name]: `/uploads/${fileName}`,
// //       }));
// //       toast.success(`${name} file selected: ${fileName}`);
// //     }
// //   };

// //   const resetForm = () => {
// //     setForm({
// //       name: "",
// //       mobileNo: "",
// //       email: "",
// //       address: "",
// //       villageGramaPanchayat: "",
// //       pincode: "",
// //       state: "",
// //       district: "",
// //       taluk: "",
// //       post: "",
// //       role: "trader",
// //       latitude: "",
// //       longitude: "",
// //       totalLand: "",
// //       cultivatedLand: "",
// //       uncultivatedLand: "",
// //       commodities: [],
// //       accountHolderName: "",
// //       accountNumber: "",
// //       ifscCode: "",
// //       branch: "",
// //       panCard: "",
// //       aadharFront: "",
// //       aadharBack: "",
// //       bankPassbook: "",
// //       referralCode: "",
// //       mpin: "",
// //       password: "",
// //       isActive: true,
// //       registrationStatus: "pending",
// //     });
// //   };

// //   const populateFormForEdit = (agent: Agent) => {
// //     const personalInfo = agent.personalInfo;
// //     setForm({
// //       name: personalInfo.name || "",
// //       mobileNo: personalInfo.mobileNo || "",
// //       email: personalInfo.email || "",
// //       address: personalInfo.address || "",
// //       villageGramaPanchayat: personalInfo.villageGramaPanchayat || "",
// //       pincode: personalInfo.pincode || "",
// //       state: personalInfo.state || "",
// //       district: personalInfo.district || "",
// //       taluk: personalInfo.taluk || "",
// //       post: personalInfo.post || "",
// //       role: agent.role || "trader",
// //       latitude: agent.farmLocation?.latitude || "",
// //       longitude: agent.farmLocation?.longitude || "",
// //       totalLand: agent.farmLand?.total?.toString() || "",
// //       cultivatedLand: agent.farmLand?.cultivated?.toString() || "",
// //       uncultivatedLand: agent.farmLand?.uncultivated?.toString() || "",
// //       commodities: agent.commodities || [],
// //       accountHolderName: agent.bankDetails?.accountHolderName || "",
// //       accountNumber: agent.bankDetails?.accountNumber || "",
// //       ifscCode: agent.bankDetails?.ifscCode || "",
// //       branch: agent.bankDetails?.branch || "",
// //       panCard: agent.documents?.panCard || "",
// //       aadharFront: agent.documents?.aadharFront || "",
// //       aadharBack: agent.documents?.aadharBack || "",
// //       bankPassbook: agent.documents?.bankPassbook || "",
// //       referralCode: agent.security?.referralCode || "",
// //       mpin: "",
// //       password: "",
// //       isActive: agent.isActive ?? true,
// //       registrationStatus: agent.registrationStatus || "pending",
// //     });
// //     setSelectedAgent(agent);
// //     setEditOpen(true);
// //   };

// //   /* ================= CRUD OPERATIONS ================= */

// //   const handleAdd = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     try {
// //       setLoading(true);
      
// //       const agentData = {
// //         personalInfo: {
// //           name: form.name,
// //           mobileNo: form.mobileNo,
// //           email: form.email,
// //           address: form.address,
// //           villageGramaPanchayat: form.villageGramaPanchayat,
// //           pincode: form.pincode,
// //           state: form.state,
// //           district: form.district,
// //           taluk: form.taluk,
// //           post: form.post,
// //         },
// //         role: form.role,
// //         farmLocation: form.role === "farmer" ? {
// //           latitude: form.latitude,
// //           longitude: form.longitude,
// //         } : undefined,
// //         farmLand: form.role === "farmer" ? {
// //           total: form.totalLand ? Number(form.totalLand) : null,
// //           cultivated: form.cultivatedLand ? Number(form.cultivatedLand) : null,
// //           uncultivated: form.uncultivatedLand ? Number(form.uncultivatedLand) : null,
// //         } : undefined,
// //         commodities: form.commodities,
// //         nearestMarkets: [],
// //         bankDetails: {
// //           accountHolderName: form.accountHolderName,
// //           accountNumber: form.accountNumber,
// //           ifscCode: form.ifscCode,
// //           branch: form.branch,
// //         },
// //         documents: form.panCard || form.aadharFront || form.aadharBack || form.bankPassbook ? {
// //           panCard: form.panCard,
// //           aadharFront: form.aadharFront,
// //           aadharBack: form.aadharBack,
// //           bankPassbook: form.bankPassbook,
// //         } : undefined,
// //         security: {
// //           referralCode: form.referralCode,
// //           mpin: form.mpin,
// //           password: form.password,
// //         },
// //         isActive: form.isActive,
// //         registrationStatus: form.registrationStatus,
// //       };

// //       const res = await axios.post("/api/farmers", agentData);
      
// //       if (res.data.success) {
// //         toast.success("Agent added successfully!");
// //         setAddOpen(false);
// //         resetForm();
// //         fetchAgents(currentPage, search, disName, roleFilter, registrationStatusFilter);
// //       }
// //     } catch (err: any) {
// //       toast.error(err.response?.data?.message || "Failed to add agent");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleEdit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     if (!selectedAgent) return;
    
// //     try {
// //       setLoading(true);
      
// //       const agentData = {
// //         personalInfo: {
// //           name: form.name,
// //           mobileNo: form.mobileNo,
// //           email: form.email,
// //           address: form.address,
// //           villageGramaPanchayat: form.villageGramaPanchayat,
// //           pincode: form.pincode,
// //           state: form.state,
// //           district: form.district,
// //           taluk: form.taluk,
// //           post: form.post,
// //         },
// //         role: form.role,
// //         farmLocation: form.role === "farmer" ? {
// //           latitude: form.latitude,
// //           longitude: form.longitude,
// //         } : undefined,
// //         farmLand: form.role === "farmer" ? {
// //           total: form.totalLand ? Number(form.totalLand) : null,
// //           cultivated: form.cultivatedLand ? Number(form.cultivatedLand) : null,
// //           uncultivated: form.uncultivatedLand ? Number(form.uncultivatedLand) : null,
// //         } : undefined,
// //         commodities: form.commodities,
// //         bankDetails: {
// //           accountHolderName: form.accountHolderName,
// //           accountNumber: form.accountNumber,
// //           ifscCode: form.ifscCode,
// //           branch: form.branch,
// //         },
// //         documents: form.panCard || form.aadharFront || form.aadharBack || form.bankPassbook ? {
// //           panCard: form.panCard,
// //           aadharFront: form.aadharFront,
// //           aadharBack: form.aadharBack,
// //           bankPassbook: form.bankPassbook,
// //         } : undefined,
// //         security: {
// //           referralCode: form.referralCode,
// //           ...(form.mpin && { mpin: form.mpin }),
// //           ...(form.password && { password: form.password }),
// //         },
// //         isActive: form.isActive,
// //         registrationStatus: form.registrationStatus,
// //       };

// //       const res = await axios.put(`/api/farmers/${selectedAgent._id}`, agentData);
      
// //       if (res.data.success) {
// //         toast.success("Agent updated successfully!");
// //         setEditOpen(false);
// //         resetForm();
// //         setSelectedAgent(null);
// //         fetchAgents(currentPage, search, disName, roleFilter, registrationStatusFilter);
// //       }
// //     } catch (err: any) {
// //       toast.error(err.response?.data?.message || "Failed to update agent");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleDelete = async () => {
// //     if (!selectedAgent) return;
   
// //     try {
// //       setLoading(true);
// //       await axios.delete(`/api/farmers/${selectedAgent._id}`);
// //       toast.success("Agent deleted successfully!");
// //       setDeleteOpen(false);
// //       setSelectedAgent(null);
// //       fetchAgents(currentPage, search, disName, roleFilter, registrationStatusFilter);
// //     } catch (error: any) {
// //       toast.error(error.response?.data?.message || "Failed to delete agent. Please try again.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleBulkDelete = async () => {
// //     if (selectedAgents.length === 0) {
// //       toast.error("No agents selected");
// //       return;
// //     }

// //     try {
// //       setLoading(true);
// //       const response = await axios.post("/api/farmers/bulk-delete", {
// //         ids: selectedAgents
// //       });
      
// //       if (response.data.success) {
// //         toast.success(response.data.message || `${selectedAgents.length} agents deleted successfully!`);
// //         setSelectedAgents([]);
// //         setSelectAll(false);
// //         setBulkDeleteOpen(false);
// //         fetchAgents(currentPage, search, disName, roleFilter, registrationStatusFilter);
// //       } else {
// //         toast.error("Failed to delete agents");
// //       }
// //     } catch (error: any) {
// //       console.error("Bulk delete error:", error);
// //       toast.error("Error deleting agents");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   /* ================= EXPORT FUNCTIONS ================= */

// //   const exportData = agents.map((agent, index) => {
// //     const personalInfo = agent.personalInfo;
// //     return {
// //       "Sr.": index + 1 + (currentPage - 1) * rowsPerPage,
// //       "Name": personalInfo.name || 'N/A',
// //       "Mobile": personalInfo.mobileNo || 'N/A',
// //       "Email": personalInfo.email || 'N/A',
// //       "Role": agent.role || 'N/A',
// //       "Village": personalInfo.villageGramaPanchayat || 'N/A',
// //       "District": personalInfo.district || 'N/A',
// //       "State": personalInfo.state || 'N/A',
// //       "Address": personalInfo.address || 'N/A',
// //       "Taluk": personalInfo.taluk || 'N/A',
// //       "Post": personalInfo.post || 'N/A',
// //       "Pincode": personalInfo.pincode || 'N/A',
// //       "Registration Status": agent.registrationStatus || 'N/A',
// //       "Status": agent.isActive ? "Active" : "Inactive",
// //       "Registered": agent.registeredAt ? new Date(agent.registeredAt).toLocaleDateString() : 'N/A',
// //     };
// //   });

// //   const handlePrint = () => {
// //     if (agents.length === 0) {
// //       toast.error("No agents to print");
// //       return;
// //     }

// //     const printWindow = window.open('', '_blank', 'width=900,height=700');
// //     if (!printWindow) {
// //       toast.error("Please allow popups to print");
// //       return;
// //     }

// //     const printDate = new Date().toLocaleDateString();
// //     const printTime = new Date().toLocaleTimeString();
    
// //     const printContent = `
// //       <!DOCTYPE html>
// //       <html>
// //       <head>
// //         <title>Agents Report</title>
// //         <style>
// //           body {
// //             font-family: Arial, sans-serif;
// //             margin: 20px;
// //             color: #333;
// //           }
// //           .header {
// //             text-align: center;
// //             margin-bottom: 30px;
// //             padding-bottom: 15px;
// //             border-bottom: 2px solid #4CAF50;
// //           }
// //           .header h1 {
// //             margin: 0 0 10px 0;
// //             color: #1f2937;
// //             font-size: 24px;
// //           }
// //           .header-info {
// //             color: #6b7280;
// //             font-size: 14px;
// //             margin: 5px 0;
// //           }
// //           table {
// //             width: 100%;
// //             border-collapse: collapse;
// //             margin-top: 20px;
// //             font-size: 12px;
// //           }
// //           th {
// //             background-color: #f3f4f6;
// //             color: #374151;
// //             font-weight: 600;
// //             padding: 12px 8px;
// //             text-align: left;
// //             border: 1px solid #d1d5db;
// //           }
// //           td {
// //             padding: 10px 8px;
// //             border: 1px solid #e5e7eb;
// //             vertical-align: top;
// //           }
// //           tr:nth-child(even) {
// //             background-color: #f9fafb;
// //           }
// //           .footer {
// //             margin-top: 40px;
// //             padding-top: 20px;
// //             border-top: 1px solid #e5e7eb;
// //             font-size: 12px;
// //             color: #6b7280;
// //             text-align: center;
// //           }
// //           @media print {
// //             @page {
// //               margin: 0.5in;
// //             }
// //             body {
// //               margin: 0;
// //               -webkit-print-color-adjust: exact;
// //             }
// //           }
// //         </style>
// //       </head>
// //       <body>
// //         <div class="header">
// //           <h1>👤 Agents Management Report</h1>
// //           <div class="header-info">Generated on: ${printDate} at ${printTime}</div>
// //           <div class="header-info">Total Agents: ${totalAgents} | Showing: ${agents.length} agents</div>
// //           <div class="header-info">Page: ${currentPage} of ${totalPages}</div>
// //           <div class="header-info">Role Filter: ${roleFilter === "all" ? "All Roles" : roleFilter}</div>
// //         </div>
        
// //         <table>
// //           <thead>
// //             <tr>
// //               <th>Sr.</th>
// //               <th>Name</th>
// //               <th>Mobile</th>
// //               <th>Email</th>
// //               <th>Role</th>
// //               <th>Village</th>
// //               <th>District</th>
// //               <th>State</th>
// //               <th>Reg. Status</th>
// //               <th>Status</th>
// //               <th>Registered Date</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             ${agents.map((agent, index) => {
// //               const personalInfo = agent.personalInfo;
// //               return `
// //                 <tr>
// //                   <td>${index + 1 + (currentPage - 1) * rowsPerPage}</td>
// //                   <td><strong>${personalInfo.name || 'N/A'}</strong></td>
// //                   <td>${personalInfo.mobileNo || 'N/A'}</td>
// //                   <td>${personalInfo.email || 'N/A'}</td>
// //                   <td>${agent.role || 'N/A'}</td>
// //                   <td>${personalInfo.villageGramaPanchayat || 'N/A'}</td>
// //                   <td>${personalInfo.district || 'N/A'}</td>
// //                   <td>${personalInfo.state || 'N/A'}</td>
// //                   <td>${agent.registrationStatus || 'N/A'}</td>
// //                   <td>${agent.isActive ? 'Active' : 'Inactive'}</td>
// //                   <td>${agent.registeredAt ? new Date(agent.registeredAt).toLocaleDateString() : 'N/A'}</td>
// //                 </tr>
// //               `;
// //             }).join('')}
// //           </tbody>
// //         </table>
        
// //         <div class="footer">
// //           <p>Printed from Kissan Partner System | ${window.location.hostname}</p>
// //           <p>© ${new Date().getFullYear()} Kissan Partner. All rights reserved.</p>
// //         </div>
        
// //         <script>
// //           window.onload = function() {
// //             window.print();
// //             setTimeout(() => {
// //               if (confirm('Close print window?')) {
// //                 window.close();
// //               }
// //             }, 100);
// //           };
// //         </script>
// //       </body>
// //       </html>
// //     `;

// //     printWindow.document.write(printContent);
// //     printWindow.document.close();
// //   };

// //   const handleCopy = async () => {
// //     if (agents.length === 0) {
// //       toast.error("No agents to copy");
// //       return;
// //     }

// //     const text = exportData.map(f => 
// //       `${f["Sr."]}\t${f.Name}\t${f.Mobile}\t${f.Email}\t${f.Role}\t${f.Village}\t${f.District}\t${f.State}\t${f["Registration Status"]}\t${f.Status}\t${f.Registered}`
// //     ).join("\n");
    
// //     try {
// //       await navigator.clipboard.writeText(text);
// //       toast.success("Agents data copied to clipboard!");
// //     } catch (err) {
// //       toast.error("Failed to copy to clipboard");
// //     }
// //   };

// //   const handleExcel = () => {
// //     if (agents.length === 0) {
// //       toast.error("No agents to export");
// //       return;
// //     }

// //     try {
// //       const ws = XLSX.utils.json_to_sheet(exportData);
// //       const wb = XLSX.utils.book_new();
// //       XLSX.utils.book_append_sheet(wb, ws, "Agents");
// //       XLSX.writeFile(wb, `agents-${new Date().toISOString().split('T')[0]}.xlsx`);
// //       toast.success("Excel file exported successfully!");
// //     } catch (err) {
// //       toast.error("Failed to export Excel file");
// //     }
// //   };

// //   const handleCSV = () => {
// //     if (agents.length === 0) {
// //       toast.error("No agents to export");
// //       return;
// //     }

// //     try {
// //       const ws = XLSX.utils.json_to_sheet(exportData);
// //       const csv = XLSX.utils.sheet_to_csv(ws);
// //       const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
// //       const a = document.createElement("a");
// //       a.href = URL.createObjectURL(blob);
// //       a.download = `agents-${new Date().toISOString().split('T')[0]}.csv`;
// //       a.click();
// //       toast.success("CSV file exported successfully!");
// //     } catch (err) {
// //       toast.error("Failed to export CSV file");
// //     }
// //   };

// //   const handlePDF = () => {
// //     if (agents.length === 0) {
// //       toast.error("No agents to export");
// //       return;
// //     }

// //     try {
// //       const doc = new jsPDF();
// //       doc.text("Agents Management Report", 14, 16);
      
// //       const tableColumn = ["Sr.", "Name", "Mobile", "Email", "Role", "Village", "District", "State", "Reg. Status", "Status"];
// //       const tableRows: any = exportData.map(f => [
// //         f["Sr."],
// //         f.Name,
// //         f.Mobile,
// //         f.Email,
// //         f.Role,
// //         f.Village,
// //         f.District,
// //         f.State,
// //         f["Registration Status"],
// //         f.Status,
// //       ]);
      
// //       autoTable(doc, {
// //         head: [tableColumn],
// //         body: tableRows,
// //         startY: 20,
// //         styles: { fontSize: 8 },
// //         headStyles: { fillColor: [76, 175, 80] },
// //       });
      
// //       doc.save(`agents-${new Date().toISOString().split('T')[0]}.pdf`);
// //       toast.success("PDF file exported successfully!");
// //     } catch (err) {
// //       toast.error("Failed to export PDF file");
// //     }
// //   };

// //   /* ================= RESET FILTERS ================= */

// //   const handleResetFilters = () => {
// //     setSearch("");
// //     setCurrentPage(1);
// //     setDisName("");
// //     setRegistrationStatusFilter("");
// //     setSelectedAgents([]);
// //     setSelectAll(false);
// //     fetchAgents(1, "", "", "trader", "");
// //   };

// //   /* ================= GET REGISTRATION STATUS BADGE ================= */

// //   const getRegistrationStatusBadge = (status: string = "pending") => {
// //     switch (status.toLowerCase()) {
// //       case "approved":
// //         return "bg-green-100 text-green-800 border border-green-200";
// //       case "rejected":
// //         return "bg-red-100 text-red-800 border border-red-200";
// //       case "pending":
// //         return "bg-yellow-100 text-yellow-800 border border-yellow-200";
// //       case "under_review":
// //         return "bg-blue-100 text-blue-800 border border-blue-200";
// //       default:
// //         return "bg-gray-100 text-gray-800 border border-gray-200";
// //     }
// //   };

// //   const getRegistrationStatusIcon = (status: string = "pending") => {
// //     switch (status.toLowerCase()) {
// //       case "approved":
// //         return <FaCheckCircle className="inline mr-1" />;
// //       case "rejected":
// //         return <FaTimesCircle className="inline mr-1" />;
// //       case "pending":
// //         return <FaClock className="inline mr-1" />;
// //       case "under_review":
// //         return <FaEye className="inline mr-1" />;
// //       default:
// //         return <FaClock className="inline mr-1" />;
// //     }
// //   };

// //   /* ================= GET ROLE BADGE ================= */

// //   const getRoleBadge = (role: string) => {
// //     switch (role) {
// //       case "trader":
// //         return "bg-purple-100 text-purple-800";
// //       case "farmer":
// //         return "bg-blue-100 text-blue-800";
// //       default:
// //         return "bg-gray-100 text-gray-800";
// //     }
// //   };

// //   const getRoleIcon = (role: string) => {
// //     switch (role) {
// //       case "trader":
// //         return <FaUserTie className="inline mr-1" />;
// //       case "farmer":
// //         return <FaUser className="inline mr-1" />;
// //       default:
// //         return null;
// //     }
// //   };

// //   /* ================= UI ================= */

// //   return (
// //     <div className="p-[.6rem] relative text-black text-xs md:p-1 overflow-x-auto min-h-screen">
// //       {/* Loading Overlay */}
// //       {loading && (
// //         <div className="absolute inset-0 bg-[#e9e7e72f] z-[100] flex items-center justify-center ">
// //           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
// //         </div>
// //       )}

// //       {/* Header Section */}
// //       <div className="mb-4 flex gap-y-2 flex-wrap justify-between items-center">
// //         <div>
// //           <h1 className="text-2xl md:text-2xl font-bold text-gray-800">Agents Management</h1>
// //           <p className="text-gray-600 mt-2">
// //             Overview and detailed management of all registered agents. {totalAgents} agents found.
// //             {roleFilter !== "all" && (
// //               <span className="ml-2 font-medium">Role: {roleFilter}</span>
// //             )}
// //           </p>
// //         </div>
// //         <button 
// //           onClick={() => setAddOpen(true)}
// //           className="bg-green-500 p-2 px-4 text-white rounded shadow-2xl cursor-pointer flex items-center gap-2 hover:bg-green-600 transition-colors"
// //         >
// //           <FaPlus /> Add Agent
// //         </button>
// //       </div>

// //       {/* Add New Agent Dialog */}
// //       <Dialog open={addOpen} onClose={() => { setAddOpen(false); resetForm(); }} maxWidth="lg" fullWidth>
// //         <div className="p-6 max-h-[90vh] overflow-y-auto">
// //           <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Agent</h2>
// //           <form onSubmit={handleAdd} className="space-y-8">
// //             {/* PERSONAL INFO */}
// //             <section className="bg-gray-50 p-6 rounded-lg">
// //               <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Personal Information</h3>
// //               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
// //                 <div>
// //                   <label className="block text-xs font-medium text-gray-700 mb-1">Name *</label>
// //                   <input name="name" value={form.name} onChange={handleChange} required className="input-field" placeholder="Enter full name" />
// //                 </div>
// //                 <div>
// //                   <label className="block text-xs font-medium text-gray-700 mb-1">Mobile Number *</label>
// //                   <input name="mobileNo" value={form.mobileNo} onChange={handleChange} required className="input-field" placeholder="Enter mobile number" type="tel" />
// //                 </div>
// //                 <div>
// //                   <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
// //                   <input name="email" value={form.email} onChange={handleChange} className="input-field" placeholder="Enter email address" type="email" />
// //                 </div>
// //                 <div className="md:col-span-2">
// //                   <label className="block text-xs font-medium text-gray-700 mb-1">Address</label>
// //                   <input name="address" value={form.address} onChange={handleChange} className="input-field" placeholder="Enter complete address" />
// //                 </div>
// //                 <div>
// //                   <label className="block text-xs font-medium text-gray-700 mb-1">Village/Grama Panchayat</label>
// //                   <input name="villageGramaPanchayat" value={form.villageGramaPanchayat} onChange={handleChange} className="input-field" placeholder="Enter village name" />
// //                 </div>
// //                 <div>
// //                   <label className="block text-xs font-medium text-gray-700 mb-1">Pincode</label>
// //                   <input name="pincode" value={form.pincode} onChange={handlePincodeChange} maxLength={6} className="input-field" placeholder="Enter 6-digit pincode" />
// //                 </div>
// //                 <div>
// //                   <label className="block text-xs font-medium text-gray-700 mb-1">State</label>
// //                   <input name="state" value={form.state} onChange={handleChange} className="input-field" placeholder="State" readOnly />
// //                 </div>
// //                 <div>
// //                   <label className="block text-xs font-medium text-gray-700 mb-1">District</label>
// //                   <input name="district" value={form.district} onChange={handleChange} className="input-field" placeholder="District" readOnly />
// //                 </div>
// //                 <div>
// //                   <label className="block text-xs font-medium text-gray-700 mb-1">Taluk</label>
// //                   <input name="taluk" value={form.taluk} onChange={handleChange} className="input-field" placeholder="Taluk" readOnly />
// //                 </div>
// //                 <div>
// //                   <label className="block text-xs font-medium text-gray-700 mb-1">Post</label>
// //                   <input name="post" value={form.post} onChange={handleChange} className="input-field" placeholder="Post" readOnly />
// //                 </div>
// //               </div>
// //             </section>

// //             {/* ROLE SELECTION */}
// //             <section className="bg-gray-50 p-6 rounded-lg">
// //               <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Agent Role</h3>
// //               <div className="flex gap-6">
// //                 <label className="flex items-center space-x-2 cursor-pointer">
// //                   <input type="radio" name="role" value="trader" checked={form.role === "trader"} onChange={handleChange} className="h-4 w-4 text-green-600" />
// //                   <span className="text-gray-700">Trader</span>
// //                 </label>
// //                 {/* <label className="flex items-center space-x-2 cursor-pointer">
// //                   <input type="radio" name="role" value="farmer" checked={form.role === "farmer"} onChange={handleChange} className="h-4 w-4 text-green-600" />
// //                   <span className="text-gray-700">Farmer</span>
// //                 </label> */}
// //               </div>
// //             </section>

// //             {/* REGISTRATION STATUS */}
// //             <section className="bg-gray-50 p-6 rounded-lg">
// //               <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Registration Status</h3>
// //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                 <div>
// //                   <label className="block text-xs font-medium text-gray-700 mb-1">Registration Status</label>
// //                   <select name="registrationStatus" value={form.registrationStatus} onChange={handleChange} className="input-field">
// //                     <option value="pending">Pending</option>
// //                     <option value="approved">Approved</option>
// //                     <option value="rejected">Rejected</option>
// //                     <option value="under_review">Under Review</option>
// //                   </select>
// //                 </div>
// //               </div>
// //             </section>

// //             {/* FARM INFORMATION (Only for farmers) */}
// //             {form.role === "farmer" && (
// //               <>
// //                 <section className="bg-gray-50 p-6 rounded-lg">
// //                   <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Farm Location</h3>
// //                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                     <div>
// //                       <label className="block text-xs font-medium text-gray-700 mb-1">Latitude</label>
// //                       <input name="latitude" value={form.latitude} onChange={handleChange} className="input-field" placeholder="Enter latitude" />
// //                     </div>
// //                     <div>
// //                       <label className="block text-xs font-medium text-gray-700 mb-1">Longitude</label>
// //                       <input name="longitude" value={form.longitude} onChange={handleChange} className="input-field" placeholder="Enter longitude" />
// //                     </div>
// //                   </div>
// //                 </section>

// //                 <section className="bg-gray-50 p-6 rounded-lg">
// //                   <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Farm Land Details</h3>
// //                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// //                     <div>
// //                       <label className="block text-xs font-medium text-gray-700 mb-1">Total Land (acres)</label>
// //                       <input name="totalLand" value={form.totalLand} onChange={handleChange} className="input-field" placeholder="Total land area" type="number" />
// //                     </div>
// //                     <div>
// //                       <label className="block text-xs font-medium text-gray-700 mb-1">Cultivated Land (acres)</label>
// //                       <input name="cultivatedLand" value={form.cultivatedLand} onChange={handleChange} className="input-field" placeholder="Cultivated land area" type="number" />
// //                     </div>
// //                     <div>
// //                       <label className="block text-xs font-medium text-gray-700 mb-1">Uncultivated Land (acres)</label>
// //                       <input name="uncultivatedLand" value={form.uncultivatedLand} onChange={handleChange} className="input-field" placeholder="Uncultivated land area" type="number" />
// //                     </div>
// //                   </div>
// //                 </section>
// //               </>
// //             )}

// //             {/* COMMODITIES */}
// //             <section className="bg-gray-50 p-6 rounded-lg">
// //               <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Commodities</h3>
// //               <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
// //                 {availableCommodities.map(commodity => (
// //                   <label key={commodity.id} className="flex items-center space-x-2 cursor-pointer p-2 bg-white rounded border hover:bg-gray-50">
// //                     <input type="checkbox" name="commodities" value={commodity.id} checked={form.commodities.includes(commodity.id)} onChange={handleChange} className="h-4 w-4 text-green-600" />
// //                     <span className="text-gray-700">{commodity.name}</span>
// //                   </label>
// //                 ))}
// //               </div>
// //             </section>

// //             {/* BANK DETAILS */}
// //             <section className="bg-gray-50 p-6 rounded-lg">
// //               <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Bank Details</h3>
// //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                 <div>
// //                   <label className="block text-xs font-medium text-gray-700 mb-1">Account Holder Name</label>
// //                   <input name="accountHolderName" value={form.accountHolderName} onChange={handleChange} className="input-field" placeholder="Account holder name" />
// //                 </div>
// //                 <div>
// //                   <label className="block text-xs font-medium text-gray-700 mb-1">Account Number</label>
// //                   <input name="accountNumber" value={form.accountNumber} onChange={handleChange} className="input-field" placeholder="Bank account number" />
// //                 </div>
// //                 <div>
// //                   <label className="block text-xs font-medium text-gray-700 mb-1">IFSC Code</label>
// //                   <input name="ifscCode" value={form.ifscCode} onChange={handleChange} className="input-field" placeholder="Bank IFSC code" />
// //                 </div>
// //                 <div>
// //                   <label className="block text-xs font-medium text-gray-700 mb-1">Branch</label>
// //                   <input name="branch" value={form.branch} onChange={handleChange} className="input-field" placeholder="Bank branch" />
// //                 </div>
// //               </div>
// //             </section>

// //             {/* SECURITY */}
// //             <section className="bg-gray-50 p-6 rounded-lg">
// //               <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Security & Activation</h3>
// //               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// //                 <div>
// //                   <label className="block text-xs font-medium text-gray-700 mb-1">Referral Code</label>
// //                   <input name="referralCode" value={form.referralCode} onChange={handleChange} className="input-field" placeholder="Referral code (optional)" />
// //                 </div>
// //                 <div>
// //                   <label className="block text-xs font-medium text-gray-700 mb-1">MPIN</label>
// //                   <input name="mpin" value={form.mpin} onChange={handleChange} type="password" className="input-field" placeholder="Set 4-digit MPIN" />
// //                 </div>
// //                 <div>
// //                   <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
// //                   <input name="password" value={form.password} onChange={handleChange} type="password" className="input-field" placeholder="Set password" />
// //                 </div>
// //                 <div className="md:col-span-3">
// //                   <label className="flex items-center space-x-2 cursor-pointer">
// //                     <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="h-4 w-4 text-green-600" />
// //                     <span className="text-gray-700">Active Account</span>
// //                   </label>
// //                 </div>
// //               </div>
// //             </section>

// //             {/* FORM ACTIONS */}
// //             <div className="flex justify-end gap-4 pt-6 border-t">
// //               <button type="button" onClick={() => { setAddOpen(false); resetForm(); }} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
// //                 Cancel
// //               </button>
// //               <button type="submit" disabled={loading} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
// //                 {loading ? "Adding..." : "Add Agent"}
// //               </button>
// //             </div>
// //           </form>
// //         </div>
// //       </Dialog>

// //       {/* Edit Agent Dialog */}
// //       <Dialog open={editOpen} onClose={() => { setEditOpen(false); resetForm(); setSelectedAgent(null); }} maxWidth="lg" fullWidth>
// //         <div className="p-6 max-h-[90vh] overflow-y-auto">
// //           <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Agent</h2>
// //           <form onSubmit={handleEdit} className="space-y-8">
// //             {/* PERSONAL INFO */}
// //             <section className="bg-gray-50 p-6 rounded-lg">
// //               <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Personal Information</h3>
// //               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
// //                 <div>
// //                   <label className="block text-xs font-medium text-gray-700 mb-1">Name *</label>
// //                   <input name="name" value={form.name} onChange={handleChange} required className="input-field" placeholder="Enter full name" />
// //                 </div>
// //                 <div>
// //                   <label className="block text-xs font-medium text-gray-700 mb-1">Mobile Number *</label>
// //                   <input name="mobileNo" value={form.mobileNo} onChange={handleChange} required className="input-field" placeholder="Enter mobile number" type="tel" />
// //                 </div>
// //                 <div>
// //                   <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
// //                   <input name="email" value={form.email} onChange={handleChange} className="input-field" placeholder="Enter email address" type="email" />
// //                 </div>
// //                 <div className="md:col-span-2">
// //                   <label className="block text-xs font-medium text-gray-700 mb-1">Address</label>
// //                   <input name="address" value={form.address} onChange={handleChange} className="input-field" placeholder="Enter complete address" />
// //                 </div>
// //                 <div>
// //                   <label className="block text-xs font-medium text-gray-700 mb-1">Village/Grama Panchayat</label>
// //                   <input name="villageGramaPanchayat" value={form.villageGramaPanchayat} onChange={handleChange} className="input-field" placeholder="Enter village name" />
// //                 </div>
// //                 <div>
// //                   <label className="block text-xs font-medium text-gray-700 mb-1">Pincode</label>
// //                   <input name="pincode" value={form.pincode} onChange={handlePincodeChange} maxLength={6} className="input-field" placeholder="Enter 6-digit pincode" />
// //                 </div>
// //                 <div>
// //                   <label className="block text-xs font-medium text-gray-700 mb-1">State</label>
// //                   <input name="state" value={form.state} onChange={handleChange} className="input-field" placeholder="State" />
// //                 </div>
// //                 <div>
// //                   <label className="block text-xs font-medium text-gray-700 mb-1">District</label>
// //                   <input name="district" value={form.district} onChange={handleChange} className="input-field" placeholder="District" />
// //                 </div>
// //                 <div>
// //                   <label className="block text-xs font-medium text-gray-700 mb-1">Taluk</label>
// //                   <input name="taluk" value={form.taluk} onChange={handleChange} className="input-field" placeholder="Taluk" />
// //                 </div>
// //                 <div>
// //                   <label className="block text-xs font-medium text-gray-700 mb-1">Post</label>
// //                   <input name="post" value={form.post} onChange={handleChange} className="input-field" placeholder="Post" />
// //                 </div>
// //               </div>
// //             </section>

// //             {/* ROLE SELECTION */}
// //             <section className="bg-gray-50 p-6 rounded-lg">
// //               <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Agent Role</h3>
// //               <div className="flex gap-6">
// //                 <label className="flex items-center space-x-2 cursor-pointer">
// //                   <input type="radio" name="role" value="trader" checked={form.role === "trader"} onChange={handleChange} className="h-4 w-4 text-green-600" />
// //                   <span className="text-gray-700">Trader</span>
// //                 </label>
// //                 {/* <label className="flex items-center space-x-2 cursor-pointer">
// //                   <input type="radio" name="role" value="farmer" checked={form.role === "farmer"} onChange={handleChange} className="h-4 w-4 text-green-600" />
// //                   <span className="text-gray-700">Farmer</span>
// //                 </label> */}
// //               </div>
// //             </section>

// //             {/* REGISTRATION STATUS */}
// //             <section className="bg-gray-50 p-6 rounded-lg">
// //               <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Registration Status</h3>
// //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                 <div>
// //                   <label className="block text-xs font-medium text-gray-700 mb-1">Registration Status</label>
// //                   <select name="registrationStatus" value={form.registrationStatus} onChange={handleChange} className="input-field">
// //                     <option value="pending">Pending</option>
// //                     <option value="approved">Approved</option>
// //                     <option value="rejected">Rejected</option>
// //                     <option value="under_review">Under Review</option>
// //                   </select>
// //                 </div>
// //               </div>
// //             </section>

// //             {/* FARM INFORMATION (Only for farmers) */}
// //             {form.role === "farmer" && (
// //               <>
// //                 <section className="bg-gray-50 p-6 rounded-lg">
// //                   <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Farm Location</h3>
// //                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                     <div>
// //                       <label className="block text-xs font-medium text-gray-700 mb-1">Latitude</label>
// //                       <input name="latitude" value={form.latitude} onChange={handleChange} className="input-field" placeholder="Enter latitude" />
// //                     </div>
// //                     <div>
// //                       <label className="block text-xs font-medium text-gray-700 mb-1">Longitude</label>
// //                       <input name="longitude" value={form.longitude} onChange={handleChange} className="input-field" placeholder="Enter longitude" />
// //                     </div>
// //                   </div>
// //                 </section>

// //                 <section className="bg-gray-50 p-6 rounded-lg">
// //                   <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Farm Land Details</h3>
// //                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// //                     <div>
// //                       <label className="block text-xs font-medium text-gray-700 mb-1">Total Land (acres)</label>
// //                       <input name="totalLand" value={form.totalLand} onChange={handleChange} className="input-field" placeholder="Total land area" type="number" />
// //                     </div>
// //                     <div>
// //                       <label className="block text-xs font-medium text-gray-700 mb-1">Cultivated Land (acres)</label>
// //                       <input name="cultivatedLand" value={form.cultivatedLand} onChange={handleChange} className="input-field" placeholder="Cultivated land area" type="number" />
// //                     </div>
// //                     <div>
// //                       <label className="block text-xs font-medium text-gray-700 mb-1">Uncultivated Land (acres)</label>
// //                       <input name="uncultivatedLand" value={form.uncultivatedLand} onChange={handleChange} className="input-field" placeholder="Uncultivated land area" type="number" />
// //                     </div>
// //                   </div>
// //                 </section>
// //               </>
// //             )}

// //             {/* COMMODITIES */}
// //             <section className="bg-gray-50 p-6 rounded-lg">
// //               <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Commodities</h3>
// //               <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
// //                 {availableCommodities.map(commodity => (
// //                   <label key={commodity.id} className="flex items-center space-x-2 cursor-pointer p-2 bg-white rounded border hover:bg-gray-50">
// //                     <input type="checkbox" name="commodities" value={commodity.id} checked={form.commodities.includes(commodity.id)} onChange={handleChange} className="h-4 w-4 text-green-600" />
// //                     <span className="text-gray-700">{commodity.name}</span>
// //                   </label>
// //                 ))}
// //               </div>
// //             </section>

// //             {/* BANK DETAILS */}
// //             <section className="bg-gray-50 p-6 rounded-lg">
// //               <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Bank Details</h3>
// //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                 <div>
// //                   <label className="block text-xs font-medium text-gray-700 mb-1">Account Holder Name</label>
// //                   <input name="accountHolderName" value={form.accountHolderName} onChange={handleChange} className="input-field" placeholder="Account holder name" />
// //                 </div>
// //                 <div>
// //                   <label className="block text-xs font-medium text-gray-700 mb-1">Account Number</label>
// //                   <input name="accountNumber" value={form.accountNumber} onChange={handleChange} className="input-field" placeholder="Bank account number" />
// //                 </div>
// //                 <div>
// //                   <label className="block text-xs font-medium text-gray-700 mb-1">IFSC Code</label>
// //                   <input name="ifscCode" value={form.ifscCode} onChange={handleChange} className="input-field" placeholder="Bank IFSC code" />
// //                 </div>
// //                 <div>
// //                   <label className="block text-xs font-medium text-gray-700 mb-1">Branch</label>
// //                   <input name="branch" value={form.branch} onChange={handleChange} className="input-field" placeholder="Bank branch" />
// //                 </div>
// //               </div>
// //             </section>

// //             {/* SECURITY */}
// //             <section className="bg-gray-50 p-6 rounded-lg">
// //               <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Security & Activation</h3>
// //               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// //                 <div>
// //                   <label className="block text-xs font-medium text-gray-700 mb-1">Referral Code</label>
// //                   <input name="referralCode" value={form.referralCode} onChange={handleChange} className="input-field" placeholder="Referral code (optional)" />
// //                 </div>
// //                 <div>
// //                   <label className="block text-xs font-medium text-gray-700 mb-1">MPIN</label>
// //                   <input name="mpin" value={form.mpin} onChange={handleChange} type="password" className="input-field" placeholder="Set 4-digit MPIN" />
// //                 </div>
// //                 <div>
// //                   <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
// //                   <input name="password" value={form.password} onChange={handleChange} type="password" className="input-field" placeholder="Set password" />
// //                 </div>
// //                 <div className="md:col-span-3">
// //                   <label className="flex items-center space-x-2 cursor-pointer">
// //                     <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="h-4 w-4 text-green-600" />
// //                     <span className="text-gray-700">Active Account</span>
// //                   </label>
// //                 </div>
// //               </div>
// //             </section>

// //             {/* FORM ACTIONS */}
// //             <div className="flex justify-end gap-4 pt-6 border-t">
// //               <button type="button" onClick={() => { setEditOpen(false); resetForm(); setSelectedAgent(null); }} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
// //                 Cancel
// //               </button>
// //               <button type="submit" disabled={loading} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
// //                 {loading ? "Updating..." : "Update Agent"}
// //               </button>
// //             </div>
// //           </form>
// //         </div>
// //       </Dialog>

// //       {/* Bulk Actions Bar */}
// //       {selectedAgents.length > 0 && (
// //         <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
// //           <div className="flex items-center justify-between">
// //             <div className="flex items-center gap-2">
// //               <FaCheck className="text-red-600" />
// //               <span className="font-medium text-red-700">
// //                 {selectedAgents.length} agent{selectedAgents.length !== 1 ? 's' : ''} selected
// //               </span>
// //             </div>
// //             <button
// //               onClick={() => setBulkDeleteOpen(true)}
// //               className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
// //             >
// //               <FaTrash className="w-4 h-4" />
// //               Delete Selected
// //             </button>
// //           </div>
// //         </div>
// //       )}

// //       {/* Export Buttons Section */}
// //       <div className="lg:hidden flex flex-wrap gap-[.6rem] text-xs bg-white p-[.6rem] shadow">
// //         {[
// //           { label: "Copy", icon: FaCopy, onClick: handleCopy, color: "bg-gray-100 hover:bg-gray-200 text-gray-800" },
// //           { label: "Excel", icon: FaFileExcel, onClick: handleExcel, color: "bg-green-100 hover:bg-green-200 text-green-800" },
// //           { label: "CSV", icon: FaFileCsv, onClick: handleCSV, color: "bg-blue-100 hover:bg-blue-200 text-blue-800" },
// //           { label: "PDF", icon: FaFilePdf, onClick: handlePDF, color: "bg-red-100 hover:bg-red-200 text-red-800" },
// //           { label: "Print", icon: FaPrint, onClick: handlePrint, color: "bg-purple-100 hover:bg-purple-200 text-purple-800" },
// //         ].map((btn, i) => (
// //           <button
// //             key={i}
// //             onClick={btn.onClick}
// //             disabled={agents.length === 0}
// //             className={`flex items-center gap-[.6rem] text-xs px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md ${btn.color} font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
// //           >
// //             <btn.icon className="text-xs" />
// //           </button>
// //         ))}
// //       </div>

// //       {/* Filters Section */}
// //       <div className="bg-white rounded lg:rounded-none shadow p-[.6rem] text-xs mb-2">
// //         <div className="gap-[.6rem] text-xs items-end flex flex-wrap md:flex-row flex-col md:*:w-fit *:w-full">
// //           {/* Search Input */}
// //           <div className="md:col-span-3">
// //             <div className="relative">
// //               <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
// //               <input
// //                 type="text"
// //                 placeholder="Search by name, mobile, email, or village..."
// //                 value={search}
// //                 onChange={(e) => setSearch(e.target.value)}
// //                 disabled={loading}
// //                 className="md:w-80 w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all disabled:opacity-50"
// //               />
// //             </div>
// //           </div>

// //           {/* District Filter */}
// //           <div className="md:col-span-2">
// //             <select
// //               className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors"
// //               value={disName}
// //               onChange={(e) => setDisName(e.target.value)}
// //               disabled={districtsLoading || loading}
// //             >
// //               {districtsLoading ? (
// //                 <option>Loading districts...</option>
// //               ) : districts.length === 0 ? (
// //                 <option value="">No districts available</option>
// //               ) : (
// //                 <>
// //                   <option value="">All Districts</option>
// //                   {districts.map(district => (
// //                     <option key={district._id} value={district.name}>
// //                       {district.name}
// //                     </option>
// //                   ))}
// //                 </>
// //               )}
// //             </select>
// //           </div>

// //           {/* Registration Status Filter */}
// //           <div className="md:col-span-2">
// //             <select
// //               className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors"
// //               value={registrationStatusFilter}
// //               onChange={(e) => setRegistrationStatusFilter(e.target.value)}
// //               disabled={loading}
// //             >
// //               {registrationStatusOptions.map(option => (
// //                 <option key={option.value} value={option.value}>
// //                   {option.label}
// //                 </option>
// //               ))}
// //             </select>
// //           </div>

// //           {/* Reset Button */}
// //           <div className="md:col-span-2">
// //             <button
// //               onClick={handleResetFilters}
// //               disabled={loading}
// //               className="w-full px-4 py-2.5 border border-gray-300 rounded hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
// //             >
// //               <FaRedo /> Reset
// //             </button>
// //           </div>

// //           {/* Desktop Export Buttons */}
// //           <div className="lg:flex hidden ml-auto flex-wrap gap-[.6rem] text-xs">
// //             {[
// //               { label: "Copy", icon: FaCopy, onClick: handleCopy, color: "bg-gray-100 hover:bg-gray-200 text-gray-800", disabled: agents.length === 0 },
// //               { label: "Excel", icon: FaFileExcel, onClick: handleExcel, color: "bg-green-100 hover:bg-green-200 text-green-800", disabled: agents.length === 0 },
// //               { label: "CSV", icon: FaFileCsv, onClick: handleCSV, color: "bg-blue-100 hover:bg-blue-200 text-blue-800", disabled: agents.length === 0 },
// //               { label: "PDF", icon: FaFilePdf, onClick: handlePDF, color: "bg-red-100 hover:bg-red-200 text-red-800", disabled: agents.length === 0 },
// //               { label: "Print", icon: FaPrint, onClick: handlePrint, color: "bg-purple-100 hover:bg-purple-200 text-purple-800", disabled: agents.length === 0 },
// //             ].map((btn, i) => (
// //               <button
// //                 key={i}
// //                 onClick={btn.onClick}
// //                 disabled={btn.disabled || loading}
// //                 className={`flex items-center gap-[.6rem] text-xs px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md ${btn.color} font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
// //               >
// //                 <btn.icon className="text-xs" />
// //               </button>
// //             ))}
// //           </div>
// //         </div>
// //       </div>

// //       {/* Error Message */}
// //       {error && (
// //         <div className="mb-4 p-3 bg-red-50 text-red-600 rounded border border-red-200">
// //           {error}
// //         </div>
// //       )}

// //       {/* Desktop Table */}
// //       {!loading && agents.length > 0 && (
// //         <>
// //           <div className="hidden lg:block bg-white rounded shadow">
// //             <table className="min-w-full">
// //               <thead className="border-b border-zinc-200">
// //                 <tr className="*:text-zinc-800">
// //                   <th className="p-[.6rem] text-xs text-left font-semibold w-10">
// //                     <input
// //                       type="checkbox"
// //                       checked={selectAll}
// //                       onChange={handleSelectAll}
// //                       disabled={loading}
// //                       className="rounded border-gray-300"
// //                     />
// //                   </th>
// //                   <th className="p-[.6rem] text-xs text-left font-semibold">Sr.</th>
// //                   <th className="p-[.6rem] text-xs text-left font-semibold">Name</th>
// //                   <th className="p-[.6rem] text-xs text-left font-semibold">Mobile</th>
// //                   <th className="p-[.6rem] min-w-28 text-xs text-left font-semibold">Email</th>
// //                   <th className="p-[.6rem] text-xs text-left font-semibold">Role</th>
// //                   <th className="p-[.6rem] text-xs text-left font-semibold">Village</th>
// //                   <th className="p-[.6rem] text-xs text-left font-semibold">District</th>
// //                   <th className="p-[.6rem] text-xs text-left font-semibold">State</th>
// //                   <th className="p-[.6rem] text-xs text-left font-semibold">Reg. Status</th>
// //                   <th className="p-[.6rem] text-xs text-left font-semibold">Status</th>
// //                   <th className="p-[.6rem] text-xs text-left font-semibold">Actions</th>
// //                 </tr>
// //               </thead>
// //               <tbody className="divide-y divide-gray-100">
// //                 {agents.map((agent, index) => {
// //                   const personalInfo = agent.personalInfo;
// //                   return (
// //                     <tr key={agent._id} className="hover:bg-gray-50 transition-colors">
// //                       <td className="p-[.6rem] text-xs">
// //                         <input
// //                           type="checkbox"
// //                           checked={selectedAgents.includes(agent._id)}
// //                           onChange={(e) => handleSelectOne(agent._id, e.target.checked)}
// //                           disabled={loading}
// //                           className="rounded border-gray-300"
// //                         />
// //                       </td>
// //                       <td className="p-[.6rem] text-xs text-center">
// //                         {index + 1 + (currentPage - 1) * rowsPerPage}
// //                       </td>
// //                       <td className="p-[.6rem] text-xs">
// //                         <div className="font-semibold">{personalInfo.name || 'N/A'}</div>
// //                         {agent.farmerId && <div className="text-xs text-gray-500">ID: {agent.farmerId}</div>}
// //                       </td>
// //                       <td className="p-[.6rem] text-xs">{personalInfo.mobileNo || 'N/A'}</td>
// //                       <td className="p-[.6rem] text-xs">
// //                         <span className={`${personalInfo.email ? 'text-gray-900' : 'text-gray-400 italic'}`}>
// //                           {personalInfo.email || 'No email'}
// //                         </span>
// //                       </td>
// //                       <td className="p-[.6rem] text-xs">
// //                         <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleBadge(agent.role)}`}>
// //                           {getRoleIcon(agent.role)}
// //                           {agent.role || 'N/A'}
// //                         </span>
// //                       </td>
// //                       <td className="p-[.6rem] text-xs">{personalInfo.villageGramaPanchayat || 'N/A'}</td>
// //                       <td className="p-[.6rem] text-xs">{personalInfo.district || 'N/A'}</td>
// //                       <td className="p-[.6rem] text-xs">{personalInfo.state || 'N/A'}</td>
// //                       <td className="p-[.6rem] text-xs">
// //                         <span className={`px-2 py-1 rounded text-xs font-medium ${getRegistrationStatusBadge(agent.registrationStatus)}`}>
// //                           {getRegistrationStatusIcon(agent.registrationStatus)}
// //                           {agent.registrationStatus || 'Pending'}
// //                         </span>
// //                       </td>
// //                       <td className="p-[.6rem] text-xs">
// //                         <span className={`px-2 py-1 rounded text-xs font-medium ${agent?.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
// //                           {agent?.isActive ? "Active" : "Inactive"}
// //                         </span>
// //                       </td>
// //                       <td className="p-[.6rem] text-xs">
// //                         <div className="flex gap-[.6rem] text-xs">
// //                           <button
// //                             onClick={() => { setSelectedAgent(agent); setViewOpen(true); }}
// //                             disabled={loading}
// //                             className="p-[.6rem] text-xs text-blue-600 hover:bg-blue-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
// //                             title="View Details"
// //                           >
// //                             <FaEye />
// //                           </button>
// //                           <button
// //                             onClick={() => populateFormForEdit(agent)}
// //                             disabled={loading}
// //                             className="p-[.6rem] text-xs text-green-600 hover:bg-green-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
// //                             title="Edit Agent"
// //                           >
// //                             <FaEdit />
// //                           </button>
// //                           <button
// //                             onClick={() => { setSelectedAgent(agent); setDeleteOpen(true); }}
// //                             disabled={loading}
// //                             className="p-[.6rem] text-xs text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
// //                             title="Delete Agent"
// //                           >
// //                             <FaTrash />
// //                           </button>
// //                           {/* Approve Button */}
// //                           {agent.registrationStatus !== "approved" && (
// //                             <button
// //                               onClick={() => handleUpdateRegistrationStatus(agent._id, "approved")}
// //                               disabled={loading}
// //                               className="p-[.6rem] text-xs text-green-600 hover:bg-green-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
// //                               title="Approve Agent"
// //                             >
// //                               <FaCheckCircle />
// //                             </button>
// //                           )}
// //                         </div>
// //                       </td>
// //                     </tr>
// //                   );
// //                 })}
// //               </tbody>
// //             </table>
// //           </div>

// //           {/* Mobile Cards */}
// //           <div className="lg:hidden space-y-2 p-[.2rem] text-xs">
// //             {agents.map((agent, index) => {
// //               const personalInfo = agent.personalInfo;
// //               return (
// //                 <div key={agent._id} className="rounded p-[.6rem] text-xs border border-zinc-200 bg-white shadow">
// //                   <div className="flex justify-between items-start mb-3">
// //                     <div className="flex items-center gap-2">
// //                       <input
// //                         type="checkbox"
// //                         checked={selectedAgents.includes(agent._id)}
// //                         onChange={(e) => handleSelectOne(agent._id, e.target.checked)}
// //                         disabled={loading}
// //                         className="rounded border-gray-300"
// //                       />
// //                       <div>
// //                         <div className="font-bold text-gray-800">{personalInfo.name || 'N/A'}</div>
// //                         <div className="text-xs text-gray-500">Sr. {index + 1 + (currentPage - 1) * rowsPerPage}</div>
// //                         {agent.farmerId && <div className="text-xs text-gray-500">ID: {agent.farmerId}</div>}
// //                       </div>
// //                     </div>
// //                     <div className="flex gap-[.6rem] text-xs">
// //                       <button 
// //                         onClick={() => { setSelectedAgent(agent); setViewOpen(true); }} 
// //                         disabled={loading}
// //                         className="p-1.5 text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
// //                       >
// //                         <FaEye />
// //                       </button>
// //                       <button 
// //                         onClick={() => populateFormForEdit(agent)} 
// //                         disabled={loading}
// //                         className="p-1.5 text-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
// //                       >
// //                         <FaEdit />
// //                       </button>
// //                       <button 
// //                         onClick={() => { setSelectedAgent(agent); setDeleteOpen(true); }} 
// //                         disabled={loading}
// //                         className="p-1.5 text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
// //                       >
// //                         <FaTrash />
// //                       </button>
// //                       {/* Approve Button for Mobile */}
// //                       {agent.registrationStatus !== "approved" && (
// //                         <button
// //                           onClick={() => handleUpdateRegistrationStatus(agent._id, "approved")}
// //                           disabled={loading}
// //                           className="p-1.5 text-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
// //                           title="Approve Agent"
// //                         >
// //                           <FaCheckCircle />
// //                         </button>
// //                       )}
// //                     </div>
// //                   </div>
// //                   <div className="space-y-2">
// //                     <div>
// //                       <div className="text-xs text-gray-500">Mobile</div>
// //                       <div className="text-xs">{personalInfo.mobileNo || 'N/A'}</div>
// //                     </div>
// //                     <div>
// //                       <div className="text-xs text-gray-500">Email</div>
// //                       <div className={`text-xs ${personalInfo.email ? 'text-gray-700' : 'text-gray-400 italic'}`}>
// //                         {personalInfo.email || 'No email'}
// //                       </div>
// //                     </div>
// //                     <div>
// //                       <div className="text-xs text-gray-500">Role</div>
// //                       <div className="text-xs">
// //                         <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleBadge(agent.role)}`}>
// //                           {getRoleIcon(agent.role)}
// //                           {agent.role || 'N/A'}
// //                         </span>
// //                       </div>
// //                     </div>
// //                     <div className="grid grid-cols-2 gap-[.6rem] text-xs">
// //                       <div>
// //                         <div className="text-xs text-gray-500">Registration Status</div>
// //                         <div className="text-xs">
// //                           <span className={`px-2 py-1 rounded text-xs font-medium ${getRegistrationStatusBadge(agent.registrationStatus)}`}>
// //                             {getRegistrationStatusIcon(agent.registrationStatus)}
// //                             {agent.registrationStatus || 'Pending'}
// //                           </span>
// //                         </div>
// //                       </div>
// //                       <div>
// //                         <div className="text-xs text-gray-500">Status</div>
// //                         <div className="text-xs">
// //                           <span className={`px-2 py-1 rounded text-xs font-medium ${agent?.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
// //                             {agent?.isActive ? "Active" : "Inactive"}
// //                           </span>
// //                         </div>
// //                       </div>
// //                     </div>
// //                     <div className="grid grid-cols-2 gap-[.6rem] text-xs">
// //                       <div>
// //                         <div className="text-xs text-gray-500">Village</div>
// //                         <div className="text-xs">{personalInfo.villageGramaPanchayat || 'N/A'}</div>
// //                       </div>
// //                       <div>
// //                         <div className="text-xs text-gray-500">District</div>
// //                         <div className="text-xs">{personalInfo.district || 'N/A'}</div>
// //                       </div>
// //                     </div>
// //                     <div>
// //                       <div className="text-xs text-gray-500">State</div>
// //                       <div className="text-xs">{personalInfo.state || 'N/A'}</div>
// //                     </div>
// //                   </div>
// //                 </div>
// //               );
// //             })}
// //           </div>
// //         </>
// //       )}

// //       {/* Empty State */}
// //       {!loading && agents.length === 0 && (
// //         <div className="text-center py-12">
// //           <div className="text-gray-400 text-6xl mb-4">👤</div>
// //           <h3 className="text-xl font-semibold mb-2">No agents found</h3>
// //           <p className="text-gray-500">Try adjusting your search or filters</p>
// //           {roleFilter !== "all" && (
// //             <p className="text-gray-500 text-xs mb-4">Current Role Filter: {roleFilter}</p>
// //           )}
// //           <button
// //             onClick={handleResetFilters}
// //             disabled={loading}
// //             className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
// //           >
// //             Reset Filters
// //           </button>
// //         </div>
// //       )}

// //       {/* Pagination */}
// //       {!loading && agents.length > 0 && (
// //         <div className="flex flex-col bg-white sm:flex-row p-3 shadow justify-between items-center gap-[.6rem] text-xs">
// //           <div className="text-gray-600">
// //             Showing <span className="font-semibold">{1 + (currentPage - 1) * rowsPerPage}-{Math.min(currentPage * rowsPerPage, totalAgents)}</span> of{" "}
// //             <span className="font-semibold">{totalAgents}</span> agents
// //             <select
// //               value={rowsPerPage}
// //               onChange={(e) => setRowsPerPage(Number(e.target.value))}
// //               disabled={loading}
// //               className="p-1 ml-3 border border-zinc-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
// //             >
// //               {[5, 10, 20, 50, 100].map((option) => (
// //                 <option key={option} value={option}>
// //                   {option}
// //                 </option>
// //               ))}
// //             </select>
// //           </div>
          
// //           <div className="flex items-center gap-4">
// //             <div className="text-xs text-gray-600">
// //               Page {currentPage} of {totalPages}
// //             </div>
// //             <Pagination
// //               count={totalPages}
// //               page={currentPage}
// //               onChange={(_, value) => setCurrentPage(value)}
// //               color="primary"
// //               shape="rounded"
// //               showFirstButton
// //               showLastButton
// //               siblingCount={1}
// //               boundaryCount={1}
// //               disabled={loading}
// //               size="small"
// //             />
// //           </div>
// //         </div>
// //       )}

// //       {/* VIEW DETAILS Dialog */}
// //       {viewOpen && selectedAgent && (
// //         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3 ">
// //           <div className="bg-white  rounded-xl w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-y-auto">
// //             <div className="flex justify-between items-center mb-6 p-3 sticky top-0 bg-white pb-4 border-b">
// //               <h2 className="font-semibold text-2xl text-gray-800">Agent Details</h2>
// //               <button
// //                 onClick={() => setViewOpen(false)}
// //                 className="text-gray-500 hover:text-gray-700 text-2xl"
// //               >
// //                 ✕
// //               </button>
// //             </div>
            
// //             <div className="space-y-6 p-2">
// //               {/* Basic Information */}
// //               <section className="bg-gray-50 p-4 rounded-lg">
// //                 <h3 className="text-lg font-semibold mb-3 text-gray-700">Basic Information</h3>
// //                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
// //                   <DetailRow label="Agent ID" value={selectedAgent._id} />
// //                   {selectedAgent.farmerId && <DetailRow label="Farmer/Trader ID" value={selectedAgent.farmerId} />}
// //                   <DetailRow label="Name" value={selectedAgent.personalInfo.name || 'Not provided'} />
// //                   <DetailRow label="Mobile" value={selectedAgent.personalInfo.mobileNo || 'Not provided'} />
// //                   <DetailRow label="Email" value={selectedAgent.personalInfo.email || 'Not provided'} />
// //                   <DetailRow label="Role" value={selectedAgent.role || 'Not provided'} />
// //                   <DetailRow label="Registration Status" value={selectedAgent.registrationStatus || 'Not provided'} />
// //                   <DetailRow label="Status" value={selectedAgent.isActive ? 'Active' : 'Inactive'} />
// //                   {selectedAgent.registeredAt && <DetailRow label="Registered Date" value={new Date(selectedAgent.registeredAt).toLocaleString()} />}
// //                 </div>
// //               </section>

// //               {/* Personal Information */}
// //               <section className="bg-gray-50 p-4 rounded-lg">
// //                 <h3 className="text-lg font-semibold mb-3 text-gray-700">Personal Information</h3>
// //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
// //                   <DetailRow label="Address" value={selectedAgent.personalInfo.address || 'Not provided'} />
// //                   <DetailRow label="Village/Grama Panchayat" value={selectedAgent.personalInfo.villageGramaPanchayat || 'Not provided'} />
// //                   <DetailRow label="Pincode" value={selectedAgent.personalInfo.pincode || 'Not provided'} />
// //                   <DetailRow label="State" value={selectedAgent.personalInfo.state || 'Not provided'} />
// //                   <DetailRow label="District" value={selectedAgent.personalInfo.district || 'Not provided'} />
// //                   <DetailRow label="Taluk" value={selectedAgent.personalInfo.taluk || 'Not provided'} />
// //                   <DetailRow label="Post" value={selectedAgent.personalInfo.post || 'Not provided'} />
// //                 </div>
// //               </section>

// //               {/* Farm Information (for farmers) */}
// //               {selectedAgent.role === 'farmer' && selectedAgent.farmLocation && (
// //                 <section className="bg-gray-50 p-4 rounded-lg">
// //                   <h3 className="text-lg font-semibold mb-3 text-gray-700">Farm Information</h3>
// //                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
// //                     <DetailRow label="Latitude" value={selectedAgent.farmLocation.latitude || 'Not provided'} />
// //                     <DetailRow label="Longitude" value={selectedAgent.farmLocation.longitude || 'Not provided'} />
// //                     {selectedAgent.farmLand && (
// //                       <>
// //                         <DetailRow label="Total Land" value={selectedAgent.farmLand.total ? `${selectedAgent.farmLand.total} acres` : 'Not provided'} />
// //                         <DetailRow label="Cultivated Land" value={selectedAgent.farmLand.cultivated ? `${selectedAgent.farmLand.cultivated} acres` : 'Not provided'} />
// //                         <DetailRow label="Uncultivated Land" value={selectedAgent.farmLand.uncultivated ? `${selectedAgent.farmLand.uncultivated} acres` : 'Not provided'} />
// //                       </>
// //                     )}
// //                   </div>
// //                 </section>
// //               )}

// //               {/* Commodities */}
// //               {selectedAgent.commodities && selectedAgent.commodities.length > 0 && (
// //                 <section className="bg-gray-50 p-4 rounded-lg">
// //                   <h3 className="text-lg font-semibold mb-3 text-gray-700">Commodities</h3>
// //                   <div className="flex flex-wrap gap-2">
// //                     {selectedAgent.commodities.map((commodityId, index) => {
// //                       const commodity = availableCommodities.find(c => c.id === commodityId);
// //                       return (
// //                         <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
// //                           {commodity ? commodity.name : commodityId}
// //                         </span>
// //                       );
// //                     })}
// //                   </div>
// //                 </section>
// //               )}

// //               {/* Bank Details */}
// //               {selectedAgent.bankDetails && (
// //                 <section className="bg-gray-50 p-4 rounded-lg">
// //                   <h3 className="text-lg font-semibold mb-3 text-gray-700">Bank Details</h3>
// //                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
// //                     <DetailRow label="Account Holder" value={selectedAgent.bankDetails.accountHolderName || 'Not provided'} />
// //                     <DetailRow label="Account Number" value={selectedAgent.bankDetails.accountNumber || 'Not provided'} />
// //                     <DetailRow label="IFSC Code" value={selectedAgent.bankDetails.ifscCode || 'Not provided'} />
// //                     <DetailRow label="Branch" value={selectedAgent.bankDetails.branch || 'Not provided'} />
// //                   </div>
// //                 </section>
// //               )}

// //               {/* Documents */}
// //               {selectedAgent.documents && (
// //                 <section className="bg-gray-50 p-4 rounded-lg">
// //                   <h3 className="text-lg font-semibold mb-3 text-gray-700">Documents</h3>
// //                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
// //                     {selectedAgent.documents.panCard && (
// //                       <div>
// //                         <div className="text-xs text-gray-500">PAN Card:</div>
// //                         <a href={selectedAgent.documents.panCard} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
// //                           View PAN Card
// //                         </a>
// //                       </div>
// //                     )}
// //                     {selectedAgent.documents.aadharFront && (
// //                       <div>
// //                         <div className="text-xs text-gray-500">Aadhar Front:</div>
// //                         <a href={selectedAgent.documents.aadharFront} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
// //                           View Aadhar Front
// //                         </a>
// //                       </div>
// //                     )}
// //                     {selectedAgent.documents.aadharBack && (
// //                       <div>
// //                         <div className="text-xs text-gray-500">Aadhar Back:</div>
// //                         <a href={selectedAgent.documents.aadharBack} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
// //                           View Aadhar Back
// //                         </a>
// //                       </div>
// //                     )}
// //                     {selectedAgent.documents.bankPassbook && (
// //                       <div>
// //                         <div className="text-xs text-gray-500">Bank Passbook:</div>
// //                         <a href={selectedAgent.documents.bankPassbook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
// //                           View Bank Passbook
// //                         </a>
// //                       </div>
// //                     )}
// //                   </div>
// //                 </section>
// //               )}

// //               {/* Security Information */}
// //               {selectedAgent.security && (
// //                 <section className="bg-gray-50 p-4 rounded-lg">
// //                   <h3 className="text-lg font-semibold mb-3 text-gray-700">Security Information</h3>
// //                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
// //                     <DetailRow label="Referral Code" value={selectedAgent.security.referralCode || 'Not provided'} />
// //                     <DetailRow label="MPIN Set" value={selectedAgent.security.mpin ? 'Yes' : 'No'} />
// //                     <DetailRow label="Password Set" value={selectedAgent.security.password ? 'Yes' : 'No'} />
// //                   </div>
// //                 </section>
// //               )}
// //             </div>

// //             <div className="flex justify-end mt-6 p-3 pt-4 border-t">
// //               <button
// //                 onClick={() => setViewOpen(false)}
// //                 className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
// //               >
// //                 Close
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* DELETE CONFIRMATION Dialog */}
// //       {deleteOpen && selectedAgent && (
// //         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3 ">
// //           <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl">
// //             <div className="text-center">
// //               <div className="text-red-500 text-5xl mb-4">🗑️</div>
// //               <h2 className="text-xl font-semibold mb-2">Delete Agent?</h2>
// //               <p className="text-gray-600 mb-6">
// //                 Are you sure you want to delete <span className="font-semibold">{selectedAgent.personalInfo.name || 'this agent'}</span>? 
// //                 This action cannot be undone.
// //               </p>
// //               <div className="flex justify-center gap-3">
// //                 <button
// //                   onClick={() => setDeleteOpen(false)}
// //                   className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
// //                 >
// //                   Cancel
// //                 </button>
// //                 <button
// //                   onClick={handleDelete}
// //                   disabled={loading}
// //                   className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
// //                 >
// //                   Delete Agent
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* BULK DELETE CONFIRMATION Dialog */}
// //       {bulkDeleteOpen && (
// //         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3 ">
// //           <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl">
// //             <div className="text-center">
// //               <div className="text-red-500 text-5xl mb-4">🗑️</div>
// //               <h2 className="text-xl font-semibold mb-2">Delete {selectedAgents.length} Agents?</h2>
// //               <p className="text-gray-600 mb-6">
// //                 Are you sure you want to delete {selectedAgents.length} selected agents{selectedAgents.length !== 1 ? 's' : ''}? 
// //                 This action cannot be undone.
// //               </p>
// //               <div className="flex justify-center gap-3">
// //                 <button
// //                   onClick={() => setBulkDeleteOpen(false)}
// //                   className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
// //                 >
// //                   Cancel
// //                 </button>
// //                 <button
// //                   onClick={handleBulkDelete}
// //                   disabled={loading}
// //                   className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
// //                 >
// //                   Delete {selectedAgents.length} Agents
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // /* ================= REUSABLE COMPONENTS ================= */

// // const DetailRow = ({ label, value }: { label: string; value: string }) => (
// //   <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-200 last:border-0">
// //     <div className="w-full sm:w-1/3 font-medium text-gray-600 text-xs mb-1 sm:mb-0">{label}:</div>
// //     <div className="w-full sm:w-2/3 text-gray-900 break-words">{value}</div>
// //   </div>
// // );





















// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState, useEffect, useCallback, useRef } from "react";
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
//   FaCheck,
//   FaEdit,
//   FaPlus,
//   FaUserTie,
//   FaUser,
//   FaCheckCircle,
//   FaClock,
//   FaTimesCircle,
// } from "react-icons/fa";
// import * as XLSX from "xlsx";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { Pagination, Dialog } from "@mui/material";

// /* ================= TYPES ================= */

// interface Agent {
//   _id: string;
//   farmerId?: string;
//   personalInfo: {
//     name: string;
//     mobileNo: string;
//     email: string;
//     address?: string;
//     villageGramaPanchayat?: string;
//     pincode?: string;
//     state?: string;
//     district?: string;
//     taluk?: string;
//     post?: string;
//   };
//   role: "farmer" | "trader";
//   farmLocation?: {
//     latitude?: string;
//     longitude?: string;
//   };
//   farmLand?: {
//     total?: number | null;
//     cultivated?: number | null;
//     uncultivated?: number | null;
//   };
//   commodities?: string[];
//   nearestMarkets?: string[];
//   bankDetails?: {
//     accountHolderName?: string;
//     accountNumber?: string;
//     ifscCode?: string;
//     branch?: string;
//   };
//   documents?: {
//     panCard?: string;
//     aadharFront?: string;
//     aadharBack?: string;
//     bankPassbook?: string;
//   };
//   security?: {
//     referralCode?: string;
//     mpin?: string;
//     password?: string;
//   };
//   isActive?: boolean;
//   registeredAt?: string;
//   registrationStatus?: string;
//   subcategories?: string[];
//   __v?: number;
// }

// interface ApiResponse {
//   success: boolean;
//   data: Agent[];
//   page: number;
//   limit: number;
//   total: number;
//   totalPages?: number;
// }

// interface District {
//   _id: string;
//   name: string;
// }

// /* ================= PAGE ================= */

// export default function AgentsPage() {
//   const [agents, setAgents] = useState<Agent[]>([]);
//   const [search, setSearch] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalAgents, setTotalAgents] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const [viewOpen, setViewOpen] = useState(false);
//   const [addOpen, setAddOpen] = useState(false);
//   const [editOpen, setEditOpen] = useState(false);
//   const [deleteOpen, setDeleteOpen] = useState(false);
//   const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
//   const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
//   const [districtsLoading, setDistrictsLoading] = useState(false);
//   const [districts, setDistricts] = useState<District[]>([]);
//   const [disName, setDisName] = useState("");

//   // Role filter state
//   const [roleFilter, setRoleFilter] = useState<string>("trader");
  
//   // Registration status filter state
//   const [registrationStatusFilter, setRegistrationStatusFilter] = useState<string>("");

//   // Bulk selection state
//   const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
//   const [selectAll, setSelectAll] = useState(false);

//   // Form state
//   const [form, setForm] = useState({
//     // PERSONAL INFO
//     name: "",
//     mobileNo: "",
//     email: "",
//     address: "",
//     villageGramaPanchayat: "",
//     pincode: "",
//     state: "",
//     district: "",
//     taluk: "",
//     post: "",

//     // ROLE
//     role: "trader" as "farmer" | "trader",

//     // FARM LOCATION (for farmers)
//     latitude: "",
//     longitude: "",

//     // FARM LAND (for farmers)
//     totalLand: "",
//     cultivatedLand: "",
//     uncultivatedLand: "",

//     // COMMODITIES (array of strings)
//     commodities: [] as string[],

//     // BANK DETAILS
//     accountHolderName: "",
//     accountNumber: "",
//     ifscCode: "",
//     branch: "",

//     // DOCUMENTS (file paths)
//     panCard: "",
//     aadharFront: "",
//     aadharBack: "",
//     bankPassbook: "",

//     // SECURITY
//     referralCode: "",
//     mpin: "",
//     password: "",
//     isActive: true,
//     registrationStatus: "pending", // Added registration status
//   });

//   // Commodities list
//   const [availableCommodities] = useState([
//     { id: "693677edee676f11684d9fca", name: "Wheat" },
//     { id: "693677f4ee676f11684d9fcd", name: "Rice" },
//     { id: "693678b199b054014447fc07", name: "Corn" },
//     { id: "693914277cf4448c0924fa6e", name: "Soybean" },
//     { id: "694a69367920614e33fd2939", name: "Other" },
//   ]);

//   // Registration status options
//   const registrationStatusOptions = [
//     { value: "", label: "All Status" },
//     { value: "pending", label: "Pending" },
//     { value: "approved", label: "Approved" },
//     { value: "rejected", label: "Rejected" },
//     { value: "under_review", label: "Under Review" },
//   ];

//   // Track initial load
//   const initialLoadRef = useRef(true);
//   // Track if fetch is in progress to prevent duplicate calls
//   const isFetchingRef = useRef(false);

//   /* ================= FETCH AGENTS ================= */

//   const fetchAgents = useCallback(async (page: number = 1, searchQuery: string = "", districtName: string = "", role: string = "trader", registrationStatus: string = "") => {
//     // Prevent multiple simultaneous calls
//     if (isFetchingRef.current) return;
    
//     try {
//       isFetchingRef.current = true;
//       if (!initialLoadRef.current) {
//         setLoading(true);
//       }
//       setError(null);
      
//       const params: any = {
//         page: page.toString(),
//         limit: rowsPerPage.toString(),
//         search: searchQuery,
//       };

//       if (districtName) {
//         params.district = districtName;
//       }

//       if (role && role !== "all") {
//         params.role = role;
//       }

//       if (registrationStatus) {
//         params.registrationStatus = registrationStatus;
//       }

//       console.log("Fetching agents with params:", params); // Debug log

//       const res = await axios.get<ApiResponse>(`/api/farmers`, { params });
      
//       if (res.data.success) {
//         console.log("API Response:", res.data); // Debug log
//         const processedAgents = res.data.data.map(agent => ({
//           ...agent,
//           personalInfo: agent.personalInfo || {
//             name: "",
//             mobileNo: "",
//             email: "",
//             address: "",
//             villageGramaPanchayat: "",
//             pincode: "",
//             state: "",
//             district: "",
//             taluk: "",
//             post: ""
//           },
//           role: agent.role || "trader",
//           isActive: agent.isActive ?? true,
//           registrationStatus: agent.registrationStatus || "pending" // Added default
//         }));
        
//         setAgents(processedAgents);
//         setTotalAgents(res.data.total);
//         const calculatedTotalPages = Math.ceil(res.data.total / rowsPerPage);
//         setTotalPages(res.data.totalPages || calculatedTotalPages);
//         setCurrentPage(res.data.page);
//         setSelectedAgents([]);
//         setSelectAll(false);
//       }
//     } catch (err: any) {
//       console.error('Error fetching agents:', err);
//       setError(err.response?.data?.message || 'Failed to load agents. Please try again.');
//       setAgents([]);
//       toast.error(err.response?.data?.message || "Failed to load agents");
//     } finally {
//       isFetchingRef.current = false;
//       if (!initialLoadRef.current) {
//         setLoading(false);
//       }
//     }
//   }, [rowsPerPage]);

//   /* ================= UPDATE REGISTRATION STATUS ================= */

//   const handleUpdateRegistrationStatus = async (agentId: string, status: string) => {
//     try {
//       setLoading(true);
//       const response = await axios.put(`/api/farmers/${agentId}?status=true`, {
//         registrationStatus: status
//       });
      
//       if (response.data.success) {
//         toast.success(`Registration status updated to ${status}`);
//         // Refresh the agents list
//         fetchAgents(currentPage, search, disName, roleFilter, registrationStatusFilter);
        
//         // Show success dialog
//         const agent = agents.find(a => a._id === agentId);
//         if (agent) {
//           setSelectedAgent({
//             ...agent,
//             registrationStatus: status
//           });
//         }
//       }
//     } catch (error: any) {
//       console.error("Error updating registration status:", error);
//       toast.error(error.response?.data?.message || "Failed to update registration status");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchDistricts = useCallback(async () => {
//     setDistrictsLoading(true);
//     try {
//       const response = await axios.get("/api/districts", {
//         params: { 
//           limit: 100,
//           page: 1
//         }
//       });
//       if (response.data.success) {
//         setDistricts(response.data.data);
//       }
//     } catch (error: any) {
//       console.error("Error fetching districts:", error);
//       toast.error("Failed to load districts");
//     } finally {
//       setDistrictsLoading(false);
//     }
//   }, []);

//   // Initial data fetch
//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         setLoading(true);
//         setError(null);
        
//         // Fetch districts
//         const districtsRes = await axios.get("/api/districts", {
//           params: { limit: 100, page: 1 }
//         });
        
//         if (districtsRes.data.success) {
//           setDistricts(districtsRes.data.data);
//         }

//         // Fetch agents
//         await fetchAgents(1, "", "", roleFilter, "");

//       } catch (err: any) {
//         console.error('Error in initial data fetch:', err);
//         setError('Failed to load data. Please try again.');
//         toast.error("Failed to load data");
//       } finally {
//         setLoading(false);
//         initialLoadRef.current = false;
//       }
//     };

//     fetchInitialData();
//   }, [fetchAgents, roleFilter]);

//   // Handle subsequent fetches - only for page and rowsPerPage changes
//   useEffect(() => {
//     if (initialLoadRef.current) return;
//     fetchAgents(currentPage, search, disName, roleFilter, registrationStatusFilter);
//   }, [currentPage, rowsPerPage, fetchAgents]);

//   // Debounced search and filter changes
//   useEffect(() => {
//     if (initialLoadRef.current) return;
    
//     const timer = setTimeout(() => {
//       fetchAgents(1, search, disName, roleFilter, registrationStatusFilter);
//       setCurrentPage(1);
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [search, disName, roleFilter, registrationStatusFilter, fetchAgents]);

//   /* ================= SELECTION HANDLERS ================= */

//   const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.checked) {
//       const allAgentIds = agents.map(agent => agent._id);
//       setSelectedAgents(allAgentIds);
//       setSelectAll(true);
//     } else {
//       setSelectedAgents([]);
//       setSelectAll(false);
//     }
//   };

//   const handleSelectOne = (id: string, checked: boolean) => {
//     if (checked) {
//       setSelectedAgents([...selectedAgents, id]);
//     } else {
//       setSelectedAgents(selectedAgents.filter(agentId => agentId !== id));
//       setSelectAll(false);
//     }
//   };

//   /* ================= FORM HANDLERS ================= */

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value, type } = e.target;
//     const checked = (e.target as HTMLInputElement).checked;

//     if (type === 'checkbox' && name === 'commodities') {
//       const commodityId = value;
//       setForm(prev => ({
//         ...prev,
//         commodities: prev.commodities.includes(commodityId)
//           ? prev.commodities.filter(id => id !== commodityId)
//           : [...prev.commodities, commodityId]
//       }));
//     } else if (type === 'checkbox') {
//       setForm(prev => ({
//         ...prev,
//         [name]: checked,
//       }));
//     } else {
//       setForm(prev => ({
//         ...prev,
//         [name]: value,
//       }));
//     }
//   };

//   const handlePincodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const pincode = e.target.value;
//     setForm(prev => ({ ...prev, pincode }));

//     if (pincode.length === 6) {
//       try {
//         const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
//         const data = await res.json();

//         if (data[0].Status === "Success") {
//           const po = data[0].PostOffice[0];
//           setForm(prev => ({
//             ...prev,
//             post: po.Name,
//             taluk: po.Block || po.Taluk || '',
//             district: po.District,
//             state: po.State,
//           }));
//         }
//       } catch {
//         console.error("Invalid pincode");
//       }
//     }
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, files } = e.target;
//     if (files && files[0]) {
//       const fileName = files[0].name;
//       setForm(prev => ({
//         ...prev,
//         [name]: `/uploads/${fileName}`,
//       }));
//       toast.success(`${name} file selected: ${fileName}`);
//     }
//   };

//   const resetForm = () => {
//     setForm({
//       name: "",
//       mobileNo: "",
//       email: "",
//       address: "",
//       villageGramaPanchayat: "",
//       pincode: "",
//       state: "",
//       district: "",
//       taluk: "",
//       post: "",
//       role: "trader",
//       latitude: "",
//       longitude: "",
//       totalLand: "",
//       cultivatedLand: "",
//       uncultivatedLand: "",
//       commodities: [],
//       accountHolderName: "",
//       accountNumber: "",
//       ifscCode: "",
//       branch: "",
//       panCard: "",
//       aadharFront: "",
//       aadharBack: "",
//       bankPassbook: "",
//       referralCode: "",
//       mpin: "",
//       password: "",
//       isActive: true,
//       registrationStatus: "pending",
//     });
//   };

//   const populateFormForEdit = (agent: Agent) => {
//     const personalInfo = agent.personalInfo;
//     setForm({
//       name: personalInfo.name || "",
//       mobileNo: personalInfo.mobileNo || "",
//       email: personalInfo.email || "",
//       address: personalInfo.address || "",
//       villageGramaPanchayat: personalInfo.villageGramaPanchayat || "",
//       pincode: personalInfo.pincode || "",
//       state: personalInfo.state || "",
//       district: personalInfo.district || "",
//       taluk: personalInfo.taluk || "",
//       post: personalInfo.post || "",
//       role: agent.role || "trader",
//       latitude: agent.farmLocation?.latitude || "",
//       longitude: agent.farmLocation?.longitude || "",
//       totalLand: agent.farmLand?.total?.toString() || "",
//       cultivatedLand: agent.farmLand?.cultivated?.toString() || "",
//       uncultivatedLand: agent.farmLand?.uncultivated?.toString() || "",
//       commodities: agent.commodities || [],
//       accountHolderName: agent.bankDetails?.accountHolderName || "",
//       accountNumber: agent.bankDetails?.accountNumber || "",
//       ifscCode: agent.bankDetails?.ifscCode || "",
//       branch: agent.bankDetails?.branch || "",
//       panCard: agent.documents?.panCard || "",
//       aadharFront: agent.documents?.aadharFront || "",
//       aadharBack: agent.documents?.aadharBack || "",
//       bankPassbook: agent.documents?.bankPassbook || "",
//       referralCode: agent.security?.referralCode || "",
//       mpin: "",
//       password: "",
//       isActive: agent.isActive ?? true,
//       registrationStatus: agent.registrationStatus || "pending",
//     });
//     setSelectedAgent(agent);
//     setEditOpen(true);
//   };

//   /* ================= CRUD OPERATIONS ================= */

//   const handleAdd = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
      
//       const agentData = {
//         personalInfo: {
//           name: form.name,
//           mobileNo: form.mobileNo,
//           email: form.email,
//           address: form.address,
//           villageGramaPanchayat: form.villageGramaPanchayat,
//           pincode: form.pincode,
//           state: form.state,
//           district: form.district,
//           taluk: form.taluk,
//           post: form.post,
//         },
//         role: form.role,
//         farmLocation: form.role === "farmer" ? {
//           latitude: form.latitude,
//           longitude: form.longitude,
//         } : undefined,
//         farmLand: form.role === "farmer" ? {
//           total: form.totalLand ? Number(form.totalLand) : null,
//           cultivated: form.cultivatedLand ? Number(form.cultivatedLand) : null,
//           uncultivated: form.uncultivatedLand ? Number(form.uncultivatedLand) : null,
//         } : undefined,
//         commodities: form.commodities,
//         nearestMarkets: [],
//         bankDetails: {
//           accountHolderName: form.accountHolderName,
//           accountNumber: form.accountNumber,
//           ifscCode: form.ifscCode,
//           branch: form.branch,
//         },
//         documents: form.panCard || form.aadharFront || form.aadharBack || form.bankPassbook ? {
//           panCard: form.panCard,
//           aadharFront: form.aadharFront,
//           aadharBack: form.aadharBack,
//           bankPassbook: form.bankPassbook,
//         } : undefined,
//         security: {
//           referralCode: form.referralCode,
//           mpin: form.mpin,
//           password: form.password,
//         },
//         isActive: form.isActive,
//         registrationStatus: form.registrationStatus,
//       };

//       const res = await axios.post("/api/farmers", agentData);
      
//       if (res.data.success) {
//         toast.success("Agent added successfully!");
//         setAddOpen(false);
//         resetForm();
//         fetchAgents(currentPage, search, disName, roleFilter, registrationStatusFilter);
//       }
//     } catch (err: any) {
//       toast.error(err.response?.data?.message || "Failed to add agent");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!selectedAgent) return;
    
//     try {
//       setLoading(true);
      
//       const agentData = {
//         personalInfo: {
//           name: form.name,
//           mobileNo: form.mobileNo,
//           email: form.email,
//           address: form.address,
//           villageGramaPanchayat: form.villageGramaPanchayat,
//           pincode: form.pincode,
//           state: form.state,
//           district: form.district,
//           taluk: form.taluk,
//           post: form.post,
//         },
//         role: form.role,
//         farmLocation: form.role === "farmer" ? {
//           latitude: form.latitude,
//           longitude: form.longitude,
//         } : undefined,
//         farmLand: form.role === "farmer" ? {
//           total: form.totalLand ? Number(form.totalLand) : null,
//           cultivated: form.cultivatedLand ? Number(form.cultivatedLand) : null,
//           uncultivated: form.uncultivatedLand ? Number(form.uncultivatedLand) : null,
//         } : undefined,
//         commodities: form.commodities,
//         bankDetails: {
//           accountHolderName: form.accountHolderName,
//           accountNumber: form.accountNumber,
//           ifscCode: form.ifscCode,
//           branch: form.branch,
//         },
//         documents: form.panCard || form.aadharFront || form.aadharBack || form.bankPassbook ? {
//           panCard: form.panCard,
//           aadharFront: form.aadharFront,
//           aadharBack: form.aadharBack,
//           bankPassbook: form.bankPassbook,
//         } : undefined,
//         security: {
//           referralCode: form.referralCode,
//           ...(form.mpin && { mpin: form.mpin }),
//           ...(form.password && { password: form.password }),
//         },
//         isActive: form.isActive,
//         registrationStatus: form.registrationStatus,
//       };

//       const res = await axios.put(`/api/farmers/${selectedAgent._id}`, agentData);
      
//       if (res.data.success) {
//         toast.success("Agent updated successfully!");
//         setEditOpen(false);
//         resetForm();
//         setSelectedAgent(null);
//         fetchAgents(currentPage, search, disName, roleFilter, registrationStatusFilter);
//       }
//     } catch (err: any) {
//       toast.error(err.response?.data?.message || "Failed to update agent");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async () => {
//     if (!selectedAgent) return;
   
//     try {
//       setLoading(true);
//       setDeleteOpen(false);
//       await axios.delete(`/api/farmers/${selectedAgent._id}`);
//       toast.success("Agent deleted successfully!");
//       setDeleteOpen(false);
//       setSelectedAgent(null);
//       fetchAgents(currentPage, search, disName, roleFilter, registrationStatusFilter);
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || "Failed to delete agent. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBulkDelete = async () => {
//     if (selectedAgents.length === 0) {
//       toast.error("No agents selected");
//       return;
//     }

//     try {
//       setLoading(true);
//       setBulkDeleteOpen(false);
//       const response = await axios.post("/api/farmers/bulk-delete", {
//         ids: selectedAgents
//       });
      
//       if (response.data.success) {
//         toast.success(response.data.message || `${selectedAgents.length} agents deleted successfully!`);
//         setSelectedAgents([]);
//         setSelectAll(false);
//         setBulkDeleteOpen(false);
//         fetchAgents(currentPage, search, disName, roleFilter, registrationStatusFilter);
//       } else {
//         toast.error("Failed to delete agents");
//       }
//     } catch (error: any) {
//       console.error("Bulk delete error:", error);
//       toast.error("Error deleting agents");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= EXPORT FUNCTIONS ================= */

//   const exportData = agents.map((agent, index) => {
//     const personalInfo = agent.personalInfo;
//     return {
//       "Sr.": index + 1 + (currentPage - 1) * rowsPerPage,
//       "Name": personalInfo.name || 'N/A',
//       "Mobile": personalInfo.mobileNo || 'N/A',
//       "Email": personalInfo.email || 'N/A',
//       "Role": agent.role || 'N/A',
//       "Village": personalInfo.villageGramaPanchayat || 'N/A',
//       "District": personalInfo.district || 'N/A',
//       "State": personalInfo.state || 'N/A',
//       "Address": personalInfo.address || 'N/A',
//       "Taluk": personalInfo.taluk || 'N/A',
//       "Post": personalInfo.post || 'N/A',
//       "Pincode": personalInfo.pincode || 'N/A',
//       "Registration Status": agent.registrationStatus || 'N/A',
//       "Status": agent.isActive ? "Active" : "Inactive",
//       "Registered": agent.registeredAt ? new Date(agent.registeredAt).toLocaleDateString() : 'N/A',
//     };
//   });

//   const handlePrint = () => {
//     if (agents.length === 0) {
//       toast.error("No agents to print");
//       return;
//     }

//     const printWindow = window.open('', '_blank', 'width=900,height=700');
//     if (!printWindow) {
//       toast.error("Please allow popups to print");
//       return;
//     }

//     const printDate = new Date().toLocaleDateString();
//     const printTime = new Date().toLocaleTimeString();
    
//     const printContent = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>Agents Report</title>
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
//           <h1>👤 Agents Management Report</h1>
//           <div class="header-info">Generated on: ${printDate} at ${printTime}</div>
//           <div class="header-info">Total Agents: ${totalAgents} | Showing: ${agents.length} agents</div>
//           <div class="header-info">Page: ${currentPage} of ${totalPages}</div>
//           <div class="header-info">Role Filter: ${roleFilter === "all" ? "All Roles" : roleFilter}</div>
//         </div>
        
//         <table>
//           <thead>
//             <tr>
//               <th>Sr.</th>
//               <th>Name</th>
//               <th>Mobile</th>
//               <th>Email</th>
//               <th>Role</th>
//               <th>Village</th>
//               <th>District</th>
//               <th>State</th>
//               <th>Reg. Status</th>
//               <th>Status</th>
//               <th>Registered Date</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${agents.map((agent, index) => {
//               const personalInfo = agent.personalInfo;
//               return `
//                 <tr>
//                   <td>${index + 1 + (currentPage - 1) * rowsPerPage}</td>
//                   <td><strong>${personalInfo.name || 'N/A'}</strong></td>
//                   <td>${personalInfo.mobileNo || 'N/A'}</td>
//                   <td>${personalInfo.email || 'N/A'}</td>
//                   <td>${agent.role || 'N/A'}</td>
//                   <td>${personalInfo.villageGramaPanchayat || 'N/A'}</td>
//                   <td>${personalInfo.district || 'N/A'}</td>
//                   <td>${personalInfo.state || 'N/A'}</td>
//                   <td>${agent.registrationStatus || 'N/A'}</td>
//                   <td>${agent.isActive ? 'Active' : 'Inactive'}</td>
//                   <td>${agent.registeredAt ? new Date(agent.registeredAt).toLocaleDateString() : 'N/A'}</td>
//                 </tr>
//               `;
//             }).join('')}
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

//   const handleCopy = async () => {
//     if (agents.length === 0) {
//       toast.error("No agents to copy");
//       return;
//     }

//     const text = exportData.map(f => 
//       `${f["Sr."]}\t${f.Name}\t${f.Mobile}\t${f.Email}\t${f.Role}\t${f.Village}\t${f.District}\t${f.State}\t${f["Registration Status"]}\t${f.Status}\t${f.Registered}`
//     ).join("\n");
    
//     try {
//       await navigator.clipboard.writeText(text);
//       toast.success("Agents data copied to clipboard!");
//     } catch (err) {
//       toast.error("Failed to copy to clipboard");
//     }
//   };

//   const handleExcel = () => {
//     if (agents.length === 0) {
//       toast.error("No agents to export");
//       return;
//     }

//     try {
//       const ws = XLSX.utils.json_to_sheet(exportData);
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, "Agents");
//       XLSX.writeFile(wb, `agents-${new Date().toISOString().split('T')[0]}.xlsx`);
//       toast.success("Excel file exported successfully!");
//     } catch (err) {
//       toast.error("Failed to export Excel file");
//     }
//   };

//   const handleCSV = () => {
//     if (agents.length === 0) {
//       toast.error("No agents to export");
//       return;
//     }

//     try {
//       const ws = XLSX.utils.json_to_sheet(exportData);
//       const csv = XLSX.utils.sheet_to_csv(ws);
//       const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//       const a = document.createElement("a");
//       a.href = URL.createObjectURL(blob);
//       a.download = `agents-${new Date().toISOString().split('T')[0]}.csv`;
//       a.click();
//       toast.success("CSV file exported successfully!");
//     } catch (err) {
//       toast.error("Failed to export CSV file");
//     }
//   };

//   const handlePDF = () => {
//     if (agents.length === 0) {
//       toast.error("No agents to export");
//       return;
//     }

//     try {
//       const doc = new jsPDF();
//       doc.text("Agents Management Report", 14, 16);
      
//       const tableColumn = ["Sr.", "Name", "Mobile", "Email", "Role", "Village", "District", "State", "Reg. Status", "Status"];
//       const tableRows: any = exportData.map(f => [
//         f["Sr."],
//         f.Name,
//         f.Mobile,
//         f.Email,
//         f.Role,
//         f.Village,
//         f.District,
//         f.State,
//         f["Registration Status"],
//         f.Status,
//       ]);
      
//       autoTable(doc, {
//         head: [tableColumn],
//         body: tableRows,
//         startY: 20,
//         styles: { fontSize: 8 },
//         headStyles: { fillColor: [76, 175, 80] },
//       });
      
//       doc.save(`agents-${new Date().toISOString().split('T')[0]}.pdf`);
//       toast.success("PDF file exported successfully!");
//     } catch (err) {
//       toast.error("Failed to export PDF file");
//     }
//   };

//   /* ================= RESET FILTERS ================= */

//   const handleResetFilters = () => {
//     setSearch("");
//     setCurrentPage(1);
//     setDisName("");
//     setRegistrationStatusFilter("");
//     setSelectedAgents([]);
//     setSelectAll(false);
//     fetchAgents(1, "", "", "trader", "");
//   };

//   /* ================= GET REGISTRATION STATUS BADGE ================= */

//   const getRegistrationStatusBadge = (status: string = "pending") => {
//     switch (status.toLowerCase()) {
//       case "approved":
//         return "bg-green-100 text-green-800 border border-green-200";
//       case "rejected":
//         return "bg-red-100 text-red-800 border border-red-200";
//       case "pending":
//         return "bg-yellow-100 text-yellow-800 border border-yellow-200";
//       case "under_review":
//         return "bg-blue-100 text-blue-800 border border-blue-200";
//       default:
//         return "bg-gray-100 text-gray-800 border border-gray-200";
//     }
//   };

//   const getRegistrationStatusIcon = (status: string = "pending") => {
//     switch (status.toLowerCase()) {
//       case "approved":
//         return <FaCheckCircle className="inline mr-1" />;
//       case "rejected":
//         return <FaTimesCircle className="inline mr-1" />;
//       case "pending":
//         return <FaClock className="inline mr-1" />;
//       case "under_review":
//         return <FaEye className="inline mr-1" />;
//       default:
//         return <FaClock className="inline mr-1" />;
//     }
//   };

//   /* ================= GET ROLE BADGE ================= */

//   const getRoleBadge = (role: string) => {
//     switch (role) {
//       case "trader":
//         return "bg-purple-100 text-purple-800";
//       case "farmer":
//         return "bg-blue-100 text-blue-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const getRoleIcon = (role: string) => {
//     switch (role) {
//       case "trader":
//         return <FaUserTie className="inline mr-1" />;
//       case "farmer":
//         return <FaUser className="inline mr-1" />;
//       default:
//         return null;
//     }
//   };

//   /* ================= UI ================= */

//   return (
//     <div className="p-[.6rem] relative text-black text-xs md:p-1 overflow-x-auto min-h-screen">
//       {/* Loading Overlay */}
//       {loading && (
//         <div className="absolute inset-0 bg-[#e9e7e72f] z-[200] flex items-center justify-center ">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
//         </div>
//       )}

//       {/* Header Section */}
//       <div className="mb-4 flex gap-y-2 flex-wrap justify-between items-center">
//         <div>
//           <h1 className="text-2xl md:text-2xl font-bold text-gray-800">Agents Management</h1>
//           <p className="text-gray-600 mt-2">
//             Overview and detailed management of all registered agents. {totalAgents} agents found.
//             {roleFilter !== "all" && (
//               <span className="ml-2 font-medium">Role: {roleFilter}</span>
//             )}
//           </p>
//         </div>
//         <button 
//           onClick={() => setAddOpen(true)}
//           className="bg-green-500 p-2 px-4 text-white rounded shadow-2xl cursor-pointer flex items-center gap-2 hover:bg-green-600 transition-colors"
//         >
//           <FaPlus /> Add Agent
//         </button>
//       </div>

//       {/* Add New Agent Dialog */}
//       <Dialog open={addOpen} onClose={() => { setAddOpen(false); resetForm(); }} maxWidth="lg" fullWidth>
//         <div className="p-6 max-h-[90vh] overflow-y-auto">
//           <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Agent</h2>
//           <form onSubmit={handleAdd} className="space-y-8">
//             {/* PERSONAL INFO */}
//             <section className="bg-gray-50 p-6 rounded-lg">
//               <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Personal Information</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">Name *</label>
//                   <input name="name" value={form.name} onChange={handleChange} required className="input-field" placeholder="Enter full name" />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">Mobile Number *</label>
//                   <input name="mobileNo" value={form.mobileNo} onChange={handleChange} required className="input-field" placeholder="Enter mobile number" type="tel" />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
//                   <input name="email" value={form.email} onChange={handleChange} className="input-field" placeholder="Enter email address" type="email" />
//                 </div>
//                 <div className="md:col-span-2">
//                   <label className="block text-xs font-medium text-gray-700 mb-1">Address</label>
//                   <input name="address" value={form.address} onChange={handleChange} className="input-field" placeholder="Enter complete address" />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">Village/Grama Panchayat</label>
//                   <input name="villageGramaPanchayat" value={form.villageGramaPanchayat} onChange={handleChange} className="input-field" placeholder="Enter village name" />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">Pincode</label>
//                   <input name="pincode" value={form.pincode} onChange={handlePincodeChange} maxLength={6} className="input-field" placeholder="Enter 6-digit pincode" />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">State</label>
//                   <input name="state" value={form.state} onChange={handleChange} className="input-field" placeholder="State" readOnly />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">District</label>
//                   <input name="district" value={form.district} onChange={handleChange} className="input-field" placeholder="District" readOnly />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">Taluk</label>
//                   <input name="taluk" value={form.taluk} onChange={handleChange} className="input-field" placeholder="Taluk" readOnly />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">Post</label>
//                   <input name="post" value={form.post} onChange={handleChange} className="input-field" placeholder="Post" readOnly />
//                 </div>
//               </div>
//             </section>

//             {/* ROLE SELECTION */}
//             <section className="bg-gray-50 p-6 rounded-lg">
//               <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Agent Role</h3>
//               <div className="flex gap-6">
//                 <label className="flex items-center space-x-2 cursor-pointer">
//                   <input type="radio" name="role" value="trader" checked={form.role === "trader"} onChange={handleChange} className="h-4 w-4 text-green-600" />
//                   <span className="text-gray-700">Trader</span>
//                 </label>
//                 {/* <label className="flex items-center space-x-2 cursor-pointer">
//                   <input type="radio" name="role" value="farmer" checked={form.role === "farmer"} onChange={handleChange} className="h-4 w-4 text-green-600" />
//                   <span className="text-gray-700">Farmer</span>
//                 </label> */}
//               </div>
//             </section>

//             {/* REGISTRATION STATUS */}
//             <section className="bg-gray-50 p-6 rounded-lg">
//               <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Registration Status</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">Registration Status</label>
//                   <select name="registrationStatus" value={form.registrationStatus} onChange={handleChange} className="input-field">
//                     <option value="pending">Pending</option>
//                     <option value="approved">Approved</option>
//                     <option value="rejected">Rejected</option>
//                     <option value="under_review">Under Review</option>
//                   </select>
//                 </div>
//               </div>
//             </section>

//             {/* FARM INFORMATION (Only for farmers) */}
//             {form.role === "farmer" && (
//               <>
//                 <section className="bg-gray-50 p-6 rounded-lg">
//                   <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Farm Location</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-xs font-medium text-gray-700 mb-1">Latitude</label>
//                       <input name="latitude" value={form.latitude} onChange={handleChange} className="input-field" placeholder="Enter latitude" />
//                     </div>
//                     <div>
//                       <label className="block text-xs font-medium text-gray-700 mb-1">Longitude</label>
//                       <input name="longitude" value={form.longitude} onChange={handleChange} className="input-field" placeholder="Enter longitude" />
//                     </div>
//                   </div>
//                 </section>

//                 <section className="bg-gray-50 p-6 rounded-lg">
//                   <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Farm Land Details</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <div>
//                       <label className="block text-xs font-medium text-gray-700 mb-1">Total Land (acres)</label>
//                       <input name="totalLand" value={form.totalLand} onChange={handleChange} className="input-field" placeholder="Total land area" type="number" />
//                     </div>
//                     <div>
//                       <label className="block text-xs font-medium text-gray-700 mb-1">Cultivated Land (acres)</label>
//                       <input name="cultivatedLand" value={form.cultivatedLand} onChange={handleChange} className="input-field" placeholder="Cultivated land area" type="number" />
//                     </div>
//                     <div>
//                       <label className="block text-xs font-medium text-gray-700 mb-1">Uncultivated Land (acres)</label>
//                       <input name="uncultivatedLand" value={form.uncultivatedLand} onChange={handleChange} className="input-field" placeholder="Uncultivated land area" type="number" />
//                     </div>
//                   </div>
//                 </section>
//               </>
//             )}

//             {/* COMMODITIES */}
//             <section className="bg-gray-50 p-6 rounded-lg">
//               <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Commodities</h3>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//                 {availableCommodities.map(commodity => (
//                   <label key={commodity.id} className="flex items-center space-x-2 cursor-pointer p-2 bg-white rounded border hover:bg-gray-50">
//                     <input type="checkbox" name="commodities" value={commodity.id} checked={form.commodities.includes(commodity.id)} onChange={handleChange} className="h-4 w-4 text-green-600" />
//                     <span className="text-gray-700">{commodity.name}</span>
//                   </label>
//                 ))}
//               </div>
//             </section>

//             {/* BANK DETAILS */}
//             <section className="bg-gray-50 p-6 rounded-lg">
//               <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Bank Details</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">Account Holder Name</label>
//                   <input name="accountHolderName" value={form.accountHolderName} onChange={handleChange} className="input-field" placeholder="Account holder name" />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">Account Number</label>
//                   <input name="accountNumber" value={form.accountNumber} onChange={handleChange} className="input-field" placeholder="Bank account number" />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">IFSC Code</label>
//                   <input name="ifscCode" value={form.ifscCode} onChange={handleChange} className="input-field" placeholder="Bank IFSC code" />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">Branch</label>
//                   <input name="branch" value={form.branch} onChange={handleChange} className="input-field" placeholder="Bank branch" />
//                 </div>
//               </div>
//             </section>

//             {/* SECURITY */}
//             <section className="bg-gray-50 p-6 rounded-lg">
//               <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Security & Activation</h3>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">Referral Code</label>
//                   <input name="referralCode" value={form.referralCode} onChange={handleChange} className="input-field" placeholder="Referral code (optional)" />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">MPIN</label>
//                   <input name="mpin" value={form.mpin} onChange={handleChange} type="password" className="input-field" placeholder="Set 4-digit MPIN" />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
//                   <input name="password" value={form.password} onChange={handleChange} type="password" className="input-field" placeholder="Set password" />
//                 </div>
//                 <div className="md:col-span-3">
//                   <label className="flex items-center space-x-2 cursor-pointer">
//                     <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="h-4 w-4 text-green-600" />
//                     <span className="text-gray-700">Active Account</span>
//                   </label>
//                 </div>
//               </div>
//             </section>

//             {/* FORM ACTIONS */}
//             <div className="flex justify-end gap-4 pt-6 border-t">
//               <button type="button" onClick={() => { setAddOpen(false); resetForm(); }} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
//                 Cancel
//               </button>
//               <button type="submit" disabled={loading} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
//                 {loading ? "Adding..." : "Add Agent"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </Dialog>

//       {/* Edit Agent Dialog */}
//       <Dialog open={editOpen} onClose={() => { setEditOpen(false); resetForm(); setSelectedAgent(null); }} maxWidth="lg" fullWidth>
//         <div className="p-6 max-h-[90vh] overflow-y-auto">
//           <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Agent</h2>
//           <form onSubmit={handleEdit} className="space-y-8">
//             {/* PERSONAL INFO */}
//             <section className="bg-gray-50 p-6 rounded-lg">
//               <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Personal Information</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">Name *</label>
//                   <input name="name" value={form.name} onChange={handleChange} required className="input-field" placeholder="Enter full name" />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">Mobile Number *</label>
//                   <input name="mobileNo" value={form.mobileNo} onChange={handleChange} required className="input-field" placeholder="Enter mobile number" type="tel" />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
//                   <input name="email" value={form.email} onChange={handleChange} className="input-field" placeholder="Enter email address" type="email" />
//                 </div>
//                 <div className="md:col-span-2">
//                   <label className="block text-xs font-medium text-gray-700 mb-1">Address</label>
//                   <input name="address" value={form.address} onChange={handleChange} className="input-field" placeholder="Enter complete address" />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">Village/Grama Panchayat</label>
//                   <input name="villageGramaPanchayat" value={form.villageGramaPanchayat} onChange={handleChange} className="input-field" placeholder="Enter village name" />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">Pincode</label>
//                   <input name="pincode" value={form.pincode} onChange={handlePincodeChange} maxLength={6} className="input-field" placeholder="Enter 6-digit pincode" />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">State</label>
//                   <input name="state" value={form.state} onChange={handleChange} className="input-field" placeholder="State" />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">District</label>
//                   <input name="district" value={form.district} onChange={handleChange} className="input-field" placeholder="District" />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">Taluk</label>
//                   <input name="taluk" value={form.taluk} onChange={handleChange} className="input-field" placeholder="Taluk" />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">Post</label>
//                   <input name="post" value={form.post} onChange={handleChange} className="input-field" placeholder="Post" />
//                 </div>
//               </div>
//             </section>

//             {/* ROLE SELECTION */}
//             <section className="bg-gray-50 p-6 rounded-lg">
//               <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Agent Role</h3>
//               <div className="flex gap-6">
//                 <label className="flex items-center space-x-2 cursor-pointer">
//                   <input type="radio" name="role" value="trader" checked={form.role === "trader"} onChange={handleChange} className="h-4 w-4 text-green-600" />
//                   <span className="text-gray-700">Trader</span>
//                 </label>
//                 {/* <label className="flex items-center space-x-2 cursor-pointer">
//                   <input type="radio" name="role" value="farmer" checked={form.role === "farmer"} onChange={handleChange} className="h-4 w-4 text-green-600" />
//                   <span className="text-gray-700">Farmer</span>
//                 </label> */}
//               </div>
//             </section>

//             {/* REGISTRATION STATUS */}
//             <section className="bg-gray-50 p-6 rounded-lg">
//               <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Registration Status</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">Registration Status</label>
//                   <select name="registrationStatus" value={form.registrationStatus} onChange={handleChange} className="input-field">
//                     <option value="pending">Pending</option>
//                     <option value="approved">Approved</option>
//                     <option value="rejected">Rejected</option>
//                     <option value="under_review">Under Review</option>
//                   </select>
//                 </div>
//               </div>
//             </section>

//             {/* FARM INFORMATION (Only for farmers) */}
//             {form.role === "farmer" && (
//               <>
//                 <section className="bg-gray-50 p-6 rounded-lg">
//                   <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Farm Location</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-xs font-medium text-gray-700 mb-1">Latitude</label>
//                       <input name="latitude" value={form.latitude} onChange={handleChange} className="input-field" placeholder="Enter latitude" />
//                     </div>
//                     <div>
//                       <label className="block text-xs font-medium text-gray-700 mb-1">Longitude</label>
//                       <input name="longitude" value={form.longitude} onChange={handleChange} className="input-field" placeholder="Enter longitude" />
//                     </div>
//                   </div>
//                 </section>

//                 <section className="bg-gray-50 p-6 rounded-lg">
//                   <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Farm Land Details</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <div>
//                       <label className="block text-xs font-medium text-gray-700 mb-1">Total Land (acres)</label>
//                       <input name="totalLand" value={form.totalLand} onChange={handleChange} className="input-field" placeholder="Total land area" type="number" />
//                     </div>
//                     <div>
//                       <label className="block text-xs font-medium text-gray-700 mb-1">Cultivated Land (acres)</label>
//                       <input name="cultivatedLand" value={form.cultivatedLand} onChange={handleChange} className="input-field" placeholder="Cultivated land area" type="number" />
//                     </div>
//                     <div>
//                       <label className="block text-xs font-medium text-gray-700 mb-1">Uncultivated Land (acres)</label>
//                       <input name="uncultivatedLand" value={form.uncultivatedLand} onChange={handleChange} className="input-field" placeholder="Uncultivated land area" type="number" />
//                     </div>
//                   </div>
//                 </section>
//               </>
//             )}

//             {/* COMMODITIES */}
//             <section className="bg-gray-50 p-6 rounded-lg">
//               <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Commodities</h3>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//                 {availableCommodities.map(commodity => (
//                   <label key={commodity.id} className="flex items-center space-x-2 cursor-pointer p-2 bg-white rounded border hover:bg-gray-50">
//                     <input type="checkbox" name="commodities" value={commodity.id} checked={form.commodities.includes(commodity.id)} onChange={handleChange} className="h-4 w-4 text-green-600" />
//                     <span className="text-gray-700">{commodity.name}</span>
//                   </label>
//                 ))}
//               </div>
//             </section>

//             {/* BANK DETAILS */}
//             <section className="bg-gray-50 p-6 rounded-lg">
//               <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Bank Details</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">Account Holder Name</label>
//                   <input name="accountHolderName" value={form.accountHolderName} onChange={handleChange} className="input-field" placeholder="Account holder name" />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">Account Number</label>
//                   <input name="accountNumber" value={form.accountNumber} onChange={handleChange} className="input-field" placeholder="Bank account number" />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">IFSC Code</label>
//                   <input name="ifscCode" value={form.ifscCode} onChange={handleChange} className="input-field" placeholder="Bank IFSC code" />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">Branch</label>
//                   <input name="branch" value={form.branch} onChange={handleChange} className="input-field" placeholder="Bank branch" />
//                 </div>
//               </div>
//             </section>

//             {/* SECURITY */}
//             <section className="bg-gray-50 p-6 rounded-lg">
//               <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Security & Activation</h3>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">Referral Code</label>
//                   <input name="referralCode" value={form.referralCode} onChange={handleChange} className="input-field" placeholder="Referral code (optional)" />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">MPIN</label>
//                   <input name="mpin" value={form.mpin} onChange={handleChange} type="password" className="input-field" placeholder="Set 4-digit MPIN" />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
//                   <input name="password" value={form.password} onChange={handleChange} type="password" className="input-field" placeholder="Set password" />
//                 </div>
//                 <div className="md:col-span-3">
//                   <label className="flex items-center space-x-2 cursor-pointer">
//                     <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="h-4 w-4 text-green-600" />
//                     <span className="text-gray-700">Active Account</span>
//                   </label>
//                 </div>
//               </div>
//             </section>

//             {/* FORM ACTIONS */}
//             <div className="flex justify-end gap-4 pt-6 border-t">
//               <button type="button" onClick={() => { setEditOpen(false); resetForm(); setSelectedAgent(null); }} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
//                 Cancel
//               </button>
//               <button type="submit" disabled={loading} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
//                 {loading ? "Updating..." : "Update Agent"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </Dialog>

//       {/* Bulk Actions Bar */}
//       {selectedAgents.length > 0 && (
//         <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <FaCheck className="text-red-600" />
//               <span className="font-medium text-red-700">
//                 {selectedAgents.length} agent{selectedAgents.length !== 1 ? 's' : ''} selected
//               </span>
//             </div>
//             <button
//               onClick={() => setBulkDeleteOpen(true)}
//               className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
//             >
//               <FaTrash className="w-4 h-4" />
//               Delete Selected
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Export Buttons Section */}
//       <div className="lg:hidden flex flex-wrap gap-[.6rem] text-xs bg-white p-[.6rem] shadow">
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
//             disabled={agents.length === 0}
//             className={`flex items-center gap-[.6rem] text-xs px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md ${btn.color} font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
//           >
//             <btn.icon className="text-xs" />
//           </button>
//         ))}
//       </div>

//       {/* Filters Section */}
//       <div className="bg-white rounded lg:rounded-none shadow p-[.6rem] text-xs mb-2">
//         <div className="gap-[.6rem] text-xs items-end flex flex-wrap md:flex-row flex-col md:*:w-fit *:w-full">
//           {/* Search Input */}
//           <div className="md:col-span-3">
//             <div className="relative">
//               <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search by name, mobile, email, or village..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 disabled={loading}
//                 className="md:w-80 w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all disabled:opacity-50"
//               />
//             </div>
//           </div>

//           {/* District Filter */}
//           <div className="md:col-span-2">
//             <select
//               className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors"
//               value={disName}
//               onChange={(e) => setDisName(e.target.value)}
//               disabled={districtsLoading || loading}
//             >
//               {districtsLoading ? (
//                 <option>Loading districts...</option>
//               ) : districts.length === 0 ? (
//                 <option value="">No districts available</option>
//               ) : (
//                 <>
//                   <option value="">All Districts</option>
//                   {districts.map(district => (
//                     <option key={district._id} value={district.name}>
//                       {district.name}
//                     </option>
//                   ))}
//                 </>
//               )}
//             </select>
//           </div>

//           {/* Registration Status Filter */}
//           <div className="md:col-span-2">
//             <select
//               className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors"
//               value={registrationStatusFilter}
//               onChange={(e) => setRegistrationStatusFilter(e.target.value)}
//               disabled={loading}
//             >
//               {registrationStatusOptions.map(option => (
//                 <option key={option.value} value={option.value}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Reset Button */}
//           <div className="md:col-span-2">
//             <button
//               onClick={handleResetFilters}
//               disabled={loading}
//               className="w-full px-4 py-2.5 border border-gray-300 rounded hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <FaRedo /> Reset
//             </button>
//           </div>

//           {/* Desktop Export Buttons */}
//           <div className="lg:flex hidden ml-auto flex-wrap gap-[.6rem] text-xs">
//             {[
//               { label: "Copy", icon: FaCopy, onClick: handleCopy, color: "bg-gray-100 hover:bg-gray-200 text-gray-800", disabled: agents.length === 0 },
//               { label: "Excel", icon: FaFileExcel, onClick: handleExcel, color: "bg-green-100 hover:bg-green-200 text-green-800", disabled: agents.length === 0 },
//               { label: "CSV", icon: FaFileCsv, onClick: handleCSV, color: "bg-blue-100 hover:bg-blue-200 text-blue-800", disabled: agents.length === 0 },
//               { label: "PDF", icon: FaFilePdf, onClick: handlePDF, color: "bg-red-100 hover:bg-red-200 text-red-800", disabled: agents.length === 0 },
//               { label: "Print", icon: FaPrint, onClick: handlePrint, color: "bg-purple-100 hover:bg-purple-200 text-purple-800", disabled: agents.length === 0 },
//             ].map((btn, i) => (
//               <button
//                 key={i}
//                 onClick={btn.onClick}
//                 disabled={btn.disabled || loading}
//                 className={`flex items-center gap-[.6rem] text-xs px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md ${btn.color} font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
//               >
//                 <btn.icon className="text-xs" />
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
//       {!loading && agents.length > 0 && (
//         <>
//           <div className="hidden lg:block bg-white rounded shadow">
//             <table className="min-w-full">
//               <thead className="border-b border-zinc-200">
//                 <tr className="*:text-zinc-800">
//                   <th className="p-[.6rem] text-xs text-left font-semibold w-10">
//                     <input
//                       type="checkbox"
//                       checked={selectAll}
//                       onChange={handleSelectAll}
//                       disabled={loading}
//                       className="rounded border-gray-300"
//                     />
//                   </th>
//                   <th className="p-[.6rem] text-xs text-left font-semibold">Sr.</th>
//                   <th className="p-[.6rem] text-xs text-left font-semibold">Name</th>
//                   <th className="p-[.6rem] text-xs text-left font-semibold">Mobile</th>
//                   <th className="p-[.6rem] min-w-28 text-xs text-left font-semibold">Email</th>
//                   <th className="p-[.6rem] text-xs text-left font-semibold">Role</th>
//                   <th className="p-[.6rem] text-xs text-left font-semibold">Village</th>
//                   <th className="p-[.6rem] text-xs text-left font-semibold">District</th>
//                   <th className="p-[.6rem] text-xs text-left font-semibold">State</th>
//                   <th className="p-[.6rem] text-xs text-left font-semibold">Reg. Status</th>
//                   <th className="p-[.6rem] text-xs text-left font-semibold">Status</th>
//                   <th className="p-[.6rem] text-xs text-left font-semibold">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100">
//                 {agents.map((agent, index) => {
//                   const personalInfo = agent.personalInfo;
//                   return (
//                     <tr key={agent._id} className="hover:bg-gray-50 transition-colors">
//                       <td className="p-[.6rem] text-xs">
//                         <input
//                           type="checkbox"
//                           checked={selectedAgents.includes(agent._id)}
//                           onChange={(e) => handleSelectOne(agent._id, e.target.checked)}
//                           disabled={loading}
//                           className="rounded border-gray-300"
//                         />
//                       </td>
//                       <td className="p-[.6rem] text-xs text-center">
//                         {index + 1 + (currentPage - 1) * rowsPerPage}
//                       </td>
//                       <td className="p-[.6rem] text-xs">
//                         <div className="font-semibold">{personalInfo.name || 'N/A'}</div>
//                         {agent.farmerId && <div className="text-xs text-gray-500">ID: {agent.farmerId}</div>}
//                       </td>
//                       <td className="p-[.6rem] text-xs">{personalInfo.mobileNo || 'N/A'}</td>
//                       <td className="p-[.6rem] text-xs">
//                         <span className={`${personalInfo.email ? 'text-gray-900' : 'text-gray-400 italic'}`}>
//                           {personalInfo.email || 'No email'}
//                         </span>
//                       </td>
//                       <td className="p-[.6rem] text-xs">
//                         <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleBadge(agent.role)}`}>
//                           {getRoleIcon(agent.role)}
//                           {agent.role || 'N/A'}
//                         </span>
//                       </td>
//                       <td className="p-[.6rem] text-xs">{personalInfo.villageGramaPanchayat || 'N/A'}</td>
//                       <td className="p-[.6rem] text-xs">{personalInfo.district || 'N/A'}</td>
//                       <td className="p-[.6rem] text-xs">{personalInfo.state || 'N/A'}</td>
//                       <td className="p-[.6rem] text-xs">
//                         <span className={`px-2 py-1 rounded text-xs font-medium ${getRegistrationStatusBadge(agent.registrationStatus)}`}>
//                           {getRegistrationStatusIcon(agent.registrationStatus)}
//                           {agent.registrationStatus || 'Pending'}
//                         </span>
//                       </td>
//                       <td className="p-[.6rem] text-xs">
//                         <span className={`px-2 py-1 rounded text-xs font-medium ${agent?.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
//                           {agent?.isActive ? "Active" : "Inactive"}
//                         </span>
//                       </td>
//                       <td className="p-[.6rem] text-xs">
//                         <div className="flex gap-[.6rem] text-xs">
//                           <button
//                             onClick={() => { setSelectedAgent(agent); setViewOpen(true); }}
//                             disabled={loading}
//                             className="p-[.6rem] text-xs text-blue-600 hover:bg-blue-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                             title="View Details"
//                           >
//                             <FaEye />
//                           </button>
//                           <button
//                             onClick={() => populateFormForEdit(agent)}
//                             disabled={loading}
//                             className="p-[.6rem] text-xs text-green-600 hover:bg-green-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                             title="Edit Agent"
//                           >
//                             <FaEdit />
//                           </button>
//                           <button
//                             onClick={() => { setSelectedAgent(agent); setDeleteOpen(true); }}
//                             disabled={loading}
//                             className="p-[.6rem] text-xs text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                             title="Delete Agent"
//                           >
//                             <FaTrash />
//                           </button>
//                           {/* Approve Button */}
//                           {agent.registrationStatus !== "approved" && (
//                             <button
//                               onClick={() => handleUpdateRegistrationStatus(agent._id, "approved")}
//                               disabled={loading}
//                               className="p-[.6rem] text-xs text-green-600 hover:bg-green-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                               title="Approve Agent"
//                             >
//                               <FaCheckCircle />
//                             </button>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>

//           {/* Mobile Cards */}
//           <div className="lg:hidden space-y-2 p-[.2rem] text-xs">
//             {agents.map((agent, index) => {
//               const personalInfo = agent.personalInfo;
//               return (
//                 <div key={agent._id} className="rounded p-[.6rem] text-xs border border-zinc-200 bg-white shadow">
//                   <div className="flex justify-between items-start mb-3">
//                     <div className="flex items-center gap-2">
//                       <input
//                         type="checkbox"
//                         checked={selectedAgents.includes(agent._id)}
//                         onChange={(e) => handleSelectOne(agent._id, e.target.checked)}
//                         disabled={loading}
//                         className="rounded border-gray-300"
//                       />
//                       <div>
//                         <div className="font-bold text-gray-800">{personalInfo.name || 'N/A'}</div>
//                         <div className="text-xs text-gray-500">Sr. {index + 1 + (currentPage - 1) * rowsPerPage}</div>
//                         {agent.farmerId && <div className="text-xs text-gray-500">ID: {agent.farmerId}</div>}
//                       </div>
//                     </div>
//                     <div className="flex gap-[.6rem] text-xs">
//                       <button 
//                         onClick={() => { setSelectedAgent(agent); setViewOpen(true); }} 
//                         disabled={loading}
//                         className="p-1.5 text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
//                       >
//                         <FaEye />
//                       </button>
//                       <button 
//                         onClick={() => populateFormForEdit(agent)} 
//                         disabled={loading}
//                         className="p-1.5 text-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
//                       >
//                         <FaEdit />
//                       </button>
//                       <button 
//                         onClick={() => { setSelectedAgent(agent); setDeleteOpen(true); }} 
//                         disabled={loading}
//                         className="p-1.5 text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
//                       >
//                         <FaTrash />
//                       </button>
//                       {/* Approve Button for Mobile */}
//                       {agent.registrationStatus !== "approved" && (
//                         <button
//                           onClick={() => handleUpdateRegistrationStatus(agent._id, "approved")}
//                           disabled={loading}
//                           className="p-1.5 text-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
//                           title="Approve Agent"
//                         >
//                           <FaCheckCircle />
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                   <div className="space-y-2">
//                     <div>
//                       <div className="text-xs text-gray-500">Mobile</div>
//                       <div className="text-xs">{personalInfo.mobileNo || 'N/A'}</div>
//                     </div>
//                     <div>
//                       <div className="text-xs text-gray-500">Email</div>
//                       <div className={`text-xs ${personalInfo.email ? 'text-gray-700' : 'text-gray-400 italic'}`}>
//                         {personalInfo.email || 'No email'}
//                       </div>
//                     </div>
//                     <div>
//                       <div className="text-xs text-gray-500">Role</div>
//                       <div className="text-xs">
//                         <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleBadge(agent.role)}`}>
//                           {getRoleIcon(agent.role)}
//                           {agent.role || 'N/A'}
//                         </span>
//                       </div>
//                     </div>
//                     <div className="grid grid-cols-2 gap-[.6rem] text-xs">
//                       <div>
//                         <div className="text-xs text-gray-500">Registration Status</div>
//                         <div className="text-xs">
//                           <span className={`px-2 py-1 rounded text-xs font-medium ${getRegistrationStatusBadge(agent.registrationStatus)}`}>
//                             {getRegistrationStatusIcon(agent.registrationStatus)}
//                             {agent.registrationStatus || 'Pending'}
//                           </span>
//                         </div>
//                       </div>
//                       <div>
//                         <div className="text-xs text-gray-500">Status</div>
//                         <div className="text-xs">
//                           <span className={`px-2 py-1 rounded text-xs font-medium ${agent?.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
//                             {agent?.isActive ? "Active" : "Inactive"}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="grid grid-cols-2 gap-[.6rem] text-xs">
//                       <div>
//                         <div className="text-xs text-gray-500">Village</div>
//                         <div className="text-xs">{personalInfo.villageGramaPanchayat || 'N/A'}</div>
//                       </div>
//                       <div>
//                         <div className="text-xs text-gray-500">District</div>
//                         <div className="text-xs">{personalInfo.district || 'N/A'}</div>
//                       </div>
//                     </div>
//                     <div>
//                       <div className="text-xs text-gray-500">State</div>
//                       <div className="text-xs">{personalInfo.state || 'N/A'}</div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </>
//       )}

//       {/* Empty State */}
//       {!loading && agents.length === 0 && (
//         <div className="text-center py-12">
//           <div className="text-gray-400 text-6xl mb-4">👤</div>
//           <h3 className="text-xl font-semibold mb-2">No agents found</h3>
//           <p className="text-gray-500">Try adjusting your search or filters</p>
//           {roleFilter !== "all" && (
//             <p className="text-gray-500 text-xs mb-4">Current Role Filter: {roleFilter}</p>
//           )}
//           <button
//             onClick={handleResetFilters}
//             disabled={loading}
//             className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             Reset Filters
//           </button>
//         </div>
//       )}

//       {/* Pagination */}
//       {!loading && agents.length > 0 && (
//         <div className="flex flex-col bg-white sm:flex-row p-3 shadow justify-between items-center gap-[.6rem] text-xs">
//           <div className="text-gray-600">
//             Showing <span className="font-semibold">{1 + (currentPage - 1) * rowsPerPage}-{Math.min(currentPage * rowsPerPage, totalAgents)}</span> of{" "}
//             <span className="font-semibold">{totalAgents}</span> agents
//             <select
//               value={rowsPerPage}
//               onChange={(e) => setRowsPerPage(Number(e.target.value))}
//               disabled={loading}
//               className="p-1 ml-3 border border-zinc-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {[5, 10, 20, 50, 100].map((option) => (
//                 <option key={option} value={option}>
//                   {option}
//                 </option>
//               ))}
//             </select>
//           </div>
          
//           <div className="flex items-center gap-4">
//             <div className="text-xs text-gray-600">
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
//               disabled={loading}
//               size="small"
//             />
//           </div>
//         </div>
//       )}

//       {/* VIEW DETAILS Dialog */}
//       {viewOpen && selectedAgent && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3 ">
//           <div className="bg-white  rounded-xl w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-y-auto">
//             <div className="flex justify-between items-center mb-6 p-3 sticky top-0 bg-white pb-4 border-b">
//               <h2 className="font-semibold text-2xl text-gray-800">Agent Details</h2>
//               <button
//                 onClick={() => setViewOpen(false)}
//                 className="text-gray-500 hover:text-gray-700 text-2xl"
//               >
//                 ✕
//               </button>
//             </div>
            
//             <div className="space-y-6 p-2">
//               {/* Basic Information */}
//               <section className="bg-gray-50 p-4 rounded-lg">
//                 <h3 className="text-lg font-semibold mb-3 text-gray-700">Basic Information</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
//                   <DetailRow label="Agent ID" value={selectedAgent._id} />
//                   {selectedAgent.farmerId && <DetailRow label="Farmer/Trader ID" value={selectedAgent.farmerId} />}
//                   <DetailRow label="Name" value={selectedAgent.personalInfo.name || 'Not provided'} />
//                   <DetailRow label="Mobile" value={selectedAgent.personalInfo.mobileNo || 'Not provided'} />
//                   <DetailRow label="Email" value={selectedAgent.personalInfo.email || 'Not provided'} />
//                   <DetailRow label="Role" value={selectedAgent.role || 'Not provided'} />
//                   <DetailRow label="Registration Status" value={selectedAgent.registrationStatus || 'Not provided'} />
//                   <DetailRow label="Status" value={selectedAgent.isActive ? 'Active' : 'Inactive'} />
//                   {selectedAgent.registeredAt && <DetailRow label="Registered Date" value={new Date(selectedAgent.registeredAt).toLocaleString()} />}
//                 </div>
//               </section>

//               {/* Personal Information */}
//               <section className="bg-gray-50 p-4 rounded-lg">
//                 <h3 className="text-lg font-semibold mb-3 text-gray-700">Personal Information</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                   <DetailRow label="Address" value={selectedAgent.personalInfo.address || 'Not provided'} />
//                   <DetailRow label="Village/Grama Panchayat" value={selectedAgent.personalInfo.villageGramaPanchayat || 'Not provided'} />
//                   <DetailRow label="Pincode" value={selectedAgent.personalInfo.pincode || 'Not provided'} />
//                   <DetailRow label="State" value={selectedAgent.personalInfo.state || 'Not provided'} />
//                   <DetailRow label="District" value={selectedAgent.personalInfo.district || 'Not provided'} />
//                   <DetailRow label="Taluk" value={selectedAgent.personalInfo.taluk || 'Not provided'} />
//                   <DetailRow label="Post" value={selectedAgent.personalInfo.post || 'Not provided'} />
//                 </div>
//               </section>

//               {/* Farm Information (for farmers) */}
//               {selectedAgent.role === 'farmer' && selectedAgent.farmLocation && (
//                 <section className="bg-gray-50 p-4 rounded-lg">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-700">Farm Information</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                     <DetailRow label="Latitude" value={selectedAgent.farmLocation.latitude || 'Not provided'} />
//                     <DetailRow label="Longitude" value={selectedAgent.farmLocation.longitude || 'Not provided'} />
//                     {selectedAgent.farmLand && (
//                       <>
//                         <DetailRow label="Total Land" value={selectedAgent.farmLand.total ? `${selectedAgent.farmLand.total} acres` : 'Not provided'} />
//                         <DetailRow label="Cultivated Land" value={selectedAgent.farmLand.cultivated ? `${selectedAgent.farmLand.cultivated} acres` : 'Not provided'} />
//                         <DetailRow label="Uncultivated Land" value={selectedAgent.farmLand.uncultivated ? `${selectedAgent.farmLand.uncultivated} acres` : 'Not provided'} />
//                       </>
//                     )}
//                   </div>
//                 </section>
//               )}

//               {/* Commodities */}
//               {selectedAgent.commodities && selectedAgent.commodities.length > 0 && (
//                 <section className="bg-gray-50 p-4 rounded-lg">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-700">Commodities</h3>
//                   <div className="flex flex-wrap gap-2">
//                     {selectedAgent.commodities.map((commodityId, index) => {
//                       const commodity = availableCommodities.find(c => c.id === commodityId);
//                       return (
//                         <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
//                           {commodity ? commodity.name : commodityId}
//                         </span>
//                       );
//                     })}
//                   </div>
//                 </section>
//               )}

//               {/* Bank Details */}
//               {selectedAgent.bankDetails && (
//                 <section className="bg-gray-50 p-4 rounded-lg">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-700">Bank Details</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                     <DetailRow label="Account Holder" value={selectedAgent.bankDetails.accountHolderName || 'Not provided'} />
//                     <DetailRow label="Account Number" value={selectedAgent.bankDetails.accountNumber || 'Not provided'} />
//                     <DetailRow label="IFSC Code" value={selectedAgent.bankDetails.ifscCode || 'Not provided'} />
//                     <DetailRow label="Branch" value={selectedAgent.bankDetails.branch || 'Not provided'} />
//                   </div>
//                 </section>
//               )}

//               {/* Documents */}
//               {selectedAgent.documents && (
//                 <section className="bg-gray-50 p-4 rounded-lg">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-700">Documents</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                     {selectedAgent.documents.panCard && (
//                       <div>
//                         <div className="text-xs text-gray-500">PAN Card:</div>
//                         <a href={selectedAgent.documents.panCard} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
//                           View PAN Card
//                         </a>
//                       </div>
//                     )}
//                     {selectedAgent.documents.aadharFront && (
//                       <div>
//                         <div className="text-xs text-gray-500">Aadhar Front:</div>
//                         <a href={selectedAgent.documents.aadharFront} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
//                           View Aadhar Front
//                         </a>
//                       </div>
//                     )}
//                     {selectedAgent.documents.aadharBack && (
//                       <div>
//                         <div className="text-xs text-gray-500">Aadhar Back:</div>
//                         <a href={selectedAgent.documents.aadharBack} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
//                           View Aadhar Back
//                         </a>
//                       </div>
//                     )}
//                     {selectedAgent.documents.bankPassbook && (
//                       <div>
//                         <div className="text-xs text-gray-500">Bank Passbook:</div>
//                         <a href={selectedAgent.documents.bankPassbook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
//                           View Bank Passbook
//                         </a>
//                       </div>
//                     )}
//                   </div>
//                 </section>
//               )}

//               {/* Security Information */}
//               {selectedAgent.security && (
//                 <section className="bg-gray-50 p-4 rounded-lg">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-700">Security Information</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                     <DetailRow label="Referral Code" value={selectedAgent.security.referralCode || 'Not provided'} />
//                     <DetailRow label="MPIN Set" value={selectedAgent.security.mpin ? 'Yes' : 'No'} />
//                     <DetailRow label="Password Set" value={selectedAgent.security.password ? 'Yes' : 'No'} />
//                   </div>
//                 </section>
//               )}
//             </div>

//             <div className="flex justify-end mt-6 p-3 pt-4 border-t">
//               <button
//                 onClick={() => setViewOpen(false)}
//                 className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* DELETE CONFIRMATION Dialog */}
//       {deleteOpen && selectedAgent && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3 ">
//           <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl">
//             <div className="text-center">
//               <div className="text-red-500 text-5xl mb-4">🗑️</div>
//               <h2 className="text-xl font-semibold mb-2">Delete Agent?</h2>
//               <p className="text-gray-600 mb-6">
//                 Are you sure you want to delete <span className="font-semibold">{selectedAgent.personalInfo.name || 'this agent'}</span>? 
//                 This action cannot be undone.
//               </p>
//               <div className="flex justify-center gap-3">
//                 <button
//                   onClick={() => setDeleteOpen(false)}
//                   className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleDelete}
//                   disabled={loading}
//                   className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Delete Agent
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* BULK DELETE CONFIRMATION Dialog */}
//       {bulkDeleteOpen && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3 ">
//           <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl">
//             <div className="text-center">
//               <div className="text-red-500 text-5xl mb-4">🗑️</div>
//               <h2 className="text-xl font-semibold mb-2">Delete {selectedAgents.length} Agents?</h2>
//               <p className="text-gray-600 mb-6">
//                 Are you sure you want to delete {selectedAgents.length} selected agents{selectedAgents.length !== 1 ? 's' : ''}? 
//                 This action cannot be undone.
//               </p>
//               <div className="flex justify-center gap-3">
//                 <button
//                   onClick={() => setBulkDeleteOpen(false)}
//                   className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleBulkDelete}
//                   disabled={loading}
//                   className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Delete {selectedAgents.length} Agents
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// /* ================= REUSABLE COMPONENTS ================= */

// const DetailRow = ({ label, value }: { label: string; value: string }) => (
//   <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-200 last:border-0">
//     <div className="w-full sm:w-1/3 font-medium text-gray-600 text-xs mb-1 sm:mb-0">{label}:</div>
//     <div className="w-full sm:w-2/3 text-gray-900 break-words">{value}</div>
//   </div>
// );
     






























/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
  FaCheck,
  FaEdit,
  FaPlus,
  FaUserTie,
  FaUser,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
} from "react-icons/fa";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";
import toast from "react-hot-toast";
import { Pagination, Dialog } from "@mui/material";

/* ================= TYPES ================= */

interface Agent {
  _id: string;
  farmerId?: string;
  personalInfo: {
    name: string;
    mobileNo: string;
    email: string;
    address?: string;
    villageGramaPanchayat?: string;
    pincode?: string;
    state?: string;
    district?: string;
    taluk?: string;
    post?: string;
  };
  role: "farmer" | "trader";
  farmLocation?: {
    latitude?: string;
    longitude?: string;
  };
  farmLand?: {
    total?: number | null;
    cultivated?: number | null;
    uncultivated?: number | null;
  };
  commodities?: string[];
  nearestMarkets?: string[];
  bankDetails?: {
    accountHolderName?: string;
    accountNumber?: string;
    ifscCode?: string;
    branch?: string;
  };
  documents?: {
    panCard?: string;
    aadharFront?: string;
    aadharBack?: string;
    bankPassbook?: string;
  };
  security?: {
    referralCode?: string;
    mpin?: string;
    password?: string;
  };
  isActive?: boolean;
  registeredAt?: string;
  registrationStatus?: string;
  subcategories?: string[];
  __v?: number;
}

interface ApiResponse {
  success: boolean;
  data: Agent[];
  page: number;
  limit: number;
  total: number;
  totalPages?: number;
}

interface District {
  _id: string;
  name: string;
}

/* ================= PAGE ================= */

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAgents, setTotalAgents] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [viewOpen, setViewOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [districtsLoading, setDistrictsLoading] = useState(false);
  const [districts, setDistricts] = useState<District[]>([]);
  const [disName, setDisName] = useState("");

  // Role filter state
  const [roleFilter, setRoleFilter] = useState<string>("trader");
  
  // Registration status filter state
  const [registrationStatusFilter, setRegistrationStatusFilter] = useState<string>("");

  // Bulk selection state
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Form state
  const [form, setForm] = useState({
    // PERSONAL INFO
    name: "",
    mobileNo: "",
    email: "",
    address: "",
    villageGramaPanchayat: "",
    pincode: "",
    state: "",
    district: "",
    taluk: "",
    post: "",

    // ROLE
    role: "trader" as "farmer" | "trader",

    // FARM LOCATION (for farmers)
    latitude: "",
    longitude: "",

    // FARM LAND (for farmers)
    totalLand: "",
    cultivatedLand: "",
    uncultivatedLand: "",

    // COMMODITIES (array of strings)
    commodities: [] as string[],

    // BANK DETAILS
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    branch: "",

    // DOCUMENTS (file paths)
    panCard: "",
    aadharFront: "",
    aadharBack: "",
    bankPassbook: "",

    // SECURITY
    referralCode: "",
    mpin: "",
    password: "",
    isActive: true,
    registrationStatus: "pending", // Added registration status
  });

  // Commodities list
  const [availableCommodities] = useState([
    { id: "693677edee676f11684d9fca", name: "Wheat" },
    { id: "693677f4ee676f11684d9fcd", name: "Rice" },
    { id: "693678b199b054014447fc07", name: "Corn" },
    { id: "693914277cf4448c0924fa6e", name: "Soybean" },
    { id: "694a69367920614e33fd2939", name: "Other" },
  ]);

  // Registration status options
  const registrationStatusOptions = [
    { value: "", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "under_review", label: "Under Review" },
  ];

  // Track initial load
  const initialLoadRef = useRef(true);
  // Track if fetch is in progress to prevent duplicate calls
  const isFetchingRef = useRef(false);

  /* ================= FETCH AGENTS ================= */

  const fetchAgents = useCallback(async (page: number = 1, searchQuery: string = "", districtName: string = "", role: string = "trader", registrationStatus: string = "") => {
    // Prevent multiple simultaneous calls
    if (isFetchingRef.current) return;
    
    try {
      isFetchingRef.current = true;
      if (!initialLoadRef.current) {
        setLoading(true);
      }
      setError(null);
      
      const params: any = {
        page: page.toString(),
        limit: rowsPerPage.toString(),
        search: searchQuery,
      };

      if (districtName) {
        params.district = districtName;
      }

      if (role && role !== "all") {
        params.role = role;
      }

      if (registrationStatus) {
        params.registrationStatus = registrationStatus;
      }

      console.log("Fetching agents with params:", params); // Debug log

      const res = await axios.get<ApiResponse>(`/api/farmers`, { params });
      
      if (res.data.success) {
        console.log("API Response:", res.data); // Debug log
        const processedAgents = res.data.data.map(agent => ({
          ...agent,
          personalInfo: agent.personalInfo || {
            name: "",
            mobileNo: "",
            email: "",
            address: "",
            villageGramaPanchayat: "",
            pincode: "",
            state: "",
            district: "",
            taluk: "",
            post: ""
          },
          role: agent.role || "trader",
          isActive: agent.isActive ?? true,
          registrationStatus: agent.registrationStatus || "pending" // Added default
        }));
        
        setAgents(processedAgents);
        setTotalAgents(res.data.total);
        const calculatedTotalPages = Math.ceil(res.data.total / rowsPerPage);
        setTotalPages(res.data.totalPages || calculatedTotalPages);
        setCurrentPage(res.data.page);
        setSelectedAgents([]);
        setSelectAll(false);
      }
    } catch (err: any) {
      console.error('Error fetching agents:', err);
      setError(err.response?.data?.message || 'Failed to load agents. Please try again.');
      setAgents([]);
      toast.error(err.response?.data?.message || "Failed to load agents");
    } finally {
      isFetchingRef.current = false;
      if (!initialLoadRef.current) {
        setLoading(false);
      }
    }
  }, [rowsPerPage]);

  /* ================= UPDATE REGISTRATION STATUS ================= */

  const handleUpdateRegistrationStatus = async (agentId: string, status: string) => {
    try {
      setLoading(true);
      const response = await axios.put(`/api/farmers/${agentId}?status=true`, {
        registrationStatus: status
      });
      
      if (response.data.success) {
        toast.success(`Registration status updated to ${status}`);
        // Refresh the agents list
        fetchAgents(currentPage, search, disName, roleFilter, registrationStatusFilter);
        
        // Show success dialog
        const agent = agents.find(a => a._id === agentId);
        if (agent) {
          setSelectedAgent({
            ...agent,
            registrationStatus: status
          });
        }
      }
    } catch (error: any) {
      console.error("Error updating registration status:", error);
      toast.error(error.response?.data?.message || "Failed to update registration status");
    } finally {
      setLoading(false);
    }
  };

  const fetchDistricts = useCallback(async () => {
    setDistrictsLoading(true);
    try {
      const response = await axios.get("/api/districts", {
        params: { 
          limit: 100,
          page: 1
        }
      });
      if (response.data.success) {
        setDistricts(response.data.data);
      }
    } catch (error: any) {
      console.error("Error fetching districts:", error);
      toast.error("Failed to load districts");
    } finally {
      setDistrictsLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch districts
        const districtsRes = await axios.get("/api/districts", {
          params: { limit: 100, page: 1 }
        });
        
        if (districtsRes.data.success) {
          setDistricts(districtsRes.data.data);
        }

        // Fetch agents
        await fetchAgents(1, "", "", roleFilter, "");

      } catch (err: any) {
        console.error('Error in initial data fetch:', err);
        setError('Failed to load data. Please try again.');
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
        initialLoadRef.current = false;
      }
    };

    fetchInitialData();
  }, [fetchAgents, roleFilter]);

  // Handle subsequent fetches - only for page and rowsPerPage changes
  useEffect(() => {
    if (initialLoadRef.current) return;
    fetchAgents(currentPage, search, disName, roleFilter, registrationStatusFilter);
  }, [currentPage, rowsPerPage, fetchAgents]);

  // Debounced search and filter changes
  useEffect(() => {
    if (initialLoadRef.current) return;
    
    const timer = setTimeout(() => {
      fetchAgents(1, search, disName, roleFilter, registrationStatusFilter);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search, disName, roleFilter, registrationStatusFilter, fetchAgents]);

  /* ================= SELECTION HANDLERS ================= */

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allAgentIds = agents.map(agent => agent._id);
      setSelectedAgents(allAgentIds);
      setSelectAll(true);
    } else {
      setSelectedAgents([]);
      setSelectAll(false);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedAgents([...selectedAgents, id]);
    } else {
      setSelectedAgents(selectedAgents.filter(agentId => agentId !== id));
      setSelectAll(false);
    }
  };

  /* ================= FORM HANDLERS ================= */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (type === 'checkbox' && name === 'commodities') {
      const commodityId = value;
      setForm(prev => ({
        ...prev,
        commodities: prev.commodities.includes(commodityId)
          ? prev.commodities.filter(id => id !== commodityId)
          : [...prev.commodities, commodityId]
      }));
    } else if (type === 'checkbox') {
      setForm(prev => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handlePincodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const pincode = e.target.value;
    setForm(prev => ({ ...prev, pincode }));

    if (pincode.length === 6) {
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = await res.json();

        if (data[0].Status === "Success") {
          const po = data[0].PostOffice[0];
          setForm(prev => ({
            ...prev,
            post: po.Name,
            taluk: po.Block || po.Taluk || '',
            district: po.District,
            state: po.State,
          }));
        }
      } catch {
        console.error("Invalid pincode");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const fileName = files[0].name;
      setForm(prev => ({
        ...prev,
        [name]: `/uploads/${fileName}`,
      }));
      toast.success(`${name} file selected: ${fileName}`);
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      mobileNo: "",
      email: "",
      address: "",
      villageGramaPanchayat: "",
      pincode: "",
      state: "",
      district: "",
      taluk: "",
      post: "",
      role: "trader",
      latitude: "",
      longitude: "",
      totalLand: "",
      cultivatedLand: "",
      uncultivatedLand: "",
      commodities: [],
      accountHolderName: "",
      accountNumber: "",
      ifscCode: "",
      branch: "",
      panCard: "",
      aadharFront: "",
      aadharBack: "",
      bankPassbook: "",
      referralCode: "",
      mpin: "",
      password: "",
      isActive: true,
      registrationStatus: "pending",
    });
  };

  const populateFormForEdit = (agent: Agent) => {
    const personalInfo = agent.personalInfo;
    setForm({
      name: personalInfo.name || "",
      mobileNo: personalInfo.mobileNo || "",
      email: personalInfo.email || "",
      address: personalInfo.address || "",
      villageGramaPanchayat: personalInfo.villageGramaPanchayat || "",
      pincode: personalInfo.pincode || "",
      state: personalInfo.state || "",
      district: personalInfo.district || "",
      taluk: personalInfo.taluk || "",
      post: personalInfo.post || "",
      role: agent.role || "trader",
      latitude: agent.farmLocation?.latitude || "",
      longitude: agent.farmLocation?.longitude || "",
      totalLand: agent.farmLand?.total?.toString() || "",
      cultivatedLand: agent.farmLand?.cultivated?.toString() || "",
      uncultivatedLand: agent.farmLand?.uncultivated?.toString() || "",
      commodities: agent.commodities || [],
      accountHolderName: agent.bankDetails?.accountHolderName || "",
      accountNumber: agent.bankDetails?.accountNumber || "",
      ifscCode: agent.bankDetails?.ifscCode || "",
      branch: agent.bankDetails?.branch || "",
      panCard: agent.documents?.panCard || "",
      aadharFront: agent.documents?.aadharFront || "",
      aadharBack: agent.documents?.aadharBack || "",
      bankPassbook: agent.documents?.bankPassbook || "",
      referralCode: agent.security?.referralCode || "",
      mpin: "",
      password: "",
      isActive: agent.isActive ?? true,
      registrationStatus: agent.registrationStatus || "pending",
    });
    setSelectedAgent(agent);
    setEditOpen(true);
  };

  /* ================= CRUD OPERATIONS ================= */

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const agentData = {
        personalInfo: {
          name: form.name,
          mobileNo: form.mobileNo,
          email: form.email,
          address: form.address,
          villageGramaPanchayat: form.villageGramaPanchayat,
          pincode: form.pincode,
          state: form.state,
          district: form.district,
          taluk: form.taluk,
          post: form.post,
        },
        role: form.role,
        farmLocation: form.role === "farmer" ? {
          latitude: form.latitude,
          longitude: form.longitude,
        } : undefined,
        farmLand: form.role === "farmer" ? {
          total: form.totalLand ? Number(form.totalLand) : null,
          cultivated: form.cultivatedLand ? Number(form.cultivatedLand) : null,
          uncultivated: form.uncultivatedLand ? Number(form.uncultivatedLand) : null,
        } : undefined,
        commodities: form.commodities,
        nearestMarkets: [],
        bankDetails: {
          accountHolderName: form.accountHolderName,
          accountNumber: form.accountNumber,
          ifscCode: form.ifscCode,
          branch: form.branch,
        },
        documents: form.panCard || form.aadharFront || form.aadharBack || form.bankPassbook ? {
          panCard: form.panCard,
          aadharFront: form.aadharFront,
          aadharBack: form.aadharBack,
          bankPassbook: form.bankPassbook,
        } : undefined,
        security: {
          referralCode: form.referralCode,
          mpin: form.mpin,
          password: form.password,
        },
        isActive: form.isActive,
        registrationStatus: form.registrationStatus,
      };

      const res = await axios.post("/api/farmers", agentData);
      
      if (res.data.success) {
        toast.success("Agent added successfully!");
        setAddOpen(false);
        resetForm();
        fetchAgents(currentPage, search, disName, roleFilter, registrationStatusFilter);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add agent");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgent) return;
    
    try {
      setLoading(true);
      
      const agentData = {
        personalInfo: {
          name: form.name,
          mobileNo: form.mobileNo,
          email: form.email,
          address: form.address,
          villageGramaPanchayat: form.villageGramaPanchayat,
          pincode: form.pincode,
          state: form.state,
          district: form.district,
          taluk: form.taluk,
          post: form.post,
        },
        role: form.role,
        farmLocation: form.role === "farmer" ? {
          latitude: form.latitude,
          longitude: form.longitude,
        } : undefined,
        farmLand: form.role === "farmer" ? {
          total: form.totalLand ? Number(form.totalLand) : null,
          cultivated: form.cultivatedLand ? Number(form.cultivatedLand) : null,
          uncultivated: form.uncultivatedLand ? Number(form.uncultivatedLand) : null,
        } : undefined,
        commodities: form.commodities,
        bankDetails: {
          accountHolderName: form.accountHolderName,
          accountNumber: form.accountNumber,
          ifscCode: form.ifscCode,
          branch: form.branch,
        },
        documents: form.panCard || form.aadharFront || form.aadharBack || form.bankPassbook ? {
          panCard: form.panCard,
          aadharFront: form.aadharFront,
          aadharBack: form.aadharBack,
          bankPassbook: form.bankPassbook,
        } : undefined,
        security: {
          referralCode: form.referralCode,
          ...(form.mpin && { mpin: form.mpin }),
          ...(form.password && { password: form.password }),
        },
        isActive: form.isActive,
        registrationStatus: form.registrationStatus,
      };

      const res = await axios.put(`/api/farmers/${selectedAgent._id}`, agentData);
      
      if (res.data.success) {
        toast.success("Agent updated successfully!");
        setEditOpen(false);
        resetForm();
        setSelectedAgent(null);
        fetchAgents(currentPage, search, disName, roleFilter, registrationStatusFilter);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update agent");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedAgent) return;
   
    try {
      setLoading(true);
      setDeleteOpen(false);
      await axios.delete(`/api/farmers/${selectedAgent._id}`);
      toast.success("Agent deleted successfully!");
      setDeleteOpen(false);
      setSelectedAgent(null);
      fetchAgents(currentPage, search, disName, roleFilter, registrationStatusFilter);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete agent. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedAgents.length === 0) {
      toast.error("No agents selected");
      return;
    }

    try {
      setLoading(true);
      setBulkDeleteOpen(false);
      const response = await axios.post("/api/farmers/bulk-delete", {
        ids: selectedAgents
      });
      
      if (response.data.success) {
        toast.success(response.data.message || `${selectedAgents.length} agents deleted successfully!`);
        setSelectedAgents([]);
        setSelectAll(false);
        setBulkDeleteOpen(false);
        fetchAgents(currentPage, search, disName, roleFilter, registrationStatusFilter);
      } else {
        toast.error("Failed to delete agents");
      }
    } catch (error: any) {
      console.error("Bulk delete error:", error);
      toast.error("Error deleting agents");
    } finally {
      setLoading(false);
    }
  };

  /* ================= EXPORT FUNCTIONS ================= */

  const exportData = agents.map((agent, index) => {
    const personalInfo = agent.personalInfo;
    return {
      "Sr.": index + 1 + (currentPage - 1) * rowsPerPage,
      "Name": personalInfo.name || 'N/A',
      "Mobile": personalInfo.mobileNo || 'N/A',
      "Email": personalInfo.email || 'N/A',
      "Role": agent.role || 'N/A',
      "Village": personalInfo.villageGramaPanchayat || 'N/A',
      "District": personalInfo.district || 'N/A',
      "State": personalInfo.state || 'N/A',
      "Address": personalInfo.address || 'N/A',
      "Taluk": personalInfo.taluk || 'N/A',
      "Post": personalInfo.post || 'N/A',
      "Pincode": personalInfo.pincode || 'N/A',
      "Registration Status": agent.registrationStatus || 'N/A',
      "Status": agent.isActive ? "Active" : "Inactive",
      "Registered": agent.registeredAt ? new Date(agent.registeredAt).toLocaleDateString() : 'N/A',
    };
  });

  const handlePrint = () => {
    if (agents.length === 0) {
      toast.error("No agents to print");
      return;
    }

    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) {
      toast.error("Please allow popups to print");
      return;
    }

    const printDate = new Date().toLocaleDateString();
    const printTime = new Date().toLocaleTimeString();
    
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Agents Report</title>
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
          <h1>👤 Agents Management Report</h1>
          <div class="header-info">Generated on: ${printDate} at ${printTime}</div>
          <div class="header-info">Total Agents: ${totalAgents} | Showing: ${agents.length} agents</div>
          <div class="header-info">Page: ${currentPage} of ${totalPages}</div>
          <div class="header-info">Role Filter: ${roleFilter === "all" ? "All Roles" : roleFilter}</div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Sr.</th>
              <th>Name</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>Role</th>
              <th>Village</th>
              <th>District</th>
              <th>State</th>
              <th>Reg. Status</th>
              <th>Status</th>
              <th>Registered Date</th>
            </tr>
          </thead>
          <tbody>
            ${agents.map((agent, index) => {
              const personalInfo = agent.personalInfo;
              return `
                <tr>
                  <td>${index + 1 + (currentPage - 1) * rowsPerPage}</td>
                  <td><strong>${personalInfo.name || 'N/A'}</strong></td>
                  <td>${personalInfo.mobileNo || 'N/A'}</td>
                  <td>${personalInfo.email || 'N/A'}</td>
                  <td>${agent.role || 'N/A'}</td>
                  <td>${personalInfo.villageGramaPanchayat || 'N/A'}</td>
                  <td>${personalInfo.district || 'N/A'}</td>
                  <td>${personalInfo.state || 'N/A'}</td>
                  <td>${agent.registrationStatus || 'N/A'}</td>
                  <td>${agent.isActive ? 'Active' : 'Inactive'}</td>
                  <td>${agent.registeredAt ? new Date(agent.registeredAt).toLocaleDateString() : 'N/A'}</td>
                </tr>
              `;
            }).join('')}
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

  // const handleCopy = async () => {
  //   if (agents.length === 0) {
  //     toast.error("No agents to copy");
  //     return;
  //   }

  //   const text = exportData.map(f => 
  //     `${f["Sr."]}\t${f.Name}\t${f.Mobile}\t${f.Email}\t${f.Role}\t${f.Village}\t${f.District}\t${f.State}\t${f["Registration Status"]}\t${f.Status}\t${f.Registered}`
  //   ).join("\n");
    
  //   try {
  //     await navigator.clipboard.writeText(text);
  //     toast.success("Agents data copied to clipboard!");
  //   } catch (err) {
  //     toast.error("Failed to copy to clipboard");
  //   }
  // };

  const handleCopy = async (): Promise<void> => {
  if (agents.length === 0) {
    toast.error("No agents to copy");
    return;
  }

  const headers = ["#", "Name", "Mobile", "Email", "Role", "Village", "District", "State", "Reg Status", "Status", "Registered"];
  
  // Column widths
  const colWidths = [4, 20, 15, 25, 12, 15, 15, 12, 12, 12, 12];
  
  // Format header
  const headerRow = headers.map((h, i) => h.padEnd(colWidths[i])).join(" │ ");
  
  // Format data rows
  const dataRows = exportData.map(f => [
    (f["Sr."] || "").toString().padEnd(colWidths[0]),
    (f.Name || "N/A").padEnd(colWidths[1]),
    (f.Mobile || "N/A").padEnd(colWidths[2]),
    (f.Email || "N/A").padEnd(colWidths[3]),
    (f.Role || "N/A").padEnd(colWidths[4]),
    (f.Village || "N/A").padEnd(colWidths[5]),
    (f.District || "N/A").padEnd(colWidths[6]),
    (f.State || "N/A").padEnd(colWidths[7]),
    (f["Registration Status"] || "N/A").padEnd(colWidths[8]),
    (f.Status || "N/A").padEnd(colWidths[9]),
    (f.Registered || "N/A").padEnd(colWidths[10])
  ].join(" │ "));

  const separator = "─".repeat(headerRow.length);
  
  const text = [
    "AGENTS DIRECTORY",
    separator,
    headerRow,
    separator,
    ...dataRows,
    separator,
    "",
    `📊 SUMMARY:`,
    `• Total Agents: ${agents.length}`,
    `• Active: ${exportData.filter(a => a.Status === "Active").length}`,
    `• By Role: ${Object.entries(
      exportData.reduce((acc: Record<string, number>, agent) => {
        acc[agent.Role] = (acc[agent.Role] || 0) + 1;
        return acc;
      }, {})
    ).map(([role, count]) => `${role}: ${count}`).join(', ')}`,
    `• Generated: ${new Date().toLocaleString()}`
  ].join("\n");
  
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Agents table copied to clipboard!");
  } catch (err) {
    toast.error("Failed to copy to clipboard");
  }
};
  const handleExcel = () => {
    if (agents.length === 0) {
      toast.error("No agents to export");
      return;
    }

    try {
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Agents");
      XLSX.writeFile(wb, `agents-${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success("Excel file exported successfully!");
    } catch (err) {
      toast.error("Failed to export Excel file");
    }
  };

  const handleCSV = () => {
    if (agents.length === 0) {
      toast.error("No agents to export");
      return;
    }

    try {
      const ws = XLSX.utils.json_to_sheet(exportData);
      const csv = XLSX.utils.sheet_to_csv(ws);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `agents-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      toast.success("CSV file exported successfully!");
    } catch (err) {
      toast.error("Failed to export CSV file");
    }
  };

  const handlePDF = () => {
    if (agents.length === 0) {
      toast.error("No agents to export");
      return;
    }

    try {
      const doc = new jsPDF();
      doc.text("Agents Management Report", 14, 16);
      
      const tableColumn = ["Sr.", "Name", "Mobile", "Email", "Role", "Village", "District", "State", "Reg. Status", "Status"];
      const tableRows: any = exportData.map(f => [
        f["Sr."],
        f.Name,
        f.Mobile,
        f.Email,
        f.Role,
        f.Village,
        f.District,
        f.State,
        f["Registration Status"],
        f.Status,
      ]);
      
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 20,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [76, 175, 80] },
      });
      
      doc.save(`agents-${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success("PDF file exported successfully!");
    } catch (err) {
      toast.error("Failed to export PDF file");
    }
  };

  /* ================= RESET FILTERS ================= */

  const handleResetFilters = () => {
    setSearch("");
    setCurrentPage(1);
    setDisName("");
    setRegistrationStatusFilter("");
    setSelectedAgents([]);
    setSelectAll(false);
    fetchAgents(1, "", "", "trader", "");
  };

  /* ================= GET REGISTRATION STATUS BADGE ================= */

  const getRegistrationStatusBadge = (status: string = "pending") => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800 border border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "under_review":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getRegistrationStatusIcon = (status: string = "pending") => {
    switch (status.toLowerCase()) {
      case "approved":
        return <FaCheckCircle className="inline mr-1" />;
      case "rejected":
        return <FaTimesCircle className="inline mr-1" />;
      case "pending":
        return <FaClock className="inline mr-1" />;
      case "under_review":
        return <FaEye className="inline mr-1" />;
      default:
        return <FaClock className="inline mr-1" />;
    }
  };

  /* ================= GET ROLE BADGE ================= */

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "trader":
        return "bg-purple-100 text-purple-800";
      case "farmer":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "trader":
        return <FaUserTie className="inline mr-1" />;
      case "farmer":
        return <FaUser className="inline mr-1" />;
      default:
        return null;
    }
  };

  /* ================= UI ================= */

  return (
    <div className="p-[.6rem] relative text-black text-xs md:p-1 overflow-x-auto min-h-screen">
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-[#e9e7e72f] z-[200] flex items-center justify-center ">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Header Section */}
      <div className="mb-4 flex gap-y-2 flex-wrap justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-2xl font-bold text-gray-800">Agents Management</h1>
          <p className="text-gray-600 mt-2">
            Overview and detailed management of all registered agents. {totalAgents} agents found.
            {roleFilter !== "all" && (
              <span className="ml-2 font-medium">Role: {roleFilter}</span>
            )}
          </p>
        </div>
        <button 
          onClick={() => setAddOpen(true)}
          className="bg-green-500 p-2 px-4 text-white rounded shadow-2xl cursor-pointer flex items-center gap-2 hover:bg-green-600 transition-colors"
        >
          <FaPlus /> Add Agent
        </button>
      </div>

      {/* Add New Agent Dialog */}
      <Dialog open={addOpen} onClose={() => { setAddOpen(false); resetForm(); }} maxWidth="lg" fullWidth>
        <div className="p-6 max-h-[90vh] overflow-y-auto">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Agent</h2>
          <form onSubmit={handleAdd} className="space-y-8">
            {/* PERSONAL INFO */}
            <section className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} required className="input-field" placeholder="Enter full name" />
                </div>
               <div>
  <label className="block text-xs font-medium text-gray-700 mb-1">
    Mobile Number *
  </label>

  <input
    type="tel"
    name="mobileNo"
    value={form.mobileNo}
    onChange={(e) => {
      const value = e.target.value.replace(/\D/g, ""); // remove non-digits
      if (value.length <= 10) {
        setForm({ ...form, mobileNo: value });
      }
    }}
    required
    inputMode="numeric"
    className="input-field"
    placeholder="Enter mobile number"
  />
</div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
                  <input name="email" value={form.email} onChange={handleChange} className="input-field" placeholder="Enter email address" type="email" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Address</label>
                  <input name="address" value={form.address} onChange={handleChange} className="input-field" placeholder="Enter complete address" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Village/Grama Panchayat</label>
                  <input name="villageGramaPanchayat" value={form.villageGramaPanchayat} onChange={handleChange} className="input-field" placeholder="Enter village name" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Pincode</label>
                  <input name="pincode" value={form.pincode} onChange={handlePincodeChange} maxLength={6} className="input-field" placeholder="Enter 6-digit pincode" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">State</label>
                  <input name="state" value={form.state} onChange={handleChange} className="input-field" placeholder="State" readOnly />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">District</label>
                  <input name="district" value={form.district} onChange={handleChange} className="input-field" placeholder="District" readOnly />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Taluk</label>
                  <input name="taluk" value={form.taluk} onChange={handleChange} className="input-field" placeholder="Taluk" readOnly />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Post</label>
                  <input name="post" value={form.post} onChange={handleChange} className="input-field" placeholder="Post" readOnly />
                </div>
              </div>
            </section>

            {/* ROLE SELECTION */}
            <section className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Agent Role</h3>
              <div className="flex gap-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="radio" name="role" value="trader" checked={form.role === "trader"} onChange={handleChange} className="h-4 w-4 text-green-600" />
                  <span className="text-gray-700">Trader</span>
                </label>
                {/* <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="radio" name="role" value="farmer" checked={form.role === "farmer"} onChange={handleChange} className="h-4 w-4 text-green-600" />
                  <span className="text-gray-700">Farmer</span>
                </label> */}
              </div>
            </section>

            {/* REGISTRATION STATUS */}
            <section className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Registration Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Registration Status</label>
                  <select name="registrationStatus" value={form.registrationStatus} onChange={handleChange} className="input-field">
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="under_review">Under Review</option>
                  </select>
                </div>
              </div>
            </section>

            {/* FARM INFORMATION (Only for farmers) */}
            {form.role === "farmer" && (
              <>
                <section className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Farm Location</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Latitude</label>
                      <input name="latitude" value={form.latitude} onChange={handleChange} className="input-field" placeholder="Enter latitude" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Longitude</label>
                      <input name="longitude" value={form.longitude} onChange={handleChange} className="input-field" placeholder="Enter longitude" />
                    </div>
                  </div>
                </section>

                <section className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Farm Land Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Total Land (acres)</label>
                      <input name="totalLand" value={form.totalLand} onChange={handleChange} className="input-field" placeholder="Total land area" type="number" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Cultivated Land (acres)</label>
                      <input name="cultivatedLand" value={form.cultivatedLand} onChange={handleChange} className="input-field" placeholder="Cultivated land area" type="number" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Uncultivated Land (acres)</label>
                      <input name="uncultivatedLand" value={form.uncultivatedLand} onChange={handleChange} className="input-field" placeholder="Uncultivated land area" type="number" />
                    </div>
                  </div>
                </section>
              </>
            )}

            {/* COMMODITIES */}
            <section className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Commodities</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {availableCommodities.map(commodity => (
                  <label key={commodity.id} className="flex items-center space-x-2 cursor-pointer p-2 bg-white rounded border hover:bg-gray-50">
                    <input type="checkbox" name="commodities" value={commodity.id} checked={form.commodities.includes(commodity.id)} onChange={handleChange} className="h-4 w-4 text-green-600" />
                    <span className="text-gray-700">{commodity.name}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* BANK DETAILS */}
            <section className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Bank Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Account Holder Name</label>
                  <input name="accountHolderName" value={form.accountHolderName} onChange={handleChange} className="input-field" placeholder="Account holder name" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Account Number</label>
                  <input type="number" name="accountNumber" value={form.accountNumber} onChange={handleChange} className="input-field" placeholder="Bank account number" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">IFSC Code</label>
                  <input name="ifscCode" value={form.ifscCode} onChange={handleChange} className="input-field" placeholder="Bank IFSC code" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Branch</label>
                  <input name="branch" value={form.branch} onChange={handleChange} className="input-field" placeholder="Bank branch" />
                </div>
              </div>
            </section>

            {/* SECURITY */}
            <section className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Security & Activation</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Referral Code</label>
                  <input name="referralCode" value={form.referralCode} onChange={handleChange} className="input-field" placeholder="Referral code (optional)" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">MPIN</label>
                  <input name="mpin" value={form.mpin} onChange={handleChange} type="password" className="input-field" placeholder="Set 4-digit MPIN" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
                  <input name="password" value={form.password} onChange={handleChange} type="password" className="input-field" placeholder="Set password" />
                </div>
                <div className="md:col-span-3">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="h-4 w-4 text-green-600" />
                    <span className="text-gray-700">Active Account</span>
                  </label>
                </div>
              </div>
            </section>

            {/* FORM ACTIONS */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <button type="button" onClick={() => { setAddOpen(false); resetForm(); }} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                {loading ? "Adding..." : "Add Agent"}
              </button>
            </div>
          </form>
        </div>
      </Dialog>

      {/* Edit Agent Dialog */}
      <Dialog open={editOpen} onClose={() => { setEditOpen(false); resetForm(); setSelectedAgent(null); }} maxWidth="lg" fullWidth>
        <div className="p-6 max-h-[90vh] overflow-y-auto">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Agent</h2>
          <form onSubmit={handleEdit} className="space-y-8">
            {/* PERSONAL INFO */}
            <section className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} required className="input-field" placeholder="Enter full name" />
                </div>
                <div>
  <label className="block text-xs font-medium text-gray-700 mb-1">
    Mobile Number *
  </label>

  <input
    type="tel"
    name="mobileNo"
    value={form.mobileNo}
    onChange={(e) => {
      const value = e.target.value.replace(/\D/g, ""); // remove non-digits
      if (value.length <= 10) {
        setForm({ ...form, mobileNo: value });
      }
    }}
    required
    inputMode="numeric"
    className="input-field"
    placeholder="Enter mobile number"
  />
</div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
                  <input name="email" value={form.email} onChange={handleChange} className="input-field" placeholder="Enter email address" type="email" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Address</label>
                  <input name="address" value={form.address} onChange={handleChange} className="input-field" placeholder="Enter complete address" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Village/Grama Panchayat</label>
                  <input name="villageGramaPanchayat" value={form.villageGramaPanchayat} onChange={handleChange} className="input-field" placeholder="Enter village name" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Pincode</label>
                  <input name="pincode" value={form.pincode} onChange={handlePincodeChange} maxLength={6} className="input-field" placeholder="Enter 6-digit pincode" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">State</label>
                  <input name="state" value={form.state} onChange={handleChange} className="input-field" placeholder="State" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">District</label>
                  <input name="district" value={form.district} onChange={handleChange} className="input-field" placeholder="District" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Taluk</label>
                  <input name="taluk" value={form.taluk} onChange={handleChange} className="input-field" placeholder="Taluk" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Post</label>
                  <input name="post" value={form.post} onChange={handleChange} className="input-field" placeholder="Post" />
                </div>
              </div>
            </section>

            {/* ROLE SELECTION */}
            <section className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Agent Role</h3>
              <div className="flex gap-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="radio" name="role" value="trader" checked={form.role === "trader"} onChange={handleChange} className="h-4 w-4 text-green-600" />
                  <span className="text-gray-700">Trader</span>
                </label>
                {/* <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="radio" name="role" value="farmer" checked={form.role === "farmer"} onChange={handleChange} className="h-4 w-4 text-green-600" />
                  <span className="text-gray-700">Farmer</span>
                </label> */}
              </div>
            </section>

            {/* REGISTRATION STATUS */}
            <section className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Registration Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Registration Status</label>
                  <select name="registrationStatus" value={form.registrationStatus} onChange={handleChange} className="input-field">
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="under_review">Under Review</option>
                  </select>
                </div>
              </div>
            </section>

            {/* FARM INFORMATION (Only for farmers) */}
            {form.role === "farmer" && (
              <>
                <section className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Farm Location</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Latitude</label>
                      <input name="latitude" value={form.latitude} onChange={handleChange} className="input-field" placeholder="Enter latitude" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Longitude</label>
                      <input name="longitude" value={form.longitude} onChange={handleChange} className="input-field" placeholder="Enter longitude" />
                    </div>
                  </div>
                </section>

                <section className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Farm Land Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Total Land (acres)</label>
                      <input name="totalLand" value={form.totalLand} onChange={handleChange} className="input-field" placeholder="Total land area" type="number" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Cultivated Land (acres)</label>
                      <input name="cultivatedLand" value={form.cultivatedLand} onChange={handleChange} className="input-field" placeholder="Cultivated land area" type="number" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Uncultivated Land (acres)</label>
                      <input name="uncultivatedLand" value={form.uncultivatedLand} onChange={handleChange} className="input-field" placeholder="Uncultivated land area" type="number" />
                    </div>
                  </div>
                </section>
              </>
            )}

            {/* COMMODITIES */}
            <section className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Commodities</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {availableCommodities.map(commodity => (
                  <label key={commodity.id} className="flex items-center space-x-2 cursor-pointer p-2 bg-white rounded border hover:bg-gray-50">
                    <input type="checkbox" name="commodities" value={commodity.id} checked={form.commodities.includes(commodity.id)} onChange={handleChange} className="h-4 w-4 text-green-600" />
                    <span className="text-gray-700">{commodity.name}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* BANK DETAILS */}
            <section className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Bank Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Account Holder Name</label>
                  <input name="accountHolderName" value={form.accountHolderName} onChange={handleChange} className="input-field" placeholder="Account holder name" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Account Number</label>
                  <input type="number" name="accountNumber" value={form.accountNumber} onChange={handleChange} className="input-field" placeholder="Bank account number" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">IFSC Code</label>
                  <input name="ifscCode" value={form.ifscCode} onChange={handleChange} className="input-field" placeholder="Bank IFSC code" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Branch</label>
                  <input name="branch" value={form.branch} onChange={handleChange} className="input-field" placeholder="Bank branch" />
                </div>
              </div>
            </section>

            {/* SECURITY */}
            <section className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Security & Activation</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Referral Code</label>
                  <input name="referralCode" value={form.referralCode} onChange={handleChange} className="input-field" placeholder="Referral code (optional)" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">MPIN</label>
                  <input name="mpin" value={form.mpin} onChange={handleChange} type="password" className="input-field" placeholder="Set 4-digit MPIN" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
                  <input name="password" value={form.password} onChange={handleChange} type="password" className="input-field" placeholder="Set password" />
                </div>
                <div className="md:col-span-3">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="h-4 w-4 text-green-600" />
                    <span className="text-gray-700">Active Account</span>
                  </label>
                </div>
              </div>
            </section>

            {/* FORM ACTIONS */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <button type="button" onClick={() => { setEditOpen(false); resetForm(); setSelectedAgent(null); }} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                {loading ? "Updating..." : "Update Agent"}
              </button>
            </div>
          </form>
        </div>
      </Dialog>

      {/* Bulk Actions Bar */}
      {selectedAgents.length > 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaCheck className="text-red-600" />
              <span className="font-medium text-red-700">
                {selectedAgents.length} agent{selectedAgents.length !== 1 ? 's' : ''} selected
              </span>
            </div>
            <button
              onClick={() => setBulkDeleteOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
            >
              <FaTrash className="w-4 h-4" />
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Export Buttons Section */}
      <div className="lg:hidden flex flex-wrap gap-[.6rem] text-xs bg-white p-[.6rem] shadow">
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
            disabled={agents.length === 0}
            className={`flex items-center gap-[.6rem] text-xs px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md ${btn.color} font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <btn.icon className="text-xs" />
          </button>
        ))}
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded lg:rounded-none shadow p-[.6rem] text-xs mb-2">
        <div className="gap-[.6rem] text-xs items-end flex flex-wrap md:flex-row flex-col md:*:w-fit *:w-full">
          {/* Search Input */}
          <div className="md:col-span-3">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, mobile, email, or village..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                disabled={loading}
                className="md:w-80 w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all disabled:opacity-50"
              />
            </div>
          </div>

          {/* District Filter */}
          {/* <div className="md:col-span-2">
            <select
              className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors"
              value={disName}
              onChange={(e) => setDisName(e.target.value)}
              disabled={districtsLoading || loading}
            >
              {districtsLoading ? (
                <option>Loading districts...</option>
              ) : districts.length === 0 ? (
                <option value="">No districts available</option>
              ) : (
                <>
                  <option value="">All Districts</option>
                  {districts.map(district => (
                    <option key={district._id} value={district.name}>
                      {district.name}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div> */}

          {/* Registration Status Filter */}
          <div className="md:col-span-2">
            <select
              className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors"
              value={registrationStatusFilter}
              onChange={(e) => setRegistrationStatusFilter(e.target.value)}
              disabled={loading}
            >
              {registrationStatusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Button */}
          <div className="md:col-span-2">
            <button
              onClick={handleResetFilters}
              disabled={loading}
              className="w-full px-4 py-2.5 border border-gray-300 rounded hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaRedo /> Reset
            </button>
          </div>

          {/* Desktop Export Buttons */}
          <div className="lg:flex hidden ml-auto flex-wrap gap-[.6rem] text-xs">
            {[
              { label: "Copy", icon: FaCopy, onClick: handleCopy, color: "bg-gray-100 hover:bg-gray-200 text-gray-800", disabled: agents.length === 0 },
              { label: "Excel", icon: FaFileExcel, onClick: handleExcel, color: "bg-green-100 hover:bg-green-200 text-green-800", disabled: agents.length === 0 },
              { label: "CSV", icon: FaFileCsv, onClick: handleCSV, color: "bg-blue-100 hover:bg-blue-200 text-blue-800", disabled: agents.length === 0 },
              { label: "PDF", icon: FaFilePdf, onClick: handlePDF, color: "bg-red-100 hover:bg-red-200 text-red-800", disabled: agents.length === 0 },
              { label: "Print", icon: FaPrint, onClick: handlePrint, color: "bg-purple-100 hover:bg-purple-200 text-purple-800", disabled: agents.length === 0 },
            ].map((btn, i) => (
              <button
                key={i}
                onClick={btn.onClick}
                disabled={btn.disabled || loading}
                className={`flex items-center gap-[.6rem] text-xs px-4 py-2 rounded transition-all duration-200 shadow-sm hover:shadow-md ${btn.color} font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <btn.icon className="text-xs" />
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
      {!loading && agents.length > 0 && (
        <>
          <div className="hidden lg:block bg-white rounded shadow">
            <table className="min-w-full">
              <thead className="border-b border-zinc-200">
                <tr className="*:text-zinc-800">
                  <th className="p-[.6rem] text-xs text-left font-semibold w-10">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      disabled={loading}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="p-[.6rem] text-xs text-left font-semibold">Sr.</th>
                  <th className="p-[.6rem] text-xs text-left font-semibold">Name</th>
                  <th className="p-[.6rem] text-xs text-left font-semibold">Mobile</th>
                  <th className="p-[.6rem] min-w-28 text-xs text-left font-semibold">Email</th>
                  <th className="p-[.6rem] text-xs text-left font-semibold">Role</th>
                  <th className="p-[.6rem] text-xs text-left font-semibold">Village</th>
                  <th className="p-[.6rem] text-xs text-left font-semibold">District</th>
                  <th className="p-[.6rem] text-xs text-left font-semibold">State</th>
                  <th className="p-[.6rem] text-xs text-left font-semibold">Reg. Status</th>
                  <th className="p-[.6rem] text-xs text-left font-semibold">Status</th>
                  <th className="p-[.6rem] text-xs text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {agents.map((agent, index) => {
                  const personalInfo = agent.personalInfo;
                  return (
                    <tr key={agent._id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-[.6rem] text-xs">
                        <input
                          type="checkbox"
                          checked={selectedAgents.includes(agent._id)}
                          onChange={(e) => handleSelectOne(agent._id, e.target.checked)}
                          disabled={loading}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="p-[.6rem] text-xs text-center">
                        {index + 1 + (currentPage - 1) * rowsPerPage}
                      </td>
                      <td className="p-[.6rem] text-xs">
                        <div className="font-semibold">{personalInfo.name || 'N/A'}</div>
                        {agent.farmerId && <div className="text-xs text-gray-500">ID: {agent.farmerId}</div>}
                      </td>
                      <td className="p-[.6rem] text-xs">{personalInfo.mobileNo || 'N/A'}</td>
                      <td className="p-[.6rem] text-xs">
                        <span className={`${personalInfo.email ? 'text-gray-900' : 'text-gray-400 italic'}`}>
                          {personalInfo.email || 'No email'}
                        </span>
                      </td>
                      <td className="p-[.6rem] text-xs">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleBadge(agent.role)}`}>
                          {getRoleIcon(agent.role)}
                          {agent.role || 'N/A'}
                        </span>
                      </td>
                      <td className="p-[.6rem] text-xs">{personalInfo.villageGramaPanchayat || 'N/A'}</td>
                      <td className="p-[.6rem] text-xs">{personalInfo.district || 'N/A'}</td>
                      <td className="p-[.6rem] text-xs">{personalInfo.state || 'N/A'}</td>
                      <td className="p-[.6rem] text-xs">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getRegistrationStatusBadge(agent.registrationStatus)}`}>
                          {getRegistrationStatusIcon(agent.registrationStatus)}
                          {agent.registrationStatus || 'Pending'}
                        </span>
                      </td>
                      <td className="p-[.6rem] text-xs">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${agent?.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                          {agent?.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="p-[.6rem] text-xs">
                        <div className="flex gap-[.6rem] text-xs">
                          <button
                            onClick={() => { setSelectedAgent(agent); setViewOpen(true); }}
                            disabled={loading}
                            className="p-[.6rem] text-xs text-blue-600 hover:bg-blue-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => populateFormForEdit(agent)}
                            disabled={loading}
                            className="p-[.6rem] text-xs text-green-600 hover:bg-green-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Edit Agent"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => { setSelectedAgent(agent); setDeleteOpen(true); }}
                            disabled={loading}
                            className="p-[.6rem] text-xs text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete Agent"
                          >
                            <FaTrash />
                          </button>
                          {/* Approve Button */}
                          {agent.registrationStatus !== "approved" && (
                            <button
                              onClick={() => handleUpdateRegistrationStatus(agent._id, "approved")}
                              disabled={loading}
                              className="p-[.6rem] text-xs text-green-600 hover:bg-green-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Approve Agent"
                            >
                              <FaCheckCircle />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-2 p-[.2rem] text-xs">
            {agents.map((agent, index) => {
              const personalInfo = agent.personalInfo;
              return (
                <div key={agent._id} className="rounded p-[.6rem] text-xs border border-zinc-200 bg-white shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedAgents.includes(agent._id)}
                        onChange={(e) => handleSelectOne(agent._id, e.target.checked)}
                        disabled={loading}
                        className="rounded border-gray-300"
                      />
                      <div>
                        <div className="font-bold text-gray-800">{personalInfo.name || 'N/A'}</div>
                        <div className="text-xs text-gray-500">Sr. {index + 1 + (currentPage - 1) * rowsPerPage}</div>
                        {agent.farmerId && <div className="text-xs text-gray-500">ID: {agent.farmerId}</div>}
                      </div>
                    </div>
                    <div className="flex gap-[.6rem] text-xs">
                      <button 
                        onClick={() => { setSelectedAgent(agent); setViewOpen(true); }} 
                        disabled={loading}
                        className="p-1.5 text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FaEye />
                      </button>
                      <button 
                        onClick={() => populateFormForEdit(agent)} 
                        disabled={loading}
                        className="p-1.5 text-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        onClick={() => { setSelectedAgent(agent); setDeleteOpen(true); }} 
                        disabled={loading}
                        className="p-1.5 text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FaTrash />
                      </button>
                      {/* Approve Button for Mobile */}
                      {agent.registrationStatus !== "approved" && (
                        <button
                          onClick={() => handleUpdateRegistrationStatus(agent._id, "approved")}
                          disabled={loading}
                          className="p-1.5 text-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Approve Agent"
                        >
                          <FaCheckCircle />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="text-xs text-gray-500">Mobile</div>
                      <div className="text-xs">{personalInfo.mobileNo || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Email</div>
                      <div className={`text-xs ${personalInfo.email ? 'text-gray-700' : 'text-gray-400 italic'}`}>
                        {personalInfo.email || 'No email'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-2">Role</div>
                      <div className="text-xs">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleBadge(agent.role)}`}>
                          {getRoleIcon(agent.role)}
                          {agent.role || 'N/A'}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-[.6rem] text-xs">
                      <div>
                        <div className="text-xs text-gray-500 mb-2">Registration Status</div>
                        <div className="text-xs">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getRegistrationStatusBadge(agent.registrationStatus)}`}>
                            {getRegistrationStatusIcon(agent.registrationStatus)}
                            {agent.registrationStatus || 'Pending'}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-2">Status</div>
                        <div className="text-xs">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${agent?.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                            {agent?.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-[.6rem] text-xs">
                      <div>
                        <div className="text-xs text-gray-500">Village</div>
                        <div className="text-xs">{personalInfo.villageGramaPanchayat || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">District</div>
                        <div className="text-xs">{personalInfo.district || 'N/A'}</div>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">State</div>
                      <div className="text-xs">{personalInfo.state || 'N/A'}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Empty State */}
      {!loading && agents.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">👤</div>
          <h3 className="text-xl font-semibold mb-2">No agents found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
          {roleFilter !== "all" && (
            <p className="text-gray-500 text-xs mb-4">Current Role Filter: {roleFilter}</p>
          )}
          <button
            onClick={handleResetFilters}
            disabled={loading}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Pagination */}
      {!loading && agents.length > 0 && (
        <div className="flex flex-col bg-white sm:flex-row p-3 shadow justify-between items-center gap-[.6rem] text-xs">
          <div className="text-gray-600">
            Showing <span className="font-semibold">{1 + (currentPage - 1) * rowsPerPage}-{Math.min(currentPage * rowsPerPage, totalAgents)}</span> of{" "}
            <span className="font-semibold">{totalAgents}</span> agents
            <select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
              disabled={loading}
              className="p-1 ml-3 border border-zinc-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {[5, 10, 20, 50, 100].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-xs text-gray-600">
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
              disabled={loading}
              size="small"
            />
          </div>
        </div>
      )}

      {/* VIEW DETAILS Dialog */}
      {viewOpen && selectedAgent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3 ">
          <div className="bg-white  rounded-xl w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 p-3 sticky top-0 bg-white pb-4 border-b">
              <h2 className="font-semibold text-2xl text-gray-800">Agent Details</h2>
              <button
                onClick={() => setViewOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6 p-2">
              {/* Basic Information */}
              <section className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-gray-700">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <DetailRow label="Agent ID" value={selectedAgent._id} />
                  {selectedAgent.farmerId && <DetailRow label="Farmer/Trader ID" value={selectedAgent.farmerId} />}
                  <DetailRow label="Name" value={selectedAgent.personalInfo.name || 'Not provided'} />
                  <DetailRow label="Mobile" value={selectedAgent.personalInfo.mobileNo || 'Not provided'} />
                  <DetailRow label="Email" value={selectedAgent.personalInfo.email || 'Not provided'} />
                  <DetailRow label="Role" value={selectedAgent.role || 'Not provided'} />
                  <DetailRow label="Registration Status" value={selectedAgent.registrationStatus || 'Not provided'} />
                  <DetailRow label="Status" value={selectedAgent.isActive ? 'Active' : 'Inactive'} />
                  {selectedAgent.registeredAt && <DetailRow label="Registered Date" value={new Date(selectedAgent.registeredAt).toLocaleString()} />}
                </div>
              </section>

              {/* Personal Information */}
              <section className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-gray-700">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <DetailRow label="Address" value={selectedAgent.personalInfo.address || 'Not provided'} />
                  <DetailRow label="Village/Grama Panchayat" value={selectedAgent.personalInfo.villageGramaPanchayat || 'Not provided'} />
                  <DetailRow label="Pincode" value={selectedAgent.personalInfo.pincode || 'Not provided'} />
                  <DetailRow label="State" value={selectedAgent.personalInfo.state || 'Not provided'} />
                  <DetailRow label="District" value={selectedAgent.personalInfo.district || 'Not provided'} />
                  <DetailRow label="Taluk" value={selectedAgent.personalInfo.taluk || 'Not provided'} />
                  <DetailRow label="Post" value={selectedAgent.personalInfo.post || 'Not provided'} />
                </div>
              </section>

              {/* Farm Information (for farmers) */}
              {selectedAgent.role === 'farmer' && selectedAgent.farmLocation && (
                <section className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-gray-700">Farm Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <DetailRow label="Latitude" value={selectedAgent.farmLocation.latitude || 'Not provided'} />
                    <DetailRow label="Longitude" value={selectedAgent.farmLocation.longitude || 'Not provided'} />
                    {selectedAgent.farmLand && (
                      <>
                        <DetailRow label="Total Land" value={selectedAgent.farmLand.total ? `${selectedAgent.farmLand.total} acres` : 'Not provided'} />
                        <DetailRow label="Cultivated Land" value={selectedAgent.farmLand.cultivated ? `${selectedAgent.farmLand.cultivated} acres` : 'Not provided'} />
                        <DetailRow label="Uncultivated Land" value={selectedAgent.farmLand.uncultivated ? `${selectedAgent.farmLand.uncultivated} acres` : 'Not provided'} />
                      </>
                    )}
                  </div>
                </section>
              )}

              {/* Commodities */}
              {selectedAgent.commodities && selectedAgent.commodities.length > 0 && (
                <section className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-gray-700">Commodities</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedAgent.commodities.map((commodityId, index) => {
                      const commodity = availableCommodities.find(c => c.id === commodityId);
                      return (
                        <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          {commodity ? commodity.name : commodityId}
                        </span>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Bank Details */}
              {selectedAgent.bankDetails && (
                <section className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-gray-700">Bank Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <DetailRow label="Account Holder" value={selectedAgent.bankDetails.accountHolderName || 'Not provided'} />
                    <DetailRow label="Account Number" value={selectedAgent.bankDetails.accountNumber || 'Not provided'} />
                    <DetailRow label="IFSC Code" value={selectedAgent.bankDetails.ifscCode || 'Not provided'} />
                    <DetailRow label="Branch" value={selectedAgent.bankDetails.branch || 'Not provided'} />
                  </div>
                </section>
              )}

              {/* Documents */}
              {selectedAgent.documents && (
                <section className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-gray-700">Documents</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedAgent.documents.panCard && (
                      <div>
                        <div className="text-xs text-gray-500">PAN Card:</div>
                        <a href={selectedAgent.documents.panCard} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          View PAN Card
                        </a>
                      </div>
                    )}
                    {selectedAgent.documents.aadharFront && (
                      <div>
                        <div className="text-xs text-gray-500">Aadhar Front:</div>
                        <a href={selectedAgent.documents.aadharFront} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          View Aadhar Front
                        </a>
                      </div>
                    )}
                    {selectedAgent.documents.aadharBack && (
                      <div>
                        <div className="text-xs text-gray-500">Aadhar Back:</div>
                        <a href={selectedAgent.documents.aadharBack} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          View Aadhar Back
                        </a>
                      </div>
                    )}
                    {selectedAgent.documents.bankPassbook && (
                      <div>
                        <div className="text-xs text-gray-500">Bank Passbook:</div>
                        <a href={selectedAgent.documents.bankPassbook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          View Bank Passbook
                        </a>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Security Information */}
              {selectedAgent.security && (
                <section className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-gray-700">Security Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <DetailRow label="Referral Code" value={selectedAgent.security.referralCode || 'Not provided'} />
                    <DetailRow label="MPIN Set" value={selectedAgent.security.mpin ? 'Yes' : 'No'} />
                    <DetailRow label="Password Set" value={selectedAgent.security.password ? 'Yes' : 'No'} />
                  </div>
                </section>
              )}
            </div>

            <div className="flex justify-end mt-6 p-3 pt-4 border-t">
              <button
                onClick={() => setViewOpen(false)}
                className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION Dialog */}
      {deleteOpen && selectedAgent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3 ">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl">
            <div className="text-center">
              <div className="text-red-500 text-5xl mb-4">🗑️</div>
              <h2 className="text-xl font-semibold mb-2">Delete Agent?</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <span className="font-semibold">{selectedAgent.personalInfo.name || 'this agent'}</span>? 
                This action cannot be undone.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setDeleteOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Delete Agent
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BULK DELETE CONFIRMATION Dialog */}
      {bulkDeleteOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3 ">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl">
            <div className="text-center">
              <div className="text-red-500 text-5xl mb-4">🗑️</div>
              <h2 className="text-xl font-semibold mb-2">Delete {selectedAgents.length} Agents?</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete {selectedAgents.length} selected agents{selectedAgents.length !== 1 ? 's' : ''}? 
                This action cannot be undone.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setBulkDeleteOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkDelete}
                  disabled={loading}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Delete {selectedAgents.length} Agents
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-200 last:border-0">
    <div className="w-full sm:w-1/3 font-medium text-gray-600 text-xs mb-1 sm:mb-0">{label}:</div>
    <div className="w-full sm:w-2/3 text-gray-900 break-words">{value}</div>
  </div>
);
