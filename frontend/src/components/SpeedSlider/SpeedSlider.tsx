import { useState, ChangeEvent } from 'react';
import './SpeedSlider.css'

interface SpeedSliderProps {
  onSpeedChange: (value: number) => void;
  value: number
}

const SpeedSlider = ({ value, onSpeedChange }: SpeedSliderProps) => {

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value);
    onSpeedChange(newValue);
  };

  return (
    <div className="w-full">
      <label htmlFor="speed-slider" className="slider-label">Speed</label>
      <div className="slider-container">
        <input type="range" id="speed-slider" min="1" max="5"
          value={value}
          onChange={handleChange}
          className="slider" />
        <div className="slider-marks">
          <span>1x</span>
          <span>2x</span>
          <span>3x</span>
          <span>4x</span>
          <span>5x</span>
        </div>
      </div>

    </div>
  );
};

export default SpeedSlider;
