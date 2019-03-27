import React, { Component } from "react";
import factory from "../ethereum/factory";
import Poll from "../ethereum/poll";
import Layout from "../components/Layout";
import { Link } from "../routes";
import { Card, Button } from "semantic-ui-react";
import web3 from "../ethereum/web3";

class PollIndex extends Component {
  static async getInitialProps() {
    try {
      const polls = await factory.methods.getDeployedPolls().call();
      const polls_length = await factory.methods
        .getDeployedPollsLength()
        .call();

      let titles;

      if (polls_length > 0) {
        titles = await Promise.all(
          polls.map((address, index) => {
            const poll = Poll(address);
            const title = poll.methods.title().call();
            return title;
          })
        );
      }

      return { polls, titles };
    } catch (err) {
      const polls = ["No Polls Fetched"];
      console.log(err);

      return { polls };
    }
  }

  renderPolls() {
    const items = this.props.polls.map((address, index) => {
      return {
        header: web3.utils.toAscii(this.props.titles[index]),
        description: (
          <div>
            <Link route={`/polls/${address}`}>
              <a>View Poll</a>
            </Link>
          </div>
        ),
        fluid: true,
        style: {
          overflowWrap: "break-word"
        }
      };
    });

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <div>
          <h3>Open Polls</h3>

          <Link route="/polls/new">
            <a>
              <Button
                floated="right"
                content="Create Poll"
                icon="add circle"
                primary
              />
            </a>
          </Link>

          {this.renderPolls()}
        </div>
      </Layout>
    );
  }
}

export default PollIndex;
