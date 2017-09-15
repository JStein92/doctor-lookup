var apiKey = require('./../.env').apiKey;

$(function(){

  $('#doctorSearch').submit(function(event) {
    event.preventDefault();

    const location = $('#location').val();
    $('#location').val("");
    const issue = $('#issue').val();
    $('#issue').val("");
    const name = $('#name').val();
    $('#name').val("");

    console.log(name);

    let doctorPromise = new Promise(function(resolve, reject) {
      let request = new XMLHttpRequest();
      let url = `https://api.betterdoctor.com/2016-03-01/doctors?name=${name}&query=${issue}&location=${location}%2C100&user_location=${location}&skip=0&limit=10&user_key=${apiKey}`;
      request.onload = function() {
        if (this.status === 200) {
          resolve(request.response);
        } else {
          reject(Error(request.statusText));
        }
      }
      request.open("GET", url, true);
      request.send();
    });

    doctorPromise.then(function(response) {
      let body = JSON.parse(response);
      $('#output').text('');

      for (let i = 0; i < 10; i++) {
        $('#output').append(`<div class="panel panel-default">
        <div class="panel-heading"><img src = '${body.data[i].profile.image_url}'> ${body.data[i].profile.first_name} ${body.data[i].profile.last_name}</div>
        <ul class='well'>
          <li>Practice: ${body.data[i].practices[0].name}</li>
          <li>Address: ${body.data[i].practices[0].visit_address.street}, ${body.data[i].practices[0].visit_address.city}, ${body.data[i].practices[0].visit_address.state}, ${body.data[i].practices[0].visit_address.zip} (${body.data[i].practices[0].distance.toFixed(1)} miles away)</li>
          <li>Phone: ${body.data[i].practices[0].phones[0].number}</li>
          <li>Seeing new Patients: ${body.data[i].practices[0].accepts_new_patients}</li>
        </ul>
        <div class="panel-body">${body.data[i].profile.bio}
        <p><a href ='${body.data[i].practices[0].website}'>Website</a></p>
        </div>


        </div>`)
      }



    }, function(error) {
      $('.output').text(`There was an error! ${error.message}` )
    });
  });

});
