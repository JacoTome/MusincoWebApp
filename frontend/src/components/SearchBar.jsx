import { Container, FormControl } from "@chakra-ui/react";
import React, { Component } from "react";
import axios from "axios";
import authHeader from "../services/auth-headers";
import Fuse from "fuse.js";

import AsyncSelect from "react-select/async";

export default class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleFocusOut = this.handleFocusOut.bind(this);
    this.promiseOptions = this.promiseOptions.bind(this);
    this.state = {
      isError: false,
      search: "",
      canSearch: true,
      results: [],
      suggestions: "",
      selectedValue: {},
      kind: props.kind,
      focus: true,
    };
  }

  handleSearch = async (event) => {
    this.setState({ search: event.target.value });

    if (this.state.canSearch) {
      this.setState({ canSearch: false });

      await axios
        .get(
          `http://localhost:3001/api/${this.state.kind}/search/${event.target.value}`,
          {
            headers: authHeader(),
          }
        )
        .then((res) => {
          this.setState({ results: res.data });
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.setState({ canSearch: true });
        });
    }
  };

  promiseOptions = async (inputValue) => {
    if (inputValue) {
      const response = await axios.get(
        `http://localhost:3001/api/${this.state.kind}/search/${inputValue}`,
        {
          headers: authHeader(),
        }
      );
      const options = {
        isCaseSensitive: false,
        shouldSort: true,
        includeScore: true,
        keys: ["name"],
      };

      const fuse = new Fuse(response.data, options);
      const filteredItems = fuse.search(inputValue);
      return filteredItems.map((item) => {
        return { value: item.item.id, label: item.item.name };
      });
    }
  };

  handleFocusOut = () => {
    // this.props.set(this.state.results[0].name);
    this.setState({ focus: false });
  };
  handleFocus = () => {
    this.setState({ focus: true });
  };
  render() {
    const isError = this.state.search === "";
    return (
      <Container onFocus={this.handleFocus} onBlur={this.handleFocusOut}>
        <FormControl isInvalid={isError}>
          <AsyncSelect
            options={this.state.results}
            loadOptions={this.promiseOptions}
            onChange={(selectedOption) => {
              this.props.set(selectedOption);
            }}
          />
        </FormControl>
      </Container>
    );
  }
}
