import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

function App(props) {
  //INITIALIZE VARIABLES
  const path = require("path");
  const [currentPage, setCurrentPage] = useState(0);
  const [visualMode, setVisualMode] = useState(1); //mode 0: cascada mode 1: paginada
  const visualModeInfo = {
    mode0Btn: "Paginada",
    mode1Btn: "Cascada",
  };
  let cache = [];
  //INITIALIZE CACHE
  let img;
  for (let i = props.minNumber; i <= props.maxNumber; i++) {
    img = new Image();
    img.src = process.env.PUBLIC_URL + "/re_monster/cap1/" + i + ".jpg";
    cache.push(img);
  }
  const [currentCache, setCurrentCache] = useState(cache[0]);

  function changeImage(number) {
    let page = currentPage;
    page += number;
    if (page >= 0 && page <= props.maxNumber) {
      setCurrentPage(page);
      setCurrentCache(cache[page]);
    }
  }

  function toImage() {}

  function changeMode() {
    setVisualMode(+!visualMode);
  }

  return (
    <div className="app">
      <NavBarManga
        onNext={() => {
          changeImage(1);
        }}
        onPrevious={() => {
          changeImage(-1);
        }}
        toPage={toImage}
        changeMode={changeMode}
        currentPage={currentPage}
        visualMode={visualMode}
        visualModeInfo={visualModeInfo}
        maxNumber={cache}
      />
      <MangaBody
        currentCache={currentCache}
        allCache={cache}
        visualMode={visualMode}
        onNext={() => {
          changeImage(1);
        }}
        onPrevious={() => {
          changeImage(-1);
        }}
      />
      <NavBarManga
        onNext={() => {
          changeImage(1);
        }}
        onPrevious={() => {
          changeImage(-1);
        }}
        toPage={toImage}
        changeMode={changeMode}
        currentPage={currentPage}
        visualMode={visualMode}
        visualModeInfo={visualModeInfo}
        maxNumber={cache}
      />
    </div>
  );
}

function NavBarManga(props) {
  return (
    <nav className="navbar navbar-dark bg-dark">
      <div className="buttons d-flex justify-content-center">
        <button className="btn btn-secondary m-2" onClick={props.onPrevious}>
          Previous
        </button>
        <button className="btn btn-primary m-2" onClick={props.changeMode}>
          {props.visualModeInfo["mode" + props.visualMode + "Btn"]}
        </button>
        <button className="btn btn-secondary m-2" onClick={props.onNext}>
          Next
        </button>
      </div>
    </nav>
  );
}

function MangaBody(props) {
  let mangaMode0Class = "none";
  let mangaMode1Class = "show";
  let img;
  let imgElements = [];
  for (let i = 0; i < props.allCache.length; i++) {
    img = (
      <img
        src={props.allCache[i].src}
        alt="mangaPages"
        className="mangaPages"
      />
    );
    imgElements.push(img);
  }

  function findLocation(oElement) {
    if (typeof oElement.offsetParent != "undefined") {
      for (var posX = 0, posY = 0; oElement; oElement = oElement.offsetParent) {
        posX += oElement.offsetLeft;
        posY += oElement.offsetTop;
      }
      return [posX, posY];
    } else {
      return [oElement.x, oElement.y];
    }
  }

  function getCoordinates(event) {
    let imgLocation = findLocation(event.target);
    let posX = event.pageX - imgLocation[0];
    let posY = event.pageY - imgLocation[1];
    return [posX, posY];
  }

  function changePage(event) {
    let coordinates = getCoordinates(event);
    if (coordinates[0] > event.target.clientWidth / 2) {
      props.onNext();
    } else {
      props.onPrevious();
    }
  }

  if (props.visualMode) {
    //mode 1: paginada
    mangaMode0Class = mangaMode0Class.replace(/show/, "none");
    mangaMode1Class = mangaMode1Class.replace(/none/, "show");
  } else {
    mangaMode0Class = mangaMode0Class.replace(/none/, "show");
    mangaMode1Class = mangaMode1Class.replace(/show/, "none");
  }

  return (
    <main>
      <div id="mangaContainer">
        <div id="mangaMode0" className={mangaMode0Class}>
          {imgElements}
        </div>
        <div id="mangaMode1" className={mangaMode1Class}>
          <img
            id="mangaPage"
            src={props.currentCache.src}
            alt="mangaPage"
            onClick={changePage}
            className="pointer"
          />
        </div>
      </div>
    </main>
  );
}

export default App;
