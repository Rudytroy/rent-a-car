import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import ModelForm from '../components/ModelForm';
import Navbar from '../components/Navbar';

export default function Models() {
    const [models, setModels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedModel, setSelectedModel] = useState(null);

    useEffect(() => {
        fetchModels();
    }, []);

    const fetchModels = async () => {
        const { data, error } = await supabase
            .from('modelos')
            .select('id, descripcion, marca_id, estado, marcas(descripcion)');
        if (error) {
            console.error('Error fetching models:', error);
        } else {
            setModels(data);
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        const { error } = await supabase.from('modelos').delete().eq('id', id);
        if (error) console.error('Error deleting model:', error);
        else fetchModels();
    };

    if (loading) return <p className="text-center mt-4">Cargando modelos...</p>;

    return (
        <div className="container mt-4">
            <Navbar />
            <h1 className="text-center mb-4">Modelos</h1>
            <ModelForm onSuccess={fetchModels} initialData={selectedModel} />
            <ul className="list-group">
                {models.map((model) => (
                    <li key={model.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <p className="fw-bold">{model.descripcion}</p>
                            <p className="text-muted">Marca: {model.marcas.descripcion}</p> {/* Mostrar el nombre de la marca */}
                            <p className="text-muted">Estado: {model.estado ? 'Activo' : 'Inactivo'}</p>
                        </div>
                        <div>
                            <button
                                onClick={() => setSelectedModel(model)}
                                className="btn btn-warning btn-sm me-2"
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => handleDelete(model.id)}
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
