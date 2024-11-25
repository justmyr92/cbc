import { useState } from "react";
import Navbar from "../../components/Navbar";

import Batangas from "../../assets/stores/batangas_location.png";
import Manila from "../../assets/stores/metro_manila_location.png";
import Quezon from "../../assets/stores/quezon_location.png";
import Bmap from "../../assets/stores/google_map_batangas_city.png";
import Mmap from "../../assets/stores/google_map_makati.png";
import Qmap from "../../assets/stores/google_map_quezon.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChevronLeft,
    faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import Footer from "../../components/Footer";

const Storespage = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const storeData = [
        {
            city: "Batangas City",
            address:
                "P. Burgos Street Barangay 10, Batangas City, 4200, Batangas",
            position: { latitude: 13.759106, longitude: 121.055285 },
            image: Batangas,
            map: Bmap,
        },
        {
            city: "Quezon",
            address: "Maharlika Highway, Barangay Tiaong, 4325, Quezon",
            position: { latitude: 13.945031, longitude: 121.360418 },
            image: Quezon,
            map: Qmap,
        },
        {
            city: "Makati",
            address:
                "Lower Ground Level, One Ayala, 1 Ayala Ave, Makati, Metro Manila",
            position: { latitude: 14.550253, longitude: 121.023775 },
            image: Manila,
            map: Mmap,
        },
    ];

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % storeData.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? storeData.length - 1 : prevIndex - 1
        );
    };

    return (
        <main>
            <Navbar />

            <section className="menu-section h-[120vh]">
                <div className="container mx-auto flex h-full justify-center items-center px-1.5 py-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                        <div className="stores flex flex-col shadow-lg p-6">
                            <h2 className="text-4xl title font-bold mb-4">
                                {storeData[currentIndex].city}
                            </h2>
                            <p className="text-lg mb-4">
                                {storeData[currentIndex].address}
                            </p>
                            <img
                                src={storeData[currentIndex].image}
                                alt={`${storeData[currentIndex].city} Store`}
                                className="w-full h-64 object-cover rounded-lg mb-4"
                            />

                            {/* Carousel Controls */}
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={handlePrev}
                                    className="p-2 bg-amber-950 rounded-full w-16 hover:bg-amber-700 text-white transition"
                                >
                                    <FontAwesomeIcon icon={faChevronLeft} />
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="p-2 bg-amber-950 rounded-full w-16 hover:bg-amber-700 text-white transition"
                                >
                                    <FontAwesomeIcon icon={faChevronRight} />
                                </button>
                            </div>
                        </div>

                        <div className="map flex justify-center items-center shadow-lg p-6">
                            <img
                                src={storeData[currentIndex].map}
                                alt={`${storeData[currentIndex].city} Map`}
                                className="w-full h-full object-cover rounded-lg"
                            />
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </main>
    );
};

export default Storespage;
