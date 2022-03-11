export default function checkPage() {
    let url = window.location.href;
    if(!(url.includes("profile") || url.includes("group") || url.includes("calendar") || url.includes("routing"))){
        let item = document.getElementsByClassName("burger")[0];
        item.style.display = "none";
    } else {
            let item = document.getElementsByClassName("burger")[0];
            item.style.display = "block";
    }
}