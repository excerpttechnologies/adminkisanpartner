

// "use client";

// import Link from "next/link";
// import { useState } from "react";
// import {
//   MdDashboard,
//   MdShoppingCart,
//   MdPeople,
//   MdGroup,
//   MdAdminPanelSettings,
//   MdViewCarousel,
//   MdCategory,
//   MdMenu,
//   MdPages,
//   MdGrass,
//   MdPets,
//   MdScale,
//   MdLandscape,
//   MdEco,
//   MdSettings,
//   MdOutlineLocationCity,
//   MdOutlineMap,
//   MdOutlinePlace,
//   MdPersonOutline,
//   MdLogout,
// } from "react-icons/md";
// import { usePathname, useRouter } from "next/navigation";

// const menu = [
//   {
//     section: "Main",
//     items: [{ name: "Dashboard", icon: MdDashboard, path: "/" }],
//   },
//   {
//     section: "Marketplace Management",
//     items: [
//       { name: "Orders", icon: MdShoppingCart, path: "/orders" },
//       { name: "Labours", icon: MdPeople, path: "/labours" },
//       { name: "Agent Req", icon: MdGroup, path: "/agent-requirements" },
//       { name: "Postings", icon: MdAdminPanelSettings, path: "/postings" },
//     ],
//   },
//   {
//     section: "User Management",
//     items: [
//       { name: "Farmers", icon: MdPeople, path: "/farmers" },
//       { name: "Agents", icon: MdGroup, path: "/agents" },
//       { name: "Sub Admins", icon: MdAdminPanelSettings, path: "/sub-admins" },
//     ],
//   },
//   {
//     section: "Content Management",
//     items: [
//       { name: "Slider", icon: MdPages, path: "/slider" },
//       { name: "Categories", icon: MdCategory, path: "/categories" },
//       { name: "Crop Care", icon: MdMenu, path: "/cropcare" },
//       { name: "Post Ads", icon: MdPages, path: "/admin-advertisement" },
//       { name: "Add Notes", icon: MdMenu, path: "/adminnotes" },
//       { name: "Menu Icons", icon: MdMenu, path: "/menuicon" },
//     ],
//   },
//   {
//     section: "Options & Settings",
//     items: [
//       { name: "Breed Options", icon: MdPets, path: "/breed-options" },
//       { name: "Cattle Options", icon: MdGrass, path: "/cattle-options" },
//       { name: "Quantity Options", icon: MdScale, path: "/quantity-options" },
//       { name: "Acres", icon: MdLandscape, path: "/acres" },
//       { name: "Seeds", icon: MdEco, path: "/seeds" },
//       { name: "Settings", icon: MdSettings, path: "/settings" },
//     ],
//   },
//   {
//     section: "Lookups",
//     items: [
//       { name: "States", icon: MdOutlineLocationCity, path: "/states" },
//       { name: "District", icon: MdOutlineMap, path: "/district" },
//       { name: "Taluka", icon: MdOutlinePlace, path: "/taluka" },
//       { name: "My Profile", icon: MdPersonOutline, path: "/my-profile" },
//       { name: "Logout", icon: MdLogout, path: "/logout" },
//     ],
//   },
// ];

// const Sidebar = () => {
//   const [open, setOpen] = useState(false);
//   const pathname = usePathname();
//   const router = useRouter();

//   /* ✅ LOGOUT HANDLER (ONLY ADDITION) */
//   const handleLogout = async () => {
//     try {
//       await fetch("/api/logout");
//       router.push("/login");
//     } catch (error) {
//       console.error("Logout failed", error);
//     }
//   };

//   return (
//     <>
//       {/* Mobile Toggle */}
//       <button
//         className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded shadow"
//         onClick={() => setOpen(!open)}
//       >
//         <MdMenu size={22} />
//       </button>

//       {/* Sidebar */}
//       <aside
//         className={`fixed md:static z-40 h-screen w-64 bg-white shadow
//         transition-transform duration-300 flex flex-col
//         ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
//       >
//         <div className="h-16 flex items-center px-5 font-bold text-green-600" />

//         {/* MENU */}
//         <nav className="flex-1 overflow-y-auto px-4 py-4">
//           {menu.map((group, i) => (
//             <div
//               key={i}
//               className={`${i !== 0 && "border-t mt-4 border-zinc-200 pt-4"}`}
//             >
//               <p className="text-xs font-semibold text-gray-500 mb-2 ml-1">
//                 {group.section}
//               </p>

//               <div className="flex flex-col gap-1">
//                 {group.items.map((item, j) => (
//                   <Link
//                     key={j}
//                     href={item.path}
//                     onClick={(e) => {
//                       setOpen(false);

//                       /* ✅ INTERCEPT LOGOUT ONLY */
//                       if (item.name === "Logout") {
//                         e.preventDefault();
//                         handleLogout();
//                       }
//                     }}
//                     className={`flex items-center gap-3 px-3 ${
//                       pathname === item.path && "bg-green-50 text-green-500"
//                     } py-2 rounded-lg text-sm text-gray-600
//                     hover:bg-green-50 hover:text-green-600 transition`}
//                   >
//                     <item.icon size={18} />
//                     <span>{item.name}</span>
//                   </Link>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </nav>

//         <div className="h-16 flex items-center px-5 font-bold text-green-600" />
//       </aside>
//     </>
//   );
// };

// export default Sidebar;
















// "use client";

// import Link from "next/link";
// import { useState } from "react";
// import { usePathname, useRouter } from "next/navigation";
// import { MENU_CONFIG, getIconComponent } from "@/app/config/menu.config";

// const Sidebar = () => {
//   const [open, setOpen] = useState(false);
//   const pathname = usePathname();
//   const router = useRouter();

//   /* ✅ LOGOUT HANDLER (ONLY ADDITION) */
//   const handleLogout = async () => {
//     try {
//       await fetch("/api/logout");
//       router.push("/login");
//     } catch (error) {
//       console.error("Logout failed", error);
//     }
//   };

//   return (
//     <>
//       {/* Mobile Toggle */}
//       <button
//         className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded shadow"
//         onClick={() => setOpen(!open)}
//       >
//         {getIconComponent("MdMenu")({ size: 22 })}
//       </button>

//       {/* Sidebar */}
//       <aside
//         className={`fixed md:static z-40 h-screen w-64 bg-white shadow
//         transition-transform duration-300 flex flex-col
//         ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
//       >
//         <div className="h-16 flex items-center px-5 font-bold text-green-600" />

//         {/* MENU */}
//         <nav className="flex-1 overflow-y-auto px-4 py-4">
//           {MENU_CONFIG.map((group, i) => (
//             <div
//               key={i}
//               className={`${i !== 0 && "border-t mt-4 border-zinc-200 pt-4"}`}
//             >
//               <p className="text-xs font-semibold text-gray-500 mb-2 ml-1">
//                 {group.section}
//               </p>

//               <div className="flex flex-col gap-1">
//                 {group.items.map((item, j) => {
//                   const IconComponent = getIconComponent(item.icon);
                  
//                   return (
//                     <Link
//                       key={j}
//                       href={item.path}
//                       onClick={(e) => {
//                         setOpen(false);

//                         /* ✅ INTERCEPT LOGOUT ONLY */
//                         if (item.name === "Logout") {
//                           e.preventDefault();
//                           handleLogout();
//                         }
//                       }}
//                       className={`flex items-center gap-3 px-3 ${
//                         pathname === item.path && "bg-green-50 text-green-500"
//                       } py-2 rounded-lg text-sm text-gray-600
//                       hover:bg-green-50 hover:text-green-600 transition`}
//                     >
//                       <IconComponent size={18} />
//                       <span>{item.name}</span>
//                     </Link>
//                   );
//                 })}
//               </div>
//             </div>
//           ))}
//         </nav>

//         <div className="h-16 flex items-center px-5 font-bold text-green-600" />
//       </aside>
//     </>
//   );
// };

// export default Sidebar;



//the avove code is working






"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MENU_CONFIG, getIconComponent } from "@/app/config/menu.config";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/session");
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUser(data.data);
        }
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      setUser(null);
      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // Filter menu items based on user role and page access
  const getFilteredMenu = () => {
    if (!user || loading) return [];
    
    // Map page names to match menu item names
    const pageNameMapping: Record<string, string> = {
      'dashboard': 'Dashboard',
      'orders': 'Orders',
      'labours': 'Labours',
      'agent req': 'Agent Req',
      'crop postings': 'Crop Postings', 
      'farmers': 'Farmers',
      'agents': 'Agents',
      'sub admins': 'Sub Admins',
      'slider': 'Slider',
      'categories': 'Categories',
      // 'cropcare': 'Crop Care',
      'crop care': 'Crop Care',
      'post ads': 'Post Ads',
      'add notes': 'Add Notes',
      'menu icons': 'Menu Icons',
      'breed options': 'Breed Options',
      'cattle options': 'Cattle Options',
      'quantity options': 'Quantity Options',
      'acres': 'Acres',
      'seeds': 'Seeds',
      'settings': 'Settings',
      'states': 'States',
      'district': 'District',
      'taluka': 'Taluka',
      'my profile': 'My Profile',
    };
    
    return MENU_CONFIG.map(section => {
      const filteredItems = section.items.filter(item => {
        // Always show logout and dashboard
        if (item.name === "Logout" || item.name === "Dashboard" ||  item.name === "My Profile") return true;
        
        // Admin can see everything
        if (user.role === "admin") return true;
        
        // Subadmin: check page access
        if (user.role === "subadmin") {
          const userPageAccess = user.pageAccess || [];
          
          // Check if user has access to this menu item
          return userPageAccess.some((access: string) => {
            const normalizedAccess = access.toLowerCase().trim();
            const menuItemName = item.name.toLowerCase().trim();
            
            // Direct match or mapped match
            return normalizedAccess === menuItemName || 
                   pageNameMapping[normalizedAccess]?.toLowerCase() === menuItemName;
          });
        }
        
        return false;
      });
      
      return {
        ...section,
        items: filteredItems
      };
    }).filter(section => section.items.length > 0);
  };

  const filteredMenu = getFilteredMenu();

  if (loading) {
    return (
      <aside className="fixed md:static z-40 h-screen w-64 bg-white shadow flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
      </aside>
    );
  }

  return (
    <>
      {/* Mobile Toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded shadow"
        onClick={() => setOpen(!open)}
      >
        {getIconComponent("MdMenu")({ size: 22 })}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:static z-40 h-screen w-64 bg-white shadow
        transition-transform duration-300 flex flex-col
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* User Info */}
        <div className="h-16 flex items-center px-5 border-b border-gray-400">
          {user ? (
            <div className="flex ml-12 lg:ml-1 items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="font-semibold text-gray-800 truncate max-w-[140px]">
                  {user.name}
                </div>
                <div className="text-xs text-gray-500 capitalize flex items-center gap-1">
                  <span className={`inline-block w-2 h-2 rounded-full ${user.role === 'admin' ? 'bg-green-500' : 'bg-blue-500'}`}></span>
                  {user.role}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500">Not logged in</div>
          )}
        </div>

        {/* MENU */}
        <nav className="flex-1 overflow-y-auto px-4 py-4">
          {filteredMenu.length > 0 ? (
            filteredMenu.map((group, i) => (
              <div
                key={i}
                className={`${i !== 0 && "border-t mt-4 border-zinc-200 pt-4"}`}
              >
                <p className="text-xs font-semibold text-gray-500 mb-2 ml-1">
                  {group.section}
                </p>

                <div className="flex flex-col gap-1">
                  {group.items.map((item, j) => {
                    const IconComponent = getIconComponent(item.icon);
                    
                    return (
                      <Link
                        key={j}
                        href={item.path}
                        onClick={(e) => {
                          setOpen(false);
                          if (item.name === "Logout") {
                            e.preventDefault();
                            handleLogout();
                          }
                        }}
                        className={`flex items-center gap-3 px-3 ${
                          pathname === item.path && "bg-green-50 text-green-500"
                        } py-2 rounded-lg text-sm text-gray-600
                        hover:bg-green-50 hover:text-green-600 transition`}
                      >
                        <IconComponent size={18} />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 text-sm">
              No menu items available
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-400">
          <div className="text-xs text-gray-500 text-center">
            Kissan Partner Admin
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;