import React from "react";
import logo from "../../public/logo.png";
import { BrowserRouter, Link, useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";

function Header() {
  const navigate = useNavigate();

  return (
    <div className="app-root-1">
      <header className="Paper-root AppBar-root AppBar-positionStatic AppBar-colorPrimary Paper-elevation4">
        <div className="Toolbar-root Toolbar-regular header-appBar-13 Toolbar-gutters">
          <div className="header-left-4"></div>
          <img className="header-logo-11" src={logo} />
          <div className="header-vertical-9"></div>
          <Link
            to="/"
            onClick={(e) => {
              e.preventDefault();
              navigate("/", { state: nanoid() });
            }}
          >
            <h5 className="Typography-root header-logo-text">OpenD</h5>
          </Link>
          <div className="header-empty-6"></div>
          <div className="header-space-8"></div>
          <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
            <Link
              to="/discover"
              onClick={(e) => {
                e.preventDefault();
                navigate("/discover", { state: nanoid() });
              }}
            >
              Discover
            </Link>
          </button>
          <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
            <Link to="/minter">Minter</Link>
          </button>
          <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
            <Link
              to="/collection"
              onClick={(e) => {
                e.preventDefault();
                navigate("/collection", { state: nanoid() });
              }}
            >
              My NFTs
            </Link>
          </button>
        </div>
      </header>
    </div>
  );
}

export default Header;
