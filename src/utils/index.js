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

// Get all courses
export const getCourses = async () => {
    const { data } = await axios.get(`${API}course`);
    return data;
};

// Get single course by id
export const getCourseById = async (id) => {
    const { data } = await axios.get(`${API}course/${id}`);
    return data;
};

// Add new course
export const addCourse = async (courseData) => {
    const { data } = await axios.post(`${API}courses`, courseData);
    return data;
};

// Update course by id
export const updateCourse = async (id, courseData) => {
    const { data } = await axios.put(`${API}course/${id}`, courseData);
    return data;
};

// Delete course by id
export const deleteCourse = async (id) => {
    const { data } = await axios.delete(`${API}course/${id}`);
    return data;
};
