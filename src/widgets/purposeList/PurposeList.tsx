import { FC, useContext } from 'react'
import { IAccessPurposeType, ITimeSlot } from '@app/types/types'
import { CardList } from '@features/cardList/CardList'
import { PurposeForm } from '@widgets/purposeForm/PurposeForm'
import { Context } from 'main'

interface PurposeListProps {
    selectedTimeSlot: ITimeSlot
    accessiblAcademicSubject: IAccessPurposeType[]
    notAccessiblAcademicSubject: IAccessPurposeType[]
    closeModal: (flag: boolean) => void
}

export const PurposeList: FC<PurposeListProps> = ({
    selectedTimeSlot,
    accessiblAcademicSubject,
    notAccessiblAcademicSubject,
    closeModal
}) => {
    const { academicSubjectStore } = useContext(Context)
    return (
        <>
            <h2 className='text-xl mt-3 mb-7'>Доступные пары</h2>
            <CardList
                search={false}
            >
                {accessiblAcademicSubject.map((assigment) => {
                    return (
                        <PurposeForm
                            key={assigment.academicSubjectId}
                            academicSubject={academicSubjectStore.groupAcademicSubjects.find(a => a.id === assigment.academicSubjectId)!}
                            classrooms={assigment.classrooms}
                            timeSlot={selectedTimeSlot}
                            closeModal={() => closeModal(false)}
                        />)
                    }
                )}
            </CardList>
            <h2 className='text-xl mt-3 mb-7'>Недоступные пары</h2>
            <CardList
                search={false}
            >
                {notAccessiblAcademicSubject.map((assigment) => {
                    return (
                        <PurposeForm
                            key={assigment.academicSubjectId}
                            academicSubject={academicSubjectStore.groupAcademicSubjects.find(a => a.id === assigment.academicSubjectId)!}
                            classrooms={[]}
                            timeSlot={selectedTimeSlot}
                            closeModal={() => closeModal(false)}
                            notAccsessReason={assigment.notAccsessReason}
                        />
                    )}
                )}
            </CardList>
        </>
    )
}
