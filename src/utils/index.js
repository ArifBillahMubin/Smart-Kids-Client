import axios from "axios";

export const imageUpload = async imageData => {
    const fromData = new FormData();
    fromData.append('image', imageData);

    const { data } = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_API_key}`,
        fromData)

    return data?.data?.display_url
}

// save and update user in db
// export const saveOrUpdateUser = async userDta => {
//     const { data } = axios.post(`${import.meta.env.VITE_API_URL}/user`, userDta);
//     return data;
// }