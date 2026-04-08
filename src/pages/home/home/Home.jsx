import React from 'react';
import Banner from '../banner/Banner';
import Stats from '../stats/Stats';
import ParentBenifit from '../parentbenifit/ParentBenifit';
import OurMissionAndVision from '../ourmissionandvision/OurMissionAndVision';
import SuccsessStory from '../successstory/SuccsessStory';
import StudentMap from '../map/StudentMap';
import FAQ from '../FAQ/FAQ';

const Home = () => {
    return (
        <div>
            <Banner />
            <Stats />
            <ParentBenifit />
            <OurMissionAndVision />
            <SuccsessStory />
            <StudentMap />
            <FAQ/>
        </div>
    );
};

export default Home;
