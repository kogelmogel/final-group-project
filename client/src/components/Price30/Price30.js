import React, { Component } from 'react';
import ViewOrder from '../ViewOrder/ViewOrder';
import Payment30 from '../Payment30';
import {Link } from 'react-router-dom';
import LoggedNavbar from '../LoggedNavbar/LoggedNavbar';
import "../ViewOrder/ViewOrder.css";

export default class Price30 extends Component {

    render() {
        return (
            <div>
                <LoggedNavbar />
                <div className="view-order">
                <ViewOrder orders={this.orders} />
                <p className="paypal">Please pay 30 euro with the PayPal button below:</p>
                <Payment30 />
                <Link to="/cancel"><p className="cancel-order">Cancel this order</p></Link>
                <p className="appendix">&#42;STBE - "soon to be ex"</p>
                </div>
            </div>
        )
    }
}