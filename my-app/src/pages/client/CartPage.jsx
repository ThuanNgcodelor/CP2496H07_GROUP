import Header from "../../components/client/Header.jsx";
import {Cart} from "../../components/client/cart/ListCart.jsx";

export default function UserPage() {
    return (
        <div className="wrapper">
            <Header/>
            <main className="main-content">
                <Cart />
            </main>
        </div>
    );
}