import React from "react";

export interface ShareDropdownProps {
  referralUrl: string;
}

const ShareDropdown: React.FC<ShareDropdownProps> = ({ referralUrl }) => {
  const [open, setOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      setOpen(false);
    } catch (e) {
      setCopied(false);
    }
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      `Check this out! Use my referral link: ${referralUrl}`
    );
    window.open(`https://wa.me/?text=${msg}`, "_blank");
    setOpen(false);
  };

  const handleIMessage = () => {
    const msg = encodeURIComponent(
      `Check this out! Use my referral link: ${referralUrl}`
    );
    window.open(`sms:&body=${msg}`, "_blank");
    setOpen(false);
  };

  return (
    <div className="relative w-full mb-4">
      <button
        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 flex items-center justify-between text-gray-700 font-medium shadow-sm hover:bg-gray-50 focus:outline-none"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        Share Link
        <svg
          className={`ml-2 w-4 h-4 transition-transform ${
            open ? "rotate-180" : "rotate-0"
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
            onClick={handleCopy}
          >
            Copy{" "}
            {copied && <span className="text-green-500 ml-1">Copied!</span>}
          </button>
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
            onClick={handleWhatsApp}
          >
            WhatsApp
          </button>
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
            onClick={handleIMessage}
          >
            iMessage
          </button>
        </div>
      )}
    </div>
  );
};

export default ShareDropdown;
