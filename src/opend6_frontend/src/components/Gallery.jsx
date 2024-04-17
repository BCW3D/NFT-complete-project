import React from "react";
import Item from "./Item";

function Gallery(props) {
  return (
    <div
      style={{ textAlign: "center", color: "#fff" }}
      className="gallery-view"
    >
      <h3 className="makeStyles-title-99 Typography-h3">{props.title}</h3>
      <div className="disGrid-root disGrid-container disGrid-spacing-xs-2">
        <div className="disGrid-root disGrid-item disGrid-grid-xs-12">
          <div className="disGrid-root disGrid-container disGrid-spacing-xs-5 disGrid-justify-content-xs-center">
            {props.ids.length === 0 ? (
              <h2>No NFT To Show</h2>
            ) : (
              props.ids.map((id) => (
                <Item id={id} key={id.toText()} role={props.role} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Gallery;
