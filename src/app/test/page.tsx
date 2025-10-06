"use client";

import React, { useState } from "react";
import {
  ShoppingCart,
  Share2,
  DollarSign,
  Wallet,
  ArrowLeft,
  Menu,
  Gift,
  ChevronLeft,
} from "lucide-react";

// The main App component handles the page rendering based on the active page state.
function TestPage() {
  const [currentPage, setCurrentPage] = useState("home");

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage setCurrentPage={setCurrentPage} />;
      case "wallet":
        return <WalletPage setCurrentPage={setCurrentPage} />;
      case "share":
        return <SharePage setCurrentPage={setCurrentPage} />;
      case "dashboard":
        return <DashboardPage setCurrentPage={setCurrentPage} />;
      default:
        return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <div className="max-w-md mx-auto p-4 md:p-6 bg-white shadow-lg rounded-xl my-8">
        {renderPage()}
      </div>
    </div>
  );
}

// A reusable header component for consistent navigation and branding.
const AppHeader = ({ title, showBackButton, onBack, showCart }) => (
  <header className="flex items-center justify-between p-4 border-b border-gray-200">
    {showBackButton ? (
      <button
        onClick={onBack}
        className="p-2 rounded-full hover:bg-gray-200 transition-colors"
      >
        <ChevronLeft size={32} />
      </button>
    ) : (
      <Menu size={24} className="text-gray-600" />
    )}
    <h1 className="text-lg font-bold text-gray-800">{title}</h1>
    {showCart ? (
      <ShoppingCart size={24} className="text-gray-600" />
    ) : (
      <div className="w-6" /> // Placeholder to maintain spacing
    )}
  </header>
);

// Home Page: Displays the Summer Collection and an option to earn rewards.
const HomePage = ({ setCurrentPage }) => (
  <div className="space-y-6">
    <AppHeader title="StyleHub" showCart />
    <section>
      <h2 className="text-2xl font-semibold text-gray-800">
        Summer Collection
      </h2>
      <p className="text-sm text-gray-500 mt-1">Discover the latest trends</p>
      <div className="mt-4 bg-white rounded-xl shadow-md overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80"
          alt="Floral Summer Dress"
          className="w-full h-48 object-cover"
        />
        <div className="p-4 space-y-3">
          <h3 className="text-lg font-medium text-gray-800">
            Floral Summer Dress
          </h3>
          <p className="text-sm text-gray-500">Perfect for sunny days</p>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-gray-800">$89.99</span>
            <button className="mt-1 px-4 py-2 bg-green-600 text-white rounded-full text-sm font-medium hover:bg-green-700 transition-colors">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </section>
    <section className="bg-green-100 p-6 rounded-xl text-center space-y-2">
      <div className="bg-green-300 p-2 rounded-full inline-flex">
        <Share2 size={24} className="text-green-800" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800">
        Earn While You Shop
      </h3>
      <p className="text-sm text-gray-600">
        Get rewarded for sharing products with friends
      </p>
      <button
        onClick={() => setCurrentPage("wallet")}
        className="w-full mt-4 px-6 py-3 bg-green-600 text-white rounded-full font-medium shadow-md hover:bg-green-700 transition-colors"
      >
        Start Earning
      </button>
    </section>
  </div>
);

// Wallet Page: Guides the user to create their wallet.
const WalletPage = ({ setCurrentPage }) => (
  <div className="space-y-6">
    <AppHeader
      title="Secure Wallet"
      onBack={() => setCurrentPage("home")}
      showBackButton={false}
    />
    <section className="text-center space-y-4">
      <div className="inline-flex">
        <Gift size={72} className="text-green-400" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800">Sharing Pays Off!</h2>
      <p className="text-lg text-black">
        Earn up to $35.00 for each
        <br /> friend who buys
      </p>
    </section>
    <section className="p-4 bg-gray-50 rounded-lg text-center">
      <p className="text-sm text-gray-600">Current Balance</p>
      <p className="text-3xl font-bold text-gray-800 mt-1">$0.00</p>
      <p className="text-xs text-gray-400 mt-2">Start earning rewards today</p>
    </section>
    <section className="text-center space-y-4">
      <div className="bg-gray-200 p-4 rounded-full inline-flex">
        <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 21a9 9 0 009-9h-9"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3a9 9 0 00-9 9h9"
            />
          </svg>
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-800">Touch ID Setup</h3>
      <p className="text-sm text-gray-500">
        Place your finger on the sensor to authenticate
      </p>
      <button
        onClick={() => setCurrentPage("share")}
        className="w-full px-6 py-3 bg-indigo-600 text-white rounded-full font-medium shadow-md hover:bg-indigo-700 transition-colors"
      >
        Enable Touch ID
      </button>
    </section>
  </div>
);

// Share Page: Allows the user to share a product link.
const SharePage = ({ setCurrentPage }) => (
  <div className="space-y-6">
    <AppHeader
      title="Share & Earn"
      onBack={() => setCurrentPage("wallet")}
      showBackButton
      showCart={false}
    />
    <section className="text-center space-y-2">
      <div className="bg-green-500 text-white rounded-full inline-flex px-4 py-1 text-xs">
        Wallet Balance
      </div>
      <p className="text-3xl font-bold text-gray-800">$1.00</p>
      <p className="text-xs text-gray-400">+$1.00 signup bonus added!</p>
    </section>
    <section>
      <div className="mt-4 bg-white rounded-xl shadow-md overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80"
          alt="Floral Summer Dress"
          className="w-full h-48 object-cover"
        />
        <div className="p-4 w-full space-y-3">
          <h3 className="text-lg font-medium text-gray-800">
            Floral Summer Dress
          </h3>
          <p className="text-sm text-gray-500">Perfect for sunny days</p>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-gray-800">$89.99</span>
            <p className="text-sm text-green-600 mt-2">Earn $10 per sale</p>
          </div>
        </div>
      </div>
    </section>
    <section className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">
        Share with Friends
      </h3>
      <button className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-green-500 text-white rounded-full font-medium shadow-md hover:bg-green-600 transition-colors">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-share-2"
        >
          <circle cx="18" cy="6" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="18" r="3" />
          <line x1="8.59" x2="15.42" y1="13.51" y2="16.49" />
          <line x1="15.42" x2="8.59" y1="7.51" y2="10.49" />
        </svg>
        <span>Share on WhatsApp</span>
      </button>
      <div className="flex flex-col space-y-2">
        <button className="w-full flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 rounded-full font-medium hover:bg-gray-100 transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-copy-plus"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <path d="M7 9h4" />
            <path d="M7 13h4" />
            <path d="M12 17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2z" />
            <path d="M15 10h6" />
          </svg>
          <span>Copy Link</span>
        </button>
        <button className="w-full flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 rounded-full font-medium hover:bg-gray-100 transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-mail-plus"
          >
            <path d="M22 10.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v1.5" />
            <path d="m22 6-10 7L2 6" />
            <path d="M16 19h6" />
            <path d="M19 16v6" />
          </svg>
          <span>Send via Email</span>
        </button>
      </div>
    </section>
    <button
      onClick={() => setCurrentPage("dashboard")}
      className="w-full px-6 py-3 text-sm text-gray-500 hover:underline"
    >
      View dashboard
    </button>
  </div>
);

// Dashboard Page: Shows the user's earnings and recent activity.
const DashboardPage = ({ setCurrentPage }) => (
  <div className="space-y-6">
    <AppHeader
      title="Earnings Dashboard"
      onBack={() => setCurrentPage("share")}
      showBackButton
    />
    <section>
      <div className="flex items-center space-x-2 p-2 bg-green-100 text-green-700 rounded-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-check-circle"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-8.62" />
          <path d="M12 2v10" />
          <path d="M12 12l4 4" />
          <path d="M12 12l-4-4" />
        </svg>
        <p className="text-sm">
          Payment received! Someone purchased using your link
        </p>
      </div>
    </section>
    <section>
      <h2 className="text-lg font-semibold text-gray-800">
        Track your referral rewards
      </h2>
      <div className="mt-4 bg-green-600 text-white p-6 rounded-xl text-center space-y-4 shadow-lg">
        <div className="bg-white text-green-600 p-2 rounded-full inline-flex">
          <DollarSign size={24} />
        </div>
        <p className="text-sm text-green-100">Total Earnings</p>
        <p className="text-5xl font-bold">$11.00</p>
        <p className="text-xs text-green-200">+$10.00 commission earned!</p>
      </div>
    </section>
    <section>
      <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
      <div className="mt-4 space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm">
          <div>
            <p className="font-medium">Referral Commission</p>
            <p className="text-sm text-gray-500">
              Floral Summer Dress - Just now
            </p>
          </div>
          <p className="text-green-600 font-bold">+$10.00</p>
        </div>
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm">
          <div>
            <p className="font-medium">Welcome Bonus</p>
            <p className="text-sm text-gray-500">
              Account creation - 5 min ago
            </p>
          </div>
          <p className="text-green-600 font-bold">+$1.00</p>
        </div>
      </div>
    </section>
    {/* <div className="grid grid-cols-2 gap-4 mt-6">
      <button className="px-6 py-3 border border-gray-300 rounded-full font-medium hover:bg-gray-100 transition-colors text-sm">
        Share More Products
      </button>
      <button className="px-6 py-3 bg-gray-800 text-white rounded-full font-medium hover:bg-gray-900 transition-colors text-sm">
        Withdraw Earnings
      </button>
    </div> */}
  </div>
);

export default TestPage;
