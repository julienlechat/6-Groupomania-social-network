import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
  })

export class PostStatut {

    constructor(private http: HttpClient) {}

    post(post: string, image: File) {
        return new Promise((resolve, reject) => {
            if (post === null && image === null) return reject({error: 'Votre publication est vide'})

            const formData = new FormData();

            if (post && !image) {
                formData.append('post', post);
            } else if (!post && image) {
                formData.append('image', image);
            } else {
                formData.append('post', post);
                formData.append('image', image);
            }

            this.http.post('http://localhost:3000/api/actuality/post', formData).subscribe(
                    (res: { message?: string }) => {
                        resolve(res);
                    },
                    (error) => reject(error)
                );
        });

    }
}