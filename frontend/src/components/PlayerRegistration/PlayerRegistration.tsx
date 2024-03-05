// PlayerRegistration.jsx
import React, { useRef, useState } from 'react';

const PlayerRegistration = ({ onRegister }) => {
  const nameInputRef = useRef(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const handleInputChange = (event) => {
    setIsButtonDisabled(event.target.value.length < 3);
  };

  const handleRegister = () => {
    const name = nameInputRef.current.value;
    if (name.length >= 3) {
      onRegister(name);
    }
  };

  return (
    <>
      <div className='min-w-[300px] space-y-4 mb-4'>
        <label htmlFor="name" className="block mb-2 text-xs font-medium dark:text-white/45 text-center">Please Insert Your Name</label>
        <input type="text" onChange={handleInputChange} ref={nameInputRef} id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
      </div>
      <button
        onClick={handleRegister}
        type="button"
        disabled={isButtonDisabled}
        className={`focus:outline-none min-w-[300px] text-white bg-gradient-to-r from-rose-400 to-orange-400 hover:opacity-90 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900 ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        Accept
      </button>
    </>
  );
};

export default PlayerRegistration;
