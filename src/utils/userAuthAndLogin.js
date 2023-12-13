import { Email } from '@mui/icons-material';
import { auth, db } from '../firebase/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs, query, where, setDoc, doc } from 'firebase/firestore';

const utilUserLogin = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        // Signed in 
        const accessToken = userCredential.user.accessToken;
        // Retrive user data from firestore ---> users collection
        const q = query(collection(db, "users"), where("email", "==", email));
        const querySnapshot = await getDocs(q);
        let obj_user = [];
        if (querySnapshot.docs.length === 1) {
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                obj_user = {
                    accessToken: accessToken,
                    firstName: doc.data().firstName,
                    lastName: doc.data().lastName,
                    role: doc.data().role
                }
            });
        }

        return { user: obj_user, error: null };
    } catch (error) {
        return { user: null, error };
    }
}

const utilUserRegister = async (data, role) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, data.get('email'), data.get('password'));
        const obj_user = {
            firstName: data.get('firstName'),
            lastName: data.get('lastName'),
            email: data.get('email'),
            role
        };
        console.log('obj_user');
        await setDoc(doc(db, "users", userCredential.user.uid), obj_user); // Add a new document in collection "users"
        return { message: 'Thanks for signing up', error: null };
    } catch (error) {
        return { user: null, error };
    }
}

export { utilUserLogin, utilUserRegister }