import { Avatar, Box, Text } from "@chakra-ui/react";
import React from "react";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg="#d4caca"
      _hover={{
        background: "#38B2AC",
        color: "white",
      }}
      w="100%"
      alignItems="center"
      display="flex"
      flexDirection="row"
      color="black"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
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
