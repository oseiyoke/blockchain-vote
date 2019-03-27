import react, { Component } from "react";
import Layout from "../../components/Layout";
import web3 from "../../ethereum/web3";
import factory from "../../ethereum/factory";
import { Input, Form, Button, Message } from "semantic-ui-react";
import { DateTimeInput } from "semantic-ui-calendar-react";
import { Router } from "../../routes";

export default class PollNew extends Component {
  state = {
    title: "",
    start_time: 0,
    end_time: 0,
    errorMessage: "",
    loading: false
  };

  handleChange = (event, { name, value }) => {
    if (this.state.hasOwnProperty(name)) {
      this.setState({ [name]: value });
    }
  };

  onSubmit = async event => {
    event.preventDefault();

    const { title, start_time, end_time } = this.state;

    let _title = web3.utils.fromAscii(title.trim(), 32);
    let _start_time = new Date(start_time).getTime();
    let _end_time = new Date(end_time).getTime();

    console.log(_title, start_time, end_time);

    this.setState({ loading: true, errorMessage: "" });

    try {
      const accounts = await web3.eth.getAccounts();

      await factory.methods.createPoll(_title, _start_time, _end_time).send({
        from: accounts[0]
      });

      Router.pushRoute("/");
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  };

  render() {
    return (
      <Layout>
        <h3>Create Poll {this.state.title}</h3>

        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Title</label>
            <Input
              value={this.state.title}
              onChange={event => {
                this.setState({ title: event.target.value });
              }}
              required
            />
          </Form.Field>

          <Form.Field>
            <label>Start Time</label>
            <DateTimeInput
              name="start_time"
              placeholder="Start Time"
              value={this.state.start_time}
              iconPosition="left"
              onChange={this.handleChange}
              dateFormat="MM-DD-YYYY"
              minDate={new Date()}
              required
            />
          </Form.Field>

          <Form.Field>
            <label>End Time</label>
            <DateTimeInput
              name="end_time"
              placeholder="End Time"
              value={this.state.end_time}
              iconPosition="left"
              onChange={this.handleChange}
              dateFormat="MM-DD-YYYY"
              minDate={new Date()}
              required
            />
          </Form.Field>

          <Message error header="Oops!" content={this.state.errorMessage} />

          <Button loading={this.state.loading} primary>
            Create {this.state.title}!
          </Button>
        </Form>
      </Layout>
    );
  }
}
