export interface User{
    _id: string;
    userName: string;
    email: string;
    password: string;
    profilePicture: string;
    Bio: string;
    followers: string[];
    following: string[];
    posts:  Post[];
    savedPosts: string[] | Post[];
    isVerified: boolean;
}

export interface Comment {
    _id: string;
    text: string;
    user: {
        _id: string;
        userName: string;
        profilePicture: string;
        Bio?: string;
    };
    post: string;
    createdAt: string;
}

export interface Post {
    _id: string;
    caption: string;
    image: {
        url : string;
        publicId: string;
    };
    user: {
        _id: string;
        userName: string;
        profilePicture: string;
        Bio?: string;
    };
    likes: string[];
    comments: Comment[];
    createdAt: string;
}