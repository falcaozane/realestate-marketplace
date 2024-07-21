"use client";
import { WalletContext } from "@/context/wallet";
import { useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import MarketplaceJson from "@/app/marketplace.json";
import axios from "axios";
import NFTTile from "@/components/nftCard/NFTCard";

export default function FractionalNFTs() {
  const [fractionalItems, setFractionalItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState("0");
  const [loading, setLoading] = useState(true);
  const { isConnected, userAddress, signer } = useContext(WalletContext);

  async function getFractionalNFTitems() {
    let sumPrice = 0;
    const fractionalItemsArray = [];

    if (!signer) return { fractionalItemsArray, sumPrice }; // Ensure a default return value

    let contract = new ethers.Contract(
      MarketplaceJson.address,
      MarketplaceJson.abi,
      signer
    );

    try {
      let fractionalTransaction = await contract.getMyFractionalNFTs();

      for (const f of fractionalTransaction) {
        const tokenId = parseInt(f.tokenId.toString());
        const tokenURI = await contract.tokenURI(tokenId);
        const meta = (await axios.get(tokenURI)).data;

        // Fetch NFT listing details
        const listing = await contract.getNFTListing(tokenId);
        const pricePerFraction = ethers.formatEther(listing.price.toString());
        const price = pricePerFraction * Number(f.fractionsOwned);

        const fractionalItem = {
          price: price.toFixed(2), // Ensures price is a formatted string
          tokenId,
          fractionsOwned: f.fractionsOwned.toString(),
          image: meta.image,
          name: meta.name,
          description: meta.description,
        };

        fractionalItemsArray.push(fractionalItem);
        sumPrice += Number(price);
      }
    } catch (error) {
      console.error("Error fetching fractional NFT items:", error);
    }

    return { fractionalItemsArray, sumPrice };
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { fractionalItemsArray, sumPrice } = await getFractionalNFTitems() || {}; // Fallback to an empty object
        setFractionalItems(fractionalItemsArray || []);
        setTotalPrice(sumPrice.toFixed(2) || "0"); // Ensures totalPrice is a formatted string
        setLoading(false);
      } catch (error) {
        console.error("Error fetching fractional NFT items:", error);
        setFractionalItems([]);
        setTotalPrice("0");
        setLoading(false);
      }
    };

    fetchData();
  }, [isConnected]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-indigo-950 to-indigo-900">
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
                  <div className="my-5 text-center">
                    <h2 className="text-2xl font-bold text-white">Wallet Address:</h2>
                    <p className="text-sm md:text-xl font-bold text-yellow-100">{userAddress}</p>
                  </div>
                  <div className="flex justify-between my-5">
                    <div>
                      <h2 className="md:text-xl text-sm font-bold text-white flex">
                        Number of Fractional NFTs: <p className="mx-2 text-yellow-100">{fractionalItems.length}</p>
                      </h2>
                    </div>
                    <div>
                      <h2 className="md:text-xl text-sm font-bold text-white flex">
                        Total Value: <p className="text-yellow-100 mx-2">{totalPrice}</p> tCore
                      </h2>
                    </div>
                  </div>
                </div>
                <div className="mt-10">
                  <h2 className="text-4xl text-center font-bold text-white mb-7 uppercase">Your Fractional NFTs</h2>
                  {fractionalItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {fractionalItems.map((value, index) => (
                        <NFTTile item={value} key={index} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-2xl min-h-screen font-bold text-indigo-100 text-center my-4">
                      You don&apos;t have any fractional NFT...
                    </div>
                  )}
                </div>
              </>
            )
          ) : (
            <div className="text-3xl font-bold text-indigo-100 text-center my-4 py-10 h-screen">
              You are not connected...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
