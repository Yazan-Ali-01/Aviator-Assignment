import React from 'react';

interface NumberInputProps {
  label: string;
  value: number; // Use direct value for simplicity
  onChange: (newValue: number) => void; // Direct call with new value
  step: number; // Added step prop to handle different increments
}

const NumberInput: React.FC<NumberInputProps> = ({ label, value, onChange, step }) => {
  // Increment and decrement using the step value
  const handleIncrement = () => onChange(value + step);
  const handleDecrement = () => onChange(value - step > 0 ? value - step : 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value); // Use parseFloat to handle decimal places for guesses
    if (!isNaN(newValue)) onChange(newValue);
  };

  return (
    <div className="pb-2 h-14 text-center inline-block bg-white border border-gray-200 rounded-lg dark:bg-slate-900 dark:border-gray-700" data-hs-input-number>
      <span className='text-gray-300/60 text-xs'>{label}</span>
      <div className="flex items-center justify-between gap-x-1.5" style={{ width: '100%', padding: '0 10%' }}>
        <button onClick={handleDecrement} type="button" className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" data-hs-input-number-decrement>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
          </svg>

        </button>
        <input value={value.toString()} onChange={handleChange} className="p-0 bg-black/60 rounded-md min-w-8 border-0 text-gray-800 text-center focus:ring-0 dark:text-white" type="text" data-hs-input-number-input style={{ width: '60%' }} />
        <button onClick={handleIncrement} type="button" className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" data-hs-input-number-increment>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>

        </button>
      </div>
    </div>
  );
};

export default NumberInput;
