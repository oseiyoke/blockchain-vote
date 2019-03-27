import React from "react";
import { Menu } from "semantic-ui-react";
import { Link } from "../routes";

export default props => {
  return (
    <Menu style={{ marginTop: "10px" }}>
      <Link route="/">
        <a className="item">Blockchain Voting</a>
      </Link>

      <Menu.Menu position="right">
        {props.show ? (
          <Link route={`/polls/${props.address}/voter/new`}>
            <a className="item">Register Voter</a>
          </Link>
        ) : null}

        <Link route="/">
          <a className="item">Polls</a>
        </Link>

        <Link route="/polls/new">
          <a className="item">+</a>
        </Link>
      </Menu.Menu>
    </Menu>
  );
};
