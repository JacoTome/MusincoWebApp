import React, { Component } from "react";
import { Container, Heading, Stack, StackDivider } from "@chakra-ui/react";

export default class FriendList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      friends: [],
    };
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
      </Container>
    );
  }
}
