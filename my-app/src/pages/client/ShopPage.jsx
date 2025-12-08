import Header from "../../components/client/Header.jsx";
import SearchProduct from "../../components/client/product/SearchProduct.jsx";
import ShopTopBar from "../../components/client/product/ShopTopBar.jsx";

export default function ShopPage() {
    return (
        <div className="wrapper">
            <Header/>
            <main className="main-content">
                <SearchProduct />
            </main>
        </div>
    );
}