
const obtenerFecha = ()=>{
    const d_t = new Date();

    let year = d_t.getFullYear();
    let month = ("0" + (d_t.getMonth() + 1)).slice(-2);
    let day = ("0" + d_t.getDate()).slice(-2);
    let hour = d_t.getHours();
    let minute = d_t.getMinutes();
    let seconds = d_t.getSeconds();

    // prints date & time in YYYY-MM-DD HH:MM:SS format
    const fullyear = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + seconds
    return fullyear
}

export default obtenerFecha