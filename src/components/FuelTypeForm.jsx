import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export default function FuelTypeForm({ onSuccess, initialData }) {
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState(true);
    const [isEdit, setIsEdit] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (initialData) {
            setDescription(initialData.descripcion);
            setStatus(initialData.estado);
            setIsEdit(true); 
        }
    }, [initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { data, error: checkError } = await supabase
            .from('tipos_combustible')
            .select('id')
            .eq('descripcion', description)
            .single();

        if (checkError && checkError.code !== 'PGRST116') {
            setError('Error al verificar la existencia del tipo de combustible.');
            console.error(checkError);
            return;
        }

        if (data && (!isEdit || data.id !== initialData.id)) {
            setError('Ya existe un tipo de combustible con esa descripción.');
            return;
        }

        setError('');

        if (isEdit) {

            const { error } = await supabase
                .from('tipos_combustible')
                .update({
                    descripcion: description,
                    estado: status
                })
                .eq('id', initialData.id); 
            if (error) console.error('Error updating fuel type:', error);
        } else {

            const { error } = await supabase
                .from('tipos_combustible')
                .insert([{ descripcion: description, estado: status }]);
            if (error) console.error('Error creating fuel type:', error);
        }

        setDescription('');
        setStatus(true);
        setIsEdit(false);
        onSuccess();
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4">
            <div className="row g-3">
                <div className="col-md-6">
                    <input
                        type="text"
                        placeholder="Descripción"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className={`form-control ${error ? 'is-invalid' : ''}`}
                        required
                    />
                    {error && <div className="invalid-feedback">{error}</div>}
                </div>
                <div className="col-md-6">
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value === 'true')}
                        className="form-control"
                    >
                        <option value={true}>Activo</option>
                        <option value={false}>Inactivo</option>
                    </select>
                </div>
                <div className="col-12">
                    <button type="submit" className="btn btn-primary w-100">
                        {isEdit ? 'Editar Tipo de Combustible' : 'Agregar Tipo de Combustible'}
                    </button>
                </div>
            </div>
        </form>
    );
}
