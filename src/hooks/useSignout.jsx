import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useState } from "react";

export default function useLogOut() {
  let [error, setError] = useState(null);
  let [loading, setLoading] = useState(false);

  let logOut = async () => {
    try {
      setLoading(true);
      let ref = await signOut(auth);
      setLoading(false);
      setError("");
      return ref.user;
    } catch (e) {
      setLoading(false);
      setError(e.message);
    }
  };

  return { error, loading, logOut };
}
