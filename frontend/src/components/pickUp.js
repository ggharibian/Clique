import React, { useEffect, useState } from "react"

function pickUp(id,close) {
    const modal = document.getElementById(id);
    const span = document.getElementsByClassName(close)[0];
    modal.style.display = "block";
    span.onclick = function() {
        modal.style.display = "none";
    }
}

export default pickUp;
