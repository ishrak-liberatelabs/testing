import React, { useEffect, useRef } from "react";
import TypingAnimation from "./Components/TypingAnimation";

// The ChatMessage component receives 'type', 'message', and 'isLoading' as props.
const ChatMessage = ({ type, message, isLoading }) => {
  // Create a reference using the useRef() hook to get a reference to the message container.
  const messageRef = useRef();

  // Use the useEffect() hook to scroll the bot response into view when it's still loading.
  useEffect(() => {
    if (type === "bot" && isLoading && messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [type, isLoading]);

  // The ChatMessage component returns a div with conditional rendering for user and bot messages.
  return (
    <div
      ref={messageRef}
      className={`flex ${type === "user" ? "justify-end" : "justify-start"}`}
    >
      {/* Conditional rendering to show or hide the message content based on isLoading and type */}
      <div
        className={`${
          type === "user" ? "bg-purple-500" : "bg-gray-800"
        } rounded-lg p-4 text-white max-w-sm`}
      >
        {/* Show the message content when it's not loading or when it's a user message */}
        <div
          style={{ display: isLoading && type === "bot" ? "none" : "block" }}
        >
          {message}
        </div>
        {/* Show the TypingAnimation when it's loading and a bot message */}
        {isLoading && type === "bot" && <TypingAnimation />}
      </div>
    </div>
  );
};

export default ChatMessage;
