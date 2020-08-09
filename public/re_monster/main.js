//GLOBAL VARIABLES
let visualModeInfo = {
  Mode_1BtnText: "Cascada",
  Mode_0BtnText: "Paginada",
};
let visualMode = 1; //MODE 1: PAGINATED MODE 0: CASCADE
let maxNumber = 23;
let minNumber = 0;
let dir = "./cap1/";
//CREATE SELECT IN NAVBAR
select = document.createElement("select");
select.id = "selectPage";
select.className = "pointer form-control m-2";
for (let i = minNumber; i <= maxNumber; i++) {
  option = document.createElement("option");
  option.value = i;
  option.innerHTML = i + 1;
  select.appendChild(option);
}
document.getElementById("buttons").appendChild(select);

let myCache = new ImageCache(dir, minNumber, maxNumber);
myCache.firstImg("mangaPage");

//SELECT FEATURE
document.getElementById("selectPage").addEventListener(
  "change",
  function () {
    select = document.getElementById("selectPage");
    myCache.goToPage(select.options[select.selectedIndex].value);
  },
  false
);
mangaPage = document.getElementById("mangaPage");
mangaPage.onclick = changePage;

//NEXT BUTTON
document.querySelectorAll(".btnNext").forEach((item) => {
  item.addEventListener(
    "click",
    function () {
      if (visualMode == 1) myCache.nextImage("mangaPage");
    },
    false
  );
});

//PREVIOUS BUTTON
document.querySelectorAll(".btnPrevious").forEach((item) => {
  item.addEventListener(
    "click",
    function () {
      if (visualMode == 1) myCache.previousImage("mangaPage");
    },
    false
  );
});

document.querySelectorAll(".visualModeBtn").forEach((item) => {
  item.addEventListener(
    "click",
    function () {
      visualMode = !visualMode;
      document.querySelectorAll(".visualModeBtn").forEach((item) => {
        item.innerHTML =
          visualModeInfo["Mode_" + String(+visualMode) + "BtnText"];
      });
      //DETERMINE MODE VISUALIZATION CONTENT
      switch (+visualMode) {
        case 1: //CHANGE TO PAGINATED MODE
          mangaMode1 = document.getElementById("mangaMode1");
          mangaMode0 = document.getElementById("mangaMode0");
          mangaMode1.className = mangaMode1.className.replace(/none/, "show");
          mangaMode0.className = mangaMode1.className.replace(/show/, "none");
          break;
        case 0: //CHANGE TO CASCADE MODE
          mangaMode1 = document.getElementById("mangaMode1");
          mangaMode0 = document.getElementById("mangaMode0");
          if (!mangaMode0.hasChildNodes()) {
            for (let i = 0; i < myCache.cache.length; i++) {
              createImgTag(mangaMode0, myCache.cache[i].src);
            }
          }
          mangaMode1.className = mangaMode1.className.replace(/show/, "none");
          mangaMode0.className = mangaMode1.className.replace(/none/, "show");
          break;
      }
      window.scrollTo(0, 0);
    },
    false
  );
});
