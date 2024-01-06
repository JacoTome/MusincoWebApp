import axios from "axios";
import React, { Component } from "react";
import Header from "../components/Header";
import {
  Container,
  StackDivider,
  Stack,
  Editable,
  Text,
  EditablePreview,
  EditableInput,
  useEditableControls,
  ButtonGroup,
  Flex,
  IconButton,
  Input,
  Divider,
  Spacer,
  Button,
  Heading,
} from "@chakra-ui/react";
import { EditIcon, CheckIcon, CloseIcon } from "@chakra-ui/icons";

function CustomControlsExample(props) {
  /* Here's a custom control */
  function EditableControls() {
    const {
      isEditing,
      getSubmitButtonProps,
      getCancelButtonProps,
      getEditButtonProps,
    } = useEditableControls();

    return isEditing ? (
      <ButtonGroup justifyContent="center" size="sm">
        <IconButton icon={<CheckIcon />} {...getSubmitButtonProps()} />
        <IconButton icon={<CloseIcon />} {...getCancelButtonProps()} />
      </ButtonGroup>
    ) : (
      <Flex justifyContent="center">
        <IconButton size="sm" icon={<EditIcon />} {...getEditButtonProps()} />
      </Flex>
    );
  }

  console.log(props.props);
  return (

    < Editable
      textAlign="center"
      defaultValue={props.props}
      fontSize="2xl"
      isPreviewFocusable={false}
    >
      <Flex direction={"row"} align={"center"}>
        <EditablePreview />
        <Input as={EditableInput} onChange={props.onChange} />
        <Spacer />
        <EditableControls />
      </Flex>
    </Editable >
  );
}

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.updateUser = this.updateUser.bind(this);
    this.state = {
      loading: true,
      user: {
        ...JSON.parse(localStorage.getItem("user")),
        surname: "",
        instrument: "",
        genre: "",
        name: "",
      },
    };
  }

  async updateUser() {
    await axios
      .post(`http://localhost:3001/api/users/${this.state.user.id}`, {
        id: this.state.user.id,
        firstName: this.state.user.name,
        surname: this.state.user.surname,
        username: this.state.user.username,
        email: this.state.user.email,
        instrument: this.state.user.instrument,
        genre: this.state.user.genre,
      })
      .then((response) => {
        console.log(response);
      }).catch((error) => {
        console.log(error);
      });
  }

  componentDidMount() {
    axios
      .get(`http://localhost:3001/api/users/${this.state.user.id}`)
      .then((response) => {
        this.setState(
          {
            user: {
              ...this.state.user,
              name: response.data.name,
              surname: response.data.surname,
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
          {this.state.loading ? <div>Loading...</div> : (
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
              <Container w={"100%"}>
                <Flex direction={"column"}>
                  <Text>Username</Text>
                  <CustomControlsExample
                    props={this.state.user.username}
                    onChange={(value) => {
                      this.setState({
                        user: {
                          ...this.state.user,
                          username: value.target.value,
                        },
                      });
                    }}
                  />
                </Flex>
                <Divider />
                <Flex direction={"column"}>
                  <Text>Name</Text>
                  <CustomControlsExample
                    props={this.state.user.name}
                    onChange={(value) => {
                      this.setState((prevState) => ({
                        user: {
                          ...prevState.user,
                          name: value.target.value,
                        },
                      }));
                    }}
                  />
                </Flex>
                <Divider />
                <Flex direction={"column"}>
                  <Text>Surname</Text>
                  <CustomControlsExample
                    props={this.state.user.surname}
                    onChange={(value) => {
                      this.setState({
                        user: {
                          ...this.state.user,
                          surname: value.target.value,
                        },
                      });
                    }}
                  />
                </Flex>
                <Divider />
                <Flex direction={"column"}>
                  <Text>Email</Text>
                  <CustomControlsExample
                    props={this.state.user.email}
                    onChange={(value) => {
                      this.setState({
                        user: {
                          ...this.state.user,
                          email: value.target.value,
                        },
                      });
                    }}
                  />
                </Flex>
                <Divider />
                <Flex direction={"column"}>
                  <Text>Instrument</Text>
                  <CustomControlsExample
                    props={this.state.user.instrument}
                    onChange={(value) => {
                      this.setState({
                        user: {
                          ...this.state.user,
                          instrument: value.target.value,
                        },
                      });
                    }}
                  />
                </Flex>
                <Divider />
                <Flex direction={"column"}>
                  <Text>Genre</Text>
                  <CustomControlsExample
                    props={this.state.user.genre}
                    onChange={(value) => {
                      this.setState({
                        user: {
                          ...this.state.user,
                          genre: value.target.value,
                        },
                      });
                    }}
                  />
                </Flex>
              </Container>
            </Stack>)}
        </Container>
      </>
    );
  }
}
