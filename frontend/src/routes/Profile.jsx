import axios from "axios";
import React, { Component } from "react";
import Header from "../components/Header";
import {
  Container,
  StackDivider,
  Stack,
  Text,
  Flex,
  Spacer,
  Button,
  Heading,
  Grid,
  GridItem,
  StackItem,
} from "@chakra-ui/react";
import Loading from "../components/Loading";
import EditField from "../components/EditField";
import authHeader from "../services/auth-headers";

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.updateUser = this.updateUser.bind(this);
    this.state = {
      loading: true,
      user: {
        ...JSON.parse(localStorage.getItem("user")),
        surname: "",
        instruments: ['Chitarra'],
        genres: ['Rock'],
        name: "",
      },
      newUser: {
      }
    };
  }

  async updateUser() {


    let updatedData = {
      id: this.state.user.id,
    }
    for (const [key, value] of Object.entries(this.state.newUser)) {
      if (value !== this.state.user[key] && value !== "" && value !== null) {
        updatedData[key] = value
      }
    }
    await axios
      .post(`http://localhost:3001/api/users/${this.state.user.id}`, {
        ...updatedData
      }, { headers: authHeader() }).catch((error) => {
        console.log(error);
      }).finally(() => {
        window.location.reload();
      });
  }

  componentDidMount() {
    axios
      .get(`http://localhost:3001/api/users/${this.state.user.id}`,
        { headers: authHeader() })
      .then((response) => {
        this.setState(
          {
            user: {
              ...this.state.user,
              ...response.data,
            }
          }
        );
      }).catch((error) => {
        console.log(error);
      }).finally(() => {
        this.setState({ loading: false });
      });
  }


  render() {
    return (
      <>
        <Header user={this.state.user} />
        <Container maxWidth={"1366px"}>
          {this.state.loading ? <Loading /> : (
            <Stack>
              <Container>
                <Flex direction={"row"} align={"baseline"}>
                  <Text>This is you</Text>
                  <Heading as="h2" size="md" padding={"5px"}>
                    {this.state.user.username}
                  </Heading>
                  <Spacer />
                  <Button onClick={this.updateUser}>Save</Button>
                </Flex>
              </Container>
              <StackDivider />
              <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                <GridItem colSpan={1} border={'2px'} borderRadius={'5px'} padding={'10px'}>
                  <Heading as="h2" size="md" padding={"5px"} textAlign={'center'}>
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
                    <Text>Email</Text>
                    <EditField
                      props={this.state.user.email}
                      onChange={(value) => {
                        this.setState({
                          newUser: {
                            ...this.state.newUser,
                            email: value.target.value,
                          },
                        });
                      }}
                    />
                  </Flex>
                </GridItem>
                <GridItem colSpan={1} border={'2px'} borderRadius={'5px'} padding={'10px'}>
                  <Flex direction={"column"}>
                    <Heading as="h2" size="md" padding={"5px"} textAlign={'center'}>
                      Your musical preferences
                    </Heading>
                    <Stack>
                      <StackItem>
                        <Text>Genres you like</Text>
                        {
                          this.state.user.genres.map((genre, index) => {
                            return (
                              <p key={index}>{genre}</p>
                            );
                          }
                          )
                        }
                      </StackItem>
                      <StackDivider />
                      <StackItem>
                        <Text>Instrument you play</Text>
                        {
                          this.state.user.instruments.map((genre, index) => {
                            return (
                              <p key={index}>{genre}</p>
                            );
                          }
                          )
                        }
                      </StackItem>
                    </Stack>
                  </Flex>
                </GridItem>
                <GridItem colSpan={1} border={'2px'} borderRadius={'5px'} padding={'10px'}>
                  <Heading as="h2" size="md" padding={"5px"} textAlign={'center'}>
                    Your participation
                  </Heading>
                  <Stack>
                    <StackItem>
                      <Text>Events you are attending</Text>
                    </StackItem>
                  </Stack>
                </GridItem>
              </Grid>
            </Stack>)}
        </Container >
      </>
    );
  }
}



//       <Flex direction={"column"}>
//         <Text>Instrument</Text>
//         <EditField
//           props={this.state.user.instrument}
//           onChange={(value) => {
//             this.setState({
//               user: {
//                 ...this.state.user,
//                 instrument: value.target.value,
//               },
//             });
//           }}
//         />
//       </Flex>
//       <Divider />
//       <Flex direction={"column"}>
//         <Text>Genre</Text>
//         <EditField
//           props={this.state.user.genre}
//           onChange={(value) => {
//             this.setState({
//               user: {
//                 ...this.state.user,
//                 genre: value.target.value,
//               },
//             });
//           }}
//         />
//       </Flex>
//     </Stack >)
// }
