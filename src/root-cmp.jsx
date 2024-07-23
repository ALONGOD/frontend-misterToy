import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { Provider } from 'react-redux'
// import '../src/assets/style/main.css'

import { store } from './store/store'
import { UserMsg } from './cmps/UserMsg'
import { AppHeader } from './cmps/AppHeader'
import { AppFooter } from './cmps/AppFooter'
import { AboutUs } from './pages/AboutUS'
import { HomePage } from './pages/HomePage'
import { ToyIndex } from './pages/ToyIndex'
import { ToyEdit } from './pages/ToyEdit'
import { ToyDetails } from './pages/ToyDetails'
import { ToyDashboard } from './pages/ToyDashboard'

export function App() {
  return (
    <Provider store={store}>
      <Router>
        <section className="main-layout app">
          <AppHeader />
          <main>
            <Routes>
              <Route element={<HomePage />} path="/" />
              <Route element={<AboutUs />} path="/about" />
              <Route element={<ToyDashboard />} path="/dashboard" />
              <Route element={<ToyIndex />} path="/toy" />
              <Route element={<ToyEdit />} path="/toy/edit/:toyId?" />
              <Route element={<ToyDetails />} path="/toy/:toyId" />
            </Routes>
          </main>
          {/* <AppFooter /> */}
        </section>
      </Router>
      <UserMsg />
    </Provider>
  )
}
