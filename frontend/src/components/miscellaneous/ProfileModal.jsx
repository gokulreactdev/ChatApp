import { Button, Dialog, IconButton, Image, Portal } from "@chakra-ui/react";
import { FiEye } from "react-icons/fi";

const ProfileModal = ({ user, open, setOpen, isIconButton = false }) => {
  return (
    <>
      {isIconButton && (
        <IconButton
          variant="surface"
          display={{ base: "flex" }}
          onClick={() => setOpen(true)}
        >
          <FiEye size={20} />
        </IconButton>
      )}

      <Dialog.Root
        open={open}
        onOpenChange={(details) => setOpen(details.open)}
      >
        <Portal>
          <Dialog.Backdrop />

          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header display="flex" justifyContent="center">
                <Dialog.Title fontsize="40px" fontFamily={"Work sans"}>
                  {user.name}
                </Dialog.Title>
              </Dialog.Header>

              <Dialog.Body
                display="flex"
                justifyContent="Space-between"
                alignItems="center"
                flexDirection="column"
                gap={6}
              >
                <Image
                  src={user?.pic}
                  alt={user.name}
                  borderRadius="full"
                  boxSize="150px"
                  //   objectFit="cover"
                />
                <Dialog.Description
                  fontSize={{ base: "15px", md: "20px" }}
                  fontFamily="Work sans"
                >
                  Email: {user.email}
                </Dialog.Description>
              </Dialog.Body>

              <Dialog.Footer>
                <Button variant={"ghost"} onClick={() => setOpen(false)}>
                  Close
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};

export default ProfileModal;
