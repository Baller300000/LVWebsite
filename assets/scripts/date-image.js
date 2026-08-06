function updateDateImage() {
    const s = new Date, n = s.getMonth() + 1, e = s.getDate();
    let t = "./assets/images/happy.gif";
    n === 2 && e === 14 ? t = "./assets/seasonal/val.avif" : n === 4 && e === 1 ? t = "./assets/seasonal/teapot.avif" : n === 10 && e === 31 ? t = "./assets/seasonal/spiderweb.avif" : n === 12 && e >= 1 && e <= 30 ? t = "./assets/seasonal/ch.gif" : n === 10 && e === 3 && (t = "./assets/images/boi.jpg"), document.getElementById("dateImage").src = t
}
function handleDateImageClick() {
    const n = new Date, t = n.getMonth() + 1, e = n.getDate(); t === 4 && e === 1 && (window.location.href = "./main/seasonal/aprilfools.html"), t === 12 && e >= 1 && e <= 30 && (window.location.href = "./main/seasonal/christmas.html"), t === 10 && e === 3 && (window.location.href = "./main/seasonal/birthday.html")
}
updateDateImage(), document.getElementById("dateImage").addEventListener("click", handleDateImageClick)