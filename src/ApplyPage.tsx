// import React from 'react';

// function ApplyPage() {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-orange-50">
//       <div className="bg-white rounded-2xl shadow-xl p-10 max-w-lg w-full text-center">
//         <h1 className="text-3xl font-bold text-red-600 mb-4">Application Form Coming Soon!</h1>
//         <p className="text-gray-700 mb-6">
//           Thank you for your interest in joining Arkyna's next cohort. Our application form will be available soon. Please check back later or contact us for more information.
//         </p>
//         <a href="/" className="inline-block mt-4 px-6 py-2 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200">Back to Home</a>
//       </div>
//     </div>
//   );
// }

// export default ApplyPage;

import React, { useState, useEffect } from 'react';
import { Upload, Link, X, CheckCircle, AlertCircle } from 'lucide-react';
import { validateForm } from './components/validation.ts';
import type { PreliminaryData } from './types';
interface PreliminaryFormProps {
  onSubmit: (data: PreliminaryData) => Promise<void>;
}

export const PreliminaryForm: React.FC<PreliminaryFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    school: '',
    projectLinks: ['']
  });
  const [resume, setResume] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleProjectLinkChange = (index: number, value: string) => {
    const newLinks = [...formData.projectLinks];
    newLinks[index] = value;
    setFormData(prev => ({ ...prev, projectLinks: newLinks }));
    
    if (errors[`projectLink${index}`]) {
      setErrors(prev => ({ ...prev, [`projectLink${index}`]: '' }));
    }
  };

  const addProjectLink = () => {
    setFormData(prev => ({ ...prev, projectLinks: [...prev.projectLinks, ''] }));
  };

  const removeProjectLink = (index: number) => {
    const newLinks = formData.projectLinks.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, projectLinks: newLinks }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setResume(file);
    }
  };

  const removeResume = () => {
    setResume(null);
    // Reset the file input
    const fileInput = document.getElementById('resume-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { isValid, errors: validationErrors } = validateForm(formData);
    
    if (!isValid) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    const preliminaryData: PreliminaryData = {
      ...formData,
      resume: resume || undefined,
      projectLinks: formData.projectLinks.filter(link => link.trim())
    };

    try {
      await onSubmit(preliminaryData);       // <-- await the API call from parent
    // (Optional) show a success message, redirect, clear form, etc.
    // alert("Application submitted!");
    } catch (err: any) {
    // (Optional) display a friendly error to the user
    // alert(err?.message || "Something went wrong.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center p-4 relative">
      {/* Back Button */}
      <a
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-orange-500 hover:text-red-600 font-semibold bg-white bg-opacity-80 px-4 py-2 rounded-xl shadow-md shadow-orange-400/80 transition-colors z-10"
        title="Back to About"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back
      </a>
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-600 bg-clip-text text-transparent mb-4">
            Interview Application
          </h1>
          <p className="text-gray-600 text-lg">
            Complete your preliminary screening to proceed to the AI voice interview
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all ${
                errors.name ? 'border-red-300' : 'border-gray-200'
              }`}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={16} />
                {errors.name}
              </p>
            )}
          </div>

          {/* Age Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Age <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => handleInputChange('age', e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all ${
                errors.age ? 'border-red-300' : 'border-gray-200'
              }`}
              placeholder="Enter your age"
              min="16"
              max="100"
            />
            {errors.age && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={16} />
                {errors.age}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all ${
                errors.email ? 'border-red-300' : 'border-gray-200'
              }`}
              placeholder="Enter your email address"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={16} />
                {errors.email}
              </p>
            )}
          </div>

          {/* School Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              School/University <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.school}
              onChange={(e) => handleInputChange('school', e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all ${
                errors.school ? 'border-red-300' : 'border-gray-200'
              }`}
              placeholder="Enter your school or university"
            />
            {errors.school && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={16} />
                {errors.school}
              </p>
            )}
          </div>

          {/* Resume Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Resume (Optional)
            </label>
            {resume ? (
              <div className="border-2 border-green-200 bg-green-50 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">{resume.name}</p>
                      <p className="text-sm text-green-600">
                        {(resume.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeResume}
                    className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                    title="Remove resume"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-orange-400 transition-colors">
                <input
                  type="file"
                  id="resume-upload"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label htmlFor="resume-upload" className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                    Click to upload resume (PDF, DOC, DOCX)
                  </p>
                </label>
              </div>
            )}
          </div>

          {/* Project Links */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Project Links (Optional)
            </label>
            {formData.projectLinks.map((link, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <div className="flex-1">
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => handleProjectLinkChange(index, e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all ${
                      errors[`projectLink${index}`] ? 'border-red-300' : 'border-gray-200'
                    }`}
                    placeholder="https://github.com/user/your-project"
                  />
                  {errors[`projectLink${index}`] && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={16} />
                      {errors[`projectLink${index}`]}
                    </p>
                  )}
                </div>
                {formData.projectLinks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeProjectLink(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addProjectLink}
              className="flex items-center gap-2 text-orange-400 hover:text-red-600 font-medium"
            >
              <Link size={16} />
              Add another project link
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-orange-400 to-red-500 text-white font-semibold py-4 px-6 rounded-xl hover:from-orange-500 hover:to-red-600 focus:ring-4 focus:ring-orange-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing Application...
              </span>
            ) : (
              'Submit Application'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};



function ApplyPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);


  const handlePreliminarySubmit = async (data: PreliminaryData) => {
    setSubmitError(null);
    // Build multipart/form-data for the backend
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.age !== undefined && data.age !== null && String(data.age).trim() !== "") {
      formData.append("age", String(data.age));
    }
    formData.append("email", data.email);
    formData.append("school", data.school);

    // Your backend accepts url_links either as CSV or repeated fields.
    // CSV (simple):
    const links = (data.projectLinks ?? []).filter(l => l && l.trim().length > 0);
    if (links.length > 0) {
      formData.append("url_links", links.join(","));
      // OR, as multiple fields (backend supports both):
      // links.forEach(l => formData.append("url_links", l));
    }

    if (data.resume) {
      formData.append("resume", data.resume); // name must be "resume" to match multer.single("resume")
    }

    console.log("Submitting application...");
    try {
      const resp = await fetch("http://localhost:4000/api/applications", {
        method: "POST",
        body: formData,
      });

      console.log("Fetch completed", resp);
      if (!resp.ok) {
        // Surface server validation or generic error
        let msg = `Request failed with ${resp.status}`;
        try {
          const j = await resp.json();
          msg = j?.error || msg;
        } catch {}
        setSubmitError(msg);
        throw new Error(msg);
      }

      // (Optional) you can read the created ID:
      // const json = await resp.json();
      // console.log("Created application ID:", json.id);

      console.log("Setting submitted to true");
      setSubmitted(true);
    } catch (err: any) {
      setSubmitError(err?.message || "Something went wrong.");
      console.error("Submission error:", err);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-lg w-full text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Application Submitted!</h1>
          <p className="text-gray-700 mb-6">
            Thank you for applying to Arkyna. We have received your application and will be in touch soon.<br />
            (This is a placeholder page.)
          </p>
          <a href="/" className="inline-block mt-4 px-6 py-2 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200">Back to Home</a>
        </div>
      </div>
    );
  }

  return (
    <>
      {submitError && (
        <div className="max-w-xl mx-auto my-4 p-4 bg-red-100 text-red-700 rounded-xl text-center">
          <strong>Error:</strong> {submitError}
        </div>
      )}
      <PreliminaryForm onSubmit={handlePreliminarySubmit} />
    </>
  );
}

export default ApplyPage;