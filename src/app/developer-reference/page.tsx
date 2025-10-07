"use client";

import React, { useState } from "react";
import Link from "next/link";

const sections = [
  {
    title: "Widget Overview",
    content: (
      <div className="prose prose-sm sm:prose lg:prose-lg max-w-none text-gray-600">
        <p>
          The Referral Widget is a modular, embeddable component for web
          applications. It enables user authentication, wallet creation,
          referral sharing, and a rewards dashboard—all in a single,
          easy-to-integrate package. Designed for e-commerce and rewards-based
          platforms, it can be embedded or used via SDK.
        </p>
      </div>
    ),
  },
  {
    title: "Widget Functionality",
    content: (
      <div className="prose max-w-none text-gray-600">
        <ul className="list-disc pl-5">
          <li>
            <strong>User Authentication</strong> (Passkeys/WebAuthn) <br />
            Secure, passwordless login for users.
          </li>
          <li>
            <strong>Wallet Creation</strong> <br />
            Instantly create a digital wallet for rewards and credits.
          </li>
          <li>
            <strong>Referral Sharing</strong> <br />
            Generate and share unique referral links with friends.
          </li>
          <li>
            <strong>Reward Claiming</strong> <br />
            Users can claim discounts or credits when referred.
          </li>
          <li>
            <strong>Dashboard</strong> <br />
            Track earnings, referral activity, and withdraw rewards.
          </li>
          <li>
            <strong>Configurable Integration</strong> <br />
            Easily inject via HTML/JS or use as a React SDK.
          </li>
          <li>
            <strong>API Integration</strong> <br />
            All server interactions are handled via REST API calls.
          </li>
        </ul>
      </div>
    ),
  },
  {
    title: "Embed via HTML/JS Snippet",
    content: (
      <div className="prose max-w-none">
        <p className="text-gray-600">
          Copy and paste the following snippet into your site to inject the
          widget:
        </p>
        <pre className="bg-gray-600 rounded p-4 overflow-x-auto text-sm">
          {`<div id="referral-widget"></div>
<script src="https://cdn.example.com/referral-widget.js"></script>
<script>
  ReferralWidget.init({
    apiUrl: 'https://api.example.com',
    refCode: 'YOUR_REFERRAL_CODE',
    product: {
      id: 'product-123',
      name: 'Sample Product',
      imageUrl: 'https://example.com/product.jpg',
      price: 19.99,
    },
  });
</script>`}
        </pre>
      </div>
    ),
  },
  {
    title: "SDK via npm/GitHub",
    content: (
      <div className="prose max-w-none text-gray-600">
        <p>Install the widget SDK for React/Next.js projects:</p>
        <pre className="bg-gray-600 rounded p-4 overflow-x-auto text-sm text-gray-100">
          {`npm install @yourorg/referral-widget`}
        </pre>
        <p>
          <a
            href="https://github.com/yourorg/referral-widget"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            View on GitHub
          </a>
        </p>
      </div>
    ),
  },
];

const CollapsibleSection: React.FC<{
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}> = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border rounded-lg mb-4 bg-white shadow-sm">
      <button
        className="w-full flex justify-between items-center px-4 py-3 text-left font-semibold text-gray-800 focus:outline-none hover:bg-gray-50 transition"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span>{title}</span>
        <span className="ml-2 text-gray-400">{open ? "-" : "+"}</span>
      </button>
      {open && <div className="px-4 pb-4 pt-1">{children}</div>}
    </div>
  );
};

export default function DeveloperReferencePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-2 sm:px-0 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 sm:p-10">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 text-center">
          Developer Reference
        </h1>
        <div className="space-y-2">
          {sections.map((section, idx) => (
            <CollapsibleSection
              key={section.title}
              title={section.title}
              defaultOpen={idx === 0}
            >
              {section.content}
            </CollapsibleSection>
          ))}
        </div>
      </div>
      {/* Standard Page Footer */}
      <footer className="w-full bg-gray-100 py-6 mt-8 text-center text-gray-500 text-sm border-t border-gray-200">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
          <Link href="/" className="text-blue-600 hover:underline font-medium">
            Home
          </Link>
          <span className="hidden sm:inline">|</span>
          <Link
            href="/developer-reference"
            className="text-blue-600 hover:underline font-medium"
          >
            Developer Reference
          </Link>
        </div>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
          <span>
            &copy; {new Date().getFullYear()} StyleHub. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}
