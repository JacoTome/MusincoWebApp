import React, { useEffect, useState } from "react";
import CardUser from "../components/CardUser";
import Header from "../components/Header";
import axios from "axios";
import { Container, Flex, Divider, Heading } from "@chakra-ui/react";
import {
  Carousel,
  LeftButton,
  Provider,
  RightButton,
} from "chakra-ui-carousel";
function Home(props) {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [genre, setGenre] = useState("Rock");

  async function getUserInfo(id) {
    console.log("Getting user info for id: " + id);
    const response = await axios.get(`http://localhost:3001/api/users/${id}`);
    const user = response.data;
    return (
      <CardUser
        key={id}
        id={id}
        name={user.name}
        surname={user.surname}
        instruments={user.instrument}
      />
    );
  }

  useEffect(() => {
    var suggestedUsers = [];
    axios
      .get(`http://localhost:3001/api/suggestedUsers/${1204}`)
      .then(async (response) => {
        for (const [_, value] of Object.entries(response.data)) {
          const user = await getUserInfo(value.others);
          suggestedUsers.push(user);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setSuggestedUsers(suggestedUsers);
      });
    // axios.get(`http://localhost:3001/api/genre/${1204}`).then((response) => {
    //   setGenre(response.data.genre);
    // });
  }, []);

  return (
    <>
      <Header />
      <Divider />
      <Container maxW="container.xl">
        <Heading as="h2" size="lg" padding="4">
          Suggested users
        </Heading>
        <Provider>
          <Carousel gap={10}>{suggestedUsers}</Carousel>
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
          let's plays some {genre}
        </Heading>
      </Container>
    </>
  );
}

export default Home;
