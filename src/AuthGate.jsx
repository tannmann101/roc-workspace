import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from './firebase.js';

export function useAuthUser() {
  const [user, setUser] = useState(undefined); // undefined = still checking, null = signed out
  useEffect(() => onAuthStateChanged(auth, setUser), []);
  return user;
}

function Centered({ children }) {
  return (
    <div className="auth-screen">
      <div className="auth-card">{children}</div>
    </div>
  );
}

export default function AuthGate({ user, forbidden, children }) {
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState('');

  const doSignIn = async () => {
    setSigningIn(true);
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setError(err.message || 'Sign-in failed.');
    } finally {
      setSigningIn(false);
    }
  };

  if (user === undefined) {
    return (
      <Centered>
        <p className="auth-loading">loading…</p>
      </Centered>
    );
  }

  if (!user) {
    return (
      <Centered>
        <h1 className="auth-title">The Workshop</h1>
        <p className="auth-sub">Sign in to see the shared workspace.</p>
        <button type="button" className="btn-primary auth-btn" onClick={doSignIn}>
          {signingIn ? 'Signing in…' : 'Sign in with Google'}
        </button>
        {error ? <p className="auth-error">{error}</p> : null}
      </Centered>
    );
  }

  if (forbidden) {
    return (
      <Centered>
        <h1 className="auth-title">Not authorized</h1>
        <p className="auth-sub">
          Signed in as <strong>{user.email}</strong>
        </p>
        <p className="auth-sub">This workspace is restricted to specific accounts.</p>
        <button type="button" className="btn-secondary" onClick={() => signOut(auth)}>
          Sign out
        </button>
      </Centered>
    );
  }

  return children;
}
