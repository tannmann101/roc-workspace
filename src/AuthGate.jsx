import { useState, useEffect, useRef } from 'react';
import { onAuthStateChanged, signInWithCredential, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth } from './firebase.js';
import { loadGoogleIdentityServices } from './lib/googleIdentity.js';

// The Firebase project's Google OAuth web client, from Firebase Console ->
// Authentication -> Sign-in method -> Google -> Web SDK configuration.
const GOOGLE_CLIENT_ID = '282211080163-b1vgvanft5b0mq98mqklggsjh1l2qpjd.apps.googleusercontent.com';

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
  const [error, setError] = useState('');
  const buttonRef = useRef(null);

  // Renders Google's own "Sign in with Google" button and hands back an ID
  // token through an in-page callback -- no page navigation, no popup
  // window. Both signInWithPopup and signInWithRedirect correlate the
  // sign-in attempt with this page via sessionStorage/a pending-redirect
  // record, which breaks once an installed iOS Home Screen web app leaves
  // its own browsing context for accounts.google.com and back (that's the
  // "missing initial state" error and the sign-in loop that followed
  // switching to redirect). The Identity Services credential flow never
  // navigates away at all, so none of that applies.
  useEffect(() => {
    if (user) return undefined;
    let cancelled = false;

    loadGoogleIdentityServices()
      .then((google) => {
        if (cancelled || !buttonRef.current) return;
        google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: async ({ credential }) => {
            setError('');
            try {
              await signInWithCredential(auth, GoogleAuthProvider.credential(credential));
            } catch (err) {
              setError(err.message || 'Sign-in failed.');
            }
          },
        });
        google.accounts.id.renderButton(buttonRef.current, {
          type: 'standard',
          theme: 'filled_blue',
          size: 'large',
          shape: 'pill',
          text: 'signin_with',
        });
      })
      .catch((err) => setError(err.message || 'Could not load Google Sign-In.'));

    return () => {
      cancelled = true;
    };
  }, [user]);

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
        <div ref={buttonRef} className="google-signin-btn" />
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
