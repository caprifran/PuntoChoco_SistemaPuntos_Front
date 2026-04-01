import React, { useState } from "react";
import { Link } from "react-router-dom";

const AccordionItem = ({ title, icon, content, isOpen, onClick, onNavigate }) => {
    return (
        <div className="flex flex-col gap-1">
          <div 
            className="flex items-center justify-between px-4 py-3 cursor-pointer text-[#d4c3bf] hover:text-[#f9f2ec] hover:bg-[#471215] rounded-md transition-all duration-300" 
            onClick={onClick}
          >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined">{icon}</span>
                <span className="font-label font-semibold">{title}</span>
              </div>
              <span 
                className="material-symbols-outlined text-sm transition-transform duration-300"
                style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
              >
                expand_more
              </span>
          </div>
          <div
              className={`flex flex-col gap-1 overflow-hidden transition-all duration-500 ease-in-out`}
              style={{ maxHeight: isOpen ? "200px" : "0px", opacity: isOpen ? 1 : 0 }}
          >
              {content.map((item, index) => (
                  <Link 
                    key={index} 
                    to={item.url}
                    onClick={onNavigate}
                    className="ml-9 px-4 py-2 text-sm text-[#d4c3bf] hover:text-[#f9f2ec] hover:bg-[#4e342e] rounded-md transition-colors"
                  >
                    {item.title}
                  </Link>
              ))}
          </div>
        </div>
    );
};

const Accordion = ({ items, onNavigate }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const handleClick = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col gap-1">
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.title}
          icon={item.icon}
          content={item.content}
          isOpen={openIndex === index}
          onClick={() => handleClick(index)}
          onNavigate={onNavigate}
        />
      ))}
    </div>
  );
};

export default Accordion;
