import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
  })

export class PostStatut {

    constructor(private http: HttpClient) {}

    post(post: string, image: string | File) {

        return new Promise((resolve, reject) => {

            if (post === 'none' && image === 'none') return;

            const formData = new FormData();

            if (post !== 'none' && image === 'none') {
                console.log("pas d'image mais 1 post")
                formData.append('post', post);
                this.http.post('http://localhost:3000/api/actuality/post', formData).subscribe(
                    (response: { message?: string }) => {
                        resolve(response);
                    },
                    (error) => {
                        reject(error);
                    }
                );
            } else if (post === 'none' && image !== 'none') {
                console.log("pas de post mais une image")
                formData.append('image', image);
                this.http.post('http://localhost:3000/api/actuality/post', formData).subscribe(
                    (response: { message?: string }) => {
                        resolve(response);
                    },
                    (error) => {
                        reject(error);
                    }
                );

            } else {
                console.log("un post + 1 image")
                formData.append('post', post);
                formData.append('image', image);

                this.http.post('http://localhost:3000/api/actuality/post', formData).subscribe(
                    (response: { message?: string }) => {
                        resolve(response);
                    },
                    (error) => {
                        reject(error);
                    }
                );
            }

        });

    }
}