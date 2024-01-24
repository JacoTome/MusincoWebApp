import { Container, Divider, Heading } from "@chakra-ui/react";
import React, { Component } from "react";
import Messages from "./Messages";
import socket from "..";

export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      userID: this.props.id,
    };
  }
  componentDidMount() {
    socket.connect();
  }

  render() {
    return (
      <Container w={"max-content"} border={"1px"}>
        <Heading>Chat with {this.state.userID}</Heading>
        <Divider />
        <Messages id={this.state.userID} />
      </Container>
    );
  }
}
