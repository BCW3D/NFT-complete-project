import React, { useState } from "react";

function Price(props) {
  return (
    <div
      style={{ display: props.display }}
      className="disButtonBase-root disChip-root makeStyles-price-23 disChip-outlined"
    >
      <span className="disChip-label">{props.price} DANG</span>
    </div>
  );
}

export default Price;
