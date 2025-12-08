import Header from "../../components/client/Header.jsx";
import SearchProduct from "../../components/client/product/SearchProduct.jsx";
import ShopTopBar from "../../components/client/product/StartBarProduct.jsx";

export default function ProductPage() {
    return (
        <div className="wrapper">
            <Header/>
            <main className="main-content">
                <ShopTopBar />
                <SearchProduct />
            </main>
        </div>
    );
}