import React from "react";
import { MessageCircle } from "lucide-react";

const WhatsAppFloatingButton = () => {
  return (
    <a
      href="https://bit.ly/Geotech4All"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all z-50 flex items-center justify-center"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={24} />
    </a>
  );
};

export default WhatsAppFloatingButton;
