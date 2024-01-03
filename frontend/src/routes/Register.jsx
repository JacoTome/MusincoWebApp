import React, { Component } from "react";
import authService from "../services/auth.service";
import {
  FormControl,
  FormLabel,
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  Heading,
  HStack,
  Input,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { PasswordField } from "../components/PasswordField";
import { Navigate, redirect } from "react-router-dom";

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
    };
  }

  signup = async (e) => {
    e.preventDefault();
    const signupData = {
      email: this.state.email,
      password: this.state.password,
      username: this.state.username,
    };

    console.table(signupData);
    await authService
      .register(signupData.username, signupData.email, signupData.password)
      .then((response) => {
        console.log(response.data.message);
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          error: true,
          errorMessage: error.message,
        });
      })
      .finally(() => {
        // redirect if there is no error
        if (!this.state.error) {
          redirect("/login");
        }
      });
  };

  render() {
    return (
      <Container
        maxW="lg"
        py={{ base: "12", md: "24" }}
        px={{ base: "0", sm: "8" }}
      >
        <Stack spacing="8">
          <Text
            textStyle="sm"
            textAlign="center"
            color="fg.muted"
            maxW="md"
            mx="auto"
          >
            {this.state.error ? this.state.errorMessage : ""}
          </Text>
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
          </Box>
        </Stack>
      </Container>
    );
  }
}
