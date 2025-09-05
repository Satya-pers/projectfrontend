import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Signup() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function submit(e) {
        e.preventDefault();

        try {
            const res = await axios.post("https://project-backend-7xq9.onrender.com/signup", {
                email, password
            });

            if (res.data === "exist") {
                alert("User already exists");
            } else if (res.data === "not exist") {
                alert("Signup successful! Please login.");
                navigate("/", { state: { id: email } });
            }
        } catch (e) {
            alert("Wrong details");
            console.log(e);
        }
    }

    return (
        <div className="signup d-flex justify-content-center align-items-center vh-100">
        <div className="insideSignup container form border border-light p-3 mt-10px bg-light" style={{ width: "30%" }}>
        <h1 style={{ textAlign: "center",marginBottom:"20px" }}>Sign up</h1>
            <form onSubmit={submit}>
            <label  class="form-label" style={{ textAlign: "center", width: "60%" }}>Enter Email:</label>
                <input className="form-control mb-3 mx-auto" style={{ textAlign: "center", width: "60%" }} type="email" onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                <label  class="form-label" style={{ textAlign: "center", width: "70%" }}>Create Password:</label>
                <input className="form-control mb-3 mx-auto" style={{ textAlign: "center", width: "60%" }} type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                <div className="col-12 d-flex justify-content-center">
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="inlineFormCheck" />
                        <label className="form-check-label" htmlFor="inlineFormCheck">
                            Remember me
                        </label>
                    </div>
                </div>
                <input className="btn btn-primary d-flex justify-content-center mx-auto mt-3" type="submit" value="Signup" />
            </form>
            <div className="row mt-3">
                <div className="col-12 d-flex justify-content-center">
                    <label className="col-form-label me-2">Already exists</label>
                    <Link to="/" className=" mt-1">Login</Link>
                </div>
            </div>
        </div>
        </div>
    );
}
