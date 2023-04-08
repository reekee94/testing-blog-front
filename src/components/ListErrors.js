import React, { memo } from 'react';


function ListErrors({ errors }) {
  if (!errors || Object.keys(errors).length === 0) {
    return null;
  }

  const errorMessages = Object.entries(errors).flatMap(([property, messages]) =>
    messages.map((message) => `${property} ${message}`)
  );

  return (
    <ul className="error-messages">
      {errorMessages.map((message) => (
        <li key={message}>{message}</li>
      ))}
    </ul>
  );
}

export default memo(ListErrors);
