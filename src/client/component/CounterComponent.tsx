import * as React from "react";

export default class extends React.PureComponent {
  render() {
    return (
      <div className="counter is-flex is-justify-content-center">
        <div className="tag is-info">{this.props.children}</div>
      </div>
    );
  }
}
