import React, { useState, useEffect, useRef } from 'react';
import Header from './Header';
import data from '../data.json';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(data);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedWidgetIds, setSelectedWidgetIds] = useState([]);
  const [widgetDetails, setWidgetDetails] = useState({});
  const [visibleCardIndex, setVisibleCardIndex] = useState({});
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [selectedWidgetType, setSelectedWidgetType] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredWidgets, setFilteredWidgets] = useState([]);
  
  const panelRef = useRef(null);

  const addWidget = (categoryId, widgetType) => {
    setSelectedCategoryId(categoryId);
    setSelectedWidgetType(widgetType);
    setIsPanelOpen(true);
    setIsEditingMode(false); // Initialize as not in editing mode
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term) {
      setFilteredWidgets([]);
      return;
    }
    const lowerCaseTerm = term.toLowerCase();
    const filtered = dashboardData.categories.map(category => ({
      ...category,
      widgets: category.widgets.filter(widget =>
        widget.name.toLowerCase().includes(lowerCaseTerm)
      )
    }));
    setFilteredWidgets(filtered);
  };

  const handleCheckboxChange = (widgetId) => {
    setSelectedWidgetIds(prev => {
      const updated = prev.includes(widgetId)
        ? prev.filter(id => id !== widgetId)
        : [...prev, widgetId];

      const selectedWidgets = dashboardData.categories
        .find(category => category.id === selectedCategoryId)
        ?.widgets.filter(widget => updated.includes(widget.id)) || [];

      const newWidgetDetails = selectedWidgets.reduce((acc, widget) => {
        acc[widget.id] = { name: widget.name, text: widget.text };
        return acc;
      }, {});

      setWidgetDetails(newWidgetDetails);
      return updated;
    });
  };

  const handleDetailChange = (widgetId, field, value) => {
    setWidgetDetails(prev => ({
      ...prev,
      [widgetId]: {
        ...prev[widgetId],
        [field]: value,
      },
    }));
  };

  const handleSaveChanges = () => {
    setDashboardData(prevData => ({
      categories: prevData.categories.map(category =>
        category.id === selectedCategoryId
          ? {
              ...category,
              widgets: category.widgets.map(widget =>
                selectedWidgetIds.includes(widget.id)
                  ? { ...widget, ...widgetDetails[widget.id] }
                  : widget
              ),
            }
          : category
      ),
    }));
    setIsPanelOpen(false);
    setSelectedWidgetIds([]);
    setWidgetDetails({});
    setIsEditingMode(false);
  };

  const cancelEdit = () => {
    setIsPanelOpen(false);
    setSelectedWidgetIds([]);
    setWidgetDetails({});
    setIsEditingMode(false);
  };

  const handleConfirm = () => {
    setIsEditingMode(true);
  };

  const handleSlider = (categoryId, direction) => {
    setVisibleCardIndex(prev => {
      const currentIndex = prev[categoryId] || 0;
      const widgetsCount = dashboardData.categories.find(c => c.id === categoryId).widgets.filter(widget => !widget.isBlank).length;
      const maxIndex = Math.max(widgetsCount - 2, 0);
      const newIndex =
        direction === 'right'
          ? Math.min(currentIndex + 1, maxIndex)
          : Math.max(currentIndex - 1, 0);

      return {
        ...prev,
        [categoryId]: newIndex,
      };
    });
  };

  const handleWidgetTypeSelection = (type) => {
    setSelectedWidgetType(type);
    setIsPanelOpen(true);
  };

  const removeWidget = (categoryId, widgetId) => {
    setDashboardData(prevData => ({
      categories: prevData.categories.map(category =>
        category.id === categoryId
          ? {
              ...category,
              widgets: category.widgets.filter(widget => widget.id !== widgetId),
            }
          : category
      ),
    }));
  };

  const handleAddNewWidget = () => {
    if (selectedCategoryId && selectedWidgetType) {
      const newWidget = {
        id: new Date().toISOString(), // Unique ID (could be more sophisticated)
        name: `New ${selectedWidgetType} Widget`,
        text: '',
        placeholder: "Widget content here",
        isBlank: false, // Ensure new widgets are not blank
      };

      setDashboardData(prevData => ({
        categories: prevData.categories.map(category =>
          category.id === selectedCategoryId
            ? {
                ...category,
                widgets: [...category.widgets, newWidget],
              }
            : category
        ),
      }));
    }
  };

  const widgetsToDisplay = searchTerm
    ? filteredWidgets
    : dashboardData.categories;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsPanelOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className='bg-gray-100'>
      <div className="container mx-auto p-4 relative">
        <Header
          onAddWidgetClick={() => setIsPanelOpen(true)}
          onSearch={handleSearch}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onWidgetTypeClick={handleWidgetTypeSelection}
        />

        <div className="space-y-8">
          {widgetsToDisplay.map((category) => {
            const currentIndex = visibleCardIndex[category.id] || 0;
            const widgetsToShow = searchTerm
              ? category.widgets
              : category.widgets.filter(widget => !widget.isBlank).slice(currentIndex, currentIndex + 2);

            return (
              <div key={category.id} className="flex flex-col space-y-4 relative">
                <h2 className="text-xl font-semibold mb-4">{category.name}</h2>
                <div className="flex space-x-4 items-center relative">
                  {/* Left Slider Button */}
                  {currentIndex > 0 && (
                    <button
                      onClick={() => handleSlider(category.id, 'left')}
                      className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-400 hover:bg-gray-500 text-white w-12 h-12 flex items-center justify-center rounded-full z-10"
                      style={{ marginLeft: '-16px' }}
                    >
                      ◀
                    </button>
                  )}
                  {/* Widgets */}
                  {widgetsToShow.length > 0 ? (
                    widgetsToShow.map((widget, idx) => (
                      <div
                        key={widget.id}
                        className={`bg-white p-4 rounded-lg shadow w-1/3 h-60 flex flex-col justify-between relative ${
                          idx === 1 ? 'mr-16' : ''
                        }`}
                      >
                        <div className="flex flex-col h-full">
                          <div className="flex-grow overflow-auto">
                            <h3 className="text-lg font-semibold">{widget.name}</h3>
                            <p>{widget.text}</p>
                          </div>
                          <button
                            onClick={() => removeWidget(category.id, widget.id)}
                            className="text-red-500 hover:text-red-700 pl-[430px]"
                          >
                            ❌
                          </button>
                        </div>
                        {/* Right Slider Button */}
                        {idx === 1 && currentIndex + 2 < category.widgets.filter(widget => !widget.isBlank).length && (
                          <button
                            onClick={() => handleSlider(category.id, 'right')}
                            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-400 hover:bg-gray-500 text-white w-12 h-12 flex items-center justify-center rounded-full"
                            style={{ marginRight: '-16px' }}
                          >
                            ▶
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="bg-gray-200 p-4 rounded-lg shadow w-1/3 h-60 flex items-center justify-center text-gray-500">
                      No results found
                    </div>
                  )}

                  {Array.from({ length: 2 - widgetsToShow.length }).map((_, index) => (
                    <div
                      key={index}
                      className="bg-white p-4 rounded-lg shadow w-1/3 h-60"
                    />
                  ))}

                  <div
                    onClick={() => addWidget(category.id, 'CSPM')}
                    className="text-gray-400 bg-white font-semibold p-4 rounded-lg shadow w-1/3 h-60 flex justify-center items-center cursor-pointer"
                  >
                    <div className='border-2 flex justify-center items-center h-8 w-[120px] text-center rounded-lg'>
                      + Add Widget
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sliding Panel */}
        <div
          ref={panelRef}
          className={`fixed top-0 right-0 h-full z-50 transition-transform duration-300 ease-in-out ${isPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}
          style={{ width: '34%' }}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg h-full flex flex-col">
            <div className="flex-grow">
              {!isEditingMode ? (
                <>
                  <h3 className="text-lg font-semibold mb-4">Select Widgets to Edit</h3>
                  {dashboardData.categories
                    .find(category => category.id === selectedCategoryId)
                    ?.widgets.filter(widget => !widget.isBlank)
                    .map(widget => (
                      <div key={widget.id} className="mb-4">
                        <div className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            id={widget.id}
                            checked={selectedWidgetIds.includes(widget.id)}
                            onChange={() => handleCheckboxChange(widget.id)}
                            className="mr-2"
                          />
                          <label htmlFor={widget.id} className="font-semibold">{widget.name}</label>
                        </div>
                      </div>
                    ))}
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold mb-4">Edit Widgets</h3>
                  {dashboardData.categories
                    .find(category => category.id === selectedCategoryId)
                    ?.widgets.filter(widget => selectedWidgetIds.includes(widget.id) && !widget.isBlank)
                    .map(widget => (
                      <div key={widget.id} className="mb-4">
                        <div className="pl-6">
                          <input
                            type="text"
                            placeholder="Update Name"
                            value={widgetDetails[widget.id]?.name || ''}
                            onChange={(e) => handleDetailChange(widget.id, 'name', e.target.value)}
                            className="border p-2 w-full mb-2"
                          />
                          <textarea
                            placeholder="Update Text"
                            value={widgetDetails[widget.id]?.text || ''}
                            onChange={(e) => handleDetailChange(widget.id, 'text', e.target.value)}
                            className="border p-2 h-[170px] w-full"
                          />
                        </div>
                      </div>
                    ))}
                </>
              )}
            </div>
            <div className="mt-4 flex justify-between">
              {isEditingMode ? (
                <>
                  <button
                    onClick={handleSaveChanges}
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleAddNewWidget}
                    className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
                  >
                    Add New Widget
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                  >
                    Confirm
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
