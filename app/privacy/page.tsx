export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4 text-white">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p className="mb-4">
        ISBAD Challenge, accessible from isbad.com, is committed to protecting
        your privacy and complying with the General Data Protection Regulation
        (GDPR). This Privacy Policy explains what data we collect, how we use
        it, and your rights.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Data We Collect</h2>
      <p className="mb-2">When you use our app or sign up, we may collect:</p>
      <ul className="list-disc list-inside mb-4 ml-4">
        <li>Name</li>
        <li>Email address</li>
        <li>User-generated activity (e.g. ice bath logs)</li>
        <li>Technical data such as IP address, browser, and usage data</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        2. Purpose and Legal Basis
      </h2>
      <p className="mb-2">We process your data for the following reasons:</p>
      <ul className="list-disc list-inside mb-4 ml-4">
        <li>To provide and improve our service (legitimate interest)</li>
        <li>To manage your account (contractual necessity)</li>
        <li>To send you notifications or updates (consent, where required)</li>
        <li>To comply with legal obligations (legal obligation)</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Data Sharing</h2>
      <p className="mb-2">Your data is never sold. We may share it with:</p>
      <ul className="list-disc list-inside mb-2 ml-4">
        <li>Service providers (e.g. Supabase for backend and hosting)</li>
        <li>Authorities if legally required</li>
      </ul>
      <p className="mb-4">
        All third parties follow strict confidentiality and data protection
        agreements.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Data Retention</h2>
      <p className="mb-4">
        We keep your personal data only as long as necessary for the purposes
        mentioned above or as required by law. You can delete your data at any
        time by contacting us.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Your Rights</h2>
      <p className="mb-2">Under the GDPR, you have the right to:</p>
      <ul className="list-disc list-inside mb-4 ml-4">
        <li>Access your data</li>
        <li>Request correction of inaccurate data</li>
        <li>Request deletion (&quot;right to be forgotten&quot;)</li>
        <li>Withdraw consent at any time</li>
        <li>Data portability</li>
        <li>Object to data processing in some cases</li>
        <li>Lodge a complaint with a supervisory authority</li>
      </ul>
      <p className="mb-4">
        To exercise any of these rights, email us at{" "}
        <a href="mailto:info@isbad.se" className="text-[#157FBF] underline">
          info@isbad.se
        </a>
        .
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Data Security</h2>
      <p className="mb-4">
        We use secure technologies and best practices to protect your data,
        including encryption, access control, and regular security reviews.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        7. International Transfers
      </h2>
      <p className="mb-4">
        Our data is stored and processed within the EU or in jurisdictions that
        ensure adequate protection under GDPR, such as through standard
        contractual clauses.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        8. Changes to This Policy
      </h2>
      <p className="mb-4">
        We may update this Privacy Policy. We will notify users of significant
        changes by email or in-app notification.
      </p>

      <p className="text-sm text-gray-400 mt-8">Last updated: June 27, 2025</p>
    </div>
  );
}
