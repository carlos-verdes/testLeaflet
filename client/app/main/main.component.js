import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';


var SourceColor = 'blue';
var TargetColor = 'red';


var sourceMoreThan10 = {
  file: 'commuting-feb-2016-differentCommunities-wgs-more-than-10.json',
  sum: 1136370,
  count: 19146,
  min: 51,
  max: 5057};

var sourceMoreThan20 = {
  file: 'commuting-feb-2016-differentCommunities-wgs-more-than-20.json',
  sum: 1018991,
  count: 11108,
  min: 51,
  max: 5057
};

var sourceMoreThan50 = {
  file: 'commuting-feb-2016-differentCommunities-wgs-more-than-50.json',
  sum: 821456,
  count: 4882,
  min: 51,
  max: 5057
};

var sourceAirportDubai = {
  file: 'commuting-airport-dubai-only.json',
  sum: 821456,
  count: 461,
  min: 11,
  max: 1672
};

var sourceAirportDubaiHome = {
  file: 'commuting-airport-dubai-home.json',
  sum: 821456,
  count: 461,
  min: 11,
  max: 1672
};

var sourceAirportDubaiWork = {
  file: 'commuting-airport-dubai-work.json',
  sum: 821456,
  count: 461,
  min: 11,
  max: 1672
};


var minJourneyWeigth = 1;
var maxJourneyWeigth = 60;

var showZones = false;

var AbuDabhiBounds = [[24.619602, 54.153324],[24.259533, 54.830351]]
var DubaiBounds = [[25.314461, 55.042603],[24.983172, 55.567200]];
var testBounds = [[25.104875594635896, 55.1872444152832], [25.066630150515678, 55.25693893432617]];
var mapBounds = DubaiBounds;

var sourceFile = sourceAirportDubai;

export class MainController {

  awesomeThings = [];
  newThing = '';


  SourceLayer = L.geoJson(null, {
    style: function(feature) {
      return {
        color: SourceColor,
        opacity: 0.1,
        weight: 1
      }
    }
  });

  TargetLayer = L.geoJson(null, {
    // http://leafletjs.com/reference.html#geojson-style
    style: function(feature) {
      return { 
        color: TargetColor,
        opacity: 0.1,
        weight: 1 };
    }
  });



  Thunderforest_Transport = L.tileLayer('http://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey={apikey}', {
    attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
    apikey: 'dd8fdee3d2c340c9b57572b8429af3eb'
  });

  Thunderforest_TransportDark = L.tileLayer('http://{s}.tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png?apikey={apikey}', {
    attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
    apikey: 'dd8fdee3d2c340c9b57572b8429af3eb'
  });

  OpenStreetMap = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY3ZlcmRlcyIsImEiOiJjaXVzOWlvNHUwMDBlMnhwZmsyd3VheWEwIn0.cGGgv2UDce4l9bbUf29Clg', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    accessToken: 'pk.eyJ1IjoiY3ZlcmRlcyIsImEiOiJjaXVzOWlvNHUwMDBlMnhwZmsyd3VheWEwIn0.cGGgv2UDce4l9bbUf29Clg'
  });
  OpenStreetMapLight = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY3ZlcmRlcyIsImEiOiJjaXVzOWlvNHUwMDBlMnhwZmsyd3VheWEwIn0.cGGgv2UDce4l9bbUf29Clg', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    accessToken: 'pk.eyJ1IjoiY3ZlcmRlcyIsImEiOiJjaXVzOWlvNHUwMDBlMnhwZmsyd3VheWEwIn0.cGGgv2UDce4l9bbUf29Clg'
  });

  CartoDB_DarkMatter = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
    subdomains: 'abcd',
    maxZoom: 19
  });

  Stamen_Toner = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.{ext}', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 20,
    ext: 'png'
  });

  mymap = {};
  commuting = [];
  geometries = {};
  weightOffset = 0;


  /*@ngInject*/
  constructor($http, $scope) {
    this.$http = $http;

    $scope.journeyIndex = 0;

    $scope.drawCurrentCommute = () => {
      this.drawCommute(this.commuting[$scope.journeyIndex])
    }

  }

  $onInit() {


    this.mymap = L.map('mapid', {
      inertia: false
    }).fitBounds(mapBounds, { padding: [10, 50] });
    //this.Stamen_Toner.addTo(this.mymap);

    console.log(this.mymap);

    var map = this.mymap;
    
    
    map.createPane('labels');
    map.getPane('labels').style.zIndex = 650;
    map.getPane('labels').style.pointerEvents = 'none';

    var positron = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png', {
        attribution: '©OpenStreetMap, ©CartoDB'
      }).addTo(map);
    
    var positronLabels = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}.png', {
            attribution: '©OpenStreetMap, ©CartoDB',
            pane: 'labels'
    }).addTo(map);
    
    


    this.$http.get('/api/things')
      .then(response => {
        this.awesomeThings = response.data;
      });

    var uri = '/assets/'+sourceFile.file;
  
    console.log('loading commuting');
    this.$http({'url': uri, 'method': 'get', 'timeout': 99999})
      .then(response => {

        
        console.log('commuting query response', response);
        this.commuting = response.data;
        console.log('commuting loaded', this.commuting.length);

        
        for(var commute of this.commuting){
          this.drawCommute(commute);
        }
        
        

        
      

      /*
      var line = this.generateGradientCurve([[25.104875594635896, 55.1872444152832],[25.104875594635896, 55.25693893432617],[25.066630150515678, 55.25693893432617], [25.066630150515678, 55.1872444152832],[25.104875594635896, 55.1872444152832]]);
      line.addTo(this.mymap);
      */
      
      /*
      
      var arc1 = this.generateGradientCurve([[25.104875594635896, 55.1872444152832],[25.104875594635896, 55.25693893432617]]);
      arc1.addTo(this.mymap);
      
      var arc2 = this.generateGradientCurve([[25.104875594635896, 55.25693893432617], [25.066630150515678, 55.25693893432617]]);
      arc2.addTo(this.mymap);
      
      
      var arc2_2 = this.generateGradientCurve([[25.104875594635895, 55.26002883911133], [25.066630150515678, 55.25693893432617]]);
      arc2_2.addTo(this.mymap);
      

      var arc3 = this.generateGradientCurve([[25.066630150515678, 55.25693893432617], [25.066630150515678, 55.1872444152832]]);
      arc3.addTo(this.mymap);

      var arc4 = this.generateGradientCurve([[25.066630150515678, 55.1872444152832], [25.104875594635896, 55.1872444152832]]);
      arc4.addTo(this.mymap);
      
      var arc5 = this.generateGradientCurve([[25.104875594635896, 55.1872444152832], [25.066630150515678, 55.25693893432617]]);
      arc5.addTo(this.mymap);
      
      var arc6 = this.generateGradientCurve([[25.066630150515678, 55.1872444152832], [25.104875594635896, 55.25693893432617]]);
      arc6.addTo(this.mymap);
        */
 
      /*
      var arc7 = generateGradientCurve([[25.10394292113994, 55.190935134887695 ], [25.0958594528971, 55.2077579498291] ]);
      arc7.addTo(this.mymap);
      */

        //this.drawCommute(this.commuting[1]);
        //this.drawCommute(this.commuting[3]);

      });
  }

  generateGradientCurve(coords, curveWeigth){
    var coords1InPixels = this.mymap.latLngToLayerPoint(coords[0]);

    var x1 =  coords[0][1] < coords[1][1] ? 0 : 1;
    var y1 =  coords[0][0] < coords[1][0] ? 1 : 0;

    var coords2InPixels = this.mymap.latLngToLayerPoint(coords[1]);
    var x2 =  coords[0][1] < coords[1][1] ? 1 : 0;
    var y2 =  coords[0][0] < coords[1][0] ? 0 : 1;
    

    // vertical 
    if(coords[0][1] === coords[1][1]){
      x1 = 0;
      x2 = 0;
    //horizontal
    } else if(coords[0][0] === coords[1][0])  {
      y1 = 0;
      y2 = 0;
    }


    console.log('generateGradientCurve', x1, x2, y1, y2);
    console.log('canvas coords', coords1InPixels, coords2InPixels);


    //control point
    var segmentFunction = new L.LinearFunction(coords[0], coords[1]);
    var offset1 = segmentFunction.getPointAtPercent(0.5);
    console.log('offset:', offset1);


    var auxLineOptions = {color: 'green', weight: curveWeigth || 10};
    var auxLine = new L.ArcedPolyline(coords, auxLineOptions);
    

    var arcOptions = {
      //distanceToHeight: new L.LinearFunction([0, 0], [4000, 400]),
      color: 'green',
      weight: curveWeigth || 10,
      opacity: 1,
     
      gradient: {
        vector: [[x1, y1] , [x2, y2]],
        //vector: [['0%', '0%'], ['100%', '100%']],
        //vector: [[centroid1.getBounds().getNorthWest(), centroid2.getBounds().getNorthWest()]],
        stops: [{
            offset: '0%',
            style: { color: SourceColor, opacity: 1}
          }, {
            offset: '20%',
            style: { color: '#FFF', opacity: 0.09 }
          }, {
            offset: '80%',
            style: { color: '#FFF', opacity: 0.09 }
          }, {
            offset: '100%',
            style: { color: TargetColor, opacity: 1 }
        }]}
      };


      var arc = new L.ArcedPolyline(coords, arcOptions);
    return arc;

  }

  getGeometry(commute, homeOrWork){
    /*var zoneId = homeOrWork ? commute.homeCode : commute.workCode;

    if (!this.geometries[zoneId]){
      var wkt = homeOrWork ? commute.homeGeom : commute.workGeom;
      var layerStyle = homeOrWork ? this.SourceLayer : this.TargetLayer;
      this.geometries[zoneId] = omnivore.wkt.parse(wkt, null, layerStyle);
    }

    return this.geometries[zoneId];*/
    var wkt = homeOrWork ? commute.homeGeom : commute.workGeom;
    var layerStyle = homeOrWork ? this.SourceLayer : this.TargetLayer;
    
    return omnivore.wkt.parse(wkt, null, layerStyle);
  }

  drawCommute(commute){
    //console.log('drawing commute', commute);

    
    if(showZones){
      var zone1 = this.getGeometry(commute, true);
      var zone2 = this.getGeometry(commute, false);

      //console.log('zone1: ', zone1);
      zone1.addTo(this.mymap);
      zone2.addTo(this.mymap);
    }
    

    var journey = this.drawJourney(commute.homeCentroid, commute.workCentroid, commute.journeys);

    //this.mymap.setView(journey.getBounds().getCenter(), 12);          
  }

  drawJourney(centroidWkt1, centroidWkt2, journeys){
    //console.log("centroidWkt1: ", centroidWkt1);
    //console.log("centroidWkt2: ", centroidWkt2);
    var centroid1 = omnivore.wkt.parse(centroidWkt1);
    var centroid2 = omnivore.wkt.parse(centroidWkt2);


    var coords = [[centroid1.getBounds().getNorthWest().lat, centroid1.getBounds().getNorthWest().lng],
          [centroid2.getBounds().getNorthWest().lat, centroid2.getBounds().getNorthWest().lng]];




    var rescaleFactor = (maxJourneyWeigth - minJourneyWeigth) / (sourceFile.max - sourceFile.min)
    var journeyWeigth = ((journeys - sourceFile.min) * rescaleFactor) + minJourneyWeigth;
    //console.log('journeyWeigth: ',journeys, journeyWeigth);

    var arcedPolyline = this.generateGradientCurve(coords, journeyWeigth);
    arcedPolyline.addTo(this.mymap);



    return arcedPolyline;
  }

  addThing() {
    if(this.newThing) {
      this.$http.post('/api/things', {
        name: this.newThing
      });
      this.newThing = '';
    }
  }

  deleteThing(thing) {
    this.$http.delete(`/api/things/${thing._id}`);
  }
}

export default angular.module('testLeafletApp.main', [uiRouter])
  .config(routing)
  .component('main', {
    template: require('./main.pug'),
    controller: MainController
  })
  .name;
