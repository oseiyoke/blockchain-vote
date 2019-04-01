import React, { Component } from "react";
import Poll from "../../ethereum/poll";
import Contract from "../../ethereum/build/Poll.json";
import HDWalletProvider from "truffle-hdwallet-provider";
import Web3 from "web3";
import web3 from "../../ethereum/web3";
import { Link } from "../../routes";
import Layout from "../../components/Layout";
import { Grid, Message, Card, Button, Table, Input } from "semantic-ui-react";
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
      accounts: [],
      address: "",
      candidates: [],
      errorMessage: "",
      privateKey: "",
      voteButton: {
        display: "none",
        backgroundColor: "#66cc66",
        color: "white"
      },
      buttonAction: null,
      isHidden: true,
      loading: false
    };
  }

  async componentDidMount() {
    if (typeof window.web3 === "undefined") {
      //We are in the browser and metamask is not running
      console.log("No Metamask");
      this.setState({
        isHidden: false
      });
    } else {
      const accounts = await web3.eth.getAccounts();
      console.log(accounts[0]);

      // this.showButton();

      this.setState({
        accounts,
        isHidden: true
      });
    }
  }

  handleVote = async event => {
    this.setState({
      isHidden: true,
      loading: true,
      errorMessage: ""
    });

    let id = event.target.value;
    console.log(id);

    try {
      const poll = Poll(this.props.address);

      await poll.methods.vote(this.state.address, id).send({
        from: this.state.accounts[0]
      });

      // Router.replace(`/polls/${this.props.address}/`);
      Router.push(`/polls/${this.props.address}/`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
      console.log(err);
    }

    this.setState({ loading: false });
  };

  handleKey = async () => {
    try {
      const res = web3.eth.accounts.privateKeyToAccount(this.state.privateKey);
      console.log(res);

      this.setState({
        address: res.address
      });

      await web3.eth.accounts.wallet.add(res);

      this.showButton();
    } catch (err) {
      console.log(err.message);
    }
  };

  /*
  newHandleVote = async event => {
    this.setState({
      isHidden: true,
      loading: true,
      errorMessage: ""
    });

    let id = event.target.value;
    console.log(id);

    try {
      // console.log(accounts, this.state.seed);

      let accounts = this.state.address;

      const provider = new HDWalletProvider(
        "tooth rescue frown bicycle road during cup story spoil engage obey area",
        "https://rinkeby.infura.io/v3/33f420fcb0d049feb46730b08931fcfc"
      );
      const _web3 = new Web3(provider);

      const poll = new _web3.eth.Contract(
        JSON.parse(Contract.interface),
        this.props.address
      );

      await poll.methods.vote(address, id).send({
        from: accounts[0],
        gas: "1000000"
      });

      Router.push(`/polls/${this.props.address}/`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
      console.log(err);
    }

    this.setState({ loading: false });
  };
  */

  renderCards = () => {
    const { Content, Header, Meta, Description } = Card;
    const { candidates, candidate_votes } = this.props;
    let item = [];

    candidates.forEach((candidate, index) => {
      item.push(
        <Card>
          <Content>
            <Header>
              {web3.utils.toAscii(candidate[1])}{" "}
              <span style={{ float: "right" }}>{candidate_votes[index]}</span>
            </Header>
            <Meta>{web3.utils.toAscii(candidate[2])}</Meta>
            <Description>
              <Button
                onClick={this.state.buttonAction}
                style={this.state.voteButton}
                value={candidate[0]}
                loading={this.state.loading}
              >
                Vote for {web3.utils.toAscii(candidate[1])}
              </Button>
            </Description>
          </Content>
        </Card>
      );
    });

    return item;
  };

  showButton = () => {
    this.setState({
      voteButton: { backgroundColor: "#66cc66", color: "white" },
      buttonAction: this.handleVote
    });
  };

  render() {
    const { Header, Row, HeaderCell, Body } = Table;

    return (
      <Layout show={true} address={this.props.address}>
        <Grid style={{ marginTop: "10px" }}>
          <Grid.Row>
            <Grid.Column textAlign="center">
              <Grid.Row>
                <h3>{this.props.title}</h3>
                <h6>{this.props.address}</h6>
              </Grid.Row>
              <Grid.Row>
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
              </Grid.Row>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Grid.Row>
                <Grid.Column>
                  <div style={{ marginBottom: "10px" }}>
                    <Message>
                      <Message.Header>Private Key</Message.Header>
                      <Message.Content>
                        Enter your Private Key
                        <br />
                        <Input
                          autoComplete={"off"}
                          placeholder={"Private Key"}
                          style={{ width: "90%", margin: "5px", marginLeft: 0 }}
                          value={this.state.privateKey}
                          onChange={event => {
                            this.setState({ privateKey: event.target.value });
                          }}
                        />
                        <Button onClick={this.handleKey} primary>
                          Submit
                        </Button>
                        <br />
                        <Link route={`/polls/${this.props.address}/voter/new`}>
                          <a> Create one here</a>
                        </Link>
                      </Message.Content>
                    </Message>
                  </div>
                  <br />
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column>
                  <Card.Group>{this.renderCards()}</Card.Group>

                  {/* <Table>
                    <Header>
                      <Row>
                        <HeaderCell>ID</HeaderCell>
                        <HeaderCell>Candidate</HeaderCell>
                        <HeaderCell>Party</HeaderCell>
                        <HeaderCell>Votes</HeaderCell>
                        <HeaderCell>Vote</HeaderCell>
                      </Row>
                    </Header>
                    <Body>{this.renderRows()}</Body>
                  </Table> */}
                </Grid.Column>
              </Grid.Row>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default PollShow;
