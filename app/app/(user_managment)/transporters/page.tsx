

// // app/admin/transporters/page.tsx
// 'use client';

// import React, { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
// import { getAdminSessionAction } from '@/app/actions/auth-actions';

// import {
//   Search,
//   Filter,
//   Download,
//   Eye,
//   MoreVertical,
//   X,
//   MapPin,
//   Phone,
//   Mail,
//   User,
//   Truck,
//   Star,
//   CheckCircle,
//   XCircle,
//   ChevronLeft,
//   ChevronRight,
//   FileText,
//   Calendar,
//   Hash,
//   AlertCircle,
//   Edit,
//   Trash2,
//   Shield,
//   CreditCard,
//   Building,
//   Smartphone
// } from 'lucide-react';

// interface Transporter {
//   _id: string;
//   transporterId?: string;
//   personalInfo: {
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
//     location: string;
//   };
//   role?: string;
//   transportInfo: {
//     isCompany: boolean;
//     vehicleType: string;
//     vehicleCapacity: {
//       value: number;
//       unit: string;
//     };
//     vehicleNumber: string;
//     vehicleDocuments: {
//       rcBook: string | null;
//       insuranceDoc: string | null;
//       pollutionCert: string | null;
//       permitDoc: string | null;
//     };
//     driverInfo: any;
//     vehicles: any[];
//   };
//   bankDetails: {
//     accountHolderName: string;
//     bankName: string;
//     accountNumber: string;
//     ifscCode: string;
//     branch: string;
//     upiId: string;
//   };
//   documents: {
//     panCard: string | null;
//     aadharFront: string | null;
//     aadharBack: string | null;
//     bankPassbook: string | null;
//     rcBook?: string | null;
//     insuranceDoc?: string | null;
//     pollutionCert?: string | null;
//     permitDoc?: string | null;
//     driverLicense?: string | null;
//   };
//   security: {
//     referralCode: string;
//   };
//   isActive: boolean;
//   rating: number;
//   totalTrips: number;
//   maxVehicles?: number;
//   vehicleCount?: number;
//   registeredAt: string;
//   lastLogin?: string;
//   __v?: number;
// }

// interface ApiResponse {
//   success: boolean;
//   data: Transporter[];
//   count?: number;
//   message?: string;
// }

// interface FilterOptions {
//   search: string;
//   state: string;
//   district: string;
//   pincode: string;
//   vehicleType: string;
//   isActive: string;
//   rating: string;
// }

// const TransporterAdminPage: React.FC = () => {
//   const [transporters, setTransporters] = useState<Transporter[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string>('');
//   const [selectedTransporter, setSelectedTransporter] = useState<Transporter | null>(null);
//   const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [totalPages, setTotalPages] = useState<number>(1);
//   const [totalItems, setTotalItems] = useState<number>(0);
//   const [itemsPerPage] = useState<number>(10);
//   const [showFilters, setShowFilters] = useState<boolean>(false);
//   const [states, setStates] = useState<string[]>([]);
//   const [districts, setDistricts] = useState<string[]>([]);
//   const [isMobile, setIsMobile] = useState<boolean>(false);

//   const [filters, setFilters] = useState<FilterOptions>({
//     search: '',
//     state: '',
//     district: '',
//     pincode: '',
//     vehicleType: '',
//     isActive: 'all',
//     rating: 'all'
//   });

//   const vehicleTypes = [
//     'Pickup Van',
//     'Truck',
//     'Mini Truck',
//     'Container',
//     'Trailer',
//     'Lorry',
//     'Tempo'
//   ];

//   const ratingOptions = [
//     { value: 'all', label: 'All Ratings' },
//     { value: '4-5', label: '4+ Stars' },
//     { value: '3-4', label: '3+ Stars' },
//     { value: '2-3', label: '2+ Stars' },
//     { value: '0-2', label: 'Below 2' }
//   ];

//   const statusOptions = [
//     { value: 'all', label: 'All Status' },
//     { value: 'active', label: 'Active' },
//     { value: 'inactive', label: 'Inactive' }
//   ];

//   // Check if mobile
//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth <= 768);
//     };
//     checkMobile();
//     window.addEventListener('resize', checkMobile);
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   // Fetch transporters with filters
//   const fetchTransporters = useCallback(async () => {
//     setLoading(true);
//     try {
//       // Build query parameters
//       const params = new URLSearchParams();
      
//       // Always include pagination
//       params.append('page', currentPage.toString());
//       params.append('limit', itemsPerPage.toString());
      
//       // Add filters if they exist
//       if (filters.search) params.append('search', filters.search);
//       if (filters.state) params.append('state', filters.state);
//       if (filters.district) params.append('district', filters.district);
//       if (filters.pincode) params.append('pincode', filters.pincode);
//       if (filters.vehicleType) params.append('vehicleType', filters.vehicleType);
//       if (filters.isActive !== 'all') params.append('isActive', filters.isActive);
//       if (filters.rating !== 'all') params.append('rating', filters.rating);

//       const response = await axios.get<ApiResponse>(
//         `https://kisan.etpl.ai/api/transporter/all`
//       );

//       if (response.data.success) {
//         const transportersData = response.data.data || [];
//         setTransporters(transportersData);
//         setTotalItems(response.data.count || transportersData.length);
//         setTotalPages(Math.ceil((response.data.count || transportersData.length) / itemsPerPage));

//         // Extract unique states and districts for filters
//         const uniqueStates = [...new Set(transportersData.map(t => t.personalInfo.state).filter(Boolean))];
//         const uniqueDistricts = [...new Set(transportersData.map(t => t.personalInfo.district).filter(Boolean))];
//         setStates(uniqueStates as string[]);
//         setDistricts(uniqueDistricts as string[]);
//       } else {
//         setError(response.data.message || 'Failed to fetch transporters');
//       }
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'Failed to fetch transporters');
//       console.error('Error fetching transporters:', err);
//     } finally {
//       setLoading(false);
//     }
//   }, [currentPage, filters, itemsPerPage]);

//   useEffect(() => {
//     fetchTransporters();
//   }, [fetchTransporters]);

//   const handleFilterChange = (key: keyof FilterOptions, value: string) => {
//     setFilters(prev => ({ ...prev, [key]: value }));
//     setCurrentPage(1); // Reset to first page when filter changes
//   };

//   const resetFilters = () => {
//     setFilters({
//       search: '',
//       state: '',
//       district: '',
//       pincode: '',
//       vehicleType: '',
//       isActive: 'all',
//       rating: 'all'
//     });
//     setCurrentPage(1);
//   };

//   // Function to get the correct document URL
//   const getDocumentUrl = (documentUrl: string | null): string | null => {
//     if (!documentUrl) return null;
    
//     // If it's already a full URL, return it
//     if (documentUrl.startsWith('http')) {
//       return documentUrl;
//     }
    
//     // If it's a relative path starting with uploads/, construct the full URL
//     if (documentUrl.startsWith('uploads/')) {
//       // Replace backslashes with forward slashes
//       const cleanPath = documentUrl.replace(/\\/g, '/');
//       return `https://kisan.etpl.ai/${cleanPath}`;
//     }
    
//     // If it's just a filename, assume it's in uploads folder
//     return `https://kisan.etpl.ai/uploads/${documentUrl}`;
//   };

//   const downloadDocument = async (documentUrl: string | null, documentName: string) => {
//     const fullUrl = getDocumentUrl(documentUrl);
    
//     if (!fullUrl) {
//       alert('Document not available');
//       return;
//     }

//     try {
//       // Create a temporary link element
//       const link = document.createElement('a');
//       link.href = fullUrl;
//       link.setAttribute('download', `${documentName}_${new Date().getTime()}`);
//       link.setAttribute('target', '_blank');
      
//       // Add to document, click, and remove
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
      
//       // For files that might need server-side processing, we can use fetch
//       try {
//         const response = await fetch(fullUrl, {
//           method: 'GET',
//           headers: {
//             'Accept': 'application/octet-stream',
//           },
//         });
        
//         if (response.ok) {
//           const blob = await response.blob();
//           const blobUrl = window.URL.createObjectURL(blob);
          
//           const downloadLink = document.createElement('a');
//           downloadLink.href = blobUrl;
//           downloadLink.setAttribute('download', `${documentName}_${new Date().getTime()}.${documentUrl?.split('.').pop() || 'pdf'}`);
//           document.body.appendChild(downloadLink);
//           downloadLink.click();
//           document.body.removeChild(downloadLink);
//           window.URL.revokeObjectURL(blobUrl);
//         }
//       } catch (fetchErr) {
//         console.log('Using direct download link instead');
//       }
//     } catch (err) {
//       console.error('Error downloading document:', err);
//       alert('Failed to download document. Please try viewing it first.');
//     }
//   };

//   const viewDocument = (documentUrl: string | null) => {
//     const fullUrl = getDocumentUrl(documentUrl);
    
//     if (!fullUrl) {
//       alert('Document not available');
//       return;
//     }
    
//     // Open in new tab
//     window.open(fullUrl, '_blank', 'noopener,noreferrer');
//   };

//   const renderStars = (rating: number) => {
//     return (
//       <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
//         {[1, 2, 3, 4, 5].map((star) => (
//           <Star
//             key={star}
//             size={14}
//             fill={star <= rating ? '#FFD700' : '#E5E7EB'}
//             color={star <= rating ? '#FFD700' : '#E5E7EB'}
//           />
//         ))}
//         <span style={{ marginLeft: '4px', fontSize: '12px', color: '#6B7280' }}>
//           ({rating.toFixed(1)})
//         </span>
//       </div>
//     );
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const handleDeactivate = async (transporterId: string, currentStatus: boolean) => {
//     if (confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this transporter?`)) {
//       try {
//         const response = await axios.put(`https://kisan.etpl.ai/api/transporter/deactivate/${transporterId}`);
//         if (response.data.success) {
//           fetchTransporters(); // Refresh the list
//           alert(`Transporter ${currentStatus ? 'deactivated' : 'activated'} successfully`);
//         }
//       } catch (err) {
//         console.error('Error updating status:', err);
//         alert('Failed to update transporter status');
//       }
//     }
//   };

//   // Pagination controls
//   const Pagination = () => {
//     const startItem = (currentPage - 1) * itemsPerPage + 1;
//     const endItem = Math.min(currentPage * itemsPerPage, totalItems);

//     return (
//       <div style={{
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         marginTop: '20px',
//         padding: '10px 0',
//         borderTop: '1px solid #E5E7EB',
//         flexDirection: isMobile ? 'column' : 'row',
//         gap: isMobile ? '16px' : '0'
//       }}>
//         <div style={{ color: '#6B7280', fontSize: '14px' }}>
//           Showing {startItem} to {endItem} of {totalItems} transporters
//         </div>
//         <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//           <button
//             onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//             disabled={currentPage === 1}
//             style={{
//               padding: '6px 12px',
//               border: '1px solid #D1D5DB',
//               borderRadius: '6px',
//               background: '#FFF',
//               cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
//               opacity: currentPage === 1 ? 0.5 : 1,
//               display: 'flex',
//               alignItems: 'center',
//               gap: '4px',
//               fontSize: '14px'
//             }}
//           >
//             <ChevronLeft size={16} />
//             {!isMobile && 'Previous'}
//           </button>
          
//           <div style={{ display: 'flex', gap: '4px' }}>
//             {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//               let pageNum;
//               if (totalPages <= 5) {
//                 pageNum = i + 1;
//               } else if (currentPage <= 3) {
//                 pageNum = i + 1;
//               } else if (currentPage >= totalPages - 2) {
//                 pageNum = totalPages - 4 + i;
//               } else {
//                 pageNum = currentPage - 2 + i;
//               }

//               if (pageNum < 1 || pageNum > totalPages) return null;

//               return (
//                 <button
//                   key={pageNum}
//                   onClick={() => setCurrentPage(pageNum)}
//                   style={{
//                     width: '32px',
//                     height: '32px',
//                     border: currentPage === pageNum ? '1px solid #3B82F6' : '1px solid #D1D5DB',
//                     borderRadius: '6px',
//                     background: currentPage === pageNum ? '#3B82F6' : '#FFF',
//                     color: currentPage === pageNum ? '#FFF' : '#374151',
//                     cursor: 'pointer',
//                     fontWeight: currentPage === pageNum ? '600' : '400',
//                     fontSize: '14px'
//                   }}
//                 >
//                   {pageNum}
//                 </button>
//               );
//             })}
//           </div>
          
//           <button
//             onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//             disabled={currentPage === totalPages}
//             style={{
//               padding: '6px 12px',
//               border: '1px solid #D1D5DB',
//               borderRadius: '6px',
//               background: '#FFF',
//               cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
//               opacity: currentPage === totalPages ? 0.5 : 1,
//               display: 'flex',
//               alignItems: 'center',
//               gap: '4px',
//               fontSize: '14px'
//             }}
//           >
//             {!isMobile && 'Next'}
//             <ChevronRight size={16} />
//           </button>
//         </div>
//       </div>
//     );
//   };

//   // Details Modal Component
//   const DetailsModal = () => {
//     if (!selectedTransporter) return null;

//     return (
//       <div style={{
//         position: 'fixed',
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         background: 'rgba(0, 0, 0, 0.5)',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         zIndex: 1000,
//         padding: '20px',
//         overflow: 'auto'
//       }}>
//         <div style={{
//           background: '#FFF',
//           borderRadius: '12px',
//           width: '100%',
//           maxWidth: '800px',
//           maxHeight: '90vh',
//           overflowY: 'auto',
//           position: 'relative'
//         }}>
//           {/* Header */}
//           <div style={{
//             padding: '20px',
//             borderBottom: '1px solid #E5E7EB',
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'flex-start',
//             position: 'sticky',
//             top: 0,
//             background: '#FFF',
//             zIndex: 10
//           }}>
//             <div style={{ flex: 1 }}>
//               <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', margin: 0 }}>
//                 {selectedTransporter.personalInfo.name}
//               </h2>
//               <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px', flexWrap: 'wrap' }}>
//                 <span style={{
//                   padding: '4px 12px',
//                   background: selectedTransporter.isActive ? '#D1FAE5' : '#FEE2E2',
//                   color: selectedTransporter.isActive ? '#065F46' : '#991B1B',
//                   borderRadius: '12px',
//                   fontSize: '12px',
//                   fontWeight: '500',
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: '4px'
//                 }}>
//                   {selectedTransporter.isActive ? <CheckCircle size={12} /> : <XCircle size={12} />}
//                   {selectedTransporter.isActive ? 'Active' : 'Inactive'}
//                 </span>
//                 {selectedTransporter.transporterId && (
//                   <span style={{
//                     padding: '4px 12px',
//                     background: '#E0F2FE',
//                     color: '#075985',
//                     borderRadius: '12px',
//                     fontSize: '12px',
//                     fontWeight: '500'
//                   }}>
//                     ID: {selectedTransporter.transporterId}
//                   </span>
//                 )}
//                 {renderStars(selectedTransporter.rating)}
//               </div>
//             </div>
//             <button
//               onClick={() => setShowDetailsModal(false)}
//               style={{
//                 padding: '8px',
//                 borderRadius: '50%',
//                 border: 'none',
//                 background: 'transparent',
//                 cursor: 'pointer',
//                 color: '#6B7280',
//                 flexShrink: 0
//               }}
//             >
//               <X size={24} />
//             </button>
//           </div>

//           {/* Content */}
//           <div style={{ padding: '20px' }}>
//             <div style={{
//               display: 'grid',
//               gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
//               gap: '20px'
//             }}>
//               {/* Personal Info */}
//               <div style={{
//                 background: '#F9FAFB',
//                 padding: '16px',
//                 borderRadius: '8px'
//               }}>
//                 <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
//                   <User size={16} /> Personal Information
//                 </h3>
//                 <div style={{ display: 'grid', gap: '8px' }}>
//                   <InfoRow label="Name" value={selectedTransporter.personalInfo.name} />
//                   <InfoRow label="Mobile" value={selectedTransporter.personalInfo.mobileNo} icon={<Phone size={14} />} />
//                   <InfoRow label="Email" value={selectedTransporter.personalInfo.email} icon={<Mail size={14} />} />
//                   <InfoRow label="Address" value={selectedTransporter.personalInfo.address} icon={<MapPin size={14} />} />
//                   <InfoRow label="Pincode" value={selectedTransporter.personalInfo.pincode} />
//                   <InfoRow label="State" value={selectedTransporter.personalInfo.state} />
//                   <InfoRow label="District" value={selectedTransporter.personalInfo.district} />
//                   <InfoRow label="Taluk" value={selectedTransporter.personalInfo.taluk} />
//                   <InfoRow label="Post" value={selectedTransporter.personalInfo.post} />
//                   <InfoRow label="Village/Grama" value={selectedTransporter.personalInfo.villageGramaPanchayat} />
//                 </div>
//               </div>

//               {/* Transport Info */}
//               <div style={{
//                 background: '#F9FAFB',
//                 padding: '16px',
//                 borderRadius: '8px'
//               }}>
//                 <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
//                   <Truck size={16} /> Transport Information
//                 </h3>
//                 <div style={{ display: 'grid', gap: '8px' }}>
//                   <InfoRow label="Company/Individual" value={selectedTransporter.transportInfo.isCompany ? 'Company' : 'Individual'} />
//                   <InfoRow label="Vehicle Type" value={selectedTransporter.transportInfo.vehicleType} />
//                   <InfoRow label="Vehicle Number" value={selectedTransporter.transportInfo.vehicleNumber} />
//                   <InfoRow label="Vehicle Capacity" value={`${selectedTransporter.transportInfo.vehicleCapacity.value} ${selectedTransporter.transportInfo.vehicleCapacity.unit}`} />
//                   <InfoRow label="Total Trips" value={selectedTransporter.totalTrips.toString()} />
//                   {selectedTransporter.security?.referralCode && (
//                     <InfoRow label="Referral Code" value={selectedTransporter.security.referralCode} icon={<Shield size={14} />} />
//                   )}
//                   {selectedTransporter.vehicleCount !== undefined && selectedTransporter.maxVehicles !== undefined && (
//                     <InfoRow label="Vehicles" value={`${selectedTransporter.vehicleCount}/${selectedTransporter.maxVehicles}`} />
//                   )}
//                 </div>
//               </div>

//               {/* Bank Details */}
//               <div style={{
//                 background: '#F9FAFB',
//                 padding: '16px',
//                 borderRadius: '8px'
//               }}>
//                 <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
//                   <CreditCard size={16} /> Bank Details
//                 </h3>
//                 <div style={{ display: 'grid', gap: '8px' }}>
//                   <InfoRow label="Account Holder" value={selectedTransporter.bankDetails.accountHolderName} />
//                   <InfoRow label="Bank Name" value={selectedTransporter.bankDetails.bankName} />
//                   <InfoRow label="Account Number" value={selectedTransporter.bankDetails.accountNumber} />
//                   <InfoRow label="IFSC Code" value={selectedTransporter.bankDetails.ifscCode} />
//                   <InfoRow label="Branch" value={selectedTransporter.bankDetails.branch || 'N/A'} />
//                   <InfoRow label="UPI ID" value={selectedTransporter.bankDetails.upiId || 'N/A'} />
//                 </div>
//               </div>

//               {/* Registration Info */}
//               <div style={{
//                 background: '#F9FAFB',
//                 padding: '16px',
//                 borderRadius: '8px'
//               }}>
//                 <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
//                   <Calendar size={16} /> Registration Details
//                 </h3>
//                 <div style={{ display: 'grid', gap: '8px' }}>
//                   <InfoRow label="Registered On" value={formatDate(selectedTransporter.registeredAt)} />
//                   <InfoRow label="Status" value={selectedTransporter.isActive ? 'Active' : 'Inactive'} />
//                   <InfoRow label="Rating" value={selectedTransporter.rating.toFixed(1)} />
//                   <InfoRow label="Total Trips Completed" value={selectedTransporter.totalTrips.toString()} />
//                   {selectedTransporter.lastLogin && (
//                     <InfoRow label="Last Login" value={formatDate(selectedTransporter.lastLogin)} />
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Documents Section */}
//             <div style={{ marginTop: '20px' }}>
//               <div style={{
//                 background: '#F9FAFB',
//                 padding: '16px',
//                 borderRadius: '8px'
//               }}>
//                 <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
//                   <FileText size={16} /> Documents
//                 </h3>
//                 <div style={{ display: 'grid', gap: '12px' }}>
//                   <DocumentSection
//                     title="Vehicle Documents"
//                     documents={[
//                       { name: 'RC Book', url: selectedTransporter.transportInfo.vehicleDocuments.rcBook || selectedTransporter.documents.rcBook },
//                       { name: 'Insurance', url: selectedTransporter.transportInfo.vehicleDocuments.insuranceDoc || selectedTransporter.documents.insuranceDoc },
//                       { name: 'Pollution Certificate', url: selectedTransporter.transportInfo.vehicleDocuments.pollutionCert || selectedTransporter.documents.pollutionCert },
//                       { name: 'Permit', url: selectedTransporter.transportInfo.vehicleDocuments.permitDoc || selectedTransporter.documents.permitDoc },
//                       { name: 'Driver License', url: selectedTransporter.transportInfo.driverInfo?.driverLicense || selectedTransporter.documents.driverLicense }
//                     ]}
//                   />
//                   <DocumentSection
//                     title="Personal Documents"
//                     documents={[
//                       { name: 'PAN Card', url: selectedTransporter.documents.panCard },
//                       { name: 'Aadhar Front', url: selectedTransporter.documents.aadharFront },
//                       { name: 'Aadhar Back', url: selectedTransporter.documents.aadharBack },
//                       { name: 'Bank Passbook', url: selectedTransporter.documents.bankPassbook }
//                     ]}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Footer */}
//           <div style={{
//             padding: '16px 20px',
//             borderTop: '1px solid #E5E7EB',
//             display: 'flex',
//             justifyContent: 'flex-end',
//             gap: '12px',
//             flexWrap: 'wrap'
//           }}>
//             <button
//               onClick={() => handleDeactivate(selectedTransporter._id, selectedTransporter.isActive)}
//               style={{
//                 padding: '8px 16px',
//                 border: '1px solid #D1D5DB',
//                 borderRadius: '6px',
//                 background: '#FFF',
//                 color: selectedTransporter.isActive ? '#DC2626' : '#059669',
//                 cursor: 'pointer',
//                 fontSize: '14px',
//                 fontWeight: '500',
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '6px'
//               }}
//             >
//               {selectedTransporter.isActive ? <XCircle size={16} /> : <CheckCircle size={16} />}
//               {selectedTransporter.isActive ? 'Deactivate' : 'Activate'}
//             </button>
//             <button
//               onClick={() => setShowDetailsModal(false)}
//               style={{
//                 padding: '8px 16px',
//                 border: 'none',
//                 borderRadius: '6px',
//                 background: '#3B82F6',
//                 color: '#FFF',
//                 cursor: 'pointer',
//                 fontSize: '14px',
//                 fontWeight: '500'
//               }}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Helper Components
//   const InfoRow = ({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) => (
//     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//       <span style={{ fontSize: '14px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
//         {icon}
//         {label}:
//       </span>
//       <span style={{ fontSize: '14px', fontWeight: '500', color: '#111827', maxWidth: '200px', textAlign: 'right', wordBreak: 'break-word' }}>
//         {value || 'N/A'}
//       </span>
//     </div>
//   );

//   const DocumentSection = ({ title, documents }: { title: string; documents: Array<{ name: string; url: string | null }> }) => (
//     <div>
//       <h4 style={{ fontSize: '14px', fontWeight: '500', color: '#4B5563', marginBottom: '8px' }}>{title}</h4>
//       <div style={{ display: 'grid', gap: '6px' }}>
//         {documents.map((doc, index) => {
//           const documentUrl = getDocumentUrl(doc.url);
//           const hasDocument = !!documentUrl;
          
//           return (
//             <div key={index} style={{
//               display: 'flex',
//               justifyContent: 'space-between',
//               alignItems: 'center',
//               padding: '8px 12px',
//               background: '#FFF',
//               borderRadius: '6px',
//               border: '1px solid #E5E7EB'
//             }}>
//               <span style={{ fontSize: '13px', color: hasDocument ? '#374151' : '#9CA3AF' }}>
//                 {doc.name}
//                 {!hasDocument && <span style={{ color: '#EF4444', marginLeft: '4px', fontSize: '12px' }}>(Not Uploaded)</span>}
//               </span>
//               <div style={{ display: 'flex', gap: '8px' }}>
//                 <button
//                   onClick={() => viewDocument(doc.url)}
//                   disabled={!hasDocument}
//                   style={{
//                     padding: '4px 8px',
//                     border: '1px solid #D1D5DB',
//                     borderRadius: '4px',
//                     background: '#FFF',
//                     color: hasDocument ? '#374151' : '#9CA3AF',
//                     cursor: hasDocument ? 'pointer' : 'not-allowed',
//                     opacity: hasDocument ? 1 : 0.5,
//                     fontSize: '12px',
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: '4px'
//                   }}
//                 >
//                   <Eye size={12} /> View
//                 </button>
//                 <button
//                   onClick={() => downloadDocument(doc.url, doc.name)}
//                   disabled={!hasDocument}
//                   style={{
//                     padding: '4px 8px',
//                     border: '1px solid #3B82F6',
//                     borderRadius: '4px',
//                     background: hasDocument ? '#EFF6FF' : '#F3F4F6',
//                     color: hasDocument ? '#1D4ED8' : '#9CA3AF',
//                     cursor: hasDocument ? 'pointer' : 'not-allowed',
//                     opacity: hasDocument ? 1 : 0.5,
//                     fontSize: '12px',
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: '4px'
//                   }}
//                 >
//                   <Download size={12} /> Download
//                 </button>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );

//   // Desktop Table Row
//   const DesktopTableRow = ({ transporter }: { transporter: Transporter }) => (
//     <tr style={{ borderBottom: '1px solid #E5E7EB', transition: 'background 0.2s' }}>
//       <td style={{ padding: '16px' }}>
//         <div>
//           <div style={{ fontWeight: '500', color: '#111827' }}>{transporter.personalInfo.name}</div>
//           <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>
//             ID: {transporter.transporterId || transporter._id}
//           </div>
//         </div>
//       </td>
//       <td style={{ padding: '16px' }}>
//         <div style={{ fontSize: '14px', color: '#111827' }}>{transporter.personalInfo.mobileNo}</div>
//         <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>
//           {transporter.personalInfo.email}
//         </div>
//       </td>
//       <td style={{ padding: '16px' }}>
//         <div style={{ fontSize: '14px', color: '#111827' }}>
//           {transporter.personalInfo.district}, {transporter.personalInfo.state}
//         </div>
//         <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
//           <MapPin size={12} />
//           Pincode: {transporter.personalInfo.pincode}
//         </div>
//       </td>
//       <td style={{ padding: '16px' }}>
//         <div style={{ fontWeight: '500', color: '#111827' }}>{transporter.transportInfo.vehicleNumber}</div>
//         <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>
//           {transporter.transportInfo.vehicleType} • {transporter.transportInfo.vehicleCapacity.value} {transporter.transportInfo.vehicleCapacity.unit}
//         </div>
//       </td>
//       <td style={{ padding: '16px' }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//           <span style={{
//             padding: '2px 8px',
//             borderRadius: '12px',
//             fontSize: '12px',
//             fontWeight: '500',
//             background: transporter.isActive ? '#D1FAE5' : '#FEE2E2',
//             color: transporter.isActive ? '#065F46' : '#991B1B',
//             display: 'flex',
//             alignItems: 'center',
//             gap: '4px'
//           }}>
//             {transporter.isActive ? 'Active' : 'Inactive'}
//           </span>
//           {renderStars(transporter.rating)}
//         </div>
//         <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
//           Trips: {transporter.totalTrips} • Vehicles: {transporter.vehicleCount || 0}/{transporter.maxVehicles || 10}
//         </div>
//       </td>
//       <td style={{ padding: '16px' }}>
//         <div style={{ display: 'flex', gap: '8px' }}>
//           <button
//             onClick={() => {
//               setSelectedTransporter(transporter);
//               setShowDetailsModal(true);
//             }}
//             style={{
//               padding: '6px 12px',
//               border: '1px solid #D1D5DB',
//               borderRadius: '6px',
//               background: '#FFF',
//               color: '#374151',
//               cursor: 'pointer',
//               fontSize: '12px',
//               fontWeight: '500',
//               display: 'flex',
//               alignItems: 'center',
//               gap: '4px'
//             }}
//           >
//             <Eye size={14} /> View
//           </button>
//         </div>
//       </td>
//     </tr>
//   );

//   // Mobile Card
//   const MobileCard = ({ transporter }: { transporter: Transporter }) => (
//     <div key={transporter._id} style={{
//       padding: '16px',
//       borderBottom: '1px solid #E5E7EB',
//       background: '#FFF'
//     }}>
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
//         <div>
//           <div style={{ fontWeight: '600', color: '#111827', fontSize: '16px' }}>{transporter.personalInfo.name}</div>
//           <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>ID: {transporter.transporterId || transporter._id.substring(0, 8)}...</div>
//         </div>
//         <span style={{
//           padding: '2px 8px',
//           borderRadius: '12px',
//           fontSize: '12px',
//           fontWeight: '500',
//           background: transporter.isActive ? '#D1FAE5' : '#FEE2E2',
//           color: transporter.isActive ? '#065F46' : '#991B1B'
//         }}>
//           {transporter.isActive ? 'Active' : 'Inactive'}
//         </span>
//       </div>

//       <div style={{ display: 'grid', gap: '8px', marginBottom: '12px' }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//           <Phone size={14} style={{ color: '#6B7280', flexShrink: 0 }} />
//           <span style={{ fontSize: '14px', color: '#111827' }}>{transporter.personalInfo.mobileNo}</span>
//         </div>
//         <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//           <Mail size={14} style={{ color: '#6B7280', flexShrink: 0 }} />
//           <span style={{ fontSize: '14px', color: '#111827', wordBreak: 'break-all' }}>{transporter.personalInfo.email}</span>
//         </div>
//         <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//           <MapPin size={14} style={{ color: '#6B7280', flexShrink: 0 }} />
//           <span style={{ fontSize: '14px', color: '#111827' }}>
//             {transporter.personalInfo.district}, {transporter.personalInfo.state}
//           </span>
//         </div>
//         <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//           <Truck size={14} style={{ color: '#6B7280', flexShrink: 0 }} />
//           <span style={{ fontSize: '14px', color: '#111827' }}>
//             {transporter.transportInfo.vehicleNumber} ({transporter.transportInfo.vehicleType})
//           </span>
//         </div>
//       </div>

//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//           {renderStars(transporter.rating)}
//           <span style={{ fontSize: '12px', color: '#6B7280' }}>
//             {transporter.totalTrips} trips
//           </span>
//         </div>
//         <button
//           onClick={() => {
//             setSelectedTransporter(transporter);
//             setShowDetailsModal(true);
//           }}
//           style={{
//             padding: '6px 12px',
//             border: '1px solid #3B82F6',
//             borderRadius: '6px',
//             background: '#EFF6FF',
//             color: '#1D4ED8',
//             cursor: 'pointer',
//             fontSize: '12px',
//             fontWeight: '500'
//           }}
//         >
//           View Details
//         </button>
//       </div>
//     </div>
//   );

//   // Stat Card Component
//   const StatCard = ({ title, value, icon, color }: { title: string; value: string | number; icon: React.ReactNode; color: string }) => (
//     <div style={{
//       background: '#FFF',
//       padding: '16px',
//       borderRadius: '8px',
//       boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
//       flex: '1',
//       minWidth: isMobile ? '100%' : '200px'
//     }}>
//       <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//         <div>
//           <div style={{ fontSize: '12px', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
//             {title}
//           </div>
//           <div style={{ fontSize: '24px', fontWeight: '600', color: '#111827', marginTop: '4px' }}>
//             {value}
//           </div>
//         </div>
//         <div style={{
//           width: '40px',
//           height: '40px',
//           borderRadius: '8px',
//           background: `${color}20`,
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           color: color
//         }}>
//           {icon}
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div style={{
//       minHeight: '100vh',
//       background: '#F9FAFB'
//     }}>
//       {/* Header */}
//       <header style={{
//         background: '#FFF',
//         borderBottom: '1px solid #E5E7EB',
//         padding: isMobile ? '16px' : '20px'
//       }}>
//         <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
//           <h1 style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
//             Transporters Management
//           </h1>
//           <p style={{ color: '#6B7280', fontSize: isMobile ? '12px' : '14px' }}>
//             Manage and monitor all registered transporters
//           </p>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main style={{ maxWidth: '1400px', margin: '0 auto', padding: isMobile ? '16px' : '20px' }}>
//         {/* Filters Bar */}
//         <div style={{
//           background: '#FFF',
//           borderRadius: '8px',
//           padding: isMobile ? '12px' : '16px',
//           marginBottom: '20px',
//           boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
//         }}>
//           <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
//             {/* Search Bar */}
//             <div style={{ display: 'flex', gap: '12px', flexDirection: isMobile ? 'column' : 'row' }}>
//               <div style={{ flex: 1, position: 'relative' }}>
//                 <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
//                 <input
//                   type="text"
//                   placeholder="Search by name, mobile, vehicle number..."
//                   value={filters.search}
//                   onChange={(e) => handleFilterChange('search', e.target.value)}
//                   style={{
//                     width: '100%',
//                     padding: '10px 12px 10px 40px',
//                     border: '1px solid #D1D5DB',
//                     borderRadius: '6px',
//                     fontSize: '14px',
//                     outline: 'none',
//                     transition: 'border-color 0.2s'
//                   }}
//                 />
//               </div>
//               <div style={{ display: 'flex', gap: '12px' }}>
//                 <button
//                   onClick={() => setShowFilters(!showFilters)}
//                   style={{
//                     padding: '10px 16px',
//                     border: '1px solid #D1D5DB',
//                     borderRadius: '6px',
//                     background: '#FFF',
//                     color: '#374151',
//                     cursor: 'pointer',
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: '8px',
//                     fontSize: '14px',
//                     fontWeight: '500',
//                     flex: isMobile ? 1 : 'auto'
//                   }}
//                 >
//                   <Filter size={16} />
//                   {!isMobile && 'Filters'}
//                   {Object.values(filters).some(filter => filter && filter !== 'all') && (
//                     <span style={{
//                       width: '20px',
//                       height: '20px',
//                       background: '#3B82F6',
//                       color: '#FFF',
//                       borderRadius: '50%',
//                       fontSize: '12px',
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center'
//                     }}>
//                       {Object.values(filters).filter(f => f && f !== 'all').length}
//                     </span>
//                   )}
//                 </button>
//                 <button
//                   onClick={resetFilters}
//                   style={{
//                     padding: '10px 16px',
//                     border: '1px solid #D1D5DB',
//                     borderRadius: '6px',
//                     background: '#FFF',
//                     color: '#374151',
//                     cursor: 'pointer',
//                     fontSize: '14px',
//                     fontWeight: '500',
//                     flex: isMobile ? 1 : 'auto'
//                   }}
//                 >
//                   {isMobile ? 'Reset' : 'Reset Filters'}
//                 </button>
//               </div>
//             </div>

//             {/* Advanced Filters */}
//             {showFilters && (
//               <div style={{
//                 display: 'grid',
//                 gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
//                 gap: '12px',
//                 paddingTop: '16px',
//                 borderTop: '1px solid #E5E7EB'
//               }}>
//                 <select
//                   value={filters.state}
//                   onChange={(e) => handleFilterChange('state', e.target.value)}
//                   style={{
//                     padding: '10px 12px',
//                     border: '1px solid #D1D5DB',
//                     borderRadius: '6px',
//                     fontSize: '14px',
//                     background: '#FFF',
//                     color: '#374151',
//                     outline: 'none',
//                     width: '100%'
//                   }}
//                 >
//                   <option value="">All States</option>
//                   {states.map(state => (
//                     <option key={state} value={state}>{state}</option>
//                   ))}
//                 </select>

//                 <select
//                   value={filters.district}
//                   onChange={(e) => handleFilterChange('district', e.target.value)}
//                   style={{
//                     padding: '10px 12px',
//                     border: '1px solid #D1D5DB',
//                     borderRadius: '6px',
//                     fontSize: '14px',
//                     background: '#FFF',
//                     color: '#374151',
//                     outline: 'none',
//                     width: '100%'
//                   }}
//                 >
//                   <option value="">All Districts</option>
//                   {districts.map(district => (
//                     <option key={district} value={district}>{district}</option>
//                   ))}
//                 </select>

//                 <input
//                   type="text"
//                   placeholder="Pincode"
//                   value={filters.pincode}
//                   onChange={(e) => handleFilterChange('pincode', e.target.value)}
//                   style={{
//                     padding: '10px 12px',
//                     border: '1px solid #D1D5DB',
//                     borderRadius: '6px',
//                     fontSize: '14px',
//                     outline: 'none',
//                     width: '100%'
//                   }}
//                 />

//                 <select
//                   value={filters.vehicleType}
//                   onChange={(e) => handleFilterChange('vehicleType', e.target.value)}
//                   style={{
//                     padding: '10px 12px',
//                     border: '1px solid #D1D5DB',
//                     borderRadius: '6px',
//                     fontSize: '14px',
//                     background: '#FFF',
//                     color: '#374151',
//                     outline: 'none',
//                     width: '100%'
//                   }}
//                 >
//                   <option value="">All Vehicle Types</option>
//                   {vehicleTypes.map(type => (
//                     <option key={type} value={type}>{type}</option>
//                   ))}
//                 </select>

//                 <select
//                   value={filters.isActive}
//                   onChange={(e) => handleFilterChange('isActive', e.target.value)}
//                   style={{
//                     padding: '10px 12px',
//                     border: '1px solid #D1D5DB',
//                     borderRadius: '6px',
//                     fontSize: '14px',
//                     background: '#FFF',
//                     color: '#374151',
//                     outline: 'none',
//                     width: '100%'
//                   }}
//                 >
//                   {statusOptions.map(option => (
//                     <option key={option.value} value={option.value}>{option.label}</option>
//                   ))}
//                 </select>

//                 <select
//                   value={filters.rating}
//                   onChange={(e) => handleFilterChange('rating', e.target.value)}
//                   style={{
//                     padding: '10px 12px',
//                     border: '1px solid #D1D5DB',
//                     borderRadius: '6px',
//                     fontSize: '14px',
//                     background: '#FFF',
//                     color: '#374151',
//                     outline: 'none',
//                     width: '100%'
//                   }}
//                 >
//                   {ratingOptions.map(option => (
//                     <option key={option.value} value={option.value}>{option.label}</option>
//                   ))}
//                 </select>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div style={{
//           display: 'flex',
//           gap: '16px',
//           marginBottom: '20px',
//           flexDirection: isMobile ? 'column' : 'row',
//           flexWrap: 'wrap'
//         }}>
//           <StatCard
//             title="Total Transporters"
//             value={totalItems}
//             icon={<Hash size={20} />}
//             color="#3B82F6"
//           />
//           <StatCard
//             title="Active"
//             value={transporters.filter(t => t.isActive).length}
//             icon={<CheckCircle size={20} />}
//             color="#10B981"
//           />
//           <StatCard
//             title="Inactive"
//             value={transporters.filter(t => !t.isActive).length}
//             icon={<XCircle size={20} />}
//             color="#EF4444"
//           />
//           <StatCard
//             title="Avg. Rating"
//             value={(transporters.reduce((sum, t) => sum + t.rating, 0) / (transporters.length || 1)).toFixed(1)}
//             icon={<Star size={20} />}
//             color="#F59E0B"
//           />
//         </div>

//         {/* Transporters Table/Cards */}
//         <div style={{
//           background: '#FFF',
//           borderRadius: '8px',
//           overflow: 'hidden',
//           boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
//           marginBottom: '20px'
//         }}>
//           {loading ? (
//             <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>
//               Loading transporters...
//             </div>
//           ) : error ? (
//             <div style={{ padding: '40px', textAlign: 'center', color: '#EF4444' }}>
//               <AlertCircle size={24} style={{ marginBottom: '12px', margin: '0 auto' }} />
//               {error}
//             </div>
//           ) : transporters.length === 0 ? (
//             <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>
//               No transporters found matching your filters
//             </div>
//           ) : (
//             <>
//               {/* Desktop Table */}
//               {!isMobile && (
//                 <div style={{ overflowX: 'auto' }}>
//                   <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//                     <thead>
//                       <tr style={{ background: '#F9FAFB' }}>
//                         <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #E5E7EB' }}>Transporter</th>
//                         <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #E5E7EB' }}>Contact</th>
//                         <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #E5E7EB' }}>Location</th>
//                         <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #E5E7EB' }}>Vehicle Details</th>
//                         <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #E5E7EB' }}>Status & Rating</th>
//                         <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #E5E7EB' }}>Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {transporters.map((transporter) => (
//                         <DesktopTableRow key={transporter._id} transporter={transporter} />
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}

//               {/* Mobile Cards */}
//               {isMobile && (
//                 <div>
//                   {transporters.map((transporter) => (
//                     <MobileCard key={transporter._id} transporter={transporter} />
//                   ))}
//                 </div>
//               )}

//               <Pagination />
//             </>
//           )}
//         </div>
//       </main>

//       {/* Details Modal */}
//       {showDetailsModal && <DetailsModal />}
//     </div>
//   );
// };

// export default TransporterAdminPage;









// app/admin/transporters/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { getAdminSessionAction } from '@/app/actions/auth-actions';

import {
  Search,
  Filter,
  Download,
  Eye,
  MoreVertical,
  X,
  MapPin,
  Phone,
  Mail,
  User,
  Truck,
  Star,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  FileText,
  Calendar,
  Hash,
  AlertCircle,
  Edit,
  Trash2,
  Shield,
  CreditCard,
  Building,
  Smartphone,
  UserCheck,
  Map
} from 'lucide-react';

interface Transporter {
  _id: string;
  transporterId?: string;
  personalInfo: {
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
    location: string;
  };
  role?: string;
  transportInfo: {
    isCompany: boolean;
    vehicleType: string;
    vehicleCapacity: {
      value: number;
      unit: string;
    };
    vehicleNumber: string;
    vehicleDocuments: {
      rcBook: string | null;
      insuranceDoc: string | null;
      pollutionCert: string | null;
      permitDoc: string | null;
    };
    driverInfo: any;
    vehicles: any[];
  };
  bankDetails: {
    accountHolderName: string;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    branch: string;
    upiId: string;
  };
  documents: {
    panCard: string | null;
    aadharFront: string | null;
    aadharBack: string | null;
    bankPassbook: string | null;
    rcBook?: string | null;
    insuranceDoc?: string | null;
    pollutionCert?: string | null;
    permitDoc?: string | null;
    driverLicense?: string | null;
  };
  security: {
    referralCode: string;
  };
  isActive: boolean;
  rating: number;
  totalTrips: number;
  maxVehicles?: number;
  vehicleCount?: number;
  registeredAt: string;
  lastLogin?: string;
  __v?: number;
}

interface ApiResponse {
  success: boolean;
  data: Transporter[];
  count?: number;
  message?: string;
}

interface FilterOptions {
  search: string;
  state: string;
  district: string;
  pincode: string;
  vehicleType: string;
  isActive: string;
  rating: string;
}

interface UserSession {
  role: string;
  taluka: string;
}

const TransporterAdminPage: React.FC = () => {
  const [transporters, setTransporters] = useState<Transporter[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [selectedTransporter, setSelectedTransporter] = useState<Transporter | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [itemsPerPage] = useState<number>(10);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [states, setStates] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  
  // New state for user session
  const [user, setUser] = useState<UserSession | null>(null);
  const [filteredTransporters, setFilteredTransporters] = useState<Transporter[]>([]);
  const [isFilteringByTaluk, setIsFilteringByTaluk] = useState<boolean>(false);

  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    state: '',
    district: '',
    pincode: '',
    vehicleType: '',
    isActive: 'all',
    rating: 'all'
  });

  const vehicleTypes = [
    'Pickup Van',
    'Truck',
    'Mini Truck',
    'Container',
    'Trailer',
    'Lorry',
    'Tempo'
  ];

  const ratingOptions = [
    { value: 'all', label: 'All Ratings' },
    { value: '4-5', label: '4+ Stars' },
    { value: '3-4', label: '3+ Stars' },
    { value: '2-3', label: '2+ Stars' },
    { value: '0-2', label: 'Below 2' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];

  // Fetch user session on component mount
  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        const session = await getAdminSessionAction();
        if (session?.admin) {
          setUser({
            role: session.admin.role,
            taluka: session.admin.taluka || ''
          });
        }
      } catch (error) {
        console.error('Error fetching user session:', error);
      }
    };
    fetchUserSession();
  }, []);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Filter transporters by taluk for subadmin
  const filterTransportersByTaluk = useCallback((transportersList: Transporter[], userTaluk: string) => {
    if (!userTaluk) return transportersList;
    
    const filtered = transportersList.filter(transporter => 
      transporter.personalInfo.taluk?.toLowerCase() === userTaluk.toLowerCase()
    );
    
    setIsFilteringByTaluk(true);
    return filtered;
  }, []);

  // Apply all filters including taluk filter
  const applyAllFilters = useCallback((transportersList: Transporter[]) => {
    let result = transportersList;

    // Apply taluk filter for subadmin
    if (user?.role === 'subadmin' && user?.taluka) {
      result = filterTransportersByTaluk(result, user.taluka);
    }

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(transporter =>
        transporter.personalInfo.name?.toLowerCase().includes(searchLower) ||
        transporter.personalInfo.mobileNo?.includes(filters.search) ||
        transporter.transportInfo.vehicleNumber?.toLowerCase().includes(searchLower) ||
        transporter.personalInfo.email?.toLowerCase().includes(searchLower) ||
        transporter.transporterId?.toLowerCase().includes(searchLower)
      );
    }

    // Apply state filter
    if (filters.state) {
      result = result.filter(transporter =>
        transporter.personalInfo.state === filters.state
      );
    }

    // Apply district filter
    if (filters.district) {
      result = result.filter(transporter =>
        transporter.personalInfo.district === filters.district
      );
    }

    // Apply pincode filter
    if (filters.pincode) {
      result = result.filter(transporter =>
        transporter.personalInfo.pincode === filters.pincode
      );
    }

    // Apply vehicle type filter
    if (filters.vehicleType) {
      result = result.filter(transporter =>
        transporter.transportInfo.vehicleType === filters.vehicleType
      );
    }

    // Apply status filter
    if (filters.isActive !== 'all') {
      const isActive = filters.isActive === 'active';
      result = result.filter(transporter => transporter.isActive === isActive);
    }

    // Apply rating filter
    if (filters.rating !== 'all') {
      const [min, max] = filters.rating.split('-').map(Number);
      result = result.filter(transporter => {
        const rating = transporter.rating;
        return rating >= min && rating <= max;
      });
    }

    return result;
  }, [filters, user, filterTransportersByTaluk]);

  // Fetch transporters with filters
  const fetchTransporters = useCallback(async () => {
    setLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams();
      
      // Always include pagination
      params.append('page', currentPage.toString());
      params.append('limit', itemsPerPage.toString());
      
      // Add filters if they exist
      if (filters.search) params.append('search', filters.search);
      if (filters.state) params.append('state', filters.state);
      if (filters.district) params.append('district', filters.district);
      if (filters.pincode) params.append('pincode', filters.pincode);
      if (filters.vehicleType) params.append('vehicleType', filters.vehicleType);
      if (filters.isActive !== 'all') params.append('isActive', filters.isActive);
      if (filters.rating !== 'all') params.append('rating', filters.rating);

      const response = await axios.get<ApiResponse>(
        `https://kisan.etpl.ai/api/transporter/all`
      );

      if (response.data.success) {
        let transportersData = response.data.data || [];
        
        // Apply all filters including taluk filter
        const filteredData = applyAllFilters(transportersData);
        
        setTransporters(filteredData);
        setFilteredTransporters(filteredData);
        setTotalItems(filteredData.length);
        setTotalPages(Math.ceil(filteredData.length / itemsPerPage));

        // Extract unique states and districts from ALL transporters for filter dropdowns
        const uniqueStates = [...new Set(transportersData.map(t => t.personalInfo.state).filter(Boolean))];
        const uniqueDistricts = [...new Set(transportersData.map(t => t.personalInfo.district).filter(Boolean))];
        setStates(uniqueStates as string[]);
        setDistricts(uniqueDistricts as string[]);
      } else {
        setError(response.data.message || 'Failed to fetch transporters');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch transporters');
      console.error('Error fetching transporters:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters, itemsPerPage, applyAllFilters]);

  useEffect(() => {
    if (user) { // Only fetch when user session is loaded
      fetchTransporters();
    }
  }, [fetchTransporters, user]);

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      state: '',
      district: '',
      pincode: '',
      vehicleType: '',
      isActive: 'all',
      rating: 'all'
    });
    setCurrentPage(1);
  };

  // Function to get the correct document URL
  const getDocumentUrl = (documentUrl: string | null): string | null => {
    if (!documentUrl) return null;
    
    // If it's already a full URL, return it
    if (documentUrl.startsWith('http')) {
      return documentUrl;
    }
    
    // If it's a relative path starting with uploads/, construct the full URL
    if (documentUrl.startsWith('uploads/')) {
      // Replace backslashes with forward slashes
      const cleanPath = documentUrl.replace(/\\/g, '/');
      return `https://kisan.etpl.ai/${cleanPath}`;
    }
    
    // If it's just a filename, assume it's in uploads folder
    return `https://kisan.etpl.ai/uploads/${documentUrl}`;
  };

  const downloadDocument = async (documentUrl: string | null, documentName: string) => {
    const fullUrl = getDocumentUrl(documentUrl);
    
    if (!fullUrl) {
      alert('Document not available');
      return;
    }

    try {
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = fullUrl;
      link.setAttribute('download', `${documentName}_${new Date().getTime()}`);
      link.setAttribute('target', '_blank');
      
      // Add to document, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // For files that might need server-side processing, we can use fetch
      try {
        const response = await fetch(fullUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/octet-stream',
          },
        });
        
        if (response.ok) {
          const blob = await response.blob();
          const blobUrl = window.URL.createObjectURL(blob);
          
          const downloadLink = document.createElement('a');
          downloadLink.href = blobUrl;
          downloadLink.setAttribute('download', `${documentName}_${new Date().getTime()}.${documentUrl?.split('.').pop() || 'pdf'}`);
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          window.URL.revokeObjectURL(blobUrl);
        }
      } catch (fetchErr) {
        console.log('Using direct download link instead');
      }
    } catch (err) {
      console.error('Error downloading document:', err);
      alert('Failed to download document. Please try viewing it first.');
    }
  };

  const viewDocument = (documentUrl: string | null) => {
    const fullUrl = getDocumentUrl(documentUrl);
    
    if (!fullUrl) {
      alert('Document not available');
      return;
    }
    
    // Open in new tab
    window.open(fullUrl, '_blank', 'noopener,noreferrer');
  };

  const renderStars = (rating: number) => {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            fill={star <= rating ? '#FFD700' : '#E5E7EB'}
            color={star <= rating ? '#FFD700' : '#E5E7EB'}
          />
        ))}
        <span style={{ marginLeft: '4px', fontSize: '12px', color: '#6B7280' }}>
          ({rating.toFixed(1)})
        </span>
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDeactivate = async (transporterId: string, currentStatus: boolean) => {
    if (confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this transporter?`)) {
      try {
        const response = await axios.put(`https://kisan.etpl.ai/api/transporter/deactivate/${transporterId}`);
        if (response.data.success) {
          fetchTransporters(); // Refresh the list
          alert(`Transporter ${currentStatus ? 'deactivated' : 'activated'} successfully`);
        }
      } catch (err) {
        console.error('Error updating status:', err);
        alert('Failed to update transporter status');
      }
    }
  };

  // Pagination controls
  const Pagination = () => {
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, filteredTransporters.length);

    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '20px',
        padding: '10px 0',
        borderTop: '1px solid #E5E7EB',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? '16px' : '0'
      }}>
        <div style={{ color: '#6B7280', fontSize: '14px' }}>
          Showing {startItem} to {endItem} of {filteredTransporters.length} transporters
          {isFilteringByTaluk && user?.role === 'subadmin' && (
            <span style={{ marginLeft: '8px', color: '#059669', fontSize: '12px', fontStyle: 'italic' }}>
              (Filtered by taluk: {user.taluka})
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={{
              padding: '6px 12px',
              border: '1px solid #D1D5DB',
              borderRadius: '6px',
              background: '#FFF',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              opacity: currentPage === 1 ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '14px'
            }}
          >
            <ChevronLeft size={16} />
            {!isMobile && 'Previous'}
          </button>
          
          <div style={{ display: 'flex', gap: '4px' }}>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              if (pageNum < 1 || pageNum > totalPages) return null;

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  style={{
                    width: '32px',
                    height: '32px',
                    border: currentPage === pageNum ? '1px solid #3B82F6' : '1px solid #D1D5DB',
                    borderRadius: '6px',
                    background: currentPage === pageNum ? '#3B82F6' : '#FFF',
                    color: currentPage === pageNum ? '#FFF' : '#374151',
                    cursor: 'pointer',
                    fontWeight: currentPage === pageNum ? '600' : '400',
                    fontSize: '14px'
                  }}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={{
              padding: '6px 12px',
              border: '1px solid #D1D5DB',
              borderRadius: '6px',
              background: '#FFF',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              opacity: currentPage === totalPages ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '14px'
            }}
          >
            {!isMobile && 'Next'}
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  };

  // Get paginated transporters for current page
  const getPaginatedTransporters = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredTransporters.slice(startIndex, endIndex);
  };

  // Details Modal Component
  const DetailsModal = () => {
    if (!selectedTransporter) return null;

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
        overflow: 'auto'
      }}>
        <div style={{
          background: '#FFF',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '800px',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative'
        }}>
          {/* Header */}
          <div style={{
            padding: '20px',
            borderBottom: '1px solid #E5E7EB',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            position: 'sticky',
            top: 0,
            background: '#FFF',
            zIndex: 10
          }}>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', margin: 0 }}>
                {selectedTransporter.personalInfo.name}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px', flexWrap: 'wrap' }}>
                <span style={{
                  padding: '4px 12px',
                  background: selectedTransporter.isActive ? '#D1FAE5' : '#FEE2E2',
                  color: selectedTransporter.isActive ? '#065F46' : '#991B1B',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  {selectedTransporter.isActive ? <CheckCircle size={12} /> : <XCircle size={12} />}
                  {selectedTransporter.isActive ? 'Active' : 'Inactive'}
                </span>
                {selectedTransporter.transporterId && (
                  <span style={{
                    padding: '4px 12px',
                    background: '#E0F2FE',
                    color: '#075985',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    ID: {selectedTransporter.transporterId}
                  </span>
                )}
                {renderStars(selectedTransporter.rating)}
                {/* Show taluk info */}
                {selectedTransporter.personalInfo.taluk && (
                  <span style={{
                    padding: '4px 12px',
                    background: '#EDE9FE',
                    color: '#7C3AED',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Map size={12} />
                    Taluk: {selectedTransporter.personalInfo.taluk}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => setShowDetailsModal(false)}
              style={{
                padding: '8px',
                borderRadius: '50%',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: '#6B7280',
                flexShrink: 0
              }}
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div style={{ padding: '20px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px'
            }}>
              {/* Personal Info */}
              <div style={{
                background: '#F9FAFB',
                padding: '16px',
                borderRadius: '8px'
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User size={16} /> Personal Information
                </h3>
                <div style={{ display: 'grid', gap: '8px' }}>
                  <InfoRow label="Name" value={selectedTransporter.personalInfo.name} />
                  <InfoRow label="Mobile" value={selectedTransporter.personalInfo.mobileNo} icon={<Phone size={14} />} />
                  <InfoRow label="Email" value={selectedTransporter.personalInfo.email} icon={<Mail size={14} />} />
                  <InfoRow label="Address" value={selectedTransporter.personalInfo.address} icon={<MapPin size={14} />} />
                  <InfoRow label="Pincode" value={selectedTransporter.personalInfo.pincode} />
                  <InfoRow label="State" value={selectedTransporter.personalInfo.state} />
                  <InfoRow label="District" value={selectedTransporter.personalInfo.district} />
                  <InfoRow label="Taluk" value={selectedTransporter.personalInfo.taluk} />
                  <InfoRow label="Post" value={selectedTransporter.personalInfo.post} />
                  <InfoRow label="Village/Grama" value={selectedTransporter.personalInfo.villageGramaPanchayat} />
                </div>
              </div>

              {/* Transport Info */}
              <div style={{
                background: '#F9FAFB',
                padding: '16px',
                borderRadius: '8px'
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Truck size={16} /> Transport Information
                </h3>
                <div style={{ display: 'grid', gap: '8px' }}>
                  <InfoRow label="Company/Individual" value={selectedTransporter.transportInfo.isCompany ? 'Company' : 'Individual'} />
                  <InfoRow label="Vehicle Type" value={selectedTransporter.transportInfo.vehicleType} />
                  <InfoRow label="Vehicle Number" value={selectedTransporter.transportInfo.vehicleNumber} />
                  <InfoRow label="Vehicle Capacity" value={`${selectedTransporter.transportInfo.vehicleCapacity.value} ${selectedTransporter.transportInfo.vehicleCapacity.unit}`} />
                  <InfoRow label="Total Trips" value={selectedTransporter.totalTrips.toString()} />
                  {selectedTransporter.security?.referralCode && (
                    <InfoRow label="Referral Code" value={selectedTransporter.security.referralCode} icon={<Shield size={14} />} />
                  )}
                  {selectedTransporter.vehicleCount !== undefined && selectedTransporter.maxVehicles !== undefined && (
                    <InfoRow label="Vehicles" value={`${selectedTransporter.vehicleCount}/${selectedTransporter.maxVehicles}`} />
                  )}
                </div>
              </div>

              {/* Bank Details */}
              <div style={{
                background: '#F9FAFB',
                padding: '16px',
                borderRadius: '8px'
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CreditCard size={16} /> Bank Details
                </h3>
                <div style={{ display: 'grid', gap: '8px' }}>
                  <InfoRow label="Account Holder" value={selectedTransporter.bankDetails.accountHolderName} />
                  <InfoRow label="Bank Name" value={selectedTransporter.bankDetails.bankName} />
                  <InfoRow label="Account Number" value={selectedTransporter.bankDetails.accountNumber} />
                  <InfoRow label="IFSC Code" value={selectedTransporter.bankDetails.ifscCode} />
                  <InfoRow label="Branch" value={selectedTransporter.bankDetails.branch || 'N/A'} />
                  <InfoRow label="UPI ID" value={selectedTransporter.bankDetails.upiId || 'N/A'} />
                </div>
              </div>

              {/* Registration Info */}
              <div style={{
                background: '#F9FAFB',
                padding: '16px',
                borderRadius: '8px'
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={16} /> Registration Details
                </h3>
                <div style={{ display: 'grid', gap: '8px' }}>
                  <InfoRow label="Registered On" value={formatDate(selectedTransporter.registeredAt)} />
                  <InfoRow label="Status" value={selectedTransporter.isActive ? 'Active' : 'Inactive'} />
                  <InfoRow label="Rating" value={selectedTransporter.rating.toFixed(1)} />
                  <InfoRow label="Total Trips Completed" value={selectedTransporter.totalTrips.toString()} />
                  {selectedTransporter.lastLogin && (
                    <InfoRow label="Last Login" value={formatDate(selectedTransporter.lastLogin)} />
                  )}
                </div>
              </div>
            </div>

            {/* Documents Section */}
            <div style={{ marginTop: '20px' }}>
              <div style={{
                background: '#F9FAFB',
                padding: '16px',
                borderRadius: '8px'
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={16} /> Documents
                </h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  <DocumentSection
                    title="Vehicle Documents"
                    documents={[
                      { name: 'RC Book', url: selectedTransporter.transportInfo.vehicleDocuments.rcBook || selectedTransporter.documents.rcBook },
                      { name: 'Insurance', url: selectedTransporter.transportInfo.vehicleDocuments.insuranceDoc || selectedTransporter.documents.insuranceDoc },
                      { name: 'Pollution Certificate', url: selectedTransporter.transportInfo.vehicleDocuments.pollutionCert || selectedTransporter.documents.pollutionCert },
                      { name: 'Permit', url: selectedTransporter.transportInfo.vehicleDocuments.permitDoc || selectedTransporter.documents.permitDoc },
                      { name: 'Driver License', url: selectedTransporter.transportInfo.driverInfo?.driverLicense || selectedTransporter.documents.driverLicense }
                    ]}
                  />
                  <DocumentSection
                    title="Personal Documents"
                    documents={[
                      { name: 'PAN Card', url: selectedTransporter.documents.panCard },
                      { name: 'Aadhar Front', url: selectedTransporter.documents.aadharFront },
                      { name: 'Aadhar Back', url: selectedTransporter.documents.aadharBack },
                      { name: 'Bank Passbook', url: selectedTransporter.documents.bankPassbook }
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{
            padding: '16px 20px',
            borderTop: '1px solid #E5E7EB',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => handleDeactivate(selectedTransporter._id, selectedTransporter.isActive)}
              style={{
                padding: '8px 16px',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                background: '#FFF',
                color: selectedTransporter.isActive ? '#DC2626' : '#059669',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {selectedTransporter.isActive ? <XCircle size={16} /> : <CheckCircle size={16} />}
              {selectedTransporter.isActive ? 'Deactivate' : 'Activate'}
            </button>
            <button
              onClick={() => setShowDetailsModal(false)}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '6px',
                background: '#3B82F6',
                color: '#FFF',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Helper Components
  const InfoRow = ({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: '14px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
        {icon}
        {label}:
      </span>
      <span style={{ fontSize: '14px', fontWeight: '500', color: '#111827', maxWidth: '200px', textAlign: 'right', wordBreak: 'break-word' }}>
        {value || 'N/A'}
      </span>
    </div>
  );

  const DocumentSection = ({ title, documents }: { title: string; documents: Array<{ name: string; url: string | null }> }) => (
    <div>
      <h4 style={{ fontSize: '14px', fontWeight: '500', color: '#4B5563', marginBottom: '8px' }}>{title}</h4>
      <div style={{ display: 'grid', gap: '6px' }}>
        {documents.map((doc, index) => {
          const documentUrl = getDocumentUrl(doc.url);
          const hasDocument = !!documentUrl;
          
          return (
            <div key={index} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 12px',
              background: '#FFF',
              borderRadius: '6px',
              border: '1px solid #E5E7EB'
            }}>
              <span style={{ fontSize: '13px', color: hasDocument ? '#374151' : '#9CA3AF' }}>
                {doc.name}
                {!hasDocument && <span style={{ color: '#EF4444', marginLeft: '4px', fontSize: '12px' }}>(Not Uploaded)</span>}
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => viewDocument(doc.url)}
                  disabled={!hasDocument}
                  style={{
                    padding: '4px 8px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '4px',
                    background: '#FFF',
                    color: hasDocument ? '#374151' : '#9CA3AF',
                    cursor: hasDocument ? 'pointer' : 'not-allowed',
                    opacity: hasDocument ? 1 : 0.5,
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Eye size={12} /> View
                </button>
                <button
                  onClick={() => downloadDocument(doc.url, doc.name)}
                  disabled={!hasDocument}
                  style={{
                    padding: '4px 8px',
                    border: '1px solid #3B82F6',
                    borderRadius: '4px',
                    background: hasDocument ? '#EFF6FF' : '#F3F4F6',
                    color: hasDocument ? '#1D4ED8' : '#9CA3AF',
                    cursor: hasDocument ? 'pointer' : 'not-allowed',
                    opacity: hasDocument ? 1 : 0.5,
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Download size={12} /> Download
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Desktop Table Row
  const DesktopTableRow = ({ transporter }: { transporter: Transporter }) => (
    <tr style={{ borderBottom: '1px solid #E5E7EB', transition: 'background 0.2s' }}>
      <td style={{ padding: '16px' }}>
        <div>
          <div style={{ fontWeight: '500', color: '#111827' }}>{transporter.personalInfo.name}</div>
          <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>
            ID: {transporter.transporterId || transporter._id}
            {transporter.personalInfo.taluk && (
              <div style={{ marginTop: '2px', color: '#7C3AED' }}>
                Taluk: {transporter.personalInfo.taluk}
              </div>
            )}
          </div>
        </div>
      </td>
      <td style={{ padding: '16px' }}>
        <div style={{ fontSize: '14px', color: '#111827' }}>{transporter.personalInfo.mobileNo}</div>
        <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>
          {transporter.personalInfo.email}
        </div>
      </td>
      <td style={{ padding: '16px' }}>
        <div style={{ fontSize: '14px', color: '#111827' }}>
          {transporter.personalInfo.district}, {transporter.personalInfo.state}
        </div>
        <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <MapPin size={12} />
          Pincode: {transporter.personalInfo.pincode}
        </div>
      </td>
      <td style={{ padding: '16px' }}>
        <div style={{ fontWeight: '500', color: '#111827' }}>{transporter.transportInfo.vehicleNumber}</div>
        <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>
          {transporter.transportInfo.vehicleType} • {transporter.transportInfo.vehicleCapacity.value} {transporter.transportInfo.vehicleCapacity.unit}
        </div>
      </td>
      <td style={{ padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            padding: '2px 8px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '500',
            background: transporter.isActive ? '#D1FAE5' : '#FEE2E2',
            color: transporter.isActive ? '#065F46' : '#991B1B',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            {transporter.isActive ? 'Active' : 'Inactive'}
          </span>
          {renderStars(transporter.rating)}
        </div>
        <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
          Trips: {transporter.totalTrips} • Vehicles: {transporter.vehicleCount || 0}/{transporter.maxVehicles || 10}
        </div>
      </td>
      <td style={{ padding: '16px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => {
              setSelectedTransporter(transporter);
              setShowDetailsModal(true);
            }}
            style={{
              padding: '6px 12px',
              border: '1px solid #D1D5DB',
              borderRadius: '6px',
              background: '#FFF',
              color: '#374151',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Eye size={14} /> View
          </button>
        </div>
      </td>
    </tr>
  );

  // Mobile Card
  const MobileCard = ({ transporter }: { transporter: Transporter }) => (
    <div key={transporter._id} style={{
      padding: '16px',
      borderBottom: '1px solid #E5E7EB',
      background: '#FFF'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div>
          <div style={{ fontWeight: '600', color: '#111827', fontSize: '16px' }}>{transporter.personalInfo.name}</div>
          <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>ID: {transporter.transporterId || transporter._id.substring(0, 8)}...</div>
          {transporter.personalInfo.taluk && (
            <div style={{ fontSize: '11px', color: '#7C3AED', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '2px' }}>
              <Map size={10} />
              Taluk: {transporter.personalInfo.taluk}
            </div>
          )}
        </div>
        <span style={{
          padding: '2px 8px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '500',
          background: transporter.isActive ? '#D1FAE5' : '#FEE2E2',
          color: transporter.isActive ? '#065F46' : '#991B1B'
        }}>
          {transporter.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      <div style={{ display: 'grid', gap: '8px', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Phone size={14} style={{ color: '#6B7280', flexShrink: 0 }} />
          <span style={{ fontSize: '14px', color: '#111827' }}>{transporter.personalInfo.mobileNo}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Mail size={14} style={{ color: '#6B7280', flexShrink: 0 }} />
          <span style={{ fontSize: '14px', color: '#111827', wordBreak: 'break-all' }}>{transporter.personalInfo.email}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MapPin size={14} style={{ color: '#6B7280', flexShrink: 0 }} />
          <span style={{ fontSize: '14px', color: '#111827' }}>
            {transporter.personalInfo.district}, {transporter.personalInfo.state}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Truck size={14} style={{ color: '#6B7280', flexShrink: 0 }} />
          <span style={{ fontSize: '14px', color: '#111827' }}>
            {transporter.transportInfo.vehicleNumber} ({transporter.transportInfo.vehicleType})
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {renderStars(transporter.rating)}
          <span style={{ fontSize: '12px', color: '#6B7280' }}>
            {transporter.totalTrips} trips
          </span>
        </div>
        <button
          onClick={() => {
            setSelectedTransporter(transporter);
            setShowDetailsModal(true);
          }}
          style={{
            padding: '6px 12px',
            border: '1px solid #3B82F6',
            borderRadius: '6px',
            background: '#EFF6FF',
            color: '#1D4ED8',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '500'
          }}
        >
          View Details
        </button>
      </div>
    </div>
  );

  // Stat Card Component
  const StatCard = ({ title, value, icon, color }: { title: string; value: string | number; icon: React.ReactNode; color: string }) => (
    <div style={{
      background: '#FFF',
      padding: '16px',
      borderRadius: '8px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      flex: '1',
      minWidth: isMobile ? '100%' : '200px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '12px', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {title}
          </div>
          <div style={{ fontSize: '24px', fontWeight: '600', color: '#111827', marginTop: '4px' }}>
            {value}
          </div>
        </div>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '8px',
          background: `${color}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: color
        }}>
          {icon}
        </div>
      </div>
    </div>
  );

  // User role indicator component
  const UserRoleIndicator = () => {
    if (!user) return null;

    return (
      <div style={{
        background: user.role === 'admin' ? '#E0F2FE' : '#D1FAE5',
        padding: '8px 16px',
        borderRadius: '8px',
        marginBottom: '16px',
        border: `1px solid ${user.role === 'admin' ? '#BAE6FD' : '#A7F3D0'}`,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        color: user.role === 'admin' ? '#0369A1' : '#047857'
      }}>
        <UserCheck size={16} />
        <div>
          <strong>Logged in as: {user.role}</strong>
          {user.role === 'subadmin' && user.taluka && (
            <div style={{ fontSize: '13px', marginTop: '2px' }}>
              Viewing transporters from <strong>{user.taluka}</strong> taluk only
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F9FAFB'
    }}>
      {/* Header */}
      <header style={{
        background: '#FFF',
        borderBottom: '1px solid #E5E7EB',
        padding: isMobile ? '16px' : '20px'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h1 style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
            Transporters Management
          </h1>
          <p style={{ color: '#6B7280', fontSize: isMobile ? '12px' : '14px' }}>
            Manage and monitor all registered transporters
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: isMobile ? '16px' : '20px' }}>
        {/* User Role Indicator */}
        <UserRoleIndicator />

        {/* Filters Bar */}
        <div style={{
          background: '#FFF',
          borderRadius: '8px',
          padding: isMobile ? '12px' : '16px',
          marginBottom: '20px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Search Bar */}
            <div style={{ display: 'flex', gap: '12px', flexDirection: isMobile ? 'column' : 'row' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                <input
                  type="text"
                  placeholder="Search by name, mobile, vehicle number..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 40px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  style={{
                    padding: '10px 16px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    background: '#FFF',
                    color: '#374151',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    flex: isMobile ? 1 : 'auto'
                  }}
                >
                  <Filter size={16} />
                  {!isMobile && 'Filters'}
                  {Object.values(filters).some(filter => filter && filter !== 'all') && (
                    <span style={{
                      width: '20px',
                      height: '20px',
                      background: '#3B82F6',
                      color: '#FFF',
                      borderRadius: '50%',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {Object.values(filters).filter(f => f && f !== 'all').length}
                    </span>
                  )}
                </button>
                <button
                  onClick={resetFilters}
                  style={{
                    padding: '10px 16px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    background: '#FFF',
                    color: '#374151',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    flex: isMobile ? 1 : 'auto'
                  }}
                >
                  {isMobile ? 'Reset' : 'Reset Filters'}
                </button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '12px',
                paddingTop: '16px',
                borderTop: '1px solid #E5E7EB'
              }}>
                <select
                  value={filters.state}
                  onChange={(e) => handleFilterChange('state', e.target.value)}
                  style={{
                    padding: '10px 12px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    fontSize: '14px',
                    background: '#FFF',
                    color: '#374151',
                    outline: 'none',
                    width: '100%'
                  }}
                >
                  <option value="">All States</option>
                  {states.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>

                <select
                  value={filters.district}
                  onChange={(e) => handleFilterChange('district', e.target.value)}
                  style={{
                    padding: '10px 12px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    fontSize: '14px',
                    background: '#FFF',
                    color: '#374151',
                    outline: 'none',
                    width: '100%'
                  }}
                >
                  <option value="">All Districts</option>
                  {districts.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Pincode"
                  value={filters.pincode}
                  onChange={(e) => handleFilterChange('pincode', e.target.value)}
                  style={{
                    padding: '10px 12px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none',
                    width: '100%'
                  }}
                />

                <select
                  value={filters.vehicleType}
                  onChange={(e) => handleFilterChange('vehicleType', e.target.value)}
                  style={{
                    padding: '10px 12px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    fontSize: '14px',
                    background: '#FFF',
                    color: '#374151',
                    outline: 'none',
                    width: '100%'
                  }}
                >
                  <option value="">All Vehicle Types</option>
                  {vehicleTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>

                <select
                  value={filters.isActive}
                  onChange={(e) => handleFilterChange('isActive', e.target.value)}
                  style={{
                    padding: '10px 12px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    fontSize: '14px',
                    background: '#FFF',
                    color: '#374151',
                    outline: 'none',
                    width: '100%'
                  }}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>

                <select
                  value={filters.rating}
                  onChange={(e) => handleFilterChange('rating', e.target.value)}
                  style={{
                    padding: '10px 12px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    fontSize: '14px',
                    background: '#FFF',
                    color: '#374151',
                    outline: 'none',
                    width: '100%'
                  }}
                >
                  {ratingOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'flex',
          gap: '16px',
          marginBottom: '20px',
          flexDirection: isMobile ? 'column' : 'row',
          flexWrap: 'wrap'
        }}>
          <StatCard
            title="Total Transporters"
            value={filteredTransporters.length}
            icon={<Hash size={20} />}
            color="#3B82F6"
          />
          <StatCard
            title="Active"
            value={filteredTransporters.filter(t => t.isActive).length}
            icon={<CheckCircle size={20} />}
            color="#10B981"
          />
          <StatCard
            title="Inactive"
            value={filteredTransporters.filter(t => !t.isActive).length}
            icon={<XCircle size={20} />}
            color="#EF4444"
          />
          <StatCard
            title="Avg. Rating"
            value={(filteredTransporters.reduce((sum, t) => sum + t.rating, 0) / (filteredTransporters.length || 1)).toFixed(1)}
            icon={<Star size={20} />}
            color="#F59E0B"
          />
        </div>

        {/* Transporters Table/Cards */}
        <div style={{
          background: '#FFF',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          marginBottom: '20px'
        }}>
          {!user ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>
              Loading user information...
            </div>
          ) : loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>
              Loading transporters...
            </div>
          ) : error ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#EF4444' }}>
              <AlertCircle size={24} style={{ marginBottom: '12px', margin: '0 auto' }} />
              {error}
            </div>
          ) : filteredTransporters.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>
              {user.role === 'subadmin' && user.taluka ? (
                <div>
                  <p>No transporters found in <strong>{user.taluka}</strong> taluk</p>
                  <p style={{ fontSize: '14px', marginTop: '8px' }}>
                    Try adjusting your search filters
                  </p>
                </div>
              ) : (
                <p>No transporters found matching your filters</p>
              )}
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              {!isMobile && (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#F9FAFB' }}>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #E5E7EB' }}>Transporter</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #E5E7EB' }}>Contact</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #E5E7EB' }}>Location</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #E5E7EB' }}>Vehicle Details</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #E5E7EB' }}>Status & Rating</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #E5E7EB' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getPaginatedTransporters().map((transporter) => (
                        <DesktopTableRow key={transporter._id} transporter={transporter} />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Mobile Cards */}
              {isMobile && (
                <div>
                  {getPaginatedTransporters().map((transporter) => (
                    <MobileCard key={transporter._id} transporter={transporter} />
                  ))}
                </div>
              )}

              <Pagination />
            </>
          )}
        </div>
      </main>

      {/* Details Modal */}
      {showDetailsModal && <DetailsModal />}
    </div>
  );
};

export default TransporterAdminPage;