import './App.css'
import Footer from "@/components/Footer.jsx";
import Header from "@/components/Header.jsx";
import {Route, Routes} from "react-router-dom";
import LoginPage from "@/modules/auth/LoginPage.jsx";

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
                    } />
                    <Route path="/login" element={<LoginPage />} />
                </Routes>
            </main>
            <Footer/>
        </div>
    )
}

export default App
