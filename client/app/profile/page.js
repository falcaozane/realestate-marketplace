"use client";
import { WalletContext } from "@/context/wallet";
import { useContext, useEffect, useState } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { FaWallet} from 'react-icons/fa';
import { FaCopy } from "react-icons/fa6";
import { ethers } from "ethers";
import MarketplaceJson from "@/app/marketplace.json";
import axios from "axios";
import NFTTile from "@/components/nftCard/NFTCard";

export default function ListedNFTs() {
  const [items, setItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState("0");
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(true);
  const { isConnected, userAddress, signer } = useContext(WalletContext);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(userAddress).then(() => {
      alert('Address copied to clipboard!');
    });
  };

  async function getNFTitems() {
    let sumPrice = 0;
    const itemsArray = [];

    if (!signer) return { itemsArray, sumPrice }; // Ensure a default return value

    let contract = new ethers.Contract(
      MarketplaceJson.address,
      MarketplaceJson.abi,
      signer
    );

    try {
      let transaction = await contract.getMyNFTs();

      for (const i of transaction) {
        const tokenId = parseInt(i.tokenId);
        const tokenURI = await contract.tokenURI(tokenId);
        const meta = (await axios.get(tokenURI)).data;
        const price = ethers.formatEther(i.price);

        const item = {
          price,
          tokenId,
          seller: i.seller,
          owner: i.owner,
          image: meta.image,
          name: meta.name,
          description: meta.description,
          fractionsOwned,
        };

        itemsArray.push(item);
        sumPrice += Number(price);
      }
    } catch (error) {
      console.error("Error fetching NFT items:", error);
    }

    return { itemsArray, sumPrice };
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { itemsArray, sumPrice } = await getNFTitems() || {}; // Fallback to an empty object
        setItems(itemsArray || []);
        setTotalPrice(sumPrice || "0");
        setLoading(false);
      } catch (error) {
        console.error("Error fetching NFT items:", error);
        setItems([]);
        setTotalPrice("0");
        setLoading(false);
      }
    };

    fetchData();
  }, [isConnected]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex flex-col items-center justify-center flex-grow">
        <div className="max-w-7xl w-full mx-auto p-4 flex-grow overflow-y-auto">
          {isConnected ? (
            loading ? (
              <div className="flex items-center justify-center h-screen">
                <div className="w-36 h-36 border-4 border-[#DE2350] border-dashed rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                <div className="border-b flex justify-center">
                  <div className="summary-card p-6 pb-10 border mt-4  mb-14 rounded-2xl">
                    <div className="flex flex-col items-center justify-center">
                      <div className="icon-bg p-4 rounded-full bg-[#E9FBF3]">
                        <div className="text-[#09CF9F] text-4xl"><FaCircleCheck /></div>
                      </div>
                      <div className="title flex w-[100%]  flex-col items-center justify-center pt-1 pb-5 border-b mt-2">
                        <h1 className="text-lg font-semibold text-[#222222]">Summary</h1>
                        <p className="text-sm">Check your collection and balance</p>
                      </div>
                    </div>

                    <div className="my-5 flex bg-[#FBE7EB] pl-2 pr-4 py-2 rounded-md w-fit justify-center items-center space-x-2 text-start">
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
                      <p className="text-[12px] text-[#DE2350] w-fit">{userAddress}</p>
                    </div>

                    <div className="">
                      <div className="row flex justify-between px-1 py-2 border-b">
                        <div className="label text-[12px] text-[#A5ACB4]">Listed NFTs</div>
                        <div className="value text-[12px] text-[#222222] font-semibold">{items.length}</div>
                      </div>
                      <div className="row flex justify-between px-1 py-2 border-b">
                        <div className="label text-[12px] text-[#A5ACB4]"> Total Value</div>
                        <div className="value text-[12px] text-[#222222] font-semibold">{totalPrice}</div>
                      </div>
                    </div>
                  
                  </div>
                </div>
                <div className="mt-10">
                <h2 className="text-4xl mt-8 font-bold text-center text-[#222222] uppercase">YOUR LISTED NFTS</h2>
                <h5 className="text-[16px] text-center text-[#FF385C] mb-4">Details of all the NFTS You bought </h5>
                  {items.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {items.map((value, index) => (
                        <NFTTile item={value} key={index} />
                      ))}
                    </div>
                  ) : (
                    <div className="pt-4 pb-10">
                      <div className="image flex justify-center">
                        <img className="w-[200px]" src="https://www.artofheritage.com.sa/images/empty-cart.gif" alt="" />
                      </div>
                      <div className="text-sm  font-semibold text-[#FF385C] text-center my-4">
                        You don&apos;t have any listed NFT
                      </div>
                    </div>
                  )}
                </div>
              </>
            )
          ) : (
            <div className="">
              <div className="image flex justify-center  pr-16 ">
                <img className="w-[400px]" src="https://rssmahilacollege.org/assets/img/undr.gif" alt="" />
              </div>
              <div className="text-3xl font-bold text-[#FF385C] flex justify-center py-8">
                Connect Your Wallet...
              </div>

            </div>
            
          )}
        </div>
      </div>
    </div>
  );
}
