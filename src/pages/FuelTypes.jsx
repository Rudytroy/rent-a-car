import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import FuelTypeForm from '../components/FuelTypeForm';
import Navbar from '../components/Navbar';

export default function FuelTypes() {
    const [fuelTypes, setFuelTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFuelType, setSelectedFuelType] = useState(null);

    useEffect(() => {
        fetchFuelTypes();
    }, []);

    const fetchFuelTypes = async () => {
        const { data, error } = await supabase.from('tipos_combustible').select('*');
        if (error) console.error('Error fetching fuel types:', error);
        else setFuelTypes(data);
        setLoading(false);
    };

    const handleDelete = async (id) => {
        const { error } = await supabase.from('tipos_combustible').delete().eq('id', id);
        if (error) console.error('Error deleting fuel type:', error);
        else fetchFuelTypes();
    };

    const handleEdit = (fuelType) => {
        setSelectedFuelType(fuelType);
    };

    if (loading) return <p className="text-center mt-4">Cargando tipos de combustible...</p>;

    return (
        <div className="container mt-4">
            <Navbar />
            <h1 className="text-center mb-4">Tipos de Combustible</h1>
            <FuelTypeForm onSuccess={fetchFuelTypes} initialData={selectedFuelType} />
            <ul className="list-group">
                {fuelTypes.map((fuelType) => (
                    <li key={fuelType.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <p className="fw-bold">{fuelType.descripcion}</p>
                            <p className="text-muted">Estado: {fuelType.estado ? 'Activo' : 'Inactivo'}</p>
                        </div>
                        <div>
                            <button
                                onClick={() => handleEdit(fuelType)}
                                className="btn btn-warning btn-sm me-2"
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => handleDelete(fuelType.id)}
                                className="btn btn-danger btn-sm"
                            >
                                Eliminar
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}