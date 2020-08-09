import React from "react";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pages: {
        min: props.minNumber,
        max: props.maxNumber,
        dir: props.dir,
      },
      visualModeInfo: {
        mode0: "Cascada",
        mode1: "Paginada",
      },
      visualMode: 1,
      currentCache: "",
      currentPage: 0,
    };
    this.cache = [];
    let img;
    for (let i = this.state.pages.min; i <= this.state.pages.max; i++) {
      img = new Image();
      img.src = process.env.PUBLIC_URL + this.state.pages.dir + i + ".jpg";
      this.cache.push(img);
    }
    this.state.currentCache = this.cache[0].src;
    this.nextImage = this.nextImage.bind(this);
    this.previousImage = this.previousImage.bind(this);
    this.toImage = this.toImage.bind(this);
    this.changeMode = this.changeMode.bind(this);
  }

  nextImage() {
    let currentPage_ = this.state.currentPage;
    if (this.cache[currentPage_].src === this.state.currentCache) {
      currentPage_++;
      if (currentPage_ >= this.cache.length)
        currentPage_ = this.cache.length - 1;
      this.setState({ currentPage: currentPage_ });
      this.setState({ currentCache: this.cache[currentPage_].src });
      console.log(this.cache[0].src);
    }
  }

  previousImage() {
    let currentPage_ = this.state.currentPage;
    if (this.cache[currentPage_].src === this.state.currentCache) {
      currentPage_--;
      if (currentPage_ < 0) currentPage_ = 0;
      this.setState({ currentPage: currentPage_ });
      this.setState({ currentCache: this.cache[currentPage_].src });
    }
  }

  toImage(pageNumber) {
    this.setState({ currentCache: this.cache[pageNumber].src });
    this.setState({ currentPage: pageNumber });
  }

  changeMode() {
    this.setState((state) => ({ visualMode: +!state.visualMode }));
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <div>
        <NavBarManga
          onNext={this.nextImage}
          onPrevious={this.previousImage}
          toPage={this.toImage}
          changeMode={this.changeMode}
          currentPage={this.state.currentPage}
          visualMode={this.state.visualMode}
          visualModeInfo={this.state.visualModeInfo}
          maxNumber={this.cache}
        />
        <MangaBody
          currentCache={this.state.currentCache}
          allCache={this.cache}
          visualMode={this.state.visualMode}
          onNext={this.nextImage}
          onPrevious={this.previousImage}
        />
        <NavBarManga
          onNext={this.nextImage}
          onPrevious={this.previousImage}
          toPage={this.toImage}
          changeMode={this.changeMode}
          currentPage={this.state.currentPage}
          visualMode={this.state.visualMode}
          visualModeInfo={this.state.visualModeInfo}
          maxNumber={this.cache}
        />
      </div>
    );
  }
}

class NavBarManga extends React.Component {
  constructor(props) {
    super(props);
    this.options = [];
    for (let i = 0; i < this.props.maxNumber.length; i++) {
      let option = (
        <option value={i} key={i}>
          {i + 1}
        </option>
      );
      this.options.push(option);
    }
    this.toPage = this.toPage.bind(this);
  }

  toPage(event) {
    this.props.toPage(event.target.options[event.target.selectedIndex].value);
  }

  render() {
    let visualModeBtn = this.props.visualModeInfo[
      "mode" + this.props.visualMode
    ];
    let buttonsClass = "btn btn-secondary m-2 show";
    let selectClass = "selectPage pointer form-control m-2 show";
    if (this.props.visualMode) {
      //MODE: PAGINADO
      buttonsClass = buttonsClass.replace(/none/, "show");
      selectClass = selectClass.replace(/none/, "show");
    } else {
      buttonsClass = buttonsClass.replace(/show/, "none");
      selectClass = selectClass.replace(/show/, "none");
    }
    return (
      <nav className="navbar navbar-dark bg-dark">
        <div className="buttons d-flex justify-content-center">
          <button className={buttonsClass} onClick={this.props.onPrevious}>
            previous
          </button>
          <button
            className="visualModeBtn btn btn-primary m-2"
            onClick={this.props.changeMode}
          >
            {visualModeBtn}
          </button>
          <button className={buttonsClass} onClick={this.props.onNext}>
            next
          </button>
          <select
            onChange={this.toPage}
            value={this.props.currentPage}
            className={selectClass}
          >
            {this.options}
          </select>
        </div>
      </nav>
    );
  }
}

class MangaBody extends React.Component {
  constructor(props) {
    super(props);
    this.changePage = this.changePage.bind(this);
    this.getCoordinates = this.getCoordinates.bind(this);
    this.findLocation = this.findLocation.bind(this);
  }

  findLocation(oElement) {
    if (typeof oElement.offsetParent != "undefined") {
      for (var posX = 0, posY = 0; oElement; oElement = oElement.offsetParent) {
        posX += oElement.offsetLeft;
        posY += oElement.offsetTop;
      }
      return [posX, posY];
    }
    return [oElement.x, oElement.y];
  }

  getCoordinates(event) {
    let imgLocation = this.findLocation(event.target);
    let posX = event.clientX - imgLocation[0];
    let posY = event.clientY - imgLocation[1];
    return [posX, posY];
  }

  changePage(event) {
    let coordinates = this.getCoordinates(event);
    if (coordinates[0] > event.target.clientWidth / 2) {
      this.props.onNext();
    } else {
      this.props.onPrevious();
    }
  }

  render() {
    let imageSrc = this.props.currentCache;
    let mangaMode0Class = "none";
    let mangaMode1Class = "show";
    let preloadImgClass = "pointer none";
    let mangaPages = [];
    let allCache = this.props.allCache;
    if (this.props.visualMode) {
      //MODE: PAGINADO
      mangaMode0Class = mangaMode0Class.replace(/show/, "none");
      mangaMode1Class = mangaMode1Class.replace(/none/, "show");
    } else {
      //MODE: CASCADA
      mangaMode0Class = mangaMode0Class.replace(/none/, "show");
      mangaMode1Class = mangaMode1Class.replace(/show/, "none");
      let img;
      for (let i = 0; i < allCache.length; i++) {
        img = (
          <img
            className="mangaPages"
            src={allCache[i].src}
            key={i}
            alt="mangaPages"
          />
        );
        mangaPages.push(img);
      }
    }

    return (
      <main className="mainBody">
        <div id="mangaContainer">
          <div id="mangaMode0" className={mangaMode0Class}>
            {mangaPages}
          </div>
          <div id="mangaMode1" className={mangaMode1Class}>
            <img
              id="mangaPage"
              className={preloadImgClass}
              onClick={this.changePage}
              src={imageSrc}
              alt="mangaPage"
            />
          </div>
          <div id="preloadImg" className="none"></div>
        </div>
      </main>
    );
  }
}

export default App;
