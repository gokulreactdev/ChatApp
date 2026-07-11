import {
  Button,
  Input,
  InputGroup,
  VStack,
  InputElement,
} from "@chakra-ui/react";
import { FormControl, FormLabel } from "@chakra-ui/form-control";

import { useState } from "react";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState("");
  const [show, setShow] = useState(false);


 const onSubmitHandler = () => {
 }

 const postDetails = (pics) => {
  if(pics === undefined) {
    console.log("Please Select an Image");
    return;
  }
  if(pics.type === "image/jpeg" || pics.type === "image/png") {
    const data = new FormData();
    data.append("file", pics);
    data.append("upload_preset", "talk-a-tive");
    data.append("cloud_name", "dhdh8qj6l");
    fetch("https://api.cloudinary.com/v1_1/dhdh8qj6l/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setPic(data.url.toString());
        console.log(data.url.toString());
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    console.log("Please Select an Image");
    return;
  }
}

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

      <Button backgroundColor="blue.500" width="100%" style={{ marginTop: 15 }}
      onClick={onSubmitHandler}>
        Sign Up
      </Button>
    </VStack>
  );
};

export default SignUp;
