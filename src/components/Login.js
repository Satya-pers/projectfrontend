import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./FormStyle.css"

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function submit(e) {
        e.preventDefault();

        try {
            const res = await axios.post("https://project-backend-7xq9.onrender.com/login", { email, password });

            if (res.data === "exist") {
                navigate("/task", { state: { id: email } });
            } else if (res.data === "not exist") {
                alert("Wrong credentials");
            }
        } catch (e) {
            alert("Invalid details");
            console.log(e);
        }
    }

    return (
        <div className="login ">
        <div className="insidelogin container form border border-light p-3 mt-10px bg-light" style={{ width: "30%" }}>
            <h1 style={{ textAlign: "center",marginBottom:"20px"}}>Login</h1>
            <form onSubmit={submit}>
                <input className="form-control mb-3 mx-auto" style={{ textAlign: "center", width: "60%" }} type="email" onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                <input className="form-control mb-3 mx-auto" style={{ textAlign: "center", width: "60%" }} type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                <div className="col-12 d-flex justify-content-center">
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="inlineFormCheck" />
                        <label className="form-check-label" htmlFor="inlineFormCheck">
                            Remember me
                        </label>
                    </div>
                </div>
                <input className="btn btn-primary d-flex justify-content-center mx-auto mt-3" type="submit" value="Login" />
            </form>
            <div className="row mt-3">
                <div className="col-12 d-flex justify-content-center">
                    <label className="col-form-label me-2">Not a member?</label>
                    <Link to="/signup" className=" mt-1">Signup</Link>
                </div>
            </div>
        </div>
        </div>
    );
}
