import Image from "next/image";
import Link from "next/link";
import { IoRocketSharp } from "react-icons/io5";
import { MdOutlineSell } from "react-icons/md";

export default function HomePage() {
  return (
    <div className="flex flex-col  min-h-[700px] bg-white">
      <div className="flex flex-col-reverse space-y-10 lg:space-y-0 lg:flex-row items-center justify-between max-w-6xl mx-auto w-full flex-grow p-5 lg:gap-5">
        <div className=" text-left lg:w-1/2">
          <h1 className="text-2xl lg:text-5xl font-bold leading-tight mb-6 text-[#222222]">
          Artfully curated homes. <span className="text-[#FF385C]">Real Estate MarketPlace</span>
          </h1>
          <p className="text-sm lg:text-lg  leading-relaxed mb-6 text-[#222222] ">
            Step into a world where dream homes meet cutting-edge solutions. Find your perfect fit. Redefine your real estate journey.
          </p>
          <div className="flex justify-start  space-x-5  mb-10">
            <button className="text-xs lg:text-sm flex   text-white font-semibold  py-1 px-4 lg:py-3 lg:px-8 rounded-full transition duration-300 bg-[#FF385C] hover:bg-[#E01660] items-center">            
              <Link href="/marketplace" className="flex space-x-3">
                <div className="font-semibold">Buy Now</div>
                <div className="text-2xl flex items-center"><IoRocketSharp className="items-center justify-items-center h-4 w-4" /></div>
              </Link>
            </button>
            <button className="text-xs lg:text-sm flex bg-white text-[#FF385C] font-semibold border py-1 px-4 lg:py-3 lg:px-8 rounded-full transition duration-300 shadow-lg hover:bg-[#EBEBEB] items-center">            
              <Link href="/sellNFT" className="flex space-x-3">
                <div className="font-semibold">List Now</div>
                <div className="text-2xl flex items-center"><MdOutlineSell className=" items-center justify-items-center h-4 w-4" /></div>
              </Link>
            </button>
          </div>
        </div>
        <div className="w-full lg:w-1/2 mb-10 lg:mb-0 flex justify-center">
          <Image src="https://thearchitecturedesigns.com/wp-content/uploads/2018/07/13.modern-house-design-ideas.jpg" alt="NFTs" width={1000} height={200} className="w-full object-cover rounded-xl" />
        </div>
      </div>
    </div>
  );
}
