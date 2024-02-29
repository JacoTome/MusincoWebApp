// Mus participation card component
// Elements to show in the card:
// - Date
// - Time
// - Location
// - Event name and kind
// - Song(s) played
// - Instruments played
// - Mood / Emotion
import {
  Collapse,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  HStack,
  Divider,
  Text,
  StackItem,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon, DeleteIcon } from "@chakra-ui/icons";
import React from "react";

export default function MusParticipationCard(props) {
  const [show, setShow] = React.useState(false);
  return (
    <>
      <Card key={props.id} variant={"outline"}>
        <CardHeader>
          <HStack justifyContent={"space-evenly"}>
            <StackItem>
              <Heading as={"h2"} size={"sm"}>
                {props.event}
              </Heading>
            </StackItem>
            <Divider orientation={"vertical"} />
            <StackItem>
              <Button
                size={"sm"}
                bgColor={"transparent"}
                onClick={() => {
                  setShow(!show);
                }}
              >
                {show ? <ChevronUpIcon /> : <ChevronDownIcon />}
              </Button>
            </StackItem>
            <StackItem>
              <Button
                size={"sm"}
                bgColor={"transparent"}
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure?: " + props.part + " will be deleted."
                    )
                  ) {
                    props.deleteMusParticipation(props.part);
                  }
                }}
              >
                <DeleteIcon />
              </Button>
            </StackItem>
          </HStack>
          <Text size={"xs"}>
            {props.date} - {props.time}
          </Text>
        </CardHeader>
        <CardBody>
          <p>Song(s): {props.song}</p>
        </CardBody>
        <CardFooter>
          <Collapse startingHeight={0} in={show}>
            <p>Location: {props.location}</p>
            <p>Instruments: {props.instruments.label}</p>
            <p>Mood: {props.felt_mood}</p>
          </Collapse>
        </CardFooter>
      </Card>
    </>
  );
}
