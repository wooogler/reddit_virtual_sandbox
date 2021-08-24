import React, { ReactElement, useCallback, useState } from 'react';

interface Props {
  code: string;
}

function PrevCheck({ code }: Props): ReactElement {
  const [expand, setExpand] = useState(false);

  const onMouseOver = useCallback(() => {
    setExpand(true);
  }, []);
  const onMouseOut = useCallback(() => {
    setExpand(false);
  }, []);
  return (
    <div
      className={`text-gray-400 ${expand ? 'bg-gray-100' : 'truncate'}`}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
    >
      {code}
    </div>
  );
}

export default PrevCheck;
