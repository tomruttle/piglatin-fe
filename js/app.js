/*global jQuery*/

jQuery(function ($) {

  'use strict';

  var ENTER_KEY = 13;
  var MAX_ITEMS = 5;
  var API_URL = 'http://178.62.17.38:3000/convert';

  var App = {

    store: function (data) {
      if (data) {
        return localStorage.setItem('converted-words', JSON.stringify(data));
      } else {
        var store = localStorage.getItem('converted-words');
        return (store && JSON.parse(store)) || [];
      }
    },

    init: function () {

      this.history = this.store();

      this.$plapp = $('#piglatinapp');
      this.$plform = this.$plapp.find('#piglatinform');
      this.$input = this.$plform.find('#convert-word');
      this.$list = this.$plapp.find('#history').find('#word-list');
      this.$empty = this.$plapp.find('#delete-all');

      this.$plform.submit(this.submitForm.bind(this));
      this.$empty.on('click', this.deleteAll.bind(this));

      this.render();

    },

    submitForm: function (e) {
      e.preventDefault();
      var val = this.$input.val().trim();
      this.convertAction(val, this.addToList.bind(this));
      this.$input.val('');
    },

    render: function () {
      this.$list.html(this.history.join('') || 'You haven\'t entered anything yet!');
      this.$input.focus();
      this.store(this.history);
    },

    convertAction: function (val, callback) {
      $.ajax({
        url: API_URL + '/' + val,
        success: function (data) { callback(val, data); }
      });
    },

    addToList: function(val, data) {
      if (this.history.length >= MAX_ITEMS) {
        this.history.pop();
      }
      this.history.unshift('<li>' + val + ' → ' + data + '</li>');
      this.render();
    },

    deleteAll: function (e) {
      e.preventDefault();
      this.history = [];
      this.render();
    }

  };

  App.init();

});
