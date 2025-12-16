import Image from "next/image";
import { MdNotifications } from "react-icons/md";

const Topbar = () => {
  return (
    <header className="h-16 bg-white border border-zinc-100 flex items-center justify-between px-6">
      
      {/* Logo */}
      <div className="flex items-center lg: pl-5 gap-2 lg:ml-0 ml-5">
        <Image
          src="/assets/logo.jpg"
          alt="Logo"
          width={50}
          height={40}
          priority
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* <MdNotifications size={22} className="text-gray-600 cursor-pointer" /> */}
        <div className="h-9 w-9 rounded-full bg-green-500 text-white flex items-center justify-center">
          A
        </div>
      </div>
    </header>
  );
};

export default Topbar;
