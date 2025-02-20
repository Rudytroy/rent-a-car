import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

const validateCedula = (cedula) => {
    let total = 0;
    const cedulaClean = cedula.replace("-", "").trim();
    if (cedulaClean.length !== 11) return false;

    const multipliers = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1];

    for (let i = 0; i < cedulaClean.length; i++) {
        let calculation = parseInt(cedulaClean.charAt(i)) * multipliers[i];
        if (calculation >= 10) {
            total += Math.floor(calculation / 10) + (calculation % 10);
        } else {
            total += calculation;
        }
    }

    return total % 10 === 0;
};

export default function ClientForm({ onSuccess, clientToEdit, setClientToEdit }) {
    const [name, setName] = useState('');
    const [idNumber, setIdNumber] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [creditLimit, setCreditLimit] = useState('');
    const [personType, setPersonType] = useState('');
    const [status, setStatus] = useState(true);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (clientToEdit) {
            setName(clientToEdit.nombre);
            setIdNumber(clientToEdit.cedula);
            setCardNumber(clientToEdit.no_tarjeta);
            setCreditLimit(clientToEdit.limite_credito);
            setPersonType(clientToEdit.tipo_persona);
            setStatus(clientToEdit.estado);
        } else {
            setName('');
            setIdNumber('');
            setCardNumber('');
            setCreditLimit('');
            setPersonType('');
            setStatus(true);
        }
    }, [clientToEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!validateCedula(idNumber)) {
            newErrors.idNumber = "Cédula inválida.";
        }

        if (cardNumber.length !== 16 || !/^\d{16}$/.test(cardNumber)) {
            newErrors.cardNumber = "La tarjeta debe tener 16 dígitos.";
        }

        if (isNaN(creditLimit) || creditLimit <= 0) {
            newErrors.creditLimit = "El límite de crédito debe ser un número positivo.";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        if (clientToEdit) {
            const { data, error } = await supabase
                .from('clientes')
                .select('id')
                .eq('no_tarjeta', cardNumber)
                .neq('id', clientToEdit.id)
                .single();

            if (data) {
                newErrors.cardNumber = "Ya existe un cliente con esta tarjeta de crédito.";
                setErrors(newErrors);
                return;
            }
        } else {

            const { data, error } = await supabase
                .from('clientes')
                .select('id')
                .eq('no_tarjeta', cardNumber)
                .single();

            if (data) {
                newErrors.cardNumber = "Ya existe un cliente con esta tarjeta de crédito.";
                setErrors(newErrors);
                return;
            }
        }

       
        if (clientToEdit) {
          
            const { error } = await supabase
                .from('clientes')
                .update({
                    nombre: name,
                    cedula: idNumber,
                    no_tarjeta: cardNumber,
                    limite_credito: parseFloat(creditLimit),
                    tipo_persona: personType,
                    estado: status,
                })
                .eq('id', clientToEdit.id);

            if (error) {
                console.error('Error updating client:', error.message);
            } else {
                setClientToEdit(null);
                onSuccess();
            }
        } else {
            const { error } = await supabase
                .from('clientes')
                .insert([{
                    nombre: name,
                    cedula: idNumber,
                    no_tarjeta: cardNumber,
                    limite_credito: parseFloat(creditLimit),
                    tipo_persona: personType,
                    estado: status,
                }]);

            if (error) {
                console.error('Error creating client:', error.message);
            } else {
                setName('');
                setIdNumber('');
                setCardNumber('');
                setCreditLimit('');
                setPersonType('');
                setStatus(true);
                setErrors({});
                onSuccess();
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4">
            <div className="row g-3">
                <div className="col-md-4">
                    <input
                        type="text"
                        placeholder="Nombre"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>
                <div className="col-md-4">
                    <input
                        type="text"
                        placeholder="Cédula"
                        value={idNumber}
                        onChange={(e) => setIdNumber(e.target.value)}
                        className={`form-control ${errors.idNumber ? 'is-invalid' : ''}`}
                        required
                    />
                    {errors.idNumber && <div className="invalid-feedback">{errors.idNumber}</div>}
                </div>
                <div className="col-md-4">
                    <input
                        type="text"
                        placeholder="Tarjeta CR"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className={`form-control ${errors.cardNumber ? 'is-invalid' : ''}`}
                        required
                    />
                    {errors.cardNumber && <div className="invalid-feedback">{errors.cardNumber}</div>}
                </div>
                <div className="col-md-4">
                    <input
                        type="number"
                        placeholder="Límite de Crédito"
                        value={creditLimit}
                        onChange={(e) => setCreditLimit(e.target.value)}
                        className={`form-control ${errors.creditLimit ? 'is-invalid' : ''}`}
                        required
                    />
                    {errors.creditLimit && <div className="invalid-feedback">{errors.creditLimit}</div>}
                </div>
                <div className="col-md-4">
                    <select
                        value={personType}
                        onChange={(e) => setPersonType(e.target.value)}
                        className="form-control"
                        required
                    >
                        <option value="">Seleccione Tipo Persona</option>
                        <option value="Física">Física</option>
                        <option value="Jurídica">Jurídica</option>
                    </select>
                </div>
                <div className="col-md-4">
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value === "true")}
                        className="form-control"
                    >
                        <option value="true">Activo</option>
                        <option value="false">Inactivo</option>
                    </select>
                </div>

                <div className="col-12">
                    <button type="submit" className="btn btn-primary w-100">
                        {clientToEdit ? 'Actualizar Cliente' : 'Agregar Cliente'}
                    </button>
                </div>
            </div>
        </form>
    );
}
