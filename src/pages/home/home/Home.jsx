import Banner from '../banner/Banner';
import Stats from '../stats/Stats';
import FeaturedCourses from '../featuredcourses/FeaturedCourses';
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
            <FeaturedCourses />
            <ParentBenifit />
            <OurMissionAndVision />
            <SuccsessStory />
            <StudentMap />
            <FAQ />
        </div>
    );
};

export default Home;
