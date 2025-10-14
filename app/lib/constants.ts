export const PUBLIC_ROUTES = ["/auth", "/home", "/about", "/races"];

// Profile dropdown options
export const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "non-binary", label: "Non-binary" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
];

export const T_SHIRT_SIZE_OPTIONS = [
  { value: "XS", label: "XS" },
  { value: "S", label: "S" },
  { value: "M", label: "M" },
  { value: "L", label: "L" },
  { value: "XL", label: "XL" },
  { value: "XXL", label: "XXL" },
];

export const PRESET_DISTANCES = [
  { value: "5k", label: "5K (3.1 miles)", km: 5 },
  { value: "10k", label: "10K (6.2 miles)", km: 10 },
  { value: "half-marathon", label: "Half Marathon (13.1 miles)", km: 21 },
  { value: "marathon", label: "Marathon (26.2 miles)", km: 42 },
  { value: "custom", label: "Custom Distance" },
];

export const DISTANCE_UNITS = [
  { value: "km", label: "Kilometers (km)" },
  { value: "mi", label: "Miles (mi)" },
  { value: "m", label: "Meters (m)" },
];

export const GENDER_CATEGORIES = [
  { value: "all", label: "All Genders" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "non-binary", label: "Non-binary" },
];
