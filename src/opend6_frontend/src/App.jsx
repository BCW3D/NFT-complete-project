import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

// components
import Header from "./components/Header";
import Footer from "./components/Footer";
import Discover from "./components/Discover";
import Minter from "./components/Minter";
import Gallery from "./components/Gallery";
import HomeImg from "../../opend6_frontend/public/home-img.png";
import { Principal } from "@dfinity/principal";
import { opend6_backend } from "../../declarations/opend6_backend";
import userId from "./main";
function App() {
  const canisterId = "47iws-5eaaa-aaaaa-qacfa-cai";

  const { state } = useLocation();

  const [nftPrincipal, setNFTprincipal] = useState();
  const [listedNFTprincipal, setLitedNFTprincipal] = useState();

  const getNFTs = async () => {
    const ownedNFTs = await opend6_backend.getOwnedNFTs(userId);
    setNFTprincipal(ownedNFTs);

    const listedNFTs = await opend6_backend.getListedNFTs();

    setLitedNFTprincipal(listedNFTs);
  };

  useEffect(() => {
    getNFTs();
  }, [state]);

  return (
    <div style={{ textAlign: "center" }}>
      <Header />
      <Routes>
        <Route path="/" element={<img src={HomeImg} />} />
        <Route
          path="/discover"
          element={
            <Discover
              title="Discover"
              ids={listedNFTprincipal}
              role="discover"
            />
          }
        />
        <Route path="/minter" element={<Minter />} />
        <Route
          path="/collection"
          element={
            <Gallery title="My NFTs" ids={nftPrincipal} role="collection" />
          }
        />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
