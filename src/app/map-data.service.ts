import { Injectable } from '@angular/core';
import { Locations } from './model/locationlisting';

@Injectable({
  providedIn: 'root'
})
export class MapDataService {

    museums: [];
    locations: Locations;
  
    constructor() { }

    setMuseums(data) {
        this.locations = data;
      }
    
      getMuseums() {
        return this.locations;
      }
    
      setMuseum(data) {
        this.locations = data;
      }
    
      getMuseum() {
        return this.locations;
      }
   
  }
