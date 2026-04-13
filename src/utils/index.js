import axios from "axios";

const API = import.meta.env.VITE_API_URL;

// Upload image to imgbb
export const imageUpload = async (imageData) => {
    const formData = new FormData();
    formData.append('image', imageData);
    const { data } = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_API_key}`,
        formData
    );
    return data?.data?.display_url;
};

// ── User APIs ──

// Save user to DB (called on register/google login)
export const saveUser = async (userData) => {
    const { data } = await axios.post(`${API}users`, userData);
    return data;
};

// Get user by email (to check role)
export const getUserByEmail = async (email) => {
    const { data } = await axios.get(`${API}users/${email}`);
    return data;
};

// ── Course APIs ──

export const getCourses = async () => {
    const { data } = await axios.get(`${API}course`);
    return data;
};

export const getCourseById = async (id) => {
    const { data } = await axios.get(`${API}course/${id}`);
    return data;
};

export const addCourse = async (courseData) => {
    const { data } = await axios.post(`${API}courses`, courseData);
    return data;
};

export const updateCourse = async (id, courseData) => {
    const { data } = await axios.put(`${API}course/${id}`, courseData);
    return data;
};

export const deleteCourse = async (id) => {
    const { data } = await axios.delete(`${API}course/${id}`);
    return data;
};

// ── Enrollment & Payment APIs ──

// Free course — direct enrollment
export const enrollFree = async (enrollmentData) => {
    const { data } = await axios.post(`${API}enrollments`, enrollmentData);
    return data;
};

// Paid course — create Stripe checkout session
export const createCheckoutSession = async (info) => {
    const { data } = await axios.post(`${API}create-checkout-session`, info);
    return data;
};

// After Stripe redirect — verify payment & save enrollment
export const verifyPayment = async (sessionId) => {
    const { data } = await axios.post(`${API}payment-success`, { sessionId });
    return data;
};

// Get all enrollments for a user
export const getEnrollments = async (email) => {
    const { data } = await axios.get(`${API}enrollments/${email}`);
    return data;
};
