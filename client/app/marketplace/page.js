"use client";
import { WalletContext } from "@/context/wallet";
import { useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import MarketplaceJson from "@/app/marketplace.json";
import axios from "axios";
import NFTCard from "@/components/nftCard/NFTCard";

export default function Marketplace() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isConnected, signer } = useContext(WalletContext);

  async function getNFTitems() {
    const itemsArray = [];
    if (!signer) return;
    let contract = new ethers.Contract(
      MarketplaceJson.address,
      MarketplaceJson.abi,
      signer
    );

    try {
      let transaction = await contract.getAllListedNFTs();

      for (const i of transaction) {
        if (i.isListed) { // Only include items that are listed
          const tokenId = parseInt(i.tokenId);
          const tokenURI = await contract.tokenURI(tokenId);
          const meta = (await axios.get(tokenURI)).data;
          const price = ethers.formatEther(i.price); // Use ethers.utils.formatEther instead of ethers.formatEther
          const totalFractions = parseInt(i.totalFractions);
          const fractionsAvailable = parseInt(i.fractionsAvailable); // Ensure to get fractionsAvailable

          const item = {
            price,
            tokenId,
            seller: i.seller,
            owner: i.owner,
            image: meta.image,
            name: meta.name,
            description: meta.description,
            totalFractions,
            fractionsAvailable,
          };

          itemsArray.push(item);
        }
      }
    } catch (error) {
      console.error("Error fetching NFT items:", error);
    }

    return itemsArray;
  }

  useEffect(() => {
    const fetchData = async () => {
      if (isConnected) {
        setLoading(true);
        try {
          const itemsArray = await getNFTitems();
          setItems(itemsArray);
        } catch (error) {
          console.error("Error fetching NFT items:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [isConnected, signer]); // Added signer and getNFTitems as dependencies

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex flex-col items-center flex-grow">
        <div className="max-w-6xl w-full mx-auto p-4 flex-grow py-5">
          {isConnected ? (
            <>
              <div className="my-5">
                <h2 className="text-4xl font-bold text-center text-[#222222]  uppercase">
                  Marketplace
                </h2>
                <h6 className="text-[16px] text-center text-[#FF385C] mb-7">Explore the Amazing collection of NFT&apos;s</h6>
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="w-40 h-40 border-4 border-dashed rounded-full animate-spin border-white mt-14"></div>
                  </div>
                ) : items.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {items.map((value, index) => (
                      <NFTCard item={value} key={index} />
                    ))}
                  </div>
                ) : (
                  <div className="text-2xl font-bold text-red-400 text-center my-8 py-16 h-screen">
                    No NFT Listed Now...
                  </div>
                )}
              </div>
            </>
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
