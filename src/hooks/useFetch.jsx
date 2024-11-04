import { useEffect, useState } from "react";

function useFetch(url, method = "GET") {
  let [data, setData] = useState(null);
  let [postData, setPostData] = useState(null);
  let [loading, setLoading] = useState(false);
  let [error, setError] = useState(null);

  useEffect(() => {
    let abortController = new AbortController();
    let signal = abortController.signal;
    let options = {
      signal,
      method,
    };
    let fetchData = () => {
      fetch(url, options)
        .then((response) => {
          if (!response.ok) {
            throw Error("Something went wrong !");
          }
          return response.json();
        })
        .then((data) => {
          setData(data);
          setError(null);
          setLoading(false);
        })
        .catch((e) => {
          setError(e.message);
        });
    };

    setLoading(true);
    if (method === "POST" && postData) {
      options = {
        ...options,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      };
      fetchData();
    }

    if (method === "GET") {
      fetchData();
    }

    // cleanup function
    return () => {
      // console.log("Clean Up Function Running !");
      abortController.abort();
    };
  }, [url, postData, method]);

  return { setPostData, data, loading, error };
}

export default useFetch;
