import React from "react";
import {Link} from "react-router-dom";

const ShopTopBar = () => {
    return (
        <>
            <section className="page-header-area" style={{ backgroundColor: '#f8eefa' }}>
                <div className="container">
                    <div className="row">
                        <div className="col-sm-8">
                            <div className="page-header-content">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="">David-Nguyen</Link></li>
                                </ol>
                                <h2 className="page-header-title">Product</h2>
                            </div>
                        </div>
                        <div className="col-sm-4 d-sm-flex justify-content-end align-items-end">
                            <h5 className="showing-pagination-results">Search / Product</h5>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default ShopTopBar;