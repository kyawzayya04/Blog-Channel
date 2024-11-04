import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import default_user from "../assets/default_user.svg";
import useTheme from "../hooks/useTheme";
import lightIcon from "../assets/light.svg";
import darkIcon from "../assets/dark.svg";
import useSignout from "../hooks/useSignout";
import { AuthContext } from "../contexts/AuthContext";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase";
import useFirestore from "../hooks/useFirestore";

export default function Navbar() {
  let params = new URLSearchParams(location.search);
  let searchedValue = params.get(`search`);

  let [search, setSearch] = useState(searchedValue);
  let { user } = useContext(AuthContext);
  let { isDark, changeTheme } = useTheme();
  let { logOut } = useSignout();
  let [menuOpen, setMenuOpen] = useState(false); // Burger menu state
  let navigate = useNavigate();
  let [profile, setProfile] = useState("");
  let [file, setFile] = useState("");
  // let { addCollection, getCollection } = useFirestore();

  // let uploadProfileToFirebase = async (file) => {
  //   let uniqueFileName = `${Date.now().toString()}_${file.name}`;
  //   let path = `/profiles/${user.uid}/${uniqueFileName}`;
  //   let storageRef = ref(storage, path);
  //   await uploadBytes(storageRef, file);
  //   return await getDownloadURL(storageRef);
  // };

  // let submitProfile = async (e) => {
  //   e.preventDefault();

  //   if (!file) return;

  //   let url = await uploadProfileToFirebase(file);

  //   await addCollection("profiles", profileData);
  // };

  let handlePhotoChange = (e) => {
    setFile(e.target.files[0]);
  };

  let handlePreviewImage = (file) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      setProfile(reader.result);
    };
  };

  useEffect(() => {
    if (file) {
      handlePreviewImage(file);
    }
  }, [file]);

  let searchHandler = (e) => {
    e.preventDefault();
    navigate(`/?search=${search}`);
    setMenuOpen(false);
  };

  let signOutUser = async () => {
    await logOut();
    navigate("/login");
  };

  // Toggle burger menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      <nav
        className={`w-full fixed backdrop-blur-md border border-b-1 border-t-0 -mt-0 ${
          isDark ? `bg-transparent border-primary` : `bg-transparent`
        }`}
      >
        <ul className="flex justify-between items-center p-3 max-w-6xl mx-auto">
          {/* Left section - Search and Home */}
          <li className="flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className={`size-6 ${isDark ? `text-white` : ``}`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
            <form onSubmit={searchHandler}>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="Search blogs..."
                className={`outline-none h-10 indent-2 rounded-md placeholder-gray-500 ${
                  isDark ? `bg-white` : `bg-white`
                }`}
              />
            </form>
          </li>
          <Link
            to={`/`}
            onClick={() => {
              setSearch("");
              setMenuOpen(false);
            }}
            className="flex items-center gap-3 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`size-6 ${isDark ? `text-white` : ``}`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z"
              />
            </svg>
            <span className="text-2xl font-bold hidden md:block text-primary">
              Blog Channel
            </span>
          </Link>

          {/* Burger menu icon for mobile */}
          {!menuOpen && (
            <button onClick={toggleMenu} className="sm:hidden p-2 text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 6.75h15m-15 5.25h15m-15 5.25h15"
                />
              </svg>
            </button>
          )}

          {menuOpen && (
            <button onClick={toggleMenu} className="sm:hidden p-2 text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}

          {/* Main navigation - desktop and mobile */}
          <li className="hidden sm:flex gap-3 items-center">
            {/* create book */}
            <Link
              to="/create"
              className="flex items-center gap-1 text-white bg-primary px-3 py-2 rounded-lg"
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
              <span className="hidden md:block">Create Blog</span>
            </Link>
            {/* profile image */}
            {user && !profile && (
              <form className="w-11 flex justify-center items-center space-x-2">
                <label>
                  <img
                    src={default_user}
                    alt="profile_img"
                    className="w-11 rounded-full cursor-pointer"
                  />
                  <input
                    type="file"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                </label>
                {/* <button
                  type="submit"
                  className="border-2 border-primary text-primary rounded-lg px-2 py-1"
                >
                  Save
                </button> */}
              </form>
            )}
            {user && !!profile && (
              <form className="w-11 flex justify-center items-center space-x-2">
                <label>
                  <img
                    src={profile}
                    alt="profile_img"
                    className="w-11 rounded-full cursor-pointer"
                  />
                  <input
                    type="file"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                </label>
                {/* <button
                  type="submit"
                  className="border-2 border-primary text-primary rounded-lg px-2 py-1"
                >
                  Save
                </button> */}
              </form>
            )}

            {/* light & dark mode */}
            <div className="flex justify-center items-center cursor-pointer">
              {isDark ? (
                <img
                  onClick={() => changeTheme("light")}
                  className="w-10 bg-yellow-300 rounded-full p-1"
                  src={lightIcon}
                  alt="lightIcon"
                />
              ) : (
                <img
                  onClick={() => changeTheme("dark")}
                  className="w-10 bg-slate-950 rounded-full p-1"
                  src={darkIcon}
                  alt="darkIcon"
                />
              )}
            </div>
            <div className="space-x-3">
              {!user && (
                <>
                  <Link
                    to={`/login`}
                    className="border-2 border-primary text-primary text-md rounded-lg px-2 py-2"
                  >
                    Log In
                  </Link>
                  <Link
                    to={`/register`}
                    className="bg-primary text-white text-md rounded-lg px-2 py-2"
                  >
                    Register
                  </Link>
                </>
              )}
              {!!user && (
                <button
                  onClick={() => {
                    signOutUser();
                    setMenuOpen(false);
                  }}
                  className="bg-red-500 text-white text-md rounded-lg px-2 py-2"
                >
                  Log Out
                </button>
              )}
            </div>
          </li>
        </ul>

        {/* Mobile Menu */}
        <div
          className={`fixed h-auto w-full bg-primary transform ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-300 ease-in-out sm:hidden p-4`}
        >
          {/* Mobile navigation links */}
          <ul className="space-y-8 text-lg p-5 text-white rounded-br-md rounded-bl-md ">
            <li>
              {user && !profile && (
                <form className="w-20 flex justify-center items-center space-x-2">
                  <label>
                    <img
                      src={default_user}
                      alt="profile_img"
                      className="w-full rounded-full cursor-pointer"
                    />
                    <input
                      type="file"
                      className="hidden"
                      onChange={handlePhotoChange}
                    />
                  </label>
                  {/* <button
                  type="submit"
                  className="border-2 border-primary text-primary rounded-lg px-2 py-1"
                >
                  Save
                </button> */}
                </form>
              )}
              {user && !!profile && (
                <form className="w-20 flex justify-center items-center space-x-2">
                  <label>
                    <img
                      src={profile}
                      alt="profile_img"
                      className="w-full rounded-full cursor-pointer"
                    />
                    <input
                      type="file"
                      className="hidden"
                      onChange={handlePhotoChange}
                    />
                  </label>
                  {/* <button
                  type="submit"
                  className="border-2 border-primary text-primary rounded-lg px-2 py-1"
                >
                  Save
                </button> */}
                </form>
              )}
            </li>
            <li>
              <Link
                onClick={() => setMenuOpen(false)}
                to="/create"
                className="inline-flex items-center gap-1 text-primary tracking-wide font-bold bg-white px-3 py-2 rounded-lg"
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
                <span className="">Create Book</span>
              </Link>
            </li>
            <li>
              <div className="font-bold tracking-wide cursor-pointer">
                {isDark ? (
                  <div
                    onClick={() => {
                      changeTheme("light");
                    }}
                    className="inline-flex bg-yellow-300 items-center rounded-md p-1 text-dbg gap-2"
                  >
                    <span className="p-1">Light Mode</span>
                    <img className="w-10 p-1" src={lightIcon} alt="lightIcon" />
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      changeTheme("dark");
                    }}
                    className="inline-flex bg-slate-950 rounded-md p-1 items-center gap-2"
                  >
                    <span className="p-1">Dark Mode</span>
                    <img
                      className="w-10 rounded-full p-1"
                      src={darkIcon}
                      alt="darkIcon"
                    />
                  </div>
                )}
              </div>
            </li>
            <li>
              <div className="space-x-3 font-bold tracking-wide">
                {!user && (
                  <>
                    <Link
                      onClick={() => setMenuOpen(false)}
                      to={`/login`}
                      className="border-2 border-white text-white text-md rounded-lg px-2 py-2"
                    >
                      Log In
                    </Link>
                    <Link
                      onClick={() => setMenuOpen(false)}
                      to={`/register`}
                      className="bg-white text-primary text-md rounded-lg px-2 py-2"
                    >
                      Register
                    </Link>
                  </>
                )}
                {!!user && (
                  <button
                    onClick={() => {
                      signOutUser();
                      setMenuOpen(false);
                    }}
                    className="bg-red-500 text-white text-md rounded-lg px-2 py-2"
                  >
                    Log Out
                  </button>
                )}
              </div>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}
