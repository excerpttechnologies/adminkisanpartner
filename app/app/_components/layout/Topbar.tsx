// import Image from "next/image";
// import { MdNotifications } from "react-icons/md";

// const Topbar = () => {
//   return (
//     <header className="h-16 bg-white border border-zinc-100 flex items-center justify-between px-6">
      
//       {/* Logo */}
//       <div className="flex items-center md:pl-0 pl-5 gap-2 lg:ml-0 ml-5">
//         <Image
//           src="/assets/logo.jpg"
//           alt="Logo"
//           width={50}
//           height={40}
//           priority
//         /> <h1 className="text-green-600 font-bold">Kisan Partner</h1>
//       </div>

   
//     </header>
//   );
// };

// export default Topbar;


import Image from "next/image";
import { MdNotifications } from "react-icons/md";
import Link from "next/link";

const Topbar = () => {
  return (
    <header className="h-16 bg-white border border-zinc-100 flex items-center justify-between px-6">
      
      {/* Logo */}
      <div className="flex items-center md:pl-0 pl-5 gap-2 lg:ml-0 ml-5">
        <Image
          src="/assets/logo.jpg"
          alt="Logo"
          width={50}
          height={40}
          priority
        /> 
        <h1 className="text-green-600 font-bold">Kisan Partner</h1>
      </div>

      {/* Notification Icon - Added on right side */}
      <div className="flex items-center">
        <Link 
          href="/admin-notifications" 
          className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <MdNotifications className="w-6 h-6 text-gray-600" />
          {/* Optional: Add badge for notification count */}
          {/* <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            3
          </span> */}
        </Link>
      </div>
    </header>
  );
};

export default Topbar;