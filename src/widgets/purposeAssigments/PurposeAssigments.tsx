import { FC } from 'react'
import { IAcademicSubject, IScheduleConflict, ITimeSlot } from '@app/types/types'
import { AcademicSubject } from '@entities/academicSubject/ui/AcademicSubject'
import { CardList } from '@features/cardList/CardList'

interface PurposeAssigmentsProps {
    selectedTimeSlot: ITimeSlot
    accessiblAcademicSubject: IAcademicSubject[]
    notAccessiblAcademicSubject: IAcademicSubject[]
    notAccessReasonList: IScheduleConflict[]
}

export const PurposeAssigments: FC<PurposeAssigmentsProps> = ({ selectedTimeSlot, accessiblAcademicSubject, notAccessiblAcademicSubject, notAccessReasonList }) => {

    return (
        <>
            <h2 className='text-xl mt-3 mb-7'>Доступные пары</h2>
            <CardList
                search={false}
            >
                {accessiblAcademicSubject.map((academicSubject) => {
                    return (
                        <AcademicSubject
                            key={academicSubject.id}
                            academicSubject={academicSubject}
                            openPurposeForm={true}
                            timeSlot={selectedTimeSlot}
                        />)
                    }
                )}
            </CardList>
            <h2 className='text-xl mt-3 mb-7'>Недоступные пары</h2>
            <CardList
                search={false}
            >
                {notAccessiblAcademicSubject.map((academicSubject) => {
                    return (
                        <div
                            key={academicSubject.id}
                        >
                            {notAccessReasonList.filter(r => r.academicSubjectId === academicSubject.id)
                                .map((reason, index) => (<p key={index}>{reason.message}</p>))
                                }
                            <AcademicSubject
                                academicSubject={academicSubject}
                                openPurposeForm={true}
                                timeSlot={selectedTimeSlot}
                            />
                        </div>
                    )
                }
                )}
            </CardList>
        </>
    )
}
