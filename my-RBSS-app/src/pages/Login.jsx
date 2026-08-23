import React from "react";
import BigButton from "../components/BigButton";
import './background.css'
import InfoPanel from "../components/InfoPanel";
import Logo from "../components/Logo";
import SectionList from "../components/SectionList";

const LoginPage = () => {
    return (
        <div class='split-container'>
            <section class='left-pane'>
                <InfoPanel/>
            </section>
            <section class='right-pane'>Right Content</section>
        </div>
    )
}

export default LoginPage