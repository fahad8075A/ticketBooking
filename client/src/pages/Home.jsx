import React from 'react';
import Hero from '../components/Hero';
import BrowseCategories from '../components/BrowseCategories';
import Popular from '../components/Popular';

const Home = () => {
    return (
        <div>
            <Hero/>
            <BrowseCategories/>
            <Popular/>

        </div>
    );
}

export default Home;
