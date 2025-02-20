import { useState, useEffect } from "react";
import { supabase } from "../services/supabase";

export default function VehicleForm({ onSuccess, vehicleToEdit, setVehicleToEdit }) {
    const [id, setId] = useState(null);
    const [description, setDescription] = useState("");
    const [chassisNumber, setChassisNumber] = useState("");
    const [engineNumber, setEngineNumber] = useState("");
    const [plateNumber, setPlateNumber] = useState("");
    const [vehicleType, setVehicleType] = useState("");
    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [fuelType, setFuelType] = useState("");
    const [status, setStatus] = useState(true);

    const [vehicleTypes, setVehicleTypes] = useState([]);
    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);
    const [fuelTypes, setFuelTypes] = useState([]);

    const [errors, setErrors] = useState({
        chassisNumber: "",
        plateNumber: "",
    });

    useEffect(() => {
        fetchVehicleTypes();
        fetchBrands();
        fetchFuelTypes();
    }, []);

    useEffect(() => {
        if (vehicleToEdit) {
            setId(vehicleToEdit.id);
            setDescription(vehicleToEdit.descripcion);
            setChassisNumber(vehicleToEdit.no_chasis);
            setEngineNumber(vehicleToEdit.no_motor);
            setPlateNumber(vehicleToEdit.no_placa);
            setVehicleType(vehicleToEdit.tipo_id);
            setBrand(vehicleToEdit.marca_id);
            setModel(vehicleToEdit.modelo_id);
            setFuelType(vehicleToEdit.combustible_id);
            setStatus(vehicleToEdit.estado);
        }
    }, [vehicleToEdit]);

    useEffect(() => {
        if (brand) {
            fetchModels(brand);
        } else {
            setModels([]);
        }
    }, [brand]);

    const fetchVehicleTypes = async () => {
        const { data, error } = await supabase.from("tipos_vehiculos").select("*").eq("estado", true);
        if (!error) setVehicleTypes(data);
    };

    const fetchBrands = async () => {
        const { data, error } = await supabase.from("marcas").select("*").eq("estado", true);
        if (!error) setBrands(data);
    };

    const fetchModels = async (brandId) => {
        const { data, error } = await supabase.from("modelos").select("*").eq("marca_id", brandId).eq("estado", true);
        if (!error) setModels(data);
    };

    const fetchFuelTypes = async () => {
        const { data, error } = await supabase.from("tipos_combustible").select("*").eq("estado", true);
        if (!error) setFuelTypes(data);
    };

    const isUniqueValue = async (column, value, excludeId = null) => {
        const query = supabase.from("vehiculos").select(column).eq(column, value);
        if (excludeId) query.not("id", "eq", excludeId); 
        const { data } = await query;
        return data.length === 0;
    };

    const validateChassisNumber = (chassis) => {
        return /^[0-9]{17}$/.test(chassis); 
    };

    const validatePlateNumber = (plate) => {
        return /^[A-Za-z]{1}[0-9]{6}$/.test(plate); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let validationErrors = {};

        if (!vehicleToEdit) {
            const isChassisUnique = await isUniqueValue("no_chasis", chassisNumber);
            const isEngineUnique = await isUniqueValue("no_motor", engineNumber);
            const isPlateUnique = await isUniqueValue("no_placa", plateNumber);

            if (!isChassisUnique || !isEngineUnique || !isPlateUnique) {
                validationErrors.chassisNumber = "El número de chasis, motor o placa ya está registrado.";
            }

            if (!validateChassisNumber(chassisNumber)) {
                validationErrors.chassisNumber = "El número de chasis debe tener 17 dígitos.";
            }

            if (!validatePlateNumber(plateNumber)) {
                validationErrors.plateNumber = "La placa debe tener una letra seguida de 6 números.";
            }
        } else {
            const isChassisUnique = await isUniqueValue("no_chasis", chassisNumber, id);
            const isEngineUnique = await isUniqueValue("no_motor", engineNumber, id);
            const isPlateUnique = await isUniqueValue("no_placa", plateNumber, id);

            if (!isChassisUnique || !isEngineUnique || !isPlateUnique) {
                validationErrors.chassisNumber = "El número de chasis, motor o placa ya está registrado.";
            }

            if (!validateChassisNumber(chassisNumber)) {
                validationErrors.chassisNumber = "El número de chasis debe tener 17 dígitos.";
            }

            if (!validatePlateNumber(plateNumber)) {
                validationErrors.plateNumber = "La placa debe tener una letra seguida de 6 números.";
            }
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const vehicleData = {
            descripcion: description,
            no_chasis: chassisNumber,
            no_motor: engineNumber,
            no_placa: plateNumber,
            tipo_id: vehicleType,
            marca_id: brand,
            modelo_id: model,
            combustible_id: fuelType,
            estado: status,
        };

        if (vehicleToEdit) {
            const { error } = await supabase.from("vehiculos").update(vehicleData).eq("id", id);
            if (!error) {
                resetForm();
                setVehicleToEdit(null);
                onSuccess();
            }
        } else {
            const { error } = await supabase.from("vehiculos").insert([vehicleData]);
            if (!error) {
                resetForm();
                onSuccess();
            }
        }
    };

    const resetForm = () => {
        setId(null);
        setDescription("");
        setChassisNumber("");
        setEngineNumber("");
        setPlateNumber("");
        setVehicleType("");
        setBrand("");
        setModel("");
        setFuelType("");
        setStatus(true);
        setErrors({});
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
                        className="form-control"
                        required
                    />
                </div>
                <div className="col-md-6">
                    <input
                        type="text"
                        placeholder="No. Chasis"
                        value={chassisNumber}
                        onChange={(e) => setChassisNumber(e.target.value)}
                        className={`form-control ${errors.chassisNumber ? 'is-invalid' : ''}`}
                        required
                    />
                    {errors.chassisNumber && <div className="invalid-feedback">{errors.chassisNumber}</div>}
                </div>
                <div className="col-md-6">
                    <input
                        type="text"
                        placeholder="No. Motor"
                        value={engineNumber}
                        onChange={(e) => setEngineNumber(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>
                <div className="col-md-6">
                    <input
                        type="text"
                        placeholder="No. Placa"
                        value={plateNumber}
                        onChange={(e) => setPlateNumber(e.target.value)}
                        className={`form-control ${errors.plateNumber ? 'is-invalid' : ''}`}
                        required
                    />
                    {errors.plateNumber && <div className="invalid-feedback">{errors.plateNumber}</div>}
                </div>
                <div className="col-md-6">
                    <select value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} className="form-control" required>
                        <option value="">Seleccione Tipo de Vehículo</option>
                        {vehicleTypes.map((type) => <option key={type.id} value={type.id}>{type.descripcion}</option>)}
                    </select>
                </div>
                <div className="col-md-6">
                    <select value={brand} onChange={(e) => setBrand(e.target.value)} className="form-control" required>
                        <option value="">Seleccione Marca</option>
                        {brands.map((brand) => <option key={brand.id} value={brand.id}>{brand.descripcion}</option>)}
                    </select>
                </div>
                <div className="col-md-6">
                    <select value={model} onChange={(e) => setModel(e.target.value)} className="form-control" required>
                        <option value="">Seleccione Modelo</option>
                        {models.map((model) => <option key={model.id} value={model.id}>{model.descripcion}</option>)}
                    </select>
                </div>
                <div className="col-md-6">
                    <select value={fuelType} onChange={(e) => setFuelType(e.target.value)} className="form-control" required>
                        <option value="">Seleccione Tipo de Combustible</option>
                        {fuelTypes.map((fuel) => <option key={fuel.id} value={fuel.id}>{fuel.descripcion}</option>)}
                    </select>
                </div>
                <div className="col-md-6">
                    <select value={status} onChange={(e) => setStatus(e.target.value === "true")} className="form-control" required>
                        <option value="true">Activo</option>
                        <option value="false">Inactivo</option>
                    </select>
                </div>
                <div className="col-md-12">
                    <button type="submit" className="btn btn-primary">Guardar</button>
                </div>
            </div>
        </form>
    );
}
