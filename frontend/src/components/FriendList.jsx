import React, { Component } from "react";
import { Container, Heading, Stack, StackDivider } from "@chakra-ui/react";
import axios from "axios";
import authHeader from "../services/auth-headers";
export default class FriendList extends Component {
  constructor(props) {
    super(props);
    this.getPendingRequests = this.getPendingRequests.bind(this);
    this.state = {
      friends: [],
      pendingRequests: [],
    };
  }

  async getPendingRequests() {
    await axios
      .get(
        `http://localhost:3001/api/users/${this.props.user}/friendsRequestSent`,
        {
          headers: authHeader(),
        }
      )
      .then((response) => {
        this.setState({
          pendingRequests: response.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  componentDidMount() {
    this.getPendingRequests();
  }

  render() {
    return (
      <Container border={"1px"} w={"-moz-fit-content"}>
        <Container pt={"5px"} w={"-moz-fit-content"}>
          <Heading as="h3" size="sm" w={"fit-content"} whiteSpace={"nowrap"}>
            Your friends list:
          </Heading>
        </Container>
        <Stack direction={"column"} spacing={4} h={"100%"}>
          <StackDivider />
          {this.props.children}
        </Stack>
        {this.state.pendingRequests.length > 0 ? (
          <Container pt={"5px"} w={"-moz-fit-content"}>
            <Heading as="h3" size="sm" w={"fit-content"} whiteSpace={"nowrap"}>
              Pending requests:
            </Heading>
            {this.state.pendingRequests.map((request) => {
              return (
                <Container key={request.id} w={"-moz-fit-content"}>
                  {request.username}
                </Container>
              );
            })}
          </Container>
        ) : null}
      </Container>
    );
  }
}
