import React, { useState, useRef, useEffect } from 'react';
import { RefreshIcon, DotsVerticalIcon, ClockIcon } from '@heroicons/react/solid';

const Header = ({ onAddWidgetClick, onSearch, searchTerm, setSearchTerm, onWidgetTypeClick }) => {
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState(null);
  const sliderRef = useRef(null);

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleAddWidgetClick = () => {
    setIsSliderOpen(prev => !prev);
  };

  const handleWidgetTypeButtonClick = (type) => {
    setSelectedWidget(type);
    if (onWidgetTypeClick) {
      onWidgetTypeClick(type);
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleClickOutside = (event) => {
    if (sliderRef.current && !sliderRef.current.contains(event.target)) {
      setIsSliderOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="flex items-center justify-between p-4 text-black relative">
      {/* Left side */}
      <div className="text-xl font-bold">CNAPP Dashboard</div>
      
      {/* Center */}
      <div className="flex items-center space-x-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search widgets..."
          className="border-2 w-[300px] border-gray-300 rounded-lg p-2 text-black"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <span>Search</span>
        </button>
      </div>
      
      {/* Right side */}
      <div className="flex items-center space-x-4">
        <div
          onClick={handleAddWidgetClick}
          className={`border-2 bg-white cursor-pointer h-10 w-[120px] text-gray-400 flex text-center justify-center items-center rounded-lg ${isSliderOpen ? 'bg-gray-200' : ''}`}
        >
          Add Widget +
        </div>
        <button
          onClick={handleRefresh}
          className="bg-white text-gray-400 p-2 rounded border-2 hover:bg-gray-700"
        >
          <RefreshIcon className="h-5 w-5" />
        </button>
        <button className="bg-white text-gray-400 p-2 rounded border-2 hover:bg-gray-700">
          <DotsVerticalIcon className="h-5 w-5" />
        </button>
        <div className="flex items-center text-blue-700 space-x-2 border-2 h-10 bg-white p-2 rounded">
          <ClockIcon className="h-5 w-5" />
          <div className="mx-2 h-8 border-l-2 border-gray-300" />
          <span>2 days data</span>
          <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Slider */}
      {isSliderOpen && (
        <div
          ref={sliderRef}
          className="fixed top-0 right-0 h-full bg-white shadow-lg z-50 flex flex-col text-left pl-5"
          style={{ width: '34%' }}
        >
          <p className='text-blue-500 pt-5 -pl-32 font-serif font-bold'>
            Personalize Your Dashboard by adding the following Widget
          </p>
          <div className="flex flex-row pt-5 gap-3 text-left">
            <div className="relative">
              <button
                onClick={() => handleWidgetTypeButtonClick('CSPM')}
                className={`text-blue-500 p-2 rounded ${selectedWidget === 'CSPM' ? 'font-bold' : ''}`}
              >
                CSPM
              </button>
              {selectedWidget === 'CSPM' && (
                <hr className="absolute bottom-0 left-0 w-full border-t-2 border-blue-500" />
              )}
            </div>
            <div className="relative">
              <button
                className={`text-blue-500 p-2 rounded ${selectedWidget === 'Image' ? 'font-bold' : ''}`}
              >
                Image
              </button>
              {selectedWidget === 'Image' && (
                <hr className="absolute bottom-0 left-0 w-full border-t-2 border-blue-500" />
              )}
            </div>
            <div className="relative">
              <button
                onClick={() => handleWidgetTypeButtonClick('CWPP')}
                className={`text-blue-500 p-2 rounded ${selectedWidget === 'CWPP' ? 'font-bold' : ''}`}
              >
                CWPP
              </button>
              {selectedWidget === 'CWPP' && (
                <hr className="absolute bottom-0 left-0 w-full border-t-2 border-blue-500" />
              )}
            </div>
            <div className="relative">
              <button
                className={`text-blue-500 p-2 rounded ${selectedWidget === 'Ticket' ? 'font-bold' : ''}`}
              >
                Ticket
              </button>
              {selectedWidget === 'Ticket' && (
                <hr className="absolute bottom-0 left-0 w-full border-t-2 border-blue-500" />
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
