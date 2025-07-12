import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

// Componentes reutilizables para mantener la consistencia
const Header = () => (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link to="/" className="text-3xl font-extrabold text-white">Finanzi<span className="text-teal-400">App</span></Link>
            <div className="flex items-center space-x-4">
                <Link to="/register" className="text-gray-300 hover:text-white transition-colors duration-300">Regístrate</Link>
            </div>
        </div>
    </header>
);

const Footer = () => (
    <footer className="bg-slate-900 border-t border-slate-800 py-8 text-gray-400">
        <div className="container mx-auto px-6 text-center">
            <p className="text-3xl font-extrabold text-white mb-3">Finanzi<span className="text-teal-400">App</span></p>
            <p className="text-sm">&copy; {new Date().getFullYear()} FinanziApp. Controla tu futuro financiero.</p>
        </div>
    </footer>
);

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError("Credenciales incorrectas. Por favor, inténtalo de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError('');
        setLoading(true);
        try {
            const isNewUser = await loginWithGoogle();
            navigate(isNewUser ? '/setup-profile' : '/dashboard');
        } catch (err) {
            setError("No se pudo iniciar sesión con Google. Inténtalo más tarde.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans antialiased flex flex-col">
            <Header />
            <main className="flex-grow flex items-center justify-center pt-24 pb-12 px-4">
                <div className="relative z-10 w-full max-w-md mx-auto">
                    <div className="absolute -inset-2 z-0 opacity-20">
                        <div className="absolute top-0 left-0 w-48 h-48 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
                        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
                    </div>
                    <div className="relative bg-slate-800/70 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-slate-700">
                        <h2 className="text-4xl font-bold text-center text-white mb-8">Bienvenido a Finanzi<span className="text-teal-400">App</span></h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
                                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition" />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-300">Contraseña</label>
                                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 block w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition" />
                            </div>
                            <button type="submit" disabled={loading} className="w-full font-bold py-3 px-6 rounded-full shadow-xl transform transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white">
                                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                            </button>
                            {error && <p className="text-red-400 text-center text-sm pt-2">{error}</p>}
                        </form>
                        <div className="mt-6">
                            <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-600" /></div><div className="relative flex justify-center text-sm"><span className="px-2 bg-slate-800 text-gray-400">O continúa con</span></div></div>
                            <div className="mt-6">
                                <button onClick={handleGoogleLogin} disabled={loading} className="w-full flex items-center justify-center py-3 px-4 border border-slate-600 rounded-full shadow-sm text-sm font-medium text-gray-300 bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 transition-colors">
                                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo" className="w-5 h-5 mr-3" />
                                    <span>{loading ? 'Conectando...' : 'Iniciar Sesión con Google'}</span>
                                </button>
                            </div>
                        </div>
                        <p className="text-center text-gray-400 text-sm mt-8">¿No tienes cuenta? <Link to="/register" className="font-medium text-teal-400 hover:text-teal-300 transition-colors">Regístrate aquí</Link></p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default LoginPage;