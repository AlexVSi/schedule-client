import React, { useState } from 'react';

interface RadioOption {
    label: string;
    value: string;
}

interface RadioGroupProps {
    options: RadioOption[];
    name: string;
    selectedValue?: string;
    onChange: (value: string) => void;
}

const RadioGroup: React.FC<RadioGroupProps> = ({ options, name, selectedValue, onChange }) => {
    const [selected, setSelected] = useState(selectedValue || '');

    const handleChange = (value: string) => {
        setSelected(value);
        onChange(value);
    };

    return (
        <div className="space-y-4">
            {options.map((option) => (
                <label
                    key={option.value}
                    className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer 
            ${selected === option.value ? 'bg-blue-100 border-blue-500' : 'bg-gray-100 border-gray-300'} 
            border hover:shadow-md`}
                >
                    <input
                        type="radio"
                        name={name}
                        value={option.value}
                        checked={selected === option.value}
                        onChange={() => handleChange(option.value)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{option.label}</span>
                </label>
            ))}
        </div>
    );
};

export default RadioGroup;