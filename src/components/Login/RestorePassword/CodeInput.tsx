import React, { useState, useRef, useEffect } from 'react';
import "./CodeInput.css";

interface CodeInputProps {
    length?: number;
    onComplete: (code: string) => void;
}

const CodeInput: React.FC<CodeInputProps> = ({ length = 6, onComplete }) => {
    const [code, setCode] = useState<string[]>(Array(length).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    // Фокус на первое поле при монтировании
    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        index: number
    ) => {
        const { value } = e.target;

        if (value.length > 1) return; // Защита от ввода более одной цифры

        setCode(prev=>(prev.map((digit, i) => (i === index ? value : digit))));
        // Переход к следующему полю
        if (value && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }

        
    };

    useEffect(() => {
        if (code.join('').length === length) {
            onComplete(code.join(''));
        }
    }, [code]);

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        index: number
    ) => {
        // Удаление и переход назад
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };
    return (
        <div className="codeInputContainer">
            {code.map((digit, index) => (
                <React.Fragment key={index}>
                    <input
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        className="codeInputBox"
                        pattern="\d*"
                    />
                    {index === 2 && <span className="codeInputDivider"></span>}
                </React.Fragment>
            ))}
        </div>
    );
};

export default CodeInput;