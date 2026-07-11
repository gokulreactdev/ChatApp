import { Box } from "@chakra-ui/react";
import { FiX } from "react-icons/fi";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Box
      px={2}
      m={1}
      borderRadius="lg"
      mb={2}
      alignItems="center"
      justifyContent="space-between"
      display="flex"
      padding={2}
      gap={1}
      variant="solid"
      fontSize={12}
      backgroundColor="purple"
      color="white"
      cursor="pointer"
      onClick={handleFunction}
    >
      {user.name}
      <FiX />
    </Box>
  );
};

export default UserBadgeItem;
