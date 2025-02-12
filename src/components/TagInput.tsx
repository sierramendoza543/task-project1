'use client';

import { useState, KeyboardEvent, ChangeEvent, FocusEvent } from 'react';

interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  suggestedTags?: string[];
}

export default function TagInput({ 
  tags, 
  onTagsChange, 
  suggestedTags = [] 
}: TagInputProps) {
  const [input, setInput] = useState<string>('');
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      const newTag = input.trim().toLowerCase();
      if (!tags.includes(newTag)) {
        onTagsChange([...tags, newTag]);
      }
      setInput('');
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      onTagsChange(tags.slice(0, -1));
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setInput(e.target.value);
  };

  const handleInputFocus = (): void => {
    setShowSuggestions(true);
  };

  const removeTag = (tagToRemove: string): void => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  const addSuggestedTag = (tag: string): void => {
    if (!tags.includes(tag)) {
      onTagsChange([...tags, tag]);
    }
    setShowSuggestions(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 p-2 border rounded-md">
        {tags.map(tag => (
          <span
            key={tag}
            className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm flex items-center gap-1"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:text-indigo-600"
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          className="flex-1 min-w-[120px] outline-none"
          placeholder="Add tags..."
        />
      </div>
      {showSuggestions && suggestedTags.length > 0 && (
        <div className="bg-white border rounded-md shadow-sm">
          {suggestedTags
            .filter(tag => !tags.includes(tag) && tag.includes(input.toLowerCase()))
            .map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => addSuggestedTag(tag)}
                className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
              >
                {tag}
              </button>
            ))}
        </div>
      )}
    </div>
  );
} 