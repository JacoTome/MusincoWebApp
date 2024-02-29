import React, { Component } from "react";
import Header from "../components/Header";
import axios from "axios";
import {
  Container,
  Flex,
  Divider,
  StackItem,
  Heading,
  Button,
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
import SearchUserBar from "../components/SearchUserBar";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.getUserInfo = this.getUserInfo.bind(this);
    this.getMoodGenre = this.getMoodGenre.bind(this);
    this.getSuggestedUsers = this.getSuggestedUsers.bind(this);
    this.content = this.content.bind(this);
    this.setResults = this.setResults.bind(this);
    this.state = {
      currentUser: authService.getCurrentUser(),
      suggestedUsers: [],
      genres: [],
      mood: "",
      loading: true,
      usersOnline: [],
      result: [],
      showSearch: false,
    };
  }

  setResults = (res) => {
    let results = [];
    for (let userRes of res) {
      axios
        .get(`http://localhost:3001/api/users/${userRes.user}`, {
          headers: authHeader(),
        })
        .then((user) => {
          console.log(user);
          results.push(
            <CardUser
              key={user.data}
              id={userRes.user}
              username={user.data.username}
              name={user.data.name}
              instruments={user.data.instruments}
              genre={user.data.genres}
            />
          );
        })
        .catch((err) => {
          console.log(err.message);
        })
        .finally(() => {
          this.setState({ result: results, showSearch: true });
        });
    }
  };

  async getUserInfo(id) {
    await axios
      .get(`http://localhost:3001/api/users/${id}`, { headers: authHeader() })
      .then((response) => {
        this.setState({
          ...this.state,
          currentUser: { ...this.state.currentUser, ...response.data },
        });
      })
      .finally(() => {
        console.log("User Done");
      });
  }

  async getMoodGenre() {
    var hour = Intl.DateTimeFormat("it-IT", {
      hour: "2-digit",
    })
      .format(Date.now())
      .split(" ")[0];
    // if hour like 01, hour = 1
    if (hour[0] === "0") {
      hour = hour[1];
    }

    await axios
      .get(`http://localhost:3001/api/hourMoodGenre/${hour}`, {
        headers: authHeader(),
      })
      .then((response) => {
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
          this.setState({ genres: response.data.genre });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async getSuggestedUsers() {
    const suggestedUsers = [];
    await axios
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
              console.log(user, value);
              suggestedUsers.push(
                <CardUser
                  key={value.others}
                  id={value.others}
                  username={user.data.username}
                  name={user.data.name}
                  instruments={user.data.instruments}
                  genre={"Rock"}
                />
              );
              this.setState({
                suggestedUsers: suggestedUsers,
              });
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .finally(() => {
        console.log("Suggested users Done");
      });
  }
  componentDidMount() {
    if (this.state.currentUser !== null) {
      const getAll = async () => {
        await this.getUserInfo(this.state.currentUser.id);
        await this.getSuggestedUsers();
        await this.getMoodGenre();
      };
      getAll()
        .then(() => {
          this.setState({ loading: false });
          const sessionID = localStorage.getItem("sessionID");
          if (sessionID) {
            socket.auth = {
              id: this.state.currentUser.id,
              sessionID: sessionID,
              username: this.state.currentUser.username,
            };
            socket.connect();
          } else {
            socket.auth = {
              id: this.state.currentUser.id,
              username: this.state.currentUser.username,
            };
            socket.connect();
          }
        })
        .catch((err) => {
          console.log(err);
        });
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
      // Check if the user is already in the list
      onlineUsers = onlineUsers.filter(
        (user) =>
          !this.state.usersOnline.some((u) => u.socketID === user.socketID)
      );

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
        <Divider borderColor="#B4656F" />
        <Container maxW="container.xl">
          {this.state.loading ? (
            <Spinner size={"xl"} />
          ) : (
            <>
              <SearchUserBar setResults={this.setResults} />

              {this.state.showSearch ? (
                <Button
                  onClick={() => {
                    this.setState({ showSearch: false });
                  }}
                >
                  Close
                </Button>
              ) : this.state.result.length > 0 ? (
                <Button
                  onClick={() => {
                    this.setState({ showSearch: true });
                  }}
                >
                  Show Result
                </Button>
              ) : null}

              {this.state.showSearch ? (
                <>
                  <Heading as="h2" size="lg" padding="4">
                    Results for your search
                  </Heading>
                  <Provider>
                    <Carousel gap={5}>{this.state.result}</Carousel>
                    <Flex justifyContent="space-between" padding="4">
                      <LeftButton />
                      <RightButton />
                    </Flex>
                  </Provider>
                </>
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
                </>
              )}
              <Heading as="h2" size="lg" padding="4">
                Users online
              </Heading>
              <Provider>
                <Carousel gap={5}>
                  {this.state.usersOnline.map((user) => {
                    console.log(user);
                    return (
                      <CardUser
                        key={user.id}
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
              {this.state.genres.length > 1 ? (
                <>
                  <Heading as="h3" size="lg" padding="4">
                    Or maybe you prefer...
                  </Heading>
                  <Stack direction={"row"} spacing={"3"} wrap={"wrap"}>
                    {this.state.genres.splice(1, 10).map((i, genre) => {
                      return <StackItem key={genre + i}>{i}</StackItem>;
                    })}
                  </Stack>
                </>
              ) : null}
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
