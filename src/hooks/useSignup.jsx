import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "../firebase";

export default function useSignup() {
  let [error, setError] = useState(null);
  let [loading, setLoading] = useState(false);

  let signUp = async (email, password) => {
    try {
      setLoading(true);
      let ref = await createUserWithEmailAndPassword(auth, email, password);
      setLoading(false);
      setError("");
      return ref.user;
    } catch (e) {
      setLoading(false);
      setError(e.message);
    }
  };

  return { error, loading, signUp };
}
