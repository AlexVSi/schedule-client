import { Button } from '@shared/ui/Button';
import React, { FC } from 'react'

interface ConfirmActionProps {
    onClickConfirm: () => void;
    onClickCancle: () => void;
}

export const ConfirmAction: FC<ConfirmActionProps> = ({ onClickConfirm, onClickCancle }) => {
    return (
        <div className='flex justify-between gap-4'>
            <Button
                type="submit"
                className="flex-1"
                onClick={onClickConfirm}
            >
                Подтвердить
            </Button>

            <Button
                type="reset"
                variant="secondary"
                className="flex-1"
                onClick={onClickCancle}
            >
                Отмена
            </Button>
        </div>
    )
}
