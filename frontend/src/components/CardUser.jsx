import React from "react";
import Card from "react-bootstrap/Card";
import { ListGroup } from "react-bootstrap";
import axios from "axios";

export default class CardUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      name: "",
      surname: "",
      instruments: [],
    };
  }

  componentDidMount() {
    // call the api
    let newState = {
      id: this.state.id,
      name: "",
      surname: "",
      instruments: [],
    };

    axios
      .get(`http://localhost:3001/api/users/${this.state.id}`)
      .then((response) => {
        for (const [_, value] of Object.entries(response.data)) {
          switch (value.key) {
            case "name":
              newState.name = value.value;
              break;
            case "surname":
              newState.surname = value.value;
              break;
            case "instrument":
              var instruments = value.value.split("/");
              newState.instruments = [
                ...newState.instruments,
                instruments[instruments.length - 1],
              ];
              break;
            default:
              break;
          }
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        this.setState(newState);
      });
  }
  render() {
    return (
      <Card style={{ width: "200px" }}>
        <Card.Img variant="top" src="https://placehold.co/100x100" />
        <Card.Body>
          <Card.Title>
            {this.state.name} {this.state.surname}
          </Card.Title>
          <ListGroup>
            {this.state.instruments.map((instrument) => {
              return (
                <ListGroup.Item key={instrument}>{instrument}</ListGroup.Item>
              );
            })}
          </ListGroup>
        </Card.Body>
      </Card>
    );
  }
}
