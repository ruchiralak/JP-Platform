// src/utils/redirect.js

export const getRedirectPath = (userType) => {
    switch (userType) {
        case "admin":
            return "/adminDash";
        case "jobSeeker":
            return "/jobseeker";
        case "employer":
            return "/employer";
        default:
            return "/login";
    }
};
