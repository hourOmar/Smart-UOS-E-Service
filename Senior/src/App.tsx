import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { UserRole } from './types';
import { AppRoutes } from './app/router';
import { supabase } from './services/supabase/client';
import { signOut } from './services/supabase/auth';

export function App() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted || !data.session?.user.email) return;
      setRole(getRoleFromEmail(data.session.user.email));
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user.email) {
        setRole(null);
        return;
      }

      setRole(getRoleFromEmail(session.user.email));
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

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

  const handleLogout = async () => {
    try {
      await signOut();
      showToast('Logged out of University of Sharjah portal.');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to log out.');
    }
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

function getRoleFromEmail(email: string): UserRole {
  return /^U\d+$/i.test(email.split('@')[0]) ? 'student' : 'admin';
}

export default App;
