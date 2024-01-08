import React, { Component } from "react";
import CardUser from "../components/CardUser";
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

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.getUserInfo = this.getUserInfo.bind(this);
    this.getMoodGenre = this.getMoodGenre.bind(this);
    this.getSuggestedUsers = this.getSuggestedUsers.bind(this);
    this.content = this.content.bind(this);
    this.state = {
      currentUser: authService.getCurrentUser().user,
      suggestedUsers: [],
      genres: [],
      mood: "",
      loading: true,
    };
  }

  async getUserInfo(id) {
    await axios.get(`http://localhost:3001/api/users/${id}`, { headers: authHeader() })
      .then((response) => {
        this.setState({
          ...this.state,
          currentUser: { ...this.state.currentUser, ...response.data },
        }
        );
      })
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

    if (response.data.genre.length === 0) {
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

  async getSuggestedUsers() {
    const suggestedUsers = [];
    const response = await axios.get(
      `http://localhost:3001/api/suggestedUsers/${this.state.currentUser.id}`,
      { headers: authHeader() }
    );
    for (const [key, value] of Object.entries(response.data)) {
      const user = await this.getUserInfo(value.others);
      suggestedUsers.push(user);
    }
    this.setState({ suggestedUsers: suggestedUsers });
  }
  componentDidMount() {
    if (authService.getCurrentUser() !== null) {
      const getAll = async () => {
        await this.getUserInfo(this.state.currentUser.id);
        await this.getSuggestedUsers();
        await this.getMoodGenre();
      };
      getAll().then(() => {
        this.setState({ loading: false });
      });
    }
  }

  content() {
    return (
      <>
        <Header user={this.state.currentUser} />

        <Divider />
        <Container maxW="container.xl">
          <Heading as="h2" size="lg" padding="4">
            Suggested users
          </Heading>
          {this.state.loading ? (
            <Spinner size={"xl"} />
          ) : (
            <>
              <Provider>
                <Carousel gap={5}>{this.state.suggestedUsers}</Carousel>
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
                  return (
                    < p key={genre + i}>{ }</p>
                  )
                })}
              </Stack>
            </>
          )}
        </Container >
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
