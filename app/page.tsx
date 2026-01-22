// // app/page.tsx
// import { redirect } from 'next/navigation';

// export default function HomePage() {
//   redirect('/dashboard');
//   return null;
// }
















// app/page.tsx
// import { redirect } from 'next/navigation';

// export default function HomePage() {
//   redirect('/dashboard');
//   return null;
// }







// "use client"

// import Image from 'next/image';
// import Link from 'next/link';
// import { useState, useEffect, useRef } from 'react';
// import { 
//   FaGooglePlay, FaShieldAlt, FaChartLine, FaMobileAlt, 
//   FaUsers, FaCloud, FaLock, FaShoppingCart, 
//   FaUserTie, FaHandshake, FaTruck, FaChevronRight, 
//   FaTimes, FaDatabase, FaClipboardCheck, FaBell,
//   FaChevronLeft, FaChevronRight as FaChevronRightIcon,
//   FaUser, FaWallet, FaBell as FaNotification, FaLeaf, FaSeedling,
  
//   FaUserPlus, FaStore, FaTractor, FaMoneyBillWave,
//   FaHandsHelping, FaShippingFast
// } from 'react-icons/fa';
// import { GiFarmer, GiWheat, GiPlantWatering, GiCowled } from 'react-icons/gi';
// ;

// export default function LandingPage() {
//   const [isPanelOpen, setIsPanelOpen] = useState(false);
//   const [selectedRole, setSelectedRole] = useState<string | null>(null);
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [isAutoPlaying, setIsAutoPlaying] = useState(true);
//   const sliderRef = useRef<NodeJS.Timeout | null>(null);

//   const dashboardData = {
//     totalFarmers: 37,
//     registeredUsers: 34,
//     pendingOrders: 4,
//     awaitingAction: 7,
//     totalAgents: 34,
//     activeAgents: 25,
//     completedOrders: 7,
//     successfulDeliveries: 21,
//     totalTransports: 25,
//     registeredTransports: 25,
//     labourRequests: 21,
//     pendingLabour: 77,
//     activeTransports: 25,
//     activeVehicles: 20,
//     activePostings: 77,
//     cropListings: 8,
//     totalOrders: 20,
//     overallOrders: 20,
//     totalCategories: 8,
//     availableCategories: 8
//   };

//   // Phone screen images with detailed descriptions from your images
//   const phoneScreens = [
//     {
//       id: 1,
//       image: '/assets/phone.PNG',
//       title: 'Role Selection',
//       description: 'Welcome to Kisan Partner - Choose your role to continue',
//       features: ['Farmer: Grow - Sell - Manage', 'Trader: Buy - Sell - Settle', 'Employee: Walk - Track - Assist', 'Partner: Network - Grow', 'Transport: Fleet - Loads - PDD'],
//       icon: FaUser,
//       color: 'text-green-600'
//     },
//     {
//       id: 2,
//       image: '/assets/phone1.PNG',
//       title: 'Farmer Login',
//       description: 'Login to your farmer account using multiple options',
//       features: ['Phone Number Login', 'Send OTP via WhatsApp', 'Use MPIN', 'Login using password'],
//       icon: FaUser,
//       color: 'text-blue-600'
//     },
//     {
//       id: 3,
//       image: '/assets/phone2.PNG',
//       title: 'Farmer Dashboard',
//       description: 'Premium Quality - Get more profit here',
//       features: ['Recent Crop Photos', 'Post Crop', 'My Crop', 'My Orders', 'Labour', 'Loans', 'Market', 'Crop Care', 'Shopping', 'Gov Scheme'],
//       icon: GiFarmer,
//       color: 'text-emerald-600'
//     },
//     {
//       id: 4,
//       image: '/assets/phone3.PNG',
//       title: 'My Profile',
//       description: 'Rajesh Kumar - Village: Rampur, Block: Kolar',
//       features: ['Wallet Balance: ₹12,500', 'View Transactions', 'New Listing', 'Post Crop', 'Notifications', 'Pending Actions', 'Recent Messages'],
//       icon: FaWallet,
//       color: 'text-purple-600'
//     },
//     {
//       id: 5,
//       image: '/assets/phone4.PNG',
//       title: 'Marketplace',
//       description: 'Browse fresh agricultural products',
//       features: ['Change Location', 'Limited Time Offers', 'Browse Categories: Vegetables, Fruits, Dairy, Groceries', 'Post Requirement', 'All Crops', 'My Orders', 'Featured Products'],
//       icon: FaStore,
//       color: 'text-amber-600'
//     },
//     {
//       id: 6,
//       image: '/assets/phone5.PNG',
//       title: 'Available Products',
//       description: 'Cow - Farmer Details and Product Information',
//       features: ['Farmer: Demofarmer', 'Place: Dhsi, Tankere, Chickmagalur', 'Category: Livestock', 'Date: 23/01/2026', 'Time: 19:55', 'View All Grades & Offers'],
//       icon: GiCowled,
//       color: 'text-red-600'
//     },
//     {
//       id: 7,
//       image: '/assets/phone6.PNG',
//       title: 'Add New Labourer',
//       description: 'Register new agricultural labourer',
//       features: ['Name*', 'Village Name*', 'Contact Number', 'Work Types', 'Experience', 'Availability', 'Address'],
//       icon: FaUserPlus,
//       color: 'text-indigo-600'
//     }
//   ];

//   const roles = [
//     {
//       id: 'farmer',
//       title: 'Farmer',
//       description: 'Grow - Sell - Manage',
//       icon: GiFarmer,
//       color: 'text-green-500',
//       bgColor: 'bg-green-50',
//       features: ['Crop Management', 'Monitor Access']
//     },
//     {
//       id: 'trader',
//       title: 'Trader',
//       description: 'Buy - Sell - Swipe',
//       icon: FaShoppingCart,
//       color: 'text-blue-500',
//       bgColor: 'bg-blue-50',
//       features: ['Work-time Scheduling', 'Inventory', 'Settlement']
//     },
//     {
//       id: 'employee',
//       title: 'Employee',
//       description: 'Work - Track - Assist',
//       icon: FaUserTie,
//       color: 'text-purple-500',
//       bgColor: 'bg-purple-50',
//       features: ['Task Management', 'Reports']
//     },
//     {
//       id: 'partner',
//       title: 'Partner',
//       description: 'Network - Grow',
//       icon: FaHandshake,
//       color: 'text-amber-500',
//       bgColor: 'bg-amber-50',
//       features: ['Collaboration', 'Growth Tools', 'Resources']
//     },
//     {
//       id: 'transport',
//       title: 'Transport',
//       description: 'Fleet - Loads - POD',
//       icon: FaTruck,
//       color: 'text-red-500',
//       bgColor: 'bg-red-50',
//       features: ['Load Tracking', 'Delivery Proof']
//     }
//   ];

//   const statsCards = [
//     { label: 'Total Farmers', value: dashboardData.totalFarmers, icon: GiFarmer, color: 'text-green-600', bgColor: 'bg-green-100' },
//     { label: 'Active Agents', value: dashboardData.activeAgents, icon: FaUserTie, color: 'text-blue-600', bgColor: 'bg-blue-100' },
//     { label: 'Pending Orders', value: dashboardData.pendingOrders, icon: FaClipboardCheck, color: 'text-amber-600', bgColor: 'bg-amber-100' },
//     { label: 'Completed Orders', value: dashboardData.completedOrders, icon: FaClipboardCheck, color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
//     { label: 'Active Transports', value: dashboardData.activeTransports, icon: FaTruck, color: 'text-red-600', bgColor: 'bg-red-100' },
//     { label: 'Labour Requests', value: dashboardData.labourRequests, icon: FaUsers, color: 'text-purple-600', bgColor: 'bg-purple-100' },
//   ];

//   // Auto-slide functionality
//   useEffect(() => {
//     if (isAutoPlaying) {
//       sliderRef.current = setInterval(() => {
//         setCurrentSlide((prev) => (prev + 1) % phoneScreens.length);
//       }, 5000);
//     }

//     return () => {
//       if (sliderRef.current) {
//         clearInterval(sliderRef.current);
//       }
//     };
//   }, [isAutoPlaying, phoneScreens.length]);

//   const nextSlide = () => {
//     setCurrentSlide((prev) => (prev + 1) % phoneScreens.length);
//     if (sliderRef.current) {
//       clearInterval(sliderRef.current);
//     }
//   };

//   const prevSlide = () => {
//     setCurrentSlide((prev) => (prev - 1 + phoneScreens.length) % phoneScreens.length);
//     if (sliderRef.current) {
//       clearInterval(sliderRef.current);
//     }
//   };

//   const goToSlide = (index: number) => {
//     setCurrentSlide(index);
//     if (sliderRef.current) {
//       clearInterval(sliderRef.current);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
//       {/* Navigation */}
//       <nav className="bg-white shadow-md sticky top-0 z-50">
//         <div className="container mx-auto px-6 py-4">
//           <div className="flex justify-between items-center">
//             <div className="flex items-center space-x-3">
//               <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
//                 <GiWheat className="text-white text-xl" />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-800">KISAN<span className="text-green-600">Partner</span></h1>
//                 <p className="text-sm text-gray-600">Digital Agriculture Platform</p>
//               </div>
//             </div>
            
//             <div className="flex items-center space-x-6">
//               <button 
//                 onClick={() => setIsPanelOpen(true)}
//                 className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
//               >
//                 <FaChartLine className="text-sm" />
//                 <span>Dashboard</span>
//               </button>
//               <Link 
//                 href="/admin/login" 
//                 className="flex items-center space-x-2 border-2 border-green-600 text-green-600 hover:bg-green-50 px-6 py-3 rounded font-medium transition-all duration-300 hover:shadow-md"
//               >
//                 <FaLock className="text-sm" />
//                 <span>Admin Login</span>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <section className="relative py-16 overflow-hidden">
//         <div className="absolute inset-0 bg-gradient-to-r from-green-50/40 to-emerald-50/40"></div>
//         <div className="container mx-auto px-6 relative">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
//             <div className="animate-fadeIn lg:pl-7">
//               <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-6">
//                 <FaBell className="mr-2 animate-pulse" />
//                 Revolutionizing Agriculture
//               </div>
//               <h1 className="text-5xl md:text-6xl font-bold text-gray-800 leading-tight mb-6">
//                 Welcome to 
//                 <span className="text-green-600 block">Kisan Partner</span>
//               </h1>
//               <p className="text-gray-600 text-lg mb-8 leading-relaxed">
//                 Choose your role to continue. Your role determines the features and dashboard 
//                 you'll receive. You can switch roles later in settings.
//               </p>
              
//               <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
//                 {roles.map((role) => (
//                   <button
//                     key={role.id}
//                     onClick={() => setSelectedRole(role.id)}
//                     className={`p-4 rounded-xl text-left transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${
//                       selectedRole === role.id 
//                         ? 'ring-2 ring-green-500 bg-white shadow-md' 
//                         : 'bg-white/80 hover:bg-white'
//                     }`}
//                   >
//                     <div className="flex items-start space-x-3">
//                       <div className={`p-3 rounded ${role.bgColor}`}>
//                         <role.icon className={`text-xl ${role.color}`} />
//                       </div>
//                       <div>
//                         <h3 className="font-bold text-gray-800">{role.title}</h3>
//                         <p className="text-sm text-gray-600">{role.description}</p>
//                       </div>
//                     </div>
//                   </button>
//                 ))}
//               </div>

//               <div className="flex flex-col sm:flex-row gap-4">
//                 <Link 
//                   href="https://play.google.com/store/apps/details?id=com.kisan.app" 
//                   target="_blank"
//                   className="inline-flex items-center justify-center bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 animate-bounce-gentle"
//                 >
//                   <FaGooglePlay className="mr-3 text-2xl" />
//                   <div className="text-left">
//                     <div className="text-sm font-medium">Download on</div>
//                     <div className="text-xl font-bold">Google Play</div>
//                   </div>
//                 </Link>
                
//                 <button 
//                   onClick={() => setIsPanelOpen(true)}
//                   className="inline-flex items-center justify-center border-2 border-green-600 text-green-600 hover:bg-green-50 px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-md"
//                 >
//                   <FaMobileAlt className="mr-3" />
//                   View Dashboard
//                 </button>
//               </div>
//             </div>
            
//             <div className="relative animate-slideIn">
//               {/* Phone Mockup with Slider */}
//               <div className="relative h-[600px] w-full flex items-center justify-center">
//                 {/* Decorative background elements */}
//                 <div className="absolute -top-10 -right-10 w-64 h-64 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
//                 <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                
//                 {/* Phone Mockup Container */}
//                 <div className="relative w-72 h-[520px] bg-gradient-to-br from-gray-900 to-black rounded-[30px] p-2 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
//                   <div className="h-full bg-gradient-to-b from-green-50 to-white rounded-[25px] overflow-hidden relative">
//                     {/* Phone notch */}
//                     <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-5 bg-black rounded-b-lg z-10"></div>
                    
//                     {/* Slider Container */}
//                     <div className="h-full overflow-hidden relative">
//                       {/* Slides */}
//                       {phoneScreens.map((screen, index) => (
//                         <div
//                           key={screen.id}
//                           className={`absolute inset-0 transition-all duration-700 ${
//                             index === currentSlide 
//                               ? 'opacity-100 translate-x-0' 
//                               : 'opacity-0 translate-x-full pointer-events-none'
//                           }`}
//                         >
//                           <div className="h-full flex flex-col">
//                             {/* Image Container */}
//                             <div className="flex-1 relative overflow-hidden bg-gradient-to-b from-green-50 to-white p-1">
//                               <div className="relative w-full h-full">
//                                 <Image
//                                   src={screen.image}
//                                   alt={screen.title}
//                                   fill
//                                   className="object-contain"
//                                   sizes="(max-width: 280px) 100vw"
//                                   priority={index === 0}
//                                 />
//                               </div>
//                             </div>
                            
//                             {/* Description */}
//                             <div className="p-4 bg-white/95 backdrop-blur-sm border-t border-green-100">
//                               <div className="flex items-center space-x-3 mb-3">
//                                 <div className={`p-2 rounded bg-${screen.color.split('-')[1]}-50`}>
//                                   <screen.icon className={`text-lg ${screen.color}`} />
//                                 </div>
//                                 <div>
//                                   <h3 className="font-bold text-lg text-gray-800">{screen.title}</h3>
//                                   <p className="text-sm text-gray-600 line-clamp-1">{screen.description}</p>
//                                 </div>
//                               </div>
//                               <div className="flex flex-wrap gap-1 mb-2">
//                                 {screen.features.slice(0, 3).map((feature, idx) => (
//                                   <span 
//                                     key={idx}
//                                     className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full border border-green-200"
//                                   >
//                                     {feature}
//                                   </span>
//                                 ))}
//                                 {screen.features.length > 3 && (
//                                   <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
//                                     +{screen.features.length - 3} more
//                                   </span>
//                                 )}
//                               </div>
//                               <div className="text-xs text-gray-500 text-center">
//                                 Slide {screen.id} of {phoneScreens.length}
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
                      
//                       {/* Slider Controls */}
//                       <button 
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           prevSlide();
//                         }}
//                         className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 z-20 hover:scale-110"
//                       >
//                         <FaChevronLeft className="text-gray-700" />
//                       </button>
                      
//                       <button 
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           nextSlide();
//                         }}
//                         className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 z-20 hover:scale-110"
//                       >
//                         <FaChevronRightIcon className="text-gray-700" />
//                       </button>
                      
//                       {/* Slide Indicators */}
//                       <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
//                         {phoneScreens.map((_, index) => (
//                           <button
//                             key={index}
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               goToSlide(index);
//                             }}
//                             className={`w-2 h-2 rounded-full transition-all duration-300 ${
//                               index === currentSlide 
//                                 ? 'bg-green-600 w-6' 
//                                 : 'bg-gray-300 hover:bg-gray-400'
//                             }`}
//                           />
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Dashboard Section with Fixed Image */}
//       <section className="py-20 ">
//         <div className="container mx-auto px-6">
//           <div className="text-center mb-12">
//             <h2 className="text-4xl font-bold text-gray-800 mb-4">
//               Platform Dashboard Overview
//             </h2>
//             <p className="text-gray-600 text-lg max-w-2xl mx-auto">
//               Comprehensive insights and analytics for effective agricultural management
//             </p>
//           </div>

//           {/* Main Dashboard Image - Fixed Size */}
//           <div className="relative rounded overflow-hidden  mb-12 group bg-gradient-to-r from-green-50 to-emerald-50 p-1">
//             <div className="relative w-full h-[400px] md:h-[600px] rounded overflow-hidden">
//               <div className="absolute inset-0  z-10"></div>
//               <Image
//                 src="/assets/dashboard.PNG"
//                 alt="Admin Dashboard"
//                 fill
//                 className="object-contain"
//                 sizes="(max-width: 1200px) 100vw, 1200px"
//                 priority
//               />
//             </div>
            
//             {/* Dashboard Overlay Info */}
//             <div className="absolute bottom-0 left-0 h-[40%] right-0 bg-gradient-to-t from-black/70 to-transparent p-6 z-20">
//               <h3 className="text-2xl font-bold text-white mb-2">Admin Dashboard</h3>
//               <p className="text-green-100 text-sm md:text-base">
//                 Real-time monitoring of platform activities, user statistics, and operational metrics
//               </p>
//             </div>
//           </div>

//           {/* Stats Cards */}
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
//             {statsCards.map((stat, index) => (
//               <div 
//                 key={stat.label}
//                 className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fadeIn border border-green-100"
//                 style={{ animationDelay: `${index * 100}ms` }}
//               >
//                 <div className="flex items-center justify-between mb-3 md:mb-4">
//                   <div className={`p-2 md:p-3 rounded md:rounded-xl ${stat.bgColor}`}>
//                     <stat.icon className={`text-lg md:text-2xl ${stat.color}`} />
//                   </div>
//                   <span className="text-2xl md:text-3xl font-bold text-gray-800">{stat.value}</span>
//                 </div>
//                 <h3 className="text-sm md:text-lg font-semibold text-gray-700">{stat.label}</h3>
//                 <p className="text-xs md:text-sm text-gray-500 mt-1 md:mt-2">Updated in real-time</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* App Features Section */}
//       <section className="py-20">
//         <div className="container mx-auto px-6">
//           <div className="text-center mb-16">
//             <h2 className="text-4xl font-bold text-gray-800 mb-4">
//               Complete Agricultural Solution
//             </h2>
//             <p className="text-gray-600 text-lg max-w-2xl mx-auto">
//               Everything you need for modern agricultural management in one place
//             </p>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {[
//               {
//                 icon: GiFarmer,
//                 title: "Farm Management",
//                 description: "Complete crop tracking, monitoring, and management tools",
//                 color: "text-green-600",
//                 bgColor: "bg-green-100"
//               },
//               {
//                 icon: FaShoppingCart,
//                 title: "Marketplace",
//                 description: "Buy and sell agricultural products with secure transactions",
//                 color: "text-blue-600",
//                 bgColor: "bg-blue-100"
//               },
//               {
//                 icon: FaMoneyBillWave,
//                 title: "Financial Services",
//                 description: "Loans, insurance, and financial management tools",
//                 color: "text-amber-600",
//                 bgColor: "bg-amber-100"
//               },
//               {
//                 icon: FaTractor,
//                 title: "Labour Management",
//                 description: "Find, hire, and manage agricultural labourers",
//                 color: "text-purple-600",
//                 bgColor: "bg-purple-100"
//               },
//               {
//                 icon: FaShippingFast,
//                 title: "Transport & Logistics",
//                 description: "End-to-end transport and delivery solutions",
//                 color: "text-red-600",
//                 bgColor: "bg-red-100"
//               },
//               {
//                 icon: FaChartLine,
//                 title: "Analytics & Reports",
//                 description: "Market trends, weather data, and performance analytics",
//                 color: "text-emerald-600",
//                 bgColor: "bg-emerald-100"
//               },
//               {
//                 icon: FaHandsHelping,
//                 title: "Government Schemes",
//                 description: "Access to government agricultural schemes and subsidies",
//                 color: "text-indigo-600",
//                 bgColor: "bg-indigo-100"
//               },
//               {
//                 icon: FaLeaf,
//                 title: "Crop Care",
//                 description: "Pest control, fertilizers, and crop advisory services",
//                 color: "text-lime-600",
//                 bgColor: "bg-lime-100"
//               }
//             ].map((feature, index) => (
//               <div 
//                 key={index}
//                 className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100 transform hover:-translate-y-2 animate-fadeIn"
//                 style={{ animationDelay: `${index * 100}ms` }}
//               >
//                 <div className={`w-12 h-12 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-4`}>
//                   <feature.icon className={`text-2xl ${feature.color}`} />
//                 </div>
//                 <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
//                 <p className="text-gray-600 text-sm leading-relaxed">
//                   {feature.description}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Dashboard Side Panel */}
//       <div className={`fixed inset-y-0 right-0 w-full md:w-1/2 lg:w-1/3 bg-white shadow-2xl z-50 transform transition-transform duration-500 ${
//         isPanelOpen ? 'translate-x-0' : 'translate-x-full'
//       }`}>
//         <div className="h-full overflow-y-auto">
//           {/* Panel Header */}
//           <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-700 text-white p-6">
//             <div className="flex justify-between items-center mb-6">
//               <div className="flex items-center space-x-3">
//                 <FaChartLine className="text-2xl" />
//                 <div>
//                   <h2 className="text-2xl font-bold">Admin Dashboard</h2>
//                   <p className="text-green-100 text-sm">Real-time Platform Analytics</p>
//                 </div>
//               </div>
//               <button 
//                 onClick={() => setIsPanelOpen(false)}
//                 className="p-2 hover:bg-white/20 rounded transition-colors"
//               >
//                 <FaTimes className="text-xl" />
//               </button>
//             </div>
            
//             <div className="grid grid-cols-2 gap-4">
//               <div className="bg-white/20 p-3 rounded backdrop-blur-sm">
//                 <div className="text-2xl font-bold">{dashboardData.totalFarmers}</div>
//                 <div className="text-sm text-green-100">Total Farmers</div>
//               </div>
//               <div className="bg-white/20 p-3 rounded backdrop-blur-sm">
//                 <div className="text-2xl font-bold">{dashboardData.totalOrders}</div>
//                 <div className="text-sm text-green-100">Processed Orders</div>
//               </div>
//             </div>
//           </div>

//           {/* Dashboard Content */}
//           <div className="p-6">
//             {/* Role Selection */}
//             <div className="mb-8">
//               <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
//                 <FaUserTie className="mr-2 text-green-600" />
//                 Select Your Role
//               </h3>
//               <div className="space-y-3">
//                 {roles.map((role) => (
//                   <div 
//                     key={role.id}
//                     onClick={() => setSelectedRole(role.id)}
//                     className={`p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
//                       selectedRole === role.id 
//                         ? 'border-green-500 bg-green-50' 
//                         : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
//                     }`}
//                   >
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center space-x-3">
//                         <div className={`p-2 rounded ${role.bgColor}`}>
//                           <role.icon className={`text-lg ${role.color}`} />
//                         </div>
//                         <div>
//                           <h4 className="font-bold text-gray-800">{role.title}</h4>
//                           <p className="text-sm text-gray-600">{role.description}</p>
//                         </div>
//                       </div>
//                       <FaChevronRight className="text-gray-400" />
//                     </div>
//                     {role.features && (
//                       <div className="mt-3 flex flex-wrap gap-2">
//                         {role.features.map((feature, idx) => (
//                           <span 
//                             key={idx}
//                             className="px-2 py-1 bg-white text-xs text-gray-600 rounded border"
//                           >
//                             {feature}
//                           </span>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Dashboard Stats */}
//             <div className="mb-8">
//               <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
//                 <FaDatabase className="mr-2 text-green-600" />
//                 Platform Statistics
//               </h3>
//               <div className="grid grid-cols-2 gap-3">
//                 {[
//                   { label: 'Registered Users', value: dashboardData.registeredUsers },
//                   { label: 'Pending Orders', value: dashboardData.pendingOrders },
//                   { label: 'Orders Awaiting Action', value: dashboardData.awaitingAction },
//                   { label: 'Total Agents', value: dashboardData.totalAgents },
//                   { label: 'Active Agents', value: dashboardData.activeAgents },
//                   { label: 'Successful Deliveries', value: dashboardData.successfulDeliveries },
//                   { label: 'Total Transports', value: dashboardData.totalTransports },
//                   { label: 'Registered Transports', value: dashboardData.registeredTransports },
//                   { label: 'Pending Labour Requests', value: dashboardData.pendingLabour },
//                   { label: 'Active Transport Vehicles', value: dashboardData.activeVehicles },
//                   { label: 'Current Crop Listings', value: dashboardData.cropListings },
//                   { label: 'Product Categories', value: dashboardData.totalCategories },
//                 ].map((stat, index) => (
//                   <div 
//                     key={index}
//                     className="bg-gray-50 p-3 rounded hover:bg-gray-100 transition-colors"
//                   >
//                     <div className="text-xl font-bold text-gray-800">{stat.value}</div>
//                     <div className="text-xs text-gray-600 truncate">{stat.label}</div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Footer Note */}
//             <div className="mt-8 p-4 bg-green-50 rounded">
//               <p className="text-sm text-gray-600">
//                 <strong>Note:</strong> Your role determines the features and dashboard you'll receive. 
//                 You can switch roles later in settings.
//               </p>
//             </div>

//             <div className="mt-6 text-center text-gray-500 text-sm">
//               <p>© 2024 Kisan Partner. All rights reserved</p>
//               <p className="mt-2">
//                 Need help? Contact <a href="mailto:support@kisagroup.com" className="text-green-600 hover:underline">support@kisagroup.com</a>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Overlay for panel */}
//       {isPanelOpen && (
//         <div 
//           className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
//           onClick={() => setIsPanelOpen(false)}
//         />
//       )}

//       {/* Footer */}
//       <footer className="bg-gray-900 text-white py-12">
//         <div className="container mx-auto px-6">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//             <div>
//               <div className="flex items-center space-x-3 mb-6">
//                 <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
//                   <GiWheat className="text-white" />
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-bold">KISAN Partner</h3>
//                   <p className="text-green-300 text-sm">Digital Agriculture</p>
//                 </div>
//               </div>
//               <p className="text-gray-400">
//                 Empowering farmers with technology-driven solutions for sustainable agriculture.
//               </p>
//             </div>
            
//             <div>
//               <h4 className="text-lg font-bold mb-6">Quick Links</h4>
//               <ul className="space-y-3 text-gray-400">
//                 <li><button onClick={() => setIsPanelOpen(true)} className="hover:text-green-400 transition">Dashboard</button></li>
//                 <li><Link href="/admin/login" className="hover:text-green-400 transition">Login</Link></li>
              
//               </ul>
//             </div>
            
//             <div>
//               <h4 className="text-lg font-bold mb-6">Contact</h4>
//               <ul className="space-y-3 text-gray-400">
//                 <li>Email: support@kisagroup.com</li>
//                 <li>Phone: +91 98765 43210</li>
//                 <li>Office Hours: 9 AM - 6 PM IST</li>
//               </ul>
//             </div>
            
//             <div>
//               <h4 className="text-lg font-bold mb-6">Download App</h4>
//               <Link 
//                 href="https://play.google.com/store/apps/details?id=com.kisan.app" 
//                 target="_blank"
//                 className="inline-flex items-center bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded transition-all duration-300 transform hover:-translate-y-1"
//               >
//                 <FaGooglePlay className="mr-3 text-xl" />
//                 <div>
//                   <div className="text-sm">Available on</div>
//                   <div className="font-bold">Google Play</div>
//                 </div>
//               </Link>
//             </div>
//           </div>
          
//           <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
//             <p>© {new Date().getFullYear()} Kisan Partner. All rights reserved.</p>
//           </div>
//         </div>
//       </footer>

//       {/* Custom Styles */}
//       <style jsx global>{`
//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(20px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
        
//         @keyframes slideIn {
//           from { opacity: 0; transform: translateX(50px); }
//           to { opacity: 1; transform: translateX(0); }
//         }
        
//         @keyframes blob {
//           0% { transform: translate(0px, 0px) scale(1); }
//           33% { transform: translate(30px, -50px) scale(1.1); }
//           66% { transform: translate(-20px, 20px) scale(0.9); }
//           100% { transform: translate(0px, 0px) scale(1); }
//         }
        
//         @keyframes bounce-gentle {
//           0%, 100% { transform: translateY(0); }
//           50% { transform: translateY(-10px); }
//         }
        
//         .animate-fadeIn {
//           animation: fadeIn 0.8s ease-out;
//         }
        
//         .animate-slideIn {
//           animation: slideIn 0.8s ease-out;
//         }
        
//         .animate-blob {
//           animation: blob 7s infinite;
//         }
        
//         .animate-bounce-gentle {
//           animation: bounce-gentle 2s infinite;
//         }
        
//         .animation-delay-2000 {
//           animation-delay: 2s;
//         }
        
//         .line-clamp-1 {
//           overflow: hidden;
//           display: -webkit-box;
//           -webkit-box-orient: vertical;
//           -webkit-line-clamp: 1;
//         }
//       `}</style>
//     </div>
//   );
// }































"use client"

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { 
  FaGooglePlay, FaShieldAlt, FaChartLine, FaMobileAlt, 
  FaUsers, FaCloud, FaLock, FaShoppingCart, 
  FaUserTie, FaHandshake, FaTruck, FaChevronRight, 
  FaTimes, FaDatabase, FaClipboardCheck, FaBell,
  FaChevronLeft, FaChevronRight as FaChevronRightIcon,
  FaUser, FaWallet, FaBell as FaNotification, FaLeaf, FaSeedling,
  FaUserPlus, FaStore, FaTractor, FaMoneyBillWave,
  FaHandsHelping, FaShippingFast, FaArrowRight, FaCheck,
  FaPhoneAlt, FaMapMarkerAlt, FaBars
} from 'react-icons/fa';
import { GiFarmer, GiWheat, GiPlantWatering, GiCowled } from 'react-icons/gi';

export default function LandingPage() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isMobileView, setIsMobileView] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const sliderRef = useRef<NodeJS.Timeout | null>(null);

  // Check for mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const dashboardData = {
    totalFarmers: 37,
    registeredUsers: 34,
    pendingOrders: 4,
    awaitingAction: 7,
    totalAgents: 34,
    activeAgents: 25,
    completedOrders: 7,
    successfulDeliveries: 21,
    totalTransports: 25,
    registeredTransports: 25,
    labourRequests: 21,
    pendingLabour: 77,
    activeTransports: 25,
    activeVehicles: 20,
    activePostings: 77,
    cropListings: 8,
    totalOrders: 20,
    overallOrders: 20,
    totalCategories: 8,
    availableCategories: 8
  };

  // Phone screen images with detailed descriptions
  const phoneScreens = [
    {
      id: 1,
      image: '/assets/phone.jpeg',
      title: 'Role Selection',
      description: 'Welcome to Kisan Partner - Choose your role to continue',
      features: ['Farmer: Grow - Sell - Manage', 'Trader: Buy - Sell - Settle', 'Employee: Work - Track - Assist', 'Partner: Network - Grow', 'Transport: Fleet - Loads - PDD'],
      icon: FaUser,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 2,
      image: '/assets/phone1.PNG',
      title: 'Farmer Login',
      description: 'Login to your farmer account using multiple options',
      features: ['Phone Number Login', 'Send OTP via WhatsApp', 'Use MPIN', 'Login using password'],
      icon: FaUser,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 3,
      image: '/assets/phone2.PNG',
      title: 'Farmer Dashboard',
      description: 'Premium Quality - Get more profit here',
      features: ['Recent Crop Photos', 'Post Crop', 'My Crop', 'My Orders', 'Labour', 'Loans', 'Market', 'Crop Care', 'Shopping', 'Gov Scheme'],
      icon: GiFarmer,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      id: 4,
      image: '/assets/phone3.PNG',
      title: 'My Profile',
      description: 'Rajesh Kumar - Village: Rampur, Block: Kolar',
      features: ['Wallet Balance: ₹12,500', 'View Transactions', 'New Listing', 'Post Crop', 'Notifications', 'Pending Actions', 'Recent Messages'],
      icon: FaWallet,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 5,
      image: '/assets/phone4.PNG',
      title: 'Marketplace',
      description: 'Browse fresh agricultural products',
      features: ['Change Location', 'Limited Time Offers', 'Browse Categories: Vegetables, Fruits, Dairy, Groceries', 'Post Requirement', 'All Crops', 'My Orders', 'Featured Products'],
      icon: FaStore,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    },
    {
      id: 6,
      image: '/assets/phone5.PNG',
      title: 'Available Products',
      description: 'Cow - Farmer Details and Product Information',
      features: ['Farmer: Demofarmer', 'Place: Dhsi, Tankere, Chickmagalur', 'Category: Livestock', 'Date: 23/01/2026', 'Time: 19:55', 'View All Grades & Offers'],
      icon: GiCowled,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      id: 7,
      image: '/assets/phone6.PNG',
      title: 'Add New Labourer',
      description: 'Register new agricultural labourer',
      features: ['Name*', 'Village Name*', 'Contact Number', 'Work Types', 'Experience', 'Availability', 'Address'],
      icon: FaUserPlus,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    }
  ];

  // Mobile step-by-step view data
  const mobileSteps = phoneScreens.map((screen, index) => ({
    step: index + 1,
    ...screen
  }));

  const roles = [
    {
      id: 'farmer',
      title: 'Farmer',
      description: 'Grow - Sell - Manage',
      icon: GiFarmer,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      features: ['Crop Management', 'Monitor Access']
    },
    {
      id: 'trader',
      title: 'Trader',
      description: 'Buy - Sell - Swipe',
      icon: FaShoppingCart,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      features: ['Work-time Scheduling', 'Inventory', 'Settlement']
    },
    {
      id: 'employee',
      title: 'Employee',
      description: 'Work - Track - Assist',
      icon: FaUserTie,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      features: ['Task Management', 'Reports']
    },
    {
      id: 'partner',
      title: 'Partner',
      description: 'Network - Grow',
      icon: FaHandshake,
      color: 'text-amber-500',
      bgColor: 'bg-amber-50',
      features: ['Collaboration', 'Growth Tools', 'Resources']
    },
    {
      id: 'transport',
      title: 'Transport',
      description: 'Fleet - Loads - POD',
      icon: FaTruck,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      features: ['Load Tracking', 'Delivery Proof']
    }
  ];

  const statsCards = [
    { label: 'Total Farmers', value: dashboardData.totalFarmers, icon: GiFarmer, color: 'text-green-600', bgColor: 'bg-green-100' },
    { label: 'Active Agents', value: dashboardData.activeAgents, icon: FaUserTie, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { label: 'Pending Orders', value: dashboardData.pendingOrders, icon: FaClipboardCheck, color: 'text-amber-600', bgColor: 'bg-amber-100' },
    { label: 'Completed Orders', value: dashboardData.completedOrders, icon: FaClipboardCheck, color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
    { label: 'Active Transports', value: dashboardData.activeTransports, icon: FaTruck, color: 'text-red-600', bgColor: 'bg-red-100' },
    { label: 'Labour Requests', value: dashboardData.labourRequests, icon: FaUsers, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  ];

  // Auto-slide functionality
  useEffect(() => {
    if (isAutoPlaying) {
      sliderRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % phoneScreens.length);
      }, 5000);
    }

    return () => {
      if (sliderRef.current) {
        clearInterval(sliderRef.current);
      }
    };
  }, [isAutoPlaying, phoneScreens.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % phoneScreens.length);
    if (sliderRef.current) {
      clearInterval(sliderRef.current);
    }
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + phoneScreens.length) % phoneScreens.length);
    if (sliderRef.current) {
      clearInterval(sliderRef.current);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    if (sliderRef.current) {
      clearInterval(sliderRef.current);
    }
  };

  const nextStep = () => {
    setActiveStep((prev) => (prev + 1) % mobileSteps.length);
  };

  const prevStep = () => {
    setActiveStep((prev) => (prev - 1 + mobileSteps.length) % mobileSteps.length);
  };

  // Render icon helper function
  const renderIcon = (Icon: any, className: string) => {
    return <Icon className={className} />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <GiWheat className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">KISAN<span className="text-green-600">Partner</span></h1>
                <p className="text-xs sm:text-sm text-gray-600">Digital Agriculture Platform</p>
              </div>
            </div>
            
            {/* Desktop Navigation - Original */}
            <div className="hidden md:flex items-center space-x-6">
              <Link 
                href="/admin/login" 
                className="flex items-center space-x-2 border-2 border-green-600 text-green-600 hover:bg-green-50 px-6 py-3 rounded font-medium transition-all duration-300 hover:shadow-md"
              >
                <FaLock className="text-sm" />
                <span>Admin Login</span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded bg-green-50 text-green-600"
            >
              <FaBars className="text-xl" />
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 p-4 bg-white rounded-xl shadow-lg border border-green-100">
              <div className="space-y-3">
                <Link 
                  href="/admin/login" 
                  className="w-full flex items-center justify-center space-x-2 border-2 border-green-600 text-green-600 px-6 py-3 rounded font-medium"
                >
                  <FaLock />
                  <span>Admin Login</span>
                </Link>
              </div>
              <div className="flex flex-col gap-4 mt-3">
                  <Link 
                    href="https://play.google.com/store/apps/details?id=com.kisan.app" 
                    target="_blank"
                    className="inline-flex items-center justify-center bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-2 rounded-lg font-semibold text-lg shadow-xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    <FaGooglePlay className="mr-3 text-2xl" />
                    <div className="text-left">
                      <div className="text-sm font-medium">Download on</div>
                      <div className="text-sm font-bold">Google Play</div>
                    </div>
                  </Link>
                </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-50/40 to-emerald-50/40"></div>
        <div className="container mx-auto px-4 sm:px-6 relative">
          {isMobileView ? (
            /* MOBILE VIEW - Step by Step Vertical Layout */
            <div className="flex flex-col items-center">
              <div className="w-full max-w-3xl">
                <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-6">
                  <FaBell className="mr-2 animate-pulse" />
                  Revolutionizing Agriculture
                </div>
                
                <h1 className="text-4xl font-bold text-gray-800 leading-tight mb-6">
                  Welcome to 
                  <span className="text-green-600 block">Kisan Partner</span>
                </h1>
                
                <p className="text-gray-600 text-base mb-8 leading-relaxed">
                  Choose your role to continue. Your role determines the features and dashboard 
                  you&apos;ll receive. You can switch roles later in settings.
                </p>
                
                {/* Mobile Step-by-Step View */}
                
                
                {/* Mobile Role Selection */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Select Your Role</h3>
                  <div className="space-y-3">
                    {roles.map((role) => (
                      <button
                        key={role.id}
                        onClick={() => setSelectedRole(role.id)}
                        className={`w-full bg-white p-4 rounded text-left transition-all duration-300 border-1 ${
                          selectedRole === role.id 
                            ? 'border-green-500 bg-green-50 shadow-md' 
                            : 'border-gray-200 hover:border-green-300'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded ${role.bgColor}`}>
                            {renderIcon(role.icon, `text-2xl ${role.color}`)}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-gray-800">{role.title}</h3>
                            <p className="text-sm text-gray-600">{role.description}</p>
                          </div>
                          {/* <FaChevronRight className={`${selectedRole === role.id ? 'text-green-600' : 'text-gray-400'}`} /> */}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>


              <div className="space-y-6 mb-8">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">App Walkthrough</h3>
                    <p className="text-gray-600">Step-by-step guide through the app</p>
                  </div>
                  
                  {/* Step Navigation Dots */}
                  <div className="flex justify-center space-x-2 mb-4">
                    {mobileSteps.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveStep(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === activeStep 
                            ? 'bg-green-600 w-4' 
                            : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  
                  {/* Current Step Display */}
                  <div className="bg-white overflow-hidden rounded-2xl shadow-xl p-4 border border-green-100">
                    {/* Step Header */}
                    <div className="flex items-center overflow-hidden justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className={`p-2 rounded-xl ${mobileSteps[activeStep].bgColor}`}>
                          {renderIcon(mobileSteps[activeStep].icon, `text-lg ${mobileSteps[activeStep].color}`)}
                        </div>
                        <span className="text-sm font-medium text-gray-500">
                          Step {mobileSteps[activeStep].step}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {activeStep + 1} of {mobileSteps.length}
                      </span>
                    </div>
                    
                    {/* Step Image */}
                    <div className="relative h-48 mb-4 rounded-xl overflow-hidden bg-gradient-to-b from-green-50 to-white">
                      <Image
                        src={mobileSteps[activeStep].image}
                        alt={mobileSteps[activeStep].title}
                        fill
                        className="object-contain p-2 rounded-xl"
                        sizes="(max-width: 280px) 100vw"
                      />
                    </div>
                    
                    {/* Step Content */}
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {mobileSteps[activeStep].title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {mobileSteps[activeStep].description}
                    </p>
                    
                    {/* Features List */}
                    <div className="space-y-2 mb-4">
                      {mobileSteps[activeStep].features.slice(0, 3).map((feature, idx) => (
                        <div key={idx} className="flex items-start space-x-2">
                          <FaCheck className="text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Step Navigation Buttons */}
                    <div className="flex justify-between mt-4">
                      <button
                        onClick={prevStep}
                        disabled={activeStep === 0}
                        className={`px-4 py-2 rounded font-medium ${
                          activeStep === 0 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Previous
                      </button>
                      <button
                        onClick={nextStep}
                        disabled={activeStep === mobileSteps.length - 1}
                        className={`px-4 py-2 rounded font-medium ${
                          activeStep === mobileSteps.length - 1
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {activeStep === mobileSteps.length - 1 ? 'Complete' : 'Next'}
                      </button>
                    </div>
                  </div>
                </div>
                {/* Mobile CTA Button */}
                <div className="flex flex-col gap-4">
                  <Link 
                    href="https://play.google.com/store/apps/details?id=com.kisan.app" 
                    target="_blank"
                    className="inline-flex items-center justify-center bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    <FaGooglePlay className="mr-3 text-2xl" />
                    <div className="text-left">
                      <div className="text-sm font-medium">Download on</div>
                      <div className="text-xl font-bold">Google Play</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            /* DESKTOP VIEW - Original Layout */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="animate-fadeIn lg:pl-7">
                <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-6">
                  <FaBell className="mr-2 animate-pulse" />
                  Revolutionizing Agriculture
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-gray-800 leading-tight mb-6">
                  Welcome to 
                  <span className="text-green-600 block">Kisan Partner</span>
                </h1>
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                  Choose your role to continue. Your role determines the features and dashboard 
                  you&apos;ll receive. You can switch roles later in settings.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                  {roles.map((role) => (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRole(role.id)}
                      className={`p-3 rounded-md border border-zinc-200 text-left transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${
                        selectedRole === role.id 
                          ? 'ring-2 ring-green-500 bg-white shadow-md' 
                          : 'bg-white/80 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-3 xl:p-2 rounded ${role.bgColor}`}>
                          {renderIcon(role.icon, `text-xl ${role.color}`)}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800 lg:text-sm text-md">{role.title}</h3>
                          <p className=" text-xs text-gray-600">{role.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="https://play.google.com/store/apps/details?id=com.kisan.app" 
                    target="_blank"
                    className="inline-flex items-center justify-center bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 animate-bounce-gentle"
                  >
                    <FaGooglePlay className="mr-3 text-2xl" />
                    <div className="text-left">
                      <div className="text-sm font-medium">Download on</div>
                      <div className="text-xl font-bold">Google Play</div>
                    </div>
                  </Link>
                </div>
              </div>
              
              <div className="relative animate-slideIn">
                {/* Phone Mockup with Slider - Desktop Only */}
                <div className="relative h-[600px] w-full flex items-center justify-center">
                  {/* Decorative background elements */}
                  <div className="absolute -top-10 -right-10 w-64 h-64 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                  <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                  
                  {/* Phone Mockup Container */}
                  <div className="relative w-72 h-[520px] bg-gradient-to-br from-gray-900 to-black rounded-[30px] p-2 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                    <div className="h-full bg-gradient-to-b from-green-50 to-white rounded-[25px] overflow-hidden relative">
                      {/* Phone notch */}
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-5 bg-black rounded-b-lg z-10"></div>
                      
                      {/* Slider Container */}
                      <div className="h-full overflow-hidden relative">
                        {/* Slides */}
                        {phoneScreens.map((screen, index) => (
                          <div
                            key={screen.id}
                            className={`absolute inset-0 transition-all duration-700 ${
                              index === currentSlide 
                                ? 'opacity-100 translate-x-0' 
                                : 'opacity-0 translate-x-full pointer-events-none'
                            }`}
                          >
                            <div className="h-full flex flex-col rounded-2xl overflow-hidden">
                              {/* Image Container */}
                              <div className="flex-1 relative overflow-hidden bg-gradient-to-b from-green-50 to-white p-1">
                                <div className="relative w-full h-full">
                                  <Image
                                    src={screen.image}
                                    alt={screen.title}
                                    fill
                                    quality={100}
                                    className="object-contain"
                                    sizes="(max-width: 280px) 100vw"
                                    priority={index === 0}
                                  />
                                </div>
                              </div>
                              
                              {/* Description */}
                              <div className="p-4 bg-white/95 backdrop-blur-sm border-t border-green-100">
                                <div className="flex items-center space-x-3 mb-3">
                                  <div className={`p-2 rounded ${screen.bgColor}`}>
                                    {renderIcon(screen.icon, `text-lg ${screen.color}`)}
                                  </div>
                                  <div>
                                    <h3 className="font-bold text-lg text-gray-800">{screen.title}</h3>
                                    <p className="text-sm text-gray-600 line-clamp-1">{screen.description}</p>
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-1 mb-2">
                                  {screen.features.slice(0, 3).map((feature, idx) => (
                                    <span 
                                      key={idx}
                                      className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full border border-green-200"
                                    >
                                      {feature}
                                    </span>
                                  ))}
                                  {screen.features.length > 3 && (
                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                      +{screen.features.length - 3} more
                                    </span>
                                  )}
                                </div>
                                {/* <div className="text-xs text-gray-500 text-center">
                                  Slide {screen.id} of {phoneScreens.length}
                                </div> */}
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {/* Slider Controls */}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            prevSlide();
                          }}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 z-20 hover:scale-110"
                        >
                          <FaChevronLeft className="text-gray-700" />
                        </button>
                        
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            nextSlide();
                          }}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 z-20 hover:scale-110"
                        >
                          <FaChevronRightIcon className="text-gray-700" />
                        </button>
                        
                        {/* Slide Indicators */}
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                          {phoneScreens.map((_, index) => (
                            <button
                              key={index}
                              onClick={(e) => {
                                e.stopPropagation();
                                goToSlide(index);
                              }}
                              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                index === currentSlide 
                                  ? 'bg-green-600 w-6' 
                                  : 'bg-gray-300 hover:bg-gray-400'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Dashboard Section with Fixed Image */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Platform Dashboard Overview
            </h2>
            <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
              Comprehensive insights and analytics for effective agricultural management
            </p>
          </div>

          {/* Main Dashboard Image */}
          <div className="relative rounded overflow-hidden mb-8 md:mb-12 group bg-gradient-to-r from-green-50 to-emerald-50 p-1">
            <div className="relative w-full h-[300px] md:h-[600px] rounded overflow-hidden">
              <Image
                src="/assets/dashboard.PNG"
                alt="Admin Dashboard"
                fill
                className="object-contain"
                sizes="(max-width: 1200px) 100vw, 1200px"
                priority
              />
            </div>
            
            {/* Dashboard Overlay Info */}
            <div className="absolute bottom-0 left-0 h-[40%] right-0 bg-gradient-to-t from-black/70 to-transparent p-4 md:p-6 z-20">
              <h3 className="text-xl md:text-2xl font-bold lg:mt-10 text-white mb-2">Admin Dashboard</h3>
              <p className="text-green-100 lg:hidden w-[80vw] text-sm md:text-base">
                Real-time monitoring of platform activities, user statistics, and operational metrics
              </p>
              <p className="text-green-100 w-[60vw] lg:block hidden text-sm md:text-base">provides comprehensive oversight with real-time monitoring of all platform activities, detailed user statistics, performance analytics, and operational metrics for complete system management.</p>
            </div>
          </div>

          {/* Stats Cards - Responsive Layout */}
          <div className={`
            ${isMobileView ? 'space-y-4' : 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6'}
          `}>
            {statsCards.map((stat, index) => (
              <div 
                key={stat.label}
                className="bg-white rounded-md md:rounded-lg p-4 md:p-6 shadow-md hover:shadow-xl  transition-all duration-300 transform hover:-translate-y-2 border border-green-50"
                style={isMobileView ? {} : { animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <div className={`p-2 md:p-3 rounded md:rounded-xl ${stat.bgColor}`}>
                    {renderIcon(stat.icon, `text-lg md:text-2xl ${stat.color}`)}
                  </div>
                  <span className="text-2xl md:text-3xl font-bold text-gray-800">{stat.value}</span>
                </div>
                <h3 className="text-sm md:text-lg font-semibold text-gray-700">{stat.label}</h3>
                <p className="text-xs md:text-sm text-gray-500 mt-1 md:mt-2">Updated in real-time</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App Features Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Complete Agricultural Solution
            </h2>
            <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
              Everything you need for modern agricultural management in one place
            </p>
          </div>
          
          <div className={`
            ${isMobileView ? 'space-y-6' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'}
          `}>
            {[
              {
                icon: GiFarmer,
                title: "Farm Management",
                description: "Complete crop tracking, monitoring, and management tools",
                color: "text-green-600",
                bgColor: "bg-green-100"
              },
              {
                icon: FaShoppingCart,
                title: "Marketplace",
                description: "Buy and sell agricultural products with secure transactions",
                color: "text-blue-600",
                bgColor: "bg-blue-100"
              },
              {
                icon: FaMoneyBillWave,
                title: "Financial Services",
                description: "Loans, insurance, and financial management tools",
                color: "text-amber-600",
                bgColor: "bg-amber-100"
              },
              {
                icon: FaTractor,
                title: "Labour Management",
                description: "Find, hire, and manage agricultural labourers",
                color: "text-purple-600",
                bgColor: "bg-purple-100"
              },
              {
                icon: FaShippingFast,
                title: "Transport & Logistics",
                description: "End-to-end transport and delivery solutions",
                color: "text-red-600",
                bgColor: "bg-red-100"
              },
              {
                icon: FaChartLine,
                title: "Analytics & Reports",
                description: "Market trends, weather data, and performance analytics",
                color: "text-emerald-600",
                bgColor: "bg-emerald-100"
              },
              {
                icon: FaHandsHelping,
                title: "Government Schemes",
                description: "Access to government agricultural schemes and subsidies",
                color: "text-indigo-600",
                bgColor: "bg-indigo-100"
              },
              {
                icon: FaLeaf,
                title: "Crop Care",
                description: "Pest control, fertilizers, and crop advisory services",
                color: "text-lime-600",
                bgColor: "bg-lime-100"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-white rounded-md p-6  shadow-md hover:shadow-xl transition-all duration-300 border border-green-50 transform hover:-translate-y-2"
                style={isMobileView ? {} : { animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-12 h-12 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-4`}>
                  {renderIcon(feature.icon, `text-2xl ${feature.color}`)}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Side Panel */}
      <div className={`fixed inset-y-0 right-0 w-full md:w-1/2 lg:w-1/3 bg-white shadow-2xl z-50 transform transition-transform duration-500 ${
        isPanelOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="h-full overflow-y-auto">
          {/* Panel Header */}
          <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-700 text-white p-4 md:p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-3">
                <FaChartLine className="text-2xl" />
                <div>
                  <h2 className="text-xl md:text-2xl font-bold">Admin Dashboard</h2>
                  <p className="text-green-100 text-xs md:text-sm">Real-time Platform Analytics</p>
                </div>
              </div>
              <button 
                onClick={() => setIsPanelOpen(false)}
                className="p-2 hover:bg-white/20 rounded transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/20 p-3 rounded backdrop-blur-sm">
                <div className="text-xl md:text-2xl font-bold">{dashboardData.totalFarmers}</div>
                <div className="text-xs md:text-sm text-green-100">Total Farmers</div>
              </div>
              <div className="bg-white/20 p-3 rounded backdrop-blur-sm">
                <div className="text-xl md:text-2xl font-bold">{dashboardData.totalOrders}</div>
                <div className="text-xs md:text-sm text-green-100">Processed Orders</div>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="p-4 md:p-6">
            {/* Role Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <FaUserTie className="mr-2 text-green-600" />
                Select Your Role
              </h3>
              <div className="space-y-3">
                {roles.map((role) => (
                  <div 
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                      selectedRole === role.id 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded ${role.bgColor}`}>
                          {renderIcon(role.icon, `text-lg ${role.color}`)}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800">{role.title}</h4>
                          <p className="text-sm text-gray-600">{role.description}</p>
                        </div>
                      </div>
                      <FaChevronRight className="text-gray-400" />
                    </div>
                    {role.features && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {role.features.map((feature, idx) => (
                          <span 
                            key={idx}
                            className="px-2 py-1 bg-white text-xs text-gray-600 rounded border"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Dashboard Stats */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <FaDatabase className="mr-2 text-green-600" />
                Platform Statistics
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Registered Users', value: dashboardData.registeredUsers },
                  { label: 'Pending Orders', value: dashboardData.pendingOrders },
                  { label: 'Orders Awaiting Action', value: dashboardData.awaitingAction },
                  { label: 'Total Agents', value: dashboardData.totalAgents },
                  { label: 'Active Agents', value: dashboardData.activeAgents },
                  { label: 'Successful Deliveries', value: dashboardData.successfulDeliveries },
                  { label: 'Total Transports', value: dashboardData.totalTransports },
                  { label: 'Registered Transports', value: dashboardData.registeredTransports },
                  { label: 'Pending Labour Requests', value: dashboardData.pendingLabour },
                  { label: 'Active Transport Vehicles', value: dashboardData.activeVehicles },
                  { label: 'Current Crop Listings', value: dashboardData.cropListings },
                  { label: 'Product Categories', value: dashboardData.totalCategories },
                ].map((stat, index) => (
                  <div 
                    key={index}
                    className="bg-gray-50 p-3 rounded hover:bg-gray-100 transition-colors"
                  >
                    <div className="text-lg md:text-xl font-bold text-gray-800">{stat.value}</div>
                    <div className="text-xs text-gray-600 truncate">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Note */}
            <div className="mt-8 p-4 bg-green-50 rounded">
              <p className="text-sm text-gray-600">
                <strong>Note:</strong> Your role determines the features and dashboard you&apos;ll receive. 
                You can switch roles later in settings.
              </p>
            </div>

            <div className="mt-6 text-center text-gray-500 text-sm">
              <p>© 2024 Kisan Partner. All rights reserved</p>
              <p className="mt-2">
                Need help? Contact <a href="mailto:support@kisagroup.com" className="text-green-600 hover:underline">support@kisagroup.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for panel */}
      {isPanelOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsPanelOpen(false)}
        />
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className={`${isMobileView ? 'space-y-8' : 'grid grid-cols-1 md:grid-cols-4 gap-8'}`}>
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <GiWheat className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">KISAN Partner</h3>
                  <p className="text-green-300 text-sm">Digital Agriculture</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Empowering farmers with technology-driven solutions for sustainable agriculture.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-6">Quick Links</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li><Link href="/admin/login" className="hover:text-green-400 transition">Admin Login</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-6">Contact</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li>Email: support@kisagroup.com</li>
                <li>Phone: +91 98765 43210</li>
                <li>Office Hours: 9 AM - 6 PM IST</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-6">Download App</h4>
              <Link 
                href="https://play.google.com/store/apps/details?id=com.kisan.app" 
                target="_blank"
                className="inline-flex items-center bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded transition-all duration-300"
              >
                <FaGooglePlay className="mr-3 text-xl" />
                <div>
                  <div className="text-sm">Available on</div>
                  <div className="font-bold">Google Play</div>
                </div>
              </Link>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} Kisan Partner. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Custom Styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }
        
        .animate-slideIn {
          animation: slideIn 0.8s ease-out;
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animate-bounce-gentle {
          animation: bounce-gentle 2s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .line-clamp-1 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }
      `}</style>
    </div>
  );
}