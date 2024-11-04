import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useState } from "react";

export default function useSignin() {
  let [error, setError] = useState(null);
  let [loading, setLoading] = useState(false);

  let signIn = async (email, password) => {
    try {
      setLoading(true);
      let ref = await signInWithEmailAndPassword(auth, email, password);
      setLoading(false);
      setError("");
      return ref.user;
    } catch (e) {
      setLoading(false);
      setError(e.message);
    }
  };

  return { error, loading, signIn };
}
