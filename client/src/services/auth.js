import firebaseApp from './firebaseService'
import { getAuth } from 'firebase/auth'

const auth = getAuth(firebaseApp);

export default auth;