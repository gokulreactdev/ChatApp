import { FormControl, FormLabel } from "@chakra-ui/form-control";
import {
  Input,
  InputElement,
  InputGroup,
  Button,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toaster } from "../ui/toaster";
import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setUser } = ChatState();

  const onSubmitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toaster.create({
        title: "Please Fill all the fields",
        description: "Wfdf",
        closable: true,
        duration: 5000,
        type: "warning",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/users/login",
        {
          email,
          password,
        },
        config,
      );

      if (data) {
        setUser(data);
        navigate("/chat");

        localStorage.setItem("userInfo", JSON.stringify(data));
        toaster.create({
          title: "Logged In successfull",
          closable: true,
          duration: 5000,
          type: "success",
        });
        return;
      }
      throw new Error("Not able to Sign up now, please try again");
    } catch (error) {
      toaster.create({
        title: error.message,
        closable: true,
        duration: 5000,
        type: "warning",
      });
    } finally {
      setLoading(false);
    }
  };

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
        loading={loading}
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
        loading={loading}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
};

export default Login;
