import react, { Component } from "react";
import Layout from "../../../components/Layout";
import web3 from "../../../ethereum/web3";
import Poll from "../../../ethereum/poll";
import { Input, Form, Button, Message } from "semantic-ui-react";
import { DateTimeInput } from "semantic-ui-calendar-react";
import { Router } from "../../../routes";

export default class CandidateNew extends Component {
  static async getInitialProps(props) {
    return {
      address: props.query.address
    };
  }

  state = {
    name: "",
    party: "",
    errorMessage: "",
    loading: false
  };

  onSubmit = async event => {
    event.preventDefault();

    let name = web3.utils.fromAscii(this.state.name);
    let party = web3.utils.fromAscii(this.state.party);

    console.log(name, party);

    this.setState({ loading: true, errorMessage: "" });

    try {
      const poll = Poll(this.props.address);
      const accounts = await web3.eth.getAccounts();
      await poll.methods.addCandidate(name, party).send({
        from: accounts[0]
      });

      Router.pushRoute(`/polls/${this.props.address}`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  };

  render() {
    return (
      <Layout show={true} address={this.props.address}>
        <h3>Add {this.state.name}</h3>

        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Name</label>
            <Input
              value={this.state.name}
              onChange={event => {
                this.setState({ name: event.target.value });
              }}
              required
            />
          </Form.Field>

          <Form.Field>
            <label>Party</label>
            <Input
              value={this.state.party}
              onChange={event => {
                this.setState({ party: event.target.value });
              }}
              required
            />
          </Form.Field>

          <Message error header="Oops!" content={this.state.errorMessage} />

          <Button loading={this.state.loading} primary>
            Add {this.state.name}!
          </Button>
        </Form>
      </Layout>
    );
  }
}
