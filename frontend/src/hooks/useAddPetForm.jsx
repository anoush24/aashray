import { useState } from "react";
import api from "../services/api";

export const useAddPetForm = (onSuccess,onClose) => {
    const [formData,setFormData] = useState({
        name: '',
        category: '',
        breed: '',
        age: '',
        gender: '',
        weight: '',

    });

    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');


    const handleChange = (e) => {
        const {name,value} = e.target 
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleCategorySelect = (category) => {
        setFormData(prev => ({...prev,category}))
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if(file) {
            setImageFile(file)
            setPreviewUrl(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async() => {

        if (!formData.name) {
            setError('Pet name is required');
            return;
        }
        if (!formData.category) {
            setError('Please select a category (Dog, Cat, etc.)');
            return;
        }
        setLoading(true);
        setError('');

        try {
            const data = new FormData();

            data.append('name', formData.name);
            data.append('species', formData.category);
            if (formData.breed) data.append('breed', formData.breed);
            if (formData.age) data.append('age', formData.age);
            if (formData.gender) data.append('gender', formData.gender);
            if (formData.weight) data.append('weight', formData.weight);
            if(imageFile) {
                data.append('image',imageFile)
            }

            const token = localStorage.getItem('token');
            const response = await api.post('/pets/add-my-pet',data,{
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': undefined
                }
            })

            if(response.data.success) {
                onSuccess(response.data.pet);
                onClose();
            }
        }
        catch(err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to add pet. Please try again.')
        }
        finally {
            setLoading(false)
        }
    }

    return {
        formData,
        previewUrl,
        loading,
        error,
        handleChange,
        handleCategorySelect,
        handleImageChange,
        handleSubmit
    };
}