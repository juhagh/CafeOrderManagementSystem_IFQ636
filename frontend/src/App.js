import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Unauthorized from './pages/Unauthorized';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/unauthorized" element={<Unauthorized />} />

                    {/* Staff routes */}
                    <Route path="/staff/*" element={
                        <ProtectedRoute roles={['staff', 'admin']}>
                            <Profile />
                        </ProtectedRoute>
                    } />

                    {/* Kitchen routes */}
                    <Route path="/kitchen/*" element={
                        <ProtectedRoute roles={['kitchen', 'admin']}>
                            <Profile />
                        </ProtectedRoute>
                    } />

                    {/* Admin routes */}
                    <Route path="/admin/*" element={
                        <ProtectedRoute roles={['admin']}>
                            <Profile />
                        </ProtectedRoute>
                    } />

                    {/* Default redirect */}
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;