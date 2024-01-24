import {
  Button,
  Container,
  Divider,
  Input,
  Stack,
  StackItem,
  Flex,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import socket from "..";
export default function Messages(props) {
  const [messages, setMessages] = useState([]);
  const [userID, setUserID] = useState(props.id);
  useEffect(() => {
    socket.on("private_message", ({ message, from }) => {
      console.log("private message");
      setMessages((state) => [
        ...state,
        {
          message,
          username: from,
          __createdTime: Date.now(),
        },
      ]);
    });
    socket.on("connect_error", (err) => {
      console.log(err);
    });
  });

  function formatDateFromTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }

  return (
    <Container>
      <Stack overflow={"scroll"} h="200px">
        {messages.map((message, index) => (
          <StackItem key={index}>
            {message.username} -{" "}
            {formatDateFromTimestamp(message.__createdTime)} - {message.message}
          </StackItem>
        ))}
      </Stack>
      <Divider />
      <Container>
        <Flex>
          <Input type="text" id="message" />
          <Button
            onClick={() => {
              console.log(document.getElementById("message").value);
              socket.emit("private_message", {
                message: document.getElementById("message").value,
                to: userID,
              });
              setMessages((state) => [
                ...state,
                {
                  message: document.getElementById("message").value,
                  username: socket.username,
                  __createdTime: Date.now(),
                },
              ]);
            }}
          >
            Send
          </Button>
        </Flex>
      </Container>
    </Container>
  );
}
