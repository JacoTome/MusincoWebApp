import axios from "axios";
import React, { Component } from "react";
import Header from "../components/Header";
import {
  Container,
  StackDivider,
  VStack,
  Text,
  Flex,
  Spacer,
  Button,
  Heading,
  Grid,
  GridItem,
  StackItem,
  Box,
  Tag,
  HStack,
} from "@chakra-ui/react";
import Loading from "../components/Loading";
import EditField, { EditCityField } from "../components/EditField";
import authHeader from "../services/auth-headers";
import AddInstrumentModal from "../components/AddInstrumentModal";
import AddGenreModal from "../components/AddGenreModal";
import MusParticipationCard from "../components/MusParticipationCard";
import AddMusParticipationModal from "../components/AddMusParticipationModal";
import authService from "../services/auth.service";

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.getUserInfo = this.getUserInfo.bind(this);
    this.getParticipation = this.getParticipation.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.resetMusPref = this.resetMusPref.bind(this);
    this.removeInstrument = this.removeInstrument.bind(this);
    this.removeGenre = this.removeGenre.bind(this);
    this.addInstrument = this.addInstrument.bind(this);
    this.addGenre = this.addGenre.bind(this);
    this.addMusParticipation = this.addMusParticipation.bind(this);
    this.deleteMusParticipation = this.deleteMusParticipation.bind(this);
    this.setCity = this.setCity.bind(this);
    this.getCity = this.getCity.bind(this);

    this.state = {
      loading: true,
      user: {
        id: "",
        username: "",
        firstname: "",
        surname: "",
        instruments: ["Chitarra"],
        genres: ["Rock"],
        name: "",
        city: "",
        participation: [
          {
            date: "2021-04-20",
            time: "20:00",
            address: "Via Roma, 1",
            event: "Concerto",
            song: "Canzone",
            instruments: ["Chitarra", "Basso"],
            felt_mood: "Felice",
          },
        ],
        genresToDelete: [],
        instrumentsToDelete: [],
      },
      newUser: {
        instruments: [],
        genres: [],
        participation: [],
        partToDelete: [],

        city: "",
      },
    };
  }

  async updateUser() {
    let updatedData = {
      id: this.state.user.id,
    };
    for (const [key, value] of Object.entries(this.state.newUser)) {
      if (
        value !== this.state.user[key] &&
        (value !== "" || value !== null || value.length !== 0)
      ) {
        updatedData[key] = value;
      }
    }

    await axios
      .post(
        `http://localhost:3001/api/users/${this.state.user.id}`,
        {
          ...updatedData,
        },
        { headers: authHeader() }
      )
      .catch((error) => {
        console.log(error);
      });

    if (this.state.newUser.partToDelete.length > 0) {
      console.log(this.state.newUser.partToDelete);
      await axios
        .delete(`http://localhost:3001/api/users/${this.state.user.id}`, {
          headers: authHeader(),
          data: { partToDelete: this.state.newUser.partToDelete },
        })
        .catch((error) => {
          console.log(error);
        });
    }
    if (this.state.user.genresToDelete.length > 0) {
      await axios
        .delete(`http://localhost:3001/api/users/${this.state.user.id}`, {
          headers: authHeader(),
          data: { genresToDelete: this.state.user.genresToDelete },
        })
        .catch((error) => {
          console.log(error);
        });
    }
    if (this.state.user.instrumentsToDelete.length > 0) {
      await axios
        .delete(`http://localhost:3001/api/users/${this.state.user.id}`, {
          headers: authHeader(),
          data: { instrumentsToDelete: this.state.user.instrumentsToDelete },
        })
        .catch((error) => {
          console.log(error);
        });
    }
    window.location.reload();
  }

  async getUserInfo() {
    await axios
      .get(`http://localhost:3001/api/users/${this.state.user.id}`, {
        headers: authHeader(),
      })
      .then((response) => {
        this.setState({
          user: {
            ...this.state.user,
            ...response.data,
          },
          newUser: {
            ...this.state.newUser,
            city: response.data.city,
          },
        });
        if (response.status === 200) {
          console.log("User info retrieved");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async getParticipation() {
    await axios
      .get(
        `http://localhost:3001/api/users/${this.state.user.id}/participation`,

        {
          headers: authHeader(),
        }
      )
      .then((response) => {
        this.setState({
          user: {
            ...this.state.user,
            participation: response.data,
          },
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  componentDidMount() {
    const storedUser = authService.getCurrentUser();
    if (storedUser) {
      this.setState(
        {
          ...this.state,
          user: {
            ...this.state.user,
            ...storedUser,
          },
        },
        () => {
          const getInfo = async () => {
            await this.getUserInfo();
            await this.getParticipation();
          };
          getInfo().then(() => {
            console.log(this.state.user);
            this.setState({
              loading: false,
            });
          });
        }
      );
    }
  }

  async resetMusPref() {
    await axios
      .post(
        `http://localhost:3001/api/users/${this.state.user.id}/resetMusPref`,
        { headers: authHeader() }
      )
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        window.location.reload();
      });
  }

  addInstrument(instrument) {
    console.log(instrument);
    this.setState({
      newUser: {
        ...this.state.newUser,
        instruments: [...this.state.newUser.instruments, instrument],
      },
    });
  }
  addGenre(genre) {
    this.setState({
      newUser: {
        ...this.state.newUser,
        genres: [...this.state.newUser.genres, genre],
      },
    });
  }

  getCity() {
    if (this.state.newUser.city !== "") {
      return this.state.newUser.city;
    } else {
      return this.state.user.city;
    }
  }
  setCity(city) {
    this.setState(
      {
        newUser: {
          ...this.state.newUser,
          city: city.label,
        },
      },
      () => {
        console.log(this.state.newUser);
      }
    );
  }

  removeInstrument(index, newUser) {
    if (newUser) {
      this.setState({
        newUser: {
          ...this.state.newUser,
          instruments: this.state.newUser.instruments.filter(
            (_, i) => i !== index
          ),
        },
      });
    } else {
      this.setState(
        {
          user: {
            ...this.state.user,
            instruments: this.state.user.instruments.filter(
              (_, i) => i !== index
            ),
            instrumentsToDelete: [
              ...this.state.user.instrumentsToDelete,
              this.state.user.instruments[index].value,
            ],
          },
        },
        () => {
          console.log(this.state.user);
        }
      );
    }
  }
  removeGenre(index, newUser) {
    if (newUser) {
      this.setState({
        newUser: {
          ...this.state.newUser,
          genres: this.state.newUser.genres.filter((_, i) => i !== index),
        },
      });
    } else {
      this.setState({
        user: {
          ...this.state.user,
          genres: this.state.user.genres.filter((_, i) => i !== index),
          genresToDelete: [
            ...this.state.user.genresToDelete,
            this.state.user.genres[index].value,
          ],
        },
      });
    }
  }
  addMusParticipation(participation) {
    this.setState({
      newUser: {
        ...this.state.newUser,
        participation: [...this.state.newUser.participation, participation],
      },
    });
  }

  deleteMusParticipation(id) {
    this.setState({
      newUser: {
        ...this.state.newUser,
        partToDelete: [...this.state.newUser.partToDelete, id],
      },
    });
  }

  render() {
    return (
      <>
        <Header user={this.state.user} />
        <Container maxWidth={"1366px"}>
          {/* {this.state.user.id === "" ? <Navigate to="/signin" /> : null} */}
          {this.state.loading ? (
            <Loading />
          ) : (
            <VStack w="100%" justifyContent={"flex-start"}>
              <StackItem w="100%">
                <Flex direction={"row"} align={"baseline"}>
                  <Text>This is you</Text>
                  <Heading as="h2" size="md" padding={"5px"}>
                    {this.state.user.username}
                  </Heading>
                  <Spacer />
                  <Button onClick={this.updateUser}>Save</Button>
                </Flex>
              </StackItem>
              <StackDivider />
              <StackItem w="100%" justifyContent={"center"} display={"flex"}>
                <Grid w="75%" templateColumns="repeat(2, 1fr)" gap={6}>
                  <GridItem
                    colSpan={1}
                    border={"2px"}
                    borderRadius={"5px"}
                    padding={"10px"}
                  >
                    <Heading
                      as="h2"
                      size="md"
                      padding={"5px"}
                      textAlign={"center"}
                    >
                      About you
                    </Heading>
                    <Flex direction={"column"}>
                      <Text>Username</Text>
                      <EditField
                        props={this.state.user.username}
                        onChange={(value) => {
                          this.setState({
                            newUser: {
                              ...this.state.newUser,
                              username: value.target.value,
                            },
                          });
                        }}
                      />
                    </Flex>
                    <Flex direction={"column"}>
                      <Text>Name</Text>
                      <EditField
                        props={this.state.user.name}
                        onChange={(value) => {
                          this.setState({
                            newUser: {
                              ...this.state.newUser,
                              name: value.target.value,
                            },
                          });
                        }}
                      />
                    </Flex>
                    <Flex direction={"column"}>
                      <Text>Surname</Text>
                      <EditField
                        props={this.state.user.surname}
                        onChange={(value) => {
                          this.setState({
                            newUser: {
                              ...this.state.newUser,
                              surname: value.target.value,
                            },
                          });
                        }}
                      />
                    </Flex>
                    <Flex direction={"column"}>
                      <Text>City</Text>
                      <EditCityField
                        key={this.state.newUser.city}
                        props={this.state.newUser.city}
                        setCity={this.setCity}
                      />
                    </Flex>
                  </GridItem>
                  <GridItem
                    colSpan={1}
                    border={"2px"}
                    borderRadius={"5px"}
                    padding={"10px"}
                  >
                    <Flex
                      direction={"column"}
                      h="100%"
                      justify={"space-between"}
                    >
                      <div>
                        <Heading
                          as="h2"
                          size="md"
                          padding={"5px"}
                          textAlign={"center"}
                        >
                          Your musical preferences
                        </Heading>
                        <VStack paddingTop="5px">
                          <StackItem w={"75%"}>
                            <HStack
                              w="100%"
                              justifyContent={"space-between"}
                              alignItems={"center"}
                            >
                              <StackItem>
                                <Heading as="h4" size={"md"}>
                                  Genres you play
                                </Heading>
                              </StackItem>
                              <StackItem>
                                <AddGenreModal addGenre={this.addGenre} />
                              </StackItem>
                            </HStack>
                            <Box padding={"2px"}>
                              <HStack>
                                {this.state.user.genres.map((genre, index) => {
                                  return (
                                    <Tag
                                      bg={"#b4656f"}
                                      key={genre.value}
                                      onDoubleClick={() =>
                                        this.removeGenre(index, false)
                                      }
                                    >
                                      {genre.label}
                                    </Tag>
                                  );
                                })}
                                {this.state.newUser.genres.map(
                                  (genre, index) => {
                                    return (
                                      <Tag
                                        bg={"#FBFAF5"}
                                        color={"#ef767a"}
                                        border={"1px"}
                                        borderColor={"#ef767a"}
                                        onDoubleClick={() =>
                                          this.removeGenre(index, true)
                                        }
                                        key={genre.value}
                                      >
                                        {genre.label}
                                      </Tag>
                                    );
                                  }
                                )}
                              </HStack>
                            </Box>
                          </StackItem>
                          <StackDivider />
                          <StackItem w="75%">
                            <HStack
                              w="100%"
                              justifyContent={"space-between"}
                              alignItems={"center"}
                            >
                              <StackItem>
                                <Heading as="h4" size={"md"}>
                                  Instrument you play
                                </Heading>
                              </StackItem>
                              <StackItem>
                                <AddInstrumentModal
                                  addInstrument={this.addInstrument}
                                />
                              </StackItem>
                            </HStack>
                            <Box padding={"2px"}>
                              <HStack>
                                {this.state.user.instruments.map(
                                  (instr, index) => {
                                    return (
                                      <Tag
                                        bg={"#b4656f"}
                                        onDoubleClick={() =>
                                          this.removeInstrument(index, false)
                                        }
                                        key={instr.value}
                                      >
                                        {instr.label}
                                      </Tag>
                                    );
                                  }
                                )}
                                {this.state.newUser.instruments.map(
                                  (instr, index) => {
                                    return (
                                      <Tag
                                        bg={"#FBFAF5"}
                                        color={"#ef767a"}
                                        border={"1px"}
                                        borderColor={"#ef767a"}
                                        onDoubleClick={() =>
                                          this.removeInstrument(index, true)
                                        }
                                        key={instr.value}
                                      >
                                        {instr.label}
                                      </Tag>
                                    );
                                  }
                                )}
                              </HStack>
                            </Box>
                          </StackItem>
                          <StackDivider />
                        </VStack>
                      </div>
                      <Button onClick={this.resetMusPref}>
                        Reset preferences
                      </Button>
                    </Flex>
                  </GridItem>
                  <GridItem
                    colSpan={2}
                    border={"2px"}
                    borderRadius={"5px"}
                    padding={"10px"}
                  >
                    <VStack>
                      <HStack>
                        <Heading
                          as="h2"
                          size="md"
                          padding={"5px"}
                          textAlign={"center"}
                        >
                          Your participation
                        </Heading>
                        <AddMusParticipationModal
                          addMusParticipation={this.addMusParticipation}
                        />
                      </HStack>
                      <HStack>
                        {this.state.user.participation
                          .concat(this.state.newUser.participation)
                          .map((part, index) => {
                            console.log(part);
                            return (
                              <StackItem>
                                <MusParticipationCard
                                  key={index}
                                  id={index}
                                  part={part.part}
                                  date={part.date}
                                  time={part.time}
                                  address={part.address}
                                  event={part.event_name}
                                  event_id={part.event}
                                  song={part.song}
                                  instruments={part.instruments}
                                  felt_mood={part.felt_mood}
                                  deleteMusParticipation={
                                    this.deleteMusParticipation
                                  }
                                />
                              </StackItem>
                            );
                          })}
                        {/* {this.state.newUser.participation.map((part, index) => {
                        return (
                          <MusParticipationCard
                            key={index}
                            id={index}
                            date={part.date}
                            time={part.time}
                            address={part.address}
                            event={part.event_name}
                            song={part.song}
                            instruments={part.instruments}
                            felt_mood={part.felt_mood}
                            deleteMusParticipation={this.deleteMusParticipation}
                          />
                        );
                      })} */}
                      </HStack>
                    </VStack>
                  </GridItem>
                </Grid>
              </StackItem>
            </VStack>
          )}
        </Container>
      </>
    );
  }
}
