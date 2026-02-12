import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

export default function Header() {
  const navigate = useNavigate();
  const { userRole, logout } = useStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold text-gray-800">NetSecOps AI</h2>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full">
          <span className="text-xs font-medium text-blue-700">{userRole}</span>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
