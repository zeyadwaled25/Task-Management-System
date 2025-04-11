import { useState, useEffect, useRef } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";

function Filter({ filterOptions, setFilterOptions }) {
  const [openMenus, setOpenMenus] = useState({
    status: false,
    priority: false,
    date: false
  });

  const menuRefs = {
    status: useRef(null),
    priority: useRef(null),
    date: useRef(null)
  };

  const dropdownOptions = {
    status: ["Pending", "In Progress", "Done"],
    priority: ["Low", "Medium", "High"],
    date: ["Newest", "Oldest"],
  };

  useEffect(() => {
    function handleClickOutside(event) {
      Object.keys(menuRefs).forEach(menuKey => {
        if (menuRefs[menuKey].current && !menuRefs[menuKey].current.contains(event.target)) {
          setOpenMenus(prev => ({ ...prev, [menuKey]: false }));
        }
      });
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = (menuName) => {
    setOpenMenus(prev => {
      const newMenus = {};
      for (const key in prev) newMenus[key] = false;
      newMenus[menuName] = !prev[menuName];
      return newMenus;
    });
  };

  const selectOption = (menuName, option) => {
    setFilterOptions(prev => ({
      ...prev,
      [menuName]: option
    }));
    setOpenMenus(prev => ({ ...prev, [menuName]: false }));
  };

  const clearOption = (menuName, e) => {
    e.stopPropagation();
    setFilterOptions(prev => ({
      ...prev,
      [menuName]: ""
    }));
  };

  return (
    <div className="filter mb-4">
      <h3 className="title mb-3">Dashboard</h3>
      <div className="row">
        {Object.keys(dropdownOptions).map(menu => (
          <div className="col-md-4 mb-3" key={menu}>
            <div className="filter-content position-relative" ref={menuRefs[menu]}>
              <button 
                className={`btn d-flex justify-content-between align-items-center w-100 ${filterOptions[menu] ? 'btn-primary' : 'btn-light'}`}
                onClick={() => toggleMenu(menu)}
              >
                <span>
                  {filterOptions[menu] || menu.charAt(0).toUpperCase() + menu.slice(1)}
                </span>
                {openMenus[menu] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>

              {openMenus[menu] && (
                <ul className="dropdown-menu show w-100">
                  {dropdownOptions[menu].map((option, index) => (
                    <li key={index}>
                      <div className="dropdown-item d-flex justify-content-between align-items-center">
                        <span 
                          onClick={() => selectOption(menu, option)}
                          style={{ cursor: "pointer", flex: 1 }}
                        >
                          {option}
                        </span>
                        {filterOptions[menu] === option && (
                          <span
                            className="text-danger ms-2"
                            onClick={(e) => clearOption(menu, e)}
                            style={{ cursor: "pointer", fontSize: "1.3rem" }}
                          >
                            &times;
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Filter;