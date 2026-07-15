import { Box, Container, Tabs, Text } from "@chakra-ui/react";
import Login from "../components/Authentication/Login";
import SignUp from "../components/Authentication/SignUp";

const HomePage = () => {
  return (
    <Container maxW="xl" centerContent>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        p={3}
        bg="whiteAlpha.900"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="2xl"
        borderWidth="1px"
        borderColor="gray.200"
        boxShadow="xl"
      >
        <Text
          fontSize="4xl"
          fontFamily="Work sans"
          fontWeight="700"
          color="blue.700"
          textAlign="center"
        >
          PulseChat
        </Text>
      </Box>
      <Box
        bg="whiteAlpha.900"
        w="100%"
        p={4}
        borderRadius="2xl"
        borderWidth="1px"
        borderColor="gray.200"
        boxShadow="md"
      >
        <Tabs.Root
          variant="plain"
          css={{
            "--tabs-indicator-bg": "#4f46e5",
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
              _selected={{
                background: "linear-gradient(135deg, #4f46e5, #2563eb)",
                color: "white",
              }}
              value="Login"
            >
              Login
            </Tabs.Trigger>
            <Tabs.Trigger
              justifyContent="center"
              alignItems="center"
              width={"50%"}
              _selected={{
                background: "linear-gradient(135deg, #4f46e5, #2563eb)",
                color: "white",
              }}
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
