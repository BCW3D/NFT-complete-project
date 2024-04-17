import React, { useEffect, useState } from "react";
import logo from "../../public/logo.png";

import { idlFactory } from "../../../declarations/nft";
import { idlFactory as tokenIdleFactory } from "../../../declarations/token4_backend";

import { Actor, HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { opend6_backend } from "../../../declarations/opend6_backend";
import userId from "../main";
import Price from "./Price";

function Item(props) {
  const [nftName, setName] = useState();
  const [nftOwner, setOwner] = useState();
  const [nftImage, setImage] = useState();
  const [buttonText, setButtonText] = useState("Sell");
  const [hidePriceInput, setHidePriceInput] = useState(true);
  const [price, setPrice] = useState();
  const [loader, setLoader] = useState(true);
  const [blur, setBlur] = useState();
  const [display, setDisplay] = useState("block");
  const [actor, setActor] = useState();
  const [priceDisplay, setPriceDisplay] = useState("none");
  const [dispalyItem, setdisplayItem] = useState("inline");

  const localHost = "http://127.0.0.1:4943/";

  const agent = new HttpAgent({ host: localHost });
  agent.fetchRootKey();

  const id = props.id;

  const loadNFTs = async () => {
    const nftActor = Actor.createActor(idlFactory, { agent, canisterId: id });
    setActor(nftActor);
    const name = await nftActor.getName();
    setName(name);
    const owner = await nftActor.getOwner();
    setOwner(owner.toText());
    const imageData = await nftActor.getImage();
    const imageArray = new Uint8Array(imageData);
    const image = URL.createObjectURL(
      new Blob([imageArray.buffer, { type: "image/png" }])
    );
    setImage(image);

    if (props.role === "collection") {
      const isListedResult = await opend6_backend.isListed(id);
      const nftPrice = await opend6_backend.getNFTprice(id);
      if (isListedResult) {
        setOwner("Opend");
        setDisplay("none");
        setBlur({ filter: "blur(3px)" });
        setPrice(nftPrice.toString());
        setPriceDisplay("block");
      }
    } else if (props.role === "discover") {
      const originalOwner = await opend6_backend.getOriginalOwner(id);
      if (originalOwner.toText() === userId.toText()) {
        const nftPrice = await opend6_backend.getNFTprice(id);

        setDisplay("none");
        setOwner("Opend");
        setPrice(nftPrice.toString());
        setPriceDisplay("block");
      } else {
        const isListedResult = await opend6_backend.isListed(id);
        const nftPrice = await opend6_backend.getNFTprice(id);
        if (isListedResult) {
          setOwner("Opend");
          setDisplay("block");
          setButtonText("Buy");
          setPriceDisplay("block");
          setBlur();
          setPrice(nftPrice.toString());
        }
      }
      // console.log("owner" + originalOwner.toText());
      // console.log("user" + userId.toText());
    }
  };

  useEffect(() => {
    loadNFTs();
  }, []);

  //handleSell
  const handleSellButton = () => {
    console.log("Sell");
    setButtonText("Confirm");
    setHidePriceInput(false);
  };

  const handleChange = (e) => {
    setPrice(e.target.value);
  };
  //handleConfimr
  const handleConfirm = async () => {
    setLoader(
      <div className="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    );
    setBlur({ filter: "blur(4px)" });
    const listItemResult = await opend6_backend.listItem(id, Number(price));

    if (listItemResult == "Success") {
      const newOwner = await opend6_backend.getOpendCanisterId();
      const transferOwner = await actor.transferOwnership(newOwner);
      if (transferOwner === "Success") {
        setDisplay("none");
        setOwner("Opend");
        setHidePriceInput(true);
      }
    } else {
      return "You are not owner of this NFT";
    }

    setLoader();
  };

  //handleBuy

  const handleBuy = async () => {
    console.log("Buy clicked");

    const tokenActor = Actor.createActor(tokenIdleFactory, {
      agent,
      canisterId: "724nz-amaaa-aaaaa-qacoq-cai",
    });

    const sellerId = await opend6_backend.getOriginalOwner(id);
    const itemPrice = await opend6_backend.getNFTprice(id);

    const result = await tokenActor.transfer(sellerId, itemPrice);

    console.log(result);

    if (result === "success") {
      const transferResult = await opend6_backend.completePurchase(
        id,
        sellerId,
        userId
      );
      setdisplayItem("none");
      console.log(transferResult);
    }
  };

  return (
    <div
      style={{ textAlign: "center", display: dispalyItem }}
      className="disGrid-item"
    >
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          style={blur}
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={nftImage}
        />

        <div className="disCardContent-root">
          <Price display={priceDisplay} price={price} />
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {nftName}
            <span className="purple-text"></span>
          </h2>
          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {nftOwner}
          </p>

          {loader}
          <input
            hidden={hidePriceInput}
            placeholder="Price in DANG"
            type="number"
            className="price-input"
            value={price}
            onChange={handleChange}
          />
          {display === "block" && (
            <div className="Chip-root makeStyles-chipBlue-108 Chip-clickable">
              <span
                onClick={
                  buttonText === "Sell"
                    ? handleSellButton
                    : buttonText === "Confirm"
                    ? handleConfirm
                    : handleBuy
                }
                className="form-Chip-label"
              >
                {buttonText}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Item;
