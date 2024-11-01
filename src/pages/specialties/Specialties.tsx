import React, { FC, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Input } from '@shared/ui/Input'

export const Specialties = observer(() => {
    const [specialty, setSpecialty] = useState<string>('')
    const [code, setCode] = useState<string>('')

    return (
        <div className="space-y-6">
            <form action="">
                <Input
                    name='specialty'
                    label='Специальность'
                    value={specialty}
                    type='text'
                    onChange={(e) => setSpecialty(e.target.value)}
                />
                <Input
                    name='code'
                    label='Код'
                    value={code}
                    type='text'
                    onChange={(e) => setCode(e.target.value)}
                />
            </form>
        </div>
    )
})
