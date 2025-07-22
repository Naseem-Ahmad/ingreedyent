
import Header from './Header.jsx'
import siteMLogo from '/SiteM.png'


function App() {
  return (
    <>
    <Header />
          <div className="image-container">
        <img className="maincontent" src={siteMLogo} alt=" logo" height={600} width={600} />
             </div>
    </>
  )
}

export default App
