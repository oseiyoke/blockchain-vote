import React, { Component } from "react";
import Poll from "../../ethereum/poll";
import web3 from "../../ethereum/web3";
import { Link } from "../../routes";
import Layout from "../../components/Layout";
import { Grid, Message, Card, Button } from "semantic-ui-react";

class PollShow extends Component {
  static async getInitialProps(props) {
    let candidates = [];
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

      title = await poll.methods.title().call();
      title = web3.utils.toAscii(title);

      console.log(candidates);
    } catch (err) {
      console.log(err.message);
    }

    return {
      address: props.query.address,
      candidates,
      numCandidates,
      title
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      candidates: [],
      errorMessage: "",
      isHidden: true
    };
  }

  renderCards() {
    const { candidates } = this.props;
    console.log(candidates);

    let item = [];
    candidates.forEach(element => {
      item.push({
        header: web3.utils.toAscii(element[1]),
        meta: web3.utils.toAscii(element[2]),
        description: (
          <a href={`/polls/${this.props.address}/candidates/${element[0]}`}>
            View
          </a>
        ),
        style: {
          overflowWrap: "break-word"
        }
      });
    });

    return <Card.Group items={item} />;
  }

  render() {
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
                <Grid.Column>{this.renderCards()}</Grid.Column>
              </Grid.Row>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default PollShow;
