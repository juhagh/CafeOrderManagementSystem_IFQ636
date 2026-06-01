import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../axiosConfig';
import { useCart } from '../../context/CartContext';

const CATEGORIES = ['all', 'coffee', 'breakfast', 'lunch', 'pastries'];

const MenuBrowse = () => {
    const [items, setItems] = useState([]);
    const [category, setCategory] = useState('all');
    const [loading, setLoading] = useState(true);
    const { cart, addToCart, total } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const params = category !== 'all' ? { category } : {};
                const { data } = await api.get('/menu', { params });
                setItems(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchMenu();
    }, [category]);

    const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

    return (
        <div style={{ padding: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ color: '#A0522D' }}>Menu</h1>
                {cartCount > 0 && (
                    <button
                        onClick={() => navigate('/staff/cart')}
                        style={{ background: '#A0522D', color: 'white', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer' }}>
                        View Cart ({cartCount}) — ${total.toFixed(2)}
                    </button>
                )}
            </div>

            {/* Category filter */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        style={{
                            padding: '0.4rem 1rem',
                            borderRadius: '20px',
                            border: '1px solid #A0522D',
                            background: category === cat ? '#A0522D' : 'white',
                            color: category === cat ? 'white' : '#A0522D',
                            cursor: 'pointer',
                            textTransform: 'capitalize'
                        }}>
                        {cat}
                    </button>
                ))}
            </div>

            {/* Menu items */}
            {loading ? (
                <p>Loading menu...</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                    {items.filter(i => i.available).map(item => (
                        <div key={item._id} style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1rem', background: 'white' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <p style={{ fontWeight: '600', margin: '0 0 0.25rem' }}>{item.name}</p>
                                    <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: '0 0 0.5rem' }}>{item.description}</p>
                                    <p style={{ color: '#A0522D', fontWeight: '600', margin: 0 }}>${item.price.toFixed(2)}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => addToCart(item)}
                                style={{ marginTop: '0.75rem', width: '100%', background: '#A0522D', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}>
                                + Add
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MenuBrowse;