import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  sendEmailVerification
} from "firebase/auth";
import { auth } from "./config";

export const signIn = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signUp = async (email, password, shouldSendVerification = true) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  if (shouldSendVerification && userCredential.user) {
    try {
      await sendEmailVerification(userCredential.user);
    } catch (err) {
      console.warn("Could not send verification email automatically:", err);
    }
  }
  return userCredential;
};

export const resetPassword = (email) => {
  return sendPasswordResetEmail(auth, email);
};

export const sendVerification = (user = auth.currentUser) => {
  if (!user) throw new Error("No user to verify.");
  return sendEmailVerification(user);
};

export const logOut = () => {
  return signOut(auth);
};

export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export const updateUserCredentials = async ({ currentPassword, newEmail, newPassword }) => {
  const user = auth.currentUser;
  if (!user) throw new Error("No active user session.");

  // Re-authenticate user before critical changes
  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);

  if (newEmail && newEmail !== user.email) {
    await updateEmail(user, newEmail);
  }

  if (newPassword) {
    if (newPassword.length < 6) {
      throw new Error("New password must be at least 6 characters.");
    }
    await updatePassword(user, newPassword);
  }

  return true;
};

