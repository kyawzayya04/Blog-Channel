import React, { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { SwitchTransition, CSSTransition } from "react-transition-group";
import "./pageTransition.css";
import useTheme from "../../hooks/useTheme";

export default function Layout() {
  const nodeRef = useRef(null);
  let location = useLocation();

  // console.log(location.pathname);

  let { isDark } = useTheme();

  useEffect(() => {
    let body = document.body;
    if (isDark) {
      // body class = "bg-dbg"
      body.classList.add("bg-dbg");
    } else {
      // body class = ""
      body.classList.remove("bg-dbg");
    }
  }, [isDark]);

  return (
    <div className={isDark ? `bg-dbg` : `bg-white`}>
      <Navbar />
      {/* dynamic router change content */}
      <SwitchTransition>
        <CSSTransition
          timeout={200}
          classNames="fade"
          key={location.pathname}
          unmountOnExit
          nodeRef={nodeRef}
        >
          <div ref={nodeRef} className="max-w-6xl mx-auto p-3 over">
            <Outlet />
          </div>
        </CSSTransition>
      </SwitchTransition>
    </div>
  );
}
