import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Image,
  Heading,
} from "@chakra-ui/react";
export default class CardUser extends React.Component {
  constructor(props) {
    super();
    this.state = {
      id: props.id,
      name: props.name,
      surname: props.surname,
      mainInstrument: props.instruments[0],
      instruments: props.instruments,
    };
  }

  removeDescription(instrument) {
    // Remove everything in () from the string
    return instrument.replace(/\([^)]*\)/, "").trim();
  }

  render() {
    return (
      <>
        <Card size={"md"} variant={"outline"}>
          <CardHeader>{this.state.name}</CardHeader>
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
          </CardFooter>
        </Card>
      </>
    );
  }
}
