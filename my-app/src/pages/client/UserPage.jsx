import Header from "../../components/client/Header.jsx";
import User from "../../components/client/userPage/User.jsx";

export default function UserPage() {
    return (
        <div className="wrapper">
            <Header/>
            <main className="main-content">
                <User />
            </main>
        </div>
    );
}