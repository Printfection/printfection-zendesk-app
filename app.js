(function() {
  return {
    order_data: null, // Placeholder for the return data of the orders ajax request
    campaign_data: null, // Placeholder for the return data of the campaigns ajax request
    selected_campaign: null, // Placeholder for choosen camapign

    events: {
      'app.activated': 'getCampaigns',
      'click #js-gift-hook' : function(event) {
        event.preventDefault();

        if (this.order_data) {
          this.showGiftCode(this.order_data);
        } else {
          this.getGift();
        }
      }
    },

    getCampaigns: function() {
      var self = this;
      var $button = this.$("button#js-gift-hook");
      var $select_campaign = this.$("select#js-campaign");
      var $select_label = this.$("#js-campaign-label");

      // If the user wants to force just one campaign (via settings) set that campaign and return
      if (this.settings.pf_force_campaign) {
        self.selected_campaign = this.settings.pf_campaign_id;
        $select_campaign.hide();
        $select_label.hide();
        return;
      }

      // We can't do Basic Auth via the Zendesk `requests` API when using {{setting.pf_api_key}}, so doing it old-school
      var ajax_request = new XMLHttpRequest();

      ajax_request.open('GET', 'https://api.printfection.com/v2/campaigns/', true);
      ajax_request.setRequestHeader('Authorization', 'Basic ' + btoa(this.settings.pf_api_key + ':'));
      ajax_request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      ajax_request.onreadystatechange = function() {
        // Quick way to verify ajax state, status, and response
        if (ajax_request.readyState != 4) return;
        if (ajax_request.status === 200) {
          var campaign_data = JSON.parse(ajax_request.responseText);

          // Assign the ajax return data to the `null` placeholder we created above
          self.campaign_data = campaign_data;
          self.showCampaigns();
        } else {
          $button.html("Request Failed...");
        }
      };
      ajax_request.send();
    },

    showCampaigns: function() {
      var self = this;
      var campaigns = self.campaign_data;
      var $select_campaign = this.$("select#js-campaign");
      var $select_campaign_option = this.$("select#js-loading-option");
      var $button = this.$("button#js-gift-hook");
      var $loading_option = this.$("#js-loading-option");
      var $choose_error = this.$("span.pf-error");

      $loading_option.text('Select a campaign...');

      // Map all campaigns to our select options for user selection
      campaigns.data.forEach(function(campaign) {
        if (
          (campaign.active === true) &&
          (campaign.type == "giveaway" || campaign.type == "socialgiveaway")
        ) {
          $select_campaign.append('<option value="' + campaign.id + '">' + campaign.name + '</option>');
        }
      });

      // If the default campaign is specified in our settigns, automatically select it
      if (this.settings.pf_campaign_id) {
        $select_campaign = this.$("select#js-campaign option[value=" + this.settings.pf_campaign_id + "]").attr('selected',true);
      }

      // When campaign is changed allow the user to generate another link
      $select_campaign.change(function(event) {
        self.selected_campaign = $select_campaign.val();
        self.order_data = null;
        $select_campaign.removeClass("error");
        $choose_error.hide();
        $button.html('Generate New Gift Link');
      });
    },

    getGift: function () {
      var self = this;
      var $button = this.$("button#js-gift-hook");
      var $select_campaign = this.$("select#js-campaign");
      var $choose_error = this.$("span.pf-error");

      // If the button is locked, it means a request is currently underway so stop here and continue to wait.
      // Otherwise, lock the button and continue to perform the ajax request.
      if ($button.data('locked')) {
        return;
      } else {
        $button.data('locked', true);
      }

      // If the user isn't forcing a campaign let's make sure they then select one
      if (!this.settings.pf_force_campaign) {
        if ($select_campaign.val() == "none") {
          $select_campaign.addClass("error");
          $choose_error.show();
          $button.data('locked', false);
          return;
        } else {
          $select_campaign.removeClass("error");
          $choose_error.hide();
        }
      }

      // We can't do Basic Auth via the Zendesk `requests` API when using {{setting.pf_api_key}}, so doing it old-school
      var ajax_request = new XMLHttpRequest();

      ajax_request.open('POST', 'https://api.printfection.com/v2/orders/', true);
      ajax_request.setRequestHeader('Authorization', 'Basic ' + btoa(this.settings.pf_api_key + ':'));
      ajax_request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      ajax_request.onreadystatechange = function() {
        // Quick way to verify ajax state, status, and response
        if (ajax_request.readyState != 4) return;
        if (ajax_request.status === 200) {
          var order_data = JSON.parse(ajax_request.responseText);

          $button.html("Show Your Gift Link");
          $button.data('locked', false); // Unlock the button

          // Assign the ajax return data to the `null` placeholder we created above
          self.order_data = order_data;
          self.showGiftCode(self.order_data);
        } else {
          $button.html("Request Failed...");
          $button.data('locked', false); // Unlock the button
        }
      };
      $button.html("Processing...");
      ajax_request.send(JSON.stringify({campaign_id: self.selected_campaign}));
    },

    showGiftCode: function(data) {
      var self = this;

      // Grab the data and throw it into our nice boostrap modal, then show that modal
      var pf_gift_url = self.order_data.url;
      var $gift_modal = this.$("#js-gift-modal");
      var $gift_code_input = this.$("#js-gift-code-input");

      $gift_code_input.attr('value',pf_gift_url);
      $gift_modal.modal('toggle');
      $gift_code_input.select();
    }
  };
}());