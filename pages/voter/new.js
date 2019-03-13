import react, { Component } from "react";
import Layout from "../../components/Layout";
import web3 from "../../ethereum/web3";
import factory from "../../ethereum/factory";
import { Input, Form, Button, Message, TextArea } from "semantic-ui-react";
import { DateTimeInput, DateInput } from "semantic-ui-calendar-react";
import { Router } from "../../routes";

export default class VoterNew extends Component {
  state = {
    name: "",
    dob: "",
    address: "",
    selectedFile: null,
    loaded: 0,
    errorMessage: "",
    loading: false
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
      Router.pushRoute("/");
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  };

  render() {
    return (
      <Layout>
        <h3>Register</h3>

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
