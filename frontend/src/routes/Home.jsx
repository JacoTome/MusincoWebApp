import React, { useEffect, useState } from "react";
import CardUser from "../components/CardUser";
import Header from "../components/Header";
import axios from "axios";
import { Container, Flex, Divider, Heading, Spinner } from "@chakra-ui/react";
import {
  Carousel,
  LeftButton,
  Provider,
  RightButton,
} from "chakra-ui-carousel";
function Home(props) {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [genre, setGenre] = useState("Rock");
  const [mood, setMood] = useState("happy");
  const [loading, setLoading] = useState(true);

  async function getUserInfo(id) {
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

  async function getMood() {
    const hour = Intl.DateTimeFormat("it-IT", {
      hour: "2-digit",
    })
      .format(Date.now())
      .split(" ")[0];
    const response = await axios.get(
      `http://localhost:3001/api/hourMoodGenre/${hour}`
    );
    const mood = response.data[0];
    const splitMood = mood.mood.split("/");
    const splitGenre = mood.genre_name.split("/");
    setGenre(splitGenre[splitGenre.length - 1]);
    setMood(splitMood[splitMood.length - 1]);

    if (mood === undefined) {
      return "happy";
    }
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
      })
      .then(async () => {
        await getMood();
      })
      .then(() => {
        setLoading(false);
        //Everything is loaded
      });
  }, []);

  return (
    <>
      <Header />
      <Divider />
      <Container maxW="container.xl">
        <Heading as="h2" size="lg" padding="4">
          Suggested users
        </Heading>
        {loading ? (
          <Spinner size={"xl"} />
        ) : (
          <>
            <Provider>
              <Carousel gap={5}>{suggestedUsers}</Carousel>
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
              are you feeling {mood}? Let's play some {genre}!
            </Heading>
          </>
        )}
      </Container>
    </>
  );
}

export default Home;
