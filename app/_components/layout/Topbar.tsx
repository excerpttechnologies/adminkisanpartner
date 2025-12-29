import Image from "next/image";
import { MdNotifications } from "react-icons/md";

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
        /> <h1 className="text-green-600 font-bold">Kisan Partner</h1>
      </div>

   
    </header>
  );
};

export default Topbar;


