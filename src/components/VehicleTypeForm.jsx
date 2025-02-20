import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export default function VehicleTypeForm({ onSuccess, initialData }) {
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState(true);
    const [id, setId] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (initialData) {
            setDescription(initialData.descripcion);
            setStatus(initialData.estado);
            setId(initialData.id);
        } else {
            setDescription('');
            setStatus(true);
            setId(null);
        }
    }, [initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!id) {
            const { data, error: checkError } = await supabase
                .from('tipos_vehiculos')
                .select('id')
                .eq('descripcion', description)
                .single();

            if (checkError && checkError.code !== 'PGRST116') {
                setError('Error al verificar la existencia del tipo de vehículo.');
                console.error(checkError);
                return;
            }

            if (data) {
                setError('Ya existe un tipo de vehículo con esa descripción.');
                return;
            }

            setError('');
        } else {
            const { data, error: checkError } = await supabase
                .from('tipos_vehiculos')
                .select('id')
                .eq('descripcion', description)
                .neq('id', id)
                .single();

            if (checkError && checkError.code !== 'PGRST116') {
                setError('Error al verificar la existencia del tipo de vehículo.');
                console.error(checkError);
                return;
            }

            if (data) {
                setError('Ya existe un tipo de vehículo con esa descripción.');
                return;
            }

            setError(''); 
        }

        if (id) {
            const { error } = await supabase
                .from('tipos_vehiculos')
                .update({ descripcion: description, estado: status })
                .eq('id', id);
            if (error) {
                console.error('Error updating vehicle type:', error);
            }
        } else {
            const { error } = await supabase
                .from('tipos_vehiculos')
                .insert([{ descripcion: description, estado: status }]);
            if (error) {
                console.error('Error creating vehicle type:', error);
            }
        }

        setDescription('');
        setStatus(true);
        setId(null);
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
                        {id ? 'Actualizar' : 'Agregar'} Tipo de Vehículo
                    </button>
                </div>
            </div>
        </form>
    );
}
