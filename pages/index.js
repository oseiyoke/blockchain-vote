import React, { Component } from "react";
import factory from "../ethereum/factory";
import Layout from "../components/Layout";
import { Link } from "../routes";
import { Card, Button } from "semantic-ui-react";

class PollIndex extends Component {
  static async getInitialProps() {
    try {
      const polls = await factory.methods.getDeployedPolls().call();

      return { polls };
    } catch (err) {
      const polls = ["No Polls Fetched"];
      console.log(err);

      return { polls };
    }
  }

  renderPolls() {
    const items = this.props.polls.map(address => {
      return {
        header: address,
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
