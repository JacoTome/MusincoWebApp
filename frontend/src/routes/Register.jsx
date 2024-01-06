import React, { Component } from "react";
import authService from "../services/auth.service";
import {
  FormControl,
  FormLabel,
  Box,
  Button,
  Container,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { PasswordField } from "../components/PasswordField";
import { Navigate } from "react-router-dom";

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.signup = this.signup.bind(this);
    this.state = {
      email: "",
      password: "",
      username: "",
      error: false,
      errorMessage: "",
      created: false,
    };
  }

  signup = async (e) => {
    e.preventDefault();
    const signupData = {
      email: this.state.email,
      password: this.state.password,
      username: this.state.username,
    };

    await authService
      .register(signupData.username, signupData.email, signupData.password)
      .then((response) => {
        if (response.status === 200) {
          console.log("Successfully registered");
          this.setState({
            created: true,
          });
        } else {
          console.log("Failed to register");
        }
      })
      .catch((error) => {
        this.setState({
          error: true,
          errorMessage: error.response.data.message,
        });
      });
  };

  render() {
    return (
      <Container
        maxW="lg"
        py={{ base: "12", md: "24" }}
        px={{ base: "0", sm: "8" }}
      >
        <Stack>
          <Text textStyle="h2" textAlign="center">
            Register
          </Text>
          <Text
            textStyle="sm"
            textAlign="center"
            color="fg.muted"
            maxW="md"
            mx="auto"
          >
            {this.state.error ? (
              <> {this.state.errorMessage}</>
            ) : (
              <>Create an account to start using the app</>
            )}
          </Text>
        </Stack>
        <Stack spacing="8">
          <Box
            py={{ base: "0", sm: "8" }}
            px={{ base: "4", sm: "10" }}
            bg={{ base: "transparent", sm: "bg.surface" }}
            boxShadow={{ base: "none", sm: "md" }}
            borderRadius={{ base: "none", sm: "xl" }}
          >
            <form onSubmit={this.signup}>
              <Stack spacing="6">
                <Stack spacing="5">
                  <FormControl>
                    <FormLabel htmlFor="username">Username</FormLabel>
                    <Input
                      id="username"
                      type="username"
                      onChange={(event) => {
                        this.setState({ username: event.target.value });
                      }}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Input
                      id="email"
                      type="email"
                      onChange={(event) => {
                        this.setState({ email: event.target.value });
                      }}
                    />
                  </FormControl>
                  <PasswordField
                    onChange={(event) => {
                      this.setState({ password: event.target.value });
                    }}
                  />
                </Stack>
                <Stack spacing="6">
                  <Button type="submit">Register</Button>
                  {/* <HStack>
                    <Divider />
                    <Text textStyle="sm" whiteSpace="nowrap" color="fg.muted">
                      or continue with
                    </Text>
                    <Divider />
                  </HStack> */}
                  {}
                </Stack>
              </Stack>
            </form>
            {this.state.created ? <Navigate to="/signin" /> : <></>}
          </Box>
        </Stack>
      </Container>
    );
  }
}
