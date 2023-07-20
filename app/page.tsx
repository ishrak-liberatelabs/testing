"use client"
// Import necessary libraries and components
import React, { useState, useEffect } from "react";
import axios from "axios";
import TypingAnimation from "./Components/TypingAnimation";
import ChatMessage from "./ChatMessage ";

// Define the main functional component Home
export default function Home() {
  // State variables for input value, chat log, and loading status
  const [inputValue, setInputValue] = useState("");
  const [chatLog, setChatLog] = useState<{ type: string; message: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle form submission
  const handleSubmit = (event: any) => {
    event.preventDefault();
    // Add the user's message to the chat log
    setChatLog((prevChatLog) => [...prevChatLog, { type: "user", message: inputValue }]);
    // Send the user's message to the bot
    sendMessage(inputValue);
    setInputValue("");
  };

  // Function to send user's message to the bot
  const sendMessage = (message:any) => {
    // API endpoint and headers for OpenAI chat completions
    const url = "https://api.openai.com/v1/chat/completions";
    const headers = {
      "Content-type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    };
    // Data to be sent in the API request
    const data = {
      model: "gpt-3.5-turbo-0301",
      messages: [{ role: "user", content: message }],
    };

    // Set loading state to true to indicate API call in progress
    setIsLoading(true);

    // Make a POST request to the OpenAI API to get the bot's response
    axios
      .post(url, data, { headers: headers })
      .then((response) => {
        console.log(response);
        // Handle the bot's response
        handleBotResponse(response);
      })
      .catch((error) => {
        // Set loading state to false on error
        setIsLoading(false);
        console.log(error);
      });
  };

  // Function to handle the bot's response and show it as streaming text
  const handleBotResponse = (response: any) => {
    // Extract the bot's response from the API response
    const botMessage = response.data.choices[0].message.content;

    // Check if the bot's response is empty
    if (botMessage.trim() === "") {
      setIsLoading(false); // Set loading state to false to indicate API call completed
      return; // Return early if the bot's response is empty
    }

    // Check if the same message is already present in the chat log
    const isMessageAlreadyExists = chatLog.some((message) => message.type === "bot" && message.message === botMessage);

    // If the message does not already exist, add it to the chat log
    if (!isMessageAlreadyExists) {
      // Create a new message object with the bot's response
      const newMessage = { type: "bot", message: botMessage };

      // Add the new message object to the chat log
      setChatLog((prevChatLog) => [...prevChatLog, newMessage]);

      // Use an interval to add characters one by one to show streaming text effect
      let currentMessage = "";
      const interval = setInterval(() => {
        const nextChar = botMessage[currentMessage.length];
        if (nextChar) {
          currentMessage += nextChar;
          newMessage.message = currentMessage;
          setChatLog((prevChatLog) => [...prevChatLog]);
        } else {
          // Clear the interval when all characters are displayed
          clearInterval(interval);
          // Set loading state to false to indicate API call completed
          setIsLoading(false);
        }
      }, 50);
    } else {
      setIsLoading(false); // Set loading state to false if the message already exists in the chat log
    }
  };

  // useEffect hook to handle the bot's response when loading and a bot message is the last message in chatLog
  useEffect(() => {
    if (isLoading && chatLog.length > 0) {
      const lastMessage = chatLog[chatLog.length - 1];
      if (lastMessage.type === "bot") {
        handleBotResponse({ data: { choices: [{ message: { content: lastMessage.message } }] } });
      }
    }
  }, [chatLog, isLoading]);

  // The return statement contains the chat interface JSX
  return (
    <div className="bg-gray-900">
      <div className="container mx-auto max-w-[700px]">
        <div className="flex flex-col h-screen bg-gray-900">
          {/* ChatGPT heading */}
          <h1 className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text text-center py-3 font-bold text-6xl">LabGPT</h1>
          <div className="flex-grow p-6 overflow-y-scroll overflow-x-hidden scrollbar-hide">
            <div className="flex flex-col space-y-4">
              {/* Map through chatLog and render ChatMessage component for each message */}
              {chatLog.map((message, index) => (
                <ChatMessage key={index} type={message.type} message={message.message} isLoading={isLoading && index === chatLog.length - 1} />
              ))}
            </div>
          </div>
          <form onSubmit={handleSubmit} className="flex-none p-6">
            <div className="flex rounded-lg border border-gray-700 bg-gray-800">
              {/* Input field for user to type a message */}
              <input type="text" className="flex-grow px-4 py-2 bg-transparent text-white focus:outline-none" placeholder="Type your message..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
              {/* Button to send the user's message */}
              <button type="submit" className="bg-purple-500 rounded-lg px-4 py-2 text-white font-semibold focus:outline-none hover:bg-purple-600 transition-colors duration-300">Send</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}