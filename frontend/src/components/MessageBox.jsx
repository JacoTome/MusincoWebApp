import React from "react";
import { Flex, Stack, StackItem } from "@chakra-ui/react";

function formatDateFromTimestamp(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString();
}
export default function MessageBox({ messages, user }) {
  return (
    <Stack overflow={"scroll"} h="200px">
      {messages.map((message, index) => {
        if (message.sender_id === user.id || message.receiver_id === user.id) {
          return (
            <StackItem key={index}>
              <Flex>
                <p>{formatDateFromTimestamp(message.timestamp)} - [</p>
                <p> {message.message_content}]</p>
              </Flex>
            </StackItem>
          );
        } else {
          return null;
        }
      })}
    </Stack>
  );
}
