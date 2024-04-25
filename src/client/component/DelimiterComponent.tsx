import classNames from 'classnames';
import { memo } from 'react';

type Props = {
  highlight?: boolean;
};

function DelimiterComponent({ highlight }: Props) {
  return (
    <div
      className={classNames('delimiter mx-5', {
        'is-highlighted': highlight,
      })}
    />
  );
}

const MemoizedDelimiterComponent = memo(DelimiterComponent);

export { MemoizedDelimiterComponent as DelimiterComponent };
