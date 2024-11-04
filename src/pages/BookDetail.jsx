import { useParams } from "react-router-dom";

import useTheme from "../hooks/useTheme";
import useFirestore from "../hooks/useFirestore";
import NoteForm from "../components/NoteForm";
import NoteList from "../components/NoteList";

export default function BookDetail() {
  let { id } = useParams();
  let { isDark } = useTheme();

  let { getDocument } = useFirestore();

  let { error, data: book, loading } = getDocument("books", id);

  return (
    <>
      {error && <p className="mt-20">{error}</p>}
      {loading && <p className="">Loading...</p>}
      {book && (
        <>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 mt-20 mx-3">
            <div className="flex justify-center">
              <img
                className="w-[400px] sm:w-[500px] h-auto rounded-md"
                src={book.cover}
                alt="book_cover"
              />
            </div>
            <div className="space-y-4">
              <h1
                className={`text-3xl font-bold mb-6 ${
                  isDark ? `text-white` : ``
                }`}
              >
                {book.title}
              </h1>
              <div className="flex flex-wrap gap-3">
                {book.categories.map((category) => (
                  <span
                    className="bg-blue-500 text-white rounded-full text-sm px-2 py-1"
                    key={category.id}
                  >
                    {category.title}
                  </span>
                ))}
              </div>
              <p className={`${isDark ? `text-white` : ``}`}>
                {book.description}
              </p>
            </div>
          </div>
          <div className="mx-3 my-10">
            <h3 className="font-bold text-xl text-primary my-3 text-center">
              My Notes
            </h3>
            <NoteForm />
            <NoteList />
          </div>
        </>
      )}
    </>
  );
}
