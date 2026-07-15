import {
  Button,
  Input,
  InputGroup,
  VStack,
  InputElement,
} from "@chakra-ui/react";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { toaster } from "../ui/toaster";
import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { ChatContext } from "../../Context/ChatProvider";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState(null);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(ChatContext);
  const navigate = useNavigate();

  const onSubmitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      toaster.create({
        title: "Please Fill all the fields",
        closable: true,
        duration: 5000,
        type: "warning",
      });
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toaster.create({
        title: "Passwords Do Not Match",
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
        "/api/users/",
        {
          name,
          email,
          password,
          confirmPassword,
          pic: pic || undefined,
        },
        config,
      );

      if (data) {
        setUser(data);
        navigate("/chat");
        localStorage.setItem("userInfo", JSON.stringify(data));
        toaster.create({
          title: "SignUp successfull",
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

  const postDetails = async (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toaster.create({
        title: "Please Select an Image!",
        closable: true,
        duration: 5000,
        type: "warning",
      });
      setLoading(false);
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const formData = new FormData();
      formData.append("file", pics);
      formData.append("upload_preset", "chat-app");
      formData.append("cloud_name", "mycloud09");
      try {
        const { data } = await axios.post(
          "https://api.cloudinary.com/v1_1/mycloud09/image/upload",
          formData,
        );
        setPic(data.url.toString());
      } catch (error) {
        toaster.create({
          title: error?.message,
          closable: true,
          duration: 5000,
          type: "warning",
        });
      } finally {
        setLoading(false);
      }
    } else {
      toaster.create({
        title: "Please Select an Image!",
        closable: true,
        duration: 5000,
        type: "warning",
      });
      setLoading(false);
      return;
    }
  };

  return (
    <VStack spacing="15px" width="100%">
      <FormControl
        id="first-name"
        isRequired
        display="flex"
        flexDirection="column"
        width="100%"
      >
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
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

      <FormControl
        id="confirm-password"
        isRequired
        display="flex"
        flexDirection="column"
        width="100%"
      >
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <>
            <Input
              type={show ? "text" : "password"}
              placeholder="Confirm your Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <InputElement placement={"end"} width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputElement>
          </>
        </InputGroup>
      </FormControl>
      <FormControl id="pic" display="flex" flexDirection="column" width="100%">
        <FormLabel>Upload your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>

      <Button
        bgGradient="linear-gradient(135deg, #4f46e5, #2563eb)"
        color="white"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={onSubmitHandler}
        loading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default SignUp;
