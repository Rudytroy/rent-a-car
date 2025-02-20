import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import ClientForm from '../components/ClientForm';
import Navbar from '../components/Navbar';

export default function Clients() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [clientToEdit, setClientToEdit] = useState(null);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        const { data, error } = await supabase.from('clientes').select('*');
        if (error) console.error('Error fetching clients:', error);
        else setClients(data);
        setLoading(false);
    };

    const handleDelete = async (id) => {
        const { error } = await supabase.from('clientes').delete().eq('id', id);
        if (error) console.error('Error deleting client:', error);
        else fetchClients();
    };

    const handleEdit = (client) => {
        setClientToEdit(client);
    };

    if (loading) return <p className="text-center mt-4">Cargando clientes...</p>;

    return (
        <div className="container mt-4">
            <Navbar />
            <h1 className="text-center mb-4">Clientes</h1>
            <ClientForm 
                onSuccess={fetchClients} 
                clientToEdit={clientToEdit} 
                setClientToEdit={setClientToEdit} 
            />
            <ul className="list-group">
                {clients.map((client) => (
                    <li key={client.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <p className="fw-bold">{client.nombre}</p>
                            <p className="text-muted">Cédula: {client.cedula}</p>
                            <p className="text-muted">Tarjeta CR: {client.no_tarjeta}</p>
                            <p className="text-muted">Límite de Crédito: {client.limite_credito}</p>
                            <p className="text-muted">Tipo Persona: {client.tipo_persona}</p>
                            <p className="text-muted">Estado: {client.estado ? "Activo" : "Inactivo"}</p>
                        </div>
                        <div className="d-flex">
                            <button
                                onClick={() => handleEdit(client)}
                                className="btn btn-warning btn-sm me-2"
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => handleDelete(client.id)}
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
