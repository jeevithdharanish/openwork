import React, { useState, useEffect } from 'react';
import Button from '../../../../components/Button/Button';
import './HeroSection.css';

const HeroSection = () => {
  //  const Mobile = window.matchMedia('(max-width: 480px)').matches;
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeIcon, setActiveIcon] = useState(null);
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.innerWidth > 1024;
  });

  const iconConfigs = [
    {
      name: 'set-profile',
      label: 'Set Profile',
      sectionId: 'lp-2-section',
      icon: '/assets/3d388d45b23ed4826566c6c199aff49f93e7acec.svg',
      className: 'icon-set-profile',
    },
    {
      name: 'discoverable',
      label: 'Discoverable',
      sectionId: 'lp-3-section',
      icon: '/assets/62526e6f62a12cd8f3ecb86db19a495650068ad0.svg',
      className: 'icon-discoverable',
    },
    {
      name: 'post-job',
      label: 'Post Job',
      sectionId: 'lp-4-section',
      icon: '/assets/5993be528342167da5598a847635eb201549dae4.svg',
      className: 'icon-post-job',
    },
    {
      name: 'direct-contract',
      label: 'Direct Contract',
      sectionId: 'lp-5-section',
      icon: '/assets/48d7e8cd65b4036c787ad29a2bdce07c13f29021.svg',
      className: 'icon-direct-contract',
    },
    {
      name: 'job-progress',
      label: 'Job In Progress',
      sectionId: 'lp-6-section',
      icon: '/assets/7fbdaad122c8922623aaea9b99c9cdd6cc503c6f.svg',
      className: 'icon-job-progress',
    },
    {
      name: 'raise-dispute',
      label: 'Raise Dispute',
      sectionId: 'lp-7-section',
      icon: '/assets/0db7d9f3333eba0f15f08e07625cd29728a834ec.svg',
      className: 'icon-raise-dispute',
    },
    {
      name: 'earn-token',
      label: 'Earn Token',
      sectionId: 'lp-8-section',
      icon: '/assets/sidebar-icon-6.svg',
      className: 'icon-earn-token',
    },
    {
      name: 'dao',
      label: 'DAO',
      sectionId: 'lp-9-section',
      icon: '/assets/141af504612ac4760b6ff60cc6346fee9cea46cc.svg',
      className: 'icon-dao',
    },
    {
      name: 'multichain',
      label: 'Multi Chain',
      sectionId: 'lp-10-section',
      icon: '/assets/sidebar-icon-multichain.svg',
      className: 'icon-multichain',
    },
    {
      name: 'architecture',
      label: 'Architecture',
      sectionId: 'lp-11-section',
      icon: '/assets/sidebar-icon-architecture.svg',
      className: 'icon-architecture',
    },
    {
      name: 'revolution',
      label: 'Revolution',
      sectionId: 'lp-12-section',
      icon: '/assets/sidebar-icon-revolution.svg',
      className: 'icon-revolution',
    },
  ];

  const iconOrder = iconConfigs.map((icon) => icon.name);
  const defaultCenterIndex = Math.max(0, iconOrder.indexOf('direct-contract'));
  const [activeIndex, setActiveIndex] = useState(defaultCenterIndex);

  const sectionMap = iconConfigs.reduce((map, icon) => {
    map[icon.sectionId] = icon.name;
    return map;
  }, {});

  const sectionOrder = iconConfigs.map((icon) => icon.sectionId);

  const CENTER_SLOT_INDEX = 3;
  const curveSlots = [
    { left: 108, top: '4%' },
    { left: 62, top: '16%' },
    { left: 28, top: '30%' },
    { left: 14, top: '46%' },
    { left: 25, top: '62%' },
    { left: 62, top: '78%' },
    { left: 116, top: '92%' },
    { left: 150, top: '108%' },
    { left: 174, top: '122%' },
    { left: 196, top: '136%' },
    { left: 218, top: '150%' },
  ];

  const getIconStyle = (iconIndex) => {
    if (!isExpanded) return undefined;
    const slotIndex = iconIndex - activeIndex + CENTER_SLOT_INDEX;

    if (slotIndex >= 0 && slotIndex < curveSlots.length) {
      const slot = curveSlots[slotIndex];
      return {
        left: `${slot.left}px`,
        top: slot.top,
        opacity: 1,
      };
    }

    const offscreenSlot = slotIndex < 0 ? curveSlots[0] : curveSlots[curveSlots.length - 1];
    return {
      left: `${slotIndex < 0 ? offscreenSlot.left - 20 : offscreenSlot.left + 20}px`,
      top: slotIndex < 0 ? '-10%' : '135%',
      opacity: 0,
    };
  };

  // Auto-expand sidebar and detect active section based on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!isDesktop) {
        setIsExpanded(false);
        setActiveIcon(null);
        return;
      }

      const heroSection = document.querySelector('.lp-1-section');
      if (heroSection) {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        const scrollPosition = window.scrollY;
        const viewportHeight = window.innerHeight;
        
        if (scrollPosition >= heroBottom - 200) {
          setIsExpanded(true);
          
          // Find the section that occupies most of the viewport
          let activeSection = null;
          let maxVisibleArea = 0;
          
          for (let i = 0; i < sectionOrder.length; i++) {
            const section = document.getElementById(sectionOrder[i]);
            if (section) {
              const sectionTop = section.offsetTop;
              const sectionBottom = sectionTop + section.offsetHeight;
              
              // Calculate how much of this section is visible in viewport
              const visibleTop = Math.max(sectionTop, scrollPosition);
              const visibleBottom = Math.min(sectionBottom, scrollPosition + viewportHeight);
              const visibleArea = Math.max(0, visibleBottom - visibleTop);
              
              if (visibleArea > maxVisibleArea) {
                maxVisibleArea = visibleArea;
                activeSection = sectionMap[sectionOrder[i]];
              }
            }
          }
          
          if (activeSection) {
            setActiveIcon(activeSection);
            // Update active index for centering
            const newIndex = iconOrder.indexOf(activeSection);
            if (newIndex !== -1) {
              setActiveIndex(newIndex);
            }
          }
        } else {
          setIsExpanded(false);
          setActiveIcon(null);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDesktop]);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Add class to body when sidebar is expanded
  useEffect(() => {
    if (isExpanded) {
      document.body.classList.add('sidebar-expanded');
    } else {
      document.body.classList.remove('sidebar-expanded');
    }
    return () => document.body.classList.remove('sidebar-expanded');
  }, [isExpanded]);

  const getMobileNavOffset = () => {
    if (typeof window === 'undefined') return 0;
    const isMobile = window.matchMedia('(max-width: 480px)').matches;
    if (!isMobile) return 0;
    const header = document.querySelector('.landing-header');
    const headerHeight = header ? header.offsetHeight : 0;
    return headerHeight + 16;
  };

  const handleIconClick = (iconName, sectionId) => {
    setActiveIcon(iconName);
    const targetSection = document.getElementById(sectionId);
    
    if (targetSection) {
      // Find current visible section
      const allSections = document.querySelectorAll('.lp-section');
      const currentScrollY = window.scrollY;
      const targetSectionTop = targetSection.offsetTop;
      const scrollOffset = getMobileNavOffset();
      const targetScrollY = Math.max(targetSectionTop - scrollOffset, 0);
      
      let currentSection = null;
      allSections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        if (currentScrollY >= sectionTop - 100 && currentScrollY < sectionBottom - 100) {
          currentSection = section;
        }
      });
      
      // Skip if clicking on current section
      if (currentSection === targetSection) return;
      
      // Determine direction
      const isGoingDown = targetSectionTop > currentScrollY;
      
      // Check if we're in hero section
      const isFromHero = currentSection?.classList.contains('lp-1-section');
      
      // Clean up any existing animation classes
      allSections.forEach(section => {
        section.classList.remove('page-transition-down', 'page-transition-up', 'page-slide-out-left', 'page-slide-out-right', 'page-transition-from-hero');
      });
      
      // If from hero, just expand the sidebar (don't slide hero out)
      if (isFromHero) {
        setIsExpanded(true);
        
        // Instant scroll to target
        window.scrollTo({
          top: targetScrollY,
          behavior: 'instant'
        });
        
        // Animate target section expanding from center
        void targetSection.offsetWidth;
        targetSection.classList.add('page-transition-from-hero');
        
        // Clean up after animation
        setTimeout(() => {
          allSections.forEach(section => {
            section.classList.remove('page-transition-from-hero');
          });
        }, 600);
        return;
      } else if (currentSection) {
        // Animate current section sliding out (not hero)
        currentSection.classList.add(isGoingDown ? 'page-slide-out-left' : 'page-slide-out-right');
      }
      
      // Instant scroll to target
      window.scrollTo({
        top: targetScrollY,
        behavior: 'instant'
      });
      
      // Animate target section sliding in
      void targetSection.offsetWidth;
      targetSection.classList.add(isGoingDown ? 'page-transition-down' : 'page-transition-up');
      
      // Clean up after animation
      setTimeout(() => {
        allSections.forEach(section => {
          section.classList.remove('page-transition-down', 'page-transition-up', 'page-slide-out-left', 'page-slide-out-right');
        });
   
      }, 600);
    }
  };

  const handleLearnMore = () => {
    const learnMoreSection = document.getElementById('lp-2-section');
    if (!learnMoreSection) return;
    const scrollOffset = getMobileNavOffset();
    const target = Math.max(learnMoreSection.offsetTop - scrollOffset, 0);
    window.scrollTo({
      top: target,
      behavior: 'smooth'
    });
  };

  const handleBotClick = () => {
    window.open('https://chatgpt.com/g/g-6811cd644b1c8191b203796b06deaa4a-openwork-simplified', '_blank');
  };

  return (
    <section className="lp-section lp-1-section">
      <main className={`landing-main ${isExpanded ? 'expanded' : ''}`}>
        {/* Glow Wrapper with Mask */}
        <div className="glow-wrapper">
          {/* Radiant Glow Background */}
          <div className="radiant-glow-container"></div> 
        </div>

        {/* Background Circle Group */}
        <div className="circle-group">
          {/* Main Circle */}
          <img 
            src="/assets/f0a5bddf438bec766e653cd0886722bed6ea4ee3.svg" 
            alt="" 
            className="main-circle-bg"
          />
          {/* Rotating Arc Border */}
          <div className="circle-arc" aria-hidden="true">
            <svg viewBox="0 0 600 600" className="circle-arc-svg" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#1246FF" stopOpacity="1" />
                  <stop offset="100%" stopColor="#1246FF" stopOpacity="1" />
                </linearGradient>
                <filter id="arcGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="6" result="b" />
                  <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>
              {/* top arc only */}
              <path
                d="M 24 300 A 276 276 0 0 1 576 300"
                stroke="url(#arcGradient)"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                filter="url(#arcGlow)"
              />
            </svg>
          </div>
        </div>

        {/* Floating Icon Buttons - Icons move along the curve, active icon at center */}
        <div className="floating-icons">
          {/* Traveling glow elements for curves */}
          <div className="traveling-glow"></div>
          <div className="traveling-glow-bottom"></div>
          {iconConfigs.map((icon, index) => (
            <Button 
              key={icon.name}
              icon={icon.icon}
              buttonCss={`icon-btn ${icon.className} ${activeIcon === icon.name ? 'active' : ''}`}
              label={icon.label}
              onClick={() => handleIconClick(icon.name, icon.sectionId)}
              style={getIconStyle(index)}
            />
          ))}
        </div>

        {/* Navbar Floating Icons for Mobile */}
        <div className="navbar-floating-icons">
          <Button 
            icon="/assets/f424bb301166452f1d2aae2badd19051c2788323.svg"
            buttonCss="navbar-icon-btn navbar-icon-bot"
            onClick={handleBotClick}
          />
          <Button 
            icon="/assets/203519ed928f5759c5c5434e7d71de7598f55b96.svg"
            buttonCss="navbar-icon-btn navbar-icon-2"
          />
          <Button 
            icon="/assets/141ae2395558d7fc65c358b46cf1beaa163ad655.svg"
            buttonCss="navbar-icon-btn navbar-icon-3"
          />
        </div>

        {/* Center Content */}
        <div className="center-content">
          <div className="text-content">
            <h1 className="main-heading">The future of work is decentralised.</h1>
            <p className="main-description">
              OpenWork is a decentralised work protocol, allowing people to work 
              directly with each other using blockchain technology, with decentralised governance.
            </p>
          </div>
          
          <button 
            className="lp-blue-button"
            onClick={handleLearnMore}
          >
            Learn More
            <img src="/assets/b16a6ff87b2913f8bdc303dda7816c024bd687cb.svg" alt="" className="lp-button-icon" />
          </button>
        </div>
      </main>
    </section>
  );
};

export default HeroSection;
