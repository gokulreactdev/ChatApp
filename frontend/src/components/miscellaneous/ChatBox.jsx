import { Box } from "@chakra-ui/react";
import { ChatContext } from "../../Context/ChatProvider";
import SingleChat from "../SingleChat";
import { useContext } from "react";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = useContext(ChatContext);

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDirection="column"
      p={3}
      bg="whiteAlpha.900"
      w={{ base: "100%", md: "68%" }}
      borderRadius="2xl"
      borderWidth="1px"
      borderColor="gray.200"
      boxShadow="md"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default ChatBox;
