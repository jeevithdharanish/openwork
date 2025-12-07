import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './LandingSidebar.css';

const LandingSidebar = () => {
  const [activeSection, setActiveSection] = useState('discoverable');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [scrollDirection, setScrollDirection] = useState('down');
  const lastScrollY = useRef(0);

  const sidebarItems = [
    { id: 1, icon: '/assets/sidebar-icon-1.svg', label: 'Discoverable', section: 'lp-2-section', activeY: -150 },
    { id: 2, icon: '/assets/sidebar-icon-2.svg', label: 'Job/Contract', section: 'lp-4-section', activeY: -200 },
    { id: 3, icon: '/assets/sidebar-icon-3.svg', label: 'Direct Contract', section: 'lp-5-section', activeY: -230 },
    { id: 4, icon: '/assets/sidebar-icon-4.svg', label: 'Job In Progress', section: 'lp-6-section', activeY: -270 },
    { id: 5, icon: '/assets/sidebar-icon-5.svg', label: 'Raise Dispute', section: 'lp-7-section', activeY: -300 },
    { id: 6, icon: '/assets/sidebar-icon-6.svg', label: 'Earn & Govern', section: 'lp-8-section', activeY: -320 },
    { id: 7, icon: '/assets/sidebar-icon-7.svg', label: 'DAO', section: 'lp-9-section', activeY: -350 },
    { id: 8, icon: '/assets/sidebar-icon-8.svg', label: 'Local Network', section: 'lp-10-section', activeY: -380 },
    { id: 9, icon: '/assets/sidebar-icon-9.svg', label: 'Openwork Arch', section: 'lp-11-section', activeY: -420 },
    { id: 10, icon: '/assets/sidebar-icon-10.svg', label: 'Work Revolution', section: 'lp-12-section', activeY: -450 },
  ];

  const buildMobileItems = () => {
    const currentIndex = sidebarItems.findIndex(item => item.section === activeSection);
    const safeIndex = currentIndex === -1 ? 0 : currentIndex;
    const prevIndex = safeIndex > 0 ? safeIndex - 1 : null;
    const nextIndex = safeIndex < sidebarItems.length - 1 ? safeIndex + 1 : null;

    const items = [];

    if (prevIndex !== null) {
      const prevItem = sidebarItems[prevIndex];
      items.push({ ...prevItem, id: `${prevItem.id}-prev`, position: 'prev' });
    } else {
      items.push({ id: 'placeholder-prev', hidden: true, position: 'prev' });
    }

    const currentItem = sidebarItems[safeIndex];
    items.push({ ...currentItem, id: `${currentItem.id}-current`, position: 'current' });

    if (nextIndex !== null) {
      const nextItem = sidebarItems[nextIndex];
      items.push({ ...nextItem, id: `${nextItem.id}-next`, position: 'next' });
    } else {
      items.push({ id: 'placeholder-next', hidden: true, position: 'next' });
    }

    return items;
  };

  const mobileSidebarItems = buildMobileItems();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Preload all sidebar icons for faster switching
    sidebarItems.forEach(item => {
      if (item.icon) {
        const img = new Image();
        img.src = item.icon;
      }
    });
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (Math.abs(currentY - lastScrollY.current) > 6) {
        const nextDirection = currentY > lastScrollY.current ? 'down' : 'up';
        setScrollDirection(prev => (prev !== nextDirection ? nextDirection : prev));
        lastScrollY.current = currentY;
      }

      const scrollPosition = currentY + window.innerHeight / 2;

      const secondSection = document.getElementById('lp-2-section');
      if (secondSection) {
        const threshold = secondSection.offsetTop - window.innerHeight * 0.2;
        setSidebarVisible(currentY >= threshold);
      }

      // Find which section is currently in view
      for (let i = sidebarItems.length - 1; i >= 0; i--) {
        const section = document.getElementById(sidebarItems[i].section);
        if (section) {
          const sectionTop = section.offsetTop;
          if (scrollPosition >= sectionTop) {
            setActiveSection(sidebarItems[i].section);
            break;
          }
        }
      }
    };

    // Initial check
    handleScroll();

    // Add scroll listener
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const handleScrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Get the index of the active section
  const activeIndex = sidebarItems.findIndex(item => item.section === activeSection);

  // Calculate positions for each icon
  const getIconPosition = (index) => {
    const groupSpacing = 40;
    
    if (activeIndex === -1) {
      // Initial state
      const targetPosition = -150;
      return {
        y: targetPosition + (index * 48),
        opacity: index > 5 ? 0 : 1,
        scale: 1,
      };
    }
    
    const distanceFromActive = index - activeIndex;
    const targetPosition = sidebarItems[activeIndex].activeY; // Use custom active position
    const basePosition = targetPosition + 200; // Starting position for icons below active
    
    if (distanceFromActive === 0) {
      // Active icon - use custom position
      return {
        y: targetPosition,
        opacity: 1,
        scale: 1.15,
      };
    } else if (distanceFromActive < 0) {
      // Icons above (already passed)
      const absDistance = Math.abs(distanceFromActive);
      return {
        y: targetPosition + (distanceFromActive * groupSpacing),
        opacity: Math.max(0, 1 - absDistance * 0.4),
        scale: Math.max(0.7, 1 - absDistance * 0.15),
      };
    } else {
      // Icons below (upcoming)
      return {
        y: basePosition + ((distanceFromActive - 1) * groupSpacing),
        opacity: Math.max(0.3, 1 - (distanceFromActive - 1) * 0.15),
        scale: Math.max(0.85, 1 - (distanceFromActive - 1) * 0.05),
      };
    }
  };

  // Pick correct item set
  const finalDisplayItems = isMobile ? mobileSidebarItems : sidebarItems;

  // Preload all icons on component mount
  useEffect(() => {
    sidebarItems.forEach(item => {
      if (item.icon) {
        const img = new Image();
        img.src = item.icon;
      }
    });
  }, []);

  return (
    <aside
      className={`landing-sidebar ${sidebarVisible ? 'visible' : ''} ${scrollDirection === 'down' ? 'scroll-down' : 'scroll-up'}`}
    >
      {/* Vertical gradient line */}
      <div className="sidebar-line"></div>

      {/* Navigation icons */}
      <nav className="sidebar-nav">
        {finalDisplayItems.map((item, index) => {
          if (item.hidden) {
            return (
              <div
                key={item.id}
                className="sidebar-nav-item"
                style={{ visibility: 'hidden', pointerEvents: 'none' }}
              >
                <div className="icon-wrapper"></div>
              </div>
            );
          }

          const isActive = activeSection === item.section;
          const position = isMobile ? {} : getIconPosition(index);
          const distanceFromActive = isMobile ? 0 : index - activeIndex;
          const isNearActive = isMobile ? true : Math.abs(distanceFromActive) <= 2;
          
          return (
            <motion.button
              key={item.id}
              className={`sidebar-nav-item ${isActive ? 'active' : ''} ${isNearActive ? 'near-active' : ''}`}
              onClick={() => handleScrollToSection(item.section)}
              aria-label={item.label}
              initial={false}
              animate={isMobile ? {} : {
                top: position.y,
                opacity: position.opacity,
                scale: position.scale,
              }}
              transition={isMobile ? { duration: 0.15 } : {
                type: 'spring',
                stiffness: 300,
                damping: 30,
                mass: 0.8,
              }}
              style={{
                zIndex: isActive ? 10 : 1,
                pointerEvents: isMobile ? 'auto' : (position.opacity < 0.2 ? 'none' : 'auto'),
              }}
            >
              <div className="icon-wrapper">
                <img src={item.icon} alt={item.label} loading="eager" fetchpriority="high" />
              </div>
              <span className="nav-label">{item.label}</span>
            </motion.button>
          );
        })}
      </nav>
    </aside>
  );
};

export default LandingSidebar;
