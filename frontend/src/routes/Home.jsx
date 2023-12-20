import React, { useEffect } from "react";
import CardUser from "../components/CardUser";
import Header from "../components/Header";
import { useState } from "react";
import axios from "axios";
import { CardGroup, Carousel, Stack } from "react-bootstrap";
function Home(props) {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  useEffect(() => {
    var suggestedUsers = [];
    axios
      .get(`http://localhost:3001/api/suggestedUsers/${1204}`)
      .then((response) => {
        for (const [_, value] of Object.entries(response.data)) {
          suggestedUsers.push(value.others);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setSuggestedUsers(suggestedUsers);
      });
  }, []);

  return (
    <>
      <Header />
      <div className="container">
        <h1>Suggested Users</h1>
        <Carousel>
          <Carousel.Item>
            <Stack direction="horizontal" gap={3}>
              {suggestedUsers.splice(0, 4).map((user) => (
                <CardUser key={user} id={user} />
              ))}
            </Stack>
          </Carousel.Item>
          <Carousel.Item>
            <Stack direction="horizontal" gap={3}>
              {suggestedUsers.splice(5, 9).map((user) => (
                <CardUser key={user} id={user} />
              ))}
            </Stack>
          </Carousel.Item>
        </Carousel>
      </div>
    </>
  );
}

export default Home;
