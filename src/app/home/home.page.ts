import { AfterViewInit, Component } from '@angular/core';
import { DataLoaderService } from "src/app/services/data-loader.service";

declare var google: any

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {

  public googleMaps: any;
  public data!: { locations: any[] };
  private directionsService = new google.maps.DirectionsService();
  private directionsDisplay = new google.maps.DirectionsRenderer();
  public origin: any;
  public destination: any;

  constructor(
    private dataLoaderService: DataLoaderService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  ngAfterViewInit() {
    this.loadMap();
  }

  loadData() {
    this.dataLoaderService.getJsonData().subscribe(
      (data) => this.data = data,
      (error) => console.error('Error loading JSON data:', error)
    );
  }

  loadMap() {
    const mapEle: HTMLElement | null = document.getElementById('map');
    const center = { lat: 3.3747832, lng: -76.533219 };

    this.googleMaps = new google.maps.Map(mapEle, {
      center: center,
      zoom: 15.4,
      mapTypeControl: false,
    });

    this.directionsDisplay.setMap(this.googleMaps);

    google.maps.event.addListenerOnce(this.googleMaps, 'idle', () => {
      mapEle?.classList.add('show-map');

      this.data.locations.forEach(location => {
        this.addMarker({
          position: {
            lat: +location.latitude,
            lng: +location.longitude,
          },
          title: location.name
        })
      });
    });

  }

  addMarker(marker: Marker) {
    return new google.maps.Marker({
      position: marker.position,
      map: this.googleMaps,
      title: marker.title
    });
  }

  calculateRoute(event: Event) {
    event.preventDefault(); 
    
    this.directionsService.route({
      origin: { lat: +this.origin.latitude, lng: +this.origin.longitude },
      destination: { lat: +this.destination.latitude, lng: +this.destination.longitude },
      travelMode: google.maps.TravelMode.WALKING ,
    }, (response: any, status: string)  => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.directionsDisplay.setDirections(response);
      } else {
        alert('Could not display directions due to: ' + status);
      }
    });
  }

}

interface Marker {
  position: {
    lat: number,
    lng: number,
  };
  title: string;
}
