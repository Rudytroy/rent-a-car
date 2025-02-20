import { useState } from 'react';
import { supabase } from '../services/supabase';

export default function Queries() {
    const [results, setResults] = useState([]);
    const [criteria, setCriteria] = useState({ cliente_id: '', fecha: '', vehiculo_id: '' });

    const handleSearch = async () => {
        let query = supabase.from('rentas').select('*');

        if (criteria.cliente_id) query = query.eq('cliente_id', criteria.cliente_id);
        if (criteria.fecha) query = query.eq('fecha_renta', criteria.fecha);
        if (criteria.vehiculo_id) query = query.eq('vehiculo_id', criteria.vehiculo_id);

        const { data, error } = await query;
        if (error) console.error('Error fetching rentals:', error);
        else setResults(data);
    };

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">Consultas</h1>
            <div className="row g-3 mb-4">
                <div className="col-md-4">
                    <input
                        type="text"
                        placeholder="ID del Cliente"
                        value={criteria.cliente_id}
                        onChange={(e) => setCriteria({ ...criteria, cliente_id: e.target.value })}
                        className="form-control"
                    />
                </div>
                <div className="col-md-4">
                    <input
                        type="date"
                        placeholder="Fecha"
                        value={criteria.fecha}
                        onChange={(e) => setCriteria({ ...criteria, fecha: e.target.value })}
                        className="form-control"
                    />
                </div>
                <div className="col-md-4">
                    <input
                        type="text"
                        placeholder="ID del Vehículo"
                        value={criteria.vehiculo_id}
                        onChange={(e) => setCriteria({ ...criteria, vehiculo_id: e.target.value })}
                        className="form-control"
                    />
                </div>
                <div className="col-12">
                    <button
                        onClick={handleSearch}
                        className="btn btn-primary w-100"
                    >
                        Buscar
                    </button>
                </div>
            </div>
            <ul className="list-group">
                {results.map((rental) => (
                    <li key={rental.id} className="list-group-item">
                        <div>
                            <p className="fw-bold">Renta #{rental.id}</p>
                            <p className="text-muted">Cliente: {rental.cliente_id}</p>
                            <p className="text-muted">Vehículo: {rental.vehiculo_id}</p>
                            <p className="text-muted">Fecha: {rental.fecha_renta}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}