import { FC } from 'react'
import { Radio } from '@headlessui/react'
import { CheckIcon } from 'lucide-react'

interface RadioProps {
    value: string | number | boolean
    item: string | number
    disabled?: boolean
}

export const RadioItem: FC<RadioProps> = ({ value, item, disabled = false}) => {
    return (
        <Radio
            value={!disabled && value}
            className={`group relative flex cursor-pointer rounded-lg bg-white/5 py-2 px-5 shadow-md transition data-[checked]:bg-white/10 ${disabled && 'bg-gray-400'}`}
            disabled={disabled}
        >
            <div className="flex w-full items-center justify-between">
                <div className="text-sm">
                    <p className="font-semibold">{item}</p>
                </div>
                <CheckIcon className="size-6 opacity-0 transition group-data-[checked]:opacity-100 " />
            </div>
        </Radio>
    )
}
