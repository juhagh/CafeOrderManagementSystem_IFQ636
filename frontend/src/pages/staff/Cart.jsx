import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import api from '../../axiosConfig';
import { useState } from 'react';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, clearCart, total } = useCart();
    const [notes, setNotes] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            setSubmitting(true);
            await api.post('/orders', {
                items: cart.map(i => ({ menuItemId: i._id, quantity: i.quantity })),
                notes,
            });
            clearCart();
            navigate('/staff/orders');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to place order');
        } finally {
            setSubmitting(false);
        }
    };

    if (cart.length === 0) return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            <p>Your cart is empty.</p>
            <button onClick={() => navigate('/staff/menu')}
                    style={{ color: '#A0522D', background: 'none', border: '1px solid #A0522D', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' }}>
                Browse Menu
            </button>
        </div>
    );

    return (
        <div style={{ padding: '1.5rem', maxWidth: '600px', margin: '0 auto' }}>
            <h1 style={{ color: '#A0522D' }}>Review Order</h1>

            {cart.map(item => (
                <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid #e5e7eb' }}>
                    <div>
                        <p style={{ margin: 0, fontWeight: '600' }}>{item.name}</p>
                        <p style={{ margin: 0, color: '#6b7280', fontSize: '0.85rem' }}>${item.price.toFixed(2)} each</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #d1d5db', cursor: 'pointer', background: 'white' }}>−</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #d1d5db', cursor: 'pointer', background: 'white' }}>+</button>
                        <button onClick={() => removeFromCart(item._id)}
                                style={{ marginLeft: '0.5rem', color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer' }}>Remove</button>
                    </div>
                </div>
            ))}

            <textarea
                placeholder="Any notes for the kitchen..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                style={{ width: '100%', marginTop: '1rem', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', resize: 'vertical', minHeight: '80px', boxSizing: 'border-box' }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
                <p style={{ fontWeight: '700', fontSize: '1.1rem' }}>Total: ${total.toFixed(2)}</p>
                <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    style={{ background: '#A0522D', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                    {submitting ? 'Placing order...' : 'Place Order'}
                </button>
            </div>
        </div>
    );
};

export default Cart;