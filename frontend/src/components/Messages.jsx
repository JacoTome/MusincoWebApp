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
import authHeader from "../services/auth-headers";
import authService from "../services/auth.service";
import axios from "axios";
import MessageBox from "./MessageBox";
export default function Messages(props) {
  const [messages, setMessages] = useState([]);
  const user = authService.getCurrentUser();

  function onNewMessage(message) {
    console.log(message);
    setMessages((state) => [...state, message]);
  }

  useEffect(() => {
    if (localStorage.getItem("sessionID")) {
      socket.auth = { sessionID: localStorage.getItem("sessionID") };
    } else {
      socket.auth = { id: user.id };
    }
    socket.connect();
    const getMessage = async () => {
      await axios
        .get(`http://localhost:3001/api/users/${user.id}/message/${props.id}`, {
          headers: authHeader(),
        })
        .then((res) => {
          var messages = res.data.messages;
          messages.sort((a, b) => {
            return !(a.timestamp - b.timestamp);
          });
          setMessages(messages);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getMessage();
    socket.on("private_message", onNewMessage);
    socket.on("connect_error", (err) => {
      console.log(err);
    });
  }, [socket]);

  function AddMessage() {
    setMessages((messages) => [
      ...messages,
      {
        message_content: document.getElementById("message").value,
        sender_id: user.id,
        timestamp: Date.now(),
        receiver_id: props.id,
      },
    ]);
    if (!props.id) {
      socket.emit("private_message", {
        message: document.getElementById("message").value,
        to: user.id,
        timestamp: Date.now(),
      });
      return;
    }
    socket.emit("private_message", {
      message: document.getElementById("message").value,
      to: props.id,
      timestamp: Date.now(),
    });
  }

  return (
    <Container>
      <MessageBox messages={messages} user={user} />
      <Divider />
      <Container>
        <Flex>
          <Input type="text" id="message" />
          <Button
            onClick={async (e) => {
              e.preventDefault();
              AddMessage();
            }}
          >
            Send
          </Button>
        </Flex>
      </Container>
    </Container>
  );
}
