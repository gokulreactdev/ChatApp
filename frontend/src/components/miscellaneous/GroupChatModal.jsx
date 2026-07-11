import { Box, Button, Dialog, Input, Portal } from "@chakra-ui/react";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import { FormControl } from "@chakra-ui/form-control";
import axios from "axios";
import { toaster } from "../ui/toaster";
import UserListItem from "../UserAvatar/UserListItem";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";

const GroupChatModal = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, chats, setChats } = ChatState();

  const handleSearch = async (query) => {
    setSearchTerm(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/users?search=${query}`, config);
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      toaster.create({
        title: error?.message || "Error searching users",
        closable: true,
        duration: 5000,
        type: "warning",
      });
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSumbmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toaster.create({
        title: "Please fill all the fields",
        closable: true,
        duration: 5000,
        type: "warning",
      });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        "/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config,
      );

      setChats([data, ...chats]);
      setOpen(false);
      toaster.create({
        title: "New Group Chat Created!",
        closable: true,
        duration: 5000,
        type: "success",
      });
    } catch (error) {
      toaster.create({
        title: error?.message || "Error creating group chat",
        closable: true,
        duration: 5000,
        type: "warning",
      });
    }
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toaster.create({
        title: "User already added",
        closable: true,
        duration: 5000,
        type: "warning",
      });
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleDelete = (userToDelete) => {
    console.log("🚀 ~ handleDelete ~ userToDelete:", userToDelete);
    if (selectedUsers.includes(userToDelete)) {
      console.log("🚀 ~ handleDelete ~ userToDelete:", userToDelete);
      setSelectedUsers(
        selectedUsers.filter((el) => el._id !== userToDelete._id),
      );
    }
  };

  return (
    <>
      <span onClick={() => setOpen(true)}>{children}</span>
      <Dialog.Root
        open={open}
        onOpenChange={(details) => setOpen(details.open)}
      >
        <Portal>
          <Dialog.Backdrop />

          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header
                fontSize="35px"
                fontFamily="Work sans"
                display="flex"
                justifyContent="center"
              >
                <Dialog.Title>Create Group Chat</Dialog.Title>
                <Dialog.CloseTrigger />
              </Dialog.Header>

              <Dialog.Body
                display="flex"
                flexDir="column"
                alignItems="center"
                pb={3}
              >
                <Input
                  id="group-chat-name"
                  mb={3}
                  placeholder="Group Chat Name"
                  value={groupChatName}
                  onChange={(e) => setGroupChatName(e.target.value)}
                />
                <Input
                  mb={1}
                  id="search-users"
                  placeholder="Search Users"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                />

                <Box display="flex" flexWrap="wrap" width="100%">
                  {selectedUsers.map((seletedUser) => (
                    <UserBadgeItem
                      key={user._id}
                      user={seletedUser}
                      handleFunction={() => handleDelete(seletedUser)}
                    />
                  ))}
                </Box>

                {loading ? (
                  <div>Loading...</div>
                ) : (
                  searchResult
                    ?.slice(0, 4)
                    .map((user, i) => (
                      <UserListItem
                        key={user._id + i}
                        user={user}
                        handleFunction={() => handleGroup(user)}
                      />
                    ))
                )}
              </Dialog.Body>

              <Dialog.Footer>
                <Button colorScheme={"blue"} onClick={handleSumbmit}>
                  Create Chat
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};

export default GroupChatModal;
