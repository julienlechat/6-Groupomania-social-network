export class Profile {
    lastname?: string;
    firstname?: string;
    img_profil?: string;
    role!: number;
    description?: string;
    editable?: boolean;
    post?: postUser[];
  }

  export class postUser {
    id!: number;
    postId!: number;
    date?: Date;
    img?: string;
    text?: string;
    like!: number;
    dislike!: number;
    liked!: number;
    comments?: Comment[];
  }

  export class Comment {
    id!: number;
    comId!: number;
    userId!: number;
    lastname?: string;
    firstname?: string;
    img_profil?: string;
    role!: number;
    date?: Date;
    msg?: string;
  }