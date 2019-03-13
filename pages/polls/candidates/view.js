import React, { Component } from "react";
import Poll from "../../../ethereum/poll";
import web3 from "../../../ethereum/web3";
import { Link, Router } from "../../../routes";
import Layout from "../../../components/Layout";
import { Grid, Message, Card, Button } from "semantic-ui-react";

class CandidateShow extends Component {
  static async getInitialProps(props) {
    let candidate;
    let name = "";
    let party = "";

    try {
      const poll = Poll(props.query.address);
      const accounts = await web3.eth.getAccounts();
      candidate = await poll.methods.getCandidate(props.query.id).call();

      console.log("account ", accounts[0]);

      name = web3.utils.toAscii(candidate[1]);
      party = web3.utils.toAscii(candidate[2]);

      console.log(candidate);
    } catch (err) {
      console.log(err.message);
    }

    return {
      address: props.query.address,
      id: props.query.id,
      candidate,
      name,
      party
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      name: "",
      party: "",
      errorMessage: "",
      loading: false,
      isHidden: true
    };
  }

  componentDidMount() {
    this.setState({
      name: this.props.name,
      party: this.props.party
    });
  }

  handleVote = async event => {
    this.setState({ isHidden: true, loading: true, errorMessage: "" });

    try {
      const accounts = await web3.eth.getAccounts();

      const poll = Poll(this.props.address);

      await poll.methods.vote(accounts[0], this.props.id).send({
        from: accounts[0]
      });

      Router.pushRoute(`/polls/${this.props.address}/`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
      console.log(err);
    }

    this.setState({ loading: false });
  };

  render() {
    const { candidate } = this.props;

    return (
      <Layout>
        <Grid style={{ marginTop: "10px" }}>
          <Grid.Row>
            <Grid.Column textAlign="center">
              <h3>
                Vote for {this.state.name} - {this.state.party}
              </h3>
              <Link route={`/polls/${this.props.address}/`}>
                <a>Return</a>
              </Link>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column textAlign="center">
              <Grid.Row>
                <Grid.Column>
                  <div style={{ marginBottom: "10px" }} />
                  {/* <img
                    src="https://media1.tenor.com/images/59774851444217c2f404b4e719616b9c/tenor.gif?itemid=8911165"
                    alt="Button select gif"
                  /> */}
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column>
                  <Button
                    loading={this.state.loading}
                    primary
                    onClick={this.handleVote}
                  >
                    Vote for {this.props.name}
                  </Button>
                </Grid.Column>
              </Grid.Row>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default CandidateShow;
