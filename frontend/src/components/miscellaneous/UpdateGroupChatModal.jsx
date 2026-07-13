import {
  Box,
  Button,
  Dialog,
  IconButton,
  Input,
  Portal,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import { FiEye } from "react-icons/fi";
import { ChatContext } from "../../Context/ChatProvider";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import UserListItem from "../UserAvatar/UserListItem";
import axios from "axios";
import { toaster } from "../ui/toaster";
import { FormControl } from "@chakra-ui/form-control";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const [open, setOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const { user, selectedChat, setSelectedChat } = useContext(ChatContext);

  const handleRename = async () => {
    if (!groupChatName) return;

    setRenameLoading(true);

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    try {
      const { data } = await axios.put(
        "/api/chat/rename",
        { chatId: selectedChat._id, chatName: groupChatName },
        config,
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
    } catch (error) {
      toaster.create({
        title: error?.message || "Error Occurred!",
        description: "Failed to rename the chat",
        closable: true,
        duration: 5000,
        type: "error",
      });

      setRenameLoading(false);
    } finally {
      setRenameLoading(false);
    }
  };

  const handleRemove = async (userToRemove) => {
    if (
      selectedChat.groupAdmin._id !== user._id &&
      userToRemove._id !== user._id
    ) {
      toaster.create({
        title: "Only admins can remove someone!",
        closable: true,
        duration: 5000,
        type: "error",
      });
      return;
    }

    setLoading(true);

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    try {
      const { data } = await axios.put(
        "/api/chat/groupremove",
        { chatId: selectedChat._id, userId: userToRemove._id },
        config,
      );
      userToRemove._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
      fetchMessages();
    } catch (error) {
      toaster.create({
        title: error?.message || "Error Occurred!",
        description: "Failed to remove the user",
        closable: true,
        duration: 5000,
        type: "error",
      });
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      setSearchResults([]);
      return;
    }

    setLoading(true);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/users?search=${query}`, config);
      setSearchResults(data);
    } catch (error) {
      toaster.create({
        title: error?.message || "Error Occurred!",
        description: "Failed to load the search results",
        closable: true,
        duration: 5000,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (userToAdd) => {
    if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
      toaster.create({
        title: "User already in group!",
        closable: true,
        duration: 5000,
        type: "warning",
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toaster.create({
        title: "Only admins can add someone!",
        closable: true,
        duration: 5000,
        type: "error",
      });
      return;
    }

    setLoading(true);

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    try {
      const { data } = await axios.put(
        "/api/chat/groupadd",
        { chatId: selectedChat._id, userId: userToAdd._id },
        config,
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toaster.create({
        title: error?.message || "Error Occurred!",
        description: "Failed to add the user",
        closable: true,
        duration: 5000,
        type: "error",
      });
      setLoading(false);
    }
  };

  return (
    <>
      <IconButton
        variant="surface"
        display={{ base: "flex" }}
        onClick={() => setOpen(true)}
      >
        <FiEye size={20} />
      </IconButton>

      <Dialog.Root
        open={open}
        onOpenChange={(details) => setOpen(details.open)}
      >
        <Portal>
          <Dialog.Backdrop />

          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header display="flex" justifyContent="center">
                <Dialog.Title fontSize="40px" fontFamily={"Work sans"}>
                  {selectedChat.chatName}
                </Dialog.Title>
              </Dialog.Header>

              <Dialog.Body>
                <Box display="flex" flexWrap="wrap" w="100%" pb={3}>
                  {selectedChat.users.map((u) => (
                    <UserBadgeItem
                      key={u._id}
                      user={u}
                      handleFunction={() => handleRemove(u)}
                    />
                  ))}
                </Box>
                <Box display="flex" w="100%" flexDirection="row" pb={3} gap={2}>
                  <Input
                    id="group-chat-name"
                    placeholder="Chat Name"
                    mb={3}
                    value={groupChatName}
                    onChange={(e) => setGroupChatName(e.target.value)}
                  />

                  <Button
                    colorPalette="teal"
                    loading={renameLoading}
                    onClick={handleRename}
                    mb={3}
                  >
                    Update
                  </Button>
                </Box>
                <FormControl>
                  <Input
                    id="search-users"
                    placeholder="Add User to group"
                    mb={3}
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </FormControl>

                {loading ? (
                  <div>Loading...</div>
                ) : (
                  searchResults?.map((user) => (
                    <div key={user._id}>
                      <UserListItem
                        key={user._id}
                        user={user}
                        handleFunction={() => handleAddUser(user)}
                      />
                    </div>
                  ))
                )}
              </Dialog.Body>

              <Dialog.Footer>
                <Button variant={"ghost"} onClick={() => setOpen(false)}>
                  Close
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};

export default UpdateGroupChatModal;
