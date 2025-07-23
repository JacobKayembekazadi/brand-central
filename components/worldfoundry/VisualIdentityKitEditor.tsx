
import React, { useState, useEffect } from 'react';
import { VisualIdentityKit } from '../../types';
import Button from '../shared/Button';
import Card from '../shared/Card';

interface VisualIdentityKitEditorProps {
  initialVik: VisualIdentityKit;
  onSave: (vik: VisualIdentityKit) => void;
  addActivity: (description: string) => void;
}

const VisualIdentityKitEditor: React.FC<VisualIdentityKitEditorProps> = ({ initialVik, onSave, addActivity }) => {
  const [vik, setVik] = useState<VisualIdentityKit>(initialVik);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    setVik(initialVik);
    // Auto-enter edit mode if all fields are empty/default
    if (
      !initialVik.logoUrl &&
      initialVik.colorPalette.length === 0 &&
      initialVik.fontFiles.length === 0 &&
      !initialVik.iconSetUrl
    ) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, [initialVik]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVik(prev => ({ ...prev, [name]: value }));
  };

  const handleColorChange = (index: number, field: 'name' | 'hex', value: string) => {
    const newPalette = [...vik.colorPalette];
    newPalette[index] = { ...newPalette[index], [field]: value };
    setVik(prev => ({ ...prev, colorPalette: newPalette }));
  };

  const addColor = () => {
    setVik(prev => ({ ...prev, colorPalette: [...prev.colorPalette, { name: '', hex: '' }] }));
  };

  const removeColor = (index: number) => {
    const newPalette = vik.colorPalette.filter((_, i) => i !== index);
    setVik(prev => ({ ...prev, colorPalette: newPalette }));
  };
  
  const handleFontFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setVik(prev => ({ ...prev, fontFiles: value.split(',').map(s => s.trim()).filter(Boolean)}));
  };


  const handleSave = () => {
    onSave(vik);
    addActivity("Visual Identity Kit updated.");
    setIsEditing(false);
  };

  const handleCancel = () => {
    setVik(initialVik);
    setIsEditing(false);
  }

  if (!isEditing) {
    return (
      <Card title="Visual Identity Kit (Phase 2)">
         <p className="text-sm text-neutral-600 mb-6">
          Your brand's visual essentials: logo, colors, fonts, and icons.
        </p>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-neutral-800">Logo URL:</h4>
            <p className="text-neutral-600 text-sm">{vik.logoUrl || <span className="text-neutral-400 italic">Not defined.</span>}</p>
            {vik.logoUrl && <img src={vik.logoUrl} alt="Brand Logo" className="mt-2 max-h-20 border rounded"/>}
          </div>
          <div>
            <h4 className="font-semibold text-neutral-800">Color Palette:</h4>
            {vik.colorPalette.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-1">
                {vik.colorPalette.map((color, index) => (
                  <div key={index} className="p-2 rounded border text-xs">
                    <div className="w-8 h-8 rounded mb-1" style={{ backgroundColor: color.hex || '#transparent' }}></div>
                    {color.name || 'Unnamed'}: {color.hex}
                  </div>
                ))}
              </div>
            ) : <p className="text-neutral-400 italic text-sm">No colors defined.</p>}
          </div>
          <div>
            <h4 className="font-semibold text-neutral-800">Font Files (comma-separated names/URLs):</h4>
            <p className="text-neutral-600 text-sm">{vik.fontFiles.join(', ') || <span className="text-neutral-400 italic">Not defined.</span>}</p>
          </div>
          <div>
            <h4 className="font-semibold text-neutral-800">Icon Set URL/Description:</h4>
            <p className="text-neutral-600 text-sm">{vik.iconSetUrl || <span className="text-neutral-400 italic">Not defined.</span>}</p>
          </div>
          <div className="pt-2">
            <Button onClick={() => setIsEditing(true)}>Edit Visual Identity Kit</Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Visual Identity Kit Editor (Phase 2)">
      <p className="text-sm text-neutral-600 mb-6">
        Define your logos, color palettes, font files, and icon sets. These will be used for automated mock-grids and brand consistency.
      </p>
      <div className="space-y-6">
        <div>
          <label htmlFor="logoUrl" className="block text-sm font-medium text-neutral-700 mb-1">Logo URL</label>
          <input
            type="url"
            id="logoUrl"
            name="logoUrl"
            value={vik.logoUrl || ''}
            onChange={handleChange}
            placeholder="https://example.com/logo.png"
            className="w-full p-2 border border-neutral-300 rounded-lg focus:ring-primary focus:border-primary"
          />
        </div>

        <div>
          <h4 className="text-sm font-medium text-neutral-700 mb-1">Color Palette</h4>
          {vik.colorPalette.map((color, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2 p-2 border rounded-md">
              <input
                type="text"
                value={color.name}
                onChange={(e) => handleColorChange(index, 'name', e.target.value)}
                placeholder="Color Name (e.g., Primary Blue)"
                className="flex-grow p-2 border border-neutral-300 rounded-lg text-sm"
              />
              <input
                type="text"
                value={color.hex}
                onChange={(e) => handleColorChange(index, 'hex', e.target.value)}
                placeholder="#RRGGBB"
                className="w-28 p-2 border border-neutral-300 rounded-lg text-sm"
              />
              <div className="w-6 h-6 rounded border" style={{ backgroundColor: color.hex || 'transparent' }}></div>
              <Button onClick={() => removeColor(index)} variant="danger" size="sm" className="!p-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </Button>
            </div>
          ))}
          <Button onClick={addColor} variant="outline" size="sm">Add Color</Button>
        </div>
        
        <div>
          <label htmlFor="fontFiles" className="block text-sm font-medium text-neutral-700 mb-1">Font Files (comma-separated names/URLs)</label>
          <input
            type="text"
            id="fontFiles"
            name="fontFiles"
            value={vik.fontFiles.join(', ')}
            onChange={handleFontFilesChange}
            placeholder="e.g., Inter, https://fonts.example.com/BrandFont.woff2"
            className="w-full p-2 border border-neutral-300 rounded-lg focus:ring-primary focus:border-primary"
          />
        </div>

        <div>
          <label htmlFor="iconSetUrl" className="block text-sm font-medium text-neutral-700 mb-1">Icon Set URL or Description</label>
          <input
            type="text"
            id="iconSetUrl"
            name="iconSetUrl"
            value={vik.iconSetUrl || ''}
            onChange={handleChange}
            placeholder="e.g., https://example.com/icons.zip or 'Using Heroicons Outline'"
            className="w-full p-2 border border-neutral-300 rounded-lg focus:ring-primary focus:border-primary"
          />
        </div>
        <div className="flex space-x-3 pt-2">
            <Button onClick={handleSave}>Save Visual Kit</Button>
            <Button onClick={handleCancel} variant="outline">Cancel</Button>
        </div>
      </div>
    </Card>
  );
};

export default VisualIdentityKitEditor;
