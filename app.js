(function() {
  return {
    requests: {
      var pf_campaign_id = this.settings.pf_api_key;
      var pf_api_key = this.settings.pf_api_key;

      get_pf_code: {
        url: 'https://api.printfection.com/v2/campaigns/'+pf_campaign_id,
        beforeSend: function (xhr) {
          xhr.setRequestHeader ("Authorization", "Basic " + btoa(pf_api_key+":"));
        },
        type: 'GET',
        dataType: 'json'
      }
    },
    events: {
      'click #js-zapier-hook' : function(event) {
        event.preventDefault();
        this.getGift();
      },
      'get_pf_code.done': 'showGiftCode',
      'get_pf_code.fail': 'showFailedAttempt'
    },
    getGift: function () {
      //Set up our request to get our Giveaway Link
      this.ajax('get_pf_code');
    },
    showGiftCode: function(data) {
      var pf_gift_url = data.url;

      console.log(data);
      console.log(pf_gift_url);
    },
    showFailedAttempt: function() {
      console.log('Failed Connection');
    }
  };
}());