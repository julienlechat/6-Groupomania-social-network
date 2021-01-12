export class Comment {
  userId?: number;
  lastname?: string;
  firstname?: string;
  img_profil?: string;
  date?: Date;
  msg?: string;
}

export class Actuality {
    id!: number;
    postId!: number;
    lastname?: string;
    firstname?: string;
    img_profil?: string;
    date?: Date;
    img?: string;
    text?: string;
    editable?: boolean;
    like!: number;
    dislike!: number;
    liked!: number;
    comments?: [Comment];
  }