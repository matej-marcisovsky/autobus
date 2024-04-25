import { memo, type PropsWithChildren } from 'react';

function CounterComponent({ children }: PropsWithChildren) {
  return (
    <div className='counter is-flex is-justify-content-center'>
      <div className='tag is-info'>{children}</div>
    </div>
  );
}

const MemoizedCounterComponent = memo(CounterComponent);

export { MemoizedCounterComponent as CounterComponent };
