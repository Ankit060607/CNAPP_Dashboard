import React from 'react';

const Widget = ({ widget, removeWidget }) => {
  return (
    <div className="bg-gray-200 p-4 rounded-lg flex justify-between items-center">
      <div>
        <h3 className="font-semibold">{widget.name}</h3>
        <p>{widget.text}</p>
      </div>
      <button
        onClick={() => removeWidget(widget.id)}
        className="text-red-500 font-bold"
      >
        X
      </button>
    </div>
  );
};

export default Widget;
