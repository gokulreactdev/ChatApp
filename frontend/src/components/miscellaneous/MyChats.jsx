import { useContext, useEffect } from "react";
import { ChatContext } from "../../Context/ChatProvider";
import axios from "axios";
import { toaster } from "../ui/toaster";
import { Box, Button, Stack, Text } from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";
import ChatLoading from "./ChatLoading";
import { getSender } from "../../config/ChatLogics";
import GroupChatModal from "./GroupChatModal";

const MyChats = ({ fetchAgain }) => {
  const { user, selectedChat, setSelectedChat, chats, setChats } =
    useContext(ChatContext);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        if (!user) return;
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get("/api/chat", config);

        setChats(data);
      } catch (error) {
        toaster.create({
          title: error?.message || "Error fetching chats",
          closable: true,
          duration: 5000,
          type: "warning",
        });
      }
    };

    fetchChats();
  }, [setChats, user, fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="whiteAlpha.900"
      width={{ base: "100%", md: "31%" }}
      borderRadius="2xl"
      borderWidth="1px"
      borderColor="gray.200"
      boxShadow="md"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        width="100%"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text fontWeight="700" color="blue.700">
          My Chats
        </Text>
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            variant="subtle"
            borderRadius="full"
            bg="blue.50"
            color="blue.700"
          >
            New Group Chat
            <FiPlus />
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="gray.50"
        width="100%"
        height="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => {
              return (
                <Box
                  key={chat._id}
                  onClick={() => setSelectedChat(chat)}
                  cursor="pointer"
                  bg={
                    selectedChat === chat
                      ? "linear-gradient(135deg, #4f46e5, #2563eb)"
                      : "white"
                  }
                  color={selectedChat === chat ? "white" : "gray.700"}
                  borderWidth="1px"
                  borderColor="gray.200"
                  px={3}
                  py={2}
                  borderRadius="lg"
                  mb={2}
                >
                  <Text>
                    {chat.isGroupChat
                      ? chat.chatName
                      : getSender(user, chat.users)}
                  </Text>
                </Box>
              );
            })}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
