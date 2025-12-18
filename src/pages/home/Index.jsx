import React from 'react'
import Bangle from "./Bangle";
import BulkDeal from "./BulkDeal";
import CarryDream from "./CarryDream";
import ChainPendant from "./ChainPendant";
import Collection from "./Collection";
import CustomerTestimonial from "./CustomerTestimonial";
import DealOfTheDay from "./DealOfTheDay";
import Earrings from "./Earrings";
import EightImage from "./EightImage";
import FingerRing from "./FingerRing";
import HandWear from "./HandWear";
import HeroSlider from "./HeroSlider";
import Juda from "./Juda";
import MensBraclet from "./MensBraclet";
import NecklaceSet from "./NecklaceSet";
import NewArrival from "./NewArrival";
import RecentlyViewed from "./RecentlyViewed";
import SareePin from "./SareePin";
import SpecailDeal from "./SpecailDeal";
import TraditionalImages from "./TraditionalImages";

const Index = () => {
    return (
        <>
            {/* <Header /> */}
            {/* <SubHeader /> */}
            <HeroSlider />
            <Collection />
            <BulkDeal />
            {/* <SpecailDeal /> */}
            <CarryDream />
            <NewArrival />
            <NecklaceSet />
            <HandWear />
            <Earrings />
            <EightImage />
            <FingerRing />
            <Bangle />
            <TraditionalImages />
            <ChainPendant />
            <DealOfTheDay />
            <Juda />
            <MensBraclet />
            <SareePin />
            <RecentlyViewed />
            <CustomerTestimonial />
            {/* <Footer /> */}
        </>

    )
}

export default Index