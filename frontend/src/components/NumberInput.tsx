import React, { useState } from 'react';

interface NumberInputProps {
  text: string;
  onValueChange: (value: number, type: string) => void; // Include an identifier for the input
  type: string; // Add a type prop to distinguish between inputs
  startFrom: number; // Add a type prop to distinguish between inputs
  increaseBy: number; // Add a type prop to distinguish between inputs
}

const NumberInput: React.FC<NumberInputProps> = ({ text, onValueChange, type, startFrom, increaseBy }) => {

  const [value, setValue] = useState<number>(startFrom);

  const handleValueChange = (newValue: number) => {
    setValue(newValue);
    onValueChange(newValue, type);
  };

  const handleIncrement = () => handleValueChange(value + increaseBy);
  const handleDecrement = () => handleValueChange(value - increaseBy);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleValueChange(parseInt(e.target.value, 10) || 0);
  };
  return (
    <div className="pb-2  h-14 text-center inline-block bg-white border border-gray-200 rounded-lg dark:bg-slate-900 dark:border-gray-700" data-hs-input-number>
      <span className='text-gray-300/60 text-xs'>{text}</span>
      <div className="flex items-center justify-between gap-x-1.5" style={{ width: '100%', padding: '0 10%' }}>
        <button onClick={handleDecrement} type="button" className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" data-hs-input-number-decrement>
          <svg className="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /></svg>
        </button>
        <input value={value.toString()} onChange={handleChange} className="p-0 bg-black/60 rounded-md min-w-8 border-0 text-gray-800 text-center focus:ring-0 dark:text-white" type="text" data-hs-input-number-input style={{ width: '60%' }} />
        <button onClick={handleIncrement} type="button" className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" data-hs-input-number-increment>
          <svg className="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
        </button>
      </div>
    </div>
  );
};

export default NumberInput;
