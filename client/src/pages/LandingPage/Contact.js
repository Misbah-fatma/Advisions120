import React, {useState} from "react";
import Newsletter from './News'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Contact() {
    const [result, setResult] = React.useState("");
    var [show, setshow] = useState(false)
  
    const onSubmit = async (event) => {
      event.preventDefault();
      setResult("Sending....");
      const formData = new FormData(event.target);
  
      formData.append("access_key", "ad76d720-b8ed-4a9f-bf88-99fbaa9297f8");
  
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });
  
      const data = await response.json();
  
      if (data.success) {
        setResult("Form Submitted Successfully");
        event.target.reset();
        setshow(true)
      } else {
        console.log("Error", data);
        setResult(data.message);
      }
    };
  
    return (
      <div>

      <Navbar/>
    {/* <!-- Hero End --> */}


    {/* <!-- Full Screen Search Start --> */}
    <div className="modal fade" id="searchModal" tabIndex="-1">
        <div className="modal-dialog modal-fullscreen">
            <div className="modal-content" style={{background: "rgba(20, 24, 62, 0.7)"}}>
                <div className="modal-header border-0">
                    <button type="button" className="btn btn-square bg-white btn-close" data-bs-dismiss="modal"
                        aria-label="Close"></button>
                </div>
                <div className="modal-body d-flex align-items-center justify-content-center">
                    <div className="input-group" style={{maxWidth: "600px"}}>
                        <input type="text" className="form-control bg-transparent border-light p-3"
                            placeholder="Type search keyword"/>
                        <button className="btn btn-light px-4"><i className="bi bi-search"></i></button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    {/* <!-- Full Screen Search End --> */}


    {/* <!-- Contact Start --> */}
    <div className="container-fluid py-5">
        <div className="container py-5">
            <div className="mx-auto text-center wow fadeIn" data-wow-delay="0.1s" style={{maxWidth: "500px"}}>
                <div className="btn btn-sm border rounded-pill text-primary px-3 mb-3">Contact Us</div>
                <h1 className="mb-4">If You Have Any Query, Please Contact Us</h1>
            </div>
            <div className="row justify-content-center">
                <div className="col-lg-7">
                {
                                show ? <div class="alert alert-success text-center alert-dismissible fade show" role="alert">
                                    Thanks to Share Your Query With US!!! Our Team Will Contact You Soon!!!
                                </div> : ""
                            }
                     <div className="wow fadeIn" data-wow-delay="0.3s">
                        <form onSubmit={onSubmit}>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" id="name" name='name' placeholder="Your Name"/>
                                        <label for="name">Your Name</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input type="email" className="form-control" id="email" name='email'  placeholder="Your Email"/>
                                        <label for="email">Your Email</label>
                                    </div>
                                </div>
                               
                                <div className="col-12">
                                    <div className="form-floating">
                                        <textarea className="form-control" name='message'  placeholder="Leave a message here" id="message" style={{height: "150px"}}></textarea>
                                        <label for="message">Message</label>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <button className="btn btn-primary w-100 py-3" type="submit">Send Message</button>
                                </div>
                            </div>
                        </form>
                        <span>{result}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    {/* <!-- Contact End --> */}
        

    {/* <!-- Newsletter Start --> */}
    {/* <div className="container-fluid bg-primary newsletter py-5">
        <div className="container">
            <div className="row g-5 align-items-center">
                <div className="col-md-5 ps-lg-0 pt-5 pt-md-0 text-start wow fadeIn" data-wow-delay="0.3s">
                    <img className="img-fluid" src="assets/img/newsletter.png" alt="*"/>
                </div>
                <div className="col-md-7 py-5 newsletter-text wow fadeIn" data-wow-delay="0.5s">
                    <div className="btn btn-sm border rounded-pill text-white px-3 mb-3">Newsletter</div>
                    <h1 className="text-white mb-4">Let's subscribe the newsletter</h1>
                    <div className="position-relative w-100 mt-3 mb-2">
                        <input className="form-control border-0 rounded-pill w-100 ps-4 pe-5" type="text"
                            placeholder="Enter Your Email" style={{height: "48px"}}/>
                        <button type="button" className="btn shadow-none position-absolute top-0 end-0 mt-1 me-2"><i
                                className="fa fa-paper-plane text-primary fs-4"></i></button>
                    </div>
                    <small className="text-white-50">Diam sed sed dolor stet amet eirmod</small>
                </div>
            </div>
        </div>
    </div> */}
    <Newsletter/>
    <Footer/>
  
      </div>
    );
  }