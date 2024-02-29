import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Image,
  Button,
  Heading,
  HStack,
  StackItem,
  Alert,
  VStack,
  Tooltip,
} from "@chakra-ui/react";
import { Navigate } from "react-router-dom";
import { AddIcon, ChatIcon } from "@chakra-ui/icons";
import authService from "../services/auth.service";
import authHeader from "../services/auth-headers";
import axios from "axios";

export default class CardUser extends React.Component {
  constructor(props) {
    super();
    this.removeDescription = this.removeDescription.bind(this);
    this.sendRequest = this.sendRequest.bind(this);
    this.state = {
      isFriend: props.isFriend || false,
      requestSent: false,
      requestError: false,
      requestErrorMessage: "",
      id: props.id,
      name: props.name,
      surname: props.surname,
      username: props.username,
      instruments: props.instruments,
      mainInstrument: props.instruments[0],
      redirect: false,
    };
  }

  sendRequest = () => {
    const user_id = authService.getCurrentUser().id;
    const friend_id = this.state.id;
    axios
      .post(
        `http://localhost:3001/api/users/${user_id}/addfriend`,
        {
          friend_id: friend_id,
        },
        {
          headers: authHeader(),
        }
      )
      .then((response) => {
        this.setState({ requestSent: true });
      })
      .catch((error) => {
        this.setState({
          requestSent: true,
          requestError: true,
          requestErrorMessage: error.message,
        });
        setTimeout(() => {
          this.setState({ requestSent: false, requestError: false });
        }, 4000);
      });
  };
  removeDescription(instrument) {
    // Remove everything in () from the string
    if (instrument === undefined) return "";

    return instrument.label.replace(/\([^)]*\)/, "").trim();
  }

  render() {
    return (
      <>
        <Card
          size={"md"}
          variant={"outline"}
          boxShadow={"5px 5px 5px  2px #B4656F"}
        >
          <CardHeader>
            <VStack w="100%">
              <StackItem>
                <HStack justifyContent={"space-between"}>
                  <StackItem>
                    <Heading as={"h2"} size={"sm"}>
                      {this.state.username}
                    </Heading>
                  </StackItem>
                </HStack>
              </StackItem>
            </VStack>
          </CardHeader>
          <CardBody>
            <Heading as={"h3"} size={"md"}>
              Main Instrument{" "}
            </Heading>
            <HStack>
              <StackItem w="175px">
                <p>{this.removeDescription(this.state.mainInstrument)}</p>
                {this.state.instruments.splice(1).map((instrument) => (
                  <Tooltip label={instrument.used_to_play}>
                    <p key={instrument}>{this.removeDescription(instrument)}</p>
                  </Tooltip>
                ))}

                {/*  ) : (
                    <p key={instrument}>{this.removeDescription(instrument)}</p>
                  )
                 )} */}
              </StackItem>
              <StackItem>
                <Image src={`https://via.placeholder.com/150`} />
              </StackItem>
            </HStack>
          </CardBody>
          <CardFooter>
            <HStack>
              <a href={`/profile/${this.state.id}`}>View Profile</a>
              <Button
                onClick={() => {
                  this.setState({ redirect: true });
                }}
              >
                <ChatIcon />
              </Button>{" "}
              {!this.state.isFriend ? (
                <StackItem>
                  <Button onClick={this.sendRequest}>
                    <AddIcon />
                  </Button>
                </StackItem>
              ) : null}
            </HStack>
          </CardFooter>
          {this.state.requestSent ? (
            this.state.requestError ? (
              <Alert status="error">
                <p>{this.state.requestErrorMessage}</p>
              </Alert>
            ) : (
              <Alert status="success">
                <p>Request sent successfully</p>
              </Alert>
            )
          ) : null}
        </Card>
        {this.state.redirect ? <Navigate to={`/chat`} /> : null}
      </>
    );
  }
}
