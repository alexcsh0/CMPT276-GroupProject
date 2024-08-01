import React from 'react';
import { NavBar } from '../../common/navbar/navbar';
import { Footer } from '../../common/footer/footer';
import Styles from './success.module.css'

export function Success() {
    return (
        <>
        <NavBar />
        <h2 className={Styles.message}>Route Added</h2>
        <Footer />
        </>

    );
};

export default Success;