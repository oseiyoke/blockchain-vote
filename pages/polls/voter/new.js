import react, { Component } from "react";
import Layout from "../../../components/Layout";
import web3 from "../../../ethereum/web3";
import factory from "../../../ethereum/factory";
import Poll from "../../../ethereum/poll";
import { Input, Form, Button, Message, TextArea } from "semantic-ui-react";
import { DateTimeInput, DateInput } from "semantic-ui-calendar-react";
import { Router, Link } from "../../../routes";

export default class VoterNew extends Component {
  static async getInitialProps(props) {
    return {
      address: props.query.address
    };
  }
  state = {
    name: "",
    dob: "",
    address: "",
    selectedFile: null,
    loaded: 0,
    errorMessage: "",
    loading: false,
    privateKey: "",
    isHidden: true
  };

  handleChange = (event, { name, value }) => {
    if (this.state.hasOwnProperty(name)) {
      this.setState({ [name]: value });
    }
  };

  handleselectedFile = event => {
    this.setState({
      selectedFile: event.target.files[0],
      loaded: 0
    });
  };

  onSubmit = async event => {
    event.preventDefault();

    const { name, dob, address, selectedFile } = this.state;

    console.log(name, dob, address, selectedFile);

    this.setState({ loading: true, errorMessage: "" });

    try {
      const user_account = await web3.eth.accounts.create();
      console.log(user_account);

      const [account] = await web3.eth.getAccounts();
      const poll = Poll(this.props.address);

      const request = await poll.methods
        .registerVoter(
          web3.utils.fromAscii(name),
          web3.utils.fromAscii(dob),
          web3.utils.fromAscii(address),
          user_account.address
        )
        .send({
          from: account
        });

      if (request) {
        this.setState({
          isHidden: false,
          privateKey: user_account.privateKey
        });
      } else {
        this.setState({ errorMessage: err.message });
      }

      // Router.pushRoute("/");
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  };

  render() {
    return (
      <Layout>
        <Link route={`/polls/${this.props.address}`}>
          <a>Back</a>
        </Link>

        <h3>Register</h3>

        <Message
          success
          header="Keep this Private Key!"
          content={this.state.privateKey}
          hidden={this.state.isHidden}
        />

        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Full Name</label>
            <Input
              value={this.state.name}
              placeholder="Full Name"
              onChange={event => {
                this.setState({ name: event.target.value });
              }}
              required
            />
          </Form.Field>

          <Form.Field>
            <label>Date of Birth</label>
            <DateInput
              name="dob"
              placeholder="Date of Birth"
              value={this.state.dob}
              iconPosition="left"
              onChange={this.handleChange}
              dateFormat="MM-DD-YYYY"
              required
            />
          </Form.Field>

          <Form.Field>
            <label>Address</label>
            <TextArea
              value={this.state.address}
              placeholder="Address"
              onChange={event => {
                this.setState({ address: event.target.value });
              }}
              required
            />
          </Form.Field>

          <Form.Field>
            <label>Upload Means of Identification</label>
            <Input
              type="file"
              onChange={this.handleselectedFile}
              accept="image/*"
              required
            />
          </Form.Field>

          <Message error header="Oops!" content={this.state.errorMessage} />

          <Button loading={this.state.loading} primary>
            Register!
          </Button>
        </Form>
      </Layout>
    );
  }
}
