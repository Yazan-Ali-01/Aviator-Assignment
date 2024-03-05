import { useEffect, useRef, useState } from "react";
import { ChatBoxProps } from "../../types/types";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";

const ChatBox: React.FC<ChatBoxProps> = ({ messages, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState("");
  const debouncedMessage = useDebouncedValue(newMessage, 500);

  console.log(debouncedMessage);
  const handleSendMessage = () => {
    onSendMessage(debouncedMessage);
    setNewMessage("");
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="py-2 flex-grow overflow-auto">
        <h2 className="text-lg leading-6 font-medium text-white">Chat</h2>
        <div className="flex flex-col space-y-2 p-4 bg-[#181E25] max-h-[40px]">
          {messages.map((msg, index) => (
            <div key={index} className={`self-${msg.data.sender === "You" ? "start" : "start"} ${index % 2 === 0 ? 'bg-slate-900' : 'bg-slate-600'} text-white rounded-lg p-2`}>
              <p><strong>{msg.data.sender}:</strong> {msg.data.message}</p>
            </div>
          ))}
          {/* <div ref={messagesEndRef} /> */}
        </div>
      </div>
      <div className="px-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="w-full rounded p-2"
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage} className="w-full mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox