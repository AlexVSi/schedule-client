import React, { FC, useContext } from 'react'
import { Button } from '@shared/ui/Button'
import { Pencil, Trash2 } from 'lucide-react'
import { Context } from 'main'
import { observer } from 'mobx-react-lite'

interface CardProps {
    children?: React.ReactNode
    onCLick?: (e?) => void
    onClickEdit?: (e?) => void
    onClickDelete?: (e?) => void
    title?: string
    subTitle?: string
    cardText?: string[]
}

export const Card: FC<CardProps> = observer(({ children, onCLick, onClickEdit, onClickDelete, title, cardText, subTitle }) => {
    const { authStore } = useContext(Context)
    return (
        <div
            className="text-sm bg-white shadow-sm rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
            onClick={onCLick}
        >
            <div className="font-medium text-gray-900 flex items-center justify-between">
                {title}
                <div className='flex flex-nowrap items-center'>
                    {authStore.isAuth &&
                        <>
                            <Button
                                variant="ghost"
                                size="vsm"
                                onClick={onClickEdit}
                            >
                                <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="vsm"
                                onClick={onClickDelete}
                            >
                                <Trash2 className='trash' />
                            </Button>
                        </>
                    }
                </div>
            </div>
            <div className="text-m text-gray-500">{subTitle}</div>
            {cardText?.map((t, item) => {
                return <div key={item} className="text-sm text-gray-500">{t}</div>
            })}
            {children}
        </div>
    )
})
