import axios from "axios";

const API = import.meta.env.VITE_API_URL;

// ── Image Upload (imgbb) ──
export const imageUpload = async (imageData) => {
    const formData = new FormData();
    formData.append('image', imageData);
    const { data } = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_API_key}`,
        formData
    );
    return data?.data?.display_url;
};

// ── User APIs (public) ──
export const saveUser = async (userData) => {
    const { data } = await axios.post(`${API}users`, userData);
    return data;
};

export const getUserByEmail = async (email) => {
    const { data } = await axios.get(`${API}users/${email}`);
    return data;
};

// ── Course APIs (public) ──
export const getCourses = async () => {
    const { data } = await axios.get(`${API}course`);
    return data;
};

export const getCourseById = async (id) => {
    const { data } = await axios.get(`${API}course/${id}`);
    return data;
};

// ── Enrollment & Payment APIs ──
export const enrollFree = async (enrollmentData) => {
    const { data } = await axios.post(`${API}enrollments`, enrollmentData);
    return data;
};

export const createCheckoutSession = async (info) => {
    const { data } = await axios.post(`${API}create-checkout-session`, info);
    return data;
};

export const verifyPayment = async (sessionId) => {
    const { data } = await axios.post(`${API}payment-success`, { sessionId });
    return data;
};

export const getEnrollments = async (email) => {
    const { data } = await axios.get(`${API}enrollments/${email}`);
    return data;
};

// ── Lesson APIs (public read) ──
export const getLessons = async (courseId) => {
    const { data } = await axios.get(`${API}lessons/${courseId}`);
    return data;
};

// ── Quiz APIs (public read) ──
export const getQuizByLesson = async (lessonId) => {
    const { data } = await axios.get(`${API}quizzes/${lessonId}`);
    return data;
};

// ── Cloudinary Video Upload ──
export const uploadVideoToCloudinary = async (file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    formData.append('resource_type', 'video');
    formData.append('folder', 'smartkids/videos');

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/video/upload`);

        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable && onProgress) {
                onProgress(Math.round((e.loaded / e.total) * 100));
            }
        };

        xhr.onload = () => {
            const data = JSON.parse(xhr.responseText);
            if (xhr.status === 200) resolve(data.secure_url);
            else reject(new Error(data.error?.message || 'Upload failed'));
        };

        xhr.onerror = () => reject(new Error('Network error'));
        xhr.send(formData);
    });
};

// ── Lesson Progress APIs ──
export const markLessonWatched = async (userEmail, courseId, lessonId) => {
    const { data } = await axios.post(`${API}lesson-progress/watch`, { userEmail, courseId, lessonId });
    return data;
};

export const markLessonComplete = async (userEmail, courseId, lessonId) => {
    const { data } = await axios.post(`${API}lesson-progress/complete`, { userEmail, courseId, lessonId });
    return data;
};

export const getLessonProgress = async (userEmail, courseId) => {
    const { data } = await axios.get(`${API}lesson-progress/${userEmail}/${courseId}`);
    return data;
};

// ── Quiz Result APIs ──
export const saveQuizResult = async (resultData) => {
    const { data } = await axios.post(`${API}quiz-results`, resultData);
    return data;
};

export const getQuizResults = async (userEmail, courseId) => {
    const { data } = await axios.get(`${API}quiz-results/${userEmail}/${courseId}`);
    return data;
};

// ── Review APIs ──
export const saveReview = async (reviewData) => {
    const { data } = await axios.post(`${API}reviews`, reviewData);
    return data;
};

export const getCourseReviews = async (courseId) => {
    const { data } = await axios.get(`${API}reviews/${courseId}`);
    return data;
};
