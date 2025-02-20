import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import VehicleForm from "../components/VehicleForm";
import Navbar from "../components/Navbar";

export default function Vehicles() {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [vehicleToEdit, setVehicleToEdit] = useState(null); 

    useEffect(() => {
        fetchVehicles();
    }, []);

    const fetchVehicles = async () => {
        const { data, error } = await supabase
            .from("vehiculos")
            .select("*, tipos_vehiculos(descripcion), marcas(descripcion), modelos(descripcion), tipos_combustible(descripcion)")
            .order("descripcion", { ascending: true });

        if (error) {
            console.error("Error fetching vehicles:", error);
        } else {
            setVehicles(data);
        }

        setLoading(false);
    };

    const handleDelete = async (id) => {
        const { error } = await supabase.from("vehiculos").delete().eq("id", id);
        if (error) console.error("Error deleting vehicle:", error);
        else fetchVehicles();
    };

    const handleEdit = (vehicle) => {
        setVehicleToEdit(vehicle);
    };

    if (loading) return <p className="text-center mt-4">Cargando vehículos...</p>;

    return (
        <div className="container mt-4">
            <Navbar />
            <h1 className="text-center mb-4">Vehículos</h1>
            <VehicleForm
                onSuccess={fetchVehicles}
                vehicleToEdit={vehicleToEdit} 
                setVehicleToEdit={setVehicleToEdit} 
            />
            <ul className="list-group">
                {vehicles.map((vehicle) => (
                    <li key={vehicle.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <p className="fw-bold">{vehicle.descripcion}</p>
                            <p className="text-muted">Chasis: {vehicle.no_chasis}</p>
                            <p className="text-muted">Motor: {vehicle.no_motor}</p>
                            <p className="text-muted">Placa: {vehicle.no_placa}</p>
                            <p className="text-muted">Tipo de Vehículo: {vehicle.tipos_vehiculos?.descripcion}</p>
                            <p className="text-muted">Marca: {vehicle.marcas?.descripcion}</p>
                            <p className="text-muted">Modelo: {vehicle.modelos?.descripcion}</p>
                            <p className="text-muted">Tipo de Combustible: {vehicle.tipos_combustible?.descripcion}</p>
                            <p className="text-muted">Estado: {vehicle.estado ? "Activo" : "Inactivo"}</p>
                        </div>
                        <div>
                            <button
                                onClick={() => handleEdit(vehicle)}
                                className="btn btn-warning btn-sm me-2"
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => handleDelete(vehicle.id)}
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
