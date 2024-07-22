"use client";
import { WalletContext } from "@/context/wallet";
import { useContext, useEffect, useState } from "react";
import { FaWallet } from "react-icons/fa6";
import { ethers } from "ethers";
import MarketplaceJson from "@/app/marketplace.json";
import axios from "axios";
import NFTTile from "@/components/nftCard/NFTCard";

export default function ListedNFTs() {
  const [items, setItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState("0");
  const [loading, setLoading] = useState(true);
  const { isConnected, userAddress, signer } = useContext(WalletContext);

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
                <div className="w-36 h-36 border-4 border-blue-100 border-dashed rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                <div className="border-b-2 border-indigo-100">
                  <div className="my-5 flex bg-[#FBE7EB] pl-2 pr-4 py-2 rounded-md w-fit items-center space-x-2 text-start">
                    <p className="text-[12px] bg-white rounded-full px-1 py-1 flex items-center font-bold text-[#DE2350]"><FaWallet /></p>
                    <p className="text-[12px] text-[#DE2350] w-fit">{userAddress}</p>
                  </div>
                  <div className="flex justify-between my-5">
                    <div>
                      <h2 className="md:text-xl text-sm font-bold text-[#222222] flex">
                        Number of Listed NFTs: <p className="mx-2 text-yellow-100">{items.length}</p>
                      </h2>
                    </div>
                    <div>
                      <h2 className="md:text-xl text-sm font-bold text-[#222222] flex">
                        Total Value: <p className="text-yellow-100 mx-2">{totalPrice}</p> tCore
                      </h2>
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
                    <div className="">
                      <div className="image flex justify-center">
                        <img className="w-[200px]" src="https://www.artofheritage.com.sa/images/empty-cart.gif" alt="" />
                      </div>
                      <div className="text-sm min-h-screen font-semibold text-[#FF385C] text-center my-4">
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
