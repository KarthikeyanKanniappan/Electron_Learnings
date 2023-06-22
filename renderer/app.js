let content = document.getElementById("show-content");
let dataFetch = document.getElementById("fetchData");
let dataFetchbtn = document.querySelector(".modalbtn");

dataFetchbtn.addEventListener("click", () => {
  let modalData = dataFetch.value;
  window.electronAPI.fetchData(modalData);
});

window.electronAPI.getData((event, value) => {
  console.log(value);
});

window.addEventListener("DOMContentLoaded", () => {
  window.electronAPI.command((event, value) => {
    console.log(value);
    //   const blob = new Blob([value], { type: "image/png" });
    //   const url = URL.createObjectURL(blob);
    //   console.log(url);
    let source = document.getElementById("screenshot");

    source.src = value;
  });
});
