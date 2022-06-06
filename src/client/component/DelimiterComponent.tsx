import * as React from "react";
import classNames from "classnames";

interface Props {
  highlight?: boolean
}

export default class extends React.Component<Props> {
  render() {
    return (
      <div className={classNames('delimiter mx-5', {
        'is-highlighted': this.props.highlight
      })}/>
    );
  }
}
