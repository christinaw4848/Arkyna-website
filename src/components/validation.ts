export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};



export const validateURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateForm = (data: {
  name: string;
  email: string;
  school: string;
  projectLinks: string[];
}): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!data.name.trim()) {
    errors.name = 'Name is required';
  }

  if (!validateEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.school.trim()) {
    errors.school = 'School/University is required';
  }

  data.projectLinks.forEach((link, index) => {
    if (link.trim() && !validateURL(link)) {
      errors[`projectLink${index}`] = 'Please enter a valid URL';
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};