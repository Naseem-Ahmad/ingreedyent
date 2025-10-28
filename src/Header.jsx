import chefLogo from './assets/chefLogo.png'
import './App.css'

export default function Header(){
    return (
  <>
    <header>
      <img src={chefLogo} className="chef Logo " alt="chef Logo" />
      <h1>Ingreedyent Pro</h1>    
    </header>
  </>
    )
}