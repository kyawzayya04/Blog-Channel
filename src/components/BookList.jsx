import React, { useContext } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";
import useTheme from "../hooks/useTheme";
import trash from "../assets/delete.svg";
import pencil from "../assets/pencil.svg";
import useFirestore from "../hooks/useFirestore";
import { AuthContext } from "../contexts/AuthContext";

export default function BookList() {
  let location = useLocation();
  let params = new URLSearchParams(location.search);
  let search = params.get(`search`);

  let { isDark } = useTheme();
  let navigate = useNavigate();

  let { getCollection, deleteDocument } = useFirestore();

  let { user } = useContext(AuthContext);

  let {
    error,
    data: books,
    loading,
  } = getCollection("books", ["uid", "==", user.uid], {
    field: "title",
    value: search,
  });

  let deleteBook = async (e, id) => {
    e.preventDefault();

    await deleteDocument("books", id);

    // delete on frontend
    // setBooks((prev) => prev.filter((b) => b.id !== id));
  };

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="mx-1">
      {loading && <p>Loading...</p>}
      {/* book list */}
      {!!books && (
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-4
      my-3"
        >
          {books.map((book) => (
            <Link
              to={`/books/${book.id}`}
              key={book.id}
              className={`p-4 shadow-lg border border-1 rounded-md ${
                isDark ? `bg-dcard border-primary` : ``
              }`}
            >
              <div>
                <img
                  src={book.cover}
                  alt="book_cover"
                  className="rounded-sm mb-3"
                />
                <div className="text-center space-y-3">
                  <h1 className={`font-bold ${isDark ? `text-white` : ``}`}>
                    {book.title}
                  </h1>
                  {/* <p className="text-gray-500">{book.description}</p> */}
                  {/* genres */}
                  <div className="flex flex-wrap justify-between items-center">
                    <div className="flex flex-wrap mb-3">
                      {book.categories.map((category) => (
                        <span
                          className="mx-1 my-1 text-white rounded-2xl px-2 py-1 text-sm bg-blue-600"
                          key={category.id}
                        >
                          {category.title}
                        </span>
                      ))}
                    </div>
                    <div
                      className={`w-full border-t-2 flex justify-between items-center space-x-3 pt-3 ${
                        isDark ? `border-t-gray-500` : `border-t-gray-200`
                      }`}
                    >
                      <img
                        className="bg-blue-500 p-2 rounded-full"
                        src={pencil}
                        alt=""
                        onClick={(e) => {
                          e.preventDefault(e);
                          navigate(`/edit/${book.id}`);
                        }}
                      />
                      <img
                        className="bg-red-500 p-2 rounded-full"
                        src={trash}
                        alt=""
                        onClick={(e) => deleteBook(e, book.id)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      {books && !books.length && (
        <p className="text-center text-xl text-gray-500 mt-10">
          No Search Results Found !
        </p>
      )}
    </div>
  );
}
