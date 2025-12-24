import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WebsitePreviewResponse } from '../models/analysis.model';

@Injectable({
    providedIn: 'root'
})
export class PreviewService {
    private readonly API_BASE_URL = 'http://localhost:8000';

    constructor(private http: HttpClient) { }

    /**
     * Get safe preview of a website without visiting it directly
     */
    previewWebsite(url: string): Observable<WebsitePreviewResponse> {
        const payload = { url };
        return this.http.post<WebsitePreviewResponse>(
            `${this.API_BASE_URL}/preview/website`,
            payload
        );
    }
}
