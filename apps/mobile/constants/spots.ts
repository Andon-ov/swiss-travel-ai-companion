export interface Spot {
  id: string;
  name: string;
  lat: number;
  lng: number;
  isFree: boolean;
  category?: 'nature' | 'culture' | 'food' | 'viewpoint';
  shortDesc?: string;
}

export const SPOTS: Spot[] = [
  { id: 'brienz-lake', name: 'Brienzersee Lake', lat: 46.7382, lng: 8.0342, isFree: true, category: 'nature', shortDesc: 'Beautiful turquoise lake surrounded by mountains.' },
  { id: 'wood-carving-school', name: 'Holzschnitzerschule Brienz', lat: 46.7467, lng: 8.0380, isFree: true, category: 'culture', shortDesc: 'The only woodcarving school in Switzerland.' },
  { id: 'rothorn-railway', name: 'Brienz Rothorn Bahn', lat: 46.7453, lng: 8.0361, isFree: false, category: 'nature', shortDesc: 'Historic steam rack railway to the Brienzer Rothorn.' },
  { id: 'parish-church', name: 'Reformed Parish Church', lat: 46.7464, lng: 8.0356, isFree: false, category: 'culture', shortDesc: 'Historic church with a beautiful view over the village.' },
  { id: 'boat-landing', name: 'Brienz Boat Landing', lat: 46.7378, lng: 8.0344, isFree: false, category: 'nature', shortDesc: 'Gateway to boat trips on Lake Brienz.' },
  { id: 'swiss-open-air-museum', name: 'Ballenberg (near Brienz)', lat: 46.7564, lng: 8.0619, isFree: false, category: 'culture', shortDesc: 'Open-air museum showcasing Swiss rural life.' },
  { id: 'brienz-waterfall', name: 'Giessbachfälle', lat: 46.7200, lng: 8.0100, isFree: false, category: 'nature', shortDesc: 'Spectacular waterfalls cascading into Lake Brienz.' },
  { id: 'main-street', name: 'Hauptstrasse Holzschnitzerei', lat: 46.7465, lng: 8.0358, isFree: false, category: 'culture', shortDesc: 'Main street known for traditional wood carving shops.' },
  { id: 'train-station', name: 'Brienz Bahnhof', lat: 46.7459, lng: 8.0366, isFree: false, category: 'culture', shortDesc: 'Central transportation hub in Brienz.' },
  { id: 'hotel-weisses-kreuz', name: 'Historic Hotel Area', lat: 46.7463, lng: 8.0352, isFree: false, category: 'culture', shortDesc: 'Area around the historic Hotel Weisses Kreuz.' },
];
