import React, { useState, useEffect, useRef } from 'react';

const ColorPicker = ({ color, onChange, title }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);
  const canvasRef = useRef(null);
  const hueBarRef = useRef(null);

  useEffect(() => {
    // Convert hex to HSL
    const hexToHsl = (hex) => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const diff = max - min;
      const add = max + min;
      const l = add * 0.5;

      let s, h;
      if (diff === 0) {
        s = h = 0;
      } else {
        s = l < 0.5 ? diff / add : diff / (2 - add);
        switch (max) {
          case r: h = ((g - b) / diff) + (g < b ? 6 : 0); break;
          case g: h = (b - r) / diff + 2; break;
          case b: h = (r - g) / diff + 4; break;
        }
        h /= 6;
      }

      return [h * 360, s * 100, l * 100];
    };

    if (color && color.startsWith('#')) {
      const [h, s, l] = hexToHsl(color);
      setHue(h);
      setSaturation(s);
      setLightness(l);
    }
  }, [color]);

  useEffect(() => {
    if (canvasRef.current && isOpen) {
      drawColorWheel();
    }
  }, [hue, isOpen]);

  const drawColorWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw saturation/lightness square
    for (let x = 0; x < canvas.width; x++) {
      for (let y = 0; y < canvas.height; y++) {
        const s = (x / canvas.width) * 100;
        const l = 100 - (y / canvas.height) * 100;
        ctx.fillStyle = `hsl(${hue}, ${s}%, ${l}%)`;
        ctx.fillRect(x, y, 1, 1);
      }
    }

    // Draw selection indicator
    const x = (saturation / 100) * canvas.width;
    const y = ((100 - lightness) / 100) * canvas.height;
    
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, 2 * Math.PI);
    ctx.stroke();
    
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, 2 * Math.PI);
    ctx.stroke();
  };

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newSaturation = (x / canvas.width) * 100;
    const newLightness = 100 - (y / canvas.height) * 100;

    setSaturation(Math.max(0, Math.min(100, newSaturation)));
    setLightness(Math.max(0, Math.min(100, newLightness)));

    updateColor(hue, newSaturation, newLightness);
  };

  const handleHueChange = (e) => {
    const newHue = parseInt(e.target.value);
    setHue(newHue);
    updateColor(newHue, saturation, lightness);
  };

  const updateColor = (h, s, l) => {
    const hslToHex = (h, s, l) => {
      h /= 360;
      s /= 100;
      l /= 100;

      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      const r = Math.round(hue2rgb(p, q, h + 1/3) * 255);
      const g = Math.round(hue2rgb(p, q, h) * 255);
      const b = Math.round(hue2rgb(p, q, h - 1/3) * 255);

      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    };

    const hexColor = hslToHex(h, s, l);
    onChange(hexColor);
  };

  const currentColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

  return (
    <div style={{ position: 'relative', marginBottom: '15px' }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '10px',
        marginBottom: '8px'
      }}>
        <span style={{ 
          fontSize: '12px', 
          fontWeight: 'bold', 
          color: '#0f172a',
          minWidth: '80px'
        }}>
          {title}:
        </span>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            border: '2px solid #ccc',
            background: currentColor,
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        />
        <span style={{ fontSize: '11px', color: '#666', fontFamily: 'monospace' }}>
          {currentColor}
        </span>
      </div>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '50px',
          left: '0',
          zIndex: 10000,
          background: 'white',
          border: '1px solid #ccc',
          borderRadius: '12px',
          padding: '15px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          width: '280px'
        }}>
          {/* Color Square */}
          <canvas
            ref={canvasRef}
            width={250}
            height={200}
            onClick={handleCanvasClick}
            style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              cursor: 'crosshair',
              marginBottom: '15px',
              display: 'block'
            }}
          />

          {/* Hue Slider */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ 
              fontSize: '11px', 
              fontWeight: 'bold', 
              display: 'block', 
              marginBottom: '5px',
              color: '#333'
            }}>
              Hue: {Math.round(hue)}°
            </label>
            <input
              type="range"
              min="0"
              max="360"
              value={hue}
              onChange={handleHueChange}
              style={{
                width: '100%',
                height: '20px',
                borderRadius: '10px',
                background: 'linear-gradient(to right, hsl(0,100%,50%), hsl(60,100%,50%), hsl(120,100%,50%), hsl(180,100%,50%), hsl(240,100%,50%), hsl(300,100%,50%), hsl(360,100%,50%))',
                outline: 'none',
                WebkitAppearance: 'none'
              }}
            />
          </div>

          {/* Saturation Slider */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ 
              fontSize: '11px', 
              fontWeight: 'bold', 
              display: 'block', 
              marginBottom: '5px',
              color: '#333'
            }}>
              Saturation: {Math.round(saturation)}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={saturation}
              onChange={(e) => {
                const newSaturation = parseInt(e.target.value);
                setSaturation(newSaturation);
                updateColor(hue, newSaturation, lightness);
              }}
              style={{
                width: '100%',
                height: '15px',
                borderRadius: '8px',
                background: `linear-gradient(to right, hsl(${hue},0%,${lightness}%), hsl(${hue},100%,${lightness}%))`,
                outline: 'none',
                WebkitAppearance: 'none'
              }}
            />
          </div>

          {/* Lightness Slider */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ 
              fontSize: '11px', 
              fontWeight: 'bold', 
              display: 'block', 
              marginBottom: '5px',
              color: '#333'
            }}>
              Lightness: {Math.round(lightness)}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={lightness}
              onChange={(e) => {
                const newLightness = parseInt(e.target.value);
                setLightness(newLightness);
                updateColor(hue, saturation, newLightness);
              }}
              style={{
                width: '100%',
                height: '15px',
                borderRadius: '8px',
                background: `linear-gradient(to right, hsl(${hue},${saturation}%,0%), hsl(${hue},${saturation}%,50%), hsl(${hue},${saturation}%,100%))`,
                outline: 'none',
                WebkitAppearance: 'none'
              }}
            />
          </div>

          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            style={{
              width: '100%',
              padding: '8px',
              background: '#f0f0f0',
              border: '1px solid #ccc',
              borderRadius: '6px',
              fontSize: '11px',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

const GradientCreator = ({ onGradientChange, currentGradient }) => {
  const [color1, setColor1] = useState('#0f172a');
  const [color2, setColor2] = useState('#334155');
  const [color3, setColor3] = useState('#64748b');
  const [angle, setAngle] = useState(135);

  useEffect(() => {
    const gradient = `linear-gradient(${angle}deg, ${color1} 0%, ${color2} 50%, ${color3} 100%)`;
    onGradientChange(gradient);
  }, [color1, color2, color3, angle, onGradientChange]);

  return (
    <div style={{
      background: 'rgba(240, 240, 240, 0.8)',
      borderRadius: '12px',
      padding: '15px',
      marginBottom: '20px',
      border: '1px solid #ddd'
    }}>
      <h4 style={{ 
        margin: '0 0 15px 0', 
        fontSize: '14px', 
        fontWeight: 'bold',
        color: '#0f172a'
      }}>
        🌈 Custom Background Gradient
      </h4>

      {/* Gradient Preview */}
      <div style={{
        width: '100%',
        height: '60px',
        background: `linear-gradient(${angle}deg, ${color1} 0%, ${color2} 50%, ${color3} 100%)`,
        borderRadius: '8px',
        marginBottom: '15px',
        border: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '12px',
        fontWeight: 'bold',
        textShadow: '0 1px 3px rgba(0,0,0,0.5)'
      }}>
        Preview
      </div>

      {/* Angle Control */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ 
          fontSize: '11px', 
          fontWeight: 'bold', 
          display: 'block', 
          marginBottom: '5px',
          color: '#333'
        }}>
          Angle: {angle}°
        </label>
        <input
          type="range"
          min="0"
          max="360"
          value={angle}
          onChange={(e) => setAngle(parseInt(e.target.value))}
          style={{
            width: '100%',
            height: '15px',
            outline: 'none'
          }}
        />
      </div>

      {/* Color Pickers */}
      <ColorPicker 
        color={color1} 
        onChange={setColor1} 
        title="Color 1" 
      />
      <ColorPicker 
        color={color2} 
        onChange={setColor2} 
        title="Color 2" 
      />
      <ColorPicker 
        color={color3} 
        onChange={setColor3} 
        title="Color 3" 
      />
    </div>
  );
};

const ThemeTestPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [primaryTextColor, setPrimaryTextColor] = useState('#0f172a');
  const [secondaryTextColor, setSecondaryTextColor] = useState('#334155');
  const [accentColor, setAccentColor] = useState('#3b82f6');
  const [customGradient, setCustomGradient] = useState('');

  const resetToDefaults = () => {
    setPrimaryTextColor('#0f172a');
    setSecondaryTextColor('#334155');
    setAccentColor('#3b82f6');
    document.documentElement.style.setProperty('--bg-gradient-main', 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)');
    document.documentElement.style.setProperty('--text-primary-glass', '#0f172a');
    document.documentElement.style.setProperty('--text-secondary-glass', '#334155');
    document.documentElement.style.setProperty('--text-accent-glass', '#3b82f6');
    localStorage.removeItem('customTheme');
  };

  const applyColors = () => {
    document.documentElement.style.setProperty('--text-primary-glass', primaryTextColor);
    document.documentElement.style.setProperty('--text-secondary-glass', secondaryTextColor);
    document.documentElement.style.setProperty('--text-accent-glass', accentColor);
    
    if (customGradient) {
      document.documentElement.style.setProperty('--bg-gradient-main', customGradient);
    }

    // Save to localStorage
    const themeData = {
      primaryText: primaryTextColor,
      secondaryText: secondaryTextColor,
      accent: accentColor,
      gradient: customGradient
    };
    localStorage.setItem('customTheme', JSON.stringify(themeData));
  };

  const handleGradientChange = (gradient) => {
    setCustomGradient(gradient);
    document.documentElement.style.setProperty('--bg-gradient-main', gradient);
  };

  useEffect(() => {
    // Apply colors whenever they change
    applyColors();
  }, [primaryTextColor, secondaryTextColor, accentColor, customGradient]);

  useEffect(() => {
    // Load saved theme
    const saved = localStorage.getItem('customTheme');
    if (saved) {
      try {
        const themeData = JSON.parse(saved);
        setPrimaryTextColor(themeData.primaryText || '#0f172a');
        setSecondaryTextColor(themeData.secondaryText || '#334155');
        setAccentColor(themeData.accent || '#3b82f6');
        if (themeData.gradient) {
          setCustomGradient(themeData.gradient);
        }
      } catch (e) {
        console.log('Failed to load theme:', e);
      }
    }
  }, []);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="theme-test-toggle"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 9999,
          background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          fontSize: '24px',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        🎨
      </button>

      {/* Theme Panel */}
      {isOpen && (
        <div
          className="theme-test-panel"
          style={{
            position: 'fixed',
            bottom: '90px',
            right: '20px',
            zIndex: 9998,
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            borderRadius: '20px',
            padding: '20px',
            width: '350px',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
          }}
        >
          <h3 style={{ 
            margin: '0 0 20px 0', 
            color: '#0f172a', 
            fontSize: '18px', 
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            🎨 Advanced Theme Designer
          </h3>
          
          {/* Reset Button */}
          <button
            onClick={resetToDefaults}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '20px',
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '12px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            🔄 Reset to Defaults
          </button>

          {/* Background Gradient Creator */}
          <GradientCreator 
            onGradientChange={handleGradientChange}
            currentGradient={customGradient}
          />

          {/* Font Colors Section */}
          <div style={{
            background: 'rgba(240, 240, 240, 0.8)',
            borderRadius: '12px',
            padding: '15px',
            marginBottom: '20px',
            border: '1px solid #ddd'
          }}>
            <h4 style={{ 
              margin: '0 0 15px 0', 
              fontSize: '14px', 
              fontWeight: 'bold',
              color: '#0f172a'
            }}>
              🖋️ Font Colors
            </h4>

            <ColorPicker 
              color={primaryTextColor} 
              onChange={setPrimaryTextColor} 
              title="Primary Text" 
            />
            <ColorPicker 
              color={secondaryTextColor} 
              onChange={setSecondaryTextColor} 
              title="Secondary Text" 
            />
            <ColorPicker 
              color={accentColor} 
              onChange={setAccentColor} 
              title="Accent Color" 
            />
          </div>

          {/* Current Settings Display */}
          <div style={{
            background: 'rgba(59, 130, 246, 0.1)',
            borderRadius: '8px',
            padding: '12px',
            fontSize: '11px',
            color: '#0f172a'
          }}>
            <strong>Current Settings:</strong><br/>
            <div style={{ marginTop: '8px', lineHeight: '1.4' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <div style={{ width: '12px', height: '12px', background: primaryTextColor, borderRadius: '2px', border: '1px solid #ccc' }}></div>
                Primary: {primaryTextColor}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <div style={{ width: '12px', height: '12px', background: secondaryTextColor, borderRadius: '2px', border: '1px solid #ccc' }}></div>
                Secondary: {secondaryTextColor}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', background: accentColor, borderRadius: '2px', border: '1px solid #ccc' }}></div>
                Accent: {accentColor}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ThemeTestPanel;
