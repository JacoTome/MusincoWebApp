import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import {Pagination} from "react-bootstrap";
import axios from "axios";

export default class CardUser extends React.Component {
    constructor(props) {
        super();
        this.state = {
            id: 1234,
            instruments: [],
            instrumentsNames: []
        }
    }

      async getInstrumentsNames(instruments) {
        const instrumentsNamesToAdd = []
        for (let i = 0; i < instruments.length; i++) {
            await axios.get(`http://localhost:3001/api/instruments/${instruments[i].value}`)
                .then((response) => {
                    console.log("data:" + response)
                    instrumentsNamesToAdd.push(response.data[0].name.value)
                })
                .catch((error) => {
                    console.log(error);
                })
        }
        this.setState({instrumentsNames: instrumentsNamesToAdd})

    }

    async componentDidMount() {
        // call the api
        const instrumentsToAdd = []
        axios.get(`http://localhost:3001/api/users/${this.state.id}`)
            .then((response) => {
                for (let i = 0; i < response.data.length; i++) {
                    if (response.data[i].p.value.includes('plays_instrument')) {
                        var len = response.data[i].o.value.split("/");
                        var instrumentId = len[len.length - 1]
                        instrumentsToAdd.push({value: instrumentId})
                    }
                }
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                this.getInstrumentsNames(instrumentsToAdd)
            })
    }
    render() {
        return (
            <Pagination size="lg">
                <Pagination.Item>
                    <Card style={{width: '18rem'}}>
                        <Card.Img variant="top" src="holder.js/100px180"/>
                        <Card.Body>
                            <Card.Title>Instruments played</Card.Title>
                            {
                                this.state.instrumentsNames.map((instrument) => {
                                    console.log(instrument)
                                return (
                                    <Card.Text key={instrument.value}>
                                        {instrument}
                                    </Card.Text>
                                )
                            })
                            }
                            <Button variant="primary">Go somewhere</Button>
                        </Card.Body>
                    </Card>
                </Pagination.Item>
            </Pagination>
        )
    }
}
