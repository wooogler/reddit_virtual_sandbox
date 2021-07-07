import React, { ReactElement } from 'react';

interface Props {
  children?: React.ReactNode;
}

function PanelName({ children }: Props): ReactElement {
  return <div className='text-xl font-bold mr-2'>{children}</div>;
}

export default PanelName;
