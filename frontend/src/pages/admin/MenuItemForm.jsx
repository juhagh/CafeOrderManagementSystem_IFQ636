import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../axiosConfig';
import AdminNavbar from '../../components/AdminNavbar';

const CATEGORIES = ['coffee', 'breakfast', 'lunch', 'pastries'];

const MenuItemForm = () => {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '', description: '', price: '', category: 'coffee', available: true,
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (isEdit) {
            const fetchItem = async () => {
                try {
                    const { data } = await api.get(`/menu/${id}`);
                    setForm({
                        name: data.name,
                        description: data.description || '',
                        price: data.price,
                        category: data.category,
                        available: data.available,
                    });
                } catch (err) {
                    console.error(err);
                }
            };
            fetchItem();
        }
    }, [id, isEdit]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async () => {
        try {
            setSaving(true);
            const payload = { ...form, price: parseFloat(form.price) };
            if (isEdit) {
                await api.put(`/menu/${id}`, payload);
            } else {
                await api.post('/menu', payload);
            }
            navigate('/admin/menu');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to save item');
        } finally {
            setSaving(false);
        }
    };

    const fieldStyle = {
        width: '100%', padding: '0.6rem 0.75rem', borderRadius: '8px',
        border: '1px solid #d1d5db', fontSize: '0.95rem', boxSizing: 'border-box',
    };
    const labelStyle = { display: 'block', marginBottom: '0.4rem', fontWeight: '500', color: '#374151' };

    return (
        <div style={{ minHeight: '100vh', background: '#FAF7F2' }}>
            <AdminNavbar />
            <div style={{ padding: '1.5rem', maxWidth: '560px', margin: '0 auto' }}>
                <button onClick={() => navigate('/admin/menu')}
                        style={{ background: 'none', border: 'none', color: '#7C2D12', cursor: 'pointer', marginBottom: '1rem', padding: 0 }}>
                    ← Back to Menu
                </button>
                <h1 style={{ color: '#7C2D12', marginBottom: '1.5rem' }}>
                    {isEdit ? 'Edit Menu Item' : 'Add Menu Item'}
                </h1>

                <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={labelStyle}>Name</label>
                        <input name="name" value={form.name} onChange={handleChange} style={fieldStyle} placeholder="e.g. Flat White" />
                    </div>
                    <div>
                        <label style={labelStyle}>Description</label>
                        <input name="description" value={form.description} onChange={handleChange} style={fieldStyle} placeholder="Optional description" />
                    </div>
                    <div>
                        <label style={labelStyle}>Price ($)</label>
                        <input name="price" type="number" step="0.01" min="0" value={form.price} onChange={handleChange} style={fieldStyle} placeholder="0.00" />
                    </div>
                    <div>
                        <label style={labelStyle}>Category</label>
                        <select name="category" value={form.category} onChange={handleChange} style={fieldStyle}>
                            {CATEGORIES.map(cat => (
                                <option key={cat} value={cat} style={{ textTransform: 'capitalize' }}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <input type="checkbox" name="available" id="available" checked={form.available} onChange={handleChange} />
                        <label htmlFor="available" style={{ color: '#374151' }}>Available</label>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                        <button onClick={handleSubmit} disabled={saving}
                                style={{ flex: 1, background: '#7C2D12', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                            {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Item'}
                        </button>
                        <button onClick={() => navigate('/admin/menu')}
                                style={{ flex: 1, background: 'white', color: '#7C2D12', border: '1px solid #7C2D12', padding: '0.75rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MenuItemForm;