import { Authenticated, Unauthenticated } from "convex/react";
import { SignInForm } from "./SignInForm";
import { Dashboard } from "./components/Dashboard";
import { DiscordAuth } from "./components/DiscordAuth";
import { useState, useEffect } from "react";

function App() {
  const [discordUser, setDiscordUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in with Discord
    const storedUser = localStorage.getItem('discordUser');
    if (storedUser) {
      setDiscordUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('discordUser');
    localStorage.removeItem('discordGuilds');
    setDiscordUser(null);
  };

  return (
    <main className="min-h-screen">
      <Unauthenticated>
        {discordUser ? (
          <Dashboard discordUser={discordUser} onLogout={handleLogout} />
        ) : (
          <DiscordAuth />
        )}
      </Unauthenticated>
      <Authenticated>
        <Dashboard />
      </Authenticated>
    </main>
  );
}

export default App;
