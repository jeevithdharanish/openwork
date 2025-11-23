import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MultiChainSection.css';

const MultiChainSection = () => {
  const navigate = useNavigate();

  return (
    <section id="lp-10-section" className="lp-section lp-10-section">
      <div className="lp-10-container">
        <div className="lp-10-content">
          <h1 className="lp-10-heading">Work on any chain you are comfortable with.</h1>
          <p className="lp-10-description">
            OpenWork is compatible with all blockchains via its bridging architecture. Whether you're comfortable with Arbitrum, Optimism, Solana, Polygon, you name it, we can integrate it and you can integrate it and you can use the network you trust.
          </p>
          <button 
            className="lp-blue-button"
            onClick={() => navigate('/documentation')}
          >
            View Documentation
            <img src="/assets/lp7-arrow-icon.svg" alt="" className="lp-button-icon" />
          </button>
        </div>

        <div className="lp-10-circle-container">
          <div className="lp-10-chain-circle-group">
            {/* Radiant Glow */}
            <div className="lp-10-radiant-glow"></div>

            {/* Core Circle */}
            <div className="lp-10-core-circle">
              <img src="/assets/lp7-core-circle.svg" alt="" className="lp-10-core-bg" />
            </div>

            {/* Center Label */}
            <div className="lp-10-center-label">
              <span className="lp-10-compatible-text">COMPATIBLE WITH</span>
            </div>

            {/* Outer Chain Image */}
            <img src="/assets/Frame 2147261901.png" alt="Chain Networks" className="lp-10-outer-chain-image" />

            {/* Center Chain Icons (static) */}
            <div className="lp-10-chain-icon lp-10-chain-xdc">
              <img src="/assets/Shape_1_2_.svg" alt="XDC" />
            </div>

            <div className="lp-10-chain-icon lp-10-chain-arbitrum-center">
              <img src="/assets/lp10-arbitrum.svg" alt="Arbitrum" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MultiChainSection;
