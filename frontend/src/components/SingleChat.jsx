import { useCallback, useContext, useEffect, useState } from "react";
import { ChatContext } from "../Context/ChatProvider";
import { FormControl } from "@chakra-ui/form-control";
import { Box, IconButton, Input, Spinner, Text } from "@chakra-ui/react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { FiArrowLeft } from "react-icons/fi";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import axios from "axios";
import { toaster } from "./ui/toaster";
import ScrollableChat from "./ScrollableChat";
import "./styles.css";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { user, selectedChat, setSelectedChat } = useContext(ChatContext);
  console.log("🚀 ~ SingleChat ~ selectedChat:", selectedChat);

  const fetchMessages = useCallback(async () => {
    if (!selectedChat?._id || !user?.token) return;

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config,
      );
      setMessages(data || []);
    } catch (error) {
      toaster.create({
        title: error?.message || "Error Occurred!",
        description: "Failed to load the messages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [selectedChat, user]);

  useEffect(() => {
    const loadMessages = async () => {
      await fetchMessages();
    };
    loadMessages();
  }, [fetchMessages]);

  const typeHanding = (e) => {
    setNewMessage(e.target.value);
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage.trim()) {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      try {
        const messageContent = newMessage.trim();
        setNewMessage("");

        const { data } = await axios.post(
          "/api/message",
          {
            content: messageContent,
            chatId: selectedChat._id,
          },
          config,
        );

        setMessages((prevMessages) => [...prevMessages, data]);
      } catch (error) {
        toaster.create({
          title: error?.message || "Error Occurred!",
          description: "Failed to send the message",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Box
            as="span"
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <Box display="flex" alignItems="center" gap={2}>
              <IconButton
                aria-label="Back"
                variant="plain"
                onClick={() => setSelectedChat(null)}
              >
                <FiArrowLeft />
              </IconButton>
            </Box>

            {!selectedChat.isGroupChat ? (
              <>
                <Text>{getSender(user, selectedChat.users)}</Text>
                <ProfileModal
                  open={showProfile}
                  setOpen={(value) => setShowProfile(value)}
                  isIconButton={true}
                  user={getSenderFull(user, selectedChat.users)}
                />
              </>
            ) : (
              <>
                <Text>{selectedChat.chatName}</Text>
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Box>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} user={user} />
              </div>
            )}
            <FormControl
              width={"100%"}
              onKeyDown={sendMessage}
              isRequired
              mt={3}
            >
              {loading && <Spinner size="lg" />}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message..."
                value={newMessage}
                onChange={typeHanding}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
