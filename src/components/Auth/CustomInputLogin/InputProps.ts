export interface InputProps {
  label?: string;
  type: "text" | "email" | "password"; 
  value: string;
  placeholder?: string; 
  onChange: (value: string) => void; 
}
