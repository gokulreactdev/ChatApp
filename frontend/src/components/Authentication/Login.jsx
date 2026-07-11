import { FormControl, FormLabel } from "@chakra-ui/form-control";
import {
  Input,
  InputElement,
  InputGroup,
  Button,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const onSubmitHandler = () => {};

  return (
    <VStack spacing="5px" width="100%">
      <FormControl
        id="email"
        isRequired
        display="flex"
        flexDirection="column"
        width="100%"
      >
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl
        id="password"
        isRequired
        display="flex"
        flexDirection="column"
        width="100%"
      >
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <>
            <Input
              type={show ? "text" : "password"}
              placeholder="Enter your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputElement placement={"end"} width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputElement>
          </>
        </InputGroup>
      </FormControl>

      <Button
        backgroundColor="blue.500"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={onSubmitHandler}
      >
        Login
      </Button>
      <Button
        backgroundColor="red.500"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={() => {
          setEmail("guest@example.com");
          setPassword("guestpassword");
        }}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
};

export default Login;
