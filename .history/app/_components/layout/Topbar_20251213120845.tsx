import { MdNotifications } from "react-icons/md";

const Topbar = () => {
  return (
    <header className="h-16 bg-white border border-zinc-100 flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold lg:ml-0 ml-5">logo</h1>

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
