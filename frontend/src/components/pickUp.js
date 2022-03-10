import React, { useEffect, useState } from "react"

function pickUp(id,closeId) {
    const modal = document.getElementById(id);
    const span = document.getElementById(closeId);
    modal.style.display = "block";
    span.onclick = function() {
        modal.style.display = "none";
    }
}

export default pickUp;
