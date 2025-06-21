
import React, { useState, useEffect } from 'react';
import { Phone, ChevronDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
  format: string;
  regex: RegExp;
}

const countries: Country[] = [
  {
    code: 'BR',
    name: 'Brazil',
    dialCode: '+55',
    flag: '🇧🇷',
    format: '## #####-####',
    regex: /^\d{2}\s\d{5}-\d{4}$/
  },
  {
    code: 'US',
    name: 'United States',
    dialCode: '+1',
    flag: '🇺🇸',
    format: '(###) ###-####',
    regex: /^\(\d{3}\)\s\d{3}-\d{4}$/
  },
  {
    code: 'UK',
    name: 'United Kingdom',
    dialCode: '+44',
    flag: '🇬🇧',
    format: '## #### ####',
    regex: /^\d{2}\s\d{4}\s\d{4}$/
  },
  {
    code: 'CA',
    name: 'Canada',
    dialCode: '+1',
    flag: '🇨🇦',
    format: '(###) ###-####',
    regex: /^\(\d{3}\)\s\d{3}-\d{4}$/
  },
  {
    code: 'DE',
    name: 'Germany',
    dialCode: '+49',
    flag: '🇩🇪',
    format: '## ########',
    regex: /^\d{2}\s\d{8}$/
  },
  {
    code: 'FR',
    name: 'France',
    dialCode: '+33',
    flag: '🇫🇷',
    format: '# ## ## ## ##',
    regex: /^\d\s\d{2}\s\d{2}\s\d{2}\s\d{2}$/
  }
];

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  error,
  placeholder = "Enter phone number",
  required = false
}) => {
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    // Parse existing value if it contains a dial code
    if (value) {
      const country = countries.find(c => value.startsWith(c.dialCode));
      if (country) {
        setSelectedCountry(country);
        setPhoneNumber(value.replace(country.dialCode + ' ', ''));
      } else {
        setPhoneNumber(value);
      }
    }
  }, []);

  const formatPhoneNumber = (input: string, format: string): string => {
    // Remove all non-digit characters
    const cleaned = input.replace(/\D/g, '');
    
    let formatted = '';
    let cleanedIndex = 0;
    
    for (let i = 0; i < format.length && cleanedIndex < cleaned.length; i++) {
      if (format[i] === '#') {
        formatted += cleaned[cleanedIndex];
        cleanedIndex++;
      } else {
        formatted += format[i];
      }
    }
    
    return formatted;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const formatted = formatPhoneNumber(input, selectedCountry.format);
    setPhoneNumber(formatted);
    
    // Combine country code with formatted number
    const fullNumber = `${selectedCountry.dialCode} ${formatted}`;
    onChange(fullNumber);
  };

  const handleCountryChange = (countryCode: string) => {
    const country = countries.find(c => c.code === countryCode);
    if (country) {
      setSelectedCountry(country);
      // Reformat current number with new country format
      const formatted = formatPhoneNumber(phoneNumber, country.format);
      setPhoneNumber(formatted);
      
      const fullNumber = `${country.dialCode} ${formatted}`;
      onChange(fullNumber);
    }
  };

  return (
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
        <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200" />
      </div>
      
      <div className="flex">
        <Select value={selectedCountry.code} onValueChange={handleCountryChange}>
          <SelectTrigger className={`w-32 sm:w-36 rounded-r-none border-r-0 pl-10 sm:pl-12 ${
            error ? 'border-red-300 bg-red-50/50' : 'border-slate-200/60'
          } bg-white/50 backdrop-blur-sm hover:bg-white/70 focus:bg-white/80 shadow-lg hover:shadow-xl min-h-[48px]`}>
            <SelectValue>
              <div className="flex items-center gap-2">
                <span className="text-base">{selectedCountry.flag}</span>
                <span className="text-xs sm:text-sm font-medium">{selectedCountry.dialCode}</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-white border border-slate-200 shadow-xl z-50">
            {countries.map((country) => (
              <SelectItem key={country.code} value={country.code}>
                <div className="flex items-center gap-3">
                  <span className="text-base">{country.flag}</span>
                  <span className="text-sm font-medium">{country.dialCode}</span>
                  <span className="text-sm text-slate-600">{country.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <input
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneChange}
          placeholder={placeholder}
          required={required}
          className={`flex-1 pl-3 sm:pl-4 pr-3 sm:pr-4 py-4 sm:py-5 border rounded-l-none rounded-r-xl sm:rounded-r-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 bg-white/50 backdrop-blur-sm text-slate-900 placeholder-slate-500 transition-all duration-300 hover:bg-white/70 focus:bg-white/80 shadow-lg hover:shadow-xl text-sm sm:text-base min-h-[48px] ${
            error ? 'border-red-300 bg-red-50/50' : 'border-slate-200/60'
          }`}
        />
      </div>
      
      {error && (
        <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-red-600 animate-fade-in">{error}</p>
      )}
    </div>
  );
};

export default PhoneInput;
