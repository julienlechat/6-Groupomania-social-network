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

export class Actuality {
    id!: number;
    postId!: number;
    userid!: number;
    lastname?: string;
    firstname?: string;
    img_profil?: string;
    role!: number;
    date?: Date;
    img?: string;
    text?: string;
    editable?: boolean;
    like!: number;
    dislike!: number;
    liked!: number;
    comments?: [Comment];
  }