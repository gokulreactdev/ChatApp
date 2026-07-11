import { useState, useEffect } from "react";
import axios from "axios";

const ChatPage = () => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    const loadChats = async () => {
      try {
        const response = await axios.get("/api/chats", {
          signal: controller.signal,
        });
        setChats(response.data);
        console.log("Fetched chats:", response.data);
      } catch (error) {
        if (axios.isCancel(error)) return;
        console.error("Error fetching chats:", error);
      }
    };

    loadChats();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div>
      {chats.map((chat) => {
        return <div key={chat._id}>{chat.chatName}</div>;
      })}
    </div>
  );
};

export default ChatPage;
