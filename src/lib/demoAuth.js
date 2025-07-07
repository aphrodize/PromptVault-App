// Demo authentication system for testing without Firebase
class DemoAuth {
  constructor() {
    this.users = [
      {
        uid: 'demo-admin',
        email: 'admin@demo.com',
        role: 'admin',
        createdAt: new Date().toISOString()
      },
      {
        uid: 'demo-user',
        email: 'user@demo.com',
        role: 'user',
        createdAt: new Date().toISOString()
      }
    ];
    this.currentUser = null;
    this.listeners = [];
  }

  // Simulate Firebase Auth methods
  signInWithEmailAndPassword(email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = this.users.find(u => u.email === email);
        if (user && password === 'demo123') {
          this.currentUser = user;
          this.notifyListeners(user);
          resolve({ user });
        } else {
          reject(new Error('auth/invalid-credentials'));
        }
      }, 500);
    });
  }

  createUserWithEmailAndPassword(email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (this.users.find(u => u.email === email)) {
          reject(new Error('auth/email-already-in-use'));
          return;
        }

        const newUser = {
          uid: `demo-${Date.now()}`,
          email,
          role: 'user',
          createdAt: new Date().toISOString()
        };

        this.users.push(newUser);
        this.currentUser = newUser;
        this.notifyListeners(newUser);
        resolve({ user: newUser });
      }, 500);
    });
  }

  signOut() {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.currentUser = null;
        this.notifyListeners(null);
        resolve();
      }, 200);
    });
  }

  onAuthStateChanged(callback) {
    this.listeners.push(callback);
    // Immediately call with current state
    setTimeout(() => callback(this.currentUser), 100);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  notifyListeners(user) {
    this.listeners.forEach(callback => callback(user));
  }
}

// Demo Firestore
class DemoFirestore {
  constructor() {
    this.collections = {
      users: new Map(),
      prompts: new Map()
    };
  }

  collection(name) {
    return {
      doc: (id) => ({
        get: () => {
          const data = this.collections[name]?.get(id);
          return Promise.resolve({
            exists: () => !!data,
            data: () => data,
            id
          });
        },
        set: (data) => {
          if (!this.collections[name]) {
            this.collections[name] = new Map();
          }
          this.collections[name].set(id, data);
          return Promise.resolve();
        },
        update: (data) => {
          if (!this.collections[name]) {
            this.collections[name] = new Map();
          }
          const existing = this.collections[name].get(id) || {};
          this.collections[name].set(id, { ...existing, ...data });
          return Promise.resolve();
        },
        delete: () => {
          this.collections[name]?.delete(id);
          return Promise.resolve();
        }
      }),
      get: () => {
        const docs = Array.from(this.collections[name]?.entries() || []).map(([id, data]) => ({
          id,
          data: () => data,
          exists: true
        }));
        return Promise.resolve({ docs });
      }
    };
  }

  doc(path) {
    const [collection, id] = path.split('/');
    return this.collection(collection).doc(id);
  }
}

// Demo Storage
class DemoStorage {
  ref(path) {
    return {
      put: (file) => {
        return Promise.resolve({
          ref: {
            getDownloadURL: () => Promise.resolve(`https://demo.com/images/${file.name}`)
          }
        });
      },
      delete: () => Promise.resolve()
    };
  }
}

export const demoAuth = new DemoAuth();
export const demoDb = new DemoFirestore();
export const demoStorage = new DemoStorage();

