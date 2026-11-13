// import logo from "./assets/AgroLogo.small.png"
import attribution from "./assets/detour-EE.small.png"
import './App.css'
import MainMap from "./MainMap"

function App() {

  return (
    <>

      <section id="center">

        {/* LOGO */}
        <div className="hero">
          <h1>Agroheritour4All</h1>
          {/* <img src={logo} /> */}
        </div>

        <div id="map-container">
          <MainMap />
        </div>

        <div id="attribution">
          <a target='_blank' href="https://detour-eu-project.eu/">
            <img src={attribution} alt="" height="100%" />
          </a>
        </div>
      </section>
    </>
  )
}

export default App;