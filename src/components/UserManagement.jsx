import { useState, useEffect } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    role: 'editor'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const snapshot = await getDocs(collection(db, 'admin'));
      const usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setCreating(true);

    try {
      // Crear usuario en Firebase Authentication
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        newUser.email,
        newUser.password
      );

      // Guardar info en Firestore (colección 'admin')
      await addDoc(collection(db, 'admin'), {
        email: newUser.email,
        role: newUser.role,
        uid: userCredential.user.uid,
        createdAt: new Date()
      });

      setSuccess(`Usuario ${newUser.email} creado exitosamente`);
      setNewUser({ email: '', password: '', role: 'editor' });
      setShowForm(false);
      loadUsers();
    } catch (err) {
      console.error('Error al crear usuario:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Este email ya está registrado');
      } else if (err.code === 'auth/weak-password') {
        setError('La contraseña debe tener al menos 6 caracteres');
      } else if (err.code === 'auth/invalid-email') {
        setError('Email inválido');
      } else {
        setError('Error al crear usuario: ' + err.message);
      }
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteUser = async (userId, email) => {
    if (!window.confirm(`¿Estás seguro de eliminar el usuario ${email}?`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'admin', userId));
      setSuccess(`Usuario ${email} eliminado`);
      loadUsers();
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
      setError('Error al eliminar usuario');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Usuarios Administradores
          </h1>
          <p className="text-gray-600">
            Gestiona los usuarios con acceso al CMS
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          {showForm ? 'Cancelar' : '+ Nuevo Usuario'}
        </button>
      </div>

      {/* Mensajes */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          {success}
        </div>
      )}

      {/* Formulario de creación */}
      {showForm && (
        <div className="card mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Crear Nuevo Usuario
          </h2>
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="input-field"
                placeholder="usuario@ejemplo.com"
                required
                disabled={creating}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="input-field"
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
                disabled={creating}
              />
              <p className="mt-1 text-xs text-gray-500">
                Mínimo 6 caracteres. El usuario podrá cambiarla después.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rol
              </label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                className="input-field"
                disabled={creating}
              >
                <option value="admin">Administrador (acceso completo)</option>
                <option value="editor">Editor (solo productos)</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setNewUser({ email: '', password: '', role: 'editor' });
                  setError('');
                }}
                className="btn-secondary"
                disabled={creating}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={creating}
              >
                {creating ? 'Creando...' : 'Crear Usuario'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de usuarios */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Usuarios Existentes ({users.length})
        </h2>

        {users.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No hay usuarios registrados
          </div>
        ) : (
          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary-100 p-2 rounded-full">
                      <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {user.email}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role === 'admin' ? '👑 Administrador' : '✏️ Editor'}
                        </span>
                        {user.createdAt && (
                          <span className="text-xs text-gray-500">
                            Creado: {new Date(user.createdAt.seconds * 1000).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteUser(user.id, user.email)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info adicional */}
      <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">ℹ️ Información</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• <strong>Administrador:</strong> Acceso completo al CMS (productos, usuarios, etc.)</li>
          <li>• <strong>Editor:</strong> Solo puede gestionar productos y subproductos</li>
          <li>• Los usuarios recibirán un email de verificación (opcional en Firebase)</li>
          <li>• La contraseña se puede restablecer desde el login</li>
        </ul>
      </div>
    </div>
  );
}

export default UserManagement;

