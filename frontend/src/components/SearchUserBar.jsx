import React, { Component } from "react";
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Modal,
  Stack,
  StackItem,
  FormControl,
  FormLabel,
  HStack,
  Accordion,
  AccordionPanel,
  AccordionButton,
  AccordionItem,
} from "@chakra-ui/react";
import SearchBar from "./SearchBar";
import axios from "axios";
import authHeader from "../services/auth-headers";
function SearchModal(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [instrument, setInstrument] = React.useState([]);
  const [genre, setGenre] = React.useState([]);
  const [city, setCity] = React.useState("");

  const save = () => {
    props.set({ instruments: instrument, genres: genre, city: city });
    onClose();
  };

  return (
    <>
      <Button onClick={onOpen}>Open Modal</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Search a partner</ModalHeader>
          <ModalCloseButton />
          <FormControl>
            <ModalBody>
              <Stack>
                <StackItem>
                  <FormLabel size="sm">Instruments</FormLabel>
                  <SearchBar kind="instruments" set={setInstrument} />
                </StackItem>
                <StackItem>
                  <FormLabel size="sm">Genres</FormLabel>
                  <SearchBar kind="genres" set={setGenre} />
                </StackItem>
                <StackItem>
                  <FormLabel size="sm">City</FormLabel>
                  <SearchBar kind="city" set={setCity} />
                </StackItem>
              </Stack>
            </ModalBody>
          </FormControl>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button onClick={save}>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default class SearchUserBar extends Component {
  constructor(props) {
    super(props);
    this.setParameter = this.setParameter.bind(this);
    this.search = this.search.bind(this);
    this.state = {
      search: "",
      parameters: {
        city: "",
        instruments: [],
        genres: [],
      },
      results: [],
    };
  }

  setParameter(parameters) {
    this.setState({
      parameters: {
        ...this.state.parameters,
        city: parameters.city,
        instruments: [
          ...this.state.parameters.instruments,
          parameters.instruments,
        ],
        genres: [...this.state.parameters.genres, parameters.genres],
      },
    });
  }
  async search() {
    console.log(this.state.parameters);
    await axios
      .post(
        `http://localhost:3001/api/users/search`,
        {
          data: JSON.stringify(this.state.parameters),
        },
        {
          headers: authHeader(),
        }
      )
      .then((res) => {
        console.log(res.data);
        this.props.setResults(res.data);
        this.setState({ results: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  render() {
    return (
      <>
        <HStack>
          <StackItem>
            <SearchModal set={this.setParameter} />
          </StackItem>
          <StackItem>
            <Accordion allowToggle>
              <AccordionItem>
                <AccordionButton>Show Filters</AccordionButton>
                <AccordionPanel>
                  {this.state.parameters.city.label}-
                  {this.state.parameters.instruments.length > 0 ? (
                    <>{this.state.parameters.instruments[0].label}</>
                  ) : (
                    <></>
                  )}
                  -
                  {this.state.parameters.genres.length > 0 ? (
                    <>{this.state.parameters.genres[0].label}</>
                  ) : (
                    <></>
                  )}
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </StackItem>
          <StackItem>
            <Button onClick={this.search}>Search</Button>
          </StackItem>
        </HStack>
      </>
    );
  }
}
