import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import firebaseConfig from "../../config/firebase-config.js";

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const uploadFileOnFirebase = async (fileName, buffer, metadata) => {
    try {
        // Create a storage reference
        const storageRef = ref(storage, fileName);

        // Upload file and metadata to the object 'images/mountains.jpg'
        const uploadTask = uploadBytesResumable(storageRef, buffer, metadata);

        // Listen for state changes, errors, and completion of the upload.
        return new Promise((resolve, reject) => {
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                },
                (error) => {
                    console.log("ERROR: while uploading file in firebase", error);
                    reject(error);
                },
                async () => {
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        console.log('File available at', downloadURL);
                        resolve(downloadURL);
                    } catch (error) {
                        reject(error);
                    }
                }
            );
        });
    } catch (error) {
        console.log("ERROR: while uploading file in firebase");
        throw new Error(error);
    }
}

export default uploadFileOnFirebase;