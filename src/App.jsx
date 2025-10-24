import './App.css'
import Footer from "@/components/Footer.jsx";
import Header from "@/components/Header.jsx";
import {Route, Routes} from "react-router-dom";
import LoginPage from "@/modules/login/LoginPage.jsx";
import SignupPage from "@/modules/signup/SignupPage.jsx";
import UserInfoPage from "@/modules/user-info/UserInfoPage.jsx";

function App() {
    return (
        <div className="app-container">
            <Header/>
            <main className="content">
                <Routes>
                    <Route path="/" element={
                        <div>
                            <h2>Welcome to the Main Page!</h2>
                            <p>Your page content goes here.</p>
                        </div>
                    }/>
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/signup" element={<SignupPage/>}/>
                    <Route path="/user-info" element={<UserInfoPage/>}/>
                </Routes>
            </main>
            <Footer/>
        </div>
    )
}

export default App
