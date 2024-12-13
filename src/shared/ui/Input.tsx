import React, { FC } from 'react'

interface InputProps {
    label?: React.ReactNode
    name: string
    value: string | number
    type: React.InputHTMLAttributes<HTMLInputElement>['type']
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    required?: boolean
    min?: number
    max?: number
    checked?: boolean
}

export const Input: FC<InputProps> = (props) => {
    return (
        <>
            {props.label && <label
                className="block text-l font-medium text-gray-700"
                htmlFor={props.name}
            >
                {props.label}
            </label>}
            <input
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                {...props}
            />
        </>
    )
}
