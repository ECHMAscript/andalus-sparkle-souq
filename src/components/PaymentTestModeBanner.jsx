// @ts-nocheck
const clientToken = import.meta.env.VITE_PAYMENTS_CLIENT_TOKEN;

export default function PaymentTestModeBanner() {
  if (!clientToken) {
    return (
      <div className="w-full bg-red-100 border-b border-red-300 px-4 py-2 text-center text-xs text-red-800">
        Live payments are not yet configured. Complete payments go-live in Lovable to accept real orders.
      </div>
    );
  }
  if (clientToken.startsWith("pk_test_")) {
    return (
      <div className="w-full bg-amber-100 border-b border-amber-300 px-4 py-2 text-center text-xs text-amber-900">
        Test mode — use card <span className="font-mono font-semibold">4242 4242 4242 4242</span>, any future expiry, any CVC. No real money is charged.
      </div>
    );
  }
  return null;
}
