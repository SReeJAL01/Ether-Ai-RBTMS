/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Projects } from './components/Projects';
import { Tasks } from './components/Tasks';
import { Team } from './components/Team';
import { Settings } from './components/Settings';
import { AuthProvider, LoginPage } from './components/Auth';
import { logout } from './lib/firebase';
import { ThemeProvider } from './lib/ThemeContext';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <ThemeProvider>
      <AuthProvider>
        {(user, loading) => {
          if (loading) {
            return (
              <div className="flex min-h-screen items-center justify-center bg-black">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
              </div>
            );
          }

          if (!user) {
            return <LoginPage />;
          }

          return (
            <Layout 
              activeTab={activeTab} 
              onTabChange={setActiveTab}
              user={user}
              onLogout={logout}
            >
              {activeTab === 'dashboard' && <Dashboard />}
              {activeTab === 'projects' && <Projects user={user} />}
              {activeTab === 'tasks' && <Tasks user={user} />}
              {activeTab === 'team' && <Team currentUser={user} />}
              {activeTab === 'settings' && <Settings user={user} />}
            </Layout>
          );
        }}
      </AuthProvider>
    </ThemeProvider>
  );
}

