










// // config/menu.config.ts
// export interface MenuItem {
//   name: string;
//   path: string;
//   icon: string;
//   moduleId?: string;
// }

// export interface MenuSection {
//   section: string;
//   items: MenuItem[];
// }

// // This will be your single source of truth for all modules
// export const MENU_CONFIG: MenuSection[] = [
//   {
//     section: "Main",
//     items: [{ name: "Dashboard", path: "/dashboard", icon: "MdDashboard" }],
//   },
//   {
//     section: "Marketplace Management",
//     items: [
//       { name: "Orders", path: "/orders", icon: "MdShoppingCart" },
//       { name: "Labours", path: "/labours", icon: "MdPeople" },
//       { name: "Agent Req", path: "/agent-requirements", icon: "MdGroup" },
//       { name: "Postings", path: "/postings", icon: "MdAdminPanelSettings" },
//     ],
//   },
//   {
//     section: "User Management",
//     items: [
//       { name: "Farmers", path: "/farmers", icon: "MdPeople" },
//       { name: "Agents", path: "/agents", icon: "MdGroup" },
//       { name: "Sub Admins", path: "/sub-admins", icon: "MdAdminPanelSettings" },
//     ],
//   },
//   {
//     section: "Content Management",
//     items: [
//       { name: "Slider", path: "/slider", icon: "MdPages" },
//       { name: "Categories", path: "/categories", icon: "MdCategory" },
//       { name: "Crop Care", path: "/cropcare", icon: "MdMenu" },
//       { name: "Post Ads", path: "/admin-advertisement", icon: "MdPages" },
//       { name: "Add Notes", path: "/adminnotes", icon: "MdMenu" },
//       { name: "Menu Icons", path: "/menuicon", icon: "MdMenu" },
//     ],
//   },
//   {
//     section: "Options & Settings",
//     items: [
//       { name: "Breed Options", path: "/breed-options", icon: "MdPets" },
//       { name: "Cattle Options", path: "/cattle-options", icon: "MdGrass" },
//       { name: "Quantity Options", path: "/quantity-options", icon: "MdScale" },
//       { name: "Acres", path: "/acres", icon: "MdLandscape" },
//       { name: "Seeds", path: "/seeds", icon: "MdEco" },
//       { name: "Settings", path: "/settings", icon: "MdSettings" },
//     ],
//   },
//   {
//     section: "Lookups",
//     items: [
//       { name: "States", path: "/states", icon: "MdOutlineLocationCity" },
//       { name: "District", path: "/district", icon: "MdOutlineMap" },
//       { name: "Taluka", path: "/taluka", icon: "MdOutlinePlace" },
//       { name: "My Profile", path: "/my-profile", icon: "MdPersonOutline" },
//       { name: "Logout", path: "/logout", icon: "MdLogout", moduleId: "logout" },
//     ],
//   },
// ];

// // Helper function to get all module names (excluding logout and dashboard)
// export const getAllMenuModules = (): string[] => {
//   const modules = new Set<string>();
  
//   MENU_CONFIG.forEach(section => {
//     section.items.forEach(item => {
//       // Skip logout, dashboard and other special items
//       if (
//         item.moduleId !== "logout" && 
//         item.name !== "Logout" && 
//         item.name !== "Dashboard" &&
//         item.name !== "My Profile"
//       ) {
//         modules.add(item.name);
//       }
//     });
//   });
  
//   return Array.from(modules);
// };

// // Optional: Get modules grouped by section
// export const getMenuModulesBySection = (): Record<string, string[]> => {
//   const modulesBySection: Record<string, string[]> = {};
  
//   MENU_CONFIG.forEach(section => {
//     const sectionModules = section.items
//       .filter(item => 
//         item.moduleId !== "logout" && 
//         item.name !== "Logout" && 
//         item.name !== "Dashboard" &&
//         item.name !== "My Profile"
//       )
//       .map(item => item.name);
    
//     if (sectionModules.length > 0) {
//       modulesBySection[section.section] = sectionModules;
//     }
//   });
  
//   return modulesBySection;
// };

// // Helper to get icon component
// import * as Icons from "react-icons/md";
// export const getIconComponent = (iconName: string) => {
//   const IconComponent = Icons[iconName as keyof typeof Icons];
//   return IconComponent || Icons.MdDashboard;
// };



















// config/menu.config.ts
export interface MenuItem {
  name: string;
  path: string;
  icon: string;
  moduleId?: string;
}

export interface MenuSection {
  section: string;
  items: MenuItem[];
}

// This will be your single source of truth for all modules
export const MENU_CONFIG: MenuSection[] = [
  {
    section: "Main",
    items: [{ name: "Dashboard", path: "/dashboard", icon: "MdDashboard" }],
  },
  {
    section: "Marketplace Management",
    items: [
      { name: "Orders", path: "/orders", icon: "MdShoppingCart" },
      { name: "Labours", path: "/labours", icon: "MdPeople" },
      { name: "Agent Req", path: "/agent-requirements", icon: "MdGroup" },
      { name: "Crop Postings", path: "/postings", icon: "MdAdminPanelSettings" },
    ],
  },
  {
    section: "User Management",
    items: [
      { name: "Farmers", path: "/farmers", icon: "MdPeople" },
      { name: "Agents", path: "/agents", icon: "MdGroup" },
      { name: "Sub Admins", path: "/sub-admins", icon: "MdAdminPanelSettings" },
      //  { name: "Transporters", path: "/transporters", icon: "" },

    ],
  },
  {
    section: "Content Management",
    items: [
      { name: "Slider", path: "/slider", icon: "MdPages" },
      { name: "Categories", path: "/categories", icon: "MdCategory" },
      { name: "Crop Care", path: "/cropcare", icon: "MdMenu" },
      { name: "Post Ads", path: "/admin-advertisement", icon: "MdPages" },
      { name: "Add Notes", path: "/adminnotes", icon: "MdMenu" },
      { name: "Menu Icons", path: "/menuicon", icon: "MdMenu" },
    ],
  },
  {
    section: "Options & Settings",
    items: [
      { name: "Breed Options", path: "/breed-options", icon: "MdPets" },
      { name: "Cattle Options", path: "/cattle-options", icon: "MdGrass" },
      { name: "Quantity Options", path: "/quantity-options", icon: "MdScale" },
      { name: "Acres", path: "/acres", icon: "MdLandscape" },
      { name: "Seeds", path: "/seeds", icon: "MdEco" },
      { name: "Settings", path: "/settings", icon: "MdSettings" },
       { name: "Commission  Form", path: "/commission-form", icon: "MdRequestQuote" },
      { name: "Market", path: "/market", icon: "MdStore" },
       { name: "Quantity Type", path: "/quantity-type", icon: "MdStraighten" },
    ],
  },
  {
    section: "Lookups",
    items: [
      { name: "States", path: "/states", icon: "MdOutlineLocationCity" },
      { name: "District", path: "/district", icon: "MdOutlineMap" },
      { name: "Taluka", path: "/taluka", icon: "MdOutlinePlace" },
      { name: "My Profile", path: "/my-profile", icon: "MdPersonOutline" },
      { name: "Logout", path: "/logout", icon: "MdLogout", moduleId: "logout" },
    ],
  },
];

// Helper function to get all module names (INCLUDING Dashboard now)
export const getAllMenuModules = (): string[] => {
  const modules = new Set<string>();
  
  MENU_CONFIG.forEach(section => {
    section.items.forEach(item => {
      // Skip only logout and My Profile
      if (
        item.moduleId !== "logout" && 
        item.name !== "Logout" &&
        item.name !== "My Profile"
      ) {
        modules.add(item.name);
      }
    });
  });
  
  return Array.from(modules);
};

// Updated: Get modules grouped by section (INCLUDING Dashboard now)
export const getMenuModulesBySection = (): Record<string, string[]> => {
  const modulesBySection: Record<string, string[]> = {};
  
  MENU_CONFIG.forEach(section => {
    const sectionModules = section.items
      .filter(item => 
        item.moduleId !== "logout" && 
        item.name !== "Logout" &&
        item.name !== "My Profile"
      )
      .map(item => item.name);
    
    if (sectionModules.length > 0) {
      modulesBySection[section.section] = sectionModules;
    }
  });
  
  return modulesBySection;
};

// Helper to get icon component
import * as Icons from "react-icons/md";
export const getIconComponent = (iconName: string) => {
  const IconComponent = Icons[iconName as keyof typeof Icons];
  return IconComponent || Icons.MdDashboard;
};