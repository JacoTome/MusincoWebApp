import axios from "axios";
import React, { Component } from "react";

export default class Profile extends Component {
  constructor(props) {
    super();
    this.state = {
      id: 10001,
    };
  }
  componentDidMount() {
    axios
      .get(`http://localhost:3001/api/users/${this.state.id}`)
      .then((res) => {
        console.log(res.data);
      });
  }
  render() {
    return <div>Profile POpi</div>;
  }
}
