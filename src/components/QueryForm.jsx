import { useState } from 'react';
import { supabase } from '../services/supabase';

export default function QueryForm({ onSearch }) {
    const [clientId, setClientId] = useState('');
    const [date, setDate] = useState('');
    const [vehicleId, setVehicleId] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        onSearch({ clientId, date, vehicleId });
    };

    return (
        <form onSubmit={handleSearch}>
            <input
                type="text"
                placeholder="ID del cliente"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
            />
            <input
                type="date"
                placeholder="Fecha"
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />
            <input
                type="text"
                placeholder="ID del vehículo"
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value)}
            />
            <button type="submit">Buscar</button>
        </form>
    );
}