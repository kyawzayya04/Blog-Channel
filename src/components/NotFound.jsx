import React, { useEffect } from "react";
import useFetch from "../hooks/useFetch";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  let { data, loading, error } = useFetch();
  let navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate(`/`);
    }, 2000);
  }, [error, navigate]);

  return <div className="mt-20">NotFound</div>;
}
