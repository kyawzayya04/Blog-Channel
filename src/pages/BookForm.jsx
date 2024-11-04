import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useTheme from "../hooks/useTheme";
import { db, storage } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import useFirestore from "../hooks/useFirestore";
import { AuthContext } from "../contexts/AuthContext";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export default function Create() {
  let { id } = useParams();
  let [title, setTitle] = useState("");
  let [description, setDescription] = useState("");
  let [newCategory, setNewCategory] = useState("");
  let [categories, setCategories] = useState([]);
  let [isEdit, setIsEdit] = useState(false);
  let [file, setFile] = useState("");
  let [preview, setPreview] = useState("");

  let { isDark } = useTheme();
  let { updateDocument, addCollection } = useFirestore();

  let navigate = useNavigate();

  // ______________________________________________________________

  let handlePhotoChange = (e) => {
    let selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  let handlePreviewImage = (file) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      setPreview(reader.result);
    };
  };

  useEffect(() => {
    if (file) {
      handlePreviewImage(file);
    }
  }, [file]);

  useEffect(() => {
    if (id) {
      // edit form
      setIsEdit(true);
      let ref = doc(db, "books", id);
      getDoc(ref).then((doc) => {
        let { title, description, categories, cover } = doc.data();
        setTitle(title);
        setDescription(description);
        setCategories(categories);
        setPreview(cover);
      });
    } else {
      // create form
      setIsEdit(false);
      setTitle("");
      setDescription("");
      setCategories([]);
      setPreview("");
    }
  }, [id]);

  // ______________________________________________________________

  let addCategory = () => {
    if (
      newCategory &&
      categories.some(
        (category) => category.title.toLowerCase() === newCategory.toLowerCase()
      )
    ) {
      setNewCategory("");
      return;
    }

    if (!newCategory.trim()) {
      setNewCategory("");
      return;
    }

    let newCatObj = {
      id: Math.random(),
      title: newCategory,
    };

    setCategories((prev) => [newCatObj, ...prev]);
    setNewCategory("");
  };

  // ______________________________________________________________

  let deleteCategory = (id) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  // ______________________________________________________________

  let { user } = useContext(AuthContext);

  let uploadImageToFirebase = async (file) => {
    let uniqueFileName = Date.now().toString() + "_" + file.name;
    let path = `/covers/${user.uid}/${uniqueFileName}`;
    let storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  let submitForm = async (e) => {
    e.preventDefault();
    let url = await uploadImageToFirebase(file);

    let data = {
      title,
      description,
      categories,
      uid: user.uid,
      cover: url,
    };

    if (isEdit) {
      await updateDocument("books", id, data);
    } else {
      await addCollection("books", data);
    }

    navigate("/");
  };

  // ______________________________________________________________

  return (
    <form className="w-[95%] sm:max-w-md mx-auto mt-20" onSubmit={submitForm}>
      <div className="mb-5">
        <label
          className={`uppercase tracking-wider block mb-3 text-sm font-medium ${
            isDark ? `text-white` : `text-dark`
          }`}
        >
          Book Title
        </label>
        <div className="flex justify-center items-center space-x-2 mb-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            className="shadow-sm bg-gray-50 border text-gray-700 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-3 dark:bg-white dark:border-gray-400 dark:placeholder-gray-400 outline-primary"
            placeholder="Book Title"
          />
        </div>
      </div>
      <label
        className={`uppercase tracking-wider block mb-3 text-sm font-medium ${
          isDark ? `text-white` : `text-dark`
        }`}
      >
        Book Description
      </label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows="4"
        className="block p-2.5 w-full text-sm text-gray-700 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-white-700 dark:border-gray-400 dark:placeholder-gray-400 dark:text-dark dark:focus:ring-primary dark:focus:border-primary outline-primary scrollbar-hide mb-8"
        placeholder="Description here..."
        required
      ></textarea>
      <div className="mb-5">
        <label
          className={`uppercase tracking-wider block mb-3 text-sm font-medium ${
            isDark ? `text-white` : `text-dark`
          }`}
        >
          Add Categories
        </label>
        <div className="flex justify-center items-center space-x-2 mb-3">
          <input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            type="text"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-700 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-3 dark:bg-white dark:border-gray-400 dark:placeholder-gray-400 dark:text-dark dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light outline-primary"
            placeholder="Book Category"
          />
          <button
            type="button"
            onClick={addCategory}
            className="bg-primary p-3 text-white rounded-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </button>
        </div>
        <div className="flex flex-wrap">
          {categories.map((category) => (
            <div
              className="flex items-center gap-2 mx-1 my-1 text-white rounded-2xl px-2 py-1 text-sm bg-primary"
              key={category.id}
            >
              <span>{category.title}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 rounded-full bg-white text-primary cursor-pointer"
                onClick={() => deleteCategory(category.id)}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-5">
        <label
          className={`uppercase tracking-wider block mb-3 text-sm font-medium ${
            isDark ? `text-white` : `text-dark`
          }`}
        >
          Upload Image
        </label>
        <div className="flex flex-col justify-center items-center space-x-2 mb-3">
          <input
            onChange={handlePhotoChange}
            type="file"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-700 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-3 dark:bg-white dark:border-gray-400 dark:placeholder-gray-400 dark:text-dark dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light outline-primary"
            required
          />
          {!!preview && (
            <img src={preview} alt="" className="my-3" width={500} />
          )}
        </div>
      </div>
      <button
        to="/create"
        className="w-full flex justify-center items-center text-center gap-1 text-white bg-primary py-3 rounded-lg"
      >
        {!isEdit && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        )}
        {isEdit && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
        )}
        <span className="text-md tracking-wide ms-1">
          {isEdit ? `Update` : `Create`} Book
        </span>
      </button>
    </form>
  );
}
