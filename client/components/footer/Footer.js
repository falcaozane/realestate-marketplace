import Link from "next/link";
import { FaTwitter, FaTelegram, FaYoutube } from "react-icons/fa";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full py-6 bg-[#F7F7F7] text-[#222222]  shadow-lg">
      <div className="max-w-6xl mx-auto ">
        <div className='flex justify-between'>
          <div className="">
            <p className="text-sm my-2 text-gray-400">Copyright &copy; {year} Ignitus Network. All rights reserved!</p>
          </div>
          <div className="">
            <ul className="flex space-x-5 my-2">
              <li>
                <Link href="#">
                  <FaTwitter className='text-[#222222]  hover:text-[#FF385C]' size={20} />
                </Link>
              </li>
              <li>
                <Link href="https://telegram.org/">
                  <FaTelegram className='text-[#222222]  hover:text-[#FF385C]' size={20} />
                </Link>
              </li>
              <li>
                <Link href="#">
                  <FaYoutube className='text-[#222222]  hover:text-[#FF385C]' size={20} />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
