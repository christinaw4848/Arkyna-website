import React from "react";

const InterviewPage: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-orange-50">
    <div className="bg-white rounded-2xl shadow-xl p-10 max-w-lg w-full text-center">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Application Submitted!</h1>
      <p className="text-gray-700 mb-6">
        Thank you for applying to Arkyna. We have received your application and will be in touch soon.<br />
        (This is a placeholder page for the next interview step.)
      </p>
      <a href="/" className="inline-block mt-4 px-6 py-2 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200">Back to Home</a>
    </div>
  </div>
);

export default InterviewPage;
