import React from "react";

import Categories from "../../sections/Categories/Categories";
import FeaturedProducts from "../../sections/FeaturedProducts/FeaturedProducts";
import SpecialOffer from "../../sections/SpecialOffer/SpecialOffer";
import Hero from "../../components/Hero/Hero";

function Home() {
  return (
    <>
      <Hero />

      <Categories />

      <FeaturedProducts />

      <SpecialOffer />
    </>
  );
}

export default Home;


