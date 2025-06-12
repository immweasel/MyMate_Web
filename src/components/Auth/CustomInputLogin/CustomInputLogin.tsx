import React, { ChangeEvent } from "react";
import { InputProps } from "./InputProps";
import "./CustomInputLogin.css";

const CustomInputLogin: React.FC<InputProps> = ({
  label,
  type,
  value,
  placeholder,
  onChange,
}) => {
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className="input-group">
      <label>{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={handleInputChange}
        className="custom-input"
      />
    </div>
  );
};

export default CustomInputLogin;
