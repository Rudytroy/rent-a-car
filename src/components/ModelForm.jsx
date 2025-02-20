import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export default function ModelForm({ onSuccess, initialData }) {
    const [description, setDescription] = useState('');
    const [brandId, setBrandId] = useState('');
    const [status, setStatus] = useState(true);
    const [isEdit, setIsEdit] = useState(false);
    const [brands, setBrands] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchBrands();

        if (initialData) {
            setDescription(initialData.descripcion);
            setBrandId(initialData.marca_id);
            setStatus(initialData.estado);
            setIsEdit(true);
        } else {
            setDescription('');
            setBrandId('');
            setStatus(true);
            setIsEdit(false);
        }
    }, [initialData]);

    const fetchBrands = async () => {
        const { data, error } = await supabase
            .from('marcas')
            .select('id, descripcion')
            .eq('estado', true);
        if (error) console.error('Error fetching brands:', error);
        else setBrands(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { data, error: checkError } = await supabase
            .from('modelos')
            .select('id')
            .eq('descripcion', description)
            .eq('marca_id', brandId)
            .single();

        if (checkError && checkError.code !== 'PGRST116') {
            setError('Error al verificar la existencia del modelo.');
            console.error(checkError);
            return;
        }

        if (data && (!isEdit || data.id !== initialData.id)) {
            setError('Ya existe un modelo con esa descripción y marca.');
            return;
        }

        setError('');

        if (isEdit) {

            const { error } = await supabase
                .from('modelos')
                .update({
                    descripcion: description,
                    marca_id: brandId,
                    estado: status,
                })
                .eq('id', initialData.id); 

            if (error) console.error('Error updating model:', error);
        } else {

            const { error } = await supabase
                .from('modelos')
                .insert([{ descripcion: description, marca_id: brandId, estado: status }]);

            if (error) console.error('Error creating model:', error);
        }

        setDescription('');
        setBrandId('');
        setStatus(true);
        setIsEdit(false); 
        onSuccess(); 
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4">
            <div className="row g-3">
                <div className="col-md-4">
                    <select
                        value={brandId}
                        onChange={(e) => setBrandId(e.target.value)}
                        className={`form-control ${error ? 'is-invalid' : ''}`}
                        required
                    >
                        <option value="">Seleccione una marca</option>
                        {brands.map((brand) => (
                            <option key={brand.id} value={brand.id}>
                                {brand.descripcion}
                            </option>
                        ))}
                    </select>
                    {error && <div className="invalid-feedback">{error}</div>}
                </div>
                <div className="col-md-4">
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
                <div className="col-md-4">
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
                        {isEdit ? 'Editar Modelo' : 'Agregar Modelo'}
                    </button>
                </div>
            </div>
        </form>
    );
}
