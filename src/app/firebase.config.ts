import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyCSzEQqu5lDoygdtrIyYzOUgz7SbynT8fw',
  authDomain: 'localstorage-95f97.firebaseapp.com',
  databaseURL: 'https://localstorage-95f97-default-rtdb.firebaseio.com',
  projectId: 'localstorage-95f97',
  storageBucket: 'localstorage-95f97.firebasestorage.app',
  messagingSenderId: '574220871885',
  appId: '1:574220871885:web:42f5911cd46838bf2a6184'
};

const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);