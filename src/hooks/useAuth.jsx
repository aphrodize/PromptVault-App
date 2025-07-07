import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../lib/firebase.js';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        
        // For demo mode, the role is included in the user object
        if (firebaseUser.role) {
          setUserRole(firebaseUser.role);
          setLoading(false);
          return;
        }
        
        // Get user role from database (for real Firebase)
        try {
          const userDoc = await db.collection('users').doc(firebaseUser.uid).get();
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserRole(userData.role || 'user');
          } else {
            // Create user document if it doesn't exist
            const newUserData = {
              email: firebaseUser.email,
              role: 'user',
              createdAt: new Date().toISOString()
            };
            await db.collection('users').doc(firebaseUser.uid).set(newUserData);
            setUserRole('user');
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
          // For demo mode, check if user has admin role
          if (firebaseUser.email === 'admin@demo.com') {
            setUserRole('admin');
          } else {
            setUserRole('user');
          }
        }
      } else {
        setUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    try {
      const result = await auth.signInWithEmailAndPassword(email, password);
      return result;
    } catch (error) {
      throw new Error(getAuthErrorMessage(error.message || error.code));
    }
  };

  const register = async (email, password) => {
    try {
      const result = await auth.createUserWithEmailAndPassword(email, password);
      
      // Create user document in database
      const userData = {
        email: result.user.email,
        role: 'user',
        createdAt: new Date().toISOString()
      };
      
      await db.collection('users').doc(result.user.uid).set(userData);
      
      return result;
    } catch (error) {
      throw new Error(getAuthErrorMessage(error.message || error.code));
    }
  };

  const logout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      throw new Error('Failed to log out');
    }
  };

  const isAdmin = userRole === 'admin';

  const value = {
    user,
    userRole,
    isAdmin,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

function getAuthErrorMessage(errorCode) {
  switch (errorCode) {
    case 'auth/user-not-found':
    case 'auth/invalid-credentials':
      return 'Invalid email or password.';
    case 'auth/wrong-password':
      return 'Incorrect password.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/invalid-email':
      return 'Invalid email address.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    default:
      return errorCode || 'An error occurred. Please try again.';
  }
}

