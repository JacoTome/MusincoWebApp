import React from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Image,
} from "@chakra-ui/react";
export default class CardUser extends React.Component {
  constructor(props) {
    super();
    this.state = {
      id: props.id,
      name: props.name,
      surname: props.surname,
      instruments: props.instruments,
    };
  }

  render() {
    return (
      <>
        <Card size={"md"} variant={"outline"}>
          <CardHeader>
            {this.state.name} {this.state.id}
          </CardHeader>
          <CardBody>
            <Image src={`https://via.placeholder.com/150`} />
            {this.props.instruments.map((instrument) => (
              <p key={instrument}>{instrument}</p>
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
