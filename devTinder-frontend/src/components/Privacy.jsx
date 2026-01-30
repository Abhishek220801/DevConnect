const Privacy = () => {
  return (
    <div className="min-h-[70vh] max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-400 mb-6">
        Privacy Policy
      </h1>

      <p className="text-gray-600 mb-4">
        Your privacy matters to us. MeetDev only collects information necessary
        to provide core platform functionality.
      </p>

      <ul className="list-disc pl-5 space-y-2 text-gray-600 mb-4">
        <li>We do not sell your personal data.</li>
        <li>Your data is used only for platform features.</li>
        <li>Authentication is handled securely.</li>
      </ul>

      <p className="text-gray-600">
        By using MeetDev, you agree to this privacy policy. This may be updated
        as the platform evolves.
      </p>
    </div>
  );
};

export default Privacy;
