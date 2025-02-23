

function Navbar() {
  return (
    <div className="h-[60px] flex items-center w-full px-[22px]">
      <div className="w-[220px]">
        <img src="assets/logo.png" alt="" className=""/>
      </div>
      <div className="flex items-center justify-between w-full">
        <h1 className="text-[24px] font-extrabold ml-[30px]">Welcome, John</h1>
        <div className="flex gap-[5px]">
        <img src="assets/logout.png"/>
        <p className="text-[#FF3B30] mb-0 text-[16px]">Log out</p>
        </div>
        
      </div>
    </div>
  );
}

export default Navbar;
