import React, { Component } from "react";
import Header from "../components/Header";
import axios from "axios";
import {
  Container,
  Flex,
  Divider,
  Heading,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import {
  Carousel,
  LeftButton,
  Provider,
  RightButton,
} from "chakra-ui-carousel";
import authService from "../services/auth.service";
import { Navigate } from "react-router-dom";
import authHeader from "../services/auth-headers";
import CardUser from "../components/CardUser";
import socket from "..";
import { on } from "events";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.getUserInfo = this.getUserInfo.bind(this);
    this.getMoodGenre = this.getMoodGenre.bind(this);
    this.getSuggestedUsers = this.getSuggestedUsers.bind(this);
    this.content = this.content.bind(this);
    this.state = {
      currentUser: authService.getCurrentUser(),
      suggestedUsers: [],
      genres: [],
      mood: "",
      loading: true,
      usersOnline: [],
    };
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

  async getMoodGenre() {
    const hour = Intl.DateTimeFormat("it-IT", {
      hour: "2-digit",
    })
      .format(Date.now())
      .split(" ")[0];
    const response = await axios.get(
      `http://localhost:3001/api/hourMoodGenre/${hour}`,
      { headers: authHeader() }
    );
    if (response.data.mood === "") {
      this.setState({ mood: "Happy" });
    } else {
      const mood = response.data.mood.split("/");
      this.setState({ mood: mood[mood.length - 1] });
    }
    if (response.data.genre.length === 1) {
      this.setState({ genres: ["Rock"] });
      return;
    } else {
      var genreToAdd = [];
      response.data.genre.forEach((genre) => {
        genre = genre.split("/");
        genre = genre[genre.length - 1];
        genreToAdd.push(genre.genre);
      });
      this.setState({ genres: genreToAdd });
    }
  }

  getSuggestedUsers() {
    const suggestedUsers = [];
    axios
      .get(
        `http://localhost:3001/api/suggestedUsers/${this.state.currentUser.id}`,
        { headers: authHeader() }
      )
      .then((response) => {
        for (const [_, value] of Object.entries(response.data)) {
          axios
            .get(`http://localhost:3001/api/users/${value.others}`, {
              headers: authHeader(),
            })
            .then((user) => {
              suggestedUsers.push(
                <CardUser
                  key={value.others}
                  id={value.others}
                  username={user.data.username}
                  name={user.data.name}
                  instruments={["Chitarra"]}
                  genre={"Rock"}
                />
              );
              this.setState({
                suggestedUsers: suggestedUsers,
              });
            });
        }
      });
  }
  componentDidMount() {
    if (this.state.currentUser !== null) {
      const getAll = async () => {
        await this.getUserInfo(this.state.currentUser.id);
        await this.getSuggestedUsers();
        await this.getMoodGenre();
      };
      getAll().then(() => {
        this.setState({ loading: false });
      });
    }
    const sessionID = localStorage.getItem("sessionID");
    if (sessionID) {
      socket.auth = { id: this.state.currentUser.id, sessionID: sessionID };
      socket.connect();
    } else {
      socket.auth = { id: this.state.currentUser.id };
      socket.connect();
    }

    socket.on("connect_error", (err) => {
      console.log(err);
    });
    socket.on("users", (users) => {
      users.forEach((user) => {
        user.self = user.socketID === socket.id;
      });
      users.sort((a, b) => {
        if (a.self) return -1;
        if (b.self) return 1;
        if (a.username < b.username) return -1;
        return a.username > b.username ? 1 : 0;
      });
      let onlineUsers = users.filter((user) => !user.self);
      this.setState({ usersOnline: onlineUsers });
    });
    socket.on("user connected", (user) => {
      this.setState((state) => ({
        usersOnline: [...state.usersOnline, user],
      }));
    });
  }

  content() {
    return (
      <>
        {this.state.currentUser === null ? <Navigate to="/signin" /> : null}
        <Header user={this.state.currentUser} />
        <Divider />
        <Container maxW="container.xl">
          {this.state.loading ? (
            <Spinner size={"xl"} />
          ) : (
            <>
              <Heading as="h2" size="lg" padding="4">
                Suggested users
              </Heading>
              <Provider>
                <Carousel gap={5}>{this.state.suggestedUsers}</Carousel>
                <Flex justifyContent="space-between" padding="4">
                  <LeftButton />
                  <RightButton />
                </Flex>
              </Provider>
              <Heading as="h2" size="lg" padding="4">
                Users online
              </Heading>
              <Provider>
                <Carousel gap={5}>
                  {this.state.usersOnline.map((user) => {
                    return (
                      <CardUser
                        key={user.socketID}
                        id={user.socketID}
                        username={user.username}
                        name={user.name}
                        instruments={["Chitarra"]}
                        genre={"Rock"}
                      />
                    );
                  })}
                </Carousel>
                <Flex justifyContent="space-between" padding="4">
                  <LeftButton />
                  <RightButton />
                </Flex>
              </Provider>
              <Heading as="h2" size="lg" padding="4">
                Hey, it's{" "}
                {Intl.DateTimeFormat("en-US", {
                  weekday: "long",
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(Date.now())}{" "}
                are you feeling {this.state.mood}? Let's play some{" "}
                {this.state.genres[0]}!
              </Heading>
              <Heading as="h3" size="lg" padding="4">
                Or maybe you prefer...
              </Heading>
              <Stack direction={"row"} spacing={"3"}>
                {this.state.genres.splice(1).map((i, genre) => {
                  console.log(genre);
                  return <p key={genre + i}>{}</p>;
                })}
              </Stack>
            </>
          )}
        </Container>
      </>
    );
  }

  render() {
    return (
      <>
        {this.state.currentUser === null ? (
          <Navigate to="/signin" />
        ) : (
          this.content()
        )}
      </>
    );
  }
}
