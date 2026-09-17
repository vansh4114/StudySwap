import { AlertCircle, CheckCircle, FileUp, Loader2, Sparkles, UploadCloud } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadResource } from '../services/api';

const UploadResource = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    resourceType: 'NOTES',
    subject: '',
    semester: 1,
    course: '',
    university: '',
    tags: ''
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleChange = (e) => {
    const value = e.target.name === 'semester' ? Number(e.target.value) : e.target.value;
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: value
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Check file size (10 MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size exceeds the 10 MB limit');
        setSelectedFile(null);
        return;
      }
      setError(null);
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('description', formData.description);
      payload.append('resourceType', formData.resourceType);
      payload.append('subject', formData.subject);
      payload.append('semester', formData.semester);
      payload.append('course', formData.course);
      payload.append('university', formData.university);
      payload.append('tags', formData.tags);
      payload.append('file', selectedFile);

      const res = await uploadResource(payload);
      if (res.success && res.resource) {
        setSuccessMsg('Resource uploaded successfully!');
        setTimeout(() => {
          navigate(`/resources/${res.resource._id}`);
        }, 1200);
      }
    } catch (err) {
      console.error('Upload failed:', err);
      setError(err.message || 'Failed to upload study resource');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="bg-[#101416] rounded-2xl border border-white/10 shadow-2xl p-6 sm:p-8">
        {/* Header & Contribution Points Badge */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-[#DFFF00]/10 border border-[#DFFF00]/25 text-[#DFFF00] rounded-2xl">
              <UploadCloud className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-[#F5F5F5] tracking-tight">Upload Study Resource</h1>
              <p className="text-xs text-[#A5A8AA] mt-0.5">
                Share lecture notes, question papers, or assignments with fellow students
              </p>
            </div>
          </div>

          <div className="bg-[#DFFF00]/10 border border-[#DFFF00]/30 px-3.5 py-1.5 rounded-full flex items-center space-x-1.5 text-xs font-extrabold text-[#DFFF00]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>+10 ⭐ CONTRIBUTION POINTS</span>
          </div>
        </div>

        {error && (
          <div className="bg-[#FF5C5C]/10 border border-[#FF5C5C]/30 text-[#FF5C5C] px-4 py-3 rounded-xl text-xs mb-6 flex items-center space-x-2 animate-in fade-in">
            <AlertCircle className="h-4 w-4 shrink-0 text-[#FF5C5C]" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="bg-[#B8FF4D]/10 border border-[#B8FF4D]/30 text-[#B8FF4D] px-4 py-3 rounded-xl text-xs mb-6 flex items-center space-x-2 animate-in fade-in">
            <CheckCircle className="h-4 w-4 shrink-0 text-[#B8FF4D]" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Resource Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-[#DFFF00] uppercase tracking-wider">
              1. Resource Details
            </h3>

            <div>
              <label htmlFor="upload-title" className="block text-xs font-semibold text-[#A5A8AA] uppercase tracking-wider mb-1.5">
                Title / Resource Name *
              </label>
              <input
                id="upload-title"
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Data Structures & Algorithms Complete Notes"
                className="w-full px-4 py-3 bg-[#151A1D] border border-white/10 rounded-xl text-xs text-[#F5F5F5] placeholder:text-[#72777A] focus:border-[#DFFF00] focus:ring-1 focus:ring-[#DFFF00] focus:outline-none transition-all font-medium"
              />
            </div>

            <div>
              <label htmlFor="upload-description" className="block text-xs font-semibold text-[#A5A8AA] uppercase tracking-wider mb-1.5">
                Description *
              </label>
              <textarea
                id="upload-description"
                name="description"
                rows={3}
                required
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide an overview of what topics and chapters this resource covers..."
                className="w-full px-4 py-3 bg-[#151A1D] border border-white/10 rounded-xl text-xs text-[#F5F5F5] placeholder:text-[#72777A] focus:border-[#DFFF00] focus:ring-1 focus:ring-[#DFFF00] focus:outline-none transition-all font-medium"
              />
            </div>
          </div>

          {/* Section 2: Academic Classification */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold text-[#DFFF00] uppercase tracking-wider">
              2. Academic Classification
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="upload-resourceType" className="block text-xs font-semibold text-[#A5A8AA] uppercase tracking-wider mb-1.5">
                  Resource Type *
                </label>
                <select
                  id="upload-resourceType"
                  name="resourceType"
                  value={formData.resourceType}
                  onChange={handleChange}
                  className="w-full px-3.5 py-3 bg-[#151A1D] border border-white/10 rounded-xl text-xs text-[#F5F5F5] focus:border-[#DFFF00] focus:ring-1 focus:ring-[#DFFF00] focus:outline-none transition-all font-medium"
                >
                  <option value="NOTES" className="bg-[#101416]">Notes</option>
                  <option value="PYQ" className="bg-[#101416]">PYQ (Previous Year Paper)</option>
                  <option value="ASSIGNMENT" className="bg-[#101416]">Assignment</option>
                  <option value="BOOK" className="bg-[#101416]">Book / Reference</option>
                  <option value="OTHER" className="bg-[#101416]">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="upload-semester" className="block text-xs font-semibold text-[#A5A8AA] uppercase tracking-wider mb-1.5">
                  Semester *
                </label>
                <select
                  id="upload-semester"
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  className="w-full px-3.5 py-3 bg-[#151A1D] border border-white/10 rounded-xl text-xs text-[#F5F5F5] focus:border-[#DFFF00] focus:ring-1 focus:ring-[#DFFF00] focus:outline-none transition-all font-medium"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option key={num} value={num} className="bg-[#101416]">
                      Semester {num}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="upload-subject" className="block text-xs font-semibold text-[#A5A8AA] uppercase tracking-wider mb-1.5">
                  Subject *
                </label>
                <input
                  id="upload-subject"
                  type="text"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g. Data Structures"
                  className="w-full px-3.5 py-3 bg-[#151A1D] border border-white/10 rounded-xl text-xs text-[#F5F5F5] placeholder:text-[#72777A] focus:border-[#DFFF00] focus:ring-1 focus:ring-[#DFFF00] focus:outline-none transition-all font-medium"
                />
              </div>

              <div>
                <label htmlFor="upload-course" className="block text-xs font-semibold text-[#A5A8AA] uppercase tracking-wider mb-1.5">
                  Course / Branch *
                </label>
                <input
                  id="upload-course"
                  type="text"
                  name="course"
                  required
                  value={formData.course}
                  onChange={handleChange}
                  placeholder="e.g. B.Tech CS"
                  className="w-full px-3.5 py-3 bg-[#151A1D] border border-white/10 rounded-xl text-xs text-[#F5F5F5] placeholder:text-[#72777A] focus:border-[#DFFF00] focus:ring-1 focus:ring-[#DFFF00] focus:outline-none transition-all font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="upload-university" className="block text-xs font-semibold text-[#A5A8AA] uppercase tracking-wider mb-1.5">
                  University / Institution
                </label>
                <input
                  id="upload-university"
                  type="text"
                  name="university"
                  value={formData.university}
                  onChange={handleChange}
                  placeholder="e.g. Delhi University"
                  className="w-full px-3.5 py-3 bg-[#151A1D] border border-white/10 rounded-xl text-xs text-[#F5F5F5] placeholder:text-[#72777A] focus:border-[#DFFF00] focus:ring-1 focus:ring-[#DFFF00] focus:outline-none transition-all font-medium"
                />
              </div>

              <div>
                <label htmlFor="upload-tags" className="block text-xs font-semibold text-[#A5A8AA] uppercase tracking-wider mb-1.5">
                  Tags (Comma separated)
                </label>
                <input
                  id="upload-tags"
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="e.g. dsa, trees, sorting"
                  className="w-full px-3.5 py-3 bg-[#151A1D] border border-white/10 rounded-xl text-xs text-[#F5F5F5] placeholder:text-[#72777A] focus:border-[#DFFF00] focus:ring-1 focus:ring-[#DFFF00] focus:outline-none transition-all font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 3: File Attachment Dropzone */}
          <div className="pt-2">
            <h3 className="text-xs font-bold text-[#DFFF00] uppercase tracking-wider mb-2">
              3. Attachment File
            </h3>
            <label htmlFor="upload-file-input" className="block text-xs font-semibold text-[#A5A8AA] mb-2">
              Select Document (Max 10 MB: PDF, DOC, DOCX, PPT, PPTX, TXT, Images)
            </label>
            <div className="border-2 border-dashed border-white/15 hover:border-[#DFFF00]/50 rounded-2xl p-6 text-center transition-all bg-[#151A1D]/60 group">
              <FileUp className="h-8 w-8 text-[#72777A] group-hover:text-[#DFFF00] mx-auto mb-2 transition-colors" />
              <input
                id="upload-file-input"
                type="file"
                required
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.webp"
                className="block w-full text-xs text-[#A5A8AA] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-extrabold file:bg-[#DFFF00]/10 file:text-[#DFFF00] hover:file:bg-[#DFFF00]/20 cursor-pointer"
              />
              {selectedFile && (
                <p className="mt-3 text-xs font-semibold text-[#DFFF00] truncate">
                  ✓ Selected: {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !selectedFile}
            className="w-full py-4 px-4 bg-[#DFFF00] text-[#050708] font-extrabold text-xs rounded-full hover:bg-[#CFFF00] disabled:opacity-50 transition-all flex items-center justify-center cursor-pointer shadow-[0_0_25px_rgba(223,255,0,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DFFF00]"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Uploading Resource to Cloudinary...
              </>
            ) : (
              'Upload Resource (+10 ⭐ Contribution Points)'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadResource;
