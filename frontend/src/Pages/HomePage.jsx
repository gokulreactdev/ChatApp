import { Box, Container, Tabs, Text } from "@chakra-ui/react";
import Login from "../components/Authentication/Login";
import SignUp from "../components/Authentication/SignUp";

const HomePage = () => {
  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="1g"
        borderWidth="1px"
      >
        <Text
          fontSize="4xl"
          fontFamily="Work sans"
          color="black"
          textAlign="center"
        >
          Talk-A-Tive
        </Text>
      </Box>
      <Box
        bg="gray.100"
        w="100%"
        p={4}
        borderRadius="md"
        borderWidth="1px"
        borderRadius="1g"
        color="black"
      >
        <Tabs.Root
          variant="plain"
          css={{
            "--tabs-indicator-bg": "red",
            "--tabs-indicator-shadow": "shadows.xs",
            "--tabs-trigger-radius": "radii.full",
          }}
          defaultValue="Login"
        >
          <Tabs.List
            mb="1em"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Tabs.Trigger
              justifyContent="center"
              alignItems="center"
              width={"50%"}
              _selected={{ background: "#3182CE" }}
              value="Login"
            >
              Login
            </Tabs.Trigger>
            <Tabs.Trigger
              justifyContent="center"
              alignItems="center"
              width={"50%"}
              _selected={{ background: "#3182CE" }}
              value="Sign Up"
            >
              Sign Up
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content display="flex" value="Login">
            {<Login />}
          </Tabs.Content>
          <Tabs.Content display="flex" value="Sign Up">
            {<SignUp />}
          </Tabs.Content>
        </Tabs.Root>
      </Box>
    </Container>
  );
};

export default HomePage;
