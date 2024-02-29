import React, { Component } from "react";
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
import authService from "../services/auth.service";
import { withRouter } from "../common/with-router";
class Login extends Component {
  constructor(props) {
    super(props);
    this.signin = this.signin.bind(this);
    this.state = {
      email: "",
      password: "",
      username: "",
      error: false,
      errorMessage: "",
      logged: false,
    };
  }

  signin = async (e) => {
    e.preventDefault();
    const loginData = {
      password: this.state.password,
      username: this.state.username,
    };

    await authService
      .login(loginData.username, loginData.password)
      .then((res) => {
        if (res.status === 200) {
          this.setState({
            logged: true,
          });
        }
        this.props.router.navigate("/home");
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          error: true,
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
        <Stack spacing="8">
          <Stack spacing="6">
            <Stack spacing={{ base: "2", md: "3" }} textAlign="center">
              <Heading size={{ base: "xs", md: "sm" }}>
                Log in to your account
              </Heading>
              <Text color="fg.muted">
                Don't have an account? <Link href="/signup">Sign up</Link>
              </Text>
            </Stack>
          </Stack>
          <Divider />
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
            <form onSubmit={this.signin}>
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

                  <PasswordField
                    onChange={(event) => {
                      this.setState({ password: event.target.value });
                    }}
                  />
                </Stack>
                <HStack justify="space-between">
                  <Checkbox defaultChecked>Remember me</Checkbox>
                  <Button size="sm">Forgot password?</Button>
                </HStack>
                <Stack spacing="6">
                  <Button type="submit">Sign in</Button>
                  <HStack>
                    <Divider />
                    <Divider />
                  </HStack>
                </Stack>
              </Stack>
            </form>
          </Box>
        </Stack>
      </Container>
    );
  }
}

export default withRouter(Login);
