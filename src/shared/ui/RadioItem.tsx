import { FC } from 'react'
import { Radio } from '@headlessui/react'
import { CheckIcon } from 'lucide-react'

interface RadioProps {
    value: string | number | boolean
    item: string | number
}

export const RadioItem: FC<RadioProps> = ({ value, item }) => {
    return (
        <Radio
            value={value}
            className="group relative flex cursor-pointer rounded-lg bg-white/5 py-2 px-5 shadow-md transition data-[checked]:bg-white/10"
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
