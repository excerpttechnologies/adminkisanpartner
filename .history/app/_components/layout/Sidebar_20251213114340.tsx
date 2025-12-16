"use client";

import Link from "next/link";
import { useState } from "react";
import {
  MdDashboard,
  MdShoppingCart,
  MdPeople,
  MdGroup,
  MdAdminPanelSettings,
  MdViewCarousel,
  MdCategory,
  MdMenu,
  MdPages,
  MdLanguage,
  MdTune,
  MdGrass,
  MdPets,
  MdScale,
  MdLandscape,
  MdEco,
  MdSettings,
} from "react-icons/md";

const menu = [
  {
    section: "Main",
    items: [
      {
        name: "Dashboard",
        icon: MdDashboard,
        path: "/",
      },
    ],
  },

  {
    section: "Marketplace Management",
    items: [
      {
        name: "Orders",
        icon: MdShoppingCart,
        path: "/orders",
      },
      {
        name: "Labours",
        icon: MdPeople,
        path: "/labours",
      },
      {
        name: "Agent Requirements",
        icon: MdGroup,
        path: "/agent-requirements",
      },
      {
        name: "Postings",
        icon: MdAdminPanelSettings,
        path: "/postings",
      },
    ],
  },

  {
    section: "User Management",
    items: [
      {
        name: "Farmers",
        icon: MdPeople,
        path: "/farmers",
      },
      {
        name: "Agents",
        icon: MdGroup,
        path: "/agents",
      },
      {
        name: "Sub Admins",
        icon: MdAdminPanelSettings,
        path: "/sub-admins",
      },
    ],
  },

  {
    section: "Content Management",
    items: [
      {
        name: "Sliders",
        icon: MdViewCarousel,
        path: "/sliders",
      },
      {
        name: "Categories",
        icon: MdCategory,
        path: "/categories",
      },
      {
        name: "Menu Icons",
        icon: MdMenu,
        path: "/menu-icons",
      },
      {
        name: "Pages Module",
        icon: MdPages,
        path: "/pages",
      },
      {
        name: "Languages",
        icon: MdLanguage,
        path: "/languages",
      },
    ],
  },

  {
    section: "Options & Settings",
    items: [
      {
        name: "Breed Options",
        icon: MdPets,
        path: "/breed-options",
      },
      {
        name: "Cattle Options",
        icon: MdGrass,
        path: "/cattle-options",
      },
      {
        name: "Quantity Options",
        icon: MdScale,
        path: "/quantity-options",
      },
      {
        name: "Acres",
        icon: MdLandscape,
        path: "/acres",
      },
      {
        name: "Seeds",
        icon: MdEco,
        path: "/seeds",
      },
      {
        name: "Settings",
        icon: MdSettings,
        path: "/settings",
      },
    ],
  },
];

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-r p-2 border-zinc-200">
      {/* Mobile Toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded  shadow"
        onClick={() => setOpen(!open)}
      >
        <MdMenu size={22} />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:static z-40 h-full w-64 bg-white  transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="p-4 text-xl font-bold text-green-600">
          
        </div>

        <nav className="flex flex-col gap-1 px-3 mt-3">
          {menu.map((item, i) => (
            <Link
              key={i}
              href={item.path}
              className="flex items-center gap-3 p-3 rounded-lg text-gray-600
              hover:bg-green-50 hover:text-green-600 transition-all"
              onClick={() => setOpen(false)}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </div>
  );
};

export default Sidebar;
