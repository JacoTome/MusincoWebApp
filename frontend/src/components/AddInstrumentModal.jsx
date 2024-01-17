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
  Input,
  useDisclosure,
  Button,
  Modal,
} from "@chakra-ui/react";
export default function AddInstrumentModal(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [instruments, setInstruments] = React.useState("");

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
            <ModalHeader>Add an Instrument</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormLabel>Instrument name</FormLabel>
              <Input
                onChange={(instruments) => {
                  setInstruments(instruments.target.value);
                }}
                ref={initialRef}
                placeholder="Your magical instrument"
              />
            </ModalBody>
            <ModalFooter>
              <Button
                type="submit"
                colorScheme="blue"
                mr={3}
                onClick={(event) => {
                  props.addInstrument(instruments);
                  setInstruments("");
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
