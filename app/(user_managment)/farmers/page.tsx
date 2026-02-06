









// // ////////////////////////////////////////////////////////////////////////////////////////////

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
// //   FaUser,
// //   FaCheckCircle,
// //   FaClock,
// //   FaTimesCircle,
// //   FaSeedling,
// // } from "react-icons/fa";
// // import * as XLSX from "xlsx";
// // import jsPDF from "jspdf";
// // import autoTable from "jspdf-autotable";
// // import axios from "axios";
// // import toast from "react-hot-toast";
// // import { Pagination, Dialog } from "@mui/material";
// // import { getAdminSessionAction } from "@/app/actions/auth-actions";

// // /* ================= TYPES ================= */

// // interface Farmer {
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
// //   role: "farmer";
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
// //   subcategories?: string[];
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
// //   __v?: number;
// // }

// // interface ApiResponse {
// //   success: boolean;
// //   data: Farmer[];
// //   page: number;
// //   limit: number;
// //   total: number;
// //   totalPages?: number;
// //   data1: Farmer[];
// // }

// // interface Commodity {
// //   _id: string;
// //   categoryName: string;
// //   categoryId: string;
// //   subCategories: SubCategory[];
// // }

// // interface SubCategory {
// //   _id: string;
// //   subCategoryName: string;
// //   categoryId: string;
// //   subCategoryId: string;
// // }

// // interface Market {
// //   _id: string;
// //   marketId: string;
// //   marketName: string;
// //   pincode: string;
// //   district: string;
// //   state: string;
// // }

// // /* ================= PAGE ================= */

// // export default function FarmersPage() {
// //   const [farmers, setFarmers] = useState<Farmer[]>([]);
// //   const [search, setSearch] = useState("");
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [rowsPerPage, setRowsPerPage] = useState(10);
// //   const [totalPages, setTotalPages] = useState(1);
// //   const [totalFarmers, setTotalFarmers] = useState(0);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);

// //   // Add this change state to trigger refreshes
// //   const [change, setChange] = useState<number>(0);

// //   const [viewOpen, setViewOpen] = useState(false);
// //   const [addOpen, setAddOpen] = useState(false);
// //   const [editOpen, setEditOpen] = useState(false);
// //   const [deleteOpen, setDeleteOpen] = useState(false);
// //   const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
// //   const [cropOpen, setCropOpen] = useState(false);
// //   const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);

// //   // FILTER STATES
// //   const [registrationStatusFilter, setRegistrationStatusFilter] = useState<string>("");
// //   const [stateFilter, setStateFilter] = useState<string>("");
// //   const [districtFilter, setDistrictFilter] = useState<string>("");
// //   const [talukFilter, setTalukFilter] = useState<string>("");

// //   // AVAILABLE FILTER OPTIONS
// //   const [availableStates, setAvailableStates] = useState<string[]>([]);
// //   const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);
// //   const [availableTaluks, setAvailableTaluks] = useState<string[]>([]);

// //   // DATA FOR DROPDOWNS
// //   const [commodities, setCommodities] = useState<Commodity[]>([]);
// //   const [markets, setMarkets] = useState<Market[]>([]);

// //   const [selectedFarmers, setSelectedFarmers] = useState<string[]>([]);
// //   const [selectAll, setSelectAll] = useState(false);
// //    const[user,setUser]=useState<{
// //         taluka:string,
// //         role:string
// //       }>()


// //   const [form, setForm] = useState({
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
// //     role: "farmer" as "farmer",
// //     latitude: "",
// //     longitude: "",
// //     totalLand: "",
// //     cultivatedLand: "",
// //     uncultivatedLand: "",
// //     commodities: [] as string[],
// //     nearestMarkets: [] as string[],
// //     subcategories: [] as string[],
// //     accountHolderName: "",
// //     accountNumber: "",
// //     ifscCode: "",
// //     branch: "",
// //     panCard: "",
// //     aadharFront: "",
// //     aadharBack: "",
// //     bankPassbook: "",
// //     referralCode: "",
// //     mpin: "",
// //     password: "",
// //     isActive: true,
// //     registrationStatus: "pending",
// //   });

// //   // Crop Form State
// //   const [cropForm, setCropForm] = useState({
// //     farmingType: "regular",
// //     seedType: "hybrid",
// //     acres: "",
// //     sowingDate: "",
// //     farmerId: "",
// //   });

// //   const registrationStatusOptions = [
// //     { value: "", label: "All Status" },
// //     { value: "pending", label: "Pending" },
// //     { value: "approved", label: "Approved" },
// //     { value: "rejected", label: "Rejected" },
// //     { value: "under_review", label: "Under Review" },
// //   ];

// //   const farmingTypeOptions = [
// //     { value: "organic", label: "Organic" },
// //     { value: "regular", label: "Regular" },
// //     { value: "natural", label: "Natural" },
// //     { value: "hydroponic", label: "Hydroponic" },
// //   ];

// //   const seedTypeOptions = [
// //     { value: "hybrid", label: "Hybrid" },
// //     { value: "naati", label: "Naati" },
// //     { value: "heirloom", label: "Heirloom" },
// //     { value: "gmo", label: "GMO" },
// //   ];

// //   // Refs to prevent duplicate calls
// //   const initialLoadRef = useRef(true);
// //   const isFetchingRef = useRef(false);
// //   const previousFiltersRef = useRef({
// //     search: "",
// //     registrationStatusFilter: "",
// //     stateFilter: "",
// //     districtFilter: "",
// //     talukFilter: "",
// //     currentPage: 1,
// //     rowsPerPage: 10,
// //     change: 0
// //   });

// //   /* ================= FETCH EXTERNAL DATA ================= */

// //   const fetchCommodities = useCallback(async () => {
// //     try {
// //       const response = await axios.get("/api/commodities");
// //       if (response.data.success) {
// //         setCommodities(response.data.data);
// //       }
// //     } catch (error: any) {
// //       console.error("Error fetching commodities:", error);
// //       toast.error("Failed to load commodities");
// //     }
// //   }, []);

// //   const fetchMarkets = useCallback(async () => {
// //     try {
// //       const response = await axios.get("/api/markets");
// //       if (response.data.success) {
// //         setMarkets(response.data.data);
// //       }
// //     } catch (error: any) {
// //       console.error("Error fetching markets:", error);
// //       toast.error("Failed to load markets");
// //     }
// //   }, []);

// //   /* ================= EXTRACT FILTER OPTIONS FROM DATA ================= */

// //   const extractFilterOptions = useCallback((farmersData: Farmer[]) => {
// //     if (!farmersData || farmersData.length === 0) return;

// //     // Extract unique states
// //     const states = Array.from(
// //       new Set(
// //         farmersData
// //           .map(f => f.personalInfo?.state)
// //           .filter(Boolean)
// //           .sort()
// //       )
// //     ) as string[];

// //     setAvailableStates(states);

// //     // Reset dependent filters when parent filter changes
// //     if (stateFilter && !states.includes(stateFilter)) {
// //       setDistrictFilter("");
// //       setTalukFilter("");
// //     }
// //   }, [stateFilter]);

// //   /* ================= FETCH FARMERS ================= */

// //   const fetchFarmers = useCallback(async (
// //     page: number = 1, 
// //     searchQuery: string = "", 
// //     registrationStatus: string = "",
// //     state: string = "",
// //     district: string = "",
// //     taluk: string = ""
// //   ) => {
// //     // Prevent multiple simultaneous calls
// //     if (isFetchingRef.current) return;

// //     // Check if filters have actually changed
// //     const currentFilters = {
// //       search: searchQuery,
// //       registrationStatusFilter: registrationStatus,
// //       stateFilter: state,
// //       districtFilter: district,
// //       talukFilter: taluk,
// //       currentPage: page,
// //       rowsPerPage,
// //       change
// //     };

// //     // If no filter change and we already have data, skip fetch
// //     if (
// //       !initialLoadRef.current && 
// //       JSON.stringify(currentFilters) === JSON.stringify(previousFiltersRef.current) &&
// //       farmers.length > 0
// //     ) {
// //       return;
// //     }

// //     // Update previous filters
// //     previousFiltersRef.current = currentFilters;

// //     try {
// //       isFetchingRef.current = true;
// //       if (!initialLoadRef.current) {
// //         setLoading(true);
// //       }
// //       setError(null);

// //       const params: any = {
// //         page: page.toString(),
// //         limit: rowsPerPage.toString(),
// //         role: "farmer",
// //       };

// //       if (searchQuery) {
// //         params.search = searchQuery;
// //       }
// //       if (registrationStatus) {
// //         params.registrationStatus = registrationStatus;
// //       }
// //       if (state) {
// //         params.state = state;
// //       }
// //       if (district) {
// //         params.district = district;
// //       }

// //        const session = await getAdminSessionAction();
// //                   setUser(session?.admin)
// //                   if(session?.admin?.role == "subadmin"){
// //                    params.taluk= session?.admin.taluka;
// //                  }else{
// //                     params.taluk = taluk;
// //                  }
// //     //   if (taluk) {
// //     //     params.taluk = taluk;
// //     //   }

// //       const res = await axios.get<ApiResponse>(`/api/farmers`, { params });

// //       if (res.data.success) {
// //         const processedFarmers = res.data.data.map(farmer => ({
// //           ...farmer,
// //           personalInfo: farmer.personalInfo || {
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
// //           role: farmer.role || "farmer",
// //           isActive: farmer.isActive ?? true,
// //           registrationStatus: farmer.registrationStatus || "pending",
// //           commodities: farmer.commodities || [],
// //           nearestMarkets: farmer.nearestMarkets || [],
// //           subcategories: farmer.subcategories || []
// //         }));

// //         setFarmers(processedFarmers);
// //         setTotalFarmers(res.data.total);
// //         const calculatedTotalPages = Math.ceil(res.data.total / rowsPerPage);
// //         setTotalPages(res.data.totalPages || calculatedTotalPages);
// //         setCurrentPage(res.data.page);
// //         setSelectedFarmers([]);
// //         setSelectAll(false);

// //         // Extract filter options from the complete dataset (data1)
// //         if (res.data.data1 && Array.isArray(res.data.data1)) {
// //           const processedFarmers2 = res.data.data1.map((farmer: any) => ({
// //             ...farmer,
// //             personalInfo: farmer.personalInfo || {
// //               name: "",
// //               mobileNo: "",
// //               email: "",
// //               address: "",
// //               villageGramaPanchayat: "",
// //               pincode: "",
// //               state: "",
// //               district: "",
// //               taluk: "",
// //               post: ""
// //             }
// //           }));
// //           extractFilterOptions(processedFarmers2);
// //         }
// //       }
// //     } catch (err: any) {
// //       console.error('Error fetching farmers:', err);
// //       setError(err.response?.data?.message || 'Failed to load farmers. Please try again.');
// //       setFarmers([]);
// //       toast.error(err.response?.data?.message || "Failed to load farmers");
// //     } finally {
// //       isFetchingRef.current = false;
// //       setLoading(false);
// //     }
// //   }, [rowsPerPage, extractFilterOptions, change]);

// //   /* ================= UPDATE REGISTRATION STATUS ================= */

// //   const handleUpdateRegistrationStatus = async (farmerId: string, status: string) => {
// //     try {
// //       const shouldActivate = status === "approved";

// //       const response = await axios.put(`/api/farmers/${farmerId}?status=true`, {
// //         registrationStatus: status,
// //         ...(shouldActivate && { isActive: true })
// //       });

// //       if (response.data.success) {
// //         toast.success(`Registration status updated to ${status}${shouldActivate ? ' and account activated' : ''}`);
// //         // Trigger refresh by incrementing change counter
// //         setChange(prev => prev + 1);
// //       }
// //     } catch (error: any) {
// //       console.error("Error updating registration status:", error);
// //       toast.error(error.response?.data?.message || "Failed to update registration status");
// //     }
// //   };

// //   // Main effect for fetching farmers
// //   useEffect(() => {
// //     const timer = setTimeout(() => {
// //       fetchFarmers(
// //         currentPage, 
// //         search, 
// //         registrationStatusFilter, 
// //         stateFilter, 
// //         districtFilter, 
// //         talukFilter
// //       );
// //     }, 200);

// //     return () => clearTimeout(timer);
// //   }, [
// //     currentPage, 
// //     search, 
// //     registrationStatusFilter, 
// //     stateFilter, 
// //     districtFilter, 
// //     talukFilter,
// //     rowsPerPage,
// //     change,
// //     fetchFarmers
// //   ]);


// //    useEffect(()=>{
// //      fetchCommodities(),
// //     fetchMarkets()
// //   },[change])
// //   // Initial data fetch - only once
// //   // useEffect(() => {
// //   //   const fetchInitialData = async () => {
// //   //     try {
// //   //       setLoading(true);
// //   //       await Promise.all([
// //   //         fetchFarmers(1, "", "", "", "", ""),
// //   //         fetchCommodities(),
// //   //         fetchMarkets()
// //   //       ]);
// //   //     } catch (error) {
// //   //       console.error("Error fetching initial data:", error);
// //   //     } finally {
// //   //       setLoading(false);
// //   //       initialLoadRef.current = false;
// //   //     }
// //   //   };

// //   //   if (initialLoadRef.current) {
// //   //     fetchInitialData();
// //   //   }
// //   // }, [fetchFarmers, fetchCommodities, fetchMarkets]);

// //   // Update districts when state changes
// //   useEffect(() => {
// //     if (farmers.length === 0) return;

// //     const districts = Array.from(
// //       new Set(
// //         farmers
// //           .filter(f => !stateFilter || f.personalInfo?.state === stateFilter)
// //           .map(f => f.personalInfo?.district)
// //           .filter(Boolean)
// //           .sort()
// //       )
// //     ) as string[];

// //     setAvailableDistricts(districts);

// //     // Reset district filter if selected district is not in the new list
// //     if (districtFilter && !districts.includes(districtFilter)) {
// //       setDistrictFilter("");
// //     }
// //   }, [stateFilter, farmers, districtFilter]);

// //   // Update taluks when district changes
// //   useEffect(() => {
// //     if (farmers.length === 0) return;

// //     const taluks = Array.from(
// //       new Set(
// //         farmers
// //           .filter(f => 
// //             (!stateFilter || f.personalInfo?.state === stateFilter) &&
// //             (!districtFilter || f.personalInfo?.district === districtFilter)
// //           )
// //           .map(f => f.personalInfo?.taluk)
// //           .filter(Boolean)
// //           .sort()
// //       )
// //     ) as string[];

// //     setAvailableTaluks(taluks);

// //     // Reset taluk filter if selected taluk is not in the new list
// //     if (talukFilter && !taluks.includes(talukFilter)) {
// //       setTalukFilter("");
// //     }
// //   }, [districtFilter, stateFilter, farmers, talukFilter]);

// //   /* ================= SELECTION HANDLERS ================= */

// //   const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     if (e.target.checked) {
// //       const allFarmerIds = farmers.map(farmer => farmer._id);
// //       setSelectedFarmers(allFarmerIds);
// //       setSelectAll(true);
// //     } else {
// //       setSelectedFarmers([]);
// //       setSelectAll(false);
// //     }
// //   };

// //   const handleSelectOne = (id: string, checked: boolean) => {
// //     if (checked) {
// //       setSelectedFarmers([...selectedFarmers, id]);
// //     } else {
// //       setSelectedFarmers(selectedFarmers.filter(farmerId => farmerId !== id));
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
// //     } else if (type === 'checkbox' && name === 'nearestMarkets') {
// //       const marketId = value;
// //       setForm(prev => ({
// //         ...prev,
// //         nearestMarkets: prev.nearestMarkets.includes(marketId)
// //           ? prev.nearestMarkets.filter(id => id !== marketId)
// //           : [...prev.nearestMarkets, marketId]
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

// //   const handleCommodityChange = (commodityId: string, isChecked: boolean) => {
// //     setForm(prev => ({
// //       ...prev,
// //       commodities: isChecked 
// //         ? [...prev.commodities, commodityId]
// //         : prev.commodities.filter(id => id !== commodityId)
// //     }));

// //     // Clear subcategories for this commodity if unchecked
// //     if (!isChecked) {
// //       const commodity = commodities.find(c => c._id === commodityId);
// //       if (commodity) {
// //         const subcatIds = commodity.subCategories.map(sc => sc._id);
// //         setForm(prev => ({
// //           ...prev,
// //           subcategories: prev.subcategories.filter(id => !subcatIds.includes(id))
// //         }));
// //       }
// //     }
// //   };

// //   const handleSubcategoryChange = (subcategoryId: string, commodityId: string, isChecked: boolean) => {
// //     setForm(prev => ({
// //       ...prev,
// //       subcategories: isChecked 
// //         ? [...prev.subcategories, subcategoryId]
// //         : prev.subcategories.filter(id => id !== subcategoryId)
// //     }));
// //   };

// //   const handleCropChange = (
// //     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
// //   ) => {
// //     const { name, value } = e.target;
// //     setCropForm(prev => ({
// //       ...prev,
// //       [name]: value,
// //     }));
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
// //       role: "farmer",
// //       latitude: "",
// //       longitude: "",
// //       totalLand: "",
// //       cultivatedLand: "",
// //       uncultivatedLand: "",
// //       commodities: [],
// //       nearestMarkets: [],
// //       subcategories: [],
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

// //   const resetCropForm = () => {
// //     setCropForm({
// //       farmingType: "regular",
// //       seedType: "hybrid",
// //       acres: "",
// //       sowingDate: "",
// //       farmerId: "",
// //     });
// //   };

// //   const populateFormForEdit = (farmer: Farmer) => {
// //     const personalInfo = farmer.personalInfo;
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
// //       role: farmer.role || "farmer",
// //       latitude: farmer.farmLocation?.latitude || "",
// //       longitude: farmer.farmLocation?.longitude || "",
// //       totalLand: farmer.farmLand?.total?.toString() || "",
// //       cultivatedLand: farmer.farmLand?.cultivated?.toString() || "",
// //       uncultivatedLand: farmer.farmLand?.uncultivated?.toString() || "",
// //       commodities: farmer.commodities || [],
// //       nearestMarkets: farmer.nearestMarkets || [],
// //       subcategories: farmer.subcategories || [],
// //       accountHolderName: farmer.bankDetails?.accountHolderName || "",
// //       accountNumber: farmer.bankDetails?.accountNumber || "",
// //       ifscCode: farmer.bankDetails?.ifscCode || "",
// //       branch: farmer.bankDetails?.branch || "",
// //       panCard: farmer.documents?.panCard || "",
// //       aadharFront: farmer.documents?.aadharFront || "",
// //       aadharBack: farmer.documents?.aadharBack || "",
// //       bankPassbook: farmer.documents?.bankPassbook || "",
// //       referralCode: farmer.security?.referralCode || "",
// //       mpin: "",
// //       password: "",
// //       isActive: farmer.isActive ?? true,
// //       registrationStatus: farmer.registrationStatus || "pending",
// //     });
// //     setSelectedFarmer(farmer);
// //     setEditOpen(true);
// //   };

// //   const openCropForm = (farmer: Farmer) => {
// //     setSelectedFarmer(farmer);
// //     setCropForm({
// //       farmingType: "regular",
// //       seedType: "hybrid",
// //       acres: "",
// //       sowingDate: "",
// //       farmerId: farmer._id,
// //     });
// //     setCropOpen(true);
// //   };

// //   /* ================= CRUD OPERATIONS ================= */

// //   const handleAdd = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     try {
// //       setLoading(true);

// //       const farmerData = {
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
// //         farmLocation: {
// //           latitude: form.latitude,
// //           longitude: form.longitude,
// //         },
// //         farmLand: {
// //           total: form.totalLand ? Number(form.totalLand) : null,
// //           cultivated: form.cultivatedLand ? Number(form.cultivatedLand) : null,
// //           uncultivated: form.uncultivatedLand ? Number(form.uncultivatedLand) : null,
// //         },
// //         commodities: form.commodities,
// //         nearestMarkets: form.nearestMarkets,
// //         subcategories: form.subcategories,
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

// //       console.log("Sending farmer data:", farmerData); // Debug log

// //       const res = await axios.post("/api/farmers", farmerData);

// //       if (res.data.success) {
// //         toast.success("Farmer added successfully!");
// //         setAddOpen(false);
// //         resetForm();
// //         // Trigger refresh by incrementing change counter
// //         setChange(prev => prev + 1);
// //       }
// //     } catch (err: any) {
// //       console.error("Error adding farmer:", err.response?.data || err);
// //       toast.error(err.response?.data?.message || "Failed to add farmer");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleEdit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     if (!selectedFarmer) return;

// //     try {
// //       setLoading(true);

// //       const farmerData = {
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
// //         farmLocation: {
// //           latitude: form.latitude,
// //           longitude: form.longitude,
// //         },
// //         farmLand: {
// //           total: form.totalLand ? Number(form.totalLand) : null,
// //           cultivated: form.cultivatedLand ? Number(form.cultivatedLand) : null,
// //           uncultivated: form.uncultivatedLand ? Number(form.uncultivatedLand) : null,
// //         },
// //         commodities: form.commodities,
// //         nearestMarkets: form.nearestMarkets,
// //         subcategories: form.subcategories,
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

// //       console.log("Sending update data:", farmerData); // Debug log

// //       const res = await axios.put(`/api/farmers/${selectedFarmer._id}`, farmerData);

// //       if (res.data.success) {
// //         toast.success("Farmer updated successfully!");
// //         setEditOpen(false);
// //         resetForm();
// //         setSelectedFarmer(null);
// //         // Trigger refresh by incrementing change counter
// //         setChange(prev => prev + 1);
// //       }
// //     } catch (err: any) {
// //       console.error("Error updating farmer:", err.response?.data || err);
// //       toast.error(err.response?.data?.message || "Failed to update farmer");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleAddCrop = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     if (!selectedFarmer) return;

// //     try {
// //       setLoading(true);

// //       if (!cropForm.acres || !cropForm.sowingDate) {
// //         toast.error("Please fill all required fields");
// //         return;
// //       }

// //       const cropData = {
// //         farmingType: cropForm.farmingType,
// //         seedType: cropForm.seedType,
// //         acres: Number(cropForm.acres),
// //         sowingDate: cropForm.sowingDate,
// //         farmerId: selectedFarmer.farmerId || selectedFarmer._id,
// //       };

// //       const res = await axios.post("/api/postings", cropData);

// //       if (res.data.success) {
// //         toast.success("Crop added successfully with tracking!");
// //         setCropOpen(false);
// //         resetCropForm();
// //         setSelectedFarmer(null);

// //         if (res.data.tracking) {
// //           toast.success(`Tracking created with ${res.data.tracking.stages?.length || 7} stages`);
// //         }
// //       }
// //     } catch (err: any) {
// //       console.error("Error adding crop:", err);
// //       toast.error(err.response?.data?.message || "Failed to add crop");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleDelete = async () => {
// //     if (!selectedFarmer) return;

// //     try {
// //       setLoading(true);

// //       await axios.delete(`/api/farmers/${selectedFarmer._id}`);
// //       toast.success("Farmer deleted successfully!");
// //       setDeleteOpen(false);
// //       setSelectedFarmer(null);
// //       // Trigger refresh by incrementing change counter
// //       setChange(prev => prev + 1);
// //     } catch (error: any) {
// //       toast.error(error.response?.data?.message || "Failed to delete farmer. Please try again.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleBulkDelete = async () => {
// //     if (selectedFarmers.length === 0) {
// //       toast.error("No farmers selected");
// //       return;
// //     }

// //     try {
// //       setLoading(true);

// //       const response = await axios.post("/api/farmers/bulk-delete", {
// //         ids: selectedFarmers
// //       });

// //       if (response.data.success) {
// //         toast.success(response.data.message || `${selectedFarmers.length} farmers deleted successfully!`);
// //         setSelectedFarmers([]);
// //         setSelectAll(false);
// //         setBulkDeleteOpen(false);
// //         // Trigger refresh by incrementing change counter
// //         setChange(prev => prev + 1);
// //       } else {
// //         toast.error("Failed to delete farmers");
// //       }
// //     } catch (error: any) {
// //       toast.error("Error deleting farmers");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   /* ================= GET COMMODITY AND MARKET NAMES ================= */

// //   const getCommodityNames = (commodityIds: string[] = []) => {
// //     return commodityIds.map(id => {
// //       const commodity = commodities.find(c => c._id === id);
// //       return commodity ? commodity.categoryName : id;
// //     });
// //   };

// //   const getMarketNames = (marketIds: string[] = []) => {
// //     return marketIds.map(id => {
// //       const market = markets.find(m => m._id === id);
// //       return market ? `${market.marketName}, ${market.district}` : id;
// //     });
// //   };

// //   const getSubcategoryNames = (subcategoryIds: string[] = []) => {
// //     const allSubcategories = commodities.flatMap(c => c.subCategories);
// //     return subcategoryIds.map(id => {
// //       const subcat = allSubcategories.find(sc => sc._id === id);
// //       return subcat ? subcat.subCategoryName : id;
// //     });
// //   };

// //   /* ================= EXPORT FUNCTIONS ================= */

// //   const exportData = farmers.map((farmer, index) => {
// //     const personalInfo = farmer.personalInfo;
// //     return {
// //       "Sr.": index + 1 + (currentPage - 1) * rowsPerPage,
// //       "Name": personalInfo.name || 'N/A',
// //       "Mobile": personalInfo.mobileNo || 'N/A',
// //       "Email": personalInfo.email || 'N/A',
// //       "Role": farmer.role || 'N/A',
// //       "Village": personalInfo.villageGramaPanchayat || 'N/A',
// //       "District": personalInfo.district || 'N/A',
// //       "State": personalInfo.state || 'N/A',
// //       "Address": personalInfo.address || 'N/A',
// //       "Taluk": personalInfo.taluk || 'N/A',
// //       "Post": personalInfo.post || 'N/A',
// //       "Pincode": personalInfo.pincode || 'N/A',
// //       "Registration Status": farmer.registrationStatus || 'N/A',
// //       "Status": farmer.isActive ? "Active" : "Inactive",
// //       "Registered": farmer.registeredAt ? new Date(farmer.registeredAt).toLocaleDateString() : 'N/A',
// //     };
// //   });

// //   const handlePrint = () => {
// //     if (farmers.length === 0) {
// //       toast.error("No farmers to print");
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
// //         <title>Farmers Report</title>
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
// //           <h1>👨‍🌾 Farmers Management Report</h1>
// //           <div class="header-info">Generated on: ${printDate} at ${printTime}</div>
// //           <div class="header-info">Total Farmers: ${totalFarmers} | Showing: ${farmers.length} farmers</div>
// //           <div class="header-info">Page: ${currentPage} of ${totalPages}</div>
// //         </div>

// //         <table>
// //           <thead>
// //             <tr>
// //               <th>Sr.</th>
// //               <th>Name</th>
// //               <th>Mobile</th>
// //               <th>Email</th>
// //               <th>Village</th>
// //               <th>District</th>
// //               <th>State</th>
// //               <th>Reg. Status</th>
// //               <th>Status</th>
// //               <th>Registered Date</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             ${farmers.map((farmer, index) => {
// //               const personalInfo = farmer.personalInfo;
// //               return `
// //                 <tr>
// //                   <td>${index + 1 + (currentPage - 1) * rowsPerPage}</td>
// //                   <td><strong>${personalInfo.name || 'N/A'}</strong></td>
// //                   <td>${personalInfo.mobileNo || 'N/A'}</td>
// //                   <td>${personalInfo.email || 'N/A'}</td>
// //                   <td>${personalInfo.villageGramaPanchayat || 'N/A'}</td>
// //                   <td>${personalInfo.district || 'N/A'}</td>
// //                   <td>${personalInfo.state || 'N/A'}</td>
// //                   <td>${farmer.registrationStatus || 'N/A'}</td>
// //                   <td>${farmer.isActive ? 'Active' : 'Inactive'}</td>
// //                   <td>${farmer.registeredAt ? new Date(farmer.registeredAt).toLocaleDateString() : 'N/A'}</td>
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

// //   const handleCopy = async (): Promise<void> => {
// //     if (farmers.length === 0) {
// //       toast.error("No farmers to copy");
// //       return;
// //     }

// //     const headers = ["Sr.", "Name", "Mobile", "Email", "Village", "District", "State", "Reg. Status", "Status", "Registered"];

// //     const colWidths = [6, 20, 15, 25, 15, 15, 15, 15, 12, 12];

// //     const formatRow = (data: any, isHeader = false): string => {
// //       const values = isHeader ? headers : [
// //         data["Sr."] || "",
// //         data.Name || "",
// //         data.Mobile || "",
// //         data.Email || "",
// //         data.Village || "",
// //         data.District || "",
// //         data.State || "",
// //         data["Registration Status"] || "",
// //         data.Status || "",
// //         data.Registered || ""
// //       ];

// //       return values.map((val: string, i: number) => 
// //         String(val).padEnd(colWidths[i])
// //       ).join(" | ");
// //     };

// //     const text = [
// //       formatRow(headers, true),
// //       "-".repeat(150),
// //       ...exportData.map((f: any) => formatRow(f, false)),
// //       "",
// //       `TOTAL: ${farmers.length} farmers`,
// //       `EXPORTED: ${new Date().toLocaleString()}`
// //     ].join("\n");

// //     try {
// //       await navigator.clipboard.writeText(text);
// //       toast.success("Farmers table copied to clipboard!");
// //     } catch (err) {
// //       toast.error("Failed to copy to clipboard");
// //     }
// //   };

// //   const handleExcel = () => {
// //     if (farmers.length === 0) {
// //       toast.error("No farmers to export");
// //       return;
// //     }

// //     try {
// //       const ws = XLSX.utils.json_to_sheet(exportData);
// //       const wb = XLSX.utils.book_new();
// //       XLSX.utils.book_append_sheet(wb, ws, "Farmers");
// //       XLSX.writeFile(wb, `farmers-${new Date().toISOString().split('T')[0]}.xlsx`);
// //       toast.success("Excel file exported successfully!");
// //     } catch (err) {
// //       toast.error("Failed to export Excel file");
// //     }
// //   };

// //   const handleCSV = () => {
// //     if (farmers.length === 0) {
// //       toast.error("No farmers to export");
// //       return;
// //     }

// //     try {
// //       const ws = XLSX.utils.json_to_sheet(exportData);
// //       const csv = XLSX.utils.sheet_to_csv(ws);
// //       const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
// //       const a = document.createElement("a");
// //       a.href = URL.createObjectURL(blob);
// //       a.download = `farmers-${new Date().toISOString().split('T')[0]}.csv`;
// //       a.click();
// //       toast.success("CSV file exported successfully!");
// //     } catch (err) {
// //       toast.error("Failed to export CSV file");
// //     }
// //   };

// //   const handlePDF = () => {
// //     if (farmers.length === 0) {
// //       toast.error("No farmers to export");
// //       return;
// //     }

// //     try {
// //       const doc = new jsPDF();
// //       doc.text("Farmers Management Report", 14, 16);

// //       const tableColumn = ["Sr.", "Name", "Mobile", "Email", "Village", "District", "State", "Reg. Status", "Status"];
// //       const tableRows: any = exportData.map(f => [
// //         f["Sr."],
// //         f.Name,
// //         f.Mobile,
// //         f.Email,
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

// //       doc.save(`farmers-${new Date().toISOString().split('T')[0]}.pdf`);
// //       toast.success("PDF file exported successfully!");
// //     } catch (err) {
// //       toast.error("Failed to export PDF file");
// //     }
// //   };

// //   /* ================= RESET FILTERS ================= */

// //   const handleResetFilters = () => {
// //     setSearch("");
// //     setCurrentPage(1);
// //     setRegistrationStatusFilter("");
// //     setStateFilter("");
// //     setDistrictFilter("");
// //     setTalukFilter("");
// //     setSelectedFarmers([]);
// //     setSelectAll(false);
// //     // Also trigger a refresh
// //     setChange(prev => prev + 1);
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

// //   const getRoleBadge = () => {
// //     return "bg-blue-100 text-blue-800";
// //   };

// //   const getRoleIcon = () => {
// //     return <FaUser className="inline mr-1" />;
// //   };

// //   /* ================= UI ================= */

// //   return (
// //     <div className="min-h-screen xl:w-[83vw] lg:w-[77vw] overflow-x-scroll bg-gray-50 p-2">
// //       {/* Loading Overlay */}
// //       {loading && (
// //         <div className="fixed inset-0 bg-[#e9e7e72f] z-[100] flex items-center justify-center">
// //           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
// //         </div>
// //       )}

// //       {/* Header Section */}
// //       <div className="mb-4 flex gap-y-2 flex-wrap justify-between items-center">
// //         <div>
// //           <h1 className="text-2xl md:text-2xl font-bold text-gray-800">Farmers Management</h1>
// //           <p className="text-gray-600 mt-2">
// //             Overview and detailed management of all registered farmers. {totalFarmers} farmers found.
// //           </p>
// //         </div>
// //         <button 
// //           onClick={() => setAddOpen(true)}
// //           disabled={loading}
// //           className="bg-green-500 p-2 px-4 text-white rounded shadow-2xl cursor-pointer flex items-center gap-2 hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
// //         >
// //           <FaPlus /> Add Farmer
// //         </button>
// //       </div>

// //       {/* Add New Farmer Dialog */}
// //       <Dialog open={addOpen} onClose={() => { setAddOpen(false); resetForm(); }} maxWidth="lg" fullWidth>
// //         <div className="p-6 max-h-[90vh] overflow-y-auto relative">
// //           <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Farmer</h2>
// //           <button type="button" className="absolute top-3 right-5 cursor-pointer text-red-400" onClick={()=>{
// //             setAddOpen(false); resetForm();
// //           }}>X</button>
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
// //                   <input
// //                     type="tel"
// //                     name="mobileNo"
// //                     value={form.mobileNo}
// //                     onChange={(e) => {
// //                       const value = e.target.value.replace(/\D/g, "");
// //                       if (value.length <= 10) {
// //                         setForm({ ...form, mobileNo: value });
// //                       }
// //                     }}
// //                     required
// //                     inputMode="numeric"
// //                     className="input-field"
// //                     placeholder="Enter mobile number"
// //                   />
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

// //             {/* FARM INFORMATION */}
// //             <section className="bg-gray-50 p-6 rounded-lg">
// //               <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Farm Location</h3>
// //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                 <div>
// //                   <label className="block text-xs font-medium text-gray-700 mb-1">Latitude</label>
// //                   <input name="latitude" value={form.latitude} onChange={handleChange} className="input-field" placeholder="Enter latitude" />
// //                 </div>
// //                 <div>
// //                   <label className="block text-xs font-medium text-gray-700 mb-1">Longitude</label>
// //                   <input name="longitude" value={form.longitude} onChange={handleChange} className="input-field" placeholder="Enter longitude" />
// //                 </div>
// //               </div>
// //             </section>

// //             <section className="bg-gray-50 p-6 rounded-lg">
// //               <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Farm Land Details</h3>
// //               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// //                 <div>
// //                   <label className="block text-xs font-medium text-gray-700 mb-1">Total Land (acres)</label>
// //                   <input name="totalLand" value={form.totalLand} onChange={handleChange} className="input-field" placeholder="Total land area" type="number" />
// //                 </div>
// //                 <div>
// //                   <label className="block text-xs font-medium text-gray-700 mb-1">Cultivated Land (acres)</label>
// //                   <input name="cultivatedLand" value={form.cultivatedLand} onChange={handleChange} className="input-field" placeholder="Cultivated land area" type="number" />
// //                 </div>
// //                 <div>
// //                   <label className="block text-xs font-medium text-gray-700 mb-1">Uncultivated Land (acres)</label>
// //                   <input name="uncultivatedLand" value={form.uncultivatedLand} onChange={handleChange} className="input-field" placeholder="Uncultivated land area" type="number" />
// //                 </div>
// //               </div>
// //             </section>

// //             {/* COMMODITIES */}
// //             <section className="bg-gray-50 p-6 rounded-lg">
// //               <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Commodities</h3>
// //               <div className="space-y-4">
// //                 <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
// //                   {commodities.map(commodity => (
// //                     <label key={commodity._id} className="flex items-center space-x-2 cursor-pointer p-2 bg-white rounded border hover:bg-gray-50">
// //                       <input 
// //                         type="checkbox" 
// //                         checked={form.commodities.includes(commodity._id)} 
// //                         onChange={(e) => handleCommodityChange(commodity._id, e.target.checked)} 
// //                         className="h-4 w-4 text-green-600" 
// //                       />
// //                       <span className="text-gray-700">{commodity.categoryName}</span>
// //                     </label>
// //                   ))}
// //                 </div>

// //                 {/* Subcategories for selected commodities */}
// //                 {form.commodities.length > 0 && (
// //                   <div className="mt-4">
// //                     <h4 className="text-lg font-semibold mb-3 text-gray-600">Subcategories</h4>
// //                     <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
// //                       {form.commodities.map(commodityId => {
// //                         const commodity = commodities.find(c => c._id === commodityId);
// //                         if (!commodity || !commodity.subCategories.length) return null;

// //                         return (
// //                           <div key={commodity._id} className="mb-4">
// //                             <h5 className="font-medium text-gray-700 mb-2">{commodity.categoryName}:</h5>
// //                             <div className="space-y-2 ml-4">
// //                               {commodity.subCategories.map(subcat => (
// //                                 <label key={subcat._id} className="flex items-center space-x-2 cursor-pointer">
// //                                   <input 
// //                                     type="checkbox" 
// //                                     checked={form.subcategories.includes(subcat._id)} 
// //                                     onChange={(e) => handleSubcategoryChange(subcat._id, commodity._id, e.target.checked)} 
// //                                     className="h-4 w-4 text-blue-600" 
// //                                   />
// //                                   <span className="text-gray-600 text-sm">{subcat.subCategoryName}</span>
// //                                 </label>
// //                               ))}
// //                             </div>
// //                           </div>
// //                         );
// //                       })}
// //                     </div>
// //                   </div>
// //                 )}
// //               </div>
// //             </section>

// //             {/* NEAREST MARKETS */}
// //             <section className="bg-gray-50 p-4 rounded-lg">
// //               <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Nearest Markets</h3>
// //               <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
// //                 {markets.map(market => (
// //                   <label key={market._id} className="flex items-center space-x-2 cursor-pointer p-2 bg-white rounded border hover:bg-gray-50">
// //                     <input 
// //                       type="checkbox" 
// //                       name="nearestMarkets" 
// //                       value={market._id} 
// //                       checked={form.nearestMarkets.includes(market._id)} 
// //                       onChange={handleChange} 
// //                       className="h-4 w-4 text-purple-600" 
// //                     />
// //                     <span className="text-gray-700">
// //                       {market.marketName} ({market.district})
// //                     </span>
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
// //                   <input type="number" name="accountNumber" value={form.accountNumber} onChange={handleChange} className="input-field" placeholder="Bank account number" />
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
// //                 {loading ? "Adding..." : "Add Farmer"}
// //               </button>
// //             </div>
// //           </form>
// //         </div>
// //       </Dialog>

// //       {/* Add Crop Dialog */}
// //       <Dialog open={cropOpen} onClose={() => { setCropOpen(false); resetCropForm(); }} maxWidth="md" fullWidth>
// //         <div className="p-6 max-h-[90vh] overflow-y-auto">
// //           <h2 className="text-2xl font-bold mb-6 text-gray-800">Add Crop for Farmer</h2>
// //           {selectedFarmer && (
// //             <div className="mb-6 p-4 bg-blue-50 rounded-lg">
// //               <h3 className="font-semibold text-gray-700 mb-2">Farmer Information:</h3>
// //               <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
// //                 <div><span className="font-medium">Name:</span> {selectedFarmer.personalInfo.name}</div>
// //                 <div><span className="font-medium">Mobile:</span> {selectedFarmer.personalInfo.mobileNo}</div>
// //                 <div><span className="font-medium">Village:</span> {selectedFarmer.personalInfo.villageGramaPanchayat}</div>
// //                 <div><span className="font-medium">District:</span> {selectedFarmer.personalInfo.district}</div>
// //                 <div className="md:col-span-2"><span className="font-medium">Farmer ID:</span> {selectedFarmer._id}</div>
// //               </div>
// //             </div>
// //           )}

// //           <form onSubmit={handleAddCrop} className="space-y-6">
// //             <section className="bg-gray-50 p-6 rounded-lg">
// //               <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Crop Information</h3>
// //               <div className="space-y-4">
// //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                   <div>
// //                     <label className="block text-xs font-medium text-gray-700 mb-1">Farming Type *</label>
// //                     <select 
// //                       name="farmingType" 
// //                       value={cropForm.farmingType} 
// //                       onChange={handleCropChange}
// //                       className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors"
// //                       required
// //                     >
// //                       {farmingTypeOptions.map(option => (
// //                         <option key={option.value} value={option.value}>
// //                           {option.label}
// //                         </option>
// //                       ))}
// //                     </select>
// //                   </div>
// //                   <div>
// //                     <label className="block text-xs font-medium text-gray-700 mb-1">Seed Type *</label>
// //                     <select 
// //                       name="seedType" 
// //                       value={cropForm.seedType} 
// //                       onChange={handleCropChange}
// //                       className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors"
// //                       required
// //                     >
// //                       {seedTypeOptions.map(option => (
// //                         <option key={option.value} value={option.value}>
// //                           {option.label}
// //                         </option>
// //                       ))}
// //                     </select>
// //                   </div>
// //                 </div>

// //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                   <div>
// //                     <label className="block text-xs font-medium text-gray-700 mb-1">Acres *</label>
// //                     <input 
// //                       type="number" 
// //                       name="acres" 
// //                       value={cropForm.acres} 
// //                       onChange={handleCropChange}
// //                       className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors"
// //                       placeholder="Enter acres"
// //                       min="0"
// //                       step="0.01"
// //                       required
// //                     />
// //                   </div>
// //                   <div>
// //                     <label className="block text-xs font-medium text-gray-700 mb-1">Sowing Date *</label>
// //                     <input 
// //                       type="date" 
// //                       name="sowingDate" 
// //                       value={cropForm.sowingDate} 
// //                       onChange={handleCropChange}
// //                       className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors"
// //                       required
// //                     />
// //                   </div>
// //                 </div>

// //                 <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
// //                   <h4 className="font-semibold text-green-800 mb-2">Note:</h4>
// //                   <p className="text-sm text-green-700">
// //                     When you add a crop, a tracking record will be automatically created with 7 stages:
// //                     Nursery, Pre-Planting, Transplanting, Vegetative, Flowering, Fruit Development, and Harvesting.
// //                   </p>
// //                 </div>
// //               </div>
// //             </section>

// //             <div className="flex *:cursor-pointer flex-wrap justify-end gap-4 pt-6 border-t">
// //               {/* <button 
// //                 type="button" 
// //                 onClick={async() => { 
// //                  const res=await axios.patch('/api/postings',{action:"remove-unique-constraint"})
// //                  if(res.data.success){
// //                   toast.success(res.data.message)
// //                  }else{
// //                   toast.error(res.data.message)
// //                  }
// //                  }} 
// //                 className="px-6 py-2 text-blue-500 border border-blue-300 rounded-lg hover:bg-gray-50 transition-colors"
// //               >
// //                 Fix
// //               </button> */}
// //               <button 
// //                 type="button" 
// //                 onClick={() => { setCropOpen(false); resetCropForm(); }} 
// //                 className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
// //               >
// //                 Cancel
// //               </button>
// //               <button 
// //                 type="submit" 
// //                 disabled={loading} 
// //                 className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
// //               >
// //                 <FaSeedling className="mr-2" />
// //                 {loading ? "Adding Crop..." : "Add Crop"}
// //               </button>
// //             </div>
// //           </form>
// //         </div>
// //       </Dialog>

// //       {/* Edit Farmer Dialog */}
// //       <Dialog open={editOpen} onClose={() => { setEditOpen(false); resetForm(); setSelectedFarmer(null); }} maxWidth="lg" fullWidth>
// //         <div className="p-6 max-h-[90vh] overflow-y-auto">
// //           <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Farmer</h2>
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
// //                   <input
// //                     type="tel"
// //                     name="mobileNo"
// //                     value={form.mobileNo}
// //                     onChange={(e) => {
// //                       const value = e.target.value.replace(/\D/g, "");
// //                       if (value.length <= 10) {
// //                         setForm({ ...form, mobileNo: value });
// //                       }
// //                     }}
// //                     required
// //                     inputMode="numeric"
// //                     className="input-field"
// //                     placeholder="Enter mobile number"
// //                   />
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

// //             {/* FARM INFORMATION */}
// //             <section className="bg-gray-50 p-6 rounded-lg">
// //               <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Farm Location</h3>
// //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                 <div>
// //                   <label className="block text-xs font-medium text-gray-700 mb-1">Latitude</label>
// //                   <input name="latitude" value={form.latitude} onChange={handleChange} className="input-field" placeholder="Enter latitude" />
// //                 </div>
// //                 <div>
// //                   <label className="block text-xs font-medium text-gray-700 mb-1">Longitude</label>
// //                   <input name="longitude" value={form.longitude} onChange={handleChange} className="input-field" placeholder="Enter longitude" />
// //                 </div>
// //               </div>
// //             </section>

// //             <section className="bg-gray-50 p-6 rounded-lg">
// //               <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Farm Land Details</h3>
// //               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// //                 <div>
// //                   <label className="block text-xs font-medium text-gray-700 mb-1">Total Land (acres)</label>
// //                   <input name="totalLand" value={form.totalLand} onChange={handleChange} className="input-field" placeholder="Total land area" type="number" />
// //                 </div>
// //                 <div>
// //                   <label className="block text-xs font-medium text-gray-700 mb-1">Cultivated Land (acres)</label>
// //                   <input name="cultivatedLand" value={form.cultivatedLand} onChange={handleChange} className="input-field" placeholder="Cultivated land area" type="number" />
// //                 </div>
// //                 <div>
// //                   <label className="block text-xs font-medium text-gray-700 mb-1">Uncultivated Land (acres)</label>
// //                   <input name="uncultivatedLand" value={form.uncultivatedLand} onChange={handleChange} className="input-field" placeholder="Uncultivated land area" type="number" />
// //                 </div>
// //               </div>
// //             </section>

// //             {/* COMMODITIES */}
// //             <section className="bg-gray-50 p-6 rounded-lg">
// //               <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Commodities</h3>
// //               <div className="space-y-4">
// //                 <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
// //                   {commodities.map(commodity => (
// //                     <label key={commodity._id} className="flex items-center space-x-2 cursor-pointer p-2 bg-white rounded border hover:bg-gray-50">
// //                       <input 
// //                         type="checkbox" 
// //                         checked={form.commodities.includes(commodity._id)} 
// //                         onChange={(e) => handleCommodityChange(commodity._id, e.target.checked)} 
// //                         className="h-4 w-4 text-green-600" 
// //                       />
// //                       <span className="text-gray-700">{commodity.categoryName}</span>
// //                     </label>
// //                   ))}
// //                 </div>

// //                 {/* Subcategories for selected commodities */}
// //                 {form.commodities.length > 0 && (
// //                   <div className="mt-4">
// //                     <h4 className="text-lg font-semibold mb-3 text-gray-600">Subcategories</h4>
// //                     <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
// //                       {form.commodities.map(commodityId => {
// //                         const commodity = commodities.find(c => c._id === commodityId);
// //                         if (!commodity || !commodity.subCategories.length) return null;

// //                         return (
// //                           <div key={commodity._id} className="mb-4">
// //                             <h5 className="font-medium text-gray-700 mb-2">{commodity.categoryName}:</h5>
// //                             <div className="space-y-2 ml-4">
// //                               {commodity.subCategories.map(subcat => (
// //                                 <label key={subcat._id} className="flex items-center space-x-2 cursor-pointer">
// //                                   <input 
// //                                     type="checkbox" 
// //                                     checked={form.subcategories.includes(subcat._id)} 
// //                                     onChange={(e) => handleSubcategoryChange(subcat._id, commodity._id, e.target.checked)} 
// //                                     className="h-4 w-4 text-blue-600" 
// //                                   />
// //                                   <span className="text-gray-600 text-sm">{subcat.subCategoryName}</span>
// //                                 </label>
// //                               ))}
// //                             </div>
// //                           </div>
// //                         );
// //                       })}
// //                     </div>
// //                   </div>
// //                 )}
// //               </div>
// //             </section>

// //             {/* NEAREST MARKETS */}
// //             <section className="bg-gray-50 p-4 rounded-lg">
// //               <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Nearest Markets</h3>
// //               <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
// //                 {markets.map(market => (
// //                   <label key={market._id} className="flex items-center space-x-2 cursor-pointer p-2 bg-white rounded border hover:bg-gray-50">
// //                     <input 
// //                       type="checkbox" 
// //                       name="nearestMarkets" 
// //                       value={market._id} 
// //                       checked={form.nearestMarkets.includes(market._id)} 
// //                       onChange={handleChange} 
// //                       className="h-4 w-4 text-purple-600" 
// //                     />
// //                     <span className="text-gray-700">
// //                       {market.marketName} ({market.district})
// //                     </span>
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
// //                   <input type="number" name="accountNumber" value={form.accountNumber} onChange={handleChange} className="input-field" placeholder="Bank account number" />
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
// //               <button type="button" onClick={() => { setEditOpen(false); resetForm(); setSelectedFarmer(null); }} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
// //                 Cancel
// //               </button>
// //               <button type="submit" disabled={loading} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
// //                 {loading ? "Updating..." : "Update Farmer"}
// //               </button>
// //             </div>
// //           </form>
// //         </div>
// //       </Dialog>

// //       {/* Bulk Actions Bar */}
// //       {selectedFarmers.length > 0 && (
// //         <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
// //           <div className="flex items-center justify-between">
// //             <div className="flex items-center gap-2">
// //               <FaCheck className="text-red-600" />
// //               <span className="font-medium text-red-700">
// //                 {selectedFarmers.length} farmer{selectedFarmers.length !== 1 ? 's' : ''} selected
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
// //             disabled={farmers.length === 0 || loading}
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
// //                 // disabled={loading}
// //                 className="md:w-80 w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all disabled:opacity-50"
// //               />
// //             </div>
// //           </div>

// //           {
// //             user?.role=="admin"&&<>
// //             {/* State Filter */}
// //           <div className="md:col-span-2">
// //             <select
// //               className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors"
// //               value={stateFilter}
// //               onChange={(e) => {
// //                 setStateFilter(e.target.value);
// //                 setCurrentPage(1);
// //               }}
// //               disabled={loading || !availableStates?.length}
// //             >
// //               <option value="">All States</option>
// //               {availableStates.map(state => (
// //                 <option key={state} value={state}>
// //                   {state}
// //                 </option>
// //               ))}
// //             </select>
// //           </div>

// //           {/* District Filter */}
// //           <div className="md:col-span-2">
// //             <select
// //               className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors"
// //               value={districtFilter}
// //               onChange={(e) => {
// //                 setDistrictFilter(e.target.value);
// //                 setCurrentPage(1);
// //               }}
// //               disabled={loading}
// //             >
// //               <option value="">All Districts</option>
// //               {availableDistricts.map(district => (
// //                 <option key={district} value={district}>
// //                   {district}
// //                 </option>
// //               ))}
// //             </select>
// //           </div>

// //           {/* Taluk Filter */}
// //           <div className="md:col-span-2">
// //             <select
// //               className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors"
// //               value={talukFilter}
// //               onChange={(e) => {
// //                 setTalukFilter(e.target.value);
// //                 setCurrentPage(1);
// //               }}
// //               disabled={loading}
// //             >
// //               <option value="">All Taluks</option>
// //               {availableTaluks.map(taluk => (
// //                 <option key={taluk} value={taluk}>
// //                   {taluk}
// //                 </option>
// //               ))}
// //             </select>
// //           </div>

// //             </>
// //           }

// //           {/* Registration Status Filter */}
// //           <div className="md:col-span-2">
// //             <select
// //               className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors"
// //               value={registrationStatusFilter}
// //               onChange={(e) => {
// //                 setRegistrationStatusFilter(e.target.value);
// //                 setCurrentPage(1);
// //               }}
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
// //               { label: "Copy", icon: FaCopy, onClick: handleCopy, color: "bg-gray-100 hover:bg-gray-200 text-gray-800", disabled: farmers.length === 0 },
// //               { label: "Excel", icon: FaFileExcel, onClick: handleExcel, color: "bg-green-100 hover:bg-green-200 text-green-800", disabled: farmers.length === 0 },
// //               { label: "CSV", icon: FaFileCsv, onClick: handleCSV, color: "bg-blue-100 hover:bg-blue-200 text-blue-800", disabled: farmers.length === 0 },
// //               { label: "PDF", icon: FaFilePdf, onClick: handlePDF, color: "bg-red-100 hover:bg-red-200 text-red-800", disabled: farmers.length === 0 },
// //               { label: "Print", icon: FaPrint, onClick: handlePrint, color: "bg-purple-100 hover:bg-purple-200 text-purple-800", disabled: farmers.length === 0 },
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
// //       {!loading && farmers.length > 0 && (
// //         <>
// //           <div className="hidden lg:block bg-white overflow-x-scroll rounded shadow">
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
// //                   <th className="p-[.6rem] text-xs text-left font-semibold">Email</th>
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
// //                 {farmers.map((farmer, index) => {
// //                   const personalInfo = farmer.personalInfo;
// //                   return (
// //                     <tr key={farmer._id} className="hover:bg-gray-50 transition-colors">
// //                       <td className="p-[.6rem] text-xs">
// //                         <input
// //                           type="checkbox"
// //                           checked={selectedFarmers.includes(farmer._id)}
// //                           onChange={(e) => handleSelectOne(farmer._id, e.target.checked)}
// //                           disabled={loading}
// //                           className="rounded border-gray-300"
// //                         />
// //                       </td>
// //                       <td className="p-[.6rem] text-xs text-center">
// //                         {index + 1 + (currentPage - 1) * rowsPerPage}
// //                       </td>
// //                       <td className="p-[.6rem] text-xs">
// //                         <div className="font-semibold">{personalInfo.name || 'N/A'}</div>
// //                         {farmer.farmerId && <div className="text-xs text-gray-500">ID: {farmer.farmerId}</div>}
// //                       </td>
// //                       <td className="p-[.6rem] text-xs">{personalInfo.mobileNo || 'N/A'}</td>
// //                       <td className="p-[.6rem] text-xs">
// //                         <span className={`${personalInfo.email ? 'text-gray-900' : 'text-gray-400 italic'}`}>
// //                           {personalInfo.email || 'No email'}
// //                         </span>
// //                       </td>
// //                       <td className="p-[.6rem] text-xs">
// //                         <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleBadge()}`}>
// //                           {getRoleIcon()}
// //                           Farmer
// //                         </span>
// //                       </td>
// //                       <td className="p-[.6rem] text-xs">{personalInfo.villageGramaPanchayat || 'N/A'}</td>
// //                       <td className="p-[.6rem] text-xs">{personalInfo.district || 'N/A'}</td>
// //                       <td className="p-[.6rem] text-xs">{personalInfo.state || 'N/A'}</td>
// //                       <td className="p-[.6rem] text-xs">
// //                         <span className={`px-2 py-1 rounded text-xs font-medium ${getRegistrationStatusBadge(farmer.registrationStatus)}`}>
// //                           {getRegistrationStatusIcon(farmer.registrationStatus)}
// //                           {farmer.registrationStatus || 'Pending'}
// //                         </span>
// //                       </td>
// //                       <td className="p-[.6rem] text-xs">
// //                         <span className={`px-2 py-1 rounded text-xs font-medium ${farmer?.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
// //                           {farmer?.isActive ? "Active" : "Inactive"}
// //                         </span>
// //                       </td>
// //                       <td className="p-[.6rem] text-xs">
// //                         <div className="flex gap-[.6rem] text-xs">
// //                           <button
// //                             onClick={() => openCropForm(farmer)}
// //                             disabled={loading}
// //                             className="p-[.6rem] text-xs text-purple-600 hover:bg-purple-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
// //                             title="Add Crop"
// //                           >
// //                             <FaSeedling />
// //                           </button>
// //                           <button
// //                             onClick={() => { setSelectedFarmer(farmer); setViewOpen(true); }}
// //                             disabled={loading}
// //                             className="p-[.6rem] text-xs text-blue-600 hover:bg-blue-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
// //                             title="View Details"
// //                           >
// //                             <FaEye />
// //                           </button>
// //                           <button
// //                             onClick={() => populateFormForEdit(farmer)}
// //                             disabled={loading}
// //                             className="p-[.6rem] text-xs text-green-600 hover:bg-green-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
// //                             title="Edit Farmer"
// //                           >
// //                             <FaEdit />
// //                           </button>
// //                           <button
// //                             onClick={() => { setSelectedFarmer(farmer); setDeleteOpen(true); }}
// //                             disabled={loading}
// //                             className="p-[.6rem] text-xs text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
// //                             title="Delete Farmer"
// //                           >
// //                             <FaTrash />
// //                           </button>
// //                           {/* Approve Button - Only show if not already approved */}
// //                           {farmer.registrationStatus !== "approved" && (
// //                             <button
// //                               onClick={() => handleUpdateRegistrationStatus(farmer._id, "approved")}
// //                               disabled={loading}
// //                               className="p-[.6rem] text-xs text-green-600 hover:bg-green-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
// //                               title="Approve Farmer"
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
// //             {farmers.map((farmer, index) => {
// //               const personalInfo = farmer.personalInfo;
// //               return (
// //                 <div key={farmer._id} className="rounded p-[.6rem] text-xs border border-zinc-200 bg-white shadow">
// //                   <div className="flex justify-between items-start mb-3">
// //                     <div className="flex items-center gap-2">
// //                       <input
// //                         type="checkbox"
// //                         checked={selectedFarmers.includes(farmer._id)}
// //                         onChange={(e) => handleSelectOne(farmer._id, e.target.checked)}
// //                         disabled={loading}
// //                         className="rounded border-gray-300"
// //                       />
// //                       <div>
// //                         <div className="font-bold text-gray-800">{personalInfo.name || 'N/A'}</div>
// //                         <div className="text-xs text-gray-500">Sr. {index + 1 + (currentPage - 1) * rowsPerPage}</div>
// //                         {farmer.farmerId && <div className="text-xs text-gray-500">ID: {farmer.farmerId}</div>}
// //                       </div>
// //                     </div>
// //                     <div className="flex gap-[.6rem] text-xs">
// //                       <button 
// //                         onClick={() => openCropForm(farmer)} 
// //                         disabled={loading}
// //                         className="p-1.5 text-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
// //                         title="Add Crop"
// //                       >
// //                         <FaSeedling />
// //                       </button>
// //                       <button 
// //                         onClick={() => { setSelectedFarmer(farmer); setViewOpen(true); }} 
// //                         disabled={loading}
// //                         className="p-1.5 text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
// //                       >
// //                         <FaEye />
// //                       </button>
// //                       <button 
// //                         onClick={() => populateFormForEdit(farmer)} 
// //                         disabled={loading}
// //                         className="p-1.5 text-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
// //                       >
// //                         <FaEdit />
// //                       </button>
// //                       <button 
// //                         onClick={() => { setSelectedFarmer(farmer); setDeleteOpen(true); }} 
// //                         disabled={loading}
// //                         className="p-1.5 text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
// //                       >
// //                         <FaTrash />
// //                       </button>
// //                       {/* Approve Button for Mobile - Only show if not already approved */}
// //                       {farmer.registrationStatus !== "approved" && (
// //                         <button
// //                           onClick={() => handleUpdateRegistrationStatus(farmer._id, "approved")}
// //                           disabled={loading}
// //                           className="p-1.5 text-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
// //                           title="Approve Farmer"
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
// //                       <div className="text-xs text-gray-500 mb-2">Role</div>
// //                       <div className="text-xs">
// //                         <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleBadge()}`}>
// //                           {getRoleIcon()}
// //                           Farmer
// //                         </span>
// //                       </div>
// //                     </div>
// //                     <div className="grid grid-cols-2 gap-[.6rem] text-xs">
// //                       <div>
// //                         <div className="text-xs text-gray-500">Registration Status</div>
// //                         <div className="text-xs mt-2">
// //                           <span className={`px-2 py-1 rounded text-xs font-medium ${getRegistrationStatusBadge(farmer.registrationStatus)}`}>
// //                             {getRegistrationStatusIcon(farmer.registrationStatus)}
// //                             {farmer.registrationStatus || 'Pending'}
// //                           </span>
// //                         </div>
// //                       </div>
// //                       <div>
// //                         <div className="text-xs mb-2 text-gray-500">Status</div>
// //                         <div className="text-xs">
// //                           <span className={`px-2 py-1 rounded text-xs font-medium ${farmer?.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
// //                             {farmer?.isActive ? "Active" : "Inactive"}
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
// //       {!loading && farmers.length === 0 && (
// //         <div className="text-center py-12">
// //           <div className="text-gray-400 text-6xl mb-4">👨‍🌾</div>
// //           <h3 className="text-xl font-semibold mb-2">No farmers found</h3>
// //           <p className="text-gray-500">Try adjusting your search or filters</p>
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
// //       {!loading && farmers.length > 0 && (
// //         <div className="flex flex-col bg-white sm:flex-row p-3 shadow justify-between items-center gap-[.6rem] text-xs">
// //           <div className="text-gray-600">
// //             Showing <span className="font-semibold">{1 + (currentPage - 1) * rowsPerPage}-{Math.min(currentPage * rowsPerPage, totalFarmers)}</span> of{" "}
// //             <span className="font-semibold">{totalFarmers}</span> farmers
// //             <select
// //               value={rowsPerPage}
// //               onChange={(e) => {
// //                 setRowsPerPage(Number(e.target.value));
// //                 setCurrentPage(1);
// //               }}
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
// //       {viewOpen && selectedFarmer && (
// //         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3">
// //           <div className="bg-white rounded-xl w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-y-auto">
// //             <div className="flex justify-between p-3 items-center mb-6 sticky top-0 bg-white pb-4 border-b">
// //               <h2 className="font-semibold text-2xl text-gray-800">Farmer Details</h2>
// //               <button
// //                 onClick={() => setViewOpen(false)}
// //                 className="text-gray-500 hover:text-gray-700 text-2xl"
// //                 disabled={loading}
// //               >
// //                 ✕
// //               </button>
// //             </div>

// //             <div className="space-y-6 p-3">
// //               {/* Basic Information */}
// //               <section className="bg-gray-50 p-4 rounded-lg">
// //                 <h3 className="text-lg font-semibold mb-3 text-gray-700">Basic Information</h3>
// //                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
// //                   <DetailRow label="Farmer ID" value={selectedFarmer._id} />
// //                   {selectedFarmer.farmerId && <DetailRow label="Farmer ID" value={selectedFarmer.farmerId} />}
// //                   <DetailRow label="Name" value={selectedFarmer.personalInfo.name || 'Not provided'} />
// //                   <DetailRow label="Mobile" value={selectedFarmer.personalInfo.mobileNo || 'Not provided'} />
// //                   <DetailRow label="Email" value={selectedFarmer.personalInfo.email || 'Not provided'} />
// //                   <DetailRow label="Role" value="Farmer" />
// //                   <DetailRow label="Registration Status" value={selectedFarmer.registrationStatus || 'Not provided'} />
// //                   <DetailRow label="Status" value={selectedFarmer.isActive ? 'Active' : 'Inactive'} />
// //                   {selectedFarmer.registeredAt && <DetailRow label="Registered Date" value={new Date(selectedFarmer.registeredAt).toLocaleString()} />}
// //                 </div>
// //               </section>

// //               {/* Personal Information */}
// //               <section className="bg-gray-50 p-4 rounded-lg">
// //                 <h3 className="text-lg font-semibold mb-3 text-gray-700">Personal Information</h3>
// //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
// //                   <DetailRow label="Address" value={selectedFarmer.personalInfo.address || 'Not provided'} />
// //                   <DetailRow label="Village/Grama Panchayat" value={selectedFarmer.personalInfo.villageGramaPanchayat || 'Not provided'} />
// //                   <DetailRow label="Pincode" value={selectedFarmer.personalInfo.pincode || 'Not provided'} />
// //                   <DetailRow label="State" value={selectedFarmer.personalInfo.state || 'Not provided'} />
// //                   <DetailRow label="District" value={selectedFarmer.personalInfo.district || 'Not provided'} />
// //                   <DetailRow label="Taluk" value={selectedFarmer.personalInfo.taluk || 'Not provided'} />
// //                   <DetailRow label="Post" value={selectedFarmer.personalInfo.post || 'Not provided'} />
// //                 </div>
// //               </section>

// //               {/* Farm Information */}
// //               {selectedFarmer.farmLocation && (
// //                 <section className="bg-gray-50 p-4 rounded-lg">
// //                   <h3 className="text-lg font-semibold mb-3 text-gray-700">Farm Information</h3>
// //                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
// //                     <DetailRow label="Latitude" value={selectedFarmer.farmLocation.latitude || 'Not provided'} />
// //                     <DetailRow label="Longitude" value={selectedFarmer.farmLocation.longitude || 'Not provided'} />
// //                     {selectedFarmer.farmLand && (
// //                       <>
// //                         <DetailRow label="Total Land" value={selectedFarmer.farmLand.total ? `${selectedFarmer.farmLand.total} acres` : 'Not provided'} />
// //                         <DetailRow label="Cultivated Land" value={selectedFarmer.farmLand.cultivated ? `${selectedFarmer.farmLand.cultivated} acres` : 'Not provided'} />
// //                         <DetailRow label="Uncultivated Land" value={selectedFarmer.farmLand.uncultivated ? `${selectedFarmer.farmLand.uncultivated} acres` : 'Not provided'} />
// //                       </>
// //                     )}
// //                   </div>
// //                 </section>
// //               )}

// //               {/* Commodities */}
// //               {selectedFarmer.commodities && selectedFarmer.commodities.length > 0 && (
// //                 <section className="bg-gray-50 p-4 rounded-lg">
// //                   <h3 className="text-lg font-semibold mb-3 text-gray-700">Commodities</h3>
// //                   <div className="space-y-3">
// //                     <div>
// //                       <div className="text-sm font-medium text-gray-600 mb-2">Commodities:</div>
// //                       <div className="flex flex-wrap gap-2">
// //                         {getCommodityNames(selectedFarmer.commodities).map((name, index) => (
// //                           <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
// //                             {name}
// //                           </span>
// //                         ))}
// //                       </div>
// //                     </div>

// //                     {selectedFarmer.subcategories && selectedFarmer.subcategories.length > 0 && (
// //                       <div>
// //                         <div className="text-sm font-medium text-gray-600 mb-2">Subcategories:</div>
// //                         <div className="flex flex-wrap gap-2">
// //                           {getSubcategoryNames(selectedFarmer.subcategories).map((name, index) => (
// //                             <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
// //                               {name}
// //                             </span>
// //                           ))}
// //                         </div>
// //                       </div>
// //                     )}
// //                   </div>
// //                 </section>
// //               )}

// //               {/* Nearest Markets */}
// //               {selectedFarmer.nearestMarkets && selectedFarmer.nearestMarkets.length > 0 && (
// //                 <section className="bg-gray-50 p-4 rounded-lg">
// //                   <h3 className="text-lg font-semibold mb-3 text-gray-700">Nearest Markets</h3>
// //                   <div className="flex flex-wrap gap-2">
// //                     {getMarketNames(selectedFarmer.nearestMarkets).map((name, index) => (
// //                       <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
// //                         {name}
// //                       </span>
// //                     ))}
// //                   </div>
// //                 </section>
// //               )}

// //               {/* Bank Details */}
// //               {selectedFarmer.bankDetails && (
// //                 <section className="bg-gray-50 p-4 rounded-lg">
// //                   <h3 className="text-lg font-semibold mb-3 text-gray-700">Bank Details</h3>
// //                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
// //                     <DetailRow label="Account Holder" value={selectedFarmer.bankDetails.accountHolderName || 'Not provided'} />
// //                     <DetailRow label="Account Number" value={selectedFarmer.bankDetails.accountNumber || 'Not provided'} />
// //                     <DetailRow label="IFSC Code" value={selectedFarmer.bankDetails.ifscCode || 'Not provided'} />
// //                     <DetailRow label="Branch" value={selectedFarmer.bankDetails.branch || 'Not provided'} />
// //                   </div>
// //                 </section>
// //               )}

// //               {/* Documents */}
// //               {selectedFarmer.documents && (
// //                 <section className="bg-gray-50 p-4 rounded-lg">
// //                   <h3 className="text-lg font-semibold mb-3 text-gray-700">Documents</h3>
// //                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
// //                     {selectedFarmer.documents.panCard && (
// //                       <div>
// //                         <div className="text-xs text-gray-500">PAN Card:</div>
// //                         <a href={`https://kisan.etpl.ai${selectedFarmer.documents.panCard}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
// //                           View PAN Card
// //                         </a>
// //                       </div>
// //                     )}
// //                     {selectedFarmer.documents.aadharFront && (
// //                       <div>
// //                         <div className="text-xs text-gray-500">Aadhar Front:</div>
// //                         <a href={`https://kisan.etpl.ai${selectedFarmer.documents.aadharFront}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
// //                           View Aadhar Front
// //                         </a>
// //                       </div>
// //                     )}
// //                     {selectedFarmer.documents.aadharBack && (
// //                       <div>
// //                         <div className="text-xs text-gray-500">Aadhar Back:</div>
// //                         <a href={`https://kisan.etpl.ai${selectedFarmer.documents.aadharBack}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
// //                           View Aadhar Back
// //                         </a>
// //                       </div>
// //                     )}
// //                     {selectedFarmer.documents.bankPassbook && (
// //                       <div>
// //                         <div className="text-xs text-gray-500">Bank Passbook:</div>
// //                         <a href={`https://kisan.etpl.ai${selectedFarmer.documents.bankPassbook}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
// //                           View Bank Passbook
// //                         </a>
// //                       </div>
// //                     )}
// //                   </div>
// //                 </section>
// //               )}

// //               {/* Security Information */}
// //               {selectedFarmer.security && (
// //                 <section className="bg-gray-50 p-4 rounded-lg">
// //                   <h3 className="text-lg font-semibold mb-3 text-gray-700">Security Information</h3>
// //                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
// //                     <DetailRow label="Referral Code" value={selectedFarmer.security.referralCode || 'Not provided'} />
// //                     <DetailRow label="MPIN Set" value={selectedFarmer.security.mpin ? 'Yes' : 'No'} />
// //                     <DetailRow label="Password Set" value={selectedFarmer.security.password ? 'Yes' : 'No'} />
// //                   </div>
// //                 </section>
// //               )}
// //             </div>

// //             <div className="flex justify-end mt-6 p-3 pt-4 border-t">
// //               <button
// //                 onClick={() => setViewOpen(false)}
// //                 disabled={loading}
// //                 className="px-5 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
// //               >
// //                 Close
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* DELETE CONFIRMATION Dialog */}
// //       {deleteOpen && selectedFarmer && (
// //         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3">
// //           <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl">
// //             <div className="text-center">
// //               <div className="text-red-500 text-5xl mb-4">🗑️</div>
// //               <h2 className="text-xl font-semibold mb-2">Delete Farmer?</h2>
// //               <p className="text-gray-600 mb-6">
// //                 Are you sure you want to delete <span className="font-semibold">{selectedFarmer.personalInfo.name || 'this farmer'}</span>? 
// //                 This action cannot be undone.
// //               </p>
// //               <div className="flex justify-center gap-3">
// //                 <button
// //                   onClick={() => setDeleteOpen(false)}
// //                   disabled={loading}
// //                   className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
// //                 >
// //                   Cancel
// //                 </button>
// //                 <button
// //                   onClick={handleDelete}
// //                   disabled={loading}
// //                   className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
// //                 >
// //                   Delete Farmer
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* BULK DELETE CONFIRMATION Dialog */}
// //       {bulkDeleteOpen && (
// //         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3">
// //           <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl">
// //             <div className="text-center">
// //               <div className="text-red-500 text-5xl mb-4">🗑️</div>
// //               <h2 className="text-xl font-semibold mb-2">Delete {selectedFarmers.length} Farmers?</h2>
// //               <p className="text-gray-600 mb-6">
// //                 Are you sure you want to delete {selectedFarmers.length} selected farmer{selectedFarmers.length !== 1 ? 's' : ''}? 
// //                 This action cannot be undone.
// //               </p>
// //               <div className="flex justify-center gap-3">
// //                 <button
// //                   onClick={() => setBulkDeleteOpen(false)}
// //                   disabled={loading}
// //                   className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
// //                 >
// //                   Cancel
// //                 </button>
// //                 <button
// //                   onClick={handleBulkDelete}
// //                   disabled={loading}
// //                   className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
// //                 >
// //                   Delete {selectedFarmers.length} Farmers
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
//   FaUser,
//   FaCheckCircle,
//   FaClock,
//   FaTimesCircle,
//   FaSeedling,
// } from "react-icons/fa";
// import * as XLSX from "xlsx";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { Pagination, Dialog } from "@mui/material";
// import { getAdminSessionAction } from "@/app/actions/auth-actions";

// /* ================= TYPES ================= */

// interface Farmer {
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
//   role: "farmer";
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
//   subcategories?: string[];
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
//   __v?: number;
// }

// interface ApiResponse {
//   success: boolean;
//   data: Farmer[];
//   page: number;
//   limit: number;
//   total: number;
//   totalPages?: number;
//   data1: Farmer[];
// }

// interface Commodity {
//   _id: string;
//   categoryName: string;
//   categoryId: string;
//   subCategories: SubCategory[];
// }

// interface SubCategory {
//   _id: string;
//   subCategoryName: string;
//   categoryId: string;
//   subCategoryId: string;
// }

// interface Market {
//   _id: string;
//   marketId: string;
//   marketName: string;
//   pincode: string;
//   district: string;
//   state: string;
// }

// /* ================= PAGE ================= */

// export default function FarmersPage() {
//   const [farmers, setFarmers] = useState<Farmer[]>([]);
//   const [allFarmers, setAllFarmers] = useState<Farmer[]>([]); // Store all farmers for filter options
//   const [search, setSearch] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalFarmers, setTotalFarmers] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Add change state to trigger refreshes
//   const [change, setChange] = useState<number>(0);

//   const [viewOpen, setViewOpen] = useState(false);
//   const [addOpen, setAddOpen] = useState(false);
//   const [editOpen, setEditOpen] = useState(false);
//   const [deleteOpen, setDeleteOpen] = useState(false);
//   const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
//   const [cropOpen, setCropOpen] = useState(false);
//   const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);

//   // FILTER STATES
//   const [registrationStatusFilter, setRegistrationStatusFilter] = useState<string>("");
//   const [stateFilter, setStateFilter] = useState<string>("");
//   const [districtFilter, setDistrictFilter] = useState<string>("");
//   const [talukFilter, setTalukFilter] = useState<string>("");

//   // AVAILABLE FILTER OPTIONS - Will be populated from allFarmers
//   const [availableStates, setAvailableStates] = useState<string[]>([]);
//   const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);
//   const [availableTaluks, setAvailableTaluks] = useState<string[]>([]);

//   // DATA FOR DROPDOWNS
//   const [commodities, setCommodities] = useState<Commodity[]>([]);
//   const [markets, setMarkets] = useState<Market[]>([]);

//   const [selectedFarmers, setSelectedFarmers] = useState<string[]>([]);
//   const [selectAll, setSelectAll] = useState(false);
//   const [user, setUser] = useState<{
//     taluka: string;
//     role: string;
//   }>();

//   // Separate states for each document file
//   const [panCardFile, setPanCardFile] = useState<File | null>(null);
//   const [aadharFrontFile, setAadharFrontFile] = useState<File | null>(null);
//   const [aadharBackFile, setAadharBackFile] = useState<File | null>(null);
//   const [bankPassbookFile, setBankPassbookFile] = useState<File | null>(null);

//   // Fix the form state types
//   interface FormState {
//     name: string;
//     mobileNo: string;
//     email: string;
//     address: string;
//     villageGramaPanchayat: string;
//     pincode: string;
//     state: string;
//     district: string;
//     taluk: string;
//     post: string;
//     role: "farmer";
//     latitude: string;
//     longitude: string;
//     totalLand: string;
//     cultivatedLand: string;
//     uncultivatedLand: string;
//     commodities: string[];
//     nearestMarkets: string[];
//     subcategories: string[];
//     accountHolderName: string;
//     accountNumber: string;
//     ifscCode: string;
//     branch: string;
//     // Store document paths (for edit mode)
//     panCardPath: string;
//     aadharFrontPath: string;
//     aadharBackPath: string;
//     bankPassbookPath: string;
//     referralCode: string;
//     mpin: string;
//     password: string;
//     isActive: boolean;
//     registrationStatus: string;
//   }

//   const [form, setForm] = useState<FormState>({
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
//     role: "farmer",
//     latitude: "",
//     longitude: "",
//     totalLand: "",
//     cultivatedLand: "",
//     uncultivatedLand: "",
//     commodities: [],
//     nearestMarkets: [],
//     subcategories: [],
//     accountHolderName: "",
//     accountNumber: "",
//     ifscCode: "",
//     branch: "",
//     panCardPath: "",
//     aadharFrontPath: "",
//     aadharBackPath: "",
//     bankPassbookPath: "",
//     referralCode: "",
//     mpin: "",
//     password: "",
//     isActive: true,
//     registrationStatus: "pending",
//   });

//   // Crop Form State
//   const [cropForm, setCropForm] = useState({
//     farmingType: "regular",
//     seedType: "hybrid",
//     acres: "",
//     sowingDate: "",
//     farmerId: "",
//   });

//   const registrationStatusOptions = [
//     { value: "", label: "All Status" },
//     { value: "pending", label: "Pending" },
//     { value: "approved", label: "Approved" },
//     { value: "rejected", label: "Rejected" },
//     { value: "under_review", label: "Under Review" },
//   ];

//   const farmingTypeOptions = [
//     { value: "organic", label: "Organic" },
//     { value: "regular", label: "Regular" },
//     { value: "natural", label: "Natural" },
//     { value: "hydroponic", label: "Hydroponic" },
//   ];

//   const seedTypeOptions = [
//     { value: "hybrid", label: "Hybrid" },
//     { value: "naati", label: "Naati" },
//     { value: "heirloom", label: "Heirloom" },
//     { value: "gmo", label: "GMO" },
//   ];

//   // Refs to prevent duplicate calls
//   const initialLoadRef = useRef(true);
//   const isFetchingRef = useRef(false);
//   const previousFiltersRef = useRef({
//     search: "",
//     registrationStatusFilter: "",
//     stateFilter: "",
//     districtFilter: "",
//     talukFilter: "",
//     currentPage: 1,
//     rowsPerPage: 10,
//     change: 0
//   });

//   /* ================= FETCH EXTERNAL DATA ================= */

//   const fetchCommodities = useCallback(async () => {
//     try {
//       const response = await axios.get("/api/commodities");
//       if (response.data.success) {
//         setCommodities(response.data.data);
//       }
//     } catch (error: any) {
//       console.error("Error fetching commodities:", error);
//       toast.error("Failed to load commodities");
//     }
//   }, []);

//   const fetchMarkets = useCallback(async () => {
//     try {
//       const response = await axios.get("/api/markets");
//       if (response.data.success) {
//         setMarkets(response.data.data);
//       }
//     } catch (error: any) {
//       console.error("Error fetching markets:", error);
//       toast.error("Failed to load markets");
//     }
//   }, []);

//   /* ================= EXTRACT FILTER OPTIONS FROM ALL FARMERS ================= */

//   const extractFilterOptions = useCallback((farmersData: Farmer[]) => {
//     if (!farmersData || farmersData.length === 0) return;

//     // Store all farmers for filter options
//     setAllFarmers(farmersData);

//     // Extract unique states from ALL farmers (not just filtered ones)
//     const states = Array.from(
//       new Set(
//         farmersData
//           .map(f => f.personalInfo?.state)
//           .filter(Boolean)
//           .sort()
//       )
//     ) as string[];

//     setAvailableStates(states);

//     // Extract districts based on selected state (or all if no state selected)
//     let districts: string[] = [];
//     if (stateFilter) {
//       districts = Array.from(
//         new Set(
//           farmersData
//             .filter(f => f.personalInfo?.state === stateFilter)
//             .map(f => f.personalInfo?.district)
//             .filter(Boolean)
//             .sort()
//         )
//       ) as string[];
//     } else {
//       districts = Array.from(
//         new Set(
//           farmersData
//             .map(f => f.personalInfo?.district)
//             .filter(Boolean)
//             .sort()
//         )
//       ) as string[];
//     }
//     setAvailableDistricts(districts);

//     // Extract taluks based on selected state and district
//     let taluks: string[] = [];
//     if (stateFilter && districtFilter) {
//       taluks = Array.from(
//         new Set(
//           farmersData
//             .filter(f =>
//               f.personalInfo?.state === stateFilter &&
//               f.personalInfo?.district === districtFilter
//             )
//             .map(f => f.personalInfo?.taluk)
//             .filter(Boolean)
//             .sort()
//         )
//       ) as string[];
//     } else if (stateFilter) {
//       taluks = Array.from(
//         new Set(
//           farmersData
//             .filter(f => f.personalInfo?.state === stateFilter)
//             .map(f => f.personalInfo?.taluk)
//             .filter(Boolean)
//             .sort()
//         )
//       ) as string[];
//     } else if (districtFilter) {
//       taluks = Array.from(
//         new Set(
//           farmersData
//             .filter(f => f.personalInfo?.district === districtFilter)
//             .map(f => f.personalInfo?.taluk)
//             .filter(Boolean)
//             .sort()
//         )
//       ) as string[];
//     } else {
//       taluks = Array.from(
//         new Set(
//           farmersData
//             .map(f => f.personalInfo?.taluk)
//             .filter(Boolean)
//             .sort()
//         )
//       ) as string[];
//     }
//     setAvailableTaluks(taluks);
//   }, [stateFilter, districtFilter]);

//   /* ================= FETCH FARMERS ================= */

//   const fetchFarmers = useCallback(async (
//     page: number = 1,
//     searchQuery: string = "",
//     registrationStatus: string = "",
//     state: string = "",
//     district: string = "",
//     taluk: string = ""
//   ) => {
//     // Prevent multiple simultaneous calls
//     if (isFetchingRef.current) return;

//     // Check if filters have actually changed
//     const currentFilters = {
//       search: searchQuery,
//       registrationStatusFilter: registrationStatus,
//       stateFilter: state,
//       districtFilter: district,
//       talukFilter: taluk,
//       currentPage: page,
//       rowsPerPage,
//       change
//     };

//     // If no filter change and we already have data, skip fetch
//     if (
//       !initialLoadRef.current &&
//       JSON.stringify(currentFilters) === JSON.stringify(previousFiltersRef.current) &&
//       farmers.length > 0
//     ) {
//       return;
//     }

//     // Update previous filters
//     previousFiltersRef.current = currentFilters;

//     try {
//       isFetchingRef.current = true;
//       if (!initialLoadRef.current) {
//         setLoading(true);
//       }
//       setError(null);

//       const params: any = {
//         page: page.toString(),
//         limit: rowsPerPage.toString(),
//         role: "farmer",
//       };

//       if (searchQuery) {
//         params.search = searchQuery;
//       }
//       if (registrationStatus) {
//         params.registrationStatus = registrationStatus;
//       }
//       if (state) {
//         params.state = state;
//       }
//       if (district) {
//         params.district = district;
//       }

//       const session = await getAdminSessionAction();
//       setUser(session?.admin)
//       if (session?.admin?.role == "subadmin") {
//         params.taluk = session?.admin.taluka;
//       } else {
//         params.taluk = taluk;
//       }

//       const res = await axios.get<ApiResponse>(`/api/farmers`, { params });

//       if (res.data.success) {
//         const processedFarmers = res.data.data.map(farmer => ({
//           ...farmer,
//           personalInfo: farmer.personalInfo || {
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
//           role: farmer.role || "farmer",
//           isActive: farmer.isActive ?? true,
//           registrationStatus: farmer.registrationStatus || "pending",
//           commodities: farmer.commodities || [],
//           nearestMarkets: farmer.nearestMarkets || [],
//           subcategories: farmer.subcategories || []
//         }));

//         setFarmers(processedFarmers);
//         setTotalFarmers(res.data.total);
//         const calculatedTotalPages = Math.ceil(res.data.total / rowsPerPage);
//         setTotalPages(res.data.totalPages || calculatedTotalPages);
//         setCurrentPage(res.data.page);
//         setSelectedFarmers([]);
//         setSelectAll(false);

//         // Extract filter options from the complete dataset (data1)
//         if (res.data.data1 && Array.isArray(res.data.data1)) {
//           const processedFarmers2 = res.data.data1.map((farmer: any) => ({
//             ...farmer,
//             personalInfo: farmer.personalInfo || {
//               name: "",
//               mobileNo: "",
//               email: "",
//               address: "",
//               villageGramaPanchayat: "",
//               pincode: "",
//               state: "",
//               district: "",
//               taluk: "",
//               post: ""
//             }
//           }));
//           extractFilterOptions(processedFarmers2);
//         }
//       }
//     } catch (err: any) {
//       console.error('Error fetching farmers:', err);
//       setError(err.response?.data?.message || 'Failed to load farmers. Please try again.');
//       setFarmers([]);
//       toast.error(err.response?.data?.message || "Failed to load farmers");
//     } finally {
//       isFetchingRef.current = false;
//       setLoading(false);
//     }
//   }, [rowsPerPage, extractFilterOptions, change]);

//   /* ================= UPDATE REGISTRATION STATUS ================= */

//   const handleUpdateRegistrationStatus = async (farmerId: string, status: string) => {
//     try {
//       const shouldActivate = status === "approved";

//       const response = await axios.put(`/api/farmers/${farmerId}?status=true`, {
//         registrationStatus: status,
//         ...(shouldActivate && { isActive: true })
//       });

//       if (response.data.success) {
//         toast.success(`Registration status updated to ${status}${shouldActivate ? ' and account activated' : ''}`);
//         // Trigger refresh by incrementing change counter
//         setChange(prev => prev + 1);
//       }
//     } catch (error: any) {
//       console.error("Error updating registration status:", error);
//       toast.error(error.response?.data?.message || "Failed to update registration status");
//     }
//   };

//   // Main effect for fetching farmers
//   useEffect(() => {

//     const timer = setTimeout(() => {
//       fetchFarmers(
//         currentPage,
//         search,
//         registrationStatusFilter,
//         stateFilter,
//         districtFilter,
//         talukFilter
//       );
//     }, 200);

//     return () => clearTimeout(timer);
//   }, [
//     currentPage,
//     search,
//     registrationStatusFilter,
//     stateFilter,
//     districtFilter,
//     talukFilter,
//     rowsPerPage,
//     change,
//     fetchFarmers
//   ]);



//   useEffect(() => {
//     fetchCommodities(),
//       fetchMarkets()
//   }, [change])

//   // Update filter options when state or district changes
//   useEffect(() => {
//     if (allFarmers.length === 0) return;

//     // When state changes, update districts and reset dependent filters
//     const handleStateChange = () => {
//       let districts: string[] = [];
//       if (stateFilter) {
//         districts = Array.from(
//           new Set(
//             allFarmers
//               .filter(f => f.personalInfo?.state === stateFilter)
//               .map(f => f.personalInfo?.district)
//               .filter(Boolean)
//               .sort()
//           )
//         ) as string[];
//       } else {
//         districts = Array.from(
//           new Set(
//             allFarmers
//               .map(f => f.personalInfo?.district)
//               .filter(Boolean)
//               .sort()
//           )
//         ) as string[];
//       }

//       setAvailableDistricts(districts);

//       // Reset district filter if selected district is not in the new list
//       if (districtFilter && !districts.includes(districtFilter)) {
//         setDistrictFilter("");
//       }
//     };

//     // When district changes, update taluks and reset taluk filter
//     const handleDistrictChange = () => {
//       let taluks: string[] = [];
//       if (stateFilter && districtFilter) {
//         taluks = Array.from(
//           new Set(
//             allFarmers
//               .filter(f =>
//                 f.personalInfo?.state === stateFilter &&
//                 f.personalInfo?.district === districtFilter
//               )
//               .map(f => f.personalInfo?.taluk)
//               .filter(Boolean)
//               .sort()
//           )
//         ) as string[];
//       } else if (stateFilter) {
//         taluks = Array.from(
//           new Set(
//             allFarmers
//               .filter(f => f.personalInfo?.state === stateFilter)
//               .map(f => f.personalInfo?.taluk)
//               .filter(Boolean)
//               .sort()
//           )
//         ) as string[];
//       } else if (districtFilter) {
//         taluks = Array.from(
//           new Set(
//             allFarmers
//               .filter(f => f.personalInfo?.district === districtFilter)
//               .map(f => f.personalInfo?.taluk)
//               .filter(Boolean)
//               .sort()
//           )
//         ) as string[];
//       } else {
//         taluks = Array.from(
//           new Set(
//             allFarmers
//               .map(f => f.personalInfo?.taluk)
//               .filter(Boolean)
//               .sort()
//           )
//         ) as string[];
//       }

//       setAvailableTaluks(taluks);

//       // Reset taluk filter if selected taluk is not in the new list
//       if (talukFilter && !taluks.includes(talukFilter)) {
//         setTalukFilter("");
//       }
//     };

//     handleStateChange();
//     handleDistrictChange();
//   }, [stateFilter, districtFilter, allFarmers, talukFilter]);

//   /* ================= SELECTION HANDLERS ================= */

//   const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.checked) {
//       const allFarmerIds = farmers.map(farmer => farmer._id);
//       setSelectedFarmers(allFarmerIds);
//       setSelectAll(true);
//     } else {
//       setSelectedFarmers([]);
//       setSelectAll(false);
//     }
//   };

//   const handleSelectOne = (id: string, checked: boolean) => {
//     if (checked) {
//       setSelectedFarmers([...selectedFarmers, id]);
//     } else {
//       setSelectedFarmers(selectedFarmers.filter(farmerId => farmerId !== id));
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
//     } else if (type === 'checkbox' && name === 'nearestMarkets') {
//       const marketId = value;
//       setForm(prev => ({
//         ...prev,
//         nearestMarkets: prev.nearestMarkets.includes(marketId)
//           ? prev.nearestMarkets.filter(id => id !== marketId)
//           : [...prev.nearestMarkets, marketId]
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

//   const handleCommodityChange = (commodityId: string, isChecked: boolean) => {
//     setForm(prev => ({
//       ...prev,
//       commodities: isChecked
//         ? [...prev.commodities, commodityId]
//         : prev.commodities.filter(id => id !== commodityId)
//     }));

//     // Clear subcategories for this commodity if unchecked
//     if (!isChecked) {
//       const commodity = commodities.find(c => c._id === commodityId);
//       if (commodity) {
//         const subcatIds = commodity.subCategories.map(sc => sc._id);
//         setForm(prev => ({
//           ...prev,
//           subcategories: prev.subcategories.filter(id => !subcatIds.includes(id))
//         }));
//       }
//     }
//   };

//   const handleSubcategoryChange = (subcategoryId: string, commodityId: string, isChecked: boolean) => {
//     setForm(prev => ({
//       ...prev,
//       subcategories: isChecked
//         ? [...prev.subcategories, subcategoryId]
//         : prev.subcategories.filter(id => id !== subcategoryId)
//     }));
//   };

//   const handleCropChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setCropForm(prev => ({
//       ...prev,
//       [name]: value,
//     }));
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

//   // SEPARATE HANDLERS FOR EACH FILE INPUT - Using separate states
//   const handlePanCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (files && files[0]) {
//       const file = files[0];

//       // Check file size (limit to 5MB)
//       const maxSize = 5 * 1024 * 1024;
//       if (file.size > maxSize) {
//         toast.error("PAN Card file is too large. Maximum size is 5MB.");
//         e.target.value = '';
//         return;
//       }

//       // Check file type
//       const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
//       if (!allowedTypes.includes(file.type)) {
//         toast.error("PAN Card file type not supported. Please upload JPEG, PNG, or PDF files.");
//         e.target.value = '';
//         return;
//       }

//       setPanCardFile(file);
//       toast.success(`PAN Card file selected: ${file.name}`);
//     }
//   };

//   const handleAadharFrontChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (files && files[0]) {
//       const file = files[0];

//       const maxSize = 5 * 1024 * 1024;
//       if (file.size > maxSize) {
//         toast.error("Aadhar Front file is too large. Maximum size is 5MB.");
//         e.target.value = '';
//         return;
//       }

//       const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
//       if (!allowedTypes.includes(file.type)) {
//         toast.error("Aadhar Front file type not supported. Please upload JPEG, PNG, or PDF files.");
//         e.target.value = '';
//         return;
//       }

//       setAadharFrontFile(file);
//       toast.success(`Aadhar Front file selected: ${file.name}`);
//     }
//   };

//   const handleAadharBackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (files && files[0]) {
//       const file = files[0];

//       const maxSize = 5 * 1024 * 1024;
//       if (file.size > maxSize) {
//         toast.error("Aadhar Back file is too large. Maximum size is 5MB.");
//         e.target.value = '';
//         return;
//       }

//       const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
//       if (!allowedTypes.includes(file.type)) {
//         toast.error("Aadhar Back file type not supported. Please upload JPEG, PNG, or PDF files.");
//         e.target.value = '';
//         return;
//       }

//       setAadharBackFile(file);
//       toast.success(`Aadhar Back file selected: ${file.name}`);
//     }
//   };

//   const handleBankPassbookChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (files && files[0]) {
//       const file = files[0];

//       const maxSize = 5 * 1024 * 1024;
//       if (file.size > maxSize) {
//         toast.error("Bank Passbook file is too large. Maximum size is 5MB.");
//         e.target.value = '';
//         return;
//       }

//       const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
//       if (!allowedTypes.includes(file.type)) {
//         toast.error("Bank Passbook file type not supported. Please upload JPEG, PNG, or PDF files.");
//         e.target.value = '';
//         return;
//       }

//       setBankPassbookFile(file);
//       toast.success(`Bank Passbook file selected: ${file.name}`);
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
//       role: "farmer",
//       latitude: "",
//       longitude: "",
//       totalLand: "",
//       cultivatedLand: "",
//       uncultivatedLand: "",
//       commodities: [],
//       nearestMarkets: [],
//       subcategories: [],
//       accountHolderName: "",
//       accountNumber: "",
//       ifscCode: "",
//       branch: "",
//       panCardPath: "",
//       aadharFrontPath: "",
//       aadharBackPath: "",
//       bankPassbookPath: "",
//       referralCode: "",
//       mpin: "",
//       password: "",
//       isActive: true,
//       registrationStatus: "pending",
//     });
//     // Reset file states
//     setPanCardFile(null);
//     setAadharFrontFile(null);
//     setAadharBackFile(null);
//     setBankPassbookFile(null);
//   };

//   const resetCropForm = () => {
//     setCropForm({
//       farmingType: "regular",
//       seedType: "hybrid",
//       acres: "",
//       sowingDate: "",
//       farmerId: "",
//     });
//   };

//   const populateFormForEdit = (farmer: Farmer) => {
//     const personalInfo = farmer.personalInfo;
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
//       role: farmer.role || "farmer",
//       latitude: farmer.farmLocation?.latitude || "",
//       longitude: farmer.farmLocation?.longitude || "",
//       totalLand: farmer.farmLand?.total?.toString() || "",
//       cultivatedLand: farmer.farmLand?.cultivated?.toString() || "",
//       uncultivatedLand: farmer.farmLand?.uncultivated?.toString() || "",
//       commodities: farmer.commodities || [],
//       nearestMarkets: farmer.nearestMarkets || [],
//       subcategories: farmer.subcategories || [],
//       accountHolderName: farmer.bankDetails?.accountHolderName || "",
//       accountNumber: farmer.bankDetails?.accountNumber || "",
//       ifscCode: farmer.bankDetails?.ifscCode || "",
//       branch: farmer.bankDetails?.branch || "",
//       panCardPath: farmer.documents?.panCard || "",
//       aadharFrontPath: farmer.documents?.aadharFront || "",
//       aadharBackPath: farmer.documents?.aadharBack || "",
//       bankPassbookPath: farmer.documents?.bankPassbook || "",
//       referralCode: farmer.security?.referralCode || "",
//       mpin: "",
//       password: "",
//       isActive: farmer.isActive ?? true,
//       registrationStatus: farmer.registrationStatus || "pending",
//     });
//     // Reset file states for edit
//     setPanCardFile(null);
//     setAadharFrontFile(null);
//     setAadharBackFile(null);
//     setBankPassbookFile(null);
//     setSelectedFarmer(farmer);
//     setEditOpen(true);
//   };

//   const openCropForm = (farmer: Farmer) => {
//     setSelectedFarmer(farmer);
//     setCropForm({
//       farmingType: "regular",
//       seedType: "hybrid",
//       acres: "",
//       sowingDate: "",
//       farmerId: farmer._id,
//     });
//     setCropOpen(true);
//   };

//   /* ================= CRUD OPERATIONS ================= */

//   // ... rest of the code remains the same until handleAdd function ...

//   const handleAdd = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // Validation
//     if (!form.name || !form.mobileNo) {
//       toast.error("Name and Mobile Number are required");
//       return;
//     }

//     if (form.mobileNo.length !== 10) {
//       toast.error("Mobile number must be 10 digits");
//       return;
//     }

//     // Validate commodities and markets are not empty
//     if (form.commodities.length === 0) {
//       toast.error("Please select at least one commodity");
//       return;
//     }

//     if (form.nearestMarkets.length === 0) {
//       toast.error("Please select at least one market");
//       return;
//     }

//     try {
//       setLoading(true);

//       // Prepare form data
//       const formData = new FormData();

//       // Personal Info
//       const personalInfo = {
//         name: form.name || '',
//         mobileNo: form.mobileNo || '',
//         email: form.email || '',
//         address: form.address || '',
//         villageGramaPanchayat: form.villageGramaPanchayat || '',
//         pincode: form.pincode || '',
//         state: form.state || '',
//         district: form.district || '',
//         taluk: form.taluk || '',
//         post: form.post || '',
//       };

//       formData.append('personalInfo', JSON.stringify(personalInfo));

//       // Farm Location
//       const farmLocation = {
//         latitude: form.latitude || "",
//         longitude: form.longitude || "",
//       };

//       formData.append('farmLocation', JSON.stringify(farmLocation));

//       // Farm Land
//       const farmLand = {
//         total: form.totalLand || "",
//         cultivated: form.cultivatedLand || "",
//         uncultivated: form.uncultivatedLand || "",
//       };

//       formData.append('farmLand', JSON.stringify(farmLand));

//       // Commodities and Markets
//       formData.append('commodities', JSON.stringify(form.commodities));
//       formData.append('nearestMarkets', JSON.stringify(form.nearestMarkets));

//       // Subcategories if selected
//       if (form.subcategories.length > 0) {
//         formData.append('subcategories', JSON.stringify(form.subcategories));
//       }

//       // Bank Details
//       const bankDetails = {
//         accountHolderName: form.accountHolderName || '',
//         accountNumber: form.accountNumber || '',
//         ifscCode: form.ifscCode || '',
//         branch: form.branch || '',
//       };

//       formData.append('bankDetails', JSON.stringify(bankDetails));

//       // Role
//       formData.append('role', 'farmer');

//       // Security
//       const security = {
//         referralCode: form.referralCode || '',
//         mpin: form.mpin || '',
//         password: form.password || '',
//       };

//       formData.append('security', JSON.stringify(security));

//       // Append files from separate file states
//       // IMPORTANT: Use the exact field names expected by the backend
//       if (panCardFile) {
//         formData.append('panCard', panCardFile);
//         console.log("✅ Appending PAN Card file:", panCardFile.name);
//       }

//       if (aadharFrontFile) {
//         formData.append('aadharFront', aadharFrontFile);
//         console.log("✅ Appending Aadhar Front file:", aadharFrontFile.name);
//       }

//       if (aadharBackFile) {
//         formData.append('aadharBack', aadharBackFile);
//         console.log("✅ Appending Aadhar Back file:", aadharBackFile.name);
//       }

//       if (bankPassbookFile) {
//         formData.append('bankPassbook', bankPassbookFile);
//         console.log("✅ Appending Bank Passbook file:", bankPassbookFile.name);
//       }

//       // Other fields
//       formData.append('isActive', form.isActive.toString());
//       formData.append('registrationStatus', form.registrationStatus);

//       // Debug: Log what we're sending
//       console.log("=== FORM DATA BEING SENT ===");
//       console.log("Separate file states:");
//       console.log("- panCardFile:", panCardFile?.name || "None");
//       console.log("- aadharFrontFile:", aadharFrontFile?.name || "None");
//       console.log("- aadharBackFile:", aadharBackFile?.name || "None");
//       console.log("- bankPassbookFile:", bankPassbookFile?.name || "None");

//       const formEntries = Array.from(formData.entries());
//       console.log("Total form entries:", formEntries.length);

//       // Log all form data entries
//       for (let [key, value] of formEntries) {
//         if (value instanceof File) {
//           console.log(`${key}: File - ${value.name} (${value.type}, ${value.size} bytes)`);
//         } else if (typeof value === 'string' && value.length > 100) {
//           try {
//             const parsed = JSON.parse(value);
//             console.log(`${key}:`, parsed);
//           } catch {
//             console.log(`${key}: ${value.substring(0, 100)}...`);
//           }
//         } else {
//           console.log(`${key}: ${value}`);
//         }
//       }

//       // Log specifically how many files are being sent
//       const filesCount = formEntries.filter(([_, value]) => value instanceof File).length;
//       console.log(`Total files being sent: ${filesCount}`);

//       try {
//         console.log("Attempting to register farmer...");

//         // First, let's check what the backend expects by making a test call
//         const testFormData = new FormData();
//         if (panCardFile) testFormData.append('panCard', panCardFile);
//         if (aadharFrontFile) testFormData.append('aadharFront', aadharFrontFile);
//         if (aadharBackFile) testFormData.append('aadharBack', aadharBackFile);
//         if (bankPassbookFile) testFormData.append('bankPassbook', bankPassbookFile);

//         const testFiles = Array.from(testFormData.entries())
//           .filter(([_, value]) => value instanceof File)
//           .map(([key, value]) => ({ key, file: (value as File).name }));

//         console.log("Files being sent with field names:", testFiles);

//         // Make the actual request
//         const res = await axios.post("https://kisan.etpl.ai/farmer/register", formData, {
//           headers: {
//             'Content-Type': 'multipart/form-data'
//           },
//           timeout: 30000,
//         });

//         console.log("✅ Registration successful:", res.data);
//         if (res.data.success) {
//           toast.success("Farmer registered successfully!");
//           setAddOpen(false);
//           resetForm();

//           // 🔹 GET LOGGED-IN USER
//           const session = await getAdminSessionAction();
//           const admin = session?.admin;

//           // 🔹 NEW FARMER ID (depends on API response)
//           const createdFarmerId =
//             res.data?.data?._id ||
//             res.data?.farmer?._id ||
//             res.data?.farmerId ||
//             "unknown";

//           // 🔹 AUDIT LOG PAYLOAD
//           // const auditLogPayload = {
//           //   actorId: admin?._id,
//           //   actorRole: admin?.role, // "admin" or "subadmin"
//           //   action: "CREATE",
//           //   module: "FARMER",
//           //   targetId: createdFarmerId,
//           //   description: `Farmer created by ${admin?.name} (${admin?.role})`,
//           //   changes: {
//           //     "personalInfo.name": {
//           //       old: "N/A",
//           //       new: form.name,
//           //     },
//           //     "personalInfo.mobileNo": {
//           //       old: "N/A",
//           //       new: form.mobileNo,
//           //     },
//           //     "personalInfo.taluk": {
//           //       old: "N/A",
//           //       new: form.taluk,
//           //     },
//           //   },
//           // };

//           const auditLogPayload = {
//             actorId: admin?._id,
//             actorRole: admin?.role, // admin | subadmin
//             action: "CREATE",
//             module: "FARMER",
//             targetId: createdFarmerId,
//             description: `New farmer registered by ${admin?.name} (${admin?.role})`,
//             changes: {
//               farmer: {
//                 name: res.data.name,
//                 mobileNo: res.data.mobileNo,
//                 taluk: res.data.taluk,
//                 district: res.data.district,
//                 state: res.data.state,
//                 registrationStatus: res.data.registrationStatus,
//                 isActive: res.data.isActive,
//                 commodities: res.data.commodities,
//                 nearestMarkets: res.data.nearestMarkets,
//               }
//             }
//           };

//           // 🔹 SEND AUDIT LOG
//           try {
//             await axios.post("/api/audit-logs", auditLogPayload);
//           } catch (auditErr) {
//             console.error("Audit log failed:", auditErr);
//           }

//           // 🔹 REFRESH
//           setChange(prev => prev + 1);

//           await fetchFarmers(
//             currentPage,
//             search,
//             registrationStatusFilter,
//             stateFilter,
//             districtFilter,
//             talukFilter
//           );
//         }
//         else {
//           toast.error(res.data.message || "Registration failed");
//         }
//       } catch (err: any) {
//         console.error("❌ Registration error:", err);

//         // Enhanced error logging
//         if (err.response) {
//           console.error("Response error:", err.response.data);
//           console.error("Response status:", err.response.status);
//           console.error("Response headers:", err.response.headers);

//           if (err.response.data?.message) {
//             toast.error(`Server Error: ${err.response.data.message}`);
//           } else if (err.response.data?.error) {
//             toast.error(`Error: ${err.response.data.error}`);
//           } else if (err.response.data?.errors) {
//             // Handle validation errors
//             const errors = err.response.data.errors;
//             const errorMessages = Object.values(errors).flat().join(', ');
//             toast.error(`Validation errors: ${errorMessages}`);
//           } else {
//             toast.error(`Server responded with status: ${err.response.status}`);
//           }
//         } else if (err.request) {
//           console.error("Request error:", err.request);
//           toast.error("No response received from server. Please check your connection.");
//         } else if (err.message.includes("MulterError") || err.message.includes("Unexpected field")) {
//           toast.error("File upload error. Please check file field names. Backend expects: panCard, aadharFront, aadharBack, bankPassbook");
//         } else {
//           toast.error("Registration failed. Please try again.");
//         }
//       }
//     } catch (err: any) {
//       console.error("Unexpected error:", err);
//       toast.error("An unexpected error occurred");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ... rest of the code remains the same ...

//   const handleEdit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!selectedFarmer) return;

//     try {
//       setLoading(true);

//       const farmerData: any = {
//         personalInfo: {
//           name: form.name,
//           mobileNo: form.mobileNo,
//           email: form.email || "",
//           address: form.address || "",
//           villageGramaPanchayat: form.villageGramaPanchayat || "",
//           pincode: form.pincode || "",
//           state: form.state || "",
//           district: form.district || "",
//           taluk: form.taluk || "",
//           post: form.post || "",
//         },
//         role: "farmer",
//         farmLocation: {
//           latitude: form.latitude || "",
//           longitude: form.longitude || "",
//         },
//         commodities: form.commodities,
//         nearestMarkets: form.nearestMarkets,
//         subcategories: form.subcategories,
//         isActive: form.isActive,
//         registrationStatus: form.registrationStatus,
//       };

//       // Add farmLand only if any value exists
//       if (form.totalLand || form.cultivatedLand || form.uncultivatedLand) {
//         farmerData.farmLand = {
//           total: form.totalLand ? Number(form.totalLand) : null,
//           cultivated: form.cultivatedLand ? Number(form.cultivatedLand) : null,
//           uncultivated: form.uncultivatedLand ? Number(form.uncultivatedLand) : null,
//         };
//       }

//       // Add bankDetails only if any value exists
//       if (form.accountHolderName || form.accountNumber || form.ifscCode || form.branch) {
//         farmerData.bankDetails = {
//           accountHolderName: form.accountHolderName || "",
//           accountNumber: form.accountNumber || "",
//           ifscCode: form.ifscCode || "",
//           branch: form.branch || "",
//         };
//       }

//       // Add security only if any value exists
//       if (form.referralCode || form.mpin || form.password) {
//         farmerData.security = {
//           ...(form.referralCode && { referralCode: form.referralCode }),
//           ...(form.mpin && { mpin: form.mpin }),
//           ...(form.password && { password: form.password }),
//         };
//       }

//       console.log("Sending update data:", farmerData); // Debug log

//       const res = await axios.put(`/api/farmers/${selectedFarmer._id}`, farmerData);

//       if (res.data.success) {
//         toast.success("Farmer updated successfully!");
//         setEditOpen(false);
//         resetForm();
//         setSelectedFarmer(null);
//         // Trigger refresh by incrementing change counter
//         setChange(prev => prev + 1);
//       } else {
//         toast.error(res.data.message || "Failed to update farmer");
//       }
//     } catch (err: any) {
//       console.error("Error updating farmer:", err.response?.data || err);
//       toast.error(err.response?.data?.message || "Failed to update farmer");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddCrop = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!selectedFarmer) return;

//     try {
//       setLoading(true);

//       if (!cropForm.acres || !cropForm.sowingDate) {
//         toast.error("Please fill all required fields");
//         return;
//       }

//       const cropData = {
//         farmingType: cropForm.farmingType,
//         seedType: cropForm.seedType,
//         acres: Number(cropForm.acres),
//         sowingDate: cropForm.sowingDate,
//         farmerId: selectedFarmer.farmerId || selectedFarmer._id,
//       };

//       const res = await axios.post("/api/postings", cropData);

//       if (res.data.success) {
//         toast.success("Crop added successfully with tracking!");
//         setCropOpen(false);
//         resetCropForm();
//         setSelectedFarmer(null);

//         if (res.data.tracking) {
//           toast.success(`Tracking created with ${res.data.tracking.stages?.length || 7} stages`);
//         }
//       }
//     } catch (err: any) {
//       console.error("Error adding crop:", err);
//       toast.error(err.response?.data?.message || "Failed to add crop");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async () => {
//     if (!selectedFarmer) return;

//     try {
//       setLoading(true);

//       await axios.delete(`/api/farmers/${selectedFarmer._id}`);
//       toast.success("Farmer deleted successfully!");
//       setDeleteOpen(false);
//       setSelectedFarmer(null);
//       // Trigger refresh by incrementing change counter
//       setChange(prev => prev + 1);
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || "Failed to delete farmer. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBulkDelete = async () => {
//     if (selectedFarmers.length === 0) {
//       toast.error("No farmers selected");
//       return;
//     }

//     try {
//       setLoading(true);

//       const response = await axios.post("/api/farmers/bulk-delete", {
//         ids: selectedFarmers
//       });

//       if (response.data.success) {
//         toast.success(response.data.message || `${selectedFarmers.length} farmers deleted successfully!`);
//         setSelectedFarmers([]);
//         setSelectAll(false);
//         setBulkDeleteOpen(false);
//         // Trigger refresh by incrementing change counter
//         setChange(prev => prev + 1);
//       } else {
//         toast.error("Failed to delete farmers");
//       }
//     } catch (error: any) {
//       toast.error("Error deleting farmers");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= GET COMMODITY AND MARKET NAMES ================= */

//   const getCommodityNames = (commodityIds: string[] = []) => {
//     return commodityIds.map(id => {
//       const commodity = commodities.find(c => c._id === id);
//       return commodity ? commodity.categoryName : id;
//     });
//   };

//   const getMarketNames = (marketIds: string[] = []) => {
//     return marketIds.map(id => {
//       const market = markets.find(m => m._id === id);
//       return market ? `${market.marketName}, ${market.district}` : id;
//     });
//   };

//   const getSubcategoryNames = (subcategoryIds: string[] = []) => {
//     const allSubcategories = commodities.flatMap(c => c.subCategories);
//     return subcategoryIds.map(id => {
//       const subcat = allSubcategories.find(sc => sc._id === id);
//       return subcat ? subcat.subCategoryName : id;
//     });
//   };

//   /* ================= EXPORT FUNCTIONS ================= */

//   const exportData = farmers.map((farmer, index) => {
//     const personalInfo = farmer.personalInfo;
//     return {
//       "Sr.": index + 1 + (currentPage - 1) * rowsPerPage,
//       "Name": personalInfo.name || 'N/A',
//       "Mobile": personalInfo.mobileNo || 'N/A',
//       "Email": personalInfo.email || 'N/A',
//       "Role": farmer.role || 'N/A',
//       "Village": personalInfo.villageGramaPanchayat || 'N/A',
//       "District": personalInfo.district || 'N/A',
//       "State": personalInfo.state || 'N/A',
//       "Address": personalInfo.address || 'N/A',
//       "Taluk": personalInfo.taluk || 'N/A',
//       "Post": personalInfo.post || 'N/A',
//       "Pincode": personalInfo.pincode || 'N/A',
//       "Registration Status": farmer.registrationStatus || 'N/A',
//       "Status": farmer.isActive ? "Active" : "Inactive",
//       "Registered": farmer.registeredAt ? new Date(farmer.registeredAt).toLocaleDateString() : 'N/A',
//     };
//   });

//   const handlePrint = () => {
//     if (farmers.length === 0) {
//       toast.error("No farmers to print");
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
//         <title>Farmers Report</title>
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
//           <h1>👨‍🌾 Farmers Management Report</h1>
//           <div class="header-info">Generated on: ${printDate} at ${printTime}</div>
//           <div class="header-info">Total Farmers: ${totalFarmers} | Showing: ${farmers.length} farmers</div>
//           <div class="header-info">Page: ${currentPage} of ${totalPages}</div>
//         </div>
        
//         <table>
//           <thead>
//             <tr>
//               <th>Sr.</th>
//               <th>Name</th>
//               <th>Mobile</th>
//               <th>Email</th>
//               <th>Village</th>
//               <th>District</th>
//               <th>State</th>
//               <th>Reg. Status</th>
//               <th>Status</th>
//               <th>Registered Date</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${farmers.map((farmer, index) => {
//       const personalInfo = farmer.personalInfo;
//       return `
//                 <tr>
//                   <td>${index + 1 + (currentPage - 1) * rowsPerPage}</td>
//                   <td><strong>${personalInfo.name || 'N/A'}</strong></td>
//                   <td>${personalInfo.mobileNo || 'N/A'}</td>
//                   <td>${personalInfo.email || 'N/A'}</td>
//                   <td>${personalInfo.villageGramaPanchayat || 'N/A'}</td>
//                   <td>${personalInfo.district || 'N/A'}</td>
//                   <td>${personalInfo.state || 'N/A'}</td>
//                   <td>${farmer.registrationStatus || 'N/A'}</td>
//                   <td>${farmer.isActive ? 'Active' : 'Inactive'}</td>
//                   <td>${farmer.registeredAt ? new Date(farmer.registeredAt).toLocaleDateString() : 'N/A'}</td>
//                 </tr>
//               `;
//     }).join('')}
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
//     if (farmers.length === 0) {
//       toast.error("No farmers to copy");
//       return;
//     }

//     const headers = ["Sr.", "Name", "Mobile", "Email", "Village", "District", "State", "Reg. Status", "Status", "Registered"];

//     const colWidths = [6, 20, 15, 25, 15, 15, 15, 15, 12, 12];

//     const formatRow = (data: any, isHeader = false): string => {
//       const values = isHeader ? headers : [
//         data["Sr."] || "",
//         data.Name || "",
//         data.Mobile || "",
//         data.Email || "",
//         data.Village || "",
//         data.District || "",
//         data.State || "",
//         data["Registration Status"] || "",
//         data.Status || "",
//         data.Registered || ""
//       ];

//       return values.map((val: string, i: number) =>
//         String(val).padEnd(colWidths[i])
//       ).join(" | ");
//     };

//     const text = [
//       formatRow(headers, true),
//       "-".repeat(150),
//       ...exportData.map((f: any) => formatRow(f, false)),
//       "",
//       `TOTAL: ${farmers.length} farmers`,
//       `EXPORTED: ${new Date().toLocaleString()}`
//     ].join("\n");

//     try {
//       await navigator.clipboard.writeText(text);
//       toast.success("Farmers table copied to clipboard!");
//     } catch (err) {
//       toast.error("Failed to copy to clipboard");
//     }
//   };

//   const handleExcel = () => {
//     if (farmers.length === 0) {
//       toast.error("No farmers to export");
//       return;
//     }

//     try {
//       const ws = XLSX.utils.json_to_sheet(exportData);
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, "Farmers");
//       XLSX.writeFile(wb, `farmers-${new Date().toISOString().split('T')[0]}.xlsx`);
//       toast.success("Excel file exported successfully!");
//     } catch (err) {
//       toast.error("Failed to export Excel file");
//     }
//   };

//   const handleCSV = () => {
//     if (farmers.length === 0) {
//       toast.error("No farmers to export");
//       return;
//     }

//     try {
//       const ws = XLSX.utils.json_to_sheet(exportData);
//       const csv = XLSX.utils.sheet_to_csv(ws);
//       const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//       const a = document.createElement("a");
//       a.href = URL.createObjectURL(blob);
//       a.download = `farmers-${new Date().toISOString().split('T')[0]}.csv`;
//       a.click();
//       toast.success("CSV file exported successfully!");
//     } catch (err) {
//       toast.error("Failed to export CSV file");
//     }
//   };

//   const handlePDF = () => {
//     if (farmers.length === 0) {
//       toast.error("No farmers to export");
//       return;
//     }

//     try {
//       const doc = new jsPDF();
//       doc.text("Farmers Management Report", 14, 16);

//       const tableColumn = ["Sr.", "Name", "Mobile", "Email", "Village", "District", "State", "Reg. Status", "Status"];
//       const tableRows: any = exportData.map(f => [
//         f["Sr."],
//         f.Name,
//         f.Mobile,
//         f.Email,
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

//       doc.save(`farmers-${new Date().toISOString().split('T')[0]}.pdf`);
//       toast.success("PDF file exported successfully!");
//     } catch (err) {
//       toast.error("Failed to export PDF file");
//     }
//   };

//   /* ================= RESET FILTERS ================= */

//   const handleResetFilters = () => {
//     setSearch("");
//     setCurrentPage(1);
//     setRegistrationStatusFilter("");
//     setStateFilter("");
//     setDistrictFilter("");
//     setTalukFilter("");
//     setSelectedFarmers([]);
//     setSelectAll(false);
//     // Also trigger a refresh
//     setChange(prev => prev + 1);
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

//   const getRoleBadge = () => {
//     return "bg-blue-100 text-blue-800";
//   };

//   const getRoleIcon = () => {
//     return <FaUser className="inline mr-1" />;
//   };

//   /* ================= UI ================= */

//   return (
//     <div className="min-h-screen xl:w-[83vw] lg:w-[77vw] overflow-x-scroll bg-gray-50 p-2">
//       {/* Loading Overlay */}
//       {loading && (
//         <div className="fixed inset-0 bg-[#e9e7e72f] z-[100] flex items-center justify-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
//         </div>
//       )}

//       {/* Header Section */}
//       <div className="mb-4 flex gap-y-2 flex-wrap justify-between items-center">
//         <div>
//           <h1 className="text-2xl md:text-2xl font-bold text-gray-800">Farmers Management</h1>
//           <p className="text-gray-600 mt-2">
//             Overview and detailed management of all registered farmers. {totalFarmers} farmers found.
//           </p>
//         </div>
//         <button
//           onClick={() => setAddOpen(true)}
//           disabled={loading}
//           className="bg-green-500 p-2 px-4 text-white rounded shadow-2xl cursor-pointer flex items-center gap-2 hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           <FaPlus /> Add Farmer
//         </button>
//       </div>

//       {/* Add New Farmer Dialog */}
//       <Dialog open={addOpen} onClose={() => { setAddOpen(false); resetForm(); }} maxWidth="lg" fullWidth>
//         <div className="p-6 max-h-[90vh] overflow-y-auto relative">
//           <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Farmer</h2>
//           <button type="button" className="absolute top-3 right-5 cursor-pointer text-red-400" onClick={() => {
//             setAddOpen(false); resetForm();
//           }}>X</button>
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
//                   <input
//                     type="tel"
//                     name="mobileNo"
//                     value={form.mobileNo}
//                     onChange={(e) => {
//                       const value = e.target.value.replace(/\D/g, "");
//                       if (value.length <= 10) {
//                         setForm({ ...form, mobileNo: value });
//                       }
//                     }}
//                     required
//                     inputMode="numeric"
//                     className="input-field"
//                     placeholder="Enter mobile number"
//                   />
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

//             {/* FARM INFORMATION */}
//             <section className="bg-gray-50 p-6 rounded-lg">
//               <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Farm Location</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">Latitude</label>
//                   <input name="latitude" value={form.latitude} onChange={handleChange} className="input-field" placeholder="Enter latitude" />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">Longitude</label>
//                   <input name="longitude" value={form.longitude} onChange={handleChange} className="input-field" placeholder="Enter longitude" />
//                 </div>
//               </div>
//             </section>

//             <section className="bg-gray-50 p-6 rounded-lg">
//               <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Farm Land Details</h3>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">Total Land (acres)</label>
//                   <input name="totalLand" value={form.totalLand} onChange={handleChange} className="input-field" placeholder="Total land area" type="number" />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">Cultivated Land (acres)</label>
//                   <input name="cultivatedLand" value={form.cultivatedLand} onChange={handleChange} className="input-field" placeholder="Cultivated land area" type="number" />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">Uncultivated Land (acres)</label>
//                   <input name="uncultivatedLand" value={form.uncultivatedLand} onChange={handleChange} className="input-field" placeholder="Uncultivated land area" type="number" />
//                 </div>
//               </div>
//             </section>

//             {/* COMMODITIES */}
//             <section className="bg-gray-50 p-6 rounded-lg">
//               <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Commodities</h3>
//               <div className="space-y-4">
//                 <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                   {commodities.map(commodity => (
//                     <label key={commodity._id} className="flex items-center space-x-2 cursor-pointer p-2 bg-white rounded border hover:bg-gray-50">
//                       <input
//                         type="checkbox"
//                         checked={form.commodities.includes(commodity._id)}
//                         onChange={(e) => handleCommodityChange(commodity._id, e.target.checked)}
//                         className="h-4 w-4 text-green-600"
//                       />
//                       <span className="text-gray-700">{commodity.categoryName}</span>
//                     </label>
//                   ))}
//                 </div>

//                 {/* Subcategories for selected commodities */}
//                 {form.commodities.length > 0 && (
//                   <div className="mt-4">
//                     <h4 className="text-lg font-semibold mb-3 text-gray-600">Subcategories</h4>
//                     <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                       {form.commodities.map(commodityId => {
//                         const commodity = commodities.find(c => c._id === commodityId);
//                         if (!commodity || !commodity.subCategories.length) return null;

//                         return (
//                           <div key={commodity._id} className="mb-4">
//                             <h5 className="font-medium text-gray-700 mb-2">{commodity.categoryName}:</h5>
//                             <div className="space-y-2 ml-4">
//                               {commodity.subCategories.map(subcat => (
//                                 <label key={subcat._id} className="flex items-center space-x-2 cursor-pointer">
//                                   <input
//                                     type="checkbox"
//                                     checked={form.subcategories.includes(subcat._id)}
//                                     onChange={(e) => handleSubcategoryChange(subcat._id, commodity._id, e.target.checked)}
//                                     className="h-4 w-4 text-blue-600"
//                                   />
//                                   <span className="text-gray-600 text-sm">{subcat.subCategoryName}</span>
//                                 </label>
//                               ))}
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </section>

//             {/* NEAREST MARKETS */}
//             <section className="bg-gray-50 p-4 rounded-lg">
//               <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Nearest Markets</h3>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//                 {markets.map(market => (
//                   <label key={market._id} className="flex items-center space-x-2 cursor-pointer p-2 bg-white rounded border hover:bg-gray-50">
//                     <input
//                       type="checkbox"
//                       name="nearestMarkets"
//                       value={market._id}
//                       checked={form.nearestMarkets.includes(market._id)}
//                       onChange={handleChange}
//                       className="h-4 w-4 text-purple-600"
//                     />
//                     <span className="text-gray-700">
//                       {market.marketName} ({market.district})
//                     </span>
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
//                   <input type="number" name="accountNumber" value={form.accountNumber} onChange={handleChange} className="input-field" placeholder="Bank account number" />
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

//             {/* DOCUMENTS */}
//             <section className="bg-gray-50 p-6 rounded-lg">
//               <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Documents (Optional)</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* PAN Card */}
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">PAN Card</label>
//                   <input
//                     type="file"
//                     onChange={handlePanCardChange}
//                     className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors"
//                     accept=".jpg,.jpeg,.png,.pdf"
//                   />
//                   {panCardFile && (
//                     <div className="text-xs text-green-600 mt-1">
//                       ✅ Selected: {panCardFile.name}
//                     </div>
//                   )}
//                 </div>

//                 {/* Aadhar Front */}
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">Aadhar Front</label>
//                   <input
//                     type="file"
//                     onChange={handleAadharFrontChange}
//                     className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors"
//                     accept=".jpg,.jpeg,.png,.pdf"
//                   />
//                   {aadharFrontFile && (
//                     <div className="text-xs text-green-600 mt-1">
//                       ✅ Selected: {aadharFrontFile.name}
//                     </div>
//                   )}
//                 </div>

//                 {/* Aadhar Back */}
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">Aadhar Back</label>
//                   <input
//                     type="file"
//                     onChange={handleAadharBackChange}
//                     className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors"
//                     accept=".jpg,.jpeg,.png,.pdf"
//                   />
//                   {aadharBackFile && (
//                     <div className="text-xs text-green-600 mt-1">
//                       ✅ Selected: {aadharBackFile.name}
//                     </div>
//                   )}
//                 </div>

//                 {/* Bank Passbook */}
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">Bank Passbook</label>
//                   <input
//                     type="file"
//                     onChange={handleBankPassbookChange}
//                     className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors"
//                     accept=".jpg,.jpeg,.png,.pdf"
//                   />
//                   {bankPassbookFile && (
//                     <div className="text-xs text-green-600 mt-1">
//                       ✅ Selected: {bankPassbookFile.name}
//                     </div>
//                   )}
//                 </div>
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

//             {/* SECURITY */}
//             <section className="bg-gray-50 p-6 rounded-lg">
//               <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Security & Activation</h3>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">Referral Code (Optional)</label>
//                   <input name="referralCode" value={form.referralCode} onChange={handleChange} className="input-field" placeholder="Referral code" />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">4-Digit MPIN</label>
//                   <input
//                     name="mpin"
//                     value={form.mpin}
//                     onChange={handleChange}
//                     type="password"
//                     maxLength={4}
//                     className="input-field"
//                     placeholder="Set 4-digit MPIN"
//                   />
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
//                 {loading ? "Adding..." : "Add Farmer"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </Dialog>

//       {/* Add Crop Dialog */}
//       <Dialog open={cropOpen} onClose={() => { setCropOpen(false); resetCropForm(); }} maxWidth="md" fullWidth>
//         <div className="p-6 max-h-[90vh] overflow-y-auto">
//           <h2 className="text-2xl font-bold mb-6 text-gray-800">Add Crop for Farmer</h2>
//           {selectedFarmer && (
//             <div className="mb-6 p-4 bg-blue-50 rounded-lg">
//               <h3 className="font-semibold text-gray-700 mb-2">Farmer Information:</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
//                 <div><span className="font-medium">Name:</span> {selectedFarmer.personalInfo.name}</div>
//                 <div><span className="font-medium">Mobile:</span> {selectedFarmer.personalInfo.mobileNo}</div>
//                 <div><span className="font-medium">Village:</span> {selectedFarmer.personalInfo.villageGramaPanchayat}</div>
//                 <div><span className="font-medium">District:</span> {selectedFarmer.personalInfo.district}</div>
//                 <div className="md:col-span-2"><span className="font-medium">Farmer ID:</span> {selectedFarmer._id}</div>
//               </div>
//             </div>
//           )}

//           <form onSubmit={handleAddCrop} className="space-y-6">
//             <section className="bg-gray-50 p-6 rounded-lg">
//               <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Crop Information</h3>
//               <div className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-xs font-medium text-gray-700 mb-1">Farming Type *</label>
//                     <select
//                       name="farmingType"
//                       value={cropForm.farmingType}
//                       onChange={handleCropChange}
//                       className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors"
//                       required
//                     >
//                       {farmingTypeOptions.map(option => (
//                         <option key={option.value} value={option.value}>
//                           {option.label}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-xs font-medium text-gray-700 mb-1">Seed Type *</label>
//                     <select
//                       name="seedType"
//                       value={cropForm.seedType}
//                       onChange={handleCropChange}
//                       className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors"
//                       required
//                     >
//                       {seedTypeOptions.map(option => (
//                         <option key={option.value} value={option.value}>
//                           {option.label}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-xs font-medium text-gray-700 mb-1">Acres *</label>
//                     <input
//                       type="number"
//                       name="acres"
//                       value={cropForm.acres}
//                       onChange={handleCropChange}
//                       className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors"
//                       placeholder="Enter acres"
//                       min="0"
//                       step="0.01"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-xs font-medium text-gray-700 mb-1">Sowing Date *</label>
//                     <input
//                       type="date"
//                       name="sowingDate"
//                       value={cropForm.sowingDate}
//                       onChange={handleCropChange}
//                       className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
//                   <h4 className="font-semibold text-green-800 mb-2">Note:</h4>
//                   <p className="text-sm text-green-700">
//                     When you add a crop, a tracking record will be automatically created with 7 stages:
//                     Nursery, Pre-Planting, Transplanting, Vegetative, Flowering, Fruit Development, and Harvesting.
//                   </p>
//                 </div>
//               </div>
//             </section>

//             <div className="flex *:cursor-pointer flex-wrap justify-end gap-4 pt-6 border-t">
//               <button
//                 type="button"
//                 onClick={() => { setCropOpen(false); resetCropForm(); }}
//                 className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//               >
//                 <FaSeedling className="mr-2" />
//                 {loading ? "Adding Crop..." : "Add Crop"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </Dialog>

//       {/* Edit Farmer Dialog */}
//       <Dialog open={editOpen} onClose={() => { setEditOpen(false); resetForm(); setSelectedFarmer(null); }} maxWidth="lg" fullWidth>
//         <div className="p-6 max-h-[90vh] overflow-y-auto">
//           <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Farmer</h2>
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
//                   <input
//                     type="tel"
//                     name="mobileNo"
//                     value={form.mobileNo}
//                     onChange={(e) => {
//                       const value = e.target.value.replace(/\D/g, "");
//                       if (value.length <= 10) {
//                         setForm({ ...form, mobileNo: value });
//                       }
//                     }}
//                     required
//                     inputMode="numeric"
//                     className="input-field"
//                     placeholder="Enter mobile number"
//                   />
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

//             {/* FARM INFORMATION */}
//             <section className="bg-gray-50 p-6 rounded-lg">
//               <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Farm Location</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">Latitude</label>
//                   <input name="latitude" value={form.latitude} onChange={handleChange} className="input-field" placeholder="Enter latitude" />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">Longitude</label>
//                   <input name="longitude" value={form.longitude} onChange={handleChange} className="input-field" placeholder="Enter longitude" />
//                 </div>
//               </div>
//             </section>

//             <section className="bg-gray-50 p-6 rounded-lg">
//               <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Farm Land Details</h3>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">Total Land (acres)</label>
//                   <input name="totalLand" value={form.totalLand} onChange={handleChange} className="input-field" placeholder="Total land area" type="number" />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">Cultivated Land (acres)</label>
//                   <input name="cultivatedLand" value={form.cultivatedLand} onChange={handleChange} className="input-field" placeholder="Cultivated land area" type="number" />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">Uncultivated Land (acres)</label>
//                   <input name="uncultivatedLand" value={form.uncultivatedLand} onChange={handleChange} className="input-field" placeholder="Uncultivated land area" type="number" />
//                 </div>
//               </div>
//             </section>

//             {/* COMMODITIES */}
//             <section className="bg-gray-50 p-6 rounded-lg">
//               <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Commodities</h3>
//               <div className="space-y-4">
//                 <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                   {commodities.map(commodity => (
//                     <label key={commodity._id} className="flex items-center space-x-2 cursor-pointer p-2 bg-white rounded border hover:bg-gray-50">
//                       <input
//                         type="checkbox"
//                         checked={form.commodities.includes(commodity._id)}
//                         onChange={(e) => handleCommodityChange(commodity._id, e.target.checked)}
//                         className="h-4 w-4 text-green-600"
//                       />
//                       <span className="text-gray-700">{commodity.categoryName}</span>
//                     </label>
//                   ))}
//                 </div>

//                 {/* Subcategories for selected commodities */}
//                 {form.commodities.length > 0 && (
//                   <div className="mt-4">
//                     <h4 className="text-lg font-semibold mb-3 text-gray-600">Subcategories</h4>
//                     <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                       {form.commodities.map(commodityId => {
//                         const commodity = commodities.find(c => c._id === commodityId);
//                         if (!commodity || !commodity.subCategories.length) return null;

//                         return (
//                           <div key={commodity._id} className="mb-4">
//                             <h5 className="font-medium text-gray-700 mb-2">{commodity.categoryName}:</h5>
//                             <div className="space-y-2 ml-4">
//                               {commodity.subCategories.map(subcat => (
//                                 <label key={subcat._id} className="flex items-center space-x-2 cursor-pointer">
//                                   <input
//                                     type="checkbox"
//                                     checked={form.subcategories.includes(subcat._id)}
//                                     onChange={(e) => handleSubcategoryChange(subcat._id, commodity._id, e.target.checked)}
//                                     className="h-4 w-4 text-blue-600"
//                                   />
//                                   <span className="text-gray-600 text-sm">{subcat.subCategoryName}</span>
//                                 </label>
//                               ))}
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </section>

//             {/* NEAREST MARKETS */}
//             <section className="bg-gray-50 p-4 rounded-lg">
//               <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Nearest Markets</h3>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//                 {markets.map(market => (
//                   <label key={market._id} className="flex items-center space-x-2 cursor-pointer p-2 bg-white rounded border hover:bg-gray-50">
//                     <input
//                       type="checkbox"
//                       name="nearestMarkets"
//                       value={market._id}
//                       checked={form.nearestMarkets.includes(market._id)}
//                       onChange={handleChange}
//                       className="h-4 w-4 text-purple-600"
//                     />
//                     <span className="text-gray-700">
//                       {market.marketName} ({market.district})
//                     </span>
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
//                   <input type="number" name="accountNumber" value={form.accountNumber} onChange={handleChange} className="input-field" placeholder="Bank account number" />
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

//             {/* DOCUMENTS - Show current documents as links */}
//             <section className="bg-gray-50 p-6 rounded-lg">
//               <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Current Documents</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {form.panCardPath && (
//                   <div>
//                     <label className="block text-xs font-medium text-gray-700 mb-1">PAN Card</label>
//                     <a href={`https://kisan.etpl.ai${form.panCardPath}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
//                       View Current PAN Card
//                     </a>
//                   </div>
//                 )}
//                 {form.aadharFrontPath && (
//                   <div>
//                     <label className="block text-xs font-medium text-gray-700 mb-1">Aadhar Front</label>
//                     <a href={`https://kisan.etpl.ai${form.aadharFrontPath}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
//                       View Current Aadhar Front
//                     </a>
//                   </div>
//                 )}
//                 {form.aadharBackPath && (
//                   <div>
//                     <label className="block text-xs font-medium text-gray-700 mb-1">Aadhar Back</label>
//                     <a href={`https://kisan.etpl.ai${form.aadharBackPath}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
//                       View Current Aadhar Back
//                     </a>
//                   </div>
//                 )}
//                 {form.bankPassbookPath && (
//                   <div>
//                     <label className="block text-xs font-medium text-gray-700 mb-1">Bank Passbook</label>
//                     <a href={`https://kisan.etpl.ai${form.bankPassbookPath}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
//                       View Current Bank Passbook
//                     </a>
//                   </div>
//                 )}
//               </div>
//             </section>

//             <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg mb-6">
//               <div className="flex items-start">
//                 <div className="flex-shrink-0">
//                   <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//                   </svg>
//                 </div>
//                 <div className="ml-3">
//                   <h3 className="text-sm font-semibold text-yellow-800">Note</h3>
//                   <div className="mt-1 text-sm text-yellow-700">
//                     <p>Farmer can only update their own documents through their profile.</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

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

//             {/* SECURITY */}
//             <section className="bg-gray-50 p-6 rounded-lg">
//               <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Security & Activation</h3>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">Referral Code (Optional)</label>
//                   <input name="referralCode" value={form.referralCode} onChange={handleChange} className="input-field" placeholder="Referral code" />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">4-Digit MPIN (Leave empty to keep current)</label>
//                   <input
//                     name="mpin"
//                     value={form.mpin}
//                     onChange={handleChange}
//                     type="password"
//                     maxLength={4}
//                     className="input-field"
//                     placeholder="Set 4-digit MPIN"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">Password (Leave empty to keep current)</label>
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
//               <button type="button" onClick={() => { setEditOpen(false); resetForm(); setSelectedFarmer(null); }} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
//                 Cancel
//               </button>
//               <button type="submit" disabled={loading} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
//                 {loading ? "Updating..." : "Update Farmer"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </Dialog>

//       {/* Bulk Actions Bar */}
//       {selectedFarmers.length > 0 && (
//         <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <FaCheck className="text-red-600" />
//               <span className="font-medium text-red-700">
//                 {selectedFarmers.length} farmer{selectedFarmers.length !== 1 ? 's' : ''} selected
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
//             disabled={farmers.length === 0 || loading}
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
//                 className="md:w-80 w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all disabled:opacity-50"
//               />
//             </div>
//           </div>

//           {
//             user?.role == "admin" && <>
//               {/* State Filter */}
//               <div className="md:col-span-2">
//                 <select
//                   className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors"
//                   value={stateFilter}
//                   onChange={(e) => {
//                     setStateFilter(e.target.value);
//                     setCurrentPage(1);
//                     // Reset district and taluk when state changes
//                     if (e.target.value !== stateFilter) {
//                       setDistrictFilter("");
//                       setTalukFilter("");
//                     }
//                   }}
//                   disabled={loading || availableStates.length === 0}
//                 >
//                   <option value="">All States</option>
//                   {availableStates.map(state => (
//                     <option key={state} value={state}>
//                       {state}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* District Filter */}
//               <div className="md:col-span-2">
//                 <select
//                   className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors"
//                   value={districtFilter}
//                   onChange={(e) => {
//                     setDistrictFilter(e.target.value);
//                     setCurrentPage(1);
//                     // Reset taluk when district changes
//                     if (e.target.value !== districtFilter) {
//                       setTalukFilter("");
//                     }
//                   }}
//                   disabled={loading || availableDistricts.length === 0}
//                 >
//                   <option value="">All Districts</option>
//                   {availableDistricts.map(district => (
//                     <option key={district} value={district}>
//                       {district}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Taluk Filter */}
//               <div className="md:col-span-2">
//                 <select
//                   className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors"
//                   value={talukFilter}
//                   onChange={(e) => {
//                     setTalukFilter(e.target.value);
//                     setCurrentPage(1);
//                   }}
//                   disabled={loading || availableTaluks.length === 0}
//                 >
//                   <option value="">All Taluks</option>
//                   {availableTaluks.map(taluk => (
//                     <option key={taluk} value={taluk}>
//                       {taluk}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </>
//           }

//           {/* Registration Status Filter */}
//           <div className="md:col-span-2">
//             <select
//               className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors"
//               value={registrationStatusFilter}
//               onChange={(e) => {
//                 setRegistrationStatusFilter(e.target.value);
//                 setCurrentPage(1);
//               }}
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
//               { label: "Copy", icon: FaCopy, onClick: handleCopy, color: "bg-gray-100 hover:bg-gray-200 text-gray-800", disabled: farmers.length === 0 },
//               { label: "Excel", icon: FaFileExcel, onClick: handleExcel, color: "bg-green-100 hover:bg-green-200 text-green-800", disabled: farmers.length === 0 },
//               { label: "CSV", icon: FaFileCsv, onClick: handleCSV, color: "bg-blue-100 hover:bg-blue-200 text-blue-800", disabled: farmers.length === 0 },
//               { label: "PDF", icon: FaFilePdf, onClick: handlePDF, color: "bg-red-100 hover:bg-red-200 text-red-800", disabled: farmers.length === 0 },
//               { label: "Print", icon: FaPrint, onClick: handlePrint, color: "bg-purple-100 hover:bg-purple-200 text-purple-800", disabled: farmers.length === 0 },
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
//       {!loading && farmers.length > 0 && (
//         <>
//           <div className="hidden lg:block bg-white overflow-x-scroll rounded shadow">
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
//                   <th className="p-[.6rem] text-xs text-left font-semibold">Email</th>
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
//                 {farmers.map((farmer, index) => {
//                   const personalInfo = farmer.personalInfo;
//                   return (
//                     <tr key={farmer._id} className="hover:bg-gray-50 transition-colors">
//                       <td className="p-[.6rem] text-xs">
//                         <input
//                           type="checkbox"
//                           checked={selectedFarmers.includes(farmer._id)}
//                           onChange={(e) => handleSelectOne(farmer._id, e.target.checked)}
//                           disabled={loading}
//                           className="rounded border-gray-300"
//                         />
//                       </td>
//                       <td className="p-[.6rem] text-xs text-center">
//                         {index + 1 + (currentPage - 1) * rowsPerPage}
//                       </td>
//                       <td className="p-[.6rem] text-xs">
//                         <div className="font-semibold">{personalInfo.name || 'N/A'}</div>
//                         {farmer.farmerId && <div className="text-xs text-gray-500">ID: {farmer.farmerId}</div>}
//                       </td>
//                       <td className="p-[.6rem] text-xs">{personalInfo.mobileNo || 'N/A'}</td>
//                       <td className="p-[.6rem] text-xs">
//                         <span className={`${personalInfo.email ? 'text-gray-900' : 'text-gray-400 italic'}`}>
//                           {personalInfo.email || 'No email'}
//                         </span>
//                       </td>
//                       <td className="p-[.6rem] text-xs">
//                         <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleBadge()}`}>
//                           {getRoleIcon()}
//                           Farmer
//                         </span>
//                       </td>
//                       <td className="p-[.6rem] text-xs">{personalInfo.villageGramaPanchayat || 'N/A'}</td>
//                       <td className="p-[.6rem] text-xs">{personalInfo.district || 'N/A'}</td>
//                       <td className="p-[.6rem] text-xs">{personalInfo.state || 'N/A'}</td>
//                       <td className="p-[.6rem] text-xs">
//                         <span className={`px-2 py-1 rounded text-xs font-medium ${getRegistrationStatusBadge(farmer.registrationStatus)}`}>
//                           {getRegistrationStatusIcon(farmer.registrationStatus)}
//                           {farmer.registrationStatus || 'Pending'}
//                         </span>
//                       </td>
//                       <td className="p-[.6rem] text-xs">
//                         <span className={`px-2 py-1 rounded text-xs font-medium ${farmer?.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
//                           {farmer?.isActive ? "Active" : "Inactive"}
//                         </span>
//                       </td>
//                       <td className="p-[.6rem] text-xs">
//                         <div className="flex gap-[.6rem] text-xs">
//                           <button
//                             onClick={() => openCropForm(farmer)}
//                             disabled={loading}
//                             className="p-[.6rem] text-xs text-purple-600 hover:bg-purple-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                             title="Add Crop"
//                           >
//                             <FaSeedling />
//                           </button>
//                           <button
//                             onClick={() => { setSelectedFarmer(farmer); setViewOpen(true); }}
//                             disabled={loading}
//                             className="p-[.6rem] text-xs text-blue-600 hover:bg-blue-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                             title="View Details"
//                           >
//                             <FaEye />
//                           </button>
//                           <button
//                             onClick={() => populateFormForEdit(farmer)}
//                             disabled={loading}
//                             className="p-[.6rem] text-xs text-green-600 hover:bg-green-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                             title="Edit Farmer"
//                           >
//                             <FaEdit />
//                           </button>
//                           <button
//                             onClick={() => { setSelectedFarmer(farmer); setDeleteOpen(true); }}
//                             disabled={loading}
//                             className="p-[.6rem] text-xs text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                             title="Delete Farmer"
//                           >
//                             <FaTrash />
//                           </button>
//                           {/* Approve Button - Only show if not already approved */}
//                           {farmer.registrationStatus !== "approved" && (
//                             <button
//                               onClick={() => handleUpdateRegistrationStatus(farmer._id, "approved")}
//                               disabled={loading}
//                               className="p-[.6rem] text-xs text-green-600 hover:bg-green-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                               title="Approve Farmer"
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
//             {farmers.map((farmer, index) => {
//               const personalInfo = farmer.personalInfo;
//               return (
//                 <div key={farmer._id} className="rounded p-[.6rem] text-xs border border-zinc-200 bg-white shadow">
//                   <div className="flex justify-between items-start mb-3">
//                     <div className="flex items-center gap-2">
//                       <input
//                         type="checkbox"
//                         checked={selectedFarmers.includes(farmer._id)}
//                         onChange={(e) => handleSelectOne(farmer._id, e.target.checked)}
//                         disabled={loading}
//                         className="rounded border-gray-300"
//                       />
//                       <div>
//                         <div className="font-bold text-gray-800">{personalInfo.name || 'N/A'}</div>
//                         <div className="text-xs text-gray-500">Sr. {index + 1 + (currentPage - 1) * rowsPerPage}</div>
//                         {farmer.farmerId && <div className="text-xs text-gray-500">ID: {farmer.farmerId}</div>}
//                       </div>
//                     </div>
//                     <div className="flex gap-[.6rem] text-xs">
//                       <button
//                         onClick={() => openCropForm(farmer)}
//                         disabled={loading}
//                         className="p-1.5 text-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
//                         title="Add Crop"
//                       >
//                         <FaSeedling />
//                       </button>
//                       <button
//                         onClick={() => { setSelectedFarmer(farmer); setViewOpen(true); }}
//                         disabled={loading}
//                         className="p-1.5 text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
//                       >
//                         <FaEye />
//                       </button>
//                       <button
//                         onClick={() => populateFormForEdit(farmer)}
//                         disabled={loading}
//                         className="p-1.5 text-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
//                       >
//                         <FaEdit />
//                       </button>
//                       <button
//                         onClick={() => { setSelectedFarmer(farmer); setDeleteOpen(true); }}
//                         disabled={loading}
//                         className="p-1.5 text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
//                       >
//                         <FaTrash />
//                       </button>
//                       {/* Approve Button for Mobile - Only show if not already approved */}
//                       {farmer.registrationStatus !== "approved" && (
//                         <button
//                           onClick={() => handleUpdateRegistrationStatus(farmer._id, "approved")}
//                           disabled={loading}
//                           className="p-1.5 text-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
//                           title="Approve Farmer"
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
//                       <div className="text-xs text-gray-500 mb-2">Role</div>
//                       <div className="text-xs">
//                         <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleBadge()}`}>
//                           {getRoleIcon()}
//                           Farmer
//                         </span>
//                       </div>
//                     </div>
//                     <div className="grid grid-cols-2 gap-[.6rem] text-xs">
//                       <div>
//                         <div className="text-xs text-gray-500">Registration Status</div>
//                         <div className="text-xs mt-2">
//                           <span className={`px-2 py-1 rounded text-xs font-medium ${getRegistrationStatusBadge(farmer.registrationStatus)}`}>
//                             {getRegistrationStatusIcon(farmer.registrationStatus)}
//                             {farmer.registrationStatus || 'Pending'}
//                           </span>
//                         </div>
//                       </div>
//                       <div>
//                         <div className="text-xs mb-2 text-gray-500">Status</div>
//                         <div className="text-xs">
//                           <span className={`px-2 py-1 rounded text-xs font-medium ${farmer?.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
//                             {farmer?.isActive ? "Active" : "Inactive"}
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

//       {/* Replace the empty state section */}
//       {loading && farmers.length === 0 ? (
//         <div className="space-y-3">
//           {[...Array(5)].map((_, i) => (
//             <div key={i} className="bg-white p-4 rounded-lg shadow animate-pulse">
//               <div className="flex justify-between items-center">
//                 <div className="flex items-center space-x-3">
//                   <div className="h-4 w-4 bg-gray-200 rounded"></div>
//                   <div className="h-4 w-40 bg-gray-200 rounded"></div>
//                 </div>
//                 <div className="flex space-x-2">
//                   <div className="h-8 w-8 bg-gray-200 rounded"></div>
//                   <div className="h-8 w-8 bg-gray-200 rounded"></div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : !loading && farmers.length === 0 ? (
//         <div className="text-center py-12">
//           <div className="text-gray-400 text-6xl mb-4">👨‍🌾</div>
//           <h3 className="text-xl font-semibold mb-2">No farmers found</h3>
//           <p className="text-gray-500">Try adjusting your search or filters</p>
//         </div>
//       ) : null}

//       {/* Pagination */}
//       {!loading && farmers.length > 0 && (
//         <div className="flex flex-col bg-white sm:flex-row p-3 shadow justify-between items-center gap-[.6rem] text-xs">
//           <div className="text-gray-600">
//             Showing <span className="font-semibold">{1 + (currentPage - 1) * rowsPerPage}-{Math.min(currentPage * rowsPerPage, totalFarmers)}</span> of{" "}
//             <span className="font-semibold">{totalFarmers}</span> farmers
//             <select
//               value={rowsPerPage}
//               onChange={(e) => {
//                 setRowsPerPage(Number(e.target.value));
//                 setCurrentPage(1);
//               }}
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
//       {viewOpen && selectedFarmer && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3">
//           <div className="bg-white rounded-xl w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-y-auto">
//             <div className="flex justify-between p-3 items-center mb-6 sticky top-0 bg-white pb-4 border-b">
//               <h2 className="font-semibold text-2xl text-gray-800">Farmer Details</h2>
//               <button
//                 onClick={() => setViewOpen(false)}
//                 className="text-gray-500 hover:text-gray-700 text-2xl"
//                 disabled={loading}
//               >
//                 ✕
//               </button>
//             </div>

//             <div className="space-y-6 p-3">
//               {/* Basic Information */}
//               <section className="bg-gray-50 p-4 rounded-lg">
//                 <h3 className="text-lg font-semibold mb-3 text-gray-700">Basic Information</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
//                   <DetailRow label="Farmer ID" value={selectedFarmer._id} />
//                   {selectedFarmer.farmerId && <DetailRow label="Farmer ID" value={selectedFarmer.farmerId} />}
//                   <DetailRow label="Name" value={selectedFarmer.personalInfo.name || 'Not provided'} />
//                   <DetailRow label="Mobile" value={selectedFarmer.personalInfo.mobileNo || 'Not provided'} />
//                   <DetailRow label="Email" value={selectedFarmer.personalInfo.email || 'Not provided'} />
//                   <DetailRow label="Role" value="Farmer" />
//                   <DetailRow label="Registration Status" value={selectedFarmer.registrationStatus || 'Not provided'} />
//                   <DetailRow label="Status" value={selectedFarmer.isActive ? 'Active' : 'Inactive'} />
//                   {selectedFarmer.registeredAt && <DetailRow label="Registered Date" value={new Date(selectedFarmer.registeredAt).toLocaleString()} />}
//                 </div>
//               </section>

//               {/* Personal Information */}
//               <section className="bg-gray-50 p-4 rounded-lg">
//                 <h3 className="text-lg font-semibold mb-3 text-gray-700">Personal Information</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                   <DetailRow label="Address" value={selectedFarmer.personalInfo.address || 'Not provided'} />
//                   <DetailRow label="Village/Grama Panchayat" value={selectedFarmer.personalInfo.villageGramaPanchayat || 'Not provided'} />
//                   <DetailRow label="Pincode" value={selectedFarmer.personalInfo.pincode || 'Not provided'} />
//                   <DetailRow label="State" value={selectedFarmer.personalInfo.state || 'Not provided'} />
//                   <DetailRow label="District" value={selectedFarmer.personalInfo.district || 'Not provided'} />
//                   <DetailRow label="Taluk" value={selectedFarmer.personalInfo.taluk || 'Not provided'} />
//                   <DetailRow label="Post" value={selectedFarmer.personalInfo.post || 'Not provided'} />
//                 </div>
//               </section>

//               {/* Farm Information */}
//               {selectedFarmer.farmLocation && (
//                 <section className="bg-gray-50 p-4 rounded-lg">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-700">Farm Information</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                     <DetailRow label="Latitude" value={selectedFarmer.farmLocation.latitude || 'Not provided'} />
//                     <DetailRow label="Longitude" value={selectedFarmer.farmLocation.longitude || 'Not provided'} />
//                     {selectedFarmer.farmLand && (
//                       <>
//                         <DetailRow label="Total Land" value={selectedFarmer.farmLand.total ? `${selectedFarmer.farmLand.total} acres` : 'Not provided'} />
//                         <DetailRow label="Cultivated Land" value={selectedFarmer.farmLand.cultivated ? `${selectedFarmer.farmLand.cultivated} acres` : 'Not provided'} />
//                         <DetailRow label="Uncultivated Land" value={selectedFarmer.farmLand.uncultivated ? `${selectedFarmer.farmLand.uncultivated} acres` : 'Not provided'} />
//                       </>
//                     )}
//                   </div>
//                 </section>
//               )}

//               {/* Commodities */}
//               {selectedFarmer.commodities && selectedFarmer.commodities.length > 0 && (
//                 <section className="bg-gray-50 p-4 rounded-lg">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-700">Commodities</h3>
//                   <div className="space-y-3">
//                     <div>
//                       <div className="text-sm font-medium text-gray-600 mb-2">Commodities:</div>
//                       <div className="flex flex-wrap gap-2">
//                         {getCommodityNames(selectedFarmer.commodities).map((name, index) => (
//                           <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
//                             {name}
//                           </span>
//                         ))}
//                       </div>
//                     </div>

//                     {selectedFarmer.subcategories && selectedFarmer.subcategories.length > 0 && (
//                       <div>
//                         <div className="text-sm font-medium text-gray-600 mb-2">Subcategories:</div>
//                         <div className="flex flex-wrap gap-2">
//                           {getSubcategoryNames(selectedFarmer.subcategories).map((name, index) => (
//                             <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
//                               {name}
//                             </span>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </section>
//               )}

//               {/* Nearest Markets */}
//               {selectedFarmer.nearestMarkets && selectedFarmer.nearestMarkets.length > 0 && (
//                 <section className="bg-gray-50 p-4 rounded-lg">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-700">Nearest Markets</h3>
//                   <div className="flex flex-wrap gap-2">
//                     {getMarketNames(selectedFarmer.nearestMarkets).map((name, index) => (
//                       <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
//                         {name}
//                       </span>
//                     ))}
//                   </div>
//                 </section>
//               )}

//               {/* Bank Details */}
//               {selectedFarmer.bankDetails && (
//                 <section className="bg-gray-50 p-4 rounded-lg">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-700">Bank Details</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                     <DetailRow label="Account Holder" value={selectedFarmer.bankDetails.accountHolderName || 'Not provided'} />
//                     <DetailRow label="Account Number" value={selectedFarmer.bankDetails.accountNumber || 'Not provided'} />
//                     <DetailRow label="IFSC Code" value={selectedFarmer.bankDetails.ifscCode || 'Not provided'} />
//                     <DetailRow label="Branch" value={selectedFarmer.bankDetails.branch || 'Not provided'} />
//                   </div>
//                 </section>
//               )}

//               {/* Documents */}
//               {selectedFarmer.documents && (
//                 <section className="bg-gray-50 p-4 rounded-lg">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-700">Documents</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                     {selectedFarmer.documents.panCard && (
//                       <div>
//                         <div className="text-xs text-gray-500">PAN Card:</div>
//                         <a href={`https://kisan.etpl.ai${selectedFarmer?.documents?.panCard}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
//                           View PAN Card
//                         </a>
//                       </div>
//                     )}
//                     {selectedFarmer.documents.aadharFront && (
//                       <div>
//                         <div className="text-xs text-gray-500">Aadhar Front:</div>
//                         <a href={`https://kisan.etpl.ai${selectedFarmer?.documents?.aadharFront}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
//                           View Aadhar Front
//                         </a>
//                       </div>
//                     )}
//                     {selectedFarmer.documents.aadharBack && (
//                       <div>
//                         <div className="text-xs text-gray-500">Aadhar Back:</div>
//                         <a href={`https://kisan.etpl.ai${selectedFarmer?.documents?.aadharBack}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
//                           View Aadhar Back
//                         </a>
//                       </div>
//                     )}
//                     {selectedFarmer.documents.bankPassbook && (
//                       <div>
//                         <div className="text-xs text-gray-500">Bank Passbook:</div>
//                         <a href={`https://kisan.etpl.ai${selectedFarmer?.documents?.bankPassbook}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
//                           View Bank Passbook
//                         </a>
//                       </div>
//                     )}
//                   </div>
//                 </section>
//               )}

//               {/* Security Information */}
//               {selectedFarmer.security && (
//                 <section className="bg-gray-50 p-4 rounded-lg">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-700">Security Information</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                     <DetailRow label="Referral Code" value={selectedFarmer.security.referralCode || 'Not provided'} />
//                     <DetailRow label="MPIN Set" value={selectedFarmer.security.mpin ? 'Yes' : 'No'} />
//                     <DetailRow label="Password Set" value={selectedFarmer.security.password ? 'Yes' : 'No'} />
//                   </div>
//                 </section>
//               )}
//             </div>

//             <div className="flex justify-end mt-6 p-3 pt-4 border-t">
//               <button
//                 onClick={() => setViewOpen(false)}
//                 disabled={loading}
//                 className="px-5 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* DELETE CONFIRMATION Dialog */}
//       {deleteOpen && selectedFarmer && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3">
//           <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl">
//             <div className="text-center">
//               <div className="text-red-500 text-5xl mb-4">🗑️</div>
//               <h2 className="text-xl font-semibold mb-2">Delete Farmer?</h2>
//               <p className="text-gray-600 mb-6">
//                 Are you sure you want to delete <span className="font-semibold">{selectedFarmer.personalInfo.name || 'this farmer'}</span>?
//                 This action cannot be undone.
//               </p>
//               <div className="flex justify-center gap-3">
//                 <button
//                   onClick={() => setDeleteOpen(false)}
//                   disabled={loading}
//                   className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleDelete}
//                   disabled={loading}
//                   className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Delete Farmer
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* BULK DELETE CONFIRMATION Dialog */}
//       {bulkDeleteOpen && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3">
//           <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl">
//             <div className="text-center">
//               <div className="text-red-500 text-5xl mb-4">🗑️</div>
//               <h2 className="text-xl font-semibold mb-2">Delete {selectedFarmers.length} Farmers?</h2>
//               <p className="text-gray-600 mb-6">
//                 Are you sure you want to delete {selectedFarmers.length} selected farmer{selectedFarmers.length !== 1 ? 's' : ''}?
//                 This action cannot be undone.
//               </p>
//               <div className="flex justify-center gap-3">
//                 <button
//                   onClick={() => setBulkDeleteOpen(false)}
//                   disabled={loading}
//                   className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleBulkDelete}
//                   disabled={loading}
//                   className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Delete {selectedFarmers.length} Farmers
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
  FaUser,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaSeedling,
} from "react-icons/fa";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";
import toast from "react-hot-toast";
import { Pagination, Dialog } from "@mui/material";
import { getAdminSessionAction } from "@/app/actions/auth-actions";

/* ================= TYPES ================= */

interface Farmer {
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
  role: "farmer";
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
  subcategories?: string[];
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
  __v?: number;
}

interface ApiResponse {
  success: boolean;
  data: Farmer[];
  page: number;
  limit: number;
  total: number;
  totalPages?: number;
  data1: Farmer[];
}

interface Commodity {
  _id: string;
  categoryName: string;
  categoryId: string;
  subCategories: SubCategory[];
}

interface SubCategory {
  _id: string;
  subCategoryName: string;
  categoryId: string;
  subCategoryId: string;
}

interface Market {
  _id: string;
  marketId: string;
  marketName: string;
  pincode: string;
  district: string;
  state: string;
}

/* ================= PAGE ================= */

export default function FarmersPage() {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [allFarmers, setAllFarmers] = useState<Farmer[]>([]); // Store all farmers for filter options
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalFarmers, setTotalFarmers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add change state to trigger refreshes
  const [change, setChange] = useState<number>(0);

  const [viewOpen, setViewOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [cropOpen, setCropOpen] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);
  
  // FILTER STATES
  const [registrationStatusFilter, setRegistrationStatusFilter] = useState<string>("");
  const [stateFilter, setStateFilter] = useState<string>("");
  const [districtFilter, setDistrictFilter] = useState<string>("");
  const [talukFilter, setTalukFilter] = useState<string>("");
  
  // AVAILABLE FILTER OPTIONS - Will be populated from allFarmers
  const [availableStates, setAvailableStates] = useState<string[]>([]);
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);
  const [availableTaluks, setAvailableTaluks] = useState<string[]>([]);

  // DATA FOR DROPDOWNS
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [markets, setMarkets] = useState<Market[]>([]);
  
  const [selectedFarmers, setSelectedFarmers] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [user, setUser] = useState<{
    taluka: string;
    role: string;
  }>();

  // Separate states for each document file
  const [panCardFile, setPanCardFile] = useState<File | null>(null);
  const [aadharFrontFile, setAadharFrontFile] = useState<File | null>(null);
  const [aadharBackFile, setAadharBackFile] = useState<File | null>(null);
  const [bankPassbookFile, setBankPassbookFile] = useState<File | null>(null);

  // Fix the form state types
  interface FormState {
    name: string;
    mobileNo: string;
    email: string;
    address: string;
    villageGramaPanchayat: string;
    pincode: string;
    state: string;
    district: string;
    taluk: string;
    post: string;
    role: "farmer";
    latitude: string;
    longitude: string;
    totalLand: string;
    cultivatedLand: string;
    uncultivatedLand: string;
    commodities: string[];
    nearestMarkets: string[];
    subcategories: string[];
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
    branch: string;
    // Store document paths (for edit mode)
    panCardPath: string;
    aadharFrontPath: string;
    aadharBackPath: string;
    bankPassbookPath: string;
    referralCode: string;
    mpin: string;
    password: string;
    isActive: boolean;
    registrationStatus: string;
  }

  const [form, setForm] = useState<FormState>({
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
    role: "farmer",
    latitude: "",
    longitude: "",
    totalLand: "",
    cultivatedLand: "",
    uncultivatedLand: "",
    commodities: [],
    nearestMarkets: [],
    subcategories: [],
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    branch: "",
    panCardPath: "",
    aadharFrontPath: "",
    aadharBackPath: "",
    bankPassbookPath: "",
    referralCode: "",
    mpin: "",
    password: "",
    isActive: true,
    registrationStatus: "pending",
  });

  // Crop Form State
  const [cropForm, setCropForm] = useState({
    farmingType: "regular",
    seedType: "hybrid",
    acres: "",
    sowingDate: "",
    farmerId: "",
  });

  const registrationStatusOptions = [
    { value: "", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "under_review", label: "Under Review" },
  ];

  const farmingTypeOptions = [
    { value: "organic", label: "Organic" },
    { value: "regular", label: "Regular" },
    { value: "natural", label: "Natural" },
    { value: "hydroponic", label: "Hydroponic" },
  ];

  const seedTypeOptions = [
    { value: "hybrid", label: "Hybrid" },
    { value: "naati", label: "Naati" },
    { value: "heirloom", label: "Heirloom" },
    { value: "gmo", label: "GMO" },
  ];

  // Refs to prevent duplicate calls
  const initialLoadRef = useRef(true);
  const isFetchingRef = useRef(false);
  const previousFiltersRef = useRef({
    search: "",
    registrationStatusFilter: "",
    stateFilter: "",
    districtFilter: "",
    talukFilter: "",
    currentPage: 1,
    rowsPerPage: 10,
    change: 0
  });

  /* ================= FETCH EXTERNAL DATA ================= */

  const fetchCommodities = useCallback(async () => {
    try {
      const response = await axios.get("/api/commodities");
      if (response.data.success) {
        setCommodities(response.data.data);
      }
    } catch (error: any) {
      console.error("Error fetching commodities:", error);
      toast.error("Failed to load commodities");
    }
  }, []);

  const fetchMarkets = useCallback(async () => {
    try {
      const response = await axios.get("/api/markets");
      if (response.data.success) {
        setMarkets(response.data.data);
      }
    } catch (error: any) {
      console.error("Error fetching markets:", error);
      toast.error("Failed to load markets");
    }
  }, []);

  /* ================= EXTRACT FILTER OPTIONS FROM ALL FARMERS ================= */

  const extractFilterOptions = useCallback((farmersData: Farmer[]) => {
    if (!farmersData || farmersData.length === 0) return;

    // Store all farmers for filter options
    setAllFarmers(farmersData);

    // Extract unique states from ALL farmers (not just filtered ones)
    const states = Array.from(
      new Set(
        farmersData
          .map(f => f.personalInfo?.state)
          .filter(Boolean)
          .sort()
      )
    ) as string[];

    setAvailableStates(states);

    // Extract districts based on selected state (or all if no state selected)
    let districts: string[] = [];
    if (stateFilter) {
      districts = Array.from(
        new Set(
          farmersData
            .filter(f => f.personalInfo?.state === stateFilter)
            .map(f => f.personalInfo?.district)
            .filter(Boolean)
            .sort()
        )
      ) as string[];
    } else {
      districts = Array.from(
        new Set(
          farmersData
            .map(f => f.personalInfo?.district)
            .filter(Boolean)
            .sort()
        )
      ) as string[];
    }
    setAvailableDistricts(districts);

    // Extract taluks based on selected state and district
    let taluks: string[] = [];
    if (stateFilter && districtFilter) {
      taluks = Array.from(
        new Set(
          farmersData
            .filter(f => 
              f.personalInfo?.state === stateFilter && 
              f.personalInfo?.district === districtFilter
            )
            .map(f => f.personalInfo?.taluk)
            .filter(Boolean)
            .sort()
        )
      ) as string[];
    } else if (stateFilter) {
      taluks = Array.from(
        new Set(
          farmersData
            .filter(f => f.personalInfo?.state === stateFilter)
            .map(f => f.personalInfo?.taluk)
            .filter(Boolean)
            .sort()
        )
      ) as string[];
    } else if (districtFilter) {
      taluks = Array.from(
        new Set(
          farmersData
            .filter(f => f.personalInfo?.district === districtFilter)
            .map(f => f.personalInfo?.taluk)
            .filter(Boolean)
            .sort()
        )
      ) as string[];
    } else {
      taluks = Array.from(
        new Set(
          farmersData
            .map(f => f.personalInfo?.taluk)
            .filter(Boolean)
            .sort()
        )
      ) as string[];
    }
    setAvailableTaluks(taluks);
  }, [stateFilter, districtFilter]);

  /* ================= FETCH FARMERS ================= */

  const fetchFarmers = useCallback(async (
    page: number = 1, 
    searchQuery: string = "", 
    registrationStatus: string = "",
    state: string = "",
    district: string = "",
    taluk: string = ""
  ) => {
    // Prevent multiple simultaneous calls
    if (isFetchingRef.current) return;
    
    // Check if filters have actually changed
    const currentFilters = {
      search: searchQuery,
      registrationStatusFilter: registrationStatus,
      stateFilter: state,
      districtFilter: district,
      talukFilter: taluk,
      currentPage: page,
      rowsPerPage,
      change
    };

    // If no filter change and we already have data, skip fetch
    if (
      !initialLoadRef.current && 
      JSON.stringify(currentFilters) === JSON.stringify(previousFiltersRef.current) &&
      farmers.length > 0
    ) {
      return;
    }

    // Update previous filters
    previousFiltersRef.current = currentFilters;
    
    try {
      isFetchingRef.current = true;
      if (!initialLoadRef.current) {
        setLoading(true);
      }
      setError(null);
      
      const params: any = {
        page: page.toString(),
        limit: rowsPerPage.toString(),
        role: "farmer",
      };

      if (searchQuery) {
        params.search = searchQuery;
      }
      if (registrationStatus) {
        params.registrationStatus = registrationStatus;
      }
      if (state) {
        params.state = state;
      }
      if (district) {
        params.district = district;
      }

      const session = await getAdminSessionAction();
      setUser(session?.admin)
      if(session?.admin?.role == "subadmin"){
        params.taluk= session?.admin.taluka;
      } else {
        params.taluk = taluk;
      }

      const res = await axios.get<ApiResponse>(`/api/farmers`, { params });
      
      if (res.data.success) {
        const processedFarmers = res.data.data.map(farmer => ({
          ...farmer,
          personalInfo: farmer.personalInfo || {
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
          role: farmer.role || "farmer",
          isActive: farmer.isActive ?? true,
          registrationStatus: farmer.registrationStatus || "pending",
          commodities: farmer.commodities || [],
          nearestMarkets: farmer.nearestMarkets || [],
          subcategories: farmer.subcategories || []
        }));
        
        setFarmers(processedFarmers);
        setTotalFarmers(res.data.total);
        const calculatedTotalPages = Math.ceil(res.data.total / rowsPerPage);
        setTotalPages(res.data.totalPages || calculatedTotalPages);
        setCurrentPage(res.data.page);
        setSelectedFarmers([]);
        setSelectAll(false);

        // Extract filter options from the complete dataset (data1)
        if (res.data.data1 && Array.isArray(res.data.data1)) {
          const processedFarmers2 = res.data.data1.map((farmer: any) => ({
            ...farmer,
            personalInfo: farmer.personalInfo || {
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
            }
          }));
          extractFilterOptions(processedFarmers2);
        }
      }
    } catch (err: any) {
      console.error('Error fetching farmers:', err);
      setError(err.response?.data?.message || 'Failed to load farmers. Please try again.');
      setFarmers([]);
      toast.error(err.response?.data?.message || "Failed to load farmers");
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  }, [rowsPerPage, extractFilterOptions, change]);

  /* ================= UPDATE REGISTRATION STATUS ================= */

  const handleUpdateRegistrationStatus = async (farmerId: string, status: string) => {
    try {
      const shouldActivate = status === "approved";
      
      const response = await axios.put(`/api/farmers/${farmerId}?status=true`, {
        registrationStatus: status,
        ...(shouldActivate && { isActive: true })
      });
      
      if (response.data.success) {
        toast.success(`Registration status updated to ${status}${shouldActivate ? ' and account activated' : ''}`);
        // Trigger refresh by incrementing change counter
        setChange(prev => prev + 1);
      }
    } catch (error: any) {
      console.error("Error updating registration status:", error);
      toast.error(error.response?.data?.message || "Failed to update registration status");
    }
  };

  // Main effect for fetching farmers
  useEffect(() => {
   
    const timer = setTimeout(() => {
      fetchFarmers(
        currentPage, 
        search, 
        registrationStatusFilter, 
        stateFilter, 
        districtFilter, 
        talukFilter
      );
    }, 200);

    return () => clearTimeout(timer);
  }, [
    currentPage, 
    search, 
    registrationStatusFilter, 
    stateFilter, 
    districtFilter, 
    talukFilter,
    rowsPerPage,
    change,
    fetchFarmers
  ]);



  useEffect(()=>{
     fetchCommodities(),
    fetchMarkets()
  },[change])

  // Update filter options when state or district changes
  useEffect(() => {
    if (allFarmers.length === 0) return;
    
    // When state changes, update districts and reset dependent filters
    const handleStateChange = () => {
      let districts: string[] = [];
      if (stateFilter) {
        districts = Array.from(
          new Set(
            allFarmers
              .filter(f => f.personalInfo?.state === stateFilter)
              .map(f => f.personalInfo?.district)
              .filter(Boolean)
              .sort()
          )
        ) as string[];
      } else {
        districts = Array.from(
          new Set(
            allFarmers
              .map(f => f.personalInfo?.district)
              .filter(Boolean)
              .sort()
          )
        ) as string[];
      }
      
      setAvailableDistricts(districts);
      
      // Reset district filter if selected district is not in the new list
      if (districtFilter && !districts.includes(districtFilter)) {
        setDistrictFilter("");
      }
    };

    // When district changes, update taluks and reset taluk filter
    const handleDistrictChange = () => {
      let taluks: string[] = [];
      if (stateFilter && districtFilter) {
        taluks = Array.from(
          new Set(
            allFarmers
              .filter(f => 
                f.personalInfo?.state === stateFilter && 
                f.personalInfo?.district === districtFilter
              )
              .map(f => f.personalInfo?.taluk)
              .filter(Boolean)
              .sort()
          )
        ) as string[];
      } else if (stateFilter) {
        taluks = Array.from(
          new Set(
            allFarmers
              .filter(f => f.personalInfo?.state === stateFilter)
              .map(f => f.personalInfo?.taluk)
              .filter(Boolean)
              .sort()
          )
        ) as string[];
      } else if (districtFilter) {
        taluks = Array.from(
          new Set(
            allFarmers
              .filter(f => f.personalInfo?.district === districtFilter)
              .map(f => f.personalInfo?.taluk)
              .filter(Boolean)
              .sort()
          )
        ) as string[];
      } else {
        taluks = Array.from(
          new Set(
            allFarmers
              .map(f => f.personalInfo?.taluk)
              .filter(Boolean)
              .sort()
          )
        ) as string[];
      }
      
      setAvailableTaluks(taluks);
      
      // Reset taluk filter if selected taluk is not in the new list
      if (talukFilter && !taluks.includes(talukFilter)) {
        setTalukFilter("");
      }
    };

    handleStateChange();
    handleDistrictChange();
  }, [stateFilter, districtFilter, allFarmers, talukFilter]);

  /* ================= SELECTION HANDLERS ================= */

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allFarmerIds = farmers.map(farmer => farmer._id);
      setSelectedFarmers(allFarmerIds);
      setSelectAll(true);
    } else {
      setSelectedFarmers([]);
      setSelectAll(false);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedFarmers([...selectedFarmers, id]);
    } else {
      setSelectedFarmers(selectedFarmers.filter(farmerId => farmerId !== id));
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
    } else if (type === 'checkbox' && name === 'nearestMarkets') {
      const marketId = value;
      setForm(prev => ({
        ...prev,
        nearestMarkets: prev.nearestMarkets.includes(marketId)
          ? prev.nearestMarkets.filter(id => id !== marketId)
          : [...prev.nearestMarkets, marketId]
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

  const handleCommodityChange = (commodityId: string, isChecked: boolean) => {
    setForm(prev => ({
      ...prev,
      commodities: isChecked 
        ? [...prev.commodities, commodityId]
        : prev.commodities.filter(id => id !== commodityId)
    }));

    // Clear subcategories for this commodity if unchecked
    if (!isChecked) {
      const commodity = commodities.find(c => c._id === commodityId);
      if (commodity) {
        const subcatIds = commodity.subCategories.map(sc => sc._id);
        setForm(prev => ({
          ...prev,
          subcategories: prev.subcategories.filter(id => !subcatIds.includes(id))
        }));
      }
    }
  };

  const handleSubcategoryChange = (subcategoryId: string, commodityId: string, isChecked: boolean) => {
    setForm(prev => ({
      ...prev,
      subcategories: isChecked 
        ? [...prev.subcategories, subcategoryId]
        : prev.subcategories.filter(id => id !== subcategoryId)
    }));
  };

  const handleCropChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCropForm(prev => ({
      ...prev,
      [name]: value,
    }));
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

  // SEPARATE HANDLERS FOR EACH FILE INPUT - Using separate states
  const handlePanCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      
      // Check file size (limit to 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("PAN Card file is too large. Maximum size is 5MB.");
        e.target.value = '';
        return;
      }
      
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("PAN Card file type not supported. Please upload JPEG, PNG, or PDF files.");
        e.target.value = '';
        return;
      }
      
      setPanCardFile(file);
      toast.success(`PAN Card file selected: ${file.name}`);
    }
  };

  const handleAadharFrontChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("Aadhar Front file is too large. Maximum size is 5MB.");
        e.target.value = '';
        return;
      }
      
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Aadhar Front file type not supported. Please upload JPEG, PNG, or PDF files.");
        e.target.value = '';
        return;
      }
      
      setAadharFrontFile(file);
      toast.success(`Aadhar Front file selected: ${file.name}`);
    }
  };

  const handleAadharBackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("Aadhar Back file is too large. Maximum size is 5MB.");
        e.target.value = '';
        return;
      }
      
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Aadhar Back file type not supported. Please upload JPEG, PNG, or PDF files.");
        e.target.value = '';
        return;
      }
      
      setAadharBackFile(file);
      toast.success(`Aadhar Back file selected: ${file.name}`);
    }
  };

  const handleBankPassbookChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("Bank Passbook file is too large. Maximum size is 5MB.");
        e.target.value = '';
        return;
      }
      
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Bank Passbook file type not supported. Please upload JPEG, PNG, or PDF files.");
        e.target.value = '';
        return;
      }
      
      setBankPassbookFile(file);
      toast.success(`Bank Passbook file selected: ${file.name}`);
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
      role: "farmer",
      latitude: "",
      longitude: "",
      totalLand: "",
      cultivatedLand: "",
      uncultivatedLand: "",
      commodities: [],
      nearestMarkets: [],
      subcategories: [],
      accountHolderName: "",
      accountNumber: "",
      ifscCode: "",
      branch: "",
      panCardPath: "",
      aadharFrontPath: "",
      aadharBackPath: "",
      bankPassbookPath: "",
      referralCode: "",
      mpin: "",
      password: "",
      isActive: true,
      registrationStatus: "pending",
    });
    // Reset file states
    setPanCardFile(null);
    setAadharFrontFile(null);
    setAadharBackFile(null);
    setBankPassbookFile(null);
  };

  const resetCropForm = () => {
    setCropForm({
      farmingType: "regular",
      seedType: "hybrid",
      acres: "",
      sowingDate: "",
      farmerId: "",
    });
  };

  const populateFormForEdit = (farmer: Farmer) => {
    const personalInfo = farmer.personalInfo;
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
      role: farmer.role || "farmer",
      latitude: farmer.farmLocation?.latitude || "",
      longitude: farmer.farmLocation?.longitude || "",
      totalLand: farmer.farmLand?.total?.toString() || "",
      cultivatedLand: farmer.farmLand?.cultivated?.toString() || "",
      uncultivatedLand: farmer.farmLand?.uncultivated?.toString() || "",
      commodities: farmer.commodities || [],
      nearestMarkets: farmer.nearestMarkets || [],
      subcategories: farmer.subcategories || [],
      accountHolderName: farmer.bankDetails?.accountHolderName || "",
      accountNumber: farmer.bankDetails?.accountNumber || "",
      ifscCode: farmer.bankDetails?.ifscCode || "",
      branch: farmer.bankDetails?.branch || "",
      panCardPath: farmer.documents?.panCard || "",
      aadharFrontPath: farmer.documents?.aadharFront || "",
      aadharBackPath: farmer.documents?.aadharBack || "",
      bankPassbookPath: farmer.documents?.bankPassbook || "",
      referralCode: farmer.security?.referralCode || "",
      mpin: "",
      password: "",
      isActive: farmer.isActive ?? true,
      registrationStatus: farmer.registrationStatus || "pending",
    });
    // Reset file states for edit
    setPanCardFile(null);
    setAadharFrontFile(null);
    setAadharBackFile(null);
    setBankPassbookFile(null);
    setSelectedFarmer(farmer);
    setEditOpen(true);
  };

  const openCropForm = (farmer: Farmer) => {
    setSelectedFarmer(farmer);
    setCropForm({
      farmingType: "regular",
      seedType: "hybrid",
      acres: "",
      sowingDate: "",
      farmerId: farmer._id,
    });
    setCropOpen(true);
  };

  /* ================= CRUD OPERATIONS ================= */

// ... rest of the code remains the same until handleAdd function ...

const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!form.name || !form.mobileNo) {
      toast.error("Name and Mobile Number are required");
      return;
    }
    
    if (form.mobileNo.length !== 10) {
      toast.error("Mobile number must be 10 digits");
      return;
    }
    
    // Validate commodities and markets are not empty
    if (form.commodities.length === 0) {
      toast.error("Please select at least one commodity");
      return;
    }
    
    if (form.nearestMarkets.length === 0) {
      toast.error("Please select at least one market");
      return;
    }
    
    try {
      setLoading(true);
      
      // Prepare form data
      const formData = new FormData();
      
      // Personal Info
      const personalInfo = {
        name: form.name || '',
        mobileNo: form.mobileNo || '',
        email: form.email || '',
        address: form.address || '',
        villageGramaPanchayat: form.villageGramaPanchayat || '',
        pincode: form.pincode || '',
        state: form.state || '',
        district: form.district || '',
        taluk: form.taluk || '',
        post: form.post || '',
      };
      
      formData.append('personalInfo', JSON.stringify(personalInfo));
      
      // Farm Location
      const farmLocation = {
        latitude: form.latitude || "",
        longitude: form.longitude || "",
      };
      
      formData.append('farmLocation', JSON.stringify(farmLocation));
      
      // Farm Land
      const farmLand = {
        total: form.totalLand || "",
        cultivated: form.cultivatedLand || "",
        uncultivated: form.uncultivatedLand || "",
      };
      
      formData.append('farmLand', JSON.stringify(farmLand));
      
      // Commodities and Markets
      formData.append('commodities', JSON.stringify(form.commodities));
      formData.append('nearestMarkets', JSON.stringify(form.nearestMarkets));
      
      // Subcategories if selected
      if (form.subcategories.length > 0) {
        formData.append('subcategories', JSON.stringify(form.subcategories));
      }
      
      // Bank Details
      const bankDetails = {
        accountHolderName: form.accountHolderName || '',
        accountNumber: form.accountNumber || '',
        ifscCode: form.ifscCode || '',
        branch: form.branch || '',
      };
      
      formData.append('bankDetails', JSON.stringify(bankDetails));
      
      // Role
      formData.append('role', 'farmer');
      
      // Security
      const security = {
        referralCode: form.referralCode || '',
        mpin: form.mpin || '',
        password: form.password || '',
      };
      
      formData.append('security', JSON.stringify(security));
      
      // Append files from separate file states
      // IMPORTANT: Use the exact field names expected by the backend
      if (panCardFile) {
        formData.append('panCard', panCardFile);
        console.log("✅ Appending PAN Card file:", panCardFile.name);
      }
      
      if (aadharFrontFile) {
        formData.append('aadharFront', aadharFrontFile);
        console.log("✅ Appending Aadhar Front file:", aadharFrontFile.name);
      }
      
      if (aadharBackFile) {
        formData.append('aadharBack', aadharBackFile);
        console.log("✅ Appending Aadhar Back file:", aadharBackFile.name);
      }
      
      if (bankPassbookFile) {
        formData.append('bankPassbook', bankPassbookFile);
        console.log("✅ Appending Bank Passbook file:", bankPassbookFile.name);
      }
      
      // Other fields
      formData.append('isActive', form.isActive.toString());
      formData.append('registrationStatus', form.registrationStatus);
      
      // Debug: Log what we're sending
      console.log("=== FORM DATA BEING SENT ===");
      console.log("Separate file states:");
      console.log("- panCardFile:", panCardFile?.name || "None");
      console.log("- aadharFrontFile:", aadharFrontFile?.name || "None");
      console.log("- aadharBackFile:", aadharBackFile?.name || "None");
      console.log("- bankPassbookFile:", bankPassbookFile?.name || "None");
      
      const formEntries = Array.from(formData.entries());
      console.log("Total form entries:", formEntries.length);
      
      // Log all form data entries
      for (let [key, value] of formEntries) {
        if (value instanceof File) {
          console.log(`${key}: File - ${value.name} (${value.type}, ${value.size} bytes)`);
        } else if (typeof value === 'string' && value.length > 100) {
          try {
            const parsed = JSON.parse(value);
            console.log(`${key}:`, parsed);
          } catch {
            console.log(`${key}: ${value.substring(0, 100)}...`);
          }
        } else {
          console.log(`${key}: ${value}`);
        }
      }
      
      // Log specifically how many files are being sent
      const filesCount = formEntries.filter(([_, value]) => value instanceof File).length;
      console.log(`Total files being sent: ${filesCount}`);
      
      try {
        console.log("Attempting to register farmer...");
        
        // First, let's check what the backend expects by making a test call
        const testFormData = new FormData();
        if (panCardFile) testFormData.append('panCard', panCardFile);
        if (aadharFrontFile) testFormData.append('aadharFront', aadharFrontFile);
        if (aadharBackFile) testFormData.append('aadharBack', aadharBackFile);
        if (bankPassbookFile) testFormData.append('bankPassbook', bankPassbookFile);
        
        const testFiles = Array.from(testFormData.entries())
          .filter(([_, value]) => value instanceof File)
          .map(([key, value]) => ({ key, file: (value as File).name }));
        
        console.log("Files being sent with field names:", testFiles);
        
        // Make the actual request
        const res = await axios.post("https://kisan.etpl.ai/farmer/register", formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          timeout: 30000,
        });

              const result =  res.data.data;

            console.log("result data:", result);

            const { admin: { name, role, _id } } = await getAdminSessionAction();
            
                  const auditLogData = {
                    actorId: _id,
                    actorRole: role,
                    action: "CREATE",
                    module: "FARMER",
                    targetId: result._id,
                    description: `Farmer details:` + `Id :${result.farmerId}, Role : ${result.role}, Name :${result.name}, MobileNo :${result.mobileNo}`,
                   // changes: "result.farmerId",
                    userAgent:  'unknown',
                    ipAddress: "::1",
            
                  };
                  console.log("auditLogData", auditLogData)
                  const ress = await axios.post('/api/audit-logs', auditLogData)
                  console.log(ress.data)
            

        
        console.log("✅ Registration successful:", res.data);
        
        if (res.data.success) {
          toast.success("Farmer registered successfully!");
          setAddOpen(false);
          resetForm();
          
          // Trigger refresh
          setChange(prev => prev + 1);
          
          // Fetch updated farmers list
          await fetchFarmers(
            currentPage, 
            search, 
            registrationStatusFilter, 
            stateFilter, 
            districtFilter, 
            talukFilter
          );
        } else {
          toast.error(res.data.message || "Registration failed");
        }
      } catch (err: any) {
        console.error("❌ Registration error:", err);
        
        // Enhanced error logging
        if (err.response) {
          console.error("Response error:", err.response.data);
          console.error("Response status:", err.response.status);
          console.error("Response headers:", err.response.headers);
          
          if (err.response.data?.message) {
            toast.error(`Server Error: ${err.response.data.message}`);
          } else if (err.response.data?.error) {
            toast.error(`Error: ${err.response.data.error}`);
          } else if (err.response.data?.errors) {
            // Handle validation errors
            const errors = err.response.data.errors;
            const errorMessages = Object.values(errors).flat().join(', ');
            toast.error(`Validation errors: ${errorMessages}`);
          } else {
            toast.error(`Server responded with status: ${err.response.status}`);
          }
        } else if (err.request) {
          console.error("Request error:", err.request);
          toast.error("No response received from server. Please check your connection.");
        } else if (err.message.includes("MulterError") || err.message.includes("Unexpected field")) {
          toast.error("File upload error. Please check file field names. Backend expects: panCard, aadharFront, aadharBack, bankPassbook");
        } else {
          toast.error("Registration failed. Please try again.");
        }
      }
    } catch (err: any) {
      console.error("Unexpected error:", err);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

// ... rest of the code remains the same ...

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFarmer) return;
    
    try {
      setLoading(true);
      
      const farmerData: any = {
        personalInfo: {
          name: form.name,
          mobileNo: form.mobileNo,
          email: form.email || "",
          address: form.address || "",
          villageGramaPanchayat: form.villageGramaPanchayat || "",
          pincode: form.pincode || "",
          state: form.state || "",
          district: form.district || "",
          taluk: form.taluk || "",
          post: form.post || "",
        },
        role: "farmer",
        farmLocation: {
          latitude: form.latitude || "",
          longitude: form.longitude || "",
        },
        commodities: form.commodities,
        nearestMarkets: form.nearestMarkets,
        subcategories: form.subcategories,
        isActive: form.isActive,
        registrationStatus: form.registrationStatus,
      };

      // Add farmLand only if any value exists
      if (form.totalLand || form.cultivatedLand || form.uncultivatedLand) {
        farmerData.farmLand = {
          total: form.totalLand ? Number(form.totalLand) : null,
          cultivated: form.cultivatedLand ? Number(form.cultivatedLand) : null,
          uncultivated: form.uncultivatedLand ? Number(form.uncultivatedLand) : null,
        };
      }

      // Add bankDetails only if any value exists
      if (form.accountHolderName || form.accountNumber || form.ifscCode || form.branch) {
        farmerData.bankDetails = {
          accountHolderName: form.accountHolderName || "",
          accountNumber: form.accountNumber || "",
          ifscCode: form.ifscCode || "",
          branch: form.branch || "",
        };
      }

      // Add security only if any value exists
      if (form.referralCode || form.mpin || form.password) {
        farmerData.security = {
          ...(form.referralCode && { referralCode: form.referralCode }),
          ...(form.mpin && { mpin: form.mpin }),
          ...(form.password && { password: form.password }),
        };
      }

      console.log("Sending update data:", farmerData); // Debug log

      const res = await axios.put(`/api/farmers/${selectedFarmer._id}`, farmerData);
      
      if (res.data.success) {
        toast.success("Farmer updated successfully!");
        setEditOpen(false);
        resetForm();
        setSelectedFarmer(null);
        // Trigger refresh by incrementing change counter
        setChange(prev => prev + 1);
      } else {
        toast.error(res.data.message || "Failed to update farmer");
      }
    } catch (err: any) {
      console.error("Error updating farmer:", err.response?.data || err);
      toast.error(err.response?.data?.message || "Failed to update farmer");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCrop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFarmer) return;
    
    try {
      setLoading(true);
      
      if (!cropForm.acres || !cropForm.sowingDate) {
        toast.error("Please fill all required fields");
        return;
      }

      const cropData = {
        farmingType: cropForm.farmingType,
        seedType: cropForm.seedType,
        acres: Number(cropForm.acres),
        sowingDate: cropForm.sowingDate,
        farmerId: selectedFarmer.farmerId || selectedFarmer._id,
      };

      const res = await axios.post("/api/postings", cropData);
      
      if (res.data.success) {
        toast.success("Crop added successfully with tracking!");
        setCropOpen(false);
        resetCropForm();
        setSelectedFarmer(null);
        
        if (res.data.tracking) {
          toast.success(`Tracking created with ${res.data.tracking.stages?.length || 7} stages`);
        }
      }
    } catch (err: any) {
      console.error("Error adding crop:", err);
      toast.error(err.response?.data?.message || "Failed to add crop");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedFarmer) return;
   
    try {
      setLoading(true);
      
      await axios.delete(`/api/farmers/${selectedFarmer._id}`);
      toast.success("Farmer deleted successfully!");
      setDeleteOpen(false);
      setSelectedFarmer(null);
      // Trigger refresh by incrementing change counter
      setChange(prev => prev + 1);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete farmer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedFarmers.length === 0) {
      toast.error("No farmers selected");
      return;
    }

    try {
      setLoading(true);
      
      const response = await axios.post("/api/farmers/bulk-delete", {
        ids: selectedFarmers
      });
      
      if (response.data.success) {
        toast.success(response.data.message || `${selectedFarmers.length} farmers deleted successfully!`);
        setSelectedFarmers([]);
        setSelectAll(false);
        setBulkDeleteOpen(false);
        // Trigger refresh by incrementing change counter
        setChange(prev => prev + 1);
      } else {
        toast.error("Failed to delete farmers");
      }
    } catch (error: any) {
      toast.error("Error deleting farmers");
    } finally {
      setLoading(false);
    }
  };

  /* ================= GET COMMODITY AND MARKET NAMES ================= */

  const getCommodityNames = (commodityIds: string[] = []) => {
    return commodityIds.map(id => {
      const commodity = commodities.find(c => c._id === id);
      return commodity ? commodity.categoryName : id;
    });
  };

  const getMarketNames = (marketIds: string[] = []) => {
    return marketIds.map(id => {
      const market = markets.find(m => m._id === id);
      return market ? `${market.marketName}, ${market.district}` : id;
    });
  };

  const getSubcategoryNames = (subcategoryIds: string[] = []) => {
    const allSubcategories = commodities.flatMap(c => c.subCategories);
    return subcategoryIds.map(id => {
      const subcat = allSubcategories.find(sc => sc._id === id);
      return subcat ? subcat.subCategoryName : id;
    });
  };

  /* ================= EXPORT FUNCTIONS ================= */

  const exportData = farmers.map((farmer, index) => {
    const personalInfo = farmer.personalInfo;
    return {
      "Sr.": index + 1 + (currentPage - 1) * rowsPerPage,
      "Name": personalInfo.name || 'N/A',
      "Mobile": personalInfo.mobileNo || 'N/A',
      "Email": personalInfo.email || 'N/A',
      "Role": farmer.role || 'N/A',
      "Village": personalInfo.villageGramaPanchayat || 'N/A',
      "District": personalInfo.district || 'N/A',
      "State": personalInfo.state || 'N/A',
      "Address": personalInfo.address || 'N/A',
      "Taluk": personalInfo.taluk || 'N/A',
      "Post": personalInfo.post || 'N/A',
      "Pincode": personalInfo.pincode || 'N/A',
      "Registration Status": farmer.registrationStatus || 'N/A',
      "Status": farmer.isActive ? "Active" : "Inactive",
      "Registered": farmer.registeredAt ? new Date(farmer.registeredAt).toLocaleDateString() : 'N/A',
    };
  });

  const handlePrint = () => {
    if (farmers.length === 0) {
      toast.error("No farmers to print");
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
        <title>Farmers Report</title>
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
          <h1>👨‍🌾 Farmers Management Report</h1>
          <div class="header-info">Generated on: ${printDate} at ${printTime}</div>
          <div class="header-info">Total Farmers: ${totalFarmers} | Showing: ${farmers.length} farmers</div>
          <div class="header-info">Page: ${currentPage} of ${totalPages}</div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Sr.</th>
              <th>Name</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>Village</th>
              <th>District</th>
              <th>State</th>
              <th>Reg. Status</th>
              <th>Status</th>
              <th>Registered Date</th>
            </tr>
          </thead>
          <tbody>
            ${farmers.map((farmer, index) => {
              const personalInfo = farmer.personalInfo;
              return `
                <tr>
                  <td>${index + 1 + (currentPage - 1) * rowsPerPage}</td>
                  <td><strong>${personalInfo.name || 'N/A'}</strong></td>
                  <td>${personalInfo.mobileNo || 'N/A'}</td>
                  <td>${personalInfo.email || 'N/A'}</td>
                  <td>${personalInfo.villageGramaPanchayat || 'N/A'}</td>
                  <td>${personalInfo.district || 'N/A'}</td>
                  <td>${personalInfo.state || 'N/A'}</td>
                  <td>${farmer.registrationStatus || 'N/A'}</td>
                  <td>${farmer.isActive ? 'Active' : 'Inactive'}</td>
                  <td>${farmer.registeredAt ? new Date(farmer.registeredAt).toLocaleDateString() : 'N/A'}</td>
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

  const handleCopy = async (): Promise<void> => {
    if (farmers.length === 0) {
      toast.error("No farmers to copy");
      return;
    }

    const headers = ["Sr.", "Name", "Mobile", "Email", "Village", "District", "State", "Reg. Status", "Status", "Registered"];
    
    const colWidths = [6, 20, 15, 25, 15, 15, 15, 15, 12, 12];
    
    const formatRow = (data: any, isHeader = false): string => {
      const values = isHeader ? headers : [
        data["Sr."] || "",
        data.Name || "",
        data.Mobile || "",
        data.Email || "",
        data.Village || "",
        data.District || "",
        data.State || "",
        data["Registration Status"] || "",
        data.Status || "",
        data.Registered || ""
      ];
      
      return values.map((val: string, i: number) => 
        String(val).padEnd(colWidths[i])
      ).join(" | ");
    };

    const text = [
      formatRow(headers, true),
      "-".repeat(150),
      ...exportData.map((f: any) => formatRow(f, false)),
      "",
      `TOTAL: ${farmers.length} farmers`,
      `EXPORTED: ${new Date().toLocaleString()}`
    ].join("\n");
    
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Farmers table copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleExcel = () => {
    if (farmers.length === 0) {
      toast.error("No farmers to export");
      return;
    }

    try {
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Farmers");
      XLSX.writeFile(wb, `farmers-${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success("Excel file exported successfully!");
    } catch (err) {
      toast.error("Failed to export Excel file");
    }
  };

  const handleCSV = () => {
    if (farmers.length === 0) {
      toast.error("No farmers to export");
      return;
    }

    try {
      const ws = XLSX.utils.json_to_sheet(exportData);
      const csv = XLSX.utils.sheet_to_csv(ws);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `farmers-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      toast.success("CSV file exported successfully!");
    } catch (err) {
      toast.error("Failed to export CSV file");
    }
  };

  const handlePDF = () => {
    if (farmers.length === 0) {
      toast.error("No farmers to export");
      return;
    }

    try {
      const doc = new jsPDF();
      doc.text("Farmers Management Report", 14, 16);
      
      const tableColumn = ["Sr.", "Name", "Mobile", "Email", "Village", "District", "State", "Reg. Status", "Status"];
      const tableRows: any = exportData.map(f => [
        f["Sr."],
        f.Name,
        f.Mobile,
        f.Email,
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
      
      doc.save(`farmers-${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success("PDF file exported successfully!");
    } catch (err) {
      toast.error("Failed to export PDF file");
    }
  };

  /* ================= RESET FILTERS ================= */

  const handleResetFilters = () => {
    setSearch("");
    setCurrentPage(1);
    setRegistrationStatusFilter("");
    setStateFilter("");
    setDistrictFilter("");
    setTalukFilter("");
    setSelectedFarmers([]);
    setSelectAll(false);
    // Also trigger a refresh
    setChange(prev => prev + 1);
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

  const getRoleBadge = () => {
    return "bg-blue-100 text-blue-800";
  };

  const getRoleIcon = () => {
    return <FaUser className="inline mr-1" />;
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen xl:w-[83vw] lg:w-[77vw] overflow-x-scroll bg-gray-50 p-2">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-[#e9e7e72f] z-[100] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Header Section */}
      <div className="mb-4 flex gap-y-2 flex-wrap justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-2xl font-bold text-gray-800">Farmers Management</h1>
          <p className="text-gray-600 mt-2">
            Overview and detailed management of all registered farmers. {totalFarmers} farmers found.
          </p>
        </div>
        <button 
          onClick={() => setAddOpen(true)}
          disabled={loading}
          className="bg-green-500 p-2 px-4 text-white rounded shadow-2xl cursor-pointer flex items-center gap-2 hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaPlus /> Add Farmer
        </button>
      </div>

      {/* Add New Farmer Dialog */}
      <Dialog open={addOpen} onClose={() => { setAddOpen(false); resetForm(); }} maxWidth="lg" fullWidth>
        <div className="p-6 max-h-[90vh] overflow-y-auto relative">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Farmer</h2>
          <button type="button" className="absolute top-3 right-5 cursor-pointer text-red-400" onClick={()=>{
            setAddOpen(false); resetForm();
          }}>X</button>
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
                  <label className="block text-xs font-medium text-gray-700 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    name="mobileNo"
                    value={form.mobileNo}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
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

            {/* FARM INFORMATION */}
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

            {/* COMMODITIES */}
            <section className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Commodities</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {commodities.map(commodity => (
                    <label key={commodity._id} className="flex items-center space-x-2 cursor-pointer p-2 bg-white rounded border hover:bg-gray-50">
                      <input 
                        type="checkbox" 
                        checked={form.commodities.includes(commodity._id)} 
                        onChange={(e) => handleCommodityChange(commodity._id, e.target.checked)} 
                        className="h-4 w-4 text-green-600" 
                      />
                      <span className="text-gray-700">{commodity.categoryName}</span>
                    </label>
                  ))}
                </div>
                
                {/* Subcategories for selected commodities */}
                {form.commodities.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-lg font-semibold mb-3 text-gray-600">Subcategories</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {form.commodities.map(commodityId => {
                        const commodity = commodities.find(c => c._id === commodityId);
                        if (!commodity || !commodity.subCategories.length) return null;
                        
                        return (
                          <div key={commodity._id} className="mb-4">
                            <h5 className="font-medium text-gray-700 mb-2">{commodity.categoryName}:</h5>
                            <div className="space-y-2 ml-4">
                              {commodity.subCategories.map(subcat => (
                                <label key={subcat._id} className="flex items-center space-x-2 cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    checked={form.subcategories.includes(subcat._id)} 
                                    onChange={(e) => handleSubcategoryChange(subcat._id, commodity._id, e.target.checked)} 
                                    className="h-4 w-4 text-blue-600" 
                                  />
                                  <span className="text-gray-600 text-sm">{subcat.subCategoryName}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* NEAREST MARKETS */}
            <section className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Nearest Markets</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {markets.map(market => (
                  <label key={market._id} className="flex items-center space-x-2 cursor-pointer p-2 bg-white rounded border hover:bg-gray-50">
                    <input 
                      type="checkbox" 
                      name="nearestMarkets" 
                      value={market._id} 
                      checked={form.nearestMarkets.includes(market._id)} 
                      onChange={handleChange} 
                      className="h-4 w-4 text-purple-600" 
                    />
                    <span className="text-gray-700">
                      {market.marketName} ({market.district})
                    </span>
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
                  <input name="accountHolderName" value={form.accountHolderName} onChange={handleChange} className="input-field" placeholder="Account holder name" required/>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Account Number</label>
                  <input type="number" name="accountNumber" value={form.accountNumber} onChange={handleChange} className="input-field" placeholder="Bank account number" required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">IFSC Code</label>
                  <input name="ifscCode" value={form.ifscCode} onChange={handleChange} className="input-field" placeholder="Bank IFSC code" required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Branch</label>
                  <input name="branch" value={form.branch} onChange={handleChange} className="input-field" placeholder="Bank branch" required/>
                </div>
              </div>
            </section>

            {/* DOCUMENTS */}
            <section className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Documents (Optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* PAN Card */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">PAN Card</label>
                  <input 
                    type="file" 
                    onChange={handlePanCardChange} 
                    className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors"
                    accept=".jpg,.jpeg,.png,.pdf" 
                  />
                  {panCardFile && (
                    <div className="text-xs text-green-600 mt-1">
                      ✅ Selected: {panCardFile.name}
                    </div>
                  )}
                </div>

                {/* Aadhar Front */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Aadhar Front</label>
                  <input 
                    type="file" 
                    onChange={handleAadharFrontChange} 
                    className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors"
                    accept=".jpg,.jpeg,.png,.pdf" 
                  />
                  {aadharFrontFile && (
                    <div className="text-xs text-green-600 mt-1">
                      ✅ Selected: {aadharFrontFile.name}
                    </div>
                  )}
                </div>

                {/* Aadhar Back */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Aadhar Back</label>
                  <input 
                    type="file" 
                    onChange={handleAadharBackChange} 
                    className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors"
                    accept=".jpg,.jpeg,.png,.pdf" 
                  />
                  {aadharBackFile && (
                    <div className="text-xs text-green-600 mt-1">
                      ✅ Selected: {aadharBackFile.name}
                    </div>
                  )}
                </div>

                {/* Bank Passbook */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Bank Passbook</label>
                  <input 
                    type="file" 
                    onChange={handleBankPassbookChange} 
                    className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors"
                    accept=".jpg,.jpeg,.png,.pdf" 
                  />
                  {bankPassbookFile && (
                    <div className="text-xs text-green-600 mt-1">
                      ✅ Selected: {bankPassbookFile.name}
                    </div>
                  )}
                </div>
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

            {/* SECURITY */}
            <section className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Security & Activation</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Referral Code (Optional)</label>
                  <input name="referralCode" value={form.referralCode} onChange={handleChange} className="input-field" placeholder="Referral code" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">4-Digit MPIN</label>
                  <input 
                    name="mpin" 
                    value={form.mpin} 
                    onChange={handleChange} 
                    type="password" 
                    maxLength={4} 
                    className="input-field" 
                    placeholder="Set 4-digit MPIN" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
                  <input name="password" value={form.password} onChange={handleChange} type="password" className="input-field" placeholder="Set password" required />
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
                {loading ? "Adding..." : "Add Farmer"}
              </button>
            </div>
          </form>
        </div>
      </Dialog>

      {/* Add Crop Dialog */}
      <Dialog open={cropOpen} onClose={() => { setCropOpen(false); resetCropForm(); }} maxWidth="md" fullWidth>
        <div className="p-6 max-h-[90vh] overflow-y-auto">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Add Crop for Farmer</h2>
          {selectedFarmer && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">Farmer Information:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div><span className="font-medium">Name:</span> {selectedFarmer.personalInfo.name}</div>
                <div><span className="font-medium">Mobile:</span> {selectedFarmer.personalInfo.mobileNo}</div>
                <div><span className="font-medium">Village:</span> {selectedFarmer.personalInfo.villageGramaPanchayat}</div>
                <div><span className="font-medium">District:</span> {selectedFarmer.personalInfo.district}</div>
                <div className="md:col-span-2"><span className="font-medium">Farmer ID:</span> {selectedFarmer._id}</div>
              </div>
            </div>
          )}
          
          <form onSubmit={handleAddCrop} className="space-y-6">
            <section className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Crop Information</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Farming Type *</label>
                    <select 
                      name="farmingType" 
                      value={cropForm.farmingType} 
                      onChange={handleCropChange}
                      className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors"
                      required
                    >
                      {farmingTypeOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Seed Type *</label>
                    <select 
                      name="seedType" 
                      value={cropForm.seedType} 
                      onChange={handleCropChange}
                      className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors"
                      required
                    >
                      {seedTypeOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Acres *</label>
                    <input 
                      type="number" 
                      name="acres" 
                      value={cropForm.acres} 
                      onChange={handleCropChange}
                      className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors"
                      placeholder="Enter acres"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Sowing Date *</label>
                    <input 
                      type="date" 
                      name="sowingDate" 
                      value={cropForm.sowingDate} 
                      onChange={handleCropChange}
                      className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors"
                      required
                    />
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">Note:</h4>
                  <p className="text-sm text-green-700">
                    When you add a crop, a tracking record will be automatically created with 7 stages:
                    Nursery, Pre-Planting, Transplanting, Vegetative, Flowering, Fruit Development, and Harvesting.
                  </p>
                </div>
              </div>
            </section>

            <div className="flex *:cursor-pointer flex-wrap justify-end gap-4 pt-6 border-t">
              <button 
                type="button" 
                onClick={() => { setCropOpen(false); resetCropForm(); }} 
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading} 
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <FaSeedling className="mr-2" />
                {loading ? "Adding Crop..." : "Add Crop"}
              </button>
            </div>
          </form>
        </div>
      </Dialog>

      {/* Edit Farmer Dialog */}
      <Dialog open={editOpen} onClose={() => { setEditOpen(false); resetForm(); setSelectedFarmer(null); }} maxWidth="lg" fullWidth>
        <div className="p-6 max-h-[90vh] overflow-y-auto">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Farmer</h2>
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
                  <label className="block text-xs font-medium text-gray-700 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    name="mobileNo"
                    value={form.mobileNo}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
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

            {/* FARM INFORMATION */}
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

            {/* COMMODITIES */}
            <section className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Commodities</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {commodities.map(commodity => (
                    <label key={commodity._id} className="flex items-center space-x-2 cursor-pointer p-2 bg-white rounded border hover:bg-gray-50">
                      <input 
                        type="checkbox" 
                        checked={form.commodities.includes(commodity._id)} 
                        onChange={(e) => handleCommodityChange(commodity._id, e.target.checked)} 
                        className="h-4 w-4 text-green-600" 
                      />
                      <span className="text-gray-700">{commodity.categoryName}</span>
                    </label>
                  ))}
                </div>
                
                {/* Subcategories for selected commodities */}
                {form.commodities.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-lg font-semibold mb-3 text-gray-600">Subcategories</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {form.commodities.map(commodityId => {
                        const commodity = commodities.find(c => c._id === commodityId);
                        if (!commodity || !commodity.subCategories.length) return null;
                        
                        return (
                          <div key={commodity._id} className="mb-4">
                            <h5 className="font-medium text-gray-700 mb-2">{commodity.categoryName}:</h5>
                            <div className="space-y-2 ml-4">
                              {commodity.subCategories.map(subcat => (
                                <label key={subcat._id} className="flex items-center space-x-2 cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    checked={form.subcategories.includes(subcat._id)} 
                                    onChange={(e) => handleSubcategoryChange(subcat._id, commodity._id, e.target.checked)} 
                                    className="h-4 w-4 text-blue-600" 
                                  />
                                  <span className="text-gray-600 text-sm">{subcat.subCategoryName}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* NEAREST MARKETS */}
            <section className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Nearest Markets</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {markets.map(market => (
                  <label key={market._id} className="flex items-center space-x-2 cursor-pointer p-2 bg-white rounded border hover:bg-gray-50">
                    <input 
                      type="checkbox" 
                      name="nearestMarkets" 
                      value={market._id} 
                      checked={form.nearestMarkets.includes(market._id)} 
                      onChange={handleChange} 
                      className="h-4 w-4 text-purple-600" 
                    />
                    <span className="text-gray-700">
                      {market.marketName} ({market.district})
                    </span>
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
                  <input name="accountHolderName" value={form.accountHolderName} onChange={handleChange} className="input-field" placeholder="Account holder name" required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Account Number</label>
                  <input type="number" name="accountNumber" value={form.accountNumber} onChange={handleChange} className="input-field" placeholder="Bank account number" required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">IFSC Code</label>
                  <input name="ifscCode" value={form.ifscCode} onChange={handleChange} className="input-field" placeholder="Bank IFSC code" required/>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Branch</label>
                  <input name="branch" value={form.branch} onChange={handleChange} className="input-field" placeholder="Bank branch" required />
                </div>
              </div>
            </section>

            {/* DOCUMENTS - Show current documents as links */}
            <section className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Current Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {form.panCardPath && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">PAN Card</label>
                    <a href={`https://kisan.etpl.ai${form.panCardPath}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      View Current PAN Card
                    </a>
                  </div>
                )}
                {form.aadharFrontPath && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Aadhar Front</label>
                    <a href={`https://kisan.etpl.ai${form.aadharFrontPath}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      View Current Aadhar Front
                    </a>
                  </div>
                )}
                {form.aadharBackPath && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Aadhar Back</label>
                    <a href={`https://kisan.etpl.ai${form.aadharBackPath}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      View Current Aadhar Back
                    </a>
                  </div>
                )}
                {form.bankPassbookPath && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Bank Passbook</label>
                    <a href={`https://kisan.etpl.ai${form.bankPassbookPath}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      View Current Bank Passbook
                    </a>
                  </div>
                )}
              </div>
            </section>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-semibold text-yellow-800">Note</h3>
                  <div className="mt-1 text-sm text-yellow-700">
                    <p>Farmer can only update their own documents through their profile.</p>
                  </div>
                </div>
              </div>
            </div>

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

            {/* SECURITY */}
            <section className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Security & Activation</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Referral Code (Optional)</label>
                  <input name="referralCode" value={form.referralCode} onChange={handleChange} className="input-field" placeholder="Referral code" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">4-Digit MPIN (Leave empty to keep current)</label>
                  <input 
                    name="mpin" 
                    value={form.mpin} 
                    onChange={handleChange} 
                    type="password" 
                    maxLength={4} 
                    className="input-field" 
                    placeholder="Set 4-digit MPIN" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Password (Leave empty to keep current)</label>
                  <input name="password" value={form.password} onChange={handleChange} type="password" className="input-field" placeholder="Set password" required/>
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
              <button type="button" onClick={() => { setEditOpen(false); resetForm(); setSelectedFarmer(null); }} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                {loading ? "Updating..." : "Update Farmer"}
              </button>
            </div>
          </form>
        </div>
      </Dialog>

      {/* Bulk Actions Bar */}
      {selectedFarmers.length > 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaCheck className="text-red-600" />
              <span className="font-medium text-red-700">
                {selectedFarmers.length} farmer{selectedFarmers.length !== 1 ? 's' : ''} selected
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
            disabled={farmers.length === 0 || loading}
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
                className="md:w-80 w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all disabled:opacity-50"
              />
            </div>
          </div>

          {
            user?.role=="admin"&&<>
            {/* State Filter */}
            <div className="md:col-span-2">
              <select
                className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors"
                value={stateFilter}
                onChange={(e) => {
                  setStateFilter(e.target.value);
                  setCurrentPage(1);
                  // Reset district and taluk when state changes
                  if (e.target.value !== stateFilter) {
                    setDistrictFilter("");
                    setTalukFilter("");
                  }
                }}
                disabled={loading || availableStates.length === 0}
              >
                <option value="">All States</option>
                {availableStates.map(state => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            {/* District Filter */}
            <div className="md:col-span-2">
              <select
                className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors"
                value={districtFilter}
                onChange={(e) => {
                  setDistrictFilter(e.target.value);
                  setCurrentPage(1);
                  // Reset taluk when district changes
                  if (e.target.value !== districtFilter) {
                    setTalukFilter("");
                  }
                }}
                disabled={loading || availableDistricts.length === 0}
              >
                <option value="">All Districts</option>
                {availableDistricts.map(district => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>

            {/* Taluk Filter */}
            <div className="md:col-span-2">
              <select
                className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors"
                value={talukFilter}
                onChange={(e) => {
                  setTalukFilter(e.target.value);
                  setCurrentPage(1);
                }}
                disabled={loading || availableTaluks.length === 0}
              >
                <option value="">All Taluks</option>
                {availableTaluks.map(taluk => (
                  <option key={taluk} value={taluk}>
                    {taluk}
                  </option>
                ))}
              </select>
            </div>
            </>
          }

          {/* Registration Status Filter */}
          <div className="md:col-span-2">
            <select
              className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors"
              value={registrationStatusFilter}
              onChange={(e) => {
                setRegistrationStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
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
              { label: "Copy", icon: FaCopy, onClick: handleCopy, color: "bg-gray-100 hover:bg-gray-200 text-gray-800", disabled: farmers.length === 0 },
              { label: "Excel", icon: FaFileExcel, onClick: handleExcel, color: "bg-green-100 hover:bg-green-200 text-green-800", disabled: farmers.length === 0 },
              { label: "CSV", icon: FaFileCsv, onClick: handleCSV, color: "bg-blue-100 hover:bg-blue-200 text-blue-800", disabled: farmers.length === 0 },
              { label: "PDF", icon: FaFilePdf, onClick: handlePDF, color: "bg-red-100 hover:bg-red-200 text-red-800", disabled: farmers.length === 0 },
              { label: "Print", icon: FaPrint, onClick: handlePrint, color: "bg-purple-100 hover:bg-purple-200 text-purple-800", disabled: farmers.length === 0 },
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
      {!loading && farmers.length > 0 && (
        <>
          <div className="hidden lg:block bg-white overflow-x-scroll rounded shadow">
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
                  <th className="p-[.6rem] text-xs text-left font-semibold">Email</th>
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
                {farmers.map((farmer, index) => {
                  const personalInfo = farmer.personalInfo;
                  return (
                    <tr key={farmer._id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-[.6rem] text-xs">
                        <input
                          type="checkbox"
                          checked={selectedFarmers.includes(farmer._id)}
                          onChange={(e) => handleSelectOne(farmer._id, e.target.checked)}
                          disabled={loading}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="p-[.6rem] text-xs text-center">
                        {index + 1 + (currentPage - 1) * rowsPerPage}
                      </td>
                      <td className="p-[.6rem] text-xs">
                        <div className="font-semibold">{personalInfo.name || 'N/A'}</div>
                        {farmer.farmerId && <div className="text-xs text-gray-500">ID: {farmer.farmerId}</div>}
                      </td>
                      <td className="p-[.6rem] text-xs">{personalInfo.mobileNo || 'N/A'}</td>
                      <td className="p-[.6rem] text-xs">
                        <span className={`${personalInfo.email ? 'text-gray-900' : 'text-gray-400 italic'}`}>
                          {personalInfo.email || 'No email'}
                        </span>
                      </td>
                      <td className="p-[.6rem] text-xs">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleBadge()}`}>
                          {getRoleIcon()}
                          Farmer
                        </span>
                      </td>
                      <td className="p-[.6rem] text-xs">{personalInfo.villageGramaPanchayat || 'N/A'}</td>
                      <td className="p-[.6rem] text-xs">{personalInfo.district || 'N/A'}</td>
                      <td className="p-[.6rem] text-xs">{personalInfo.state || 'N/A'}</td>
                      <td className="p-[.6rem] text-xs">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getRegistrationStatusBadge(farmer.registrationStatus)}`}>
                          {getRegistrationStatusIcon(farmer.registrationStatus)}
                          {farmer.registrationStatus || 'Pending'}
                        </span>
                      </td>
                      <td className="p-[.6rem] text-xs">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${farmer?.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                          {farmer?.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="p-[.6rem] text-xs">
                        <div className="flex gap-[.6rem] text-xs">
                          <button
                            onClick={() => openCropForm(farmer)}
                            disabled={loading}
                            className="p-[.6rem] text-xs text-purple-600 hover:bg-purple-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Add Crop"
                          >
                            <FaSeedling />
                          </button>
                          <button
                            onClick={() => { setSelectedFarmer(farmer); setViewOpen(true); }}
                            disabled={loading}
                            className="p-[.6rem] text-xs text-blue-600 hover:bg-blue-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => populateFormForEdit(farmer)}
                            disabled={loading}
                            className="p-[.6rem] text-xs text-green-600 hover:bg-green-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Edit Farmer"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => { setSelectedFarmer(farmer); setDeleteOpen(true); }}
                            disabled={loading}
                            className="p-[.6rem] text-xs text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete Farmer"
                          >
                            <FaTrash />
                          </button>
                          {/* Approve Button - Only show if not already approved */}
                          {farmer.registrationStatus !== "approved" && (
                            <button
                              onClick={() => handleUpdateRegistrationStatus(farmer._id, "approved")}
                              disabled={loading}
                              className="p-[.6rem] text-xs text-green-600 hover:bg-green-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Approve Farmer"
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
            {farmers.map((farmer, index) => {
              const personalInfo = farmer.personalInfo;
              return (
                <div key={farmer._id} className="rounded p-[.6rem] text-xs border border-zinc-200 bg-white shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedFarmers.includes(farmer._id)}
                        onChange={(e) => handleSelectOne(farmer._id, e.target.checked)}
                        disabled={loading}
                        className="rounded border-gray-300"
                      />
                      <div>
                        <div className="font-bold text-gray-800">{personalInfo.name || 'N/A'}</div>
                        <div className="text-xs text-gray-500">Sr. {index + 1 + (currentPage - 1) * rowsPerPage}</div>
                        {farmer.farmerId && <div className="text-xs text-gray-500">ID: {farmer.farmerId}</div>}
                      </div>
                    </div>
                    <div className="flex gap-[.6rem] text-xs">
                      <button 
                        onClick={() => openCropForm(farmer)} 
                        disabled={loading}
                        className="p-1.5 text-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Add Crop"
                      >
                        <FaSeedling />
                      </button>
                      <button 
                        onClick={() => { setSelectedFarmer(farmer); setViewOpen(true); }} 
                        disabled={loading}
                        className="p-1.5 text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FaEye />
                      </button>
                      <button 
                        onClick={() => populateFormForEdit(farmer)} 
                        disabled={loading}
                        className="p-1.5 text-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        onClick={() => { setSelectedFarmer(farmer); setDeleteOpen(true); }} 
                        disabled={loading}
                        className="p-1.5 text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FaTrash />
                      </button>
                      {/* Approve Button for Mobile - Only show if not already approved */}
                      {farmer.registrationStatus !== "approved" && (
                        <button
                          onClick={() => handleUpdateRegistrationStatus(farmer._id, "approved")}
                          disabled={loading}
                          className="p-1.5 text-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Approve Farmer"
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
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleBadge()}`}>
                          {getRoleIcon()}
                          Farmer
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-[.6rem] text-xs">
                      <div>
                        <div className="text-xs text-gray-500">Registration Status</div>
                        <div className="text-xs mt-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getRegistrationStatusBadge(farmer.registrationStatus)}`}>
                            {getRegistrationStatusIcon(farmer.registrationStatus)}
                            {farmer.registrationStatus || 'Pending'}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs mb-2 text-gray-500">Status</div>
                        <div className="text-xs">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${farmer?.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                            {farmer?.isActive ? "Active" : "Inactive"}
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

     {/* Replace the empty state section */}
{loading && farmers.length === 0 ? (
  <div className="space-y-3">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="bg-white p-4 rounded-lg shadow animate-pulse">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="h-4 w-4 bg-gray-200 rounded"></div>
            <div className="h-4 w-40 bg-gray-200 rounded"></div>
          </div>
          <div className="flex space-x-2">
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
) : !loading && farmers.length === 0 ? (
  <div className="text-center py-12">
    <div className="text-gray-400 text-6xl mb-4">👨‍🌾</div>
    <h3 className="text-xl font-semibold mb-2">No farmers found</h3>
    <p className="text-gray-500">Try adjusting your search or filters</p>
  </div>
) : null}

      {/* Pagination */}
      {!loading && farmers.length > 0 && (
        <div className="flex flex-col bg-white sm:flex-row p-3 shadow justify-between items-center gap-[.6rem] text-xs">
          <div className="text-gray-600">
            Showing <span className="font-semibold">{1 + (currentPage - 1) * rowsPerPage}-{Math.min(currentPage * rowsPerPage, totalFarmers)}</span> of{" "}
            <span className="font-semibold">{totalFarmers}</span> farmers
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
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
      {viewOpen && selectedFarmer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3">
          <div className="bg-white rounded-xl w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between p-3 items-center mb-6 sticky top-0 bg-white pb-4 border-b">
              <h2 className="font-semibold text-2xl text-gray-800">Farmer Details</h2>
              <button
                onClick={() => setViewOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
                disabled={loading}
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6 p-3">
              {/* Basic Information */}
              <section className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-gray-700">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <DetailRow label="Farmer ID" value={selectedFarmer._id} />
                  {selectedFarmer.farmerId && <DetailRow label="Farmer ID" value={selectedFarmer.farmerId} />}
                  <DetailRow label="Name" value={selectedFarmer.personalInfo.name || 'Not provided'} />
                  <DetailRow label="Mobile" value={selectedFarmer.personalInfo.mobileNo || 'Not provided'} />
                  <DetailRow label="Email" value={selectedFarmer.personalInfo.email || 'Not provided'} />
                  <DetailRow label="Role" value="Farmer" />
                  <DetailRow label="Registration Status" value={selectedFarmer.registrationStatus || 'Not provided'} />
                  <DetailRow label="Status" value={selectedFarmer.isActive ? 'Active' : 'Inactive'} />
                  {selectedFarmer.registeredAt && <DetailRow label="Registered Date" value={new Date(selectedFarmer.registeredAt).toLocaleString()} />}
                </div>
              </section>

              {/* Personal Information */}
              <section className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-gray-700">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <DetailRow label="Address" value={selectedFarmer.personalInfo.address || 'Not provided'} />
                  <DetailRow label="Village/Grama Panchayat" value={selectedFarmer.personalInfo.villageGramaPanchayat || 'Not provided'} />
                  <DetailRow label="Pincode" value={selectedFarmer.personalInfo.pincode || 'Not provided'} />
                  <DetailRow label="State" value={selectedFarmer.personalInfo.state || 'Not provided'} />
                  <DetailRow label="District" value={selectedFarmer.personalInfo.district || 'Not provided'} />
                  <DetailRow label="Taluk" value={selectedFarmer.personalInfo.taluk || 'Not provided'} />
                  <DetailRow label="Post" value={selectedFarmer.personalInfo.post || 'Not provided'} />
                </div>
              </section>

              {/* Farm Information */}
              {selectedFarmer.farmLocation && (
                <section className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-gray-700">Farm Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <DetailRow label="Latitude" value={selectedFarmer.farmLocation.latitude || 'Not provided'} />
                    <DetailRow label="Longitude" value={selectedFarmer.farmLocation.longitude || 'Not provided'} />
                    {selectedFarmer.farmLand && (
                      <>
                        <DetailRow label="Total Land" value={selectedFarmer.farmLand.total ? `${selectedFarmer.farmLand.total} acres` : 'Not provided'} />
                        <DetailRow label="Cultivated Land" value={selectedFarmer.farmLand.cultivated ? `${selectedFarmer.farmLand.cultivated} acres` : 'Not provided'} />
                        <DetailRow label="Uncultivated Land" value={selectedFarmer.farmLand.uncultivated ? `${selectedFarmer.farmLand.uncultivated} acres` : 'Not provided'} />
                      </>
                    )}
                  </div>
                </section>
              )}

              {/* Commodities */}
              {selectedFarmer.commodities && selectedFarmer.commodities.length > 0 && (
                <section className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-gray-700">Commodities</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-medium text-gray-600 mb-2">Commodities:</div>
                      <div className="flex flex-wrap gap-2">
                        {getCommodityNames(selectedFarmer.commodities).map((name, index) => (
                          <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            {name}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {selectedFarmer.subcategories && selectedFarmer.subcategories.length > 0 && (
                      <div>
                        <div className="text-sm font-medium text-gray-600 mb-2">Subcategories:</div>
                        <div className="flex flex-wrap gap-2">
                          {getSubcategoryNames(selectedFarmer.subcategories).map((name, index) => (
                            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                              {name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Nearest Markets */}
              {selectedFarmer.nearestMarkets && selectedFarmer.nearestMarkets.length > 0 && (
                <section className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-gray-700">Nearest Markets</h3>
                  <div className="flex flex-wrap gap-2">
                    {getMarketNames(selectedFarmer.nearestMarkets).map((name, index) => (
                      <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                        {name}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Bank Details */}
              {selectedFarmer.bankDetails && (
                <section className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-gray-700">Bank Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <DetailRow label="Account Holder" value={selectedFarmer.bankDetails.accountHolderName || 'Not provided'} />
                    <DetailRow label="Account Number" value={selectedFarmer.bankDetails.accountNumber || 'Not provided'} />
                    <DetailRow label="IFSC Code" value={selectedFarmer.bankDetails.ifscCode || 'Not provided'} />
                    <DetailRow label="Branch" value={selectedFarmer.bankDetails.branch || 'Not provided'} />
                  </div>
                </section>
              )}

              {/* Documents */}
              {selectedFarmer.documents && (
                <section className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-gray-700">Documents</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedFarmer.documents.panCard && (
                      <div>
                        <div className="text-xs text-gray-500">PAN Card:</div>
                        <a href={`https://kisan.etpl.ai${selectedFarmer?.documents?.panCard}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          View PAN Card
                        </a>
                      </div>
                    )}
                    {selectedFarmer.documents.aadharFront && (
                      <div>
                        <div className="text-xs text-gray-500">Aadhar Front:</div>
                        <a href={`https://kisan.etpl.ai${selectedFarmer?.documents?.aadharFront}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          View Aadhar Front
                        </a>
                      </div>
                    )}
                    {selectedFarmer.documents.aadharBack && (
                      <div>
                        <div className="text-xs text-gray-500">Aadhar Back:</div>
                        <a href={`https://kisan.etpl.ai${selectedFarmer?.documents?.aadharBack}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          View Aadhar Back
                        </a>
                      </div>
                    )}
                    {selectedFarmer.documents.bankPassbook && (
                      <div>
                        <div className="text-xs text-gray-500">Bank Passbook:</div>
                        <a href={`https://kisan.etpl.ai${selectedFarmer?.documents?.bankPassbook}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          View Bank Passbook
                        </a>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Security Information */}
              {selectedFarmer.security && (
                <section className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-gray-700">Security Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <DetailRow label="Referral Code" value={selectedFarmer.security.referralCode || 'Not provided'} />
                    <DetailRow label="MPIN Set" value={selectedFarmer.security.mpin ? 'Yes' : 'No'} />
                    <DetailRow label="Password Set" value={selectedFarmer.security.password ? 'Yes' : 'No'} />
                  </div>
                </section>
              )}
            </div>

            <div className="flex justify-end mt-6 p-3 pt-4 border-t">
              <button
                onClick={() => setViewOpen(false)}
                disabled={loading}
                className="px-5 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION Dialog */}
      {deleteOpen && selectedFarmer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl">
            <div className="text-center">
              <div className="text-red-500 text-5xl mb-4">🗑️</div>
              <h2 className="text-xl font-semibold mb-2">Delete Farmer?</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <span className="font-semibold">{selectedFarmer.personalInfo.name || 'this farmer'}</span>? 
                This action cannot be undone.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setDeleteOpen(false)}
                  disabled={loading}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Delete Farmer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BULK DELETE CONFIRMATION Dialog */}
      {bulkDeleteOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl">
            <div className="text-center">
              <div className="text-red-500 text-5xl mb-4">🗑️</div>
              <h2 className="text-xl font-semibold mb-2">Delete {selectedFarmers.length} Farmers?</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete {selectedFarmers.length} selected farmer{selectedFarmers.length !== 1 ? 's' : ''}? 
                This action cannot be undone.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setBulkDeleteOpen(false)}
                  disabled={loading}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkDelete}
                  disabled={loading}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Delete {selectedFarmers.length} Farmers
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