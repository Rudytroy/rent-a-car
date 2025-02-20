import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import VehicleTypeForm from '../components/VehicleTypeForm';
import Navbar from '../components/Navbar';

export default function VehicleTypes() {
    const [vehicleTypes, setVehicleTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingVehicleType, setEditingVehicleType] = useState(null);

    useEffect(() => {
        fetchVehicleTypes();
    }, []);

    const fetchVehicleTypes = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('tipos_vehiculos').select('*');
        if (error) console.error('Error fetching vehicle types:', error);
        else setVehicleTypes(data);
        setLoading(false);
    };

    const handleDelete = async (id) => {
        const { error } = await supabase.from('tipos_vehiculos').delete().eq('id', id);
        if (error) console.error('Error deleting vehicle type:', error);
        else fetchVehicleTypes();
    };

    const handleEdit = (vehicleType) => {
        setEditingVehicleType(vehicleType);
    };

    const handleSuccess = () => {
        setEditingVehicleType(null);
        fetchVehicleTypes();
    };

    if (loading) return <p className="text-center mt-4">Cargando tipos de vehículos...</p>;

    return (
        <div className="container mt-4">
            <Navbar />
            <h1 className="text-center mb-4">Tipos de Vehículos</h1>
            <VehicleTypeForm onSuccess={handleSuccess} initialData={editingVehicleType} />
            <ul className="list-group">
                {vehicleTypes.map((vehicleType) => (
                    <li key={vehicleType.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <p className="fw-bold">{vehicleType.descripcion}</p>
                            <p className="text-muted">Estado: {vehicleType.estado ? 'Activo' : 'Inactivo'}</p>
                        </div>
                        <div>
                            <button
                                onClick={() => handleEdit(vehicleType)}
                                className="btn btn-warning btn-sm me-2"
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => handleDelete(vehicleType.id)}
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
