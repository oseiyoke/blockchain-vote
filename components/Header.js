import React from "react";
import { Menu } from "semantic-ui-react";
import { Link } from "../routes";

export default () => {
  return (
    <Menu style={{ marginTop: "10px" }}>
      <Link route="/">
        <a className="item">Blockchain Voting</a>
      </Link>

      <Menu.Menu position="right">
        <Link route="/voter/new">
          <a className="item">Register Voter</a>
        </Link>

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
