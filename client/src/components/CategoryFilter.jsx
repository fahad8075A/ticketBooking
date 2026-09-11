import React from 'react';
import {
    FaFilm,
    FaPlane,
    FaTrain,
    FaBus,
    FaMusic,
    FaFootballBall,
} from "react-icons/fa";
import { Link } from "react-router-dom";


const CategoryFilter = ({ selectedCategory, setSelectedCategory }) => {

    return (
        <div className='flex flex-wrap gap-18'>
            <button onClick={() => setSelectedCategory("ALL")}
                className={`px-6 py-2 rounded-full transition ${selectedCategory === "ALL"
                    ? "bg-blue-700 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                    }`}>
                All Items
            </button>

            <button
                onClick={() => setSelectedCategory("MOVIE")}
                className={`px-5 py-2 rounded-full flex items-center gap-2 transition ${selectedCategory === "MOVIE"
                    ? "bg-blue-700 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                    }`}
            >
                <FaFilm />
                Movies
            </button>

            <button
                onClick={() => setSelectedCategory("FLIGHT")}
                className={`px-5 py-2 rounded-full flex items-center gap-2 transition ${selectedCategory === "FLIGHT"
                    ? "bg-blue-700 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                    }`}
            >
                <FaPlane />
                Flight
            </button>

            <button
                onClick={() => setSelectedCategory("TRAIN")}
                className={`px-5 py-2 rounded-full flex items-center gap-2 transition ${selectedCategory === "TRAIN"
                    ? "bg-blue-700 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                    }`}
            >
                <FaTrain />
                Train
            </button>

            <button
                onClick={() => setSelectedCategory("BUS")}
                className={`px-5 py-2 rounded-full flex items-center gap-2 transition ${selectedCategory === "BUS"
                    ? "bg-blue-700 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                    }`}
            >
                <FaBus />
                Bus
            </button>
            <button
                onClick={() => setSelectedCategory("MUSIC")}
                className={`px-5 py-2 rounded-full flex items-center gap-2 transition ${selectedCategory === "MUSIC"
                    ? "bg-blue-700 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                    }`}
            >
                <FaMusic />
                Concerts
            </button>
            <button
                onClick={() => setSelectedCategory("SPORTS")}
                className={`px-5 py-2 rounded-full flex items-center gap-2 transition ${selectedCategory === "SPORTS"
                        ? "bg-blue-700 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
            >
                <FaFootballBall />
                Sports
            </button>



        </div>
    );
}

export default CategoryFilter;
