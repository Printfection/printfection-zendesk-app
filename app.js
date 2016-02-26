(function() {
  return {
    data: null, // Placeholder for the return data of the ajax request

    events: {
      'click #js-gift-hook' : function(event) {
        event.preventDefault();
        if (this.data) {
          this.showGiftCode(this.data);
        } else {
          this.getGift();
        }
      }
    },

    getGift: function () {
      var self = this;
      var $button = this.$("button#js-gift-hook");

      // If the button is locked, it means a request is currently underway so stop here and continue to wait.
      // Otherwise, lock the button and continue to perform the ajax request.
      if ($button.data('locked')) {
        return;
      } else {
        $button.data('locked', true);
      }

      // We can't do Basic Auth via the Zendesk `requests` API when using {{setting.pf_api_key}}, so doing it old-school
      var ajax_request = new XMLHttpRequest();

      ajax_request.open('POST', 'https://api.printfection.com/v2/orders/', true);
      ajax_request.setRequestHeader('Authorization', 'Basic ' + btoa(this.settings.pf_api_key + ':'));
      ajax_request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      ajax_request.onreadystatechange = function() {
        // Quick way to verify ajax state, status, and response
        // console.log(ajax_request.readyState, ajax_request.status, ajax_request.responseText);

        if (ajax_request.readyState != 4) return;
        if (ajax_request.status === 200) {
          var data = JSON.parse(ajax_request.responseText);

          $button.html("Success, Gift Created!");
          $button.data('locked', false); // Unlock the button

          // Assign the ajax return data to the `null` placeholder we created above
          self.data = data;
          self.showGiftCode(self.data);
        } else {
          $button.html("Request Failed...");
          $button.data('locked', false); // Unlock the button
        }
      };
      $button.html("Processing...");
      ajax_request.send(JSON.stringify({campaign_id:this.settings.pf_campaign_id}));
    },

    showGiftCode: function(data) {
      // Grab the data and throw it into our nice boostrap modal, then show that modal
      var pf_gift_url = data.url;
      var $gift_modal = this.$("#js-gift-modal");
      var $gift_code_input = this.$("#js-gift-code-input");

      $gift_code_input.attr('value',pf_gift_url);
      $gift_modal.modal('toggle');
      $gift_code_input.select();
    }
  };
}());