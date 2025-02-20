import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export default function BrandForm({ onSuccess, initialData }) {
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (initialData) {
            setDescription(initialData.descripcion);
            setStatus(initialData.estado);
        } else {
            setDescription('');
            setStatus(true);
        }
    }, [initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (initialData) {
            const { data, error: checkError } = await supabase
                .from('marcas')
                .select('id')
                .eq('descripcion', description)
                .neq('id', initialData.id) 
                .single();

            if (checkError && checkError.code !== 'PGRST116') {
                setError('Error al verificar la existencia de la marca.');
                console.error(checkError);
                return;
            }

            if (data) {
                setError('Ya existe una marca con esa descripción.');
                return;
            }

            setError(''); 

            const { error } = await supabase
                .from('marcas')
                .update({ descripcion: description, estado: status })
                .eq('id', initialData.id);
            if (error) console.error('Error updating brand:', error);

        } else {
            const { data, error: checkError } = await supabase
                .from('marcas')
                .select('id')
                .eq('descripcion', description)
                .single();

            if (checkError && checkError.code !== 'PGRST116') {
                setError('Error al verificar la existencia de la marca.');
                console.error(checkError);
                return;
            }

            if (data) {
                setError('Ya existe una marca con esa descripción.');
                return;
            }

            setError(''); 

            const { error } = await supabase
                .from('marcas')
                .insert([{ descripcion: description, estado: status }]);
            if (error) console.error('Error creating brand:', error);
        }

        setDescription('');
        setStatus(true);
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
                        {initialData ? 'Actualizar Marca' : 'Agregar Marca'}
                    </button>
                </div>
            </div>
        </form>
    );
}
