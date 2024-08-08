import React, { useEffect, useState } from "react";
import SideBar from './SideBar';
import "./style.css";
import logo from "../LandingPage/logo10.png";
import axios from "axios";

const PlanPage = () => {
  const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_API_URL });
  const [plans, setPlans] = useState([]);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axiosInstance.get("/api/plans");
        setPlans(response.data);
      } catch (error) {
        console.error("Error fetching plans:", error);
      }
    };

    fetchPlans();

    const userDataFromStorage = localStorage.getItem('user');
    if (userDataFromStorage) {
      setUserData(JSON.parse(userDataFromStorage));
    }
  }, []);

  const userId = userData ? userData._id : null;

  const checkoutHandler = async (amount) => {
    try {
      const { data: { key } } = await axiosInstance.get("/api/getkey");
      const { data: { order } } = await axiosInstance.post("/api/checkout", { amount });

      const options = {
        key,
        amount: order.amount,
        currency: "INR",
        name: "Advisions Lab",
        image: logo,
        order_id: order.id,
        callback_url: "http://localhost:5000/api/paymentverification",
        prefill: {
          name: userData?.name || '',
          email: userData?.email || '',
          contact: userData?.contact || '',
        },
        notes: {
          address: "Razorpay Corporate Office"
        },
        theme: {
          color: "#121212"
        },
        handler: function(response) {
          axiosInstance.post("/api/paymentverification", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            userId
          }).then(res => {
            console.log(res.data);
            window.location.href = `http://localhost:3000/paymentsuccess?reference=${response.razorpay_payment_id}`;
          }).catch(err => {
            console.error("Payment verification error:", err);
          });
        }
      };

      if (window.Razorpay) {
        const razor = new window.Razorpay(options);
        razor.open();
      } else {
        console.error("Razorpay SDK not loaded");
      }
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  return (
    <div>
      <div className="app-container app-theme-white body-tabs-shadow fixed-sidebar fixed-header" id="appContent">
        <div className="app-main">
          <SideBar />
          <div className="col mt-4">
          <div className="row">
              <div className="page-title-actions px-3 d-flex">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                    <li className="breadcrumb-item"><a href="/">Plans</a></li>
                  </ol>
                </nav>
              </div>
              <div className="row" id="deleteTableItem">
                <div className="col-md-12">
                  <div className="main-card card d-flex h-100 flex-column">
                    <div className="card-body">
                      <div className="snip1207">
                        {plans.map(plan => (
                          <div key={plan._id} className={`plan ${plan.featured ? 'featured' : ''}`}>
                            <h3 className="plan-title" style={{fontSize : "22px"}}>{plan.title}</h3>
                            <div className="plan-cost">
                              <span className="plan-price" style={{fontSize : "43px"}}>{plan.price}</span>
                              <span className="plan-type">/ Monthly</span>
                            </div>
                            <ul className="plan-features">
                              {plan.features.map((feature, index) => (
                                <li key={index}><i className="ion-checkmark"></i>{feature}</li>
                              ))}
                            </ul>
                            <div className="plan-select">
                              <button className="btn btn-primary btn-sm btn-block" onClick={() => checkoutHandler(plan.price)}>Select Plan</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanPage;
