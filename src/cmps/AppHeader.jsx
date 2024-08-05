import { NavLink } from 'react-router-dom'
import { LoginSignup } from './LoginSignup.jsx'

export function AppHeader() {
  return (
    <section className="app-header">
      <LoginSignup />
      <nav>
        <NavLink to="/">Home</NavLink> |  <NavLink to="/about"> About</NavLink> |
        <NavLink to="/toy"> Toys</NavLink> |
        <NavLink to="/dashboard"> Dashboard</NavLink>

      </nav>
      {/* <div className="logo">Mister Toy</div> */}
    </section>
  )
}
