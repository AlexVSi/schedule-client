import React, { useState } from "react";

interface DropdownProps {
    title?: string;
    children: React.ReactNode;
}

const Dropdown: React.FC<DropdownProps> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="">
            <div
                onClick={toggleDropdown}
                className="cursor-pointer flex justify-center items-center gap-1"
            >
                <span>{title}</span>
                <span>{isOpen ? "▲" : "▼"}</span>
            </div>

            {isOpen && (
                <div>
                    {children}
                </div>
            )}
        </div>
    );
};

export default Dropdown;