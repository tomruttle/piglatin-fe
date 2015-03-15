/*global jQuery, Router */

jQuery(function ($) {

  'use strict';

  var ENTER_KEY = 13;
  var MAX_ITEMS = 5;
  var API_URL = 'http://localhost:3000/convert';

  var App = {

    store: function (data) {
      if (arguments.length) {
        return localStorage.setItem('converted-words', JSON.stringify(data));
      } else {
        var store = localStorage.getItem('converted-words');
        return (store && JSON.parse(store)) || [];
      }
    },

    init: function () {

      this.history = this.store();

      $('#piglatinapp')
        .find('#convert-word')
        .on('keyup', this.convert.bind(this));

      this.render();

    },

    convert: function (e) {

      var $input = $(e.target);
      var val = $input.val().trim();

      if (e.which !== ENTER_KEY || !val) {
        return;
      }

      this.convertAction(val, this.addToList.bind(this));

      $input.val('');

      this.render();

    },

    render: function () {
      $('#piglatinapp').find('#word-list').html(this.history.join('\n'));
      $('#piglatinapp').find('#convert-word').focus();
      this.store(this.history);
    },

    convertAction: function (val, callback) {
      $.ajax({ url: API_URL + '/' + val, success: callback });
    },

    addToList: function(data) {
      if (this.history.length >= MAX_ITEMS) {
        this.history.shift();
      }
      this.history.push('<li>' + data + '</li>');
    }

  };

  App.init();

});
