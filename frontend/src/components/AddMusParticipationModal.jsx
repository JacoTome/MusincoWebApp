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
import SearchBar from "./SearchBar";
export default function AddMusParticipationModal(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [musParticipation, setMusParticipation] = React.useState({});

  const onSave = () => {
    if (
      musParticipation.instruments === undefined ||
      musParticipation.event === undefined
    ) {
      console.log(musParticipation);
      return alert("Please insert all the required fields");
    } else {
      props.addMusParticipation(musParticipation);
      setMusParticipation("");
      onClose();
    }
  };

  const setInstrument = (instrument) => {
    if (instrument !== undefined) {
      setMusParticipation({
        ...musParticipation,
        instruments: instrument,
      });
    }
  };
  const setEvent = (event) => {
    console.log(event);
    if (event !== undefined) {
      setMusParticipation({
        ...musParticipation,
        event: event,
      });
    }
  };
  const setCity = (city) => {
    if (city !== undefined) {
      setMusParticipation({
        ...musParticipation,
        city: city,
      });
    }
  };

  const initialRef = React.useRef();
  return (
    <>
      <Button size={"sm"} onClick={onOpen}>
        {" "}
        Add{" "}
      </Button>
      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <FormControl>
            <ModalHeader>Add a musical participation</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormLabel>Your participation</FormLabel>
              <SearchBar kind={"event"} set={setEvent} />
              <FormLabel>Date & Time</FormLabel>
              <Input
                type="datetime-local"
                onChange={(event) => {
                  setMusParticipation({
                    ...musParticipation,
                    date: event.target.value.split("T")[0],
                    time: event.target.value.split("T")[1],
                  });
                }}
                placeholder="Time"
              />
              <FormLabel>Location</FormLabel>
              <SearchBar kind={"city"} set={setCity} />
              <FormLabel>Song(s) played</FormLabel>
              <Input
                onChange={(event) => {
                  setMusParticipation({
                    ...musParticipation,
                    song: event.target.value,
                  });
                }}
                placeholder="Song(s)"
              />
              <FormLabel>Instruments played</FormLabel>
              <SearchBar kind={"instruments"} set={setInstrument} />

              <FormLabel>Felt Mood</FormLabel>
              <Input
                onChange={(event) => {
                  setMusParticipation({
                    ...musParticipation,
                    felt_mood: event.target.value,
                  });
                }}
                placeholder="Mood"
              />
            </ModalBody>
            <ModalFooter>
              <Button type="submit" colorScheme="blue" mr={3} onClick={onSave}>
                Save
              </Button>
            </ModalFooter>
          </FormControl>
        </ModalContent>
      </Modal>
    </>
  );
}
