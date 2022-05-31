import * as React from "react";
import classNames from "classnames";

interface Props {
  highlight?: boolean
}

export default class extends React.Component<Props> {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div className={classNames('delimiter mx-5', {
        ['delimiter--highlight']: this.props.highlight
      })}/>
    );
  }
}
