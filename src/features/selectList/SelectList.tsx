import React, { useEffect, useState } from "react";

interface ListItem {
    id: number;
    itemLabel: string;
};

type SelectMode = "single" | "multiple";

interface SelectListProps {
    label: string;
    items: ListItem[];
    mode?: SelectMode;
    onSelectionChange?: (selectedItems: ListItem[]) => void;
    defaultListItems?: ListItem[];
    search?: boolean
}

export const SelectList: React.FC<SelectListProps> = ({ label, items, mode = "single", onSelectionChange, defaultListItems, search = false }) => {
    const [selectedItems, setSelectedItems] = useState<ListItem[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");

    useEffect(() => {
        if (defaultListItems) {
            setSelectedItems(defaultListItems);
        }
      }, []);

    const handleItemClick = (item: ListItem) => {
        let updatedSelection: ListItem[];

        if (mode === "single") {
            updatedSelection = [item];
        } else {
            const isAlreadySelected = selectedItems.some((selected) => selected.id === item.id);
            updatedSelection = isAlreadySelected
                ? selectedItems.filter((selected) => selected.id !== item.id)
                : [...selectedItems, item];
        }

        setSelectedItems(updatedSelection);
        if (onSelectionChange) {
            onSelectionChange(updatedSelection);
        }
    };

    const isSelected = (item: ListItem) => selectedItems.some((selected) => selected.id === item.id);

    const filteredItems = items.filter((item) =>
        item.itemLabel.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-full">
            <span className="block text-l font-medium text-gray-700 mb-1">{label}</span>
            {/* Поисковая строка */}
            {search &&
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Поиск..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>}

            {/* Прокручиваемый список */}
            <ul className="max-h-72 overflow-y-auto space-y-2">
                {filteredItems.map((item) => (
                    <li
                        key={item.id}
                        className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer border transition 
                            ${isSelected(item)
                                ? "bg-blue-100 border-blue-500 text-blue-800"
                                : "bg-white border-gray-300 hover:bg-gray-100 text-gray-800"
                            }`}
                        onClick={() => handleItemClick(item)}
                    >
                        <input
                            type="checkbox"
                            checked={isSelected(item)}
                            onChange={() => handleItemClick(item)}
                            className="w-4 h-4 accent-blue-500 cursor-pointer"
                        />
                        <span className="font-medium">{item.itemLabel}</span>
                    </li>
                ))}
                {filteredItems.length === 0 && (
                    <li className="text-gray-500 text-center">Не найдено</li>
                )}
            </ul>
        </div>
    );
};
