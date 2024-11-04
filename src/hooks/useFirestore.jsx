import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { db } from "../firebase";
import useTheme from "./useTheme";

export default function useFirestore() {
  // get collection
  let getCollection = (collectionName, _q, search) => {
    let qRef = useRef(_q).current;
    let [error, setError] = useState(null);
    let [loading, setLoading] = useState(false);
    let [data, setData] = useState([]);

    let { isDark, changeTheme } = useTheme();

    useEffect(
      function () {
        setLoading(true);
        let ref = collection(db, collectionName);
        let queries = [];
        if (qRef) {
          queries.push(where(...qRef));
        }
        queries.push(orderBy("date", "desc"));
        let q = query(ref, ...queries);
        onSnapshot(q, (docs) => {
          if (docs.empty) {
            setError(
              <p
                className={
                  isDark ? `text-white text-center mt-10` : `text-center mt-10`
                }
              >
                No Documents Found!
              </p>
            );
            setLoading(false);
            setData([]);
          } else {
            let collectionDatas = [];
            docs.forEach((doc) => {
              let document = {
                id: doc.id,
                ...doc.data(),
              };
              collectionDatas.push(document);
            });

            if (search?.field && search?.value) {
              let searchedDatas = collectionDatas.filter((doc) => {
                return doc[search?.field]
                  .toLowerCase()
                  .includes(search?.value.toLowerCase());
              });
              setData(searchedDatas);
            } else {
              setData(collectionDatas);
            }

            setLoading(false);
            setError(null);
          }
        });
      },
      [qRef, search?.field, search?.value]
    );

    // useEffect(
    //   function () {
    //     setLoading(true);
    //     let ref = collection(db, collectionName);
    //     let queries = [];
    //     if (qRef) {
    //       queries.push(where(...qRef));
    //     }
    //     queries.push(orderBy("date", "desc"));
    //     let q = query(ref, ...queries);

    //     // Listen for changes in the collection
    //     const unsubscribe = onSnapshot(q, (docs) => {
    //       if (docs.empty) {
    //         setData([]); // Set data to an empty array if no documents are found
    //         setError(
    //           <p className={isDark ? `text-white` : ``}>No Documents Found!</p>
    //         );
    //         setLoading(false);
    //       } else {
    //         let collectionDatas = [];
    //         docs.forEach((doc) => {
    //           let document = {
    //             id: doc.id,
    //             ...doc.data(),
    //           };
    //           collectionDatas.push(document);
    //         });
    //         setData(collectionDatas);
    //         setLoading(false);
    //         setError(null);
    //       }
    //     });

    //     // Clean up the listener on component unmount
    //     return () => unsubscribe();
    //   },
    //   [qRef]
    // );

    return { error, data, loading };
  };

  // get document
  let getDocument = (collectionName, id) => {
    let [error, setError] = useState("");
    let [loading, setLoading] = useState(false);
    let [data, setData] = useState(null);

    useEffect(() => {
      setLoading(true);
      let ref = doc(db, collectionName, id);
      onSnapshot(ref, (doc) => {
        if (doc.exists) {
          let document = {
            id: doc.id,
            ...doc.data(),
          };
          setData(document);
          setLoading(false);
          setError("");
        } else {
          setError("No documents found !");
          setLoading(false);
        }
      });
    }, [id]);

    return { error, data, loading };
  };

  // add collection
  let addCollection = async (collectionName, data) => {
    data.date = serverTimestamp();
    let ref = collection(db, collectionName);
    return addDoc(ref, data);
  };

  // update document
  let updateDocument = async (collectionName, id, data, updateDate = true) => {
    if (updateDate) {
      data.date = serverTimestamp();
    }
    let ref = doc(db, collectionName, id);
    return updateDoc(ref, data);
  };

  // delete document
  let deleteDocument = async (collectionName, id) => {
    let ref = doc(db, collectionName, id);
    // delete on backend
    return deleteDoc(ref);
  };

  return {
    getCollection,
    getDocument,
    addCollection,
    deleteDocument,
    updateDocument,
  };
}
