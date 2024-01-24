import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Image,
  Button,
  Heading,
} from "@chakra-ui/react";
import { Navigate } from "react-router-dom";

export default class CardUser extends React.Component {
  constructor(props) {
    super();
    this.removeDescription = this.removeDescription.bind(this);
    this.state = {
      id: props.id,
      name: props.name,
      surname: props.surname,
      username: props.username,
      instruments: props.instruments,
      mainInstrument: props.instruments[0],
      redirect: false,
    };
  }

  removeDescription(instrument) {
    // Remove everything in () from the string
    if (instrument === undefined) return "";
    return instrument.replace(/\([^)]*\)/, "").trim();
  }

  render() {
    return (
      <>
        <Card size={"md"} variant={"outline"}>
          <CardHeader>{this.state.username}</CardHeader>
          <CardBody>
            <Heading as={"h4"} size={"md"}>
              Main Instrument{" "}
              <p>{this.removeDescription(this.state.mainInstrument)}</p>
            </Heading>
            <Image src={`https://via.placeholder.com/150`} />
            {this.state.instruments.splice(1).map((instrument) => (
              <p key={instrument}>{this.removeDescription(instrument)}</p>
            ))}
          </CardBody>
          <CardFooter>
            <a href={`/profile/${this.state.id}`}>View Profile</a>
            <Button
              onClick={() => {
                this.setState({ redirect: true });
              }}
            >
              SendMessage
            </Button>
          </CardFooter>
        </Card>
        {this.state.redirect ? <Navigate to={`/chat`} /> : null}
      </>
    );
  }
}
