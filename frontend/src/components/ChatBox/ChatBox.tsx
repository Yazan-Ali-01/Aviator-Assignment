import { useEffect, useRef, useState } from "react";
import { ChatBoxProps } from "../../types/types";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import './chatBox.css'

const ChatBox: React.FC<ChatBoxProps> = ({ messages, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState("");
  const debouncedMessage = useDebouncedValue(newMessage, 100);

  useEffect(() => {
    console.log("Messages received in ChatBox:", messages);
  }, [messages]);

  console.log(debouncedMessage);
  const handleSendMessage = () => {
    onSendMessage(debouncedMessage);
    setNewMessage("");
  };

  return (
    <div className="relative w-full h-full flex flex-col ">
      <div className="py-2">
        <h2 className="text-lg leading-6 font-medium text-white">Chat</h2>
      </div>
      <div className="flex-grow rounded-lg bg-[#1F2937] pb-4">
        <div className="py-2 flex-grow overflow-auto max-h-[250px] ">
          <div className="flex flex-col space-y-4 p-4">
            {messages.map((msg, index) => (
              <div key={index} className={`self-${msg?.sender === "You" ? "start" : "start"}  p-2`}>
                <p ><strong className={`${index % 2 === 0 ? 'text-gradient-1' : 'text-gradient-2'}`}>{msg.sender}:  </strong> <span className={`${index % 2 === 0 ? 'bg-slate-900' : 'bg-slate-600'} p-2 rounded-md ml-2`}>{msg?.message}</span></p>
              </div>
            ))}
            {/* <div ref={messagesEndRef} /> */}
          </div>
        </div>
        <div className="px-4 rouned-b-lg flex flex-row space-x-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="w-5/6 rounded-lg p-2 text-white bg-[#14181D] border border-red-500 focus:ring-2 focus:ring-red-700 "
          />
          <button onClick={handleSendMessage} className="w-1/6  bg-gradient-to-r from-rose-400 to-orange-400 opacity-80 hover:opacity-100 text-white font-bold py-2 px-4 rounded-lg">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox