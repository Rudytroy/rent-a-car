import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import InspectionForm from '../components/InspectionForm';
import Navbar from '../components/Navbar';

export default function Inspections() {
    const [inspections, setInspections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingInspection, setEditingInspection] = useState(null);

    useEffect(() => {
        fetchInspections();
    }, []);

    const fetchInspections = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('inspecciones')
            .select('id, vehiculo_id, cliente_id, empleado_id, fecha, estado, tiene_ralladuras, cantidad_combustible, tiene_goma_repuesto, tiene_gato, tiene_roturas_cristal')
            .eq('estado', true); 

        if (error) {
            console.error('Error fetching inspections:', error);
        } else {
            const inspectionsWithDetails = await Promise.all(
                data.map(async (inspection) => {
                    const vehiculo = await supabase
                        .from('vehiculos')
                        .select('descripcion')
                        .eq('id', inspection.vehiculo_id)
                        .single();

                    const cliente = await supabase
                        .from('clientes')
                        .select('nombre')
                        .eq('id', inspection.cliente_id)
                        .single();

                    const empleado = await supabase
                        .from('empleados')
                        .select('nombre')
                        .eq('id', inspection.empleado_id)
                        .single();

                    const formattedDate = new Date(inspection.fecha).toLocaleDateString();

                    return {
                        ...inspection,
                        vehiculoDescripcion: vehiculo.data?.descripcion,
                        clienteNombre: cliente.data?.nombre,
                        empleadoNombre: empleado.data?.nombre,
                        formattedDate,
                    };
                })
            );

            setInspections(inspectionsWithDetails);
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        const { error } = await supabase.from('inspecciones').delete().eq('id', id);
        if (error) console.error('Error deleting inspection:', error);
        else fetchInspections();
    };

    const handleEdit = (inspection) => {
        setEditingInspection(inspection);
    };

    const handleSuccess = () => {
        setEditingInspection(null);
        fetchInspections();
    };

    if (loading) return <p className="text-center mt-4">Cargando inspecciones...</p>;

    return (
        <div className="container mt-4">
            <Navbar />
            <h1 className="text-center mb-4">Inspecciones</h1>
            <InspectionForm onSuccess={handleSuccess} initialData={editingInspection} />
            <ul className="list-group">
                {inspections.map((inspection) => (
                    <li key={inspection.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <p className="fw-bold">Vehículo: {inspection.vehiculoDescripcion}</p>
                            <p className="fw-bold">Cliente: {inspection.clienteNombre}</p>
                            <p className="fw-bold">Empleado: {inspection.empleadoNombre}</p>
                            <p className="text-muted">Fecha: {inspection.formattedDate}</p>
                            <p className="text-muted">Estado: {inspection.estado ? 'Activo' : 'Inactivo'}</p>
                            
                            {/* Mostrar los campos adicionales */}
                            <p className="text-muted">Ralladuras: {inspection.tiene_ralladuras ? 'Sí' : 'No'}</p>
                            <p className="text-muted">Cantidad de combustible: {inspection.cantidad_combustible ? 'Sí' : 'No'}</p>
                            <p className="text-muted">Goma de repuesto: {inspection.tiene_goma_repuesto ? 'Sí' : 'No'}</p>
                            <p className="text-muted">Gato: {inspection.tiene_gato ? 'Sí' : 'No'}</p>
                            <p className="text-muted">Cristal roto: {inspection.tiene_roturas_cristal ? 'Sí' : 'No'}</p>
                        </div>
                        <div>
                            <button
                                onClick={() => handleEdit(inspection)}
                                className="btn btn-warning btn-sm me-2"
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => handleDelete(inspection.id)}
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
