import { Avatar, Box, Text } from "@chakra-ui/react";
import React from "react";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg="white"
      _hover={{
        background: "linear-gradient(135deg, #eef4ff, #e0e7ff)",
        color: "#1e293b",
      }}
      w="100%"
      alignItems="center"
      display="flex"
      flexDirection="row"
      color="black"
      px={3}
      py={3}
      mb={3}
      borderRadius="2xl"
      borderWidth="1px"
      borderColor="gray.200"
      boxShadow="sm"
    >
      <Avatar.Root size="sm" mr={2} cursor="pointer">
        <Avatar.Fallback name={user.name} />
        <Avatar.Image src={user?.pic || null} alt={user?.name} />
      </Avatar.Root>
      <Box>
        <Text>{user.name}</Text>
        <Text fontSize="xs">
          <b>Email : </b>
          {user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
