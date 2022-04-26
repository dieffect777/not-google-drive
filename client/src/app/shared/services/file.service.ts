import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {FileI, Message} from "../interfaces";
import {share} from "rxjs/operators";


@Injectable({
  providedIn: 'root'
  })

export class FileService {
  constructor(private http: HttpClient) {
  }

  fetch(): Observable<FileI[]>{
    return this.http.get<FileI[]>('api/file')
  }

  fetchById(fileid: string): Observable<FileI>{
    return this.http.get<FileI>(`api/file/${fileid}`)
  }

  create(name: string, file: File): Observable<FileI>{
    const fd = new FormData()
    fd.append('textdoc', file)
    fd.append('name', name)
    return this.http.post<FileI>('/api/file', fd)
  }

  delete(fileid: string): Observable<Message>{
    return this.http.delete<Message>(`/api/file/${fileid}`)
  }

  addShare(sharehash: string): Observable<Message>{
    return this.http.post<Message>(`/api/file/share/add/`, sharehash)
  }

}
