
import React, { useEffect } from "react";

const InterviewPage: React.FC = () => {
  useEffect(() => {
    // Dynamically add the ElevenLabs widget script
    const script = document.createElement("script");
    script.src = "https://unpkg.com/@elevenlabs/convai-widget-embed";
    script.async = true;
    script.type = "text/javascript";
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen w-full flex bg-orange-50">
      {/* Left Panel: Instructions */}
         <div className="flex-1 p-16 flex flex-col justify-center bg-white border-r border-orange-200 text-lg">
           <h2 className="text-4xl font-bold text-red-600 mb-6">Next Step: Interview</h2>
           <p className="text-gray-700 mb-8 text-xl">
             Welcome to the last part of your application!<br /><br />
             <strong className="text-xl">Instructions:</strong>
             <ul className="list-disc list-inside text-left mt-4 mb-6 text-gray-800 text-lg">
               <li>Interact with our AI interviewer using the widget on the right.</li>
               <li>You will be asked a few questions. Answer them clearly and concisely.</li>
               <li>You can either speak or type with the interviewer.</li>
               <li>When finished, the interviewer will end the interview, and your application will be submitted. You can then close this tab, and we'll be in touch soon.</li>
             </ul>
             <span className="text-lg">Good luck!</span>
           </p>
      </div>
  {/* Right Panel: ElevenLabs Widget Embed */}
  <div className="flex-1 flex items-center justify-center bg-orange-100">
        <div
          style={{ width: "100%", height: "100%" }}
          dangerouslySetInnerHTML={{
            __html:
              '<elevenlabs-convai agent-id="agent_2201k3s114rxfvetvydsy2642g18"></elevenlabs-convai><script src="https://unpkg.com/@elevenlabs/convai-widget-embed" async type="text/javascript"></script>',
          }}
        ></div>
      </div>
    </div>
  );
};

export default InterviewPage;
