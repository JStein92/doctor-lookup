var apiKey = require('./../.env').apiKey;

export class DoctorSearch{

  specialtiesPromise(){
    //console.log("specialtiesPromise");
    let specialtiesPromise = new Promise(function(resolve,reject) {
      let request = new XMLHttpRequest();
      let url = `https://api.betterdoctor.com/2016-03-01/specialties?user_key=52a4cf3636d01cce01490a71826ff36d`;
      request.onload = function() {
        if (this.status === 200) {
          //console.log("specialtiesPromise 200");
          resolve(request.response);
        } else {
          //console.log("specialtiesPromise fail");
          reject(Error(request.statusText));
        }
      };
      request.open("GET", url, true);
      request.send();
    });

    specialtiesPromise.then(function(response){
      let body = JSON.parse(response);
      for (var i = 0; i < body.data.length; i++) {
          $('#specialtiesOutput').append(`<option>${body.data[i].name}</option>`);
      }

    }, function(error){
      $('.output').text(`Error getting specialities! ${error.message}`);
    });
  }

  doctorPromise(lat,lng,issue,name, specialities){
    //console.log("doctor promise");
    let doctorPromise = new Promise(function(resolve, reject) {
      //console.log('start d prom');
      let request = new XMLHttpRequest();
      let url = `https://api.betterdoctor.com/2016-03-01/doctors?name=${name}&query=${issue}&specialty_uid=${specialities}&location=${lat}%2C${lng}%2C100&user_location=${lat}%2C${lng}&skip=0&limit=10&user_key=${apiKey}`;
      request.onload = function() {
        if (this.status === 200) {
          //console.log('doctor promise 200');
          resolve(request.response);
        } else {
          //console.log('doctor promise fail');
          reject(Error(request.statusText));
        }
      };
      request.open("GET", url, true);
      request.send();
    });

    doctorPromise.then(function(response) {
      //console.log("doctor promise then");
      let body = JSON.parse(response);
      $('#output').text('');
      if (!body.data[0]){
          $('#output').append('Sorry, no doctors found with this criteria.');
      } else {
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
          </div>`);
        }
      }

    }, function(error) {
      $('.output').text(`There was an error! ${error.message}` );
    });
  }

  search(location,issue,name){
    let that = this;
    let geocodePromise = new Promise(function(resolve,reject) {
      let request = new XMLHttpRequest();
      let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=AIzaSyCb6dVjdFRMlWrdvAYe59yM3H8uedeWg10`;
      request.onload = function() {
        if (this.status === 200) {
          resolve(request.response);
        } else {
          reject(Error(request.statusText));
        }
      };
      request.open("GET", url, true);
      request.send();
    });

    geocodePromise.then(function(response){
      let body = JSON.parse(response);
      let lat = body.results[0].geometry.location.lat;
      let lng = body.results[0].geometry.location.lng;
      that.doctorPromise(lat,lng,issue,name);
      //console.log(body.results[0].geometry.location.lat + " " + body.results[0].geometry.location.lng);
    }, function(error){
      $('.output').text(`Could not parse address! ${error.message}`);
    });


  }
}
