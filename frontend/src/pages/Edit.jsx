import { useState, useEffect } from 'react';
import API from '../services/Api';

export default function Edit() {
    const [formData, setFormData] = useState({
        matricule: '',
        nom: '',
        prenom: '',
        cin: '',
        fonction: '',
        dateNaissance: '',
        region: '',
        email: '',
        telephone: '',
        unite: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        API.get('profile/')
            .then(res => {
                setFormData({
                    matricule: res.data.matricule || '',
                    nom: res.data.nom || '',
                    prenom: res.data.prenom || '',
                    cin: res.data.cin || '',
                    fonction: res.data.fonction || '',
                    dateNaissance: res.data.dateNaissance || '',
                    region: res.data.region || '',
                    email: res.data.email || '',
                    telephone: res.data.telephone || '',
                    unite: res.data.unite || '',
                });
            })
            .catch(() => {
                alert('Erreur lors du chargement du profil');
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        try {
            await API.put('edit/', formData);
            alert('Profil mis à jour avec succès !');
        } catch (err) {
            if (err.response && err.response.data) {
                setErrors(err.response.data);
                console.log(err.response.data); // <--- Add this line
            } else {
                alert('Erreur de mise à jour');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleEdit} style={{ maxWidth: 600, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h2>Modifier le profil</h2>
            <input name="matricule" value={formData.matricule} onChange={handleChange} placeholder="Matricule" />
            {errors.matricule && <span style={{ color: 'red' }}>{errors.matricule}</span>}
            <input name="nom" value={formData.nom} onChange={handleChange} placeholder="Nom" />
            {errors.nom && <span style={{ color: 'red' }}>{errors.nom}</span>}
            <input name="prenom" value={formData.prenom} onChange={handleChange} placeholder="Prénom" />
            {errors.prenom && <span style={{ color: 'red' }}>{errors.prenom}</span>}
            <input name="cin" value={formData.cin} onChange={handleChange} placeholder="CIN" />
            {errors.cin && <span style={{ color: 'red' }}>{errors.cin}</span>}
            <input name="fonction" value={formData.fonction} onChange={handleChange} placeholder="Fonction" />
            {errors.fonction && <span style={{ color: 'red' }}>{errors.fonction}</span>}
            <input name="dateNaissance" type="date" value={formData.dateNaissance} onChange={handleChange} placeholder="Date de naissance" />
            {errors.dateNaissance && <span style={{ color: 'red' }}>{errors.dateNaissance}</span>}
            <input name="region" value={formData.region} onChange={handleChange} placeholder="Région" />
            {errors.region && <span style={{ color: 'red' }}>{errors.region}</span>}
            <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" />
            {errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}
            <input name="telephone" value={formData.telephone} onChange={handleChange} placeholder="Téléphone" />
            {errors.telephone && <span style={{ color: 'red' }}>{errors.telephone}</span>}
            <input name="unite" value={formData.unite} onChange={handleChange} placeholder="Unité" />
            {errors.unite && <span style={{ color: 'red' }}>{errors.unite}</span>}
            <button type="submit" disabled={loading}>
                {loading ? 'Mise à jour...' : 'Modifier le profil'}
            </button>
        </form>
    );
}
