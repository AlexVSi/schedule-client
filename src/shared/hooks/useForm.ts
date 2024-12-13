import React, { useEffect, useState } from "react";

export const useForm = (
    initialData: object,
    update: (editId: string, initiaData: Object) => void,
    add: (formData: Omit<any, 'id'>) => void,
    editId: string | null = null,
) => {
    const [formData, setFormData] = useState(initialData)

    useEffect(() => {
        if (editId) {
            setFormData(initialData)
        }
    }, [])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editId) {
            setFormData(initialData);
            update(editId, initialData);
        } else {
            add(initialData);
            setFormData({})
        }
        // closeModal(false)
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value
        })
    }

    return { formData, handleSubmit, handleChange }
}