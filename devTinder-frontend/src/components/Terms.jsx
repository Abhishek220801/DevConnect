const Terms = () => {
  return (
    <div className="min-h-[70vh] max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-400 mb-6">
        Terms of Service
      </h1>

      <p className="text-gray-600 mb-4">
        By accessing or using MeetDev, you agree to comply with these terms.
      </p>

      <ul className="list-disc pl-5 space-y-2 text-gray-600 mb-4">
        <li>You are responsible for the content you share.</li>
        <li>Abuse, spam, or misuse of the platform is prohibited.</li>
        <li>We may suspend accounts that violate these terms.</li>
      </ul>

      <p className="text-gray-600">
        Continued use of the platform implies acceptance of updated terms.
      </p>
    </div>
  );
};

export default Terms;
