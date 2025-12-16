"use client";

import Link from "next/link";
import { useState } from "react";
import {
  MdDashboard,
  MdShoppingCart,
  MdPeople,
  MdSettings,
  MdMenu,
} from "react-icons/md";

const menu = [
  { name: "Dashboard", icon: MdDashboard, path: "/" },
  { name: "Orders", icon: MdShoppingCart, path: "/orders" },
  { name: "Farmers", icon: MdPeople, path: "/farmers" },
  { name: "Settings", icon: MdSettings, path: "/settings" },
];

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-r p-2 border-z">
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

        <nav className="flex flex-col gap-1 px-3 ">
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
