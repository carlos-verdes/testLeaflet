'use strict';

import angular from 'angular';
// import ngAnimate from 'angular-animate';
import ngCookies from 'angular-cookies';
import ngResource from 'angular-resource';
import ngSanitize from 'angular-sanitize';

import uiRouter from 'angular-ui-router';
import uiBootstrap from 'angular-ui-bootstrap';
// import ngMessages from 'angular-messages';


import {
  routeConfig
} from './app.config';

import navbar from '../components/navbar/navbar.component';
import footer from '../components/footer/footer.component';
import main from './main/main.component';
import constants from './app.constants';
import util from '../components/util/util.module';

import './app.scss';

//leaflet
import leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';
import leafletDvf from 'leaflet-dvf';
import leafletHotline from 'leaflet-hotline';

//bezier
import bezier from 'bezier';

angular.module('testLeafletApp', [ngCookies, ngResource, ngSanitize, uiRouter, uiBootstrap, navbar,
  footer, main, constants, util
]).config(routeConfig);

angular.element(document)
  .ready(() => {
    angular.bootstrap(document, ['testLeafletApp'], {
      strictDi: true
    });
  });
