import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
  })

export class SettingService {

constructor(private http: HttpClient) {}

    post(desc: string, password: string, image: File) {
        return new Promise((resolve, reject) => {
            console.log(desc, password, image)
                
            if (!desc && !password && !image) return reject("Vous n'avez à mettre à jour.")

            const formData = new FormData();

            if (desc) formData.append('description', desc)
            if (password) formData.append('password', password);
            if (image) formData.append('image', image);

            this.http.post('http://localhost:3000/api/profile/setting', formData).subscribe(
                    (res: { message?: string }) => {
                        resolve(res);
                    },
                    (error) => {
                        reject(error);
                    }
                );
        });

    }
}