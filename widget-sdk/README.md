## Referral Widget SDK

**Overview**

The Referral Widget is a modular, embeddable component for web applications. It enables user authentication, wallet creation, referral sharing, and a rewards dashboard—all in a single, easy-to-integrate package. Designed for e-commerce and rewards-based platforms, it can be embedded or used via SDK.

**Widget Functionality**

- **User Authentication (Passkeys/WebAuthn)**
  Secure, passwordless login for users.
- **Wallet Creation**
  Instantly create a digital wallet for rewards and credits.
- **Referral Sharing**
  Generate and share unique referral links with friends.
- **Reward Claiming**
  Users can claim discounts or credits when referred.
- **Dashboard**
  Track earnings, referral activity, and withdraw rewards.
- **Configurable Integration**
  Easily inject via HTML/JS or use as a React SDK.
- **API Integration**
  All server interactions are handled via REST API calls.

**Embed via HTML/JS Snippet**

Copy and paste the following snippet into your site to inject the widget:

```html
<div id="referral-widget"></div>
<script src="https://cdn.example.com/referral-widget.js"></script>
<script>
  ReferralWidget.init({
    apiUrl: "https://api.example.com",
    refCode: "YOUR_REFERRAL_CODE",
    product: {
      id: "product-123",
      name: "Sample Product",
      imageUrl: "https://example.com/product.jpg",
      price: 19.99,
    },
  });
</script>
```

**SDK via npm**

Install the widget SDK for React/Next.js projects:

```bash
npm install @yourorg/referral-widget
```
