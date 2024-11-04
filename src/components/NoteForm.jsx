import React, { useEffect, useState } from "react";
import useFirestore from "../hooks/useFirestore";
import { useParams } from "react-router-dom";

export default function NoteForm({ type = "create", setEditNote, editNote }) {
  let { id } = useParams();
  let [body, setBody] = useState("");
  let { addCollection, updateDocument } = useFirestore();

  useEffect(() => {
    if (type === "update") {
      setBody(editNote.body);
    }
  }, [type]);

  let submit = async (e) => {
    e.preventDefault();

    if (type === "create") {
      let data = {
        body,
        bookUid: id,
      };

      await addCollection("notes", data);
    } else {
      editNote.body = body;
      await updateDocument("notes", editNote.id, editNote, false);
      setEditNote(null);
    }

    setBody("");
  };

  return (
    <form onSubmit={submit}>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="shadow-md border-2 border-blue-500 text-md bg-gray-50 rounded-lg outline-none w-full p-3 scrollbar-hide"
        cols={30}
        rows={5}
        name=""
        id=""
        required
      ></textarea>
      <div className="flex justify-between">
        <div></div>
        <div
          className="flex space-x-3
        "
        >
          <button
            type="submit"
            className="flex items-center gap-1 text-white bg-primary px-3 py-2 rounded-lg my-3"
          >
            <span>{type === "create" ? "Add" : "Update"} Note</span>
          </button>
          {type === "update" && (
            <button
              type="button"
              onClick={() => setEditNote(null)}
              className="flex items-center gap-1 text-primary border-2 border-primary px-3 py-2 rounded-lg my-3"
            >
              <span>Cancel</span>
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
