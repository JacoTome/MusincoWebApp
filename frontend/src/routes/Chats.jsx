import React from "react";
import Chat from "../components/Chat";
import {
  Grid,
  GridItem,
  Spinner,
  Container,
  StackItem,
} from "@chakra-ui/react";
import FriendList from "../components/FriendList";
import Header from "../components/Header";
import axios from "axios";
import socket from "..";
import authHeader from "../services/auth-headers";
import authService from "../services/auth.service";
export default class Chats extends React.Component {
  constructor(props) {
    super(props);
    this.changeChat = this.changeChat.bind(this);
    this.state = {
      loading: true,
      user: authService.getCurrentUser(),
      friends: [],
      activeChat: "",
    };
  }

  componentDidMount() {
    axios
      .get(`http://localhost:3001/api/users/${this.state.user.id}/friends`, {
        headers: authHeader(),
      })
      .then((res) => {
        if (res.status === 200) {
          this.setState({
            ...this.state,
            loading: false,
            friends: [...this.state.friends, ...res.data.ids],
            activeChat: res.data.ids[0],
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  componentWillUnmount() {
    socket.disconnect();
  }

  changeChat(friend) {
    this.setState({
      ...this.state,
      activeChat: friend,
    });
  }

  render() {
    return (
      <>
        <Header user={this.state.user} />
        {this.state.loading ? (
          <Spinner />
        ) : (
          <Container>
            <Grid
              templateColumns="repeat(3, 1fr)"
              templateRows="repeat(2, 1fr)"
              gap={6}
            >
              <GridItem rowSpan={2}>
                <FriendList>
                  {this.state.friends.map((friend, index) => (
                    <StackItem
                      key={index}
                      onClick={() => {
                        this.changeChat(friend);
                      }}
                    >
                      {friend}
                    </StackItem>
                  ))}
                </FriendList>
              </GridItem>
              <GridItem colSpan={2}>
                <Chat key={this.state.activeChat} id={this.state.activeChat} />
              </GridItem>
            </Grid>
          </Container>
        )}
      </>
    );
  }
}
