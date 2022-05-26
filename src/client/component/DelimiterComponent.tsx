import * as React from "react";

export default class extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div className="delimiter mx-5"/>
    );
  }
}
