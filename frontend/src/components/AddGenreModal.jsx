import React from "react";
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  useDisclosure,
  Button,
  Modal,
} from "@chakra-ui/react";
import SearchBar from "./SearchBar";
export default function AddGenreModal(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [genre, setGenre] = React.useState("");

  const initialRef = React.useRef();
  return (
    <>
      <Button size={"sm"} onClick={onOpen}>
        Add
      </Button>
      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <FormControl>
            <ModalHeader>Add a genre you like</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormLabel>Genre name</FormLabel>
              <SearchBar kind="genres" set={setGenre} />
            </ModalBody>
            <ModalFooter>
              <Button
                type="submit"
                colorScheme="blue"
                mr={3}
                onClick={() => {
                  props.addGenre(genre);
                  setGenre("");
                  onClose();
                }}
              >
                Save
              </Button>
            </ModalFooter>
          </FormControl>
        </ModalContent>
      </Modal>
    </>
  );
}
