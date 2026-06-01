import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminNavbar from '../../components/AdminNavbar';
import StatusBadge from '../../components/StatusBadge';
import api from '../../axiosConfig';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await api.get('/orders');
                setOrders(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const active = orders.filter(o => !['completed', 'cancelled'].includes(o.status));
    const completed = orders.filter(o => o.status === 'completed');

    return (
        <div style={{ minHeight: '100vh', background: '#FAF7F2' }}>
            <AdminNavbar />
            <div style={{ padding: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
                <h1 style={{ color: '#7C2D12' }}>Welcome, {user?.name}</h1>

                {/* Summary cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                    {[
                        { label: 'Active Orders', value: active.length, color: '#2563EB' },
                        { label: 'Completed Today', value: completed.length, color: '#16A34A' },
                        { label: 'Total Orders', value: orders.length, color: '#7C2D12' },
                    ].map(card => (
                        <div key={card.label} style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', textAlign: 'center', border: '1px solid #e5e7eb' }}>
                            <p style={{ margin: '0 0 0.5rem', color: '#6b7280', fontSize: '0.85rem' }}>{card.label}</p>
                            <p style={{ margin: 0, fontSize: '2rem', fontWeight: '700', color: card.color }}>{card.value}</p>
                        </div>
                    ))}
                </div>

                {/* Recent orders */}
                <h2 style={{ color: '#374151', marginBottom: '1rem' }}>Recent Orders</h2>
                {loading ? <p>Loading...</p> : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {orders.slice(0, 5).map(order => (
                            <div key={order._id}
                                 onClick={() => navigate(`/admin/orders/${order._id}`)}
                                 style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1rem 1.25rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <p style={{ margin: '0 0 0.25rem', fontWeight: '600' }}>Order #{order.orderNumber}</p>
                                    <p style={{ margin: 0, color: '#6b7280', fontSize: '0.85rem' }}>
                                        {order.createdBy?.name} · ${order.totalPrice.toFixed(2)}
                                    </p>
                                </div>
                                <StatusBadge status={order.status} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;