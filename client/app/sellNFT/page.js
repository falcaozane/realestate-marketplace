"use client";
import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { uploadFileToIPFS, uploadJSONToIPFS } from "@/utils/pinata";
import marketplace from "@/app/marketplace.json";
import { ethers } from "ethers";
import { WalletContext } from "@/context/wallet";
import { toast } from "react-toastify";

export default function SellNFT() {
  const [formParams, updateFormParams] = useState({
    name: "",
    description: "",
    price: "",
    totalFractions: "",
  });
  const [fileURL, setFileURL] = useState();
  const [message, updateMessage] = useState("");
  const [btnEnabled, setBtnEnabled] = useState(false);
  const [btnContent, setBtnContent] = useState("List NFT");
  const router = useRouter();
  const { isConnected, signer } = useContext(WalletContext);

  useEffect(() => {
    const { name, description, price, totalFractions } = formParams;
    if (name && description && price && totalFractions && fileURL) {
      setBtnEnabled(true);
    } else {
      setBtnEnabled(false);
    }
  }, [formParams, fileURL]);

  async function onFileChange(e) {
    try {
      const file = e.target.files[0];
      const fileType = file.type;

      const validImageTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!validImageTypes.includes(fileType)) {
        updateMessage("Please upload a valid image file (JPEG, JPG, PNG).");
        toast.error("Please upload a valid image file (JPEG, JPG, PNG).");
        return;
      }

      const data = new FormData();
      data.set("file", file);
      updateMessage("Uploading image... Please don't click anything!");
      const response = await uploadFileToIPFS(data);
      if (response.success === true) {
        setFileURL(response.pinataURL);
        updateMessage("");
      }
    } catch (e) {
      console.log("Error during file upload...", e);
      toast.error("Error during file upload...");
    }
  }

  async function uploadMetadataToIPFS() {
    const { name, description, price, totalFractions } = formParams;
    if (!name) {
      toast.error("NFT name is missing!");
      return -1;
    }
    if (!description) {
      toast.error("NFT description is missing!");
      return -1;
    }
    if (!price) {
      toast.error("NFT price is missing!");
      return -1;
    }
    if (!totalFractions) {
      toast.error("Total fractions are missing!");
      return -1;
    }
    if (!fileURL) {
      toast.error("NFT image is missing!");
      return -1;
    }

    const nftJSON = {
      name,
      description,
      price,
      totalFractions,
      image: fileURL,
    };

    try {
      const response = await uploadJSONToIPFS(nftJSON);
      if (response.success === true) {
        return response.pinataURL;
      }
    } catch (e) {
      console.log("Error uploading JSON metadata: ", e);
    }
  }

  async function listNFT(e) {
    try {
      setBtnContent("Processing...");
      const metadataURL = await uploadMetadataToIPFS();
      if (metadataURL === -1) return;

      updateMessage("Uploading NFT...Please don't click anything!");
      let contract = new ethers.Contract(
        marketplace.address,
        marketplace.abi,
        signer
      );
      const price = ethers.parseEther(formParams.price);
      const totalFractions = parseInt(formParams.totalFractions);

      let transaction = await contract.createToken(metadataURL, price, totalFractions);
      await transaction.wait();

      setBtnContent("List NFT");
      updateMessage("");
      updateFormParams({ name: "", description: "", price: "", totalFractions: "" });
      setFileURL(null);
      toast.success("Successfully listed your NFT!");
      router.push("/marketplace");
    } catch (e) {
      console.log("Upload error", e);
      toast.error("Didn't Mint NFT");
      router.push("/profile");
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-white pb-12">
      <h2 className="text-4xl mt-8 font-bold text-center text-[#222222] uppercase">Upload your NFT</h2>
      <h5 className="text-[16px] text-center text-[#FF385C] mb-4">List and Sell your NFT</h5>
      {isConnected ? (
        <div className="flex flex-col items-center justify-center flex-grow mx-2">
          <div className="w-full max-w-lg p-8 border rounded-xl my-5">
            <div className="flex justify-start mb-3 pb-3  pt-2 text-2xl font-semibold ">
              <p>NFT Token Details</p>

            
            </div>
            
            <div className="mb-6">
              <label className="block text-left text-sm font-semibold mb-1 text-[#222222]">
                NFT name
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 text-base bg-white text-[#222222] border  rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF385C]"
                value={formParams.name}
                onChange={(e) =>
                  updateFormParams({ ...formParams, name: e.target.value })
                }
              />
            </div>
            <div className="mb-6">
              <label className="block text-left text-sm font-semibold mb-1 text-[#222222]">
                NFT description
              </label>
              <textarea
                className="w-full px-4 py-2 text-base bg-white text-[#222222] border  rounded-lg h-20 focus:outline-none focus:ring-1 focus:ring-[#FF385C]"
                value={formParams.description}
                onChange={(e) =>
                  updateFormParams({
                    ...formParams,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <div className="mb-6">
              <label className="block text-left text-sm font-semibold mb-1 text-[#222222]">
                Price <span className="text-[10px] text-[#FF385C]">(in tCORE)</span>
              </label>
              <input
                type="number"
                className="w-full px-4 py-2 text-base bg-white text-[#222222] border  rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF385C]"
                value={formParams.price}
                onChange={(e) =>
                  updateFormParams({ ...formParams, price: e.target.value })
                }
              />
            </div>
            <div className="mb-6">
              <label className="block text-left text-sm font-semibold mb-1 text-[#222222]">
                Total Fractions
              </label>
              <input
                type="number"
                className="w-full px-4 py-2 text-base bg-white text-[#222222] border  rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF385C]"
                value={formParams.totalFractions}
                onChange={(e) =>
                  updateFormParams({ ...formParams, totalFractions: e.target.value })
                }
              />
            </div>
            <div className="mb-6">
              <label className="block text-left text-sm font-semibold mb-1 text-[#222222]">
                Upload image
              </label>
              <input
                type="file"
                className="w-full px-4 py-2 text-base bg-white text-[#222222] border  rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF385C]"
                onChange={onFileChange}
                required
              />
            </div>
            <div className="text-[#222222] font-medium text-center my-4">{message}</div>
            <button
              onClick={listNFT}
              type="submit"
              className={`border-none rounded-lg w-full py-3 px-6 flex items-center justify-center text-sm font-semibold transition-colors ${
                btnEnabled ? "bg-[#FF385C] hover:bg-[#E01660] text-white cursor-pointer" : "bg-[#FF385C] text-white cursor-not-allowed"
              }`}
              disabled={!btnEnabled}
            >
              {btnContent === "Processing..." && (
                <span className="inline-block border-4 border-l-white rounded-full mr-2 w-6 h-6 animate-spin" />
              )}
              {btnContent}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center flex-grow">
          <div className="text-4xl font-bold text-[#222222] max-w-6xl mx-auto mb-20 p-4 text-center">
            Connect Your Wallet to Continue...
          </div>
        </div>
      )}
    </div>
  );
}
