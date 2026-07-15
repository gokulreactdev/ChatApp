import { useContext, useState } from "react";
import {
  Box,
  Button,
  Tooltip,
  Text,
  Menu,
  Avatar,
  Drawer,
  Portal,
  Input,
  Spinner,
  Badge,
} from "@chakra-ui/react";
import { ChatContext } from "../../Context/ChatProvider";
import { FiChevronDown } from "react-icons/fi";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router";
import axios from "axios";
import { toaster } from "../ui/toaster";
import ChatLoading from "./ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import { getSender } from "../../config/ChatLogics";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [open, setOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navigate = useNavigate();
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = useContext(ChatContext);
  console.log("🚀 ~ SideDrawer ~ notification:", notification);

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toaster.create({
        title: "Please enter something in search",
        closable: true,
        duration: 5000,
        type: "warning",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/users?search=${search}`, config);
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
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post("/api/chat", { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

      setSelectedChat(data);
      setLoadingChat(false);
      setDrawerOpen(false);
    } catch (error) {
      toaster.create({
        title: error?.message || "Error accessing chat",
        closable: true,
        duration: 5000,
        type: "warning",
      });
      setLoadingChat(false);
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="whiteAlpha.900"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="1px"
        borderColor="gray.200"
        boxShadow="sm"
      >
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <Button
              variant="ghost"
              borderRadius="full"
              bg="gray.50"
              onClick={() => setDrawerOpen(true)}
            >
              <i className="fas fa-search" />
              <Text display={{ base: "none", md: "flex" }} px={"4"}>
                Search
              </Text>
            </Button>
          </Tooltip.Trigger>

          <Tooltip.Positioner>
            <Tooltip.Content>Search Users to chat</Tooltip.Content>
          </Tooltip.Positioner>
        </Tooltip.Root>

        <Text
          fontSize="2xl"
          fontFamily="Work sans"
          fontWeight="700"
          color="blue.700"
        >
          PulseChat
        </Text>

        <div>
          <Menu.Root>
            <Menu.Trigger asChild>
              <Box position="relative" display="inline-block">
                <Button variant="ghost" borderRadius="full" bg="gray.50">
                  <i className="fas fa-bell" />
                </Button>

                {notification.length > 0 && (
                  <Badge
                    position="absolute"
                    top="2px"
                    right="2px"
                    colorPalette="red"
                    borderRadius="full"
                    minW="18px"
                    h="18px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="10px"
                    zIndex={1}
                  >
                    {notification.length}
                  </Badge>
                )}
              </Box>
            </Menu.Trigger>

            <Menu.Positioner>
              <Menu.Content>
                {!notification.length && <Menu.Item>No new Messages</Menu.Item>}
                {notification.map((notific) => (
                  <Menu.Item
                    key={notific._id}
                    onClick={() => {
                      setSelectedChat(notific.chat);
                      setNotification(
                        notification.filter((noti) => noti !== notific),
                      );
                    }}
                  >
                    {notific?.chat?.isGroupChat
                      ? `New Message in ${notific.chat.chatName}`
                      : `New Message in ${getSender(user, notific.chat.users)}`}
                  </Menu.Item>
                ))}
              </Menu.Content>
            </Menu.Positioner>
          </Menu.Root>

          <Menu.Root>
            <Menu.Trigger asChild>
              <Button variant="ghost" borderRadius="full" bg="gray.50">
                <Avatar.Root size="sm">
                  <Avatar.Fallback name={user.name} />
                  <Avatar.Image src={user.pic || null} alt={user.name} />
                </Avatar.Root>

                <FiChevronDown />
              </Button>
            </Menu.Trigger>

            <Menu.Positioner>
              <Menu.Content>
                <Menu.Item value="profile" onClick={() => setOpen(true)}>
                  My Profile
                </Menu.Item>
                <Menu.Item value="logout" onClick={logoutHandler}>
                  Logout
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Menu.Root>
        </div>
        <ProfileModal user={user} open={open} setOpen={setOpen} />
      </Box>

      <Drawer.Root
        open={drawerOpen}
        placement={"start"}
        onOpenChange={(details) => setDrawerOpen(details.open)}
      >
        <Portal>
          <Drawer.Backdrop />

          <Drawer.Positioner>
            <Drawer.Content>
              <Drawer.Header
                borderBottomWidth="1px"
                display="flex"
                alignItems="center"
                bg="gray.50"
              >
                <Drawer.Title fontWeight="700">Search Users</Drawer.Title>
              </Drawer.Header>

              <Drawer.Body>
                <Box display="flex" pb={2} gap={2}>
                  <Input
                    placeholder="Search by name or email"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <Button
                    bgGradient="linear-gradient(135deg, #4f46e5, #2563eb)"
                    color="white"
                    onClick={() => handleSearch()}
                  >
                    Go
                  </Button>
                </Box>
                {loading ? (
                  <ChatLoading />
                ) : (
                  searchResult?.map((user) => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => accessChat(user._id)}
                    />
                  ))
                )}
                {loadingChat && <Spinner size="lg" />}
              </Drawer.Body>

              <Drawer.Footer>
                <Button variant="outline" onClick={() => setDrawerOpen(false)}>
                  Close
                </Button>
              </Drawer.Footer>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </>
  );
};

export default SideDrawer;
