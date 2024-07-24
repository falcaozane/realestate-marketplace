"use client";
import { WalletContext } from "@/context/wallet";
import { PiFilesFill } from "react-icons/pi";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import MarketplaceJson from "../../marketplace.json";
import { FaCheckCircle } from "react-icons/fa";
import { FaCopy } from "react-icons/fa6";
import { FaWallet } from "react-icons/fa6";
import { ethers } from "ethers";
import axios from "axios";
import GetIpfsUrlFromPinata from "@/utils/index";
import Image from "next/image";
import { toast } from "react-toastify";
import { IoBagCheckOutline } from "react-icons/io5";
import { IoIosWarning } from "react-icons/io";

export default function NFTPage() {
  const params = useParams();
  const tokenId = params.tokenId;
  const [item, setItem] = useState();
  const [msg, setMsg] = useState();
  const [btnContent, setBtnContent] = useState("Buy NFT");
  const [loading, setLoading] = useState(true);
  const [fractions, setFractions] = useState(0);
  const { isConnected, userAddress, signer } = useContext(WalletContext);
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(item?.seller).then(() => {
      alert('Seller address copied to clipboard!');
    });
  };

  async function getNFTData() {
    if (!signer) return;
    let contract = new ethers.Contract(
      MarketplaceJson.address,
      MarketplaceJson.abi,
      signer
    );
    let tokenURI = await contract.tokenURI(tokenId);
    const listedToken = await contract.getNFTListing(tokenId);

    const ipfsUrls = GetIpfsUrlFromPinata(tokenURI);

    let meta;
    for (const url of ipfsUrls) {
      try {
        meta = (await axios.get(url)).data;
        break;
      } catch (error) {
        console.error(`Error fetching metadata from ${url}:`, error);
      }
    }

    if (!meta) {
      throw new Error("Unable to fetch metadata from any IPFS gateway.");
    }

    const item = {
      price: ethers.formatEther(listedToken.price),
      tokenId,
      seller: listedToken.seller,
      owner: listedToken.owner,
      image: meta.image,
      name: meta.name,
      description: meta.description,
      isListed: listedToken.isListed,
      totalFractions: listedToken.totalFractions,
      fractionsAvailable: listedToken.fractionsAvailable,
    };

    console.log(item.totalFractions);
    console.log(item.fractionsAvailable);
    return item;
  }

  useEffect(() => {
    async function fetchData() {
      if (!signer) return;
      try {
        const itemTemp = await getNFTData();
        setItem(itemTemp);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching NFT items:", error);
        setItem(null);
        setLoading(false);
      }
    }

    fetchData();
  }, [isConnected, signer]);

  async function buyNFT(event) {
    event.preventDefault(); // Prevent the default form submission behavior
    try {
      if (!signer) return;
      let contract = new ethers.Contract(
        MarketplaceJson.address,
        MarketplaceJson.abi,
        signer
      );
      const TotalFractions = item.totalFractions;
      const price = ethers.parseUnits(item.price, "ether");
      const pricePerFraction = price / TotalFractions;
      
      const salePrice = pricePerFraction * BigInt(fractions);
      setBtnContent("Processing...");
      setMsg("Buying the NFT... Please Wait (Up to 5 mins)");
      toast.info("Buying the NFT... Please Wait (Up to 5 mins)");
      let transaction = await contract.executeFractionalSale(tokenId, fractions, {
        value: salePrice,
      });
      await transaction.wait();
      toast.success("You successfully bought the NFT!");
      setMsg("");
      setBtnContent("Buy NFT");
      router.push("/profile");
    } catch (e) {
      console.log("Buying Error: ", e);
      toast.error("Buying Error please check wallet balance");
      router.push("/marketplace");
    }
  }

  const PlaceholderCard = () => (
    <div className="w-full md:h-80 bg-white rounded-lg"></div>
  );

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="flex flex-col items-center justify-center flex-grow mx-2">
        {isConnected ? (
          loading ? (
            <div className="flex items-center justify-center h-screen">
              <PlaceholderCard />
            </div>
          ) : (
            <div className=" border max-w-6xl w-full mx-2 md:mx-auto shadow-lg rounded-lg p-4 overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="w-full">
                  <Image
                    src={item?.image}
                    alt=""
                    width={800}
                    height={520}
                    className="w-full h-[100%] rounded-xl object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="w-full text-[#222222] flex flex-col justify-between md:px-4">
                  <div className="">
                    
                    <div className="flex mb-3 text-sm font-semibolditems-center justify-items-center text-center">
                    <div className="flex bg-[#FBE7EB] pl-2 pr-4 py-2 rounded-md w-fit justify-center items-center space-x-2 text-start">
                      <div
                        className="text-[12px] bg-white rounded-full px-1 py-1 flex items-center font-bold text-[#DE2350]"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                      >
                        {isHovered ? (
                          <FaCopy onClick={copyToClipboard} className="cursor-pointer" />
                        ) : (
                          <FaWallet />
                        )}
                      </div>
                      <div className="text-[12px] text-[#DE2350] w-fit flex space-x-1">
                        <div>{item?.seller}</div>
                        <div className="text-[10px] text-[#FF3E3E]">/Seller</div>
                      </div>
                    </div>
                    </div>
                    <div className="text-sm font-semibold mb-1">
                      <p className="text-3xl font-semibold w-[90%]">The <span className="text-[#DE2350]">{item?.name.toUpperCase()}</span> I have added some Text to Name</p>
                    </div>
                    <div className="text-sm mb-3 ">
                      <p className="text-[15px] text-[#83828A] w-[80%]">This description is also longened for trial purpose {item?.description} and to test </p>
                    </div>
                    
                    <div className="text-[12px] mb-1">
                      <div className="flex space-x-2"> 
                        <div className="text-lg text-[#E16884]"><PiFilesFill /></div>
                        <div className="text-[#83828A]">Total Apartments  {item?.totalFractions.toString()}</div>
                      </div>
                    </div>
                    <div className="text-[12px] mb-4">
                      <div className="flex space-x-2"> 
                        <div className="text-[16px] text-[#E16884]"><FaCheckCircle /></div>
                        <div className="text-[#83828A] pl-1">Apartments Available {item?.fractionsAvailable.toString()}</div>
                      </div>
                    </div>
                    
                    <div className="font-semibold">
                      <p className="text-[12px] text-[#e16884]">BFT</p>
                      <p className="text-[12px] text-[#e16884]"><span className="text-4xl text-[#DE2350]">{item?.price}</span>/apartment </p>
                    </div>
                    
                    
                  </div>
                  <div className="mt-4">
                    <div className=" text-lg">{msg}</div>
                    {item?.isListed ? (
                      userAddress.toLowerCase() === item?.seller.toLowerCase() ? (
                        <div className="text-indigo-50 font-bold">
                          You already own this NFT!
                        </div>
                      ) : item?.fractionsAvailable > 0 ? (
                        <form className="" onSubmit={buyNFT}>
                          <input
                            type="number"
                            min="1"
                            max={item?.fractionsAvailable}
                            placeholder="Enter fractions to buy"
                            onChange={(e) => setFractions(Number(e.target.value))}
                            className="px-3 py-2 mt-2 border focus:border-[#FF3E3E] focus:outline-none rounded-lg mb-3 w-72 text-[12px]  text-[#222222]"
                            required
                          />
                          <button
                            type="submit"
                            className=" bg-[#DE2350] mb-2 text-white text-[12px] font-semibold py-1 px-4 rounded-lg flex items-center"
                          >
                            {btnContent === "Processing..." && (
                              <span className="spinner" />
                            )}
                            {btnContent}
                          </button>
                        </form>
                      ) : (
                        <div className="flex px-3 space-x-4 py-4 rounded-xl bg-gradient-to-br from-[#FEEEEF] to-[#FAFAFD] ">
                          <div className="icon flex items-center">
                            <div className="text-[#FF3E3E] flex items-center rounded-full p-2 bg-[#FCF6F6] border-2 border-white">
                              <IoIosWarning />
                            </div>
                          </div>
                          <div className="">
                            <div className="heading text-[#131C39] text-[16px] font-semibold">This is warning message</div>
                            <div className="warning text-[12px]">No fractions are available to buy.</div>
                          </div>
                          
                        </div>
                      )
                    ) : (
                      <div className=" font-bold">
                        <p className="text-sm md:text-xl">
                          This NFT was bought by: {item?.owner}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        ) : (
          <div className="text-white text-2xl">You are not connected...</div>
        )}
      </div>
    </div>
  );
}
