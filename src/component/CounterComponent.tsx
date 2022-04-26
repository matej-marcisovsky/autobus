import * as React from "react";

export default class extends React.PureComponent {
  render() {
    return (
      <div className="counter is-flex is-justify-content-center">
        <div className="tags has-addons">
          <span className="tag">Počet</span>
          <span className="tag is-info">{this.props.children}</span>
        </div>
      </div>
    );
  }
}
