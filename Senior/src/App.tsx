import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { UserRole } from './types';
import { AppRoutes } from './app/router';

export function App() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleLogin = (userRole: UserRole, email?: string) => {
    setRole(userRole);
    showToast(`Logged in successfully as ${userRole === 'admin' ? 'University Administrator' : 'UoS Student'}`);
  };

  const handleLogout = () => {
    setRole(null);
    showToast('Logged out of University of Sharjah portal.');
  };

  return (
    <BrowserRouter>
      <AppRoutes
        role={role}
        onLogin={handleLogin}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        toastMessage={toastMessage}
        onDismissToast={() => setToastMessage(null)}
        onToast={showToast}
      />
    </BrowserRouter>
  );
}

export default App;
