import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import BrandForm from '../components/BrandForm';
import Navbar from '../components/Navbar';

export default function Brands() {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingBrand, setEditingBrand] = useState(null);

    useEffect(() => {
        fetchBrands();
    }, []);

    const fetchBrands = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('marcas').select('*');
        if (error) console.error('Error fetching brands:', error);
        else setBrands(data);
        setLoading(false);
    };

    const handleDelete = async (id) => {
        const { error } = await supabase.from('marcas').delete().eq('id', id);
        if (error) console.error('Error deleting brand:', error);
        else fetchBrands();
    };

    const handleEdit = (brand) => {
        setEditingBrand(brand);
    };

    const handleSuccess = () => {
        setEditingBrand(null);
        fetchBrands();
    };

    if (loading) return <p className="text-center mt-4">Cargando marcas...</p>;

    return (
        <div className="container mt-4">
            <Navbar />
            <h1 className="text-center mb-4">Marcas</h1>
            <BrandForm onSuccess={handleSuccess} initialData={editingBrand} />
            <ul className="list-group">
                {brands.map((brand) => (
                    <li key={brand.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <p className="fw-bold">{brand.descripcion}</p>
                            <p className="text-muted">Estado: {brand.estado ? 'Activo' : 'Inactivo'}</p>
                        </div>
                        <div>
                            <button
                                onClick={() => handleEdit(brand)}
                                className="btn btn-warning btn-sm me-2"
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => handleDelete(brand.id)}
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
