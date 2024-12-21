import React, { useEffect } from "react";
import AXiosClient from "../../Utils/Axiosclient";

import './home.css';
import { Access_token, getitem } from "../../Utils/Localstorage";
import Navbar from "../../component/Navbar/Navbar";
import { Outlet } from "react-router-dom";

const Home = () => {
    useEffect(() => {
        gettoken();
    }, []);

    async function gettoken() {
        try {
            // Uncomment and use it when you need to fetch the token or data
            // console.log(getitem(Access_token));
            // const response = await AXiosClient.get("/user/people");
            // console.log("User data:", response);
        } catch (error) {
            console.error("Error fetching /user:", error); // Debugging log
        }
    }

    return (
        <div>
            <Navbar />
            <Outlet /> {/* This will render the child routes */}
        </div>
    );
};

export default Home;
