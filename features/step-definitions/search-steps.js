'use strict';

let { When, Then } = require('cucumber');
let { By, until, Key } = require('selenium-webdriver');
let { expect } = require('chai');


When('jag klickar på {string}', function (click_button, next) {
  this.driver.get('http://localhost/arbetsannonser/#');

  this.driver.findElement(By.name('readMoreButton'))
    .click();

  this.driver.findElement(By.name('readMoreButton'))
    .click()
    .then(function() {
      next();
    });
});

Then('borde jag se annonsdetaljer', function (next) {
  this.driver.wait(until.elementLocated(By.id('main-view')));
  
  this.driver.findElements(By.id('main-view'))
    .then(function(elements) {
      expect('main-view').to.have.class('hidden');
      next();
    });
});