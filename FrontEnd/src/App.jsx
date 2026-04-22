import { Routes, Route } from 'react-router-dom';


import MyNav from "./COMPONENTS/Navbar/MyNav.jsx"
import Home from "./PAGES/Home.jsx"
import User from "./COMPONENTS/User/User.jsx"


function App() {

  return (
    <>
     <MyNav/>

     <Routes>
       <Route path='/' element={<Home/>}/>
        <Route path='/profilo' element={<User/>}/>
      </Routes>
     //TODO footer
    
    </>

  )
}
export default App
