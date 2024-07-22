"use client";
import { WalletContext } from "@/context/wallet";
import { BrowserProvider } from "ethers";
import Link from "next/link";
import { useContext, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { SiWalletconnect } from "react-icons/si";

export default function Header() {
  const {
    isConnected,
    setIsConnected,
    userAddress,
    setUserAddress,
    signer,
    setSigner,
  } = useContext(WalletContext);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const connectWallet = async () => {
    if (!window.ethereum) {
      throw new Error("Metamask is not installed");
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      setSigner(signer);
      const accounts = await provider.send("eth_requestAccounts", []);
      setIsConnected(true);
      setUserAddress(accounts[0]);
      const network = await provider.getNetwork();
      console.log(network)
      const chainID = network.chainId;
      const core = "355113";

      if (chainID.toString() !== core) {
        alert("Please switch your MetaMask to bitfinity network");
        return;
      }
    } catch (error) {
      console.error("connection error: ", error);
    }
  };

  return (
    <header className="sticky top-0 z-20 left-0 w-full bg-white text-[#222222] p-4 shadow-lg">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="text-lg md:text-2xl font-bold text-[#FF385C]">
          <Link href="/">Ignitus Network</Link>
        </div>
        <div className="flex space-x-10 items-center">
          <div className="hidden md:flex items-center space-x-4 text-sm">
            <ul className="flex space-x-6 text-[#222222] font-semibold">
              <li>
                <Link href="/marketplace" className="px-3 py-3 hover:bg-[#EBEBEB] rounded-lg">
                  MarketPlace
                </Link>
              </li>
              <li>
                <Link href="/sellNFT" className="px-3 py-3 hover:bg-[#EBEBEB] rounded-lg">
                  List
                </Link>
              </li>
              <li>
                <Link href="/profile" className="px-3 py-3 hover:bg-[#EBEBEB] rounded-lg">
                  My Buildings
                </Link>
              </li>
              <li>
                <Link href="/fractions" className="px-3 py-3 hover:bg-[#EBEBEB] rounded-lg ">
                  My Apartments
                </Link>
              </li>
            </ul>
          </div>
          <div className="">
            <button
              className={`px-4 py-2 rounded-full text-sm flex items-center text-white ${
                isConnected ? "bg-[#FF385C] cursor-not-allowed" : "bg-[#FF385C] hover:bg-[#E01660]"
              }`}
              onClick={connectWallet}
              >
              {isConnected ? (
                <>{userAddress?.slice(0, 10)}...</>
              ) : (
                <>
                  <SiWalletconnect className='md:mr-4' />
                  <span className='hidden md:inline-block'>Connect Wallet</span>
                </>
              )}
            </button>
          </div>
        </div>
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <nav className="md:hidden flex flex-col items-center space-y-4 mt-4">
          <ul className="flex flex-col items-center space-y-4 text-[#222222] font-semibold">
              <li>
                <Link href="/marketplace" className="px-3 py-3 hover:bg-[#EBEBEB] rounded-lg">
                  MarketPlace
                </Link>
              </li>
              <li>
                <Link href="/sellNFT" className="px-3 py-3 hover:bg-[#EBEBEB] rounded-lg">
                  List
                </Link>
              </li>
              <li>
                <Link href="/profile" className="px-3 py-3 hover:bg-[#EBEBEB] rounded-lg">
                  My Buildings
                </Link>
              </li>
              <li>
                <Link href="/fractions" className="px-3 py-3 hover:bg-[#EBEBEB] rounded-lg ">
                  My Apartments
                </Link>
              </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
