import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager 
} from 'firebase/firestore';

const firebaseConfig = {
  projectId: "studio-5354409870-c8f1b",
  appId: "1:376990786346:web:4b9be62bc67527abc5b453",
  storageBucket: "studio-5354409870-c8f1b.firebasestorage.app",
  apiKey: "AIzaSyBWQ7mr2lpeEsUe5Tx_4tBiA3-SOV7wDs8",
  authDomain: "studio-5354409870-c8f1b.firebaseapp.com",
  messagingSenderId: "376990786346",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Multi-tab destekli local cache persistence etkinleştirildi
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
});

export { auth, db, googleProvider };
