import { useState } from 'react';
import { supabase } from '../services/supabase';

export default function Reports() {
    const [results, setResults] = useState([]);
    const [criteria, setCriteria] = useState({ fecha_inicio: '', fecha_fin: '', tipo_vehiculo_id: '' });

    const handleGenerateReport = async () => {
        let query = supabase.from('rentas').select('*');

        if (criteria.fecha_inicio && criteria.fecha_fin) {
            query = query.gte('fecha_renta', criteria.fecha_inicio).lte('fecha_renta', criteria.fecha_fin);
        }
        if (criteria.tipo_vehiculo_id) {
            query = query.eq('vehiculo_id', criteria.tipo_vehiculo_id);
        }

        const { data, error } = await query;
        if (error) console.error('Error fetching rentals:', error);
        else setResults(data);
    };

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">Reportes</h1>
            <div className="row g-3 mb-4">
                <div className="col-md-4">
                    <input
                        type="date"
                        placeholder="Fecha Inicio"
                        value={criteria.fecha_inicio}
                        onChange={(e) => setCriteria({ ...criteria, fecha_inicio: e.target.value })}
                        className="form-control"
                    />
                </div>
                <div className="col-md-4">
                    <input
                        type="date"
                        placeholder="Fecha Fin"
                        value={criteria.fecha_fin}
                        onChange={(e) => setCriteria({ ...criteria, fecha_fin: e.target.value })}
                        className="form-control"
                    />
                </div>
                <div className="col-md-4">
                    <input
                        type="text"
                        placeholder="ID del Tipo de Vehículo"
                        value={criteria.tipo_vehiculo_id}
                        onChange={(e) => setCriteria({ ...criteria, tipo_vehiculo_id: e.target.value })}
                        className="form-control"
                    />
                </div>
                <div className="col-12">
                    <button
                        onClick={handleGenerateReport}
                        className="btn btn-primary w-100"
                    >
                        Generar Reporte
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