import React, { Component } from "react";
import Header from "../components/Header";
import authService from "../services/auth.service";
import authHeader from "../services/auth-headers";
import axios from "axios";
import {
  Button,
  Container,
  Divider,
  HStack,
  Heading,
  Flex,
  StackItem,
  Text,
  Grid,
  VStack,
  GridItem,
  StackDivider,
  Stack,
  Checkbox,
} from "@chakra-ui/react";
import EditField from "../components/EditField";
export default class Setting extends Component {
  constructor(props) {
    super(props);
    const currentUser = authService.getCurrentUser();
    this.getUserInfo = this.getUserInfo.bind(this);
    this.getUserSettings = this.getUserSettings.bind(this);
    this.saveSettings = this.saveSettings.bind(this);
    this.state = {
      currentUser: currentUser,
      username: currentUser.username,
      email: currentUser.email,
      language: "",
      timezone: "",
      notification_enabled: false,
      email_notifications: false,

      loading: true,
      successful: false,
      message: "",
      newUser: {
        username: "",
        email: "",
        password: "",
        language: "",
        timezone: "",
        notification_enabled: false,
        email_notifications: false,
      },
    };
  }

  async getUserSettings() {
    await axios
      .get(
        `http://localhost:3001/api/users/${this.state.currentUser.id}/settings`,
        {
          headers: authHeader(),
        }
      )
      .then((response) => {
        console.log(response.data);
        this.setState({
          ...this.state,
          currentUser: { ...this.state.currentUser, ...response.data },
        });
      });
  }

  async getUserInfo(id) {
    await axios
      .get(`http://localhost:3001/api/users/${id}`, { headers: authHeader() })
      .then((response) => {
        this.setState({
          ...this.state,
          currentUser: { ...this.state.currentUser, ...response.data },
        });
      });
  }

  async saveSettings() {
    console.log(this.state.newUser);
    await axios
      .post(
        `http://localhost:3001/api/users/${this.state.currentUser.id}/settings`,
        this.state.newUser,
        { headers: authHeader() }
      )
      .then((response) => {
        console.log(response.data);
      });
  }

  componentDidMount() {
    const getAll = async () => {
      await this.getUserInfo(this.state.currentUser.id);
      await this.getUserSettings();
    };
    getAll().then(() => {
      this.setState({ loading: false });
    });
  }

  render() {
    return (
      <>
        {this.state.loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <Header user={this.state.currentUser} />
            <Divider />
            <Container maxW="container.xl" padding="4">
              <VStack spacing={8}>
                <Flex w="100%" justifyContent={"center"}>
                  <HStack w={"75%"} justifyContent={"space-between"}>
                    <StackItem>
                      <Heading>Settings</Heading>
                    </StackItem>
                    <StackItem>
                      <Button onClick={this.saveSettings}>Save settings</Button>
                    </StackItem>
                  </HStack>
                </Flex>
                <Grid
                  w="75%"
                  templateColumns="repeat(1, 1fr)"
                  gap={6}
                  key={this.state.newUser}
                >
                  <GridItem
                    colSpan={1}
                    border={"2px"}
                    borderRadius={"5px"}
                    padding={"10px"}
                  >
                    <VStack padding={"5px"}>
                      <StackItem w="50%">
                        <Flex direction={"column"}>
                          <Text>Email</Text>
                          <EditField
                            props={this.state.currentUser.email}
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
                      </StackItem>
                      <StackItem w="50%">
                        <Flex direction={"column"}>
                          <Text>Languages</Text>
                          <EditField
                            props={this.state.currentUser.language}
                            onChange={(value) => {
                              this.setState({
                                newUser: {
                                  ...this.state.newUser,
                                  language: value.target.value,
                                },
                              });
                            }}
                          />
                        </Flex>
                      </StackItem>
                      <StackItem w="50%">
                        <Flex direction={"column"}>
                          <Text>Timezone</Text>
                          <EditField
                            props={this.state.currentUser.timezone}
                            onChange={(value) => {
                              this.setState({
                                newUser: {
                                  ...this.state.newUser,
                                  timezone: value.target.value,
                                },
                              });
                            }}
                          />
                        </Flex>
                      </StackItem>
                      <StackItem w="50%">
                        <Checkbox
                          value={this.state.newUser.notification_enabled}
                          onChange={(value) => {
                            this.setState({
                              newUser: {
                                ...this.state.newUser,
                                notification_enabled: value.target.checked,
                              },
                            });
                          }}
                        >
                          Enable Notifications
                        </Checkbox>
                        <Checkbox
                          value={this.state.newUser.email_notifications}
                          onChange={(value) => {
                            this.setState({
                              newUser: {
                                ...this.state.newUser,
                                email_notifications: value.target.checked,
                              },
                            });
                          }}
                        >
                          Email Notifications
                        </Checkbox>
                      </StackItem>

                      <StackItem>
                        <Button>Change Password</Button>
                      </StackItem>
                    </VStack>
                  </GridItem>
                </Grid>
              </VStack>
            </Container>
          </>
        )}
      </>
    );
  }
}
