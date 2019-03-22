import React, { Component } from "react";
import Poll from "../../ethereum/poll";
import web3 from "../../ethereum/web3";
import { Link } from "../../routes";
import Layout from "../../components/Layout";
import { Grid, Message, Card, Button, Table } from "semantic-ui-react";
import { Router } from "../../routes";

class PollShow extends Component {
  static async getInitialProps(props) {
    let candidates = [];
    let candidate_votes = [];
    let numCandidates = 0;
    let title = "";

    try {
      const poll = Poll(props.query.address);
      const accounts = await web3.eth.getAccounts();
      // const [account] = await web3.eth.getAccount();
      console.log("account ", accounts[0]);

      numCandidates = await poll.methods.getNumOfCandidates().call({
        from: accounts[0]
      });

      candidates = await Promise.all(
        Array(parseInt(numCandidates))
          .fill()
          .map((element, index) => {
            return poll.methods.getCandidate(index).call({
              from: accounts[0]
            });
          })
      );

      candidate_votes = await Promise.all(
        Array(parseInt(numCandidates))
          .fill()
          .map((element, index) => {
            return poll.methods.totalVotes(index).call({
              from: accounts[0]
            });
          })
      );

      title = await poll.methods.title().call();
      title = web3.utils.toAscii(title);

      // console.log(candidates);
    } catch (err) {
      console.log(err.message);
    }

    return {
      address: props.query.address,
      candidates,
      candidate_votes,
      numCandidates,
      title
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      voteButton: [],
      candidates: [],
      errorMessage: "",
      isHidden: true,
      loading: false
    };
  }

  handleVote = async event => {
    this.setState({
      isHidden: true,
      loading: true,
      errorMessage: "",
      voteButton: []
    });

    let id = event.target.value;
    console.log(id);

    try {
      const accounts = await web3.eth.getAccounts();

      const poll = Poll(this.props.address);

      await poll.methods.vote(accounts[0], id).send({
        from: accounts[0]
      });

      // Router.replace(`/polls/${this.props.address}/`);
      Router.push(`/polls/${this.props.address}/`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
      console.log(err);
    }

    this.setState({ loading: false });
  };

  renderRows = () => {
    const { Row, Cell } = Table;
    const { candidates, candidate_votes } = this.props;
    let item = [];

    candidates.forEach((candidate, index) => {
      item.push(
        <Row>
          <Cell>{candidate[0]}</Cell>
          <Cell>{web3.utils.toAscii(candidate[1])}</Cell>
          <Cell>{web3.utils.toAscii(candidate[2])}</Cell>
          <Cell>{candidate_votes[index]}</Cell>
        </Row>
      );
    });

    return item;
  };

  async componentDidMount() {
    let _buttons = [];

    _buttons = this.props.candidates.map((candidate, index) => {
      return (
        <Button
          onClick={this.handleVote}
          style={{ backgroundColor: "#66cc66" }}
          value={candidate[0]}
        >
          Vote for {web3.utils.toAscii(candidate[1])}
        </Button>
      );
    });

    this.setState({ voteButton: _buttons });
  }

  render() {
    const { Header, Row, HeaderCell, Body } = Table;

    return (
      <Layout>
        <Grid style={{ marginTop: "10px" }}>
          <Grid.Row>
            <Grid.Column textAlign="center">
              <h3>{this.props.title}</h3>
              <h6>{this.props.address}</h6>
              <br />
              <Link route={`/polls/${this.props.address}/candidates/new`}>
                <a>
                  <Button
                    floated="right"
                    content="Add Candidate"
                    icon="add circle"
                    primary
                    loading={this.state.loading}
                  />
                </a>
              </Link>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Grid.Row>
                <Grid.Column>
                  <div style={{ marginBottom: "10px" }}>
                    <Message
                      error={!!this.state.errorMessage}
                      hidden={this.state.isHidden}
                      header="Oops!"
                      content={this.state.errorMessage}
                    />
                  </div>
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column>
                  <Table>
                    <Header>
                      <Row>
                        <HeaderCell>ID</HeaderCell>
                        <HeaderCell>Candidate</HeaderCell>
                        <HeaderCell>Party</HeaderCell>
                        <HeaderCell>Votes</HeaderCell>
                      </Row>
                    </Header>
                    <Body>{this.renderRows()}</Body>
                  </Table>
                </Grid.Column>
              </Grid.Row>

              <br />

              <Grid.Row>{this.state.voteButton}</Grid.Row>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default PollShow;
