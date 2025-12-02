import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import Login from './components/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import NoticiaList from './components/NoticiaList';
import NoticiaForm from './components/NoticiaForm';
import EmpresaEditor from './components/EmpresaEditor';
import AliadosList from './components/AliadosList';
import CategoriasList from './components/CategoriasList';
import ProyectoList from './components/ProyectoList';
import ProyectoForm from './components/ProyectoForm';
import UserManagement from './components/UserManagement';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <Router>
      <Layout user={user}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/productos" element={<ProductList />} />
          <Route path="/productos/nuevo" element={<ProductForm />} />
          <Route path="/productos/editar/:id" element={<ProductForm />} />
          <Route path="/noticias" element={<NoticiaList />} />
          <Route path="/noticias/nuevo" element={<NoticiaForm />} />
          <Route path="/noticias/editar/:id" element={<NoticiaForm />} />
          <Route path="/empresa" element={<EmpresaEditor />} />
          <Route path="/aliados" element={<AliadosList />} />
          <Route path="/categorias" element={<CategoriasList />} />
          <Route path="/proyectos" element={<ProyectoList />} />
          <Route path="/proyectos/nuevo" element={<ProyectoForm />} />
          <Route path="/proyectos/editar/:id" element={<ProyectoForm />} />
          <Route path="/usuarios" element={<UserManagement />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

