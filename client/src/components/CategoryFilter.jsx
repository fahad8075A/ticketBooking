import React from 'react';
import {
  FaFilm,
  FaPlane,
  FaTrain,
  FaBus,
  FaMusic,
  FaFootballBall,
  FaLayerGroup,
} from 'react-icons/fa';

const CATEGORIES = [
  { id: 'ALL', label: 'All Items', icon: FaLayerGroup },
  { id: 'MOVIE', label: 'Movies', icon: FaFilm },
  { id: 'FLIGHT', label: 'Flights', icon: FaPlane },
  { id: 'TRAIN', label: 'Trains', icon: FaTrain },
  { id: 'BUS', label: 'Buses', icon: FaBus },
  { id: 'MUSIC', label: 'Concerts', icon: FaMusic },
  { id: 'SPORTS', label: 'Sports', icon: FaFootballBall },
];

const CategoryFilter = ({ selectedCategory = 'ALL', setSelectedCategory }) => {
  return (
    <div className="w-full my-6">
      {/* Scrollable Track with Masking for Mobile/Tablet */}
      <div className="flex items-center overflow-x-auto no-scrollbar py-2 px-1 gap-2.5 sm:gap-3 scroll-smooth">
        {CATEGORIES.map(({ id, label, icon: Icon }) => {
          const isActive = selectedCategory === id;

          return (
            <button
              key={id}
              onClick={() => setSelectedCategory(id)}
              className={`group relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ease-out whitespace-nowrap cursor-pointer select-none ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-600/20 translate-y-[-1px]'
                  : 'bg-white text-slate-600 border border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/80 hover:text-slate-900 shadow-xs'
              }`}
            >
              {/* Icon Container */}
              <span
                className={`transition-colors duration-200 ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-400 group-hover:text-blue-600'
                }`}
              >
                <Icon className="text-base" />
              </span>

              {/* Label */}
              <span className="tracking-tight">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilter;