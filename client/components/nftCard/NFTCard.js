import GetIpfsUrlFromPinata from "@/utils/index";
import Image from "next/image";
import Link from "next/link";

export default function NFTCard({ item }) {
  const IPFSUrls = GetIpfsUrlFromPinata(item.image);
  let n = Math.floor(Math.random() * IPFSUrls.length)
  const IPFSUrl = IPFSUrls[n]; // Select the first gateway URL

  const limitedDescription =
    item.description.length > 100
      ? item.description.substring(0, 100) + "..."
      : item.description;

  return (
    <div className="relative overflow-hidden p-4 rounded-xl group w-full md:w-80 border shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out bg-white">
      <Link href={`/nft/${item.tokenId}`}>
      <div className="relative w-full h-56">
        <Image
          src={IPFSUrl}
          alt={item.name}
          layout="fill"
          objectFit="cover"
          className="rounded-xl"
        />
      </div>
      <div className="py-4 px-2">
          <div className="flex justify-between">
            <strong className="text-[#222222] no-underline hover:text-[#FF385C]  text-lg font-extrabold  block">Real Estate {item.name}</strong>
          </div>
          <div className="text-[#7C7C7C] text-sm mb-3 overflow-hidden text-ellipsis max-h-[3em]">
            <p>This is additioinal description added about {limitedDescription} to test</p>
          </div>
          <div className="">
            <p className="text-[12px] font-semibold flex space-x-1 items-center"><span>Fraction:</span> <span className="px-2 py-1 rounded-full bg-[#FBE7EB] text-[12px] text-[#DE2350] w-fit"> {item.fractionsAvailable} </span></p>
          </div>
        
      </div>
      </Link>
    </div>
  );
}
