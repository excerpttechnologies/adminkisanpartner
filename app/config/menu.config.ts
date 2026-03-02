










// // config/menu.config.ts










// config/menu.config.ts
export interface MenuItem {
  name: string;
  path: string;
  icon: string;
  moduleId?: string;
  allowSubAdmin?: boolean;
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
  // {
  //   section: "Marketplace Management",
  //   items: [
  //     { name: "Orders", path: "/orders", icon: "MdShoppingCart" },
  //           { name: "Crop Care Orders", path: "/cropcare-orders", icon: "MdShoppingCart" },

  //     { name: "Labours", path: "/labours", icon: "MdPeople" },
  //     { name: "Agent Req", path: "/agent-requirements", icon: "MdGroup" },
  //     { name: "Crop Postings", path: "/postings", icon: "MdAdminPanelSettings" },
  //   ],
  // },

  {
    section: "Marketplace Management",
    items: [
      { name: "Orders", path: "/orders", icon: "MdShoppingCart" },
      { name: "Crop Care Orders", path: "/cropcare-orders", icon: "MdLocalHospital" },
      { name: "Labours", path: "/labours", icon: "MdHandyman" },
      { name: "Agent Requirement", path: "/agent-requirements", icon: "MdAssignmentTurnedIn" },
      { name: "Crop Postings", path: "/postings", icon: "MdPostAdd" },
    ],
  },
  // {
  //   section: "User Management",
  //   items: [
  //     { name: "Farmers", path: "/farmers", icon: "MdPeople" },
  //     { name: "Agents", path: "/agents", icon: "MdGroup" },
  //     { name: "Sub Admins", path: "/sub-admins", icon: "MdAdminPanelSettings" },
  //     //  { name: "Transporters", path: "/transporters", icon: "" },

  //   ],
  // },

  {
    section: "User Management",
    items: [
      { name: "Farmers", path: "/farmers", icon: "MdAgriculture" },
      { name: "Agents", path: "/agents", icon: "MdBadge" },
      { name: "Sub Admins", path: "/sub-admins", icon: "MdSecurity", allowSubAdmin: false },
    ],
  },
 
  {
    section: "Content Management",
    items: [
      // { name: "Slider", path: "/slider", icon: "MdSlideshow" },
      // {
      //   name: "Slider",
      //   path: "/slider",
      //   icon: "MdSlideshow",
      //   allowSubAdmin: false // 👈 ADD THIS LINE
      // },

      { name: "Categories", path: "/categories", icon: "MdCategory", allowSubAdmin: false },
      { name: "Crop Care", path: "/cropcare", icon: "MdSpa", allowSubAdmin: false },
      { name: "Post Ads", path: "/admin-advertisement", icon: "MdCampaign", allowSubAdmin: false },
      { name: "Add Notes", path: "/adminnotes", icon: "MdNoteAdd", allowSubAdmin: false },
      { name: "Menu Icons", path: "/menuicon", icon: "MdIcon", allowSubAdmin: false },

      { name: "Farmer Trans Management", path: "/orders-details", icon: "MdReceiptLong" },
      { name: "Trader Trans Management", path: "/trader-transport-managment", icon: "MdLocalShipping" },
      { name: "Transport-vehicle-management", path: "transport-vehicle-management", icon: "MdLocalShipping", allowSubAdmin: false },
      { name: "All Transporters", path: "/transporters", icon: "MdLocalShipping" },
    ],
  },


  // {
  //     section: "Reports",
  //     items: [
  //      { name: "Trader Payments ", path: "/order-payments", icon: "MdMenu" },
  //            { name: "Trader Bids", path: "/trader-bids", icon: "MdMenu" },
  //       { name: "Trader Payment Clearence ", path: "/payment-clearance", icon: "MdMenu" },

  //   { name: "Farmer accept ", path: "/farmer-accept-report", icon: "MdMenu" },
  //       { name: "Transporter Details", path: "/transporterDetails", icon: "MdMenu" },

  //         { name: "Crop Sales ", path: "/crop-sales-report", icon: "MdMenu" },
  //       { name: "Admin To Farmer Payment ", path: "/adminToFarmerPayment-report", icon: "MdMenu" },
  //     ],
  //   },



  {
    section: "Reports",
    items: [
      { name: "Trader Payments", path: "/order-payments", icon: "MdPayments" },
      { name: "Trader Bids", path: "/trader-bids", icon: "MdGavel" },
      { name: "Trader Payment Clearance", path: "/payment-clearance", icon: "MdVerified" },
      { name: "Farmer Accept", path: "/farmer-accept-report", icon: "MdCheckCircle" },
      { name: "Transporter Details", path: "/transporterDetails", icon: "MdLocalShipping" },
      { name: "Crop Sales", path: "/crop-sales-report", icon: "MdSell" },
      { name: "Admin To Farmer Payment", path: "/admintofarmerpayment-report", icon: "MdAccountBalance" },
    ],
  },


  {
    section: "Options & Settings",
    items: [
      // { name: "Breed Options", path: "/breed-options", icon: "MdPets" },
      // { name: "Cattle Options", path: "/cattle-options", icon: "MdGrass" },
      // { name: "Quantity Options", path: "/quantity-options", icon: "MdScale" },
      // { name: "Acres", path: "/acres", icon: "MdLandscape" },
      // { name: "Seeds", path: "/seeds", icon: "MdEco" },
      // { name: "Settings", path: "/settings", icon: "MdSettings" },
      { name: "Commission  Form", path: "/commission-form", icon: "MdRequestQuote", allowSubAdmin: false },
      { name: "Market", path: "/market", icon: "MdStore", allowSubAdmin: false },
      { name: "Quantity Type", path: "/quantity-type", icon: "MdStraighten", allowSubAdmin: false },
    ],
  },
  {
    section: "Lookups",
    items: [
      // { name: "States", path: "/states", icon: "MdOutlineLocationCity" },
      // { name: "District", path: "/district", icon: "MdOutlineMap" },
      // { name: "Taluk ", path: "/taluka", icon: "MdOutlinePlace" },

      { name: "Audit Logs", path: "/audit-logs", icon: "MdOutlineLocationCity", allowSubAdmin: false },
      { name: "States", path: "/states-details", icon: "MdOutlineLocationCity", allowSubAdmin: false },
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
        item.name !== "My Profile" &&
        item.allowSubAdmin !== false
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




















